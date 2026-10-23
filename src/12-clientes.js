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
const STATION_KEYS = ['order','plates','coffee','juice','sink','trash','maquina'];
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
const LS = { save:'lcc2_save', v1:'lcc_save_v1', rank:'lcc2_ranking', name:'lcc2_name', dev:'lcc2_dev', devSave:'lcc2_save_dev' };
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
const DEV = { on: lsGet(LS.dev) === '1', bank: 10000, toques: 10 };
function saveKey(){ return DEV.on ? LS.devSave : LS.save; }
/* o couvert só vale do nível 3 do salão em diante: num ponto abaixo, sai */
function normEquipe(e, ponto){
  e = (e && typeof e === 'object') ? e : {};
  const tasks = Array.isArray(e.daniTasks) ? e.daniTasks.map(t => t === 'agua' ? 'suco' : t).filter(t => DANI_TASKS.some(d => d.id === t)) : ['pratos','lavar'];   // v7.5: a tarefa da água vira a do suco da espera
  return { tonhao: clamp(Math.round(+e.tonhao)||0,0,2), dani: clamp(Math.round(+e.dani)||0,0,3), daniTasks: tasks.filter((t,i) => tasks.indexOf(t) === i).slice(0,3), couvert: !!e.couvert && couvertOk(ponto), taxa: !!e.taxa, tv: !!e.tv, som: !!e.som };
}
/* livro-caixa (v7.2): uma linha por dia jogado na carreira (os últimos CAIXA_MAX). As compras da lojinha
   (melhorias e salão) ficam em caixaPend e entram na linha do dia seguinte, junto com o saldo ao fim dele.
   v8.3: st (estrelas do dia), emp (empréstimo recebido; forc: à força) e par (parcelas pagas ao banco); v8.3.1: atr e tom */
function normCaixa(c){
  const n = v => Math.round(+v) || 0;
  return (Array.isArray(c) ? c : []).filter(r => r && typeof r === 'object' && +r.d >= 1).slice(-CAIXA_MAX)
    .map(r => {
      const o = { d:Math.max(1, n(r.d)), fat:n(r.fat), ingr:n(r.ingr), contas:n(r.contas), folha:n(r.folha), div:n(r.div), lucro:n(r.lucro), meta:n(r.meta), ok:!!r.ok, perd:n(r.perd), mel:n(r.mel), sal:n(r.sal), man:n(r.man), saldo:n(r.saldo) };
      if (n(r.dev)) o.dev = n(r.dev);   // linha "Devolução do salão" (v7.4): o que o salão antigo custou, de volta
      if (o.dev && r.devK === 'maquina') o.devK = 'maquina';   // ou a da máquina de suco, que virou torneira (v7.7)
      if (n(r.int)){ o.int = n(r.int); o.mul = n(r.mul); }   // dia encerrado no meio (v8.2.3): grupos que saíram bravos e a multa
      if (n(r.st)) o.st = clamp(n(r.st), 0, 3);
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
function normSave(s){
  const up = (s.up && typeof s.up === 'object') ? s.up : {};
  if (up.jukebox){ up.agua = true; delete up.jukebox; }   // a Jukebox virou Água saborizada na v5
  if (up.agua){ up.maquina = true; delete up.agua; }      // e a Água saborizada virou a Máquina de suco na v7.5
  // a Máquina de suco virou a Água da torneira na v7.7 (mais barata): quem já tinha recebe a diferença, uma vez
  const devMaq = up.maquina && !s.torneira ? UPGRADES.find(u => u.id === 'maquina').devolve : 0;
  if (up.chapa){ up.pratos = true; delete up.chapa; }     // a Chapa nova virou Jogo de pratos (a velocidade da cozinha é do Tonhão)
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
  const dev = salaoDevolucao(s.salao), out = { dia, estrelas, lucroTot: Math.round(+s.lucroTot) || 0, pontosTot: Math.max(0, Math.round(+s.pontosTot) || 0), neg: clamp(Math.round(+s.neg) || 0, 0, BANCO.neg), emp: normEmprestimo(s.emp), corta: s.corta !== false, fechou: Math.max(0, Math.round(+s.fechou) || 0), bank: bank + dev + devMaq, up, torneira:true, salao: normSalao(dev ? null : s.salao), divulga: divulgaOf(s.divulga).id, treino: !!s.treino, manut: normManut(s.manut), caixa: normCaixa(s.caixa), caixaPend: normPend(s.caixaPend) };
  out.equipe = normEquipe(s.equipe, pontoOf(out.salao.ponto));
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
      const n = normSave(s2);
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
    this.id = d.id; this.cx = d.cx; this.cy = d.cy; this.seats = d.seats; this.color = d.color;
    this.hx = tableHalfW(d);
    this.open = false; this.group = null; this.dirty = false; this.dirtyN = 0;
  }
  get free(){ return this.open && !this.group && !this.dirty; }
}

/* ============================================================
   GRUPO DE CLIENTES
   ============================================================ */
class Group {
  constructor(game, type, id, color, vip){
    const T = CUSTOMER_TYPES[type];
    this.game = game; this.id = id; this.type = type; this.T = T;
    this.size = randi(T.size[0], T.size[1]);
    this.color = color;
    this.vip = !!vip && VIP.types.includes(type);
    this.juiceWant = Math.random() < (game.day.juice || 0) ? randi(1, this.size) : 0;
    this.juiceGot = 0;
    this.people = makePeople(type, this.size);
    if (this.vip) this.people.forEach(p => { p.shades = true; });
    // a conta (v8.3.8): cada pessoa paga o que pediu, pelo cardápio do ponto: o prato e, às vezes, um 2º item (extras;
    // nunca no treino); o prato especial do VIP soma VIP.dish
    this.dishes = this.people.map(() => pick(T.prefere));
    this.dish = this.dishes[0];
    this.extras = this.people.map(() => game.mode !== 'treino' && Math.random() < T.mais ? pick(MAIS.pratos) : null);
    this.bill = this.dishes.concat(this.extras).reduce((v, k) => v + (k ? precoPrato(k, game.ponto) : 0), 0) + (this.vip ? VIP.dish : 0);
    this.hearts = 5;
    this.x = DOOR.x; this.y = DOOR.y;
    this.path = []; this.moving = false; this.walkPh = 0;
    this.table = null; this.slot = 0;
    this.timer = 0; this.eatTotal = 1; this.coffee = false;
    this.boing = 0; this.angry = false; this.done = false; this.paid = false;
    this.cmd = -1; this.hold = 0; this.bounced = false;
    this.sucoN = 0; this.sucoConta = 0; this.tabT = 0; this.pediu = false;   // bebida da espera (v7.5): bebidos, na conta, tempo no lugar
    this.state = 'queue'; this.stateT = 0; this.patLeft = 0;
    this.aguarda = false; this.piso = false;   // na fila sem mesa que sirva; segurando no piso de 1 coração
    this.setState('queue');
  }
  patPer(){
    const b = PAT[this.state];
    if (!b) return Infinity;
    let m = b * this.T.pat;
    if (this.vip) m *= VIP.pat;
    if (this.state === 'queue' && this.sucoN) m /= 1 - MAQUINA.slow * Math.min(1, this.sucoN / this.size);
    const g = this.game, eq = g.save.equipe;
    const amb = ambienteEffect(eq);
    if (amb && this.state !== 'queue') m /= 1 - amb;
    if (g.trashFull && !g.up.ventilador) m /= 1 + TRASH.smell;
    return m;
  }
  setState(s){ this.state = s; this.stateT = 0; this.patLeft = this.patPer(); }
  /* bebeu n sucos da espera: a paciência que falta no coração encolhe junto com o ritmo */
  drink(n){
    const old = this.patPer();
    this.sucoN += n;
    if (this.state === 'queue') this.patLeft *= this.patPer() / old;
  }
  gain(n){ this.hearts = Math.min(5, this.hearts + n); this.patLeft = this.patPer(); }
  get juicePending(){ return Math.max(0, this.juiceWant - this.juiceGot); }
  /* o pedido de suco aparece quando a comanda é anotada e vale até a conta */
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
    if (this.patLeft <= 0){
      this.hearts--;
      if (this.hearts <= 0) this.game.angryLeave(this);
      else this.patLeft += this.patPer();
    }
  }
  update(dt){
    this.stateT += dt;
    if (this.boing > 0) this.boing -= dt;
    switch (this.state){
      case 'queue':
        this.moveAlong(dt, 220);
        // no lugar lá fora, depois de `pede` s, pede 1 copo por pessoa (com a melhoria): na Garagem, água no balão
        if (!this.pediu && !this.path.length && this.game.up.maquina){
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
      case 'eating':
        if (this.game.treinoSegura) break;   // na Missão zero, a refeição espera o cafezinho
        this.timer -= dt;
        if (this.timer <= 0) { this.setState('wantBill'); Sfx.blip(); }
        break;
      case 'leaving':
        if (this.hold > 0){ this.hold -= dt; break; }
        this.moveAlong(dt, this.angry ? 260 : 170);
        if (!this.path.length) this.done = true;
        break;
    }
  }
}

