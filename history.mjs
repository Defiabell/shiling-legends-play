const cleanText=(v,max=80)=>String(v||'').replace(/[<>]/g,'').trim().slice(0,max);
const safeInt=(v,min,max,fallback=0)=>Number.isInteger(v)&&v>=min&&v<=max?v:fallback;
export function makePlayerId(seed=Date.now(),rand=Math.random){return `guest_${(Number(seed)>>>0).toString(36)}_${Math.floor(rand()*0xffff).toString(36)}`.slice(0,32);}
export function normalizeRecord(raw={},now=Date.now,rand=Math.random){
 const player=raw.player&&typeof raw.player==='object'?raw.player:{};
 return {
  runs:safeInt(raw.runs,0,999999,0),wins:safeInt(raw.wins,0,999999,0),best:safeInt(raw.best,0,10,0),
  seen:Array.isArray(raw.seen)?raw.seen.filter(id=>typeof id==='string').slice(-200):[],
  forgeArchive:Array.isArray(raw.forgeArchive)?raw.forgeArchive.filter(Boolean).slice(-24):[],
  history:Array.isArray(raw.history)?raw.history.filter(x=>x&&typeof x==='object'&&typeof x.id==='string').slice(0,20):[],
  fusions:Array.isArray(raw.fusions)?raw.fusions.filter(x=>x&&typeof x==='object'&&typeof x.id==='string').slice(0,40):[],
  player:{id:typeof player.id==='string'&&/^guest_[a-z0-9_]+$/.test(player.id)?player.id:makePlayerId(now(),rand),name:cleanText(player.name,16)||'旅人'}
 };
}
export function buildRunHistory(run={},lastReport=null,now=Date.now){
 const result=run.phase==='won'?'won':run.phase==='lost'?'lost':'ended',round=safeInt(run.round,1,10,1),wins=safeInt(run.wins,0,10,0);
 return {id:`run_${now().toString(36)}_${round}_${wins}`,at:now(),result,round,wins,level:safeInt(run.level,1,6,1),gold:safeInt(run.gold,0,250,0),lives:safeInt(run.lives,0,3,0),report:Array.isArray(lastReport?.rows)?lastReport.rows.slice(0,3).map(r=>cleanText(r.fact,120)):[]};
}
export function upsertRunHistory(record,entry){
 if(!entry||!entry.id)return record;
 const history=[entry,...(record.history||[]).filter(x=>x.id!==entry.id)].slice(0,20);
 return {...record,history};
}
export function buildFusionHistory(before={},after={},unitIds=[],names={},now=Date.now){
 const oldIds=new Set((before.mutants||[]).map(m=>m.id)),created=(after.mutants||[]).find(m=>!oldIds.has(m.id));
 if(!created)return null;
 const byId=Object.fromEntries((before.units||[]).map(u=>[u.id,u]));
 const materials=unitIds.map(id=>byId[id]).filter(Boolean).map(u=>cleanText(names[u.cardId]||u.cardId,24));
 return {id:`fusion_${now().toString(36)}_${created.id}`,at:now(),name:cleanText(created.name,24),kind:created.kind,materials,affix:cleanText(created.fusion?.text||created.text,120),triggers:Array.isArray(created.fusion?.triggers)?created.fusion.triggers.slice(0,5):[]};
}
export function addFusionHistory(record,entry){
 if(!entry||!entry.id)return record;
 return {...record,fusions:[entry,...(record.fusions||[]).filter(x=>x.id!==entry.id)].slice(0,40)};
}
export function updatePlayerName(record,name){return {...record,player:{...(record.player||{}),name:cleanText(name,16)||'旅人'}};}
