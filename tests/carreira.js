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
const H=require('./harness.js')(); const {g,L}=H; const BOT=require('./bot.js'), bot=BOT(g,L,{afiado:process.env.BOT==='afiado',conserto:process.env.CONSERTO==='todos'?'todos':!!process.env.CONSERTO});   // BOT=afiado: o jogador perfeito (v8.6.9: para conferir a nota do Gurugol)
const MODO=process.env.MANUT||'sem'; if(!['sem','com','cuida','amarelo','vermelho'].includes(MODO)) throw new Error('MANUT=sem|com|cuida|amarelo|vermelho');
L.MANUT.on=MODO!=='sem';
if(process.env.MANUT_CFG){ const c=JSON.parse(process.env.MANUT_CFG); const eq=c.equip; delete c.equip; Object.assign(L.MANUT,c); if(eq) for(const id in eq) Object.assign(L.manutOf(id),eq[id]); }
if(process.env.CLIMA_CFG){ const c=JSON.parse(process.env.CLIMA_CFG); for(const k in c) Object.assign(L.CLIMA[k],c[k]); }
const order=['tenis','maquina','cafeteira','bandeja','ventilador','pratos','corrida'];
const FULL=[{tonhao:2,dani:3,tv:true,som:true},{tonhao:2,dani:3,tv:true},{tonhao:2,dani:3},{tonhao:1,dani:2},{tonhao:0,dani:1},{}];
// ajuste rápido sem mexer em src/: CONTAS='{"mesa":40}' INGRED='{"prato":0.6}' node carreira.js
if(process.env.MOVIMENTO) Object.assign(L.MOVIMENTO,JSON.parse(process.env.MOVIMENTO));   // MOVIMENTO='{"porLugar":0.04}'
if(process.env.CONTAS) Object.assign(L.CONTAS,JSON.parse(process.env.CONTAS));
if(process.env.INGRED) Object.assign(L.INGRED,JSON.parse(process.env.INGRED));
if(process.env.CARDAPIO){ const c=JSON.parse(process.env.CARDAPIO); for(const k in c) L.CARDAPIO[k].preco=c[k]; }   // v8.3.8: CARDAPIO='{"pf":25}' testa os preços dos pratos
if(process.env.MAIS) Object.assign(L.MAIS,JSON.parse(process.env.MAIS));   // v8.3.8: MAIS='{"cada":0.6}' testa o 2º pedido
const ND=+process.env.DIAS||14, MUDA=800; /* v8.6.9: cursoDias guarda o dia em que cada curso foi comprado (id+nível) */ const cursoDias={}; const rows={}, chega=[]; let negs=0, forcs=0;
for(let k=0;k<N;k++){
  g.save=L.normSave({}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); let semMesa=0, chegou=0;
  for(let n=1;n<=ND;n++){
    const r=rows[n]||(rows[n]={shop:[],after:[],lucro:[],pass:0,eq:[],lug:[],rev:[],con:[],qb:[],est:[],chuva:0,fer:0,fim:[],nota:[]});
    if(n>=2){
      g.goShop(n);
      if(MODO==='cuida'){ const b0=g.save.bank; g.revisarTudo(); r.rev.push(b0-g.save.bank); }
      if(MODO==='amarelo'||MODO==='vermelho'){ const lim=MODO==='amarelo'?L.MANUT.verde:L.MANUT.vermelho, b0=g.save.bank; L.MANUT.equip.forEach(q=>{ if(g.save.manut[q.id]<lim) g.revisar(q.id); }); r.rev.push(b0-g.save.bank); }   // v8.3.12: amarelo = revisa quem saiu do verde; vermelho = só quem já está no vermelho
      const u=order.find(id=>!g.up[id]); const uc=L.UPGRADES.find(x=>x.id===u);
      if(u && g.save.bank>=uc.cost+(n>=3?300:0)) g.buy(u);
      if(process.env.MOVEIS!=='0') BOT.moveis(g,L,semMesa,n>=3?300:0,process.env.MOVEIS);
      if(process.env.CURSOS!=='0'){ const cu=BOT.cursos(g,L,n>=3?300:0,process.env.CURSOS?process.env.CURSOS.split(','):undefined); if(cu) (cursoDias[cu]=cursoDias[cu]||[]).push(n); }   // v8.6.9: 1 curso por lojinha, se sobrar o preço mais a reserva (CURSOS=0 não compra)
      if(n>=3){
        const e=FULL.find(e=>L.payroll(L.normSave({equipe:e}).equipe)+(L.divulgaOf(DIV).cost)<=g.save.bank)||{};
        g.save.equipe=L.normSave({equipe:Object.assign({daniTasks:['pratos','lavar','lixo']},e)}).equipe;
        g.save.divulga=DIV;
      }
      r.shop.push(g.save.bank);
    }
    if(g.proxDia!==n) throw new Error('a campanha pulou: '+g.proxDia+' em vez de '+n);
    if(MODO!=='sem') r.est.push(L.MANUT.equip.map(q=>g.save.manut[q.id]));   // estado antes do dia (v8.3.11)
    g.startDay(n); g.begin(); r.after.push(g.save.bank-g.paid-g.paidDiv); r.eq.push(g.paid);   // v8.2.2: a folha só sai no fim do dia; "depois da folha" é o que sobra além dela
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    { const ge=L.avalGeral(g.save.aval); r.nota.push(ge?ge.nota:null); }   // v8.6.9: a nota geral do Gurugol no fim do dia
    r.lucro.push(g.result.money); r.con.push(g.result.conserto); r.qb.push(g.result.quebras.length); if(g.result.clima==='chuva') r.chuva++; if(g.result.clima==='feriado') r.fer++; r.fim.push(g.save.bank); if(g.result.passed) r.pass++; semMesa=g.result.lostBy.semMesa; r.lug.push(L.salaoLugares(g.save.salao.mesas)); if(g.save.bank<0) negs++; if(g.result.forcado) forcs++; if(!chegou&&g.save.bank>=MUDA) chegou=n; if(process.env.MESAS) console.log(n, g.save.salao.mesas.map(m=>m.seats).sort().join(''), 'semMesa', semMesa);
  }
  chega.push(chegou||Infinity);
}
const avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):'-';
for(let n=1;n<=ND;n++){ const r=rows[n], d=L.diaOf(n); console.log('Dia',n+(d.semana?' ('+d.semana.slice(0,3)+')':''),'meta',d.meta,'| dinheiro na lojinha',avg(r.shop),'| depois da folha',avg(r.after),'| folha',avg(r.eq),'| lucro',avg(r.lucro),'| lugares',avg(r.lug),'| passou',r.pass+'/'+N,'| Gurugol geral',(()=>{ const v=r.nota.filter(x=>x!=null); return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):'-'; })()); }
{ const ch=chega.filter(isFinite).sort((a,b)=>a-b); console.log('CAMPANHA',ND,'dias | chegou a R$',MUDA,'em',ch.length+'/'+N,'carreiras, no dia',ch.length?'mediano '+ch[Math.floor(ch.length/2)]:'-','| dias fechando no negativo',negs,'| empréstimos à força',forcs); }
{ const ks=Object.keys(cursoDias); if(ks.length) console.log('CURSOS (v8.6.9) | dia mediano da compra:',ks.map(k=>{ const d=cursoDias[k].sort((a,b)=>a-b); return k+' dia '+d[Math.floor(d.length/2)]+' ('+d.length+'/'+N+')'; }).join(' · ')); }
if(MODO!=='sem'){
  let tl=0,tr=0,tq=0,tc=0; const NM=L.MANUT.dia;
  for(let n=1;n<=7;n++){ const r=rows[n]; console.log('      Dia',n,'| quebras',(r.qb.reduce((a,b)=>a+b,0)/N).toFixed(2),'| chuva',r.chuva+'/'+N,'feriado',r.fer+'/'+N,'| estado médio (fogão/geladeira/cafeteira)',L.MANUT.equip.map((q,i)=>avg(r.est.map(v=>v[i]*100))+'%').join('/'),'| revisão R$',avg(r.rev),'conserto R$',avg(r.con),'| dinheiro no fim do dia',avg(r.fim));
    if(n>=3){ tl+=avg(r.lucro); tr+=r.rev.length?avg(r.rev):0; tc+=avg(r.con); } if(n>=NM) tq+=r.qb.reduce((a,b)=>a+b,0)/N; }
  console.log('RESUMO carreira',MODO,'| dias 3 a 7: revisão',(tr/tl*100).toFixed(1)+'% e conserto',(tc/tl*100).toFixed(1)+'% do lucro | quebras dos dias '+NM+' a 7:',tq.toFixed(2),'por carreira (1 a cada',(4/tq).toFixed(1),'dias) | metas batidas dias 3 a 7:',[3,4,5,6,7].reduce((a,n)=>a+rows[n].pass,0)+'/'+(5*N),'('+([3,4,5,6,7].reduce((a,n)=>a+rows[n].pass,0)/(5*N)*100).toFixed(0)+'%)');
}
