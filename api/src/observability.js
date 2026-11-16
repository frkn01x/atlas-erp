import http from 'node:http';
import {appendFile,stat,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const rows=new Map(),buckets=[0.01,0.05,0.1,0.25,0.5,1,2.5,5,10,30,60];let rotate=false,logs=0;
export function observe(method,route,status,seconds){
 const key=JSON.stringify([method,route,status]);let r=rows.get(key);if(!r){r={method,route,status,count:0,sum:0,buckets:buckets.map(()=>0)};rows.set(key,r);}r.count++;r.sum+=seconds;buckets.forEach((b,i)=>{if(seconds<=b)r.buckets[i]++;});
}
const esc=s=>String(s).replaceAll('\\','\\\\').replaceAll('"','\\"').replaceAll('\n','\\n');
export function metricsText(){
 const out=['# HELP erp_http_requests_total Completed HTTP requests.','# TYPE erp_http_requests_total counter','# HELP erp_http_request_duration_seconds Request duration.','# TYPE erp_http_request_duration_seconds histogram'];
 for(const r of rows.values()){const labels=`method="${esc(r.method)}",route="${esc(r.route)}",status="${r.status}"`;out.push(`erp_http_requests_total{${labels}} ${r.count}`);r.buckets.forEach((n,i)=>out.push(`erp_http_request_duration_seconds_bucket{${labels},le="${buckets[i]}"} ${n}`));out.push(`erp_http_request_duration_seconds_bucket{${labels},le="+Inf"} ${r.count}`,`erp_http_request_duration_seconds_count{${labels}} ${r.count}`,`erp_http_request_duration_seconds_sum{${labels}} ${r.sum}`);}
 out.push('# TYPE erp_process_uptime_seconds gauge',`erp_process_uptime_seconds ${process.uptime()}`,'# TYPE erp_process_resident_memory_bytes gauge',`erp_process_resident_memory_bytes ${process.memoryUsage().rss}`);return out.join('\n')+'\n';
}
async function logSafe(data){
 const line=JSON.stringify(data)+'\n';process.stdout.write(line);
 try{
  if(++logs%100===0&&!rotate){rotate=true;try{const s=await stat('/app/logs/api.log');if(s.size>5*1024*1024){await unlink('/app/logs/api.2.log').catch(()=>{});await rename('/app/logs/api.1.log','/app/logs/api.2.log').catch(()=>{});await rename('/app/logs/api.log','/app/logs/api.1.log');}}finally{rotate=false;}}
  await appendFile('/app/logs/api.log',line,{mode:0o644});
 }catch{process.stderr.write('{"event":"safe_log_write_failed"}\n');}
}
export function observeHttp(req,res,next){
 const start=performance.now();const supplied=req.get('X-Request-ID');const requestId=typeof supplied==='string'&&/^[a-f0-9-]{20,40}$/i.test(supplied)?supplied:randomUUID();res.setHeader('X-Request-ID',requestId);
 res.on('finish',()=>{const route=req.route?.path?String(req.baseUrl||'')+String(req.route.path):'unmatched';const method=['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(req.method)?req.method:'OTHER',seconds=(performance.now()-start)/1000;observe(method,route,res.statusCode,seconds);void logSafe({time:new Date().toISOString(),event:'http_request',requestId,method,route,status:res.statusCode,durationMs:Math.round(seconds*1000)});});next();
}
export function startMetrics(){const server=http.createServer((req,res)=>{if(req.method!=='GET'||req.url!=='/metrics'){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/plain; version=0.0.4; charset=utf-8'});res.end(metricsText());});server.headersTimeout=10000;server.requestTimeout=10000;server.listen(9100,'0.0.0.0');return server;}
