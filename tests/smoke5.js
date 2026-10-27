// v4: balcão de sucos e bandeja
const load=require('./harness.js');
let fails=0, total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L}=H;
const K=k=>({kind:k}), many=(k,n)=>Array.from({length:n},()=>K(k));
const fit=(items,tray,mt)=>L.handLayout(items,tray,mt)!==null;

/* capacidade das mãos */
ok(fit([K('dish'),K('coffee')],false) && !fit(many('dish',3),false) && !fit(many('juice',3),false),'sem bandeja: 1 item por mão');
// bandeja: combinações máximas (+ mão livre vazia)
ok(fit([K('dish'),K('juice')],true) && fit([K('dish'),K('coffee')],true),'bandeja: 1 prato + 1 bebida');
ok(fit(many('dish',2),true) && fit(many('juice',3),true) && fit(many('coffee',3),true) && fit(many('dirty',2),true),'bandeja: 2 pratos, 3 sucos, 3 cafés, 2 pilhas de louça');
ok(L.trayOk([K('dish'),K('juice')]) && !L.trayOk([K('dish'),K('juice'),K('juice')]) && !L.trayOk([K('dish'),K('dish'),K('juice')]),'bandeja: prato + bebida no máximo 1 de cada');
ok(!L.trayOk(many('dish',3)) && !L.trayOk(many('juice',4)) && !L.trayOk(many('dirty',3)),'bandeja: acima do limite não cabe');
ok(!L.trayOk([K('dirty'),K('dish')]) && !L.trayOk([K('dirty'),K('coffee')]),'bandeja: sujo e limpo nunca juntos');
ok(!L.trayOk([K('ticket')]),'bandeja: comanda não vai');
// bandeja + mão livre
ok(fit([K('dish'),K('dish'),K('dirty')],true),'limpo na bandeja e louça suja na mão');
ok(fit(many('dish',3),true) && !fit(many('dish',4),true),'2 pratos na bandeja + 1 na mão, não 4');
ok(fit(many('juice',4),true) && !fit(many('juice',5),true),'3 sucos na bandeja + 1 na mão, não 5');
ok(fit(many('dirty',3),true) && !fit(many('dirty',4),true),'2 pilhas na bandeja + 1 na mão, não 4');
// comandas
ok(fit(many('ticket',3),false) && !fit(many('ticket',4),false),'comandas: até 3 (bocas da cozinha) numa mão');
ok(fit(many('ticket',5),true,5) && !fit(many('ticket',6),true,5),'limite de comandas acompanha as bocas da cozinha');
ok(fit([K('ticket'),K('ticket'),K('dish')],false) && !fit([K('ticket'),K('dish'),K('dish')],false),'sem bandeja: comandas numa mão + 1 item na outra');
ok(fit([K('ticket'),K('ticket'),K('ticket'),K('dish'),K('juice')],true),'com bandeja: 3 comandas na mão + prato e suco na bandeja');
ok(!fit([K('ticket'),K('dirty'),K('dish')],true),'mão das comandas não leva mais nada');
{ const lay=L.handLayout([K('ticket'),K('dish'),K('dish')],true); ok(lay[0].length===2&&lay[1].every(h=>h.kind==='ticket'),'layout: pratos na bandeja, comanda na outra mão'); }
{ const lay=L.handLayout([K('dish'),K('dirty')],true); ok(lay[0][0].kind==='dish'&&lay[1][0].kind==='dirty','layout: louça suja vai na mão livre'); }

/* estações */
ok(g.stationAt(910,350)==='juice' && g.stationAt(820,350)==='coffee','balcão de sucos ao lado do cafezinho');

/* upgrade */
{ const u=L.UPGRADES.find(x=>x.id==='bandeja'); ok(u && u.cost>0,'bandeja na lojinha'); ok(L.UPGRADES.length===8,'8 melhorias (com os Tênis de corrida, v7.3, e o Triturador, v8.3.10)'); }

/* agenda: suco só a partir do dia 3 */
for(const n of [1,2]){ let any=false; for(let k=0;k<20;k++){ g.resetDay(n); const grp=new L.Group(g,'estudante',1,0); if(grp.juiceWant) any=true; } ok(!any,'dia '+n+' sem suco'); }
{ g.resetDay(3); let c=0; for(let k=0;k<400;k++){ const grp=new L.Group(g,'familia',1,0); if(grp.juiceWant){ c++; if(grp.juiceWant<1||grp.juiceWant>grp.size) c=-1e9; } } ok(c>80&&c<200,'dia 3: ~35% pedem suco, 1 a tamanho do grupo ('+c+'/400)'); }

/* fluxo: pegar suco, entregar, conta */
function setup(tray){
  g.up={}; if(tray) g.up.bandeja=true; g.save.up=g.up;
  g.startDay(3); g.begin(); g.schedule=[]; g.nextIdx=0;
  const grp=g.spawn({type:'familia',color:0}); const t=g.tables.find(x=>x.free&&x.seats>=grp.size);
  g.seatGroup(grp,t); for(let i=0;i<200&&grp.state!=='wantOrder';i++) g.update(0.05);
  g.bia.hands=[]; grp.juiceWant=2; grp.juiceGot=0; grp.hearts=3;
  return {grp,t};
}
const run=s=>{ for(let i=0;i<s*20;i++){ g.queue.forEach(x=>x.patLeft=1e9); g.groups.forEach(x=>{ if(x.patLeft<5) x.patLeft=1e9; }); g.update(0.05); } };
{ const {grp,t}=setup(false);
  ok(!grp.juiceOpen,'pedido de suco só aparece depois de anotar');
  g.tapTable(t); run(4); ok(grp.state==='ordered'&&grp.juiceOpen&&grp.juicePending===2,'anotou: mesa espera 2 sucos');
  g.tapStation('order',800,150); run(5);
  g.tapStation('juice',910,350); g.tapStation('juice',910,350); g.tapStation('juice',910,350); run(6);
  ok(g.bia.juiceN()===2,'sem bandeja: pegou só 2 sucos (3º: mãos cheias)');
  const m0=g.money, h0=grp.hearts; g.tapTable(t); run(5);
  ok(grp.juicePending===0 && g.bia.juiceN()===0,'entregou os 2 sucos');
  ok(g.money===m0 && grp.bebConta===2*L.JUICE.price && grp.hearts===Math.min(5,h0+1),'sucos: R$ '+(2*L.JUICE.price)+' na conta (nada adiantado) e +1 coração');
  ok(g.stats.juice===2,'estatística de sucos'); }
{ const {grp,t}=setup(true);
  g.tapTable(t); run(4); g.tapStation('order',800,150); run(5);
  for(let k=0;k<4;k++) g.tapStation('juice',910,350); run(8);
  ok(g.bia.juiceN()===4,'com bandeja: 4 sucos (3 na bandeja + 1 na mão)');
  g.tapStation('juice',910,350); run(2); ok(g.bia.juiceN()===4,'5º suco não cabe'); }
{ // conta com suco faltando
  const {grp,t}=setup(false); g.tapTable(t); run(4); g.tapStation('order',800,150); run(3);
  grp.setState('eating'); grp.timer=0.01; grp.hearts=5; run(1);
  ok(grp.state==='eating' && grp.esperaSuco,'acabou de comer sem o suco: não pede a conta, espera o suco');
  { const pl=grp.patLeft; grp.update(1); ok(grp.state==='eating' && isFinite(pl) && Math.abs(pl-grp.patLeft-1)<1e-9,'esperando o suco, perde a paciência'); }
  const m0=g.money; g.bia.hands=[K('juice'),K('juice')]; g.tapTable(t); run(4);
  ok(grp.juicePending===0 && g.money===m0,'entregou o suco: nada de dinheiro adiantado');
  run(0.5); ok(grp.state==='wantBill' && !grp.esperaSuco,'com o suco, pede a conta');
  const m1=g.money, h=grp.hearts; g.tapTable(t); run(4);
  ok(grp.paid && g.money-m1===Math.round(grp.bill*(1+L.GORJETA[h]+grp.T.tip+(grp.vip?L.VIP.tip:0)))+2*L.JUICE.price,'a conta cobra a comida e os sucos'); }
{ // suco entregue no mesmo toque da conta
  const {grp,t}=setup(false); g.tapTable(t); run(4); g.tapStation('order',800,150); run(3);
  g.bia.hands=[K('juice'),K('juice')]; grp.setState('wantBill'); const miss=g.stats.juiceMiss; g.tapTable(t); run(4);
  ok(grp.paid && g.stats.juiceMiss===miss && g.bia.juiceN()===0,'toque na mesa entrega o suco e cobra a conta'); }
{ // pratos: bandeja leva 2 da mesma mesa
  g.up={bandeja:true}; g.save.up=g.up; g.startDay(4); g.begin(); g.bia.hands=[];
  g.kitchen.plates=[{id:91,table:5,group:null,dish:'pf',slot:0,age:0},{id:92,table:6,group:null,dish:'pastel',slot:1,age:0},{id:93,table:1,group:null,dish:'pf',slot:2,age:0},null];
  [0,1,2].forEach(i=>g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y)); run(6);
  ok(g.bia.hands.filter(h=>h.kind==='dish').length===3,'com bandeja: 3 pratos (2 na bandeja + 1 na mão)'); }

/* lixeira: descarta as bebidas que sobraram, multa de metade do valor */
ok(g.stationAt(722,505)==='trash' && g.tableAt(722,505)===null,'lixeira no chão, ao lado do balcão');
{ g.up={bandeja:true}; g.save.up=g.up; g.startDay(4); g.begin(); g.money=100;   // sem esvaziar a agenda: o dia não pode acabar no meio do teste
  g.bia.hands=[K('juice'),K('juice'),K('coffee'),K('dirty')]; g.tapStation('trash',722,505); run(6);
  ok(g.bia.hands.length===1 && g.bia.hands[0].kind==='dirty','lixeira leva só as bebidas (a louça fica)');
  ok(Math.abs(g.money-(100-L.JUICE.price-L.DRINK_PRICE.coffee/2))<1e-9 && g.stats.trash===3,'multa: metade do preço de cada suco e do café ('+g.money+')');
  g.bia.hands=[K('dish')]; const m=g.money; g.tapStation('trash',722,505); run(1);
  ok(g.money===m && g.bia.hands.length===1 && g.bia.qT>0,'sem bebida: "?" e nada é jogado fora'); }

/* bot joga dias 3–7 com e sem bandeja, com render */
{ const bot=require('./bot.js')(g,L); let err=null, juice=0;
  try{ for(const tray of [false,true]) for(let n=3;n<=7;n++){ g.up=tray?{bandeja:true}:{}; g.save.up=g.up; g.startDay(n); g.begin(); let st=0;
    while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); if(st%10===0) L.render(g,H.ctx); if(!fit(g.bia.hands,g.bia.tray)) throw new Error('mãos estouraram'); st++; }
    juice+=g.result.juice; } }catch(e){ err=e; }
  ok(!err,'dias 3–7 com render, mãos sempre válidas'+(err?': '+err.stack:'')); ok(juice>20,'bot entregou sucos ('+juice+')'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
