import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
let loaded;
export async function vaultKey(){
 if(loaded)return loaded;
 const path='/app/secrets/settings.key';
 await mkdir('/app/secrets',{recursive:true});
 try{loaded=await readFile(path);}catch(e){if(e.code!=='ENOENT')throw e;const key=randomBytes(32);try{await writeFile(path,key,{flag:'wx',mode:0o600});loaded=key;}catch(e){if(e.code!=='EEXIST')throw e;loaded=await readFile(path);}}
 if(loaded.length!==32)throw new Error('Ayar anahtari gecersiz.');return loaded;
}
export function seal(value,key,aad){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key,iv);c.setAAD(Buffer.from(aad));const data=Buffer.concat([c.update(value,'utf8'),c.final()]);return {iv:iv.toString('base64'),tag:c.getAuthTag().toString('base64'),data:data.toString('base64')};}
export function unseal(box,key,aad){const c=createDecipheriv('aes-256-gcm',key,Buffer.from(box.iv,'base64'));c.setAAD(Buffer.from(aad));c.setAuthTag(Buffer.from(box.tag,'base64'));return Buffer.concat([c.update(Buffer.from(box.data,'base64')),c.final()]).toString('utf8');}
