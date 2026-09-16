const cleanText=(v,max=80)=>String(v||'').replace(/[<>]/g,'').trim().slice(0,max);
const safeInt=(v,min,max,fallback=0)=>Number.isInteger(v)&&v>=min&&v<=max?v:fallback;
const titleDefs=Object.freeze({
 first_clear:{name:'山海初定',text:'首次完成十战试炼。'},
 far_runner:{name:'远行者',text:'单局抵达五胜以上。'},
 full_shop:{name:'六星商贾',text:'把商店升到六星。'},
 fusion_adept:{name:'合灵匠',text:'完成三次伙伴融合。'},
 chimera:{name:'三相师',text:'用三个伙伴完成一次融合。'},
 lineage_keeper:{name:'谱系守望',text:'养出二代以上融合血脉。'},
 daily_hunter:{name:'今日猎手',text:'完成一次每日悬赏。'}
});
const dailyDefs=Object.freeze([
 {id:'five_wins',title:'五胜远行',text:'任意阵容抵达 5 胜。',check:run=>(run.wins||0)>=5},
 {id:'full_board',title:'六兽布阵',text:'最终阵容上阵 6 个伙伴。',check:run=>(run.formation||[]).filter(Boolean).length>=6},
 {id:'star_hunt',title:'升星猎令',text:'拥有任意二星或三星伙伴。',check:run=>Object.values(run.owned||{}).some(n=>n>=3)},
 {id:'fusion_trial',title:'合灵试炼',text:'本局至少拥有 1 个融合伙伴。',check:run=>(run.mutants||[]).some(m=>m.fusion)},
 {id:'shop_master',title:'六星市集',text:'把商店升到 6 星。',check:run=>(run.level||1)>=6}
]);
const localDateKey=(now=Date.now)=>{const d=new Date(typeof now==='function'?now():now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function makePlayerId(seed=Date.now(),rand=Math.random){return `guest_${(Number(seed)>>>0).toString(36)}_${Math.floor(rand()*0xffff).toString(36)}`.slice(0,32);}
export function dailyBountyFor(now=Date.now){const date=localDateKey(now),n=[...date].reduce((sum,ch)=>sum+ch.charCodeAt(0),0),def=dailyDefs[n%dailyDefs.length];return {date,...def};}
function normalizeTitles(value=[]){const seen=new Set();return (Array.isArray(value)?value:[]).filter(x=>x&&typeof x==='object'&&typeof x.id==='string'&&titleDefs[x.id]&&!seen.has(x.id)&&seen.add(x.id)).map(x=>({id:x.id,name:titleDefs[x.id].name,text:titleDefs[x.id].text,unlockedAt:safeInt(x.unlockedAt,0,9999999999999,0)})).slice(0,40);}
function normalizeBloodlines(value=[]){return (Array.isArray(value)?value:[]).filter(x=>x&&typeof x==='object'&&typeof x.id==='string').map(x=>({id:cleanText(x.id,64),name:cleanText(x.name,24),generation:safeInt(x.generation,1,99,1),parents:Array.isArray(x.parents)?x.parents.map(p=>cleanText(p,24)).filter(Boolean).slice(0,3):[],traits:Array.isArray(x.traits)?x.traits.map(t=>cleanText(t,24)).filter(Boolean).slice(0,6):[],at:safeInt(x.at,0,9999999999999,0)})).filter(x=>x.id&&x.name).slice(0,60);}
function normalizeDaily(value={},now=Date.now){const bounty=dailyBountyFor(now);if(!value||typeof value!=='object'||value.date!==bounty.date||value.id!==bounty.id)return {date:bounty.date,id:bounty.id,completed:false,streak:safeInt(value?.streak,0,9999,0)};return {date:bounty.date,id:bounty.id,completed:Boolean(value.completed),completedAt:safeInt(value.completedAt,0,9999999999999,0),streak:safeInt(value.streak,0,9999,0)};}
export function normalizeRecord(raw={},now=Date.now,rand=Math.random){
 const player=raw.player&&typeof raw.player==='object'?raw.player:{};
 return {
  runs:safeInt(raw.runs,0,999999,0),wins:safeInt(raw.wins,0,999999,0),best:safeInt(raw.best,0,10,0),
  seen:Array.isArray(raw.seen)?raw.seen.filter(id=>typeof id==='string').slice(-200):[],
  forgeArchive:Array.isArray(raw.forgeArchive)?raw.forgeArchive.filter(Boolean).slice(-24):[],
  history:Array.isArray(raw.history)?raw.history.filter(x=>x&&typeof x==='object'&&typeof x.id==='string').slice(0,20):[],
  fusions:Array.isArray(raw.fusions)?raw.fusions.filter(x=>x&&typeof x==='object'&&typeof x.id==='string').slice(0,40):[],
  bloodlines:normalizeBloodlines(raw.bloodlines),titles:normalizeTitles(raw.titles),daily:normalizeDaily(raw.daily,now),
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
 const lineage=created.lineage&&typeof created.lineage==='object'?created.lineage:{};
 return {id:`fusion_${now().toString(36)}_${created.id}`,at:now(),cardId:created.id,name:cleanText(created.name,24),kind:created.kind,materials,parents:Array.isArray(lineage.parents)?lineage.parents.map(p=>cleanText(p,24)).filter(Boolean).slice(0,3):materials,generation:safeInt(lineage.generation,1,99,1),affix:cleanText(created.fusion?.text||created.text,120),triggers:Array.isArray(created.fusion?.triggers)?created.fusion.triggers.slice(0,5):[]};
}
const titleOf=id=>({id,name:titleDefs[id].name,text:titleDefs[id].text,unlockedAt:Date.now()});
export function addTitle(record,id,now=Date.now){if(!titleDefs[id]||(record.titles||[]).some(t=>t.id===id))return record;return {...record,titles:[...(record.titles||[]),{...titleOf(id),unlockedAt:now()}]};}
function lineageFromFusion(entry){if(!entry||!entry.id)return null;return {id:cleanText(entry.cardId||entry.id,64),name:cleanText(entry.name,24),generation:safeInt(entry.generation,1,99,1),parents:Array.isArray(entry.parents)?entry.parents.slice(0,3):Array.isArray(entry.materials)?entry.materials.slice(0,3):[],traits:[cleanText(entry.affix,80),...(entry.triggers||[]).map(t=>cleanText(t,24))].filter(Boolean).slice(0,6),at:safeInt(entry.at,0,9999999999999,Date.now())};}
export function addFusionHistory(record,entry,now=Date.now){
 if(!entry||!entry.id)return record;
 let next={...record,fusions:[entry,...(record.fusions||[]).filter(x=>x.id!==entry.id)].slice(0,40)};
 const lineage=lineageFromFusion(entry);if(lineage)next={...next,bloodlines:[lineage,...(next.bloodlines||[]).filter(x=>x.id!==lineage.id)].slice(0,60)};
 if((next.fusions||[]).length>=3)next=addTitle(next,'fusion_adept',now);
 if((entry.materials||[]).length>=3)next=addTitle(next,'chimera',now);
 if((entry.generation||1)>=2)next=addTitle(next,'lineage_keeper',now);
 return next;
}
export function recordRunAchievements(record,run={},lastReport=null,now=Date.now){
 let next=record;
 if(run.phase==='won')next=addTitle(next,'first_clear',now);
 if((run.wins||0)>=5)next=addTitle(next,'far_runner',now);
 if((run.level||1)>=6)next=addTitle(next,'full_shop',now);
 const bounty=dailyBountyFor(now),daily=normalizeDaily(next.daily,now);
 if(!daily.completed&&bounty.check(run,next)){daily.completed=true;daily.completedAt=now();daily.streak=safeInt(daily.streak,0,9999,0)+1;next=addTitle({...next,daily},'daily_hunter',now);}
 else next={...next,daily};
 return next;
}
export function titleBonus(record){return Math.min(3,(record.titles||[]).length);}
export function updatePlayerName(record,name){return {...record,player:{...(record.player||{}),name:cleanText(name,16)||'旅人'}};}
export const PROFILE_TITLES=titleDefs;
