// v7.5.1, modo dev: 10 toques no selo da versão ligam; save à parte (o de verdade fica guardado), 7 dias liberados,
// R$ 10.000, melhorias ligadas e desligadas de graça (no painel e na lojinha) e o ranking fora.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const real=JSON.stringify({maxDay:3,bank:420,up:{bandeja:true}});
const H=load({store:{lcc2_save:real}}); const {g,L,els,store}=H;
const tag=els['vtag'], toca=n=>{ for(let i=0;i<n;i++) tag.fire('click'); };
const botoes=()=>els['dev-ups'].children;
const shown=id=>els[id].classList.contains('show');

ok(!L.DEV.on && g.unlocked===3 && g.save.bank===420,'sem o modo dev, o save de verdade (dia 3, R$ 420)');
ok(L.VERSAO==='v7.5.1' && tag.textContent==='v7.5.1','selo da versão: v7.5.1');
toca(9); ok(!L.DEV.on && !shown('ov-dev'),'9 toques: nada');
toca(1); ok(L.DEV.on && shown('ov-dev'),'10º toque: liga o modo dev e abre o painel');
ok(g.unlocked===7 && g.save.bank===10000,'modo dev: 7 dias liberados e R$ 10.000');
ok(store[L.LS.dev]==='1' && JSON.parse(store[L.LS.devSave]).bank===10000 && store[L.LS.save]===real,'save à parte: o de verdade não muda');
ok(tag.textContent==='v7.5.1 · dev' && tag.classList.contains('dev'),'o selo mostra "dev"');
ok(botoes().length===L.UPGRADES.length && els['dev-bank'].textContent==='R$ 10000','painel: uma chave por melhoria e o dinheiro');
{ const i=L.UPGRADES.findIndex(u=>u.id==='corrida'); botoes()[i].fire('click');
  ok(g.up.corrida && g.up.tenis && botoes()[i].getAttribute('aria-pressed')==='true','ligar os Tênis de corrida liga os Tênis novos');
  botoes()[L.UPGRADES.findIndex(u=>u.id==='tenis')].fire('click');
  ok(!g.up.tenis && !g.up.corrida,'desligar os Tênis novos desliga os de corrida'); }
L.UPGRADES.forEach((u,i)=>{ if(!g.up[u.id]) botoes()[i].fire('click'); });
ok(L.UPGRADES.every(u=>g.up[u.id]) && L.UPGRADES.every(u=>JSON.parse(store[L.LS.devSave]).up[u.id]),'todas ligadas, e salvas no save dev');
ok(g.save.bank===10000,'ligar não custa nada');
// lojinha: no modo dev, ligar e desligar de graça e sem o limite de 1 por dia
g.goShop(4);
{ const grid=els['shop-grid'], card=grid.children.find(c=>c.children[1].textContent==='Bandeja'), b=card.children[3];
  ok(b.textContent==='Desligar' && !b.disabled,'lojinha: melhoria ligada mostra "Desligar"');
  b.fire('click'); ok(!g.up.bandeja,'e desliga');
  const b2=els['shop-grid'].children.find(c=>c.children[1].textContent==='Bandeja').children[3];
  ok(b2.textContent==='Ligar' && !b2.disabled,'depois mostra "Ligar"'); b2.fire('click'); ok(g.up.bandeja && g.save.bank===10000,'liga de novo, de graça e sem limite'); }
// dinheiro: repor
g.save.bank=12; els['btn-dev-bank'].fire('click'); ok(g.save.bank===10000,'Repor R$ 10.000');
g.setState('menu'); toca(1); ok(shown('ov-dev'),'ligado, 1 toque no selo abre o painel');
// dia jogado no modo dev não mexe no save de verdade
g.startDay(5); g.begin(); g.money=900; g.finishDay();
ok(g.state==='dayend' && store[L.LS.save]===real,'jogar um dia no modo dev não mexe no save de verdade');
{ const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' '), t=txt(els['end-save']);
  ok(/ranking fica de fora/.test(t) && !/Salvar no ranking/.test(t),'fim do dia no modo dev: sem formulário do ranking'); }
// zerar no modo dev volta a 7 dias e R$ 10.000
g.save.bank=5; g.resetProgress(); ok(g.unlocked===7 && g.save.bank===10000 && store[L.LS.save]===real,'Zerar progresso no modo dev: 7 dias e R$ 10.000, o de verdade intacto');
// sair
els['btn-dev-off'].fire('click');
ok(!L.DEV.on && store[L.LS.dev]==='0' && g.unlocked===3 && g.save.bank===420 && g.up.bandeja && !g.up.tenis,'Sair do modo dev: volta o save de verdade');
ok(tag.textContent==='v7.5.1' && !tag.classList.contains('dev') && shown('ov-menu'),'o selo volta ao normal e o menu aparece');
// o modo dev fica guardado entre aberturas
{ const H2=load({store:{lcc2_save:real, lcc2_dev:'1', lcc2_save_dev:JSON.stringify({maxDay:2,bank:77,up:{ventilador:true}})}});
  ok(H2.L.DEV.on && H2.g.unlocked===7 && H2.g.save.bank===77 && H2.g.up.ventilador,'reabrindo com o modo dev ligado: save dev, 7 dias');
  ok(H2.els['vtag'].textContent==='v7.5.1 · dev','selo com "dev" desde a abertura'); }
console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
