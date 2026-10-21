const H=require('./harness.js')(); const {g,L}=H; const bot=require('./bot.js')(g,L,{afiado:process.env.BOT==='afiado'});   // BOT=afiado: o jogador perfeito
const N=+process.argv[2]||20;
// EQUIPE='{"tonhao":1,"dani":1,"daniTasks":["pratos","lavar"]}' node balance.js 40
// EQUIPE=auto: a equipe que um jogador consegue pagar em cada dia (contratando aos poucos)
const FULL={tonhao:2,dani:3,daniTasks:['pratos','lavar','lixo'],couvert:true};
const AUTO={2:{},3:FULL,4:FULL,5:FULL,6:FULL,7:FULL};   // do dia 3 em diante o dinheiro acumulado já paga a equipe completa
const EQ0=process.env.EQUIPE==='auto'?null:(process.env.EQUIPE?JSON.parse(process.env.EQUIPE):{});
const eqFor=n=>EQ0||AUTO[n]||{};
// ajuste rápido sem mexer em src/: INGRED='{"prato":0.7}' CONTAS='{"mesa":40}' node balance.js
if(process.env.MOVIMENTO) Object.assign(L.MOVIMENTO,JSON.parse(process.env.MOVIMENTO));   // MOVIMENTO='{"porLugar":0.04}'
if(process.env.CONTAS) Object.assign(L.CONTAS,JSON.parse(process.env.CONTAS));
if(process.env.INGRED) Object.assign(L.INGRED,JSON.parse(process.env.INGRED));
if(process.env.GRUPOS){ const gr=JSON.parse(process.env.GRUPOS); for(const k in gr) L.DAYS[k-1].groups=gr[k]; }   // GRUPOS='{"1":5}': testa o movimento do dia
if(process.env.METAS){ const mt=JSON.parse(process.env.METAS); for(const k in mt) L.DAYS[k-1].meta=mt[k]; }   // METAS='{"3":420}': testa metas sem mexer em src/
// salão (v7.4): por padrão, o de quem compra móveis como o bot da carreira.js (kit de 10 lugares, +1 mesa de 2 por
// lojinha até 16); MOVEIS=kit fica no kit; MOVEIS='[2,2,4,4]' usa essas mesas todo dia (arrumação automática)
const MOV={1:[2,2,2,4],2:[2,2,2,4,2],3:[2,2,2,4,2,2],4:[2,2,2,2,2,2,4]};   // ([2,2,2,4,2,2,2] não cabia na arrumação automática e voltava ao kit)
const movFor=n=>process.env.MOVEIS==='kit'?MOV[1]:(process.env.MOVEIS?JSON.parse(process.env.MOVEIS):MOV[Math.min(n,4)]);
const order=process.env.ORDEM?process.env.ORDEM.split(','):['tenis','agua','cafeteira','bandeja','ventilador','pratos'];   // ORDEM=pratos,tenis,...: ordem de compra das melhorias
const DIAS=process.env.DIAS?process.env.DIAS.split(',').map(Number):[1,2,3,4,5,6,7];   // DIAS=1,2: só esses dias
for(const n of DIAS){
  const res=[];
  for(let k=0;k<N;k++){
    g.up={}; g.save.up=g.up; order.slice(0,n-1).forEach(id=>g.up[id]=true);
    if(L.normSave){ g.save.equipe=L.normSave({equipe:eqFor(n)}).equipe; g.save.bank=1e6; }
    g.save.salao=L.normSalao({mesas:movFor(n).map((seats,c)=>({x:0,y:0,seats,c:c%4}))});
    if(L.salaoLugares(g.save.salao.mesas)!==movFor(n).reduce((x,y)=>x+y,0)) throw new Error('salão '+JSON.stringify(movFor(n))+' não cabe na arrumação automática (voltou ao kit)');
    if(process.env.DIV) g.save.divulga=process.env.DIV;   // DIV=boca|panfleto|redes
    if(process.env.MULT){ const d=L.divulgaOf(g.save.divulga); d.groups=[+process.env.MULT,+process.env.MULT]; }   // MULT=0.7: fração fixa dos grupos do dia
    g.startDay(n); g.begin();
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    res.push(g.result);
  }
  const m=res.map(r=>r.money), mean=m.reduce((a,b)=>a+b,0)/N, d=L.DAYS[n-1];
  const avg=k=>(res.reduce((a,r)=>a+(r[k]||0),0)/N).toFixed(0);
  const pass=res.filter(r=>r.passed).length, exp=res.filter(r=>r.money>=d.expert).length;
  const so=m.slice().sort((a,b)=>a-b), q=f=>so[Math.min(so.length-1,Math.floor(f*so.length))];
  console.log('Dia',n,'meta',d.meta,'exp',d.expert,'| media',mean.toFixed(0),'p10',q(0.1),'p90',q(0.9),'min',Math.min(...m),'max',Math.max(...m),'| passou',pass+'/'+N,'expert',exp+'/'+N,'3★',res.filter(r=>r.stars===3).length+'/'+N,'| perdidos',(res.reduce((a,r)=>a+r.lost,0)/N).toFixed(1),'lotado',(res.reduce((a,r)=>a+r.full,0)/N).toFixed(1),'| causas',['semMesa','comMesa','pedido','prato','conta'].map(k=>k+' '+(res.reduce((a,r)=>a+r.lostBy[k],0)/N).toFixed(1)).join(' '),'vip',(res.reduce((a,r)=>a+r.vipLost,0)/N).toFixed(1),'lotadoT',avg('lotadoT'),'atraso',avg('atraso'),'zero',res.filter(r=>r.lost===0&&!r.full).length+'/'+N,'| fat',avg('fat'),'ingr',avg('custo'),'contas',avg('contas'),'folha',avg('paid'),'div',avg('div'));
}
