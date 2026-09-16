export const defs = {
  forest: { name: '山林', kind: 'terrain', art: 'forest', cost: 1, text: '每天生长 1 食物；邻近灵兔育幼。毕方会点燃树林。' },
  water: { name: '河流', kind: 'terrain', art: 'water', cost: 1, text: '邻格额外生长 1 食物，并阻止邻格起火。' },
  meadow: { name: '草地', kind: 'terrain', art: 'meadow', cost: 1, text: '每天生长 2 食物，是食草兽的稳定粮源。' },
  deer: { name: '灵鹿', kind: 'beast', art: 'deer', cost: 2, text: '每天吃 2 食物，饱食获得 1 生机；缺粮失去 1 生命。' },
  rabbit: { name: '灵兔', kind: 'beast', art: 'rabbit', cost: 2, text: '每天吃 1 食物；饱食且邻近山林时育幼，获得 1 生机。' },
  wolf: { name: '狰兽', kind: 'beast', art: 'wolf', cost: 3, text: '每日攻击一只邻近鹿兔，获得 2 生机；没有可捕猎目标则失去 1 生命。' },
  bird: { name: '毕方', kind: 'beast', art: 'bird', cost: 3, text: '点燃自身及邻格的山林；灰烬次日长灵草。河流和玄龟能阻火。' },
  turtle: { name: '玄龟', kind: 'beast', art: 'turtle', cost: 2, text: '保护自身及邻格免受火焰和狰兽袭击；邻水获得 1 生机。' },
  fox: { name: '青丘狐', kind: 'beast', art: 'fox', cost: 3, text: '每天吃 1 食物；邻近至少两种其他异兽时，协作获得 3 生机。' },
};
export const goals = {
  balance: { name: '众生共栖', text: '第 8 天，至少 3 种异兽存活，积累 25 生机。' },
  garden: { name: '焦土花园', text: '第 8 天，累计收获 8 格灵草，且有异兽存活。' },
  clan: { name: '灵兽家园', text: '第 8 天，至少 6 只异兽存活，累计育幼 8 次。' },
};
export function neighbors(index) {
  if (!Number.isInteger(index) || index < 0 || index >= 20) return [];
  const result = [];
  if (index >= 5) result.push(index - 5);
  if (index < 15) result.push(index + 5);
  if (index % 5) result.push(index - 1);
  if (index % 5 < 4) result.push(index + 1);
  return result;
}
export function create(goal = 'balance') {
  const board = Array.from({ length: 20 }, () => ({ terrain: 'meadow', beast: null, food: 2, ash: 0, health: 0, beastPaid: 0, terrainPaid: 0 }));
  for (const i of [0, 1, 4, 5, 9, 15, 19]) board[i].terrain = 'forest';
  for (const i of [2, 7, 12, 17]) { board[i].terrain = 'water'; board[i].food = 0; }
  Object.assign(board[6], { beast: 'rabbit', health: 3 });
  Object.assign(board[13], { beast: 'deer', health: 3 });
  return { version: 3, day: 0, phase: 'play', energy: 6, score: 0, herbHarvest: 0, births: 0, board, events: [], message: '布置异兽与地形，再推进一天。邻接指上下左右。', goal: goals[goal] ? goal : 'balance' };
}
const copy = s => ({ ...s, board: s.board.map(c => ({ ...c })), events: [] });
export function place(s, id, index) {
  const d = defs[id], cell = s.board[index];
  if (s.phase !== 'play' || !d || !Number.isInteger(index) || !cell || s.energy < d.cost) return s;
  if (d.kind === 'beast' && cell.beast || d.kind === 'terrain' && cell.terrain === id) return s;
  const n = copy(s), c = n.board[index];
  if (d.kind === 'beast') { c.beast = id; c.health = 3; c.beastPaid = d.cost; }
  else { n.energy += c.terrainPaid || 0; c.terrain = id; c.terrainPaid = d.cost; c.ash = 0; c.food = id === 'water' ? 0 : Math.min(c.food, 3); }
  n.energy -= d.cost;
  n.message = `已放置${d.name}，可撤回重新布置。`;
  return n;
}
export function remove(s, index) {
  const cell = s.board[index];
  if (s.phase !== 'play' || !Number.isInteger(index) || !cell || (!cell.beast && cell.terrain === 'meadow')) return s;
  const n = copy(s), c = n.board[index];
  if (c.beast) { n.energy += c.beastPaid || 0; c.beast = null; c.health = 0; c.beastPaid = 0; }
  else { n.energy += c.terrainPaid || 0; c.terrain = 'meadow'; c.terrainPaid = 0; c.ash = 0; }
  n.message = '已撤回，退还购买花费；初始赠送的牌不返还灵力。';
  return n;
}
function protectedAt(board, i, fire = false) {
  return [i, ...neighbors(i)].some(j => board[j].beast === 'turtle' || (fire && board[j].terrain === 'water'));
}
export function advance(s) {
  if (s.phase !== 'play') return s;
  const n = copy(s); n.day++; n.energy = Math.min(12, n.energy + 3);
  const emit = (index, text, type) => n.events.push({ index, text, type });
  // Resolve yesterday's ashes before today's fires, so harvesting requires a full day.
  n.board.forEach((c, i) => {
    if (c.ash > 0) { c.ash = 0; c.food = Math.min(5, c.food + 3); n.herbHarvest++; n.score += 2; emit(i, '灵草 +3 · 生机 +2', 'grow'); }
    if (c.terrain !== 'water') {
      const amount = (c.terrain === 'meadow' ? 2 : 1) + Number(neighbors(i).some(j => n.board[j].terrain === 'water'));
      c.food = Math.min(5, c.food + amount);
    }
  });
  const burning = new Set();
  n.board.forEach((c, i) => { if (c.beast === 'bird') for (const j of [i, ...neighbors(i)]) if (n.board[j].terrain === 'forest') {
    if (protectedAt(n.board, j, true)) emit(j, '火焰被阻挡', 'protect'); else burning.add(j);
  } });
  for (const i of burning) { const c = n.board[i]; c.terrain = 'meadow'; c.ash = 1; c.food = 0; c.terrainPaid = 0; emit(i, '山林燃烧 · 明日灵草', 'fire'); }
  // Herbivores eat first: a sustainable herd can recover between predator attacks.
  n.board.forEach((c, i) => {
    if (!['rabbit', 'deer', 'fox'].includes(c.beast)) return;
    const need = c.beast === 'deer' ? 2 : 1;
    if (c.food < need) { c.health--; emit(i, '缺粮 · 生命 −1', 'hurt'); return; }
    c.food -= need; c.health = Math.min(3, c.health + 1);
    if (c.beast === 'deer') { n.score++; emit(i, '饱食 · 生机 +1', 'feed'); }
    if (c.beast === 'rabbit' && neighbors(i).some(j => n.board[j].terrain === 'forest')) { n.births++; n.score++; emit(i, '育幼 +1 · 生机 +1', 'birth'); }
    if (c.beast === 'fox' && new Set(neighbors(i).map(j => n.board[j].beast).filter(b => b && b !== 'fox')).size >= 2) { n.score += 3; emit(i, '异兽协作 · 生机 +3', 'bond'); }
  });
  n.board.forEach((c, i) => {
    if (c.beast === 'turtle' && [i, ...neighbors(i)].some(j => n.board[j].terrain === 'water')) { n.score++; emit(i, '水泽守护 · 生机 +1', 'protect'); }
    if (c.beast !== 'wolf') return;
    const prey = neighbors(i).filter(j => ['rabbit', 'deer'].includes(n.board[j].beast) && n.board[j].health > 0);
    const target = prey.find(j => !protectedAt(n.board, j));
    if (target === undefined) { c.health--; emit(i, prey.length ? '玄龟护住猎物 · 饥饿 −1' : '没有猎物 · 饥饿 −1', 'hurt'); }
    else { n.board[target].health--; c.health = Math.min(3, c.health + 1); n.score += 2; emit(target, '遭到捕食 · 生命 −1', 'hurt'); emit(i, '捕食 · 生机 +2', 'feed'); }
  });
  n.board.forEach((c, i) => { if (c.beast && c.health <= 0) { emit(i, `${defs[c.beast].name}离开了`, 'leave'); c.beast = null; c.health = 0; c.beastPaid = 0; } });
  const alive = n.board.filter(c => c.beast && c.health > 0);
  if (n.day >= 8) {
    const won = n.goal === 'garden' ? n.herbHarvest >= 8 && alive.length > 0 : n.goal === 'clan' ? alive.length >= 6 && n.births >= 8 : new Set(alive.map(c => c.beast)).size >= 3 && n.score >= 25;
    n.phase = won ? 'won' : 'lost'; n.message = won ? '八日已过，你的生态组合完成了目标。' : '八日已过，目标尚未达成。换一种布局再试试。';
  } else n.message = `第 ${n.day} 天结束 · ${alive.length} 只异兽存活 · 生机 ${n.score}`;
  return n;
}
export function forecast(s) {
  if (s.phase !== 'play') return [s.message];
  const out = [], b = s.board;
  const fire = new Set();
  b.forEach((c, i) => { if (c.beast === 'bird') for (const j of [i, ...neighbors(i)]) if (b[j].terrain === 'forest' && !protectedAt(b, j, true)) fire.add(j); });
  if (b.some(c => c.ash)) out.push(`${b.filter(c => c.ash).length} 格灰烬将长出灵草。`);
  if (fire.size) out.push(`毕方将烧掉 ${fire.size} 格山林，明日留下灰烬。`);
  b.forEach((c, i) => {
    if (c.beast === 'wolf' && !neighbors(i).some(j => ['rabbit', 'deer'].includes(b[j].beast) && !protectedAt(b, j))) out.push('狰兽无可捕猎目标，将损失生命。');
    if (c.beast === 'fox' && new Set(neighbors(i).map(j => b[j].beast).filter(v => v && v !== 'fox')).size >= 2) out.push('青丘狐将触发异兽协作，获得 3 生机。');
  });
  if (!out.length) out.push('山林与草地将生长食物，饱食异兽恢复生命。');
  return [...new Set(out)].slice(0, 4);
}
