/* ---------- troca de telas ---------- */
game.hooks.state = function(s){
  if (s === 'menu'){ game.resetDay(1); buildChips(); showOnly(['ov-menu']); }
  else if (s === 'intro'){
    const d = game.day;
    if (game.mode === 'semfim'){
      $('intro-title').textContent = 'Turno sem fim';
      $('intro-goal').textContent = 'Todas as ' + game.tables.length + ' mesas abertas, 5 estrelas de reputação e freguesia cada vez mais rápida.';
      $('intro-note').textContent = 'Grupo que sai bravo ou que não cabe na fila tira 1 estrela. A cada 8 contas pagas com 5 corações, você ganha 1 de volta. Com 0 estrelas, o turno acaba.';
    } else {
      $('intro-title').textContent = 'Dia ' + d.n;
      const div = game.div, custos = ['contas ' + fmt(contasDia(game.tables, game.ponto))];
      if (payroll(game.save.equipe)) custos.push('folha ' + fmt(payroll(game.save.equipe)));
      if (div && div.cost) custos.push(div.name.toLowerCase() + ' ' + fmt(div.cost));
      $('intro-goal').textContent = 'Meta de lucro: ' + fmt(d.meta) + ' · 2 estrelas: ' + fmt(bomGoal(d)) + ' · Expert: ' + fmt(d.expert) + ' · ' + game.schedule.length + ' grupos' + (div ? ' (' + div.name.toLowerCase() + ')' : '') + ' · ' + mmss(d.time)
        + '. Custos do dia: ' + custos.join(' + ') + ', mais ' + Math.round(INGRED.prato * 100) + '% de cada prato em ingredientes.';
      $('intro-note').textContent = d.note || 'Sente a freguesia, anote os pedidos e mantenha todo mundo feliz!';
    }
    showOnly(['ov-intro']);
  }
  else if (s === 'playing') showOnly([]);
  else if (s === 'paused') showOnly(['ov-pause']);
  else if (s === 'dayend'){ buildEnd(); showOnly(['ov-end']); }
  else if (s === 'shop'){ buildShop(); showOnly(['ov-shop']); }
  else if (s === 'final'){ buildFinal(); showOnly(['ov-final']); }
  else if (s === 'endlessend'){ buildEndless(); showOnly(['ov-endless']); }
};

/* carreira: do dia 2 em diante, a lojinha abre antes da introdução do dia */
function playCareer(n){
  selectedDay = n;
  if (n >= 2) game.goShop(n); else game.startDay(n);
}
function on(id, fn){ const e = $(id); if (e) e.addEventListener('click', fn); }
on('btn-play',       () => { Sfx.init(); Sfx.resume(); Sfx.tap(); playCareer(selectedDay); });
on('btn-how',        () => { Sfx.init(); Sfx.resume(); Sfx.tap(); buildTips(); showOnly(['ov-how']); });
on('btn-how-close',  () => { Sfx.tap(); showOnly(['ov-menu']); });
on('btn-endless',    () => { Sfx.init(); Sfx.resume(); Sfx.tap(); game.startEndless(); });
on('btn-rank',       () => { Sfx.init(); Sfx.resume(); Sfx.tap(); openRank('ov-menu'); });
on('btn-ver',        () => { Sfx.tap(); showOnly(['ov-ver']); });
on('btn-ver-close',  () => { Sfx.tap(); showOnly(['ov-menu']); });
/* instalar no celular: passo a passo; já instalado (tela cheia ou standalone), o ícone some */
on('btn-app',        () => { Sfx.init(); Sfx.tap(); $('app-msg').textContent = ''; showOnly(['ov-app']); });
on('btn-app-close',  () => { Sfx.tap(); showOnly(['ov-menu']); });
on('btn-app-copy',   () => {
  Sfx.tap();
  const url = $('app-link').href, msg = $('app-msg');
  const ok = () => { msg.textContent = 'Endereço copiado! Cole no navegador do celular.'; };
  const no = () => { msg.textContent = 'Não deu para copiar aqui. O endereço é ' + url; };
  try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, no); else no(); } catch(e) { no(); }
});
try { if (window.matchMedia && window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || window.navigator.standalone) $('btn-app').style.display = 'none'; } catch(e) {}
on('btn-rank-back',  () => { Sfx.tap(); closeRank(); });
on('btn-end-rank',   () => { Sfx.tap(); openRank('ov-end'); });
on('btn-final-rank', () => { Sfx.tap(); openRank('ov-final'); });
on('btn-endless-rank',  () => { Sfx.tap(); openRank('ov-endless'); });
on('btn-endless-again', () => { Sfx.init(); Sfx.resume(); Sfx.tap(); game.startEndless(); });
on('btn-endless-menu',  () => { game.setState('menu'); });
on('btn-reset',      () => { game.resetProgress(); selectedDay = 1; game.setState('menu'); });
on('btn-start',      () => { Sfx.init(); Sfx.resume(); Sfx.ok(); game.begin(); });
on('btn-intro-menu', () => game.setState('menu'));
on('btn-resume',     () => { Sfx.tap(); game.resume(); });
on('btn-restart',    () => { if (game.mode === 'semfim') game.startEndless(); else game.startDay(game.day.n); });
on('btn-pause-menu', () => { if (game.mode !== 'semfim') selectedDay = Math.max(1, Math.min(game.day.n, game.unlocked)); game.setState('menu'); });
on('btn-again',      () => playCareer(game.day.n));
on('btn-end-menu',   () => { selectedDay = Math.min(game.day.n + (game.result && game.result.passed ? 1 : 0), game.unlocked); game.setState('menu'); });
on('btn-next',       () => { if (game.day.n < 7) game.goShop(game.day.n + 1); else game.setState('final'); });
on('btn-shop-go',    () => { Sfx.tap(); selectedDay = game.shopNext; game.startDay(game.shopNext); });
on('btn-shop-menu',  () => { selectedDay = Math.min(game.shopNext, game.unlocked); game.setState('menu'); });
on('btn-final-menu', () => { selectedDay = 1; game.setState('menu'); });

/* ---------- entrada ---------- */
function toLogical(e){
  const r = canvas.getBoundingClientRect();
  const w = r.width || W, h = r.height || H;
  return { x:(e.clientX - r.left) * W / w, y:(e.clientY - r.top) * H / h };
}
function touchPad(e){
  if (e.pointerType === 'mouse') return 0;
  const w = canvas.getBoundingClientRect().width || W;
  return clamp(14 * W / w, 8, 32);
}
canvas.addEventListener('pointerdown', e => {
  Sfx.init(); Sfx.resume();
  e.preventDefault();
  try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
  const p = toLogical(e); game.onDown(p.x, p.y, touchPad(e));
});
canvas.addEventListener('pointermove', e => { const p = toLogical(e); game.onMove(p.x, p.y); });
canvas.addEventListener('pointerup', e => { const p = toLogical(e); game.onUp(p.x, p.y); });
canvas.addEventListener('pointercancel', e => { game.drag = null; game.hover = null; });
canvas.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => {
  const k = e.key;
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (k === 'p' || k === 'P' || k === 'Escape' || ((k === ' ' || k === 'Spacebar') && !(e.target && e.target.tagName === 'BUTTON'))){
    if (game.state === 'playing'){ game.pause(); e.preventDefault(); }
    else if (game.state === 'paused' && k !== 'Escape'){ game.resume(); e.preventDefault(); }
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) game.pause(); });
window.addEventListener('blur', () => game.pause());
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);

/* ---------- laço principal ---------- */
let last = 0;
function frame(ts){
  window.requestAnimationFrame(frame);
  if (!last) last = ts;
  let dt = (ts - last) / 1000; last = ts;
  if (!(dt > 0)) dt = 0.016;
  dt = Math.min(dt, 0.05);
  game.update(dt);
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  render(game, ctx);
}

try { if (document.fonts && document.fonts.load) { document.fonts.load('20px "Bagel Fat One"'); document.fonts.load('14px Rubik'); } } catch(e) {}
fit();
try { Rank.init(); } catch(e) {}
game.setState('menu');
window.__game = game;
window.__lcc = { setShopTab: v => { shopTab = v; buildShop(); }, FILA_JUSTA, PORTA, PAT, CONTAS, INGRED, DIVULGA, DIVULGA_DIA, divulgaOf, contasDia, bomGoal, SALAO, PONTOS, pontoOf, MESA, mesaBox, mesaPreco, salaoLugares, mesaProblema, salaoCaminho, salaoProblema, salaoOrdena, salaoAuto, salaoVaga, salaoPerto, salaoKit, salaoDevolucao, SALAO_SEMFIM, normSalao, setObst, OBST, pathOk, AGUA, CRIT, STAFF, DANI_TASKS, DANI_HANDS, daniTaskOk, TRASH, WASH, payroll, couvertEffect, dishStock, normSave, Helper, JUICE, KITCHEN_SLOTS, handLayout, trayOk, Game, Group, Table, Kitchen, Waitress, BIA_SPEED, DAYS, UPGRADES, CUSTOMER_TYPES, LAYOUT, PAL, Sfx, findPath, render, Rank, sortRows, cleanName, normName, CMD, ENDLESS, VIP, rk, renderRank, openRank, closeRank, LS, lsGet, lsSet, loadSave, CAIXA_MAX, VERSAO, normCaixa, caixaResumo, caixaTotais, copyText };
window.requestAnimationFrame(frame);

})();
</script>
