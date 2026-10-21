/* ============================================================
   MÃOS
   - Comandas: só na mão sem bandeja, todas juntas, até o número de
     bocas da cozinha (kitchen.slots, hoje 3). Essa mão não leva mais nada.
   - Mão sem bandeja (sem comandas): 1 item qualquer, inclusive louça suja.
   - Sem o upgrade, a outra mão também leva 1 item.
   - Com a bandeja: 1 prato + 1 bebida, ou 2 pratos, ou 3 bebidas (cafezinho
     e suco), ou 2 pilhas de louça suja, ou menos que isso. Sujo e limpo
     nunca juntos na bandeja.
   ============================================================ */
const KITCHEN_SLOTS = 3;
const DRINKS = { coffee:1, juice:1 };
function trayOk(items){
  let d = 0, k = 0, s = 0;
  for (const h of items){
    if (h.kind === 'dish') d++;
    else if (DRINKS[h.kind]) k++;
    else if (h.kind === 'dirty') s++;
    else return false;                 // comanda não vai na bandeja
  }
  if (s) return d === 0 && k === 0 && s <= 2;
  return (k === 0 && d <= 2) || (d === 0 && k <= 3) || (d <= 1 && k <= 1);
}
/* divide os itens em [bandeja ou 1ª mão, outra mão]; null se não couberem */
function handLayout(items, tray, maxTickets){
  if (maxTickets == null) maxTickets = KITCHEN_SLOTS;
  const tickets = items.filter(h => h.kind === 'ticket'), rest = items.filter(h => h.kind !== 'ticket');
  if (tickets.length > maxTickets) return null;
  if (tickets.length){
    // a mão sem bandeja fica com as comandas; o resto vai na bandeja (ou na outra mão, 1 item)
    if (tray ? !trayOk(rest) : rest.length > 1) return null;
    return [rest, tickets];
  }
  if (!tray) return rest.length <= 2 ? [rest.slice(0,1), rest.slice(1,2)] : null;
  if (trayOk(rest)) return [rest, []];
  // tenta deixar na mão livre primeiro a louça suja, depois qualquer item
  const order = rest.map((h,i) => i).sort((a,b) => (rest[b].kind === 'dirty') - (rest[a].kind === 'dirty'));
  for (const i of order){
    const others = rest.filter((h,j) => j !== i);
    if (trayOk(others)) return [others, [rest[i]]];
  }
  return null;
}

/* ============================================================
   GARÇONETE (Bia)
   ============================================================ */
class Waitress {
  constructor(game){ this.g = game; this.reset(); }
  reset(){
    this.x = 700; this.y = 310; this.dir = -1;
    this.hands = []; this.acts = []; this.phase = 'idle'; this.timer = 0;
    this.path = []; this.walkPh = 0; this.moving = false; this.qT = 0; this.doing = null;
  }
  get speed(){ const u = this.g.up; return BIA_SPEED.base * (u.corrida ? BIA_SPEED.corrida : u.tenis ? BIA_SPEED.tenis : 1); }
  get tray(){ return !!this.g.up.bandeja; }
  layout(items){ return handLayout(items || this.hands, this.tray, this.g.kitchen.slots); }
  canTake(kind){ return !!this.layout(this.hands.concat([{ kind }])); }
  /* quantos itens comuns (comanda, louça) ainda cabem */
  free(){ let n = 0; const extra = []; while (n < 3){ extra.push({ kind:'dirty' }); if (!this.layout(this.hands.concat(extra))) break; n++; } return n; }
  juiceN(){ return this.hands.filter(h => h.kind === 'juice').length; }
  /* lavando na pia agora (a Dani espera a vez) */
  get washing(){ return !!(this.doing && this.doing.type === 'sink' && this.doing.wash > 0); }
  enqueue(a){
    if (this.acts.length >= 6){ this.g.addText(this.x, this.y - 82, 'Fila cheia!', PAL.alerta, 15); return false; }
    a.t0 = this.g.anim;   // para o selo da fila surgir com um pulinho
    this.acts.push(a);
    return true;
  }
  /* selos da fila no salão (v7.3): lugar -> vezes em que a Bia vai passar ali (1 = a ação atual) */
  marks(){
    const m = {};
    this.acts.forEach((a,i) => {
      const k = a.type === 'table' ? 'table:' + a.id : a.type === 'plate' ? 'plate:' + a.pid : a.type;
      (m[k] = m[k] || []).push(i + 1);
    });
    return m;
  }
  remove(i){
    if (i < 0 || i >= this.acts.length) return;
    this.acts.splice(i,1);
    if (i === 0){ this.phase = 'idle'; this.path = []; this.doing = null; }
  }
  clearActs(){ this.acts = []; this.phase = 'idle'; this.path = []; this.doing = null; }
  purgeGroup(group){
    this.hands = this.hands.filter(h => h.group !== group);
  }
  apFor(a){
    const g = this.g;
    if (a.type === 'table'){
      const t = g.tables[a.id - 1];
      if (!t || !t.open) return null;
      const pts = tableApproach(t);
      const d0 = Math.hypot(pts[0].x-this.x, pts[0].y-this.y), d1 = Math.hypot(pts[1].x-this.x, pts[1].y-this.y);
      return d0 <= d1 ? pts[0] : pts[1];
    }
    const st = STATIONS[a.type === 'plate' ? 'plates' : a.type];
    return st ? st.ap : null;
  }
  begin(a){
    const ap = this.apFor(a);
    if (!ap){ this.acts.shift(); return; }
    this.path = findPath({x:this.x, y:this.y}, ap);
    this.phase = 'walk';
  }
  duration(a){
    if (a.type === 'table'){
      const t = this.g.tables[a.id-1];
      return (t && t.group && t.group.state === 'wantOrder') ? 0.6 : 0.35;
    }
    if (a.type === 'juice') return JUICE.prep;
    if (a.type === 'agua') return AGUA.refill;
    const g = this.g;
    if (a.type === 'sink'){
      // pia em 2 etapas: com louça na mão, a Bia só deixa a louça lá; sem louça na mão, lava
      // tudo o que estiver na pia. Só 1 pessoa lava por vez: se a Dani está lavando, a Bia
      // não lava (o Tonhão lava à parte). Decidido na chegada: a.wash = pilhas a lavar
      const carry = this.hands.some(h => h.kind === 'dirty');
      a.busy = !carry && g.dani.washing;
      a.wash = carry || a.busy ? 0 : g.kitchen.sinkN;
      return WASH.base + WASH.perPile * a.wash;
    }
    if (a.type === 'trash'){
      const drinks = this.hands.filter(h => DRINKS[h.kind]).length;
      if (!this.hands.length && g.trash > 0) return TRASH.empty;
      // não cabe e só há bebidas nas mãos: joga tudo e esvazia em seguida
      if (drinks && drinks === this.hands.length && drinks > TRASH.cap - g.trash) return 0.3 + TRASH.empty;
    }
    return 0.3;
  }
  update(dt){
    if (this.qT > 0) this.qT -= dt;
    this.moving = false;
    if (this.phase === 'idle' && this.acts.length) this.begin(this.acts[0]);
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
        this.phase = 'do';
        this.timer = this.duration(this.acts[0]);
        this.doing = this.acts[0];
      }
    } else if (this.phase === 'do'){
      this.timer -= dt;
      if (this.timer <= 0){
        const a = this.acts.shift();
        this.phase = 'idle'; this.doing = null;
        if (a) this.perform(a);
      }
    }
    if (this.moving) this.walkPh += dt * 13;
    this.x = clamp(this.x, 0, W); this.y = clamp(this.y, 0, H);
  }
  fail(msg){
    this.g.addText(this.x, this.y - 82, msg, PAL.alerta, msg === '?' ? 26 : 15);
    this.qT = 0.9;
    Sfx.tone(200, 0.12, 'square', 0.04);
  }
  submitTickets(){
    const tk = this.hands.filter(h => h.kind === 'ticket');
    if (!tk.length) return false;
    tk.forEach(t => this.g.kitchen.submit(t));
    this.hands = this.hands.filter(h => h.kind !== 'ticket');
    this.g.addText(this.x + 10, this.y - 82, tk.length > 1 ? 'Pedidos enviados!' : 'Pedido enviado!', PAL.faixa, 14);
    Sfx.ok();
    return true;
  }
  hasCoffee(){ return this.hands.some(h => h.kind === 'coffee'); }
  /* O que a Bia faria agora nessa mesa (ignorando mãos cheias)? Usado no HUD e na execução */
  verbFor(t){
    if (!t) return null;
    const grp = t.group;
    if (grp && this.hands.some(h => h.kind === 'dish' && h.group === grp) && grp.state === 'ordered') return 'deliver';
    if (grp && grp.juicePending > 0 && grp.juiceOpen && this.juiceN() > 0) return 'juice';
    if (t.dirty) return 'clear';
    if (grp && grp.state === 'wantOrder') return 'take';
    if (grp && grp.state === 'wantBill') return 'bill';
    if (grp && grp.seated && !grp.coffee && this.hasCoffee()) return 'coffee';
    return null;
  }
  perform(a){
    const g = this.g;
    if (a.type === 'table') return this.doTable(g.tables[a.id-1]);
    if (a.type === 'order'){ if (!this.submitTickets()) this.fail('?'); return; }
    if (a.type === 'plate'){
      this.submitTickets();
      const slot = g.kitchen.plates.findIndex(p => p && p.id === a.pid);
      if (slot < 0) return this.fail('?');
      if (!this.canTake('dish')) return this.fail('Mãos cheias!');
      const p = g.kitchen.plates[slot];
      g.kitchen.plates[slot] = null;
      this.hands.push({ kind:'dish', table:p.table, group:p.group, dish:p.dish, crit:p.crit, vip:p.vip });
      Sfx.blip();
      return;
    }
    if (a.type === 'juice'){
      if (!this.canTake('juice')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'juice' });
      Sfx.tone(700, 0.08, 'sine', 0.05); Sfx.tone(930, 0.1, 'sine', 0.05, 0.07);
      g.addText(this.x, this.y - 82, 'Suco!', PAL.alerta, 14);
      return;
    }
    if (a.type === 'coffee'){
      if (!this.canTake('coffee')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'coffee' });
      Sfx.blip();
      g.addText(this.x, this.y - 82, 'Cafezinho!', PAL.madeira, 14);
      return;
    }
    if (a.type === 'trash'){
      const lixo = this.hands.filter(h => DRINKS[h.kind]);
      if (!lixo.length){
        // mãos vazias: esvazia a lixeira
        if (!this.hands.length && g.trash > 0){ g.trash = 0; g.stats.emptied++; g.addText(this.x, this.y - 82, 'Lixo pra fora!', PAL.ok, 15); Sfx.noise(0.3, 0.1, 0, 400); return; }
        return this.fail(this.hands.length ? 'Mãos ocupadas!' : '?');
      }
      // se as bebidas não cabem, a lixeira aceita todas uma última vez e a Bia já esvazia em seguida,
      // mas só se ela tiver apenas bebidas nas mãos (para esvaziar, as mãos precisam ficar livres)
      const overflow = lixo.length > TRASH.cap - g.trash;
      if (overflow && lixo.length < this.hands.length) return this.fail(g.trash >= TRASH.cap ? 'Lixo cheio!' : 'Não cabe tudo!');
      const fora = lixo;
      fora.forEach(h => this.hands.splice(this.hands.indexOf(h), 1));
      g.addTrash(fora.length);
      const fine = fora.reduce((v,h) => v + DRINK_PRICE[h.kind] / 2, 0);
      g.addMoney(-fine);
      g.stats.trash += fora.length;
      g.addText(this.x, this.y - 82, 'No lixo!', PAL.perigo, 15);
      g.addText(this.x, this.y - 104, '-' + (fine % 1 ? fine.toFixed(2).replace('.', ',') : fine), PAL.perigo, 18);
      Sfx.noise(0.18, 0.12, 0, 500); Sfx.tone(160, 0.12, 'square', 0.04);
      if (overflow){ g.trash = 0; g.stats.emptied++; g.addText(this.x, this.y - 126, 'Lixo pra fora!', PAL.ok, 15); }
      return;
    }
    if (a.type === 'agua'){
      if (!g.up.agua) return this.fail('?');
      if (g.agua >= AGUA.cap) return this.fail('Está cheia!');
      if (g.money < AGUA.price) return this.fail('Sem dinheiro!');
      g.agua = AGUA.cap; g.addMoney(-AGUA.price); g.stats.refill++;
      g.addText(this.x, this.y - 82, 'Água cheia!', PAL.faixa, 15);
      g.addText(this.x, this.y - 104, '-' + AGUA.price, PAL.perigo, 18);
      Sfx.tone(520, 0.1, 'sine', 0.05); Sfx.tone(780, 0.12, 'sine', 0.05, 0.08);
      return;
    }
    if (a.type === 'sink'){
      const n = this.hands.filter(h => h.kind === 'dirty').length;
      if (n){
        this.hands = this.hands.filter(h => h.kind !== 'dirty');
        g.kitchen.sinkN += n;
        g.addText(this.x, this.y - 82, 'Na pia!', PAL.faixa, 15); Sfx.blip();
        return;
      }
      if (a.wash === undefined) this.duration(a);
      if (!a.wash) return this.fail(a.busy && g.kitchen.sinkN ? 'A Dani está lavando!' : '?');
      const w = g.washPiles(a.wash);
      g.addText(this.x, this.y - 82, w > 1 ? 'Lavou ' + w + ' pilhas!' : 'Lavou!', PAL.faixa, 15);
      Sfx.wash();
      return;
    }
  }
  /* entrega os sucos que a Bia carrega para essa mesa; devolve quantos entregou */
  serveJuice(t){
    const g = this.g, grp = t && t.group;
    if (!grp || !grp.juiceOpen || grp.juicePending <= 0) return 0;
    const n = Math.min(grp.juicePending, this.juiceN());
    if (!n) return 0;
    for (let k=0;k<n;k++) this.hands.splice(this.hands.findIndex(h => h.kind === 'juice'), 1);
    grp.juiceGot += n;
    g.stats.juice += n; g.custo += INGRED.suco * n;
    grp.gain(1);
    g.score('juice', JUICE.price * n, t.cx + 24, t.cy - 30);
    if (!grp.juicePending) g.addText(t.cx, t.cy - 96, n > 1 ? 'Sucos entregues!' : 'Suco entregue!', PAL.alerta, 15);
    Sfx.tone(880, 0.07, 'sine', 0.05); Sfx.tone(1175, 0.12, 'sine', 0.05, 0.07);
    return n;
  }
  doTable(t){
    const g = this.g;
    const served = this.serveJuice(t);
    let v = this.verbFor(t);
    if (v === 'juice') v = null;
    if (!v && served) return;
    const grp = t && t.group;
    const cx = t ? t.cx : this.x, cy = t ? t.cy : this.y;
    if (v === 'deliver'){
      const i = this.hands.findIndex(h => h.kind === 'dish' && h.group === grp);
      const dish = this.hands[i];
      this.hands.splice(i,1);
      grp.setState('eating');
      grp.timer = rand(grp.T.eat[0], grp.T.eat[1]) * (g.up.ventilador ? 0.85 : 1);
      grp.eatTotal = grp.timer;
      grp.gain(dish.crit ? 2 : 1);
      g.score('deliver', 20, cx, cy - 40);
      if (dish.crit){
        const b = grp.vip ? CRIT.vipBonus : CRIT.bonus;
        g.addMoney(b); g.stats.crit++;
        g.addText(cx, cy - 92, 'Caprichado! +' + b, PAL.mostarda, 16);
      }
      Sfx.ok();
    } else if (v === 'clear'){
      if (!this.canTake('dirty')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'dirty', n:t.dirtyN });
      t.dirty = false; t.dirtyN = 0;
      g.score('clear', 10, cx, cy - 20);
      Sfx.blip();
    } else if (v === 'take'){
      if (!this.canTake('ticket')) return this.fail('Mãos cheias!');
      g.assignCmd(grp);
      this.hands.push({ kind:'ticket', table:t.id, group:grp });
      grp.setState('ordered');
      grp.gain(1);
      g.score('take', 15, cx, cy - 40);
      Sfx.blip();
    } else if (v === 'bill'){
      g.collectBill(grp, t);
    } else if (v === 'coffee'){
      const i = this.hands.findIndex(h => h.kind === 'coffee');
      this.hands.splice(i,1);
      grp.coffee = true;
      grp.gain(g.up.cafeteira ? 2 : 1);
      g.score('coffee', DRINK_PRICE.coffee, cx, cy - 40);
      Sfx.coin();
    } else {
      this.fail('?');
    }
  }
}

