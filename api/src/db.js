import { MongoClient, ObjectId } from 'mongodb';
import { hashPassword, fail } from './domain.js';
export const client=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:15000});
export const db=client.db(process.env.MONGODB_DB||'atlas_erp');
const prefix=process.env.COLLECTION_PREFIX||'atlas_erp_';
fail(/^[a-zA-Z0-9_]{1,40}$/.test(prefix),'COLLECTION_PREFIX yalnizca harf, rakam ve alt cizgi icerebilir.');
export const records=db.collection(prefix+'records'), users=db.collection(prefix+'users'), sessions=db.collection(prefix+'sessions'), audits=db.collection(prefix+'audits');
export const objectId=s=>new ObjectId(s);
export async function initialize(){
 fail(!process.env.AI_TEST_ORIGIN||/(test|acceptance)/i.test(process.env.MONGODB_DB||''),'AI test hedefi yalnizca ayrilmis test veritabaninda kullanilabilir.');
 await client.connect();
 await users.updateMany({authzVersion:{$exists:false}},{$set:{authzVersion:0}});
 await Promise.all([
  records.createIndex({companyId:1,module:1,updatedAt:-1}),
  records.createIndex({companyId:1,module:1,'data.sku':1},{unique:true,partialFilterExpression:{module:'products'}}),
  records.createIndex({companyId:1,module:1,'data.slug':1},{unique:true,partialFilterExpression:{module:'website','data.slug':{$type:'string'}}}),
  records.createIndex({companyId:1,module:1,'publishedData.slug':1},{unique:true,partialFilterExpression:{module:'website','publishedData.slug':{$type:'string'}}}),
  db.collection(prefix+'settings').createIndex({companyId:1,group:1}),
  db.collection(prefix+'payments').createIndex({tokenHash:1},{unique:true,partialFilterExpression:{tokenHash:{$type:'string'}}}),
  db.collection(prefix+'payments').createIndex({companyId:1,createdAt:-1}),
  db.collection(prefix+'payments').createIndex({method:1,status:1,reconcileNextAt:1,createdAt:1}),
  db.collection(prefix+'payments').createIndex({companyId:1,requestId:1},{unique:true,partialFilterExpression:{requestId:{$type:'string'}}}),
  db.collection(prefix+'mail_deliveries').createIndex({status:1,createdAt:1}),
  db.collection(prefix+'mail_deliveries').createIndex({unsubscribeHash:1},{unique:true,sparse:true}),
  db.collection(prefix+'submissions').createIndex({companyId:1,recordId:1,createdAt:-1}),
  db.collection(prefix+'sequences').createIndex({value:1}),
  db.collection(prefix+'interviews').createIndex({companyId:1,createdAt:-1}),
  db.collection(prefix+'interviews').createIndex({companyId:1,requestId:1},{unique:true}),
  db.collection(prefix+'interviews').createIndex({expiresAt:1},{expireAfterSeconds:0}),
  users.createIndex({email:1},{unique:true}),users.createIndex({bootstrap:1},{unique:true,partialFilterExpression:{bootstrap:true}}),sessions.createIndex({tokenHash:1},{unique:true}),sessions.createIndex({expiresAt:1},{expireAfterSeconds:0}),audits.createIndex({companyId:1,at:-1})
 ]);
 if(!await users.findOne({bootstrap:true})){
  const email=process.env.ADMIN_EMAIL?.trim().toLowerCase();fail(email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'ADMIN_EMAIL gerekli.');
  const passwordHash=hashPassword(process.env.ADMIN_PASSWORD);
  const companyId=new ObjectId().toHexString();
  await users.updateOne({bootstrap:true},{$setOnInsert:{email,name:'Yonetici',roles:['admin'],authzVersion:0,companyId,companyName:process.env.COMPANY_NAME||'Sirketim',passwordHash,active:true,bootstrap:true,createdAt:new Date()}},{upsert:true});
 }
}
export async function transaction(fn){return client.withSession(session=>session.withTransaction(()=>fn(session)));}
export async function audit(user,event,details,session){await audits.insertOne({companyId:user.companyId,userId:user._id.toString(),event,details,at:new Date()},{session});}
