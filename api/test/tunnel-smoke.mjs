import assert from 'node:assert/strict';
const base='http://callback-gateway:8080';
for(const path of ['/','/kvkk','/api/health','/api/auth/login','/api/admin/users','/api/records/sales','/api/public/site/test/test','/payment-result/000000000000000000000000']){
 const r=await fetch(base+path,{signal:AbortSignal.timeout(10000)});assert.equal(r.status,404,'Tünel dışında kalması gereken yol: '+path);
}
const get=await fetch(base+'/api/public/iyzico/callback',{signal:AbortSignal.timeout(10000)});assert.equal(get.status,405);
const post=await fetch(base+'/api/public/iyzico/callback',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'probe=1',redirect:'manual',signal:AbortSignal.timeout(15000)});assert.equal(post.status,400);const data=await post.json();assert.match(data.error,/token/i);
const unsubscribe=await fetch(base+'/unsubscribe/'+'a'.repeat(64));assert.equal(unsubscribe.status,200);assert.match(await unsubscribe.text(),/unsubscribe.js/);
assert.equal((await fetch(base+'/unsubscribe/invalid')).status,404);
assert.equal((await fetch(base+'/unsubscribe.js')).status,200);
assert.equal((await fetch(base+'/api/public/unsubscribe')).status,405);
const invalid=await fetch(base+'/api/public/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json','X-ERP-Request':'1'},body:JSON.stringify({token:'invalid'})});assert.equal(invalid.status,400);
console.log('PASS: iyzico dönüşü ve e-posta abonelikten çıkış yolları açık; giriş, yönetim, ERP ve mağaza kapalı.');
