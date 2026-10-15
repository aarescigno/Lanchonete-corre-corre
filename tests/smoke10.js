// v7.1, Jogo justo: fila que espera mesa (ritmo mais lento e piso de 1 coração), porta que respeita a lotação
// e perdas contadas por causa.
const H=require('./harness.js')(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const FJ=L.FILA_JUSTA, P=L.PORTA;
const near=(a,b,e)=>Math.abs(a-b)<=(e||0.02);
const run=s=>{ for(let i=0;i<Math.round(s*20);i++) g.update(0.05); };
// dia 5 com todas as mesas abertas ocupadas por grupos comendo (sem paciência correndo) e sem chegadas
function cheio(n, mode){
  g.save.equipe=L.normSave({}).equipe; g.save.bank=5000; g.up={}; g.save.up=g.up;
  if(mode==='semfim') g.startEndless(); else g.startDay(n||5);
  g.begin(); g.nextIdx=g.schedule.length; g.arrT=1e9;
  g.tables.filter(t=>t.open).forEach(t=>{ const x=g.spawn({type:'executiva',color:t.color}); g.seatGroup(x,t); x.path=[]; x.setState('eating'); x.timer=1e6; });
}
const naFila=(type)=>{ const x=g.spawn({type:type||'executiva',color:0}); x.path=[]; x.drank=true; return x; };

// ritmo da fila justa
cheio(); { const x=naFila(); run(0.05); ok(x.aguarda && x.semMesa,'salão cheio: o grupo da fila fica aguardando mesa');
  const p0=x.patLeft; run(1); ok(near(p0-x.patLeft,FJ.ritmo),'sem mesa, a paciência cai a '+Math.round(FJ.ritmo*100)+'% do ritmo ('+(p0-x.patLeft).toFixed(3)+' em 1 s)');
  const t=g.tables[0]; g.timeUpLeave(t.group); run(0.05);
  ok(!x.aguarda,'mesa livre: deixa de aguardar');
  const p1=x.patLeft; run(1); ok(near(p1-x.patLeft,1),'com mesa livre, a paciência volta ao ritmo normal ('+(p1-x.patLeft).toFixed(3)+')');
  t.dirty=true; run(0.05); ok(!x.aguarda,'mesa suja conta como mesa que serve (é só recolher)'); }
cheio(); { g.timeUpLeave(g.tables[0].group); run(0.05); const f=naFila('familia'); run(0.05);
  ok(f.aguarda && !g.queue.filter(q=>q!==f).some(q=>q.aguarda),'família com só mesa de 2 livre: aguarda mesa de 4 (e quem cabe na de 2, não)'); }

// piso de 1 coração (carreira)
cheio(); { const x=naFila(); x.hearts=1; x.patLeft=x.patPer(); run(60);
  ok(x.state==='queue' && x.hearts===1 && x.piso,'carreira: sem mesa, não passa de 1 coração (60 s depois, ainda na fila)');
  ok(near(x.patLeft,x.patPer()*FJ.piso,0.06),'o piso guarda metade da paciência do último coração ('+x.patLeft.toFixed(2)+' s)');
  ok(g.stats.lost===0,'ninguém perdido enquanto espera mesa');
  g.timeUpLeave(g.tables[0].group); run(0.05); ok(!x.piso && !x.aguarda,'abriu mesa: sai do piso');
  run(x.patPer()); ok(g.stats.lost===1 && g.stats.lostBy.comMesa===1,'com mesa livre e sem sentar, vai embora (perda "com mesa")'); }
cheio(); { const x=naFila(); x.hearts=2; x.patLeft=0.2; run(0.5); ok(x.hearts===1 && x.patLeft>x.patPer()*FJ.piso,'perde o 2º coração e desce até o piso pelo ritmo lento'); }

// Turno sem fim: vale o ritmo, mas não o piso
cheio(0,'semfim'); { const x=naFila(); run(0.05); const p0=x.patLeft; run(1);
  ok(x.aguarda && near(p0-x.patLeft,FJ.ritmo),'sem fim: o ritmo lento também vale');
  x.hearts=1; x.patLeft=0.3; run(1); ok(x.state==='leaving' && g.stats.lostBy.semMesa===1,'sem fim: sem piso, a fila sem mesa pode ir embora (perda "sem mesa")'); }

// porta que respeita a lotação
cheio(); { [0,1,2].forEach(()=>naFila()); ok(g.lotado,'salão lotado: mesas ocupadas e '+P.fila+' grupos na fila');
  g.schedule.push({t:g.elapsed,type:'estudante',color:1,vip:false}); const n0=g.stats.spawned;
  run(P.max-1); ok(g.stats.spawned===n0 && near(g.atraso,P.max-1,0.1),'lotado: a chegada espera ('+g.atraso.toFixed(1)+' s)');
  run(1.5); ok(g.stats.spawned===n0+1 && g.stats.full===0,'depois de '+P.max+' s, entra mesmo assim (sem "Lotado!")'); }
cheio(); { [0,1].forEach(()=>naFila()); ok(!g.lotado,'2 grupos na fila: não está lotado');
  g.schedule.push({t:g.elapsed,type:'estudante',color:1,vip:false}); const n0=g.stats.spawned; run(0.1); ok(g.stats.spawned===n0+1 && g.atraso===0,'sem lotação, a chegada não espera'); }
cheio(); { [0,1,2].forEach(()=>naFila()); g.atraso=P.total*g.day.time; g.schedule.push({t:g.elapsed-g.atraso,type:'estudante',color:1,vip:false}); const n0=g.stats.spawned; run(0.1);
  ok(g.stats.spawned===n0+1,'atraso total no limite ('+Math.round(P.total*100)+'% do dia): não espera mais'); }
cheio(0,'semfim'); { [0,1,2].forEach(()=>naFila()); g.arrT=0; const n0=g.stats.spawned; run(0.1); ok(g.stats.spawned===n0+1 && g.atraso===0,'sem fim: a porta não segura chegadas'); }

// dia inteiro com o bot afiado: o total de grupos não muda e as causas somam as perdas
{ const bot=require('./bot.js')(g,L,{afiado:true}); let sp=0, sch=0, lost=0, by=0;
  for(let k=0;k<6;k++){ g.save.equipe=L.normSave({equipe:{tonhao:2,dani:3,daniTasks:['pratos','lavar','lixo'],couvert:true}}).equipe; g.save.bank=5000; g.up={pratos:true,tenis:true}; g.save.up=g.up;
    g.startDay(6); g.begin(); sch+=g.schedule.length; let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
    sp+=g.stats.spawned; lost+=g.result.lost; by+=Object.values(g.result.lostBy).reduce((a,b)=>a+b,0); }
  ok(sp===sch,'dia 6 inteiro: chegaram todos os '+sch+' grupos (a porta só muda o ritmo)');
  ok(by===lost,'perdas por causa somam as perdas ('+lost+')'); }
{ cheio(); const x=naFila(); x.state='wantOrder'; g.angryLeave(x); ok(g.stats.lostBy.pedido===1,'perda esperando o pedido conta como "pedido"'); }

// desenho: ícone "aguardando mesa" na fila
cheio(); { naFila(); const v=g.spawn({type:'executiva',color:2,vip:true}); v.path=[]; run(0.1);
  let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'render com fila aguardando mesa (VIP e normal) '+(err?err.message:''));
  const x=g.queue.find(q=>!q.vip); x.hearts=1; x.patLeft=0.01; run(0.5); try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err && x.piso,'render no piso de 1 coração'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
