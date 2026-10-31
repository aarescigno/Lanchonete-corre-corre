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
    $('intro-manut').textContent = [game.mode === 'carreira' ? game.capLinha() : '', introEncomenda(), introBanco(), introManut()].filter(Boolean).join(' ');
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
  else if (s === 'shop'){ shopGrupo = shopEntra ? shopGrupoDe(shopEntra) : shopEntraG || 'lanchonete'; shopTab = shopEntra; shopEntra = null; shopEntraG = null; buildShop(); showOnly(['ov-shop']); }
  else if (s === 'falencia'){ buildFalencia(); showOnly(['ov-falencia']); }
  else if (s === 'endlessend'){ buildEndless(); showOnly(['ov-endless']); }
};

let shopEntraG = null;   // v9.0.4: o grupo que a lojinha abre (nos cartões) depois da conversa de um cartão novo
let shopEntra = null;   // v9.0.1: a seção que a lojinha abre direto (depois da conversa do cardápio)
/* v9: a encomenda do setor do dia (área industrial) vem avisada, para dar tempo de adiantar marmitas no "+ marmita" */
function introEncomenda(){
  const e = game.mode === 'carreira' ? game.encomendaDia : null;
  return e ? 'Encomenda do setor de montagem: ' + e.lote + ' marmitas, lá pelo começo da tarde.' : '';
}
/* introdução do dia (v8.3): o caixa no negativo (e quantos dias faltam para o banco cobrir à força) e a parcela do dia */
function introBanco(){
  if (game.mode !== 'carreira') return '';
  const sv = game.save, out = [];
  if (sv.bank < 0){
    const falta = BANCO.neg - sv.neg;
    out.push('Caixa no negativo (' + fmt(sv.bank) + ')' + (sv.neg ? ' há ' + sv.neg + (sv.neg > 1 ? ' dias' : ' dia') : '') + ': ' + (falta > 0 ? 'mais ' + (falta + 1) + ' dias seguidos fechando no negativo (contando hoje) e' : 'se fechar hoje no negativo,') + ' o banco cobre o que falta, à força, com juros de ' + Math.round(BANCO.forcado * 100) + '% ao dia.');
  }
  if (sv.emp.atr) out.push('Parcela do banco atrasada! No fim do dia, o caixa precisa ter ' + fmt(game.devido) + ' (a atrasada e a de hoje), senão o banco toma a lanchonete.');   // v8.3.1
  else if (sv.emp.resto && carencia(sv.emp, game.day.n)) out.push('Reforma da garagem: faltam ' + fmt(sv.emp.resto) + '. A 1ª parcela (' + fmt(parcelaDe(sv.emp, sv.emp.ini)) + ') só vence no fim do dia ' + sv.emp.ini + '.');
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
  fluxoHistoria(() => { const p = game.proxDia; if (p >= 2 || DEV.on) game.goShop(p); else game.startDay(p); });
}
/* conversas do Modo História (v8.7): balões sobre o salão do dia que vem, parado e escurecido; um toque passa, Pular fecha */
function convLive(){ const e = $('conv-live'); if (e) e.textContent = game.conversa ? game.conversa.texto() : ''; }
function falar(tipo, depois){
  const c = HISTORIA[game.save.cap - 1], falas = Array.isArray(tipo) ? tipo : c && c[tipo];   // v9.0.1: ou a lista de falas direto
  if (!falas || !falas.length) return depois();
  game.resetDay(game.proxDia);
  game.conversa = new Conversa(falas, () => { game.conversa = null; convLive(); depois(); }, RM);
  game.conversa.onFala = convLive; convLive();
  showOnly(['ov-conversa']);
}
/* toca a conversa pendente (a de depois fecha o capítulo e abre o seguinte, com a de antes) e só então chama fim();
   ao fechar o último capítulo, o cartão "Continua na próxima versão" vem antes */
let contFim = null;
/* o cartão de fim de capítulos (v9): o do último capítulo de cada ponto manda para a mudança na lojinha ou para a próxima versão (v9.1: HISTORIA.fim) */
function contTexto(){
  const ind = game.save.cap > HISTORIA.length;
  const c = HISTORIA[Math.min(game.save.cap, HISTORIA.length + 1) - 2], fim = (c && c.fim) || { h:'Fim dos capítulos', p:'' };   // v9.1: o texto vem do último capítulo de cada ponto (HISTORIA.fim)
  $('cont-h').textContent = fim.h;
  $('cont-p').textContent = fim.p;
  $('cont-s').textContent = ind ? 'Enquanto isso, a lanchonete segue aberta: os dias continuam, sem objetivo, e a história espera por você.' : 'Enquanto isso, a lanchonete segue aberta: os dias continuam, sem objetivo.';
}
/* v9.0.3: no máximo uma conversa por vez: a de capítulo (depois, e a de antes do seguinte) vem primeiro; a do cardápio e a da
   divulgação, só numa troca de dia sem conversa de capítulo (falou), e uma de cada vez; a outra espera, pendente */
function fluxoHistoria(fim, falou){
  const sv = game.save;
  if (sv.conversa === 'depois') return falar('depois', () => {
    if (game.avancaCap()){ contFim = fim; contTexto(); showOnly(['ov-continua']); } else fluxoHistoria(fim, true);
  });
  if (sv.conversa === 'antes') return falar('antes', () => { game.save.conversa = null; writeSave(game.save); fluxoHistoria(fim, true); });
  if (falou) return fim();
  const libera = id => { const L = liberaOf(id); return falar(L.falas, () => { sv.libera[id] = 1; writeSave(sv); shopEntraG = shopGrupoDe(id); fim(); }); };   // v9.0.4
  const man = LIBERA.find(L => L.primeiro && sv.libera[L.id] === 'pend');
  if (man) return libera(man.id);
  if (sv.convCard === 'pend') return falar(cursoFeito(sv.cursos) ? HIST_CARDAPIO.fez : HIST_CARDAPIO.falas, () => { sv.convCard = 1; writeSave(sv); shopEntra = 'cardapio'; fim(); });
  if (sv.convDiv === 'pend') return falar(HIST_DIVULGA.falas, () => { sv.convDiv = 1; writeSave(sv); shopEntra = 'divulga'; fim(); });   // v9.0.2
  const outra = LIBERA.find(L => sv.libera[L.id] === 'pend');
  if (outra) return libera(outra.id);
  fim();
}
/* Missão zero: o texto do pop-up também vai para quem usa leitor de tela */
game.hooks.treino = tr => { const e = $('treino-live'), p = tr.passo; if (e) e.textContent = p ? p.tit + '. ' + tr.texto() : ''; };
function on(id, fn){ const e = $(id); if (e) e.addEventListener('click', fn); }
/* abertura do Modo História (v8.5): pelo botão Ver abertura, volta ao menu; sozinha (a 1ª vez, com a história ainda por começar),
   segue para a Missão zero (se ainda não fez) ou para a conversa do cap. 1 (v8.7) */
let abertura = null;
function abLive(){ const e = $('ab-live'); if (e) e.textContent = abertura ? abertura.texto() : ''; }
function abrirAbertura(origem){
  Sfx.init(); Sfx.resume();
  lsSet(LS.abertura, '1');
  abertura = new Abertura(origem, RM);
  abertura.onCena = ab => { aberturaSom(ab.cena); abLive(); };
  abertura.onFim = ab => {
    abertura = null; abLive();
    const sv = game.save;
    if (ab.origem === 'auto' && sv.cap === 1 && sv.conversa === 'antes' && sv.dia === 1 && !sv.fechou) playCareer(sv.treino ? undefined : 0);
    else game.setState('menu');
  };
  aberturaSom(abertura.cena); abLive();
  showOnly(['ov-abertura']);
}
on('btn-historia',   () => { Sfx.tap(); abrirAbertura('menu'); });
on('btn-ab-voltar',  () => { Sfx.tap(); if (abertura) abertura.voltar(); });
on('btn-ab-pular',   () => { Sfx.tap(); if (abertura) abertura.pular(); });
on('btn-conv-pular', () => { Sfx.tap(); if (game.conversa) game.conversa.pular(); });
on('btn-continua',   () => { Sfx.tap(); const f = contFim; contFim = null; if (f) f(); });
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
on('devbadge',       () => { Sfx.init(); Sfx.tap(); abrirDev(); });
on('btn-dev-close',  () => { Sfx.tap(); fecharDev(); });
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
on('btn-aviso',      () => { Sfx.tap(); game.save.avisoCard = false; game.save.avisoHist = false; writeSave(game.save); buildMenu(); });   // fecha o aviso de novidade (v8.6.9: cardápio que cresce; v8.7: Modo História)
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
on('btn-next',       () => fluxoHistoria(() => game.goShop(game.proxDia)));
on('btn-shop-go',    () => { Sfx.tap(); game.startDay(game.shopNext); });
on('btn-shop-menu',  () => game.setState('menu'));

/* ---------- entrada ---------- */
/* v9.0.1: o retângulo do botão Pular em coordenadas do canvas (8 de folga), para o balão desviar; null sem tamanho ou fora do canvas */
function convEvita(){
  const b = $('btn-conv-pular'); if (!b) return null;
  const r = b.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
  if (!(r.width > 0) || !(cr.width > 0) || !(cr.height > 0)) return null;
  const kx = TW / cr.width, ky = H / cr.height, e = { x:(r.left - cr.left) * kx - 8, y:(r.top - cr.top) * ky - 8, w:r.width * kx + 16, h:r.height * ky + 16 };
  return e.y + e.h < 0 || e.y > H || e.x + e.w < 0 || e.x > TW ? null : e;
}
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
  if (game.conversa){ Sfx.tap(); game.conversa.seguir(); return; }   // conversa (v8.7): o toque passa para a próxima fala
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
  // conversa (v8.7): Esc pula; Enter, espaço e a seta para a direita seguem
  if (game.conversa){
    if (k === 'Escape'){ game.conversa.pular(); e.preventDefault(); }
    else if ((k === 'Enter' || k === ' ' || k === 'Spacebar' || k === 'ArrowRight') && !(e.target && e.target.tagName === 'BUTTON')){ game.conversa.seguir(); e.preventDefault(); }
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
/* v9.2.1: o modo dev acelera o dia (DEV.vel: 1, 2 ou 4 passos por quadro); fora dele é um passo só */
function passoJogo(dt){ const k = DEV.on && game.state === 'playing' ? DEV.vel : 1; for (let i = 0; i < k; i++) game.update(dt); }
let last = 0;
function frame(ts){
  window.requestAnimationFrame(frame);
  if (!last) last = ts;
  let dt = (ts - last) / 1000; last = ts;
  if (!(dt > 0)) dt = 0.016;
  dt = Math.min(dt, 0.05);
  const ab = abertura;
  if (ab){ ab.update(dt); if (!ab.fim){ ctx.setTransform(canvas.width / TW, 0, 0, canvas.height / H, 0, 0); drawAbertura(ctx, ab); return; } }
  passoJogo(dt);
  ctx.setTransform(canvas.width / TW, 0, 0, canvas.height / H, 0, 0);
  render(game, ctx);
  if (game.conversa){ game.conversa.evita = convEvita(); game.conversa.update(dt); drawConversa(ctx, game, game.conversa); }
}

try { if (document.fonts && document.fonts.load) { document.fonts.load('20px "Bagel Fat One"'); document.fonts.load('14px Rubik'); } } catch(e) {}
fit();
try { Rank.init(); } catch(e) {}
game.setState('menu');
if (!aberturaVista() && !DEV.on) abrirAbertura('auto');   // v8.5: a abertura toca sozinha uma vez
window.__game = game;
window.__lcc = { abrirDev, fecharDev, buildDev, passoJogo, devLivre, diaNoPonto, manutEmerg, manutFator, daniTaskDe, plateSlotsFor, queueYsFor, assentoSlow, AVENIDA, SABORES, cursoOk, INDUSTRIAL, PLATE_SLOTS, cozinhaSlots, upgradeDe, DECOR, DECOR_GRUPOS, TOALHA, decorOf, normDecor, decorOn, FILA_ACOES, filaMax, MARMITA, RETIRADA, marmitaMao, drawMarmita, prateleiraPos, EFOOD_COR, AVAL_BRAVO, QUEUE, setShopTab: v => shopAbrir(v), setShopGrupo: g => shopGrupoAbrir(g), shopSecoes: () => SHOP_GRUPOS.map(g => shopSecoesVis(g)), TREINO, TREINO_PASSOS, TREINO_COR, Treino, treinoLugar, treinoPrimeiro, playCareer, buildMenu, introBanco, buildFalencia, BANCO, normEmprestimo, parcelaDe, devidoDe, jurosDe, tabelaDe, simulaEmprestimo, SEMANA, semanaOf, diaOf, FILA_JUSTA, PORTA, CHAIRS, PAT, CONTAS, INGRED, CARDAPIO, precoPrato, CURSOS, CURSO_AV, CURSO_XP, tonhaoXp, tonhaoNivelXp, daniXp, daniNivelXp, DANI_XP, DANI_CURSOS, CURSOS_SEMFIM, cursoOf, cursoNivel, normCursos, pratoAv, CARNES, drawDish, pratoSabido, pratosSabidos, GOSTOS, GOSTOS_CAT, pedePrato, VEG, vegMov, drawDish, MAIS, PONTOS_ACAO, GORJETA, DRINK_PRICE, MOVIMENTO, movimentoSalao, DIVULGA, DIVULGA_DIA, divulgaOf, contasDia, bomGoal, SALAO, PONTOS, pontoOf, MESA, mesaBox, mesaPreco, salaoLugares, mesaProblema, salaoCaminho, salaoProblema, salaoOrdena, salaoAuto, salaoVaga, salaoPerto, salaoKit, salaoDevolucao, SALAO_SEMFIM, normSalao, setObst, OBST, pathOk, MAQUINA, BEBIDA_ESPERA, bebidaOf, MANUT, manutOf, manutChance, manutPreco, normManut, CLIMA, CLIMA_DIA, introManut, normPend, CALCADA, TW, HUDX, esperaAp, tableApproach, CRIT, STAFF, DANI_TASKS, DANI_HANDS, daniTaskOk, TRASH, WASH, payroll, FOLHA_CORTE, folhaCorta, folhaCortes, folhaItens, listaE, pratosDe, couvertEffect, couvertOk, ambienteEffect, dishStock, normSave, Helper, JUICE, KITCHEN_SLOTS, handLayout, trayOk, Game, Group, Table, Kitchen, Waitress, BIA_SPEED, DAYS, UPGRADES, CUSTOMER_TYPES, LAYOUT, PAL, Sfx, findPath, render, Rank, sortRows, cleanName, normName, CMD, ENDLESS, VIP, MULTA, rk, renderRank, openRank, closeRank, LS, lsGet, lsSet, loadSave, DEV, saveKey, devSync, divulgaAberta, CAIXA_MAX, VERSAO, normCaixa, caixaResumo, caixaTotais, copyText, PRATO, pratoPerde, pratoVapor, AVAL, AVAL_CRIT, AVAL_BRAVO, avalMenu, cursosItem, DOCES, CAFES, cafeDe, docesLista, docePreco, doceIngred, doceIdx, CAMI_CURSOS, CAMI_HOME, CAMI_LOOK, camiNivelCursos, normCamiCursos, drawCami, drawEspresso, JOCA_XP, JOCA_CURSOS, JOCA_HOME, jocaXp, jocaNivelXp, BASICAS, donoBasico, cursoDaniVis, JOCA_LOOK, drawJoca, avalTeto, avalEscala, avalFrac, AVAL_SIMPLES, AVAL_DECOR, normAval, avalNota, avalMedias, avalGeral, avalMovimento, avalMinimo, avalComentario, fmtNota, notaFaixa, gurugolCaixa, AVAL_COM, normAvalCom, buildGurugol, ABERTURA, Abertura, AB_CENAS, AB_ALT, AB_BASE, abEsc, AB_VIVO, aberturaVista, aberturaSom, drawAbertura, abrirAbertura, HISTORIA, HIST_CARDAPIO, HIST_DIVULGA, LIBERA, liberaOf, HIST_NOMES, normEquipe, upgradeCartao, cursoFeito, AVAL_POUCO, REFORMA, HIST, carencia, Conversa, drawConversa, falar, fluxoHistoria, aberturaAtual: () => abertura };
window.requestAnimationFrame(frame);

})();
</script>
