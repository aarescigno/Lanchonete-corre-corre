// v3: clientes VIP
const load=require('./harness.js');
let fails=0, total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L}=H; const V=L.VIP;

/* agenda: dias 1–4 sem VIP, dia 5 garante pelo menos 1, entregador nunca é VIP */
for(let n=1;n<=4;n++){ let any=false; for(let k=0;k<30;k++){ g.resetDay(n); if(g.schedule.some(s=>s.vip)) any=true; } ok(!any,'dia '+n+' sem VIP'); }
{ let all=true, bad=false; for(let k=0;k<50;k++){ g.resetDay(5); const v=g.schedule.filter(s=>s.vip); if(!v.length) all=false; if(v.some(s=>!V.types.includes(s.type))) bad=true; } ok(all,'dia 5 sempre tem VIP'); ok(!bad,'VIP nunca é entregador'); }
{ const grp=new L.Group(g,'entregador',99,0,true); ok(!grp.vip,'Group recusa entregador VIP'); }

/* paciência menor e óculos escuros */
{ g.resetDay(5); const a=new L.Group(g,'estudante',1,0,false), b=new L.Group(g,'estudante',2,0,true);
  ok(Math.abs(b.patPer()-a.patPer()*V.pat)<1e-9,'VIP tem paciência ×'+V.pat);
  ok(b.people.every(p=>p.shades) && !a.people.some(p=>p.shades),'só VIP usa óculos escuros'); }

/* fura a fila, atrás de outros VIPs */
{ g.resetDay(5); g.startDay(5); g.begin();
  g.spawn({type:'estudante',color:0}); g.spawn({type:'vovos',color:1});
  const v1=g.spawn({type:'executiva',color:2,vip:true});
  const v2=g.spawn({type:'familia',color:3,vip:true});
  ok(g.queue[0]===v1 && g.queue[1]===v2,'VIPs vão para a frente, em ordem de chegada');
  ok(g.queue.every((x,i)=>x.slot===i),'slots refeitos');
  const before=g.stats.full; g.arrive({type:'estudante',color:0,vip:true});
  ok(g.stats.full===before+1 && g.queue.length===4,'VIP também volta com fila lotada'); }

/* conta: gorjeta extra e bônus com 5 corações */
function pay(vip,hearts){
  g.resetDay(5); g.startDay(5); g.begin();
  const grp=g.spawn({type:'estudante',color:0,vip}); const t=g.tables.find(x=>x.free&&x.seats>=grp.size);
  g.seatGroup(grp,t); grp.hearts=hearts; grp.juiceWant=0; grp.bill=30; const m0=g.money; g.lastKind='x';
  g.collectBill(grp,t); return g.money-m0;
}
{ const base=Math.round(30*1.5), vipAmt=Math.round(30*1.5*(1+V.tip));
  ok(pay(false,5)===base,'conta normal 5♥ = '+base);
  ok(pay(true,5)===vipAmt+V.perfect,'conta VIP 5♥ = '+vipAmt+' + bônus '+V.perfect);
  ok(g.stats.vip===1,'VIP atendido conta na estatística');
  ok(pay(true,4)===Math.round(30*1.25*(1+V.tip)),'VIP com 4♥ não ganha bônus'); }

/* bravo: multa dobrada */
{ g.resetDay(5); g.startDay(5); g.begin(); g.money=500;
  const a=g.spawn({type:'estudante',color:0}); g.angryLeave(a); ok(g.money===470,'normal bravo -30');
  const b=g.spawn({type:'estudante',color:0,vip:true}); g.angryLeave(b); ok(g.money===470-30-V.angry,'VIP bravo -'+(30+V.angry));
  ok(g.stats.vipLost===1,'VIP bravo contado'); }

/* Turno sem fim: VIP só depois de 1 minuto */
{ g.startEndless(); g.begin(); let early=0, late=0;
  for(let k=0;k<400;k++){ g.elapsed=10; g.queue=[]; g.groups=[]; g.spawnEndless(); if(g.groups.some(x=>x.vip)) early++; }
  for(let k=0;k<400;k++){ g.elapsed=120; g.queue=[]; g.groups=[]; g.spawnEndless(); if(g.groups.some(x=>x.vip)) late++; }
  ok(early===0,'sem VIP no 1º minuto'); ok(late>15&&late<100,'VIP aparece depois ('+late+'/400)'); }

/* jogo completo do dia 5 com bot e render */
{ const bot=require('./bot.js')(g,L); let err=null, vips=0;
  try{ for(let r=0;r<5;r++){ g.startDay(5); g.begin(); let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); if(st%10===0) L.render(g,H.ctx); st++; } vips+=g.result.vip+g.result.vipLost; } }catch(e){ err=e; }
  ok(!err,'dia 5 com render sem exceções'+(err?': '+err.stack:'')); ok(vips>0,'bot atendeu/perdeu VIPs ('+vips+')'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
