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
const STATION_KEYS = ['order','plates','coffee','juice','sink','trash','agua'];
function tableRect(t){ return { x:t.cx - t.hx - 10, y:t.cy - 62, w:t.hx*2 + 20, h:132 }; }
function queueRect(g){ return { x:4, y:QUEUE.ys[g.slot] - 76, w:148, h:90 }; }
function rectDist(x, y, r){ return Math.hypot(Math.max(r.x - x, 0, x - r.x - r.w), Math.max(r.y - y, 0, y - r.y - r.h)); }
function tableApproach(t){
  const hx = tableHalfW(t) + 28;
  return [ {x:t.cx-hx, y:t.cy+4}, {x:t.cx+hx, y:t.cy+4} ];
}
/* ---------- armazenamento (localStorage com try/catch e cópia em memória) ---------- */
const LS = { save:'lcc2_save', v1:'lcc_save_v1', rank:'lcc2_ranking', name:'lcc2_name' };
const MEM = {};
function lsGet(k){
  try { const v = localStorage.getItem(k); if (v != null) return v; } catch(e) {}
  return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null;
}
function lsSet(k, v){
  MEM[k] = v;
  try { localStorage.setItem(k, v); } catch(e) {}
}
function normEquipe(e){
  e = (e && typeof e === 'object') ? e : {};
  const tasks = Array.isArray(e.daniTasks) ? e.daniTasks.filter(t => DANI_TASKS.some(d => d.id === t)) : ['pratos','lavar'];
  return { tonhao: clamp(Math.round(+e.tonhao)||0,0,2), dani: clamp(Math.round(+e.dani)||0,0,3), daniTasks: tasks.filter((t,i) => tasks.indexOf(t) === i).slice(0,3), couvert: !!e.couvert, taxa: !!e.taxa };
}
function normSave(s){
  const up = (s.up && typeof s.up === 'object') ? s.up : {};
  if (up.jukebox){ up.agua = true; delete up.jukebox; }   // a Jukebox virou Água saborizada na v5
  if (up.chapa){ up.pratos = true; delete up.chapa; }     // a Chapa nova virou Jogo de pratos (a velocidade da cozinha é do Tonhão)
  return { maxDay: clamp(+s.maxDay||1,1,7), bank: Math.max(0,+s.bank||0), up, best: (s.best && typeof s.best === 'object') ? s.best : {}, stars: (s.stars && typeof s.stars === 'object') ? s.stars : {}, equipe: normEquipe(s.equipe), salao: normSalao(s.salao), divulga: divulgaOf(s.divulga).id };
}
function loadSave(){
  const def = normSave({});
  try {
    const s2 = JSON.parse(lsGet(LS.save) || 'null');
    if (s2 && typeof s2 === 'object') return normSave(s2);
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
function writeSave(s){ lsSet(LS.save, JSON.stringify(s)); }

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
    this.dishes = this.people.map(() => pick(DISHES));
    this.dish = this.dishes[0];
    this.bill = randi(T.bill[0], T.bill[1]) + (this.vip ? VIP.dish : 0);
    this.hearts = 5;
    this.x = DOOR.x; this.y = DOOR.y;
    this.path = []; this.moving = false; this.walkPh = 0;
    this.table = null; this.slot = 0;
    this.timer = 0; this.eatTotal = 1; this.coffee = false;
    this.boing = 0; this.angry = false; this.done = false; this.paid = false;
    this.cmd = -1; this.hold = 0; this.bounced = false;
    this.aguaN = 0; this.drank = false;
    this.state = 'queue'; this.stateT = 0; this.patLeft = 0;
    this.setState('queue');
  }
  patPer(){
    const b = PAT[this.state];
    if (!b) return Infinity;
    let m = b * this.T.pat;
    if (this.vip) m *= VIP.pat;
    if (this.state === 'queue' && this.aguaN) m /= 1 - AGUA.slow * this.aguaN / this.size;
    const g = this.game, eq = g.save.equipe;
    if (eq.couvert && this.state !== 'queue') m /= 1 - couvertEffect(eq);
    if (g.trashFull && !g.up.ventilador) m /= 1 + TRASH.smell;
    return m;
  }
  setState(s){ this.state = s; this.stateT = 0; this.patLeft = this.patPer(); }
  /* ao chegar na fila, cada pessoa toma 1 dose de água, se houver */
  drink(){
    const g = this.game;
    this.drank = true;
    if (!g.up.agua) return;
    const n = Math.min(this.size, g.agua);
    if (n <= 0) return;
    const old = this.patPer();
    g.agua -= n; this.aguaN = n;
    this.patLeft *= this.patPer() / old;
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
  tick(dt){
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
        if (!this.drank && !this.path.length) this.drink();
        this.tick(dt); break;
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
        this.timer -= dt;
        if (this.timer <= 0) { this.setState('wantOrder'); Sfx.blip(); }
        break;
      case 'wantOrder': case 'ordered': case 'wantBill':
        this.tick(dt); break;
      case 'eating':
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

