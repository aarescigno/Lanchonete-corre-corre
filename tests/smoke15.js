// v7.5.1, modo dev: 10 toques no selo da versão ligam e desligam; o jogo fica igual, com "Modo dev" na tela, save à
// parte (o de verdade fica guardado), qualquer dia à escolha (v8.3: chips no menu), R$ 10.000 que não acabam e tudo liberado na lojinha (até antes do dia 1):
// melhorias de graça (liga e desliga), equipe completa, couvert e divulgação; ranking de fora.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const real=JSON.stringify({maxDay:3,bank:420,up:{bandeja:true},torneira:true,cardV:1,histV:1,tonXp:1,daniXp:1});   // save da v7.7 (o de antes ganha a devolução da máquina)
const H=load({store:{lcc2_save:real}}); const {g,L,els,store}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});   // a aba Equipe usa
const tag=els['vtag'], toca=n=>{ for(let i=0;i<n;i++) tag.fire('click'); };
const vis=id=>els[id].style.display!=='none';
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const cartoes=()=>els['shop-grid'].children;
const cartao=nome=>cartoes().find(c=>c.children[1] && c.children[1].textContent===nome);

ok(!L.DEV.on && g.proxDia===3 && g.save.bank===420,'sem o modo dev, o save de verdade (dia 3, R$ 420)');
ok(/^v\d/.test(L.VERSAO) && tag.textContent===L.VERSAO && !vis('devbadge') && !vis('btn-dev-off'),'selo '+L.VERSAO+', sem "Modo dev" na tela');
toca(9); ok(!L.DEV.on,'9 toques: nada');
toca(1); ok(L.DEV.on && g.state==='menu' && els['ov-menu'].classList.contains('show'),'10º toque: liga o modo dev e fica no menu');
ok(!els['ov-dev'] || !els['ov-dev'].classList.contains('show'),'sem painel à parte');
ok(g.proxDia===1 && g.save.bank===10000 && vis('daychips') && els['daychips'].children.length===10,'dia 1, R$ 10.000 e os dias à escolha (1 a 10)');
ok(tag.textContent===L.VERSAO+' · dev' && tag.classList.contains('dev') && vis('devbadge') && vis('btn-dev-off'),'"Modo dev" no selo, no alto da tela e o link de sair');
ok(store[L.LS.dev]==='1' && JSON.parse(store[L.LS.devSave]).bank===10000 && store[L.LS.save]===real,'save à parte: o de verdade não muda');

// dia 1: no modo dev, a lojinha abre antes
els['daychips'].children.find(c=>c.getAttribute('aria-label')==='Dia 7').fire('click'); ok(g.proxDia===7 && /dia 7/.test(els['btn-play'].textContent),'o chip do dia 7 leva o save dev ao dia 7');
els['btn-play'].fire('click'); ok(g.state==='shop' && g.shopNext===7,'Continuar (dia 7) abre a lojinha');
g.setState('menu'); els['daychips'].children.find(c=>c.getAttribute('aria-label')==='Dia 1').fire('click'); els['btn-play'].fire('click');
ok(g.state==='shop' && g.shopNext===1,'até o dia 1 abre a lojinha no modo dev');

// melhorias: todas na grade, de graça, liga e desliga, sem limite
L.setShopTab('melhorias');
{ const nM=cartoes().length-1;   /* menos o cartão da TV e som */ L.setShopTab('bia'); ok(nM+cartoes().length===L.UPGRADES.length,'as '+L.UPGRADES.length+' melhorias nas seções Melhorias e Bia (Tênis novos e de corrida juntos)'); }
ok(/Modo dev/.test(els['shop-limit'].textContent),'aviso de modo dev na lojinha');
L.UPGRADES.forEach(u=>{ L.setShopTab(['tenis','corrida','bandeja','sudoku'].includes(u.id)?'bia':'melhorias'); const b=cartao(u.name).children[3]; ok(b.textContent==='Ligar' && !b.disabled,'"Ligar" '+u.name); b.fire('click'); });
ok(L.UPGRADES.every(u=>g.up[u.id]) && g.save.bank===10000,'todas ligadas, sem gastar');
L.setShopTab('bia'); cartao('Tênis novos').children[3].fire('click'); ok(!g.up.tenis && !g.up.corrida,'desligar os Tênis novos desliga os de corrida');
cartao('Tênis de corrida').children[3].fire('click'); ok(g.up.tenis && g.up.corrida,'ligar os de corrida liga os novos');
ok(L.UPGRADES.every(u=>JSON.parse(store[L.LS.devSave]).up[u.id]),'salvas no save dev');

// equipe completa (e o couvert, mesmo na Garagem)
L.setShopTab('divulga');
ok(g.setStaff('tonhao',2) && g.setStaff('dani',4) && g.setStaff('tv',true) && g.setStaff('som',true),'Tonhão 3, Dani 3, TV e som');
ok(L.couvertOk(g.ponto) && /Couvert/.test(txt(els['shop-grid'])) && g.setStaff('couvert',true),'couvert liberado na Garagem');
ok(['pratos','lavar','lixo','suco'].filter(t=>g.toggleDaniTask(t)||g.save.equipe.daniTasks.indexOf(t)>=0).length>=3,'tarefas da Dani');
// divulgação desde o dia 1
L.setShopTab('divulga');
ok(L.divulgaAberta(1) && g.setDivulga('redes') && g.save.divulga==='redes','divulgação liberada no dia 1');
els['btn-shop-go'].fire('click'); ok(g.state==='intro' && g.day.n===1 && g.div && g.div.id==='redes','o dia 1 abre com as redes sociais');
g.begin(); ok(g.state==='playing' && vis('devbadge'),'jogando: "Modo dev" continua na tela');
// o dinheiro não acaba
g.save.bank=12; g.goShop(2); ok(g.save.bank===10000,'a lojinha repõe os R$ 10.000');
// ranking de fora
g.startDay(5); g.begin(); g.money=900; g.finishDay();
ok(g.state==='dayend' && store[L.LS.save]===real,'jogar um dia no modo dev não mexe no save de verdade');
{ const t=txt(els['end-save']); ok(/ranking fica de fora/.test(t) && !/Salvar no ranking/.test(t),'fim do dia no modo dev: sem formulário do ranking'); }
// zerar no modo dev
g.save.bank=5; g.resetProgress(); ok(g.proxDia===1 && g.save.bank===10000 && store[L.LS.save]===real,'Recomeçar do zero no modo dev: dia 1 e R$ 10.000');
// sair: 10 toques de novo
g.setState('menu'); toca(10);
ok(!L.DEV.on && store[L.LS.dev]==='0' && g.proxDia===3 && g.save.bank===420 && g.up.bandeja && !g.up.tenis,'10 toques de novo: sai e volta o save de verdade');
ok(tag.textContent===L.VERSAO && !tag.classList.contains('dev') && !vis('devbadge') && !vis('btn-dev-off'),'"Modo dev" some da tela');
ok(!L.couvertOk(g.ponto) && !L.divulgaAberta(1) && !g.save.equipe.couvert,'fora do modo dev, couvert e divulgação voltam às regras');
els['btn-play'].fire('click'); ok(g.state==='shop' && g.shopNext===3,'carreira normal');
g.setState('menu'); ok(!vis('daychips'),'fora do modo dev, sem escolha de dia (v8.3)');
{ g.goShop(2); L.setShopTab('bia'); const b=cartao('Bandeja').children[3]; ok(b.textContent==='Já comprado' && b.disabled,'lojinha normal fora do modo dev'); }
// link "Sair do modo dev"
g.setState('menu'); toca(10); ok(L.DEV.on,'liga de novo'); els['btn-dev-off'].fire('click'); ok(!L.DEV.on && !vis('devbadge'),'"Sair do modo dev" no menu');
// o modo dev fica guardado entre aberturas
{ const H2=load({store:{lcc2_save:real, lcc2_dev:'1', lcc2_save_dev:JSON.stringify({maxDay:2,bank:77,up:{ventilador:true}})}});
  ok(H2.L.DEV.on && H2.g.proxDia===2 && H2.g.save.bank===77 && H2.g.up.ventilador,'reabrindo com o modo dev ligado: save dev (dia 2)');
  ok(H2.els['vtag'].textContent===H2.L.VERSAO+' · dev' && H2.els['devbadge'].style.display!=='none','"Modo dev" desde a abertura'); }
console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
