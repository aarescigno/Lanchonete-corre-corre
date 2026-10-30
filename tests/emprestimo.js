// v8.3.2: o empréstimo compensa? Joga a campanha com o bot e compara o patrimônio (caixa − dívida) por estratégia:
//   nenhum    não pega empréstimo (compra como o carreira.js: 1 móvel por lojinha, equipe do dia 3)
//   cedo      pega VALOR (padrão R$ 1.000) no dia DIA0 (padrão 2) e gasta logo: móveis até o teto, equipe desde o dia 2
//   amortiza  como cedo, e amortiza (ou quita) em toda lojinha o que passar de R$ 400 no caixa
//   sempre    pega VALOR toda vez que pode, do dia DIA0 em diante
// Uso: node emprestimo.js [N] [DIAS] [estratégia]. MOVEIS=quatro (mesas de 4), IMPREV=1 (quebras, chuva e feriado),
// BANCO_CFG='{"juros":0.04}' testa valores. Alvo da v8.3.2: neutro no melhor caso e um pouco pior na maioria
const T='./';
const H=require(T+'harness.js')({imprevistos:!!process.env.IMPREV}); const {g,L}=H; const BOT=require(T+'bot.js'), bot=BOT(g,L,{});
const N=+process.argv[2]||10, ND=+process.argv[3]||14, EST=process.argv[4]||'nenhum', V=+process.env.VALOR||1000, DIA0=+process.env.DIA0||2;
const order=['tenis','maquina','cafeteira','bandeja','ventilador','pratos','corrida'];
const FULL=[{tonhao:2,dani:4,tv:true,som:true},{tonhao:2,dani:4,tv:true},{tonhao:2,dani:4},{tonhao:1,dani:3},{tonhao:0,dani:2},{}];
if(process.env.BANCO_CFG) Object.assign(L.BANCO,JSON.parse(process.env.BANCO_CFG));
const res=[]; let fechou=0, juros=0, emps=0;
for(let k=0;k<N;k++){
  g.save=L.normSave({treino:true}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); let semMesa=0, pagos=0, pegos=0;
  const pat=[];
  for(let n=1;n<=ND;n++){
    if(g.save.fechou) break;
    if(n>=2){
      g.goShop(n);
      const temp=((EST==='cedo'||EST==='amortiza')&&n===DIA0)||(EST==='sempre'&&n>=DIA0);
      if(EST==='amortiza' && g.save.emp.resto && n>DIA0){ const livre=g.save.bank-400; if(livre>=g.save.emp.resto) g.quitar(); else if(livre>=g.save.emp.amort) g.amortizar(Math.min(livre,g.save.emp.resto)); }
      if(temp && g.podeEmprestar(V)){ g.emprestar(V); pegos+=V; emps++; }
      const u=order.find(id=>!g.up[id]); const uc=L.UPGRADES.find(x=>x.id===u);
      const res0 = EST==='nenhum' ? (n>=3?300:0) : (n>=3?150:0);
      if(u && g.save.bank>=uc.cost+res0) g.buy(u);
      if(EST==='nenhum') BOT.moveis(g,L,semMesa,res0,process.env.MOVEIS);
      else { let i=0; while(i++<6 && BOT.moveis(g,L,semMesa,res0,process.env.MOVEIS)); }
      if(n>=2+(EST==='nenhum'?1:0)){
        const e=FULL.find(e=>L.payroll(L.normSave({equipe:e}).equipe)+40<=g.save.bank)||{};
        g.save.equipe=L.normSave({equipe:Object.assign({daniTasks:['pratos','lavar','lixo']},e)}).equipe;
        if(n>=3) g.save.divulga='panfleto';
      }
    }
    g.startDay(n); g.begin();
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    semMesa=g.result.lostBy.semMesa; pagos+=g.result.par||0;
    pat.push(g.save.bank-g.save.emp.resto);
  }
  if(g.save.fechou) fechou++;
  juros+=g.save.caixa.reduce((a,r)=>a+(r.jur||0),0)+(g.save.caixaPend.jur||0);
  res.push(pat);
}
const avg=a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length);
const dias=[3,5,7,10,14,21,28].filter(d=>d<=ND);
console.log(EST.padEnd(7),'patrimônio (caixa - dívida) no fim do dia', dias.map(d=>d+': '+avg(res.map(p=>p[d-1]??p[p.length-1]))).join(' | '),'| juros/carreira',Math.round(juros/N),'| empréstimos',emps,'| fechou',fechou+'/'+N);
