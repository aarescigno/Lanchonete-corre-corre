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
      drawTorneira(c,12,0,1.15); drawIcon(c,'agua',12,14,0.65);
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
    } else if (id === 'banco'){
      drawBanco(c);   // v8.3
    } else if (id === 'negativo'){
      // caixa no negativo (v8.3): a moeda e o sinal de menos vermelho
      circ(c,-3,3,12); fs(c,PAL.mostarda,2); txt(c,'$',-3,4,14,PAL.tinta,'center',FD);
      rr(c,5,-15,13,6,2); c.fillStyle = PAL.perigo; c.fill(); c.strokeStyle = PAL.tinta; c.lineWidth = 1.6; c.stroke();
    } else if (id === 'contas'){
      rr(c,-11,-15,22,30,2); fs(c,'#fff',2);
      for (let i=0;i<4;i++){ c.fillStyle = PAL.cromoEsc; c.fillRect(-7,-10+i*5,10,1.8); c.fillRect(5,-10+i*5,3,1.8); }
      c.strokeStyle = PAL.perigo; c.lineWidth = 2; c.beginPath(); c.moveTo(-7,11); c.lineTo(8,11); c.stroke();
    } else if (id === 'm-fogao'){
      // fogão de 4 bocas visto de cima, com os botões na frente
      rr(c,-15,-14,30,28,3); fs(c,PAL.inox,2);
      [[-7,-7],[7,-7],[-7,5],[7,5]].forEach(p => { circ(c,p[0],p[1],5); fs(c,'#555',1.6); circ(c,p[0],p[1],2); fs(c,PAL.alerta,1); });
      for (let i=0;i<4;i++){ circ(c,-9 + i*6,11.5,1.4); fs(c,PAL.cromoEsc,1); }
      drawWrench(c,14,-12,0.8,0.78);
    } else if (id === 'm-geladeira'){
      rr(c,-9,-16,18,32,3); fs(c,'#F3F6F8',2); c.strokeStyle = PAL.tinta; c.lineWidth = 1.8; c.beginPath(); c.moveTo(-9,-4); c.lineTo(9,-4); c.stroke();
      rr(c,4,-13,2,6,1); fs(c,PAL.cromoEsc,1); rr(c,4,-1,2,10,1); fs(c,PAL.cromoEsc,1);
      ell(c,0,16,11,2.6); c.fillStyle = '#8EC5E8'; c.fill();
      drawWrench(c,13,-11,0.8,0.78);
    } else if (id === 'm-cafeteira'){
      drawIcon(c,'coffee',-8,2,0.8); drawIcon(c,'coffee',6,4,0.8);
      drawWrench(c,14,-11,0.8,0.78);
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
/* v8.1: compra que usa o dinheiro já reservado para a folha (o que fica de fora ao abrir o dia aumenta): o botão fica
   em alerta e o 1º toque só avisa o que vai ficar de fora; o 2º compra */
function folhaAviso(b, cost){
  // v8.3: com a chave da folha desligada, nada fica de fora: o aviso é o caixa no negativo no fim do dia
  if (!game.save.corta){
    if (!(cost > 0) || game.livre < 0 || game.livre - cost >= 0) return;
    b.classList.add('warn');
    b.title = 'Usa o dinheiro da folha: o dia ' + game.shopNext + ' paga tudo e o caixa pode fechar no negativo.';
    b.setAttribute('data-aviso', 'Confirmar: caixa no negativo');
    return;
  }
  const corte = cost > 0 ? game.cortesSe(cost) : [];
  if (corte.length <= game.cortesSe(0).length) return;
  b.classList.add('warn');
  b.title = 'Usa o dinheiro da folha: o dia ' + game.shopNext + ' abre sem ' + listaE(corte) + '.';
  b.setAttribute('data-aviso', 'Confirmar: sem ' + listaE(corte));
}
/* 1º toque num botão em alerta: troca o texto pelo aviso e devolve true (a compra fica para o 2º toque) */
function folhaPede(b){
  const t = b.getAttribute('data-aviso');
  if (!t || b.getAttribute('data-ok')) return false;
  b.setAttribute('data-ok', '1'); b.textContent = t; Sfx.tap();
  return true;
}
function shopBtn(text, cls, enabled, fn, cost){
  const b = el('button', cls || 'btn', text); b.type = 'button';
  if (!enabled) b.disabled = true; else folhaAviso(b, cost);
  b.addEventListener('click', () => { Sfx.init(); if (folhaPede(b)) return; if (fn()) buildShop(); else Sfx.boing(); });
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
  let c = staffCard(upgradeIcon('tonhao'), 'Tonhão · nível ' + (eq.tonhao + 1) + ' de 3', 'Prato caprichado ★ vale +1♥ e +' + CRIT.bonus + ' pontos.');
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
   Arrastar a mesa muda o lugar dela (encaixe na grade); tocar nela abre a cor das cadeiras, "virar mesa de 4" e "vender".
   v8.3.5: o estoque, à esquerda do salão, guarda mesas (pequenas, em 2 colunas) para rearrumar com folga */
const ED = { x:0, y:56, w:800, h:484, k:1.25 };  // pedaço do salão no editor (do pé da parede ao chão, até o balcão) e a resolução do canvas
const EST = { x0:12, y0:118, x1:182, y1:530, top:30, k:0.55 };   // o estoque no editor (em px do salão) e a escala das mesas nele
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
/* casinhas do estoque: 2 colunas, pelo menos 4 fileiras (as mesas encolhem se houver mais) */
function estSlots(n){
  const cols = 2, rows = Math.max(4, Math.ceil(n / cols)), w = (EST.x1 - EST.x0) / cols, h = (EST.y1 - EST.y0 - EST.top) / rows, k = Math.min(EST.k, h / 140), out = [];
  for (let i = 0; i < n; i++) out.push({ x:EST.x0 + w * (i % cols + 0.5), y:EST.y0 + EST.top + h * (Math.floor(i / cols) + 0.5), w, h, k });
  return out;
}
const naEst = p => p.x >= EST.x0 && p.x <= EST.x1 && p.y >= EST.y0 && p.y <= EST.y1;
/* a mesa sob o toque: { est, i } (est: do estoque) ou null */
function edHit(p, pad){
  const sl = estSlots(game.estoque.length);
  for (let k = 0; k < sl.length; k++){ const q = sl[k]; if (rectDist(p.x, p.y, { x:q.x - q.w/2, y:q.y - q.h/2, w:q.w, h:q.h }) <= Math.min(pad, 4)) return { est:true, i:k }; }
  let best = -1, bd = Infinity;
  game.save.salao.mesas.forEach((m, i) => { const d = rectDist(p.x, p.y, edRect(m)); if (d <= pad && d < bd){ bd = d; best = i; } });
  return best < 0 ? null : { est:false, i:best };
}
/* mesas do salão como ficariam com a mesa arrastada solta onde está (no estoque, ela sai do salão) */
function edMesas(){
  const d = edDrag, l = game.save.salao.mesas.slice();
  if (!d || !d.moved) return l;
  if (d.est) return d.inEst ? l : l.concat([{ x:d.x, y:d.y, seats:game.estoque[d.i].seats, c:game.estoque[d.i].c }]);
  if (d.inEst){ l.splice(d.i, 1); return l; }
  l[d.i] = Object.assign({}, l[d.i], { x:d.x, y:d.y });
  return l;
}
/* contorno da mesa escolhida (amarelo), arrastada (verde) ou num lugar que não vale (vermelho) */
function edMarca(c, r, drag, bad){
  c.save(); c.strokeStyle = bad ? PAL.perigo : (drag ? PAL.ok : PAL.mostarda); c.lineWidth = 5; c.setLineDash(drag ? [10,6] : []);
  rr(c,r.x,r.y,r.w,r.h,14); c.stroke();
  if (bad){ c.fillStyle = 'rgba(194,54,43,.25)'; c.fill(); }
  c.restore();
}
function drawEstoque(c){
  const d = edDrag && edDrag.moved ? edDrag : null, est = game.estoque, sl = estSlots(est.length), alvo = d && d.inEst && !d.est;
  c.save();
  rr(c,EST.x0,EST.y0,EST.x1-EST.x0,EST.y1-EST.y0,12); c.fillStyle = alvo ? (d.ok ? 'rgba(62,155,90,.3)' : 'rgba(194,54,43,.25)') : 'rgba(255,253,245,.7)'; c.fill();
  c.setLineDash([8,6]); c.strokeStyle = alvo ? (d.ok ? PAL.ok : PAL.perigo) : 'rgba(34,32,28,.45)'; c.lineWidth = alvo ? 4 : 2; c.stroke();
  c.restore();
  txt(c,'ESTOQUE',(EST.x0+EST.x1)/2,EST.y0+17,17,PAL.tinta,'center',FD);
  if (!est.length){
    ['Arraste uma', 'mesa para cá', 'e abra espaço', 'no salão.', '', 'Aqui ela não', 'abre no dia.'].forEach((t, k) => txt(c,t,(EST.x0+EST.x1)/2,EST.y0+92+k*24,15,'rgba(34,32,28,.6)','center',FB));
    return;
  }
  est.forEach((m, i) => {
    if (d && d.est && d.i === i) return;   // a arrastada vai desenhada por cima
    const q = sl[i], t = new Table({ id:'', cx:q.x, cy:q.y - 4 * q.k, seats:m.seats, color:m.c });
    t.open = true;
    c.save(); c.translate(q.x, q.y); c.scale(q.k, q.k); c.translate(-q.x, -q.y);
    drawTable(c, game, t, 0, true);
    c.restore();
    if (i === game.estoqueSel) edMarca(c, { x:q.x - q.w/2 + 3, y:q.y - q.h/2 + 3, w:q.w - 6, h:q.h - 6 }, false, false);
  });
}
function drawEditor(cv){
  const c = cv.getContext('2d');
  if (!c) return;
  c.setTransform(ED.k, 0, 0, ED.k, -ED.x * ED.k, -ED.y * ED.k);
  c.lineJoin = 'round'; c.lineCap = 'round';
  drawFloor(c, game); drawWall(c, game, 0); drawKitchen(c, game, 0);
  const a = game.ponto.area;
  c.save(); c.setLineDash([8,6]); c.strokeStyle = 'rgba(31,79,163,.5)'; c.lineWidth = 2; rr(c,a.x0,a.y0,a.x1-a.x0,a.y1-a.y0,10); c.stroke(); c.restore();
  drawEstoque(c);
  const d = edDrag && edDrag.moved ? edDrag : null;
  game.save.salao.mesas.forEach((m, i) => {
    if (d && !d.est && d.i === i) return;
    const t = new Table({ id:i + 1, cx:m.x, cy:m.y, seats:m.seats, color:m.c });
    t.open = true;
    drawTable(c, game, t, 0, true);
    if (i === game.salaoSel) edMarca(c, edRect(m), false, false);
  });
  if (d){   // a mesa arrastada, por cima de tudo
    const m = d.est ? game.estoque[d.i] : game.save.salao.mesas[d.i], t = new Table({ id:d.est ? '' : d.i + 1, cx:d.x, cy:d.y, seats:m.seats, color:m.c });
    t.open = true;
    drawTable(c, game, t, 0, true);
    edMarca(c, edRect({ x:d.x, y:d.y, seats:m.seats }), true, !d.ok);
  }
}
/* botão do editor: o motivo da recusa (salaoMsg) aparece logo abaixo */
function edBtn(text, cls, enabled, fn, cost){
  const b = el('button', cls, text); b.type = 'button';
  if (!enabled) b.disabled = true; else folhaAviso(b, cost);
  b.addEventListener('click', () => { Sfx.init(); if (folhaPede(b)) return; if (fn()) Sfx.tap(); else Sfx.boing(); buildShop(); });
  return b;
}
/* vale soltar a mesa arrastada onde está? (d.why: o motivo, se não) */
function edValida(d){
  const mesas = game.save.salao.mesas;
  if (d.inEst) d.why = d.est || mesas.length > 1 ? '' : 'O salão precisa de pelo menos 1 mesa.';
  else d.why = salaoProblema(edMesas(), game.ponto);
  d.ok = !d.why;
}
function edEvents(cv){
  cv.addEventListener('pointerdown', e => {
    Sfx.init(); e.preventDefault();
    try { cv.setPointerCapture(e.pointerId); } catch(err) {}
    const p = edPt(cv, e), pad = edPad(cv, e), h = edHit(p, pad);
    if (!h){ if (game.salaoSel >= 0 || game.estoqueSel >= 0 || game.salaoMsg){ game.salaoSel = -1; game.estoqueSel = -1; game.salaoMsg = ''; buildShop(); } return; }
    const m = h.est ? null : game.save.salao.mesas[h.i];
    // do estoque, a mesa sai já no tamanho do salão, presa no dedo
    edDrag = { est:h.est, i:h.i, dx:m ? m.x - p.x : 0, dy:m ? m.y - p.y : 0, sx:p.x, sy:p.y, x:m ? m.x : p.x, y:m ? m.y : p.y, moved:false, ok:true, why:'', pad, inEst:h.est };
  });
  cv.addEventListener('pointermove', e => {
    const d = edDrag;
    if (!d) return;
    const p = edPt(cv, e);
    // no dedo, um tremidinho não vira arrasto
    if (!d.moved && Math.hypot(p.x - d.sx, p.y - d.sy) > Math.max(9, d.pad)){ d.moved = true; const pop = cv.parentNode && cv.parentNode.querySelector && cv.parentNode.querySelector('.ed-pop'); if (pop) pop.style.display = 'none'; }
    if (!d.moved) return;
    const x = clamp(snapG(p.x + d.dx), ED.x + 40, ED.x + ED.w - 40), y = clamp(snapG(p.y + d.dy), ED.y + 60, ED.y + ED.h - 40), inEst = naEst(p);
    if (x === d.x && y === d.y && inEst === d.inEst && d.vez) return;
    d.x = x; d.y = y; d.inEst = inEst; d.vez = true; edValida(d);
    drawEditor(cv);
  });
  cv.addEventListener('pointerup', () => {
    const d = edDrag; edDrag = null;
    if (!d) return;
    if (d.moved){
      if (d.inEst && d.est) Sfx.tap();   // voltou para o estoque: nada muda
      else if (d.ok && (d.inEst ? game.guardarMesa(d.i) : d.est ? game.tirarMesa(d.i, d.x, d.y) : game.moverMesa(d.i, d.x, d.y))) Sfx.tap();
      else { Sfx.boing(); game.salaoMsg = 'Aí não dá: ' + (d.why || game.salaoMsg).toLowerCase(); }
    } else if (d.est){ game.estoqueSel = game.estoqueSel === d.i ? -1 : d.i; game.salaoSel = -1; game.salaoMsg = ''; Sfx.tap(); }
    else { game.salaoSel = game.salaoSel === d.i ? -1 : d.i; game.estoqueSel = -1; game.salaoMsg = ''; Sfx.tap(); }
    buildShop();
  });
  cv.addEventListener('pointercancel', () => { edDrag = null; drawEditor(cv); });
  cv.addEventListener('contextmenu', e => e.preventDefault());
}
/* cor das cadeiras (v7.4.3, de graça), em bolinhas com o nome da cor no rótulo */
function edCores(m, fn){
  const cores = el('div', 'ed-cores');
  cores.appendChild(el('span', null, 'Cadeiras:'));
  CHAIRS.forEach((ch, k) => {
    const b = edBtn(k === m.c ? '✓' : '', 'ed-cor', true, () => fn(k));
    b.style.background = ch.c; b.title = 'Cadeiras na cor ' + ch.n;
    b.setAttribute('aria-label', 'Cadeiras na cor ' + ch.n); b.setAttribute('aria-pressed', k === m.c ? 'true' : 'false');
    cores.appendChild(b);
  });
  return cores;
}
function buildSalao(grid){
  const p = game.ponto, mesas = game.save.salao.mesas, est = game.estoque, bank = game.save.bank, lug = salaoLugares(mesas), tot = game.lugaresTot;
  if (!est[game.estoqueSel]) game.estoqueSel = -1;
  const sel = game.salaoSel, ks = game.estoqueSel;
  const ed = el('div', 'ed'), box = el('div', 'ed-cv'), cv = el('canvas');
  cv.width = Math.round(ED.w * ED.k); cv.height = Math.round(ED.h * ED.k);
  cv.setAttribute('aria-label', 'Salão: arraste as mesas para mudar de lugar ou para o estoque, à esquerda, e toque numa mesa para ver as opções');
  box.appendChild(cv); edEvents(cv);
  // mesa escolhida: cor das cadeiras, guardar no estoque, virar mesa de 4 e vender (balãozinho em cima do salão)
  const m = mesas[sel], me = est[ks];
  if (m || me){
    let pop;
    if (m){
      const up = m.y + 230 > ED.y + ED.h;
      pop = el('div', 'ed-pop' + (up ? ' up' : ''));
      pop.style.left = clamp((m.x - ED.x) / ED.w * 100, 18, 82) + '%';
      pop.style.top = ((up ? m.y - 66 : m.y + 72) - ED.y) / ED.h * 100 + '%';
      pop.appendChild(el('b', null, 'Mesa ' + (sel + 1) + ' · ' + m.seats + ' lugares'));
      pop.appendChild(edCores(m, k => game.pintarMesa(sel, k)));
      if (m.seats === 2) pop.appendChild(edBtn('Virar mesa de 4: ' + fmt(SALAO.virar), 'btn', tot + 2 <= p.lugares && bank >= SALAO.virar, () => game.virarMesa(sel), SALAO.virar));
      pop.appendChild(edBtn('Guardar no estoque', 'btn alt', mesas.length > 1, () => game.guardarMesa(sel)));
      pop.appendChild(edBtn('Vender por ' + fmt(mesaPreco(m.seats) * SALAO.venda), 'btn alt', mesas.length > 1, () => game.venderMesa(sel)));
    } else {
      // v8.3.5: mesa do estoque; o balãozinho sai ao lado do estoque, por cima do salão
      const q = estSlots(est.length)[ks], up = q.y + 230 > ED.y + ED.h;
      pop = el('div', 'ed-pop est' + (up ? ' up' : ''));
      pop.style.left = (EST.x1 + 6 - ED.x) / ED.w * 100 + '%';
      pop.style.top = ((up ? q.y + q.h / 2 : q.y - q.h / 2) - ED.y) / ED.h * 100 + '%';
      pop.appendChild(el('b', null, 'Mesa no estoque · ' + me.seats + ' lugares'));
      pop.appendChild(edCores(me, k => game.pintarMesa(ks, k, true)));
      pop.appendChild(edBtn('Pôr no salão', 'btn', true, () => game.tirarMesa(ks)));
      if (me.seats === 2) pop.appendChild(edBtn('Virar mesa de 4: ' + fmt(SALAO.virar), 'btn', tot + 2 <= p.lugares && bank >= SALAO.virar, () => game.virarMesa(ks, true), SALAO.virar));
      pop.appendChild(edBtn('Vender por ' + fmt(mesaPreco(me.seats) * SALAO.venda), 'btn alt', true, () => game.venderMesa(ks, true)));
    }
    const x = el('button', 'ed-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Fechar');
    x.addEventListener('click', () => { Sfx.tap(); game.salaoSel = -1; game.estoqueSel = -1; buildShop(); });
    pop.appendChild(x);
    box.appendChild(pop);
  }
  ed.appendChild(box);
  // loja de móveis e arrumação
  const side = el('div', 'ed-side'), nEst = salaoLugares(est);
  side.appendChild(el('b', 'ed-lug', 'Lugares ' + lug + ' de ' + p.lugares));
  if (est.length) side.appendChild(el('span', 'ed-est', 'No estoque: ' + est.length + (est.length > 1 ? ' mesas' : ' mesa') + ' (' + nEst + ' lugares), que não abre' + (est.length > 1 ? 'm' : '') + ' no dia.'));
  side.appendChild(el('span', 'ed-ponto', p.nome + (p.aluguel ? ': aluguel ' + fmt(p.aluguel) + ' por dia.' : ': sem aluguel.')));
  side.appendChild(edBtn('Mesa de 2: ' + fmt(SALAO.mesa2), 'btn', tot + 2 <= p.lugares && bank >= SALAO.mesa2, () => game.buyMesa(2), SALAO.mesa2));
  side.appendChild(edBtn('Mesa de 4: ' + fmt(SALAO.mesa4), 'btn', tot + 4 <= p.lugares && bank >= SALAO.mesa4, () => game.buyMesa(4), SALAO.mesa4));
  side.appendChild(edBtn('Arrumação automática', 'btn alt', true, () => game.arrumarSalao()));
  side.appendChild(edBtn('Desfazer', 'btn alt', game.salaoUndo.length > 0, () => game.desfazerSalao()));
  side.appendChild(el('span', game.salaoMsg ? 'msg' : 'ed-dica', game.salaoMsg || (tot >= p.lugares ? (nEst ? 'Salão e estoque estão no teto de ' + p.lugares + ' lugares.' : 'O salão está no teto de ' + p.lugares + ' lugares.') + ' Para rearrumar, arraste mesas para o estoque e de volta.' : 'Arraste as mesas, até para o estoque; toque numa para trocar a cor das cadeiras, virar mesa de 4 ou vender. Grupos de 3 ou 4 só sentam nas mesas de 4.')));
  side.appendChild(el('span', 'ed-contas', 'Luz e gás: ' + fmt(contasDia(game.tables, p)) + ' por dia (' + fmt(CONTAS.mesa) + ' por mesa e ' + fmt(CONTAS.lugar) + ' por lugar).'));
  const mov = Math.round((movimentoSalao(lug) - 1) * 100);
  side.appendChild(el('span', 'ed-contas', 'Cada lugar acima de ' + MOVIMENTO.kit + ' traz ' + Math.round(MOVIMENTO.porLugar * 100) + '% mais clientes' + (mov > 0 ? ' (hoje, +' + mov + '%).' : '.')));
  ed.appendChild(side);
  grid.appendChild(ed);
  drawEditor(cv);
}
/* aba Divulgação (v7): escolha do dia, paga junto com a folha (no fim do dia, desde a v8.2.2); e o resumo das contas do dia */
function buildDivulga(grid){
  const n = game.shopNext, open = divulgaAberta(n), cur = game.save.divulga;
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
/* aba Manutenção (v8): o estado de cada equipamento, o risco de quebrar e a revisão (volta a 100%) */
function buildManut(grid){
  const m = game.manut, n = game.shopNext, pc = v => Math.round(v * 100) + '%';
  MANUT.equip.forEach(q => {
    const e = m[q.id], v = manutPreco(q.id, e), risco = n >= MANUT.dia ? manutChance(e) : 0;
    const c = staffCard(upgradeIcon('m-' + q.id), q.name + ' · ' + pc(e),
      'Quebrado, ' + q.efeito + ' até o conserto na hora (' + fmt(q.emerg) + ', um toque na plaquinha). Risco de quebrar no dia ' + n + ': ' + (risco >= 0.005 ? pc(risco) : (n < MANUT.dia ? 'nenhum até o dia ' + MANUT.dia : 'quase nenhum')) + '.');
    const bar = el('div', 'mbar'); bar.setAttribute('role', 'meter'); bar.setAttribute('aria-label', q.name); bar.setAttribute('aria-valuenow', String(Math.round(e * 100)));
    const fill = el('i'); fill.style.width = pc(e); fill.style.background = e >= 0.7 ? PAL.ok : e >= 0.4 ? PAL.mostarda : PAL.perigo; bar.appendChild(fill);
    c.appendChild(bar);
    if (e >= 0.995) c.classList.add('own');
    c.appendChild(shopBtn(!v ? 'Em dia' : DEV.on ? 'Revisão (grátis)' : 'Revisão: ' + fmt(v), 'btn', !!v && (DEV.on || game.save.bank >= v), () => game.revisar(q.id), DEV.on ? 0 : v));
    grid.appendChild(c);
  });
  const tot = MANUT.equip.reduce((a, q) => a + manutPreco(q.id, m[q.id]), 0);
  const c = staffCard(upgradeIcon('contas'), 'Revisar tudo', 'Cada dia gasta cada equipamento um pouco, e mais em dia cheio. Do dia ' + MANUT.dia + ' em diante, o que está gasto pode quebrar no meio do dia. A revisão sai do dinheiro acumulado e entra no caixa como manutenção.');
  c.appendChild(shopBtn(!tot ? 'Tudo em dia' : DEV.on ? 'Revisar tudo (grátis)' : 'Revisar tudo: ' + fmt(tot), 'btn', !!tot && (DEV.on || game.save.bank >= tot), () => game.revisarTudo(), DEV.on ? 0 : tot));
  grid.appendChild(c);
}
/* aba Banco (v8.3): o empréstimo (ou o que falta pagar dele), o caixa no negativo e a chave da folha sem dinheiro */
function buildBanco(grid){
  const sv = game.save, e = sv.emp, cr = game.ponto.credito, pc = Math.round(BANCO.juros * 100);
  // v8.3.2, amortização: juros ao dia sobre o saldo; cada parcela é a amortização fixa mais os juros do dia
  const vs = BANCO.valores.filter(v => v <= cr), sim = simulaEmprestimo(vs[vs.length - 1], BANCO.juros);
  let c = staffCard(upgradeIcon('banco'), 'Empréstimo', pc + '% ao dia sobre o saldo; cada parcela paga 1/' + BANCO.parcelas + ' do valor mais os juros. ' + (e.resto ? 'Amortizar antes corta os juros.' : fmt(vs[vs.length - 1]) + ' viram ' + sim.parcelas.join(', ').replace(/, ([^,]*)$/, ' e $1') + ' (' + fmt(sim.juros) + ' de juros). Até ' + fmt(cr) + ', um por vez.') + ' Atrasar 2 dias fecha a lanchonete.');
  if (e.resto){
    c.classList.add(e.atr ? 'atr' : 'own');
    const tab = tabelaDe(e);
    c.appendChild(el('span', 'full', 'Faltam ' + fmt(e.resto) + (e.j !== BANCO.juros && e.j ? ' (' + Math.round(e.j * 100) + '% ao dia)' : '') + '. ' + (e.atr ? 'Parcela atrasada! No fim do dia ' + game.shopNext + ', o caixa precisa ter ' + fmt(game.devido) + '.' : 'Fim do dia ' + game.shopNext + ': ' + fmt(game.parcela) + ' (' + Math.min(e.resto, e.amort) + ' + ' + game.jurosHoje + ' de juros)' + (tab.length > 1 ? '; depois, ' + tab.slice(1).join(', ').replace(/, ([^,]*)$/, ' e $1') : '') + '.')));
    const duo = el('div', 'duo'), a1 = Math.min(e.resto, e.amort);
    if (e.resto > a1) duo.appendChild(shopBtn('Amortizar ' + fmt(a1), 'btn', sv.bank >= a1, () => game.amortizar(a1), a1));
    duo.appendChild(shopBtn('Quitar: ' + fmt(e.resto), 'btn', sv.bank >= e.resto, () => game.quitar(), e.resto));
    c.appendChild(duo);
  } else {
    const duo = el('div', 'duo');
    vs.forEach(v => {
      const s = simulaEmprestimo(v, BANCO.juros);
      const b = shopBtn(fmt(v), 'btn', game.podeEmprestar(v), () => game.emprestar(v));
      b.setAttribute('aria-label', 'Pegar ' + fmt(v) + ' emprestado: ' + BANCO.parcelas + ' parcelas, de ' + fmt(s.parcelas[0]) + ' a ' + fmt(s.parcelas[s.parcelas.length - 1]) + ', ' + fmt(s.juros) + ' de juros'); b.title = 'Parcelas: ' + s.parcelas.join(', ') + ' (' + fmt(s.juros) + ' de juros)';
      duo.appendChild(b);
    });
    c.appendChild(duo);
  }
  grid.appendChild(c);
  c = staffCard(upgradeIcon('negativo'), 'Caixa no negativo',
    'Folha, contas e parcelas saem no fim do dia mesmo sem dinheiro. O caixa pode fechar no negativo ' + BANCO.neg + ' dias seguidos; no ' + (BANCO.neg + 1) + 'º, o banco cobre o que falta, à força, com juros de ' + Math.round(BANCO.forcado * 100) + '% ao dia sobre todo o saldo.');
  c.appendChild(el('span', 'full', sv.bank < 0 ? 'Agora: ' + fmt(sv.bank) + ', no negativo há ' + sv.neg + (sv.neg === 1 ? ' dia.' : ' dias.') : 'Agora: no positivo.'));
  grid.appendChild(c);
  c = staffCard(upgradeIcon('contas'), 'Folha sem dinheiro',
    'Ligado, o que não couber no dinheiro fica de fora ao abrir o dia (divulgação, couvert, som, TV, Dani, aumento do Tonhão). Desligado, paga tudo e o caixa pode ficar negativo.');
  const tg = el('button', 'toggle', (sv.corta ? 'Ligado' : 'Desligado') + ': cortar a folha se faltar dinheiro'); tg.type = 'button';
  tg.setAttribute('aria-pressed', sv.corta ? 'true' : 'false');
  tg.addEventListener('click', () => { Sfx.tap(); game.setCorta(!sv.corta); buildShop(); });
  c.appendChild(tg);
  grid.appendChild(c);
}
/* aba Caixa (v7.2): os últimos dias da carreira, para onde foi o dinheiro e um resumo para colar no WhatsApp */
const CAIXA_COR = { ingr:'#E26A2C', contas:'#C2362B', folha:'#1F4FA3', div:'#7B4FB5', mel:'#3E9B5A', sal:'#E0B23A', man:'#5B5F6B', mul:'#8A1F1A', jur:'#2B7A78' };
function caixaTotais(cx){
  const s = k => cx.reduce((a, r) => a + (r[k] || 0), 0);
  return [['ingr','Ingredientes'], ['contas','Contas'], ['folha','Equipe'], ['div','Divulgação'], ['mel','Melhorias'], ['sal','Salão'], ['man','Manutenção'], ['mul','Dias largados no meio'], ['jur','Juros do banco']].map(k => ({ id:k[0], name:k[1], v:s(k[0]) }));   // v8.3.2: o que o banco custa são os juros (o resto devolve o empréstimo)
}
function caixaResumo(save){
  const cx = save.caixa, eq = save.equipe, sal = save.salao;
  const out = ['Lanchonete Corre-Corre ' + VERSAO + ' · Caixa (valores em R$)'];
  cx.forEach(r => out.push(r.int ? 'Dia ' + r.d + ' largado no meio: ' + r.int + (r.int > 1 ? ' grupos foram' : ' grupo foi') + ' embora bravo' + (r.int > 1 ? 's' : '') + ': −' + r.mul + ' · saldo ' + r.saldo : r.dev ? 'Devolução ' + (r.devK === 'maquina' ? 'da máquina de suco' : 'do salão') + ': +' + r.dev + ' · saldo ' + r.saldo : 'Dia ' + r.d + (r.ok ? ' ✓' : ' ✗') + ': fatura ' + r.fat + ' − ingred. ' + r.ingr + ' − contas ' + r.contas + ' − equipe ' + r.folha + (r.div ? ' − divulg. ' + r.div : '') +
    ' = lucro ' + r.lucro + ' (meta ' + r.meta + ')' + (r.perd ? ' · ' + r.perd + (r.perd > 1 ? ' perdidos' : ' perdido') : '') + (r.mel + r.sal ? ' · compras ' + (r.mel + r.sal) : '') + (r.man ? ' · manutenção ' + r.man : '') + (r.emp ? ' · empréstimo +' + r.emp + (r.forc ? ' (à força)' : '') : '') + (r.par ? ' · banco −' + r.par + (r.jur ? ' (juros ' + r.jur + ')' : '') : '') + (r.atr ? ' · parcela atrasada' : '') + (r.tom ? ' · o banco tomou a lanchonete' : '') + ' · saldo ' + r.saldo));
  const nd = cx.filter(r => !r.dev && !r.int).length;
  if (nd) out.push('Para onde foi (' + nd + (nd > 1 ? ' dias' : ' dia') + '): ' + caixaTotais(cx).filter(t => t.v).map(t => t.name.toLowerCase() + ' ' + t.v).join(', '));
  const ups = UPGRADES.filter(u => save.up[u.id]).map(u => u.name.toLowerCase() + (u.multi && pratosDe(save.up) > 1 ? ' ×' + pratosDe(save.up) : ''));
  out.push('Agora: dia ' + save.dia + ' · ' + fmt(save.bank) + (save.emp.resto ? ' (banco: faltam ' + save.emp.resto + ')' : '') + ' · lucro acumulado ' + save.lucroTot + ' · Tonhão nível ' + (eq.tonhao + 1) + ', ' + (eq.dani ? 'Dani nível ' + eq.dani : 'sem Dani') + (eq.couvert ? ', couvert' : '') + (eq.tv ? ', TV' : '') + (eq.som ? ', som' : '') +
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
  [['Dia'], ['Faturou'], ['Ingred.', 'Ingredientes'], ['Contas', 'Aluguel, luz e gás'], ['Equipe', 'Folha da equipe, luz da TV e do som e divulgação'], ['Lucro', 'Lucro do dia (a meta)'], ['Compras', 'Melhorias e salão comprados antes do dia'], ['Manut.', 'Revisões na lojinha e consertos na hora'], ['Banco', 'Empréstimo recebido (+) e parcelas pagas (−)'], ['Saldo', 'Dinheiro acumulado ao fim do dia']].forEach((h, i) => { const th = el('th', i ? 'n' : null, h[0]); th.setAttribute('scope', 'col'); if (h[1]) th.title = h[1]; head.appendChild(th); });
  tb.appendChild(head);
  cx.slice().reverse().forEach(r => {
    const tr = el('tr');
    if (r.int){
      // v8.2.3: dia largado no meio, com gente na espera ou nas mesas: cada grupo foi embora bravo e pagou a multa
      const td = el('td', 'cx-dev', 'Dia ' + r.d + ' largado no meio: ' + r.int + (r.int > 1 ? ' grupos foram' : ' grupo foi') + ' embora bravo' + (r.int > 1 ? 's' : '') + ': −' + fmt(r.mul)); td.setAttribute('colspan', '9');
      tr.appendChild(td); tr.appendChild(cxTd(r.saldo)); tb.appendChild(tr); return;
    }
    if (r.dev){
      // v7.4: o salão antigo (cadeiras e mesas da v6) foi trocado pela Garagem e o que custou voltou;
      // v7.7: a Máquina de suco virou a Água da torneira, mais barata, e a diferença voltou
      const td = el('td', 'cx-dev', (r.devK === 'maquina' ? 'Devolução da máquina de suco (virou a Água da torneira): +' : 'Devolução do salão antigo: +') + fmt(r.dev)); td.setAttribute('colspan', '9');
      tr.appendChild(td); tr.appendChild(cxTd(r.saldo)); tb.appendChild(tr); return;
    }
    const dia = el('td', null, 'Dia ' + r.d + (r.st ? ' ' + '★'.repeat(r.st) : '')); tr.appendChild(dia);
    [r.fat, r.ingr, r.contas, r.folha + r.div].forEach(v => tr.appendChild(cxTd(v)));
    const lu = cxTd(r.lucro, r.ok ? 'pos' : 'neg'); lu.title = (r.ok ? 'Passou' : 'Não passou') + ' da meta de ' + fmt(r.meta) + (r.perd ? '; ' + r.perd + (r.perd > 1 ? ' perdidos' : ' perdido') : '');
    tr.appendChild(lu);
    tr.appendChild(r.mel + r.sal ? cxTd(r.mel + r.sal) : el('td', 'n', '–'));
    tr.appendChild(r.man ? cxTd(r.man) : el('td', 'n', '–'));
    const ban = (r.emp || 0) - (r.par || 0), bt = r.emp || r.par ? cxTd(ban, ban >= 0 ? 'pos' : 'neg') : el('td', 'n', '–');
    if (r.emp || r.par) bt.title = (r.emp ? 'Empréstimo' + (r.forc ? ' à força' : '') + ': +' + fmt(r.emp) : '') + (r.emp && r.par ? '; ' : '') + (r.par ? 'pago ao banco: ' + fmt(r.par) + (r.jur ? ', ' + fmt(r.jur) + ' de juros' : '') : '');
    if (r.atr || r.tom){ bt.className = 'n neg'; bt.textContent = r.tom ? 'tomou' : 'atrasou'; bt.title = r.tom ? 'O banco tomou a lanchonete' : 'Parcela do banco atrasada'; }   // v8.3.1
    tr.appendChild(bt);
    tr.appendChild(cxTd(r.saldo, r.saldo < 0 ? 'neg' : null));
    tb.appendChild(tr);
  });
  wrap.appendChild(tb); grid.appendChild(wrap);
  // para onde foi o dinheiro: barra empilhada e legenda
  const tot = caixaTotais(cx).filter(t => t.v > 0), soma = tot.reduce((a, t) => a + t.v, 0);
  const onde = el('div', 'cx-onde');
  const nd = cx.filter(r => !r.dev && !r.int).length;
  onde.appendChild(el('b', null, 'Para onde foi o dinheiro ' + (nd > 1 ? 'nos últimos ' + nd + ' dias' : nd ? 'no último dia' : 'até agora') + ': ' + fmt(soma)));
  const bar = el('div', 'cx-bar'); bar.setAttribute('aria-hidden', 'true');
  const leg = el('div', 'cx-leg');
  tot.forEach(t => {
    const seg = el('span'); seg.style.flex = String(t.v); seg.style.background = CAIXA_COR[t.id]; bar.appendChild(seg);
    const li = el('span'), dot = el('i'); dot.style.background = CAIXA_COR[t.id];
    li.appendChild(dot); li.appendChild(el('span', null, t.name + ' ' + fmt(t.v) + ' (' + Math.round(t.v / soma * 100) + '%)'));
    leg.appendChild(li);
  });
  onde.appendChild(bar); onde.appendChild(leg);
  if (pend.mel + pend.sal + pend.man) onde.appendChild(el('span', 'full', 'Compras nesta lojinha: ' + fmt(pend.mel + pend.sal + pend.man) + ' (entram na linha do dia ' + game.shopNext + ').'));
  if (pend.emp || pend.par) onde.appendChild(el('span', 'full', 'Banco nesta lojinha: ' + (pend.emp ? 'empréstimo de ' + fmt(pend.emp) : '') + (pend.emp && pend.par ? ' e ' : '') + (pend.par ? fmt(pend.par) + ' pagos' : '') + ' (entram na linha do dia ' + game.shopNext + ').'));
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
  $('shop-bank').className = 'bank' + (game.save.bank < 0 ? ' neg' : '');   // v8.3: no negativo, em vermelho
  // v8.1: o que já está comprometido com a abertura do dia não está livre para gastar
  const comp = game.compromisso, corte = game.cortesSe(0), liv = $('shop-livre'), sv = game.save;
  // v8.3: com a chave da folha desligada, falta de dinheiro vira caixa no negativo; e o aviso dos dias no negativo
  const negFim = !sv.corta && comp && game.livre < 0, negAgora = sv.bank < 0;
  liv.className = corte.length || negFim || negAgora || sv.emp.atr ? 'livre falta' : 'livre';
  liv.textContent = (sv.emp.atr ? ' · parcela do banco atrasada: ' + fmt(game.devido) + ' no fim do dia, ou o banco toma a lanchonete' : '') + (negAgora ? ' · no negativo há ' + sv.neg + (sv.neg === 1 ? ' dia' : ' dias') + ' (no ' + (BANCO.neg + 1) + 'º seguido, o banco cobre à força)' : '') + (!comp ? '' : corte.length
    ? ' · faltam ' + fmt(-game.livre) + ' para a folha: o dia ' + game.shopNext + ' abre sem ' + listaE(corte)
    : negFim ? ' · faltam ' + fmt(-game.livre) + ' para a folha: o caixa pode fechar no negativo'
    : ' · livre ' + fmt(game.livre) + ' (' + fmt(comp) + ' reservados para ' + listaE(folhaItens(game.save.equipe, game.div)) + ')');
  $('shop-limit').textContent = DEV.on ? 'Modo dev: tudo liberado; melhorias de graça, ligue e desligue à vontade.' : game.shopBought ? 'Melhoria do dia ' + game.shopNext + ' já escolhida (pratos à vontade).' : 'Você pode levar 1 melhoria antes do dia ' + game.shopNext + ' (pratos à vontade).';
  $('btn-shop-go').textContent = 'Começar o dia ' + game.shopNext;
  const f = payroll(game.save.equipe), dv = divulgaAberta(game.shopNext) ? divulgaOf(game.save.divulga) : null;
  $('shop-folha').textContent = (f ? 'Folha ' + fmt(f) : 'Sem folha') + (dv ? ' + ' + dv.name.toLowerCase() + ' ' + fmt(dv.cost) : '') + ', contas ' + fmt(contasDia(game.tables)) + (sv.emp.resto ? ', parcela do banco ' + fmt(game.devido) + (sv.emp.atr ? ' (com a atrasada)' : '') : '') + ' e ingredientes: tudo pago no fim do dia, que só rende completo. A meta é o lucro.';
  grid.className = 'shopgrid' + (shopTab === 'salao' || shopTab === 'caixa' ? ' ' + shopTab : '');
  ['salao', 'caixa'].forEach(k => $('ov-shop').classList[shopTab === k ? 'add' : 'remove'](k));
  if (shopTab === 'equipe') return buildEquipe(grid);
  if (shopTab === 'salao') return buildSalao(grid);
  if (shopTab === 'divulga') return buildDivulga(grid);
  if (shopTab === 'manut') return buildManut(grid);
  if (shopTab === 'banco') return buildBanco(grid);
  if (shopTab === 'caixa') return buildCaixa(grid);
  // os Tênis de corrida (v7.3) só aparecem depois dos Tênis novos, no lugar deles (a grade continua com 6); no modo dev, todas
  UPGRADES.filter(u => DEV.on || (u.req ? game.up[u.req] : !(game.up[u.id] && UPGRADES.some(v => v.req === u.id)))).forEach(u => {
    const own = !!game.up[u.id], tem = u.multi ? pratosDe(game.up) : 0, fecha = !u.multi && (own || game.shopBought);   // o Jogo de pratos (v8.3.6) segue à venda
    const card = el('div', 'item' + (own && !u.multi ? ' own' : ''));
    card.appendChild(upgradeIcon(u.id));
    card.appendChild(el('b', null, u.name));
    card.appendChild(el('span', null, (tem ? 'Você tem ' + tem + '. ' : '') + u.desc));
    const b = el('button', 'btn', DEV.on ? (own ? 'Desligar' : 'Ligar') : fecha && own ? 'Já comprado' : ('Comprar ' + fmt(u.cost)));
    b.type = 'button';
    if (!DEV.on && (fecha || game.save.bank < u.cost)) b.disabled = true;
    else if (!DEV.on) folhaAviso(b, u.cost);
    b.addEventListener('click', () => { if (folhaPede(b)) return; if (DEV.on ? game.devToggle(u.id) : game.buy(u.id)) buildShop(); });
    card.appendChild(b);
    grid.appendChild(card);
  });
}
(function(){ const box = $('shop-tabs'); if (box) Array.prototype.forEach.call(box.querySelectorAll('button'), b => b.addEventListener('click', () => { Sfx.init(); Sfx.tap(); shopTab = b.getAttribute('data-v'); buildShop(); })); })();

