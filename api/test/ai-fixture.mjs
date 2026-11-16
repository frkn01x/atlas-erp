// Yalnizca izole kabul testi servisi. Ana compose profilinde bulunmaz.
import http from 'node:http';
const server=http.createServer(async(req,res)=>{
 if(req.method!=='POST'||req.url!=='/v1/chat/completions'){res.writeHead(404);res.end();return;}
 try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const input=JSON.parse(Buffer.concat(chunks));const last=input.messages?.at(-1)?.content||'';let task;try{task=JSON.parse(last);}catch{}
 let text='OK';if(task?.sections)text=JSON.stringify({sectionIds:task.sections.slice(0,1).map(s=>s.id)});
 if(task?.task==='interview'){const n=task.turns.length;const lastAnswer=task.turns.at(-1)?.answer||'';text=JSON.stringify({question:task.remaining>0?`${task.role}: ${n===0?'Bu rolde bir teknik problemi nasil cozersiniz?':`Onceki cevabinizdaki "${lastAnswer.slice(0,50)}" noktasini somut bir ornekle acar misiniz?`}`:'',feedback:n>0?'Teknik aciklamayi bir uygulama ornegiyle somutlastirabilirsiniz.':''});}
 res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({choices:[{message:{role:'assistant',content:text}}]}));
 }catch{res.writeHead(400);res.end('{}');}
});server.listen(9000,'0.0.0.0');
