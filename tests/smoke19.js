// v8.2.2 e v8.2.3, só o dia completo rende: a folha e a divulgação ficam reservadas ao abrir e são pagas no fim do dia, junto com
// as contas e os ingredientes. Reiniciar ou Menu na pausa, no meio do dia, não pagam nem ganham nada (o conserto na hora
// já pago fica pago, e o equipamento consertado). Terminar o dia e "Repetir dia" guardam o que o dia rendeu. v8.2.3: quem
// está na espera ou nas mesas ao largar o dia vai embora bravo, e cada grupo paga a multa (L.MULTA, mais VIP.angry se VIP).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els}=H;
const novo=(bank,equipe,divulga)=>{ g.save=L.normSave({maxDay:7,bank,equipe,divulga}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const abre=n=>{ g.startDay(n); g.begin(); };

// ---------- ao abrir, nada sai do dinheiro ----------
novo(500,{dani:1},'redes'); abre(4);
ok(g.paid>0 && g.paidDiv>0 && g.save.bank===500,'folha ('+g.paid+') e divulgação ('+g.paidDiv+') ficam reservadas, sem sair do dinheiro');
ok(g.lucro===-(g.contas+g.paid+g.paidDiv),'o lucro do dia começa no vermelho, como antes');

// ---------- reiniciar no meio: não paga nem ganha ----------
g.clock=g.day.time/2; g.money=300; g.custo=90; g.pause();
ok(g.state==='paused' && /o dia não conta: só dias completos rendem/.test(els['pause-note'].textContent),'a pausa avisa: '+els['pause-note'].textContent);
const cx0=g.save.caixa.length, st0=g.save.estrelas, mx0=g.save.dia, lt0=g.save.lucroTot;
els['btn-restart'].fire('click');
ok(g.state==='intro' && g.day.n===4,'reiniciar volta para a introdução do mesmo dia');
ok(g.save.bank===500,'o dinheiro fica como estava (nem folha, nem o que o dia rendeu): '+g.save.bank);
ok(g.save.caixa.length===cx0 && g.save.estrelas===st0 && g.save.dia===mx0 && g.save.lucroTot===lt0,'nada no caixa, nas estrelas, no lucro acumulado ou no próximo dia');
ok(!/interrompido/.test(els['intro-note'].textContent),'a introdução não fala de dia interrompido');

// ---------- menu na pausa: igual ----------
g.begin(); g.clock=0; g.money=900; g.custo=200; g.pause(); els['btn-pause-menu'].fire('click');
ok(g.state==='menu' && g.save.bank===500 && g.save.caixa.length===cx0,'sair pelo menu, mesmo com o relógio no fim, não conta');

// ---------- v8.2.3: largar o dia com gente na espera ou nas mesas ----------
novo(500,{},'boca'); abre(5);
{ const a=g.spawn({type:'estudante',color:0}), b=g.spawn({type:'vovos',color:1,vip:true}), c=g.spawn({type:'estudante',color:2});
  const t=g.tables.find(x=>x.free&&x.seats>=a.size); g.seatGroup(a,t);
  ok(a.state!=='queue' && b.vip,'um grupo sentado ('+a.state+') e um VIP na espera');
  c.setState('leaving'); const M=L.MULTA, V=L.VIP.angry, MT=2*M+V, SD=500-MT;
  ok(M===10 && g.multa(a)===M && g.multa(b)===M+V,'multa de quem sai bravo: R$ '+M+' (VIP: +'+V+')');
  ok(g.bravosSeSair.length===2 && g.multaSeSair===2*M+V,'conta quem está na espera e na mesa, não quem já está indo embora');
  g.pause(); ok(new RegExp('E os 2 grupos na espera e nas mesas vão embora bravos: multa de R\\$ '+MT+'\\.').test(els['pause-note'].textContent),'a pausa avisa a multa: '+els['pause-note'].textContent);
  const n0=g.save.caixa.length; els['btn-restart'].fire('click');
  ok(g.save.bank===SD,'reiniciar desconta a multa do dinheiro acumulado: '+g.save.bank);
  const r=g.save.caixa[g.save.caixa.length-1];
  ok(g.save.caixa.length===n0+1 && r.int===2 && r.mul===MT && r.d===5 && r.saldo===SD && !r.fat,'o caixa ganha a linha do dia largado');
  ok(L.normCaixa(g.save.caixa).slice(-1)[0].mul===MT,'a linha sobrevive ao save');
  ok(new RegExp('Você largou o dia no meio: 2 grupos foram embora bravos \\(multa de R\\$ '+MT+'; agora você tem R\\$ '+SD+'\\)').test(els['intro-note'].textContent),'a introdução conta: '+els['intro-note'].textContent);
  ok(new RegExp('Dia 5 largado no meio: 2 grupos foram embora bravos: −'+MT+' · saldo '+SD).test(L.caixaResumo(g.save)),'o resumo do caixa mostra a linha');
  ok(L.caixaTotais(g.save.caixa).find(t=>t.id==='mul').v===MT,'"para onde foi" soma a multa');
 }
// sem ninguém: sem multa nem linha
novo(500,{},'boca'); abre(5); g.pause(); ok(!/multa/.test(els['pause-note'].textContent),'sem ninguém no salão, sem multa no aviso');
{ const n0=g.save.caixa.length; els['btn-restart'].fire('click'); ok(g.save.bank===500 && g.save.caixa.length===n0 && !/largou/.test(els['intro-note'].textContent),'sem ninguém, reiniciar não custa nada'); }
// menu na pausa também cobra; desde a v8.3, a multa pode deixar o caixa negativo
novo(L.MULTA,{},'boca'); abre(5); g.spawn({type:'estudante',color:0}); g.spawn({type:'estudante',color:1}); g.pause(); els['btn-pause-menu'].fire('click');
ok(g.state==='menu' && g.save.bank===-L.MULTA && g.save.caixa.slice(-1)[0].mul===2*L.MULTA,'Menu na pausa cobra também, e o caixa fica negativo (R$ '+2*L.MULTA+' com R$ '+L.MULTA+')');
ok(!g.encerrado,'o aviso não fica para depois');
// fim do dia com gente ainda lá: como antes (o tempo acabou, sem multa extra)
novo(500,{},'boca'); abre(5); g.spawn({type:'estudante',color:0}); g.clock=0.01; g.update(0.05); ok(g.ending && g.groups.every(x=>x.state==='leaving'),'tempo esgotado: quem está lá vai embora sem multa, como antes');
// Missão zero e turno sem fim: sem multa
novo(500,{},'boca'); g.startEndless(); g.begin(); g.spawn({type:'estudante',color:0}); ok(g.bravosSeSair.length===0,'turno sem fim: sem multa ao sair');

// ---------- conserto na hora: pago fica pago ----------
{ const H2=load({imprevistos:true}), g2=H2.g, L2=H2.L;
  g2.save=L2.normSave({maxDay:7,bank:400,equipe:{dani:1}}); g2.up=g2.save.up; g2.buildTables(); g2.startDay(4); g2.begin();
  const eq=L2.MANUT.equip[0]; g2.quebras=[{id:eq.id,t:0,on:true,fixed:false}];
  ok(g2.consertar(eq.id) && g2.save.bank===400-eq.emerg,'o conserto sai na hora');
  g2.pause(); H2.els['btn-restart'].fire('click');
  ok(g2.save.bank===400-eq.emerg && g2.manut[eq.id]===1,'reiniciar não devolve o conserto, e o equipamento continua novo'); }

// ---------- dia completo: paga tudo no fim e guarda o resto ----------
novo(300,{dani:1},'boca'); abre(3); g.money=250; g.custo=120; const c3=g.contas, f3=g.paid; g.finishDay();
ok(g.save.bank===300+250-120-c3-f3 && g.result.income===250-120-c3-f3,'no fim do dia sai a folha, junto com contas e ingredientes: '+g.save.bank);
ok(g.result.money===g.result.income,'o que entra no dinheiro é o lucro do dia (sem conserto)');
const r=g.save.caixa[g.save.caixa.length-1]; ok(r.folha===f3 && r.saldo===g.save.bank,'a linha do caixa tem a folha e o saldo');
ok(!g.result.passed && /sem estrelas/.test(els['end-msg'].textContent),'sem a meta, o fim do dia diz que o dia fica sem estrelas (v8.3)');
const b3=g.save.bank; els['btn-next'].fire('click'); ok(g.state==='shop' && g.shopNext===4 && g.save.bank===b3,'"Próximo dia" abre a lojinha do dia 4 com o mesmo dinheiro, mesmo sem a meta');

// ---------- prejuízo no dia completo: desde a v8.3, o caixa fica negativo ----------
novo(60,{dani:1},'boca'); abre(3); g.money=0; g.custo=0; const f4=g.paid; g.finishDay(); ok(g.save.bank===60-g.contas-f4 && g.save.bank<0,'prejuízo maior que o dinheiro: o caixa fica negativo ('+g.save.bank+')');

// ---------- turno sem fim: a folha também sai no fim ----------
novo(500,{dani:1},'boca'); g.startEndless(); g.begin(); const fe=g.paid;
ok(g.save.bank===500,'turno sem fim: nada sai ao abrir'); g.pause(); ok(els['pause-note'].textContent==='','e a pausa não fala de dia');
g.money=400; g.custo=100; g.finishEndless(); ok(g.save.bank===500+400-100-g.contas-fe,'no fim do turno, sai a folha junto: '+g.save.bank);

// ---------- Missão zero (v8.2): igual a antes ----------
novo(321,{},'boca'); g.startTreino(); if (g.state==='intro') g.begin(); g.pause();
ok(els['pause-note'].textContent==='','na Missão zero, a pausa não fala de dinheiro');
els['btn-restart'].fire('click'); ok(g.mode==='treino','reiniciar a Missão zero continua no treino');
g.setState('menu'); ok(g.save.bank===321,'o dinheiro de verdade não muda com o treino: '+g.save.bank);

console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
