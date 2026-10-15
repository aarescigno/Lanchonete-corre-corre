/* ---------- Lojinha ---------- */
function upgradeIcon(id){
  return tipCanvas(c => {
    c.translate(32,32); c.scale(1.5,1.5);
    if (id === 'tenis'){
      c.beginPath(); c.moveTo(-14,6); c.lineTo(-14,-8); c.lineTo(-6,-10); c.lineTo(0,-2); c.lineTo(12,2); c.quadraticCurveTo(15,4,14,8); c.lineTo(-14,8); c.closePath(); fs(c,'#fff',2);
      c.fillStyle = PAL.formica; c.fillRect(-14,5,28,3); c.strokeStyle = PAL.faixa; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-3,-3); c.lineTo(1,-6); c.moveTo(1,0); c.lineTo(5,-3); c.stroke();
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
    } else if (id === 'agua'){
      drawAguaJar(c,0,12,0.9);
    } else if (id === 'cadeira'){
      c.scale(0.62,0.62); drawChair(c,-13,16,0,true); drawChair(c,15,20,1,true);
    } else if (id === 'mesa'){
      c.strokeStyle = PAL.cromoEsc; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-10,6); c.lineTo(-12,17); c.moveTo(10,6); c.lineTo(12,17); c.stroke();
      rr(c,-18,-4,36,12,5); fs(c,PAL.cromo,2); rr(c,-15,-2,30,7,3); fs(c,PAL.formica,1.4);
      circ(c,12,-12,7); fs(c,PAL.ok,1.8); txt(c,'+',12,-11,13,'#fff','center',FD);
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
  // Couvert
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
/* aba Salão: comprar cadeiras e mesas e escolher 2 ou 4 lugares por mesa, na planta das 2 fileiras */
function buildSalao(grid){
  const sal = game.save.salao, bank = game.save.bank, used = salaoUsed(sal), livres = sal.chairs - used;
  const plan = el('div', 'plan');
  plan.appendChild(el('span', 'full', 'Lugares por mesa (grupos de 3 ou 4 só sentam nas de 4). Numa fileira com 4 mesas, só 1 pode ter 4 lugares.'));
  SALAO.rows.forEach(row => {
    const line = el('div', 'prow');
    row.forEach(id => {
      const t = game.tables.find(x => x.id === id);
      const cell = el('div', 'pcell' + (t ? '' : ' vaga'));
      if (!t){ cell.appendChild(el('span', null, 'vaga')); line.appendChild(cell); return; }
      const name = el('b'); name.appendChild(el('small', null, 'Mesa ')); name.appendChild(document.createTextNode(String(id))); name.style.borderColor = CHAIRS[t.color].c;
      cell.appendChild(name);
      const seg = el('div', 'seg2');
      [2, 4].forEach(n => {
        const b = el('button', null, String(n)); b.type = 'button'; b.setAttribute('aria-label', 'Mesa ' + id + ': ' + n + ' lugares');
        b.setAttribute('aria-pressed', sal.seats[id] === n ? 'true' : 'false');
        b.addEventListener('click', () => { Sfx.init(); if (sal.seats[id] === n) return; if (game.setSeats(id, n)) Sfx.tap(); else Sfx.boing(); buildShop(); });
        seg.appendChild(b);
      });
      cell.appendChild(seg);
      if (!t.open){ cell.classList.add('off'); cell.title = 'Fechada no dia ' + game.shopNext; }
      line.appendChild(cell);
    });
    plan.appendChild(line);
  });
  if (game.tables.some(t => !t.open)) plan.appendChild(el('span', 'full', 'Mesas apagadas ficam fechadas no dia ' + game.shopNext + '; as novas abrem todo dia.'));
  if (game.salaoMsg) plan.appendChild(el('span', 'full msg', game.salaoMsg));
  grid.appendChild(plan);
  // cadeiras
  const capC = SALAO.maxChairs + 2 * sal.mesas;
  let c = staffCard(upgradeIcon('cadeira'), 'Cadeiras: ' + used + ' de ' + sal.chairs + ' em uso', livres ? livres + ' livres: use na planta acima.' : 'Para pôr 4 lugares numa mesa, tire 2 de outra ou compre mais.');
  c.appendChild(shopBtn(sal.chairs >= capC ? 'Cadeiras no máximo' : 'Comprar 2 cadeiras: ' + fmt(SALAO.chairPrice), 'btn', sal.chairs < capC && bank >= SALAO.chairPrice, () => game.buyChairs()));
  grid.appendChild(c);
  // mesa nova
  const why = salaoTableBlock(sal);
  c = staffCard(upgradeIcon('mesa'), 'Mesas: ' + (6 + sal.mesas) + ' de 8',
    sal.mesas >= 2 ? 'O salão está completo.' : (why || 'A mesa ' + (7 + sal.mesas) + ' entra na fileira de ' + (sal.mesas ? 'baixo' : 'cima') + ', com 2 cadeiras.'));
  if (sal.mesas < 2) c.appendChild(shopBtn('Comprar mesa: ' + fmt(SALAO.tablePrice), 'btn', !why && bank >= SALAO.tablePrice, () => game.buyTable()));
  grid.appendChild(c);
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
  const sal = game.tables.filter(t => t.open);
  const c = staffCard(upgradeIcon('contas'), 'Contas do dia ' + n,
    'Aluguel ' + fmt(CONTAS.aluguel) + ' + luz e gás de ' + sal.length + ' mesas abertas (' + fmt(CONTAS.mesa) + ' cada) e ' + sal.reduce((a, t) => a + t.seats, 0) + ' lugares (' + fmt(CONTAS.lugar) + ' cada) = ' + fmt(contasDia(game.tables)) + ', no fim do dia. Ingredientes: ' + Math.round(INGRED.prato * 100) + '% da conta de cada prato que fica pronto e ' + fmt(INGRED.suco) + ' por suco.');
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
  cx.forEach(r => out.push('Dia ' + r.d + (r.ok ? ' ✓' : ' ✗') + ': fatura ' + r.fat + ' − ingred. ' + r.ingr + ' − contas ' + r.contas + ' − equipe ' + r.folha + (r.div ? ' − divulg. ' + r.div : '') +
    ' = lucro ' + r.lucro + ' (meta ' + r.meta + ')' + (r.perd ? ' · ' + r.perd + (r.perd > 1 ? ' perdidos' : ' perdido') : '') + (r.mel + r.sal ? ' · compras ' + (r.mel + r.sal) : '') + ' · saldo ' + r.saldo));
  if (cx.length) out.push('Para onde foi (' + cx.length + (cx.length > 1 ? ' dias' : ' dia') + '): ' + caixaTotais(cx).filter(t => t.v).map(t => t.name.toLowerCase() + ' ' + t.v).join(', '));
  const ups = UPGRADES.filter(u => save.up[u.id]).map(u => u.name.toLowerCase());
  out.push('Agora: ' + fmt(save.bank) + ' · Tonhão nível ' + (eq.tonhao + 1) + ', ' + (eq.dani ? 'Dani nível ' + eq.dani : 'sem Dani') + (eq.couvert ? ', couvert' : '') +
    ' · ' + divulgaOf(save.divulga).name.toLowerCase() + ' · ' + (6 + sal.mesas) + ' mesas e ' + sal.chairs + ' cadeiras · melhorias: ' + (ups.join(', ') || 'nenhuma'));
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
  [['Dia'], ['Faturou'], ['Ingred.', 'Ingredientes'], ['Contas', 'Aluguel, luz e gás'], ['Equipe', 'Folha da equipe e divulgação'], ['Lucro', 'Lucro do dia (a meta)'], ['Compras', 'Melhorias e salão comprados antes do dia'], ['Saldo', 'Dinheiro acumulado ao fim do dia']].forEach((h, i) => { const th = el('th', i ? 'n' : null, h[0]); th.setAttribute('scope', 'col'); if (h[1]) th.title = h[1]; head.appendChild(th); });
  tb.appendChild(head);
  cx.slice().reverse().forEach(r => {
    const tr = el('tr');
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
  onde.appendChild(el('b', null, 'Para onde foi o dinheiro ' + (cx.length > 1 ? 'nos últimos ' + cx.length + ' dias' : 'no último dia') + ': ' + fmt(soma)));
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
  $('shop-limit').textContent = game.shopBought ? 'Melhoria do dia ' + game.shopNext + ' já escolhida.' : 'Você pode levar 1 melhoria antes do dia ' + game.shopNext + '.';
  $('btn-shop-go').textContent = 'Começar o dia ' + game.shopNext;
  const f = payroll(game.save.equipe), dv = game.shopNext >= DIVULGA_DIA ? divulgaOf(game.save.divulga) : null;
  $('shop-folha').textContent = (f ? 'Folha ' + fmt(f) : 'Sem folha') + (dv ? ' + ' + dv.name.toLowerCase() + ' ' + fmt(dv.cost) : '') + ' ao abrir; contas ' + fmt(contasDia(game.tables)) + ' e ingredientes no fim do dia. A meta é o lucro.';
  grid.className = 'shopgrid' + (shopTab === 'salao' || shopTab === 'caixa' ? ' ' + shopTab : '');
  ['salao', 'caixa'].forEach(k => $('ov-shop').classList[shopTab === k ? 'add' : 'remove'](k));
  if (shopTab === 'equipe') return buildEquipe(grid);
  if (shopTab === 'salao') return buildSalao(grid);
  if (shopTab === 'divulga') return buildDivulga(grid);
  if (shopTab === 'caixa') return buildCaixa(grid);
  UPGRADES.forEach(u => {
    const own = !!game.up[u.id];
    const card = el('div', 'item' + (own ? ' own' : ''));
    card.appendChild(upgradeIcon(u.id));
    card.appendChild(el('b', null, u.name));
    card.appendChild(el('span', null, u.desc));
    const b = el('button', 'btn', own ? 'Já comprado' : ('Comprar ' + fmt(u.cost)));
    b.type = 'button';
    if (own || game.shopBought || game.save.bank < u.cost) b.disabled = true;
    b.addEventListener('click', () => { if (game.buy(u.id)) buildShop(); });
    card.appendChild(b);
    grid.appendChild(card);
  });
}
(function(){ const box = $('shop-tabs'); if (box) Array.prototype.forEach.call(box.querySelectorAll('button'), b => b.addEventListener('click', () => { Sfx.init(); Sfx.tap(); shopTab = b.getAttribute('data-v'); buildShop(); })); })();

