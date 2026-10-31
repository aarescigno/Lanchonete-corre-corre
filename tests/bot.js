// bot compartilhado. opts.afiado: o "jogador perfeito" da v7.1 (ver afiado abaixo)
// opts.conserto (v8): chama o técnico na hora quando o equipamento quebra, como o jogador que toca na plaquinha:
//   true ou 'fogao' conserta só o fogão (o que mais pesa: cozinha 20% mais devagar); 'todos' conserta também geladeira e cafeteira
module.exports=function(g,L,opts){
  const base=baseBot(g,L,opts), cs=opts&&opts.conserto;
  if(!cs) return base;
  const ids=cs==='todos'?['fogao','geladeira','cafeteira']:['fogao'];
  return function botStep(){ for(const id of ids) if(g.quebrado(id)) g.consertar(id); base(); };
};
// v9.6: a Cami em "Minhas mesas" cuida do pedido à conta das mesas dela: a Bia não mexe nelas (só entrega o prato que já pegou)
function delaCami(g){ return t=>!!(t&&t.cami&&g.camiMesasOn&&g.cami&&g.cami.active); }
function baseBot(g,L,opts){
  if(opts&&opts.afiado) return afiado(g,L);
  const dela=delaCami(g);
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
    // marmitas (v8.6): a que está na mão vai ao balcão de retirada; a de quem espera no balcão, pronta na janela, vai buscar
    if(b.hands.some(h=>h.kind==='marmita') && !has(a=>a.type==='retirada')) return g.tapStation('retirada');
    if(g.kitchen.plates){ const i=g.kitchen.plates.findIndex(p=>p&&p.kind==='marmita'&&p.dono&&!p.dani); const p=g.kitchen.plates[i];
      if(p&&can('marmita')&&!has(a=>a.type==='plate'&&a.pid===p.id)) return g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y); }
    if(b.hands.some(h=>h.kind==='ticket') && !has(a=>a.type==='order')) return g.tapStation('order',800,150);
    const d=b.hands.find(h=>h.kind==='dish');
    if(d && !has(a=>a.type==='table'&&a.id===d.table)) return g.tapTable(g.tables[d.table-1]);
    // v9: o motorista que acabou de comer espera o cafezinho: leva se já está na mão, senão busca
    const mt=g.tables.find(t=>t.group&&t.group.cafeBalao&&!t.group.daniCoffee);
    if(mt){ if(b.hands.some(h=>h.kind==='coffee')){ if(!has(a=>a.type==='table'&&a.id===mt.id)) return g.tapTable(mt); } else if(can('coffee')&&!has(a=>a.type==='coffee')) return g.tapStation('coffee',810,350); }
    // v9.2, doces: leva os que carrega a quem espera; busca (até o que cabe) se alguém pediu e nenhum ajudante faz a tarefa "Doce"
    const dt=g.tables.filter(t=>t.group&&t.group.esperaSuco&&t.group.docesFalta>0);
    if(b.hands.some(h=>h.kind==='doce')){ const t=dt.find(t=>!has(a=>a.type==='table'&&a.id===t.id)); if(t) return g.tapTable(t); }
    else if(dt.length&&!ajd(g,h=>h.does('doce'))){   // busca de uma vez todos os doces que couberem (como os sucos)
      const needD=dt.reduce((n,t)=>n+t.group.docesFalta,0)-b.acts.filter(a=>a.type==='doces').length; let k=0; const sim=b.hands.slice();
      while(k<needD && b.acts.length+k<L.filaMax(g.up) && L.handLayout(sim.concat([{kind:'doce'}]),b.tray)){ sim.push({kind:'doce'}); k++; }
      for(let i=0;i<k;i++) g.tapStation('doces',714,120);
      if(k) return;
    }
    // v9.3, cafés da máquina de espresso: o mesmo (busca se ninguém faz a tarefa "Café", do Joca)
    const ct=g.tables.filter(t=>t.group&&t.group.esperaSuco&&t.group.cafesFalta>0);
    if(b.hands.some(h=>h.kind==='cafeesp')){ const t=ct.find(t=>!has(a=>a.type==='table'&&a.id===t.id)); if(t) return g.tapTable(t); }
    else if(ct.length&&!ajd(g,h=>h.does('cafe'))){
      const needC=ct.reduce((n,t)=>n+t.group.cafesFalta,0)-b.acts.filter(a=>a.type==='espresso').length; let k=0; const sim=b.hands.slice();
      while(k<needC && b.acts.length+k<L.filaMax(g.up) && L.handLayout(sim.concat([{kind:'cafeesp'}]),b.tray)){ sim.push({kind:'cafeesp'}); k++; }
      for(let i=0;i<k;i++) g.tapStation('espresso',717,345);
      if(k) return;
    }
    // v9.5, drinks do Anselmo: leva os que carrega à mesa de cada um; pega os copos prontos no balcão quando cabe
    const dkt=g.tables.filter(t=>t.group&&t.group.drinkOpen&&b.hands.some(h=>h.kind==='drink'&&h.group===t.group));
    if(dkt.length){ const t=dkt.find(t=>!has(a=>a.type==='table'&&a.id===t.id)); if(t) return g.tapTable(t); }
    else if(g.drinkPronto.length&&can('drink')&&!has(a=>a.type==='drinks')) return g.tapStation('drinks',650,120);
    // sucos: leva os que estiver carregando e busca mais se alguma mesa ainda espera
    const jt=g.tables.filter(t=>t.group&&t.group.juiceOpen&&t.group.juicePending>0);
    if(b.hands.some(h=>h.kind==='juice')){ const t=jt.find(t=>!has(a=>a.type==='table'&&a.id===t.id)); if(t) return g.tapTable(t); }
    if(b.hands.some(h=>h.kind==='dirty') && !has(a=>a.type==='sink')) return g.tapStation('sink',850,450);
    // lixeira quase cheia e mãos vazias: esvazia (se a Dani não estiver cuidando disso)
    if(g.trash!==undefined && g.trash>=L.TRASH.cap-1 && !b.hands.length && !has(a=>a.type==='trash') && !ajd(g,h=>h.does('lixo'))) return g.tapStation('trash',723,500);
    // louça esperando na pia (2º toque, sem louça na mão): lava se ninguém mais lava, ou se faltam
    // pratos e a pia acumulou; nunca enquanto a Dani lava (só 1 pessoa lava por vez)
    const helper=g.otherWasher!==undefined?g.otherWasher:(g.dani&&g.dani.does('lavar'));
    if(g.kitchen.sinkN>0 && (!helper || (g.kitchen.clean<=0 && g.kitchen.sinkN>=2)) && !has(a=>a.type==='sink') && !b.hands.some(h=>h.kind==='dirty') && !ajd(g,h=>h.washing)) return g.tapStation('sink',850,450);
    for(const t of g.tables){
      if(!t.open||dela(t)||has(a=>a.type==='table'&&a.id===t.id)||ajd(g,h=>h.targets(t))) continue;
      if(t.dirty||(t.group&&(t.group.state==='wantOrder'||t.group.state==='wantBill'))){ if(can(t.dirty?'dirty':'ticket')||t.group&&t.group.state==='wantBill') return g.tapTable(t); }
    }
    for(let i=0;i<L.LAYOUT.PLATE_SLOTS.length;i++){ const p=g.kitchen.plates[i]; if(p&&!p.dani&&!(p.group&&dela(p.group.table))&&can('dish')&&!has(a=>a.type==='plate'&&a.pid===p.id)) return g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y); }
    const need=jt.reduce((n,t)=>n+t.group.juicePending,0), carry=b.hands.filter(h=>h.kind==='juice').length+b.acts.filter(a=>a.type==='juice').length;
    // busca de uma vez todos os sucos que couberem (a fila de ações conta como já nas mãos)
    if(need>carry && !has(a=>a.type==='juice')){
      let k=0; const sim=b.hands.slice();
      while(k<need-carry && b.acts.length+k<L.filaMax(g.up) && L.handLayout(sim.concat([{kind:'juice'}]),b.tray)){ sim.push({kind:'juice'}); k++; }
      for(let i=0;i<k;i++) g.tapStation('juice',910,350);
      if(k) return;
    }
    // suco da espera pronto na máquina (v7.5), quando não há mais nada: busca e leva (se a Dani não estiver cuidando disso)
    if(g.up&&g.up.maquina&&g.maqLivre&&g.maqLivre()&&!b.acts.length&&can('suco')&&!ajd(g,h=>h.does('suco'))) return g.tapStation('maquina');
  };
}

// v9.2: algum ajudante (Dani ou Joca) cumpre o teste fn?
function ajd(g,fn){ return (g.ajud||(g.dani?[g.dani]:[])).some(fn); }
// Bot afiado (v7.1): faz uma ação de cada vez, sempre a mais urgente. A urgência é o tempo que o grupo
// ainda aguenta (corações × paciência) menos a caminhada até lá. Senta qualquer grupo da fila que caiba
// (o mais apressado primeiro, na menor mesa), serve cafezinho a quem está por um fio e lava a louça
// quando faltam pratos. Serve para medir se dá para não perder ninguém jogando muito bem.
function afiado(g,L){
  const dela=delaCami(g);
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
    // marmitas (v8.6): a do entregador que espera, na mão ou pronta na janela; a sem dono vai para a prateleira com folga.
    // Adiantar (PEDIDOS sem comanda) quando não há nada mais urgente
    const RT=ST.retirada, livres=g.prateleira?g.prateleira.filter(m=>!m.dono).length:0;
    b.hands.filter(h=>h.kind==='marmita').forEach(h=>add(h.dono?ttl(h.dono)-from(RT.ap):(livres<g.vagas?30:Infinity),()=>g.tapStation('retirada')));
    k.plates.forEach((p,i)=>{ if(!p||p.kind!=='marmita'||p.dani||!can('marmita')) return;
      add(p.dono?ttl(p.dono)-sw('plates')-walk(ST.plates.ap.x,ST.plates.ap.y,RT.ap.x,RT.ap.y):(livres<g.vagas?32:Infinity),()=>g.tapStation('plates',SL[i].x,SL[i].y)); });
    // v9: com a encomenda do setor avisada (e ainda sem chegar), adianta PF até o tamanho do lote (a encomenda reaproveita as sem dono)
    const encPend=g.encomendaDia&&!g.groups.some(x=>x.lote)&&g.schedule.some(s=>s.type==='encomenda'&&g.nextIdx<=g.schedule.indexOf(s));
    const livresMax=encPend?Math.min(g.vagas,g.encomendaDia.lote-1):1;
    if(g.marmitaOk&&g.marmitasLivres<livresMax&&(g.clock>45||encPend)&&!b.hands.some(h=>h.kind==='ticket')) add(encPend?20+sw('order'):36+sw('order'),()=>g.tapStation('adiantar'));
    // pratos e comandas que a Bia carrega
    b.hands.filter(h=>h.kind==='dish').forEach(h=>{ const t=g.tables[h.table-1]; add(ttl(h.group)-tw(t),()=>g.tapTable(t)); });
    const tk=b.hands.filter(h=>h.kind==='ticket');
    if(tk.length) add(Math.min(...tk.map(h=>ttl(h.group)))-sw('order')-6,()=>g.tapStation('order',800,150));
    // pratos prontos no balcão
    k.plates.forEach((p,i)=>{ if(!p||p.kind==='marmita'||!can('dish')) return; const t=tableOf(p.group); if(!t||dela(t)) return;
      add(ttl(p.group)-sw('plates')-walk(ST.plates.ap.x,ST.plates.ap.y,t.cx,t.cy),()=>g.tapStation('plates',SL[i].x,SL[i].y)); });
    // grupos esperando nas mesas (pedido, conta) e mesas sujas
    const ordered=g.tables.filter(t=>t.group&&t.group.state==='ordered').map(t=>ttl(t.group));
    const plateNeed=k.clean<=0?Math.min(Infinity,...ordered):Infinity;
    for(const t of g.tables){
      if(!t.open||dela(t)||ajd(g,h=>h.targets(t))) continue;
      const grp=t.group;
      if(grp&&grp.state==='wantOrder'&&can('ticket')) add(ttl(grp)-tw(t),()=>g.tapTable(t));
      else if(grp&&grp.state==='wantBill'){
        if(grp.juicePending>0&&b.juiceN()===0&&!ajd(g,h=>h.active)) { /* conta mesmo assim, mais tarde */ add(ttl(grp)-tw(t)+4,()=>g.tapTable(t)); }
        else add(ttl(grp)-tw(t),()=>g.tapTable(t));
      }
      else if(t.dirty&&can('dirty')){
        const waits=g.queue.filter(x=>x.size<=t.seats&&!g.tables.some(o=>o.free&&o.seats>=x.size)).map(ttl);
        const sc=Math.min(waits.length?Math.min(...waits):40, plateNeed-6)-tw(t);
        add(sc,()=>g.tapTable(t));
      }
    }
    // cafezinho: a quem está com 2 corações ou menos (e ainda não tomou)
    const coffeeT=g.tables.filter(t=>t.group&&!t.group.coffee&&isFinite(ttl(t.group))&&(t.group.hearts<=2||t.group.cafeBalao));   // v9: o motorista que espera o cafezinho
    if(b.hasCoffee()){
      const ts=g.tables.filter(t=>t.group&&t.group.seated&&!t.group.coffee).sort((a,c)=>(!!c.group.cafeBalao)-(!!a.group.cafeBalao)||ttl(a.group)-ttl(c.group));
      if(ts.length) add(ttl(ts[0].group)-tw(ts[0]),()=>g.tapTable(ts[0]));
      else add(30,()=>g.tapStation('trash',723,500));
    } else if(coffeeT.length&&can('coffee')){
      const t=coffeeT.sort((a,c)=>ttl(a.group)-ttl(c.group))[0];
      add(ttl(t.group)-sw('coffee')-walk(ST.coffee.ap.x,ST.coffee.ap.y,t.cx,t.cy)+2,()=>g.tapStation('coffee',810,350));
    }
    // v9.2, doces: leva os que carrega; busca se alguém terminou de comer e espera (e nenhum ajudante faz a tarefa "Doce")
    const dtb=g.tables.filter(t=>t.group&&t.group.esperaSuco&&t.group.docesFalta>0);
    if(b.hands.some(h=>h.kind==='doce')){ if(dtb.length) add(ttl(dtb[0].group)-tw(dtb[0]),()=>g.tapTable(dtb[0])); }
    else if(dtb.length&&can('doce')&&!ajd(g,h=>h.does('doce'))) add(ttl(dtb[0].group)-sw('doces')-walk(ST.doces.ap.x,ST.doces.ap.y,dtb[0].cx,dtb[0].cy),()=>{
      const needD=dtb.reduce((n,t)=>n+t.group.docesFalta,0); let k=0; const sim=b.hands.slice();   // todos os doces que couberem de uma vez
      while(k<needD && b.acts.length+k<L.filaMax(g.up) && L.handLayout(sim.concat([{kind:'doce'}]),b.tray)){ sim.push({kind:'doce'}); k++; }
      for(let i=0;i<k;i++) g.tapStation('doces',714,120);
    });
    // v9.3, cafés da máquina de espresso
    const ctb=g.tables.filter(t=>t.group&&t.group.esperaSuco&&t.group.cafesFalta>0);
    if(b.hands.some(h=>h.kind==='cafeesp')){ if(ctb.length) add(ttl(ctb[0].group)-tw(ctb[0]),()=>g.tapTable(ctb[0])); }
    else if(ctb.length&&can('cafeesp')&&!ajd(g,h=>h.does('cafe'))) add(ttl(ctb[0].group)-sw('espresso')-walk(ST.espresso.ap.x,ST.espresso.ap.y,ctb[0].cx,ctb[0].cy),()=>{
      const needC=ctb.reduce((n,t)=>n+t.group.cafesFalta,0); let k=0; const sim=b.hands.slice();
      while(k<needC && b.acts.length+k<L.filaMax(g.up) && L.handLayout(sim.concat([{kind:'cafeesp'}]),b.tray)){ sim.push({kind:'cafeesp'}); k++; }
      for(let i=0;i<k;i++) g.tapStation('espresso',717,345);
    });
    // v9.5, drinks do Anselmo: leva os que carrega; busca os prontos no balcão
    const dkb=g.tables.filter(t=>t.group&&t.group.drinkOpen&&b.hands.some(h=>h.kind==='drink'&&h.group===t.group));
    if(dkb.length) add(ttl(dkb[0].group)-tw(dkb[0]),()=>g.tapTable(dkb[0]));
    if(g.drinkPronto.length&&can('drink')&&!has(a=>a.type==='drinks')){ const o=g.drinkPronto[0], to=g.tables.find(t=>t.group===o.grp); add((to?ttl(o.grp):20)-sw('drinks')-(to?walk(ST.drinks.ap.x,ST.drinks.ap.y,to.cx,to.cy):0),()=>g.tapStation('drinks',650,120)); }
    // louça: largar na pia a que está na mão; lavar quando faltam pratos (ou se ninguém mais lava)
    if(dirtyN) add(Math.min(10,plateNeed-6)+sw('sink'),()=>g.tapStation('sink',850,450));
    else if(k.sinkN>0&&!ajd(g,h=>h.washing)){
      const helper=g.otherWasher;
      if(k.clean<=0) add(plateNeed-6-sw('sink')-L.WASH.base,()=>g.tapStation('sink',850,450));
      else if(!helper) add(25+sw('sink'),()=>g.tapStation('sink',850,450));
    }
    // sucos
    const jt=g.tables.filter(t=>t.group&&t.group.juiceOpen&&t.group.juicePending>0);
    if(b.juiceN()){ const t=jt.slice().sort((a,c)=>(!!c.group.esperaSuco)-(!!a.group.esperaSuco))[0]; if(t) add((t.group.esperaSuco?ttl(t.group):20)-tw(t),()=>g.tapTable(t)); }
    const need=jt.reduce((n,t)=>n+t.group.juicePending,0)-b.juiceN();
    if(need>0&&can('juice')) add(18+sw('juice'),()=>{
      let n=0; const sim=b.hands.slice();
      while(n<need&&n<L.filaMax(g.up)&&L.handLayout(sim.concat([{kind:'juice'}]),b.tray)){ sim.push({kind:'juice'}); n++; }
      for(let i=0;i<n;i++) g.tapStation('juice',910,350);
    });
    // lixo e suco da espera (v7.5: a máquina no lugar da água)
    if(g.trash>=L.TRASH.cap-1&&!b.hands.length&&!ajd(g,h=>h.does('lixo'))) add(g.trashFull?12:22,()=>g.tapStation('trash',723,500));
    const mo=g.up.maquina&&!ajd(g,h=>h.does('suco'))&&g.maqLivre();
    // a ida lá fora é longa: só com folga (nada mais urgente) ou para quem espera por um fio
    if(mo&&can('suco')){ const tg=ttl(mo.group), trip=sw('maquina')+walk(ST.maquina.ap.x,ST.maquina.ap.y,mo.group.x,mo.group.y); add(tg<12?tg-trip:40,()=>g.tapStation('maquina')); }
    if(!cands.length) return;
    cands.sort((a,c)=>a[0]-c[0]);
    cands[0][1]();
  };
}
// v8.6.9: cursos do Tonhão. A ordem é uma lista de ids: a 1ª vez que o id aparece é o degrau 1 (o básico; no PF, o avançado, que não tem
// básico), a 2ª é o avançado. Padrão: os 4 básicos, depois os avançados (CURSOS=chapa,pastel,... troca a lista inteira)
const CURSOS_ORDEM=['pastel','veg','chapa','fritos','assados','pf','fritos','pastel','chapa','assados','veg'];   // v8.6.11: o Vegetariano logo depois do pastel, os Pratos veganos no fim
function proximoCurso(L,cursos,ordem){
  const vistos={};
  for(const id of ordem){ vistos[id]=(vistos[id]||0)+1; const alvo=id==='pf'?2:vistos[id]; if(L.cursoNivel(cursos,id)<alvo&&!(id==='pf'&&vistos[id]>1)) return {id,nivel:alvo}; }
  return null;
}
// os cursos de quem já fez as k primeiras compras da ordem (o balance.js, que joga os dias soltos)
module.exports.cursosApos=function(L,k,ordem){
  const cu={}; ordem=ordem||CURSOS_ORDEM;
  for(let i=0;i<k;i++){ const p=proximoCurso(L,cu,ordem); if(!p) break; cu[p.id]=p.nivel; }
  return cu;
};
// compra o próximo curso da ordem se sobrar o preço mais a reserva (a carreira.js); devolve o id comprado ou ''
module.exports.cursos=function(g,L,reserva,ordem){
  const p=proximoCurso(L,g.save.cursos,ordem||CURSOS_ORDEM); if(!p) return '';
  const c=g.cursoProx(p.id); if(!c||c.nivel!==p.nivel) return '';
  return g.save.bank-c.preco>=(reserva||0)&&g.buyCurso(p.id)?p.id+p.nivel:'';
};
module.exports.CURSOS_ORDEM=CURSOS_ORDEM;
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
