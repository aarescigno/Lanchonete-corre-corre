// v12.7: cardápio de verdade em cada ponto (pratos e preços por ponto, curso como técnica, sem PF no Terraço). Spec: docs/spec-v12.7.md. CA1 a CA8 (CA9 e CA10: balance.js e carreira.js; CA11: shot_v12_7.js).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TODOS=load().L.cursosAte();   // v12.10: todos os degraus de todos os pontos, no avançado
const mk=(ponto,cursos,extra)=>{ const H=load(), {L,g}=H;
  g.save=L.normSave(Object.assign({dia:10,maxDay:10,bank:9000,salao:{ponto},cursos:cursos||{}},extra||{})); g.up=g.save.up; g.buildTables(); g.startDay(10); g.begin(); g.schedule=[]; g.nextIdx=0; return {L,g,H}; };
const P=L=>Object.fromEntries(L.PONTOS.map(p=>[p.id,p]));
const TIPOS=['estudante','executiva','familia','vovos','entregador','negocios','casal'];
const grupos=(L,g,n,tipos)=>Array.from({length:n},(_,i)=>new L.Group(g,(tipos||TIPOS)[i%(tipos||TIPOS).length],++g.gid,0,false));
const pedidos=q=>q.dishes.concat(q.extras).filter(Boolean);

// CA1: nenhum prato sem preço por ponto; PONTOS sem o `cardapio`
{ const {L}=mk('garagem'), ids=L.PONTOS.map(p=>p.id);
  ok(L.PONTOS.every(p=>p.cardapio===undefined),'CA1: PONTOS não tem mais `cardapio`');
  ok(Object.keys(L.CARDAPIO).every(k=>{ const p=L.CARDAPIO[k].preco; return p && typeof p==='object' && Object.keys(p).length>0 && Object.keys(p).every(i=>ids.indexOf(i)>=0 && p[i]>0); }),'CA1: todo prato tem `preco` como objeto, com R$ por ponto');
  ok(Object.keys(L.CARDAPIO).every(k=>L.PONTOS.some(p=>L.vendeNoPonto(k,p))),'CA1: todo prato é vendido em algum ponto');
  ok(L.precoPrato('pf')===30 && L.precoPrato('pf',null,{})===30,'CA1: sem ponto, o preço é o da Garagem'); }

// CA2: Garagem e industrial são lanchonete, com os preços da tabela
{ const {L}=mk('garagem'), Pt=P(L);
  const lanche=Object.keys(L.CARDAPIO).filter(k=>L.CARDAPIO[k].cat!=='junina' && L.CARDAPIO[k].preco.industrial!=null), gar=lanche.filter(k=>L.CARDAPIO[k].preco.garagem!=null);
  ok(lanche.length===28 && gar.length===11 && Object.keys(L.CARDAPIO).filter(k=>L.CARDAPIO[k].cat!=='junina' && L.CARDAPIO[k].preco.garagem!=null).length===11,'CA2: 28 pratos de lanchonete na área industrial e 11 na Garagem (v12.10: 22 pratos nos dois até a v12.9.1; 11 saíram da Garagem e 6 de estrada entraram) ('+lanche.length+', '+gar.length+')');
  ok(L.pratosSabidos({},Pt.garagem).join()==='pf,coxinha' && L.pratosSabidos({},Pt.industrial).join()==='pf,coxinha','CA2: sem curso, a lanchonete sabe o PF e a coxinha');
  const sab=L.pratosSabidos(TODOS,Pt.industrial); ok(sab.length===28 && sab.every(k=>lanche.indexOf(k)>=0) && L.pratosSabidos(TODOS,Pt.garagem).length===11,'CA2: com todos os cursos, só os 28 pratos da área industrial e os 11 da Garagem (nada da Avenida nem do Terraço)');
  const T={ pf:[30,34], coxinha:[10,11], risoles:[7,8], kibe:[8,9], bolinho:[10,11], empada:[null,12], esfihaA:[null,9], esfihaF:[null,9], misto:[12,13], bauru:[14,16], paoChapa:[8,9], pastel:[12,13], pastelQ:[12,13], pastelP:[13,15], pfVeg:[null,32], pfVegano:[null,32], empadaPalmito:[null,12], kibeAbobora:[null,9], coxinhaJaca:[null,11], pastelPalmito:[null,13], esfihaSoja:[null,9], mistoVegano:[null,13], pastelFrango:[null,14], pastelCarneSeca:[null,16], xSalada:[null,16], xTudo:[null,21], enroladinho:[null,8], bolinhoCarneSeca:[null,12] };   // null: a Garagem não vende (v12.10)
  const err=Object.keys(T).filter(k=>(T[k][0]==null ? L.vendeNoPonto(k,Pt.garagem) : L.precoPrato(k,Pt.garagem,{})!==T[k][0]) || L.precoPrato(k,Pt.industrial,{})!==T[k][1]);
  ok(err.length===0 && L.precoPrato('pf',Pt.industrial,{})===34,'CA2: os preços batem com a tabela da Garagem e da industrial'+(err.length?' (erros: '+err.join()+')':'')); }

// CA3: Avenida sem curso nenhum
{ const {L,g}=mk('avenida'), vistos={};
  ok(L.pratosSabidos({},g.ponto).join()==='execFrango,strogonoff,mandioca','CA3: a Avenida sem curso sabe o executivo de frango, o strogonoff e a mandioca');
  const qs=grupos(L,g,200); qs.forEach(q=>pedidos(q).forEach(k=>{ vistos[k]=(vistos[k]||0)+1; }));
  ok(Object.keys(vistos).every(k=>['execFrango','strogonoff','mandioca'].indexOf(k)>=0) && vistos.execFrango>0 && vistos.strogonoff>0 && vistos.mandioca>0,'CA3: em 200 grupos, só o executivo, o strogonoff e a mandioca ('+JSON.stringify(vistos)+')');
  ok(!vistos.pf && !vistos.coxinha && !vistos.pastel,'CA3: nenhum PF, coxinha ou pastel'); }

// CA4: Terraço com todos os cursos
{ const {L,g}=mk('terraco',TODOS), vistos={}; let tempos=0;
  const qs=grupos(L,g,200,['casal','familia','vovos','negocios','executiva']); qs.forEach(q=>{ if(q.tempos) tempos++; pedidos(q).forEach(k=>{ vistos[k]=(vistos[k]||0)+1; }); });
  const ruins=['pf','pfVeg','pfVegano','parmegiana','coxinha','pastel','pastelQ','pastelP'].filter(k=>vistos[k]);
  ok(tempos===200 && ruins.length===0,'CA4: no Terraço, em 200 grupos, nenhum PF, PF vegetariano, parmegiana, coxinha ou pastel'+(ruins.length?' ('+ruins.join()+')':''));
  ok(Object.keys(vistos).every(k=>L.vendeNoPonto(k,g.ponto)),'CA4: tudo que se pede tem preço no Terraço');
  ok(qs.every(q=>q.dishes.every(k=>L.CARDAPIO[k].cat==='pf')),'CA4: o principal sai dos pratos `cat:\'pf\'` do Terraço');
  ok(!L.pratoSabido('parmegiana',TODOS,g.ponto) && L.pratoSabido('vinho',TODOS,g.ponto) && L.CARDAPIO.vinho.preco.terraco===92,'CA4: a parmegiana sai do Terraço; o filé ao molho de vinho (R$ 92) entra pelo mesmo curso'); }

// CA5: o curso é técnica
{ const {L}=mk('garagem'), Pt=P(L), C={ fritos:{ garagem:1, avenida:1, terraco:1 } }, A={ fritos:{ garagem:2, avenida:2, terraco:2 } };
  ok(L.pratoSabido('isca',C,Pt.avenida) && !L.pratoSabido('isca',{},Pt.avenida) && L.pratoSabido('croquete',C,Pt.terraco) && !L.pratoSabido('croquete',{},Pt.terraco) && L.pratoSabido('risoles',C,Pt.garagem),'CA5: com só o curso de fritos, a Avenida sabe a isca, o Terraço o croquete e a lanchonete o risoles');
  ok(!L.pratoSabido('isca',C,Pt.garagem) && !L.pratoSabido('risoles',C,Pt.avenida),'CA5: o prato só vale no ponto que o vende');
  ok(L.precoPrato('isca',Pt.avenida,C)===36 && L.precoPrato('isca',Pt.avenida,A)===Math.round(36*1.15) && L.precoPrato('croquete',Pt.terraco,A)===Math.round(38*1.15) && L.precoPrato('mandioca',Pt.avenida,A)===Math.round(26*1.15),'CA5: o avançado de fritos sobe em 15% o preço da isca, do croquete e da mandioca');
  ok(L.precoPrato('execFrango',Pt.avenida,{})===39 && L.pratoAv('execFrango',{ pf:{ avenida:2 } },Pt.avenida) && L.precoPrato('execFrango',Pt.avenida,{ pf:{ avenida:2 } })===Math.round(39*1.15) && L.pratoAv('strogonoff',{ pf:{ avenida:2 } },Pt.avenida) && !L.pratoAv('strogonoff',{},Pt.avenida),'CA5: o avançado do PF vale para o executivo e o strogonoff');
  ok(L.precoPrato('moquecaBanana',Pt.avenida,{ veg:{ avenida:2, terraco:2 } })===42 && L.precoPrato('curry',Pt.terraco,{ veg:{ avenida:2, terraco:2 } })===62,'CA5: os veganos do avançado não sobem o preço (semAv)'); }

// CA6: prato de base do ponto
{ const {L}=mk('garagem'), Pt=P(L);
  ok(L.pratoBase(Pt.garagem)==='pf' && L.pratoBase(Pt.industrial)==='pf' && L.pratoBase(Pt.avenida)==='execFrango' && L.pratoBase(Pt.terraco)==='galeto' && L.fritoBase(Pt.avenida)==='mandioca' && L.fritoBase(Pt.terraco)==='dadinho' && L.fritoBase(Pt.garagem)==='coxinha','CA6: o prato de base e o frito de base de cada ponto');
  const A=mk('avenida').g, T=mk('terraco').g, G=mk('garagem').g;
  ok(L.pedePrincipal('negocios',A,true)==='execFrango' && L.pedePrincipal('casal',T,true)==='galeto' && L.pedePrincipal('negocios',G,true)==='pf','CA6: o vegetariano sem opção cai no prato de base do ponto (a marmita da Avenida é o executivo de frango)');
  let semOp=true; for(let i=0;i<60;i++){ if(L.pedePrato('executiva',A,true,true)!=='mandioca' && L.pedePrato('executiva',A,true,true)!==null) semOp=false; }
  ok(semOp,'CA6: o 2º item do vegetariano na Avenida é a mandioca frita (vegana)'); }

// CA7: bebidas, doces e barraca junina, por ponto
{ const {L}=mk('garagem'), Pt=P(L), ids=['garagem','industrial','avenida','terraco'];
  ok(ids.map(i=>L.cafePreco(Pt[i])).join()==='4,4,6,8' && ids.map(i=>L.sucoPreco(Pt[i])).join()==='8,9,12,18','CA7: cafezinho 4/4/6/8 e suco da mesa 8/9/12/18');
  ok(ids.map(i=>L.bebidaOf(Pt[i]).preco).join()==='0,8,9,24','CA7: bebida da espera: água 0, suco 8, saborizada 9, coquetel 24');
  ok(L.cafePrecoDe('espresso',Pt.industrial)===8 && L.cafePrecoDe('cappuccino',Pt.avenida)===12 && L.cafePrecoDe('espresso',Pt.terraco)===10 && L.cafePrecoDe('cappuccino',Pt.terraco)===15 && L.cafePrecoDe('prensa',Pt.terraco)===24 && L.cafePrecoDe('coado',Pt.terraco)===24,'CA7: espresso e cappuccino 8/12 (10/15 no Terraço) e cafés especiais 24');
  ok(L.docePreco({})===9 && L.docePreco({ confGourmet:true })===22 && L.docePreco({ confAlta:true })===44,'CA7: doce caseiro 9, gourmet 22, alta confeitaria 44');
  ok(L.drinkPreco({})===42 && L.drinkPreco({ coqAutor:true })===56,'CA7: drink clássico 42 e de autor 56');
  const J=L.EVENTOS.junina, tab={ garagem:[40,{pamonha:10,milho:8,canjica:9}], industrial:[40,{pamonha:10,milho:8,canjica:9}], avenida:[80,{curau:14,milhoCoalho:16,bolo:14}], terraco:[150,{cremeMilho:26,pamonhaMel:24,canjicaCoco:26}] };
  ids.forEach(i=>{ const {g}=mk(i), t=tab[i];
    ok(g.barracaPreco()===t[0] && J.pratos[i].join()===Object.keys(t[1]).join() && Object.keys(t[1]).every(k=>L.precoPrato(k,Pt[i],{})===t[1][k]),'CA7: barraca junina '+i+': R$ '+t[0]+' e os pratos '+Object.keys(t[1]).join('/')); });
  ok(J.nomeBarraca.avenida==='Arraiá da Avenida' && J.nomeBarraca.terraco==='Arraiá do Terraço','CA7: Arraiá da Avenida e Arraiá do Terraço'); }

// CA8: um save da v12.6.1 no Terraço (sem campo novo) carrega e o cardápio do dia é do Terraço
{ const {L,g}=mk('terraco',{ fritos:{ terraco:1 }, assados:{ terraco:1 }, pastel:{ terraco:1 } });
  ok(g.ponto.id==='terraco' && L.pratosSabidos(g.save.cursos,g.ponto).indexOf('croquete')>=0 && L.pratosSabidos(g.save.cursos,g.ponto).indexOf('empadinhaCam')>=0,'CA8: no Terraço, com os cursos feitos, a cozinha já sabe os pratos novos pelas técnicas');
  const vistos={}; grupos(L,g,150,['casal','familia','vovos','negocios','executiva']).forEach(q=>pedidos(q).forEach(k=>{ vistos[k]=1; }));
  ok(Object.keys(vistos).length>0 && Object.keys(vistos).every(k=>L.vendeNoPonto(k,g.ponto)) && !vistos.pf,'CA8: o cardápio do dia é do Terraço ('+Object.keys(vistos).join()+')');
  ok(JSON.stringify(Object.keys(g.save.cursos).sort())===JSON.stringify(['assados','fritos','pastel']),'CA8: o save não ganhou campo novo de curso'); }
console.log(fails?`${fails}/${total} FALHARAM`:`TODOS OK (${total})`);
process.exit(fails?1:0);
