import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const lock=JSON.parse(readFileSync('/app/package-lock.json','utf8'));
assert.equal(lock.packages[''].dependencies.mongodb,'7.9.0');
assert.equal(lock.packages['node_modules/mongodb'].version,'7.9.0');
console.log('PASS: Docker lock MongoDB 7.9.0');
