// v8.6.3: Livrinho de Sudoku. A fila de ações da Bia começa com 5 quadrinhos (eram 6) e a melhoria acrescenta 3.
const H=require('./harness.js')(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=up=>{ g.save=L.normSave({bank:2000,maxDay:5,up:up||{}}); g.up=g.save.up; g.boughtFor=0; g.shopBought=false; g.buildTables(); g.startDay(3); g.begin(); g.schedule=[]; g.nextIdx=0; g.bia.acts=[]; };

{ const u=L.UPGRADES.find(x=>x.id==='sudoku'); ok(u && u.name==='Livrinho de Sudoku' && u.cost>0 && !u.multi && !u.req,'Livrinho de Sudoku na lojinha'); }
ok(L.filaMax({})===5 && L.filaMax(null)===5 && L.filaMax({sudoku:true})===8,'filaMax: 5 de base, 8 com o Livrinho de Sudoku');

novo(); { const mesa=g.tables.filter(t=>t.open);
  let n=0; for(let i=0;i<9;i++) if(g.bia.enqueue({type:'coffee'})) n++;
  ok(n===5 && g.bia.acts.length===5,'sem o livrinho: 5 ações cabem na fila e a 6ª é recusada');
  ok(g.hudHit(L.HUDX.fila+360+4*52+10,570).k==='slot' && g.hudHit(L.HUDX.fila+360+4*52+10,570).i===4,'o 5º quadrinho recebe o toque');
  ok(g.hudHit(L.HUDX.fila+360+5*52+10,570).k==='hud','o 6º quadrinho não existe sem o livrinho');
 }

novo({sudoku:true}); {
  let n=0; for(let i=0;i<10;i++) if(g.bia.enqueue({type:'coffee'})) n++;
  ok(n===8 && g.bia.acts.length===8,'com o livrinho: 8 ações cabem e a 9ª é recusada');
  ok(g.hudHit(L.HUDX.fila+360+7*52+10,570).k==='slot' && g.hudHit(L.HUDX.fila+360+7*52+10,570).i===7,'o 8º quadrinho recebe o toque');
  g.onDown(L.HUDX.fila+360+7*52+10,570); ok(g.bia.acts.length===7,'o toque no 8º quadrinho cancela a ação');
  // o 8º quadrinho não invade as mãos (HUDX.dir + 696)
  ok(L.HUDX.fila+360+8*52 < L.HUDX.dir+696,'a fila de 8 quadrinhos não passa por cima das mãos'); }

// compra: 1 melhoria por dia
novo(); { g.save.bank=2000; const b0=g.save.bank; ok(g.buy('sudoku') && g.up.sudoku===true && g.save.bank===b0-L.UPGRADES.find(x=>x.id==='sudoku').cost,'comprou o livrinho'); ok(!g.buy('bandeja'),'e a melhoria do dia foi esta'); }

// desenho: fila de 5 e de 8 sem erro (o render do jogo e o ícone da lojinha)
for(const up of [{},{sudoku:true}]){ novo(up); let err=null; try{ g.bia.enqueue({type:'coffee'}); L.render(g,ctx); }catch(e){ err=e; } ok(!err,'desenha o HUD '+(up.sudoku?'com':'sem')+' o livrinho'+(err?': '+err.message:'')); }

console.log((fails?'FALHOU':'OK')+' smoke29: '+(total-fails)+'/'+total);
process.exit(fails?1:0);
