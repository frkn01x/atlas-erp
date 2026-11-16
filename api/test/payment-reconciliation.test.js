import test from 'node:test';
import assert from 'node:assert/strict';
import {reconcileOne,reservationWindowMs,reservationDeadline} from '../src/payment-reconciliation.js';

// In-memory payment repository: tests scheduling/leases without live providers or DB.
function matches(row,query){return Object.entries(query).every(([key,value])=>{
 if(key==='$and')return value.every(q=>matches(row,q));if(key==='$or')return value.some(q=>matches(row,q));
 if(value&&typeof value==='object'&&!(value instanceof Date))return Object.entries(value).every(([op,v])=>op==='$exists'?(row[key]!==undefined)===v:op==='$lte'?row[key]!==undefined&&row[key]<=v:op==='$in'?v.includes(row[key]):op==='$ne'?row[key]!==v:false);
 return row[key]===value;
});}
function repo(row){return {row:structuredClone(row),writes:[],async findOneAndUpdate(q,u){if(!matches(this.row,q))return null;Object.assign(this.row,u.$set);return structuredClone(this.row);},async updateOne(q,u){this.writes.push({q,u});if(!matches(this.row,q))return {modifiedCount:0};Object.assign(this.row,u.$set);for(const k of Object.keys(u.$unset||{}))delete this.row[k];return {modifiedCount:1};}};}
const now=new Date('2026-11-16T12:00:00Z');
const payment=(patch={})=>({_id:'dummy-payment',method:'iyzico',status:'pending',createdAt:new Date(now-reservationWindowMs-1000),token:'dummy-encrypted-token',...patch});

test('due boundary and legacy payments: never reconcile early or erase the payment',async()=>{
 const payments=repo(payment({createdAt:new Date(now-reservationWindowMs+1)}));let calls=0;
 assert.equal(await reconcileOne({payments,now,refresh:async()=>{calls++;}}),false);assert.equal(calls,0);
 assert.equal(reservationDeadline(payments.row).getTime(),now.getTime()+1);
 payments.row.createdAt=new Date(now-reservationWindowMs);await reconcileOne({payments,now,refresh:async()=>{calls++;return {status:'pending'};}});
 assert.equal(calls,1);assert.equal(payments.row.status,'pending');assert.equal(payments.row.reconcileState,'review');
});
test('transport uncertainty keeps unresolved payment, records review and delays retry',async()=>{
 const payments=repo(payment());let calls=0;
 const refresh=async()=>{calls++;throw new Error('timeout');};
 await reconcileOne({payments,now,refresh});
 assert.equal(payments.row.status,'pending');assert.equal(payments.row.reconcileReason,'provider_unavailable');assert.equal(payments.row.reconcileNextAt-now,60000);
 assert.equal(await reconcileOne({payments,now:new Date(now.getTime()+59999),refresh}),false);assert.equal(calls,1);
 assert.ok(payments.writes.every(w=>!('status' in w.u.$set))); // worker cannot force failure/cancellation
});
test('multiple workers claim a pending payment once; successful settlement wins',async()=>{
 const payments=repo(payment());let calls=0,release;const barrier=new Promise(r=>release=r);
 const refresh=async()=>{calls++;await barrier;payments.row.status='paid';return {status:'paid'};};
 const first=reconcileOne({payments,now,refresh});await Promise.resolve();
 assert.equal(await reconcileOne({payments,now,refresh}),false);release();await first;
 assert.equal(calls,1);assert.equal(payments.row.status,'paid');assert.equal(payments.row.reconcileState,'resolved');assert.equal(payments.row.reconcileLease,undefined);
});
test('a callback settlement during failed retrieval is never overwritten by review',async()=>{
 const payments=repo(payment());
 await reconcileOne({payments,now,refresh:async()=>{payments.row.status='paid';throw new Error('timeout');}});
 assert.equal(payments.row.status,'paid');assert.equal(payments.row.reconcileState,'resolved');assert.equal(payments.row.reconcileReason,undefined);
});
test('definitive failed result delegates settlement and is not processed twice',async()=>{
 const payments=repo(payment());let calls=0;
 const refresh=async()=>{calls++;payments.row.status='failed';return {status:'failed'};};
 await reconcileOne({payments,now,refresh});assert.equal(payments.row.reconcileState,'resolved');
 assert.equal(await reconcileOne({payments,now,refresh}),false);assert.equal(calls,1);
});
test('lost worker lease recovers, bounded retries escalate, initialization has no unsafe release',async()=>{
 const payments=repo(payment({token:undefined,reconcileAttempts:5,reconcileLease:'old',reconcileLeaseUntil:new Date(now-1)}));let calls=0;
 await reconcileOne({payments,now,refresh:async()=>{calls++;}});
 assert.equal(calls,0);assert.equal(payments.row.status,'pending');assert.equal(payments.row.reconcileReason,'initialization_unknown');assert.equal(payments.row.reconcileExhausted,true);
 assert.equal(await reconcileOne({payments,now:new Date(now.getTime()+86400000),refresh:async()=>{calls++;}}),false);assert.equal(calls,0);
});
test('cash and already terminal records are excluded',async()=>{
 for(const patch of [{method:'cash'},{status:'paid'},{status:'failed'},{status:'released'},{status:'payment_review'}])assert.equal(await reconcileOne({payments:repo(payment(patch)),now,refresh:async()=>{throw new Error('must not call');}}),false);
});
test('5122 handled by refresh releases reservation once and scheduler stops retrying',async()=>{
 const payments=repo(payment());let calls=0;
 const refresh=async()=>{calls++;payments.row.status='released';return {status:'released'};};
 await reconcileOne({payments,now,refresh});assert.equal(payments.row.reconcileState,'resolved');
 assert.equal(await reconcileOne({payments,now:new Date(now.getTime()+3600000),refresh}),false);assert.equal(calls,1);
});
