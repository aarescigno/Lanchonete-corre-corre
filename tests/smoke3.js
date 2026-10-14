const load=require('./harness.js');
let fails=0, total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- stub do db/user ---------- */
function mkStub(o){
  o=o||{};
  const data={}; const subs=[]; const log=[];
  function colOf(path){ return path.split('/').slice(0,-1).join('/'); }
  function snapDoc(path){ const d=data[path]; return { id:path.split('/').pop(), exists:d!==undefined, data:()=>d===undefined?undefined:JSON.parse(JSON.stringify(d)), metadata:{} }; }
  function notify(col){ subs.filter(s=>s.col===col&&!s.dead).forEach(s=>s.fire()); }
  function query(col, st){
    st=st||{};
    const q={
      orderBy(f,d){ return query(col,Object.assign({},st,{ob:f,dir:d||'asc'})); },
      limit(n){ return query(col,Object.assign({},st,{lim:n})); },
      _docs(){ let ids=Object.keys(data).filter(p=>colOf(p)===col); let docs=ids.map(snapDoc);
        if(st.ob){ docs.sort((a,b)=>{ const x=a.data()[st.ob], y=b.data()[st.ob]; return st.dir==='desc'?y-x:x-y; }); }
        if(st.lim) docs=docs.slice(0,st.lim); return docs; },
      get(){ const docs=q._docs(); return Promise.resolve({docs,size:docs.length,empty:!docs.length}); },
      onSnapshot(next,err){
        const s={col,dead:false,fire(){ const docs=q._docs(); next({docs,size:docs.length,empty:!docs.length,docChanges(){return[]},metadata:{}}); }};
        subs.push(s); o.onSub&&o.onSub(col,st); Promise.resolve().then(()=>{ if(o.snapErr){ err&&err({code:'revoked'}); } else s.fire(); });
        return ()=>{ s.dead=true; log.push('unsub:'+col); };
      }
    };
    return q;
  }
  const db={
    doc(path){ return {
      id:path.split('/').pop(), path,
      get(){ log.push('get:'+path); if(o.getErr) return Promise.reject(o.getErr); return Promise.resolve(snapDoc(path)); },
      set(d){ log.push('set:'+path); if(o.writeErr) return Promise.reject(o.writeErr); data[path]=JSON.parse(JSON.stringify(d)); notify(colOf(path)); return Promise.resolve(); },
      update(d){ log.push('update:'+path); if(o.writeErr) return Promise.reject(o.writeErr); if(data[path]===undefined) return Promise.reject({code:'invalid_argument',message:'nao existe'}); Object.assign(data[path],d); notify(colOf(path)); return Promise.resolve(); },
    }; },
    collection(path){ const q=query(path); q.path=path; q.doc=(id)=>db.doc(path+'/'+id); return q; }
  };
  const user={ id:()=>Promise.resolve(o.uid===undefined?'u_abc123':o.uid) };
  const claude={ use:(n)=> n==='db'? Promise.resolve(o.noDb?null:db) : n==='user'? Promise.resolve(o.noUser?null:user) : Promise.resolve(null) };
  return {claude,data,subs,log,db};
}

(async()=>{
/* ---------- 1. comandas coloridas ---------- */
{
  const H=load(); const {g,L}=H; const bot=require('./bot.js')(g,L);
  ok(L.CMD.length===6,'pool tem 6 cores');
  const chairs=['#E0523C','#3C7BD9','#F2C23D','#3E9B5A'];
  ok(L.CMD.every(c=>!chairs.includes(c.c)),'cores de comanda distintas das cadeiras');
  ok(JSON.stringify(L.CMD.map(c=>c.c))===JSON.stringify(['#7B4FB5','#E0559A','#1FA6A0','#C9671E','#7A4A2A','#8DB531']),'cores conforme spec');
  g.startDay(4); g.begin();
  let bad=0, maxActive=0, released=0, st=0, seen=new Set(); let prevActive=0;
  while(g.state==='playing'&&st<12000){
    bot(); g.update(0.05); st++;
    const act=g.groups.filter(x=>x.cmd>=0).map(x=>x.cmd);
    act.forEach(c=>seen.add(c));
    if(new Set(act).size!==act.length) bad++;                       // sem repetição entre pedidos ativos
    if(act.some(c=>g.cmdFree.includes(c))) bad++;                    // ativa não está no pool livre
    if(act.length+g.cmdFree.length!==6) bad++;                       // conservação
    if(g.bia.hands.some(h=>(h.kind==='ticket'||h.kind==='dish')&&h.group.cmd<0)) bad++;
    maxActive=Math.max(maxActive,act.length);
  }
  ok(bad===0,'dia 4: sem cor repetida / conservação do pool (violações='+bad+')');
  ok(seen.size>=4,'várias cores usadas ('+seen.size+')');
  ok(g.cmdFree.length===6 && g.groups.filter(x=>x.cmd>=0).length===0,'no fim do dia todas as cores voltaram ao pool');
  // devolução ao sair bravo
  g.startDay(2); g.begin(); let guard=0; while(!g.queue.length&&guard++<500) g.update(0.05);
  const grp=g.queue[0]; const t=g.tables.find(x=>x.free&&x.seats>=grp.size); g.seatGroup(grp,t);
  guard=0; while(grp.state!=='wantOrder'&&guard++<600) g.update(0.05);
  g.tapTable(t); guard=0; while(grp.state!=='ordered'&&guard++<200) g.update(0.05);
  ok(grp.cmd>=0 && !g.cmdFree.includes(grp.cmd) && g.cmdFree.length===5,'anotar pedido tira uma cor do pool');
  const c0=grp.cmd; grp.hearts=1; grp.patLeft=0.01; g.update(0.1);
  ok(grp.state==='leaving' && grp.cmd===-1 && g.cmdFree.includes(c0) && g.cmdFree.length===6,'cliente bravo devolve a cor');
  // devolução ao pagar
  g.startDay(1); g.begin(); guard=0; while(!g.queue.length&&guard++<500) g.update(0.05);
  const g2=g.queue[0]; const t2=g.tables.find(x=>x.free&&x.seats>=g2.size); g.seatGroup(g2,t2);
  guard=0; while(g2.state!=='wantOrder'&&guard++<600) g.update(0.05); g.tapTable(t2); guard=0; while(g2.state!=='ordered'&&guard++<200) g.update(0.05);
  ok(g2.cmd>=0,'grupo 2 com comanda'); const c2=g2.cmd;
  g.bia.clearActs(); g.tapStation('order',800,150); guard=0; while(!g.kitchen.plates.some(Boolean)&&guard++<1500){ g.update(0.05); }
  const pi=g.kitchen.plates.findIndex(Boolean); g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[pi].x,L.LAYOUT.PLATE_SLOTS[pi].y); g.tapTable(t2);
  guard=0; while(g2.state!=='eating'&&guard++<400) g.update(0.05); ok(g2.state==='eating','prato entregue (cor ainda reservada)'); ok(g2.cmd===c2,'cor mantida durante a refeição');
  guard=0; while(g2.state!=='wantBill'&&guard++<400) g.update(0.05); g.tapTable(t2); guard=0; while(g2.state!=='leaving'&&guard++<200) g.update(0.05);
  ok(g2.state==='leaving'&&g2.cmd===-1&&g.cmdFree.includes(c2)&&g.cmdFree.length===6,'pagar a conta devolve a cor');
}

/* tempo esgotado devolve a cor */
{
  const H=load(); const {g,L}=H; g.startDay(2); g.begin(); let guard=0; while(!g.queue.length&&guard++<500) g.update(0.05);
  const grp=g.queue[0]; const t=g.tables.find(x=>x.free&&x.seats>=grp.size); g.seatGroup(grp,t);
  guard=0; while(grp.state!=='wantOrder'&&guard++<600) g.update(0.05); g.tapTable(t); guard=0; while(grp.state!=='ordered'&&guard++<200) g.update(0.05);
  ok(grp.cmd>=0&&g.cmdFree.length===5,'(tempo) comanda em uso');
  g.clock=0.05; for(let i=0;i<10;i++) g.update(0.05);
  ok(grp.cmd===-1&&g.cmdFree.length===6,'fim do expediente devolve a cor sem penalidade (lost='+g.stats.lost+')');
}
/* ---------- 2. fila lotada ---------- */
{
  const H=load(); const {g,L}=H;
  g.startDay(1); g.begin();
  let guard=0; while(g.queue.length<4&&guard++<4000){ g.queue.forEach(x=>{x.patLeft=1e9;}); g.update(0.05); }
  g.queue.forEach(x=>{x.patLeft=1e9;});
  ok(g.queue.length===4,'fila encheu (4 grupos) sem sentar ninguém');
  const full0=g.stats.full, lost0=g.stats.lost, mny=g.money, qlen=g.queue.length, spawned=g.stats.spawned;
  // força a próxima chegada
  g.schedule[g.nextIdx].t=g.elapsed; g.update(0.05);
  ok(g.stats.full===full0+1,'estatística "não couberam" +1');
  ok(g.queue.length===qlen,'fila continua com 4');
  ok(g.stats.lost===lost0,'não conta como perdido na carreira');
  ok(g.money===mny,'sem penalidade de dinheiro');
  const bn=g.groups.find(x=>x.bounced); ok(bn&&bn.state==='leaving','grupo foi embora');
  ok(g.fx.some(f=>f.k==='text'&&f.text==='Lotado!'),'texto "Lotado!" na porta');
  guard=0; while(g.groups.includes(bn)&&guard++<200) g.update(0.05); ok(!g.groups.includes(bn),'grupo some depois de sair');
  g.queue.slice().forEach(x=>{x.hearts=5;});
  // fim do dia com tudo parado => resultado traz full
  g.clock=0.1; for(let i=0;i<200;i++) g.update(0.05);
  ok(g.state==='dayend'&&g.result.full>=1,'resultado do dia inclui "não couberam" ('+g.result.full+')');
}

/* ---------- 3. Turno sem fim ---------- */
{
  const H=load(); const {g,L,els}=H; const bot=require('./bot.js')(g,L);
  els['btn-endless'].fire('click'); ok(g.state==='intro'&&g.mode==='semfim','botão Turno sem fim abre a intro');
  ok(els['intro-title'].textContent==='Turno sem fim','título da intro');
  els['btn-start'].fire('click'); ok(g.state==='playing','jogando');
  ok(g.tables.every(t=>t.open),'6 mesas abertas'); ok(g.stars===5,'5 estrelas');
  ok(Math.abs(g.endlessInterval()-9)<1e-9,'intervalo inicial 9s');
  g.elapsed=60; ok(Math.abs(g.endlessInterval()-7)<1e-9,'intervalo em 60s = 7s'); g.elapsed=300; ok(g.endlessInterval()===3.5,'intervalo mínimo 3,5s'); g.elapsed=0;
  // cozinha mais lenta: 1%/min até 25%
  g.elapsed=600; let tk={group:{},table:1}; g.kitchen.queue=[]; const orig=Math.random; Math.random=()=>0; g.kitchen.submit(tk); const t0=g.kitchen.queue[0].time; Math.random=orig;
  ok(Math.abs(t0-4*1.10)<1e-6,'10 min => +10% ('+t0.toFixed(3)+')');
  g.elapsed=6000; g.kitchen.queue=[]; Math.random=()=>0; g.kitchen.submit(tk); const t1=g.kitchen.queue[0].time; Math.random=orig; ok(Math.abs(t1-4*1.25)<1e-6,'teto +25%');
  g.elapsed=0; g.kitchen.queue=[];
  // chegadas contínuas
  let guard=0; while(g.queue.length<1&&guard++<400) g.update(0.05); ok(g.queue.length>=1,'chegadas contínuas');
  // cliente bravo tira 1 estrela
  const q=g.queue[0]; q.hearts=1; q.patLeft=0.01; g.update(0.1); ok(g.stars===4,'bravo: 5 -> 4 estrelas');
  // não coube tira 1 estrela
  g.queue.slice().forEach(x=>{ x.patLeft=1e9; }); 
  guard=0; while(g.queue.length<4&&guard++<4000){ g.queue.forEach(x=>{x.patLeft=1e9;x.hearts=5;}); g.update(0.05);} 
  const s0=g.stars, f0=g.stats.full; g.arrT=0; g.update(0.05); ok(g.stats.full===f0+1&&g.stars===s0-1,'não coube: -1 estrela ('+s0+' -> '+g.stars+')');
  ok(g.stats.lost>=2,'conta como cliente perdido');
  // recuperação: 8 contas com 5 corações
  g.stars=2; g.five=0; const tb=g.tables[0];
  for(let i=0;i<8;i++){ const grp=new L.Group(g,'estudante',900+i,0); grp.hearts=5; grp.table=tb; tb.group=grp; g.collectBill(grp,tb); tb.dirty=false; }
  ok(g.stars===3,'8 contas com 5 corações recuperam 1 estrela'); ok(g.five===0,'contador zera');
  for(let i=0;i<7;i++){ const grp=new L.Group(g,'estudante',950+i,0); grp.hearts=4; grp.table=tb; tb.group=grp; g.collectBill(grp,tb); tb.dirty=false; }
  ok(g.stars===3,'contas com 4 corações não contam');
  g.stars=5; g.five=7; { const grp=new L.Group(g,'estudante',990,0); grp.hearts=5; grp.table=tb; tb.group=grp; g.collectBill(grp,tb); tb.dirty=false; } ok(g.stars===5,'máximo 5 estrelas');
  // fim com 0 estrelas
  g.stars=1; g.queue.slice().forEach(x=>{ x.hearts=1; x.patLeft=0.01; }); g.update(0.1);
  ok(g.stars===0&&g.ending&&g.reason==='stars','0 estrelas => fim de turno');
  for(let i=0;i<100&&g.state==='playing';i++) g.update(0.05);
  ok(g.state==='endlessend','estado endlessend'); ok(g.endless&&g.endless.pontos===Math.round(g.money)&&g.endless.tempo>=0,'resultado: pontos/tempo');
  ok(els['ov-endless'].classList.contains('show'),'tela de fim exibida');
  ok(!g.groups.some(x=>x.state!=='leaving'),'todos saem ao fim');
  // reiniciar
  els['btn-endless-again'].fire('click'); ok(g.state==='intro'&&g.stars===5&&g.money===0,'jogar de novo reinicia');
  L.render(g,H.ctx);
  // pontuação do modo = dinheiro (mesmas regras): bot por 120 s
  g.begin(); let st=0; while(g.state==='playing'&&st<2400){ bot(); g.update(0.05); st++; if(st%20===0) L.render(g,H.ctx); }
  console.log('  (bot sem fim: ',(st*0.05).toFixed(0)+'s, R$',Math.round(g.money),'estrelas',g.stars,'atendidos',g.stats.served,')');
  ok(g.money>0,'bot ganha dinheiro no sem fim');
}

/* ---------- 4. ranking local ---------- */
{
  const H=load(); const {g,L,els}=H; const R=L.Rank;
  await R.init(); ok(!R.shared,'sem window.claude: ranking local');
  let r=await R.saveScore('carreira','  Ana   Paula  ',500,{dia:3});
  ok(r.where==='local'&&r.improved,'salvou local');
  r=await R.saveScore('carreira','ANA PAULA',300,{dia:2}); ok(!r.improved&&r.best===500,'mesmo nome (normalizado): mantém a melhor');
  r=await R.saveScore('carreira','Ana Paula',900,{dia:4}); ok(r.improved,'melhora sobrescreve');
  r=await R.saveScore('carreira','Áurea',100,{dia:1}); r=await R.saveScore('carreira','aurea',50,{dia:1}); ok(!r.improved,'acentos normalizados (Áurea=aurea)');
  await R.saveScore('carreira','Zé',700,{dia:3}); await R.saveScore('carreira','Bruno',700,{dia:5});
  let rows=R.localRows('carreira'); ok(rows.length===4,'4 jogadores únicos ('+rows.length+')');
  const names=a=>a.map(x=>x.nome).join(',');
  ok(names(L.sortRows(rows,'pontos','desc'))==='Ana Paula,Bruno,Zé,aurea','pontos desc (empate por nome)');
  ok(names(L.sortRows(rows,'pontos','asc'))==='aurea,Bruno,Zé,Ana Paula','pontos asc');
  ok(names(L.sortRows(rows,'nome','asc'))==='Ana Paula,aurea,Bruno,Zé','nome asc (pt-BR)');
  ok(names(L.sortRows(rows,'nome','desc'))==='Zé,Bruno,aurea,Ana Paula','nome desc');
  ok(L.cleanName('x'.repeat(40)).length===16,'nome limitado a 16'); ok(L.cleanName('  <b>a</b>\n\tb ')==='<b>a</b> b','espaços limpos (texto mantido, sem html)');
  await R.saveScore('semfim','Lu',1234,{tempo:95}); ok(R.localRows('semfim')[0].tempo===95,'semfim guarda tempo'); ok(R.localRows('carreira').length===4,'abas separadas');
  ok(!!H.store['lcc2_ranking'],'chave lcc2_ranking');
  // UI: renderRank
  L.rk.tab='carreira'; L.rk.by='nome'; L.rk.dir='asc'; L.rk.rows=rows; L.rk.source='local'; L.renderRank();
  const tb=els['rank-wrap'].children[0]; const cell=i=>tb.children[i].children[0].textContent;
  ok(tb.children.length===5 && cell(1)==='Ana Paula' && cell(4)==='Zé','tabela renderizada ordenada por nome asc');
  L.rk.by='pontos'; L.rk.dir='desc'; L.renderRank(); ok(els['rank-wrap'].children[0].children[1].children[1].textContent==='900','pontos desc: primeiro tem 900');
  ok(els['rank-source'].textContent==='Ranking deste aparelho','rótulo local');
  // abrir tela e fechar
  L.openRank('ov-menu'); ok(els['ov-rank'].classList.contains('show'),'tela de ranking abre'); await sleep(30);
  ok(L.rk.unsub!==undefined,'assinatura local ok'); L.closeRank(); ok(!els['ov-rank'].classList.contains('show')&&els['ov-menu'].classList.contains('show'),'fecha e volta ao menu');
  // formulário: nome lembrado
  H.els['nm-carreira']; 
}

/* ---------- 5. caminho db ---------- */
{
  const stub=mkStub({}); const H=load({claude:stub.claude}); const {g,L,els}=H; const R=L.Rank;
  await R.init(); ok(R.shared&&R.uid==='u_abc123','db+user resolvidos, uid ok');
  let r=await R.saveScore('carreira','Marta',400,{dia:2});
  ok(r.where==='shared'&&r.improved,'salvou no db'); ok(!!stub.data['ranking-carreira/u_abc123'],'doc em ranking-carreira/<userId>');
  let d=stub.data['ranking-carreira/u_abc123']; ok(d.nome==='Marta'&&d.pontos===400&&d.dia===2&&typeof d.quando==='string'&&!isNaN(Date.parse(d.quando))&&d.tempo===undefined,'campos nome/pontos/dia/quando');
  r=await R.saveScore('carreira','Marta',100,{dia:1}); ok(!r.improved&&stub.data['ranking-carreira/u_abc123'].pontos===400,'não sobrescreve pontos menores');
  r=await R.saveScore('carreira','Marta B.',100,{dia:1}); ok(stub.data['ranking-carreira/u_abc123'].nome==='Marta B.'&&stub.data['ranking-carreira/u_abc123'].pontos===400,'nome atualizado sempre (update)');
  ok(stub.log.includes('update:ranking-carreira/u_abc123'),'usou update para o nome');
  r=await R.saveScore('carreira','Marta B.',800,{dia:5}); ok(stub.data['ranking-carreira/u_abc123'].pontos===800&&stub.data['ranking-carreira/u_abc123'].dia===5,'sobrescreve se maior');
  r=await R.saveScore('semfim','Marta B.',640,{tempo:130}); d=stub.data['ranking-semfim/u_abc123']; ok(d&&d.tempo===130&&d.pontos===640&&d.dia===undefined,'semfim: ranking-semfim/<userId> com tempo');
  // outros jogadores no db (com dados hostis)
  stub.data['ranking-carreira/u_x']={nome:'<img src=x onerror=alert(1)>'+'a'.repeat(50),pontos:999.6,dia:'3'};
  stub.data['ranking-carreira/u_bad']={nome:'Lixo',pontos:'abc'};
  stub.data['ranking-carreira/u_y']={nome:'Caio',pontos:50,dia:1};
  let got=null, src=null; const un=R.subscribe('carreira',(rows,s)=>{got=rows;src=s;}); await sleep(10);
  ok(src==='shared'&&got.length===3,'assinatura compartilhada: 3 linhas válidas (lixo descartado)');
  ok(got.find(x=>x.me)&&got.find(x=>x.me).nome==='Marta B.','linha própria marcada');
  const hos=got.find(x=>x.id==='u_x'); ok(hos.nome.length===16&&hos.pontos===1000,'nome truncado em 16 e pontos arredondados (dados não confiáveis)');
  ok(stub.subs.length===1,'uma assinatura por aba'); // ordenou desc + limit 50
  un(); ok(stub.log.includes('unsub:ranking-carreira'),'cancelou assinatura');
  // tela de ranking usa textContent
  L.rk.tab='carreira'; L.openRank('ov-menu'); await sleep(50);
  ok(els['rank-source'].textContent==='Ranking compartilhado','rótulo compartilhado');
  const tb=els['rank-wrap'].children[0]; const txts=tb.children.slice(1).map(tr=>tr.children[0].textContent);
  ok(txts.some(t=>t.startsWith('<img')),'HTML do db inserido como texto (textContent)');
  const subsBefore=stub.subs.length; L.rk.by='nome'; L.renderRank(); L.rk.dir='asc'; L.renderRank(); ok(stub.subs.length===subsBefore,'trocar ordenação não reassina');
  L.closeRank(); ok(stub.subs.filter(s=>!s.dead).length===0,'sair da tela cancela assinatura');
}
// db null
{ const stub=mkStub({noDb:true}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init(); ok(!R.shared,'use("db") null => local');
  const r=await R.saveScore('carreira','Nulo',10,{dia:1}); ok(r.where==='local'&&!r.refused,'fallback local sem db'); }
// user.id null
{ const stub=mkStub({uid:null}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init(); ok(!R.shared,'user.id null => local');
  const r=await R.saveScore('carreira','SemId',10,{dia:1}); ok(r.where==='local','fallback local sem id'); ok(Object.keys(stub.data).length===0,'nada gravado no db'); }
{ const stub=mkStub({noUser:true}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init(); ok(!R.shared,'use("user") null => local'); }
// uid inválido p/ path
{ const stub=mkStub({uid:'a/b'}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init(); ok(!R.shared,'uid fora da gramática => local'); }
// gravação recusada
for(const code of ['invalid_argument','not_granted','permission_denied']){
  const stub=mkStub({writeErr:{code,message:'x'}}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init();
  const r=await R.saveScore('carreira','Recusado',77,{dia:1}); ok(r.where==='local'&&r.refused,'gravação recusada ('+code+') => local + refused'); ok(R.localRows('carreira').length===1,'  registrado localmente');
}
// erro de rede: rejeita (UI mostra mensagem), não trava
{ const stub=mkStub({getErr:{code:'resource_exhausted',message:'x'}}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init();
  let err=null; try{ await R.saveScore('carreira','Rede',77,{dia:1}); }catch(e){ err=e; } ok(err&&err.code==='resource_exhausted','falha de rede propaga erro (UI mostra mensagem curta)'); }
// erro na assinatura => cai para local
{ const stub=mkStub({snapErr:true}); const H=load({claude:stub.claude}); const R=H.L.Rank; await R.init(); await R.saveScore('carreira','X',1,{dia:1}).catch(()=>{});
  let src=null; R.subscribe('carreira',(r,s)=>{src=s;}); await sleep(10); ok(src==='local','erro na assinatura => ranking local'); }
// use() que rejeita / lança / nunca resolve
{ const H=load({claude:{use:()=>Promise.reject(new Error('x'))}}); await H.L.Rank.init(); ok(!H.L.Rank.shared,'use() rejeita => local'); }
{ const H=load({claude:{use:()=>{ throw new Error('boom'); }}}); await H.L.Rank.init(); ok(!H.L.Rank.shared,'use() lança => local'); }
{ const H=load({claude:{}}); await H.L.Rank.init(); ok(!H.L.Rank.shared,'window.claude sem use => local'); }
{ const H=load({claude:{use:()=>new Promise(()=>{})}}); const t=Date.now(); const r=await H.L.Rank.saveScore('carreira','Trava',10,{dia:1}); const dt=Date.now()-t;
  ok(r.where==='local'&&dt<5000,'use() que nunca resolve não trava o salvar ('+dt+' ms)'); ok(H.g.state==='menu','jogo segue funcionando'); }
// retry em unavailable
{ let n=0; const stub=mkStub({}); const orig=stub.db.doc; stub.db.doc=(p)=>{ const d=orig(p); const g0=d.get; d.get=()=>{ n++; return n===1?Promise.reject({code:'unavailable'}):g0(); }; return d; };
  const H=load({claude:stub.claude}); await H.L.Rank.init(); const r=await H.L.Rank.saveScore('carreira','Retry',5,{dia:1}); ok(r.where==='shared'&&n===2,'unavailable: uma nova tentativa'); }

/* ---------- 6. save / v1 / storage ---------- */
{
  const v1={maxDay:5,bank:420,up:{tenis:true},best:{1:600,2:900},stars:{1:3,2:1}};
  const H=load({store:{lcc_save_v1:JSON.stringify(v1)}}); const g=H.g;
  ok(g.save.maxDay===5&&g.save.bank===420&&g.up.tenis===true&&g.save.best[2]===900,'importa progresso da v1');
  ok(!!H.store.lcc2_save,'gravou lcc2_save'); g.save.bank=5; H.L.lsSet('lcc2_save',JSON.stringify(g.save));
  const H2=load({store:{lcc_save_v1:JSON.stringify(v1),lcc2_save:H.store.lcc2_save}}); ok(H2.g.save.bank===5,'lcc2_save tem prioridade sobre v1');
  const H3=load({store:{lcc_save_v1:'{lixo'}}); ok(H3.g.save.maxDay===1,'v1 corrompido ignorado');
  const H4=load({noStorage:true}); ok(H4.g.state==='menu','sem localStorage: abre normal'); H4.g.startEndless(); H4.g.begin(); for(let i=0;i<50;i++) H4.g.update(0.05); ok(true,'sem localStorage: joga');
  const H5=load({throwStorage:true}); ok(H5.g.state==='menu','localStorage lançando: abre normal');
  const r=await H5.L.Rank.saveScore('carreira','Mem',9,{dia:1}); ok(r.where==='local'&&H5.L.Rank.localRows('carreira').length===1,'ranking local funciona com storage bloqueado (memória)');
  H.L.lsSet('lcc2_name','Bia'); ok(H.L.lsGet('lcc2_name')==='Bia','nome lembrado');
  ok(g.careerMaxDone()===2,'maior dia concluído (estrelas>=1)');
}

/* ---------- 7. render em todos os estados / movimento reduzido ---------- */
for(const rm of [false,true]){
  const H=load({rm}); const {g,L,ctx}=H; const bot=require('./bot.js')(g,L);
  let err=null; try{
    L.render(g,ctx);
    g.startDay(5); g.begin(); for(let i=0;i<1500;i++){ bot(); g.update(0.05); if(i%15===0) L.render(g,ctx); }
    g.startEndless(); g.begin(); for(let i=0;i<2400;i++){ bot(); g.update(0.05); if(i%15===0) L.render(g,ctx); }
    g.groups.forEach(x=>x.hearts=1); L.render(g,ctx); g.stars=1; g.queue.forEach(x=>{x.hearts=1;x.patLeft=0.01;}); g.update(0.1); L.render(g,ctx);
  }catch(e){ err=e; console.log(e.stack); }
  ok(!err,'render sem exceções (reduced-motion='+rm+')');
}
console.log('\n'+(total-fails)+'/'+total+' ok; fails=',fails); process.exit(fails?1:0);
})().catch(e=>{ console.log('ERRO',e); process.exit(2); });
