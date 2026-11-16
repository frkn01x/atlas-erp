// Expose validation explanations, never raw provider bodies or credentials.
export async function nesErrorDetail(response,apiKey){
 try{
  const reader=response.body?.getReader();if(!reader)return '';
  const chunks=[];let size=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16384)return '';chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
  const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
  const raw=new TextDecoder().decode(bytes);let parsed;try{parsed=JSON.parse(raw);}catch{return '';}
  const messages=[];
  const walk=(value,depth=0)=>{if(depth>5||messages.length>=8)return;if(typeof value==='string'){messages.push(value);return;}if(Array.isArray(value)){for(const item of value.slice(0,8))walk(item,depth+1);}else if(value&&typeof value==='object'){for(const [key,item] of Object.entries(value).slice(0,30)){if(/^(message|errorMessage|detail|title|description|errors|details|validationErrors)$/i.test(key))walk(item,depth+1);}}};
  walk(parsed);
  // Validation dictionaries commonly map field names to arrays of messages.
  for(const dict of [parsed.errors,parsed.validationErrors])if(dict&&typeof dict==='object'&&!Array.isArray(dict))for(const value of Object.values(dict).slice(0,8))walk(value,1);
  let text=[...new Set(messages)].join(' | ');if(apiKey)text=text.split(apiKey).join('[gizlendi]');
  return text.replace(/Bearer\s+[^\s"<>]+/gi,'Bearer [gizlendi]').replace(/\b[a-f0-9]{64}\b/gi,'[gizlendi]').replace(/<[^>]*>/g,' ').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,1200);
 }catch{return '';}
}
