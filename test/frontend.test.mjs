import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {indexedDB} from 'fake-indexeddb';
test('frontend navigates, saves notes and filters actual stored evidence',async()=>{
  const dom=new JSDOM(await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),{url:'https://adlens.example'});const w=dom.window;
  for(const name of ['document','localStorage','location','Image','FileReader'])globalThis[name]=w[name];
  globalThis.window=w;globalThis.indexedDB=indexedDB;globalThis.fetch=async()=>({ok:false,status:404,json:async()=>({error:'No backend'})});globalThis.confirm=()=>true;
  w.scrollTo=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  const db=await new Promise(resolve=>{const r=indexedDB.open('adlens',1);r.onupgradeneeded=()=>{r.result.createObjectStore('creatives',{keyPath:'id'});r.result.createObjectStore('visits',{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);});
  await new Promise(resolve=>{const tx=db.transaction('creatives','readwrite');tx.objectStore('creatives').put({id:'test',image:'data:image/png;base64,AAAA',url:'https://publisher.example',createdAt:new Date().toISOString(),status:'review',fields:{},context:{}});tx.oncomplete=resolve;});
  await import('../dist/app.js?frontend-test');const $=id=>w.document.getElementById(id);
  assert.equal($('connection-label').textContent,'Screenshot workspace');
  w.document.querySelector('[data-view="collection"]').click();assert.equal($('collection-view').hidden,false);
  w.document.querySelector('.creative-card').click();assert.equal($('detail-dialog').open,true);
  $('field-advertiser').value='Synthetic Shoes';$('field-hook').value='Discount';await $('save-notes').onclick();
  assert.equal($('detail-title').textContent,'Synthetic Shoes');assert.equal($('analyse').disabled,true);
  $('search').value='missing';$('search').dispatchEvent(new w.Event('input'));assert.match($('collection').textContent,/No matching/);
  // Keep the document alive until the toast timer settles; closing it early
  // would trigger an artificial asynchronous failure outside the test.
});
