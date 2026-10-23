// v8.3.8, preços de verdade: a conta é o cardápio (cada pessoa paga o prato e, às vezes, um 2º item); os corações viram
// gorjeta de até +10%; as ações da Bia (sentar, anotar, entregar, recolher, corrente, cor, caprichado) rendem pontos de
// atendimento, e não dinheiro; o cafezinho e o suco são pagos. Os pontos vão para o resultado e somam na campanha.
const H=require('./harness.js')(); const {g,L,els,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const P=L.PONTOS_ACAO, C=L.CARDAPIO;
const novo=()=>{ g.save=L.normSave({maxDay:7,bank:500}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const preco=k=>k?L.precoPrato(k):0;

// ---------- cardápio e conta ----------
ok(C.pf.preco===25 && C.misto.preco===12 && C.pastel.preco===10 && C.coxinha.preco===8,'cardápio da Garagem: PF 25, misto 12, pastel 10, coxinha 8');
ok(L.precoPrato('pf',{cardapio:1.5})===38,'o ponto multiplica o cardápio (PONTOS.cardapio)');
ok(L.GORJETA.join()==='0,-0.2,-0.1,0,0.05,0.1','gorjeta: até +10% com 5 corações; com 1 ou 2, desconto');
ok(Object.keys(L.CUSTOMER_TYPES).every(k=>{ const T=L.CUSTOMER_TYPES[k]; return !T.bill && T.prefere.every(d=>C[d]) && T.mais>=0 && T.mais<1; }),'cada tipo escolhe pratos do cardápio (sem faixa de conta) e tem a chance do 2º item');
novo(); g.startDay(5); g.begin();
{ let n=0, comExtra=0, okConta=true, okExtra=true;
  for(let i=0;i<400;i++){ const tp=['estudante','familia','vovos','executiva','entregador'][i%5], grp=new L.Group(g,tp,i,0,i%7===0);
    const soma=grp.dishes.concat(grp.extras).reduce((a,k)=>a+preco(k),0)+(grp.vip?L.VIP.dish:0);
    if(grp.bill!==soma) okConta=false;
    if(grp.extras.length!==grp.size || grp.extras.some(k=>k && L.MAIS.pratos.indexOf(k)<0)) okExtra=false;
    n+=grp.size; comExtra+=grp.extras.filter(Boolean).length; }
  ok(okConta,'a conta é a soma do que cada um pediu (e do prato especial do VIP)');
  ok(okExtra,'no máximo 2 itens por pessoa: o 2º é um salgado');
  ok(comExtra>0 && comExtra<n*0.5,'alguns pedem o 2º item ('+comExtra+' de '+n+' pessoas)'); }
{ const tr=new L.Group({mode:'treino',day:{},ponto:g.ponto,save:g.save},'vovos',1,0,false);
  ok(tr.extras.every(k=>!k) && tr.bill===tr.dishes.reduce((a,k)=>a+preco(k),0),'no treino ninguém pede o 2º item'); }

// ---------- cozinha: o 2º item demora mais e custa ingredientes ----------
{ const grp=g.spawn({type:'familia',color:0}); grp.extras=grp.extras.map((k,i)=>i<2?'pastel':null);
  const r=Math.random; Math.random=()=>0; g.kitchen.queue=[]; g.kitchen.submit({group:grp,table:1}); const t=g.kitchen.queue[0].time; Math.random=r;
  ok(Math.abs(t-4*(1+L.MAIS.cozinha*2/grp.size))<1e-9,'2 itens a mais numa mesa de '+grp.size+': a cozinha leva '+Math.round(L.MAIS.cozinha*2/grp.size*100)+'% a mais');
  g.kitchen.clean=Infinity; g.kitchen.queue[0].time=0.05; const c0=g.custo; for(let i=0;i<10;i++) g.kitchen.update(0.05);
  ok(g.custo-c0===Math.round(grp.bill*L.INGRED.prato),'ingredientes: '+Math.round(L.INGRED.prato*100)+'% da conta inteira'); }

// ---------- ações: pontos, não dinheiro ----------
novo(); g.startDay(5); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0;
{ const grp=g.spawn({type:'estudante',color:0}), t=g.tables.find(x=>x.free&&x.seats>=grp.size&&x.color!==0)||g.tables.find(x=>x.free&&x.seats>=grp.size);
  const p0=g.pontos; g.seatGroup(grp,t);
  ok(g.money===0 && g.pontos-p0===P.sit+(grp.color===t.color?P.cor:0),'sentar: '+P.sit+' pontos (e '+P.cor+' com a cor certa), sem dinheiro');
  grp.state='wantOrder'; g.lastKind=null; let p1=g.pontos; g.bia.hands=[]; g.bia.doTable(t);
  ok(grp.state==='ordered' && g.money===0 && g.pontos-p1===P.take,'anotar: '+P.take+' pontos');
  p1=g.pontos; g.bia.hands=[{kind:'dish',table:t.id,group:grp,dish:grp.dish,crit:true}]; g.bia.doTable(t);
  ok(grp.state==='eating' && g.money===0 && g.pontos-p1===P.deliver+L.CRIT.bonus,'entregar o caprichado: '+P.deliver+' + '+L.CRIT.bonus+' pontos');
  p1=g.pontos; g.bia.hands=[{kind:'coffee'}]; g.bia.doTable(t);
  ok(g.money===L.DRINK_PRICE.coffee && g.pontos-p1===P.coffee,'cafezinho: R$ '+L.DRINK_PRICE.coffee+' e '+P.coffee+' pontos');
  grp.setState('wantBill'); grp.hearts=5; grp.juiceWant=0; g.lastKind=null; const m0=g.money; p1=g.pontos; g.collectBill(grp,t);
  ok(g.money-m0===Math.round(grp.bill*1.1) && g.pontos-p1===P.bill,'conta com 5 corações: R$ '+Math.round(grp.bill*1.1)+' (+10%) e '+P.bill+' pontos');
  ok(g.fx.some(f=>/pts$/.test(f.text||'')) && g.fx.some(f=>/^\+R\$ /.test(f.text||'')),'na tela: "+N pts" para as ações e "+R$ N" para o que se paga'); }
{ g.lastKind=null; g.chainN=0; const p0=g.pontos, m0=g.money; for(let i=0;i<3;i++) g.score('clear',0,0);
  ok(g.money===m0 && g.pontos-p0===3*P.clear+10+20,'corrente de 3 recolhidas: '+(3*P.clear)+' + 10 + 20 pontos, sem dinheiro'); }

// ---------- resultado, campanha e HUD ----------
{ let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'HUD desenha os pontos'+(err?': '+err:''));
  const pts=Math.round(g.pontos); g.finishDay();
  ok(g.result.pontos===pts && g.save.pontosTot===pts,'o resultado guarda os pontos ('+pts+') e a campanha soma');
  g.hooks.state('dayend'); ok(new RegExp('Pontos de atendimento\\s*'+pts).test(els['end-stats'].children.map(b=>b.children.map(c=>c.textContent).join(' ')).join(' ')),'o fim do dia mostra os pontos de atendimento');
  ok(L.normSave({pontosTot:-5}).pontosTot===0 && L.normSave({}).pontosTot===0 && L.normSave({pontosTot:42}).pontosTot===42,'save: pontosTot nunca negativo; padrão 0'); }
// ---------- custos ----------
ok(L.CONTAS.base===20 && L.INGRED.prato===0.35 && L.DRINK_PRICE.coffee===3 && L.JUICE.price===8,'custos: gás e geladeira R$ 20/dia, ingredientes 35%, cafezinho R$ 3, suco R$ 8');
ok(L.payroll({tonhao:2,dani:3,tv:true,som:true})===95,'folha completa da Garagem: R$ 95 por dia');
ok(L.DAYS.map(d=>d.meta).join()==='60,200,150,100,150,150,180','metas de lucro realistas (R$ 60 a 200)');
// ---------- Como jogar ----------
{ let err=null; try{ els['btn-how'].fire('click'); }catch(e){ err=e; }
  const tips=JSON.stringify((els['tips'].children||[]).map(li=>(li.children||[]).map(c=>c.textContent)));
  ok(!err && /PF R\$ 25/.test(tips) && /pontos de atendimento/.test(tips),'Como jogar: os preços do cardápio e os pontos de atendimento'+(err?': '+err:'')); }

console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
