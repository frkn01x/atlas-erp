import https from 'node:https';
import http from 'node:http';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
import {Fault,fail} from './domain.js';
export function publicAddress(ip){
 if(isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&[0,168].includes(b)||a===100&&b>=64&&b<=127||a===198&&[18,19].includes(b));}
 if(isIP(ip)===6){const s=ip.toLowerCase();return !s.startsWith('::')&&!s.startsWith('fc')&&!s.startsWith('fd')&&!s.startsWith('fe8')&&!s.startsWith('fe9')&&!s.startsWith('fea')&&!s.startsWith('feb')&&!s.startsWith('ff')&&/^[23]/.test(s);}
 return false;
}
export function providerUrl(value,{testOrigin=process.env.AI_TEST_ORIGIN||'',database=process.env.MONGODB_DB||''}={}){
 let u;try{u=new URL(value);}catch{throw new Fault(400,'AI API ana adresi gecersiz.');}
 const fixture=testOrigin&&/(test|acceptance)/i.test(database)&&u.href.replace(/\/$/,'')===testOrigin.replace(/\/$/,'');
 fail((u.protocol==='https:'||fixture)&&!u.username&&!u.password&&!u.search&&!u.hash&&u.hostname&&!u.hostname.endsWith('.local')&&u.pathname.length<=160,'AI API adresi kimlik bilgisi veya sorgu icermeyen HTTPS adresi olmali.');
 if(isIP(u.hostname.replace(/^\[|\]$/g,'')))fail(fixture||publicAddress(u.hostname.replace(/^\[|\]$/g,'')),'Ozel ag AI adreslerine izin verilmez.');
 if(!fixture)fail(!['localhost','metadata.google.internal'].includes(u.hostname),'AI hedefi genel internet sunucusu olmali.');
 return {url:u,fixture};
}
async function requestJson(base,path,body,apiKey){
 const {url,fixture}=providerUrl(base);const addresses=await lookup(url.hostname,{all:true});
 fail(fixture||addresses.length>0&&addresses.every(a=>publicAddress(a.address)),'AI sunucusu ozel/ag ici adrese cozuldu.',400);
 const chosen=addresses.find(a=>a.family===4)||addresses[0];fail(chosen,'AI sunucusu bulunamadi.',502);
 const target=new URL(url.href.replace(/\/$/,'')+path);const raw=JSON.stringify(body);const agent=target.protocol==='https:'?https:http;
 return new Promise((resolve,reject)=>{
  const req=agent.request(target,{method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(raw),Authorization:`Bearer ${apiKey}`},servername:url.hostname,lookup:(hostname,options,callback)=>options?.all?callback(null,[chosen]):callback(null,chosen.address,chosen.family),timeout:30000},res=>{
   const chunks=[];let size=0;res.on('data',chunk=>{size+=chunk.length;if(size>2*1024*1024){req.destroy();reject(new Fault(502,'AI yaniti boyut sinirini asti.'));}else chunks.push(chunk);});res.on('end',()=>{if(res.statusCode<200||res.statusCode>=300)return reject(new Fault(502,`AI saglayicisi istegi reddetti (HTTP ${res.statusCode}). Model ve hesap ayarlarini kontrol edin.`));try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));}catch{reject(new Fault(502,'AI saglayicisi gecersiz JSON dondurdu.'));}});
  });const deadline=setTimeout(()=>req.destroy(new Error('deadline')),35000);req.once('close',()=>clearTimeout(deadline));req.on('timeout',()=>req.destroy(new Error('timeout')));req.on('error',()=>reject(new Fault(502,'AI baglantisi kurulamadi veya zaman asimina ugradi.')));req.end(raw);
 });
}
export async function complete(config,messages,{send=requestJson,maxTokens=700}={}){
 fail(config.baseUrl&&config.apiKey&&config.model,'AI API adresi, anahtar ve modeli Ayarlar ekranindan girin.',409);
 fail(typeof config.model==='string'&&config.model.length<=200&&!/[\r\n]/.test(config.model),'AI model adi gecersiz.');
 const payload={model:config.model,messages,stream:false};const parameter=config.tokenParameter||'max_tokens';fail(['max_tokens','max_completion_tokens'].includes(parameter),'AI token parametresi gecersiz.');payload[parameter]=maxTokens;
 if(config.temperature){const t=Number(config.temperature);fail(Number.isFinite(t)&&t>=0&&t<=2,'AI sicaklik degeri gecersiz.');payload.temperature=t;}
 const response=await send(config.baseUrl,'/chat/completions',payload,config.apiKey);
 const content=response.choices?.[0]?.message?.content;const text=Array.isArray(content)?content.filter(p=>p.type==='text').map(p=>p.text).join('\n'):content;fail(typeof text==='string'&&text.length>0&&text.length<=20000,'AI saglayicisi metin yaniti dondurmedi.',502);return text;
}
export function parseAiObject(text){try{const trimmed=text.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');const value=JSON.parse(trimmed);fail(value&&typeof value==='object'&&!Array.isArray(value),'AI nesne yaniti gerekli.',502);return value;}catch(e){if(e instanceof Fault)throw e;throw new Fault(502,'AI yaniti beklenen JSON biciminde degil. Baska bir model deneyin.');}}
