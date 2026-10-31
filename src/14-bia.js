/* ============================================================
   MÃOS
   - Comandas: só na mão sem bandeja, todas juntas, até o número de
     bocas da cozinha (kitchen.slots, hoje 3). Essa mão não leva mais nada.
   - Mão sem bandeja (sem comandas): 1 item qualquer, inclusive louça suja.
   - Sem o upgrade, a outra mão também leva 1 item.
   - Com a bandeja: 1 prato + 1 bebida, ou 2 pratos, ou 3 bebidas (cafezinho
     e suco), ou 2 pilhas de louça suja, ou menos que isso. Sujo e limpo
     nunca juntos na bandeja. O suco da espera (v7.5, 'suco') conta como bebida, e a marmita (v8.6), como prato.
   ============================================================ */
const KITCHEN_SLOTS = 3;
const BEBIDAS_MAO = { coffee:1, juice:1, suco:1, doce:1, cafeesp:1, drink:1 };   // v9.2 (v9.5: o drink do Anselmo): o doce da geladeirinha conta como bebida nas mãos
function trayOk(items){
  let d = 0, k = 0, s = 0;
  for (const h of items){
    if (h.kind === 'dish' || h.kind === 'marmita') d++;
    else if (BEBIDAS_MAO[h.kind]) k++;
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

/* a marmita (v8.6) na mão de quem leva: o mesmo objeto, sem o lugar na janela de prontos */
function marmitaMao(p){ return { kind:'marmita', mid:p.mid, dish:p.dish, dono:p.dono, age:p.age, crit:p.crit, q:p.q }; }
/* onde está quem pediu o suco da espera: o banco lá fora ou a mesa (a Bia refaz o caminho quando muda) */
function sucoLugar(g){ return !g ? '' : g.state === 'queue' ? 'banco' + g.slot : g.table ? 'mesa' + g.table.id : 'fora'; }

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
  get emptying(){ return !!(this.doing && this.doing.type === 'trash' && !this.hands.length && this.g.trash > 0); }   // esvaziando a lixeira (v8.5.2: a tampa abre e fecha)
  get washing(){ return !!(this.doing && this.doing.type === 'sink' && this.doing.wash > 0); }
  enqueue(a){
    if (this.acts.length >= filaMax(this.g.up)){ this.g.addText(this.x, this.y - 82, 'Fila cheia!', PAL.alerta, 15); return false; }
    a.t0 = this.g.anim;   // para o selo da fila surgir com um pulinho
    this.acts.push(a);
    return true;
  }
  /* selos da fila no salão (v7.3): lugar -> vezes em que a Bia vai passar ali (1 = a ação atual) */
  marks(){
    const m = {};
    this.acts.forEach((a,i) => {
      const k = a.type === 'table' ? 'table:' + a.id : a.type === 'plate' ? 'plate:' + a.pid : (a.type === 'maquina' && a.leg === 2) ? 'espera:' + a.group.id : a.type;
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
  /* o grupo foi embora: o prato dele na mão vira louça suja (se não couber nas mãos, vai direto para a pia) */
  purgeGroup(group){
    this.hands = this.hands.filter(h => h.group !== group || h.kind === 'dish');
    this.hands.filter(h => h.kind === 'dish' && h.group === group).forEach(h => {
      const i = this.hands.indexOf(h), sujo = { kind:'dirty', n:group.size };
      this.hands[i] = sujo;
      if (!this.layout()){ this.hands.splice(i, 1); this.g.kitchen.sinkN++; }
    });
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
    if (a.type === 'maquina' && a.leg === 2) return g.sucoAp(a.group, this);   // 2ª parte: levar a quem pediu
    const st = STATIONS[a.type === 'plate' ? 'plates' : a.type];
    return st ? st.ap : null;
  }
  begin(a){
    const ap = this.apFor(a);
    if (!ap){ this.acts.shift(); this.phase = 'idle'; this.path = []; return; }
    a.alvo = a.type === 'maquina' && a.leg === 2 ? sucoLugar(a.group) : null;   // levando o suco: se quem pediu mudar de lugar, refaz o caminho
    this.path = findPath({x:this.x, y:this.y}, ap);
    this.phase = 'walk';
  }
  duration(a){
    if (a.type === 'table'){
      const t = this.g.tables[a.id-1];
      return (t && t.group && t.group.state === 'wantOrder') ? 0.6 : 0.35;
    }
    if (a.type === 'juice') return JUICE.prep;
    if (a.type === 'espresso'){ a.item = this.g.cafeEspItem(); return cafeDe(a.item).prep; }   // v9.3: 0,8 s o espresso, 1,2 s o cappuccino
    if (a.type === 'maquina') return a.leg === 2 ? 0.35 : this.g.bebida.take;
    const g = this.g;
    if (a.type === 'sink'){
      // pia em 2 etapas: com louça na mão, a Bia só deixa a louça lá; sem louça na mão, lava
      // tudo o que estiver na pia. Só 1 pessoa lava por vez: se a Dani está lavando, a Bia
      // não lava (o Tonhão lava à parte). Decidido na chegada: a.wash = pilhas a lavar
      const carry = this.hands.some(h => h.kind === 'dirty');
      a.busy = !carry && g.ajud.some(h => h.washing);
      a.wash = carry || a.busy ? 0 : g.kitchen.sinkN;
      return WASH.base + WASH.perPile * a.wash;
    }
    if (a.type === 'trash'){
      const drinks = this.hands.filter(h => BEBIDAS_MAO[h.kind]).length;
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
    const a0 = this.acts[0];
    if (this.phase === 'walk' && a0 && a0.alvo && sucoLugar(a0.group) !== a0.alvo) this.begin(a0);
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
    this.x = clamp(this.x, -CALCADA.w, W); this.y = clamp(this.y, 0, H);
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
  doceN(){ return this.hands.filter(h => h.kind === 'doce').length; }
  cafeEspN(){ return this.hands.filter(h => h.kind === 'cafeesp').length; }   // v9.3
  drinkN(grp){ return this.hands.filter(h => h.kind === 'drink' && (!grp || h.group === grp)).length; }   // v9.5
  /* O que a Bia faria agora nessa mesa (ignorando mãos cheias)? Usado no HUD e na execução */
  verbFor(t){
    if (!t) return null;
    const grp = t.group;
    if (grp && this.hands.some(h => h.kind === 'dish' && h.group === grp) && grp.state === 'ordered') return 'deliver';
    if (grp && grp.juicePending > 0 && grp.juiceOpen && this.juiceN() > 0) return 'juice';
    if (grp && grp.docesFalta > 0 && grp.esperaSuco && this.doceN() > 0) return 'doce';   // v9.2
    if (grp && grp.cafesFalta > 0 && grp.esperaSuco && this.cafeEspN() > 0) return 'cafeesp';   // v9.3
    if (grp && grp.drinkOpen && this.drinkN(grp) > 0) return 'drink';   // v9.5
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
    if (a.type === 'adiantar'){ this.submitTickets(); if (!g.adiantar(this.x, this.y - 104)) this.fail(g.marmitaOk ? 'Já tem ' + g.vagas + ' marmitas!' : '?'); return; }   // v8.6 (leva as comandas da mão junto)
    if (a.type === 'retirada'){ if (!g.levaMarmitas(this)) this.fail(this.hands.some(h => h.kind === 'marmita') ? 'Prateleira cheia!' : '?'); return; }
    if (a.type === 'plate'){
      this.submitTickets();
      const slot = g.kitchen.plates.findIndex(p => p && p.id === a.pid);
      if (slot < 0) return this.fail('?');
      if (g.kitchen.plates[slot].group && g.kitchen.plates[slot].group.cami) return this.fail('É da Cami!');   // v9.6: o prato do grupo que a Cami atende
      if (!this.canTake('dish')) return this.fail('Mãos cheias!');
      const p = g.kitchen.plates[slot];
      g.kitchen.plates[slot] = null;
      if (p.kind === 'marmita'){ this.hands.push(marmitaMao(p)); Sfx.blip(); return; }
      const perde = pratoPerde(p.age);   // v8.6.8: esfriou no balcão
      this.hands.push({ kind:'dish', table:p.table, group:p.group, dish:p.dish, crit:p.crit, q:Math.max(1, (p.q || 1) - perde), fria:perde >= PRATO.friaDe, vip:p.vip });
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
    if (a.type === 'doces'){   // v9.2: a geladeirinha de doces
      if (!this.canTake('doce')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'doce', id:pick(docesLista(g.up)).id }); g.custo += doceIngred(g.up);
      Sfx.blip(); g.addText(this.x, this.y - 82, 'Doce!', PAL.madeira, 14);
      return;
    }
    if (a.type === 'drinks'){   // v9.5: o balcão do Anselmo: pega os copos prontos que couberem (do pedido mais antigo para o mais novo)
      let k = 0;
      while (g.drinkPronto.length && this.canTake('drink')){ const o = g.drinkPronto.shift(); this.hands.push({ kind:'drink', id:o.id, group:o.grp }); k++; }
      if (!k) return this.fail(g.drinkPronto.length ? 'Mãos cheias!' : (g.drinkQ.length || g.drinkJob ? 'Ainda não ficou pronto!' : '?'));
      Sfx.blip(); g.addText(this.x, this.y - 82, k > 1 ? 'Drinks!' : drinkDe(this.hands[this.hands.length - 1].id).nome + '!', PAL.alerta, 14);
      return;
    }
    if (a.type === 'espresso'){   // v9.3: a máquina de espresso (o café do pedido que ainda ninguém levou, senão qualquer um)
      if (!this.canTake('cafeesp')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'cafeesp', id:a.item || g.cafeEspItem() }); g.custo += CAFES.ingred;
      Sfx.blip(); g.addText(this.x, this.y - 82, cafeDe(this.hands[this.hands.length - 1].id).nome + '!', PAL.madeira, 14);
      return;
    }
    if (a.type === 'coffee'){
      if (g.quebrado('cafeteira')) return this.fail('Cafeteira parada!');
      if (!this.canTake('coffee')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'coffee' });
      Sfx.blip();
      g.addText(this.x, this.y - 82, 'Cafezinho!', PAL.madeira, 14);
      return;
    }
    if (a.type === 'trash'){
      const lixo = this.hands.filter(h => BEBIDAS_MAO[h.kind]);
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
      const fine = fora.reduce((v,h) => v + (h.kind === 'suco' ? g.bebida.preco : h.kind === 'doce' ? docePreco(g.up) : h.kind === 'cafeesp' ? cafeDe(h.id).preco : DRINK_PRICE[h.kind]) / 2, 0);
      g.addMoney(-fine);
      g.stats.trash += fora.length;
      g.addText(this.x, this.y - 82, 'No lixo!', PAL.perigo, 15);
      if (fine) g.addText(this.x, this.y - 104, '-' + (fine % 1 ? fine.toFixed(2).replace('.', ',') : fine), PAL.perigo, 18);
      Sfx.noise(0.18, 0.12, 0, 500); Sfx.tone(160, 0.12, 'square', 0.04);
      if (overflow){ g.trash = 0; g.stats.emptied++; g.addText(this.x, this.y - 126, 'Lixo pra fora!', PAL.ok, 15); }
      return;
    }
    if (a.type === 'maquina') return this.doMaquina(a);
    if (a.type === 'sink'){
      const n = this.hands.filter(h => h.kind === 'dirty').length;
      if (n){
        this.hands = this.hands.filter(h => h.kind !== 'dirty');
        g.kitchen.sinkN += n;
        g.addText(this.x, this.y - 82, 'Na pia!', PAL.faixa, 15); Sfx.blip();
        return;
      }
      if (a.wash === undefined) this.duration(a);
      if (!a.wash) return this.fail(a.busy && g.kitchen.sinkN ? (g.ajud.some(h => h.washing) ? ({ dani:'A Dani', joca:'O Joca', cami:'A Cami' })[g.ajud.find(h => h.washing).quem] + ' está lavando!' : '?') : '?');
      const w = g.washPiles(a.wash);
      g.addText(this.x, this.y - 82, w > 1 ? 'Lavou ' + w + ' pilhas!' : 'Lavou!', PAL.faixa, 15);
      Sfx.wash();
      return;
    }
  }
  /* máquina de suco da espera (v7.5): uma ação só, em 2 partes. Na máquina, pega os copos prontos que couberem (do
     pedido mais antigo para o mais novo) e a ação volta para o começo da fila, agora indo até quem pediu (lá fora
     ou, se já sentou, na mesa), um grupo depois do outro, enquanto houver copo na mão. Sem pedido pronto, leva os
     copos que já estiver carregando */
  doMaquina(a){
    const g = this.g;
    if (a.leg === 2){
      const grp = a.group, n = this.hands.filter(h => h.kind === 'suco' && h.group === grp).length;
      if (!n || !g.sucoAp(grp, this)) return this.fail('?');
      this.hands = this.hands.filter(h => !(h.kind === 'suco' && h.group === grp));
      g.entregaSuco(grp, n, this.x, this.y);
      return this.maisSuco(a);
    }
    if (!g.up.maquina) return this.fail('?');
    let k = 0;
    for (const o of g.maqPronto().filter(q => !q.dani)){
      let j = 0;
      while (j < o.n && this.canTake('suco')){ this.hands.push({ kind:'suco', group:o.group }); j++; }
      if (j){ g.maqTirar(o, j); k += j; }
      if (!this.canTake('suco')) break;
    }
    if (k){ Sfx.tone(700, 0.08, 'sine', 0.05); Sfx.tone(930, 0.1, 'sine', 0.05, 0.07); g.addText(this.x, this.y - 82, g.bebida.pega(k), PAL.alerta, 14); }
    if (!this.maisSuco(a)) this.fail(g.maqPronto().length ? 'Mãos cheias!' : (g.maq.length ? 'Ainda não ficou pronto!' : '?'));
  }
  /* ainda há copo da espera na mão para alguém que dá para achar: a ação segue até ele */
  maisSuco(a){
    const g = this.g, h = this.hands.find(q => q.kind === 'suco' && g.sucoAp(q.group, this));
    if (!h) return false;
    a.leg = 2; a.group = h.group; a.t0 = g.anim;
    this.acts.unshift(a);
    return true;
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
    grp.bebConta += JUICE.price * n;   // v8.5.2: o suco é pago na conta, com a comida
    g.score('juice', t.cx + 24, t.cy - 30, 0, grp);
    g.addText(t.cx + 24, t.cy - 52, '+' + JUICE.price * n + ' na conta', PAL.ok, 14);
    if (!grp.juicePending) g.addText(t.cx, t.cy - 96, n > 1 ? 'Sucos entregues!' : 'Suco entregue!', PAL.alerta, 15);
    Sfx.tone(880, 0.07, 'sine', 0.05); Sfx.tone(1175, 0.12, 'sine', 0.05, 0.07);
    return n;
  }
  /* entrega os doces que a Bia carrega para essa mesa (v9.2); devolve quantos entregou */
  serveDoce(t){
    const grp = t && t.group;
    if (!grp || !grp.esperaSuco || grp.docesFalta <= 0) return 0;
    const n = Math.min(grp.docesFalta, this.doceN());
    for (let k=0;k<n;k++) this.hands.splice(this.hands.findIndex(h => h.kind === 'doce'), 1);
    if (n) this.g.entregaDoces(grp, n, t.cx, t.cy);
    return n;
  }
  /* v9.3: entrega os cafés da máquina de espresso que a Bia carrega para essa mesa */
  serveCafeEsp(t){
    const grp = t && t.group;
    if (!grp || !grp.esperaSuco || grp.cafesFalta <= 0) return 0;
    const n = Math.min(grp.cafesFalta, this.cafeEspN());
    for (let k=0;k<n;k++) this.hands.splice(this.hands.findIndex(h => h.kind === 'cafeesp'), 1);
    if (n) this.g.entregaCafes(grp, n, t.cx, t.cy);
    return n;
  }
  /* v9.5: entrega os drinks do Anselmo que a Bia carrega para essa mesa */
  serveDrink(t){
    const grp = t && t.group;
    if (!grp || !grp.drinkOpen) return 0;
    const n = Math.min(grp.drinksFalta, this.drinkN(grp));
    for (let k=0;k<n;k++) this.hands.splice(this.hands.findIndex(h => h.kind === 'drink' && h.group === grp), 1);
    if (n) this.g.entregaDrinks(grp, n, t.cx, t.cy);
    return n;
  }
  doTable(t){
    const g = this.g;
    const served = this.serveJuice(t) + this.serveDoce(t) + this.serveCafeEsp(t) + this.serveDrink(t);
    let v = this.verbFor(t);
    if (v === 'juice' || v === 'doce' || v === 'cafeesp' || v === 'drink') v = null;
    if (!v && served) return;
    const grp = t && t.group;
    const cx = t ? t.cx : this.x, cy = t ? t.cy : this.y;
    if (v === 'deliver'){
      const i = this.hands.findIndex(h => h.kind === 'dish' && h.group === grp);
      const dish = this.hands[i];
      this.hands.splice(i,1);
      g.entregaPrato(grp, dish, t);
    } else if (v === 'clear'){
      if (!this.canTake('dirty')) return this.fail('Mãos cheias!');
      this.hands.push({ kind:'dirty', n:t.dirtyN });
      t.dirty = false; t.dirtyN = 0;
      g.score('clear', cx, cy - 20);
      Sfx.blip();
    } else if (v === 'take'){
      if (!this.canTake('ticket')) return this.fail('Mãos cheias!');
      g.assignCmd(grp);
      this.hands.push({ kind:'ticket', table:t.id, group:grp });
      grp.setState('ordered');
      g.drinkPedir(grp);   // v9.5: os drinks vão para a fila do Anselmo
      grp.gain(1);
      g.score('take', cx, cy - 40, 0, grp);
      Sfx.blip();
    } else if (v === 'bill'){
      g.collectBill(grp, t);
    } else if (v === 'coffee'){
      const i = this.hands.findIndex(h => h.kind === 'coffee');
      this.hands.splice(i,1);
      grp.coffee = true;
      grp.gain(g.up.cafeteira ? 2 : 1);
      grp.bebConta += DRINK_PRICE.coffee;   // v8.5.2: pago na conta
      g.score('coffee', cx, cy - 40, 0, grp);
      g.addText(cx, cy - 62, '+' + DRINK_PRICE.coffee + ' na conta', PAL.ok, 14);
      g.usos.cafeteira++;
      Sfx.coin();
    } else {
      this.fail('?');
    }
  }
}

