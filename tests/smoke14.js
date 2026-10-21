// v7.5, calçada: a tela que rola (câmera, arrastar o fundo, borda, toque duplo, abinhas), a espera lá fora com 4
// cadeiras, a máquina de suco (pedido no tablet, preparo, Bia e Dani levando, conta) e o save com a água.
const load=require('./harness.js');
const H=load(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const C=L.CALCADA, Q=L.LAYOUT.QUEUE, ST=L.LAYOUT.STATIONS, M=L.MAQUINA, CAM=L.CAM, AB=L.ABAS;
const run=(sec,keep)=>{ for(let i=0;i<sec*20;i++){ if(keep) g.groups.forEach(x=>{ if(x.state!=='leaving') x.patLeft=1e9; }); g.update(0.05); } };
const near=(a,b,e)=>Math.abs(a-b)<(e||1e-6);
/* dia sem chegadas sozinhas; grupos postos à mão na espera */
const dia=(n,up)=>{ g.save=L.normSave({maxDay:7,bank:5000}); g.up=g.save.up; Object.assign(g.up,up||{}); g.buildTables(); g.startDay(n); g.begin(); g.schedule=[]; g.nextIdx=0; };
const chega=(type,vip)=>g.spawn({ type:type||'estudante', color:0, vip:!!vip });
const fit=(grp,sz)=>{ grp.size=sz; grp.people=grp.people.slice(0,sz); while(grp.people.length<sz) grp.people.push(grp.people[0]); return grp; };
const sentaNaEspera=()=>{ for(let i=0;i<60 && g.queue.some(x=>x.path.length);i++) g.update(0.05); };
const scr=x=>x+g.cam;   // mundo -> tela

// a calçada e a espera
ok(C.w===260 && Q.x<0 && Q.x-74>=-C.w && L.LAYOUT.BOUNDS.x0<Q.x-60,'calçada de 260 px à esquerda do salão, com a espera lá fora (x '+Q.x+')');
ok(L.PONTOS[0].espera===4 && Q.ys.length===4,'Garagem: 4 cadeiras de espera');
ok(ST.maquina && ST.maquina.rect.x+ST.maquina.rect.w<=0 && !ST.agua,'a máquina de suco fica na calçada (e a jarra de água saiu)');
dia(3);
ok(g.cam===C.w,'o dia começa olhando a calçada');
{ const lug=g.tables.reduce((a,t)=>a+t.seats,0); ok(g.contas===L.contasDia(g.tables,g.ponto) && lug===10,'as cadeiras de fora não contam nos lugares nem nas contas'); }
for(let i=0;i<4;i++) chega(); sentaNaEspera();
ok(g.queue.length===4 && g.queue.every((x,i)=>near(x.x,Q.x,0.6)&&near(x.y,Q.ys[i],0.6)),'4 grupos sentados lá fora, cada um na sua cadeira');
{ const f0=g.stats.full; g.arrive({type:'estudante',color:0}); ok(g.stats.full===f0+1 && g.queue.length===4,'5º grupo: espera cheia, vai embora (Lotado!)'); }

// câmera e entrada com a tela deslocada
dia(3); const grp=chega(); sentaNaEspera();
g.setCam(9999); ok(g.cam===C.w,'câmera não passa da calçada'); g.setCam(-50); ok(g.cam===0,'nem do salão');
g.setCam(C.w);
g.onDown(scr(Q.x),Q.ys[0]-20); g.onUp(scr(Q.x),Q.ys[0]-20); ok(g.sel===grp,'com a tela na calçada, tocar no grupo seleciona');
{ const t=g.tables.find(t=>t.free&&t.seats>=grp.size); g.onDown(scr(t.cx),t.cy); ok(grp.state==='toTable' && g.sel===null,'e tocar na mesa (deslocada na tela) senta'); }
g.bia.clearActs(); g.setCam(0); g.onDown(ST.order.rect.x+20,ST.order.rect.y+20); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='order','no salão, a cozinha responde no lugar de sempre');
g.setCam(C.w); g.bia.clearActs(); g.onDown(ST.order.rect.x+20,ST.order.rect.y+20); ok(g.bia.acts.length===0,'olhando a calçada, o mesmo ponto da tela não é a cozinha');
g.onDown(360+10,570); ok(true,'HUD fixo: o toque nos quadrinhos não depende da câmera');
{ g.bia.enqueue({type:'coffee'}); g.setCam(123); g.onDown(360+10,570); ok(g.bia.acts.length===0,'quadrinho da fila de ações cancela com a tela em qualquer posição'); }

// arrastar o fundo
dia(3); g.setCam(C.w);
{ const t=g.tables[0], x=scr(t.cx), y=t.cy+120;   // abaixo da mesa: vazio
  ok(!g.pickAt(t.cx,y,0),'ponto vazio para arrastar');
  g.onDown(x,y,0); g.onMove(x-60,y); g.onMove(x-100,y); ok(g.cam===C.w-100,'arrastar o fundo para a esquerda rola a tela para o salão');
  g.onUp(x-100,y); g.onDown(400,y,0); g.onMove(480,y); g.onUp(480,y); ok(g.cam===C.w-20,'e para a direita, de volta para a calçada');
  const s=chega(); sentaNaEspera(); g.sel=s; g.onDown(400,y,0); g.onMove(300,y); g.onUp(300,y); ok(g.sel===s,'arrastar o fundo não desfaz a escolha do grupo');
  g.onDown(400,y,0); g.onUp(401,y); ok(g.sel===null,'tocar no vazio sem arrastar desfaz');
  const c0=g.cam; g.onDown(scr(t.cx),t.cy,0); g.onMove(scr(t.cx)-120,t.cy); g.onUp(scr(t.cx)-120,t.cy); ok(g.cam===c0,'começando numa mesa, o arrasto não rola a tela');
  const c1=g.cam; g.onDown(400,y,0); g.onMove(404,y); g.onUp(404,y); ok(g.cam===c1,'tremidinho no vazio não rola');
  g.bia.clearActs(); g.setCam(0); const r=ST.trash.rect; g.onDown(r.x-15,500,23); ok(g.bia.acts.length===1 && !g.pan,'no dedo, a folga do alvo continua valendo (não vira arrasto do fundo)'); }

// grupo arrastado até a borda: a tela rola sozinha
dia(3); { const s=chega(); sentaNaEspera(); g.setCam(C.w);
  g.onDown(scr(s.x),s.y-20); g.onMove(scr(s.x)+40,s.y); g.onMove(950,300); run(0.2);
  ok(g.cam<C.w && g.drag && g.drag.moved,'na borda direita, a tela rola para o salão');
  const c=g.cam; run(0.3); ok(g.cam<c,'e continua rolando enquanto o grupo fica na borda');
  ok(near(g.drag.x,950-g.cam),'o grupo arrastado acompanha (mundo = tela − câmera)');
  g.onMove(20,300); const c2=g.cam; run(0.2); ok(g.cam>c2,'na borda esquerda, volta para a calçada');
  g.onMove(480,300); const c3=g.cam; run(0.2); ok(g.cam===c3,'longe das bordas, para');
  const t=g.tables.find(t=>t.free&&t.seats>=s.size); g.onMove(scr(t.cx),t.cy); g.onUp(scr(t.cx),t.cy); ok(s.state==='toTable','solta na mesa e senta'); }

// toque duplo no grupo
dia(3); { const s=chega(); sentaNaEspera(); g.setCam(C.w);
  g.onDown(scr(s.x),s.y-20); g.onUp(scr(s.x),s.y-20); ok(g.sel===s,'1º toque seleciona');
  g.onDown(scr(s.x),s.y-20); g.onUp(scr(s.x),s.y-20); ok(g.sel===s && g.camTo===0,'2º toque seguido: continua selecionado e a tela vai para o salão');
  run(0.5); ok(g.cam===0 && g.camTo===null,'a tela chega ao salão');
  const t=g.tables.find(t=>t.free&&t.seats>=s.size); g.onDown(t.cx,t.cy); ok(s.state==='toTable','e é só tocar na mesa');
  const s2=chega(); sentaNaEspera(); g.setCam(C.w); g.onDown(scr(s2.x),s2.y-20); g.onUp(scr(s2.x),s2.y-20); g.anim+=1; g.onDown(scr(s2.x),s2.y-20); g.onUp(scr(s2.x),s2.y-20);
  ok(g.sel===null && g.camTo===null,'2 toques com 1 s entre eles: seleciona e desfaz, como antes'); }

// abinhas
dia(3); g.setCam(C.w);
ok(!g.abaOn('l') && g.abaOn('r'),'olhando a calçada: só a abinha do salão');
g.onDown(AB.r.x+10,AB.r.y+10); ok(g.camTo===0,'tocar na abinha do salão leva a tela até lá'); run(0.5); ok(g.cam===0,'chegou ao salão');
ok(g.abaOn('l') && !g.abaOn('r'),'no salão: só a abinha da calçada');
g.onDown(AB.l.x+10,AB.l.y+10); run(0.5); ok(g.cam===C.w,'tocar na abinha da calçada volta');
g.setCam(130); ok(g.abaOn('l') && g.abaOn('r'),'no meio do caminho: as duas');
{ const kk=g.kitchen; kk.plates=[{id:77,dish:'pf',group:null},null,null,null]; ok(g.abaPratos()===1,'abinha do salão conta o prato pronto'); g.bia.enqueue({type:'plate',pid:77}); ok(g.abaPratos()===0,'que sai da conta quando a Bia já vai buscar'); kk.plates=[null,null,null,null]; g.bia.clearActs(); }

// a máquina de suco
dia(3,{maquina:true});
{ const s=fit(chega(),2); sentaNaEspera(); g.setCam(0);
  ok(!s.pediu && !g.maq.length,'ao sentar lá fora, ainda não pediu');
  run(M.pede+0.1,true); ok(s.pediu && g.maq.length===1 && g.maq[0].n===2 && g.maq[0].t>0,'depois de '+M.pede+' s, pede no tablet 1 suco por pessoa');
  ok(!g.maqPronto().length,'a máquina prepara');
  ok(g.abaOn('l') && !g.abaAlerta(),'preparando: a abinha da calçada não pisca');
  run(M.prep,true); ok(g.maqPronto().length===1,'em '+M.prep+' s fica pronto');
  ok(g.abaAlerta(),'suco pronto lá fora e a tela no salão: a abinha pisca');
  g.setCam(C.w); ok(!g.abaAlerta(),'com a calçada à vista, não precisa');
  g.setCam(0);
  const p0=s.patPer(), h0=s.hearts=3, c0=g.custo;
  g.tapStation('maquina'); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='maquina','tocar na máquina põe a ação na fila da Bia');
  ok(!g.abaAlerta(),'com a Bia indo buscar, a abinha não pisca');
  let guard=0; while(!g.bia.hands.some(h=>h.kind==='suco') && guard++<200){ run(0.05,true); }
  ok(g.bia.hands.filter(h=>h.kind==='suco'&&h.group===s).length===2 && !g.maq.length,'na máquina, pega os 2 copos');
  ok(g.bia.acts.length===1 && g.bia.acts[0].leg===2,'a mesma ação segue para quem pediu');
  ok(g.bia.marks()['espera:'+s.id],'o selo da fila vai junto com o grupo');
  guard=0; while(g.bia.acts.length && guard++<200){ s.patLeft=1e9; g.update(0.05); }
  ok(!g.bia.hands.length && s.sucoN===2 && s.sucoConta===2,'entregou: os 2 bebem e vão para a conta');
  ok(s.hearts===h0+1,'atender devolve 1 coração');
  ok(near(s.patPer(),p0/(1-M.slow)),'quem bebe perde a paciência '+(M.slow*100)+'% mais devagar');
  ok(near(g.custo-c0,2*L.INGRED.suco) && g.stats.sucoEsp===2,'ingrediente: R$ '+L.INGRED.suco+' por copo');
  const t=g.tables.find(t=>t.free&&t.seats>=s.size); g.seatGroup(s,t); run(3,true);
  s.setState('wantBill'); s.hearts=5; s.juiceWant=0; g.lastKind=null; const m0=g.money; g.collectBill(s,t);
  ok(g.money-m0===Math.round(s.bill*1.5)+2*L.JUICE.price,'na conta: +R$ '+(2*L.JUICE.price)+' dos sucos da espera (fora dos corações e da gorjeta)'); }

// cancelamento, mãos cheias, entrega na mesa e quem vai embora
dia(3,{maquina:true});
{ const s=fit(chega(),2); sentaNaEspera(); run(M.pede+0.1,true);
  const t=g.tables.find(t=>t.free&&t.seats>=2); g.seatGroup(s,t); ok(!g.maq.length,'sentou antes de pegar o suco: o pedido some');
  const s2=fit(chega(),4); sentaNaEspera(); run(M.pede+M.prep+0.2,true);
  g.bia.x=ST.maquina.ap.x; g.bia.y=ST.maquina.ap.y; g.bia.hands=[];
  const a={type:'maquina'}; g.bia.acts=[a]; g.bia.perform(g.bia.acts.shift());
  ok(g.bia.hands.length===2 && g.maq[0].n===2 && a.leg===2,'sem bandeja, leva 2 de 4 copos; os outros 2 ficam prontos na máquina');
  g.bia.acts=[]; g.bia.hands=[{kind:'dirty',n:1},{kind:'dirty',n:1}]; g.bia.acts=[{type:'maquina'}]; g.bia.perform(g.bia.acts.shift()); ok(g.bia.hands.length===2 && g.maq[0].n===2,'mãos cheias: não pega');
  g.bia.hands=[{kind:'suco',group:s2},{kind:'suco',group:s2}]; g.bia.acts=[];
  const t2=g.tables.find(t=>t.free&&t.seats>=4); g.seatGroup(s2,t2); ok(!g.maq.length,'sentou: cancela os copos que ainda estavam na máquina');
  const ap=g.sucoAp(s2,g.bia); ok(ap && L.tableApproach(t2).some(p=>p.x===ap.x&&p.y===ap.y),'os copos na mão vão até a mesa');
  const a2={type:'maquina',leg:2,group:s2}; g.bia.acts=[a2]; let guard=0; while(g.bia.acts.length && guard++<300){ g.groups.forEach(x=>x.patLeft=1e9); g.update(0.05); }
  ok(s2.sucoConta===2 && !g.bia.hands.length,'entregues na mesa, entram na conta');
  const s3=fit(chega(),2); sentaNaEspera(); g.bia.hands=[{kind:'suco',group:s3}]; g.angryLeave(s3); ok(!g.bia.hands.length,'quem vai embora bravo: o copo sai da mão'); }
{ dia(3); const s=chega(); sentaNaEspera(); run(M.pede+M.prep+1,true); ok(!s.pediu && !g.maq.length,'sem a máquina, ninguém pede'); g.tapStation('maquina'); ok(true,'e tocar no lugar dela não quebra nada'); }

// Dani leva o suco
{ g.save=L.normSave({maxDay:7,bank:5000,equipe:{dani:3,daniTasks:['suco']},up:{maquina:true}}); g.up=g.save.up; g.buildTables(); g.startDay(4); g.begin(); g.schedule=[]; g.nextIdx=0;
  ok(g.dani.does('suco'),'Dani com a tarefa do suco');
  const s=fit(chega(),2); sentaNaEspera(); run(M.pede+M.prep+0.2,true);
  ok(!g.abaAlerta(),'com a Dani cuidando, a abinha não pisca pelo suco');
  run(20,true); ok(s.sucoN===2 && s.sucoConta===2 && !g.maq.length,'a Dani busca na máquina e entrega a quem espera'); }

// movimento reduzido: rolagem automática instantânea
{ const H2=load({rm:true}); const g2=H2.g, L2=H2.L;
  g2.startDay(3); g2.begin(); g2.schedule=[]; g2.camGo(0); ok(g2.cam===0 && g2.camTo===null,'movimento reduzido: a abinha leva a tela na hora');
  const s=g2.spawn({type:'estudante',color:0}); for(let i=0;i<60;i++) g2.update(0.05);
  g2.setCam(L2.CALCADA.w); g2.onDown(s.x+g2.cam,s.y-20); g2.onMove(s.x+g2.cam+40,s.y); g2.onMove(950,300); g2.update(0.05);
  ok(g2.cam===0,'e o grupo na borda leva a tela direto ao fim'); }

// desenho
{ dia(5,{maquina:true}); for(let i=0;i<4;i++) chega(i===1?'vovos':'estudante',i===2); sentaNaEspera(); run(M.pede+0.5,true); run(M.prep,true);
  g.queue[0].hearts=1; g.bia.hands=[{kind:'suco',group:g.queue[1]}]; g.bia.acts=[{type:'maquina',leg:2,group:g.queue[1]},{type:'maquina'}];
  let err=null;
  for (const c of [0,130,C.w]){ g.setCam(c); try{ L.render(g,ctx); }catch(e){ err=e; } }
  ok(!err,'render da calçada, da máquina, dos pedidos e das abinhas '+(err?err.message:''));
  g.setState('menu'); try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'render do menu'); }

console.log((total-fails)+'/'+total+' ok; fails=',fails);
process.exit(fails?1:0);
