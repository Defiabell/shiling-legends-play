import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,buy,roster,restore,cardOf,begin,settle} from './progression.mjs';
import {createBattle,start,skill} from './expedition-engine.mjs';

const mutantRun=(mutation,kind='bird')=>{
 const s=createRun(91),id=`mut_${mutation}`;
 return {...s,owned:{...s.owned,[id]:1},mutants:[{id,name:'雾魈',kind,race:'feather',element:'fire',mutation,rarity:'common',cost:3,text:'测试血脉',hue:40}],formation:[`${id}:1:0`,null,null,null,null,null],loadouts:{}};
};
const ally=s=>s.units.find(u=>u.team==='ally');

test('starter egg waits one battle before hatching a unique generated beast',()=>{
 const s=createRun(11),n=buy(s,1);
 assert.equal(s.shop[1].type,'egg');assert.equal(n.gold,4);assert.equal(n.mutants.length,0);assert.deepEqual(n.pendingEggs,[{tier:2,readyRound:2}]);
 assert.deepEqual(restore(n),n);
 const next=settle(begin(n),false);
 assert.equal(next.round,2);assert.equal(next.pendingEggs.length,0);assert.equal(next.mutants.length,1);
 const beast=next.mutants[0];assert.equal(next.owned[beast.id],1);assert.equal(cardOf(next,beast.id).name,beast.name);
 assert.ok(roster(next).some(u=>u.cardId===beast.id));assert.deepEqual(restore(next),next);
});

test('generated beast mutations affect combat stats',()=>{
 const scale=createBattle(mutantRun('scale'));assert.equal(ally(scale).max,145);
 const moon=createBattle(mutantRun('moon'));start(moon);assert.equal(ally(moon).shield,1.5);
 const horn=createBattle(mutantRun('horn'));start(horn);horn.selectedTarget='e-1';skill(horn,ally(horn).id);assert(Math.abs(horn.stats.units[ally(horn).id].damage-30.68)<1e-8);
});
