import { db, audit, transaction } from './db.js';
import { fail } from './domain.js';
import { seal, unseal, vaultKey } from './vault.js';
import { settingGroups, secretFields } from '../../shared/settings.js';
import {providerUrl} from './ai-transport.js';
export const settings=db.collection((process.env.COLLECTION_PREFIX||'atlas_erp_')+'settings');
export async function readSettings(companyId,group,decrypt=false){
 fail(Object.hasOwn(settingGroups,group),'Ayar grubu bulunamadi.',404);
 const doc=await settings.findOne({_id:`${companyId}:${group}`});const values={...(doc?.values||{})},configured={};
 for(const k of secretFields[group]){configured[k]=!!values[k];if(values[k]&&decrypt)values[k]=unseal(values[k],await vaultKey(),`${companyId}:${group}:${k}`);else delete values[k];}
 return {values,configured,version:doc?.version||0};
}
export async function saveSettings(user,group,input){
 fail(Object.hasOwn(settingGroups,group),'Ayar grubu bulunamadi.',404);fail(input&&Number.isInteger(input.version),'Ayar surumu gerekli.');
 fail(!input.clear||(Array.isArray(input.clear)&&input.clear.every(k=>typeof k==='string')),'Temizlenecek alan listesi gecersiz.');
 const permitted=settingGroups[group].fields.map(f=>f[0]);const changes={};
 for(const k of Object.keys(input.values||{})){fail(permitted.includes(k),'Bilinmeyen ayar alani.');const v=input.values[k];fail(typeof v==='string'&&v.length<=10000,'Ayar degeri gecersiz.');if(secretFields[group].includes(k)){if(v)changes[k]=seal(v,await vaultKey(),`${user.companyId}:${group}:${k}`);}else changes[k]=v.trim();}
 if(['iyzico','smtp'].includes(group)&&changes.publicUrl){let u;try{u=new URL(changes.publicUrl);}catch{}fail(u&&u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&u.pathname==='/', 'Yalnizca gecerli HTTPS ana adresini girin.');changes.publicUrl=u.origin;}
 if(group==='smtp'){
  if(changes.port)fail(['25','465','587','2525','1025'].includes(changes.port),'Gecerli SMTP portunu secin.');
  if(changes.host)fail(/^[a-zA-Z0-9.-]+$/.test(changes.host)&&!['localhost','metadata.google.internal'].includes(changes.host)&&!/^\d/.test(changes.host),'SMTP sunucusu alan adi olmali.');
  if(changes.secure)fail(['yes','no'].includes(changes.secure),'TLS yes veya no olmali.');
  if(changes.from)fail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.from),'Gonderen e-posta gecersiz.');
 }
 if(group==='company'&&changes.invoicePrefix)fail(/^[A-Z]{3}$/.test(changes.invoicePrefix),'Fatura on eki 3 buyuk harf olmali.');
 if(group==='ai'&&changes.baseUrl)providerUrl(changes.baseUrl);
 if(group==='ai'&&changes.model)fail(changes.model.length<=200&&!/[\r\n]/.test(changes.model),'Model kimligi gecersiz.');
 if(group==='ai'&&changes.tokenParameter)fail(['max_tokens','max_completion_tokens'].includes(changes.tokenParameter),'Token parametresi gecersiz.');
 if(group==='ai'&&changes.temperature)fail(Number.isFinite(Number(changes.temperature))&&Number(changes.temperature)>=0&&Number(changes.temperature)<=2,'Sicaklik 0-2 araliginda olmali.');
 await transaction(async session=>{
  const _id=`${user.companyId}:${group}`,doc=await settings.findOne({_id},{session});fail((doc?.version||0)===input.version,'Ayarlar degisti; yenileyin.',409);
  const values={...(doc?.values||{}),...changes};for(const k of input.clear||[]){fail(secretFields[group].includes(k),'Bu alan temizlenemez.');delete values[k];}
  if(doc)await settings.updateOne({_id,version:doc.version},{$set:{values,updatedAt:new Date()},$inc:{version:1}},{session});else await settings.insertOne({_id,companyId:user.companyId,group,values,version:1,updatedAt:new Date()},{session});
  await audit(user,'settings_updated',{group,fields:Object.keys(changes),cleared:input.clear||[]},session);
 });return readSettings(user.companyId,group);
}
