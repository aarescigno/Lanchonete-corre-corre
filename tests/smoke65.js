// v10.3, etapa 4a-4: o salão e o bar do Terraço. Cami (curso de salão, nível 4, "Ajuda em tudo"), Joca (cafés especiais: coado, prensa e cold brew) e Anselmo
// (coquetelaria clássica e de autor, o carrinho de boas-vindas do foyer). (O plano chamava de smoke63; o número já era do modo dev, D-1.)
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,ponto,sv,o)=>{ const H=nova(o), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:9000, v10:1, up:{ tenis:true }, equipe:{ tonhao:1, dani:2 }, salao:{ ponto:ponto||'terraco' }, convCard:1, convDiv:1 }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const CUR={ agil:1, mesa:1, salao:1 };
const EQ={ tonhao:2, dani:3, joca:3, cami:4, camiModo:'tudo', anselmo:2 };
const aberto=(sv)=>{ const H=jogo(9,'terraco',Object.assign({ pontoDia:5, equipe:EQ, camiCursos:CUR, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2 } },sv||{})), {g}=H;
  g.begin(); g.tables.forEach(t=>{ t.open=true; }); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); return H; };
const grupo=(H,t,estado)=>{ const {g,L}=H; const m=new L.Group(g,'executiva',++g.gid,0,false); m.juiceWant=0; m.cafePede=false; m.drinks=[]; m.size=Math.min(m.size,t.seats); m.people=m.people.slice(0,m.size); m.dishes=m.dishes.slice(0,m.size);
  t.group=m; m.table=t; m.setState(estado||'wantOrder'); m.hearts=4; g.groups.push(m); return m; };
const roda=(H,seg,fn)=>{ const {g}=H; for(let i=0;i<seg*20;i++){ g.update(0.05); if(fn) fn(); } };

// ---------- 1. o curso de salão e o nível 4 da Cami ----------
{ const {L}=nova(), S=L.STAFF.cami.levels[4], c=L.CAMI_CURSOS.find(x=>x.id==='salao');
  ok(c && c.nome==='Atendimento de salão' && c.preco===900 && c.nivel===4 && c.dep==='mesa','CAMI_CURSOS: Atendimento de salão, R$ 900, nível 4, depois do de mesa');
  ok(S && S.speed===1.35 && S.tasks===4 && S.pay===160 && S.mesas===true && S.tudo===true && L.STAFF.cami.levels.length===5,'nível 4 da Cami: rapidez 1,35, 4 tarefas, R$ 160 (v10.5), mesas e "Ajuda em tudo"');
  ok(L.CAMI_TUDO.espera===3,'CAMI_TUDO.espera = 3 s');
  ok(L.camiNivelCursos({ camiCursos:{ agil:1, mesa:1, salao:1 } })===4 && L.camiNivelCursos({ camiCursos:{ salao:1 } })===1,'o nível pelos cursos: 4 com os três, e o de salão sozinho não conta');
  let H=jogo(9,'terraco',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:3 }, camiCursos:{ agil:1, mesa:1 }, libera:{ cami:2 } }), g=H.g;
  ok(g.buyCamiCurso('salao') && g.save.camiCursos.salao===1 && g.save.equipe.cami===4 && g.save.bank===9000-900,'no Terraço: o curso de salão custa R$ 900 e leva a Cami ao nível 4');
  H=jogo(9,'terraco',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:2 }, camiCursos:{ agil:1 }, libera:{ cami:2 } }); ok(!H.g.buyCamiCurso('salao'),'sem o curso de mesa, o de salão não se compra');
  H=jogo(8,'avenida',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:3 }, camiCursos:{ agil:1, mesa:1 }, libera:{ cami:2 } }); ok(!H.g.buyCamiCurso('salao'),'na Avenida, o curso de salão não aparece');
  ok(H.L.normSave({ equipe:{ cami:4 }, salao:{ ponto:'avenida' } }).equipe.cami===3 && H.L.normSave({ equipe:{ cami:4 }, salao:{ ponto:'terraco' } }).equipe.cami===4,'normEquipe: o nível 4 só vale no Terraço');
  H=jogo(9,'terraco',{ pontoDia:5, equipe:EQ, camiCursos:CUR, libera:{ cami:2 } }); g=H.g;
  ok(g.setCamiModo('tudo') && g.save.equipe.camiModo==='tudo' && g.save.equipe.camiModo!=='tarefas' && H.L.camiModoTudo(g.save),'o modo "Ajuda em tudo" liga');
  const H3=jogo(9,'terraco',{ pontoDia:5, equipe:Object.assign({},EQ,{ cami:3, camiModo:'tarefas' }), camiCursos:{ agil:1, mesa:1 }, libera:{ cami:2 } }); ok(!H3.g.setCamiModo('tudo') && !H3.L.camiModoTudo(H3.g.save),'sem o nível 4, o modo não liga');
  H.L.setShopGrupo('equipe'); H.L.setShopTab('cami'); const t=txt(H.els['shop-grid']||H.doc.getElementById('shop-grid')||{});
  ok(/Ajuda em tudo/.test(t) && /Minhas mesas/.test(t) && /Tarefas/.test(t),'o cartão da Cami tem os 3 modos'); }

// ---------- 2. "Ajuda em tudo" ----------
{ const H=aberto(), {g,L}=H; const t1=g.tables[0], t2=g.tables[1];
  ok(g.cami.tudoModo && !g.cami.mesasModo && L.donoBasico(g)==='joca' && g.cami.tasks.length===0,'a Cami em "Ajuda em tudo": sem tarefas básicas, e o básico volta para o Joca');
  const m1=grupo(H,t1,'wantOrder'); m1.stateT=0;
  g.bia.acts=[]; g.bia.hands=[]; g.cami.phase='idle'; g.cami.thinkT=0;
  roda(H,2.2); ok(m1.state==='wantOrder' && !g.cami.plan,'antes de 3 s de espera, ela não pega o pedido');
  roda(H,3); ok(m1.state!=='wantOrder' || g.cami.plan,'depois de 3 s numa mesa qualquer (não marcada), ela vai anotar');
  // a Bia na fila de ações da mesa: a Cami não mexe
  const H2=aberto(), g2=H2.g, m2=grupo(H2,g2.tables[2],'wantOrder'); m2.stateT=10;
  g2.bia.enqueue({ type:'table', id:g2.tables[2].id }); g2.cami.thinkT=0; g2.cami.think();
  ok(!(g2.cami.plan && g2.cami.plan.t===g2.tables[2]),'a mesa que está na fila da Bia, a Cami deixa');
  // conta e louça suja
  const H3=aberto(), g3=H3.g, m3=grupo(H3,g3.tables[0],'wantBill'); m3.stateT=4; g3.cami.thinkT=0; g3.cami.think();
  ok(g3.cami.plan && g3.cami.plan.type==='conta' && g3.cami.plan.t===g3.tables[0] && !m3.cami,'ela cobra a conta que espera há 3 s ou mais, sem marcar o grupo (a Bia ainda pode pegar o prato)');
  const H4=aberto(), g4=H4.g, tb=g4.tables[1]; tb.dirty=true; tb.dirtyN=1; tb.sujaT=1; g4.cami.thinkT=0; g4.cami.think(); ok(!g4.cami.plan,'mesa suja há 1 s: ainda não');
  tb.sujaT=3.5; g4.cami.thinkT=0; g4.cami.think(); ok(g4.cami.plan && g4.cami.plan.type==='clear' && g4.cami.plan.t===tb,'suja há mais de 3 s: ela recolhe a louça');
  // o prato pronto: a Cami busca o antigo; a Bia pode pegar outro; o que a Cami busca é "da Cami"
  const H5=aberto(), g5=H5.g, m5=grupo(H5,g5.tables[0],'ordered'), m6=grupo(H5,g5.tables[1],'ordered');
  const mk=(grp,age)=>({ id:++g5.gid, group:grp, table:grp.table, dish:'pf', age, q:1, crit:false, tempo:0, casa:false, slot:0 });
  const p1=mk(m5,4), p2=mk(m6,1); g5.kitchen.plates[0]=p1; g5.kitchen.plates[1]=p2; p2.slot=1;
  g5.cami.thinkT=0; g5.cami.think();
  ok(g5.cami.plan && g5.cami.plan.type==='pegaPrato' && g5.cami.plan.p===p1 && p1.camiVai===true && !m5.cami,'ela busca o prato pronto há mais de 3 s (o do prato antigo)');
  g5.bia.acts=[{ type:'plate', pid:p1.id }]; g5.bia.phase='do'; g5.bia.doing=g5.bia.acts[0]; g5.bia.perform(g5.bia.acts[0]);
  ok(g5.kitchen.plates[0]===p1,'a Bia não leva o prato que a Cami já foi buscar ("É da Cami!")');
  const ok2=g5.bia.enqueue({ type:'plate', pid:p2.id }); ok(ok2 && !p2.camiVai,'a Bia pode pegar qualquer outro prato');
  // sem o nível 4 / modo "tarefas", nada disso
  const H6=aberto({ equipe:Object.assign({},EQ,{ camiModo:'tarefas' }) }), g6=H6.g; grupo(H6,g6.tables[0],'wantOrder').stateT=10; g6.cami.thinkT=0; g6.cami.think();
  ok(!g6.cami.tudoModo && !(g6.cami.plan && g6.cami.plan.type==='anota'),'no modo "Tarefas", a Cami não ajuda nas mesas'); }

// ---------- 3. cafés especiais do Joca ----------
{ const {L}=nova(), c=L.JOCA_CURSOS.find(x=>x.id==='cafesEsp');
  ok(c && c.nome==='Cafés especiais' && c.preco===600 && c.nivel===4 && c.dep==='espresso' && c.item===true,'JOCA_CURSOS: Cafés especiais, R$ 600, nível 4, depende do espresso, com item');
  const M=L.CAFES.metodos;
  ok(M.length===3 && M.every(m=>m.preco===20) && M.map(m=>m.id).join()==='coado,prensa,coldbrew' && M[0].prep===2.5 && M[1].prep===3.5 && M[2].prep===1 && M.map(m=>m.etapas).join()==='2,3,1' && L.CAFES.ingredEsp===5,'coado 2,5 s (2 etapas), prensa 3,5 s (3), cold brew 1 s (1): R$ 20, ingrediente R$ 5');
  ok(L.cafesLista({})===L.CAFES.lista && L.cafesLista({ cafesEsp:true })===M && L.cafeIngred({})===2 && L.cafeIngred({ cafesEsp:true })===5,'sem o curso, os cafés são os de sempre (R$ 8 e R$ 12)');
  ok(L.cafeIdx('espresso')===0 && L.cafeIdx('cappuccino')===1 && L.cafeIdx('coado')===2 && L.cafeIdx('prensa')===3 && L.cafeIdx('coldbrew')===4,'ícones: 0 espresso, 1 cappuccino, 2 coado, 3 prensa, 4 cold brew');
  let H=jogo(9,'terraco',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:2, anselmo:2 }, libera:{ joca:2, confeitaria:2 } }), g=H.g;
  ok(!g.buyJocaCurso('cafesEsp'),'sem o espresso, os cafés especiais não se compram');
  ok(g.buyJocaCurso('espresso') && !g.buyJocaCurso('cafesEsp'),'um curso do Joca por lojinha'); g.save.jocaCursoDia=0;
  ok(g.buyJocaCurso('cafesEsp') && g.up.cafesEsp===true && g.save.jocaCursos.cafesEsp===1 && g.save.bank===9000-350-600,'depois do espresso: R$ 600 e a bancada ganha os métodos');
  H=jogo(8,'avenida',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:2 }, jocaCursos:{ espresso:1 }, libera:{ joca:2, confeitaria:2 } }); ok(!H.g.buyJocaCurso('cafesEsp'),'na Avenida, os cafés especiais não aparecem');
  H=aberto({ jocaCursos:{ espresso:1, cafesEsp:1 } }); g=H.g; ok(g.up.espresso && g.up.cafesEsp,'save com os dois cursos: espresso e cafés especiais ligados');
  const ids=new Set(); for(let i=0;i<200;i++){ const m=new H.L.Group(g,'executiva',++g.gid,0,false); m.sorteiaCafes().forEach(id=>ids.add(id)); }
  ok(ids.size>0 && [...ids].every(id=>['coado','prensa','coldbrew'].indexOf(id)>=0),'os pedidos de café passam a ser os três métodos');
  ok(H.L.cafeDe('prensa').preco===20 && H.L.cafeDe('espresso').preco===8,'preços: R$ 20 o especial, R$ 8 o espresso');
  // as etapas no anel: a Bia fazendo o café
  g.bia.phase='do'; g.bia.doing={ type:'espresso', item:'prensa' }; g.bia.timer=3.5*0.4; const w=H.L.espressoTrabalho(g);
  ok(w && w.cafe.etapas===3 && Math.abs(w.f-0.6)<0.01,'o anel da bancada: 3 etapas e o progresso do café que está sendo feito');
  const cv=H.doc.createElement('canvas'); let erro=null; try{ H.L.drawCafesEsp(H.ctx,g,1); H.L.render(g,H.ctx); }catch(e){ erro=e; } ok(!erro,'a bancada dos cafés desenha sem erro'+(erro?': '+erro.message:'')); g.bia.phase='idle'; g.bia.doing=null;
  const H7=aberto({ jocaCursos:{ espresso:1 } }); ok(!H7.g.up.cafesEsp && H7.L.cafesLista(H7.g.up)===H7.L.CAFES.lista,'só com o espresso, a lista é a de sempre');
  const S1=H.L.normSave({ jocaCursos:{ cafesEsp:1 }, salao:{ ponto:'terraco' } }); ok(!S1.up.cafesEsp && !S1.jocaCursos.espresso===true || !S1.up.cafesEsp,'o curso dos cafés sem o espresso não liga nada'); }

// ---------- 4. coquetelaria do Anselmo ----------
{ const {L}=nova(), A=L.ANSELMO_CURSOS, D=L.DRINKS;
  ok(A.length===2 && A[0].id==='classica' && A[0].preco===500 && A[0].nivel===4 && A[1].id==='autor' && A[1].preco===800 && A[1].dep==='classica' && A[1].item===true,'ANSELMO_CURSOS: clássica R$ 500 e de autor R$ 800 (depois da clássica, com item), nível 4');
  ok(D.vagas===2 && D.vagasClassica===4 && D.prepClassica===0.8 && D.precoAutor===35 && D.ingredAutor===9 && D.autor.map(d=>d.nome).join('|')==='Neblina da Serra|Jardim do Terraço|Ouro da Casa','DRINKS: 4 vagas e 20% mais rápido; autor a R$ 35 (ingrediente R$ 9): Neblina da Serra, Jardim do Terraço, Ouro da Casa');
  ok(L.drinkVagas({})===2 && L.drinkVagas({ coqClassica:true })===4 && Math.abs(L.drinkPrep({ coqClassica:true })-3.2)<1e-9 && L.drinkPrep({})===4 && L.drinkPreco({})===22 && L.drinkPreco({ coqAutor:true })===35 && L.drinkIngred({ coqAutor:true })===9,'as funções: vagas, preparo, preço e ingrediente por curso');
  ok(L.drinkIdx('neblina')===3 && L.drinkIdx('jardim')===4 && L.drinkIdx('ouro')===5 && L.drinkIdx('por')===0,'ícones dos drinks: 3 a 5 os de autor');
  let H=jogo(9,'terraco',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:2, anselmo:2 }, libera:{ joca:2, confeitaria:2, anselmo:2 } }), g=H.g;
  ok(!g.buyAnselmoCurso('autor'),'a de autor não se compra antes da clássica');
  ok(g.buyAnselmoCurso('classica') && g.up.coqClassica===true && g.save.bank===9000-500 && !g.buyAnselmoCurso('autor'),'a clássica: R$ 500; um curso do Anselmo por lojinha'); g.save.anselmoCursoDia=0;
  ok(g.buyAnselmoCurso('autor') && g.up.coqAutor===true && g.up.maquina===true && g.save.equipe.anselmo===3 && g.save.bank===9000-500-800,'a de autor: R$ 800, sobe o Anselmo ao nível 3 (R$ 130) e liga o carrinho');
  ok(H.L.STAFF.anselmo.levels[3].pay===150 && H.L.STAFF.anselmo.levels[3].speed===1.0,'o nível 3 dele: rapidez 1,0 e R$ 150 (v10.5)');
  H=jogo(8,'avenida',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:2, anselmo:2 }, libera:{ joca:2, confeitaria:2, anselmo:2 } }); ok(!H.g.buyAnselmoCurso('classica'),'na Avenida, os cursos do Anselmo não aparecem');
  H=jogo(9,'terraco',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:2, anselmo:2 }, anselmoCursos:{ classica:1, autor:1 }, libera:{ joca:2, confeitaria:2, anselmo:2 } }); g=H.g;
  ok(g.up.coqClassica && g.up.coqAutor && g.up.maquina===true,'o save com os dois cursos liga os drinks de autor e o carrinho');
  g.begin(); g.mode='carreira'; g.tables.forEach(t=>{ t.open=true; });
  ok(g.anselmoAtivo,'o Anselmo trabalha no Terraço');
  const ids=new Set(); for(let i=0;i<60;i++){ const m=new H.L.Group(g,'executiva',++g.gid,0,false); (m.drinks||[]).forEach(id=>ids.add(id)); m.sorteiaDrinks().forEach(id=>ids.add(id)); }
  ok(ids.size>0 && [...ids].every(id=>['neblina','jardim','ouro'].indexOf(id)>=0),'os pedidos de drink passam a ser os de autor');
  g.drinkJob=null; g.drinkQ=[{ grp:{}, id:'neblina' },{ grp:{}, id:'ouro' }]; g.drinkPronto=[]; g.drinkUpdate(0.01); ok(g.drinkJob && g.drinkJob.id==='neblina','o 1º pedido entra no preparo');
  g.drinkJob.t=0; g.drinkUpdate(3.3 / H.L.STAFF.anselmo.levels[g.save.equipe.anselmo].speed); ok(g.drinkPronto.length===1,'pronto em 3,2 s (20% mais rápido que os 4 s)');
  g.drinkQ=[{grp:{},id:'a'},{grp:{},id:'b'},{grp:{},id:'c'},{grp:{},id:'d'}]; g.drinkPronto=[{id:'neblina'},{id:'ouro'},{id:'jardim'}]; g.drinkJob=null; g.drinkUpdate(0.01); ok(g.drinkJob,'com a clássica, o balcão aguenta 3 copos prontos (4 vagas)');
  const gr={ drinksDados:0, bebConta:0, gain(){}, notaBeb(){}, drinksFalta:0 }; const c0=g.custo, b0=gr.bebConta; g.entregaDrinks(gr,2,100,100);
  ok(gr.bebConta-b0===70 && Math.round(g.custo-c0)===18,'cada drink de autor entra na conta a R$ 35 (ingrediente R$ 9)'); }

// ---------- 5. o carrinho de boas-vindas ----------
{ const {L}=nova(), P=L.PONTOS[3];
  ok(P.bebida==='coquetel' && L.BEBIDA_ESPERA.coquetel.preco===18 && L.BEBIDA_ESPERA.coquetel.ingred===5 && L.BEBIDA_ESPERA.coquetel.prep===3 && L.BEBIDA_ESPERA.coquetel.take===0.5 && L.BEBIDA_ESPERA.coquetel.fim==='Coquetéis de boas-vindas','BEBIDA_ESPERA.coquetel: R$ 18, ingrediente R$ 5, 3 s, "Coquetéis de boas-vindas"');
  ok(L.BEBIDA_ESPERA.coquetel.pede(1)==='Um coquetel, por favor!' && L.BEBIDA_ESPERA.coquetel.pede(2)==='2 coquetéis, por favor!','as falas no molde das águas');
  const H=aberto({ anselmoCursos:{ classica:1, autor:1 } }), g=H.g;
  ok(g.up.maquina===true && g.bebida.id==='coquetel' && g.anselmoAtivo && g.maquinaOn,'com o curso e o Anselmo no dia, o carrinho serve');
  ok(JSON.stringify(H.L.STATIONS.maquina.rect)==='{"x":-94,"y":98,"w":90,"h":80}' && JSON.stringify(H.L.STATIONS.maquina.ap)==='{"x":16,"y":156}','a estação mudou de lugar no Terraço: alto do foyer');
  g.save.equipe.anselmoFora=true; ok(!g.maquinaOn,'sem o Anselmo no dia (cortado da folha), o carrinho fica parado');
  g.save.equipe.anselmoFora=false;
  const H2=aberto({ anselmoCursos:{ classica:1 } }); ok(!H2.g.up.maquina && !H2.g.maquinaOn,'só com a clássica, não há carrinho');
  const Hg=nova(); const gg=Hg.g; gg.begin(); ok(JSON.stringify(Hg.L.STATIONS.maquina.rect)==='{"x":-110,"y":452,"w":62,"h":84}' && gg.bebida.id==='agua','fora do Terraço, a estação volta ao lugar de antes (a torneira da Garagem)');
  const H3=aberto({ anselmoCursos:{ classica:1, autor:1 } }); ok(!H3.g.buy('maquina') && H3.g.maquinaOn,'buy("maquina") segue recusado no Terraço (o carrinho vem do curso)');
  H3.L.setShopGrupo('lanchonete'); H3.L.setShopTab('melhorias'); const mt=txt(H3.doc.getElementById('shop-grid')||{}); ok(!/Água da torneira|Jarra|saborizadas/.test(mt),'a aba Melhorias do Terraço não mostra a bebida da espera');
  // o pedido de quem espera lá fora: um coquetel por pessoa, R$ 18 na conta
  const m=new H.L.Group(g,'executiva',++g.gid,0,false); m.tabT=99; m.pediu=false; g.groups.push(m); m.state='queue'; m.path=[]; m.size=2; m.update && m.update(0.1);
  ok(m.pediu===true || g.maq.length>0,'quem espera no foyer pede coquetel'); }

// ---------- 6. Diversidade e desenho ----------
{ const H=jogo(9,'terraco',{ pontoDia:5, equipe:EQ, jocaCursos:{ espresso:1, cafesEsp:1 }, anselmoCursos:{ classica:1, autor:1 }, daniCursos:{ confCaseira:1 } }), {g,L}=H;
  ok(L.cursosItem(g.save)===1+1+1+1 || L.cursosItem(g.save)===4,'Diversidade: a confeitaria caseira, o espresso, os cafés especiais e a coquetelaria de autor contam ('+L.cursosItem(g.save)+')');
  const cx=H.ctx; let erro=null;
  try{ for(let i=0;i<6;i++) L.drawIcon(cx,'drink',0,0,1,i); for(let i=0;i<5;i++) L.drawIcon(cx,'cafeesp',0,0,1,i); g.begin(); g.mode='carreira'; L.drawCarrinhoBoasVindas(cx,g,1,false); L.drawCarrinhoBoasVindas(cx,g,1,true); L.render(g,H.ctx); }catch(e){ erro=e; }
  ok(!erro,'os 6 drinks, os 5 cafés e o carrinho desenham sem erro'+(erro?': '+erro.stack:'')); }

// ---------- 7. o Manual ----------
{ const {L}=nova(); const f=id=>L.MANUAL.find(x=>x.id===id);
  ok(/rodízio|ajuda em todas/i.test(f('e-cami').linha) && /cafés especiais/i.test(f('e-joca').linha) && /coquetel/i.test(f('e-anselmo').linha) && /coquetel de boas-vindas|coquetéis de boas-vindas/i.test(f('l-maquina').linha),'Manual: as fichas da Cami, do Joca, do Anselmo e a da água da espera citam o que mudou'); }

// ---------- 8. save da v10.2 ----------
{ const L0=nova().L; const S=L0.normSave({ histV:1, cap:9, dia:50, bank:3000, v10:1, salao:{ ponto:'terraco' }, equipe:{ tonhao:2, dani:3, joca:3, cami:3, anselmo:3, lia:1 }, camiCursos:{ agil:1, mesa:1 }, jocaCursos:{ espresso:1 }, up:{ tenis:true } });
  ok(S.equipe.cami===3 && S.equipe.camiModo==='tarefas' && S.equipe.anselmo===3 && !S.up.cafesEsp && !S.up.coqAutor && !S.up.coqClassica && !S.up.maquina && JSON.stringify(S.anselmoCursos)==='{}' && S.anselmoCursoDia===0,'save da v10.2: carrega igual, sem os cursos novos');
  const H=jogo(9,'terraco',{ pontoDia:5, equipe:{ tonhao:2, dani:3, joca:3, cami:3, anselmo:3, lia:1 }, camiCursos:{ agil:1, mesa:1 }, jocaCursos:{ espresso:1 }, libera:{ cami:2, joca:2, anselmo:2 } }); H.g.begin(); roda(H,5); ok(H.g.cami.active,'o dia do save da v10.2 roda'); }

// ---------- 9. o modo dev ----------
{ const D=load({ store:{ lcc2_dev:'1' } }), g=D.g; g.save.salao.ponto='terraco'; g.save.salao=D.L.normSalao(g.save.salao); g.up=g.save.up;
  ok(g.devCursos(true) && g.save.camiCursos.salao===1 && g.save.jocaCursos.cafesEsp===1 && g.save.anselmoCursos.autor===1 && g.up.cafesEsp && g.up.coqAutor && g.up.coqClassica,'dev: "Todos os cursos" liga os três cursos novos e os itens');
  ok(g.devCursos(false) && !g.save.camiCursos.salao && !g.save.jocaCursos.cafesEsp && !g.save.anselmoCursos.autor && !g.up.cafesEsp && !g.up.coqAutor,'dev: "Nenhum" desliga');
  g.save.equipe.cami=3; ok(g.devNivel('cami',1) && g.save.equipe.cami===4,'dev: a Cami sobe ao nível 4'); }

console.log('smoke65: total = '+total+'  fails = '+fails); process.exit(fails?1:0);
