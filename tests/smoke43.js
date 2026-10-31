// v9.2, etapa 3b-2: a Dani confeiteira e o Joca, na área industrial. Conversa da confeitaria (4º dia no ponto), curso Confeitaria caseira,
// pedidos de doce no fim da refeição, doce na marmita, o Joca (conversa, contratação, níveis, tarefas básicas, folha) e o save.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,ponto,sv,o)=>{ const H=nova(o), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:2 }, salao:{ ponto:ponto||'industrial' }, convCard:1, convDiv:1 }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };
const comCurso=H=>{ H.g.save.daniCursos.confCaseira=1; H.g.up.confCaseira=true; };
// dia aberto, com o curso, sem chegadas
const aberto=(sv,o)=>{ const H=jogo(5,'industrial',Object.assign({ pontoDia:1, libera:{ confeitaria:2, joca:2 } },sv||{}),o), {g}=H; comCurso(H); g.save.libera.confeitaria=2; g.save.libera.joca=2; g.begin(); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); return H; };
const fala=(L,id)=>L.liberaOf(id);

// ---------- 1. a entrada da confeitaria no LIBERA ----------
{ const {L}=nova(); const c=fala(L,'confeitaria'), j=fala(L,'joca');
  ok(c && c.nivel===2 && c.dia===4 && c.ate===4 && !c.gatilho,'confeitaria: nível 2, dia 4, garantia 4, sem gatilho');
  ok(c.falas.length===4 && c.falas.map(f=>f.q).join()==='dani,bia,dani,tonhao' && /sobremesa/.test(c.falas[0].s) && /brigadeiro/.test(c.falas[2].s),'confeitaria: 4 falas (Dani, Bia, Dani, Tonhão)');
  ok(j && j.nivel===2 && j.dia===1 && j.ate===999 && typeof j.gatilho==='function' && j.falas.length===6 && j.falas[4].q==='joca' && /Lixo, louça, mesa suja/.test(j.falas[4].s),'joca: nível 2, gatilho pelo curso, 6 falas com a dele');
  ok(L.LIBERA.every(l=>l.falas.every(f=>L.HIST_NOMES[f.q])),'toda fala tem nome em HIST_NOMES (inclui o Joca)'); }

// ---------- 2. a conversa no 4º dia no ponto; o curso só depois dela ----------
{ let H=jogo(5,'industrial',{ pontoDia:8 }), {g}=H; joga(H,400);
  ok(g.save.libera.confeitaria===0,'3º dia no ponto: ainda fechado');
  H=jogo(5,'industrial',{ pontoDia:7 }); g=H.g; joga(H,400);
  ok(g.save.libera.confeitaria==='pend' && !g.cartaoAberto('confeitaria'),'4º dia no ponto: pendente (garantia), cartão ainda fechado');
  ok(!g.buyDaniCurso('confCaseira') && !g.save.daniCursos.confCaseira,'o curso não se compra antes da conversa');
  H.els['btn-next'].fire('click'); let n=0; while(!(g.conversa && /sobremesa/.test(g.conversa.fala.s)) && n<30){ toque(H.els); n++; }
  ok(g.conversa && /sobremesa/.test(g.conversa.fala.s),'a conversa da confeitaria toca no fim do dia');
  passa(H);
  ok(g.save.libera.confeitaria===1 && g.cartaoAberto('confeitaria') && g.state==='shop','depois da conversa: aberto, com selo, e a lojinha abre');
  g.save.bank=5000; g.cursoMsg='';
  ok(g.buyDaniCurso('confCaseira') && g.save.daniCursos.confCaseira===1 && g.up.confCaseira===true && g.save.bank===5000-180,'compra o curso: R$ 180, a geladeirinha liga (up.confCaseira)');
  ok(H.L.daniXp(g.save)===2,'o curso vale +2 de experiência da Dani');
  H=jogo(4,'garagem',{ pontoDia:1 }); joga(H,400); ok(H.g.save.libera.confeitaria===0,'na Garagem, não vale');
  // fora da História: aberto com o ponto
  const F=load(); F.g.save=F.L.normSave({ salao:{ ponto:'industrial' }, bank:5000 }); F.g.up=F.g.save.up; F.g.tablesKey=''; F.g.buildTables(); F.g.goShop(10);
  ok(F.g.cartaoAberto('confeitaria') && F.g.buyDaniCurso('confCaseira') || F.g.save.equipe.dani===0,'fora da História: o curso abre na área industrial (a Dani precisa ter chegado)');
  const G=load(); G.g.save=G.L.normSave({ bank:5000 }); G.g.goShop(10); ok(!G.g.buyDaniCurso('confCaseira'),'na Garagem o curso não existe (nem fora da História)'); }

// ---------- 3. o curso na lojinha: no Cardápio, com o rosto da Dani ----------
{ const H=jogo(5,'industrial',{ pontoDia:1, libera:{ confeitaria:2, joca:2 } }), {g,L,els}=H; g.save.libera.confeitaria=2;
  L.setShopTab('cardapio'); const t1=txt(els['shop-grid']);
  ok(/Curso de Confeitaria caseira/.test(t1) && /bolo de pote, brigadeiro de colher e pudim/.test(t1) && /R\$ 7/.test(t1) && /Comprar R\$ 180/.test(t1),'o Cardápio mostra o curso (doces, R$ 7, R$ 180)');
  L.setShopTab('dani'); const t2=txt(els['shop-grid']);
  ok(!/Confeitaria caseira/.test(t2) && /Atendimento ao cliente/.test(t2),'a seção da Dani só tem os cursos de atendimento');
  ok(L.avalMenu({},1)>L.avalMenu({},0),'o curso de item conta na Diversidade do cardápio (avalMenu)'); }

// ---------- 4. pedido de doce no fim da refeição ----------
{ const H=aberto(), {g,L}=H; const taxa=(tipo,vip,n)=>{ let c=0; for(let i=0;i<n;i++){ const m=new L.Group(g,tipo,++g.gid,0,!!vip); if (m.sorteiaDoces().length) c++; } return c/n; };
  const alvo={ familia:0.5, vovos:0.6, estudante:0.3, executiva:0.2, negocios:0.4, turma:0.3, motorista:0.3 };
  Object.keys(alvo).forEach(k=>{ const r=taxa(k,false,800); ok(Math.abs(r-alvo[k])<0.07,'doce: '+k+' pede em ~'+Math.round(alvo[k]*100)+'% (medido '+Math.round(r*100)+'%)'); });
  ok(taxa('entregador',false,200)===0,'o entregador nunca pede doce');
  ok(Math.abs(taxa('familia',true,800)-0.7)<0.07,'VIP: +20 pontos de chance (família VIP ~70%)');
  let okQ=true,max=0; for(let i=0;i<300;i++){ const m=new L.Group(g,'familia',++g.gid,0,false), d=m.sorteiaDoces(); if(d.length){ max=Math.max(max,d.length); if(d.length<1||d.length>m.size||d.some(x=>!L.DOCES.caseira.some(c=>c.id===x))) okQ=false; } }
  ok(okQ && max>=3,'1 a size doces, de bolo, brigadeiro ou pudim');
  const S=jogo(5,'industrial',{ pontoDia:1 }); S.g.begin(); S.g.mode='carreira'; S.g.schedule.forEach(s=>{ s.t=9999; }); let alg=0; for(let i=0;i<300;i++) if(new S.L.Group(S.g,'familia',++S.g.gid,0,false).sorteiaDoces().length) alg++;
  ok(alg===0,'sem o curso, ninguém pede doce'); }

// ---------- 5. o grupo espera os doces, a Bia entrega, a conta ----------
{ const H=aberto(), {g,L}=H; const t=g.tables[0]; const mk=()=>{ const m=new L.Group(g,'familia',++g.gid,0,false); m.juiceWant=0; m.cafePede=false; t.group=m; m.table=t; m.setState('eating'); m.timer=0.01; m.hearts=4; m.doces=['bolo','pudim']; g.groups.push(m); return m; };
  const m=mk(); m.update(0.05);
  ok(m.state==='eating' && m.esperaSuco && m.docesFalta===2 && m.doceBalao,'acabou de comer: espera os 2 doces (balão), não pede a conta');
  m.timer=0; for(let i=0;i<5;i++) m.update(0.05); ok(m.state==='eating','sem os doces, segue esperando');
  g.bia.hands.push({ kind:'doce', id:'bolo' }); g.bia.hands.push({ kind:'doce', id:'pudim' });
  ok(g.bia.verbFor(t)==='doce','a Bia com doce na mão sabe que é a vez do doce');
  g.pontos=0; const h0=m.hearts, p0=g.pontos; g.bia.doTable(t);
  ok(m.docesFalta===0 && m.docesDados===2 && m.bebConta===14 && g.stats.doces===2 && m.hearts>h0 && g.pontos-p0===10 && g.bia.hands.length===0,'entrega 2: R$ 14 na conta, +10 pontos, +coração, mãos vazias');
  m.update(0.05); ok(m.state==='wantBill','com todos os doces, pede a conta');
  const bill=m.bill; g.money=0; g.collectBill(m,t); ok(g.money>=bill+14,'a conta paga os R$ 14 dos doces');
  // só 1 dos 2 chegou: o outro não entra na conta
  const m2=mk(); m2.update(0.05); g.bia.hands.push({ kind:'doce', id:'bolo' }); g.bia.doTable(t); ok(m2.docesFalta===1 && m2.bebConta===7,'entrega parcial: só R$ 7 na conta, falta 1');
  // a paciência corre esperando
  m2.patLeft=0.01; const hh=m2.hearts, pd=m2.perdDoce; m2.tick(0.05); ok(m2.hearts===hh-1 && m2.perdDoce===pd+1,'esperando o doce, perde coração (e conta o doce)');
  // mão: bandeja e dois doces
  g.bia.hands=[]; ok(g.bia.canTake('doce') && !L.trayOk([{kind:'doce'},{kind:'doce'},{kind:'doce'},{kind:'doce'}]) && L.trayOk([{kind:'doce'},{kind:'dish'}]),'o doce conta como bebida nas mãos');
  // a geladeirinha
  g.tapStation('doces',714,120); ok(g.bia.acts.some(a=>a.type==='doces'),'tocar na geladeirinha entra na fila da Bia');
  g.bia.clearActs(); g.bia.perform({ type:'doces' }); ok(g.bia.hands.length===1 && g.bia.hands[0].kind==='doce' && g.custo>=2,'pega 1 doce (ingrediente R$ 2)'); }

// ---------- 6. a Dani com a tarefa "Doce" ----------
{ const H=aberto({ equipe:{ tonhao:1, dani:3, daniTasks:['doce','cafe'] } }), {g,L}=H; const t=g.tables[0];
  ok(L.daniTaskOk('doce',g.up) && g.dani.does('doce'),'a tarefa "Servir doces" vale com o curso');
  const m=new L.Group(g,'familia',++g.gid,0,false); m.juiceWant=0; m.cafePede=false; t.group=m; m.table=t; m.setState('eating'); m.timer=0.01; m.hearts=4; m.doces=['pudim','bolo','brigadeiro']; g.groups.push(m); m.update(0.05);
  for(let i=0;i<1400 && m.docesFalta>0;i++){ g.update(0.05); m.patLeft=99; }
  ok(m.docesFalta===0 && m.bebConta===21 && g.dani.feitas>=2,'a Dani leva os 3 doces em 2 viagens (2 mãos): R$ 21 na conta');
  const H2=aberto({ equipe:{ tonhao:1, dani:3, daniTasks:['cafe'] } }); const t2=H2.g.tables[0]; const m2=new H2.L.Group(H2.g,'familia',++H2.g.gid,0,false); m2.juiceWant=0; m2.cafePede=false; t2.group=m2; m2.table=t2; m2.setState('eating'); m2.timer=0.01; m2.doces=['bolo']; H2.g.groups.push(m2); m2.update(0.05);
  for(let i=0;i<300;i++){ H2.g.update(0.05); m2.patLeft=99; } ok(m2.docesFalta===1,'sem a tarefa, a Dani não leva doce'); }

// ---------- 7. doce na marmita ----------
{ const H=aberto(), {g,L}=H; let n=0; for(let i=0;i<800;i++) if(new L.Group(g,'entregador',++g.gid,0,false).docesMarm) n++;
  ok(n/800>0.23 && n/800<0.37,'o entregador pede "+ doce" em ~30% das marmitas (medido '+Math.round(n/8)+'%)');
  let lote=0,ml=0; for(let i=0;i<200;i++){ const e=new L.Group(g,'encomenda',++g.gid,0,false,{ lote:5 }); lote+=e.docesMarm; ml=Math.max(ml,e.docesMarm); } ok(ml<=5 && lote/200>1 && lote/200<2,'encomenda de 5: ~1,5 marmitas com doce');
  const S=jogo(5,'industrial',{ pontoDia:1 }), x=new S.L.Group(S.g,'entregador',++S.g.gid,0,false); ok(x.docesMarm===0,'sem o curso, nenhuma marmita pede doce');
  // com o pote no balcão
  g.mode='carreira'; const e=new L.Group(g,'entregador',++g.gid,0,false); e.docesMarm=1; e.dish='pf'; g.retirada.push(e); e.setState('retirada'); e.path=[];
  const preco=L.precoPrato('pf',g.ponto,g.cursos), base=Math.round(preco*(1+L.GORJETA[e.hearts]))-Math.round(preco*L.MARMITA.efood);
  g.potes=1; g.money=0; g.entregaMarmita(e,{ kind:'marmita', dish:'pf', q:4 });
  ok(g.money===base+7 && g.potes===0 && e.docesMarmDados===1 && g.stats.docesMarm===1,'marmita com pote no balcão: +R$ 7, o pote some');
  const e2=new L.Group(g,'entregador',++g.gid,0,false); e2.docesMarm=1; e2.dish='pf'; g.retirada.push(e2); e2.setState('retirada'); e2.path=[]; g.money=0; g.entregaMarmita(e2,{ kind:'marmita', dish:'pf', q:4 });
  ok(g.money===Math.round(preco*(1+L.GORJETA[e2.hearts]))-Math.round(preco*L.MARMITA.efood) && e2.docesMarmDados===0,'sem o pote, só perde os R$ 7 (a marmita sai igual)');
  // a Bia leva o doce ao balcão: só vale se alguém ainda quer
  g.retirada.length=0; g.potes=0; g.bia.hands=[{ kind:'doce', id:'bolo' }]; ok(g.levaMarmitas(g.bia)===0 && g.bia.hands.length===1 && g.potes===0,'balcão sem ninguém querendo: a Bia fica com o doce na mão');
  const e3=new L.Group(g,'entregador',++g.gid,0,false); e3.docesMarm=1; g.retirada.push(e3); e3.setState('retirada');
  ok(g.docesRet()===1 && g.docesRetFalta()===1,'um entregador quer 1 doce: falta 1 pote'); ok(g.levaMarmitas(g.bia)===1 && g.potes===1 && g.docesRetFalta()===0 && !g.bia.hands.length,'a Bia deixa o doce no balcão: vira pote'); }

// ---------- 8. o Joca: conversa, contratação, folha ----------
{ let H=jogo(5,'industrial',{ pontoDia:1, libera:{ confeitaria:2 } }), {g}=H; joga(H,400); ok(g.save.libera.joca===0,'sem o curso da Dani, o Joca não vem');
  H=jogo(5,'industrial',{ pontoDia:1, libera:{ confeitaria:2 } }); g=H.g; comCurso(H); joga(H,400);
  ok(g.save.libera.joca==='pend' && !g.cartaoAberto('joca'),'curso feito: a conversa do Joca fica pendente no fim do dia');
  H.els['btn-next'].fire('click'); let n=0; while(!(g.conversa && /Terminei o curso/.test(g.conversa.fala.s)) && n<30){ toque(H.els); n++; } ok(g.conversa && /Terminei o curso/.test(g.conversa.fala.s),'a conversa do Joca toca no fim do dia do curso');
  passa(H); ok(g.save.libera.joca===1 && g.cartaoAberto('joca') && g.liberaNovo.includes('joca'),'depois dela: o cartão do Joca abre, com selo');
  H.L.setShopGrupo('equipe'); ok(H.L.shopSecoes()[1].includes('joca'),'o cartão do Joca fica na Equipe');
  const eq=g.save.equipe; const f0=H.L.payroll(eq); g.save.bank=5000; ok(g.setStaff('joca',2) && eq.joca===2 && H.L.payroll(eq)-f0===45,'contratar põe no nível 2: R$ 45 por dia na folha');
  H.L.setShopTab('joca'); const t=txt(H.els['shop-grid']); ok(/Joca · nível 1 de 3/.test(t) && /Tarefas \(2 de 2\)/.test(t),'o cartão mostra "Joca · nível 1 de 3" e as tarefas');
  const F=load(); F.g.save=F.L.normSave({ salao:{ ponto:'industrial' }, bank:5000, equipe:{ dani:2 }, daniCursos:{ confCaseira:1 } }); F.g.up=F.g.save.up; F.g.tablesKey=''; F.g.buildTables(); F.g.goShop(10);
  ok(F.g.cartaoAberto('joca') && F.g.setStaff('joca',2),'fora da História, o cartão abre com a Confeitaria caseira feita'); const F2=load(); F2.g.save=F2.L.normSave({ salao:{ ponto:'industrial' }, bank:5000, equipe:{ dani:2 } }); ok(!F2.g.cartaoAberto('joca'),'fora da História, sem o curso, fechado'); }

// ---------- 9. níveis e experiência ----------
{ const H=jogo(5,'industrial',{ pontoDia:1, libera:{ confeitaria:2, joca:2 }, equipe:{ tonhao:1, dani:2, joca:2 } }), {g,L}=H; const sv=g.save;
  const J=L.STAFF.joca.levels; ok(J[2].speed===0.5 && J[2].tasks===2 && J[2].pay===45 && J[3].speed===0.65 && J[3].pay===60 && J[3].xp===6 && J[4].speed===0.8 && J[4].tasks===3 && J[4].pay===75 && J[4].xp===12,'níveis 2 a 4 como os da Dani (R$ 45, 60, 75)');
  ok(L.jocaXp(sv)===0 && !g.setStaff('joca',3),'sem experiência: o aumento não vale');
  sv.jocaTar=30; ok(L.jocaXp(sv)===6 && L.jocaNivelXp(sv)===3 && g.setStaff('joca',3) && sv.equipe.joca===3,'30 tarefas = 6 de experiência: sobe ao nível 3');
  ok(!g.setStaff('joca',2),'o nível pago é definitivo (não desce)'); sv.jocaTar=60; ok(L.jocaNivelXp(sv)===4 && g.setStaff('joca',4),'60 tarefas = 12: nível 4 (velocidade 0,8, 3 tarefas)');
  ok(g.joca.spec.speed===0.8 && g.joca.spec.tasks===3,'o Joca no nível 4 anda a 80% e faz 3 tarefas');
  // cursos
  sv.jocaTar=0; sv.equipe.joca=2; g.cursoMsg=''; ok(g.buyJocaCurso('atend') && sv.jocaCursos.atend===1 && L.jocaXp(sv)===2 && sv.bank===5000-120,'curso de atendimento: R$ 120, +2 de experiência');
  ok(!g.buyJocaCurso('cozinha'),'trava: um curso do Joca por lojinha'); sv.jocaCursoDia=0; sv.daniCursoDia=0; ok(g.buyJocaCurso('cozinha') && L.jocaXp(sv)===4,'no outro dia: Organização da cozinha (R$ 150)');
  ok(!g.buyJocaCurso('espresso') && !L.cursoDaniVis(L.JOCA_CURSOS[2],g.ponto),'o espresso (nível 3) não aparece na área industrial'); }

// ---------- 10. o básico fica com o Joca ----------
{ const H=aberto({ equipe:{ tonhao:1, dani:3, joca:2, daniTasks:['pratos','lavar','cafe'], jocaTasks:['lixo','lavar'] } }), {g,L}=H;
  ok(L.donoBasico(g)==='joca' && g.joca.active,'com o Joca no dia, o básico é dele');
  ok(g.joca.tasks.join()==='lixo,lavar' && g.dani.tasks.join()==='cafe','o Joca faz lixo e louça; a Dani fica só com o cafezinho');
  ok(!g.dani.does('lavar') && !g.dani.does('pratos') && g.otherWasher,'a Dani deixa de lavar; alguém lava (o Joca)');
  ok(!g.toggleJocaTask('cafe') && !g.toggleJocaTask('doce'),'o Joca nunca faz cafezinho nem doce');
  g.save.equipe.jocaFora=true; ok(L.donoBasico(g)==='dani' && !g.joca.active && g.dani.tasks.join()==='pratos,lavar','o Joca fora no dia: o básico volta para a Dani'); g.save.equipe.jocaFora=false;
  // tarefas reais (Joca no nível 4, 3 tarefas): lixo cheio, mesa suja e louça na pia
  g.save.equipe.joca=4; g.save.equipe.jocaTasks=['lixo','pratos','lavar'];
  g.trash=L.TRASH.cap; g.tables[0].dirty=true; g.tables[0].dirtyN=2; g.kitchen.sinkN=2; const feitas0=g.dani.feitas;
  for(let i=0;i<1600;i++) g.update(0.05);
  ok(g.trash===0 && !g.tables[0].dirty && g.kitchen.sinkN===0,'o Joca esvazia a lixeira, recolhe a mesa suja e lava a louça');
  ok(g.joca.feitas>=3 && g.dani.feitas===feitas0,'o trabalho conta para o Joca, não para a Dani');
  // dois ajudantes juntos: a mesa suja é limpa uma vez só
  const H2=aberto({ equipe:{ tonhao:1, dani:3, joca:2, daniTasks:['pratos','lavar'], jocaTasks:['pratos','lavar'] } }), g2=H2.g; g2.tables[0].dirty=true; g2.tables[0].dirtyN=2; g2.tables[1].dirty=true; g2.tables[1].dirtyN=1;
  let ev=0; for(let i=0;i<1200;i++){ g2.update(0.05); } ok(!g2.tables[0].dirty && !g2.tables[1].dirty && g2.kitchen.sinkN===0 && g2.joca.hands.length+g2.dani.hands.length<=4,'com os dois, nada se perde ou se repete'); }

// ---------- 11. a folha ----------
{ const {L}=nova(); const eq={ tonhao:2, dani:3, joca:3, couvert:true, som:true, tv:true, tvs:2, jocaTasks:[], daniTasks:[] }; const ord=[]; let n; while((n=L.folhaCorta(eq)) && ord.length<20) ord.push(n);
  ok(ord.join(' | ')==='Couvert | som | TV | TVs | aumento do Joca | aumento da Dani | aumento da Dani | aumento do Tonhão | aumento do Tonhão | o Joca (sem salário hoje)','a ordem do corte: ... TVs, aumento do Joca, da Dani, do Tonhão, e por último o Joca não vem');
  ok(eq.joca===2 && eq.jocaFora===true && L.payroll(eq)===L.STAFF.tonhao.levels[0].pay+L.STAFF.dani.levels[1].pay,'o Joca fora não entra na folha (continua no nível 2, contratado)');
  ok(!('jocaFora' in L.normEquipe(eq,L.PONTOS[1])) || L.normEquipe(eq,L.PONTOS[1]).jocaFora===undefined,'normEquipe não guarda o "não vem"');
  const H=jogo(5,'industrial',{ pontoDia:1, libera:{ confeitaria:2, joca:2 }, equipe:{ tonhao:1, dani:2, joca:2 }, bank:30 }), {g}=H; g.save.corta=true; g.begin();
  ok(g.save.equipe.jocaFora===true && g.unpaid.some(u=>/Joca/.test(u)) && !g.joca.active,'sem dinheiro: o Joca não vem hoje, avisa e fica de fora');
  g.save.bank=5000; g.resetDay(11); g.begin(); ok(g.save.equipe.jocaFora===false && g.joca.active,'no dia seguinte, com dinheiro, ele volta'); }

// ---------- 12. o save e o fim do dia ----------
{ const {L}=nova(); const s=L.normSave({ dia:12, salao:{ ponto:'industrial' }, equipe:{ tonhao:1, dani:2, daniTasks:['pratos','lavar'] }, histV:1, cap:5 });
  ok(s.equipe.joca===0 && s.equipe.jocaTasks.join()==='lixo,lavar' && s.jocaTar===0 && Object.keys(s.jocaCursos).length===0 && s.jocaCursoDia===0,'save da v9.1.1 (sem Joca) carrega igual: Joca 0, tarefas padrão');
  ok(L.normSave({ equipe:{ joca:1 } }).equipe.joca===0 && L.normSave({ equipe:{ joca:9 } }).equipe.joca===4 && L.normSave({ equipe:{ joca:3, jocaTasks:['cafe','lixo','lixo','suco'] } }).equipe.jocaTasks.join()==='lixo,suco','normEquipe: joca 0 ou 2 a 4; só tarefa básica, sem repetir');
  ok(L.normSave({ daniCursos:{ confCaseira:1 } }).up.confCaseira===true && !L.normSave({ up:{ confCaseira:true } }).up.confCaseira,'up.confCaseira vem do curso da Dani');
  const H=aberto({ equipe:{ tonhao:1, dani:2, joca:2 } }), {g,els}=H; g.joca.feitas=7; g.stats.doces=3; g.stats.docesMarm=1; g.money=300; g.custo=0; g.schedule=[]; g.nextIdx=0; g.finishDay();
  ok(g.save.jocaTar===7 && /Joca: 7 tarefas hoje · experiência 1/.test(txt(els['end-msg'])) && /Doces: 3 na mesa e 1 na marmita/.test(txt(els['end-msg'])),'fim do dia: o trabalho do Joca vira experiência e os doces entram no resumo'); }

console.log('smoke43: total =',total,' fails =',fails);
process.exit(fails?1:0);
