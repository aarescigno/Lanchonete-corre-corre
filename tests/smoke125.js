// v12.11: o salão que cabe o teto e a troca de mesas (spec: docs/spec-v12.11.md). CA1 a CA9 (CA10 é a captura shot_v12_11.js; CA11, o menu_fit.py).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const mk=a=>a.map((seats,c)=>({x:0,y:0,seats,c:c%4}));
const novo=(ponto,mesas,est,bank)=>{ const H=load(), {g,L}=H;
  g.save=L.normSave({ dia:50, maxDay:50, bank:bank==null?9000:bank, salao:{ ponto } }); g.up=g.save.up;
  if(mesas){ g.save.salao.mesas=mesas; g.save.salao.estoque=est||[]; }
  g.tablesKey=''; g.buildTables(); g.goShop(50); return H; };
const chave=l=>JSON.stringify(l.map(m=>[m.x,m.y,m.seats,m.c]).sort());
bloco('CA1',()=>{ const {L}=load(); let falhas=[], n=0;
  L.PONTOS.forEach(P=>{ for(let n4=0;4*n4<=P.lugares;n4++) for(let n2=0;4*n4+2*n2<=P.lugares;n2++){
    if(!n4&&!n2) continue;
    const a=Array(n4).fill(4), b=Array(n2).fill(2), alt=[]; for(let i=0;i<Math.max(n4,n2);i++){ if(i<n4) alt.push(4); if(i<n2) alt.push(2); }
    [['4 primeiro',a.concat(b)],['2 primeiro',b.concat(a)],['alternada',alt]].forEach(o=>{ n++; if(!L.salaoAuto(mk(o[1]),P)) falhas.push(P.id+' '+n4+'x4+'+n2+'x2 '+o[0]); }); } });
  ok(n>400 && !falhas.length,'CA1: toda mistura de mesas de 2 e de 4 até o teto tem arrumação, nos 4 pontos, em 3 ordens ('+n+' arranjos; falhas: '+falhas.slice(0,4).join(', ')+')'); });
bloco('CA2',()=>{ const {g,L}=novo('avenida',null); const P=L.pontoOf('avenida');
  g.save.salao.mesas=L.salaoAuto(mk(Array(12).fill(2)),P); g.tablesKey=''; g.buildTables(); g.startDay(50);
  const de=L.STATIONS.order.ap, alvos=[['o balcão de retirada',L.STATIONS.retirada.ap],['a bebida da espera',L.STATIONS.drinks.ap]].concat(L.QUEUE.ys.map((y,i)=>['a espera '+(i+1),L.esperaAp(i)]));
  ok(L.QUEUE.ys.length===6,'CA2: a Avenida tem 6 lugares de espera ('+L.QUEUE.ys.length+')');
  alvos.forEach(a=>ok(L.pathOk(de,a[1]),'CA2: Avenida com 12 mesas de 2: a Bia chega a '+a[0]));
  const T=L.pontoOf('terraco'), mt=L.salaoAuto(mk(Array(10).fill(2)),T), pi=L.TERRACO.piano;
  const cruza=mt.some(m=>{ const b=L.mesaBox(m.x,m.y,m.seats); return b.x0<pi.x1 && pi.x0<b.x1 && b.y0<pi.y1 && pi.y0<b.y1; });
  ok(mt && mt.length===10 && !cruza,'CA2: Terraço com 10 mesas de 2: nenhuma mesa cruza o piano'); });
bloco('CA3',()=>{ const {L}=load();   // as posições são as que a v12.10.7 gravava (a salaoAuto de antes da mudança)
  const antiga=[[230,210,4,0],[410,210,4,1],[590,210,4,2],[230,420,4,3],[410,420,4,0],[590,420,4,1]].map(a=>({x:a[0],y:a[1],seats:a[2],c:a[3]}));
  const n=L.normSalao({ ponto:'avenida', mesas:antiga.map(m=>Object.assign({},m)) });
  ok(chave(n.mesas)===chave(antiga),'CA3: 6 mesas de 4 da v12.10.7 na Avenida passam pelo normSalao sem mudar nenhuma posição');
  const kit=[[310,210,2,0],[560,210,2,1],[300,420,2,2],[550,420,4,3]].map(a=>({x:a[0],y:a[1],seats:a[2],c:a[3]})), n2=L.normSalao({ ponto:'garagem', mesas:kit.map(m=>Object.assign({},m)) });
  ok(chave(n2.mesas)===chave(kit),'CA3: o kit da Garagem da v12.10.7 passa sem mudar nenhuma posição'); });
bloco('CA4',()=>{ const {g,L}=novo('industrial',null); const P=L.pontoOf('industrial');
  const m0=L.salaoAuto(mk([2,2,2,2,2,2]),P); g.save.salao.mesas=m0; g.tablesKey=''; g.buildTables();
  const A=m0[0], B=m0[1], antes=chave(m0), lug0=g.lugaresTot;
  const r=L.salaoTroca(m0,0,A,B.x,B.y,P);
  ok(!r.why && r.est.length===0 && r.movidas===1 && r.mesas.length===6,'CA4: salaoTroca: B se desloca no salão, nada vai para o estoque ('+(r.why||'movidas '+r.movidas+', est '+r.est.length)+')');
  ok(r.mesas.some(m=>m.x===B.x&&m.y===B.y&&m.c===A.c) && r.mesas.filter(m=>m.c===B.c).every(m=>m.x!==B.x||m.y!==B.y),'CA4: A fica onde foi solta e B saiu de lá');
  ok(g.moverMesa(0,B.x,B.y) && g.estoque.length===0 && g.lugaresTot===lug0 && g.save.salao.mesas.length===6 && !L.salaoProblema(g.save.salao.mesas,P) && g.salaoMsg==='','CA4: Game.moverMesa troca, sem estoque, sem mensagem, mesmos lugares');
  ok(chave(g.save.salao.mesas)!==antes && g.desfazerSalao() && chave(g.save.salao.mesas)===antes && g.estoque.length===0,'CA4: um Desfazer volta o arranjo de antes'); });
bloco('CA5',()=>{ const {g,L}=novo('avenida',null); const P=L.pontoOf('avenida');
  const m0=L.salaoAuto(mk(Array(12).fill(2)),P); m0[3].c=2; m0[3].t=1; g.save.salao.mesas=m0; g.tablesKey=''; g.buildTables();
  const B=m0[3], antes=chave(m0);
  ok(g.lugaresTot===24,'CA5: 24 lugares no salão da Avenida');
  const r=L.salaoTroca(m0,0,m0[0],B.x,B.y,P);
  ok(!r.why && r.est.length===1 && r.est[0].seats===2 && r.est[0].c===2 && r.est[0].t===1 && r.mesas.length===11,'CA5: salaoTroca: B vai para o estoque com a cor e a toalha ('+(r.why||'est '+r.est.length)+')');
  ok(g.moverMesa(0,B.x,B.y) && g.estoque.length===1 && g.estoque[0].c===2 && g.estoque[0].t===1 && g.save.salao.mesas.length===11,'CA5: Game.moverMesa guarda B no estoque');
  ok(g.salaoMsg==='Sem lugar no salão: 1 mesa foi para o estoque.','CA5: a mensagem é "Sem lugar no salão: 1 mesa foi para o estoque." ('+g.salaoMsg+')');
  ok(g.lugaresTot===24,'CA5: salão + estoque continuam com 24 lugares');
  ok(g.desfazerSalao() && chave(g.save.salao.mesas)===antes && g.estoque.length===0,'CA5: um Desfazer volta tudo (salão e estoque)');
  // duas mesas para o estoque
  const m1=L.salaoAuto(mk([4,4,4,4,4,4]),P), r2=L.salaoTroca(m1.concat([]),0,m1[0],m1[4].x,m1[4].y,P);
  ok(!r2.why && r2.est.length+r2.movidas===1,'CA5: mesa de 4 sobre mesa de 4: a deslocada ou vai ao estoque ou se desloca ('+(r2.why||'')+')'); });
bloco('CA6',()=>{ const P0=load().L.pontoOf('garagem');
  { const kit=load().L.salaoKit(P0); const {g,L}=novo('garagem',kit,[{seats:2,c:3,t:1}]); const P=L.pontoOf('garagem'), mesas=g.save.salao.mesas, B=mesas[1], lug0=g.lugaresTot;
    const r=L.salaoTroca(mesas,-1,g.estoque[0],B.x,B.y,P);
    ok(!r.why && r.mesas.length===mesas.length+1 && r.est.length+r.movidas===1 && !L.salaoProblema(r.mesas,P),'CA6: Garagem: a mesa do estoque solta sobre a B abre espaço ('+(r.why||'movidas '+r.movidas+', est '+r.est.length)+')');
    ok(g.tirarMesa(0,B.x,B.y) && g.save.salao.mesas.some(m=>m.x===B.x&&m.y===B.y&&m.c===3&&m.t===1) && g.lugaresTot===lug0 && !L.salaoProblema(g.save.salao.mesas,P),'CA6: Game.tirarMesa: a do estoque entra, a B se desloca ou vai para o estoque, os lugares não mudam'); }
  { const L0=load().L, P=L0.pontoOf('avenida'), m11=L0.salaoAuto(mk(Array(11).fill(2)),P); const {g,L}=novo('avenida',m11,[{seats:2,c:1}]); const B=g.save.salao.mesas[0];
    ok(g.lugaresTot===24 && g.tirarMesa(0,B.x,B.y) && g.save.salao.mesas.some(m=>m.x===B.x&&m.y===B.y&&m.c===1) && g.lugaresTot===24 && !L.salaoProblema(g.save.salao.mesas,P) && g.estoque.length+g.save.salao.mesas.length===12,'CA6: Avenida cheia: a do estoque entra e a que estava lá se desloca ou vai para o estoque, sem mudar os 24 lugares'); } });
bloco('CA7',()=>{ const {g,L}=novo('industrial',null); const P=L.pontoOf('industrial');
  const m0=L.salaoAuto(mk([2,2,2,2]),P), a=P.area;
  const r=L.salaoTroca(m0,0,m0[0],a.x0-20,a.y0+100,P);
  ok(r.why==='Fora do salão.','CA7: solta fora da área: recusa "Fora do salão." ('+r.why+')');
  g.save.salao.mesas=m0; g.tablesKey=''; g.buildTables();
  ok(!g.moverMesa(0,a.x1+10,300) && g.salaoMsg==='Fora do salão.','CA7: Game.moverMesa fora da área recusa ('+g.salaoMsg+')');
  // sem mesa no caminho: igual ao arrasto de sempre
  const livre=[[m0[0].x,m0[0].y+20],[m0[0].x+10,m0[0].y]].map(p=>L.salaoTroca(m0,0,m0[0],p[0],p[1],P));
  const velho=m0.slice(); velho[0]=Object.assign({},m0[0],{x:m0[0].x,y:m0[0].y+20});
  ok(!livre[0].why && livre[0].movidas===0 && !livre[0].est.length && chave(livre[0].mesas)===chave(velho) && !L.salaoProblema(velho,P),'CA7: sem mesa no caminho o arrasto é o de sempre (o arranjo é o mesmo)');
  ok(!L.salaoTroca(m0,0,m0[0],m0[0].x,m0[0].y,P).why,'CA7: soltar no mesmo lugar vale'); });
bloco('CA8',()=>{ const {L}=load(), E=L.EST;
  ok(E.x0===8 && E.y0===60 && E.x1===760 && E.y1===146,'CA8: EST é a faixa do alto { 8, 60, 760, 146 }');
  ok(L.naEst({x:100,y:100}) && L.naEst({x:700,y:70}) && !L.naEst({x:100,y:300}) && !L.naEst({x:300,y:160}) && !L.naEst({x:790,y:100}),'CA8: naEst vale num ponto da faixa e não num ponto do salão');
  [11,6].forEach(n=>{ const lista=n===11?Array(11).fill({seats:2}):Array(6).fill({seats:4}), sl=L.estSlots(lista);
    const caixas=sl.map((q,i)=>{ const hx=36*(lista[i].seats===4?62/36:1)*q.k; return { x0:q.x-hx, x1:q.x+hx, y0:q.y+q.k*(-4*q.k-L.MESA.top), y1:q.y+q.k*(-4*q.k+L.MESA.bot) }; });   // a mesa é desenhada com a escala k em torno de (q.x, q.y), com o centro 4k acima
    const dentro=caixas.every(b=>b.x0>=E.x0 && b.x1<=E.x1 && b.y0>=E.y0 && b.y1<=E.y1);
    let cruza=false; for(let i=0;i<caixas.length;i++) for(let j=i+1;j<caixas.length;j++){ const a=caixas[i], b=caixas[j]; if(a.x0<b.x1 && b.x0<a.x1 && a.y0<b.y1 && b.y0<a.y1) cruza=true; }
    ok(sl.length===n && dentro && !cruza,'CA8: '+n+' mesas de '+(n===11?2:4)+' no estoque ficam dentro da faixa, sem se cruzar (escala '+sl[0].k+')'); });
  ok(L.estSlots(Array(11).fill({seats:2}))[0].k===0.55,'CA8: 11 mesas de 2 cabem a 0,55'); });
bloco('CA9',()=>{ const {g,L}=novo('avenida',null); const P=L.pontoOf('avenida');
  g.save.salao.mesas=L.salaoAuto(mk(Array(12).fill(2)),P); g.tablesKey=''; g.buildTables();
  ok(!g.buyMesa(2) && g.salaoMsg==='O salão tem lugar para 24 pessoas, no máximo.','CA9: acima do teto o buyMesa diz "O salão tem lugar para 24 pessoas, no máximo." ('+g.salaoMsg+')'); });
bloco('versão',()=>{ const {L}=load(); ok(/^v12\.1[1-9]|^v12\.[2-9]\d|^v1[3-9]/.test(L.VERSAO),'a VERSAO é v12.11 ou mais nova ('+L.VERSAO+')'); });
console.log(fails?`\n${fails} de ${total} FALHARAM`:`\nTODOS OS ${total} PASSARAM`); process.exit(fails?1:0);
