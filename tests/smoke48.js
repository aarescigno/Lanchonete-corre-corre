// v9.6, etapa 3b-6: a Cami em "Minhas mesas" (o plano chamava de smoke47; o número já era do Anselmo, 3b-5).
// Curso, mesas marcadas no editor do salão, o fluxo do pedido à conta sem a Bia, a Bia que não pega o prato dela, o básico que volta
// para o Joca, o cartão e o save da v9.5.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,ponto,sv,o)=>{ const H=nova(o), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:2 }, salao:{ ponto:ponto||'avenida' }, convCard:1, convDiv:1 }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const CUR={ agil:1, mesa:1 };
const EQ={ tonhao:1, dani:3, joca:3, cami:3, camiModo:'mesas' };
// dia aberto na Avenida, sem chegadas, com a Cami nas `marca` primeiras mesas
const aberto=(marca,sv)=>{ const H=jogo(6,'avenida',Object.assign({ pontoDia:5, equipe:EQ, camiCursos:CUR, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2 } },sv||{})), {g}=H;
  g.save.salao.mesas.forEach((m,i)=>{ if(i<marca) m.cami=1; }); g.tablesKey=''; g.buildTables(); g.begin(); g.tables.forEach(t=>{ t.open=true; }); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); return H; };
const grupo=(H,t,estado)=>{ const {g,L}=H; const m=new L.Group(g,'executiva',++g.gid,0,false); m.juiceWant=0; m.cafePede=false; m.drinks=[]; m.size=Math.min(m.size,t.seats); m.people=m.people.slice(0,m.size); m.dishes=m.dishes.slice(0,m.size);
  t.group=m; m.table=t; m.setState(estado||'wantOrder'); m.hearts=4; g.groups.push(m); return m; };
const roda=(H,seg,fn)=>{ const {g}=H; for(let i=0;i<seg*10;i++){ g.update(0.1); if(fn) fn(); } };

// ---------- 1. constantes e curso ----------
{ const {L}=nova();
  ok(L.CAMI_MESAS_MAX===3 && L.STAFF.cami.levels[3].mesas===true && L.STAFF.cami.levels[3].speed===1.25 && typeof L.CAMI_MESA_ON==='undefined','CAMI_MESAS_MAX = 3 e o "Em breve" saiu (CAMI_MESA_ON não existe mais)');
  let H=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:3, joca:3, cami:1 }, libera:{ confeitaria:2, joca:2, cami:2 } }), g=H.g; g.save.bank=5000;
  ok(!g.buyCamiCurso('mesa'),'o curso de mesa não se compra antes do ágil');
  ok(g.buyCamiCurso('agil') && !g.buyCamiCurso('mesa'),'um curso da Cami por lojinha'); g.save.camiCursoDia=0;
  ok(g.buyCamiCurso('mesa') && g.save.camiCursos.mesa===1 && g.save.equipe.cami===3 && g.save.bank===5000-400-600,'com o ágil, na Avenida: o de mesa custa R$ 600 e leva a Cami ao nível 3');
  H=jogo(6,'industrial',{ pontoDia:5, equipe:{ tonhao:1, dani:3, cami:1 }, camiCursos:{ agil:1 } }); H.g.save.bank=5000; ok(!H.g.buyCamiCurso('mesa'),'fora da Avenida, o curso não está ao alcance'); }

// ---------- 2. mesas marcadas no editor ----------
{ let H=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:3, joca:3, cami:2 }, camiCursos:{ agil:1 } }), g=H.g, L=H.L, sv=g.save;
  ok(sv.salao.mesas.length>=4,'o salão da Avenida tem mesas para o teste ('+sv.salao.mesas.length+')');
  ok(!g.camiMesa(0) && !sv.salao.mesas[0].cami,'sem o curso de mesa, não marca ('+g.salaoMsg+')');
  sv.equipe.cami=3; sv.camiCursos.mesa=1; g.salaoMsg='';
  ok(g.camiMesa(0) && g.camiMesa(1) && g.camiMesa(2) && L.camiMesasN(sv)===3,'marca até 3 mesas');
  ok(!g.camiMesa(3) && L.camiMesasN(sv)===3 && /até 3/.test(g.salaoMsg),'a 4ª é recusada: "A Cami fica com até 3 mesas"');
  ok(g.camiMesa(sv.salao.mesas.findIndex(m=>m.cami)) && L.camiMesasN(sv)===2,'tocar de novo numa marcada tira a marca');
  const marcadas=sv.salao.mesas.map(m=>!!m.cami).join(); const N=L.normSave(JSON.parse(JSON.stringify(sv))); ok(N.salao.mesas.map(m=>!!m.cami).join()===marcadas,'o save guarda as mesas marcadas');
  const X=JSON.parse(JSON.stringify(sv)); X.salao.mesas.forEach(m=>{ m.cami=1; }); ok(L.camiMesasN(L.normSave(X))===3,'save com mais de 3 marcadas: ficam 3');
  const i=sv.salao.mesas.findIndex(m=>m.cami); ok(g.guardarMesa(i) && g.estoque.every(m=>!m.cami) && L.camiMesasN(sv)===1,'guardar a mesa no estoque tira a marca');
  const j=sv.salao.mesas.findIndex(m=>m.cami); if (g.estoque.length) g.tirarMesa(0); ok(g.pintarMesa(j,2) && sv.salao.mesas.some(m=>m.cami),'pintar a cadeira mantém a marca');
  sv.equipe.camiModo='mesas'; ok(L.camiModoMesas(sv),'com 1 mesa marcada, o modo "Minhas mesas" vale');
  const k=sv.salao.mesas.findIndex(m=>m.cami); g.camiMesa(k); ok(L.camiMesasN(sv)===0 && sv.equipe.camiModo==='tarefas' && !L.camiModoMesas(sv),'tirando a última marca, o modo volta para "Tarefas"');
  ok(!g.setCamiModo('mesas') && sv.equipe.camiModo==='tarefas','sem mesa marcada o modo não liga');
  g.camiMesa(0); ok(g.setCamiModo('mesas') && sv.equipe.camiModo==='mesas' && g.setCamiModo('tarefas') && sv.equipe.camiModo==='tarefas','com mesa marcada liga e desliga'); }

// ---------- 3. o básico volta para o Joca ----------
{ const H=aberto(2), {g,L}=H; const eq=g.save.equipe;
  ok(L.donoBasico(g)==='joca' && g.cami.tasks.length===0 && g.joca.does('lixo'),'em "Minhas mesas" o básico fica com o Joca e a Cami não tem tarefa da lista');
  eq.camiModo='tarefas'; ok(L.donoBasico(g)==='cami' && g.cami.does('lixo') && !g.joca.does('lixo'),'em "Tarefas" o básico é da Cami (como na v9.3)');
  eq.camiModo='mesas'; eq.joca=0; ok(L.donoBasico(g)==='dani','sem o Joca, o básico vai para a Dani');
  const H2=aberto(0); ok(!H2.g.cami.mesasModo && H2.L.donoBasico(H2.g)==='cami','modo "mesas" sem mesa marcada: ela fica em "Tarefas"'); }

// ---------- 4. um grupo do pedido à conta sem a Bia ----------
{ const H=aberto(2), {g,L}=H; const t=g.tables[0]; ok(t.cami && g.camiMesasOn,'a mesa 1 é da Cami');
  g.pontos=0; const m=grupo(H,t); let maxMaos=0, biaMexeu=false; const sink0=g.kitchen.sinkN;
  roda(H,150,()=>{ maxMaos=Math.max(maxMaos,g.cami.hands.length); if(g.bia.hands.length||g.bia.acts.length) biaMexeu=true; });
  ok(m.state==='leaving' && g.stats.served===1,'a Cami levou o grupo até a conta (estado '+m.state+', atendidos '+g.stats.served+')');
  ok(!biaMexeu && g.stats.chain===0,'a Bia não fez nada e a sequência (chain) ficou zerada');
  ok(g.cami.feitas>=4 && maxMaos<=2,'ela fez as ações (feitas '+g.cami.feitas+') com no máximo 2 itens nas mãos (viu '+maxMaos+')');
  ok(g.pontos>0 && g.money>0,'rendeu pontos ('+g.pontos+') e dinheiro ('+g.money+')');
  ok(!t.dirty && g.cami.hands.length===0 && (g.kitchen.sinkN+g.stats.washed>sink0),'recolheu a louça suja e não sobrou nada nas mãos'); }

// ---------- 5. dois grupos e a Bia ----------
{ const H=aberto(2), {g,L}=H; const t0=g.tables[0], t1=g.tables[1]; const a=grupo(H,t0), b=grupo(H,t1);
  let dupla=false, maxMaos=0; roda(H,200,()=>{ maxMaos=Math.max(maxMaos,g.cami.hands.length); const ids=g.kitchen.plates.filter(Boolean).map(p=>p.id); if(new Set(ids).size!==ids.length) dupla=true; });
  ok(a.state==='leaving' && b.state==='leaving' && g.stats.served===2 && !dupla && maxMaos<=2,'2 grupos nas mesas dela: os dois atendidos, mãos <= 2 ('+maxMaos+')');
  ok(g.tables.every(t=>!t.dirty) && g.cami.hands.length===0 && g.kitchen.plates.every(p=>!p),'nada se perde: mesas limpas, mãos vazias, balcão sem prato');
  // o prato de um grupo que a Cami atende: a Bia não pega
  const H2=aberto(2), g2=H2.g, T=g2.tables[0], G=grupo(H2,T,'ordered'); G.cami=true;
  g2.kitchen.plates[0]={ id:++g2.kitchen.pid, table:T.id, group:G, dish:G.dish, slot:0, age:0, crit:false, q:3 };
  ok(!g2.tapStation('plates',806,270) && g2.bia.acts.length===0,'tocar no prato do grupo da Cami não entra na fila da Bia');
  g2.bia.acts.push({ type:'plate', pid:g2.kitchen.plates[0].id }); g2.bia.phase='idle'; g2.bia.perform(g2.bia.acts.shift());
  ok(g2.bia.hands.length===0 && g2.kitchen.plates[0],'e se chegar lá, a Bia não leva (o prato fica)');
  // o prato que a Bia já vai pegar, a Cami deixa
  const H3=aberto(2), g3=H3.g, T3=g3.tables[0], G3=grupo(H3,T3,'ordered'); const pid=++g3.kitchen.pid;
  g3.kitchen.plates[0]={ id:pid, table:T3.id, group:G3, dish:G3.dish, slot:0, age:0, crit:false, q:3 }; g3.bia.acts.push({ type:'plate', pid });
  g3.cami.think(); ok(!(g3.cami.plan && g3.cami.plan.type==='pegaPrato') && !G3.cami,'o prato que está na fila da Bia, a Cami deixa'); }

// ---------- 6. quem não é da Cami fica com a Bia ----------
{ const H=aberto(1), {g}=H; const t=g.tables[3]; ok(!t.cami,'a mesa 4 não é da Cami'); const m=grupo(H,t);
  roda(H,30); ok(m.state==='wantOrder' && g.cami.hands.length===0,'um grupo em mesa comum espera a Bia (a Cami não mexe)'); }

// ---------- 7. cartão, desenho e save da v9.5 ----------
{ const H=aberto(2), {g,L}=H; L.setShopTab('cami'); let t=txt(H.els['shop-grid']);
  ok(/Cami · nível 3 de 3/.test(t) && /Minhas mesas/.test(t) && /Tarefas/.test(t) && /cuida de 2 de 3 mesas/.test(t),'o cartão mostra os dois modos e as 2 mesas marcadas');
  g.save.equipe.camiModo='tarefas'; g.camiMesa(0); g.camiMesa(1); L.setShopTab('cami'); t=txt(H.els['shop-grid']); ok(/Marque as mesas dela no Salão/.test(t),'sem mesa marcada: "Marque as mesas dela no Salão"');
  let erro=''; try { g.save.equipe.camiModo='mesas'; g.camiMesa(0); const tb=g.tables[0]; tb.open=true; H.L.drawTable(H.ctx,g,tb,0,false); H.L.drawTable(H.ctx,g,tb,0,true); H.L.drawAventalCami(H.ctx,100,100); } catch(e){ erro=String(e); } ok(!erro,'o avental desenha no jogo e no editor sem erro '+erro);
  const v95=L.normSave({ equipe:{ tonhao:1, dani:3, joca:3, cami:2, camiTasks:['lixo','lavar'] }, camiCursos:{ agil:1 }, salao:{ ponto:'avenida' } });
  ok(v95.equipe.camiModo==='tarefas' && v95.salao.mesas.every(m=>!m.cami) && v95.equipe.cami===2 && v95.equipe.camiTasks.join()==='lixo,lavar','save da v9.5: modo "Tarefas", nenhuma mesa marcada, nível e tarefas iguais');
  const H5=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:3, joca:3, cami:2 }, camiCursos:{ agil:1 } }); H5.g.begin(); ok(H5.L.donoBasico(H5.g)==='cami' && !H5.g.cami.mesasModo,'o dia do save da v9.5 roda como antes'); }

console.log('total = '+total+'  fails = '+fails);
