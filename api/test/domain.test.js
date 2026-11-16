import test from 'node:test';
import assert from 'node:assert/strict';
import { cents, totals, validateInput, nextState, posting, payment, balanced, hashPassword, verifyPassword, csv, literalRegex } from '../src/domain.js';
import { moduleMap, allowed, modules } from '../../shared/modules.js';
test('modul alanlari bagimsizdir ve depo alani yalnizca siparis ekranlarina bir kez eklenir',()=>{
 for(const m of modules)assert.equal(new Set(m.fields.map(f=>f.key)).size,m.fields.length,`${m.id}: yinelenen alan`);
 for(const id of ['sales','purchases'])assert.equal(moduleMap[id].fields.filter(f=>f.key==='warehouseId').length,1);
 for(const id of ['pos','ecommerce'])assert.equal(moduleMap[id].fields.some(f=>f.key==='warehouseId'),false);
 assert.notEqual(moduleMap.sales.fields,moduleMap.purchases.fields);
 assert.notEqual(moduleMap.sales.fields,moduleMap.pos.fields);
});
test('parasal hesaplar kurus cinsinden; satir bazinda vergi yuvarlanir',()=>{
 assert.equal(cents('0.10')+cents('0.20'),30);
 assert.deepEqual(totals([{quantity:3,unitPrice:1001,taxRate:20}]),{subtotal:3003,tax:601,total:3604});
 for(const value of ['-1','NaN','1.001','1e5',Infinity,{},null])assert.throws(()=>cents(value));
});
test('fatura ve odeme her iki yonde dengeli muhasebe fisleri verir',()=>{
 for(const kind of ['customer','vendor']){
  const invoice={kind,subtotal:10000,tax:2000,total:12000};
  assert.equal(balanced(posting(invoice)).reduce((s,l)=>s+l.debit,0),12000);
  assert.equal(balanced(payment(invoice)).reduce((s,l)=>s+l.credit,0),12000);
  assert.doesNotThrow(()=>balanced(posting(invoice).map(l=>({...l,debit:l.credit,credit:l.debit}))));
 }
 assert.throws(()=>balanced([{account:'AR',debit:1,credit:0}]));
});
test('siparis akisi atlanamaz ve ayni teslim alma tekrarlanamaz',()=>{
 assert.equal(nextState(moduleMap.purchases,'draft','confirm'),'confirmed');
 assert.equal(nextState(moduleMap.purchases,'confirmed','receive'),'received');
 assert.throws(()=>nextState(moduleMap.purchases,'received','receive'));
 assert.throws(()=>nextState(moduleMap.sales,'draft','invoice'));
 assert.throws(()=>nextState(moduleMap.invoices,'paid','pay'));
 assert.throws(()=>nextState(moduleMap.invoices,'paid','reverse'));
});
test('istemci durum, sirket, surum veya stok alanlarini enjekte edemez',()=>{
 const p=validateInput('products',{name:'Urun',sku:'ABC',price:'12.20',cost:'9.10',taxRate:20,quantity:999999,state:'paid',companyId:'evil',version:999});
 assert.deepEqual(p,{name:'Urun',sku:'ABC',price:1220,cost:910,taxRate:20});
});
test('urun satirlari ve iliskiler dogrulanir',()=>{
 const base={name:'Siparis',partnerId:'a'.repeat(24),lines:[{productId:'b'.repeat(24),quantity:2,unitPrice:'10.01',taxRate:20}]};
 assert.equal(validateInput('sales',base).total,2402);
 for(const quantity of [0,-1,NaN,Infinity,1000001,0.0001])assert.throws(()=>validateInput('sales',{...base,lines:[{...base.lines[0],quantity}]}));
 assert.throws(()=>validateInput('sales',{...base,partnerId:{$ne:null}}));
 assert.throws(()=>validateInput('sales',{...base,lines:[]}));
 assert.throws(()=>validateInput('products',{name:'A',sku:'B',price:0,cost:0,taxRate:101}));
});
test('roller muhasebe ve IK erisimini ayirir',()=>{
 assert.equal(allowed({roles:['sales']},moduleMap.invoices),false);
 assert.equal(allowed({roles:['accountant']},moduleMap.invoices,true),true);
 assert.equal(allowed({roles:['accountant']},moduleMap.employees),false);
 assert.equal(allowed({roles:['warehouse']},moduleMap.inventory,true),false);
 assert.equal(allowed({roles:['admin']},moduleMap.sales,true),true);
});
test('okunur muhasebe ve stok kayitlari disaridan olusturulamaz',()=>{
 assert.throws(()=>validateInput('journal',{name:'Sahte fis'}));
 assert.throws(()=>validateInput('inventory',{quantity:999}));
});
test('izinde ters tarih ve uretimde kendi kendini tuketme reddedilir',()=>{
 assert.throws(()=>validateInput('leave',{name:'Izin',employeeId:'a'.repeat(24),startDate:'2026-05-05',endDate:'2026-05-04'}));
 assert.throws(()=>validateInput('manufacturing',{name:'Uretim',productId:'b'.repeat(24),quantity:1,components:[{productId:'b'.repeat(24),quantity:1}]}));
});
test('CSV tablo formulu enjeksiyonunu etkisizlestirir',()=>{
 const out=csv([{name:'=HYPERLINK("x")'},{name:' +cmd'},{name:'normal, "quoted"'}],['name']);
 assert.ok(out.includes('"\'=HYPERLINK'));assert.ok(out.includes('"\' +cmd'));assert.ok(out.includes('"normal, ""quoted"""'));
});
test('arama metnindeki regex operatorleri yalnizca duz metin eslestirir',()=>{
 for(const term of ['.*','[a-z]+','(a+)+$','hello?','a'+String.fromCharCode(92)+'b']){
  const rx=new RegExp(literalRegex(term));assert.equal(rx.test(term),true);assert.equal(rx.test('unrelated'),false);
 }
});
test('parolalar benzersiz tuzla saklanir ve dogrulanir',()=>{
 const a=hashPassword('very-long-password-1234'),b=hashPassword('very-long-password-1234');
 assert.notEqual(a,b);assert.equal(verifyPassword('very-long-password-1234',a),true);assert.equal(verifyPassword('wrong',a),false);assert.equal(verifyPassword(null,a),false);assert.throws(()=>hashPassword('short'));
});
test('modul kayit defterinde tum iliskilerin hedefi ve rolleri tanimli',()=>{
 assert.equal(new Set(modules.map(m=>m.id)).size,modules.length);
 for(const m of modules){for(const f of m.fields.filter(f=>f.type==='relation'))assert.ok(moduleMap[f.relation]);if(!m.readOnly)assert.ok(m.states.length);}
});
test('prototip alanlari modul olarak kabul edilmez',()=>{
 for(const id of ['constructor','toString','__proto__']){
  assert.equal(moduleMap[id],undefined);
  assert.throws(()=>validateInput(id,{}),e=>e.status===404);
 }
});
