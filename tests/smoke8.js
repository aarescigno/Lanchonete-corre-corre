// v7.4: o salão da v6 à v7.3 (cadeiras e mesas numa planta fixa) vira a Garagem com o kit, e o que o jogador
// gastou nele volta para o dinheiro, numa linha "Devolução do salão" do caixa. E as faixas de estrelas (v6).
const HH=require('./harness.js');
const {g,L,ctx,els}=HH();
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const S=L.SALAO, V=S.v6, kit=s=>s.ponto==='garagem' && s.mesas.map(m=>m.seats).join()===L.salaoKit(L.PONTOS[0]).map(m=>m.seats).join() && L.salaoLugares(s.mesas)===10;
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');

// conversão do save
{ const old={maxDay:5,bank:500,salao:{seats:{1:4,2:2,3:2,4:2,5:4,6:4,7:2},chairs:22,mesas:1},caixa:[{d:4,fat:900,lucro:300,saldo:500}]};
  const dev=V.tablePrice+((22-V.chairs-2)/2)*V.chairPrice, n=L.normSave(old);
  ok(L.salaoDevolucao(old.salao)===dev && dev===420,'devolução: 1 mesa ('+V.tablePrice+') e 2 pares de cadeiras ('+V.chairPrice+' cada) = '+dev);
  ok(n.bank===500+dev,'o dinheiro acumulado recebe a devolução ('+n.bank+')');
  ok(kit(n.salao),'começa na Garagem com o kit (4 mesas, 10 lugares)');
  const last=n.caixa[n.caixa.length-1];
  ok(n.caixa.length===2 && last.dev===dev && last.saldo===n.bank && last.d===4 && !last.fat && !last.lucro,'linha "Devolução do salão" no caixa, com o saldo');
  ok(L.normCaixa(n.caixa).length===2 && L.normCaixa(n.caixa)[1].dev===dev,'a linha da devolução sobrevive ao save');
  ok(L.caixaTotais(n.caixa).every(t=>t.v>=0) && L.caixaTotais(n.caixa).find(t=>t.id==='sal').v===0,'a devolução não entra em "para onde foi o dinheiro"');
  const n2=L.normSave(JSON.parse(JSON.stringify(n))); ok(n2.bank===n.bank && n2.caixa.length===2,'save já convertido não devolve de novo'); }
{ const n=L.normSave({bank:100,salao:{seats:{1:2,2:2,3:2,4:2,5:4,6:4},chairs:16,mesas:0}});
  ok(n.bank===100 && !n.caixa.length && kit(n.salao),'salão antigo sem compras: sem devolução e sem linha'); }
{ const n=L.normSave({bank:100,salao:{chairs:99,mesas:7}});
  ok(n.bank===100+2*V.tablePrice+4*V.chairPrice && kit(n.salao),'salão antigo estragado: devolve no máximo 2 mesas e 4 pares'); }
{ const n=L.normSave({bank:100}); ok(n.bank===100 && kit(n.salao),'save sem salão (v5 ou antes): o kit, sem devolução'); }

// no carregamento: converte e grava uma vez só
{ const old={maxDay:3,bank:200,salao:{seats:{1:2,2:2,3:2,4:2,5:4,6:4},chairs:20,mesas:0}};
  const h=HH({store:{lcc2_save:JSON.stringify(old)}});
  ok(h.g.save.bank===200+2*V.chairPrice && kit(h.g.save.salao) && h.g.tables.length===4,'carregar um save da v7.3 devolve as cadeiras e abre na Garagem');
  const saved=JSON.parse(h.store.lcc2_save); ok(Array.isArray(saved.salao.mesas) && saved.bank===h.g.save.bank,'o save convertido já fica gravado');
  const h2=HH({store:{lcc2_save:h.store.lcc2_save}}); ok(h2.g.save.bank===h.g.save.bank && h2.g.save.caixa.length===1,'carregar de novo não devolve outra vez');
  h.g.goShop(3); h.L.setShopTab('caixa'); const t=txt(h.els['shop-grid']);
  ok(/Devolução do salão antigo: \+R\$ 120/.test(t),'aba Caixa mostra a devolução');
  ok(/Devolução do salão: \+120 · saldo 320/.test(h.L.caixaResumo(h.g.save)),'resumo do caixa traz a devolução'); }

// estrelas: 1 na meta, 2 na metade do caminho até a expert, 3 na expert sem perder ninguém
// (v7: pelo lucro; fin recebe o lucro e soma de volta as contas do dia ao faturamento)
{ const d=L.DAYS[1], B=L.bomGoal(d), fin=(m,lost)=>{ g.startDay(2); g.begin(); g.money=m+g.fixo; g.custo=0; g.stats.lost=lost; g.finishDay(); return g.result.stars; };
  ok(B===Math.round((d.meta+d.expert)/50)*25,'2ª estrela do dia 2 na metade do caminho ('+B+')');
  ok(fin(d.meta-1,0)===0 && fin(d.meta,0)===1 && fin(B-1,0)===1 && fin(B,0)===2 && fin(d.expert-1,0)===2,'faixas de 0, 1 e 2 estrelas');
  ok(fin(d.expert,1)===2 && fin(d.expert,0)===3,'expert com perda: 2; sem perda: 3');
  ok(L.DAYS.every(x=>L.bomGoal(x)>x.meta && L.bomGoal(x)<x.expert),'2ª estrela sempre entre a meta e a expert'); }

// v8.3.7: o fim do dia diz "3 estrelas ... sem perder ninguém" e, com o lucro batido e uma perda, explica a estrela que faltou
{ const d=L.DAYS[1], fin=(m,lost)=>{ g.startDay(2); g.begin(); g.money=m+g.fixo; g.custo=0; g.stats.lost=lost; g.finishDay(); g.hooks.state('dayend'); };
  fin(d.expert,1); const em=els['end-money'].textContent, msg=els['end-msg'].textContent;
  ok(/3 estrelas R\$ \d+ sem perder ninguém\)$/.test(em) && !/expert/i.test(em),'linha do lucro sem "expert": '+em);
  ok(g.result.stars===2 && /1 cliente foi embora/.test(msg) && /3ª estrela/.test(msg),'expert com 1 perda: a mensagem explica a 3ª estrela');
  fin(d.expert,2); ok(/2 clientes foram embora/.test(els['end-msg'].textContent),'com 2 perdas, no plural');
  fin(d.expert,0); ok(g.result.stars===3 && /Perfeito/.test(els['end-msg'].textContent),'sem perda: 3 estrelas'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
