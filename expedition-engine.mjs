import {roster,cardOf,MUTATIONS,maxRound} from './progression.mjs';
import * as progression from './progression.mjs';
export const AUTO_DEFAULTS={turtle:'reactive',wolf:'flank',bird:'cluster'};
export const TACTICS={
 turtle:[{id:'reactive',label:'预判护盾',description:'敌方蓄力即将命中或近战逼近时开盾'},{id:'sustain',label:'保护伤员',description:'队友低于六成生命且受到威胁时开盾'}],
 wolf:[{id:'flank',label:'突袭后排',description:'优先切入后排，接近蓄力敌人时冲撞打断'},{id:'guard',label:'守护后排',description:'优先拦截靠近己方毕方的敌人'}],
 bird:[{id:'cluster',label:'范围压制',description:'烈焰优先覆盖最多敌人'},{id:'focus',label:'协同集火',description:'跟随狰兽攻击目标，狰兽退场后攻击残血敌人'}]
};
const STAT_KEYS=['damage','taken','shieldPrevented','guardPrevented','interrupts','blockedCharges','casts','backlineThreats','kills','summons','growth'];
const emptyUnitStats=()=>Object.fromEntries(STAT_KEYS.map(k=>[k,0]));
const emptyStats=units=>({since:0,units:Object.fromEntries(units.map(u=>[u.id,emptyUnitStats()]))});
const stats=(s,u)=>s.stats.units[u.id]??=(emptyUnitStats());
const LANES=[130,280,430];
const BASE={turtle:220,bird:100,wolf:155};
const alive=u=>!u.dead&&u.hp>0;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const foes=(s,u)=>s.units.filter(v=>v.team!==u.team&&alive(v));
const friends=(s,u)=>s.units.filter(v=>v.team===u.team&&alive(v));
function effect(s,u,text,type='hit'){s.effects.push({x:u.x,y:u.y,text,life:1.15,type});}
function make(id,team,kind,x,y,round,upgrades){let max=BASE[kind]+(team==='enemy'?(round-1)*12:upgrades.filter(x=>x==='vigor').length*20);return {id,team,kind,x,y,hp:max,max,shield:0,cast:0,strike:null,stun:0,cooldown:kind==='bird'?1.3:0,weak:0,dead:false};}
export function createBattle(run={},enemyVersion=4){
 const round=Math.max(1,Math.min(maxRound,Math.floor(run.round)||1)), level=Math.max(1,Math.min(progression.maxShopLevel,Math.floor(run.level)||1));
 const s={phase:'deploy',round,time:0,units:[],effects:[],zones:[],selectedTarget:null,message:'观察敌阵，调整站位后开战。',skills:{turtle:0,bird:0,wolf:0},upgrades:[],relics:[...(run.relics||[])],guard:{ally:0,enemy:0},synergies:[],auto:false,tactics:Object.fromEntries(Object.keys(AUTO_DEFAULTS).map(k=>[k,TACTICS[k].some(t=>t.id===run.tactics?.[k])?run.tactics[k]:AUTO_DEFAULTS[k]]))};
 const grid=Array.isArray(run.formation);
 const entries=grid?run.formation.slice(0,6).map((id,slot)=>{const card=roster(run).find(c=>c.id===id);return card?{...card,slot,x:slot%2?320:150,y:LANES[Math.floor(slot/2)]}:null;}).filter(Boolean):['turtle','bird','wolf'].map(kind=>{
  const chosen=run.equipped?.[kind],cardId=cardOf(run,chosen)?.kind===kind?chosen:kind;
  const copies=Number(run.owned?.[cardId])||1,stars=copies>=9?3:copies>=3?2:1;
  const lane=Number.isInteger(run.lanes?.[kind])?Math.max(0,Math.min(2,run.lanes[kind])):1;
  return {id:kind,kind,cardId,stars,x:{turtle:300,bird:130,wolf:220}[kind],y:LANES[lane]};
 });
 if(grid)s.skills={};
 const seen=new Set();
 for(const entry of entries){
  if(seen.has(entry.id))continue;seen.add(entry.id);
  const {kind,cardId,stars,x,y}=entry,u=make('a-'+entry.id,'ally',kind,x,y,1,[]);
  const info=cardOf(run,cardId);Object.assign(u,{cardId,stars,element:info.element,power:[1,1.45,2][stars-1],mutation:info.mutation||null,forge:info.forge||null,fusion:info.fusion||null,meshy:Boolean(info.sourceUrl)});
  if(grid){u.slot=entry.slot;s.skills[u.id]=0;}
  u.hp=u.max=Math.round(BASE[kind]*[1,1.65,2.6][stars-1]*(1+.08*(level-1))+(s.relics.includes('vigor')?25:0));s.units.push(u);
 }
 if(enemyVersion>=4){
  s.raceSynergies=[];
  for(const race of ['beast','feather','spirit'])if(new Set(s.units.filter(u=>cardOf(run,u.cardId)?.race===race).map(u=>u.cardId)).size>=2)s.raceSynergies.push(race);
  for(const u of s.units){
   const loadout=run.loadouts?.[u.id.slice(2)]||{};
   u.loadout={};u.passive=cardOf(run,u.cardId)?.passive||null;
   for(const slot of ['weapon','skill'])if(progression.GEAR?.[loadout[slot]]?.type===slot)u.loadout[slot]=loadout[slot];
   u.hp=u.max=Math.round((u.max+gearValue(u,'health')+forgeValue(u,'health')+mutationValue(u,'health'))*(s.raceSynergies.includes('spirit')?1.1:1));
  }
 }
 for(const element of ['water','fire','spirit'])if(s.units.filter(u=>u.element===element).length>=2)s.synergies.push(element);
 const formations=[
 [['turtle',650,280],['bird',820,130],['bird',820,430]],
 [['wolf',650,130],['wolf',650,430],['bird',820,280]],
 [['turtle',630,130],['turtle',630,430],['bird',790,280]],
 [['turtle',650,280],['bird',820,130],['bird',820,430],['wolf',700,430]],
 [['turtle',620,280],['wolf',700,130],['wolf',700,430],['bird',820,280]]];
 // Versioned encounter tables preserve already-running saves when balance changes.
 const encounters=[
  [['turtle',650,280,1],['bird',820,130,1],['bird',820,430,1]],
  [['wolf',650,130,1],['wolf',650,430,1],['bird',820,280,2],['turtle',650,280,1]],
  [['turtle',630,130,2],['turtle',630,430,1],['bird',820,280,2],['wolf',700,430,1],['bird',820,130,1]],
  [['turtle',650,280,2],['bird',820,130,2],['bird',820,430,2],['wolf',650,430,2],['wolf',650,130,1],['bird',820,280,1]],
  [['turtle',650,280,2],['wolf',650,130,2],['wolf',650,430,2],['bird',820,280,2],['bird',820,130,3],['turtle',650,430,2]],
  [['turtle',640,130,3],['turtle',640,430,2],['wolf',700,130,2],['wolf',700,430,2],['bird',830,280,3],['bird',830,430,2]],
  [['turtle',630,130,3],['turtle',630,430,3],['wolf',700,280,2],['bird',830,130,3],['bird',830,280,2],['bird',830,430,2]],
  [['turtle',620,130,3],['turtle',620,430,3],['wolf',700,280,3],['bird',840,130,3],['bird',840,280,2],['bird',840,430,2]],
  [['turtle',620,130,3],['turtle',620,430,3],['wolf',690,130,3],['wolf',690,430,3],['bird',840,130,3],['bird',840,430,2]],
  [['turtle',610,130,3],['turtle',610,430,3],['wolf',690,130,3],['wolf',690,430,3],['bird',840,130,3],['bird',840,430,3]]
 ];
 const legacy=enemyVersion===1;
 if(!legacy)s.enemyVersion=enemyVersion;
 const hpScale=1+.12*(round-1),powerScale=1+.08*(round-1);
 (legacy?formations[round-1]:encounters[round-1]).forEach(([kind,x,y,stars=1],i)=>{
  if(enemyVersion>=4&&round===maxRound)stars=3;
  const u=make('e-'+i,'enemy',kind,x,y,1,[]);
  u.hp=u.max=Math.round(BASE[kind]*(legacy?hpScale:[1,1.65,2.6][stars-1]));
  u.power=legacy?powerScale:[1,1.45,2][stars-1];u.stars=stars;u.cardId=kind;if(enemyVersion>=3)u.enemySkillCd=1+i*.35;s.units.push(u);
 });
 s.stats=emptyStats(s.units);return s;
}
export function deploy(s,id,slot){
 if(s.phase!=='deploy'||!Number.isInteger(slot))return false;
 const u=s.units.find(u=>u.id===id&&u.team==='ally');if(!u)return false;
 if(Number.isInteger(u.slot)){
  if(slot<0||slot>5)return false;
  const other=s.units.find(v=>v.team==='ally'&&v.slot===slot&&v.id!==id),old=u.slot;
  if(other){other.slot=old;other.x=old%2?320:150;other.y=LANES[Math.floor(old/2)];}
  u.slot=slot;u.x=slot%2?320:150;u.y=LANES[Math.floor(slot/2)];return true;
 }
 if(slot<0||slot>2)return false;u.y=LANES[slot];return true;
}
const gearValue=(u,effect)=>Object.values(u.loadout||{}).reduce((sum,id)=>sum+(progression.GEAR?.[id]?.effects?.[effect]??(progression.GEAR?.[id]?.effect===effect?progression.GEAR[id].value:0)),0);
const forgeValue=(u,effect)=>u.fusion?.effects?.[effect]??u.forge?.effects?.[effect]??0;
const mutationValue=(u,effect)=>MUTATIONS[u.mutation]?.effect===effect?MUTATIONS[u.mutation].value:0;
const fusionTriggers=u=>Array.isArray(u.fusion?.triggers)?u.fusion.triggers:[];
const hasTrigger=(u,id)=>fusionTriggers(u).includes(id);
const hasTaunt=u=>u.passive==='taunt'||gearValue(u,'taunt')>0||forgeValue(u,'taunt')>0;
function healTeam(s,u,amount,label){for(const ally of friends(s,u)){ally.hp=Math.min(ally.max,ally.hp+amount);effect(s,ally,`${label} +${amount}`,'shield');}}
function growUnit(s,u,hp=0,power=0,label='成长'){if(!alive(u))return;if(hp){u.max=Math.min(1400,u.max+hp);u.hp=Math.min(u.max,u.hp+hp);}if(power)u.power=Math.min(3.8,(u.power||1)+power);stats(s,u).growth++;effect(s,u,`${label}${hp?` +${hp}`:''}${power?' 攻+':''}`,'shield');}
function teamPower(s,u,amount,label){for(const ally of friends(s,u)){ally.power=Math.min(3.8,(ally.power||1)+amount);stats(s,ally).growth++;effect(s,ally,label,'shield');}}
function tauntTarget(s,u,fs){const taunts=fs.filter(v=>hasTaunt(v)&&dist(u,v)<=360);return taunts.sort((a,b)=>dist(u,a)-dist(u,b)||a.hp/a.max-b.hp/b.max)[0]||null;}
export function start(s){if(s.phase!=='deploy'||!s.units.some(u=>u.team==='ally'&&alive(u)))return false;s.phase='battle';for(const u of s.units.filter(u=>u.team==='ally')){const ward=Math.max(gearValue(u,'ward'),forgeValue(u,'ward'),mutationValue(u,'ward'),u.passive==='ward'?2:0);if(ward>0){u.shield=ward;effect(s,u,'开战护盾','shield');}}if(s.synergies.includes('water'))for(const u of s.units.filter(u=>u.team==='ally')){u.shield=Math.max(u.shield,2);effect(s,u,'水系共鸣 · 水幕','shield');}s.message='异兽将按战术自动交战，观察站位与配合。';return true;}
export function target(s,id){const u=s.units.find(u=>u.id===id&&u.team==='enemy'&&alive(u));if(!u||!['deploy','battle'].includes(s.phase))return false;s.selectedTarget=id;return true;}
function attackTarget(s,u,manual=false){const fs=foes(s,u);if(!fs.length)return null;const taunt=tauntTarget(s,u,fs);if(taunt)return taunt;if(s.auto&&u.team==='ally'&&u.kind==='bird'&&s.tactics.bird==='focus'){const wolf=friends(s,u).filter(v=>v.kind==='wolf').sort((a,b)=>dist(u,a)-dist(u,b))[0];return (wolf&&attackTarget(s,wolf))||fs.sort((a,b)=>a.hp-b.hp)[0];}if(s.auto&&u.team==='ally'&&u.kind==='wolf'&&s.tactics.wolf==='guard'){const bird=friends(s,u).filter(v=>v.kind==='bird').sort((a,b)=>dist(u,a)-dist(u,b))[0];if(bird){const threat=fs.filter(v=>v.kind!=='bird'&&dist(v,bird)<300).sort((a,b)=>dist(a,bird)-dist(b,bird))[0];if(threat)return threat;}}if(u.kind!=='wolf')return fs.sort((a,b)=>dist(u,a)-dist(u,b))[0];let victim=(manual&&fs.find(x=>x.id===s.selectedTarget))||fs.filter(x=>x.kind==='bird').sort((a,b)=>dist(u,a)-dist(u,b))[0]||fs.sort((a,b)=>dist(u,a)-dist(u,b))[0];if(manual&&u.cardId==='shadow_wolf')return victim;const block=fs.find(x=>x.kind==='turtle'&&Math.abs(x.y-u.y)<65&&((u.team==='ally'&&x.x>u.x+10&&x.x<victim.x)||(u.team==='enemy'&&x.x<u.x-10&&x.x>victim.x)));return block||victim;}
function damage(s,source,v,n){
 if(!alive(v))return;
 n*=(source.power||1)*(1+gearValue(source,'power')+forgeValue(source,'power')+mutationValue(source,'power')+(source.passive==='power'?.15:0)+(source.mutation==='ember'?.1:0));
 if(v.passive==='armor')n*=.9;
 if(source.weak>0)n*=.8;
 if(source.team==='ally'){if(s.relics.includes('fang'))n*=1.15;if(s.synergies.includes('fire'))n*=1.15;if(s.raceSynergies?.includes('beast'))n*=1.1;if(friends(s,source).some(a=>a.passive==='rally'))n*=s.relics.includes('drum')?1.12:1.08;const aura=friends(s,source).reduce((sum,a)=>sum+(hasTrigger(a,'team_attack_aura')?.08:0),0);if(aura)n*=1+aura;}
 const guard=s.units.find(g=>g.team===v.team&&g.kind==='turtle'&&alive(g)&&g.id!==v.id&&Math.abs(g.y-v.y)<90&&Math.abs(g.x-v.x)<220&&(v.team==='ally'?v.x<g.x:v.x>g.x));
 if(guard){stats(s,guard).guardPrevented+=n*.45;n*=.55;}
 if(v.shield>0){stats(s,v).shieldPrevented+=n*.75;n*=.25;}
 const actual=Math.min(v.hp,n);stats(s,source).damage+=actual;stats(s,v).taken+=actual;
 if(v.kind==='bird'&&source.kind!=='bird'&&n>0)stats(s,v).backlineThreats++;
 if(alive(source))source.hp=Math.min(source.max,source.hp+actual*(gearValue(source,'leech')+forgeValue(source,'leech')+(source.passive==='leech'?.15:0)));
 v.hp=Math.max(0,v.hp-n);effect(s,v,`−${Math.round(actual)}`);
 if(v.passive==='thorns'&&source.kind!=='bird'&&alive(source)&&source.team!==v.team){const reflect=Math.min(source.hp,Math.max(3,actual*.18*(v.team==='ally'&&s.relics.includes('thorn')?1.35:1)));source.hp=Math.max(0,source.hp-reflect);stats(s,v).damage+=reflect;stats(s,source).taken+=reflect;effect(s,source,`反刺 −${Math.round(reflect)}`,'hit');if(source.hp===0)killUnit(s,source,v);}
 if(v.hp===0)killUnit(s,v,source);
}
function killUnit(s,v,source){
 if(v.dead)return;v.dead=true;v.cast=0;v.strike=null;v.stun=0;effect(s,v,'退场','death');
 if(v.passive==='deathrattle')for(const ally of friends(s,v)){ally.shield=Math.max(ally.shield,2);effect(s,ally,'遗言护盾','shield');}
 if(v.passive==='death_summon'||hasTrigger(v,'death_summon_minion'))summonMinion(s,v,v.stars===3?2:1,'遗言幼魇');
 if(hasTrigger(v,'death_heal_team'))healTeam(s,v,v.stars===3?26:18,'遗言回春');
 if(hasTrigger(v,'death_team_attack'))teamPower(s,v,.04,'遗言战鼓');
 if(source&&alive(source)){stats(s,source).kills++;if(hasTrigger(source,'kill_summon'))summonMinion(s,source,source.stars===3?2:1,'击杀幼魇');if(hasTrigger(source,'kill_grow_self'))growUnit(s,source,source.stars===3?30:18,.04,'吞噬成长');if(hasTrigger(source,'kill_heal_team'))healTeam(s,source,source.stars===3?22:14,'击杀回春');if(hasTrigger(source,'kill_team_attack'))teamPower(s,source,.035,'击杀鼓舞');}
 if(source?.team==='ally'&&s.relics.includes('harvest'))for(const ally of friends(s,source)){ally.hp=Math.min(ally.max,ally.hp+15);effect(s,ally,'收获 +15','shield');}
}
function summonMinion(s,u,count=1,label='幼魇'){
 const dir=u.team==='ally'?1:-1;
 for(let i=0;i<count&&s.units.filter(x=>x.summoned&&x.team===u.team&&alive(x)).length<8;i++){
  const max=Math.round((u.stars===3?72:48)*(u.team==='enemy'?1.15:1)*(u.team==='ally'&&s.relics.includes('brood')?1.25:1)),id=`m-${u.id}-${Math.floor(s.time*10)}-${s.units.length}-${i}`;
  const m={id,team:u.team,kind:'wolf',cardId:'wolf',name:label,x:Math.max(40,Math.min(960,u.x+dir*(34+i*18))),y:Math.max(50,Math.min(510,u.y+(i?32:-32))),hp:max,max,shield:0,cast:0,strike:null,stun:0,cooldown:.4,weak:0,dead:false,stars:1,power:.62,passive:null,loadout:{},summoned:true};
  s.units.push(m);stats(s,m);stats(s,u).summons++;effect(s,m,label,'skill');
 }
}
const skillKey=(s,u)=>Object.hasOwn(s.skills,u.id)?u.id:u.kind;
export function skill(s,id){if(s.phase!=='battle')return false;const u=s.units.find(u=>u.team==='ally'&&(u.id===id||u.kind===id)&&alive(u)&&s.skills[skillKey(s,u)]<=0&&u.stun<=0);if(!u)return false;return castSkill(s,u);}
function castSkill(s,u,chosenTarget){const kind=u.kind,key=skillKey(s,u),friendly=u.team==='ally';const enemy=chosenTarget||attackTarget(s,u,friendly);if(!enemy)return false;stats(s,u).casts++;const cooldown=({turtle:8,bird:12,wolf:10}[kind])*(friendly&&s.relics.includes('focus')?.88:1)*(friendly&&s.synergies.includes('spirit')?.8:1)*Math.max(.45,1-gearValue(u,'haste')-forgeValue(u,'haste')-mutationValue(u,'haste'))*(u.passive==='quickcast'?.85:1)*(friendly&&s.raceSynergies?.includes('feather')?.9:1);if(friendly)s.skills[key]=cooldown;else u.enemySkillCd=cooldown;
 if(u.passive==='summoner'){summonMinion(s,u,u.stars===3?2:1,'招魂幼魇');s.message='招魂鸦召来幼魇，前线多了一只可吸收伤害的小怪。';settle(s);return true;}
 if(u.passive==='team_heal'){const amount=Math.round((u.stars===3?34:24)*(friendly&&s.relics.includes('lotus')?1.2:1));for(const ally of friends(s,u)){ally.hp=Math.min(ally.max,ally.hp+amount);if(ally.hp/ally.max<.55)ally.shield=Math.max(ally.shield,1.5);effect(s,ally,`群疗 +${amount}`,'shield');}s.message='莲甲兽释放群体治疗，低血队友获得短盾。';settle(s);return true;}
 if(kind==='turtle'){for(const ally of friends(s,u)){ally.shield=(u.stars===3?3:2)+(friendly&&s.relics.includes('tide')?1:0);effect(s,ally,'水幕 · 减伤','shield');}if(u.cardId==='ice_turtle')for(const v of foes(s,u)){if(v.cast>0)stats(s,u).interrupts++;v.cast=0;v.strike=null;v.stun=Math.max(v.stun,1);effect(s,v,'寒霜 · 冻结','shield');}s.message=u.cardId==='ice_turtle'?'寒霜水幕：全队减伤，敌方冻结 1 秒。':'水幕展开：全队暂时减伤 75%。';}if(kind==='wolf'){if(enemy.cast>0)stats(s,u).interrupts++;if(enemy.kind==='turtle')stats(s,u).blockedCharges++;u.x=enemy.x+(u.team==='ally'?-42:42);u.y=enemy.y;enemy.stun=1.3;enemy.cast=0;enemy.strike=null;enemy.cooldown=Math.max(enemy.cooldown,1.8);damage(s,u,enemy,u.stars===3?50:34);if(u.passive==='curse'&&alive(enemy)){enemy.weak=Math.max(enemy.weak,2);effect(s,enemy,'虚弱','shield');}effect(s,enemy,'冲撞 · 打断','skill');s.message=enemy.kind==='turtle'?'冲撞被玄龟拦住！下局可以调整侧翼站位。':'冲撞命中，打断施法！';}if(kind==='bird'){const chosen=chosenTarget||(friendly&&s.units.find(v=>v.id===s.selectedTarget&&v.team==='enemy'&&alive(v)))||enemy;if(u.passive==='sniper'){damage(s,u,chosen,u.stars===3?62:42);effect(s,chosen,'白鹤狙击','skill');s.message='白鹤狙击命中单体目标。';}else if(u.passive==='chain'){const victims=[chosen,...foes(s,u).filter(v=>v.id!==chosen.id).sort((a,b)=>dist(a,chosen)-dist(b,chosen)).slice(0,2)];victims.forEach((v,i)=>damage(s,u,v,(u.stars===3?42:30)*(i?0.62:1)*(friendly&&s.relics.includes('storm')?1.18:1)));effect(s,chosen,'雷链弹射','skill');s.message='雷泽鸮放出雷链，伤害在敌阵中弹射。';}else{for(const v of foes(s,u))if(dist(v,chosen)<(u.stars===3?185:125))damage(s,u,v,26+(u.stars===3?12:0)+(friendly&&s.relics.includes('ember')?10:0));if(u.cardId==='ember_bird')s.zones.push({x:chosen.x,y:chosen.y,radius:u.stars===3?185:125,life:2,sourceId:u.id,type:'fire'});effect(s,chosen,'烈焰爆发','fire');s.message='烈焰命中目标附近的敌人。';}}if(!friendly)s.message=`敌方${{turtle:'玄龟展开水幕',wolf:'狰兽发动冲撞',bird:'毕方释放烈焰'}[kind]}。`;settle(s);return true;}
function settle(s){if(s.phase!=='battle')return;if(!s.units.some(u=>u.team==='enemy'&&alive(u))){s.phase='won';s.message='获胜！你的异兽小队守住了战场。';}else if(!s.units.some(u=>u.team==='ally'&&alive(u))||s.time>=60){s.phase='lost';s.message=s.time>=60?'时间耗尽。调整站位，让狰突破后排再试。':'小队败退。查看战报，调整站位或战术再试。';}}
export function tick(s,dt){if(s.phase!=='battle'||!Number.isFinite(dt)||dt<=0)return s;dt=Math.min(dt,.1);s.time+=dt;for(const k of Object.keys(s.skills))s.skills[k]=Math.max(0,s.skills[k]-dt);for(const e of s.effects)e.life-=dt;s.effects=s.effects.filter(e=>e.life>0).slice(-50);for(const zone of s.zones){const source=s.units.find(u=>u.id===zone.sourceId);const elapsed=Math.min(dt,zone.life);if(source)for(const v of foes(s,source))if(dist(v,zone)<zone.radius)damage(s,source,v,14*elapsed);zone.life-=dt;}s.zones=s.zones.filter(z=>z.life>0);const growNow=Math.floor((s.time-dt)/5)<Math.floor(s.time/5);
 for(const grower of growNow?s.units.filter(u=>u.team==='ally'&&alive(u)&&(u.passive==='growth'||hasTrigger(u,'growth_self')||hasTrigger(u,'growth_team_hp'))):[]){const amount=Math.round((grower.stars===3?14:8)*(s.relics.includes('soil')?1.25:1));if(grower.passive==='growth'||hasTrigger(grower,'growth_team_hp'))for(const ally of friends(s,grower)){ally.max=Math.min(1400,ally.max+amount);ally.hp=Math.min(ally.max,ally.hp+amount);stats(s,ally).growth++;effect(s,ally,`成长 +${amount}`,'shield');}if(hasTrigger(grower,'growth_self'))growUnit(s,grower,grower.stars===3?16:10,.02,'自我成长');}
 for(const u of s.units){if(!alive(u))continue;u.hp=Math.min(u.max,u.hp+dt*(gearValue(u,'regen')+forgeValue(u,'regen')+(u.passive==='regen'?2:0)));if(u.enemySkillCd!==undefined)u.enemySkillCd=Math.max(0,u.enemySkillCd-dt);u.shield=Math.max(0,u.shield-dt);u.cooldown=Math.max(0,u.cooldown-dt);u.stun=Math.max(0,u.stun-dt);u.weak=Math.max(0,(u.weak||0)-dt);if(u.stun>0)continue;
 if(s.auto&&u.team==='ally'&&u.kind==='wolf'&&s.tactics.wolf==='guard'){
  const protectedBird=friends(s,u).filter(a=>a.kind==='bird').sort((a,b)=>dist(u,a)-dist(u,b))[0];
  if(protectedBird&&!foes(s,u).some(e=>e.kind!=='bird'&&dist(e,protectedBird)<300)){
   const post={x:Math.min(950,protectedBird.x+100),y:protectedBird.y},distance=dist(u,post);
   if(distance>1){const step=Math.min(distance,100*dt);u.x+=(post.x-u.x)/distance*step;u.y+=(post.y-u.y)/distance*step;}
   continue;
  }
 }
 if(u.passive==='pacifist'){if(u.cooldown<=0){const hurt=friends(s,u).filter(a=>a.hp<a.max).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(hurt){hurt.hp=Math.min(hurt.max,hurt.hp+12);effect(s,hurt,'治疗 +12','shield');u.cooldown=3;}}continue;}const v=attackTarget(s,u);if(!v)continue;if(u.cast>0){u.cast-=dt;if(u.cast<=0){if(u.passive==='sniper')damage(s,u,v,u.team==='enemy'&&!(s.enemyVersion>=3)?38:34);else for(const victim of foes(s,u))if(dist(victim,u.strike)<95)damage(s,u,victim,u.team==='enemy'&&!(s.enemyVersion>=3)?24:14);effect(s,u.strike,u.passive==='sniper'?'狙击':'轰！','fire');u.cast=0;u.strike=null;u.cooldown=u.passive==='sniper'?2.1:2.5;}continue;}if(u.kind==='bird'){if(u.cooldown<=0){u.cast=1.3;u.strike={x:v.x,y:v.y};effect(s,u,u.passive==='sniper'?'狙击蓄力':'喷火蓄力','cast');}continue;}const distance=dist(u,v);if(distance>55){const speed=u.kind==='wolf'?100:25;u.x+=(v.x-u.x)/distance*speed*dt;u.y+=(v.y-u.y)/distance*speed*dt;}else if(u.cooldown<=0){damage(s,u,v,u.kind==='wolf'?13:8);if(u.passive==='curse'&&alive(v)){v.weak=Math.max(v.weak,2);effect(s,v,'虚弱','shield');}u.cooldown=u.kind==='wolf'?.85:1.25;}}settle(s);return s;}

function threatened(s,ally){return foes(s,ally).some(e=>e.stun<=0&&((e.cast>0&&e.cast<.65&&e.strike&&dist(ally,e.strike)<95)||(e.kind!=='bird'&&dist(e,ally)<85)));}
export function tickAuto(s,dt){
 if(s.phase!=='battle'||!Number.isFinite(dt)||dt<=0)return s;
 s.auto=true;
 for(const turtle of s.units.filter(u=>u.team==='ally'&&u.kind==='turtle'&&alive(u))){
 if(friends(s,turtle).some(a=>a.shield<=0&&threatened(s,a)&&(s.tactics.turtle==='reactive'||a.hp/a.max<.6)))skill(s,turtle.id);
 }
 for(const wolf of s.units.filter(u=>u.team==='ally'&&u.kind==='wolf'&&alive(u))){
  const casting=s.tactics.wolf==='flank'&&foes(s,wolf).filter(e=>e.cast>0&&dist(wolf,e)<260).sort((a,b)=>a.cast-b.cast)[0];
  if(casting)s.selectedTarget=casting.id;
  const victim=attackTarget(s,wolf,Boolean(casting));
  if(victim){s.selectedTarget=victim.id;
   const bird=friends(s,wolf).filter(u=>u.kind==='bird').sort((a,b)=>dist(wolf,a)-dist(wolf,b))[0];
   const guarding=s.tactics.wolf==='guard'&&bird&&dist(victim,bird)<210;
   if((s.tactics.wolf!=='guard'||!bird||guarding)&&dist(wolf,victim)<260&&(victim.cast>0||guarding||dist(wolf,victim)<100))skill(s,wolf.id);
  }
 }
 for(const bird of s.units.filter(u=>u.team==='ally'&&u.kind==='bird'&&alive(u))){
  const enemies=foes(s,bird);
  const engaged=enemies.some(e=>friends(s,bird).some(a=>dist(a,e)<280)||e.cast>0);
  if(engaged&&enemies.length){
   const radius=bird.stars===3?185:125;
   const chosen=s.tactics.bird==='focus'?attackTarget(s,bird):enemies.slice().sort((a,b)=>enemies.filter(e=>dist(e,b)<radius).length-enemies.filter(e=>dist(e,a)<radius).length||a.hp-b.hp)[0];
   s.selectedTarget=chosen.id;skill(s,bird.id);
  }
 }
 if(s.enemyVersion>=3&&s.round>=2)enemySkills(s);
 return tick(s,dt);
}
function enemySkills(s){
 for(const u of s.units.filter(u=>u.team==='enemy'&&alive(u))){
  if(s.phase!=='battle'||u.stun>0||u.enemySkillCd>0)continue;
  if(u.kind==='turtle'){
   if(friends(s,u).some(a=>a.shield<=0&&threatened(s,a)))castSkill(s,u);
  }else if(u.kind==='wolf'){
   const victim=attackTarget(s,u);
   if(victim&&dist(u,victim)<260&&(victim.cast>0||dist(u,victim)<100))castSkill(s,u,victim);
  }else{
   const enemies=foes(s,u),radius=u.stars===3?185:125;
   if(enemies.some(e=>friends(s,u).some(a=>dist(a,e)<280)||e.cast>0)){
    const victim=enemies.sort((a,b)=>enemies.filter(e=>dist(e,b)<radius).length-enemies.filter(e=>dist(e,a)<radius).length||a.hp-b.hp)[0];
    if(victim)castSkill(s,u,victim);
   }
  }
 }
}

export function battleReport(s){
 const sum=kind=>s.units.filter(u=>u.team==='ally'&&u.kind===kind).reduce((total,u)=>{for(const key of STAT_KEYS)total[key]+=stats(s,u)[key];return total;},Object.fromEntries(STAT_KEYS.map(k=>[k,0])));
 const reports=[],wolf=sum('wolf'),bird=sum('bird');
 const saved=s.units.filter(u=>u.team==='ally').reduce((n,u)=>n+stats(s,u).shieldPrevented,0);
 if(wolf.blockedCharges)reports.push({fact:`狰兽 ${wolf.blockedCharges} 次冲撞命中敌方玄龟。`,tip:'尝试把狰兽放到另一侧翼，避开玄龟正面。'});
 const interrupted=s.units.filter(u=>u.team==='ally').reduce((n,u)=>n+stats(s,u).interrupts,0);
 if(interrupted)reports.push({fact:`己方共打断敌人 ${interrupted} 次蓄力。`,tip:'保留能够接近施法者的站位，继续压制后排。'});
 if(bird.backlineThreats)reports.push({fact:`己方毕方受到 ${bird.backlineThreats} 次近战命中，共承受 ${Math.round(bird.taken)} 点实际伤害（含远程）。`,tip:'尝试狰兽「守护后排」，或把毕方放在玄龟身后。'});
 if(saved>0)reports.push({fact:`水幕实际减免 ${Math.round(saved)} 点伤害。`,tip:'可比较预判护盾与保护伤员，选择适合敌阵的触发条件。'});
 if(!reports.length&&s.units.some(u=>u.team==='ally')){const top=s.units.filter(u=>u.team==='ally').sort((a,b)=>stats(s,b).damage-stats(s,a).damage)[0];reports.push({fact:`${{wolf:'狰兽',bird:'毕方',turtle:'玄龟'}[top.kind]}造成 ${Math.round(stats(s,top).damage)} 点实际伤害。`,tip:'尝试调整站位，比较下一次战斗的输出与承伤。'});}
 return reports.slice(0,3).map(r=>s.stats.since>0?{...r,fact:`从第 ${Math.floor(s.stats.since)} 秒恢复记录起：${r.fact}`}:r);
}

export function restoreBattle(raw,run){
 try{
  if(!raw||typeof raw!=='object'||raw.enemyVersion!==undefined&&![2,3,4].includes(raw.enemyVersion)||!['deploy','battle','won','lost'].includes(raw.phase))return null;
  if(run?.phase==='battle'&&raw.phase==='deploy'||run?.phase==='shop'&&raw.phase!=='deploy')return null;
  const s=createBattle(run,raw.enemyVersion??1), finite=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
  if(raw.round!==s.round||!finite(raw.time,0,60.1)||!Array.isArray(raw.units)||raw.units.length<s.units.length||raw.units.length>s.units.length+16)return null;
  const sourceMap=new Map(),used=new Set();
  for(const u of s.units){
   const src=raw.units.find(v=>v.id===u.id)||raw.units.find(v=>!used.has(v.id)&&v.team==='ally'&&/^a-(turtle|bird|wolf)$/.test(v.id)&&v.kind===u.kind&&v.cardId===u.cardId&&v.stars===u.stars);
   if(!src||used.has(src.id)||['team','kind','cardId','stars'].some(k=>src[k]!==u[k])||!finite(src.power,u.power,u.power+1.8)||!finite(src.max,u.max,u.max+520))return null;
   if(s.enemyVersion>=4&&u.team==='ally'&&(src.passive!==u.passive||JSON.stringify(src.loadout)!==JSON.stringify(u.loadout)))return null;
   used.add(src.id);sourceMap.set(src.id,u.id);
   if(!finite(src.x,0,1000)||!finite(src.y,0,560)||!finite(src.hp,0,src.max)||!finite(src.shield,0,8)||!finite(src.cast,0,2)||!finite(src.stun,0,5)||!finite(src.cooldown,0,20)||!finite(src.weak??0,0,5)||typeof src.dead!=='boolean'||src.dead!==(src.hp===0))return null;
   if(src.strike!==null&&(!src.strike||!finite(src.strike.x,0,1000)||!finite(src.strike.y,0,560)))return null;
   if(src.cast>0&&src.strike===null)return null;
   if(u.enemySkillCd!==undefined){if(!finite(src.enemySkillCd,0,12))return null;u.enemySkillCd=src.enemySkillCd;}
   for(const k of ['x','y','hp','max','shield','cast','stun','cooldown','weak','dead','power'])u[k]=src[k]??0;u.strike=src.strike===null?null:{x:src.strike.x,y:src.strike.y};
  }
  for(const src of raw.units.filter(v=>!used.has(v.id))){
   if(typeof src.id!=='string'||!/^m-[a-z0-9:_-]+$/.test(src.id)||!['ally','enemy'].includes(src.team)||src.kind!=='wolf'||src.cardId!=='wolf'||src.stars!==1||src.power!==.62||src.passive!==null||JSON.stringify(src.loadout||{})!=='{}'||src.summoned!==true)return null;
   if(!finite(src.x,0,1000)||!finite(src.y,0,560)||!finite(src.max,30,110)||!finite(src.hp,0,src.max)||!finite(src.shield,0,8)||!finite(src.cast,0,2)||!finite(src.stun,0,5)||!finite(src.cooldown,0,20)||!finite(src.weak??0,0,5)||typeof src.dead!=='boolean'||src.dead!==(src.hp===0)||src.strike!==null)return null;
   if(src.name!==undefined&&(typeof src.name!=='string'||src.name.length>12))return null;
   const m={id:src.id,team:src.team,kind:'wolf',cardId:'wolf',name:src.name||'幼魇',x:src.x,y:src.y,hp:src.hp,max:src.max,shield:src.shield,cast:0,strike:null,stun:src.stun,cooldown:src.cooldown,weak:src.weak??0,dead:src.dead,stars:1,power:.62,passive:null,loadout:{},summoned:true};
   used.add(src.id);sourceMap.set(src.id,src.id);s.units.push(m);stats(s,m);
  }
  for(const u of s.units.filter(u=>u.team==='ally'&&!u.summoned)){const oldId=[...sourceMap].find(([,id])=>id===u.id)?.[0],value=raw.skills?.[oldId]??raw.skills?.[u.kind];if(!finite(value,0,12))return null;s.skills[skillKey(s,u)]=value;}
  if(!Array.isArray(raw.effects)||raw.effects.length>100||!Array.isArray(raw.zones)||raw.zones.length>6)return null;
  for(const e of raw.effects){if(!e||!finite(e.x,0,1000)||!finite(e.y,0,560)||!finite(e.life,0,1.15)||typeof e.text!=='string'||e.text.length>80||!['hit','shield','death','skill','fire','cast'].includes(e.type))return null;s.effects.push({x:e.x,y:e.y,text:e.text,life:e.life,type:e.type});}
  for(const z of raw.zones){if(!z||!finite(z.x,0,1000)||!finite(z.y,0,560)||![125,185].includes(z.radius)||!finite(z.life,0,2)||z.type!=='fire'||s.units.find(u=>u.id===sourceMap.get(z.sourceId))?.cardId!=='ember_bird')return null;s.zones.push({x:z.x,y:z.y,radius:z.radius,life:z.life,sourceId:sourceMap.get(z.sourceId),type:'fire'});}
  if(raw.selectedTarget!==null&&!s.units.some(u=>u.team==='enemy'&&u.id===raw.selectedTarget))return null;
  if(raw.auto!==undefined&&typeof raw.auto!=='boolean')return null;s.auto=raw.auto??false;
  s.stats.since=raw.time;
  if(raw.stats!==undefined){
   if(!finite(raw.stats.since,0,raw.time))return null;s.stats.since=raw.stats.since;
   if(!raw.stats||!raw.stats.units||Object.keys(raw.stats.units).length!==s.units.length)return null;
   for(const u of s.units)for(const key of STAT_KEYS){const oldId=[...sourceMap].find(([,id])=>id===u.id)?.[0],value=raw.stats.units[oldId]?.[key];if(!finite(value,0,1000000)||(['casts','interrupts','blockedCharges','backlineThreats'].includes(key)&&!Number.isInteger(value)))return null;s.stats.units[u.id][key]=value;}
  }
  s.selectedTarget=raw.selectedTarget;s.phase=raw.phase;s.time=raw.time;
  const allies=s.units.some(u=>u.team==='ally'&&alive(u)),enemies=s.units.some(u=>u.team==='enemy'&&alive(u));
  if(s.phase==='won'&&enemies||s.phase==='lost'&&allies&&s.time<60||s.phase==='battle'&&(!allies||!enemies||s.time>=60)||s.phase==='deploy'&&s.time!==0)return null;
  s.message=typeof raw.message==='string'?raw.message.slice(0,160):s.message;return s;
 }catch{return null;}
}
