// v12.8.3: as turmas da espera sem toque trocado (a de cima fica com a área dela até os pés). Spec: docs/spec-v12.8.3.md. CA1 a CA5.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const dia=(ponto,cap)=>{ const H=load(), {g,L}=H;
  g.save=L.normSave({ cap:cap||3, dia:10, maxDay:10, bank:50000, up:{}, salao:{ ponto } }); g.up=g.save.up; g.tablesKey=''; g.buildTables();
  g.startDay(10); g.begin(); g.schedule=[]; g.nextIdx=0; return H; };
const chega=(g,type)=>g.spawn({ type, color:0, vip:false });
const sentaNaEspera=g=>{ for(let i=0;i<200 && g.queue.some(x=>x.path.length);i++){ g.queue.forEach(x=>x.patLeft=1e9); g.update(0.05); } };
const pega=(g,x,y)=>{ const h=g.pickAt(x,y,0); return h && h.k==='queue' ? h.g : null; };

// CA1 e CA2: Avenida, turmas nos lugares 1 e 2
{ const {g,L}=dia('avenida',7), Q=L.QUEUE; const a=chega(g,'estudante'), b=chega(g,'vovos'), c=chega(g,'familia'); sentaNaEspera(g);
  ok(Q.ys.length===6 && b.slot===1 && c.slot===2,'Avenida: 6 lugares, turmas nos lugares 1 e 2');
  ok(pega(g,Q.x,Q.ys[2]+6)===c,'CA1: os pés da turma de cima pegam a turma de cima');
  ok(pega(g,Q.x,Q.ys[1]-20)===b,'CA2: o corpo da turma de baixo pega a turma de baixo'); }
// CA3: sem turma no lugar de cima, a área é inteira
{ const {g,L}=dia('avenida',7), Q=L.QUEUE; chega(g,'estudante'); const b=chega(g,'vovos'); sentaNaEspera(g);
  ok(g.queue.length===2 && pega(g,Q.x,Q.ys[1]-70)===b,'CA3: sem turma em cima, os corações da turma do lugar 1 pegam ela'); }
// CA4: em cada ponto, espera cheia, áreas vizinhas sem cruzar e com 40 px ou mais
for (const [p,cap] of [['garagem',3],['industrial',5],['avenida',7],['terraco',10]]){
  const {g,L}=dia(p,cap); for(let i=0;i<g.ponto.espera;i++) chega(g,'estudante'); sentaNaEspera(g);
  const R=g.queue.map(x=>L.queueRect ? L.queueRect(x) : null);
  let cruza=false, baixa=1e9; R.forEach((r,i)=>{ baixa=Math.min(baixa,r.h); if(i+1<R.length && R[i+1].y+R[i+1].h>r.y) cruza=true; });
  ok(g.queue.length===g.ponto.espera && !cruza && baixa>=40,'CA4: '+p+': '+R.length+' turmas, áreas sem cruzar, a menor com '+baixa+' px'); }
// CA5: Garagem, arrastar a turma de cima pelos pés até uma mesa livre
{ const {g,L}=dia('garagem',3), Q=L.QUEUE; g.cam=0; const a=chega(g,'estudante'), b=chega(g,'estudante'); sentaNaEspera(g);
  const t=g.tables.find(t=>t.free && t.seats>=b.size), y=Q.ys[1]+10;
  g.onDown(Q.x,y); g.onMove(Q.x+40,y); g.onMove(t.cx,t.cy); g.onUp(t.cx,t.cy);
  ok(b.state==='toTable' && a.state==='queue','CA5: arrastar pelos pés senta a turma de cima, e a de baixo continua na espera'); }

console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
