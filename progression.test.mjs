import test from 'node:test';
import assert from 'node:assert/strict';
import {CARDS,createRun,star,buy,reroll,train,equip,setLane,begin,settle,chooseRelic,restore,rareChance,maxShopLevel,maxRound,nextShopXp,itemTier,combatStats,forgeCreature,forgeQuestScore,recallForge,roster,placeUnit,equipGear,fuseUnits,fusionPreview} from './progression.mjs';
const withWolfPair=s=>({...s,shop:s.shop.map((o,i)=>i===1?{type:'beast',id:'wolf',sold:false}:o)});
const win=s=>{const r=settle(begin(s),true);return r.phase==='reward'?chooseRelic(r,r.rewards[0]):r;};
test('starter shop purchases charge once and three duplicates become two stars',()=>{
 const initial=createRun(1),a=buy(withWolfPair(initial),0),b=buy(a,1);
 assert.equal(initial.gold,8);assert.equal(initial.shop[1].type,'egg');assert.equal(a.gold,6);assert.equal(b.gold,4);assert.equal(star(b.owned.wolf),2);assert.match(b.message,/升至2星/);assert.equal(buy(b,1),b);assert.equal(star(9),3);assert.equal(star(0),0);
});
test('cannot buy without gold, exceed nine copies, or shop in battle',()=>{
 const s=createRun(2);assert.equal(buy({...s,gold:1},0).gold,1);const capped={...s,owned:{...s.owned,wolf:9}};assert.equal(buy(capped,0),capped);const fighting=begin(s);assert.equal(reroll(fighting),fighting);assert.equal(train(fighting),fighting);assert.equal(buy(fighting,0),fighting);
});
test('shop upgrades use rising costs, auto-upgrade with enough xp, and gold can fill gaps',()=>{
 let s={...createRun(3),gold:40,xp:4};s=train(s);assert.equal(s.level,2);assert.equal(s.xp,0);assert.equal(s.gold,40);assert.equal(nextShopXp(s.level),6);
 const paid=train({...s,xp:2,gold:10});assert.equal(paid.level,3);assert.equal(paid.xp,0);assert.equal(paid.gold,6);assert.match(paid.message,/金币补足 4 经验/);
 const auto=settle(begin({...createRun(4),xp:1}),false);assert.equal(auto.phase,'shop');assert.equal(auto.level,2);assert.equal(auto.xp,0);assert.match(auto.message,/商店升至 2 星/);
 s={...createRun(3),gold:80,xp:4};for(let i=0;i<5;i++)s=train(s);assert.equal(s.level,maxShopLevel);assert.equal(nextShopXp(s.level),Infinity);assert.equal(train(s),s);
 assert.deepEqual([1,2,3,4,5,6].map(x=>Math.round(rareChance(x)*100)),[28,52,75,88,95,98]);
 assert.deepEqual(['wolf','jade_spirit','mourning_wolf','lotus_turtle','earth_turtle','ghost_bird'].map(id=>itemTier({type:'beast',id})),[1,2,3,4,5,6]);
 assert.match(combatStats(createRun(3),'jade_spirit').skillEffect,/每 3 秒治疗最低血队友 12/);
 assert.equal(combatStats(createRun(3),'wolf',1,1,{skill:'taunt_roar'}).taunt,true);
});
test('saved seed and shop restore exactly; refresh is deterministic and costs one',()=>{
 const s=reroll(createRun(42)),r=restore(JSON.stringify(s));assert.deepEqual(r,s);assert.deepEqual(reroll(r),reroll(s));assert.equal(s.gold,7);assert.equal(restore({...s,version:99}),null);
});
test('settlement is once only, interest uses pre-reward balance, loss advances',()=>{
 const s=begin(createRun(4)),win=settle(s,true);assert.equal(win.gold,16);assert.equal(win.phase,'reward');assert.equal(settle(win,true),win);const loss=settle(s,false);assert.equal(loss.gold,15);assert.equal(loss.lives,2);assert.equal(loss.round,2);assert.equal(loss.phase,'shop');assert.equal(settle(loss,false),loss);assert.ok(restore(loss));
});
test('relic choices are unique and collected once; ten wins finish the run',()=>{
 let s=createRun(5);for(let i=1;i<maxRound;i++){const r=settle(begin(s),true);assert.equal(r.rewards.length,3);assert.equal(new Set(r.rewards).size,3);assert.ok(restore(r));s=chooseRelic(r,r.rewards[0]);assert.equal(s.relics.length,i);assert.equal(chooseRelic(s,r.rewards[0]),s);assert.ok(restore(s));}s=settle(begin(s),true);assert.equal(s.phase,'won');assert.equal(s.wins,maxRound);assert.equal(s.round,maxRound);assert.ok(restore(s));
});
test('three losses end immediately; final battle loss also ends with lives remaining',()=>{
 let s=createRun(6);for(let i=0;i<3;i++)s=settle(begin(s),false);assert.equal(s.phase,'lost');assert.equal(s.lives,0);assert.ok(restore(s));s=createRun(6);for(let i=0;i<maxRound-1;i++)s=win(s);s=settle(begin(s),false);assert.equal(s.phase,'lost');assert.equal(s.lives,2);assert.ok(restore(s));
});
test('restore rejects invalid economy, equipped cards, unknown cards and impossible progress',()=>{
 const s=createRun(8);for(const patch of [{gold:-1},{gold:Infinity},{xp:41},{lives:0},{wins:2},{relics:['fang']},{owned:{...s.owned,wolf:10}},{equipped:{...s.equipped,wolf:'bird'}},{lanes:{...s.lanes,wolf:4}},{shop:[{id:'unknown',sold:false},...s.shop.slice(1)]}])assert.equal(restore({...s,...patch}),null);assert.equal(restore('{oops'),null);
});
test('three rounds support deliberate upgrades while alternate cards respect body slots',()=>{
 let s=buy(buy(withWolfPair(createRun(7)),0),1);s={...s,xp:4};s=train(s);assert.equal(s.level,2);assert.equal(s.gold,4);s=win(s);s=train(s);s=win(s);s=train(s);assert(s.level>=3);assert.ok(s.gold>=0);const owned={...s,owned:{...s.owned,ember_bird:1}};assert.equal(equip(owned,'ember_bird').equipped.bird,'ember_bird');assert.equal(equip(owned,'shadow_wolf'),owned);assert.equal(setLane(s,'wolf',0).lanes.wolf,0);assert.equal(CARDS.ice_turtle.element,'fire');
});

test('Meshy forge creates a safe custom companion without replacing formation flow',()=>{
 const s=createRun(123),next=forgeCreature(s,{role:'healer',name:'月狸灵',prompt:'round healer with moon fur',url:'https://example.com/model.glb'});
 assert.notEqual(next,s);assert.equal(next.gold,s.gold-3);assert.equal(next.mutants.length,1);assert.equal(next.mutants[0].name,'月狸灵');assert.equal(next.mutants[0].passive,'team_heal');assert.equal(next.mutants[0].sourceUrl,'https://example.com/model.glb');assert.equal(next.mutants[0].forge.name,'月泉');assert.match(next.mutants[0].text,/Meshy铸灵/);assert.equal(next.formation.join('|'),s.formation.join('|'));
 const forgedStats=combatStats(next,next.mutants[0].id);assert.equal(forgedStats.hp,255);assert.equal(forgedStats.skillCd,7.2);assert.match(forgedStats.skillEffect,/铸灵：生命 \+35，群疗更频繁/);
 const unit=roster(next).find(u=>u.cardId===next.mutants[0].id);assert.ok(unit);assert.ok(next.handOrder.includes(`unit:${unit.id}`));assert.ok(restore(next));
 const placed=placeUnit(next,unit.id,0);assert.equal(placed.formation[0],unit.id);assert.ok(restore(placed));
});
test('Meshy forge bounties reward prompt and role matches',()=>{
 const s={...createRun(100),seed:0,round:1,level:1,gold:8};
 const weak=forgeCreature(s,{role:'guardian',name:'石盾',prompt:'plain turtle',url:'https://example.com/a.glb'});
 const strong=forgeCreature(s,{role:'archer',name:'朱羽',prompt:'fire flame wing feather ranged bow',url:'https://example.com/b.glb'});
 assert.equal(forgeQuestScore(s,{role:'archer',prompt:'fire wing ranged'}).score,3);
 assert.equal(weak.gold,5);assert.equal(strong.gold,7);assert.equal(strong.xp,1);
 assert.match(strong.mutants[0].text,/悬赏3\/3/);assert.ok(combatStats(strong,strong.mutants[0].id).hp>combatStats(weak,weak.mutants[0].id).hp||combatStats(strong,strong.mutants[0].id).attack>combatStats(weak,weak.mutants[0].id).attack);
});
test('Meshy forge archive can recall saved models into later runs',()=>{
 const first=forgeCreature(createRun(222),{role:'archer',name:'云弓',url:'https://example.com/cloud.glb'}),saved=first.mutants[0];
 const next=recallForge(createRun(333),saved);assert.equal(next.gold,4);assert.equal(next.mutants.length,1);assert.equal(next.mutants[0].sourceUrl,saved.sourceUrl);assert.equal(next.owned[next.mutants[0].id],1);assert.match(combatStats(next,next.mutants[0].id).skillEffect,/铸灵/);assert.ok(restore(next));
 const again=recallForge(next,saved);assert.equal(again.owned[next.mutants[0].id],2);assert.equal(again.mutants.length,1);
});
test('Meshy forge respects phase, cost, and storage limits',()=>{
 const s=createRun(124);assert.equal(forgeCreature({...s,gold:2},{role:'archer'}).gold,2);const fighting=begin(s);assert.equal(forgeCreature(fighting,{role:'archer'}),fighting);
 const full={...s,mutants:Array.from({length:12},(_,i)=>({id:`mut_full_${i}`,name:'满灵',kind:'wolf',race:'beast',element:'fire',mutation:'horn',passive:'leech',rarity:'rare',cost:3,text:'x',hue:1}))};
 assert.equal(forgeCreature(full,{role:'assassin'}),full);
});

test('fusion consumes two or three companions and creates a playable fused partner',()=>{
 let s=createRun(777);
 s={...s,owned:{...s.owned,wolf:2,bird:1,turtle:1},gearBag:['fang_blade','iron_shell'],formation:['wolf:1:0','bird:1:0','turtle:1:0',null,null,null]};
 s=equipGear(s,0,'wolf:1:0');s=equipGear(s,0,'bird:1:0');
 const preview=fusionPreview(s,['wolf:1:0','bird:1:0','turtle:1:0']);
 assert.ok(preview);assert.ok(preview.affixes.length>=2);assert.match(preview.fusion.text,/生命|伤害|冷却|嘲讽|鼓舞|召唤|狙击|弹射/);
 const next=fuseUnits(s,['wolf:1:0','bird:1:0','turtle:1:0']);
 assert.notEqual(next,s);assert.equal(next.mutants.length,1);const fused=next.mutants[0];
 assert.equal(next.owned[fused.id],1);assert.equal(fused.lineage.generation,1);assert.deepEqual(fused.lineage.parents,['狰兽','毕方','玄龟']);assert.equal(next.owned.wolf,1);assert.equal(next.owned.bird,0);assert.equal(next.owned.turtle,0);
 assert.equal(next.formation[0],`${fused.id}:1:0`);assert.equal(next.formation[1],null);assert.equal(next.loadouts[`${fused.id}:1:0`].weapon,'fang_blade');assert.deepEqual(next.gearBag,['iron_shell']);
 assert.match(combatStats(next,fused.id).skillEffect,/融合：/);assert.equal(fused.fusion.text,preview.fusion.text);assert.ok(restore(next));
});
test('fusion validates phase, material count, duplicate ids, and storage limits',()=>{
 const s=createRun(778),units=roster(s);
 assert.equal(fusionPreview(s,[units[0].id]),null);const fighting=begin(s);assert.equal(fuseUnits(fighting,[units[0].id,units[1].id]),fighting);
 assert.equal(fuseUnits(s,[units[0].id,units[0].id]),s);
 const full={...s,mutants:Array.from({length:12},(_,i)=>({id:`mut_full_${i}`,name:'满灵',kind:'wolf',race:'beast',element:'fire',mutation:'horn',passive:'leech',fusion:{name:'融合',text:'伤害 +1%',effects:{power:.01}},rarity:'rare',cost:4,text:'x',hue:1}))};
 assert.equal(fuseUnits(full,[units[0].id,units[1].id]),full);
});

test('fusion rolls visible variants from seed, order, and material state',()=>{
 const base={...createRun(901),owned:{...createRun(901).owned,wolf:2,bird:1,turtle:1},formation:['wolf:1:0','bird:1:0','turtle:1:0',null,null,null]};
 const a=fusionPreview(base,['wolf:1:0','bird:1:0']);
 const b=fusionPreview({...base,seed:902},['wolf:1:0','bird:1:0']);
 const c=fusionPreview(base,['bird:1:0','wolf:1:0']);
 assert.ok(a&&b&&c);assert.notEqual(`${a.name}|${a.fusion.text}|${a.kind}`,`${b.name}|${b.fusion.text}|${b.kind}`);assert.notEqual(`${a.name}|${a.fusion.text}|${a.kind}`,`${c.name}|${c.fusion.text}|${c.kind}`);
});
