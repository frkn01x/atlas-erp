import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseMissingPayment,markLatePayment} from '../src/payment-release.js';

function fixture(status='pending'){
 const state={p:{_id:'payment',companyId:'tenant-a',module:'ecommerce',orderId:'order',status},order:{_id:'order',companyId:'tenant-a',module:'ecommerce',state:'awaiting_payment',version:1,data:{stockReserved:true,lines:[{productId:'product',quantity:1}]}},reserved:1,audits:[]};
 const match=(row,q)=>row&&Object.entries(q).every(([k,v])=>row[k]===v);
 const update=(row,u)=>{for(const [k,v]of Object.entries(u.$set||{})){if(k.startsWith('data.'))row.data[k.slice(5)]=v;else row[k]=v;}for(const k of Object.keys(u.$unset||{}))delete row[k];if(u.$inc?.version)row.version+=u.$inc.version;};
 const payments={findOne:async q=>match(state.p,q)?structuredClone(state.p):null,updateOne:async(q,u)=>{if(match(state.p,q))update(state.p,u);}};
 const records={findOne:async q=>match(state.order,q)?structuredClone(state.order):null,updateOne:async(q,u)=>{if(match(state.order,q))update(state.order,u);}};
 const audit=async(...args)=>state.audits.push(args);
 const deps={paymentId:'payment',payments,records,transaction:async fn=>{const before=structuredClone(state);try{return await fn({});}catch(e){Object.assign(state,before);throw e;}},reservation:async(company,lines,warehouse,sign)=>{assert.equal(company,'tenant-a');state.reserved+=lines[0].quantity*sign;},audit,objectId:v=>v,actor:companyId=>({_id:'commerce',companyId})};
 return {state,deps,payments,audit};
}
test('5122 releases only once, cancels order and retains payment reference for late callbacks',async()=>{
 const f=fixture();await releaseMissingPayment(f.deps);await releaseMissingPayment(f.deps);
 assert.equal(f.state.reserved,0);assert.equal(f.state.order.data.stockReserved,false);assert.equal(f.state.order.state,'cancelled');assert.equal(f.state.p.status,'released');assert.equal(f.state.p.releaseReason,'provider_5122');assert.equal(f.state.p.orderId,'order');assert.equal(f.state.audits.length,1);
});
test('already paid or failed payment cannot release stock',async()=>{
 for(const status of ['paid','failed','payment_review']){const f=fixture(status);await releaseMissingPayment(f.deps);assert.equal(f.state.reserved,1);assert.equal(f.state.p.status,status);}
});
test('missing/wrong-tenant or processed order cannot be released',async()=>{
 for(const mutate of [s=>s.order.companyId='tenant-b',s=>s.order.state='confirmed']){const f=fixture();mutate(f.state);await assert.rejects(()=>releaseMissingPayment(f.deps));assert.equal(f.state.reserved,1);assert.equal(f.state.p.status,'pending');}
});
test('reservation failure rolls back order/payment changes',async()=>{
 const f=fixture();f.deps.reservation=async()=>{throw new Error('write conflict');};
 await assert.rejects(()=>releaseMissingPayment(f.deps));assert.equal(f.state.p.status,'pending');assert.equal(f.state.order.data.stockReserved,true);assert.equal(f.state.audits.length,0);
});
test('late verified success is review only and never re-reserves stock or creates fulfillment',async()=>{
 const f=fixture();await releaseMissingPayment(f.deps);
 const args={current:structuredClone(f.state.p),result:{paymentId:'verified-provider-id'},payments:f.payments,audit:f.audit,actor:{companyId:'tenant-a'},session:{}};
 assert.equal(await markLatePayment(args),true);assert.equal(f.state.p.status,'payment_review');assert.equal(f.state.p.providerPaymentId,'verified-provider-id');assert.equal(f.state.reserved,0);assert.equal(f.state.order.state,'cancelled');
 assert.equal(await markLatePayment({...args,current:structuredClone(f.state.p)}),true);assert.equal(f.state.audits.length,2);
});
test('normal pending success is left for existing payment settlement',async()=>{
 const f=fixture();assert.equal(await markLatePayment({current:f.state.p,result:{paymentId:'dummy'},payments:f.payments,audit:f.audit,actor:{}}),false);assert.equal(f.state.p.status,'pending');assert.equal(f.state.audits.length,0);
});
