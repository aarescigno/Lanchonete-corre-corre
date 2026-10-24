/* ============================================================
   CENÁRIO
   ============================================================ */
/* o ponto é a Garagem (v7.4)? Muda o piso, a parede, as mesas e as cadeiras */
function garagem(g){ return !!(g && g.ponto && g.ponto.id === 'garagem'); }
function drawFloor(ctx,g){
  if (garagem(g)) return drawCimento(ctx);
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
  if (garagem(g)) drawGaragem(ctx);
  else drawAzulejo(ctx);
  drawWallCommon(ctx,g,t);
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
  txt(ctx,'PF R$ ' + precoPrato('pf', pt) + ' · Pastel R$ ' + precoPrato('pastel', pt) + ' · Cafezinho R$ ' + DRINK_PRICE.coffee,0,6,16,PAL.formica,'center',FD,0,322);
  ctx.restore();

  // relógio
  const endless = !!(g && (g.mode === 'semfim' || g.mode === 'treino'));   // na Missão zero também conta para a frente, sem fim
  const frac = endless ? ((g.elapsed % 60) / 60) : (g ? clamp(g.clock / g.day.time, 0, 1) : 1);
  const low = !endless && g && g.clock < 20 && g.state === 'playing';
  circ(ctx,712,44,32); fs(ctx,PAL.cromo,3);
  circ(ctx,712,44,26); fs(ctx,'#fff',2);
  ctx.beginPath(); ctx.arc(712,44,21,-Math.PI/2,-Math.PI/2 + TAU*frac); ctx.lineWidth = 6; ctx.strokeStyle = low ? PAL.perigo : (endless ? PAL.ok : PAL.mostarda); ctx.lineCap = 'butt'; ctx.stroke(); ctx.lineCap = 'round';
  txt(ctx, endless ? mmssUp(g.elapsed) : mmss(g ? g.clock : 0), 712, 45, 14, PAL.tinta, 'center', FD);
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
  const x0 = -CALCADA.w;
  // rua e meio-fio
  ctx.fillStyle = '#7E848B'; ctx.fillRect(x0 - 60,0,84,540);
  ctx.fillStyle = '#F7EFD8'; for (let y=20;y<540;y+=60) ctx.fillRect(x0 - 50,y,4,30);
  ctx.fillStyle = '#B4B0A6'; ctx.fillRect(x0 + 18,0,8,540);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 18,0); ctx.lineTo(x0 + 18,540); ctx.stroke();
  // piso de concreto, em placas
  ctx.fillStyle = '#DAD6CC'; ctx.fillRect(x0 + 26,0,-x0 - 26,540);
  ctx.strokeStyle = 'rgba(34,32,28,.12)'; ctx.lineWidth = 1.5;
  for (let x=x0 + 26 + 58; x<0; x+=58){ ctx.beginPath(); ctx.moveTo(x,92); ctx.lineTo(x,540); ctx.stroke(); }
  for (let y=150; y<540; y+=58){ ctx.beginPath(); ctx.moveTo(x0 + 26,y); ctx.lineTo(0,y); ctx.stroke(); }
  // muro da casa (no alto), com janela, e o toldo listrado por cima da espera
  ctx.fillStyle = '#EFC9A4'; ctx.fillRect(x0 + 26,0,-x0 - 26,82);
  rr(ctx,x0 + 70,10,64,44,3); fs(ctx,'#BFE3F2',2.5);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 102,10); ctx.lineTo(x0 + 102,54); ctx.stroke();
  rr(ctx,x0 + 170,18,40,20,3); fs(ctx,'#fff',2); txt(ctx,'Nº 27',x0 + 190,28.5,10,PAL.faixa,'center',FD);
  ctx.fillStyle = '#C7A27E'; ctx.fillRect(x0 + 26,74,-x0 - 26,8);
  const tx0 = x0 + 30, tx1 = -12, n = 8, tw = (tx1 - tx0) / n;
  for (let i=0;i<n;i++){
    ctx.beginPath(); ctx.moveTo(tx0 + i*tw,62); ctx.lineTo(tx0 + (i+1)*tw,62); ctx.lineTo(tx0 + (i+1)*tw,92);
    ctx.quadraticCurveTo(tx0 + (i+0.5)*tw,104,tx0 + i*tw,92); ctx.closePath();
    fs(ctx,i % 2 ? '#fff' : PAL.formica,2);
  }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx0,62); ctx.lineTo(tx1,62); ctx.stroke();
  // lugares de espera
  const ponto = g && g.ponto ? g.ponto : PONTOS[0], max = ponto.espera, tablet = bebidaOf(ponto).prep > 0;
  for (let i=0;i<max;i++){
    const y = QUEUE.ys[i], x = QUEUE.x;
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
    circ(ctx,x-62,y-26,9); fs(ctx,'#fff',1.8); txt(ctx,String(i+1),x-62,y-25.5,11,PAL.faixa,'center',FD);
    if (!tablet) continue;
    const px = x + 90;
    ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(px-2,y-30,4,36); ell(ctx,px,y+6,9,3); fs(ctx,PAL.cromoEsc,1.4);
    ctx.save(); ctx.translate(px,y-36); ctx.rotate(-0.18); rr(ctx,-10,-8,20,14,3); fs(ctx,PAL.tinta,1.6);
    ctx.fillStyle = g && g.up && g.up.maquina ? '#FFE0A6' : '#4a5a6a'; ctx.fillRect(-7,-5,14,8); ctx.restore();
  }
  // plantas da casa da Bia (nível 1, v7.7): espada-de-são-jorge no vaso de barro, no canto de baixo, e uma menor
  // numa lata de tinta reaproveitada, encostada no muro (o banquinho de plástico da v7.5 fica para o nível 2)
  const vx = x0 + 40, vy = 536;
  shadowEll(ctx,vx,vy-11,12,3,0.18);
  drawEspada(ctx,vx,vy-32,0.85);
  ctx.beginPath(); ctx.moveTo(vx-11,vy-36); ctx.lineTo(vx+11,vy-36); ctx.lineTo(vx+8,vy-12); ctx.lineTo(vx-8,vy-12); ctx.closePath(); fs(ctx,'#C9673B',2);
  rr(ctx,vx-13,vy-40,26,6,2); fs(ctx,'#B85A30',2);
  const lx = x0 + 44, ly = 132;
  shadowEll(ctx,lx,ly+1,10,3,0.18);
  drawEspada(ctx,lx,ly-18,0.68);
  rr(ctx,lx-9,ly-20,18,20,2); fs(ctx,PAL.cromo,2);
  ctx.fillStyle = 'rgba(216,67,47,.55)'; ctx.fillRect(lx-8,ly-14,16,7);   // o rótulo desbotado da lata
  // portão de enrolar aberto, na borda do salão: trilho no alto e soleira no chão
  ctx.fillStyle = '#ABA394'; ctx.fillRect(-6,92,12,448);
  ctx.strokeStyle = 'rgba(34,32,28,.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0,96); ctx.lineTo(0,540); ctx.stroke();
  rr(ctx,-12,0,24,92,4); fs(ctx,PAL.cromo,2.5);
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.2;
  for (let y=10;y<86;y+=8){ ctx.beginPath(); ctx.moveTo(-9,y); ctx.lineTo(9,y); ctx.stroke(); }
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
/* estação da bebida da espera: na Garagem (v7.7), a torneira; senão, a máquina de suco da v7.5 */
function drawMaquina(ctx,g,t,menu){
  if (g.bebida.id === 'agua') return drawTorneiraEspera(ctx,g,t,menu);
  const r = STATIONS.maquina.rect, x = r.x + r.w / 2, y = r.y + r.h;
  shadowEll(ctx,x,y-2,34,6,0.2);
  rr(ctx,x-28,y-70,56,68,8); fs(ctx,'#F2F2EE',2.5);
  rr(ctx,x-20,y-64,40,30,6); fs(ctx,'rgba(214,236,246,.9)',2);
  const prep = !menu && g.maq.some(o => o.t > 0);
  const lv = 0.45 + 0.2 * Math.sin(prep && !RM ? t * 5 : 0);
  ctx.fillStyle = 'rgba(242,140,40,.75)'; rr(ctx,x-17,y-36 - 24*lv,34,24*lv,4); ctx.fill();
  if (prep && !RM){ for (let i=0;i<3;i++){ circ(ctx,x-8+i*8,y-40 - ((t*30 + i*9) % 18),2); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); } }
  rr(ctx,x-6,y-34,12,8,2); fs(ctx,PAL.cromoEsc,1.6);
  rr(ctx,x-24,y-18,48,8,3); fs(ctx,PAL.cromo,1.8);
  txt(ctx,'SUCOS',x,y-75,9,PAL.formica,'center',FD);
  if (menu) return;
  const pr = g.maqPronto().reduce((a,o) => a + o.n, 0);
  for (let i=0;i<Math.min(pr,4);i++) drawIcon(ctx,'juice',x-15+i*10,y-22,0.42);
  if (pr){
    const p = RM ? 1 : 1 + 0.08 * Math.sin(t*7);
    ctx.save(); ctx.translate(x+28,y-62); ctx.scale(p,p); circ(ctx,0,0,11); fs(ctx,PAL.ok,2); txt(ctx,String(pr),0,1,13,'#fff','center',FD); ctx.restore();   // copos prontos
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
/* lixeira de pedal no chão do salão, encostada no balcão */
/* Dani: cabelo cacheado, avental roxo e crachá com o nome */
const DANI_LOOK = { skin:3, hair:5, hairC:'#2F1D12', pants:'#3C5A4A', kid:false, elder:false, acc:null, glasses:false };
function drawDani(ctx,d,tm){
  drawPerson(ctx,DANI_LOOK,d.x,d.y,{ shirt:'#F7EFD8', moving:d.moving, ph:d.walkPh, mood:0 });
  const bob = (d.moving && !RM) ? -Math.abs(Math.sin(d.walkPh)) * 2.4 : 0;
  ctx.beginPath(); ctx.moveTo(d.x-8,d.y-30+bob); ctx.lineTo(d.x+8,d.y-30+bob); ctx.lineTo(d.x+11,d.y-12); ctx.lineTo(d.x-11,d.y-12); ctx.closePath(); fs(ctx,'#7B4FB5',2.2);
  rr(ctx,d.x-14,d.y-84,28,12,5); fs(ctx,'#fff',1.6); txt(ctx,'Dani',d.x,d.y-77.5,9,'#7B4FB5','center',FD);
  d.hands.forEach((h,i) => drawHandItem(ctx,h,d.x + (i ? 18 : -18),d.y - 28,0.7));
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
function drawTv(ctx,x,y,tm,s){
  ctx.save(); ctx.translate(x,y); if (s) ctx.scale(s,s);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-4,-42); ctx.lineTo(-18,-62); ctx.moveTo(4,-42); ctx.lineTo(14,-64); ctx.stroke();
  circ(ctx,-18,-62,3); fs(ctx,PAL.cromo,1.4); circ(ctx,14,-64,3.5); fs(ctx,PAL.cromo,1.4);
  rr(ctx,-30,-44,60,44,7); fs(ctx,'#6B6F7A',2.5);
  rr(ctx,-26,-40,40,34,7); fs(ctx,'#1B2233',2);
  ctx.save(); rr(ctx,-24,-38,36,30,6); ctx.clip();
  const prog = RM ? 0 : Math.floor(tm / 6) % 3;
  if (prog === 0){
    ctx.fillStyle = '#1E4FA8'; ctx.fillRect(-24,-38,36,30);
    circ(ctx,-6,-26,8); fs(ctx,'#5FB8F0',1.4);
    ctx.save(); ctx.translate(-6,-26); ctx.rotate(-0.4); ell(ctx,0,0,12,3.5); ctx.strokeStyle = '#FFD36B'; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
    txt(ctx,'ESFERA',-6,-13,6,'#fff','center',FD);
  } else if (prog === 1){
    ctx.fillStyle = '#3E9B4F'; ctx.fillRect(-24,-38,36,30);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-6,-38); ctx.lineTo(-6,-8); ctx.stroke();
    circ(ctx,-6,-23,6); ctx.stroke();
    circ(ctx,-6 + Math.sin(tm*1.7)*12,-23 + Math.sin(tm*2.3)*8,2.2); fs(ctx,'#fff',1);
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
  if (eq.tv) drawTv(ctx,146,y-2,tm);
}
/* água saborizada na entrada (jarra com frutas numa mesinha) */
function ctx2chef(c){ c.beginPath(); c.arc(-5,-17,5,0,TAU); c.arc(0,-20,6,0,TAU); c.arc(5,-17,5,0,TAU); fs(c,'#fff',1.6); }
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
function drawFumacaVerde(ctx,x,y,t){
  for (let i=0;i<3;i++){
    const f = RM ? (i + 0.5) / 3 : ((t * 0.5 + i / 3) % 1);
    const px = x + Math.sin(f * 5 + i * 2) * 4, py = y - f * 26, r = 3 + f * 4;
    ctx.fillStyle = 'rgba(' + TRASH_COR.fumaca + ',' + (0.7 * (1 - f) + 0.15).toFixed(2) + ')';
    circ(ctx,px,py,r); ctx.fill();
  }
}
function drawTrash(ctx,on,t,g){
  const x = 723, y = 530;
  const lv = g && g.state !== 'menu' ? g.trash : 0, cheia = lv >= TRASH.cap;
  const f = Math.min(1, lv / TRASH.cap);   // v8.3.10: a lata vai do cinza ao esverdeado conforme enche
  if (cheia) drawSacoLixo(ctx,x-23,y-3);   // à esquerda, atrás da lata (à direita fica a parede da cozinha)
  shadowEll(ctx,x,y,20,5,0.18);
  ctx.beginPath(); ctx.moveTo(x-15,y-40); ctx.lineTo(x+15,y-40); ctx.lineTo(x+12,y-2); ctx.lineTo(x-12,y-2); ctx.closePath(); fs(ctx,mixCor(TRASH_COR.vazia,TRASH_COR.cheia,f),2.4);
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x-8,y-34); ctx.lineTo(x-7,y-8); ctx.stroke();
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x+1,y-34); ctx.lineTo(x+1,y-8); ctx.moveTo(x+7,y-34); ctx.lineTo(x+6,y-8); ctx.stroke();
  if (cheia){
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
    if (cheia){
      drawFumacaVerde(ctx,x-24,y-33,t);
      drawFumacaVerde(ctx,x-2,y-50,t + 0.6);
      rr(ctx,x-20,y-86,40,13,4); fs(ctx,PAL.perigo,1.6); txt(ctx,'CHEIO',x,y-79,9,'#fff','center',FD);
    }
  }
  if (on){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; const r = STATIONS.trash.rect; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
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
function drawBandeirinhas(ctx){
  const x0 = -CALCADA.w + 30, x1 = -8, cores = ['#E2574C','#F2B33D','#3E9B5A','#3F7FD0','#8E5BB5','#F28FB0','#4FB6B0'];
  const pt = u => ({ x:x0 + (x1 - x0)*u, y:2 + 7*4*u*(1 - u) });
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.8; ctx.beginPath();
  for (let i=0;i<=24;i++){ const p = pt(i/24); i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y); } ctx.stroke();
  for (let i=0;i<14;i++){
    const u = (i + 0.5)/14, p = pt(u), d = 6;
    ctx.beginPath(); ctx.moveTo(p.x - d,p.y); ctx.lineTo(p.x + d,p.y); ctx.lineTo(p.x,p.y + 12); ctx.closePath(); fs(ctx,cores[(i*3) % cores.length],1.6);
  }
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
        ctx.fillStyle = cmdColor(tk.group) || PAL.faixa; ctx.fillRect(x,y,tw,9);
        ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.5; ctx.strokeRect(x,y,tw,9);
        txt(ctx,String(tk.table),x+tw/2,y+26,ns > 3 ? 16 : 20,PAL.tinta,'center',FD);
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
  glow('order');

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
  for (let i=0;i<4;i++){
    const s = PLATE_SLOTS[i], p = g.kitchen.plates[i];
    ell(ctx,s.x,s.y+4,19,10); ctx.fillStyle = 'rgba(34,32,28,.12)'; ctx.fill();
    if (p) glowSprite(ctx,g,p,ctx => {
      const bounce = RM ? 0 : Math.max(0, 1 - p.age*3) * -8;
      const pc = cmdColor(p.group);
      if (pc) drawTray(ctx,s.x,s.y+2+bounce,1.0,pc);
      if (p.vip){ ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 3; ell(ctx,s.x,s.y+bounce,17,9); ctx.stroke(); }
      drawDish(ctx,p.dish,s.x,s.y+bounce,1.1);
      if (p.crit) txt(ctx,'★',s.x-13,s.y-14+bounce,15,PAL.mostarda,'center',FD);
      circ(ctx,s.x+12,s.y-14+bounce,9); fs(ctx,'#fff',2);
      txt(ctx,String(p.table),s.x+12,s.y-13+bounce,12,PAL.tinta,'center',FD);
      const a = 0.35 + 0.3*Math.sin(t*6 + i);
      ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 3; ell(ctx,s.x,s.y+2,21,13); ctx.stroke();
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
    rr(ctx,799,438,86,46,6); fs(ctx,'#8EC5E8',2);
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(805,444,30,3);
    ctx.beginPath(); ctx.moveTo(842,432); ctx.lineTo(842,428); ctx.quadraticCurveTo(842,423.5,849,423.5); ctx.lineTo(856,423.5); ctx.lineWidth = 6; ctx.strokeStyle = PAL.tinta; ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = PAL.cromo; ctx.stroke();
    // carrinho de louça
    rr(ctx,902,440,50,34,5); fs(ctx,PAL.cromo,2.6);
    ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(906,456,42,3);
    circ(ctx,914,484,6); fs(ctx,'#4a4a4a',2); circ(ctx,940,484,6); fs(ctx,'#4a4a4a',2);
    const n = g.kitchen.sinkN;
    for (let i=0;i<n;i++){ ell(ctx,927,435-(i%4)*4 - (i>3?2:0),16,4); fs(ctx,i%2?'#f2f0e8':'#fff',1.8); }
    rr(ctx,r.x+8,r.y+r.h-12,r.w-12,10,3); fs(ctx,PAL.cromo,2.2);
  });
  glow('sink');

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

