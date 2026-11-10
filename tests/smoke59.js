// v9.6.13 (menos sustos): (1) "Já vou!": o último coração não cai quando a Bia já está a caminho do grupo (ou o jogador o está
// arrastando na calçada); (2) o banco sem armadilha: a lojinha avisa quando a compra come a parcela do banco, e na História o
// banco dá uma 2ª chance (BANCO.socorro) em vez de tomar a lanchonete; (3) na pausa, Reiniciar e Menu pedem um 2º toque.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=(o)=>{ const H=load(o); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const mostra=(els,id)=>els[id].classList.contains('show');

// ---------- (1) Já vou! ----------
{ const H=nova(), {g,L,els}=H;
  const dia=n=>{ g.save=L.normSave({bank:500,dia:n,maxDay:n}); g.up=g.save.up; g.buildTables(); g.startDay(n); if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[{t:1e9,type:'estudante'}]; g.nextIdx=0; };
  const roda=(f,max)=>{ for(let i=0;i<(max||4000);i++){ if(f()) return true; g.update(0.05); } return f(); };
  let jaVou=0; const addText0=g.addText.bind(g); g.addText=function(x,y,t,c,s){ if(t==='Já vou!') jaVou++; return addText0(x,y,t,c,s); };
  // um grupo sentado, no estado pedido, com 1 coração e pouca paciência; a Bia sem tarefas
  const sentado=(estado,hearts)=>{
    dia(5); jaVou=0; g.bia.acts=[]; g.bia.hands=[];
    const e=g.spawn({type:'estudante',color:1}); e.patLeft=1e9; e.hearts=5;
    roda(()=>!e.path.length);
    const mesa=g.tables.find(t=>t.open&&!t.group&&t.seats>=e.size); g.seatGroup(e,mesa);
    roda(()=>e.state==='wantOrder'); g.bia.acts=[]; g.bia.hands=[]; g.bia.doing=null;
    if(estado!=='wantOrder') e.setState(estado);
    e.hearts=hearts; e.patLeft=0.2; e.jaVouDito=false;
    return {e,mesa};
  };
  const longe=()=>{ g.bia.x=60; g.bia.y=560; g.bia.path=[]; };
  { const {e}=sentado('wantOrder',1); const l0=g.stats.lost;
    ok(e.jaVem===false,'(a) sem tarefa da Bia: não "já vem"');
    roda(()=>g.stats.lost>l0 || e.state==='leaving',200);
    ok(g.stats.lost===l0+1,'(a) pedido esperando, 1 coração, Bia sem tarefa: vai embora bravo'); }
  { const {e,mesa}=sentado('wantOrder',1); longe(); g.bia.enqueue({type:'table',id:mesa.id}); const l0=g.stats.lost;
    ok(e.jaVem===true,'(b) a mesa é a tarefa da vez: "já vem"');
    roda(()=>e.state!=='wantOrder',400);
    ok(g.stats.lost===l0 && e.state!=='leaving' && e.state!=='wantOrder' ,'(b) a Bia chega e anota: o grupo não vai embora ('+e.state+')');
    ok(jaVou===1,'(b) o "Já vou!" aparece uma vez ('+jaVou+')'); }
  { const {e,mesa}=sentado('wantOrder',3); longe(); g.bia.enqueue({type:'table',id:mesa.id}); e.hearts=3; e.patLeft=0.1;
    const up0=g.bia.update; g.bia.update=()=>{};   // a Bia fica parada (a tarefa segue na fila): só os corações caem
    for(let i=0;i<400 && e.hearts>1;i++){ g.update(0.05); if(e.hearts>1) e.patLeft=Math.min(e.patLeft,0.1); }
    ok(e.hearts===1,'(c) com 3 corações e a Bia a caminho, caem até 1 ('+e.hearts+')');
    const l0=g.stats.lost; for(let i=0;i<60;i++) g.update(0.05);
    ok(e.hearts===1 && e.state==='wantOrder' && g.stats.lost===l0,'(c) e param no 1: o último fica segurado, mesmo muito tempo depois');
    g.bia.update=up0; delete g.bia.update; }
  { const {e,mesa}=sentado('ordered',1); longe(); g.bia.enqueue({type:'table',id:mesa.id}); const l0=g.stats.lost;
    ok(e.jaVem===false,'(d) mesa como tarefa, mas sem nada para o grupo nas mãos: não "já vem"');
    roda(()=>g.stats.lost>l0 || e.state==='leaving',200);
    ok(g.stats.lost===l0+1,'(d) ordered com 1 coração: vai embora (sem graça)'); }
  { const {e,mesa}=sentado('ordered',1); longe(); const pl={id:++g.kitchen.pid,table:mesa,group:e,dish:e.dish,slot:0,age:0,crit:false,q:3,vip:false};
    g.kitchen.plates[0]=pl; g.bia.enqueue({type:'plate',pid:pl.id}); const l0=g.stats.lost;
    ok(e.jaVem===true,'(e) prato pronto do grupo como tarefa da vez: "já vem"');
    for(let i=0;i<40;i++){ g.update(0.05); g.kitchen.plates[0]=g.kitchen.plates[0]||null; if(g.kitchen.plates[0]) g.kitchen.plates[0].age=0; }
    ok(g.stats.lost===l0 && e.state!=='leaving','(e) o grupo não vai embora'); }
  { const {e,mesa}=sentado('ordered',1); longe(); const outra=g.tables.find(t=>t!==mesa);
    g.bia.hands=[{kind:'dish',table:mesa,group:e,dish:e.dish,crit:false,q:3,fria:false,vip:false}];
    g.bia.acts=[{type:'table',id:outra.id},{type:'table',id:mesa.id}]; const l0=g.stats.lost;
    ok(e.jaVem===false,'(f) prato do grupo na mão, mas a mesa dele em 2º na fila: ainda não "já vem" (só a tarefa da vez conta)');
    g.bia.acts=[{type:'table',id:mesa.id},{type:'table',id:outra.id}];
    ok(e.jaVem===true,'(f) com a mesa dele como tarefa da vez e o prato na mão: "já vem"');
    for(let i=0;i<10;i++){ g.update(0.05); g.bia.x=60; g.bia.y=560; g.bia.path=[]; }
    ok(g.stats.lost===l0 && e.state!=='leaving','(f) não vai embora (estado: '+e.state+')'); }
  // (g) na calçada: arrastando, fica; soltando na mesa, senta; sem arrasto, vai embora; (h) só selecionado não segura
  const naCalcada=()=>{ dia(5); jaVou=0; const e=g.spawn({type:'estudante',color:1}); e.patLeft=1e9; e.hearts=5; roda(()=>!e.path.length); e.hearts=1; e.patLeft=0.2;
    const mesa=g.tables.find(t=>t.open&&!t.group&&t.seats>=e.size); return {e,mesa}; };
  { const {e,mesa}=naCalcada(); const l0=g.stats.lost; g.onDown(e.x+g.cam,e.y,0); g.onMove(e.x+g.cam+40,e.y-30);
    ok(g.drag && g.drag.g===e && e.jaVem===true && !e.semMesa,'(g) arrastando o grupo da calçada (com mesa livre): "já vem"');
    for(let i=0;i<20;i++) g.update(0.05);
    ok(e.state==='queue' && e.hearts===1 && g.stats.lost===l0,'(g) segurando, ele fica');
    ok(jaVou===0,'(g) na calçada não aparece o texto sobre a Bia');
    g.onMove(mesa.cx+g.cam,mesa.cy); g.onUp(mesa.cx+g.cam,mesa.cy);
    ok(e.table===mesa,'(g) soltou na mesa: sentou'); }
  { const {e}=naCalcada(); const l0=g.stats.lost; roda(()=>g.stats.lost>l0 || e.state==='leaving',200);
    ok(g.stats.lost===l0+1,'(g) sem arrasto, vai embora bravo'); }
  { const {e}=naCalcada(); const l0=g.stats.lost; g.onDown(e.x+g.cam,e.y,0); g.onUp(e.x+g.cam,e.y);
    ok(g.sel===e && !g.drag && e.jaVem===false,'(h) só selecionado (toque): não "já vem"');
    roda(()=>g.stats.lost>l0 || e.state==='leaving',200);
    ok(g.stats.lost===l0+1,'(h) selecionado, ele vai embora mesmo assim'); }
}

// ---------- (2) o banco sem armadilha ----------
// (i) o aviso na lojinha, quando a compra deixa o caixa abaixo da parcela do banco de hoje
{ const H=nova(), {g,L,els}=H;
  const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);
  const botao=re=>acha(els['shop-grid'],e=>e.tagName==='BUTTON'&&re.test(e.textContent));
  const abre=(bank,emp,equipe)=>{ g.save=L.normSave({maxDay:7,bank,emp,equipe,divulga:'boca'}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.goShop(3); L.setShopTab('salao'); };
  const P=L.SALAO.mesa2, emp={resto:400,amort:100,j:0.03,n:4};
  abre(P+50,emp); const dev=g.devido;
  ok(dev>P*0 && dev>50,'(i) a parcela de hoje ('+dev+') é maior que a folga de R$ 50');
  { const b=botao(/Mesa de 2/), n=g.save.salao.mesas.length;
    ok(b && !b.disabled && b.classList.contains('warn') && b.getAttribute('data-aviso')==='Confirmar: pode faltar para o banco','(i) a compra que deixa o caixa abaixo da parcela avisa: '+(b&&b.getAttribute('data-aviso')));
    ok(/abaixo da parcela do banco de hoje/.test(b.title) && b.title.indexOf('R$ '+dev)>=0,'(i) a dica (title) diz a parcela: '+b.title);
    b.fire('click');
    ok(g.save.salao.mesas.length===n && g.save.bank===P+50 && b.textContent==='Confirmar: pode faltar para o banco','(i) o 1º toque só avisa');
    b.fire('click');
    ok(g.save.salao.mesas.length===n+1 && g.save.bank===50,'(i) o 2º toque compra'); }
  abre(P+dev+500,emp);
  { const b=botao(/Mesa de 2/); ok(b && !b.disabled && !b.classList.contains('warn') && !b.getAttribute('data-aviso'),'(i) compra que deixa o caixa acima da parcela não avisa'); }
  abre(P+50,Object.assign({atr:true},emp));
  { const b=botao(/Mesa de 2/); ok(g.devido>dev && b.getAttribute('data-aviso')==='Confirmar: parcela atrasada!','(i) com a parcela atrasada, o texto é "Confirmar: parcela atrasada!"'); }
  abre(P+50,{}); { const b=botao(/Mesa de 2/); ok(g.devido===0 && !b.classList.contains('warn'),'(i) sem empréstimo, nada a avisar'); }
  // os avisos da folha têm prioridade
  { const RES=L.STAFF.dani.levels[2].pay+L.STAFF.tv.pay, big={resto:4000,amort:1000,j:0.03,n:4};
    abre(RES+P-1,big,{dani:2,tv:true});
    ok(g.devido>RES+P,'(i) (a parcela grande também estouraria o aviso do banco)'); }
  { const b=botao(/Mesa de 2/); ok(/^Confirmar: sem /.test(b.getAttribute('data-aviso')),'(i) o aviso da folha tem prioridade: '+(b&&b.getAttribute('data-aviso'))); }
  // pagar o próprio banco (Amortizar, Quitar) não avisa
  abre(300,{resto:400,amort:100,j:0.03,n:4}); L.setShopTab('banco');
  { const b=botao(/Quitar/); ok(!b || !b.getAttribute('data-aviso'),'(i) Quitar/Amortizar não avisam sobre a parcela'); }
}

// (j) a 2ª chance do banco na História; (k) sem a História, o banco toma; (l) BANCO.socorro=0 desliga
{ const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
  const passa=H=>{ let n=0; while(H.g.conversa && n<30){ toque(H.els); n++; } return n; };
  const joga=(H,fat,custo)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; g.finishDay(); };
  const ate3=H=>{ const {g}=H; g.save.conversa=null; g.save.bank=0;
    g.startDay(1); joga(H,0,0); passa(H); g.startDay(2); joga(H,0,0); passa(H); };
  { const H=nova({historia:true}), {g,L,els}=H; ate3(H);
    ok(g.save.emp.atr===true && g.result.atrasou,'(j) dia 2 sem dinheiro: parcela atrasada');
    g.startDay(3); joga(H,0,0);
    ok(g.state==='dayend' && g.save.socorro===1 && g.save.emp.atr===undefined && !g.save.fechou && g.result.socorro===true && g.result.tomou===false,'(j) atrasou de novo: na História, o banco segura (sem falência)');
    ok(g.save.emp.resto>0,'(j) a dívida continua ('+g.save.emp.resto+'), só o atraso some');
    ok(/O banco segurou a parcela desta vez/.test(txt(els['end-msg'])),'(j) o recado de alerta aparece no fim do dia');
    ok(g.save.convSocorro==='pend' && !!g.conversa,'(j) a conversa do banco está tocando (convSocorro pendente)');
    const n=passa(H); ok(n>=3 && g.save.convSocorro===1 && !g.conversa,'(j) a conversa terminou ('+n+' falas) e convSocorro vai a 1');
    ok(L.HIST_SOCORRO.falas.length===3 && L.HIST_SOCORRO.falas[0].q==='tonhao','(j) HIST_SOCORRO exposto, com 3 falas');
    g.startDay(4); joga(H,0,0); passa(H); ok(g.save.emp.atr===true && g.state==='dayend','(j) dia 4 sem dinheiro: atrasa de novo');
    g.startDay(5); joga(H,0,0); ok(g.state==='falencia' && g.save.fechou===5 && mostra(els,'ov-falencia'),'(j) a 2ª vez: aí sim a falência');
    ok(g.save.socorro===1,'(j) o socorro não volta'); }
  { const H=nova(), {g,L,els}=H; g.save=L.normSave({bank:0,dia:2,maxDay:7,emp:{resto:300,amort:100,j:0.03,n:3,atr:true}}); g.up=g.save.up; g.buildTables(); g.startDay(3);
    ok(g.save.histV!==1 || !L.HIST.on,'(k) o harness padrão roda sem a História (histV '+g.save.histV+')');
    joga(H,0,0); ok(g.state==='falencia' && g.save.fechou===3 && !g.save.socorro && g.result.tomou===true && !g.result.socorro,'(k) sem a História, o banco toma na 1ª vez, como antes'); }
  { const H=nova({historia:true}), {g,L,els}=H; L.BANCO.socorro=0; ate3(H); g.startDay(3); joga(H,0,0);
    ok(g.state==='falencia' && g.save.fechou===3 && !g.save.socorro,'(l) BANCO.socorro=0 desliga a 2ª chance'); }
}

// ---------- (3) pausa: 2º toque em Reiniciar e Menu ----------
{ const H=nova(), {g,L,els}=H;
  const novo=(bank)=>{ g.save=L.normSave({maxDay:7,bank,divulga:'boca'}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
  const abre=n=>{ g.startDay(n); g.begin(); };
  const R=els['btn-restart'], M=els['btn-pause-menu'], MT=L.MULTA;
  novo(500); abre(5); g.spawn({type:'estudante',color:0}); g.spawn({type:'estudante',color:1});
  const mt=g.multaSeSair; ok(mt===2*MT,'(m) dois grupos no salão: multa de R$ '+mt+' se largar');
  g.pause(); ok(R.textContent==='Reiniciar' && M.textContent==='Menu','(m) a pausa abre com os textos normais');
  R.fire('click');
  ok(g.state==='paused' && g.save.bank===500 && R.textContent==='Confirmar: multa de R$ '+mt,'(m) 1º toque em Reiniciar não reinicia: "'+R.textContent+'"');
  R.fire('click');
  ok(g.state==='intro' && g.save.bank===500-mt && R.textContent==='Reiniciar','(m) 2º toque reinicia e cobra a multa ('+g.save.bank+')');
  // (n) sem ninguém
  novo(500); abre(5); g.pause(); R.fire('click');
  ok(g.state==='paused' && R.textContent==='Confirmar: recomeçar o dia','(n) sem ninguém, o texto é "Confirmar: recomeçar o dia"');
  R.fire('click'); ok(g.state==='intro' && g.save.bank===500,'(n) 2º toque reinicia, sem multa');
  // (o) Menu
  novo(500); abre(5); g.pause(); M.fire('click');
  ok(g.state==='paused' && M.textContent==='Confirmar: sair do dia','(o) Menu sem ninguém: "Confirmar: sair do dia"');
  M.fire('click'); ok(g.state==='menu' && M.textContent==='Menu','(o) 2º toque sai');
  novo(500); abre(5); g.spawn({type:'estudante',color:0}); g.pause(); const m1=g.multaSeSair; M.fire('click');
  ok(g.state==='paused' && M.textContent==='Confirmar: multa de R$ '+m1,'(o) Menu com gente no salão: "'+M.textContent+'"');
  M.fire('click'); ok(g.state==='menu' && g.save.bank===500-m1,'(o) 2º toque sai e cobra');
  // (p) trocar o pedido; continuar e pausar de novo zera
  novo(500); abre(5); g.pause();
  R.fire('click'); M.fire('click');
  ok(g.state==='paused' && R.textContent==='Reiniciar' && M.textContent==='Confirmar: sair do dia','(p) tocar no outro botão troca o pedido (o primeiro volta ao normal)');
  R.fire('click'); ok(g.state==='paused' && M.textContent==='Menu' && R.textContent==='Confirmar: recomeçar o dia','(p) de volta ao Reiniciar: pede de novo, sem executar');
  els['btn-resume'].fire('click'); ok(g.state==='playing' && R.textContent==='Reiniciar' && M.textContent==='Menu','(p) continuar zera os textos');
  g.pause(); ok(R.textContent==='Reiniciar' && M.textContent==='Menu','(p) pausar de novo: textos normais');
  R.fire('click'); ok(g.state==='paused','(p) e o pedido recomeça do zero (1º toque não reinicia)');
  // (q) Missão zero e Turno sem fim: um toque basta
  novo(500); g.startTreino(); g.begin(); g.pause(); R.fire('click');
  ok(g.mode==='treino' && g.state==='playing' && R.textContent==='Reiniciar','(q) Missão zero: um toque reinicia');
  g.pause(); M.fire('click'); ok(g.state==='menu','(q) Missão zero: um toque no Menu sai');
  novo(500); g.startEndless(); g.begin(); g.pause(); R.fire('click');
  ok(g.mode==='semfim' && g.state==='intro','(q) Turno sem fim: um toque reinicia');
  g.pause(); M.fire('click'); ok(g.state==='menu','(q) Turno sem fim: um toque no Menu sai');
}

console.log('total =',total,' fails =',fails);
