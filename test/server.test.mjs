import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
test('server serves app, rejects cross-origin access and disables unconfigured AI',async()=>{
  const port=18341;
  const child=spawn(process.execPath,['backend/server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port),HOST:'127.0.0.1',OPENAI_API_KEY:'',APP_TOKEN:'test-token',ALLOWED_ORIGIN:''},stdio:['ignore','pipe','pipe']});
  try{
    await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('exit',code=>reject(new Error('Server stopped '+code)));setTimeout(()=>reject(new Error('Startup timeout')),5000).unref();});
    const base=`http://127.0.0.1:${port}`;const headers={Authorization:'Bearer test-token','Content-Type':'application/json'};
    assert.equal((await fetch(base+'/api/health')).status,401);
    assert.equal((await fetch(base+'/api/health',{headers:{...headers,Origin:'https://evil.example'}})).status,403);
    const health=await (await fetch(base+'/api/health',{headers})).json();assert.equal(health.analysisAvailable,false);
    const html=await (await fetch(base)).text();assert.match(html,/Creative collection/);
    const ai=await fetch(base+'/api/analyse',{method:'POST',headers,body:'{}'});assert.equal(ai.status,503);
    const bad=await fetch(base+'/api/jobs',{method:'POST',headers,body:JSON.stringify({url:'http://127.0.0.1'})});assert.equal(bad.status,400);
    assert.equal((await fetch(base+'/api/jobs',{headers})).status,200);
  }finally{child.kill();}
});
