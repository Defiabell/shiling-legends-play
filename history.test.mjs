import test from 'node:test';
import assert from 'node:assert/strict';
import {addFusionHistory,buildFusionHistory,buildRunHistory,dailyBountyFor,makePlayerId,normalizeRecord,recordRunAchievements,titleBonus,updatePlayerName,upsertRunHistory} from './history.mjs';

test('local profile record normalizes player, run history and fusion history',()=>{
 const rec=normalizeRecord({runs:2,wins:1,best:4,history:Array.from({length:25},(_,i)=>({id:`r${i}`})),fusions:Array.from({length:45},(_,i)=>({id:`f${i}`})),player:{name:'<旅人>'}},()=>123,()=>0.5);
 assert.match(rec.player.id,/^guest_/);assert.equal(rec.player.name,'旅人');assert.equal(rec.history.length,20);assert.equal(rec.fusions.length,40);assert.deepEqual(rec.titles,[]);assert.deepEqual(rec.bloodlines,[]);assert.equal(rec.daily.date,'1970-01-01');
 const named=updatePlayerName(rec,'山海玩家');assert.equal(named.player.name,'山海玩家');
 assert.match(makePlayerId(123,()=>0),/^guest_/);
});

test('run and fusion history entries are capped and newest first',()=>{
 let rec=normalizeRecord({},()=>1000,()=>0);
 const run=buildRunHistory({phase:'won',round:10,wins:10,level:6,gold:20,lives:2},{rows:[{fact:'通关'}]},()=>2000);
 rec=upsertRunHistory(rec,run);assert.equal(rec.history[0].result,'won');assert.equal(rec.history[0].report[0],'通关');
 const fusion={id:'fusion_a',name:'混沌灵',materials:['玄龟','毕方'],affix:'击杀召唤'};
 rec=addFusionHistory(rec,fusion);assert.equal(rec.fusions[0].name,'混沌灵');
});


test('fusion history builds bloodline and unlocks fusion titles',()=>{
 let rec=normalizeRecord({},()=>1000,()=>0);
 const before={mutants:[],units:[{id:'wolf:1:0',cardId:'wolf'},{id:'bird:1:0',cardId:'bird'},{id:'turtle:1:0',cardId:'turtle'}]};
 const after={mutants:[{id:'mut_fuse_a',name:'混沌灵',kind:'wolf',fusion:{text:'击杀召唤',triggers:['kill_summon']},lineage:{generation:2,parents:['狰兽','毕方','玄龟']}}]};
 const entry=buildFusionHistory(before,after,['wolf:1:0','bird:1:0','turtle:1:0'],{wolf:'狰兽',bird:'毕方',turtle:'玄龟'},()=>2000);
 rec=addFusionHistory(rec,entry,()=>2000);
 assert.equal(rec.bloodlines[0].name,'混沌灵');assert.equal(rec.bloodlines[0].generation,2);assert.deepEqual(rec.bloodlines[0].parents,['狰兽','毕方','玄龟']);
 assert(rec.titles.some(t=>t.id==='chimera'));assert(rec.titles.some(t=>t.id==='lineage_keeper'));
 rec=addFusionHistory(addFusionHistory(rec,{...entry,id:'fusion_b',cardId:'mut_b'},()=>2001),{...entry,id:'fusion_c',cardId:'mut_c'},()=>2002);
 assert(rec.titles.some(t=>t.id==='fusion_adept'));
});

test('run achievements award titles and complete deterministic daily bounty',()=>{
 const now=()=>new Date(2026,8,16,10).getTime(),bounty=dailyBountyFor(now);
 const run={phase:'lost',wins:5,level:6,owned:{wolf:3},formation:['a','b','c','d','e','f'],mutants:[{fusion:{}}]};
 let rec=normalizeRecord({},now,()=>0);
 rec=recordRunAchievements(rec,run,null,now);
 assert(rec.titles.some(t=>t.id==='far_runner'));assert(rec.titles.some(t=>t.id==='full_shop'));
 assert.equal(rec.daily.id,bounty.id);assert.equal(rec.daily.completed,true);assert(rec.titles.some(t=>t.id==='daily_hunter'));
 assert.equal(titleBonus(rec),3);
 rec=recordRunAchievements(rec,{phase:'won',wins:10,level:3,owned:{},formation:[]},null,now);
 assert(rec.titles.some(t=>t.id==='first_clear'));
});
