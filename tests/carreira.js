// Carreira inteira com o dinheiro acumulado de verdade: o bot compra 1 melhoria por dia (na ordem), 1 móvel por
// lojinha (v7.4, regra em bot.moveis) e, do dia 3 em diante, contrata a equipe completa que o dinheiro pagar.
// Mostra o dinheiro em cada lojinha e os lugares do salão. MOVEIS=0: não compra móveis (fica no kit).
// Uso: node carreira.js [N] [divulga]   (divulga: boca, panfleto ou redes; padrão panfleto)
const N=+process.argv[2]||10, DIV=process.argv[3]||'panfleto';
const H=require('./harness.js')(); const {g,L}=H; const BOT=require('./bot.js'), bot=BOT(g,L);
const order=['tenis','agua','cafeteira','bandeja','ventilador','pratos','corrida'];
const FULL=[{tonhao:2,dani:3,tv:true,som:true},{tonhao:2,dani:3,tv:true},{tonhao:2,dani:3},{tonhao:1,dani:2},{tonhao:0,dani:1},{}];
// ajuste rápido sem mexer em src/: CONTAS='{"mesa":40}' INGRED='{"prato":0.6}' node carreira.js
if(process.env.MOVIMENTO) Object.assign(L.MOVIMENTO,JSON.parse(process.env.MOVIMENTO));   // MOVIMENTO='{"porLugar":0.04}'
if(process.env.CONTAS) Object.assign(L.CONTAS,JSON.parse(process.env.CONTAS));
if(process.env.INGRED) Object.assign(L.INGRED,JSON.parse(process.env.INGRED));
const rows={};
for(let k=0;k<N;k++){
  g.save=L.normSave({}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); let semMesa=0;
  for(let n=1;n<=7;n++){
    const r=rows[n]||(rows[n]={shop:[],after:[],lucro:[],pass:0,eq:[],lug:[]});
    if(n>=2){
      g.goShop(n);
      const u=order.find(id=>!g.up[id]); const uc=L.UPGRADES.find(x=>x.id===u);
      if(u && g.save.bank>=uc.cost+(n>=3?300:0)) g.buy(u);
      if(process.env.MOVEIS!=='0') BOT.moveis(g,L,semMesa,n>=3?300:0,process.env.MOVEIS);
      if(n>=3){
        const e=FULL.find(e=>L.payroll(L.normSave({equipe:e}).equipe)+(L.divulgaOf(DIV).cost)<=g.save.bank)||{};
        g.save.equipe=L.normSave({equipe:Object.assign({daniTasks:['pratos','lavar','lixo']},e)}).equipe;
        g.save.divulga=DIV;
      }
      r.shop.push(g.save.bank);
    }
    g.startDay(n); g.begin(); r.after.push(g.save.bank); r.eq.push(g.paid);
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    r.lucro.push(g.result.money); if(g.result.passed) r.pass++; semMesa=g.result.lostBy.semMesa; r.lug.push(L.salaoLugares(g.save.salao.mesas)); if(process.env.MESAS) console.log(n, g.save.salao.mesas.map(m=>m.seats).sort().join(''), 'semMesa', semMesa);
  }
}
const avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):'-';
for(let n=1;n<=7;n++){ const r=rows[n]; console.log('Dia',n,'| dinheiro na lojinha',avg(r.shop),'| depois da folha',avg(r.after),'| folha',avg(r.eq),'| lucro',avg(r.lucro),'| lugares',avg(r.lug),'| passou',r.pass+'/'+N); }
