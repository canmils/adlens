import http from 'node:http';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomUUID,timingSafeEqual,createHash} from 'node:crypto';
import {capture} from './capture.mjs';
import {analyse} from './analysis.mjs';
import {validateUrl} from './security.mjs';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const data=path.join(root,'data'); await mkdir(data,{recursive:true});
const storePath=path.join(data,'jobs.json');
let jobs=[]; try{jobs=JSON.parse(await readFile(storePath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
for(const job of jobs) if(job.status==='capturing'){job.status='failed';job.error='Server restarted during capture.';}
let writes=Promise.resolve();
function persist(){writes=writes.then(async()=>{await writeFile(storePath+'.tmp',JSON.stringify(jobs));await rename(storePath+'.tmp',storePath);});return writes;}
const host=process.env.HOST||'127.0.0.1';const port=Number(process.env.PORT||3000);const token=process.env.APP_TOKEN||'';
if(!['127.0.0.1','localhost','::1'].includes(host)&&token.length<24)throw new Error('Remote access requires APP_TOKEN with at least 24 characters.');
const controllers=new Map();let analysing=false;
let ledger={};try{ledger=JSON.parse(await readFile(path.join(data,'usage.json'),'utf8'));}catch{}
let cache={};try{cache=JSON.parse(await readFile(path.join(data,'analysis.json'),'utf8'));}catch{}
function auth(req){if(!token)return true;const got=Buffer.from(req.headers.authorization?.replace(/^Bearer /,'')||'');const expected=Buffer.from(token);return got.length===expected.length&&timingSafeEqual(got,expected);}
function send(res,status,value){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
async function json(req){let bytes=0;const chunks=[];for await(const c of req){bytes+=c.length;if(bytes>12*1024*1024)throw new Error('Payload exceeds 12 MB.');chunks.push(c);}return JSON.parse(Buffer.concat(chunks).toString());}
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  const allowed=process.env.ALLOWED_ORIGIN;
  const origin=req.headers.origin;
  if(origin && origin!==`http://${req.headers.host}` && origin!==`https://${req.headers.host}` && origin!==allowed){send(res,403,{error:'Origin is not allowed.'});return;}
  if(allowed&&origin===allowed){res.setHeader('Access-Control-Allow-Origin',allowed);res.setHeader('Vary','Origin');}
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, DELETE'});res.end();return;}
  const url=new URL(req.url,'http://localhost');
  try{
    if(url.pathname.startsWith('/api/')){
      if(!auth(req)){send(res,401,{error:'Enter the backend access token in Settings.'});return;}
      if(url.pathname==='/api/health'){send(res,200,{ok:true,analysisAvailable:!!process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL||'gpt-4.1-mini',dailyLimit:Number(process.env.MAX_ANALYSES_PER_DAY||50)});return;}
      if(url.pathname==='/api/jobs'&&req.method==='GET'){send(res,200,jobs);return;}
      if(url.pathname==='/api/jobs'&&req.method==='POST'){
        if(controllers.size){send(res,409,{error:'A capture is already running. Wait or cancel it.'});return;}
        const input=await json(req);const validated=await validateUrl(input.url);
        const job={id:randomUUID(),url:validated,status:'capturing',stage:'Queued',createdAt:new Date().toISOString()};jobs.unshift(job);await persist();
        const controller=new AbortController();controllers.set(job.id,controller);
        const timer=setTimeout(()=>controller.abort(),60000);
        capture(job,persist,{signal:controller.signal}).finally(()=>{clearTimeout(timer);controllers.delete(job.id);});send(res,202,job);return;
      }
      const match=url.pathname.match(/^\/api\/jobs\/([a-z0-9-]+)$/);
      if(match){const job=jobs.find(j=>j.id===match[1]);if(!job){send(res,404,{error:'Capture not found.'});return;}
        if(req.method==='DELETE'){controllers.get(job.id)?.abort();jobs=jobs.filter(j=>j!==job);await persist();send(res,200,{ok:true});return;}
        if(req.method==='POST'){controllers.get(job.id)?.abort();send(res,200,{ok:true});return;}
        send(res,200,job);return;}
      if(url.pathname==='/api/analyse'&&req.method==='POST'){
        if(!process.env.OPENAI_API_KEY){send(res,503,{error:'Add OPENAI_API_KEY to the backend environment to enable AI analysis.'});return;}
        if(analysing){send(res,409,{error:'Analysis is busy. Try again shortly.'});return;}
        const input=await json(req);if(typeof input.image!=='string'||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(input.image)){send(res,400,{error:'Use a PNG, JPEG or WebP image.'});return;}
        const model=process.env.OPENAI_MODEL||'gpt-4.1-mini';const digest=createHash('sha256').update(input.image+model+'schema1').digest('hex');
        if(cache[digest]){send(res,200,{...cache[digest],cached:true});return;}
        const day=new Date().toISOString().slice(0,10);const max=Number(process.env.MAX_ANALYSES_PER_DAY||50);
        if((ledger[day]||0)>=max){send(res,429,{error:'Daily analysis request limit reached.'});return;}
        analysing=true;
        try{ledger[day]=(ledger[day]||0)+1;await writeFile(path.join(data,'usage.json'),JSON.stringify(ledger));const result=await analyse(input.image,{key:process.env.OPENAI_API_KEY,model});cache[digest]=result;await writeFile(path.join(data,'analysis.json'),JSON.stringify(cache));send(res,200,result);}
        finally{analysing=false;}return;
      }
      send(res,404,{error:'Unknown API route.'});return;
    }
    const name=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!['index.html','app.js','style.css'].includes(name)){res.writeHead(404);res.end('Not found');return;}
    res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data: blob:; style-src 'self'; script-src 'self'; connect-src 'self' https: http://localhost:* http://127.0.0.1:*; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    const bytes=await readFile(path.join(root,'dist',name));res.writeHead(200,{'Content-Type':types[path.extname(name)]});res.end(bytes);
  }catch(error){send(res,400,{error:error.message||'Request failed.'});}
});
server.listen(port,host,()=>console.log(`AdLens ready at http://${host}:${port}`));
