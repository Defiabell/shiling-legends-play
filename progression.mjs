/** Run economy is deterministic; visual/combat state belongs to the battle engine. */
export const CARDS = Object.freeze({
  turtle: {race:'spirit',name:'玄龟',kind:'turtle',element:'water',text:'坚守前排，护盾保护队友。',rarity:'common',cost:2},
  ice_turtle: {race:'spirit',name:'霜焰龟',kind:'turtle',element:'fire',text:'主动护盾同时冻结全体敌人 1 秒。',rarity:'rare',cost:3},
  bird: {race:'feather',name:'毕方',kind:'bird',element:'fire',text:'远程喷火，压制密集阵型。',rarity:'common',cost:2},
  ember_bird: {race:'feather',name:'青鸾',kind:'bird',element:'spirit',text:'喷火留下余烬，持续灼烧。',rarity:'rare',cost:3},
  wolf: {race:'beast',name:'狰兽',kind:'wolf',element:'spirit',text:'突进冲撞，打断敌人蓄力。',rarity:'common',cost:2},
  shadow_wolf: {race:'beast',name:'霜狰',kind:'wolf',element:'water',text:'穿越前排，直取敌方后阵。',rarity:'rare',cost:3},
  stone_turtle:{name:'岩甲龟',kind:'turtle',race:'beast',element:'water',passive:'armor',text:'岩甲使自身受到的伤害降低 10%。',rarity:'common',cost:2},
  moss_turtle:{name:'苔灵龟',kind:'turtle',race:'spirit',element:'spirit',passive:'regen',text:'每秒恢复 2 点生命。',rarity:'rare',cost:3},
  thunder_bird:{name:'雷羽',kind:'bird',race:'feather',element:'water',passive:'quickcast',text:'主动技能冷却缩短 15%。',rarity:'rare',cost:3},
  sun_bird:{name:'金乌',kind:'bird',race:'feather',element:'fire',passive:'power',text:'造成的伤害提高 15%。',rarity:'common',cost:2},
  blood_wolf:{name:'血狰',kind:'wolf',race:'beast',element:'fire',passive:'leech',text:'伤害的 15% 转化为自身生命。',rarity:'rare',cost:3},
  moon_wolf:{name:'月狐',kind:'wolf',race:'spirit',element:'water',passive:'ward',text:'开战获得持续 2 秒的护盾。',rarity:'common',cost:2},
  jade_spirit:{name:'社君',kind:'turtle',race:'spirit',element:'spirit',passive:'pacifist',text:'不普攻；每 3 秒治疗最近受伤友军 12 生命。',rarity:'common',cost:2},
  crane_bird:{name:'白鹤',kind:'bird',race:'feather',element:'water',passive:'sniper',text:'远程单体狙击，普攻蓄力后造成 34 伤害。',rarity:'common',cost:2},
  mourning_wolf:{name:'哀狰',kind:'wolf',race:'beast',element:'water',passive:'deathrattle',text:'遗言：退场时全队获得 2 秒护盾。',rarity:'rare',cost:3},
  brood_wolf:{name:'魇母',kind:'wolf',race:'beast',element:'spirit',passive:'death_summon',text:'遗言：召唤幼魇继续撕咬敌人。',rarity:'rare',cost:4},
  ghost_bird:{name:'招魂鸦',kind:'bird',race:'feather',element:'spirit',passive:'summoner',text:'主动技能召唤幼魇，不靠一次爆发取胜。',rarity:'rare',cost:4},
  lotus_turtle:{name:'莲甲兽',kind:'turtle',race:'spirit',element:'water',passive:'team_heal',text:'主动技能治疗全队，并给低血队友护盾。',rarity:'rare',cost:4},
  earth_turtle:{name:'息壤兽',kind:'turtle',race:'beast',element:'spirit',passive:'growth',text:'每 5 秒让全队生命上限成长。',rarity:'rare',cost:4},
  thorn_turtle:{name:'棘甲鼋',kind:'turtle',race:'beast',element:'water',passive:'thorns',text:'受到近战伤害时反刺攻击者。',rarity:'common',cost:3},
  taunt_turtle:{name:'吼山龟',kind:'turtle',race:'beast',element:'spirit',passive:'taunt',text:'嘲讽附近敌人，吸引普攻和主动技能目标。',rarity:'common',cost:3},
  storm_bird:{name:'雷泽鸮',kind:'bird',race:'feather',element:'water',passive:'chain',text:'主动技能会弹射到附近敌人。',rarity:'rare',cost:4},
  war_wolf:{name:'鼓狰',kind:'wolf',race:'beast',element:'fire',passive:'rally',text:'在场时鼓舞全队，提高造成的伤害。',rarity:'rare',cost:4},
  fox_wolf:{name:'狐魇',kind:'wolf',race:'spirit',element:'fire',passive:'curse',text:'普攻和冲撞附加虚弱，降低目标输出。',rarity:'common',cost:3},
});
export const RACES=Object.freeze({
  beast:{name:'野兽',text:'两种不同野兽：全队伤害提高 10%。'},
  feather:{name:'羽族',text:'两种不同羽族：全队技能冷却缩短 10%。'},
  spirit:{name:'灵族',text:'两种不同灵族：全队最大生命提高 10%。'},
});
export const GEAR=Object.freeze({
  fang_blade:{name:'獠牙刃',type:'weapon',effects:{power:.12,health:20},cost:3,text:'伤害提高 12%，生命增加 20。'},
  iron_shell:{name:'玄铁甲',type:'weapon',effects:{health:85,ward:1},cost:3,text:'生命增加 85，开战获得 1 秒护盾。'},
  spirit_staff:{name:'聚灵杖',type:'weapon',effects:{haste:.16,regen:1},cost:3,text:'技能冷却缩短 16%，每秒恢复 1 生命。'},
  leech:{name:'噬血术',type:'skill',effects:{leech:.12,power:.06},cost:3,text:'吸血 12%，伤害提高 6%。'},
  mend:{name:'回春术',type:'skill',effects:{regen:2,health:35},cost:3,text:'每秒恢复 2 生命，生命增加 35。'},
  frost:{name:'霜盾术',type:'skill',effects:{ward:2,health:45},cost:3,text:'开战获得 2 秒护盾，生命增加 45。'},
  taunt_roar:{name:'嘲讽鼓',type:'skill',effects:{taunt:1,health:50},cost:3,text:'生命增加 50，嘲讽 360 范围敌人。'},
});

export const KIND_STATS=Object.freeze({
  turtle:{role:'近战守卫',range:'近战',hp:220,attack:8,attackCd:1.25,move:25,skillCd:8,skill:'全队护盾 2 秒，护盾期间减伤 75%'},
  bird:{role:'远程群伤',range:'远程',hp:100,attack:18,attackCd:2.5,cast:1.3,move:0,skillCd:12,skill:'目标周围 125 半径造成 26 伤害'},
  wolf:{role:'近战刺客',range:'近战',hp:155,attack:13,attackCd:.85,move:100,skillCd:10,skill:'冲撞造成 34 伤害，打断并眩晕 1.3 秒'}
});
export const PASSIVES=Object.freeze({
  armor:'受到伤害降低 10%',regen:'每秒恢复 2 生命',quickcast:'技能冷却缩短 15%',power:'伤害提高 15%',leech:'伤害的 15% 转化为生命',ward:'开战获得 2 秒护盾',pacifist:'不普攻；每 3 秒治疗友军 12 生命',sniper:'远程单体：蓄力普攻造成 34 伤害',deathrattle:'遗言：退场时全队获得 2 秒护盾',death_summon:'遗言：召唤幼魇继续战斗',summoner:'主动技能召唤幼魇',team_heal:'主动技能治疗全队',growth:'每 5 秒让全队生命上限成长',thorns:'受到近战伤害时反刺',chain:'主动技能弹射多个目标',rally:'在场时全队伤害提高 8%',curse:'命中后使目标虚弱 2 秒',taunt:'嘲讽附近敌人，吸引普攻和主动技能目标'
});
const starHp=[1,1.65,2.6],starPower=[1,1.45,2];
const gearValueFrom=(loadout,effect)=>Object.values(loadout||{}).reduce((sum,id)=>sum+(GEAR[id]?.effects?.[effect]??(GEAR[id]?.effect===effect?GEAR[id].value:0)),0);
const forgeValue=(card,effect)=>card?.forge?.effects?.[effect]??0;
export function combatStats(run,cardId,stars=1,level=run?.level||1,loadout={}){
  const c=cardOf(run,cardId),base=KIND_STATS[c?.kind]||KIND_STATS.turtle,s=Math.max(1,Math.min(3,stars||1)),lvl=Math.max(1,Math.min(maxShopLevel,level||1)),mutation=c?.mutation&&MUTATIONS[c.mutation];
  const healthBonus=gearValueFrom(loadout,'health')+forgeValue(c,'health')+(mutation?.effect==='health'?mutation.value:0),powerBonus=gearValueFrom(loadout,'power')+forgeValue(c,'power')+(mutation?.effect==='power'?mutation.value:0)+(c?.passive==='power'?.15:0)+(c?.mutation==='ember'?.1:0);
  const haste=gearValueFrom(loadout,'haste')+forgeValue(c,'haste')+(mutation?.effect==='haste'?mutation.value:0)+(c?.passive==='quickcast'?.15:0);
  const taunt=gearValueFrom(loadout,'taunt')>0||forgeValue(c,'taunt')>0||c?.passive==='taunt';
  const hp=Math.round(base.hp*starHp[s-1]*(1+.08*(lvl-1))+healthBonus),attack=c?.passive==='pacifist'?0:Math.round((c?.passive==='sniper'?34:base.attack)*starPower[s-1]*(1+powerBonus));
  const skillCd=Number((base.skillCd*Math.max(.45,1-haste)).toFixed(1)),skillDamage=c?.kind==='wolf'?Math.round((s===3?50:34)*(1+powerBonus)):c?.kind==='bird'?Math.round((c?.passive==='sniper'?(s===3?62:42):(26+(s===3?12:0)))*(1+powerBonus)):0;
  const skillEffect=c?.passive==='pacifist'?`不释放主动；每 3 秒治疗最低血队友 12`:c?.passive==='team_heal'?`全队治疗 ${s===3?34:24}，低血队友护盾 1.5 秒`:c?.passive==='summoner'?`召唤 ${s===3?2:1} 只幼魇参战`:c?.passive==='chain'?`雷击 ${Math.round((s===3?42:30)*(1+powerBonus))}，弹射最多 2 个目标`:c?.kind==='turtle'?`全队护盾 ${s===3?3:2} 秒，减伤 75%${cardId==='ice_turtle'?'，冻结敌人 1 秒':''}`:c?.kind==='wolf'?`冲撞 ${skillDamage} 伤害，眩晕 1.3 秒`:c?.passive==='sniper'?`单体狙击 ${skillDamage} 伤害`:`群伤 ${skillDamage}，半径 ${s===3?185:125}`;
  return {role:base.role,range:base.range,hp,attack,attackCd:base.attackCd,move:base.move,skillCd,skillDamage,skillEffect:c?.forge?.text?`${skillEffect}｜铸灵：${c.forge.text}`:skillEffect,taunt,passive:c?.passive?PASSIVES[c.passive]:'',forge:c?.forge?.text||''};
}

export const MUTATIONS=Object.freeze({
  horn:{name:'角突',effect:'power',value:.18,text:'伤害提高 18%。'},
  scale:{name:'鳞甲',effect:'health',value:45,text:'最大生命增加 45。'},
  wing:{name:'翼足',effect:'haste',value:.14,text:'主动技能冷却缩短 14%。'},
  ember:{name:'火囊',effect:'fireborn',value:1,text:'开战获得 1 层火血，普攻更凶。'},
  moon:{name:'月纹',effect:'ward',value:1.5,text:'开战获得 1.5 秒护盾。'},
});
const prefixes=['雾','赤','玄','霜','岚','烬','月','雷'],suffixes=['魇','麟','魈','蜃','犼','鸾','狰','灵'];
export function cardOf(run,id){return run?.mutants?.find(m=>m.id===id)||CARDS[id];}
export function cardName(run,id){return cardOf(run,id)?.name||id;}

export const RELICS = Object.freeze({
  fang:{name:'凶兽獠牙',text:'全队攻击提高 15%。'},
  vigor:{name:'长生玉',text:'全队生命增加 25。'},
  focus:{name:'聚灵石',text:'主动技能冷却缩短 12%。'},
  ember:{name:'赤焰羽',text:'鸟类主动技能伤害增加 10。'},
  tide:{name:'沧海珠',text:'玄龟护盾持续时间增加 1 秒。'},
  harvest:{name:'噬灵铃',text:'每次击杀，全队恢复 15 生命。'},
  brood:{name:'魇巢骨',text:'召唤物生命提高 25%。'},
  lotus:{name:'莲心盏',text:'治疗效果提高 20%。'},
  thorn:{name:'棘甲符',text:'反刺伤害提高。'},
  storm:{name:'雷泽印',text:'弹射技能额外伤害。'},
  drum:{name:'战鼓皮',text:'鼓舞效果提高。'},
  soil:{name:'息壤核',text:'成长效果提高。'},
});
const tacticOptions={turtle:['reactive','sustain'],wolf:['flank','guard'],bird:['cluster','focus']};
export const defaultTactics={turtle:'reactive',wolf:'flank',bird:'cluster'};
const ids=Object.keys(CARDS), gearIds=Object.keys(GEAR), kinds=['turtle','bird','wolf'], relicIds=Object.keys(RELICS);
export const maxShopLevel=6;
export const maxRound=10;
const shopXpNeed=level=>level>=maxShopLevel?Infinity:level*2+2;
export const nextShopXp=shopXpNeed;
const CARD_TIERS=Object.freeze({turtle:1,bird:1,wolf:1,stone_turtle:2,sun_bird:2,moon_wolf:2,jade_spirit:2,crane_bird:2,thorn_turtle:2,taunt_turtle:3,ice_turtle:3,moss_turtle:3,thunder_bird:3,blood_wolf:3,shadow_wolf:3,mourning_wolf:3,ember_bird:4,fox_wolf:4,lotus_turtle:4,brood_wolf:5,storm_bird:5,earth_turtle:5,ghost_bird:6,war_wolf:6});
const cardTier=id=>CARD_TIERS[id]||Math.max(2,Math.min(maxShopLevel,cardOf({mutants:[]},id)?.cost||2));
const gearTier=id=>({fang_blade:1,mend:1,iron_shell:2,leech:3,frost:4,taunt_roar:4,spirit_staff:5}[id]||6);
export const itemTier=o=>o?.type==='gear'?gearTier(o.id):o?.type==='egg'?Math.max(2,Math.min(maxShopLevel,o.tier||2)):cardTier(o.id);
export const tierOdds=level=>{const table={1:[.72,.24,.04,0,0,0],2:[.48,.34,.14,.04,0,0],3:[.25,.34,.25,.12,.04,0],4:[.12,.24,.3,.22,.09,.03],5:[.05,.15,.25,.28,.18,.09],6:[.02,.08,.18,.27,.27,.18]};return table[Math.max(1,Math.min(maxShopLevel,level))];};
const clone=s=>structuredClone(s);
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
export const star=count=>count>=9?3:count>=3?2:count>=1?1:0;
const occurrenceKey=(prefix,identity,counts)=>{const key=`${prefix}:${identity}`,count=counts.get(key)||0;counts.set(key,count+1);return `${key}:${count}`;};
const handKeys=s=>{const field=new Set((s.formation||[]).filter(Boolean)),gearCounts=new Map(),eggCounts=new Map();return [...roster(s).filter(u=>!field.has(u.id)).map(u=>`unit:${u.id}`),...(s.gearBag||[]).map(id=>occurrenceKey('gear',id,gearCounts)),...(s.pendingEggs||[]).map(e=>occurrenceKey('egg',`${e.tier}:${e.readyRound}`,eggCounts))];};
function syncHandOrder(n,previous=n){const current=handKeys(n),currentSet=new Set(current),old=Array.isArray(previous.handOrder)?previous.handOrder:[],kept=old.filter(k=>currentSet.has(k)),seen=new Set(kept);for(const k of current)if(!seen.has(k)){kept.push(k);seen.add(k);}n.handOrder=kept;return n;}
/** Each owned count decomposes into independently deployable, automatically merged beasts. */
export function roster(s){
  return [...ids,...(s.mutants||[]).map(m=>m.id)].flatMap(cardId=>{
    let count=s.owned[cardId]||0;const units=[];
    for(const [stars,value] of [[3,9],[2,3],[1,1]]){
      const copies=Math.floor(count/value);count%=value;
      for(let ordinal=0;ordinal<copies;ordinal++)units.push({id:`${cardId}:${stars}:${ordinal}`,cardId,kind:cardOf(s,cardId).kind,stars});
    }
    return units;
  });
}
function legacyFormation(s){
  const units=roster(s),formation=Array(6).fill(null);
  for(const kind of kinds){
    const unit=units.find(u=>u.cardId===s.equipped[kind]);if(!unit)continue;
    const preferred=s.lanes[kind]*2+(kind==='bird'?0:1);
    const slot=formation[preferred]===null?preferred:formation.findIndex(x=>x===null);
    formation[slot]=unit.id;
  }
  return formation;
}
function reconcileFormation(previous,next){
  const before=roster(previous),after=roster(next),valid=new Set(after.map(u=>u.id));
  const oldFormation=previous.formation||legacyFormation(previous);
  const formation=oldFormation.map(id=>valid.has(id)?id:null);
  const used=new Set(formation.filter(Boolean));
  // A newly merged beast inherits the first occupied slot of a consumed copy.
  for(let slot=0;slot<6;slot++){
    if(formation[slot]||!oldFormation[slot])continue;
    const consumed=before.find(u=>u.id===oldFormation[slot]);if(!consumed)continue;
    const replacement=after.find(u=>u.cardId===consumed.cardId&&!used.has(u.id)&&!before.some(old=>old.id===u.id));
    if(replacement){formation[slot]=replacement.id;used.add(replacement.id);}
  }
  next.formation=formation;
  next.gearBag=[...(previous.gearBag||[])];next.loadouts={};
  for(const [id,loadout] of Object.entries(previous.loadouts||{})){
    if(valid.has(id))next.loadouts[id]={...loadout};
    else next.gearBag.push(...Object.values(loadout));
  }
}
export function placeUnit(s,unitId,toIndex){
  if(s.phase!=='shop'||!int(toIndex,0,5)||!roster(s).some(u=>u.id===unitId))return s;
  const formation=s.formation||legacyFormation(s),from=formation.indexOf(unitId);
  if(from===toIndex)return s;
  const n=clone(s);n.formation=[...formation];
  if(from>=0)n.formation[from]=formation[toIndex];
  n.formation[toIndex]=unitId;n.message='布阵已更新，可拖动异兽换位。';return syncHandOrder(n,s);
}
export function removeUnit(s,index){
  if(s.phase!=='shop'||!int(index,0,5)||!s.formation?.[index])return s;
  const n=clone(s);n.formation[index]=null;n.message='异兽已回到候补区。';return syncHandOrder(n,s);
}
export function sellPrice(unit,run={}){return Math.floor((cardOf(run,unit.cardId)?.cost||2)*3**(unit.stars-1)*.5);}
export function sellUnit(s,unitId){
  const unit=roster(s).find(u=>u.id===unitId);
  if(s.phase!=='shop'||!unit)return s;
  const n=clone(s),ordinal=Number(unit.id.split(':')[2]);
  n.gearBag=[...(n.gearBag||[]),...Object.values(n.loadouts?.[unitId]||{})];
  n.loadouts=Object.fromEntries(Object.entries(n.loadouts||{}).filter(([id])=>id!==unitId).map(([id,gear])=>{const [card,stars,index]=id.split(':');return [card===unit.cardId&&Number(stars)===unit.stars&&Number(index)>ordinal?`${card}:${stars}:${Number(index)-1}`:id,gear];}));
  n.owned[unit.cardId]-=3**(unit.stars-1);n.gold+=sellPrice(unit,s);
  // Counts compact instance ordinals; preserve the surviving deployed copies.
  n.formation=n.formation.map(id=>{if(!id||id===unitId)return null;const [card,stars,index]=id.split(':');return card===unit.cardId&&Number(stars)===unit.stars&&Number(index)>ordinal?`${card}:${stars}:${Number(index)-1}`:id;});
  if(!n.owned[n.equipped[unit.kind]])n.equipped[unit.kind]=[...Object.keys(CARDS),...(n.mutants||[]).map(m=>m.id)].find(id=>cardOf(n,id)?.kind===unit.kind&&n.owned[id]>0)||null;
  n.message=`已出售${cardName(s,unit.cardId)}（${unit.stars}星），获得 ${sellPrice(unit,s)} 金。`;return syncHandOrder(n,s);
}
export const rareChance=level=>tierOdds(level).reduce((sum,p,i)=>sum+(i>0?p:0),0);
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function pickTier(s){const odds=tierOdds(s.level),r=random(s);let sum=0;for(let i=0;i<odds.length;i++){sum+=odds[i];if(r<sum)return i+1;}return odds.length;}
function drawMixedOffer(s){
  const roll=random(s),type=s.round>=maxRound?(roll<.58?'beast':roll<.8?'weapon':'skill'):roll<.14?'egg':roll<.6?'beast':roll<.81?'weapon':'skill',tier=pickTier(s);
  if(type==='egg')return {type:'egg',tier:Math.max(2,tier),sold:false};
  if(type==='beast'){const pool=ids.filter(id=>cardTier(id)<=tier);return {type:'beast',id:pool[Math.floor(random(s)*pool.length)],sold:false};}
  const pool=gearIds.filter(id=>GEAR[id].type===type&&gearTier(id)<=tier);return {type:'gear',id:pool[Math.floor(random(s)*pool.length)],sold:false};
}
function drawShop(s){return Array.from({length:3},()=>drawMixedOffer(s));}
function drawGearShop(s){return ['weapon','skill'].map(type=>{const pool=gearIds.filter(id=>GEAR[id].type===type);return {id:pool[Math.floor(random(s)*pool.length)],sold:false};});}
function hatchInto(n,tier=2){const base=kinds[Math.floor(random(n)*kinds.length)],race=Object.keys(RACES)[Math.floor(random(n)*3)],element=['water','fire','spirit'][Math.floor(random(n)*3)],keys=Object.keys(MUTATIONS),mutation=keys[Math.floor(random(n)*keys.length)],id=`mut_${n.seed.toString(36)}_${(n.mutants?.length||0)+1}`,name=prefixes[Math.floor(random(n)*prefixes.length)]+suffixes[Math.floor(random(n)*suffixes.length)],cost=3+(tier>=3?1:0);n.mutants=[...(n.mutants||[]),{id,name,kind:base,race,element,mutation,rarity:tier>=3?'rare':'common',cost,text:`生成异兽 · ${MUTATIONS[mutation].name}：${MUTATIONS[mutation].text}`,hue:Math.floor(random(n)*300)}];n.owned[id]=(n.owned[id]||0)+1;return {id,name,mutation};}
function hatchReady(n){const ready=[],later=[];for(const egg of n.pendingEggs||[])(egg.readyRound<=n.round?ready:later).push(egg);n.pendingEggs=later;return ready.map(egg=>hatchInto(n,egg.tier));}

const forgeProfiles=Object.freeze({
  guardian:{name:'守卫',kind:'turtle',race:'spirit',element:'water',mutation:'scale',passive:'taunt',prefix:'玄',suffix:'铸',forge:{name:'山铠',effects:{health:70,taunt:1},text:'生命 +70，嘲讽范围更稳定'}},
  archer:{name:'射手',kind:'bird',race:'feather',element:'fire',mutation:'wing',passive:'sniper',prefix:'焰',suffix:'羽',forge:{name:'穿羽',effects:{power:.16,haste:.08},text:'伤害 +16%，冷却 -8%'}},
  healer:{name:'治疗',kind:'turtle',race:'spirit',element:'spirit',mutation:'moon',passive:'team_heal',prefix:'月',suffix:'灵',forge:{name:'月泉',effects:{health:35,haste:.1},text:'生命 +35，群疗更频繁'}},
  summoner:{name:'召唤',kind:'bird',race:'feather',element:'spirit',mutation:'ember',passive:'summoner',prefix:'魂',suffix:'鸦',forge:{name:'魇巢',effects:{haste:.14,health:25},text:'冷却 -14%，更快召唤幼魇'}},
  assassin:{name:'刺客',kind:'wolf',race:'beast',element:'fire',mutation:'horn',passive:'leech',prefix:'赤',suffix:'魇',forge:{name:'血牙',effects:{power:.14,health:20},text:'伤害 +14%，生命 +20'}},
});
const safeForgeName=(value,profile)=>String(value||`${profile.prefix}${profile.suffix}`).replace(/[<>\/:*?"'|]/g,'').trim().slice(0,8)||`${profile.prefix}${profile.suffix}`;
export function forgeCreature(s,draft={}){
  if(s.phase!=='shop'||(s.mutants||[]).length>=12||s.gold<3)return s;
  const profile=forgeProfiles[draft.role]||forgeProfiles.guardian,n=clone(s),prompt=String(draft.prompt||'').trim().replace(/\s+/g,' ').slice(0,36),link=String(draft.url||'').trim(),mutation=MUTATIONS[profile.mutation],salt=`${n.seed}_${n.round}_${n.mutants.length}_${safeForgeName(draft.name,profile)}`.toLowerCase().replace(/[^a-z0-9_]+/g,'_').slice(0,36)||'forge';
  let id=`mut_forge_${salt}`,i=1;while(n.mutants.some(m=>m.id===id)||Object.hasOwn(n.owned,id))id=`mut_forge_${salt}_${i++}`.slice(0,58);
  const name=safeForgeName(draft.name,profile),sourceUrl=/^https?:\/\//.test(link)?link.slice(0,500):'',source=sourceUrl?' · 已绑定模型链接':'';
  n.gold-=3;n.mutants=[...(n.mutants||[]),{id,name,kind:profile.kind,race:profile.race,element:profile.element,mutation:profile.mutation,passive:profile.passive,forge:profile.forge,rarity:'rare',cost:3,text:`Meshy铸灵 · ${profile.name} · ${profile.forge.name}：${profile.forge.text}${source}`,hue:Math.floor(random(n)*300),...(sourceUrl?{sourceUrl}: {})}];
  n.owned[id]=1;n.message=`${name}已铸成${profile.name}伙伴，进入手牌区，可布阵、装备和出售。${prompt?` 灵感：${prompt}`:''}`.slice(0,500);
  return syncHandOrder(n,s);
}

export function recallForge(s,card={}){
  if(s.phase!=='shop'||s.gold<4)return s;
  const sourceUrl=String(card.sourceUrl||'').trim();
  if(!/^https?:\/\//.test(sourceUrl))return s;
  const existing=(s.mutants||[]).find(m=>m.sourceUrl===sourceUrl||m.id===card.id);
  if(existing&&s.owned[existing.id]>=9)return s;
  if(!existing&&(s.mutants||[]).length>=12)return s;
  const n=clone(s);let id=existing?.id||String(card.id||'').toLowerCase().replace(/[^a-z0-9_]+/g,'_').slice(0,58);
  if(!/^mut_[a-z0-9_]+$/.test(id))id=`mut_recall_${n.seed.toString(36)}_${(n.mutants||[]).length+1}`;
  let i=1;while(!existing&&(n.mutants.some(m=>m.id===id)||Object.hasOwn(n.owned,id)))id=`mut_recall_${n.seed.toString(36)}_${i++}`.slice(0,58);
  if(!existing){
    const kind=kinds.includes(card.kind)?card.kind:'turtle',race=Object.hasOwn(RACES,card.race)?card.race:'spirit',element=['water','fire','spirit'].includes(card.element)?card.element:'spirit',mutation=Object.hasOwn(MUTATIONS,card.mutation)?card.mutation:'moon',passive=Object.hasOwn(PASSIVES,card.passive)?card.passive:undefined;
    const forge=record(card.forge)&&typeof card.forge.name==='string'&&typeof card.forge.text==='string'&&record(card.forge.effects)?{name:card.forge.name.slice(0,8)||'灵契',text:card.forge.text.slice(0,80)||'召回伙伴',effects:Object.fromEntries(Object.entries(card.forge.effects).filter(([k,v])=>['health','power','haste','taunt'].includes(k)&&typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=120))}:undefined;
    const restored={id,name:safeForgeName(card.name,{prefix:'灵',suffix:'藏'}),kind,race,element,mutation,...(passive?{passive}:{}),...(forge?{forge}:{}),rarity:card.rarity==='common'?'common':'rare',cost:int(card.cost,3,5)?card.cost:3,text:String(card.text||'灵藏召回 · 曾经铸成的 Meshy 伙伴').slice(0,180),hue:int(card.hue,0,300)?card.hue:Math.floor(random(n)*300),sourceUrl:sourceUrl.slice(0,500)};
    n.mutants=[...(n.mutants||[]),restored];n.owned[id]=0;
  }
  n.gold-=4;n.owned[id]=(n.owned[id]||0)+1;reconcileFormation(s,n);n.message=`从灵藏召回${cardName(n,id)}，进入手牌区。再次召回同名伙伴可继续升星。`;
  return syncHandOrder(n,s);
}

export function buyGear(s,index){
  const offer=s.shop?.[index]?.type==='gear'?s.shop[index]:s.gearShop?.[index];if(s.phase!=='shop'||!offer||offer.sold||!Object.hasOwn(GEAR,offer.id)||s.gold<GEAR[offer.id].cost)return s;
  const n=clone(s);n.gold-=GEAR[offer.id].cost;if(n.shop?.[index]?.type==='gear')n.shop[index].sold=true;else if(n.gearShop?.[index])n.gearShop[index].sold=true;n.gearBag.push(offer.id);n.message=`获得${GEAR[offer.id].name}，拖到阵位给异兽装备。`;return syncHandOrder(n,s);
}
export function sellGear(s,bagIndex){
  if(s.phase!=='shop'||!int(bagIndex,0,(s.gearBag?.length||0)-1))return s;
  const n=clone(s),id=n.gearBag.splice(bagIndex,1)[0],price=Math.max(1,Math.floor(GEAR[id].cost*.5));n.gold+=price;n.message=`已出售${GEAR[id].name}，获得 ${price} 金。`;return syncHandOrder(n,s);
}
export function sellEgg(s,index){
  if(s.phase!=='shop'||!int(index,0,(s.pendingEggs?.length||0)-1))return s;
  const n=clone(s);n.pendingEggs.splice(index,1);n.gold+=2;n.message='已出售山海胚胎，获得 2 金。';return syncHandOrder(n,s);
}
export function equipGear(s,bagIndex,unitId){
  if(s.phase!=='shop'||!int(bagIndex,0,(s.gearBag?.length||0)-1)||!roster(s).some(u=>u.id===unitId))return s;
  const n=clone(s),id=n.gearBag.splice(bagIndex,1)[0],type=GEAR[id].type;
  n.loadouts[unitId]??={};if(n.loadouts[unitId][type])n.gearBag.push(n.loadouts[unitId][type]);
  n.loadouts[unitId][type]=id;n.message=`已装备${GEAR[id].name}。`;return syncHandOrder(n,s);
}
export function unequipGear(s,unitId,type){
  if(s.phase!=='shop'||!['weapon','skill'].includes(type)||!s.loadouts?.[unitId]?.[type])return s;
  const n=clone(s);n.gearBag.push(n.loadouts[unitId][type]);delete n.loadouts[unitId][type];
  if(!Object.keys(n.loadouts[unitId]).length)delete n.loadouts[unitId];n.message='装备已退回背包。';return syncHandOrder(n,s);
}
function rewardOptions(s){const pool=relicIds.filter(id=>!s.relics.includes(id));for(let i=pool.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,3);}
export function createRun(seed=Date.now()){
  const s={version:1,seed:Number(seed)>>>0,phase:'shop',round:1,gold:8,level:1,xp:0,lives:3,owned:Object.fromEntries(ids.map(id=>[id,kinds.includes(id)?1:0])),mutants:[],pendingEggs:[],handOrder:[],equipped:{turtle:'turtle',bird:'bird',wolf:'wolf'},shop:[],gearShop:[],gearBag:[],loadouts:{},rewards:[],relics:[],wins:0,message:'买两张狰兽，合成二星；布阵后开战。',lanes:{turtle:1,bird:1,wolf:1},tactics:{...defaultTactics}};
  s.formation=[null,'wolf:1:0','bird:1:0','turtle:1:0',null,null];
  s.shop=drawShop(s);s.shop[0]={type:'beast',id:'wolf',sold:false};s.shop[1]={type:'egg',tier:2,sold:false};s.shop[2]={type:'gear',id:'fang_blade',sold:false};s.gearShop=drawGearShop(s);return s;
}
export function buy(s,index){
  const offer=s.shop[index];if(s.phase!=='shop'||!int(index,0,s.shop.length-1)||!offer||offer.type==='gear')return buyGear(s,index);if(offer.type==='egg'){if(offer.sold||s.gold<4||s.round>=maxRound)return s;const n=clone(s);n.gold-=4;n.shop[index].sold=true;n.pendingEggs=[...(n.pendingEggs||[]),{tier:offer.tier,readyRound:s.round+1}];n.message=`山海胚胎已入手，将在第 ${Math.min(maxRound,s.round+1)} 战备战时孵化。`;return syncHandOrder(n,s);}if(offer.sold||s.gold<CARDS[offer.id].cost||s.owned[offer.id]>=9)return s;
  const n=clone(s),id=offer.id,previous=star(n.owned[id]);n.gold-=CARDS[id].cost;n.owned[id]++;n.shop[index].sold=true;reconcileFormation(s,n);
  n.message=star(n.owned[id])>previous&&previous>0?`${CARDS[id].name}升至${star(n.owned[id])}星！`:`获得${CARDS[id].name}（${n.owned[id]}/9张，3张二星、9张三星）。`;return syncHandOrder(n,s);
}
export function reroll(s){if(s.phase!=='shop'||s.gold<1)return s;const n=clone(s);n.gold--;n.shop=drawShop(n);n.gearShop=drawGearShop(n);n.message='已花费 1 金刷新。商店会混合出现异兽、武器和技能。';return n;}
function upgradeShop(n,paid=false,refresh=true){const need=shopXpNeed(n.level);if(n.level>=maxShopLevel||n.xp+n.gold<need)return false;const deficit=Math.max(0,need-n.xp);n.xp=Math.max(0,n.xp-need);n.gold-=deficit;n.level++;if(refresh){n.shop=drawShop(n);n.gearShop=drawGearShop(n);}n.message+=` 商店升至 ${n.level} 星${paid&&deficit?`，金币补足 ${deficit} 经验`:''}。`;return true;}
function autoUpgradeShop(n){let changed=false;while(n.level<maxShopLevel&&n.xp>=shopXpNeed(n.level)){upgradeShop(n,false,false);changed=true;}return changed;}
export function train(s){if(s.phase!=='shop'||s.level>=maxShopLevel||s.xp+s.gold<shopXpNeed(s.level))return s;const n=clone(s);n.message='';upgradeShop(n,true,true);n.message=n.message.trim()||`商店升至 ${n.level} 星。`;return syncHandOrder(n,s);}
export function equip(s,id){
  if(s.phase!=='shop'||!Object.hasOwn(CARDS,id)||!s.owned[id]||s.equipped[CARDS[id].kind]===id)return s;
  const kind=CARDS[id].kind,n=clone(s),units=roster(n),unit=units.find(u=>u.cardId===id);
  n.formation=n.formation||legacyFormation(n);
  const slot=n.formation.findIndex(key=>units.find(u=>u.id===key)?.cardId===n.equipped[kind]);
  n.equipped[kind]=id;
  const target=slot>=0?slot:n.formation.findIndex(x=>x===null);
  if(target>=0){const prior=n.formation.indexOf(unit.id);if(prior>=0)n.formation[prior]=null;n.formation[target]=unit.id;}
  n.message=`${CARDS[id].name}已选用。`;return n;
}
export function setLane(s,kind,lane){
  if(s.phase!=='shop'||!kinds.includes(kind)||!int(lane,0,2)||s.lanes[kind]===lane)return s;
  const n=clone(s);n.lanes[kind]=lane;n.formation=n.formation||legacyFormation(s);
  const unit=roster(n).find(u=>u.cardId===n.equipped[kind]&&n.formation.includes(u.id));
  if(!unit)return n;
  return placeUnit(n,unit.id,lane*2+(kind==='bird'?0:1));
}
export function setTactic(s,kind,value){if(s.phase!=='shop'||!tacticOptions[kind]?.includes(value)||s.tactics?.[kind]===value)return s;const n=clone(s);n.tactics={...defaultTactics,...n.tactics,[kind]:value};n.message='战术已更新，出战后自动执行。';return n;}
export function begin(s){if(s.phase!=='shop'||!(s.formation||legacyFormation(s)).some(Boolean))return s;const n=clone(s);n.formation=n.formation||legacyFormation(s);n.phase='battle';n.message=`第 ${n.round} 场：异兽按战前指令自动交战。`;return n;}
function nextShop(n){const before=clone(n);n.round++;n.phase='shop';n.rewards=[];autoUpgradeShop(n);const born=hatchReady(n);n.shop=drawShop(n);n.gearShop=drawGearShop(n);if(born.length)n.message+=` 孵化：${born.map(b=>b.name).join('、')}。`;syncHandOrder(n,before);}
export function settle(s,won){
  if(s.phase!=='battle'||typeof won!=='boolean')return s;
  const n=clone(s),interest=Math.min(2,Math.floor(n.gold/5)),income=(won?5:4)+n.round*2+interest;
  n.gold+=income;n.xp=Math.min(40,n.xp+3);if(won)n.wins++;else n.lives--;
  n.message=`${won?'获胜':'失利'}，获得 ${income} 金（含利息 ${interest} 金），商店经验 +3。`;
  if(n.lives===0||(n.round===maxRound&&!won)){n.phase='lost';n.message+=' 本次征途结束。';}
  else if(n.round===maxRound){n.phase='won';n.message+=' 通过十场试炼！';}
  else if(won){n.phase='reward';n.rewards=rewardOptions(n);}
  else nextShop(n);
  return n;
}
export function chooseRelic(s,id){if(s.phase!=='reward'||!s.rewards.includes(id)||s.relics.includes(id))return s;const n=clone(s);n.relics.push(id);n.message=`获得${RELICS[id].name}。准备下一场。`;nextShop(n);return n;}
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const exactKeys=(x,keys)=>record(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
export function restore(raw){
  try{
    const s=typeof raw==='string'?JSON.parse(raw):clone(raw);
    if(!record(s)||s.version!==1||!int(s.seed,0,4294967295)||!['shop','battle','reward','won','lost'].includes(s.phase)||!int(s.round,1,maxRound)||!int(s.gold,0,250)||!int(s.level,1,maxShopLevel)||!int(s.xp,0,40)||!int(s.lives,0,3)||!int(s.wins,0,maxRound)||typeof s.message!=='string'||s.message.length>500)return null;
    if(s.mutants===undefined)s.mutants=[];if(s.pendingEggs===undefined)s.pendingEggs=[];if(s.handOrder===undefined)s.handOrder=[];
    if(!Array.isArray(s.pendingEggs)||s.pendingEggs.length>12||s.pendingEggs.some(e=>!exactKeys(e,['tier','readyRound'])||!int(e.tier,2,maxShopLevel)||!int(e.readyRound,2,maxRound)))return null;if(!Array.isArray(s.handOrder)||s.handOrder.length>300||s.handOrder.some(k=>typeof k!=='string'||k.length>80))return null;
    if(!Array.isArray(s.mutants)||s.mutants.length>12||s.mutants.some(m=>!record(m)||typeof m.id!=='string'||!/^mut_[a-z0-9_]+$/.test(m.id)||typeof m.name!=='string'||m.name.length<1||m.name.length>8||!kinds.includes(m.kind)||!Object.hasOwn(RACES,m.race)||!['water','fire','spirit'].includes(m.element)||!Object.hasOwn(MUTATIONS,m.mutation)||(m.passive!==undefined&&!Object.hasOwn(PASSIVES,m.passive))||(m.sourceUrl!==undefined&&(typeof m.sourceUrl!=='string'||m.sourceUrl.length>500||!/^https?:\/\//.test(m.sourceUrl)))||(m.forge!==undefined&&(!record(m.forge)||typeof m.forge.name!=='string'||m.forge.name.length<1||m.forge.name.length>8||typeof m.forge.text!=='string'||m.forge.text.length<1||m.forge.text.length>80||!record(m.forge.effects)||Object.entries(m.forge.effects).some(([k,v])=>!['health','power','haste','taunt'].includes(k)||typeof v!=='number'||!Number.isFinite(v)||v<0||v>120)))||!['common','rare'].includes(m.rarity)||!int(m.cost,3,5)||typeof m.text!=='string'||!int(m.hue,0,300)))return null;
    const mutantIds=new Set(s.mutants.map(m=>m.id));if(mutantIds.size!==s.mutants.length)return null;
    if(!record(s.owned)||Object.keys(s.owned).some(id=>!Object.hasOwn(CARDS,id)&&!mutantIds.has(id))||ids.slice(0,6).some(id=>!Object.hasOwn(s.owned,id)))return null;
    for(const id of ids)if(!Object.hasOwn(s.owned,id))s.owned[id]=0;for(const id of mutantIds)if(!Object.hasOwn(s.owned,id))s.owned[id]=0;
    if([...ids,...mutantIds].some(id=>!int(s.owned[id],0,9)))return null;
    if(!exactKeys(s.equipped,kinds)||kinds.some(k=>s.equipped[k]!==null&&(!cardOf(s,s.equipped[k])||cardOf(s,s.equipped[k]).kind!==k||!s.owned[s.equipped[k]])))return null;
    if(!exactKeys(s.lanes,kinds)||kinds.some(k=>!int(s.lanes[k],0,2)))return null;
    if(!Array.isArray(s.shop)||!int(s.shop.length,3,5))return null;
    s.shop=s.shop.map(o=>exactKeys(o,['id','sold'])?{type:'beast',...o}:o);
    if(s.shop.some(o=>!(o.type==='egg'?exactKeys(o,['type','tier','sold'])&&int(o.tier,2,maxShopLevel):exactKeys(o,['type','id','sold']))||!['beast','gear','egg'].includes(o.type)||typeof o.sold!=='boolean'||(o.type==='beast'?!Object.hasOwn(CARDS,o.id):o.type==='gear'?!Object.hasOwn(GEAR,o.id):false)))return null;
    for(const key of ['rewards','relics'])if(!Array.isArray(s[key])||new Set(s[key]).size!==s[key].length||s[key].some(id=>!Object.hasOwn(RELICS,id)))return null;
    const completed=s.phase==='shop'||s.phase==='battle'?s.round-1:s.round;
    if(s.wins>completed||s.lives!==3-(completed-s.wins)||s.relics.length!==(s.phase==='reward'||s.phase==='won'?s.wins-1:s.wins))return null;
    if(s.phase==='reward'?(s.round>=maxRound||s.wins<1||s.rewards.length!==3||s.rewards.some(id=>s.relics.includes(id))):s.rewards.length!==0)return null;
    if(s.phase==='won'&&(s.round!==maxRound||s.lives<1))return null;
    if(s.phase==='lost'&&s.lives!==0&&s.round!==maxRound)return null;
    if(!['lost'].includes(s.phase)&&s.lives===0)return null;
    if(s.tactics!==undefined&&(!exactKeys(s.tactics,kinds)||kinds.some(k=>!tacticOptions[k].includes(s.tactics[k]))))return null;
    const formation=s.formation===undefined?legacyFormation(s):s.formation;
    const available=new Set(roster(s).map(u=>u.id));
    if(!Array.isArray(formation)||formation.length!==6||formation.some(id=>id!==null&&(typeof id!=='string'||!available.has(id))))return null;
    if(s.gearBag===undefined&&s.loadouts===undefined&&s.gearShop===undefined){
      s.gearBag=[];s.loadouts={};const temp={seed:s.seed};s.gearShop=drawGearShop(temp);
    }
    if(!Array.isArray(s.gearBag)||s.gearBag.length>200||s.gearBag.some(id=>!Object.hasOwn(GEAR,id)))return null;
    if(!record(s.loadouts)||Object.entries(s.loadouts).some(([id,loadout])=>!available.has(id)||!record(loadout)||Object.keys(loadout).length===0||Object.entries(loadout).some(([type,gearId])=>!['weapon','skill'].includes(type)||!Object.hasOwn(GEAR,gearId)||GEAR[gearId].type!==type)))return null;
    if(s.gearShop===undefined)s.gearShop=drawGearShop({seed:s.seed});
    if(!Array.isArray(s.gearShop)||s.gearShop.length!==2||s.gearShop.some((o,i)=>!exactKeys(o,['id','sold'])||!Object.hasOwn(GEAR,o.id)||GEAR[o.id].type!==['weapon','skill'][i]||typeof o.sold!=='boolean'))return null;
    const occupied=formation.filter(id=>id!==null);
    if(new Set(occupied).size!==occupied.length||(s.phase==='battle'&&occupied.length===0))return null;
    {const result={...clone(s),formation:[...formation],tactics:{...defaultTactics,...s.tactics}};return syncHandOrder(result,result);}
  }catch{return null;}
}
