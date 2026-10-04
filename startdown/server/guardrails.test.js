import test from 'node:test';
import assert from 'node:assert/strict';
import { createGuardrails, RATE_SCRIPT, SHARE_SCRIPT } from './guardrails.js';

test('parallel requests obey IP and site caps; blocked requests do not use another budget', async () => {
 const guard=createGuardrails({local:true,prefix:'test'});
 const rules=[['minute',3,60],['site',4,86400,true]];
 const values=await Promise.all(Array.from({length:20},()=>guard.limit('one',rules)));
 assert.equal(values.filter(n=>n===0).length,3);
 assert.equal(await guard.limit('two',rules),0);
 assert.ok(await guard.limit('three',rules)>0);
});

test('parallel sharing persists one trusted entry, ignores unknown tokens, and retries failed writes', async () => {
 const items=[];
 let fail=true;
 const guard=createGuardrails({local:true,prefix:'test',saveLocal:async item=>{
  if(fail) { fail=false; throw new Error('disk unavailable'); }
  items.push(item);
 }});
 const token=await guard.issue({id:'trusted',roastText:'original'});
 await assert.rejects(guard.share(token));
 const values=await Promise.all(Array.from({length:20},()=>guard.share(token)));
 assert.equal(values.filter(n=>n===1).length,1);
 assert.deepEqual(items,[{id:'trusted',roastText:'original'}]);
 assert.equal(await guard.share('unknown'),-1);
});

test('production uses single atomic Redis operations and propagates storage failure', async () => {
 const calls=[];
 const guard=createGuardrails({local:false,prefix:'wall',redis:async command=>{calls.push(command);return 0;}});
 await guard.limit('one',[['minute',3,60],['site',100,86400,true]]);
 assert.deepEqual(calls[0].slice(0,3),['EVAL',RATE_SCRIPT,2]);
 assert.equal(calls[0][4],'wall:limit:site:site');
 const token=await guard.issue({id:'trusted'});
 assert.deepEqual(calls[1].slice(-2),['EX',86400]);
 await guard.share(token);
 assert.deepEqual(calls[2],['EVAL',SHARE_SCRIPT,2,`wall:share:${token}`,'wall']);
 const broken=createGuardrails({local:false,prefix:'wall',redis:async()=>{throw new Error('offline');}});
 await assert.rejects(broken.limit('one',[['minute',3,60]]));
});

test('API rejects invalid/oversized/cross-site requests and limits upstream calls without exposing secrets', async () => {
 process.env.GROQ_API_KEY='test-secret-not-real';
 process.env.NODE_ENV='development';
 delete process.env.VERCEL;
 const {default:app}=await import('./index.js');
 const originalFetch=globalThis.fetch;
 let calls=0;
 globalThis.fetch=async (url, options)=>{
  if(String(url).startsWith('https://api.groq.com/')) {
   calls++;
   const body=JSON.parse(options.body);
   assert.equal(body.max_completion_tokens,2000);
   return new Response(JSON.stringify({error:{message:'upstream failure',type:'server_error'}}),{status:500,headers:{'content-type':'application/json'}});
  }
  return originalFetch(url,options);
 };
 const server=app.listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 const post=(body,headers={})=>originalFetch(`${base}/api/roast`,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
 try {
  assert.equal((await post({idea:[]})).status,400);
  assert.equal((await post({idea:'x'.repeat(1001)})).status,400);
  assert.equal((await post({idea:'x'.repeat(9000)})).status,413);
  assert.equal((await post({idea:'valid startup idea'},{Origin:'https://other-site.example'})).status,403);
  for(let i=0;i<3;i++) assert.equal((await post({idea:'valid startup idea'})).status,500);
  const blocked=await post({idea:'valid startup idea'},{'X-Forwarded-For':'spoof'});
  assert.equal(blocked.status,429);
  assert.ok(Number(blocked.headers.get('retry-after'))>0);
  assert.equal(calls,3);
  assert.ok(!(await blocked.text()).includes(process.env.GROQ_API_KEY));
  const save=await originalFetch(`${base}/api/save`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roastText:'forged'})});
  assert.equal(save.status,400);
  const wall=await originalFetch(`${base}/api/wall?limit=3`);
  const page=await wall.json();
  assert.ok(page.roasts.length<=3);
  assert.ok(!JSON.stringify(page).includes('shareToken'));
  assert.equal((await originalFetch(`${base}/api/wall?limit=1000`)).status,400);
 } finally {
  globalThis.fetch=originalFetch;
  await new Promise(resolve=>server.close(resolve));
 }
});
