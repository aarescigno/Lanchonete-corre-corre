// v8.6.9, etapa 2c-r3a: o cardápio cresce. A Garagem começa com PF e coxinha; os cursos do Tonhão (um por lojinha) ensinam pratos
// novos e sobem a Diversidade do cardápio; o avançado soma 15% ao preço e 1,5x à chance de caprichado; cada tipo de cliente pede
// pelo seu gosto, entre os pratos que a cozinha sabe; save de antes recomeça do dia 1 com um aviso (o ranking fica)
const load=require('./harness.js');
const H=load(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const C=L.CARDAPIO, TIPOS=['estudante','familia','vovos','executiva','entregador'];
const novo=(o)=>{ g.save=L.normSave(Object.assign({bank:2000,dia:5},o||{})); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.startDay(5); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0; };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const BAS={pastel:{garagem:1},chapa:{garagem:1},fritos:{garagem:1}};   // v12.10: os 3 básicos da Garagem (os assados e os vegetarianos saíram dela)
const I=L.PONTOS[1];

// ---------- o cardápio e os cursos ----------
const CJ=Object.keys(C).filter(k=>C[k].cat==='junina');   // v10.6: os 3 pratos da barraca junina (curso 'junina', que não existe: nunca são sabidos)
ok(Object.keys(C).length-CJ.length===65 && CJ.join()==='pamonha,milho,canjica,curau,milhoCoalho,bolo,cremeMilho,pamonhaMel,canjicaCoco' && CJ.every(k=>C[k].curso==='junina' && !C[k].carne && !L.cursoOf('junina')),'65 pratos no cardápio (30 até a v12.6 + os 29 da Avenida e do Terraço da v12.7 + os 6 de estrada da v12.10) e, à parte, os 9 juninos (3 da v10.6 e 6 da v12.7)');
ok(Object.keys(C).filter(k=>C[k].cat!=='junina'&&k!=='liaRisoto').every(k=>C[k].cat && ['pf','frito','assado','chapa','pastel'].includes(C[k].cat) && (C[k].curso===null || L.cursoOf(C[k].curso))),'cada prato tem categoria e curso (ou nenhum)');
ok(['pf:30','coxinha:10','risoles:7','kibe:8','bolinho:10','misto:12','bauru:14','paoChapa:8','pastel:12','pastelQ:12','pastelP:13'].every(x=>C[x.split(':')[0]].preco.garagem===+x.split(':')[1]) && ['empada:12','esfihaA:9','esfihaF:9','pfVeg:32','empadaPalmito:12','kibeAbobora:9','pfVegano:32','coxinhaJaca:11','pastelPalmito:13','esfihaSoja:9','mistoVegano:13'].every(x=>C[x.split(':')[0]].preco.garagem===undefined && C[x.split(':')[0]].preco.industrial===+x.split(':')[1]),'os preços da Garagem (os 11 pratos dela) e os da área industrial dos 11 que saíram da Garagem (v10.5: × 1,2; v12.10)');
ok(Object.keys(C).filter(k=>C[k].cat!=='junina'&&!C[k].carne&&!C[k].veg).sort().join()==='paoChapa,pastelQ' && Object.keys(C).filter(k=>C[k].cat!=='junina'&&!C[k].carne).length===30,'sem carne de fábrica: só o pão na chapa e o pastel de queijo (mais os pratos do curso Vegetariano e os sem carne dos pontos novos)');
ok(L.CURSOS.map(c=>c.id).join()==='pastel,chapa,fritos,assados,veg,pf,restaurante,entradas,alta' && ['pastel','chapa','fritos'].map(id=>L.CURSOS.find(c=>c.id===id).degraus.garagem).map(d=>d.preco+':'+d.av.preco).join()==='110:210,130:250,150:310','cursos: 9 técnicas; na Garagem pastel 110/210, chapa 130/250 e fritos 150/310 (v12.10: um degrau por ponto, os preços dos outros pontos no smoke117)');
novo();
ok(L.pratosSabidos(g.save.cursos).join()==='pf,coxinha','save novo: a cozinha só sabe PF e coxinha');
ok(Math.abs(L.avalMenu(g.save.cursos)-2)<1e-9,'Diversidade do cardápio: 2,0 de início');
ok(Math.abs(L.avalMenu({pastel:{garagem:1},chapa:{garagem:1}})-3.2)<1e-9 && Math.abs(L.avalMenu(BAS)-3.8)<1e-9,'+0,6 por técnica com prato sabido (3 técnicas: 3,8)');
ok(Math.abs(L.avalMenu({pastel:{garagem:2},chapa:{garagem:1}})-3.2)<1e-9 && Math.abs(L.avalMenu({pf:{industrial:2}})-2)<1e-9,'o avançado e o do PF não somam nada');
ok(L.GOSTOS.estudante.join()==='2,3,1,2,2' && L.GOSTOS.executiva.join()==='4,0,2,1,0' && L.GOSTOS.familia.join()==='4,1,0,1,2' && L.GOSTOS.vovos.join()==='3,0,3,1,0' && L.GOSTOS.entregador.map(a=>a.join('')).join()==='03210,10000,04101','os pesos dos gostos');

// ---------- comprar curso: um por lojinha, dinheiro, caixa ----------
g.save=L.normSave({bank:1000,dia:3}); g.up=g.save.up; g.boughtFor=0; g.goShop(3);
{ const b0=g.save.bank;
  ok(g.cursoProx('pastel').nivel===1 && g.cursoProx('pf')===null,'o próximo degrau: básico; o PF não tem cartão na Garagem (o PF é de base)');
  ok(g.buyCurso('pastel') && g.save.bank===b0-110 && g.save.cursos.pastel.garagem===1 && g.save.cursoDia===3,'comprar o curso de pastel: R$ 110, nível 1, dia 3');
  ok(/curso de Pastel de feira/.test(g.cursoMsg),'a fala: "O Tonhão foi fazer o curso de Pastel de feira!"');
  ok(g.save.caixaPend.mel===110,'a compra entra no Caixa, na coluna Compras');
  ok(g.cursoTrava && !g.buyCurso('chapa') && g.save.bank===b0-110,'um curso por lojinha: o segundo fica travado');
  L.setShopTab('cursos'); const t=txt(els['shop-grid']); if(process.env.V) console.log(t);
  ok(/Comprar R\$/.test(t)&&!/Receitas/.test(t)&&/Em curso/.test(t),'aba Cursos: pratos, o avançado do PF e o aviso do curso do dia');
  g.goShop(4); ok(!g.cursoTrava && g.buyCurso('chapa') && g.save.cursos.chapa.garagem===1,'na lojinha seguinte, outro curso');
  g.goShop(5); ok(g.cursoProx('pastel').nivel===2 && g.cursoProx('pastel').preco===210 && g.buyCurso('pastel') && g.save.cursos.pastel.garagem===2,'feito o básico, vem o avançado (R$ 210)');
  g.goShop(6); g.save.bank=100; ok(!g.buyCurso('fritos') && g.save.cursos.fritos===undefined,'sem dinheiro, não compra');
  g.save.bank=1000; ok(g.buyCurso('fritos'), 'com dinheiro, compra'); g.goShop(7); ok(g.cursoProx('fritos').nivel===2 && g.buyCurso('fritos') && g.cursoProx('fritos')===null,'o avançado de fritos, e depois "curso completo"'); }

// ---------- o avançado: +15% no preço, caprichado x1,5 ----------
{ const cu={fritos:{garagem:2},chapa:{garagem:1}};
  ok(L.precoPrato('pf',null,cu)===30 && L.precoPrato('pf',I,{pf:{industrial:2}})===Math.round(34*L.CURSO_AV.preco) && L.precoPrato('coxinha',null,cu)===Math.round(10*L.CURSO_AV.preco) && L.precoPrato('kibe',null,cu)===Math.round(8*L.CURSO_AV.preco),'avançado: coxinha 10 a 13 (vale também para a coxinha) e kibe 8 a 10 (v10.5; ×1,25 desde a v12.10.3); o PF só sobe com as Carnes variadas da área industrial (34 a 43)');
  ok(L.precoPrato('bauru',null,cu)===14 && L.precoPrato('pf',null,{})===30 && L.precoPrato('coxinha',null,{})===10,'sem o avançado, o preço é o de sempre');
  novo({cursos:cu}); const k=g.kitchen, cr=k.chef.crit;
  ok(Math.abs(k.chefCrit('pf')-cr)<1e-9 && Math.abs(k.chefCrit('coxinha')-cr*1.5)<1e-9 && Math.abs(k.chefCrit('bauru')-cr)<1e-9 && Math.abs(k.chefCrit('pastel')-cr)<1e-9,'caprichado x1,5 só nos pratos do curso avançado feito');
  const gr=new L.Group(g,'executiva',1,0,false); gr.dishes=['coxinha']; ok(L.precoPrato(gr.dishes[0],g.ponto,g.cursos)===Math.round(10*L.CURSO_AV.preco),'o jogo cobra o preço do avançado'); }

// ---------- quem pede o quê ----------
{ novo(); let n=0, so=true, extraPf=false;
  for(let i=0;i<1000;i++){ const tp=TIPOS[i%5], gr=new L.Group(g,tp,i,0,false);
    gr.dishes.concat(gr.extras).forEach(k=>{ if(k && !['pf','coxinha'].includes(k)) so=false; });
    gr.extras.forEach(k=>{ if(k==='pf') extraPf=true; }); n++; }
  ok(so && !extraPf,'sem cursos: 1.000 grupos pedem só PF e coxinha, e o 2º item nunca é PF'); }
{ novo({cursos:{pastel:{garagem:1},fritos:{garagem:1}}}); const sab=L.pratosSabidos(g.save.cursos), vistos={}; let so=true, extraPf=false, exeFrito=false, exePastel=false;
  for(let i=0;i<2000;i++){ const tp=TIPOS[i%5], gr=new L.Group(g,tp,i,0,false);
    gr.dishes.concat(gr.extras).forEach(k=>{ if(k){ vistos[k]=1; if(!sab.includes(k)) so=false; } });
    gr.extras.forEach(k=>{ if(k==='pf') extraPf=true; });
    if(tp==='executiva') gr.dishes.forEach((k,i)=>{ if(!gr.people[i].veg) if(C[k].cat==='frito'||C[k].cat==='pastel') { if(C[k].cat==='frito') exeFrito=true; else exePastel=true; } }); }
  ok(so && !extraPf,'com pastel e fritos: 2.000 grupos só pedem pratos sabidos, e o 2º item nunca é PF');
  ok(sab.every(k=>vistos[k]),'e todos os pratos sabidos aparecem ('+Object.keys(vistos).length+' de '+sab.length+')');
  ok(!exeFrito && !exePastel,'a executiva não gosta de frito nem de pastel'); }
{ novo({cursos:BAS}); const vez=f=>{ g.clock=g.day.time*(1-f); const c={}; for(let i=0;i<600;i++){ const gr=new L.Group(g,'entregador',i,0,false); const k=gr.dish; c[C[k].cat]=(c[C[k].cat]||0)+1; } return c; };
  const a=vez(0.15), b=vez(0.5), d=vez(0.85);
  ok(!a.pf && !a.pastel && a.frito>0 && a.chapa>0,'entregador, 1º terço: nunca PF, frito e chapa (v12.10: sem assado na Garagem)');
  ok(Object.keys(b).join()==='pf','entregador, 2º terço: só PF');
  ok(!d.pf && !d.chapa && d.frito>0 && d.pastel>0,'entregador, 3º terço: frito e pastel (v12.10: sem assado na Garagem)'); }
{ novo({cursos:BAS}); const vistos={}; for(let i=0;i<4000;i++){ const gr=new L.Group(g,TIPOS[i%5],i,0,false); gr.dishes.concat(gr.extras).forEach(k=>{ if(k) vistos[k]=1; }); }
  ok(Object.keys(vistos).length===11,'com os 3 cursos básicos da Garagem, os 11 pratos aparecem ('+Object.keys(vistos).length+')'); }
ok(L.pedePrato('executiva',{cursos:{},day:{time:100},clock:50},true)==='coxinha' && L.pedePrato('entregador',{cursos:{},day:{time:100},clock:70})==='coxinha','sem categoria possível: coxinha no 2º item, e a coxinha também no 1º terço do entregador');

// ---------- Missão zero e Turno sem fim ----------
{ g.startTreino(); ok(g.mode==='treino' && L.pratosSabidos(g.cursos).join()==='pf,coxinha','Missão zero: só PF e coxinha'); let so=true;
  for(let i=0;i<300;i++){ const gr=new L.Group(g,TIPOS[i%4],i,0,false); if(gr.dishes.some(k=>!['pf','coxinha'].includes(k))||gr.extras.some(Boolean)) so=false; }
  ok(so,'e sem 2º item'); }
{ g.startEndless(); ok(g.mode==='semfim' && L.pratosSabidos(g.cursos).length===11 && L.avalMenu(g.cursos)>3.7 && !L.CURSOS.some(c=>L.cursoNivel(g.cursos,c.id)>=2),'Turno sem fim: os 11 pratos dos 3 cursos básicos da Garagem, sem avançado'); }

// ---------- save antigo ----------
{ const rk=JSON.stringify({carreira:[{key:'velho',nome:'Velho',pontos:9000,dia:7}],semfim:[]});
  const A=load({saveAntigo:true,store:{lcc2_save:JSON.stringify({dia:5,bank:900,lucroTot:300,treino:true,up:{tenis:true}}),lcc2_ranking:rk}});
  ok(A.g.save.dia===1 && A.g.save.bank===normB(A) && A.g.save.avisoCard===true && A.g.save.cardV===1 && A.g.save.treino===true && !A.g.save.up.tenis,'save antigo: a campanha recomeça do dia 1 (a Missão zero fica) e vem o aviso');
  ok(A.store.lcc2_ranking===rk && A.store.lcc2_abertura==='1','o ranking e a abertura ficam');
  A.g.setState('menu'); ok(A.els['menu-aviso'].style.display==='' && /cardápio agora cresce/.test(A.els['menu-aviso-txt'].textContent),'o menu mostra o aviso');
  A.els['btn-aviso'].fire('click'); ok(A.els['menu-aviso'].style.display==='none' && !A.g.save.avisoCard && !JSON.parse(A.store.lcc2_save).avisoCard,'"Entendi" fecha o aviso de vez');
  const B=load({store:{lcc2_save:A.store.lcc2_save}}); ok(B.g.save.dia===1 && !B.g.save.avisoCard,'reabrir não recomeça nem avisa de novo');
  const N=load({saveAntigo:true,store:{lcc2_save:JSON.stringify({dia:1,bank:500})}}); ok(N.g.save.dia===1 && !N.g.save.avisoCard,'save antigo sem jogo nenhum: recomeça sem aviso');
  const V=load(); ok(!V.g.save.avisoCard && V.g.save.cardV===1,'primeira vez: sem aviso');
  const S=load({store:{lcc2_save:JSON.stringify({dia:6,bank:900,cursos:{pastel:{garagem:2},chapa:{garagem:1},pf:{industrial:1,terraco:2},xx:{garagem:2}},cursoDia:5})}}); ok(S.g.save.dia===6 && S.g.save.cursos.pastel.garagem===2 && S.g.save.cursos.chapa.garagem===1 && S.g.save.cursos.pf.industrial===undefined && S.g.save.cursos.pf.terraco===2 && S.g.save.cursos.xx===undefined,'save novo: os cursos voltam como estavam (e o lixo sai)'); }
function normB(A){ return A.L.normSave({}).bank; }


// ---------- v8.6.11: vegetarianos e veganos ----------
{ const V=L.CARDAPIO;
  ok(V.pfVeg.preco.industrial===32 && V.empadaPalmito.preco.industrial===12 && V.kibeAbobora.preco.industrial===9 && V.coxinhaJaca.preco.industrial===11 && V.pastelPalmito.preco.industrial===13 && V.esfihaSoja.preco.industrial===9 && V.mistoVegano.preco.industrial===13 && V.pfVegano.preco.industrial===32,'preços dos pratos vegetarianos e veganos na área industrial (v10.5: × 1,2; v12.10: saíram da Garagem)');
  novo({cursos:{}}); ok(Math.abs(L.vegMov(g.save.cursos)-1)<1e-9 && !L.pratoSabido('pfVeg',{},I) ,'sem o curso Vegetariano: nada de pratos sem carne a mais, movimento ×1');
  ok(Math.abs(L.vegMov({veg:{industrial:1}})-1.05)<1e-9 && Math.abs(L.vegMov({veg:{industrial:2}})-1.10)<1e-9,'o curso soma 5% de movimento, o avançado mais 5%');
  { const v1={veg:{industrial:1}}, f=(o)=>Object.assign({},v1,o); ok(L.pratoSabido('pfVeg',v1,I) && !L.pratoSabido('empadaPalmito',v1,I) && L.pratoSabido('empadaPalmito',f({assados:{industrial:1}}),I) && !L.pratoSabido('kibeAbobora',f({assados:{industrial:1}}),I) && L.pratoSabido('kibeAbobora',f({fritos:{garagem:1}}),I),'empada de palmito só com assados, kibe de abóbora só com fritos (o degrau da Garagem vale na área industrial)'); }
  { const v1={veg:{industrial:1}}, v2={veg:{industrial:2}}, f=(o)=>Object.assign({},v2,o); ok(!L.pratoSabido('pfVegano',v1,I) && L.pratoSabido('pfVegano',v2,I) && !L.pratoSabido('coxinhaJaca',v2,I) && L.pratoSabido('coxinhaJaca',f({fritos:{garagem:1}}),I) && !L.pratoSabido('pastelPalmito',f({fritos:{garagem:1}}),I) && L.pratoSabido('mistoVegano',f({chapa:{garagem:1}}),I),'os veganos pedem o avançado e o básico do curso de que dependem'); }
  ok(Math.abs(L.avalMenu({pastel:{garagem:1},chapa:{garagem:1},fritos:{garagem:1},assados:{industrial:1},veg:{industrial:1}},0,I)-5)<1e-9,'com os 5 básicos na área industrial, a Diversidade do cardápio é 5,0');
  ok(L.precoPrato('pfVeg',I,{veg:{industrial:2}})===Math.round(32*L.CURSO_AV.preco) && L.precoPrato('pfVegano',I,{veg:{industrial:2}})===32,'avançado: +CURSO_AV.preco no PF vegetariano, e os veganos ficam no preço comum');
  // pedem: o vegetariano só come sem carne; sem opção, coxinha (Cardápio 1)
  novo({salao:{ponto:'industrial'},cursos:{veg:{industrial:1},assados:{industrial:1}}}); let so=true, vegN=0, viuPfv=false;
  for(let i=0;i<3000;i++){ const gr=new L.Group(g,TIPOS[i%4],i,0,false); gr.people.forEach((p,j)=>{ if(p.veg){ vegN++; if(L.CARDAPIO[gr.dishes[j]].carne) so=false; if(gr.extras[j] && L.CARDAPIO[gr.extras[j]].carne) so=false; } }); if(gr.dishes.includes('pfVeg')) viuPfv=true; }
  ok(vegN>0 && so,'com o curso, a pessoa vegetariana ('+vegN+') só pede prato sem carne');
  ok(viuPfv,'quem não é vegetariano também pede o PF vegetariano às vezes');
  novo({cursos:{}}); let semOp=true, nVeg=0, nSem=0, ent=false, treino=false;
  for(let i=0;i<4000;i++){ const gr=new L.Group(g,TIPOS[i%5],i,0,false); if(TIPOS[i%5]==='entregador' && gr.people.some(p=>p.veg)) ent=true; const tem=gr.people.some(p=>p.veg); if(tem){ nVeg++; if(gr.semVeg) nSem++; if(!gr.semVeg) semOp=false; } }
  ok(nVeg>0 && nSem===nVeg && semOp && !ent,'sem nenhum prato sem carne: todo grupo com vegetariano fica semVeg ('+nVeg+'), e o entregador nunca é vegetariano');
  const frac=nVeg/4000; ok(frac>0.08 && frac<0.35,'~10% das pessoas são vegetarianas: '+(frac*100).toFixed(1)+'% dos grupos têm alguma');
  // o Gúgou: Cardápio 1 e o comentário
  novo({cursos:{}}); g.mode='carreira'; g.avals=[]; const gr=new L.Group(g,'executiva',1,0,false); gr.people[0].veg=true; gr.dishes[0]='coxinha'; gr.semVeg=true; gr.avalia=true; gr.pratoQ=5; gr.state='eating'; gr.table=g.tables[0];
  for(let i=0;i<20;i++) g.avaliar(gr,0,0);
  const av=g.avals; ok(av.every(a=>a.s[3]===1),'o grupo sem prato vegetariano dá Cardápio 1');
  ok(av.some(a=>a.txt==='Não tinha nada vegetariano.'),'e o comentário: "Não tinha nada vegetariano."');
  // desenho de todos os pratos
  let erro=''; Object.keys(L.CARDAPIO).forEach(k=>{ try{ [0.52,0.85,1.1].forEach(s=>L.drawDish(H.ctx,k,0,0,s)); }catch(e){ erro=k+': '+e.message; } });
  ok(!erro,'todo prato do cardápio desenha sem erro '+erro); }

// ---------- v8.6.10: os desenhos e as Carnes variadas ----------
{ const c=new Proxy({},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>{o[k]=v;return true;}}); let erro=null;
  try{ Object.keys(C).forEach(k=>{ [false,true].forEach(av=>{ L.drawDish(c,k,10,10,1,false,'bife',av); L.drawDish(c,k,10,10,0.52,true,'bife',av); L.drawMarmita(c,k,10,10,1); }); }); L.CARNES.forEach(cn=>L.drawDish(c,'pf',10,10,1,false,cn,true)); }catch(e){ erro=e; }
  ok(!erro && L.CARNES.join()==='bife,frango,peixe,cavalo','todo prato do CARDAPIO desenha sem erro (comum, avançado e na marmita) e as 4 proteínas do PF');
  novo();
  const gr=()=>new L.Group(g,'familia',1,0,false);
  ok(Array.from({length:40},gr).every(x=>x.carnes.length===x.size && x.carnes.every(cn=>cn==='bife')),'sem o avançado do PF, todo PF vem com bife');
  novo({salao:{ponto:'industrial'},cursos:{pf:{industrial:2}}});
  const vistos=new Set(); Array.from({length:200},gr).forEach(x=>x.carnes.forEach(cn=>vistos.add(cn)));
  ok(['bife','frango','peixe','cavalo'].every(cn=>vistos.has(cn)) && vistos.size===4,'com Carnes variadas, o PF sorteia as 4 proteínas'); }

// v8.6.13: quem pede salgado pede um 2º item em MAIS.salgado das vezes; quem pede PF, na chance do tipo (executiva, 10%)
{ novo({cursos:BAS}); ok(L.MAIS.salgado===0.8,'MAIS.salgado = 0,8');
  let sal=0, salM=0, pf=0, pfM=0;
  for(let i=0;i<3000;i++){ const gr=new L.Group(g,'executiva',i,0,false); gr.dishes.forEach((k,j)=>{ if(L.CARDAPIO[k].cat==='pf'){ pf++; if(gr.extras[j]) pfM++; } else { sal++; if(gr.extras[j]) salM++; } }); }
  ok(salM/sal>0.72 && salM/sal<0.88 && pfM/pf<0.15,'salgado vem em dois em ~80% das vezes, o PF fica na chance do tipo ('+(salM/sal).toFixed(2)+' e '+(pfM/pf).toFixed(2)+')'); }
console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
