// v7.5, calçada (com a tela larga da v7.6, sem rolar): a espera lá fora com 4 lugares, a bebida da espera
// e o save com a água. Na Garagem (v7.7), de pé e água da torneira (pedida no balão, pronta na hora, de graça,
// com a devolução de quem tinha a máquina); a máquina de suco da v7.5 (tablet, preparo, Bia e Dani levando,
// conta) fica para o nível 2 e é testada pondo o suco no ponto.
const load=require('./harness.js');
const H=load(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const C=L.CALCADA, Q=L.LAYOUT.QUEUE, ST=L.LAYOUT.STATIONS, M=L.MAQUINA, AGUA=L.BEBIDA_ESPERA.agua, PREP=L.BEBIDA_ESPERA.suco.prep;
const ponto=(bebida,assento)=>{ L.PONTOS[0].bebida=bebida; L.PONTOS[0].assento=assento; };
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
ok(g.cam===C.w,'o mundo começa em x = '+C.w+' da tela');
{ const lug=g.tables.reduce((a,t)=>a+t.seats,0); ok(g.contas===L.contasDia(g.tables,g.ponto) && lug===10,'as cadeiras de fora não contam nos lugares nem nas contas'); }
for(let i=0;i<4;i++) chega(); sentaNaEspera();
ok(g.queue.length===4 && g.queue.every((x,i)=>near(x.x,Q.x,0.6)&&near(x.y,Q.ys[i],0.6)),'4 grupos sentados lá fora, cada um na sua cadeira');
{ const f0=g.stats.full; g.arrive({type:'estudante',color:0}); ok(g.stats.full===f0+1 && g.queue.length===4,'5º grupo: espera cheia, vai embora (Lotado!)'); }

// tela larga (v7.6): o mundo inteiro na tela, sem rolar
ok(L.TW===960+C.w && L.LAYOUT.TW===L.TW,'tela de '+L.TW+' px: os 960 do salão e os '+C.w+' da calçada');
dia(3); const grp=chega(); sentaNaEspera();
ok(g.cam===C.w && typeof g.setCam==='undefined' && typeof g.camGo==='undefined' && typeof g.abaOn==='undefined','sem câmera que rola nem abinhas: o mundo começa em x = '+C.w+' da tela');
g.onDown(scr(Q.x),Q.ys[0]-20); g.onUp(scr(Q.x),Q.ys[0]-20); ok(g.sel===grp,'tocar no grupo lá fora seleciona');
{ const t=g.tables.find(t=>t.free&&t.seats>=grp.size); g.onDown(scr(t.cx),t.cy); ok(grp.state==='toTable' && g.sel===null,'e tocar na mesa senta'); }
g.bia.clearActs(); g.onDown(scr(ST.order.rect.x+20),ST.order.rect.y+20); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='order','a cozinha está na mesma tela');
{ const r=ST.maquina.rect; g.up.maquina=true; g.bia.clearActs(); g.onDown(scr(r.x+20),r.y+20); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='maquina','e a máquina de suco também'); g.up.maquina=false; g.bia.clearActs(); }
{ const s=chega(); sentaNaEspera(); const t=g.tables.find(t=>t.free&&t.seats>=s.size);
  g.onDown(scr(s.x),s.y-20); g.onMove(scr(s.x)+40,s.y); g.onMove(scr(t.cx),t.cy); ok(g.hover===t,'arrastando o grupo, a mesa sob o dedo acende'); g.onUp(scr(t.cx),t.cy); ok(s.state==='toTable','e soltar nela senta'); }
{ const s=chega(); sentaNaEspera(); g.sel=s; const t=g.tables[0], y=t.cy+120; ok(!g.pickAt(t.cx,y,0),'ponto vazio');
  const n0=g.fx.length; g.onDown(scr(t.cx),y,23); g.onMove(scr(t.cx)-100,y); g.onUp(scr(t.cx)-100,y);
  ok(g.sel===null && g.cam===C.w && g.fx.length===n0+1,'tocar no vazio desfaz a escolha (com o anel do dedo) e a tela não rola'); }
g.bia.enqueue({type:'coffee'}); g.bia.enqueue({type:'order'});
g.onDown(L.HUDX.fila+360+52+10,570); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='coffee','quadrinho da fila de ações (no meio do HUD largo) cancela');
{ const m=g.save.equipe; const mu=L.Sfx.muted; g.onDown(L.HUDX.dir+920,570); ok(L.Sfx.muted!==mu,'som no canto direito do HUD largo'); L.Sfx.muted=mu;
  g.onDown(L.HUDX.dir+860,570); ok(g.state==='paused','pausa ao lado'); g.resume(); }
g.bia.clearActs(); g.setState('paused'); g.onDown(scr(ST.order.rect.x+20),ST.order.rect.y+20); ok(!g.bia.acts.length,'pausado: nada'); g.resume();

// a água da torneira (v7.7)
ok(L.PONTOS[0].assento==='pe' && L.PONTOS[0].bebida==='agua' && g.bebida===AGUA,'Garagem: espera de pé e água da torneira');
ok(AGUA.preco===0 && AGUA.ingred===0 && AGUA.prep===0,'a água é de graça, sem ingrediente e sem preparo');
{ const u=L.UPGRADES.find(u=>u.id==='maquina'); ok(u.name==='Água da torneira' && u.cost===80 && u.devolve===100,'a melhoria virou a Água da torneira, por R$ 80'); }
{ const s=L.normSave({maxDay:4,bank:300,up:{maquina:true}});
  ok(s.bank===400 && s.torneira && s.up.maquina && s.caixa.some(r=>r.devK==='maquina'&&r.dev===100&&r.saldo===400),'save com a máquina de suco: fica com a torneira e R$ 100 de volta, numa linha do caixa');
  const s2=L.normSave(JSON.parse(JSON.stringify(s))); ok(s2.bank===400 && s2.caixa.filter(r=>r.devK).length===1,'a devolução vem só uma vez');
  ok(L.normSave({bank:300}).bank===300 && L.normSave({bank:300,up:{maquina:true},torneira:true}).bank===300,'sem a máquina, ou já convertido: nada');
  const j=L.normSave({bank:300,up:{agua:true}}); ok(j.bank===400 && j.up.maquina,'Água saborizada antiga: também vira torneira, com a devolução'); }
dia(3,{maquina:true});
{ const s=fit(chega(),2); sentaNaEspera();
  ok(!s.pediu && !g.maq.length,'ao chegar ao lugar lá fora, ainda não pediu');
  run(M.pede+0.1,true); ok(s.pediu && g.maq.length===1 && g.maq[0].n===2 && g.maqPronto().length===1,'depois de '+M.pede+' s, pede 1 água por pessoa, já pronta para encher');
  ok(g.bia.duration({type:'maquina'})===AGUA.take && g.dani.duration({type:'maquina'})===AGUA.take,'encher os copos leva '+AGUA.take+' s');
  const p0=s.patPer(), h0=s.hearts=3, c0=g.custo;
  g.tapStation('maquina'); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='maquina','tocar na torneira põe a ação na fila da Bia');
  let guard=0; while(g.bia.acts.length && guard++<400){ s.patLeft=1e9; g.update(0.05); }
  ok(!g.bia.hands.length && s.sucoN===2 && s.sucoConta===0 && s.hearts===h0+1,'a Bia enche e entrega: os 2 bebem, +1 coração e nada na conta');
  ok(near(s.patPer(),p0/(1-M.slow)) && g.custo===c0 && g.stats.sucoEsp===2,'quem bebe perde a paciência '+(M.slow*100)+'% mais devagar, sem custo de ingrediente');
  g.bia.x=ST.trash.ap.x; g.bia.y=ST.trash.ap.y; g.trash=0; g.bia.hands=[{kind:'suco',group:s}]; const m0=g.money; g.bia.acts=[{type:'trash'}]; g.bia.perform(g.bia.acts.shift());
  ok(!g.bia.hands.length && g.money===m0,'copo d\'água na lixeira não custa nada');
  let err=null; s.patLeft=1e9; g.bia.hands=[{kind:'suco',group:s}]; g.bia.acts=[{type:'maquina'}]; g.bia.doing=g.bia.acts[0];
  try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'render da calçada de pé, da torneira (enchendo) e do copo na mão '+(err?err.message:''));
  g.bia.doing=null; g.bia.clearActs(); g.bia.hands=[]; g.finishDay();
  ok(g.result && g.result.bebida==='agua' && g.result.sucoEsp===2,'o fim do dia conta os copos d\'água'); }

// a máquina de suco (v7.5), guardada para o nível 2: testada pondo o suco no ponto
ponto('suco','banco');
dia(3,{maquina:true});
{ const s=fit(chega(),2); sentaNaEspera();
  ok(!s.pediu && !g.maq.length,'ao sentar lá fora, ainda não pediu');
  run(M.pede+0.1,true); ok(s.pediu && g.maq.length===1 && g.maq[0].n===2 && g.maq[0].t>0,'depois de '+M.pede+' s, pede no tablet 1 suco por pessoa');
  ok(!g.maqPronto().length,'a máquina prepara');
  run(PREP,true); ok(g.maqPronto().length===1,'em '+PREP+' s fica pronto');
  const p0=s.patPer(), h0=s.hearts=3, c0=g.custo;
  g.tapStation('maquina'); ok(g.bia.acts.length===1 && g.bia.acts[0].type==='maquina','tocar na máquina põe a ação na fila da Bia');
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
  ok(g.money-m0===Math.round(s.bill*1.1)+2*L.JUICE.price,'na conta: +R$ '+(2*L.JUICE.price)+' dos sucos da espera (fora dos corações e da gorjeta)'); }

// cancelamento, mãos cheias, entrega na mesa e quem vai embora
dia(3,{maquina:true});
{ const s=fit(chega(),2); sentaNaEspera(); run(M.pede+0.1,true);
  const t=g.tables.find(t=>t.free&&t.seats>=2); g.seatGroup(s,t); ok(!g.maq.length,'sentou antes de pegar o suco: o pedido some');
  const s2=fit(chega(),4); sentaNaEspera(); run(M.pede+PREP+0.2,true);
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
{ dia(3); const s=chega(); sentaNaEspera(); run(M.pede+PREP+1,true); ok(!s.pediu && !g.maq.length,'sem a máquina, ninguém pede'); g.tapStation('maquina'); ok(true,'e tocar no lugar dela não quebra nada'); }

// Dani leva o suco
{ g.save=L.normSave({maxDay:7,bank:5000,equipe:{dani:3,daniTasks:['suco']},up:{maquina:true}}); g.up=g.save.up; g.buildTables(); g.startDay(4); g.begin(); g.schedule=[]; g.nextIdx=0;
  ok(g.dani.does('suco'),'Dani com a tarefa do suco');
  const s=fit(chega(),2); sentaNaEspera(); run(M.pede+PREP+0.2,true);
  run(20,true); ok(s.sucoN===2 && s.sucoConta===2 && !g.maq.length,'a Dani busca na máquina e entrega a quem espera'); }

// desenho
{ dia(5,{maquina:true}); for(let i=0;i<4;i++) chega(i===1?'vovos':'estudante',i===2); sentaNaEspera(); run(M.pede+0.5,true); run(PREP,true);
  g.queue[0].hearts=1; g.bia.hands=[{kind:'suco',group:g.queue[1]}]; g.bia.acts=[{type:'maquina',leg:2,group:g.queue[1]},{type:'maquina'}];
  let err=null;
  try{ L.render(g,ctx); }catch(e){ err=e; }
  ok(!err,'render da calçada, da máquina e dos pedidos '+(err?err.message:''));
  g.setState('menu'); try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'render do menu'); }
ponto('agua','pe');

console.log((total-fails)+'/'+total+' ok; fails=',fails);
process.exit(fails?1:0);
