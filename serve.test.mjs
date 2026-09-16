import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppServer} from './serve.mjs';

const withServer=async fn=>{
  const server=createAppServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const {port}=server.address();
  try{return await fn(`http://127.0.0.1:${port}`);}finally{await new Promise(resolve=>server.close(resolve));}
};

test('local Meshy proxy reports manual fallback when API key is missing',async()=>{
  const old=process.env.MESHY_API_KEY;delete process.env.MESHY_API_KEY;
  await withServer(async base=>{
    const status=await fetch(`${base}/api/meshy/status`).then(r=>r.json());
    assert.equal(status.configured,false);
    const response=await fetch(`${base}/api/meshy/text-to-3d`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:'moon fox'})});
    assert.equal(response.status,503);
  });
  if(old)process.env.MESHY_API_KEY=old;
});

test('local Meshy proxy creates and reads text-to-3d tasks without exposing the key',async()=>{
  const oldKey=process.env.MESHY_API_KEY,oldFetch=globalThis.fetch,calls=[];
  process.env.MESHY_API_KEY='test-key';
  globalThis.fetch=async(url,options={})=>{
    if(String(url).startsWith('http://127.0.0.1:'))return oldFetch(url,options);
    calls.push({url,options});
    if(options.method==='POST')return new Response(JSON.stringify({result:'task-1'}),{status:200,headers:{'Content-Type':'application/json'}});
    return new Response(JSON.stringify({id:'task-1',status:'SUCCEEDED',progress:100,model_urls:{glb:'https://assets.meshy.ai/model.glb'},thumbnail_url:'https://assets.meshy.ai/preview.png'}),{status:200,headers:{'Content-Type':'application/json'}});
  };
  await withServer(async base=>{
    const created=await fetch(`${base}/api/meshy/text-to-3d`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:'shan hai jing fox'})}).then(r=>r.json());
    assert.equal(created.id,'task-1');
    const task=await fetch(`${base}/api/meshy/text-to-3d/task-1`).then(r=>r.json());
    assert.deepEqual(task,{id:'task-1',status:'SUCCEEDED',progress:100,modelUrl:'https://assets.meshy.ai/model.glb',thumbnailUrl:'https://assets.meshy.ai/preview.png',error:''});
  });
  assert.equal(calls[0].url,'https://api.meshy.ai/openapi/v2/text-to-3d');
  assert.equal(JSON.parse(calls[0].options.body).mode,'preview');
  assert.equal(calls[0].options.headers.Authorization,'Bearer test-key');
  globalThis.fetch=oldFetch;if(oldKey)process.env.MESHY_API_KEY=oldKey;else delete process.env.MESHY_API_KEY;
});
