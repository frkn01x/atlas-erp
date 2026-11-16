export function moduleLevel(user,module){
 if(user.roles?.includes('admin'))return module.readOnly?'read':'write';
 const override=user.modulePermissions?.[module.id];
 if(override==='none')return 'none';
 if(override==='read')return 'read';
 if(override==='write')return module.readOnly?'read':'write';
 return user.roles?.includes('manager')||module.roles.some(r=>user.roles?.includes(r))?(module.readOnly?'read':'write'):'none';
}
export function hasModule(user,module,write=false){const level=moduleLevel(user,module);return write?level==='write':level!=='none';}
export function knowledgeAllowed(user,module){
 if(user.roles?.includes('admin'))return true;
 const grant=user.knowledgePermissions?.[module.id];
 return grant==='grant'?true:grant==='deny'?false:hasModule(user,module);
}
export function normalizePermissions(input,moduleMap,knowledge=false){
 if(input===undefined)return undefined;
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Yetki listesi nesne olmali.');
 const out={};
 for(const [id,value]of Object.entries(input)){
  const m=Object.hasOwn(moduleMap,id)?moduleMap[id]:null;if(!m||m.enabled===false)throw new Error('Bilinmeyen modul yetkisi.');
  if(!(knowledge?['inherit','grant','deny']:['default','none','read','write']).includes(value))throw new Error('Gecersiz yetki seviyesi.');
  if(!knowledge&&value==='write'&&m.readOnly)throw new Error('Salt okunur module islem yetkisi verilemez.');
  if(!['inherit','default'].includes(value))out[id]=value;
 }
 return out;
}
