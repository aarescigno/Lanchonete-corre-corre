// bot compartilhado
module.exports=function(g,L){
  return function botStep(){
    const b=g.bia;
    if(g.queue.length){
      const grp=g.queue[0];
      const cands=g.tables.filter(t=>t.free&&t.seats>=grp.size);
      if(cands.length){ cands.sort((a,c)=>(c.color===grp.color)-(a.color===grp.color)||a.seats-c.seats); g.seatGroup(grp,cands[0]); }
    }
    if(b.acts.length>=4) return;
    const has=(f)=>b.acts.some(f);
    if(b.hands.some(h=>h.kind==='ticket') && !has(a=>a.type==='order')) return g.tapStation('order',800,150);
    const d=b.hands.find(h=>h.kind==='dish');
    if(d && !has(a=>a.type==='table'&&a.id===d.table)) return g.tapTable(g.tables[d.table-1]);
    if(b.hands.some(h=>h.kind==='dirty') && !has(a=>a.type==='sink')) return g.tapStation('sink',850,450);
    for(const t of g.tables){
      if(!t.open||has(a=>a.type==='table'&&a.id===t.id)) continue;
      if(t.dirty||(t.group&&(t.group.state==='wantOrder'||t.group.state==='wantBill'))){ if(b.free()>0||t.group&&t.group.state==='wantBill') return g.tapTable(t); }
    }
    for(let i=0;i<4;i++){ const p=g.kitchen.plates[i]; if(p&&b.free()>0&&!has(a=>a.type==='plate'&&a.pid===p.id)) return g.tapStation('plates',L.LAYOUT.PLATE_SLOTS[i].x,L.LAYOUT.PLATE_SLOTS[i].y); }
  };
};
