/* ============================================================
   JOGO
   ============================================================ */
class Game {
  constructor(canvas, ctx){
    this.canvas = canvas; this.ctx = ctx;
    this.anim = 0;
    this.state = 'menu';
    this.hooks = {};
    this.save = loadSave();
    this.up = this.save.up;
    this.tablesKey = ''; this.salaoMsg = ''; this.salaoSel = -1; this.salaoUndo = [];
    this.buildTables();
    this.bia = new Waitress(this);
    this.kitchen = new Kitchen(this);
    this.dani = new Helper(this);
    this.fx = [];
    this.sel = null; this.drag = null; this.hover = null; this.hoverOk = false;
    this.shopBought = false; this.shopNext = 1; this.boughtFor = 0;
    this.soundBtnT = 0;
    this.mode = 'carreira';
    this.resetDay(1);
  }
  setState(s){ this.state = s; if (this.hooks.state) this.hooks.state(s); }
  get unlocked(){ return this.save.maxDay; }
  get ponto(){ return pontoOf(this.save.salao.ponto); }

  resetDay(n){
    this.mode = n === 0 ? 'semfim' : 'carreira';
    this.day = n === 0 ? ENDLESS : DAYS[n-1];
    this.money = 0; this.custo = 0; this.contas = 0; this.paidDiv = 0;
    // divulgação (v7, do dia 3 em diante na carreira): quanto da freguesia do dia aparece
    this.div = (n >= DIVULGA_DIA) ? divulgaOf(this.save.divulga) : null;
    this.divF = this.div ? rand(this.div.groups[0], this.div.groups[1]) : 1;
    this.clock = this.day.time;
    this.cmdFree = CMD.map((c,i) => i);
    this.stars = 5; this.five = 0; this.starFlash = 0; this.arrT = 2; this.endless = null;
    this.elapsed = 0;
    this.atraso = 0; this.portaT = 0;   // porta que respeita a lotação: atraso total das chegadas e da chegada da vez
    this.gid = 0;
    this.groups = []; this.queue = [];
    this.buildTables();
    this.tables.forEach(t => { t.open = true; t.group = null; t.dirty = false; t.dirtyN = 0; });   // v7.4: todas as mesas abrem desde o dia 1
    this.kitchen.reset();
    this.kitchen.clean = dishStock(this.day, this.up);
    this.trash = 0; this.paid = 0; this.unpaid = [];
    this.agua = AGUA.cap;
    this.bia.reset();
    this.dani.reset();
    this.fx = [];
    this.stats = { served:0, lost:0, chain:0, spawned:0, full:0, vip:0, vipLost:0, juice:0, juiceMiss:0, trash:0, washed:0, emptied:0, refill:0, crit:0, lostBy:{ semMesa:0, comMesa:0, pedido:0, prato:0, conta:0 }, lotadoT:0 };
    this.lastKind = null; this.chainN = 0;
    this.ending = false; this.endTimer = 0; this.reason = '';
    this.sel = null; this.drag = null; this.hover = null;
    this.schedule = n === 0 ? [] : this.buildSchedule(this.day);
    this.nextIdx = 0;
    this.result = null;
    this.bannerT = 0;
  }
  buildSchedule(day){
    const out = [];
    const lug = this.tables.filter(t => t.open).reduce((a, t) => a + t.seats, 0);
    const N = Math.max(3, Math.round(day.groups * this.divF * movimentoSalao(lug))), vipP = (day.vip || 0) * (this.div ? this.div.vip : 1);
    const gap = day.speed * day.time / N;
    let t = 3;
    const forced = day.nu ? randi(1, Math.min(3, N-1)) : -1;
    const forcedVip = day.vip && !day.nu ? randi(1, Math.min(3, N-1)) : -1;
    const colors = this.tables.map(x => x.color);
    for (let i=0;i<N;i++){
      let type = (i === forced) ? day.nu : pick(day.types);
      let vip = false;
      if (day.vip && (i === forcedVip || Math.random() < vipP)){
        if (!VIP.types.includes(type)) type = pick(VIP.types);
        vip = true;
      }
      out.push({ t, type, color: pick(colors.concat([0,1,2,3])), vip });
      t += gap * (0.7 + Math.random()*0.6);
    }
    return out;
  }
  startDay(n){ this.resetDay(n); this.setState('intro'); }
  startEndless(){ this.resetDay(0); this.setState('intro'); }
  /* debita a folha e a divulgação do dia do dinheiro acumulado; o que não puder ser pago sai
     (a divulgação vira boca a boca, depois couvert, som, TV, Dani e aumento do Tonhão) */
  payDay(){
    const eq = this.save.equipe; this.unpaid = [];
    const divCost = () => this.div ? this.div.cost : 0;
    while (payroll(eq) + divCost() > this.save.bank){
      if (divCost()){
        this.unpaid.push(this.div.name); this.save.divulga = 'boca';
        this.div = divulgaOf('boca'); this.divF = rand(this.div.groups[0], this.div.groups[1]);
        this.schedule = this.buildSchedule(this.day);
      }
      else if (eq.couvert){ eq.couvert = false; this.unpaid.push('Couvert'); }
      else if (eq.som){ eq.som = false; this.unpaid.push('som'); }
      else if (eq.tv){ eq.tv = false; this.unpaid.push('TV'); }
      else if (eq.dani){ eq.dani = 0; this.unpaid.push('Dani'); }
      else if (eq.tonhao){ eq.tonhao--; this.unpaid.push('aumento do Tonhão'); }
      else break;
    }
    this.paid = payroll(eq); this.paidDiv = divCost();
    this.save.bank -= this.paid + this.paidDiv;
    this.contas = contasDia(this.tables, this.ponto);
    writeSave(this.save);
    this.kitchen.slots = STAFF.tonhao.levels[eq.tonhao].slots;
    this.dani.reset();
  }
  begin(){
    this.payDay(); this.setState('playing');
    if (this.unpaid.length) this.addText(W/2, 300, 'Sem dinheiro para pagar: sem ' + this.unpaid.join(', ') + ' hoje', PAL.perigo, 20);
  }
  /* lucro do dia (a meta): faturamento − ingredientes − contas − folha − divulgação */
  get fixo(){ return this.contas + this.paid + this.paidDiv; }
  get lucro(){ return this.money - this.custo - this.fixo; }
  get trashFull(){ return this.trash >= TRASH.cap; }
  /* alguém além da Bia lava a louça (Dani com a tarefa, ou o Tonhão com aumento) */
  get otherWasher(){ return this.dani.does('lavar') || this.kitchen.chef.wash > 0; }
  /* restos no lixo: +n, até encher */
  addTrash(n){ this.trash = Math.min(TRASH.cap, this.trash + n); }
  /* lava até n pilhas da pia: devolve pratos limpos e joga os restos no lixo */
  washPiles(n){
    n = Math.min(n, this.kitchen.sinkN);
    if (n <= 0) return 0;
    this.kitchen.sinkN -= n;
    if (isFinite(this.kitchen.clean)) this.kitchen.clean += n;
    this.addTrash(n);
    this.stats.washed += n;
    return n;
  }
  pause(){ if (this.state === 'playing'){ this.drag = null; this.setState('paused'); } }
  resume(){ if (this.state === 'paused') this.setState('playing'); }

  /* ---------- efeitos ---------- */
  addText(x, y, text, color, size){
    this.fx.push({ k:'text', x, y, vy:-38, life:1.3, max:1.3, text, color:color||PAL.tinta, size:size||18 });
  }
  /* brilho de confirmação no desenho do objeto tocado (key: mesa, prato, grupo ou nome da estação/botão) */
  addGlow(key){ this.fx = this.fx.filter(f => !(f.k === 'glow' && f.key === key)); this.fx.push({ k:'glow', key, life:0, max:0.4 }); }
  addCoins(x, y, n){
    n = RM ? Math.min(n,2) : n;
    for (let i=0;i<n;i++){
      this.fx.push({ k:'coin', x:x+rand(-10,10), y:y+rand(-10,10), vx:rand(-90,90), vy:rand(-160,-60), life:0, max:1.1, delay:i*0.05 });
    }
  }
  addPuff(x, y, n){
    n = RM ? 2 : (n||7);
    for (let i=0;i<n;i++){
      this.fx.push({ k:'puff', x:x+rand(-14,14), y:y+rand(-10,10), vx:rand(-30,30), vy:rand(-40,-10), r:rand(8,15), life:0, max:rand(0.8,1.2) });
    }
  }
  addSparks(x, y, n, color){
    n = RM ? 3 : (n||10);
    for (let i=0;i<n;i++){
      const a = rand(0, Math.PI*2), s = rand(40,120);
      this.fx.push({ k:'spark', x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:0, max:rand(0.5,0.9), color:color||PAL.mostarda });
    }
  }
  updateFx(dt){
    for (const f of this.fx){
      if (f.k === 'text'){ f.life -= dt; f.y += f.vy*dt; f.vy *= 0.97; }
      else if (f.k === 'coin'){
        if (f.delay > 0){ f.delay -= dt; continue; }
        f.life += dt; f.vy += 300*dt; f.x += f.vx*dt; f.y += f.vy*dt;
        if (f.life > 0.45){
          const tx = 120, ty = 566, dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx,dy) || 1;
          f.vx = dx/d*420; f.vy = dy/d*420;
          if (d < 20) f.life = f.max;
        }
      }
      else if (f.k === 'puff'){ f.life += dt; f.x += f.vx*dt; f.y += f.vy*dt; }
      else if (f.k === 'spark'){ f.life += dt; f.x += f.vx*dt; f.y += f.vy*dt; f.vy += 80*dt; }
      else f.life += dt;   // glow, tap
    }
    this.fx = this.fx.filter(f => f.k === 'text' ? f.life > 0 : f.life < f.max);
  }

  /* ---------- pontuação ---------- */
  addMoney(v){ this.money = Math.max(0, this.money + v); }
  score(kind, base, x, y){
    let bonus = 0;
    if (kind === this.lastKind) this.chainN++; else { this.chainN = 1; this.lastKind = kind; }
    if (this.chainN >= 2) bonus = Math.min(160, 10 * Math.pow(2, this.chainN - 2));
    this.stats.chain = Math.max(this.stats.chain, this.chainN);
    this.addMoney(base + bonus);
    this.addText(x, y, '+' + base, PAL.ok, 18);
    if (bonus){
      this.addText(x, y - 22, 'Corrente ×' + this.chainN + '! +' + bonus, PAL.alerta, 17);
      this.addSparks(x, y, 6, PAL.alerta);
    }
  }
  collectBill(g, t){
    if (g.juicePending > 0){
      g.hearts = Math.max(1, g.hearts - 1);
      this.stats.juiceMiss++;
      this.addText(t.cx, t.cy - 100, 'Faltou o suco!', PAL.perigo, 16);
    }
    const amount = Math.round(g.bill * HEART_MULT[g.hearts] * (1 + g.T.tip + (g.vip ? VIP.tip : 0)));
    this.score('bill', amount, t.cx, t.cy - 50);
    if (g.T.tip > 0 || g.vip) this.addText(t.cx + 20, t.cy - 76, 'Gorjeta!', PAL.mostarda, 15);
    const eq = this.save.equipe;
    if (eq.couvert && eq.taxa){
      const fee = STAFF.couvert.fee * g.size;
      this.addMoney(fee); this.stats.couvert = (this.stats.couvert || 0) + fee;
      this.addText(t.cx - 30, t.cy - 76, 'Couvert +' + fee, PAL.faixa, 14);
    }
    if (g.vip){
      this.stats.vip++;
      if (g.hearts === 5){
        this.addMoney(VIP.perfect);
        this.addText(t.cx, t.cy - 100, 'VIP satisfeito! +' + VIP.perfect, PAL.faixa, 17);
        this.addSparks(t.cx, t.cy - 40, 12, PAL.mostarda);
      }
    }
    this.addCoins(t.cx, t.cy, Math.min(8, 3 + g.hearts));
    Sfx.coin();
    this.stats.served++;
    if (this.mode === 'semfim' && g.hearts === 5){
      this.five++;
      if (this.five >= 8){
        this.five = 0;
        if (this.stars < 5){ this.stars++; this.starFlash = 1; this.addText(W/2, 300, '+1 estrela!', PAL.mostarda, 28); Sfx.win(); }
      }
    }
    this.releaseCmd(g);
    g.paid = true;
    t.dirty = true; t.dirtyN = g.size; t.group = null;
    const ap = this.exitPoint(t);
    g.x = ap.x; g.y = ap.y;
    g.table = null;
    g.setState('leaving');
    g.path = findPath({x:g.x, y:g.y}, {x:DOOR.x, y:DOOR.y});
  }
  exitPoint(t){ return tableApproach(t)[0]; }

  /* ---------- fluxo de grupos ---------- */
  /* chegada de um grupo: se a fila estiver cheia, o grupo olha, diz "Lotado!" e vai embora */
  arrive(s){
    if (this.queue.length >= QUEUE.max) return this.bounce(s);
    return this.spawn(s);
  }
  spawn(s){
    s = s || this.schedule[this.nextIdx++];
    const g = new Group(this, s.type, ++this.gid, s.color, s.vip);
    this.groups.push(g);
    if (g.vip){
      // VIP fura a fila: entra logo depois dos outros VIPs que já estão esperando
      let i = 0;
      while (i < this.queue.length && this.queue[i].vip) i++;
      this.queue.splice(i, 0, g);
      this.addText(DOOR.x + 110, DOOR.y + 12, 'VIP chegou!', PAL.mostarda, 22);
      Sfx.tone(988, 0.1, 'sine', 0.06); Sfx.tone(1319, 0.14, 'sine', 0.06, 0.1);
    } else {
      this.queue.push(g);
      Sfx.tone(880, 0.12, 'sine', 0.05);
    }
    this.stats.spawned++;
    this.reslot();
    return g;
  }
  bounce(s){
    const g = new Group(this, s.type, ++this.gid, s.color, s.vip);
    g.hearts = 3; g.bounced = true; g.hold = 0.9;
    g.setState('leaving');
    g.path = [{ x:-60, y:DOOR.y + 4 }];
    this.groups.push(g);
    this.stats.spawned++; this.stats.full++;
    this.addText(DOOR.x + 122, DOOR.y + 12, 'Lotado!', PAL.perigo, 24);
    Sfx.tone(260, 0.18, 'triangle', 0.07, 0, 170);
    if (this.mode === 'semfim'){ this.stats.lost++; this.loseStar(); }
    return null;
  }
  spawnEndless(){
    let type = pick(ENDLESS.types), vip = false;
    if (this.elapsed > 60 && Math.random() < ENDLESS.vip){ vip = true; if (!VIP.types.includes(type)) type = pick(VIP.types); }
    this.arrive({ type, color: pick([0,1,2,3]), vip });
  }
  endlessInterval(){ return Math.max(3.5, 9 - this.elapsed / 30); }
  loseStar(){
    if (this.stars <= 0) return;
    this.stars--; this.starFlash = 1;
    this.addText(W/2, 300, 'Reputação -1 ★', PAL.perigo, 26);
    if (this.stars <= 0) this.endEndlessShift();
  }
  endEndlessShift(){
    if (this.ending) return;
    this.groups.slice().forEach(g => this.timeUpLeave(g));
    this.bia.clearActs();
    this.ending = true; this.endTimer = 2.2; this.reason = 'stars';
    Sfx.lose();
  }
  /* comandas coloridas */
  assignCmd(g){
    if (g.cmd >= 0) return g.cmd;
    if (!this.cmdFree.length) return -1;
    const i = Math.floor(Math.random() * this.cmdFree.length);
    g.cmd = this.cmdFree.splice(i, 1)[0];
    return g.cmd;
  }
  releaseCmd(g){
    if (g.cmd >= 0 && this.cmdFree.indexOf(g.cmd) < 0) this.cmdFree.push(g.cmd);
    g.cmd = -1;
  }
  reslot(){
    this.queue.forEach((g,i) => { g.slot = i; g.path = [{ x:QUEUE.x, y:QUEUE.ys[i] }]; });
  }
  fail(g, msg){
    g.boing = 0.6;
    this.addText(g.x, g.y - 60, msg, PAL.perigo, 15);
    Sfx.boing();
    return false;
  }
  seatGroup(g, t){
    if (!g || !t || g.state !== 'queue') return false;
    if (!t.open) return this.fail(g, 'Mesa fechada!');
    if (t.group) return this.fail(g, 'Mesa ocupada!');
    if (t.dirty) return this.fail(g, 'Mesa suja!');
    if (t.seats < g.size) return this.fail(g, 'Não cabe!');
    this.queue.splice(this.queue.indexOf(g), 1);
    this.reslot();
    t.group = g; g.table = t;
    g.setState('toTable');
    g.hearts = Math.min(5, g.hearts);
    g.gain(1);
    const pts = tableApproach(t);
    const ap = Math.hypot(pts[0].x-g.x, pts[0].y-g.y) <= Math.hypot(pts[1].x-g.x, pts[1].y-g.y) ? pts[0] : pts[1];
    g.path = findPath({x:g.x, y:g.y}, ap);
    g.path.push({ x:t.cx, y:t.cy + 30 });
    this.score('sit', 10, t.cx, t.cy - 40);
    if (g.color === t.color){
      this.addMoney(15);
      this.addText(t.cx, t.cy - 82, 'Combinou! +15', PAL.faixa, 16);
      this.addSparks(t.cx, t.cy, 14, CHAIRS[t.color].c);
      Sfx.ok();
    } else Sfx.blip();
    return true;
  }
  leaveCommon(g){
    if (g.table){
      g.x = tableApproach(g.table)[0].x; g.y = tableApproach(g.table)[0].y;
      g.table.group = null;
      g.table = null;
    }
    const qi = this.queue.indexOf(g);
    if (qi >= 0){ this.queue.splice(qi,1); this.reslot(); }
    this.kitchen.purge(g);
    this.bia.purgeGroup(g);
    this.releaseCmd(g);
    if (this.sel === g) this.sel = null;
    if (this.drag && this.drag.g === g) this.drag = null;
    g.setState('leaving');
    g.path = findPath({x:g.x, y:g.y}, {x:DOOR.x, y:DOOR.y});
  }
  /* salão lotado (v7.1): todas as mesas abertas com grupo e a fila com PORTA.fila grupos ou mais */
  get lotado(){ return this.queue.length >= PORTA.fila && !this.tables.some(t => t.open && !t.group); }
  angryLeave(g){
    if (g.state === 'leaving') return;
    this.stats.lost++;
    const by = g.state === 'queue' ? (g.semMesa ? 'semMesa' : 'comMesa') : ({ wantOrder:'pedido', ordered:'prato', wantBill:'conta' })[g.state];
    if (by) this.stats.lostBy[by]++;
    this.addPuff(g.x, g.y - 20, 9);
    this.addText(g.x, g.y - 50, 'Hmpf!', PAL.perigo, 22);
    const fine = 30 + (g.vip ? VIP.angry : 0);
    this.addMoney(-fine);
    this.addText(g.x, g.y - 78, '-' + fine, PAL.perigo, 18);
    if (g.vip) this.stats.vipLost++;
    g.angry = true;
    Sfx.huff();
    this.leaveCommon(g);
    if (this.mode === 'semfim' && !this.ending) this.loseStar();
  }
  timeUpLeave(g){
    if (g.state === 'leaving') return;
    this.leaveCommon(g);
  }

  /* ---------- atualização principal ---------- */
  update(dt){
    this.anim += dt;
    if (this.state !== 'playing') {
      if (this.state === 'menu' || this.state === 'intro' || this.state === 'dayend' || this.state === 'shop' || this.state === 'endlessend') this.updateFx(dt);
      return;
    }
    dt = Math.min(dt, 0.05);
    if (this.starFlash > 0) this.starFlash = Math.max(0, this.starFlash - dt);
    if (!this.ending){
      this.elapsed += dt;
      if (this.mode === 'semfim'){
        this.arrT -= dt;
        while (this.arrT <= 0 && !this.ending){
          this.spawnEndless();
          this.arrT += this.endlessInterval() * (0.85 + Math.random() * 0.3);
        }
      } else {
        this.clock -= dt;
        // com o salão lotado, a chegada da vez espera um pouco (e as seguintes andam junto)
        const s = this.schedule[this.nextIdx];
        if (s && this.elapsed >= s.t + this.atraso && this.lotado && this.portaT < PORTA.max && this.atraso < PORTA.total * this.day.time){
          this.atraso += dt; this.portaT += dt;
        } else while (this.nextIdx < this.schedule.length && this.elapsed >= this.schedule[this.nextIdx].t + this.atraso){
          this.portaT = 0;
          this.arrive(this.schedule[this.nextIdx++]);
        }
      }
    }
    this.groups.forEach(g => g.update(dt));
    this.groups = this.groups.filter(g => !g.done);
    if (this.lotado) this.stats.lotadoT += dt;
    this.bia.update(dt);
    this.dani.update(dt);
    this.kitchen.update(dt);
    this.updateFx(dt);

    if (this.mode === 'semfim'){
      if (this.ending){
        this.endTimer -= dt;
        if (this.endTimer <= 0) this.finishEndless();
      }
    } else if (!this.ending){
      if (this.clock <= 0){
        this.clock = 0;
        this.groups.slice().forEach(g => this.timeUpLeave(g));
        this.bia.clearActs();
        this.ending = true; this.endTimer = 2.0; this.reason = 'time';
        Sfx.bell();
      } else if (this.nextIdx >= this.schedule.length && this.groups.length === 0){
        this.ending = true; this.endTimer = 1.2; this.reason = 'done';
      }
    } else {
      this.endTimer -= dt;
      if (this.endTimer <= 0) this.finishDay();
    }
  }

  finishDay(){
    const d = this.day, m = Math.round(this.lucro), fat = Math.round(this.money);
    const passed = m >= d.meta;
    let stars = 0;
    if (passed) stars = 1;
    if (passed && m >= bomGoal(d)) stars = 2;
    if (m >= d.expert && this.stats.lost === 0) stars = 3;
    const prevBest = this.save.best[d.n] || 0;
    // o faturamento vai para o dinheiro acumulado, menos os ingredientes e as contas (folha e divulgação já saíram ao abrir)
    const income = fat - Math.round(this.custo) - this.contas;
    this.save.bank = Math.max(0, this.save.bank + income);
    this.save.best[d.n] = Math.max(prevBest, fat);   // o ranking da carreira soma o faturamento dos melhores dias
    this.save.stars[d.n] = Math.max(this.save.stars[d.n] || 0, stars);
    if (passed) this.save.maxDay = Math.max(this.save.maxDay, Math.min(7, d.n + 1));
    caixaAdd(this.save, { d:d.n, fat, ingr:Math.round(this.custo), contas:this.contas, folha:this.paid, div:this.paidDiv, lucro:m, meta:d.meta, ok:passed, perd:this.stats.lost, saldo:this.save.bank });
    writeSave(this.save);
    this.result = { day:d.n, money:m, fat, custo:Math.round(this.custo), contas:this.contas, div:this.paidDiv, divName:this.div ? this.div.name : '', meta:d.meta, bom:bomGoal(d), expert:d.expert, passed, stars, served:this.stats.served, lost:this.stats.lost, lostBy:this.stats.lostBy, lotadoT:Math.round(this.stats.lotadoT), atraso:Math.round(this.atraso), full:this.stats.full, chain:this.stats.chain, vip:this.stats.vip, vipLost:this.stats.vipLost, juice:this.stats.juice, juiceMiss:this.stats.juiceMiss, trash:this.stats.trash, washed:this.stats.washed, income, paid:this.paid, reason:this.reason };
    this.setState('dayend');
    if (passed) Sfx.win(); else Sfx.lose();
  }
  finishEndless(){
    const pts = Math.round(this.money);
    const income = pts - Math.round(this.custo) - this.contas;
    this.save.bank = Math.max(0, this.save.bank + income); writeSave(this.save);
    this.endless = { income, paid:this.paid, custo:Math.round(this.custo), contas:this.contas, pontos:pts, tempo:Math.floor(this.elapsed), served:this.stats.served, lost:this.stats.lost, full:this.stats.full, chain:this.stats.chain, vip:this.stats.vip, juice:this.stats.juice };
    this.setState('endlessend');
    Sfx.lose();
  }
  careerMaxDone(){
    for (let i=7;i>=1;i--) if ((this.save.stars[i] || 0) >= 1) return i;
    return 0;
  }
  /* lojinha antes do dia n (a partir do dia 2): 1 melhoria por dia, mesmo se a lojinha abrir de novo para o mesmo dia */
  goShop(n){
    this.shopNext = clamp(n || this.day.n + 1, 1, 7);
    this.shopBought = this.boughtFor === this.shopNext;
    this.salaoSel = -1; this.salaoUndo = []; this.salaoMsg = '';
    this.resetDay(this.shopNext);   // o salão ao fundo já mostra o dia que vem
    this.setState('shop');
  }
  /* equipe: mudanças à vontade na lojinha, desde que o dinheiro acumulado pague a folha do próximo dia */
  setStaff(key, val){
    const eq = this.save.equipe, old = eq[key];
    if (key === 'couvert' && val && !couvertOk(this.ponto)) return false;
    eq[key] = val;
    if (payroll(eq) > this.save.bank && payroll(eq) > payroll(Object.assign({}, eq, { [key]:old }))){ eq[key] = old; return false; }
    writeSave(this.save); this.kitchen.slots = STAFF.tonhao.levels[eq.tonhao].slots;
    Sfx.ok(); return true;
  }
  payroll(){ return payroll(this.save.equipe); }
  /* divulgação (v7): escolhida na lojinha, paga junto com a folha ao abrir o dia */
  setDivulga(id){
    const d = DIVULGA.find(x => x.id === id);
    if (!d || this.shopNext < DIVULGA_DIA || (d.cost && this.payroll() + d.cost > this.save.bank)) return false;
    this.save.divulga = id; writeSave(this.save);
    if (this.state === 'shop') this.resetDay(this.shopNext);
    Sfx.ok(); return true;
  }
  toggleDaniTask(id){
    const eq = this.save.equipe, i = eq.daniTasks.indexOf(id);
    const max = eq.dani ? STAFF.dani.levels[eq.dani].tasks : STAFF.dani.levels[1].tasks;
    if (i >= 0) eq.daniTasks.splice(i, 1);
    else if (!daniTaskOk(id, this.up)) return false;
    else if (eq.daniTasks.filter(t => daniTaskOk(t, this.up)).length < max) eq.daniTasks.push(id);
    else return false;
    writeSave(this.save); return true;
  }
  buy(id){
    const u = UPGRADES.find(x => x.id === id);
    if (!u || this.shopBought || this.up[id] || (u.req && !this.up[u.req]) || this.save.bank < u.cost) return false;
    this.save.bank -= u.cost; this.up[id] = true; this.shopBought = true; this.boughtFor = this.shopNext;
    caixaGasto(this.save, 'mel', u.cost);
    writeSave(this.save);
    Sfx.coin();
    return true;
  }
  /* salão (v7.4): refaz as mesas e os obstáculos dos caminhos quando o salão muda. Os números seguem a ordem no
     salão (tables[id-1]). No Turno sem fim, o salão é sempre o mesmo (SALAO_SEMFIM) */
  buildTables(){
    const sem = this.mode === 'semfim', sal = this.save.salao, key = sem ? 'semfim' : JSON.stringify(sal);
    if (key === this.tablesKey) return;
    const mesas = sem ? (this.semfimMesas || (this.semfimMesas = salaoAuto(SALAO_SEMFIM.map((seats, i) => ({ seats, c:i % 4 })), PONTOS[0]))) : sal.mesas;
    const defs = mesas.map((m, i) => ({ id:i + 1, cx:m.x, cy:m.y, seats:m.seats, color:m.c }));
    this.tables = defs.map(d => new Table(d));
    setObst(defs);
    this.tablesKey = key;
  }
  /* troca as mesas do salão (já validadas) e salva. A mesa marcada com `sel` (a nova, a que virou de 4) fica
     escolhida no editor. undo: guarda o arranjo de antes (compra e venda zeram o Desfazer) */
  salaoSet(mesas, undo){
    const sal = this.save.salao;
    if (undo){ this.salaoUndo.push(sal.mesas); if (this.salaoUndo.length > 20) this.salaoUndo.shift(); }
    else this.salaoUndo = [];
    sal.mesas = salaoOrdena(mesas);
    this.salaoSel = sal.mesas.findIndex(m => m.sel);
    sal.mesas.forEach(m => { delete m.sel; });
    return this.salaoSaved();
  }
  salaoNao(msg){ this.salaoMsg = msg; return false; }
  /* mesa nova com as cadeiras (2 ou 4 lugares), até o teto do ponto: entra no primeiro lugar livre, ou o salão
     é rearrumado sozinho se não houver */
  buyMesa(seats){
    const p = this.ponto, mesas = this.save.salao.mesas, price = mesaPreco(seats);
    if (salaoLugares(mesas) + seats > p.lugares) return this.salaoNao('A garagem tem lugar para ' + p.lugares + ' pessoas, no máximo.');
    if (this.save.bank < price) return this.salaoNao('Falta dinheiro.');
    const m = { x:0, y:0, seats, c:salaoCor(mesas), sel:1 }, vaga = salaoVaga(mesas, seats, p);
    const l = vaga ? mesas.concat([Object.assign(m, vaga)]) : salaoAuto(mesas.concat([m]), p);
    if (!l) return this.salaoNao('Não cabe mais mesa no salão.');
    this.save.bank -= price; caixaGasto(this.save, 'sal', price);
    Sfx.coin();
    return this.salaoSet(l);
  }
  /* 2 cadeiras a mais: a mesa de 2 vira mesa de 4 (no mesmo lugar, ou no lugar livre mais perto) */
  virarMesa(i){
    const p = this.ponto, mesas = this.save.salao.mesas, m = mesas[i];
    if (!m || m.seats !== 2) return false;
    if (salaoLugares(mesas) + 2 > p.lugares) return this.salaoNao('Passa de ' + p.lugares + ' lugares.');
    if (this.save.bank < SALAO.virar) return this.salaoNao('Falta dinheiro.');
    let l = mesas.slice(); l[i] = Object.assign({}, m, { seats:4, sel:1 });
    if (salaoProblema(l, p)) l = salaoPerto(l, i, p) || salaoAuto(l, p);
    if (!l) return this.salaoNao('Não cabe uma mesa de 4 aqui.');
    this.save.bank -= SALAO.virar; caixaGasto(this.save, 'sal', SALAO.virar);
    Sfx.coin();
    return this.salaoSet(l);
  }
  /* vende a mesa por metade do preço (o salão fica com pelo menos 1) */
  venderMesa(i){
    const mesas = this.save.salao.mesas, m = mesas[i];
    if (!m || mesas.length <= 1) return this.salaoNao('O salão precisa de pelo menos 1 mesa.');
    const v = Math.round(mesaPreco(m.seats) * SALAO.venda);
    this.save.bank += v; caixaGasto(this.save, 'sal', -v);
    Sfx.coin();
    return this.salaoSet(mesas.filter(x => x !== m));
  }
  /* editor: as cadeiras da mesa i ganham a cor c (de graça; a mesa continua escolhida e dá para desfazer) */
  pintarMesa(i, c){
    const mesas = this.save.salao.mesas, m = mesas[i];
    if (!m || !(c >= 0 && c < CHAIRS.length)) return false;
    if (m.c === c) return true;
    const l = mesas.slice(); l[i] = Object.assign({}, m, { c, sel:1 });
    return this.salaoSet(l, true);
  }
  /* editor: a mesa i vai para (x, y), se o lugar vale */
  moverMesa(i, x, y){
    const mesas = this.save.salao.mesas, m = mesas[i];
    if (!m) return false;
    const l = mesas.slice(); l[i] = Object.assign({}, m, { x, y });
    const why = salaoProblema(l, this.ponto);
    if (why) return this.salaoNao(why);
    if (x === m.x && y === m.y) return true;
    return this.salaoSet(l, true);
  }
  arrumarSalao(){
    const l = salaoAuto(this.save.salao.mesas, this.ponto);
    if (!l) return this.salaoNao('Não deu para arrumar sozinho.');
    if (JSON.stringify(l) === JSON.stringify(this.save.salao.mesas)) return true;
    return this.salaoSet(l, true);
  }
  desfazerSalao(){
    const l = this.salaoUndo.pop();
    if (!l) return false;
    this.save.salao.mesas = l; this.salaoSel = -1;
    return this.salaoSaved();
  }
  salaoSaved(){
    this.salaoMsg = '';
    writeSave(this.save);
    if (this.state === 'shop') this.resetDay(this.shopNext);   // o salão ao fundo já mostra a mudança
    else this.buildTables();
    return true;
  }
  totals(){
    let money = 0, stars = 0;
    for (let i=1;i<=7;i++){ money += this.save.best[i] || 0; stars += this.save.stars[i] || 0; }
    return { money, stars };
  }
  resetProgress(){
    this.save = normSave({});
    this.up = this.save.up; this.boughtFor = 0;
    this.buildTables();
    this.kitchen.reset(); this.dani.reset();
    writeSave(this.save);
  }

  /* ---------- entrada ----------
     pad: folga em px lógicos para o dedo (0 no mouse). Um toque que cai fora
     de tudo vai para o alvo mais próximo dentro da folga; acerto exato vence. */
  pickAt(x, y, pad){
    let best = null, bd = Infinity;
    const take = (r, hit) => { const d = rectDist(x, y, r); if (d <= (pad || 0) && d < bd){ bd = d; best = hit; } };
    for (const g of this.queue) take(queueRect(g), { k:'queue', g });
    for (const t of this.tables) take(tableRect(t), { k:'table', t });
    for (const k of STATION_KEYS){ if (k !== 'agua' || this.up.agua) take(STATIONS[k].rect, { k:'station', st:k }); }
    return best;
  }
  tableAt(x, y, pad){
    let best = null, bd = Infinity;
    for (const t of this.tables){ const d = rectDist(x, y, tableRect(t)); if (d <= (pad || 0) && d < bd){ bd = d; best = t; } }
    return best;
  }
  stationAt(x, y){
    for (const k of STATION_KEYS){
      if (k === 'agua' && !this.up.agua) continue;
      const r = STATIONS[k].rect;
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return k;
    }
    return null;
  }
  hudHit(x, y){
    if (y < 540) return null;
    if (x >= 832 && x <= 891 && y >= 542) return { k:'pause' };
    if (x >= 891 && x <= 952 && y >= 542) return { k:'sound' };
    for (let i=0;i<6;i++){
      const sx = 358 + i*52;
      if (x >= sx && x < sx + 52 && y >= 542) return { k:'slot', i };
    }
    return { k:'hud' };
  }
  tapTable(t){
    if (!t.open) return false;
    if ((t.group || t.dirty) && this.bia.enqueue({ type:'table', id:t.id })){ Sfx.tap(); this.addGlow(t); return true; }
    return false;
  }
  tapStation(k, x, y){
    if (k === 'plates'){
      // a coluna tocada manda; se ela estiver vazia, vale o prato pronto mais perto
      const pl = this.kitchen.plates;
      let i = -1;
      for (let j=0;j<4;j++) if (pl[j] && (i < 0 || Math.abs(x - PLATE_SLOTS[j].x) < Math.abs(x - PLATE_SLOTS[i].x))) i = j;
      if (i < 0) return false;
      const pid = pl[i].id;
      if (this.bia.acts.some(a => a.type === 'plate' && a.pid === pid)) return false;
      if (this.bia.enqueue({ type:'plate', pid })){ Sfx.tap(); this.addGlow(pl[i]); return true; }
      return false;
    }
    if (this.bia.enqueue({ type:k })){ Sfx.tap(); this.addGlow(k); return true; }
    return false;
  }
  onDown(x, y, pad){
    if (this.state !== 'playing') return;
    pad = pad || 0;
    const h = this.hudHit(x, y);
    if (h){
      if (h.k === 'pause') this.pause();
      else if (h.k === 'sound'){ Sfx.muted = !Sfx.muted; if (!Sfx.muted) Sfx.tap(); this.addGlow('som'); }
      else if (h.k === 'slot') { if (h.i < this.bia.acts.length){ this.bia.remove(h.i); Sfx.tap(); this.addGlow('acao' + h.i); } }
      return;
    }
    const hit = this.pickAt(x, y, pad);
    if (hit && hit.k === 'queue'){
      this.drag = { g:hit.g, sx:x, sy:y, x, y, moved:false, pad };
      return;
    }
    if (hit && hit.k === 'table'){
      if (this.sel){ const s = this.sel; this.sel = null; this.seatGroup(s, hit.t); }
      else this.tapTable(hit.t);
      return;
    }
    this.sel = null;
    if (hit) this.tapStation(hit.st, x, y);
    else if (pad) this.fx.push({ k:'tap', x, y, life:0, max:0.3 });
  }
  onMove(x, y){
    if (this.state !== 'playing') return;
    const d = this.drag, pad = d ? d.pad : 0;
    if (d){
      d.x = x; d.y = y;
      // no dedo, um tremidinho não vira arrasto (folga ~ a mesma do alvo)
      if (!d.moved && Math.hypot(x-d.sx, y-d.sy) > Math.max(9, pad)) d.moved = true;
    }
    if (d && d.moved){
      const t = this.tableAt(x, y, pad);
      this.hover = t;
      this.hoverOk = !!(t && t.free && t.seats >= d.g.size);
    } else if (this.sel){
      const t = this.tableAt(x, y);
      this.hover = t; this.hoverOk = !!(t && t.free && t.seats >= this.sel.size);
    } else this.hover = null;
  }
  onUp(x, y){
    const d = this.drag;
    this.drag = null; this.hover = null;
    if (!d || this.state !== 'playing') return;
    if (d.moved){
      const t = this.tableAt(x, y, d.pad);
      if (t) this.seatGroup(d.g, t);
      else { d.g.boing = 0.4; }
    } else {
      this.sel = (this.sel === d.g) ? null : d.g;
      Sfx.tap();
      this.addGlow(d.g);
    }
  }
}

