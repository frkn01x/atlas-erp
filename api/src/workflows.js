import { ObjectId } from 'mongodb';
import { records, transaction, audit } from './db.js';
import { fail, nextState, posting, payment, balanced } from './domain.js';
import { moduleMap } from '../../shared/modules.js';
import { operationEffects } from './operations.js';
import { reservation } from './stock-reservations.js';
export async function references(companyId,m,data,session){
 const refs=[];
 for(const f of m.fields){if(f.type==='relation'&&data[f.key])refs.push([f.relation,data[f.key]]);}
 for(const line of [...(data.lines||[]),...(data.components||[])])refs.push(['products',line.productId]);
 if(data.productId)refs.push(['products',data.productId]);
 for(const [module,id] of refs){fail(await records.findOne({_id:new ObjectId(id),companyId,module,deleted:{$ne:true}},{session}),`Iliskili ${module} kaydi bulunamadi.`);}
}
export async function insert(user,module,data,session,state='draft'){
 const now=new Date();const doc={_id:new ObjectId(),companyId:user.companyId,module,data,state,version:1,createdAt:now,updatedAt:now,createdBy:user._id.toString()};
 await records.insertOne(doc,{session});return doc;
}
export async function move(user,productId,quantity,sourceId,session,warehouseId='main'){
 const product=await records.findOne({_id:new ObjectId(productId),companyId:user.companyId,module:'products',deleted:{$ne:true}},{session});
 fail(product,'Urun bulunamadi.');
 const q=product.data.quantity||0,locations={...(product.data.locations||{main:q})};quantity=Math.round(quantity*1000)/1000;
 const local=Math.round(((locations[warehouseId]||0)+quantity)*1000)/1000;const next=Math.round((q+quantity)*1000)/1000;fail(local>=(product.data.reserved?.[warehouseId]||0)&&next>=0,`${product.data.name}: secilen depoda kullanilabilir stok yetersiz.`,409);locations[warehouseId]=local;
 const result=await records.updateOne({_id:product._id,companyId:user.companyId,version:product.version},{$set:{'data.quantity':next,'data.locations':locations,updatedAt:new Date()},$inc:{version:1}},{session});fail(result.modifiedCount===1,'Stok degisti, tekrar deneyin.',409);
 await insert(user,'inventory',{name:product.data.name,productId,quantity,sourceId,warehouseId,balance:next,locationBalance:local},session,'done');
}
async function journal(user,invoice,lines,kind,session){await insert(user,'journal',{name:`${invoice.data.name} / ${kind}`,invoiceId:invoice._id.toString(),lines:balanced(lines),total:invoice.data.total},session,'posted');}
export async function execute(user,id,action,version){
 return transaction(async session=>{
  const r=await records.findOne({_id:new ObjectId(id),companyId:user.companyId,deleted:{$ne:true}},{session});fail(r,'Kayit bulunamadi.',404);fail(r.version===version,'Kayit degisti. Yenileyip tekrar deneyin.',409);
  const m=moduleMap[r.module];let state=nextState(m,r.state,action);const flow=m.flow||m.id;let linked;
  if(r.module==='ecommerce'&&action==='deliver'&&r.data.stockReserved){await reservation(user.companyId,r.data.lines,r.data.warehouseId||'main',-1,session);state='invoiced';}
  if(['deliver','receive'].includes(action)){
   for(const l of r.data.lines)await move(user,l.productId,l.quantity*(action==='receive'?1:-1),id,session,r.data.warehouseId||'main');
  }
  if(action==='complete'&&flow==='manufacturing'){
   for(const l of r.data.components)await move(user,l.productId,-l.quantity*r.data.quantity,id,session,r.data.warehouseId||'main');
   await move(user,r.data.productId,r.data.quantity,id,session,r.data.warehouseId||'main');
  }
  if(['invoice','bill'].includes(action)){
   fail(!r.linkedId,'Bu belge icin fatura zaten olusturuldu.',409);
   const invoice=await insert(user,'invoices',{...r.data,kind:action==='bill'?'vendor':'customer',sourceId:id},session);
   linked=invoice._id.toString();
  }
  if(flow==='invoices'){
   if(action==='post')await journal(user,r,posting(r.data),'invoice',session);
   if(action==='pay')await journal(user,r,payment(r.data),'payment',session);
   if(action==='reverse')await journal(user,r,posting(r.data).map(l=>({...l,debit:l.credit,credit:l.debit})),'reversal',session);
  }
  const effects=await operationEffects(user,r,action,session,{insert,move});linked=linked||effects.linkedId;
  if(r.module==='ecommerce'&&action==='deliver')effects.patch['data.stockReserved']=false;
  const result=await records.updateOne({_id:r._id,companyId:user.companyId,version},{$set:{state,updatedAt:new Date(),...effects.patch,...(linked?{linkedId:linked}:{})},$inc:{version:1}},{session});fail(result.modifiedCount===1,'Kayit eszamanli degisti.',409);
  await audit(user,'workflow',{module:r.module,id,action,from:r.state,to:state,linkedId:linked},session);
  return {state,linkedId:linked};
 });
}
