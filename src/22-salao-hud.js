/* ============================================================
   MESAS E CLIENTES
   ============================================================ */
function drawChair(ctx,x,y,ci,front){
  const c = CHAIRS[ci];
  ctx.strokeStyle = PAL.cromoEsc; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x-12,y+3); ctx.lineTo(x-13,y+12); ctx.moveTo(x+12,y+3); ctx.lineTo(x+13,y+12); ctx.stroke();
  rr(ctx,x-17,y-34,34,36,7); fs(ctx,c.c,2.5);
  ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x-13,y-30,4,24);
  ell(ctx,x,y+2,18,6); fs(ctx,c.d,2.2);
}

function drawTableBody(ctx,t,open,g,tm){
  const hw = t.hx - 4;
  shadowEll(ctx,t.cx,t.cy+24,hw+8,12,0.2);
  rr(ctx,t.cx-hw,t.cy-15,hw*2,36,9); fs(ctx,'#A8321F',2.6);
  rr(ctx,t.cx-hw,t.cy-18,hw*2,34,9); fs(ctx,open ? PAL.cromo : '#aeb4ba',2.6);
  rr(ctx,t.cx-hw+4,t.cy-14,hw*2-8,26,6); fs(ctx,open ? PAL.formica : '#b7867e',2);
  ctx.fillStyle = 'rgba(255,255,255,.22)'; rr(ctx,t.cx-hw+8,t.cy-11,hw*2-30,5,2.5); ctx.fill();
  // plaquinha do número
  circ(ctx,t.cx-hw+14,t.cy-1,8.5); fs(ctx,'#fff',2);
  txt(ctx,String(t.id),t.cx-hw+14,t.cy,12,PAL.tinta,'center',FD);
}

function drawTable(ctx,g,t,tm,menu){
  const open = t.open || menu;
  const grp = t.group;
  const seats = seatPositions(t);
  const seatedGroup = grp && grp.seated;
  const showPpl = seatedGroup;
  if (!open){
    drawTableBody(ctx,t,false,g,tm);
    ctx.save(); ctx.translate(t.cx,t.cy+4); ctx.rotate(-0.08);
    rr(ctx,-34,-14,68,28,5); fs(ctx,'#FFF3C9',2.5);
    txt(ctx,'Fechado',0,0,16,PAL.perigo,'center',FD);
    ctx.restore();
    return;
  }
  if (grp && grp.seated) drawMoodRing(ctx,grp.hearts,t.cx,t.cy+66,t.hx+2,10,tm);
  // cadeiras e pessoas de trás
  seats.forEach((s,i) => { if (!s.front) drawChair(ctx,s.x,s.y,t.color,false); });
  if (showPpl) seats.forEach((s,i) => { if (!s.front && i < grp.people.length) drawSeatPerson(ctx,g,grp,i,s,tm); });
  drawTableBody(ctx,t,true,g,tm);
  // toalhinha da comanda (do pedido até o grupo sair)
  if (grp && grp.cmd >= 0 && grp.seated){
    const hw = t.hx - 4, mx = t.cx - hw + 28, mw = (t.cx + hw - 3) - mx;
    rr(ctx,mx,t.cy-9,mw,22,5); fs(ctx,CMD[grp.cmd].c,2);
    ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 1.2; rr(ctx,mx+3,t.cy-6,mw-6,16,3); ctx.stroke();
  }
  // louça na mesa
  if (grp && (grp.state === 'eating' || grp.state === 'wantBill')){
    const n = grp.size, hw = t.hx - 4;
    for (let i=0;i<n;i++){
      const px = t.cx - hw + 36 + (i+0.5) * ((hw*2 - 46) / n);
      drawDish(ctx, grp.dishes[i], px, t.cy + 3, 0.52, grp.state === 'wantBill');
    }
  }
  if (t.dirty){
    const hw = t.hx - 4;
    for (let i=0;i<Math.min(4,t.dirtyN);i++){
      const px = t.cx - hw + 38 + i*((hw*2-48)/Math.max(1,Math.min(4,t.dirtyN)));
      drawDish(ctx,'pf',px,t.cy+3,0.52,true);
    }
    ctx.fillStyle = '#fff'; ell(ctx,t.cx+hw-10,t.cy+3,5,3); fs(ctx,'#fff',1.5);
  }
  seats.forEach((s,i) => { if (s.front) drawChair(ctx,s.x,s.y,t.color,true); });
  if (showPpl) seats.forEach((s,i) => { if (s.front && i < grp.people.length) drawSeatPerson(ctx,g,grp,i,s,tm); });
}
function drawSeatPerson(ctx,g,grp,i,s,tm){
  const eating = grp.state === 'eating';
  drawPerson(ctx,grp.people[i],s.x,s.y,{
    sit:true, mood:grp.mood, shirt:CHAIRS[grp.color].c,
    handUp: grp.state === 'wantOrder' && i === 0, t:tm,
    bob: eating && !RM ? Math.sin(tm*6 + i*1.7) * 1.2 : 0
  });
}

function drawBubble(ctx,x,y,r,fill){
  ctx.beginPath(); ctx.moveTo(x-r*0.75,y+r*0.35); ctx.lineTo(x-r*0.95,y+r*1.35); ctx.lineTo(x-r*0.1,y+r*0.85); ctx.closePath(); fs(ctx,fill,2.4);
  circ(ctx,x,y,r); fs(ctx,fill,2.6);
}
/* "aguardando mesa" (v7.1): balãozinho com mesa e relógio ao lado dos corações de quem está na fila sem
   mesa que sirva (a paciência corre mais devagar). No piso de 1 coração, o relógio fica azul e para */
function drawWaitBadge(ctx,x,y,tm,piso){
  ctx.save(); ctx.translate(x,y);
  drawBubble(ctx,0,0,12,'#fff');
  drawIcon(ctx,'table',-2,3,0.58);
  circ(ctx,6,-5,5.2); fs(ctx,piso ? PAL.faixa : PAL.mostarda,1.6);
  const a = (RM || piso) ? -Math.PI/2 + 1.2 : tm*2.4;
  ctx.strokeStyle = piso ? '#fff' : PAL.tinta; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(6,-5); ctx.lineTo(6 + Math.cos(a)*3.4, -5 + Math.sin(a)*3.4); ctx.moveTo(6,-5); ctx.lineTo(6,-8.2); ctx.stroke();
  ctx.restore();
}
function drawRing(ctx,x,y,r,frac,col){
  ctx.beginPath(); ctx.arc(x,y,r+4,-Math.PI/2,-Math.PI/2+TAU*clamp(frac,0,1));
  ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.lineCap = 'butt'; ctx.stroke(); ctx.lineCap = 'round';
}
function drawHearts(ctx,grp,x,y,tm){
  const n = 5, sp = 15;
  for (let i=0;i<n;i++){
    const hx = x + (i - 2) * sp;
    if (i < grp.hearts){
      const last = (i === grp.hearts - 1) && grp.patLeft < 2.5 && isFinite(grp.patLeft) && !grp.piso;
      const pulse = last && !RM ? 1 + 0.25*Math.sin(tm*14) : 1;
      heart(ctx,hx,y,6.2*pulse, last && Math.floor(tm*6)%2 ? '#ff9a8d' : '#E5384A');
    } else heart(ctx,hx,y,5.4,'rgba(255,255,255,.55)','rgba(34,32,28,.45)');
  }
}
function drawTableOverlay(ctx,g,t,tm,menu){
  const grp = t.group;
  const bx = t.cx + t.hx + 6, by = t.cy - 44;
  if (t.dirty){
    const p = RM ? 1 : 1 + 0.06*Math.sin(tm*5);
    ctx.save(); ctx.translate(bx,by); ctx.scale(p,p); drawBubble(ctx,0,0,17,'#fff'); drawIcon(ctx,'dirty',0,0,0.85); ctx.restore();
    return;
  }
  if (!grp || grp.state === 'toTable' || grp.state === 'leaving' || !t.open) return;
  drawHearts(ctx,grp,t.cx,t.cy-70,tm);
  if (grp.vip) drawVipBadge(ctx,t.cx-60,t.cy-70,tm);
  const pul = RM ? 1 : 1 + 0.12*Math.sin(tm*7);
  ctx.save(); ctx.translate(bx,by);
  if (grp.state === 'reading'){
    drawBubble(ctx,0,0,17,'#fff'); drawIcon(ctx,'menu',0,0,0.85);
    drawRing(ctx,0,0,17,1 - grp.timer/Math.max(0.1,grp.T.read[1]),PAL.faixa);
  } else if (grp.state === 'wantOrder'){
    ctx.scale(pul,pul); drawBubble(ctx,0,0,18,PAL.alerta); txt(ctx,'!',0,1,26,'#fff','center',FD,3);
  } else if (grp.state === 'ordered'){
    drawBubble(ctx,0,0,17,'#fff');
    const pr = g.kitchen.progressFor(grp);
    const plate = g.kitchen.plates.some(p => p && p.group === grp);
    if (pr < 0 && !plate){ drawIcon(ctx,'ticket',0,0,0.8); }
    else { drawDish(ctx,grp.dish,0,2,0.9); drawRing(ctx,0,0,17,plate ? 1 : pr,plate ? PAL.ok : PAL.alerta); }
  } else if (grp.state === 'eating'){
    drawBubble(ctx,0,0,17,'#fff'); drawDish(ctx,grp.dish,0,2,0.9);
    drawRing(ctx,0,0,17,1 - grp.timer/Math.max(0.1,grp.eatTotal),PAL.ok);
  } else if (grp.state === 'wantBill'){
    ctx.scale(pul,pul); drawBubble(ctx,0,0,18,PAL.mostarda); txt(ctx,'$',0,1,26,PAL.tinta,'center',FD);
  }
  ctx.restore();
  if (grp.coffee){ drawIcon(ctx,'coffee',t.cx - t.hx - 8,t.cy - 52,0.6); }
  if (grp.juiceOpen && grp.juicePending > 0){
    const jx = bx + 4, jy = t.cy + 2;
    const jp = (RM || grp.state !== 'wantBill') ? 1 : 1 + 0.1*Math.sin(tm*9);
    ctx.save(); ctx.translate(jx,jy); ctx.scale(jp,jp);
    rr(ctx,-14,-15,40,28,9); fs(ctx,'#fff',2.2);
    drawIcon(ctx,'juice',-3,0,0.75);
    txt(ctx,'×' + grp.juicePending,14,0,13,PAL.tinta,'center',FD);
    ctx.restore();
  }
}

function drawCluster(ctx,grp,x,y,tm,o){
  o = o || {};
  const n = grp.people.length;
  const sp = 26 * (o.s || 1);
  for (let i=0;i<n;i++){
    const px = x + (i - (n-1)/2) * sp;
    const jig = (grp.hearts <= 2 && !grp.moving && grp.state === 'queue' && !RM) ? Math.sin(tm*14 + i) * 1.2 : 0;
    drawPerson(ctx,grp.people[i],px,y,{
      mood:grp.mood, shirt:CHAIRS[grp.color].c, moving:grp.moving, ph:grp.walkPh + i*0.8, s:o.s, dx:jig
    });
  }
}

/* ============================================================
   HUD
   ============================================================ */
function drawHud(ctx,g,tm){
  ctx.fillStyle = '#2B2823'; ctx.fillRect(0,540,W,60);
  ctx.fillStyle = PAL.mostarda; ctx.fillRect(0,540,W,4);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,544); ctx.lineTo(W,544); ctx.stroke();
  const m = Math.round(g.money), d = g.day;
  if (g.mode === 'semfim'){
    // modo sem fim: reputação em 5 estrelas no lugar da meta
    rr(ctx,12,552,74,40,10); fs(ctx,PAL.mostarda,2.8);
    txt(ctx,'Sem fim',49,573,15,PAL.tinta,'center',FD,0,64);
    txt(ctx,'R$ ' + m,102,564,24,'#FFF7DC','left',FD,4);
    txt(ctx,'atendidos ' + g.stats.served,320,562,12,'#cfc7b0','right',FB);
    const flash = g.starFlash > 0 && !RM && Math.floor(g.starFlash*10)%2 === 0;
    for (let i=0;i<5;i++){
      const on = i < g.stars;
      star(ctx,116 + i*24,582,10.5,on ? (flash ? '#fff' : PAL.mostarda) : '#4a453c');
    }
    txt(ctx,'próxima: ' + g.five + '/8 (5 corações)',232,583,10.5,'#cfc7b0','left',FB,0,104);
  } else {
    // dia
    rr(ctx,12,552,74,40,10); fs(ctx,PAL.mostarda,2.8);
    txt(ctx,'Dia ' + d.n,49,573,20,PAL.tinta,'center',FD);
    // lucro do dia (v7): começa negativo, com as contas, a folha e a divulgação, e cai com os ingredientes
    const m = Math.round(g.lucro);
    txt(ctx,(m < 0 ? 'R$ −' : 'R$ ') + Math.abs(m),102,564,24,m < 0 ? '#FF9C8A' : '#FFF7DC','left',FD,4);
    const done = g.stats.served + g.stats.lost + g.stats.full;
    txt(ctx,'grupos ' + done + '/' + g.schedule.length,320,562,12,'#cfc7b0','right',FB);
    const bx = 102, bw = 218, by = 576;
    rr(ctx,bx,by,bw,10,5); fs(ctx,'#4a453c',2);
    const frac = clamp(m / d.expert, 0, 1);
    if (frac > 0){ ctx.save(); rr(ctx,bx,by,bw,10,5); ctx.clip(); ctx.fillStyle = m >= d.expert ? PAL.mostarda : (m >= d.meta ? PAL.ok : PAL.alerta); ctx.fillRect(bx,by,bw*frac,10); ctx.restore(); }
    const mx = bx + bw * d.meta / d.expert, gx = bx + bw * bomGoal(d) / d.expert;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx,by-3); ctx.lineTo(mx,by+13); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx,by); ctx.lineTo(gx,by+10); ctx.stroke();   // 2ª estrela
    txt(ctx,'lucro · meta R$ ' + d.meta,bx,593,11,m >= d.meta ? '#7fd69a' : '#cfc7b0','left',FB);
    txt(ctx,'expert R$ ' + d.expert,bx+bw,593,11,m >= d.expert ? PAL.mostarda : '#cfc7b0','right',FB);
  }
  // fila de ações
  ctx.save(); ctx.translate(342,570); ctx.rotate(-Math.PI/2); txt(ctx,'FILA',0,0,11,'#cfc7b0','center',FB); ctx.restore();
  for (let i=0;i<6;i++){
    const sx = 360 + i*52, a = g.bia.acts[i];
    glowSprite(ctx,g,'acao' + i,ctx => {
      rr(ctx,sx,548,48,46,8); fs(ctx,a ? PAL.creme : '#3b362e',2.4);
      if (i === 0 && a){ rr(ctx,sx-2,546,52,50,9); ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 3; ctx.stroke(); }
      if (a){ drawActIcon(ctx,g,a,sx+24,571); drawFilaSelo(ctx,i+1,sx+10,554,9,0.75); }
      else { txt(ctx,String(i+1),sx+24,571,14,'#5b554a','center',FB); }
    });
  }
  // mãos
  const tray = g.bia.tray;
  const lay = g.bia.layout() || [g.bia.hands.slice(0,1), g.bia.hands.slice(1,2)];
  txt(ctx,tray ? 'BANDEJA · MÃO' : 'MÃOS',748,553,10,'#cfc7b0','center',FB);
  for (let i=0;i<2;i++){
    const hx = 700 + i*48, its = lay[i];
    rr(ctx,hx,558,40,36,8); fs(ctx,its.length ? PAL.creme : '#3b362e',2.2);
    if (i === 0 && tray){ ctx.fillStyle = its.length ? 'rgba(142,153,166,.45)' : 'rgba(185,194,204,.25)'; ell(ctx,hx+20,586,17,4.5); ctx.fill(); }
    if (its.length === 1) drawHandItem(ctx,its[0],hx+20,576,0.85);
    else its.forEach((h,k) => drawHandItem(ctx,h,hx+20+(k-(its.length-1)/2)*(its.length>2?11:14),578,its.length>2?0.5:0.6,true));
  }
  // pausa e som
  rr(ctx,836,546,52,50,10); fs(ctx,PAL.creme,2.6);
  ctx.fillStyle = PAL.tinta; ctx.fillRect(852,560,7,22); ctx.fillRect(866,560,7,22);
  glowSprite(ctx,g,'som',ctx => {
    rr(ctx,894,546,52,50,10); fs(ctx,PAL.creme,2.6);
    ctx.fillStyle = PAL.tinta; ctx.beginPath(); ctx.moveTo(906,566); ctx.lineTo(913,566); ctx.lineTo(922,558); ctx.lineTo(922,584); ctx.lineTo(913,576); ctx.lineTo(906,576); ctx.closePath(); ctx.fill();
    if (!Sfx.muted){ ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(924,571,6,-0.9,0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(924,571,11,-0.9,0.9); ctx.stroke(); }
    else { ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(927,563); ctx.lineTo(939,579); ctx.moveTo(939,563); ctx.lineTo(927,579); ctx.stroke(); }
  });
}
/* selo com a vez na fila (v7.3): etiqueta "1º", "2º"... (ordinal, para não confundir com o número
   da mesa); a ação atual em mostarda, as outras escuras; surge com um pulinho (parado com RM) */
function drawFilaSelo(ctx,n,x,y,age,s){
  s = s || 1;
  const p = RM || !(age < 0.3) ? 1 : 1 + 0.45 * Math.sin(Math.PI * Math.min(1, age / 0.3)) * (1 - age / 0.3);
  const cur = n === 1;
  ctx.save(); ctx.translate(x,y); ctx.scale(p*s,p*s);
  rr(ctx,-13,-9,26,18,6); fs(ctx,cur ? PAL.mostarda : PAL.tinta,2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; rr(ctx,-11.5,-7.5,23,15,5); ctx.stroke();
  txt(ctx,n + 'º',0.5,0.5,12,cur ? PAL.tinta : '#fff','center',FD);
  ctx.restore();
}
/* onde fica o selo de cada lugar da fila (null se o lugar sumiu, ex.: prato já pego) */
function filaPos(g,a){
  // mesa: à esquerda do tampo, empilhando para baixo; prato: em cima dele; estação: no canto, para a direita
  if (a.type === 'table'){ const t = g.tables[a.id-1]; return t ? { x:t.cx - t.hx - 14, y:t.cy - 10, dy:20 } : null; }
  if (a.type === 'plate'){ const j = g.kitchen.plates.findIndex(p => p && p.id === a.pid); return j < 0 ? null : { x:PLATE_SLOTS[j].x, y:PLATE_SLOTS[j].y - 26, dy:-20 }; }
  const st = STATIONS[a.type];
  return st ? { x:st.rect.x + 12, y:st.rect.y + 6, dx:28 } : null;
}
function drawFilaMarcas(ctx,g,tm){
  const seen = {};
  g.bia.acts.forEach((a,i) => {
    const pos = filaPos(g,a);
    if (!pos) return;
    const k = pos.x + ',' + pos.y, n = seen[k] = (seen[k] || 0) + 1;
    drawFilaSelo(ctx,i+1,pos.x + (n-1)*(pos.dx || 0),pos.y + (n-1)*(pos.dy || 0),tm - (a.t0 == null ? -9 : a.t0));
  });
}
function drawHandItem(ctx,h,x,y,s,noTag){
  if (h.kind === 'dish'){ drawIcon(ctx,'dish',x,y,s,h.dish,cmdColor(h.group)); if (h.crit) txt(ctx,'★',x-12*s,y-12*s,13*s,PAL.mostarda,'center',FD); }
  else if (h.kind === 'ticket') drawIcon(ctx,'ticket',x,y,s,cmdColor(h.group));
  else drawIcon(ctx,h.kind,x,y,s);
  if (h.table && noTag){ circ(ctx,x+5,y-9,5.5); fs(ctx,'#fff',1.4); txt(ctx,String(h.table),x+5,y-8.5,8,PAL.tinta,'center',FD); }
  else if (h.table){ circ(ctx,x+12,y-11,8); fs(ctx,'#fff',1.8); txt(ctx,String(h.table),x+12,y-10,11,PAL.tinta,'center',FD); }
}
function drawActIcon(ctx,g,a,x,y){
  let cc = null;
  if (a.type === 'plate'){ const p0 = g.kitchen.plates.find(q => q && q.id === a.pid); cc = p0 ? cmdColor(p0.group) : null; }
  else if (a.type === 'table'){ const t0 = g.tables[a.id-1]; cc = t0 ? cmdColor(t0.group) : null; }
  if (cc){ rr(ctx,x-18,550,36,5,2); fs(ctx,cc,1.4); }
  if (a.type === 'order') drawIcon(ctx,'hat',x,y,1.05);
  else if (a.type === 'coffee') drawIcon(ctx,'coffee',x,y,1.05);
  else if (a.type === 'juice') drawIcon(ctx,'juice',x,y+1,1.0);
  else if (a.type === 'sink') drawIcon(ctx,'drop',x,y,1.05);
  else if (a.type === 'trash') drawIcon(ctx,'trash',x,y,1.0);
  else if (a.type === 'agua') drawAguaJar(ctx,x,y+10,0.6);
  else if (a.type === 'plate'){
    const p = g.kitchen.plates.find(q => q && q.id === a.pid);
    drawIcon(ctx,'dish',x,y,1.0,p ? p.dish : 'pf',cc);
    if (p){ circ(ctx,x+13,y-12,8); fs(ctx,'#fff',1.8); txt(ctx,String(p.table),x+13,y-11,11,PAL.tinta,'center',FD); }
  } else if (a.type === 'table'){
    const t = g.tables[a.id-1], v = g.bia.verbFor(t);
    const k = v === 'deliver' ? 'dish' : v === 'clear' ? 'dirty' : v === 'take' ? 'ticket' : v === 'bill' ? 'coin' : v === 'coffee' ? 'coffee' : v === 'juice' ? 'juice' : 'table';
    drawIcon(ctx,k,x,y-1,k==='table'?1.0:0.95, k === 'ticket' ? cc : (t && t.group ? t.group.dish : 'pf'), k === 'dish' ? cc : null);
    circ(ctx,x+14,y+11,9); fs(ctx,'#fff',1.8); txt(ctx,String(a.id),x+14,y+12,12,PAL.tinta,'center',FD);
  }
}

/* brilho do toque só no desenho do objeto (sem halo em volta): o objeto é desenhado numa camada
   à parte e uma cópia dele é somada por cima ('lighter'), clareando só os pixels dele; some em 0,4 s */
let glowCv = null;
function glowSprite(ctx,g,key,fn){
  const f = g && g.fx.find(e => e.k === 'glow' && e.key === key), cv = ctx.canvas;
  if (!f || !cv || !cv.width || typeof ctx.getTransform !== 'function'){ fn(ctx); return; }
  if (!glowCv) glowCv = document.createElement('canvas');
  if (glowCv.width !== cv.width || glowCv.height !== cv.height){ glowCv.width = cv.width; glowCv.height = cv.height; }
  const o = glowCv.getContext('2d');
  o.setTransform(1,0,0,1,0,0); o.clearRect(0,0,cv.width,cv.height);
  o.setTransform(ctx.getTransform()); o.lineJoin = ctx.lineJoin; o.lineCap = ctx.lineCap; o.globalAlpha = ctx.globalAlpha;
  fn(o);
  const p = clamp(f.life / f.max, 0, 1), a = 1 - p*p;
  ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha = 1;
  ctx.drawImage(glowCv,0,0);
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.4*a; ctx.drawImage(glowCv,0,0);
  ctx.restore();
}

