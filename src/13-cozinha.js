/* ============================================================
   COZINHA (Chef Tonhão)
   ============================================================ */
class Kitchen {
  constructor(game){ this.game = game; this.reset(); }
  reset(){ this.queue = []; this.cooking = []; this.plates = [null,null,null,null]; this.pid = 0; this.slots = STAFF.tonhao.levels[this.game.save.equipe.tonhao].slots; this.sinkN = 0; this.clean = Infinity; this.noPlate = false; this.washT = 0; }
  get chef(){ return STAFF.tonhao.levels[this.game.save.equipe.tonhao]; }
  submit(ticket){
    const g = this.game, grp = ticket.group;
    let time = rand(4,7) * this.chef.cook;
    if (grp.vip) time *= VIP.cook;              // prato especial do VIP
    if (g.day.gripe) time *= 1.25;   // dia 7: o Tonhão está gripado
    if (g.mode === 'semfim') time *= 1 + Math.min(0.25, 0.01 * g.elapsed / 60);
    this.queue.push({ group:grp, table:ticket.table, time, p:0, dish:grp.dish });
  }
  purge(group){
    this.queue   = this.queue.filter(t => t.group !== group);
    this.cooking = this.cooking.filter(t => t.group !== group);
    this.plates  = this.plates.map(p => (p && p.group === group) ? null : p);
  }
  progressFor(group){
    const c = this.cooking.find(t => t.group === group);
    if (c) return clamp(c.p / c.time, 0, 1);
    if (this.queue.some(t => t.group === group)) return 0;
    return -1;
  }
  update(dt){
    this.noPlate = false;
    const fogo = this.game.quebrado('fogao') ? manutOf('fogao').lento : 1;   // fogão falhando (v8): cozinha mais devagar
    while (this.cooking.length < this.slots && this.queue.length) this.cooking.push(this.queue.shift());
    for (let i=this.cooking.length-1; i>=0; i--){
      const t = this.cooking[i];
      t.p = Math.min(t.time, t.p + dt * fogo);
      if (t.p >= t.time){
        const free = this.plates.findIndex(p => !p);
        if (free >= 0 && this.clean <= 0) this.noPlate = true;
        if (free >= 0 && this.clean > 0){
          this.clean--;
          const crit = this.game.mode !== 'treino' && Math.random() < this.chef.crit;
          this.plates[free] = { id:++this.pid, table:t.table, group:t.group, dish:t.dish, slot:free, age:0, crit, vip:!!(t.group && t.group.vip) };
          this.cooking.splice(i,1);
          this.game.usos.fogao++; this.game.usos.geladeira++;
          Sfx.bell();
          this.game.addText(PLATE_SLOTS[free].x, PLATE_SLOTS[free].y - 34, 'Pronto!', PAL.mostarda, 16);
          // ingredientes (v7): o prato pronto já custou, mesmo que o grupo vá embora antes de comer
          // geladeira quebrada (v8): ingredientes mais caros enquanto ela não for consertada
          const cost = t.group ? Math.round(t.group.bill * INGRED.prato * (this.game.quebrado('geladeira') ? manutOf('geladeira').ingred : 1)) : 0;
          if (cost){ this.game.custo += cost; this.game.addText(PLATE_SLOTS[free].x, PLATE_SLOTS[free].y - 54, '-' + cost, PAL.perigo, 12); }
        }
      }
    }
    this.plates.forEach(p => { if (p) p.age += dt; });
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

