/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */
/* toque no vazio: anel fraco no ponto, que some em 0,4 s (sem crescer com movimento reduzido) */
function drawTouchFx(ctx,g){
  for (const f of g.fx){
    if (f.k !== 'tap') continue;
    const p = clamp(f.life / f.max, 0, 1), a = 1 - p*p;
    ctx.save();
    circ(ctx,f.x,f.y,RM ? 12 : 8 + p*10);
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.45*a) + ')'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.restore();
  }
}

function render(g, ctx){
  const tm = g.anim;
  const menu = g.state === 'menu';
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  drawFloor(ctx);
  drawWall(ctx,g,tm);
  drawKitchen(ctx,g,tm);

  // marcação da fila
  ctx.fillStyle = 'rgba(34,32,28,.07)';
  for (let i=0;i<QUEUE.max;i++){ rr(ctx,10,QUEUE.ys[i]-72,136,84,12); ctx.fill(); }
  ctx.setLineDash([6,5]); ctx.strokeStyle = 'rgba(31,79,163,.4)'; ctx.lineWidth = 2;
  for (let i=0;i<QUEUE.max;i++){ rr(ctx,10,QUEUE.ys[i]-72,136,84,12); ctx.stroke(); }
  ctx.setLineDash([]);
  txt(ctx,'FILA DE ESPERA',78,QUEUE.ys[3]+26,11,'rgba(31,79,163,.85)','center',FB);

  // destaque de mesa durante arrasto/seleção
  if (g.hover && (g.drag || g.sel)){
    const t = g.hover;
    ctx.save(); ctx.strokeStyle = g.hoverOk ? PAL.ok : PAL.perigo; ctx.lineWidth = 4; ctx.setLineDash([8,5]);
    rr(ctx,t.cx-t.hx-10,t.cy-60,t.hx*2+20,128,14); ctx.stroke();
    ctx.fillStyle = g.hoverOk ? 'rgba(62,155,90,.14)' : 'rgba(194,54,43,.12)'; ctx.fill(); ctx.restore();
  }
  if (g.sel && !g.drag){
    g.tables.forEach(t => { if (t.free && t.seats >= g.sel.size){ ctx.save(); ctx.strokeStyle = 'rgba(62,155,90,' + (0.35+0.25*Math.sin(tm*6)) + ')'; ctx.lineWidth = 3; ctx.setLineDash([6,5]); rr(ctx,t.cx-t.hx-10,t.cy-60,t.hx*2+20,128,14); ctx.stroke(); ctx.restore(); } });
  }

  // lista de desenháveis ordenados por y
  const items = [];
  g.tables.forEach(t => items.push({ y:t.cy + 10, f:() => glowSprite(ctx,g,t,ctx => drawTable(ctx,g,t,tm,menu)) }));
  g.groups.forEach(grp => {
    if (grp.state === 'queue'){
      const isDrag = g.drag && g.drag.moved && g.drag.g === grp;
      items.push({ y:grp.y, f:() => {
        if (grp === g.sel){
          ctx.save(); ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 3.5 + (RM?0:Math.sin(tm*8)*1.2); rr(ctx,grp.x-64,grp.y-74,128,88,14); ctx.stroke(); ctx.restore();
        }
        if (!isDrag) drawMoodRing(ctx,grp.hearts,grp.x,grp.y+2,Math.max(30,grp.people.length*12+16),9,tm);
        ctx.save();
        if (isDrag) ctx.globalAlpha = 0.35;
        const sq = grp.boing > 0 && !RM ? 1 + Math.sin(grp.boing*22)*0.08 : 1;
        ctx.translate(grp.x, grp.y); ctx.scale(1/sq, sq); ctx.translate(-grp.x, -grp.y);
        glowSprite(ctx,g,grp,ctx => drawCluster(ctx,grp,grp.x,grp.y,tm));
        ctx.restore();
      }});
    } else if (grp.state === 'toTable' || grp.state === 'leaving'){
      items.push({ y:grp.y, f:() => drawCluster(ctx,grp,grp.x,grp.y,tm) });
    }
  });
  const b = g.bia;
  items.push({ y:b.y, f:() => {
    drawBia(ctx,b,b.x,b.y,{ moving:b.moving, ph:b.walkPh, flip:b.dir, t:tm });
    const lay = b.layout() || [b.hands.slice(0,1), b.hands.slice(1,2)];
    lay.forEach((its,i) => {
      const hx = b.x + (i ? 20 : -20);
      if (i === 0 && b.tray && its.length){ ell(ctx,hx,b.y-20,its.length > 1 ? 20 : 14,5); fs(ctx,PAL.inox,2); }
      if (its.length === 1) drawHandItem(ctx,its[0],hx,b.y - 28,0.75);
      else its.forEach((h,k) => drawHandItem(ctx,h,hx + (k-(its.length-1)/2)*13,b.y - 27 - (k%2)*3,0.6,true));
    });
  }});
  if (menu) items.pop();
  if (g.up.agua) items.push({ y:150, f:() => glowSprite(ctx,g,'agua',ctx => drawAgua(ctx,g,tm,menu)) });
  if (g.save.equipe.couvert && !menu) items.push({ y:528, f:() => drawMusico(ctx,g,tm) });
  if (g.dani.active && !menu) items.push({ y:g.dani.y, f:() => drawDani(ctx,g.dani,tm) });
  items.sort((a,c) => a.y - c.y).forEach(it => it.f());

  // camada superior: balões, corações, fila
  g.tables.forEach(t => { if (t.open || menu) drawTableOverlay(ctx,g,t,tm,menu); });
  g.queue.forEach(grp => {
    if (grp.state !== 'queue') return;
    if (g.drag && g.drag.moved && g.drag.g === grp) return;
    if (grp.vip){ drawHearts(ctx,grp,grp.x+14,grp.y-64,tm); drawVipBadge(ctx,grp.x-45,grp.y-63,tm); }
    else drawHearts(ctx,grp,grp.x,grp.y-64,tm);
    if (grp.aguarda && !grp.path.length) drawWaitBadge(ctx,grp.x + (grp.vip ? 63 : 50),grp.y-66,tm,grp.piso);
  });
  if (!menu) drawFilaMarcas(ctx,g,tm);
  // "?" sobre a Bia
  if (b.qT > 0 && !menu){
    ctx.save(); ctx.translate(b.x, b.y - 96); drawBubble(ctx,0,0,14,'#fff'); txt(ctx,'?',0,1,20,PAL.perigo,'center',FD); ctx.restore();
  }
  // grupo arrastado
  if (g.drag && g.drag.moved){
    const d = g.drag;
    ctx.save(); ctx.globalAlpha = 0.92;
    shadowEll(ctx,d.x,d.y+14,34,9,0.25);
    drawCluster(ctx,d.g,d.x,d.y+8,tm,{ s:1.05 });
    ctx.restore();
  }

  // efeitos
  for (const f of g.fx){
    if (f.k === 'text'){
      const a = clamp(f.life / 0.5, 0, 1);
      ctx.globalAlpha = a;
      txt(ctx,f.text,f.x,f.y,f.size,f.color,'center',FD,4);
      ctx.globalAlpha = 1;
    } else if (f.k === 'coin'){
      if (f.delay > 0) continue;
      circ(ctx,f.x,f.y,7); fs(ctx,PAL.mostarda,2);
      txt(ctx,'$',f.x,f.y+0.5,9,PAL.tinta,'center',FD);
    } else if (f.k === 'puff'){
      const p = f.life / f.max;
      ctx.globalAlpha = (1-p)*0.8; circ(ctx,f.x,f.y,f.r*(0.6+p)); ctx.fillStyle = '#d9d7d0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(34,32,28,.5)'; ctx.stroke(); ctx.globalAlpha = 1;
    } else if (f.k === 'spark'){
      const p = f.life / f.max;
      ctx.globalAlpha = 1-p; star(ctx,f.x,f.y,5*(1-p)+2,f.color); ctx.globalAlpha = 1;
    }
  }

  if (menu){
    ctx.fillStyle = 'rgba(34,32,28,.18)'; ctx.fillRect(0,92,W,448);
    drawBia(ctx,b,790,520,{ s:2.3, wave:true, t:tm });
    ctx.fillStyle = '#2B2823'; ctx.fillRect(0,540,W,60);
    ctx.fillStyle = PAL.mostarda; ctx.fillRect(0,540,W,4);
  } else {
    drawHud(ctx,g,tm);
    drawTouchFx(ctx,g);
    if (g.ending && g.state === 'playing'){
      const msg = g.reason === 'time' ? 'Fim do expediente!' : (g.reason === 'stars' ? 'Sem estrelas!' : 'Todo mundo atendido!');
      ctx.fillStyle = 'rgba(34,32,28,.35)'; ctx.fillRect(0,230,W,90);
      txt(ctx,msg,W/2,275,46,PAL.mostarda,'center',FD,7);
    }
  }
  ctx.restore();
}

