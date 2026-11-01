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
/* cardápio (v8.3.8, preços de verdade; v8.6.9, o cardápio cresce): R$ de cada prato na Garagem (o ponto multiplica por PONTOS.cardapio).
   A cozinha começa sabendo o PF e a coxinha (curso: null); os outros vêm dos cursos do Tonhão (CURSOS). cat: a categoria do gosto
   dos clientes (GOSTOS); carne: false marca os sem carne (usados na v8.6.11); cor: a cor do desenho provisório (as artes de
   verdade são da v8.6.10). Pesquisa de out/2026: PF médio no Brasil R$ 31,90 (o da garagem sai mais barato), coxinha e pastel de R$ 4 a 8 */
const CARDAPIO = {
  pf:      { nome:'PF',              preco:25, cat:'pf',     curso:null,      carne:true,  cor:'#A0522D' },
  coxinha: { nome:'Coxinha',         preco:8,  cat:'frito',  curso:null,      carne:true,  cor:'#E8912A' },
  risoles: { nome:'Risoles',         preco:6,  cat:'frito',  curso:'fritos',  carne:true,  cor:'#D98A32' },
  kibe:    { nome:'Kibe',            preco:7,  cat:'frito',  curso:'fritos',  carne:true,  cor:'#9A5B2B' },
  bolinho: { nome:'Bolinho japonês', preco:8,  cat:'frito',  curso:'fritos',  carne:true,  cor:'#E2A64A' },
  empada:  { nome:'Empada',          preco:9,  cat:'assado', curso:'assados', carne:true,  cor:'#E3A84A' },
  esfihaA: { nome:'Esfiha aberta',   preco:7,  cat:'assado', curso:'assados', carne:true,  cor:'#C8452B' },
  esfihaF: { nome:'Esfiha fechada',  preco:7,  cat:'assado', curso:'assados', carne:true,  cor:'#D79A4B' },
  misto:   { nome:'Misto quente',    preco:10, cat:'chapa',  curso:'chapa',   carne:true,  cor:'#D9A25B' },
  bauru:   { nome:'Bauru',           preco:12, cat:'chapa',  curso:'chapa',   carne:true,  cor:'#C98A4B' },
  paoChapa:{ nome:'Pão na chapa',    preco:7,  cat:'chapa',  curso:'chapa',   carne:false, cor:'#E0B070' },
  pastel:  { nome:'Pastel de carne', preco:10, cat:'pastel', curso:'pastel',  carne:true,  cor:'#E5A33C' },
  pastelQ: { nome:'Pastel de queijo',preco:10, cat:'pastel', curso:'pastel',  carne:false, cor:'#EBB44E' },
  pastelP: { nome:'Pastel de pizza', preco:11, cat:'pastel', curso:'pastel',  carne:true,  cor:'#DE9438' },
  /* v8.6.11, o curso Vegetariano (veg:true leva o "v" verde no desenho; dep: precisa do básico desse outro curso; pfv: PF sem carne,
     que quem não é vegetariano pede em VEG.pfTroca das vezes que pede PF) e o avançado, Pratos veganos (nivel:2, vegano:true: a
     folhinha; semAv: o avançado não sobe o preço, que já é o do prato comum) */
  pfVeg:        { nome:'PF vegetariano',    preco:23, cat:'pf',     curso:'veg', carne:false, cor:'#A0522D', veg:true, pfv:true },
  empadaPalmito:{ nome:'Empada de palmito', preco:9,  cat:'assado', curso:'veg', carne:false, cor:'#C9B35A', veg:true, dep:'assados' },
  kibeAbobora:  { nome:'Kibe de abóbora',   preco:7,  cat:'frito',  curso:'veg', carne:false, cor:'#D98A32', veg:true, dep:'fritos' },
  pfVegano:     { nome:'PF vegano',         preco:23, cat:'pf',     curso:'veg', carne:false, cor:'#A0522D', veg:true, vegano:true, pfv:true, nivel:2, semAv:true },
  coxinhaJaca:  { nome:'Coxinha de jaca',   preco:8,  cat:'frito',  curso:'veg', carne:false, cor:'#E8B04A', veg:true, vegano:true, dep:'fritos',  nivel:2, semAv:true },
  pastelPalmito:{ nome:'Pastel de palmito', preco:10, cat:'pastel', curso:'veg', carne:false, cor:'#E9B85A', veg:true, vegano:true, dep:'pastel',  nivel:2, semAv:true },
  esfihaSoja:   { nome:'Esfiha de soja',    preco:7,  cat:'assado', curso:'veg', carne:false, cor:'#A9743A', veg:true, vegano:true, dep:'assados', nivel:2, semAv:true },
  mistoVegano:  { nome:'Misto vegano',      preco:10, cat:'chapa',  curso:'veg', carne:false, cor:'#D9B27A', veg:true, vegano:true, dep:'chapa',   nivel:2, semAv:true },
  // v9.1, o curso Cozinha de restaurante (só com ponto.nivel >= 3): o filé à parmegiana, da categoria PF (R$ 60 na Avenida Brasil)
  parmegiana:   { nome:'Filé à parmegiana', preco:30, cat:'pf',     curso:'restaurante', carne:true, cor:'#B5432E' }
};
/* os cursos do Tonhão (v8.6.9): um por lojinha. O básico ensina os pratos; o avançado ("mais requintadinha") soma CURSO_AV.preco ao
   preço de venda dos pratos dele e CURSO_AV.crit à chance de caprichado. O PF não tem básico (preco 0): o avançado aparece desde o início.
   save.cursos: { id: 1 (básico) | 2 (avançado) } */
const CURSOS = [
  { id:'pastel',  nome:'Pastel de feira',   preco:150, pratos:['pastel', 'pastelQ', 'pastelP'],
    av:{ nome:'Pastel de feira de verdade', preco:300, receita:'carne com ovo e azeitona, queijo com orégano, pizza com calabresa', pratos:['pastel', 'pastelQ', 'pastelP'] } },
  { id:'chapa',   nome:'Chapa',             preco:180, pratos:['misto', 'bauru', 'paoChapa'],
    av:{ nome:'Pão francês da padaria e requeijão de corte', preco:360, receita:'misto de presunto defumado com queijo minas, bauru clássico com rosbife e picles', pratos:['misto', 'bauru', 'paoChapa'] } },
  { id:'fritos',  nome:'Salgados fritos',   preco:220, pratos:['risoles', 'kibe', 'bolinho'],
    av:{ nome:'Coxinha de massa de batata com catupiry', preco:440, receita:'vale também para a coxinha; risoles de camarão, kibe com coalhada, bolinho japonês com queijo', pratos:['coxinha', 'risoles', 'kibe', 'bolinho'] } },
  { id:'assados', nome:'Salgados assados',  preco:250, pratos:['empada', 'esfihaA', 'esfihaF'],
    av:{ nome:'Massa podre da vó Nilza', preco:500, receita:'empada de frango com azeitona, esfihas com coalhada e limão', pratos:['empada', 'esfihaA', 'esfihaF'] } },
  { id:'pf',      nome:'PF',                preco:0,   pratos:[],
    av:{ nome:'Carnes variadas', preco:400, receita:'o PF vem com bife, filé de frango grelhado, peixe frito ou bife a cavalo', pratos:['pf'] } },
  { id:'veg',     nome:'Vegetariano',       preco:150, pratos:['pfVeg', 'empadaPalmito', 'kibeAbobora'],
    av:{ nome:'Pratos veganos', preco:300, receita:'PF vegano (sem o ovo), coxinha de jaca, pastel de palmito, esfiha de soja e misto vegano com queijo de castanha',
      pratos:['pfVeg', 'empadaPalmito', 'kibeAbobora', 'pfVegano', 'coxinhaJaca', 'pastelPalmito', 'esfihaSoja', 'mistoVegano'] } },
  // v9.1: só aparece no cartão Cardápio com ponto.nivel >= 3 (nivel:3; no modo dev, sempre; cursoOk)
  { id:'restaurante', nome:'Cozinha de restaurante', preco:400, pratos:['parmegiana'], nivel:3,
    av:{ nome:'Parmegiana da casa', preco:600, receita:'molho de tomate de 6 horas e queijo gratinado na hora', pratos:['parmegiana'] } }
];
/* v9.1: o curso está ao alcance neste ponto? (nivel:3 só da Avenida Brasil em diante; no modo dev, sempre) */
function cursoOk(c, ponto){ return !c.nivel || devLivre() || (ponto || PONTOS[0]).nivel >= c.nivel; }
/* vegetarianos (v8.6.11): chance de cada pessoa (menos o entregador) ser vegetariana; quem não é pede o PF sem carne em pfTroca das
   vezes que pede PF; mov: o curso Vegetariano traz +5% de movimento no básico e mais +5% no avançado */
const VEG = { chance:0.1, pfTroca:0.2, mov:0.05 };
function vegMov(cursos){ return 1 + VEG.mov * cursoNivel(cursos, 'veg'); }
const CURSO_AV = { preco:1.15, crit:1.5 };
function cursoOf(id){ return CURSOS.find(c => c.id === id) || null; }
/* nível do curso: 0 (nada), 1 (básico) ou 2 (avançado); o PF não tem básico, então já nasce no 1 */
function cursoNivel(cursos, id){ const n = Math.max(0, Math.min(2, Math.floor(+(cursos && cursos[id]) || 0))); return id === 'pf' ? Math.max(1, n) : n; }
/* experiência do Tonhão (v8.8): +1 por curso básico, +2 por avançado (o PF só tem o avançado); máximo 20 */
const CURSO_XP = { basico:1, avancado:2 };
function tonhaoXp(cursos){
  return CURSOS.reduce((a, c) => { const n = cursoNivel(cursos, c.id); return a + (n >= 2 ? (c.preco > 0 ? CURSO_XP.basico : 0) + CURSO_XP.avancado : n >= 1 && c.preco > 0 ? CURSO_XP.basico : 0); }, 0);
}
/* o maior nível (índice) cuja xp cabe na experiência dos cursos */
function tonhaoNivelXp(cursos){
  const x = tonhaoXp(cursos); let n = 0;
  STAFF.tonhao.levels.forEach((l, i) => { if (x >= l.xp) n = i; });
  return n;
}
/* experiência da Dani (v8.9): +1 a cada `tarefas` tarefas que ela termina (save.daniTar, o total da carreira) e +2 por curso dela
   (save.daniCursos: { id:1 }); na Garagem, 4 de cursos (só atendimento; o barista saiu em 01/11: café é com o Joca, e a Dani segue nos doces) */
const DANI_XP = { tarefas:5, curso:2 };
/* nivel: o ponto de onde o curso aparece (padrão 1); item: o curso traz um item de cardápio (fica no cartão Cardápio, com o rosto dela) */
const DANI_CURSOS = [
  { id:'atend',   nome:'Atendimento ao cliente', preco:120 },
  { id:'cozinha', nome:'Organização da cozinha', preco:150 },
  { id:'confCaseira', nome:'Confeitaria caseira', preco:180, nivel:2, item:true },   // v9.2: a geladeirinha de doces (DOCES)
  { id:'confGourmet', nome:'Confeitaria gourmet', preco:350, nivel:3, dep:'confCaseira', item:true }   // v9.3: a vitrine refrigerada e os doces gourmet (só depois da caseira)
];
/* v9.2: o curso aparece no ponto de `nivel` em diante (no modo dev, sempre) */
function cursoDaniVis(c, ponto){ return devLivre() || (c.nivel || 1) <= (ponto || PONTOS[0]).nivel; }
function daniXp(save){
  const s = save || {};
  return DANI_XP.curso * DANI_CURSOS.filter(c => s.daniCursos && s.daniCursos[c.id]).length + Math.floor(Math.max(0, +s.daniTar || 0) / DANI_XP.tarefas);
}
/* o maior nível (índice 1 a 4) cuja xp cabe na experiência dela; o 1 (aprendiz) vale desde que ela chega */
function daniNivelXp(save){
  const x = daniXp(save); let n = 1;
  STAFF.dani.levels.forEach((l, i) => { if (l && x >= l.xp) n = i; });
  return n;
}
/* o prato é do avançado de algum curso que já foi feito? */
function pratoAv(k, cursos){ return CURSOS.some(c => cursoNivel(cursos, c.id) >= 2 && c.av.pratos.indexOf(k) >= 0); }
/* o save: só os níveis que existem (o PF só tem o avançado, 2) */
function normDaniCursos(c){ const o = {}; DANI_CURSOS.forEach(x => { if (c && c[x.id]) o[x.id] = 1; }); return o; }
/* v9.2, o Joca (o colega de colégio da Dani): níveis 2 a 4 como os da Dani. Experiência: +1 a cada `tarefas` tarefas (save.jocaTar, só dia
   completo) e +2 por curso (save.jocaCursos); o aumento consolida o nível. espresso (item) é da 3b-3; aqui só entra na lista, escondido abaixo do nível 3 */
const JOCA_XP = { tarefas:5, curso:2 };
const JOCA_CURSOS = [
  { id:'atend',    nome:'Atendimento ao cliente', preco:120, nivel:2 },
  { id:'cozinha',  nome:'Organização da cozinha', preco:150, nivel:2 },
  { id:'espresso', nome:'Barista: espresso',      preco:350, nivel:3, item:true }
];
const JOCA_HOME = { x:640, y:515 };
/* v9.3, a Cami (atendimento; o Joca passa o bastão para ela na Avenida): chega no nível 1 e sobe só por curso (o salário sobe junto):
   nível = 1 + cursos feitos. O 2º curso (v9.6) abre o modo "Minhas mesas": o jogador marca até CAMI_MESAS_MAX mesas como dela no editor do salão
   (`salao.mesas[i].cami = 1`) e, no cartão, escolhe entre "Tarefas" e "Minhas mesas" (`equipe.camiModo`) */
const CAMI_HOME = { x:590, y:515 };
const CAMI_CURSOS = [
  { id:'agil', nome:'Atendimento ágil',     preco:400, nivel:3 },
  { id:'mesa', nome:'Atendimento de mesa',  preco:600, nivel:3, dep:'agil' }
];
const ANSELMO_HOME = { x:650, y:118 };   // v9.5: atrás do balcão de drinks
const CAMI_MESAS_MAX = 2;   // v9.6: quantas mesas o jogador pode marcar como da Cami (v9.6.1: 3 → 2, rebalanceamento da 3b-7)
/* v9.6: quantas mesas do salão estão marcadas como da Cami */
function camiMesasN(save){ return ((save && save.salao && save.salao.mesas) || []).filter(m => m.cami).length; }
/* v9.6: a Cami está no modo "Minhas mesas" (nível 3, o modo escolhido e pelo menos 1 mesa marcada)? */
function camiModoMesas(save){
  const eq = save && save.equipe;
  return !!eq && eq.camiModo === 'mesas' && eq.cami > 0 && !!STAFF.cami.levels[eq.cami].mesas && camiMesasN(save) > 0;
}
function normCamiCursos(c){ const o = {}; CAMI_CURSOS.forEach(x => { if (c && c[x.id]) o[x.id] = 1; }); return o; }
/* o nível dela pelos cursos: 1 + os feitos (o 2º só conta com o 1º) */
function camiNivelCursos(save){
  const c = (save && save.camiCursos) || {};
  return 1 + (c.agil ? 1 : 0) + (c.agil && c.mesa ? 1 : 0);
}
function jocaXp(save){
  const s = save || {};
  return JOCA_XP.curso * JOCA_CURSOS.filter(c => s.jocaCursos && s.jocaCursos[c.id]).length + Math.floor(Math.max(0, +s.jocaTar || 0) / JOCA_XP.tarefas);
}
/* o maior nível (índice 2 a 4) cuja xp cabe na experiência dele */
function jocaNivelXp(save){
  const x = jocaXp(save); let n = 2;
  STAFF.joca.levels.forEach((l, i) => { if (l && x >= l.xp) n = i; });
  return n;
}
function normJocaCursos(c){ const o = {}; JOCA_CURSOS.forEach(x => { if (c && c[x.id]) o[x.id] = 1; }); return o; }
/* v9.0.1: o Tonhão já fez algum curso (o básico de qualquer um ou o avançado do PF) */
function cursoFeito(cursos){ return CURSOS.some(c => c.preco > 0 ? cursoNivel(cursos, c.id) >= 1 : cursoNivel(cursos, c.id) >= 2); }
function normCursos(c){
  const o = {};
  CURSOS.forEach(x => { const n = Math.min(2, Math.floor(+(c && c[x.id]) || 0)); if (n >= (x.preco > 0 ? 1 : 2)) o[x.id] = n; });
  return o;
}
function pratoSabido(k, cursos){
  const p = CARDAPIO[k];
  return !!p && (!p.curso || cursoNivel(cursos, p.curso) >= (p.nivel || 1)) && (!p.dep || cursoNivel(cursos, p.dep) >= 1);   // v8.6.11: dep, o prato que precisa de outro curso
}
function pratosSabidos(cursos){ return Object.keys(CARDAPIO).filter(k => pratoSabido(k, cursos)); }
/* os cursos de um modo sem a lojinha: o Turno sem fim sabe os 4 básicos (sem avançado); a Missão zero, só o PF e a coxinha */
const CURSOS_SEMFIM = { pastel:1, chapa:1, fritos:1, assados:1 };
function precoPrato(k, ponto, cursos){ return Math.round(CARDAPIO[k].preco * (ponto || PONTOS[0]).cardapio * (pratoAv(k, cursos) && !CARDAPIO[k].semAv ? CURSO_AV.preco : 1)); }
/* as proteínas do PF com o avançado "Carnes variadas" (v8.6.10): cada pessoa que pede PF sorteia uma (guardada em grupo.carnes) */
const CARNES = ['bife', 'frango', 'peixe', 'cavalo'];
/* os gostos de cada tipo (v8.6.9): pesos por categoria, na ordem de GOSTOS_CAT; o entregador muda de ideia por terço do turno */
const GOSTOS_CAT = ['pf', 'frito', 'assado', 'chapa', 'pastel'];
const GOSTOS = {
  estudante:  [2, 3, 1, 2, 2],
  executiva:  [4, 0, 2, 1, 0],
  familia:    [4, 1, 0, 1, 2],
  vovos:      [3, 0, 3, 1, 0],
  entregador: [[0, 3, 2, 1, 0], [1, 0, 0, 0, 0], [0, 4, 1, 0, 1]],
  turma:      [5, 1, 0, 1, 1],
  motorista:  [4, 1, 2, 1, 0],
  negocios:   [5, 0, 1, 1, 0]   // v9.1
};
GOSTOS.encomenda = GOSTOS.turma;
/* o que a pessoa pede: sorteia a categoria pelos pesos do tipo (só entre as que têm algum prato que a cozinha sabe) e depois um prato
   sabido dela, com a mesma chance. Sem categoria possível, PF (com semPf, o 2º item, coxinha) */
function pedePrato(tipo, game, semPf, veg){
  // v8.6.11: veg (a pessoa é vegetariana) pede só prato sem carne; sem opção, o 2º item some e o prato é uma coxinha (e o grupo reclama)
  const sab = pratosSabidos(game.cursos).filter(k => !veg || !CARDAPIO[k].carne);
  let w = GOSTOS[tipo] || GOSTOS.estudante;
  if (Array.isArray(w[0])){
    const t = game.day && game.day.time > 0 ? clamp(1 - game.clock / game.day.time, 0, 0.999) : Math.random();
    w = w[Math.floor(t * 3)];
  }
  const cats = GOSTOS_CAT.map((c, i) => ({ w:semPf && c === 'pf' ? 0 : w[i], l:sab.filter(k => CARDAPIO[k].cat === c && (veg || !CARDAPIO[k].pfv)) })).filter(x => x.w > 0 && x.l.length);
  if (!cats.length){
    if (veg){ const alt = sab.filter(k => !semPf || CARDAPIO[k].cat !== 'pf'); return alt.length ? pick(alt) : semPf ? null : 'coxinha'; }
    return semPf ? 'coxinha' : 'pf';
  }
  let r = Math.random() * cats.reduce((a, x) => a + x.w, 0);
  const c = cats.find(x => (r -= x.w) < 0) || cats[cats.length - 1];
  const k = pick(c.l);
  if (!veg && k === 'pf' && Math.random() < VEG.pfTroca){ const pv = sab.filter(x => CARDAPIO[x].pfv); if (pv.length) return pick(pv); }
  return k;
}
/* o 2º item (v8.3.8): na hora de pedir, cada pessoa pode querer mais um salgado (chance `mais` do tipo; no máximo 2 itens
   por pessoa). Vai na mesma comanda e no mesmo prato, para não travar a mesa; a cozinha leva `cozinha` a mais de tempo
   por item a mais (em fração dos itens do grupo). Pedir depois de comer travava a mesa e derrubava o lucro */
/* v8.6.13: quem pede salgado (qualquer prato que não é do tipo PF) pede um 2º item em `salgado` das vezes (salgado se pede
   de dois); sem isso, cada curso trocava PF de R$ 25 por salgado de R$ 7 e derrubava o lucro do dia */
const MAIS = { cozinha:0.4, salgado:0.8 };   // v8.6.9: o 2º item sai de pedePrato(..., true), pelos gostos do tipo, sem o PF
/* pontos de atendimento (v8.3.8): as ações da Bia não dão mais dinheiro, dão pontos (a nota da lanchonete virá
   deles). A corrente e a cor certa também viram pontos */
const PONTOS_ACAO = { sit:10, take:15, deliver:20, clear:10, coffee:5, juice:5, bill:20, cor:15, marmita:20, lote:20, doce:5, cafeEsp:5, drink:5 };

/* calçada (v7.5): o mundo vai de -CALCADA.w (a rua) até W; a espera fica lá fora, no lugar da fila de antes.
   Tela larga (v7.6): a tela tem TW px e mostra o mundo inteiro, sem rolar (Game.cam = CALCADA.w: onde o mundo
   começa na tela). No celular deitado (~2:1), tudo fica do mesmo tamanho de antes */
const CALCADA = { w:260 };
const TW = W + CALCADA.w;
/* lugares da espera, do 1º da fila ao último (v8.1.2): o 1º fica embaixo, perto da torneira, e quem chega depois
   fica acima dele, do lado da rua por onde chega. v8.6: um pouco mais juntos e mais para baixo (eram 436 a 178), para
   caber o balcão de retirada no alto da calçada */
const QUEUE = { x:-132, ys:[476, 396, 316, 236], max:4 };
/* v9.1: os lugares da espera seguem o ponto (ponto.espera: 4, 5 e 6). Muda o mesmo array no lugar, como as vagas de prato. Com 4 ficam como
   sempre; com 5 ou 6 o de baixo desce um pouco e o de cima continua em 236 (mais juntos). Até a v9 a 5ª vaga da área industrial não tinha posição */
function queueYsFor(n){
  QUEUE.ys.length = 0; QUEUE.max = n;
  for (let i = 0; i < n; i++) QUEUE.ys.push(n <= 4 ? 476 - 80 * i : Math.round(492 - i * (492 - 236) / (n - 1)));
}
/* fila de retirada (v8.6): os entregadores esperam em pé no alto da calçada, à esquerda do balcão de retirada (o 1º
   encostado nele); balcao: o tampo com a prateleira das marmitas (3 vagas: x de cada uma) */
const RETIRADA = { fila:[{ x:-114, y:160 }, { x:-160, y:160 }, { x:-206, y:160 }], balcao:{ x0:-92, x1:-14, y:112 }, vagas:[-76, -53, -30] };
const DOOR  = { x:-300, y:106 };                     // de onde a freguesia vem (e para onde vai): a rua, à esquerda
/* HUD na tela larga (v7.6): dia e lucro à esquerda, como antes; a fila de ações anda `fila` px e as mãos, a pausa e
   o som, `dir` px (para a direita) */
const HUDX = { fila:CALCADA.w / 2, dir:CALCADA.w };
const STATIONS = {
  drinks: { ap:{x:700,y:150}, rect:{x:620,y:92,w:60,h:50} },   // v9.5: o balcão de drinks do Anselmo, na parede do fundo (o ap fica no corredor à direita das mesas)
  espresso:{ ap:{x:744,y:350}, rect:{x:694,y:318,w:46,h:56} },   // v9.3: a máquina de espresso (curso do Joca), no chão ao lado da bancada do café, na mesma boca de atendimento
  order:  { ap:{x:744,y:150}, rect:{x:766,y:96, w:194,h:108} },
  plates: { ap:{x:744,y:256}, rect:{x:766,y:206,w:194,h:98 } },
  coffee: { ap:{x:744,y:350}, rect:{x:766,y:306,w:97, h:88 } },
  juice:  { ap:{x:744,y:350}, rect:{x:863,y:306,w:97, h:88 } },
  sink:   { ap:{x:744,y:452}, rect:{x:766,y:396,w:194,h:140} },
  trash:  { ap:{x:684,y:520}, rect:{x:700,y:474,w:46,h:62 } },  // lixeira no chão, ao lado do balcão
  retirada:{ ap:{x:16,y:156}, rect:{x:-94,y:98,w:90,h:80 } },
  adiantar:{ ap:{x:744,y:150}, rect:{x:852,y:150,w:62,h:36} },  // o botãozinho de adiantar marmita (v8.6), na janela de pedidos  // balcão de retirada das marmitas (v8.6), na calçada, ao lado do portão (a Bia atende de dentro)
  doces:  { ap:{x:744,y:226}, rect:{x:696,y:206,w:42,h:46} },   // v9.2: a geladeirinha de doces (curso Confeitaria caseira), no chão logo abaixo da geladeira grande (o plano previa (690,92), onde já fica a geladeira)
  maquina:{ ap:{x:-26,y:498}, rect:{x:-110,y:452,w:62,h:84 } }  // bebida da espera (v7.5), na calçada: na Garagem, a torneira (v7.7)
};
const PLATE_SLOTS = [ {x:806,y:270}, {x:848,y:270}, {x:890,y:270}, {x:932,y:270} ];
/* v9: o balcão de pratos tem as vagas do ponto (ponto.pratos): 4 na Garagem, 5 na área industrial, 6 na Avenida Brasil (mais juntas). Muda o mesmo array no lugar */
function plateSlotsFor(n){ PLATE_SLOTS.length = 0; for (let i = 0; i < n; i++) PLATE_SLOTS.push({ x:(n >= 6 ? 791 + 29 * i : n >= 5 ? 792 + 36 * i : 806 + 42 * i), y:270 }); }   // v9.1: 6 vagas na Avenida Brasil
const BOUNDS = { x0:16 - CALCADA.w, y0:112, x1:744, y1:528 };
const LAYOUT = { W, H, TW, HUDX, CALCADA, QUEUE, RETIRADA, DOOR, STATIONS, PLATE_SLOTS, BOUNDS };
/* ============================================================
   PONTOS (v7.4): o nível do salão é o ponto. Garagem, área industrial (v9) e Avenida Brasil (v9.1); o Terraço Suíça
   vem na etapa 4 do plano.
   nivel: o nível do salão (1 a 4); lugares: teto de lugares; area: onde as mesas podem ficar (a mesa inteira, com
   as cadeiras); espera: lugares lá fora (v7.5); cardapio: fator dos preços; assento: como se espera lá fora e
   bebida: o que se serve lá (v7.7; ver BEBIDA_ESPERA). Na Garagem, de pé e água da torneira. credito: o limite do
   empréstimo no banco (v8.3)
   ============================================================ */
const PONTOS = [
  { id:'garagem', nome:'Garagem da mãe da Bia', nivel:1, lugares:16, aluguel:0, mudanca:0, credito:1000, cardapio:1, area:{ x0:196, y0:150, x1:684, y1:500 }, espera:4, assento:'pe', bebida:'agua', pratos:4, prateleira:2, deixa:'a TV, o som e a torneira ficam' },   // traz/deixa: o que o ponto novo traz e o que fica para trás ao sair deste (texto do cartão Mudança, v9.1)
  // v9: a primeira mudança (a área é a da Garagem alargada em 36 px à esquerda: 20 lugares não cabiam na arrumação automática). tipos: os pesos do sorteio da clientela (no lugar do day.types); encomenda: a chance diária da encomenda do setor;
  // apito: o pico do meio do dia (as primeiras `max` turmas chegam juntas a partir de `quando` do turno, uma a cada `gap` s, avisadas `aviso` s antes);
  // patPressa: a paciência de quem vem sozinho ou em dupla; vip: a chance de VIP; metaF: o fator das metas (v9.6.1: 1,25 → 2,3 e 1,7 → 3,2); expertF (v9.6.1): o da expert, a 3ª estrela (sem ele, o metaF); prateleira: as vagas do balcão de retirada;
  // grupos: o fator dos grupos do dia (os 20 lugares já trazem +60% de movimento; sem ele, nem o bot afiado fechava o dia sem perder ninguém)
  { id:'industrial', nome:'Lanchonete na área industrial', nivel:2, lugares:20, aluguel:120, mudanca:800, credito:2000, cardapio:1.5, area:{ x0:160, y0:150, x1:684, y1:500 }, espera:5, assento:'pe', bebida:'suco', pratos:5, prateleira:4,
    tipos:{ estudante:1, executiva:1, familia:0.5, vovos:0.7, entregador:2, turma:2, motorista:1 }, encomenda:0.6, apito:{ quando:0.45, max:3, gap:[8, 12], aviso:10 }, patPressa:0.85, vip:0.3, metaF:2.3, expertF:1.6, grupos:0.8,
    traz:'a freguesia da fábrica e da estrada', deixa:'as TVs, o assento da espera e a jarra de suco ficam' },
  // v9.1: o 2º ponto novo (cap. 6 e 7). Sem apito, sem encomenda e sem patPressa: a turma, o motorista e a encomenda não vêm. vip: ×2 (restaurante atrai mais VIP)
  { id:'avenida', nome:'Restaurante na Avenida Brasil', nivel:3, lugares:24, aluguel:400, mudanca:2000, credito:4000, cardapio:2.0, area:{ x0:160, y0:150, x1:684, y1:500 }, espera:6, assento:'pe', bebida:'saborizada', pratos:6, prateleira:4,
    tipos:{ estudante:0.5, executiva:2, familia:1.5, vovos:1, entregador:1, negocios:1.5 }, vip:2, metaF:3.2, expertF:3.8, grupos:0.7,
    traz:'o almoço de negócios e mais VIPs', art:'o' }
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
/* save do salão: { ponto, mesas:[{ x, y, seats, c, t? }], estoque:[{ seats, c, t? }] } (t: a toalha, v8.6.5). O estoque (v8.3.5) guarda mesas
   fora do salão: não abrem no dia nem pagam luz e gás, mas contam no teto de lugares. Mesa estragada sai; passou
   do teto, saem as do estoque e depois as últimas do salão; arranjo inválido vira o automático (e, se nem assim,
   o kit inicial) */
function normSalao(s){
  s = (s && typeof s === 'object') ? s : {};
  const ponto = pontoOf(s.ponto);
  const lista = l => (Array.isArray(l) ? l : []).filter(m => m && typeof m === 'object' && (+m.seats === 2 || +m.seats === 4))
    .map((m, i) => Object.assign({ x:Math.round(+m.x) || 0, y:Math.round(+m.y) || 0, seats:+m.seats, c:(+m.c >= 0 && +m.c <= 3) ? Math.round(+m.c) : i % 4 }, m.t ? { t:1 } : {}, m.cami ? { cami:1 } : {}));
  let mesas = lista(s.mesas);
  { let n = 0; mesas.forEach(m => { if (m.cami && ++n > CAMI_MESAS_MAX) delete m.cami; }); }   // v9.6: até CAMI_MESAS_MAX mesas da Cami
  const estoque = lista(s.estoque).map(m => Object.assign({ seats:m.seats, c:m.c }, m.t ? { t:1 } : {})), tot = () => salaoLugares(mesas) + salaoLugares(estoque);
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
/* ============================================================
   DECORAÇÃO (v8.6.5, pedido do usuário): enfeites da Garagem, comprados na aba Decoração da lojinha, à vontade.
   Desde a v8.6.6, contam no Ambiente do Gurugol (AVAL.amb: planta, rosa e toalha).
   - plantas: as espadas-de-são-jorge da calçada (da v7.7, que vinham de graça) e a samambaia na parede;
   - cantinho da Rosa: a foto da mãe da Bia, o quadro de giz com o prato do dia e a plaquinha "Comida é afeto".
   Comprado, o enfeite pode ser guardado e posto de volta de graça: save.decor[id] = 1 (à mostra) ou 0 (guardado).
   A toalha xadrez (com o porta-guardanapo e a florzinha) é de cada mesa: { t:1 } na mesa do salão ou do estoque,
   vai junto quando a mesa muda de lugar e some quando ela é vendida
   ============================================================ */
const DECOR = [
  { id:'espada',    grupo:'plantas', name:'Espada-de-são-jorge', desc:'No vaso de barro, na calçada, ao lado da espera.', cost:15 },
  { id:'lata',      grupo:'plantas', name:'Muda na lata',        desc:'Uma espada menor numa lata de tinta reaproveitada, encostada no muro.', cost:8 },
  { id:'samambaia', grupo:'plantas', name:'Samambaia',           desc:'Pendurada num suporte na parede, ao lado da janela.', cost:30 },
  // v9, só a partir da área industrial: as plantas da calçada (+0,1 cada no Ambiente)
  { id:'violeta',   grupo:'plantas', name:'Violetas',            desc:'Vasinhos de violeta na janela do lado de dentro.', cost:20, nivel:2, amb:0.1 },
  { id:'anturio',   grupo:'plantas', name:'Antúrio',             desc:'Um antúrio vermelho no vaso, no chão, perto da porta.', cost:30, nivel:2, amb:0.1 },
  { id:'pendente',  grupo:'plantas', name:'Samambaia pendurada', desc:'Pendurada no toldo da entrada.', cost:40, nivel:2, amb:0.1 },
  // v9.1, só na Avenida Brasil: as flores da calçada (+0,15 cada no Ambiente)
  { id:'tulipa',    grupo:'plantas', name:'Tulipas',             desc:'Numa jardineira, ao longo da calçada.', cost:40, nivel:3, amb:0.15 },
  { id:'copo',      grupo:'plantas', name:'Copos-de-leite',      desc:'Num vaso alto, ao lado da espera.', cost:50, nivel:3, amb:0.15 },
  { id:'orquidea',  grupo:'plantas', name:'Orquídeas',           desc:'Numa mesinha, perto da porta.', cost:60, nivel:3, amb:0.15 },
  { id:'foto',      grupo:'rosa',    name:'Foto da dona Rosa',   desc:'A mãe da Bia sorrindo, num porta-retrato na parede.', cost:10 },
  { id:'giz',       grupo:'rosa',    name:'Quadro de giz',       desc:'No cavalete, perto da porta, com o prato do dia escrito à mão.', cost:25 },
  { id:'placa',     grupo:'rosa',    name:'Plaquinha',           desc:'"Comida é afeto", pintada à mão, embaixo do letreiro.', cost:15 }
];
const DECOR_GRUPOS = [
  { id:'plantas', nome:'Plantas' },
  { id:'rosa',    nome:'Cantinho da Rosa' }
];
const TOALHA = { cost:12 };   // por mesa
function decorOf(id){ return DECOR.find(d => d.id === id); }
/* save.decor: { id: 1 à mostra, 0 guardado }; só os enfeites que existem */
function normDecor(d){
  const out = {};
  if (d && typeof d === 'object') DECOR.forEach(x => { if (x.id in d) out[x.id] = d[x.id] ? 1 : 0; });
  return out;
}
/* o enfeite id está à mostra no jogo g? (no menu e na Missão zero, o save do jogo) */
function decorOn(g, id){ return !!(g && g.save && g.save.decor && g.save.decor[id]); }

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

/* o gosto de cada tipo está em GOSTOS (v8.6.9); mais: chance de cada pessoa pedir um 2º item (v8.3.8);
   tip: gorjeta a mais, em fração da conta */
const CUSTOMER_TYPES = {
  estudante:  { label:'Estudante',   pat:1.0,  eat:[4.5,6.5], read:[3,4.5], size:[1,2], mais:0.3, tip:0 },
  executiva:  { label:'Executiva',   pat:0.65, eat:[5,7],     read:[3,4],   size:[1,1], mais:0.1, tip:0.1 },
  familia:    { label:'Família',     pat:0.95, eat:[7,9],     read:[5,6],   size:[3,4], mais:0.35,  tip:0 },
  vovos:      { label:'Vovô e vovó', pat:1.8,  eat:[8,9],     read:[4,6],   size:[2,2], mais:0.25,  tip:0 },
  entregador: { label:'Entregador',  pat:0.5,  eat:[3.5,5],   read:[3,3.5], size:[1,1], mais:0.1, tip:0, retira:true },
  // v9, só na área industrial (PONTOS[1].tipos): a turma da fábrica (o apito), o motorista de caminhão (pede o cafezinho no fim) e a
  // encomenda do setor (uma pessoa que busca `lote` marmitas na fila de retirada, sem Efood)
  turma:      { label:'Turma da fábrica',      pat:0.8, eat:[4,5.5], read:[3,4], size:[3,4], mais:0.15, tip:0, ind:true },
  motorista:  { label:'Motorista de caminhão', pat:1.4, eat:[6,8],   read:[3,4], size:[1,1], mais:0.6,  tip:0.1, pedeCafe:0.8, cafeTip:0.05, ind:true },
  encomenda:  { label:'Encomenda do setor',    pat:2,   eat:[3.5,5], read:[3,3.5], size:[1,1], mais:0, tip:0.1, retira:true, lote:[4, 6], efood:0, ind:true },
  // v9.1, só na Avenida Brasil (PONTOS[2].tipos): o almoço de negócios (3 ou 4 colegas de blazer ou camisa social; vale o vegetariano; não é VIP)
  negocios:   { label:'Almoço de negócios',    pat:0.8, eat:[7,9],   read:[4,5], size:[3,4], mais:0.2, tip:0.15 }
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
  // v8.8: o nível é experiência (xp, dos cursos: CURSO_XP); com a xp do nível seguinte ele fica pronto para subir e o aumento
  // de salário consolida o nível. Só a falta de dinheiro para a folha o derruba (folhaCorta), e a xp fica
  tonhao:  { levels:[ { slots:3, cook:1, crit:0.05, wash:0, pay:0, xp:0 }, { slots:3, cook:0.85, crit:0.12, wash:7, pay:15, xp:2 }, { slots:3, cook:0.7, crit:0.2, wash:4, pay:20, xp:5 },
                      { slots:3, cook:0.62, crit:0.26, wash:3, pay:25, xp:9 }, { slots:3, cook:0.55, crit:0.32, wash:2.5, pay:30, xp:14 } ] },
  // Dani (v8.7): entra de graça no cap. 2 como aprendiz (nível 1, sem salário); os níveis 2 a 4 são os aumentos da lojinha
  // v8.9: o nível também é experiência (xp: o trabalho dela e os cursos, ver DANI_XP); o aumento só consolida o nível
  dani:    { levels:[ null, { speed:0.4, tasks:1, pay:0, xp:0 }, { speed:0.5, tasks:2, pay:15, xp:4 }, { speed:0.65, tasks:2, pay:20, xp:8 }, { speed:0.8, tasks:3, pay:25, xp:13 } ] },
  // Joca (v9.2): o conhecido da Dani; entra na área industrial no nível 2 (R$ 45/dia) e sobe até o 4, como ela; faz o básico da casa
  joca:    { levels:[ null, null, { speed:0.5, tasks:2, pay:45, xp:0 }, { speed:0.65, tasks:2, pay:60, xp:6 }, { speed:0.8, tasks:3, pay:75, xp:12 } ] },
  // Cami (v9.3): garçonete de rodízio que o Joca indica; entra na Avenida já rápida e fica com o básico. Sobe só por curso (CAMI_CURSOS)
  cami:    { levels:[ null, { speed:0.9, tasks:3, pay:120 }, { speed:1.1, tasks:4, pay:140 }, { speed:1.25, tasks:4, pay:160, mesas:true } ] },
  // Anselmo (v9.5): coqueteleiro, só na Avenida; entra já no nível 2 (R$ 90/dia), não faz tarefas da lista; o nível 3 vem dos cursos do Terraço (4a)
  anselmo: { levels:[ null, null, { speed:0.8, pay:90, xp:0 }, { speed:1.0, pay:130, xp:0 } ] },
  // couvert artístico: só do nível 3 do salão em diante (Avenida Brasil, etapa 3 do plano)
  couvert: { pay:80, fee:3, effect:0.2, feeCut:0.5, nivel:3 },
  // ambiente da Garagem (v7.4.3): TV e som ligados o dia todo; o custo é a conta de luz (pay) e entra na folha
  tv:      { pay:3, effect:0.05 },
  som:     { pay:2, effect:0.05 }
};
/* v9, área industrial: as 3 televisões com sertanejo (instalar uma vez; depois, por dia: 0 desligadas, 1 com anúncios, 2 sem anúncios),
   o fogão industrial, a espera sentada e a jarra de suco (a melhoria `maquina` do ponto). Quem usa o quê: nivel === 2 */
const INDUSTRIAL = {
  tvs:{ instalar:120, modos:[ null, { nome:'com anúncios', pay:9, effect:0.1 }, { nome:'sem anúncios', pay:29, effect:0.15 } ] },
  fogao:{ cost:400, emerg:160, fator:0.5, slots:1 },
  assento:{ cadeira:{ nome:'Cadeirinhas de plástico', cost:60 }, banco:{ nome:'Banquinhos de madeira', cost:90 }, slow:0.15 }
};
function tvsModo(eq){ return INDUSTRIAL.tvs.modos[eq && eq.tvs] || null; }
/* v9.1, Avenida Brasil: os sofás da espera (o assento `up.assento = 'sofa'`; compra única; quem espera sentado nele perde a paciência
   `slow` mais devagar). O couvert artístico (STAFF.couvert) e as flores (DECOR nivel:3) também são só daqui para cima */
const AVENIDA = { sofa:{ nome:'Sofás com almofadas', cost:250, slow:0.25 } };
/* quanto a espera sentada alivia a paciência: o sofá da Avenida 25%, a cadeirinha e o banquinho da área industrial 15% */
function assentoSlow(a){ return a === 'sofa' ? AVENIDA.sofa.slow : a ? INDUSTRIAL.assento.slow : 0; }
const DANI_TASKS = [
  { id:'lixo',   name:'Tirar o lixo',   short:'Lixo' },
  { id:'pratos', name:'Retirar pratos sujos', short:'Recolher' },
  { id:'lavar',  name:'Lavar a louça',  short:'Lavar' },
  { id:'cafe',   name:'Servir cafezinho', short:'Cafezinho' },
  { id:'suco',   name:'Levar a água da espera', short:'Água', need:'maquina' },   // o suco da espera da v7.5 (água na Garagem desde a v7.7)
  { id:'marmita', name:'Levar as marmitas', short:'Marmita' },   // v8.6: da janela de prontos ao balcão de retirada
  { id:'doce', name:'Servir doces', short:'Doce', need:'confCaseira' }   // v9.2: depende do curso de Confeitaria caseira (up.confCaseira)
];
/* v9.2: as tarefas básicas da casa (lixo, pratos sujos, louça, água/suco da espera, marmitas): ficam com o ajudante mais novo do dia */
const BASICAS = ['lixo', 'pratos', 'lavar', 'suco', 'marmita'];
const DANI_PADRAO = ['pratos', 'lavar'], JOCA_PADRAO = ['lixo', 'lavar'], CAMI_PADRAO = ['lixo', 'pratos', 'lavar'];
/* tarefa que a Dani já pode exercer (a do suco da espera depende da máquina) */
/* a tarefa como o ponto a chama (v9: na área industrial a espera é suco, não água; v9.1: na Avenida, água saborizada) */
function daniTaskDe(t, ponto){
  const n = (ponto || PONTOS[0]).nivel;
  if (t.id !== 'suco' || n < 2) return t;
  return n === 2 ? Object.assign({}, t, { name:'Levar o suco da espera', short:'Suco' }) : Object.assign({}, t, { name:'Levar a água saborizada', short:'Água' });   // v9.1: pela bebida do ponto
}
function daniTaskOk(id, up){ const t = DANI_TASKS.find(d => d.id === id); return !!t && (!t.need || !!(up && up[t.need])) && !(id === 'cafe' && up && up.espresso); }   // v9.3: com o espresso, o cafezinho é do Joca
/* prato caprichado (acerto crítico do Tonhão): +1 coração e bônus na entrega */
const CRIT = { bonus:10, vipBonus:20 };   // pontos (v8.3.8; eram R$)
const WASH = { base:0.3, perPile:2.5 };               // segundos na pia
const TRASH = { cap:6, empty:2, smell:0.3, tritura:30 };   // lixeira: capacidade, tempo para esvaziar, cheiro quando cheia, segundos do Triturador por gominho (v8.3.10)
function couvertEffect(eq){ return STAFF.couvert.effect * (eq.taxa ? 1 - STAFF.couvert.feeCut : 1); }
function couvertOk(ponto){ return devLivre() || (ponto || PONTOS[0]).nivel >= STAFF.couvert.nivel; }   // no modo dev, em qualquer ponto
/* ambiente do salão: quanto a paciência nas mesas cai mais devagar (TV, som e couvert se somam) */
function ambienteEffect(eq){
  const tm = tvsModo(eq);
  return (eq.tv ? STAFF.tv.effect : 0) + (eq.som ? STAFF.som.effect : 0) + (eq.couvert ? couvertEffect(eq) : 0) + (tm ? tm.effect : 0);
}
function payroll(eq){
  let v = STAFF.tonhao.levels[eq.tonhao].pay;
  if (eq.dani) v += STAFF.dani.levels[eq.dani].pay;
  if (eq.joca && !eq.jocaFora) v += STAFF.joca.levels[eq.joca].pay;   // v9.2
  if (eq.cami && !eq.camiFora) v += STAFF.cami.levels[eq.cami].pay;   // v9.3
  if (eq.anselmo && !eq.anselmoFora) v += STAFF.anselmo.levels[eq.anselmo].pay;   // v9.5
  if (eq.couvert) v += STAFF.couvert.pay;
  if (eq.tv) v += STAFF.tv.pay;
  if (eq.som) v += STAFF.som.pay;
  const tm = tvsModo(eq); if (tm) v += tm.pay;
  return v;
}
/* v8.1: dinheiro comprometido. A folha e a divulgação ficam reservadas ao abrir o dia (e saem no fim dele); o que não
   couber fica de fora, nesta ordem (a divulgação vira boca a boca antes de tudo) */
const FOLHA_CORTE = [['couvert', 'Couvert'], ['som', 'som'], ['tv', 'TV'], ['tvs', 'TVs'], ['anselmoFora', 'o Anselmo'], ['camiFora', 'a Cami'], ['jocaUp', 'aumento do Joca'], ['dani', 'aumento da Dani'], ['tonhao', 'aumento do Tonhão'], ['jocaFora', 'o Joca']];   // v9.3: a Cami; v9.5: o Anselmo vem antes dela
/* tira de eq o próximo item da folha (o Tonhão e a Dani perdem 1 nível de aumento; a Dani não sai da equipe) e devolve o nome; nada a tirar: null */
function folhaCorta(eq){
  const c = FOLHA_CORTE.find(k => k[0] === 'tonhao' ? eq.tonhao > 0 : k[0] === 'dani' ? eq.dani > 1 : k[0] === 'jocaUp' ? eq.joca > 2 && !eq.jocaFora : k[0] === 'jocaFora' ? eq.joca > 0 && !eq.jocaFora : k[0] === 'camiFora' ? eq.cami > 0 && !eq.camiFora : k[0] === 'anselmoFora' ? eq.anselmo > 0 && !eq.anselmoFora : eq[k[0]]);
  if (!c) return null;
  if (c[0] === 'tonhao' || c[0] === 'dani') eq[c[0]]--;
  else if (c[0] === 'jocaUp') eq.joca--;   // o Joca perde 1 nível de aumento (não sai da equipe)
  else if (c[0] === 'jocaFora') eq.jocaFora = true;   // "não vem": só neste dia (normEquipe não guarda), continua contratado
  else if (c[0] === 'camiFora') eq.camiFora = true;   // v9.3: idem para a Cami
  else if (c[0] === 'anselmoFora') eq.anselmoFora = true;   // v9.5: e para o Anselmo
  else eq[c[0]] = c[0] === 'tvs' ? 0 : false;
  return c[0] === 'jocaFora' ? 'o Joca (sem salário hoje)' : c[0] === 'camiFora' ? 'a Cami (sem salário hoje)' : c[0] === 'anselmoFora' ? 'o Anselmo (sem salário hoje)' : c[1];
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
  if (eq.dani > 1) out.push('aumento da Dani');
  if (eq.joca > 0) out.push('Joca');
  if (eq.cami > 0) out.push('Cami');
  if (eq.anselmo > 0) out.push('Anselmo');
  if (eq.couvert) out.push('couvert');
  if (eq.tv) out.push('TV');
  if (eq.som) out.push('som');
  if (eq.tvs) out.push('TVs');
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
const DRINK_PRICE = { coffee:3, juice:JUICE.price, doce:7, pote:7, cafeesp:10, drink:22 };   // v9.2: o doce (e o pote da marmita) também custa R$ 7 se for para o lixo (metade)
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
/* prato quente (v8.6.8): o prato que espera no balcão da cozinha fica quente até `quente` s; depois perde nota de comida
   (até `perde`, em `rampa` s). `friaDe` é a perda a partir da qual o cliente reclama que veio frio */
const PRATO = { quente:8, perde:1.5, rampa:20, friaDe:0.5 };
function pratoPerde(age){ return PRATO.perde * clamp((age - PRATO.quente) / PRATO.rampa, 0, 1); }
/* quanto do vapor ainda resta (1 quente, 0 frio de vez) */
function pratoVapor(age){ return 1 - clamp((age - PRATO.quente) / PRATO.rampa, 0, 1); }
const MARMITA = { adiantar:false,   // v9.6.2: o '+ marmita' desligado até vir a estufa (retorno de 01/11); o código fica
  embalagem:2, efood:0.15, vagas:2, reserva:1, validade:60, prato:'pf', fila:3 };
const MULTA = 10;                                     // grupo que vai embora bravo (com 0 corações) desconta isto do dia
const VIP = { pat:0.75, tip:0.1, perfect:40, angry:10, dish:12, cook:1.8, types:['estudante','vovos','familia','executiva'] };   // dish: o prato especial soma R$ 12 à conta e leva 1,8× o tempo; perfect: pontos (v8.3.8)

const DAYS = [
  { n:1, groups:5,  types:['estudante','vovos'],                                   nu:null,         meta:30, expert:60,  time:150, speed:0.60, note:'A freguesia espera lá fora, na calçada: arraste cada grupo até uma mesa livre.' },
  { n:2, groups:8,  types:['estudante','vovos','familia'],                         nu:'familia',    meta:108, expert:220,  time:160, speed:0.60, note:'Chegou a família! Grupos de 3 ou 4 só cabem nas mesas de 4 lugares. Na lojinha, aba Salão, dá para comprar mesas e arrumar o salão.' },
  { n:3, groups:13, types:['estudante','vovos','familia','executiva'],             nu:'executiva',  meta:135, expert:230,  time:170, speed:0.60, juice:0.3, note:'O movimento aumentou e agora só há 4 pratos limpos: sozinha a Bia não dá conta. A executiva tem pouca paciência, mas deixa boa gorjeta. E abriu o balcão de sucos: quem pede suco quer receber antes da conta!' },
  { n:4, groups:15, types:['estudante','vovos','familia','executiva','entregador'], nu:'entregador', meta:63, expert:110, time:180, speed:0.58, juice:0.3, note:'Chegou o entregador de moto! Ele não senta: espera no balcão de retirada, no alto da calçada, e leva o prato numa marmita. O pedido vai sozinho ao Tonhão; leve a marmita pronta ao balcão. Tem pressa!' },
  { n:5, groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:90, expert:140, time:190, speed:0.56, vip:0.15, juice:0.3, note:'Chegou cliente VIP (de óculos escuros e plaquinha dourada)! Fura a fila e tem menos paciência, mas pede o prato especial (mais caro), dá gorjeta e, se sair com 5 corações, pontos a mais. Se sair bravo, a multa dobra.' },
  { n:6, groups:16, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:140, expert:280, time:200, speed:0.54, vip:0.15, juice:0.3, note:'Sexta-feira: ninguém quer esperar.' },
  { n:7, groups:17, types:['estudante','vovos','familia','executiva','entregador'], nu:null,         meta:170, expert:310, time:220, speed:0.52, vip:0.15, juice:0.3, gripe:true, note:'Tonhão está gripado: a cozinha anda mais devagar hoje.' }
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
   do dia 4 em diante (v9.0.2; antes, do dia 3), a divulgação decide quanta gente aparece
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
   - menu: pelos cursos básicos que o Tonhão já fez (v8.6.9: base + porCurso por curso);
   - amb (ambiente): a base mais TV, som, torneira, ventilador, o cafezinho servido e o couvert; lixeira cheia tira.
   Quem sai bravo dá 1 na agilidade e no prato que não chegou a comer. Só `porDia` grupos do dia (sorteados) avaliam, como num restaurante de verdade. A nota é a média das últimas `max` avaliações,
   e só aparece depois das `min` primeiras; ela mexe no movimento do dia (v8.6.4: pelo teto do ponto, abaixo).
   Quem fica para o fim do dia (a lanchonete fecha) não avalia; dia largado no meio não conta.
   v8.6.4, teto por ponto: os critérios acima medem o serviço (1 a 5), e o Gurugol mostra a nota na escala do ponto:
   serviço 5 vale `teto` (pelo nível do ponto: Garagem 3, área industrial 3,7, Avenida Brasil 4,3, Terraço Suíça 5).
   Cada cliente tem o seu humor (de −humor.var a +humor.var) e, às vezes (`humor.encanta`), sai encantado e dá de
   humor.extra a mais, até `humor.folga` acima do teto: num dia especial, a Garagem chega a 3,5 ou 3,8. Quem sai bravo não
   tem humor.
   O movimento vai pela fração do teto: neutro na metade (2 ★ na Garagem) e +mov no teto.
   v8.6.6, decoração no ambiente: a base caiu de 3 para 2 (a Garagem pelada é "meio sem graça"); cada planta à mostra
   (DECOR, grupo plantas) soma amb.planta, cada peça do cantinho da Rosa amb.rosa, e quem senta numa mesa com a toalha
   xadrez, amb.toalha. Sem enfeite, a TV, o som, a torneira, o ventilador e o cafezinho levam o ambiente só até 4,5
   v8.6.7, as regras da nota: (1) cada um avalia só o que viveu, e o critério que não viu fica null (quem desistiu na fila só dá a
   Espera; quem saiu bravo antes do pedido, Espera, Agilidade e Ambiente; depois do pedido, sem comer, mais o Cardápio; quem comeu,
   os 5; o entregador, Espera, Agilidade e Comida, e sem a marmita só Espera e Agilidade); cada critério tem a sua média, com a sua
   contagem, e a nota é a média das médias. (2) O humor e os encantados são fração da faixa do ponto (teto − 1), não um valor
   absoluto. (3) A cor certa, a corrente e o caprichado não somam mais na Agilidade: aumentam a chance de encantar (AVAL.bonus).
   (4) A nota mínima para sair de um ponto é AVAL.minimo do teto (avalMinimo), que só vale de verdade na etapa 3. v8.6.13: 90% (Garagem 2,7;
   era 95%, 2,9, que só o serviço perfeito com todos os cursos e a decoração alcançava; com 90%, quem faz os cursos chega lá por volta do dia 10) */
const AVAL = {
  max:30, min:8, porDia:4, porCoracao:0.75, mov:0.1,
  teto:[3, 3.7, 4.3, 5],
  humor:{ var:0.15, encanta:0.15, extra:[0.3, 0.6], folga:0.4 },   // frações da faixa do ponto (teto − 1)
  bonus:{ cor:0.1, corrente:0.1, crit:0.1 },   // v8.6.7: chance a mais de o cliente sair encantado
  minimo:0.9,
  prato:[[2.5, 4.5], [3, 4.7], [3.5, 5], [3.8, 5], [4, 5]],   // v8.8: 5 níveis do Tonhão
  menu:{ base:2, porCurso:0.6 },   // v8.6.9: pelos cursos básicos que o Tonhão fez (a Diversidade do cardápio)
  amb:{ base:2, tv:0.5, som:0.5, maquina:0.5, ventilador:0.5, cafe:0.5, couvert:1, lixo:-1, planta:0.3, rosa:0.25, toalha:0.5, tvs:0.5, tvsPlus:0.75, doce:0.25, selo:0.5, drink:0.25 }
};
const AVAL_CRIT = [
  { id:'espera', nome:'Espera por mesa',
    bom:['Sentei rapidinho!', 'Nem precisei esperar.', 'Mesa na hora!'], ruim:['Esperei muito por uma mesa.', 'A espera lá fora não andava.', 'Fiquei um tempão na calçada.'] },
  { id:'agil', nome:'Agilidade',
    bom:['A comida veio rapidinho!', 'Atendimento nota 10!', 'A Bia é um foguete!'], ruim:['Demoraram para anotar o pedido.', 'Esqueceram da gente na mesa.', 'A conta demorou demais.'],
    // v9: comentários próprios dos tipos da área industrial e do almoço de negócios (50% das vezes, quando o grupo é do tipo)
    tipo:{ turma:{ bom:['Deu tempo de almoçar com calma!'], ruim:['Quase perdi a volta do intervalo.'] }, encomenda:{ bom:['Chegou tudo certinho pro setor!'], ruim:['Faltou marmita pra metade do pessoal.'] },
      negocios:{ bom:['Deu pra fechar o negócio com calma!'], ruim:['A reunião atrasou por causa do almoço.'] } } },   // v9.1
  { id:'prato', nome:'Qualidade da comida',
    bom:['O PF estava caprichado!', 'Comida de mãe!', 'Que tempero!'], ruim:['O prato veio sem graça.', 'Comida meio fria.', 'Faltou tempero.'] },
  { id:'menu', nome:'Diversidade do cardápio',
    bom:['Cardápio bem variado!', 'Muita opção boa.'], ruim:['Pouca opção no cardápio.', 'Queria mais pratos.'] },
  { id:'amb', nome:'Ambiente',
    bom:['Lugar gostoso, dá vontade de voltar.', 'Ambiente bem agradável!'], ruim:['Lugar meio sem graça.', 'Faltou um capricho no salão.'] }
];
/* a nota do cardápio (v8.6.9): a base mais um tanto por curso básico feito (o avançado não conta) */
/* v9.2: os cursos de item dos ajudantes (confeitaria da Dani, espresso do Joca) também contam, `extra` deles */
function avalMenu(cursos, extra){ return clamp(AVAL.menu.base + AVAL.menu.porCurso * (CURSOS.filter(c => c.preco > 0 && cursoNivel(cursos, c.id) >= 1).length + (extra || 0)), 1, 5); }
function cursosItem(sv){
  return DANI_CURSOS.filter(c => c.item && sv.daniCursos && sv.daniCursos[c.id]).length + JOCA_CURSOS.filter(c => c.item && sv.jocaCursos && sv.jocaCursos[c.id]).length;
}
/* as avaliações guardadas: [espera, agil, prato, menu, amb], com uma casa decimal, as últimas AVAL.max; null (v8.6.7) é o critério que o cliente não viu */
function normAval(a){
  return (Array.isArray(a) ? a : []).filter(r => Array.isArray(r) && r.length === AVAL_CRIT.length).slice(-AVAL.max)
    .map(r => r.map(v => v == null ? null : clamp(Math.round((+v || 1) * 10) / 10, 1, 5)));
}
/* os últimos comentários (v8.4.2, aba Gurugol da lojinha): { d: o dia, n: a nota ×10, t: o texto, k: o tipo do grupo, v: VIP } */
const AVAL_COM = 30;
function normAvalCom(a){
  return (Array.isArray(a) ? a : []).filter(c => c && typeof c === 'object' && typeof c.t === 'string' && c.t).slice(-AVAL_COM)
    .map(c => { const o = { d:Math.max(1, Math.round(+c.d) || 1), n:clamp(Math.round(+c.n) || 10, 10, 50), t:c.t.slice(0, 60), k:CUSTOMER_TYPES[c.k] ? c.k : 'estudante' }; if (c.v) o.v = 1; return o; });
}
/* a nota de uma avaliação: a média dos critérios que o cliente viu */
function avalNota(r){ const v = r.filter(x => x != null); return v.reduce((a, x) => a + x, 0) / (v.length || 1); }
/* médias de uma lista de avaliações (null se vazia): n (avaliações), crit (a média de cada critério, null se ninguém o viu),
   cnt (quantas avaliações viram cada critério) e a nota, a média das médias dos critérios vistos */
function avalMedias(lista){
  if (!lista.length) return null;
  const cnt = AVAL_CRIT.map((c, i) => lista.reduce((a, r) => a + (r[i] == null ? 0 : 1), 0));
  const crit = AVAL_CRIT.map((c, i) => cnt[i] ? lista.reduce((a, r) => a + (r[i] == null ? 0 : r[i]), 0) / cnt[i] : null);
  return { n:lista.length, nota:avalNota(crit), crit, cnt };
}
/* a nota mínima para sair de um ponto (v8.6.7): AVAL.minimo do teto, arredondada para cima em uma casa */
function avalMinimo(ponto){ return Math.ceil(Math.round(avalTeto(ponto) * AVAL.minimo * 1000) / 100) / 10; }
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
const AVAL_POUCO = ['Só tem PF e coxinha?', 'Queria um pastel, mas não tem...', 'Sempre a mesma coisa no cardápio.'];   // v9.0.1: o Tonhão ainda não fez curso básico
const AVAL_BRAVO = { fila:['Desisti de esperar!', 'Nem consegui sentar.'], mesa:['Fui embora sem comer!', 'Nunca mais volto!'], retirada:['Cadê a marmita?!', 'Saí sem o pedido!'] };   // retirada (v8.6): o entregador
/* elogios do ambiente que citam a decoração (v8.6.6), por enfeite (a toalha, só de quem sentou numa mesa com ela) */
const AVAL_DECOR = {
  espada:'Que plantinha linda na entrada!', lata:'Adorei a mudinha na lata!', samambaia:'Que samambaia bonita!',
  foto:'Que foto bonita na parede!', giz:'Adorei o quadro de giz!', placa:'"Comida é afeto": é isso mesmo!',
  toalha:'A toalha xadrez dá um charme!',
  violeta:'Que violetas lindas na janela!', anturio:'Adorei o antúrio na entrada!', pendente:'A samambaia no toldo ficou linda!',
  tulipa:'Que tulipas lindas na calçada!', copo:'Adorei os copos-de-leite!', orquidea:'Que orquídea mais delicada!'
};
function avalComentario(r, bravo, lixo, nivel, decor, fria, semVeg, tipo, pouco){
  if (bravo) return pick(AVAL_BRAVO[bravo]);
  const bom = Math.round(avalNota(r) * 10) >= 40;   // pela nota com uma casa (3,96 vira 4,0)
  const tp = tipo && AVAL_CRIT[1].tipo[tipo];   // v9: a turma e a encomenda têm comentário próprio de agilidade (50%)
  if (tp && Math.random() < 0.5) return pick(tp[bom ? 'bom' : 'ruim']);
  if (bom && AVAL_SIMPLES[(nivel || 1) - 1] && Math.random() < 0.3) return pick(AVAL_SIMPLES[(nivel || 1) - 1]);
  // v8.6.6: com o ambiente bom (4 ou mais), às vezes elogia um enfeite que viu (decor: os ids, e 'toalha')
  if (bom && decor && decor.length && r[AVAL_CRIT.findIndex(c => c.id === 'amb')] >= 4 && Math.random() < 0.35) return AVAL_DECOR[pick(decor)];
  let k = r.findIndex(v => v != null);
  r.forEach((v, i) => { if (v != null && (bom ? v > r[k] : v < r[k])) k = i; });
  if (!bom && semVeg){ const m = AVAL_CRIT.findIndex(c => c.id === 'menu'); if (r[m] != null && r[m] <= r[k]) return 'Não tinha nada vegetariano.'; }   // v8.6.11
  if (!bom && pouco){ const m = AVAL_CRIT.findIndex(c => c.id === 'menu'); if (r[m] != null && r[m] <= r[k]) return pick(AVAL_POUCO); }   // v9.0.1
  if (!bom && lixo && AVAL_CRIT[k].id === 'amb') return 'Que cheiro de lixo!';
  if (!bom && fria && AVAL_CRIT[k].id === 'prato') return 'Comida meio fria.';   // v8.6.8: o prato esfriou no balcão
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
  if (+e.ini > 0) out.ini = Math.round(+e.ini);   // v8.7: sem parcela nem juros antes do dia ini
  if (e.ref) out.ref = true;                       // v8.7: é a reforma da garagem
  return out;
}
/* juros do dia sobre o saldo */
function jurosDe(e, dia){ return e.resto && !carencia(e, dia) ? Math.round(e.resto * e.j) : 0; }
/* v8.7: a reforma só cobra a partir do dia ini (dia: o dia que fecha; sem dia, vale sempre) */
function carencia(e, dia){ return !!(e.ini && dia != null && dia < e.ini); }
/* a parcela do fim do dia: a amortização (a última fecha a conta) mais os juros do dia */
function parcelaDe(e, dia){ return e.resto && !carencia(e, dia) ? Math.min(e.resto, e.amort) + jurosDe(e, dia) : 0; }
/* o que o banco cobra no fim do dia: com uma parcela atrasada, 2 amortizações e os juros (os de ontem já foram para o saldo) */
function devidoDe(e, dia){ return e.resto && !carencia(e, dia) ? Math.min(e.resto, e.amort * (e.atr ? 2 : 1)) + jurosDe(e, dia) : 0; }
/* as parcelas que faltam, pagando em dia (para mostrar na aba Banco) */
function tabelaDe(e){
  const out = []; let r = e.resto;
  while (r > 0 && out.length < 20){ const a = Math.min(r, e.amort); out.push(a + Math.round(r * e.j)); r -= a; }
  return out;
}
/* um empréstimo novo de v, pagando em dia: as parcelas e os juros somados */
function simulaEmprestimo(v, j){ const t = tabelaDe(normEmprestimo({ resto:v, amort:Math.ceil(v / BANCO.parcelas), j })); return { parcelas:t, juros:t.reduce((a, p) => a + p, 0) - v }; }
/* ============================================================
   MODO HISTÓRIA (v8.7): a campanha em capítulos. Cada capítulo tem um objetivo, que vale no fim de um dia (sem prazo: se não
   cumpriu, o capítulo segue), e conversas (balões sobre o salão) antes e depois. fala: { q:'bia'|'tonhao'|'dani', s:texto,
   nota?:rubrica em itálico }. save.cap (1 a 7; 4 e 6 esperam a mudança de ponto; 6 = área industrial completa; 8 = Avenida Brasil completa), save.capDia, save.capAzul, save.conversa ('antes'/'depois'/null).
   REFORMA: o empréstimo da reforma da garagem, que o save novo já traz (1ª parcela no fim do dia ini)
   ============================================================ */
const HIST = { on: !(typeof window !== 'undefined' && window.__semHist) };   // os testes antigos ligam window.__semHist: save novo sem a História
const REFORMA = { valor:1000, amort:100, juros:0.01, ini:2 };
const HISTORIA = [
  { cap:1, titulo:'A garagem da Rosa', ponto:'garagem', obj:{ azul:2 },
    antes:[
      { q:'tonhao', s:'Panela no fogo, avental no lugar. Abre o portão, Bia!' },
      { q:'bia', s:'A garagem da mãe... Ela ia gostar de ver isso cheio de gente.' },
      { q:'tonhao', s:'Então vamos encher! E fechar o dia no azul, que o banco não espera.' }],
    depois:[
      { q:'bia', s:'Dois dias no azul, tio!' },
      { q:'tonhao', s:'Isso! Agora é aguentar a parcela todo dia.' }] },
  { cap:2, titulo:'A Dani chega', ponto:'garagem', obj:{ nota:2.4 },
    antes:[
      { q:'bia', s:'Não dou conta da mesa e da pia ao mesmo tempo...' },
      { q:'tonhao', s:'Pedi ajuda pra Dani, filha da vizinha. Ela vem aprender com a gente.' },
      { q:'dani', s:'Sou meio lenta ainda, mas aprendo rápido!' }],
    depois:[
      { q:'dani', s:'Ouvi um freguês dizer que aqui é tudo limpinho!' },
      { q:'bia', s:'O Gurugol subiu, tio! Já tá em 2,4.' },
      { q:'tonhao', s:'Devagar e sempre.' }] },
  { cap:3, titulo:'Casa cheia', ponto:'garagem', obj:{ quitar:true, nota:2.7, caixa:800 },
    fim:{ h:'Fim dos capítulos da Garagem', p:'Quando quiser, a mudança para a área industrial está na lojinha.' },   // v9.1: o cartão de fim do último capítulo de cada ponto
    antes:[
      { q:'bia', s:'O Gurugol tá cheio de comentário sobre a gente!' },
      { q:'dani', s:'Tem freguês perguntando se a gente vai abrir num lugar maior.' },
      { q:'tonhao', s:'Primeiro quita a reforma. Depois junta pra mudança.' }],
    depois:[
      { q:'bia', s:'Reforma quitada e R$ 800 guardados!' },
      { q:'tonhao', nota:'cheirando o pote de cominho', s:'Cominho com açafrão... a Rosa ia rir de mim agora.' },
      { q:'bia', s:'Por quê, tio?' },
      { q:'tonhao', s:'Um dia eu te conto da Casa Aurora.' }] },
  // v9: os capítulos do primeiro ponto novo. O cap. 4 só começa na mudança (na lojinha); até lá save.cap fica em 4, "à espera" (v9.1: o `fim` do último capítulo de cada ponto é o cartão de fim)
  { cap:4, titulo:'Ponto novo', ponto:'industrial', obj:{ azul:3 },
    antes:[
      { q:'bia', s:'Olha o tamanho disso, tio! Vinte lugares!' },
      { q:'tonhao', s:'E aluguel todo dia. Aqui o almoço é corrido: o pessoal da fábrica tem hora pra voltar.' },
      { q:'bia', s:'Então é servir rápido e fechar no azul.' }],
    depois:[
      { q:'tonhao', s:'Três dias no azul pagando aluguel. Tá provado, Bia.' },
      { q:'bia', s:'E a moto não para de chegar pedindo marmita!' }] },
  { cap:5, titulo:'Hora do almoço', ponto:'industrial', obj:{ marmitas:6, nota:3.4, caixa:2000 },
    antes:[
      { q:'dani', s:'Os motoqueiros já sabem o meu nome!' },
      { q:'tonhao', s:'Marmita bem fechada e na hora. Quem sai da fábrica volta amanhã.' },
      { q:'bia', s:'E se a nota subir, dá pra sonhar com a Avenida Brasil.' }],
    depois:[
      { q:'bia', s:'R$ 2.000 guardados! Dá pra Avenida Brasil, tio.' },
      { q:'tonhao', nota:'largando a colher', s:'Na Avenida Brasil tem o restaurante do Bráulio.' },
      { q:'bia', s:'O chef de bigode da Casa Aurora?' },
      { q:'tonhao', s:'Ele mesmo. A estrela veio do molho da sua mãe... e ele nunca conseguiu repetir.' },
      { q:'dani', s:'Então é lá que a gente vai abrir!' }],
    fim:{ h:'Fim dos capítulos da área industrial', p:'Quando quiser, a mudança para a Avenida Brasil está na lojinha.' } },
  // v9.1: os capítulos da Avenida Brasil. O cap. 6 só começa na mudança (na lojinha); até lá save.cap fica em 6, "à espera". O Bráulio é só citado
  { cap:6, titulo:'Do outro lado da rua', ponto:'avenida', obj:{ azul:3 },
    antes:[
      { q:'bia', s:'Avenida Brasil, tio! Olha o movimento dessa calçada.' },
      { q:'tonhao', nota:'olhando pela janela', s:'E ali, do outro lado da rua... o restaurante do Bráulio.' },
      { q:'bia', s:'Então ele vai ver a gente crescer de pertinho.' },
      { q:'dani', s:'E aqui cabe até música ao vivo!' }],
    depois:[
      { q:'tonhao', s:'Três dias no azul com aluguel de gente grande.' },
      { q:'bia', s:'O pessoal do Bráulio passou duas vezes espiando pela janela.' },
      { q:'tonhao', nota:'rindo', s:'Deixa espiar.' }] },
  { cap:7, titulo:'Nota de restaurante', ponto:'avenida', obj:{ nota:3.9, caixa:5000 },
    antes:[
      { q:'bia', s:'Aqui o Gurugol é mais exigente. Restaurante é outra régua.' },
      { q:'tonhao', s:'Então capricha: prato bonito, mesa limpa e ninguém esperando.' },
      { q:'dani', s:'E guardar dinheiro. Ouvi falar de um terraço lá no alto...' }],
    depois:[
      { q:'bia', s:'Nota 3,9 e R$ 5.000 guardados!' },
      { q:'tonhao', nota:'tirando o avental', s:'O Bráulio veio jantar aqui ontem. Pediu PF.' },
      { q:'bia', s:'E aí?' },
      { q:'tonhao', s:'Comeu tudo e não disse nada. Mas raspou o prato.' },
      { q:'dani', s:'Próxima parada: o Terraço Suíça!' }],
    fim:{ h:'Fim dos capítulos da Avenida Brasil', p:'Continua na próxima versão: o Terraço Suíça.' } }
];
/* v9.0.1: a conversa do cardápio, no fim do dia `dia` (ou do 1º dia completo depois dele, para saves antigos), só no Modo História.
   falas: o Tonhão ainda não fez curso; fez: já fez algum (básico de qualquer curso ou o avançado do PF). save.convCard: 'pend' | 1 (vista) */
const HIST_CARDAPIO = { dia:2,   // v9.6.2: no fim do dia 2 (antes, do dia 1), para a 1ª lojinha ficar sem empurrão
  falas:[ { q:'bia', s:'Tio, hoje um monte de gente perguntou se só tem PF e coxinha...' },
          { q:'tonhao', s:'É... a Rosa fazia um pastel que era uma beleza. Eu nunca aprendi.' },
          { q:'bia', s:'Então faz um curso! Tem uns baratinhos.' },
          { q:'tonhao', s:'Tá bom, tá bom. Vê aí no Cardápio da lojinha o que cabe no bolso.' } ],
  fez:[ { q:'bia', s:'O pessoal adorou o prato novo!' },
        { q:'tonhao', s:'Então vou fazer mais cursos. Tá tudo no Cardápio da lojinha.' } ] };
/* v9.0.2: a conversa da divulgação, no fim do dia anterior ao DIVULGA_DIA, só no Modo História (a lojinha abre na Divulgação).
   save.convDiv: 'pend' | 1 (vista). v9.0.3: enquanto pendente, a divulgação não abre (o movimento da inauguração segue) */
const HIST_DIVULGA = {
  falas:[ { q:'tonhao', s:'A festa da inauguração acabou, Bia. Daqui pra frente, quem vem é porque ouviu falar da gente.' },
          { q:'bia', s:'No boca a boca? Então vai ter dia fraco...' },
          { q:'bia', s:'E se a gente fizer panfleto? Eu entrego no ponto de ônibus antes de abrir!' },
          { q:'tonhao', nota:'coçando a cabeça', s:'Panfleto custa, mas traz o movimento de sempre. E tem as redes sociais, pra quem tem lugar pra tanta gente.' },
          { q:'bia', s:'Vou ver na Divulgação da lojinha o que compensa.' } ] };
/* v9.6.2: a conversa dos entregadores, no fim do dia 4 (o 1º com motoboy), só no Modo História. save.convEnt: 'pend' | 1 (vista) */
const HIST_ENTREGA = { dia:4,
  falas:[ { q:'bia', s:'Tio, que história é essa de motoqueiro no balcão pedindo marmita?' },
          { q:'tonhao', nota:'mostrando o celular', s:'Pus a gente na Efood, o aplicativo de entrega. O pedido cai direto aqui na cozinha.' },
          { q:'bia', s:'E o moço espera em pé no balcão. Se demorar, vai embora bravo...' },
          { q:'tonhao', s:'Então marmita pronta, leva logo pro balcão. A Efood fica com um pedaço, mas é freguês que nem cabe no salão.' },
          { q:'bia', s:'E dá pra deixar umas prontas antes?' },
          { q:'tonhao', s:'Sem estufa, esfria. Por enquanto, só sai na hora.' } ] };
/* v9.2, doces da Confeitaria caseira (a geladeirinha de doces): cada doce vale R$ 7 na conta (ingrediente R$ 2); ao terminar de comer, o grupo
   pode pedir `randi(1, size)` doces (chance por tipo, VIP +vip; nunca o entregador); a marmita vem "+ doce" em `marmita` das vezes */
/* v9.3: com o curso Confeitaria gourmet (up.confGourmet) a vitrine refrigerada serve os gourmet, que saem do sorteio dos caseiros: R$ 16 cada
   (ingrediente R$ 4) e +AVAL.amb.doce no Ambiente de quem comeu. `todos` dá o índice do desenho (0 a 2 caseiros, 3 a 5 gourmet) */
const DOCES = { preco:7, ingred:2, vip:0.2, marmita:0.3, gourmetPreco:16, gourmetIngred:4,
  caseira:[ { id:'bolo', nome:'Bolo de pote' }, { id:'brigadeiro', nome:'Brigadeiro de colher' }, { id:'pudim', nome:'Pudim' } ],
  gourmet:[ { id:'shortcake', nome:'Shortcake de morango' }, { id:'torta', nome:'Torta de limão' }, { id:'brigGourmet', nome:'Brigadeiro gourmet' } ],
  pede:{ familia:0.5, vovos:0.6, estudante:0.3, executiva:0.2, negocios:0.4, turma:0.3, motorista:0.3 } };
DOCES.todos = DOCES.caseira.concat(DOCES.gourmet);
function docesLista(up){ return up && up.confGourmet ? DOCES.gourmet : DOCES.caseira; }
function docePreco(up){ return up && up.confGourmet ? DOCES.gourmetPreco : DOCES.preco; }
function doceIngred(up){ return up && up.confGourmet ? DOCES.gourmetIngred : DOCES.ingred; }
function doceIdx(id){ return Math.max(0, DOCES.todos.findIndex(d => d.id === id)); }
/* v9.3, cafés da máquina de espresso (curso do Joca, só na Avenida): pedidos de fim de refeição, como os doces. prep: segundos para tirar; preco: R$ na conta */
const CAFES = { ingred:2, vip:0.1,
  lista:[ { id:'espresso', nome:'Espresso', preco:8, prep:0.8 }, { id:'cappuccino', nome:'Cappuccino', preco:12, prep:1.2 } ],
  pede:{ executiva:0.5, negocios:0.6, vovos:0.4, familia:0.2, estudante:0.3 } };
function cafeDe(id){ return CAFES.lista.find(c => c.id === id) || CAFES.lista[0]; }
/* v9.5, drinks do Anselmo (só na Avenida): pedidos ao sentar, junto com o prato; ele faz um por vez (prep / speed) e o copo pronto espera no balcão (`vagas`).
   pede: chance por tipo de grupo (VIP +vip); cada pessoa sorteada pede um drink entre os 3 (randi(1, size)). Nunca o entregador. preco: R$ na conta */
const DRINKS = { prep:4, preco:22, ingred:6, vip:0.2, vagas:2,
  pede:{ executiva:0.45, negocios:0.6, familia:0.25, vovos:0.25, estudante:0.35 },
  itens:[ { id:'por', nome:'Pôr do Sol da Avenida' }, { id:'brisa', nome:'Brisa de Maracujá' }, { id:'esmeralda', nome:'Esmeralda' } ] };
function drinkIdx(id){ return Math.max(0, DRINKS.itens.findIndex(d => d.id === id)); }
function drinkDe(id){ return DRINKS.itens.find(d => d.id === id) || DRINKS.itens[0]; }
/* o Anselmo trabalha hoje? (contratado, não cortado da folha e no ponto certo: Avenida; no modo dev, em qualquer um) */
function anselmoOn(eq, ponto){ return !!eq && eq.anselmo > 0 && !eq.anselmoFora && ((ponto || PONTOS[0]).nivel >= 3 || devLivre()); }
/* v9.0.4: a lojinha abre aos poucos no Modo História. Cada cartão: dia mínimo, garantia (ate), as reclamações do Gurugol
   no dia do gatilho e a conversa do fim do dia. save.libera[id]: 0 fechado | 'pend' | 1 aberto (selo "novo") | 2 aberto e visto */
const liberaTres = (av, i, lim) => av.filter(a => a.s && a.s[i] != null && a.s[i] <= lim).length >= 3;   // v9.1.1: 3 notas do dia no critério i, até lim
/* v9.1.1: entrada com `nivel` só vale com ponto.nivel >= nivel e conta `dia`/`ate` pelo diaNoPonto (em qualquer capítulo); sem `nivel`, pelo dia da carreira
   e só com cap < 4. `gatilho(st, av, g)` (stats do dia, notas cruas do dia, o jogo) diz se a reclamação aconteceu; sem ele, só a garantia (`ate`) */
const LIBERA = [
  { id:'bia', dia:2, ate:4, gatilho:(st, av) => st.bravoMesa >= 1 || liberaTres(av, 1, 3), reclama:['A moça corre pra lá e pra cá e não dá conta!', 'Demorou um século pra anotarem o pedido.'],
    falas:[ { q:'bia', s:'Hoje um freguês disse que eu corro pra lá e pra cá e não dou conta.' },
            { q:'tonhao', nota:'olhando o pé dela', s:'Também, com esse chinelo! Compra um tênis decente, Bia.' },
            { q:'bia', s:'E uma bandeja, pra levar dois pratos de uma vez...' },
            { q:'tonhao', s:'Tá tudo na lojinha, em Equipe, no seu nome.' } ] },
  { id:'melhorias', dia:3, ate:5, gatilho:(st, av) => !!st.lixoCheio || liberaTres(av, 0, 3), reclama:['Esperei no sol sem nem um copo d\'água.', 'Que calor aqui dentro!'], lixo:'Que cheiro de lixo!',
    falas:[ { q:'bia', s:'Tio, um moço reclamou que esperou no sol sem nem um copo d\'água.' },
            { q:'tonhao', s:'Dá pra pôr uma torneira lá fora. E um ventilador aqui, que a cozinha tá um forno.' },
            { q:'bia', s:'E um triturador, pra lixeira não encher tão rápido!' },
            { q:'tonhao', s:'Calma, uma coisa de cada vez. Vê nas Melhorias o que cabe no bolso.' } ] },
  { id:'manut', dia:3, ate:5, primeiro:true, gatilho:(st, av, g) => Math.min.apply(null, MANUT.equip.map(q => g.manut[q.id])) < MANUT.verde, reclama:['O café veio com gosto de queimado.', 'A comida demorou... o fogão tá fraco?'],
    falas:[ { q:'tonhao', nota:'batendo na lateral do fogão', s:'Esse fogão tá com a chama amarela. Coisa boa não é.' },
            { q:'bia', s:'Vai quebrar?' },
            { q:'tonhao', s:'Se ninguém olhar, um dia quebra no meio do almoço. Melhor chamar o técnico antes.' },
            { q:'bia', s:'Vou ver na Manutenção quanto custa a revisão.' } ] },
  { id:'salao', dia:4, ate:6, gatilho:(st) => st.lostBy.semMesa >= 1 || st.lotadoT >= 90, reclama:['Nem consegui sentar.', 'Só tem quatro mesinhas?'],
    falas:[ { q:'bia', s:'Hoje teve gente indo embora da fila: não tinha mesa pra todo mundo.' },
            { q:'tonhao', s:'Na garagem ainda cabem umas mesinhas. Cadeira de plástico é baratinha.' },
            { q:'bia', s:'Vou ver no Salão onde encaixar.' } ] },
  { id:'decor', dia:5, ate:7, gatilho:(st, av) => liberaTres(av, 4, 2.5), reclama:['Parece uma garagem.', 'Lugar meio sem graça.'],
    falas:[ { q:'bia', s:'Escreveram no Gurugol: "parece uma garagem".' },
            { q:'tonhao', s:'Mas é uma garagem!' },
            { q:'bia', s:'Uma plantinha, a foto da mãe na parede... fica com cara de casa.' },
            { q:'tonhao', nota:'sorrindo', s:'Isso a Rosa ia gostar. Vê na Decoração.' } ] },
  // v9.2, área industrial: o 4º dia no ponto abre o curso de Confeitaria caseira (cartão Cardápio); o Joca vem no fim do dia do curso
  { id:'confeitaria', nivel:2, dia:4, ate:4, reclama:[],
    falas:[ { q:'dani', s:'Bia, as famílias daqui sempre perguntam se tem sobremesa.' },
            { q:'bia', s:'E não tem...' },
            { q:'dani', s:'Eu faço brigadeiro desde pequena! Com um curso de confeitaria, dá pra vender doce na mesa e na marmita.' },
            { q:'tonhao', s:'Doce bom segura freguês. Vê no Cardápio da lojinha.' } ] },
  { id:'joca', nivel:2, dia:1, ate:999, gatilho:(st, av, g) => !!(g.save.daniCursos && g.save.daniCursos.confCaseira), reclama:['Tinha pouca gente pra cuidar de tanta mesa.', 'A moça de avental tava sozinha pra tudo.'],
    falas:[ { q:'dani', s:'Terminei o curso de confeitaria! Mas, se eu ficar nos doces, quem cuida da louça e do lixo?' },
            { q:'bia', s:'Pois é...' },
            { q:'dani', s:'Lembra do Joca, do meu colégio? Tá procurando serviço e é trabalhador.' },
            { q:'tonhao', s:'Esse salão é grande demais pra vocês duas, mesmo.' },
            { q:'joca', s:'Lixo, louça, mesa suja: pode deixar comigo!' },
            { q:'bia', s:'Tá na lojinha, em Equipe.' } ] },
  // v9.3, Avenida: no fim do dia do curso de espresso do Joca, ele indica a Cami e passa o bastão do básico
  // v9.5, Avenida: o Anselmo, coqueteleiro do restaurante do Bráulio, chega depois de 3 notas baixas no Ambiente
  { id:'anselmo', nivel:3, dia:3, ate:6, gatilho:(st, av) => liberaTres(av, 4, 3.5), reclama:['Não tem nem um drinkzinho aqui?', 'No restaurante da frente tem drink.'],
    falas:[ { q:'tonhao', s:'Bia, lembra do Anselmo, o dos drinks do Bráulio? Encontrei ele na feira.' },
            { q:'anselmo', s:'Seu Tonhão me contou da casa nova. Lá no Bráulio não dava mais: era grito o dia inteiro.' },
            { q:'bia', s:'Aqui ninguém grita. Só a chapa, de vez em quando.' },
            { q:'anselmo', s:'Me dá um balcão e eu faço o drink mais bonito da Avenida.' },
            { q:'bia', s:'Tá na lojinha, em Equipe.' } ] },
  { id:'cami', nivel:3, dia:1, ate:999, gatilho:(st, av, g) => !!(g.save.jocaCursos && g.save.jocaCursos.espresso), reclama:['Tinha pouca gente pra cuidar de tanta mesa.', 'A louça acumulou enquanto o café saía.'],
    falas:[ { q:'joca', s:'Agora que eu tô na máquina de café, a louça vai acumular...' },
            { q:'bia', s:'E o salão daqui não perdoa.' },
            { q:'joca', s:'Tem a Cami, do meu curso de barista. Ela era garçonete de rodízio: rápida que só!' },
            { q:'cami', s:'Me mostra onde fica tudo que eu dou conta!' },
            { q:'bia', s:'Tá na lojinha, em Equipe.' } ] } ];
function liberaOf(id){ return LIBERA.find(l => l.id === id) || null; }
/* v9.1.1: o dia da carreira em que o save chegou ao ponto de agora (save.pontoDia); n = o dia que terminou (padrão: o anterior ao save.dia,
   porque o fim do dia já avançou o save.dia). O 1º dia no ponto é 1 */
function diaNoPonto(sv, n){ return (n == null ? sv.dia - 1 : n) - sv.pontoDia + 1; }
const BIA_IDS = ['tenis', 'corrida', 'bandeja', 'sudoku'];
function upgradeCartao(id){ return BIA_IDS.indexOf(id) >= 0 ? 'bia' : 'melhorias'; }
const HIST_NOMES = { bia:'Bia', tonhao:'Tonhão', dani:'Dani', joca:'Joca', cami:'Cami', anselmo:'Anselmo' };
const CAIXA_MAX = 14;                                 // livro-caixa (v7.2): quantos dias da carreira ficam guardados
const VERSAO = 'v9.6.3';                            // vai no resumo do Caixa
const DIVULGA_DIA = 4;                                // antes disso, o movimento é o da inauguração (sem custo); v9.0.2: dia 4, e o padrão é o boca a boca
function divulgaAberta(n, sv){ return devLivre() || n >= DIVULGA_DIA && !(sv && sv.convDiv === 'pend'); }   // no modo dev, desde o dia 1; v9.0.3: no Modo História, só depois da conversa
function divulgaOf(id){ return DIVULGA.find(d => d.id === id) || DIVULGA[0]; }   // v9.0.2: sem escolha, boca a boca
/* o que se serve na espera, por nível do salão (v7.7, PONTOS.bebida). preco: R$ por copo na conta do grupo; ingred:
   custo de cada copo; prep: s até ficar pronto na estação; take: s da Bia (ou da Dani) para pegar ali.
   agua (nível 1, Garagem): água da torneira em copo americano, de graça; pedida no balão, a Bia enche na hora.
   suco (a máquina da v7.5, com tablet): guardado para a jarra de suco do nível 2 (etapa 3 do plano) */
const BEBIDA_ESPERA = {
  agua: { id:'agua', icon:'agua', preco:0, ingred:0, prep:0, take:1, fim:'Água na espera',
          pede:n => n > 1 ? n + ' águas, por favor!' : 'Uma água, por favor!', pega:n => n > 1 ? n + ' copos!' : 'Água!', entrega:n => n > 1 ? 'Águas entregues!' : 'Água entregue!' },
  suco: { id:'suco', icon:'juice', preco:12, ingred:INGRED.suco, prep:3, take:0.5, fim:'Sucos da espera',
          pede:n => n > 1 ? n + ' sucos, por favor!' : 'Um suco, por favor!', pega:n => n > 1 ? n + ' sucos!' : 'Suco!', entrega:n => n > 1 ? 'Sucos entregues!' : 'Suco entregue!' },
  // v9.1, Avenida Brasil: água saborizada, R$ 14 na conta; cada grupo sorteia um sabor (SABORES), que só muda a cor do copo e do balão
  saborizada: { id:'saborizada', icon:'saborizada', preco:14, ingred:3, prep:2, take:0.5, fim:'Águas saborizadas',
          pede:n => n > 1 ? n + ' águas saborizadas, por favor!' : 'Uma água saborizada, por favor!', pega:n => n > 1 ? n + ' copos!' : 'Água saborizada!', entrega:n => n > 1 ? 'Águas entregues!' : 'Água entregue!' }
};
const SABORES = [ { nome:'limão', cor:'#D6E24A', bal:'#F3F7C2' }, { nome:'morango', cor:'#F0708A', bal:'#FBD2DB' }, { nome:'hortelã', cor:'#6FD3A0', bal:'#CBF0DD' } ];
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
  { id:'maquina',    name:'Água da torneira',     desc:'Na calçada: torneira e copos americanos num caixote. Quem espera pede água; a Bia enche e leva, de graça, e quem bebe perde a paciência 40% mais devagar.', cost:80, devolve:100,
    porNivel:{
      2:{ name:'Jarra de suco', desc:'Num caixote ao lado da porta, com copos. Quem espera pede suco no balão; a Bia leva, R$ 12 na conta do grupo, e quem bebe perde a paciência 40% mais devagar.', cost:120 },   // v9: o ponto da área industrial troca o nome, o texto e o preço
      3:{ name:'Águas saborizadas', desc:'Numa mesinha de canto, com garrafas de vidro e copos. Quem espera pede água de limão, morango ou hortelã; a Bia leva, R$ 14 na conta do grupo, e quem bebe perde a paciência 40% mais devagar.', cost:200 } } },   // v9.1: a Avenida Brasil
  { id:'cafeteira',  name:'Cafeteira de 2 bocas', desc:'O cafezinho devolve +2 corações.',             cost:200 },
  { id:'bandeja',    name:'Bandeja',              desc:'Leva 2 pratos, 3 bebidas, prato + bebida ou 2 pilhas de louça.', cost:220 },
  { id:'sudoku',     name:'Livrinho de Sudoku',   desc:'A fila de ações da Bia ganha 3 quadrinhos (de 5 para 8 tarefas já marcadas).', cost:200 },   // v8.6.3
  { id:'ventilador', name:'Ventilador de teto',   desc:'A freguesia come 15% mais rápido.', cost:250 },   // v8.3.10: o cheiro da lixeira cheia voltou a incomodar
  { id:'triturador', name:'Triturador de lixo',   desc:'Mói os restos da lixeira: tira 1 do lixo a cada 30 s. Ainda é preciso esvaziar de vez em quando.', cost:180 },
  { id:'pratos',     name:'Jogo de pratos',       desc:'+1 prato limpo na cozinha (do dia 3 em diante). Leve quantos quiser.', cost:300, multi:true }   // v8.3.6: acumula
];

/* a melhoria como o ponto a vende (a Água da torneira vira a Jarra de suco na área industrial e as Águas saborizadas na Avenida) */
function upgradeDe(u, ponto){ const o = u.porNivel && u.porNivel[(ponto || PONTOS[0]).nivel]; return o ? Object.assign({}, u, o) : u; }
/* v9: o fogão industrial gasta metade do desgaste e o conserto de emergência custa mais */
function manutFator(id, up){ return id === 'fogao' && up && up.fogaoInd ? INDUSTRIAL.fogao.fator : 1; }
function manutEmerg(q, up){ return q.id === 'fogao' && up && up.fogaoInd ? INDUSTRIAL.fogao.emerg : q.emerg; }
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
  if (out.sorteio && s.fiscal && isFinite(+s.fiscal.f)) out.sorteio.fiscal = { f:clamp(+s.fiscal.f, FISCAL.quando[0], FISCAL.quando[1]) };   // v9.4
  return out;
}
/* imprevistos sem culpa (v8), do dia `dia` em diante na carreira: raros e avisados na introdução.
   chuva: menos gente e mais entregadores; feriado: mais gente e mais famílias */
const CLIMA = {
  chuva:   { nome:'Dia de chuva', chance:0.12, groups:0.8,  tipo:'entregador', tipoP:0.35, aviso:'Dia de chuva: vem menos gente, e mais entregadores (com pressa!).' },
  feriado: { nome:'Feriado',      chance:0.10, groups:1.25, tipo:'familia',    tipoP:0.25, aviso:'Feriado: a cidade saiu de casa! Mais gente e mais famílias.' }
};
const CLIMA_DIA = 3;
/* fiscal da vigilância sanitária (v9.4): só na Avenida (nivel >= 3), do `dia`-ésimo dia no ponto em diante, com `chance` por dia (sorteada com o clima, em
   manut.sorteio.fiscal, para não mudar ao rejogar). Entra num momento entre `quando` do turno, fica `visita` s olhando e confere 3 coisas: mesa suja por mais de
   `mesaSuja` s seguidos, lixeira cheia e pia com `pia` pilhas ou mais. 0 falhas: selo por `selo` dias (+`seloPts` pontos; AVAL.amb.selo no Ambiente); 1: advertência; 2 ou 3: multa */
const FISCAL = { nivel:3, dia:2, chance:0.15, quando:[0.3, 0.7], visita:20, mesaSuja:8, pia:4, multa:150, selo:7, seloPts:30,
  aviso:'Dizem que a vigilância sanitária está rondando a Avenida.', coment:'Vi o selo da vigilância: lugar limpinho!' };

