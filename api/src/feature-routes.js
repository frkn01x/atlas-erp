import express from 'express';
import rateLimit from 'express-rate-limit';
import { ObjectId } from 'mongodb';
import { db,records,transaction,audit } from './db.js';
import { fail,oidPattern,hashToken,literalRegex } from './domain.js';
import { readSettings,saveSettings } from './settings-store.js';
import { checkout,payments,refreshPayment,publicPayment } from './commerce.js';
import { nesCall,xmlEscape } from './provider-protocol.js';
import { sendDocument,buildDocument,documentStatus,documentPdf } from './edocuments.js';
import {moduleMap,allowed} from '../../shared/modules.js';
import { deliveries,verifySmtp } from './mailer.js';
export const submissions=db.collection((process.env.COLLECTION_PREFIX||'atlas_erp_')+'submissions');
const id=s=>{fail(typeof s==='string'&&oidPattern.test(s),'Gecersiz kimlik.');return new ObjectId(s);};
const permit=(req,module,write=false)=>fail(allowed(req.user,moduleMap[module],write),'Bu modulu kullanma yetkiniz yok.',403);
const paymentModules=(user,write=false)=>allowed(user,moduleMap.invoices,write)?['pos','ecommerce']:['pos','ecommerce'].filter(id=>allowed(user,moduleMap[id],write));
export const privateFeatures=express.Router(),publicFeatures=express.Router();
privateFeatures.get('/settings/:group',async(req,res)=>{fail(req.user.roles.includes('admin'),'Ayarlar icin yonetici yetkisi gerekli.',403);res.json(await readSettings(req.user.companyId,req.params.group));});
privateFeatures.put('/settings/:group',async(req,res)=>{fail(req.user.roles.includes('admin'),'Ayarlar icin yonetici yetkisi gerekli.',403);res.json(await saveSettings(req.user,req.params.group,req.body));});
privateFeatures.post('/settings/smtp/verify',async(req,res)=>{fail(req.user.roles.includes('admin'),'Yonetici yetkisi gerekli.',403);res.json(await verifySmtp(req.user.companyId));});
privateFeatures.post('/commerce/pos/checkout',async(req,res)=>{permit(req,'pos',true);res.status(201).json(await checkout(req.user.companyId,'pos',req.body,req.user,req.ip));});
privateFeatures.get('/commerce/payments',async(req,res)=>{const visible=paymentModules(req.user);fail(visible.length,'Tahsilat yetkisi yok.',403);res.json((await payments.find({companyId:req.user.companyId,module:{$in:visible}}).sort({createdAt:-1}).limit(100).toArray()).map(publicPayment));});
privateFeatures.post('/commerce/payments/:id/refresh',async(req,res)=>{const p=await payments.findOne({_id:id(req.params.id),companyId:req.user.companyId});fail(p&&paymentModules(req.user,true).includes(p.module),'Odeme bulunamadi veya yetkiniz yok.',403);res.json(publicPayment(await refreshPayment(req.params.id)));});
privateFeatures.get('/integrations/nes/taxpayer/:taxId',async(req,res)=>{permit(req,'invoices');fail(/^\d{10,11}$/.test(req.params.taxId),'VKN/TCKN gecersiz.');const c=(await readSettings(req.user.companyId,'nes',true)).values;res.json(await nesCall(c,'einvoice',`/v1/users/${req.params.taxId}/Pk`));});
privateFeatures.post('/integrations/nes/:id/prepare',async(req,res)=>{permit(req,'invoices',true);id(req.params.id);const doc=await buildDocument(req.user,req.params.id,req.body.kind);res.json({xml:doc.xml,number:doc.invoice.documentNumber,uuid:doc.invoice.documentUuid});});
privateFeatures.post('/integrations/nes/:id/send',async(req,res)=>{permit(req,'invoices',true);id(req.params.id);res.json(await sendDocument(req.user,req.params.id,req.body.kind));});
privateFeatures.post('/integrations/nes/:id/status',async(req,res)=>{permit(req,'invoices',true);id(req.params.id);res.json(await documentStatus(req.user,req.params.id));});
privateFeatures.get('/integrations/nes/:id/pdf',async(req,res)=>{permit(req,'invoices');id(req.params.id);res.type('application/pdf').attachment('nes-fatura.pdf').send(await documentPdf(req.user,req.params.id));});
privateFeatures.get('/campaigns/:id/deliveries',async(req,res)=>{permit(req,'emailMarketing');id(req.params.id);res.json(await deliveries.find({companyId:req.user.companyId,campaignId:req.params.id},{projection:{to:1,status:1,error:1,sentAt:1}}).limit(500).toArray());});
privateFeatures.get('/forms/:id/responses',async(req,res)=>{const form=await records.findOne({_id:id(req.params.id),companyId:req.user.companyId,module:{$in:['events','surveys']}});fail(form,'Form bulunamadi.',404);permit(req,form.module);res.json(await submissions.find({companyId:req.user.companyId,recordId:req.params.id}).sort({createdAt:-1}).limit(500).toArray());});
privateFeatures.get('/operations/summary',async(req,res)=>{
 const companyId=req.user.companyId,result={};
 if(allowed(req.user,moduleMap.timesheets))result.timesheets=await records.aggregate([{$match:{companyId,module:'timesheets',state:'approved'}},{$group:{_id:'$data.projectId',hours:{$sum:'$data.hours'},billable:{$sum:'$data.billableAmount'}}}]).toArray();
 if(allowed(req.user,moduleMap.employees))result.leave=await records.find({companyId,module:'employees',deleted:{$ne:true}},{projection:{'data.name':1,'data.leaveAllowance':1,'data.leaveUsed':1}}).limit(500).toArray();
 res.json(result);
});
privateFeatures.get('/invoices/:id/print',async(req,res)=>{
 permit(req,'invoices');const r=await records.findOne({_id:id(req.params.id),companyId:req.user.companyId,module:'invoices'});fail(r,'Fatura bulunamadi.',404);const c=(await readSettings(req.user.companyId,'company')).values,b=await records.findOne({_id:new ObjectId(r.data.partnerId),companyId:req.user.companyId,module:'contacts'}),e=xmlEscape;
 const rows=[];for(const l of r.data.lines){const p=await records.findOne({_id:new ObjectId(l.productId),companyId:req.user.companyId,module:'products'});rows.push(`<tr><td>${e(p?.data.name||l.productId)}</td><td>${l.quantity}</td><td>${(l.unitPrice/100).toFixed(2)}</td><td>${l.taxRate}%</td></tr>`);}
 res.type('html').send(`<!doctype html><html lang="tr"><meta charset="utf-8"><title>Fatura</title><h1>${e(c.name||req.user.companyName)}</h1><p>${e(c.address||'')} · ${e(c.taxId||'')}</p><h2>${e(r.documentNumber||r.data.name)}</h2><p>${e(b?.data.name||'')} · ${e(b?.data.address||'')}</p><p>Durum: ${e(r.state)}</p><table border="1" cellpadding="10"><tr><th>Urun</th><th>Miktar</th><th>Birim fiyat TRY</th><th>KDV</th></tr>${rows.join('')}</table><p>Ara toplam: ${(r.data.subtotal/100).toFixed(2)} TRY</p><p>KDV: ${(r.data.tax/100).toFixed(2)} TRY</p><h3>Toplam: ${(r.data.total/100).toFixed(2)} TRY</h3><p>Bu cikti e-belge yerine gecmez. NES test belgesi ayrica gonderilir.</p></html>`);
});
publicFeatures.use(rateLimit({windowMs:60000,limit:120,message:{error:'Istek siniri asildi.'}}));
publicFeatures.use((req,res,next)=>{if(req.path==='/iyzico/callback'||req.method==='GET'||req.get('X-ERP-Request')==='1')return next();res.status(403).json({error:'Istek dogrulanamadi.'});});
publicFeatures.post('/iyzico/callback',express.urlencoded({extended:false,limit:'4kb'}),async(req,res)=>{fail(typeof req.body.token==='string'&&req.body.token.length<500,'Odeme tokeni gecersiz.');const p=await payments.findOne({tokenHash:hashToken(req.body.token)});fail(p,'Odeme oturumu bulunamadi.',404);try{await refreshPayment(p._id.toString());}catch{}res.redirect(303,`/payment-result/${p._id}`);});
async function publicSite(companyId){id(companyId);fail(await records.findOne({companyId,module:'website',state:'published',publishedData:{$ne:null},deleted:{$ne:true}}),'Bu magazanin yayinlanmis sitesi yok.',404);}
publicFeatures.get('/site/:company/:slug',async(req,res)=>{id(req.params.company);const page=await records.findOne({companyId:req.params.company,module:'website',state:'published','publishedData.slug':req.params.slug,deleted:{$ne:true}});fail(page?.publishedData,'Sayfa yayinlanmamis.',404);const {values:company}=await readSettings(req.params.company,'company');res.json({page:page.publishedData,company:{name:company.name||'Atlas Magaza',address:company.address||'',email:company.email||''}});});
publicFeatures.get('/store/:company/products',async(req,res)=>{await publicSite(req.params.company);const items=await records.find({companyId:req.params.company,module:'products','data.online':'yes',deleted:{$ne:true}}).limit(200).toArray();res.json(items.map(p=>({id:p._id.toString(),name:p.data.name,price:p.data.price,taxRate:p.data.taxRate,description:p.data.description||'',imageUrl:p.data.imageUrl||'',available:Math.max(0,(p.data.locations?.main??p.data.quantity??0)-(p.data.reserved?.main||0))})));});
publicFeatures.post('/store/:company/checkout',async(req,res)=>{await publicSite(req.params.company);res.status(201).json(await checkout(req.params.company,'ecommerce',req.body,null,req.ip));});
publicFeatures.post('/payments/:id/status',async(req,res)=>{const p=await payments.findOne({_id:id(req.params.id)});fail(p&&typeof req.body.accessKey==='string'&&hashToken(req.body.accessKey)===p.accessHash,'Odeme kaydina erisim yok.',403);res.json(publicPayment(req.body.refresh?await refreshPayment(req.params.id):p));});
publicFeatures.get('/forms/:company/:id',async(req,res)=>{id(req.params.company);const r=await records.findOne({_id:id(req.params.id),companyId:req.params.company,module:{$in:['events','surveys']},state:'published',deleted:{$ne:true}});fail(r,'Form yayinlanmamis.',404);const count=await submissions.countDocuments({companyId:r.companyId,recordId:r._id.toString()});res.json({id:r._id,module:r.module,name:r.data.name,description:r.data.description||'',questions:r.module==='surveys'?r.data.questions.split('\n').map(q=>q.trim()).filter(Boolean):[],capacity:r.data.capacity,registrations:count,startsAt:r.data.startsAt,endsAt:r.data.endsAt,location:r.data.location});});
publicFeatures.post('/forms/:company/:id',async(req,res)=>{
 const companyId=req.params.company;id(companyId);const recordId=req.params.id;id(recordId);const {name,email,answers}=req.body;fail(typeof name==='string'&&name.trim().length>0&&name.length<=200&&typeof email==='string'&&email.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'Ad ve gecerli e-posta gerekli.');
 await transaction(async session=>{
  const r=await records.findOne({_id:id(recordId),companyId,module:{$in:['events','surveys']},state:'published',deleted:{$ne:true}},{session});fail(r,'Form yayinlanmamis.',404);
  fail(!await submissions.findOne({companyId,recordId,email:email.toLowerCase()},{session}),'Bu e-posta ile zaten yanit verildi.',409);
  if(r.module==='events'){const count=await submissions.countDocuments({companyId,recordId},{session});fail(!r.data.capacity||count<r.data.capacity,'Etkinlik kontenjani dolu.',409);}else{const qs=r.data.questions.split('\n').filter(q=>q.trim());fail(Array.isArray(answers)&&answers.length===qs.length&&answers.every(a=>typeof a==='string'&&a.length>0&&a.length<=2000),'Tum sorulari yanitlayin.');}
  await records.updateOne({_id:r._id,version:r.version},{$inc:{version:1}},{session});await submissions.insertOne({_id:new ObjectId(),companyId,recordId,name:name.trim(),email:email.toLowerCase(),answers:r.module==='surveys'?answers:[],createdAt:new Date()},{session});
 });res.status(201).json({ok:true});
});
publicFeatures.post('/unsubscribe',async(req,res)=>{fail(typeof req.body.token==='string'&&/^[a-f0-9]{64}$/.test(req.body.token),'Gecersiz abonelik baglantisi.');const job=await deliveries.findOne({unsubscribeHash:hashToken(req.body.token)});fail(job,'Abonelik baglantisi bulunamadi.',404);await records.updateMany({companyId:job.companyId,module:'contacts','data.email':{$regex:'^'+literalRegex(job.to)+'$',$options:'i'}},{$set:{'data.marketingConsent':'no'},$inc:{version:1}});res.json({ok:true});});
