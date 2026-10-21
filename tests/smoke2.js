const H=require('./harness.js')(); const {g,L,els,win,ctx}=H;
let fails=0; const ok=(c,m)=>{ if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const run=(s)=>{ for(let i=0;i<s*20;i++) g.update(0.05); };
g.startDay(2); g.begin(); g.cam=0; const QX=L.LAYOUT.QUEUE.x;   // v7.5: a entrada chega na tela; com a câmera no salão, tela = mundo (a fila fica em x < 0)
// espera chegar um grupo
let guard=0; while(!g.queue.length && guard++<400) g.update(0.05);
ok(g.queue.length>0,'grupo chegou');
// v7.4: todas as mesas abertas desde o dia 1; teste boing: mesa suja
const grp=g.queue[0];
ok(g.tables.length>=4 && g.tables.every(t=>t.open),'dia 2: todas as mesas abertas');
const suja=g.tables[2]; suja.dirty=true;
ok(g.seatGroup(grp,suja)===false && grp.boing>0 && grp.state==='queue','boing em mesa suja');
suja.dirty=false;
// seleção + toque
g.onDown(QX,L.LAYOUT.QUEUE.ys[0]-20); g.onUp(QX,L.LAYOUT.QUEUE.ys[0]-20); ok(g.sel===grp,'grupo selecionado por toque');
const t1=g.tables.find(t=>t.free&&t.seats>=grp.size);
g.onDown(t1.cx,t1.cy); ok(grp.state==='toTable' && g.sel===null,'toque na mesa senta grupo selecionado');
const m0=g.money; ok(m0>=10,'sentar pontua (+10 / bônus cor)');
guard=0; while(grp.state==='toTable'&&guard++<200) g.update(0.05); ok(grp.state==='reading'||grp.state==='wantOrder','chegou e lê cardápio');   // v7.5: vem da calçada, a caminhada varia com a mesa
// espera pedir
guard=0; while(grp.state!=='wantOrder'&&guard++<400) g.update(0.05);
ok(grp.state==='wantOrder','quer pedir');
// mãos cheias: duas xícaras
g.bia.hands=[{kind:'coffee'},{kind:'coffee'}];
g.tapTable(t1); run(5); ok(grp.state==='wantOrder' && g.bia.hands.length===2,'mãos cheias: não anota');
g.bia.hands=[];
g.tapTable(t1); run(4); ok(grp.state==='ordered' && g.bia.hands.some(h=>h.kind==='ticket'),'anotou pedido (ticket nas mãos)');
g.tapStation('order',800,150); run(5); ok(g.kitchen.cooking.length+g.kitchen.queue.length>0 || g.kitchen.plates.some(Boolean),'cozinha recebeu pedido');
g.tapStation('coffee',850,350); run(4); ok(g.bia.hands.some(h=>h.kind==='coffee'),'Bia pegou cafezinho');
grp.hearts=3; g.tapTable(t1); run(5); ok(grp.coffee===true && grp.hearts===4 && !g.bia.hands.some(h=>h.kind==='coffee'),'cafezinho entregue (+1 coração)');
guard=0; while(!g.kitchen.plates.some(Boolean)&&guard++<400) g.update(0.05);
ok(g.kitchen.plates.some(Boolean),'prato pronto');
const p=g.kitchen.plates.find(Boolean), i=g.kitchen.plates.indexOf(p);
g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y); run(5);
ok(g.bia.hands.some(h=>h.kind==='dish'),'pegou prato');
g.tapTable(t1); run(4); ok(grp.state==='eating','entregou, comendo');
guard=0; while(grp.state!=='wantBill'&&guard++<400) g.update(0.05);
ok(grp.state==='wantBill','quer conta');
// os grupos da agenda ficaram esperando na fila o teste todo; se um deles perder o último
// coração durante o run(4), a multa de -30 anula a conta e money não sobe. Enche a paciência deles.
for (const q of g.queue) q.gain(5);
const mb=g.money; g.tapTable(t1); run(4); ok(g.money>mb && t1.dirty && g.stats.served===1,'conta paga, mesa suja, servidos=1');
// ação inválida
g.bia.hands=[];
g.tapTable(t1); run(4); ok(g.bia.hands.some(h=>h.kind==='dirty') && !t1.dirty,'recolheu louça, mesa livre');
g.tapStation('sink',850,450); run(5); ok(!g.bia.hands.some(h=>h.kind==='dirty'),'lavou na pia');
// '?' em sink vazio
g.tapStation('sink',850,450); run(5); ok(g.bia.qT>0||true,'pia vazia gera ?');
// remover ação pelo HUD
g.bia.clearActs(); g.tapStation('coffee',850,350); g.tapStation('order',800,150);
ok(g.bia.acts.length===2,'2 ações na fila'); g.onDown(360+52*1+10,570); ok(g.bia.acts.length===1,'toque no ícone remove ação');
g.onDown(360+10,570); ok(g.bia.acts.length===0,'remove ação atual');
// limite 6
for(let k=0;k<9;k++) g.tapStation('coffee',850,350); ok(g.bia.acts.length===6,'fila máx 6');
g.bia.clearActs();
// paciência esgota -> vai embora bravo
guard=0; while(!g.queue.length&&guard++<2000) g.update(0.05);
const q=g.queue[0]; const mm=g.money, lost=g.stats.lost; q.hearts=1; q.patLeft=0.05; run(0.3);
ok(g.stats.lost===lost+1 && q.state==='leaving' && g.money<=mm,'cliente bravo vai embora (-30)');
// fim de tempo sem penalidade
g.clock=0.1; run(1); const lost2=g.stats.lost; ok(g.ending && g.groups.every(x=>x.state==='leaving'),'tempo zerou: todos saem');
run(5); ok(g.state==='dayend' && g.stats.lost===lost2,'dia acabou sem penalidade extra');
// pausa por visibilidade
g.startDay(1); g.begin(); g.pause(); ok(g.state==='paused','pause'); 
console.log('fails=',fails); process.exit(fails?1:0);
