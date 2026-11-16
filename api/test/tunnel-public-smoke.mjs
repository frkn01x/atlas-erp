import {setTimeout as delay} from 'node:timers/promises';
const origin=new URL(process.argv[2]);
if(origin.protocol!=='https:'||!/^[-a-z0-9]+\.trycloudflare\.com$/.test(origin.hostname)||origin.pathname!=='/'||origin.username||origin.password||origin.search||origin.hash)throw new Error('Invalid tunnel origin');
const checks=[
 ['/api/auth/login','GET',404],
 ['/api/public/iyzico/callback','GET',405],
 ['/api/public/iyzico/callback','POST',400],
 ['/unsubscribe/'+'a'.repeat(64),'GET',200],
 ['/api/public/unsubscribe','GET',405]
];
let previous='';
for(let attempt=0;attempt<45;attempt++){
 const results=await Promise.all(checks.map(async([path,method,expected])=>{
  try{
   const response=await fetch(new URL(path,origin),{method,redirect:'manual',signal:AbortSignal.timeout(5000),...(method==='POST'?{headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'probe=1'}:{})});
   await response.body?.cancel();return {path,expected,actual:response.status};
  }catch(error){return {path,expected,actual:0,error:error.cause?.code||error.name};}
 }));
 if(results.every(r=>r.actual===r.expected)){console.log('PASS: Public HTTPS payment and unsubscribe checks passed.');process.exit(0);}
 const current=JSON.stringify(results);
 if(current!==previous){console.log('Public HTTPS waiting: '+current);previous=current;}
 await delay(2000);
}
console.error('Public HTTPS checks failed; see expected/actual statuses above.');process.exit(1);
