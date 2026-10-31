// v7, Contas: a meta é o lucro; ingredientes por prato e suco, contas do dia pelo salão aberto, divulgação do dia 4 em diante (v9.0.2; antes, do dia 3).
const H=require('./harness.js')(); const {g,L,ctx,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const C=L.CONTAS, I=L.INGRED, PAN=L.divulgaOf('panfleto').cost, RED=L.divulgaOf('redes').cost, TP=n=>L.STAFF.tonhao.levels[n].pay;
const reset=(e,bank,div)=>{ g.save.equipe=L.normSave({equipe:e||{}}).equipe; g.save.bank=bank==null?5000:bank; g.save.divulga=div||'panfleto'; g.up={}; g.save.up=g.up; };

// save
ok(L.normSave({}).divulga==='boca' && L.normSave({dia:5,divulga:'xyz'}).divulga==='boca' && L.normSave({dia:5,divulga:'redes'}).divulga==='redes','save: divulgação padrão boca a boca, inválida vira boca a boca (v9.0.2)');
ok(L.normSave({dia:3,divulga:'redes'}).divulga==='boca','antes do dia 4, o save fica no boca a boca');
ok(L.DIVULGA.map(d=>d.id).join()==='boca,panfleto,redes' && L.DIVULGA_DIA===4,'3 opções de divulgação, a partir do dia 4');

// contas do dia: aluguel + base (gás e geladeira, v8.3.8) + mesas abertas + lugares
reset(); g.resetDay(1);
ok(L.contasDia(g.tables,g.ponto)===C.base+4*C.mesa+10*C.lugar && g.ponto.aluguel===0,'dia 1: Garagem sem aluguel, 4 mesas e 10 lugares do kit ('+L.contasDia(g.tables,g.ponto)+')');
g.resetDay(5);
ok(L.contasDia(g.tables,g.ponto)===C.base+4*C.mesa+10*C.lugar,'dia 5: as mesmas 4 mesas abertas ('+L.contasDia(g.tables,g.ponto)+')');
ok(L.contasDia(g.tables,{aluguel:120})===120+C.base+4*C.mesa+10*C.lugar,'aluguel do ponto entra nas contas');
{ g.goShop(5); g.save.bank=1000; const before=L.contasDia(g.tables,g.ponto); g.buyMesa(2); ok(L.contasDia(g.tables,g.ponto)===before+C.mesa+2*C.lugar,'mesa nova soma 1 mesa e 2 lugares às contas'); g.save.salao=L.normSalao({}); g.buildTables(); }

// divulgação e grupos do dia
{ reset(); g.resetDay(3); ok(!g.div && g.schedule.length===L.DAYS[2].groups,'dia 3: sem divulgação, grupos de sempre');
  const n=L.DAYS[4].groups;
  reset({},5000,'panfleto'); g.resetDay(5); ok(g.div.id==='panfleto' && g.schedule.length===n,'panfletos: os '+n+' grupos do dia');
  reset({},5000,'redes'); g.resetDay(5); ok(g.schedule.length===Math.round(n*1.2),'redes sociais: +20% de grupos');
  let lo=1e9, hi=0; for(let k=0;k<200;k++){ reset({},5000,'boca'); g.resetDay(5); lo=Math.min(lo,g.schedule.length); hi=Math.max(hi,g.schedule.length); }
  ok(lo>=Math.round(n*0.6) && hi<=Math.round(n*0.9) && hi>lo,'boca a boca: de 60% a 90% dos grupos, varia ('+lo+' a '+hi+')');
  let vr=0, vp=0; for(let k=0;k<300;k++){ reset({},5000,'redes'); g.resetDay(5); vr+=g.schedule.filter(s=>s.vip).length/g.schedule.length; reset({},5000,'panfleto'); g.resetDay(5); vp+=g.schedule.filter(s=>s.vip).length/g.schedule.length; }
  ok(vr>vp*1.15,'redes sociais: mais VIPs ('+(vr/3).toFixed(1)+'% contra '+(vp/3).toFixed(1)+'%)'); }

// pagamento ao abrir: folha + divulgação; sem dinheiro, a divulgação vira boca a boca antes de dispensar alguém
{ reset({},1000,'panfleto'); g.startDay(4); g.begin(); ok(g.save.bank===1000 && g.paidDiv===PAN && g.paid===0,'panfletos: R$ '+PAN+' reservados ao abrir (pagos no fim do dia)');
  ok(g.contas===L.contasDia(g.tables) && Math.round(g.lucro)===-(g.contas+PAN),'o dia começa no vermelho: −(contas + divulgação)');
  reset({tonhao:2},TP(2)+RED-1,'redes'); g.startDay(4); g.begin();
  ok(g.save.divulga==='boca' && g.paidDiv===0 && g.paid===TP(2) && g.save.bank===TP(2)+RED-1 && g.unpaid[0]==='Redes sociais' && g.save.equipe.tonhao===2,'sem dinheiro: redes viram boca a boca e o Tonhão fica');
  ok(g.schedule.length<=Math.round(L.DAYS[3].groups*0.9),'boca a boca: agenda refeita com menos grupos'); }

// lojinha: escolher a divulgação
{ reset({},0,'panfleto'); g.goShop(3); ok(!g.setDivulga('boca'),'antes do dia 4 não há divulgação');
  g.goShop(4); ok(!g.setDivulga('redes') && g.save.divulga==='panfleto','sem dinheiro, não escolhe redes');
  ok(g.setDivulga('boca') && g.save.divulga==='boca','boca a boca é sempre possível');
  g.save.bank=500; ok(g.setDivulga('redes') && g.save.divulga==='redes' && g.div.id==='redes','com dinheiro, escolhe redes (e o dia ao fundo já usa)');
  { const f=L.payroll({tonhao:2,dani:3}); reset({tonhao:2,dani:3},f+RED-1,'panfleto'); g.goShop(4); ok(!g.setDivulga('redes'),'a folha conta: R$ '+f+' + R$ '+RED+' não cabem em R$ '+(f+RED-1)); }
  let err=null; try{ L.setShopTab('divulga'); }catch(e){ err=e; } const grid=els['shop-grid'];
  ok(!err && grid.children.length===4 && /Contas do dia 4/.test(JSON.stringify(grid.children[3].children.map(c=>c.textContent))),'aba Divulgação: 3 opções, as contas do dia (a TV e som foi para Melhorias, v8.9.1)'+(err?': '+err:''));
  L.setShopTab('melhorias'); }

// ingredientes: o prato pronto custa, mesmo que o grupo vá embora; o suco entregue também
{ reset(); g.startDay(3); g.begin(); g.kitchen.clean=Infinity;
  const grp=g.spawn({type:'familia',color:0}); const c0=g.custo;
  g.kitchen.submit({group:grp,table:1}); for(let i=0;i<300 && !g.kitchen.plates.some(p=>p);i++) g.kitchen.update(0.05);
  ok(g.kitchen.plates.some(p=>p) && g.custo-c0===Math.round(grp.bill*I.prato),'prato pronto: '+Math.round(I.prato*100)+'% da conta em ingredientes');
  const c1=g.custo; g.angryLeave(grp); ok(g.custo===c1,'grupo que vai embora não devolve os ingredientes');
  const t=g.tables[0], j=g.spawn({type:'estudante',color:0}); g.seatGroup(j,t); j.state='ordered'; j.juiceWant=2; j.juiceGot=0;
  g.bia.hands=[{kind:'juice'},{kind:'juice'}]; const c2=g.custo, m2=g.money; g.bia.doTable(t);
  ok(g.money===m2 && j.bebConta===2*L.JUICE.price && g.custo-c2===2*I.suco,'suco entregue: '+I.suco+' de ingredientes por copo'); }

// fim do dia: meta pelo lucro; dinheiro acumulado recebe faturamento − ingredientes − contas − folha − divulgação (v8.2.2); o lucro soma no acumulado da campanha (v8.3, o ranking)
{ reset({tonhao:1},1000,'panfleto'); g.startDay(5); g.begin(); const bank0=g.save.bank;
  g.money=2000; g.custo=300; g.finishDay(); const r=g.result;
  ok(r.money===2000-300-g.contas-PAN-TP(1) && r.fat===2000 && r.custo===300 && r.div===PAN && r.paid===TP(1),'resultado: lucro = faturamento − ingredientes − contas − folha − divulgação ('+r.money+')');
  ok(g.save.bank===bank0+2000-300-g.contas-PAN-TP(1) && g.save.lucroTot===g.result.money,'dinheiro acumulado e lucro acumulado da campanha');
  ok(r.passed===(r.money>=L.DAYS[4].meta),'meta comparada com o lucro');
  let err=null; try{ g.hooks.state('dayend'); }catch(e){ err=e; } ok(!err && /^Lucro de R\$ /.test(els['end-money'].textContent),'fim do dia: "Lucro de R$ ..."'+(err?': '+err:''));
  reset({},0,'boca'); g.startDay(5); g.begin(); g.money=10; g.custo=0; g.finishDay();
  ok(g.result.money<0 && g.save.bank===g.result.money && g.save.neg===1 && !g.result.passed,'prejuízo: o caixa fica negativo (v8.3) e conta 1 dia no negativo');
  g.hooks.state('dayend'); ok(/^Prejuízo de R\$ /.test(els['end-money'].textContent),'fim do dia: "Prejuízo de R$ ..."'); }

// introdução e HUD
{ reset({tonhao:2},5000,'redes'); g.startDay(5); ok(/^Meta de lucro: /.test(els['intro-goal'].textContent) && new RegExp('redes sociais R\\$ '+RED).test(els['intro-goal'].textContent) && new RegExp('folha R\\$ '+TP(2)).test(els['intro-goal'].textContent),'introdução: meta de lucro e custos do dia');
  g.begin(); let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err && g.lucro<0,'HUD desenha o lucro negativo do começo do dia'+(err?': '+err:'')); }

// Turno sem fim: pontos = os de atendimento (v8.3.8; antes, o faturamento); o dinheiro acumulado recebe o faturamento menos ingredientes e contas
{ reset({},100); g.startEndless(); g.begin(); ok(!g.div && g.paidDiv===0,'sem fim: sem divulgação');
  g.money=500; g.custo=80; g.pontos=321; g.finishEndless(); ok(g.endless.pontos===321 && g.endless.fat===500 && g.save.bank===100+500-80-g.contas,'sem fim: pontos de atendimento; acumulado = faturamento − ingredientes − contas'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
