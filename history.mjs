const cleanText=(v,max=80)=>String(v||'').replace(/[<>]/g,'').trim().slice(0,max);
const safeInt=(v,min,max,fallback=0)=>Number.isInteger(v)&&v>=min&&v<=max?v:fallback;
const titleDefs=Object.freeze({
 first_clear:{name:'山海初定',text:'首次完成十战试炼。'},
 far_runner:{name:'远行者',text:'单局抵达五胜以上。'},
 full_shop:{name:'六星商贾',text:'把商店升到六星。'},
 fusion_adept:{name:'合灵匠',text:'完成三次伙伴融合。'},
 chimera:{name:'三相师',text:'用三个伙伴完成一次融合。'},
 lineage_keeper:{name:'谱系守望',text:'养出二代以上融合血脉。'},
 daily_hunter:{name:'今日猎手',text:'完成一次每日悬赏。'},
 daily_master:{name:'三段悬赏',text:'同一天完成每日悬赏全部三段。'},
 summoner_style:{name:'魇巢统领',text:'以召唤流完成五胜。'},
 death_style:{name:'归尘使者',text:'以遗言流完成五胜。'},
 growth_style:{name:'息壤园主',text:'以成长流完成五胜。'},
 guard_style:{name:'守山阵主',text:'保存一套守山阵。'}
});
const dailyDefs=Object.freeze([
 {id:'five_wins',title:'五胜远行',stages:[
  {id:'play',text:'完成 1 局',check:run=>['won','lost'].includes(run.phase)},
  {id:'three',text:'抵达 3 胜',check:run=>(run.wins||0)>=3},
  {id:'five',text:'抵达 5 胜',check:run=>(run.wins||0)>=5}
 ]},
 {id:'full_board',title:'六兽布阵',stages:[
  {id:'four',text:'上阵 4 个伙伴',check:run=>deployedCardIds(run).length>=4},
  {id:'five',text:'上阵 5 个伙伴',check:run=>deployedCardIds(run).length>=5},
  {id:'six',text:'上阵 6 个伙伴',check:run=>deployedCardIds(run).length>=6}
 ]},
 {id:'star_hunt',title:'升星猎令',stages:[
  {id:'pair',text:'拥有 2 张同名伙伴',check:run=>Object.values(run.owned||{}).some(n=>n>=2)},
  {id:'two_star',text:'拥有 1 个二星伙伴',check:run=>Object.values(run.owned||{}).some(n=>n>=3)},
  {id:'three_star',text:'拥有 1 个三星伙伴',check:run=>Object.values(run.owned||{}).some(n=>n>=9)}
 ]},
 {id:'fusion_trial',title:'合灵试炼',stages:[
  {id:'one',text:'完成 1 次融合',check:run=>fusionCards(run).length>=1},
  {id:'two',text:'拥有 2 个融合伙伴',check:run=>fusionCards(run).length>=2},
  {id:'lineage',text:'养出 2 代血脉',check:run=>fusionCards(run).some(c=>(c.lineage?.generation||1)>=2)}
 ]},
 {id:'shop_master',title:'六星市集',stages:[
  {id:'three',text:'商店达到 3 星',check:run=>(run.level||1)>=3},
  {id:'five',text:'商店达到 5 星',check:run=>(run.level||1)>=5},
  {id:'six',text:'商店达到 6 星',check:run=>(run.level||1)>=6}
 ]}
]);
const localDateKey=(now=Date.now)=>{const d=new Date(typeof now==='function'?now():now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const cardIdFromUnit=id=>String(id||'').replace(/:\d+:\d+$/,'');
const deployedCardIds=run=>(run.formation||[]).filter(Boolean).map(cardIdFromUnit);
const fusionCards=run=>(run.mutants||[]).filter(m=>m&&m.fusion);
const passivesOf=(run,ids)=>ids.map(id=>(run.mutants||[]).find(m=>m.id===id)?.passive||({mourning_wolf:'deathrattle',brood_wolf:'death_summon',ghost_bird:'summoner',earth_turtle:'growth',lotus_turtle:'team_heal',jade_spirit:'pacifist',taunt_turtle:'taunt',war_wolf:'rally'}[id])).filter(Boolean);
const triggersOf=(run,ids=deployedCardIds(run))=>fusionCards(run).filter(c=>ids.includes(c.id)).flatMap(c=>Array.isArray(c.fusion?.triggers)?c.fusion.triggers:[]);
export const CHAPTERS=Object.freeze([
 {id:'wilds',name:'荒山卷',need:0,boss:'狰王',text:'学会站位与升星。'},
 {id:'marsh',name:'泽国卷',need:3,boss:'相柳影',text:'治疗、护盾和毒火拉扯。'},
 {id:'ember',name:'火岭卷',need:5,boss:'毕方灾火',text:'爆发与打断决定生死。'},
 {id:'ruins',name:'归墟卷',need:8,boss:'饕餮残相',text:'召唤、遗言与成长开始成型。'},
 {id:'kunlun',name:'昆仑卷',need:10,boss:'烛龙梦身',text:'十战通关后的长期挑战。'}
]);
export function chapterFor(best=0){return CHAPTERS.slice().reverse().find(c=>(best||0)>=c.need)||CHAPTERS[0];}
export function makePlayerId(seed=Date.now(),rand=Math.random){return `guest_${(Number(seed)>>>0).toString(36)}_${Math.floor(rand()*0xffff).toString(36)}`.slice(0,32);}
export function dailyBountyFor(now=Date.now){const date=localDateKey(now),n=[...date].reduce((sum,ch)=>sum+ch.charCodeAt(0),0),def=dailyDefs[n%dailyDefs.length];return {date,...def,stages:def.stages.map(({id,text})=>({id,text}))};}
export function dailyBountyProgress(run={},now=Date.now){const bounty=dailyBountyFor(now),def=dailyDefs.find(d=>d.id===bounty.id)||dailyDefs[0],stages=def.stages.map(stage=>({id:stage.id,text:stage.text,done:Boolean(stage.check(run))}));return {...bounty,stages,done:stages.filter(s=>s.done).length,total:stages.length,completed:stages.every(s=>s.done)};}
function normalizeTitles(value=[]){const seen=new Set();return (Array.isArray(value)?value:[]).filter(x=>x&&typeof x==='object'&&typeof x.id==='string'&&titleDefs[x.id]&&!seen.has(x.id)&&seen.add(x.id)).map(x=>({id:x.id,name:titleDefs[x.id].name,text:titleDefs[x.id].text,unlockedAt:safeInt(x.unlockedAt,0,9999999999999,0)})).slice(0,40);}
function normalizeBloodlines(value=[]){return (Array.isArray(value)?value:[]).filter(x=>x&&typeof x==='object'&&typeof x.id==='string').map(x=>({id:cleanText(x.id,64),name:cleanText(x.name,24),generation:safeInt(x.generation,1,99,1),parents:Array.isArray(x.parents)?x.parents.map(p=>cleanText(p,24)).filter(Boolean).slice(0,3):[],traits:Array.isArray(x.traits)?x.traits.map(t=>cleanText(t,24)).filter(Boolean).slice(0,6):[],at:safeInt(x.at,0,9999999999999,0)})).filter(x=>x.id&&x.name).slice(0,60);}
function normalizeDaily(value={},now=Date.now){const bounty=dailyBountyFor(now);if(!value||typeof value!=='object'||value.date!==bounty.date||value.id!==bounty.id)return {date:bounty.date,id:bounty.id,completed:false,streak:safeInt(value?.streak,0,9999,0)};return {date:bounty.date,id:bounty.id,completed:Boolean(value.completed),completedAt:safeInt(value.completedAt,0,9999999999999,0),progress:safeInt(value.progress,0,3,0),streak:safeInt(value.streak,0,9999,0)};}
function normalizeGuardian(value={}){if(!value||typeof value!=='object'||!Array.isArray(value.cards))return null;const cards=value.cards.map(cleanText).filter(Boolean).slice(0,6);if(!cards.length)return null;return {savedAt:safeInt(value.savedAt,0,9999999999999,0),wins:safeInt(value.wins,0,10,0),chapter:cleanText(value.chapter,16),cards};}
export function normalizeRecord(raw={},now=Date.now,rand=Math.random){
 const player=raw.player&&typeof raw.player==='object'?raw.player:{};
 return {
  runs:safeInt(raw.runs,0,999999,0),wins:safeInt(raw.wins,0,999999,0),best:safeInt(raw.best,0,10,0),
  seen:Array.isArray(raw.seen)?raw.seen.filter(id=>typeof id==='string').slice(-200):[],
  forgeArchive:Array.isArray(raw.forgeArchive)?raw.forgeArchive.filter(Boolean).slice(-24):[],
  history:Array.isArray(raw.history)?raw.history.filter(x=>x&&typeof x==='object'&&typeof x.id==='string').slice(0,20):[],
  fusions:Array.isArray(raw.fusions)?raw.fusions.filter(x=>x&&typeof x==='object'&&typeof x.id==='string').slice(0,40):[],
  bloodlines:normalizeBloodlines(raw.bloodlines),titles:normalizeTitles(raw.titles),daily:normalizeDaily(raw.daily,now),guardian:normalizeGuardian(raw.guardian),
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
export function saveGuardianFormation(record,run={},names={},now=Date.now){const cards=deployedCardIds(run).map(id=>cleanText(names[id]||id,24)).filter(Boolean);if(!cards.length)return record;let next={...record,guardian:{savedAt:now(),wins:safeInt(run.wins,0,10,0),chapter:chapterFor(Math.max(record.best||0,run.wins||0)).name,cards:cards.slice(0,6)}};return addTitle(next,'guard_style',now);}
export function recordRunAchievements(record,run={},lastReport=null,now=Date.now){
 let next=record;
 if(run.phase==='won')next=addTitle(next,'first_clear',now);
 if((run.wins||0)>=5)next=addTitle(next,'far_runner',now);
 if((run.level||1)>=6)next=addTitle(next,'full_shop',now);
 const ids=deployedCardIds(run),passives=passivesOf(run,ids),triggers=triggersOf(run,ids);
 if((run.wins||0)>=5&&(passives.includes('summoner')||passives.includes('death_summon')||triggers.some(t=>t.includes('summon'))))next=addTitle(next,'summoner_style',now);
 if((run.wins||0)>=5&&(passives.includes('deathrattle')||passives.includes('death_summon')||triggers.some(t=>t.startsWith('death_'))))next=addTitle(next,'death_style',now);
 if((run.wins||0)>=5&&(passives.includes('growth')||triggers.some(t=>t.includes('growth'))))next=addTitle(next,'growth_style',now);
 const progress=dailyBountyProgress(run,now),daily=normalizeDaily(next.daily,now);
 if(!daily.completed&&progress.done>0){daily.progress=progress.done;if(progress.completed){daily.completed=true;daily.completedAt=now();daily.streak=safeInt(daily.streak,0,9999,0)+1;next=addTitle({...next,daily},'daily_hunter',now);next=addTitle(next,'daily_master',now);}else next={...next,daily};}
 else next={...next,daily};
 return next;
}
export function titleBonus(record){return Math.min(3,(record.titles||[]).length);}
export function updatePlayerName(record,name){return {...record,player:{...(record.player||{}),name:cleanText(name,16)||'旅人'}};}
export const PROFILE_TITLES=titleDefs;
