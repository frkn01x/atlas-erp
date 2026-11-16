import { randomUUID } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { db,records,transaction,audit } from './db.js';
import { fail } from './domain.js';
import { readSettings } from './settings-store.js';
import { invoiceXml,nesCall,invoiceIssueDate } from './provider-protocol.js';
const sequences=db.collection((process.env.COLLECTION_PREFIX||'atlas_erp_')+'sequences');
export async function buildDocument(user,id,kind){
 fail(['einvoice','earchive'].includes(kind),'Belge turu gecersiz.');
 const seller=(await readSettings(user.companyId,'company',true)).values;fail(/^[A-Z]{3}$/.test(seller.invoicePrefix||''),'Sirket ayarlarinda 3 harfli fatura seri on ekini girin.');
 await transaction(async session=>{
  const invoice=await records.findOne({_id:new ObjectId(id),companyId:user.companyId,module:'invoices'},{session});fail(invoice&&['posted','paid'].includes(invoice.state)&&invoice.data.kind==='customer','Yalnizca muhasebelestirilmis musteri faturasi kullanilabilir.',409);
  if(!invoice.documentNumber){const year=invoiceIssueDate(invoice.createdAt).slice(0,4);const n=await sequences.findOneAndUpdate({_id:`${user.companyId}:${seller.invoicePrefix}:${year}`},{$inc:{value:1}},{upsert:true,returnDocument:'after',session});fail(n.value<=999999999,'Fatura numara serisi doldu.');await records.updateOne({_id:invoice._id},{$set:{documentNumber:`${seller.invoicePrefix}${year}${String(n.value).padStart(9,'0')}`,documentUuid:randomUUID()},$inc:{version:1}},{session});}
 });
 const invoice=await records.findOne({_id:new ObjectId(id),companyId:user.companyId,module:'invoices'}),buyer=await records.findOne({_id:new ObjectId(invoice.data.partnerId),companyId:user.companyId,module:'contacts'});fail(buyer,'Cari bulunamadi.');
 const products={};for(const l of invoice.data.lines){const p=await records.findOne({_id:new ObjectId(l.productId),companyId:user.companyId,module:'products'});products[l.productId]=p?.data.name||l.productId;}
 return {invoice,seller,buyer:buyer.data,xml:invoiceXml(invoice,seller,buyer.data,products,kind)};
}
export async function sendDocument(user,id,kind){
 const config=(await readSettings(user.companyId,'nes',true)).values;fail(config.apiKey,'NES API anahtarini ayarlardan girin.');if(kind==='einvoice')fail(config.senderAlias,'NES gonderici etiketi gerekli.');
 const {invoice,buyer,xml}=await buildDocument(user,id,kind);fail(!['sending','sent','unknown'].includes(invoice.eDocument?.status),'Belge zaten gonderildi veya sonucu sorgulanmali.',409);if(kind==='einvoice')fail(buyer.receiverAlias||config.receiverAlias,'e-Fatura icin alici etiketi gerekli.');
 const locked=await records.updateOne({_id:invoice._id,companyId:user.companyId,version:invoice.version},{$set:{eDocument:{kind,status:'sending',uuid:invoice.documentUuid,at:new Date()}},$inc:{version:1}});fail(locked.modifiedCount===1,'Fatura degisti; yenileyin.',409);
 const body=new FormData();body.set('File',new Blob([xml],{type:'application/xml'}),invoice.documentUuid+'.xml');body.set('IsDirectSend','true');body.set('PreviewType','None');body.set('SourceApp',config.sourceApp||'atlas-erp');body.set('SourceAppRecordId',id);body.set('AutoSaveCompany','true');
 if(kind==='einvoice'){fail(buyer.receiverAlias||config.receiverAlias,'e-Fatura icin alici etiketi gerekli.');body.set('SenderAlias',config.senderAlias);body.set('ReceiverAlias',buyer.receiverAlias||config.receiverAlias);}
 try{const result=await nesCall(config,kind,'/v1/uploads/document',{method:'POST',body});fail(typeof result.uuid==='string','NES belge kimligi donmedi; sonucu sorgulayin.',502);await transaction(async session=>{await records.updateOne({_id:invoice._id,companyId:user.companyId},{$set:{eDocument:{kind,status:'sent',uuid:result.uuid,number:result.documentNumber||invoice.documentNumber,at:new Date()}},$inc:{version:1}},{session});await audit(user,'nes_document_sent',{invoiceId:id,kind,uuid:result.uuid},session);});return {uuid:result.uuid,documentNumber:result.documentNumber||invoice.documentNumber};}
 catch(e){await records.updateOne({_id:invoice._id,companyId:user.companyId},{$set:{'eDocument.status':e.status===422?'failed':'unknown'},$inc:{version:1}});throw e;}
}
export async function documentStatus(user,id){
 const r=await records.findOne({_id:new ObjectId(id),module:'invoices',companyId:user.companyId});fail(r?.eDocument?.uuid,'NES belge kaydi bulunamadi.',404);const {kind,uuid}=r.eDocument;const config=(await readSettings(user.companyId,'nes',true)).values;
 const detail=await nesCall(config,kind,kind==='einvoice'?`/v1/outgoing/invoices/${encodeURIComponent(uuid)}`:`/v1/invoices/${encodeURIComponent(uuid)}`);
 await records.updateOne({_id:r._id,companyId:user.companyId},{$set:{'eDocument.lastCheckedAt':new Date(),'eDocument.status':'sent','eDocument.providerStatus':String(detail.status??detail.documentStatus??'received').slice(0,100)},$inc:{version:1}});
 return {uuid,status:detail.status??detail.documentStatus??'received'};
}
export async function documentPdf(user,id){const r=await records.findOne({_id:new ObjectId(id),module:'invoices',companyId:user.companyId});fail(r?.eDocument?.uuid,'NES belge kaydi bulunamadi.',404);const {kind,uuid}=r.eDocument,config=(await readSettings(user.companyId,'nes',true)).values;return nesCall(config,kind,kind==='einvoice'?`/v1/outgoing/invoices/${encodeURIComponent(uuid)}/pdf`:`/v1/invoices/${encodeURIComponent(uuid)}/pdf`,{binary:true});}
