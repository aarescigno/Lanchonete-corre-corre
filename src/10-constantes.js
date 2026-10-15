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

const TABLE_DEFS = [
  { id:1, cx:260, cy:205, seats:2, color:0 },
  { id:2, cx:430, cy:205, seats:2, color:1 },
  { id:3, cx:600, cy:205, seats:2, color:2 },
  { id:4, cx:260, cy:415, seats:2, color:3 },
  { id:5, cx:430, cy:415, seats:4, color:2 },
  { id:6, cx:600, cy:415, seats:4, color:0 }
];
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
const LAYOUT = { W, H, QUEUE, DOOR, STATIONS, PLATE_SLOTS, BOUNDS, TABLE_DEFS };
/* ============================================================
   SALÃO (v6): na lojinha, cada mesa tem 2 ou 4 lugares (as cadeiras são
   compradas em pares) e dá para comprar 2 mesas novas, uma na ponta direita
   de cada fileira. Com 3 mesas, a fileira usa as colunas de sempre; com 4,
   as mesas se espremem e só 1 delas cabe com 4 lugares.
   ============================================================ */
const SALAO = { rows:[[1,2,3,7],[4,5,6,8]], ys:[205,415], cols:[260,430,600], x0:196, x1:684, gap:46,
  chairs:16, maxChairs:24, chairPrice:60, tablePrice:300, colors:{ 7:3, 8:1 } };
/* centros das mesas de uma fileira, pelos lugares de cada uma; null se não cabem */
function rowLayout(seats){
  const k = seats.length;
  if (k <= SALAO.cols.length) return SALAO.cols.slice(0, k);
  const w = seats.map(n => 2 * tableHalfW({ seats:n }));
  const free = SALAO.x1 - SALAO.x0 - w.reduce((a, b) => a + b, 0);
  if (free < SALAO.gap * (k - 1)) return null;
  const gap = Math.min(free / (k - 1), Math.max(SALAO.gap, free / (k - 0.4)));
  let x = SALAO.x0 + (free - gap * (k - 1)) / 2;
  return w.map(wi => { const c = Math.round(x + wi / 2); x += wi + gap; return c; });
}
function salaoIds(sal){ return SALAO.rows.map(row => row.filter(id => id <= 6 || id - 6 <= sal.mesas)); }
function salaoUsed(sal){ return salaoIds(sal).reduce((a, ids) => a + ids.reduce((b, id) => b + sal.seats[id], 0), 0); }
function salaoOk(sal){ return salaoUsed(sal) <= sal.chairs && salaoIds(sal).every(ids => !!rowLayout(ids.map(id => sal.seats[id]))); }
function salaoDefs(sal){
  const out = [];
  salaoIds(sal).forEach((ids, r) => {
    const xs = rowLayout(ids.map(id => sal.seats[id]));
    ids.forEach((id, i) => out.push({ id, cx:xs[i], cy:SALAO.ys[r], seats:sal.seats[id], color: id <= 6 ? TABLE_DEFS[id-1].color : SALAO.colors[id] }));
  });
  return out.sort((a, b) => a.id - b.id);
}
/* por que a próxima mesa não pode ser comprada ('' se pode, sem contar o dinheiro) */
function salaoTableBlock(sal){
  if (sal.mesas >= 2) return 'O salão já tem 8 mesas.';
  const id = 7 + sal.mesas;
  const next = { seats:Object.assign({}, sal.seats, { [id]:2 }), chairs:sal.chairs + 2, mesas:sal.mesas + 1 };
  return salaoOk(next) ? '' : 'Para caber a mesa ' + id + ', deixe só 1 mesa de 4 lugares na fileira de ' + (id === 7 ? 'cima' : 'baixo') + '.';
}
function normSalao(s){
  s = (s && typeof s === 'object') ? s : {};
  const mesas = clamp(Math.round(+s.mesas) || 0, 0, 2), def = {};
  TABLE_DEFS.forEach(d => { def[d.id] = d.seats; });
  for (let i = 1; i <= mesas; i++) def[6 + i] = 2;
  const base = SALAO.chairs + 2 * mesas;
  const out = { seats:Object.assign({}, def), chairs:clamp(Math.round(+s.chairs) || 0, base, SALAO.maxChairs + 2 * mesas), mesas };
  const src = (s.seats && typeof s.seats === 'object') ? s.seats : {};
  Object.keys(def).forEach(id => { const v = +src[id]; if (v === 2 || v === 4) out.seats[id] = v; });
  if (!salaoOk(out)) out.seats = Object.assign({}, def);
  if (!salaoOk(out)) Object.keys(def).forEach(id => { out.seats[id] = 2; });
  return out;
}

const HEART_MULT = [0, 0.6, 0.8, 1, 1.25, 1.5];
const PAT = { queue:7, wantOrder:6, ordered:9, wantBill:7 };   // segundos por coração (base)
/* jogo justo (v7.1): sem mesa livre onde o grupo caiba, a paciência na fila corre mais devagar (ritmo)
   e, na carreira, não passa de 1 coração com metade da paciência dele (piso). Mesa suja conta como
   mesa que serve (é só recolher a louça). No Turno sem fim vale o ritmo, mas não o piso */
const FILA_JUSTA = { ritmo:0.4, piso:0.5 };
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
  couvert: { pay:80, fee:3, effect:0.2, feeCut:0.5 }
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
function payroll(eq){
  let v = STAFF.tonhao.levels[eq.tonhao].pay;
  if (eq.dani) v += STAFF.dani.levels[eq.dani].pay;
  if (eq.couvert) v += STAFF.couvert.pay;
  return v;
}
/* pratos limpos na cozinha: sem limite nos dias 1 e 2; depois, mesas abertas (−1 nos dias 6 e 7); no Turno sem fim, 6 */
function dishStock(day, up){
  const extra = up && up.pratos ? 1 : 0;
  if (day.endless) return 5 + extra;
  if (day.n <= 2) return Infinity;
  return Math.min(3, day.tables.length - 2) + extra;
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
  { n:1, tables:[1,2,4],         groups:6,  types:['estudante','vovos'],                                   nu:null,         meta:200, expert:320,  time:150, speed:0.60, note:'' },
  { n:2, tables:[1,2,4,5],       groups:9,  types:['estudante','vovos','familia'],                         nu:'familia',    meta:300, expert:720,  time:160, speed:0.60, note:'Chegou a família! Grupos de 3 ou 4 só cabem nas mesas de 4 lugares. Na lojinha, aba Salão, dá para comprar cadeiras e mesas.' },
  { n:3, tables:[1,2,3,4,5],     groups:13, types:['estudante','vovos','familia','executiva'],             nu:'executiva',  meta:380, expert:880,  time:170, speed:0.60, juice:0.3, note:'O movimento aumentou e agora só há 3 pratos limpos: sozinha a Bia não dá conta, contrate ajuda na lojinha. A executiva tem pouca paciência, mas deixa boa gorjeta. E abriu o balcão de sucos: quem pede suco quer receber antes da conta!' },
  { n:4, tables:[1,2,3,4,5,6],   groups:15, types:['estudante','vovos','familia','executiva','entregador'], nu:'entregador', meta:300, expert:780, time:180, speed:0.58, juice:0.3, note:'O entregador de moto tem pressa: pouquíssima paciência!' },
  { n:5, tables:[1,2,3,4,5,6],   groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:480, expert:1100, time:190, speed:0.56, vip:0.15, juice:0.3, note:'Chegou cliente VIP (de óculos escuros e plaquinha dourada)! Fura a fila e tem menos paciência, mas paga gorjeta extra e um bônus se sair com 5 corações. Se sair bravo, a multa dobra.' },
  { n:6, tables:[1,2,3,4,5,6],   groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:460, expert:1100, time:200, speed:0.54, vip:0.15, juice:0.3, note:'Sexta-feira: ninguém quer esperar.' },
  { n:7, tables:[1,2,3,4,5,6],   groups:17, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:600, expert:1250, time:220, speed:0.52, vip:0.15, juice:0.3, note:'Tonhão está gripado: a cozinha anda mais devagar hoje.' }
];

/* 2ª estrela: metade do caminho entre a meta e a expert (arredondada a R$ 25). Antes ela exigia a expert
   com algum cliente perdido, e como cada perda custa caro, quem batia a expert quase sempre levava 3 */
function bomGoal(d){ return Math.round((d.meta + d.expert) / 50) * 25; }

/* ============================================================
   CONTAS (v7): a meta do dia é o lucro. Ingredientes saem de cada prato que fica
   pronto (e de cada suco entregue), as contas do dia crescem com o salão aberto e,
   do dia 3 em diante, a divulgação decide quanta gente aparece
   ============================================================ */
const CONTAS = { aluguel:120, mesa:30, lugar:6 };     // por dia: aluguel + luz e gás de cada mesa aberta e de cada lugar
const INGRED = { prato:0.6, suco:5 };               // prato: fração da conta (cobrada quando fica pronto); suco: R$ por copo entregue
const DIVULGA = [
  { id:'boca',     name:'Boca a boca',   cost:0,   groups:[0.6, 0.9], vip:1,   desc:'Vem menos gente e o movimento varia: pode ser um dia fraco.' },
  { id:'panfleto', name:'Panfletos',     cost:40,  groups:[1, 1],     vip:1,   desc:'O movimento normal do dia.' },
  { id:'redes',    name:'Redes sociais', cost:100, groups:[1.2, 1.2], vip:1.5, desc:'+20% de grupos e, do dia 5 em diante, 50% mais VIPs. Precisa de lugar para tanta gente!' }
];
const DIVULGA_DIA = 3;                                // antes disso, o movimento é o da inauguração (sem custo)
function divulgaOf(id){ return DIVULGA.find(d => d.id === id) || DIVULGA[1]; }
/* contas do dia: aluguel fixo, mais cada mesa aberta e cada lugar dela */
function contasDia(tables){
  const open = tables.filter(t => t.open);
  return CONTAS.aluguel + CONTAS.mesa * open.length + CONTAS.lugar * open.reduce((a, t) => a + t.seats, 0);
}

const ENDLESS = { n:0, tables:[1,2,3,4,5,6], groups:0, types:['estudante','vovos','familia','executiva','entregador'], nu:null, meta:0, expert:0, time:0, speed:1, vip:0.12, juice:0.3, note:'', endless:true };

const UPGRADES = [
  { id:'tenis',      name:'Tênis novos',          desc:'A Bia anda 10% mais rápido.',                  cost:150 },
  { id:'agua',       name:'Água saborizada',      desc:'Jarra na entrada: quem toma 1 dose perde a paciência na fila 40% mais devagar. Rende ' + AGUA.cap + ' doses; recarregar custa R$ ' + AGUA.price + '.', cost:180 },
  { id:'cafeteira',  name:'Cafeteira de 2 bocas', desc:'O cafezinho devolve +2 corações.',             cost:200 },
  { id:'bandeja',    name:'Bandeja',              desc:'Leva 2 pratos, 3 bebidas, prato + bebida ou 2 pilhas de louça.', cost:220 },
  { id:'ventilador', name:'Ventilador de teto',   desc:'A freguesia come 15% mais rápido e o cheiro da lixeira cheia não incomoda.', cost:250 },
  { id:'pratos',     name:'Jogo de pratos',       desc:'+1 prato limpo na cozinha (do dia 3 em diante).', cost:300 }
];

