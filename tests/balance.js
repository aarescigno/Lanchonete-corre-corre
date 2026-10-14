const H=require('./harness.js')(); const {g,L}=H; const bot=require('./bot.js')(g,L);
const N=+process.argv[2]||20;
// EQUIPE='{"tonhao":1,"dani":1,"daniTasks":["pratos","lavar"]}' node balance.js 40
const EQ=process.env.EQUIPE?JSON.parse(process.env.EQUIPE):{};
const order=['tenis','agua','cafeteira','bandeja','ventilador','chapa'];
for(let n=1;n<=7;n++){
  const res=[];
  for(let k=0;k<N;k++){
    g.up={}; g.save.up=g.up; order.slice(0,n-1).forEach(id=>g.up[id]=true);
    if(L.normSave){ g.save.equipe=L.normSave({equipe:EQ}).equipe; g.save.bank=1e6; }
    g.startDay(n); g.begin();
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    res.push(g.result);
  }
  const m=res.map(r=>r.money), mean=m.reduce((a,b)=>a+b,0)/N, d=L.DAYS[n-1];
  const pass=res.filter(r=>r.passed).length, exp=res.filter(r=>r.money>=d.expert).length;
  console.log('Dia',n,'meta',d.meta,'exp',d.expert,'| media',mean.toFixed(0),'min',Math.min(...m),'max',Math.max(...m),'| passou',pass+'/'+N,'expert',exp+'/'+N,'| perdidos',(res.reduce((a,r)=>a+r.lost,0)/N).toFixed(1),'lotado',(res.reduce((a,r)=>a+r.full,0)/N).toFixed(1));
}
