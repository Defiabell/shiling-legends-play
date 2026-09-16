import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,extname} from 'node:path';

const base=fileURLToPath(new URL('.',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const meshyBase='https://api.meshy.ai/openapi/v2/text-to-3d';

function loadLocalEnv(){
  for(const file of [resolve(base,'.env'),resolve(base,'../../envs/meshy.env')]){
    if(!existsSync(file))continue;
    for(const line of readFileSync(file,'utf8').split(/\r?\n/)){
      const match=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if(!match||process.env[match[1]]!==undefined)continue;
      process.env[match[1]]=match[2].replace(/^['"]|['"]$/g,'');
    }
  }
}
loadLocalEnv();

const sendJson=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(body));};
async function readJson(req,limit=1600){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>limit)throw Object.assign(new Error('Payload too large'),{status:413});}return raw?JSON.parse(raw):{};}
function safeTask(task){return {id:task.id,status:task.status,progress:task.progress??0,type:task.type,modelUrl:task.model_urls?.glb||'',thumbnailUrl:task.thumbnail_url||task.alpha_thumbnail_url||'',error:task.task_error?.message||task.message||''};}
async function meshyRequest(res,path='',options={}){
  const key=process.env.MESHY_API_KEY;
  if(!key){sendJson(res,503,{configured:false,message:'本地没有配置 MESHY_API_KEY，仍可手动粘贴 Meshy 链接。'});return;}
  const response=await fetch(meshyBase+path,{...options,headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(options.headers||{})}});
  const text=await response.text();let body={};try{body=text?JSON.parse(text):{};}catch{body={message:text.slice(0,300)}}
  if(!response.ok){sendJson(res,response.status,{message:body.message||`Meshy request failed (${response.status})`});return;}
  return body;
}
export function createAppServer(){return createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='GET'&&url.pathname==='/api/meshy/status'){sendJson(res,200,{configured:Boolean(process.env.MESHY_API_KEY)});return;}
  if(req.method==='POST'&&url.pathname==='/api/meshy/text-to-3d'){
    const body=await readJson(req),prompt=String(body.prompt||'').trim().slice(0,800);
    if(prompt.length<4){sendJson(res,400,{message:'prompt 太短'});return;}
    const result=await meshyRequest(res,'',{method:'POST',body:JSON.stringify({mode:'preview',prompt,target_formats:['glb'],alpha_thumbnail:true})});
    if(result)sendJson(res,200,{id:result.result});
    return;
  }
  const task=url.pathname.match(/^\/api\/meshy\/text-to-3d\/([a-zA-Z0-9-]+)$/);
  if(req.method==='GET'&&task){const result=await meshyRequest(res,`/${task[1]}`,{method:'GET'});if(result)sendJson(res,200,safeTask(result));return;}
  const path=resolve(base,'.'+decodeURIComponent(url.pathname.replace(/\/$/,'/index.html')));
  if(!path.startsWith(base)||!types[extname(path)]){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',types[extname(path)]);res.setHeader('Cache-Control','no-store');res.end(await readFile(path));
}catch(error){sendJson(res,error.status||500,{message:error.message||'Server error'});}});}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  createAppServer().listen(4195,'127.0.0.1',()=>console.log('食灵 · 列传卡牌试玩 http://127.0.0.1:4195'));
}
