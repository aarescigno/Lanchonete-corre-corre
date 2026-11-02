// v9.6.11, etapa 3g-2: a tela avisa: comentários do Gurugol em balões, geladeira fora da tela, mesinha das marmitas, letreiro eFood,
// seta nas marmitas prontas (dias 4 e 5) e a fumaça do lixo que se espalha.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els}=H;
const aval=(s,k,t)=>({ r:s.slice(), s, txt:t, k });
const novo=(dia)=>{ g.save=L.normSave({bank:2000,dia,maxDay:dia}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.startDay(dia); g.begin(); g.schedule=[{t:1e9,type:'entregador'}]; };
const roda=(s,cond)=>{ for(let i=0;i<s/0.05;i++){ g.update(0.05); if(cond&&cond()) return true; } return false; };
const entregador=()=>{ const e=g.spawn({type:'entregador',color:1}); e.patLeft=1e9; e.hearts=5; return e; };
const K=()=>g.kitchen;

// (1) balões do Gurugol no topo do fim do dia
g.save=L.normSave({bank:2000,dia:3,maxDay:3}); g.up=g.save.up; g.startDay(3); if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click');
g.schedule=[]; g.nextIdx=0; g.avals=[aval([5,5,5,5,5],'estudante','Adorei!'),aval([2,2,2,2,2],'familia','Demorou.'),aval([4,4,4,4,4],'executiva','Boa.')];
g.finishDay();
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const bal=els['end-baloes'];
ok(bal && bal.children.length>=2 && bal.children.length<=3,'fim do dia: 2 a 3 balões no topo ('+(bal&&bal.children.length)+')');
ok(txt(bal).includes('Adorei!'),'o balão traz o comentário');
ok(g.result.aval.comentK.length===g.result.aval.coment.length && g.result.aval.comentK[0]==='estudante','cada comentário leva o tipo de cliente (rostinho)');
ok(!txt(els['end-aval']).includes('Adorei'),'os comentários saem do rodapé');
g.avals=[]; g.save=L.normSave({bank:2000,dia:3,maxDay:3}); g.startDay(3); if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.finishDay();
ok(!bal.children.length,'sem comentário, nenhum balão');

// (2) geladeira fora da tela, manutenção escondida segue valendo
{ const fs=require('fs'); const src=fs.readFileSync(__dirname+'/../src/23-render.js','utf8');
  ok(!/drawGeladeira\(ctx/.test(src) && /drawMesinha\(ctx/.test(src),'render: sem drawGeladeira, com drawMesinha');
  novo(4); const c0=Math.round(L.precoPrato('pf',g.ponto,g.cursos)*L.INGRED.prato);
  g.quebras=[{id:'geladeira',t:0,on:true,fixed:false}]; ok(g.quebrado('geladeira'),'a geladeira ainda quebra (escondida)'); }

// (3) mesinha: vagas empilhadas; a Bia pega ali e leva ao entregador (entrega completa)
novo(4);
ok(L.LAYOUT.MARMJ_SLOTS.length===2 && L.LAYOUT.MARMJ_SLOTS.every((s,i)=>s.x===710 && s.y===124+24*i),'MARMJ_SLOTS: x 710, y 124+24i');
ok(L.STATIONS.marmj.ap.x===700 && L.STATIONS.marmj.ap.y===150,'ponto de parada da mesinha');
{ const e=entregador(); roda(25,()=>K().marmJ.some(Boolean)); ok(K().marmJ.some(m=>m&&m.dono===e),'a marmita pronta fica na mesinha');
  const dinheiro0=g.money; g.tapStation('marmj',710,124);
  const a=g.bia.acts[0]; ok(a && a.type==='plate' && g.bia.apFor(a)===L.STATIONS.marmj.ap,'a Bia vai ao ponto da mesinha');
  roda(15,()=>g.bia.hands.some(h=>h.kind==='marmita')); ok(g.bia.hands.some(h=>h.kind==='marmita'),'pegou a marmita');
  g.tapStation('retirada',L.STATIONS.retirada.rect.x+5,L.STATIONS.retirada.rect.y+5);
  roda(20,()=>g.stats.marmitas>=1); ok(g.stats.marmitas>=1,'levou ao entregador: entrega completa'); }
ok(L.STATIONS.marmj.rect.x+L.STATIONS.marmj.rect.w<=L.STATIONS.order.rect.x && L.STATIONS.marmj.rect.x>=L.STATIONS.drinks.rect.x+L.STATIONS.drinks.rect.w,'a mesinha não encosta no balcão de drinks nem na cozinha');

// (4) letreiro e (5) seta: só nos dias 4 e 5
novo(4); { entregador(); roda(25,()=>K().marmJ.some(Boolean)); ok(g.setaMesinha===true,'dia 4: seta com marmita de entregador na mesinha'); }
novo(5); { entregador(); roda(25,()=>K().marmJ.some(Boolean)); ok(g.setaMesinha===true,'dia 5: seta'); }
novo(6); { entregador(); roda(25,()=>K().marmJ.some(Boolean)); ok(g.setaMesinha===false,'dia 6: sem seta'); }
novo(4); ok(g.setaMesinha===false,'dia 4 sem marmita pronta: sem seta');
{ const fs=require('fs'); const src=fs.readFileSync(__dirname+'/../src/21-cenario.js','utf8');
  ok(/drawLetreiroEfood\(ctx,grp,tm\)/.test(src) && /% 1\) < 0\.6/.test(src) && /RM \|\| /.test(src),'letreiro eFood: 0,6 s acesa de 1 s, fixo com reduced-motion'); }

// (6) fumaça: o raio cresce, quem está fora não sente, quem está dentro sente
novo(3);
{ const F=L.TRASH.fumaca; ok(F.cresce===30 && F.raio===900,'TRASH.fumaca = cresce 30, raio 900');
  g.trash=L.TRASH.cap; ok(g.fumacaRaio===0,'cheia agora: raio 0');
  roda(15); ok(Math.abs(g.fumacaRaio-450)<30,'aos 15 s o raio é ~450 ('+Math.round(g.fumacaRaio)+')');
  roda(20); ok(g.fumacaRaio===900,'passou de 30 s: raio 900 (máximo)');
  const a=new L.Group(g,'estudante',1,0); a.setState('wantOrder'); a.game.mode='carreira';
  const queda=()=>{ a.patLeft=100; a.tick(1); return 100-a.patLeft; };
  g.fumacaT=10; const r=g.fumacaRaio; a.x=L.TRASH.pos.x-r-50; a.y=L.TRASH.pos.y; ok(Math.abs(queda()-1)<1e-9,'fora do raio: sem cheiro');
  a.x=L.TRASH.pos.x-r+50; ok(Math.abs(queda()-1.3)<1e-9,'dentro do raio: cheiro (paciência ÷ 1,3)');
  g.fumacaT=30; g.trash=0; roda(3.05); ok(g.fumacaRaio===0,'esvaziou: a fumaça some em 3 s'); }
{ const fs=require('fs'); const src=fs.readFileSync(__dirname+'/../src/21-cenario.js','utf8');
  ok(/function drawFumacaLixo/.test(src) && /if \(!RM\)/.test(src),'fumaça: nuvens só sem reduced-motion (véu parado com ele)'); }
console.log('total =',total,' fails =',fails); process.exit(fails?1:0);
