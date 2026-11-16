import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac,randomBytes} from 'node:crypto';
import {iyziHeaders,verifyIyzi,iyziCall,nesCall,invoiceXml,xmlEscape,invoiceIssueDate} from '../src/provider-protocol.js';
import {seal,unseal} from '../src/vault.js';
import {validBlocks} from '../../shared/blocks.js';
import {workingDays,validateInput,nextState} from '../src/domain.js';
import {moduleMap} from '../../shared/modules.js';
test('iyzico istegi yol, rastgele deger ve gonderilen govdeye bagli imzalanir',()=>{
 const cfg={apiKey:'test-api',secretKey:'test-secret'},path='/payment/bin/check',body='{"binNumber":"123456"}',h=iyziHeaders(cfg,path,body,'nonce-1');
 const expected=createHmac('sha256','test-secret').update('nonce-1'+path+body).digest('hex');
 assert.equal(Buffer.from(h.Authorization.slice(8),'base64').toString(),`apiKey:test-api&randomKey:nonce-1&signature:${expected}`);
 assert.notEqual(iyziHeaders(cfg,path,body+' ','nonce-1').Authorization,h.Authorization);
});
test('iyzico yanit imzasi tutar degisikligini yakalar ve sondaki sifirlari normalize eder',()=>{
 const r={paymentStatus:'SUCCESS',paymentId:'p1',currency:'TRY',basketId:'b1',conversationId:'c1',paidPrice:'10.50',price:'10.500',token:'t1'};
 r.signature=createHmac('sha256','secret').update('SUCCESS:p1:TRY:b1:c1:10.5:10.5:t1').digest('hex');assert.doesNotThrow(()=>verifyIyzi(r,'secret','retrieve'));assert.throws(()=>verifyIyzi({...r,paidPrice:'10.51'},'secret','retrieve'));assert.throws(()=>verifyIyzi({...r,signature:''},'secret','retrieve'));
});
test('iyzico tasiyicisi yalnizca sabit sandbox sunucusuna gider',async()=>{
 const cfg={apiKey:'test',secretKey:'secret',uri:'http://evil.invalid'},payload={conversationId:'c'};let captured;
 const r={status:'success',conversationId:'c',token:'t'};r.signature=createHmac('sha256','secret').update('c:t').digest('hex');
 await iyziCall(cfg,'initialize',payload,async(url,options)=>{captured={url,options};return {ok:true,json:async()=>r};});
 assert.ok(captured.url.startsWith('https://sandbox-api.iyzipay.com/'));assert.equal(captured.options.redirect,'error');assert.equal(captured.options.body,JSON.stringify(payload));
});
test('NES tasiyicisi Bearer ve multipart ile dogru test servisine baglanir',async()=>{
 const body=new FormData();body.set('SourceApp','atlas-erp');let request;
 const r=await nesCall({apiKey:'test-token'},'earchive','/v1/uploads/document',{method:'POST',body,fetcher:async(url,options)=>{request={url,options};return {ok:true,status:201,json:async()=>({uuid:'test-uuid'})};}});
 assert.equal(request.url,'https://apitest.nes.com.tr/earchive/v1/uploads/document');assert.equal(request.options.headers.Authorization,'Bearer test-token');assert.equal(request.options.body.get('SourceApp'),'atlas-erp');assert.equal(r.uuid,'test-uuid');
 await assert.rejects(()=>nesCall({apiKey:'x'},'evil','/v1/test'));
});
test('iyzico 5122 is typed for the reservation release policy, not forged payment success',async()=>{
 await assert.rejects(()=>iyziCall({apiKey:'dummy',secretKey:'dummy'},'retrieve',{},async()=>({ok:true,json:async()=>({status:'failure',errorCode:'5122'})})),error=>error.providerCode==='5122'&&error.status===422&&error.message.includes('5122'));
});
test('ayar sifrelemesi anahtar, sirket ve alan degistirildiginde acilamaz',()=>{
 const key=randomBytes(32),box=seal('private-value',key,'company:provider:secret');assert.equal(unseal(box,key,'company:provider:secret'),'private-value');assert.ok(!JSON.stringify(box).includes('private-value'));assert.throws(()=>unseal(box,key,'other-company:provider:secret'));assert.throws(()=>unseal(box,randomBytes(32),'company:provider:secret'));assert.throws(()=>unseal({...box,data:Buffer.from('tampered').toString('base64')},key,'company:provider:secret'));
});
test('sayfa bloklari script adreslerini ve yinelenen kimlikleri reddeder',()=>{
 const b={id:'b1',type:'hero',title:'Title',body:'Body',href:'#products'};assert.equal(validBlocks([b])[0].theme,'light');for(const href of ['javascript:alert(1)','//evil.invalid','data:text/html,x'])assert.throws(()=>validBlocks([{...b,href}]));assert.throws(()=>validBlocks([b,b]));assert.throws(()=>validBlocks([{...b,type:'script'}]));
});
test('izin is gunu hesabi hafta sonunu disarida tutar',()=>{assert.equal(workingDays('2026-11-13','2026-11-16'),2);assert.equal(workingDays('2026-11-14','2026-11-15'),0);});
test('yayinlanmis sayfa yeni taslagi yeniden yayinlayabilir ve yayindan kaldirilabilir',()=>{assert.equal(nextState(moduleMap.website,'published','publish'),'published');assert.equal(nextState(moduleMap.website,'published','unpublish'),'draft');});
test('fatura tarihi ve seri yili Istanbul saatine gore belirlenir',()=>{assert.equal(invoiceIssueDate('2026-12-31T22:00:00Z'),'2027-01-01');});
test('stok ve anket kurallari gecersiz miktarlari ve bos sorulari engeller',()=>{
 assert.throws(()=>validateInput('stockTransfers',{name:'A',productId:'a'.repeat(24),quantity:0,toWarehouseId:'b'.repeat(24)}));assert.throws(()=>validateInput('surveys',{name:'A',questions:'\n\n'}));assert.throws(()=>validateInput('boms',{name:'B',productId:'a'.repeat(24),components:[{productId:'a'.repeat(24),quantity:1}]}));
});
test('UBL XML tutarlari ve kimlikleri korur, XML ozel karakterlerini kacar',()=>{
 const d={documentNumber:'ABC2026000000001',documentUuid:'00000000-0000-4000-8000-000000000001',createdAt:new Date('2026-11-13T12:00:00Z'),data:{subtotal:1000,tax:200,total:1200,lines:[{productId:'p',quantity:1,unitPrice:1000,taxRate:20}]}},party={name:'A & B',taxId:'1234567890',address:'<Street>',city:'Istanbul'};
 const xml=invoiceXml(d,party,party,{p:'Item <x>'},'einvoice');assert.ok(xml.includes('A &amp; B'));assert.ok(xml.includes('Item &lt;x&gt;'));assert.ok(xml.includes('>12.00</cbc:PayableAmount>'));assert.ok(xml.includes('TEMELFATURA'));assert.equal(xmlEscape('"'), '&quot;');assert.throws(()=>invoiceXml({...d,data:{...d.data,lines:[{...d.data.lines[0],taxRate:0}]}},party,party,{},'einvoice'));
});
