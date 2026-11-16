import assert from 'node:assert/strict';
import {MongoClient,BSON,ObjectId} from 'mongodb';
import {createRequire} from 'node:module';
import {setTimeout as delay} from 'node:timers/promises';
const watchdog=setTimeout(()=>{console.error('Isolated upgrade test timed out');process.exit(1);},240000);
let client;
try {
 assert.equal(createRequire(import.meta.url)('mongodb/package.json').version,'7.9.0');
 assert.equal(process.env.MONGODB_DB,'atlas_driver_upgrade_test');
 assert.equal(process.env.COLLECTION_PREFIX,'driver_test_');
 assert.equal(process.env.MONGODB_URI,'mongodb://auth-test-mongo:27017/atlas_driver_upgrade_test?replicaSet=auth-test');
 const id=new ObjectId();assert.equal(BSON.EJSON.parse(BSON.EJSON.stringify({id})).id.toHexString(),id.toHexString());
 client=new MongoClient('mongodb://auth-test-mongo:27017/?directConnection=true',{serverSelectionTimeoutMS:10000});await client.connect();
 try{await client.db('admin').command({replSetGetStatus:1});}
 catch(e){if(e.code!==94)throw e;await client.db('admin').command({replSetInitiate:{_id:'auth-test',members:[{_id:0,host:'auth-test-mongo:27017'}]}});}
 let ready=false;for(let i=0;i<60;i++){if((await client.db('admin').command({hello:1})).isWritablePrimary){ready=true;break;}await delay(500);}assert.ok(ready);
 await client.close();client=null;
 await import('../src/server.js');
 let healthy=false;for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:3000/api/health')).ok){healthy=true;break;}}catch{}await delay(500);}assert.ok(healthy);
 await import('./acceptance.mjs');
 console.log('MONGO_UPGRADE_RESULT='+JSON.stringify({ok:true,driver:'7.9.0',isolated:true,realAccountsUsed:false}));
 clearTimeout(watchdog);process.exit(0);
}catch(e){console.error(e);await client?.close();clearTimeout(watchdog);process.exit(1);}
