const H=require('./harness.js')(); const {g,L,els,win,ctx}=H;
let fails=0; const ok=(c,m)=>{ if(!c){fails++;console.log('FAIL:',m);} };
ok(g&&g.state==='menu','initial menu');
L.render(g,ctx);
// UI flows
els['btn-how'].fire('click'); ok(els['ov-how'].classList.contains('show'),'howto shown');
els['btn-how-close'].fire('click');
function botStep(g){
  const b=g.bia;
  // seat
  if(g.queue.length){
    const grp=g.queue[0];
    const cands=g.tables.filter(t=>t.free&&t.seats>=grp.size);
    if(cands.length){ cands.sort((a,c)=>(c.color===grp.color)-(a.color===grp.color)||a.seats-c.seats); g.seatGroup(grp,cands[0]); }
  }
  if(b.acts.length>=4) return;
  const has=(f)=>b.acts.some(f);
  // hands
  if(b.hands.some(h=>h.kind==='ticket') && !has(a=>a.type==='order')) return g.tapStation('order',800,150);
  const d=b.hands.find(h=>h.kind==='dish'); 
  if(d && !has(a=>a.type==='table'&&a.id===d.table)) return g.tapTable(g.tables[d.table-1]);
  if(b.hands.some(h=>h.kind==='dirty') && !has(a=>a.type==='sink')) return g.tapStation('sink',850,450);
  for(const t of g.tables){
    if(!t.open||has(a=>a.type==='table'&&a.id===t.id)) continue;
    if(t.dirty||(t.group&&(t.group.state==='wantOrder'||t.group.state==='wantBill'))){ if(b.free()>0||t.group&&t.group.state==='wantBill') return g.tapTable(t); }
  }
  for(let i=0;i<4;i++){ const p=g.kitchen.plates[i]; if(p&&b.free()>0&&!has(a=>a.type==='plate'&&a.pid===p.id)) return g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y); }
}
const useCoffee = process.argv.includes('coffee');
function playDay(n){
  g.startDay(n); ok(g.state==='intro','intro state day '+n);
  els['btn-start'].fire('click'); ok(g.state==='playing','playing day '+n);
  let steps=0, frames=0;
  while(g.state==='playing' && steps<20000){
    botStep(g); g.update(0.05); steps++;
    if(steps%10===0){ L.render(g,ctx); frames++; }
    // invariants
    ok(L.handLayout(g.bia.hands,g.bia.tray)!==null,'mãos cabem (com ou sem bandeja)'); ok(g.bia.acts.length<=6,'acts<=6');
    ok(g.bia.x>=0&&g.bia.x<=960&&isFinite(g.bia.x)&&isFinite(g.bia.y),'bia pos');
    for(const grp of g.groups){ ok(isFinite(grp.x)&&isFinite(grp.y),'grp pos'); ok(grp.hearts>=0&&grp.hearts<=5,'hearts'); }
    if(fails>20) break;
  }
  ok(g.state==='dayend','day '+n+' ended (state '+g.state+')');
  const r=g.result;
  console.log('Dia',n,'t=',(steps*0.05).toFixed(0)+'s','R$',r.money,'meta',r.meta,'exp',r.expert,'stars',r.stars,'served',r.served,'lost',r.lost,'chain',r.chain,r.reason);
  return r;
}
for(let n=1;n<=7;n++){
  const r=playDay(n);
  if(r.passed){
    els['btn-next'].fire('click');
    if(n<7){ ok(g.state==='shop','shop after day '+n); 
      // buy one
      const u=L.UPGRADES.find(u=>!g.up[u.id]&&g.save.bank>=u.cost); if(u){ ok(g.buy(u.id),'buy '+u.id); ok(!g.buy(L.UPGRADES.find(x=>!g.up[x.id])?.id||'x'),'second buy blocked'); }
      L.render(g,ctx);
    } else ok(g.state==='final','final');
  } else { console.log('meta nao atingida no dia',n); break; }
}
// drag/select + pointer tests
g.startDay(1); g.begin();
for(let i=0;i<200;i++) g.update(0.05);
ok(g.queue.length>0,'queue has group');
const q=g.queue[0];
g.onDown(78,q.y-20); g.onMove(260,205); g.onMove(262,205); g.onUp(262,205);
ok(q.state==='toTable'||q.boing>0,'drag seat attempt');
g.pause(); ok(g.state==='paused','paused'); g.resume(); ok(g.state==='playing','resumed');
console.log('rendered ok; fails =',fails);
process.exit(fails?1:0);
