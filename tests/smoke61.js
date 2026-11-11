// v10.1, etapa 4a-2: o VIP exigente e a reputação. No Terraço Suíça todo VIP é exigente (Avenida e Garagem não): o prato da casa (R$ 40 na conta, ×2 o tempo,
// ×1,3 e sempre caprichado com o Tonhão no nível 4), a bebida antes da entrada, o salão em ordem (mesa suja há mais de 6 s), a gorjeta de 20% (e mais 20% com 5
// corações), a avaliação que sempre vem e conta 2 vezes, o bravo que tira 10% do movimento do dia seguinte, a reputação (nota do Gurugol) na chance de VIP, a Louça
// fina, a conversa do fim do dia, as fichas do Manual e o save.
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<20){ toque(H.els); n++; } return n; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const grid=H=>H.els['shop-grid'];
const jogo=(cap,ponto,sv)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto:ponto||'garagem' } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const terr=(sv,cap)=>{ const H=jogo(cap||8,'terraco',Object.assign({ bank:5000, v10:1, daniCursos:{ confCaseira:1 }, up:{ tenis:true, fogaoInd:true }, equipe:{ tonhao:3, dani:2, anselmo:2 } },sv||{})); H.g.startDay(10); H.els['btn-start'].fire('click'); H.g.schedule=[]; H.g.nextIdx=0; return H; };
const sentar=(g,type,vip)=>{ const grp=g.spawn({ type:type||'casal', color:0, vip:!!vip, av:true }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantOrder'); return { grp, t, g }; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const preco=(L,g,k)=>k?L.precoPrato(k,g.ponto,g.cursos):0;
const notaDe=(g,v,n)=>{ g.save.aval=Array(n||30).fill([v,v,v,v,v]); };
const entrega=(x,tempo,extra)=>{ x.g.bia.hands=[Object.assign({ kind:'dish', table:x.t.id, group:x.grp, dish:'pf', q:4, tempo },extra||{})]; x.grp.setState('ordered'); x.grp.tempo=tempo; x.g.bia.perform({ type:'table', id:x.t.id }); };
const tempoDe=(g,grp,t)=>{ g.kitchen.queue=[]; g.kitchen.cooking=[]; g.kitchen.submitTempo(grp,t.id,1); return g.kitchen.queue[0].time; };

// ---------- 1. no Terraço todo VIP é exigente; na Avenida e na Garagem, não ----------
{ const H=terr(), {g,L}=H;
  ok(g.ponto.exigente===true && L.PONTOS[2].exigente===undefined && L.PONTOS[0].exigente===undefined,'só o Terraço tem `exigente`');
  const a=g.spawn({ type:'casal', color:0, vip:true, av:true }), b=g.spawn({ type:'familia', color:0, vip:false, av:true });
  ok(a.vip && a.exigente===true && !b.exigente,'no Terraço o VIP é exigente e o cliente comum não');
  ok(a.people.every(p=>!p.shades && (p.chapeu||p.lenco||p.echarpe) && /^#/.test(p.accC)),'sem óculos escuros: cada pessoa leva chapéu, lenço de seda ou echarpe, em uma cor');
  const acc=new Set(); for(let i=0;i<60;i++){ const q=new L.Group(g,'familia',900+i,0,true); q.people.forEach(p=>acc.add(['chapeu','lenco','echarpe'].find(k=>p[k]))); }
  ok(acc.size===3,'os três acessórios saem no sorteio');
  const H2=jogo(9,'avenida'); H2.g.startDay(10); H2.els['btn-start'].fire('click'); const av=H2.g.spawn({ type:'executiva', color:0, vip:true, av:true });
  ok(av.vip && !av.exigente && av.people.every(p=>p.shades && !p.chapeu),'na Avenida o VIP é o de sempre (óculos escuros)');
  const H3=nova(); H3.g.startDay(1); H3.els['btn-start'].fire('click'); ok(!H3.g.spawn({ type:'estudante', color:0, vip:true, av:true }).exigente,'na Garagem também não'); }

// ---------- 2. o prato da casa ----------
{ const H=terr(), {g,L}=H, k=g.kitchen, E=L.EXIGENTE;
  ok(E.casa.preco===40 && E.casa.cook===2 && E.casa.cookBom===1.3 && E.casa.nivel===3,'EXIGENTE.casa: R$ 40, ×2, ×1,3 e nível 3 (o 4º do Tonhão)');
  const x=sentar(g,'casal',true), grp=x.grp;
  ok(grp.bill===grp.dishes.concat(grp.extras).reduce((v,q)=>v+preco(L,g,q),0)+40,'a conta soma R$ 40 do prato da casa (no lugar do prato especial de R$ 12)');
  // Tonhão abaixo do nível 4: ×2 e sem garantia de capricho
  g.save.equipe.tonhao=2; const cook=k.chef.cook; let tm=tempoDe(g,grp,x.t); ok(tm>=4*cook*2-1e-9 && tm<=7*cook*2+1e-9 && !L.casaBoa(grp,g),'Tonhão abaixo do nível 4: o principal leva ×2 o tempo');
  for(let i=0;i<600 && !k.plates.some(q=>q&&q.group===grp);i++) g.update(0.05);
  let pp=k.plates.find(q=>q&&q.group===grp); ok(pp && pp.casa===true && pp.tempo===1,'o prato pronto leva a marca da casa');
  // Tonhão no nível 4: ×1,3 e sempre caprichado
  const H2=terr(), g2=H2.g, k2=g2.kitchen, x2=sentar(g2,'casal',true); g2.save.equipe.tonhao=3; const cook2=k2.chef.cook;
  tm=tempoDe(g2,x2.grp,x2.t); ok(tm>=4*cook2*1.3-1e-9 && tm<=7*cook2*1.3+1e-9 && L.casaBoa(x2.grp,g2),'Tonhão no nível 4: ×1,3 o tempo');
  let sempre=true; for(let n=0;n<8;n++){ const y=sentar(g2,'casal',true); k2.plates=k2.plates.map(()=>null); k2.clean=5; k2.queue=[]; k2.cooking=[]; k2.submitTempo(y.grp,y.t.id,1); for(let i=0;i<600 && !k2.plates.some(q=>q&&q.group===y.grp);i++) g2.update(0.05);
    const q=k2.plates.find(r=>r&&r.group===y.grp); if(!q || !q.crit || q.q!==5 || !q.casa) sempre=false; y.t.group=null; y.grp.setState('leaving'); g2.groups=g2.groups.filter(r=>r!==y.grp); }
  ok(sempre,'com o Tonhão no nível 4 o prato da casa sai sempre caprichado (nota 5)');
  // a Louça fina: 25% mais rápido
  g2.up.louca=true; tm=tempoDe(g2,x2.grp,x2.t); ok(tm>=4*cook2*1.3*0.75-1e-9 && tm<=7*cook2*1.3*0.75+1e-9,'com a Louça fina o prato da casa fica 25% mais rápido');
  // o prato especial (VIP sem ser exigente) também
  const Ha=jogo(9,'avenida',{ up:{ tenis:true, louca:true } }); Ha.g.startDay(10); Ha.els['btn-start'].fire('click'); const ga=Ha.g, xa=sentar(ga,'executiva',true), ca=ga.kitchen.chef.cook; ga.kitchen.submit({ group:xa.grp, table:xa.t.id });
  const ta=ga.kitchen.queue.concat(ga.kitchen.cooking)[0].time; ok(ta>=4*ca*1.8*0.75*(1+L.MAIS.cozinha*xa.grp.extras.filter(Boolean).length/xa.grp.size)-1e-6 && ta<=7*ca*1.8*0.75*(1+L.MAIS.cozinha*xa.grp.extras.filter(Boolean).length/xa.grp.size)+1e-6,'a Louça fina também acelera o prato especial do VIP comum');
  // o prato na mão e no balão
  const H3=terr(), g3=H3.g, x3=sentar(g3,'casal',true); H3.g.bia.hands=[]; g3.kitchen.submitTempo(x3.grp,x3.t.id,1); for(let i=0;i<800 && !g3.kitchen.plates.some(q=>q&&q.group===x3.grp);i++) g3.update(0.05);
  const p3=g3.kitchen.plates.find(q=>q&&q.group===x3.grp); g3.bia.hands=[]; g3.bia.perform({ type:'plate', pid:p3.id }); ok(g3.bia.hands.length===1 && g3.bia.hands[0].casa===true,'o prato da casa na mão da Bia leva a marca (a estrelinha dourada)');
  const f0=g3.fx.length; x3.grp.setState('ordered'); x3.grp.tempo=1; g3.bia.perform({ type:'table', id:x3.t.id }); ok(g3.fx.some(f=>f.text==='Prato da casa!'),'na entrega aparece "Prato da casa!"'); }

// ---------- 3. a bebida primeiro ----------
{ const H=terr(), {g}=H, x=sentar(g,'casal',true), grp=x.grp;
  grp.drinks=[]; grp.juiceWant=2; grp.juiceGot=0; grp.hearts=5; g.save.aval=[];
  entrega(x,0); ok(grp.bebCobrou===true && grp.hearts===4 && g.fx.some(f=>f.text==='E a minha bebida?'),'entrada antes da bebida: perde 1 coração e diz "E a minha bebida?"');
  grp.hearts=5; entrega(x,1); ok(grp.hearts===5,'uma vez só por grupo (o principal sem bebida não cobra de novo)');
  const y=sentar(g,'casal',true), q=y.grp; q.drinks=[]; q.juiceWant=2; q.juiceGot=2; q.hearts=5; entrega(y,0); ok(q.hearts===5 && !q.bebCobrou,'com a bebida já entregue, a entrada não custa coração');
  const z=sentar(g,'casal',false), c=z.grp; c.drinks=[]; c.juiceWant=2; c.juiceGot=0; c.hearts=5; entrega(z,0); ok(c.hearts===5 && !c.exigente,'o cliente comum não cobra'); }

// ---------- 4. o salão em ordem ----------
{ const H=terr(), {g,L}=H, E=L.EXIGENTE; const ult=g.tables[g.tables.length-1]; g.schedule=[{ t:99999, type:'casal', color:0, vip:false }]; g.nextIdx=0;   // o dia segue aberto
  g.dani.update=g.joca.update=g.cami.update=()=>{};   // ninguém limpa a mesa
  ult.dirty=true; ult.dirtyN=2; ult.sujaT=0; roda(g,2); ok(ult.sujaT>1.9 && ult.sujaT<2.2,'a mesa suja conta há quanto tempo está suja (t.sujaT)');
  ult.dirty=false; roda(g,0.2); ok(ult.sujaT===0,'limpa a mesa, o contador volta a zero');
  ult.dirty=true; ult.sujaT=E.sujaT+1; const a=g.spawn({ type:'casal', color:0, vip:true, av:true }), ta=g.tables.find(q=>q.free&&q.seats>=a.size); g.seatGroup(a,ta);
  ok(a.hearts===4 && g.fx.some(f=>f.text==='Que salão bagunçado!'),'mesa suja há mais de 6 s ao sentar: o exigente perde 1 coração e diz "Que salão bagunçado!"');
  ult.sujaT=E.sujaT-3; const b=g.spawn({ type:'casal', color:0, vip:true, av:true }), tb=g.tables.find(q=>q.free&&q.seats>=b.size); g.seatGroup(b,tb); ok(b.hearts===5,'suja há menos de 6 s: nada');
  ult.sujaT=E.sujaT+5; const c=g.spawn({ type:'casal', color:0, vip:false, av:true }), tc=g.tables.find(q=>q.free&&q.seats>=c.size); g.seatGroup(c,tc); ok(c.hearts===5,'o cliente comum não repara'); }

// ---------- 5. a gorjeta ----------
{ const H=terr(), {g,L}=H, x=sentar(g,'casal',true), grp=x.grp, E=L.EXIGENTE;
  const paga=(h)=>{ grp.setState('wantBill'); grp.hearts=h; grp.juiceWant=0; grp.drinks=[]; grp.bebConta=0; g.lastKind=null; g.money=0; g.collectBill(grp,x.t); return g.money; };
  const m5=paga(5); ok(m5===Math.round(grp.bill*(1+L.GORJETA[5]+grp.T.tip+E.tip+E.generosa)),'5 corações: gorjeta de 20% mais 20% da conta ('+m5+' de '+grp.bill+')');
  const y=sentar(g,'casal',true), q=y.grp; q.setState('wantBill'); q.hearts=4; q.juiceWant=0; q.drinks=[]; q.bebConta=0; g.lastKind=null; g.money=0; g.collectBill(q,y.t);
  ok(g.money===Math.round(q.bill*(1+L.GORJETA[4]+q.T.tip+E.tip)),'4 corações: só os 20% do exigente');
  ok(g.fx.some(f=>f.text==='Gorjeta generosa!'),'o texto "Gorjeta generosa!" aparece com 5 corações'); }

// ---------- 6. sempre avalia e a nota conta 2 vezes ----------
{ const H=terr(), {g,L}=H; g.save.aval=[];
  const d=Object.assign({},g.day,{ vip:0.1, groups:60 });
  let semAv=0, avN=0, bomN=0, total=0;
  for(let i=0;i<60;i++){ const sc=g.buildSchedule(d); const vips=sc.filter(s=>s.vip), outros=sc.filter(s=>!s.vip); if(vips.some(s=>!s.av)) semAv++; avN+=outros.filter(s=>s.av).length; total++; if(outros.length>=L.AVAL.porDia && outros.filter(s=>s.av).length===L.AVAL.porDia) bomN++; }
  ok(semAv===0,'todo VIP exigente do dia avalia');
  ok(bomN===total && avN===total*L.AVAL.porDia,'o sorteio dos '+L.AVAL.porDia+' do dia só conta os clientes comuns');
  const x=sentar(g,'casal',true), grp=x.grp; grp.avalia=true; grp.setState('wantBill'); grp.hearts=5; const n0=g.avals.length, p0=g.avalsPeso().length; g.avaliar(grp,0,0);
  ok(g.avals[n0].x===2 && g.avalsPeso().length===p0+2,'a nota do exigente entra 2 vezes na lista do Gurugol');
  const y=sentar(g,'familia',false); y.grp.avalia=true; y.grp.setState('wantBill'); y.grp.hearts=5; const p1=g.avalsPeso().length; g.avaliar(y.grp,0,0); ok(g.avalsPeso().length===p1+1,'a do cliente comum, 1 vez');
  const ant=g.save.aval.length; g.schedule=[]; g.nextIdx=0; g.money=100; g.custo=0; g.finishDay(); ok(g.save.aval.length===Math.min(L.AVAL.max,ant+3),'no fim do dia entram no save as 3 (2 do exigente + 1)');
  // os comentários
  const seen=new Set(); const orig=Math.random; for(let i=0;i<60;i++){ const z=sentar(H.g,'casal',true); z.grp.avalia=true; z.grp.setState('wantBill'); z.grp.hearts=5; z.grp.perdFila=0; g.avaliar(z.grp,0,0); seen.add(g.avals[g.avals.length-1].txt); z.t.group=null; }
  ok(seen.has('Impecável. Voltarei.') || seen.has('Serviço à altura do endereço.'),'comentário bom do exigente');
  const seen2=new Set(); for(let i=0;i<80;i++){ const z=sentar(H.g,'casal',true); z.grp.avalia=true; z.grp.setState('wantBill'); z.grp.hearts=1; z.grp.perdMesa=4; z.grp.perdFila=3; z.grp.pratoQ=1; z.grp.notaT=[1,1,1,1]; z.grp.fria=true; g.avaliar(z.grp,0,0); seen2.add(g.avals[g.avals.length-1].txt); z.t.group=null; }
  ok(['Esperava mais de um terraço.','Não é para tanto.'].some(t=>seen2.has(t)),'comentário ruim do exigente'); }

// ---------- 7. saiu bravo: o dia seguinte tem 10% menos gente e o aviso ----------
{ const H=terr(), {g,L,els}=H, x=sentar(g,'casal',true), grp=x.grp; g.save.aval=[]; g.save.exigBravo=0;
  const d=Object.assign({},g.day,{ n:11, groups:200 }); const norm=g.buildSchedule(d).length;
  grp.hearts=0; grp.avalia=true; g.angryLeave(grp);
  ok(g.save.exigBravo===g.day.n && g.stats.vipLost===1,'o exigente que sai bravo guarda o dia (save.exigBravo)');
  const ruim=g.buildSchedule(d).length; ok(Math.abs(ruim/norm-0.9)<0.02,'o dia seguinte vem com 10% menos grupos ('+ruim+' contra '+norm+')');
  const d2=Object.assign({},g.day,{ n:12, groups:200 }); ok(g.buildSchedule(d2).length===norm,'dois dias depois, tudo normal');
  const H2=jogo(8,'terraco',{ v10:1, exigBravo:9 }); H2.g.startDay(10); ok(/Um cliente exigente saiu bravo ontem: hoje vem menos gente\./.test(H2.els['intro-manut'].textContent),'o aviso aparece na introdução do dia seguinte');
  const H3=jogo(8,'terraco',{ v10:1, exigBravo:7 }); H3.g.startDay(10); ok(!/exigente/.test(H3.els['intro-manut'].textContent),'sem bravo ontem, sem aviso');
  const Ha=jogo(9,'avenida',{ exigBravo:9 }); Ha.g.startDay(10); ok(Ha.g.exigBravoF(Ha.g.day)===1 && !/exigente/.test(Ha.els['intro-manut'].textContent),'na Avenida nada disso vale'); }

// ---------- 8. a reputação: a nota do Gurugol mexe na chance de VIP ----------
{ const H=terr(), {g,L}=H, E=L.EXIGENTE;
  g.save.aval=[]; ok(g.repVip===1 && L.exigRep(null)===1,'sem nota, o fator é 1');
  ok(Math.abs(L.exigRep(1)-0.6)<1e-9 && Math.abs(L.exigRep(5)-1.4)<1e-9 && Math.abs(L.exigRep(3)-1)<1e-9,'nota 1 → ×0,6; nota 3 → ×1; nota 5 → ×1,4 (em linha reta)');
  const d=Object.assign({},g.day,{ vip:0.3, groups:40 }); const vips=()=>{ let n=0; for(let i=0;i<400;i++) n+=g.buildSchedule(d).filter(s=>s.vip).length; return n; };
  notaDe(g,5); const alto=vips(); notaDe(g,3); const medio=vips(); notaDe(g,1); const baixo=vips();
  ok(alto>medio && medio>baixo,'com nota 5 vêm mais VIPs que com 3, e com 3 mais que com 1 ('+alto+' > '+medio+' > '+baixo+')');
  const Ha=jogo(9,'avenida'); notaDe(Ha.g,5); ok(Ha.g.repVip===1,'na Avenida a reputação não mexe na chance de VIP'); }

// ---------- 9. a Louça fina ----------
{ const H=jogo(8,'terraco',{ v10:1, bank:2000 }), {g,L}=H; g.resetDay(10);
  const u=L.UPGRADES.find(q=>q.id==='louca'); ok(u && u.cost===600 && u.nivel===4 && L.LOUCA.cook===0.75 && L.AVAL.amb.louca===0.5,'Louça fina: R$ 600, do nível 4, ×0,75 no prato da casa e +0,5 no Ambiente');
  H.L.setShopGrupo('lanchonete'); H.L.setShopTab('melhorias'); const t=txt(grid(H));
  ok(/Louça fina/.test(t) && /Comprar R\$ 600/.test(t),'o cartão aparece na aba Melhorias do Terraço, com o preço');
  ok(g.manualAberta('l-louca'),'a ficha l-louca abre com o cartão');
  ok(g.buy('louca') && g.up.louca===true && g.save.bank===1400,'compra por R$ 600');
  const Ha=jogo(9,'avenida',{ bank:2000 }); Ha.g.resetDay(10); Ha.L.setShopGrupo('lanchonete'); Ha.L.setShopTab('melhorias');
  ok(!/Louça fina/.test(txt(grid(Ha))) && !Ha.g.buy('louca') && Ha.g.save.bank===2000,'na Avenida não aparece nem se compra');
  // o Ambiente +0,5: o critério do cliente sobe 0,5 com a Louça fina
  const T=terr({ bank:3000 }), gt=T.g, ra=Math.random; Math.random=()=>0.5;
  const med=(up)=>{ gt.up.louca=up; gt.avals=[]; const x=sentar(gt,'familia',false); x.grp.avalia=true; x.grp.setState('wantBill'); x.grp.hearts=5; gt.avaliar(x.grp,0,0); const s=gt.avals[0].s[4]; x.t.group=null; return s; };
  const sem=med(false), com=med(true); Math.random=ra; ok(Math.abs((com-sem)-0.5)<1e-9,'a Louça fina soma 0,5 ao Ambiente ('+sem+' → '+com+')'); }

// ---------- 10. a conversa, só no Modo História ----------
{ const H=nova({historia:true}), {g,L,els}=H; g.save=L.normSave({ histV:1, cap:8, dia:10, maxDay:10, bank:6000, v10:1, up:{ tenis:true, fogaoInd:true }, equipe:{ tonhao:3, dani:2, anselmo:2 }, daniCursos:{ confCaseira:1 }, salao:{ ponto:'terraco' } });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.save.conversa=null; g.goShop(10); g.startDay(10); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0;
  ok(g.save.convExig===0,'antes de o exigente chegar, a conversa não está pendente');
  g.arrive({ t:0, type:'casal', color:0, vip:true, av:true }); ok(g.stats.exigentes===1 && g.save.exigVisto===1,'o 1º exigente chega: contado, e o aviso do balão fica visto (save.exigVisto)');
  ok(g.fx.some(f=>/Cliente exigente/.test(f.text||'')),'balão do 1º exigente: "Cliente exigente! Duas estrelas: quer tudo no lugar."');
  ok(g.save.manual.indexOf('c-exigente')>=0 && g.save.manualNovo.indexOf('c-exigente')>=0,'a ficha c-exigente abre na 1ª vez que um chega');
  g.groups=[]; g.queue=[]; g.money=100; g.custo=0; g.finishDay();
  ok(g.save.convExig==='pend' && !!g.conversa,'no fim do dia, a conversa do exigente fica pendente e toca');
  const n=passa(H); ok(n>=4 && g.save.convExig===1 && !g.conversa,'a conversa tem '+n+' falas e depois vai a 1');
  ok(L.HIST_EXIGENTE.falas.length===4 && L.HIST_EXIGENTE.falas[0].q==='bia' && L.HIST_EXIGENTE.falas[1].q==='tonhao','HIST_EXIGENTE exposto: 4 falas (Bia, Tonhão, Bia, Tonhão)');
  // sem o Modo História, nada
  const H2=load(), g2=H2.g; g2.save=H2.L.normSave({ cap:8, dia:10, maxDay:10, bank:6000, v10:1, salao:{ ponto:'terraco' } }); g2.up=g2.save.up; g2.tablesKey=''; g2.buildTables(); g2.goShop(10); g2.startDay(10); H2.els['btn-start'].fire('click'); g2.schedule=[]; g2.nextIdx=0;
  g2.arrive({ t:0, type:'casal', color:0, vip:true, av:true }); g2.groups=[]; g2.queue=[]; g2.finishDay(); ok(!g2.save.convExig,'sem o Modo História, nenhuma conversa'); }

// ---------- 11. o Manual ----------
{ const H=jogo(8,'terraco',{ v10:1 }), {g,L}=H;
  const f=L.MANUAL.find(q=>q.id==='c-exigente'), l=L.MANUAL.find(q=>q.id==='l-louca');
  ok(f && f.aba==='clientes' && f.tipo==='exigente' && f.nome==='VIP exigente' && f.linha==='Duas estrelas na plaquinha. Quer tudo no lugar e paga muito bem.','ficha c-exigente (aba Clientes)');
  ok(l && l.aba==='lojinha' && l.nome==='Louça fina' && l.linha==='O prato da casa sai mais rápido, e a mesa fica mais bonita.','ficha l-louca (aba Lojinha)');
  ok(L.manualTracos('exigente').join('|')==='pede o prato da casa|bebida antes da entrada|repara em mesa suja|sempre avalia no Gurugol|gorjeta ótima','os traços do exigente');
  ok(![f,l].some(q=>/\d/.test(q.linha+L.manualTracos(q.tipo||'x').join(' '))),'as fichas sem números');
  ok(L.manualSemente(L.normSave({ exigVisto:1, dia:12, salao:{ ponto:'terraco' }, pontoDia:10 })).indexOf('c-exigente')>=0,'um save que já viu o exigente abre a ficha'); }

// ---------- 12. o save e o desenho ----------
{ const H=terr(), {g,L}=H, s=L.normSave({ v10:1, exigBravo:'x', exigVisto:'sim', convExig:'pend' });
  ok(s.exigBravo===0 && s.exigVisto===0 && s.convExig==='pend','normSave: os campos novos (exigBravo, exigVisto, convExig)');
  const s2=L.normSave(JSON.parse(JSON.stringify(L.normSave({ v10:1, exigBravo:9, exigVisto:1, convExig:1, up:{ louca:true } })))); ok(s2.exigBravo===9 && s2.exigVisto===1 && s2.convExig===1 && s2.up.louca===true,'o save da v10.1 carrega igual');
  const old=L.normSave({ v10:1, dia:10, salao:{ ponto:'terraco' } }); ok(old.exigBravo===0 && old.convExig===0,'o save da v10 carrega sem os campos novos');
  let erro=''; try {
    const x=sentar(g,'casal',true); x.grp.setState('ordered'); g.kitchen.submitTempo(x.grp,x.t.id,1); x.grp.tempo=1;
    g.spawn({ type:'familia', color:1, vip:true, av:true }); g.spawn({ type:'vovos', color:2, vip:true, av:true });   // na fila, com a plaquinha de duas estrelas
    for(let i=0;i<600;i++) g.update(0.05); L.render(g,H.ctx);
    g.bia.hands=[{ kind:'dish', table:x.t.id, group:x.grp, dish:'pf', q:5, crit:true, casa:true, tempo:1 }]; L.render(g,H.ctx);
    g.setState('menu'); L.render(g,H.ctx);
  } catch(e){ erro=String(e&&e.stack||e); }
  ok(!erro,'renderiza o exigente na fila e na mesa, o prato da casa na mão e na janela, sem erro'+(erro?': '+erro:'')); }
console.log('smoke61: total =',total,' fails =',fails); process.exit(fails?1:0);
