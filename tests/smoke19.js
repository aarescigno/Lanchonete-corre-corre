// v8.2.2, só o dia completo rende: a folha e a divulgação ficam reservadas ao abrir e são pagas no fim do dia, junto com
// as contas e os ingredientes. Reiniciar ou Menu na pausa, no meio do dia, não pagam nem ganham nada (o conserto na hora
// já pago fica pago, e o equipamento consertado). Terminar o dia e "Repetir dia" guardam o que o dia rendeu.
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
const cx0=g.save.caixa.length, st0=JSON.stringify(g.save.stars), mx0=g.save.maxDay, best0=JSON.stringify(g.save.best);
els['btn-restart'].fire('click');
ok(g.state==='intro' && g.day.n===4,'reiniciar volta para a introdução do mesmo dia');
ok(g.save.bank===500,'o dinheiro fica como estava (nem folha, nem o que o dia rendeu): '+g.save.bank);
ok(g.save.caixa.length===cx0 && JSON.stringify(g.save.stars)===st0 && g.save.maxDay===mx0 && JSON.stringify(g.save.best)===best0,'nada no caixa, nas estrelas, no recorde ou no próximo dia');
ok(!/interrompido/.test(els['intro-note'].textContent),'a introdução não fala de dia interrompido');

// ---------- menu na pausa: igual ----------
g.begin(); g.clock=0; g.money=900; g.custo=200; g.pause(); els['btn-pause-menu'].fire('click');
ok(g.state==='menu' && g.save.bank===500 && g.save.caixa.length===cx0,'sair pelo menu, mesmo com o relógio no fim, não conta');

// ---------- conserto na hora: pago fica pago ----------
{ const H2=load({imprevistos:true}), g2=H2.g, L2=H2.L;
  g2.save=L2.normSave({maxDay:7,bank:400,equipe:{dani:1}}); g2.up=g2.save.up; g2.buildTables(); g2.startDay(4); g2.begin();
  const eq=L2.MANUT.equip[0]; g2.quebras=[{id:eq.id,t:0,on:true,fixed:false}];
  ok(g2.consertar(eq.id) && g2.save.bank===400-eq.emerg,'o conserto sai na hora');
  g2.pause(); H2.els['btn-restart'].fire('click');
  ok(g2.save.bank===400-eq.emerg && g2.manut[eq.id]===1,'reiniciar não devolve o conserto, e o equipamento continua novo'); }

// ---------- dia completo: paga tudo no fim e guarda o resto ----------
novo(300,{dani:1},'boca'); abre(3); g.money=500; g.custo=120; const c3=g.contas, f3=g.paid; g.finishDay();
ok(g.save.bank===300+500-120-c3-f3 && g.result.income===500-120-c3-f3,'no fim do dia sai a folha, junto com contas e ingredientes: '+g.save.bank);
ok(g.result.money===g.result.income,'o que entra no dinheiro é o lucro do dia (sem conserto)');
const r=g.save.caixa[g.save.caixa.length-1]; ok(r.folha===f3 && r.saldo===g.save.bank,'a linha do caixa tem a folha e o saldo');
ok(!g.result.passed && /mesmo repetindo o dia/.test(els['end-msg'].textContent),'sem a meta, o fim do dia lembra que o dinheiro fica');
const b3=g.save.bank; els['btn-again'].fire('click'); ok(g.state==='shop' && g.save.bank===b3,'"Repetir dia" abre a lojinha com o mesmo dinheiro');

// ---------- prejuízo no dia completo: o dinheiro não fica negativo ----------
novo(60,{dani:1},'boca'); abre(3); g.money=0; g.custo=0; g.finishDay(); ok(g.save.bank===0,'prejuízo maior que o dinheiro: fica em R$ 0');

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
