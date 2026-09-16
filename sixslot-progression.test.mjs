import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,roster,placeUnit,removeUnit,buy,begin,restore} from './progression.mjs';
const withWolfPair=s=>({...s,shop:s.shop.map((o,i)=>i===1?{type:'beast',id:'wolf',sold:false}:o)});

test('copies are distinct beasts until three merge, including two two-star copies',()=>{
 const s=createRun(1);
 for(const [count,stars] of [[2,[1,1]],[3,[2]],[4,[2,1]],[6,[2,2]],[8,[2,2,1,1]],[9,[3]]]){
  const units=roster({...s,owned:{...s.owned,wolf:count}}).filter(u=>u.cardId==='wolf');
  assert.deepEqual(units.map(u=>u.stars),stars);assert.equal(new Set(units.map(u=>u.id)).size,stars.length);
 }
});
test('deployed beasts can enter any slot and swap without duplication',()=>{
 const s=createRun(1),moved=placeUnit(s,'wolf:1:0',4),swapped=placeUnit(moved,'wolf:1:0',2);
 assert.equal(moved.formation[1],null);assert.equal(moved.formation[4],'wolf:1:0');
 assert.equal(swapped.formation[2],'wolf:1:0');assert.equal(swapped.formation[4],'bird:1:0');
 assert.equal(s.formation[1],'wolf:1:0');assert.equal(placeUnit(s,'wolf:1:0',6),s);
});
test('bench placement replaces an occupant and supports six beasts at level one',()=>{
 let s=createRun(1);s.owned={...s.owned,wolf:2,bird:2,turtle:2};
 s=placeUnit(s,'wolf:1:1',3);
 assert.equal(s.formation.includes('turtle:1:0'),false);
 for(const unit of roster(s))if(!s.formation.includes(unit.id))s=placeUnit(s,unit.id,s.formation.indexOf(null));
 assert.equal(s.formation.filter(Boolean).length,6);assert.equal(s.level,1);assert.ok(restore(s));
});
test('automatic merging inherits consumed deployed slot and preserves empty slots',()=>{
 let s=buy(withWolfPair(createRun(1)),0);s=placeUnit(s,'wolf:1:0',5);s=placeUnit(s,'wolf:1:1',0);
 const n=buy(s,1);assert.equal(n.formation[0],'wolf:2:0');assert.equal(n.formation[5],null);
 assert.equal(n.formation.filter(x=>x?.startsWith('wolf:')).length,1);assert.ok(restore(n));
 let bench=withWolfPair(createRun(1));bench=removeUnit(bench,1);bench=buy(buy(bench,0),1);
 assert.equal(bench.formation.some(x=>x?.startsWith('wolf:')),false);
});
test('a second two-star merge preserves the existing two-star unit and its position',()=>{
 let s=createRun(1);s.owned.wolf=5;s.gold=10;
 s.formation=['wolf:1:0','wolf:2:0','bird:1:0','turtle:1:0',null,'wolf:1:1'];
 const n=buy(s,0);assert.deepEqual(n.formation,['wolf:2:1','wolf:2:0','bird:1:0','turtle:1:0',null,null]);
});
test('empty formation cannot start and battle freezes deployment',()=>{
 let s=createRun(1);for(let i=0;i<6;i++)s=removeUnit(s,i);
 assert.equal(begin(s),s);assert.ok(restore(s));s=placeUnit(s,'bird:1:0',5);const fighting=begin(s);
 assert.equal(fighting.phase,'battle');assert.equal(placeUnit(fighting,'wolf:1:0',0),fighting);assert.equal(removeUnit(fighting,5),fighting);
});
test('legacy saves retain economy and migrate all selected creatures even with lane collisions',()=>{
 const s=createRun(42);delete s.formation;s.gold=23;s.level=2;s.xp=4;s.lanes={turtle:0,wolf:0,bird:0};
 const loaded=restore(s);assert.ok(loaded);assert.equal(loaded.gold,23);assert.equal(loaded.seed,s.seed);assert.equal(loaded.level,2);assert.equal(loaded.xp,4);
 assert.deepEqual(new Set(loaded.formation.filter(Boolean)),new Set(['turtle:1:0','wolf:1:0','bird:1:0']));
});
test('restore rejects malformed formation without silently resetting the run',()=>{
 const s=createRun(1);
 for(const formation of [null,[],Array(7).fill(null),['wolf:1:0','wolf:1:0',null,null,null,null],['wolf:1:1',null,null,null,null,null],[0,null,null,null,null,null]])assert.equal(restore({...s,formation}),null);
 assert.deepEqual(restore(JSON.stringify(s)),s);
});
