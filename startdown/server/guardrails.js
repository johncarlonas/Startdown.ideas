import crypto from 'node:crypto';

export const RATE_SCRIPT = `
for i,key in ipairs(KEYS) do
 if tonumber(redis.call('GET',key) or '0') >= tonumber(ARGV[i*2-1]) then
  return math.max(redis.call('TTL',key),1)
 end
end
for i,key in ipairs(KEYS) do
 if redis.call('INCR',key)==1 then redis.call('EXPIRE',key,ARGV[i*2]) end
end
return 0`;
export const SHARE_SCRIPT = `
local value=redis.call('GET',KEYS[1])
if not value then return -1 end
if value=='shared' then return 0 end
redis.call('LPUSH',KEYS[2],value)
redis.call('SET',KEYS[1],'shared','KEEPTTL')
return 1`;

export function createGuardrails({ local, redis, prefix, saveLocal }) {
 const counters = new Map();
 const pending = new Map();
 let queue = Promise.resolve();
 function prune(map) {
  const now=Date.now();
  for (const [key,value] of map) if(value.expires<=now) map.delete(key);
 }
 return {
  async limit(ip, rules) {
   const identity=crypto.createHash('sha256').update(ip).digest('hex');
   const keys=rules.map(([name,, ,global])=>`${prefix}:limit:${name}:${global?'site':identity}`);
   if(!local) return Number(await redis(['EVAL',RATE_SCRIPT,keys.length,...keys,...rules.flatMap(([,max,seconds])=>[max,seconds])]));
   prune(counters);
   for(let i=0;i<rules.length;i++) {
    const value=counters.get(keys[i]);
    if(value && value.count>=rules[i][1]) return Math.max(1,Math.ceil((value.expires-Date.now())/1000));
   }
   rules.forEach(([, ,seconds],i)=>{
    const value=counters.get(keys[i])||{count:0,expires:Date.now()+seconds*1000};
    value.count++; counters.set(keys[i],value);
   });
   return 0;
  },
  async issue(item) {
   const token=crypto.randomBytes(32).toString('hex');
   if(local) { prune(pending); pending.set(token,{item,expires:Date.now()+86400000}); }
   else await redis(['SET',`${prefix}:share:${token}`,JSON.stringify(item),'EX',86400]);
   return token;
  },
  async share(token) {
   if(!local) return Number(await redis(['EVAL',SHARE_SCRIPT,2,`${prefix}:share:${token}`,prefix]));
   const operation=queue.then(async()=>{
    prune(pending);
    const value=pending.get(token);
    if(!value) return -1;
    if(value.shared) return 0;
    await saveLocal(value.item);
    value.shared=true;
    return 1;
   });
   queue=operation.catch(()=>{});
   return operation;
  }
 };
}
