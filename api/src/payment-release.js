// Dependencies are explicit so the 5122 state transition can be tested offline.
export async function releaseMissingPayment({paymentId,payments,records,transaction,reservation,audit,objectId,actor,now=new Date()}){
 return transaction(async session=>{
  const p=await payments.findOne({_id:paymentId},{session});
  if(!p||!['pending','initializing'].includes(p.status))return p;
  const order=await records.findOne({_id:objectId(p.orderId),companyId:p.companyId,module:p.module},{session});
  if(!order||order.state!=='awaiting_payment')throw new Error('Odeme rezervasyonu incelenmeli.');
  if(order.data.stockReserved)await reservation(p.companyId,order.data.lines,'main',-1,session);
  await records.updateOne({_id:order._id,companyId:p.companyId,version:order.version},{$set:{state:'cancelled','data.stockReserved':false,'data.paymentStatus':'reservation_released'},$inc:{version:1}},{session});
  await payments.updateOne({_id:p._id,status:p.status},{$set:{status:'released',releaseReason:'provider_5122',reservationReleasedAt:now,reconcileState:'resolved',lastReconciledAt:now,updatedAt:now},$unset:{reconcileReason:'',reconcileExhausted:'',reconcileNextAt:''}},{session});
  await audit(actor(p.companyId),'payment_reservation_released',{paymentId:p._id.toString(),orderId:p.orderId,reason:'provider_5122'},session);
  return payments.findOne({_id:p._id},{session});
 });
}
export async function markLatePayment({current,result,payments,audit,actor,session,now=new Date()}){
 if(!['released','payment_review'].includes(current.status))return false;
 if(current.status==='payment_review'&&current.providerPaymentId===String(result.paymentId))return true;
 await payments.updateOne({_id:current._id,status:current.status},{$set:{status:'payment_review',providerPaymentId:String(result.paymentId),reconcileState:'review',reconcileReason:'late_payment',lastReconciledAt:now,updatedAt:now}},{session});
 await audit(actor,'late_payment_after_reservation_release',{paymentId:current._id.toString(),orderId:current.orderId},session);
 return true;
}
