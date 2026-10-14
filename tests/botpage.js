
(function(){
 const mk=// bot compartilhado
function(g,L){
  return function botStep(){
    const b=g.bia;
    const can=k=>b.canTake?b.canTake(k):b.free()>0;
    if(g.queue.length){
      const grp=g.queue[0];
      const cands=g.tables.filter(t=>t.free&&t.seats>=grp.size);
      if(cands.length){ cands.sort((a,c)=>(c.color===grp.color)-(a.color===grp.color)||a.seats-c.seats); g.seatGroup(grp,cands[0]); }
    }
    if(b.acts.length>=4) return;
    const has=(f)=>b.acts.some(f);
    if(b.hands.some(h=>h.kind==='ticket') && !has(a=>a.type==='order')) return g.tapStation('order',800,150);
    const d=b.hands.find(h=>h.kind==='dish');
    if(d && !has(a=>a.type==='table'&&a.id===d.table)) return g.tapTable(g.tables[d.table-1]);
    // sucos: leva os que estiver carregando e busca mais se alguma mesa ainda espera
    const jt=g.tables.filter(t=>t.group&&t.group.juiceOpen&&t.group.juicePending>0);
    if(b.hands.some(h=>h.kind==='juice')){ const t=jt.find(t=>!has(a=>a.type==='table'&&a.id===t.id)); if(t) return g.tapTable(t); }
    if(b.hands.some(h=>h.kind==='dirty') && !has(a=>a.type==='sink')) return g.tapStation('sink',850,450);
    // lixeira quase cheia e mãos vazias: esvazia (se a Dani não estiver cuidando disso)
    if(g.trash!==undefined && g.trash>=L.TRASH.cap-1 && !b.hands.length && !has(a=>a.type==='trash') && !(g.dani&&g.dani.does('lixo'))) return g.tapStation('trash',723,500);
    // jarra de água quase vazia: recarrega (se houver dinheiro para isso)
    if(g.up&&g.up.agua&&L.AGUA&&g.agua<=1&&g.money>=L.AGUA.price&&!has(a=>a.type==='agua')&&!(g.dani&&g.dani.does('agua'))) return g.tapStation('agua',182,140);
    // louça esperando na pia (2º toque, sem louça na mão): lava se ninguém mais lava, ou se faltam
    // pratos e a pia acumulou; nunca enquanto a Dani lava (só 1 pessoa lava por vez)
    const helper=g.otherWasher!==undefined?g.otherWasher:(g.dani&&g.dani.does('lavar'));
    if(g.kitchen.sinkN>0 && (!helper || (g.kitchen.clean<=0 && g.kitchen.sinkN>=2)) && !has(a=>a.type==='sink') && !b.hands.some(h=>h.kind==='dirty') && !(g.dani&&g.dani.washing)) return g.tapStation('sink',850,450);
    for(const t of g.tables){
      if(!t.open||has(a=>a.type==='table'&&a.id===t.id)||(g.dani&&g.dani.targets(t))) continue;
      if(t.dirty||(t.group&&(t.group.state==='wantOrder'||t.group.state==='wantBill'))){ if(can(t.dirty?'dirty':'ticket')||t.group&&t.group.state==='wantBill') return g.tapTable(t); }
    }
    for(let i=0;i<4;i++){ const p=g.kitchen.plates[i]; if(p&&can('dish')&&!has(a=>a.type==='plate'&&a.pid===p.id)) return g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y); }
    const need=jt.reduce((n,t)=>n+t.group.juicePending,0), carry=b.hands.filter(h=>h.kind==='juice').length+b.acts.filter(a=>a.type==='juice').length;
    // busca de uma vez todos os sucos que couberem (a fila de ações conta como já nas mãos)
    if(need>carry && !has(a=>a.type==='juice')){
      let k=0; const sim=b.hands.slice();
      while(k<need-carry && b.acts.length+k<6 && L.handLayout(sim.concat([{kind:'juice'}]),b.tray)){ sim.push({kind:'juice'}); k++; }
      for(let i=0;i<k;i++) g.tapStation('juice',910,350);
      if(k) return;
    }
  };
};
 window.botStep=function(){ if(!window.__bot) window.__bot=mk(window.__game,window.__lcc); window.__bot(); };
 window.run=function(sec,bot){const g=window.__game;for(let i=0;i<sec*20;i++){if(bot)window.botStep();g.update(0.05);}};
})();
