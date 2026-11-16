import assert from 'node:assert/strict';
import {privacyVersion} from '../../shared/privacy-notice.js';
const target='http://waf:8080',prom='http://prometheus:9090',loki='http://loki:3100',grafana='http://grafana:3000';
async function wait(url,predicate=()=>true){let last;for(let i=0;i<40;i++){try{const r=await fetch(url,{signal:AbortSignal.timeout(5000)});const text=await r.text();last=`HTTP ${r.status}: ${text.slice(0,400)}`;if(r.ok&&await predicate(text))return text;}catch(e){last=e.name;}await new Promise(r=>setTimeout(r,1500));}throw new Error('Servis hazir degil: '+new URL(url).hostname+' '+(last||''));}
const health=await wait(target+'/api/health',text=>JSON.parse(text).ok===true);assert.ok(health.includes('true'));
console.log('PASS: API HTTP sagligi.');
for(const payload of ["' OR '1'='1' --",'<script>alert(1)</script>','../../../../etc/passwd']){
 const r=await fetch(target+'/?q='+encodeURIComponent(payload));assert.equal(r.status,403,'WAF saldiri ornegini engellemedi');assert.equal(r.headers.get('x-waf'),'ModSecurity-OWASP-CRS');
}
console.log('PASS: WAF SQLi/XSS/dizin gecisi engeli.');
const canary='MONITOR_SECRET_CANARY_859167';const login=await fetch(target+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json','X-ERP-Request':'1'},body:JSON.stringify({email:'monitor-test@example.invalid',password:canary,privacyAccepted:true,privacyVersion})});assert.equal(login.status,401);
await wait(prom+'/-/ready');await wait(grafana+'/api/health',t=>JSON.parse(t).database==='ok');await wait(loki+'/ready');
await wait(prom+'/api/v1/targets',t=>{const d=JSON.parse(t);return ['atlas-api','waf'].every(job=>d.data?.activeTargets?.some(r=>r.labels.job===job&&r.health==='up'));});
const query=encodeURIComponent('{job="atlas-waf"}');await wait(loki+'/loki/api/v1/query_range?query='+query+'&limit=5',t=>JSON.parse(t).data?.result?.length>0);
const leakQuery=encodeURIComponent('{job=~"atlas-api|atlas-web|atlas-waf"} |= "'+canary+'"');const leak=JSON.parse(await wait(loki+'/loki/api/v1/query_range?query='+leakQuery+'&limit=5'));assert.equal(leak.data.result.length,0,'Gizli veri canary degeri gunluge sizdi');
console.log('PASS: ModSecurity SQLi/XSS/path-traversal engeli; API/WAF Prometheus hedefleri; Loki log akisi; Grafana sagligi; gizli govde gunluk disinda.');
