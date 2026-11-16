import test from 'node:test';
import assert from 'node:assert/strict';
import {nesErrorDetail} from '../src/nes-error-detail.js';
test('NES validation detail exposes field errors and hides credentials',async()=>{
 const key='secret-example-key';const r=new Response(JSON.stringify({title:'Validation failed',errors:{Invoice:['VKN uyusmuyor',`Bearer ${key}`]},apiKey:key}));
 const message=await nesErrorDetail(r,key);assert.match(message,/VKN uyusmuyor/);assert.ok(!message.includes(key));
});
test('NES HTML and oversized bodies are not exposed',async()=>{
 assert.equal(await nesErrorDetail(new Response('<html>private response</html>'),'key'),'');
 assert.equal(await nesErrorDetail(new Response(JSON.stringify({message:'a'.repeat(20000)})),'key'),'');
});
