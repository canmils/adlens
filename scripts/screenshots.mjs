// Regenerates the README screenshots from the fictional example. No network, no AI key.
// Usage: node scripts/screenshots.mjs [chromiumExecutablePath]
import {spawn} from 'node:child_process';
import {mkdtemp,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {chromium} from 'playwright';
import {exampleImage} from '../examples/image.mjs';

const out=new URL('../docs/',import.meta.url);
await mkdir(out,{recursive:true});
const directory=await mkdtemp(path.join(tmpdir(),'adlens-shots-'));
const port=18463;
const child=spawn(process.execPath,['backend/server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,HOST:'127.0.0.1',PORT:String(port),OPENAI_API_KEY:'',APP_TOKEN:'',ALLOWED_ORIGIN:'',ADLENS_DATA_DIR:directory},stdio:['ignore','pipe','pipe']});
const launch=process.argv[2]?{executablePath:process.argv[2]}:{};
let browser;
try{
  await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('exit',c=>reject(new Error('Server exited '+c)));setTimeout(()=>reject(new Error('timeout')),15000).unref();});
  browser=await chromium.launch({headless:true,...launch});
  const image=await exampleImage(browser);
  const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
  await page.goto(`http://127.0.0.1:${port}`);
  await page.waitForFunction(()=>document.querySelector('#connection-label').textContent==='Backend connected');
  await page.locator('#file').setInputFiles({name:'fictional.png',mimeType:'image/png',buffer:image});
  await page.locator('#review-dialog[open]').waitFor();
  for(const [id,v]of [['x',80],['y',160],['w',600],['h',240]])await page.locator('#crop-'+id).fill(String(v));
  await page.locator('#preview-crop').click();
  await page.locator('#crop-preview:not([hidden])').waitFor();
  await page.waitForTimeout(300);
  await page.screenshot({path:new URL('review-crop.png',out).pathname});
  await page.locator('#save-crop').click();
  await page.waitForFunction(()=>document.querySelector('#nav-count').textContent==='1');
  await page.locator('#review-dialog .close').click();
  await page.locator('[data-view="collection"]').click();
  await page.locator('.creative-card').click();
  await page.locator('#field-advertiser').fill('Fictional Shoes');
  await page.locator('#field-visibleText').fill('Save 20% on imaginary trainers');
  await page.locator('#field-cta').fill('Explore the collection');
  await page.locator('#field-hook').fill('Discount');
  await page.locator('#save-notes').click();
  await page.waitForFunction(()=>document.querySelector('#detail-title').textContent==='Fictional Shoes');
  await page.evaluate(()=>{document.activeElement?.blur();for(const el of document.querySelectorAll('#detail-dialog, #detail-dialog *'))el.scrollTop=0;});
  await page.waitForTimeout(300);
  await page.screenshot({path:new URL('creative-detail.png',out).pathname});
  console.log('Wrote docs/review-crop.png and docs/creative-detail.png');
}finally{
  await browser?.close();
  if(child.exitCode===null){const e=new Promise(r=>child.once('exit',r));child.kill();await e;}
  await rm(directory,{recursive:true,force:true});
}
