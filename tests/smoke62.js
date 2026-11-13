// v10.2, etapa 4a-3: a cozinha do Terraço. Cursos Entradas finas e Alta gastronomia (só no Terraço; a regra do prato fino na entrada e no principal; vegetariano acha
// opção; contam na experiência do Tonhão e na Diversidade), a Lia (ajudante de cozinha: R$ 80/dia, cozinha ×0,75, a 1ª a não vir no corte, só no Terraço, conversa e
// Manual) e o curso Alta confeitaria da Dani (doces a R$ 30, +0,4 no Ambiente), mais o save da v10.1.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<20){ toque(H.els); n++; } return n; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,ponto,sv,sem)=>{ const H=nova(sem?{historia:false}:{}), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto:ponto||'garagem' } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const terr=(sv,cap,sem)=>{ const H=jogo(cap||8,'terraco',Object.assign({ bank:9000, v10:1, daniCursos:{ confCaseira:1 }, up:{ tenis:true, fogaoInd:true }, equipe:{ tonhao:3, dani:2, anselmo:2 } },sv||{}),sem);
  H.g.startDay(10); H.els['btn-start'].fire('click'); H.g.schedule=[]; H.g.nextIdx=0; return H; };
const preco=(L,g,k)=>k?L.precoPrato(k,g.ponto,g.cursos):0;
const FINAS=['bruschetta','bacalhau','quiche'], ALTAS=['risoto','peixe','medalhao'];
const TIPOS=['estudante','executiva','familia','vovos','turma','motorista','negocios','casal'];

// ---------- 1. os dois cursos só no Terraço, com os preços do plano ----------
{ const H=jogo(8,'terraco',{ v10:1, bank:9000 },true), {g,L}=H;
  const e=L.cursoOf('entradas'), a=L.cursoOf('alta');
  ok(e && a && e.preco===600 && e.av.preco===900 && a.preco===900 && a.av.preco===1400 && e.nivel===4 && a.nivel===4,'cursos: Entradas finas 600/900 e Alta gastronomia 900/1400, nivel 4');
  ok(L.cursoOk(e,g.ponto) && L.cursoOk(a,g.ponto),'no Terraço, os dois cursos aparecem');
  const Ha=jogo(9,'avenida'), Hg=nova();
  ok(!Ha.L.cursoOk(Ha.L.cursoOf('entradas'),Ha.g.ponto) && !Ha.L.cursoOk(Ha.L.cursoOf('alta'),Ha.g.ponto) && !Hg.L.cursoOk(Hg.L.cursoOf('alta'),Hg.g.ponto),'na Avenida e na Garagem, não');
  ok(FINAS.concat(ALTAS).every(k=>L.CARDAPIO[k].fino===true) && FINAS.concat(ALTAS).map(k=>L.CARDAPIO[k].preco).join()==='17,19,18,46,50,55','os 6 pratos finos, com os preços da Garagem (v10.5: × 1,2)');
  ok(L.CARDAPIO.bruschetta.cat==='chapa' && L.CARDAPIO.bacalhau.cat==='frito' && L.CARDAPIO.quiche.cat==='assado' && ALTAS.every(k=>L.CARDAPIO[k].cat==='pf'),'categorias: entradas na chapa, no frito e no assado; principais no PF');
  ok(!L.CARDAPIO.bruschetta.carne && !L.CARDAPIO.quiche.carne && !L.CARDAPIO.risoto.carne && L.CARDAPIO.bacalhau.carne && L.CARDAPIO.peixe.carne,'sem carne: bruschetta, quiche e risoto');
  g.save.cursoDia=0; ok(g.buyCurso('entradas') && g.save.cursos.entradas===1 && g.save.bank===9000-600,'comprar o básico das entradas custa R$ 600');
  ok(!g.buyCurso('alta'),'um curso por lojinha');
  g.save.cursoDia=0; ok(g.buyCurso('alta') && g.save.cursos.alta===1,'no dia seguinte, a alta gastronomia');
  g.save.cursoDia=0; ok(g.buyCurso('entradas') && g.save.cursos.entradas===2,'o avançado das entradas (Entradas de chef)');
  ok(L.pratoAv('bruschetta',g.save.cursos) && !L.pratoAv('risoto',g.save.cursos),'o avançado só vale para os pratos do curso');
  ok(preco(L,g,'bruschetta')===Math.round(17*g.ponto.cardapio*1.15) && preco(L,g,'risoto')===Math.round(46*g.ponto.cardapio),'preço no Terraço (×'+g.ponto.cardapio+'): avançado ×1,15');
  ok(L.precoPrato('medalhao',g.ponto,{})===Math.round(55*g.ponto.cardapio),'medalhão: R$ '+L.precoPrato('medalhao',g.ponto,{})+' no Terraço'); }

// ---------- 2. a regra do prato fino ----------
{ const H=terr(), {g,L}=H;
  const amostra=(fn,n)=>{ const o={}; for(let i=0;i<n;i++){ const k=fn(); o[k]=(o[k]||0)+1; } return o; };
  const T=()=>TIPOS[Math.floor(Math.random()*TIPOS.length)];
  g.save.cursos=L.normCursos({});
  const sem=amostra(()=>L.pedePrato(T(),g,true,false),600);
  ok(Object.keys(sem).every(k=>!L.CARDAPIO[k].fino),'sem os cursos, a entrada é a de sempre (nenhuma fina)');
  const semP=amostra(()=>L.pedePrincipal(T(),g,false),400); ok(Object.keys(semP).every(k=>!L.CARDAPIO[k].fino),'sem os cursos, o principal é o de sempre');
  g.save.cursos=L.normCursos({ entradas:1, restaurante:1, fritos:1 });
  const ent=amostra(()=>L.pedePrato(T(),g,true,false),900);
  ok(Object.keys(ent).every(k=>FINAS.indexOf(k)>=0) && FINAS.every(k=>ent[k]>0),'com as Entradas finas, a entrada sai só entre as finas (e as três saem)');
  const prin=amostra(()=>L.pedePrincipal(T(),g,false),400); ok(Object.keys(prin).every(k=>!L.CARDAPIO[k].fino),'só com as entradas, o principal segue sem fino (PF, parmegiana...)');
  const vegE=amostra(()=>L.pedePrato(T(),g,true,true),400); ok(Object.keys(vegE).every(k=>k==='bruschetta'||k==='quiche'),'o vegetariano acha entrada fina: bruschetta ou quiche');
  g.save.cursos=L.normCursos({ alta:1, restaurante:1 });
  const pr=amostra(()=>L.pedePrincipal(T(),g,false),600);
  ok(Object.keys(pr).every(k=>ALTAS.indexOf(k)>=0) && ALTAS.every(k=>pr[k]>0),'com a Alta gastronomia, o principal sai só entre os finos (e os três saem)');
  const ent2=amostra(()=>L.pedePrato(T(),g,true,false),400); ok(Object.keys(ent2).every(k=>!L.CARDAPIO[k].fino),'só com a alta, a entrada segue sem fino');
  const vegP=amostra(()=>L.pedePrincipal(T(),g,true),200); ok(Object.keys(vegP).length===1 && vegP.risoto>0,'o vegetariano acha principal fino: o risoto');
  // o peso: gosto + 1 (a executiva não gosta de frito, mas o bolinho de bacalhau ainda sai)
  g.save.cursos=L.normCursos({ entradas:1 });
  const ex=amostra(()=>L.pedePrato('executiva',g,true,false),1500); ok(ex.bacalhau>0 && ex.bruschetta>ex.bacalhau,'o peso é o gosto do tipo mais 1: a executiva (gosta de PF e assado) quase não pede o frito, mas pede');
  // fora do Terraço a regra não vale (nível do ponto < 4): a entrada sai de todas as categorias que a cozinha sabe
  const Ha=jogo(9,'avenida',{},true); Ha.g.save.cursos=Ha.L.normCursos({ entradas:1, fritos:1, assados:1 }); Ha.g.mode='carreira';
  const fa=amostra(()=>Ha.L.pedePrato('casal',Ha.g,true,false),600); ok(Object.keys(fa).some(k=>!Ha.L.CARDAPIO[k].fino),'fora do Terraço a regra do prato fino não vale'); }

// ---------- 3. experiência do Tonhão e Diversidade ----------
{ const H=terr(), {g,L}=H;
  const base=L.tonhaoXp({}); const x1=L.tonhaoXp({ entradas:1 }), x2=L.tonhaoXp({ entradas:2, alta:2 });
  ok(x1-base===L.CURSO_XP.basico && x2-base===2*(L.CURSO_XP.basico+L.CURSO_XP.avancado),'cada curso novo dá +1 (básico) e +2 (avançado) de experiência');
  const m0=L.avalMenu({}), m1=L.avalMenu({ entradas:1 }), m2=L.avalMenu({ entradas:1, alta:1 });
  ok(m1>m0 && m2>m1,'a Diversidade do cardápio sobe com cada curso (de '+m0+' a '+m2+')');
  const sab=L.pratosSabidos(L.normCursos({ entradas:1, alta:1 })); ok(FINAS.concat(ALTAS).every(k=>sab.indexOf(k)>=0),'a cozinha sabe os 6 pratos finos'); }

// ---------- 4. a Lia ----------
{ const H=terr({ bank:3000 },8,true), {g,L}=H;
  ok(L.STAFF.lia.pay===80 && L.STAFF.lia.cook===0.75,'STAFF.lia: R$ 80 por dia e cozinha ×0,75');
  ok(g.cartaoAberto('lia'),'no Terraço, fora do Modo História, o cartão da Lia está aberto');
  const folha0=g.payroll(); ok(g.setStaff('lia',1) && g.save.equipe.lia===1,'contratar a Lia'); ok(g.payroll()-folha0===80,'R$ 80 na folha');
  ok(!g.setStaff('lia',0),'contratar é definitivo (não dá para dispensar)');
  ok(g.liaAtiva && L.liaOn(g.save.equipe,g.ponto),'a Lia trabalha no dia');
  // a cozinha anda 25% mais rápida
  const med=(ativa)=>{ g.save.equipe.lia=ativa?1:0; let s=0; const n=600, grp=g.spawn({ type:'casal', color:0, vip:false, av:true });
    for(let i=0;i<n;i++){ g.kitchen.queue=[]; g.kitchen.cooking=[]; g.kitchen.submitTempo(grp,1,1); s+=g.kitchen.queue[0].time; } return s/n; };
  const sem=med(false), com=med(true); ok(Math.abs(com/sem-0.75)<0.06,'com a Lia a cozinha leva ×0,75 do tempo ('+(com/sem).toFixed(2)+')');
  g.save.equipe.lia=1;
  const mm=(ativa)=>{ g.save.equipe.lia=ativa?1:0; let s=0; for(let i=0;i<400;i++){ g.kitchen.queue=[]; g.kitchen.submitMarmita('pf',null); s+=g.kitchen.queue[0].time; } return s/400; };
  const m0=mm(false), m1=mm(true); ok(Math.abs(m1/m0-0.75)<0.07,'a marmita também ('+(m1/m0).toFixed(2)+')');
  g.save.equipe.lia=1;
  // o corte da folha: depois das TVs, antes do Anselmo
  const eq={ tonhao:3, dani:2, joca:0, cami:0, anselmo:2, lia:1, tvs:0, tv:false, som:false, couvert:false };
  const p0=L.payroll(eq), n1=L.folhaCorta(eq); ok(n1==='a Lia (sem salário hoje)' && eq.liaFora===true && p0-L.payroll(eq)===80,'o 1º corte da folha é a Lia ("não vem"): R$ 80 a menos');
  const n2=L.folhaCorta(eq); ok(n2==='o Anselmo (sem salário hoje)','o 2º é o Anselmo');
  const eq2={ tonhao:3, dani:2, joca:0, cami:0, anselmo:2, lia:1, tvs:1, tv:false, som:false, couvert:false }; ok(L.folhaCorta(eq2)==='TVs','as TVs saem antes da Lia');
  ok(L.folhaItens({ tonhao:0, dani:1, lia:1 }).indexOf('Lia')>=0,'a Lia aparece na lista da folha');
  // payDay zera o "não vem" do dia
  g.save.equipe.liaFora=true; g.payDay(); ok(g.save.equipe.liaFora===false || g.save.bank>=g.payroll(),'payDay recomeça o dia sem o "não vem" (ou o caixa cobre a folha)');
  // só no Terraço
  const Ha=jogo(9,'avenida',{ bank:3000 }); ok(!Ha.g.setStaff('lia',1) && Ha.L.normEquipe({ lia:1 },Ha.g.ponto).lia===0,'na Avenida não dá para contratar, e o save da Avenida zera a Lia');
  const Hg=nova(); ok(Hg.L.normEquipe({ lia:1 },Hg.g.ponto).lia===0,'na Garagem também');
  ok(L.normEquipe({ lia:1 },g.ponto).lia===1 && L.normEquipe({ lia:7 },g.ponto).lia===1 && L.normEquipe({},g.ponto).lia===0,'normEquipe: 0 ou 1 no Terraço'); }

// ---------- 5. a conversa da Lia, no Modo História ----------
{ const H=nova({historia:true}), {g,L,els}=H; g.save=L.normSave({ histV:1, cap:8, dia:10, maxDay:10, bank:9000, v10:1, convEnt:1, convCard:1, convDiv:1, convPlanta:1, up:{ tenis:true, fogaoInd:true }, equipe:{ tonhao:3, dani:2, anselmo:2 }, daniCursos:{ confCaseira:1 }, salao:{ ponto:'terraco' }, pontoDia:10 });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.save.conversa=null; g.goShop(10);
  ok(!g.cartaoAberto('lia') && g.save.libera.lia===0,'na História, o cartão da Lia começa fechado');
  g.save.cursoDia=0; g.buyCurso('entradas'); g.startDay(10); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0;
  g.groups=[]; g.queue=[]; g.money=100; g.custo=0; g.finishDay();
  ok(g.save.libera.lia==='pend' && !!g.conversa,'depois do curso do Tonhão, a conversa fica pendente e toca no fim do dia');
  const vistas=[]; { let k=0; while(g.conversa && k<30){ vistas.push(g.conversa.fala.q+':'+g.conversa.fala.s.slice(0,18)); toque(els); k++; } } 
  const n=vistas.length; ok(n>=5 && g.save.libera.lia===1 && !g.conversa && g.cartaoAberto('lia'),'a conversa tem '+n+' falas; no fim o cartão abre (selo novo)');
  const F=L.liberaOf('lia'); ok(F.falas.length===5 && F.falas.map(f=>f.q).join()==='tonhao,bia,tonhao,lia,bia' && L.HIST_NOMES.lia==='Lia','as falas: Tonhão, Bia, Tonhão, Lia, Bia');
  ok(F.nivel===4 && F.dia===1 && F.ate===999 && F.reclama.length===2 && F.reclama[0]==='A comida demorou entre um prato e outro.' && F.reclama[1]==='Cozinha lenta para um terraço.','LIBERA.lia: nivel 4, dia 1, ate 999 e as duas reclamações');
  ok(/Onde eu guardo as facas/.test(F.falas[3].s) && F.falas[0].nota==='secando as mãos no avental','os textos do plano'); }

// ---------- 6. a Alta confeitaria da Dani ----------
{ const H=terr({ daniCursos:{ confCaseira:1, confGourmet:1 }, bank:9000 }), {g,L}=H;
  const c=L.DANI_CURSOS.find(q=>q.id==='confAlta'); ok(c && c.preco===600 && c.nivel===4 && c.dep==='confGourmet' && c.item,'DANI_CURSOS.confAlta: R$ 600, nivel 4, depende da gourmet');
  ok(L.DOCES.alta.map(d=>d.id).join()==='entremet,milfolhas,macaron' && L.DOCES.altaPreco===30 && L.DOCES.altaIngred===7 && L.AVAL.amb.doceAlta===0.4,'DOCES.alta: 3 doces, R$ 30, ingrediente R$ 7, +0,4 no Ambiente');
  ok(L.docesLista(g.up)===L.DOCES.gourmet && L.docePreco(g.up)===16,'antes do curso, a vitrine segue gourmet (R$ 16)');
  ok(g.buyDaniCurso('confAlta') && g.up.confAlta===true,'comprar o curso liga a alta confeitaria');
  ok(L.docesLista(g.up)===L.DOCES.alta && L.docePreco(g.up)===30 && L.doceIngred(g.up)===7 && L.doceIcone(g.up)===8,'doces do Terraço: lista, R$ 30, ingrediente R$ 7');
  ok(L.doceIdx('entremet')===6 && L.doceIdx('milfolhas')===7 && L.doceIdx('macaron')===8,'os 3 ícones novos (6 a 8)');
  const s=L.normSave(JSON.parse(JSON.stringify(g.save))); ok(s.daniCursos.confAlta===1 && s.up.confAlta===true,'o save guarda o curso');
  const H2=terr({ daniCursos:{ confCaseira:1 }, bank:9000 }); ok(!H2.g.buyDaniCurso('confAlta'),'sem a gourmet, não dá para fazer a alta');
  const Ha=jogo(9,'avenida',{ daniCursos:{ confCaseira:1, confGourmet:1 }, bank:9000 }); ok(!Ha.g.buyDaniCurso('confAlta'),'na Avenida o curso nem aparece');
  // o Ambiente: +0,4 no lugar do +0,25 de quem comeu o doce
  const amb=(H3,com)=>{ const g3=H3.g, q=new H3.L.Group(g3,'familia',++g3.gid,0,false); q.avalia=true; q.docesDados=com?1:0; q.state='wantBill'; q.hearts=5; q.pratoQ=5; g3.avals.length=0; g3.mode='carreira'; g3.avaliar(q,0,0); return g3.avals[0].s[4]; };
  const Hg=terr({ daniCursos:{ confCaseira:1, confGourmet:1 } },8,true), Hz=terr({ daniCursos:{ confCaseira:1, confGourmet:1, confAlta:1 } },8,true);
  const dg=amb(Hg,true)-amb(Hg,false), dz=amb(Hz,true)-amb(Hz,false);
  ok(dg>0.19 && dg<0.31,'gourmet: +0,25 no Ambiente ('+dg.toFixed(2)+')'); ok(dz>0.34 && dz<0.46,'com a alta confeitaria: +0,4 no Ambiente ('+dz.toFixed(2)+')'); }

// ---------- 7. o Manual e o save ----------
{ const H=jogo(8,'terraco',{ v10:1, equipe:{ tonhao:3, dani:2, lia:1 } }), {g,L}=H;
  const f=L.MANUAL.find(q=>q.id==='e-lia'); ok(f && f.aba==='equipe' && f.quem==='lia' && f.nome==='Lia' && f.linha==='Ajudante de cozinha: com ela, tudo sai mais rápido.','ficha e-lia (aba Equipe)');
  ok(L.manualTracos('lia').join('|')==='cozinha mais rápida' && !/\d/.test(f.linha+L.manualTracos('lia').join(' ')),'o traço "cozinha mais rápida", sem números');
  ok(L.manualSemente(L.normSave({ dia:12, salao:{ ponto:'terraco' }, pontoDia:10, equipe:{ tonhao:3, dani:2, lia:1 } })).indexOf('e-lia')>=0,'um save com a Lia abre a ficha');
  ok(typeof L.drawLia==='function' && L.LIA_HOME.x>766 && L.LIA_HOME.y>200,'drawLia e LIA_HOME expostos (na cozinha)');
  const sv=L.normSave(JSON.parse(JSON.stringify(g.save))); ok(sv.equipe.lia===1,'o save guarda a Lia');
  const old=L.normSave({ v10:1, dia:10, salao:{ ponto:'terraco' }, equipe:{ tonhao:1, dani:1, anselmo:2 }, daniCursos:{ confCaseira:1 } }); ok(old.equipe.lia===0 && !old.up.confAlta && old.cursos.entradas===undefined,'o save da v10.1 carrega igual, sem a Lia nem os cursos');
  ok(/^v10\.(2|3|4|5|6|7)(\.|$)/.test(L.VERSAO),'VERSAO = série v10.2 a v10.7'); }

// ---------- 8. as páginas desenham sem erro (cartão da Lia, Cardápio, os 6 pratos, a Lia na cozinha) ----------
{ const H=jogo(8,'terraco',{ v10:1, equipe:{ tonhao:3, dani:2, lia:1 }, cursos:{ entradas:2, alta:2 }, daniCursos:{ confCaseira:1, confGourmet:1, confAlta:1 } },true), {g,L,els}=H;
  let erro=null; try{ L.setShopTab('lia'); L.setShopTab('cardapio'); L.setShopTab('dani'); L.setShopTab('equipe'); }catch(e){ erro=e; } ok(!erro,'a lojinha desenha Lia, Cardápio e Dani sem erro'+(erro?': '+erro.message:''));
  const gr=els['shop-grid']; const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
  L.setShopTab('lia'); ok(/Lia/.test(txt(gr)) && /mais rápida/.test(txt(gr)),'o cartão da Lia: nome e "A cozinha anda mais rápida"');
  L.setShopTab('cardapio'); ok(/Entradas finas|Entradas de chef/.test(txt(gr)) && /Alta gastronomia|Menu do chef/.test(txt(gr)),'o Cardápio mostra os dois cursos do Terraço');
  g.startDay(10); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; let e2=null; try{ for(let i=0;i<20;i++){ g.update(0.05); L.render(g,H.ctx); } }catch(e){ e2=e; } ok(!e2,'o dia roda e desenha com a Lia na cozinha'+(e2?': '+e2.message:''));
  let e3=null; try{ FINAS.concat(ALTAS).forEach(k=>{ L.drawDish(H.ctx,k,100,100,2,false,'bife',false); L.drawDish(H.ctx,k,100,100,2,false,'bife',true); L.drawMarmita(H.ctx,k,100,100,1); });
    for(let i=0;i<9;i++) L.drawIcon(H.ctx,'doce',50,50,1,i); }catch(e){ e3=e; } ok(!e3,'os 6 pratos finos (comum e avançado) e os doces desenham sem erro'+(e3?': '+e3.message:'')); }

console.log('smoke62: total = '+total+'  fails = '+fails); process.exit(fails?1:0);
