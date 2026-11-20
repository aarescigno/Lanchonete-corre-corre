// v12.5, etapa 15a: o arco da Lia (spec em docs/spec-v12.5.md). CA1 a CA9: a Lia por nível (STAFF.lia.levels), a praça das entradas, os cursos Chefe de praça e Cozinha de autor,
// o Risoto de feijão-manteiguinha, as falas (cap. 10, LIBERA, liaPerfeita, liaRosa, liaPetala, liaChef), os gatilhos, o save antigo, o modo dev, os cartões e o Manual.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const EQ={ tonhao:2, dani:2, joca:3, cami:4, camiModo:'tarefas', anselmo:2 };
const jogo=(sv,o)=>{ const H=nova(o), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap:11, dia:10, maxDay:10, bank:9000, v10:1, up:{ tenis:true }, equipe:Object.assign({},EQ,{ lia:1 }), salao:{ ponto:'terraco' }, pontoDia:5, convCard:1, convDiv:1, libera:{ lia:2 } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const aberto=(sv,o)=>{ const H=jogo(sv,o), {g}=H; g.begin(); g.tables.forEach(t=>{ t.open=true; }); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); return H; };
const ach=falas=>falas.map(f=>[f.q,f.e||'',f.nota||'',f.s]);
const joga=(H,fat,custo)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; g.finishDay(); };
const pends=sv=>Object.keys(sv.arco).filter(k=>sv.arco[k]==='pend');
const cinco=['neutra','insegura','firme','alegre','brava'];

// ---------- CA1: a Lia por nível ----------
{ const {L}=nova(), lv=L.STAFF.lia.levels;
  ok(lv.length===4 && lv[0]===null && JSON.stringify(lv[1])==='{"cook":0.85,"pay":80}' && JSON.stringify(lv[2])==='{"cook":0.75,"pay":100,"praca":true}' && JSON.stringify(lv[3])==='{"cook":0.75,"pay":120,"praca":true,"autor":true}','CA1 STAFF.lia.levels: níveis 1, 2 e 3 (cook 0,85/0,75/0,75; diária 80/100/120)');
  const H=aberto(), {g}=H, eq=g.save.equipe, k=g.kitchen;
  const folha=n=>{ eq.lia=n; return g.payroll(); }, p0=folha(0);
  ok(folha(1)-p0===80 && folha(2)-p0===100 && folha(3)-p0===120,'CA1 a folha cobra R$ 80, 100 e 120 por nível');
  eq.lia=1; ok(g.liaAtiva && k.ajuda===0.85,'CA1 nível 1: Kitchen.ajuda 0,85'); eq.lia=2; ok(k.ajuda===0.75,'CA1 nível 2: 0,75'); eq.lia=3; ok(k.ajuda===0.75,'CA1 nível 3: 0,75');
  eq.liaFora=true; ok(!g.liaAtiva && k.ajuda===1 && g.payroll()===p0,'CA1 sem ela no dia (liaFora): ajuda 1 e nada na folha'); eq.liaFora=false;
  eq.lia=0; ok(k.ajuda===1,'CA1 sem a Lia: ajuda 1'); }

// ---------- CA2: a praça das entradas ----------
{ const mk=(tempo,n)=>Array.from({length:n},()=>({ group:{}, table:1, time:100, p:0, dish:'bruschetta', tempo, base:0 }));
  const prepara=(lia,fora,principais,entradas)=>{ const H=aberto({ equipe:Object.assign({},EQ,{ lia }) }), {g}=H; g.save.equipe.liaFora=!!fora; const k=g.kitchen; k.slots=3; k.cooking=[]; k.queue=mk(1,principais).concat(mk(0,entradas)); k.update(0.1); return k; };
  const k2=prepara(2,false,4,2), pr=k2.cooking.filter(t=>t.praca);
  ok(pr.length===1 && pr[0].tempo===0 && k2.cooking.filter(t=>!t.praca).length===3 && k2.cooking.filter(t=>!t.praca).every(t=>t.tempo===1) && k2.cooking.length===4,'CA2 nível 2, bocas cheias de principais: uma entrada cozinha na praça (4 cozinhando, 3 no fogão)');
  ok(pr[0].p>0 && k2.progressFor(pr[0].group)>0,'CA2 a entrada da praça anda (progresso > 0)');
  const k2b=prepara(2,false,1,3); ok(k2b.cooking.length===4 && k2b.cooking.filter(t=>t.praca).length===1 && k2b.cooking.filter(t=>!t.praca&&t.tempo===0).length===2,'CA2 as bocas do fogão ainda pegam entradas (1 principal + 2 entradas no fogão, 1 na praça)');
  ok(prepara(1,false,4,2).cooking.length===3 && !prepara(1,false,4,2).cooking.some(t=>t.praca),'CA2 nível 1: sem praça (3 cozinhando)');
  ok(prepara(2,true,4,2).cooking.length===3 && !prepara(2,true,4,2).cooking.some(t=>t.praca),'CA2 sem a Lia no dia (liaFora): sem praça');
  const k4=prepara(3,false,5,0); ok(k4.cooking.length===3 && !k4.cooking.some(t=>t.praca) && k4.queue.length===2,'CA2 só principais na fila: o principal nunca vai para a praça');
  const k5=prepara(2,false,0,5), k5s=prepara(1,false,0,5); ok(k5.cooking.filter(t=>t.praca).length===1 && k5.cooking.length===4 && k5.queue.length===1 && k5s.cooking.length===3,'CA2 só entradas: 3 no fogão e 1 na praça (4 cozinhando contra 3 sem a praça)');
  // a praça libera a vaga quando a entrada fica pronta
  const H=aberto({ equipe:Object.assign({},EQ,{ lia:2 }) }), k=H.g.kitchen; k.slots=3; k.cooking=[]; k.queue=mk(0,3).map(t=>Object.assign(t,{ time:0.2 })); k.clean=Infinity; k.update(0.1); k.update(0.2);
  ok(k.cooking.length===0 && k.plates.filter(Boolean).length===3,'CA2 as entradas da praça saem como as do fogão (prato pronto)'); }

// ---------- CA3: os cursos ----------
{ const L0=nova().L, C=L0.LIA_CURSOS;
  ok(C.length===2 && C[0].id==='praca' && C[0].nome==='Chefe de praça' && C[0].preco===700 && C[0].nivel===4 && !C[0].dep && !C[0].item && C[1].id==='autor' && C[1].nome==='Cozinha de autor' && C[1].preco===1000 && C[1].nivel===4 && C[1].dep==='praca' && C[1].item===true,'CA3 LIA_CURSOS: Chefe de praça R$ 700 e Cozinha de autor R$ 1.000 (depois da praça, no Cardápio)');
  // Modo História: escondidos até a conversa
  let H=jogo({}), g=H.g; ok(!g.buyLiaCurso('praca') && g.save.equipe.lia===1,'CA3 História: o Chefe de praça não se compra antes da liaRosa');
  g.save.arco.liaRosa=1; ok(g.buyLiaCurso('praca') && g.save.liaCursos.praca===1 && g.save.equipe.lia===2 && g.save.bank===9000-700 && g.save.liaCursoDia===g.shopNext,'CA3 depois da liaRosa: compra (R$ 700), sobe a Lia ao nível 2');
  ok(!g.buyLiaCurso('autor') && g.liaCursoTrava,'CA3 um curso por dia (trava)'); g.save.liaCursoDia=0;
  ok(!g.buyLiaCurso('autor'),'CA3 História: a Cozinha de autor não se compra antes da liaPetala'); g.save.arco.liaPetala=1;
  ok(g.buyLiaCurso('autor') && g.save.liaCursos.autor===1 && g.save.equipe.lia===3 && g.save.bank===9000-700-1000,'CA3 depois da liaPetala: compra (R$ 1.000), a Lia vai ao nível 3');
  ok(!g.buyLiaCurso('autor') && !g.buyLiaCurso('praca'),'CA3 curso feito não se compra de novo');
  H=jogo({ arco:{ liaRosa:1, liaPetala:1 } }); ok(!H.g.buyLiaCurso('autor'),'CA3 a Cozinha de autor precisa do Chefe de praça');
  // fora do Modo História
  H=jogo({},{ historia:false }); g=H.g; ok(g.buyLiaCurso('praca') && g.save.equipe.lia===2,'CA3 sem História: o Chefe de praça com a Lia contratada');
  g.save.liaCursoDia=0; ok(g.buyLiaCurso('autor') && g.save.equipe.lia===3,'CA3 sem História: a Cozinha de autor com a praça feita');
  H=jogo({ equipe:Object.assign({},EQ,{ lia:0 }) },{ historia:false }); ok(!H.g.buyLiaCurso('praca'),'CA3 sem História e sem a Lia contratada: nada');
  H=jogo({ bank:300 },{ historia:false }); ok(!H.g.buyLiaCurso('praca'),'CA3 sem caixa: nada');
  ok(L0.normSave({ liaCursos:{ autor:1 } }).liaCursos.autor===undefined && L0.normSave({ liaCursos:{ praca:1, autor:1 } }).liaCursos.autor===1,'CA3 normLiaCursos: o de autor só vale com o da praça'); }

// ---------- CA4: o Risoto de feijão-manteiguinha ----------
{ const H0=aberto({ liaCursos:{ praca:1, autor:1 }, equipe:Object.assign({},EQ,{ lia:3 }) }), {g,L}=H0, R=L.CARDAPIO.liaRisoto;
  ok(R && R.nome==='Risoto de feijão-manteiguinha' && R.preco.terraco===88 && R.cat==='pf' && R.curso==='liaAutor' && R.carne===false && R.cor==='#C9A26B' && R.veg===true && R.fino===true && !L.CURSOS.some(c=>c.id==='liaAutor'),'CA4 CARDAPIO.liaRisoto: R$ 88 (v12.7; a regra do CA10 da v12.5: acima do risoto de cogumelos), bege dourado, sem carne, fino, curso que não existe em CURSOS');
  const pede=(h,veg)=>{ let n=0; for(let i=0;i<300;i++) if(h.L.pedePrincipal('executiva',h.g,veg)==='liaRisoto') n++; return n; };
  g.cursos.alta=2; const c=pede(H0); ok(c>0,'CA4 com o curso de autor e a Lia no dia, o risoto é pedido ('+c+' de 300)');
  ok(pede(H0,true)>0,'CA4 também entre os vegetarianos');
  g.save.equipe.liaFora=true; ok(pede(H0)===0,'CA4 sem a Lia no dia: nunca'); g.save.equipe.liaFora=false;
  g.save.liaCursos={ praca:1 }; ok(pede(H0)===0,'CA4 sem o curso de autor: nunca'); g.save.liaCursos={ praca:1, autor:1 };
  const Hs=aberto({ liaCursos:{ praca:1, autor:1 }, equipe:Object.assign({},EQ,{ lia:3 }) }), gs=Hs.g;
  ok(Hs.L.pratosSabidos(gs.cursos).indexOf('liaRisoto')<0,'CA4 o risoto nunca é "sabido" pelo caminho comum');
  // a venda: cada risoto pago soma em liaPrato
  const t=gs.tables[0], grp=new Hs.L.Group(gs,'executiva',++gs.gid,0,false); grp.dishes=['liaRisoto','pf','liaRisoto'].slice(0,grp.size); grp.size=grp.dishes.length; grp.state='wantBill'; grp.hearts=4; t.group=grp; grp.table=t; gs.groups.push(grp);
  const antes=gs.save.liaPrato||0; gs.collectBill(grp,t);
  ok(gs.save.liaPrato-antes===grp.dishes.filter(k=>k==='liaRisoto').length && gs.save.liaPrato-antes>0,'CA4 cada risoto vendido soma 1 em save.liaPrato ('+(gs.save.liaPrato-antes)+')'); }

// ---------- CA5: as falas ----------
{ const L=nova().L, H=L.HISTORIA.find(c=>c.cap===10), A=id=>L.ARCO.find(a=>a.id===id);
  const E={
  antes:[['tonhao','insegura','','Quatro tempos por mesa, Bia. Sozinho no fogão eu não venço.'],['bia','firme','','Então o senhor vai ter ajuda.'],['cami','alegre','','Eu sei quem! A Lia, que cozinhava no meu rodízio. Hoje ela faz curso de alta gastronomia.'],['tonhao','brava','','Ajudante na minha cozinha?...'],['bia','alegre','','Foi o senhor que me ensinou a pedir ajuda, tio.'],['dani','','','E o pessoal daqui gosta de um coquetel antes da entrada!']],
  libera:[['cami','','','Chefe, a Lia veio! Tá na porta da cozinha.'],['lia','firme','','Lia. Onde eu guardo as facas?'],['tonhao','brava','na frente da porta','Peraí... Você é a moça do curso. A da cebola.'],['tonhao','brava','','Na minha cozinha, não. Aqui cada panela tem dono.'],['bia','firme','','Tio, quem contrata sou eu. Faz um teste com ela.'],['tonhao','','pondo uma cebola na tábua','Uma cebola. Do jeito que eu corto.'],['lia','firme','cortando sem dizer nada','...'],['tonhao','insegura','','...Hum. Ficou igual.'],['bia','firme','','Bem-vinda, Lia. Eu acerto na lojinha, em Equipe.'],['lia','','','Obrigada, chefia.']],
  depois:[['lia','','com os potes na mão','Chef, arrumei os temperos em ordem alfabética.'],['tonhao','brava','','O cominho mora do lado do fogão há trinta anos! Volta tudo pro lugar.'],['lia','insegura','','Desculpa, chef. No rodízio ninguém sabia onde ficava nada.'],['cami','alegre','','Ela arrumou a cozinha inteira do rodízio numa noite, Tonhão. O dono quase chorou.'],['tonhao','','','Seu Tonhão, Cami. ...E aqui ninguém chora.'],['tonhao','','','Mas deixa o sal onde ela pôs.'],['bia','alegre','','A cozinha tá voando, tio!']],
  liaPerfeita:[['tonhao','','','Lia, a mesa quatro tá esperando a entrada faz tempo!'],['lia','insegura','','Refiz três vezes, chef. O corte não ficou igual.'],['tonhao','firme','','Prato perfeito e frio não serve pra ninguém. Capricho tem hora, e a hora é a do freguês.'],['cami','','pegando o prato','Li, a mesa não quer perfeito, quer quente. Nem lá no rodízio, nem aqui.'],['lia','firme','','Entendido. Sai agora.'],['bia','alegre','','Tá ensinando bonito, tio.']],
  liaRosa:[['tonhao','','olhando a Lia na tábua','Bia, sabe quem refazia prato três vezes? A sua mãe.'],['bia','','','A mãe?'],['tonhao','alegre','','Até aprender que prato tem hora. Aí ninguém segurava ela.'],['tonhao','firme','','Lia, a boca da esquerda é sua. As entradas são suas.'],['lia','insegura','','O senhor disse que cada panela tinha dono.'],['tonhao','firme','','E tem. Essa agora é sua. Essa cozinha nunca foi só minha.'],['bia','firme','','Então o curso dela tá na lojinha, em Equipe.']],
  liaPetala:[['tonhao','','com a pétala na palma da mão','Lia, hoje quem põe a pétala é você.'],['lia','insegura','','Eu, chef? Esse prato é da sua família.'],['tonhao','firme','','Por isso mesmo. Receita que fica numa mão só some. Eu já vi isso acontecer.'],['lia','firme','pondo a pétala','...Na hora. Como a Rosa.'],['bia','firme','','E o próximo prato da casa é seu, Lia. O curso tá no Cardápio da lojinha.']],
  liaChef:[['cami','alegre','','Li, a mesa da janela quer conhecer quem fez o prato.'],['lia','insegura','','Eu? Fala que foi o chef.'],['tonhao','firme','','Chef é quem a mesa chama. Vai lá, chef.'],['lia','','','...Obrigada, Antônio.'],['lia','firme','','José Carlos, Daniela: segurem a cozinha pra mim.'],['bia','alegre','','Vai, Lia. O salão é da Cami, mas essa mesa é sua.']] };
  const real={ antes:ach(H.antes), libera:ach(L.liberaOf('lia').falas), depois:ach(H.depois), liaPerfeita:A('liaPerfeita')&&ach(A('liaPerfeita').falas), liaRosa:A('liaRosa')&&ach(A('liaRosa').falas), liaPetala:A('liaPetala')&&ach(A('liaPetala').falas), liaChef:A('liaChef')&&ach(A('liaChef').falas) };
  Object.keys(E).forEach(k=>ok(JSON.stringify(real[k])===JSON.stringify(E[k]),'CA5 as falas de '+k+' são as da spec ('+E[k].length+' falas)'));
  const todas=[].concat(...Object.keys(real).map(k=>real[k]||[]));
  ok(todas.every(f=>f[3].length<=120 && (!f[1] || cinco.includes(f[1]))),'CA5 nenhuma fala passa de 120 letras e o e é um dos cinco');
  ok(L.ARCO.filter(a=>a.nivel===4).map(a=>a.id).join()==='liaPerfeita,liaRosa,anselmoRi,jocaNome,liaPetala,liaChef,roda','CA5 a ordem da ARCO no Terraço: liaPerfeita, liaRosa, ..., liaPetala, liaChef, roda'); }

// ---------- CA6: os gatilhos ----------
{ const dia=(arr,n)=>{ const H=nova(), {g}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
    g.trocaPonto(H.L.PONTOS[3]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); sv.equipe.lia=1; sv.equipe.anselmo=0; sv.equipe.cami=0; if(arr) arr(sv); g.startDay(n||20); joga(H,900,0); return pends(sv); };
  // a LIBERA lia, no Modo História, só com o cap. 10 começado
  { const H=nova(), {g,L}=H, F=L.liberaOf('lia'); g.save.cursos={ entradas:1 };
    g.save.cap=9; const a=F.gatilho(g.stats,[],g); g.save.cap=10; const b=F.gatilho(g.stats,[],g); g.save.cursos={}; const c=F.gatilho(g.stats,[],g);
    ok(a===false && b===true && c===false,'CA6 LIBERA lia (História): o curso de entradas só vale no cap. 10 em diante ('+a+', '+b+', sem curso '+c+')');
    const H2=nova({ historia:false }); H2.g.save.cursos={ entradas:1 }; H2.g.save.cap=4; ok(H2.L.liberaOf('lia').gatilho(H2.g.stats,[],H2.g)===true,'CA6 LIBERA lia (sem História): nada muda'); }
  ok(dia(sv=>{ sv.cap=10; sv.arco.liaPerfeita=0; }).length===0,'CA6 liaPerfeita não marca no cap. 10');
  ok(dia(sv=>{ sv.cap=11; sv.arco.liaPerfeita=0; }).join()==='liaPerfeita','CA6 liaPerfeita marca no cap. 11');
  ok(dia(sv=>{ sv.cap=11; sv.arco.liaRosa=0; }).join()==='liaRosa','CA6 liaRosa marca depois da liaPerfeita (cap. 11, Lia contratada)');
  ok(dia(sv=>{ sv.cap=11; sv.arco.liaRosa=0; sv.arco.liaPerfeita=0; }).join()==='liaPerfeita','CA6 liaPerfeita e liaRosa ainda por tocar: só a liaPerfeita, uma por fim de dia');
  ok(dia(sv=>{ sv.cap=11; sv.arco.liaRosa=0; sv.equipe.lia=0; }).length===0,'CA6 liaRosa sem a Lia contratada: nada');
  ok(dia(sv=>{ sv.cap=13; sv.rosa=1; sv.arco.liaPetala=0; }).join()==='liaPetala','CA6 liaPetala segue o gatilho de antes (molho da Rosa, cap. 13)');
  ok(dia(sv=>{ sv.cap=13; sv.rosa=1; sv.arco.liaChef=0; sv.liaPrato=1; }).join()==='liaChef','CA6 liaChef marca com liaPrato 1 e a liaPetala vista');
  ok(dia(sv=>{ sv.cap=13; sv.rosa=1; sv.arco.liaChef=0; sv.liaPrato=0; }).length===0,'CA6 liaChef sem nenhum risoto vendido: nada');
  ok(dia(sv=>{ sv.cap=13; sv.rosa=1; sv.arco.liaChef=0; sv.arco.liaPetala=0; sv.liaPrato=2; }).join()==='liaPetala','CA6 liaPetala vem antes da liaChef');
  ok(dia(sv=>{ sv.cap=14; sv.rosa=1; sv.arco.roda=0; sv.arco.liaChef=0; sv.liaPrato=3; }).join()==='liaChef','CA6 liaChef vem antes da roda'); }

// ---------- CA7: save antigo ----------
{ const L=nova().L, sv=L.normSave({ v10:1, dia:70, salao:{ ponto:'terraco' }, equipe:{ tonhao:3, dani:3, anselmo:3, lia:1 } });
  ok(sv.equipe.lia===1 && JSON.stringify(sv.liaCursos)==='{}' && sv.liaCursoDia===0 && sv.liaPrato===0,'CA7 save da v12.4.3 com a Lia: nível 1, sem cursos, liaCursoDia e liaPrato 0');
  ok(L.normSave({ salao:{ ponto:'terraco' }, equipe:{ lia:9 } }).equipe.lia===3 && L.normSave({ salao:{ ponto:'avenida' }, equipe:{ lia:2 } }).equipe.lia===0,'CA7 normEquipe: a Lia vai a 3 no Terraço e some fora dele'); }

// ---------- CA8: modo dev ----------
{ const H=nova(), {g,L}=H; g.setDev(true); g.devReal(true); g.trocaPonto(L.PONTOS[3]); g.save.equipe.lia=0;
  const sobe=()=>{ g.devNivel('lia',1); return g.save.equipe.lia; };
  ok(sobe()===1 && sobe()===2 && sobe()===3 && sobe()===3,'CA8 NIV.lia sobe de 0 a 3 e para no 3');
  ok(g.save.liaCursos.praca===1 && g.save.liaCursos.autor===1,'CA8 no nível 3 a Lia tem os dois cursos (o risoto entra)');
  g.devNivel('lia',-1); ok(g.save.equipe.lia===2 && g.save.liaCursos.praca===1 && !g.save.liaCursos.autor,'CA8 desce ao 2: só a praça');
  g.devNivel('lia',-1); g.devNivel('lia',-1); ok(g.save.equipe.lia===0 && !g.save.liaCursos.praca,'CA8 desce ao 0');
  g.devCapitulo(13); ok(g.save.equipe.lia===3 && g.save.liaCursos.autor===1 && g.save.liaCursos.praca===1,'CA8 "Tudo no máximo" (Fim): a Lia no nível 3 com os dois cursos');
  g.devCapitulo(11); ok(g.save.equipe.lia===1,'CA8 o cap. 11 da tabela fica com a Lia no 1');
  const rot=L.devCenas().map(c=>c.rot); ok(rot.includes('Arco: liaRosa') && rot.includes('Arco: liaChef'),'CA8 as 2 conversas novas estão na lista do dev');
  const T=load({ store:{ lcc2_save:JSON.stringify({ dia:70, bank:12345, histV:1, capV:6, cap:15, conversa:null, salao:{ ponto:'terraco' }, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1 }) } });
  T.g.startTeste('terraco'); ok(T.g.save.equipe.lia===3 && T.g.save.liaCursos.praca===1 && T.g.save.liaCursos.autor===1,'CA8 o Teste de habilidade no Terraço: Lia no nível 3 com os dois cursos'); }

// ---------- CA9: os cartões e o Manual ----------
{ const aba=(sv,o,grupo,tab)=>{ const H=jogo(sv,o); H.L.setShopGrupo(grupo||'equipe'); H.L.setShopTab(tab||'lia'); return txt(H.doc.getElementById('shop-grid')||{}); };
  let t=aba({ equipe:Object.assign({},EQ,{ lia:0 }), libera:{ lia:2 } },{ historia:false });
  ok(/Lia/.test(t) && !/nível/.test(t) && /Se contratar:/.test(t) && /Ajuda no pré-preparo/.test(t) && /Diária: R\$ 80/.test(t),'CA9 sem contratar: "Lia", "Se contratar:", "Ajuda no pré-preparo" e a diária de R$ 80');
  t=aba({},{ historia:false }); ok(/Lia \(cozinheira\) · nível 1 de 3/.test(t) && /Na cozinha:/.test(t) && /Ajuda no pré-preparo/.test(t) && /Diária: R\$ 80/.test(t),'CA9 nível 1: "Lia (cozinheira) · nível 1 de 3", "Na cozinha:", a linha e a diária');
  ok(/Curso de Chefe de praça/.test(t) && /Comprar R\$ 700/.test(t),'CA9 o cartão do curso: "Curso de Chefe de praça" e "Comprar R$ 700"');
  t=aba({ equipe:Object.assign({},EQ,{ lia:2 }), liaCursos:{ praca:1 } },{ historia:false }); ok(/nível 2 de 3/.test(t) && /Cuida das entradas/.test(t) && /Diária: R\$ 100/.test(t) && /Curso feito/.test(t),'CA9 nível 2: "Cuida das entradas", R$ 100 e "Curso feito"');
  t=aba({ equipe:Object.assign({},EQ,{ lia:3 }), liaCursos:{ praca:1, autor:1 } },{ historia:false }); ok(/nível 3 de 3/.test(t) && /Faz o prato dela/.test(t) && /Diária: R\$ 120/.test(t),'CA9 nível 3: "Faz o prato dela" e R$ 120');
  t=aba({ liaCursos:{ praca:1 }, equipe:Object.assign({},EQ,{ lia:2 }) },{ historia:false },'lanchonete','cardapio'); ok(/Curso de cozinha de autor/.test(t) && /Comprar R\$ 1000/.test(t.replace('1.000','1000')),'CA9 o Cardápio tem o "Curso de cozinha de autor" (R$ 1.000)');
  t=aba({ arco:{ liaRosa:1, liaPetala:1 } },null,'lanchonete','cardapio'); ok(/Precisa do curso de Chefe de praça\./.test(t),'CA9 sem a praça: "Precisa do curso de Chefe de praça."');
  t=aba({ equipe:Object.assign({},EQ,{ lia:0 }), arco:{ liaRosa:1 } },null); ok(/Precisa da Lia contratada\./.test(t),'CA9 com a Lia fora da equipe: "Precisa da Lia contratada."');
  t=aba({ liaCursoDia:11, arco:{ liaRosa:1 } },null); const H=jogo({ arco:{ liaRosa:1 } }); H.g.save.liaCursoDia=H.g.shopNext; H.L.setShopGrupo('equipe'); H.L.setShopTab('lia'); ok(/Em curso/.test(txt(H.doc.getElementById('shop-grid')||{})),'CA9 depois de um curso no dia: "Em curso"');
  t=aba({ },null); ok(!/Curso de Chefe de praça/.test(t),'CA9 na História, o curso fica escondido antes da liaRosa');
  const L=nova().L, f=L.MANUAL.find(q=>q.id==='e-lia'); ok(f && f.aba==='equipe' && f.quem==='lia' && f.linha==='Cozinheira: começa no pré-preparo; com cursos, cuida das entradas e cria um prato dela.','CA9 a ficha e-lia nova'); }

console.log('\nsmoke106: '+total+' checagens, fails = '+fails);
process.exit(fails?1:0);
