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
/* cardápio (v8.3.8, preços de verdade): R$ de cada prato na Garagem (o ponto multiplica por PONTOS.cardapio).
   Pesquisa de out/2026: PF médio no Brasil R$ 31,90 (o da garagem sai mais barato), coxinha e pastel de R$ 4 a 8 */
const CARDAPIO = { pf:{ nome:'PF', preco:25 }, misto:{ nome:'Misto quente', preco:12 }, pastel:{ nome:'Pastel', preco:10 }, coxinha:{ nome:'Coxinha', preco:8 } };
function precoPrato(k, ponto){ return Math.round(CARDAPIO[k].preco * (ponto || PONTOS[0]).cardapio); }
/* o 2º item (v8.3.8): na hora de pedir, cada pessoa pode querer mais um salgado (chance `mais` do tipo; no máximo 2 itens
   por pessoa). Vai na mesma comanda e no mesmo prato, para não travar a mesa; a cozinha leva `cozinha` a mais de tempo
   por item a mais (em fração dos itens do grupo). Pedir depois de comer travava a mesa e derrubava o lucro */
const MAIS = { cozinha:0.4, pratos:['misto','pastel','coxinha'] };
/* pontos de atendimento (v8.3.8): as ações da Bia não dão mais dinheiro, dão pontos (a nota da lanchonete virá
   deles). A corrente e a cor certa também viram pontos */
const PONTOS_ACAO = { sit:10, take:15, deliver:20, clear:10, coffee:5, juice:5, bill:20, cor:15, marmita:20 };

/* calçada (v7.5): o mundo vai de -CALCADA.w (a rua) até W; a espera fica lá fora, no lugar da fila de antes.
   Tela larga (v7.6): a tela tem TW px e mostra o mundo inteiro, sem rolar (Game.cam = CALCADA.w: onde o mundo
   começa na tela). No celular deitado (~2:1), tudo fica do mesmo tamanho de antes */
const CALCADA = { w:260 };
const TW = W + CALCADA.w;
/* lugares da espera, do 1º da fila ao último (v8.1.2): o 1º fica embaixo, perto da torneira, e quem chega depois
   fica acima dele, do lado da rua por onde chega. v8.6: um pouco mais juntos e mais para baixo (eram 436 a 178), para
   caber o balcão de retirada no alto da calçada */
const QUEUE = { x:-132, ys:[476, 396, 316, 236], max:4 };
/* fila de retirada (v8.6): os entregadores esperam em pé no alto da calçada, à esquerda do balcão de retirada (o 1º
   encostado nele); balcao: o tampo com a prateleira das marmitas (3 vagas: x de cada uma) */
const RETIRADA = { fila:[{ x:-114, y:160 }, { x:-160, y:160 }, { x:-206, y:160 }], balcao:{ x0:-92, x1:-14, y:112 }, vagas:[-76, -53, -30] };
const DOOR  = { x:-300, y:106 };                     // de onde a freguesia vem (e para onde vai): a rua, à esquerda
/* HUD na tela larga (v7.6): dia e lucro à esquerda, como antes; a fila de ações anda `fila` px e as mãos, a pausa e
   o som, `dir` px (para a direita) */
const HUDX = { fila:CALCADA.w / 2, dir:CALCADA.w };
const STATIONS = {
  order:  { ap:{x:744,y:150}, rect:{x:766,y:96, w:194,h:108} },
  plates: { ap:{x:744,y:256}, rect:{x:766,y:206,w:194,h:98 } },
  coffee: { ap:{x:744,y:350}, rect:{x:766,y:306,w:97, h:88 } },
  juice:  { ap:{x:744,y:350}, rect:{x:863,y:306,w:97, h:88 } },
  sink:   { ap:{x:744,y:452}, rect:{x:766,y:396,w:194,h:140} },
  trash:  { ap:{x:684,y:520}, rect:{x:700,y:474,w:46,h:62 } },  // lixeira no chão, ao lado do balcão
  retirada:{ ap:{x:16,y:156}, rect:{x:-94,y:98,w:90,h:80 } },
  adiantar:{ ap:{x:744,y:150}, rect:{x:852,y:150,w:62,h:36} },  // o botãozinho de adiantar marmita (v8.6), na janela de pedidos  // balcão de retirada das marmitas (v8.6), na calçada, ao lado do portão (a Bia atende de dentro)
  maquina:{ ap:{x:-26,y:498}, rect:{x:-110,y:452,w:62,h:84 } }  // bebida da espera (v7.5), na calçada: na Garagem, a torneira (v7.7)
};
const PLATE_SLOTS = [ {x:806,y:270}, {x:848,y:270}, {x:890,y:270}, {x:932,y:270} ];
const BOUNDS = { x0:16 - CALCADA.w, y0:112, x1:744, y1:528 };
const LAYOUT = { W, H, TW, HUDX, CALCADA, QUEUE, RETIRADA, DOOR, STATIONS, PLATE_SLOTS, BOUNDS };
/* ============================================================
   PONTOS (v7.4): o nível do salão é o ponto. Por enquanto só a Garagem; a área
   industrial, a Avenida Brasil e o Terraço Suíça vêm nas etapas 3 e 4 do plano.
   nivel: o nível do salão (1 a 4); lugares: teto de lugares; area: onde as mesas podem ficar (a mesa inteira, com
   as cadeiras); espera: lugares lá fora (v7.5); cardapio: fator dos preços; assento: como se espera lá fora e
   bebida: o que se serve lá (v7.7; ver BEBIDA_ESPERA). Na Garagem, de pé e água da torneira. credito: o limite do
   empréstimo no banco (v8.3)
   ============================================================ */
const PONTOS = [
  { id:'garagem', nome:'Garagem da mãe da Bia', nivel:1, lugares:16, aluguel:0, mudanca:0, credito:1000, cardapio:1, area:{ x0:196, y0:150, x1:684, y1:500 }, espera:4, assento:'pe', bebida:'agua' }
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
/* save do salão: { ponto, mesas:[{ x, y, seats, c }], estoque:[{ seats, c }] }. O estoque (v8.3.5) guarda mesas
   fora do salão: não abrem no dia nem pagam luz e gás, mas contam no teto de lugares. Mesa estragada sai; passou
   do teto, saem as do estoque e depois as últimas do salão; arranjo inválido vira o automático (e, se nem assim,
   o kit inicial) */
function normSalao(s){
  s = (s && typeof s === 'object') ? s : {};
  const ponto = pontoOf(s.ponto);
  const lista = l => (Array.isArray(l) ? l : []).filter(m => m && typeof m === 'object' && (+m.seats === 2 || +m.seats === 4))
    .map((m, i) => ({ x:Math.round(+m.x) || 0, y:Math.round(+m.y) || 0, seats:+m.seats, c:(+m.c >= 0 && +m.c <= 3) ? Math.round(+m.c) : i % 4 }));
  let mesas = lista(s.mesas);
  const estoque = lista(s.estoque).map(m => ({ seats:m.seats, c:m.c })), tot = () => salaoLugares(mesas) + salaoLugares(estoque);
  while (tot() > ponto.lugares && estoque.length) estoque.pop();
  while (salaoLugares(mesas) > ponto.lugares) mesas.pop();
  mesas = salaoOrdena(mesas);
  if (!mesas.length && estoque.length) mesas = salaoAuto([estoque.shift()], ponto) || [];
  if (!mesas.length) mesas = salaoKit(ponto);
  else if (salaoProblema(mesas, ponto)) mesas = salaoAuto(mesas, ponto) || salaoKit(ponto);
  while (tot() > ponto.lugares) estoque.pop();
  return { ponto:ponto.id, mesas, estoque };
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

/* gorjeta pelos corações na hora da conta (v8.3.8; antes, com 5 corações a conta saía 50% maior): no máximo +10%;
   com 1 ou 2 o grupo reclama e ganha desconto */
const GORJETA = [0, -0.2, -0.1, 0, 0.05, 0.1];
const PAT = { queue:7, wantOrder:6, ordered:9, wantBill:7, retirada:9 };   // segundos por coração (base); retirada (v8.6): o entregador no balcão
/* jogo justo (v7.1): sem mesa livre onde o grupo caiba, a paciência na fila corre mais devagar (ritmo; 0,4 até a v7.4)
   e, na carreira, não passa de 1 coração com metade da paciência dele (piso). Mesa suja conta como
   mesa que serve (é só recolher a louça). No Turno sem fim vale o ritmo, mas não o piso */
const FILA_JUSTA = { ritmo:0.6, piso:0.5 };
/* porta que respeita a lotação (v7.1, carreira): com todas as mesas ocupadas e 3 ou mais grupos na fila,
   a próxima chegada espera (até `max` s cada uma; no total, até `total` do tempo do dia). O total de
   grupos do dia não muda, só o ritmo */
const PORTA = { fila:3, max:8, total:0.2 };

/* prefere: os pratos que cada tipo escolhe (sorteio com repetição); mais: chance de cada pessoa pedir um 2º item (v8.3.8);
   tip: gorjeta a mais, em fração da conta */
const CUSTOMER_TYPES = {
  estudante:  { label:'Estudante',   pat:1.0,  eat:[4.5,6.5], read:[3,4.5], size:[1,2], prefere:['pf','pf','misto','pastel','coxinha'],     mais:0.3, tip:0 },
  executiva:  { label:'Executiva',   pat:0.65, eat:[5,7],     read:[3,4],   size:[1,1], prefere:['pf','pf','pf','misto'],                    mais:0.1, tip:0.1 },
  familia:    { label:'Família',     pat:0.95, eat:[7,9],     read:[5,6],   size:[3,4], prefere:['pf','pf','pf','misto','pastel'],         mais:0.35,  tip:0 },
  vovos:      { label:'Vovô e vovó', pat:1.8,  eat:[8,9],     read:[4,6],   size:[2,2], prefere:['pf','pf','pf','misto'],                  mais:0.25,  tip:0 },
  entregador: { label:'Entregador',  pat:0.5,  eat:[3.5,5],   read:[3,3.5], size:[1,1], prefere:['pf','pf','misto','coxinha'],             mais:0.1, tip:0 }
};
/* cliente VIP: modificador de grupo (qualquer tipo menos entregador). Fura a fila, tem menos
   paciência, paga gorjeta extra e dá bônus se sair com 5 corações; bravo, a multa dobra. */
/* ============================================================
   EQUIPE (v5): a folha do dia fica reservada ao abrir a lanchonete e é paga
   no fim do dia (v8.2.2); sem dinheiro para pagar, o funcionário não trabalha naquele dia
   ============================================================ */
const STAFF = {
  // Tonhão: cozinha mais rápido (cook = fator do tempo), mais pratos caprichados (crit) e,
  // com aumento, lava 1 pilha da pia a cada `wash` segundos
  tonhao:  { levels:[ { slots:3, cook:1, crit:0.05, wash:0, pay:0 }, { slots:3, cook:0.85, crit:0.12, wash:7, pay:15 }, { slots:3, cook:0.7, crit:0.2, wash:4, pay:30 } ] },
  dani:    { levels:[ null, { speed:0.5, tasks:2, pay:40 }, { speed:0.65, tasks:2, pay:50 }, { speed:0.8, tasks:3, pay:60 } ] },
  // couvert artístico: só do nível 3 do salão em diante (Avenida Brasil, etapa 3 do plano)
  couvert: { pay:80, fee:3, effect:0.2, feeCut:0.5, nivel:3 },
  // ambiente da Garagem (v7.4.3): TV e som ligados o dia todo; o custo é a conta de luz (pay) e entra na folha
  tv:      { pay:3, effect:0.05 },
  som:     { pay:2, effect:0.05 }
};
const DANI_TASKS = [
  { id:'lixo',   name:'Tirar o lixo',   short:'Lixo' },
  { id:'pratos', name:'Retirar pratos sujos', short:'Recolher' },
  { id:'lavar',  name:'Lavar a louça',  short:'Lavar' },
  { id:'cafe',   name:'Servir cafezinho', short:'Cafezinho' },
  { id:'suco',   name:'Levar a água da espera', short:'Água', need:'maquina' },   // o suco da espera da v7.5 (água na Garagem desde a v7.7)
  { id:'marmita', name:'Levar as marmitas', short:'Marmita' }   // v8.6: da janela de prontos ao balcão de retirada
];
/* tarefa que a Dani já pode exercer (a do suco da espera depende da máquina) */
function daniTaskOk(id, up){ const t = DANI_TASKS.find(d => d.id === id); return !!t && (!t.need || !!(up && up[t.need])); }
/* prato caprichado (acerto crítico do Tonhão): +1 coração e bônus na entrega */
const CRIT = { bonus:10, vipBonus:20 };   // pontos (v8.3.8; eram R$)
const WASH = { base:0.3, perPile:2.5 };               // segundos na pia
const TRASH = { cap:6, empty:2, smell:0.3, tritura:30 };   // lixeira: capacidade, tempo para esvaziar, cheiro quando cheia, segundos do Triturador por gominho (v8.3.10)
function couvertEffect(eq){ return STAFF.couvert.effect * (eq.taxa ? 1 - STAFF.couvert.feeCut : 1); }
function couvertOk(ponto){ return DEV.on || (ponto || PONTOS[0]).nivel >= STAFF.couvert.nivel; }   // no modo dev, em qualquer ponto
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
/* v8.1: dinheiro comprometido. A folha e a divulgação ficam reservadas ao abrir o dia (e saem no fim dele); o que não
   couber fica de fora, nesta ordem (a divulgação vira boca a boca antes de tudo) */
const FOLHA_CORTE = [['couvert', 'Couvert'], ['som', 'som'], ['tv', 'TV'], ['dani', 'Dani'], ['tonhao', 'aumento do Tonhão']];
/* tira de eq o próximo item da folha (o Tonhão perde 1 nível de aumento) e devolve o nome; nada a tirar: null */
function folhaCorta(eq){
  const c = FOLHA_CORTE.find(k => eq[k[0]]);
  if (!c) return null;
  if (c[0] === 'tonhao') eq.tonhao--; else eq[c[0]] = c[0] === 'dani' ? 0 : false;
  return c[1];
}
/* o que fica de fora ao abrir o dia com `bank` no caixa (sem mexer em eq) */
function folhaCortes(eq, div, bank){
  eq = Object.assign({}, eq); let dc = div ? div.cost : 0; const out = [];
  while (payroll(eq) + dc > bank){
    if (dc){ out.push(div.name.toLowerCase()); dc = 0; continue; }
    const n = folhaCorta(eq); if (!n) break;
    out.push(n);
  }
  return out;
}
/* o que a folha e a divulgação pagam, pelo nome (para a lojinha) */
function folhaItens(eq, div){
  const out = [];
  if (eq.tonhao) out.push('aumento do Tonhão');
  if (eq.dani) out.push('Dani');
  if (eq.couvert) out.push('couvert');
  if (eq.tv) out.push('TV');
  if (eq.som) out.push('som');
  if (div && div.cost) out.push(div.name.toLowerCase());
  return out;
}
/* Jogos de pratos comprados (v8.3.6: acumulam; save antigo guardava true = 1) */
function pratosDe(up){ return up ? Math.max(0, Math.floor(+up.pratos || 0)) : 0; }
function listaE(a){ return a.join(', ').replace(/, ([^,]*)$/, ' e $1'); }
/* pratos limpos na cozinha: sem limite nos dias 1 e 2; depois, 4; no Turno sem fim, 5 (+1 por Jogo de pratos comprado) */
function dishStock(day, up){
  const extra = pratosDe(up);
  if (day.endless) return 5 + extra;
  if (day.n <= 2) return Infinity;
  return 4 + extra;
}

/* sucos: alguns grupos pedem junto com a comida; cada copo entregue vale JUICE.price */
const JUICE = { price:8, prep:0.6 };
/* valor de cada bebida; jogar uma na lixeira custa metade dele (a da espera, 'suco', vale o preço da BEBIDA_ESPERA) */
const DRINK_PRICE = { coffee:3, juice:JUICE.price };
/* bebida da espera (v7.5, melhoria no lugar da Água saborizada; o que se serve vem do ponto, BEBIDA_ESPERA): `pede` s
   depois de chegar ao lugar lá fora, o grupo pede 1 copo por pessoa; a Bia (ou a Dani) pega na estação e entrega,
   e quem bebe perde a paciência da espera `slow` mais devagar. Quem sai da espera antes cancela o que não foi pego */
const MAQUINA = { pede:2.5, slow:0.4 };
/* marmitas (v8.6): o entregador de moto não come no salão. Ele espera na fila de retirada (RETIRADA, no máximo `fila`) e
   leva o prato do cardápio numa marmita: o pedido chega pela Efood (o app de entrega) e vai sozinho ao Tonhão. A marmita
   ocupa uma boca do fogão como um prato, mas não usa prato limpo; os ingredientes e a `embalagem` saem quando ela fica
   pronta (se ninguém levar, fica o prejuízo). A Bia (ou a Dani) leva a marmita pronta ao balcão de retirada; o entregador
   paga o preço do prato, com a gorjeta dos corações, e a Efood fica com `efood` do preço. Adiantar: tocando no "+ marmita"
   da janela de pedidos (STATIONS.adiantar), o Tonhão faz uma marmita de `prato` sem dono (até `vagas` ao mesmo tempo), que fica na prateleira
   do balcão e esfria em `validade` s (aí vai para o lixo); o entregador que pede esse prato leva uma na hora. A prateleira
   tem mais `reserva` vaga, a da encomenda feita para quem está esperando. Ideias para depois: prateleira de 4 e estufa */
const MARMITA = { embalagem:2, efood:0.15, vagas:2, reserva:1, validade:60, prato:'pf', fila:3 };
const MULTA = 10;                                     // grupo que vai embora bravo (com 0 corações) desconta isto do dia
const VIP = { pat:0.75, tip:0.1, perfect:40, angry:10, dish:12, cook:1.8, types:['estudante','vovos','familia','executiva'] };   // dish: o prato especial soma R$ 12 à conta e leva 1,8× o tempo; perfect: pontos (v8.3.8)

const DAYS = [
  { n:1, groups:5,  types:['estudante','vovos'],                                   nu:null,         meta:30, expert:60,  time:150, speed:0.60, note:'A freguesia espera lá fora, na calçada: arraste cada grupo até uma mesa livre.' },
  { n:2, groups:8,  types:['estudante','vovos','familia'],                         nu:'familia',    meta:120, expert:220,  time:160, speed:0.60, note:'Chegou a família! Grupos de 3 ou 4 só cabem nas mesas de 4 lugares. Na lojinha, aba Salão, dá para comprar mesas e arrumar o salão.' },
  { n:3, groups:13, types:['estudante','vovos','familia','executiva'],             nu:'executiva',  meta:150, expert:230,  time:170, speed:0.60, juice:0.3, note:'O movimento aumentou e agora só há 4 pratos limpos: sozinha a Bia não dá conta, contrate ajuda na lojinha. A executiva tem pouca paciência, mas deixa boa gorjeta. E abriu o balcão de sucos: quem pede suco quer receber antes da conta!' },
  { n:4, groups:15, types:['estudante','vovos','familia','executiva','entregador'], nu:'entregador', meta:70, expert:110, time:180, speed:0.58, juice:0.3, note:'Chegou o entregador de moto! Ele não senta: espera no balcão de retirada, no alto da calçada, e leva o prato numa marmita. O pedido vai sozinho ao Tonhão; leve a marmita pronta ao balcão. Tem pressa! Para adiantar, toque no "+ marmita" da janela de pedidos.' },
  { n:5, groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:100, expert:140, time:190, speed:0.56, vip:0.15, juice:0.3, note:'Chegou cliente VIP (de óculos escuros e plaquinha dourada)! Fura a fila e tem menos paciência, mas pede o prato especial (mais caro), dá gorjeta e, se sair com 5 corações, pontos a mais. Se sair bravo, a multa dobra.' },
  { n:6, groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:150, expert:280, time:200, speed:0.54, vip:0.15, juice:0.3, note:'Sexta-feira: ninguém quer esperar.' },
  { n:7, groups:17, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:180, expert:310, time:220, speed:0.52, vip:0.15, juice:0.3, gripe:true, note:'Tonhão está gripado: a cozinha anda mais devagar hoje.' }
];
/* campanha (v8.3): os dias 1 a 7 são a rampa de abertura; do dia 8 em diante, cada dia tem o perfil do dia 7 (sem a gripe
   do Tonhão) com o movimento do dia da semana (o dia 1 é domingo e o 6, sexta). f: fator dos grupos e das metas;
   tipo e tipoP: mais gente de um tipo, como no clima */
const SEMANA = [
  { nome:'Domingo',       f:1.05, tipo:'familia',    tipoP:0.2,  note:'Domingo: a família toda sai para almoçar.' },
  { nome:'Segunda-feira', f:0.85, note:'Segunda-feira: o movimento é mais fraco.' },
  { nome:'Terça-feira',   f:0.9,  note:'Terça-feira: dia calmo.' },
  { nome:'Quarta-feira',  f:1,    note:'Quarta-feira: movimento normal.' },
  { nome:'Quinta-feira',  f:1,    tipo:'executiva',  tipoP:0.2,  note:'Quinta-feira: almoço de negócios, mais executivas.' },
  { nome:'Sexta-feira',   f:1.1,  tipo:'entregador', tipoP:0.2,  note:'Sexta-feira: ninguém quer esperar.' },
  { nome:'Sábado',        f:1.15, tipo:'familia',    tipoP:0.2,  note:'Sábado: casa cheia!' }
];
function semanaOf(n){ return SEMANA[(Math.max(1, n) - 1) % 7]; }
function diaOf(n){
  if (n >= 1 && n <= DAYS.length) return DAYS[n-1];
  const d7 = DAYS[DAYS.length - 1], s = semanaOf(n), r10 = v => Math.round(v * s.f / 10) * 10;
  return Object.assign({}, d7, { n, groups:Math.round(d7.groups * s.f), meta:r10(d7.meta), expert:r10(d7.expert), gripe:false, semana:s.nome, tipo:s.tipo || null, tipoP:s.tipoP || 0, note:s.note });
}

/* 2ª estrela: metade do caminho entre a meta e a expert (arredondada a R$ 25). Antes ela exigia a expert
   com algum cliente perdido, e como cada perda custa caro, quem batia a expert quase sempre levava 3 */
function bomGoal(d){ return Math.round((d.meta + d.expert) / 50) * 25; }

/* ============================================================
   CONTAS (v7): a meta do dia é o lucro. Ingredientes saem de cada prato que fica
   pronto (e de cada suco entregue), as contas do dia crescem com o salão (e com o
   aluguel do ponto; a Garagem não paga) e,
   do dia 3 em diante, a divulgação decide quanta gente aparece
   ============================================================ */
const CONTAS = { base:20, mesa:3, lugar:1 };         // por dia: o aluguel do ponto + gás e geladeira (base) + a luz de cada mesa aberta e de cada lugar (v8.3.8)
const INGRED = { prato:0.35, suco:3 };               // prato: fração da conta (cobrada quando fica pronto); suco: R$ por copo entregue
const DIVULGA = [
  { id:'boca',     name:'Boca a boca',   cost:0,   groups:[0.6, 0.9], vip:1,   desc:'Vem menos gente e o movimento varia: pode ser um dia fraco.' },
  { id:'panfleto', name:'Panfletos',     cost:20,  groups:[1, 1],     vip:1,   desc:'O movimento normal do dia.' },
  { id:'redes',    name:'Redes sociais', cost:40,  groups:[1.2, 1.2], vip:1.5, desc:'+20% de grupos e, do dia 5 em diante, 50% mais VIPs. Precisa de lugar para tanta gente!' }
];
/* movimento do salão (v7.4.1): cada lugar acima dos 10 do kit traz `porLugar` a mais de grupos no dia
   (salão cheio chama gente). Sem isso, mesa a mais só dava conta de luz e gás */
const MOVIMENTO = { kit:10, porLugar:0.06 };
function movimentoSalao(lugares){ return 1 + MOVIMENTO.porLugar * Math.max(0, lugares - MOVIMENTO.kit); }
/* ============================================================
   AVALIAÇÕES (v8.4): o Gurugol, o site de avaliações do jogo. Cada grupo que sai na carreira (pago ou bravo) dá de 1 a 5
   em 5 critérios, de peso igual:
   - espera: cada coração perdido lá fora tira `porCoracao`;
   - agil (agilidade): cada coração perdido na mesa esperando a Bia (pedido, prato, conta e o suco que faltou) tira
     `porCoracao`; a cadeira da cor do grupo, uma ação em corrente e o prato caprichado dão `bonus` (até bonus.max);
   - prato: a faixa de acerto do cozinheiro (pelo nível do Tonhão); o caprichado (CRIT) vale 5;
   - menu: pelos pratos do cardápio do ponto;
   - amb (ambiente): a base mais TV, som, torneira, ventilador, o cafezinho servido e o couvert; lixeira cheia tira.
   Quem sai bravo dá 1 na agilidade e no prato que não chegou a comer. Só `porDia` grupos do dia (sorteados) avaliam, como num restaurante de verdade. A nota é a média das últimas `max` avaliações,
   e só aparece depois das `min` primeiras; ela mexe no movimento do dia (v8.6.4: pelo teto do ponto, abaixo).
   Quem fica para o fim do dia (a lanchonete fecha) não avalia; dia largado no meio não conta.
   v8.6.4, teto por ponto: os critérios acima medem o serviço (1 a 5), e o Gurugol mostra a nota na escala do ponto:
   serviço 5 vale `teto` (pelo nível do ponto: Garagem 3, área industrial 3,7, Avenida Brasil 4,3, Terraço Suíça 5).
   Cada cliente tem o seu humor (de −humor.var a +humor.var) e, às vezes (`humor.encanta`), sai encantado e dá de
   humor.extra a mais, até `humor.folga` acima do teto: num dia especial, a Garagem chega a 3,5 ou 3,8. Quem sai bravo não
   tem humor.
   O movimento vai pela fração do teto: neutro na metade (2 ★ na Garagem) e +mov no teto */
const AVAL = {
  max:30, min:8, porDia:4, porCoracao:0.75, mov:0.1,
  teto:[3, 3.7, 4.3, 5],
  humor:{ var:0.3, encanta:0.2, extra:[0.6, 1.2], folga:0.8 },
  bonus:{ cor:0.5, corrente:0.5, crit:0.5, max:1.5 },
  prato:[[2.5, 4.5], [3, 4.7], [3.5, 5]],
  menu:{ base:1.5, porPrato:0.75 },
  amb:{ base:3, tv:0.5, som:0.5, maquina:0.5, ventilador:0.5, cafe:0.5, couvert:1, lixo:-1 }
};
const AVAL_CRIT = [
  { id:'espera', nome:'Espera por mesa',
    bom:['Sentei rapidinho!', 'Nem precisei esperar.', 'Mesa na hora!'], ruim:['Esperei muito por uma mesa.', 'A espera lá fora não andava.', 'Fiquei um tempão na calçada.'] },
  { id:'agil', nome:'Agilidade',
    bom:['A comida veio rapidinho!', 'Atendimento nota 10!', 'A Bia é um foguete!'], ruim:['Demoraram para anotar o pedido.', 'Esqueceram da gente na mesa.', 'A conta demorou demais.'] },
  { id:'prato', nome:'Qualidade da comida',
    bom:['O PF estava caprichado!', 'Comida de mãe!', 'Que tempero!'], ruim:['O prato veio sem graça.', 'Comida meio fria.', 'Faltou tempero.'] },
  { id:'menu', nome:'Diversidade do cardápio',
    bom:['Cardápio bem variado!', 'Muita opção boa.'], ruim:['Pouca opção no cardápio.', 'Queria mais pratos.'] },
  { id:'amb', nome:'Ambiente',
    bom:['Lugar gostoso, dá vontade de voltar.', 'Ambiente bem agradável!'], ruim:['Lugar meio sem graça.', 'Faltou um capricho no salão.'] }
];
/* a nota do cardápio: pelos pratos que a cozinha faz (na Garagem, os 4 do CARDAPIO) */
function avalMenu(){ return clamp(AVAL.menu.base + AVAL.menu.porPrato * Object.keys(CARDAPIO).length, 1, 5); }
/* as avaliações guardadas: [espera, agil, prato, menu, amb], com uma casa decimal, as últimas AVAL.max */
function normAval(a){
  return (Array.isArray(a) ? a : []).filter(r => Array.isArray(r) && r.length === AVAL_CRIT.length).slice(-AVAL.max)
    .map(r => r.map(v => clamp(Math.round((+v || 1) * 10) / 10, 1, 5)));
}
/* os últimos comentários (v8.4.2, aba Gurugol da lojinha): { d: o dia, n: a nota ×10, t: o texto, k: o tipo do grupo, v: VIP } */
const AVAL_COM = 30;
function normAvalCom(a){
  return (Array.isArray(a) ? a : []).filter(c => c && typeof c === 'object' && typeof c.t === 'string' && c.t).slice(-AVAL_COM)
    .map(c => { const o = { d:Math.max(1, Math.round(+c.d) || 1), n:clamp(Math.round(+c.n) || 10, 10, 50), t:c.t.slice(0, 60), k:CUSTOMER_TYPES[c.k] ? c.k : 'estudante' }; if (c.v) o.v = 1; return o; });
}
function avalNota(r){ return r.reduce((a, v) => a + v, 0) / r.length; }
/* médias de uma lista de avaliações: a nota e cada critério (null se a lista estiver vazia) */
function avalMedias(lista){
  if (!lista.length) return null;
  const crit = AVAL_CRIT.map((c, i) => lista.reduce((a, r) => a + r[i], 0) / lista.length);
  return { n:lista.length, nota:avalNota(crit), crit };
}
/* a nota da lanchonete (as médias das últimas AVAL.max), ou null antes das AVAL.min primeiras */
function avalGeral(lista){ return lista.length >= AVAL.min ? avalMedias(lista) : null; }
/* o teto do ponto (v8.6.4): a nota que o serviço perfeito vale lá */
function avalTeto(ponto){ return AVAL.teto[clamp(((ponto || PONTOS[0]).nivel || 1) - 1, 0, AVAL.teto.length - 1)]; }
/* a nota do serviço (1 a 5) na escala do ponto: 1 continua 1 e 5 vira o teto */
function avalEscala(v, teto){ return 1 + (v - 1) * (teto - 1) / 4; }
/* quanto a nota vale no ponto: 0 com 1 ★ e 1 no teto (passa de 1 com os encantados) */
function avalFrac(n, teto){ return (n - 1) / (teto - 1); }
/* o movimento pela nota: de 1 − mov (1 ★) a 1 + mov (o teto do ponto), neutro na metade; sem nota, 1 */
function avalMovimento(lista, ponto){
  const m = avalGeral(lista);
  return m ? 1 + AVAL.mov * clamp(avalFrac(m.nota, avalTeto(ponto)) * 2 - 1, -1, 1) : 1;
}
function fmtNota(n){ return n == null ? '–' : (Math.round(n * 10) / 10).toFixed(1).replace('.', ','); }
/* o comentário de uma avaliação, pelas notas do serviço: quem saiu bravo reclama de ter ido embora; com nota 4 ou mais,
   elogia o melhor critério (v8.6.4: abaixo do Terraço, às vezes elogia e lembra que o lugar é simples, AVAL_SIMPLES);
   senão, reclama do pior (o ambiente com a lixeira cheia reclama do cheiro) */
const AVAL_SIMPLES = [
  ['Atendimento ótimo, mas o lugar é bem simples.', 'Comida boa! Pena que é numa garagem.', 'Gostei! Só falta um lugar mais arrumado.'],
  ['Atendimento ótimo, mas o lugar ainda é simples.', 'Comida boa, salão sem luxo.'],
  ['Muito bom! Só falta aquele toque de requinte.']
];
const AVAL_BRAVO = { fila:['Desisti de esperar!', 'Nem consegui sentar.'], mesa:['Fui embora sem comer!', 'Nunca mais volto!'], retirada:['Cadê a marmita?!', 'Saí sem o pedido!'] };   // retirada (v8.6): o entregador
function avalComentario(r, bravo, lixo, nivel){
  if (bravo) return pick(AVAL_BRAVO[bravo]);
  const bom = Math.round(avalNota(r) * 10) >= 40;   // pela nota com uma casa (3,96 vira 4,0)
  if (bom && AVAL_SIMPLES[(nivel || 1) - 1] && Math.random() < 0.3) return pick(AVAL_SIMPLES[(nivel || 1) - 1]);
  let k = 0;
  r.forEach((v, i) => { if (bom ? v > r[k] : v < r[k]) k = i; });
  if (!bom && lixo && AVAL_CRIT[k].id === 'amb') return 'Que cheiro de lixo!';
  return pick(AVAL_CRIT[k][bom ? 'bom' : 'ruim']);
}
/* banco (v8.3): empréstimo pago em `parcelas` no fim de cada dia (um por vez, até o crédito do ponto).
   v8.3.2, amortização (tabela SAC): cada parcela é a amortização fixa (o valor ÷ `parcelas`) mais os juros do dia, `juros`
   sobre o saldo devedor (o que falta). Amortizar antes (adiantar parcelas ou quitar) abate o saldo e corta os juros que
   viriam; o prazo encurta. A folha, as contas e as parcelas saem mesmo sem dinheiro: o caixa pode fechar `neg` dias seguidos no
   negativo; no dia seguinte, se fechar no negativo de novo, o banco cobre o que falta, à força, com juros `forcado`.
   v8.3.1: a parcela que não cabe no dinheiro do fim do dia fica atrasada (atr); se no fim do dia seguinte não der para
   pagar a atrasada e a do dia, o banco toma a lanchonete e a carreira acaba */
const BANCO = { juros:0.03, parcelas:5, valores:[200, 500, 1000], neg:3, forcado:0.06 };
/* empréstimo no save: resto (o saldo devedor), amort (a amortização de cada parcela), j (juros ao dia), atr (parcela
   atrasada) e n (parcelas que faltam, calculado). Save da v8.3 ({ resto, n }, com os juros já somados): amort = resto ÷ n, sem juros */
function normEmprestimo(e){
  e = (e && typeof e === 'object') ? e : {};
  const resto = Math.max(0, Math.round(+e.resto) || 0);
  if (!resto) return { resto:0, n:0 };
  const amort = Math.max(1, Math.round(+e.amort) || Math.ceil(resto / clamp(Math.round(+e.n) || 1, 1, BANCO.parcelas)));
  const j = e.amort ? clamp(+e.j || 0, 0, 1) : 0, out = { resto, amort, j, n:Math.ceil(resto / amort) };
  if (e.atr) out.atr = true;
  return out;
}
/* juros do dia sobre o saldo */
function jurosDe(e){ return e.resto ? Math.round(e.resto * e.j) : 0; }
/* a parcela do fim do dia: a amortização (a última fecha a conta) mais os juros do dia */
function parcelaDe(e){ return e.resto ? Math.min(e.resto, e.amort) + jurosDe(e) : 0; }
/* o que o banco cobra no fim do dia: com uma parcela atrasada, 2 amortizações e os juros (os de ontem já foram para o saldo) */
function devidoDe(e){ return e.resto ? Math.min(e.resto, e.amort * (e.atr ? 2 : 1)) + jurosDe(e) : 0; }
/* as parcelas que faltam, pagando em dia (para mostrar na aba Banco) */
function tabelaDe(e){
  const out = []; let r = e.resto;
  while (r > 0 && out.length < 20){ const a = Math.min(r, e.amort); out.push(a + Math.round(r * e.j)); r -= a; }
  return out;
}
/* um empréstimo novo de v, pagando em dia: as parcelas e os juros somados */
function simulaEmprestimo(v, j){ const t = tabelaDe(normEmprestimo({ resto:v, amort:Math.ceil(v / BANCO.parcelas), j })); return { parcelas:t, juros:t.reduce((a, p) => a + p, 0) - v }; }
const CAIXA_MAX = 14;                                 // livro-caixa (v7.2): quantos dias da carreira ficam guardados
const VERSAO = 'v8.6.4';                               // vai no resumo do Caixa
const DIVULGA_DIA = 3;                                // antes disso, o movimento é o da inauguração (sem custo)
function divulgaAberta(n){ return DEV.on || n >= DIVULGA_DIA; }   // no modo dev, desde o dia 1
function divulgaOf(id){ return DIVULGA.find(d => d.id === id) || DIVULGA[1]; }
/* o que se serve na espera, por nível do salão (v7.7, PONTOS.bebida). preco: R$ por copo na conta do grupo; ingred:
   custo de cada copo; prep: s até ficar pronto na estação; take: s da Bia (ou da Dani) para pegar ali.
   agua (nível 1, Garagem): água da torneira em copo americano, de graça; pedida no balão, a Bia enche na hora.
   suco (a máquina da v7.5, com tablet): guardado para a jarra de suco do nível 2 (etapa 3 do plano) */
const BEBIDA_ESPERA = {
  agua: { id:'agua', icon:'agua', preco:0, ingred:0, prep:0, take:1, fim:'Água na espera',
          pede:n => n > 1 ? n + ' águas, por favor!' : 'Uma água, por favor!', pega:n => n > 1 ? n + ' copos!' : 'Água!', entrega:n => n > 1 ? 'Águas entregues!' : 'Água entregue!' },
  suco: { id:'suco', icon:'juice', preco:JUICE.price, ingred:INGRED.suco, prep:3, take:0.5, fim:'Sucos da espera',
          pede:n => n > 1 ? n + ' sucos no tablet!' : 'Suco no tablet!', pega:n => n > 1 ? n + ' sucos!' : 'Suco!', entrega:n => n > 1 ? 'Sucos entregues!' : 'Suco entregue!' }
};
function bebidaOf(ponto){ return BEBIDA_ESPERA[(ponto || PONTOS[0]).bebida] || BEBIDA_ESPERA.agua; }
/* contas do dia: o aluguel do ponto (v7.4; a Garagem é da família), mais cada mesa aberta e cada lugar dela */
function contasDia(tables, ponto){
  const open = tables.filter(t => t.open);
  return (ponto || PONTOS[0]).aluguel + CONTAS.base + CONTAS.mesa * open.length + CONTAS.lugar * open.reduce((a, t) => a + t.seats, 0);
}

/* Missão zero (v8.2): o dia de treino, com uma mesa só e os pop-ups do passo a passo (TREINO_PASSOS, em 17-treino.js) */
const TREINO = { n:0, groups:1, types:['vovos'], nu:null, meta:0, expert:0, time:0, speed:1, juice:0, note:'', treino:true };
const ENDLESS = { n:0, groups:0, types:['estudante','vovos','familia','executiva','entregador'], nu:null, meta:0, expert:0, time:0, speed:1, vip:0.12, juice:0.3, note:'', endless:true };

/* Bia (v7.3): velocidade de base em px/s e o ganho de cada nível dos tênis */
const BIA_SPEED = { base:300, tenis:1.1, corrida:1.2 };

/* fila de ações da Bia (v8.6.3): 5 quadrinhos de base (eram 6) e o Livrinho de Sudoku acrescenta 3 */
const FILA_ACOES = { base:5, sudoku:3 };
function filaMax(up){ return FILA_ACOES.base + (up && up.sudoku ? FILA_ACOES.sudoku : 0); }

const UPGRADES = [
  { id:'tenis',      name:'Tênis novos',          desc:'A Bia anda 10% mais rápido. Depois, libera os Tênis de corrida.', cost:150 },
  { id:'corrida',    name:'Tênis de corrida',     desc:'2º nível dos tênis: a Bia anda 20% mais rápido (em vez de 10%).', cost:350, req:'tenis' },
  { id:'maquina',    name:'Água da torneira',     desc:'Na calçada: torneira e copos americanos num caixote. Quem espera pede água; a Bia enche e leva, de graça, e quem bebe perde a paciência 40% mais devagar.', cost:80, devolve:100 },   // a Máquina de suco (R$ 180) até a v7.6: devolve a diferença
  { id:'cafeteira',  name:'Cafeteira de 2 bocas', desc:'O cafezinho devolve +2 corações.',             cost:200 },
  { id:'bandeja',    name:'Bandeja',              desc:'Leva 2 pratos, 3 bebidas, prato + bebida ou 2 pilhas de louça.', cost:220 },
  { id:'sudoku',     name:'Livrinho de Sudoku',   desc:'A fila de ações da Bia ganha 3 quadrinhos (de 5 para 8 tarefas já marcadas).', cost:200 },   // v8.6.3
  { id:'ventilador', name:'Ventilador de teto',   desc:'A freguesia come 15% mais rápido.', cost:250 },   // v8.3.10: o cheiro da lixeira cheia voltou a incomodar
  { id:'triturador', name:'Triturador de lixo',   desc:'Mói os restos da lixeira: tira 1 do lixo a cada 30 s. Ainda é preciso esvaziar de vez em quando.', cost:180 },
  { id:'pratos',     name:'Jogo de pratos',       desc:'+1 prato limpo na cozinha (do dia 3 em diante). Leve quantos quiser, fora da melhoria do dia.', cost:300, multi:true }   // v8.3.6: acumula e não conta no limite de 1 por dia
];

/* ============================================================
   MANUTENÇÃO (v8): fogão, geladeira e cafeteira vão de 100% a 0%. Cada dia jogado
   na carreira gasta `base` pontos e mais `uso` por prato que fica pronto (fogão e
   geladeira) ou por cafezinho servido (cafeteira): dia cheio gasta mais. Do dia
   `dia` em diante, só há risco quando o desgaste chega ao vermelho (abaixo de `vermelho`:
   `chanceVermelho` de quebrar no dia) e, no limite (`limite` ou menos), quebra com certeza;
   no verde e no amarelo é só desgaste acumulando (v8.3.11). Revisão na lojinha: volta a 100% e custa `preco` × o que gastou.
   Quebrado, um toque na plaquinha do conserto chama o técnico na hora, por `emerg`
   (volta a 100%). No Turno sem fim, nada se gasta nem quebra
   ============================================================ */
const MANUT = {
  on: true,               // desligado, nada se gasta nem quebra e não há chuva nem feriado (os testes desligam)
  dia: 4,
  quando: [0.12, 0.55],   // em que parte do dia a quebra acontece
  verde: 0.7,             // abaixo disso a barra fica amarela: a hora de revisar
  vermelho: 0.4,          // abaixo disso a barra fica vermelha: 50% de chance de quebrar no dia
  chanceVermelho: 0.5,
  taxa: 10,               // a visita do técnico na revisão: revisar com o equipamento quase novo não compensa
  urgente: 1.5,           // no vermelho a revisão custa 50% a mais (peças e correria)
  limite: 0.15,           // neste ponto ou abaixo, quebra com certeza
  equip: [
    { id:'fogao',     name:'Fogão',     base:5, uso:0.5, preco:120, emerg:40,  efeito:'o Tonhão cozinha 40% mais devagar', lento:0.6,  badge:{ x:884, y:178 } },
    { id:'geladeira', name:'Geladeira', base:7, uso:0.4, preco:100, emerg:30,  efeito:'os ingredientes custam 50% a mais', ingred:1.5, badge:{ x:709, y:127 } },
    { id:'cafeteira', name:'Cafeteira', base:5, uso:1,   preco:60,  emerg:15,  efeito:'sem cafezinho',                       badge:{ x:840, y:346 } }
  ],
  badge: 18                // raio da plaquinha do conserto (toque)
};
function manutOf(id){ return MANUT.equip.find(e => e.id === id); }
/* chance de quebrar no dia, pelo estado (0 a 1): zero no verde e no amarelo, 50% no vermelho, 100% no limite */
function manutChance(e){ return e <= MANUT.limite ? 1 : e < MANUT.vermelho ? MANUT.chanceVermelho : 0; }
/* preço da revisão (v8.3.12): a taxa da visita mais o que gastou, ×`urgente` no vermelho, em múltiplos de R$ 5 (0 se está a 100%).
   O ponto de melhor custo-benefício é o amarelo: antes disso a taxa pesa, depois disso o preço sobe e a quebra ronda */
function manutPreco(id, e){ const q = manutOf(id); return e >= 0.995 ? 0 : Math.ceil((MANUT.taxa + q.preco * (1 - e)) * (e < MANUT.vermelho ? MANUT.urgente : 1) / 5) * 5; }
function normManut(m){
  m = (m && typeof m === 'object') ? m : {};
  const out = {};
  MANUT.equip.forEach(q => { const v = +m[q.id]; out[q.id] = isFinite(v) ? clamp(v, 0, 1) : 1; });
  const s = m.sorteio;
  if (s && typeof s === 'object' && +s.d >= 1) out.sorteio = { d:Math.round(+s.d), clima:CLIMA[s.clima] ? s.clima : '',
    quebra:(Array.isArray(s.quebra) ? s.quebra : []).filter(x => x && manutOf(x.id)).map(x => ({ id:x.id, f:clamp(+x.f || 0.3, 0, 1) })) };
  return out;
}
/* imprevistos sem culpa (v8), do dia `dia` em diante na carreira: raros e avisados na introdução.
   chuva: menos gente e mais entregadores; feriado: mais gente e mais famílias */
const CLIMA = {
  chuva:   { nome:'Dia de chuva', chance:0.12, groups:0.8,  tipo:'entregador', tipoP:0.35, aviso:'Dia de chuva: vem menos gente, e mais entregadores (com pressa!).' },
  feriado: { nome:'Feriado',      chance:0.10, groups:1.25, tipo:'familia',    tipoP:0.25, aviso:'Feriado: a cidade saiu de casa! Mais gente e mais famílias.' }
};
const CLIMA_DIA = 3;

