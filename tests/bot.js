// bot compartilhado. opts.afiado: o "jogador perfeito" da v7.1 (ver afiado abaixo)
module.exports=function(g,L,opts){
  if(opts&&opts.afiado) return afiado(g,L);
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

// Bot afiado (v7.1): faz uma ação de cada vez, sempre a mais urgente. A urgência é o tempo que o grupo
// ainda aguenta (corações × paciência) menos a caminhada até lá. Senta qualquer grupo da fila que caiba
// (o mais apressado primeiro, na menor mesa), serve cafezinho a quem está por um fio e lava a louça
// quando faltam pratos. Serve para medir se dá para não perder ninguém jogando muito bem.
function afiado(g,L){
  const ST=L.LAYOUT.STATIONS, SL=L.LAYOUT.PLATE_SLOTS;
  const ttl=grp=>{ if(!grp) return Infinity; const p=grp.patPer(); return isFinite(p)?grp.patLeft+(grp.hearts-1)*p:Infinity; };
  const walk=(x0,y0,x1,y1)=>Math.hypot(x1-x0,y1-y0)*1.25/g.bia.speed;
  return function botStep(){
    const b=g.bia, k=g.kitchen, dani=g.dani;
    // 1) sentar: o grupo mais apressado primeiro, na menor mesa livre que caiba (cor igual desempata)
    const q=g.queue.slice().sort((a,c)=>ttl(a)-ttl(c));
    for(const grp of q){
      const c=g.tables.filter(t=>t.free&&t.seats>=grp.size);
      if(!c.length) continue;
      c.sort((a,t)=>a.seats-t.seats||(t.color===grp.color)-(a.color===grp.color));
      g.seatGroup(grp,c[0]);
    }
    if(b.acts.length) return;
    const can=kd=>b.canTake(kd), from=pt=>walk(b.x,b.y,pt.x,pt.y);
    const tw=t=>walk(b.x,b.y,t.cx,t.cy+4), sw=key=>from(ST[key].ap);
    const tableOf=grp=>grp&&grp.table;
    const cands=[];   // [pontos (menor = mais urgente), ação]
    const add=(sc,fn)=>cands.push([sc,fn]);
    const dirtyN=b.hands.filter(h=>h.kind==='dirty').length;
    // pratos e comandas que a Bia carrega
    b.hands.filter(h=>h.kind==='dish').forEach(h=>{ const t=g.tables[h.table-1]; add(ttl(h.group)-tw(t),()=>g.tapTable(t)); });
    const tk=b.hands.filter(h=>h.kind==='ticket');
    if(tk.length) add(Math.min(...tk.map(h=>ttl(h.group)))-sw('order')-6,()=>g.tapStation('order',800,150));
    // pratos prontos no balcão
    k.plates.forEach((p,i)=>{ if(!p||!can('dish')) return; const t=tableOf(p.group); if(!t) return;
      add(ttl(p.group)-sw('plates')-walk(ST.plates.ap.x,ST.plates.ap.y,t.cx,t.cy),()=>g.tapStation('plates',SL[i].x,SL[i].y)); });
    // grupos esperando nas mesas (pedido, conta) e mesas sujas
    const ordered=g.tables.filter(t=>t.group&&t.group.state==='ordered').map(t=>ttl(t.group));
    const plateNeed=k.clean<=0?Math.min(Infinity,...ordered):Infinity;
    for(const t of g.tables){
      if(!t.open||(dani&&dani.targets(t))) continue;
      const grp=t.group;
      if(grp&&grp.state==='wantOrder'&&can('ticket')) add(ttl(grp)-tw(t),()=>g.tapTable(t));
      else if(grp&&grp.state==='wantBill'){
        if(grp.juicePending>0&&b.juiceN()===0&&!dani) { /* conta mesmo assim, mais tarde */ add(ttl(grp)-tw(t)+4,()=>g.tapTable(t)); }
        else add(ttl(grp)-tw(t),()=>g.tapTable(t));
      }
      else if(t.dirty&&can('dirty')){
        const waits=g.queue.filter(x=>x.size<=t.seats&&!g.tables.some(o=>o.free&&o.seats>=x.size)).map(ttl);
        const sc=Math.min(waits.length?Math.min(...waits):40, plateNeed-6)-tw(t);
        add(sc,()=>g.tapTable(t));
      }
    }
    // cafezinho: a quem está com 2 corações ou menos (e ainda não tomou)
    const coffeeT=g.tables.filter(t=>t.group&&!t.group.coffee&&isFinite(ttl(t.group))&&t.group.hearts<=2);
    if(b.hasCoffee()){
      const ts=g.tables.filter(t=>t.group&&t.group.seated&&!t.group.coffee).sort((a,c)=>ttl(a.group)-ttl(c.group));
      if(ts.length) add(ttl(ts[0].group)-tw(ts[0]),()=>g.tapTable(ts[0]));
      else add(30,()=>g.tapStation('trash',723,500));
    } else if(coffeeT.length&&can('coffee')){
      const t=coffeeT.sort((a,c)=>ttl(a.group)-ttl(c.group))[0];
      add(ttl(t.group)-sw('coffee')-walk(ST.coffee.ap.x,ST.coffee.ap.y,t.cx,t.cy)+2,()=>g.tapStation('coffee',810,350));
    }
    // louça: largar na pia a que está na mão; lavar quando faltam pratos (ou se ninguém mais lava)
    if(dirtyN) add(Math.min(10,plateNeed-6)+sw('sink'),()=>g.tapStation('sink',850,450));
    else if(k.sinkN>0&&!(dani&&dani.washing)){
      const helper=g.otherWasher;
      if(k.clean<=0) add(plateNeed-6-sw('sink')-L.WASH.base,()=>g.tapStation('sink',850,450));
      else if(!helper) add(25+sw('sink'),()=>g.tapStation('sink',850,450));
    }
    // sucos
    const jt=g.tables.filter(t=>t.group&&t.group.juiceOpen&&t.group.juicePending>0);
    if(b.juiceN()){ const t=jt.slice().sort((a,c)=>(c.group.state==='wantBill')-(a.group.state==='wantBill'))[0]; if(t) add((t.group.state==='wantBill'?ttl(t.group):20)-tw(t),()=>g.tapTable(t)); }
    const need=jt.reduce((n,t)=>n+t.group.juicePending,0)-b.juiceN();
    if(need>0&&can('juice')) add(18+sw('juice'),()=>{
      let n=0; const sim=b.hands.slice();
      while(n<need&&n<6&&L.handLayout(sim.concat([{kind:'juice'}]),b.tray)){ sim.push({kind:'juice'}); n++; }
      for(let i=0;i<n;i++) g.tapStation('juice',910,350);
    });
    // lixo e água
    if(g.trash>=L.TRASH.cap-1&&!b.hands.length&&!(dani&&dani.does('lixo'))) add(g.trashFull?12:22,()=>g.tapStation('trash',723,500));
    if(g.up.agua&&g.agua<=1&&g.money>=L.AGUA.price&&!(dani&&dani.does('agua'))&&!b.hands.length) add(g.queue.length?16:26,()=>g.tapStation('agua',182,140));
    if(!cands.length) return;
    cands.sort((a,c)=>a[0]-c[0]);
    cands[0][1]();
  };
}
// v7.4: móveis na lojinha (1 compra por visita). Regra simples: mesa de 4 enquanto houver grupos perdidos por falta
// de mesa (semMesa) no último dia, senão mesa de 2; depois, a arrumação automática. reserva: o dinheiro que fica guardado
module.exports.moveis=function(g,L,semMesa,reserva,estrategia){
  const p=g.ponto, mesas=g.save.salao.mesas, lug=L.salaoLugares(mesas), S=L.SALAO, sobra=c=>g.save.bank-c>=(reserva||0);
  let ok=false;
  if(estrategia==='quatro'){   // vira as mesas de 2 em mesas de 4 e depois compra mesas de 4 (o que mais rende com equipe)
    const i=mesas.findIndex(m=>m.seats===2);
    if(i>=0 && mesas.length>2 && lug+2<=p.lugares){ if(sobra(S.virar)) ok=g.virarMesa(i); }
    else if(lug+4<=p.lugares){ if(sobra(S.mesa4)) ok=g.buyMesa(4); }
    else if(lug+2<=p.lugares && sobra(S.mesa2)) ok=g.buyMesa(2);
  } else if(semMesa>0){
    const i=mesas.findIndex(m=>m.seats===2);
    if(lug+4<=p.lugares){ if(sobra(S.mesa4)) ok=g.buyMesa(4); }
    else if(i>=0 && lug+2<=p.lugares && sobra(S.virar)) ok=g.virarMesa(i);
  } else if(lug+2<=p.lugares && sobra(S.mesa2)) ok=g.buyMesa(2);
  g.arrumarSalao();
  return ok;
};
