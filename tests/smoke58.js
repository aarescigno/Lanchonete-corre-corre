// palma.1 (P2-1): o mundo em pé de 600 × 1040: faixas, estações dentro dos limites, espera na calçada, arrumação do salão e um grupo da espera à mesa até pagar.
const H=require('./harness.js')(); const {g,L}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const run=(s,c)=>{ for(let i=0;i<s*20;i++){ g.update(0.05); if(c&&c()) return true; } return false; };
const LY=L.LAYOUT, B=LY.BOUNDS, C=LY.CALCADA;
ok(LY.W===600 && LY.H===1040 && L.TW===600,'o mundo é 600 × 1040');
ok(C.y0===752 && C.y1===944 && LY.BARRA.y0===944 && LY.BARRA.y0+LY.BARRA.h===1040,'calçada de 752 a 944 e barra de 944 a 1040');
ok(Object.keys(LY.STATIONS).every(k=>{ const s=LY.STATIONS[k]; return s.ap.x>=B.x0 && s.ap.x<=B.x1 && s.ap.y>=B.y0 && s.ap.y<=(k==='maquina'?C.y1:B.y1); }),'todo ap das estações fica dentro do BOUNDS (a máquina da espera, na calçada)');
ok(Object.keys(LY.STATIONS).every(k=>{ const r=LY.STATIONS[k].rect; return r.x>=0 && r.x+r.w<=600 && r.y>=0 && r.y+r.h<=1040; }),'todo retângulo de estação cabe no mundo');
const espera=(id,n)=>{ const p=L.PONTOS.find(p=>p.id===id); return p.espera===n; };
ok(espera('garagem',4) && espera('industrial',5) && espera('avenida',6),'espera: 4, 5 e 6 lugares');
for(const p of L.PONTOS){ L.queueLugares(p.espera); ok(L.QUEUE.lugares.length===p.espera && L.QUEUE.lugares.every(q=>q.y>=C.y0 && q.y<=C.y1 && q.x>=0 && q.x<=600),p.id+': todos os lugares da espera ficam na calçada'); }
L.queueLugares(4);
ok(L.QUEUE.lugares[0].x===300 && L.QUEUE.lugares[0].y===820 && LY.DOOR.y>1040,'o 1º lugar é o da porta e a rua fica fora da tela');
// arrumação automática
const quatro=n=>Array.from({length:n},(_,i)=>({x:0,y:0,seats:4,c:i%4}));
{ const a=L.salaoAuto(quatro(6),L.PONTOS[2]); ok(a && a.length===6 && !L.salaoProblema(a,L.PONTOS[2]),'Avenida: 6 mesas de 4 cabem na arrumação automática, com caminho'); }
{ const a=L.salaoAuto(quatro(4),L.PONTOS[0]); ok(a && a.length===4 && !L.salaoProblema(a,L.PONTOS[0]),'Garagem: 4 mesas de 4 cabem, com caminho'); }
{ const a=L.salaoAuto(quatro(5),L.PONTOS[1]); ok(a && a.length===5,'área industrial: 5 mesas de 4 (20 lugares)'); }
// da espera à mesa e ao caixa
g.startDay(2); g.begin(); g.schedule=[]; g.nextIdx=0;
const grp=g.spawn({type:'estudante',color:0,vip:false}); grp.size=1; grp.people=grp.people.slice(0,1);
ok(grp.x===LY.DOOR.x && grp.y===LY.DOOR.y,'o grupo chega da rua de baixo');
run(15,()=>!grp.path.length);
ok(g.queue[0]===grp && Math.abs(grp.y-L.QUEUE.lugares[0].y)<1 && grp.y>=C.y0,'e espera no 1º lugar, na calçada');
const t=g.tables.find(t=>t.free&&t.seats>=grp.size);
ok(g.seatGroup(grp,t),'senta na mesa');
ok(grp.path[0].y===L.ENTRADA.fora.y && grp.path[1].y===L.ENTRADA.dentro.y,'o caminho passa pela porta');
run(30,()=>grp.state==='wantOrder'||grp.state==='reading');
ok(grp.state==='reading'||grp.state==='wantOrder','chega à mesa');
const bot=require('./bot.js')(g,L,{});
let guard=0; const m0=g.money;
while(!grp.paid && guard++<4000){ bot(); g.update(0.05); }
ok(grp.paid && g.money>m0,'o grupo é atendido e paga ('+(g.money-m0)+')');
ok(g.bia.x>=0 && g.bia.x<=600 && g.bia.y>=0 && g.bia.y<=1040,'a Bia fica dentro do mundo');
console.log('smoke58: total =',total,' fails =',fails);
process.exit(fails?1:0);
