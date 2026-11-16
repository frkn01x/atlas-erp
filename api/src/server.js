import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { initialize, client, db, records, users, sessions, audits, objectId, transaction, audit } from './db.js';
import { Fault, fail, hashPassword, verifyPassword, hashToken, validateInput, oidPattern, csv, literalRegex } from './domain.js';
import { modules, moduleMap, roles, allowed } from '../../shared/modules.js';
import { execute, references } from './workflows.js';
import { publicFeatures,privateFeatures } from './feature-routes.js';
import { creationChecks } from './operations.js';
import { startMailWorker,queueCampaign } from './mailer.js';
import { normalizePermissions } from '../../shared/access.js';
import {aiPrivate,aiPublic} from './ai-routes.js';
import {observeHttp,startMetrics} from './observability.js';
import {privacyVersion,privacyScope} from '../../shared/privacy-notice.js';
import {payments,refreshPayment} from './commerce.js';
import {startPaymentReconciler} from './payment-reconciliation.js';
const app=express();app.disable('x-powered-by');app.set('trust proxy',2);app.use(observeHttp);app.use(helmet());app.use(express.json({limit:'2mb'}));app.use(cookieParser());
app.use('/api',rateLimit({windowMs:60000,limit:500,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Cok fazla istek; bir dakika sonra tekrar deneyin.'}}));
app.get('/api/health',async(req,res)=>{try{await db.command({ping:1});res.json({ok:true});}catch{res.status(503).json({ok:false});}});
app.use('/api/public',publicFeatures);
app.use('/api/public/ai',aiPublic);
app.use('/api',(req,res,next)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.get('X-ERP-Request')!=='1')return res.status(403).json({error:'Istek dogrulanamadi.'});next();});
const cookie={httpOnly:true,sameSite:'strict',secure:process.env.COOKIE_SECURE==='true',path:'/api',maxAge:8*3600000};
function publicUser(u){return {id:u._id.toString(),name:u.name,email:u.email,roles:u.roles,modulePermissions:u.modulePermissions||{},knowledgePermissions:u.knowledgePermissions||{},authzVersion:u.authzVersion??0,companyId:u.companyId,companyName:u.companyName,active:u.active};}
app.post('/api/auth/login',rateLimit({windowMs:15*60000,limit:15,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Cok fazla giris denemesi; 15 dakika sonra tekrar deneyin.'}}),async(req,res)=>{
 fail(req.body.privacyAccepted===true,'Giris icin demo bilgilendirmesindeki kutuyu isaretleyin.',400);
 fail(req.body.privacyVersion===privacyVersion,'Bilgilendirme metni guncellendi; sayfayi yenileyip tekrar onaylayin.',409);
 const {email,password}=req.body;fail(typeof email==='string'&&email.length<=254,'E-posta gerekli.');
 const user=await users.findOne({email:email.trim().toLowerCase(),active:true});
 // Bilinmeyen kullanicilar icin de ayni maliyetli parola islemi.
 const dummy='00000000000000000000000000000000:'+('00'.repeat(64));
 const valid=verifyPassword(password,user?.passwordHash||dummy);fail(user&&valid,'E-posta veya parola yanlis.',401);
 const token=randomBytes(32).toString('hex');
 await transaction(async session=>{
  // Serialize issuance with password/permission changes on the same user row.
  const guard=await users.updateOne({_id:user._id,active:true,passwordHash:user.passwordHash,authzVersion:user.authzVersion??0},{$inc:{sessionIssueCounter:1}},{session});
  fail(guard.modifiedCount===1,'Hesap bilgileriniz degisti; tekrar giris yapin.',401);
  await sessions.insertOne({tokenHash:hashToken(token),userId:user._id,authzVersion:user.authzVersion??0,privacyVersion,expiresAt:new Date(Date.now()+cookie.maxAge)},{session});
  await audit(user,'demo_login_consent',{version:privacyVersion,scope:privacyScope,demoOnly:true},session);
 });
 res.cookie('erp_session',token,cookie).json(publicUser(user));
});
app.use('/api',async(req,res,next)=>{
 const token=req.cookies.erp_session;fail(typeof token==='string'&&token.length===64,'Oturum acin.',401);
 const session=await sessions.findOne({tokenHash:hashToken(token),expiresAt:{$gt:new Date()}});fail(session&&session.privacyVersion===privacyVersion,'Oturum suresi doldu veya demo bilgilendirmesi guncellendi; tekrar giris yapin.',401);
 const user=await users.findOne({_id:session.userId,active:true});fail(user,'Oturum acin.',401);
 fail(Number.isInteger(session.authzVersion)&&session.authzVersion===(user.authzVersion??0),'Hesap bilgileriniz degisti; tekrar giris yapin.',401);
 req.user=user;next();
});
app.get('/api/auth/me',(req,res)=>res.json(publicUser(req.user)));
app.use('/api',privateFeatures);
app.use('/api/ai',aiPrivate);
app.post('/api/auth/logout',async(req,res)=>{await sessions.deleteOne({tokenHash:hashToken(req.cookies.erp_session)});res.clearCookie('erp_session',{...cookie,maxAge:undefined}).json({ok:true});});
app.post('/api/auth/password',async(req,res)=>{
 fail(verifyPassword(req.body.current,req.user.passwordHash),'Mevcut parola yanlis.',403);
 const passwordHash=hashPassword(req.body.password);
 await transaction(async session=>{
  const changed=await users.updateOne({_id:req.user._id,active:true,passwordHash:req.user.passwordHash,authzVersion:req.user.authzVersion??0},{$set:{passwordHash},$inc:{authzVersion:1}},{session});
  fail(changed.modifiedCount===1,'Hesap bilgileriniz degisti; tekrar giris yapin.',409);
  await sessions.deleteMany({userId:req.user._id},{session});await audit(req.user,'password_changed',{},session);
 });
 res.clearCookie('erp_session',{...cookie,maxAge:undefined}).json({ok:true});
});
app.get('/api/modules',(req,res)=>res.json(modules.filter(m=>m.enabled!==false&&allowed(req.user,m))));
app.get('/api/lookups/:module',async(req,res)=>{
 const target=req.params.module;
 fail(req.user.roles.includes('admin')||req.user.modulePermissions?.[target]!=='none','Bu modulun iliskili kayitlarina erisiminiz kaldirildi.',403);
 const permitted=modules.some(m=>allowed(req.user,m)&&m.fields.some(f=>f.relation===target||(['lines','components'].includes(f.type)&&target==='products')));
 fail(permitted,'Iliskili kayitlara erisim yok.',403);
 const q={companyId:req.user.companyId,module:target,deleted:{$ne:true}};
 if(req.query.q){fail(typeof req.query.q==='string'&&req.query.q.length<=100,'Arama gecersiz.');q['data.name']={$regex:literalRegex(req.query.q),$options:'i'};}
 const rows=await records.find(q,{projection:{'data.name':1,'data.sku':1,'data.price':1,'data.cost':1,'data.taxRate':1}}).sort({'data.name':1}).limit(100).toArray();
 res.json(rows);
});
app.get('/api/catalog',async(req,res)=>{admin(req);res.json(JSON.parse(await readFile(new URL('../../shared/catalog.json',import.meta.url),'utf8')));});
app.get('/api/dashboard',async(req,res)=>{
 const accessible=modules.filter(m=>m.enabled!==false&&allowed(req.user,m)).map(m=>m.id);
 const counts=await records.aggregate([{$match:{companyId:req.user.companyId,module:{$in:accessible},deleted:{$ne:true}}},{$group:{_id:'$module',count:{$sum:1}}}]).toArray();
 let accounting;
 if(accessible.includes('journal'))accounting=await records.aggregate([{$match:{companyId:req.user.companyId,module:'journal'}},{$unwind:'$data.lines'},{$group:{_id:'$data.lines.account',debit:{$sum:'$data.lines.debit'},credit:{$sum:'$data.lines.credit'}}}]).toArray();
 res.json({counts,accounting});
});
function moduleAccess(req,write=false){const m=moduleMap[req.params.module];fail(m,'Modul bulunamadi.',404);fail(allowed(req.user,m,write)&&!(write&&m.readOnly),'Bu islem icin yetkiniz yok.',403);return m;}
const queryFor=req=>({companyId:req.user.companyId,module:req.params.module,deleted:{$ne:true}});
function checkId(id){fail(typeof id==='string'&&oidPattern.test(id),'Gecersiz kayit kimligi.');return objectId(id);}
function filter(req){const q=queryFor(req);if(req.query.q){fail(typeof req.query.q==='string'&&req.query.q.length<=100,'Arama cok uzun.');q['data.name']={$regex:literalRegex(req.query.q),$options:'i'};}return q;}
app.get('/api/records/:module/export',async(req,res)=>{
 const m=moduleAccess(req);const q=filter(req);const count=await records.countDocuments(q);fail(count<=10000,'Disari aktarma 10.000 kayitla sinirli; aramayi daraltin.');
 const rows=await records.find(q).sort({createdAt:-1}).toArray();const keys=['id','state','version',...m.fields.map(f=>f.key),...(m.id==='products'?['quantity']:[]),...(['sales','purchases','invoices','pos','ecommerce'].includes(m.id)?['subtotal','tax','total']:[]),...(['inventory','journal'].includes(m.id)?['name','quantity','balance','total','lines','sourceId']:[])];
 res.type('text/csv').attachment(`${m.id}.csv`).send(csv(rows.map(r=>({id:r._id.toString(),state:r.state,version:r.version,...r.data})),keys));
});
app.get('/api/records/:module',async(req,res)=>{
 moduleAccess(req);const page=Math.max(1,Math.min(10000,Math.floor(Number(req.query.page)||1)));const limit=50;const q=filter(req);
 const [items,total]=await Promise.all([records.find(q).sort({updatedAt:-1,_id:-1}).skip((page-1)*limit).limit(limit).toArray(),records.countDocuments(q)]);res.json({items,total,page,limit});
});
app.get('/api/records/:module/:id',async(req,res)=>{moduleAccess(req);const r=await records.findOne({...queryFor(req),_id:checkId(req.params.id)});fail(r,'Kayit bulunamadi.',404);res.json(r);});
app.post('/api/records/:module',async(req,res)=>{
 const m=moduleAccess(req,true);const data=validateInput(m.id,req.body);
 const doc=await transaction(async session=>{
  await references(req.user.companyId,m,data,session);await creationChecks(req.user,m.id,data,session);const now=new Date();const r={_id:objectId(),companyId:req.user.companyId,module:m.id,data,state:m.states[0],version:1,createdAt:now,updatedAt:now,createdBy:req.user._id.toString()};
  if(m.id==='products')r.data.quantity=0;
  await records.insertOne(r,{session});await audit(req.user,'record_created',{module:m.id,id:r._id.toString()},session);return r;
 });res.status(201).json(doc);
});
app.put('/api/records/:module/:id',async(req,res)=>{
 const m=moduleAccess(req,true);const _id=checkId(req.params.id);const data=validateInput(m.id,req.body);const version=req.body.version;fail(Number.isInteger(version),'Kayit surumu gerekli.');
 await transaction(async session=>{
  const r=await records.findOne({...queryFor(req),_id},{session});fail(r,'Kayit bulunamadi.',404);fail(r.state===m.states[0]||m.id==='website','Isleme alinmis belgeler degistirilemez.',409);fail(r.version===version,'Kayit degisti, yenileyin.',409);
  await references(req.user.companyId,m,data,session);await creationChecks(req.user,m.id,data,session,_id);
  const preserve={products:['quantity','locations','reserved'],employees:['leaveUsed'],fleet:['totalCost'],equipment:['lastMaintenance','maintenanceCost']};for(const key of preserve[m.id]||[])if(r.data[key]!==undefined)data[key]=r.data[key];
  if(m.id==='employees')fail((data.leaveAllowance??20)>=(data.leaveUsed||0),'Izin hakki kullanilan gunden az olamaz.');
  const result=await records.updateOne({...queryFor(req),_id,version},{$set:{data,updatedAt:new Date()},$inc:{version:1}},{session});fail(result.modifiedCount===1,'Kayit degisti.',409);await audit(req.user,'record_updated',{module:m.id,id:req.params.id},session);
 });res.json({ok:true});
});
app.delete('/api/records/:module/:id',async(req,res)=>{
 const m=moduleAccess(req,true);const _id=checkId(req.params.id);const version=req.body.version;fail(Number.isInteger(version),'Kayit surumu gerekli.');
 await transaction(async session=>{
  const r=await records.findOne({...queryFor(req),_id},{session});fail(r,'Kayit bulunamadi.',404);fail(r.state===m.states[0],'Isleme alinmis belge arsivlenemez.',409);
  // Iliskili ana veriler, gecmis belgeler bozulmasin diye silinmez.
  fail(!['products','contacts','employees','projects'].includes(m.id),'Ana veriler bu surumde silinemez.',409);
  const result=await records.updateOne({...queryFor(req),_id,version},{$set:{deleted:true,updatedAt:new Date()},$inc:{version:1}},{session});fail(result.modifiedCount===1,'Kayit degisti.',409);await audit(req.user,'record_archived',{module:m.id,id:req.params.id},session);
 });res.json({ok:true});
});
app.post('/api/records/:module/:id/actions/:action',async(req,res)=>{
 const m=moduleAccess(req,true);const id=req.params.id;checkId(id);fail(Number.isInteger(req.body.version),'Kayit surumu gerekli.');
 const r=await records.findOne({...queryFor(req),_id:objectId(id)});fail(r,'Kayit bulunamadi.',404);
 fail(r.version===req.body.version,'Kayit degisti; yenileyin.',409);
 if(m.id==='pos'&&req.params.action==='checkout')throw new Fault(409,'Tahsilat icin POS kasa ekranini kullanin.');
 if(m.id==='emailMarketing'&&req.params.action==='sendCampaign')return res.json(await queueCampaign(req.user,id));
 // Siparis yetkisi tek basina fiziksel stok hareketi yetkisi vermez.
 if(['deliver','receive'].includes(req.params.action))fail(allowed(req.user,moduleMap.stockTransfers,true),'Bu islem icin depo islem yetkisi de gerekli.',403);
 res.json(await execute(req.user,id,req.params.action,req.body.version));
});
function admin(req){fail(req.user.roles.includes('admin'),'Yonetici yetkisi gerekli.',403);}
app.get('/api/admin/users',async(req,res)=>{admin(req);res.json((await users.find({companyId:req.user.companyId}).toArray()).map(publicUser));});
app.post('/api/admin/users',async(req,res)=>{
 admin(req);const {email,name,password,roles:assigned}=req.body;
 fail(typeof email==='string'&&email.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'E-posta gecersiz.');fail(typeof name==='string'&&name.trim().length>0&&name.length<=100,'Ad gerekli.');fail(Array.isArray(assigned)&&assigned.length<=roles.length&&assigned.every(r=>roles.includes(r)),'Roller gecersiz.');
 const passwordHash=hashPassword(password);const doc={_id:objectId(),email:email.trim().toLowerCase(),name:name.trim(),roles:[...new Set(assigned)],authzVersion:1,passwordHash,companyId:req.user.companyId,companyName:req.user.companyName,active:true,createdAt:new Date()};
 try{doc.modulePermissions=normalizePermissions(req.body.modulePermissions||{},moduleMap);doc.knowledgePermissions=normalizePermissions(req.body.knowledgePermissions||{},moduleMap,true);}catch(e){throw new Fault(400,e.message);}
 await transaction(async session=>{await users.insertOne(doc,{session});await audit(req.user,'user_created',{id:doc._id.toString(),roles:doc.roles},session);});res.status(201).json(publicUser(doc));
});
app.patch('/api/admin/users/:id',async(req,res)=>{
 admin(req);const _id=checkId(req.params.id);fail(!_id.equals(req.user._id),'Kendi yonetici yetkinizi bu ekrandan degistiremezsiniz.');
 fail(Number.isInteger(req.body.authzVersion),'Yetki surumu gerekli; kullanici listesini yenileyin.');
 const update={};if(req.body.roles!==undefined){fail(Array.isArray(req.body.roles)&&req.body.roles.length<=roles.length&&req.body.roles.every(r=>roles.includes(r)),'Roller gecersiz.');update.roles=[...new Set(req.body.roles)];}
 try{for(const field of ['modulePermissions','knowledgePermissions'])if(req.body[field]!==undefined)update[field]=normalizePermissions(req.body[field],moduleMap,field==='knowledgePermissions');}catch(e){throw new Fault(400,e.message);}
 if(req.body.active!==undefined){fail(typeof req.body.active==='boolean','Gecersiz durum.');update.active=req.body.active;}
 if(req.body.password!==undefined)update.passwordHash=hashPassword(req.body.password);fail(Object.keys(update).length,'Degisiklik gerekli.');
 await transaction(async session=>{const r=await users.updateOne({_id,companyId:req.user.companyId,authzVersion:req.body.authzVersion},{$set:update,$inc:{authzVersion:1}},{session});fail(r.matchedCount,'Kullanici bulunamadi veya yetkileri degisti; listeyi yenileyin.',409);await sessions.deleteMany({userId:_id},{session});await audit(req.user,'user_updated',{id:req.params.id,fields:Object.keys(update)},session);});res.json({ok:true});
});
app.get('/api/admin/audit',async(req,res)=>{admin(req);res.json(await audits.find({companyId:req.user.companyId}).sort({at:-1}).limit(200).toArray());});
app.use((req,res)=>res.status(404).json({error:'Adres bulunamadi.'}));
app.use((err,req,res,next)=>{
 if(err.code===11000)return res.status(409).json({error:'Bu e-posta veya stok kodu zaten kullaniliyor.'});
 const status=err instanceof Fault?err.status:err.type==='entity.parse.failed'?400:err.type==='entity.too.large'?413:500;
 if(status===500)console.error(JSON.stringify({event:'request_failed',type:err.name,code:err.code}));
 res.status(status).json({error:status===500?'Sunucu islemi tamamlayamadi.':err instanceof Fault?err.message:'Gecersiz istek.'});
});
try{await initialize();startMailWorker();const stopPaymentReconciler=startPaymentReconciler({payments,refresh:refreshPayment});const metrics=startMetrics();const server=app.listen(3000,'0.0.0.0',()=>console.log('ERP API ready :3000'));server.requestTimeout=45000;server.headersTimeout=15000;for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{stopPaymentReconciler();metrics.close();server.close(async()=>{await client.close();process.exit(0);});});}
catch(err){console.error(JSON.stringify({event:'startup_failed',type:err.name,code:err.code,codeName:err.codeName,message:err instanceof Fault?err.message:'Atlas baglantisini, IP izinlerini, koleksiyon indekslerini ve veritabani kullanicisini kontrol edin.'}));process.exit(1);}

