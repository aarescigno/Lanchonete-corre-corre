/* ============================================================
   COZINHA (Chef Tonhão)
   ============================================================ */
/* as bocas do fogão: as do Tonhão e, na área industrial, a do fogão industrial (v9) */
function cozinhaSlots(g){ return STAFF.tonhao.levels[g.save.equipe.tonhao].slots + (g.up.fogaoInd ? INDUSTRIAL.fogao.slots : 0); }
class Kitchen {
  constructor(game){ this.game = game; this.reset(); }
  reset(){ this.queue = []; this.cooking = []; this.plates = PLATE_SLOTS.map(() => null); this.marmJ = MARMJ_SLOTS.map(() => null); this.pid = 0; this.slots = cozinhaSlots(this.game); this.sinkN = 0; this.clean = Infinity; this.noPlate = false; this.washT = 0; }
  get chef(){ return STAFF.tonhao.levels[this.game.save.equipe.tonhao]; }
  /* a chance de caprichar: x CURSO_AV.crit nos pratos de um curso avançado que o Tonhão já fez (v8.6.9) */
  chefCrit(dish){ return this.chef.crit * (pratoAv(dish, this.game.cursos) ? CURSO_AV.crit : 1); }
  /* v10, a refeição completa: a comanda vira dois pedidos em sequência. Entra o da entrada (tempo 0: ×TEMPOS.entrada.cook, sem o ×VIP nem o 2º item, ocupa vaga
     do balcão mas não gasta prato limpo; ingrediente sobre o valor das entradas). Entregue a entrada, entra o do principal (tempo 1: tempo normal, ×VIP, gasta prato
     limpo; ingrediente sobre o valor dos principais e o prato do VIP), na frente das entradas que ainda não começaram */
  submitTempo(grp, table, tempo){
    const g = this.game, pr = k => k ? precoPrato(k, g.ponto, g.cursos) : 0;
    let time = rand(4,7) * this.chef.cook;
    if (tempo === 0) time *= TEMPOS.entrada.cook; else time *= vipCook(grp, g);   // v10.1: o prato especial (ou da casa) do VIP
    if (g.day.gripe) time *= 1.25;
    const base = tempo === 0 ? grp.extras.reduce((v, k) => v + pr(k), 0) : grp.dishes.reduce((v, k) => v + pr(k), 0) + (grp.vip ? vipDish(grp) : 0);
    const t = { group:grp, table, time, p:0, dish:tempo === 0 ? grp.pratoVez : grp.dish, tempo, base };
    const i = tempo === 0 ? -1 : this.queue.findIndex(q => q.tempo === 0);
    if (i < 0) this.queue.push(t); else this.queue.splice(i, 0, t);
  }
  submit(ticket){
    const g = this.game, grp = ticket.group;
    if (grp.tempos) return this.submitTempo(grp, ticket.table, grp.tempo);
    let time = rand(4,7) * this.chef.cook;
    time *= vipCook(grp, g);              // prato especial do VIP (v10.1: ou da casa; a Louça fina acelera)
    time *= 1 + MAIS.cozinha * grp.extras.filter(Boolean).length / grp.size;   // o 2º item de quem pediu mais (v8.3.8)
    if (g.day.gripe) time *= 1.25;   // dia 7: o Tonhão está gripado
    if (g.mode === 'semfim') time *= 1 + Math.min(0.25, 0.01 * g.elapsed / 60);
    this.queue.push({ group:grp, table:ticket.table, time, p:0, dish:grp.dish });
  }
  /* marmita (v8.6): o pedido da Efood (dono: o entregador) ou a adiantada (sem dono); o tempo de 1 prato */
  submitMarmita(dish, dono){
    const g = this.game;
    let time = rand(4,7) * this.chef.cook;
    if (g.day.gripe) time *= 1.25;
    if (g.mode === 'semfim') time *= 1 + Math.min(0.25, 0.01 * g.elapsed / 60);
    const t = { marmita:true, group:null, table:0, time, p:0, dish, dono:dono || null, enc:!!dono };   // enc: encomenda (cancela se o dono for embora antes de começar)
    this.queue.push(t);
    return t;
  }
  purge(group){
    this.queue   = this.queue.filter(t => t.group !== group);
    this.cooking = this.cooking.filter(t => t.group !== group);
    // o prato pronto de quem foi embora não some: vai sozinho para a pia, para ser lavado
    this.plates  = this.plates.map(p => {
      if (!p || p.group !== group) return p;
      this.sinkN++;
      this.game.addText(PLATE_SLOTS[p.slot].x, PLATE_SLOTS[p.slot].y - 34, 'Pra pia!', PAL.faixa, 14);
      return null;
    });
  }
  /* o pronto (prato ou marmita) com esse id: { arr, i, p } ou null */
  achaPronto(pid){
    for (const arr of [this.plates, this.marmJ]){ const i = arr.findIndex(p => p && p.id === pid); if (i >= 0) return { arr, i, p:arr[i] }; }
    return null;
  }
  progressFor(group){
    const c = this.cooking.find(t => t.group === group);
    if (c) return clamp(c.p / c.time, 0, 1);
    if (this.queue.some(t => t.group === group)) return 0;
    return -1;
  }
  /* a marmita pronta vai para a janela de prontos (sem prato limpo); os ingredientes e a embalagem saem agora */
  marmitaPronta(t, slot){
    const g = this.game, crit = g.mode !== 'treino' && Math.random() < this.chefCrit(t.dish);
    const fx = AVAL.prato[g.save.equipe.tonhao], q = crit ? 5 : rand(fx[0], fx[1]);
    this.marmJ[slot] = { id:++this.pid, kind:'marmita', mid:++g.marmitaId, dish:t.dish, dono:t.dono, slot, age:0, crit, q };
    g.usos.fogao++; g.usos.geladeira++;
    Sfx.bell();
    g.addText(MARMJ_SLOTS[slot].x, MARMJ_SLOTS[slot].y - 30, 'Marmita!', PAL.mostarda, 16);
    const cost = Math.round(precoPrato(t.dish, g.ponto, g.cursos) * INGRED.prato * (g.quebrado('geladeira') ? manutOf('geladeira').ingred : 1)) + MARMITA.embalagem;
    g.custo += cost; g.addText(MARMJ_SLOTS[slot].x, MARMJ_SLOTS[slot].y - 48, '-' + cost, PAL.perigo, 12);
  }
  update(dt){
    this.noPlate = false;
    const fogo = this.game.quebrado('fogao') ? manutOf('fogao').lento : 1;   // fogão falhando (v8): cozinha mais devagar
    // v9.6.5: as mesas na frente: o próximo é o 1º ticket de prato; marmita só entra se (no fogão + na janela) < vagas da janela
    while (this.cooking.length < this.slots && this.queue.length){
      const noFogo = this.cooking.filter(t => t.marmita).length, naJanela = this.marmJ.filter(Boolean).length;
      const i = this.queue.findIndex(t => !t.marmita || noFogo + naJanela < MARMJ_SLOTS.length);
      if (i < 0) break;
      this.cooking.push(this.queue.splice(i, 1)[0]);
    }
    for (let i=this.cooking.length-1; i>=0; i--){
      const t = this.cooking[i];
      t.p = Math.min(t.time, t.p + dt * fogo);
      if (t.p >= t.time){
        if (t.marmita){ const fm = this.marmJ.findIndex(p => !p); if (fm >= 0){ this.cooking.splice(i,1); this.marmitaPronta(t, fm); } continue; }
        const free = this.plates.findIndex(p => !p);
        const entrada = t.tempo === 0;   // v10: a entrada não gasta prato limpo
        if (free >= 0 && !entrada && this.clean <= 0) this.noPlate = true;
        if (free >= 0 && (entrada || this.clean > 0)){
          if (!entrada) this.clean--;
          const casa = !!(t.group && t.group.exigente && t.tempo !== 0), crit = (casa && casaBoa(t.group, this.game)) || (this.game.mode !== 'treino' && Math.random() < this.chefCrit(t.dish));   // v10.1: o prato da casa, com o Tonhão no nível 4 em diante, sai sempre caprichado
          // a nota do prato (v8.4): o caprichado vale 5; os outros caem na faixa de acerto do cozinheiro
          const fx = AVAL.prato[this.game.save.equipe.tonhao], q = crit ? 5 : rand(fx[0], fx[1]);
          this.plates[free] = { id:++this.pid, table:t.table, group:t.group, dish:t.dish, slot:free, age:0, crit, q, vip:!!(t.group && t.group.vip), tempo:t.tempo, casa };
          this.cooking.splice(i,1);
          this.game.usos.fogao++; this.game.usos.geladeira++;
          Sfx.bell();
          this.game.addText(PLATE_SLOTS[free].x, PLATE_SLOTS[free].y - 34, 'Pronto!', PAL.mostarda, 16);
          // ingredientes (v7): o prato pronto já custou, mesmo que o grupo vá embora antes de comer
          // geladeira quebrada (v8): ingredientes mais caros enquanto ela não for consertada
          const cost = t.group ? Math.round((t.base != null ? t.base : t.group.bill) * INGRED.prato * (this.game.quebrado('geladeira') ? manutOf('geladeira').ingred : 1)) : 0;
          if (cost){ this.game.custo += cost; this.game.addText(PLATE_SLOTS[free].x, PLATE_SLOTS[free].y - 54, '-' + cost, PAL.perigo, 12); }
        }
      }
    }
    this.plates.forEach(p => { if (p) p.age += dt; });
    this.marmJ.forEach(p => { if (p) p.age += dt; });
    // com aumento, o Tonhão lava 1 pilha da pia a cada chef.wash segundos
    const w = this.chef.wash;
    if (w && this.sinkN > 0){
      this.washT += dt;
      if (this.washT >= w){
        this.washT = 0;
        if (this.game.washPiles(1)){ this.game.addText(862, 384, 'Tonhão lavou!', PAL.faixa, 14); Sfx.wash(); }
      }
    } else this.washT = 0;
  }
}

