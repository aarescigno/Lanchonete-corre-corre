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
/* Garagem: parede de bloco pintada, portão de enrolar aberto (com a rua lá fora) e letreiro feito à mão */
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
  // vão do portão: céu, uma casinha do outro lado da rua, a rua e a calçada
  const x0 = 8, x1 = 152;
  ctx.fillStyle = '#BFE3F2'; ctx.fillRect(x0,18,x1-x0,46);
  rr(ctx,26,34,46,30,2); fs(ctx,'#E9A66B',2); rr(ctx,36,42,12,10,1); fs(ctx,'#fff',1.5); rr(ctx,54,46,10,18,1); fs(ctx,PAL.madeiraEsc,1.5);
  circ(ctx,118,40,14); fs(ctx,'#5FA36B',2); ctx.fillStyle = PAL.madeiraEsc; ctx.fillRect(116,53,4,11);
  ctx.fillStyle = '#8F959C'; ctx.fillRect(x0,64,x1-x0,14);
  ctx.fillStyle = '#F7EFD8'; for (let x=x0+8;x<x1;x+=28) ctx.fillRect(x,70,14,2);
  ctx.fillStyle = '#D6D1C6'; ctx.fillRect(x0,78,x1-x0,14);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.5; ctx.strokeRect(x0,18,x1-x0,74);
  // trilhos dos lados e o rolo de aço do portão, enrolado lá em cima
  ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(x0-6,16,7,76); ctx.fillRect(x1-1,16,7,76);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.strokeRect(x0-6,16,7,76); ctx.strokeRect(x1-1,16,7,76);
  rr(ctx,x0-8,4,x1-x0+16,16,6); fs(ctx,PAL.cromo,2.5);
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.2;
  for (let y=8;y<=16;y+=4){ ctx.beginPath(); ctx.moveTo(x0-4,y); ctx.lineTo(x1+4,y); ctx.stroke(); }
  // soleira de cimento
  rr(ctx,x0,90,x1-x0,7,2); fs(ctx,'#ABA394',1.5);
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
  txt(ctx,'PF R$ 18 · Pastel R$ 9 · Cafezinho R$ 3',0,6,16,PAL.formica,'center',FD);
  ctx.restore();

  // relógio
  const endless = !!(g && g.mode === 'semfim');
  const frac = endless ? ((g.elapsed % 60) / 60) : (g ? clamp(g.clock / g.day.time, 0, 1) : 1);
  const low = !endless && g && g.clock < 20 && g.state === 'playing';
  circ(ctx,712,44,32); fs(ctx,PAL.cromo,3);
  circ(ctx,712,44,26); fs(ctx,'#fff',2);
  ctx.beginPath(); ctx.arc(712,44,21,-Math.PI/2,-Math.PI/2 + TAU*frac); ctx.lineWidth = 6; ctx.strokeStyle = low ? PAL.perigo : (endless ? PAL.ok : PAL.mostarda); ctx.lineCap = 'butt'; ctx.stroke(); ctx.lineCap = 'round';
  txt(ctx, endless ? mmssUp(g.elapsed) : mmss(g ? g.clock : 0), 712, 45, 14, PAL.tinta, 'center', FD);

  // placa da cozinha
  rr(ctx,782,18,170,36,8); fs(ctx,PAL.faixa,3);
  txt(ctx,'COZINHA DO TONHÃO',867,36,13,'#fff','center',FD);
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
/* água saborizada na entrada (jarra com frutas numa mesinha) */
function ctx2chef(c){ c.beginPath(); c.arc(-5,-17,5,0,TAU); c.arc(0,-20,6,0,TAU); c.arc(5,-17,5,0,TAU); fs(c,'#fff',1.6); }
function drawAguaJar(ctx,x,y,s,lv){
  lv = lv == null ? 1 : clamp(lv, 0, 1);
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  rr(ctx,-14,-4,28,6,2); fs(ctx,PAL.madeira,2); ctx.fillStyle = PAL.madeiraEsc; ctx.fillRect(-11,2,3,10); ctx.fillRect(8,2,3,10);
  rr(ctx,-10,-30,20,26,6); fs(ctx,'rgba(214,236,246,.9)',2);
  if (lv > 0){
    const h = Math.max(3, 18 * lv);
    rr(ctx,-8,-6-h,16,h,Math.min(4,h/2)); ctx.fillStyle = 'rgba(110,184,234,.55)'; ctx.fill();
    circ(ctx,-3,-10,3); fs(ctx,'#F6C343',1.2);
    if (lv > 0.35){ circ(ctx,3,-12,2.6); fs(ctx,'#3E9B5A',1.2); }
    if (lv > 0.7){ circ(ctx,2,-19,2.2); fs(ctx,PAL.formica,1.2); }
  }
  rr(ctx,-3,-34,6,5,2); fs(ctx,PAL.cromo,1.4);
  ctx.restore();
}
/* jarra no salão: nível das doses, aviso de vazia e destaque quando é a próxima ação da Bia */
function drawAgua(ctx,g,t,menu){
  const x = 182, y = 150;
  drawAguaJar(ctx,x,y,1,menu ? 1 : g.agua / AGUA.cap);
  if (menu) return;
  const n = g.agua;
  rr(ctx,x+12,y-12,24,14,4); fs(ctx,'#fff',1.4);
  txt(ctx,String(n),x+24,y-4.5,10,n > 0 ? PAL.tinta : PAL.perigo,'center',FD);
  if (n <= 0){ rr(ctx,x-21,y-52,42,13,4); fs(ctx,PAL.perigo,1.6); txt(ctx,'VAZIA',x,y-45,9,'#fff','center',FD); }
  const a0 = g.bia.acts[0];
  if (a0 && a0.type === 'agua'){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; const r = STATIONS.agua.rect; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
}
function drawTrash(ctx,on,t,g){
  const x = 723, y = 530;
  shadowEll(ctx,x,y,20,5,0.18);
  ctx.beginPath(); ctx.moveTo(x-15,y-40); ctx.lineTo(x+15,y-40); ctx.lineTo(x+12,y-2); ctx.lineTo(x-12,y-2); ctx.closePath(); fs(ctx,PAL.cromoEsc,2.4);
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x-8,y-34); ctx.lineTo(x-7,y-8); ctx.stroke();
  ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x+1,y-34); ctx.lineTo(x+1,y-8); ctx.moveTo(x+7,y-34); ctx.lineTo(x+6,y-8); ctx.stroke();
  rr(ctx,x-17,y-47,34,8,3); fs(ctx,PAL.cromo,2.2);
  rr(ctx,x-4,y-51,8,5,2); fs(ctx,PAL.cromoEsc,1.6);
  rr(ctx,x-7,y-4,14,5,2); fs(ctx,PAL.tinta,1.2);
  txt(ctx,'LIXO',x,y-21,9,'#fff','center',FB);
  const lv = g ? g.trash : 0;
  if (g && g.state !== 'menu'){
    // nível: 8 tracinhos na lateral
    for (let i=0;i<TRASH.cap;i++){ ctx.fillStyle = i < lv ? (lv >= TRASH.cap ? PAL.perigo : (lv >= TRASH.cap - 2 ? PAL.alerta : PAL.ok)) : 'rgba(255,255,255,.35)'; ctx.fillRect(x+16,y-6-i*4.4,4,3.2); }
    if (lv >= TRASH.cap){
      ctx.strokeStyle = 'rgba(110,140,60,.8)'; ctx.lineWidth = 2;
      for (let i=0;i<3;i++){ const ph = RM ? 0 : Math.sin(t*3 + i)*3; ctx.beginPath(); ctx.moveTo(x-10+i*10,y-54); ctx.quadraticCurveTo(x-14+i*10+ph,y-62,x-10+i*10,y-70); ctx.stroke(); }
      rr(ctx,x-20,y-86,40,13,4); fs(ctx,PAL.perigo,1.6); txt(ctx,'CHEIO',x,y-79,9,'#fff','center',FD);
    }
  }
  if (on){ ctx.save(); const a = 0.55 + 0.4*Math.sin(t*8); ctx.strokeStyle = 'rgba(242,179,61,' + a + ')'; ctx.lineWidth = 5; const r = STATIONS.trash.rect; rr(ctx,r.x,r.y,r.w,r.h,8); ctx.stroke(); ctx.restore(); }
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
    for (let i=0;i<2;i++){
      const cx = 836 + i*16, cy = 372;
      ell(ctx,cx,cy+8,8,3); fs(ctx,'#fff',1.8);
      rr(ctx,cx-6,cy-5,12,12,3); fs(ctx,'#fff',1.8);
      ctx.fillStyle = '#5B2E1A'; ctx.fillRect(cx-4.5,cy-3,9,2.5);
    }
    if (!RM){
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
  const sick = g.day.n === 7;
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

