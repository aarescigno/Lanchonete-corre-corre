/* ============================================================
   CONSTANTES
   ============================================================ */
const W = 960, H = 600;
const PAL = {
  piso1:'#CFE8D6', piso2:'#F4EBD6', azulejo:'#FBFAF5', faixa:'#1F4FA3',
  formica:'#D8432F', cromo:'#B9C2CC', mostarda:'#F2B33D', tinta:'#22201C',
  ok:'#3E9B5A', alerta:'#E26A2C', perigo:'#C2362B',
  creme:'#F7EFD8', cromoEsc:'#8E99A6', inox:'#DDE3E9', cozinha:'#A9BCC4',
  madeira:'#B5733A', madeiraEsc:'#8A5226', branco:'#FFFFFF'
};
const FD = '"Bagel Fat One","Arial Black",system-ui,sans-serif';
const FB = 'Rubik,system-ui,-apple-system,"Segoe UI",sans-serif';

let RM = false;
try { RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch(e) {}

const CHAIRS = [
  { n:'vermelha', c:'#E0523C', d:'#B33A27' },
  { n:'azul',     c:'#3C7BD9', d:'#2B5AA6' },
  { n:'amarela',  c:'#F2C23D', d:'#C99A1E' },
  { n:'verde',    c:'#3E9B5A', d:'#2C7343' }
];
/* comandas: 6 cores distintas das cadeiras */
const CMD = [
  { n:'roxa',     c:'#7B4FB5' }, { n:'rosa',  c:'#E0559A' }, { n:'turquesa', c:'#1FA6A0' },
  { n:'laranja',  c:'#C9671E' }, { n:'marrom', c:'#7A4A2A' }, { n:'lima',    c:'#8DB531' }
];
const MOOD = { ok:'#3E9B5A', warn:'#F2B33D', bad:'#C2362B' };
const SKINS  = ['#F7D9BE','#EAB98F','#CE9566','#A8693F','#7B4A2C','#4E2D1B'];
const HAIRC  = ['#1B1512','#2F1D12','#5B3A21','#A67B43','#8C8C8C','#E8E8E8','#7A2E1B'];
const PANTS  = ['#2F3E5C','#4A4036','#5B5F6B','#3C5A4A','#6A3F52'];
const DISHES = ['pf','pastel','coxinha','misto'];

const QUEUE = { x:78, ys:[178, 264, 350, 436], max:4 };
const DOOR  = { x:56, y:100 };
const STATIONS = {
  order:  { ap:{x:744,y:150}, rect:{x:766,y:96, w:194,h:108} },
  plates: { ap:{x:744,y:256}, rect:{x:766,y:206,w:194,h:98 } },
  coffee: { ap:{x:744,y:350}, rect:{x:766,y:306,w:97, h:88 } },
  juice:  { ap:{x:744,y:350}, rect:{x:863,y:306,w:97, h:88 } },
  sink:   { ap:{x:744,y:452}, rect:{x:766,y:396,w:194,h:140} },
  trash:  { ap:{x:684,y:520}, rect:{x:700,y:474,w:46,h:62 } },  // lixeira no chão, ao lado do balcão
  agua:   { ap:{x:182,y:180}, rect:{x:160,y:112,w:44,h:56 } }   // jarra de água saborizada na entrada
};
const PLATE_SLOTS = [ {x:806,y:270}, {x:848,y:270}, {x:890,y:270}, {x:932,y:270} ];
const BOUNDS = { x0:24, y0:112, x1:744, y1:528 };
const LAYOUT = { W, H, QUEUE, DOOR, STATIONS, PLATE_SLOTS, BOUNDS };
/* ============================================================
   PONTOS (v7.4): o nível do salão é o ponto. Por enquanto só a Garagem; a área
   industrial, a Avenida Brasil e o Terraço Suíça vêm nas etapas 3 e 4 do plano.
   nivel: o nível do salão (1 a 4); lugares: teto de lugares; area: onde as mesas podem ficar (a mesa inteira, com
   as cadeiras); espera: cadeiras lá fora (v7.5); cardapio: fator dos preços
   ============================================================ */
const PONTOS = [
  { id:'garagem', nome:'Garagem da Bia e do tio Tonhão', nivel:1, lugares:16, aluguel:0, mudanca:0, cardapio:1, area:{ x0:196, y0:150, x1:684, y1:500 }, espera:4 }
];
function pontoOf(id){ return PONTOS.find(p => p.id === id) || PONTOS[0]; }
/* ============================================================
   SALÃO (v7.4): as mesas (já com as cadeiras) são compradas uma a uma até o teto
   de lugares do ponto e arrumadas no editor da lojinha. Cada mesa fica a pelo
   menos `gap` px das outras e com caminho da Bia até ela; ao arrastar, encaixa
   numa grade de `grid` px. Os números seguem a ordem no salão (de cima para
   baixo, da esquerda para a direita)
   ============================================================ */
const SALAO = { gap:46, grid:10, kit:[2,2,2,4], mesa2:150, mesa4:250, virar:100, venda:0.5,
  v6:{ chairs:16, chairPrice:60, tablePrice:300 } };   // v6: o salão da v6 à v7.3, para a devolução
const MESA = { top:50, bot:62 };                     // a mesa ocupa do centro 50 px para cima (cadeiras de trás) e 62 para baixo
function mesaPreco(seats){ return seats === 4 ? SALAO.mesa4 : SALAO.mesa2; }
/* retângulo da mesa no chão (obstáculo dos caminhos) */
function mesaBox(x, y, seats){ const hx = tableHalfW({ seats }); return { x0:x - hx, x1:x + hx, y0:y - MESA.top, y1:y + MESA.bot }; }
function salaoLugares(mesas){ return mesas.reduce((a, m) => a + m.seats, 0); }
/* por que a mesa i não pode ficar onde está ('' se pode): fora da área útil ou perto demais de outra */
function mesaProblema(mesas, i, ponto){
  const m = mesas[i], a = ponto.area, b = mesaBox(m.x, m.y, m.seats), G = SALAO.gap;
  if (b.x0 < a.x0 || b.x1 > a.x1 || b.y0 < a.y0 || b.y1 > a.y1) return 'Fora do salão.';
  for (let j = 0; j < mesas.length; j++){
    if (j === i) continue;
    const o = mesaBox(mesas[j].x, mesas[j].y, mesas[j].seats);
    if (b.x0 < o.x1 + G && o.x0 < b.x1 + G && b.y0 < o.y1 + G && o.y0 < b.y1 + G) return 'Perto demais de outra mesa.';
  }
  return '';
}
/* a Bia (do balcão) e a freguesia (da fila) chegam a um dos lados de cada mesa? Usa os obstáculos do arranjo
   e devolve os do salão de antes */
function salaoCaminho(mesas){
  const prev = OBST.slice();
  setObst(mesas.map(m => ({ cx:m.x, cy:m.y, seats:m.seats })));
  const from = [STATIONS.order.ap, { x:QUEUE.x, y:QUEUE.ys[0] }];
  const ok = mesas.every(m => tableApproach({ cx:m.x, cy:m.y, seats:m.seats }).some(p =>
    p.x >= BOUNDS.x0 && p.x <= BOUNDS.x1 && !inObst(p.x, p.y) && from.every(f => pathOk(f, p))));
  OBST.length = 0; prev.forEach(o => OBST.push(o));
  return ok;
}
/* o arranjo todo ('' se vale): de 1 mesa ao teto de lugares, cada uma no lugar e com caminho */
function salaoProblema(mesas, ponto){
  if (!mesas.length) return 'O salão precisa de pelo menos 1 mesa.';
  if (salaoLugares(mesas) > ponto.lugares) return 'Passa de ' + ponto.lugares + ' lugares.';
  for (let i = 0; i < mesas.length; i++){ const w = mesaProblema(mesas, i, ponto); if (w) return w; }
  return salaoCaminho(mesas) ? '' : 'A Bia não chega a todas as mesas.';
}
/* números das mesas: de cima para baixo (mesas a menos de meia mesa de altura contam na mesma fileira), da esquerda para a direita */
function salaoOrdena(mesas){
  const by = mesas.slice().sort((a, b) => a.y - b.y || a.x - b.x), out = [];
  let row = [], y0 = 0;
  const flush = () => { out.push.apply(out, row.sort((a, b) => a.x - b.x)); row = []; };
  by.forEach(m => { if (row.length && m.y - y0 >= (MESA.top + MESA.bot) / 2) flush(); if (!row.length) y0 = m.y; row.push(m); });
  flush();
  return out;
}
const snapG = v => Math.round(v / SALAO.grid) * SALAO.grid;
/* arrumação automática: fileiras que ocupam a área de cima a baixo. As mesas mantêm a ordem do salão (números) e
   são divididas em fileiras seguidas, com a fileira mais larga o mais curta possível; na fileira, espaçadas por
   igual. Arrumar de novo não muda nada. null se não cabem */
function salaoAuto(mesas, ponto){
  const a = ponto.area, G = SALAO.gap, S = SALAO.grid, hRow = MESA.top + MESA.bot, W0 = a.x1 - a.x0;
  const nRows = Math.max(1, Math.floor((a.y1 - a.y0 - 2 * S + G) / (hRow + G)));
  const yTop = a.y0 + S + MESA.top, yBot = a.y1 - S - MESA.bot;
  const ys = []; for (let r = 0; r < nRows; r++) ys.push(Math.floor((nRows > 1 ? yTop + (yBot - yTop) * r / (nRows - 1) : (yTop + yBot) / 2) / S) * S);
  const l = salaoOrdena(mesas), wid = m => 2 * tableHalfW(m);
  const width = (i, j) => l.slice(i, j).reduce((s, m) => s + wid(m) + G + S, -G);   // com folga para o encaixe na grade
  // melhor divisão em até nRows fileiras seguidas (as mesas cabem em poucas fileiras: busca completa)
  let best = null, bestW = Infinity;
  const go = (i, r, cuts, mx) => {
    if (mx >= bestW) return;
    if (i === l.length){ best = cuts; bestW = mx; return; }
    if (r === nRows) return;
    for (let j = i + 1; j <= l.length; j++){ const w = width(i, j); if (w > W0) break; go(j, r + 1, cuts.concat([[i, j]]), Math.max(mx, w)); }
  };
  go(0, 0, [], 0);
  if (!best) return null;
  const out = [];
  best.forEach((c, r) => {
    const row = l.slice(c[0], c[1]), k = row.length;
    const free = W0 - row.reduce((s, m) => s + wid(m), 0);
    let gap = Math.max(free / k, G + S);
    if (gap * (k - 1) > free - k * S) gap = G;
    let x = a.x0 + Math.max(0, (free - gap * (k - 1)) / 2 - k * S / 2), right = 0;
    const xs = row.map(m => { const hx = tableHalfW(m), cx = Math.ceil((x + hx) / S) * S; x = cx + hx + gap; right = cx + hx; return cx; });
    const shift = right > a.x1 ? Math.ceil((right - a.x1) / S) * S : 0;
    row.forEach((m, i) => out.push(Object.assign({}, m, { x:xs[i] - shift, y:ys[best.length === 1 ? 0 : r] })));
  });
  const res = salaoOrdena(out);
  return salaoProblema(res, ponto) ? null : res;
}
/* primeiro lugar livre para uma mesa nova de `seats` lugares: primeiro nas fileiras que já existem, depois em
   qualquer altura (de cima para baixo, da esquerda para a direita); null se não há */
function salaoVaga(mesas, seats, ponto){
  const a = ponto.area, S = SALAO.grid, hx = tableHalfW({ seats });
  const ys = mesas.map(m => m.y).filter((y, i, l) => l.indexOf(y) === i).sort((p, q) => p - q);
  for (let y = Math.ceil((a.y0 + MESA.top) / S) * S; y + MESA.bot <= a.y1; y += S) if (ys.indexOf(y) < 0) ys.push(y);
  for (const y of ys){
    for (let x = Math.ceil((a.x0 + hx) / S) * S; x + hx <= a.x1; x += S){
      const l = mesas.concat([{ x, y, seats }]);
      if (!mesaProblema(l, l.length - 1, ponto) && salaoCaminho(l)) return { x, y };
    }
  }
  return null;
}
/* lugar válido mais perto de (x, y) para a mesa i (ao virar mesa de 4 ou ao soltar perto); null se não há */
function salaoPerto(mesas, i, ponto){
  const m = mesas[i], S = SALAO.grid;
  for (let d = 0; d <= 30; d++){
    for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++){
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue;
      const l = mesas.slice(); l[i] = Object.assign({}, m, { x:m.x + dx * S, y:m.y + dy * S });
      if (!mesaProblema(l, i, ponto) && salaoCaminho(l)) return l;
    }
  }
  return null;
}
/* cor da cadeira de uma mesa nova: a menos usada no salão */
function salaoCor(mesas){
  const n = [0, 0, 0, 0]; mesas.forEach(m => n[m.c]++);
  return n.indexOf(Math.min.apply(null, n));
}
function salaoKit(ponto){ return salaoAuto(SALAO.kit.map((seats, c) => ({ x:0, y:0, seats, c:c % 4 })), ponto); }
/* save do salão: { ponto, mesas:[{ x, y, seats, c }] }. Mesa estragada sai; passou do teto, saem as últimas;
   arranjo inválido vira o automático (e, se nem assim, o kit inicial) */
function normSalao(s){
  s = (s && typeof s === 'object') ? s : {};
  const ponto = pontoOf(s.ponto);
  let mesas = (Array.isArray(s.mesas) ? s.mesas : []).filter(m => m && typeof m === 'object' && (+m.seats === 2 || +m.seats === 4))
    .map((m, i) => ({ x:Math.round(+m.x) || 0, y:Math.round(+m.y) || 0, seats:+m.seats, c:(+m.c >= 0 && +m.c <= 3) ? Math.round(+m.c) : i % 4 }));
  while (salaoLugares(mesas) > ponto.lugares) mesas.pop();
  mesas = salaoOrdena(mesas);
  if (!mesas.length) mesas = salaoKit(ponto);
  else if (salaoProblema(mesas, ponto)) mesas = salaoAuto(mesas, ponto) || salaoKit(ponto);
  return { ponto:ponto.id, mesas };
}
/* salão da v6 à v7.3 (cadeiras e mesas numa planta fixa): o que o jogador gastou nele, para devolver */
function salaoDevolucao(s){
  if (!s || typeof s !== 'object' || Array.isArray(s.mesas) || !('chairs' in s || 'seats' in s)) return 0;
  const V = SALAO.v6, mesas = clamp(Math.round(+s.mesas) || 0, 0, 2);
  const pares = clamp(Math.floor(((Math.round(+s.chairs) || 0) - V.chairs - 2 * mesas) / 2), 0, 4);
  return mesas * V.tablePrice + pares * V.chairPrice;
}
/* Turno sem fim (v7.4): salão fixo de 6 mesas e 16 lugares (o de antes), igual para todo mundo no ranking */
const SALAO_SEMFIM = [2,2,2,4,2,4];

const HEART_MULT = [0, 0.6, 0.8, 1, 1.25, 1.5];
const PAT = { queue:7, wantOrder:6, ordered:9, wantBill:7 };   // segundos por coração (base)
/* jogo justo (v7.1): sem mesa livre onde o grupo caiba, a paciência na fila corre mais devagar (ritmo; 0,4 até a v7.4)
   e, na carreira, não passa de 1 coração com metade da paciência dele (piso). Mesa suja conta como
   mesa que serve (é só recolher a louça). No Turno sem fim vale o ritmo, mas não o piso */
const FILA_JUSTA = { ritmo:0.6, piso:0.5 };
/* porta que respeita a lotação (v7.1, carreira): com todas as mesas ocupadas e 3 ou mais grupos na fila,
   a próxima chegada espera (até `max` s cada uma; no total, até `total` do tempo do dia). O total de
   grupos do dia não muda, só o ritmo */
const PORTA = { fila:3, max:8, total:0.2 };

const CUSTOMER_TYPES = {
  estudante:  { label:'Estudante',   pat:1.0,  eat:[4.5,6.5], read:[3,4.5], size:[1,2], bill:[20,32], tip:0 },
  executiva:  { label:'Executiva',   pat:0.65, eat:[5,7],     read:[3,4],   size:[1,1], bill:[34,48], tip:0.25 },
  familia:    { label:'Família',     pat:0.95, eat:[7,9],     read:[5,6],   size:[3,4], bill:[44,60], tip:0 },
  vovos:      { label:'Vovô e vovó', pat:1.8,  eat:[8,9],     read:[4,6],   size:[2,2], bill:[28,42], tip:0 },
  entregador: { label:'Entregador',  pat:0.5,  eat:[3.5,5],   read:[3,3.5], size:[1,1], bill:[20,26], tip:0 }
};
/* cliente VIP: modificador de grupo (qualquer tipo menos entregador). Fura a fila, tem menos
   paciência, paga gorjeta extra e dá bônus se sair com 5 corações; bravo, a multa dobra. */
/* ============================================================
   EQUIPE (v5): a folha do dia é debitada do dinheiro acumulado ao abrir a
   lanchonete; sem dinheiro para pagar, o funcionário não trabalha naquele dia
   ============================================================ */
const STAFF = {
  // Tonhão: cozinha mais rápido (cook = fator do tempo), mais pratos caprichados (crit) e,
  // com aumento, lava 1 pilha da pia a cada `wash` segundos
  tonhao:  { levels:[ { slots:3, cook:1, crit:0.05, wash:0, pay:0 }, { slots:3, cook:0.85, crit:0.12, wash:7, pay:40 }, { slots:3, cook:0.7, crit:0.2, wash:4, pay:90 } ] },
  dani:    { levels:[ null, { speed:0.5, tasks:2, pay:60 }, { speed:0.65, tasks:2, pay:90 }, { speed:0.8, tasks:3, pay:135 } ] },
  // couvert artístico: só do nível 3 do salão em diante (Avenida Brasil, etapa 3 do plano)
  couvert: { pay:80, fee:3, effect:0.2, feeCut:0.5, nivel:3 },
  // ambiente da Garagem (v7.4.3): TV e som ligados o dia todo; o custo é a conta de luz (pay) e entra na folha
  tv:      { pay:15, effect:0.05 },
  som:     { pay:10, effect:0.05 }
};
const DANI_TASKS = [
  { id:'lixo',   name:'Tirar o lixo',   short:'Lixo' },
  { id:'pratos', name:'Retirar pratos sujos', short:'Recolher' },
  { id:'lavar',  name:'Lavar a louça',  short:'Lavar' },
  { id:'cafe',   name:'Servir cafezinho', short:'Cafezinho' },
  { id:'agua',   name:'Recarregar a água saborizada', short:'Água', need:'agua' }
];
/* tarefa que a Dani já pode exercer (a da água depende da melhoria comprada) */
function daniTaskOk(id, up){ const t = DANI_TASKS.find(d => d.id === id); return !!t && (!t.need || !!(up && up[t.need])); }
/* prato caprichado (acerto crítico do Tonhão): +1 coração e bônus na entrega */
const CRIT = { bonus:10, vipBonus:20 };
const WASH = { base:0.3, perPile:2.5 };               // segundos na pia
const TRASH = { cap:6, empty:2, smell:0.3 };         // lixeira: capacidade, tempo para esvaziar, cheiro quando cheia
function couvertEffect(eq){ return STAFF.couvert.effect * (eq.taxa ? 1 - STAFF.couvert.feeCut : 1); }
function couvertOk(ponto){ return (ponto || PONTOS[0]).nivel >= STAFF.couvert.nivel; }
/* ambiente do salão: quanto a paciência nas mesas cai mais devagar (TV, som e couvert se somam) */
function ambienteEffect(eq){
  return (eq.tv ? STAFF.tv.effect : 0) + (eq.som ? STAFF.som.effect : 0) + (eq.couvert ? couvertEffect(eq) : 0);
}
function payroll(eq){
  let v = STAFF.tonhao.levels[eq.tonhao].pay;
  if (eq.dani) v += STAFF.dani.levels[eq.dani].pay;
  if (eq.couvert) v += STAFF.couvert.pay;
  if (eq.tv) v += STAFF.tv.pay;
  if (eq.som) v += STAFF.som.pay;
  return v;
}
/* pratos limpos na cozinha: sem limite nos dias 1 e 2; depois, 4; no Turno sem fim, 5 (+1 com o Jogo de pratos) */
function dishStock(day, up){
  const extra = up && up.pratos ? 1 : 0;
  if (day.endless) return 5 + extra;
  if (day.n <= 2) return Infinity;
  return 4 + extra;
}

/* sucos: alguns grupos pedem junto com a comida; cada copo entregue vale JUICE.price */
const JUICE = { price:12, prep:0.6 };
/* valor de cada bebida; jogar uma na lixeira custa metade dele */
const DRINK_PRICE = { coffee:5, juice:JUICE.price };
/* água saborizada (melhoria): jarra com doses na entrada. Cada pessoa que espera na fila
   toma 1 dose e fica com a paciência 25% mais lenta; vazia, a Bia recarrega por um preço módico */
const AGUA = { cap:12, price:15, refill:0.8, slow:0.4 };   // slow: a paciência na fila cai 40% mais devagar
const VIP = { pat:0.75, tip:0.5, perfect:40, angry:30, dish:25, cook:1.8, types:['estudante','vovos','familia','executiva'] };   // dish: o prato especial soma R$ 25 à conta e leva 1,8× o tempo

const DAYS = [
  { n:1, groups:5,  types:['estudante','vovos'],                                   nu:null,         meta:200, expert:320,  time:150, speed:0.60, note:'' },
  { n:2, groups:8,  types:['estudante','vovos','familia'],                         nu:'familia',    meta:300, expert:720,  time:160, speed:0.60, note:'Chegou a família! Grupos de 3 ou 4 só cabem nas mesas de 4 lugares. Na lojinha, aba Salão, dá para comprar mesas e arrumar o salão.' },
  { n:3, groups:13, types:['estudante','vovos','familia','executiva'],             nu:'executiva',  meta:380, expert:880,  time:170, speed:0.60, juice:0.3, note:'O movimento aumentou e agora só há 4 pratos limpos: sozinha a Bia não dá conta, contrate ajuda na lojinha. A executiva tem pouca paciência, mas deixa boa gorjeta. E abriu o balcão de sucos: quem pede suco quer receber antes da conta!' },
  { n:4, groups:15, types:['estudante','vovos','familia','executiva','entregador'], nu:'entregador', meta:300, expert:780, time:180, speed:0.58, juice:0.3, note:'O entregador de moto tem pressa: pouquíssima paciência!' },
  { n:5, groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:480, expert:1100, time:190, speed:0.56, vip:0.15, juice:0.3, note:'Chegou cliente VIP (de óculos escuros e plaquinha dourada)! Fura a fila e tem menos paciência, mas paga gorjeta extra e um bônus se sair com 5 corações. Se sair bravo, a multa dobra.' },
  { n:6, groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:460, expert:1100, time:200, speed:0.54, vip:0.15, juice:0.3, note:'Sexta-feira: ninguém quer esperar.' },
  { n:7, groups:17, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:600, expert:1250, time:220, speed:0.52, vip:0.15, juice:0.3, note:'Tonhão está gripado: a cozinha anda mais devagar hoje.' }
];

/* 2ª estrela: metade do caminho entre a meta e a expert (arredondada a R$ 25). Antes ela exigia a expert
   com algum cliente perdido, e como cada perda custa caro, quem batia a expert quase sempre levava 3 */
function bomGoal(d){ return Math.round((d.meta + d.expert) / 50) * 25; }

/* ============================================================
   CONTAS (v7): a meta do dia é o lucro. Ingredientes saem de cada prato que fica
   pronto (e de cada suco entregue), as contas do dia crescem com o salão (e com o
   aluguel do ponto; a Garagem não paga) e,
   do dia 3 em diante, a divulgação decide quanta gente aparece
   ============================================================ */
const CONTAS = { mesa:30, lugar:6 };                 // por dia: o aluguel do ponto + luz e gás de cada mesa aberta e de cada lugar
const INGRED = { prato:0.6, suco:5 };               // prato: fração da conta (cobrada quando fica pronto); suco: R$ por copo entregue
const DIVULGA = [
  { id:'boca',     name:'Boca a boca',   cost:0,   groups:[0.6, 0.9], vip:1,   desc:'Vem menos gente e o movimento varia: pode ser um dia fraco.' },
  { id:'panfleto', name:'Panfletos',     cost:40,  groups:[1, 1],     vip:1,   desc:'O movimento normal do dia.' },
  { id:'redes',    name:'Redes sociais', cost:100, groups:[1.2, 1.2], vip:1.5, desc:'+20% de grupos e, do dia 5 em diante, 50% mais VIPs. Precisa de lugar para tanta gente!' }
];
/* movimento do salão (v7.4.1): cada lugar acima dos 10 do kit traz `porLugar` a mais de grupos no dia
   (salão cheio chama gente). Sem isso, mesa a mais só dava conta de luz e gás */
const MOVIMENTO = { kit:10, porLugar:0.06 };
function movimentoSalao(lugares){ return 1 + MOVIMENTO.porLugar * Math.max(0, lugares - MOVIMENTO.kit); }
const CAIXA_MAX = 14;                                 // livro-caixa (v7.2): quantos dias da carreira ficam guardados
const VERSAO = 'v7.4.3';                              // vai no resumo do Caixa
const DIVULGA_DIA = 3;                                // antes disso, o movimento é o da inauguração (sem custo)
function divulgaOf(id){ return DIVULGA.find(d => d.id === id) || DIVULGA[1]; }
/* contas do dia: o aluguel do ponto (v7.4; a Garagem é da família), mais cada mesa aberta e cada lugar dela */
function contasDia(tables, ponto){
  const open = tables.filter(t => t.open);
  return (ponto || PONTOS[0]).aluguel + CONTAS.mesa * open.length + CONTAS.lugar * open.reduce((a, t) => a + t.seats, 0);
}

const ENDLESS = { n:0, groups:0, types:['estudante','vovos','familia','executiva','entregador'], nu:null, meta:0, expert:0, time:0, speed:1, vip:0.12, juice:0.3, note:'', endless:true };

/* Bia (v7.3): velocidade de base em px/s e o ganho de cada nível dos tênis */
const BIA_SPEED = { base:300, tenis:1.1, corrida:1.2 };

const UPGRADES = [
  { id:'tenis',      name:'Tênis novos',          desc:'A Bia anda 10% mais rápido. Depois, libera os Tênis de corrida.', cost:150 },
  { id:'corrida',    name:'Tênis de corrida',     desc:'2º nível dos tênis: a Bia anda 20% mais rápido (em vez de 10%).', cost:350, req:'tenis' },
  { id:'agua',       name:'Água saborizada',      desc:'Jarra na entrada: quem toma 1 dose perde a paciência na fila 40% mais devagar. Rende ' + AGUA.cap + ' doses; recarregar custa R$ ' + AGUA.price + '.', cost:180 },
  { id:'cafeteira',  name:'Cafeteira de 2 bocas', desc:'O cafezinho devolve +2 corações.',             cost:200 },
  { id:'bandeja',    name:'Bandeja',              desc:'Leva 2 pratos, 3 bebidas, prato + bebida ou 2 pilhas de louça.', cost:220 },
  { id:'ventilador', name:'Ventilador de teto',   desc:'A freguesia come 15% mais rápido e o cheiro da lixeira cheia não incomoda.', cost:250 },
  { id:'pratos',     name:'Jogo de pratos',       desc:'+1 prato limpo na cozinha (do dia 3 em diante).', cost:300 }
];

