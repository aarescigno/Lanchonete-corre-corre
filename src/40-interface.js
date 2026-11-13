/* ============================================================
   INTERFACE (HTML + canvas) E INICIALIZAÇÃO
   ============================================================ */
const $ = id => document.getElementById(id);
const canvas = $('c');
const ctx = canvas.getContext('2d');
const stage = $('stage');
const game = new Game(canvas, ctx);
/* quem nunca fez a Missão zero (e ainda está no dia 1) encontra o botão dela em destaque */
function treinoPrimeiro(){ return !game.save.treino && game.proxDia <= 1 && !DEV.on; }

const SCREENS = ['ov-menu','ov-manual','ov-intro','ov-treino','ov-pause','ov-end','ov-shop','ov-falencia','ov-endless','ov-rank','ov-ver','ov-app','ov-abertura','ov-conversa','ov-continua'];
function showOnly(ids){
  SCREENS.forEach(id => { const el = $(id); if (!el) return; if (ids.indexOf(id) >= 0) el.classList.add('show'); else el.classList.remove('show'); });
}
function clearEl(el){ while (el.firstChild) el.removeChild(el.firstChild); }
function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function starsHtml(box, n, total){
  clearEl(box);
  for (let i=0;i<total;i++){ box.appendChild(el('span', i < n ? 'on' : 'off', '★')); }
}

/* ---------- escala / DPR ---------- */
function fit(){
  const vw = window.innerWidth || 960, vh = window.innerHeight || 600;
  const s = Math.max(0.2, Math.min(vw / TW, vh / H));   // tela larga (v7.6)
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  // numa tela mais estreita que a do jogo (~2:1), o jogo encolhe; o palco ganha a altura que teria com a tela de antes
  // (960 de largura), para os painéis (menu, lojinha) não ficarem apertados, e o jogo fica no meio dele
  const sh = Math.max(H*s, Math.min(vh, H * Math.min(vw / W, vh / H)));
  stage.style.width = Math.floor(TW*s) + 'px';
  stage.style.height = Math.floor(sh) + 'px';
  stage.style.setProperty('--u', s + 'px');
  canvas.style.height = Math.floor(H*s) + 'px';
  canvas.style.marginTop = Math.floor((sh - H*s) / 2) + 'px';
  canvas.width = Math.round(TW*s*dpr);
  canvas.height = Math.round(H*s*dpr);
}

/* ---------- menu (v8.3): a carreira é uma campanha; "Continuar" abre o próximo dia ---------- */
let resetPede = false;   // "Recomeçar do zero": o 1º toque pede confirmação
function buildMenu(){
  manualBolinha();
  const sv = game.save, n = game.proxDia, novo = n <= 1 && !sv.caixa.length;
  // v8.7: a carreira é a História ("História · cap. 2, A Dani chega · dia 5"; fim dos capítulos: "Garagem completa")
  const capC = HISTORIA[sv.cap - 1];
  $('menu-dia').textContent = sv.fechou ? 'História: o banco fechou no dia ' + sv.fechou : novo ? 'História' : 'História · ' + (capC && capC.ponto === sv.salao.ponto ? 'cap. ' + capC.cap + ', ' + capC.titulo : ({ industrial:'área industrial completa', avenida:'Avenida Brasil completa', terraco:'Terraço Suíça completo' })[(HISTORIA[Math.min(sv.cap, HISTORIA.length + 1) - 2] || {}).ponto] || 'Garagem completa') + ' · dia ' + n;   // v9.1: o ponto do último capítulo feito
  const info = [];
  if (sv.fechou) info.push('O banco tomou a lanchonete por falta de pagamento.', sv.estrelas + ' ★', 'lucro acumulado ' + fmt(sv.lucroTot));   // v8.3.1
  else if (novo) info.push('A Bia vai abrir a lanchonete na garagem da mãe.' + (treinoPrimeiro() ? ' Primeira vez? Comece pela Missão zero, um treino passo a passo.' : ''));
  else {
    info.push((sv.bank < 0 ? 'Caixa no negativo: ' : 'Caixa: ') + fmt(sv.bank), sv.estrelas + ' ★', 'lucro acumulado ' + fmt(sv.lucroTot));
    if (sv.emp.resto) info.push('banco: faltam ' + fmt(sv.emp.resto));
  }
  $('menu-info').textContent = info.join(' · ');
  // v8.6.9: o aviso de uma vez só para quem tinha campanha antes do cardápio que cresce (save.avisoCard, apagado ao fechar)
  $('menu-aviso').style.display = sv.avisoCard || sv.avisoHist ? '' : 'none';
  $('menu-aviso-txt').textContent = sv.avisoHist ? 'Novidade: a campanha virou o Modo História, com a dívida da reforma da garagem. Por isso, recomeçou do dia 1.' : 'Novidade: o cardápio agora cresce com os cursos do Tonhão. Por isso, a campanha recomeçou do dia 1.';
  $('btn-play').textContent = sv.fechou ? 'Recomeçar do zero' : novo ? 'Começar o dia 1' : 'Continuar: dia ' + n;
  $('btn-play').className = 'btn ' + (treinoPrimeiro() ? 'alt' : 'go');
  $('btn-treino').className = 'btn ' + (treinoPrimeiro() ? 'go' : 'alt');
  resetPede = false; $('btn-reset').textContent = 'Recomeçar do zero';
  $('btn-reset').style.display = novo || sv.fechou ? 'none' : '';   // nada a apagar ainda (ou o botão principal já recomeça)
  buildChips();
}
/* modo dev: os dias à escolha (o save dev pula para o dia tocado) */
function buildChips(){
  const box = $('daychips');
  clearEl(box);
  box.style.display = DEV.on ? '' : 'none';
  if (!DEV.on) return;
  for (let i=1;i<=10;i++){
    const b = el('button', 'chip', String(i));
    b.type = 'button';
    b.setAttribute('aria-label', 'Dia ' + i);
    b.setAttribute('aria-pressed', i === game.proxDia ? 'true' : 'false');
    b.addEventListener('click', () => { game.save.dia = i; writeSave(game.save); Sfx.init(); Sfx.tap(); buildMenu(); });
    box.appendChild(b);
  }
}

/* ---------- modo dev: "Modo dev" no selo da versão e no alto da tela, e o link de sair ---------- */
function devSync(){
  const t = $('vtag'), b = $('devbadge'), o = $('btn-dev-off');
  if (t){ t.textContent = VERSAO + (DEV.on ? ' · dev' : ''); t.classList[DEV.on ? 'add' : 'remove']('dev'); }
  if (b) b.style.display = DEV.on ? '' : 'none';
  if (o) o.style.display = DEV.on ? '' : 'none';
}

/* ---------- v9.2.1: painel do modo dev (#ov-dev; liga e desliga só ele, por cima das outras telas) ---------- */
function abrirDev(){
  if (!DEV.on) return;
  if (game.state === 'playing') game.pause();
  buildDev(); $('ov-dev').classList.add('show');
}
function fecharDev(){
  $('ov-dev').classList.remove('show');
  if (game.state === 'menu') buildMenu(); else if (game.state === 'shop') buildShop();
}
/* v10.2.1: o painel em abas. Os dois jeitos (Livre: tudo de graça e sem História; De verdade: preços, travas e o Modo História) ficam no alto,
   depois a linha "Agora" e as abas (DEV.aba, só na memória) */
const DEV_ABAS = [['pular', 'Pular'], ['historia', 'História'], ['hoje', 'Hoje'], ['dinheiro', 'Dinheiro'], ['equipe', 'Equipe e lojinha']];
function buildDev(){
  const body = $('dev-body'); clearEl(body);
  const sv = game.save, nota = v => (Math.round(v * 10) / 10).toString().replace('.', ',');
  const botao = (r, txt, fn, premido) => {
    const b = el('button', 'btn alt', txt); b.type = 'button';
    if (premido != null) b.setAttribute('aria-pressed', premido ? 'true' : 'false');
    b.addEventListener('click', () => { Sfx.init(); Sfx.tap(); fn(); buildDev(); });
    r.appendChild(b); return b;
  };
  const secao = (titulo, agora) => {
    body.appendChild(el('div', 'lbl', titulo));
    if (agora) body.appendChild(el('div', 'dev-now', agora));
    const r = el('div', 'row'); body.appendChild(r); return r;
  };
  const dia = game.state === 'shop' ? game.shopNext : game.proxDia;
  // os dois jeitos
  let r = el('div', 'row'); r.id = 'dev-jeitos'; body.appendChild(r);
  botao(r, 'Livre', () => game.devReal(false), !DEV.real);
  botao(r, 'De verdade', () => game.devReal(true), DEV.real);
  const cap = sv.cap > HISTORIA.length ? 'Fim' : sv.cap;
  body.appendChild(el('div', 'dev-now', 'Dia ' + dia + ' · ' + game.ponto.nome + (DEV.real ? ' · Capítulo ' + cap + ' · ' + fmt(sv.bank) : '')));
  // as abas
  const abas = el('div', 'seg'); abas.id = 'dev-abas'; abas.setAttribute('role', 'group'); abas.setAttribute('aria-label', 'Painel do dev'); body.appendChild(abas);
  DEV_ABAS.forEach(a => {
    const b = el('button', null, a[1]); b.type = 'button'; b.setAttribute('data-v', a[0]);
    b.setAttribute('aria-pressed', a[0] === DEV.aba ? 'true' : 'false');
    b.addEventListener('click', () => { Sfx.init(); Sfx.tap(); DEV.aba = a[0]; buildDev(); });
    abas.appendChild(b);
  });
  if (DEV.aba === 'dinheiro') devAbaDinheiro(body, secao, botao);
  else if (DEV.aba === 'historia') devAbaHistoria(body, secao, botao);
  else if (DEV.aba === 'hoje') devAbaHoje(body, secao, botao);
  else if (DEV.aba === 'equipe') devAbaEquipe(body, secao, botao, nota);
  else devAbaPular(body, secao, botao, dia);
}
function devAbaPular(body, secao, botao, dia){
  const sv = game.save, emDia = (game.state === 'paused' || game.state === 'playing') && game.mode === 'carreira';
  let r = secao('Capítulo', 'Pula para o começo do capítulo (liga o De verdade)');
  for (let n = 1; n <= HISTORIA.length + 1; n++){
    const b = botao(r, n > HISTORIA.length ? 'Fim' : String(n), () => {
      if (!game.devCapitulo(n)) return;
      if (game.state !== 'menu') game.setState('menu');
      fecharDev(); fluxoHistoria(() => game.goShop(game.proxDia));
    }, sv.cap === n && DEV.real);
    b.setAttribute('aria-label', n > HISTORIA.length ? 'Capítulo: o Fim' : 'Capítulo ' + n);
  }
  if (lsGet(LS.devBak)) botao(r, 'Desfazer o pulo', () => { game.devDesfaz(); });
  r = secao('Dia', 'Dia ' + dia + ' · dia no ponto: ' + diaNoPonto(sv, dia));
  [[-10, '−10'], [-1, '−1'], [1, '+1'], [10, '+10']].forEach(([d, t]) => botao(r, t, () => game.devDia(dia + d)));
  r = secao('Ponto');
  PONTOS.forEach(p => botao(r, p.nome, () => game.devPonto(p.id), p.id === game.ponto.id));
  if (emDia){
    r = secao('No dia', 'Velocidade ' + DEV.vel + '×');
    [1, 2, 4, 8].forEach(v => botao(r, 'Velocidade ' + v + '×', () => { DEV.vel = v; }, DEV.vel === v));
    const b = botao(r, 'Encerrar o dia agora', () => {}, null);
    b.addEventListener('click', () => { if (game.devFimDia()) fecharDev(); });
  }
}
/* v10.2.2: a aba História (só no De verdade): cumprir o objetivo, assistir a qualquer cena, revelar o Manual e a lojinha, soltar as conversas */
function devAbaHistoria(body, secao, botao){
  const sv = game.save;
  let r;
  if (!DEV.real){
    r = secao('História', 'A História só corre no jeito De verdade.');
    botao(r, 'Passar para De verdade', () => game.devReal(true));
    return;
  }
  r = secao('Objetivo', sv.cap > HISTORIA.length ? 'Os capítulos acabaram.' : game.capLinha());
  if (sv.cap <= HISTORIA.length) botao(r, 'Cumprir o objetivo agora', () => {
    if (!game.devCumpre()) return;
    if (game.state === 'playing' || game.state === 'paused'){ fecharDev(); return; }   // o fim do dia traz a conversa
    if (game.state !== 'menu') game.setState('menu');
    fecharDev(); fluxoHistoria(() => game.goShop(game.proxDia));
  });
  r = secao('Assistir', 'Toca a cena sem mudar o jogo');
  const sel = el('select'); sel.id = 'dev-cenas'; sel.setAttribute('aria-label', 'Cena para assistir');
  devCenas().forEach((c, i) => { const o = el('option', null, c.rot); o.value = String(i); sel.appendChild(o); });
  sel.value = String(DEV.cena || 0); sel.addEventListener('change', () => { DEV.cena = +sel.value; });
  r.appendChild(sel);
  const b = botao(r, 'Assistir', () => {}, null); b.id = 'dev-assistir';
  b.addEventListener('click', () => { devAssistir(+sel.value || 0); });
  r = secao('Manual');
  botao(r, 'Manual: todas as fichas', () => game.devManual(true)); botao(r, 'Manual: só o básico', () => game.devManual(false));
  r = secao('Lojinha');
  botao(r, 'Lojinha: todos os cartões', () => game.devLojinha(true)); botao(r, 'Lojinha: como no começo do capítulo', () => game.devLojinha(false));
  r = secao('Conversas soltas');
  botao(r, 'Marcar todas como vistas', () => game.devConversas('vistas')); botao(r, 'Deixar pendentes as do dia', () => game.devConversas('pend'));
}
/* v10.2.2: a aba Hoje: força o imprevisto do próximo dia que começar (DEV.forca, só na memória) */
const DEV_HOJE = [
  ['clima', 'Clima', [['', 'Sorteio'], ['sem', 'Sem clima'], ['chuva', 'Chuva'], ['feriado', 'Feriado']]],
  ['evento', 'Evento de bairro', [['', 'Sorteio'], ['nada', 'Nenhum'], ['junina', 'Festa junina'], ['jogo', 'Jogo do Brasil']]],   // v10.6
  ['quebra', 'Quebra', [['', 'Sorteio'], ['nada', 'Nada quebra'], ['fogao', 'Fogão'], ['geladeira', 'Geladeira'], ['cafeteira', 'Cafeteira']]],
  ['fiscal', 'Fiscal (Avenida em diante)', [['', 'Sorteio'], ['vem', 'Vem'], ['nao', 'Não vem']]],
  ['gripe', 'Tonhão gripado', [['', 'Sorteio'], ['gripado', 'Gripado'], ['bem', 'Bem']]],
  ['vip', 'VIP', [['', 'Sorteio'], ['vem', 'Vem um VIP']]],
  ['apito', 'Apito da fábrica (área industrial)', [['', 'Sorteio'], ['apita', 'Apita'], ['nao', 'Não apita']]],
  ['vontade', 'Vontade de doce e de espresso (sem o curso)', [['', 'Normal'], ['todos', 'Todos pedem']]],   // v10.5.3
  ['rosa', 'Pétala (molho da Rosa)', [['', 'Normal'], ['sempre', 'Sempre']]]   // v10.8: o prato da casa da Bia sempre sai com pétala, em qualquer ponto
];
const DEV_MUSICA = ['sem música', 'trio de cordas', 'pianista'];
function devAbaHoje(body, secao, botao){
  DEV_HOJE.forEach(([k, titulo, ops]) => {
    const r = secao(titulo);
    ops.forEach(([v, t]) => botao(r, t, () => game.devForca(k, v), (DEV.forca[k] || '') === v));
  });
  { const f = luxoForca(), r = secao('Luxo (VIPs, exigentes na Avenida e Ambiente)', 'Agora: ' + (f >= 0 ? 'forçado no nível ' + f : 'normal, nível ' + luxoNivel(game)));   // v10.7
    botao(r, 'normal', () => game.devLuxo(null), f < 0);
    [0, 1, 2, 3, 4, 5].forEach(n => botao(r, String(n), () => game.devLuxo(n), f === n)); }
  if (musicaOk(game.ponto)) botao(secao('Música (Terraço)', 'Agora: ' + DEV_MUSICA[game.save.equipe.musica || 0]), 'Música: trocar', () => game.devMusica());   // v10.4: sem música → trioo → pianista
  if ((game.state === 'paused' || game.state === 'playing') && game.mode === 'carreira'){
    let r = secao('No dia', 'Velocidade ' + DEV.vel + '×');
    [1, 2, 4, 8].forEach(v => botao(r, 'Velocidade ' + v + '×', () => { DEV.vel = v; }, DEV.vel === v));
    const b = botao(r, 'Encerrar o dia agora', () => {}, null);
    b.addEventListener('click', () => { if (game.devFimDia()) fecharDev(); });
    r = secao('Quebrar agora');
    [['fogao', 'Fogão'], ['geladeira', 'Geladeira'], ['cafeteira', 'Cafeteira']].forEach(([id, t]) => botao(r, t, () => game.devQuebraAgora(id)));
  }
}
function devAbaDinheiro(body, secao, botao){
  const sv = game.save;
  let r;
  if (!DEV.real){
    r = secao('Dinheiro', 'No jeito Livre, o dinheiro não acaba.');
    botao(r, 'Passar para De verdade', () => game.devReal(true));
    return;
  }
  r = secao('Caixa', 'Caixa: ' + fmt(sv.bank));
  [[100, '+100'], [1000, '+1.000'], [10000, '+10.000'], [-1000, '−1.000']].forEach(([v, t]) => botao(r, t, () => game.devDinheiro(v)));
  botao(r, 'Zerar', () => game.devDinheiro(-sv.bank));
  const e = sv.emp;
  r = secao('Banco', e.resto ? 'Falta ' + fmt(e.resto) + ' · parcela ' + fmt(parcelaDe(e, sv.dia)) + (e.atr ? ' (atrasada)' : '') : 'Sem empréstimo');
  botao(r, 'Quitar', () => game.devBanco('quitar'));
  botao(r, 'Pegar ' + fmt(1000), () => game.devBanco('pegar'));
  botao(r, 'Atrasar a parcela', () => game.devBanco('atrasar'));
}
function devAbaEquipe(body, secao, botao, nota){
  const sv = game.save, eq = sv.equipe;
  let r = secao('Equipe, cursos e melhorias');
  botao(r, 'Tudo no máximo', () => { game.devEquipe('max'); game.devMelhorias(true); });
  botao(r, 'Do começo', () => { game.devEquipe('zero'); game.devMelhorias(false); });
  r = secao('Pessoas');
  [['tonhao', 'Tonhão', 1], ['dani', 'Dani', 0], ['joca', 'Joca', 0], ['cami', 'Cami', 0], ['anselmo', 'Anselmo', 0], ['lia', 'Lia', 0]].forEach(([q, nome, mais]) => {
    const l = el('div', 'dev-pessoa'); body.appendChild(l);
    l.appendChild(el('span', 'dev-nome', nome + ': nível ' + (eq[q] + mais)));
    const b1 = botao(l, '−', () => game.devNivel(q, -1)); b1.setAttribute('aria-label', nome + ': baixar um nível');
    const b2 = botao(l, '+', () => game.devNivel(q, 1)); b2.setAttribute('aria-label', nome + ': subir um nível');
  });
  r = secao('Cursos');
  botao(r, 'Todos', () => game.devCursos(true)); botao(r, 'Nenhum', () => game.devCursos(false));
  r = secao('Melhorias');
  botao(r, 'Todas', () => game.devMelhorias(true)); botao(r, 'Nenhuma', () => game.devMelhorias(false));
  r = secao('Decoração');
  botao(r, 'Toda', () => game.devDecor(true)); botao(r, 'Nenhuma', () => game.devDecor(false));
  r = secao('Luxo');   // v10.7
  botao(r, 'Tudo do luxo', () => game.devLuxoTudo());
  r = secao('Manutenção');
  botao(r, 'Tudo novo', () => game.devManut(1)); botao(r, 'Tudo gasto', () => game.devManut(0.2));
  const ng = game.notaGurugol;
  r = secao('Nota do Gurugol', 'Agora: ' + (ng != null ? nota(ng) + ' ★' : 'sem nota'));
  [2, 2.7, 3.4, 4].forEach(v => botao(r, nota(v), () => game.devNota(v)));
  botao(r, 'Teto', () => game.devNota(avalTeto(game.ponto)));
  botao(r, 'Limpar', () => game.devNota(0));
}

/* ---------- Manual (v9.6.7): o bestiário do jogo; as fichas se revelam com a história ---------- */
function tipCanvas(draw){
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 128;
  const c = cv.getContext('2d');
  c.scale(2,2);
  c.lineJoin = 'round'; c.lineCap = 'round';
  draw(c);
  return cv;
}
/* os desenhos das fichas do Básico (eram as dicas do antigo Como jogar) */
const DES_BASICO = {
  'b-sentar': c => {
    drawPerson(c,{skin:3,hair:3,hairC:'#1B1512',pants:'#2F3E5C'},12,52,{shirt:CHAIRS[1].c,mood:0,s:0.8});
    c.strokeStyle = PAL.alerta; c.lineWidth = 3; c.setLineDash([4,4]); c.beginPath(); c.moveTo(22,40); c.lineTo(40,30); c.stroke(); c.setLineDash([]);
    c.beginPath(); c.moveTo(42,28); c.lineTo(35,28); c.lineTo(40,35); c.closePath(); c.fillStyle = PAL.alerta; c.fill();
    c.save(); c.translate(51,44); c.scale(0.5,0.5); drawChair(c,0,0,1,false,true); c.restore();
    rr(c,38,32,26,13,2); fs(c,'#F7F4EB',2);
  },
  'b-mesa': c => {
    drawIcon(c,'ticket',12,16,0.7); drawIcon(c,'hat',30,16,0.7); drawIcon(c,'dish',48,16,0.7,'coxinha');
    drawIcon(c,'coin',16,46,0.7); drawIcon(c,'dirty',34,46,0.7); drawIcon(c,'drop',52,46,0.7);
  },
  'b-coracoes': c => {
    for (let i=0;i<5;i++) heart(c,10+i*11,20,5,i<3?'#E5384A':'rgba(255,255,255,.55)', i<3?PAL.tinta:'rgba(34,32,28,.45)');
    drawPerson(c,{skin:1,hair:1,hairC:'#5B3A21',pants:'#4A4036'},20,58,{shirt:CHAIRS[3].c,mood:0,s:0.6});
    drawPerson(c,{skin:4,hair:0,hairC:'#1B1512',pants:'#4A4036'},44,58,{shirt:CHAIRS[0].c,mood:2,s:0.6});
  },
  'b-cores': c => {
    drawChair(c,18,34,1,false,true);
    drawPerson(c,{skin:2,hair:5,hairC:'#2F1D12',pants:'#2F3E5C'},18,54,{shirt:CHAIRS[1].c,mood:0,s:0.7,sit:true});
    txt(c,'×3!',46,22,18,PAL.alerta,'center',FD,3);
    star(c,46,46,9,PAL.mostarda);
  },
  'b-meta': c => {
    rr(c,8,12,30,40,3); fs(c,'#fff',2);
    for (let i=0;i<4;i++){ c.fillStyle = PAL.cromoEsc; c.fillRect(13,19+i*7,14,2.4); c.fillRect(30,19+i*7,4,2.4); }
    c.strokeStyle = PAL.perigo; c.lineWidth = 2.4; c.beginPath(); c.moveTo(13,47); c.lineTo(34,47); c.stroke();
    drawIcon(c,'coin',48,40,0.8);
  },
  'b-lojinha': c => {
    rr(c,10,12,44,28,6); fs(c,PAL.cromo,1.8); txt(c,'!',32,35,22,PAL.perigo,'center',FD);
    rr(c,16,44,32,10,3); fs(c,PAL.ok,1.4);
  },
  'b-historia': c => { c.translate(32,34); c.scale(1.4,1.4); drawBanco(c); },
  'b-louca': c => { drawIcon(c,'dirty',18,24,0.8); drawIcon(c,'drop',46,22,0.7); drawIcon(c,'trash',32,48,0.8); },
  'b-suco': c => {
    ell(c,32,50,22,6); fs(c,PAL.inox,2);
    drawIcon(c,'juice',20,38,0.8); drawIcon(c,'juice',32,36,0.8); drawIcon(c,'juice',44,38,0.8);
    drawIcon(c,'coffee',32,16,0.7);
  },
  'b-marmita': c => {
    drawMarmita(c,'pf',22,22,1.2);
    rr(c,30,38,30,18,3); fs(c,PAL.madeira,1.8); rr(c,34,42,16,8,2); fs(c,EFOOD_COR,1.2);
    drawPerson(c,{skin:2,hair:0,hairC:'#1B1512',pants:'#2F3E5C',acc:'helmet'},16,60,{shirt:CHAIRS[0].c,mood:0,s:0.55});
  },
  'b-gurugol': c => {
    for (let i=0;i<5;i++) star(c,8 + i*12,22,5.5,i < 3 ? PAL.mostarda : '#d8cfb8');
    txt(c,'★',32,48,18,PAL.tinta,'center',FD);
  },
  /* os lugares e os imprevistos que não têm ícone na lojinha */
  'p-garagem': c => {   // uma casinha simples, com o portão da garagem
    c.beginPath(); c.moveTo(10,30); c.lineTo(32,12); c.lineTo(54,30); c.closePath(); fs(c,PAL.formica,2);
    rr(c,14,30,36,26,2); fs(c,'#F1E6C8',2);
    rr(c,20,38,24,18,1.5); fs(c,PAL.cromo,1.6);
    c.strokeStyle = PAL.cromoEsc; c.lineWidth = 1.2; for (let y=42;y<=54;y+=4){ c.beginPath(); c.moveTo(20,y); c.lineTo(44,y); c.stroke(); }
  },
  'i-quebra': c => {
    circ(c,32,32,20); fs(c,PAL.mostarda,2.4);
    c.save(); c.translate(32,32); c.rotate(-0.7);
    rr(c,-3,-4,6,22,2); fs(c,PAL.cromo,1.8);
    c.beginPath(); c.arc(0,-10,8,0.6,Math.PI*2-0.6+Math.PI,false); c.closePath(); fs(c,PAL.cromo,1.8);
    rr(c,-3,-19,6,8,1); c.fillStyle = PAL.mostarda; c.fill();
    c.restore();
  },
  'i-chuva': c => {
    [[22,30,9],[33,24,11],[44,31,9]].forEach(a => { circ(c,a[0],a[1],a[2]); c.strokeStyle = PAL.tinta; c.lineWidth = 5; c.stroke(); });
    [[22,30,9],[33,24,11],[44,31,9]].forEach(a => { circ(c,a[0],a[1],a[2]); c.fillStyle = '#CFD8E3'; c.fill(); });
    c.fillStyle = '#CFD8E3'; c.fillRect(22,30,22,9);
    c.strokeStyle = '#2F6FB5'; c.lineWidth = 2.6; c.lineCap = 'round';
    [[20,46,17,54],[32,46,29,54],[44,46,41,54]].forEach(l => { c.beginPath(); c.moveTo(l[0],l[1]); c.lineTo(l[2],l[3]); c.stroke(); });
  },
  'i-feriado': c => {
    c.strokeStyle = PAL.tinta; c.lineWidth = 1.8; c.beginPath(); c.moveTo(6,16); c.quadraticCurveTo(32,34,58,16); c.stroke();
    ['#E0523C','#F2C23D','#3C7BD9','#3E9B5A','#E0523C'].forEach((col,i) => {
      const x = 12 + i*10, y = 16 + Math.sin((x - 6) / 52 * Math.PI) * 11;
      c.beginPath(); c.moveTo(x-4,y); c.lineTo(x+4,y); c.lineTo(x,y+12); c.closePath(); fs(c,col,1.4);
    });
    star(c,32,50,7,PAL.mostarda);
  },
  'i-junina': c => {   // o fio de bandeirinhas juninas e uma espiga de milho
    c.strokeStyle = PAL.tinta; c.lineWidth = 1.8; c.beginPath(); c.moveTo(6,12); c.quadraticCurveTo(32,30,58,12); c.stroke();
    BAND_JUNINA.forEach((col,i) => {
      const x = 12 + i*10, y = 12 + Math.sin((x - 6) / 52 * Math.PI) * 9;
      c.beginPath(); c.moveTo(x-4,y); c.lineTo(x+4,y); c.lineTo(x,y+11); c.closePath(); fs(c,col,1.4);
    });
    c.save(); c.translate(32,46); c.scale(1.1,1.1); drawJunino(c,'milho'); c.restore();
  },
  'i-jogo': c => {   // a bola no campo
    rr(c,6,38,52,18,4); fs(c,'#3E9B4F',2); c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(32,38); c.lineTo(32,56); c.stroke();
    circ(c,32,26,15); fs(c,'#fff',2.2);
    c.fillStyle = PAL.tinta; c.beginPath(); for (let i=0;i<5;i++){ const a = -Math.PI/2 + i*Math.PI*2/5; i ? c.lineTo(32 + Math.cos(a)*6,26 + Math.sin(a)*6) : c.moveTo(32 + Math.cos(a)*6,26 + Math.sin(a)*6); } c.closePath(); c.fill();
    c.strokeStyle = PAL.tinta; c.lineWidth = 1.2; for (let i=0;i<5;i++){ const a = -Math.PI/2 + i*Math.PI*2/5; c.beginPath(); c.moveTo(32 + Math.cos(a)*6,26 + Math.sin(a)*6); c.lineTo(32 + Math.cos(a)*14.4,26 + Math.sin(a)*14.4); c.stroke(); }
  },
  'i-gripe': c => {   // termômetro
    rr(c,28,8,8,34,4); fs(c,'#fff',2); circ(c,32,48,9); fs(c,PAL.perigo,2);
    c.fillStyle = PAL.perigo; c.fillRect(30.5,20,3,26);
    c.strokeStyle = PAL.tinta; c.lineWidth = 1.2; for (let y=14;y<=34;y+=5){ c.beginPath(); c.moveTo(36,y); c.lineTo(40,y); c.stroke(); }
  },
  'i-apito': c => {   // apito com as ondinhas de som
    circ(c,28,36,13); fs(c,PAL.inox,2); circ(c,28,36,4.5); fs(c,PAL.tinta,1.4);
    rr(c,34,24,22,9,3); fs(c,PAL.inox,2);
    c.strokeStyle = PAL.alerta; c.lineWidth = 2.4; c.lineCap = 'round';
    [8,13].forEach(r => { c.beginPath(); c.arc(20,18,r,Math.PI*1.1,Math.PI*1.6); c.stroke(); });
  },
  'i-fiscal': c => {   // prancheta com o visto
    rr(c,14,10,36,46,4); fs(c,PAL.madeira,2); rr(c,19,16,26,36,2); fs(c,'#fff',1.6); rr(c,25,7,14,8,3); fs(c,PAL.cromo,1.6);
    c.strokeStyle = PAL.cromoEsc; c.lineWidth = 1.4; [26,33].forEach(y => { c.beginPath(); c.moveTo(23,y); c.lineTo(41,y); c.stroke(); });
    c.strokeStyle = PAL.ok; c.lineWidth = 3.2; c.beginPath(); c.moveTo(23,43); c.lineTo(28,48); c.lineTo(38,37); c.stroke();
  }
};
/* o ícone da lojinha de cada ficha `l-` (o da Água da torneira e do assento segue o ponto) */
const MANUAL_ICO = { 'l-tenis':'tenis', 'l-corrida':'corrida', 'l-cafeteira':'cafeteira', 'l-bandeja':'bandeja', 'l-sudoku':'sudoku', 'l-ventilador':'ventilador', 'l-triturador':'triturador', 'l-pratos':'pratos', 'l-louca':'louca',
  'l-tvsom':'ambiente', 'l-tvs':'tvs', 'l-couvert':'couvert', 'l-musica':'musica', 'l-fogao':'fogao-ind', 'l-cardapio':'cardapio', 'l-barraca':'barraca', 'l-salao':'g-salao', 'l-luxo':'luxo', 'l-manut':'m-fogao', 'l-divulga':'div-redes', 'l-banco':'banco', 'l-mudanca':'mudanca', 'l-caixa':'contas',
  'p-industrial':'mudanca', 'p-avenida':'mudanca-av', 'p-terraco':'mudanca-te' };
function manualIcone(f){
  const nv = game.ponto.nivel;
  if (f.id === 'l-maquina') return nv >= 3 ? 'aguas' : nv === 2 ? 'jarra' : 'maquina';
  if (f.id === 'l-assento') return nv === 4 ? 'poltronas' : nv === 3 ? 'sofas' : 'assento';
  if (f.id.indexOf('e-') === 0) return f.quem;
  return MANUAL_ICO[f.id] || null;
}
function manualNome(f){ return f.id === 'l-maquina' ? upgradeDe(UPGRADES.find(u => u.id === 'maquina'), game.ponto).name : f.nome; }
/* o retrato de um cliente: as pessoas do tipo (makePeople) com o sorteio trocado por uma semente, para ser sempre o mesmo */
function manualSementeDe(id){ let h = 7; for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0; return h; }
function manualCliente(c, f){
  const t = f.tipo, antes = Math.random;
  Math.random = semente(manualSementeDe(f.id));
  try {
    if (t === 'vip'){
      drawPerson(c,{skin:4,hair:3,hairC:'#1B1512',pants:'#2F3E5C',shades:true},28,60,{shirt:CHAIRS[2].c,mood:0,s:0.85});
      drawVipBadge(c,40,14,0);
    } else if (t === 'exigente'){   // v10.1
      drawPerson(c,{skin:3,hair:2,hairC:'#2A1D17',pants:'#2F3E5C',chapeu:true,accC:'#2F5F8A'},28,60,{shirt:CHAIRS[1].c,mood:0,s:0.85});
      drawVipBadge(c,42,14,0,true);
    } else if (t === 'veg'){
      drawPerson(c,makePeople('estudante',1)[0],22,60,{shirt:CHAIRS[3].c,mood:0,s:0.72});
      drawDish(c,'pfVeg',46,42,0.8);
    } else {
      const T = CUSTOMER_TYPES[t], n = T.retira ? 1 : T.size[0], ps = makePeople(t, n);
      const s = n === 1 ? 0.84 : n === 2 ? 0.66 : 0.52, sp = n === 2 ? 22 : 17;
      ps.forEach((p, i) => drawPerson(c,p,32 + (i - (ps.length - 1) / 2) * sp,n === 1 ? 61 : n === 2 ? 58 : 55,{shirt:CHAIRS[(i + 1) % 4].c,mood:0,s}));
    }
  } finally { Math.random = antes; }
}
function manualCanvas(f, aberta){
  const cv = tipCanvas(c => {
    if (DES_BASICO[f.id]) return DES_BASICO[f.id](c);
    if (f.id.indexOf('c-') === 0) return manualCliente(c, f);
    const ico = manualIcone(f);
    if (ico) c.drawImage(upgradeIcon(ico), 0, 0, 64, 64);
  });
  cv.setAttribute('aria-hidden', 'true');
  if (!aberta){   // ficha trancada: só a silhueta
    const g = cv.getContext('2d');
    g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#3A3630'; g.fillRect(0,0,cv.width,cv.height); g.globalCompositeOperation = 'source-over';
  }
  return cv;
}
function manualAberta(id){ return game.manualAberta(id); }
/* a bolinha "novo" nos 3 botões do Manual (menu, pausa e lojinha) enquanto houver ficha por ver */
function manualBolinha(){
  const sv = game.manualReal, n = !devLivre() && !!sv && (sv.manualNovo || []).length > 0;
  ['btn-manual', 'btn-pause-manual', 'btn-shop-manual'].forEach(id => { const b = $(id); if (b) b.classList[n ? 'add' : 'remove']('novo'); });
}
let manualAba = 'basico', manualVolta = 'menu', manualEls = {};
function manualTracosDe(f){
  if (f.tipo) return manualTracos(f.tipo, { aberta:manualAberta });
  if (f.quem) return manualTracos(f.quem, { save:game.manualReal });
  return [];
}
function buildManual(){
  const sv = game.manualReal, box = $('manual-grid'), abas = $('manual-abas');
  clearEl(box); clearEl(abas); manualEls = {};
  const temNovo = aba => !devLivre() && (sv.manualNovo || []).some(id => { const f = manualFicha(id); return f && f.aba === aba; });
  MANUAL_ABAS.forEach(a => {
    const b = el('button', null, a[1]); b.type = 'button'; b.setAttribute('data-v', a[0]);
    b.setAttribute('aria-pressed', a[0] === manualAba ? 'true' : 'false');
    if (a[0] !== manualAba && temNovo(a[0])) b.classList.add('novo');
    b.addEventListener('click', () => { Sfx.init(); Sfx.tap(); manualAba = a[0]; buildManual(); box.scrollTop = 0; });
    abas.appendChild(b);
  });
  const fichas = MANUAL.filter(f => f.aba === manualAba), novas = devLivre() ? [] : (sv.manualNovo || []).filter(id => fichas.some(f => f.id === id));
  fichas.forEach(f => {
    const ab = manualAberta(f.id), card = el('div', 'ficha' + (ab ? '' : ' trancada') + (novas.indexOf(f.id) >= 0 ? ' nova' : ''));
    card.setAttribute('data-id', f.id); card.setAttribute('role', 'listitem');
    card.appendChild(manualCanvas(f, ab));
    card.appendChild(el('b', null, ab ? manualNome(f) : '???'));
    card.appendChild(el('span', 'linha', ab ? f.linha : 'Aparece mais adiante na história.'));
    const tr = ab ? manualTracosDe(f) : [];
    if (tr.length){ const t = el('div', 'tracos'); tr.forEach(x => t.appendChild(el('i', 'tr', x))); card.appendChild(t); }
    box.appendChild(card); manualEls[f.id] = card;
  });
  game.manualVista(fichas.map(f => f.id));   // abrir a aba tira o "novo" das fichas dela
  manualBolinha();
}
/* abre o Manual na aba da ficha (rolando até ela e destacando por um instante); sem ficha, no Básico (ou na 1ª aba com ficha nova, fora da lojinha).
   volta: de onde veio ('menu', 'pause' ou 'shop'; o Voltar leva para lá) */
function abrirManual(fichaId, volta){
  manualVolta = volta || 'menu';
  const f = fichaId ? manualFicha(fichaId) : null, sv = game.manualReal;
  if (f) manualAba = f.aba;
  else {
    const nova = manualVolta === 'shop' || devLivre() ? null : (sv.manualNovo || []).map(manualFicha).find(x => x);
    manualAba = nova ? nova.aba : 'basico';
  }
  buildManual(); showOnly(['ov-manual']);
  const box = $('manual-grid'), card = f ? manualEls[f.id] : null;
  if (box && !card) box.scrollTop = 0;
  if (card){
    if (card.scrollIntoView) card.scrollIntoView({ block:'nearest' });
    card.classList.add('foco'); setTimeout(() => card.classList.remove('foco'), 1500);
  }
}
function fecharManual(){
  if (manualVolta === 'pause') showOnly(['ov-pause']);
  else if (manualVolta === 'shop'){ buildShop(); showOnly(['ov-shop']); }
  else { buildMenu(); showOnly(['ov-menu']); }
}

