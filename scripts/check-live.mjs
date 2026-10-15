// Explicit public-website smoke check. Never calls an AI provider or prints image data.
import {capture} from '../backend/capture.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
const url=process.argv[2];
if(!url||!url.startsWith('https://'))throw new Error('Usage: node scripts/check-live.mjs https://public-site.example [--allow-blocked]');
const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),60000);
const job={url,status:'capturing',createdAt:new Date().toISOString()};
try{await capture(job,async()=>{},{signal:controller.signal});}finally{clearTimeout(timer);}
const result={url,observedAt:job.createdAt,status:job.status,title:job.result?.title,candidates:job.result?.candidates.length,screenshotAvailable:!!job.result?.screenshot,error:job.error,limitations:job.result?.limitations};
await mkdir('test-output',{recursive:true});await writeFile('test-output/live-capture.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(job.status!=='review'){console.log('LIVE CAPTURE NOT VERIFIED: use screenshot upload.');if(!process.argv.includes('--allow-blocked'))process.exitCode=1;}
