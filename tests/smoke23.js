// v8.3.6, Jogo de pratos sem limite: fica à venda quantas vezes quiser (+1 prato limpo cada), fora da melhoria do dia;
// as outras seguem 1 por dia. Save antigo (true) vira 1.
const H=require('./harness.js')(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);
const cartao=nome=>acha(els['shop-grid'],e=>/item/.test(e.className||'')&&e.children&&e.children[1]&&(e.children[1].textContent||'').indexOf(nome)===0);
const P=L.UPGRADES.find(u=>u.id==='pratos');
const novo=bank=>{ g.save=L.normSave({maxDay:3,bank}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.goShop(3); L.setShopTab('melhorias'); };

ok(P.multi && P.cost===300,'Jogo de pratos acumula, R$ 300');
ok(L.normSave({up:{pratos:true}}).up.pratos===1,'save antigo: true vira 1');
ok(!('pratos' in L.normSave({up:{pratos:0}}).up),'save com 0 jogos: some');
ok(L.normSave({up:{chapa:true}}).up.pratos===1,'Chapa nova ainda vira 1 jogo');
const d3=L.DAYS.find(d=>d.n===3);
ok(L.dishStock(d3,{})===4 && L.dishStock(d3,{pratos:true})===5 && L.dishStock(d3,{pratos:3})===7,'dia 3: 4 pratos, +1 por jogo');
ok(L.dishStock({endless:true},{pratos:2})===7,'Turno sem fim: 5 +2');

novo(2000);
ok(g.buy('tenis'),'compra a melhoria do dia');
ok(!g.buy('cafeteira'),'2ª melhoria no mesmo dia: bloqueada');
ok(g.buy('pratos') && g.buy('pratos') && g.buy('pratos'),'Jogo de pratos 3 vezes, depois da melhoria do dia');
ok(g.up.pratos===3 && g.save.bank===2000-150-900,'3 jogos e o dinheiro certo');
ok(g.shopBought && g.boughtFor===3,'o dia segue com a melhoria escolhida');
L.setShopTab('melhorias');
{ const c=cartao('Jogo de pratos'); ok(c && /^Você tem 3\./.test(c.children[2].textContent),'cartão mostra "Você tem 3."');
  const b=c.children[3]; ok(b.textContent==='Comprar R$ 300' && !b.disabled,'botão do Jogo de pratos ativo');
  const cf=cartao('Cafeteira').children[3]; ok(cf.disabled,'cafeteira desabilitada (melhoria do dia já escolhida)'); }
ok(/pratos à vontade/.test(els['shop-limit'].textContent),'aviso do limite cita o Jogo de pratos');
g.resetDay(3); ok(g.kitchen.clean===7,'dia 3 abre com 7 pratos limpos');

novo(500);
ok(g.buy('pratos') && !g.shopBought,'só o Jogo de pratos: a melhoria do dia continua livre');
ok(g.buy('tenis'),'e a melhoria do dia ainda pode ser comprada');
ok(!g.buy('pratos'),'sem dinheiro: bloqueado ('+g.save.bank+')');
ok(/jogo de pratos/.test(L.caixaResumo(g.save)),'resumo do caixa cita o jogo de pratos');

console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
