import { art } from "./art.mjs";
import { ACHIEVEMENTS, CARD_POOL, COMPANIONS, chooseNode, chooseReward, createRun, endTurn, hydrateRun, playCard, setFormation, setTarget, skipReward } from "./moon-engine.mjs";

const KEY = "shiling.moon.v1";
const META_KEY = "shiling.moon.meta.v1";
let run = load();
let shake = "";
let fx = "";
let pickedCompanion = null;
let autoTimer = null;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.player && saved?.deck) return mergeMeta(hydrateRun(saved));
  } catch {}
  return mergeMeta(createRun(Math.floor(Math.random() * 100000) + 9));
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(run));
  localStorage.setItem(META_KEY, JSON.stringify({ achievements: run.achievements || [] }));
}

function mergeMeta(next) {
  try {
    const meta = JSON.parse(localStorage.getItem(META_KEY));
    if (Array.isArray(meta?.achievements)) next.achievements = [...new Set([...(next.achievements || []), ...meta.achievements])];
  } catch {}
  return next;
}

function reset() {
  const achievements = run.achievements || [];
  localStorage.removeItem(KEY);
  run = createRun(Math.floor(Math.random() * 100000) + 9);
  run.achievements = achievements;
  render();
}

function cardHtml(card) {
  const def = CARD_POOL[card.id];
  const ready = run.battle.energy >= card.cost ? "ready" : "waiting";
  return `<div class="hand-card auto-card ${def.type} ${def.tags.includes("aoe") ? "aoe" : ""} ${ready}">
    <span>${card.cost}</span>
    <b>${def.name}</b>
    <small>${ready === "ready" ? "即将自动释放" : "灵力不足，等待下一轮"}</small>
  </div>`;
}

function deckMini() {
  const counts = {};
  for (const id of run.deck) counts[id] = (counts[id] || 0) + 1;
  return Object.entries(counts)
    .map(([id, count]) => `<span>${CARD_POOL[id]?.name || id} ×${count}</span>`)
    .join("");
}

function companionPanel() {
  const slots = run.formation.map((uid, slot) => {
    const companion = run.companions.find((item) => item.uid === uid);
    return `<button class="ally-slot ${pickedCompanion && !run.battle ? "ready" : ""}" data-ally-slot="${slot}" ${run.battle ? "disabled" : ""}>
      <small>${slot % 2 ? "前" : "后"} · ${["上", "中", "下"][Math.floor(slot / 2)]}</small>
      ${companion ? companionChip(companion, true) : `<b>空位</b>`}
    </button>`;
  }).join("");
  const roster = run.companions.map((companion) => `<button class="ally-chip ${pickedCompanion === companion.uid ? "picked" : ""}" data-pick-ally="${companion.uid}" ${run.battle ? "disabled" : ""}>
    ${companionChip(companion)}
  </button>`).join("");
  return `<div class="ally-panel">
    <div class="ally-title"><b>伙伴阵列</b><span>${run.battle ? "战斗中锁定" : "点伙伴，再点六格上阵"}</span></div>
    <div class="ally-grid">${slots}</div>
    <div class="ally-roster">${roster}</div>
  </div>`;
}

function companionChip(companion, compact = false) {
  const spec = COMPANIONS[companion.id];
  return `<span class="mini-art">${art(spec.art)}</span><b>${spec.name}</b><em>Lv.${companion.level} ${spec.role}</em>${compact ? "" : `<small>${spec.skill}</small>`}`;
}

function mapView() {
  const done = Math.min(run.step, run.maxStep);
  const marks = Array.from({ length: run.maxStep + 1 }, (_, i) => `<i class="${i < done ? "done" : i === done ? "now" : ""}"></i>`).join("");
  return `<section class="map-panel">
    <div class="progress-line">${marks}</div>
    <div class="node-grid">
      ${run.map.map((node, i) => `<button class="node ${node.type}" data-node="${i}">
        <em>${node.scene || ""}</em><b>${node.title}</b><small>${node.hint}</small>
      </button>`).join("")}
    </div>
  </section>`;
}

function battleView() {
  const b = run.battle;
  const pPct = Math.max(0, run.player.hp / run.player.maxHp * 100);
  return `<section class="battle-shell auto-battle ${fx}">
    <div class="effect-layer"><i></i><i></i><i></i></div>
    ${battlefieldHtml(b)}
    <div class="player-strip">
      <div><small>生命</small><b>${run.player.hp}/${run.player.maxHp}</b><i style="width:${pPct}%"></i></div>
      <div><small>护甲</small><b>${b.block}</b></div>
      <div><small>节奏</small><b>自动</b></div>
      <div><small>牌堆</small><b>${b.draw.length}</b></div>
      <div><small>弃牌</small><b>${b.discard.length}</b></div>
    </div>
    <div class="auto-row">
      <div class="auto-status"><b>自由对战中</b><small>伙伴和敌人自动行动，卡组会作为战术技能自动释放。</small></div>
      <div class="auto-queue">${b.hand.slice(0, 5).map(cardHtml).join("")}</div>
    </div>
    <div class="turn-bar auto-turn">
      <button class="ghost" data-reset>重开</button>
      <span>无需手动点技能 / 结束回合</span>
    </div>
  </section>`;
}

function enemyHtml(e, index) {
  const hpPct = Math.max(0, e.hp / e.maxHp * 100);
  const selected = run.battle.target === index ? "selected" : "";
  const dead = e.hp <= 0 ? "dead" : "";
  const intent = e.intent || run.battle.intent;
  return `<div class="enemy-token ${selected} ${dead}" data-target="${index}" role="button" tabindex="0">
    <div class="intent ${intent.k}"><strong>${intent.label}</strong><span>${intent.value}</span></div>
    <div class="enemy-art">${art(e.art)}</div>
    <div class="name-row"><b>${e.name}</b><small>${statusText(e)}</small></div>
    <div class="hp"><i style="width:${hpPct}%"></i><span>${Math.max(0, e.hp)} / ${e.maxHp}</span></div>
  </div>`;
}

function battlefieldHtml(b) {
  return `<div class="scene-wrap ${shake}">
    <div class="board-caption"><b>自由阵营战</b><span>左边我方，右边敌方；开战后自动释放战术技能</span><em>${aliveAllies(b).length}/6 上阵</em></div>
    <div class="pokemon-stage">
      <div class="sky-glow"></div>
      <div class="battle-ground"></div>
      <div class="camp-label camp-ally">我方阵营</div>
      <div class="camp-label camp-enemy">敌方阵营</div>
      <div class="midline">VS</div>
      ${[0, 1, 2].map((lane) => hazardHtml(b, lane)).join("")}
      ${b.enemies.map((enemy, index) => sceneEnemy(enemy, index)).join("")}
      ${b.allies.map(sceneAlly).join("")}
    </div>
  </div>`;
}

function hazardHtml(b, lane) {
  const hazard = b.lanes?.[lane];
  if (!hazard) return "";
  const top = [24, 45, 66][lane];
  return `<div class="lane-hazard ${hazard.kind}" style="top:${top}%"><span>${hazard.kind === "fire" ? "火路" : "护路"} ${hazard.power}</span></div>`;
}

function sceneEnemy(enemy, index) {
  const hpPct = Math.max(0, enemy.hp / enemy.maxHp * 100);
  const intent = enemy.intent || run.battle.intent;
  const lane = Math.max(0, Math.min(2, enemy.pos || 0));
  const selected = run.battle.target === index ? "selected" : "";
  return `<div class="scene-unit enemy-unit lane-${lane} ${selected} ${enemy.hp <= 0 ? "dead" : ""}">
    <span class="unit-intent ${intent.k}"><strong>${intent.label}</strong><em>${intent.value}</em></span>
    <span class="unit-art">${art(enemy.art)}</span>
    <span class="unit-name">${enemy.name}</span>
    <span class="unit-status">${statusText(enemy)}</span>
    <span class="unit-hp"><i style="width:${hpPct}%"></i><b>${Math.max(0, enemy.hp)}/${enemy.maxHp}</b></span>
  </div>`;
}

function sceneAlly(ally) {
  const spec = COMPANIONS[ally.id];
  const hpPct = Math.max(0, ally.hp / ally.maxHp * 100);
  const lane = Math.floor(ally.slot / 2);
  const rank = ally.slot % 2 ? "front" : "back";
  return `<div class="scene-unit ally-unit lane-${lane} ${rank} ${ally.hp <= 0 ? "dead" : ""}">
    ${ally.barrier ? `<span class="ally-shield">盾 ${ally.barrier}</span>` : ""}
    <span class="unit-art">${art(spec.art)}</span>
    <span class="unit-name">${spec.name}</span>
    <span class="unit-status">Lv.${ally.level} · ${rank === "front" ? "前排" : "后排"}</span>
    <span class="unit-hp ally"><i style="width:${hpPct}%"></i><b>${Math.max(0, ally.hp)}/${ally.maxHp}</b></span>
  </div>`;
}

function aliveAllies(b) {
  return b.allies.filter((ally) => ally.hp > 0);
}

function statusText(e) {
  const list = [];
  if (e.block) list.push(`甲 ${e.block}`);
  if (e.burn) list.push(`灼 ${e.burn}`);
  if (e.bleed) list.push(`血 ${e.bleed}`);
  if (e.weak) list.push(`弱 ${e.weak}`);
  if (e.strength) list.push(`力 ${e.strength}`);
  return list.join(" · ") || "无状态";
}

function rewardView() {
  const r = run.reward;
  return `<section class="reward-panel">
    <h2>${r.title}</h2>
    ${r.scene ? `<p class="scene">${r.scene}</p>` : ""}
    <div class="reward-grid">
      ${r.options.map((option, i) => rewardButton(option, i)).join("")}
    </div>
    ${r.type === "cards" ? `<button class="ghost skip" data-skip>跳过，回复 4 点生命</button>` : ""}
  </section>`;
}

function rewardButton(option, i) {
  const def = option.id ? CARD_POOL[option.id] : null;
  const companion = option.k === "recruit" ? COMPANIONS[option.v] : null;
  return `<button class="reward-card" data-reward="${i}">
    <b>${option.label}</b>
    <small>${companion?.skill || def?.text || eventHint(option)}</small>
  </button>`;
}

function eventHint(option) {
  if (option.k === "remove") return "让牌组更薄，核心牌更容易抽到。";
  if (option.k === "upgrade") return "把起始牌变成可持续的输出来源。";
  if (option.k === "maxHp") return "提高容错，适合后面打凶兆。";
  if (option.k === "heal") return "稳住血线，继续走危险路线。";
  if (option.k === "upgradeCompanion") return "提升伙伴每回合触发的技能强度。";
  if (option.k === "toughenCompanion") return "提高伙伴血量，更适合放到前排。";
  if (option.k === "teamHeal") return "让队伍更能扛住后面的凶兆。";
  return "改变这一局的节奏。";
}

function overView() {
  const win = run.over === "victory";
  return `<section class="over-panel">
    <div>${art(win ? "moon" : "shrine")}</div>
    <h2>${win ? "第一卷通关" : "本卷断在半途"}</h2>
    <p>${win ? "这次不是打完就没东西了，卡组和路线已经能支撑继续扩第二卷。" : "换一条路线、删掉弱牌、把灼烧和连击凑起来，会明显更强。"}</p>
    <button class="primary" data-reset>再开一局</button>
  </section>`;
}

function render() {
  const app = document.querySelector("#app");
  const mode = run.battle ? "战斗" : run.reward ? "抉择" : run.over ? "结算" : "路线";
  app.innerHTML = `<main>
    <header>
      <a href="expedition.html">招募录</a>
      <div><strong>食灵 · 月下卷</strong><span>${mode} · 第 ${Math.min(run.step + 1, run.maxStep + 1)} 节</span></div>
      <button title="重新开始" data-reset>↻</button>
    </header>
    ${run.battle ? battleView() : run.reward ? rewardView() : run.over ? overView() : mapView()}
    <aside class="deck-panel">
      <div class="deck-title"><b>牌组 ${run.deck.length}</b><small>金币 ${run.player.gold}</small></div>
      ${companionPanel()}
      <div class="deck-list">${deckMini()}</div>
      <div class="achievements">${achievementHtml()}</div>
      <div class="log">${run.log.slice(0, 3).map((x) => `<p>${x}</p>`).join("")}</div>
    </aside>
  </main>`;
  bind();
  save();
  syncAutoBattle();
  shake = "";
  fx = "";
}

function achievementHtml() {
  return ACHIEVEMENTS.map((item) => {
    const unlocked = run.achievements?.includes(item.id);
    return `<span class="${unlocked ? "on" : ""}" title="${item.hint}">${unlocked ? "◆" : "◇"} ${item.name}</span>`;
  }).join("");
}

function bind() {
  document.querySelectorAll("[data-node]").forEach((el) => el.addEventListener("click", () => {
    chooseNode(run, Number(el.dataset.node));
    render();
  }));
  document.querySelectorAll("[data-pick-ally]").forEach((el) => el.addEventListener("click", () => {
    pickedCompanion = el.dataset.pickAlly;
    render();
  }));
  document.querySelectorAll("[data-ally-slot]").forEach((el) => el.addEventListener("click", () => {
    if (!pickedCompanion) return;
    setFormation(run, pickedCompanion, Number(el.dataset.allySlot));
    pickedCompanion = null;
    render();
  }));
  document.querySelectorAll("[data-reward]").forEach((el) => el.addEventListener("click", () => {
    chooseReward(run, Number(el.dataset.reward));
    render();
  }));
  document.querySelectorAll("[data-skip]").forEach((el) => el.addEventListener("click", () => {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 4);
    skipReward(run);
    render();
  }));
  document.querySelectorAll("[data-reset]").forEach((el) => el.addEventListener("click", reset));
}

function syncAutoBattle() {
  if (!run.battle) {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
    return;
  }
  if (autoTimer) return;
  autoTimer = setInterval(autoStep, 760);
}

function autoStep() {
  if (!run.battle) {
    syncAutoBattle();
    return;
  }
  const b = run.battle;
  const index = chooseAutoCard(b);
  if (index >= 0) {
    const card = b.hand[index];
    const def = CARD_POOL[card.id];
    const targetIndex = chooseAutoTarget(b, def);
    const target = b.enemies[targetIndex] || b.enemy;
    const hp = target?.hp || 0;
    const result = playCard(run, index, targetIndex);
    if (result.ok) {
      fx = effectClass(def);
      if (run.battle && target && target.hp < hp) shake = "hit";
      run.log.unshift(`自动施放：${def.name}`);
    }
    render();
    return;
  }
  endTurn(run);
  render();
}

function chooseAutoCard(b) {
  const playable = b.hand
    .map((card, index) => ({ card, index, def: CARD_POOL[card.id] }))
    .filter((item) => item.card.cost <= b.energy);
  if (!playable.length) return -1;
  const hurt = run.player.hp < run.player.maxHp * 0.55;
  const danger = b.enemies.some((enemy) => enemy.hp > 0 && enemy.intent?.k === "attack");
  const scored = playable.map((item) => {
    let score = 0;
    if (item.def.tags.includes("attack")) score += 10;
    if (item.def.tags.includes("aoe")) score += 5;
    if (item.def.tags.includes("fire")) score += 4;
    if (item.def.tags.includes("defense") && danger) score += 12;
    if (item.card.id === "herb" && hurt) score += 16;
    score -= item.card.cost;
    return { ...item, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].index;
}

function chooseAutoTarget(b, def) {
  const alive = b.enemies
    .map((enemy, index) => ({ enemy, index }))
    .filter((item) => item.enemy.hp > 0);
  if (!alive.length) return 0;
  const attack = def.tags.includes("attack") || def.tags.includes("fire") || def.tags.includes("control");
  if (!attack) return b.target || alive[0].index;
  alive.sort((a, b) => {
    const aScore = a.enemy.hp - (a.enemy.intent?.k === "attack" ? 8 : 0) - (a.enemy.burn ? 4 : 0);
    const bScore = b.enemy.hp - (b.enemy.intent?.k === "attack" ? 8 : 0) - (b.enemy.burn ? 4 : 0);
    return aScore - bScore;
  });
  return alive[0].index;
}

function effectClass(def) {
  if (!def) return "";
  if (def.tags.includes("fire")) return "fx-fire";
  if (def.tags.includes("aoe")) return "fx-wave";
  if (def.tags.includes("defense")) return "fx-shield";
  if (def.tags.includes("attack")) return "fx-slash";
  return "fx-moon";
}

render();
