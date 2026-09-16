import test from 'node:test';
import assert from 'node:assert/strict';
import {createBattle,start,skill,tick,tickAuto,restoreBattle} from './expedition-engine.mjs';
import {campaign} from './economy-combat-check.mjs';
import {maxRound} from './progression.mjs';
const make=(card='bird',loadout={})=>{const id=card+':1:0';return createBattle({owned:{[card]:1},formation:[id,null,null,null,null,null],loadouts:{[id]:loadout}});};
const a=s=>s.units.find(u=>u.team==='ally');
const fire=s=>{start(s);s.selectedTarget='e-1';skill(s,a(s).id);return s.stats.units[a(s).id].damage;};
test('weapon damage, health and haste change actual battle values',()=>{assert.equal(fire(make('bird',{weapon:'fang_blade'})),29.120000000000005);assert.equal(a(make('bird',{weapon:'iron_shell'})).max,185);const s=make('bird',{weapon:'spirit_staff'});fire(s);assert.equal(s.skills[a(s).id],10.08);});
test('leech heals actual damage, regen is time based, ward opens with shield',()=>{const s=make('bird',{skill:'leech'});a(s).hp=30;assert.equal(fire(s),27.560000000000002);assert.equal(a(s).hp,33.3072);const regen=make('bird',{skill:'mend'});a(regen).hp=30;start(regen);tick(regen,.1);assert.equal(a(regen).hp,30.2);assert.equal(a(regen).max,135);const ward=make('bird',{skill:'frost'});start(ward);assert.equal(a(ward).shield,2);assert.equal(a(ward).max,145);});
test('six new beasts have their declared passive effects',()=>{const power=make('sun_bird');assert(Math.abs(fire(power)-29.9)<1e-8);const fast=make('thunder_bird');fire(fast);assert.equal(fast.skills[a(fast).id],10.2);const regen=make('moss_turtle');a(regen).hp=30;start(regen);tick(regen,.1);assert.equal(a(regen).hp,30.2);const ward=make('moon_wolf');start(ward);assert.equal(a(ward).shield,2);const leech=make('blood_wolf');a(leech).hp=30;fire(leech);assert.equal(a(leech).hp,35.1);const armor=make('stone_turtle');start(armor);a(armor).shield=0;const enemy=armor.units.find(u=>u.id==='e-0');enemy.x=a(armor).x+30;enemy.y=a(armor).y;enemy.cooldown=0;tick(armor,.01);assert(Math.abs(a(armor).hp-(220-7.2))<1e-8);});
test('race bonuses require two different cards; two slots and passive persist through restore',()=>{const run={owned:{bird:2},formation:['bird:1:0','bird:1:1',null,null,null,null]};assert.deepEqual(createBattle(run).raceSynergies,[]);const mixed={owned:{bird:1,sun_bird:1},formation:['bird:1:0','sun_bird:1:0',null,null,null,null],loadouts:{'sun_bird:1:0':{weapon:'fang_blade',skill:'leech'}}};const s=createBattle(mixed);assert.deepEqual(s.raceSynergies,['feather']);start(s);s.selectedTarget='e-1';skill(s,'a-sun_bird:1:0');assert.equal(s.skills['a-sun_bird:1:0'],10.8);const restored=restoreBattle(JSON.parse(JSON.stringify(s)),mixed);assert(restored);for(let i=0;i<60;i++){tickAuto(s,1/60);tickAuto(restored,1/60);}assert.deepEqual(restored,s);});
test('enemy active abilities shield, charge and burn with independent cooldowns',()=>{const s=createBattle({round:2});start(s);for(const u of s.units.filter(u=>u.team==='ally')){u.hp=u.max=10000;s.skills[u.kind]=12;}for(const e of s.units.filter(u=>u.team==='enemy')){e.enemySkillCd=0;e.x=220;e.y=280;}tickAuto(s,1/60);assert(s.units.filter(u=>u.team==='enemy').every(u=>s.stats.units[u.id].casts===1));assert(s.units.filter(u=>u.team==='enemy').every(u=>u.enemySkillCd>0));assert(s.units.some(u=>u.team==='enemy'&&u.shield>0));assert(s.units.some(u=>u.team==='ally'&&u.stun>0));});
test('version two saves retain their original enemies without silently adding abilities',()=>{const run={round:4},s=createBattle(run,2);start(s);for(let i=0;i<180;i++)tickAuto(s,1/60);assert(s.units.filter(u=>u.team==='enemy').every(u=>s.stats.units[u.id].casts===0));const restored=restoreBattle(JSON.parse(JSON.stringify(s)),run);assert(restored);for(let i=0;i<60;i++){tickAuto(s,1/60);tickAuto(restored,1/60);}assert.deepEqual(restored,s);});
test('real shop purchases can finish but saving can be punished before the finale',()=>{const winner=campaign(1),loser=campaign(1,'hold');assert.equal(winner.phase,'won');assert(winner.history.every(h=>h.gold>=0&&h.level<=6));assert(loser.history.at(-1).round<=maxRound);assert.equal(loser.phase,'lost');});
test('healing never revives a dead unit, including damage from its lingering flames',()=>{const run={owned:{ember_bird:1,turtle:1},formation:['ember_bird:1:0','turtle:1:0',null,null,null,null],loadouts:{'ember_bird:1:0':{skill:'leech'},'turtle:1:0':{skill:'mend'}}},s=createBattle(run);start(s);s.selectedTarget='e-1';skill(s,'a-ember_bird:1:0');const bird=s.units.find(u=>u.id==='a-ember_bird:1:0');bird.hp=0;bird.dead=true;tick(s,.1);assert.equal(bird.hp,0);assert.equal(bird.dead,true);const regen=make('moss_turtle',{skill:'mend'});start(regen);a(regen).hp=0;a(regen).dead=true;tick(regen,.1);assert.equal(a(regen).hp,0);});
test('leech only heals damage actually lost, not overkill damage',()=>{const s=make('bird',{skill:'leech'});a(s).hp=30;start(s);s.selectedTarget='e-1';s.units.find(u=>u.id==='e-1').hp=1;skill(s,a(s).id);assert.equal(a(s).hp,30.12);});
test('saving all income instead of reinforcing is not a free campaign victory',()=>{const weak=campaign(1,'hold');assert.equal(weak.phase,'lost');assert.equal(weak.history[0].result,'won');assert(weak.history.slice(1).some(h=>h.result==='lost'));});

test('new archetypes have pacifist healing, sniper shots and deathrattle shields',()=>{
 const support=createBattle({owned:{jade_spirit:1,wolf:1},formation:['jade_spirit:1:0','wolf:1:0',null,null,null,null]});start(support);const healer=support.units.find(u=>u.cardId==='jade_spirit'),wolf=support.units.find(u=>u.cardId==='wolf');wolf.hp-=30;tick(support,3.1);assert.equal(healer.cooldown,3);assert.equal(wolf.hp,wolf.max-18);
 const sniper=createBattle({owned:{crane_bird:1},formation:['crane_bird:1:0',null,null,null,null,null]});start(sniper);sniper.selectedTarget='e-1';skill(sniper,'a-crane_bird:1:0');assert.equal(sniper.stats.units['a-crane_bird:1:0'].damage,42);
 const last=createBattle({owned:{mourning_wolf:1,turtle:1},formation:['mourning_wolf:1:0','turtle:1:0',null,null,null,null]});start(last);const dying=last.units.find(u=>u.cardId==='mourning_wolf');dying.hp=1;const enemy=last.units.find(u=>u.team==='enemy');enemy.x=dying.x+30;enemy.y=dying.y;enemy.cooldown=0;tick(last,.01);assert(last.units.find(u=>u.cardId==='turtle').shield>=2);
});


test('imaginative archetypes summon, heal, grow, chain and curse in combat',()=>{
 const summon=createBattle({owned:{ghost_bird:1},formation:['ghost_bird:1:0',null,null,null,null,null]});start(summon);summon.selectedTarget='e-1';assert.equal(skill(summon,'a-ghost_bird:1:0'),true);assert.equal(summon.units.filter(u=>u.summoned&&u.team==='ally').length,1);
 const brood=createBattle({owned:{brood_wolf:1,turtle:1},formation:['brood_wolf:1:0','turtle:1:0',null,null,null,null]});start(brood);const mother=brood.units.find(u=>u.cardId==='brood_wolf'),enemy=brood.units.find(u=>u.team==='enemy');mother.hp=1;enemy.x=mother.x+30;enemy.y=mother.y;enemy.cooldown=0;tick(brood,.01);assert.equal(brood.units.filter(u=>u.summoned&&u.team==='ally').length,1);
 const heal=createBattle({owned:{lotus_turtle:1,wolf:1},formation:['lotus_turtle:1:0','wolf:1:0',null,null,null,null]});start(heal);const hurt=heal.units.find(u=>u.cardId==='wolf');hurt.hp=20;skill(heal,'a-lotus_turtle:1:0');assert.equal(hurt.hp,44);assert(hurt.shield>=1.5);
 const grow=createBattle({owned:{earth_turtle:1,wolf:1},formation:['earth_turtle:1:0','wolf:1:0',null,null,null,null]});start(grow);const ally=grow.units.find(u=>u.cardId==='wolf'),before=ally.max;for(let i=0;i<51;i++)tick(grow,.1);assert.equal(ally.max,before+8);
 const chain=createBattle({owned:{storm_bird:1},formation:['storm_bird:1:0',null,null,null,null,null]});start(chain);chain.selectedTarget='e-1';skill(chain,'a-storm_bird:1:0');assert(chain.units.filter(u=>u.team==='enemy'&&chain.stats.units[u.id].taken>0).length>=2);
 const curse=createBattle({owned:{fox_wolf:1},formation:['fox_wolf:1:0',null,null,null,null,null]});start(curse);const c=curse.units.find(u=>u.team==='enemy');c.x=curse.units[0].x+30;c.y=curse.units[0].y;tick(curse,.9);assert(c.weak>0);
});

test('taunt redirects nearby enemy fire to protect the backline',()=>{
 const s=createBattle({round:2,owned:{bird:1,turtle:1},formation:['bird:1:0','turtle:1:0',null,null,null,null],loadouts:{'turtle:1:0':{skill:'taunt_roar'}}});start(s);
 const turtle=s.units.find(u=>u.cardId==='turtle'),bird=s.units.find(u=>u.cardId==='bird'),wolf=s.units.find(u=>u.team==='enemy'&&u.kind==='wolf');
 for(const e of s.units.filter(u=>u.team==='enemy'&&u.id!==wolf.id)){e.hp=0;e.dead=true;}
 wolf.x=turtle.x+40;wolf.y=turtle.y;wolf.cooldown=0;bird.hp=bird.max;turtle.hp=turtle.max;tick(s,.01);
 assert(turtle.hp<turtle.max);assert.equal(bird.hp,bird.max);
});

test('fusion trigger affixes execute kill, deathrattle, growth and team attack effects',()=>{
 const killerCard={id:'mut_trigger_killer',name:'吞星',kind:'bird',race:'feather',element:'fire',mutation:'horn',passive:'sniper',fusion:{name:'融合',text:'击杀召唤/击杀成长/击杀群疗/击杀加攻/团队攻击',effects:{power:.2,health:40,haste:.1},triggers:['kill_summon','kill_grow_self','kill_heal_team','kill_team_attack','team_attack_aura']},rarity:'rare',cost:5,text:'x',hue:12};
 const run={owned:{mut_trigger_killer:1,turtle:1},mutants:[killerCard],formation:['mut_trigger_killer:1:0','turtle:1:0',null,null,null,null]};
 const s=createBattle(run);const killer=s.units.find(u=>u.cardId==='mut_trigger_killer'),ally=s.units.find(u=>u.cardId==='turtle');
 assert.equal(killer.max,140);start(s);ally.hp-=50;const before={max:killer.max,power:killer.power,allyPower:ally.power,allyHp:ally.hp};
 const victim=s.units.find(u=>u.team==='enemy');for(const e of s.units.filter(u=>u.team==='enemy'&&u.id!==victim.id)){e.hp=0;e.dead=true;}victim.hp=1;s.selectedTarget=victim.id;
 assert.equal(skill(s,killer.id),true);assert(s.units.some(u=>u.summoned&&u.team==='ally'));assert(killer.max>before.max);assert(killer.power>before.power);assert(ally.hp>before.allyHp);assert(ally.power>before.allyPower);assert(s.stats.units[killer.id].kills>=1);assert(s.stats.units[killer.id].summons>=1);
 const deathCard={id:'mut_trigger_death',name:'归尘',kind:'turtle',race:'spirit',element:'water',mutation:'scale',passive:'taunt',fusion:{name:'融合',text:'遗言召唤/遗言群疗/遗言加攻',effects:{health:60,taunt:1},triggers:['death_summon_minion','death_heal_team','death_team_attack']},rarity:'rare',cost:5,text:'x',hue:34};
 const deathRun={round:2,owned:{mut_trigger_death:1,wolf:1},mutants:[deathCard],formation:['mut_trigger_death:1:0','wolf:1:0',null,null,null,null]};
 const d=createBattle(deathRun);start(d);const dying=d.units.find(u=>u.cardId==='mut_trigger_death'),friend=d.units.find(u=>u.cardId==='wolf'),enemy=d.units.find(u=>u.team==='enemy'&&u.kind==='wolf');for(const e of d.units.filter(u=>u.team==='enemy'&&u.id!==enemy.id)){e.hp=0;e.dead=true;}dying.hp=1;friend.hp-=40;const friendHp=friend.hp,friendPower=friend.power;enemy.x=dying.x+30;enemy.y=dying.y;enemy.cooldown=0;tick(d,.01);
 assert.equal(dying.dead,true);assert(d.units.some(u=>u.summoned&&u.team==='ally'));assert(friend.hp>friendHp);assert(friend.power>friendPower);
});

test('fusion growth triggers persist through battle restore',()=>{
 const card={id:'mut_trigger_growth',name:'生息',kind:'turtle',race:'spirit',element:'water',mutation:'scale',passive:'taunt',fusion:{name:'融合',text:'自身成长/团队成长',effects:{health:30},triggers:['growth_self','growth_team_hp']},rarity:'rare',cost:4,text:'x',hue:55};
 const run={owned:{mut_trigger_growth:1,wolf:1},mutants:[card],formation:['mut_trigger_growth:1:0','wolf:1:0',null,null,null,null]};
 const s=createBattle(run);start(s);const grower=s.units.find(u=>u.cardId==='mut_trigger_growth'),wolf=s.units.find(u=>u.cardId==='wolf'),before={gMax:grower.max,gPower:grower.power,wMax:wolf.max};
 for(let i=0;i<51;i++)tick(s,.1);
 assert(grower.max>before.gMax);assert(grower.power>before.gPower);assert(wolf.max>before.wMax);
 const restored=restoreBattle(JSON.parse(JSON.stringify(s)),run);assert(restored);assert.deepEqual(restored,s);
});
