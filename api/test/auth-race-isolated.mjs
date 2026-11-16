import assert from 'node:assert/strict';
import {MongoClient,Collection} from 'mongodb';
import {setTimeout as delay} from 'node:timers/promises';
import {privacyVersion} from '../../shared/privacy-notice.js';
import {randomBytes,createHash} from 'node:crypto';

// Test-only instrumentation, outside the application. Uses actual routes/datastore.
// No test hook is added to the production server.
const report={isolated:true,realAccountsUsed:false,executed:false};
const watchdog=setTimeout(()=>{console.log('AUTH_RACE_RESULT='+JSON.stringify({...report,error:'test_time_limit'}));process.exit(2);},120000);
const originalFind=Collection.prototype.findOne;
let armed=false,intercepted=false,resume,observed;
const gate=new Promise(resolve=>resume=resolve),paused=new Promise(resolve=>observed=resolve);
Collection.prototype.findOne=async function(...args){
 const snapshot=await originalFind.apply(this,args);
 if(armed&&!intercepted&&this.collectionName==='race_test_users'&&args[0]?.email==='owner@example.invalid'&&args[0]?.active===true){
  intercepted=true;observed();await gate;
 }
 return snapshot;
};
const base='http://127.0.0.1:3000/api';
async function request(path,body,cookie){
 const r=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-ERP-Request':'1',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(35000)});
 const sessionCookie=r.headers.getSetCookie().find(c=>c.startsWith('erp_session='))?.split(';')[0];
 await r.text();return {status:r.status,cookie:sessionCookie};
}
const oldPassword='DummyOldPassword-2026!',newPassword='DummyReplacement-2026!';
const login=password=>request('/auth/login',{email:'owner@example.invalid',password,privacyAccepted:true,privacyVersion});
let setup;
try{
 assert.equal(process.env.MONGODB_DB,'atlas_auth_race_test');
 assert.equal(process.env.COLLECTION_PREFIX,'race_test_');
 assert.equal(process.env.MONGODB_URI,'mongodb://auth-test-mongo:27017/atlas_auth_race_test?replicaSet=auth-test');
 setup=new MongoClient('mongodb://auth-test-mongo:27017/?directConnection=true',{serverSelectionTimeoutMS:10000});await setup.connect();
 try{await setup.db('admin').command({replSetGetStatus:1});}
 catch(error){if(error.code!==94)throw error;await setup.db('admin').command({replSetInitiate:{_id:'auth-test',members:[{_id:0,host:'auth-test-mongo:27017'}]}});}
 let primary=false;for(let i=0;i<40;i++){if((await setup.db('admin').command({hello:1})).isWritablePrimary){primary=true;break;}await delay(500);}assert.ok(primary,'Disposable test replica set not ready');
 await setup.close();setup=null;
 await import('../src/server.js');
 let healthy=false;for(let i=0;i<40;i++){try{const r=await request('/health');if(r.status===200){healthy=true;break;}}catch{}await delay(250);}assert.ok(healthy,'Isolated API unavailable');
 const owner=await login(oldPassword);assert.equal(owner.status,200);assert.ok(owner.cookie);
 armed=true;
 const pendingLogin=login(oldPassword);pendingLogin.catch(()=>{});
 await Promise.race([paused,delay(15000).then(()=>{throw new Error('Expected credential-snapshot boundary was not reached');})]);
 report.pausePoint='old user credential snapshot captured before issuance transaction';
 const changed=await request('/auth/password',{current:oldPassword,password:newPassword},owner.cookie);report.passwordChangeStatus=changed.status;assert.equal(changed.status,200);
 report.originalSessionAfterChange=(await request('/auth/me',null,owner.cookie)).status;assert.equal(report.originalSessionAfterChange,401);
 resume();const stale=await pendingLogin;report.inFlightLoginStatus=stale.status;
 report.staleSessionAccessStatus=stale.cookie?(await request('/auth/me',null,stale.cookie)).status:null;
 report.freshOldPasswordStatus=(await login(oldPassword)).status;assert.equal(report.freshOldPasswordStatus,401);
 report.newPasswordLoginStatus=(await login(newPassword)).status;assert.equal(report.newPasswordLoginStatus,200);
 const {users,sessions}=await import('../src/db.js');
 const dummyUser=await users.findOne({email:'owner@example.invalid'}),staleToken=randomBytes(32).toString('hex');
 await sessions.insertOne({tokenHash:createHash('sha256').update(staleToken).digest('hex'),userId:dummyUser._id,authzVersion:0,privacyVersion,expiresAt:new Date(Date.now()+60000)});
 report.staleVersionSessionAccessStatus=(await request('/auth/me',null,'erp_session='+staleToken)).status;
 report.parallelFreshLoginStatuses=await Promise.all([login(newPassword),login(newPassword)]).then(rows=>rows.map(r=>r.status));
 assert.deepEqual(report.parallelFreshLoginStatuses,[200,200]);
 report.vulnerable=stale.status===200&&report.staleSessionAccessStatus===200;
 if(!report.vulnerable)assert.ok([400,401,403,409].includes(stale.status)||report.staleSessionAccessStatus===401,'Unexpected result is inconclusive');
 report.executed=true;
 console.log('AUTH_RACE_RESULT='+JSON.stringify(report));
 process.exit(0);
}catch{
 resume();report.error='Isolated scenario did not complete; no vulnerability verdict';console.log('AUTH_RACE_RESULT='+JSON.stringify(report));process.exitCode=2;
}finally{
 clearTimeout(watchdog);Collection.prototype.findOne=originalFind;await setup?.close();
 if(process.exitCode)process.exit(process.exitCode);
}
