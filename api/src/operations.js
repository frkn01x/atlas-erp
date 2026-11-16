import { records } from './db.js';
import { ObjectId } from 'mongodb';
import { fail, workingDays } from './domain.js';
export async function operationEffects(user,r,action,session,{insert,move}){
 const d=r.data,id=r._id.toString(),companyId=user.companyId,patch={};let linkedId;
 const get=async(module,key)=>{fail(typeof key==='string','Iliskili kayit gerekli.');const doc=await records.findOne({_id:new ObjectId(key),module,companyId,deleted:{$ne:true}},{session});fail(doc,'Iliskili kayit bulunamadi.');return doc;};
 const change=async(doc,set)=>{const result=await records.updateOne({_id:doc._id,companyId,version:doc.version},{$set:set,$inc:{version:1}},{session});fail(result.modifiedCount===1,'Iliskili kayit degisti.',409);};
 if(r.module==='crm'&&action==='quote'){
  fail(!r.linkedId,'Bu firsat icin teklif zaten olusturuldu.',409);fail(d.partnerId&&d.lines?.length,'Teklif icin cari ve urun satirlarini doldurun.');
  linkedId=(await insert(user,'sales',{name:d.name,partnerId:d.partnerId,lines:d.lines,subtotal:d.subtotal,tax:d.tax,total:d.total,sourceId:id},session))._id.toString();
 }
 if(r.module==='recruitment'&&action==='hire')linkedId=(await insert(user,'employees',{name:d.name,email:d.email||'',job:d.position||'',department:d.department||'',leaveAllowance:20,leaveUsed:0,sourceId:id},session,'active'))._id.toString();
 if(r.module==='attendance'&&action==='checkOut'){
  const end=d.checkOut?new Date(d.checkOut):new Date(),start=new Date(d.checkIn);fail(end>=start&&end-start<=86400000,'Puantaj araligi 0-24 saat olmali.');
  patch['data.checkOut']=end.toISOString();patch['data.hours']=Math.round((end-start)/36000)/100;
 }
 if(r.module==='leave'&&['approve','cancelLeave'].includes(action)){
  const emp=await get('employees',d.employeeId);const days=workingDays(d.startDate,d.endDate);fail(days>0,'Izin en az bir is gunu icermeli.');
  const used=emp.data.leaveUsed||0,allowance=emp.data.leaveAllowance??20;
  if(action==='approve'){
   const overlap=await records.findOne({companyId,module:'leave',state:'approved','data.employeeId':d.employeeId,'data.startDate':{$lte:d.endDate},'data.endDate':{$gte:d.startDate}},{session});fail(!overlap,'Onayli izinle tarih cakismasi var.',409);fail(used+days<=allowance,'Calisanin izin bakiyesi yetersiz.',409);
  }
  await change(emp,{'data.leaveUsed':Math.max(0,used+(action==='approve'?days:-days)),updatedAt:new Date()});patch['data.days']=days;
 }
 if(r.module==='projects'&&action==='done')fail(await records.countDocuments({companyId,module:'tasks','data.projectId':id,state:{$ne:'done'},deleted:{$ne:true}},{session})===0,'Projenin acik gorevleri var.',409);
 if(r.module==='timesheets'&&action==='approve'){
  const entries=await records.find({companyId,module:'timesheets',state:'approved','data.employeeId':d.employeeId,'data.workDate':d.workDate},{session}).toArray();fail(entries.reduce((s,e)=>s+e.data.hours,0)+d.hours<=24,'Calisanin gunluk kayitlari 24 saati asiyor.',409);
  const emp=await get('employees',d.employeeId);await change(emp,{updatedAt:new Date()});patch['data.billableAmount']=d.billable==='yes'?Math.round(d.hours*(d.hourlyRate||0)):0;
 }
 if(r.module==='stockAdjustments'&&action==='apply'){
  const p=await get('products',d.productId),location=d.warehouseId||'main',qty=p.data.locations?.[location]??(location==='main'?p.data.quantity||0:0);await move(user,d.productId,d.count-qty,id,session,location);
 }
 if(r.module==='stockTransfers'&&action==='transfer'){await move(user,d.productId,-d.quantity,id,session,d.fromWarehouseId||'main');await move(user,d.productId,d.quantity,id,session,d.toWarehouseId||'main');}
 if(r.module==='boms'&&action==='produce')linkedId=(await insert(user,'manufacturing',{name:d.name,productId:d.productId,quantity:1,components:d.components,bomId:id},session))._id.toString();
 if(r.module==='maintenance'&&action==='done'){
  const equipment=await get('equipment',d.equipmentId);await change(equipment,{'data.lastMaintenance':new Date().toISOString(),'data.maintenanceCost':(equipment.data.maintenanceCost||0)+(d.cost||0),updatedAt:new Date()});patch['data.completedAt']=new Date().toISOString();
 }
 if(r.module==='vehicleServices'&&action==='done'){
  const vehicle=await get('fleet',d.vehicleId);fail(d.odometer>=(vehicle.data.odometer||0),'Kilometre onceki kayittan dusuk olamaz.',409);await change(vehicle,{'data.odometer':d.odometer,'data.totalCost':(vehicle.data.totalCost||0)+d.cost,updatedAt:new Date()});
 }
 if(r.module==='website'&&action==='publish'){fail(d.blocks?.length,'Yayinlamak icin sayfaya blok ekleyin.');patch.publishedData={name:d.name,slug:d.slug,blocks:d.blocks};}
 if(r.module==='website'&&action==='unpublish')patch.publishedData=null;
 return {patch,linkedId};
}
export async function creationChecks(user,module,data,session,exclude){
 const companyId=user.companyId;
 if(module==='attendance'){
  const emp=await records.findOne({_id:new ObjectId(data.employeeId),companyId,module:'employees'},{session});fail(emp,'Calisan bulunamadi.');
  const q={companyId,module,state:'active','data.employeeId':data.employeeId,deleted:{$ne:true},...(exclude?{_id:{$ne:exclude}}:{})};fail(!await records.findOne(q,{session}),'Calisanin acik puantaj kaydi var.',409);await records.updateOne({_id:emp._id,version:emp.version},{$inc:{version:1}},{session});
 }
 if(module==='timesheets'&&data.taskId){const t=await records.findOne({_id:new ObjectId(data.taskId),companyId,module:'tasks'},{session});fail(t?.data.projectId===data.projectId,'Gorev secilen projeye ait degil.');}
 if(module==='website')fail(!await records.findOne({companyId,module,$or:[{'data.slug':data.slug},{'publishedData.slug':data.slug}],deleted:{$ne:true},...(exclude?{_id:{$ne:exclude}}:{})},{session}),'Bu sayfa adresi zaten kullaniliyor.',409);
 if(module==='tasks'){const p=await records.findOne({_id:new ObjectId(data.projectId),companyId,module:'projects'},{session});fail(p&&p.state!=='done','Tamamlanmis projeye gorev eklenemez.',409);}
}
