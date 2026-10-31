// v9.5, etapa 3b-5: o Anselmo e os drinks da Avenida (o plano chamava de smoke46; o número já era do fiscal, 3b-4).
// Cartão e contratação, pedidos por tipo, a fila de preparo (4 s / speed, 2 copos no balcão), entrega na conta, Ambiente, folha, conversa e save antigo.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,ponto,sv,o)=>{ const H=nova(o), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:2 }, salao:{ ponto:ponto||'avenida' }, convCard:1, convDiv:1 }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };
const cursos=(H,o)=>{ const {g}=H; Object.keys(o).forEach(k=>{ g.save[k]=Object.assign(g.save[k]||{},o[k]); }); const dc=g.save.daniCursos, jc=g.save.jocaCursos;
  if(dc.confCaseira) g.up.confCaseira=true; if(dc.confGourmet&&dc.confCaseira) g.up.confGourmet=true; if(jc.espresso) g.up.espresso=true; };
// dia aberto na Avenida, sem chegadas
const aberto=(sv,o,cur)=>{ const H=jogo(6,'avenida',Object.assign({ pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2 } },sv||{}),o), {g}=H; if(cur) cursos(H,cur); g.begin(); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); return H; };
const mesa=(H,cafes,doces,tipo)=>{ const {g,L}=H, t=g.tables[0]; const m=new L.Group(g,tipo||'executiva',++g.gid,0,false); m.juiceWant=0; m.cafePede=false; t.group=m; m.table=t; m.setState('eating'); m.timer=0.01; m.hearts=4; m.doces=doces||[]; m.cafes=cafes||[]; g.groups.push(m); m.update(0.05); return m; };

const AV={ daniCursos:{ confCaseira:1 } };
const AN={ equipe:{ tonhao:1, dani:3, joca:3, anselmo:2 } };

// ---------- 1. constantes ----------
{ const {L}=nova(); const c=L.liberaOf('anselmo');
  ok(c && c.nivel===3 && c.dia===3 && c.ate===6 && typeof c.gatilho==='function' && c.falas.length===5 && c.falas.map(f=>f.q).join()==='tonhao,anselmo,bia,anselmo,bia','anselmo: nível 3, dia 3, até 6, 5 falas (Tonhão, Anselmo, Bia, Anselmo, Bia)');
  ok(L.HIST_NOMES.anselmo==='Anselmo' && L.LIBERA.every(l=>l.falas.every(f=>L.HIST_NOMES[f.q])),'HIST_NOMES tem o Anselmo');
  const D=L.DRINKS; ok(D.prep===4 && D.preco===22 && D.ingred===6 && D.vagas===2 && D.itens.map(d=>d.nome).join()==='Pôr do Sol da Avenida,Brisa de Maracujá,Esmeralda' && JSON.stringify(D.pede)===JSON.stringify({ executiva:0.45, negocios:0.6, familia:0.25, vovos:0.25, estudante:0.35 }) && D.vip===0.2,'DRINKS como no plano');
  ok(L.STAFF.anselmo.levels[2].pay===90 && L.STAFF.anselmo.levels[2].speed===0.8 && L.STAFF.anselmo.levels[3].pay===130 && L.PONTOS_ACAO.drink===5 && L.AVAL.amb.drink===0.25 && L.DRINK_PRICE.drink===22,'STAFF.anselmo, pontos, Ambiente e preço do lixo');
  const r=L.LAYOUT.STATIONS.drinks.rect; ok(r.x===620 && r.y===92 && r.w===60 && r.h===50 && L.LAYOUT.STATIONS.drinks.ap.x===700 && L.LAYOUT.STATIONS.drinks.ap.y===150 && L.ANSELMO_HOME.x===650 && L.ANSELMO_HOME.y===118,'estação do balcão e posição dele'); }

// ---------- 2. cartão e contratação ----------
{ let H=jogo(6,'industrial',{ pontoDia:5, libera:{ confeitaria:2, joca:2, anselmo:2 } }), g=H.g; g.save.bank=5000; ok(!g.setStaff('anselmo',2) && g.save.equipe.anselmo===0,'na área industrial, não se contrata o Anselmo');
  H=jogo(6,'avenida',{ pontoDia:9, equipe:{ tonhao:1, dani:3, joca:3 }, libera:{ confeitaria:2, joca:2, cami:2 } }); g=H.g; joga(H,400); ok(g.save.libera.anselmo===0,'dia 2 na Avenida: ainda não');
  H=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:3, joca:3 }, libera:{ confeitaria:2, joca:2, cami:2 } }); g=H.g; joga(H,400); // d.n=10 -> dia 6 no ponto: pela garantia
  ok(g.save.libera.anselmo==='pend','pela garantia (até o 6º dia) a conversa fica pendente');
  H.els['btn-next'].fire('click'); let n=0; while(!(g.conversa && /feira/.test(g.conversa.fala.s)) && n<30){ toque(H.els); n++; } ok(g.conversa && /feira/.test(g.conversa.fala.s),'a conversa toca no fim do dia');
  passa(H); ok(g.save.libera.anselmo===1 && g.cartaoAberto('anselmo') && g.liberaNovo.includes('anselmo'),'depois dela: o cartão abre, com selo');
  H.L.setShopGrupo('equipe'); ok(H.L.shopSecoes()[1].includes('anselmo'),'o cartão fica na Equipe');
  const eq=g.save.equipe, f0=H.L.payroll(eq); g.save.bank=5000; ok(g.setStaff('anselmo',2) && eq.anselmo===2 && H.L.payroll(eq)-f0===90,'contratar põe no nível 2: R$ 90 por dia na folha');
  ok(!g.setStaff('anselmo',3),'o nível 3 não se compra (vem dos cursos do Terraço)');
  H.L.setShopTab('anselmo'); const t=txt(H.els['shop-grid']); ok(/Anselmo · nível 1 de 2/.test(t) && /Terraço Suíça/.test(t) && /Pôr do Sol da Avenida/.test(t) || /Anselmo · nível 1/.test(t),'o cartão mostra o nível e os cursos no Terraço Suíça');
  // fora da História
  const F=load(); F.g.save=F.L.normSave({ salao:{ ponto:'avenida' }, bank:5000, equipe:{ dani:2, anselmo:2 } }); F.g.up=F.g.save.up; ok(F.g.save.equipe.anselmo===2,'save na Avenida guarda o Anselmo');
  const F2=F.L.normSave({ salao:{ ponto:'industrial' }, equipe:{ dani:2, anselmo:2 } }); ok(F2.equipe.anselmo===0,'na área industrial, o Anselmo sai do save'); }

// ---------- 3. quem pede ----------
{ const H=aberto(AN), {g,L}=H; const taxa=(tipo,vip,n)=>{ let c=0; for(let i=0;i<n;i++){ const m=new L.Group(g,tipo,++g.gid,0,!!vip); if (m.drinks.length) c++; } return c/n; };
  const alvo=L.DRINKS.pede; Object.keys(alvo).forEach(k=>{ const r=taxa(k,false,800); ok(Math.abs(r-alvo[k])<0.07,'drink: '+k+' pede em ~'+Math.round(alvo[k]*100)+'% (medido '+Math.round(r*100)+'%)'); });
  ok(taxa('entregador',false,200)===0 && taxa('turma',false,300)===0,'o entregador e a turma nunca pedem'); ok(Math.abs(taxa('executiva',true,800)-0.65)<0.07,'VIP: +0,2');
  let okQ=true,max=0; for(let i=0;i<400;i++){ const m=new L.Group(g,'negocios',++g.gid,0,false); if(m.drinks.length){ max=Math.max(max,m.drinks.length); if(m.drinks.length>m.size||m.drinks.some(x=>!L.DRINKS.itens.some(d=>d.id===x))) okQ=false; } } ok(okQ && max>=2,'de 1 a "size" drinks, cada um dos 3 (máx. visto '+max+')');
  const S=aberto({},null,AV); let alg=0; for(let i=0;i<300;i++) if(new S.L.Group(S.g,'executiva',++S.g.gid,0,false).drinks.length) alg++; ok(alg===0,'sem o Anselmo, ninguém pede drink');
  const S2=aberto({ equipe:{ tonhao:1, dani:3, joca:3, anselmo:2 } }); S2.g.save.equipe.anselmoFora=true; alg=0; for(let i=0;i<300;i++) if(new S2.L.Group(S2.g,'executiva',++S2.g.gid,0,false).drinks.length) alg++; ok(alg===0,'com o Anselmo fora no dia, ninguém pede'); }

// ---------- 4. a fila de preparo ----------
{ const H=aberto(AN), {g,L}=H; g.mode='carreira'; ok(g.anselmoAtivo,'o Anselmo trabalha no dia');
  const t=g.tables[0], m=new L.Group(g,'executiva',++g.gid,0,false); m.drinks=['por','brisa','esmeralda']; m.size=3; t.group=m; m.table=t; m.setState('wantOrder');
  ok(!m.drinkOpen && m.drinksFalta===0 && g.drinkQ.length===0,'antes de a Bia anotar, nada na fila nem no balão');
  g.bia.hands=[]; g.bia.doTable(t); ok(m.state==='ordered' && m.drinksPedidos && m.drinksFalta===3 && m.drinkOpen && g.drinkQ.length===3,'a Bia anota: os 3 drinks vão para a fila do Anselmo');
  for(let i=0;i<5;i++) g.drinkUpdate(0.5); ok(g.drinkPronto.length===0 && g.drinkJob,'em 2,5 s ainda não ficou pronto');
  for(let i=0;i<6;i++) g.drinkUpdate(0.5); ok(g.drinkPronto.length===1 && g.drinkPronto[0].id==='por' && g.drinkPronto[0].grp===m,'um drink por vez: o 1º sai em 5 s (4 s / 0,8)');
  for(let i=0;i<12;i++) g.drinkUpdate(0.5); ok(g.drinkPronto.length===2 && g.drinkQ.length===1 && !g.drinkJob,'no máximo 2 copos no balcão: o 3º espera na fila');
  for(let i=0;i<30;i++) g.drinkUpdate(0.5); ok(g.drinkPronto.length===2 && g.drinkQ.length===1 && !g.drinkJob,'com o balcão cheio, ele para (não acumula)');
  // a Bia pega no balcão
  g.tapStation('drinks',650,120); ok(g.bia.acts.some(a=>a.type==='drinks'),'tocar no balcão entra na fila da Bia');
  g.bia.clearActs(); g.bia.hands=[]; g.bia.perform({ type:'drinks' }); ok(g.bia.hands.length===2 && g.bia.hands.every(h=>h.kind==='drink' && h.group===m) && g.drinkPronto.length===0,'a Bia pega os 2 copos prontos');
  g.bia.hands=[]; g.bia.perform({ type:'drinks' }); ok(g.bia.hands.length===0,'sem copo pronto: nada na mão');
  // cancela ao sair
  g.drinkQ=[{ grp:m, id:'por' }]; g.drinkPronto=[{ grp:m, id:'brisa' }]; g.bia.hands=[{ kind:'drink', id:'por', group:m }]; g.drinkCancela(m); ok(!g.drinkQ.length && !g.drinkPronto.length && !g.drinkJob && !g.bia.hands.length,'quem sai leva o pedido embora (fila, balcão e mão)'); }

// ---------- 5. entrega, conta, Ambiente ----------
{ const H=aberto(AN), {g,L}=H; g.mode='carreira'; const t=g.tables[0], m=new L.Group(g,'executiva',++g.gid,0,false); m.size=2; m.drinks=['por','esmeralda']; t.group=m; m.table=t; m.juiceWant=0; m.cafePede=false; m.setState('ordered'); g.drinkPedir(m);
  m.setState('eating'); m.timer=0.01; m.hearts=3; for(let i=0;i<3;i++) m.update(0.05); ok(m.state==='eating' && m.esperaSuco,'acabou de comer sem os drinks: espera, não pede a conta');
  g.bia.hands=[{ kind:'drink', id:'por', group:m },{ kind:'drink', id:'esmeralda', group:m }]; ok(g.bia.verbFor(t)==='drink','com drink na mão, a vez é do drink'); g.pontos=0; g.custo=0; g.bebConta=0;
  g.bia.doTable(t); ok(m.drinksFalta===0 && m.drinksDados===2 && m.bebConta===44 && g.stats.drinks===2 && g.pontos>=10 && g.custo===12 && m.hearts>3 && !g.bia.hands.length,'entrega: R$ 44 na conta, +10 pontos, ingrediente R$ 12, +coração');
  m.update(0.05); ok(m.state==='wantBill','com todos os drinks, pede a conta'); const bill=m.bill; g.money=0; g.collectBill(m,t); ok(g.money>=bill+44,'a conta paga os R$ 44');
  // drink não entregue sai da conta e o grupo perde coração
  const m2=new L.Group(g,'executiva',++g.gid,0,false); m2.size=1; m2.drinks=['brisa']; m2.drinksPedidos=true; m2.state='eating'; m2.esperaSuco=true; m2.patLeft=0.01; const h=m2.hearts; m2.tick(0.05); ok(m2.hearts===h-1 && m2.perdDrink===1 && m2.bebConta===0,'esperando o drink, perde coração; sem entrega, nada na conta');
  // lixo
  g.bia.hands=[{ kind:'drink', id:'por', group:m }]; g.trash=0; g.money=100; g.bia.perform({ type:'trash' }); ok(g.money===89,'no lixo, o drink custa metade (R$ 11)');
  ok(g.bia.canTake('drink') && L.trayOk([{kind:'drink'},{kind:'drink'},{kind:'drink'}]),'o drink conta como bebida (bandeja de 3)');
  // Ambiente
  g.avals=[]; const a=new L.Group(g,'executiva',++g.gid,0,false); a.avalia=true; a.drinksDados=0; g.mode='carreira'; const am=(gr)=>{ g.avals.length=0; gr.hearts=5; g.avaliar(gr,0,0); return g.avals[0].s[4]; };
  const s0=am(a); a.drinksDados=1; const s1=am(a); ok(Math.abs((s1-s0)-0.25)<0.06,'o drink entregue soma +0,25 no Ambiente (medido '+(s1-s0).toFixed(2)+')'); }

// ---------- 6. a folha ----------
{ const H=aberto({},null), {g,L}=H; const eq={ tonhao:1, dani:2, joca:0, cami:1, anselmo:2, couvert:false, tv:false, som:false, tvs:0, taxa:false };
  ok(L.payroll(eq)-L.payroll(Object.assign({},eq,{ anselmo:0 }))===90,'payroll conta o Anselmo (R$ 90)');
  const e={ tonhao:1, dani:2, joca:2, cami:1, anselmo:2, tvs:0 }; const n1=L.folhaCorta(e); ok(n1==='o Anselmo (sem salário hoje)' && e.anselmoFora===true,'é o primeiro a não vir (sem couvert, som, TV nem TVs)');
  const e2={ tonhao:1, dani:2, joca:2, cami:1, anselmo:2, tvs:2, tv:false, som:false }; const o=[]; let x; while((x=L.folhaCorta(e2))) o.push(x); ok(o[0]==='TVs' && o[1].indexOf('Anselmo')>=0 && o[2].indexOf('Cami')>=0,'ordem: TVs, o Anselmo, a Cami...');
  const sv=L.normSave({ salao:{ ponto:'avenida' }, equipe:{ dani:2, anselmo:2 } }); sv.equipe.anselmoFora=true; ok(L.normEquipe(sv.equipe,g.ponto).anselmoFora===undefined,'normEquipe não guarda o "não vem"');
  ok(L.folhaItens({ tonhao:0, dani:1, joca:0, cami:0, anselmo:2 }).includes('Anselmo'),'folhaItens lista o Anselmo');
  const H2=aberto(AN); H2.g.save.equipe.anselmoFora=true; ok(!H2.g.anselmoAtivo,'fora no dia: não trabalha'); }

// ---------- 7. desenho e save antigo ----------
{ const H=aberto(AN), {g,L}=H; g.mode='carreira'; let erro=null; try{ g.drinkPronto=[{ grp:null, id:'por' },{ grp:null, id:'esmeralda' }]; L.drawAnselmo(H.ctx||{ },{ x:650, y:118, busy:true },0); }catch(e){ erro=e; } ok(!erro,'drawAnselmo roda sem erro'+(erro?': '+erro.message:''));
  try{ g.render && g.render(); erro=null; }catch(e){ erro=e; } ok(!erro,'o salão desenha com o balcão e os copos'+(erro?': '+erro.message:''));
  ok(g.pickAt(650,118,0) && g.pickAt(650,118,0).st==='drinks','o balcão é um alvo de toque'); const S=aberto(AV); ok(!S.g.pickAt(650,118,0) || S.g.pickAt(650,118,0).st!=='drinks','sem o Anselmo, o balcão não existe');
  const v94=L.normSave({ salao:{ ponto:'avenida' }, equipe:{ tonhao:1, dani:2, cami:1 }, daniCursos:{ confCaseira:1 }, jocaCursos:{ espresso:1 } }); ok(v94.equipe.anselmo===0 && v94.equipe.cami===1,'save da v9.4 carrega igual, sem Anselmo'); }
console.log('total = '+total+'  fails = '+fails); process.exit(fails?1:0);
