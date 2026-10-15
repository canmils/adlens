import {readFile} from 'node:fs/promises';
export async function exampleImage(browser){
  const page=await browser.newPage({viewport:{width:1000,height:600}});
  try{await page.setContent(await readFile(new URL('./fictional-page.html',import.meta.url),'utf8'));return await page.screenshot({type:'png'});}
  finally{await page.close();}
}
