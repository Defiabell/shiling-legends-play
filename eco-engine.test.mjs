import test from 'node:test';
import assert from 'node:assert/strict';
import { create, place, remove, advance, neighbors, forecast } from './eco-engine.mjs';
const bare = () => { const s = create(); s.board.forEach(c => Object.assign(c, {terrain:'meadow',beast:null,health:0,food:0,ash:0})); return s; };
const beast = (s, i, id) => Object.assign(s.board[i], {beast:id,health:3});
test('adjacency does not wrap across rows', () => { assert.deepEqual(neighbors(4), [9,3]); assert.deepEqual(neighbors(5), [0,10,6]); });
test('placement immutable; invalid commands do nothing; purchased cards refund', () => {
 const s=create(), original=structuredClone(s), p=place(s,'fox',8); assert.deepEqual(s,original); assert.equal(p.energy,3); assert.equal(place(p,'deer',8),p); assert.equal(remove(p,8).energy,6); assert.equal(remove(s,6).energy,6); assert.equal(place(s,'fox',99),s);
});
test('river protects adjoining forest but not distant forest', () => {
 const s=bare(); beast(s,6,'bird'); s.board[5].terrain='forest'; s.board[7].terrain='forest'; s.board[8].terrain='water';
 const n=advance(s); assert.equal(n.board[5].ash,1); assert.equal(n.board[7].terrain,'forest'); assert.equal(n.herbHarvest,0);
});
test('ashes grow only next day and are harvested once', () => {
 const s=bare(); beast(s,6,'bird'); s.board[5].terrain='forest'; const n=advance(s); assert.equal(n.herbHarvest,0); assert.equal(n.board[5].food,0);
 const next=advance(n); assert.equal(next.herbHarvest,1); assert.equal(next.board[5].ash,0); assert.equal(next.board[5].food,5); assert.equal(advance(next).herbHarvest,1);
});
test('turtle prevents fire and predation but does not feed predator', () => {
 const s=bare(); beast(s,6,'rabbit'); beast(s,5,'wolf'); beast(s,7,'turtle'); beast(s,1,'bird'); s.board[6].terrain='forest';
 const n=advance(s); assert.equal(n.board[6].terrain,'forest'); assert.equal(n.board[6].health,3); assert.equal(n.board[5].health,2);
});
test('unprotected herd is attacked and predator earns food', () => {
 const s=bare(); beast(s,6,'deer'); beast(s,5,'wolf'); const n=advance(s); assert.equal(n.board[6].health,2); assert.equal(n.board[5].health,3); assert.equal(n.score,3);
});
test('starving animal leaves after three days; player can recover', () => {
 const s=bare(); beast(s,0,'wolf'); let n=advance(advance(advance(s))); assert.equal(n.board[0].beast,null); assert.equal(n.phase,'play'); n=place(n,'rabbit',1); assert.equal(n.board[1].beast,'rabbit');
});
test('fox requires two distinct other species', () => {
 const s=bare(); beast(s,6,'fox'); beast(s,5,'rabbit'); beast(s,7,'rabbit'); assert.equal(advance(s).score,0); beast(s,7,'deer'); assert.equal(advance(s).score,4);
});
test('balance strategy completes in eight days with water guardian', () => {
 let s=place(place(create(),'turtle',3),'fox',8); for(let i=0;i<8;i++) s=advance(s); assert.equal(s.phase,'won'); assert.equal(s.score,48);
});
test('garden strategy harvests eight ash patches by restoring its burn zone', () => {
 let s=place(create('garden'),'bird',5);
 for(let day=1;day<=8;day++) { if([3,5,7].includes(day)) { s=place(s,'forest',0); s=place(s,'forest',5); } s=advance(s); }
 assert.equal(s.herbHarvest,8); assert.equal(s.phase,'won');
});
test('clan strategy sustains six animals and produces young', () => {
 let s=create('clan'); for(const i of [3,8,10]) s=place(s,'rabbit',i); s=advance(s); s=place(s,'rabbit',14); for(let day=2;day<=8;day++)s=advance(s);
 assert.equal(s.phase,'won'); assert.equal(s.board.filter(c=>c.beast).length,6); assert.ok(s.births>=8);
});
test('failure and success freeze the board; forecasts bounded', () => {
 let s=bare(); for(let i=0;i<8;i++)s=advance(s); assert.equal(s.phase,'lost'); assert.equal(advance(s),s); assert.equal(place(s,'rabbit',0),s); assert.equal(remove(s,0),s); assert.ok(forecast(create()).length<=4);
});
