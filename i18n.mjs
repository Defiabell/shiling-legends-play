const LANG_KEY='shiling.lang.v1';
export const languages=Object.freeze({zh:'中文',en:'EN'});
const phrasePairs=[
 ['我','Ally'],['敌','Enemy'],['秒','s'],['待出战','Ready'],['档案','Profile'],['玩家档案','Player Profile'],['昵称','Name'],['保存档案','Save Profile'],['总局数','Runs'],['通关','Clears'],['最佳','Best'],['最近战绩','Recent Runs'],['融合收藏','Fusion Collection'],['完成一局后会保存到这里。','Finish a run to save it here.'],['融合伙伴后会记录结果和词条。','Fused companions and affixes will be saved here.'],['当前是本地档案，之后可以接登录同步到云端。','This is a local profile. It can later sync after login.'],['旅人','Traveler'],['败退','Defeat'],['胜','wins'],['食灵','Spirit Feast'],['列传','Bestiary'],['食灵列传','Spirit Feast: Bestiary'],['新旅程','New Run'],['备战 / 出战 →','Prepare / Battle →'],['自动交战','Auto Battle'],['本机自动保存','Auto saved locally'],['战术自动执行中','Tactics running automatically'],['招募、布阵，然后出战','Recruit, arrange, then battle'],['战场已暂停','Paused'],['继续','Resume'],['暂停','Pause'],['速度','Speed'],['旅程结束','Run Finished'],['山海之主','Bestiary Master'],['下一次，换一种阵容','Try a new lineup'],['开启新旅程','Start New Run'],['胜利','Victory'],['失利','Defeat'],['胜利 · 招募资金已到账','Victory · Funds received'],['带走一件遗物','Choose one relic'],
 ['招募区','Recruit'],['布阵区','Formation'],['手牌区','Hand'],['自动战术','Auto Tactics'],['同族两种异兽激活羁绊','Two different beasts of one clan activate a bond'],['后排','Back'],['前排 →','Front →'],['空位','Empty'],['刷新','Refresh'],['升级','Level Up'],['自动升级','Auto Level'],['满星','Max Lv.'],['融合','Fuse'],['伙伴融合','Companion Fusion'],['选择 2 或 3 个伙伴。','Choose 2 or 3 companions.'],['选 2-3 个伙伴，会按组合抽结果和词条。','Pick 2-3 companions to roll an outcome and affixes.'],['第一只素材继承站位和装备，其它素材装备退回手牌区。','The first material keeps position and gear; other gear returns to hand.'],['选材和顺序会影响结果；第一素材继承站位和装备。','Materials and order affect the result; the first material keeps position and gear.'],['抽中：','Rolled: '],['出战 →','Battle →'],['同局可凑三张升星','Collect 3 copies in one run to star up'],
 ['山海胚胎','Bestiary Egg'],['孵化异兽','Hatch Beast'],['延迟收益 · 下场孵化','Delayed value · Hatches next battle'],['下场备战孵化，随机职业 / 血脉 / 外观。','Hatches next prep with random role, bloodline, and look.'],['末战不再孵化','No hatching in final battle'],['已购入','Bought'],['购买','Buy'],['点按购买 · 可拖到手牌','Click to buy · Drag to hand'],['已购买','Bought'],['已招募','Recruited'],['已满星','Max copies'],['已有','Owned'],['需要','Need'],['金币不足，需要 3 金。','Not enough gold. Need 3.'],
 ['生命','HP'],['普攻','Basic'],['攻击','Attack'],['攻','ATK'],['技能','Skill'],['冷却','CD'],['移动','Move'],['不攻击','No attack'],['不普攻','No basic attack'],['数值：','Stats: '],['主动：','Active: '],['成长：','Growth: '],['装备：无','Gear: None'],['无装备','No gear'],['武器','Weapon'],['团队','Team'],['词条','Affix'],['星级：','Stars: '],['出售：','Sell: '],['金','Gold'],['星','★'],
 ['玄龟','Xuan Turtle'],['霜焰龟','Frostflame Turtle'],['毕方','Bifang'],['青鸾','Qingluan'],['狰兽','Zheng Beast'],['霜狰','Frost Zheng'],['岩甲龟','Stoneback Turtle'],['苔灵龟','Moss Spirit Turtle'],['雷羽','Thunderwing'],['金乌','Sun Crow'],['血狰','Blood Zheng'],['月狐','Moon Fox'],['社君','Shrine Spirit'],['白鹤','White Crane'],['哀狰','Mourning Zheng'],['魇母','Nightmare Broodmother'],['招魂鸦','Soulcaller Crow'],['莲甲兽','Lotus Shell'],['息壤兽','Breathing Earth Beast'],['棘甲鼋','Thornback Turtle'],['吼山龟','Roaring Mountain Turtle'],['雷泽鸮','Thunder Marsh Owl'],['鼓狰','War Drum Zheng'],['狐魇','Foxmare'],
 ['莲羽鼋','Lotuswing Turtle'],['云壳鸦','Cloudshell Crow'],['霜羽壁','Frostfeather Wall'],['吼甲狰','Roarplate Zheng'],['棘牙鼋','Thornfang Turtle'],['血壳魇','Bloodshell Mare'],['雷牙鸮','Thunderfang Owl'],['影羽狰','Shadowfeather Zheng'],['咒火狐','Hexfire Fox'],['混沌灵','Chaos Spirit'],['万相魇','Myriad Mare'],['山海君','Bestiary Lord'],['山甲王','Mountain Shell King'],['镇海鼋','Sea Ward Turtle'],['九霄羽','Nine-Sky Feather'],['雷泽羽','Thunder Marsh Feather'],['赤牙王','Red Fang King'],['鼓血狰','Drumblood Zheng'],
 ['巨躯','Colossus'],['狂血','Frenzy'],['急咒','Quick Hex'],['铁壁','Iron Wall'],['共鸣','Resonance'],['生息','Vital Bloom'],['破阵','Breaker'],['龙骨','Dragonbone'],
 ['獠牙刃','Fang Blade'],['玄铁甲','Dark Iron Shell'],['聚灵杖','Spirit Staff'],['噬血术','Bloodsiphon'],['回春术','Renewal'],['霜盾术','Frost Ward'],['嘲讽鼓','Taunt Drum'],
 ['野兽','Beast'],['羽族','Feather'],['灵族','Spirit'],['水泽','Water'],['烈焰','Fire'],['灵契','Spirit'],['普通','Common'],['稀有','Rare'],['近战守卫','Melee Guardian'],['远程群伤','Ranged AoE'],['近战刺客','Melee Assassin'],['前排守卫','Frontline Guard'],['后排术士','Backline Caster'],['侧翼刺客','Flank Assassin'],['近战','Melee'],['远程','Ranged'],['慢速','Slow'],['蓄力','Channel'],['高速','Fast'],
 ['护盾','Shield'],['治疗','Heal'],['召唤','Summon'],['遗言','Deathrattle'],['击杀','Kill'],['嘲讽','Taunt'],['鼓舞','Rally'],['弹射','Chain'],['狙击','Snipe'],['虚弱','Weaken'],['反刺','Thorns'],['群疗','Team Heal'],['成长加血','Growth HP'],['自身成长','Self Growth'],['团队成长','Team Growth'],['团队攻击','Team ATK'],['退场','Down'],['打断','Interrupt'],['开战护盾','Opening Shield'],['水幕','Water Veil'],['寒霜','Frost'],['冻结','Freeze'],['烈焰爆发','Flame Burst'],['喷火蓄力','Flame Cast'],['狙击蓄力','Snipe Cast'],['冲撞','Charge'],['收获','Harvest'],['幼魇','Young Mare'],['遗言幼魇','Deathrattle Mare'],['击杀幼魇','Kill Mare'],['招魂幼魇','Soulcalled Mare'],
 ['凶兽獠牙','Feral Fang'],['长生玉','Longevity Jade'],['聚灵石','Focus Stone'],['赤焰羽','Ember Feather'],['沧海珠','Sea Pearl'],['噬灵铃','Soul Bell'],['魇巢骨','Brood Bone'],['莲心盏','Lotus Cup'],['棘甲符','Thorn Talisman'],['雷泽印','Storm Seal'],['战鼓皮','War Drumhide'],['息壤核','Living Soil Core']
];
const phraseMap=new Map(phrasePairs);
const regexes=[
 [/第 (\d+) \/ (\d+) 战/g,'Battle $1 / $2'],[/第 (\d+) 战/g,'Battle $1'],[/第 (\d+) 场/g,'Battle $1'],[/(\d+) 金/g,'$1 Gold'],[/商店 (\d+)[星★]/g,'Shop Lv.$1'],[/商店(\d+)[星★]/g,'Shop Lv.$1'],[/经验 (\d+)(?:\/(\d+))?/g,(_,a,b)=>b?`XP ${a}/${b}`:`XP ${a}`],[/我方 (\d+) \/ 6/g,'Allies $1 / 6'],[/敌方 (\d+) 兽 · 最高 (\d+) 星/g,'Enemies $1 · Max $2★'],[/生命 \+(\d+)/g,'HP +$1'],[/伤害 \+(\d+)%/g,'Damage +$1%'],[/冷却 -(\d+)%/g,'CD -$1%'],[/生命 (\d+)/g,'HP $1'],[/攻 (\d+)/g,'ATK $1'],[/技能 ([0-9.]+)s/g,'Skill $1s'],[/冷却 ([0-9.]+)s/g,'CD $1s'],[/出售：(\d+)金/g,'Sell: $1 Gold'],[/购买 · 第 (\d+) 战孵化/g,'Buy · Hatch Battle $1'],[/补(\d+)金/g,'Pay $1 Gold'],[/KillSummon/g,'Kill Summon']
];
export function getInitialLanguage(){try{const saved=localStorage.getItem(LANG_KEY);if(saved==='zh'||saved==='en')return saved;}catch{}return /^zh/i.test(navigator.language||'')?'zh':'en';}
export function saveLanguage(lang){try{localStorage.setItem(LANG_KEY,lang);}catch{}}
export function toggleLanguage(lang){return lang==='zh'?'en':'zh';}
export function tx(value,lang='zh'){
 if(lang!=='en')return String(value??'');
 let out=String(value??'');
 for(const [zh,en] of [...phrasePairs].sort((a,b)=>b[0].length-a[0].length))out=out.split(zh).join(en);
 for(const [pattern,replacement] of regexes)out=out.replace(pattern,replacement);
 return out;
}
export function localizeDOM(root,lang='zh'){
 if(!root||lang!=='en')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes)n.nodeValue=tx(n.nodeValue,lang);
 for(const el of root.querySelectorAll('[data-tip],[aria-label],title,placeholder,alt')){
  for(const attr of ['data-tip','aria-label','title','placeholder','alt'])if(el.hasAttribute(attr))el.setAttribute(attr,tx(el.getAttribute(attr),lang));
 }
}
export function applyMetadata(lang='zh'){
 const english=lang==='en';document.documentElement.lang=english?'en':'zh-CN';document.title=english?'Spirit Feast: Bestiary':'食灵 · 列传';
 let desc=document.querySelector('meta[name="description"]');if(!desc){desc=document.createElement('meta');desc.name='description';document.head.append(desc);}desc.content=english?'Recruit, fuse, and battle mythical creatures in a 10-round roguelike auto battler.':'招募、布阵、融合山海异兽，挑战十场轻量肉鸽自走棋。';
}
