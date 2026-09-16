export const organs={eye:{name:'夜瞳',art:'eye',text:'闪避伤害归零；突袭 +2'},armor:{name:'鳞甲',art:'armor',text:'每击减伤 2；反击 +3'},tail:{name:'狐尾',art:'tail',text:'伙伴伤害 +2；安抚恢复 3'},claw:{name:'裂爪',art:'claw',text:'撕咬 +3；闪避耗能 +1'},moon:{name:'疾足',art:'moon',text:'突袭 +2；每回合多 1 灵力'},fire:{name:'火囊',art:'fire',text:'喷火 9 伤害；破坏战利品'}};
const events=[['rabbit','herb','wolf'],['shrine','forest','wolf'],['wolf','fire','herb'],['forest','rabbit','shrine'],['wolf','herb','fire'],['shrine','wolf','forest']];
export const sites={rabbit:{name:'受伤的灵兔',art:'rabbit',tag:'抉择',text:'一份口粮，或一位同行者。'},herb:{name:'月下药圃',art:'herb',tag:'休整',text:'疗伤，或留一点药以备不测。'},wolf:{name:'守路的狰',art:'wolf',tag:'狩猎',text:'战胜它，吞噬新的器官。'},shrine:{name:'无名古祠',art:'shrine',tag:'奇遇',text:'以血换取一次进化。'},forest:{name:'幽暗密林',art:'forest',tag:'探索',text:'暗处藏着蜕落的异兽器官。'},fire:{name:'将熄的篝火',art:'fire',tag:'营地',text:'温暖可以换来一夜安宁。'}};
export function create(seed=Date.now(),legacy=null){return {version:1,seed:seed>>>0,phase:'choose',step:0,hp:30,food:3,herbs:1,organs:legacy?[legacy]:[],bag:[],companion:false,energy:3,turn:0,enemy:null,event:null,loot:[],burned:false,legacy:null,message:'选一枚初生器官，踏入山海。',history:[]};}
function rand(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function paths(s){const list=events[s.step%events.length];const n=s.seed%3;return list.slice(n).concat(list.slice(0,n));}
export function intent(s){if(!s.enemy)return null;const t=s.turn%3;return t===0?{name:'扑咬',damage:s.enemy.boss?7:5}:t===1?{name:'蓄力',damage:0}:{name:'重击',damage:s.enemy.boss?13:9};}
export function moves(s){return [{id:'bite',name:'撕咬',cost:1,text:`造成 ${4+(s.organs.includes('claw')?3:0)} 伤害`},{id:'ambush',name:'突袭',cost:2,text:`造成 ${6+(s.organs.includes('eye')?2:0)+(s.organs.includes('moon')?2:0)} 伤害`},{id:'guard',name:'反击',cost:1,text:`格挡 5，反击 ${s.organs.includes('armor')?5:2}`},{id:'dodge',name:'闪避',cost:s.organs.includes('claw')?2:1,text:s.organs.includes('eye')?'躲开本回合全部伤害':'本回合伤害减半'},...(s.organs.includes('fire')?[{id:'flame',name:'喷火',cost:2,text:'造成 9 伤害；战利品烧毁'}]:[]),...(s.companion?[{id:'soothe',name:'安抚',cost:1,text:`恢复 ${s.organs.includes('tail')?5:2} 生命`}]:[])];}
function reward(s){s.enemy=null;if(s.step>=6){s.phase='won';s.message='你越过了穷奇守望的山口。选择一枚器官，留给下一世。';return;}s.phase='loot';s.loot=s.burned?[]:[...Object.keys(organs)].sort().filter(x=>!s.organs.includes(x)&&!s.bag.includes(x));if(s.loot.length){const offset=Math.floor(rand(s)*s.loot.length);s.loot=s.loot.slice(offset).concat(s.loot.slice(0,offset)).slice(0,2);}s.message=s.burned?'烈火烧毁了器官。仍获得 1 口粮。':'狩猎成功。选择一枚器官。';s.food=Math.min(6,s.food+1);}
function advance(s){s.step++;s.event=null;s.phase='map';s.message=s.step>=6?'山口就在眼前。准备好后，挑战穷奇。':'选择下一处去向。';}
function battle(s,boss=false){s.phase='battle';s.enemy={name:boss?'穷奇':'狰',hp:boss?40:13+s.step*2,max:boss?40:13+s.step*2,boss};s.energy=3+(s.organs.includes('moon')?1:0);s.turn=0;s.block=0;s.evade=0;s.reflect=0;s.burned=false;}
export function act(state,action,value){const s=structuredClone(state);const has=x=>s.organs.includes(x);const heal=n=>s.hp=Math.min(30,s.hp+n);let valid=true;
if(action==='start'&&s.phase==='choose'&&['eye','armor','tail'].includes(value)){if(!has(value))s.organs.push(value);s.phase='map';s.message='点击地点牌。每次前行消耗 1 口粮。';}
else if(action==='visit'&&s.phase==='map'&&s.step<6&&paths(s).includes(value)){if(s.food>0)s.food--;else s.hp-=3;s.event=value;s.phase='event';if(s.hp<=0)s.phase='lost';}
else if(action==='boss'&&s.phase==='map'&&s.step>=6)battle(s,true);
else if(action==='choice'&&s.phase==='event'){
const e=s.event;
if(e==='rabbit'&&value==='eat'){heal(4);s.food=Math.min(6,s.food+2);advance(s);s.message='灵兔化作口粮 · 生命 +4，口粮 +2。';}
else if(e==='rabbit'&&value==='save'&&s.herbs>0){s.herbs--;s.companion=true;advance(s);s.message='灵兔跟上了你 · 每回合会协力攻击。';}
else if(e==='herb'&&value==='heal'){heal(8);advance(s);}
else if(e==='herb'&&value==='take'){s.herbs=Math.min(5,s.herbs+2);advance(s);}
else if(e==='wolf'&&value==='fight')battle(s);
else if(e==='wolf'&&value==='sneak'&&has('eye')){s.food=Math.min(6,s.food+1);advance(s);}
else if(e==='shrine'&&value==='offer'&&s.hp>5){s.hp-=5;s.phase='loot';s.loot=['armor','tail','moon'].filter(x=>!has(x)&&!s.bag.includes(x));}
else if(e==='forest'&&value==='search'){if(!has('eye'))s.hp-=3;s.phase=s.hp>0?'loot':'lost';s.loot=['eye','claw','fire'].filter(x=>!has(x)&&!s.bag.includes(x));}
else if(e==='fire'&&value==='rest'&&s.food>0){s.food--;heal(10);advance(s);}
else if(value==='leave')advance(s);else valid=false;
}
else if(action==='loot'&&s.phase==='loot'&&s.loot.includes(value)){if(s.bag.length>=6||s.bag.includes(value)||has(value))return state;s.bag.push(value);advance(s);s.message='器官已收入行囊。点击器官即可装配。';}
else if(action==='skip'&&s.phase==='loot')advance(s);
else if(action==='equip'&&['map','choose'].includes(s.phase)&&s.bag.includes(value)&&s.organs.length<3){s.bag=s.bag.filter(x=>x!==value);s.organs.push(value);}
else if(action==='unequip'&&s.phase==='map'&&has(value)&&s.bag.length<6){s.organs=s.organs.filter(x=>x!==value);s.bag.push(value);}
else if(action==='herb'&&['map','battle'].includes(s.phase)&&s.herbs>0&&s.hp<30){s.herbs--;heal(6);}
else if(action==='move'&&s.phase==='battle'){
 const m=moves(s).find(x=>x.id===value);if(!m||s.energy<m.cost)return state;s.energy-=m.cost;
 if(value==='bite')s.enemy.hp-=4+(has('claw')?3:0);
 if(value==='ambush')s.enemy.hp-=6+(has('eye')?2:0)+(has('moon')?2:0);
 if(value==='guard'){s.block+=5;s.reflect+=has('armor')?5:2;}
 if(value==='dodge')s.evade=has('eye')?1:.5;
 if(value==='flame'){s.enemy.hp-=9;s.burned=true;}
 if(value==='soothe')heal(has('tail')?5:2);
 s.message=`使用了${m.name}。`;if(s.enemy.hp<=0)reward(s);
}
else if(action==='end'&&s.phase==='battle'){
 const incoming=intent(s).damage;const damage=Math.max(0,Math.floor(incoming*(1-s.evade))-s.block-(has('armor')?2:0));s.hp-=damage;if(incoming>0)s.enemy.hp-=s.reflect;
 if(s.hp<=0){s.hp=0;s.phase='lost';s.message='这段旅途止步于此。换一种进化，再走一次。';}
 else {if(s.companion)s.enemy.hp-=has('tail')?4:2;s.message=`承受 ${damage} 伤害${s.companion?' · 灵兔协力攻击':''}`;if(s.enemy.hp<=0)reward(s);else {s.turn++;s.energy=3+(has('moon')?1:0);s.block=0;s.evade=0;s.reflect=0;}}
}
else if(action==='legacy'&&s.phase==='won'&&has(value)){s.legacy=value;s.message=`${organs[value].name}将传给下一世。`;}
else valid=false;
if(!valid)return state;s.hp=Math.max(0,s.hp);s.history=[...s.history,`${action}:${value??''}`].slice(-60);return s;}
export function restore(raw){try{const s=JSON.parse(raw);const phases=['choose','map','event','battle','loot','won','lost'];if(s.version!==1||!phases.includes(s.phase)||!Number.isInteger(s.step)||s.step<0||s.step>6)return null;for(const k of ['hp','food','herbs','energy','seed','turn'])if(!Number.isFinite(s[k])||s[k]<0)return null;if(s.hp>30||s.food>6||s.herbs>5||s.energy>4)return null;for(const k of ['organs','bag','loot'])if(!Array.isArray(s[k])||s[k].length>(k==='organs'?3:6)||s[k].some(x=>!organs[x])||new Set(s[k]).size!==s[k].length)return null;if(!Array.isArray(s.history)||typeof s.companion!=='boolean')return null;if(s.phase==='event'&&!sites[s.event])return null;if(s.phase==='battle'&&(!s.enemy||!Number.isFinite(s.enemy.hp)||s.enemy.hp<=0||!Number.isFinite(s.enemy.max)||![s.block,s.evade,s.reflect].every(Number.isFinite)))return null;return s;}catch{return null;}}
