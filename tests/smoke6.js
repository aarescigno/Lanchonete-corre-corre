// v5: equipe (Tonhão, Dani, couvert), louça limitada, lixeira que enche, água saborizada, economia
const load=require('./harness.js');
let fails=0, total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L}=H; const K=k=>({kind:k});
const eq=()=>g.save.equipe;
const reset=(e,bank)=>{ g.save.equipe=L.normSave({equipe:e}).equipe; g.save.bank=bank==null?5000:bank; g.up={}; g.save.up=g.up; };
const run=(sec,keep)=>{ for(let i=0;i<sec*20;i++){ if(keep) g.groups.forEach(x=>x.patLeft=1e9); g.update(0.05); } };

/* água saborizada no lugar da jukebox */
ok(L.UPGRADES.some(u=>u.id==='agua') && !L.UPGRADES.some(u=>u.id==='jukebox'),'Água saborizada substitui a Jukebox');
{ const s=L.normSave({up:{jukebox:true}}); ok(s.up.agua && !s.up.jukebox,'save antigo: Jukebox vira Água saborizada'); }
{ reset({}); g.resetDay(3); const a=new L.Group(g,'estudante',1,0); const p0=a.patPer(); g.up.agua=true;
  ok(Math.abs(a.patPer()-p0)<1e-9,'água: sem tomar, a paciência não muda');
  ok(g.agua===L.AGUA.cap,'água: a jarra começa o dia cheia ('+L.AGUA.cap+' doses)');
  a.size=2; g.agua=5; a.drink(); ok(g.agua===3 && a.aguaN===2 && Math.abs(a.patPer()-p0*1.25)<1e-9,'água: cada pessoa toma 1 dose; paciência na fila ×1,25');
  const b=new L.Group(g,'estudante',2,0); b.size=2; g.agua=1; b.drink(); ok(g.agua===0 && b.aguaN===1 && Math.abs(b.patPer()-p0*1.125)<1e-9,'água: só 1 dose para 2 pessoas, metade do efeito');
  const c=new L.Group(g,'estudante',3,0); c.drink(); ok(c.aguaN===0 && Math.abs(c.patPer()-p0)<1e-9,'água: jarra vazia, sem efeito');
  ok(g.stationAt(182,140)==='agua','água: toque na jarra');
  g.money=100; g.bia.perform({type:'agua'}); ok(g.agua===L.AGUA.cap && g.money===100-L.AGUA.price && g.stats.refill===1,'água: recarregar custa R$ '+L.AGUA.price);
  g.bia.perform({type:'agua'}); ok(g.money===100-L.AGUA.price,'água: cheia, não cobra de novo');
  g.agua=0; g.money=5; g.bia.perform({type:'agua'}); ok(g.agua===0 && g.money===5,'água: sem dinheiro, não recarrega');
  g.up={}; g.save.up=g.up; ok(g.stationAt(182,140)===null,'sem a melhoria, a jarra não aparece'); }

/* folha e cofre */
ok(L.payroll(L.normSave({}).equipe)===0,'sem equipe, folha zero');
ok(L.payroll({tonhao:2,dani:3,couvert:true})===90+135+80,'folha: Tonhão 90 + Dani nível 3 135 + couvert 80');
ok(L.STAFF.dani.levels[2].pay===L.STAFF.dani.levels[1].pay*1.5 && L.STAFF.dani.levels[3].pay===L.STAFF.dani.levels[2].pay*1.5,'Dani: cada nível paga 50% a mais');
{ reset({tonhao:1,dani:1,couvert:true},1000); g.startDay(3); g.begin(); ok(g.save.bank===1000-180 && g.paid===180,'folha debitada do dinheiro acumulado ao abrir a lanchonete'); }
{ reset({tonhao:1,dani:1,couvert:true},50); g.startDay(3); g.begin(); ok(!eq().couvert && !eq().dani && eq().tonhao===1 && g.save.bank===10,'sem dinheiro para todos: dispensa couvert e Dani, paga o resto'); }
{ reset({},100); ok(!g.setStaff('dani',3) && eq().dani===0,'não contrata quem o dinheiro acumulado não paga'); ok(g.setStaff('dani',1),'contrata a Dani com cofre suficiente'); }
{ reset({},0); g.startDay(3); g.begin(); g.money=1000; g.save.best[3]=800; g.finishDay(); ok(g.result.income===1000 && g.save.bank===1000,'todo o faturamento do dia vai para o dinheiro acumulado'); }

/* aumento do Tonhão */
for(const lv of [0,1,2]){ reset({tonhao:lv}); g.startDay(4); g.begin(); ok(g.kitchen.slots===[3,4,5][lv],'Tonhão nível '+(lv+1)+': '+[3,4,5][lv]+' bocas'); }
{ reset({tonhao:1}); g.startDay(4); g.begin(); g.bia.hands=[K('ticket'),K('ticket'),K('ticket')]; ok(g.bia.canTake('ticket'),'4 bocas: Bia leva 4 comandas'); g.bia.hands.push(K('ticket')); ok(!g.bia.canTake('ticket'),'5ª comanda não cabe'); g.bia.hands=[]; }

/* louça limitada */
ok(L.dishStock(L.DAYS[0])===Infinity && L.dishStock(L.DAYS[1])===Infinity,'dias 1 e 2: pratos sem limite');
ok(L.dishStock(L.DAYS[2])===3 && L.dishStock(L.DAYS[5])===3 && L.dishStock(L.DAYS[6])===3 && L.dishStock({endless:true})===5,'estoque: 3 pratos limpos do dia 3 em diante, 5 no Turno sem fim');
{ reset({}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0; g.kitchen.clean=0;
  const grp=g.spawn({type:'estudante',color:0}); g.kitchen.queue.push({group:grp,table:1,time:0.1,p:0,dish:'pf'}); run(1);
  ok(!g.kitchen.plates.some(Boolean) && g.kitchen.noPlate,'sem prato limpo: o Tonhão espera');
  g.kitchen.sinkN=2; ok(g.bia.duration({type:'sink'})===L.WASH.base+2*L.WASH.perPile,'Bia lava '+L.WASH.perPile+' s por pilha');
  g.tapStation('sink',850,450); run(9); ok(g.kitchen.sinkN===0 && g.trash===2 && g.stats.washed===2,'lavou 2 pilhas: restos no lixo');
  ok(g.kitchen.plates.some(Boolean),'com prato lavado o pedido sai'); }

/* lixeira */
{ reset({}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0; g.trash=L.TRASH.cap;
  g.bia.hands=[K('juice'),{kind:'dish',dish:'pf'}]; g.tapStation('trash',723,500); run(3); ok(g.bia.hands.length===2 && g.trash===L.TRASH.cap,'lixo cheio com prato na mão: não esvazia');
  g.bia.hands=[K('juice'),K('ticket')]; g.tapStation('trash',723,500); run(3); ok(g.bia.hands.length===2 && g.trash===L.TRASH.cap,'lixo cheio com comanda na mão: não esvazia');
  g.bia.hands=[{kind:'dirty',n:2}]; g.tapStation('trash',723,500); run(3); ok(g.trash===L.TRASH.cap,'lixo cheio com louça suja na mão: não esvazia');
  g.bia.hands=[K('juice'),K('coffee')]; ok(g.bia.duration({type:'trash'})===0.3+L.TRASH.empty,'lixo cheio e só bebidas na mão: joga e esvazia (2,3 s)');
  g.tapStation('trash',723,500); run(4); ok(!g.bia.hands.length && g.trash===0,'lixo cheio: aceita as bebidas uma última vez e esvazia');
  g.trash=7; g.bia.hands=[K('juice'),K('juice')]; g.tapStation('trash',723,500); run(4); ok(g.trash===0 && !g.bia.hands.length,'2 bebidas e 1 vaga: joga as duas e esvazia');
  g.trash=5; g.bia.hands=[K('juice')]; g.tapStation('trash',723,500); run(3); ok(g.trash===6,'com espaço: só joga fora, sem esvaziar');
  g.trash=L.TRASH.cap;
  const a=new L.Group(g,'estudante',1,0); a.setState('wantOrder'); const full=a.patPer(); g.trash=0; ok(Math.abs(a.patPer()-full*(1+L.TRASH.smell))<1e-9,'lixeira cheia: paciência cai 15% mais rápido');
  g.trash=5; g.bia.hands=[]; ok(g.bia.duration({type:'trash'})===L.TRASH.empty,'esvaziar leva 2 s'); g.tapStation('trash',723,500); run(4); ok(g.trash===0,'mãos vazias: esvazia a lixeira'); }

/* Dani */
{ reset({dani:1}); g.startDay(3); g.begin();
  ok(g.dani.active && g.dani.speed===130,'Dani nível 1: 50% da velocidade da Bia (130)');
  eq().dani=2; ok(g.dani.speed===169,'nível 2: 65%'); eq().dani=3; ok(g.dani.speed===208 && g.dani.tasks.length<=3,'nível 3: 80%');
  reset({dani:1,daniTasks:[]}); ok(g.toggleDaniTask('lixo') && g.toggleDaniTask('cafe') && !g.toggleDaniTask('lavar'),'níveis 1 e 2: 2 tarefas');
  eq().dani=3; ok(g.toggleDaniTask('lavar') && !g.toggleDaniTask('pratos'),'nível 3: 3 tarefas');
  ok(g.toggleDaniTask('lixo') && eq().daniTasks.indexOf('lixo')<0,'desmarca tarefa'); }
{ reset({dani:3,daniTasks:['pratos','lavar','lixo']}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0; g.kitchen.clean=0;
  const t=g.tables[0]; t.dirty=true; t.dirtyN=2; run(20,true);
  ok(!t.dirty && g.stats.washed>=1 && g.kitchen.clean>=1,'Dani recolhe a louça, leva à pia e lava');
  g.trash=7; run(20,true); ok(g.trash===0,'Dani tira o lixo'); }
{ reset({dani:1,daniTasks:['lavar','lixo']}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
  g.bia.hands=[{kind:'dirty',n:2}]; ok(g.bia.duration({type:'sink'})===L.WASH.base,'Dani lava: a Bia só deixa na pia');
  g.kitchen.sinkN=2; ok(Math.abs(g.dani.duration({type:'sink'})-L.WASH.perPile/0.5)<1e-9,'Dani nível 1 lava 1 pilha a 50% do ritmo da Bia');
  g.save.equipe.dani=3; ok(Math.abs(g.dani.duration({type:'sink'})-L.WASH.perPile/0.8)<1e-9,'nível 3 lava a 80%'); g.save.equipe.dani=1; g.kitchen.sinkN=0; }
/* Dani sem limite de pilhas: só o tempo de lavar */
{ reset({dani:1,daniTasks:['lavar','lixo']}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
  const TRASHCAP=L.TRASH.cap; L.TRASH.cap=1e9; g.clock=1e4;
  g.kitchen.sinkN=40; g.kitchen.clean=0; const per=L.WASH.perPile/0.5;
  run(per*10+6,true); const w1=g.stats.washed; ok(w1>=8 && w1<=11,'Dani devolve os pratos 1 a 1 ('+w1+' em ~'+Math.round(per*10)+' s)');
  run(per*30+10,true); ok(g.stats.washed===40 && g.kitchen.sinkN===0 && g.kitchen.clean===40,'Dani lava as 40 pilhas, sem limite');
  L.TRASH.cap=TRASHCAP; g.trash=0; g.clock=60; g.bia.hands=[{kind:'dirty',n:2}];
  g.tapStation('sink',850,450); run(2); ok(g.kitchen.sinkN===1,'pilha esperando na pia'); run(20); ok(g.kitchen.sinkN===0,'Dani lavou'); }
{ reset({dani:1,daniTasks:['cafe','lixo']}); g.startDay(4); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
  const grp=g.spawn({type:'estudante',color:0}); g.seatGroup(grp,g.tables[0]); run(3,true); grp.hearts=2; run(25,true);
  ok(grp.coffee && grp.hearts>=3,'Dani serve cafezinho para mesa com pouca paciência'); }

/* couvert */
{ reset({couvert:true}); g.resetDay(3); const a=new L.Group(g,'estudante',1,0); a.setState('wantOrder');
  const p=a.patPer(); eq().couvert=false; const p0=a.patPer();
  ok(Math.abs(p-p0/0.8)<1e-9,'couvert: paciência nas mesas cai 20% mais devagar');
  eq().couvert=true; eq().taxa=true; ok(Math.abs(a.patPer()-p0/0.82)<1e-9,'com taxa: eficácia −10% (18%)');
  a.setState('queue'); const q=a.patPer(); eq().couvert=false; ok(q===a.patPer(),'couvert não mexe na fila'); }
{ reset({couvert:true,taxa:true}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
  const grp=g.spawn({type:'familia',color:0}); const t=g.tables.find(x=>x.free&&x.seats>=grp.size); g.seatGroup(grp,t); grp.juiceWant=0; grp.hearts=5; grp.bill=40;
  const m0=g.money; g.lastKind='x'; g.collectBill(grp,t); ok(g.money-m0===Math.round(40*1.5)+3*grp.size,'taxa de couvert: R$ 3 por pessoa na conta'); }

/* bot joga dias 3–7 sem equipe e com equipe completa, com render */
{ const bot=require('./bot.js')(g,L); let err=null; const res=[];
  try{ for(const full of [false,true]) for(let n=3;n<=7;n++){
    reset(full?{tonhao:2,dani:3,daniTasks:['pratos','lavar','lixo'],couvert:true}:{},5000); g.startDay(n); g.begin(); let st=0;
    while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); if(st%10===0) L.render(g,H.ctx); st++; }
    if(g.state!=='dayend') throw new Error('dia '+n+' não terminou'); res.push(g.result.money); } }catch(e){ err=e; }
  ok(!err,'bot nos dias 3–7 (sem e com equipe), com render'+(err?': '+err.stack:''));
  if(!err){ const a=res.slice(0,5).reduce((x,y)=>x+y,0), b=res.slice(5).reduce((x,y)=>x+y,0); console.log('     faturamento sem equipe',a,'com equipe',b); } }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
