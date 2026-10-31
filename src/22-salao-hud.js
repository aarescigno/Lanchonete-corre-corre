/* ============================================================
   MESAS E CLIENTES
   ============================================================ */
function drawChair(ctx,x,y,ci,front,plast){
  const c = CHAIRS[ci];
  if (plast){
    // cadeira de plástico de bar (Garagem, v7.4): pernas da mesma cor, abertas, e encosto de aro com frisos
    // verticais vazados, que abre para cima
    ctx.strokeStyle = c.d; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(x-11,y+2); ctx.lineTo(x-15,y+13); ctx.moveTo(x+11,y+2); ctx.lineTo(x+15,y+13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-13,y); ctx.lineTo(x-17,y-26); ctx.quadraticCurveTo(x,y-40,x+17,y-26); ctx.lineTo(x+13,y); ctx.closePath(); fs(ctx,c.c,2.5);
    ctx.fillStyle = c.d;
    [-1,0,1].forEach(i => { ctx.beginPath(); ctx.moveTo(x+i*7-1.6,y-4); ctx.lineTo(x+i*9-2.2,y-26+Math.abs(i)*2); ctx.lineTo(x+i*9+2.2,y-26+Math.abs(i)*2); ctx.lineTo(x+i*7+1.6,y-4); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(x-14,y-26,2.5,18);
    ell(ctx,x,y+2,18,6); fs(ctx,c.d,2.2);
    return;
  }
  ctx.strokeStyle = PAL.cromoEsc; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x-12,y+3); ctx.lineTo(x-13,y+12); ctx.moveTo(x+12,y+3); ctx.lineTo(x+13,y+12); ctx.stroke();
  rr(ctx,x-17,y-34,34,36,7); fs(ctx,c.c,2.5);
  ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x-13,y-30,4,24);
  ell(ctx,x,y+2,18,6); fs(ctx,c.d,2.2);
}

function drawTableBody(ctx,t,open,g,tm){
  const hw = t.hx - 4;
  shadowEll(ctx,t.cx,t.cy+24,hw+8,12,0.2);
  if (garagem(g)){
    // mesa quadrada de plástico de bar (Garagem, v7.4): cantos chanfrados, furo do guarda-sol no meio e pernas
    // que afinam para baixo. A mesa de 4 são 2 mesas quadradas juntas, como no bar
    const n = t.seats === 4 ? 2 : 1, w = hw * 2 / n, top = open ? '#F7F4EB' : '#d6d2c8', side = open ? '#D3CCBB' : '#b9b4a8';
    const leg = (x, y0, y1, d) => { ctx.beginPath(); ctx.moveTo(x-4*d,y0); ctx.lineTo(x+4*d,y0); ctx.lineTo(x+2,y1); ctx.lineTo(x-2,y1); ctx.closePath(); fs(ctx,side,2); };
    const oct = (x, y, ww, h, c) => { ctx.beginPath(); ctx.moveTo(x+c,y); ctx.lineTo(x+ww-c,y); ctx.lineTo(x+ww,y+c*0.6); ctx.lineTo(x+ww,y+h-c*0.6); ctx.lineTo(x+ww-c,y+h); ctx.lineTo(x+c,y+h); ctx.lineTo(x,y+h-c*0.6); ctx.lineTo(x,y+c*0.6); ctx.closePath(); };
    for (let k=0;k<n;k++){
      const x0 = t.cx - hw + k*w;
      leg(x0+9,t.cy+8,t.cy+22,0.8); leg(x0+w-9,t.cy+8,t.cy+22,0.8);       // pernas de trás
      oct(x0,t.cy-14,w,30,8); fs(ctx,side,2.6);                              // espessura do tampo
      leg(x0+7,t.cy+14,t.cy+32,1); leg(x0+w-7,t.cy+14,t.cy+32,1);          // pernas da frente
      oct(x0,t.cy-18,w,30,8); fs(ctx,top,2.6);                               // tampo
      ctx.strokeStyle = 'rgba(34,32,28,.12)'; ctx.lineWidth = 1.2; oct(x0+5,t.cy-14,w-10,22,5); ctx.stroke();
      if (t.toalha) drawToalha(ctx,x0,t.cy,w);
      else { ell(ctx,x0+w/2,t.cy-3,3,1.8); ctx.fillStyle = 'rgba(34,32,28,.35)'; ctx.fill(); }
    }
    if (t.toalha) drawToalhaEnfeites(ctx,t.cx,t.cy,hw);
    if (t.id === '') return;   // mesa no estoque do editor (v8.3.5): sem número
    circ(ctx,t.cx-hw+14,t.cy-1,8.5); fs(ctx,PAL.mostarda,2);
    txt(ctx,String(t.id),t.cx-hw+14,t.cy,12,PAL.tinta,'center',FD);
    return;
  }
  rr(ctx,t.cx-hw,t.cy-15,hw*2,36,9); fs(ctx,'#A8321F',2.6);
  rr(ctx,t.cx-hw,t.cy-18,hw*2,34,9); fs(ctx,open ? PAL.cromo : '#aeb4ba',2.6);
  rr(ctx,t.cx-hw+4,t.cy-14,hw*2-8,26,6); fs(ctx,open ? PAL.formica : '#b7867e',2);
  ctx.fillStyle = 'rgba(255,255,255,.22)'; rr(ctx,t.cx-hw+8,t.cy-11,hw*2-30,5,2.5); ctx.fill();
  // plaquinha do número
  if (t.id === '') return;
  circ(ctx,t.cx-hw+14,t.cy-1,8.5); fs(ctx,'#fff',2);
  txt(ctx,String(t.id),t.cx-hw+14,t.cy,12,PAL.tinta,'center',FD);
}

/* toalha xadrez (v8.6.5, aba Decoração): por cima do tampo da mesa quadrada (x0 é a borda esquerda, w a largura),
   com a aba da frente caindo em ondas */
function drawToalha(ctx,x0,cy,w){
  const a = x0 - 3, b = x0 + w + 3, y0 = cy - 20, y1 = cy + 12, yb = cy + 19;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(a+5,y0); ctx.lineTo(b-5,y0); ctx.quadraticCurveTo(b,y0,b,y0+5); ctx.lineTo(b+1,yb-3);
  const n = 4, d = (b - a + 2) / n;
  for (let i=0;i<n;i++){ const xa = b + 1 - i*d; ctx.quadraticCurveTo(xa - d/2,yb + (i % 2 ? 3 : -1),xa - d,yb - (i === n-1 ? 3 : 0)); }
  ctx.lineTo(a,y0+5); ctx.quadraticCurveTo(a,y0,a+5,y0); ctx.closePath();
  ctx.fillStyle = '#FFFDF7'; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = 'rgba(200,60,50,.55)';
  const q = 7;
  for (let x = a; x < b + 2; x += q*2) ctx.fillRect(x,y0,q,yb - y0 + 4);
  for (let y = y0; y < yb + 4; y += q*2) ctx.fillRect(a,y,b - a + 2,q);
  ctx.fillStyle = 'rgba(34,32,28,.12)'; ctx.fillRect(a,y1,b - a + 2,yb - y1 + 4);   // a aba da frente, na sombra
  ctx.restore();
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.2; ctx.stroke();
  ctx.strokeStyle = 'rgba(34,32,28,.3)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a+1,y1); ctx.lineTo(b+1,y1); ctx.stroke();
  ctx.restore();
}
/* na mesa com toalha: o porta-guardanapo no canto de trás, à direita, e a florzinha num copinho, no meio de trás */
function drawToalhaEnfeites(ctx,cx,cy,hw){
  const px = cx + hw - 13, py = cy - 13;
  ctx.beginPath(); ctx.moveTo(px-6,py); ctx.lineTo(px-4,py-10); ctx.lineTo(px+4,py-10); ctx.lineTo(px+6,py); ctx.closePath(); fs(ctx,'#fff',1.4);
  rr(ctx,px-7,py-6,14,7,1.5); fs(ctx,PAL.cromo,1.6);
  const fx = cx + (hw > 60 ? -hw*0.15 : 4), fy = cy - 13;
  ctx.strokeStyle = '#3E8A47'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(fx,fy-4); ctx.quadraticCurveTo(fx-2,fy-12,fx+1,fy-18); ctx.stroke();
  ell(ctx,fx+3,fy-11,3,1.5); ctx.fillStyle = '#4E9F52'; ctx.fill();
  for (let i=0;i<5;i++){ const a = i*TAU/5; ell(ctx,fx+1+Math.cos(a)*3,fy-19+Math.sin(a)*3,2.4,2.4); ctx.fillStyle = '#F7F4EB'; ctx.fill(); }
  circ(ctx,fx+1,fy-19,1.8); fs(ctx,PAL.mostarda,1);
  rr(ctx,fx-4,fy-6,8,8,2); ctx.fillStyle = 'rgba(191,227,242,.8)'; ctx.fill(); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.4; ctx.stroke();
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
  const plast = garagem(g);
  seats.forEach((s,i) => { if (!s.front) drawChair(ctx,s.x,s.y,t.color,false,plast); });
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
      drawDish(ctx, grp.dishes[i], px, t.cy + 3, 0.52, grp.state === 'wantBill', grp.carnes && grp.carnes[i]);
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
  seats.forEach((s,i) => { if (s.front) drawChair(ctx,s.x,s.y,t.color,true,plast); });
  if (showPpl) seats.forEach((s,i) => { if (s.front && i < grp.people.length) drawSeatPerson(ctx,g,grp,i,s,tm); });
}
function drawSeatPerson(ctx,g,grp,i,s,tm){
  const eating = grp.state === 'eating';
  drawPerson(ctx,grp.people[i],s.x,s.y,{
    sit:true, back:s.front, mood:grp.mood, shirt:CHAIRS[grp.color].c,
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
function drawHearts(ctx,grp,x,y,tm,k){
  const n = 5, sp = 15 * (k || 1);   // k: menor (o entregador na fila de retirada, v8.6)
  for (let i=0;i<n;i++){
    const hx = x + (i - 2) * sp;
    if (i < grp.hearts){
      const last = (i === grp.hearts - 1) && grp.patLeft < 2.5 && isFinite(grp.patLeft) && !grp.piso;
      const pulse = last && !RM ? 1 + 0.25*Math.sin(tm*14) : 1;
      heart(ctx,hx,y,6.2*pulse*(k || 1), last && Math.floor(tm*6)%2 ? '#ff9a8d' : '#E5384A');
    } else heart(ctx,hx,y,5.4*(k || 1),'rgba(255,255,255,.55)','rgba(34,32,28,.45)');
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
  } else if (grp.state === 'wantBill'){
    ctx.scale(pul,pul); drawBubble(ctx,0,0,18,PAL.mostarda); txt(ctx,'$',0,1,26,PAL.tinta,'center',FD);
  } else if (grp.state === 'ordered'){
    // comida pronta (v8.3.4): o prato do grupo no balão; verde pulsando no balcão, branco na mão da Bia ou da Dani
    const pr = g.kitchen.plates.find(p => p && p.group === grp);
    if (pr || [g.bia, g.dani, g.joca].some(q => q.hands.some(h => h.kind === 'dish' && h.group === grp))){
      if (pr) ctx.scale(pul,pul);
      drawBubble(ctx,0,0,18,pr ? PAL.ok : '#fff'); drawDish(ctx,grp.dish,0,0,0.85,false,grp.carnes && grp.carnes[0]);
    }
  }
  ctx.restore();
  if (grp.coffee){ drawIcon(ctx,'coffee',t.cx - t.hx - 10,t.cy - 56,0.9); }
  if (grp.juiceOpen && grp.juicePending > 0){
    const jx = bx + 4, jy = t.cy + 2;
    const jp = (RM || !grp.esperaSuco) ? 1 : 1 + 0.1*Math.sin(tm*9);
    ctx.save(); ctx.translate(jx,jy); ctx.scale(jp,jp);
    rr(ctx,-14,-15,40,28,9); fs(ctx,'#fff',2.2);
    drawIcon(ctx,'juice',-3,0,0.75);
    txt(ctx,'×' + grp.juicePending,14,0,13,PAL.tinta,'center',FD);
    ctx.restore();
  }
  if (grp.doceBalao){   // v9.2: terminou de comer e espera os doces (os que faltam, em ordem)
    const falta = grp.doces.slice(grp.docesDados), dp = RM ? 1 : 1 + 0.1*Math.sin(tm*9), w = 14 + 20 * falta.length;
    const cy = t.cy + 2 + (grp.juiceOpen && grp.juicePending > 0 ? 34 : 0) + (grp.cafeBalao ? 34 : 0);
    ctx.save(); ctx.translate(bx + 4,cy); ctx.scale(dp,dp);
    rr(ctx,-14,-15,w + 6,28,9); fs(ctx,'#fff',2.2);
    falta.forEach((id, i) => drawIcon(ctx,'doce',3 + 20 * i,1,0.72,doceIdx(id)));
    ctx.restore();
  }
  if (grp.cafeEspBalao){   // v9.3: terminou de comer e espera os cafés da máquina de espresso (os que faltam, em ordem)
    const falta = grp.cafes.slice(grp.cafesDados), cp = RM ? 1 : 1 + 0.1*Math.sin(tm*9), w = 14 + 20 * falta.length;
    const cy = t.cy + 2 + (grp.juiceOpen && grp.juicePending > 0 ? 34 : 0) + (grp.cafeBalao ? 34 : 0) + (grp.doceBalao ? 34 : 0);
    ctx.save(); ctx.translate(bx + 4,cy); ctx.scale(cp,cp);
    rr(ctx,-14,-15,w + 6,28,9); fs(ctx,'#fff',2.2);
    falta.forEach((id, i) => drawIcon(ctx,'cafeesp',3 + 20 * i,1,0.72,id === 'cappuccino' ? 1 : 0));
    ctx.restore();
  }
  if (grp.cafeBalao){   // v9: o motorista que acabou de comer espera o cafezinho antes da conta
    const cp = RM ? 1 : 1 + 0.1*Math.sin(tm*9), cy = t.cy + 2 + (grp.juiceOpen && grp.juicePending > 0 ? 34 : 0);
    ctx.save(); ctx.translate(bx + 4,cy); ctx.scale(cp,cp);
    rr(ctx,-14,-15,34,28,9); fs(ctx,'#fff',2.2);
    drawIcon(ctx,'coffee',3,0,0.75);
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
      mood:grp.mood, shirt:CHAIRS[grp.color].c, moving:grp.moving, ph:grp.walkPh + i*0.8, s:o.s, dx:jig, sit:o.sit
    });
    if (o.bebe && i < grp.sucoN) drawIcon(ctx,grp.game.bebida.icon,px + 12,y - (o.sit ? 14 : 30),0.42,grp.sabor);   // bebendo o da espera (sentado ou de pé)
  }
}

/* ============================================================
   HUD
   ============================================================ */
/* estrela pequena, sem contorno (as do Gurugol no HUD, v8.4) */
function starFill(ctx,x,y,r,fill){
  ctx.beginPath();
  for (let i=0;i<10;i++){ const a = -Math.PI/2 + i*Math.PI/5, rad = i%2 ? r*0.45 : r; ctx.lineTo(x+Math.cos(a)*rad, y+Math.sin(a)*rad); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function drawHud(ctx,g,tm){
  ctx.fillStyle = '#2B2823'; ctx.fillRect(0,540,TW,60);
  ctx.fillStyle = PAL.mostarda; ctx.fillRect(0,540,TW,4);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,544); ctx.lineTo(TW,544); ctx.stroke();
  const m = Math.round(g.money), d = g.day;
  if (g.mode === 'semfim'){
    // modo sem fim: reputação em 5 estrelas no lugar da meta
    rr(ctx,12,552,74,40,10); fs(ctx,PAL.mostarda,2.8);
    txt(ctx,'Sem fim',49,573,15,PAL.tinta,'center',FD,0,64);
    txt(ctx,'R$ ' + m,102,564,24,'#FFF7DC','left',FD,4);
    txt(ctx,Math.round(g.pontos) + ' pts · atendidos ' + g.stats.served,320,562,12,'#cfc7b0','right',FB,0,120);
    const flash = g.starFlash > 0 && !RM && Math.floor(g.starFlash*10)%2 === 0;
    for (let i=0;i<5;i++){
      const on = i < g.stars;
      star(ctx,116 + i*24,582,10.5,on ? (flash ? '#fff' : PAL.mostarda) : '#4a453c');
    }
    txt(ctx,'próxima: ' + g.five + '/8 (5 corações)',232,583,10.5,'#cfc7b0','left',FB,0,104);
  } else if (g.mode === 'treino'){
    // Missão zero (v8.2): o que entrou no treino e o passo do pop-up, no lugar da meta
    rr(ctx,12,552,74,40,10); fs(ctx,PAL.mostarda,2.8);
    txt(ctx,'Treino',49,573,17,PAL.tinta,'center',FD,0,64);
    txt(ctx,'R$ ' + m,102,564,24,'#FFF7DC','left',FD,4);
    const tr = g.treino;
    txt(ctx,'Missão zero' + (tr ? ' · passo ' + Math.min(tr.i + 1, tr.total) + ' de ' + tr.total : ' concluída'),102,587,12,'#cfc7b0','left',FB);
  } else {
    // dia
    rr(ctx,12,552,74,40,10); fs(ctx,PAL.mostarda,2.8);
    txt(ctx,'Dia ' + d.n,49,573,20,PAL.tinta,'center',FD);
    // lucro do dia (v7): começa negativo, com as contas, a folha e a divulgação, e cai com os ingredientes
    const m = Math.round(g.lucro);
    txt(ctx,(m < 0 ? 'R$ −' : 'R$ ') + Math.abs(m),102,564,24,m < 0 ? '#FF9C8A' : '#FFF7DC','left',FD,4);
    const done = g.stats.served + g.stats.lost + g.stats.full;
    // pontos de atendimento (v8.3.8): o que as ações da Bia rendem (o dinheiro vem só do que o cliente paga)
    txt(ctx,Math.round(g.pontos) + ' pts · grupos ' + done + '/' + g.schedule.length,320,562,12,'#cfc7b0','right',FB,0,124);
    const bx = 102, bw = 218, by = 576;
    rr(ctx,bx,by,bw,10,5); fs(ctx,'#4a453c',2);
    const frac = clamp(m / d.expert, 0, 1);
    if (frac > 0){ ctx.save(); rr(ctx,bx,by,bw,10,5); ctx.clip(); ctx.fillStyle = m >= d.expert ? PAL.mostarda : (m >= d.meta ? PAL.ok : PAL.alerta); ctx.fillRect(bx,by,bw*frac,10); ctx.restore(); }
    const mx = bx + bw * d.meta / d.expert, gx = bx + bw * bomGoal(d) / d.expert;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx,by-3); ctx.lineTo(mx,by+13); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx,by); ctx.lineTo(gx,by+10); ctx.stroke();   // 2ª estrela
    txt(ctx,'lucro · meta R$ ' + d.meta,bx,593,11,m >= d.meta ? '#7fd69a' : '#cfc7b0','left',FB);
    // 3ª estrela (v8.3.7): o lucro e nenhum cliente perdido; com uma perda, o rótulo avisa que ela já foi
    if (g.stats.lost) txt(ctx,'3ª estrela perdida',bx+bw,593,11,'#FF9C8A','right',FB);
    else txt(ctx,'3 estrelas R$ ' + d.expert,bx+bw,593,11,m >= d.expert ? PAL.mostarda : '#cfc7b0','right',FB);
    // nota do Gurugol (v8.4): a média das últimas avaliações; antes da AVAL.min-ésima, quantas faltam
    const av = g.gurugol;
    rr(ctx,334,550,124,44,9); fs(ctx,'#3b362e',2);
    txt(ctx,'Gurugol',396,561,11,'#cfc7b0','center',FB);
    if (av){
      const fr = avalFrac(av.nota, avalTeto(g.ponto));   // v8.6.4: a cor vai pelo teto do ponto
      txt(ctx,fmtNota(av.nota),372,582,19,fr >= 0.75 ? '#7fd69a' : fr >= 0.5 ? '#FFF7DC' : '#FF9C8A','center',FD,3);
      for (let i=0;i<5;i++){
        const f = clamp(av.nota - i, 0, 1);
        starFill(ctx,398 + i*11,582,5.5,'#5b554a');
        if (f > 0){ ctx.save(); ctx.beginPath(); ctx.rect(392 + i*11,575,12*f,14); ctx.clip(); starFill(ctx,398 + i*11,582,5.5,PAL.mostarda); ctx.restore(); }
      }
    } else txt(ctx,'sem nota: ' + g.gurugolN + '/' + AVAL.min,396,582,11,'#cfc7b0','center',FB,0,116);
  }
  // fila de ações (no meio da tela larga)
  ctx.save(); ctx.translate(HUDX.fila, 0);
  ctx.save(); ctx.translate(342,570); ctx.rotate(-Math.PI/2); txt(ctx,'FILA',0,0,11,'#cfc7b0','center',FB); ctx.restore();
  for (let i=0;i<filaMax(g.up);i++){
    const sx = 360 + i*52, a = g.bia.acts[i];
    glowSprite(ctx,g,'acao' + i,ctx => {
      rr(ctx,sx,548,48,46,8); fs(ctx,a ? PAL.creme : '#3b362e',2.4);
      if (i === 0 && a){ rr(ctx,sx-2,546,52,50,9); ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 3; ctx.stroke(); }
      if (a){ drawActIcon(ctx,g,a,sx+24,571); drawFilaSelo(ctx,i+1,sx+10,554,9,0.75); }
      else { txt(ctx,String(i+1),sx+24,571,14,'#5b554a','center',FB); }
    });
  }
  ctx.restore();
  // mãos, pausa e som (à direita)
  ctx.save(); ctx.translate(HUDX.dir, 0);
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
  ctx.restore();
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
  if (a.type === 'maquina' && a.leg === 2){
    const grp = a.group;
    if (!grp) return null;
    if (grp.state === 'queue') return { x:grp.x + 74, y:grp.y - 40, dy:20 };
    return grp.table ? { x:grp.table.cx - grp.table.hx - 14, y:grp.table.cy - 10, dy:20 } : null;
  }
  const st = STATIONS[a.type];
  return st ? { x:st.rect.x + 12, y:st.rect.y + 6, dx:28 } : null;
}
/* pedido de quem espera lá fora (v7.5), ao lado do grupo (em cima do tablet, se houver): preparando (anel),
   pronto na estação (pulsa; a água da Garagem já sai pronta), a caminho (na mão da Bia ou da Dani) */
function drawPedidoEspera(ctx,g,grp,tm){
  if (!grp.pediu || grp.path.length) return;
  const o = g.maq.find(q => q.group === grp);
  const leva = [g.bia, g.dani, g.joca].some(p => p.hands.some(h => h.kind === 'suco' && h.group === grp));
  if (!o && !leva) return;
  const x = QUEUE.x + 90, y = QUEUE.ys[grp.slot] - 64, pronto = o && o.t <= 0;
  const p = pronto && !RM ? 1 + 0.1 * Math.sin(tm*8) : 1;
  ctx.save(); ctx.translate(x,y); ctx.scale(p,p);
  drawBubble(ctx,0,0,15,pronto ? PAL.ok : g.bebida.id === 'saborizada' ? SABORES[grp.sabor].bal : '#fff');   // v9.1: o balão da água saborizada leva a cor do sabor
  drawIcon(ctx,g.bebida.icon,-2,1,0.62,grp.sabor);
  if (o && o.t > 0) drawRing(ctx,0,0,15,1 - o.t / g.bebida.prep,PAL.alerta);
  const n = o ? o.n : 0;
  if (n){ circ(ctx,12,-11,7); fs(ctx,'#fff',1.4); txt(ctx,String(n),12,-10.5,10,PAL.tinta,'center',FD); }
  if (leva && !o){ circ(ctx,12,-11,7); fs(ctx,PAL.mostarda,1.4); txt(ctx,'→',12,-11,10,PAL.tinta,'center',FD); }
  ctx.restore();
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
  if (h.kind === 'dish'){ drawIcon(ctx,'dish',x,y,s,h.dish,cmdColor(h.group),h.group && h.group.carnes && h.group.carnes[0]); if (h.crit) txt(ctx,'★',x-12*s,y-12*s,13*s,PAL.mostarda,'center',FD); }
  else if (h.kind === 'ticket') drawIcon(ctx,'ticket',x,y,s,cmdColor(h.group));
  else if (h.kind === 'marmita'){ drawMarmita(ctx,h.dish,x,y,s * 0.95); if (!noTag) drawMarmitaSelo(ctx,h,x + 12*s,y - 11*s); }   // v8.6
  else if (h.kind === 'suco'){ drawIcon(ctx,h.group ? h.group.game.bebida.icon : 'juice',x,y,s,h.group && h.group.sabor); if (h.group){ circ(ctx,x+8*s,y+9*s,4.5*s); fs(ctx,CHAIRS[h.group.color].c,1.2); } }   // da espera: a cor de quem pediu
  else if (h.kind === 'doce') drawIcon(ctx,'doce',x,y,s,doceIdx(h.id));   // v9.2
  else if (h.kind === 'cafeesp') drawIcon(ctx,'cafeesp',x,y,s,h.id === 'cappuccino' ? 1 : 0);   // v9.3
  else drawIcon(ctx,h.kind,x,y,s);
  if (h.table && noTag){ circ(ctx,x+5,y-9,5.5); fs(ctx,'#fff',1.4); txt(ctx,String(h.table),x+5,y-8.5,8,PAL.tinta,'center',FD); }
  else if (h.table){ circ(ctx,x+12,y-11,8); fs(ctx,'#fff',1.8); txt(ctx,String(h.table),x+12,y-10,11,PAL.tinta,'center',FD); }
}
function drawActIcon(ctx,g,a,x,y){
  let cc = null;
  if (a.type === 'plate'){ const p0 = g.kitchen.plates.find(q => q && q.id === a.pid); cc = p0 && p0.kind !== 'marmita' ? cmdColor(p0.group) : null; }
  else if (a.type === 'table'){ const t0 = g.tables[a.id-1]; cc = t0 ? cmdColor(t0.group) : null; }
  if (cc){ rr(ctx,x-18,550,36,5,2); fs(ctx,cc,1.4); }
  if (a.type === 'order') drawIcon(ctx,'hat',x,y,1.05);
  else if (a.type === 'adiantar'){ drawIcon(ctx,'marmita',x,y,1.0); circ(ctx,x-12,y-10,6.5); fs(ctx,PAL.ok,1.6); txt(ctx,'+',x-12,y-9.5,11,'#fff','center',FD); }   // v8.6
  else if (a.type === 'coffee') drawIcon(ctx,'coffee',x,y,1.05);
  else if (a.type === 'juice') drawIcon(ctx,'juice',x,y+1,1.0);
  else if (a.type === 'doces') drawIcon(ctx,'doce',x,y,1.05,g.up.confGourmet ? 5 : 1);   // v9.2
  else if (a.type === 'espresso') drawIcon(ctx,'cafeesp',x,y,1.05,a.item === 'cappuccino' ? 1 : 0);   // v9.3
  else if (a.type === 'sink') drawIcon(ctx,'drop',x,y,1.05);
  else if (a.type === 'trash') drawIcon(ctx,'trash',x,y,1.0);
  else if (a.type === 'retirada'){ drawIcon(ctx,'marmita',x,y,1.0); circ(ctx,x+13,y+11,7); fs(ctx,EFOOD_COR,1.6); txt(ctx,'E',x+13,y+11.5,9,'#fff','center',FD); }   // o balcão de retirada (v8.6)
  else if (a.type === 'maquina'){
    drawIcon(ctx,g.bebida.icon,x,y+1,1.0,a.group && a.group.sabor);
    if (a.leg === 2 && a.group){ circ(ctx,x+13,y+12,7); fs(ctx,CHAIRS[a.group.color].c,1.8); }   // levando: a cor de quem pediu
    else if (g.bebida.prep){ rr(ctx,x+6,y+5,14,11,2); fs(ctx,PAL.tinta,1.2); ctx.fillStyle = '#FFE0A6'; ctx.fillRect(x+8,y+7,10,7); }   // o tablet
    else drawIcon(ctx,'drop',x+13,y+10,0.55);   // a torneira
  }
  else if (a.type === 'plate'){
    const p = g.kitchen.plates.find(q => q && q.id === a.pid);
    if (p && p.kind === 'marmita'){ drawIcon(ctx,'marmita',x,y,1.0,p.dish); drawMarmitaSelo(ctx,p,x+13,y-12); return; }
    drawIcon(ctx,'dish',x,y,1.0,p ? p.dish : 'pf',cc);
    if (p){ circ(ctx,x+13,y-12,8); fs(ctx,'#fff',1.8); txt(ctx,String(p.table),x+13,y-11,11,PAL.tinta,'center',FD); }
  } else if (a.type === 'table'){
    const t = g.tables[a.id-1], v = g.bia.verbFor(t);
    const k = v === 'deliver' ? 'dish' : v === 'clear' ? 'dirty' : v === 'take' ? 'ticket' : v === 'bill' ? 'coin' : v === 'coffee' ? 'coffee' : v === 'juice' ? 'juice' : v === 'doce' ? 'doce' : v === 'cafeesp' ? 'cafeesp' : 'table';
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

