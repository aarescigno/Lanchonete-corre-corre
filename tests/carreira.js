// Carreira inteira com o dinheiro acumulado de verdade: o bot compra 1 melhoria por dia (na ordem), 1 móvel por
// lojinha (v7.4, regra em bot.moveis) e, do dia 3 em diante, contrata a equipe completa que o dinheiro pagar.
// Mostra o dinheiro em cada lojinha e os lugares do salão. MOVEIS=0: não compra móveis (fica no kit).
// Uso: node carreira.js [N] [divulga]   (divulga: boca, panfleto ou redes; padrão panfleto)
// v8.3, campanha: joga DIAS dias em sequência (padrão 14; do dia 8 em diante, o perfil do dia 7 com o dia da semana),
// com o caixa podendo ficar negativo (e o banco cobrindo à força no 4º dia seguido). Mostra também os dias no negativo,
// os empréstimos à força e em que dia o dinheiro chegou a R$ 800 (a mudança para a área industrial).
// v8, manutenção e imprevistos:
//   MANUT=sem    (padrão) imprevistos desligados (MANUT.on=false), como antes
//   MANUT=com    liga os imprevistos (desgaste, quebras do dia 4 em diante, chuva e feriado do dia 3) e o jogador nunca revisa
//   MANUT=amarelo|vermelho  revisa só quem saiu do verde (abaixo de MANUT.verde) ou só quem já está no vermelho
//   MANUT=cuida  liga e revisa tudo (revisarTudo) em toda lojinha, antes das outras compras, com o dinheiro de verdade
//   CONSERTO=1   chama o técnico na hora quando o fogão quebra (se tiver dinheiro; CONSERTO=todos: os três equipamentos)
//   Com MANUT=com|cuida, mostra por dia: quebras (média), chuva/feriado (dias), revisão e conserto (R$) e o dinheiro final.
//   MANUT_CFG='{"equip":{"fogao":{"preco":300}}}' e CLIMA_CFG='{"chuva":{"chance":0.1}}' trocam L.MANUT / L.CLIMA em runtime (sem mexer em src/)
const N=+process.argv[2]||10, DIV=process.argv[3]||'panfleto';
/* v8.7: joga a História (reforma, capítulos e a Dani de graça no cap. 2); HIST=0 joga sem ela */ const H=require('./harness.js')({historia:process.env.HIST!=='0'}); const {g,L}=H; const BOT=require('./bot.js'), bot=BOT(g,L,{afiado:process.env.BOT==='afiado',conserto:process.env.CONSERTO==='todos'?'todos':!!process.env.CONSERTO});   // BOT=afiado: o jogador perfeito (v8.6.9: para conferir a nota do Gurugol)
const MODO=process.env.MANUT||'sem'; if(!['sem','com','cuida','amarelo','vermelho'].includes(MODO)) throw new Error('MANUT=sem|com|cuida|amarelo|vermelho');
L.MANUT.on=MODO!=='sem';
if(process.env.MANUT_CFG){ const c=JSON.parse(process.env.MANUT_CFG); const eq=c.equip; delete c.equip; Object.assign(L.MANUT,c); if(eq) for(const id in eq) Object.assign(L.manutOf(id),eq[id]); }
if(process.env.PONTO_CFG){ const c=JSON.parse(process.env.PONTO_CFG); for(const k in c){ if(c[k]&&typeof c[k]==='object'&&!Array.isArray(c[k])) Object.assign(L.PONTOS[1][k],c[k]); else L.PONTOS[1][k]=c[k]; } }   // v9: PONTO_CFG='{"cardapio":1.3,"aluguel":100}' troca números da área industrial em runtime
if(process.env.CLIMA_CFG){ const c=JSON.parse(process.env.CLIMA_CFG); for(const k in c) Object.assign(L.CLIMA[k],c[k]); }
// v9.0.5: a ordem de liberação dos cartões da lojinha (LIBERA): LIBERA=0 deixa tudo aberto (o jogo da v9.0.3, a base de comparação);
//   LIBERA_ORDEM=bia,salao,melhorias,manut,decor reordena (dia e garantia seguem a posição: 2/4, 3/5, 3/5, 4/6, 5/7);
//   LIBERA_CFG='{"salao":{"dia":3,"ate":5}}' troca dia e garantia de um cartão
const LIB_TAB=[[2,4],[3,5],[3,5],[4,6],[5,7]];
if(process.env.LIBERA_ORDEM){ const ids=process.env.LIBERA_ORDEM.split(','); const nova=ids.map(id=>L.LIBERA.find(x=>x.id===id)); if(nova.length!==5||nova.some(x=>!x)) throw new Error('LIBERA_ORDEM com os 5 ids'); L.LIBERA.splice(0,5,...nova); L.LIBERA.forEach((x,i)=>{ x.dia=LIB_TAB[i][0]; x.ate=LIB_TAB[i][1]; }); }
if(process.env.LIBERA_CFG){ const c=JSON.parse(process.env.LIBERA_CFG); for(const id in c) Object.assign(L.LIBERA.find(x=>x.id===id),c[id]); }
const libTudo=[], libAbre={}, libVis=[], libPend=[], libVerm=[]; let libLucro=0;   // dia (da lojinha) em que cada cartão abre; cartões à vista por dia; pendentes juntos; Manutenção aberta antes da 1ª barra vermelha
const order=['tenis','maquina','cafeteira','bandeja','ventilador','pratos','corrida'];
const FULL=[{tonhao:4,dani:4,tv:true,som:true},{tonhao:3,dani:4,tv:true,som:true},{tonhao:2,dani:4,tv:true,som:true},{tonhao:2,dani:4,tv:true},{tonhao:2,dani:4},{tonhao:1,dani:3},{tonhao:0,dani:2},{}];   // v8.8: o Tonhão só sobe até onde a XP dos cursos deixa (capT)
const capT=e=>Object.assign({},e,{tonhao:Math.min(e.tonhao||0,L.tonhaoNivelXp(g.save.cursos)),dani:Math.min(e.dani||0,L.daniNivelXp(g.save))}), nivDia=[[],[],[],[],[]], vistoT=new Set();   // v8.9: a Dani também só sobe até onde a XP dela deixa
const xpDani={}, nivDani=[[],[],[],[]], vistoD=new Set(), tarNiv=[[],[],[],[]], daniCursoDias={};   // v8.9: o dia em que ela chega a cada nível, as tarefas por dia em cada nível e o dia de cada curso dela
const daniCursos=(reserva)=>{ if(!g.daniChegou) return ''; const c=L.DANI_CURSOS.find(x=>!g.save.daniCursos[x.id]); return c&&g.save.bank-c.preco>=reserva&&g.buyDaniCurso(c.id)?c.id:''; };
// ajuste rápido sem mexer em src/: CONTAS='{"mesa":40}' INGRED='{"prato":0.6}' node carreira.js
if(process.env.MOVIMENTO) Object.assign(L.MOVIMENTO,JSON.parse(process.env.MOVIMENTO));   // MOVIMENTO='{"porLugar":0.04}'
if(process.env.CONTAS) Object.assign(L.CONTAS,JSON.parse(process.env.CONTAS));
if(process.env.INGRED) Object.assign(L.INGRED,JSON.parse(process.env.INGRED));
if(process.env.CARDAPIO){ const c=JSON.parse(process.env.CARDAPIO); for(const k in c) L.CARDAPIO[k].preco=c[k]; }   // v8.3.8: CARDAPIO='{"pf":25}' testa os preços dos pratos
if(process.env.MAIS) Object.assign(L.MAIS,JSON.parse(process.env.MAIS));   // v8.3.8: MAIS='{"cada":0.6}' testa o 2º pedido
const ND=+process.env.DIAS||14, MUDA=800; /* v8.6.9: cursoDias guarda o dia em que cada curso foi comprado (id+nível) */ const cursoDias={}; const rows={}, chega=[]; let negs=0, forcs=0, fechou=0; const capDia={1:[],2:[],3:[],4:[],5:[]}, mudaDia=[], lucroGar=[], lucroInd=[], negPos=[];   // v8.7: o dia em que cada capítulo foi cumprido
for(let k=0;k<N;k++){
  g.save=L.normSave({}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); let semMesa=0, chegou=0, vermVisto=false, runAbre={}; if(process.env.LIBERA==='0') for(const x of L.LIBERA) g.save.libera[x.id]=2;
  for(let n=1;n<=ND;n++){
    const r=rows[n]||(rows[n]={shop:[],after:[],lucro:[],pass:0,eq:[],lug:[],rev:[],con:[],qb:[],est:[],chuva:0,fer:0,fim:[],nota:[]});
    if(n>=2){
      g.goShop(n);
      // v9: a área industrial: o bot muda assim que pode (R$ 800 e a nota); MUDA=0 fica na Garagem
      if(process.env.MUDA!=='0' && g.mudancaVisivel && !g.mudancaFalta && g.mudarPonto()) mudaDia.push(n);
      if(g.ponto.nivel>=2){ const F=L.INDUSTRIAL.fogao, sobra=c=>g.save.bank-L.payroll(g.save.equipe)-c>=300;   // fogão industrial, TVs com anúncios, cadeirinhas e a jarra (a Água da torneira, mais cara) quando sobra R$ 300 acima da folha
        if(!g.up.fogaoInd&&sobra(F.cost)) g.comprarInd('fogaoInd'); if(!g.up.tvs&&sobra(L.INDUSTRIAL.tvs.instalar)) g.comprarInd('tvs'); if(!g.up.assento&&sobra(L.INDUSTRIAL.assento.cadeira.cost)) g.comprarInd('assento','cadeira'); }
      if(MODO==='cuida'){ const b0=g.save.bank; g.revisarTudo(); r.rev.push(b0-g.save.bank); }
      if(MODO==='amarelo'||MODO==='vermelho'){ const lim=MODO==='amarelo'?L.MANUT.verde:L.MANUT.vermelho, b0=g.save.bank; L.MANUT.equip.forEach(q=>{ if(g.save.manut[q.id]<lim) g.revisar(q.id); }); r.rev.push(b0-g.save.bank); }   // v8.3.12: amarelo = revisa quem saiu do verde; vermelho = só quem já está no vermelho
      for(;;){ const u=order.find(id=>!g.up[id]); const uc=u&&L.UPGRADES.find(x=>x.id===u);   // v8.6.14: sem o limite de 1 por dia, compra na ordem tudo o que o dinheiro der, guardando a reserva
        if(!(u && g.save.bank>=uc.cost+(n>=3?300:0) && g.buy(u))) break; }
      if(process.env.CURSOS!=='0'){ const cu=BOT.cursos(g,L,n>=3?(+process.env.RCURSO>=0?+process.env.RCURSO:150):0,process.env.CURSOS?process.env.CURSOS.split(','):undefined); if(cu) (cursoDias[cu]=cursoDias[cu]||[]).push(n); }   // v8.6.9: 1 curso por lojinha, se sobrar o preço mais a reserva (CURSOS=0 não compra)   // v8.8: o curso vem antes dos móveis, com reserva de R$ 150 (RCURSO=n troca): a XP é o que sobe o Tonhão
      if(process.env.CURSOS!=='0'){ const dc=daniCursos(n>=3?(+process.env.RCURSO>=0?+process.env.RCURSO:150):0); if(dc) (daniCursoDias[dc]=daniCursoDias[dc]||[]).push(n); }   // v8.9: depois do curso do Tonhão, o da Dani (um por lojinha, à parte)
      if(process.env.MOVEIS!=='0') BOT.moveis(g,L,semMesa,n>=3?300:0,process.env.MOVEIS);
      if(n>=3 || g.save.cap>=2){
        const e0=n>=3?(FULL.map(capT).find(e=>L.payroll(L.normSave({equipe:e}).equipe)+(L.divulgaOf(DIV).cost)<=g.save.bank)||{}):{};
        const e=Object.assign({},e0,L.HIST.on?{dani:g.save.cap>=2?Math.max(1,e0.dani||0):0}:{});   // v8.7: a Dani só chega no cap. 2 (aprendiz, sem salário)
        g.save.equipe=L.normSave({equipe:Object.assign({daniTasks:['pratos','lavar','lixo']},e)}).equipe;
        if(n>=3) g.save.divulga=DIV;
        if(g.up.tvs&&L.payroll(Object.assign({},g.save.equipe,{tvs:1}))+(L.divulgaOf(DIV).cost)<=g.save.bank) g.save.equipe.tvs=1;   // v9: as TVs com anúncios
        for(let t=1;t<=g.save.equipe.dani;t++) if(!vistoD.has(k+':'+t)){ vistoD.add(k+':'+t); nivDani[t-1].push(n); }   // v8.9
        for(let t=0;t<=g.save.equipe.tonhao;t++) if(!vistoT.has(k+':'+t)){ vistoT.add(k+':'+t); nivDia[t].push(n); }   // v8.8: o dia em que ele chega a cada nível
      }
      r.shop.push(g.save.bank);
    }
    (libVis[n]=libVis[n]||[]).push(L.LIBERA.filter(x=>g.save.libera[x.id]>=1).length); const manutAbre=g.save.libera.manut>=1;
    if(g.proxDia!==n) throw new Error('a campanha pulou: '+g.proxDia+' em vez de '+n);
    if(MODO!=='sem') r.est.push(L.MANUT.equip.map(q=>g.save.manut[q.id]));   // estado antes do dia (v8.3.11)
    g.startDay(n); g.begin(); r.after.push(g.save.bank-g.paid-g.paidDiv); r.eq.push(g.paid);   // v8.2.2: a folha só sai no fim do dia; "depois da folha" é o que sobra além dela
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    if(process.env.DBGF){ const r=g.result; console.log('dbgF',k,n,g.ponto.id.slice(0,3),'grupos',g.stats.spawned,'serv',r.served,'perd',r.lost,JSON.stringify(r.lostBy),'fat',r.fat,'ingr',r.custo,'contas',r.contas,'folha',g.paid+g.paidDiv,'lucro',r.money,'meta',r.meta,'nota',(g.gurugol||{nota:0}).nota.toFixed?(g.gurugol||{nota:0}).nota.toFixed(2):'-','full',g.stats.full,'marm',g.stats.marmitas,'slots',g.kitchen.slots,'lug',L.salaoLugares(g.save.salao.mesas),'bank',g.save.bank,'eq',g.save.equipe.tonhao+'/'+g.save.equipe.dani+(g.save.equipe.tvs?'T':''),'up',Object.keys(g.up).join('+')); }
    if(process.env.DBGD) console.log('dbg',n,'tar',g.save.daniTar,'feitas',g.result.daniFeitas,'cursos',Object.keys(g.save.daniCursos).length,'nivel',g.save.equipe.dani);
    (xpDani[n]=xpDani[n]||[]).push([L.daniXp(g.save),g.save.equipe.dani]);   // v8.9: a XP dela e o nível pago no fim de cada dia
    if(g.save.equipe.dani>0) tarNiv[g.save.equipe.dani-1].push(g.result.daniFeitas);   // v8.9: tarefas da Dani no dia, pelo nível dela
    { const ge=L.avalGeral(g.save.aval); r.nota.push(ge?ge.nota:null); }   // v8.6.9: a nota geral do Gurugol no fim do dia
    r.lucro.push(g.result.money); r.con.push(g.result.conserto); r.qb.push(g.result.quebras.length); if(g.result.clima==='chuva') r.chuva++; if(g.result.clima==='feriado') r.fer++; r.fim.push(g.save.bank); if(g.result.passed) r.pass++; semMesa=g.result.lostBy.semMesa; r.lug.push(L.salaoLugares(g.save.salao.mesas)); if(g.save.bank<0) negs++; if(g.result.forcado) forcs++; if(!chegou&&g.save.bank>=MUDA) chegou=n; if(process.env.MESAS) console.log(n, g.save.salao.mesas.map(m=>m.seats).sort().join(''), 'semMesa', semMesa);
    // v8.7: o que a interface faz entre os dias: a conversa de depois fecha o capítulo (e abre o seguinte); a de antes só passa
    if(!vermVisto && Math.min.apply(null,L.MANUT.equip.map(q=>g.save.manut[q.id]))<L.MANUT.vermelho){ vermVisto=true; libVerm.push(manutAbre); }   // v9.0.5: a 1ª barra vermelha: o cartão já estava aberto na lojinha desse dia?
    let falou=false; while(g.save.conversa){ falou=true; if(g.save.conversa==='depois'){ capDia[g.save.cap].push(n); g.avancaCap(); } else g.save.conversa=null; }
    { const sv=g.save; (libPend[n]=libPend[n]||[]).push(L.LIBERA.filter(x=>sv.libera[x.id]==='pend').length);   // v9.0.5: uma conversa por fim de dia, como o fluxoHistoria (a de capítulo primeiro; Manutenção, Cardápio, Divulgação, os outros cartões na ordem de LIBERA)
      if(!falou){ const man=L.LIBERA.find(x=>x.primeiro&&sv.libera[x.id]==='pend'), outra=L.LIBERA.find(x=>sv.libera[x.id]==='pend'), ab=x=>{ sv.libera[x.id]=2; runAbre[x.id]=n+1; };
        if(man) ab(man); else if(sv.convCard==='pend') sv.convCard=1; else if(sv.convDiv==='pend') sv.convDiv=1; else if(outra) ab(outra); } }
    if(g.state==='falencia'){ fechou++; break; }
    (g.ponto.nivel>=2?lucroInd:lucroGar).push(g.result.money); if(mudaDia[mudaDia.length-1]!==undefined&&n-mudaDia[mudaDia.length-1]<=5&&n>mudaDia[mudaDia.length-1]&&g.save.bank<0) negPos.push(n);
  }
  chega.push(chegou||Infinity); for(const x of L.LIBERA) if(runAbre[x.id]) (libAbre[x.id]=libAbre[x.id]||[]).push(runAbre[x.id]); libTudo.push(L.LIBERA.every(x=>(g.save.libera[x.id]>=1)&&(process.env.LIBERA==='0'||runAbre[x.id]<=9)));
}
const avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):'-';
if(process.env.LIBERA!=='0'||true){   // v9.0.5: a linha LIBERA
  const av=a=>a.reduce((x,y)=>x+y,0)/a.length;
  console.log('LIBERA',process.env.LIBERA==='0'?'(tudo aberto)':L.LIBERA.map(x=>x.id+' '+x.dia+'/'+x.ate).join(', '),'| dia médio em que abre',L.LIBERA.map(x=>x.id+' '+(libAbre[x.id]?av(libAbre[x.id]).toFixed(1)+' ('+libAbre[x.id].length+'/'+N+')':'-')).join(' · '),'| cartões à vista por dia (1 a 10)',[1,2,3,4,5,6,7,8,9,10].map(n=>libVis[n]?av(libVis[n]).toFixed(1):'-').join(' '),'| pendentes juntos (máx.)',Math.max.apply(null,libPend.filter(Boolean).map(a=>Math.max.apply(null,a))),'| todos abertos até o dia 9',libTudo.filter(Boolean).length+'/'+N,'| Manutenção aberta antes da 1ª barra vermelha',libVerm.filter(Boolean).length+'/'+libVerm.length);
}
for(let n=1;n<=ND;n++){ const r=rows[n], d=L.diaOf(n); console.log('Dia',n+(d.semana?' ('+d.semana.slice(0,3)+')':''),'meta',d.meta,'| dinheiro na lojinha',avg(r.shop),'| depois da folha',avg(r.after),'| folha',avg(r.eq),'| lucro',avg(r.lucro),'| lugares',avg(r.lug),'| passou',r.pass+'/'+N,'| Gurugol geral',(()=>{ const v=r.nota.filter(x=>x!=null); return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):'-'; })()); }
if(L.HIST.on){ const md=a=>a.length?a.sort((x,y)=>x-y)[Math.floor(a.length/2)]:'-'; console.log('HISTORIA | cap. 1 no dia',md(capDia[1]),'('+capDia[1].length+'/'+N+')','· cap. 2 no dia',md(capDia[2]),'('+capDia[2].length+'/'+N+')','· cap. 3 no dia',md(capDia[3]),'('+capDia[3].length+'/'+N+', até o dia 14: '+capDia[3].filter(d=>d<=14).length+')','· cap. 4 no dia',md(capDia[4]),'('+capDia[4].length+'/'+N+')','· cap. 5 no dia',md(capDia[5]),'('+capDia[5].length+'/'+N+')','| mudou no dia',md(mudaDia),'('+mudaDia.length+'/'+N+')','| banco tomou a lanchonete',fechou+'/'+N); }
console.log('DANI | dia médio em que chega ao nível (aprendiz = 1) '+nivDani.map((a,i)=>(i+1)+': '+(a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1)+' ('+a.length+'/'+N+')':'nunca')).join(' · ')+' | tarefas por dia '+tarNiv.map((a,i)=>(i+1)+': '+(a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(0):'-')).join(' · ')+' | cursos '+Object.keys(daniCursoDias).map(k=>{ const d=daniCursoDias[k].sort((a,b)=>a-b); return k+' dia '+d[Math.floor(d.length/2)]+' ('+d.length+'/'+N+')'; }).join(' · '));
console.log('DANI | XP e nível pago no fim do dia '+[5,7,9,11,13,16].filter(n=>xpDani[n]).map(n=>n+': '+(xpDani[n].reduce((x,y)=>x+y[0],0)/xpDani[n].length).toFixed(1)+' XP, nível '+(xpDani[n].reduce((x,y)=>x+y[1],0)/xpDani[n].length).toFixed(1)).join(' · '));
console.log('TONHAO | dia médio em que chega ao nível '+nivDia.map((a,i)=>(i+1)+': '+(a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1)+' ('+a.length+'/'+N+')':'nunca')).join(' · '));
console.log('LUCRO acumulado nos '+ND+' dias (média por carreira): R$',Math.round(Object.keys(rows).reduce((a,n)=>a+rows[n].lucro.reduce((x,y)=>x+y,0),0)/N));
{ const ch=chega.filter(isFinite).sort((a,b)=>a-b); console.log('CAMPANHA',ND,'dias | chegou a R$',MUDA,'em',ch.length+'/'+N,'carreiras, no dia',ch.length?'mediano '+ch[Math.floor(ch.length/2)]:'-','| dias fechando no negativo',negs,'| empréstimos à força',forcs); }
{ const ks=Object.keys(cursoDias); if(ks.length) console.log('CURSOS (v8.6.9) | dia mediano da compra:',ks.map(k=>{ const d=cursoDias[k].sort((a,b)=>a-b); return k+' dia '+d[Math.floor(d.length/2)]+' ('+d.length+'/'+N+')'; }).join(' · ')); }
if(MODO!=='sem'){
  let tl=0,tr=0,tq=0,tc=0; const NM=L.MANUT.dia;
  for(let n=1;n<=7;n++){ const r=rows[n]; console.log('      Dia',n,'| quebras',(r.qb.reduce((a,b)=>a+b,0)/N).toFixed(2),'| chuva',r.chuva+'/'+N,'feriado',r.fer+'/'+N,'| estado médio (fogão/geladeira/cafeteira)',L.MANUT.equip.map((q,i)=>avg(r.est.map(v=>v[i]*100))+'%').join('/'),'| revisão R$',avg(r.rev),'conserto R$',avg(r.con),'| dinheiro no fim do dia',avg(r.fim));
    if(n>=3){ tl+=avg(r.lucro); tr+=r.rev.length?avg(r.rev):0; tc+=avg(r.con); } if(n>=NM) tq+=r.qb.reduce((a,b)=>a+b,0)/N; }
  console.log('RESUMO carreira',MODO,'| dias 3 a 7: revisão',(tr/tl*100).toFixed(1)+'% e conserto',(tc/tl*100).toFixed(1)+'% do lucro | quebras dos dias '+NM+' a 7:',tq.toFixed(2),'por carreira (1 a cada',(4/tq).toFixed(1),'dias) | metas batidas dias 3 a 7:',[3,4,5,6,7].reduce((a,n)=>a+rows[n].pass,0)+'/'+(5*N),'('+([3,4,5,6,7].reduce((a,n)=>a+rows[n].pass,0)/(5*N)*100).toFixed(0)+'%)');
}
