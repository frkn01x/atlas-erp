export const blockTypes={hero:'Baslik / kapak',text:'Metin',products:'Urun vitrini',contact:'Iletisim',button:'Buton',image:'Gorsel'};
export const defaultBlock=type=>({id:globalThis.crypto.randomUUID(),type,title:type==='hero'?'Isletmenize hos geldiniz':blockTypes[type],body:'',label:'Magazayi incele',href:'#products',imageUrl:'',theme:'light'});
export function safeHref(v){return typeof v==='string'&&(v.startsWith('#')||/^\/(?!\/)/.test(v)||/^https:\/\//.test(v));}
export function validBlocks(blocks){
 if(!Array.isArray(blocks)||blocks.length>50)throw new Error('En fazla 50 blok kullanilabilir.');
 const ids=new Set();
 return blocks.map(b=>{
  if(!b||!Object.hasOwn(blockTypes,b.type)||typeof b.id!=='string'||b.id.length>80||ids.has(b.id))throw new Error('Gecersiz veya yinelenen blok.');ids.add(b.id);
  const out={id:b.id,type:b.type,theme:['light','dark','sage'].includes(b.theme)?b.theme:'light'};
  for(const k of ['title','body','label','href','imageUrl']){const v=b[k]??'';if(typeof v!=='string'||v.length>(k==='body'?15000:600))throw new Error('Blok alani cok uzun.');out[k]=v;}
  if(out.href&&!safeHref(out.href))throw new Error('Buton adresi guvenli bir HTTPS, yerel yol veya sayfa baglantisi olmali.');
  if(out.imageUrl&&!/^https:\/\//.test(out.imageUrl))throw new Error('Gorsel adresi HTTPS olmali.');
  return out;
 });
}
