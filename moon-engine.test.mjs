import test from "node:test";
import assert from "node:assert/strict";
import { CARD_POOL, chooseNode, chooseReward, createRun, endTurn, playCard, setFormation, setTarget, startBattle } from "./moon-engine.mjs";

function chooseBattle(run) {
  const index = run.map.findIndex((node) => node.type === "battle") >= 0
    ? run.map.findIndex((node) => node.type === "battle")
    : run.map.findIndex((node) => node.type === "elite" || node.type === "boss");
  chooseNode(run, index);
}

test("starts a readable battle with hand, energy and enemy intent", () => {
  const run = createRun(11);
  chooseBattle(run);
  assert.equal(run.battle.state, "player");
  assert.equal(run.battle.energy, 3);
  assert.equal(run.battle.hand.length, 5);
  assert.ok(run.battle.intent.label);
});

test("playing cards spends energy and changes combat state", () => {
  const run = createRun(15);
  chooseBattle(run);
  const attackIndex = run.battle.hand.findIndex((card) => CARD_POOL[card.id].tags.includes("attack"));
  const hp = run.battle.enemy.hp;
  const energy = run.battle.energy;
  const result = playCard(run, attackIndex);
  assert.equal(result.ok, true);
  assert.ok(run.battle.enemy.hp < hp || run.battle.enemy.burn > 0);
  assert.ok(run.battle.energy < energy);
});

test("enemy intent resolves after ending turn", () => {
  const run = createRun(21);
  chooseBattle(run);
  const hp = run.player.hp;
  endTurn(run);
  assert.ok(run.player.hp <= hp);
  assert.equal(run.battle.turn, 2);
});

test("winning grants a deckbuilding reward and advances route", () => {
  const run = createRun(31);
  startBattle(run, "battle");
  for (const enemy of run.battle.enemies) enemy.hp = 1;
  const attackIndex = run.battle.hand.findIndex((card) => CARD_POOL[card.id].tags.includes("attack"));
  playCard(run, attackIndex);
  assert.equal(run.battle, null);
  assert.equal(run.reward.type, "cards");
  const before = run.deck.length;
  chooseReward(run, 0);
  assert.equal(run.deck.length, before + 1);
  assert.equal(run.step, 1);
});

test("elite battles have selectable targets and lane cards hit the chosen lane", () => {
  const run = createRun(41);
  run.deck.unshift("sweep");
  startBattle(run, "elite");
  assert.equal(run.battle.enemies.length, 3);
  setTarget(run, 1);
  assert.equal(run.battle.enemy, run.battle.enemies[1]);
  const hp = run.battle.enemies.map((enemy) => enemy.hp);
  const sweepIndex = run.battle.hand.findIndex((card) => card.id === "sweep");
  playCard(run, sweepIndex, 1);
  assert.ok(run.battle.enemies[1].hp < hp[1]);
  assert.equal(run.battle.enemies[0].hp, hp[0]);
});

test("story choice unlocks achievement and changes deck", () => {
  const run = createRun(55);
  const storyIndex = run.map.findIndex((node) => node.type === "story");
  if (storyIndex < 0) {
    run.map[0] = { type: "story", title: "旧誓", hint: "剧情抉择", scene: "石碑发亮。" };
  }
  chooseNode(run, Math.max(0, storyIndex));
  assert.equal(run.reward.title, "旧誓");
  chooseReward(run, 0);
  assert.ok(run.deck.includes("bell"));
  assert.ok(run.achievements.includes("story_oath"));
});

test("frontline allies absorb their lane while empty lanes hit the player", () => {
  const guarded = createRun(61);
  guarded.formation = [null, null, "turtle-0", "wolf-0", null, null];
  startBattle(guarded, "battle");
  const guardedHp = guarded.player.hp;
  const defenderHp = guarded.battle.allies.find((ally) => ally.slot === 3).hp;
  endTurn(guarded);
  assert.equal(guarded.player.hp, guardedHp);
  assert.ok(guarded.battle.allies.find((ally) => ally.slot === 3).hp < defenderHp);

  const open = createRun(61);
  open.formation = ["turtle-0", "wolf-0", null, null, null, null];
  startBattle(open, "battle");
  const openHp = open.player.hp;
  endTurn(open);
  assert.ok(open.player.hp < openHp);
});

test("cards place lane fire and lane cards use enemy lanes", () => {
  const run = createRun(71);
  run.deck = ["spark", "sweep", "guard", "claw", "claw", "guard"];
  startBattle(run, "elite");
  setTarget(run, 1);
  const targetLane = run.battle.enemy.pos;
  const sweepIndex = run.battle.hand.findIndex((card) => card.id === "sweep");
  const sameLane = run.battle.enemies.filter((enemy) => enemy.pos === targetLane).map((enemy) => enemy.hp);
  playCard(run, sweepIndex);
  assert.ok(run.battle.enemies.filter((enemy) => enemy.pos === targetLane).every((enemy, index) => enemy.hp < sameLane[index]));
  const sparkIndex = run.battle.hand.findIndex((card) => card.id === "spark");
  playCard(run, sparkIndex);
  assert.equal(run.battle.lanes[run.battle.enemy.pos]?.kind, "fire");
  assert.ok(run.achievements.includes("layout_first"));
});

test("companions can be recruited, placed in six slots, and upgraded", () => {
  const run = createRun(81);
  run.map[0] = { type: "recruit", title: "招募", hint: "招募伙伴", scene: "驿火旁有人在等同行。" };
  chooseNode(run, 0);
  assert.equal(run.reward.title, "招募");
  chooseReward(run, 0);
  assert.ok(run.companions.length >= 3);
  assert.ok(run.achievements.includes("first_recruit"));
  const newest = run.companions.at(-1);
  assert.equal(setFormation(run, newest.uid, 5).ok, true);
  assert.equal(run.formation[5], newest.uid);
  startBattle(run, "battle");
  assert.equal(setFormation(run, newest.uid, 4).ok, false);
  run.battle = null;

  run.map[0] = { type: "train", title: "修行", hint: "升级伙伴", scene: "山石上留着旧招式的刻痕。" };
  chooseNode(run, 0);
  const uid = run.reward.options[0].v;
  const before = run.companions.find((item) => item.uid === uid).level;
  chooseReward(run, 0);
  assert.equal(run.companions.find((item) => item.uid === uid).level, before + 1);
});

test("deployed companions trigger lane skills at the start of battle", () => {
  const run = createRun(91);
  run.companions.push({ uid: "bird-test", id: "bird", level: 2 });
  run.formation = ["bird-test", "wolf-0", "turtle-0", null, null, null];
  startBattle(run, "elite");
  assert.ok(run.battle.block > 0);
  assert.ok(run.battle.enemies.some((enemy) => enemy.burn > 0 || enemy.hp < enemy.maxHp));
});
