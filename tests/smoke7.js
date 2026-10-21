// Toque no celular: folga do dedo, tremido sem virar arrasto, pratos e brilho de confirmação.
const H=require('./harness.js')(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const PAD=23;   // folga de um celular deitado (escala ~0,6)
const glows=()=>g.fx.filter(f=>f.k==='glow').length;
g.startDay(3); g.begin(); g.cam=0; const QX=L.LAYOUT.QUEUE.x;   // v7.5: a entrada chega na tela; com a câmera no salão, tela = mundo (a fila fica em x < 0)
const S=L.LAYOUT.STATIONS, b=g.bia;

// lixeira (46×62): toque 15 px à esquerda dela
b.clearActs(); g.onDown(S.trash.rect.x-15, 500, 0); ok(b.acts.length===0,'mouse: fora da lixeira não conta');
g.onDown(S.trash.rect.x-15, 500, PAD); ok(b.acts.length===1 && b.acts[0].type==='trash','dedo: perto da lixeira conta');
ok(glows()===1,'brilho sobre o alvo tocado');
{ const f=g.fx.find(f=>f.k==='glow'); ok(f.key==='trash' && f.w===undefined,'brilho é do objeto (sem retângulo de halo)'); }
// acerto exato vence a folga: café e suco lado a lado
b.clearActs(); g.onDown(860, 350, PAD); ok(b.acts[0] && b.acts[0].type==='coffee','borda do café continua café');
b.clearActs(); g.onDown(866, 350, PAD); ok(b.acts[0] && b.acts[0].type==='juice','borda do suco continua suco');
// longe de tudo: nada, só o anel discreto
b.clearActs(); const n0=g.fx.length; g.onDown(345, 310, PAD); ok(b.acts.length===0 && g.fx.length===n0+1 && g.fx[g.fx.length-1].k==='tap','toque no vazio: só anel');

// pratos: coluna vazia ou topo do balcão pega o prato pronto mais perto
g.kitchen.plates=[null,null,{id:901,dish:'pf',group:null},null];
b.clearActs(); g.onDown(S.plates.rect.x+10, S.plates.rect.y+8, PAD); ok(b.acts[0] && b.acts[0].pid===901,'prato: toque fora da coluna pega o mais perto');
g.onDown(890, 270, PAD); ok(b.acts.length===1,'prato já na fila não duplica');
g.kitchen.plates=[null,null,null,null];

// grupo na fila: tremido de ~12 px vira seleção, não arrasto
let guard=0; while(!g.queue.length && guard++<600) g.update(0.05);
const grp=g.queue[0], qy=L.LAYOUT.QUEUE.ys[grp.slot]-20;
g.sel=null; g.onDown(QX,qy,PAD); g.onMove(QX+10,qy+7); g.onUp(QX+10,qy+7);
ok(g.sel===grp && grp.state==='queue','dedo tremido seleciona o grupo');
g.sel=null; g.onDown(QX,qy,0); g.onMove(QX+10,qy+7); g.onUp(QX+10,qy+7);
ok(g.sel===null,'mouse: mesmo movimento é arrasto');
// arrasto solto perto da mesa (fora do retângulo) senta
const t=g.tables.find(t=>t.open&&t.free&&t.seats>=grp.size), r={x:t.cx-t.hx-10,y:t.cy-62};
g.onDown(QX,qy,PAD); g.onMove(200,200); g.onUp(r.x-12, t.cy);
ok(grp.state==='toTable','arrasto solto rente à mesa senta o grupo');

// HUD: ícone da fila com a área cheia da faixa
b.clearActs(); g.tapStation('coffee',850,350); g.tapStation('order',800,150);
g.onDown(360+52+47, 598, PAD); ok(b.acts.length===1,'ícone da fila: canto de baixo conta');

// o brilho some e o desenho não quebra
for(let i=0;i<20;i++) g.update(0.05);
ok(!g.fx.some(f=>f.k==='glow'||f.k==='tap'),'brilho some em menos de 1 s');
g.onDown(850,350,PAD); let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'render com brilho'+(err?': '+err:''));

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
