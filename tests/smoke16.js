// v8, manutenção e imprevistos: desgaste a cada dia, sorteio guardado, quebra no tempo certo, efeitos, conserto na hora,
// revisão na lojinha, chuva e feriado, Turno sem fim, modo dev, introdução e aba Manutenção.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const near=(a,b,e)=>Math.abs(a-b)<=(e==null?1e-9:e);
const H=load({imprevistos:true}); const {g,L,els,store}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const bot=require('./bot.js')(g,L);
const M=L.MANUT, R0=Math.random;
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);
const lerSave=()=>JSON.parse(store[L.LS.save]);
const novo=(bank,maxDay,manut)=>{ g.save=L.normSave({maxDay:maxDay||7,bank:bank==null?3000:bank,manut}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const joga=()=>{ let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; } };
const fixa=v=>{ Math.random=()=>v; };
const solta=()=>{ Math.random=R0; };

// ---------- save novo e normManut ----------
ok(M.on && M.dia===4 && L.CLIMA_DIA===3 && M.equip.map(e=>e.id).join()==='fogao,geladeira,cafeteira','imprevistos ligados no teste: fogão, geladeira e cafeteira, a partir do dia 4 (clima do dia 3)');
{ const n=L.normSave({}); ok(M.equip.every(e=>n.manut[e.id]===1) && !n.manut.sorteio,'save novo: tudo a 100%, sem sorteio'); }
{ const m=L.normManut('lixo'); ok(M.equip.every(e=>m[e.id]===1) && !m.sorteio,'normManut: texto vira tudo 100%');
  const m2=L.normManut(null); ok(M.equip.every(e=>m2[e.id]===1),'normManut: null');
  const m3=L.normManut({fogao:'abc',geladeira:5,cafeteira:-3,sorteio:{d:'x'}}); ok(m3.fogao===1 && m3.geladeira===1 && m3.cafeteira===0 && !m3.sorteio,'normManut: lixo vira 100%, limita em 0 a 1, sorteio inválido some');
  const m4=L.normManut({fogao:0.5,sorteio:{d:4,clima:'neve',quebra:[{id:'fogao',f:2},{id:'xx',f:0.2},null,{id:'cafeteira'}]}});
  ok(m4.fogao===0.5 && m4.sorteio && m4.sorteio.d===4 && m4.sorteio.clima==='' && m4.sorteio.quebra.length===2 && m4.sorteio.quebra[0].f===1 && m4.sorteio.quebra[1].f===0.3,'normManut: sorteio limpo (clima inválido, equipamento inventado e nulo saem, f limitado)'); }
{ const n=L.normSave({manut:{fogao:0.4}}); ok(n.manut.fogao===0.4 && n.manut.geladeira===1,'normSave mantém o que veio no save'); }

// ---------- desgaste depois de um dia ----------
novo(3000,7); g.startDay(2); g.begin(); joga();
{ const u=Object.assign({},g.usos), m=g.save.manut;
  ok(g.state==='dayend' && u.fogao>=5 && u.fogao===u.geladeira,'dia 2 jogado pelo bot: '+u.fogao+' pratos prontos, '+u.cafeteira+' cafés');
  ok(M.equip.every(q=>near(m[q.id],1-(q.base+q.uso*u[q.id])/100,1e-9)),'desgaste = base + uso × usos do dia (fogão '+m.fogao.toFixed(2)+', geladeira '+m.geladeira.toFixed(2)+', cafeteira '+m.cafeteira.toFixed(2)+')');
  ok(m.fogao<1 && m.geladeira<1 && m.cafeteira<1,'os três ficam abaixo de 100% depois de um dia');
  ok(near(lerSave().manut.fogao,m.fogao),'o desgaste vai para o save');
  ok(g.result.manut.fogao===m.fogao && g.result.conserto===0 && g.result.quebras.length===0,'resultado traz o estado e nenhum conserto'); }
{ // dia cheio gasta mais
  novo(3000,7); g.startDay(2); g.usos={fogao:10,geladeira:10,cafeteira:2}; g.desgastar(); const a=Object.assign({},g.save.manut);
  novo(3000,7); g.startDay(2); g.usos={fogao:30,geladeira:30,cafeteira:12}; g.desgastar(); const b=g.save.manut;
  ok(b.fogao<a.fogao && b.geladeira<a.geladeira && b.cafeteira<a.cafeteira,'dia cheio gasta mais (fogão '+a.fogao.toFixed(2)+' → '+b.fogao.toFixed(2)+')');
  novo(3000,7); g.startDay(2); g.usos={fogao:0,geladeira:0,cafeteira:0}; g.desgastar(); ok(near(g.save.manut.fogao,1-M.equip[0].base/100),'dia vazio gasta só a base');
  novo(3000,7,{fogao:0.02}); g.startDay(2); g.usos={fogao:99,geladeira:0,cafeteira:0}; g.desgastar(); ok(g.save.manut.fogao===0,'o estado não passa de 0'); }
{ // quebrado sem conserto perde mais 10 pontos; consertado no dia fica 100%
  novo(3000,7,{fogao:0.8,geladeira:0.8,cafeteira:0.8}); g.startDay(2);
  g.save.manut.geladeira=1; g.quebras=[{id:'fogao',t:0,on:true,fixed:false},{id:'geladeira',t:0,on:true,fixed:true}]; g.usos={fogao:0,geladeira:0,cafeteira:0}; g.desgastar();
  const m=g.save.manut; ok(near(m.fogao,0.8-(M.equip[0].base+10)/100) && m.geladeira===1 && near(m.cafeteira,0.8-M.equip[2].base/100),'quebrou e ficou sem conserto: -10 pontos; consertado: 100%; o outro, só o desgaste'); }
{ novo(3000,7); g.startDay(2); g.mode='semfim'; g.usos={fogao:40,geladeira:40,cafeteira:40}; g.desgastar(); ok(M.equip.every(q=>g.save.manut[q.id]===1),'desgastar() não faz nada no Turno sem fim'); }

// ---------- sem quebras antes do dia 4, sem clima antes do dia 3 ----------
fixa(0);
novo(3000,7,{fogao:0,geladeira:0,cafeteira:0});
g.startDay(2); ok(g.clima==='' && g.quebras.length===0 && g.save.manut.sorteio && g.save.manut.sorteio.d===2,'dia 2: sem clima e sem quebras, mesmo com sorte máxima e tudo gasto');
g.startDay(3); ok(g.clima==='chuva' && g.quebras.length===0,'dia 3: clima sorteia ('+g.clima+'), mas ainda sem quebras');
g.startDay(4); ok(g.clima==='chuva' && g.quebras.map(q=>q.id).join()==='fogao,geladeira,cafeteira','dia 4: tudo gasto quebra tudo (3 quebras)');
fixa(0.999); novo(3000,7,{fogao:0,geladeira:0,cafeteira:0}); g.startDay(4); ok(g.clima==='' && g.quebras.length===3,'no limite quebra com certeza, mesmo sem sorte');
fixa(0.999); novo(3000,7,{fogao:0.3,geladeira:0.3,cafeteira:0.3}); g.startDay(4); ok(g.quebras.length===0,'no vermelho, sem sorte (sorteio acima de 50%), nada quebra');
fixa(0); novo(3000,7,{fogao:0.45,geladeira:0.41,cafeteira:0.7}); g.startDay(4); ok(g.quebras.length===0,'no amarelo e no verde nunca quebra, nem com sorte máxima');
fixa(0); novo(3000,7); g.startDay(7); ok(g.quebras.length===0 && L.manutChance(1)===0,'tudo a 100%: chance 0, nada quebra');
solta();
ok(L.manutChance(1)===0 && L.manutChance(0.7)===0 && L.manutChance(0.4)===0 && L.manutChance(0.39)===0.5 && L.manutChance(0.2)===0.5 && L.manutChance(M.limite)===1 && L.manutChance(0)===1,'manutChance: 0 no verde e no amarelo, 50% no vermelho, 100% no limite ('+[1,0.7,0.4,0.39,0.2,0.15,0].map(e=>(L.manutChance(e)*100).toFixed(0)+'%').join(' ')+')');

// ---------- sorteio guardado e reaproveitado ----------
fixa(0); novo(3000,7,{fogao:0.35,geladeira:0.35,cafeteira:0.35}); g.startDay(5);
const so1=JSON.stringify(g.save.manut.sorteio), qb1=g.quebras.map(q=>q.id+':'+q.t.toFixed(2)).join();
ok(g.quebras.length===3 && lerSave().manut.sorteio.d===5 && JSON.stringify(lerSave().manut.sorteio)===so1,'sorteio do dia 5 guardado no save');
fixa(0.999); g.startDay(5);
ok(JSON.stringify(g.save.manut.sorteio)===so1 && g.quebras.map(q=>q.id+':'+q.t.toFixed(2)).join()===qb1 && g.clima==='chuva','recomeçar o dia usa o mesmo sorteio (sorte diferente não muda nada)');
{ const H2=load({imprevistos:true,store:{[L.LS.save]:store[L.LS.save]}}); ok(H2.g.save.manut.sorteio && H2.g.save.manut.sorteio.d===5,'reabrindo o jogo, o sorteio do dia continua no save'); }
g.begin(); g.finishDay();
ok(!g.save.manut.sorteio && !lerSave().manut.sorteio,'o sorteio é apagado no fim do dia');
fixa(0.999); g.startDay(5); ok(g.quebras.length===0 && g.clima==='' && g.save.manut.sorteio.d===5,'o dia seguinte sorteia de novo');
g.startDay(6); ok(g.save.manut.sorteio.d===6,'outro dia: sorteio novo');
solta();

// ---------- quebra no tempo certo ----------
fixa(0); novo(3000,7,{fogao:0.1,geladeira:1,cafeteira:1}); g.startDay(4);
{ const q=g.quebras[0]; ok(q && q.id==='fogao' && near(q.t,M.quando[0]*g.day.time,1e-6),'quebra do fogão marcada em '+Math.round(q.t)+' s ('+Math.round(M.quando[0]*100)+'% do dia)');
  solta(); g.begin();
  while(g.elapsed<q.t-0.3 && g.state==='playing') g.update(0.05);
  ok(!q.on && !g.quebrado('fogao') && g.stats.quebras===0,'antes da hora: funcionando');
  while(g.elapsed<q.t+0.2 && g.state==='playing') g.update(0.05);
  ok(q.on && g.quebrado('fogao') && g.stats.quebras===1,'na hora marcada: o fogão quebrou');
  g.update(1); ok(g.stats.quebras===1,'quebra uma vez só');
  g.finishDay(); ok(g.result.quebras.length===1 && g.result.quebras[0].id==='fogao' && !g.result.quebras[0].fixed && g.save.manut.fogao===0,'sem conserto, o fim do dia anota a quebra e o fogão cai (10 pontos a mais)'); }
{ novo(3000,7,{fogao:0.1,geladeira:0.1,cafeteira:0.1}); fixa(0.999); g.startDay(4); solta(); ok(g.quebras.every(q=>q.t>=M.quando[0]*g.day.time-1e-6 && q.t<=M.quando[1]*g.day.time+1e-6),'quebras sorteadas dentro da faixa do dia '+M.quando.join('–')+' (sorte 0,999)'); }

// ---------- efeitos ----------
const quebra=id=>{ g.quebras=[{id,t:0,on:true,fixed:false}]; };
{ novo(3000,7); g.startDay(2); g.begin();
  const rodaFogao=()=>{ g.kitchen.cooking=[{group:null,table:1,time:100,p:0,dish:0}]; g.kitchen.queue=[]; g.kitchen.update(1); return g.kitchen.cooking[0].p; };
  const normal=rodaFogao(); quebra('fogao'); const lento=rodaFogao();
  ok(near(normal,1) && near(lento,L.manutOf('fogao').lento),'fogão quebrado: cozinha a '+L.manutOf('fogao').lento+' da velocidade ('+normal+' → '+lento+')');
  g.quebras=[]; g.kitchen.clean=5;
  const grp={bill:100,vip:false,state:'ordered'}, preco=()=>{ g.custo=0; g.kitchen.cooking=[{group:grp,table:1,time:1,p:0,dish:0}]; g.kitchen.plates=[null,null,null,null]; g.kitchen.update(2); return g.custo; };
  const c1=preco(); quebra('geladeira'); const c2=preco(); quebra('fogao'); const c3=preco();
  ok(c1===Math.round(100*L.INGRED.prato) && c2===Math.round(100*L.INGRED.prato*L.manutOf('geladeira').ingred) && c3===c1,'geladeira quebrada: ingredientes ×'+L.manutOf('geladeira').ingred+' ('+c1+' → '+c2+'); outro equipamento quebrado não mexe');
  g.quebras=[]; g.kitchen.clean=Infinity; g.usos={fogao:0,geladeira:0,cafeteira:0}; g.kitchen.plates=[null,null,null,null]; g.kitchen.cooking=[{group:null,table:1,time:1,p:0,dish:0}]; g.kitchen.update(2);
  ok(g.usos.fogao===1 && g.usos.geladeira===1 && g.usos.cafeteira===0,'prato pronto conta 1 uso no fogão e na geladeira'); }
{ novo(3000,7); g.startDay(2); g.begin(); g.sel=null;
  const ac0=g.bia.acts.length; const r1=g.tapStation('coffee',810,350);
  ok(r1!==false && g.bia.acts.length===ac0+1,'cafeteira funcionando: o toque entra na fila da Bia');
  g.bia.acts=[]; g.bia.hands=[]; quebra('cafeteira');
  ok(g.tapStation('coffee',810,350)===false && g.bia.acts.length===0,'cafeteira quebrada: o toque é recusado');
  ok(g.fx.some(f=>f.text==='Cafeteira parada!'),'aparece "Cafeteira parada!"');
  // Dani
  g.save.equipe=L.normSave({equipe:{dani:3,daniTasks:['pratos','lavar','lixo']}}).equipe; g.dani.reset();
  const t=g.tables[0]; t.group={seated:true,coffee:false,hearts:2,daniCoffee:false};
  g.quebras=[]; const d1=g.dani.coffeeTarget(); quebra('cafeteira'); const d2=g.dani.coffeeTarget();
  ok(d1===t && d2===null,'a Dani só pega café com a cafeteira funcionando'); t.group=null; }

// ---------- conserto pelo toque ----------
{ novo(1000,7); g.startDay(4); g.save.manut.sorteio=null; g.begin(); const B0=g.save.bank, eq=M.equip[0], bx=eq.badge.x+g.cam, by=eq.badge.y;
  ok(g.cam===260 || g.cam===L.CALCADA.w,'câmera na tela larga: tela = mundo + '+g.cam);
  g.onDown(bx,by,0); ok(g.conserto===0 && g.save.bank===B0,'plaquinha só existe com a quebra ativa: toque no mesmo lugar não conserta nada');
  g.quebras=[{id:'fogao',t:0,on:true,fixed:false}]; g.save.manut.fogao=0.1; g.save.manut.sorteio={d:4,clima:'',quebra:[{id:'fogao',f:0.2}]};
  const antes=g.lucro; g.onDown(bx+M.badge+30,by,0); ok(g.conserto===0 && g.quebrado('fogao'),'toque fora do círculo ('+(M.badge+30)+' px): nada');
  g.onDown(bx+4,by-3,0);
  ok(g.conserto===eq.emerg && !g.quebrado('fogao') && g.quebras[0].fixed && g.save.manut.fogao===1 && g.stats.consertos===1,'toque na plaquinha: fogão consertado (R$ '+eq.emerg+'), volta a 100%');
  ok(g.save.bank===B0-eq.emerg && g.save.caixaPend.man===eq.emerg,'sai do dinheiro acumulado na hora e vai para caixaPend.man');
  ok(near(g.lucro,antes-eq.emerg,1e-6),'entra no lucro do dia (fixo): '+antes.toFixed(0)+' → '+g.lucro.toFixed(0));
  ok(!g.save.manut.sorteio.quebra.some(q=>q.id==='fogao') && lerSave().manut.fogao===1,'tirado do sorteio e salvo (recomeçar o dia não quebra de novo)');
  g.onDown(bx,by,0); ok(g.conserto===eq.emerg,'não cobra duas vezes');
  g.money=500; g.finishDay();
  ok(g.save.bank===B0-eq.emerg+g.result.income && g.result.income===500-Math.round(g.custo)-g.contas-g.paid-g.paidDiv,'no fim do dia o conserto não sai de novo do banco');
  const row=g.save.caixa[g.save.caixa.length-1]; ok(row.man===eq.emerg && g.save.caixaPend.man===0,'linha do caixa do dia: manutenção '+row.man);
  ok(g.result.conserto===eq.emerg && g.result.consertos===1 && g.result.quebras[0].fixed,'resultado: conserto e quebra consertada');
  ok(g.save.manut.fogao===1,'consertado no dia: o desgaste não mexe (100%)'); }
{ // com o dedo (pad) um pouco fora
  novo(1000,7); g.startDay(4); g.begin(); const eq=M.equip[2]; g.quebras=[{id:'cafeteira',t:0,on:true,fixed:false}];
  g.onDown(eq.badge.x+g.cam+M.badge+10,eq.badge.y,24); ok(!g.quebrado('cafeteira') && g.conserto===eq.emerg,'com a folga do dedo (24 px), o toque perto da plaquinha conserta a cafeteira'); }
{ // sem dinheiro
  novo(M.equip[1].emerg-1,7); g.startDay(4); g.begin(); const eq=M.equip[1], B0=g.save.bank; g.quebras=[{id:'geladeira',t:0,on:true,fixed:false}];
  const ok1=g.consertar('geladeira'); ok(ok1===false && g.quebrado('geladeira') && g.conserto===0 && g.save.bank===B0 && g.save.caixaPend.man===0,'banco R$ '+B0+' < R$ '+eq.emerg+': recusa e não cobra nada');
  ok(g.fx.some(f=>f.text==='Falta dinheiro!'),'aparece "Falta dinheiro!"');
  const res=g.paid+g.paidDiv; g.save.bank=res+eq.emerg-1; ok(g.consertar('geladeira')===false,'a folha do dia fica reservada: o conserto só usa o que sobra (v8.2.2)');
  g.save.bank=res+eq.emerg; ok(g.consertar('geladeira') && g.save.bank===res,'com exatamente R$ '+eq.emerg+' além da folha, conserta');
  ok(g.consertar('cafeteira')===false && g.consertar('xx')===false,'consertar equipamento que não está quebrado ou não existe: false'); }

// ---------- revisão na lojinha ----------
{ const P=L.manutPreco, q=M.equip[0], esp=e=>Math.ceil((M.taxa+q.preco*(1-e))*(e<M.vermelho?M.urgente:1)/5)*5;
  ok(P('fogao',1)===0 && P('fogao',0.996)===0 && [0.9,0.7,0.5,0.2,0].every(e=>P('fogao',e)===esp(e)) && P('fogao',0.5)>P('fogao',0.9),'preço da revisão: taxa + desgaste, ×'+M.urgente+' no vermelho (fogão: 90%→'+P('fogao',0.9)+', 50%→'+P('fogao',0.5)+', 20%→'+P('fogao',0.2)+', 0%→'+P('fogao',0)+')');
  ok(P('fogao',0.99)>=M.taxa && P('fogao',0.41)*M.urgente>P('fogao',0.41) && P('fogao',0.39)>P('fogao',0.41)+q.preco*0.02 && P('cafeteira',0.5)%5===0,'a taxa pesa no quase novo, o vermelho encarece de uma vez e tudo é múltiplo de 5'); }
{ fixa(0); novo(1000,7,{fogao:0.3,geladeira:0.35,cafeteira:0.25}); g.startDay(4); solta();
  ok(g.quebras.length===3,'(sorteio de 3 quebras para o dia 4)');
  g.goShop(4); ok(g.state==='shop' && g.quebras.length===3 && g.save.manut.sorteio.d===4,'voltar à lojinha do mesmo dia mantém o sorteio');
  const B0=g.save.bank, p=L.manutPreco('fogao',0.3);
  ok(g.revisar('fogao') && g.save.manut.fogao===1 && g.save.bank===B0-p && g.save.caixaPend.man===p,'revisar o fogão: -R$ '+p+', volta a 100%, entra em caixaPend.man');
  ok(g.save.manut.sorteio.quebra.map(q=>q.id).join()==='geladeira,cafeteira' && g.quebras.map(q=>q.id).join()==='geladeira,cafeteira','a revisão tira a quebra já sorteada do fogão (save e dia)');
  ok(g.revisar('fogao')===false && g.save.bank===B0-p,'revisar de novo (já em dia): nada, não cobra');
  const rest=L.manutPreco('geladeira',0.35)+L.manutPreco('cafeteira',0.25);
  ok(g.revisarTudo() && g.save.manut.geladeira===1 && g.save.manut.cafeteira===1 && g.save.bank===B0-p-rest && g.save.caixaPend.man===p+rest && g.quebras.length===0,'revisarTudo: paga o resto (R$ '+rest+') e limpa as quebras');
  ok(g.revisarTudo()===false,'revisarTudo com tudo em dia: false');
  g.startDay(4); g.begin(); g.money=300; g.finishDay();
  const row=g.save.caixa[g.save.caixa.length-1]; ok(row.man===p+rest && g.save.caixaPend.man===0,'a linha do caixa do dia seguinte traz a manutenção (R$ '+row.man+')'); }
{ novo(30,7,{fogao:0.2,geladeira:1,cafeteira:1}); g.goShop(4);
  ok(g.revisar('fogao')===false && g.save.manut.fogao===0.2 && g.save.bank===30 && g.save.caixaPend.man===0,'sem dinheiro para a revisão: recusa'); 
  const c=L.manutPreco('cafeteira',0.5); novo(c+10,7,{fogao:0.2,geladeira:0.5,cafeteira:0.5}); g.goShop(4);
  ok(g.revisarTudo() && g.save.manut.cafeteira===1 && g.save.manut.fogao===0.2 && g.save.manut.geladeira===0.5 && g.save.bank===10,'revisarTudo com dinheiro curto paga o que der (sem ficar negativo)'); }

// ---------- aba Manutenção ----------
{ novo(1000,7,{fogao:0.3,geladeira:0.1,cafeteira:0.5}); g.goShop(5); L.setShopTab('manut'); { const c=els['shop-grid'].children; ok(/No vermelho: 50% de chance de quebrar no dia 5/.test(txt(c[0])) && /No limite: quebra no dia 5/.test(txt(c[1])) && /Só desgasta/.test(txt(c[2])),'aba Manutenção: vermelho 50%, limite quebra, amarelo só desgasta'); } }
{ novo(1000,7,{fogao:0.6,geladeira:1,cafeteira:0.5}); g.goShop(5); L.setShopTab('manut');
  const cs=els['shop-grid'].children; ok(cs.length===4,'aba Manutenção: 4 cartões (fogão, geladeira, cafeteira, revisar tudo) — '+cs.length);
  ok(/Fogão · 60%/.test(txt(cs[0])) && /Geladeira · 100%/.test(txt(cs[1])) && /Cafeteira · 50%/.test(txt(cs[2])) && /Revisar tudo/.test(txt(cs[3])),'títulos com o estado de cada um');
  const btn=c=>acha(c,e=>e.tagName==='BUTTON');
  ok(btn(cs[0]).textContent.indexOf(String(L.manutPreco('fogao',0.6)))>0 && btn(cs[1]).textContent==='Em dia' && btn(cs[1]).disabled,'botão com o preço; em dia fica desligado');
  const B0=g.save.bank; btn(cs[0]).fire('click'); ok(g.save.manut.fogao===1 && g.save.bank<B0,'clicar em "Revisão" revisa o fogão');
  const cs2=els['shop-grid'].children; btn(cs2[3]).fire('click'); ok(g.save.manut.cafeteira===1,'"Revisar tudo" revisa o resto');
  ok(/Tudo em dia/.test(btn(els['shop-grid'].children[3]).textContent),'depois, "Tudo em dia"'); }
{ novo(1000,7); g.goShop(2); L.setShopTab('manut'); ok(/Não quebra até o dia 4/.test(txt(els['shop-grid'].children[0])),'antes do dia 4 a aba diz que não quebra'); }

// ---------- chuva e feriado ----------
{ novo(3000,7); g.startDay(5); const dia=g.day, N=400;
  const media=(clima)=>{ g.clima=clima; let n=0,ent=0,fam=0,tot=0; for(let i=0;i<N;i++){ const s=g.buildSchedule(dia); n+=s.length; s.forEach(x=>{ tot++; if(x.type==='entregador') ent++; if(x.type==='familia') fam++; }); } return {n:n/N,ent:ent/tot,fam:fam/tot}; };
  const b=media(''), c=media('chuva'), f=media('feriado');
  ok(c.n<b.n*0.9 && near(c.n/b.n,L.CLIMA.chuva.groups,0.08),'chuva: menos grupos ('+b.n.toFixed(1)+' → '+c.n.toFixed(1)+', ×'+(c.n/b.n).toFixed(2)+')');
  ok(c.ent>b.ent+0.15,'chuva: mais entregadores ('+(b.ent*100).toFixed(0)+'% → '+(c.ent*100).toFixed(0)+'%)');
  ok(f.n>b.n*1.1 && near(f.n/b.n,L.CLIMA.feriado.groups,0.08),'feriado: mais grupos ('+b.n.toFixed(1)+' → '+f.n.toFixed(1)+', ×'+(f.n/b.n).toFixed(2)+')');
  ok(f.fam>b.fam+0.1,'feriado: mais famílias ('+(b.fam*100).toFixed(0)+'% → '+(f.fam*100).toFixed(0)+'%)');
  ok(near(L.CLIMA.chuva.chance+L.CLIMA.feriado.chance,0.22,0.2) && L.CLIMA.chuva.groups<1 && L.CLIMA.feriado.groups>1,'chuva e feriado raros (R$ '+(L.CLIMA.chuva.chance*100)+'% e '+(L.CLIMA.feriado.chance*100)+'%)');
  // sorteio do clima pela chance
  let ch=0,fe=0,K=2000; for(let i=0;i<K;i++){ novo(1000,7); g.startDay(5); if(g.clima==='chuva') ch++; else if(g.clima==='feriado') fe++; }
  ok(near(ch/K,L.CLIMA.chuva.chance,0.03) && near(fe/K,L.CLIMA.feriado.chance,0.03),'clima sorteado segue as chances ('+(ch/K*100).toFixed(1)+'% chuva, '+(fe/K*100).toFixed(1)+'% feriado)');
  ok(g.schedule.length>0,'dia com clima monta a fila'); }

// ---------- Turno sem fim ----------
fixa(0); novo(3000,7,{fogao:0,geladeira:0,cafeteira:0}); g.startEndless();
ok(g.mode==='semfim' && g.clima==='' && g.quebras.length===0,'Turno sem fim: sem clima e sem quebras, mesmo com tudo gasto e sorte máxima');
g.begin(); for(let i=0;i<400;i++){ bot(); g.update(0.05); }
solta(); g.usos={fogao:50,geladeira:50,cafeteira:50}; const m0=JSON.stringify(g.save.manut);
ok(g.quebras.length===0 && g.stats.quebras===0,'Turno sem fim: nada quebra durante o jogo');
g.desgastar(); ok(JSON.stringify(g.save.manut)===m0,'Turno sem fim: nada se gasta');
ok(g.consertar('fogao')===false,'Turno sem fim: nada para consertar');
fixa(0); g.startEndless(); solta(); ok(!g.save.manut.sorteio,'Turno sem fim não guarda sorteio');
ok(L.introManut()==='','Turno sem fim: sem texto de equipamentos na introdução');

// ---------- modo dev: de graça ----------
{ const H3=load({imprevistos:true,store:{lcc2_save:JSON.stringify({maxDay:4,bank:500})}}); const {g:d,L:l,els:e3}=H3;
  const tag=e3['vtag']; for(let i=0;i<10;i++) tag.fire('click');
  ok(l.DEV.on && d.save.bank===10000,'modo dev ligado (R$ 10.000)');
  d.save.manut.fogao=0.2; d.save.manut.geladeira=0.5; d.goShop(5);
  ok(d.revisar('fogao') && d.save.bank===10000 && d.save.manut.fogao===1 && d.save.caixaPend.man===0,'modo dev: revisão de graça (banco e caixa intactos)');
  ok(d.revisarTudo() && d.save.manut.geladeira===1 && d.save.bank===10000,'modo dev: revisar tudo de graça');
  d.save.bank=0; d.startDay(5); d.begin(); const q={id:'cafeteira',t:0,on:true,fixed:false}; d.quebras=[q];
  ok(d.consertar('cafeteira') && d.conserto===0 && d.save.bank===0 && q.fixed,'modo dev: conserto de graça (sem custo no lucro)'); }

// ---------- introdução ----------
{ novo(1000,7,{fogao:0.3,geladeira:1,cafeteira:0.1}); fixa(0.999); g.startDay(5); solta();
  const t=els['intro-manut'].textContent;
  ok(g.state==='intro' && /Equipamentos: Fogão 30% · Geladeira 100% · Cafeteira 10%/.test(t),'introdução mostra o estado: '+t.slice(0,70));
  ok(/Cafeteira vai quebrar hoje/.test(t) && /Fogão pode quebrar hoje/.test(t) && !/Geladeira (pode|podem|vai)/.test(t),'avisa o que vai quebrar (no limite) e o que pode (no vermelho)');
  fixa(0); novo(1000,7); g.startDay(5); solta(); ok(/Dia de chuva: vem menos gente/.test(els['intro-manut'].textContent),'chuva: o aviso está na introdução');
  novo(1000,7,{fogao:0.5}); g.startDay(2); ok(!/quebrar hoje/.test(els['intro-manut'].textContent) && /Equipamentos/.test(els['intro-manut'].textContent),'antes do dia 4: estado, sem aviso de quebra');
  const on=M.on; M.on=false; novo(1000,7); g.startDay(5); ok(els['intro-manut'].textContent==='','imprevistos desligados: introdução sem o texto'); M.on=on; }

// ---------- fim do dia ----------
{ fixa(0); novo(3000,7,{fogao:0.1,geladeira:1,cafeteira:1}); g.startDay(4); solta(); g.begin();
  while(g.elapsed<g.quebras[0].t+0.3) g.update(0.05); g.finishDay();
  ok(/Quebrou/.test(txt(els['end-stats'])),'fim do dia menciona a quebra'); }

solta();
console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
