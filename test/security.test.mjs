import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicAddress,validateUrl,csvCell} from '../backend/security.mjs';
test('rejects local, private, metadata and mapped private addresses',()=>{
  for(const ip of ['127.0.0.1','10.2.1.1','172.16.1.1','192.168.1.2','169.254.169.254','0.0.0.0','::1','fc00::1','fe80::1','::ffff:127.0.0.1'])assert.equal(publicAddress(ip),false,ip);
  assert.equal(publicAddress('8.8.8.8'),true);
});
test('rejects unsafe URL schemes, credentials, ports and mixed DNS',async()=>{
  const pub=async()=>[{address:'8.8.8.8'}];
  for(const url of ['file:///etc/passwd','ftp://example.com','http://user:pass@example.com','http://example.com:3000','http://127.0.0.1'])await assert.rejects(validateUrl(url,pub));
  await assert.rejects(validateUrl('https://example.com',async()=>[{address:'8.8.8.8'},{address:'10.0.0.1'}]));
  assert.equal(await validateUrl('https://example.com/test',pub),'https://example.com/test');
});
test('exports quoted CSV and neutralises formulas',()=>{
  assert.equal(csvCell('=HYPERLINK("evil")'),'"\'=HYPERLINK(""evil"")"');
  assert.equal(csvCell('hello, "world"'),'"hello, ""world"""');
  assert.equal(csvCell(' @SUM(A1)'),'"\' @SUM(A1)"');
});
