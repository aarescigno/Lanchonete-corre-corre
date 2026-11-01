// v9.6.5, etapa 3d-2: a fileira própria das marmitas (marmJ), as mesas na frente no fogão, entregadores espaçados,
// a marmita do entregador que desistiu e o prato mais antigo.
const H=require('./harness.js')(); const {g,L}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=(dia,o)=>{ o=o||{}; g.save=L.normSave(Object.assign({bank:2000,dia,maxDay:dia},o)); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.startDay(dia); g.begin(); g.schedule=[{t:1e9,type:'entregador',color:0}]; g.nextIdx=0; };
const roda=(s,cond)=>{ for(let i=0;i<s/0.05;i++){ g.update(0.05); if(cond&&cond()) return true; } return false; };
const entregador=()=>{ const e=g.spawn({type:'entregador',color:1}); e.patLeft=1e9; e.hearts=5; return e; };
const K=()=>g.kitchen;

// (a) marmita pronta vai para marmJ, nunca para plates; marmJanela por ponto
novo(4);
ok(L.PONTOS[0].marmJanela===2 && L.PONTOS[1].marmJanela===3 && L.PONTOS[2].marmJanela===3,'marmJanela: Garagem 2, industrial 3, Avenida 3');
ok(K().marmJ.length===2 && L.LAYOUT.MARMJ_SLOTS.length===2 && L.LAYOUT.MARMJ_SLOTS[0].y===242,'Garagem: 2 vagas de marmita na faixa de cima');
{ const e=entregador(); ok(roda(20,()=>K().marmJ.some(Boolean)),'a marmita fica pronta');
  ok(K().marmJ.some(m=>m&&m.dono===e) && !K().plates.some(p=>p&&p.kind==='marmita'),'está em marmJ, não em plates');
  ok(g.marmitas().some(o=>o.onde==='pronta'),'marmitas() acha a pronta em marmJ'); }

// (b) marmJ cheia: o fogão faz os pratos das mesas
novo(4);
{ K().marmJ[0]={id:900,kind:'marmita',dish:'pf',dono:null,slot:0,age:0};K().marmJ[1]={id:901,kind:'marmita',dish:'pf',dono:null,slot:1,age:0};
  K().queue.push({marmita:true,group:null,table:0,time:5,p:0,dish:'pf',dono:null});
  const t2={group:null,table:1,time:5,p:0,dish:'pf'}; K().queue.push(t2);
  K().update(0.05);
  ok(K().cooking.includes(t2) && !K().cooking.some(t=>t.marmita),'com marmJ cheia, a marmita espera e o prato de mesa vai ao fogão');
  ok(K().queue.length===1 && K().queue[0].marmita,'a marmita segue na fila'); }

// (c) agenda sem 2 entregadores a menos de MARMITA.gap
{ let bad=0,ents=0; for(let n=0;n<40;n++){ novo(6); g.save.dia=6; const ag=g.buildSchedule(g.day); const ts=ag.filter(s=>s.type==='entregador').map(s=>s.t); ents+=ts.length; for(let i=1;i<ts.length;i++) if(ts[i]-ts[i-1]<L.MARMITA.gap-1e-9) bad++; }
  ok(bad===0,'agenda: nunca 2 entregadores a menos de '+L.MARMITA.gap+' s ('+ents+' entregadores sorteados)'); }

// (d) o entregador vai embora
novo(4);
{ // no fogão: sai sem custo
  const e=entregador(); roda(0.2); const t=K().cooking.find(t=>t.marmita&&t.dono===e);
  e.hearts=1; e.patLeft=0.01; roda(0.1);
  ok(t && !K().cooking.includes(t) && !K().queue.includes(t) && g.stats.jogadas===0,'no fogão: sai, sem custo'); }
novo(4);
{ // na janela e na prateleira: lixo
  const e=entregador(); roda(20,()=>K().marmJ.some(Boolean)); const lixo0=g.trash;
  e.hearts=1; e.patLeft=0.01; roda(0.1);
  ok(!K().marmJ.some(Boolean) && g.stats.jogadas===1 && g.trash===lixo0+1,'na janela: some e vai para o lixo (+1)');
  const e2=entregador(); g.prateleira.push({kind:'marmita',dish:e2.dish,dono:e2,age:0,mid:99}); K().queue=K().queue.filter(t=>t.dono!==e2);
  e2.hearts=1; e2.patLeft=0.01; roda(0.1);
  ok(!g.prateleira.length && g.stats.jogadas===2,'na prateleira: some e vai para o lixo'); }
novo(4);
{ // na mão da Dani: lixo; na da Bia: fica com X, sai com um toque na lixeira
  const e=entregador(); const m={kind:'marmita',dish:e.dish,dono:e,age:0,mid:98};
  g.dani.hands=[m]; K().queue=[]; e.hearts=1; e.patLeft=0.01; roda(0.1);
  ok(!g.dani.hands.length && g.stats.jogadas===1,'na mão da Dani: some e vai para o lixo');
  const e2=entregador(); const m2={kind:'marmita',dish:e2.dish,dono:e2,age:0,mid:97};
  g.bia.hands=[m2]; K().queue=[]; e2.hearts=1; e2.patLeft=0.01; roda(0.1);
  ok(g.bia.hands.includes(m2) && !m2.dono && m2.jogar===true,'na mão da Bia: fica sem dono, com o X');
  const lx=g.trash; g.bia.acts=[]; g.bia.phase='idle'; g.tapStation('trash',700,500);
  ok(roda(15,()=>!g.bia.hands.some(h=>h.kind==='marmita')),'um toque na lixeira joga fora');
  ok(g.trash>=lx+1 && g.stats.jogadas===2,'+1 lixo e jogadas=2'); }

// (e) 3 pratos prontos: 3 toques em qualquer ponto pegam do mais antigo ao mais novo
novo(3);
{ const mk=(i,age)=>{ K().plates[i]={id:700+i,table:1,group:null,dish:'pf',slot:i,age,crit:false,q:3}; };
  mk(0,5); mk(1,20); mk(2,10);
  const x=L.LAYOUT.PLATE_SLOTS[0].x, y=L.LAYOUT.PLATE_SLOTS[0].y;
  g.tapStation('plates',x,y); g.tapStation('plates',x,y); g.tapStation('plates',x,y);
  ok(g.bia.acts.map(a=>a.pid).join()==='701,702,700','pega 1º o de 20 s, depois 10 s, depois 5 s'); }
// toque na faixa de cima: a marmita mais antiga; sem marmita, o prato
novo(4);
{ K().plates[0]={id:710,table:1,group:null,dish:'pf',slot:0,age:30,crit:false,q:3};
  K().marmJ[0]={id:711,kind:'marmita',dish:'pf',dono:null,slot:0,age:5,mid:1}; K().marmJ[1]={id:712,kind:'marmita',dish:'pf',dono:null,slot:1,age:9,mid:2};
  g.tapStation('plates',800,242); ok(g.bia.acts[0].pid===712,'faixa de cima: a marmita mais antiga');
  g.tapStation('plates',800,242); g.tapStation('plates',800,242);
  ok(g.bia.acts.map(a=>a.pid).join()==='712,711,710','acabaram as marmitas: vale o prato'); }

console.log('total =',total,' fails =',fails); process.exit(fails?1:0);
