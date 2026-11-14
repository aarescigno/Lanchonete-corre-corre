/* ============================================================
   PESSOAS
   ============================================================ */
function newPerson(o){
  const skin = randi(0,5);
  const hair = pick([0,1,2,3,5,6,0,1]);
  const dark = skin >= 3 || hair === 3;
  const p = {
    skin, hair,
    hairC: dark ? pick(HAIRC.slice(0,3)) : pick(HAIRC.slice(0,4)),
    kid:false, elder:false, acc:null, glasses:false, pants:pick(PANTS)
  };
  return Object.assign(p, o||{});
}
function makePeople(type, size){
  const out = [];
  if (type === 'estudante'){
    for (let i=0;i<size;i++) out.push(newPerson({ acc: Math.random()<0.7 ? 'backpack' : 'book', glasses: Math.random()<0.25 }));
  } else if (type === 'vovos'){
    out.push(newPerson({ elder:true, hair: pick([4,0]), hairC: pick(['#E8E8E8','#8C8C8C']), glasses:true, acc:'cane' }));
    out.push(newPerson({ elder:true, hair: 2, hairC: pick(['#E8E8E8','#8C8C8C']), glasses: Math.random()<0.6 }));
  } else if (type === 'executiva'){
    out.push(newPerson({ hair: pick([1,2,3,5,0,6]), acc:'laptop', glasses: Math.random()<0.3 }));
  } else if (type === 'familia'){
    for (let i=0;i<size;i++){
      if (i < 2) out.push(newPerson({ hair: pick([0,1,2,3,5,6,4]), glasses: Math.random()<0.2 }));
      else out.push(newPerson({ kid:true, hair: pick([0,1,2,5,6]) }));
    }
  } else if (type === 'turma'){   // v9: macacão azul-marinho ou cinza com crachá; um ou outro com protetor de ouvido no pescoço
    for (let i=0;i<size;i++) out.push(newPerson({ shirt: pick(['#26335A', '#5E6470']), macacao:true, cracha:true, fone: Math.random()<0.3, hair: pick([0,1,2,3,5,6,4]), glasses: Math.random()<0.15 }));
  } else if (type === 'motorista'){   // v9: boné, camisa xadrez ou polo da transportadora e a chave do caminhão; homem ou mulher (50%)
    const mulher = Math.random() < 0.5;
    out.push(newPerson({ bone:true, boneC: pick(['#C2362B', '#2F5FA8', '#3E7B4A']), camisa: Math.random() < 0.5 ? 'xadrez' : 'polo', shirt: pick(['#B8442F', '#2F5FA8', '#D9A21E', '#3E7B4A']), acc:'chave', hair: mulher ? pick([2,3,5,6]) : pick([0,1,4]), mulher }));
  } else if (type === 'negocios'){   // v9.1: blazer ou camisa social de cores sóbrias (cinza, azul, vinho, bege), um com pasta ou notebook; várias cores de pele, idades e gêneros
    for (let i=0;i<size;i++){
      const velho = Math.random() < 0.15, blazer = Math.random() < 0.6;
      out.push(newPerson(Object.assign({ shirt: blazer ? pick(['#5F656D', '#2C4A78', '#6E2A3A', '#B7A78A']) : pick(['#CFE0EE', '#EDE6D6', '#D8C7D4', '#BFD3C8']), blazer, camisa: blazer ? null : 'social', gravata: Math.random() < 0.5 ? pick(['#B33A3A', '#2F5FA8', '#E8B43A', '#3E7B4A']) : null, glasses: Math.random() < 0.3, hair: pick([0,1,2,3,5,6]) },
        velho ? { elder:true, hair:4, hairC: pick(['#E8E8E8','#8C8C8C']), glasses:true } : {}, i === 0 ? { acc: pick(['laptop', 'pasta']) } : {})));
    }
  } else if (type === 'casal'){   // v10: duas pessoas adultas, de qualquer gênero, idade e cor de pele (os pares variam), de roupa de sair: vestido, camisa de cor forte ou blazer; uma flor na lapela ou no cabelo de uma delas
    const flor = randi(0, size - 1);
    for (let i=0;i<size;i++){
      const r = Math.random(), roupa = r < 0.35 ? 'vestido' : r < 0.7 ? 'camisa' : 'blazer', velho = Math.random() < 0.18;
      const forte = pick(['#B3243B', '#2E5BA8', '#7B3FA0', '#1F7A5C', '#D9822B', '#C2185B', '#2F7D86']), sobrio = pick(['#2C4A78', '#6E2A3A', '#2F5D4A', '#3A3A44']);
      out.push(newPerson(Object.assign({ shirt: roupa === 'blazer' ? sobrio : forte, glasses: Math.random() < 0.2, hair: pick([0,1,2,3,5,6]) },
        roupa === 'vestido' ? { vestido:true } : roupa === 'camisa' ? { camisa:'social' } : { blazer:true, gravata: Math.random() < 0.3 ? pick(['#E8B43A', '#B33A3A']) : null },
        velho ? { elder:true, hair:4, hairC: pick(['#E8E8E8','#8C8C8C']), glasses:true } : {},
        i === flor ? { flor: roupa !== 'vestido' && Math.random() < 0.6 ? 'lapela' : 'cabelo', florC: pick(['#F28AA8', '#FFFDF4', '#F2C94C', '#D8334A']) } : {})));
    }
  } else if (type === 'encomenda'){   // v9: crachá e uma sacola térmica
    out.push(newPerson({ cracha:true, sacola:true, shirt: pick(['#2F7D86', '#8A4F9E', '#3E7B4A']), hair: pick([0,1,2,3,5,6]), glasses: Math.random()<0.3 }));
  } else { // entregador
    out.push(newPerson({ hair:0, acc:'helmet' }));
  }
  return out;
}
function seatPositions(t){
  if (t.seats === 2) return [ {x:t.cx, y:t.cy-6, front:false}, {x:t.cx, y:t.cy+56, front:true} ];
  return [
    {x:t.cx-28, y:t.cy-6,  front:false}, {x:t.cx+28, y:t.cy-6,  front:false},
    {x:t.cx-28, y:t.cy+56, front:true },  {x:t.cx+28, y:t.cy+56, front:true }
  ];
}
function tableHalfW(t){ return t.seats === 2 ? 36 : 62; }
const STATION_KEYS = ['adiantar','order','rosas','marmj','plates','coffee','juice','sink','trash','maquina','retirada','doces','espresso','drinks'];
function tableRect(t){ return { x:t.cx - t.hx - 10, y:t.cy - 62, w:t.hx*2 + 20, h:132 }; }
function queueRect(g){ return { x:QUEUE.x - 74, y:QUEUE.ys[g.slot] - 76, w:148, h:90 }; }
/* onde a Bia (ou a Dani) para ao levar o suco a quem espera: ao lado do tablet do lugar */
function esperaAp(slot){ return { x:QUEUE.x + 104, y:QUEUE.ys[slot] - 18 }; }
function rectDist(x, y, r){ return Math.hypot(Math.max(r.x - x, 0, x - r.x - r.w), Math.max(r.y - y, 0, y - r.y - r.h)); }
function tableApproach(t){
  const hx = tableHalfW(t) + 28;
  return [ {x:t.cx-hx, y:t.cy+4}, {x:t.cx+hx, y:t.cy+4} ];
}
/* ---------- armazenamento (localStorage com try/catch e cópia em memória) ---------- */
const LS = { save:'lcc2_save', v1:'lcc_save_v1', rank:'lcc2_ranking', name:'lcc2_name', dev:'lcc2_dev', devSave:'lcc2_save_dev', abertura:'lcc2_abertura', devReal:'lcc2_dev_real', devBak:'lcc2_save_dev_bak' };   // abertura (v8.5): '1' quando já tocou sozinha
const MEM = {};
function lsGet(k){
  try { const v = localStorage.getItem(k); if (v != null) return v; } catch(e) {}
  return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null;
}
function lsSet(k, v){
  MEM[k] = v;
  try { localStorage.setItem(k, v); } catch(e) {}
}
/* modo dev (v7.5.1): 10 toques no selo da versão ligam e desligam. O jogo fica igual, com um save à parte (o progresso
   de verdade fica guardado e volta ao sair), qualquer dia à escolha no menu (v8.3), R$ 10.000 que não acabam (a lojinha repõe) e tudo
   liberado na lojinha, até antes do dia 1: melhorias de graça (liga e desliga), couvert e divulgação. Ranking de fora */
const DEV = { on: lsGet(LS.dev) === '1', bank: 10000, toques: 10, real: lsGet(LS.dev) === '1' && lsGet(LS.devReal) === '1', vel:1, aba:'pular', forca:{} };   // v9.2.1: real = preços e travas de verdade; vel = velocidade (só na memória); v10.2.1: real fica gravado (lcc2_dev_real); aba = a aba aberta do painel
function devLivre(){ return DEV.on && !DEV.real; }
/* v10.2.1: o Modo História liga fora do modo dev e no jeito "De verdade" do modo dev (no Livre fica desligado) */
function histLiga(){ return HIST.on && !devLivre(); }
function saveKey(){ return DEV.on ? LS.devSave : LS.save; }
/* v10.4: o couvert só vale na Avenida (no modo dev, também nos níveis 1 e 2) e a música só no Terraço: fora dali, saem */
function normEquipe(e, ponto){
  e = (e && typeof e === 'object') ? e : {};
  const tasks = Array.isArray(e.daniTasks) ? e.daniTasks.map(t => t === 'agua' ? 'suco' : t).filter(t => DANI_TASKS.some(d => d.id === t)) : ['pratos','lavar'];   // v7.5: a tarefa da água vira a do suco da espera
  const jt = Array.isArray(e.jocaTasks) ? e.jocaTasks.filter(t => BASICAS.indexOf(t) >= 0) : JOCA_PADRAO.slice(), jn = Math.round(+e.joca) || 0;   // v9.2: o Joca (0 ou 2 a 4) só tem tarefa básica
  const ct = Array.isArray(e.camiTasks) ? e.camiTasks.filter(t => BASICAS.indexOf(t) >= 0) : CAMI_PADRAO.slice(), cn = Math.round(+e.cami) || 0;   // v9.3: a Cami (0 ou 1 a 3) também só tem tarefa básica
  const an = Math.round(+e.anselmo) || 0;   // v9.5: o Anselmo (0, 2 ou 3), só na Avenida (no modo dev, em qualquer ponto)
  const li = Math.round(+e.lia) || 0;   // v10.2: a Lia (0 ou 1), só no Terraço (no modo dev, em qualquer ponto)
  return { lia: li >= 1 && (ponto.nivel >= 4 || devLivre()) ? 1 : 0, anselmo: an >= 2 && (ponto.nivel >= 3 || devLivre()) ? Math.min(an, STAFF.anselmo.levels.length - 1) : 0, cami: cn >= 1 ? Math.min(cn, ponto.nivel >= 4 || devLivre() ? STAFF.cami.levels.length - 1 : 3) : 0, camiFila: e.camiFila !== false, camiTasks: ct.filter((t,i) => ct.indexOf(t) === i).slice(0,4), camiModo: e.camiModo === 'mesas' ? 'mesas' : e.camiModo === 'tudo' ? 'tudo' : 'tarefas', joca: jn >= 2 ? Math.min(jn, STAFF.joca.levels.length - 1) : 0, jocaTasks: jt.filter((t,i) => jt.indexOf(t) === i).slice(0,3), tonhao: clamp(Math.round(+e.tonhao)||0,0,STAFF.tonhao.levels.length - 1), dani: clamp(Math.round(+e.dani)||0,0,STAFF.dani.levels.length - 1), daniTasks: tasks.filter((t,i) => tasks.indexOf(t) === i).slice(0,3), couvert: !!e.couvert && couvertOk(ponto), taxa: !!e.taxa && couvertOk(ponto), musica: musicaOk(ponto) ? clamp(Math.round(+e.musica) || 0, 0, TERRACO.musica.length - 1) : 0, tv: !!e.tv && ponto.nivel < 2, som: !!e.som && ponto.nivel < 2, tvs: ponto.nivel === 2 ? clamp(Math.round(+e.tvs) || 0, 0, INDUSTRIAL.tvs.modos.length - 1) : 0 };   // v9.1: as TVs são só da área industrial
}
/* livro-caixa (v7.2): uma linha por dia jogado na carreira (os últimos CAIXA_MAX). As compras da lojinha
   (melhorias e salão) ficam em caixaPend e entram na linha do dia seguinte, junto com o saldo ao fim dele.
   v8.3: st (estrelas do dia), emp (empréstimo recebido; forc: à força) e par (parcelas pagas ao banco); v8.3.1: atr e tom */
function normCaixa(c){
  const n = v => Math.round(+v) || 0;
  return (Array.isArray(c) ? c : []).filter(r => r && typeof r === 'object' && +r.d >= 1).slice(-CAIXA_MAX)
    .map(r => {
      const o = { d:Math.max(1, n(r.d)), fat:n(r.fat), ingr:n(r.ingr), contas:n(r.contas), folha:n(r.folha), div:n(r.div), lucro:n(r.lucro), meta:n(r.meta), ok:!!r.ok, perd:n(r.perd), mel:n(r.mel), sal:n(r.sal), man:n(r.man), saldo:n(r.saldo) };
      if (n(r.vig)) o.vig = n(r.vig);   // v9.4: a multa da vigilância (já somada em `contas`)
      if (n(r.dev)) o.dev = n(r.dev);   // linha "Devolução do salão" (v7.4): o que o salão antigo custou, de volta
      if (o.dev && r.devK === 'maquina') o.devK = 'maquina';   // ou a da máquina de suco, que virou torneira (v7.7)
      if (n(r.int)){ o.int = n(r.int); o.mul = n(r.mul); }   // dia encerrado no meio (v8.2.3): grupos que saíram bravos e a multa
      if (n(r.st)) o.st = clamp(n(r.st), 0, 3);
      if (n(r.av)) o.av = clamp(n(r.av), 10, 50);   // v8.4: a nota do Gurugol no dia, ×10
      if (n(r.emp)){ o.emp = n(r.emp); if (r.forc) o.forc = 1; }
      if (n(r.par)) o.par = n(r.par);
      if (n(r.jur)) o.jur = n(r.jur);   // v8.3.2: a parte de juros do que foi pago ao banco
      if (r.atr) o.atr = 1;   // v8.3.1: parcela do banco atrasada
      if (r.tom) o.tom = 1;   // e o dia em que o banco tomou a lanchonete
      return o;
    });
}
/* sal pode ficar negativo: mesa vendida no editor (v7.4) volta como dinheiro. man (v8): revisões na lojinha e consertos na hora.
   emp e par (v8.3): empréstimo recebido e o que foi pago ao banco (parcelas e quitação); jur (v8.3.2): a parte de juros */
function normPend(p){
  p = (p && typeof p === 'object') ? p : {};
  const pos = v => Math.max(0, Math.round(+v) || 0);
  return { mel: pos(p.mel), sal: Math.round(+p.sal) || 0, man: pos(p.man), emp: pos(p.emp), par: pos(p.par), jur: pos(p.jur) };
}
/* compra na lojinha (k: 'mel', 'sal', 'man', 'emp', 'par' ou 'jur'), anotada para a próxima linha do caixa */
function caixaGasto(s, k, v){ s.caixaPend = normPend(s.caixaPend); s.caixaPend[k] += v; }
function caixaAdd(s, row){
  const p = normPend(s.caixaPend);
  s.caixa = (Array.isArray(s.caixa) ? s.caixa : []).concat([Object.assign(row, p)]).slice(-CAIXA_MAX);
  s.caixaPend = normPend({});
}
/* o save já tem jogo (v8.6.9/v8.7): passou do dia 1, tem lucro, caixa ou estrelas */
/* v9.0.4: save.libera (um valor por LIBERA). Save sem ele: novo = tudo fechado (0); já jogado (antigo) = tudo aberto e visto (2) */
function normLibera(l, antigo){
  const o = {};
  if (l && typeof l === 'object' && l.luxo === undefined && l.decor !== undefined) l = Object.assign({}, l, { luxo:l.decor });   // v10.7: a Decoração virou a aba Luxo
  LIBERA.forEach(L => { const v = l && typeof l === 'object' ? l[L.id] : undefined; o[L.id] = v === 'pend' ? 'pend' : v === 1 ? 1 : v === 2 ? 2 : v === 0 ? 0 : (l && typeof l === 'object') || L.nivel ? 0 : antigo ? 2 : 0; });   // v9.1.1: o que falta e tem `nivel` é 0, nunca 2
  return o;
}
/* v9.1.1: save.pontoDia (inteiro >= 1, no máximo o dia). Save sem ele: na Garagem 1; num ponto de nível >= 2, dia - 1 (conta como o 2º dia no ponto) */
function pontoDiaDe(s, dia){
  const v = Math.round(+s.pontoDia);
  if (v >= 1) return Math.min(v, Math.max(1, dia));
  return pontoOf(s.salao && s.salao.ponto).nivel >= 2 ? Math.max(1, dia - 1) : 1;
}
function saveJogou(s){
  return (+s.dia > 1) || (+s.maxDay > 1) || (+s.lucroTot > 0) || (Array.isArray(s.caixa) && s.caixa.length > 0) || (!!s.stars && typeof s.stars === 'object' && Object.keys(s.stars).length > 0);
}
/* v10.5.3: save.vontDoce e save.vontCafe: 0 (nunca), 'pend' ou o dia da carreira em que a conversa foi vista */
function normVont(v){ const n = Math.round(+v); return v === 'pend' ? 'pend' : n >= 1 ? n : 0; }
function normSave(s){
  const up = (s.up && typeof s.up === 'object') ? s.up : {};
  if (up.jukebox){ up.agua = true; delete up.jukebox; }   // a Jukebox virou Água saborizada na v5
  if (up.agua){ up.maquina = true; delete up.agua; }      // e a Água saborizada virou a Máquina de suco na v7.5
  // a Máquina de suco virou a Água da torneira na v7.7 (mais barata): quem já tinha recebe a diferença, uma vez
  const devMaq = up.maquina && !s.torneira ? UPGRADES.find(u => u.id === 'maquina').devolve : 0;
  if (up.chapa){ up.pratos = true; delete up.chapa; }     // a Chapa nova virou Jogo de pratos (a velocidade da cozinha é do Tonhão)
  ['tvs', 'fogaoInd'].forEach(k => { if (up[k]) up[k] = true; else delete up[k]; });   // v9: itens da área industrial
  if (up.assento !== 'cadeira' && up.assento !== 'banco' && up.assento !== 'sofa' && up.assento !== 'poltrona') delete up.assento;   // v9.1: o sofá da Avenida; v10: as poltronas do Terraço
  if ('pratos' in up){ const n = pratosDe(up); if (n) up.pratos = n; else delete up.pratos; }   // v8.3.6: os Jogos de pratos viram um número
  // salão da v6 à v7.3 (v7.4): o que foi gasto em cadeiras e mesas volta para o dinheiro, numa linha do caixa, e o
  // jogo começa na Garagem com o kit
  // campanha (v8.3): o próximo dia (dia), as estrelas e o lucro somados, os dias seguidos no negativo (neg), o empréstimo
  // (emp) e se a folha que não cabe no dinheiro fica de fora (corta). Save antigo: segue do maior dia alcançado.
  // fechou (v8.3.1): o dia em que o banco tomou a lanchonete (a carreira acabou; só resta recomeçar)
  const stars = (s.stars && typeof s.stars === 'object') ? s.stars : {}, feitos = Object.keys(stars).filter(k => +stars[k] >= 1).map(Number);
  const dia = +s.dia >= 1 ? Math.round(+s.dia) : Math.max(clamp(Math.round(+s.maxDay) || 1, 1, 7), feitos.length ? Math.max(...feitos) + 1 : 1);
  const estrelas = isFinite(+s.estrelas) && s.estrelas != null ? Math.max(0, Math.round(+s.estrelas)) : Object.keys(stars).reduce((a, k) => a + clamp(Math.round(+stars[k]) || 0, 0, 3), 0);
  const bank = isFinite(+s.bank) ? Math.round(+s.bank) : 0;
  // Modo História (v8.7): save novo (sem jogo, fora do modo dev) começa o cap. 1, com a conversa de antes e a dívida da reforma;
  // save com histV e o do modo dev seguem como vierem (dev e testes: cap 4, sem objetivo)
  const hist = s.histV === 1, novoHist = !hist && HIST.on && !DEV.on && !saveJogou(s), capMax = HISTORIA.length + 1;
  // v10.5.2: a história passou de 9 para 11 capítulos; um save sem capV (da v10.5 ou antes) converte o capítulo uma vez: 1 a 6 ficam, 7 → 7 (o novo da Avenida começa),
  // 8 → 9, 9 → 10 (o novo do Terraço começa), 10 (o Fim) → 12. Com a conversa de depois pendente, o capítulo cumprido é o antigo: 7 → 8 e 9 → 11
  let capIn = Math.round(+s.cap) || capMax, capNovo = false;
  if (hist && s.capV !== 2 && s.capV !== 3 && s.capV !== 4 && s.capV !== 5 && s.capV !== 6){
    const dep = s.conversa === 'depois';
    if (capIn === 7){ if (dep) capIn = 8; else capNovo = true; } else if (capIn === 8) capIn = 9; else if (capIn === 9){ if (dep) capIn = 11; else { capIn = 10; capNovo = true; } } else if (capIn >= 10) capIn = 12;
  }
  // v10.8: a história passou de 11 para 12 capítulos; o save da v10.7 (capV 2) que já estava no Fim (cap 12) no Terraço começa o capítulo 12 (o molho da Rosa) com a conversa de antes
  const capRosa = hist && s.capV !== 3 && s.capV !== 4 && s.capV !== 5 && s.capV !== 6 && capIn === 12 && pontoOf(s.salao && s.salao.ponto).id === 'terraco';   // (o save antigo que chegou ao 12 era o Fim)
  if (capRosa) capNovo = true;
  // v10.9: a história passou de 12 para 13 capítulos; o save da v10.8 (capV 3) que já estava no Fim (cap 13) no Terraço começa o capítulo 13 (o crítico sem aviso) com a conversa de antes e o sorteio da 1ª visita
  const capCrit = hist && s.capV !== 4 && s.capV !== 5 && s.capV !== 6 && capIn === 13 && pontoOf(s.salao && s.salao.ponto).id === 'terraco';
  if (capCrit) capNovo = true;
  // v10.10: a história passou de 13 para 14 capítulos; o save da v10.9 (capV 4) que já estava no Fim (cap 14) no Terraço começa o capítulo 14 (a noite da estrela) com a conversa de antes
  const capNoite = hist && s.capV === 4 && capIn === 14 && pontoOf(s.salao && s.salao.ponto).id === 'terraco';
  if (capNoite) capNovo = true;
  const cap = hist ? clamp(capIn, 1, capMax) : novoHist ? 1 : 4;   // v9: dev e testes ficam no cap. 4 (sem objetivo na Garagem; a mudança de ponto está livre)
  const capPonto = HISTORIA[cap - 1], pendente = !!capPonto && capPonto.ponto !== pontoOf(s.salao && s.salao.ponto).id;   // v9, v9.1: o capítulo de um ponto só começa na mudança para ele (o 4 e o 6)
  // v10: o save que já terminou o cap. 8 na parte A (sem o campo v10) começa o 'Do começo ao fim' (v10.5.2: cap. 11, era o 9) com a conversa de antes
  const conversa = cap > HISTORIA.length || pendente ? null : hist ? (s.conversa === 'antes' || s.conversa === 'depois' ? s.conversa : (cap === 11 && s.v10 !== 1 ? 'antes' : null)) : novoHist ? 'antes' : null;
  const conversaF = capNovo && !pendente ? 'antes' : conversa;
  let guia = normGuia(s.guia);   // v10.9: as visitas do crítico (cap. 13); o capítulo sem sorteio (save novo no 13, ou o inválido apagado) sorteia a 1ª visita
  if (hist && cap === CRITICO.cap && !guia && pontoOf(s.salao && s.salao.ponto).id === 'terraco') guia = normGuia({ n:0, prox:dia + randi(CRITICO.primeira[0], CRITICO.primeira[1]), v:[] });   // v10.5.2: o capítulo novo começa com a conversa de antes
  if (hist && cap > CRITICO.cap && !guia && pontoOf(s.salao && s.salao.ponto).id === 'terraco') guia = normGuia({ n:2, prox:0, v:[] });   // v10.10: do capítulo 14 em diante o save.guia sempre existe (a noite da estrela)
  const dev = salaoDevolucao(s.salao), out = { dia, estrelas, lucroTot: Math.round(+s.lucroTot) || 0, pontosTot: Math.max(0, Math.round(+s.pontosTot) || 0), aval: normAval(s.aval), avalCom: capCrit ? plantaBoato(s.avalCom, dia) : normAvalCom(s.avalCom), neg: clamp(Math.round(+s.neg) || 0, 0, BANCO.neg), emp: normEmprestimo(novoHist ? { resto:REFORMA.valor, amort:REFORMA.amort, j:REFORMA.juros, ini:REFORMA.ini, ref:true } : s.emp), corta: s.corta !== false, fechou: Math.max(0, Math.round(+s.fechou) || 0), bank: bank + dev + devMaq, up, torneira:true, salao: normSalao(dev ? null : s.salao), divulga: dia < DIVULGA_DIA && !devLivre() ? 'boca' : divulgaOf(s.divulga).id, treino: !!s.treino, decor: normDecor(s.decor), moveis: normMoveis(s.moveis), cursos: normCursos(s.cursos), cursoDia: Math.max(0, Math.round(+s.cursoDia) || 0), tonXp: s.tonXp === 1 ? 1 : 0, daniTar: Math.max(0, Math.round(+s.daniTar) || 0), daniCursos: normDaniCursos(s.daniCursos), daniCursoDia: Math.max(0, Math.round(+s.daniCursoDia) || 0), jocaTar: Math.max(0, Math.round(+s.jocaTar) || 0), jocaCursos: normJocaCursos(s.jocaCursos), jocaCursoDia: Math.max(0, Math.round(+s.jocaCursoDia) || 0), camiCursos: normCamiCursos(s.camiCursos), camiCursoDia: Math.max(0, Math.round(+s.camiCursoDia) || 0), anselmoCursos: normAnselmoCursos(s.anselmoCursos), anselmoCursoDia: Math.max(0, Math.round(+s.anselmoCursoDia) || 0), daniXp: s.daniXp === 1 ? 1 : 0, cardV: 1, libera: normLibera(s.libera, !novoHist), pontoDia: pontoDiaDe(s, dia), vontDoce: normVont(s.vontDoce), vontCafe: normVont(s.vontCafe), vontDoceV: s.vontDoceV === 1 ? 1 : 0, vontCafeV: s.vontCafeV === 1 ? 1 : 0, convCard: s.convCard === 'pend' ? 'pend' : s.convCard === 1 ? 1 : 0, convDiv: s.convDiv === 'pend' ? 'pend' : s.convDiv === 1 ? 1 : 0, convPlanta: s.convPlanta === 'pend' ? 'pend' : s.convPlanta === 1 || dia > 1 ? 1 : 0, convEnt: s.convEnt === 'pend' ? 'pend' : s.convEnt === 1 ? 1 : 0, socorro: s.socorro === 1 ? 1 : 0, convSocorro: s.convSocorro === 'pend' ? 'pend' : s.convSocorro === 1 ? 1 : 0, exigBravo: Math.max(0, Math.round(+s.exigBravo) || 0), exigVisto: s.exigVisto === 1 ? 1 : 0, convExig: s.convExig === 'pend' ? 'pend' : s.convExig === 1 ? 1 : 0, convCrit: s.convCrit === 'pend' ? 'pend' : s.convCrit === 1 ? 1 : 0, guia, cardVisto: Array.isArray(s.cardVisto) ? s.cardVisto.filter(x => typeof x === 'string').slice(0, 40) : [], avisoCard: !!s.avisoCard, histV: 1, avisoHist: !!s.avisoHist, cap, capDia: capRosa || capCrit || capNoite ? dia : Math.max(1, Math.round(+s.capDia) || 1), capV: 6, capAzul: capNovo ? 0 : Math.max(0, Math.round(+s.capAzul) || 0), capVezes: capNovo ? 0 : Math.max(0, Math.round(+s.capVezes) || 0), convQuit: s.convQuit === 'pend' ? 'pend' : s.convQuit === 1 || cap > 3 ? 1 : 0, convTeto: s.convTeto === 'pend' ? 'pend' : s.convTeto === 1 || cap > 3 ? 1 : 0, capFeito: !capNovo && s.capFeito === 1 ? 1 : 0, capMarm: Math.max(0, Math.round(+s.capMarm) || 0), capComp: Math.max(0, Math.round(+s.capComp) || 0), docesTot: Math.max(0, Math.round(+s.docesTot) || 0), conversa: conversaF, manut: normManut(s.manut), caixa: normCaixa(s.caixa), caixaPend: normPend(s.caixaPend) };
  out.equipe = normEquipe(s.equipe, pontoOf(out.salao.ponto));
  out.v10 = 1;
  out.efoodNota = s.efoodNota === 1 || dia > HIST_ENTREGA.dia ? 1 : 0;   // v9.6.4: o texto do entregador na introdução já saiu (quem passou do dia 4 já viu)
  out.vipVisto = s.vipVisto === 1 || dia > 5 ? 1 : 0;   // v9.6.4: o balão do 1º VIP da carreira
  out.rosa = s.rosa === 1 ? 1 : 0;   // v10.8: aprendeu o molho da Rosa (cap. 12, só no Terraço)
  out.selo = Math.max(0, Math.round(+s.selo) || 0);   // v9.4: o último dia do selo da vigilância (0: sem selo)
  // v10.6: o evento da semana ({ sem, d, ev }: só valores válidos, senão sorteia de novo) e o dia em que a barraca junina foi montada
  { const e = s.evento; if (e && typeof e === 'object' && Number.isInteger(+e.sem) && +e.sem >= 0 && Number.isInteger(+e.d) && +e.d >= EVENTOS.dia && (e.ev === 'junina' || e.ev === 'jogo')) out.evento = { sem:+e.sem, d:+e.d, ev:e.ev };
    const b = Math.round(+s.barraca); if (b >= 1) out.barraca = b; }
  // v9.6.7: o Manual. Save sem `manual` (novo ou antigo): a semente com o que a carreira já viu, sem "novo"
  const manIds = (l, ok) => Array.isArray(l) ? l.filter((x, i) => typeof x === 'string' && MANUAL.some(f => f.id === x) && l.indexOf(x) === i && (!ok || ok.indexOf(x) >= 0)) : null;
  const luxoFicha = l => Array.isArray(l) ? l.map(x => x === 'l-decor' ? 'l-luxo' : x) : l;   // v10.7: a ficha da Decoração virou a do Luxo
  out.manual = Array.isArray(s.manual) ? manIds(luxoFicha(s.manual)) : manualSemente(out);
  out.manualNovo = Array.isArray(s.manual) ? (manIds(luxoFicha(s.manualNovo), out.manual) || []) : [];
  if (!up.tvs) out.equipe.tvs = 0;
  if (out.daniCursos.confCaseira) up.confCaseira = true; else delete up.confCaseira;   // v9.2: a geladeirinha de doces vem do curso da Dani
  if (out.daniCursos.confGourmet && out.daniCursos.confCaseira) up.confGourmet = true; else delete up.confGourmet;   // v9.3: a vitrine gourmet (só com a caseira)
  if (out.daniCursos.confAlta && out.daniCursos.confGourmet && out.daniCursos.confCaseira) up.confAlta = true; else delete up.confAlta;   // v10.2: a alta confeitaria (só com a gourmet)
  if (out.jocaCursos.espresso) up.espresso = true; else delete up.espresso;   // v9.3: a máquina de espresso vem do curso do Joca
  if (out.jocaCursos.cafesEsp && out.jocaCursos.espresso) up.cafesEsp = true; else delete up.cafesEsp;   // v10.3: os cafés especiais (só com o espresso)
  if (out.anselmoCursos.classica) up.coqClassica = true; else delete up.coqClassica;   // v10.3: o Anselmo
  if (out.anselmoCursos.autor) up.coqAutor = true; else delete up.coqAutor;
  if (out.anselmoCursos.autor && pontoOf(s.salao && s.salao.ponto).bebida === 'coquetel') up.maquina = true;   // o carrinho de boas-vindas vem do curso de autor
  // v8.6.4: as notas do Gurugol de antes (de 1 a 5 pelo serviço) passam para a escala da Garagem, uma vez só (avalEsc)
  if (s.avalEsc !== 2){
    const t = AVAL.teto[0], esc = v => v == null ? null : Math.round(avalEscala(v, t) * 10) / 10;
    out.aval = normAval(out.aval.map(r => r.map(esc)));
    out.avalCom.forEach(c => { c.n = Math.round(esc(c.n / 10) * 10); });
    out.caixa.forEach(r => { if (r.av) r.av = Math.round(esc(r.av / 10) * 10); });
  }
  out.avalEsc = 2;
  if (dev){ const last = out.caixa[out.caixa.length - 1]; out.caixa = normCaixa(out.caixa.concat([{ d:last ? last.d : 1, dev, saldo:out.bank - devMaq }])); }
  if (devMaq){ const last = out.caixa[out.caixa.length - 1]; out.caixa = normCaixa(out.caixa.concat([{ d:last ? last.d : 1, dev:devMaq, devK:'maquina', saldo:out.bank }])); }
  return out;
}
function loadSave(){
  const def = normSave({});
  try {
    const s2 = JSON.parse(lsGet(saveKey()) || 'null');
    if (DEV.on) return normSave(s2 || { bank:DEV.bank });
    if (s2 && typeof s2 === 'object'){
      // v8.6.9 / v8.7: save de antes do cardápio que cresce (sem cardV) ou do Modo História (sem histV): a campanha recomeça
      // do dia 1, com um aviso no menu (se já tinha jogado); o ranking, a abertura e a Missão zero ficam
      if (s2.cardV !== 1 || s2.histV !== 1){
        const jogou = saveJogou(s2);
        const n = normSave({ treino: s2.treino });
        n.avisoCard = !!jogou && s2.cardV !== 1;
        n.avisoHist = !!jogou && s2.cardV === 1;
        writeSave(n);
        return n;
      }
      const n = normSave(s2);
      if (s2.tonXp !== 1){   // v8.8: o nível do Tonhão passa a depender da experiência dos cursos: rebaixa uma vez só
        n.equipe.tonhao = Math.min(n.equipe.tonhao, tonhaoNivelXp(n.cursos)); n.tonXp = 1; writeSave(n);
      }
      if (s2.daniXp !== 1){   // v8.9: o nível da Dani também passa a depender da experiência: rebaixa uma vez só
        n.equipe.dani = Math.min(n.equipe.dani, n.equipe.dani ? daniNivelXp(n) : 0); n.daniXp = 1; writeSave(n);
      }
      if ((s2.salao && !Array.isArray(s2.salao.mesas)) || !s2.torneira) writeSave(n);   // salão antigo ou máquina de suco convertidos (com a devolução): só uma vez
      return n;
    }
    // primeira execução da v2: importa o progresso da v1, se existir
    const s1 = JSON.parse(lsGet(LS.v1) || 'null');
    if (s1 && typeof s1 === 'object'){
      const imp = normSave(s1);
      lsSet(LS.save, JSON.stringify(imp));
      return imp;
    }
  } catch(e) {}
  return def;
}
/* o save de mentira da Missão zero (v8.2, `_treino`) nunca vai para o localStorage */
function writeSave(s){ if (s && s._treino) return; lsSet(saveKey(), JSON.stringify(s)); }

/* ============================================================
   MESA
   ============================================================ */
class Table {
  constructor(d){
    this.id = d.id; this.cx = d.cx; this.cy = d.cy; this.seats = d.seats; this.color = d.color; this.toalha = !!d.toalha;
    this.hx = tableHalfW(d);
    this.cami = !!d.cami;   // v9.6: mesa da Cami (modo "Minhas mesas")
    this.open = false; this.group = null; this.dirty = false; this.dirtyN = 0; this.sujaT = 0;   // v10.1: sujaT = há quantos segundos está suja (o VIP exigente repara)
  }
  get free(){ return this.open && !this.group && !this.dirty; }
}

/* ============================================================
   GRUPO DE CLIENTES
   ============================================================ */
const T0 = g => !!g.T.ind;
/* v10.5.3: a chance de um grupo ter vontade de `qual` ('doce' ou 'cafe'): a de pedir com o curso feito, vezes o fator que cresce a cada dia de vontade no ponto (VONTADE); 0 com o curso feito.
   Modo dev "Todos pedem" (DEV.forca.vontade): 1 sem olhar ponto nem dia (ainda 0 com o curso feito e para o entregador) */
function vontadeChance(g, qual, tipo, vip){
  const T = CUSTOMER_TYPES[tipo], up = g.up || {};
  if (g.mode !== 'carreira' || !T || T.retira || (qual === 'doce' ? up.confCaseira : up.espresso)) return 0;
  if (DEV.on && DEV.forca.vontade === 'todos') return 1;
  const dv = vontadeDia(g.save, g.ponto, qual, g.day.n);
  if (!dv) return 0;
  const tab = qual === 'doce' ? DOCES : CAFES, p = (tab.pede[tipo] || 0) + (vip ? tab.vip : 0);
  return Math.min(1, p * Math.min(VONTADE.max, 1 + VONTADE.cresce * (dv - 1)));
}
class Group {
  constructor(game, type, id, color, vip, s){
    const T = CUSTOMER_TYPES[type];
    this.game = game; this.id = id; this.type = type; this.T = T;
    this.cami = false;   // v9.6: a Cami já cuidou de algo deste grupo (a Bia não pega o prato dele)
    this.size = randi(T.size[0], T.size[1]);
    this.color = color;
    this.vip = !!vip && VIP.types.includes(type);
    // v10.9, o crítico do Michelzão: por dentro é VIP exigente, mas `disfarce` tira tudo o que se vê (acessório, plaquinha, marca na fila); o caderninho (`caderno`: segundos que ainda aparece) sai ao sentar e a cada tempo servido (`cadV`)
    this.critico = !!(s && s.critico); this.disfarce = this.critico && !!s.disfarce; this.braulio = !!(s && s.braulio); this.fala = ''; this.falaT = 0;   // v10.10: o Bráulio da noite da estrela e a fala em cima da mesa (balão curto)
    this.caderno = 0; this.cadV = [false, false, false, false]; this.salaoSeg = 0; this.pratoMain = null;
    // v10, a refeição completa: no Terraço (ponto com `tempos`, só na carreira) cada mesa pede bebida, entrada, prato principal e sobremesa;
    // tempo: o que o grupo espera em 'ordered' (0 a entrada, 1 o principal); notaT: a nota de cada tempo (bebida, entrada, principal, sobremesa; null: não serviu);
    // perdTempo: corações perdidos esperando a entrada e o principal; perdBeb: perdidos esperando só a bebida (depois da refeição)
    this.tempos = game.mode === 'carreira' && !!game.ponto.tempos && !T.retira;
    this.tempo = 0; this.notaT = [null, null, null, null]; this.perdTempo = [0, 0]; this.perdBeb = 0; this.entradaDada = false; this.principalDado = false;
    this.juiceWant = this.tempos ? (anselmoOn(game.save.equipe, game.ponto) ? 0 : this.size) : Math.random() < (game.day.juice || 0) ? randi(1, this.size) : 0;   // v10: sem o Anselmo, um suco por pessoa
    this.juiceGot = 0;
    this.sabor = randi(0, SABORES.length - 1);   // v9.1: o sabor da água saborizada (só muda a cor do copo e do balão)
    this.people = makePeople(type, this.size);
    this.exigente = this.vip && game.mode === 'carreira' && (!!game.ponto.exigente || !!(s && s.exig));   // v10.1: o VIP do Terraço é exigente: sem óculos escuros, com chapéu, lenço de seda ou echarpe
    if (this.vip && !this.disfarce) this.people.forEach(p => { if (this.braulio){ p.bigode = true; p.blazer = true; p.gravata = '#F2C23D'; p.paleto = AB_COR.aurora; } else if (this.exigente){ p[pick(EXIGENTE.acc)] = true; p.accC = pick(EXIGENTE.cores); } else p.shades = true; });   // v10.10: o Bráulio: bigode grande e paletó bordô, sem chapéu, lenço nem echarpe
    // a conta (v8.3.8): cada pessoa paga o que pediu, pelo cardápio do ponto: o prato e, às vezes, um 2º item (extras;
    // nunca no treino); o prato especial do VIP soma VIP.dish
    // v8.6.11: ~10% das pessoas são vegetarianas (nunca o entregador, nem na Missão zero) e pedem só prato sem carne
    this.people.forEach(p => { p.veg = !T.retira && game.mode !== 'treino' && Math.random() < VEG.chance; });
    this.dishes = this.people.map(p => this.tempos ? pedePrincipal(type, game, p.veg) : pedePrato(type, game, false, p.veg));   // v10: no Terraço, o principal (PF, PF vegetariano ou parmegiana); v8.6.9: pelo gosto do tipo, entre os pratos que a cozinha sabe
    // v9, a encomenda do setor: `lote` marmitas, cada uma sorteada pelos gostos da turma; entregues: quantas já foram para o balcão
    this.lote = T.lote ? (s && s.lote) || randi(T.lote[0], T.lote[1]) : 0; this.entregues = 0; this.pagoLote = 0;
    if (this.lote) this.dishes = Array.from({ length:this.lote }, () => pedePrato(type, game, false, false));
    this.faltam = this.lote ? this.dishes.slice() : [];   // as marmitas do lote que ainda não chegaram ao balcão
    this.cafePede = !!T.pedeCafe && game.mode === 'carreira' && Math.random() < T.pedeCafe;   // v9: o motorista pede o cafezinho ao terminar de comer
    this.semVeg = this.people.some((p, i) => p.veg && CARDAPIO[this.dishes[i]].carne);   // sem prato vegetariano: Cardápio 1 no Gurugol
    this.dish = this.dishes[0];
    this.carnes = this.people.map(() => pratoAv('pf', game.cursos) ? pick(CARNES) : 'bife');   // v8.6.10: Carnes variadas
    // o entregador (v8.6) não come no salão: leva o prato numa marmita, pela fila de retirada, sem 2º item
    this.retira = !!T.retira;
    // v9.2, doces: o que pediu depois de comer (sorteado no fim da refeição), os já entregues, os corações perdidos esperando e, no entregador, as marmitas "+ doce"
    this.doces = null; this.docesDados = 0; this.perdDoce = 0;
    this.drinks = game.mode === 'carreira' && anselmoOn(game.save.equipe, game.ponto) && !T.retira ? this.sorteiaDrinks() : []; this.drinksDados = 0; this.drinksPedidos = false; this.perdDrink = 0;   // v9.5: os drinks do Anselmo (ids de DRINKS.itens), pedidos ao sentar; pedidos: já foram para a fila dele
    this.vontade = { doce:false, cafe:false }; this.vontadeT = 0; this.vontadeFeita = false;   // v10.5.3: a vontade da freguesia (sorteada no fim da refeição) e os segundos que o balão apagado ainda fica
    this.cafes = null; this.cafesDados = 0;   // v9.3: os cafés da máquina de espresso (ids de CAFES.lista) pedidos no fim da refeição, e os já entregues
    this.docesMarm = this.retira && game.mode === 'carreira' && game.up.confCaseira ? (this.lote ? this.dishes : [0]).filter(() => Math.random() < DOCES.marmita).length : 0; this.docesMarmDados = 0;
    this.extras = this.tempos ? this.people.map(p => pedePrato(type, game, true, p.veg)) : this.people.map((p, i) => !this.retira && game.mode !== 'treino' && Math.random() < (CARDAPIO[this.dishes[i]].cat === 'pf' ? T.mais : Math.max(T.mais, MAIS.salgado)) ? pedePrato(type, game, true, p.veg) : null);
    if (!this.tempos && !this.retira && game.barracaOn){   // v10.6: a barraca junina: quem ficou sem 2º item pede um junino (pede), e quem pediria salgado troca por um (troca)
      const B = EVENTOS.junina.barraca; this.extras = this.extras.map(k => Math.random() < (k ? B.troca : B.pede) ? pick(EVENTOS.junina.pratos) : k);
    }
    this.bill = (this.lote ? [] : this.dishes).concat(this.extras).reduce((v, k) => v + (k ? precoPrato(k, game.ponto, game.cursos) : 0), 0) + (this.vip ? vipDish(this) : 0);
    if (this.tempos && !this.extras.some(Boolean)) this.tempo = 1;   // sem entrada que a cozinha saiba fazer (só vegetarianos sem opção): começa pelo principal
    this.hearts = 5; this.jaVouDito = false; this.bebCobrou = false;   // v9.6.13: jaVouDito = o "Já vou!" já apareceu para este grupo; v10.1: bebCobrou = o exigente já cobrou a bebida
    this.x = DOOR.x; this.y = DOOR.y;
    this.path = []; this.moving = false; this.walkPh = 0;
    this.table = null; this.slot = 0;
    this.timer = 0; this.eatTotal = 1; this.coffee = false;
    this.boing = 0; this.angry = false; this.done = false; this.paid = false;
    this.cmd = -1; this.hold = 0; this.bounced = false;
    this.sucoN = 0; this.sucoConta = 0; this.tabT = 0; this.pediu = false;   // bebida da espera (v7.5): bebidos, na conta, tempo no lugar
    this.bebConta = 0; this.esperaSuco = false;   // v8.5.2: suco e cafezinho da mesa vão para a conta; acabou de comer e espera o suco
    this.state = 'queue'; this.stateT = 0; this.patLeft = 0;
    this.aguarda = false; this.piso = false;   // na fila sem mesa que sirva; segurando no piso de 1 coração
    // avaliação (v8.4): corações perdidos lá fora e na mesa, a nota do prato que comeu, a cor certa e a corrente
    this.perdFila = 0; this.perdMesa = 0; this.pratoQ = 0; this.fria = false; this.corCerta = false; this.corrente = false; this.capricho = false;
    this.setState('queue');
  }
  get vipAberto(){ return this.vip && !this.disfarce; }   // v10.9: o VIP que se vê (o crítico disfarçado não fura a fila nem leva plaquinha)
  patPer(){
    const b = PAT[this.state === 'eating' && this.esperaSuco ? 'ordered' : this.state];
    if (!b) return Infinity;
    let m = b * this.T.pat;
    if (this.vip) m *= VIP.pat;
    if (this.critico) m *= CRITICO.pac;
    if (this.braulio) m *= NOITE.brauPat;   // v10.10
    const g0 = this.game, pt = g0.ponto;
    if (pt.patPressa && this.size <= 2 && !T0(this)) m *= pt.patPressa;   // v9: quem vem sozinho ou em dupla tem pressa (a turma, o motorista e a encomenda, não)
    if (this.state === 'queue' && g0.mode === 'carreira' && g0.up.assento) m /= 1 - assentoSlow(g0.up.assento);   // v9: espera sentado (v9.1: o sofá 25%, a cadeirinha e o banquinho 15%)
    if (this.state === 'queue' && this.sucoN) m /= 1 - MAQUINA.slow * Math.min(1, this.sucoN / this.size);
    const g = this.game, eq = g.save.equipe;
    const amb = ambienteEffect(eq) + g.ambienteEv;   // v10.6: no dia de jogo, a TV ligada acalma a espera
    if (amb && this.state !== 'queue') m /= 1 - amb;
    return m;
  }
  setState(s){
    this.state = s; this.stateT = 0; this.patLeft = this.patPer();
    if (s === 'leaving' && this.braulio && !this.saiu){   // v10.10: o Bráulio sai feliz (4 corações ou mais) ou bravo, com a fala em cima da mesa; o jogo guarda como ele saiu
      this.saiu = true; this.game.brauFeliz = !this.angry && this.hearts >= NOITE.brauFeliz; this.diz(this.game.brauFeliz ? NOITE.falas.feliz : NOITE.falas.bravo);
    }
  }
  diz(t){ this.fala = t; this.falaT = 3.2; }   // v10.10: o balão curto em cima do Bráulio
  /* bebeu n sucos da espera: a paciência que falta no coração encolhe junto com o ritmo */
  drink(n){
    const old = this.patPer();
    this.sucoN += n;
    if (this.state === 'queue') this.patLeft *= this.patPer() / old;
  }
  gain(n){
    const h = this.hearts;
    this.hearts = Math.min(5, this.hearts + n); this.patLeft = this.patPer();
    // avaliação (v8.4): o coração devolvido (sentar, a água, o atendimento) compensa um perdido naquela etapa
    let d = this.hearts - h;
    if (this.state === 'queue' || this.state === 'toTable'){ const k = Math.min(d, this.perdFila); this.perdFila -= k; d -= k; }
    this.perdMesa = Math.max(0, this.perdMesa - d);
  }
  /* v9: o motorista que acabou de comer e ainda não tomou o cafezinho (o balão mostra a xícara) */
  get cafeBalao(){ return this.cafePede && !this.coffee && this.state === 'eating' && this.esperaSuco; }
  /* v9.2: os doces que o grupo pediu e ainda não recebeu; o balão fica sobre a mesa depois da refeição */
  get docesFalta(){ return this.doces ? this.doces.length - this.docesDados : 0; }
  get doceBalao(){ return this.docesFalta > 0 && this.state === 'eating' && this.esperaSuco; }
  sorteiaDoces(){
    const g = this.game;
    if (!g.up.confCaseira || this.retira || g.mode !== 'carreira') return [];
    if (this.tempos) return Array.from({ length:this.size }, () => pick(docesLista(g.up)).id);   // v10: na refeição completa, um doce por pessoa
    const p = (DOCES.pede[this.type] || 0) + (this.vip ? DOCES.vip : 0);
    return Math.random() < p ? Array.from({ length:randi(1, this.size) }, () => pick(docesLista(g.up)).id) : [];
  }
  /* v9.5: os drinks que o grupo pediu e ainda não recebeu; só vale depois que a Bia anotou (eles vão para a fila do Anselmo) */
  get drinksFalta(){ return this.drinksPedidos ? this.drinks.length - this.drinksDados : 0; }
  get drinkOpen(){ return this.drinksFalta > 0 && (this.state === 'ordered' || this.state === 'eating' || this.state === 'wantBill'); }
  sorteiaDrinks(){
    if (this.tempos) return Array.from({ length:this.size }, () => pick(drinksLista(this.game.up)).id);   // v10: um drink por pessoa
    const p = (DRINKS.pede[this.type] || 0) + (this.vip ? DRINKS.vip : 0);
    return Math.random() < p ? Array.from({ length:randi(1, this.size) }, () => pick(drinksLista(this.game.up)).id) : [];
  }
  /* v9.3: os cafés (espresso ou cappuccino) que o grupo pediu e ainda não recebeu */
  get cafesFalta(){ return this.cafes ? this.cafes.length - this.cafesDados : 0; }
  get cafeEspBalao(){ return this.cafesFalta > 0 && this.state === 'eating' && this.esperaSuco; }
  sorteiaCafes(){
    const g = this.game;
    if (!g.up.espresso || this.retira || g.mode !== 'carreira') return [];
    const p = (CAFES.pede[this.type] || 0) + (this.vip ? CAFES.vip : 0);
    return Math.random() < p ? Array.from({ length:randi(1, this.size) }, () => pick(cafesLista(g.up)).id) : [];
  }
  /* v10.5.3: a vontade de doce e de espresso (a casa ainda não tem o curso): sorteada com a chance de vontadeChance; na refeição completa não há vontade de doce */
  sorteiaVontade(){
    const g = this.game, v = { doce:false, cafe:false };
    if (this.retira || g.mode !== 'carreira') return v;
    if (!this.tempos) v.doce = Math.random() < vontadeChance(g, 'doce', this.type, this.vip);
    v.cafe = Math.random() < vontadeChance(g, 'cafe', this.type, this.vip);
    return v;
  }
  /* o ícone apagado que a mesa mostra agora ('doce' ou 'cafe'; com os dois, um depois do outro) ou null */
  get vontadeBalao(){
    if (!(this.vontadeT > 0)) return null;
    const l = [this.vontade.doce ? 'doce' : null, this.vontade.cafe ? 'cafe' : null].filter(Boolean);
    return l.length ? l[Math.min(l.length - 1, Math.floor((VONTADE.balao - this.vontadeT) / (VONTADE.balao / l.length)))] : null;
  }
  get juicePending(){ return Math.max(0, this.juiceWant - this.juiceGot); }
  /* v10, a refeição completa: o prato do tempo da vez (o balão e a mão) e a bebida que ainda falta (drinks ou sucos); a bebida entregue vira nota */
  get pratoVez(){ return this.tempos && this.tempo === 0 ? (this.extras.find(Boolean) || this.dish) : this.dish; }
  get bebFalta(){ return this.drinksFalta + this.juicePending; }
  notaBeb(){
    if (!this.tempos || this.notaT[0] != null || this.bebFalta > 0 || !(this.drinks.length || this.juiceWant)) return;
    this.notaT[0] = clamp(5 - this.perdBeb - (this.principalDado ? 1 : 0), 1, 5);   // 1 por coração perdido só esperando a bebida e 1 se ela veio depois do principal
  }
  notaPrato(tempo, q){   // a nota do prato do tempo (0 entrada, 1 principal): a do prato (já com o frio) menos TEMPOS.porCoracao por coração perdido esperando
    this.notaT[tempo + 1] = clamp(Math.round(((q || 1) - TEMPOS.porCoracao * this.perdTempo[tempo]) * 10) / 10, 1, 5);
  }
  /* a nota da comida no Gurugol: a média das notas dos tempos servidos (null se nada foi servido) */
  get notaComida(){ const v = this.notaT.filter(x => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }
  get completa(){ return this.tempos && this.notaT.every(x => x != null); }
  /* o pedido de suco aparece quando a comanda é anotada; sem ele, o grupo não pede a conta (v8.5.2) */
  get juiceOpen(){ return this.juiceWant > 0 && (this.state === 'ordered' || this.state === 'eating' || this.state === 'wantBill'); }
  get seated(){ return this.state==='reading' || this.state==='wantOrder' || this.state==='ordered' || this.state==='eating' || this.state==='wantBill'; }
  get mood(){ return this.angry ? 2 : (this.hearts >= 4 ? 0 : (this.hearts >= 2 ? 1 : 2)); }  // 0 feliz, 1 neutro, 2 bravo
  moveAlong(dt, sp){
    this.moving = false;
    let rem = sp * dt;
    while (this.path.length && rem > 0){
      const p = this.path[0], dx = p.x - this.x, dy = p.y - this.y, d = Math.hypot(dx,dy);
      if (d < 0.5) { this.path.shift(); continue; }
      const st = Math.min(d, rem);
      this.x += dx/d*st; this.y += dy/d*st; rem -= st; this.moving = true;
      if (st >= d) this.path.shift();
    }
    if (this.moving) this.walkPh += dt * 11;
  }
  /* na fila: há mesa (aberta e sem grupo, mesmo suja) onde o grupo cabe? */
  get semMesa(){ return !this.game.tables.some(t => t.open && !t.group && t.seats >= this.size); }
  /* v9.6.13, "Já vou!": o jogador já está indo atender este grupo? Na fila, só se estiver arrastando o grupo (a seleção por toque não conta);
     na mesa, se a tarefa DA VEZ da Bia é para ele (a mesa dele, com algo a fazer ali, ou o prato dele no balcão). Só vale para segurar o ÚLTIMO
     coração. Com o prato dele na mão e outra tarefa na frente, não vale: medido em 10/11, essa folga a mais levava o balance sem equipe de ~72% para ~79% */
  get jaVem(){
    const g = this.game;
    if (this.state === 'queue') return !!(g.drag && g.drag.g === this);
    const t = this.table, b = g.bia;
    if (!t) return false;
    const a = b.acts[0];
    if (!a) return false;
    if (a.type === 'plate'){ const ac = g.kitchen.achaPronto(a.pid); return !!(ac && ac.p.group === this); }
    if (a.type === 'table' && a.id === t.id){
      if (this.state === 'wantOrder' || this.state === 'wantBill') return true;
      return b.hands.some(h => h.kind !== 'ticket' && h.kind !== 'dirty' && (h.group === this || (h.kind === 'juice' && this.juiceOpen && this.juicePending > 0)));
    }
    return false;
  }
  /* paciência na fila (v7.1): sem mesa que sirva, corre no ritmo da fila justa e, na carreira,
     para no piso (1 coração, com metade da paciência dele) até abrir uma mesa */
  tickQueue(dt){
    this.aguarda = this.semMesa; this.piso = false;
    if (!this.aguarda) return this.tick(dt);
    const d = dt * FILA_JUSTA.ritmo;
    if (this.hearts <= 1 && this.game.mode !== 'semfim'){
      const floor = Math.min(this.patLeft, this.patPer() * FILA_JUSTA.piso);
      if (this.patLeft - d <= floor){ this.patLeft = floor; this.piso = true; return; }
    }
    this.tick(d);
  }
  tick(dt){
    if (this.game.mode === 'treino') return;   // na Missão zero, a paciência não acaba
    this.patLeft -= dt;
    if (this.game.trashFull && this.game.fumacaAlcanca(this.x, this.y)) this.patLeft -= dt * TRASH.smell;   // v9.6.11: o cheiro (paciência ÷ 1,3) só vale para quem a fumaça alcança
    if (this.patLeft <= 0){
      if (this.hearts <= 1 && this.jaVem){   // v9.6.13: o último coração não cai com a Bia a caminho
        this.patLeft = 0;
        if (!this.jaVouDito){ this.jaVouDito = true; if (this.state !== 'queue') this.game.addText(this.game.bia.x, this.game.bia.y - 82, 'Já vou!', PAL.faixa, 15); }
        return;
      }
      this.hearts--;
      if (this.state === 'queue') this.perdFila++; else { this.perdMesa++; if (this.tempos){ if (this.state === 'ordered') this.perdTempo[this.tempo]++; else if (this.esperaSuco && this.bebFalta > 0) this.perdBeb++; } if (this.esperaSuco && (this.docesFalta > 0 || this.cafesFalta > 0)) this.perdDoce++; if (this.drinksFalta > 0) this.perdDrink++; }
      if (this.hearts <= 0) this.game.angryLeave(this);
      else this.patLeft += this.patPer();
    }
  }
  update(dt){
    this.stateT += dt;
    if (this.critico){   // v10.9: o caderninho aparece CRITICO.caderno s depois de sentar e de cada tempo servido (bebida, entrada, prato, sobremesa)
      if (this.caderno > 0) this.caderno = Math.max(0, this.caderno - dt);
      for (let i = 0; i < 4; i++) if (this.notaT[i] != null && !this.cadV[i]){ this.cadV[i] = true; this.caderno = CRITICO.caderno; }
    }
    if (this.falaT > 0) this.falaT = Math.max(0, this.falaT - dt);   // v10.10: a fala do Bráulio
    if (this.vontadeT > 0) this.vontadeT = Math.max(0, this.vontadeT - dt);   // v10.5.3
    if (this.boing > 0) this.boing -= dt;
    switch (this.state){
      case 'queue':
        this.moveAlong(dt, 220);
        // no lugar lá fora, depois de `pede` s, pede 1 copo por pessoa (com a melhoria): na Garagem, água no balão
        if (!this.pediu && !this.path.length && this.game.maquinaOn){
          this.tabT += dt;
          if (this.tabT >= MAQUINA.pede){ this.pediu = true; this.game.maqPedir(this, this.size); }
        }
        this.tickQueue(dt); break;
      case 'toTable':
        this.moveAlong(dt, 230);
        if (!this.path.length){
          const t = this.table;
          this.x = t.cx; this.y = t.cy + 30; this.moving = false;
          this.setState('reading');
          if (this.critico) this.caderno = CRITICO.caderno;   // v10.9: logo depois de sentar
          if (this.braulio) this.diz(NOITE.falas.senta);   // v10.10
          this.timer = rand(this.T.read[0], this.T.read[1]);
        }
        break;
      case 'reading':
        if (this.game.treinoSegura) break;
        this.timer -= dt;
        if (this.timer <= 0) { this.setState('wantOrder'); Sfx.blip(); }
        break;
      case 'wantOrder': case 'ordered': case 'wantBill':
        this.tick(dt); break;
      case 'retirada':   // v8.6: no balcão de retirada, esperando a marmita
        this.moveAlong(dt, 220);
        if (!this.path.length && this.game.pegaPrateleira(this)) break;
        this.tick(dt); break;
      case 'eating':
        if (this.game.treinoSegura) break;   // na Missão zero, a refeição espera o cafezinho
        this.timer -= dt;
        if (this.timer > 0) break;
        if (this.tempos && this.tempo === 0){ this.tempo = 1; this.setState('ordered'); break; }   // v10: acabou a entrada: espera o principal (a cozinha já o recebeu)
        // acabou de comer: quem pediu suco espera por ele (perdendo a paciência) antes de pedir a conta (v8.5.2)
        if (!this.doces) this.doces = this.sorteiaDoces();   // v9.2
        if (!this.cafes) this.cafes = this.sorteiaCafes();   // v9.3
        if (!this.vontadeFeita){ this.vontadeFeita = true; this.vontade = this.sorteiaVontade(); if (this.vontade.doce || this.vontade.cafe) this.vontadeT = VONTADE.balao; }   // v10.5.3
        if (this.juicePending > 0 || (this.cafePede && !this.coffee) || this.docesFalta > 0 || this.cafesFalta > 0 || this.drinksFalta > 0){
          if (!this.esperaSuco){ this.esperaSuco = true; this.patLeft = this.patPer(); }
          this.tick(dt); break;
        }
        this.esperaSuco = false; this.setState('wantBill'); Sfx.blip();
        break;
      case 'leaving':
        if (this.hold > 0){ this.hold -= dt; break; }
        this.moveAlong(dt, this.angry ? 260 : 170);
        if (!this.path.length) this.done = true;
        break;
    }
  }
}

/* v10, a trilha dos tempos (a refeição completa): o estado das 4 marcas sob os corações da mesa (bebida, entrada, principal, sobremesa), sem texto.
   est: 'pendente' (contorno cinza), 'vez' (o que o grupo espera agora: pulsa), 'servida' (cheia: cor pela nota, ok 4 ou mais, alerta 2,5 ou mais, perigo) ou
   'nao' (a casa não serve: um tracinho). Pura: o desenho e o smoke usam. null para o grupo sem `tempos` */
function tempoMarcas(grp){
  if (!grp || !grp.tempos) return null;
  const up = grp.game.up, pedido = grp.state !== 'reading' && grp.state !== 'wantOrder' && grp.state !== 'queue' && grp.state !== 'toTable', ord = grp.state === 'ordered';
  const cor = v => v >= 4 ? 'ok' : v >= 2.5 ? 'alerta' : 'perigo';
  const mk = (id, nao, vez) => { const i = ['beb', 'entrada', 'principal', 'sobremesa'].indexOf(id), v = grp.notaT[i];
    return v != null ? { id, est:'servida', cor:cor(v), nota:v } : nao ? { id, est:'nao', cor:'', nota:null } : { id, est:vez ? 'vez' : 'pendente', cor:'', nota:null }; };
  return [
    mk('beb', !(grp.drinks.length || grp.juiceWant), pedido && grp.bebFalta > 0),
    mk('entrada', !grp.extras.some(Boolean), ord && grp.tempo === 0),
    mk('principal', false, ord && grp.tempo === 1),
    mk('sobremesa', !up.confCaseira, !!grp.doces && grp.docesFalta > 0 && grp.esperaSuco)
  ];
}
