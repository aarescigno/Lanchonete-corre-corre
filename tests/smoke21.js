// v8.3.1, atrasar o banco: a parcela que não cabe no dinheiro do fim do dia fica atrasada (nada sai, com aviso); se no fim
// do dia seguinte o caixa não tiver a atrasada e a do dia, o banco toma a lanchonete e a carreira acaba (só resta
// recomeçar do zero).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els,store}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const novo=o=>{ g.save=L.normSave(Object.assign({treino:true,divulga:'boca'},o||{})); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const cont=()=>{ g.setState('menu'); els['btn-play'].fire('click'); if(g.state==='shop') els['btn-shop-go'].fire('click'); };
// joga o dia aberto com o faturamento pedido; bankFim: o dinheiro forçado antes do fim (sem contar o dia)
const fecha=(fat,bankAntes)=>{ els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; if(bankAntes!=null) g.save.bank=bankAntes; g.finishDay(); };

// ---------- devidoDe ----------
ok(L.devidoDe({resto:550,n:5})===110 && L.devidoDe({resto:550,n:5,atr:true})===220,'devido: a parcela do dia, ou a atrasada e a do dia');
ok(L.devidoDe({resto:110,n:1,atr:true})===110,'a última atrasada: só ela');
ok(L.normEmprestimo({resto:550,n:5,atr:true}).atr===true && L.normEmprestimo({resto:0,n:0,atr:true}).atr===undefined,'o save guarda o atraso (só com dívida)');

// ---------- não coube: fica atrasada ----------
novo({dia:5,bank:600}); g.emprestar(500);   // deve 550: 5 × 110
cont(); fecha(0,50); const c5=g.contas;
ok(g.result.atrasou && !g.result.tomou && g.save.emp.atr && g.save.emp.resto===550 && g.save.emp.n===5,'caixa sem a parcela: ficou atrasada e nada saiu');
ok(g.save.bank===50-c5 && !g.result.par,'o dinheiro não pagou parcela');
ok(g.state==='dayend' && /ficou atrasada/.test(els['end-msg'].textContent) && /R\$ 220/.test(els['end-msg'].textContent),'o fim do dia avisa: amanhã R$ 220');
ok(g.save.caixa.slice(-1)[0].atr===1 && /parcela atrasada/.test(L.caixaResumo(g.save)),'o caixa marca o atraso');
ok(g.devido===220,'devido amanhã: 220');
els['btn-next'].fire('click');
ok(/parcela do banco atrasada/.test(els['shop-livre'].textContent) && /falta/.test(els['shop-livre'].className),'a lojinha avisa no alto');
L.setShopTab('banco'); ok(/Parcela atrasada/.test(txt(els['shop-grid'])),'e na aba Banco');
ok(/parcela do banco R\$ 220 \(com a atrasada\)/.test(els['shop-folha'].textContent),'a linha da folha mostra o devido');
els['btn-shop-go'].fire('click'); ok(/Parcela do banco atrasada/.test(els['intro-manut'].textContent) && /R\$ 220/.test(els['intro-manut'].textContent),'a introdução avisa');
// ---------- no dia seguinte, pagou: volta ao normal ----------
const b6=g.save.bank; els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=1000; g.custo=0; const c6=g.contas; g.finishDay();
ok(g.result.par===220 && !g.save.emp.atr && g.save.emp.n===3 && g.save.emp.resto===330 && g.save.bank===b6+1000-c6-220,'pagou a atrasada e a do dia: faltam 3, sem atraso');
ok(g.state==='dayend' && !g.save.fechou,'a carreira segue');

// ---------- atrasou de novo: o banco toma a lanchonete ----------
novo({dia:5,bank:600}); g.emprestar(500);
cont(); fecha(0,50); ok(g.save.emp.atr,'atrasou no dia 5');
cont(); fecha(0,100);
ok(g.result.tomou && g.save.fechou===6 && g.state==='falencia' && els['ov-falencia'].classList.contains('show'),'no dia 6 sem os R$ 220: o banco toma a lanchonete');
ok(/O banco tomou|não tinha os R\$ 220/.test(els['falencia-msg'].textContent),'a tela conta o porquê');
ok(/Dias jogados/.test(txt(els['falencia-stats'])) && /Lucro acumulado/.test(txt(els['falencia-stats'])),'resumo da carreira');
ok(/Salvar no ranking/.test(txt(els['falencia-save'])) || /ranking/.test(txt(els['falencia-save'])),'formulário do ranking');
ok(g.save.caixa.slice(-1)[0].tom===1 && /o banco tomou a lanchonete/.test(L.caixaResumo(g.save)),'o caixa marca o dia');
ok(JSON.parse(store[L.LS.save]).fechou===6,'gravado no save');
// menu depois do fim
els['btn-falencia-menu'].fire('click');
ok(g.state==='menu' && /fechou no dia 6/.test(els['menu-dia'].textContent) && /Recomeçar do zero/.test(els['btn-play'].textContent) && els['btn-reset'].style.display==='none','menu: "fechou no dia 6" e só "Recomeçar do zero"');
// abrir de novo continua fechado
{ const H2=load({store:{lcc2_save:store[L.LS.save]}}); H2.g.setState('menu'); ok(H2.g.save.fechou===6 && /Recomeçar do zero/.test(H2.els['btn-play'].textContent),'reabrindo, continua fechada'); }
els['btn-play'].fire('click');
ok(!g.save.fechou && g.save.dia===1 && g.save.bank===0 && !g.save.emp.resto && g.state==='intro' && g.day.n===1,'Recomeçar do zero: carreira nova, dia 1');
// o botão da tela de fim também recomeça
novo({dia:8,bank:300,fechou:7}); g.setState('falencia'); els['btn-falencia-zero'].fire('click'); ok(!g.save.fechou && g.save.dia===1 && g.state==='intro','"Recomeçar do zero" na tela do fim');
novo({dia:8,bank:300,fechou:7}); els['btn-falencia-rank'].fire('click'); ok(els['ov-rank'].classList.contains('show'),'Ranking na tela do fim');

// ---------- quitar tira o atraso ----------
novo({dia:5,bank:600}); g.emprestar(500); cont(); fecha(0,50);
g.goShop(6); g.save.bank=800; ok(g.quitar() && !g.save.emp.resto && !g.save.emp.atr && g.save.bank===250,'quitar paga tudo e tira o atraso');

// ---------- a última parcela atrasada ----------
novo({dia:5,bank:500,emp:{resto:110,n:1}}); cont(); fecha(0,20); ok(g.save.emp.atr && g.devido===110,'a última atrasou: devido continua 110');
cont(); fecha(1000); ok(!g.save.emp.resto && g.result.par===110 && !g.save.fechou,'paga e acaba o empréstimo');

// ---------- empréstimo à força mantém o atraso ----------
novo({dia:5,bank:-100,neg:3,emp:{resto:330,n:3}}); cont(); fecha(0);
ok(g.result.forcado>0 && g.save.emp.atr && g.save.emp.n===5 && !g.save.fechou,'4º dia negativo com a parcela atrasando: o banco cobre à força e o atraso continua');
cont(); const dv=g.devido; fecha(0,dv-1); ok(g.save.fechou && g.state==='falencia','e sem pagar no dia seguinte, toma a lanchonete');

// ---------- sem empréstimo, nada muda ----------
novo({dia:5,bank:-50}); cont(); fecha(0); ok(!g.result.atrasou && !g.result.tomou && g.save.neg===1,'sem empréstimo: só o negativo, como na v8.3');

// ---------- turno sem fim e Missão zero não cobram parcela ----------
novo({dia:5,bank:20,emp:{resto:550,n:5,atr:true}}); g.startEndless(); g.begin(); g.money=0; g.finishEndless(); ok(g.save.emp.atr && !g.save.fechou && g.state==='endlessend','turno sem fim não cobra o banco');

console.log('total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
