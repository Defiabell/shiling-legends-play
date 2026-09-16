export const CARD_POOL = {
  claw: { name: "爪击", type: "attack", cost: 1, text: "造成 7 点伤害。", tags: ["attack"], act: [{ k: "damage", v: 7 }] },
  guard: { name: "守势", type: "skill", cost: 1, text: "获得 6 点护甲，前排伙伴获得 3 点护盾。", tags: ["defense"], act: [{ k: "block", v: 6 }, { k: "frontlineGuard", v: 3 }] },
  spark: { name: "灵火", type: "attack", cost: 1, text: "造成 4 点伤害，附加 3 层灼烧，点燃目标一路。", tags: ["attack", "fire"], act: [{ k: "damage", v: 4 }, { k: "burn", v: 3 }, { k: "laneFire", v: 3 }] },
  herb: { name: "采药", type: "skill", cost: 1, text: "回复 4 点生命，抽 1 张牌。", tags: ["nature"], act: [{ k: "heal", v: 4 }, { k: "draw", v: 1 }] },
  mooncut: { name: "月刃", type: "attack", cost: 1, text: "造成 5 点伤害。目标有灼烧时再造成 5 点。", tags: ["attack"], act: [{ k: "damage", v: 5 }, { k: "ifBurnDamage", v: 5 }] },
  shell: { name: "玄甲", type: "skill", cost: 2, text: "获得 14 点护甲，下回合 +1 行动力。", tags: ["defense"], act: [{ k: "block", v: 14 }, { k: "nextEnergy", v: 1 }] },
  howl: { name: "狰鸣", type: "skill", cost: 1, text: "目标虚弱 2 层，抽 1 张牌。", tags: ["control"], act: [{ k: "weak", v: 2 }, { k: "draw", v: 1 }] },
  hunt: { name: "追猎", type: "attack", cost: 0, text: "造成 3 点伤害。本回合每打出 1 张攻击牌，伤害 +3。", tags: ["attack"], act: [{ k: "comboDamage", v: 3 }] },
  rain: { name: "雨祭", type: "skill", cost: 1, text: "获得 5 点护甲，清除自身 2 层流血。", tags: ["water"], act: [{ k: "block", v: 5 }, { k: "cleanBleed", v: 2 }] },
  bleed: { name: "血契", type: "attack", cost: 1, text: "造成 6 点伤害，附加 4 层流血。", tags: ["attack"], act: [{ k: "damage", v: 6 }, { k: "bleed", v: 4 }] },
  copy: { name: "化形", type: "skill", cost: 1, text: "复制手牌中最左侧攻击牌到手牌，本回合费用为 0。", tags: ["trick"], act: [{ k: "copyAttack", v: 1 }] },
  feast: { name: "食灵", type: "attack", cost: 2, text: "造成 12 点伤害。若击败敌人，永久 +4 最大生命。", tags: ["attack"], act: [{ k: "damage", v: 12 }, { k: "feast", v: 4 }] },
  mirror: { name: "照影", type: "skill", cost: 0, text: "获得 3 点护甲，下一张攻击牌伤害 +4。", tags: ["trick"], act: [{ k: "block", v: 3 }, { k: "boost", v: 4 }] },
  thunder: { name: "雷纹", type: "attack", cost: 2, text: "造成 8 点伤害 2 次。", tags: ["attack"], act: [{ k: "damage", v: 8 }, { k: "damage", v: 8 }] },
  talisman: { name: "符箓", type: "skill", cost: 1, text: "目标失去 1 层力量，获得 7 点护甲。", tags: ["control"], act: [{ k: "strengthDown", v: 1 }, { k: "block", v: 7 }] },
  star: { name: "星坠", type: "attack", cost: 3, text: "造成 24 点伤害，消耗。", tags: ["attack", "exhaust"], act: [{ k: "damage", v: 24 }] },
  sweep: { name: "横扫", type: "attack", cost: 2, text: "对目标所在一路造成 7 点伤害。", tags: ["attack", "aoe"], act: [{ k: "rowDamage", v: 7 }] },
  bell: { name: "镇魂铃", type: "skill", cost: 2, text: "所有敌人虚弱 1 层，获得 8 点护甲。", tags: ["control", "aoe"], act: [{ k: "allWeak", v: 1 }, { k: "block", v: 8 }] },
  ignite: { name: "燎原", type: "skill", cost: 1, text: "三路铺火，并对所有敌人施加 2 层灼烧。", tags: ["fire", "aoe"], act: [{ k: "rowFire", v: 2 }] },
  mark: { name: "破绽", type: "skill", cost: 0, text: "目标虚弱 1 层，下一张攻击牌伤害 +3。", tags: ["control"], act: [{ k: "weak", v: 1 }, { k: "boost", v: 3 }] }
};

export const ENEMIES = [
  { id: "wolf", name: "山魈斥候", maxHp: 34, art: "wolf", pattern: ["attack", "attack", "block"] },
  { id: "eye", name: "夜眼", maxHp: 40, art: "eye", pattern: ["curse", "attack", "buff"] },
  { id: "armor", name: "甲灵", maxHp: 48, art: "armor", pattern: ["block", "attack", "heavy"] },
  { id: "fire", name: "火祟", maxHp: 52, art: "fire", pattern: ["burn", "attack", "attack"] },
  { id: "boss", name: "卷末食灵", maxHp: 92, art: "boss", pattern: ["buff", "attack", "curse", "heavy"] }
];

export const COMPANIONS = {
  turtle: { name: "玄龟", art: "armor", role: "守", skill: "每回合加护甲，前排额外护盾。", base: 4, growth: 2, hp: 24 },
  bird: { name: "青羽", art: "fire", role: "灼", skill: "灼烧同路敌人，后排更安全。", base: 1, growth: 1, hp: 16 },
  wolf: { name: "狰影", art: "wolf", role: "袭", skill: "攻击同路敌人，前排伤害更高。", base: 4, growth: 3, hp: 20 },
  deer: { name: "白鹿", art: "herb", role: "愈", skill: "每回合治疗最虚弱伙伴。", base: 2, growth: 1, hp: 18 },
  fox: { name: "月狐", art: "fox", role: "控", skill: "虚弱同路敌人，后排影响相邻路。", base: 1, growth: 1, hp: 15 },
  smith: { name: "炉童", art: "shrine", role: "炼", skill: "提高下一张攻击牌伤害。", base: 1, growth: 1, hp: 17 }
};

export const REWARDS = ["mooncut", "shell", "howl", "hunt", "rain", "bleed", "copy", "feast", "mirror", "thunder", "talisman", "star", "sweep", "bell", "ignite", "mark"];

export const ACHIEVEMENTS = [
  { id: "first_blood", name: "初胜", hint: "赢下第一场战斗" },
  { id: "combo_three", name: "连击成形", hint: "一回合打出 3 张攻击牌" },
  { id: "burn_ten", name: "燎原", hint: "单局累计施加 10 层灼烧" },
  { id: "tri_slayer", name: "一挑三", hint: "一次战斗击败 3 个敌人" },
  { id: "story_oath", name: "听见旧誓", hint: "完成一次剧情抉择" },
  { id: "boss_clear", name: "卷末留名", hint: "击败卷末食灵" },
  { id: "flawless", name: "无伤收束", hint: "满血结束一场战斗" },
  { id: "layout_first", name: "阵图初成", hint: "在阵图上布下第一个格子效果" },
  { id: "first_recruit", name: "结伴", hint: "招募一名新伙伴" },
  { id: "full_party", name: "六位同行", hint: "六个阵位都有伙伴" }
];

export function createRun(seed = 7) {
  const run = {
    seed,
    step: 0,
    maxStep: 7,
    player: { hp: 58, maxHp: 58, gold: 0 },
    deck: ["claw", "claw", "claw", "guard", "guard", "spark", "herb"],
    companions: [
      { uid: "turtle-0", id: "turtle", level: 1 },
      { uid: "wolf-0", id: "wolf", level: 1 }
    ],
    formation: ["turtle-0", "wolf-0", null, null, null, null],
    map: [],
    battle: null,
    reward: null,
    over: null,
    stats: { kills: 0, burnApplied: 0, maxAttacksTurn: 0, story: 0 },
    achievements: [],
    log: ["夜路开了。"]
  };
  run.map = makeChoices(run);
  return run;
}

export function hydrateRun(run) {
  run.stats ||= { kills: 0, burnApplied: 0, maxAttacksTurn: 0, story: 0 };
  run.achievements ||= [];
  run.companions ||= [{ uid: "turtle-0", id: "turtle", level: 1 }];
  run.formation ||= [run.companions[0]?.uid || null, null, null, null, null, null];
  run.formation = Array.from({ length: 6 }, (_, index) => run.formation[index] || null);
  run.companions = run.companions.map((companion) => ({
    level: 1,
    hpBonus: 0,
    powerBonus: 0,
    ...companion
  }));
  if (run.battle) normalizeBattle(run.battle);
  return run;
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function rng(run) {
  run.seed = (run.seed * 48271) % 2147483647;
  return run.seed / 2147483647;
}

function shuffle(run, items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng(run) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeChoices(run) {
  if (run.step >= run.maxStep) return [{ type: "boss", title: "卷末", hint: "击败本卷守门食灵", scene: "旧卷的最后一页钉着一枚黑色鳞片。" }];
  const pool = [
    { type: "battle", title: "遭遇", hint: "普通战斗，拿一张牌", scene: "草里有细碎脚步声。" },
    { type: "elite", title: "凶兆", hint: "多名敌人，奖励更好", scene: "三盏冷火同时亮起。" },
    { type: "recruit", title: "招募", hint: "结识新伙伴，加入阵列", scene: "驿火旁有人在等同行。" },
    { type: "train", title: "修行", hint: "升级伙伴属性或技能", scene: "山石上留着旧招式的刻痕。" },
    { type: "story", title: "旧誓", hint: "剧情抉择，换一张关键牌", scene: "石碑上刻着半句看不清的誓言。" },
    { type: "shrine", title: "古祠", hint: "治疗、删牌或拿护甲", scene: "古祠里有人留了一碗热水。" },
    { type: "forge", title: "炼牌", hint: "强化核心牌或拿连击牌", scene: "炉火没有主人，却还在烧。" }
  ];
  const choices = shuffle(run, pool).slice(0, 3);
  if (!choices.some((node) => node.type === "battle" || node.type === "elite")) choices[0] = pool[0];
  if (run.step >= 1 && !choices.some((node) => node.type === "recruit")) choices[2] = pool[2];
  if (run.step >= 2 && !choices.some((node) => node.type === "train")) choices[2] = pool[3];
  if (run.step >= 1 && !choices.some((node) => node.type === "story")) choices[1] = pool[4];
  return choices;
}

export function chooseNode(run, index) {
  hydrateRun(run);
  if (run.battle || run.reward || run.over) return run;
  const node = run.map[index] || run.map[0];
  if (node.type === "shrine") return eventReward(run, "古祠", node.scene, [
    { label: "回复 16 生命", k: "heal", v: 16 },
    { label: "最大生命 +6", k: "maxHp", v: 6 },
    { label: "删去一张守势", k: "remove", v: "guard" }
  ]);
  if (node.type === "forge") return eventReward(run, "炼牌", node.scene, [
    { label: "所有爪击 +2 伤害", k: "upgrade", v: "claw" },
    { label: "获得 1 张横扫", k: "add", v: "sweep" },
    { label: "获得 1 张照影", k: "add", v: "mirror" }
  ]);
  if (node.type === "story") return eventReward(run, "旧誓", node.scene, [
    { label: "把誓言刻进牌组：获得镇魂铃", k: "add", v: "bell", story: true },
    { label: "撕下黑鳞：获得燎原，失去 5 生命", k: "addHurt", v: "ignite", hurt: 5, story: true },
    { label: "只带走线索：最大生命 +4", k: "maxHp", v: 4, story: true }
  ]);
  if (node.type === "recruit") return eventReward(run, "招募", node.scene, recruitOptions(run));
  if (node.type === "train") return eventReward(run, "修行", node.scene, trainOptions(run));
  startBattle(run, node.type);
  run.log.unshift(node.scene);
  return run;
}

function eventReward(run, title, scene, options) {
  run.reward = { type: "event", title, scene, options };
  run.log.unshift(scene);
  return run;
}

function recruitOptions(run) {
  const owned = new Set(run.companions.map((item) => item.id));
  const candidates = Object.keys(COMPANIONS).filter((id) => !owned.has(id));
  const ids = candidates.length ? candidates : Object.keys(COMPANIONS);
  return shuffle(run, ids).slice(0, 3).map((id) => ({
    label: `招募${COMPANIONS[id].name}`,
    k: "recruit",
    v: id
  }));
}

function trainOptions(run) {
  const candidates = shuffle(run, run.companions).slice(0, 2);
  return candidates.flatMap((companion) => [
    {
      label: `${COMPANIONS[companion.id].name}技能 Lv.${companion.level + 1}`,
      k: "upgradeCompanion",
      v: companion.uid
    },
    {
      label: `${COMPANIONS[companion.id].name}体魄 +6`,
      k: "toughenCompanion",
      v: companion.uid
    }
  ]).concat([{ label: "全队整备：伙伴回复 8", k: "teamHeal", v: 8 }]).slice(0, 3);
}

export function startBattle(run, type = "battle") {
  hydrateRun(run);
  const count = type === "boss" ? 2 : type === "elite" ? 3 : run.step >= 3 ? 2 : 1;
  const positions = enemyPositions(count);
  const enemies = [];
  for (let i = 0; i < count; i += 1) {
    const level = Math.min(run.step + i, ENEMIES.length - 2);
    const base = type === "boss" && i === 0 ? ENEMIES[4] : ENEMIES[Math.min(3, level + (type === "elite" ? 1 : 0))];
    const enemy = clone(base);
    enemy.uid = `${run.step}-${i}-${enemy.id}`;
    enemy.maxHp += run.step * (type === "elite" ? 7 : 4) + i * 5;
    if (type === "boss" && i > 0) enemy.maxHp = 38 + run.step * 3;
    enemy.hp = enemy.maxHp;
    enemy.block = 0;
    enemy.burn = 0;
    enemy.bleed = 0;
    enemy.weak = 0;
    enemy.strength = type === "elite" ? 1 : 0;
    enemy.intent = null;
    enemy.pos = positions[i];
    enemies.push(enemy);
  }
  const allies = activeCompanions(run);
  run.battle = {
    type,
    enemies,
    target: 0,
    enemy: enemies[0],
    lanes: Array(3).fill(null),
    tiles: Array(9).fill(null),
    playerPos: 7,
    movesLeft: 1,
    allies,
    turn: 0,
    energy: 3,
    nextEnergy: 0,
    block: 0,
    bleed: 0,
    boost: 0,
    attackPlayed: 0,
    killsThisBattle: 0,
    damageTaken: 0,
    draw: shuffle(run, run.deck.map((id, i) => ({ uid: `${i}-${id}`, id, cost: CARD_POOL[id].cost }))),
    hand: [],
    discard: [],
    exhaust: [],
    intent: null,
    state: "player"
  };
  beginTurn(run);
}

function normalizeBattle(b) {
  if (!b.enemies) {
    b.enemies = [b.enemy].filter(Boolean);
    b.target = 0;
  }
  b.tiles ||= Array(9).fill(null);
  b.lanes ||= Array(3).fill(null);
  b.playerPos ??= 7;
  b.movesLeft ??= 1;
  b.allies ||= [];
  b.allies = b.allies.map((ally) => normalizeAlly(ally));
  const fallback = enemyPositions(b.enemies.length);
  b.enemies.forEach((enemy, index) => {
    enemy.pos ??= fallback[index] ?? index;
  });
  b.killsThisBattle ||= 0;
  b.damageTaken ||= 0;
  syncTarget({ battle: b });
}

export function setFormation(run, uid, slot) {
  hydrateRun(run);
  if (run.battle || !run.companions.some((companion) => companion.uid === uid) || slot < 0 || slot > 5) return { ok: false };
  run.formation = run.formation.map((value) => value === uid ? null : value);
  run.formation[slot] = uid;
  if (run.formation.every(Boolean)) unlock(run, "full_party");
  return { ok: true };
}

function activeCompanions(run) {
  return run.formation
    .map((uid, slot) => {
      const companion = run.companions.find((item) => item.uid === uid);
      return companion ? normalizeAlly({ ...companion, slot }) : null;
    })
    .filter(Boolean);
}

function normalizeAlly(ally) {
  const maxHp = companionMaxHp(ally);
  return {
    level: 1,
    hpBonus: 0,
    powerBonus: 0,
    barrier: 0,
    ...ally,
    maxHp,
    hp: Math.min(ally.hp ?? maxHp, maxHp)
  };
}

function companionMaxHp(companion) {
  const spec = COMPANIONS[companion.id];
  return spec.hp + (companion.level - 1) * 4 + (companion.hpBonus || 0);
}

function companionPower(companion) {
  const spec = COMPANIONS[companion.id];
  return spec.base + (companion.level - 1) * spec.growth + (companion.powerBonus || 0);
}

function enemyPositions(count) {
  if (count === 1) return [1];
  if (count === 2) return [0, 2];
  return [0, 1, 2];
}

function aliveEnemies(run) {
  return run.battle.enemies.filter((enemy) => enemy.hp > 0);
}

function syncTarget(run) {
  const b = run.battle;
  if (!b) return null;
  if (!b.enemies[b.target] || b.enemies[b.target].hp <= 0) {
    b.target = Math.max(0, b.enemies.findIndex((enemy) => enemy.hp > 0));
  }
  b.enemy = b.enemies[b.target] || b.enemies.find((enemy) => enemy.hp > 0) || b.enemies[0];
  return b.enemy;
}

export function setTarget(run, index) {
  hydrateRun(run);
  if (!run.battle || !run.battle.enemies[index] || run.battle.enemies[index].hp <= 0) return run;
  run.battle.target = index;
  syncTarget(run);
  return run;
}

export function movePlayer(run, pos) {
  hydrateRun(run);
  const b = run.battle;
  if (!b || b.movesLeft <= 0 || pos < 0 || pos > 8) return { ok: false, reason: "blocked" };
  if (b.enemies.some((enemy) => enemy.hp > 0 && enemy.pos === pos)) return { ok: false, reason: "occupied" };
  b.playerPos = pos;
  b.movesLeft -= 1;
  run.log.unshift(`灵位移到 ${pos + 1}。`);
  return { ok: true };
}

export function beginTurn(run) {
  hydrateRun(run);
  const b = run.battle;
  b.turn += 1;
  b.energy = 3 + b.nextEnergy;
  b.nextEnergy = 0;
  b.block = 0;
  b.movesLeft = 1;
  b.attackPlayed = 0;
  b.state = "player";
  draw(run, 5 - b.hand.length);
  setIntents(run);
  triggerCompanions(run);
  if (!run.battle) return run;
  run.log.unshift(`第 ${b.turn} 回合。`);
  return run;
}

function triggerCompanions(run) {
  const b = run.battle;
  for (const ally of b.allies || []) {
    if (ally.hp <= 0) continue;
    const power = companionPower(ally);
    const target = laneTarget(run, ally.slot);
    if (ally.id === "turtle") {
      b.block += power;
      if (isFrontSlot(ally.slot)) ally.barrier += 2 + ally.level;
    }
    if (ally.id === "bird" && target) addBurn(run, target, power + (isFrontSlot(ally.slot) ? 0 : 1));
    if (ally.id === "wolf" && target) dealDamage(run, target, power + (isFrontSlot(ally.slot) ? 2 : 0));
    if (ally.id === "deer") healWeakestAlly(b, power);
    if (ally.id === "fox" && target) {
      target.weak += power;
      if (!isFrontSlot(ally.slot)) {
        for (const enemy of aliveEnemies(run).filter((enemy) => Math.abs(enemy.pos - Math.floor(ally.slot / 2)) === 1)) enemy.weak += 1;
      }
    }
    if (ally.id === "smith") b.boost += power;
  }
  checkEnemyDeaths(run);
}

function laneTarget(run, slot) {
  const lane = Math.floor(slot / 2);
  return aliveEnemies(run).find((enemy) => enemy.pos === lane) || syncTarget(run);
}

function isFrontSlot(slot) {
  return slot % 2 === 1;
}

function healWeakestAlly(b, value) {
  const wounded = b.allies
    .filter((ally) => ally.hp > 0 && ally.hp < ally.maxHp)
    .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
  if (wounded) wounded.hp = Math.min(wounded.maxHp, wounded.hp + value);
}

export function draw(run, count) {
  const b = run.battle;
  for (let i = 0; i < count; i += 1) {
    if (!b.draw.length) {
      if (!b.discard.length) return;
      b.draw = shuffle(run, b.discard);
      b.discard = [];
    }
    b.hand.push(b.draw.pop());
  }
}

function intentFor(run, enemy) {
  const name = enemy.pattern[(run.battle.turn - 1) % enemy.pattern.length];
  const map = {
    attack: { k: "attack", label: "攻击", value: 8 + run.step * 2 + enemy.strength * 2 },
    heavy: { k: "attack", label: "重击", value: 14 + run.step * 3 + enemy.strength * 2 },
    block: { k: "block", label: "结壳", value: 10 + run.step * 2 },
    buff: { k: "buff", label: "蓄力", value: 2 },
    curse: { k: "curse", label: "流血", value: 3 },
    burn: { k: "burn", label: "灼痕", value: 4 }
  };
  return map[name];
}

function setIntents(run) {
  for (const enemy of run.battle.enemies) if (enemy.hp > 0) enemy.intent = intentFor(run, enemy);
  run.battle.intent = syncTarget(run)?.intent;
}

export function playCard(run, handIndex, targetIndex = run.battle?.target || 0) {
  hydrateRun(run);
  const b = run.battle;
  if (!b || b.state !== "player") return { ok: false, reason: "not-player" };
  const card = b.hand[handIndex];
  if (!card) return { ok: false, reason: "missing" };
  if (card.cost > b.energy) return { ok: false, reason: "energy" };
  setTarget(run, targetIndex);
  b.hand.splice(handIndex, 1);
  b.energy -= card.cost;
  const def = CARD_POOL[card.id];
  if (def.tags.includes("attack")) {
    b.attackPlayed += 1;
    run.stats.maxAttacksTurn = Math.max(run.stats.maxAttacksTurn, b.attackPlayed);
    if (b.attackPlayed >= 3) unlock(run, "combo_three");
  }
  const beforeKills = run.stats.kills;
  for (const effect of def.act) applyEffect(run, effect);
  if (def.tags.includes("exhaust")) b.exhaust.push(card);
  else b.discard.push(card);
  checkEnemyDeaths(run);
  if (!run.battle) return { ok: true };
  if (run.stats.kills > beforeKills && card.id === "feast") run.player.maxHp += 4;
  return { ok: true };
}

function applyEffect(run, effect) {
  const b = run.battle;
  const e = syncTarget(run);
  if (effect.k === "damage") dealDamage(run, e, effect.v);
  if (effect.k === "comboDamage") dealDamage(run, e, effect.v + Math.max(0, b.attackPlayed - 1) * 3);
  if (effect.k === "ifBurnDamage" && e.burn > 0) dealDamage(run, e, effect.v);
  if (effect.k === "allDamage") for (const enemy of aliveEnemies(run)) dealDamage(run, enemy, effect.v);
  if (effect.k === "rowDamage") for (const enemy of enemiesInLane(run, e.pos)) dealDamage(run, enemy, effect.v);
  if (effect.k === "block") b.block += effect.v;
  if (effect.k === "frontlineGuard") frontlineGuard(b, effect.v);
  if (effect.k === "heal") run.player.hp = Math.min(run.player.maxHp, run.player.hp + effect.v);
  if (effect.k === "draw") draw(run, effect.v);
  if (effect.k === "burn") addBurn(run, e, effect.v);
  if (effect.k === "allBurn") for (const enemy of aliveEnemies(run)) addBurn(run, enemy, effect.v);
  if (effect.k === "laneFire") placeLane(run, e.pos, "fire", effect.v, 2);
  if (effect.k === "rowFire") {
    for (const enemy of aliveEnemies(run)) addBurn(run, enemy, effect.v);
    for (let lane = 0; lane < 3; lane += 1) placeLane(run, lane, "fire", effect.v, 2);
  }
  if (effect.k === "bleed") e.bleed += effect.v;
  if (effect.k === "weak") e.weak += effect.v;
  if (effect.k === "allWeak") for (const enemy of aliveEnemies(run)) enemy.weak += effect.v;
  if (effect.k === "nearWeak") for (const enemy of enemiesInLane(run, e.pos)) enemy.weak += effect.v;
  if (effect.k === "nextEnergy") b.nextEnergy += effect.v;
  if (effect.k === "cleanBleed") b.bleed = Math.max(0, b.bleed - effect.v);
  if (effect.k === "strengthDown") e.strength = Math.max(0, e.strength - effect.v);
  if (effect.k === "boost") b.boost += effect.v;
  if (effect.k === "tileWard") frontlineGuard(b, effect.v);
  if (effect.k === "copyAttack") copyAttack(run);
}

function frontlineGuard(b, value) {
  for (const ally of b.allies.filter((item) => item.hp > 0 && isFrontSlot(item.slot))) {
    ally.barrier += value;
  }
}

function placeLane(run, lane, kind, power, ttl) {
  run.battle.lanes[lane] = { kind, power, ttl };
  unlock(run, "layout_first");
}

function enemiesInLane(run, lane) {
  return aliveEnemies(run).filter((enemy) => enemy.pos === lane);
}

function distance(a, b) {
  return Math.abs(Math.floor(a / 3) - Math.floor(b / 3)) + Math.abs((a % 3) - (b % 3));
}

function addBurn(run, enemy, value) {
  enemy.burn += value;
  run.stats.burnApplied += value;
  if (run.stats.burnApplied >= 10) unlock(run, "burn_ten");
}

function dealDamage(run, enemy, amount) {
  const b = run.battle;
  if (!enemy || enemy.hp <= 0) return;
  let dmg = amount + b.boost;
  b.boost = 0;
  if (enemy.weak > 0) dmg = Math.ceil(dmg * 1.2);
  const blocked = Math.min(enemy.block, dmg);
  enemy.block -= blocked;
  enemy.hp -= Math.max(0, dmg - blocked);
}

function copyAttack(run) {
  const b = run.battle;
  const found = b.hand.find((c) => CARD_POOL[c.id].tags.includes("attack"));
  if (found) b.hand.push({ uid: `${b.turn}-${b.hand.length}-${found.id}-copy`, id: found.id, cost: 0 });
}

function checkEnemyDeaths(run) {
  const b = run.battle;
  if (!b) return;
  for (const enemy of b.enemies) {
    if (enemy.hp <= 0 && !enemy.dead) {
      enemy.dead = true;
      b.killsThisBattle += 1;
      run.stats.kills += 1;
      run.log.unshift(`${enemy.name}倒下。`);
    }
  }
  if (b.killsThisBattle >= 3) unlock(run, "tri_slayer");
  if (!aliveEnemies(run).length) finishBattle(run);
  else setIntents(run);
}

export function endTurn(run) {
  hydrateRun(run);
  const b = run.battle;
  if (!b || b.state !== "player") return run;
  b.discard.push(...b.hand.splice(0));
  enemyAct(run);
  if (!run.battle) return run;
  if (run.player.hp <= 0) {
    run.over = "defeat";
    run.battle = null;
    run.log.unshift("倒在卷中。");
    return run;
  }
  beginTurn(run);
  return run;
}

function enemyAct(run) {
  const b = run.battle;
  resolveLanes(run);
  if (!run.battle) return;
  for (const enemy of aliveEnemies(run)) {
    if (enemy.burn > 0) {
      enemy.hp -= enemy.burn;
      enemy.burn = Math.max(0, enemy.burn - 1);
    }
    if (enemy.bleed > 0) {
      enemy.hp -= Math.ceil(enemy.bleed / 2);
      enemy.bleed = Math.max(0, enemy.bleed - 1);
    }
  }
  checkEnemyDeaths(run);
  if (!run.battle) return;
  for (const enemy of aliveEnemies(run)) {
    const intent = enemy.intent;
    if (intent.k === "attack") {
      let dmg = intent.value;
      if (enemy.weak > 0) dmg = Math.floor(dmg * 0.75);
      const defender = defenderInLane(b, enemy.pos);
      const taken = defender ? damageAlly(defender, dmg) : damagePlayer(run, dmg);
      b.damageTaken += defender ? 0 : taken;
      run.log.unshift(`${enemy.name}${intent.label}${defender ? `命中${COMPANIONS[defender.id].name}` : "穿过空路"}，造成 ${taken}。`);
    }
    if (intent.k === "block") enemy.block += intent.value;
    if (intent.k === "buff") enemy.strength += intent.value;
    if (intent.k === "curse") b.bleed += intent.value;
    if (intent.k === "burn") {
      const defender = defenderInLane(b, enemy.pos);
      const taken = defender ? damageAlly(defender, intent.value) : damagePlayer(run, intent.value);
      if (!defender) b.damageTaken += taken;
    }
    if (enemy.weak > 0) enemy.weak -= 1;
  }
  if (b.bleed > 0) {
    const taken = Math.ceil(b.bleed / 2);
    run.player.hp -= taken;
    b.damageTaken += taken;
    b.bleed = Math.max(0, b.bleed - 1);
  }
  ageLanes(b);
}

function resolveLanes(run) {
  const b = run.battle;
  for (const enemy of aliveEnemies(run)) {
    const lane = b.lanes[enemy.pos];
    if (lane?.kind === "fire") {
      enemy.hp -= lane.power;
      run.log.unshift(`${enemy.name}穿过火路，受到 ${lane.power}。`);
    }
  }
  checkEnemyDeaths(run);
}

function defenderInLane(b, lane) {
  const front = b.allies.find((ally) => ally.hp > 0 && ally.slot === lane * 2 + 1);
  if (front) return front;
  return b.allies.find((ally) => ally.hp > 0 && ally.slot === lane * 2);
}

function damageAlly(ally, damage) {
  const shielded = Math.min(ally.barrier || 0, damage);
  ally.barrier = Math.max(0, (ally.barrier || 0) - shielded);
  const taken = Math.max(0, damage - shielded);
  ally.hp = Math.max(0, ally.hp - taken);
  return taken;
}

function damagePlayer(run, damage) {
  const b = run.battle;
  const blocked = Math.min(b.block, damage);
  b.block -= blocked;
  const taken = Math.max(0, damage - blocked);
  run.player.hp -= taken;
  return taken;
}

function ageLanes(b) {
  for (let i = 0; i < b.lanes.length; i += 1) {
    const lane = b.lanes[i];
    if (!lane) continue;
    lane.ttl -= 1;
    if (lane.ttl <= 0) b.lanes[i] = null;
  }
}

function finishBattle(run) {
  const b = run.battle;
  const wasBoss = b.type === "boss";
  run.player.gold += wasBoss ? 12 : b.type === "elite" ? 8 : 5;
  if (run.step === 0) unlock(run, "first_blood");
  if (b.damageTaken === 0 && run.player.hp === run.player.maxHp) unlock(run, "flawless");
  run.battle = null;
  if (wasBoss) {
    unlock(run, "boss_clear");
    run.over = "victory";
    run.log.unshift("第一卷真正结束了。");
    return;
  }
  run.reward = {
    type: "cards",
    title: "战利品",
    scene: b.killsThisBattle > 1 ? "倒下的不止一个影子，牌堆里也多了一种方向。" : "兽骨落地，月光照出一张新牌。",
    options: rewardCards(run, b.type)
  };
  run.log.unshift("胜利，选一张牌。");
}

function rewardCards(run, type) {
  const cards = shuffle(run, REWARDS).slice(0, 3);
  if (type === "elite" && !cards.includes("sweep")) cards[0] = "sweep";
  return cards.map((id) => ({ id, label: CARD_POOL[id].name, k: "add", v: id }));
}

export function chooseReward(run, index) {
  hydrateRun(run);
  const r = run.reward;
  if (!r) return run;
  const option = r.options[index];
  if (option) {
    if (option.k === "add") run.deck.push(option.v);
    if (option.k === "recruit") {
      const uid = `${option.v}-${run.step}-${run.companions.length}`;
      run.companions.push({ uid, id: option.v, level: 1 });
      const openSlot = run.formation.findIndex((slot) => !slot);
      if (openSlot >= 0) run.formation[openSlot] = uid;
      unlock(run, "first_recruit");
      if (run.formation.every(Boolean)) unlock(run, "full_party");
    }
    if (option.k === "upgradeCompanion") {
      const companion = run.companions.find((item) => item.uid === option.v);
      if (companion) companion.level += 1;
    }
    if (option.k === "toughenCompanion") {
      const companion = run.companions.find((item) => item.uid === option.v);
      if (companion) companion.hpBonus = (companion.hpBonus || 0) + 6;
    }
    if (option.k === "teamHeal") {
      run.player.hp = Math.min(run.player.maxHp, run.player.hp + Math.ceil(option.v / 2));
      for (const companion of run.companions) companion.hpBonus = (companion.hpBonus || 0) + 1;
    }
    if (option.k === "addHurt") {
      run.deck.push(option.v);
      run.player.hp = Math.max(1, run.player.hp - option.hurt);
    }
    if (option.k === "heal") run.player.hp = Math.min(run.player.maxHp, run.player.hp + option.v);
    if (option.k === "maxHp") {
      run.player.maxHp += option.v;
      run.player.hp += option.v;
    }
    if (option.k === "remove") {
      const at = run.deck.indexOf(option.v);
      if (at >= 0) run.deck.splice(at, 1);
    }
    if (option.k === "upgrade") {
      for (let i = 0; i < run.deck.length; i += 1) if (run.deck[i] === "claw") run.deck[i] = "clawPlus";
      CARD_POOL.clawPlus = { ...CARD_POOL.claw, name: "爪击+", text: "造成 9 点伤害。", act: [{ k: "damage", v: 9 }] };
    }
    if (option.story) {
      run.stats.story += 1;
      unlock(run, "story_oath");
    }
  }
  run.reward = null;
  run.step += 1;
  run.map = makeChoices(run);
  return run;
}

export function skipReward(run) {
  hydrateRun(run);
  run.reward = null;
  run.step += 1;
  run.map = makeChoices(run);
  return run;
}

function unlock(run, id) {
  run.achievements ||= [];
  if (!run.achievements.includes(id)) {
    run.achievements.push(id);
    const achievement = ACHIEVEMENTS.find((item) => item.id === id);
    if (achievement) run.log.unshift(`成就：${achievement.name}`);
  }
}
