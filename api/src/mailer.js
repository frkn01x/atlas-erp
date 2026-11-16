import nodemailer from 'nodemailer';
import { lookup } from 'node:dns/promises';
import { randomBytes } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { db,records,transaction,audit } from './db.js';
import { fail,hashToken,Fault } from './domain.js';
import { readSettings } from './settings-store.js';
export const deliveries=db.collection((process.env.COLLECTION_PREFIX||'atlas_erp_')+'mail_deliveries');
async function transport(companyId){
 const c=(await readSettings(companyId,'smtp',true)).values;fail(c.host&&c.port&&c.from,'SMTP ayarlarini tamamlayin.',409);
 const addresses=(await lookup(c.host,{all:true})).filter(a=>a.family===4);fail(addresses.length&&addresses.every(a=>{const ip=a.address;return !/^(0\.|10\.|127\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|169\.254\.|192\.168\.|192\.0\.|198\.1[89]\.|172\.(1[6-9]|2\d|3[01])\.|22[4-9]\.|2[3-5]\d\.)/.test(ip);}), 'SMTP alan adi genel bir IPv4 adresine cozulmeli.');
 return {config:c,client:nodemailer.createTransport({host:addresses[0].address,port:Number(c.port),secure:c.secure==='yes',requireTLS:c.secure!=='yes',tls:{servername:c.host,rejectUnauthorized:true},...(c.user?{auth:{user:c.user,pass:c.password||''}}:{}),connectionTimeout:10000,socketTimeout:15000})};
}
export async function verifySmtp(companyId){let t;try{t=await transport(companyId);await t.client.verify();return {ok:true};}catch(e){if(e instanceof Fault)throw e;throw new Fault(422,'SMTP baglantisi veya kimlik dogrulamasi basarisiz. Sunucu, port, TLS ve kullanici bilgilerini kontrol edin.');}finally{t?.client.close();}}
export async function queueCampaign(user,id){
 const {values:config}=await readSettings(user.companyId,'smtp');fail(config.host&&config.from&&config.publicUrl,'SMTP sunucu, gonderen ve abonelikten cikis icin HTTPS uygulama adresini ayarlayin.',409);
 return transaction(async session=>{
  const campaign=await records.findOne({_id:new ObjectId(id),companyId:user.companyId,module:'emailMarketing',state:'ready'},{session});fail(campaign,'Kampanya hazir durumda olmali.',409);fail(campaign.data.subject&&campaign.data.body,'Konu ve icerik gerekli.');
  const contacts=await records.find({companyId:user.companyId,module:'contacts','data.marketingConsent':'yes','data.email':{$type:'string'},deleted:{$ne:true}},{session}).limit(501).toArray();fail(contacts.length>0&&contacts.length<=500,'1-500 izinli alici gerekli.');const unique=new Map(contacts.filter(c=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.data.email)).map(c=>[c.data.email.toLowerCase(),c]));fail(unique.size>0,'Gecerli e-postasi olan izinli alici yok.');
  for(const c of unique.values())await deliveries.insertOne({_id:new ObjectId(),companyId:user.companyId,campaignId:id,contactId:c._id.toString(),to:c.data.email,status:'queued',createdAt:new Date()},{session});
  await records.updateOne({_id:campaign._id,version:campaign.version},{$set:{state:'sending','data.recipientCount':unique.size},$inc:{version:1}},{session});await audit(user,'campaign_queued',{id,recipients:unique.size},session);return {queued:unique.size};
 });
}
let busy=false;
export function startMailWorker(){const timer=setInterval(async()=>{
 if(busy)return;busy=true;
 try{
  const job=await deliveries.findOneAndUpdate({status:'queued'},{$set:{status:'sending',startedAt:new Date()}},{sort:{createdAt:1},returnDocument:'after'});if(!job)return;
  try{const contact=await records.findOne({_id:new ObjectId(job.contactId),companyId:job.companyId,module:'contacts','data.marketingConsent':'yes'});fail(contact&&contact.data.email?.toLowerCase()===job.to.toLowerCase(),'Alici izni bulunmuyor veya e-postasi degisti.');const campaign=await records.findOne({_id:new ObjectId(job.campaignId),companyId:job.companyId,module:'emailMarketing'});const t=await transport(job.companyId);const token=randomBytes(32).toString('hex');await deliveries.updateOne({_id:job._id},{$set:{unsubscribeHash:hashToken(token)}});
   try{await t.client.sendMail({from:{name:t.config.fromName||'',address:t.config.from},to:job.to,subject:campaign.data.subject,text:campaign.data.body+`\n\nAbonelikten cik: ${t.config.publicUrl}/unsubscribe/${token}`,messageId:`<${job._id}@atlas-erp.local>`,headers:{'List-Unsubscribe':`<${t.config.publicUrl}/unsubscribe/${token}>`}});}finally{t.client.close();}
   await deliveries.updateOne({_id:job._id},{$set:{status:'sent',sentAt:new Date()}});
  }catch{await deliveries.updateOne({_id:job._id},{$set:{status:'failed',error:'SMTP gonderimi tamamlanamadi; tekrar gondermeden once alici teslimini kontrol edin.'}});}
  if(!await deliveries.findOne({campaignId:job.campaignId,status:{$in:['queued','sending']}})){const sent=await deliveries.countDocuments({campaignId:job.campaignId,status:'sent'}),failed=await deliveries.countDocuments({campaignId:job.campaignId,status:'failed'});await records.updateOne({_id:new ObjectId(job.campaignId),companyId:job.companyId},{$set:{state:failed?'failed':'sent','data.sentCount':sent,'data.failedCount':failed},$inc:{version:1}});}
 }catch{console.error(JSON.stringify({event:'mail_worker_failed'}));}finally{busy=false;}
 },1000);timer.unref();return timer;}
