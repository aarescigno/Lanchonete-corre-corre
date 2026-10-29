/* ---------- troca de telas ---------- */
game.hooks.state = function(s){
  if (s === 'menu'){ game.resetDay(game.proxDia); buildMenu(); devSync(); showOnly(['ov-menu']); }
  else if (s === 'intro'){
    const d = game.day;
    if (game.mode === 'semfim'){
      $('intro-title').textContent = 'Turno sem fim';
      $('intro-goal').textContent = 'Todas as ' + game.tables.length + ' mesas abertas, 5 estrelas de reputação e freguesia cada vez mais rápida.';
      $('intro-note').textContent = 'Grupo que sai bravo ou que não cabe na fila tira 1 estrela. A cada 8 contas pagas com 5 corações, você ganha 1 de volta. Com 0 estrelas, o turno acaba.';
    } else {
      $('intro-title').textContent = 'Dia ' + d.n + (d.semana ? ' · ' + d.semana : '');
      const div = game.div, custos = ['contas ' + fmt(contasDia(game.tables, game.ponto))];
      if (payroll(game.save.equipe)) custos.push('folha ' + fmt(payroll(game.save.equipe)));
      if (div && div.cost) custos.push(div.name.toLowerCase() + ' ' + fmt(div.cost));
      $('intro-goal').textContent = 'Meta de lucro: ' + fmt(d.meta) + ' · 2 estrelas: ' + fmt(bomGoal(d)) + ' · 3 estrelas: ' + fmt(d.expert) + ' sem perder ninguém · ' + game.schedule.length + ' grupos' + (div ? ' (' + div.name.toLowerCase() + ')' : '') + ' · ' + mmss(d.time)
        + '. Custos do dia: ' + custos.join(' + ') + ', mais ' + Math.round(INGRED.prato * 100) + '% de cada prato em ingredientes.';
      // v8.2.3: reiniciou no meio com gente na espera ou nas mesas: a multa de quem foi embora bravo
      const en = game.encerrado; game.encerrado = null;
      $('intro-note').textContent = (en ? 'Você largou o dia no meio: ' + en.n + (en.n > 1 ? ' grupos foram' : ' grupo foi') + ' embora bravo' + (en.n > 1 ? 's' : '') + ' (multa de ' + fmt(en.multa) + '; agora você tem ' + fmt(en.bank) + '). ' : '') + (d.note || 'Sente a freguesia, anote os pedidos e mantenha todo mundo feliz!') + (d.n === 1 && !game.save.treino ? ' Primeira vez? No menu, a Missão zero é um treino passo a passo.' : '');
    }
    $('intro-manut').textContent = [introBanco(), introManut()].filter(Boolean).join(' ');
    showOnly(['ov-intro']);
  }
  else if (s === 'playing') showOnly([]);
  else if (s === 'treinoend'){ $('btn-treino-dia1').textContent = game.proxDia > 1 ? 'Continuar: dia ' + game.proxDia : 'Começar o dia 1'; showOnly(['ov-treino']); }
  else if (s === 'paused'){
    // v8.2.2: só o dia completo rende; interrompido, não paga nem ganha nada
    const nb = game.bravosSeSair.length, mb = game.multaSeSair;
    $('pause-note').textContent = game.mode !== 'carreira' ? '' : 'Se reiniciar ou sair, o dia não conta: só dias completos rendem. A folha e as contas só são pagas no fim do dia.'
      + (nb ? ' E ' + (nb > 1 ? 'os ' + nb + ' grupos' : 'o grupo') + ' na espera e nas mesas ' + (nb > 1 ? 'vão' : 'vai') + ' embora bravo' + (nb > 1 ? 's' : '') + ': multa de ' + fmt(mb) + '.' : '');
    showOnly(['ov-pause']);
  }
  else if (s === 'dayend'){ buildEnd(); showOnly(['ov-end']); }
  else if (s === 'shop'){ buildShop(); showOnly(['ov-shop']); }
  else if (s === 'falencia'){ buildFalencia(); showOnly(['ov-falencia']); }
  else if (s === 'endlessend'){ buildEndless(); showOnly(['ov-endless']); }
};

/* introdução do dia (v8.3): o caixa no negativo (e quantos dias faltam para o banco cobrir à força) e a parcela do dia */
function introBanco(){
  if (game.mode !== 'carreira') return '';
  const sv = game.save, out = [];
  if (sv.bank < 0){
    const falta = BANCO.neg - sv.neg;
    out.push('Caixa no negativo (' + fmt(sv.bank) + ')' + (sv.neg ? ' há ' + sv.neg + (sv.neg > 1 ? ' dias' : ' dia') : '') + ': ' + (falta > 0 ? 'mais ' + (falta + 1) + ' dias seguidos fechando no negativo (contando hoje) e' : 'se fechar hoje no negativo,') + ' o banco cobre o que falta, à força, com juros de ' + Math.round(BANCO.forcado * 100) + '% ao dia.');
  }
  if (sv.emp.atr) out.push('Parcela do banco atrasada! No fim do dia, o caixa precisa ter ' + fmt(game.devido) + ' (a atrasada e a de hoje), senão o banco toma a lanchonete.');   // v8.3.1
  else if (sv.emp.resto) out.push('Parcela do banco no fim do dia: ' + fmt(game.parcela) + ' (' + fmt(game.jurosHoje) + ' de juros; ' + (sv.emp.n > 1 ? 'faltam ' + sv.emp.n : 'a última') + '; se não couber no caixa, fica atrasada).');
  return out.join(' ');
}
/* introdução do dia (v8): o clima do dia e o estado do fogão, da geladeira e da cafeteira (com o risco de quebrar) */
function introManut(){
  if (!MANUT.on || game.mode !== 'carreira') return '';
  const m = game.manut, cl = CLIMA[game.clima], out = [];
  if (cl) out.push(cl.aviso);
  const lista = c => game.day.n >= MANUT.dia ? MANUT.equip.filter(q => manutChance(m[q.id]) === c).map(q => q.name.toLowerCase()) : [];
  const frase = (l, txt) => l.length ? ' ' + l.join(' e ').replace(/^./, x => x.toUpperCase()) + ': ' + txt + '.' : '';
  const vai = lista(1), pode = lista(MANUT.chanceVermelho);
  if (vai.length || pode.length) out.push((frase(vai, 'alto risco de quebra') + frase(pode, 'risco de quebra durante o expediente')).trim());
  return out.join(' ');
}
/* carreira (v8.3, campanha): sempre o próximo dia; do dia 2 em diante (no modo dev, desde o dia 1), a lojinha abre antes
   da introdução do dia. n = 0: a Missão zero (v8.2) */
function playCareer(n){
  if (n === 0) return game.startTreino();
  if (game.save.fechou) game.resetProgress();   // v8.3.1: o banco tomou a lanchonete; só resta recomeçar
  n = game.proxDia;
  if (n >= 2 || DEV.on) game.goShop(n); else game.startDay(n);
}
/* Missão zero: o texto do pop-up também vai para quem usa leitor de tela */
game.hooks.treino = tr => { const e = $('treino-live'), p = tr.passo; if (e) e.textContent = p ? p.tit + '. ' + tr.texto() : ''; };
function on(id, fn){ const e = $(id); if (e) e.addEventListener('click', fn); }
/* abertura do Modo História (v8.5): pelo botão História, termina no cartão "Em breve"; sozinha (a 1ª vez), volta ao menu */
let abertura = null;
function abLive(){ const e = $('ab-live'); if (e) e.textContent = abertura ? abertura.texto() : ''; }
function abrirAbertura(origem){
  Sfx.init(); Sfx.resume();
  lsSet(LS.abertura, '1');
  abertura = new Abertura(origem, RM);
  abertura.onCena = ab => { aberturaSom(ab.cena); abLive(); };
  abertura.onFim = ab => { abertura = null; abLive(); if (ab.origem === 'menu') showOnly(['ov-historia']); else game.setState('menu'); };
  aberturaSom(abertura.cena); abLive();
  showOnly(['ov-abertura']);
}
on('btn-historia',   () => { Sfx.tap(); abrirAbertura('menu'); });
on('btn-ab-voltar',  () => { Sfx.tap(); if (abertura) abertura.voltar(); });
on('btn-ab-pular',   () => { Sfx.tap(); if (abertura) abertura.pular(); });
on('btn-historia-rever', () => { Sfx.tap(); abrirAbertura('menu'); });
on('btn-historia-menu',  () => { Sfx.tap(); game.setState('menu'); });
on('btn-play',       () => { Sfx.init(); Sfx.resume(); Sfx.tap(); playCareer(); });
on('btn-treino',     () => { Sfx.init(); Sfx.resume(); Sfx.tap(); playCareer(0); });
on('btn-how',        () => { Sfx.init(); Sfx.resume(); Sfx.tap(); buildTips(); showOnly(['ov-how']); });
on('btn-how-close',  () => { Sfx.tap(); showOnly(['ov-menu']); });
on('btn-endless',    () => { Sfx.init(); Sfx.resume(); Sfx.tap(); game.startEndless(); });
on('btn-rank',       () => { Sfx.init(); Sfx.resume(); Sfx.tap(); openRank('ov-menu'); });
on('btn-ver',        () => { Sfx.tap(); showOnly(['ov-ver']); });
on('btn-ver-close',  () => { Sfx.tap(); showOnly(['ov-menu']); });
/* modo dev: 10 toques seguidos no selo da versão (no máximo 1,5 s entre um e outro) ligam e desligam */
function devSet(on){ game.setDev(on); game.setState('menu'); }
(function(){
  const t = $('vtag'); if (!t) return;
  let n = 0, prev = 0;
  t.addEventListener('click', () => {
    const now = Date.now();
    n = (now - prev < 1500) ? n + 1 : 1; prev = now;
    if (n < DEV.toques) return;
    n = 0; Sfx.init(); if (DEV.on) Sfx.tap(); else Sfx.ok();
    devSet(!DEV.on);
  });
})();
on('btn-dev-off',    () => { Sfx.tap(); devSet(false); });
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
on('btn-falencia-zero', () => { Sfx.init(); Sfx.tap(); playCareer(); });
on('btn-falencia-rank', () => { Sfx.tap(); openRank('ov-falencia'); });
on('btn-falencia-menu', () => game.setState('menu'));
on('btn-endless-rank',  () => { Sfx.tap(); openRank('ov-endless'); });
on('btn-endless-again', () => { Sfx.init(); Sfx.resume(); Sfx.tap(); game.startEndless(); });
on('btn-endless-menu',  () => { game.setState('menu'); });
/* Recomeçar do zero (v8.3): o 1º toque pede confirmação; o 2º apaga a carreira */
on('btn-reset',      () => {
  Sfx.init();
  if (!resetPede){ resetPede = true; $('btn-reset').textContent = 'Confirmar: apagar a carreira e voltar ao dia 1?'; Sfx.tap(); return; }
  game.resetProgress(); game.setState('menu');
});
on('btn-start',      () => { Sfx.init(); Sfx.resume(); Sfx.ok(); game.begin(); });
on('btn-intro-menu', () => game.setState('menu'));
on('btn-resume',     () => { Sfx.tap(); game.resume(); });
on('btn-restart',    () => { if (game.mode === 'semfim') game.startEndless(); else if (game.mode === 'treino') game.startTreino(); else { game.encerrar(); game.startDay(game.day.n); } });
on('btn-treino-dia1', () => { Sfx.tap(); playCareer(); });
on('btn-treino-menu', () => game.setState('menu'));
on('btn-pause-menu', () => { game.encerrar(); game.encerrado = null; game.setState('menu'); });
on('btn-end-menu',   () => game.setState('menu'));
on('btn-next',       () => game.goShop(game.proxDia));
on('btn-shop-go',    () => { Sfx.tap(); game.startDay(game.shopNext); });
on('btn-shop-menu',  () => game.setState('menu'));

/* ---------- entrada ---------- */
function toLogical(e){
  const r = canvas.getBoundingClientRect();
  const w = r.width || TW, h = r.height || H;
  return { x:(e.clientX - r.left) * TW / w, y:(e.clientY - r.top) * H / h };
}
function touchPad(e){
  if (e.pointerType === 'mouse') return 0;
  const w = canvas.getBoundingClientRect().width || TW;
  return clamp(14 * TW / w, 8, 32);
}
canvas.addEventListener('pointerdown', e => {
  Sfx.init(); Sfx.resume();
  e.preventDefault();
  if (abertura){ Sfx.tap(); abertura.seguir(); return; }   // abertura: o toque passa para a próxima cena
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
  // abertura: Esc pula; a seta para a esquerda volta; Enter, espaço e a seta para a direita seguem
  if (abertura){
    if (k === 'Escape'){ abertura.pular(); e.preventDefault(); }
    else if (k === 'ArrowLeft'){ abertura.voltar(); e.preventDefault(); }
    else if ((k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'ArrowRight') && !(e.target && e.target.tagName === 'BUTTON')){ abertura.seguir(); e.preventDefault(); }
    return;
  }
  // Missão zero: Enter segue o pop-up de explicação
  if (k === 'Enter' && game.state === 'playing' && game.treino && game.treino.para && !(e.target && e.target.tagName === 'BUTTON')){ game.treino.seguir(); e.preventDefault(); return; }
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
  const ab = abertura;
  if (ab){ ab.update(dt); if (!ab.fim){ ctx.setTransform(canvas.width / TW, 0, 0, canvas.height / H, 0, 0); drawAbertura(ctx, ab); return; } }
  game.update(dt);
  ctx.setTransform(canvas.width / TW, 0, 0, canvas.height / H, 0, 0);
  render(game, ctx);
}

try { if (document.fonts && document.fonts.load) { document.fonts.load('20px "Bagel Fat One"'); document.fonts.load('14px Rubik'); } } catch(e) {}
fit();
try { Rank.init(); } catch(e) {}
game.setState('menu');
if (!aberturaVista() && !DEV.on) abrirAbertura('auto');   // v8.5: a abertura toca sozinha uma vez
window.__game = game;
window.__lcc = { DECOR, DECOR_GRUPOS, TOALHA, decorOf, normDecor, decorOn, FILA_ACOES, filaMax, MARMITA, RETIRADA, marmitaMao, drawMarmita, prateleiraPos, EFOOD_COR, AVAL_BRAVO, QUEUE, setShopTab: v => { shopTab = v; buildShop(); }, TREINO, TREINO_PASSOS, TREINO_COR, Treino, treinoLugar, treinoPrimeiro, playCareer, buildMenu, introBanco, buildFalencia, BANCO, normEmprestimo, parcelaDe, devidoDe, jurosDe, tabelaDe, simulaEmprestimo, SEMANA, semanaOf, diaOf, FILA_JUSTA, PORTA, CHAIRS, PAT, CONTAS, INGRED, CARDAPIO, precoPrato, MAIS, PONTOS_ACAO, GORJETA, DRINK_PRICE, MOVIMENTO, movimentoSalao, DIVULGA, DIVULGA_DIA, divulgaOf, contasDia, bomGoal, SALAO, PONTOS, pontoOf, MESA, mesaBox, mesaPreco, salaoLugares, mesaProblema, salaoCaminho, salaoProblema, salaoOrdena, salaoAuto, salaoVaga, salaoPerto, salaoKit, salaoDevolucao, SALAO_SEMFIM, normSalao, setObst, OBST, pathOk, MAQUINA, BEBIDA_ESPERA, bebidaOf, MANUT, manutOf, manutChance, manutPreco, normManut, CLIMA, CLIMA_DIA, introManut, normPend, CALCADA, TW, HUDX, esperaAp, tableApproach, CRIT, STAFF, DANI_TASKS, DANI_HANDS, daniTaskOk, TRASH, WASH, payroll, FOLHA_CORTE, folhaCorta, folhaCortes, folhaItens, listaE, pratosDe, couvertEffect, couvertOk, ambienteEffect, dishStock, normSave, Helper, JUICE, KITCHEN_SLOTS, handLayout, trayOk, Game, Group, Table, Kitchen, Waitress, BIA_SPEED, DAYS, UPGRADES, CUSTOMER_TYPES, LAYOUT, PAL, Sfx, findPath, render, Rank, sortRows, cleanName, normName, CMD, ENDLESS, VIP, MULTA, rk, renderRank, openRank, closeRank, LS, lsGet, lsSet, loadSave, DEV, saveKey, devSync, divulgaAberta, CAIXA_MAX, VERSAO, normCaixa, caixaResumo, caixaTotais, copyText, AVAL, AVAL_CRIT, AVAL_BRAVO, avalMenu, avalTeto, avalEscala, avalFrac, AVAL_SIMPLES, normAval, avalNota, avalMedias, avalGeral, avalMovimento, avalComentario, fmtNota, notaFaixa, gurugolCaixa, AVAL_COM, normAvalCom, buildGurugol, ABERTURA, Abertura, AB_CENAS, AB_ALT, AB_BASE, abEsc, AB_VIVO, aberturaVista, aberturaSom, drawAbertura, abrirAbertura, aberturaAtual: () => abertura };
window.requestAnimationFrame(frame);

})();
</script>
