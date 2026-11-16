// Yalnizca ayrilmis test Atlas veritabanina karsi calistirin.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import {featureAcceptance} from './feature-acceptance.mjs';
import {securityAiAcceptance} from './security-ai-acceptance.mjs';
import {privacyVersion} from '../../shared/privacy-notice.js';
const base=process.env.API_URL||'http://api:3000/api';
const tag=randomBytes(5).toString('hex');let count=0;
function actor(){let cookie='';return async(path,body,method,expected=200,extraHeaders={})=>{
 if(path==='/auth/login')body={privacyAccepted:true,privacyVersion,...body};
 const r=await fetch(base+path,{method:method||(body?'POST':'GET'),headers:{'Content-Type':'application/json','X-ERP-Request':'1',...(cookie?{cookie}:{}),...extraHeaders},...(body?{body:JSON.stringify(body)}:{})});
 const set=r.headers.get('set-cookie');if(set)cookie=set.split(';')[0];const data=await r.json();assert.equal(r.status,expected,`${path}: ${JSON.stringify(data)}`);count++;return data;
};}
const admin=actor();
await admin('/auth/login',{privacyAccepted:false},'POST',400);
await admin('/auth/login',{privacyAccepted:'true'},'POST',400);
await admin('/auth/login',{privacyVersion:'old'},'POST',409);
await admin('/auth/me',undefined,'GET',401);
await admin('/auth/login',{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD});
const create=(m,d)=>admin('/records/'+m,d,'POST',201);
const act=(m,id,action,version,expected=200)=>admin(`/records/${m}/${id}/actions/${action}`,{version},'POST',expected);
const get=(m,id)=>admin(`/records/${m}/${id}`);
const p=await create('products',{name:`Test urun ${tag}`,sku:`TEST-${tag}`,price:'25.50',cost:'10.00',taxRate:20,quantity:9999});
assert.equal(p.data.quantity,0);
const contact=await create('contacts',{name:`Test cari ${tag}`,kind:'both'});
const order=(qty,price)=>({name:`Test ${tag}`,partnerId:contact._id,lines:[{productId:p._id,quantity:qty,unitPrice:price,taxRate:20}]});
const po=await create('purchases',order(10,'10.00'));
await act('purchases',po._id,'receive',1,409); // onay atlanamaz
await act('purchases',po._id,'confirm',1);
// Eszamanli iki kabulden yalnizca biri basarili olmali.
const outcomes=await Promise.allSettled([act('purchases',po._id,'receive',2),act('purchases',po._id,'receive',2)]);
assert.equal(outcomes.filter(r=>r.status==='fulfilled').length,1);
assert.equal((await get('products',p._id)).data.quantity,10);
const bill=await act('purchases',po._id,'bill',3);await act('invoices',bill.linkedId,'post',1);await act('invoices',bill.linkedId,'pay',2);
const so=await create('sales',order(3,'25.50'));await act('sales',so._id,'confirm',1);await act('sales',so._id,'deliver',2);
assert.equal((await get('products',p._id)).data.quantity,7);
const inv=await act('sales',so._id,'invoice',3);const invoice=await get('invoices',inv.linkedId);assert.equal(invoice.data.total,9180);
await act('invoices',inv.linkedId,'post',1);await act('invoices',inv.linkedId,'pay',2);await act('invoices',inv.linkedId,'pay',3,409);
const tooMany=await create('sales',order(8,'25.50'));await act('sales',tooMany._id,'confirm',1);await act('sales',tooMany._id,'deliver',2,409);
assert.equal((await get('products',p._id)).data.quantity,7);assert.equal((await get('sales',tooMany._id)).state,'confirmed');
// Ilk urun hareketi de, ikinci urun yetersizse transaction ile geri alinmali.
const p2=await create('products',{name:`Bos urun ${tag}`,sku:`EMPTY-${tag}`,price:1,cost:1,taxRate:0});
const multi=await create('sales',{...order(1,'1.00'),lines:[{productId:p._id,quantity:1,unitPrice:1,taxRate:0},{productId:p2._id,quantity:1,unitPrice:1,taxRate:0}]});
await act('sales',multi._id,'confirm',1);await act('sales',multi._id,'deliver',2,409);assert.equal((await get('products',p._id)).data.quantity,7);
const reversal=await create('invoices',{...order(1,'12.00'),kind:'customer'});await act('invoices',reversal._id,'post',1);await act('invoices',reversal._id,'reverse',2);
await admin('/records/journal',{name:'Sahte'},'POST',403);await admin('/records/inventory',{quantity:99},'POST',403);
const pass='Acceptance-'+randomBytes(16).toString('hex');
const saleUser=await admin('/admin/users',{name:'Sales Test',email:`sale-${tag}@test.invalid`,password:pass,roles:['sales']},'POST',201);
const sales=actor();await sales('/auth/login',{email:saleUser.email,password:pass});await sales('/records/invoices',undefined,'GET',403);await sales('/records/employees',undefined,'GET',403);await sales('/admin/users',undefined,'GET',403);
const pending=await sales('/records/sales',order(1,'1.00'),'POST',201);await sales(`/records/sales/${pending._id}/actions/confirm`,{version:1});await sales(`/records/sales/${pending._id}/actions/deliver`,{version:2},'POST',403);
await admin(`/admin/users/${saleUser.id}`,{active:false,authzVersion:saleUser.authzVersion},'PATCH');await sales('/auth/me',undefined,'GET',401);
const journals=await admin('/records/journal');for(const j of journals.items)assert.equal(j.data.lines.reduce((s,l)=>s+l.debit-l.credit,0),0);
const logs=await admin('/admin/audit');assert.ok(logs.some(l=>l.event==='workflow'&&l.details.id===so._id));assert.ok(logs.some(l=>l.event==='demo_login_consent'&&l.details.version===privacyVersion));
await featureAcceptance({admin,create,act,get,tag,contact});
await securityAiAcceptance({admin,actor,tag});
console.log(`PASS: ${count} HTTP kontrolu; cekirdek ve genisletilmis modul kabul senaryolari.`);
