import test from 'node:test';import assert from 'node:assert/strict';import {create,target,tick,dash,restore} from './hunt-engine.mjs';
function run(s,n){for(let i=0;i<n*60&&s.phase==='play';i++)tick(s,1/60)}
test('rabbit hunt grants feet; deer hunt grants horn through actual movement',()=>{const s=create();target(s,290,370);run(s,5);assert.ok(s.player.feet);target(s,490,230);run(s,30);assert.ok(s.player.horn);assert.equal(s.stage,2)});
test('tree blocks movement until horn dash',()=>{const s=create();s.player.x=650;target(s,800,325);run(s,2);assert.ok(s.player.x<=675);s.player.horn=true;dash(s);run(s,.3);assert.ok(s.tree.broken);assert.equal(s.stage,3)});
test('boss telegraph locks impact location and can be dodged',()=>{const s=create();s.tree.broken=true;s.player.x=820;s.player.y=325;s.animals[2].cooldown=0;tick(s,.02);assert.ok(s.animals[2].windup>0);target(s,800,100);run(s,1);assert.equal(s.player.hp,100)});
test('standing in impact loses health; invulnerability protects',()=>{const s=create();s.tree.broken=true;s.player.x=810;s.animals[2].cooldown=0;run(s,1.1);assert.equal(s.player.hp,78)});
test('fire damages boss and victory ends simulation',()=>{const s=create();s.tree.broken=true;s.player.x=930;s.player.y=470;Object.assign(s.animals[2],{x:865,y:470,hp:1,windup:1,strike:{x:930,y:470}});run(s,.2);assert.equal(s.phase,'won');const t=s.time;run(s,1);assert.equal(s.time,t)});
test('saved state roundtrip; corrupt save ignored',()=>{const s=create();run(s,2);assert.deepEqual(restore(JSON.stringify(s)),s);assert.equal(restore('{}'),null)});
