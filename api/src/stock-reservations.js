import { ObjectId } from 'mongodb';
import { records } from './db.js';
import { fail } from './domain.js';
export async function reservation(companyId,lines,warehouseId,sign,session){
 const location=warehouseId||'main';
 for(const l of lines){
  const p=await records.findOne({_id:new ObjectId(l.productId),module:'products',companyId,deleted:{$ne:true}},{session});fail(p,'Urun bulunamadi.');
  const positions=p.data.locations||{main:p.data.quantity||0},reserved={...(p.data.reserved||{})},current=reserved[location]||0,next=Math.round((current+sign*l.quantity)*1000)/1000;
  fail(next>=0&&(sign<0||next<=(positions[location]||0)),`${p.data.name}: rezerve edilebilir stok yetersiz.`,409);reserved[location]=next;
  const r=await records.updateOne({_id:p._id,companyId,version:p.version},{$set:{'data.reserved':reserved,updatedAt:new Date()},$inc:{version:1}},{session});fail(r.modifiedCount===1,'Urun stogu degisti.',409);
 }
}
