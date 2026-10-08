import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyse,fields,responseText} from '../backend/analysis.mjs';
const valid=Object.fromEntries(fields.map(f=>[f,'Unknown']));
test('provider request uses image evidence, strict schema and no storage',async()=>{
  let request;
  const result=await analyse('data:image/png;base64,AAAA',{key:'fake-test-key',model:'test-model',fetchImpl:async(url,opts)=>{request=JSON.parse(opts.body);assert.equal(url,'https://api.openai.com/v1/responses');return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(valid)}]}],usage:{input_tokens:12}})};}});
  assert.equal(request.store,false);assert.equal(request.text.format.strict,true);assert.equal(request.input[0].content[1].type,'input_image');assert.deepEqual(result.fields,valid);
});
test('refusals and incomplete or malformed outputs fail explicitly',()=>{
  assert.throws(()=>responseText({status:'incomplete'}),/incomplete/);
  assert.throws(()=>responseText({output:[{content:[{type:'refusal'}]}]}),/declined/);
  assert.throws(()=>responseText({output:[{content:[{type:'output_text',text:'{"advertiser":5}'}]}]}),/schema/);
});
test('provider error does not leak credentials or raw response body',async()=>{
  await assert.rejects(analyse('data:image/png;base64,AAAA',{key:'secret',model:'test',fetchImpl:async()=>({ok:false,status:401})}),/401/);
});
