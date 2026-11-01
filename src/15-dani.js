/* ============================================================
   DANI (contratada): age sozinha, só nas tarefas escolhidas na lojinha
   (tirar o lixo, retirar pratos sujos, lavar a louça, servir cafezinho, levar o suco da espera e, desde a v8.6, levar
   as marmitas da janela de prontos ao balcão de retirada).
   Anda mais devagar que a Bia (50%, 65% ou 80% conforme o nível) e
   leva 1 item em cada mão.
   ============================================================ */
const DANI_HOME = { x:700, y:470 };
/* v9.2, v9.3: quem cuida das tarefas básicas da casa (BASICAS) no dia: o ajudante mais novo que veio (Cami, depois Joca, depois Dani) */
function donoBasico(g){ const eq = g.save.equipe; return eq.cami > 0 && !eq.camiFora && !camiModoMesas(g.save) ? 'cami'   /* v9.6: no modo "Minhas mesas" o básico volta para o Joca (ou a Dani) */ : eq.joca > 0 && !eq.jocaFora ? 'joca' : eq.dani > 0 ? 'dani' : null; }
const AJUD_NOME = { dani:'Dani', joca:'Joca', cami:'Cami' };
const DANI_HANDS = 2;   // 2 mãos: no máximo 2 itens por vez (cada pilha de louça, a de uma mesa, ocupa 1 mão)
class Helper {
  constructor(g, quem){ this.g = g; this.quem = quem || 'dani'; this.reset(); }   // v9.2: 'dani' ou 'joca'; v9.3: ou 'cami'
  get home(){ return this.quem === 'cami' ? CAMI_HOME : this.quem === 'joca' ? JOCA_HOME : DANI_HOME; }
  reset(){
    this.x = this.home.x; this.y = this.home.y; this.dir = -1;
    this.hands = []; this.plan = null; this.path = []; this.phase = 'idle'; this.timer = 0;
    this.walkPh = 0; this.moving = false; this.thinkT = 0;
    this.feitas = 0;   // v8.9: tarefas que terminou no dia (a experiência dela)
  }
  get level(){ return this.g.save.equipe[this.quem]; }
  get active(){ const eq = this.g.save.equipe; return this.level > 0 && !(this.quem === 'joca' && eq.jocaFora) && !(this.quem === 'cami' && eq.camiFora); }
  get spec(){ return STAFF[this.quem].levels[this.level]; }
  get speed(){ return this.g.bia.speed * this.spec.speed; }   // proporcional à Bia de agora (com os tênis)
  /* v9.2: o Joca só tem tarefa básica; a Dani perde as básicas quando o Joca vem (ficam com ele) e segue com o cafezinho e os doces */
  get tasks(){
    if (!this.active) return [];
    const eq = this.g.save.equipe, up = this.g.up, dono = donoBasico(this.g), basica = t => BASICAS.indexOf(t) >= 0;
    if (this.quem === 'cami') return camiModoMesas(this.g.save) ? [] : eq.camiTasks.filter(t => daniTaskOk(t, up) && basica(t)).slice(0, this.spec.tasks);
    if (this.quem === 'joca'){   // v9.3: com o espresso, o café (cafezinho e espresso) é dele, fixo na 1ª vaga; sem a Cami, o básico nas vagas que sobram
      const cafe = up.espresso ? ['cafe'] : [];
      return dono !== 'joca' ? cafe : cafe.concat(eq.jocaTasks.filter(t => daniTaskOk(t, up) && basica(t))).slice(0, this.spec.tasks);
    }
    let l = eq.daniTasks.filter(t => daniTaskOk(t, up));
    if (dono !== 'dani') l = l.filter(t => !basica(t));   // as básicas ficam com o ajudante mais novo e não ocupam vaga dela
    return l.slice(0, this.spec.tasks);
  }
  does(t){ return this.tasks.indexOf(t) >= 0; }
  get nome(){ return AJUD_NOME[this.quem]; }
  /* esvaziando a lixeira agora (a tampa abre e fecha) */
  get emptying(){ return !!(this.phase === 'do' && this.plan && this.plan.type === 'trash' && this.g.trash > 0); }
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
  /* marmita pronta para levar (v8.6): a de quem espera no balcão primeiro; a sem dono só se couber na prateleira. Nunca a
     que a Bia já vai pegar */
  marmitaAlvo(){
    const g = this.g, livres = g.prateleira.filter(m => !m.dono).length;
    const ps = g.kitchen.marmJ.filter(p => p && !p.dani && !g.bia.acts.some(a => a.type === 'plate' && a.pid === p.id) && (p.dono || livres < g.vagas));
    ps.sort((a,b) => (!!b.dono - !!a.dono) || (b.age - a.age));   // v9.6.5: a de entregador esperando primeiro; depois a mais antiga
    return ps[0] || null;
  }
  /* v9.2: doces que já levo na mão para o grupo, e a mesa que mais precisa do próximo (a que perde mais coração primeiro) */
  docesClaimed(grp){ return this.hands.filter(h => h.kind === 'doce' && h.group === grp).length; }
  doceAlvo(){
    const c = this.g.tables.filter(t => t.group && t.group.seated && t.group.esperaSuco && t.group.docesFalta - this.docesClaimed(t.group) > 0);
    c.sort((a,b) => a.group.hearts - b.group.hearts);
    return c[0] || null;
  }
  /* v9.3: cafés da máquina de espresso que já levo na mão para o grupo, e a mesa que mais precisa do próximo */
  cafeClaimed(grp){ return this.hands.filter(h => h.kind === 'cafeesp' && h.group === grp).length; }
  cafeEspAlvo(){
    const c = this.g.tables.filter(t => t.group && t.group.seated && t.group.esperaSuco && t.group.cafesFalta - this.cafeClaimed(t.group) > 0);
    c.sort((a,b) => a.group.hearts - b.group.hearts);
    return c[0] || null;
  }
  coffeeTarget(){
    if (this.g.quebrado('cafeteira')) return null;   // cafeteira parada (v8)
    const c = this.g.tables.filter(t => t.group && t.group.seated && !t.group.coffee && (t.group.hearts <= 4 || t.group.cafeBalao) && !t.group.daniCoffee && !this.biaWants(t));
    c.sort((a,b) => a.group.hearts - b.group.hearts);
    return c[0] || null;
  }
  /* v9.6, "Minhas mesas": as mesas abertas dela (marcadas no editor do salão) */
  get mesasModo(){ return this.quem === 'cami' && camiModoMesas(this.g.save); }
  mesasCami(){ return this.g.tables.filter(t => t.cami && t.open); }
  /* v9.6: a Cami cuida do grupo de cada mesa dela do pedido à conta, com 2 itens nas mãos e sem bandeja: leva o prato de quem já pediu,
     manda as comandas (1 ou 2) à janela, cobra a conta, pega o prato pronto e recolhe a louça suja (até a pia). Cada ação marca o
     grupo (`group.cami`): a Bia não pega o prato dele. Suco, café, doce e drink seguem com quem faz */
  thinkMesas(){
    const g = this.g, k = g.kitchen, hs = this.hands, mine = this.mesasCami(), semBia = t => !this.biaWants(t);
    const dish = hs.find(h => h.kind === 'dish');
    if (dish){
      const grp = dish.group, t = grp && grp.table;
      if (t && t.cami && grp.state === 'ordered'){ grp.cami = true; return this.go(this.nearestAp(t), { type:'entrega', t }); }
      hs.splice(hs.indexOf(dish), 1); k.sinkN++; return;   // sem destino: o prato vai para a pia
    }
    const tks = hs.filter(h => h.kind === 'ticket');
    const pedido = mine.filter(t => t.group && t.group.state === 'wantOrder' && semBia(t)).sort((a, b) => a.group.hearts - b.group.hearts)[0];
    if (tks.length && (hs.length >= DANI_HANDS || !pedido)) return this.go(STATIONS.order.ap, { type:'pedidos' });
    const conta = mine.filter(t => t.group && t.group.state === 'wantBill' && semBia(t)).sort((a, b) => a.group.hearts - b.group.hearts)[0];
    if (conta){ conta.group.cami = true; return this.go(this.nearestAp(conta), { type:'conta', t:conta }); }
    if (hs.length < DANI_HANDS){
      const p = k.plates.filter(q => q && q.group && q.group.table && q.group.table.cami && !q.camiVai
        && !g.bia.acts.some(a => a.type === 'plate' && a.pid === q.id)).sort((a, b) => b.age - a.age)[0];   // v9.6.5: o mais antigo dos dela   // a Bia já a caminho do prato: a Cami deixa
      if (p){ p.camiVai = true; p.group.cami = true; return this.go(STATIONS.plates.ap, { type:'pegaPrato', p }); }
      if (pedido){ pedido.group.cami = true; return this.go(this.nearestAp(pedido), { type:'anota', t:pedido }); }
      const sujo = mine.filter(t => t.dirty && semBia(t))[0];
      if (sujo) return this.go(this.nearestAp(sujo), { type:'clear', t:sujo });
    }
    if (hs.some(h => h.kind === 'dirty')) return this.go(STATIONS.sink.ap, { type:'sink' });
    if (Math.hypot(this.x - this.home.x, this.y - this.home.y) > 4) return this.go(this.home, null);
  }
  think(){
    if (this.mesasModo) return this.thinkMesas();
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
    // doces na mão (v9.2): leva à mesa de quem pediu ou, o da marmita, ao balcão de retirada
    const dm = this.hands.filter(h => h.kind === 'doce');
    if (dm.length){
      const hg = dm.find(h => h.group && h.group.seated && h.group.docesFalta > 0 && h.group.table);
      if (hg) return this.go(this.nearestAp(hg.group.table), { type:'servedoce', grp:hg.group });
      if (dm.some(h => h.ret) && g.docesRet() > g.potes) return this.go(STATIONS.retirada.ap, { type:'retirada' });
      this.hands = this.hands.filter(h => h.kind !== 'doce');   // sem destino (outro já levou): joga fora
    }
    // cafés da máquina de espresso na mão (v9.3): leva à mesa de quem pediu
    const cm = this.hands.filter(h => h.kind === 'cafeesp');
    if (cm.length){
      const hg = cm.find(h => h.group && h.group.seated && h.group.cafesFalta > 0 && h.group.table);
      if (hg) return this.go(this.nearestAp(hg.group.table), { type:'servecafe', grp:hg.group });
      this.hands = this.hands.filter(h => h.kind !== 'cafeesp');   // sem destino (outro já levou): joga fora
    }
    if (this.does('cafe') && g.up.espresso && this.hands.length < DANI_HANDS){
      const t = this.cafeEspAlvo();
      if (t){
        const grp = t.group, k = Math.min(DANI_HANDS - this.hands.length, grp.cafesFalta - this.cafeClaimed(grp));
        return this.go(STATIONS.espresso.ap, { type:'espresso', grp, ids:grp.cafes.slice(grp.cafesDados + this.cafeClaimed(grp), grp.cafesDados + this.cafeClaimed(grp) + k) });
      }
    }
    // marmita na mão (v8.6): leva ao balcão de retirada; pronta na janela e cabendo na prateleira (ou com dono): vai buscar
    if (this.hands.some(h => h.kind === 'marmita')) return this.go(STATIONS.retirada.ap, { type:'retirada' });
    if (this.does('marmita') && !this.hands.length){ const p = this.marmitaAlvo(); if (p){ p.dani = true; return this.go(STATIONS.plates.ap, { type:'pegaMarmita', p }); } }
    if (this.does('doce') && this.hands.length < DANI_HANDS && g.up.confCaseira){
      const t = this.doceAlvo();
      if (t) return this.go(STATIONS.doces.ap, { type:'doces', grp:t.group, k:Math.min(DANI_HANDS - this.hands.length, t.group.docesFalta - this.docesClaimed(t.group)) });
      if (!this.hands.length && g.docesRetFalta() > 0) return this.go(STATIONS.doces.ap, { type:'doces', ret:true, k:1 });
    }
    // entrega o café (com louça e café nas mãos, primeiro deixa a louça na pia, logo abaixo da cafeteira)
    if (coffee && !dirty){
      const t = (coffee.table && coffee.table.group === coffee.group && coffee.group && coffee.group.seated && !coffee.group.coffee) ? coffee.table : this.coffeeTarget();
      if (t){ coffee.table = t; coffee.group = t.group; t.group.daniCoffee = true; return this.go(this.nearestAp(t), { type:'serve', t }); }
    }
    // com louça na pia, lavar vem antes de recolher mais mesas (retorno de 01/11)
    if (this.canWash() && k.sinkN > 0 && !coffee) return this.go(STATIONS.sink.ap, { type:'sink' });
    if (this.does('pratos') && this.hands.length < DANI_HANDS){
      const c = g.tables.filter(t => t.open && t.dirty && !this.biaWants(t));
      c.sort((a,b) => Math.hypot(a.cx-this.x,a.cy-this.y) - Math.hypot(b.cx-this.x,b.cy-this.y));
      if (c.length){ return this.go(this.nearestAp(c[0]), { type:'clear', t:c[0] }); }
    }
    // com 1 pilha na mão, pega o cafezinho no caminho da pia (a 2ª mão)
    if (dirty && !coffee && this.does('cafe') && this.hands.length < DANI_HANDS && this.coffeeTarget()) return this.go(STATIONS.coffee.ap, { type:'coffee' });
    if (dirty) return this.go(STATIONS.sink.ap, { type:'sink' });
    if (this.does('lixo') && g.trash >= TRASH.cap - 2 && !this.hands.length) return this.go(STATIONS.trash.ap, { type:'trash' });
    if (this.does('cafe') && !coffee && this.hands.length < DANI_HANDS && this.coffeeTarget()) return this.go(STATIONS.coffee.ap, { type:'coffee' });
    if (this.does('suco') && !this.hands.length){ const o = g.maqLivre(); if (o){ o.dani = true; return this.go(STATIONS.maquina.ap, { type:'maquina', o }); } }
    if (Math.hypot(this.x - this.home.x, this.y - this.home.y) > 4) return this.go(this.home, null);
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
    if (st.type === 'anota') return 0.6;   // v9.6: anotar o pedido leva o mesmo tempo que para a Bia
    if (st.type === 'maquina') return this.g.bebida.take;
    if (st.type === 'espresso') return st.ids.reduce((a, id) => a + cafeDe(id).prep, 0);   // v9.3: o tempo de tirar cada café
    return 0.35;
  }
  perform(st){
    const g = this.g;
    if (st.type === 'anota'){   // v9.6: anota o pedido (a comanda vai na mão dela até a janela)
      const t = st.t, grp = t.group;
      if (!grp || grp.state !== 'wantOrder' || this.hands.length >= DANI_HANDS) return;
      g.assignCmd(grp);
      this.hands.push({ kind:'ticket', table:t.id, group:grp });
      grp.setState('ordered'); g.drinkPedir(grp); grp.gain(1);
      g.score('take', t.cx, t.cy - 40, 0, grp, true);
      this.feitas++; Sfx.blip();
    } else if (st.type === 'pedidos'){   // v9.6: as comandas na janela do Tonhão
      const tk = this.hands.filter(h => h.kind === 'ticket');
      if (!tk.length) return;
      tk.forEach(q => g.kitchen.submit(q));
      this.hands = this.hands.filter(h => h.kind !== 'ticket');
      g.addText(this.x + 10, this.y - 82, tk.length > 1 ? 'Pedidos enviados!' : 'Pedido enviado!', PAL.faixa, 14);
      this.feitas++; Sfx.ok();
    } else if (st.type === 'pegaPrato'){   // v9.6: o prato pronto do grupo dela
      const p = st.p, slot = g.kitchen.plates.indexOf(p);
      p.camiVai = false;
      if (slot < 0 || this.hands.length >= DANI_HANDS) return;
      g.kitchen.plates[slot] = null;
      const perde = pratoPerde(p.age);
      this.hands.push({ kind:'dish', table:p.table, group:p.group, dish:p.dish, crit:p.crit, q:Math.max(1, (p.q || 1) - perde), fria:perde >= PRATO.friaDe, vip:p.vip });
      Sfx.blip();
    } else if (st.type === 'entrega'){   // v9.6
      const t = st.t, grp = t.group, i = this.hands.findIndex(h => h.kind === 'dish' && h.group === grp);
      if (i < 0 || !grp || grp.state !== 'ordered') return;
      const dish = this.hands.splice(i, 1)[0];
      g.entregaPrato(grp, dish, t, true); this.feitas++;
    } else if (st.type === 'conta'){   // v9.6
      const t = st.t, grp = t.group;
      if (!grp || grp.state !== 'wantBill') return;
      g.collectBill(grp, t, true); this.feitas++;
    } else if (st.type === 'pegaMarmita'){
      // pega a marmita escolhida e, se houver, mais uma (as 2 mãos)
      st.p.dani = false;
      const k = g.kitchen;
      let livres = g.prateleira.filter(m => !m.dono).length;
      [st.p].concat(k.marmJ.filter(p => p && p !== st.p)).forEach(p => {
        const i = k.marmJ.indexOf(p);
        if (i < 0 || this.hands.length >= DANI_HANDS || g.bia.acts.some(a => a.type === 'plate' && a.pid === p.id)) return;
        if (!p.dono && livres >= g.vagas) return;
        if (!p.dono) livres++;
        k.marmJ[i] = null; this.hands.push(marmitaMao(p));
      });
      if (this.hands.length) Sfx.blip();
    } else if (st.type === 'doces'){   // v9.2: pega os doces na geladeirinha (para a mesa de quem pediu ou para o balcão)
      const k = Math.min(st.k, DANI_HANDS - this.hands.length);
      for (let i=0;i<k;i++){ this.hands.push({ kind:'doce', group:st.grp || null, ret:!!st.ret, id:pick(docesLista(g.up)).id }); g.custo += doceIngred(g.up); }
      if (k) Sfx.blip();
    } else if (st.type === 'servedoce'){
      const grp = st.grp, mine = this.hands.filter(h => h.kind === 'doce' && h.group === grp);
      const n = grp && grp.table && grp.seated && grp.esperaSuco ? Math.min(mine.length, grp.docesFalta) : 0;
      for (let i=0;i<n;i++) this.hands.splice(this.hands.indexOf(mine[i]), 1);
      if (n){ g.entregaDoces(grp, n, grp.table.cx, grp.table.cy); this.feitas++; }
    } else if (st.type === 'espresso'){   // v9.3: tira os cafés do pedido (a máquina de espresso)
      st.ids.forEach(id => { if (this.hands.length < DANI_HANDS){ this.hands.push({ kind:'cafeesp', group:st.grp, id }); g.custo += CAFES.ingred; } });
      if (this.hands.length) Sfx.blip();
    } else if (st.type === 'servecafe'){
      const grp = st.grp, mine = this.hands.filter(h => h.kind === 'cafeesp' && h.group === grp);
      const n = grp && grp.table && grp.seated && grp.esperaSuco ? Math.min(mine.length, grp.cafesFalta) : 0;
      for (let i=0;i<n;i++) this.hands.splice(this.hands.indexOf(mine[i]), 1);
      if (n){ g.entregaCafes(grp, n, grp.table.cx, grp.table.cy); this.feitas++; }
    } else if (st.type === 'retirada'){
      if (g.levaMarmitas(this)) this.feitas++;   // a que não coube fica na mão: a Dani espera no balcão abrir uma vaga (ou a marmita esfriar)
    } else if (st.type === 'clear'){
      const t = st.t;
      if (!t.dirty || this.hands.length >= DANI_HANDS) return;
      this.hands.push({ kind:'dirty', n:t.dirtyN }); t.dirty = false; t.dirtyN = 0;
      g.pontos += PONTOS_ACAO.clear; g.addText(t.cx, t.cy - 20, '+' + PONTOS_ACAO.clear + ' pts', PAL.faixa, 15); Sfx.blip();   // v8.3.8: pontos, não dinheiro
    } else if (st.type === 'sink'){
      const n = this.hands.filter(h => h.kind === 'dirty').length;
      this.hands = this.hands.filter(h => h.kind !== 'dirty');
      g.kitchen.sinkN += n;
      if (n) this.feitas++;
      if (st.wash && g.washPiles(1)){ g.addText(this.x, this.y - 82, this.nome + ' lavou!', PAL.faixa, 14); Sfx.wash(); this.feitas++; }
    } else if (st.type === 'trash'){
      if (g.trash > 0){ g.trash = 0; this.feitas++; g.stats.emptied++; g.addText(this.x, this.y - 82, 'Lixo pra fora!', PAL.ok, 14); Sfx.noise(0.3, 0.1, 0, 400); }
    } else if (st.type === 'maquina'){
      const o = st.o; o.dani = false;
      if (g.maq.indexOf(o) < 0 || o.t > 0) return;
      const k = Math.min(o.n, DANI_HANDS - this.hands.length);
      for (let i=0;i<k;i++) this.hands.push({ kind:'suco', group:o.group });
      if (k) g.maqTirar(o, k);
    } else if (st.type === 'suco'){
      const grp = st.grp, n = this.hands.filter(h => h.kind === 'suco' && h.group === grp).length;
      this.hands = this.hands.filter(h => !(h.kind === 'suco' && h.group === grp));
      if (n && g.sucoAp(grp, this)){ g.entregaSuco(grp, n, this.x, this.y); this.feitas++; }
    } else if (st.type === 'coffee'){
      if (this.hands.length < DANI_HANDS) this.hands.push({ kind:'coffee' });
    } else if (st.type === 'serve'){
      const t = st.t, h = this.hands.find(x => x.kind === 'coffee'), grp = t.group;
      if (grp) grp.daniCoffee = false;
      if (!h || !grp || !grp.seated || grp.coffee) return;
      this.hands.splice(this.hands.indexOf(h), 1);
      grp.coffee = true; this.feitas++; grp.gain(g.up.cafeteira ? 2 : 1); g.usos.cafeteira++;
      grp.bebConta += DRINK_PRICE.coffee; g.pontos += PONTOS_ACAO.coffee; g.addText(t.cx, t.cy - 40, '+' + DRINK_PRICE.coffee + ' na conta', PAL.ok, 16); Sfx.coin();
    }
  }
  update(dt){
    if (!this.active) return;
    this.moving = false;
    if (this.phase === 'idle'){ this.thinkT -= dt; if (this.thinkT <= 0){ this.thinkT = 0.25; this.think(); } }
    if (this.phase === 'walk' && !this.plan){ this.thinkT -= dt; if (this.thinkT <= 0){ this.thinkT = 0.25; this.think(); } }   // v9.6.2: na volta ao canto, repensa (louça na pia, outra tarefa)
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

