import { randomBytes,createHmac } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { db, records, transaction, audit } from './db.js';
import { fail, totals, positive, hashToken, posting, payment, balanced, cents } from './domain.js';
import { insert, move } from './workflows.js';
import { reservation } from './stock-reservations.js';
import { readSettings } from './settings-store.js';
import { vaultKey, seal, unseal } from './vault.js';
import { iyziCall } from './provider-protocol.js';
import {reservationWindowMs,reservationDeadline,reviewMessages} from './payment-reconciliation.js';
import {releaseMissingPayment,markLatePayment} from './payment-release.js';
export const payments=db.collection((process.env.COLLECTION_PREFIX||'atlas_erp_')+'payments');
const internalUser=companyId=>({_id:'commerce',companyId,roles:['admin']});
export async function prepareOrder(companyId,module,input,user){
 fail(['pos','ecommerce'].includes(module),'Gecersiz satis kanali.');fail(Array.isArray(input.items)&&input.items.length>0&&input.items.length<=50,'Sepete 1-50 urun ekleyin.');
 const lines=[];
 for(const row of input.items){fail(typeof row.productId==='string'&&/^[a-f0-9]{24}$/i.test(row.productId),'Gecersiz urun.');const p=await records.findOne({_id:new ObjectId(row.productId),companyId,module:'products',deleted:{$ne:true},...(module==='ecommerce'?{'data.online':'yes'}:{})});fail(p,'Urun satis icin bulunamadi.');lines.push({productId:p._id.toString(),quantity:positive(row.quantity),unitPrice:p.data.price,taxRate:p.data.taxRate,name:p.data.name});}
 let partner;
 if(module==='pos'){fail(typeof input.partnerId==='string'&&/^[a-f0-9]{24}$/i.test(input.partnerId),'Musteri secin.');partner=await records.findOne({_id:new ObjectId(input.partnerId),companyId,module:'contacts',deleted:{$ne:true}});}
 else{const b=input.buyer;fail(b&&['name','surname','email','phone','address','city','country','taxId'].every(k=>typeof b[k]==='string'&&b[k].length>0&&b[k].length<=500),'Teslimat ve musteri bilgilerini tamamlayin.');fail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email),'E-posta gecersiz.');partner={_id:new ObjectId(),data:Object.fromEntries(['name','surname','email','phone','address','city','country','taxId','district','zipCode'].filter(k=>typeof b[k]==='string').map(k=>[k,b[k].trim()]))};}
 fail(partner,'Musteri secin.');return {partner,lines,data:{name:`${module==='pos'?'POS':'WEB'}-${Date.now()}`,partnerId:partner._id.toString(),lines,...totals(lines)}};
}
async function recordPayment(user,order,session,method){
 const invoice=await insert(user,'invoices',{...order.data,kind:'customer',sourceId:order._id.toString(),paymentMethod:method},session,'paid');
 for(const [kind,lines] of [['invoice',posting(invoice.data)],['payment',payment(invoice.data).map(l=>({...l,account:l.account==='BANK'&&method==='cash'?'CASH':l.account}))]])await insert(user,'journal',{name:`${invoice.data.name} / ${kind}`,invoiceId:invoice._id.toString(),lines:balanced(lines),total:invoice.data.total},session,'posted');
 return invoice;
}
export async function checkout(companyId,module,input,user,ip){
 const requestId=input.requestId||randomBytes(24).toString('hex');fail(typeof requestId==='string'&&/^[a-zA-Z0-9-]{32,64}$/.test(requestId),'Odeme istek kimligi gecersiz.');
 const accessKey=createHmac('sha256',await vaultKey()).update(companyId+':'+requestId).digest('hex');
 const previous=await payments.findOne({companyId,requestId});
 if(previous?.status==='pending')fail(reservationDeadline(previous)>new Date(),'Odeme bekleme suresi doldu; Tahsilat Takibi ekranindan sonucu kontrol edin.',409);
 if(previous){fail(previous.module===module,'Odeme kanali eslesmiyor.',409);fail(!['initializing','failed'].includes(previous.status),previous.status==='failed'?'Bu odeme basarisiz; yeni bir tahsilat baslatin.':'Odeme hazirlaniyor; ayni sepetle tekrar deneyin.',409);return {orderId:previous.orderId,paymentId:previous._id.toString(),accessKey,status:previous.status,paymentPageUrl:previous.status==='pending'?previous.paymentPageUrl:undefined};}
 const actor=user||internalUser(companyId);const prepared=await prepareOrder(companyId,module,input,actor);fail(prepared.data.total>0,'Sepet tutari sifir olamaz.');
 const method=module==='pos'&&input.method==='cash'?'cash':'iyzico';let config;
 if(method==='iyzico'){config=(await readSettings(companyId,'iyzico',true)).values;fail(config.publicUrl&&config.apiKey&&config.secretKey,'iyzico sandbox ayarlarini tamamlayin.',409);fail(prepared.partner.data.surname&&/^\d{11}$/.test(prepared.partner.data.taxId||'')&&prepared.partner.data.phone&&prepared.partner.data.address&&prepared.partner.data.city&&prepared.partner.data.country&&prepared.partner.data.email,'iyzico icin musteri ad/soyad, TCKN, telefon, adres, il, ulke ve e-postasi gerekli.');}
 const paymentId=new ObjectId(),reservationExpiresAt=new Date(Date.now()+reservationWindowMs);
 const order=await transaction(async session=>{
  if(module==='ecommerce')await records.insertOne({_id:prepared.partner._id,companyId,module:'contacts',data:{...prepared.partner.data,kind:'customer'},state:'active',version:1,createdAt:new Date(),updatedAt:new Date()},{session});
  await reservation(companyId,prepared.lines,'main',1,session);const doc=await insert(actor,module,{...prepared.data,stockReserved:true,paymentId:paymentId.toString()},session,'awaiting_payment');
  await payments.insertOne({_id:paymentId,companyId,requestId,orderId:doc._id.toString(),module,amount:doc.data.total,method,status:'initializing',accessHash:hashToken(accessKey),createdAt:new Date(),updatedAt:new Date(),...(config?{reservationExpiresAt,reconcileNextAt:reservationExpiresAt,reconcileState:'scheduled',credentials:seal(JSON.stringify(config),await vaultKey(),paymentId.toString())}:{})},{session});
  if(method==='cash'){
   await reservation(companyId,prepared.lines,'main',-1,session);for(const l of prepared.lines)await move(actor,l.productId,-l.quantity,doc._id.toString(),session);
   const invoice=await recordPayment(actor,doc,session,'cash');await records.updateOne({_id:doc._id},{$set:{state:'paid',linkedId:invoice._id.toString(),'data.stockReserved':false,'data.paymentStatus':'paid'},$inc:{version:1}},{session});await payments.updateOne({_id:paymentId},{$set:{status:'paid',invoiceId:invoice._id.toString()}},{session});
  }
  await audit(actor,'checkout_created',{module,orderId:doc._id.toString(),paymentId:paymentId.toString(),method},session);return doc;
 });
 if(method==='cash')return {orderId:order._id.toString(),paymentId:paymentId.toString(),accessKey,status:'paid'};
 const b=prepared.partner.data,address={contactName:`${b.name} ${b.surname}`,address:b.address,city:b.city,country:b.country,zipCode:b.zipCode||''};
 const payload={locale:'tr',conversationId:paymentId.toString(),price:(order.data.total/100).toFixed(2),paidPrice:(order.data.total/100).toFixed(2),currency:'TRY',basketId:order._id.toString(),paymentGroup:'PRODUCT',enabledInstallments:[1],callbackUrl:config.publicUrl+'/api/public/iyzico/callback',buyer:{id:prepared.partner._id.toString(),name:b.name,surname:b.surname,identityNumber:b.taxId,email:b.email,gsmNumber:b.phone,registrationAddress:b.address,city:b.city,country:b.country,ip,zipCode:b.zipCode||''},shippingAddress:address,billingAddress:address,basketItems:prepared.lines.map((l,i)=>{const net=Math.round(l.quantity*l.unitPrice);return {id:String(i+1),name:l.name,category1:'Urun',itemType:'PHYSICAL',price:((net+Math.round(net*l.taxRate/100))/100).toFixed(2)};})};
 try{
  const result=await iyziCall(config,'initialize',payload);fail(result.conversationId===paymentId.toString()&&typeof result.token==='string'&&result.token.length>0,'iyzico oturum bilgisi eslesmiyor.',502);const url=new URL(result.paymentPageUrl);fail(url.protocol==='https:'&&(url.hostname==='sandbox-cpp.iyzipay.com'||url.hostname.endsWith('.iyzipay.com')),'iyzico odeme sayfasi adresi dogrulanamadi.',502);
  await payments.updateOne({_id:paymentId,status:'initializing'},{$set:{status:'pending',tokenHash:hashToken(result.token),token:seal(result.token,await vaultKey(),paymentId.toString()+':token'),paymentPageUrl:url.href,updatedAt:new Date()}});
  return {orderId:order._id.toString(),paymentId:paymentId.toString(),accessKey,paymentPageUrl:url.href,status:'pending'};
 }catch(e){await transaction(async session=>{await reservation(companyId,prepared.lines,'main',-1,session);await records.updateOne({_id:order._id},{$set:{state:'cancelled','data.stockReserved':false},$inc:{version:1}},{session});await payments.updateOne({_id:paymentId},{$set:{status:'failed',updatedAt:new Date()}},{session});});throw e;}
}
async function refreshPaymentResult(id){
 const p=await payments.findOne({_id:new ObjectId(id)});fail(p,'Odeme bulunamadi.',404);if(['paid','failed'].includes(p.status))return p;fail(p.token,'Odeme oturumu henuz hazir degil.',409);
 const config=JSON.parse(unseal(p.credentials,await vaultKey(),id)),token=unseal(p.token,await vaultKey(),id+':token');
 const result=await iyziCall(config,'retrieve',{locale:'tr',conversationId:id,token});
 fail(result.conversationId===id&&result.token===token,'iyzico oturum bilgisi eslesmiyor.',502);
 if(result.paymentStatus==='FAILURE'){
  await transaction(async session=>{const current=await payments.findOne({_id:p._id},{session});if(current.status!=='pending')return;const order=await records.findOne({_id:new ObjectId(p.orderId),companyId:p.companyId},{session});if(order?.data.stockReserved)await reservation(p.companyId,order.data.lines,'main',-1,session);await records.updateOne({_id:order._id},{$set:{state:'cancelled','data.stockReserved':false},$inc:{version:1}},{session});await payments.updateOne({_id:p._id,status:'pending'},{$set:{status:'failed',updatedAt:new Date()}},{session});});return payments.findOne({_id:p._id});
 }
 fail(result.conversationId===id&&result.basketId===p.orderId&&result.currency==='TRY'&&cents(String(result.paidPrice))===p.amount&&cents(String(result.price))===p.amount,'Odeme sonucu siparisle eslesmiyor.',502);
 if(result.paymentStatus==='SUCCESS'&&['released','payment_review'].includes(p.status)){
  await transaction(async session=>{const current=await payments.findOne({_id:p._id},{session});await markLatePayment({current,result,payments,audit,actor:internalUser(p.companyId),session});});
  return payments.findOne({_id:p._id});
 }
 if(result.paymentStatus!=='SUCCESS'||Number(result.fraudStatus)!==1)return p;
 await transaction(async session=>{
  const current=await payments.findOne({_id:p._id},{session});if(current.status==='paid')return;
  if(await markLatePayment({current,result,payments,audit,actor:internalUser(p.companyId),session}))return;
  fail(current.status==='pending','Bu odeme islenemiyor.',409);const order=await records.findOne({_id:new ObjectId(p.orderId),companyId:p.companyId},{session});fail(order?.state==='awaiting_payment','Siparis durumu uygun degil.',409);
  const actor=internalUser(p.companyId);
  if(p.module==='pos'){await reservation(p.companyId,order.data.lines,'main',-1,session);for(const l of order.data.lines)await move(actor,l.productId,-l.quantity,p.orderId,session);}
  const invoice=await recordPayment(actor,order,session,'iyzico');
  await records.updateOne({_id:order._id,version:order.version},{$set:{state:p.module==='pos'?'paid':'confirmed',linkedId:invoice._id.toString(),'data.paymentStatus':'paid','data.stockReserved':p.module==='ecommerce'},$inc:{version:1}},{session});
  await payments.updateOne({_id:p._id,status:'pending'},{$set:{status:'paid',invoiceId:invoice._id.toString(),providerPaymentId:String(result.paymentId),transactions:(result.itemTransactions||[]).map(t=>({id:t.paymentTransactionId,itemId:t.itemId,paidPrice:t.paidPrice})),updatedAt:new Date()}},{session});
  await audit(actor,'payment_verified',{paymentId:id,orderId:p.orderId},session);
 });return payments.findOne({_id:p._id});
}
export async function refreshPayment(id){
 try{
  const p=await refreshPaymentResult(id);
  if(['paid','failed'].includes(p.status))await payments.updateOne({_id:p._id,status:p.status},{$set:{reconcileState:'resolved',lastReconciledAt:new Date()},$unset:{reconcileReason:'',reconcileExhausted:'',reconcileNextAt:''}});
  return p;
 }catch(error){
  if(error.providerCode==='5122'){
   return releaseMissingPayment({paymentId:new ObjectId(id),payments,records,transaction,reservation,audit,objectId:value=>new ObjectId(value),actor:internalUser});
  }
  const reason=error.providerCode==='5122'?'result_not_found':'provider_unavailable';
  await payments.updateOne({_id:new ObjectId(id),status:{$in:['pending','initializing']}},{$set:{reconcileState:'review',reconcileReason:reason,lastReconciledAt:new Date()}});
  throw error;
 }
}
export function publicPayment(p){return {id:p._id.toString(),orderId:p.orderId,invoiceId:p.invoiceId,amount:p.amount,status:p.status,method:p.method,createdAt:p.createdAt,reservationExpiresAt:p.method==='iyzico'?reservationDeadline(p):undefined,reconciliation:p.reconcileState||'scheduled',reviewMessage:p.status==='released'?'5122: Rezervasyon serbest birakildi. Odeme oturumu saglayicida iptal edilmis sayilmaz.':p.status==='payment_review'?'Rezervasyon acildiktan sonra odeme alindi. Siparis otomatik tamamlanmadi; yonetici iade veya teslimat icin incelemeli.':['pending','initializing'].includes(p.status)?reviewMessages[p.reconcileReason]||'':undefined,lastCheckedAt:p.lastReconciledAt,nextCheckAt:p.reconcileExhausted?undefined:p.reconcileNextAt,manualReviewRequired:['pending','initializing'].includes(p.status)&&!!p.reconcileExhausted};}


