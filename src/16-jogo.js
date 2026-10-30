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
    this.tablesKey = ''; this.salaoMsg = ''; this.cursoMsg = ''; this.salaoSel = -1; this.estoqueSel = -1; this.salaoUndo = [];
    this.buildTables();
    this.bia = new Waitress(this);
    this.kitchen = new Kitchen(this);
    this.dani = new Helper(this);
    this.fx = [];
    this.sel = null; this.drag = null; this.hover = null; this.hoverOk = false;
    this.cam = CALCADA.w;   // onde o mundo começa na tela larga (v7.6: a calçada inteira à vista, sem rolar)
    this.shopNext = 1;
    this.soundBtnT = 0;
    this.mode = 'carreira';
    this.conversa = null;   // Modo História (v8.7): a conversa em andamento (19-conversa.js)
    this.treino = null; this.salvo = null;   // Missão zero (v8.2): o passo a passo e o save de verdade, guardado enquanto ela dura
    this.resetDay(1);
  }
  setState(s){ this.state = s; if (this.hooks.state) this.hooks.state(s); }
  get proxDia(){ return this.save.dia; }   // campanha (v8.3): o próximo dia da carreira
  get ponto(){ return pontoOf(this.save.salao.ponto); }
  /* os cursos do Tonhão que valem no modo (v8.6.9): na Missão zero só o PF e a coxinha; no Turno sem fim, os 4 básicos */
  get cursos(){ return this.mode === 'treino' ? {} : this.mode === 'semfim' ? CURSOS_SEMFIM : this.save.cursos; }
  get bebida(){ return bebidaOf(this.ponto); }   // o que se serve na espera (v7.7)

  resetDay(n, treino){
    if (!treino) this.sairTreino();
    this.mode = treino ? 'treino' : n === 0 ? 'semfim' : 'carreira';
    this.day = treino ? TREINO : n === 0 ? ENDLESS : diaOf(n);
    this.money = 0; this.custo = 0; this.contas = 0; this.paidDiv = 0; this.conserto = 0; this.pontos = 0;
    this.avals = [];   // avaliações do dia (v8.4): { r: as notas dos critérios, txt: o comentário }; entram no save no fim do dia
    // imprevistos (v8): o sorteio do dia (feito ao começar o dia, e guardado até ele acabar) diz o clima e o que quebra
    const so = n && this.save.manut.sorteio && this.save.manut.sorteio.d === n ? this.save.manut.sorteio : null;
    this.clima = so ? so.clima : '';
    this.quebras = so ? so.quebra.map(q => ({ id:q.id, t:q.f * this.day.time, on:false, fixed:false })) : [];
    this.usos = { fogao:0, geladeira:0, cafeteira:0 };
    // divulgação (v7, do dia 3 em diante na carreira): quanto da freguesia do dia aparece
    this.div = divulgaAberta(n) ? divulgaOf(this.save.divulga) : null;
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
    this.trash = 0; this.trituraT = 0; this.paid = 0; this.unpaid = []; this.aberto = false;
    this.maq = []; this.maqId = 0;   // pedidos do tablet da espera na máquina de suco: { id, group, n, t (preparo que falta) }
    this.retirada = []; this.prateleira = []; this.marmitaId = 0; this.efood = 0;   // v8.6: os entregadores no balcão, as marmitas na prateleira e a parte da Efood
    this.bia.reset();
    this.dani.reset();
    this.fx = [];
    this.stats = { served:0, lost:0, chain:0, spawned:0, full:0, vip:0, vipLost:0, juice:0, juiceMiss:0, trash:0, washed:0, emptied:0, sucoEsp:0, crit:0, consertos:0, quebras:0, lostBy:{ semMesa:0, comMesa:0, pedido:0, prato:0, conta:0, retirada:0 }, lotadoT:0, marmitas:0, esfriou:0 };
    this.lastKind = null; this.chainN = 0;
    this.ending = false; this.endTimer = 0; this.reason = '';
    this.sel = null; this.drag = null; this.hover = null;
    this.cam = CALCADA.w;
    this.schedule = n === 0 || treino ? [] : this.buildSchedule(this.day);
    this.nextIdx = 0;
    this.result = null;
    this.bannerT = 0;
  }
  buildSchedule(day){
    const out = [];
    const lug = this.tables.filter(t => t.open).reduce((a, t) => a + t.seats, 0);
    const cl = CLIMA[this.clima];
    // a nota do Gurugol (v8.4) traz mais ou menos gente
    const N = Math.max(3, Math.round(day.groups * this.divF * movimentoSalao(lug) * (cl ? cl.groups : 1) * avalMovimento(this.save.aval, this.ponto) * vegMov(this.cursos))), vipP = (day.vip || 0) * (this.div ? this.div.vip : 1);
    const gap = day.speed * day.time / N;
    let t = 3;
    const forced = day.nu ? randi(1, Math.min(3, N-1)) : -1;
    const forcedVip = day.vip && !day.nu ? randi(1, Math.min(3, N-1)) : -1;
    const colors = this.tables.map(x => x.color);
    for (let i=0;i<N;i++){
      let type = (i === forced) ? day.nu : pick(day.types);
      if (day.tipo && i !== forced && Math.random() < day.tipoP) type = day.tipo;   // o dia da semana (v8.3, do dia 8 em diante)
      if (cl && i !== forced && Math.random() < cl.tipoP) type = cl.tipo;   // chuva: entregadores; feriado: famílias
      let vip = false;
      if (day.vip && (i === forcedVip || Math.random() < vipP)){
        if (!VIP.types.includes(type)) type = pick(VIP.types);
        vip = true;
      }
      out.push({ t, type, color: pick(colors.concat([0,1,2,3])), vip });
      t += gap * (0.7 + Math.random()*0.6);
    }
    // só AVAL.porDia grupos sorteados do dia avaliam no Gurugol (quem fica para o fim do dia não avalia)
    const idx = out.map((_, i) => i);
    for (let k = 0; k < Math.min(AVAL.porDia, out.length); k++) out[idx.splice(randi(0, idx.length - 1), 1)[0]].av = true;
    return out;
  }
  startDay(n){ this.sortear(n); this.resetDay(n); this.setState('intro'); }
  /* imprevistos do dia n (v8, carreira): clima (do dia 3) e quebras (do dia 4), sorteados uma vez e guardados no save
     até o dia acabar (recomeçar o dia não sorteia de novo; a revisão na lojinha tira a quebra do equipamento) */
  sortear(n){
    const m = this.save.manut;
    if (!MANUT.on || !n){ delete m.sorteio; return; }
    if (m.sorteio && m.sorteio.d === n) return;
    let clima = '';
    if (n >= CLIMA_DIA){ const r = Math.random(); if (r < CLIMA.chuva.chance) clima = 'chuva'; else if (r < CLIMA.chuva.chance + CLIMA.feriado.chance) clima = 'feriado'; }
    const quebra = n >= MANUT.dia ? MANUT.equip.filter(q => Math.random() < manutChance(m[q.id])).map(q => ({ id:q.id, f:rand(MANUT.quando[0], MANUT.quando[1]) })) : [];
    m.sorteio = { d:n, clima, quebra };
    writeSave(this.save);
  }
  /* equipamento quebrado agora (e sem conserto) */
  quebrado(id){ return this.quebras.some(q => q.id === id && q.on && !q.fixed); }
  get manut(){ return this.save.manut; }
  /* conserto de emergência (v8): um toque na plaquinha chama o técnico. Sai do dinheiro acumulado na hora (só do que
     sobra além da folha do dia, que fica reservada), conta no lucro do dia e no caixa (manutenção); o equipamento volta a 100% e não quebra de novo se o dia recomeçar */
  consertar(id){
    const q = this.quebras.find(x => x.id === id && x.on && !x.fixed), eq = manutOf(id);
    if (!q || !eq) return false;
    if (!DEV.on && this.save.bank - this.paid - this.paidDiv < eq.emerg){ this.addText(eq.badge.x, eq.badge.y - 26, 'Falta dinheiro!', PAL.perigo, 14); Sfx.boing(); return false; }
    q.fixed = true; this.manut[id] = 1;
    const so = this.manut.sorteio;
    if (so) so.quebra = so.quebra.filter(x => x.id !== id);
    if (!DEV.on){ this.conserto += eq.emerg; this.save.bank -= eq.emerg; caixaGasto(this.save, 'man', eq.emerg); }
    writeSave(this.save);
    this.stats.consertos++;
    this.addText(eq.badge.x, eq.badge.y - 26, eq.name + ' consertado! -' + eq.emerg, PAL.ok, 15);
    this.addSparks(eq.badge.x, eq.badge.y, 10, PAL.mostarda);
    Sfx.coin();
    return true;
  }
  /* revisão na lojinha: volta a 100% e tira a quebra já sorteada para o equipamento */
  revisar(id){
    const e = this.manut[id], v = manutPreco(id, e);
    if (!manutOf(id) || !v || (!DEV.on && this.save.bank < v)) return false;
    if (!DEV.on){ this.save.bank -= v; caixaGasto(this.save, 'man', v); }
    this.manut[id] = 1;
    const so = this.manut.sorteio;
    if (so) so.quebra = so.quebra.filter(q => q.id !== id);
    writeSave(this.save);
    if (this.state === 'shop') this.resetDay(this.shopNext);
    Sfx.coin(); return true;
  }
  revisarTudo(){ let ok = false; MANUT.equip.forEach(q => { if (this.revisar(q.id)) ok = true; }); return ok; }
  /* gasto do dia (v8): base + uso; quebrado e sem conserto, perde mais 10 pontos */
  desgastar(){
    if (!MANUT.on || this.mode !== 'carreira') return;
    const m = this.manut;
    MANUT.equip.forEach(q => {
      if (this.quebras.some(x => x.id === q.id && x.fixed)) return;   // consertado hoje: fica novo
      const broke = this.quebras.some(x => x.id === q.id && x.on);
      m[q.id] = clamp(m[q.id] - (q.base + q.uso * this.usos[q.id] + (broke ? 10 : 0)) / 100, 0, 1);
    });
  }
  startEndless(){ this.resetDay(0); this.setState('intro'); }
  /* Missão zero (v8.2): o treino joga com o save de um jogador novo (kit da Garagem, sem melhorias nem equipe), que
     nunca se grava; o de verdade fica guardado em `salvo` e volta ao sair. Começa direto, sem a introdução do dia */
  startTreino(){
    if (!this.salvo) this.salvo = this.save;
    this.save = Object.assign(normSave({}), { _treino:true });
    this.up = this.save.up;
    this.resetDay(0, true);
    this.treino = new Treino(this);
    this.setState('playing');
  }
  sairTreino(){
    if (!this.salvo) return;
    this.save = this.salvo; this.salvo = null; this.up = this.save.up; this.treino = null;
  }
  /* "Pular tutorial": sai da Missão zero, marca como feita (não volta a abrir sozinha) e vai ao menu */
  pularTreino(){
    this.sairTreino();
    this.save.treino = true; writeSave(this.save);
    this.setState('menu');
    Sfx.tap();
  }
  /* último passo: a Missão zero fica marcada como feita no save de verdade */
  acabouTreino(){
    this.sairTreino();
    this.save.treino = true; writeSave(this.save);
    this.setState('treinoend');
    Sfx.win();
  }
  get treinoSegura(){ return !!(this.treino && this.treino.segura); }
  /* ao abrir, a folha e a divulgação do dia ficam reservadas (desde a v8.2.2, só saem do dinheiro acumulado no fim do dia);
     o que não couber no dinheiro sai (a divulgação vira boca a boca, depois couvert, som, TV, Dani e aumento do Tonhão).
     v8.3: com a chave da folha desligada (save.corta), nada sai: paga tudo no fim do dia, e o caixa pode ficar negativo */
  payDay(){
    const eq = this.save.equipe; this.unpaid = [];
    const divCost = () => this.div ? this.div.cost : 0;
    while (this.save.corta && payroll(eq) + divCost() > this.save.bank){
      if (divCost()){
        this.unpaid.push(this.div.name); this.save.divulga = 'boca';
        this.div = divulgaOf('boca'); this.divF = rand(this.div.groups[0], this.div.groups[1]);
        this.schedule = this.buildSchedule(this.day);
      }
      else { const n = folhaCorta(eq); if (!n) break; this.unpaid.push(n); }
    }
    this.paid = payroll(eq); this.paidDiv = divCost(); this.aberto = true;
    this.contas = contasDia(this.tables, this.ponto);
    writeSave(this.save);
    this.kitchen.slots = STAFF.tonhao.levels[eq.tonhao].slots;
    this.dani.reset();
  }
  begin(){
    this.payDay(); this.setState('playing');
    if (this.unpaid.length) this.addText(TW/2 - this.cam, 300, 'Sem dinheiro para pagar: sem ' + listaE(this.unpaid) + ' hoje', PAL.perigo, 20);
    // os pratos limpos são contados do dia 3 em diante: o lembrete da louça, no balão branco, logo na abertura
    // (na campanha, só nos dias 3 a 5, enquanto o jogador se acostuma; no Turno sem fim, sempre)
    if (isFinite(this.kitchen.clean) && (this.mode !== 'carreira' || this.day.n <= 5)) this.fx.push({ k:'text', box:true, aviso:'pratos', x:TW/2 - this.cam, y:250, vy:-6, life:3.5, max:3.5, text:'Não se esqueça de lavar os pratos!', color:PAL.faixa, size:16 });
  }
  /* lucro do dia (a meta): faturamento − ingredientes − contas − folha − divulgação */
  get fixo(){ return this.contas + this.paid + this.paidDiv + this.conserto; }
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
          const tx = 120 - this.cam, ty = 566, dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx,dy) || 1;
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
  /* v8.3.8: cada ação da Bia rende pontos de atendimento (PONTOS_ACAO, mais a corrente), e não dinheiro; din é o que o
     cliente paga por ela (a conta, o cafezinho, o suco), que vai para o dinheiro do dia */
  score(kind, x, y, din, grp){
    let bonus = 0;
    if (kind === this.lastKind) this.chainN++; else { this.chainN = 1; this.lastKind = kind; }
    if (this.chainN >= 2) bonus = Math.min(160, 10 * Math.pow(2, this.chainN - 2));
    if (bonus && grp) grp.corrente = true;   // a mesa atendida em corrente avalia melhor a agilidade (v8.4)
    this.stats.chain = Math.max(this.stats.chain, this.chainN);
    const p = PONTOS_ACAO[kind] || 0;
    this.pontos += p + bonus;
    if (din){ this.addMoney(din); this.addText(x, y, '+R$ ' + din, PAL.ok, 18); }
    else this.addText(x, y, '+' + p + ' pts', PAL.faixa, 15);
    if (bonus){
      this.addText(x, y - 22, 'Corrente ×' + this.chainN + '! +' + bonus + ' pts', PAL.alerta, 16);
      this.addSparks(x, y, 6, PAL.alerta);
    }
  }
  collectBill(g, t){
    // v8.3.8: os corações viram gorjeta (no máximo +10%; com 1 ou 2, desconto), mais a da executiva e a do VIP;
    // v8.5.2: o suco e o cafezinho da mesa entram aqui também, pelo preço (bebConta)
    const amount = Math.round(g.bill * (1 + GORJETA[g.hearts] + g.T.tip + (g.vip ? VIP.tip : 0))) + g.bebConta;
    this.score('bill', t.cx, t.cy - 50, amount, g);
    if (this.treino) this.treino.conta = { v:amount, h:g.hearts, base:g.bill, beb:g.bebConta };   // a gorjeta é só da comida (base)
    if (g.sucoConta){ const v = this.bebida.preco * g.sucoConta; this.addMoney(v); this.addText(t.cx - 34, t.cy - 100, 'Suco da espera +' + v, PAL.alerta, 14); }
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
        this.pontos += VIP.perfect;
        this.addText(t.cx, t.cy - 100, 'VIP satisfeito! +' + VIP.perfect + ' pts', PAL.faixa, 17);
        this.addSparks(t.cx, t.cy - 40, 12, PAL.mostarda);
      }
    }
    this.addCoins(t.cx, t.cy, Math.min(8, 3 + g.hearts));
    Sfx.coin();
    this.stats.served++;
    this.cinco(g);
    this.avaliar(g, t.cx, t.cy - 146);
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
  /* Turno sem fim: a cada 8 grupos que saem com 5 corações, volta 1 estrela */
  cinco(g){
    if (this.mode !== 'semfim' || g.hearts !== 5) return;
    this.five++;
    if (this.five >= 8){
      this.five = 0;
      if (this.stars < 5){ this.stars++; this.starFlash = 1; this.addText(TW/2 - this.cam, 300, '+1 estrela!', PAL.mostarda, 28); Sfx.win(); }
    }
  }

  /* ---------- marmitas e fila de retirada (v8.6) ---------- */
  /* há entregador no dia (no Turno sem fim, sempre): o balcão de retirada aparece e dá para adiantar marmitas */
  get marmitaOk(){ return this.mode === 'semfim' || this.retirada.length > 0 || this.schedule.some(s => s.type === 'entregador'); }
  reslotRetirada(){ this.retirada.forEach((g,i) => { g.slot = i; g.path = [Object.assign({}, RETIRADA.fila[i])]; }); }
  /* todas as marmitas do dia, onde estiverem: { m (a marmita ou o pedido na cozinha), onde } */
  marmitas(){
    const k = this.kitchen, out = [];
    k.queue.concat(k.cooking).forEach(t => { if (t.marmita) out.push({ m:t, onde:'fogao' }); });
    k.plates.forEach(p => { if (p && p.kind === 'marmita') out.push({ m:p, onde:'pronta' }); });
    [this.bia, this.dani].forEach(q => q.hands.forEach(h => { if (h.kind === 'marmita') out.push({ m:h, onde:'mao', quem:q }); }));
    this.prateleira.forEach(m => out.push({ m, onde:'prateleira' }));
    return out;
  }
  /* marmitas sem dono (adiantadas ou de quem foi embora), no fogão, prontas, na mão ou na prateleira */
  get marmitasLivres(){ return this.marmitas().filter(o => !o.m.dono).length; }
  /* o entregador chegou: fica com uma marmita sem dono do prato dele (a da prateleira primeiro; depois a que está a
     caminho, pronta ou no fogão); se não houver, a encomenda vai pela Efood ao Tonhão */
  marmitaPara(g){
    const ord = { prateleira:0, mao:1, pronta:2, fogao:3 };
    const l = this.marmitas().filter(o => !o.m.dono && o.m.dish === g.dish).sort((a,b) => ord[a.onde] - ord[b.onde]);
    if (l.length) l[0].m.dono = g;
    else this.kitchen.submitMarmita(g.dish, g);
  }
  /* o entregador foi embora (ou levou outra): a encomenda que nem começou sai do fogão; o resto fica sem dono */
  soltaMarmitas(g){
    const k = this.kitchen;
    k.queue = k.queue.filter(t => !(t.marmita && t.enc && t.dono === g));
    this.marmitas().forEach(o => { if (o.m.dono === g) o.m.dono = null; });
  }
  /* o entregador no balcão pega a marmita dele na prateleira (ou uma sem dono do prato dele, que chegou antes) */
  pegaPrateleira(g){
    let i = this.prateleira.findIndex(m => m.dono === g);
    if (i < 0){ i = this.prateleira.findIndex(m => !m.dono && m.dish === g.dish); if (i >= 0) this.soltaMarmitas(g); }
    if (i < 0) return false;
    this.entregaMarmita(g, this.prateleira.splice(i, 1)[0]);
    return true;
  }
  /* a Bia (ou a Dani) chega ao balcão com marmitas: a do entregador que já está no balcão vai direto para ele; a
     encomenda de quem ainda está chegando e as sem dono (até MARMITA.vagas) ficam na prateleira. Devolve quantas deixou */
  levaMarmitas(p){
    let n = 0, prat = 0;
    p.hands.filter(h => h.kind === 'marmita').forEach(m => {
      const d = m.dono;
      if (d && d.state === 'retirada' && !d.path.length) this.entregaMarmita(d, m);
      else if (d || this.prateleira.filter(x => !x.dono).length < MARMITA.vagas){ this.prateleira.push(m); prat++; }
      else return;
      p.hands.splice(p.hands.indexOf(m), 1); n++;
    });
    if (prat){ this.addText(p.x, p.y - 82, 'Na prateleira!', PAL.faixa, 14); Sfx.blip(); }
    return n;
  }
  /* o entregador leva a marmita e paga: o preço do prato com a gorjeta dos corações; a Efood fica com MARMITA.efood do preço */
  entregaMarmita(g, m){
    const preco = precoPrato(m.dish, this.ponto, this.cursos), bruto = Math.round(preco * (1 + GORJETA[g.hearts])), taxa = Math.round(preco * MARMITA.efood);
    const x = g.x, y = g.y;
    this.efood += taxa; this.stats.marmitas++; this.stats.served++;
    g.pratoQ = m.q || 0; if (m.crit) g.capricho = true;
    this.score('marmita', x, y - 76, bruto - taxa, g);
    this.addText(x, y - 98, 'Efood −' + taxa, PAL.alerta, 13);
    this.addCoins(x, y - 30, 3);
    Sfx.coin();
    this.cinco(g);
    this.avaliar(g, x, y - 128);
    g.paid = true;
    const i = this.retirada.indexOf(g);
    if (i >= 0){ this.retirada.splice(i, 1); this.reslotRetirada(); }
    g.setState('leaving');
    g.path = [{ x:DOOR.x, y:DOOR.y }];
  }
  /* adiantar (o "+ marmita" da janela de pedidos): uma marmita de MARMITA.prato sem dono, até MARMITA.vagas */
  adiantar(x, y){
    if (!this.marmitaOk || this.marmitasLivres >= MARMITA.vagas) return false;
    this.kitchen.submitMarmita(MARMITA.prato, null);
    this.addText(x, y, 'Marmita adiantada!', PAL.faixa, 14); Sfx.ok();
    return true;
  }
  /* a marmita sem dono esfria em MARMITA.validade s (contados desde que ficou pronta): vai para o lixo */
  esfriar(dt){
    this.prateleira.forEach(m => { m.age += dt; });
    [this.bia, this.dani].forEach(q => q.hands.forEach(h => { if (h.kind === 'marmita') h.age += dt; }));
    const fria = m => m && !m.dono && m.age >= MARMITA.validade, k = this.kitchen;
    const joga = (x, y) => { this.stats.esfriou++; this.addTrash(1); this.addText(x, y, 'Esfriou!', PAL.perigo, 14); Sfx.tone(220, 0.15, 'triangle', 0.05); };
    k.plates.forEach((p, i) => { if (p && p.kind === 'marmita' && fria(p)){ k.plates[i] = null; joga(PLATE_SLOTS[i].x, PLATE_SLOTS[i].y - 34); } });
    this.prateleira.filter(fria).forEach(m => { joga(RETIRADA.vagas[Math.min(2, this.prateleira.indexOf(m))], RETIRADA.balcao.y - 20); this.prateleira.splice(this.prateleira.indexOf(m), 1); });
    [this.bia, this.dani].forEach(q => q.hands.filter(fria).forEach(h => { q.hands.splice(q.hands.indexOf(h), 1); joga(q.x, q.y - 82); }));
  }

  /* ---------- fluxo de grupos ---------- */
  /* chegada de um grupo: se a fila estiver cheia, o grupo olha, diz "Lotado!" e vai embora */
  arrive(s){
    // o entregador (v8.6) vai para a fila de retirada, que tem MARMITA.fila lugares
    if (s.type === 'entregador' ? this.retirada.length >= MARMITA.fila : this.queue.length >= this.ponto.espera) return this.bounce(s);
    return this.spawn(s);
  }
  spawn(s){
    s = s || this.schedule[this.nextIdx++];
    const g = new Group(this, s.type, ++this.gid, s.color, s.vip);
    g.avalia = !!s.av;
    this.groups.push(g);
    if (g.retira){
      this.retirada.push(g); g.setState('retirada'); this.reslotRetirada();
      this.marmitaPara(g);
      this.addText(RETIRADA.fila[0].x, DOOR.y + 4, 'Pedido na Efood!', PAL.alerta, 16);
      Sfx.tone(784, 0.08, 'square', 0.03); Sfx.tone(1046, 0.1, 'square', 0.03, 0.08);
      this.stats.spawned++;
      return g;
    }
    if (g.vip){
      // VIP fura a fila: entra logo depois dos outros VIPs que já estão esperando
      let i = 0;
      while (i < this.queue.length && this.queue[i].vip) i++;
      this.queue.splice(i, 0, g);
      this.addText(QUEUE.x, DOOR.y + 12, 'VIP chegou!', PAL.mostarda, 22);
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
    g.x = QUEUE.x - 60;   // chega à calçada, vê a espera cheia e volta para a rua
    g.setState('leaving');
    g.path = [{ x:DOOR.x, y:DOOR.y + 4 }];
    this.groups.push(g);
    this.stats.spawned++; this.stats.full++;
    this.addText(QUEUE.x, DOOR.y + 12, 'Lotado!', PAL.perigo, 24);
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
    this.addText(TW/2 - this.cam, 300, 'Reputação -1 ★', PAL.perigo, 26);
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

  /* ---------- bebida da espera (v7.5; o que se serve vem do ponto desde a v7.7) ---------- */
  maqPedir(g, n){
    const b = this.bebida;
    this.maq.push({ id:++this.maqId, group:g, n, t:b.prep });
    this.addText(g.x, g.y - 96, b.pede(n), PAL.alerta, 14);
    Sfx.tone(1046, 0.06, 'sine', 0.04); Sfx.tone(1318, 0.08, 'sine', 0.04, 0.06);
    if (b.prep <= 0) this.addGlow('maquina');   // água: já dá para encher
  }
  /* quem saiu da espera (sentou ou foi embora) cancela o que a máquina ainda não entregou na mão de ninguém */
  maqCancela(g){ this.maq = this.maq.filter(o => o.group !== g); }
  /* pedidos prontos, do mais antigo para o mais novo */
  maqPronto(){ return this.maq.filter(o => o.t <= 0); }
  /* pronto e ninguém indo buscar: o primeiro que a Bia ainda não vai pegar e a Dani não foi buscar */
  maqLivre(){
    const nBia = this.bia.acts.filter(a => a.type === 'maquina' && a.leg !== 2).length;
    return this.maqPronto().filter(o => !o.dani).slice(nBia)[0] || null;
  }
  /* tira k copos do pedido (que some quando acaba) */
  maqTirar(o, k){ o.n -= k; if (o.n <= 0) this.maq = this.maq.filter(q => q !== o); }
  /* onde entregar o suco de quem pediu (lá fora ou, se já sentou, na mesa); null se o grupo foi embora */
  sucoAp(g, from){
    if (!g || g.done || g.state === 'leaving') return null;
    if (g.state === 'queue') return esperaAp(g.slot);
    if (!g.table) return null;
    const p = tableApproach(g.table);
    return Math.hypot(p[0].x-from.x, p[0].y-from.y) <= Math.hypot(p[1].x-from.x, p[1].y-from.y) ? p[0] : p[1];
  }
  /* n copos entregues: atender devolve 1 coração, quem ainda espera bebe e perde a paciência mais devagar;
     os copos vão para a conta do grupo (a água da Garagem é de graça) e os ingredientes saem agora */
  entregaSuco(g, n, x, y){
    const b = this.bebida;
    g.drink(n); g.gain(1);
    if (b.preco) g.sucoConta += n;
    this.custo += b.ingred * n; this.stats.sucoEsp += n;
    this.addText(x, y - 86, b.entrega(n), PAL.alerta, 15);
    if (b.preco) this.addText(x, y - 108, '+' + b.preco * n + ' na conta', PAL.ok, 14);
    Sfx.tone(880, 0.07, 'sine', 0.05); Sfx.tone(1175, 0.12, 'sine', 0.05, 0.07);
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
    if (this.treino && t !== this.treino.mesa) return this.fail(g, 'Procure as cadeiras ' + TREINO_COR[g.color] + '!');
    this.queue.splice(this.queue.indexOf(g), 1);
    this.reslot();
    this.maqCancela(g);
    t.group = g; g.table = t;
    g.setState('toTable');
    g.hearts = Math.min(5, g.hearts);
    g.gain(1);
    const pts = tableApproach(t);
    const ap = Math.hypot(pts[0].x-g.x, pts[0].y-g.y) <= Math.hypot(pts[1].x-g.x, pts[1].y-g.y) ? pts[0] : pts[1];
    g.path = findPath({x:g.x, y:g.y}, ap);
    g.path.push({ x:t.cx, y:t.cy + 30 });
    this.score('sit', t.cx, t.cy - 40, 0, g);
    if (g.color === t.color){
      g.corCerta = true;
      this.pontos += PONTOS_ACAO.cor;
      this.addText(t.cx, t.cy - 82, 'Combinou! +' + PONTOS_ACAO.cor + ' pts', PAL.faixa, 16);
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
    const ri = this.retirada.indexOf(g);
    if (ri >= 0){ this.retirada.splice(ri,1); this.reslotRetirada(); }
    if (g.retira) this.soltaMarmitas(g);
    this.kitchen.purge(g);
    this.bia.purgeGroup(g);
    this.dani.hands = this.dani.hands.filter(h => h.group !== g);
    this.maqCancela(g);
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
    const by = g.state === 'queue' ? (g.semMesa ? 'semMesa' : 'comMesa') : ({ wantOrder:'pedido', ordered:'prato', eating:'prato', wantBill:'conta', retirada:'retirada' })[g.state];
    if (by) this.stats.lostBy[by]++;
    this.addPuff(g.x, g.y - 20, 9);
    this.addText(g.x, g.y - 50, 'Hmpf!', PAL.perigo, 22);
    const fine = this.multa(g);
    this.addMoney(-fine);
    this.addText(g.x, g.y - 78, '-' + fine, PAL.perigo, 18);
    if (g.vip) this.stats.vipLost++;
    g.angry = true;
    this.avaliar(g, g.x, g.y - 120);
    Sfx.huff();
    this.leaveCommon(g);
    if (this.mode === 'semfim' && !this.ending) this.loseStar();
  }
  /* avaliação no Gurugol (v8.4, só na carreira): o grupo que sai (pago ou bravo) dá a nota de cada critério (AVAL) e deixa
     um comentário curto, num balãozinho sobre ele */
  avaliar(g, x, y){
    if (this.mode !== 'carreira' || !g.avalia) return;
    const A = AVAL, eq = this.save.equipe, bravo = g.angry ? (g.retira ? 'retirada' : g.state === 'queue' ? 'fila' : 'mesa') : '';
    const encanta = A.humor.encanta + (g.corCerta ? A.bonus.cor : 0) + (g.corrente ? A.bonus.corrente : 0) + (g.capricho ? A.bonus.crit : 0);
    // v8.6.6: a decoração à mostra e a toalha da mesa em que o grupo sentou (g.table ainda vale aqui, também para quem sai bravo)
    const decor = DECOR.filter(d => decorOn(this, d.id)).map(d => d.id), toalha = !!(g.table && g.table.toalha);
    if (toalha) decor.push('toalha');
    const amb = A.amb.base + (eq.tv ? A.amb.tv : 0) + (eq.som ? A.amb.som : 0) + (this.up.maquina ? A.amb.maquina : 0) + (this.up.ventilador ? A.amb.ventilador : 0) +
      (g.coffee ? A.amb.cafe : 0) + (eq.couvert ? A.amb.couvert : 0) + (this.trashFull ? A.amb.lixo : 0) +
      decor.reduce((a, id) => a + (id === 'toalha' ? A.amb.toalha : A.amb[decorOf(id).grupo === 'plantas' ? 'planta' : 'rosa']), 0);
    // o entregador (v8.6): a espera no balcão conta na espera e na agilidade
    // v8.6.7: cada um avalia só o que viveu (null: não viu). Bravo: da fila, só a espera; antes do pedido, mais agilidade e ambiente;
    // depois do pedido, sem comer, mais o cardápio; o entregador bravo não levou a marmita. Quem comeu (ou pagou) dá os 5
    const st = g.state, comeu = !bravo || st === 'eating' || st === 'wantBill';
    const ve = g.retira ? [1, 1, !bravo, 0, 0] : !bravo || comeu ? [1, 1, 1, 1, 1] : st === 'queue' || st === 'toTable' ? [1, 0, 0, 0, 0] : st === 'wantOrder' ? [1, 1, 0, 0, 1] : [1, 1, 0, 1, 1];
    const s = [5 - A.porCoracao * (g.retira ? g.perdMesa : g.perdFila), bravo ? 1 : 5 - A.porCoracao * g.perdMesa, g.pratoQ || 1, g.semVeg ? 1 : avalMenu(this.cursos), amb]
      .map((v, i) => ve[i] ? clamp(Math.round(v * 10) / 10, 1, 5) : null);
    // v8.6.4: a nota no Gurugol fica na escala do ponto (o serviço 5 vale o teto), mais o humor de quem avalia; v8.6.7: o humor
    // e a folga são fração da faixa do ponto (teto − 1), e a cor certa, a corrente e o caprichado aumentam a chance de encantar
    const teto = avalTeto(this.ponto), faixa = teto - 1, lim = Math.min(5, teto + A.humor.folga * faixa);
    const h = bravo ? 0 : (rand(-A.humor.var, A.humor.var) + (Math.random() < encanta ? rand(A.humor.extra[0], A.humor.extra[1]) : 0)) * faixa;
    const r = s.map(v => v == null ? null : clamp(Math.round((avalEscala(v, teto) + h) * 10) / 10, 1, lim));
    const txt = avalComentario(s, bravo, this.trashFull, this.ponto.nivel, decor, g.fria, g.semVeg), nota = avalNota(r), f = avalFrac(nota, teto);
    this.avals.push({ r, s, txt, k:g.type, v:g.vip });
    // balãozinho branco (sobe devagar, acima dos textos da conta)
    this.fx.push({ k:'text', box:true, x, y, vy:-12, life:2.8, max:2.8, text:fmtNota(nota) + '★ ' + txt, color:f >= 0.75 ? PAL.ok : f >= 0.5 ? PAL.alerta : PAL.perigo, size:13 });
  }
  /* a nota do Gurugol agora: as do save e as do dia (null antes das AVAL.min primeiras) */
  get gurugol(){ return avalGeral(this.save.aval.concat(this.avals.map(a => a.r)).slice(-AVAL.max)); }
  get gurugolN(){ return Math.min(AVAL.max, this.save.aval.length + this.avals.length); }
  multa(g){ return MULTA + (g.vip ? VIP.angry : 0); }   // grupo que vai embora bravo (0 corações)
  /* v8.2.3: encerrar o dia no meio (Reiniciar ou Menu na pausa) não rende nada (v8.2.2), e quem está na espera ou nas
     mesas vai embora bravo, como se tivesse zerado os corações: cada grupo paga a multa, direto do dinheiro acumulado */
  get bravosSeSair(){ return this.mode === 'carreira' && this.aberto ? this.groups.filter(g => g.state !== 'leaving') : []; }
  get multaSeSair(){ return this.bravosSeSair.reduce((a, g) => a + this.multa(g), 0); }
  encerrar(){
    const gs = this.bravosSeSair, v = this.multaSeSair, d = this.day;
    this.aberto = false;
    if (!gs.length) return (this.encerrado = null);
    const antes = this.save.bank; this.save.bank = antes - v;   // v8.3: pode deixar o caixa no negativo
    this.save.caixa = normCaixa(this.save.caixa.concat([{ d:d.n, int:gs.length, mul:antes - this.save.bank, saldo:this.save.bank }]));
    writeSave(this.save);
    return (this.encerrado = { n:gs.length, vip:gs.filter(g => g.vip).length, multa:antes - this.save.bank, bank:this.save.bank });
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
    if (this.treino && this.treino.para){ this.updateFx(dt); return; }   // Missão zero: com o pop-up de explicação, o jogo espera
    if (this.starFlash > 0) this.starFlash = Math.max(0, this.starFlash - dt);
    if (!this.ending){
      this.elapsed += dt;
      if (this.mode === 'treino'){ if (this.treino) this.treino.update(dt); }
      else if (this.mode === 'semfim'){
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
    if (!this.ending) this.quebras.forEach(q => {
      if (q.on || this.elapsed < q.t) return;
      const eq = manutOf(q.id); q.on = true; this.stats.quebras++;
      this.addText(eq.badge.x, eq.badge.y - 30, eq.name + ' quebrou!', PAL.perigo, 17);
      this.addPuff(eq.badge.x, eq.badge.y, 8);
      Sfx.boing(); Sfx.tone(180, 0.25, 'sawtooth', 0.04, 0.12);
    });
    this.groups.forEach(g => g.update(dt));
    this.groups = this.groups.filter(g => !g.done);
    this.maq.forEach(o => { if (o.t > 0){ o.t -= dt; if (o.t <= 0){ Sfx.tone(1568, 0.12, 'sine', 0.05); this.addGlow('maquina'); } } });
    if (this.lotado) this.stats.lotadoT += dt;
    // v8.3.10: o Triturador mói 1 do lixo a cada TRASH.tritura segundos (o relógio só anda com lixo na lixeira)
    if (this.up.triturador && this.trash > 0){
      this.trituraT += dt;
      if (this.trituraT >= TRASH.tritura){ this.trituraT = 0; this.trash--; Sfx.noise(0.15, 0.05, 0, 300); }
    } else this.trituraT = 0;
    this.bia.update(dt);
    this.dani.update(dt);
    this.kitchen.update(dt);
    this.esfriar(dt);
    this.updateFx(dt);

    if (this.mode === 'semfim'){
      if (this.ending){
        this.endTimer -= dt;
        if (this.endTimer <= 0) this.finishEndless();
      }
    } else if (this.mode === 'treino'){
      // a Missão zero acaba no último passo do pop-up, sem relógio
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
    const d = this.day, m = Math.round(this.lucro), fat = Math.round(this.money), sv = this.save;
    const passed = m >= d.meta;
    this.aberto = false;
    let stars = 0;
    if (passed) stars = 1;
    if (passed && m >= bomGoal(d)) stars = 2;
    if (m >= d.expert && this.stats.lost === 0) stars = 3;
    // v8.2.2: só o dia completo rende. O faturamento vai para o dinheiro acumulado, menos ingredientes, contas, folha e
    // divulgação, que só são pagas agora (o conserto na hora já saiu); dia interrompido na pausa não paga nem ganha nada.
    // v8.3: tudo sai mesmo sem dinheiro (o caixa pode ficar negativo), junto com a parcela do empréstimo
    const income = fat - Math.round(this.custo) - this.contas - this.paid - this.paidDiv;
    sv.bank += income;
    sv.daniTar += this.dani.feitas;   // v8.9: o trabalho da Dani vira experiência (só o dia completo)
    const atr0 = !!sv.emp.atr, devido = this.devido, par = this.pagaParcela(), atrasou = !atr0 && !!sv.emp.atr, tomou = atr0 && !!sv.emp.atr;
    // v8.3.1: atrasou de novo (não deu para a atrasada e a do dia): o banco toma a lanchonete e a carreira acaba
    if (tomou) sv.fechou = d.n;
    this.desgastar(); delete sv.manut.sorteio;
    // campanha (v8.3): o dia seguinte vem de qualquer jeito; a meta não batida só fica sem estrelas
    sv.dia = d.n + 1; sv.estrelas += stars; sv.lucroTot += m; sv.pontosTot += Math.round(this.pontos);
    // Gurugol (v8.4): as avaliações do dia entram no save; o fim do dia mostra a nota do dia, a geral e 2 ou 3 comentários
    const avDia = avalMedias(this.avals.map(a => a.r));
    sv.aval = normAval(sv.aval.concat(this.avals.map(a => a.r)));
    sv.avalCom = normAvalCom(sv.avalCom.concat(this.avals.map(a => ({ d:d.n, n:Math.round(avalNota(a.r) * 10), t:a.txt, k:a.k, v:a.v }))));
    const ord = this.avals.slice().sort((a, b) => avalNota(b.r) - avalNota(a.r)), coment = [];
    if (ord.length) [ord[0], ord[ord.length - 1], pick(ord)].forEach(a => { if (!coment.includes(a.txt)) coment.push(a.txt); });
    this.avals = [];   // já estão no save (a nota do HUD não conta duas vezes)
    // caixa no negativo: BANCO.neg dias seguidos podem; no seguinte, o banco cobre o que falta, à força
    let forcado = 0;
    if (sv.bank >= 0 || tomou) sv.neg = 0;
    else if (++sv.neg > BANCO.neg){ forcado = Math.ceil(-sv.bank / 10) * 10; this.emprestar(forcado, true); }
    // Modo História (v8.7): o dia no azul conta no cap. 1; cumpriu o objetivo do capítulo, a conversa de depois fica pendente
    let cap = null;
    if (!tomou && sv.cap <= HISTORIA.length){
      if (sv.cap === 1 && m > 0) sv.capAzul++;
      const ob = this.capObj(sv);
      cap = { n:sv.cap, titulo:HISTORIA[sv.cap - 1].titulo, itens:ob.itens, ok:ob.ok };
      if (ob.ok) sv.conversa = 'depois';
    }
    const row = { d:d.n, fat, ingr:Math.round(this.custo), contas:this.contas, folha:this.paid, div:this.paidDiv, lucro:m, meta:d.meta, ok:passed, st:stars, perd:this.stats.lost, saldo:sv.bank };
    if (avDia) row.av = Math.round(avDia.nota * 10);
    if (forcado) row.forc = 1;
    if (atrasou) row.atr = 1;
    if (tomou) row.tom = 1;
    caixaAdd(sv, row);
    writeSave(sv);
    this.result = { daniFeitas:this.dani.feitas, day:d.n, money:m, fat, pontos:Math.round(this.pontos), custo:Math.round(this.custo), contas:this.contas, div:this.paidDiv, divName:this.div ? this.div.name : '', meta:d.meta, bom:bomGoal(d), expert:d.expert, passed, stars, served:this.stats.served, lost:this.stats.lost, lostBy:this.stats.lostBy, lotadoT:Math.round(this.stats.lotadoT), atraso:Math.round(this.atraso), full:this.stats.full, chain:this.stats.chain, vip:this.stats.vip, vipLost:this.stats.vipLost, marmitas:this.stats.marmitas, efood:this.efood, esfriou:this.stats.esfriou, sobra:this.marmitas().filter(o => o.onde !== 'fogao').length, juice:this.stats.juice, juiceMiss:this.stats.juiceMiss, sucoEsp:this.stats.sucoEsp, bebida:this.bebida.id, trash:this.stats.trash, washed:this.stats.washed, income, paid:this.paid, reason:this.reason, conserto:this.conserto, consertos:this.stats.consertos, quebras:this.quebras.filter(q => q.on).map(q => ({ id:q.id, fixed:q.fixed })), clima:this.clima, manut:Object.assign({}, this.manut), par, forcado, neg:sv.neg, emp:Object.assign({}, sv.emp), atrasou, tomou, devido, cap, aval:{ dia:avDia, geral:avalGeral(sv.aval), n:sv.aval.length, coment, teto:avalTeto(this.ponto) } };
    if (tomou){ this.setState('falencia'); Sfx.lose(); return; }
    this.setState('dayend');
    if (passed) Sfx.win(); else Sfx.lose();
  }
  finishEndless(){
    const pts = Math.round(this.pontos);   // v8.3.8: os pontos de atendimento (antes, o faturamento)
    const income = Math.round(this.money) - Math.round(this.custo) - this.contas - this.paid - this.paidDiv;
    this.save.bank = Math.max(Math.min(0, this.save.bank), this.save.bank + income); writeSave(this.save);   // não deixa o caixa abaixo de zero (nem de onde estava, se já estava no negativo)
    this.endless = { income, paid:this.paid, custo:Math.round(this.custo), contas:this.contas, pontos:pts, fat:Math.round(this.money), tempo:Math.floor(this.elapsed), served:this.stats.served, lost:this.stats.lost, full:this.stats.full, chain:this.stats.chain, vip:this.stats.vip, juice:this.stats.juice };
    this.setState('endlessend');
    Sfx.lose();
  }
  /* lojinha antes do dia n (a partir do dia 2): melhorias à vontade, se o dinheiro der (v8.6.14: sem o limite de 1 por dia; só o curso do Tonhão segue 1 por lojinha) */
  goShop(n){
    this.shopNext = Math.max(1, n || this.day.n + 1);
    if (DEV.on && this.save.bank < DEV.bank){ this.save.bank = DEV.bank; writeSave(this.save); }   // modo dev: o dinheiro não acaba
    this.salaoSel = -1; this.estoqueSel = -1; this.salaoUndo = []; this.salaoMsg = ''; this.cursoMsg = '';
    this.resetDay(this.shopNext);   // o salão ao fundo já mostra o dia que vem
    this.setState('shop');
  }
  /* equipe: mudanças à vontade na lojinha, desde que o dinheiro acumulado pague a folha do próximo dia */
  setStaff(key, val){
    const eq = this.save.equipe, old = eq[key];
    if (key === 'tonhao' && !DEV.on && (val > tonhaoNivelXp(this.save.cursos) || val < old)) return false;   // v8.8: só com a xp dos cursos, e o nível pago é definitivo
    if (key === 'dani' && !DEV.on && (val > daniNivelXp(this.save) || val < old)) return false;   // v8.9: só com a experiência, e o nível pago é definitivo
    if (key === 'couvert' && val && !couvertOk(this.ponto)) return false;
    eq[key] = val;
    if (payroll(eq) > this.save.bank && payroll(eq) > payroll(Object.assign({}, eq, { [key]:old }))){ eq[key] = old; return false; }
    writeSave(this.save); this.kitchen.slots = STAFF.tonhao.levels[eq.tonhao].slots;
    Sfx.ok(); return true;
  }
  payroll(){ return payroll(this.save.equipe); }
  /* v8.1: o que já está comprometido com a abertura do próximo dia (folha e divulgação) e o que sobra livre */
  get compromisso(){ return this.payroll() + (this.div ? this.div.cost : 0); }
  get livre(){ return this.save.bank - this.compromisso; }
  /* o que ficaria de fora ao abrir o próximo dia se gastar v agora (com a chave da folha desligada, nada) */
  cortesSe(v){ return this.save.corta ? folhaCortes(this.save.equipe, this.div, this.save.bank - (v || 0)) : []; }
  setCorta(on){ this.save.corta = !!on; writeSave(this.save); return true; }
  /* banco (v8.3): o empréstimo entra no dinheiro na hora e soma `juros` ao que se deve, em BANCO.parcelas no fim de cada
     dia. Na lojinha, um por vez e até o crédito do ponto; à força (no fim do dia, depois de BANCO.neg dias no negativo),
     soma ao que já se devia, com juros maiores, e as parcelas recomeçam */
  get parcela(){ return parcelaDe(this.save.emp, this.day.n); }
  get devido(){ return devidoDe(this.save.emp, this.day.n); }   // v8.3.1: com a atrasada, se houver
  get jurosHoje(){ return jurosDe(this.save.emp, this.day.n); }
  /* Modo História (v8.7): o objetivo do capítulo de agora, item a item ({ ok, itens:[{ txt, ok }] }); null depois do último capítulo */
  capObj(sv){
    sv = sv || this.save;
    const c = HISTORIA[sv.cap - 1];
    if (!c) return null;
    const o = c.obj, itens = [], ge = avalGeral(sv.aval), nota = ge ? Math.round(ge.nota * 10) / 10 : null;
    if (o.azul) itens.push({ txt:'Fechar ' + o.azul + ' dias no azul (' + Math.min(sv.capAzul, o.azul) + ' de ' + o.azul + ')', ok:sv.capAzul >= o.azul });
    if (o.quitar) itens.push({ txt:sv.emp.resto ? 'Quitar a reforma (faltam ' + fmt(sv.emp.resto) + ')' : 'Reforma quitada', ok:!sv.emp.resto });
    if (o.nota) itens.push({ txt:'Nota do Gurugol ' + fmtNota(o.nota) + ' (agora ' + fmtNota(ge ? ge.nota : null) + ')', ok:nota != null && nota >= o.nota });
    if (o.caixa) itens.push({ txt:fmt(o.caixa) + ' no caixa (agora ' + fmt(sv.bank) + ')', ok:sv.bank >= o.caixa });
    itens.forEach((it, i) => { it.txt = i ? it.txt.replace(/^(?!R\$)./, x => x.toLowerCase()) : it.txt; });
    return { ok:itens.every(it => it.ok), itens };
  }
  /* o objetivo numa linha: itens separados por " · ", os cumpridos com ✓ */
  capLinha(sv){
    const ob = this.capObj(sv), c = HISTORIA[(sv || this.save).cap - 1];
    return ob ? 'Capítulo ' + c.cap + ', ' + c.titulo + ': ' + ob.itens.map(it => (it.ok ? '✓ ' : '') + it.txt).join(' · ') : '';
  }
  /* o capítulo termina (a conversa de depois já tocou): o seguinte começa; ao entrar no 2, a Dani chega como aprendiz.
     Devolve true se acabaram os capítulos (cap passa de HISTORIA.length) */
  avancaCap(){
    const sv = this.save;
    sv.cap++; sv.capDia = sv.dia; sv.capAzul = 0;
    sv.conversa = sv.cap <= HISTORIA.length ? 'antes' : null;
    if (sv.cap === 2){ sv.equipe.dani = Math.max(sv.equipe.dani, 1); this.dani.reset(); }
    writeSave(sv);
    return sv.cap > HISTORIA.length;
  }
  podeEmprestar(v){ return !this.save.emp.resto && v > 0 && v <= this.ponto.credito; }
  emprestar(v, forcado){
    const sv = this.save;
    if (!forcado && !this.podeEmprestar(v)) return false;
    sv.bank += v; caixaGasto(sv, 'emp', v);
    // v8.3.2: o saldo cresce de v e a amortização volta a ser o saldo ÷ BANCO.parcelas; à força, os juros do saldo todo sobem
    const resto = sv.emp.resto + v;
    sv.emp = normEmprestimo({ resto, amort:Math.ceil(resto / BANCO.parcelas), j:forcado ? BANCO.forcado : BANCO.juros, atr:sv.emp.atr });   // a parcela atrasada continua atrasada
    if (forcado) sv.neg = 0;
    writeSave(sv);
    if (!forcado) Sfx.coin();
    return true;
  }
  /* parcela do fim do dia (v8.3.1): sai só se couber no dinheiro, com a atrasada, se houver; senão, fica atrasada
     (emp.atr) e nada sai, e os juros do dia vão para o saldo (v8.3.2). Devolve o que foi pago */
  pagaParcela(){
    const sv = this.save, e = sv.emp, v = this.devido, jur = jurosDe(e, this.day.n);
    if (!v) return 0;
    if (sv.bank < v){ sv.emp = normEmprestimo(Object.assign({}, e, { resto:e.resto + jur, atr:true })); return 0; }
    sv.bank -= v; caixaGasto(sv, 'par', v); caixaGasto(sv, 'jur', jur);
    sv.emp = normEmprestimo(Object.assign({}, e, { resto:e.resto - (v - jur), atr:false }));
    return v;
  }
  /* amortizar na lojinha (v8.3.2): paga x do saldo, sem juros; o prazo encurta e os juros dos próximos dias caem.
     Quitar é amortizar o saldo todo (tira também o atraso) */
  amortizar(x){
    const sv = this.save, e = sv.emp; x = Math.min(Math.round(x) || 0, e.resto);
    if (!(x > 0) || sv.bank < x) return false;
    sv.bank -= x; caixaGasto(sv, 'par', x);
    sv.emp = normEmprestimo(Object.assign({}, e, { resto:e.resto - x, atr:x >= e.resto ? false : e.atr }));
    writeSave(sv); Sfx.coin(); return true;
  }
  quitar(){ return this.amortizar(this.save.emp.resto); }
  /* divulgação (v7): escolhida na lojinha, paga junto com a folha ao abrir o dia */
  setDivulga(id){
    const d = DIVULGA.find(x => x.id === id);
    if (!d || !divulgaAberta(this.shopNext) || (d.cost && this.payroll() + d.cost > this.save.bank)) return false;
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
    if (!u || (!u.multi && this.up[id]) || (u.req && !this.up[u.req]) || this.save.bank < u.cost) return false;
    this.save.bank -= u.cost;
    if (u.multi) this.up[id] = pratosDe(this.up) + 1;   // Jogo de pratos (v8.3.6): acumula
    else this.up[id] = true;
    caixaGasto(this.save, 'mel', u.cost);
    writeSave(this.save);
    Sfx.coin();
    return true;
  }
  /* cursos do Tonhão (v8.6.9): o próximo degrau do curso (o básico, ou o avançado se o básico já foi feito), ou null se está completo */
  cursoProx(id){
    const c = cursoOf(id), n = c ? cursoNivel(this.save.cursos, id) : 2;
    if (!c || n >= 2) return null;
    return n >= 1 ? { nivel:2, nome:c.av.nome, preco:c.av.preco } : { nivel:1, nome:c.nome, preco:c.preco };
  }
  /* um curso por lojinha: depois de comprar um, os outros esperam o próximo dia */
  get cursoTrava(){ return !DEV.on && this.save.cursoDia === this.shopNext; }
  buyCurso(id){
    const p = this.cursoProx(id);
    if (!p || this.cursoTrava || this.save.bank < p.preco) return false;
    this.save.bank -= p.preco; caixaGasto(this.save, 'mel', p.preco);
    this.save.cursos[id] = p.nivel; this.save.cursoDia = this.shopNext;
    this.cursoMsg = 'O Tonhão foi fazer o curso de ' + p.nome + '!';
    const nx = tonhaoNivelXp(this.save.cursos);
    if (nx > this.save.equipe.tonhao) this.cursoMsg += ' Ele já pode subir para o nível ' + (nx + 1) + ': pague o aumento no cartão dele.';
    writeSave(this.save); Sfx.coin();
    return true;
  }
  /* cursos da Dani (v8.9): +DANI_XP.curso de experiência cada; um por lojinha, à parte do curso do Tonhão; só depois que ela chega */
  get daniCursoTrava(){ return !DEV.on && this.save.daniCursoDia === this.shopNext; }
  get daniChegou(){ return DEV.on || this.save.cap >= 2 || this.save.equipe.dani > 0; }
  buyDaniCurso(id){
    const c = DANI_CURSOS.find(x => x.id === id), sv = this.save;
    if (!c || !this.daniChegou || sv.daniCursos[id] || this.daniCursoTrava || sv.bank < c.preco) return false;
    sv.bank -= c.preco; caixaGasto(sv, 'mel', c.preco);
    sv.daniCursos[id] = 1; sv.daniCursoDia = this.shopNext;
    this.cursoMsg = 'A Dani foi fazer o curso de ' + c.nome + '!';
    const nx = daniNivelXp(sv);
    if (nx > sv.equipe.dani && sv.equipe.dani > 0) this.cursoMsg += ' Ela já pode subir para o nível ' + (nx - 1) + ': pague o aumento no cartão dela.';
    writeSave(sv); Sfx.coin();
    return true;
  }
  /* salão (v7.4): refaz as mesas e os obstáculos dos caminhos quando o salão muda. Os números seguem a ordem no
     salão (tables[id-1]). No Turno sem fim, o salão é sempre o mesmo (SALAO_SEMFIM) */
  buildTables(){
    const sem = this.mode === 'semfim', sal = this.save.salao, key = sem ? 'semfim' : JSON.stringify(sal);
    if (key === this.tablesKey) return;
    const mesas = sem ? (this.semfimMesas || (this.semfimMesas = salaoAuto(SALAO_SEMFIM.map((seats, i) => ({ seats, c:i % 4 })), PONTOS[0]))) : sal.mesas;
    const defs = mesas.map((m, i) => ({ id:i + 1, cx:m.x, cy:m.y, seats:m.seats, color:m.c, toalha:!!m.t }));
    this.tables = defs.map(d => new Table(d));
    setObst(defs);
    this.tablesKey = key;
  }
  /* estoque do salão (v8.3.5): mesas guardadas fora do salão, para rearrumar com folga (não abrem no dia) */
  get estoque(){ const sal = this.save.salao; return sal.estoque || (sal.estoque = []); }
  /* lugares de todas as mesas compradas (salão e estoque): o que conta no teto do ponto */
  get lugaresTot(){ return salaoLugares(this.save.salao.mesas) + salaoLugares(this.estoque); }
  /* troca as mesas do salão (já validadas) e, se vier `est`, as do estoque, e salva. A mesa marcada com `sel` (a nova,
     a que virou de 4) fica escolhida no editor. undo: guarda o arranjo de antes (compra e venda zeram o Desfazer) */
  salaoSet(mesas, undo, est){
    const sal = this.save.salao;
    if (undo){ this.salaoUndo.push({ m:sal.mesas, e:this.estoque }); if (this.salaoUndo.length > 20) this.salaoUndo.shift(); }
    else this.salaoUndo = [];
    sal.mesas = salaoOrdena(mesas);
    if (est) sal.estoque = est;
    this.salaoSel = sal.mesas.findIndex(m => m.sel);
    this.estoqueSel = this.estoque.findIndex(m => m.sel);
    sal.mesas.forEach(m => { delete m.sel; }); this.estoque.forEach(m => { delete m.sel; });
    return this.salaoSaved();
  }
  salaoNao(msg){ this.salaoMsg = msg; return false; }
  /* mesa nova com as cadeiras (2 ou 4 lugares), até o teto do ponto (contando o estoque): entra no primeiro lugar
     livre, ou o salão é rearrumado sozinho se não houver; se nem assim couber, vai para o estoque */
  buyMesa(seats){
    const p = this.ponto, mesas = this.save.salao.mesas, price = mesaPreco(seats);
    if (this.lugaresTot + seats > p.lugares) return this.salaoNao('A garagem tem lugar para ' + p.lugares + ' pessoas, no máximo.');
    if (this.save.bank < price) return this.salaoNao('Falta dinheiro.');
    const m = { x:0, y:0, seats, c:salaoCor(mesas.concat(this.estoque)), sel:1 }, vaga = salaoVaga(mesas, seats, p);
    const l = vaga ? mesas.concat([Object.assign(m, vaga)]) : salaoAuto(mesas.concat([m]), p);
    this.save.bank -= price; caixaGasto(this.save, 'sal', price);
    Sfx.coin();
    if (!l){ this.salaoSet(mesas, false, this.estoque.concat([{ seats, c:m.c, sel:1 }])); this.salaoMsg = 'Não coube no salão: a mesa nova foi para o estoque.'; return true; }
    return this.salaoSet(l);
  }
  /* 2 cadeiras a mais: a mesa de 2 vira mesa de 4 (no mesmo lugar, ou no lugar livre mais perto; no estoque, só vira) */
  virarMesa(i, est){
    const p = this.ponto, mesas = this.save.salao.mesas, m = (est ? this.estoque : mesas)[i];
    if (!m || m.seats !== 2) return false;
    if (this.lugaresTot + 2 > p.lugares) return this.salaoNao('Passa de ' + p.lugares + ' lugares.');
    if (this.save.bank < SALAO.virar) return this.salaoNao('Falta dinheiro.');
    let l = mesas.slice(), e = null;
    if (est){ e = this.estoque.slice(); e[i] = Object.assign({}, m, { seats:4, sel:1 }); }
    else {
      l[i] = Object.assign({}, m, { seats:4, sel:1 });
      if (salaoProblema(l, p)) l = salaoPerto(l, i, p) || salaoAuto(l, p);
      if (!l) return this.salaoNao('Não cabe uma mesa de 4 aqui.');
    }
    this.save.bank -= SALAO.virar; caixaGasto(this.save, 'sal', SALAO.virar);
    Sfx.coin();
    return this.salaoSet(l, false, e);
  }
  /* vende a mesa por metade do preço (o salão fica com pelo menos 1; do estoque, sai qualquer uma) */
  venderMesa(i, est){
    const mesas = this.save.salao.mesas, m = (est ? this.estoque : mesas)[i];
    if (!m) return false;
    if (!est && mesas.length <= 1) return this.salaoNao('O salão precisa de pelo menos 1 mesa.');
    const v = Math.round(mesaPreco(m.seats) * SALAO.venda);
    this.save.bank += v; caixaGasto(this.save, 'sal', -v);
    Sfx.coin();
    return est ? this.salaoSet(mesas, false, this.estoque.filter(x => x !== m)) : this.salaoSet(mesas.filter(x => x !== m));
  }
  /* editor: as cadeiras da mesa i (do salão ou do estoque) ganham a cor c (de graça; a mesa continua escolhida e dá para desfazer) */
  pintarMesa(i, c, est){
    const mesas = this.save.salao.mesas, lista = est ? this.estoque : mesas, m = lista[i];
    if (!m || !(c >= 0 && c < CHAIRS.length)) return false;
    if (m.c === c) return true;
    const l = lista.slice(); l[i] = Object.assign({}, m, { c, sel:1 });
    return est ? this.salaoSet(mesas, true, l) : this.salaoSet(l, true);
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
  /* editor (v8.3.5): a mesa i do salão vai para o estoque (o salão fica com pelo menos 1) */
  guardarMesa(i){
    const mesas = this.save.salao.mesas, m = mesas[i];
    if (!m) return false;
    if (mesas.length <= 1) return this.salaoNao('O salão precisa de pelo menos 1 mesa.');
    return this.salaoSet(mesas.filter(x => x !== m), true, this.estoque.concat([Object.assign({ seats:m.seats, c:m.c }, m.t ? { t:1 } : {})]));
  }
  /* editor (v8.3.5): a mesa k do estoque volta para o salão em (x, y), ou no primeiro lugar livre se não vier lugar */
  tirarMesa(k, x, y){
    const p = this.ponto, mesas = this.save.salao.mesas, m = this.estoque[k];
    if (!m) return false;
    if (x == null){ const v = salaoVaga(mesas, m.seats, p); if (!v) return this.salaoNao('Não há lugar livre no salão: abra espaço ou guarde outra mesa.'); x = v.x; y = v.y; }
    const l = mesas.concat([Object.assign({ x, y, seats:m.seats, c:m.c, sel:1 }, m.t ? { t:1 } : {})]), why = salaoProblema(l, p);
    if (why) return this.salaoNao(why);
    return this.salaoSet(l, true, this.estoque.filter(e => e !== m));
  }
  /* decoração (v8.6.5): enfeite novo (fica à mostra), à vontade */
  buyDecor(id){
    const d = decorOf(id), dec = this.save.decor;
    if (!d || id in dec || this.save.bank < d.cost) return false;
    this.save.bank -= d.cost; caixaGasto(this.save, 'sal', d.cost);
    dec[id] = 1;
    writeSave(this.save); Sfx.coin();
    return true;
  }
  /* guardar ou pôr de volta um enfeite já comprado (de graça) */
  mostraDecor(id, on){
    const dec = this.save.decor;
    if (!(id in dec)) return false;
    dec[id] = on ? 1 : 0;
    writeSave(this.save);
    return true;
  }
  /* toalha xadrez na mesa i (do salão ou do estoque) */
  buyToalha(i, est){
    const m = (est ? this.estoque : this.save.salao.mesas)[i];
    if (!m || m.t) return false;
    if (this.save.bank < TOALHA.cost) return this.salaoNao('Falta dinheiro.');
    this.save.bank -= TOALHA.cost; caixaGasto(this.save, 'sal', TOALHA.cost);
    m.t = 1; Sfx.coin();
    return this.salaoSaved();
  }
  /* toalha em todas as mesas que ainda não têm (salão e estoque) */
  get semToalha(){ return this.save.salao.mesas.concat(this.estoque).filter(m => !m.t); }
  buyToalhas(){
    const l = this.semToalha, v = l.length * TOALHA.cost;
    if (!l.length || this.save.bank < v) return false;
    this.save.bank -= v; caixaGasto(this.save, 'sal', v);
    l.forEach(m => { m.t = 1; }); Sfx.coin();
    return this.salaoSaved();
  }
  arrumarSalao(){
    const l = salaoAuto(this.save.salao.mesas, this.ponto);
    if (!l) return this.salaoNao('Não deu para arrumar sozinho.');
    if (JSON.stringify(l) === JSON.stringify(this.save.salao.mesas)) return true;
    return this.salaoSet(l, true);
  }
  desfazerSalao(){
    const u = this.salaoUndo.pop();
    if (!u) return false;
    this.save.salao.mesas = u.m; this.save.salao.estoque = u.e; this.salaoSel = -1; this.estoqueSel = -1;
    return this.salaoSaved();
  }
  salaoSaved(){
    this.salaoMsg = '';
    writeSave(this.save);
    if (this.state === 'shop') this.resetDay(this.shopNext);   // o salão ao fundo já mostra a mudança
    else this.buildTables();
    return true;
  }
  /* Recomeçar do zero (v8.3, com confirmação no menu): a carreira volta ao dia 1; a Missão zero continua feita */
  resetProgress(){
    this.save = normSave(DEV.on ? { bank:DEV.bank, treino:this.save.treino } : { treino:this.save.treino });   // também depois que o banco tomou a lanchonete (v8.3.1)
    this.up = this.save.up;
    this.buildTables();
    this.kitchen.reset(); this.dani.reset();
    writeSave(this.save);
  }
  /* modo dev: troca de save (o de verdade fica guardado). Ao entrar, o dinheiro volta a R$ 10.000 */
  setDev(on){
    DEV.on = !!on; lsSet(LS.dev, DEV.on ? '1' : '0');
    this.save = loadSave();
    if (DEV.on){ this.save.bank = DEV.bank; writeSave(this.save); }
    this.up = this.save.up;
    this.buildTables();
    this.kitchen.reset(); this.dani.reset();
  }
  /* liga ou desliga uma melhoria de graça; os Tênis de corrida andam junto com os Tênis novos */
  devToggle(id){
    const u = UPGRADES.find(x => x.id === id);
    if (!DEV.on || !u) return false;
    if (this.up[id]){ delete this.up[id]; UPGRADES.forEach(v => { if (v.req === id) delete this.up[v.id]; }); }
    else { this.up[id] = u.multi ? 1 : true; if (u.req) this.up[u.req] = true; }
    writeSave(this.save);
    return true;
  }

  /* ---------- entrada ----------
     pad: folga em px lógicos para o dedo (0 no mouse). Um toque que cai fora
     de tudo vai para o alvo mais próximo dentro da folga; acerto exato vence. */
  pickAt(x, y, pad){
    let best = null, bd = Infinity;
    const take = (r, hit) => { const d = rectDist(x, y, r); if (d <= (pad || 0) && d < bd){ bd = d; best = hit; } };
    // conserto (v8): a plaquinha do equipamento quebrado vence o que está embaixo dela
    for (const q of this.quebras){
      if (!q.on || q.fixed) continue;
      const b = manutOf(q.id).badge, R = MANUT.badge;
      if (rectDist(x, y, { x:b.x - R, y:b.y - R, w:2 * R, h:2 * R }) <= (pad || 0)) return { k:'conserto', id:q.id };
    }
    for (const g of this.queue) take(queueRect(g), { k:'queue', g });
    for (const t of this.tables) take(tableRect(t), { k:'table', t });
    for (const k of STATION_KEYS){ if (this.estacaoOn(k)) take(STATIONS[k].rect, { k:'station', st:k }); }
    return best;
  }
  /* a bebida da espera só com a melhoria; o balcão de retirada (v8.6), só no dia com entregador */
  estacaoOn(k){ return k === 'maquina' ? !!this.up.maquina : k === 'retirada' || k === 'adiantar' ? this.marmitaOk : true; }
  tableAt(x, y, pad){
    let best = null, bd = Infinity;
    for (const t of this.tables){ const d = rectDist(x, y, tableRect(t)); if (d <= (pad || 0) && d < bd){ bd = d; best = t; } }
    return best;
  }
  stationAt(x, y){
    for (const k of STATION_KEYS){
      if (!this.estacaoOn(k)) continue;
      const r = STATIONS[k].rect;
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return k;
    }
    return null;
  }
  /* HUD na tela larga (v7.6): a fila de ações anda HUDX.fila e a pausa e o som, HUDX.dir */
  hudHit(x, y){
    if (y < 540) return null;
    const xd = x - HUDX.dir;
    if (xd >= 832 && xd <= 891 && y >= 542) return { k:'pause' };
    if (xd >= 891 && xd <= 952 && y >= 542) return { k:'sound' };
    for (let i=0;i<filaMax(this.up);i++){
      const sx = 358 + i*52 + HUDX.fila;
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
    if (k === 'coffee' && this.quebrado('cafeteira')){ this.addText(STATIONS.coffee.ap.x + 50, STATIONS.coffee.rect.y + 14, 'Cafeteira parada!', PAL.perigo, 14); Sfx.boing(); return false; }
    if (this.bia.enqueue({ type:k })){ Sfx.tap(); this.addGlow(k); return true; }
    return false;
  }
  /* entrada: x e y chegam na tela (HUD na tela; o resto vira mundo, x - cam) */
  onDown(sx, y, pad){
    if (this.state !== 'playing') return;
    pad = pad || 0;
    const h = this.hudHit(sx, y);
    // Missão zero: "Pular tutorial" (em todos os balões) volta direto ao menu principal
    const pu = this.treino && this.treino.pular;
    if (pu && sx >= pu.x && sx <= pu.x + pu.w && y >= pu.y && y <= pu.y + pu.h){ this.pularTreino(); return; }
    // Missão zero: com o pop-up de explicação, qualquer toque (menos a pausa e o som) segue para o próximo passo
    if (this.treino && this.treino.para && !(h && (h.k === 'pause' || h.k === 'sound'))){ this.treino.seguir(); return; }
    if (h){
      if (h.k === 'pause') this.pause();
      else if (h.k === 'sound'){ Sfx.muted = !Sfx.muted; if (!Sfx.muted) Sfx.tap(); this.addGlow('som'); }
      else if (h.k === 'slot') { if (h.i < this.bia.acts.length){ this.bia.remove(h.i); Sfx.tap(); this.addGlow('acao' + h.i); } }
      return;
    }
    const x = sx - this.cam;
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
    if (hit && hit.k === 'conserto') this.consertar(hit.id);
    else if (hit) this.tapStation(hit.st, x, y);
    else if (pad) this.fx.push({ k:'tap', x, y, life:0, max:0.3 });
  }
  /* destaque da mesa sob o grupo arrastado ou escolhido */
  hoverAt(x, y, pad, grp){
    const t = this.tableAt(x, y, pad);
    this.hover = t;
    this.hoverOk = !!(t && t.free && t.seats >= grp.size);
  }
  onMove(sx, y){
    if (this.state !== 'playing') return;
    const x = sx - this.cam, d = this.drag, pad = d ? d.pad : 0;
    if (d){
      d.x = x; d.y = y;
      // no dedo, um tremidinho não vira arrasto (folga ~ a mesma do alvo)
      if (!d.moved && Math.hypot(x-d.sx, y-d.sy) > Math.max(9, pad)) d.moved = true;
    }
    if (d && d.moved) this.hoverAt(x, y, pad, d.g);
    else if (this.sel) this.hoverAt(x, y, 0, this.sel);
    else this.hover = null;
  }
  onUp(sx, y){
    const d = this.drag;
    this.drag = null; this.hover = null;
    if (!d || this.state !== 'playing') return;
    const x = sx - this.cam;
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

