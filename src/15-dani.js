/* ============================================================
   DANI (contratada): age sozinha, só nas tarefas escolhidas na lojinha
   (tirar o lixo, retirar pratos sujos, lavar a louça, servir cafezinho, levar o suco da espera).
   Anda mais devagar que a Bia (50%, 65% ou 80% conforme o nível) e
   leva 1 item em cada mão.
   ============================================================ */
const DANI_HOME = { x:700, y:470 };
const DANI_HANDS = 2;   // 2 mãos: no máximo 2 itens por vez (cada pilha de louça, a de uma mesa, ocupa 1 mão)
class Helper {
  constructor(g){ this.g = g; this.reset(); }
  reset(){
    this.x = DANI_HOME.x; this.y = DANI_HOME.y; this.dir = -1;
    this.hands = []; this.plan = null; this.path = []; this.phase = 'idle'; this.timer = 0;
    this.walkPh = 0; this.moving = false; this.thinkT = 0;
  }
  get level(){ return this.g.save.equipe.dani; }
  get active(){ return this.level > 0; }
  get spec(){ return STAFF.dani.levels[this.level]; }
  get speed(){ return 260 * this.spec.speed; }
  get tasks(){ return this.active ? this.g.save.equipe.daniTasks.filter(t => daniTaskOk(t, this.g.up)).slice(0, this.spec.tasks) : []; }
  does(t){ return this.tasks.indexOf(t) >= 0; }
  /* lavando na pia agora (a Bia não lava junto) */
  get washing(){ return !!(this.phase === 'do' && this.plan && this.plan.type === 'sink' && this.plan.wash); }
  /* pode lavar: tem a tarefa e a Bia não está lavando */
  canWash(){ return this.does('lavar') && !this.g.bia.washing; }
  /* mesa já na fila de ações da Bia: a Dani não mexe */
  biaWants(t){ return this.g.bia.acts.some(a => a.type === 'table' && a.id === t.id); }
  /* mesa para onde a Dani está indo (a Bia e o bot evitam) */
  targets(t){ return !!(this.plan && this.plan.t === t); }
  go(pt, step){ this.plan = step; this.path = findPath({ x:this.x, y:this.y }, pt); this.phase = 'walk'; }
  nearestAp(t){ const p = tableApproach(t); return Math.hypot(p[0].x-this.x,p[0].y-this.y) <= Math.hypot(p[1].x-this.x,p[1].y-this.y) ? p[0] : p[1]; }
  coffeeTarget(){
    if (this.g.quebrado('cafeteira')) return null;   // cafeteira parada (v8)
    const c = this.g.tables.filter(t => t.group && t.group.seated && !t.group.coffee && t.group.hearts <= 4 && !t.group.daniCoffee && !this.biaWants(t));
    c.sort((a,b) => a.group.hearts - b.group.hearts);
    return c[0] || null;
  }
  think(){
    const g = this.g, k = g.kitchen;
    const dirty = this.hands.filter(h => h.kind === 'dirty').length;
    const coffee = this.hands.find(h => h.kind === 'coffee');
    // suco da espera na mão: leva a quem pediu (lá fora ou, se já sentou, na mesa)
    const suco = this.hands.find(h => h.kind === 'suco');
    if (suco){
      const ap = g.sucoAp(suco.group, this);
      if (ap) return this.go(ap, { type:'suco', grp:suco.group });
      this.hands = this.hands.filter(h => h.kind !== 'suco');
    }
    // entrega o café (com louça e café nas mãos, primeiro deixa a louça na pia, logo abaixo da cafeteira)
    if (coffee && !dirty){
      const t = (coffee.table && coffee.table.group === coffee.group && coffee.group && coffee.group.seated && !coffee.group.coffee) ? coffee.table : this.coffeeTarget();
      if (t){ coffee.table = t; coffee.group = t.group; t.group.daniCoffee = true; return this.go(this.nearestAp(t), { type:'serve', t }); }
    }
    // já na pia: continua lavando até acabar a louça
    const ap = STATIONS.sink.ap;
    if (this.canWash() && k.sinkN > 0 && !dirty && !coffee && Math.hypot(this.x - ap.x, this.y - ap.y) < 4) return this.go(ap, { type:'sink' });
    if (this.does('pratos') && this.hands.length < DANI_HANDS){
      const c = g.tables.filter(t => t.open && t.dirty && !this.biaWants(t));
      c.sort((a,b) => Math.hypot(a.cx-this.x,a.cy-this.y) - Math.hypot(b.cx-this.x,b.cy-this.y));
      if (c.length){ return this.go(this.nearestAp(c[0]), { type:'clear', t:c[0] }); }
    }
    // com 1 pilha na mão, pega o cafezinho no caminho da pia (a 2ª mão)
    if (dirty && !coffee && this.does('cafe') && this.hands.length < DANI_HANDS && this.coffeeTarget()) return this.go(STATIONS.coffee.ap, { type:'coffee' });
    if (dirty) return this.go(STATIONS.sink.ap, { type:'sink' });
    if (this.canWash() && k.sinkN > 0 && !coffee) return this.go(STATIONS.sink.ap, { type:'sink' });
    if (this.does('lixo') && g.trash >= TRASH.cap - 2 && !this.hands.length) return this.go(STATIONS.trash.ap, { type:'trash' });
    if (this.does('cafe') && !coffee && this.hands.length < DANI_HANDS && this.coffeeTarget()) return this.go(STATIONS.coffee.ap, { type:'coffee' });
    if (this.does('suco') && !this.hands.length){ const o = g.maqLivre(); if (o){ o.dani = true; return this.go(STATIONS.maquina.ap, { type:'maquina', o }); } }
    if (Math.hypot(this.x - DANI_HOME.x, this.y - DANI_HOME.y) > 4) return this.go(DANI_HOME, null);
  }
  duration(st){
    // lava 1 pilha por vez, no mesmo ritmo do deslocamento (50% da Bia leva o dobro do tempo por pilha);
    // não há limite de pilhas: só o tempo de lavar. Se a Bia está lavando, a Dani só deixa a louça
    if (st.type === 'sink'){
      const drop = this.hands.some(h => h.kind === 'dirty');
      st.wash = this.canWash() && !this.hands.some(h => h.kind === 'coffee') && (drop || this.g.kitchen.sinkN > 0);
      return (drop ? WASH.base : 0) + (st.wash ? WASH.perPile / this.spec.speed : 0);
    }
    if (st.type === 'trash') return TRASH.empty;
    if (st.type === 'maquina') return this.g.bebida.take;
    return 0.35;
  }
  perform(st){
    const g = this.g;
    if (st.type === 'clear'){
      const t = st.t;
      if (!t.dirty || this.hands.length >= DANI_HANDS) return;
      this.hands.push({ kind:'dirty', n:t.dirtyN }); t.dirty = false; t.dirtyN = 0;
      g.pontos += PONTOS_ACAO.clear; g.addText(t.cx, t.cy - 20, '+' + PONTOS_ACAO.clear + ' pts', PAL.faixa, 15); Sfx.blip();   // v8.3.8: pontos, não dinheiro
    } else if (st.type === 'sink'){
      const n = this.hands.filter(h => h.kind === 'dirty').length;
      this.hands = this.hands.filter(h => h.kind !== 'dirty');
      g.kitchen.sinkN += n;
      if (st.wash && g.washPiles(1)){ g.addText(this.x, this.y - 82, 'Dani lavou!', PAL.faixa, 14); Sfx.wash(); }
    } else if (st.type === 'trash'){
      if (g.trash > 0){ g.trash = 0; g.stats.emptied++; g.addText(this.x, this.y - 82, 'Lixo pra fora!', PAL.ok, 14); Sfx.noise(0.3, 0.1, 0, 400); }
    } else if (st.type === 'maquina'){
      const o = st.o; o.dani = false;
      if (g.maq.indexOf(o) < 0 || o.t > 0) return;
      const k = Math.min(o.n, DANI_HANDS - this.hands.length);
      for (let i=0;i<k;i++) this.hands.push({ kind:'suco', group:o.group });
      if (k) g.maqTirar(o, k);
    } else if (st.type === 'suco'){
      const grp = st.grp, n = this.hands.filter(h => h.kind === 'suco' && h.group === grp).length;
      this.hands = this.hands.filter(h => !(h.kind === 'suco' && h.group === grp));
      if (n && g.sucoAp(grp, this)) g.entregaSuco(grp, n, this.x, this.y);
    } else if (st.type === 'coffee'){
      if (this.hands.length < DANI_HANDS) this.hands.push({ kind:'coffee' });
    } else if (st.type === 'serve'){
      const t = st.t, h = this.hands.find(x => x.kind === 'coffee'), grp = t.group;
      if (grp) grp.daniCoffee = false;
      if (!h || !grp || !grp.seated || grp.coffee) return;
      this.hands.splice(this.hands.indexOf(h), 1);
      grp.coffee = true; grp.gain(g.up.cafeteira ? 2 : 1); g.usos.cafeteira++;
      grp.bebConta += DRINK_PRICE.coffee; g.pontos += PONTOS_ACAO.coffee; g.addText(t.cx, t.cy - 40, '+' + DRINK_PRICE.coffee + ' na conta', PAL.ok, 16); Sfx.coin();
    }
  }
  update(dt){
    if (!this.active) return;
    this.moving = false;
    if (this.phase === 'idle'){ this.thinkT -= dt; if (this.thinkT <= 0){ this.thinkT = 0.25; this.think(); } }
    if (this.phase === 'walk'){
      let rem = this.speed * dt;
      while (this.path.length && rem > 0){
        const p = this.path[0], dx = p.x - this.x, dy = p.y - this.y, d = Math.hypot(dx,dy);
        if (d < 0.5){ this.path.shift(); continue; }
        const st = Math.min(d, rem);
        this.x += dx/d*st; this.y += dy/d*st; rem -= st; this.moving = true;
        if (Math.abs(dx) > 0.5) this.dir = dx > 0 ? 1 : -1;
        if (st >= d) this.path.shift();
      }
      if (!this.path.length){
        if (this.plan){ this.phase = 'do'; this.timer = this.duration(this.plan); }
        else this.phase = 'idle';
      }
    } else if (this.phase === 'do'){
      this.timer -= dt;
      if (this.timer <= 0){ const st = this.plan; this.plan = null; this.phase = 'idle'; this.thinkT = 0; this.perform(st); }
    }
    if (this.moving) this.walkPh += dt * 12;
  }
}

