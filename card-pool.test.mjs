import test from 'node:test';
import assert from 'node:assert/strict';
import {CARDS,GEAR,RACES,createRun,roster,buy,buyGear,equipGear,unequipGear,sellGear,sellEgg,removeUnit,sellUnit,restore,begin,reroll,train,settle,placeUnit} from './progression.mjs';
const withBag=()=>({...createRun(1),gearBag:['fang_blade','iron_shell','leech']});
const withWolfPair=s=>({...s,shop:s.shop.map((o,i)=>i===1?{type:'beast',id:'wolf',sold:false}:o)});
test('expanded pool contains many beasts, three races and seven typed gear cards',()=>{
 assert.equal(Object.keys(CARDS).length,24);assert.equal(Object.keys(GEAR).length,7);
 for(const card of Object.values(CARDS)){assert.ok(RACES[card.race]);assert.ok(['turtle','wolf','bird'].includes(card.kind));}
 assert.equal(Object.values(CARDS).filter(c=>c.passive).length,18);
 assert.equal(Object.values(GEAR).filter(g=>g.type==='weapon').length,3);
});
test('gear purchase charges once and shop refreshes deterministically',()=>{
 const s=createRun(1),n=buyGear(s,2);assert.equal(n.gold,5);assert.deepEqual(n.gearBag,['fang_blade']);assert.equal(buyGear(n,2),n);
 assert.equal(buyGear({...s,gold:2},2).gearBag.length,0);assert.equal(s.shop.length,3);assert.ok(s.shop.some(o=>o.type==='gear'));assert.ok(s.shop.some(o=>o.type==='beast'));
 for(const next of [reroll(s),train(s),settle(begin(s),false)]){assert.equal(next.gearShop.length,2);assert.ok(next.gearShop.every(o=>!o.sold));assert.ok(restore(next));}
 assert.deepEqual(reroll(restore(s)),reroll(s));
});
test('weapon and skill occupy independent slots, replacing returns old gear',()=>{
 let s=equipGear(withBag(),0,'wolf:1:0');s=equipGear(s,1,'wolf:1:0');
 assert.deepEqual(s.loadouts['wolf:1:0'],{weapon:'fang_blade',skill:'leech'});
 s=equipGear(s,0,'wolf:1:0');assert.deepEqual(s.gearBag,['fang_blade']);assert.equal(s.loadouts['wolf:1:0'].weapon,'iron_shell');
 s=unequipGear(s,'wolf:1:0','skill');assert.deepEqual(s.gearBag,['fang_blade','leech']);s=equipGear(s,1,'bird:1:0');assert.equal(s.loadouts['bird:1:0'].skill,'leech');s=unequipGear(s,'bird:1:0','skill');s=sellGear(s,1);assert.equal(s.gold,9);assert.deepEqual(s.gearBag,['fang_blade']);assert.ok(restore(s));
});
test('merge returns equipment from consumed beasts without deleting surviving equipment',()=>{
 let s=buy(withWolfPair(withBag()),0);s=equipGear(s,0,'wolf:1:0');s=equipGear(s,0,'wolf:1:1');s=equipGear(s,0,'bird:1:0');
 s=buy(s,1);assert.deepEqual(new Set(s.gearBag),new Set(['fang_blade','iron_shell']));
 assert.deepEqual(s.loadouts,{'bird:1:0':{skill:'leech'}});assert.ok(restore(s));
});
test('selling ordinal zero returns its gear and remaps surviving copy gear and slot',()=>{
 let s=buy(withWolfPair(withBag()),0);s=equipGear(s,0,'wolf:1:0');s=equipGear(s,0,'wolf:1:1');s=removeUnit(s,1);s.formation[1]='wolf:1:1';
 s=sellUnit(s,'wolf:1:0');assert.equal(s.formation[1],'wolf:1:0');assert.deepEqual(s.loadouts,{'wolf:1:0':{weapon:'iron_shell'}});assert.deepEqual(s.gearBag,['leech','fang_blade']);assert.ok(restore(s));
});
test('all gear mutations freeze in battle and bad targets cannot consume gear',()=>{
 const s=withBag();assert.equal(equipGear(s,-1,'wolf:1:0'),s);assert.equal(equipGear(s,0,'missing'),s);
 const b=begin(equipGear(s,0,'wolf:1:0'));assert.equal(buyGear(b,0),b);assert.equal(equipGear(b,0,'bird:1:0'),b);assert.equal(unequipGear(b,'wolf:1:0','weapon'),b);
});
test('legacy migration preserves seed and economy and adds new cards and empty gear',()=>{
 const s=createRun(12),old=structuredClone(s);delete old.gearShop;delete old.gearBag;delete old.loadouts;
 for(const id of Object.keys(CARDS).slice(6))delete old.owned[id];
 const n=restore(old);assert.ok(n);assert.equal(n.seed,s.seed);assert.equal(n.gold,s.gold);assert.deepEqual(n.gearBag,[]);assert.equal(Object.keys(n.owned).length,Object.keys(CARDS).length);
 let sold=createRun(3);for(let i=0;i<6;i++)sold=removeUnit(sold,i);for(const u of roster(sold))sold=sellUnit(sold,u.id);assert.ok(restore(sold));assert.equal(roster(sold).length,0);
});

test('eggs and every hand item can be sold while hand order stays stable',()=>{
 let s=createRun(1);s=buy(s,1);assert.equal(s.pendingEggs.length,1);const afterEgg=sellEgg(s,0);assert.equal(afterEgg.gold,s.gold+2);assert.deepEqual(afterEgg.pendingEggs,[]);assert.ok(restore(afterEgg));
 s=createRun(1);s=removeUnit(s,1);s=buyGear(s,2);s=buy(s,1);const first=s.handOrder.slice();assert.deepEqual(first,[`unit:wolf:1:0`,'gear:fang_blade:0','egg:2:2:0']);
 s=buyGear({...s,shop:s.shop.map((o,i)=>i===2?{...o,sold:false}:o),gold:s.gold+3},2);assert.deepEqual(s.handOrder.slice(0,3),first);
 s=sellGear(s,0);assert(s.handOrder.includes('gear:fang_blade:0'));assert.equal(s.handOrder[0],'unit:wolf:1:0');
 s=placeUnit(s,'wolf:1:0',0);s=removeUnit(s,0);assert.equal(s.handOrder.at(-1),'unit:wolf:1:0');assert.ok(restore(s));
});
test('restore rejects malformed gear ownership and types without mutating source',()=>{
 const s=createRun(1);
 for(const patch of [{gearBag:['missing']},{gearBag:[-1]},{loadouts:{'wolf:1:0':{weapon:'leech'}}},{loadouts:{'wolf:1:1':{weapon:'fang_blade'}}},{loadouts:{'wolf:1:0':{extra:'fang_blade'}}},{gearShop:[{id:'leech',sold:false},s.gearShop[1]]},{owned:{...s.owned,stone_turtle:-1}}])assert.equal(restore({...s,...patch}),null);
 const copy=structuredClone(s);assert.deepEqual(restore(s),copy);assert.deepEqual(s,copy);
});
