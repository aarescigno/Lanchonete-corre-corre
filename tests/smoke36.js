// v8.8.1: "Pular tutorial" em todos os balões da Missão zero: volta direto ao menu, marca o treino como feito e restaura o save
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L}=H;
for (const passo of [0,1,3,5]){
  g.startTreino(); g.treino.chegar(); g.treino.i=passo; g.treino.mudou();
  g.treino.pular={x:100,y:100,w:100,h:20};   // o retângulo que drawTreino grava; o harness não desenha
  const r=g.treino.pular;
  g.onDown(r.x+5,r.y+5,0);
  ok(g.state==='menu','passo '+passo+': pular vai ao menu');
  ok(!g.treino && g.mode!=='treino' || g.state==='menu','passo '+passo+': saiu do treino');
  ok(g.save.treino===true && !g.save._treino,'passo '+passo+': save de verdade marcado como feito');
}
console.log('smoke36: total =',total,' fails =',fails);
