// v9.6.7, etapa 3f-1: o Manual (bestiário que se revela com a história)
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=(dia,o)=>{ const H=load(); const {g,L}=H; g.save=L.normSave(Object.assign({bank:2000,dia,maxDay:dia},o||{})); g.up=g.save.up; g.buildTables(); return H; };
const abre=(H,dia)=>{ const {g}=H; g.startDay(dia); g.begin(); g.schedule=[]; g.nextIdx=0; };
const roda=(g,s)=>{ for(let i=0;i<s/0.05;i++) g.update(0.05); };
const cards=H=>H.els['manual-grid'].children;
const nome=c=>c.children[1].textContent, tranc=c=>/trancada/.test(c.className);
const aba=(H,k)=>{ const b=H.els['manual-abas'].children.find(x=>x.getAttribute('data-v')===k); b.fire('click'); };

// (a) carreira nova: o Básico com as 7 fichas "sempre" abertas e o resto trancado
{ const H=load(), {g,L,els}=H;
  ok(['b-sentar','b-mesa','b-coracoes','b-cores','b-meta','b-lojinha','b-historia','e-bia','e-tonhao','p-garagem'].every(id=>g.save.manual.indexOf(id)>=0) && g.save.manualNovo.length===0,'carreira nova: as fichas sempre abertas já vêm no save, sem "novo"');
  els['btn-manual'].fire('click');
  ok(els['ov-manual'].classList.contains('show') && cards(H).length===12,'o Manual abre no Básico, com as 12 fichas');
  ok(cards(H).filter(c=>!tranc(c)).length===7 && cards(H).filter(tranc).every(c=>nome(c)==='???'),'Básico: 7 abertas; as outras 4 trancadas, com "???"');
  ok(cards(H).filter(tranc).every(c=>/Aparece mais adiante na história\./.test(c.children[2].textContent)),'ficha trancada: "Aparece mais adiante na história."');
  aba(H,'clientes'); ok(cards(H).length===13 && cards(H).every(tranc),'Clientes: todas trancadas antes do 1º dia');
  els['btn-manual-voltar'].fire('click'); ok(els['ov-menu'].classList.contains('show') && !els['ov-manual'].classList.contains('show'),'Voltar leva ao menu');
}
// (a2) depois do dia 1: Estudante e Vovô e vovó abertos e a linha "Novo no Manual" no fim do dia
{ const H=novo(1), {g,L,els}=H; abre(H,1);
  g.schedule=[{t:0,type:'estudante',color:0},{t:0.5,type:'vovos',color:1}]; g.nextIdx=0; roda(g,3);
  ok(g.save.manual.indexOf('c-estudante')>=0 && g.save.manual.indexOf('c-vovos')>=0 && g.save.manualNovo.length===2,'o 1º grupo de cada tipo abre a ficha (com "novo")');
  g.schedule=[]; g.money=100; g.custo=0; g.finishDay();
  ok(/Novo no Manual: Estudante, Vovô e vovó\./.test(els['end-manual'].textContent) && els['end-manual'].style.display==='','fim do dia: "Novo no Manual: Estudante, Vovô e vovó."');
  g.manualDia=['c-estudante','c-vovos','c-familia','c-executiva','c-entregador']; g.setState('dayend');
  ok(/Estudante, Vovô e vovó, Família e mais 2\./.test(els['end-manual'].textContent),'no máximo 3 nomes, depois "e mais N"');
  els['btn-manual'].fire('click'); // aba com ficha nova abre sozinha (Clientes), e abrir a aba tira o "novo"
  const abertas=cards(H).filter(c=>!tranc(c)); ok(abertas.length===2 && /nova/.test(abertas[0].className),'Manual abre na aba com ficha nova (Clientes), com as 2 abertas e marcadas como novas');
  ok(g.save.manualNovo.length===0,'abrir a aba tira as fichas de manualNovo');
  ok(abertas[0].children.length>=4 && abertas[0].children[3].children.some(t=>t.textContent==='Paciência: média'),'a ficha aberta mostra os traços (chips)');
}
// (b) traços calculados de CUSTOMER_TYPES
{ const {L}=load(), v=L.manualTracos('vovos'), e=L.manualTracos('executiva');
  ok(v.indexOf('Paciência: muito longa')>=0 && v.indexOf('Escolha: demorada')>=0 && v.indexOf('Refeição: demorada')>=0 && v.indexOf('Grupo: em dupla')>=0,'vovós: paciência muito longa, escolha e refeição demoradas, em dupla');
  ok(e.indexOf('Paciência: curta')>=0 && e.indexOf('Gorjeta: boa')>=0 && e.indexOf('Grupo: sozinho')>=0,'executiva: paciência curta e gorjeta boa');
  const en=L.manualTracos('entregador'); ok(en.indexOf('leva marmita')>=0 && !en.some(t=>/Refeição/.test(t)),'entregador: leva marmita e não tem "Refeição"');
  ok(L.manualTracos('motorista').indexOf('pede cafezinho no fim')>=0 && L.manualTracos('vip').length===5 && L.manualTracos('veg').length===2,'extras do motorista, do VIP e do vegetariano');
  ok(L.manualTracos('turma',{aberta:id=>id==='p-garagem'}).every(t=>!/Onde/.test(t)) && L.manualTracos('turma',{aberta:id=>id==='p-industrial'}).indexOf('Onde: Área industrial')>=0,'"Onde" só lista os lugares com a ficha aberta');
  const sv=L.normSave({dia:3}); sv.equipe.tonhao=0; ok(L.manualTracos('tonhao',{save:sv}).indexOf('Nível ●○○○○')>=0,'Tonhão: bolinhas do nível');
  ok(L.manualTracos('bia',{save:sv}).indexOf('duas mãos')>=0,'Bia: "duas mãos"');
  sv.equipe.dani=2; ok(L.manualTracos('dani',{save:sv}).indexOf('Nível ●●○○')>=0,'Dani nível 2 de 4: ●●○○');
}
// (c) Turno sem fim e Missão zero não revelam nada
{ const H=load(), {g}=H; const n0=g.save.manual.length; g.startEndless(); g.manualVer('c-turma'); roda(g,5);
  ok(g.save.manual.length===n0 && !g.manualVer('c-vip'),'Turno sem fim: nada se revela');
  g.startTreino(); ok(!g.manualVer('c-estudante') && g.manualAberta('b-sentar'),'Missão zero: nada se revela, mas o Manual mostra o save de verdade');
  g.sairTreino(); ok(g.save.manual.length===n0,'o save de verdade fica como estava'); }
// (d) o 1º VIP abre c-vip; o vegetariano abre c-veg ao sentar
{ const H=novo(5), {g}=H; abre(H,5);
  g.schedule=[{t:0,type:'estudante',color:0,vip:true}]; g.nextIdx=0; roda(g,1);
  ok(g.save.manual.indexOf('c-vip')>=0,'o 1º VIP abre c-vip');
  const H2=novo(3), g2=H2.g; abre(H2,3); g2.schedule=[{t:0,type:'estudante',color:0}]; g2.nextIdx=0; roda(g2,1);
  const grp=g2.groups[0]; grp.people.forEach(p=>{ p.veg=true; }); ok(g2.save.manual.indexOf('c-veg')<0,'antes de sentar, sem c-veg');
  const t=g2.tables.find(x=>x.open&&x.seats>=grp.size); g2.seatGroup(grp,t);
  ok(g2.save.manual.indexOf('c-veg')>=0,'ao sentar o 1º vegetariano, abre c-veg'); }
// (d2) o começo do dia 3 abre Louça e lixo e Suco e cafezinho; o dia 4, Marmitas
{ const H=novo(3), {g}=H; ok(g.save.manual.indexOf('b-louca')<0,'antes do dia 3, sem b-louca'); abre(H,3);
  ok(g.save.manual.indexOf('b-louca')>=0 && g.save.manual.indexOf('b-suco')>=0 && g.save.manual.indexOf('b-marmita')<0,'dia 3: b-louca e b-suco abrem');
  const H4=novo(4), g4=H4.g; abre(H4,4); ok(g4.save.manual.indexOf('b-marmita')>=0,'dia 4: b-marmita abre (a Efood está aberta)'); }
// (e) save antigo no dia 10 da área industrial ganha a semente
{ const {L}=load(), sv=L.normSave({bank:2000,dia:10,maxDay:10,salao:{ponto:'industrial'}});
  ok(sv.manual.indexOf('c-turma')>=0 && sv.manual.indexOf('p-industrial')>=0 && sv.manual.indexOf('p-avenida')<0 && sv.manual.indexOf('c-negocios')<0 && sv.manualNovo.length===0,'save antigo no dia 10 da industrial: c-turma e p-industrial, sem p-avenida, sem "novo"');
  const s2=L.normSave({dia:2,manual:['c-vip','xxx','c-vip','b-meta'],manualNovo:['b-meta','c-turma','yy']});
  ok(s2.manual.join()==='c-vip,b-meta' && s2.manualNovo.join()==='b-meta','normSave: só ids que existem, sem repetidos; manualNovo dentro de manual'); }
// (f) abrirManual(ficha, volta) e a lojinha
{ const H=novo(3,{bank:5000}), {g,L,els}=H; g.goShop(3);
  ok(g.save.manual.indexOf('l-bandeja')<0,'a ficha da Bandeja só abre com o cartão'); L.setShopTab('bia'); ok(g.save.manual.indexOf('l-bandeja')>=0 && g.save.manualNovo.indexOf('l-bandeja')>=0,'abrir a seção da Bia abre as fichas dos tênis e da bandeja');
  ok(els['btn-shop-manual'].classList.contains('novo'),'o "?" da lojinha leva a bolinha "novo"');
  L.abrirManual('l-bandeja','shop');
  ok(els['manual-abas'].children.find(b=>b.getAttribute('aria-pressed')==='true').getAttribute('data-v')==='lojinha','abre na aba Lojinha');
  const c=cards(H).find(x=>x.getAttribute('data-id')==='l-bandeja'); ok(c && /foco/.test(c.className) || (c && c.classList.contains('foco')),'a ficha fica em foco');
  els['btn-manual-voltar'].fire('click'); ok(els['ov-shop'].classList.contains('show') && g.state==='shop','Voltar volta à lojinha');
  ok(g.save.manualNovo.indexOf('l-bandeja')<0 && g.save.manualNovo.indexOf('e-dani')>=0 && els['btn-shop-manual'].classList.contains('novo'),'vista a aba Lojinha, as dela saem de "novo"; a bolinha fica enquanto houver ficha por ver em outra aba');
  L.abrirManual('e-dani','shop'); L.abrirManual('p-industrial','shop'); els['btn-manual-voltar'].fire('click'); ok(g.save.manualNovo.length===0 && !els['btn-shop-manual'].classList.contains('novo'),'vistas todas, a bolinha do "?" some');
  // a pausa
  const H2=novo(3), g2=H2.g; abre(H2,3); g2.pause(); ok(g2.state==='paused','pausou'); H2.els['btn-pause-manual'].fire('click'); ok(H2.els['ov-manual'].classList.contains('show') && g2.state==='paused','Manual abre pela pausa, com o jogo parado');
  H2.els['btn-manual-voltar'].fire('click'); ok(H2.els['ov-pause'].classList.contains('show'),'Voltar volta à pausa'); }
// (g) nenhuma ficha tem algarismo (nem os traços das abertas)
{ const {L}=load(); const sv=L.normSave({dia:30,maxDay:30,salao:{ponto:'avenida'}}); sv.equipe.tonhao=4; sv.equipe.dani=4; sv.equipe.joca=4; sv.equipe.cami=3; sv.equipe.anselmo=3; sv.up.bandeja=true;
  const tex=[]; L.MANUAL.forEach(f=>{ tex.push(f.nome,f.linha); if(f.tipo) tex.push.apply(tex,L.manualTracos(f.tipo)); if(f.quem) tex.push.apply(tex,L.manualTracos(f.quem,{save:sv})); });
  const ruim=tex.filter(t=>/\d/.test(t)); ok(ruim.length===0,'nenhum texto, linha ou traço do Manual tem algarismo'+(ruim.length?': '+ruim.join(' | '):''));
  ok(L.MANUAL.length===65 && new Set(L.MANUAL.map(f=>f.id)).size===65,'65 fichas, ids únicos (v10.2: a Lia)');
}
// (h) o fogão industrial, o couvert e o assento abrem na industrial/Avenida; imprevistos
{ const H=novo(12,{bank:9000,salao:{ponto:'industrial'}}), {g,L}=H; g.goShop(12); L.setShopTab('manut'); L.setShopTab('divulga'); L.setShopTab('melhorias');
  L.setShopTab('manut'); ok(g.save.manual.indexOf('l-fogao')>=0,'Manutenção na industrial abre l-fogao');
  L.setShopTab('melhorias'); ok(g.save.manual.indexOf('l-tvs')>=0 && g.save.manual.indexOf('l-assento')>=0 && g.save.manual.indexOf('l-maquina')>=0,'Melhorias da industrial abrem TVs, assento e jarra');
  ok(g.save.manual.indexOf('p-industrial')>=0,'o lugar onde se está abre a ficha'); }
{ const H=novo(8,{bank:9000}), {g,L}=H; g.clima='chuva'; g.day.gripe=true; g.manualInicio();
  ok(g.save.manual.indexOf('i-chuva')>=0 && g.save.manual.indexOf('i-gripe')>=0 && g.save.manual.indexOf('i-feriado')<0,'o clima e a gripe abrem as fichas dos imprevistos'); }
// (i) o menu: o botão Manual leva a bolinha com ficha por ver; o desenho das fichas não quebra
{ const H=novo(5), {g,L,els}=H; g.manualVer; g.mode='carreira'; g.save.manualNovo=['c-turma']; g.save.manual.push('c-turma'); g.setState('menu');
  ok(els['btn-manual'].classList.contains('novo'),'menu: o botão Manual leva "novo" com ficha por ver');
  els['btn-manual'].fire('click'); ok(els['manual-abas'].children.find(b=>b.getAttribute('aria-pressed')==='true').getAttribute('data-v')==='clientes','abre direto na aba com ficha nova');
  let err=null; try{ ['basico','clientes','equipe','lojinha','lugares','imprevistos'].forEach(k=>{ aba(H,k); }); }catch(e){ err=e; }
  ok(!err,'as 6 abas desenham sem erro'+(err?': '+err.stack:'')); }
console.log('smoke53: total =',total,' fails =',fails);
process.exit(fails?1:0);
