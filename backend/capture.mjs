import {chromium} from 'playwright';
import {validateUrl} from './security.mjs';

export async function capture(job, persist, {signal}={}) {
  let browser;
  try {
    const target = await validateUrl(job.url);
    job.stage = 'Opening page'; await persist();
    const env = Object.fromEntries(['PATH','HOME','TMPDIR','DISPLAY','LANG','LD_LIBRARY_PATH'].filter(k=>process.env[k]).map(k=>[k,process.env[k]]));
    browser = await chromium.launch({headless:true,env});
    signal?.addEventListener('abort', () => browser?.close().catch(()=>{}), {once:true});
    const context = await browser.newContext({viewport:{width:1440,height:1000},locale:'en-GB',timezoneId:'Europe/Madrid',serviceWorkers:'block',acceptDownloads:false});
    // Defence in depth. Deploy the worker with an outbound firewall as well: DNS
    // validation cannot by itself prevent rebinding between validation and connection.
    await context.route('**/*', async route => {
      try { await validateUrl(route.request().url()); await route.continue(); }
      catch { await route.abort('blockedbyclient'); }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(3000);
    const response = await page.goto(target, {waitUntil:'domcontentloaded',timeout:25000});
    if ([401,403,429].includes(response?.status())) throw new Error(`Website blocked the visit (${response.status()}). Upload a screenshot instead.`);
    const title = await page.title();
    const body = await page.locator('body').innerText({timeout:3000}).catch(()=> '');
    if (/just a moment|access denied|verify you are human|captcha/i.test(title+' '+body.slice(0,500))) throw new Error('Website challenge detected. Upload a screenshot instead.');
    job.stage='Checking consent'; await persist();
    let consent='No supported consent action found';
    const reject = /^(reject all|decline all|reject optional cookies|rechazar todo|rechazar todas|refuse all|rebutjar tot)$/i;
    const buttons = page.getByRole('button', {name:reject});
    if (await buttons.count()) { await buttons.first().click(); consent='Rejected optional cookies'; }
    const candidates=[]; const seen=new Set();
    for (let step=0; step<5; step++) {
      if(signal?.aborted) throw new Error('Capture cancelled.');
      job.stage=`Finding placements · view ${step+1} of 5`; await persist();
      await page.waitForTimeout(1200);
      const boxes = await page.evaluate(() => {
        const selectors='iframe,[data-ad-slot],[data-ad-unit],[id^="google_ads"],[id^="div-gpt-ad"],[class~="advertisement"],[class~="ad-slot"],[aria-label="Advertisement"]';
        return [...document.querySelectorAll(selectors)].map(el=>{
          const r=el.getBoundingClientRect();
          return {x:r.x,y:r.y,width:r.width,height:r.height,tag:el.tagName,signal:el.tagName==='IFRAME'?'Iframe candidate':'Ad container signal'};
        }).filter(r=>r.width>=100 && r.height>=40 && r.x>=0 && r.y>=0 && r.x+r.width<=innerWidth && r.y+r.height<=innerHeight).slice(0,15);
      });
      for(const box of boxes) {
        const scrollY=await page.evaluate(()=>window.scrollY);
        const signature=`${Math.round(box.x)}-${Math.round(box.y+scrollY)}-${Math.round(box.width)}-${Math.round(box.height)}`;
        if(seen.has(signature)) continue; seen.add(signature);
        const buffer=await page.screenshot({type:'png',clip:{x:box.x,y:box.y+scrollY,width:box.width,height:box.height},timeout:5000});
        candidates.push({image:'data:image/png;base64,'+buffer.toString('base64'),detection:box.signal,rect:{...box,y:box.y+scrollY},capturedAt:new Date().toISOString()});
        if(candidates.length>=20) break;
      }
      if(candidates.length>=20) break;
      await page.evaluate(()=>window.scrollBy(0,800));
    }
    job.stage='Saving screenshot'; await persist();
    await page.evaluate(()=>window.scrollTo(0,0));
    const screenshot=await page.screenshot({type:'png',fullPage:false,timeout:5000});
    job.result={candidates,screenshot:'data:image/png;base64,'+screenshot.toString('base64'),finalUrl:page.url(),title,context:{viewport:'1440 × 1000',language:'en-GB',timezone:'Europe/Madrid',region:'Unknown',consent,browser:browser.version()},limitations:'Sampled desktop visit, five scroll steps maximum. Iframes are candidates, not verified advertisements. Page preview shows the first viewport; candidate crops may come from later views.'};
    job.status='review'; job.stage=candidates.length?'Ready for review':'No candidates detected';
  } catch(error) {job.status=signal?.aborted?'cancelled':'failed';job.error=error.message;job.stage='Capture stopped';}
  finally {await browser?.close().catch(()=>{});await persist();}
}
