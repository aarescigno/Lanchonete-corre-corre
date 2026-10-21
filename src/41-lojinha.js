/* ---------- Lojinha ---------- */
function upgradeIcon(id){
  return tipCanvas(c => {
    c.translate(32,32); c.scale(1.5,1.5);
    if (id === 'tenis'){
      c.beginPath(); c.moveTo(-14,6); c.lineTo(-14,-8); c.lineTo(-6,-10); c.lineTo(0,-2); c.lineTo(12,2); c.quadraticCurveTo(15,4,14,8); c.lineTo(-14,8); c.closePath(); fs(c,'#fff',2);
      c.fillStyle = PAL.formica; c.fillRect(-14,5,28,3); c.strokeStyle = PAL.faixa; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-3,-3); c.lineTo(1,-6); c.moveTo(1,0); c.lineTo(5,-3); c.stroke();
    } else if (id === 'corrida'){
      // tênis de corrida: perfil baixo e esticado, solado alto em gomos, cadarço e linhas de velocidade
      c.strokeStyle = PAL.faixa; c.lineWidth = 2; c.lineCap = 'round';
      [[-22,-4,-15],[-24,1,-16],[-21,6,-15]].forEach(l => { c.beginPath(); c.moveTo(l[0],l[1]); c.lineTo(l[2],l[1]); c.stroke(); });
      c.beginPath(); c.moveTo(-12,4); c.lineTo(-11,-6); c.quadraticCurveTo(-9,-9,-5,-8); c.lineTo(1,-3); c.quadraticCurveTo(9,-1,15,2); c.quadraticCurveTo(18,4,16,6); c.lineTo(-12,6); c.closePath(); fs(c,PAL.alerta,2);
      c.beginPath(); c.moveTo(-9,-1); c.quadraticCurveTo(0,-1,6,4); c.lineWidth = 2.2; c.strokeStyle = '#fff'; c.stroke();
      rr(c,-13,5,31,5,2.5); fs(c,'#fff',1.8);
      c.strokeStyle = PAL.tinta; c.lineWidth = 1; for (let x=-8;x<=12;x+=5){ c.beginPath(); c.moveTo(x,6); c.lineTo(x-1,10); c.stroke(); }
      c.lineWidth = 1.4; c.beginPath(); c.moveTo(-3,-6); c.lineTo(0,-8); c.moveTo(0,-4); c.lineTo(3,-6); c.stroke();
    } else if (id === 'tonhao'){
      c.translate(0,4); rr(c,-13,-2,26,14,3); fs(c,'#555',2);
      for (let i=-1;i<=1;i++){ circ(c,i*8,-6,3.5); fs(c,PAL.alerta,1.4); }
      ctx2chef(c);
    } else if (id === 'dani'){
      drawPerson(c,DANI_LOOK,0,18,{ shirt:'#F7EFD8', mood:0, s:0.75 });
      c.beginPath(); c.moveTo(-6,-4); c.lineTo(6,-4); c.lineTo(8,9); c.lineTo(-8,9); c.closePath(); fs(c,'#7B4FB5',1.6);
    } else if (id === 'couvert'){
      c.rotate(-0.5); ell(c,0,4,10,8); fs(c,'#B5733A',2); circ(c,0,4,3); c.fillStyle = PAL.tinta; c.fill(); rr(c,8,1,20,4,1); fs(c,PAL.madeiraEsc,1.4); c.rotate(0.5);
      txt(c,'♪',-12,-12,14,PAL.faixa,'center',FB);
    } else if (id === 'ambiente'){
      drawTv(c,6,2,0,0.48); drawSom(c,-6,17,0,0.42); txt(c,'♪',-16,-12,12,PAL.faixa,'center',FB);
    } else if (id === 'maquina'){
      rr(c,-12,-16,24,30,4); fs(c,'#F2F2EE',2); rr(c,-8,-12,16,12,3); fs(c,'rgba(242,140,40,.75)',1.6);
      rr(c,-10,8,20,4,2); fs(c,PAL.cromo,1.2); drawIcon(c,'juice',15,6,0.55);
    } else if (id === 'div-boca'){
      drawPerson(c,{skin:2,hair:1,hairC:'#2F1D12',pants:'#4A4036'},-8,18,{ shirt:CHAIRS[1].c, mood:0, s:0.6 });
      drawPerson(c,{skin:4,hair:4,hairC:'#1B1512',pants:'#2F3E5C'},10,18,{ shirt:CHAIRS[3].c, mood:0, s:0.6 });
      txt(c,'…',1,-16,14,PAL.tinta,'center',FB);
    } else if (id === 'div-panfleto'){
      c.rotate(-0.15); rr(c,-11,-14,22,28,2); fs(c,'#fff',2);
      rr(c,-7,-10,14,7,2); fs(c,PAL.formica,1.2); for (let i=0;i<3;i++){ c.fillStyle = PAL.cromoEsc; c.fillRect(-7,1+i*4,14 - i*3,1.8); }
      c.rotate(0.15);
    } else if (id === 'div-redes'){
      rr(c,-10,-16,20,32,4); fs(c,PAL.tinta,2); rr(c,-7,-12,14,22,2); fs(c,'#E8F1FB',1);
      c.beginPath(); c.moveTo(0,4); c.bezierCurveTo(-7,-1,-4,-8,0,-4); c.bezierCurveTo(4,-8,7,-1,0,4); c.closePath(); c.fillStyle = PAL.perigo; c.fill();
      txt(c,'+',13,-14,13,PAL.ok,'center',FD);
    } else if (id === 'contas'){
      rr(c,-11,-15,22,30,2); fs(c,'#fff',2);
      for (let i=0;i<4;i++){ c.fillStyle = PAL.cromoEsc; c.fillRect(-7,-10+i*5,10,1.8); c.fillRect(5,-10+i*5,3,1.8); }
      c.strokeStyle = PAL.perigo; c.lineWidth = 2; c.beginPath(); c.moveTo(-7,11); c.lineTo(8,11); c.stroke();
    } else if (id === 'cafeteira'){
      drawIcon(c,'coffee',-8,0,0.8); drawIcon(c,'coffee',8,2,0.8);
    } else if (id === 'bandeja'){
      ell(c,0,6,17,5); fs(c,PAL.inox,2);
      drawIcon(c,'juice',-8,-4,0.55); drawIcon(c,'juice',0,-5,0.55); drawIcon(c,'coffee',9,-1,0.5);
    } else if (id === 'ventilador'){
      for (let i=0;i<4;i++){ c.save(); c.rotate(i*Math.PI/2 + 0.4); ell(c,0,-8,4.5,9); fs(c,i%2?PAL.cromo:'#e8edf1',1.8); c.restore(); }
      circ(c,0,0,3.5); fs(c,PAL.mostarda,1.8);
    } else {
      for (let i=0;i<5;i++){ ell(c,0,8-i*4,15,4.5); fs(c,i%2?'#f2f0e8':'#fff',1.8); }
      ell(c,0,-8,9,2.2); c.strokeStyle = PAL.cromo; c.lineWidth = 1.2; c.stroke();
    }
  });
}
let shopTab = 'melhorias';
function shopBtn(text, cls, enabled, fn){
  const b = el('button', cls || 'btn', text); b.type = 'button';
  if (!enabled) b.disabled = true;
  b.addEventListener('click', () => { Sfx.init(); if (fn()) buildShop(); else Sfx.boing(); });
  return b;
}
function staffCard(icon, title, desc){
  const card = el('div', 'item'); card.appendChild(icon); card.appendChild(el('b', null, title)); if (desc) card.appendChild(el('span', null, desc));
  return card;
}
/* quadro "agora → próximo nível": linhas [rótulo, agora, depois]; agora == null mostra só o depois */
function staffNext(title, rows){
  const box = el('div', 'next');
  box.appendChild(el('b', null, title));
  rows.forEach(r => {
    const line = el('span', null, r[0] + ': ');
    if (r[1] != null && r[2].indexOf(r[1]) !== 0){ line.appendChild(document.createTextNode(r[1] + ' → ')); line.appendChild(el('strong', null, r[2])); }
    else line.appendChild(r[1] == null ? el('strong', null, r[2]) : document.createTextNode(r[2] + ' (igual)'));
    box.appendChild(line);
  });
  return box;
}
function buildEquipe(grid){
  const eq = game.save.equipe, bank = game.save.bank, T = STAFF.tonhao.levels, D = STAFF.dani.levels, C = STAFF.couvert;
  const canPay = extra => payroll(eq) + extra <= bank;
  const pc = v => Math.round(v*100) + '%', sec = v => String(Math.round(v*10)/10).replace('.', ',') + ' s';
  // Tonhão
  const tRows = (a, b) => [
    ['Rapidez', a && (a.cook === 1 ? 'normal' : '+' + pc(1 - a.cook)), b.cook === 1 ? 'normal' : '+' + pc(1 - b.cook)],
    ['Caprichados ★', a && pc(a.crit), pc(b.crit)],
    ['Pia', a && (a.wash ? '1 pilha/' + a.wash + ' s' : 'não'), b.wash ? '1 pilha/' + b.wash + ' s' : 'não'],
    ['Diária', a && fmt(a.pay), fmt(b.pay)]];
  let c = staffCard(upgradeIcon('tonhao'), 'Tonhão · nível ' + (eq.tonhao + 1) + ' de 3', 'Prato caprichado ★ vale +1♥ e +' + fmt(CRIT.bonus) + '.');
  c.appendChild(eq.tonhao < 2 ? staffNext('Com o aumento (nível ' + (eq.tonhao + 2) + '):', tRows(T[eq.tonhao], T[eq.tonhao+1])) : staffNext('Nível máximo:', tRows(null, T[2])));
  let duo = el('div', 'duo');
  if (eq.tonhao < 2) duo.appendChild(shopBtn('Aumento', 'btn', canPay(T[eq.tonhao+1].pay - T[eq.tonhao].pay), () => game.setStaff('tonhao', eq.tonhao + 1)));
  if (eq.tonhao > 0) duo.appendChild(shopBtn('Reduzir', 'btn alt', true, () => game.setStaff('tonhao', eq.tonhao - 1)));
  c.appendChild(duo); grid.appendChild(c);
  // Dani: só mostra as tarefas que ela já pode exercer (e só depois de contratada)
  const lv = eq.dani, sp = D[lv] || D[1];
  const avail = DANI_TASKS.filter(t => daniTaskOk(t.id, game.up));
  const dRows = (a, b) => [
    ['Velocidade', a && pc(a.speed), pc(b.speed)],
    ['Lava 1 pilha', a && sec(WASH.perPile / a.speed), sec(WASH.perPile / b.speed)],
    ['Tarefas', a && String(a.tasks), String(b.tasks)],
    ['Diária', a && fmt(a.pay), fmt(b.pay)]];
  c = staffCard(upgradeIcon('dani'), lv ? 'Dani · nível ' + lv + ' de 3' : 'Dani (ajudante)',
    lv ? '' : 'Ajudante da Bia, mais lenta que ela (velocidade em % da dela). Tem 2 mãos: leva 2 itens por vez. Pode ' + avail.map(t => t.name.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' e $1') + '.');
  if (lv){
    const sel = eq.daniTasks.filter(id => daniTaskOk(id, game.up)).length;
    const tasks = el('div', 'tasks');
    avail.forEach(t => {
      const on = eq.daniTasks.indexOf(t.id) >= 0;
      const b = el('button', null, t.short); b.type = 'button'; b.title = t.name; b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!on && sel >= sp.tasks) b.disabled = true;
      b.addEventListener('click', () => { Sfx.tap(); game.toggleDaniTask(t.id); buildShop(); });
      tasks.appendChild(b);
    });
    c.appendChild(el('span', 'full', 'Tarefas (' + Math.min(sel, sp.tasks) + ' de ' + sp.tasks + '):'));
    c.appendChild(tasks);
  }
  c.appendChild(lv < 3 ? staffNext((lv ? 'Se promover (nível ' : 'Se contratar (nível ') + (lv + 1) + '):', dRows(D[lv], D[lv+1])) : staffNext('Nível máximo:', dRows(null, D[3])));
  duo = el('div', 'duo');
  if (lv < 3) duo.appendChild(shopBtn(lv ? 'Promover' : 'Contratar', 'btn', canPay(D[lv+1].pay - (lv ? D[lv].pay : 0)), () => game.setStaff('dani', lv + 1)));
  if (lv > 0) duo.appendChild(shopBtn('Dispensar', 'btn alt', true, () => game.setStaff('dani', 0)));
  c.appendChild(duo); grid.appendChild(c);
  // TV e som (v7.4.3): cada um liga e desliga à parte; o custo é a conta de luz do dia
  const TV = STAFF.tv, SOM = STAFF.som;
  c = staffCard(upgradeIcon('ambiente'), 'TV e som', 'Com a TV ligada, a paciência nas mesas cai ' + Math.round(TV.effect*100) + '% mais devagar; com o som, mais ' + Math.round(SOM.effect*100) + '%. O custo é a luz do dia.');
  [['tv', 'TV de tubo na Rede Esfera'], ['som', 'Som na rádio Velha Brasil FM']].forEach(a => {
    const on = eq[a[0]], b = el('button', 'toggle', (on ? 'Ligado: ' : 'Ligar: ') + a[1] + ' · ' + fmt(STAFF[a[0]].pay) + '/dia'); b.type = 'button';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (!on && !canPay(STAFF[a[0]].pay)) b.disabled = true;
    b.addEventListener('click', () => { Sfx.init(); if (!game.setStaff(a[0], !on)) Sfx.boing(); buildShop(); });
    c.appendChild(b);
  });
  grid.appendChild(c);
  // Couvert: só do nível 3 do salão em diante
  if (!couvertOk(game.ponto)) return;
  const ef = Math.round(couvertEffect(Object.assign({}, eq, { taxa:true })) * 100);
  c = staffCard(upgradeIcon('couvert'), 'Couvert artístico', 'Música ao vivo: a paciência nas mesas cai ' + Math.round(C.effect*100) + '% mais devagar. ' + fmt(C.pay) + '/dia.');
  const tg = el('button', 'toggle', 'Cobrar couvert: ' + fmt(C.fee) + ' por pessoa (efeito cai para ' + ef + '%)'); tg.type = 'button';
  tg.setAttribute('aria-pressed', eq.taxa ? 'true' : 'false');
  tg.addEventListener('click', () => { Sfx.tap(); eq.taxa = !eq.taxa; writeSave(game.save); buildShop(); });
  c.appendChild(tg);
  duo = el('div', 'duo');
  duo.appendChild(eq.couvert ? shopBtn('Dispensar', 'btn alt', true, () => game.setStaff('couvert', false)) : shopBtn('Contratar: ' + fmt(C.pay) + '/dia', 'btn', canPay(C.pay), () => game.setStaff('couvert', true)));
  c.appendChild(duo); grid.appendChild(c);
}
/* aba Salão (v7.4): o editor (o salão desenhado em escala, sem clientes) e a loja de móveis ao lado.
   Arrastar a mesa muda o lugar dela (encaixe na grade); tocar nela abre a cor das cadeiras, "virar mesa de 4" e "vender" */
const ED = { x:0, y:56, w:800, h:484, k:1.25 };  // pedaço do salão no editor (do pé da parede ao chão, até o balcão) e a resolução do canvas
let edDrag = null;
function edPt(cv, e){
  const r = cv.getBoundingClientRect(), w = r.width || ED.w, h = r.height || ED.h;
  return { x:ED.x + (e.clientX - r.left) * ED.w / w, y:ED.y + (e.clientY - r.top) * ED.h / h };
}
/* folga do dedo, como no salão do jogo (~14 px de tela) */
function edPad(cv, e){
  if (e.pointerType === 'mouse') return 0;
  return clamp(14 * ED.w / (cv.getBoundingClientRect().width || ED.w), 8, 32);
}
function edRect(m){ const hx = tableHalfW(m); return { x:m.x - hx - 10, y:m.y - 62, w:hx*2 + 20, h:132 }; }
function edHit(p, pad){
  let best = -1, bd = Infinity;
  game.save.salao.mesas.forEach((m, i) => { const d = rectDist(p.x, p.y, edRect(m)); if (d <= pad && d < bd){ bd = d; best = i; } });
  return best;
}
/* mesas como estão no editor: as do salão, com a arrastada no lugar provisório */
function edMesas(){
  const l = game.save.salao.mesas.slice();
  if (edDrag && edDrag.moved) l[edDrag.i] = Object.assign({}, l[edDrag.i], { x:edDrag.x, y:edDrag.y });
  return l;
}
function drawEditor(cv){
  const c = cv.getContext('2d');
  if (!c) return;
  c.setTransform(ED.k, 0, 0, ED.k, -ED.x * ED.k, -ED.y * ED.k);
  c.lineJoin = 'round'; c.lineCap = 'round';
  drawFloor(c, game); drawWall(c, game, 0); drawKitchen(c, game, 0);
  const a = game.ponto.area;
  c.save(); c.setLineDash([8,6]); c.strokeStyle = 'rgba(31,79,163,.5)'; c.lineWidth = 2; rr(c,a.x0,a.y0,a.x1-a.x0,a.y1-a.y0,10); c.stroke(); c.restore();
  const l = edMesas(), di = edDrag && edDrag.moved ? edDrag.i : -1;
  l.map((m, i) => i).sort((i, j) => (i === di) - (j === di)).forEach(i => {   // a mesa arrastada por cima das outras
    const m = l[i], t = new Table({ id:i + 1, cx:m.x, cy:m.y, seats:m.seats, color:m.c }), drag = i === di;
    t.open = true;
    drawTable(c, game, t, 0, true);
    if (drag || i === game.salaoSel){
      const bad = drag && !edDrag.ok, r = edRect(m);
      c.save(); c.strokeStyle = bad ? PAL.perigo : (drag ? PAL.ok : PAL.mostarda); c.lineWidth = 5; c.setLineDash(drag ? [10,6] : []);
      rr(c,r.x,r.y,r.w,r.h,14); c.stroke();
      if (bad){ c.fillStyle = 'rgba(194,54,43,.25)'; c.fill(); }
      c.restore();
    }
  });
}
/* botão do editor: o motivo da recusa (salaoMsg) aparece logo abaixo */
function edBtn(text, cls, enabled, fn){
  const b = el('button', cls, text); b.type = 'button';
  if (!enabled) b.disabled = true;
  b.addEventListener('click', () => { Sfx.init(); if (fn()) Sfx.tap(); else Sfx.boing(); buildShop(); });
  return b;
}
function edEvents(cv){
  cv.addEventListener('pointerdown', e => {
    Sfx.init(); e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch(err) {}
    const p = edPt(cv, e), pad = edPad(cv, e), i = edHit(p, pad);
    if (i < 0){ if (game.salaoSel >= 0 || game.salaoMsg){ game.salaoSel = -1; game.salaoMsg = ''; buildShop(); } return; }
    const m = game.save.salao.mesas[i];
    edDrag = { i, dx:m.x - p.x, dy:m.y - p.y, sx:p.x, sy:p.y, x:m.x, y:m.y, moved:false, ok:true, why:'', pad };
  });
  cv.addEventListener('pointermove', e => {
    const d = edDrag;
    if (!d) return;
    const p = edPt(cv, e);
    // no dedo, um tremidinho não vira arrasto
    if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) > Math.max(9, d.pad)){ d.moved = true; const pop = cv.parentNode && cv.parentNode.querySelector && cv.parentNode.querySelector('.ed-pop'); if (pop) pop.style.display = 'none'; }
    if (!d.moved) return;
    const x = clamp(snapG(p.x + d.dx), ED.x + 40, ED.x + ED.w - 40), y = clamp(snapG(p.y + d.dy), ED.y + 60, ED.y + ED.h - 40);
    if (x === d.x && y === d.y) return;
    d.x = x; d.y = y; d.why = salaoProblema(edMesas(), game.ponto); d.ok = !d.why;
    drawEditor(cv);
  });
  cv.addEventListener('pointerup', () => {
    const d = edDrag; edDrag = null;
    if (!d) return;
    if (d.moved){
      if (d.ok && game.moverMesa(d.i, d.x, d.y)) Sfx.tap();
      else { Sfx.boing(); game.salaoMsg = 'Aí não dá: ' + (d.why || game.salaoMsg).toLowerCase(); }
    } else { game.salaoSel = game.salaoSel === d.i ? -1 : d.i; game.salaoMsg = ''; Sfx.tap(); }
    buildShop();
  });
  cv.addEventListener('pointercancel', () => { edDrag = null; drawEditor(cv); });
  cv.addEventListener('contextmenu', e => e.preventDefault());
}
function buildSalao(grid){
  const p = game.ponto, mesas = game.save.salao.mesas, bank = game.save.bank, lug = salaoLugares(mesas), sel = game.salaoSel;
  const ed = el('div', 'ed'), box = el('div', 'ed-cv'), cv = el('canvas');
  cv.width = Math.round(ED.w * ED.k); cv.height = Math.round(ED.h * ED.k);
  cv.setAttribute('aria-label', 'Salão: arraste as mesas para mudar de lugar e toque numa mesa para ver as opções');
  box.appendChild(cv); edEvents(cv);
  // mesa escolhida: cor das cadeiras, virar mesa de 4 e vender (balãozinho em cima do salão)
  const m = mesas[sel];
  if (m){
    const up = m.y + 190 > ED.y + ED.h, pop = el('div', 'ed-pop' + (up ? ' up' : ''));
    pop.style.left = clamp((m.x - ED.x) / ED.w * 100, 18, 82) + '%';
    pop.style.top = ((up ? m.y - 66 : m.y + 72) - ED.y) / ED.h * 100 + '%';
    pop.appendChild(el('b', null, 'Mesa ' + (sel + 1) + ' · ' + m.seats + ' lugares'));
    // v7.4.3: a cor das cadeiras (de graça), em bolinhas com o nome da cor no rótulo
    const cores = el('div', 'ed-cores');
    cores.appendChild(el('span', null, 'Cadeiras:'));
    CHAIRS.forEach((ch, k) => {
      const b = edBtn(k === m.c ? '✓' : '', 'ed-cor', true, () => game.pintarMesa(sel, k));
      b.style.background = ch.c; b.title = 'Cadeiras na cor ' + ch.n;
      b.setAttribute('aria-label', 'Cadeiras na cor ' + ch.n); b.setAttribute('aria-pressed', k === m.c ? 'true' : 'false');
      cores.appendChild(b);
    });
    pop.appendChild(cores);
    if (m.seats === 2) pop.appendChild(edBtn('Virar mesa de 4: ' + fmt(SALAO.virar), 'btn', lug + 2 <= p.lugares && bank >= SALAO.virar, () => game.virarMesa(sel)));
    pop.appendChild(edBtn('Vender por ' + fmt(mesaPreco(m.seats) * SALAO.venda), 'btn alt', mesas.length > 1, () => game.venderMesa(sel)));
    const x = el('button', 'ed-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Fechar');
    x.addEventListener('click', () => { Sfx.tap(); game.salaoSel = -1; buildShop(); });
    pop.appendChild(x);
    box.appendChild(pop);
  }
  ed.appendChild(box);
  // loja de móveis e arrumação
  const side = el('div', 'ed-side');
  side.appendChild(el('b', 'ed-lug', 'Lugares ' + lug + ' de ' + p.lugares));
  side.appendChild(el('span', 'ed-ponto', p.nome + (p.aluguel ? ': aluguel ' + fmt(p.aluguel) + ' por dia.' : ': sem aluguel.')));
  side.appendChild(edBtn('Mesa de 2: ' + fmt(SALAO.mesa2), 'btn', lug + 2 <= p.lugares && bank >= SALAO.mesa2, () => game.buyMesa(2)));
  side.appendChild(edBtn('Mesa de 4: ' + fmt(SALAO.mesa4), 'btn', lug + 4 <= p.lugares && bank >= SALAO.mesa4, () => game.buyMesa(4)));
  side.appendChild(edBtn('Arrumação automática', 'btn alt', true, () => game.arrumarSalao()));
  side.appendChild(edBtn('Desfazer', 'btn alt', game.salaoUndo.length > 0, () => game.desfazerSalao()));
  side.appendChild(el('span', game.salaoMsg ? 'msg' : 'ed-dica', game.salaoMsg || (lug >= p.lugares ? 'O salão está no teto de ' + p.lugares + ' lugares.' : 'Arraste as mesas; toque numa para trocar a cor das cadeiras, virar mesa de 4 ou vender. Grupos de 3 ou 4 só sentam nas mesas de 4.')));
  side.appendChild(el('span', 'ed-contas', 'Luz e gás: ' + fmt(contasDia(game.tables, p)) + ' por dia (' + fmt(CONTAS.mesa) + ' por mesa e ' + fmt(CONTAS.lugar) + ' por lugar).'));
  const mov = Math.round((movimentoSalao(lug) - 1) * 100);
  side.appendChild(el('span', 'ed-contas', 'Cada lugar acima de ' + MOVIMENTO.kit + ' traz ' + Math.round(MOVIMENTO.porLugar * 100) + '% mais clientes' + (mov > 0 ? ' (hoje, +' + mov + '%).' : '.')));
  ed.appendChild(side);
  grid.appendChild(ed);
  drawEditor(cv);
}
/* aba Divulgação (v7): escolha do dia, paga junto com a folha ao abrir; e o resumo das contas do dia */
function buildDivulga(grid){
  const n = game.shopNext, open = n >= DIVULGA_DIA, cur = game.save.divulga;
  DIVULGA.forEach(d => {
    const on = open && cur === d.id;
    const c = staffCard(upgradeIcon('div-' + d.id), d.name, (d.cost ? fmt(d.cost) + ' por dia. ' : 'Grátis. ') + d.desc);
    if (on) c.classList.add('own');
    c.appendChild(shopBtn(!open ? 'A partir do dia ' + DIVULGA_DIA : (on ? 'Escolhida' : 'Escolher'), 'btn', open && !on && (!d.cost || game.payroll() + d.cost <= game.save.bank), () => game.setDivulga(d.id)));
    grid.appendChild(c);
  });
  const sal = game.tables.filter(t => t.open), p = game.ponto;
  const c = staffCard(upgradeIcon('contas'), 'Contas do dia ' + n,
    (p.aluguel ? 'Aluguel ' + fmt(p.aluguel) + ' + l' : 'Sem aluguel (' + p.nome.replace(/^Garagem/, 'a garagem') + '). L') + 'uz e gás de ' + sal.length + ' mesas (' + fmt(CONTAS.mesa) + ' cada) e ' + sal.reduce((a, t) => a + t.seats, 0) + ' lugares (' + fmt(CONTAS.lugar) + ' cada) = ' + fmt(contasDia(game.tables, p)) + ', no fim do dia. Ingredientes: ' + Math.round(INGRED.prato * 100) + '% da conta de cada prato que fica pronto e ' + fmt(INGRED.suco) + ' por suco.');
  grid.appendChild(c);
}
/* aba Caixa (v7.2): os últimos dias da carreira, para onde foi o dinheiro e um resumo para colar no WhatsApp */
const CAIXA_COR = { ingr:'#E26A2C', contas:'#C2362B', folha:'#1F4FA3', div:'#7B4FB5', mel:'#3E9B5A', sal:'#E0B23A' };
function caixaTotais(cx){
  const s = k => cx.reduce((a, r) => a + r[k], 0);
  return [['ingr','Ingredientes'], ['contas','Contas'], ['folha','Equipe'], ['div','Divulgação'], ['mel','Melhorias'], ['sal','Salão']].map(k => ({ id:k[0], name:k[1], v:s(k[0]) }));
}
function caixaResumo(save){
  const cx = save.caixa, eq = save.equipe, sal = save.salao;
  const out = ['Lanchonete Corre-Corre ' + VERSAO + ' · Caixa (valores em R$)'];
  cx.forEach(r => out.push(r.dev ? 'Devolução do salão: +' + r.dev + ' · saldo ' + r.saldo : 'Dia ' + r.d + (r.ok ? ' ✓' : ' ✗') + ': fatura ' + r.fat + ' − ingred. ' + r.ingr + ' − contas ' + r.contas + ' − equipe ' + r.folha + (r.div ? ' − divulg. ' + r.div : '') +
    ' = lucro ' + r.lucro + ' (meta ' + r.meta + ')' + (r.perd ? ' · ' + r.perd + (r.perd > 1 ? ' perdidos' : ' perdido') : '') + (r.mel + r.sal ? ' · compras ' + (r.mel + r.sal) : '') + ' · saldo ' + r.saldo));
  const nd = cx.filter(r => !r.dev).length;
  if (nd) out.push('Para onde foi (' + nd + (nd > 1 ? ' dias' : ' dia') + '): ' + caixaTotais(cx).filter(t => t.v).map(t => t.name.toLowerCase() + ' ' + t.v).join(', '));
  const ups = UPGRADES.filter(u => save.up[u.id]).map(u => u.name.toLowerCase());
  out.push('Agora: ' + fmt(save.bank) + ' · Tonhão nível ' + (eq.tonhao + 1) + ', ' + (eq.dani ? 'Dani nível ' + eq.dani : 'sem Dani') + (eq.couvert ? ', couvert' : '') + (eq.tv ? ', TV' : '') + (eq.som ? ', som' : '') +
    ' · ' + divulgaOf(save.divulga).name.toLowerCase() + ' · ' + pontoOf(sal.ponto).nome.replace(/ da .*/, '').toLowerCase() + ' com ' + sal.mesas.length + ' mesas e ' + salaoLugares(sal.mesas) + ' lugares · melhorias: ' + (ups.join(', ') || 'nenhuma'));
  return out.join('\n');
}
/* copia para a área de transferência; se o navegador não deixar, devolve false (a aba mostra o texto para copiar à mão) */
function copyText(t){
  return new Promise(res => {
    const velho = () => {
      try {
        const ta = el('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); res(!!ok);
      } catch(e) { res(false); }
    };
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(() => res(true), velho); } catch(e) {}
    velho();
  });
}
/* célula de dinheiro do Caixa: o "R$" fica num <small> que some nas telas baixas, para a tabela caber */
function cxTd(v, cls){
  const td = el('td', 'n' + (cls ? ' ' + cls : ''));
  if (Math.round(v) < 0) td.appendChild(el('span', null, '-'));
  td.appendChild(el('small', 'rs', 'R$ ')); td.appendChild(el('span', null, String(Math.abs(Math.round(v)))));
  return td;
}
function buildCaixa(grid){
  const cx = game.save.caixa, pend = normPend(game.save.caixaPend);
  if (!cx.length){ grid.appendChild(el('p', 'rank-empty', 'O caixa começa quando você joga um dia da carreira.')); return; }
  const wrap = el('div', 'rank-wrap cx-wrap'), tb = el('table', 'rank cx');
  const head = el('tr');
  [['Dia'], ['Faturou'], ['Ingred.', 'Ingredientes'], ['Contas', 'Aluguel, luz e gás'], ['Equipe', 'Folha da equipe, luz da TV e do som e divulgação'], ['Lucro', 'Lucro do dia (a meta)'], ['Compras', 'Melhorias e salão comprados antes do dia'], ['Saldo', 'Dinheiro acumulado ao fim do dia']].forEach((h, i) => { const th = el('th', i ? 'n' : null, h[0]); th.setAttribute('scope', 'col'); if (h[1]) th.title = h[1]; head.appendChild(th); });
  tb.appendChild(head);
  cx.slice().reverse().forEach(r => {
    const tr = el('tr');
    if (r.dev){
      // v7.4: o salão antigo (cadeiras e mesas da v6) foi trocado pela Garagem e o que custou voltou
      const td = el('td', 'cx-dev', 'Devolução do salão antigo: +' + fmt(r.dev)); td.setAttribute('colspan', '7');
      tr.appendChild(td); tr.appendChild(cxTd(r.saldo)); tb.appendChild(tr); return;
    }
    const dia = el('td', null, 'Dia ' + r.d); tr.appendChild(dia);
    [r.fat, r.ingr, r.contas, r.folha + r.div].forEach(v => tr.appendChild(cxTd(v)));
    const lu = cxTd(r.lucro, r.ok ? 'pos' : 'neg'); lu.title = (r.ok ? 'Passou' : 'Não passou') + ' da meta de ' + fmt(r.meta) + (r.perd ? '; ' + r.perd + (r.perd > 1 ? ' perdidos' : ' perdido') : '');
    tr.appendChild(lu);
    tr.appendChild(r.mel + r.sal ? cxTd(r.mel + r.sal) : el('td', 'n', '–'));
    tr.appendChild(cxTd(r.saldo));
    tb.appendChild(tr);
  });
  wrap.appendChild(tb); grid.appendChild(wrap);
  // para onde foi o dinheiro: barra empilhada e legenda
  const tot = caixaTotais(cx).filter(t => t.v > 0), soma = tot.reduce((a, t) => a + t.v, 0);
  const onde = el('div', 'cx-onde');
  const nd = cx.filter(r => !r.dev).length;
  onde.appendChild(el('b', null, 'Para onde foi o dinheiro ' + (nd > 1 ? 'nos últimos ' + nd + ' dias' : 'no último dia') + ': ' + fmt(soma)));
  const bar = el('div', 'cx-bar'); bar.setAttribute('aria-hidden', 'true');
  const leg = el('div', 'cx-leg');
  tot.forEach(t => {
    const seg = el('span'); seg.style.flex = String(t.v); seg.style.background = CAIXA_COR[t.id]; bar.appendChild(seg);
    const li = el('span'), dot = el('i'); dot.style.background = CAIXA_COR[t.id];
    li.appendChild(dot); li.appendChild(el('span', null, t.name + ' ' + fmt(t.v) + ' (' + Math.round(t.v / soma * 100) + '%)'));
    leg.appendChild(li);
  });
  onde.appendChild(bar); onde.appendChild(leg);
  if (pend.mel + pend.sal) onde.appendChild(el('span', 'full', 'Compras nesta lojinha: ' + fmt(pend.mel + pend.sal) + ' (entram na linha do dia ' + game.shopNext + ').'));
  // resumo para colar no WhatsApp
  const row = el('div', 'cx-copia'), st = el('span', 'cx-st'); st.setAttribute('role', 'status');
  let ta = null;
  const b = el('button', 'btn', 'Copiar resumo'); b.type = 'button';
  b.addEventListener('click', () => {
    Sfx.init(); const t = caixaResumo(game.save);
    copyText(t).then(ok => {
      if (ok){ Sfx.ok(); st.textContent = 'Copiado! Cole no WhatsApp.'; return; }
      st.textContent = 'Não deu para copiar sozinho: selecione o texto abaixo.';
      if (!ta){ ta = el('textarea', 'cx-txt'); ta.setAttribute('readonly', ''); ta.setAttribute('aria-label', 'Resumo do caixa'); row.appendChild(ta); }
      ta.value = t; if (ta.select) ta.select();
    });
  });
  row.appendChild(b); row.appendChild(st); onde.appendChild(row); grid.appendChild(onde);
}
function buildShop(){
  const grid = $('shop-grid');
  clearEl(grid);
  segSync('shop-tabs', shopTab);
  $('shop-bank').textContent = fmt(game.save.bank);
  $('shop-limit').textContent = DEV.on ? 'Modo dev: ligue e desligue as melhorias de graça.' : game.shopBought ? 'Melhoria do dia ' + game.shopNext + ' já escolhida.' : 'Você pode levar 1 melhoria antes do dia ' + game.shopNext + '.';
  $('btn-shop-go').textContent = 'Começar o dia ' + game.shopNext;
  const f = payroll(game.save.equipe), dv = game.shopNext >= DIVULGA_DIA ? divulgaOf(game.save.divulga) : null;
  $('shop-folha').textContent = (f ? 'Folha ' + fmt(f) : 'Sem folha') + (dv ? ' + ' + dv.name.toLowerCase() + ' ' + fmt(dv.cost) : '') + ' ao abrir; contas ' + fmt(contasDia(game.tables)) + ' e ingredientes no fim do dia. A meta é o lucro.';
  grid.className = 'shopgrid' + (shopTab === 'salao' || shopTab === 'caixa' ? ' ' + shopTab : '');
  ['salao', 'caixa'].forEach(k => $('ov-shop').classList[shopTab === k ? 'add' : 'remove'](k));
  if (shopTab === 'equipe') return buildEquipe(grid);
  if (shopTab === 'salao') return buildSalao(grid);
  if (shopTab === 'divulga') return buildDivulga(grid);
  if (shopTab === 'caixa') return buildCaixa(grid);
  // os Tênis de corrida (v7.3) só aparecem depois dos Tênis novos, no lugar deles (a grade continua com 6)
  UPGRADES.filter(u => u.req ? game.up[u.req] : !(game.up[u.id] && UPGRADES.some(v => v.req === u.id))).forEach(u => {
    const own = !!game.up[u.id];
    const card = el('div', 'item' + (own ? ' own' : ''));
    card.appendChild(upgradeIcon(u.id));
    card.appendChild(el('b', null, u.name));
    card.appendChild(el('span', null, u.desc));
    const b = el('button', 'btn', DEV.on ? (own ? 'Desligar' : 'Ligar') : own ? 'Já comprado' : ('Comprar ' + fmt(u.cost)));
    b.type = 'button';
    if (!DEV.on && (own || game.shopBought || game.save.bank < u.cost)) b.disabled = true;
    b.addEventListener('click', () => { if (DEV.on ? game.devToggle(u.id) : game.buy(u.id)) buildShop(); });
    card.appendChild(b);
    grid.appendChild(card);
  });
}
(function(){ const box = $('shop-tabs'); if (box) Array.prototype.forEach.call(box.querySelectorAll('button'), b => b.addEventListener('click', () => { Sfx.init(); Sfx.tap(); shopTab = b.getAttribute('data-v'); buildShop(); })); })();

