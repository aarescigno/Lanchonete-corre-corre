// v8.3, carreira como campanha: "Continuar" abre o próximo dia (sem escolher nem repetir), a meta não batida só fica sem
// estrelas, os dias passam do 7 (perfil do dia 7 com o dia da semana), save antigo segue do maior dia, o caixa pode
// ficar negativo por 3 dias seguidos (no 4º, o banco cobre à força), empréstimo com parcelas no fim do dia, a chave da
// folha sem dinheiro, "Recomeçar do zero" com confirmação e o ranking pelo lucro acumulado.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els,store}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const novo=o=>{ g.save=L.normSave(Object.assign({treino:true},o||{})); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
// joga o dia que o "Continuar" abrir, com o lucro pedido (money - custo; contas e folha saem no fim)
const joga=(fat,custo)=>{ if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; g.finishDay(); };
const cont=()=>{ g.setState('menu'); els['btn-play'].fire('click'); };

// ---------- sequência: Continuar sempre abre o próximo dia ----------
novo({});
g.setState('menu');
ok(/Começar o dia 1/.test(els['btn-play'].textContent) && els['daychips'].style.display==='none','jogador novo: "Começar o dia 1", sem escolha de dia');
cont(); ok(g.state==='intro' && g.day.n===1,'o dia 1 vai direto à introdução');
joga(1000,0); ok(g.result.passed && g.save.dia===2 && g.save.estrelas===g.result.stars && g.save.lucroTot===g.result.money,'dia 1 com a meta: próximo é o 2, estrelas e lucro somados');
ok(!els['btn-again'],'sem "Repetir dia"');
ok(/Lojinha e dia 2/.test(els['btn-next'].textContent) && els['btn-next'].style.display!=='none','"Lojinha e dia 2"');
els['btn-next'].fire('click'); ok(g.state==='shop' && g.shopNext===2,'Próximo dia abre a lojinha do dia 2');
const est0=g.save.estrelas, lt0=g.save.lucroTot;
joga(0,0); ok(!g.result.passed && g.result.stars===0 && g.save.dia===3 && g.save.estrelas===est0,'meta não batida: sem estrelas, mas o próximo é o 3');
ok(/sem estrelas/.test(els['end-msg'].textContent) && els['btn-next'].style.display!=='none','o fim do dia diz e o "Próximo dia" continua');
ok(g.save.lucroTot===lt0+g.result.money,'o prejuízo também entra no lucro acumulado');
g.setState('menu'); ok(/Continuar: dia 3/.test(els['btn-play'].textContent) && /Carreira: dia 3/.test(els['menu-dia'].textContent),'menu: "Continuar: dia 3"');
ok(/★/.test(els['menu-info'].textContent) && /lucro acumulado/.test(els['menu-info'].textContent),'menu: caixa, estrelas e lucro acumulado');
// largar no meio não avança
cont(); els['btn-shop-go'].fire('click'); els['btn-start'].fire('click'); g.pause(); els['btn-pause-menu'].fire('click');
ok(g.state==='menu' && g.save.dia===3,'largar o dia no meio não avança a carreira');

// ---------- dias além do 7 ----------
{ const d7=L.DAYS[6], d8=L.diaOf(8), d9=L.diaOf(9), d14=L.diaOf(14), d13=L.diaOf(13);
  ok(L.diaOf(7)===d7 && d7.gripe && !d8.gripe,'o dia 7 tem a gripe do Tonhão; o 8 não');
  ok(d8.n===8 && d8.semana==='Domingo' && d9.semana==='Segunda-feira' && d13.semana==='Sexta-feira' && d14.semana==='Sábado','dia 8 é domingo, 13 sexta, 14 sábado (o 6 é sexta)');
  ok(d9.groups<d7.groups && d14.groups>d7.groups && d9.meta<d8.meta && d14.meta>d7.meta,'segunda mais fraca, sábado mais cheio (grupos e metas)');
  ok(d8.time===d7.time && d8.vip===d7.vip && d8.types.length===d7.types.length,'o resto é o perfil do dia 7');
  novo({dia:8,bank:500}); g.setState('menu'); cont(); ok(g.state==='shop' && g.shopNext===8,'Continuar no dia 8 abre a lojinha do dia 8');
  els['btn-shop-go'].fire('click'); ok(g.state==='intro' && g.day.n===8 && /Domingo/.test(els['intro-title'].textContent) && /Domingo/.test(els['intro-note'].textContent),'introdução do dia 8: domingo');
  const r=Math.random; Math.random=()=>0.01; g.resetDay(8); const sc=g.buildSchedule(g.day); Math.random=r;
  ok(sc.filter(s=>s.type==='familia').length>=sc.length-2,'domingo: mais famílias');
  g.begin(); g.schedule=[]; g.nextIdx=0; g.money=2000; g.finishDay(); ok(g.save.dia===9 && g.save.caixa.slice(-1)[0].d===8,'dia 8 vai para o caixa como dia 8; próximo é o 9');
  ok(L.normCaixa([{d:23,fat:1}])[0].d===23,'o caixa guarda dias acima de 7');
}

// ---------- save antigo: segue do maior dia alcançado ----------
{ const s=L.normSave({maxDay:5,bank:640,stars:{1:3,2:2,3:1,4:1},best:{1:900}});
  ok(s.dia===5 && s.bank===640 && s.estrelas===7 && s.lucroTot===0 && s.neg===0 && !s.emp.resto && s.corta===true,'v8.2: maxDay 5 vira o dia 5, com o dinheiro e as estrelas somadas');
  ok(s.maxDay===undefined && s.best===undefined && s.stars===undefined,'sem maxDay, best e stars no save novo');
  const s7=L.normSave({maxDay:7,bank:3000,stars:{1:1,2:1,3:1,4:1,5:1,6:1,7:2}}); ok(s7.dia===8,'quem já passou do dia 7 segue no dia 8');
  const s6=L.normSave({maxDay:7,bank:3000,stars:{1:1,2:1,3:1,4:1,5:1,6:1}}); ok(s6.dia===7,'quem parou no 7 sem passar continua no 7');
  const H2=load({store:{lcc2_save:JSON.stringify({maxDay:4,bank:350,up:{tenis:true},torneira:true})}});
  H2.g.setState('menu'); ok(H2.g.proxDia===4 && /dia 4/.test(H2.els['btn-play'].textContent),'abrindo um save da v8.2: Continuar no dia 4');
  ok(L.normSave({dia:12,bank:-80,neg:2,emp:{resto:330,n:3},corta:false}).bank===-80,'o save guarda o caixa negativo');
  const s2=L.normSave({dia:12,bank:-80,neg:9,emp:{resto:330,n:9},corta:false}); ok(s2.neg===3 && s2.emp.n===5 && s2.corta===false,'neg e parcelas limitados');
  { const e=L.normEmprestimo({resto:100,n:0}); ok(e.resto===100 && e.n===1 && e.j===0 && L.normEmprestimo(null).n===0,'saldo sem parcelas vira 1 parcela; nada vira nenhum'); } }

// ---------- caixa no negativo: 3 dias seguidos podem; no 4º, o banco cobre à força ----------
novo({dia:10,bank:20});
cont(); joga(0,0); const c10=g.contas;
ok(g.save.bank===20-c10 && g.save.neg===1,'prejuízo sem dinheiro: o caixa fica negativo ('+g.save.bank+'), 1º dia');
ok(/negativo há 1 dia/.test(els['end-msg'].textContent),'o fim do dia avisa');
els['btn-next'].fire('click'); ok(/no negativo há 1 dia/.test(els['shop-livre'].textContent) && /falta/.test(els['shop-livre'].className),'a lojinha avisa');
L.setShopTab('melhorias'); ok(els['shop-grid'].children.every(c=>{ const b=c.children[3]; return !b || b.disabled; }),'no negativo, nada se compra');
els['btn-shop-go'].fire('click'); ok(/Caixa no negativo/.test(els['intro-manut'].textContent) && /mais 3 dias/.test(els['intro-manut'].textContent),'a introdução avisa quanto falta');
joga(0,0); ok(g.save.neg===2,'2º dia no negativo');
cont(); joga(0,0); ok(g.save.neg===3 && /amanhã/.test(els['end-msg'].textContent),'3º dia: o fim do dia avisa que amanhã o banco cobre');
cont(); els['btn-shop-go'].fire('click'); ok(/se fechar hoje no negativo/.test(els['intro-manut'].textContent),'a introdução do 4º dia avisa');
const b3=g.save.bank; els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; const c4=g.contas; g.finishDay();
{ const deve=-(b3-c4), forc=Math.ceil(deve/10)*10, r=g.result, row=g.save.caixa.slice(-1)[0];
  ok(r.forcado===forc && g.save.bank===b3-c4+forc && g.save.bank>=0 && g.save.neg===0,'4º dia no negativo: o banco cobre '+forc+' e o caixa volta a '+g.save.bank);
  ok(g.save.emp.resto===forc && g.save.emp.j===L.BANCO.forcado && g.save.emp.n===5,'à força: saldo do que cobriu, juros de 6% ao dia, 5 parcelas (v8.3.2)');
  ok(row.emp===forc && row.forc===1 && row.saldo===g.save.bank,'a linha do caixa mostra o empréstimo à força');
  ok(/banco cobriu/.test(els['end-msg'].textContent) && /Banco \(à força\)/.test(txt(els['end-stats'])),'o fim do dia conta');
  // a parcela sai no fim do dia seguinte
  const p=g.parcela, b=g.save.bank, e0=g.save.emp; ok(p===Math.min(e0.resto,Math.ceil(e0.resto/5))+Math.round(e0.resto*e0.j),'parcela: amortização (1/5) e os juros do dia sobre o saldo');
  cont(); els['btn-shop-go'].fire('click'); ok(/Parcela do banco no fim do dia/.test(els['intro-manut'].textContent),'a introdução lembra a parcela');
  els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=1000; const cc=g.contas; g.finishDay();
  ok(g.result.par===p && g.save.bank===b+1000-cc-p && g.result.money===1000-cc,'a parcela sai do dinheiro, fora do lucro do dia');
  ok(g.save.emp.n===4 && g.save.caixa.slice(-1)[0].par===p,'faltam 4; o caixa mostra a parcela'); ok(/Parcela do banco/.test(txt(els['end-stats'])),'e o fim do dia');
}
// um dia no positivo zera a contagem
novo({dia:5,bank:10,neg:2}); cont(); joga(800,0); ok(g.save.bank>0 && g.save.neg===0,'fechar no positivo zera os dias no negativo');

// ---------- empréstimo na lojinha ----------
novo({dia:5,bank:100});
cont(); L.setShopTab('banco');
{ const t=txt(els['shop-grid']); ok(/Empréstimo/.test(t) && /3% ao dia sobre o saldo/.test(t) && /R\$ 90 de juros/.test(t) && /Atrasar 2 dias fecha/.test(t) && /Caixa no negativo/.test(t) && /Folha sem dinheiro/.test(t),'aba Banco: empréstimo, negativo e a folha sem dinheiro'); }
ok(!g.emprestar(1500) && !g.podeEmprestar(1001) && g.podeEmprestar(1000),'até R$ 1.000 na Garagem');
ok(g.emprestar(500) && g.save.bank===600 && g.save.emp.resto===500 && g.save.emp.amort===100 && g.save.emp.j===0.03 && g.save.emp.n===5,'pega R$ 500: saldo 500, amortização de 100, 3% ao dia, 5 parcelas');
ok(L.tabelaDe(g.save.emp).join()==='115,112,109,106,103','tabela SAC: 115, 112, 109, 106 e 103 (R$ 45 de juros)');
ok(!g.emprestar(200),'um empréstimo por vez');
ok(g.save.caixaPend.emp===500,'o empréstimo vai para a linha do dia');
L.setShopTab('banco'); { const t=txt(els['shop-grid']); ok(/Faltam R\$ 500/.test(t) && /Quitar: R\$ 500/.test(t) && /Amortizar R\$ 100/.test(t) && /R\$ 115 \(100 \+ 15 de juros\)/.test(t) && /112, 109, 106 e 103/.test(t),'a aba mostra o saldo, a próxima parcela (amortização + juros), as seguintes, amortizar e quitar'); }
ok(/parcela do banco R\$ 115/.test(els['shop-folha'].textContent),'a linha da folha lembra a parcela');
{ let pagas=0, tot=0; for(let i=0;i<5;i++){ joga(1000,0); pagas++; tot+=g.result.par; if(i<4) cont(); }
  ok(tot===545 && !g.save.emp.resto && g.save.emp.n===0,'5 parcelas pagam R$ 545 e o empréstimo acaba'); }
{ const cx=g.save.caixa.slice(-5); ok(cx[0].emp===500 && cx.map(r=>r.par).join()==='115,112,109,106,103' && cx.map(r=>r.jur).join()==='15,12,9,6,3','o caixa mostra o empréstimo, as 5 parcelas e os juros de cada uma');
  ok(L.caixaTotais(g.save.caixa).find(t=>t.id==='jur').v===45,'"para onde foi" soma os juros (o custo do banco)');
  ok(/empréstimo \+500/.test(L.caixaResumo(g.save)) && /banco −115 \(juros 15\)/.test(L.caixaResumo(g.save)),'o resumo do caixa mostra o banco');
  els['btn-next'].fire('click'); L.setShopTab('caixa'); const t=txt(els['shop-grid']); ok(/Banco/.test(t) && /-\s*R\$\s*103/.test(t.replace(/\s+/g,' ')),'aba Caixa com a coluna Banco'); }
// quitar
novo({dia:5,bank:900}); cont(); g.emprestar(200); ok(g.save.emp.resto===200,'deve 200');
ok(g.quitar() && g.save.bank===900 && !g.save.emp.resto && g.save.caixaPend.par===200,'quitar no mesmo dia: devolve só o valor, sem juros');
// amortizar (v8.3.2): abate o saldo, encurta o prazo e corta os juros
novo({dia:5,bank:600}); cont(); g.emprestar(500); g.goShop(5);
ok(g.amortizar(100) && g.save.emp.resto===400 && g.save.emp.n===4 && g.save.bank===1000 && g.parcela===112,'amortizar 100: saldo 400, 4 parcelas, a próxima de 112');
ok(L.tabelaDe(g.save.emp).join()==='112,109,106,103' && !g.amortizar(0) && !g.amortizar(-1),'a tabela encurta (juros de 30 em vez de 45)');
g.save.bank=50; ok(!g.amortizar(100),'sem dinheiro, não amortiza');
{ novo({dia:5,bank:2000}); cont(); g.emprestar(1000); const on=L.simulaEmprestimo(1000,0.03).juros; let jur=0;
  for(let i=0;i<2;i++){ els['btn-shop-go'].fire('click'); els['btn-start'].fire('click'); g.schedule=[]; g.money=500; g.finishDay(); jur+=g.save.caixa.slice(-1)[0].jur; cont(); }
  g.quitar(); ok(on===90 && jur===30+24 && !g.save.emp.resto,'quitar depois de 2 parcelas: R$ 54 de juros em vez de R$ 90'); }
ok(!g.quitar(),'sem empréstimo, nada a quitar');
// o empréstimo custa mais do que esperar
{ const v=1000, total=v*(1+L.BANCO.juros); ok(total>v && L.BANCO.forcado>L.BANCO.juros,'juros sobre o valor; à força, mais caro'); }

// ---------- folha sem dinheiro: a chave ----------
novo({dia:4,bank:30,equipe:{dani:1,tv:true}});
cont(); ok(g.save.corta===true && g.cortesSe(0).length>0 && /abre sem/.test(els['shop-livre'].textContent),'chave ligada (padrão): a folha que não cabe fica de fora');
els['btn-shop-go'].fire('click'); els['btn-start'].fire('click'); ok(g.unpaid.length>0,'e fica, ao abrir');
novo({dia:4,bank:30,equipe:{dani:1,tv:true}}); g.setCorta(false);
cont(); ok(!g.cortesSe(0).length && /caixa pode fechar no negativo/.test(els['shop-livre'].textContent),'chave desligada: nada sai, o aviso é o negativo');
L.setShopTab('banco'); ok(/Desligado: cortar a folha/.test(txt(els['shop-grid'])),'a aba Banco mostra a chave desligada');
els['btn-shop-go'].fire('click'); els['btn-start'].fire('click'); const fp=g.paid; ok(!g.unpaid.length && g.save.equipe.dani===1 && g.save.equipe.tv && fp===L.payroll(g.save.equipe),'paga tudo');
g.schedule=[]; g.nextIdx=0; g.finishDay(); ok(g.save.bank===30-g.contas-fp-g.paidDiv && g.save.bank<0,'e o caixa fecha no negativo');
ok(JSON.parse(store[L.LS.save]).corta===false,'a chave fica gravada');

// ---------- Turno sem fim não mexe no negativo ----------
novo({dia:4,bank:-50}); g.startEndless(); g.begin(); g.money=0; g.custo=0; g.finishEndless(); ok(g.save.bank===-50,'turno sem fim com prejuízo: o caixa não desce além de onde estava');
novo({dia:4,bank:-50}); g.startEndless(); g.begin(); g.money=500; g.custo=0; g.finishEndless(); ok(g.save.bank===-50+500-g.contas,'e o que ganha entra');

// ---------- Missão zero no meio da campanha ----------
novo({dia:6,bank:300}); g.startTreino(); g.acabouTreino(); ok(/Continuar: dia 6/.test(els['btn-treino-dia1'].textContent),'fim da Missão zero no dia 6: "Continuar: dia 6"');
els['btn-treino-dia1'].fire('click'); ok(g.state==='shop' && g.shopNext===6 && g.save.bank===300,'e abre a lojinha do dia 6');

// ---------- Recomeçar do zero, com confirmação ----------
novo({dia:9,bank:1234,lucroTot:5000,estrelas:12,up:{tenis:true}}); g.setState('menu');
els['btn-reset'].fire('click'); ok(g.save.dia===9 && /Confirmar/.test(els['btn-reset'].textContent),'1º toque: só pede confirmação');
g.setState('menu'); ok(/Recomeçar do zero/.test(els['btn-reset'].textContent),'voltar ao menu desfaz o pedido');
els['btn-reset'].fire('click'); els['btn-reset'].fire('click');
ok(g.save.dia===1 && g.save.bank===0 && g.save.lucroTot===0 && g.save.estrelas===0 && !g.up.tenis && g.save.treino===true,'2º toque: carreira do zero (a Missão zero continua feita)');
ok(JSON.parse(store[L.LS.save]).dia===1,'gravado');

// ---------- ranking: o lucro acumulado e o dia ----------
(async()=>{
  novo({dia:6,bank:400,lucroTot:2345}); g.startDay(5); g.begin(); g.schedule=[]; g.money=0; g.finishDay();
  const form=els['end-save'].children[0], inp=form.children[1];
  inp.value='Teste'; form.fire('submit',{preventDefault(){}}); await new Promise(r=>setTimeout(r,30));
  const rows=L.Rank.localRows('carreira'); ok(rows.length===1 && rows[0].pontos===g.save.lucroTot && rows[0].dia===5,'ranking: lucro acumulado ('+g.save.lucroTot+') e o último dia jogado (5)');
  const o=JSON.parse(store['lcc2_ranking']); ok(Array.isArray(o.campanha) && !o.carreira,'lista nova no aparelho');
  // ranking antigo no aparelho: fica guardado, mas não aparece
  const H3=load({store:{lcc2_ranking:JSON.stringify({carreira:[{key:'velho',nome:'Velho',pontos:9000,dia:7}],semfim:[]})}});
  ok(H3.L.Rank.localRows('carreira').length===0,'o ranking antigo (faturamento) não se mistura');
  await H3.L.Rank.saveScore('carreira','Nova',100,{dia:3}); const o3=JSON.parse(H3.store['lcc2_ranking']); ok(o3.carreira.length===1 && o3.campanha.length===1,'e continua guardado');
  // prejuízo acumulado não entra
  novo({dia:3,bank:0,lucroTot:-200}); g.startDay(3); g.begin(); g.schedule=[]; g.finishDay();
  const f2=els['end-save'].children[0], m2=els['end-save'].children[1]; f2.children[1].value='Neg'; f2.fire('submit',{preventDefault(){}}); await new Promise(r=>setTimeout(r,30));
  ok(/acima de zero/.test(m2.textContent),'lucro acumulado negativo: não entra no ranking');
  console.log('total = '+total+'  fails = '+fails);
  process.exit(fails?1:0);
})();
