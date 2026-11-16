import {randomUUID} from 'node:crypto';
export const reservationWindowMs=15*60*1000;
export const reservationDeadline=p=>p.reservationExpiresAt?new Date(p.reservationExpiresAt):new Date(new Date(p.createdAt).getTime()+reservationWindowMs);
const active=['initializing','pending'];
export const reviewMessages={result_not_found:'Odeme sonucu bulunamadi; stok korunuyor. Yonetici incelemesi gerekli.',provider_unavailable:'Odeme sonucu dogrulanamadi; stok korunuyor.',awaiting_provider:'Saglayici kesin sonuc vermedi; stok korunuyor.',initialization_unknown:'Odeme oturumu yarim kalmis; stok korunuyor. Yonetici incelemesi gerekli.'};
// Deadline triggers reconciliation, never unconditional inventory release.
export async function reconcileOne({payments,refresh,now=new Date()}){
 const lease=randomUUID(),cutoff=new Date(now.getTime()-reservationWindowMs);
 const p=await payments.findOneAndUpdate({method:'iyzico',status:{$in:active},$and:[
  {$or:[{reservationExpiresAt:{$lte:now}},{reservationExpiresAt:{$exists:false},createdAt:{$lte:cutoff}}]},
  {$or:[{reconcileNextAt:{$lte:now}},{reconcileNextAt:{$exists:false}}]},
  {$or:[{reconcileLeaseUntil:{$lte:now}},{reconcileLeaseUntil:{$exists:false}}]},
  {reconcileExhausted:{$ne:true}}
 ]},{$set:{reconcileLease:lease,reconcileLeaseUntil:new Date(now.getTime()+5*60*1000)}},{sort:{createdAt:1},returnDocument:'after'});
 if(!p)return false;
 const attempt=(p.reconcileAttempts||0)+1;let reason;
 try{if(!p.token)reason='initialization_unknown';else if(!['paid','failed','released'].includes((await refresh(p._id.toString())).status))reason='awaiting_provider';}
 catch(error){reason=error.providerCode==='5122'?'result_not_found':'provider_unavailable';}
 const patch={reconcileState:reason?'review':'resolved',reconcileAttempts:attempt,lastReconciledAt:now};
 if(reason){patch.reconcileReason=reason;patch.reconcileExhausted=attempt>=6;patch.reconcileNextAt=new Date(now.getTime()+Math.min(15,2**(attempt-1))*60*1000);}
 await payments.updateOne({_id:p._id,reconcileLease:lease,status:{$in:reason?active:['paid','failed','released']}},{$set:patch,$unset:{reconcileLease:'',reconcileLeaseUntil:'',...(reason?{}:{reconcileReason:'',reconcileNextAt:'',reconcileExhausted:''})}});
 // A callback may have settled this payment while the worker awaited retrieval.
 await payments.updateOne({_id:p._id,reconcileLease:lease,status:{$in:['paid','failed','released']}},{$set:{reconcileState:'resolved',lastReconciledAt:now},$unset:{reconcileLease:'',reconcileLeaseUntil:'',reconcileReason:'',reconcileNextAt:'',reconcileExhausted:''}});
 await payments.updateOne({_id:p._id,reconcileLease:lease,status:'payment_review'},{$set:{reconcileState:'review',reconcileReason:'late_payment'},$unset:{reconcileLease:'',reconcileLeaseUntil:'',reconcileNextAt:''}});
 return true;
}
export function startPaymentReconciler(deps){
 let busy=false,stopped=false;
 const tick=async()=>{if(busy||stopped)return;busy=true;try{for(let i=0;i<5&&!stopped;i++)if(!await reconcileOne(deps))break;}catch{console.error(JSON.stringify({event:'payment_reconciliation_failed'}));}finally{busy=false;}};
 const timer=setInterval(tick,30000);timer.unref();void tick();
 return ()=>{stopped=true;clearInterval(timer);};
}
