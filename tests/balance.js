// v8, manutenção e imprevistos (fogão, geladeira e cafeteira se gastam; do dia 4 podem quebrar; chuva e feriado a partir do dia 3):
//   MANUT=sem    (padrão) imprevistos desligados (MANUT.on=false): os números de sempre
//   MANUT=com    liga os imprevistos e o jogador nunca revisa: cada rodada joga os dias 1 a 7 em sequência (o desgaste passa de um dia
//                para o outro, como na carreira) e mostra os dias de DIAS. Cada dia continua isolado nas demais coisas (melhorias, equipe, salão)
//   MANUT=cuida  liga os imprevistos e revisa tudo (revisarTudo) em toda lojinha, antes de cada dia; mostra o gasto com revisão
//   CONSERTO=1   o bot chama o técnico na hora quando o fogão quebra (CONSERTO=todos: também a geladeira e a cafeteira)
//   Mostra também, por dia: quebras (média por dia, por equipamento), chuva/feriado (% dos dias), revisão e conserto (R$ por dia)
//   e "revisão/lucro" (o que cuidar de tudo custa em relação ao lucro do dia). L.MANUT e L.CLIMA podem ser trocados em runtime:
//   MANUT_CFG='{"dia":4,"equip":{"fogao":{"base":3,"uso":0.3}}}'  CLIMA_CFG='{"chuva":{"chance":0.1}}'  (veja ajustaManut abaixo)
const H=require('./harness.js')(); const {g,L}=H;
const MODO=process.env.MANUT||'sem';
if(!['sem','com','cuida'].includes(MODO)) throw new Error('MANUT=sem|com|cuida');
const bot=require('./bot.js')(g,L,{afiado:process.env.BOT==='afiado',conserto:process.env.CONSERTO==='todos'?'todos':!!process.env.CONSERTO});   // BOT=afiado: o jogador perfeito
L.MANUT.on=MODO!=='sem';
if(process.env.MANUT_CFG){ const c=JSON.parse(process.env.MANUT_CFG); const eq=c.equip; delete c.equip; Object.assign(L.MANUT,c); if(eq) for(const id in eq) Object.assign(L.manutOf(id),eq[id]); }
if(process.env.PONTO_CFG){ const c=JSON.parse(process.env.PONTO_CFG); for(const k in c){ if(c[k]&&typeof c[k]==='object'&&!Array.isArray(c[k])) Object.assign(L.PONTOS[1][k],c[k]); else L.PONTOS[1][k]=c[k]; } }   // v9: PONTO_CFG='{"cardapio":1.3,"aluguel":100}' troca números da área industrial em runtime
if(process.env.CLIMA_CFG){ const c=JSON.parse(process.env.CLIMA_CFG); for(const k in c) Object.assign(L.CLIMA[k],c[k]); }
const N=+process.argv[2]||20;
// v9: PONTO=industrial joga os dias no ponto da área industrial (salão de 20 lugares, fogão industrial, TVs com anúncios, cadeirinhas; DIAS padrão 8,9,10)
const PONTO=process.env.PONTO||'garagem', IND=PONTO==='industrial';
// EQUIPE='{"tonhao":1,"dani":1,"daniTasks":["pratos","lavar"]}' node balance.js 40
// EQUIPE=auto: a equipe que um jogador consegue pagar em cada dia (contratando aos poucos)
const FULL=IND?{tonhao:2,dani:4,daniTasks:['pratos','lavar','lixo'],tvs:1}:{tonhao:2,dani:4,daniTasks:['pratos','lavar','lixo'],tv:true,som:true};   // na Garagem, TV e som no lugar do couvert (v7.4.3)
const AUTO={2:{},3:FULL,4:FULL,5:FULL,6:FULL,7:FULL};   // do dia 3 em diante o dinheiro acumulado já paga a equipe completa
const EQ0=process.env.EQUIPE==='auto'?null:(process.env.EQUIPE?JSON.parse(process.env.EQUIPE):{});
const eqFor=n=>EQ0||AUTO[n]||(n>7?FULL:{});   // v8.3: do dia 8 em diante, a equipe completa
// ajuste rápido sem mexer em src/: INGRED='{"prato":0.7}' CONTAS='{"mesa":40}' node balance.js
if(process.env.MOVIMENTO) Object.assign(L.MOVIMENTO,JSON.parse(process.env.MOVIMENTO));   // MOVIMENTO='{"porLugar":0.04}'
if(process.env.CONTAS) Object.assign(L.CONTAS,JSON.parse(process.env.CONTAS));
if(process.env.INGRED) Object.assign(L.INGRED,JSON.parse(process.env.INGRED));
if(process.env.CARDAPIO){ const c=JSON.parse(process.env.CARDAPIO); for(const k in c) L.CARDAPIO[k].preco=c[k]; }   // v8.3.8: CARDAPIO='{"pf":25}' testa os preços dos pratos
if(process.env.MAIS) Object.assign(L.MAIS,JSON.parse(process.env.MAIS));   // v8.3.8: MAIS='{"cada":0.6}' testa o 2º pedido
if(process.env.GRUPOS){ const gr=JSON.parse(process.env.GRUPOS); for(const k in gr) L.DAYS[k-1].groups=gr[k]; }   // GRUPOS='{"1":5}': testa o movimento do dia
if(process.env.METAS){ const mt=JSON.parse(process.env.METAS); for(const k in mt) L.DAYS[k-1].meta=mt[k]; }   // METAS='{"3":420}': testa metas sem mexer em src/
// salão (v7.4): por padrão, o de quem compra móveis como o bot da carreira.js (kit de 10 lugares, +1 mesa de 2 por
// lojinha até 16); MOVEIS=kit fica no kit; MOVEIS='[2,2,4,4]' usa essas mesas todo dia (arrumação automática)
const MOV={1:[2,2,2,4],2:[2,2,2,4,2],3:[2,2,2,4,2,2],4:[2,2,2,2,2,2,4]};   // ([2,2,2,4,2,2,2] não cabia na arrumação automática e voltava ao kit)
const movFor=n=>IND&&!process.env.MOVEIS?[4,4,4,4,2,2]:process.env.MOVEIS==='kit'?MOV[1]:(process.env.MOVEIS?JSON.parse(process.env.MOVEIS):MOV[Math.min(n,4)]);
const order=process.env.ORDEM?process.env.ORDEM.split(','):['tenis','maquina','cafeteira','bandeja','ventilador','pratos'];   // ORDEM=pratos,tenis,...: ordem de compra das melhorias
const DIAS=process.env.DIAS?process.env.DIAS.split(',').map(Number):IND?[8,9,10]:[1,2,3,4,5,6,7];   // DIAS=1,2: só esses dias (v8.3: DIAS=8,9,14 testa os dias da campanha)
const NMAX=Math.max(...DIAS);
// v8.6.9, cursos do Tonhão: CURSOS=bot (padrão) o dia d começa com as d−1 primeiras compras da ordem do bot (1 curso por lojinha);
// CURSOS=todos (os 4 básicos e todos os avançados); CURSOS=0 (nenhum: só PF e coxinha); CURSOS=chapa,pastel,... troca a ordem do bot
const CUR=process.env.CURSOS||'bot', BOTM=require('./bot.js'), ORD_CUR=!['bot','todos','0'].includes(CUR)?CUR.split(','):null;
const cursosFor=n=>CUR==='0'?{}:CUR==='todos'?BOTM.cursosApos(L,99):BOTM.cursosApos(L,n-1,ORD_CUR||undefined);
const R={}; DIAS.forEach(n=>R[n]=[]);
// um dia de uma rodada; man: o estado de equipamentos que vem do dia anterior (null: tudo novo)
function jogaDia(n,man){
  g.up={}; g.save.up=g.up; order.slice(0,IND?order.length:n-1).forEach(id=>g.up[id]=true);
  if(IND){ g.up.fogaoInd=true; g.up.tvs=true; g.up.assento='cadeira'; }
  g.save.cursos=cursosFor(n);
  if(L.normSave){ g.save.equipe=L.normSave({equipe:eqFor(n),salao:{ponto:PONTO},up:IND?{tvs:true}:{}}).equipe; g.save.bank=1e6; }
  const dec=process.env.DECOR==='tudo';   // v8.6.6: DECOR=tudo põe todos os enfeites à mostra e toalha em todas as mesas (o bot não compra decoração)
  g.save.decor=L.normDecor?L.normDecor(dec?Object.fromEntries(L.DECOR.map(d=>[d.id,1])):{}):{};
  g.save.salao=L.normSalao({ponto:PONTO,mesas:movFor(n).map((seats,c)=>({x:0,y:0,seats,c:c%4,t:dec?1:0}))});
  if(L.salaoLugares(g.save.salao.mesas)!==movFor(n).reduce((x,y)=>x+y,0)) throw new Error('salão '+JSON.stringify(movFor(n))+' não cabe na arrumação automática (voltou ao kit)');
  if(process.env.DIV) g.save.divulga=process.env.DIV;   // DIV=boca|panfleto|redes
  if(process.env.MULT){ const d=L.divulgaOf(g.save.divulga); d.groups=[+process.env.MULT,+process.env.MULT]; }   // MULT=0.7: fração fixa dos grupos do dia
  g.save.aval=[];   // v8.4: cada dia sem avaliações de antes (a nota não mexe no movimento; AVAL_MOV=1 liga, com a nota do dia anterior)
  if(process.env.AVAL_MOV&&jogaDia.av) g.save.aval=jogaDia.av.slice();
  g.save.manut=L.normManut(man); g.save.caixaPend={mel:0,sal:0,man:0}; delete g.save.manut.sorteio;
  let rev=0;
  if(MODO==='cuida'&&n>=2){ const b0=g.save.bank; g.goShop(n); g.revisarTudo(); rev=b0-g.save.bank; }   // revisa na lojinha, antes do dia
  const b1=g.save.bank;
  g.startDay(n); g.begin();
  let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
  const r=g.result; r.rev=rev; r.bankFim=g.save.bank;
  jogaDia.av=g.save.aval.slice();
  if(process.env.DUMP) console.log('DUMP',n,r.money,r.lost,r.fat,r.aval&&r.aval.dia?r.aval.dia.nota.toFixed(2):'-',r.aval&&r.aval.geral?r.aval.geral.nota.toFixed(2):'-');   // v8.3.9: DUMP=1 lista lucro, perdidos e faturamento de cada dia jogado (v8.6.4: e a nota do Gurugol no dia e a geral)
  return r;
}
for(let k=0;k<N;k++){
  if(MODO==='sem'){ for(const n of DIAS) R[n].push(jogaDia(n,null)); }
  else { let man=null; for(let n=1;n<=NMAX;n++){ const r=jogaDia(n,man); man=Object.assign({},g.save.manut); if(R[n]) R[n].push(r); } }   // desgaste de um dia para o outro
}
const tot={rev:0,lucro:0,quebras:0,dias:0};
for(const n of DIAS){
  const res=R[n];
  const m=res.map(r=>r.money), mean=m.reduce((a,b)=>a+b,0)/N, d=g.diaPonto(L.diaOf(n));   // v9: com as metas do ponto
  const avg=k=>(res.reduce((a,r)=>a+(r[k]||0),0)/N).toFixed(0);
  const pass=res.filter(r=>r.passed).length, exp=res.filter(r=>r.money>=d.expert).length;
  const so=m.slice().sort((a,b)=>a-b), q=f=>so[Math.min(so.length-1,Math.floor(f*so.length))];
  console.log('Dia',n+(d.semana?' ('+d.semana+')':''),'meta',d.meta,'exp',d.expert,'| media',mean.toFixed(0),'p10',q(0.1),'p90',q(0.9),'min',Math.min(...m),'max',Math.max(...m),'| passou',pass+'/'+N,'expert',exp+'/'+N,'3★',res.filter(r=>r.stars===3).length+'/'+N,'| perdidos',(res.reduce((a,r)=>a+r.lost,0)/N).toFixed(1),'lotado',(res.reduce((a,r)=>a+r.full,0)/N).toFixed(1),'| causas',['semMesa','comMesa','pedido','prato','conta','retirada'].map(k=>k+' '+(res.reduce((a,r)=>a+r.lostBy[k],0)/N).toFixed(1)).join(' '),'vip',(res.reduce((a,r)=>a+r.vipLost,0)/N).toFixed(1),'lotadoT',avg('lotadoT'),'atraso',avg('atraso'),'zero',res.filter(r=>r.lost===0&&!r.full).length+'/'+N,'| fat',avg('fat'),'ingr',avg('custo'),'contas',avg('contas'),'folha',avg('paid'),'div',avg('div'),'suco da espera',avg('sucoEsp'),'| marmitas',(res.reduce((a,r)=>a+(r.marmitas||0),0)/N).toFixed(1),'efood',avg('efood'),'esfriou',(res.reduce((a,r)=>a+(r.esfriou||0),0)/N).toFixed(1),'sobra',(res.reduce((a,r)=>a+(r.sobra||0),0)/N).toFixed(1));
  { const av=res.filter(r=>r.aval&&r.aval.dia), cr=k=>(av.reduce((a,r)=>a+r.aval.dia.crit[k],0)/av.length).toFixed(2), nt=av.map(r=>r.aval.dia.nota).sort((a,b)=>a-b);   // v8.4: a nota do Gurugol no dia
    if(av.length) console.log('      Gurugol | nota do dia',(nt.reduce((a,b)=>a+b,0)/nt.length).toFixed(2),'p10',nt[Math.floor(nt.length*0.1)].toFixed(2),'p90',nt[Math.floor(nt.length*0.9)].toFixed(2),'|',L.AVAL_CRIT.map((c,k)=>c.id+' '+cr(k)).join(' '),'| avaliações',(av.reduce((a,r)=>a+r.aval.dia.n,0)/av.length).toFixed(1)); }
  if(MODO!=='sem'){
    const qb=id=>(res.reduce((a,r)=>a+r.quebras.filter(x=>x.id===id).length,0)/N).toFixed(2);
    const qt=res.reduce((a,r)=>a+r.quebras.length,0)/N, rev=res.reduce((a,r)=>a+r.rev,0)/N, con=res.reduce((a,r)=>a+r.conserto,0)/N;
    console.log('      imprevistos | quebras/dia',qt.toFixed(2),'(fogão',qb('fogao'),'geladeira',qb('geladeira'),'cafeteira',qb('cafeteira')+')','dias com quebra',res.filter(r=>r.quebras.length).length+'/'+N,'| chuva',res.filter(r=>r.clima==='chuva').length+'/'+N,'feriado',res.filter(r=>r.clima==='feriado').length+'/'+N,'| revisão R$',rev.toFixed(0),'('+(mean>0?(rev/mean*100).toFixed(0):'-')+'% do lucro)','conserto R$',con.toFixed(0),'| estado médio no fim: fogão',(100*res.reduce((a,r)=>a+r.manut.fogao,0)/N).toFixed(0)+'% geladeira',(100*res.reduce((a,r)=>a+r.manut.geladeira,0)/N).toFixed(0)+'% cafeteira',(100*res.reduce((a,r)=>a+r.manut.cafeteira,0)/N).toFixed(0)+'%');
    if(n>=3){ tot.rev+=rev; tot.lucro+=mean; tot.quebras+=n>=L.MANUT.dia?qt:0; tot.dias+=n>=L.MANUT.dia?1:0; }
  }
}
if(MODO!=='sem'&&tot.dias) console.log('RESUMO',MODO,'| dias 3 a '+NMAX+': revisão =',(tot.rev/tot.lucro*100).toFixed(1)+'% do lucro médio | quebras/dia (dias '+L.MANUT.dia+' a '+NMAX+') =',(tot.quebras/tot.dias).toFixed(2),'(1 a cada',(tot.dias/tot.quebras).toFixed(1),'dias)');
