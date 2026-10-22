// v8.1.3, rejogar sem perder o dinheiro: Reiniciar ou Menu na pausa, no meio de um dia da carreira, fecham as contas da
// parte jogada (faturamento − ingredientes − contas, folha e divulgação só da parte do dia que passou); o fim do dia e o
// "Repetir dia" já guardavam o dinheiro.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els}=H;
const novo=(bank,equipe,divulga)=>{ g.save=L.normSave({maxDay:7,bank,equipe,divulga}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const abre=n=>{ g.startDay(n); g.begin(); };

// ---------- reiniciar na metade do dia ----------
novo(500,{dani:1},'boca'); abre(3);
const b0=g.save.bank, folha=g.paid, contas=g.contas, T=g.day.time;
ok(folha>0 && contas>0 && b0===500-folha,'ao abrir, a folha sai do dinheiro: '+b0);
g.clock=T/2; g.money=300; g.custo=90; g.pause();
ok(g.state==='paused' && /o que o dia já rendeu \(R\$ \d+\) vai para o dinheiro acumulado/.test(els['pause-note'].textContent),'a pausa avisa o que fica: '+els['pause-note'].textContent);
const esp=300-90-Math.round(contas/2)+(folha-Math.round(folha/2));
ok(g.parcial.ganho===esp,'parcial: faturamento − ingredientes − metade das contas + metade da folha de volta = '+esp);
const cx0=g.save.caixa.length, st0=JSON.stringify(g.save.stars), mx0=g.save.maxDay, best0=JSON.stringify(g.save.best);
els['btn-restart'].fire('click');
ok(g.state==='intro' && g.day.n===3,'reiniciar volta para a introdução do mesmo dia');
ok(g.save.bank===b0+esp,'o dinheiro da parte jogada fica: '+g.save.bank);
ok(/O dia interrompido rendeu R\$ \d+, que já foi para o dinheiro acumulado/.test(els['intro-note'].textContent),'a introdução conta: '+els['intro-note'].textContent);
const r=g.save.caixa[g.save.caixa.length-1];
ok(g.save.caixa.length===cx0+1 && r.int && r.d===3 && r.fat===300 && r.ingr===90 && !r.ok && r.saldo===g.save.bank,'o caixa ganha uma linha de dia interrompido');
ok(L.normCaixa(g.save.caixa).slice(-1)[0].int===true,'a marca de interrompido sobrevive ao save');
ok(JSON.stringify(g.save.stars)===st0 && g.save.maxDay===mx0 && JSON.stringify(g.save.best)===best0,'não conta como dia jogado (estrelas, recorde e próximo dia iguais)');
ok(/^Dia 3 \(interrompido\): fatura 300/m.test(L.caixaResumo(g.save)),'o resumo do caixa marca o dia interrompido');
// a nova abertura paga a folha de novo, inteira: é um dia novo
const b1=g.save.bank; g.begin(); ok(g.save.bank===b1-folha,'o dia reiniciado paga a folha de novo');

// ---------- reiniciar logo no começo não custa nada ----------
novo(500,{dani:1},'redes'); abre(4);
const p0=g.paid+g.paidDiv; ok(g.paidDiv>0,'com redes sociais, a divulgação também sai ao abrir');
g.pause(); ok(g.parcial.ganho===p0 && g.parcial.contas===0,'no segundo zero, a folha e a divulgação voltam inteiras');
els['btn-restart'].fire('click'); ok(g.save.bank===500,'reiniciar na hora não custa nada: '+g.save.bank);

// ---------- menu na pausa também guarda ----------
novo(500,{},'boca'); abre(2); g.clock=0; g.money=200; g.custo=60; g.pause();
const c2=g.contas; els['btn-pause-menu'].fire('click');
ok(g.state==='menu' && g.save.bank===500+200-60-c2,'sair pelo menu com o dia no fim guarda tudo, menos as contas inteiras: '+g.save.bank);
ok(!g.interrompido,'o aviso não fica para a próxima introdução');
// sair de novo (sem dia aberto) não faz nada
const b2=g.save.bank, n2=g.save.caixa.length; ok(g.interromper()===null && g.save.bank===b2 && g.save.caixa.length===n2,'sem dia aberto, nada muda');

// ---------- prejuízo: não passa do dinheiro que tem ----------
novo(0,{},'boca'); abre(3); g.clock=0; g.money=0; g.custo=50; g.pause();
ok(g.parcial.ganho===0 && /fica como está/.test(els['pause-note'].textContent),'com R$ 0, o prejuízo não deixa o dinheiro negativo');
els['btn-restart'].fire('click'); ok(g.save.bank===0,'continua em R$ 0');

// ---------- fim do dia e "Repetir dia" (já guardavam) ----------
novo(300,{},'boca'); abre(3); g.money=150; g.custo=40; const c3=g.contas; g.finishDay();
ok(!g.result.passed && g.save.bank===300+150-40-c3,'o fim do dia guarda o que rendeu, mesmo sem a meta');
ok(/mesmo repetindo o dia/.test(els['end-msg'].textContent),'o fim do dia avisa que o dinheiro fica: '+els['end-msg'].textContent);
const b3=g.save.bank; els['btn-again'].fire('click'); ok(g.state==='shop' && g.save.bank===b3,'"Repetir dia" abre a lojinha com o mesmo dinheiro');
ok(g.interromper()===null,'depois do fim do dia, não há o que interromper');

// ---------- turno sem fim: igual a antes ----------
g.startEndless(); g.begin(); g.pause(); ok(g.parcial===null && els['pause-note'].textContent==='','no turno sem fim, a pausa não fala de dinheiro');

console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
