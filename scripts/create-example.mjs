import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import {exampleImage} from '../examples/image.mjs';
const browser=await chromium.launch({headless:true});
try{await writeFile(new URL('../examples/generated.png',import.meta.url),await exampleImage(browser));console.log('Created examples/generated.png. Upload it in AdLens; crop x=80, y=160, width=600, height=240.');}
finally{await browser.close();}
