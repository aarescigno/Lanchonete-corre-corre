// v10.6, etapa 4c: eventos de bairro (festa junina e jogo do Brasil).
// CA1 um evento por semana; CA2 o peso por ponto; CA3 o sorteio guardado e sem clima; CA4 a véspera; CA5 a festa junina (grupos e famílias);
// CA6 a barraca; CA7 o jogo (as fases e sem apito); CA8 o gol; CA9 a TV; CA10 o save; CA11 o modo dev; CA12 o Manual.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const R=Math.random;
const nova=(ponto,dia,sv)=>{ const H=load({imprevistos:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); const {g,L}=H;
  g.save=L.normSave(Object.assign({ bank:9000, dia, maxDay:dia, v10:1, salao:{ ponto } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); return H; };
const abre=(H,dia)=>{ const {g}=H; g.startDay(dia); H.els['btn-start'].fire('click'); };
const roda=(g,s)=>{ for(let i=0;i<s/0.05;i++) g.update(0.05); };
const JUN=['pamonha','milho','canjica'];

// ---------- 1. um evento por semana (CA1) ----------
{ const L=load({imprevistos:true}).L; let bom=true, antes=false;
  for(let k=0;k<200;k++){ const sv={ salao:{ ponto:'garagem' } }; const ev=[]; for(let n=1;n<=21;n++) ev.push(L.eventoSemana(sv,n));
    if(ev.slice(0,7).some(Boolean)) antes=true;
    if(ev.slice(7,14).filter(Boolean).length!==1 || ev.slice(14,21).filter(Boolean).length!==1) bom=false; }
  ok(bom,'200 carreiras, dias 8 a 21: exatamente um evento em cada semana (8–14 e 15–21)');
  ok(!antes,'nenhum evento antes do dia 8');
  const H=load(); ok(H.L.eventoSemana({ salao:{ ponto:'garagem' } },9)==='' ,'sem MANUT.on (o harness comum desliga os imprevistos) não há evento'); }

// ---------- 2. o peso por ponto (CA2) ----------
{ const L=load({imprevistos:true}).L, frac=(ponto,ev)=>{ let c=0; for(let k=0;k<2000;k++){ const sv={ salao:{ ponto } }; for(let n=8;n<=14;n++) if(L.eventoSemana(sv,n)===ev) c++; } return c/2000; };
  const j=frac('industrial','jogo'), u=frac('garagem','junina');
  ok(j>0.60 && j<0.70,'área industrial: o jogo do Brasil sai em '+Math.round(j*1000)/10+'% das semanas (60–70%)');
  ok(u>0.55 && u<0.65,'Garagem: a festa junina sai em '+Math.round(u*1000)/10+'% das semanas (55–65%)'); }

// ---------- 3. o sorteio fica guardado e o dia do evento não tem clima (CA3) ----------
{ const H=nova('garagem',10,{ evento:{ sem:0, d:10, ev:'jogo' } }), {g}=H;
  Math.random=()=>0; g.startDay(10); const c1=g.manut.sorteio.clima, e1=g.evento; g.startDay(10); const e2=g.evento, c2=g.manut.sorteio.clima;
  g.startDay(9); const c9=g.manut.sorteio.clima; Math.random=R;
  ok(e1==='jogo' && e2==='jogo' && g.save.evento.ev==='jogo','recomeçar o dia não muda o evento (jogo no dia 10)');
  ok(c1==='' && c2==='' && c9==='chuva','no dia do evento não há clima (nem com o sorteio no zero); no dia comum (9), sim ('+c9+')'); }

// ---------- 4. a véspera (CA4) ----------
{ const H=nova('garagem',8,{ evento:{ sem:0, d:9, ev:'junina' } }), {g,els}=H;
  abre(H,8); g.schedule=[]; g.nextIdx=0; g.money=100; g.custo=0; g.finishDay();
  const tab=txt(els['end-stats']);
  ok(g.result.amanha==='junina' && /Amanhã/.test(tab) && /Festa junina/.test(tab),'o fim do dia 8 tem a linha "Amanhã: Festa junina"');
  g.startDay(9); const intro=els['intro-manut'].textContent;
  ok(/Festa junina no bairro!/.test(intro),'a introdução do dia 9 traz o aviso da festa junina');
  abre(H,9); g.schedule=[]; g.nextIdx=0; g.money=100; g.custo=0; g.finishDay();
  ok(g.result.amanha==='' && !/Amanhã/.test(txt(els['end-stats'])) && /Imprevisto/.test(txt(els['end-stats'])) && /Festa junina/.test(txt(els['end-stats'])),'o fim do dia 9: sem "Amanhã" (dia 10 comum) e o nome do evento na linha Imprevisto'); }

// ---------- 5. a festa junina: grupos e famílias (CA5) ----------
{ const H=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'junina' } }), {g}=H; g.startDay(8);
  const day=g.day; let ok1=true, fam=0, tot=0;
  for(let k=0;k<60;k++){ g.evento=''; const n0=g.buildSchedule(day).length; g.evento='junina'; const n1=g.buildSchedule(day), esp=Math.round(n0*1.3);
    if(Math.abs(n1.length-esp)>1 && !(Math.abs(n1.length-1.3*n0)<=1.3)) ok1=false; }
  for(let k=0;k<200;k++){ g.buildSchedule(day).forEach(s=>{ tot++; if(s.type==='familia') fam++; }); }
  ok(ok1,'o número de grupos do dia na Garagem é o do dia comum × 1,3 (±1)');
  ok(fam/tot>=0.30,'o sorteio dá família em '+Math.round(fam/tot*100)+'% dos grupos (≥ 30%)'); }

// ---------- 6. a barraca junina (CA6) ----------
{ const H=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'junina' } }), {g,L,els}=H;
  g.goShop(8); L.setShopTab('cardapio'); const cartao=()=>txt(els['shop-grid']);
  ok(g.barracaVisivel && /Barraca junina/.test(cartao()) && /Montar R\$ ?40/.test(cartao()),'no dia da festa a lojinha tem o cartão "Barraca junina" (Montar R$ 40)');
  const b0=g.save.bank; ok(g.buyBarraca()===true && g.save.barraca===8 && g.save.bank===b0-40,'montar custa R$ 40 e grava save.barraca = 8');
  ok(g.buyBarraca()===false && g.save.bank===b0-40,'e não se monta duas vezes');
  const conta=(g)=>{ let junino=0, n=0, contaOk=true; for(let k=0;k<300;k++){ const grp=g.spawn({ type:'familia', color:0, vip:false, av:false });
      n++; if(grp.extras.some(x=>JUN.indexOf(x)>=0)){ junino++; const esp=grp.dishes.concat(grp.extras).reduce((v,k)=>v+(k?L.precoPrato(k,g.ponto,g.cursos):0),0); if(grp.bill!==esp) contaOk=false; } grp.done=true; } g.groups=[]; g.queue=[]; return { junino, contaOk }; };
  g.startDay(8); const com=conta(g);
  ok(com.junino>0 && com.contaOk,'com a barraca, grupos pedem pamonha, milho ou canjica ('+com.junino+' de 300) e o preço entra na conta');
  g.save.barraca=0; const sem=conta(g); ok(sem.junino===0,'sem a barraca, ninguém pede junino');
  g.save.barraca=8;
  ok(L.pratosSabidos({ pastel:1, chapa:1, fritos:1, assados:1, pf:2 }).every(k=>JUN.indexOf(k)<0),'os juninos nunca são "sabidos" (não entram no cardápio comum)');
  const H2=nova('garagem',9,{ evento:{ sem:0, d:8, ev:'junina' } }); H2.g.goShop(9); H2.L.setShopTab('cardapio');
  ok(!H2.g.barracaVisivel && !/Barraca junina/.test(txt(H2.els['shop-grid'])),'no dia 9 (sem festa) o cartão não aparece');
  const H3=nova('terraco',8,{ evento:{ sem:0, d:8, ev:'junina' } }); H3.g.goShop(8); H3.L.setShopTab('cardapio');
  ok(!H3.g.barracaVisivel && !/Barraca junina/.test(txt(H3.els['shop-grid'])),'no Terraço, que só tem refeição completa, também não'); }

// ---------- 7. o jogo do Brasil: as fases e sem apito (CA7) ----------
{ const H=nova('industrial',8,{ evento:{ sem:0, d:8, ev:'jogo' } }), {g,L}=H; g.startDay(8);
  g.divF=1; const day=Object.assign({},g.day,{ groups:40 }), T=day.time*day.speed; let meio=0, tot=0, apito=0;
  for(let k=0;k<30;k++){ const sc=g.buildSchedule(day).filter(s=>s.type!=='encomenda'); tot+=sc.length; meio+=sc.filter(s=>s.t>0.35*T && s.t<0.65*T).length; apito+=sc.filter(s=>s.apito).length; if(g.apito) apito+=100; }
  ok(meio/tot<=0.10,'no jogo, só '+Math.round(meio/tot*1000)/10+'% das chegadas caem entre 35% e 65% da janela de chegadas (≤ 10%)');
  ok(apito===0,'e a fábrica não apita no dia de jogo');
  L.DEV.on=true; L.DEV.forca.apito='apita'; g.evento=''; g.buildSchedule(day); const apitaSemJogo=!!g.apito; L.DEV.on=false; L.DEV.forca={};
  ok(apitaSemJogo,'(controle) sem o jogo, o apito forçado toca'); }

// ---------- 8. o gol (CA8) ----------
{ const H=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'jogo' } }), {g,L}=H; abre(H,8); g.schedule=[]; g.nextIdx=0;
  const WJ=g.day.time*g.day.speed; ok(g.gol>=0.45*WJ-1e-6 && g.gol<=0.55*WJ+1e-6,'o gol sai entre 45% e 55% da janela de chegadas ('+Math.round(g.gol)+' s de '+Math.round(WJ)+')');
  const seat=(h)=>{ const grp=g.spawn({ type:'familia', color:0, vip:false, av:false }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantOrder'); grp.hearts=h; return grp; };
  const a=seat(3), b=seat(5), c=seat(2); c.angry=true;
  g.gol=g.elapsed+0.5; roda(g,0.4); ok(!g.golFeito,'antes do momento sorteado, nada acontece');
  const ha=a.hearts; roda(g,0.3);
  ok(g.golFeito && g.stats.gol===1 && g.golT>2.0 && g.golT<=2.5,'no momento sorteado: stats.gol = 1 e o letreiro aparece (golT '+Math.round(g.golT*100)/100+')');
  ok(a.hearts>=ha+1-1e-9 || a.hearts>=3,'quem estava sentado ganhou 1 coração ('+ha+' → '+a.hearts+')');
  roda(g,2.3); ok(g.golT>0,'2,3 s depois o letreiro ainda está lá'); roda(g,0.3); ok(g.golT===0,'e some depois de 2,5 s');
  // o efeito em si, na mão: o coração a mais, o teto de 5 e quem saiu bravo
  const x=seat(3), y=seat(5), z=seat(2); z.angry=true; g.golDoBrasil();
  ok(x.hearts===4 && y.hearts===5 && z.hearts===2,'golDoBrasil: 3 → 4, 5 fica 5 (teto) e o bravo não ganha nada'); }

// ---------- 9. a TV (CA9) ----------
{ const sem=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'jogo' } }), com=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'jogo' } });
  sem.g.startDay(8); com.g.save.equipe.tv=1; com.g.startDay(8);
  ok(sem.g.ambienteEv===0 && Math.abs(com.g.ambienteEv-0.1)<1e-9,'no dia de jogo com a TV ligada o ambiente sobe 0,1 (sem a TV: '+sem.g.ambienteEv+'; com: '+com.g.ambienteEv+')');
  const {g}=com; let bom=true; for(let k=0;k<40;k++){ g.save.equipe.tv=0; const n0=g.buildSchedule(g.day).length; g.save.equipe.tv=1; const n1=g.buildSchedule(g.day).length; if(Math.abs(n1-Math.round(n0*1.15))>1 && Math.abs(n1-1.15*n0)>1.2) bom=false; }
  ok(bom,'e os grupos do dia saem × 1,15 com a TV ligada');
  g.evento=''; ok(g.ambienteEv===0,'fora do jogo a TV não ganha o efeito extra');
  const I=nova('industrial',8,{ evento:{ sem:0, d:8, ev:'jogo' } }); I.g.startDay(8); ok(I.g.ambienteEv===0,'área industrial sem as TVs instaladas: nada'); I.g.up.tvs=true; I.g.save.equipe.tvs=1; ok(Math.abs(I.g.ambienteEv-0.1)<1e-9,'com as 3 TVs ligadas, 0,1'); }

// ---------- 10. o save (CA10) ----------
{ const L=load({imprevistos:true}).L, N=o=>L.normSave(Object.assign({ dia:12, maxDay:12 },o));
  const bad=[{ sem:-1, d:9, ev:'jogo' },{ sem:0, d:5, ev:'jogo' },{ sem:0, d:9, ev:'copa' },{ sem:'x', d:9, ev:'jogo' },{ sem:0.5, d:9, ev:'jogo' },'jogo',null];
  ok(bad.every(e=>N({ evento:e }).evento===undefined),'normSave apaga save.evento inválido (semana negativa ou quebrada, dia < 8, evento fora de junina/jogo)');
  const e=N({ evento:{ sem:1, d:10, ev:'junina' } }).evento; ok(e && e.sem===1 && e.d===10 && e.ev==='junina','e mantém o válido');
  ok([0,-3,'x',null,2.5].every(b=>b===2.5 ? N({ barraca:b }).barraca===3 : N({ barraca:b }).barraca===undefined) && N({ barraca:12 }).barraca===12,'save.barraca: inteiro ≥ 1 ou apagado');
  const v=N({}); ok(v.evento===undefined && v.barraca===undefined && v.dia===12,'o save da v10.5.3 (sem os dois) chega inteiro');
  const m=L.normManut({ sorteio:{ d:9, clima:'', ev:'jogo', quebra:[] } }); ok(m.sorteio.ev==='jogo' && L.normManut({ sorteio:{ d:9, ev:'x', quebra:[] } }).sorteio.ev===''  ,'o evento do sorteio do dia sobrevive ao normManut'); }

// ---------- 11. o modo dev (CA11) ----------
{ const H=nova('garagem',3), {g,L}=H; L.DEV.on=true;
  g.devForca('evento','jogo'); g.startDay(3); const a=g.evento, sv0=JSON.stringify(g.save.evento||null);
  g.devForca('evento','junina'); g.startDay(3); const b=g.evento, cl=g.clima;
  g.devForca('evento','nada'); g.startDay(3); const c=g.evento;
  g.devForca('evento',''); g.startDay(3); const d=g.evento;
  L.DEV.on=false; L.DEV.forca={};
  ok(a==='jogo' && b==='junina' && c==='' && d==='' && cl==='','a linha Evento força o jogo e a festa no dia 3 (antes do dia 8), "Nenhum" apaga e "Sorteio" volta ao normal');
  ok(sv0==='null' && !g.save.evento,'sem mexer no save.evento');
  const T=nova('terraco',3), tg=T.g; T.L.DEV.on=true; tg.devForca('evento','junina'); tg.startDay(3); tg.goShop(3); tg.evento; T.L.setShopTab('cardapio');
  ok(tg.evento==='junina' && tg.barracaVisivel,'no modo dev, a barraca aparece também fora da festa de verdade e no Terraço, com o evento forçado'); T.L.DEV.on=false; T.L.DEV.forca={}; }

// ---------- 12. o Manual (CA12) ----------
{ const H=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'junina' } }), {g}=H;
  ok(g.save.manual.indexOf('i-junina')<0 && g.save.manual.indexOf('i-jogo')<0 && g.save.manual.indexOf('l-barraca')<0,'antes do evento as 3 fichas estão trancadas');
  g.goShop(8); g.buyBarraca(); ok(g.save.manual.indexOf('l-barraca')>=0 && g.save.manual.indexOf('i-junina')<0,'a compra da barraca abre a ficha l-barraca');
  abre(H,8); ok(g.save.manual.indexOf('i-junina')>=0 && g.save.manual.indexOf('i-jogo')<0,'o começo do dia da festa abre a ficha i-junina');
  const J=nova('garagem',8,{ evento:{ sem:0, d:8, ev:'jogo' } }); abre(J,8); ok(J.g.save.manual.indexOf('i-jogo')>=0,'e o do jogo abre a i-jogo');
  const fichas=['i-junina','i-jogo','l-barraca'].map(id=>H.L.MANUAL.find(f=>f.id===id));
  ok(fichas.every(f=>f && f.nome && f.linha && !/\d/.test(f.linha)),'as fichas existem e não têm números no texto'); }

console.log('smoke71.js: '+total+' checagens; fails = '+fails); process.exit(fails?1:0);
