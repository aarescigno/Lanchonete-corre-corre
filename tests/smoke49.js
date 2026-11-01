// v9.6.2, etapa 3c: a ajudante lava a louça da pia antes de recolher mais mesas; a conversa do Cardápio no fim do dia 2;
// a conversa dos entregadores no fim do dia 4; o "+ marmita" desligado (MARMITA.adiantar false).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } return n; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };

// ---------- 1. a Dani lava antes de recolher mais mesas ----------
const dia=(dia,eq)=>{ const H=load(), {g,L}=H; g.save=L.normSave({ bank:2000, dia, maxDay:dia, equipe:Object.assign({ tonhao:1, dani:2, daniTasks:['pratos','lavar'] },eq||{}) }); g.up=g.save.up; g.buildTables(); g.startDay(dia); g.begin(); g.schedule=[]; g.nextIdx=0; return H; };
{ const {g,L}=dia(3), d=g.dani;
  ok(d.does('pratos') && d.does('lavar'),'a Dani faz "Retirar pratos" e "Lavar louça"');
  d.hands=[]; d.plan=null; d.phase='idle'; d.x=d.home.x; d.y=d.home.y;
  g.tables[0].open=true; g.tables[0].dirty=true; g.tables[0].dirtyN=2; g.kitchen.sinkN=2; g.bia.phase=g.bia.phase;
  d.think(); ok(d.plan && d.plan.type==='sink','com mesa suja e louça na pia, vai à pia primeiro');
  d.plan=null; d.phase='idle'; g.kitchen.sinkN=0; d.think(); ok(d.plan && d.plan.type==='clear','sem louça na pia, recolhe a mesa');
  // voltando ao canto: repensa ao aparecer louça
  d.plan=null; d.phase='idle'; d.x=g.tables[0].cx; d.y=g.tables[0].cy+80; g.tables[0].dirty=false; g.kitchen.sinkN=0;
  d.go(d.home,null); ok(d.phase==='walk' && !d.plan,'voltando ao canto, sem tarefa');
  g.kitchen.sinkN=1; d.thinkT=0; d.update(0.3); ok(d.plan && d.plan.type==='sink','na volta ao canto, aparece louça e ela vai à pia');
  // a Bia lavando: a Dani não vai lavar
  d.plan=null; d.phase='idle'; g.kitchen.sinkN=2; g.bia.plan=null; Object.defineProperty(g.bia,'washing',{ get(){ return true; }, configurable:true });
  d.think(); ok(!d.plan || d.plan.type!=='sink','com a Bia lavando, a Dani não vai lavar'); delete g.bia.washing; }

// ---------- 2. as conversas do Modo História ----------
{ const H=nova(), {g,L,els}=H, sv=g.save;
  ok(L.HIST_CARDAPIO.dia===2 && L.HIST_ENTREGA.dia===4 && L.HIST_ENTREGA.falas.length===6,'constantes: Cardápio no dia 2, entregadores no dia 4 (6 falas)');
  sv.conversa=null; sv.bank=5000; sv.convCard=0; sv.convEnt=0;
  g.startDay(1); joga(H,400); ok(sv.convCard!=='pend','fechar o dia 1 não deixa convCard pendente'); els['btn-next'].fire('click'); passa(H);
  g.startDay(2); joga(H,400); ok(sv.convCard==='pend','fechar o dia 2 deixa convCard pendente'); els['btn-next'].fire('click'); passa(H);
  g.startDay(3); joga(H,400); ok(sv.convEnt!=='pend','fechar o dia 3 não deixa convEnt pendente'); els['btn-next'].fire('click'); passa(H);
  sv.convDiv=1; sv.libera=sv.libera||{};
  g.startDay(4); joga(H,400); ok(sv.convEnt==='pend','fechar o dia 4 deixa convEnt pendente'); els['btn-next'].fire('click');
  let achou=false, n=0; while(g.conversa && n<60){ if(/Tio, que história é essa de motoqueiro/.test(g.conversa.fala.s)) achou=true; toque(els); n++; }
  ok(achou && sv.convEnt===1,'a conversa toca a 1ª fala dos entregadores e termina com convEnt 1');
  g.startDay(5); joga(H,400); els['btn-next'].fire('click'); passa(H); ok(sv.convEnt===1,'fechar o dia 5 não repete');
  ok(L.normSave({ convEnt:'pend' }).convEnt==='pend' && L.normSave({ convEnt:1 }).convEnt===1 && L.normSave({}).convEnt===0,'normSave guarda convEnt'); }
{ const H=load(), {g}=H; g.save.bank=5000; for(let n=1;n<=5;n++){ g.startDay(n); joga(H,400); }
  ok(g.save.convEnt!=='pend' && g.save.convCard!=='pend','sem o Modo História, nada fica pendente'); }

// ---------- 3. o "+ marmita" desligado ----------
{ const {g,L}=dia(4); g.schedule=[{t:1e9,type:'entregador',color:0}];
  ok(L.MARMITA.adiantar===false && g.marmitaOk,'dia 4: há entregador e MARMITA.adiantar é false');
  ok(!g.estacaoOn('adiantar') && g.estacaoOn('retirada'),'estacaoOn: "adiantar" falso, "retirada" verdadeiro');
  g.tapStation('adiantar'); ok(g.marmitasLivres===0,'tocar no "+ marmita" não faz marmita'); }
console.log('smoke49: total =',total,' fails =',fails);
process.exit(fails?1:0);
