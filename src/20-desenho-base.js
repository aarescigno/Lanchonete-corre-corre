/* ============================================================
   DESENHO — helpers
   ============================================================ */
const TAU = Math.PI * 2;
function rr(ctx,x,y,w,h,r){
  r = Math.min(r, w/2, h/2);
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);     ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function ell(ctx,x,y,rx,ry){ ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,TAU); }
function circ(ctx,x,y,r){ ctx.beginPath(); ctx.arc(x,y,r,0,TAU); }
function fs(ctx,fill,lw){
  if (fill){ ctx.fillStyle = fill; ctx.fill(); }
  ctx.lineWidth = lw || 2.5; ctx.strokeStyle = PAL.tinta; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.stroke();
}
function txt(ctx,s,x,y,size,color,align,font,stroke,maxW){
  ctx.font = size + 'px ' + (font || FD);
  ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
  if (maxW){
    if (stroke){ ctx.lineWidth = stroke; ctx.strokeStyle = PAL.tinta; ctx.lineJoin = 'round'; ctx.strokeText(s,x,y,maxW); }
    ctx.fillStyle = color; ctx.fillText(s,x,y,maxW); return;
  }
  if (stroke){ ctx.lineWidth = stroke; ctx.strokeStyle = PAL.tinta; ctx.lineJoin = 'round'; ctx.strokeText(s,x,y); }
  ctx.fillStyle = color; ctx.fillText(s,x,y);
}
function cmdColor(grp){ return (grp && grp.cmd >= 0) ? CMD[grp.cmd].c : null; }
function drawTray(ctx,x,y,s,col){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  rr(ctx,-19,-10,38,22,6); fs(ctx,col,2.2);
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.2; rr(ctx,-16,-7,32,16,4); ctx.stroke();
  ctx.restore();
}
/* aro de humor sob o grupo: verde (5-4 corações), amarelo (3-2), vermelho piscando (1) */
function drawMoodRing(ctx,hearts,x,y,rx,ry,tm){
  const col = hearts >= 4 ? MOOD.ok : (hearts >= 2 ? MOOD.warn : MOOD.bad);
  let a = 1;
  if (hearts <= 1 && !RM) a = 0.45 + 0.55 * (0.5 + 0.5*Math.sin(tm*10));
  ctx.save();
  ctx.globalAlpha = 0.28 * a; ctx.fillStyle = col; ell(ctx,x,y,rx,ry); ctx.fill();
  ctx.globalAlpha = a; ctx.lineWidth = 3.5; ctx.strokeStyle = col; ell(ctx,x,y,rx,ry); ctx.stroke();
  ctx.restore();
}
/* selo VIP: plaquinha dourada com estrela e "VIP" (o texto, não só a cor, identifica o VIP) */
function drawVipBadge(ctx,x,y,tm){
  const p = RM ? 1 : 1 + 0.06*Math.sin(tm*5);
  ctx.save(); ctx.translate(x,y); ctx.scale(p,p);
  rr(ctx,-19,-9,38,18,6); fs(ctx,PAL.mostarda,2.2);
  star(ctx,-10,0,5.5,'#fff');
  txt(ctx,'VIP',5,1,12,PAL.tinta,'center',FD);
  ctx.restore();
}
function shadowEll(ctx,x,y,rx,ry,a){
  ctx.fillStyle = 'rgba(34,32,28,' + (a||0.2) + ')'; ell(ctx,x,y,rx,ry); ctx.fill();
}
function heart(ctx,x,y,r,fill,stroke){
  ctx.beginPath();
  ctx.moveTo(x, y + r*0.95);
  ctx.bezierCurveTo(x + r*1.6, y - r*0.1, x + r*0.8, y - r*1.25, x, y - r*0.4);
  ctx.bezierCurveTo(x - r*0.8, y - r*1.25, x - r*1.6, y - r*0.1, x, y + r*0.95);
  ctx.closePath();
  if (fill){ ctx.fillStyle = fill; ctx.fill(); }
  ctx.lineWidth = 1.8; ctx.strokeStyle = stroke || PAL.tinta; ctx.lineJoin = 'round'; ctx.stroke();
}
function star(ctx,x,y,r,fill){
  ctx.beginPath();
  for (let i=0;i<10;i++){ const a = -Math.PI/2 + i*Math.PI/5, rad = i%2 ? r*0.45 : r; ctx.lineTo(x+Math.cos(a)*rad, y+Math.sin(a)*rad); }
  ctx.closePath(); fs(ctx, fill, 2);
}
function mmssUp(s){ s = Math.max(0, Math.floor(s)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
function mmss(s){ s = Math.max(0, Math.ceil(s)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }

/* ---------- pratos ---------- */
function drawDish(ctx,k,x,y,s,empty){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ell(ctx,0,0,15,10.5); fs(ctx,'#fff',2.4);
  ell(ctx,0,0,9.5,6); ctx.lineWidth = 1.2; ctx.strokeStyle = '#d4d0c4'; ctx.stroke();
  if (empty){
    ctx.fillStyle = '#b9772f'; circ(ctx,-3,1,1.6); ctx.fill(); circ(ctx,4,-1,1.2); ctx.fill();
    ctx.restore(); return;
  }
  drawComida(ctx,k);
  ctx.restore();
}
/* marmita (v8.6): a quentinha de alumínio com a tampa de papelão e o desenho da comida em cima; (x, y) é o meio da tampa */
function drawMarmita(ctx,k,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.beginPath(); ctx.moveTo(-16,0); ctx.lineTo(16,0); ctx.lineTo(13,10); ctx.lineTo(-13,10); ctx.closePath(); fs(ctx,'#C9D0D7',2.2);   // a forma de alumínio
  ctx.strokeStyle = 'rgba(34,32,28,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-14,5); ctx.lineTo(14,5); ctx.stroke();
  rr(ctx,-18,-13,36,14,4); fs(ctx,'#F4EEDD',2.2);   // a tampa
  ctx.save(); ctx.translate(0,-6); ctx.scale(0.95,0.62); drawComida(ctx,k); ctx.restore();
  ctx.restore();
}
/* a comida do prato (sem o prato), centrada em (0, 0) */
function drawComida(ctx,k){
  const pr = CARDAPIO[k], cat = pr ? pr.cat : 'chapa', cor = pr ? pr.cor : '#D9A25B';   // v8.6.9: os pratos novos usam o desenho da categoria, na cor do prato (as artes de verdade vêm na v8.6.10)
  if (k === 'pf'){
    ell(ctx,-5,-1,5.5,4.2); fs(ctx,'#FFF6DA',1.6);
    ell(ctx,4,-3.5,5,3.4); fs(ctx,'#5B2E1A',1.6);
    rr(ctx,-3,1.5,12,5,2.5); fs(ctx,'#A0522D',1.6);
    ell(ctx,-7,5,3.4,2.2); fs(ctx,'#fff',1.4); circ(ctx,-7,5,1.2); ctx.fillStyle = '#F5B800'; ctx.fill();
  } else if (cat === 'pastel'){
    rr(ctx,-11,-6,22,12,5.5); fs(ctx,cor,2);
    ctx.fillStyle = '#F4C874'; rr(ctx,-8,-4,10,3,1.5); ctx.fill();
    ctx.strokeStyle = '#B97A1E'; ctx.lineWidth = 1.2;
    for (let i=-8;i<=8;i+=4){ ctx.beginPath(); ctx.moveTo(i,4.6); ctx.lineTo(i,6.2); ctx.stroke(); }
  } else if (cat === 'frito'){
    ctx.beginPath(); ctx.moveTo(0,-10);
    ctx.bezierCurveTo(11,-5, 10,5, 3,8); ctx.lineTo(-3,8);
    ctx.bezierCurveTo(-10,5, -11,-5, 0,-10); ctx.closePath(); fs(ctx,cor,2);
    ctx.fillStyle = '#F7C168'; ell(ctx,-3,-2,2.2,3.6); ctx.fill();
  } else if (cat === 'assado'){
    circ(ctx,0,0,9.5); fs(ctx,cor,2);
    ctx.strokeStyle = 'rgba(90,50,20,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-4,-3); ctx.lineTo(4,3); ctx.moveTo(4,-3); ctx.lineTo(-4,3); ctx.stroke();
  } else { // misto-quente (e os da chapa)
    ctx.beginPath(); ctx.moveTo(-12,5); ctx.lineTo(-1,5); ctx.lineTo(-6.5,-7); ctx.closePath(); fs(ctx,cor,2);
    ctx.beginPath(); ctx.moveTo(1,5); ctx.lineTo(12,5); ctx.lineTo(6.5,-7); ctx.closePath(); fs(ctx,cor,2);
    ctx.fillStyle = '#F6D44A'; ctx.fillRect(-10,1.5,8.5,2); ctx.fillRect(2,1.5,8.5,2);
  }
}

/* torneira de parede (v7.7, a água da espera da Garagem): cano, registro de borboleta e bica; (x, y) é a ponta da bica */
function drawTorneira(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); if (s) ctx.scale(s,s);
  rr(ctx,-30,-15,20,6,2); fs(ctx,PAL.cromoEsc,1.8);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-6,-12); ctx.quadraticCurveTo(0,-12,0,-3); ctx.stroke();
  ctx.strokeStyle = PAL.cromo; ctx.lineWidth = 3.6; ctx.stroke(); ctx.lineCap = 'butt';
  rr(ctx,-13,-18,11,11,3); fs(ctx,PAL.cromo,1.8);
  ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(-8.5,-23,2,5);
  rr(ctx,-14,-26,13,4,2); fs(ctx,PAL.cromo,1.4);
  ctx.restore();
}
/* ---------- ícones (HUD / mãos) ---------- */
function drawIcon(ctx,k,x,y,s,extra,extra2){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  if (k === 'ticket'){
    const tc = (typeof extra === 'string' && extra.charAt(0) === '#') ? extra : null;
    rr(ctx,-8,-11,16,22,2); fs(ctx,'#FFFBEA',2);
    ctx.strokeStyle = tc || PAL.perigo; ctx.lineWidth = 1.6;
    for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-4,-3+i*5); ctx.lineTo(4,-3+i*5); ctx.stroke(); }
    ctx.fillStyle = tc || PAL.faixa; ctx.fillRect(-8,-11,16,tc ? 6 : 3);
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.2; ctx.strokeRect(-8,-11,16,tc ? 6 : 3);
  } else if (k === 'dish'){
    if (extra2) drawTray(ctx,0,2,1,extra2);
    drawDish(ctx,extra||'pf',0,2,0.95);
  } else if (k === 'marmita'){
    drawMarmita(ctx,extra||'pf',0,1,0.95);
  } else if (k === 'coffee'){
    ell(ctx,0,7,11,3.5); fs(ctx,'#fff',2);
    rr(ctx,-7,-5,14,12,3); fs(ctx,'#fff',2);
    ctx.beginPath(); ctx.arc(8,0.5,4,-1.2,1.3); ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.tinta; ctx.stroke();
    ctx.fillStyle = '#5B2E1A'; ctx.fillRect(-5.5,-3.5,11,3);
    ctx.strokeStyle = 'rgba(34,32,28,.45)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-2,-8); ctx.quadraticCurveTo(-5,-11,-2,-14); ctx.moveTo(3,-8); ctx.quadraticCurveTo(0,-11,3,-14); ctx.stroke();
  } else if (k === 'juice'){
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2,-9); ctx.lineTo(6,-16); ctx.lineTo(9,-16); ctx.stroke();
    ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(2,-9); ctx.lineTo(6,-16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-7,-10); ctx.lineTo(7,-10); ctx.lineTo(5,11); ctx.lineTo(-5,11); ctx.closePath(); fs(ctx,'rgba(255,255,255,.85)',2);
    ctx.beginPath(); ctx.moveTo(-6.2,-4); ctx.lineTo(6.2,-4); ctx.lineTo(4.6,9.5); ctx.lineTo(-4.6,9.5); ctx.closePath(); ctx.fillStyle = '#F39A1E'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-4.5,-2,2,9);
    circ(ctx,-6,-10,3.2); fs(ctx,'#F6C343',1.4);
  } else if (k === 'agua'){
    // copo americano com água da torneira (v7.7): a boca lisa em cima e os gomos
    ctx.beginPath(); ctx.moveTo(-7,-10); ctx.lineTo(7,-10); ctx.lineTo(5,11); ctx.lineTo(-5,11); ctx.closePath(); fs(ctx,'rgba(255,255,255,.85)',2);
    ctx.beginPath(); ctx.moveTo(-6.3,-5); ctx.lineTo(6.3,-5); ctx.lineTo(4.6,9.5); ctx.lineTo(-4.6,9.5); ctx.closePath(); ctx.fillStyle = 'rgba(110,184,234,.7)'; ctx.fill();
    ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-6.6,-6.5); ctx.lineTo(6.6,-6.5);
    for (const f of [-3,0,3]){ ctx.moveTo(f*1.15,-6.5); ctx.lineTo(f*0.8,10.5); }
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-4.8,-3,1.6,10);
  } else if (k === 'dirty'){
    for (let i=0;i<3;i++){ ell(ctx,0,6-i*5,12,4.2); fs(ctx,i%2?'#f0efe9':'#fff',2); }
    ctx.fillStyle = '#b9772f'; circ(ctx,-3,-5,1.5); ctx.fill();
  } else if (k === 'coin'){
    circ(ctx,0,0,11); fs(ctx,PAL.mostarda,2.2);
    txt(ctx,'$',0,1,15,PAL.tinta,'center',FD);
  } else if (k === 'hat'){
    ctx.beginPath(); ctx.arc(-6,-4,6,0,TAU); ctx.arc(0,-8,7,0,TAU); ctx.arc(6,-4,6,0,TAU); fs(ctx,'#fff',2);
    rr(ctx,-8,-2,16,11,2); fs(ctx,'#fff',2);
    ctx.strokeStyle = '#cfcab9'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-3,8); ctx.moveTo(3,0); ctx.lineTo(3,8); ctx.stroke();
  } else if (k === 'drop'){
    ctx.beginPath(); ctx.moveTo(0,-11); ctx.bezierCurveTo(10,0,9,9,0,10); ctx.bezierCurveTo(-9,9,-10,0,0,-11); ctx.closePath(); fs(ctx,'#6EB8EA',2.2);
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ell(ctx,-3,1,1.8,3.5); ctx.fill();
  } else if (k === 'trash'){
    rr(ctx,-10,-8,20,4,2); fs(ctx,PAL.cromo,1.8);
    ctx.beginPath(); ctx.moveTo(-8,-4); ctx.lineTo(8,-4); ctx.lineTo(6,11); ctx.lineTo(-6,11); ctx.closePath(); fs(ctx,PAL.cromoEsc,2);
    rr(ctx,-3,-11,6,3,1); fs(ctx,PAL.cromoEsc,1.4);
  } else if (k === 'table'){
    rr(ctx,-11,-5,22,12,4); fs(ctx,PAL.formica,2.2);
    ctx.fillStyle = PAL.cromo; ctx.fillRect(-9,7,3,5); ctx.fillRect(6,7,3,5);
  } else if (k === 'menu'){
    rr(ctx,-12,-8,11,16,2); fs(ctx,'#FFFBEA',2); rr(ctx,1,-8,11,16,2); fs(ctx,'#FFFBEA',2);
    ctx.strokeStyle = PAL.faixa; ctx.lineWidth = 1.5;
    for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-10,-4+i*4); ctx.lineTo(-3,-4+i*4); ctx.moveTo(3,-4+i*4); ctx.lineTo(10,-4+i*4); ctx.stroke(); }
  }
  ctx.restore();
}

/* ============================================================
   PESSOAS
   ============================================================ */
function drawPerson(ctx,p,x,y,o){
  o = o || {};
  const sc = (p.kid ? 0.74 : (p.elder ? 0.95 : 1)) * (o.s || 1);
  const moving = !!o.moving, ph = o.ph || 0, sit = !!o.sit;
  const bob = (moving && !RM) ? -Math.abs(Math.sin(ph)) * 2.4 : (o.bob || 0);
  const mood = o.mood || 0;
  ctx.save();
  ctx.translate(x + (o.dx||0), y);
  ctx.scale(sc, sc);
  if (sit) ctx.translate(0, 12);
  if (!sit && !o.noShadow) shadowEll(ctx,0,0,13,4,0.2);
  const skin = SKINS[p.skin];
  const shirt = o.shirt || '#888';
  // pernas
  if (!sit){
    const sw = moving ? Math.sin(ph) * 4 : 0;
    ctx.fillStyle = p.pants;
    rr(ctx,-8+sw,-14,7,13,2); fs(ctx,p.pants,2);
    rr(ctx,1-sw,-14,7,13,2); fs(ctx,p.pants,2);
    ell(ctx,-5+sw,-0.5,5,2.6); fs(ctx,'#2c2a26',1.6);
    ell(ctx,5-sw,-0.5,5,2.6); fs(ctx,'#2c2a26',1.6);
  }
  // acessórios atrás
  if (p.acc === 'backpack'){ rr(ctx,-15,-33+bob,30,19,6); fs(ctx,'#E8A73A',2); }
  if (p.acc === 'helmet'){ rr(ctx,-17,-39+bob,34,27,5); fs(ctx,PAL.mostarda,2); ctx.fillStyle = PAL.perigo; ctx.fillRect(-17,-31+bob,34,4); }
  // cabelo atrás
  const hy = -42 + bob;
  const hc = HAIRC.indexOf(p.hairC) >= 0 ? p.hairC : '#2F1D12';
  if (p.hair === 1){ rr(ctx,-13,hy-8,26,34,9); fs(ctx,hc,2); }
  else if (p.hair === 3){ circ(ctx,0,hy-3,17); fs(ctx,hc,2.2); }
  else if (p.hair === 5){
    for (let i=0;i<7;i++){ const a = Math.PI + i*(Math.PI/6); circ(ctx,Math.cos(a)*11,hy-1+Math.sin(a)*11,6); fs(ctx,hc,2); }
  }
  else if (p.hair === 6){
    rr(ctx,-14,hy-4,5.5,28,3); fs(ctx,hc,1.8); rr(ctx,8.5,hy-4,5.5,28,3); fs(ctx,hc,1.8);
    ctx.fillStyle = PAL.mostarda; circ(ctx,-11,hy+22,2); ctx.fill(); circ(ctx,11,hy+22,2); ctx.fill();
  }
  // tronco
  ctx.beginPath();
  ctx.moveTo(-11,-32+bob); ctx.lineTo(11,-32+bob); ctx.lineTo(13.5,-12); ctx.lineTo(-13.5,-12); ctx.closePath();
  fs(ctx,shirt,2.5);
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(-9,-30+bob,5,16);
  if (p.acc === 'backpack'){ ctx.strokeStyle = '#B9791B'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-7,-31+bob); ctx.lineTo(-8,-14); ctx.moveTo(7,-31+bob); ctx.lineTo(8,-14); ctx.stroke(); }
  // braços
  ctx.lineCap = 'round';
  const armCol = shirt;
  const upY = o.handUp ? -52 + Math.sin((o.t||0)*9) * 4 : -17;
  const lv = o.lava ? Math.sin((o.t||0)*11) : 0;   // lavando: os dois braços vão para a frente (a pia) e balançam
  const bE = o.bracoE || (o.lava ? [[-2,-24-lv*2],[19+lv*4,-24+lv*2]] : [[-15.5,-17]]);
  const rX = o.lava ? 20-lv*4 : 15.5, rY = o.lava ? -24-lv*2 : -17;   // o braço esquerdo pode ir a outro lugar: (cotovelo e) mão, sem contar o ombro
  const bD = o.bracoD || [[o.handUp?16:rX,o.handUp?upY:rY]];   // o direito também (abertura, v8.6.1)
  const mE = bE[bE.length-1], hE = o.bracoE ? 0 : 1.5, mD = bD[bD.length-1], hD = o.bracoD ? 0 : (o.handUp ? -2 : 1.5);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-11,-30+bob); bE.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(11,-30+bob); bD.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  ctx.strokeStyle = armCol; ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.moveTo(-11,-30+bob); bE.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(11,-30+bob); bD.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  circ(ctx,mE[0],mE[1] + hE,3.6); fs(ctx,skin,1.8);
  circ(ctx,mD[0],mD[1] + hD,3.6); fs(ctx,skin,1.8);
  if (p.acc === 'laptop'){ rr(ctx,-10,-22+bob,20,13,2); fs(ctx,'#9aa5b1',2); ctx.fillStyle = '#d9e4ee'; ctx.fillRect(-7,-20+bob,14,8); }
  if (p.acc === 'book'){ rr(ctx,-20,-22,9,12,1.5); fs(ctx,PAL.faixa,1.8); }
  if (p.acc === 'cane'){ ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(21,0); ctx.lineTo(21,-20); ctx.arc(18,-20,3,0,-Math.PI,true); ctx.stroke(); }
  // cabeça
  circ(ctx,-11,hy+1,2.8); fs(ctx,skin,1.6); circ(ctx,11,hy+1,2.8); fs(ctx,skin,1.6);
  circ(ctx,0,hy,11); fs(ctx,skin,2.5);
  if (o.back){   // de costas (sentado na frente da mesa, olhando para ela): nuca coberta, sem rosto
    if (p.acc !== 'helmet'){ circ(ctx,0,hy,11.3); fs(ctx,p.hair === 4 && !p.elder ? skin : hc,2.2); }
    else { ctx.beginPath(); ctx.arc(0,hy-1,12.5,Math.PI,0); ctx.closePath(); fs(ctx,PAL.faixa,2.5); rr(ctx,-13,hy-3,26,3.5,1.5); fs(ctx,'#1b1b1b',1.6); circ(ctx,0,hy+2,9.5); fs(ctx,skin,1.6); }
    if (p.hair === 2){ circ(ctx,0,hy-15,6); fs(ctx,hc,2); }
    ctx.restore();
    return;
  }
  // cabelo frente
  if (p.acc === 'helmet'){
    ctx.beginPath(); ctx.arc(0,hy-1,12.5,Math.PI,0); ctx.closePath(); fs(ctx,PAL.faixa,2.5);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ell(ctx,-4,hy-8,3.5,2); ctx.fill();
    rr(ctx,-13,hy-3,26,3.5,1.5); fs(ctx,'#1b1b1b',1.6);
  } else if (p.hair !== 4){
    ctx.beginPath(); ctx.arc(0,hy-1,11.6,Math.PI*1.02,Math.PI*1.98);
    if (p.hair === 0 || p.hair === 2) { ctx.quadraticCurveTo(5,hy-6,-2,hy-7); ctx.quadraticCurveTo(-8,hy-6,-11.5,hy-1); }
    else { ctx.lineTo(8,hy-5); ctx.lineTo(-8,hy-5); }
    ctx.closePath(); fs(ctx,hc,2);
    if (p.hair === 2){ circ(ctx,0,hy-15,6); fs(ctx,hc,2); }
  } else if (p.elder){
    ctx.strokeStyle = hc; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(0,hy+1,11.5,Math.PI*0.85,Math.PI*1.1); ctx.stroke(); ctx.beginPath(); ctx.arc(0,hy+1,11.5,-Math.PI*0.1,Math.PI*0.15); ctx.stroke();
  }
  // rosto (abertura, v8.6.1: olha vira o rosto para o lado em que anda; pisca e fala animam)
  if (o.olha) ctx.translate(o.olha * 2.5,0);
  ctx.fillStyle = PAL.tinta;
  if (o.sleepy || o.pisca) { ctx.fillRect(-6,hy,4,1.6); ctx.fillRect(2,hy,4,1.6); }
  else { circ(ctx,-4.2,hy+0.5,1.7); ctx.fill(); circ(ctx,4.2,hy+0.5,1.7); ctx.fill(); }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
  if (o.fala){ ell(ctx,0,hy+5.2,3,1.2 + o.fala * 1.8); fs(ctx,'#7A2E2E',1.5); if (mood === 0){ ctx.fillStyle = 'rgba(226,106,44,.28)'; circ(ctx,-7.5,hy+4,2.4); ctx.fill(); circ(ctx,7.5,hy+4,2.4); ctx.fill(); } }
  else if (mood === 0){ ctx.beginPath(); ctx.arc(0,hy+3.4,4.4,0.2,Math.PI-0.2); ctx.stroke(); ctx.fillStyle = 'rgba(226,106,44,.28)'; circ(ctx,-7.5,hy+4,2.4); ctx.fill(); circ(ctx,7.5,hy+4,2.4); ctx.fill(); }
  else if (mood === 1){ ctx.beginPath(); ctx.moveTo(-3,hy+6.5); ctx.lineTo(3,hy+6.5); ctx.stroke(); }
  else if (mood === 3){   // triste (abertura, v8.5.1): boca para baixo e sobrancelhas erguidas no meio
    ctx.beginPath(); ctx.arc(0,hy+9.5,3.6,Math.PI+0.5,TAU-0.5); ctx.stroke();
    ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-7,hy-3); ctx.lineTo(-2.5,hy-5); ctx.moveTo(7,hy-3); ctx.lineTo(2.5,hy-5); ctx.stroke();
  }
  else {
    ctx.beginPath(); ctx.arc(0,hy+9,4,Math.PI+0.3,TAU-0.3); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-7.5,hy-4.6); ctx.lineTo(-2,hy-2.4); ctx.moveTo(7.5,hy-4.6); ctx.lineTo(2,hy-2.4); ctx.stroke();
  }
  if (p.shades){
    ctx.fillStyle = '#1b1b1b'; ctx.lineWidth = 1.5;
    rr(ctx,-8.6,hy-2.6,7.4,5.6,2.2); ctx.fill(); rr(ctx,1.2,hy-2.6,7.4,5.6,2.2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-1.2,hy-0.6); ctx.lineTo(1.2,hy-0.6); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-7,hy-1.6,2,1.4); ctx.fillRect(2.8,hy-1.6,2,1.4);
  }
  else if (p.glasses){ ctx.lineWidth = 1.5; circ(ctx,-4.4,hy+0.5,3.6); ctx.stroke(); circ(ctx,4.4,hy+0.5,3.6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-0.9,hy+0.5); ctx.lineTo(0.9,hy+0.5); ctx.stroke(); }
  ctx.restore();
}

function drawBia(ctx,b,x,y,o){
  o = o || {};
  const sc = o.s || 1, moving = !!o.moving, ph = o.ph || 0;
  const bob = (moving && !RM) ? -Math.abs(Math.sin(ph)) * 2.8 : (RM ? 0 : Math.sin((o.t||0)*3) * 0.6);
  const skin = '#6B3F25';
  ctx.save(); ctx.translate(x,y); ctx.scale(sc * (o.flip || 1), sc);
  shadowEll(ctx,0,0,16,5,0.22);
  const sw = moving ? Math.sin(ph) * 5 : 0;
  // pernas
  rr(ctx,-7+sw,-14,6,13,2.5); fs(ctx,skin,2);
  rr(ctx,1-sw,-14,6,13,2.5); fs(ctx,skin,2);
  ell(ctx,-4+sw,-0.5,6,3); fs(ctx,'#fff',2);
  ell(ctx,4-sw,-0.5,6,3); fs(ctx,'#fff',2);
  ctx.fillStyle = PAL.formica; ctx.fillRect(-8+sw,-2.5,5,1.8); ctx.fillRect(2-sw,-2.5,5,1.8);
  // saia verde
  ctx.beginPath(); ctx.moveTo(-10,-32+bob); ctx.lineTo(10,-32+bob); ctx.lineTo(15,-14); ctx.lineTo(-15,-14); ctx.closePath(); fs(ctx,'#2E8B57',2.5);
  // braços
  ctx.lineCap = 'round';
  const wave = o.wave ? Math.sin((o.t||0)*8) * 5 : 0;
  const lv = o.lava ? Math.sin((o.t||0)*11) : 0;   // lavando: braços à frente, balançando em direção à pia
  let aE = o.lava ? [-2+lv*4+18,-24+lv*2] : [-15,-18], aD = o.wave ? [19+wave,-52] : (o.lava ? [20-lv*4,-24-lv*2] : [15,-18]);
  if (o.wave && o.wa != null){ const k = o.wa; aD = [15 + (4 + wave) * k,-18 - 34 * k]; }   // o aceno entra aos poucos (abertura)
  if (o.maos){ aE = o.maos[0]; aD = o.maos[1]; }                                             // as mãos onde a cena pede (abertura)
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 8.5;
  ctx.beginPath(); ctx.moveTo(-10,-30+bob); ctx.lineTo(aE[0],aE[1]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10,-30+bob); ctx.lineTo(aD[0],aD[1]); ctx.stroke();
  ctx.strokeStyle = '#2E8B57'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(-10,-30+bob); ctx.lineTo(aE[0],aE[1]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10,-30+bob); ctx.lineTo(aD[0],aD[1]); ctx.stroke();
  circ(ctx,aE[0],aE[1]+2,3.8); fs(ctx,skin,1.8);
  circ(ctx,aD[0],aD[1]+(o.maos ? 0 : (o.wave?-2:2)),3.8); fs(ctx,skin,1.8);
  // avental laranja
  ctx.beginPath(); ctx.moveTo(-8,-30+bob); ctx.lineTo(8,-30+bob); ctx.lineTo(11,-12); ctx.lineTo(-11,-12); ctx.closePath(); fs(ctx,PAL.alerta,2.4);
  rr(ctx,-5,-22,10,6,1.5); fs(ctx,'#F58A4E',1.6);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-6,-31+bob); ctx.lineTo(-3,-38+bob); ctx.moveTo(6,-31+bob); ctx.lineTo(3,-38+bob); ctx.stroke();
  // cabeça e cabelo
  const hy = -46 + bob;
  circ(ctx,0,hy-14,13.5); fs(ctx,'#15100D',2.5);              // puff
  circ(ctx,-11.5,hy+1,2.8); fs(ctx,skin,1.6); circ(ctx,11.5,hy+1,2.8); fs(ctx,skin,1.6);
  circ(ctx,0,hy,11.5); fs(ctx,skin,2.5);
  ctx.beginPath(); ctx.arc(0,hy-1,12,Math.PI*1.05,Math.PI*1.95); ctx.quadraticCurveTo(0,hy-7,-12,hy-1); ctx.closePath(); fs(ctx,'#15100D',2);
  // lenço amarelo
  ctx.beginPath(); ctx.moveTo(-12.5,hy-5); ctx.quadraticCurveTo(0,hy-11,12.5,hy-5); ctx.lineTo(12,hy-9); ctx.quadraticCurveTo(0,hy-16,-12,hy-9); ctx.closePath(); fs(ctx,PAL.mostarda,2);
  ctx.beginPath(); ctx.moveTo(10,hy-8); ctx.lineTo(18,hy-12); ctx.lineTo(16,hy-5); ctx.closePath(); fs(ctx,PAL.mostarda,1.8);
  // rosto
  if (o.olha) ctx.translate(o.olha * 2.5,0);
  ctx.fillStyle = PAL.tinta;
  if (o.pisca){ ctx.fillRect(-6.2,hy+0.4,4,1.6); ctx.fillRect(2.2,hy+0.4,4,1.6); } else { circ(ctx,-4.3,hy+1,1.8); ctx.fill(); circ(ctx,4.3,hy+1,1.8); ctx.fill(); }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.9;
  if (o.fala){ ell(ctx,0,hy+5.6,3.2,1.2 + o.fala * 2); fs(ctx,'#7A2E2E',1.5); } else { ctx.beginPath(); ctx.arc(0,hy+3.8,4.6,0.2,Math.PI-0.2); ctx.stroke(); }
  ctx.fillStyle = 'rgba(226,106,44,.3)'; circ(ctx,-7.8,hy+4.6,2.4); ctx.fill(); circ(ctx,7.8,hy+4.6,2.4); ctx.fill();
  ctx.restore();
}


/* banco (v8.3): o prediozinho de colunas, com a moeda na frente (centro em 0,0; ~30 px) */
function drawBanco(c){
  c.beginPath(); c.moveTo(-15,-6); c.lineTo(0,-16); c.lineTo(15,-6); c.closePath(); fs(c,PAL.creme,2);
  rr(c,-14,10,28,5,1); fs(c,PAL.creme,2);
  for (let i=-1;i<=1;i++){ rr(c,i*9-2.5,-5,5,15,1); fs(c,'#fff',1.6); }
  circ(c,10,9,7); fs(c,PAL.mostarda,1.8); txt(c,'$',10,9.5,9,PAL.tinta,'center',FD);
}
/* chave inglesa (v8), desenhada: cabo e boca aberta, com contorno; (x,y) é o centro, s a escala, rot em radianos */
function drawWrench(ctx,x,y,s,rot,cor){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot || 0); ctx.scale(s || 1,s || 1); ctx.lineCap = 'butt';
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 6.4; ctx.beginPath(); ctx.moveTo(0,9); ctx.lineTo(0,-2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-6,4.6,-Math.PI/2 + 0.65,-Math.PI/2 - 0.65 + TAU); ctx.stroke();
  ctx.strokeStyle = cor || '#fff'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(0,9); ctx.lineTo(0,-2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-6,4.6,-Math.PI/2 + 0.65,-Math.PI/2 - 0.65 + TAU); ctx.stroke();
  ctx.lineCap = 'round'; circ(ctx,0,9,1.9); ctx.fillStyle = cor || '#fff'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = PAL.tinta; ctx.stroke();
  ctx.restore();
}
