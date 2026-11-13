/* ============================================================
   CENÁRIO
   ============================================================ */
/* o ponto é a Garagem (v7.4)? Muda o piso, a parede, as mesas e as cadeiras */
function garagem(g){ return !!(g && g.ponto && g.ponto.id === 'garagem'); }
/* a área industrial (v9): piso de cimento queimado, parede de tijolinho pintado e o portão de enrolar */
function industrial(g){ return !!(g && g.ponto && g.ponto.id === 'industrial'); }
function drawFloor(ctx,g){
  if (garagem(g)) return drawCimento(ctx);
  if (industrial(g)) return drawCimentoInd(ctx);
  if (avenida(g)) return drawTacoAv(ctx);   // v9.1
  if (terraco(g)) return drawMarmoreTe(ctx);   // v10
  for (let j=0;j<12;j++){
    for (let i=0;i<25;i++){
      const y = 90 + j*40;
      if (y >= 540) continue;
      ctx.fillStyle = (i+j)%2 ? PAL.piso1 : PAL.piso2;
      ctx.fillRect(i*40, y, 40, Math.min(40, 540 - y));
    }
  }
  ctx.strokeStyle = 'rgba(34,32,28,.07)'; ctx.lineWidth = 1;
  for (let i=0;i<=24;i++){ ctx.beginPath(); ctx.moveTo(i*40,90); ctx.lineTo(i*40,540); ctx.stroke(); }
  for (let j=0;j<=11;j++){ const y = 90 + j*40; if (y>540) break; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
}
/* Garagem: cimento queimado, com manchas leves (sempre as mesmas) e as juntas */
function drawCimento(ctx){
  ctx.fillStyle = '#C9C4B9'; ctx.fillRect(0,90,W,450);
  for (let i=0;i<60;i++){
    const x = (i*197.3) % W, y = 100 + (i*131.7) % 430, r = 16 + (i*37) % 34;
    ctx.fillStyle = i % 3 ? 'rgba(255,255,255,.09)' : 'rgba(90,80,66,.07)';
    ell(ctx,x,y,r*1.7,r); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(34,32,28,.15)'; ctx.lineWidth = 1.5;
  for (let x=160;x<W;x+=160){ ctx.beginPath(); ctx.moveTo(x,92); ctx.lineTo(x,540); ctx.stroke(); }
  for (let y=242;y<540;y+=150){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
}
/* Garagem: parede de bloco pintada, janela basculante (com o quintal lá fora) e letreiro feito à mão. O portão de
   enrolar (v7.5) é a parede da esquerda, aberta para a calçada (drawCalcada) */
function drawGaragem(ctx){
  ctx.fillStyle = '#EDE3C8'; ctx.fillRect(0,0,W,92);
  ctx.strokeStyle = 'rgba(34,32,28,.07)'; ctx.lineWidth = 1;
  for (let y=0, r=0; y<82; y+=20, r++){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    for (let x=(r % 2)*30; x<W; x+=60){ ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,Math.min(82,y+20)); ctx.stroke(); }
  }
  ctx.fillStyle = '#B9B09A'; ctx.fillRect(0,82,W,10);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0,82); ctx.lineTo(W,82); ctx.moveTo(0,92); ctx.lineTo(W,92); ctx.stroke();
  // janela basculante: céu e a árvore do quintal, com os vidros em 3 faixas
  const x0 = 116, x1 = 158;
  ctx.fillStyle = '#BFE3F2'; ctx.fillRect(x0,16,x1-x0,48);
  circ(ctx,146,48,11); fs(ctx,'#5FA36B',2); ctx.fillStyle = PAL.madeiraEsc; ctx.fillRect(144,57,4,7);
  ctx.strokeStyle = PAL.cromoEsc; ctx.lineWidth = 3;
  [32,48].forEach(y => { ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo((x0+x1)/2,16); ctx.lineTo((x0+x1)/2,64); ctx.stroke();
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.strokeRect(x0,16,x1-x0,48);
  rr(ctx,x0-6,64,x1-x0+12,6,2); fs(ctx,'#ABA394',1.5);
  // letreiro feito à mão: tábua torta, com pregos e letras pintadas a pincel
  ctx.save(); ctx.translate(232,33); ctx.rotate(-0.035);
  rr(ctx,-68,-22,136,44,3); fs(ctx,'#D9A35E',3);
  ctx.strokeStyle = 'rgba(138,82,38,.35)'; ctx.lineWidth = 1.2;
  [-12,0,13].forEach(y => { ctx.beginPath(); ctx.moveTo(-64,y); ctx.quadraticCurveTo(0,y+3,64,y-1); ctx.stroke(); });
  [[-62,-16],[62,-16],[-62,16],[62,16]].forEach(p => { circ(ctx,p[0],p[1],2); fs(ctx,PAL.cromoEsc,1); });
  txt(ctx,'LANCHES',1,-5,23,PAL.tinta,'center',FD);
  txt(ctx,'LANCHES',0,-6,23,PAL.formica,'center',FD);
  txt(ctx,'da Bia e do Tonhão',0,13,10.5,PAL.tinta,'center',FB);
  ctx.restore();
}
function drawWall(ctx,g,t){
  if (garagem(g)){ drawGaragem(ctx); drawDecorParede(ctx,g); }
  else if (industrial(g)){ drawParedeInd(ctx,g,t); drawDecorParede(ctx,g); }
  else if (avenida(g)){ drawParedeAv(ctx,g,t); drawDecorParede(ctx,g); }
  else if (terraco(g)){ drawParedeTe(ctx,g,t); drawDecorParede(ctx,g); }   // v10
  else drawAzulejo(ctx);
  drawWallCommon(ctx,g,t);
  if (industrial(g) && g.up && g.up.tvs && g.state !== 'menu') drawTvsParede(ctx,g,t);
  drawLuxoParede(ctx,g,t);   // v10.7: o pisca-pisca, a cortina de chita e os quadros
}
/* ============================================================
   ÁREA INDUSTRIAL (v9): cimento queimado cinza (mais escuro e liso que o da Garagem), parede de tijolinho pintado de
   branco, o portão de enrolar aberto em cima da porta, a janela com os galpões e a chaminé ao fundo e o letreiro em placa
   de metal com lâmpadas. As violetas ficam no parapeito da janela
   ============================================================ */
function drawCimentoInd(ctx){
  ctx.fillStyle = '#B3B7BA'; ctx.fillRect(0,90,W,450);
  for (let i=0;i<70;i++){
    const x = (i*211.7) % W, y = 100 + (i*127.3) % 430, r = 14 + (i*41) % 30;
    ctx.fillStyle = i % 3 ? 'rgba(255,255,255,.07)' : 'rgba(40,46,52,.07)';
    ell(ctx,x,y,r*1.6,r); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(34,32,28,.16)'; ctx.lineWidth = 1.5;
  for (let x=190;x<W;x+=190){ ctx.beginPath(); ctx.moveTo(x,92); ctx.lineTo(x,540); ctx.stroke(); }
  for (let y=250;y<540;y+=160){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
}
function drawParedeInd(ctx,g,t){
  ctx.fillStyle = '#F2EFE8'; ctx.fillRect(0,0,W,92);
  ctx.strokeStyle = 'rgba(120,96,84,.2)'; ctx.lineWidth = 1;
  for (let y=0, r=0; y<82; y+=11, r++){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    for (let x=(r % 2)*17; x<W; x+=34){ ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,Math.min(82,y+11)); ctx.stroke(); }
  }
  ctx.fillStyle = '#9CA2A8'; ctx.fillRect(0,82,W,10);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0,82); ctx.lineTo(W,82); ctx.moveTo(0,92); ctx.lineTo(W,92); ctx.stroke();
  // a porta de aço, com o portão de enrolar aberto em cima (o rolo cinza com as ripas) e o aviso ABERTO
  rr(ctx,8,2,80,24,3); fs(ctx,'#8E959C',2.6);
  ctx.strokeStyle = 'rgba(34,32,28,.4)'; ctx.lineWidth = 1.2; for (let y=7;y<24;y+=4){ ctx.beginPath(); ctx.moveTo(10,y); ctx.lineTo(86,y); ctx.stroke(); }
  rr(ctx,14,26,68,64,3); fs(ctx,'#6C737B',2.6);
  rr(ctx,20,32,56,36,2); fs(ctx,'#BFE3F2',2);
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(26,66); ctx.lineTo(36,34); ctx.lineTo(44,34); ctx.lineTo(34,66); ctx.closePath(); ctx.fill();
  rr(ctx,24,72,48,12,3); fs(ctx,PAL.mostarda,2); txt(ctx,'ABERTO',48,78.5,8.5,PAL.tinta,'center',FD,0,42);
  // janela com a vista: céu, galpões e a chaminé com fumaça
  const x0 = 100, x1 = 160;
  ctx.save(); ctx.beginPath(); ctx.rect(x0,14,x1-x0,50); ctx.clip();
  ctx.fillStyle = '#BFE3F2'; ctx.fillRect(x0,14,x1-x0,50);
  ctx.fillStyle = '#A9B3BB'; ctx.fillRect(x0,44,22,20); ctx.fillRect(x0+22,38,22,26); ctx.fillRect(x0+46,46,14,18);
  ctx.fillStyle = '#8B959E'; ctx.beginPath(); ctx.moveTo(x0,44); ctx.lineTo(x0+11,36); ctx.lineTo(x0+22,44); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x0+22,38); ctx.lineTo(x0+33,30); ctx.lineTo(x0+44,38); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#C7523F'; ctx.fillRect(x0+48,22,6,26); ctx.fillStyle = '#F2EFE8'; ctx.fillRect(x0+48,28,6,3);
  const fm = g.state === 'menu' || RM ? 0 : (t * 4) % 12;
  [[x0+51,20-fm*0.3,3.5],[x0+54,15-fm*0.4,4.5],[x0+58,9-fm*0.3,5.5]].forEach((q,i) => { circ(ctx,q[0],q[1],q[2]); ctx.fillStyle = 'rgba(255,255,255,' + (0.75 - i*0.15) + ')'; ctx.fill(); });
  ctx.restore();
  ctx.strokeStyle = PAL.cromoEsc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo((x0+x1)/2,14); ctx.lineTo((x0+x1)/2,64); ctx.moveTo(x0,39); ctx.lineTo(x1,39); ctx.stroke();
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.strokeRect(x0,14,x1-x0,50);
  rr(ctx,x0-5,64,x1-x0+10,6,2); fs(ctx,'#ABA394',1.5);
  if (decorOn(g,'violeta')) drawVioleta(ctx,130,64,0.95);
  // letreiro: placa de metal com rebites e lâmpadas piscando devagar em volta
  rr(ctx,170,8,134,50,5); fs(ctx,'#7C858E',3);
  rr(ctx,176,14,122,38,3); fs(ctx,'#2B3440',2);
  txt(ctx,'LANCHONETE',237,26,10.5,'#E8EEF2','center',FB,0,108);
  txt(ctx,'Corre-Corre',237,41,17,'#FFD36B','center',FD,0,112);
  for (let i=0;i<9;i++){
    const on = RM || g.state === 'menu' ? 1 : (Math.floor(t*2) + i) % 2;
    [[172 + i*16.5,11],[172 + i*16.5,55]].forEach(p => { circ(ctx,p[0],p[1],2.3); ctx.fillStyle = on ? '#FFE9A6' : '#B8A56A'; ctx.fill(); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1; ctx.stroke(); });
  }
}
/* as 3 televisores no alto da parede, abaixo do cartaz, com a notinha musical (v9); instaladas e ligadas pelo modo do dia */
function drawTvsParede(ctx,g,t){
  const modo = g.save.equipe.tvs || 0, jg = modo && g.evento === 'jogo' ? (g.golT > 0 ? 2 : 1) : 0;   // v10.6: no dia de jogo as 3 passam o campo
  [360,480,600].forEach((x,i) => {
    rr(ctx,x-24,52,48,29,3); fs(ctx,'#2A2E36',2);
    rr(ctx,x-21,55,42,23,2); fs(ctx,jg ? '#3E9B4F' : modo ? ['#1E4FA8','#7B4FB5','#C2562B'][i] : '#1B1F27',1);
    if (jg){
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x,55); ctx.lineTo(x,78); ctx.stroke(); circ(ctx,x,66.5,5); ctx.stroke();
      if (jg === 2) txt(ctx,'GOL!',x,66,11,'#FFE066','center',FD,2,38);
      else { const bx = x + (RM ? 5 : Math.sin(t*1.7 + i)*13), by = 66 + (RM ? 3 : Math.sin(t*2.3 + i)*7); circ(ctx,bx,by,2.4); fs(ctx,'#fff',1); }
    } else if (modo){
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(x-21,55); ctx.lineTo(x-8,55); ctx.lineTo(x-21,70); ctx.closePath(); ctx.fill();
      circ(ctx,x-9,66,4); fs(ctx,SKINS[i+1],1); rr(ctx,x-14,69,10,8,2); fs(ctx,'#C2362B',1);
      txt(ctx,modo === 2 ? 'SEM ANÚNCIOS' : 'SERTANEJO',x+6,60,5,'#fff','center',FD,0,34);
      if (modo === 1 && Math.floor(t / 8) % 2) txt(ctx,'ANÚNCIO',x+6,72,6,'#FFD36B','center',FD,0,34);
      else txt(ctx,'♪',x+10,72,10,'#fff','center',FB);
    }
    ctx.fillStyle = PAL.tinta; ctx.fillRect(x-3,81,6,2);
  });
  if (modo && !RM && g.state !== 'menu'){ const q = (t*0.5) % 1; ctx.globalAlpha = 1 - q; txt(ctx,'♪',542 + Math.sin(q*6)*4,50 - q*10,11,PAL.faixa,'center',FB); ctx.globalAlpha = 1; }
}
/* violetas em vasinhos de barro no parapeito (x, y: o pé do vaso do meio) */
function drawVioleta(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  [-14,0,14].forEach((dx,i) => {
    ctx.beginPath(); ctx.moveTo(dx-6,-9); ctx.lineTo(dx+6,-9); ctx.lineTo(dx+4.5,0); ctx.lineTo(dx-4.5,0); ctx.closePath(); fs(ctx,'#C9743F',1.6);
    ell(ctx,dx-4,-11,5,2.6); fs(ctx,'#4E8F4A',1.2); ell(ctx,dx+4,-11,5,2.6); fs(ctx,'#4E8F4A',1.2);
    [[-3,-14],[3,-15],[0,-18]].forEach(q => { circ(ctx,dx+q[0],q[1],2.8); fs(ctx,i === 1 ? '#9B5BD0' : '#7B4FB5',1.2); circ(ctx,dx+q[0],q[1],0.9); ctx.fillStyle = '#F2C94C'; ctx.fill(); });
  });
  ctx.restore();
}
/* antúrio no vaso, no chão: folhas grandes em coração e duas flores vermelhas (x, y: o chão) */
function drawAnturio(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,-1,15,3.5,0.18);
  [[-12,-34,-0.4],[12,-34,0.4],[0,-40,0]].forEach(q => {
    ctx.save(); ctx.translate(q[0]*0.4,-14); ctx.rotate(q[2]); ctx.strokeStyle = '#3E8A47'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(q[0]*0.6,q[1]+14); ctx.stroke();
    ctx.translate(q[0]*0.6,q[1]+14); ctx.beginPath(); ctx.moveTo(0,4); ctx.bezierCurveTo(-11,-2,-7,-13,0,-8); ctx.bezierCurveTo(7,-13,11,-2,0,4); fs(ctx,'#3E8A47',1.4); ctx.restore();
  });
  [[-7,-42],[8,-38]].forEach(q => { ctx.beginPath(); ctx.moveTo(q[0],q[1]+6); ctx.bezierCurveTo(q[0]-9,q[1],q[0]-6,q[1]-10,q[0],q[1]-6); ctx.bezierCurveTo(q[0]+6,q[1]-10,q[0]+9,q[1],q[0],q[1]+6); fs(ctx,'#D8432F',1.4); ctx.strokeStyle = '#F4E2A0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(q[0],q[1]+3); ctx.lineTo(q[0]+1,q[1]-7); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(-11,-16); ctx.lineTo(11,-16); ctx.lineTo(8,-1); ctx.lineTo(-8,-1); ctx.closePath(); fs(ctx,'#B85A30',2);
  rr(ctx,-12,-19,24,5,2); fs(ctx,'#C9673B',1.6);
  ctx.restore();
}
/* jarra de suco: vidro com suco de laranja, tampa e uma torneirinha (x, y: o pé) */
function drawJarraSuco(ctx,x,y,s,nivel){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  const n = nivel == null ? 0.7 : nivel;
  rr(ctx,-13,-46,26,44,7); fs(ctx,'rgba(214,236,246,.85)',2.2);
  ctx.save(); rr(ctx,-11,-44,22,40,5); ctx.clip(); ctx.fillStyle = 'rgba(242,140,40,.85)'; ctx.fillRect(-11,-44 + 40*(1 - n),22,40*n); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-9,-42,3,34); ctx.restore();
  rr(ctx,-10,-52,20,7,3); fs(ctx,PAL.cromo,1.8);
  rr(ctx,10,-14,10,6,2); fs(ctx,PAL.cromoEsc,1.6);
  [[-6,-30],[4,-22],[0,-38]].forEach(q => { ell(ctx,q[0],q[1],4,3); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2; ctx.stroke(); });
  ctx.restore();
}
/* cadeirinha de plástico vermelha e banquinho de madeira, vistos de frente (x, y: o chão) */
function drawCadeirinha(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.fillStyle = '#B7322B';
  rr(ctx,-9,-26,18,12,3); ctx.fill(); ctx.stroke();
  rr(ctx,-10,-15,20,5,2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#8F2520'; ctx.lineWidth = 2.2; [[-8,-10,-9,0],[8,-10,9,0]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0],l[1]); ctx.lineTo(l[2],l[3]); ctx.stroke(); });
  ctx.restore();
}
function drawBanquinho(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 2.6; [[-8,-12,-10,0],[8,-12,10,0]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0],l[1]); ctx.lineTo(l[2],l[3]); ctx.stroke(); });
  ell(ctx,0,-14,11,4.5); fs(ctx,PAL.madeira,2);
  ctx.restore();
}
/* ============================================================
   AVENIDA BRASIL (v9.1): piso de taco de madeira em espinha de peixe, papel de parede creme com meia-parede de azulejo verde-água,
   a porta de vidro, a janela grande com os prédios da avenida e um ipê-amarelo, o letreiro dourado sob o toldo listrado vinho e
   creme e as luminárias pendentes. Na calçada, pedra portuguesa em ondas preto e branco, os sofás da espera, a mesinha das
   águas saborizadas e as flores (tulipas, copos-de-leite e orquídeas)
   ============================================================ */
function avenida(g){ return !!(g && g.ponto && g.ponto.id === 'avenida'); }
let TACO_AV = null;   // o piso pintado uma vez só, num canvas à parte
function pintaTaco(c){
  const tons = ['#B98A5A', '#C49A68', '#AD7F50', '#BF9262'];
  c.fillStyle = '#9C6F43'; c.fillRect(0,90,W,450);
  const s = 14;
  for (let iy = 0; iy * s < 470; iy++){
    for (let ix = 0; ix * s < W + 20; ix++){
      const cx = ix * s + (iy % 2) * s / 2, cy = 90 + iy * s, d = (ix + iy) % 2 ? 1 : -1;
      c.save(); c.translate(cx,cy); c.rotate(d * Math.PI / 4);
      c.fillStyle = tons[(ix * 7 + iy * 3 + (ix * iy) % 5) % tons.length]; c.fillRect(-11,-3.4,22,6.8);
      c.strokeStyle = 'rgba(60,35,15,.38)'; c.lineWidth = 0.8; c.strokeRect(-11,-3.4,22,6.8);
      c.restore();
    }
  }
  c.fillStyle = 'rgba(255,240,210,.06)'; for (let i = 0; i < 40; i++){ ell(c,(i * 173) % W,100 + (i * 97) % 430,60,26); c.fill(); }   // um brilho de cera
}
function drawTacoAv(ctx){
  if (TACO_AV === null){
    try { const cv = document.createElement('canvas'); cv.width = W; cv.height = 450; const c = cv.getContext('2d'); c.translate(0,-90); c.beginPath(); c.rect(0,90,W,450); c.clip(); pintaTaco(c); TACO_AV = cv; } catch(e) { TACO_AV = 0; }
  }
  ctx.save(); ctx.beginPath(); ctx.rect(0,90,W,450); ctx.clip();
  if (TACO_AV) ctx.drawImage(TACO_AV,0,90); else pintaTaco(ctx);
  ctx.restore();
}
/* ipê-amarelo da avenida: tronco fino, copa de flores amarelas e pétalas no chão (x, y: o pé) */
function drawIpe(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  ctx.strokeStyle = '#6B4A2B'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(1,-20); ctx.moveTo(1,-14); ctx.lineTo(-8,-26); ctx.moveTo(1,-16); ctx.lineTo(9,-27); ctx.stroke();
  [[-9,-30,9,'#E9B418'],[9,-31,9,'#F2C230'],[0,-37,10,'#F7D24A'],[-3,-27,7,'#F2C230'],[7,-24,6,'#E9B418']].forEach(c => { circ(ctx,c[0],c[1],c[2]); ctx.fillStyle = c[3]; ctx.fill(); });
  ctx.fillStyle = '#F7D24A'; [[-14,-1],[-8,1],[4,0],[11,-2]].forEach(p => { circ(ctx,p[0],p[1],1.4); ctx.fill(); });
  ctx.restore();
}
/* luminária pendente: fio, cúpula de latão e a luz quente embaixo (x: o fio; y: a ponta do fio) */
function drawPendente(ctx,x,y,s,t,menu){
  ctx.save(); ctx.translate(x,0);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-5*s,y); ctx.lineTo(5*s,y); ctx.lineTo(11*s,y + 12*s); ctx.lineTo(-11*s,y + 12*s); ctx.closePath(); fs(ctx,'#C9953A',1.8);
  ell(ctx,0,y + 13*s,8*s,2.6*s); ctx.fillStyle = '#FFE9A6'; ctx.fill();
  ctx.fillStyle = 'rgba(255,226,150,.16)'; ctx.beginPath(); ctx.moveTo(-9*s,y + 14*s); ctx.lineTo(9*s,y + 14*s); ctx.lineTo(22*s,92); ctx.lineTo(-22*s,92); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawParedeAv(ctx,g,t){
  // papel de parede creme com listras finas e a meia-parede de azulejo verde-água
  ctx.fillStyle = '#F3E9D2'; ctx.fillRect(0,0,W,92);
  ctx.strokeStyle = 'rgba(160,120,70,.16)'; ctx.lineWidth = 3; for (let x=10;x<W;x+=22){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,56); ctx.stroke(); }
  ctx.fillStyle = '#9ED3C4'; ctx.fillRect(0,58,W,24);
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1;
  for (let x=0;x<=W;x+=24){ ctx.beginPath(); ctx.moveTo(x,58); ctx.lineTo(x,82); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0,70); ctx.lineTo(W,70); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.22)'; for (let x=3;x<W;x+=48) ctx.fillRect(x,60,8,8);
  ctx.fillStyle = '#8A5A33'; ctx.fillRect(0,55,W,5);
  ctx.fillStyle = '#6B4426'; ctx.fillRect(0,82,W,10);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0,55); ctx.lineTo(W,55); ctx.moveTo(0,82); ctx.lineTo(W,82); ctx.moveTo(0,92); ctx.lineTo(W,92); ctx.stroke();
  // a porta de vidro com moldura de madeira, maçaneta de latão e o aviso ABERTO
  rr(ctx,10,4,84,88,4); fs(ctx,'#5B3A21',3);
  rr(ctx,17,11,70,52,3); fs(ctx,'#BFE3F2',2);
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(24,60); ctx.lineTo(37,14); ctx.lineTo(46,14); ctx.lineTo(33,60); ctx.closePath(); ctx.fill();
  rr(ctx,17,66,70,20,3); fs(ctx,'#7A5230',2);
  circ(ctx,78,70,3.2); fs(ctx,'#D9A93A',1.6);
  rr(ctx,30,67,44,11,3); fs(ctx,PAL.mostarda,2); txt(ctx,'ABERTO',52,73,8.5,PAL.tinta,'center',FD,0,38);
  // a janela grande com os prédios da avenida e o ipê-amarelo
  const x0 = 104, x1 = 176;
  ctx.save(); ctx.beginPath(); ctx.rect(x0,10,x1-x0,52); ctx.clip();
  ctx.fillStyle = '#BFE3F2'; ctx.fillRect(x0,10,x1-x0,52);
  [[x0,34,16,28,'#C9BFAE'],[x0+14,24,18,38,'#B3A89A'],[x0+30,38,14,24,'#D6CBB8'],[x0+42,28,16,34,'#BDB1A0']].forEach(b => {
    ctx.fillStyle = b[4]; ctx.fillRect(b[0],b[1],b[2],b[3]);
    ctx.fillStyle = 'rgba(70,90,110,.55)'; for (let yy=b[1]+4;yy<b[1]+b[3]-4;yy+=7) for (let xx=b[0]+3;xx<b[0]+b[2]-3;xx+=6) ctx.fillRect(xx,yy,3,4);
  });
  drawIpe(ctx,x1-12,62,0.95);
  ctx.restore();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo((x0+x1)/2,10); ctx.lineTo((x0+x1)/2,62); ctx.moveTo(x0,36); ctx.lineTo(x1,36); ctx.stroke();
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.strokeRect(x0,10,x1-x0,52);
  rr(ctx,x0-5,62,x1-x0+10,6,2); fs(ctx,'#E6DCC4',1.5);
  if (decorOn(g,'violeta')) drawVioleta(ctx,(x0+x1)/2,62,0.95);
  // o letreiro dourado sobre o toldo listrado vinho e creme
  const ax0 = 184, ax1 = 300, n = 8, aw = (ax1 - ax0) / n;
  for (let i=0;i<n;i++){
    ctx.beginPath(); ctx.moveTo(ax0 + i*aw,3); ctx.lineTo(ax0 + (i+1)*aw,3); ctx.lineTo(ax0 + (i+1)*aw,20); ctx.quadraticCurveTo(ax0 + (i+0.5)*aw,29,ax0 + i*aw,20); ctx.closePath();
    fs(ctx,i % 2 ? '#F6EBD3' : '#7A1F3A',1.8);
  }
  rr(ctx,ax0+4,28,ax1-ax0-8,29,4); fs(ctx,'#2A1A1F',2.4);
  ctx.strokeStyle = '#D9A93A'; ctx.lineWidth = 1.4; rr(ctx,ax0+7,30.5,ax1-ax0-14,24,3); ctx.stroke();
  txt(ctx,'Corre-Corre',(ax0+ax1)/2,40,15,'#F2C94C','center',FD,0,100);
  txt(ctx,'· RESTAURANTE ·',(ax0+ax1)/2,52,6.5,'#F6EBD3','center',FB,0,92);
  // as luminárias pendentes (nos vãos entre o cartaz, o relógio e a placa da cozinha)
  drawPendente(ctx,664,22,0.8,t,g.state === 'menu');
  drawPendente(ctx,763,26,0.9,t,g.state === 'menu');
  if (g.seloOn && g.state !== 'menu') drawSeloVig(ctx,356,70);   // v9.4
}
/* selo "Aprovado pela vigilância" (v9.4), na meia-parede de azulejo */
function drawSeloVig(ctx,x,y){
  rr(ctx,x-38,y-13,76,26,5); fs(ctx,'#FFFDF5',2);
  ctx.strokeStyle = PAL.ok; ctx.lineWidth = 1.4; rr(ctx,x-35,y-10,70,20,3.5); ctx.stroke();
  circ(ctx,x-24,y,8); fs(ctx,PAL.ok,1.4);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x-28,y); ctx.lineTo(x-25,y+3.5); ctx.lineTo(x-20,y-3.5); ctx.stroke();
  txt(ctx,'VIGILÂNCIA',x+8,y-3.5,7,PAL.tinta,'center',FD,0,46);
  txt(ctx,'Aprovado',x+8,y+5.5,7.5,PAL.ok,'center',FD,0,46);
}
/* o fiscal da vigilância (v9.4): colete azul-claro com "VIGILÂNCIA", prancheta e caneta; as falhas viram ícones em cima dele */
function drawFiscal(ctx,f,tm){
  drawPerson(ctx,f.look,f.x,f.y,{ shirt:'#F4F1E8', moving:f.moving, ph:f.walkPh, mood:0, t:tm });
  const bob = (f.moving && !RM) ? -Math.abs(Math.sin(f.walkPh)) * 2.4 : 0;
  ctx.beginPath(); ctx.moveTo(f.x-8,f.y-30+bob); ctx.lineTo(f.x+8,f.y-30+bob); ctx.lineTo(f.x+11,f.y-12); ctx.lineTo(f.x-11,f.y-12); ctx.closePath(); fs(ctx,'#9FD3EE',2.2);
  ctx.fillStyle = '#fff'; ctx.fillRect(f.x-9.5,f.y-20+bob,19,2.2);
  rr(ctx,f.x+9,f.y-36+bob,13,17,2); fs(ctx,'#8A5A33',1.6);
  rr(ctx,f.x+11,f.y-33+bob,9,12,1); fs(ctx,'#fff',1);
  ctx.strokeStyle = '#2C5AA0'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(f.x+12.5,f.y-29+bob); ctx.lineTo(f.x+18.5,f.y-29+bob); ctx.moveTo(f.x+12.5,f.y-26+bob); ctx.lineTo(f.x+18.5,f.y-26+bob); ctx.stroke();
  rr(ctx,f.x-31,f.y-84,62,12,5); fs(ctx,'#fff',1.6); txt(ctx,'VIGILÂNCIA',f.x,f.y-77.5,8,'#2C6E9B','center',FD,0,56);
  ['suja','lixo','pia'].filter(k => f.falhas[k]).forEach((k,i,l) => {
    const ix = f.x + (i - (l.length - 1) / 2) * 24, iy = f.y - 102 + (RM ? 0 : Math.sin(tm * 6 + i) * 1.5);
    circ(ctx,ix,iy,10); fs(ctx,'#fff',2); ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 2; ctx.stroke();
    if (k === 'suja'){ rr(ctx,ix-6,iy-3,12,6,2); fs(ctx,PAL.madeira,1.2); ell(ctx,ix+1,iy-0.5,2.6,1.6); fs(ctx,'#5B3A21',0.8); }
    else if (k === 'lixo'){ ctx.beginPath(); ctx.moveTo(ix-4,iy-2); ctx.lineTo(ix+4,iy-2); ctx.lineTo(ix+3,iy+5); ctx.lineTo(ix-3,iy+5); ctx.closePath(); fs(ctx,'#8E99A6',1.2); ctx.fillStyle = '#B9C2CC'; ctx.fillRect(ix-5,iy-4.5,10,2.2); }
    else { ell(ctx,ix,iy+3,5.5,1.8); fs(ctx,'#E6DCC4',1); ell(ctx,ix,iy,5.5,1.8); fs(ctx,'#fff',1); ell(ctx,ix,iy-3,5.5,1.8); fs(ctx,'#E6DCC4',1); }
  });
}
/* pedra portuguesa em ondas preto e branco (a calçada da Avenida; x0: onde o piso começa) */
function drawPedraPort(ctx,x0){
  ctx.fillStyle = '#EDE9DD'; ctx.fillRect(x0,0,-x0,540);
  ctx.save(); ctx.beginPath(); ctx.rect(x0,0,-x0,540); ctx.clip();
  ctx.strokeStyle = '#2A2A2E'; ctx.lineWidth = 9; ctx.lineCap = 'butt';
  for (let y0=122;y0<580;y0+=36){
    ctx.beginPath();
    for (let x=x0;x<=0;x+=6){ const y = y0 + 9*Math.sin((x - x0) / 15 + y0 * 0.05); if (x === x0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }
    ctx.stroke();
  }
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(120,114,100,.35)'; ctx.lineWidth = 0.8;
  for (let x=x0;x<=0;x+=9){ ctx.beginPath(); ctx.moveTo(x,92); ctx.lineTo(x,540); ctx.stroke(); }
  for (let y=96;y<540;y+=9){ ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(0,y); ctx.stroke(); }
  ctx.restore();
}
/* o sofá da espera: um estofado verde-musgo de 3 lugares (3 grupos), com braços dos lados, costas e as almofadas coloridas
   (x: o meio; yTop e yBot: onde ele começa e termina; seams: os y das divisões entre os lugares) */
function drawSofaAv(ctx,x,yTop,yBot,seams,idx){
  const w = 150, h = yBot - yTop;
  shadowEll(ctx,x,yBot + 2,w/2 - 2,7,0.2);
  rr(ctx,x - w/2,yTop,w,h,12); fs(ctx,'#4C683F',2.4);   // o corpo (as costas)
  rr(ctx,x - w/2 + 9,yTop + 14,w - 18,h - 20,9); fs(ctx,'#6E8E5B',2);   // o assento
  ctx.strokeStyle = 'rgba(30,45,25,.5)'; ctx.lineWidth = 1.6;
  seams.forEach(y => { ctx.beginPath(); ctx.moveTo(x - w/2 + 12,y); ctx.lineTo(x + w/2 - 12,y); ctx.stroke(); });
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x - w/2 + 14,yTop + 18,6,h - 28);
  rr(ctx,x - w/2 - 2,yTop + 8,13,h - 10,6); fs(ctx,'#58774A',2);   // os braços
  rr(ctx,x + w/2 - 11,yTop + 8,13,h - 10,6); fs(ctx,'#58774A',2);
  [['#E8B43A',-1],['#D9644A',1],['#F4E8D0',-1]].forEach((c,i) => {   // almofadas
    const py = yTop + 24 + (i * (h - 48) / 2);
    ctx.save(); ctx.translate(x + c[1] * (w/2 - 22),py); ctx.rotate(c[1] * 0.18); rr(ctx,-8,-8,16,16,4); fs(ctx,c[0],1.6); ctx.restore();
  });
}
/* a mesinha das águas saborizadas (a melhoria `maquina` da Avenida): mesa redonda de madeira com 3 garrafas de vidro (limão, morango
   e hortelã) e copos; a bolinha verde diz quantos copos pediram */
function drawGarrafa(ctx,x,y,cor,sabor){
  rr(ctx,x-5,y-27,10,27,3); fs(ctx,'rgba(214,236,246,.85)',1.8);
  ctx.save(); rr(ctx,x-4,y-26,8,25,2); ctx.clip(); ctx.fillStyle = cor; ctx.fillRect(x-4,y-20,8,19); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x-3,y-19,1.8,16); ctx.restore();
  rr(ctx,x-2.2,y-33,4.4,7,1.5); fs(ctx,PAL.cromo,1.4);
  if (sabor === 0){ circ(ctx,x,y-12,2.8); fs(ctx,'#F2E04A',1); }
  else if (sabor === 1){ ctx.beginPath(); ctx.moveTo(x-2.6,y-14); ctx.bezierCurveTo(x-3.4,y-9,x,y-8,x,y-8); ctx.bezierCurveTo(x,y-8,x+3.4,y-9,x+2.6,y-14); ctx.closePath(); fs(ctx,'#D8334A',1); }
  else { ell(ctx,x,y-11,3.2,1.6); fs(ctx,'#3E9B5A',1); }
}
/* v9.6.9: os números dos lugares da espera, por cima de quem espera (os de pé, no chão, ficam no cenário) */
function drawLugarNums(ctx,g){
  const ponto = g && g.ponto ? g.ponto : PONTOS[0], sent = !!(g && g.sentado);
  if (ponto.assento === 'pe' && !sent && !terraco(g)) return;   // v10: o foyer do Terraço também numera os tapetes de quem espera de pé
  for (let i=0;i<ponto.espera;i++){ const x = QUEUE.x, y = QUEUE.ys[i]; circ(ctx,x-62,y-26,9); fs(ctx,'#fff',1.8); txt(ctx,String(i+1),x-62,y-25.5,11,PAL.faixa,'center',FD); }
}
function drawAguasEspera(ctx,g,t,menu){
  const r = STATIONS.maquina.rect, x = r.x + r.w / 2, y = r.y + r.h;
  shadowEll(ctx,x,y-2,32,6,0.2);
  ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 3; [[-12,-22,-14,-2],[12,-22,14,-2],[0,-22,0,-1]].forEach(l => { ctx.beginPath(); ctx.moveTo(x+l[0],y+l[1]); ctx.lineTo(x+l[2],y+l[3]); ctx.stroke(); });
  ell(ctx,x,y-24,28,8); fs(ctx,PAL.madeira,2.2);   // o tampo redondo
  const prep = !menu && g.maq.some(o => o.t > 0), pr = menu ? 0 : g.maqPronto().reduce((a,o) => a + o.n, 0);
  SABORES.forEach((s,i) => drawGarrafa(ctx,x - 15 + i*13,y - 24 + (i === 1 ? 2 : 0) - (prep && !RM ? Math.abs(Math.sin(t*5 + i)) * 1.5 : 0),s.cor,i));
  for (let i=0;i<3;i++){ const cx = x - 9 + i*9; rr(ctx,cx-3,y-26,6,8,1.5); fs(ctx,i < pr ? SABORES[i].cor : 'rgba(214,236,246,.9)',1.2); }
  if (menu) return;
  if (pr){
    const p = RM ? 1 : 1 + 0.08 * Math.sin(t*7);
    ctx.save(); ctx.translate(x+28,y-50); ctx.scale(p,p); circ(ctx,0,0,11); fs(ctx,PAL.ok,2); txt(ctx,String(pr),0,1,13,'#fff','center',FD); ctx.restore();
  }
  const a0 = g.bia.acts[0];
  if (a0 && a0.type === 'maquina' && a0.leg !== 2){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
/* as flores da calçada (x, y: o chão): tulipas numa jardineira, copos-de-leite num vaso alto e orquídeas numa mesinha */
function drawTulipas(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,2,36,5,0.18);
  const cores = ['#E2457A','#F2B33D','#F4E8D0','#C2362B','#9B5BD0','#F28AA8','#F2B33D'];
  for (let i=0;i<7;i++){
    const px = -27 + i*9, ph = 22 + (i*5) % 8;
    ctx.strokeStyle = '#3E8A47'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(px,-12); ctx.lineTo(px + (i%2 ? 1 : -1),-ph); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - 4.2,-ph - 1); ctx.quadraticCurveTo(px - 4.6,-ph - 10,px - 1.6,-ph - 9); ctx.lineTo(px,-ph - 5); ctx.lineTo(px + 1.6,-ph - 9); ctx.quadraticCurveTo(px + 4.6,-ph - 10,px + 4.2,-ph - 1); ctx.closePath(); fs(ctx,cores[i],1.2);
    ctx.fillStyle = '#4E8F4A'; ell(ctx,px + 3,-14,5,1.8); ctx.fill();
  }
  rr(ctx,-34,-14,68,14,3); fs(ctx,'#8A5A33',2);
  ctx.strokeStyle = 'rgba(34,32,28,.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-34,-8); ctx.lineTo(34,-8); ctx.stroke();
  ctx.restore();
}
function drawCopoLeite(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,1,15,4,0.18);
  [[-9,-52,-0.3],[0,-62,0],[9,-50,0.3]].forEach(f => {
    ctx.strokeStyle = '#3E8A47'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f[2]*12,-30); ctx.lineTo(f[0],f[1] + 6); ctx.stroke();
    ctx.save(); ctx.translate(f[0],f[1]); ctx.rotate(f[2]);
    ctx.beginPath(); ctx.moveTo(0,8); ctx.bezierCurveTo(-11,3,-8,-11,0,-9); ctx.bezierCurveTo(8,-11,11,3,0,8); ctx.closePath(); fs(ctx,'#FFFDF4',1.5);
    ctx.fillStyle = '#F2C94C'; ctx.fillRect(-0.9,-1,1.8,8); ctx.restore();
  });
  ctx.fillStyle = '#4E8F4A'; [[-6,-26,-0.6],[6,-28,0.6]].forEach(l => { ctx.save(); ctx.translate(l[0],l[1]); ctx.rotate(l[2]); ell(ctx,0,0,3,10); ctx.fill(); ctx.restore(); });
  ctx.beginPath(); ctx.moveTo(-11,-34); ctx.lineTo(11,-34); ctx.lineTo(8,0); ctx.lineTo(-8,0); ctx.closePath(); fs(ctx,'#F4F1E8',2);   // o vaso alto, branco
  rr(ctx,-12,-37,24,5,2); fs(ctx,'#E3DECF',1.6);
  ctx.restore();
}
function drawOrquidea(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,1,17,4,0.18);
  ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 2.6; [[-10,-26,-12,0],[10,-26,12,0]].forEach(l => { ctx.beginPath(); ctx.moveTo(l[0],l[1]); ctx.lineTo(l[2],l[3]); ctx.stroke(); });
  ell(ctx,0,-27,17,5); fs(ctx,PAL.madeira,2);   // a mesinha
  rr(ctx,-7,-38,14,11,3); fs(ctx,'#F4F1E8',1.8);   // o vaso
  ctx.fillStyle = '#4E8F4A'; [[-6,-39,-0.5],[6,-39,0.5]].forEach(l => { ctx.save(); ctx.translate(l[0],l[1]); ctx.rotate(l[2]); ell(ctx,0,0,2.6,9); ctx.fill(); ctx.restore(); });
  ctx.strokeStyle = '#4E8F4A'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0,-38); ctx.quadraticCurveTo(-3,-52,5,-62); ctx.stroke();
  [[5,-62],[2,-55],[-1,-48]].forEach((q,i) => { for (let k=0;k<5;k++){ const a = k*TAU/5 + i; ctx.save(); ctx.translate(q[0],q[1]); ctx.rotate(a); ell(ctx,0,-4.2,2.4,4); ctx.fillStyle = i === 1 ? '#D78AD9' : '#B766C9'; ctx.fill(); ctx.restore(); } circ(ctx,q[0],q[1],1.7); fs(ctx,'#F4E8A0',0.8); });
  ctx.restore();
}
/* ============================================================
   TERRAÇO SUÍÇA (v10): piso de mármore claro em placas grandes (veio suave e friso escuro), parede com o janelão de ponta a ponta
   sobre a cidade lá embaixo (céu de fim de tarde), cortinas presas dos lados, colunas finas, lambri de nogueira, porta de duas
   folhas e pendentes dourados. A calçada vira o foyer do andar: carpete azul-petróleo com borda dourada, lambri com arandelas,
   o letreiro "Terraço Suíça", a plaquinha "Cobertura" e a porta do elevador, por onde a freguesia chega e sai (DOOR). A espera:
   tapetes redondos numerados ou, com as poltronas compradas, uma ilha de 4 poltronas de veludo por lugar. O piano de cauda
   (TERRACO.piano) é obstáculo fixo e fica no canto de baixo à esquerda do salão
   ============================================================ */
function terraco(g){ return !!(g && g.ponto && g.ponto.id === 'terraco'); }
const TE_OURO = '#C9953A', TE_OURO_CL = '#E8C46A';
let MARMORE_TE = null;   // o piso pintado uma vez só, num canvas à parte
function pintaMarmore(c){
  c.fillStyle = '#E9E4D9'; c.fillRect(0,90,W,450);
  const sw = 150, sh = 112, claros = ['#EDE8DE', '#E6E1D5', '#F1ECE2', '#E3DED2'];
  for (let iy = 0; iy * sh < 470; iy++){
    for (let ix = 0; ix * sw < W + sw; ix++){
      const x = ix * sw - (iy % 2) * sw / 2, y = 90 + iy * sh;
      c.fillStyle = claros[(ix * 5 + iy * 3) % 4]; c.fillRect(x,y,sw,sh);
      c.strokeStyle = 'rgba(120,112,100,.17)'; c.lineWidth = 1.2;
      for (let v = 0; v < 3; v++){   // o veio: curvas suaves que atravessam a placa
        const sx = x + ((ix * 37 + iy * 11 + v * 53) % sw), a = ((ix * 13 + iy * 7 + v * 5) % 10) / 10 - 0.5;
        c.beginPath(); c.moveTo(sx,y); c.bezierCurveTo(sx + 40 * a,y + sh * 0.3,sx - 50 * a,y + sh * 0.6,sx + 30 * a,y + sh); c.stroke();
      }
      c.strokeStyle = 'rgba(80,72,64,.3)'; c.lineWidth = 1.4; c.strokeRect(x,y,sw,sh);
    }
  }
  c.fillStyle = 'rgba(255,255,255,.2)'; for (let i = 0; i < 30; i++){ ell(c,(i * 191) % W,100 + (i * 83) % 430,70,22); c.fill(); }   // o brilho do mármore polido
  c.strokeStyle = '#4A433C'; c.lineWidth = 5; c.strokeRect(10,100,W - 20,432);   // o friso escuro em volta do salão, com o fio dourado
  c.strokeStyle = TE_OURO; c.lineWidth = 1.2; c.strokeRect(16,106,W - 32,420);
}
function drawMarmoreTe(ctx){
  if (MARMORE_TE === null){
    try { const cv = document.createElement('canvas'); cv.width = W; cv.height = 450; const c = cv.getContext('2d'); c.translate(0,-90); c.beginPath(); c.rect(0,90,W,450); c.clip(); pintaMarmore(c); MARMORE_TE = cv; } catch(e) { MARMORE_TE = 0; }
  }
  ctx.save(); ctx.beginPath(); ctx.rect(0,90,W,450); ctx.clip();
  if (MARMORE_TE) ctx.drawImage(MARMORE_TE,0,90); else pintaMarmore(ctx);
  ctx.restore();
}
/* a cidade vista do alto: céu em degradê, o sol baixo, morros ao longe e as torres com as janelas acesas (clipado na janela) */
function drawVistaTe(ctx,x0,y0,x1,y1,noite){
  ctx.save(); ctx.beginPath(); ctx.rect(x0,y0,x1 - x0,y1 - y0); ctx.clip();
  const sk = ctx.createLinearGradient(0,y0,0,y1);
  if (noite){ sk.addColorStop(0,'#0E1330'); sk.addColorStop(0.6,'#1E2A4A'); sk.addColorStop(1,'#3A3F6E'); } else { sk.addColorStop(0,'#5E78B8'); sk.addColorStop(0.5,'#E9A0A0'); sk.addColorStop(1,'#FAD79B'); }
  ctx.fillStyle = sk; ctx.fillRect(x0,y0,x1 - x0,y1 - y0);
  if (noite){   // v10.10, a noite da estrela: a lua e as estrelinhas (paradas)
    circ(ctx,x0 + 470,y0 + 16,9); ctx.fillStyle = 'rgba(250,240,200,.95)'; ctx.fill(); circ(ctx,x0 + 474,y0 + 14,8); ctx.fillStyle = '#0E1330'; ctx.fill();
    ctx.fillStyle = 'rgba(255,248,214,.9)'; for (let i = 0; i < 46; i++){ const sx = x0 + (i * 97) % (x1 - x0), sy = y0 + 3 + (i * 53) % Math.max(10,(y1 - y0) * 0.6); ctx.fillRect(sx,sy,i % 5 ? 1.2 : 2,i % 5 ? 1.2 : 2); }
  } else {
  circ(ctx,x0 + 470,y1 - 8,15); ctx.fillStyle = 'rgba(255,238,176,.9)'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; [[x0 + 90,y0 + 14,26],[x0 + 330,y0 + 22,20],[x0 + 590,y0 + 12,30]].forEach(c => { ell(ctx,c[0],c[1],c[2],4); ctx.fill(); ell(ctx,c[0] + 10,c[1] - 3,c[2] * 0.6,3.4); ctx.fill(); });
  }
  [[noite ? '#2C3156' : '#9486B0',y1 - 14,6,47,4,19],[noite ? '#232848' : '#6F6893',y1 - 10,5,31,3,13]].forEach(h => {   // os morros ao longe, em duas camadas
    ctx.beginPath(); ctx.moveTo(x0,y1);
    for (let x = x0; x <= x1; x += 8) ctx.lineTo(x,h[1] - h[2] * Math.sin(x / h[3]) - h[4] * Math.sin(x / h[5] + 1));
    ctx.lineTo(x1,y1); ctx.closePath(); ctx.fillStyle = h[0]; ctx.fill();
  });
  for (let i = 0, x = x0; x < x1; i++){   // as torres, de larguras e alturas variadas; algumas com janelas acesas e uma antena
    const w = 7 + (i * 7) % 9, h = 7 + (i * 13) % 19, y = y1 - h;
    ctx.fillStyle = i % 4 ? '#3E4466' : '#4C5378'; ctx.fillRect(x,y,w,h);
    ctx.fillStyle = '#F6D472'; for (let k = 0; k < 3; k++) if (noite || (i * 5 + k * 3) % 4 < 2) ctx.fillRect(x + 1.5 + (k % 2) * 3.5,y + 3 + Math.floor(k / 2) * 5 + (k % 3) * 2,2,2.4);
    if (i % 9 === 4){ ctx.fillStyle = '#3E4466'; ctx.fillRect(x + w / 2 - 0.6,y - 6,1.2,6); }
    x += w + 1;
  }
  ctx.restore();
}
/* v10.10, a noite da estrela: a vela acesa na mesa (a chama balança; parada com prefers-reduced-motion) */
function drawVela(ctx,x,y,tm){
  const fl = RM ? 0 : Math.sin(tm * 9 + x) * 0.8;
  circ(ctx,x,y - 12,12); ctx.fillStyle = 'rgba(255,205,110,.2)'; ctx.fill();
  rr(ctx,x - 3,y - 9,6,9,1.5); fs(ctx,'#F3EAD0',1.6);
  ctx.beginPath(); ctx.moveTo(x + fl * 0.3,y - 20); ctx.quadraticCurveTo(x + 3.2 + fl,y - 14,x,y - 10.5); ctx.quadraticCurveTo(x - 3.2 + fl,y - 14,x + fl * 0.3,y - 20); ctx.closePath(); fs(ctx,'#F29A2E',1);
  ctx.beginPath(); ctx.arc(x + fl * 0.2,y - 13,1.4,0,TAU); ctx.fillStyle = '#FFF1B0'; ctx.fill();
}
/* v10.10: o balão curto de fala em cima da cabeça (só o Bráulio), com o nome em cima; some no último pedaço de segundo */
function drawFala(ctx,grp,x,y){
  const f = grp.fala; if (!f) return;
  const w = Math.max(48,f.txt.length * 7.4 + 20);
  ctx.save(); ctx.globalAlpha = clamp(f.t / 0.35,0,1);
  rr(ctx,x - w / 2,y - 13,w,26,9); fs(ctx,'#fff',2.2);
  ctx.beginPath(); ctx.moveTo(x - 5,y + 12); ctx.lineTo(x,y + 20); ctx.lineTo(x + 5,y + 12); ctx.closePath(); fs(ctx,'#fff',2);
  ctx.fillStyle = '#fff'; ctx.fillRect(x - 4,y + 11,8,3);
  txt(ctx,f.txt,x,y + 1,14,PAL.tinta,'center',FD);
  txt(ctx,'Bráulio',x,y - 24,12,'#FFE9A8','center',FD,3);
  ctx.restore();
}
/* cortina presa de lado (side: -1 esquerda, 1 direita): o pano em dobras caindo da cortina e o laço dourado */
function drawCortinaTe(ctx,xBorda,side,y0,y1){
  const w = 28, a = xBorda, b = xBorda + side * w;
  ctx.beginPath(); ctx.moveTo(a,y0); ctx.lineTo(b,y0); ctx.bezierCurveTo(b - side * 2,y0 + 20,b - side * 8,y0 + 30,b - side * 6,y0 + 38);
  ctx.bezierCurveTo(b - side * 5,y0 + 46,b - side * 1,y1 - 6,b,y1); ctx.lineTo(a,y1); ctx.closePath(); fs(ctx,'#7A2E45',2);
  ctx.strokeStyle = 'rgba(40,10,22,.35)'; ctx.lineWidth = 1.3;
  [0.25,0.5,0.75].forEach(k => { ctx.beginPath(); ctx.moveTo(a + side * w * k * 0.8,y0 + 2); ctx.quadraticCurveTo(a + side * w * k * 0.9,y0 + 34,a + side * w * k * 0.7,y1 - 2); ctx.stroke(); });
  ctx.strokeStyle = TE_OURO; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(a,y0 + 34); ctx.quadraticCurveTo(a + side * w * 0.5,y0 + 40,b - side * 6,y0 + 36); ctx.stroke();   // o laço
  circ(ctx,b - side * 6,y0 + 36,2.6); fs(ctx,TE_OURO_CL,1);
}
function drawParedeTe(ctx,g,t){
  const menu = g.state === 'menu';
  ctx.fillStyle = '#EFE6D2'; ctx.fillRect(0,0,W,92);
  ctx.strokeStyle = 'rgba(190,160,100,.16)'; ctx.lineWidth = 2; for (let x = 6; x < W; x += 18){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,66); ctx.stroke(); }
  // o lambri de nogueira (de 66 a 92), com o friso dourado em cima e os painéis
  ctx.fillStyle = '#5B3A26'; ctx.fillRect(0,66,W,26);
  ctx.strokeStyle = '#7A5236'; ctx.lineWidth = 1.4; for (let x = 4; x < W; x += 44){ rr(ctx,x,71,38,16,3); ctx.stroke(); }
  ctx.fillStyle = TE_OURO; ctx.fillRect(0,66,W,3);
  // o janelão de ponta a ponta, com a cidade lá embaixo
  const wx0 = 104, wx1 = 772, wy0 = 8, wy1 = 62;
  drawVistaTe(ctx,wx0,wy0,wx1,wy1,!!g.noite && !menu);   // v10.10: de noite, o céu escuro com estrelas e os prédios de janelas acesas
  ctx.strokeStyle = '#4A3628'; ctx.lineWidth = 3; for (let k = 1; k <= 5; k++){ const x = wx0 + (wx1 - wx0) * k / 6; ctx.beginPath(); ctx.moveTo(x,wy0); ctx.lineTo(x,wy1); ctx.stroke(); }   // as colunas finas
  ctx.strokeStyle = TE_OURO; ctx.lineWidth = 0.8; for (let k = 1; k <= 5; k++){ const x = wx0 + (wx1 - wx0) * k / 6 - 0.8; ctx.beginPath(); ctx.moveTo(x,wy0); ctx.lineTo(x,wy1); ctx.stroke(); }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.strokeRect(wx0,wy0,wx1 - wx0,wy1 - wy0);
  rr(ctx,wx0 - 6,62,wx1 - wx0 + 12,6,2); fs(ctx,'#E8DFC8',1.5);
  [[96,'#F4EFE4'],[772,'#F4EFE4']].forEach(c => { rr(ctx,c[0],4,8,62,1.5); fs(ctx,c[1],1.6); rr(ctx,c[0] - 2,2,12,5,1.5); fs(ctx,'#E6DCC4',1.4); rr(ctx,c[0] - 2,62,12,5,1.5); fs(ctx,'#E6DCC4',1.4); });   // as colunas dos cantos
  rr(ctx,wx0 - 4,4,wx1 - wx0 + 8,5,2); fs(ctx,TE_OURO,1.6); circ(ctx,wx0 - 4,6.5,3.4); fs(ctx,TE_OURO_CL,1.2); circ(ctx,wx1 + 4,6.5,3.4); fs(ctx,TE_OURO_CL,1.2);   // a vara da cortina
  drawCortinaTe(ctx,wx0 + 1,1,9,64); drawCortinaTe(ctx,wx1 - 1,-1,9,64);
  // a porta de duas folhas, com os vidros fosco, as puxadores de latão e o aviso ABERTO
  rr(ctx,8,4,88,88,5); fs(ctx,'#3B2416',3);
  [14,54].forEach(x => {
    rr(ctx,x,10,38,76,3); fs(ctx,'#6B452B',2);
    rr(ctx,x + 5,16,28,34,10); fs(ctx,'#DCE8EB',1.8); ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 19,17); ctx.lineTo(x + 19,49); ctx.moveTo(x + 6,33); ctx.lineTo(x + 32,33); ctx.stroke();
    rr(ctx,x + 5,56,28,24,3); fs(ctx,'#5A3B26',1.6);
  });
  rr(ctx,47,42,3,22,1.5); fs(ctx,TE_OURO,1.2); rr(ctx,56,42,3,22,1.5); fs(ctx,TE_OURO,1.2);
  rr(ctx,28,30,48,12,3); fs(ctx,TE_OURO_CL,1.8); txt(ctx,'ABERTO',52,36,8.5,PAL.tinta,'center',FD,0,42);
  // os pendentes dourados
  drawPendente(ctx,216,22,0.8,t,menu);
  drawPendente(ctx,664,22,0.8,t,menu);
  drawPendente(ctx,763,26,0.9,t,menu);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0,92); ctx.lineTo(W,92); ctx.stroke();
  if (g.seloOn && !menu) drawSeloVig(ctx,356,79);
}
/* a porta do elevador, no alto do foyer (centro em x = -230; DOOR fica logo abaixo): duas folhas de metal que abrem quando há gente
   por perto (chegando ou saindo) e o mostrador do andar em cima */
function drawElevadorTe(ctx,g){
  const cx = -230, w = 52, x = cx - w / 2, y0 = 20, y1 = 82;
  let ab = 0;
  (g && g.groups ? g.groups : []).forEach(q => { ab = Math.max(ab,clamp((90 - Math.hypot(q.x - DOOR.x,q.y - DOOR.y)) / 60,0,1)); });
  if (g && g.fiscal && g.fiscal.ativo) ab = Math.max(ab,clamp((90 - Math.hypot(g.fiscal.x - DOOR.x,g.fiscal.y - DOOR.y)) / 60,0,1));
  rr(ctx,x - 6,2,w + 12,84,3); fs(ctx,TE_OURO,2.4);
  rr(ctx,x - 3,5,w + 6,79,2); fs(ctx,'#2A2420',1.4);
  rr(ctx,x + 6,7,w - 12,11,2); fs(ctx,'#14181C',1.4); txt(ctx,'COB',cx - 5,12.8,8,'#FFB84A','center',FD,0,24);
  ctx.beginPath(); ctx.moveTo(cx + 12,15); ctx.lineTo(cx + 17,15); ctx.lineTo(cx + 14.5,10.4); ctx.closePath(); ctx.fillStyle = '#FFB84A'; ctx.fill();   // a setinha
  ctx.save(); ctx.beginPath(); ctx.rect(x,y0,w,y1 - y0); ctx.clip();
  const lz = ctx.createLinearGradient(0,y0,0,y1); lz.addColorStop(0,'#F4E3B0'); lz.addColorStop(1,'#CDB57C');
  ctx.fillStyle = lz; ctx.fillRect(x,y0,w,y1 - y0);   // dentro da cabine: luz quente
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(x + 8,y0 + 8,w - 16,28);
  [[0,-1],[1,1]].forEach(l => {   // as folhas deslizam para dentro da parede
    const lx = l[0] ? x + w / 2 + ab * (w / 2) : x - ab * (w / 2);
    ctx.fillStyle = '#B9C0C8'; ctx.fillRect(lx,y0,w / 2,y1 - y0);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(lx + 4,y0,3,y1 - y0); ctx.fillRect(lx + w / 2 - 12,y0,2,y1 - y0);
    ctx.fillStyle = 'rgba(40,46,54,.35)'; ctx.fillRect(lx + (l[0] ? 0 : w / 2 - 1.4),y0,1.4,y1 - y0);
  });
  ctx.restore();
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.strokeRect(x,y0,w,y1 - y0);
}
function drawArandelaTe(ctx,x,y){
  const gr = ctx.createRadialGradient(x,y,2,x,y,36); gr.addColorStop(0,'rgba(255,224,140,.5)'); gr.addColorStop(1,'rgba(255,224,140,0)');
  ctx.fillStyle = gr; ctx.fillRect(x - 36,y - 36,72,72);
  rr(ctx,x - 2.4,y + 5,4.8,9,2); fs(ctx,TE_OURO,1.4);
  ctx.beginPath(); ctx.moveTo(x - 6,y + 5); ctx.lineTo(x + 6,y + 5); ctx.lineTo(x + 4,y - 8); ctx.lineTo(x - 4,y - 8); ctx.closePath(); fs(ctx,'#F8E9BC',1.6);
}
/* v10.4, as flores finas do foyer (Terraço): ikebana numa mesinha de canto, arranjo de orquídeas num pedestal dourado e flores do campo num vaso de cerâmica (x, y: o chão) */
function drawIkebana(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,2,20,4,0.2);
  ctx.fillStyle = '#3B2416'; ctx.fillRect(-14,-20,3,20); ctx.fillRect(11,-20,3,20);   // a mesinha de canto
  rr(ctx,-19,-27,38,8,3); fs(ctx,'#6B452B',2); ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-16,-23); ctx.lineTo(16,-23); ctx.stroke();
  ctx.strokeStyle = '#4E8F4A'; ctx.lineWidth = 1.8; ctx.lineCap = 'round';   // os galhos: um alto e curvo, um baixo
  ctx.beginPath(); ctx.moveTo(-3,-33); ctx.quadraticCurveTo(-4,-52,8,-60); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1,-33); ctx.quadraticCurveTo(10,-42,16,-40); ctx.stroke();
  ctx.fillStyle = '#4E8F4A'; ell(ctx,12,-51,5,2); ctx.fill();
  [[8,-61,4.2],[16,-40,3.4],[-1,-47,3]].forEach(f => { circ(ctx,f[0],f[1],f[2]); fs(ctx,'#F28AA8',1.2); circ(ctx,f[0],f[1],f[2] * 0.38); ctx.fillStyle = '#F2C94C'; ctx.fill(); });
  ell(ctx,0,-31,13,4.5); fs(ctx,'#8FB8A8',1.8); ell(ctx,0,-33,10,2.6); ctx.fillStyle = '#5B7F72'; ctx.fill();   // o vaso baixo, verde-celadon
  ctx.restore();
}
function drawArranjoOrquideas(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,1,17,4,0.2);
  ell(ctx,0,-3,15,4.5); fs(ctx,TE_OURO,1.8);   // o pedestal dourado: base, coluna e prato
  ctx.beginPath(); ctx.moveTo(-6,-5); ctx.lineTo(6,-5); ctx.lineTo(4,-36); ctx.lineTo(-4,-36); ctx.closePath(); fs(ctx,TE_OURO,1.8);
  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-3,-33,1.6,26);
  rr(ctx,-13,-41,26,6,3); fs(ctx,TE_OURO_CL,1.6);
  rr(ctx,-9,-52,18,12,3); fs(ctx,'#F4F1E8',1.8);   // o vasinho branco
  ctx.strokeStyle = '#3E8A47'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  [[-3,-82,-14],[2,-92,4],[3,-76,16]].forEach(h => { ctx.beginPath(); ctx.moveTo(0,-52); ctx.quadraticCurveTo(h[2] * 0.4,-64,h[2],h[1] + 8); ctx.stroke(); });
  [[-14,-74,'#FFFDF4'],[4,-84,'#E7A6D6'],[16,-68,'#FFFDF4'],[-8,-64,'#B77AC9'],[10,-60,'#E7A6D6']].forEach(f => {
    for (let k = 0; k < 5; k++){ const a = k * TAU / 5 - 1.2; ell(ctx,f[0] + Math.cos(a) * 3.4,f[1] + Math.sin(a) * 3.4,3.1,2); fs(ctx,f[2],1); }
    circ(ctx,f[0],f[1],1.7); fs(ctx,'#F2C94C',0.8);
  });
  ctx.fillStyle = '#4E8F4A'; [[-8,-50,-0.9],[8,-50,0.9]].forEach(l => { ctx.save(); ctx.translate(l[0],l[1]); ctx.rotate(l[2]); ell(ctx,0,0,2.6,8); ctx.fill(); ctx.restore(); });
  ctx.restore();
}
function drawFloresCampo(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  shadowEll(ctx,0,1,17,4,0.2);
  ctx.strokeStyle = '#4E8F4A'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  const fl = [[-12,-58,'#FFFDF4'],[-4,-66,'#E2457A'],[6,-62,'#F2C94C'],[13,-54,'#FFFDF4'],[0,-52,'#9B5BD0'],[-9,-48,'#F2C94C']];
  fl.forEach(f => { ctx.beginPath(); ctx.moveTo(f[0] * 0.2,-30); ctx.lineTo(f[0],f[1] + 3); ctx.stroke(); });
  fl.forEach(f => {
    for (let k = 0; k < 6; k++){ const a = k * TAU / 6; ell(ctx,f[0] + Math.cos(a) * 3.2,f[1] + Math.sin(a) * 3.2,2.6,1.6); fs(ctx,f[2],0.9); }
    circ(ctx,f[0],f[1],1.8); fs(ctx,f[2] === '#F2C94C' ? '#7A4A1B' : '#F2C94C',0.8);
  });
  ctx.beginPath(); ctx.moveTo(-12,-30); ctx.lineTo(12,-30); ctx.lineTo(9,0); ctx.lineTo(-9,0); ctx.closePath(); fs(ctx,'#B5683B',2);   // o vaso de cerâmica
  rr(ctx,-14,-34,28,6,3); fs(ctx,'#C97A4A',1.8);
  ctx.strokeStyle = '#EADFC6'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-10,-18); ctx.lineTo(10,-18); ctx.stroke();
  ctx.restore();
}
/* v10.4, a música ao vivo do Terraço: o pianista (de costas, na banqueta do piano com a tampa aberta) e o quarteto de cordas, em fila no pé do salão */
const PIANISTA_LOOK = { skin:2, hair:0, hairC:'#1B1512', pants:'#1E1D21', kid:false, elder:false, acc:null, glasses:false };
const QUARTETO = [
  { x:206, look:{ skin:1, hair:3, hairC:'#A67B43', pants:'#1E1D21', kid:false, elder:false, acc:null, glasses:true },  shirt:'#26252E', inst:'violino' },
  { x:248, look:{ skin:5, hair:0, hairC:'#1B1512', pants:'#1E1D21', kid:false, elder:false, acc:null, glasses:false }, shirt:'#2A2F42', inst:'violino' },
  { x:290, look:{ skin:3, hair:4, hairC:'#8C8C8C', pants:'#1E1D21', kid:false, elder:true,  acc:null, glasses:true },  shirt:'#33262B', inst:'viola' },
  { x:332, look:{ skin:0, hair:6, hairC:'#7A2E1B', pants:'#1E1D21', kid:false, elder:false, acc:null, glasses:false }, shirt:'#1F3236', inst:'violoncelo' }
];
function drawNotas(ctx,x,y,tm,n){
  if (RM){ txt(ctx,'♪',x,y - 6,14,TE_OURO_CL,'center',FB); return; }   // com movimento reduzido, parada
  for (let i = 0; i < n; i++){ const p = (tm * 0.5 + i / n) % 1; ctx.globalAlpha = 1 - p; txt(ctx,i % 2 ? '♫' : '♪',x + Math.sin(p * 6 + i * 2) * 8 + (i - n / 2) * 10,y - p * 34,14,TE_OURO_CL,'center',FB); ctx.globalAlpha = 1; }
}
function drawPianista(ctx,g,tm){
  const P = TERRACO.piano, x = P.x0 + 60, y = P.y0 + 98, k = RM ? 0 : Math.sin(tm * 6);
  drawPerson(ctx,PIANISTA_LOOK,x,y,{ sit:true, back:true, shirt:'#1B1B22', mood:0, bob:RM ? 0 : Math.sin(tm * 2.4) * 0.8, bracoE:[[-15,-26],[-8 + k * 2.5,-39]], bracoD:[[15,-26],[8 - k * 2.5,-39]] });
  drawNotas(ctx,x + 8,y - 78,tm,3);
}
function drawQuarteto(ctx,g,tm){
  const yb = 534, K = 0.8, mv = RM ? 0 : 1;   // menores e no fim do chão, para não cobrir as cadeiras das mesas de baixo
  QUARTETO.forEach((q,i) => {
    const x = 0, y = 0, bow = mv * Math.sin(tm * 3 + i * 1.3);
    ctx.save(); ctx.translate(q.x,yb); ctx.scale(K,K);
    shadowEll(ctx,x,y,20,5,0.18);
    ctx.strokeStyle = '#3B2416'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 9,y); ctx.lineTo(x - 6,y - 16); ctx.moveTo(x + 9,y); ctx.lineTo(x + 6,y - 16); ctx.stroke();
    ell(ctx,x,y - 17,12,4); fs(ctx,'#6B452B',2);
    const cello = q.inst === 'violoncelo';
    drawPerson(ctx,q.look,x,y - 26,{ sit:true, shirt:q.shirt, mood:0, bob:mv * Math.sin(tm * 2 + i) * 0.8 });
    ctx.save(); ctx.translate(x,y - 26); ctx.lineCap = 'round';
    if (cello){   // o violoncelo entre os joelhos, o arco na horizontal
      ctx.strokeStyle = '#5A3A1E'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(1,-6); ctx.lineTo(1,-34); ctx.stroke();
      ell(ctx,1,2,10,13); fs(ctx,'#B5733A',2); circ(ctx,1,-1,2.4); ctx.fillStyle = PAL.tinta; ctx.fill();
      ctx.strokeStyle = '#D9C9A0'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-20 + bow * 4,6); ctx.lineTo(18 + bow * 4,2); ctx.stroke();
    } else {      // violino e viola: no ombro esquerdo, o arco cruzando
      const big = q.inst === 'viola';
      ctx.save(); ctx.translate(-10,-12); ctx.rotate(-0.9); ell(ctx,0,0,big ? 9 : 7.5,big ? 4.6 : 3.8); fs(ctx,'#B5733A',1.8); rr(ctx,big ? 8 : 6.5,-1,big ? 12 : 10,2,1); fs(ctx,'#3B2416',1); ctx.restore();
      ctx.strokeStyle = '#D9C9A0'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-14 + bow * 3,-2); ctx.lineTo(12 + bow * 3,-12); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
    drawNotas(ctx,q.x + 5,yb - 56,tm + i * 0.37,1);
  });
}
/* o foyer no lugar da rua e do meio-fio: parede do corredor (lambri, arandelas, o elevador, o letreiro e a plaquinha "Cobertura") e o carpete */
function drawFoyerTe(ctx,g,tm){
  const x0 = -CALCADA.w, ww = -x0;
  ctx.fillStyle = '#1F4A5A'; ctx.fillRect(x0,82,ww,458);
  ctx.save(); ctx.beginPath(); ctx.rect(x0,82,ww,458); ctx.clip();
  ctx.strokeStyle = 'rgba(130,190,205,.14)'; ctx.lineWidth = 1.2;
  for (let x = x0 - 20; x < 20; x += 40) for (let y = 82; y < 560; y += 40){ ctx.beginPath(); ctx.moveTo(x + 20,y); ctx.lineTo(x + 40,y + 20); ctx.lineTo(x + 20,y + 40); ctx.lineTo(x,y + 20); ctx.closePath(); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = TE_OURO; ctx.lineWidth = 4; ctx.strokeRect(x0 + 10,104,ww - 22,428);
  ctx.strokeStyle = 'rgba(232,196,106,.7)'; ctx.lineWidth = 1.2; ctx.strokeRect(x0 + 18,112,ww - 38,412);
  // a parede: o alto em creme, o lambri de nogueira embaixo, o rodapé e a moldura dourada
  ctx.fillStyle = '#E7DAB9'; ctx.fillRect(x0,0,ww,50);
  ctx.strokeStyle = 'rgba(190,160,100,.2)'; ctx.lineWidth = 2; for (let x = x0 + 4; x < 0; x += 16){ ctx.beginPath(); ctx.moveTo(x,5); ctx.lineTo(x,50); ctx.stroke(); }
  ctx.fillStyle = '#5B3A26'; ctx.fillRect(x0,50,ww,32);
  ctx.strokeStyle = '#7A5236'; ctx.lineWidth = 1.4; for (let x = x0 + 4; x < 0; x += 40){ rr(ctx,x,56,34,20,3); ctx.stroke(); }
  ctx.fillStyle = TE_OURO; ctx.fillRect(x0,50,ww,3); ctx.fillRect(x0,0,ww,5);
  ctx.fillStyle = '#3B2416'; ctx.fillRect(x0,78,ww,6); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0,84); ctx.lineTo(0,84); ctx.stroke();
  drawElevadorTe(ctx,g);
  drawArandelaTe(ctx,-194,28); drawArandelaTe(ctx,-66,28);
  // o letreiro: placa escura com letras douradas e duas estrelas
  rr(ctx,-184,9,108,38,6); fs(ctx,'#16222B',2.6);
  ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1.3; rr(ctx,-180,13,100,30,4); ctx.stroke();
  txt(ctx,'Terraço Suíça',-129,26,17,TE_OURO_CL,'center',FD,0,92);
  star(ctx,-136,38.5,5.2,TE_OURO_CL); star(ctx,-122,38.5,5.2,TE_OURO_CL);
  // a plaquinha "Cobertura", no lugar do número da rua
  rr(ctx,-60,18,46,22,3); fs(ctx,TE_OURO_CL,1.8); ctx.strokeStyle = 'rgba(90,60,20,.5)'; ctx.lineWidth = 1; rr(ctx,-57.5,20.5,41,17,2); ctx.stroke();
  txt(ctx,'Cobertura',-37,29.5,8,PAL.tinta,'center',FD,0,38);
}
/* a poltrona de veludo verde-garrafa (x, y: o chão, no meio) */
function drawPoltrona(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  ctx.fillStyle = TE_OURO; ctx.fillRect(-10,-3,3,5); ctx.fillRect(7,-3,3,5);
  rr(ctx,-10,-30,20,24,7); fs(ctx,'#2A5440',2);
  [[-4,-24],[4,-24],[0,-17]].forEach(p => { circ(ctx,p[0],p[1],1.1); fs(ctx,TE_OURO_CL,0.8); });
  rr(ctx,-13,-17,6,15,3); fs(ctx,'#2F5D45',1.8); rr(ctx,7,-17,6,15,3); fs(ctx,'#2F5D45',1.8);
  rr(ctx,-9,-12,18,9,4); fs(ctx,'#3C7358',2);
  ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(-7,-27,3,10);
  ctx.restore();
}
/* o lugar de espera do foyer: com as poltronas, uma ilha (tapete e 4 poltronas); sem elas, um tapete redondo numerado, de pé */
function drawLugarTe(ctx,x,y,i,sent){   // (i: o número do lugar, que vai por cima, em drawLugarNums)
  if (sent){
    rr(ctx,x - 66,y - 24,132,40,16); fs(ctx,'#EADFC6',2);
    ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1.4; rr(ctx,x - 61,y - 19,122,30,12); ctx.stroke();
    for (let k = 0; k < 4; k++){ shadowEll(ctx,x - 42 + k * 28,y + 8,13,3.5,0.18); drawPoltrona(ctx,x - 42 + k * 28,y + 8,1); }
    return;
  }
  ell(ctx,x,y - 2,60,15); fs(ctx,'#EADFC6',2);
  ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1.4; ell(ctx,x,y - 2,53,11); ctx.stroke();
  // o número do lugar é desenhado depois das pessoas (drawLugarNums), como nos outros pontos
}
/* o piano de cauda fechado e a banqueta (TERRACO.piano): preto, no canto de baixo à esquerda do salão */
function drawPiano(ctx,g,aberto){
  const P = TERRACO.piano, ox = P.x0, oy = P.y0;
  ctx.save(); ctx.translate(ox,oy);
  shadowEll(ctx,60,96,58,9,0.26);
  [[12,66,5,26],[103,66,5,26],[56,70,5,24]].forEach(l => { rr(ctx,l[0],l[1],l[2],l[3],2); ctx.fillStyle = '#2B2A2E'; ctx.fill();   // as pernas e as rodinhas de latão
    circ(ctx,l[0] + l[2] / 2,l[1] + l[3] + 1.5,2.4); fs(ctx,TE_OURO,1); });
  ctx.strokeStyle = TE_OURO; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(46,92); ctx.lineTo(72,92); ctx.moveTo(59,90); ctx.lineTo(59,96); ctx.stroke();   // o pedal
  const forma = dy => { ctx.beginPath(); ctx.moveTo(6,58 + dy); ctx.lineTo(6,24 + dy); ctx.quadraticCurveTo(6,10 + dy,22,10 + dy); ctx.lineTo(84,10 + dy); ctx.quadraticCurveTo(114,10 + dy,114,30 + dy); ctx.quadraticCurveTo(114,44 + dy,98,46 + dy); ctx.quadraticCurveTo(88,47 + dy,88,56 + dy); ctx.lineTo(88,58 + dy); ctx.closePath(); };
  forma(14); fs(ctx,'#0B0B10',2.2);   // a espessura do corpo (a forma de cima repetida mais para baixo)
  ctx.fillStyle = '#0B0B10'; ctx.fillRect(6,58,82,14);
  forma(0); fs(ctx,aberto ? '#4A3322' : '#1E1E26',2.2);   // o tampo fechado (v10.4: aberto com o pianista, e se vê o interior)
  if (aberto){
    ctx.strokeStyle = 'rgba(232,196,106,.6)'; ctx.lineWidth = 0.9; for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.moveTo(14 + i * 8,54); ctx.lineTo(20 + i * 10,20 + i * 1.6); ctx.stroke(); }   // as cordas
    rr(ctx,10,60,74,8,2); fs(ctx,'#F4F0E4',1.2); ctx.fillStyle = '#16161C'; for (let i = 0; i < 12; i++) if (i % 7 !== 2 && i % 7 !== 6) ctx.fillRect(14 + i * 5.9,60,3.4,5);   // o teclado aberto
    ctx.beginPath(); ctx.moveTo(6,24); ctx.lineTo(16,-20); ctx.lineTo(98,-20); ctx.lineTo(114,26); ctx.closePath(); fs(ctx,'#14141A',2.2);   // a tampa levantada
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.moveTo(14,18); ctx.lineTo(22,-14); ctx.lineTo(52,-14); ctx.lineTo(30,18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = TE_OURO; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(98,-18); ctx.lineTo(104,22); ctx.stroke();   // o suporte da tampa
  } else {
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.moveTo(12,50); ctx.lineTo(12,26); ctx.quadraticCurveTo(12,16,26,16); ctx.lineTo(60,16); ctx.lineTo(30,50); ctx.closePath(); ctx.fill();   // o reflexo
  rr(ctx,10,61,74,7,2); fs(ctx,'#2E2E38',1.4); ctx.strokeStyle = TE_OURO; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(14,64.5); ctx.lineTo(80,64.5); ctx.stroke();   // a tampa do teclado, fechada
  }
  rr(ctx,34,97,52,11,3); fs(ctx,'#3A261A',2); rr(ctx,36,98.5,48,5,2); ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fill();   // a banqueta
  ctx.fillStyle = '#2B1A10'; ctx.fillRect(38,108,4,7); ctx.fillRect(78,108,4,7);
  ctx.restore();
}
function drawAzulejo(ctx){
  ctx.fillStyle = PAL.azulejo; ctx.fillRect(0,0,W,92);
  ctx.strokeStyle = '#E3E1D4'; ctx.lineWidth = 1;
  for (let x=0;x<=W;x+=32){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,92); ctx.stroke(); }
  for (let y=14;y<92;y+=26){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  ctx.fillStyle = PAL.faixa; ctx.fillRect(0,58,W,16);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(0,61,W,2); ctx.fillRect(0,70,W,1.5);
  ctx.fillStyle = PAL.cromo; ctx.fillRect(0,82,W,10);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0,58); ctx.lineTo(W,58); ctx.moveTo(0,74); ctx.lineTo(W,74); ctx.moveTo(0,92); ctx.lineTo(W,92); ctx.stroke();

  // porta
  rr(ctx,8,6,86,88,4); fs(ctx,PAL.madeira,3);
  rr(ctx,16,14,70,74,3); fs(ctx,PAL.madeiraEsc,2);
  rr(ctx,22,20,58,38,3); fs(ctx,'#BFE3F2',2);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(28,56); ctx.lineTo(40,22); ctx.lineTo(48,22); ctx.lineTo(36,56); ctx.closePath(); ctx.fill();
  circ(ctx,77,72,3.5); fs(ctx,PAL.mostarda,1.8);
  rr(ctx,24,63,44,13,3); fs(ctx,PAL.mostarda,2);
  txt(ctx,'ABERTO',46,70,8.5,PAL.tinta,'center',FD,0,38);
  // tapete
  rr(ctx,18,94,76,14,4); fs(ctx,PAL.formica,2.2);
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(26,101); ctx.lineTo(86,101); ctx.stroke();

  // letreiro
  rr(ctx,112,10,170,44,8); fs(ctx,'#1b2a52',3);
  rr(ctx,117,15,160,34,5); ctx.lineWidth = 1.5; ctx.strokeStyle = '#FFB3A8'; ctx.stroke();
  txt(ctx,'LANCHES',197,28,22,'#FF6B5B','center',FD);
  txt(ctx,'LANCHES',196,27,22,'#FFD36B','center',FD);
  txt(ctx,'CAFÉ · PASTEL · PF',197,43,10,'#BFE3F2','center',FB);
}
/* cartaz de preços, relógio e placa da cozinha (em todo ponto) */
function drawWallCommon(ctx,g,t){

  // cartaz de preços
  ctx.save(); ctx.translate(480,30); ctx.rotate(-0.012);
  rr(ctx,-172,-24,344,48,6); fs(ctx,'#FFF3C9',3);
  ctx.setLineDash([5,4]); rr(ctx,-166,-19,332,38,4); ctx.strokeStyle = PAL.formica; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
  txt(ctx,'CARDÁPIO DA CASA',0,-10,10,PAL.faixa,'center',FB);
  const pt = g && g.ponto;   // os preços do cardápio (v8.3.8)
  const cu = g && g.cursos;   // v8.6.9: a placa mostra o que a cozinha faz de início
  txt(ctx,'PF R$ ' + precoPrato('pf', pt, cu) + ' · Coxinha R$ ' + precoPrato('coxinha', pt, cu) + ' · Cafezinho R$ ' + DRINK_PRICE.coffee,0,6,16,PAL.formica,'center',FD,0,322);
  ctx.restore();

  // relógio
  const endless = !!(g && (g.mode === 'semfim' || g.mode === 'treino'));   // na Missão zero também conta para a frente, sem fim
  const frac = endless ? ((g.elapsed % 60) / 60) : (g ? clamp(g.clock / g.day.time, 0, 1) : 1);
  const low = !endless && g && g.clock < 20 && g.state === 'playing';
  circ(ctx,712,44,32); fs(ctx,PAL.cromo,3);
  circ(ctx,712,44,26); fs(ctx,'#fff',2);
  ctx.beginPath(); ctx.arc(712,44,21,-Math.PI/2,-Math.PI/2 + TAU*frac); ctx.lineWidth = 6; ctx.strokeStyle = low ? PAL.perigo : (endless ? PAL.ok : PAL.mostarda); ctx.lineCap = 'butt'; ctx.stroke(); ctx.lineCap = 'round';
  if (g && g.fechado && !endless) txt(ctx, 'FECHANDO', 712, 45, 9, PAL.alerta, 'center', FD, 0, 48);   // v9.6.4: o relógio zerou, mas ainda há gente no salão
  else txt(ctx, endless ? mmssUp(g.elapsed) : mmss(g ? g.clock : 0), 712, 45, 14, PAL.tinta, 'center', FD);
  placaCozinha(ctx);
}
function placaCozinha(ctx){
  rr(ctx,782,18,170,36,8); fs(ctx,PAL.faixa,3);
  txt(ctx,'COZINHA DO TONHÃO',867,36,13,'#fff','center',FD);
}

/* calçada (v7.5), de -CALCADA.w a 0: o muro da casa com o toldo, o piso de concreto, o meio-fio e a rua; os
   lugares de espera e as plantas da casa (espada-de-são-jorge no vaso de barro e numa lata reaproveitada, v7.7).
   Na borda do salão, o portão de enrolar aberto (trilho e soleira).
   Os lugares seguem o ponto (v7.7, PONTOS.assento): na Garagem, de pé, numa faixa pintada no chão com o número;
   com assento, o banco de ripas da v7.5, com o tablet num pedestal se a bebida pede preparo */
function drawCalcada(ctx,g,tm){
  const x0 = -CALCADA.w, ind = industrial(g), av = avenida(g), te = terraco(g);
  if (te) drawFoyerTe(ctx,g,tm);   // v10: o foyer do Terraço no lugar da rua, do piso, do muro e do toldo
  else {
  // rua e meio-fio
  ctx.fillStyle = '#7E848B'; ctx.fillRect(x0 - 60,0,84,540);
  ctx.fillStyle = '#F7EFD8'; for (let y=20;y<540;y+=60) ctx.fillRect(x0 - 50,y,4,30);
  ctx.fillStyle = '#B4B0A6'; ctx.fillRect(x0 + 18,0,8,540);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 18,0); ctx.lineTo(x0 + 18,540); ctx.stroke();
  // piso de concreto, em placas (v9.1: na Avenida, pedra portuguesa em ondas preto e branco)
  if (avenida(g)) drawPedraPort(ctx,x0 + 26);
  else {
    ctx.fillStyle = '#DAD6CC'; ctx.fillRect(x0 + 26,0,-x0 - 26,540);
    ctx.strokeStyle = 'rgba(34,32,28,.12)'; ctx.lineWidth = 1.5;
    for (let x=x0 + 26 + 58; x<0; x+=58){ ctx.beginPath(); ctx.moveTo(x,92); ctx.lineTo(x,540); ctx.stroke(); }
    for (let y=150; y<540; y+=58){ ctx.beginPath(); ctx.moveTo(x0 + 26,y); ctx.lineTo(0,y); ctx.stroke(); }
  }
  // muro da casa (no alto), com janela, e o toldo listrado por cima da espera
  ctx.fillStyle = ind ? '#E4E0D6' : av ? '#EDE3CF' : '#EFC9A4'; ctx.fillRect(x0 + 26,0,-x0 - 26,82);
  if (ind){   // v9: o muro do galpão, de tijolinho pintado, a faixa amarela de carga e descarga no meio-fio e o poste
    ctx.strokeStyle = 'rgba(120,96,84,.2)'; ctx.lineWidth = 1;
    for (let y=0, r=0; y<82; y+=11, r++){ ctx.beginPath(); ctx.moveTo(x0 + 26,y); ctx.lineTo(0,y); ctx.stroke(); for (let x=x0 + 26 + (r % 2)*17; x<0; x+=34){ ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,Math.min(82,y+11)); ctx.stroke(); } }
    ctx.fillStyle = '#F2C230'; ctx.fillRect(x0 + 26,96,10,444);
    ctx.fillStyle = 'rgba(34,32,28,.55)'; for (let y=98;y<540;y+=24) ctx.fillRect(x0 + 26,y,10,8);
    ctx.save(); ctx.translate(x0 + 52,300); ctx.rotate(-Math.PI/2); txt(ctx,'CARGA E DESCARGA',0,0,9,'rgba(160,116,10,.9)','center',FD); ctx.restore();
    ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(x0 + 96,440,5,100); rr(ctx,x0 + 84,432,30,8,3); fs(ctx,PAL.cromo,1.8);
    ell(ctx,x0 + 98,538,12,3.5); ctx.fillStyle = 'rgba(34,32,28,.18)'; ctx.fill();
    ctx.fillStyle = 'rgba(255,230,150,.2)'; ctx.beginPath(); ctx.moveTo(x0 + 88,440); ctx.lineTo(x0 + 110,440); ctx.lineTo(x0 + 124,520); ctx.lineTo(x0 + 74,520); ctx.closePath(); ctx.fill();
  }
  rr(ctx,x0 + 70,10,64,44,3); fs(ctx,'#BFE3F2',2.5);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 102,10); ctx.lineTo(x0 + 102,54); ctx.stroke();
  rr(ctx,x0 + 170,18,40,20,3); fs(ctx,'#fff',2); txt(ctx,ind ? 'Nº 410' : av ? 'Nº 1500' : 'Nº 27',x0 + 190,28.5,10,PAL.faixa,'center',FD);
  ctx.fillStyle = '#C7A27E'; ctx.fillRect(x0 + 26,74,-x0 - 26,8);
  const tx0 = x0 + 30, tx1 = -12, n = 8, tw = (tx1 - tx0) / n;
  for (let i=0;i<n;i++){
    ctx.beginPath(); ctx.moveTo(tx0 + i*tw,62); ctx.lineTo(tx0 + (i+1)*tw,62); ctx.lineTo(tx0 + (i+1)*tw,92);
    ctx.quadraticCurveTo(tx0 + (i+0.5)*tw,104,tx0 + i*tw,92); ctx.closePath();
    fs(ctx,av ? (i % 2 ? '#F6EBD3' : '#7A1F3A') : (i % 2 ? '#fff' : PAL.formica),2);
  }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx0,62); ctx.lineTo(tx1,62); ctx.stroke();
  }
  // lugares de espera
  const ponto = g && g.ponto ? g.ponto : PONTOS[0], max = ponto.espera, sent = !!(g && g.sentado), banco = !!(g && g.up && g.up.assento === 'banco');
  if (av && sent){   // v9.1: os sofás da Avenida, de 3 lugares cada (do de baixo para o de cima)
    for (let b=0;b<max;b+=3){
      const last = Math.min(b + 2,max - 1), seams = [];
      for (let k=b;k<last;k++) seams.push(Math.round((QUEUE.ys[k] + QUEUE.ys[k+1]) / 2) - 28);
      drawSofaAv(ctx,QUEUE.x,QUEUE.ys[last] - 46,QUEUE.ys[b] + 12,seams,b / 3);
    }
  }
  for (let i=0;i<max;i++){
    const y = QUEUE.ys[i], x = QUEUE.x;
    if (te){ drawLugarTe(ctx,x,y,i,sent); continue; }   // v10: tapete redondo ou ilha de poltronas
    if (av && sent){
      continue;   // v9.6.9: o número do lugar é desenhado depois das pessoas (drawLugarNums)
    }
    if (ponto.assento === 'pe' && sent){   // v9: cadeirinhas de plástico ou banquinhos de madeira, uma por lugar de pessoa
      ctx.fillStyle = 'rgba(34,32,28,.06)'; rr(ctx,x-70,y-72,140,84,12); ctx.fill();
      for (let k=0;k<4;k++){ shadowEll(ctx,x-45 + k*30,y+6,11,3,0.16); (banco ? drawBanquinho : drawCadeirinha)(ctx,x-45 + k*30,y+6,1.05); }
      continue;   // v9.6.9: o número do lugar é desenhado depois das pessoas (drawLugarNums)
    }
    if (ponto.assento === 'pe'){
      // de pé: faixa amarela pintada no concreto (meio gasta) e o número no chão
      ctx.save(); ctx.strokeStyle = 'rgba(226,170,40,.75)'; ctx.lineWidth = 3; ctx.setLineDash([12,7]);
      rr(ctx,x-58,y-16,116,30,6); ctx.stroke(); ctx.restore();
      txt(ctx,String(i+1),x-70,y-1,18,'rgba(190,132,20,.85)','center',FD);
      continue;
    }
    ctx.fillStyle = 'rgba(34,32,28,.06)'; rr(ctx,x-70,y-72,140,84,12); ctx.fill();
    shadowEll(ctx,x,y+8,60,6,0.16);
    ctx.fillStyle = PAL.madeiraEsc; ctx.fillRect(x-52,y-4,6,12); ctx.fillRect(x+46,y-4,6,12);
    rr(ctx,x-58,y-10,116,10,3); fs(ctx,PAL.madeira,2.2);
    ctx.strokeStyle = 'rgba(34,32,28,.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x-56,y-5); ctx.lineTo(x+56,y-5); ctx.stroke();
  }
  // plantas da casa da Bia (nível 1, v7.7): espada-de-são-jorge no vaso de barro, no canto de baixo, e uma menor
  // numa lata de tinta reaproveitada, encostada no muro (o banquinho de plástico da v7.5 fica para o nível 2).
  // Desde a v8.6.5, compradas na aba Decoração (DECOR)
  if (decorOn(g,'espada')) drawVasoEspada(ctx,x0 + 40,536);
  if (decorOn(g,'lata')) drawLataEspada(ctx,x0 + 44,132);
  if ((ind || av || te) && decorOn(g,'anturio')) drawAnturio(ctx,-38,534,1);   // v9: o antúrio no chão, perto do portão, e a samambaia pendurada no toldo
  if ((ind || av || te) && decorOn(g,'pendente')) drawSamambaia(ctx,x0 + 66,120,0.8);
  if ((av || te) && decorOn(g,'tulipa')) drawTulipas(ctx,x0 + 112,138,1);   // v9.1: as flores da Avenida: tulipas na jardineira, copos-de-leite no vaso alto e a orquídea na mesinha
  if ((av || te) && decorOn(g,'copo')) drawCopoLeite(ctx,x0 + 38,300,1);
  if (te && decorOn(g,'ikebana')) drawIkebana(ctx,x0 + 80,106,1);   // v10.4: as flores do foyer: a ikebana na mesinha ao lado do elevador, o arranjo de orquídeas no pedestal (canto de baixo) e as flores do campo perto da porta do salão
  if (te && decorOn(g,'orqArranjo')) drawArranjoOrquideas(ctx,x0 + 22,486,1);
  if (te && decorOn(g,'campo')) drawFloresCampo(ctx,-28,330,1);
  if ((av || te) && decorOn(g,'orquidea')) drawOrquidea(ctx,114,132,1);   // perto da porta, encostada na meia-parede (já dentro do salão)
  // portão de enrolar aberto, na borda do salão: trilho no alto e soleira no chão
  if (g && g.fechado) drawPlacaFechado(ctx,QUEUE.x + 28,196,tm);   // v9.6.4
  if (te){   // v10: no lugar do portão de enrolar, o batente de madeira e a soleira de latão
    ctx.fillStyle = '#CDBF9F'; ctx.fillRect(-6,92,12,448);
    ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0,96); ctx.lineTo(0,540); ctx.stroke();
    rr(ctx,-12,0,24,92,4); fs(ctx,'#6B452B',2.5);
    ctx.strokeStyle = TE_OURO; ctx.lineWidth = 1.2; ctx.strokeRect(-8,4,16,84);
    return;
  }
  ctx.fillStyle = '#ABA394'; ctx.fillRect(-6,92,12,448);
  ctx.strokeStyle = 'rgba(34,32,28,.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0,96); ctx.lineTo(0,540); ctx.stroke();
  rr(ctx,-12,0,24,92,4); fs(ctx,PAL.cromo,2.5);
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.2;
  for (let y=10;y<86;y+=8){ ctx.beginPath(); ctx.moveTo(-9,y); ctx.lineTo(9,y); ctx.stroke(); }
}
/* espada-de-são-jorge no vaso de barro e na lata de tinta (v7.7); (x, y) é o chão, no pé do vaso */
function drawVasoEspada(ctx,vx,vy){
  shadowEll(ctx,vx,vy-11,12,3,0.18);
  drawEspada(ctx,vx,vy-32,0.85);
  ctx.beginPath(); ctx.moveTo(vx-11,vy-36); ctx.lineTo(vx+11,vy-36); ctx.lineTo(vx+8,vy-12); ctx.lineTo(vx-8,vy-12); ctx.closePath(); fs(ctx,'#C9673B',2);
  rr(ctx,vx-13,vy-40,26,6,2); fs(ctx,'#B85A30',2);
}
function drawLataEspada(ctx,lx,ly){
  shadowEll(ctx,lx,ly+1,10,3,0.18);
  drawEspada(ctx,lx,ly-18,0.68);
  rr(ctx,lx-9,ly-20,18,20,2); fs(ctx,PAL.cromo,2);
  ctx.fillStyle = 'rgba(216,67,47,.55)'; ctx.fillRect(lx-8,ly-14,16,7);   // o rótulo desbotado da lata
}
/* ============================================================
   DECORAÇÃO DA GARAGEM (v8.6.5): na parede, à esquerda da janela, a samambaia pendurada e a foto da Rosa; embaixo
   do letreiro, a plaquinha; no chão, perto do portão, o quadro de giz no cavalete. Desenhados com a parede (antes
   das pessoas). As funções servem também para os ícones da lojinha
   ============================================================ */
let edDesenho = false;   // o editor do salão desenha a parede: o quadro de giz ficaria atrás do estoque
/* v9.1.1: em todo ponto; posições (x, y, escala) por nível: Garagem, área industrial e Avenida (a foto e a samambaia na faixa de parede
   embaixo do cartaz de preços, a plaquinha embaixo do letreiro, o quadro de giz no chão, perto da porta) */
const DECOR_POS = [
  { samambaia:[42,30,1],   foto:[88,36,1],    placa:[234,68,1], giz:[62,150,1] },
  { samambaia:[630,78,.8], foto:[308,74,.8],  placa:[237,68,1], giz:[62,150,1] },   // a foto 22 px à esquerda: encostava na 1ª TV
  { samambaia:[630,78,.8], foto:[330,74,.8],  placa:[242,68,1], giz:[62,150,1] }
];
function drawDecorParede(ctx,g){
  const P = DECOR_POS[Math.max(0, Math.min(2, ((g && g.ponto && g.ponto.nivel) || 1) - 1))];
  if (decorOn(g,'samambaia')) drawSamambaia(ctx,P.samambaia[0],P.samambaia[1],P.samambaia[2]);
  if (decorOn(g,'foto')) drawFotoRosa(ctx,P.foto[0],P.foto[1],P.foto[2]);
  if (decorOn(g,'placa')) drawPlaquinha(ctx,P.placa[0],P.placa[1],P.placa[2]);
  if (decorOn(g,'giz') && !edDesenho) drawGiz(ctx,P.giz[0],P.giz[1],P.giz[2],g);
}
/* samambaia num vaso de barro pendurado por 3 correntinhas num suporte de ferro na parede; (x, y) é a boca do vaso */

/* ============================================================
   OS ENFEITES DO LUXO (v10.7): o pisca-pisca no alto da parede do fundo, a cortina de chita na janela (junto da porta), os quadros de
   artista na parede (Avenida e Terraço), as luminárias de fábrica penduradas sobre as mesas e o lustre de cristal no centro do teto
   (as duas últimas vão na lista ordenada por y, atrás das pessoas). Servem também para os ícones da lojinha
   ============================================================ */
const LUXO_JAN = [ { x0:116, x1:158, y0:16, y1:64 }, { x0:100, x1:160, y0:14, y1:64 }, { x0:104, x1:176, y0:10, y1:62 }, { x0:132, x1:190, y0:9, y1:62 } ];   // a janela de cada ponto (a da esquerda, perto da porta)
const LUXO_QUADROS = [ null, null, [[404,69,24,26,0],[480,69,24,26,1],[556,69,24,26,2]], [[404,79,16,18,0],[480,79,16,18,1],[556,79,16,18,2]] ];   // x, y, largura, altura e o desenho
const LUXO_LUSTRE = { x:390, y:136 };
/* a estampa da chita (fundo creme, flores vermelhas com miolo amarelo e folhinhas verdes) dentro do retângulo */
function pintaChita(ctx,x,y,w,h){
  ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
  ctx.fillStyle = '#F8E7B8'; ctx.fillRect(x,y,w,h);
  for (let yy=y+3, r=0; yy<y+h+6; yy+=9, r++) for (let xx=x+(r % 2 ? 7 : 2); xx<x+w+6; xx+=13){
    ell(ctx,xx+4,yy+1.5,3.4,1.5); ctx.fillStyle = '#4E9F52'; ctx.fill();
    circ(ctx,xx,yy,3.2); ctx.fillStyle = r % 2 ? '#E2574C' : '#E8608A'; ctx.fill();
    circ(ctx,xx,yy,1.1); ctx.fillStyle = '#F2C23D'; ctx.fill();
  }
  ctx.restore();
}
function drawPisca(ctx,tm){
  const x0 = 306, x1 = 958, n = 12, sw = (x1 - x0) / n, cores = ['#FFD84A','#FF6B5B','#5BC27A','#5AA9F2','#FFB347'];
  ctx.strokeStyle = '#2B2A26'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0,2);
  for (let i=0;i<n;i++) ctx.quadraticCurveTo(x0 + (i + 0.5) * sw,10,x0 + (i + 1) * sw,2);
  ctx.stroke();
  for (let i=0;i<n;i++) [0.2,0.5,0.8].forEach((u,k) => {
    const x = x0 + (i + u) * sw, y = 2 + 16 * u * (1 - u) + 2.5, c = cores[(i * 3 + k) % cores.length];
    const on = RM ? 1 : 0.7 + 0.3 * Math.sin(tm * 3 + i * 1.7 + k * 2.3);
    circ(ctx,x,y,5.5); ctx.fillStyle = 'rgba(255,235,170,' + (0.2 * on) + ')'; ctx.fill();
    circ(ctx,x,y,2.6); ctx.globalAlpha = 0.6 + 0.4 * on; fs(ctx,c,1); ctx.globalAlpha = 1;
  });
}
function drawCortinaChita(ctx,j){
  const x0 = j.x0 - 6, x1 = j.x1 + 6, y0 = j.y0 - 2, h = j.y1 - j.y0 + 4;
  rr(ctx,x0 - 2,y0 - 3,x1 - x0 + 4,3.4,1.5); fs(ctx,'#5B3A21',1.2);   // a vara
  // o painel da esquerda, preso no meio por uma fita vermelha, e a bandô de babados no alto
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x0 + 17,y0); ctx.bezierCurveTo(x0 + 17,y0 + h * 0.3,x0 + 8,y0 + h * 0.42,x0 + 8,y0 + h * 0.52); ctx.bezierCurveTo(x0 + 8,y0 + h * 0.62,x0 + 18,y0 + h * 0.8,x0 + 17,y0 + h); ctx.lineTo(x0,y0 + h); ctx.closePath();
  ctx.fillStyle = '#F8E7B8'; ctx.fill(); ctx.clip(); pintaChita(ctx,x0,y0,20,h);
  ctx.strokeStyle = 'rgba(80,40,20,.25)'; ctx.lineWidth = 1; [5,10].forEach(d => { ctx.beginPath(); ctx.moveTo(x0 + d,y0 + 2); ctx.lineTo(x0 + d,y0 + h - 2); ctx.stroke(); });
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x0 + 17,y0); ctx.bezierCurveTo(x0 + 17,y0 + h * 0.3,x0 + 8,y0 + h * 0.42,x0 + 8,y0 + h * 0.52); ctx.bezierCurveTo(x0 + 8,y0 + h * 0.62,x0 + 18,y0 + h * 0.8,x0 + 17,y0 + h); ctx.lineTo(x0,y0 + h); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.stroke();
  rr(ctx,x0 + 3,y0 + h * 0.48,12,4.5,1.5); fs(ctx,'#C2362B',1.2);
  ctx.save(); ctx.beginPath(); const n = Math.max(4,Math.round((x1 - x0) / 11)), d = (x1 - x0) / n;
  ctx.moveTo(x0,y0); ctx.lineTo(x1,y0); for (let i=n;i>0;i--) ctx.quadraticCurveTo(x0 + (i - 0.5) * d,y0 + 17,x0 + (i - 1) * d,y0 + 9);
  ctx.closePath(); ctx.fillStyle = '#F8E7B8'; ctx.fill(); ctx.clip(); pintaChita(ctx,x0,y0,x1 - x0,18); ctx.restore();
  ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y0); for (let i=n;i>0;i--) ctx.quadraticCurveTo(x0 + (i - 0.5) * d,y0 + 17,x0 + (i - 1) * d,y0 + 9);
  ctx.closePath(); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.stroke();
}
/* quadro de artista (moldura dourada e passe-partout); k: 0 a paisagem, 1 as formas, 2 o vaso de flores */
function drawQuadro(ctx,x,y,w,h,k){
  rr(ctx,x - w/2,y - h/2,w,h,2); fs(ctx,'#B8862F',1.8);
  const ix = x - w/2 + 3, iy = y - h/2 + 3, iw = w - 6, ih = h - 6;
  ctx.fillStyle = '#F6EEDA'; ctx.fillRect(ix,iy,iw,ih);
  const px = ix + iw * 0.12, py = iy + ih * 0.12, pw = iw * 0.76, ph = ih * 0.76;
  ctx.save(); ctx.beginPath(); ctx.rect(px,py,pw,ph); ctx.clip();
  if (k === 0){ ctx.fillStyle = '#9CCBE0'; ctx.fillRect(px,py,pw,ph); ctx.fillStyle = '#E9A33B'; circ(ctx,px + pw * 0.72,py + ph * 0.3,ph * 0.17); ctx.fill();
    ctx.fillStyle = '#4E9F6A'; ctx.beginPath(); ctx.moveTo(px,py + ph); ctx.quadraticCurveTo(px + pw * 0.3,py + ph * 0.35,px + pw * 0.65,py + ph); ctx.fill();
    ctx.fillStyle = '#2F7A55'; ctx.beginPath(); ctx.moveTo(px + pw * 0.3,py + ph); ctx.quadraticCurveTo(px + pw * 0.75,py + ph * 0.45,px + pw,py + ph * 0.8); ctx.lineTo(px + pw,py + ph); ctx.fill(); }
  else if (k === 1){ ctx.fillStyle = '#F2C94C'; ctx.fillRect(px,py,pw,ph); ctx.fillStyle = '#D9483B'; circ(ctx,px + pw * 0.35,py + ph * 0.45,ph * 0.3); ctx.fill();
    ctx.fillStyle = '#2F5E9E'; ctx.fillRect(px + pw * 0.5,py + ph * 0.18,pw * 0.4,ph * 0.62); ctx.fillStyle = '#1E1D21'; ctx.fillRect(px,py + ph * 0.78,pw,ph * 0.1); }
  else { ctx.fillStyle = '#E8D9C2'; ctx.fillRect(px,py,pw,ph); ctx.fillStyle = '#6C8FB4'; rr(ctx,px + pw * 0.33,py + ph * 0.5,pw * 0.34,ph * 0.5,2); ctx.fill();
    [[0.3,0.28,'#D9483B'],[0.52,0.18,'#F2C94C'],[0.72,0.3,'#E8608A']].forEach(f => { circ(ctx,px + pw * f[0],py + ph * f[1],ph * 0.12); ctx.fillStyle = f[2]; ctx.fill(); }); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(34,32,28,.5)'; ctx.lineWidth = 0.8; ctx.strokeRect(px,py,pw,ph);
}
function drawLuxoParede(ctx,g,tm){
  if (edDesenho) return;
  if (decorOn(g,'pisca')) drawPisca(ctx,tm);
  if (decorOn(g,'chita')) drawCortinaChita(ctx,LUXO_JAN[Math.max(0,Math.min(3,((g.ponto && g.ponto.nivel) || 1) - 1))]);
  const Q = LUXO_QUADROS[Math.max(0,Math.min(3,((g.ponto && g.ponto.nivel) || 1) - 1))];
  if (decorOn(g,'quadros') && Q) Q.forEach(q => drawQuadro(ctx,q[0],q[1],q[2],q[3],q[4]));
}
/* o fio de quem pende do teto: sobe da peça e vai sumindo, porque o teto fica fora do quadro */
function drawFioTeto(ctx,x,y,len,cor,lw){
  const gr = ctx.createLinearGradient(0,y,0,y - len);
  gr.addColorStop(0,cor); gr.addColorStop(1,'rgba(43,42,38,0)');
  ctx.strokeStyle = gr; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y - len); ctx.stroke();
}
/* a luminária de fábrica: o fio sobe até sumir e a cúpula de esmalte verde fica sobre a mesa; (x, y) é o meio da cúpula */
function drawLuminaria(ctx,x,y){
  if (y > 100) drawFioTeto(ctx,x,y - 9,Math.min(46,y - 94),'#2B2A26',1.6);
  ctx.fillStyle = 'rgba(255,233,166,.11)'; ctx.beginPath(); ctx.moveTo(x - 14,y + 8); ctx.lineTo(x + 14,y + 8); ctx.lineTo(x + 46,y + 62); ctx.lineTo(x - 46,y + 62); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 21,y + 7); ctx.quadraticCurveTo(x - 21,y - 9,x,y - 9); ctx.quadraticCurveTo(x + 21,y - 9,x + 21,y + 7); ctx.closePath(); fs(ctx,'#2F6B57',2);
  ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.moveTo(x - 15,y + 2); ctx.quadraticCurveTo(x - 15,y - 5,x - 5,y - 6); ctx.lineTo(x - 7,y - 3); ctx.quadraticCurveTo(x - 12,y - 2,x - 12,y + 2); ctx.closePath(); ctx.fill();
  ell(ctx,x,y + 7,21,3.4); fs(ctx,'#1E4A3C',1.8);
  circ(ctx,x,y + 8.5,3.6); fs(ctx,'#FFE9A6',1.2);
}
/* o lustre de cristal: a corrente do teto, o aro dourado, as velas e os pingentes que brilham devagar; (x, y) é o aro */
function drawLustre(ctx,x,y,tm){
  drawFioTeto(ctx,x,y - 14,38,'#8C7A4A',2);
  [-20,-29].forEach(dy => { ell(ctx,x,y + dy,2.6,3.2); ctx.strokeStyle = '#B79B4A'; ctx.lineWidth = 1.4; ctx.stroke(); });
  ell(ctx,x,y + 6,46,18); ctx.fillStyle = 'rgba(255,236,170,.12)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x,y - 14); ctx.quadraticCurveTo(x - 20,y - 10,x - 30,y - 2); ctx.moveTo(x,y - 14); ctx.quadraticCurveTo(x + 20,y - 10,x + 30,y - 2); ctx.strokeStyle = '#C9953A'; ctx.lineWidth = 2.4; ctx.stroke();
  ell(ctx,x,y,32,7); fs(ctx,'#C9953A',2);
  [-24,-12,0,12,24].forEach(dx => { rr(ctx,x + dx - 2,y - 13 - (dx === 0 ? 4 : 0),4,9,1.2); fs(ctx,'#FFF6D8',1); ctx.beginPath(); ctx.moveTo(x + dx,y - 14 - (dx === 0 ? 4 : 0)); ctx.quadraticCurveTo(x + dx + 2.6,y - 19 - (dx === 0 ? 4 : 0),x + dx,y - 21 - (dx === 0 ? 4 : 0)); ctx.quadraticCurveTo(x + dx - 2.6,y - 19 - (dx === 0 ? 4 : 0),x + dx,y - 14 - (dx === 0 ? 4 : 0)); ctx.fillStyle = '#FFD36B'; ctx.fill(); });
  [-28,-20,-12,-4,4,12,20,28].forEach((dx,i) => {
    const len = 9 + (i % 3) * 4, on = RM ? 0.8 : 0.6 + 0.4 * Math.sin(tm * 2.4 + i * 1.3);
    ctx.strokeStyle = 'rgba(120,130,150,.7)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x + dx,y + 6); ctx.lineTo(x + dx,y + 6 + len - 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + dx,y + 4 + len); ctx.lineTo(x + dx - 2.6,y + 8 + len); ctx.lineTo(x + dx,y + 14 + len); ctx.lineTo(x + dx + 2.6,y + 8 + len); ctx.closePath();
    ctx.globalAlpha = 0.55 + 0.45 * on; fs(ctx,i % 2 ? '#E6F6FF' : '#CFE8F7',1); ctx.globalAlpha = 1;
  });
}
function drawSamambaia(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.strokeStyle = PAL.cromoEsc; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-14,-24); ctx.lineTo(4,-24); ctx.stroke();
  rr(ctx,-18,-29,5,10,1.5); fs(ctx,PAL.cromoEsc,1.2);
  ctx.strokeStyle = 'rgba(34,32,28,.55)'; ctx.lineWidth = 1;
  [-9,0,9].forEach(dx => { ctx.beginPath(); ctx.moveTo(0,-23); ctx.lineTo(dx,0); ctx.stroke(); });
  // folhas: arcos que caem dos dois lados, com os folíolos
  const folha = (ang, len, cor) => {
    ctx.save(); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(len*0.5,-len*0.25,len,len*0.35); ctx.strokeStyle = cor; ctx.lineWidth = 2; ctx.stroke();
    for (let k=0.15;k<0.95;k+=0.12){
      const px = len*k, py = -len*0.25*2*k*(1-k) + len*0.35*k*k, w = 4.5*(1-k*0.6);
      ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px-1.5,py-w); ctx.moveTo(px,py); ctx.lineTo(px+1.5,py+w); ctx.lineWidth = 1.6; ctx.stroke();
    }
    ctx.restore();
  };
  [[-2.5,22,'#3E8A47'],[-2.1,26,'#4E9F52'],[-1.7,20,'#3E8A47'],[-1.3,16,'#5DB061'],[-0.7,20,'#4E9F52'],[-0.25,24,'#3E8A47'],[0.15,20,'#5DB061']].forEach(f => {
    ctx.save(); ctx.translate(0,1); folha(f[0] + Math.PI/2 - 1.57, f[1], f[2]); ctx.restore();
  });
  [[1.9,24,'#4E9F52'],[2.4,20,'#3E8A47'],[2.9,26,'#5DB061']].forEach(f => { ctx.save(); ctx.translate(0,1); ctx.scale(-1,1); folha(Math.PI - f[0], f[1], f[2]); ctx.restore(); });
  ctx.beginPath(); ctx.moveTo(-10,0); ctx.lineTo(10,0); ctx.lineTo(7,13); ctx.lineTo(-7,13); ctx.closePath(); fs(ctx,'#C9673B',1.8);
  rr(ctx,-11,-2,22,4,1.5); fs(ctx,'#B85A30',1.6);
  ctx.restore();
}
/* foto da Rosa, a mãe da Bia (a mesma da abertura: coque, a rosa no cabelo, roupa rosa), num porta-retrato de
   madeira pendurado num prego; (x, y) é o centro */
function drawFotoRosa(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.strokeStyle = 'rgba(34,32,28,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-9,-21); ctx.lineTo(0,-28); ctx.lineTo(9,-21); ctx.stroke();
  circ(ctx,0,-28,1.6); fs(ctx,PAL.cromoEsc,1);
  rr(ctx,-17,-22,34,42,3); fs(ctx,PAL.madeira,2.2);
  ctx.save(); rr(ctx,-12,-17,24,32,1.5); ctx.fillStyle = '#F6E7C9'; ctx.fill(); ctx.clip();
  ctx.fillStyle = 'rgba(242,194,61,.35)'; circ(ctx,0,-4,14); ctx.fill();
  drawPerson(ctx,{ skin:3, hair:2, hairC:'#1B1512', pants:'#4A4036' },0,30,{ s:0.62, shirt:'#C8506A', mood:0, noShadow:true });
  ctx.restore();
  abFlor(ctx,8,-12,2.2);
  rr(ctx,-12,-17,24,32,1.5); ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.restore();
}
/* plaquinha "Comida é afeto": tábua clara pintada à mão, pendurada no letreiro por 2 cordinhas; (x, y) é o centro */
function drawPlaquinha(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s); ctx.rotate(0.03);
  ctx.strokeStyle = 'rgba(34,32,28,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-34,-7); ctx.lineTo(-30,-14); ctx.moveTo(34,-7); ctx.lineTo(30,-14); ctx.stroke();
  rr(ctx,-46,-8,92,16,3); fs(ctx,'#F4E2C0',2);
  txt(ctx,'Comida é afeto',-4,0.5,10,PAL.faixa,'center',FB);
  const hx = 37, hy = 0;
  ctx.beginPath(); ctx.moveTo(hx,hy+3.5); ctx.bezierCurveTo(hx-6,hy-1,hx-3,hy-6,hx,hy-2.5); ctx.bezierCurveTo(hx+3,hy-6,hx+6,hy-1,hx,hy+3.5); ctx.closePath(); ctx.fillStyle = PAL.perigo; ctx.fill();
  ctx.restore();
}
/* quadro de giz num cavalete de madeira, com o prato do dia escrito à mão; (x, y) é o chão, entre os pés */
function drawGiz(ctx,x,y,s,g){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  shadowEll(ctx,0,0,26,4,0.18);
  ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 3.2;
  ctx.beginPath(); ctx.moveTo(-16,-50); ctx.lineTo(-22,0); ctx.moveTo(16,-50); ctx.lineTo(22,0); ctx.moveTo(0,-46); ctx.lineTo(0,-2); ctx.stroke();
  rr(ctx,-24,-54,48,40,3); fs(ctx,PAL.madeira,2.2);
  rr(ctx,-20,-50,40,32,2); fs(ctx,'#2E3B35',1.4);
  txt(ctx,'HOJE',0,-43,7,'rgba(255,255,255,.85)','center',FB);
  const pt = g && g.ponto;
  txt(ctx,'PF R$ ' + precoPrato('pf', pt, g && g.cursos),0,-33,9,'#FFF3C9','center',FB);
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-12,-26); ctx.quadraticCurveTo(0,-23,12,-26); ctx.stroke();
  circ(ctx,13,-22,1.6); ctx.fillStyle = '#F7B6C8'; ctx.fill();
  rr(ctx,-20,-16,40,3,1); fs(ctx,PAL.madeiraEsc,1);
  ctx.fillStyle = '#fff'; ctx.fillRect(-14,-17.5,6,2);   // o toquinho de giz
  ctx.restore();
}
/* espada-de-são-jorge (v7.7): folhas compridas e pontudas, verde-escuras com faixas claras e a borda amarela;
   (x, y) é a terra do vaso */
function drawEspada(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  [[-9,-44,-0.22],[9,-48,0.2],[-4,-62,-0.06],[4,-56,0.1],[0,-70,0]].forEach(([bx,h,r]) => {
    ctx.save(); ctx.translate(bx,0); ctx.rotate(r);
    ctx.beginPath(); ctx.moveTo(-5,0); ctx.quadraticCurveTo(-6,h*0.55,0,h); ctx.quadraticCurveTo(6,h*0.55,5,0); ctx.closePath(); fs(ctx,'#D9C24A',1.6);
    ctx.beginPath(); ctx.moveTo(-3.2,0); ctx.quadraticCurveTo(-4,h*0.55,0,h + 5); ctx.quadraticCurveTo(4,h*0.55,3.2,0); ctx.closePath(); ctx.fillStyle = '#2F6B3A'; ctx.fill();
    ctx.strokeStyle = 'rgba(190,226,160,.55)'; ctx.lineWidth = 1.2;
    for (let k=0.2;k<0.8;k+=0.17){ ctx.beginPath(); ctx.moveTo(-2.6,h*k); ctx.lineTo(2.6,h*k - 2); ctx.stroke(); }
    ctx.restore();
  });
  ctx.restore();
}
/* estação da bebida da espera: na Garagem (v7.7), a torneira; na área industrial (v9), a jarra de suco num caixote; na Avenida (v9.1), a mesinha das águas */
function drawMaquina(ctx,g,t,menu){
  if (g.bebida.id === 'agua') return drawTorneiraEspera(ctx,g,t,menu);
  if (g.bebida.id === 'saborizada') return drawAguasEspera(ctx,g,t,menu);   // v9.1
  if (g.bebida.id === 'coquetel') return drawCarrinhoBoasVindas(ctx,g,t,menu);   // v10.3
  const r = STATIONS.maquina.rect, x = r.x + r.w / 2, y = r.y + r.h;
  shadowEll(ctx,x,y-2,36,6,0.2);
  rr(ctx,x-32,y-26,64,24,3); fs(ctx,PAL.madeira,2.2);   // o caixote de feira
  ctx.strokeStyle = 'rgba(34,32,28,.3)'; ctx.lineWidth = 1.2; [-10,10].forEach(dx => { ctx.beginPath(); ctx.moveTo(x+dx,y-24); ctx.lineTo(x+dx,y-4); ctx.stroke(); });
  const prep = !menu && g.maq.some(o => o.t > 0), pr = menu ? 0 : g.maqPronto().reduce((a,o) => a + o.n, 0);
  drawJarraSuco(ctx,x-12,y-24,0.95,0.55 + (prep && !RM ? 0.12 * Math.sin(t*5) : 0));
  for (let i=0;i<3;i++){ const cx = x+10+i*9; rr(ctx,cx-3.5,y-35,7,11,2); fs(ctx,i < pr ? 'rgba(242,140,40,.85)' : 'rgba(214,236,246,.9)',1.4); }   // os copos; cheios os que estão prontos
  if (menu) return;
  if (pr){
    const p = RM ? 1 : 1 + 0.08 * Math.sin(t*7);
    ctx.save(); ctx.translate(x+30,y-50); ctx.scale(p,p); circ(ctx,0,0,11); fs(ctx,PAL.ok,2); txt(ctx,String(pr),0,1,13,'#fff','center',FD); ctx.restore();   // copos prontos
  }
  const a0 = g.bia.acts[0];
  if (a0 && a0.type === 'maquina' && a0.leg !== 2){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
/* torneira da espera (v7.7): um caixote de feira com os copos americanos de boca para baixo e, ao lado, o cano
   saindo do chão, a torneira e o ralo embaixo da bica. A Bia enchendo: o fio d'água (parado com prefers-reduced-motion) e o copo.
   A bolinha verde diz quantos copos pediram */
function drawTorneiraEspera(ctx,g,t,menu){
  const r = STATIONS.maquina.rect, x = r.x + r.w / 2, y = r.y + r.h;
  const px = x + 4, tx = px + 28, ty = y - 40;
  shadowEll(ctx,x,y-4,32,5,0.16);
  ell(ctx,tx,y-8,9,3.5); fs(ctx,'#8D8A82',1.6);   // ralo
  ctx.strokeStyle = 'rgba(34,32,28,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx-5,y-8); ctx.lineTo(tx+5,y-8); ctx.stroke();
  rr(ctx,px-4,ty-14,8,y - ty + 8,2); fs(ctx,PAL.cromoEsc,2);   // cano
  ell(ctx,px,y-6,7,2.5); fs(ctx,PAL.cromoEsc,1.4);
  drawTorneira(ctx,tx,ty,1);
  const a0 = g.bia.doing, enche = !menu && a0 && a0.type === 'maquina' && a0.leg !== 2;
  if (enche){
    ctx.fillStyle = 'rgba(110,184,234,.85)'; ctx.fillRect(tx-1.2,ty,2.4,14 + (RM ? 0 : Math.sin(t*20)));
    drawIcon(ctx,'agua',tx,ty + 22,0.62);
  }
  // caixote com os copos virados
  const cx = x - 15, cy = y - 6;
  rr(ctx,cx-16,cy-20,32,20,2); fs(ctx,PAL.madeira,2);
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(cx-16,cy-10); ctx.lineTo(cx+16,cy-10); ctx.stroke();
  for (let i=0;i<3;i++){
    ctx.save(); ctx.translate(cx - 10 + i*10,cy - 27); ctx.rotate(Math.PI); ctx.scale(0.5,0.5);
    ctx.beginPath(); ctx.moveTo(-7,-10); ctx.lineTo(7,-10); ctx.lineTo(5,11); ctx.lineTo(-5,11); ctx.closePath(); fs(ctx,'rgba(236,246,250,.95)',2.6);
    ctx.restore();
  }
  txt(ctx,'ÁGUA',cx,cy - 5,8,'#fff','center',FD);
  if (menu) return;
  const pr = g.maqPronto().reduce((a,o) => a + o.n, 0);
  if (pr){
    const p = RM ? 1 : 1 + 0.08 * Math.sin(t*7);
    ctx.save(); ctx.translate(x+14,r.y + 6); ctx.scale(p,p); circ(ctx,0,0,11); fs(ctx,PAL.ok,2); txt(ctx,String(pr),0,1,13,'#fff','center',FD); ctx.restore();   // copos pedidos
  }
  const q = g.bia.acts[0];
  if (q && q.type === 'maquina' && q.leg !== 2){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
/* ============================================================
   BALCÃO DE RETIRADA (v8.6): na calçada, ao lado do portão. Um balcão de madeira com a plaquinha da retirada e o
   adesivo da Efood; no tampo, a prateleira das marmitas: MARMITA.vagas lugares das adiantadas e, à direita, o da
   encomenda (tracejado). Os entregadores esperam em pé à esquerda dele
   ============================================================ */
const EFOOD_COR = '#E26A2C';
/* selo da marmita: a do entregador, um "E" laranja (Efood); a sem dono, o anel da validade (verde, amarelo, vermelho) */
function drawMarmitaSelo(ctx,m,x,y){
  circ(ctx,x,y,7.5); fs(ctx,m.dono ? EFOOD_COR : '#fff',1.6);
  if (m.jogar){ ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x-4,y-4); ctx.lineTo(x+4,y+4); ctx.moveTo(x+4,y-4); ctx.lineTo(x-4,y+4); ctx.stroke(); return; }   // v9.6.5: o entregador desistiu: vai pro lixo
  if (m.dono){ txt(ctx,'E',x,y+0.5,10,'#fff','center',FD); return; }
  const f = clamp(1 - m.age / MARMITA.validade, 0, 1);
  ctx.beginPath(); ctx.moveTo(x,y); ctx.arc(x,y,5.5,-Math.PI/2,-Math.PI/2 + TAU*f); ctx.closePath();
  ctx.fillStyle = f > 0.5 ? PAL.ok : f > 0.25 ? PAL.mostarda : PAL.perigo; ctx.fill();
}
/* onde fica cada marmita da prateleira: as sem dono nos lugares das adiantadas; as encomendas no da reserva */
/* o x de cada vaga da prateleira (v9): as da Garagem e, com mais vagas, igualmente espaçadas no tampo; a última é a da encomenda */
function prateleiraXs(n){
  if (n <= MARMITA.vagas) return RETIRADA.vagas;
  const B = RETIRADA.balcao, a = B.x0 + 8, st = (B.x1 - B.x0 - 16) / n;
  return Array.from({ length:n + 1 }, (_, i) => a + st * i);
}
function prateleiraPos(g){
  let l = 0, e = 0;
  const n = g.vagas, xs = prateleiraXs(n);
  return g.prateleira.map(m => m.dono ? { m, x:xs[n] + 8 * e++ } : { m, x:xs[Math.min(l++, n - 1)] });
}
function drawRetirada(ctx,g,t){
  const B = RETIRADA.balcao, w = B.x1 - B.x0, y = B.y;
  shadowEll(ctx,(B.x0 + B.x1) / 2,y + 54,w / 2 + 6,6,0.18);
  rr(ctx,B.x0,y + 10,w,42,4); fs(ctx,PAL.madeira,2.4);   // a frente
  ctx.strokeStyle = 'rgba(34,32,28,.25)'; ctx.lineWidth = 1.2;
  for (let x = B.x0 + 13; x < B.x1; x += 13){ ctx.beginPath(); ctx.moveTo(x,y + 13); ctx.lineTo(x,y + 49); ctx.stroke(); }
  rr(ctx,B.x0 + 8,y + 18,w - 30,15,4); fs(ctx,EFOOD_COR,1.8);
  txt(ctx,'RETIRADA',B.x0 + 8 + (w - 30) / 2,y + 26,9,'#fff','center',FD);
  rr(ctx,B.x1 - 18,y + 18,12,12,3); fs(ctx,'#fff',1.4); txt(ctx,'E',B.x1 - 12,y + 24.5,9,EFOOD_COR,'center',FD);   // o adesivo da Efood
  rr(ctx,B.x0 - 4,y,w + 8,12,4); fs(ctx,'#E3C79A',2.4);   // o tampo
  if (g.state === 'menu') return;
  // a vaga da encomenda, tracejada
  const xr = prateleiraXs(g.vagas)[g.vagas], ps = g.vagas > MARMITA.vagas ? 0.58 : 0.68;
  ctx.save(); ctx.setLineDash([3,2]); ctx.strokeStyle = 'rgba(226,106,44,.8)'; ctx.lineWidth = 1.4; rr(ctx,xr - 10,y - 9,20,13,3); ctx.stroke(); ctx.restore();
  for (let i = 0; i < g.potes; i++) drawIcon(ctx,'doce',B.x0 + 4 + 11 * i,y - 6,0.46,doceIcone(g.up));   // v9.2: os potes de doce à espera dos entregadores
  prateleiraPos(g).forEach(o => {
    drawMarmita(ctx,o.m.dish,o.x,y - 4,ps);
    drawMarmitaSelo(ctx,o.m,o.x + 6,y - 14);
  });
  const a0 = g.bia.acts[0];
  if (a0 && a0.type === 'retirada'){ ctx.save(); const al = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + al + ')'; ctx.lineWidth = 5; const r = STATIONS.retirada.rect; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
/* o balão do entregador (v8.6): a marmita dele no fogão (anel do preparo), pronta na janela (verde, pulsando) ou a
   caminho (na mão da Bia ou da Dani) */
function drawRetiradaBalao(ctx,g,grp,tm){
  if (!grp.path.length) drawLetreiroEfood(ctx,grp,tm);   // v9.6.11
  const dq = grp.docesMarm - grp.docesMarmDados;   // v9.2: "+ doce" na marmita (o pote na prateleira ou o doce da geladeirinha)
  if (dq > 0 && !grp.path.length){ ctx.save(); ctx.translate(grp.x - 24,grp.y - 92); drawBubble(ctx,0,0,13,'#fff'); drawIcon(ctx,'doce',0,1,0.6,doceIcone(grp.game.up)); if (dq > 1) txt(ctx,'×' + dq,13,-10,9,PAL.tinta,'center',FD); ctx.restore(); }
  const o = g.marmitas().find(q => q.m.dono === grp);
  if (!o || grp.path.length) return;
  const pronta = o.onde === 'pronta', p = pronta && !RM ? 1 + 0.1 * Math.sin(tm*8) : 1;
  ctx.save(); ctx.translate(grp.x + 24,grp.y - 92); ctx.scale(p,p);
  drawBubble(ctx,0,0,15,pronta ? PAL.ok : '#fff');
  drawMarmita(ctx,o.m.dish,0,1,0.62);
  if (o.onde === 'fogao') drawRing(ctx,0,0,15,o.m.p / o.m.time,PAL.alerta);
  if (o.onde === 'mao'){ circ(ctx,12,-11,7); fs(ctx,PAL.mostarda,1.4); txt(ctx,'→',12,-11,10,PAL.tinta,'center',FD); }
  ctx.restore();
}
/* espuminha saindo da pia enquanto alguém (Bia, Dani ou Tonhão) lava a louça */
function drawEspuma(ctx,g,t){
  const k = g.kitchen;
  if (!(g.bia.washing || g.dani.washing || g.joca.washing || (k.chef.wash > 0 && k.sinkN > 0))) return;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.strokeStyle = 'rgba(120,180,215,.9)'; ctx.lineWidth = 1.4;
  [[808,452,7],[822,447,9],[838,452,8],[854,446,9],[868,452,8],[878,456,6]].forEach(c => { circ(ctx,c[0],c[1],c[2]); ctx.fill(); ctx.stroke(); });
  for (let i=0;i<9;i++){
    const p = RM ? (i%3)/3 : ((t*0.7 + i*0.37) % 1), r = 2.5 + (i%3)*1.6;
    const x = 806 + ((i*23) % 76) + (RM ? 0 : Math.sin(t*4 + i)*3), y = 440 - p*46;
    ctx.globalAlpha = 1 - p*0.85;
    circ(ctx,x,y,r); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillRect(x-r*0.45,y-r*0.45,1.6,1.6);
  }
  ctx.restore();
}
/* geladeirinha branca de porta de vidro com potinhos de doce (v9.2) */
function drawGeladeiraDoces(ctx,g,t){
  const r = STATIONS.doces.rect, x = r.x, y = r.y, gm = !!g.up.confGourmet;
  shadowEll(ctx,x + r.w/2,y + r.h + 1,r.w/2 - 2,3.5,0.2);
  if (gm){   // v9.3, a vitrine refrigerada (Confeitaria gourmet): moldura dourada, vidro com luz quente, doces nos pratinhos e o letreiro
    rr(ctx,x + 1,y - 2,r.w - 2,r.h + 2,6); fs(ctx,'#E9D9B0',2.2);
    rr(ctx,x + 6,y + 24,r.w - 14,r.h - 32,4); fs(ctx,'#FFF3E4',1.6);
    ctx.fillStyle = 'rgba(214,160,60,.9)'; ctx.fillRect(x + 7,y + r.h/2 + 9,r.w - 16,2.4);
    const b0 = g.up.confAlta ? 6 : 3;   // v10.2: com a alta confeitaria, entremet, mil-folhas e macarons
    [0,1,2].forEach(i => { drawIcon(ctx,'doce',x + 15 + i * 11,y + 33,0.45,b0 + i); drawIcon(ctx,'doce',x + 15 + i * 11,y + 50,0.45,b0 + (i + 1) % 3); });
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + 9,y + 26,3,r.h - 36);
    rr(ctx,x + 4,y + 13,r.w - 8,9,3); fs(ctx,'#8A1F3D',1.6); txt(ctx,g.up.confAlta ? 'ALTA' : 'GOURMET',x + r.w/2,y + 17.6,6.5,'#FFE6A8','center',FD);
  } else {
  rr(ctx,x + 2,y,r.w - 4,r.h,6); fs(ctx,'#F4F7F8',2.2);
  rr(ctx,x + 7,y + 15,r.w - 20,r.h - 24,4); fs(ctx,'#CFE7EE',1.6);
  ctx.fillStyle = 'rgba(34,32,28,.35)'; ctx.fillRect(x + 8,y + r.h/2 + 7,r.w - 22,2);
  [0,1,2].forEach(i => { drawIcon(ctx,'doce',x + 15 + i * 10.5,y + 28,0.45,i); drawIcon(ctx,'doce',x + 15 + i * 10.5,y + 46,0.45,(i + 1) % 3); });
  }
  rr(ctx,x + r.w - 11,y + 26,3.4,20,1.7); fs(ctx,PAL.cromo,1.2);
  // v9.6.6: a plaquinha rosa em cima, sempre
  rr(ctx,x + 2,y + 1,r.w - 4,12,4); fs(ctx,'#D9577A',1.8); txt(ctx,'DOCES',x + r.w/2,y + 7.4,8,'#fff','center',FD);
  // o selo NOVO! (mostarda, pulsando) até 5 doces entregues na carreira; no modo dev, nunca
  if (!devLivre() && ((g.save && g.save.docesTot) || 0) < 5){
    const k = RM ? 1 : 1 + 0.08 * Math.sin(t * 5);
    ctx.save(); ctx.translate(x + r.w/2,y + r.h + 10); ctx.scale(k,k);   // v9.6.9: embaixo da vitrine, sem girar
    rr(ctx,-17,-7,34,14,5); fs(ctx,PAL.mostarda,1.6); txt(ctx,'NOVO!',0,0.6,9,PAL.tinta,'center',FD); ctx.restore();
  }
  const n = g.docesRet ? g.docesRet() - g.potes : 0;
  if (n > 0) { circ(ctx,x + r.w - 8,y + 3,6.5); fs(ctx,PAL.mostarda,1.4); txt(ctx,String(n),x + r.w - 8,y + 3.5,9,PAL.tinta,'center',FD); }   // doce de marmita pedido e ainda sem pote no balcão
}
/* máquina de espresso no chão, ao lado da bancada do café (v9.3, curso do Joca): armário de madeira, corpo cromado vinho com 2 saídas, manômetro,
   xicrinhas no topo e o vaporizador */
function drawEspresso(ctx,g,tm){
  const r = STATIONS.espresso.rect, x = r.x, y = r.y;
  shadowEll(ctx,x + r.w/2,y + r.h + 1,r.w/2 - 1,3.5,0.22);
  rr(ctx,x + 3,y + 34,r.w - 6,r.h - 34,4); fs(ctx,'#7A5230',2);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x + 7,y + 38,3,r.h - 42);
  rr(ctx,x,y + 10,r.w,28,6); fs(ctx,PAL.inox,2.4);
  rr(ctx,x,y + 10,r.w,9,5); fs(ctx,'#8A1F3D',2);
  circ(ctx,x + r.w/2,y + 25,5); fs(ctx,'#fff',1.6); ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + r.w/2,y + 25); ctx.lineTo(x + r.w/2 + 2.6,y + 22.6); ctx.stroke();
  [x + 8,x + r.w - 17].forEach(px => { rr(ctx,px,y + 33,9,6,2); fs(ctx,PAL.cromo,1.4); rr(ctx,px + 1.5,y + 38,6,6,2); fs(ctx,PAL.tinta,1.2); });
  ctx.strokeStyle = PAL.cromo; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x + r.w - 2,y + 26); ctx.lineTo(x + r.w + 3,y + 30); ctx.lineTo(x + r.w + 3,y + 40); ctx.stroke();
  [x + 9,x + 20].forEach(px => { rr(ctx,px,y + 3,8,7,2); fs(ctx,'#fff',1.4); ctx.fillStyle = '#3A1F12'; ctx.fillRect(px + 1.4,y + 4.4,5.2,1.8); });
  if (!RM && g.state !== 'menu'){
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.6;
    for (let i = 0; i < 2; i++){ const px = x + 12 + i * 11, ph = tm * 2 + i; ctx.beginPath(); ctx.moveTo(px,y + 2); ctx.quadraticCurveTo(px - 3 + Math.sin(ph) * 2,y - 4,px,y - 9); ctx.stroke(); }
  }
}
/* v10.3: o café que está sendo feito agora na máquina (a Bia ou o Joca): { f: 0 a 1, cafe } ou null */
function espressoTrabalho(g){
  const b = g.bia;
  if (b.phase === 'do' && b.doing && b.doing.type === 'espresso'){ const c = cafeDe(b.doing.item); return { f:1 - b.timer / Math.max(0.1, c.prep), cafe:c }; }
  for (const h of g.ajud){
    if (h.active && h.phase === 'do' && h.plan && h.plan.type === 'espresso' && h.plan.ids.length){
      const tot = h.plan.ids.reduce((a, id) => a + cafeDe(id).prep, 0), c = cafeDe(h.plan.ids[0]);
      return { f:1 - h.timer / Math.max(0.1, tot), cafe:c };
    }
  }
  return null;
}
/* v10.3, os cafés especiais na bancada: o filtro, a prensa e a jarra em cima da máquina e, enquanto o café é feito, o anel de progresso com uma marca por etapa
   (moer, passar ou prensar, servir): as marcas já cumpridas acendem */
function drawCafesEsp(ctx,g,tm){
  const r = STATIONS.espresso.rect, x = r.x, y = r.y - 12;
  [2, 3, 4].forEach((k, i) => { drawIcon(ctx,'cafeesp',x + 8 + i * 15,y,0.4,k); });
  const w = g.state === 'menu' ? null : espressoTrabalho(g);
  if (!w || !w.cafe.etapas) return;
  const cx = x + r.w / 2, cy = y - 26, n = w.cafe.etapas;
  circ(ctx,cx,cy,13); fs(ctx,'rgba(255,255,255,.9)',1.6);
  drawRing(ctx,cx,cy,9,w.f,PAL.alerta);
  for (let i = 0; i < n; i++){
    const a = -Math.PI / 2 + TAU * i / n, on = w.f >= i / n + 0.001;
    circ(ctx,cx + Math.cos(a) * 14.5,cy + Math.sin(a) * 14.5,2.6); fs(ctx,on ? PAL.ok : '#fff',1.2);
  }
  drawIcon(ctx,'cafeesp',cx,cy + 1,0.5,cafeIdx(w.cafe.id));
}
/* lixeira de pedal no chão do salão, encostada no balcão */
/* Dani: cabelo cacheado, avental roxo e crachá com o nome */
const DANI_LOOK = { skin:3, hair:5, hairC:'#2F1D12', pants:'#3C5A4A', kid:false, elder:false, acc:null, glasses:false };
/* v9.6.9: os crachás só aparecem nos primeiros 20 s do dia (somem aos poucos de 17 a 20 s); render() ajusta */
let CRACHA_A = 1;
function drawDani(ctx,d,tm){
  drawPerson(ctx,DANI_LOOK,d.x,d.y,{ shirt:'#F7EFD8', moving:d.moving, ph:d.walkPh, mood:0, t:tm, lava:d.washing && !RM });
  const bob = (d.moving && !RM) ? -Math.abs(Math.sin(d.walkPh)) * 2.4 : 0;
  ctx.beginPath(); ctx.moveTo(d.x-8,d.y-30+bob); ctx.lineTo(d.x+8,d.y-30+bob); ctx.lineTo(d.x+11,d.y-12); ctx.lineTo(d.x-11,d.y-12); ctx.closePath(); fs(ctx,'#7B4FB5',2.2);
  if (CRACHA_A > 0){ ctx.save(); ctx.globalAlpha *= CRACHA_A; rr(ctx,d.x-14,d.y-84,28,12,5); fs(ctx,'#fff',1.6); txt(ctx,'Dani',d.x,d.y-77.5,9,'#7B4FB5','center',FD); ctx.restore(); }
  d.hands.forEach((h,i) => drawHandItem(ctx,h.kind === 'coffee' ? { kind:'coffee' } : h,d.x + (i ? 18 : -18),d.y - 28,0.7));   // sem o número da mesa em cima do café
}
/* Joca (v9.2): rapaz de uns 20 anos, pele parda, cabelo cacheado preto curto, óculos redondos, camiseta cinza, avental azul-marinho e crachá;
   os níveis 3 e 4 mudam o avental (faixa branca; azul mais vivo com bolso) */
const JOCA_LOOK = { skin:4, hair:0, hairC:'#1B1512', pants:'#4A4D55', kid:false, elder:false, acc:null, glasses:true };
const JOCA_AVENTAL = [null, null, '#243B63', '#1F4E8C', '#17639E'];
function drawJoca(ctx,d,tm){
  drawPerson(ctx,JOCA_LOOK,d.x,d.y,{ shirt:'#B9BDC4', moving:d.moving, ph:d.walkPh, mood:0, t:tm, lava:d.washing && !RM });
  const bob = (d.moving && !RM) ? -Math.abs(Math.sin(d.walkPh)) * 2.4 : 0, lv = d.level;
  ctx.beginPath(); ctx.moveTo(d.x-8,d.y-30+bob); ctx.lineTo(d.x+8,d.y-30+bob); ctx.lineTo(d.x+11,d.y-12); ctx.lineTo(d.x-11,d.y-12); ctx.closePath(); fs(ctx,JOCA_AVENTAL[lv] || JOCA_AVENTAL[2],2.2);
  if (lv >= 3){ ctx.fillStyle = '#fff'; ctx.fillRect(d.x-9.5,d.y-17+bob,19,2.2); }
  if (lv >= 4){ rr(ctx,d.x+1,d.y-26+bob,7,6,1.5); fs(ctx,'#fff',1.2); }
  if (CRACHA_A > 0){ ctx.save(); ctx.globalAlpha *= CRACHA_A; rr(ctx,d.x-15,d.y-84,30,12,5); fs(ctx,'#fff',1.6); txt(ctx,'JOCA',d.x,d.y-77.5,9,'#2C7A7B','center',FD); ctx.restore(); }
  d.hands.forEach((h,i) => drawHandItem(ctx,h.kind === 'coffee' ? { kind:'coffee' } : h,d.x + (i ? 18 : -18),d.y - 28,0.7));
}
/* Cami (v9.3): mulher de uns 30 anos, pele morena clara, cabelo preto liso preso num rabo de cavalo alto, polo vinho (a cor da Avenida) com avental curto preto,
   crachá "CAMI" e tênis preto; o nível 2 ganha um tênis de corrida, o 3 uma caneta atrás da orelha e o bloquinho no avental */
const CAMI_LOOK = { skin:2, hair:2, hairC:'#1B1512', pants:'#2B2A2F', kid:false, elder:false, acc:null, glasses:false };
function drawCami(ctx,d,tm){
  drawPerson(ctx,CAMI_LOOK,d.x,d.y,{ shirt:'#8A1F3D', moving:d.moving, ph:d.walkPh, mood:0, t:tm, lava:d.washing && !RM });
  const bob = (d.moving && !RM) ? -Math.abs(Math.sin(d.walkPh)) * 2.4 : 0, lv = d.level;
  ctx.beginPath(); ctx.moveTo(d.x-8,d.y-26+bob); ctx.lineTo(d.x+8,d.y-26+bob); ctx.lineTo(d.x+10,d.y-12); ctx.lineTo(d.x-10,d.y-12); ctx.closePath(); fs(ctx,'#1E1D21',2.2);
  if (lv >= 2){ const sw = d.moving && !RM ? Math.sin(d.walkPh) * 3 : 0; ell(ctx,d.x-5+sw,d.y-0.5,5.2,2.8); fs(ctx,'#fff',1.4); ell(ctx,d.x+5-sw,d.y-0.5,5.2,2.8); fs(ctx,'#fff',1.4); ctx.fillStyle = PAL.perigo; ctx.fillRect(d.x-8+sw,d.y-1.6,6,1.6); ctx.fillRect(d.x+2-sw,d.y-1.6,6,1.6); }   // tênis de corrida
  if (lv >= 3){ rr(ctx,d.x+1,d.y-23+bob,7,6,1.5); fs(ctx,'#fff',1.2); ctx.strokeStyle = '#2C5AA0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(d.x-12,d.y-54+bob); ctx.lineTo(d.x-8,d.y-58+bob); ctx.stroke(); }
  if (CRACHA_A > 0){ ctx.save(); ctx.globalAlpha *= CRACHA_A; rr(ctx,d.x-15,d.y-84,30,12,5); fs(ctx,'#fff',1.6); txt(ctx,'CAMI',d.x,d.y-77.5,9,'#6B46C1','center',FD); ctx.restore(); }
  d.hands.forEach((h,i) => drawHandItem(ctx,h.kind === 'coffee' ? { kind:'coffee' } : h,d.x + (i ? 18 : -18),d.y - 28,0.7));
}
/* Anselmo (v9.5): coqueteleiro de uns 45 anos, pele negra retinta, cabeça raspada e barba grisalha curta, camisa branca de manga dobrada, colete preto,
   gravata-borboleta bordô e crachá "ANSELMO". d.busy: chacoalha a coqueteleira (parado com prefers-reduced-motion) */
const ANSELMO_LOOK = { skin:5, hair:4, hairC:'#1B1512', pants:'#1E1D21', kid:false, elder:false, acc:null, glasses:false };
function drawAnselmo(ctx,d,tm){
  drawPerson(ctx,ANSELMO_LOOK,d.x,d.y,{ shirt:'#FFFFFF', moving:false, mood:0, t:tm });
  const hy = d.y - 42;
  ctx.strokeStyle = '#B9B4AC'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(d.x,hy + 1,10.2,Math.PI * 0.18,Math.PI * 0.82); ctx.stroke();   // a barba grisalha
  ctx.beginPath(); ctx.moveTo(d.x-8,d.y-30); ctx.lineTo(d.x+8,d.y-30); ctx.lineTo(d.x+10,d.y-12); ctx.lineTo(d.x-10,d.y-12); ctx.closePath(); fs(ctx,'#1E1D21',2.2);   // o colete
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(d.x-3,d.y-30); ctx.lineTo(d.x,d.y-20); ctx.lineTo(d.x+3,d.y-30); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(d.x,d.y-31); ctx.lineTo(d.x-6,d.y-35); ctx.lineTo(d.x-6,d.y-27); ctx.closePath(); fs(ctx,'#8E3B46',1.3);   // a gravata-borboleta
  ctx.beginPath(); ctx.moveTo(d.x,d.y-31); ctx.lineTo(d.x+6,d.y-35); ctx.lineTo(d.x+6,d.y-27); ctx.closePath(); fs(ctx,'#8E3B46',1.3);
  if (CRACHA_A > 0){ ctx.save(); ctx.globalAlpha *= CRACHA_A; rr(ctx,d.x-19,d.y-84,38,12,5); fs(ctx,'#fff',1.6); txt(ctx,'ANSELMO',d.x,d.y-77.5,8,'#8E3B46','center',FD); ctx.restore(); }
  // a coqueteleira na mão direita, chacoalhando enquanto prepara
  const sh = d.busy && !RM ? Math.sin(tm * 18) * 3 : 0;
  ctx.save(); ctx.translate(d.x + 15,d.y - 40 + sh); ctx.rotate(d.busy && !RM ? 0.5 : 0.2);
  rr(ctx,-4,-9,8,18,2.5); fs(ctx,PAL.inox,1.6); rr(ctx,-3,-12,6,4,2); fs(ctx,PAL.cromo,1.2); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-2.4,-6,1.4,12);
  ctx.restore();
}
/* Lia (v10.2): ajudante de cozinha de uns 30 anos, pele parda, cabelo crespo preso num coque alto sob um lenço amarelo-mostarda, dólmã branca de mangas
   dobradas, avental cinza e crachá "LIA"; mexe uma panela (parada com prefers-reduced-motion) */
const LIA_LOOK = { skin:3, hair:5, hairC:'#1B1512', pants:'#3A3A40', kid:false, elder:false, acc:null, glasses:false };
function drawLia(ctx,d,tm){
  ctx.save(); ctx.translate(d.x,d.y); ctx.scale(d.s || 1,d.s || 1);   // (0, 0) são os pés dela; d.s: a escala (na janela da cozinha ela fica menor)
  drawPerson(ctx,LIA_LOOK,0,0,{ shirt:'#FFFFFF', moving:false, mood:0, t:tm });
  const hy = 0 - 42;
  circ(ctx,0,hy - 15,6.4); fs(ctx,'#1B1512',1.8);   // o coque alto
  ctx.beginPath(); ctx.arc(0,hy - 1,12.6,Math.PI * 1.08,Math.PI * 1.92); ctx.lineTo(0 + 12,hy - 4); ctx.quadraticCurveTo(0,hy - 9,0 - 12,hy - 4); ctx.closePath(); fs(ctx,'#D9A21B',1.8);   // o lenço amarelo-mostarda
  ctx.beginPath(); ctx.moveTo(0 - 3,hy - 12); ctx.lineTo(0 - 9,hy - 17); ctx.lineTo(0 - 7,hy - 10); ctx.closePath(); fs(ctx,'#D9A21B',1.2);   // a pontinha do nó
  ctx.beginPath(); ctx.moveTo(0 - 8,0 - 28); ctx.lineTo(0 + 8,0 - 28); ctx.lineTo(0 + 10,0 - 12); ctx.lineTo(0 - 10,0 - 12); ctx.closePath(); fs(ctx,'#8E939B',2.2);   // o avental cinza
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0 - 11,0 - 28); ctx.lineTo(0 - 15,0 - 24); ctx.moveTo(0 + 11,0 - 28); ctx.lineTo(0 + 15,0 - 24); ctx.stroke();   // as mangas dobradas
  // a panela na mão direita, mexida com a colher
  const sw = !RM ? Math.sin(tm * 5) * 3 : 0;
  ctx.save(); ctx.translate(0 + 17,0 - 24);
  rr(ctx,-7,-3,14,9,2.5); fs(ctx,PAL.inox,1.6); rr(ctx,-9,-4,18,3,1.5); fs(ctx,PAL.cromo,1.2);
  ctx.strokeStyle = '#8A5226'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(sw,-4); ctx.lineTo(sw - 6,-14); ctx.stroke();
  ctx.restore();
  if (CRACHA_A > 0){ ctx.save(); ctx.globalAlpha *= CRACHA_A; rr(ctx,0-13,0-84,26,12,5); fs(ctx,'#fff',1.6); txt(ctx,'LIA',0,0-77.5,9,'#5E7A3A','center',FD); ctx.restore(); }
  ctx.restore();
}
/* v10.3, o carrinho de boas-vindas do foyer (Terraço Suíça): carrinho dourado com tampo de madeira, toldinho listrado, garrafas e os coquetéis de autor
   (os prontos cheios; a bolinha verde diz quantos). Só nos dias em que o Anselmo vem */
function drawCarrinhoBoasVindas(ctx,g,t,menu){
  const r = STATIONS.maquina.rect, x = r.x + r.w / 2, y = r.y + r.h;
  shadowEll(ctx,x,y - 2,38,6,0.22);
  [-26,26].forEach(dx => { circ(ctx,x + dx,y - 6,6); fs(ctx,PAL.tinta,2); circ(ctx,x + dx,y - 6,2); fs(ctx,PAL.cromo,1); });
  rr(ctx,x - 36,y - 40,72,30,4); fs(ctx,'#C8A24A',2.2);
  rr(ctx,x - 38,y - 46,76,8,3); fs(ctx,'#6B4423',2);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x - 32,y - 36,3,20);
  for (let i = 0; i < 6; i++){ ctx.fillStyle = i % 2 ? '#fff' : '#8E3B46'; ctx.beginPath(); ctx.moveTo(x - 42 + i * 14,y - 78); ctx.lineTo(x - 28 + i * 14,y - 78); ctx.lineTo(x - 30 + i * 14,y - 66); ctx.lineTo(x - 40 + i * 14,y - 66); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 42,y - 78); ctx.lineTo(x + 42,y - 78); ctx.moveTo(x - 36,y - 66); ctx.lineTo(x - 36,y - 46); ctx.moveTo(x + 36,y - 66); ctx.lineTo(x + 36,y - 46); ctx.stroke();
  [['#BFE3F2', -22], ['#F08AA8', -14], ['#E2A92B', -6]].forEach(b => { rr(ctx,x + b[1] - 3,y - 62,6,15,2); fs(ctx,b[0],1.2); });
  const prep = !menu && g.maq.some(o => o.t > 0), pr = menu ? 0 : g.maqPronto().reduce((a,o) => a + o.n, 0);
  for (let i = 0; i < 3; i++){ const cx = x + 8 + i * 9; rr(ctx,cx - 3.5,y - 58,7,12,2); fs(ctx,i < pr ? ['#BFE3F2', '#F08AA8', '#E2A92B'][i] : 'rgba(214,236,246,.9)',1.4); }
  if (prep && !RM){ ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(x - 6,y - 54 - 3 * Math.abs(Math.sin(t * 5)),2,0,TAU); ctx.fill(); }
  if (menu) return;
  if (pr){
    const p = RM ? 1 : 1 + 0.08 * Math.sin(t * 7);
    ctx.save(); ctx.translate(x + 34,y - 62); ctx.scale(p,p); circ(ctx,0,0,11); fs(ctx,PAL.ok,2); txt(ctx,String(pr),0,1,13,'#fff','center',FD); ctx.restore();
  }
  const a0 = g.bia.acts[0];
  if (a0 && a0.type === 'maquina' && a0.leg !== 2){ ctx.save(); const a = 0.55 + 0.4 * Math.sin(t * 8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
/* o balcão de drinks (v9.5) na parede do fundo: prateleira com garrafas, o Anselmo atrás do tampo e, no tampo, os copos prontos (até drinkVagas: 2, ou 4 com a coquetelaria clássica) */
function drawBalcaoDrinks(ctx,g,tm){
  const r = STATIONS.drinks.rect, x = r.x, y = r.y;
  shadowEll(ctx,x + r.w/2,y + r.h + 1,r.w/2,3.5,0.22);
  rr(ctx,x,y,r.w,18,3); fs(ctx,'#6A4326',2);   // a prateleira
  [['#2F9E5A',6],['#F6A21E',16],['#D8334A',26],['#3F7FD0',36],['#F4D13A',46]].forEach(b => { rr(ctx,x + b[1],y - 6,6,15,2); fs(ctx,b[0],1.2); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x + b[1] + 1.2,y - 3,1.2,8); });
  drawAnselmo(ctx,{ x:ANSELMO_HOME.x, y:ANSELMO_HOME.y, busy:!!g.drinkJob },tm);
  rr(ctx,x - 2,y + 22,r.w + 4,r.h - 22,4); fs(ctx,'#8A5A34',2.4);   // a frente do balcão
  rr(ctx,x - 4,y + 18,r.w + 8,7,3); fs(ctx,'#B8814F',2);   // o tampo
  ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fillRect(x + 4,y + 30,r.w - 8,2);
  txt(ctx,'DRINKS',x + r.w/2,y + 38,8,'#FFE6A8','center',FD);
  const nv = drinkVagas(g.up);   // v10.3: 4 vagas com a clássica (copos menores e mais juntos)
  for (let i = 0; i < nv; i++){ const p = g.drinkPronto[i]; if (p) drawIcon(ctx,'drink',nv > 2 ? x + 10 + i * 13 : x + 16 + i * 26,y + 14,nv > 2 ? 0.5 : 0.7,drinkIdx(p.id)); }
}
/* couvert artístico: músico num banquinho, muda de instrumento conforme o dia */
const MUSICOS = [
  { look:{ skin:1, hair:1, hairC:'#5B3A21', pants:'#4A4036', glasses:false }, shirt:'#E0559A', inst:'violao' },
  { look:{ skin:5, hair:0, hairC:'#1B1512', pants:'#2F3E5C', glasses:true },  shirt:'#1FA6A0', inst:'sanfona' },
  { look:{ skin:3, hair:6, hairC:'#1B1512', pants:'#5B5F6B', glasses:false }, shirt:'#C9671E', inst:'cavaquinho' }
];
function drawMusico(ctx,g,tm){
  const m = MUSICOS[(g.day.n || 0) % MUSICOS.length], x = 186, y = 528;
  shadowEll(ctx,x,y,22,5,0.18);
  ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x-10,y); ctx.lineTo(x-7,y-16); ctx.moveTo(x+10,y); ctx.lineTo(x+7,y-16); ctx.stroke();
  ell(ctx,x,y-17,13,4); fs(ctx,PAL.madeira,2);
  drawPerson(ctx,m.look,x,y-26,{ sit:true, shirt:m.shirt, mood:0, bob: RM ? 0 : Math.sin(tm*4)*1 });
  ctx.save(); ctx.translate(x+2,y-24);
  if (m.inst === 'sanfona'){ rr(ctx,-14,-10,28,16,3); fs(ctx,PAL.formica,2); ctx.fillStyle = '#fff'; for (let i=0;i<4;i++) ctx.fillRect(-11+i*6,-7,3,10); }
  else { const big = m.inst === 'violao'; ctx.rotate(-0.5); ell(ctx,0,0,big?10:7,big?8:6); fs(ctx,'#B5733A',2); circ(ctx,0,0,big?3:2); ctx.fillStyle = PAL.tinta; ctx.fill(); rr(ctx,8,-2,big?22:16,4,1); fs(ctx,PAL.madeiraEsc,1.4); }
  ctx.restore();
  if (!RM){ for (let i=0;i<2;i++){ const p = (tm*0.6 + i*0.5) % 1; ctx.globalAlpha = 1 - p; txt(ctx,'♪',x+14+i*10,y-56-p*30,14,PAL.faixa,'center',FB); ctx.globalAlpha = 1; } }
  else txt(ctx,'♪',x+16,y-62,14,PAL.faixa,'center',FB);
}
/* ambiente da Garagem (v7.4.3): TV de tubo passando a Rede Esfera e aparelho de som na rádio Velha Brasil FM.
   drawTv e drawSom desenham com a base em (x, y); a TV troca de programa a cada 6 s (parada, só o logo) */
function drawTv(ctx,x,y,tm,s,jogo){   // v10.6: jogo 1 = o campo (o dia de jogo do Brasil), 2 = a comemoração do gol
  ctx.save(); ctx.translate(x,y); if (s) ctx.scale(s,s);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-4,-42); ctx.lineTo(-18,-62); ctx.moveTo(4,-42); ctx.lineTo(14,-64); ctx.stroke();
  circ(ctx,-18,-62,3); fs(ctx,PAL.cromo,1.4); circ(ctx,14,-64,3.5); fs(ctx,PAL.cromo,1.4);
  rr(ctx,-30,-44,60,44,7); fs(ctx,'#6B6F7A',2.5);
  rr(ctx,-26,-40,40,34,7); fs(ctx,'#1B2233',2);
  ctx.save(); rr(ctx,-24,-38,36,30,6); ctx.clip();
  const prog = jogo ? 1 : RM ? 0 : Math.floor(tm / 6) % 3;
  if (jogo === 2){
    ctx.fillStyle = '#2E9B4F'; ctx.fillRect(-24,-38,36,30); txt(ctx,'GOL!',-6,-23,12,'#FFE066','center',FD,2.4);
  } else if (prog === 0){
    ctx.fillStyle = '#1E4FA8'; ctx.fillRect(-24,-38,36,30);
    circ(ctx,-6,-26,8); fs(ctx,'#5FB8F0',1.4);
    ctx.save(); ctx.translate(-6,-26); ctx.rotate(-0.4); ell(ctx,0,0,12,3.5); ctx.strokeStyle = '#FFD36B'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
    txt(ctx,'ESFERA',-6,-13,6,'#fff','center',FD);
  } else if (prog === 1){
    ctx.fillStyle = '#3E9B4F'; ctx.fillRect(-24,-38,36,30);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-6,-38); ctx.lineTo(-6,-8); ctx.stroke();
    circ(ctx,-6,-23,6); ctx.stroke();
    circ(ctx,-6 + (jogo && RM ? 6 : Math.sin(tm*1.7)*12),-23 + (jogo && RM ? 4 : Math.sin(tm*2.3)*8),2.2); fs(ctx,'#fff',1);   // v10.6: no jogo com movimento reduzido, a bola parada
  } else {
    ctx.fillStyle = '#E8A0B4'; ctx.fillRect(-24,-38,36,30);
    circ(ctx,-15,-20,6); fs(ctx,SKINS[1],1.2); circ(ctx,3,-20,6); fs(ctx,SKINS[4],1.2);
    heart(ctx,-6,-31,3.5 + (Math.sin(tm*4) > 0 ? 0.6 : 0),PAL.perigo);
  }
  if (prog){ circ(ctx,8,-33,2.6); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill(); }   // logo da emissora no canto
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(-24,-38); ctx.lineTo(-10,-38); ctx.lineTo(-24,-20); ctx.closePath(); ctx.fill();
  ctx.restore();
  circ(ctx,22,-32,3.2); fs(ctx,PAL.cromo,1.4); circ(ctx,22,-22,3.2); fs(ctx,PAL.cromo,1.4);
  ctx.fillStyle = PAL.tinta; for (let i=0;i<3;i++) ctx.fillRect(18,-14+i*3,8,1.2);
  ctx.restore();
}
function drawSom(ctx,x,y,tm,s){
  ctx.save(); ctx.translate(x,y); if (s) ctx.scale(s,s);
  const p = RM ? 0 : Math.max(0, Math.sin(tm*9)) * 0.8;
  [-31,31].forEach(cx => {
    rr(ctx,cx-9,-30,18,30,3); fs(ctx,'#3B3B42',2);
    circ(ctx,cx,-22,3); fs(ctx,'#5A5A63',1.2);
    circ(ctx,cx,-10,5.5 + p); fs(ctx,'#5A5A63',1.4); circ(ctx,cx,-10,2); ctx.fillStyle = PAL.tinta; ctx.fill();
  });
  rr(ctx,-20,-22,40,22,3); fs(ctx,PAL.cromo,2);
  rr(ctx,-16,-18,32,9,2); fs(ctx,'#9BD48A',1.2);
  ctx.save(); rr(ctx,-15,-17,30,7,2); ctx.clip();
  const nome = 'VELHA BRASIL FM', w = 70;
  txt(ctx,nome,RM ? -14 : 15 - ((tm*14) % (w + 30)),-13.5,6,'#1E3B1A','left',FB);
  ctx.restore();
  for (let i=0;i<4;i++){ circ(ctx,-12+i*8,-4,1.8); fs(ctx,i === 1 ? PAL.alerta : PAL.cromoEsc,1); }
  ctx.restore();
}
/* estante no canto de baixo, à esquerda, com o que estiver ligado */
function drawAmbiente(ctx,g,tm){
  const eq = g.save.equipe, y = 506;
  shadowEll(ctx,96,532,86,5,0.15);
  ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 3;
  [22,170].forEach(x => { ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,531); ctx.stroke(); });
  rr(ctx,16,520,160,5,2); fs(ctx,PAL.madeira,1.6);
  rr(ctx,12,y-2,168,8,2); fs(ctx,PAL.madeira,2);
  if (eq.som){
    drawSom(ctx,64,y-2,tm);
    if (!RM){ for (let i=0;i<2;i++){ const q = (tm*0.6 + i*0.5) % 1; ctx.globalAlpha = 1 - q; txt(ctx,'♪',22 - i*6,y-36-q*18,12,PAL.faixa,'center',FB); ctx.globalAlpha = 1; } }
    else txt(ctx,'♪',20,y-40,12,PAL.faixa,'center',FB);
  }
  if (eq.tv) drawTv(ctx,146,y-2,tm,undefined,g.evento === 'jogo' ? (g.golT > 0 ? 2 : 1) : 0);
}
/* água saborizada na entrada (jarra com frutas numa mesinha) */
/* v8.3.10: mistura duas cores '#rrggbb' (f de 0 a 1) */
function mixCor(a,b,f){
  const pa = parseInt(a.slice(1),16), pb = parseInt(b.slice(1),16);
  const c = sh => Math.round(((pa >> sh) & 255) * (1 - f) + ((pb >> sh) & 255) * f);
  return 'rgb(' + c(16) + ',' + c(8) + ',' + c(0) + ')';
}
const TRASH_COR = { vazia:'#8E99A6', cheia:'#7E9E4E', tampaV:'#B9C2CC', tampaC:'#A5BE78', fumaca:'110,150,60' };
/* saco de lixo preto amarrado, ao lado da lixeira cheia (v8.3.10) */
function drawSacoLixo(ctx,x,y){
  shadowEll(ctx,x,y,13,4,0.2);
  ctx.beginPath(); ctx.moveTo(x-6,y-21); ctx.bezierCurveTo(x-16,y-17,x-15,y,x-9,y); ctx.lineTo(x+9,y); ctx.bezierCurveTo(x+15,y,x+16,y-17,x+6,y-21); ctx.closePath(); fs(ctx,'#2A2A2E',2.2);
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x-8,y-15); ctx.quadraticCurveTo(x-10,y-8,x-6,y-4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-4,y-21); ctx.lineTo(x-7,y-28); ctx.lineTo(x,y-24); ctx.lineTo(x+7,y-28); ctx.lineTo(x+4,y-21); ctx.closePath(); fs(ctx,'#2A2A2E',1.8);
}
/* fumacinha verde do lixo cheio: nuvens que sobem e somem (paradas com movimento reduzido) */
/* v9.6.6: mosca (pontinho preto com asinhas) em órbita de ~10 px; parada com movimento reduzido */
function drawMosca(ctx,x,y,t,ph){
  const a = RM ? ph * 2.1 : t * 5.5 + ph * 2.1, mx = x + Math.cos(a) * 10, my = y + Math.sin(a * 1.3) * 6, w = RM ? 1 : 0.5 + 0.5 * Math.sin(t * 40 + ph);
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ell(ctx,mx - 2.2,my - 2,2.6,1.2 + w); ctx.fill(); ell(ctx,mx + 2.2,my - 2,2.6,1.2 + w); ctx.fill();
  ctx.fillStyle = '#1A1816'; circ(ctx,mx,my,1.9); ctx.fill();
}
function drawFumacaVerde(ctx,x,y,t,big){
  const sobe = big ? 34 : 26;
  for (let i=0;i<3;i++){
    if (!big && i > 0) break;
    const f = RM ? (i + 0.5) / 3 : ((t * 0.5 + i / 3) % 1);
    const px = x + Math.sin(f * 5 + i * 2) * 4, py = y - f * sobe, r = big ? 4 + 6 * f : 2 + f * 3;
    ctx.fillStyle = 'rgba(' + TRASH_COR.fumaca + ',' + (0.7 * (1 - f) + 0.15).toFixed(2) + ')';
    circ(ctx,px,py,r); ctx.fill();
  }
}
function drawTrash(ctx,on,t,g){
  const x = 723, y = 530;
  const lv = g && g.state !== 'menu' ? g.trash : 0, cheia = lv >= TRASH.cap;
  const f = Math.min(1, lv / TRASH.cap);   // v8.3.10: a lata vai do cinza ao esverdeado conforme enche
  const ab = g && g.state !== 'menu' && (g.bia.emptying || g.dani.emptying || g.joca.emptying) ? (RM ? 0.6 : 0.65 + 0.6*Math.sin(t*7)) : null;   // esvaziando: tampa abrindo e fechando
  if (cheia) drawSacoLixo(ctx,x-23,y-3);   // à esquerda, atrás da lata (à direita fica a parede da cozinha)
  shadowEll(ctx,x,y,20,5,0.18);
  ctx.beginPath(); ctx.moveTo(x-15,y-40); ctx.lineTo(x+15,y-40); ctx.lineTo(x+12,y-2); ctx.lineTo(x-12,y-2); ctx.closePath(); fs(ctx,mixCor(TRASH_COR.vazia,TRASH_COR.cheia,f),2.4);
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x-8,y-34); ctx.lineTo(x-7,y-8); ctx.stroke();
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x+1,y-34); ctx.lineTo(x+1,y-8); ctx.moveTo(x+7,y-34); ctx.lineTo(x+6,y-8); ctx.stroke();
  if (ab !== null){
    ctx.beginPath(); ctx.moveTo(x-15,y-40); ctx.lineTo(x+15,y-40); ctx.lineTo(x+14,y-44); ctx.lineTo(x-14,y-44); ctx.closePath(); fs(ctx,'#3a352e',1.4);   // boca da lata
    ctx.save(); ctx.translate(x-17,y-44); ctx.rotate(-ab); rr(ctx,0,-6,34,8,3); fs(ctx,mixCor(TRASH_COR.tampaV,TRASH_COR.tampaC,f),2.2); rr(ctx,13,-10,8,5,2); fs(ctx,mixCor(TRASH_COR.vazia,TRASH_COR.cheia,f),1.6); ctx.restore();
  } else if (cheia){
    // tampa levantada pelo lixo, com restos aparecendo
    ctx.beginPath(); ctx.arc(x-6,y-42,5,Math.PI,0); ctx.arc(x+4,y-43,6,Math.PI,0); fs(ctx,'#6F8B3F',1.6);
    ctx.save(); ctx.translate(x-17,y-44); ctx.rotate(-0.18); rr(ctx,0,-6,34,8,3); fs(ctx,TRASH_COR.tampaC,2.2); rr(ctx,13,-10,8,5,2); fs(ctx,mixCor(TRASH_COR.vazia,TRASH_COR.cheia,1),1.6); ctx.restore();
  } else {
    rr(ctx,x-17,y-47,34,8,3); fs(ctx,mixCor(TRASH_COR.tampaV,TRASH_COR.tampaC,f),2.2);
    rr(ctx,x-4,y-51,8,5,2); fs(ctx,mixCor(TRASH_COR.vazia,TRASH_COR.cheia,f),1.6);
  }
  rr(ctx,x-7,y-4,14,5,2); fs(ctx,PAL.tinta,1.2);
  txt(ctx,'LIXO',x,y-21,9,'#fff','center',FB);
  if (g && g.up && g.up.triturador){
    // v8.3.10: o Triturador, uma caixinha na base com o anel do tempo até moer o próximo
    rr(ctx,x+22,y-15,13,14,3); fs(ctx,PAL.inox,1.8);
    circ(ctx,x+28.5,y-8,4.2); fs(ctx,PAL.tinta,1.2);
    if (lv > 0){ ctx.strokeStyle = PAL.ok; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x+28.5,y-8,3.6,-Math.PI/2,-Math.PI/2 + TAU * Math.min(1, (g.trituraT || 0) / TRASH.tritura)); ctx.stroke(); }
  }
  if (g && g.state !== 'menu'){
    // nível: um tracinho por gominho na lateral
    for (let i=0;i<TRASH.cap;i++){ ctx.fillStyle = i < lv ? (cheia ? PAL.perigo : (lv >= TRASH.cap - 2 ? PAL.alerta : PAL.ok)) : 'rgba(255,255,255,.35)'; ctx.fillRect(x+16,y-6-i*4.4,4,3.2); }
    if (lv >= TRASH.cap - 2 && !cheia) drawFumacaVerde(ctx,x-2,y-50,t,false);
    if (cheia){
      drawFumacaVerde(ctx,x-24,y-33,t,true);
      drawFumacaVerde(ctx,x-2,y-50,t + 0.6,true);
      ctx.strokeStyle = 'rgba(110,150,60,.6)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      [-9,9].forEach((dx,i) => { const o = RM ? 0 : Math.sin(t * 3 + i * 2) * 2.5; ctx.beginPath(); ctx.moveTo(x + dx,y - 54); ctx.bezierCurveTo(x + dx + 6 + o,y - 62,x + dx - 6 - o,y - 68,x + dx + o,y - 76); ctx.stroke(); });
      ctx.lineCap = 'butt';
      drawMosca(ctx,x - 4,y - 64,t,0); drawMosca(ctx,x + 8,y - 58,t,3);
      rr(ctx,x-20,y-86,40,13,4); fs(ctx,PAL.perigo,1.6); txt(ctx,'CHEIO',x,y-79,9,'#fff','center',FD);
    }
  }
  if (on){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; const r = STATIONS.trash.rect; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
/* v9.6.4: a plaquinha "FECHADO" pendurada na calçada, ao lado do topo da fila de espera (balança de leve; parada com movimento reduzido) */
function drawPlacaFechado(ctx,x,y,t){
  ctx.save(); ctx.translate(x,y); ctx.rotate(RM ? -0.05 : -0.05 + Math.sin(t*2.2)*0.05);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-14,-12); ctx.lineTo(0,-4); ctx.lineTo(14,-12); ctx.stroke();
  rr(ctx,-32,-4,64,20,4); fs(ctx,PAL.perigo,2.4);
  txt(ctx,'FECHADO',0,6.5,11,'#fff','center',FD,0,56);
  ctx.restore();
}
/* placa pendurada "QUEBRADO" (v8), no aparelho parado: cordinha e etiqueta vermelha meio torta */
function drawPlacaParada(ctx,x,y){
  ctx.save(); ctx.translate(x,y); ctx.rotate(-0.1);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-5,-9); ctx.lineTo(0,-4); ctx.lineTo(5,-9); ctx.stroke();
  rr(ctx,-19,-4,38,15,3); fs(ctx,PAL.perigo,2.2);
  txt(ctx,'QUEBRADO',0,4,8,'#fff','center',FD,0,34);
  ctx.restore();
}
/* fumaça cinza do fogão quebrado: bolinhas que sobem e somem (paradas com movimento reduzido) */
function drawFumaca(ctx,t){
  for (let k=0;k<3;k++) for (let i=0;i<4;i++){
    const ph = RM ? (i/4) : ((t*0.35 + i/4 + k*0.13) % 1), x = 800 + k*44 + Math.sin(ph*6 + k*2)*7 + (RM ? 0 : 0), y = 100 - ph*52;
    ctx.globalAlpha = (1 - ph)*0.9; circ(ctx,x,y,5 + ph*8); ctx.fillStyle = '#7C8187'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(34,32,28,.55)'; ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
/* geladeira (v8), de pé no chão encostada na parede do salão, ao lado da cozinha. Quebrada: luz apagada, a porta de baixo
   entreaberta, poça d'água no chão e uma gota caindo */
/* v9.6.11: a mesinha das marmitas (no lugar da geladeira, que sai da tela): tampo de madeira com as pernas, as marmitas empilhadas em cima (MARMJ_SLOTS) */
function drawMesinha(ctx,g,t){
  const r = STATIONS.marmj.rect, x = r.x, y = r.y, w = r.w, h = r.h;
  shadowEll(ctx,x + w/2,y + h + 3,w/2 + 4,6,0.2);
  rr(ctx,x + 4,y + h - 14,6,16,2); fs(ctx,PAL.madeiraEsc,1.6); rr(ctx,x + w - 10,y + h - 14,6,16,2); fs(ctx,PAL.madeiraEsc,1.6);
  rr(ctx,x,y,w,h - 6,7); fs(ctx,PAL.madeira,2.6);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x + 4,y + 4,w - 8,3);
  ctx.strokeStyle = 'rgba(138,82,38,.55)'; ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 1; i < 4; i++){ const yy = y + (h - 6) * i / 4; ctx.moveTo(x + 5,yy); ctx.lineTo(x + w - 5,yy); }
  ctx.stroke();
  if (terraco(g)){   // v10: no Terraço não há marmitas nem estação: o móvel é um aparador com um vaso de flores em cima
    const cx = x + w / 2, by = y + 4;
    ctx.strokeStyle = '#3E7B4F'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    [[-8,-30],[0,-36],[8,-29]].forEach(f => { ctx.beginPath(); ctx.moveTo(cx,by - 14); ctx.lineTo(cx + f[0],by + f[1]); ctx.stroke(); });
    (g.save.rosa ? [[-8,-30,AB_COR.petala],[0,-36,'#F06A98'],[8,-29,'#D2356A']] : [[-8,-30,'#E5384A'],[0,-36,'#F2B33D'],[8,-29,'#C77DD6']]).forEach(f => { circ(ctx,cx + f[0],by + f[1],5); fs(ctx,f[2],1.6); circ(ctx,cx + f[0],by + f[1],1.6); ctx.fillStyle = '#FFF3C9'; ctx.fill(); });
    rr(ctx,cx - 8,by - 17,16,19,6); fs(ctx,'#F4F0E6',2);
    ctx.fillStyle = 'rgba(47,111,181,.35)'; ctx.fillRect(cx - 6,by - 9,12,3);
  }
}
/* v9.6.11: o letreiro "eFood" sobre o entregador que espera (pisca 0,6 s acesa e 0,4 s apagada; sem movimento, fica acesa) */
function drawLetreiroEfood(ctx,grp,tm,k){
  const acesa = RM || (tm % 1) < 0.6;
  ctx.save(); ctx.translate(grp.x - 34 * (k || 1),grp.y - 70); ctx.scale(k || 1,k || 1);
  rr(ctx,-19,-8,38,16,4); fs(ctx,acesa ? '#D8432F' : '#6E2A22',1.8);
  txt(ctx,'eFood',0,1,10,acesa ? '#fff' : '#B89A94','center',FB);
  ctx.restore();
}
/* v9.6.11: a seta que pisca sobre a mesinha quando há marmita de entregador esperando (dias 4 e 5 e na Missão zero) */
function drawSetaMesinha(ctx,g,tm){
  const r = STATIONS.marmj.rect, a = RM ? 1 : 0.55 + 0.45 * Math.sin(tm * 9), dy = RM ? 0 : Math.sin(tm * 6) * 3;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(r.x + r.w / 2,r.y - 14 + dy);
  ctx.beginPath(); ctx.moveTo(-9,-10); ctx.lineTo(9,-10); ctx.lineTo(9,0); ctx.lineTo(15,0); ctx.lineTo(0,14); ctx.lineTo(-15,0); ctx.lineTo(-9,0); ctx.closePath(); fs(ctx,PAL.mostarda,2);
  ctx.restore();
}
/* v9.6.11: a fumaça verde da lixeira cheia se espalha (raio g.fumacaRaio): nuvens translúcidas na borda e, com prefers-reduced-motion, só um véu parado */
function drawFumacaLixo(ctx,g,t){
  const R = g.fumacaRaio; if (R < 8) return;
  const c = TRASH.pos, k = R / TRASH.fumaca.raio;
  ctx.save();
  const gr = ctx.createRadialGradient(c.x,c.y,R * 0.2,c.x,c.y,R);
  gr.addColorStop(0,'rgba(' + TRASH_COR.fumaca + ',' + (0.16 * Math.min(1,k * 2)).toFixed(3) + ')'); gr.addColorStop(1,'rgba(' + TRASH_COR.fumaca + ',0)');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(c.x,c.y,R,0,TAU); ctx.fill();
  if (!RM){
    const n = 6 + Math.round(4 * k);
    for (let i = 0; i < n; i++){
      const ang = Math.PI + (i + 0.5) / n * Math.PI * 1.15 - 0.1, d = R * (0.8 + 0.18 * Math.sin(t * 0.8 + i * 1.9)), cx = c.x + Math.cos(ang) * d, cy = c.y + Math.sin(ang) * d, r = 22 + 10 * Math.sin(t * 1.3 + i);
      ctx.fillStyle = 'rgba(' + TRASH_COR.fumaca + ',0.13)';
      [[0,0,1],[r * 0.7,-r * 0.2,0.75],[-r * 0.7,r * 0.1,0.8]].forEach(p => { circ(ctx,cx + p[0],cy + p[1],r * p[2]); ctx.fill(); });
    }
  }
  ctx.restore();
}
function drawGeladeira(ctx,g,t){
  const q = g.quebrado('geladeira'), x = 688, y = 102, w = 42, h = 94;
  shadowEll(ctx,x + w/2,y + h + 4,26,6,0.2);
  if (q){   // poça no chão
    ell(ctx,x + w/2 + 2,y + h + 5,31,7); fs(ctx,'#8EC5E8',2);
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + 4,y + h + 4); ctx.lineTo(x + 16,y + h + 3); ctx.stroke();
  }
  rr(ctx,x + 4,y + h - 2,8,6,2); fs(ctx,PAL.cromoEsc,1.6); rr(ctx,x + w - 12,y + h - 2,8,6,2); fs(ctx,PAL.cromoEsc,1.6);
  rr(ctx,x,y,w,h,6); fs(ctx,'#F3F6F8',2.8);
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x + 4,y + 6,3,h - 18);
  const dv = y + 34;
  if (q){
    // porta de baixo aberta: vão escuro com prateleira e a porta de lado, em pé
    ctx.beginPath(); ctx.rect(x + 3,dv + 2,w - 6,y + h - dv - 6); fs(ctx,'#CFE0E8',1.8);
    ctx.strokeStyle = PAL.cromoEsc; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + 4,dv + 19); ctx.lineTo(x + w - 4,dv + 19); ctx.moveTo(x + 4,dv + 36); ctx.lineTo(x + w - 4,dv + 36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w - 3,dv + 2); ctx.lineTo(x + w + 9,dv + 8); ctx.lineTo(x + w + 9,y + h - 5); ctx.lineTo(x + w - 3,y + h - 6); ctx.closePath(); fs(ctx,'#E3E8EC',2);
    ctx.fillStyle = 'rgba(34,32,28,.5)'; ctx.fillRect(x + w + 5,dv + 20,2,14);
    // gota caindo
    const ph = RM ? 0.4 : (t*0.9 % 1), gy = y + h - 4 + ph*8;
    ctx.globalAlpha = 1 - ph*ph; ctx.beginPath(); ctx.moveTo(x + 14,gy - 4); ctx.quadraticCurveTo(x + 18,gy + 1,x + 14,gy + 3); ctx.quadraticCurveTo(x + 10,gy + 1,x + 14,gy - 4); fs(ctx,'#8EC5E8',1.4); ctx.globalAlpha = 1;
  } else {
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x + 1,dv); ctx.lineTo(x + w - 1,dv); ctx.stroke();
    rr(ctx,x + w - 10,y + 8,3.4,17,1.6); fs(ctx,PAL.cromoEsc,1.5); rr(ctx,x + w - 10,dv + 8,3.4,28,1.6); fs(ctx,PAL.cromoEsc,1.5);
    // ímãs e bilhete
    rr(ctx,x + 11,dv + 14,14,12,1.5); fs(ctx,'#FFF3C9',1.4); ctx.fillStyle = PAL.formica; ctx.fillRect(x + 13,dv + 18,10,1.6); ctx.fillRect(x + 13,dv + 21,7,1.6);
    circ(ctx,x + 18,dv + 14,2.2); fs(ctx,PAL.faixa,1.2);
  }
  circ(ctx,x + 9,y + 10,2.6); fs(ctx,q ? '#9AA0A6' : '#62D88A',1.4);   // luz de funcionamento
}
/* chuva (v8): sobre a calçada, o céu fica mais escuro e há poças; os pingos (diagonais) caem por cima de tudo */
function drawChuvaFundo(ctx,t){
  const x0 = -CALCADA.w - 60;
  ctx.fillStyle = 'rgba(52,72,104,.22)'; ctx.fillRect(x0,0,-x0,540);
  [[-190,222,34,7],[-90,306,40,8],[-200,392,30,6],[-70,478,28,6]].forEach((p,i) => {
    ell(ctx,p[0],p[1],p[2],p[3]); ctx.fillStyle = 'rgba(120,160,196,.55)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
    const ph = RM ? 0.5 : ((t*0.8 + i*0.31) % 1); ctx.globalAlpha = 1 - ph; ell(ctx,p[0] + (i%2 ? 8 : -8),p[1],4 + ph*10,1.2 + ph*2.4); ctx.stroke(); ctx.globalAlpha = 1;
  });
  // pingos que escorrem do toldo
  for (let i=0;i<5;i++){ const ph = RM ? 0.3 : ((t*0.9 + i*0.37) % 1), x = -234 + i*45 + 6; ctx.globalAlpha = 1 - ph; circ(ctx,x,98 + ph*30,2); ctx.fillStyle = '#9CC4E4'; ctx.fill(); ctx.globalAlpha = 1; }
}
function drawChuvaPingos(ctx,t){
  const x0 = -CALCADA.w - 60, w = -x0;
  ctx.save(); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  for (let i=0;i<70;i++){
    const sp = 520 + (i*37 % 7)*40, x = x0 + ((i*131.7) % w) + (RM ? 0 : -((t*sp) % 540)*0.22), y = RM ? ((i*97.3) % 540) : (((i*97.3) + t*sp) % 540);
    const xx = x0 + (((x - x0) % w) + w) % w;
    ctx.strokeStyle = 'rgba(205,226,246,' + (0.35 + (i%3)*0.12) + ')';
    ctx.beginPath(); ctx.moveTo(xx,y); ctx.lineTo(xx - 4,y + 13); ctx.stroke();
  }
  ctx.restore();
}
/* feriado (v8): fio de bandeirinhas coloridas no alto da fachada da calçada, por cima do muro */
const BAND_FERIADO = ['#E2574C','#F2B33D','#3E9B5A','#3F7FD0','#8E5BB5','#F28FB0','#4FB6B0'];
const BAND_JUNINA = ['#E2574C','#F2C23D','#3F7FD0','#3E9B5A','#F28C38'];   // v10.6: a festa junina (o feriado segue com as dele)
const BAND_JOGO = ['#2E9B4F','#F2C23D'];   // v10.6: o jogo do Brasil, verde e amarelo
/* v10.6: cores (padrão: as do feriado) e tm (sem ele, paradas; com ele, balançam de leve, menos com movimento reduzido) */
function drawBandeirinhas(ctx,cores,tm){
  const x0 = -CALCADA.w + 30, x1 = -8; cores = cores || BAND_FERIADO;
  const pt = u => ({ x:x0 + (x1 - x0)*u, y:2 + 7*4*u*(1 - u) });
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.8; ctx.beginPath();
  for (let i=0;i<=24;i++){ const p = pt(i/24); i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y); } ctx.stroke();
  for (let i=0;i<14;i++){
    const u = (i + 0.5)/14, p = pt(u), d = 6, sw = tm == null || RM ? 0 : Math.sin(tm*1.6 + i*0.8)*0.12;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(-d,0); ctx.lineTo(d,0); ctx.lineTo(0,12); ctx.closePath(); fs(ctx,cores[(i*3) % cores.length],1.6);
    ctx.restore();
  }
}
/* v10.6, a festa junina: dois fios de bandeirinhas em curva no alto da área do salão (por cima das mesas, abaixo dos balões); balançam de leve (paradas com movimento reduzido) */
function drawBandeirinhasSalao(ctx,g,tm){
  const A = g.ponto.area, x0 = A.x0 - 6, x1 = A.x1 + 6;
  [[A.y0 - 12, A.y0 - 4, 9, 0], [A.y0 + 2, A.y0 - 8, 9, 2]].forEach(([ya, yb, sag, off]) => {
    const pt = u => ({ x:x0 + (x1 - x0)*u, y:ya + (yb - ya)*u + sag*4*u*(1 - u) });
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i=0;i<=30;i++){ const p = pt(i/30); i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y); } ctx.stroke();
    const n = Math.round((x1 - x0) / 26);
    for (let i=0;i<n;i++){
      const p = pt((i + 0.5)/n), sw = RM ? 0 : Math.sin(tm*1.5 + i*0.7 + off)*0.12;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(sw);
      ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(6,0); ctx.lineTo(0,12); ctx.closePath(); fs(ctx,BAND_JUNINA[(i*2 + off) % BAND_JUNINA.length],1.5);
      ctx.restore();
    }
  });
}
/* v10.6: o letreiro "GOOOL!" no alto do salão por EVENTOS.jogo.golT s (cresce e treme de leve; parado com movimento reduzido) */
function drawGol(ctx,g,tm){
  if (!(g.golT > 0)) return;
  const T = EVENTOS.jogo.golT, p = 1 - g.golT / T, a = clamp(Math.min(p / 0.08, (1 - p) / 0.2, 1), 0, 1);
  const k = RM ? 1 : 0.55 + 0.45 * Math.min(1, p / 0.18) + Math.sin(tm*34)*0.025, A = g.ponto.area;
  ctx.save(); ctx.globalAlpha = a; ctx.translate((A.x0 + A.x1) / 2, A.y0 - 22); ctx.scale(k,k); if (!RM) ctx.rotate(Math.sin(tm*28)*0.025);
  rr(ctx,-112,-34,224,68,18); ctx.fillStyle = '#2E9B4F'; ctx.fill(); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 3; ctx.stroke();
  txt(ctx,'GOOOL!',0,2,52,'#FFE066','center',FD,7);
  ctx.restore();
}
/* plaquinhas de conserto (v8): alvo do toque (raio MANUT.badge), no ponto `badge` de cada equipamento quebrado e sem conserto.
   Círculo mostarda com a chave inglesa e o preço do conserto embaixo; pulsa de leve (parada com movimento reduzido) */
function drawConsertos(ctx,g,t){
  if (g.state !== 'playing' && g.state !== 'paused') return;
  g.quebras.forEach(q => {
    if (!q.on || q.fixed) return;
    const eq = manutOf(q.id), b = eq.badge, R = MANUT.badge, pul = RM ? 0 : Math.sin(t*5);
    if (q.id === 'fogao') drawFumaca(ctx,t);
    ctx.save(); ctx.translate(b.x,b.y); ctx.scale(1 + pul*0.06,1 + pul*0.06);
    shadowEll(ctx,1,R + 2,R*0.8,4,0.22);
    circ(ctx,0,0,R + 4 + (RM ? 0 : (pul + 1)*1.6)); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
    circ(ctx,0,0,R); fs(ctx,PAL.mostarda,3);
    circ(ctx,0,0,R - 5); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.stroke();
    drawWrench(ctx,0,1,1.35,0.78);
    ctx.restore();
    const lbl = fmt(eq.emerg), pw = 8 + lbl.length*6.2;
    rr(ctx,b.x - pw/2,b.y + R - 2,pw,15,7); fs(ctx,'#fff',2);
    txt(ctx,lbl,b.x,b.y + R + 5.8,10.5,PAL.tinta,'center',FD);
  });
}
function drawKitchen(ctx,g,t){
  const bia = g.bia;
  const target = bia.acts.length ? (bia.acts[0].type === 'plate' ? 'plates' : (bia.acts[0].type === 'table' ? null : bia.acts[0].type)) : null;  // order, coffee, juice, sink
  const glow = (k) => { if (target !== k) return; ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 6; const r = STATIONS[k].rect; rr(ctx,r.x+3,r.y+3,r.w-6,r.h-6,6); ctx.stroke(); ctx.restore(); };

  // fundo da cozinha
  ctx.fillStyle = PAL.cozinha; ctx.fillRect(766,92,194,448);
  ctx.strokeStyle = 'rgba(34,32,28,.12)'; ctx.lineWidth = 1;
  for (let x=766;x<=960;x+=24){ ctx.beginPath(); ctx.moveTo(x,92); ctx.lineTo(x,540); ctx.stroke(); }
  for (let y=92;y<=540;y+=24){ ctx.beginPath(); ctx.moveTo(766,y); ctx.lineTo(960,y); ctx.stroke(); }

  // --- janela de pedidos + chef
  let r = STATIONS.order.rect;
  glowSprite(ctx,g,'order',ctx => {
    rr(ctx,r.x+14,r.y+4,r.w-18,r.h-8,8); fs(ctx,'#F0DDA6',3);
    drawChef(ctx,g,930,172,t);
    if (g.liaAtiva && g.state !== 'menu') drawLia(ctx,{ x:LIA_HOME.x, y:LIA_HOME.y, s:LIA_HOME.s },t);   // v10.2: a Lia ao lado do Tonhão
    if (g.kitchen.noPlate && g.state !== 'menu'){
      ctx.save(); ctx.translate(904,118); drawBubble(ctx,0,0,15,'#fff'); txt(ctx,'Sem',0,-4,9,PAL.perigo,'center',FD); txt(ctx,'prato!',0,6,9,PAL.perigo,'center',FD); ctx.restore();
    }
    // tickets cozinhando
    const ck = g.kitchen.cooking;
    const ns = g.kitchen.slots, tw = (128 - (ns-1)*4) / ns;   // 3, 4 ou 5 bocas (aumento do Tonhão)
    for (let i=0;i<ns;i++){
      const x = 786 + i*(tw+4), y = 108;
      const tk = ck[i];
      rr(ctx,x,y,tw,48,3); fs(ctx,tk ? '#FFFBEA' : 'rgba(255,251,234,.35)',2);
      if (tk){
        ctx.fillStyle = tk.marmita ? EFOOD_COR : cmdColor(tk.group) || PAL.faixa; ctx.fillRect(x,y,tw,9);   // marmita (v8.6): a faixa da Efood e a quentinha
        ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.5; ctx.strokeRect(x,y,tw,9);
        if (tk.marmita) drawMarmita(ctx,tk.dish,x+tw/2,y+25,0.85);
        else txt(ctx,String(tk.table),x+tw/2,y+26,ns > 3 ? 16 : 20,PAL.tinta,'center',FD);
        ctx.fillStyle = '#d9d4c4'; ctx.fillRect(x+3,y+38,tw-6,6);
        ctx.fillStyle = tk.p >= tk.time ? PAL.ok : PAL.alerta; ctx.fillRect(x+3,y+38,(tw-6)*clamp(tk.p/tk.time,0,1),6);
        ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.5; ctx.strokeRect(x+3,y+38,tw-6,6);
      }
    }
    if (g.quebrado('fogao')){   // fogão parado: bocas apagadas (cinza e chama riscada) e fumaça preta saindo
      for (let i=0;i<ns;i++){ const x = 786 + i*(tw+4) + tw/2;
        rr(ctx,x - tw/2,108,tw,48,3); ctx.fillStyle = 'rgba(96,100,104,.55)'; ctx.fill(); ctx.strokeStyle = 'rgba(34,32,28,.75)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x-5,148); ctx.lineTo(x+5,138); ctx.moveTo(x+5,148); ctx.lineTo(x-5,138); ctx.stroke(); }
    }
    const qn = g.kitchen.queue.length;
    txt(ctx,qn ? ('Na fila: ' + qn) : 'PEDIDOS',800,168,12,PAL.tinta,'left',FB);
    rr(ctx,r.x+8,r.y+r.h-16,r.w-12,12,3); fs(ctx,PAL.cromo,2.2);
  });
  // adiantar marmitas (v8.6): o botãozinho com a quentinha, o "+" e as sem dono (adiantadas) de MARMITA.vagas
  if (MARMITA.adiantar && g.marmitaOk && g.state !== 'menu') glowSprite(ctx,g,'adiantar',ctx => {
    const n = g.marmitasLivres, cheio = n >= g.vagas, q = STATIONS.adiantar.rect;
    ctx.save(); if (cheio) ctx.globalAlpha = 0.55;
    rr(ctx,q.x + 4,q.y + 3,q.w - 8,q.h - 10,7); fs(ctx,'#FFFBEA',2);
    drawMarmita(ctx,MARMITA.prato,q.x + 26,q.y + 16,0.55);
    circ(ctx,q.x + 13,q.y + 10,5.5); fs(ctx,cheio ? PAL.cromoEsc : PAL.ok,1.4); txt(ctx,'+',q.x + 13,q.y + 10.5,10,'#fff','center',FD);
    txt(ctx,n + '/' + g.vagas,q.x + 41,q.y + 17,10,PAL.tinta,'left',FD);
    ctx.restore();
  });
  // v9.2, a geladeirinha de doces (curso Confeitaria caseira), ao lado da janela de pedidos
  if (g.up.confCaseira && g.state !== 'menu') glowSprite(ctx,g,'doces',ctx => drawGeladeiraDoces(ctx,g,t));
  // v9.3, a máquina de espresso (curso Barista do Joca), no chão ao lado da bancada do café
  if (g.up.espresso && g.state !== 'menu') glowSprite(ctx,g,'espresso',ctx => drawEspresso(ctx,g,t));
  if (g.up.cafesEsp && g.state !== 'menu') drawCafesEsp(ctx,g,t);   // v10.3
  // v9.5, o balcão de drinks do Anselmo (só na Avenida)
  if (g.anselmoAtivo && g.state !== 'menu') glowSprite(ctx,g,'drinks',ctx => drawBalcaoDrinks(ctx,g,t));
  glow('order'); glow('adiantar'); glow('doces'); glow('espresso'); glow('drinks');

  // --- janela de prontos
  r = STATIONS.plates.rect;
  rr(ctx,r.x+14,r.y+4,r.w-18,r.h-6,8); fs(ctx,'#EFE8D4',3);
  txt(ctx,'PRONTOS',806,222,12,PAL.faixa,'left',FB);
  if (isFinite(g.kitchen.clean)){
    const cn = g.kitchen.clean, warn = cn <= 0 && !RM && Math.floor(t*4) % 2;
    for (let i=0;i<Math.min(4,cn);i++){ ell(ctx,884,234-i*3,10,3); fs(ctx,'#fff',1.4); }
    if (cn <= 0){ ell(ctx,884,234,10,3); ctx.setLineDash([3,2]); ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 1.4; ctx.stroke(); ctx.setLineDash([]); }
    txt(ctx,'×' + cn,906,228,12,cn <= 0 ? (warn ? '#ff8a7a' : PAL.perigo) : PAL.tinta,'left',FD);
  }
  ctx.save(); ctx.translate(942,220); ctx.fillStyle = PAL.mostarda; ctx.beginPath(); ctx.arc(0,2,7,Math.PI,0); ctx.lineTo(8,6); ctx.lineTo(-8,6); ctx.closePath(); fs(ctx,PAL.mostarda,2); circ(ctx,0,-6,2); fs(ctx,PAL.cromo,1.5); ctx.restore();
  rr(ctx,r.x+8,r.y+r.h-14,r.w-12,12,3); fs(ctx,PAL.cromo,2.2);
  for (let i=0;i<PLATE_SLOTS.length;i++){
    const s = PLATE_SLOTS[i], p = g.kitchen.plates[i];
    ell(ctx,s.x,s.y+4,19,10); ctx.fillStyle = 'rgba(34,32,28,.12)'; ctx.fill();
    if (p) glowSprite(ctx,g,p,ctx => {
      const bounce = RM ? 0 : Math.max(0, 1 - p.age*3) * -8;
      const pc = cmdColor(p.group);
      if (pc) drawTray(ctx,s.x,s.y+2+bounce,1.0,pc);
      if (p.vip){ ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 3; ell(ctx,s.x,s.y+bounce,17,9); ctx.stroke(); }
      drawDish(ctx,p.dish,s.x,s.y+bounce,1.1,false,p.group && p.group.carnes && p.group.carnes[0]);
      // v8.6.8: o vapor some aos poucos enquanto o prato espera (parado, sem balançar, com movimento reduzido)
      const vp = pratoVapor(p.age);
      if (vp > 0.02){
        ctx.save(); ctx.strokeStyle = 'rgba(120,130,140,' + (0.75*vp).toFixed(2) + ')'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        [-7,0,7].forEach((dx,j) => { const w = RM ? 0 : Math.sin(t*3 + j*2 + i)*2, y0 = s.y-14+bounce;
          ctx.beginPath(); ctx.moveTo(s.x+dx, y0); ctx.quadraticCurveTo(s.x+dx+3+w, y0-6, s.x+dx, y0-11*vp-3); ctx.stroke(); });
        ctx.restore();
      }
      if (p.crit) txt(ctx,'★',s.x-13,s.y-14+bounce,15,PAL.mostarda,'center',FD);
      if (p.casa) star(ctx,s.x-1,s.y-23+bounce,6,PAL.mostarda);   // v10.1: o prato da casa
      circ(ctx,s.x+12,s.y-14+bounce,9); fs(ctx,'#fff',2);
      txt(ctx,String(p.table),s.x+12,s.y-13+bounce,12,PAL.tinta,'center',FD);
      const a = 0.35 + 0.3*Math.sin(t*6 + i);
      ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 3; ell(ctx,s.x,s.y+2,21,13); ctx.stroke();
    });
  }
  // v9.6.5: a fileira própria das marmitas (acima dos pratos): a do entregador com o selo da Efood; a sem dono com o anel da validade
  for (let i=0;i<MARMJ_SLOTS.length;i++){
    const s = MARMJ_SLOTS[i], p = g.kitchen.marmJ[i];
    ell(ctx,s.x,s.y+3,12,6); ctx.fillStyle = 'rgba(34,32,28,.12)'; ctx.fill();
    if (p) glowSprite(ctx,g,p,ctx => {
      const bounce = RM ? 0 : Math.max(0, 1 - p.age*3) * -6;
      drawMarmita(ctx,p.dish,s.x,s.y+bounce,0.62);
      if (p.crit) txt(ctx,'★',s.x-9,s.y-8+bounce,11,PAL.mostarda,'center',FD);
      ctx.save(); ctx.translate(s.x+8,s.y-6+bounce); ctx.scale(0.72,0.72); drawMarmitaSelo(ctx,p,0,0); ctx.restore();
      const a = 0.35 + 0.3*Math.sin(t*6 + i);
      ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 2; ell(ctx,s.x,s.y+1,14,9); ctx.stroke();
    });
  }
  glow('plates');

  // --- cafezinho (metade esquerda da bancada)
  r = STATIONS.coffee.rect;
  glowSprite(ctx,g,'coffee',ctx => {
    rr(ctx,r.x+14,r.y+4,r.w-14,r.h-8,8); fs(ctx,'#DCCBA3',3);
    txt(ctx,'CAFEZINHO',786,318,11,PAL.faixa,'left',FB,0,72);
    rr(ctx,788,334,26,46,7); fs(ctx,PAL.faixa,2.4);
    rr(ctx,788,334,26,10,5); fs(ctx,PAL.cromo,2);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(792,348,4,28);
    rr(ctx,814,354,9,7,3); fs(ctx,PAL.cromo,1.8);
    rr(ctx,798,328,6,7,2); fs(ctx,PAL.tinta,1.4);
    const parada = g.quebrado('cafeteira');
    for (let i=0;i<2 && !parada;i++){
      const cx = 836 + i*16, cy = 372;
      ell(ctx,cx,cy+8,8,3); fs(ctx,'#fff',1.8);
      rr(ctx,cx-6,cy-5,12,12,3); fs(ctx,'#fff',1.8);
      ctx.fillStyle = '#5B2E1A'; ctx.fillRect(cx-4.5,cy-3,9,2.5);
    }
    if (parada) drawPlacaParada(ctx,801,345);
    if (!RM && !parada){
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
      for (let i=0;i<2;i++){
        const cx = 836 + i*16, ph = t*2 + i;
        ctx.beginPath(); ctx.moveTo(cx-1,362); ctx.quadraticCurveTo(cx-4+Math.sin(ph)*2.5,355,cx,348); ctx.stroke();
      }
    }
  });
  glow('coffee');

  // --- balcão de sucos (metade direita da bancada)
  r = STATIONS.juice.rect;
  glowSprite(ctx,g,'juice',ctx => {
    rr(ctx,r.x+4,r.y+4,r.w-8,r.h-8,8); fs(ctx,'#F5D9A8',3);
    txt(ctx,'SUCOS',872,318,11,PAL.faixa,'left',FB);
    // suqueira: jarra com suco de laranja sobre a base
    rr(ctx,874,332,30,36,8); fs(ctx,'rgba(255,255,255,.75)',2.4);
    rr(ctx,877,342,24,23,6); ctx.fillStyle = '#F39A1E'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(880,345,4,16);
    circ(ctx,886,355,3.4); fs(ctx,'#F6C343',1.2); circ(ctx,895,349,3); fs(ctx,'#F6C343',1.2);
    rr(ctx,871,366,36,12,4); fs(ctx,PAL.cromo,2.2);
    rr(ctx,886,377,6,5,2); fs(ctx,PAL.tinta,1.4);
    // laranjas e copos prontos
    circ(ctx,918,342,6); fs(ctx,'#F39A1E',1.8); circ(ctx,931,345,5.5); fs(ctx,'#F39A1E',1.8);
    ctx.fillStyle = '#3E9B5A'; ell(ctx,919,336,2.6,1.4); ctx.fill();
    drawIcon(ctx,'juice',922,370,0.78); drawIcon(ctx,'juice',942,370,0.78);
  });
  // tampo de inox contínuo e divisória
  rr(ctx,774,382,180,10,3); fs(ctx,PAL.cromo,2.2);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(863,306); ctx.lineTo(863,382); ctx.stroke();
  glow('juice');
  glowSprite(ctx,g,'trash',ctx => drawTrash(ctx, target === 'trash', t, g));

  // --- pia
  r = STATIONS.sink.rect;
  glowSprite(ctx,g,'sink',ctx => {
    rr(ctx,r.x+14,r.y+4,r.w-18,r.h-8,8); fs(ctx,'#C9D6DC',3);
    txt(ctx,'PIA E LOUÇA',806,410,12,PAL.faixa,'left',FB);
    rr(ctx,792,430,100,62,8); fs(ctx,PAL.inox,3);
    const nPia = g.state !== 'menu' ? g.kitchen.sinkN : 0, fPia = Math.min(1, nPia / 6);
    rr(ctx,799,438,86,46,6); fs(ctx,mixCor('#8EC5E8','#9A9468',fPia),2);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(805,444,30,3);
    // v9.6.6: pratos sujos tortos na cuba, com manchas de molho
    for (let i = 0; i < Math.min(3, nPia); i++){
      const px = 818 + i * 24, py = 466 - (i % 2) * 6;
      ctx.save(); ctx.translate(px,py); ctx.rotate((i - 1) * 0.35); ell(ctx,0,0,13,5); fs(ctx,'#F2F0E8',1.6);
      ctx.fillStyle = '#B5651D'; circ(ctx,-4,-0.5,2.2); ctx.fill(); ctx.fillStyle = '#7A4A2A'; circ(ctx,4,0.6,1.7); ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.moveTo(842,432); ctx.lineTo(842,428); ctx.quadraticCurveTo(842,423.5,849,423.5); ctx.lineTo(856,423.5); ctx.lineWidth = 6; ctx.strokeStyle = PAL.tinta; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = PAL.cromo; ctx.stroke();
    // carrinho de louça
    rr(ctx,902,440,50,34,5); fs(ctx,PAL.cromo,2.6);
    ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(906,456,42,3);
    circ(ctx,914,484,6); fs(ctx,'#4a4a4a',2); circ(ctx,940,484,6); fs(ctx,'#4a4a4a',2);
    const n = g.kitchen.sinkN;
    for (let i=0;i<n;i++){ const cy = 435-(i%4)*4 - (i>3?2:0); ell(ctx,927,cy,16,4); fs(ctx,i%2?'#f2f0e8':'#fff',1.8); ctx.fillStyle = '#B5651D'; circ(ctx,921,cy,1.6); ctx.fill(); ctx.fillStyle = '#7A4A2A'; circ(ctx,933,cy + 0.4,1.3); ctx.fill(); }
    if (n >= 4){ drawMosca(ctx,842,432,t,0); drawMosca(ctx,842,432,t,3); }
    rr(ctx,r.x+8,r.y+r.h-12,r.w-12,10,3); fs(ctx,PAL.cromo,2.2);
  });
  glow('sink');
  drawEspuma(ctx,g,t);
  // pia brilha quando não sobra prato limpo
  if (isFinite(g.kitchen.clean) && g.kitchen.clean <= 0){
    const k = RM ? 0.6 : 0.5 + 0.5*Math.sin(t*5);
    ctx.save();
    rr(ctx,799,438,86,46,6); ctx.fillStyle = 'rgba(255,236,150,' + (0.16 + 0.2*k) + ')'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,214,90,' + (0.5 + 0.4*k) + ')'; ctx.lineWidth = 3; ctx.stroke();
    [[808,448],[870,452],[838,474],[878,478]].forEach((c,i) => {
      const q = RM ? 1 : Math.max(0, Math.sin(t*5 + i*1.7)), z = 2 + 5*q;
      if (q <= 0.05) return;
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.4 + 0.5*q) + ')'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(c[0]-z,c[1]); ctx.lineTo(c[0]+z,c[1]); ctx.moveTo(c[0],c[1]-z); ctx.lineTo(c[0],c[1]+z); ctx.stroke();
    });
    ctx.restore();
  }

  // balcão (faixa frontal de inox)
  ctx.fillStyle = PAL.inox; ctx.fillRect(760,92,12,448);
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(762,92,3,448);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(772,92); ctx.lineTo(772,540); ctx.moveTo(760,92); ctx.lineTo(760,540); ctx.stroke();
  [204,304,394].forEach(y => { ctx.beginPath(); ctx.moveTo(760,y); ctx.lineTo(960,y); ctx.stroke(); });
}

function drawChef(ctx,g,x,y,t){
  const sick = !!g.day.gripe;
  ctx.save(); ctx.translate(x,y);
  // corpo
  ctx.beginPath(); ctx.moveTo(-20,34); ctx.lineTo(-17,2); ctx.lineTo(17,2); ctx.lineTo(20,34); ctx.closePath(); fs(ctx,'#fff',2.6);
  ctx.fillStyle = PAL.tinta; circ(ctx,-5,12,1.6); ctx.fill(); circ(ctx,-5,21,1.6); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-9,2); ctx.lineTo(0,10); ctx.lineTo(9,2); ctx.closePath(); fs(ctx,PAL.formica,2);
  // cabeça
  circ(ctx,0,-14,15); fs(ctx,'#B9794B',2.6);
  // touca
  rr(ctx,-13,-34,26,12,2); fs(ctx,'#fff',2.4);
  ctx.beginPath(); ctx.arc(-9,-38,8,0,TAU); ctx.arc(0,-43,9,0,TAU); ctx.arc(9,-38,8,0,TAU); fs(ctx,'#fff',2.4);
  rr(ctx,-13,-34,26,8,2); ctx.fillStyle = '#fff'; ctx.fill();
  // rosto
  ctx.fillStyle = PAL.tinta; circ(ctx,-5.5,-17,1.8); ctx.fill(); circ(ctx,5.5,-17,1.8); ctx.fill();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-9,-22); ctx.lineTo(-3,-20.5); ctx.moveTo(9,-22); ctx.lineTo(3,-20.5); ctx.stroke();
  if (sick){ circ(ctx,0,-12,3.6); fs(ctx,'#E0645A',1.5); }
  // bigode
  ctx.beginPath(); ctx.moveTo(0,-10); ctx.bezierCurveTo(-5,-15,-16,-13,-16,-7); ctx.bezierCurveTo(-12,-9,-5,-7,0,-8); ctx.bezierCurveTo(5,-7,12,-9,16,-7); ctx.bezierCurveTo(16,-13,5,-15,0,-10); ctx.closePath(); fs(ctx,'#1B1512',2);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(0,-4,4,0.3,Math.PI-0.3); ctx.stroke();
  if (sick){ const a = (Math.floor(t*0.6) % 2); if (a) txt(ctx,'Atchim!',-26,-34,12,PAL.perigo,'center',FD,3); }
  ctx.restore();
}

