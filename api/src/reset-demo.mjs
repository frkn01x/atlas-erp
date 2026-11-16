// Yalnızca durdurulmuş demo API'si için bakım komutu; HTTP uç noktası değildir.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {BSON} from 'mongodb';
import {client,db,users,audits} from './db.js';
const prefix=process.env.COLLECTION_PREFIX||'atlas_erp_';
const {EJSON}=BSON;
const names=['records','payments','mail_deliveries','submissions','interviews'];
const digest=text=>createHash('sha256').update(text).digest('hex');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const backupRoot='/backup';
const resultPath=backupRoot+'/reset-result.json';
async function run(){
 if(!process.argv.includes('--apply-all-demo'))throw Error('Açık bakım seçeneği gerekli: --apply-all-demo');
 if(process.env.RESET_MAINTENANCE_MODE!=='api-stopped')throw Error('API durdurularak Reset-Demo.ps1 kullanılmalı.');
 await client.connect();
 const owners=await users.find({bootstrap:true,active:true}).limit(2).toArray();
 if(owners.length!==1||!owners[0].roles.includes('admin')||!/^[a-f0-9]{24}$/.test(owners[0].companyId))throw Error('Tek ve geçerli demo şirketi belirlenemedi; hiçbir veri silinmedi.');
 const owner=owners[0],companyId=owner.companyId;
 const folder=backupRoot+'/'+stamp;await mkdir(folder,{recursive:true,mode:0o700});
 const manifest={version:1,createdAt:new Date().toISOString(),database:db.databaseName,prefix,companyId,collections:[],preserved:['users','settings','sessions','audits','sequences']};
 for(const name of names){
  const docs=await db.collection(prefix+name).find({companyId}).limit(50001).toArray();
  if(docs.length>50000)throw Error('Demo bakım sınırı aşıldı; hiçbir veri silinmedi.');
  const text=EJSON.stringify(docs,{relaxed:false});
  if(Buffer.byteLength(text)>64*1024*1024)throw Error('Demo yedek boyutu sınırı aşıldı; hiçbir veri silinmedi.');
  await writeFile(folder+'/'+name+'.json',text,{mode:0o600});
  const saved=await readFile(folder+'/'+name+'.json','utf8');
  if(digest(saved)!==digest(text)||EJSON.parse(saved).length!==docs.length)throw Error('Yedek doğrulanamadı; hiçbir veri silinmedi.');
  manifest.collections.push({name,count:docs.length,sha256:digest(text)});
 }
 const manifestText=JSON.stringify(manifest,null,2)+'\n';await writeFile(folder+'/manifest.json',manifestText,{mode:0o600});
 console.log('Yedek doğrulandı. Silinecek kayıt sayıları: '+JSON.stringify(manifest.collections.map(c=>({collection:c.name,count:c.count}))));
 const deleted={};
 await client.withSession(session=>session.withTransaction(async()=>{
  for(const item of manifest.collections){
   const collection=db.collection(prefix+item.name);
   if(await collection.countDocuments({companyId},{session})!==item.count)throw Error('Yedek sonrasında veri değişti; silme geri alındı.');
   const result=await collection.deleteMany({companyId},{session});
   if(result.deletedCount!==item.count)throw Error('Silme sayısı uyuşmadı; işlem geri alındı.');
   deleted[item.name]=result.deletedCount;
  }
  await audits.insertOne({companyId,userId:owner._id.toString(),event:'demo_business_data_reset',details:{deleted,backup:stamp,manifestSha256:digest(manifestText),preserved:manifest.preserved},at:new Date()},{session});
 }));
 for(const name of names)if(await db.collection(prefix+name).countDocuments({companyId})!==0)throw Error('Bakım sonrası sıfır kontrolü başarısız; yedeği koruyun.');
 const result={ok:true,at:new Date().toISOString(),backup:stamp,deleted,preserved:manifest.preserved};
 await writeFile(resultPath,JSON.stringify(result,null,2)+'\n',{mode:0o600});console.log('PASS: Demo iş kayıtları sıfırlandı; kullanıcılar, ayarlar, denetim geçmişi ve numara sayaçları korundu.');
}
try{await mkdir(backupRoot,{recursive:true});await writeFile(resultPath,JSON.stringify({ok:false,running:true,at:new Date().toISOString()}));await run();}
catch(e){await writeFile(resultPath,JSON.stringify({ok:false,running:false,at:new Date().toISOString(),error:e.message}),{mode:0o600}).catch(()=>{});console.error('Demo sıfırlama tamamlanamadı: '+e.message);process.exitCode=1;}
finally{await client.close();}
