// v6, Salão: cadeiras e mesas compradas na lojinha, 2 ou 4 lugares por mesa, mesas que se espremem na fileira.
const H=require('./harness.js')(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const S=L.SALAO, sal=()=>g.save.salao;

// padrão: o salão de sempre
ok(sal().chairs===16 && sal().mesas===0 && L.salaoUsed(sal())===16,'padrão: 16 cadeiras, 6 mesas');
ok(g.tables.map(t=>t.cx+'/'+t.seats).join(' ')==='260/2 430/2 600/2 260/2 430/4 600/4','padrão: mesas no lugar de sempre');

// cadeiras
g.save.bank=0; g.goShop(2);
ok(!g.setSeats(1,4) && /Faltam cadeiras/.test(g.salaoMsg),'sem cadeira livre, a mesa não cresce');
ok(!g.buyChairs() && sal().chairs===16,'sem dinheiro, não compra cadeiras');
g.save.bank=1000;
ok(g.buyChairs() && sal().chairs===18 && g.save.bank===1000-S.chairPrice,'compra 2 cadeiras');
ok(g.setSeats(1,4) && g.tables[0].seats===4 && g.tables[0].hx===62,'mesa 1 passa a ter 4 lugares');
ok(L.OBST[0].x1-L.OBST[0].x0===124,'obstáculo da mesa 1 acompanha o tamanho');
ok(g.setSeats(6,2) && g.setSeats(4,4) && L.salaoUsed(sal())===18,'tira 2 cadeiras da mesa 6 e põe na 4');
ok(g.state==='shop' && g.tables.length===6,'segue na lojinha');
ok(!g.shopBought,'cadeiras não contam no limite de 1 melhoria por dia');

// família de 4 senta na mesa 1 (que era de 2) no dia 2
g.startDay(2); g.begin();
{ const t1=g.tables[0]; const grp=g.spawn({type:'familia',color:0,vip:false}); grp.size=4; grp.people=grp.people.concat(grp.people).slice(0,4); grp.dishes=grp.people.map(()=> 'pf');
  let st=0; while(grp.state==='queue'&&!grp.seated&&st<60){ g.update(0.05); st++; }
  ok(g.seatGroup(grp,t1),'família de 4 senta na mesa 1');
  st=0; while(!grp.seated&&st<400){ g.update(0.05); st++; }
  ok(grp.seated,'família chega à mesa 1'); }

// mesas novas
g.goShop(3); g.save.bank=1000;
ok(g.buyTable() && sal().mesas===1 && sal().chairs===20 && g.tables.length===7,'compra a mesa 7 (com 2 cadeiras)');
ok(g.tables.map(t=>t.id).join()==='1,2,3,4,5,6,7','ids seguidos (tables[id-1])');
{ const r0=g.tables.filter(t=>t.cy===S.ys[0]).sort((a,b)=>a.cx-b.cx).map(t=>t.id).join(); ok(r0==='1,2,3,7','a mesa 7 fica na ponta direita da fileira de cima'); }
g.buyChairs(); ok(!g.setSeats(2,4) && /Não cabe/.test(g.salaoMsg),'fileira de 4 mesas: só 1 com 4 lugares');
ok(/fileira de baixo/.test(L.salaoTableBlock(sal())),'mesa 8 não cabe com 2 mesas grandes embaixo');
ok(!g.buyTable() && sal().mesas===1,'compra da mesa 8 recusada');
ok(g.setSeats(4,2) && L.salaoTableBlock(sal())==='' && g.buyTable() && g.tables.length===8,'com 1 mesa grande embaixo, compra a mesa 8');
g.startDay(1);
ok(g.tables[6].open && g.tables[7].open && !g.tables[2].open,'mesas novas abrem todo dia (a 3 segue fechada no dia 1)');
g.startEndless(); ok(g.tables.every(t=>t.open),'Turno sem fim: todas abertas');

// save
{ const n=L.normSave(JSON.parse(JSON.stringify(g.save))); ok(JSON.stringify(n.salao)===JSON.stringify(sal()),'save guarda o salão'); }
{ const n=L.normSalao({seats:{1:7,5:4,6:4,8:4},chairs:-5,mesas:9}); ok(n.mesas===2 && n.chairs===20 && L.salaoOk(n),'save estragado vira salão válido'); }
{ const n=L.normSalao({seats:{1:4,2:4,3:4,4:4,5:4,6:4},chairs:24}); ok(L.salaoOk(n) && L.salaoUsed(n)===24,'6 mesas de 4 lugares'); }

// todas as combinações válidas: mesas sem sobreposição, pontos de atendimento livres e alcançáveis
{ let combos=0, bad=[];
  const A=L.LAYOUT.STATIONS.agua.ap, B=L.LAYOUT.BOUNDS;
  for(let m=0;m<=2;m++) for(let mask=0;mask<(1<<(6+m));mask++){
    const seats={}; for(let i=0;i<6+m;i++) seats[i+1]=(mask>>i)&1?4:2;
    const s={seats,chairs:99,mesas:m}; if(!L.salaoOk(s)) continue; combos++;
    const defs=L.salaoDefs(s); L.setObst(defs);
    const ins=(x,y)=>L.OBST.some(r=>x>r.x0&&x<r.x1&&y>r.y0&&y<r.y1);
    defs.forEach((d,i)=>{ const hx=d.seats===2?36:62;
      defs.forEach((e,j)=>{ if(j>i&&e.cy===d.cy){ const he=e.seats===2?36:62; if(Math.abs(e.cx-d.cx)<hx+he+L.SALAO.gap-1) bad.push('perto '+d.id+'/'+e.id+' '+mask); } });
      [{x:d.cx-hx-28,y:d.cy+4},{x:d.cx+hx+28,y:d.cy+4}].forEach(p=>{
        if(ins(p.x,p.y)||p.x<B.x0||p.x>B.x1) bad.push('ap '+d.id+' '+mask+' '+m);
        const path=L.findPath({x:400,y:316},p); if(Math.hypot(path[path.length-1].x-p.x,path[path.length-1].y-p.y)>1) bad.push('caminho '+d.id); });
    });
    if(ins(A.x,A.y)) bad.push('água '+mask); if(ins(700,470)) bad.push('Dani '+mask);
  }
  g.buildTables(); g.tablesKey=''; g.buildTables();
  ok(combos>40 && !bad.length,'combinações válidas ('+combos+') sem sobreposição'+(bad.length?': '+bad.slice(0,4).join('; '):''));
  ok(!L.salaoOk({seats:{1:4,2:4,3:2,4:2,5:2,6:2,7:2},chairs:99,mesas:1}),'2 mesas grandes numa fileira de 4 não cabem');
}

// bot joga o dia 2 com 8 mesas
{ const bot=require('./bot.js')(g,L); let err=null, served=0;
  try{ g.startDay(2); g.begin(); let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); if(st%10===0) L.render(g,ctx); st++; } served=g.result ? g.result.served : 0; }catch(e){ err=e; }
  ok(!err,'dia 2 com 8 mesas sem exceções'+(err?': '+err.stack:'')); ok(served>=5,'bot atendeu grupos com 8 mesas ('+served+')'); }

// lojinha: o salão ao fundo acompanha cada mudança
{ let err=null; try{ g.goShop(4); g.save.bank=500; g.setSeats(1,2); g.setSeats(7,4); L.render(g,ctx); }catch(e){ err=e; } ok(!err && g.tables[6].seats===4 && g.state==='shop','lojinha: mesa 7 com 4 lugares e salão redesenhado'+(err?': '+err:'')); }

// estrelas: 1 na meta, 2 na metade do caminho até a expert, 3 na expert sem perder ninguém
{ const d=L.DAYS[1], fin=(m,lost)=>{ g.startDay(2); g.begin(); g.money=m; g.stats.lost=lost; g.finishDay(); return g.result.stars; };
  ok(L.bomGoal(d)===900,'2ª estrela do dia 2 em R$ 900');
  ok(fin(699,0)===0 && fin(700,0)===1 && fin(899,0)===1 && fin(900,0)===2 && fin(1099,0)===2,'faixas de 0, 1 e 2 estrelas');
  ok(fin(1100,1)===2 && fin(1100,0)===3,'expert com perda: 2; sem perda: 3');
  ok(L.DAYS.every(x=>L.bomGoal(x)>x.meta && L.bomGoal(x)<x.expert),'2ª estrela sempre entre a meta e a expert'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
