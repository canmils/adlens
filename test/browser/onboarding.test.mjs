import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {chromium} from 'playwright';
import {exampleImage} from '../../examples/image.mjs';

test('real Chromium: upload, crop, notes, image/CSV download, reload and delete without AI', {timeout:90000},async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),'adlens-onboarding-'));
  const port=18462;
  const child=spawn(process.execPath,['backend/server.mjs'],{cwd:new URL('../..',import.meta.url),env:{...process.env,HOST:'127.0.0.1',PORT:String(port),OPENAI_API_KEY:'',APP_TOKEN:'',ALLOWED_ORIGIN:'',ADLENS_DATA_DIR:directory},stdio:['ignore','pipe','pipe']});
  let browser;
  try{
    await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('exit',code=>reject(new Error('Server exited '+code)));setTimeout(()=>reject(new Error('Server startup timeout')),15000).unref();});
    browser=await chromium.launch({headless:true});
    const image=await exampleImage(browser);
    const page=await browser.newPage({acceptDownloads:true});
    await page.goto(`http://127.0.0.1:${port}`);
    await page.waitForFunction(()=>document.querySelector('#connection-label').textContent==='Backend connected');
    await page.locator('#file').setInputFiles({name:'fictional.png',mimeType:'image/png',buffer:image});
    await page.locator('#review-dialog[open]').waitFor();
    for(const [id,value]of [['x',80],['y',160],['w',600],['h',240]])await page.locator('#crop-'+id).fill(String(value));
    await page.locator('#preview-crop').click();
    await page.locator('#crop-preview:not([hidden])').waitFor();
    await page.locator('#save-crop').click();
    await page.waitForFunction(()=>document.querySelector('#nav-count').textContent==='1');
    await page.locator('#review-dialog .close').click();
    await page.locator('[data-view="collection"]').click();
    await page.locator('.creative-card').click();
    assert.equal(await page.locator('#analyse').isDisabled(),true);
    await page.locator('#field-advertiser').fill('Fictional Shoes');
    await page.locator('#field-visibleText').fill('Save 20% on imaginary trainers');
    await page.locator('#field-cta').fill('Explore the collection');
    await page.locator('#field-hook').fill('Discount');
    await page.locator('#save-notes').click();
    await page.waitForFunction(()=>document.querySelector('#detail-title').textContent==='Fictional Shoes');
    const imageDownload=page.waitForEvent('download');await page.locator('#download-image').click();
    const png=await readFile(await (await imageDownload).path());
    assert.equal(png.subarray(1,4).toString(),'PNG');
    await page.locator('#detail-dialog .close').click();
    const csvDownload=page.waitForEvent('download');await page.locator('#export').click();
    const csv=await readFile(await (await csvDownload).path(),'utf8');
    assert.match(csv,/Fictional Shoes/);assert.match(csv,/Save 20% on imaginary trainers/);assert.match(csv,/"manual"/);
    await page.reload();await page.locator('[data-view="collection"]').click();
    await page.getByRole('button',{name:'Open Fictional Shoes'}).click();
    assert.equal(await page.locator('#field-cta').inputValue(),'Explore the collection');
    page.once('dialog',dialog=>dialog.accept());await page.locator('#delete-creative').click();
    await page.waitForFunction(()=>document.querySelector('#nav-count').textContent==='0');
  }finally{
    await browser?.close();if(child.exitCode===null){const exited=new Promise(resolve=>child.once('exit',resolve));child.kill();await exited;}await rm(directory,{recursive:true,force:true});
  }
});
