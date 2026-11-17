/* ============================================================
   ABERTURA (refeita da v11.12 à v11.15, etapa 9; docs/ABERTURA.md): o desenho
   Quadro cheio (TW x H). Cada cena é desenhada no espaço da cena e vista pela câmera (Abertura.cam): o fundo (paralaxe menor que 1), o meio
   (paralaxe 1, onde as pessoas pisam, em y = AB2.chao) e a frente (maior que 1, silhuetas escuras nas bordas), com uma fonte de luz, sombras,
   a camada de cor do clima e a vinheta. A cena recebe (c, p, T, cam) e devolve a cabeça de quem fala, no espaço da cena ([x, y, deslocamento
   do balão]); os balões, a legenda e as bolinhas vão no espaço da tela.
   ============================================================ */
const AB2 = { chao:520, k:1.38 };   // o chão dos planos abertos e o tamanho das pessoas sobre o abEsc (o adulto com 290 px)

/* ---------- o kit: camada, luz, sombra, vinheta e clima ---------- */
// desenha fn vista pela câmera; k é a paralaxe (o quanto a camada acompanha o centro da câmera)
function ab2Camada(c,cam,k,fn){
  c.save();
  c.translate(TW / 2,H / 2); c.scale(cam.z,cam.z);
  c.translate(-(TW / 2 + (cam.cx - TW / 2) * k),-(H / 2 + (cam.cy - H / 2) * k));
  fn();
  c.restore();
}
// halo de luz (degradê radial); rgb é 'r,g,b'
function ab2Luz(c,x,y,r,rgb,a){
  const g = c.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1,'rgba(' + rgb + ',0)');
  c.fillStyle = g; c.fillRect(x - r,y - r,r * 2,r * 2);
}
// sombra elíptica macia no chão
function ab2Sombra(c,x,y,rx,ry,a){
  c.save(); c.translate(x,y); c.scale(1,ry / rx);
  const g = c.createRadialGradient(0,0,rx * 0.25,0,0,rx);
  g.addColorStop(0,'rgba(58,36,24,' + (a || 0.3) + ')'); g.addColorStop(1,'rgba(58,36,24,0)');
  c.fillStyle = g; c.fillRect(-rx,-rx,rx * 2,rx * 2);
  c.restore();
}
// vinheta escura nas bordas (no espaço da tela)
function ab2Vinheta(c,a){
  const g = c.createRadialGradient(TW / 2,H / 2,H * 0.5,TW / 2,H / 2,TW * 0.66);
  g.addColorStop(0,'rgba(30,18,12,0)'); g.addColorStop(1,'rgba(30,18,12,' + (a || 0.45) + ')');
  c.fillStyle = g; c.fillRect(0,0,TW,H);
}
// a camada de cor do clima, por cima de tudo (no espaço da tela)
function ab2Clima(c,rgb,a){ c.fillStyle = 'rgba(' + rgb + ',' + a + ')'; c.fillRect(0,0,TW,H); }
// a pessoa respira (1 a 2 px na cabeça) e, com `pulo`, sobe um pouco
function ab2Vivo(c,x,y,T,sd,fn,pulo){
  c.save(); c.translate(x,y - (pulo || 0)); c.scale(1,1 + (T > 0 ? Math.sin(T * 2.1 + sd) * 0.006 : 0)); c.translate(-x,-y);
  fn();
  c.restore();
}
// folha em silhueta: da base (x, y), no ângulo ang
function ab2Folha(c,x,y,ang,len,larg,cor){
  const dx = Math.cos(ang), dy = Math.sin(ang), mx = x + dx * len * 0.5, my = y + dy * len * 0.5;
  c.beginPath(); c.moveTo(x,y);
  c.quadraticCurveTo(mx - dy * larg,my + dx * larg,x + dx * len,y + dy * len);
  c.quadraticCurveTo(mx + dy * larg,my - dx * larg,x,y);
  c.closePath(); c.fillStyle = cor; c.fill();
}

/* ---------- o cenário "cozinha de casa" (cenas 1 e 2; a 7 e a 8 reusam nos modos 'noite' e 'lar') ---------- */
const AB2_COZ = { rodape:470, base:516, porta:{ x:70, y:128, w:164, h:342 }, gel:{ x:290, y:246, w:108, h:270 }, fogao:{ x:608, w:176, topo:448 },
  panela:[680,438], molho:401, janela:{ x:838, y:100, w:226, h:196 }, bancada:{ x:818, w:264, topo:450 } };   // molho: a altura do molho na panela

// lá fora: o céu da tarde, o sol baixo, os telhados e a copa da árvore (mais longe: desliza menos que a parede)
function ab2LaFora(c,cam,J){
  c.save(); rr(c,J.x,J.y,J.w,J.h,6); c.clip();
  c.translate((cam.cx - TW / 2) * 0.25,(cam.cy - H / 2) * 0.25);
  const g = c.createLinearGradient(0,J.y,0,J.y + J.h); g.addColorStop(0,'#8FCBEA'); g.addColorStop(0.62,'#CFE6DC'); g.addColorStop(1,'#FBE2A4');
  c.fillStyle = g; c.fillRect(J.x - 90,J.y - 30,J.w + 180,J.h + 60);
  ab2Luz(c,J.x + 48,J.y + J.h - 24,170,'255,240,180',0.95);
  c.fillStyle = 'rgba(255,255,255,.85)'; ell(c,J.x + 74,J.y + 46,34,10); c.fill(); ell(c,J.x + 100,J.y + 38,22,9); c.fill(); ell(c,J.x + 196,J.y + 72,26,8); c.fill();
  // telhados ao longe
  c.fillStyle = '#D9B79A'; c.beginPath(); c.moveTo(J.x - 90,J.y + J.h + 30); c.lineTo(J.x - 90,J.y + 150); c.lineTo(J.x - 10,J.y + 150); c.lineTo(J.x + 22,J.y + 128); c.lineTo(J.x + 60,J.y + 150); c.lineTo(J.x + 96,J.y + 150); c.lineTo(J.x + 96,J.y + J.h + 30); c.closePath(); c.fill();
  c.fillStyle = '#C99F86'; c.fillRect(J.x + 30,J.y + 160,14,16);
  // a árvore
  c.strokeStyle = '#7A5636'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(J.x + 176,J.y + J.h + 20); c.lineTo(J.x + 170,J.y + 120); c.stroke();
  [[150,112,44,'#4C9460'],[204,98,48,'#4C9460'],[246,130,40,'#3F8454'],[176,76,40,'#5FA86B'],[226,64,34,'#5FA86B'],[132,140,30,'#5FA86B'],[196,120,30,'#6DB877']].forEach(q => { c.fillStyle = q[3]; circ(c,J.x + q[0],J.y + q[1],q[2]); c.fill(); });
  c.fillStyle = 'rgba(190,230,150,.7)'; [[166,62,9],[214,48,8],[140,104,7],[236,96,7]].forEach(q => { circ(c,J.x + q[0],J.y + q[1],q[2]); c.fill(); });
  c.restore();
}
// a janela: lá fora, a moldura, o peitoril e a cortina rosa presa dos lados
function ab2Janela(c,cam,E,T){
  const J = AB2_COZ.janela, xa = J.x, xb = J.x + J.w, ya = J.y, yb = J.y + J.h;
  if (E) ab2LaForaTempo(c,cam,J,E,T); else ab2LaFora(c,cam,J);
  rr(c,xa - 7,ya - 7,J.w + 14,J.h + 14,8); c.lineWidth = 3; c.strokeStyle = PAL.tinta; c.stroke();
  rr(c,xa - 2,ya - 2,J.w + 4,J.h + 4,6); c.lineWidth = 9; c.strokeStyle = '#FFFDF7'; c.stroke();
  rr(c,xa + 3,ya + 3,J.w - 6,J.h - 6,4); c.lineWidth = 2; c.strokeStyle = PAL.tinta; c.stroke();
  c.fillStyle = '#FFFDF7'; c.fillRect(xa + J.w / 2 - 4,ya,8,J.h); c.fillRect(xa,ya + J.h * 0.44 - 4,J.w,8);
  c.strokeStyle = PAL.tinta; c.lineWidth = 1.6; c.beginPath();
  c.moveTo(xa + J.w / 2 - 4,ya + 4); c.lineTo(xa + J.w / 2 - 4,yb - 4); c.moveTo(xa + J.w / 2 + 4,ya + 4); c.lineTo(xa + J.w / 2 + 4,yb - 4);
  c.moveTo(xa + 4,ya + J.h * 0.44 - 4); c.lineTo(xb - 4,ya + J.h * 0.44 - 4); c.moveTo(xa + 4,ya + J.h * 0.44 + 4); c.lineTo(xb - 4,ya + J.h * 0.44 + 4); c.stroke();
  rr(c,xa - 20,yb + 6,J.w + 40,13,5); fs(c,'#FFFDF7',3);
  // o varão e as cortinas
  c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 9; c.beginPath(); c.moveTo(xa - 44,ya - 26); c.lineTo(xb + 44,ya - 26); c.stroke();
  c.strokeStyle = PAL.madeira; c.lineWidth = 5; c.stroke();
  const bal = E && T > 0 ? Math.sin(T * 1.2) * 0.022 : 0;   // fora da tarde, a cortina balança de leve
  if (bal){ c.save(); c.transform(1,0,bal,1,-bal * (ya - 26),0); }
  [-1,1].forEach(d => {
    const e = d < 0 ? xa : xb, x = q => e - d * q;   // q: para dentro da janela
    c.beginPath(); c.moveTo(x(-34),ya - 24); c.lineTo(x(74),ya - 24);
    c.quadraticCurveTo(x(60),ya + 70,x(2),ya + 112); c.quadraticCurveTo(x(22),ya + 160,x(30),yb + 14);
    c.lineTo(x(-34),yb + 14); c.quadraticCurveTo(x(-26),ya + 112,x(-34),ya - 24); c.closePath(); fs(c,'#EFA3B5',3);
    c.strokeStyle = '#D77C97'; c.lineWidth = 2.5; c.beginPath();
    c.moveTo(x(40),ya - 20); c.quadraticCurveTo(x(34),ya + 60,x(-4),ya + 108); c.moveTo(x(8),ya - 20); c.quadraticCurveTo(x(6),ya + 50,x(-14),ya + 104);
    c.moveTo(x(-12),ya + 124); c.lineTo(x(-18),yb + 8); c.moveTo(x(6),ya + 126); c.lineTo(x(10),yb + 8); c.stroke();
    rr(c,d < 0 ? xa - 32 : xb - 4,ya + 104,36,13,6); fs(c,AB_COR.rosa,2.5);
    circ(c,x(-44),ya - 26,7); fs(c,PAL.madeira,2.5);
  });
  if (bal) c.restore();
}
// a parede (o fundo): creme com o barrado de azulejo, a janela, a prateleira dos temperos, as panelas penduradas, o relógio e a folhinha
function ab2CozinhaFundo(c,cam,modo,T,E){
  const g = c.createLinearGradient(0,0,0,320); g.addColorStop(0,'#E6CC96'); g.addColorStop(1,'#F6E7C1');
  c.fillStyle = g; c.fillRect(0,0,TW,320);
  ab2Luz(c,950,200,380,'255,244,200',0.55);                                  // a parede clareia em volta da janela
  const gs = c.createLinearGradient(0,0,520,0); gs.addColorStop(0,'rgba(150,104,60,.24)'); gs.addColorStop(1,'rgba(150,104,60,0)');
  c.fillStyle = gs; c.fillRect(0,0,520,320);                                 // e escurece para o lado da porta
  // o barrado de azulejo azul e branco, até 1/3 da altura
  const y0 = 318, q = 38;
  c.fillStyle = '#FBFAF5'; c.fillRect(0,y0,TW,H - y0);
  c.strokeStyle = 'rgba(31,79,163,.2)'; c.lineWidth = 2; c.beginPath();
  for (let x = 12; x < TW; x += q){ c.moveTo(x,y0); c.lineTo(x,H); }
  for (let y = y0 + q; y < H; y += q){ c.moveTo(0,y); c.lineTo(TW,y); }
  c.stroke();
  c.fillStyle = '#2F63AE'; c.beginPath();
  for (let x = 12; x < TW; x += q) for (let y = y0 + q; y < 500; y += q){ c.moveTo(x,y - 6); c.lineTo(x + 6,y); c.lineTo(x,y + 6); c.lineTo(x - 6,y); c.closePath(); }
  c.fill();
  c.fillStyle = '#9DBCE6'; c.beginPath();
  for (let x = 12 + q / 2, i = 0; x < TW; x += q, i++) for (let y = y0 + q / 2, j = 0; y < 500; y += q, j++) if ((i + j) % 2 === 0){ c.moveTo(x + 5,y); c.arc(x,y,5,0,TAU); }
  c.fill();
  c.fillStyle = PAL.faixa; c.fillRect(0,y0 - 12,TW,12);
  c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(0,y0 - 9,TW,2);
  c.strokeStyle = PAL.tinta; c.lineWidth = 2; c.beginPath(); c.moveTo(0,y0 - 12); c.lineTo(TW,y0 - 12); c.moveTo(0,y0); c.lineTo(TW,y0); c.stroke();
  ab2Janela(c,cam,E,T);
  // a prateleira: seis potes de tempero e um vaso
  const sx = 272, sy = 196;
  c.fillStyle = 'rgba(120,80,40,.16)'; c.fillRect(sx + 4,sy + 9,188,10);
  [sx + 22,sx + 166].forEach(x => { c.beginPath(); c.moveTo(x,sy + 8); c.lineTo(x,sy + 30); c.lineTo(x + 14,sy + 8); c.closePath(); fs(c,PAL.madeiraEsc,2.5); });
  rr(c,sx,sy,192,10,3); fs(c,PAL.madeira,3);
  ['#C2362B','#F2C23D','#7FA650','#8A5226','#F4EFE6','#E88A4A'].forEach((cor,i) => {
    const x = sx + 10 + i * 25, h = 26 + (i % 2) * 5;
    rr(c,x,sy - h,19,h,4); fs(c,'#EAF3F4',2.5);
    c.fillStyle = cor; c.fillRect(x + 2,sy - h * 0.62,15,h * 0.62 - 2);
    rr(c,x - 1,sy - h - 6,21,8,3); fs(c,i % 3 === 0 ? PAL.madeira : PAL.cromoEsc,2.2);
    c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(x + 3,sy - h + 3,3,h * 0.3);
  });
  c.strokeStyle = '#3F8454'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx + 172,sy - 22); c.quadraticCurveTo(sx + 166,sy - 44,sx + 158,sy - 52); c.moveTo(sx + 172,sy - 22); c.quadraticCurveTo(sx + 178,sy - 46,sx + 186,sy - 50); c.stroke();
  ab2Folha(c,sx + 166,sy - 40,-2.4,16,6,'#5FA86B'); ab2Folha(c,sx + 178,sy - 40,-0.7,16,6,'#5FA86B'); abFlor(c,sx + 158,sy - 54,3.4); abFlor(c,sx + 187,sy - 52,3);
  c.beginPath(); c.moveTo(sx + 163,sy - 24); c.lineTo(sx + 181,sy - 24); c.lineTo(sx + 184,sy); c.lineTo(sx + 160,sy); c.closePath(); fs(c,'#5B8FD0',2.5);
  // as três panelas penduradas, por cima do fogão
  c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 8; c.beginPath(); c.moveTo(606,112); c.lineTo(782,112); c.stroke();
  c.strokeStyle = '#6B6B72'; c.lineWidth = 4; c.stroke();
  [[636,28,'#4A4A52'],[696,22,'#C97B4A'],[748,17,'#8E99A6']].forEach(q => {
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.arc(q[0],118,6,-Math.PI / 2,Math.PI); c.stroke();
    rr(c,q[0] - 5,122,10,36,4); fs(c,'#3a3a3c',2.5);
    circ(c,q[0],156 + q[1],q[1]); fs(c,q[2],3.5);
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 3; c.beginPath(); c.arc(q[0],156 + q[1],q[1] * 0.62,Math.PI * 1.05,Math.PI * 1.6); c.stroke();
  });
  // a folhinha
  rr(c,468,246,50,78,3); fs(c,'#E9D2A0',2.5);
  c.fillStyle = '#E88A4A'; c.fillRect(472,250,42,26); c.fillStyle = '#F2C23D'; circ(c,503,260,6); c.fill();
  c.fillStyle = '#5FA86B'; c.beginPath(); c.moveTo(472,276); c.lineTo(486,262); c.lineTo(498,276); c.closePath(); c.fill();
  rr(c,474,280,38,40,2); fs(c,'#fff',2);
  c.fillStyle = PAL.perigo; c.fillRect(475,281,36,8);
  txt(c,'12',493,304,22,PAL.tinta,'center',FD);
  circ(c,493,244,2.6); fs(c,PAL.cromoEsc,1.5);
  // o relógio de parede
  const rx = 1152, ry = 184, a1 = -Math.PI / 2 + TAU * (4.6 / 12), a2 = -Math.PI / 2 + TAU * (40 / 60), a3 = -Math.PI / 2 + TAU * ((T > 0 ? Math.floor(T) : 0) % 60) / 60;
  c.fillStyle = 'rgba(120,80,40,.18)'; circ(c,rx + 5,ry + 7,34); c.fill();
  circ(c,rx,ry,34); fs(c,PAL.formica,3.5); circ(c,rx,ry,27); fs(c,'#FFFDF7',2.5);
  c.fillStyle = PAL.tinta; for (let i=0;i<12;i++){ const a = i * TAU / 12; circ(c,rx + Math.cos(a) * 22,ry + Math.sin(a) * 22,i % 3 ? 1.2 : 2.2); c.fill(); }
  c.strokeStyle = PAL.tinta; c.lineCap = 'round';
  c.lineWidth = 4; c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx + Math.cos(a1) * 12,ry + Math.sin(a1) * 12); c.stroke();
  c.lineWidth = 3; c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx + Math.cos(a2) * 19,ry + Math.sin(a2) * 19); c.stroke();
  c.strokeStyle = PAL.perigo; c.lineWidth = 1.5; c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx + Math.cos(a3) * 21,ry + Math.sin(a3) * 21); c.stroke();
  circ(c,rx,ry,3); c.fillStyle = PAL.tinta; c.fill();
  if (E) ab2CozinhaTempo(c,E,T);
}
// o piso de ladrilho em xadrez creme e terracota, em perspectiva, com o rodapé
function ab2Piso(c,corA,corB,rodape){
  const y0 = AB2_COZ.rodape, vy = 215, w0 = 46, ys = [y0,484,502,526,558,600,660];
  c.fillStyle = corA || '#F1DFB8'; c.fillRect(-140,y0,TW + 280,H - y0 + 80);
  c.fillStyle = corB || '#D68C5E'; c.beginPath();
  for (let r = 0; r < ys.length - 1; r++){
    const ka = (ys[r] - vy) / (y0 - vy), kb = (ys[r + 1] - vy) / (y0 - vy);
    for (let i = -18; i < 18; i++) if ((i + r) & 1){
      c.moveTo(TW / 2 + i * w0 * ka,ys[r]); c.lineTo(TW / 2 + (i + 1) * w0 * ka,ys[r]); c.lineTo(TW / 2 + (i + 1) * w0 * kb,ys[r + 1]); c.lineTo(TW / 2 + i * w0 * kb,ys[r + 1]); c.closePath();
    }
  }
  c.fill();
  const g = c.createLinearGradient(0,y0,0,H + 40); g.addColorStop(0,'rgba(110,64,30,.16)'); g.addColorStop(0.25,'rgba(110,64,30,0)'); g.addColorStop(1,'rgba(90,50,26,.22)');
  c.fillStyle = g; c.fillRect(-140,y0,TW + 280,H - y0 + 80);
  c.fillStyle = rodape || '#FBF3DC'; c.fillRect(-140,y0 - 13,TW + 280,13);
  c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-140,y0 - 13); c.lineTo(TW + 140,y0 - 13); c.moveTo(-140,y0); c.lineTo(TW + 140,y0); c.stroke();
}
// a porta aberta, com o corredor mais escuro atrás; `atras` desenha quem está no corredor (recortado pelo vão)
function ab2Porta(c,atras){
  const P = AB2_COZ.porta, xb = P.x + P.w, yb = P.y + P.h;
  c.save(); c.beginPath(); c.rect(P.x,P.y,P.w,P.h); c.clip();
  const g = c.createLinearGradient(P.x,0,xb,0); g.addColorStop(0,'#757198'); g.addColorStop(1,'#8E8BAE');
  c.fillStyle = g; c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle = '#5F5B80'; c.fillRect(P.x,yb - 120,P.w,84);                           // o lambri do corredor
  c.strokeStyle = 'rgba(34,32,28,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(P.x,yb - 120); c.lineTo(xb,yb - 120);
  for (let x = P.x + 22; x < xb; x += 30){ c.moveTo(x,yb - 120); c.lineTo(x,yb - 36); }
  c.stroke();
  c.fillStyle = '#7D6A66'; c.fillRect(P.x,yb - 36,P.w,36);                            // o piso do corredor
  c.fillStyle = 'rgba(255,226,160,.4)'; c.beginPath(); c.moveTo(xb,yb - 30); c.lineTo(P.x + 40,yb); c.lineTo(xb,yb); c.closePath(); c.fill();   // a luz da cozinha entra
  rr(c,P.x + 92,P.y + 62,48,60,3); fs(c,'#C9A46A',3);                                 // um quadro
  c.fillStyle = '#B9C8E0'; c.fillRect(P.x + 98,P.y + 68,36,48); c.fillStyle = '#8FA8C8'; c.beginPath(); c.moveTo(P.x + 98,P.y + 116); c.lineTo(P.x + 112,P.y + 92); c.lineTo(P.x + 124,P.y + 106); c.lineTo(P.x + 134,P.y + 96); c.lineTo(P.x + 134,P.y + 116); c.closePath(); c.fill();
  const gs = c.createLinearGradient(P.x,0,P.x + 46,0); gs.addColorStop(0,'rgba(40,36,70,.5)'); gs.addColorStop(1,'rgba(40,36,70,0)');
  c.fillStyle = gs; c.fillRect(P.x,P.y,46,P.h);
  if (atras) atras(c);
  c.restore();
  // o batente
  c.fillStyle = PAL.madeira; c.fillRect(P.x - 14,P.y - 14,14,P.h + 14); c.fillRect(xb,P.y - 14,14,P.h + 14); c.fillRect(P.x - 14,P.y - 14,P.w + 28,14);
  c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(P.x - 11,P.y - 11,3,P.h + 11); c.fillRect(xb + 3,P.y - 11,3,P.h + 11);
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath();
  c.moveTo(P.x - 14,yb); c.lineTo(P.x - 14,P.y - 14); c.lineTo(xb + 14,P.y - 14); c.lineTo(xb + 14,yb);
  c.moveTo(P.x,yb); c.lineTo(P.x,P.y); c.lineTo(xb,P.y); c.lineTo(xb,yb); c.stroke();
  // a folha da porta, aberta para dentro
  c.beginPath(); c.moveTo(xb + 2,P.y + 2); c.lineTo(xb + 34,P.y + 16); c.lineTo(xb + 34,yb + 22); c.lineTo(xb + 2,yb + 2); c.closePath(); fs(c,'#C98A4E',3);
  c.strokeStyle = 'rgba(34,32,28,.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(xb + 10,P.y + 30); c.lineTo(xb + 26,P.y + 36); c.lineTo(xb + 26,P.y + 150); c.lineTo(xb + 10,P.y + 146); c.closePath();
  c.moveTo(xb + 10,P.y + 180); c.lineTo(xb + 26,P.y + 184); c.lineTo(xb + 26,yb - 6); c.lineTo(xb + 10,yb - 18); c.closePath(); c.stroke();
  circ(c,xb + 27,P.y + 168,5); fs(c,AB_COR.ouro,2);
}
// a geladeira antiga, com um desenho de criança preso
function ab2Geladeira(c){
  const G = AB2_COZ.gel, x = G.x, y = G.y, w = G.w, h = G.h;
  rr(c,x + 8,y + h - 12,14,12,3); fs(c,'#3a3a3c',2.5); rr(c,x + w - 22,y + h - 12,14,12,3); fs(c,'#3a3a3c',2.5);
  rr(c,x,y,w,h - 8,24); fs(c,'#BFE3D8',4);
  c.fillStyle = 'rgba(70,120,110,.22)'; rr(c,x + w - 20,y + 12,14,h - 34,7); c.fill();
  c.fillStyle = 'rgba(255,255,255,.5)'; rr(c,x + 10,y + 16,9,h - 46,5); c.fill();
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(x,y + 84); c.lineTo(x + w,y + 84); c.stroke();
  rr(c,x + w - 26,y + 42,9,30,4); fs(c,PAL.cromo,2.5); rr(c,x + w - 26,y + 98,9,56,4); fs(c,PAL.cromo,2.5);
  rr(c,x + 26,y + 22,34,10,4); fs(c,PAL.cromo,2);
  // o desenho: o sol, a mãe e a filha de mãos dadas, um coração
  c.save(); c.translate(x + 46,y + 150); c.rotate(-0.07);
  c.fillStyle = 'rgba(40,60,60,.2)'; c.fillRect(-25,-19,54,44);
  rr(c,-27,-22,54,44,2); fs(c,'#FFFDF7',2);
  c.fillStyle = '#F2C23D'; circ(c,-16,-11,6); c.fill();
  c.strokeStyle = '#F2C23D'; c.lineWidth = 1.8; c.beginPath(); for (let i=0;i<8;i++){ const a = i * TAU / 8; c.moveTo(-16 + Math.cos(a) * 8,-11 + Math.sin(a) * 8); c.lineTo(-16 + Math.cos(a) * 11,-11 + Math.sin(a) * 11); } c.stroke();
  c.strokeStyle = '#5FA86B'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-24,17); c.lineTo(24,17); c.stroke();
  [[-2,AB_COR.rosa,1],[13,PAL.mostarda,0.7]].forEach(q => {
    c.strokeStyle = q[1]; c.fillStyle = q[1]; c.lineWidth = 2.2;
    circ(c,q[0],16 - 22 * q[2],4 * q[2]); c.fill();
    c.beginPath(); c.moveTo(q[0],16 - 18 * q[2]); c.lineTo(q[0],16 - 8 * q[2]); c.lineTo(q[0] - 4 * q[2],16); c.moveTo(q[0],16 - 8 * q[2]); c.lineTo(q[0] + 4 * q[2],16);
    c.moveTo(q[0] - 6 * q[2],16 - 13 * q[2]); c.lineTo(q[0] + 6 * q[2],16 - 13 * q[2]); c.stroke();
  });
  heart(c,17,-11,4,'#E0559A','#E0559A');
  circ(c,0,-22,4); fs(c,PAL.perigo,1.6);
  c.restore();
}
// o fogão de quatro bocas, com a chama acesa embaixo da panela
function ab2Fogao(c,T,aceso){
  const F = AB2_COZ.fogao, x = F.x, y = F.topo, w = F.w, yb = AB2_COZ.base;
  rr(c,x,y + 10,w,yb - y - 10,7); fs(c,'#F4F1E8',4);
  c.fillStyle = 'rgba(120,110,90,.2)'; c.fillRect(x + w - 16,y + 16,12,yb - y - 24);
  rr(c,x + 16,y + 40,w - 32,yb - y - 47,6); fs(c,'#34343A',3);
  c.fillStyle = 'rgba(255,255,255,.14)'; c.beginPath(); c.moveTo(x + 30,y + 43); c.lineTo(x + 70,y + 43); c.lineTo(x + 56,yb - 10); c.lineTo(x + 24,yb - 10); c.closePath(); c.fill();
  rr(c,x + 26,y + 33,w - 52,7,3); fs(c,PAL.cromo,2.2);
  [22,62,w - 62,w - 22].forEach((dx,i) => { circ(c,x + dx,y + 23,7); fs(c,i === 1 && aceso ? PAL.formica : '#55555C',2.2); c.fillStyle = '#fff'; c.fillRect(x + dx - 1,y + 17,2,5); });
  rr(c,x - 7,y,w + 14,13,4); fs(c,'#3a3a3c',3);
  c.fillStyle = PAL.tinta; [26,72,118,156].forEach(dx => { c.fillRect(x + dx - 20,y - 6,40,6); c.fillRect(x + dx - 20,y - 10,5,5); c.fillRect(x + dx + 15,y - 10,5,5); });
  if (aceso){
    const px = AB2_COZ.panela[0];
    for (let i = -3; i <= 3; i++){
      const h = 9 + (T > 0 ? Math.sin(T * 13 + i * 1.9) * 2.5 : 1), fx = px + i * 9;
      c.beginPath(); c.moveTo(fx - 4.5,y - 1); c.quadraticCurveTo(fx,y - 1 - h * 2,fx + 4.5,y - 1); c.closePath(); c.fillStyle = '#4AA8F0'; c.fill();
      c.beginPath(); c.moveTo(fx - 2.4,y - 1); c.quadraticCurveTo(fx,y - 1 - h,fx + 2.4,y - 1); c.closePath(); c.fillStyle = '#FFE08A'; c.fill();
    }
  }
}
// a panela vermelha (x, y: o meio do fundo), com o molho e o vapor
function ab2Panela(c,x,y,T,vapor){
  const w = 112, h = 34;
  rr(c,x - w / 2 - 15,y - h + 6,20,10,4); fs(c,'#3a3a3c',2.5); rr(c,x + w / 2 - 5,y - h + 6,20,10,4); fs(c,'#3a3a3c',2.5);
  rr(c,x - w / 2,y - h,w,h,11); fs(c,PAL.formica,4);
  c.fillStyle = 'rgba(120,20,15,.28)'; rr(c,x - w / 2 + 4,y - 14,w - 8,10,5); c.fill();
  c.fillStyle = 'rgba(255,255,255,.34)'; rr(c,x - w / 2 + 9,y - h + 7,9,h - 17,5); c.fill();
  rr(c,x - w / 2 - 5,y - h - 8,w + 10,12,6); fs(c,'#E9604A',3);
  c.fillStyle = AB_COR.molho; ell(c,x,y - h - 3,w / 2 - 6,4.5); c.fill();
  c.fillStyle = 'rgba(255,220,170,.5)'; ell(c,x - 16,y - h - 4,10,1.6); c.fill();
  if (vapor){
    c.lineCap = 'round';
    for (let i = 0; i < 3; i++){
      const k = T > 0 ? ((T * 0.5 + i * 0.37) % 1) : 0.4 + i * 0.12, vx = x - 30 + i * 30, vy = y - h - 16 - k * 60;
      c.globalAlpha = T > 0 ? Math.min(1,k * 4) * (1 - k) : 0.6;
      c.beginPath(); c.moveTo(vx,vy); c.bezierCurveTo(vx - 14,vy - 22,vx + 14,vy - 34,vx,vy - 58);
      c.strokeStyle = 'rgba(150,140,130,.5)'; c.lineWidth = 10; c.stroke();
      c.strokeStyle = 'rgba(255,252,244,.95)'; c.lineWidth = 5.5; c.stroke();
    }
    c.globalAlpha = 1;
  }
}
// a bancada de madeira, com a tábua, os tomates e o copo com uma rosa
function ab2Bancada(c,E){
  const B = AB2_COZ.bancada, x = B.x, y = B.topo, w = B.w, yb = AB2_COZ.base;
  rr(c,x + 6,y + 10,w - 12,yb - y - 10,5); fs(c,'#FBF3DC',4);
  for (let i = 0; i < 3; i++){
    const dx = x + 16 + i * ((w - 32) / 3), dw = (w - 32) / 3 - 8;
    rr(c,dx,y + 24,dw,yb - y - 34,5); c.strokeStyle = 'rgba(34,32,28,.45)'; c.lineWidth = 2.2; c.stroke();
    c.fillStyle = 'rgba(180,150,100,.16)'; c.fillRect(dx + 5,y + 29,dw - 10,yb - y - 44);
    circ(c,dx + (i === 1 ? dw / 2 : (i ? 10 : dw - 10)),y + 38,4.5); fs(c,AB_COR.ouro,2);
  }
  // o pano de prato
  rr(c,x + 30,y + 12,26,36,3); fs(c,'#FFFDF7',2.5); c.fillStyle = 'rgba(200,60,50,.6)'; c.fillRect(x + 31,y + 19,24,4); c.fillRect(x + 31,y + 37,24,4);
  rr(c,x,y,w,14,5); fs(c,PAL.madeira,3.5);
  c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + 6,y + 3,w - 12,3);
  if (E){ ab2BancadaNoite(c,x,y,E); return; }
  // a tábua, os tomates e a faca
  rr(c,x + 72,y - 9,92,9,3); fs(c,'#DDA869',2.5);
  [[92,13],[116,12]].forEach(q => { circ(c,x + q[0],y - 9 - q[1] + 2,q[1]); fs(c,'#DC4A34',2.5); c.fillStyle = 'rgba(255,255,255,.5)'; ell(c,x + q[0] - 4,y - 9 - q[1] - 3,3.5,2); c.fill(); ab2Folha(c,x + q[0],y - 7 - q[1] * 2,-2.5,8,3,'#3F8454'); ab2Folha(c,x + q[0],y - 7 - q[1] * 2,-0.6,8,3,'#3F8454'); });
  c.beginPath(); c.arc(x + 142,y - 9,11,Math.PI,0); c.closePath(); fs(c,'#F0705C',2.2); c.fillStyle = '#F7C9A8'; circ(c,x + 138,y - 13,1.6); c.fill(); circ(c,x + 146,y - 13,1.6); c.fill();
  ab2CopoRosa(c,x + 214,y);
}
// o copo com uma rosa (gx: o meio; y: a bancada)
function ab2CopoRosa(c,gx,y){
  c.strokeStyle = '#3F8454'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(gx + 1,y - 6); c.quadraticCurveTo(gx - 4,y - 34,gx + 4,y - 58); c.stroke();
  ab2Folha(c,gx - 1,y - 36,-2.7,18,6,'#5FA86B');
  c.fillStyle = 'rgba(214,236,244,.6)'; rr(c,gx - 13,y - 36,26,36,5); c.fill();
  c.fillStyle = 'rgba(150,200,225,.55)'; c.fillRect(gx - 11,y - 22,22,20);
  rr(c,gx - 13,y - 36,26,36,5); c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.stroke();
  c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(gx - 9,y - 31,3,22);
  circ(c,gx + 4,y - 62,12); fs(c,AB_COR.petala,2.5);
  c.strokeStyle = '#B92E5E'; c.lineWidth = 2; c.beginPath(); c.arc(gx + 4,y - 62,7,0.4,Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(gx + 5,y - 62,3,Math.PI,Math.PI * 2.4); c.stroke();
}
// a mesa pequena com a toalha xadrez (a da lojinha) e a fruteira
function ab2Mesinha(c){
  const x = 1094, w = 128, y = 446;
  c.strokeStyle = PAL.tinta; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 14,y + 30); c.lineTo(x + 10,548); c.moveTo(x + w - 14,y + 30); c.lineTo(x + w - 10,548); c.stroke();
  c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 6; c.stroke();
  c.save();
  c.beginPath(); c.moveTo(x - 6,y); c.lineTo(x + w + 6,y); c.lineTo(x + w + 8,y + 44);
  for (let i = 0; i < 4; i++){ const xa = x + w + 8 - i * (w + 16) / 4; c.quadraticCurveTo(xa - (w + 16) / 8,y + 44 + (i % 2 ? 7 : -3),xa - (w + 16) / 4,y + 44); }
  c.closePath(); c.fillStyle = '#FFFDF7'; c.fill(); c.clip();
  c.fillStyle = 'rgba(200,60,50,.55)';
  for (let i = 0; i < 12; i++) c.fillRect(x - 8 + i * 24,y,12,60);
  for (let j = 0; j < 3; j++) c.fillRect(x - 8,y + 4 + j * 24,w + 20,12);
  c.restore();
  c.beginPath(); c.moveTo(x - 6,y); c.lineTo(x + w + 6,y); c.lineTo(x + w + 8,y + 44);
  for (let i = 0; i < 4; i++){ const xa = x + w + 8 - i * (w + 16) / 4; c.quadraticCurveTo(xa - (w + 16) / 8,y + 44 + (i % 2 ? 7 : -3),xa - (w + 16) / 4,y + 44); }
  c.closePath(); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.stroke();
  // a fruteira
  [[x + 44,y - 20,11,'#F2A53A'],[x + 64,y - 24,12,'#E88A4A'],[x + 84,y - 20,11,'#F2C23D']].forEach(q => { circ(c,q[0],q[1],q[2]); fs(c,q[3],2.2); });
  c.beginPath(); c.moveTo(x + 24,y - 16); c.quadraticCurveTo(x + 64,y + 16,x + 104,y - 16); c.closePath(); fs(c,'#F6E7C1',3);
  c.strokeStyle = PAL.faixa; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + 32,y - 10); c.quadraticCurveTo(x + 64,y + 8,x + 96,y - 10); c.stroke();
}
// o banquinho (y: o assento; os pés vão até o chão)
function ab2Banquinho(c,x,y){
  const yb = AB2.chao + 4;
  c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 11; c.beginPath(); c.moveTo(x - 32,y + 12); c.lineTo(x - 40,yb); c.moveTo(x + 32,y + 12); c.lineTo(x + 40,yb); c.moveTo(x - 35,y + 32); c.lineTo(x + 35,y + 32); c.stroke();
  c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 6; c.stroke();
  rr(c,x - 46,y,92,15,5); fs(c,PAL.madeira,3.5);
  c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x - 40,y + 3,80,3);
}
// o tapete
function ab2Tapete(c,x,y){
  ell(c,x,y,150,23); fs(c,AB_COR.rosa,3);
  ell(c,x,y,128,18); c.strokeStyle = '#F6E7C1'; c.lineWidth = 3; c.stroke();
  ell(c,x,y,92,12); c.fillStyle = '#E88A4A'; c.fill(); ell(c,x,y,60,7); c.fillStyle = '#F2C23D'; c.fill();
}
// a frente da cozinha: o batente escuro na borda esquerda, uma luminária e as folhas de um vaso na borda direita
function ab2CozinhaFrente(c,T){
  c.fillStyle = '#2A1D15'; c.fillRect(-700,-300,714,H + 600);
  c.fillStyle = '#463221'; c.fillRect(6,-300,8,H + 600);
  c.strokeStyle = '#2A1D15'; c.lineWidth = 4; c.beginPath(); c.moveTo(556,-300); c.lineTo(556,40); c.stroke();
  c.beginPath(); c.moveTo(528,40); c.lineTo(584,40); c.lineTo(604,84); c.lineTo(508,84); c.closePath(); c.fillStyle = '#3A2A1E'; c.fill();
  c.fillStyle = '#FFE9A8'; ell(c,556,86,34,6); c.fill();
  ab2Luz(c,556,96,90,'255,226,150',0.4);
  const b = T > 0 ? Math.sin(T * 0.9) * 0.03 : 0;
  [[-2.55,150,24],[-2.2,190,28],[-1.9,160,24],[-2.85,120,22],[-1.6,120,20],[-2.38,110,18]].forEach((q,i) => ab2Folha(c,1236,640,q[0] + b * (i % 2 ? 1 : -1),q[1],q[2],i % 2 ? '#22382A' : '#1B2E22'));
}
// a estrela da janela: quatro pontas e um halo (a: o brilho)
function ab2Estrela(c,x,y,r,a){
  if (a <= 0) return;
  c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,x,y,r * 5.5,'200,222,255',Math.min(1,0.85 * a)); c.restore();
  c.globalAlpha = Math.min(1,a); c.fillStyle = '#FFF8DC'; c.beginPath();
  for (let i = 0; i < 8; i++){ const an = i * Math.PI / 4 - Math.PI / 2, rad = i % 2 ? r * 0.3 : r; c.lineTo(x + Math.cos(an) * rad,y + Math.sin(an) * rad); }
  c.closePath(); c.fill(); c.globalAlpha = 1;
}
// onde fica a estrela, nas medidas da parede (lá fora desliza menos que a parede: ver ab2LaFora)
function ab2EstrelaXY(cam){ const J = AB2_COZ.janela; return [J.x + 70 + (cam.cx - TW / 2) * 0.25,J.y + 54 + (cam.cy - H / 2) * 0.25]; }
// lá fora, fora da tarde (cenas 7 e 8): E.dia (0 noite a 1 dia), E.nuvens, E.chuva e E.estrela
function ab2LaForaTempo(c,cam,J,E,T){
  const d = E.dia, m = (a,b) => abMistura(a,b,d), nu = E.nuvens || 0, es = (E.estrela || 0) * (1 - d) * (1 - nu);
  c.save(); rr(c,J.x,J.y,J.w,J.h,6); c.clip();
  c.translate((cam.cx - TW / 2) * 0.25,(cam.cy - H / 2) * 0.25);
  const g = c.createLinearGradient(0,J.y,0,J.y + J.h); g.addColorStop(0,m('#131A36','#8FCBEA')); g.addColorStop(0.62,m('#1E2A4A','#CFE6DC')); g.addColorStop(1,m('#2A315A','#FBE2A4'));
  c.fillStyle = g; c.fillRect(J.x - 90,J.y - 30,J.w + 180,J.h + 60);
  if (d > 0) ab2Luz(c,J.x + 48,J.y + J.h - 24,170,'255,240,180',0.95 * d);
  c.fillStyle = 'rgba(255,255,255,' + (0.8 * (1 - d) * (1 - nu)).toFixed(3) + ')';
  [[24,30,1.6],[118,22,1.3],[168,48,1.8],[40,96,1.2],[96,84,1.5],[10,62,1.1],[132,112,1.2]].forEach((q,i) => { circ(c,J.x + q[0],J.y + q[1],q[2] * (T > 0 ? 1 + Math.sin(T * 2 + i * 1.9) * 0.25 : 1)); c.fill(); });
  c.fillStyle = m('#343B66','#D9B79A'); c.beginPath(); c.moveTo(J.x - 90,J.y + J.h + 30); c.lineTo(J.x - 90,J.y + 150); c.lineTo(J.x - 10,J.y + 150); c.lineTo(J.x + 22,J.y + 128); c.lineTo(J.x + 60,J.y + 150); c.lineTo(J.x + 96,J.y + 150); c.lineTo(J.x + 96,J.y + J.h + 30); c.closePath(); c.fill();
  c.fillStyle = m('#2C325A','#C99F86'); c.fillRect(J.x + 30,J.y + 160,14,16);
  c.strokeStyle = m('#2A2B45','#7A5636'); c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(J.x + 176,J.y + J.h + 20); c.lineTo(J.x + 170,J.y + 120); c.stroke();
  [[150,112,44,'#4C9460'],[204,98,48,'#4C9460'],[246,130,40,'#3F8454'],[176,76,40,'#5FA86B'],[226,64,34,'#5FA86B'],[132,140,30,'#5FA86B'],[196,120,30,'#6DB877']].forEach(q => { c.fillStyle = abMistura('#27375A',q[3],0.25 + d * 0.75); circ(c,J.x + q[0],J.y + q[1],q[2]); c.fill(); });
  if (nu > 0){   // as nuvens de chuva, que se abrem para os lados
    c.fillStyle = 'rgba(64,74,108,' + Math.min(1,nu * 1.3).toFixed(3) + ')';
    [[20,40,90,46,-1],[120,30,100,50,1],[210,60,90,46,1],[60,100,110,50,-1],[170,120,110,54,1],[110,170,150,50,-1]].forEach(q => { ell(c,J.x + q[0] + q[4] * (1 - nu) * 210,J.y + q[1],q[2],q[3]); c.fill(); });
  }
  if (E.chuva > 0){
    c.strokeStyle = 'rgba(205,220,245,' + (0.6 * E.chuva).toFixed(3) + ')'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath();
    for (let i = 0; i < 30; i++){ const x = J.x - 50 + ((i * 37 + (T > 0 ? T * 240 : 0)) % (J.w + 100)), y = J.y - 10 + ((i * 53 + (T > 0 ? T * 560 : 0)) % (J.h + 20)); c.moveTo(x,y); c.lineTo(x - 7,y + 18); }
    c.stroke();
  }
  ab2Estrela(c,J.x + 70,J.y + 54,13 + (T > 0 ? Math.sin(T * 3) * 1.5 : 0),es);
  c.restore();
}
// na parede, fora da tarde: a planta que cresce (E.planta), as folhas do calendário que caem (E.folhas), o avental no gancho (some com E.lar) e a foto na parede (entra com E.lar)
function ab2CozinhaTempo(c,E,T){
  const g = E.planta || 0, f = E.folhas || 0, lar = E.lar || 0, sx = 272 + 172, sy = 196 - 22;
  if (g > 0){
    c.lineCap = 'round';
    [[-16,58,-2.2],[4,84,-1.5],[18,50,-0.9],[-6,104,-1.8]].forEach((q,i) => {
      const hx = sx + q[0] * g, hy = sy - q[1] * g;
      c.strokeStyle = PAL.tinta; c.lineWidth = 6; c.beginPath(); c.moveTo(sx,sy); c.quadraticCurveTo(sx + q[0] * 0.2 * g,sy - q[1] * 0.6 * g,hx,hy); c.stroke(); c.strokeStyle = '#3F8454'; c.lineWidth = 3; c.stroke();
      ab2Folha(c,sx + q[0] * 0.5 * g,sy - q[1] * 0.55 * g,q[2],20 * g,7 * g,'#5FA86B'); ab2Folha(c,hx,hy + 6,q[2] + 2,18 * g,6 * g,'#4C9460');
      if (g > 0.6) abFlor(c,hx,hy,4.6 * g);
    });
  }
  if (f > 0 && f < 1) for (let i = 0; i < 6; i++){
    const k = clamp(f * 3.4 - i * 0.4,0,1); if (k <= 0 || k >= 1) continue;
    c.save(); c.translate(493 + Math.sin(k * 5 + i * 2) * 30 - k * 24,300 + k * k * 240); c.rotate(k * 3 + i); c.globalAlpha = 1 - k * k * k;
    rr(c,-15,-16,30,32,2); fs(c,'#fff',1.8); c.fillStyle = PAL.perigo; c.fillRect(-14,-15,28,7); c.restore();
  }
  if (lar < 1){   // o avental da Rosa, no gancho
    c.globalAlpha = 1 - lar;
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(548,176); c.quadraticCurveTo(560,146,572,176); c.stroke();
    c.beginPath(); c.moveTo(546,176); c.lineTo(574,176); c.lineTo(588,214); c.lineTo(596,296); c.lineTo(524,296); c.lineTo(532,214); c.closePath(); fs(c,'#FFFDF7',3);
    c.strokeStyle = 'rgba(200,80,106,.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(530,280); c.lineTo(590,280); c.moveTo(538,220); c.lineTo(582,220); c.stroke();
    rr(c,546,236,28,24,4); c.strokeStyle = 'rgba(34,32,28,.4)'; c.lineWidth = 2; c.stroke();
    circ(c,560,150,5); fs(c,PAL.cromoEsc,2);
    c.globalAlpha = 1;
  }
  if (lar > 0) ab2FotoParede(c,lar,0);   // a foto da Rosa, agora na parede
}
// a foto da Rosa na parede (a: a opacidade; halo: o halo dourado, de 0 a 1; v11.18: também à tarde, na cena 8 do final, pelo o.foto do ab2Cozinha)
function ab2FotoParede(c,a,halo){
  if (halo > 0){ ab2Luz(c,565,208,150,'255,186,50',0.62 * halo); c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,565,208,70,'255,236,170',0.8 * halo); c.restore(); }   // um halo dourado sobre a parede clara
  c.globalAlpha = a; c.fillStyle = 'rgba(120,80,40,.2)'; rr(c,526,160,78,96,4); c.fill(); drawFotoRosa(c,560,206,2.1); c.globalAlpha = 1;
}
// a bancada, fora da tarde: o copo com a rosa, a foto da Rosa (some com E.lar) e o escorredor com a panela emborcada (a panela some com E.lar)
function ab2BancadaNoite(c,x,y,E){
  const lar = E.lar || 0;
  ab2CopoRosa(c,x + 40,y);
  if (lar < 1){
    c.globalAlpha = 1 - lar;
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 100,y - 4); c.lineTo(x + 112,y - 34); c.stroke(); c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 3.5; c.stroke();
    c.save(); c.beginPath(); c.rect(x + 50,y - 72,84,74); c.clip(); drawFotoRosa(c,x + 90,y - 33,1.6); c.restore();
    c.globalAlpha = 1;
  }
  // o escorredor
  const ex = x + 150;
  c.strokeStyle = PAL.tinta; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); for (let i = 0; i <= 5; i++){ c.moveTo(ex + i * 19,y - 2); c.lineTo(ex + i * 19,y - 22); } c.moveTo(ex - 6,y - 4); c.lineTo(ex + 101,y - 4); c.stroke();
  c.strokeStyle = PAL.cromo; c.lineWidth = 2.5; c.stroke();
  if (lar < 1){   // a panela vermelha emborcada
    c.globalAlpha = 1 - lar; const px = ex + 48, w = 96, h = 30;
    rr(c,px - w / 2 - 12,y - 16,18,9,4); fs(c,'#3a3a3c',2.5); rr(c,px + w / 2 - 6,y - 16,18,9,4); fs(c,'#3a3a3c',2.5);
    rr(c,px - w / 2,y - 8 - h,w,h,10); fs(c,PAL.formica,4);
    c.fillStyle = 'rgba(255,255,255,.3)'; rr(c,px - w / 2 + 8,y - h,9,h - 14,5); c.fill();
    rr(c,px - w / 2 - 5,y - 12,w + 10,10,5); fs(c,'#E9604A',3);
    c.globalAlpha = 1;
  }
}
/* a cozinha de casa. modo: 'tarde' (o sol baixo pela janela), 'noite' (tudo apagado, azul; cena 7) ou 'lar' (a luz acesa, âmbar; cena 8). o: { T, banco:[x, y do
   assento], vapor, atras(c): quem está no corredor, gente(c): as pessoas, no meio, frente(c): a frente própria da cena, brilho(c): o que brilha no escuro, no meio,
   estado: fora da tarde, por cima do modo, { dia, noite, lar, chuva, nuvens, estrela, facho, folhas, planta, pisca }, tudo de 0 a 1;
   v11.18: foto (a foto da Rosa na parede, à tarde, como no modo 'lar') e fotoHalo (o halo dourado dela, de 0 a 1) } */
function ab2Cozinha(c,cam,modo,o){
  o = o || {};
  const T = o.T || 0, Z = AB2_COZ, tarde = !modo || modo === 'tarde', casa = modo === 'lar';
  const E = tarde ? null : Object.assign({ dia:0, noite:casa ? 0.32 : 1, lar:casa ? 1 : 0, chuva:0, nuvens:0, estrela:1, facho:0, folhas:0, planta:casa ? 1 : 0, pisca:0 },o.estado || {});
  const sol = tarde ? 1 : E.dia * 0.8, lar = tarde ? 0 : E.lar, fogo = tarde || lar > 0.5;
  const facho = () => { c.beginPath(); c.moveTo(846,104); c.lineTo(1060,104); c.lineTo(1060,292); c.lineTo(742,604); c.lineTo(318,604); c.closePath(); c.fill(); };
  ab2Camada(c,cam,0.85,() => { ab2CozinhaFundo(c,cam,modo,T,E); if (o.foto && tarde) ab2FotoParede(c,1,o.fotoHalo || 0); });   // v11.18: o.foto (e o.fotoHalo): a foto da Rosa na parede também à tarde
  ab2Camada(c,cam,1,() => {
    ab2Piso(c);
    if (sol > 0){ c.fillStyle = 'rgba(255,232,160,' + (0.42 * sol) + ')'; c.beginPath(); c.moveTo(452,486); c.lineTo(742,486); c.lineTo(668,604); c.lineTo(318,604); c.closePath(); c.fill(); }   // o sol no piso
    ab2Tapete(c,452,552);
    ab2Porta(c,o.atras);
    [[344,514,84,13],[696,516,118,13],[950,516,160,13]].forEach(q => ab2Sombra(c,q[0],q[1],q[2],q[3],0.4));
    ab2Geladeira(c);
    ab2Fogao(c,T,fogo);
    if (tarde) ab2Panela(c,Z.panela[0],Z.panela[1],T,o.vapor !== false);
    else if (lar > 0){ c.globalAlpha = lar; ab2Panela(c,Z.panela[0],Z.panela[1],T,lar > 0.9); c.globalAlpha = 1; }
    ab2Bancada(c,E);
    ab2Sombra(c,1158,548,84,12,0.35); ab2Mesinha(c);
    if (o.banco){ if (o.banco[2] != null) c.globalAlpha = o.banco[2]; ab2Sombra(c,o.banco[0],AB2.chao + 6,62,10,0.35); ab2Banquinho(c,o.banco[0],o.banco[1]); c.globalAlpha = 1; }
    if (sol > 0){   // o facho de sol, em diagonal (atrás das pessoas, para não lavar os rostos)
      c.save(); c.globalCompositeOperation = 'screen';
      const g = c.createLinearGradient(960,150,500,590); g.addColorStop(0,'rgba(255,226,150,' + (0.3 * sol) + ')'); g.addColorStop(1,'rgba(255,226,150,' + (0.05 * sol) + ')');
      c.fillStyle = g;
      facho();
      c.beginPath(); c.moveTo(900,104); c.lineTo(1040,104); c.lineTo(1040,240); c.lineTo(680,604); c.lineTo(400,604); c.closePath(); c.fill();
      c.restore();
    }
    if (o.gente) o.gente(c);
    if (sol > 0){
      c.fillStyle = 'rgba(255,226,150,' + (0.07 * sol) + ')'; facho();
      // a poeirinha subindo no facho
      for (let i = 0; i < 18; i++){
        const u = (i * 0.618) % 1, v = ((i * 0.381) % 1) - 0.5, sob = T > 0 ? (T * (5 + i % 4) + i * 17) % 70 : 20;
        const x = 930 - u * 420 + v * 170 + (T > 0 ? Math.sin(T * 0.6 + i) * 7 : 0), y = 190 + u * 380 - sob;
        c.fillStyle = 'rgba(255,246,206,' + ((0.35 + 0.3 * Math.sin((T > 0 ? T * 1.4 : 1) + i * 2.1)) * sol).toFixed(3) + ')';
        circ(c,x,y,1.6 + (i % 3) * 0.8); c.fill();
      }
    }
    if (fogo){ c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,Z.panela[0],Z.fogao.topo - 4,78,'255,150,70',0.5 + (T > 0 ? Math.sin(T * 9) * 0.06 : 0)); c.restore(); }   // o halo da chama
  });
  ab2Camada(c,cam,1.2,() => { ab2CozinhaFrente(c,T); if (o.frente) o.frente(c); });
  if (tarde) ab2Clima(c,'242,178,61',0.07);
  else {
    // a noite: tudo azul e escuro; por cima, o que brilha: a estrela, o facho até a foto, a chama e a luz acesa
    if (E.noite > 0){ c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(66,84,148,' + E.noite.toFixed(3) + ')'; c.fillRect(0,0,TW,H); c.restore(); }
    const es = E.estrela * (1 - E.dia) * (1 - E.nuvens), q = ab2EstrelaXY(cam), J = Z.janela;
    if (es > 0) ab2Camada(c,cam,0.85,() => { c.save(); rr(c,J.x,J.y,J.w,J.h,6); c.clip(); ab2Estrela(c,q[0],q[1],(13 + (T > 0 ? Math.sin(T * 3) * 1.5 : 0)) * (1 + E.pisca * 0.9),es * (1 + E.pisca)); c.restore(); });
    ab2Camada(c,cam,1,() => {
      const fa = E.facho * es * (1 - lar);
      if (fa > 0){   // o facho azul-claro desce da estrela até a foto, que ganha um brilho
        const sx = q[0] + (cam.cx - TW / 2) * 0.15, sy = q[1] + (cam.cy - H / 2) * 0.15, fx = Z.bancada.x + 90, fy = Z.bancada.topo - 30;
        c.save(); c.globalCompositeOperation = 'screen';
        const g = c.createLinearGradient(0,sy,0,fy + 30); g.addColorStop(0,'rgba(190,215,255,' + (0.55 * fa).toFixed(3) + ')'); g.addColorStop(1,'rgba(190,215,255,' + (0.2 * fa).toFixed(3) + ')');
        c.fillStyle = g; c.beginPath(); c.moveTo(sx - 5,sy); c.lineTo(sx + 5,sy); c.lineTo(fx + 44,fy + 34); c.lineTo(fx - 44,fy + 34); c.closePath(); c.fill();
        ab2Luz(c,fx,fy,96,'200,222,255',0.75 * fa);
        c.restore();
      }
      if (fogo && E.noite > 0){ c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,Z.panela[0],Z.fogao.topo - 4,110,'255,150,70',0.45 * E.noite); c.restore(); }
      if (o.brilho) o.brilho(c);
    });
    if (lar > 0 && E.dia < 1){ const a = lar * (1 - E.dia); ab2Camada(c,cam,1.2,() => { c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,556,104,620,'255,186,110',0.3 * a); ab2Luz(c,556,92,90,'255,236,190',0.9 * a); c.restore(); }); ab2Clima(c,'242,165,58',0.05 * a); }
  }
  ab2Vinheta(c,0.5);
}

/* ---------- utilitários das cenas da Casa Aurora (v11.13) ---------- */
// valor entre chaves [[p, v], ...] (v: número ou ponto), com abSuave entre uma e outra
function ab2Chave(K,p){
  if (p <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (p <= K[i][0]){
    const a = K[i - 1], b = K[i], k = abSuave((p - a[0]) / (b[0] - a[0] || 1));
    return Array.isArray(a[1]) ? a[1].map((v,j) => v + (b[1][j] - v) * k) : a[1] + (b[1] - a[1]) * k;
  }
  return K[K.length - 1][1];
}
// copa (ou arbusto): bolas com um contorno só por fora; B: [[x, y, r, cor], ...]
function ab2Copa(c,B,lw){
  c.strokeStyle = PAL.tinta; c.lineWidth = (lw || 3) * 2; B.forEach(q => { circ(c,q[0],q[1],q[2]); c.stroke(); });
  B.forEach(q => { c.fillStyle = q[3]; circ(c,q[0],q[1],q[2]); c.fill(); });
}
// um braço a mais do Tonhão (ou do Bráulio), por cima do corpo, nas medidas dele
function ab2BracoDe(c,x,y,s,pts,roupa,pele,fn){
  c.save(); c.translate(x,y); c.scale(s,s); abBraco(c,pts,roupa || '#fff',pele || '#B9794B'); if (fn) fn(c); c.restore();
}

/* ---------- o cenário "rua da Casa Aurora" (cena 3, de manhã; a 9 reusa à tarde) ---------- */
const AB2_RUA = { calcada:482, porta:{ x:690, y:168, w:140, h:314 }, modos:{
  manha:{ ceu:['#9FD3F0','#F5B58A'], longe:'#E7BBA8', perto:'#C9958F', jan:'rgba(255,236,190,.55)', sol:[330,372,'255,238,196'], clima:['245,181,138',0.07], lampiao:true, placa:false, sombra:0.26 },
  tarde:{ ceu:['#7A4E7E','#F0A45A'], longe:'#B0768C', perto:'#84557C', jan:'rgba(255,214,140,.7)', sol:[250,446,'255,206,150'], clima:['240,150,80',0.1], lampiao:false, placa:true, sombra:0.4 },
  noite:{ ceu:['#1E2A4A','#3A3F6E'], longe:'#4C5384', perto:'#323A68', jan:'rgba(255,214,120,.9)', sol:[330,170,'226,234,255'], clima:['30,42,100',0.12], lampiao:true, placa:true, sombra:0.5 } } };   // v11.16: a noite do final (a cena 3)
// uma fileira de prédios em silhueta, com janelinhas
function ab2Predios(c,cor,jan,base,sem){
  let x = -120;
  for (let i = 0; x < TW + 120; i++){
    const w = 58 + ((i * 37 + sem * 13) % 52), h = 110 + ((i * 53 + sem * 29) % 150);
    c.fillStyle = cor; c.fillRect(x,base - h,w,h + 260);
    if ((i + sem) % 3 === 0) c.fillRect(x + w * 0.3,base - h - 16,w * 0.3,16);
    if ((i + sem) % 4 === 1){ c.fillRect(x + w * 0.5 - 1.5,base - h - 30,3,30); }
    c.fillStyle = jan;
    for (let yy = base - h + 14; yy < base - 8; yy += 24) for (let xx = x + 9; xx < x + w - 12; xx += 17) if (((xx * 7 + yy * 3 + i) | 0) % 3) c.fillRect(xx,yy,8,11);
    x += w + 5;
  }
}
// a calçada de pedra em mosaico preto e branco (ondas)
function ab2Mosaico(c,y0){
  c.fillStyle = '#EFE8DA'; c.fillRect(-180,y0,TW + 360,H - y0 + 90);
  c.strokeStyle = '#34323A'; c.lineCap = 'butt'; c.lineJoin = 'round';
  [[y0 + 15,6,6,34],[y0 + 38,10,9,46],[y0 + 74,15,13,62],[y0 + 126,22,18,84]].forEach((q,k) => {
    c.lineWidth = q[1]; c.beginPath();
    for (let x = -180; x <= TW + 180; x += 10){ const y = q[0] + Math.sin(x / q[3] * Math.PI + k * 1.3) * q[2] * 0.5; if (x === -180) c.moveTo(x,y); else c.lineTo(x,y); }
    c.stroke();
  });
  const g = c.createLinearGradient(0,y0,0,H + 40); g.addColorStop(0,'rgba(90,60,50,.2)'); g.addColorStop(0.3,'rgba(90,60,50,0)'); g.addColorStop(1,'rgba(70,40,40,.24)');
  c.fillStyle = g; c.fillRect(-180,y0,TW + 360,H - y0 + 90);
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(-180,y0); c.lineTo(TW + 180,y0); c.stroke();
}
// janela alta em arco, com luz quente e cortina
function ab2JanelaAlta(c,x,y,w,h){
  const arco = () => { c.beginPath(); c.moveTo(x,y + h); c.lineTo(x,y + w / 2); c.arc(x + w / 2,y + w / 2,w / 2,Math.PI,0); c.lineTo(x + w,y + h); c.closePath(); };
  arco(); const g = c.createLinearGradient(0,y,0,y + h); g.addColorStop(0,'#FFF0C0'); g.addColorStop(1,'#F7C877'); c.fillStyle = g; c.fill();
  c.save(); arco(); c.clip();
  c.fillStyle = 'rgba(122,46,58,.82)';
  c.beginPath(); c.moveTo(x,y); c.lineTo(x + w * 0.46,y); c.quadraticCurveTo(x + w * 0.3,y + h * 0.42,x,y + h * 0.62); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x + w,y); c.lineTo(x + w * 0.54,y); c.quadraticCurveTo(x + w * 0.7,y + h * 0.42,x + w,y + h * 0.62); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(x + w * 0.2,y + h); c.lineTo(x + w * 0.5,y + h * 0.5); c.lineTo(x + w * 0.62,y + h * 0.5); c.lineTo(x + w * 0.36,y + h); c.closePath(); c.fill();
  c.restore();
  c.strokeStyle = AB_COR.aurora; c.lineWidth = 4; c.beginPath(); c.moveTo(x + w / 2,y + 2); c.lineTo(x + w / 2,y + h); c.moveTo(x,y + h * 0.5); c.lineTo(x + w,y + h * 0.5); c.stroke();
  arco(); c.lineWidth = 9; c.strokeStyle = PAL.tinta; c.stroke(); c.lineWidth = 5; c.strokeStyle = AB_COR.aurora; c.stroke();
  rr(c,x - 10,y + h,w + 20,11,4); fs(c,'#E6DCCB',2.5);
}
// vaso de buxinho (duas bolas)
function ab2Buxinho(c,x,y){
  c.strokeStyle = PAL.tinta; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x,y - 30); c.lineTo(x,y - 96); c.stroke(); c.strokeStyle = '#7A5636'; c.lineWidth = 4; c.stroke();
  ab2Copa(c,[[x,y - 62,22,'#3F8454'],[x,y - 106,17,'#4C9460']],2.5);
  c.fillStyle = 'rgba(190,230,150,.5)'; circ(c,x - 7,y - 70,6); c.fill(); circ(c,x - 5,y - 112,5); c.fill();
  c.beginPath(); c.moveTo(x - 20,y - 34); c.lineTo(x + 20,y - 34); c.lineTo(x + 15,y); c.lineTo(x - 15,y); c.closePath(); fs(c,AB_COR.aurora,3);
  rr(c,x - 23,y - 40,46,9,3); fs(c,'#93404C',2.5);
}
// a fachada: abre (0 a 1) abre a porta dupla; dentro(c) desenha quem está lá dentro (recortado pelo vão)
function ab2FachadaAurora(c,M,T,abre,dentro,estrela){   // v11.16: estrela (0 a 1): a estrelinha ao lado da porta, acesa ou apagada
  const Y = AB2_RUA.calcada, x0 = 470, P = AB2_RUA.porta;
  c.fillStyle = '#F4EFE6'; c.fillRect(x0,30,TW + 260 - x0,Y - 30);
  c.strokeStyle = 'rgba(122,46,58,.11)'; c.lineWidth = 2; c.beginPath();
  for (let y = 64; y < 400; y += 34){ c.moveTo(x0,y); c.lineTo(TW + 260,y); }
  for (let y = 64, k = 0; y < 400; y += 34, k++) for (let x = x0 + (k % 2 ? 40 : 80); x < TW + 260; x += 80){ c.moveTo(x,y); c.lineTo(x,y + 34); }
  c.stroke();
  const gl = c.createLinearGradient(x0,0,x0 + 260,0); gl.addColorStop(0,'rgba(255,236,190,.5)'); gl.addColorStop(1,'rgba(255,236,190,0)'); c.fillStyle = gl; c.fillRect(x0,30,260,Y - 30);   // o sol bate de lado
  c.fillStyle = AB_COR.aurora; c.fillRect(x0,404,TW + 260 - x0,Y - 404);
  c.fillStyle = '#C97B4A'; c.fillRect(x0,398,TW + 260 - x0,7);
  c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; c.beginPath(); for (let x = x0 + 36; x < TW + 260; x += 72){ c.rect(x,416,58,52); } c.stroke();
  [x0,1040].forEach(x => { c.fillStyle = '#E6DCCB'; c.fillRect(x,30,28,Y - 30); c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.strokeRect(x,30,28,Y - 30); c.fillStyle = '#C97B4A'; c.fillRect(x - 3,30,34,12); c.strokeRect(x - 3,30,34,12); });
  rr(c,x0 - 12,14,TW + 300 - x0,20,4); fs(c,'#C97B4A',3);
  c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x0 - 8,18,TW + 280 - x0,4);
  ab2JanelaAlta(c,536,204,100,196); ab2JanelaAlta(c,884,204,100,196);
  // o toldo listrado vinho e creme
  const tx = 510, tw = 500, n = 12;
  for (let i = 0; i < n; i++){
    const a = tx + i * tw / n, b = a + tw / n;
    c.beginPath(); c.moveTo(a + 14,104); c.lineTo(b + 14,104); c.lineTo(b,150); c.lineTo(a,150); c.closePath(); c.fillStyle = i % 2 ? PAL.creme : AB_COR.aurora; c.fill();
    c.beginPath(); c.moveTo(a,150); c.lineTo(b,150); c.arc((a + b) / 2,150,tw / n / 2,0,Math.PI); c.closePath(); c.fillStyle = i % 2 ? '#EADFC2' : '#662632'; c.fill();
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.2; c.beginPath(); c.arc((a + b) / 2,150,tw / n / 2,0,Math.PI); c.stroke();
  }
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(tx + 14,104); c.lineTo(tx + tw + 14,104); c.lineTo(tx + tw,150); c.moveTo(tx + 14,104); c.lineTo(tx,150); c.lineTo(tx + tw,150); c.stroke();
  // o letreiro dourado sobre vinho
  c.fillStyle = 'rgba(60,30,30,.2)'; rr(c,604,48,320,54,12); c.fill();
  rr(c,600,42,320,54,12); fs(c,AB_COR.aurora,3.5);
  rr(c,607,49,306,40,8); c.strokeStyle = AB_COR.ouro; c.lineWidth = 2; c.stroke();
  txt(c,'Casa Aurora',760,70,32,AB_COR.ouro,'center',FD);
  star(c,628,69,7,AB_COR.ouro); star(c,892,69,7,AB_COR.ouro);
  // a porta dupla, com vidro; lá dentro, aceso
  c.fillStyle = PAL.tinta; c.fillRect(P.x - 12,P.y - 12,P.w + 24,P.h + 12);
  c.fillStyle = AB_COR.aurora; c.fillRect(P.x - 9,P.y - 9,P.w + 18,P.h + 9);
  c.save(); c.beginPath(); c.rect(P.x,P.y,P.w,P.h); c.clip();
  const gd = c.createLinearGradient(0,P.y,0,P.y + P.h); gd.addColorStop(0,'#FFEFC0'); gd.addColorStop(1,'#F3B866'); c.fillStyle = gd; c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle = 'rgba(122,46,58,.3)'; c.fillRect(P.x,P.y,P.w,36); c.fillRect(P.x,P.y + P.h - 60,P.w,60);
  c.fillStyle = 'rgba(255,255,255,.7)'; circ(c,P.x + P.w / 2,P.y + 62,13); c.fill(); ab2Luz(c,P.x + P.w / 2,P.y + 62,70,'255,250,220',0.8);
  if (dentro) dentro(c);
  c.restore();
  const fw = P.w / 2 * (1 - abre * 0.8);
  [[P.x,1],[P.x + P.w - fw,-1]].forEach(q => {
    rr(c,q[0],P.y,fw,P.h,3); fs(c,'#8A3A46',3);
    if (fw > 26){
      const m = 9 * fw / 70; rr(c,q[0] + m,P.y + 14,fw - 2 * m,P.h * 0.55,3); fs(c,abre > 0.5 ? '#F3D9A0' : '#F7DFA4',2.2);
      c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(q[0] + m + 3,P.y + 20,3,P.h * 0.5);
      rr(c,q[0] + m,P.y + P.h * 0.64,fw - 2 * m,P.h * 0.3,3); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; c.stroke();
    }
    c.fillStyle = AB_COR.ouro; rr(c,q[1] > 0 ? q[0] + fw - 9 * fw / 70 - 3 : q[0] + 9 * fw / 70 - 3,P.y + P.h * 0.5,6,30,3); c.fill(); c.strokeStyle = PAL.tinta; c.lineWidth = 1.6; c.stroke();
  });
  rr(c,P.x - 20,Y - 9,P.w + 40,11,3); fs(c,'#D9D0BE',3);
  ab2Buxinho(c,655,Y); ab2Buxinho(c,865,Y);
  if (M.placa){   // à tarde (e à noite, no final), a estrela ao lado da porta; apagada, fica cinza e solta um fiozinho de fumaça
    const es = estrela == null ? 1 : estrela;
    circ(c,865,300,25); fs(c,'#5A3A22',3); circ(c,865,300,19); fs(c,'#7A5232',1.8); star(c,865,300,13,es > 0.5 ? AB_COR.ouro : '#4F4640');
  }
  // o cardápio na parede
  rr(c,1118,236,64,92,4); fs(c,'#5A3A22',3); rr(c,1125,243,50,78,2); fs(c,'#FBF6E6',1.8);
  c.fillStyle = 'rgba(34,32,28,.45)'; [256,268,280,292,304].forEach((y,i) => c.fillRect(1131,y,38 - (i % 2) * 10,3)); star(c,1150,250,4,AB_COR.ouro);
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(x0,14); c.lineTo(x0,Y); c.stroke();
}
// o lampião de rua
function ab2Lampiao(c,x,y,aceso){
  rr(c,x - 13,y - 16,26,16,3); fs(c,'#2E3A36',3);
  c.strokeStyle = PAL.tinta; c.lineWidth = 11; c.lineCap = 'butt'; c.beginPath(); c.moveTo(x,y - 14); c.lineTo(x,y - 300); c.stroke(); c.strokeStyle = '#2E3A36'; c.lineWidth = 6; c.stroke();
  rr(c,x - 9,y - 150,18,8,3); fs(c,'#2E3A36',2.2);
  c.beginPath(); c.moveTo(x - 15,y - 300); c.lineTo(x + 15,y - 300); c.lineTo(x + 21,y - 350); c.lineTo(x - 21,y - 350); c.closePath(); fs(c,aceso ? '#FFE9A8' : '#DCE6E4',3);
  c.strokeStyle = PAL.tinta; c.lineWidth = 2; c.beginPath(); c.moveTo(x,y - 300); c.lineTo(x,y - 350); c.stroke();
  c.beginPath(); c.moveTo(x - 26,y - 350); c.lineTo(x + 26,y - 350); c.lineTo(x,y - 376); c.closePath(); fs(c,'#2E3A36',3);
  circ(c,x,y - 380,4); fs(c,'#2E3A36',2);
}
// um pombo (voa: 0 no chão, até 1 voando)
function ab2Pombo(c,x,y,s,voa,T,i){
  c.save(); c.translate(x,y); c.scale(s,s);
  const b = voa > 0 ? (T > 0 ? Math.sin(T * 24 + i * 2) : 0.7) : 0;
  if (voa <= 0){ c.strokeStyle = '#C96A4A'; c.lineWidth = 2; c.beginPath(); c.moveTo(-2,6); c.lineTo(-3,13); c.moveTo(4,6); c.lineTo(5,13); c.stroke(); }
  c.beginPath(); c.moveTo(-11,-2); c.lineTo(-25,3); c.lineTo(-11,5); c.closePath(); fs(c,'#4A4F5A',1.8);
  ell(c,0,0,14,8.5); fs(c,'#6A7180',2);
  circ(c,12,-8,6); fs(c,'#6A7180',2);
  c.fillStyle = '#7FB59A'; c.fillRect(8,-4,7,3);
  c.fillStyle = PAL.tinta; circ(c,14,-9,1.3); c.fill();
  c.beginPath(); c.moveTo(17,-8); c.lineTo(23,-6); c.lineTo(17,-5); c.closePath(); c.fillStyle = '#E8A23A'; c.fill();
  if (voa > 0){ c.beginPath(); c.moveTo(-7,-3); c.lineTo(6,-3); c.lineTo(-4,-3 - 24 * b); c.closePath(); fs(c,'#8A92A2',1.8); }
  else { ell(c,-2,0,9,5); fs(c,'#8A92A2',1.6); }
  c.restore();
}
/* a rua da Casa Aurora. modo: 'manha' ou 'tarde'. o: { T, abre: a porta (0 a 1), dentro(c): quem está na porta, gente(c): as pessoas na calçada, voo: os pombos (0 a 1) } */
function ab2RuaAurora(c,cam,modo,o){
  o = o || {};
  const T = o.T || 0, M = AB2_RUA.modos[modo] || AB2_RUA.modos.manha, Y = AB2_RUA.calcada, abre = o.abre || 0, noite = modo === 'noite', es = o.estrela == null ? 1 : o.estrela;
  const g = c.createLinearGradient(0,0,0,H * 0.86); g.addColorStop(0,M.ceu[0]); g.addColorStop(1,M.ceu[1]); c.fillStyle = g; c.fillRect(0,0,TW,H);
  ab2Camada(c,cam,0.5,() => {
    if (noite){   // a lua e as estrelinhas
      c.fillStyle = 'rgba(255,255,255,.85)';
      for (let i = 0; i < 34; i++){ circ(c,-80 + (i * 211) % (TW + 200),14 + (i * 97) % 260,0.9 + (T > 0 ? Math.abs(Math.sin(T * 1.8 + i * 1.7)) * 1.1 : 0.6)); c.fill(); }
      ab2Luz(c,M.sol[0],M.sol[1],150,M.sol[2],0.4); circ(c,M.sol[0],M.sol[1],28); c.fillStyle = '#F4F1DE'; c.fill();
      circ(c,M.sol[0] + 11,M.sol[1] - 6,24); c.fillStyle = '#2A3566'; c.fill();   // a lua minguante
      return;
    }
    ab2Luz(c,M.sol[0],M.sol[1],380,M.sol[2],0.95); circ(c,M.sol[0],M.sol[1],46); c.fillStyle = 'rgba(' + M.sol[2] + ',.95)'; c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)'; [[150,120,60,13],[205,104,40,12],[420,170,54,11],[1010,90,70,14],[1070,76,44,12]].forEach(q => { ell(c,q[0],q[1],q[2],q[3]); c.fill(); });
  });
  ab2Camada(c,cam,0.6,() => ab2Predios(c,M.longe,'rgba(255,255,255,.22)',470,1));
  ab2Camada(c,cam,0.8,() => ab2Predios(c,M.perto,M.jan,500,4));
  ab2Camada(c,cam,1,() => {
    ab2Mosaico(c,Y);
    // a outra calçada: a árvore e o banco
    ab2Sombra(c,150,Y + 6,120,14,M.sombra + 0.1);
    c.beginPath(); c.moveTo(112,Y + 2); c.quadraticCurveTo(124,360,116,250); c.lineTo(150,250); c.quadraticCurveTo(146,360,164,Y + 2); c.closePath(); fs(c,'#7A5636',3.5);
    c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(130,440); c.lineTo(132,330); c.moveTo(144,400); c.lineTo(142,300); c.stroke();
    ab2Copa(c,[[60,190,70,'#3F8454'],[150,130,86,'#4C9460'],[250,190,72,'#3F8454'],[110,240,60,'#3F8454'],[200,244,58,'#4C9460'],[130,180,70,'#5FA86B'],[210,150,52,'#5FA86B']],3.5);
    c.fillStyle = 'rgba(200,236,160,.5)'; [[100,110,16],[180,90,14],[236,150,12],[70,170,12],[150,200,10]].forEach(q => { circ(c,q[0],q[1],q[2]); c.fill(); });
    ab2Sombra(c,335,Y + 8,110,10,M.sombra);
    c.strokeStyle = PAL.tinta; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(270,Y + 4); c.lineTo(274,440); c.moveTo(400,Y + 4); c.lineTo(396,440); c.stroke(); c.strokeStyle = '#2E3A36'; c.lineWidth = 5; c.stroke();
    rr(c,252,432,166,13,4); fs(c,PAL.madeira,3); rr(c,258,392,154,11,4); fs(c,PAL.madeira,3); rr(c,258,410,154,11,4); fs(c,PAL.madeiraEsc,3);
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(266,432); c.lineTo(264,388); c.moveTo(404,432); c.lineTo(406,388); c.stroke(); c.strokeStyle = '#2E3A36'; c.lineWidth = 3.5; c.stroke();
    ab2FachadaAurora(c,M,T,abre,o.dentro,o.estrela);
    if (abre > 0){ c.fillStyle = 'rgba(255,226,150,' + (0.5 * abre).toFixed(3) + ')'; c.beginPath(); c.moveTo(696,Y + 2); c.lineTo(824,Y + 2); c.lineTo(910,H + 20); c.lineTo(620,H + 20); c.closePath(); c.fill(); }   // a luz quente sai para a calçada
    ab2Sombra(c,1108,Y + 6,60,8,M.sombra); ab2Lampiao(c,1096,Y + 2,M.lampiao);
    if (o.gente) o.gente(c);
    c.save(); c.globalCompositeOperation = 'screen';
    if (M.lampiao) ab2Luz(c,1096,Y - 322,110,'255,226,150',0.6);
    ab2Luz(c,586,300,130,'255,214,140',0.22); ab2Luz(c,934,300,130,'255,214,140',0.22);
    if (abre > 0) ab2Luz(c,760,340,230,'255,226,150',0.4 * abre);
    c.restore();
  });
  ab2Camada(c,cam,1.2,() => {
    // os galhos da árvore, na borda esquerda
    c.strokeStyle = '#2A1D15'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(-120,40); c.quadraticCurveTo(120,60,300,150); c.moveTo(60,58); c.quadraticCurveTo(160,20,250,34); c.stroke();
    const b = T > 0 ? Math.sin(T * 1.1) * 0.05 : 0;
    [[40,60,-0.5,80,26],[110,70,0.9,90,28],[180,96,0.5,96,28],[250,128,1.1,84,26],[300,150,0.3,90,26],[160,44,-0.9,80,24],[250,34,-0.2,96,26],[250,34,0.9,70,22],[-20,50,1.2,110,30],[90,60,-1.3,70,22],[320,160,1.5,70,22]].forEach((q,i) => ab2Folha(c,q[0],q[1],q[2] + b * (i % 2 ? 1 : -1),q[3],q[4],i % 2 ? '#22382A' : '#1B2E22'));
    // três pombos, que levantam voo
    const v = o.voo || 0;
    if (!noite) [[400,572,1,-1],[462,584,1.15,-1],[520,566,0.95,-1]].forEach((q,i) => {
      const k = clamp(v * 1.25 - i * 0.12,0,1), pica = v <= 0 && T > 0 ? Math.max(0,Math.sin(T * 2.2 + i * 2)) * 3 : 0;
      c.save(); if (q[3] < 0){ c.translate(q[0] * 2,0); c.scale(-1,1); }
      ab2Pombo(c,q[0] + k * (150 + i * 60),q[1] - k * k * 470 - k * 60 + pica,q[2] * 1.5,k,T,i);
      c.restore();
    });
  });
  if (noite){   // a noite: azul por cima de tudo (multiply) e, por cima do azul, o que brilha: o lampião, as janelas, a porta aberta e a estrelinha
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(54,66,128,.86)'; c.fillRect(0,0,TW,H); c.restore();
    ab2Camada(c,cam,1,() => {
      c.save(); c.globalCompositeOperation = 'screen';
      ab2Luz(c,1096,Y - 322,150,'255,226,150',0.7);
      ab2Luz(c,586,300,130,'255,214,140',0.32); ab2Luz(c,934,300,130,'255,214,140',0.32);
      if (abre > 0) ab2Luz(c,760,340,190,'255,226,150',0.42 * abre);
      if (es > 0) ab2Luz(c,865,300,100,'255,226,140',0.85 * es);
      c.restore();
      if (es <= 0.02 && o.estrela != null){   // apagada: um fiozinho de fumaça sobe da estrelinha
        const u = T > 0 ? (T * 0.45) % 1 : 0.3;
        for (let i = 0; i < 2; i++){ const k = (u + i * 0.5) % 1; c.strokeStyle = 'rgba(214,220,238,' + (0.75 * (1 - k)).toFixed(3) + ')'; c.lineWidth = 5; c.lineCap = 'round';
          c.beginPath(); c.moveTo(871,278 - k * 8); c.bezierCurveTo(861 + k * 6,262 - k * 26,883 - k * 4,250 - k * 30,873,230 - k * 44); c.stroke(); }
      }
      if (es > 0 && M.placa){ c.globalAlpha = es; star(c,865,300,13,'#FFD66B'); c.globalAlpha = 1; }   // a estrelinha acesa não escurece com a noite
    });
  } else ab2Clima(c,M.clima[0],M.clima[1]);
  ab2Vinheta(c,0.46);
}

/* ---------- o cenário "cozinha da Casa Aurora" (cena 4) ---------- */
const AB2_AUR = { tampo:448, base:516, panela:[640,440] };
// pote de tempero com rótulo (x, y: o meio da base; s: a escala)
function ab2Pote(c,x,y,s,rotulo,cor){
  c.save(); c.translate(x,y); c.scale(s,s);
  rr(c,-8,-20,16,20,3); fs(c,'#EAF3F4',1.4);
  c.fillStyle = cor; c.fillRect(-6.6,-13,13.2,11.6);
  rr(c,-9,-24,18,5.5,2); fs(c,PAL.madeira,1.2);
  rr(c,-7.4,-12.5,14.8,7,1); c.fillStyle = '#FFFDF7'; c.fill(); c.strokeStyle = 'rgba(34,32,28,.6)'; c.lineWidth = 0.6; c.stroke();
  txt(c,rotulo,0,-8.8,3.5,PAL.tinta,'center',FB);
  c.restore();
}
// o fundo: o azulejo branco de metrô, a coifa de cobre, as panelas, o passa-pratos, dois cozinheiros de costas e o Bráulio gritando
function ab2CozinhaAuroraFundo(c,T){
  c.fillStyle = '#F4F7F8'; c.fillRect(0,0,TW,H);
  c.strokeStyle = 'rgba(110,135,160,.3)'; c.lineWidth = 1.8; c.beginPath();
  for (let y = 0, k = 0; y < 480; y += 28, k++){ c.moveTo(0,y); c.lineTo(TW,y); for (let x = (k % 2) * 32; x < TW; x += 64){ c.moveTo(x,y); c.lineTo(x,y + 28); } }
  c.stroke();
  // a coifa grande de cobre
  const gc = c.createLinearGradient(380,0,900,0); gc.addColorStop(0,'#B5683A'); gc.addColorStop(0.45,'#E6A873'); gc.addColorStop(1,'#B5683A');
  c.beginPath(); c.moveTo(380,-10); c.lineTo(900,-10); c.lineTo(850,104); c.lineTo(430,104); c.closePath(); c.fillStyle = gc; c.fill(); c.strokeStyle = PAL.tinta; c.lineWidth = 3.5; c.stroke();
  rr(c,420,100,440,20,4); fs(c,'#C97B4A',3);
  c.fillStyle = 'rgba(60,30,10,.5)'; for (let x = 440; x < 850; x += 34){ circ(c,x,110,2.6); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(560,-10); c.lineTo(620,-10); c.lineTo(600,100); c.lineTo(552,100); c.closePath(); c.fill();
  ab2Luz(c,640,150,200,'255,240,210',0.5);
  // as panelas de cobre penduradas
  c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 8; c.beginPath(); c.moveTo(96,118); c.lineTo(356,118); c.stroke(); c.strokeStyle = '#6B6B72'; c.lineWidth = 4; c.stroke();
  [[130,30],[196,24],[254,27],[316,19]].forEach(q => { rr(c,q[0] - 5,122,10,34,4); fs(c,'#3a3a3c',2.5); circ(c,q[0],154 + q[1],q[1]); fs(c,'#C97B4A',3.5); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 3; c.beginPath(); c.arc(q[0],154 + q[1],q[1] * 0.6,Math.PI * 1.05,Math.PI * 1.6); c.stroke(); });
  // o passa-pratos, com a campainha e as comandas no varal
  rr(c,902,170,270,150,6); fs(c,'#5B2A33',3.5);
  c.fillStyle = 'rgba(255,214,140,.5)'; [[950,214],[1010,206],[1076,216],[1130,208]].forEach(q => { circ(c,q[0],q[1],5); c.fill(); }); ab2Luz(c,1036,240,120,'255,214,140',0.3);
  rr(c,890,316,294,16,4); fs(c,PAL.inox,3);
  c.strokeStyle = PAL.tinta; c.lineWidth = 2; c.beginPath(); c.moveTo(900,150); c.lineTo(1174,150); c.stroke();
  [926,968,1012,1060,1104,1146].forEach((x,i) => { c.save(); c.translate(x,150); c.rotate((i % 3 - 1) * 0.07); rr(c,-10,0,20,30,1.5); fs(c,'#FFFDF7',1.6); c.fillStyle = 'rgba(34,32,28,.4)'; c.fillRect(-6,7,12,2); c.fillRect(-6,13,9,2); c.fillRect(-6,19,11,2); c.restore(); });
  c.beginPath(); c.arc(934,316,13,Math.PI,0); c.closePath(); fs(c,AB_COR.ouro,2.5); circ(c,934,301,3); fs(c,AB_COR.ouro,1.8);
  [[1004,316],[1060,316]].forEach(q => { ell(c,q[0],q[1] - 4,24,6); fs(c,'#fff',2.2); });
  // a linha de fogões do fundo
  rr(c,-20,404,TW + 40,90,4); fs(c,'#C7CED6',3); c.fillStyle = '#3a3a3c'; c.fillRect(-20,398,TW + 40,10); c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.strokeRect(-20,398,TW + 40,10);
  // dois cozinheiros de costas, trabalhando
  const sc = abEsc('tonhao',AB2.k * 0.7), m = T > 0 ? Math.sin(T * 5) * 2 : 0;
  abCostas(c,206,486 + (T > 0 ? Math.abs(Math.sin(T * 5)) * 2 : 0),sc,{ calca:'#3A3F4A', roupa:'#fff', pele:SKINS[2], cor:'#2a2320' });
  abCostas(c,346,486,sc,{ calca:'#3A3F4A', roupa:'#fff', pele:SKINS[4], cor:'#8C8C8C' });
  rr(c,150 + m,372,54,12,4); fs(c,'#4A4A52',2.5); rr(c,372,360,44,34,5); fs(c,'#B9C2CC',2.5);
  // o Bráulio, de dedo em riste, e a frigideira flambando
  const sb = abEsc('braulio',AB2.k * 0.7), bx = 1010, by = 486, tre = T > 0 ? Math.sin(T * 17) * 1.5 : 0;
  abBraulio(c,bx + tre,by,sb,{ semPlaca:true });
  ab2BracoDe(c,bx + tre,by,sb,[[-18,-78],[-27,-62],[-19,-50]],'#fff','#F2C9A5');
  ab2BracoDe(c,bx + tre,by,sb,[[18,-78],[34,-86],[40,-108 + (T > 0 ? Math.sin(T * 9) * 3 : 0)]],'#fff','#F2C9A5',cc => { cc.strokeStyle = PAL.tinta; cc.lineWidth = 6.4; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(40,-110); cc.lineTo(41,-122); cc.stroke(); cc.strokeStyle = '#F2C9A5'; cc.lineWidth = 3.4; cc.stroke(); });
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(bx - 13,by - 106 * sb); c.lineTo(bx - 4,by - 103 * sb); c.moveTo(bx + 13,by - 106 * sb); c.lineTo(bx + 4,by - 103 * sb); c.stroke();   // as sobrancelhas de bravo
  const qx = bx - 96, qy = by - 190 * sb + 40;   // o balãozinho de "!!!" (não é fala)
  c.beginPath(); c.moveTo(qx + 34,qy + 30); c.lineTo(qx + 62,qy + 54); c.lineTo(qx + 50,qy + 26); c.closePath(); fs(c,'#fff',3);
  rr(c,qx - 30,qy - 24,88,54,16); fs(c,'#fff',3); c.fillStyle = '#fff'; c.fillRect(qx + 34,qy + 22,16,7);
  txt(c,'!!!',qx + 14,qy + 4,34,PAL.perigo,'center',FD);
  const fx = 1128, fy = 392;
  for (let i = 0; i < 5; i++){ const h = 46 + (T > 0 ? Math.sin(T * 11 + i * 1.7) * 12 : 6) - Math.abs(i - 2) * 9, x = fx - 32 + i * 16; c.beginPath(); c.moveTo(x - 11,fy); c.quadraticCurveTo(x - 4,fy - h * 0.5,x,fy - h); c.quadraticCurveTo(x + 5,fy - h * 0.5,x + 11,fy); c.closePath(); c.fillStyle = i % 2 ? '#F2A53A' : '#E86A2C'; c.fill(); }
  for (let i = 0; i < 3; i++){ const h = 22 + (T > 0 ? Math.sin(T * 13 + i * 2.3) * 6 : 3), x = fx - 16 + i * 16; c.beginPath(); c.moveTo(x - 7,fy); c.quadraticCurveTo(x,fy - h * 1.6,x + 7,fy); c.closePath(); c.fillStyle = '#FFE08A'; c.fill(); }
  rr(c,fx - 44,fy - 4,88,13,5); fs(c,'#4A4A52',3); rr(c,fx + 40,fy - 2,50,8,4); fs(c,'#3a3a3c',2.5);
  ab2Luz(c,fx,fy - 30,110,'255,170,80',0.45);
  c.fillStyle = 'rgba(232,242,250,.36)'; c.fillRect(0,0,TW,H);   // mais claro e mais frio, para ficar longe
}
// a bancada de inox comprida, com a tábua, os legumes, o pote de açafrão e a panela grande no centro; brilho: o molho reluz (0 a 1)
function ab2BancadaAurora(c,T,brilho){
  const A = AB2_AUR, y = A.tampo, yb = A.base, x = 150, w = 920;
  ab2Sombra(c,x + w / 2,yb + 2,w * 0.55,13,0.4);
  rr(c,x + 8,y + 10,w - 16,yb - y - 10,5); fs(c,'#C7CED6',4);
  for (let i = 0; i < 5; i++){ const dx = x + 22 + i * ((w - 44) / 5), dw = (w - 44) / 5 - 10; rr(c,dx,y + 24,dw,yb - y - 34,4); c.strokeStyle = 'rgba(34,32,28,.4)'; c.lineWidth = 2.2; c.stroke(); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(dx + 6,y + 28,5,yb - y - 42); rr(c,dx + dw / 2 - 16,y + 30,32,5,2.5); fs(c,'#8E99A6',1.6); }
  rr(c,x,y,w,14,5); fs(c,PAL.inox,3.5);
  c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(x + 8,y + 3,w - 16,3);
  // a tábua e os legumes
  rr(c,196,y - 9,150,9,3); fs(c,'#DDA869',2.5);
  c.beginPath(); c.moveTo(214,y - 12); c.lineTo(262,y - 22); c.lineTo(264,y - 12); c.closePath(); fs(c,'#F08A3C',2.5); ab2Folha(c,214,y - 14,-2.7,16,5,'#4C9460');
  circ(c,290,y - 22,13); fs(c,'#DC4A34',2.5); ab2Folha(c,290,y - 34,-2.4,8,3,'#3F8454'); ab2Folha(c,290,y - 34,-0.7,8,3,'#3F8454');
  circ(c,322,y - 20,11); fs(c,'#E9D9A6',2.5); c.strokeStyle = 'rgba(120,90,40,.5)'; c.lineWidth = 1.5; c.beginPath(); c.arc(322,y - 20,6,0.5,2.6); c.stroke();
  ab2Pote(c,398,y,2.3,'açafrão','#F2B43A');
  // o prato fundo com as colheres e a pilha de pratos
  [0,1,2,3].forEach(i => { ell(c,930,y - 5 - i * 6,42,7); fs(c,'#fff',2.2); });
  c.beginPath(); c.moveTo(832,y - 22); c.quadraticCurveTo(856,y + 8,880,y - 22); c.closePath(); fs(c,'#F6E7C1',2.8);
  // a boca acesa e a panela grande
  const px = A.panela[0], py = A.panela[1];
  c.fillStyle = PAL.tinta; c.fillRect(px - 62,y - 6,124,6); c.fillRect(px - 62,y - 10,7,5); c.fillRect(px + 55,y - 10,7,5);
  for (let i = -5; i <= 5; i++){ const h = 8 + (T > 0 ? Math.sin(T * 13 + i * 1.9) * 2.5 : 1), fx = px + i * 10; c.beginPath(); c.moveTo(fx - 5,y - 6); c.quadraticCurveTo(fx,y - 6 - h * 1.9,fx + 5,y - 6); c.closePath(); c.fillStyle = '#4AA8F0'; c.fill(); }
  const pw = 150, ph = 50;
  rr(c,px - pw / 2 - 18,py - ph + 8,24,11,4); fs(c,'#6B6B72',2.5); rr(c,px + pw / 2 - 6,py - ph + 8,24,11,4); fs(c,'#6B6B72',2.5);
  rr(c,px - pw / 2,py - ph,pw,ph,10); fs(c,'#B9C2CC',4);
  c.fillStyle = 'rgba(255,255,255,.5)'; rr(c,px - pw / 2 + 10,py - ph + 8,10,ph - 18,5); c.fill();
  c.fillStyle = 'rgba(60,70,90,.2)'; rr(c,px - pw / 2 + 4,py - 13,pw - 8,9,4); c.fill();
  rr(c,px - pw / 2 - 5,py - ph - 8,pw + 10,12,6); fs(c,'#DDE3E9',3);
  c.fillStyle = brilho > 0 ? abMistura(AB_COR.molho,'#E8557A',brilho * 0.7) : AB_COR.molho; ell(c,px,py - ph - 3,pw / 2 - 7,5); c.fill();
  c.fillStyle = 'rgba(255,230,190,.55)'; ell(c,px - 22,py - ph - 4,13,1.8); c.fill();
  c.lineCap = 'round';
  for (let i = 0; i < 4; i++){   // o vapor (fica rosa com o brilho)
    const k = T > 0 ? ((T * 0.45 + i * 0.27) % 1) : 0.35 + i * 0.12, vx = px - 48 + i * 32, vy = py - ph - 16 - k * 70;
    c.globalAlpha = T > 0 ? Math.min(1,k * 4) * (1 - k) : 0.6;
    c.beginPath(); c.moveTo(vx,vy); c.bezierCurveTo(vx - 15,vy - 22,vx + 15,vy - 36,vx,vy - 60);
    c.strokeStyle = brilho > 0 ? 'rgba(200,80,120,' + (0.3 + brilho * 0.25).toFixed(2) + ')' : 'rgba(120,135,150,.45)'; c.lineWidth = 10; c.stroke();
    c.strokeStyle = brilho > 0 ? abMistura('#FCFCFA','#FFC2D6',brilho) : 'rgba(252,252,250,.95)'; c.lineWidth = 5.5; c.stroke();
  }
  c.globalAlpha = 1;
}
/* a cozinha da Casa Aurora. o: { T, brilho: o brilho rosado da panela (0 a 1), gente(c) } */
function ab2CozinhaAurora(c,cam,o){
  o = o || {};
  const T = o.T || 0, A = AB2_AUR, b = o.brilho || 0, px = A.panela[0], gy = A.panela[1] - 92;
  ab2Camada(c,cam,0.8,() => ab2CozinhaAuroraFundo(c,T));
  ab2Camada(c,cam,1,() => {
    ab2Piso(c,'#E6EAEC','#A3B3BE','#C7CED6');
    ab2BancadaAurora(c,T,b);
    if (b > 0){   // o brilho rosado com halo dourado, por trás das pessoas, e as estrelinhas
      c.save(); c.globalCompositeOperation = 'screen';
      ab2Luz(c,px,gy,300,'242,194,61',0.5 * b); ab2Luz(c,px,gy,190,'232,69,122',0.85 * b);
      c.restore();
      for (let i = 0; i < 7; i++){ const a = i * TAU / 7 + (T > 0 ? T * 1.6 : 0.4), r = 96 + (i % 2) * 40; c.globalAlpha = b * (0.75 + 0.25 * Math.sin((T > 0 ? T * 5 : 1) + i)); star(c,px + Math.cos(a) * r,gy - 10 + Math.sin(a) * r * 0.42,6 + (i % 3) * 2,i % 2 ? AB_COR.ouro : '#FFD0DF'); }
      c.globalAlpha = 1;
    }
    if (o.gente) o.gente(c);
    c.save(); c.globalCompositeOperation = 'screen';
    ab2Luz(c,px,A.tampo - 6,96,'255,150,70',0.45 + (T > 0 ? Math.sin(T * 9) * 0.05 : 0));
    if (b > 0) ab2Luz(c,px,gy,150,'232,69,122',0.22 * b);
    c.restore();
  });
  ab2Camada(c,cam,1.2,() => {
    // a borda de uma prateleira com pratos empilhados, embaixo, e o vapor passando
    c.fillStyle = 'rgba(46,36,34,.96)'; c.fillRect(-300,512,TW + 600,300);
    c.fillStyle = 'rgba(92,78,74,.96)'; c.fillRect(-300,512,TW + 600,5);
    [[318,5],[392,3],[916,4],[994,6],[150,4],[1100,3]].forEach(q => { for (let i = 0; i < q[1]; i++){ c.fillStyle = i % 2 ? 'rgba(70,58,56,.97)' : 'rgba(46,36,34,.97)'; rr(c,q[0] - 38,505 - i * 8,76,9,4); c.fill(); } });
    for (let i = 0; i < 3; i++){
      const k = T > 0 ? ((T * 0.07 + i * 0.37) % 1) : 0.3 + i * 0.25, vx = -100 + k * (TW + 200), vy = 430 - i * 90 + Math.sin(k * 9 + i) * 20;
      c.fillStyle = 'rgba(255,255,255,' + (0.1 * Math.sin(k * Math.PI)).toFixed(3) + ')'; ell(c,vx,vy,150,30); c.fill(); ell(c,vx + 90,vy - 16,100,24); c.fill();
    }
  });
  ab2Clima(c,'201,123,74',0.05);
  ab2Vinheta(c,0.46);
}

/* ---------- o cenário "salão de gala" (cena 5) ---------- */
const AB2_GALA = { palco:512, chao:526, porta:{ x:968, y:164, w:186, h:362 } };
/* o salão de gala. o: { T, foco: o holofote (0 a 1), palco(c): quem está no palco, porta(c): quem está na porta da cozinha, na penumbra } */
function ab2Gala(c,cam,o){
  o = o || {};
  const T = o.T || 0, G = AB2_GALA, P = G.porta, foco = o.foco == null ? 1 : o.foco;
  ab2Camada(c,cam,0.8,() => {
    // a cortina de veludo vinho, com dobras e franja dourada
    const g = c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#5A1F2B'); g.addColorStop(1,'#7A2E3A'); c.fillStyle = g; c.fillRect(0,0,TW,H);
    for (let x = -20, i = 0; x < TW; x += 44, i++){
      const gg = c.createLinearGradient(x,0,x + 44,0); gg.addColorStop(0,'rgba(0,0,0,.26)'); gg.addColorStop(0.45,'rgba(255,190,170,.1)'); gg.addColorStop(1,'rgba(0,0,0,.2)');
      c.fillStyle = gg; c.fillRect(x,0,44,H);
    }
    for (let x = -30, i = 0; x < TW + 60; x += 122, i++){
      c.beginPath(); c.moveTo(x,-10); c.lineTo(x + 122,-10); c.lineTo(x + 122,40); c.quadraticCurveTo(x + 61,118,x,40); c.closePath(); fs(c,'#8A3442',3);
      c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 30,-10); c.quadraticCurveTo(x + 50,40,x + 61,76); c.moveTo(x + 92,-10); c.quadraticCurveTo(x + 72,40,x + 61,76); c.stroke();
      c.strokeStyle = AB_COR.ouro; c.lineWidth = 5; c.beginPath(); c.moveTo(x + 122,40); c.quadraticCurveTo(x + 61,118,x,40); c.stroke();
      c.lineWidth = 2; c.beginPath(); for (let k = 1; k < 12; k++){ const u = k / 12, fx = x + 122 - 122 * u, fy = 40 + 78 * 2 * u * (1 - u) * 1.0; c.moveTo(fx,fy + 2); c.lineTo(fx,fy + 13); } c.stroke();
      circ(c,x,40,8); fs(c,AB_COR.ouro,2.5);
    }
    // um lustre
    const lx = 760;
    c.strokeStyle = PAL.tinta; c.lineWidth = 6; c.beginPath(); c.moveTo(lx,-10); c.lineTo(lx,96); c.stroke(); c.strokeStyle = AB_COR.ouro; c.lineWidth = 3; c.stroke();
    c.strokeStyle = AB_COR.ouro; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); [-78,-40,40,78].forEach(d => { c.moveTo(lx,100); c.quadraticCurveTo(lx + d * 0.6,140,lx + d,112); }); c.stroke();
    ell(c,lx,102,22,10); fs(c,AB_COR.ouro,2.5);
    [-78,-40,0,40,78].forEach((d,i) => { const y = d ? 112 : 128; rr(c,lx + d - 4,y - 20,8,20,2); fs(c,'#FFFDF7',2); c.fillStyle = '#FFE08A'; ell(c,lx + d,y - 27,4,7); c.fill(); ab2Luz(c,lx + d,y - 26,46,'255,226,150',0.55 + (T > 0 ? Math.sin(T * 7 + i) * 0.08 : 0)); });
    c.fillStyle = 'rgba(255,255,255,.75)'; [-58,-20,20,58].forEach(d => { c.beginPath(); c.moveTo(lx + d,128); c.lineTo(lx + d - 4,138); c.lineTo(lx + d,150); c.lineTo(lx + d + 4,138); c.closePath(); c.fill(); });
  });
  ab2Camada(c,cam,1,() => {
    // o chão (carpete com losangos) e o palco baixo de madeira
    c.fillStyle = '#3B2420'; c.fillRect(-160,G.chao,TW + 320,H - G.chao + 90);
    c.fillStyle = 'rgba(201,123,74,.16)'; c.beginPath(); for (let y = G.chao + 12, k = 0; y < H + 60; y += 26, k++) for (let x = -160 + (k % 2) * 30; x < TW + 160; x += 60){ c.moveTo(x,y - 9); c.lineTo(x + 15,y); c.lineTo(x,y + 9); c.lineTo(x - 15,y); c.closePath(); } c.fill();
    ab2Sombra(c,470,G.chao + 30,400,16,0.5);
    rr(c,96,G.palco,750,36,5); fs(c,'#8A5226',4);
    c.fillStyle = PAL.madeira; c.fillRect(100,G.palco + 2,742,10); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.beginPath(); for (let x = 150; x < 840; x += 74){ c.moveTo(x,G.palco + 12); c.lineTo(x,G.palco + 34); } c.moveTo(98,G.palco + 12); c.lineTo(844,G.palco + 12); c.stroke();
    // o holofote, em cone
    if (foco > 0){
      c.save(); c.globalCompositeOperation = 'screen';
      const g = c.createLinearGradient(0,0,0,G.palco); g.addColorStop(0,'rgba(255,240,190,' + (0.42 * foco).toFixed(3) + ')'); g.addColorStop(1,'rgba(255,240,190,' + (0.14 * foco).toFixed(3) + ')');
      c.fillStyle = g; c.beginPath(); c.moveTo(430,-20); c.lineTo(510,-20); c.lineTo(660,G.palco + 6); c.lineTo(280,G.palco + 6); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,240,190,' + (0.3 * foco).toFixed(3) + ')'; ell(c,470,G.palco + 6,190,13); c.fill();
      c.restore();
    }
    if (o.palco) o.palco(c);
    // o confete dourado caindo
    for (let i = 0; i < 44; i++){
      const k = T > 0 ? ((T * (0.1 + (i % 5) * 0.022) + i * 0.137) % 1) : (i * 0.137) % 1, x = 120 + ((i * 97) % 720) + Math.sin(k * 9 + i) * 16, y = -20 + k * (G.palco + 20);
      c.save(); c.translate(x,y); c.rotate(k * 9 + i); c.fillStyle = i % 3 ? AB_COR.ouro : '#FFE9A8'; c.fillRect(-4,-2,8,4); c.restore();
    }
    // a parede da direita e a porta da cozinha, entreaberta, com a luz fria
    c.fillStyle = '#4A2A2E'; c.fillRect(900,-10,TW + 260 - 900,G.chao + 10);
    c.strokeStyle = 'rgba(201,123,74,.35)'; c.lineWidth = 3; [[1176,60,110,180],[1176,270,110,220],[912,60,36,430]].forEach(q => c.strokeRect(q[0],q[1],q[2],q[3]));
    c.fillStyle = '#C97B4A'; c.fillRect(900,-10,7,G.chao + 10); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(900,-10); c.lineTo(900,G.chao); c.stroke();
    c.fillStyle = PAL.tinta; c.fillRect(P.x - 13,P.y - 13,P.w + 26,P.h + 13); c.fillStyle = '#6E4630'; c.fillRect(P.x - 10,P.y - 10,P.w + 20,P.h + 10);
    c.save(); c.beginPath(); c.rect(P.x,P.y,P.w,P.h); c.clip();
    const gp = c.createLinearGradient(0,P.y,0,P.y + P.h); gp.addColorStop(0,'#B9CCE6'); gp.addColorStop(1,'#56608E'); c.fillStyle = gp; c.fillRect(P.x,P.y,P.w,P.h);
    c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 1.8; c.beginPath(); for (let y = P.y, k = 0; y < P.y + 260; y += 26, k++){ c.moveTo(P.x,y); c.lineTo(P.x + P.w,y); for (let x = P.x + (k % 2) * 28; x < P.x + P.w; x += 56){ c.moveTo(x,y); c.lineTo(x,y + 26); } } c.stroke();
    c.fillStyle = 'rgba(42,49,90,.5)'; c.fillRect(P.x,P.y + 280,P.w,P.h - 280);
    c.strokeStyle = 'rgba(30,42,74,.6)'; c.lineWidth = 5; c.beginPath(); c.moveTo(P.x + 10,P.y + 34); c.lineTo(P.x + P.w - 10,P.y + 34); c.stroke();
    [[P.x + 44,20],[P.x + 92,15],[P.x + 136,18]].forEach(q => { c.fillStyle = 'rgba(30,42,74,.6)'; c.fillRect(q[0] - 3,P.y + 34,6,24); circ(c,q[0],P.y + 58 + q[1],q[1]); c.fill(); });
    if (o.porta) o.porta(c);
    c.fillStyle = 'rgba(30,42,74,.36)'; c.fillRect(P.x,P.y,P.w,P.h);   // a penumbra
    c.restore();
    c.beginPath(); c.moveTo(P.x + P.w,P.y); c.lineTo(P.x + P.w + 40,P.y + 14); c.lineTo(P.x + P.w + 40,G.chao + 26); c.lineTo(P.x + P.w,G.chao); c.closePath(); fs(c,'#7A5232',3);
    circ(c,P.x + P.w + 9,P.y + 190,6); fs(c,AB_COR.ouro,2);
    c.fillStyle = 'rgba(159,180,216,.3)'; c.beginPath(); c.moveTo(P.x,G.chao); c.lineTo(P.x + P.w,G.chao); c.lineTo(P.x + P.w + 30,H + 40); c.lineTo(P.x - 110,H + 40); c.closePath(); c.fill();   // a luz fria no chão
  });
  ab2Camada(c,cam,1.2,() => {
    // a plateia em silhueta, de costas, com os braços aplaudindo e três câmeras com flash
    const cor = '#190F14';
    for (let i = 0; i < 13; i++){
      const x = -110 + i * 122 + (i % 2) * 14, pula = T > 0 ? Math.abs(Math.sin(T * (4 + (i % 3)) + i)) * 5 : 0, y = 500 + (i % 3) * 12 - pula;
      c.fillStyle = cor; rr(c,x - 54,y + 26,108,200,30); c.fill(); circ(c,x,y,(i % 2 ? 33 : 37)); c.fill();
      if (i % 4 === 1){ circ(c,x,y - 30,20); c.fill(); }
      if (i % 3 !== 2){   // as palmas
        const b = T > 0 ? Math.abs(Math.sin(T * (7 + (i % 4)) + i * 1.7)) : 0.5;
        c.strokeStyle = cor; c.lineWidth = 17; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 50,y + 50); c.lineTo(x - 26 - b * 10,y - 46); c.moveTo(x + 50,y + 50); c.lineTo(x + 26 + b * 10,y - 46); c.stroke();
        circ(c,x - 26 - b * 10,y - 52,11); c.fill(); circ(c,x + 26 + b * 10,y - 52,11); c.fill();
      }
    }
    [[214,430,0],[628,438,1.9],[1010,426,3.4]].forEach((q,i) => {
      c.fillStyle = cor; rr(c,q[0] - 30,q[1] - 16,60,40,7); c.fill(); rr(c,q[0] - 12,q[1] - 26,26,12,3); c.fill(); c.fillRect(q[0] - 8,q[1] + 20,16,90);
      const f = T > 0 ? Math.pow(Math.max(0,Math.sin(T * 2.6 + q[2])),14) : 0;
      if (f > 0.02){ c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,q[0] + 20,q[1] - 22,150 * f,'255,255,255',f); c.restore(); c.fillStyle = 'rgba(255,255,255,' + f.toFixed(3) + ')'; star(c,q[0] + 20,q[1] - 22,10 + f * 16,'#fff'); }
      else { c.fillStyle = 'rgba(255,255,255,.5)'; circ(c,q[0] + 20,q[1] - 22,3); c.fill(); }
    });
  });
  ab2Clima(c,'122,46,58',0.07);
  ab2Vinheta(c,0.6);
}

/* ---------- o cenário "quarto" (cena 6): um quarto de hospital, mas aconchegante, sem aparelhos nem soro ---------- */
const AB2_QTO = { colcha:446, rosa:[640,510], bia:[455,440], criado:[770,420] };
// o caderno "Receitas da Rosa", fechado (x, y: o meio; s: a escala; rot: a inclinação)
function ab2Caderno(c,x,y,s,rot){
  c.save(); c.translate(x,y); c.rotate(rot || 0); c.scale(s,s);
  rr(c,-22,-28,44,56,4); fs(c,AB_COR.rosa,2.4);
  c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-22,-28,6,56);
  rr(c,-12,-20,30,26,2); fs(c,PAL.creme,1.4);
  txt(c,'Receitas',3,-11,6.2,PAL.tinta,'center',FB); txt(c,'da Rosa',3,-3,6.2,PAL.tinta,'center',FB);
  abFlor(c,3,15,4.4);
  c.restore();
}
/* o quarto. o: { T, gente(c): as pessoas (depois da colcha; a cena recorta a Rosa na borda dela) } */
function ab2Quarto(c,cam,o){
  o = o || {};
  const T = o.T || 0, Q = AB2_QTO, ly = Q.criado[1];
  ab2Camada(c,cam,0.85,() => {
    // a parede verde-água, escurecida pela noite, com papel de parede listrado e lambri
    const g = c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#5E9A98'); g.addColorStop(1,'#77B0AB'); c.fillStyle = g; c.fillRect(0,0,TW,H);
    c.fillStyle = 'rgba(255,255,255,.07)'; for (let x = 10; x < TW; x += 52) c.fillRect(x,0,26,H);
    c.fillStyle = 'rgba(40,80,84,.22)'; c.beginPath(); for (let x = 23, i = 0; x < TW; x += 52, i++) for (let y = 30 + (i % 2) * 26; y < 440; y += 52){ c.moveTo(x,y - 5); c.lineTo(x + 5,y); c.lineTo(x,y + 5); c.lineTo(x - 5,y); c.closePath(); } c.fill();
    c.fillStyle = '#E9E2CF'; c.fillRect(0,440,TW,H - 440); c.fillStyle = '#D6CCB4'; for (let x = 0; x < TW; x += 64) c.fillRect(x,452,2,H);
    rr(c,-10,432,TW + 20,14,3); fs(c,'#F4EEDD',2.5);
    // a janela, com o céu azul-escuro, a lua e uma cortina leve que balança
    const jx = 262, jy = 132, jw = 164, jh = 204;
    c.save(); rr(c,jx,jy,jw,jh,6); c.clip();
    const gs = c.createLinearGradient(0,jy,0,jy + jh); gs.addColorStop(0,'#131A36'); gs.addColorStop(1,'#3A3F6E'); c.fillStyle = gs; c.fillRect(jx,jy,jw,jh);
    c.fillStyle = 'rgba(255,255,255,.85)'; [[20,30],[60,84],[120,26],[140,110],[36,140],[96,160]].forEach((q,i) => { circ(c,jx + q[0],jy + q[1],1.4 + (i % 2) * 0.5); c.fill(); });
    ab2Luz(c,jx + 104,jy + 62,90,'214,226,255',0.6); circ(c,jx + 104,jy + 62,22); c.fillStyle = '#F4F1DC'; c.fill(); circ(c,jx + 114,jy + 56,20); c.fillStyle = '#18203F'; c.fill();
    c.restore();
    rr(c,jx - 2,jy - 2,jw + 4,jh + 4,6); c.lineWidth = 9; c.strokeStyle = '#F4EEDD'; c.stroke();
    rr(c,jx - 7,jy - 7,jw + 14,jh + 14,8); c.lineWidth = 3; c.strokeStyle = PAL.tinta; c.stroke();
    c.fillStyle = '#F4EEDD'; c.fillRect(jx + jw / 2 - 4,jy,8,jh);
    rr(c,jx - 18,jy + jh + 6,jw + 36,12,4); fs(c,'#F4EEDD',3);
    const b = T > 0 ? Math.sin(T * 1.1) : 0.3;
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(jx - 30,jy - 22); c.lineTo(jx + jw + 30,jy - 22); c.stroke(); c.strokeStyle = PAL.cromo; c.lineWidth = 3.5; c.stroke();
    [-1,1].forEach(d => {
      const e = d < 0 ? jx : jx + jw, x = k => e - d * k, sw = b * 9 * (d < 0 ? 1 : 0.6);
      c.beginPath(); c.moveTo(x(-26),jy - 20); c.lineTo(x(56),jy - 20); c.quadraticCurveTo(x(50) + sw,jy + 120,x(40) + sw * 1.6,jy + jh + 30); c.lineTo(x(-22) + sw,jy + jh + 30); c.quadraticCurveTo(x(-30),jy + 100,x(-26),jy - 20); c.closePath();
      c.fillStyle = 'rgba(232,240,252,.78)'; c.fill(); c.strokeStyle = 'rgba(34,32,28,.6)'; c.lineWidth = 2.2; c.stroke();
      c.strokeStyle = 'rgba(150,170,210,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x(26),jy - 16); c.quadraticCurveTo(x(22) + sw,jy + 120,x(14) + sw * 1.4,jy + jh + 26); c.moveTo(x(0),jy - 16); c.quadraticCurveTo(x(-4) + sw,jy + 120,x(-8) + sw * 1.2,jy + jh + 26); c.stroke();
    });
    // um quadrinho de flor, do outro lado
    rr(c,900,214,70,86,4); fs(c,'#C9A46A',3); rr(c,908,222,54,70,2); fs(c,'#F6E7C1',1.6); c.strokeStyle = '#3F8454'; c.lineWidth = 3; c.beginPath(); c.moveTo(935,282); c.lineTo(935,254); c.stroke(); abFlor(c,935,248,8);
  });
  ab2Camada(c,cam,1,() => {
    c.fillStyle = '#8A7468'; c.fillRect(-160,548,TW + 320,200); c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; c.beginPath(); for (let x = -160; x < TW + 160; x += 90){ c.moveTo(x,548); c.lineTo(x - 30,640); } c.stroke();
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-160,548); c.lineTo(TW + 160,548); c.stroke();
    // o criado-mudo: o abajur aceso, o copo com a flor da Rosa
    const nx = Q.criado[0];
    rr(c,nx,ly,124,140,5); fs(c,'#B5733A',3.5); rr(c,nx + 12,ly + 22,100,40,4); fs(c,'#C98A4E',2.5); circ(c,nx + 62,ly + 42,5); fs(c,AB_COR.ouro,2); rr(c,nx + 12,ly + 72,100,54,4); fs(c,'#C98A4E',2.5); circ(c,nx + 62,ly + 98,5); fs(c,AB_COR.ouro,2);
    rr(c,nx - 6,ly - 4,136,14,5); fs(c,'#8A5226',3);
    const ax = nx + 84;
    rr(c,ax - 20,ly - 16,40,12,5); fs(c,'#C97B4A',2.5); c.strokeStyle = PAL.tinta; c.lineWidth = 9; c.beginPath(); c.moveTo(ax,ly - 16); c.lineTo(ax,ly - 56); c.stroke(); c.strokeStyle = '#C97B4A'; c.lineWidth = 5; c.stroke();
    c.beginPath(); c.moveTo(ax - 24,ly - 108); c.lineTo(ax + 24,ly - 108); c.lineTo(ax + 40,ly - 52); c.lineTo(ax - 40,ly - 52); c.closePath(); fs(c,'#FFD68A',3);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(ax - 14,ly - 104); c.lineTo(ax - 4,ly - 104); c.lineTo(ax - 12,ly - 56); c.lineTo(ax - 28,ly - 56); c.closePath(); c.fill();
    const gx = nx + 26;
    c.strokeStyle = '#3F8454'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(gx,ly - 8); c.quadraticCurveTo(gx - 4,ly - 30,gx + 2,ly - 50); c.stroke();
    c.fillStyle = 'rgba(214,236,244,.6)'; rr(c,gx - 12,ly - 34,24,30,5); c.fill(); c.fillStyle = 'rgba(150,200,225,.55)'; c.fillRect(gx - 10,ly - 22,20,16);
    rr(c,gx - 12,ly - 34,24,30,5); c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.stroke();
    abFlor(c,gx + 2,ly - 56,8.5);
    // a cama: a cabeceira, os travesseiros altos, o lençol e a colcha de retalhos rosa
    c.beginPath(); c.moveTo(506,470); c.lineTo(506,286); c.quadraticCurveTo(640,196,774,286); c.lineTo(774,470); c.closePath(); fs(c,'#B5733A',4);
    c.beginPath(); c.moveTo(526,460); c.lineTo(526,296); c.quadraticCurveTo(640,222,754,296); c.lineTo(754,460); c.closePath(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2.5; c.stroke();
    rr(c,540,282,200,96,30); fs(c,'#FFFDF7',3.5); rr(c,528,330,224,112,34); fs(c,'#FFFDF7',3.5);
    c.strokeStyle = 'rgba(150,170,210,.5)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(560,350); c.quadraticCurveTo(580,380,566,420); c.moveTo(720,350); c.quadraticCurveTo(700,380,714,420); c.stroke();
    if (o.rosa) o.rosa(c);   // a Rosa, recostada, por trás do lençol e da colcha
    const cy = Q.colcha;
    c.beginPath(); c.moveTo(462,cy + 4); c.quadraticCurveTo(640,cy - 16,826,cy + 4); c.lineTo(868,700); c.lineTo(416,700); c.closePath(); c.fillStyle = '#EFA3B5'; c.fill();
    c.save(); c.clip();
    const cores = ['#E88AA2','#F6C9D4','#C8506A','#F2B8C6','#FBE3EA','#D9708C'];
    for (let j = 0; j < 6; j++) for (let i = 0; i < 10; i++){ c.fillStyle = cores[(i * 3 + j * 5) % 6]; c.fillRect(420 + i * 46 + (j % 2) * 20,cy - 4 + j * 44,44,42); if ((i + j) % 4 === 0){ c.fillStyle = 'rgba(255,255,255,.55)'; circ(c,442 + i * 46 + (j % 2) * 20,cy + 17 + j * 44,6); c.fill(); } }
    c.strokeStyle = 'rgba(122,46,58,.35)'; c.lineWidth = 2; c.setLineDash([6,5]); c.beginPath(); for (let j = 1; j < 6; j++){ c.moveTo(416,cy - 5 + j * 44); c.lineTo(870,cy - 5 + j * 44); } c.stroke(); c.setLineDash([]);
    c.restore();
    c.beginPath(); c.moveTo(462,cy + 4); c.quadraticCurveTo(640,cy - 16,826,cy + 4); c.lineTo(868,700); c.lineTo(416,700); c.closePath(); c.strokeStyle = PAL.tinta; c.lineWidth = 3.5; c.stroke();
    c.beginPath(); c.moveTo(460,cy + 6); c.quadraticCurveTo(640,cy - 16,828,cy + 6); c.lineTo(830,cy + 24); c.quadraticCurveTo(640,cy + 2,458,cy + 24); c.closePath(); fs(c,'#FFFDF7',3);   // a dobra do lençol
    // a cadeirinha da Bia
    const bx = Q.bia[0], by = Q.bia[1];
    c.strokeStyle = PAL.tinta; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx - 36,by + 8); c.lineTo(bx - 38,by - 96); c.moveTo(bx + 36,by + 8); c.lineTo(bx + 38,by - 96); c.moveTo(bx - 34,by + 12); c.lineTo(bx - 38,560); c.moveTo(bx + 34,by + 12); c.lineTo(bx + 38,560); c.stroke();
    c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 6.5; c.stroke();
    rr(c,bx - 44,by - 104,88,18,6); fs(c,PAL.madeira,3); rr(c,bx - 42,by - 70,84,12,5); fs(c,PAL.madeira,3);
    rr(c,bx - 46,by,92,15,5); fs(c,PAL.madeira,3.5);
    if (o.gente) o.gente(c);
  });
  ab2Camada(c,cam,1.2,() => {   // a grade do pé da cama, escura, embaixo
    c.strokeStyle = '#231B26'; c.lineCap = 'round'; c.lineWidth = 20; c.beginPath(); c.moveTo(330,700); c.lineTo(330,548); c.quadraticCurveTo(620,500,910,548); c.lineTo(910,700); c.stroke();
    c.lineWidth = 11; c.beginPath(); for (let x = 400; x < 880; x += 70){ c.moveTo(x,538); c.lineTo(x,700); } c.stroke();
    circ(c,330,538,17); c.fillStyle = '#231B26'; c.fill(); circ(c,910,538,17); c.fill();
  });
  // a noite, azul; por cima, a luz âmbar do abajur
  c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(104,120,178,.46)'; c.fillRect(0,0,TW,H); c.restore();
  ab2Camada(c,cam,1,() => { c.save(); c.globalCompositeOperation = 'screen'; const ax = Q.criado[0] + 84, tr = T > 0 ? Math.sin(T * 2.3) * 0.02 : 0; ab2Luz(c,ax,ly - 70,560,'255,176,96',0.5 + tr); ab2Luz(c,ax,ly - 80,120,'255,226,170',0.7 + tr); ab2Luz(c,560,340,300,'255,206,160',0.16); c.restore(); });
  ab2Clima(c,'58,63,110',0.06);
  ab2Vinheta(c,0.58);
}

/* ---------- o cenário "banco", por dentro (cena 10) ---------- */
const AB2_BCO = { balcao:330, papel:[640,336], gerente:[640,424] };
/* o banco. o: { T, gerente(c): atrás do balcão e da grade, papel(c): em cima da prancheta do balcão, gente(c): diante do balcão } */
function ab2Banco(c,cam,o){
  o = o || {};
  const T = o.T || 0, B = AB2_BCO, by = B.balcao, Y = AB2.chao;
  ab2Camada(c,cam,0.85,() => {
    // a parede azul com frisos, o lambri de madeira, duas colunas, o relógio grande e o letreiro "Banco"
    const g = c.createLinearGradient(0,0,0,300); g.addColorStop(0,'#28335A'); g.addColorStop(1,'#34416C'); c.fillStyle = g; c.fillRect(0,0,TW,H);
    c.fillStyle = 'rgba(255,255,255,.045)'; for (let x = 6; x < TW; x += 40) c.fillRect(x,0,14,300);
    c.fillStyle = '#8A5226'; c.fillRect(0,300,TW,H - 300); c.fillStyle = '#C97B4A'; c.fillRect(0,296,TW,8);
    c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 2.5; c.beginPath(); for (let x = 20; x < TW; x += 118) c.rect(x,322,96,150); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.1)'; for (let x = 20; x < TW; x += 118) c.fillRect(x + 6,328,6,138);
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0,296); c.lineTo(TW,296); c.moveTo(0,304); c.lineTo(TW,304); c.stroke();
    [226,994].forEach(x => {
      const gc = c.createLinearGradient(x - 38,0,x + 38,0); gc.addColorStop(0,'#D9D2C2'); gc.addColorStop(0.4,'#F6F1E4'); gc.addColorStop(1,'#C9C1AE');
      c.fillStyle = gc; c.fillRect(x - 38,40,76,H); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.strokeRect(x - 38,40,76,H);
      c.strokeStyle = 'rgba(120,110,90,.35)'; c.lineWidth = 2; c.beginPath(); [-20,-4,12,26].forEach(d => { c.moveTo(x + d,64); c.lineTo(x + d,H); }); c.stroke();
      rr(c,x - 52,14,104,30,6); fs(c,'#EDE6D4',3); rr(c,x - 46,40,92,14,4); fs(c,AB_COR.ouro,2.5);
    });
    rr(c,486,20,248,62,10); fs(c,'#1B2340',3.5); rr(c,494,28,232,46,6); c.strokeStyle = AB_COR.ouro; c.lineWidth = 2.5; c.stroke();
    txt(c,'Banco',610,52,36,AB_COR.ouro,'center',FD);
    const rx = 392, ry = 170, a1 = -Math.PI / 2 + TAU * (10.2 / 12), a2 = -Math.PI / 2 + TAU * (12 / 60) + (T > 0 ? Math.floor(T) * TAU / 240 : 0);
    c.fillStyle = 'rgba(0,0,0,.25)'; circ(c,rx + 6,ry + 8,56); c.fill();
    circ(c,rx,ry,56); fs(c,AB_COR.ouro,4); circ(c,rx,ry,46); fs(c,'#FFFDF7',3);
    c.fillStyle = PAL.tinta; for (let i = 0; i < 12; i++){ const a = i * TAU / 12; circ(c,rx + Math.cos(a) * 38,ry + Math.sin(a) * 38,i % 3 ? 1.8 : 3.2); c.fill(); }
    c.strokeStyle = PAL.tinta; c.lineCap = 'round'; c.lineWidth = 6; c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx + Math.cos(a1) * 22,ry + Math.sin(a1) * 22); c.stroke();
    c.lineWidth = 4; c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx + Math.cos(a2) * 34,ry + Math.sin(a2) * 34); c.stroke(); circ(c,rx,ry,5); c.fillStyle = PAL.tinta; c.fill();
    // um quadro com o cifrão, do outro lado
    rr(c,792,116,104,128,5); fs(c,AB_COR.ouro,3.5); rr(c,802,126,84,108,3); fs(c,'#F6E7C1',2); txt(c,'R$',844,182,40,'#3E9B5A','center',FD);
    c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,610,120,420,'255,214,150',0.22); c.restore();
  });
  ab2Camada(c,cam,1,() => {
    ab2Piso(c,'#F1EEE6','#B4AFA6','#5A3A22');
    if (o.gerente) o.gerente(c);
    // o balcão alto de madeira
    ab2Sombra(c,630,Y - 2,400,16,0.45);
    rr(c,292,by + 10,676,Y - by - 14,6); fs(c,'#9A5C2A',4);
    for (let i = 0; i < 5; i++){ const x = 310 + i * 130; rr(c,x,by + 34,112,Y - by - 56,5); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2.5; c.stroke(); c.fillStyle = 'rgba(255,255,255,.1)'; c.fillRect(x + 7,by + 40,7,Y - by - 68); }
    rr(c,280,by - 4,700,20,6); fs(c,'#5A3A22',3.5); c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(290,by,680,4);
    // o guichê de grade dourada
    c.strokeStyle = PAL.tinta; c.lineWidth = 15; c.lineCap = 'butt'; c.beginPath(); c.moveTo(516,by - 4); c.lineTo(516,150); c.quadraticCurveTo(640,96,764,150); c.lineTo(764,by - 4); c.stroke();
    c.strokeStyle = AB_COR.ouro; c.lineWidth = 9; c.stroke();
    c.lineWidth = 6.5; c.strokeStyle = PAL.tinta; c.beginPath(); for (let x = 546; x < 760; x += 31){ c.moveTo(x,138); c.lineTo(x,by - 40); } c.moveTo(516,by - 40); c.lineTo(764,by - 40); c.moveTo(516,186); c.lineTo(764,186); c.stroke();
    c.lineWidth = 3; c.strokeStyle = AB_COR.ouro; c.stroke();
    // a prancheta inclinada, com o papel
    c.beginPath(); c.moveTo(542,by - 34); c.lineTo(738,by - 34); c.lineTo(760,by + 52); c.lineTo(520,by + 52); c.closePath(); fs(c,'#B5733A',3.5);
    if (o.papel) o.papel(c);
    // a luminária verde, a campainha e a plaquinha
    const lx = 372;
    rr(c,lx - 22,by - 12,44,9,4); fs(c,AB_COR.ouro,2.5); c.strokeStyle = PAL.tinta; c.lineWidth = 8; c.beginPath(); c.moveTo(lx,by - 12); c.lineTo(lx,by - 52); c.stroke(); c.strokeStyle = AB_COR.ouro; c.lineWidth = 4; c.stroke();
    c.beginPath(); c.moveTo(lx - 44,by - 50); c.quadraticCurveTo(lx,by - 96,lx + 44,by - 50); c.closePath(); fs(c,'#2E8B57',3);
    c.fillStyle = '#FFF2C2'; ell(c,lx,by - 49,36,5); c.fill();
    c.beginPath(); c.arc(884,by - 5,15,Math.PI,0); c.closePath(); fs(c,AB_COR.ouro,2.5); circ(c,884,by - 22,3.4); fs(c,AB_COR.ouro,1.8);
    rr(c,782,by - 30,88,26,4); fs(c,'#1B2340',2.5); txt(c,'Empréstimos',826,by - 17,11,AB_COR.ouro,'center',FB);
    if (o.gente) o.gente(c);
    c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,lx,by - 30,150,'255,236,170',0.5); ab2Luz(c,640,250,330,'255,220,160',0.2); c.restore();
  });
  ab2Camada(c,cam,1.2,() => {   // os pilaretes dourados da fila, com o cordão vermelho, embaixo
    c.strokeStyle = PAL.tinta; c.lineWidth = 15; c.lineCap = 'round'; c.beginPath(); c.moveTo(238,494); c.quadraticCurveTo(610,590,982,494); c.stroke(); c.strokeStyle = '#B5283A'; c.lineWidth = 9; c.stroke();
    [238,982].forEach(x => { rr(c,x - 9,486,18,200,5); fs(c,AB_COR.ouro,3.5); circ(c,x,478,15); fs(c,AB_COR.ouro,3.5); c.fillStyle = 'rgba(255,255,255,.5)'; circ(c,x - 5,473,4); c.fill(); });
  });
  ab2Clima(c,'242,165,58',0.05);
  ab2Vinheta(c,0.5);
}

/* ---------- o cenário "rua de casa, à noite" (cena 11) ---------- */
const AB2_CASA = { calcada:500, portao:{ x:445, y:215, w:330, h:285 }, estrela:[1010,70], letreiro:'Lanchonete Corre-Corre', noite:'#2A315A' };
// lá dentro da garagem: a lanchonete acesa, com o balcão e as mesinhas vermelhas
function ab2Garagem(c,T){
  const P = AB2_CASA.portao, yb = P.y + P.h;
  const g = c.createLinearGradient(0,P.y,0,yb); g.addColorStop(0,'#FFF0C2'); g.addColorStop(1,'#FFD98A'); c.fillStyle = g; c.fillRect(P.x,P.y,P.w,P.h);
  c.fillStyle = PAL.piso2; c.fillRect(P.x,yb - 56,P.w,56);
  c.fillStyle = PAL.piso1; for (let i = 0; i < 9; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) c.fillRect(P.x + i * 32,yb - 56 + j * 28,32,28);
  c.fillStyle = PAL.faixa; c.fillRect(P.x,P.y + 96,P.w,7);
  rr(c,P.x + 150,P.y + 104,118,82,5); fs(c,PAL.formica,3); rr(c,P.x + 142,P.y + 96,134,13,4); fs(c,PAL.cromo,2.5);   // o balcão
  c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(P.x + 158,P.y + 112,8,66);
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(P.x + 20,P.y + 30); c.lineTo(P.x + 20,P.y + 54); c.moveTo(P.x + 20,P.y + 54); c.stroke();
  c.beginPath(); c.moveTo(P.x + 4,P.y + 54); c.lineTo(P.x + 36,P.y + 54); c.lineTo(P.x + 28,P.y + 76); c.lineTo(P.x + 12,P.y + 76); c.closePath(); fs(c,PAL.mostarda,2.5);
  [P.x + 56,P.x + 118].forEach(x => {   // as mesinhas vermelhas e os banquinhos
    [-34,34].forEach(d => { c.strokeStyle = PAL.tinta; c.lineWidth = 4; c.beginPath(); c.moveTo(x + d,yb - 40); c.lineTo(x + d,yb - 16); c.stroke(); rr(c,x + d - 11,yb - 46,22,7,3); fs(c,PAL.alerta,2); });
    c.fillStyle = PAL.tinta; c.fillRect(x - 3,yb - 62,6,44); ell(c,x,yb - 64,30,9); fs(c,PAL.formica,2.4);
  });
}
/* a rua de casa, à noite. k: o portão aberto (0 a 1). o: { T, letras: o letreiro aceso, letra por letra (0 a 1), pisca: a estrela da Rosa (0 a 1), gente(c): as pessoas,
   desenhadas por cima da noite (pinte-as com ab2Noite);
   v11.17 (a cena 6 do final novo): dia (0 a 1: a rua de dia, sem noite, sem estrelas, com sol, roseiras e as pessoas sem ab2Noite), letreiro (o texto; padrão AB2_CASA.letreiro),
   dentro(c, T) (o que se vê dentro da garagem, no lugar do ab2Garagem) } */
function ab2Noite(cor,k){ return abMistura(cor,AB2_CASA.noite,k == null ? 0.42 : k); }
function ab2RuaCasa(c,cam,k,o){
  o = o || {};
  const T = o.T || 0, K = AB2_CASA, P = K.portao, Y = K.calcada, yb = P.y + P.h, ab = P.h * clamp(k,0,1), le = o.letras || 0, E = K.estrela;
  const dia = clamp(o.dia || 0,0,1), D = (n,d) => dia > 0 ? abMistura(n,d,dia) : n, letreiro = o.letreiro || K.letreiro;   // v11.17: dia 0 desenha como sempre
  const g = c.createLinearGradient(0,0,0,H * 0.9); g.addColorStop(0,D(AB_COR.noite,'#8EC9EC')); g.addColorStop(1,D(AB_COR.noite2,'#F7D9A8')); c.fillStyle = g; c.fillRect(0,0,TW,H);
  ab2Camada(c,cam,0.5,() => {   // muitas estrelas pequenas e a estrela da Rosa, maior (de dia: o sol baixo à esquerda e umas nuvens)
    if (dia > 0){
      ab2Luz(c,200,120,240,'255,236,170',0.85 * dia); circ(c,200,120,34 + (T > 0 ? Math.sin(T * 1.5) * 1.2 : 0)); c.fillStyle = 'rgba(255,241,176,' + dia.toFixed(3) + ')'; c.fill();
      c.fillStyle = 'rgba(255,255,255,' + (0.75 * dia).toFixed(3) + ')'; [[470,90,52,11],[540,76,32,9],[900,116,56,12],[960,102,34,9],[1120,70,40,10]].forEach(q => { ell(c,q[0],q[1],q[2],q[3]); c.fill(); });
    }
    if (dia < 1){
      if (dia > 0) c.globalAlpha = 1 - dia;
      c.fillStyle = 'rgba(255,255,255,.85)';
      for (let i = 0; i < 46; i++){ const x = (i * 197) % 1240 - 10, y = (i * 83) % 250 + 6; circ(c,x,y,(1 + (i % 3) * 0.5) * (T > 0 ? 1 + Math.sin(T * 2.2 + i * 1.7) * 0.3 : 1)); c.fill(); }
      ab2Estrela(c,E[0],E[1],(15 + (T > 0 ? Math.sin(T * 3) * 2 : 0)) * (1 + (o.pisca || 0) * 1.1),1 + (o.pisca || 0));
      if (dia > 0) c.globalAlpha = 1;
    }
  });
  ab2Camada(c,cam,0.75,() => {   // as casas vizinhas em silhueta, com janelinhas acesas (de dia, apagadas), e uma árvore
    [[-40,300,170,0],[150,330,150,1],[330,290,120,0],[880,310,150,1],[1040,280,130,0],[1160,330,140,1]].forEach(q => {
      c.fillStyle = D('#232B4E','#C9A9A0'); c.fillRect(q[0],q[1],q[2],400); c.beginPath(); c.moveTo(q[0] - 12,q[1] + 4); c.lineTo(q[0] + q[2] / 2,q[1] - 46); c.lineTo(q[0] + q[2] + 12,q[1] + 4); c.closePath(); c.fill();
      c.fillStyle = dia > 0 ? abMistura('#FFD68C','#8E8290',dia) : 'rgba(255,214,140,.85)'; [[0.22,36],[0.62,36],[0.4,96]].forEach((w,i) => { if ((i + q[3]) % 3) c.fillRect(q[0] + q[2] * w[0],q[1] + w[1],22,26); });
    });
    c.fillStyle = D('#1B2340','#6B4A34'); c.fillRect(246,360,14,160); if (dia > 0) c.fillStyle = abMistura('#1B2340','#4C9460',dia);
    [[254,330,54],[214,366,40],[294,362,42]].forEach(q => { circ(c,q[0],q[1],q[2]); c.fill(); });
  });
  ab2Camada(c,cam,1,() => {
    // a rua e a calçada
    c.fillStyle = D('#3A3F55','#6D6C75'); c.fillRect(-180,Y + 50,TW + 360,300); c.fillStyle = 'rgba(255,255,255,.2)'; for (let x = -160; x < TW + 160; x += 150) c.fillRect(x,Y + 86,80,7);
    c.fillStyle = D('#7C7F94','#CDC4B4'); c.fillRect(-180,Y,TW + 360,50); c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; c.beginPath(); for (let x = -160; x < TW + 160; x += 76){ c.moveTo(x,Y); c.lineTo(x - 16,Y + 50); } c.stroke();
    c.fillStyle = D('#9A9DB0','#E2DACB'); c.fillRect(-180,Y + 44,TW + 360,8); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(-180,Y); c.lineTo(TW + 180,Y); c.moveTo(-180,Y + 52); c.lineTo(TW + 180,Y + 52); c.stroke();
    // a casa da Rosa: a parede, o telhado vermelho, a janela e a porta da casa
    rr(c,296,150,628,Y - 150,4); fs(c,D('#8E86A0','#EBD9BC'),3.5);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; c.beginPath(); for (let y = 186; y < Y; y += 34){ c.moveTo(300,y); c.lineTo(920,y); } c.stroke();
    c.beginPath(); c.moveTo(262,162); c.lineTo(610,92); c.lineTo(958,162); c.closePath(); fs(c,D('#8E3A3F','#B5533A'),3.5);
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2.5; c.beginPath(); for (let i = 1; i < 4; i++){ const yy = 162 - i * 17.5, hw = 348 * (yy - 92) / 70; c.moveTo(610 - hw,yy); c.lineTo(610 + hw,yy); } c.stroke();
    rr(c,318,268,96,112,5); fs(c,D('#FFD98A','#BFE3F7'),3.5); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(366,268); c.lineTo(366,380); c.moveTo(318,324); c.lineTo(414,324); c.stroke();
    c.fillStyle = 'rgba(200,80,106,.75)'; c.beginPath(); c.moveTo(320,270); c.lineTo(362,270); c.quadraticCurveTo(348,318,320,344); c.closePath(); c.fill(); c.beginPath(); c.moveTo(412,270); c.lineTo(370,270); c.quadraticCurveTo(384,318,412,344); c.closePath(); c.fill();
    rr(c,310,380,112,11,4); fs(c,D('#C9C3D6','#F2EAD8'),2.5);
    rr(c,822,262,84,Y - 262,5); fs(c,'#6E4630',3.5); rr(c,834,276,60,86,4); c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2.5; c.stroke(); rr(c,834,376,60,106,4); c.stroke(); circ(c,832,390,5); fs(c,AB_COR.ouro,2);
    // a garagem: lá dentro, o portão de enrolar e o letreiro
    c.fillStyle = PAL.tinta; c.fillRect(P.x - 12,P.y - 12,P.w + 24,P.h + 12); c.fillStyle = D('#5D5870','#8C8698'); c.fillRect(P.x - 8,P.y - 8,P.w + 16,P.h + 8);
    c.save(); c.beginPath(); c.rect(P.x,P.y,P.w,P.h); c.clip(); c.fillStyle = '#20253F'; c.fillRect(P.x,P.y,P.w,P.h);
    if (ab > 0){ c.save(); c.beginPath(); c.rect(P.x,yb - ab,P.w,ab); c.clip(); (o.dentro || ab2Garagem)(c,T); c.restore(); }
    const ph = P.h - ab;
    if (ph > 1){
      c.fillStyle = '#A3A9B0'; c.fillRect(P.x,P.y,P.w,ph);
      c.strokeStyle = PAL.cromoEsc; c.lineWidth = 3; c.beginPath(); for (let y = P.y + ph - 6; y > P.y; y -= 22){ c.moveTo(P.x,y); c.lineTo(P.x + P.w,y); } c.stroke();
      c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(P.x + 12,P.y,10,ph);
      c.fillStyle = '#6B6B72'; c.fillRect(P.x,P.y + ph - 9,P.w,9); rr(c,P.x + P.w / 2 - 22,P.y + ph - 20,44,9,4); fs(c,'#3a3a3c',2.2);
      c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(P.x,P.y + ph); c.lineTo(P.x + P.w,P.y + ph); c.stroke();
    }
    c.restore();
    const lx = 610, ly = 181; let lw = 410;
    if (o.letreiro){ c.font = '29px ' + FD; lw = Math.max(260,c.measureText(letreiro).width + 70); }   // o letreiro dado leva uma placa do tamanho do texto
    rr(c,lx - lw / 2,ly - 26,lw,52,13); fs(c,PAL.tinta,3.5);
    c.font = '29px ' + FD; c.textAlign = 'left'; c.textBaseline = 'middle';
    const tw = c.measureText(letreiro).width, n = letreiro.length, lit = Math.round(le * n); let x = lx - tw / 2;
    for (let i = 0; i < n; i++){ const ch = letreiro[i]; c.fillStyle = i < lit ? PAL.mostarda : '#5b5446'; c.fillText(ch,x,ly + 1); x += c.measureText(ch).width; }
    if (lit > 0){ c.strokeStyle = 'rgba(242,179,61,' + (0.55 * le).toFixed(3) + ')'; c.lineWidth = 6; rr(c,lx - lw / 2 - 6,ly - 32,lw + 12,64,16); c.stroke(); }
    // os dois vasinhos e o poste
    if (dia > 0.5){   // v11.17: de dia, duas roseiras floridas, uma de cada lado do portão
      [P.x - 76,P.x + P.w + 76].forEach((rx,i) => abRoseira(c,rx,Y + 4,0.95,T + i * 2));
    } else [P.x - 24,P.x + P.w + 24].forEach(vx => { ab2Copa(c,[[vx,Y - 52,20,'#3E7A58'],[vx - 12,Y - 40,13,'#356B4C'],[vx + 13,Y - 42,13,'#356B4C']],2.5); abFlor(c,vx - 6,Y - 62,4.4); abFlor(c,vx + 10,Y - 50,4); c.beginPath(); c.moveTo(vx - 18,Y - 30); c.lineTo(vx + 18,Y - 30); c.lineTo(vx + 13,Y); c.lineTo(vx - 13,Y); c.closePath(); fs(c,'#B85A30',3); });
    ab2Lampiao(c,1040,Y + 2,dia < 0.5);
    if (ab > 0){ c.fillStyle = 'rgba(255,214,130,' + (0.5 * k * (1 - 0.6 * dia)).toFixed(3) + ')'; c.beginPath(); c.moveTo(P.x,yb); c.lineTo(P.x + P.w,yb); c.lineTo(P.x + P.w + 150 * k + 30,H + 60); c.lineTo(P.x - 150 * k - 30,H + 60); c.closePath(); c.fill(); }   // o leque dourado na calçada
  });
  // a noite por cima; depois, o que brilha: a garagem, o leque, o letreiro, o poste e a estrela
  if (dia < 1){ c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(96,108,170,' + ((0.42 - 0.2 * k) * (1 - dia)).toFixed(3) + ')'; c.fillRect(0,0,TW,H); c.restore(); }
  ab2Camada(c,cam,1,() => {
    if (dia < 1){
    c.save(); c.globalCompositeOperation = 'screen';
    if (k > 0){
      ab2Luz(c,P.x + P.w / 2,yb - ab / 2,300 + 160 * k,'255,206,120',0.55 * Math.min(1,k * 3));
      c.fillStyle = 'rgba(255,220,150,' + (0.5 * Math.min(1,k * 8)).toFixed(3) + ')'; c.fillRect(P.x - 6,yb - ab - 3,P.w + 12,7);
      const gl = c.createLinearGradient(0,yb,0,H + 40); gl.addColorStop(0,'rgba(255,206,120,' + (0.4 * k).toFixed(3) + ')'); gl.addColorStop(1,'rgba(255,206,120,0)');
      c.fillStyle = gl; c.beginPath(); c.moveTo(P.x,yb); c.lineTo(P.x + P.w,yb); c.lineTo(P.x + P.w + 150 * k + 30,H + 60); c.lineTo(P.x - 150 * k - 30,H + 60); c.closePath(); c.fill();
    }
    if (le > 0) ab2Luz(c,610,181,260,'242,179,61',0.4 * le);
    ab2Luz(c,1040,Y - 322,150,'255,226,150',0.6); ab2Luz(c,366,324,100,'255,214,140',0.3);
    c.restore();
    }   // de dia, nada brilha: só o que o dia mostra
    if (o.gente) o.gente(c);   // as pessoas por cima da noite e da luz (a cena já as pinta com as cores da noite): ficam em contraluz
  });
  if (dia < 1) ab2Camada(c,cam,0.5,() => ab2Estrela(c,E[0],E[1],(15 + (T > 0 ? Math.sin(T * 3) * 2 : 0)) * (1 + (o.pisca || 0) * 1.1),(0.8 + (o.pisca || 0)) * (1 - dia)));
  if (dia > 0) ab2Clima(c,'255,226,170',0.07 * dia); else ab2Clima(c,'42,49,90',0.05);
  ab2Vinheta(c,0.55 - 0.2 * dia);
}

const C_LACO = '#E26A2C';   // o laço do avental da Bia, de costas (PAL.alerta)
const AB2_BANCO = [620,470];   // o banquinho das cenas 7 e 8, no centro da cozinha ([x, y do assento])

/* ---------- enfeites das cenas ---------- */
// notinhas musicais subindo (a Rosa cantarola); a: a opacidade
function ab2Notinhas(c,x,y,T,a){
  if (a <= 0) return;
  for (let i = 0; i < 3; i++){
    const k = T > 0 ? ((T * 0.36 + i / 3) % 1) : (i + 1) / 4;
    const nx = x + k * 46 + Math.sin(k * 6 + i * 2) * 10, ny = y - k * 104, s = 1 + (i % 2) * 0.25;
    c.globalAlpha = a * Math.min(1,k * 5) * Math.min(1,(1 - k) * 2.5);
    c.strokeStyle = PAL.tinta; c.lineWidth = 6 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(nx + 7 * s,ny); c.lineTo(nx + 7 * s,ny - 24 * s); c.lineTo(nx + 17 * s,ny - 19 * s); c.stroke();
    c.strokeStyle = '#B03A5B'; c.lineWidth = 3 * s; c.stroke();
    ell(c,nx,ny,8 * s,6 * s); fs(c,'#B03A5B',2.4);
  }
  c.globalAlpha = 1;
}
// corações e estrelinhas subindo (a comida é carinho); a: a opacidade
function ab2Mimos(c,x,y,T,a){
  if (a <= 0) return;
  for (let i = 0; i < 6; i++){
    const k = T > 0 ? ((T * 0.34 + i / 6) % 1) : (i + 1) / 7;
    const mx = x + Math.sin(k * 5 + i * 1.7) * 26 + (i - 2.5) * 13, my = y - k * 118;
    c.globalAlpha = a * Math.min(1,k * 6) * Math.min(1,(1 - k) * 2.2);
    if (i % 2) star(c,mx,my,8 + (i % 3),AB_COR.ouro); else heart(c,mx,my,9 + (i % 3) * 1.5,'#E0559A');
  }
  c.globalAlpha = 1;
}

/* ---------- as 11 cenas: 1 e 2 na v11.12; 3, 4 e 5 na v11.13; 6, 7 e 8 na v11.14; 9, 10 e 11 na v11.15 ---------- */
const AB2_CENAS = {
  /* 1, a porta: a Bia criança espia de trás do batente; a Rosa mexe a panela e cantarola, vira o rosto, chama, e a Bia entra de braços abertos */
  porta(c,p,T,cam){
    const Z = AB2_COZ, P = Z.porta, sr = abEsc('rosa',AB2.k), rx = 565, ry = AB2.chao, rim = Z.molho;
    const virou = abSuave(abSeg(p,0.42,0.5)), chama = abSuave(abSeg(p,0.46,0.54)) * (1 - abSuave(abSeg(p,0.74,0.86))), entra = abSuave(abSeg(p,0.7,1));
    // a Bia: no corredor (menor, mais longe), sai de trás do batente e vem para a frente
    const fora = abSuave(abSeg(p,0.1,0.24)) * 9 + virou * 6, vem = abSuave(clamp(entra * 1.7,0,1));
    const bx = P.x + 8 + fora + (236 - P.x - 23) * entra, by = Z.rodape + (AB2.chao - Z.rodape) * vem;
    const sb = abEsc('biaCrianca',AB2.k * (0.86 + 0.14 * vem)), kb = sb * 0.74, pulinho = T > 0 ? Math.abs(Math.sin(T * 9)) * 7 * abSeg(p,0.46,0.52) * (1 - abSeg(p,0.6,0.7)) : 0;
    const bia = cc => ab2Vivo(cc,bx,by,T,1.3,() => abBiaCrianca(cc,bx,by,sb,entra > 0.02
      ? { t:T, andando:entra < 0.97, ph:T * 11, olha:1, bracoE:[[-20,-31 - entra * 3],[-27,-38 - entra * 5]], bracoD:[[20,-31 - entra * 3],[27,-38 - entra * 5]] }
      : { t:T, olha:1.2, bracoE:[[-14,-24],[-9,-30]] }),pulinho);
    const corte = P.x - 90 * abSuave(abSeg(entra,0.02,0.26));   // o batente esconde metade dela; quando ela sai, o recorte desliza e some
    // a Rosa: mexe a panela; quando vira, tira a colher e oferece
    const a = T > 0 ? T * 3.2 : 0.6, tira = abSuave(abSeg(p,0.5,0.66));
    const ponta = [Z.panela[0] + 2 + Math.cos(a) * 17 * (1 - tira),rim + 2 + Math.sin(a) * 3 * (1 - tira) - tira * 8];   // quando vira o rosto, para de mexer
    const mao = [ponta[0] - 34,ponta[1] - 16], ml = [(mao[0] - rx) / sr,(mao[1] - ry) / sr];
    const ace = T > 0 ? Math.sin(T * 8) * 2 : 0, bE = chama > 0.02 ? [[-19 - chama * 2,-28 - chama * 5],[-23 - chama * 4 + ace * chama,-26 - chama * 19]] : (entra > 0.3 ? [[-20,-26],[-26,-21]] : undefined);
    ab2Cozinha(c,cam,'tarde',{ T, banco:[446,470],
      atras: entra <= 0.02 ? bia : null,   // espiando: no corredor, recortada pelo vão da porta
      gente: cc => {
        if (entra <= 0.02){   // os dedinhos no batente
          const hy = by - 27 * kb; rr(cc,P.x - 9,hy - 9,15,20,6); fs(cc,SKINS[4],2.2);
          cc.strokeStyle = 'rgba(34,32,28,.5)'; cc.lineWidth = 1.5; cc.beginPath(); cc.moveTo(P.x - 7,hy - 2); cc.lineTo(P.x + 3,hy - 2); cc.moveTo(P.x - 7,hy + 4); cc.lineTo(P.x + 3,hy + 4); cc.stroke();
        }
        ab2Sombra(cc,rx - 14,ry + 3,82,13,0.42);
        ab2Vivo(cc,rx,ry,T,0,() => abRosa(cc,rx,ry,sr,{ t:T, olha:-1.8 * virou, bracoD:[[22,-25],ml], bracoE:bE }));
        abColher(cc,[mao[0] - 24,mao[1] - 12],ponta,mao.concat(SKINS[3]),3.6 * sr);
        ab2Notinhas(cc,rx + 46,ry - 236,T,1 - abSeg(p,0.36,0.44));
        if (entra > 0.02){ ab2Sombra(cc,bx - 8,by + 3,50,9,0.4 * vem); cc.save(); cc.beginPath(); cc.rect(corte,-200,TW + 400,H + 400); cc.clip(); bia(cc); cc.restore(); }   // entrando: na frente de tudo
      } });
    return { rosa:[rx,ry - AB_ALT.rosa * AB2.k - 8,-30], bia:[bx,by - 190] };
  },
  /* 2, o carinho: a Bia no banquinho; a Rosa sopra a colher e leva à boca dela; a Bia fecha os olhos, cora e sobem corações; o clique vira a foto */
  carinho(c,p,T,cam){
    const Z = AB2_COZ, sr = abEsc('rosa',AB2.k), rx = 770, ry = AB2.chao, rim = Z.molho;
    const sb = abEsc('biaCrianca',AB2.k), kb = sb * 0.74, bx0 = 590, by = 470;
    const k1 = abSuave(abSeg(p,0,0.11)), k2 = abSuave(abSeg(p,0.17,0.4)), k3 = abSuave(abSeg(p,0.54,0.8)), gostou = abSuave(abSeg(p,0.44,0.5));
    const bx = bx0 + k2 * 5 * (1 - gostou) + (T > 0 ? Math.sin(T * 4.2) * 3 * gostou : 0), boca = [bx + 3,by - 37 * kb];
    // a colher: sai da panela, a Rosa sopra perto do rosto, vai à boca da Bia e volta
    const L3 = (u,v,k) => [u[0] + (v[0] - u[0]) * k,u[1] + (v[1] - u[1]) * k];
    const tA = [Z.panela[0] - 6,rim + 2], tB = [rx - 72,ry - 36 * sr + 20], tC = [boca[0] + 12,boca[1] + 2], tD = [Z.panela[0] - 4,rim + 1];
    const ponta = L3(L3(L3(tA,tB,k1),tC,k2),tD,k3), vm = L3(L3(L3([42,-14],[32,22],k1),[48,-6],k2),[44,-10],k3);
    const mao = [ponta[0] + vm[0],ponta[1] + vm[1]], cabo = [ponta[0] + vm[0] * 1.42,ponta[1] + vm[1] * 1.42];
    const ml = [(mao[0] - rx) / sr,(mao[1] - ry) / sr], cot = [(-11 + ml[0]) / 2 - 2,(-30 + ml[1]) / 2 + 6];
    const ri = T > 0 ? Math.abs(Math.sin(T * 8.5)) * 5 * gostou * (1 - abSeg(p,0.74,0.84)) : 0;
    const sopra = abSeg(p,0.08,0.11) * (1 - abSeg(p,0.17,0.2));
    const foto = p >= 0.86;
    ab2Cozinha(c,cam,'tarde',{ T, banco:[bx0,by],
      gente: cc => {
        ab2Sombra(cc,rx - 14,ry + 3,82,13,0.42);
        ab2Vivo(cc,rx,ry,T,0,() => abRosa(cc,rx,ry,sr,{ t:T, olha:-1.6, bracoE:[cot,ml], bracoD:[[5,-21],[-8 - k2 * 4 * (1 - k3),-25]] }),ri);
        // a Bia, de pé no banquinho: abre a boca esperando, prova, fecha os olhos e leva as mãos ao rosto
        const fb = AB_VIVO.fala.bia, espera = abSeg(p,0.26,0.36) * (1 - abSeg(p,0.4,0.43));
        if (espera > 0) AB_VIVO.fala.bia = espera * 0.9;
        ab2Vivo(cc,bx,by,T,1.3,() => abBiaCrianca(cc,bx,by,sb,{ t:T, olha:gostou > 0.5 ? 0 : 1.4, fecha:gostou > 0.5,
          bracoE:gostou > 0.5 ? [[-16,-27],[-10,-35]] : [[-14,-24],[-8,-28 - k2 * 3]], bracoD:gostou > 0.5 ? [[16,-27],[10,-35]] : [[14,-24],[9,-28 - k2 * 3]] }));
        AB_VIVO.fala.bia = fb;
        if (gostou > 0){ cc.fillStyle = 'rgba(238,84,116,' + (0.42 * gostou).toFixed(3) + ')'; ell(cc,bx - 7.6 * kb,by - 37.4 * kb,2.9 * kb,2.1 * kb); cc.fill(); ell(cc,bx + 7.6 * kb,by - 37.4 * kb,2.9 * kb,2.1 * kb); cc.fill(); }
        abColher(cc,cabo,ponta,mao.concat(SKINS[3]),3.6 * sr,k3 < 0.4 ? AB_COR.molho : PAL.madeira);
        if (sopra > 0){   // o sopro
          cc.globalAlpha = sopra; cc.strokeStyle = 'rgba(255,255,255,.95)'; cc.lineWidth = 4; cc.lineCap = 'round';
          [-9,0,9].forEach((d,i) => { cc.beginPath(); cc.moveTo(rx - 34,ry - 36 * sr + d * 0.5 + 8); cc.lineTo(rx - 52 - i % 2 * 6,ry - 36 * sr + d + 13); cc.stroke(); });
          cc.globalAlpha = 1;
        }
        ab2Mimos(cc,bx + 6,by - 62 * kb,T,gostou * (foto ? 0.4 : 1));
      },
      frente: cc => {   // a frente do close: a jarra das colheres de pau, num canto, e uma tigela, no outro
        cc.fillStyle = 'rgba(52,34,22,.94)'; cc.strokeStyle = 'rgba(52,34,22,.94)';
        rr(cc,362,440,52,110,9); cc.fill();
        cc.lineWidth = 7; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(376,444); cc.lineTo(368,398); cc.moveTo(392,444); cc.lineTo(398,390); cc.stroke();
        ell(cc,367,392,8,12); cc.fill(); ell(cc,399,383,9,13); cc.fill();
        cc.beginPath(); cc.moveTo(906,462); cc.quadraticCurveTo(948,540,990,462); cc.closePath(); cc.fill();
      } });
    if (foto){   // o clique: o clarão, a cena escurece e a foto da Rosa aparece no centro, na moldura
      const k = abSuave(abSeg(p,0.86,0.9));
      c.fillStyle = 'rgba(16,14,12,.6)'; c.fillRect(0,0,TW,H);
      ab2Luz(c,TW / 2,H / 2,340,'242,194,61',0.6 * k);
      c.save(); c.translate(TW / 2,H / 2 + 8); c.rotate(4 * Math.PI / 180); const s = 300 / 42 * (0.86 + 0.14 * k); drawFotoRosa(c,0,0,s); c.restore();
      const cl = T > 0 ? 1 - abSeg(p,0.86,0.86 + 0.15 / 7) : 0;
      if (cl > 0){ c.fillStyle = 'rgba(255,255,255,' + cl.toFixed(3) + ')'; c.fillRect(0,0,TW,H); }
    }
    return { rosa:[rx,ry - AB_ALT.rosa * AB2.k - 8,0], bia:[bx,by - 190], foto };
  },
  /* 3, a Casa Aurora: a Rosa chega à porta, a Bia pula e acena; a porta dupla se abre, o Tonhão aparece de braços abertos, os dois se abraçam e entram */
  aurora(c,p,T,cam){
    const R = AB2_RUA, P = R.porta, Y = AB2.chao, sr = abEsc('rosa',AB2.k), sb = abEsc('biaCrianca',AB2.k), st0 = abEsc('tonhao',AB2.k);
    const anda = abSuave(abSeg(p,0.02,0.33)), tras = abSeg(p,0.15,0.19) * (1 - abSeg(p,0.26,0.3)), ajeita = abSeg(p,0.34,0.37) * (1 - abSeg(p,0.4,0.43));
    const abre = abSuave(abSeg(p,0.41,0.48)), sai = abSuave(abSeg(p,0.5,0.64)), abraco = abSuave(abSeg(p,0.7,0.8)), entra = abSuave(abSeg(p,0.86,0.99));
    const cx = P.x + P.w / 2;
    // a Rosa: vestido rosa, bolsa a tiracolo, a flor no cabelo
    const rx = 424 + anda * (640 - 424) + abraco * 46 + entra * (cx - 28 - 686), ry = Y - entra * 30, andando = (anda > 0 && anda < 1) || (abraco > 0 && abraco < 1) || (entra > 0 && entra < 1);
    const rosa = cc => {
      const fundo = T > 0 ? Math.sin(abSeg(p,0.33,0.4) * Math.PI) * 0.035 : 0;   // respira fundo
      cc.save(); cc.translate(rx,ry); cc.scale(1 - entra * 0.14,(1 - entra * 0.14) * (1 + fundo)); cc.translate(-rx,-ry);
      ab2Vivo(cc,rx,ry,T,0,() => abRosa(cc,rx,ry,sr,{ roupa:AB_COR.rosa, avental:false, t:T, andando, ph:T * 9, olha:tras > 0.3 ? -1.8 : (abraco > 0 ? 1.4 : 1.2),
        bracoE:tras > 0.05 ? [[-19,-34 - tras * 3],[-23 + (T > 0 ? Math.sin(T * 9) * 2 : 0),-30 - tras * 17]] : (abraco > 0.05 ? [[-17,-26],[-9,-30]] : undefined),
        bracoD:ajeita > 0.05 ? [[18,-36 - ajeita * 6],[15.5 - ajeita * 3,-30 - ajeita * 19]] : (abraco > 0.05 ? [[19,-31 - abraco * 3],[25,-36 - abraco * 5]] : undefined) }));
      // a bolsa a tiracolo
      const u = q => [rx + q[0] * sr,ry + q[1] * sr];
      cc.strokeStyle = PAL.tinta; cc.lineWidth = 6; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo.apply(cc,u([-9,-31])); cc.lineTo.apply(cc,u([11,-15])); cc.stroke(); cc.strokeStyle = '#8A5226'; cc.lineWidth = 3; cc.stroke();
      const bq = u([6,-16]); rr(cc,bq[0],bq[1],9 * sr,7.5 * sr,6); fs(cc,PAL.madeira,3); cc.fillStyle = AB_COR.ouro; circ(cc,bq[0] + 4.5 * sr,bq[1] + 2.4 * sr,3.4); cc.fill();
      cc.restore();
    };
    // a Bia criança, à esquerda, pula e acena
    const bx = 262, pulo = T > 0 ? Math.abs(Math.sin(T * 6.5)) * (p < 0.34 ? 15 : 7) : 0;
    // o Tonhão: aparece na porta de braços abertos, sai para a calçada, abraça e entra junto
    const tk = 0.86 + 0.14 * sai - entra * 0.12, st = st0 * tk, tx = cx - sai * 6 - abraco * 18 + entra * 30, ty = Y - 36 + sai * 36 - entra * 30;
    const ab = abSuave(abSeg(p,0.44,0.52)), bal = T > 0 ? Math.sin(T * 5) * 2 : 0;
    const tonhao = cc => {
      abTonhao(cc,tx,ty,st,{ t:T, olha:-1, andando:(sai > 0 && sai < 1) || (entra > 0 && entra < 1), ph:T * 9, bracoE:abraco > 0.4 ? [[-12,-62]] : [[-32 - ab * 6,-74 - ab * 10],[-42 - ab * 6,-86 - ab * 14 + bal]],
        bracoD:abraco > 0.3 ? [[30,-66],[24,-56]] : [[32 + ab * 6,-74 - ab * 10],[42 + ab * 6,-86 - ab * 14 - bal]] });
    };
    const fora = sai > 0.02 && entra < 0.5;
    ab2RuaAurora(c,cam,'manha',{ T, abre, voo:abSeg(p,0.76,1),
      dentro: abre > 0.05 && !fora ? cc => { cc.globalAlpha = 1 - abSeg(entra,0.6,1); tonhao(cc); if (entra >= 0.5) rosa(cc); cc.globalAlpha = 1; } : null,
      gente: cc => {
        ab2Sombra(cc,bx + 26,Y + 4,62,9,0.3);
        ab2Vivo(cc,bx,Y,T,1.3,() => abBiaCrianca(cc,bx,Y,sb,{ t:T, aceno:true, olha:1.2, bracoE:entra > 0.2 ? [[-19,-33],[-25,-43 + (T > 0 ? Math.sin(T * 9) * 3 : 0)]] : undefined }),pulo);
        if (fora){ ab2Sombra(cc,tx + 34,ty + 4,96,12,0.3 * sai); tonhao(cc); }
        if (entra < 0.5){ ab2Sombra(cc,rx + 34,ry + 4,88,12,0.32); rosa(cc); }
        if (abraco > 0.4 && entra < 0.5){   // o braço do Tonhão por cima do ombro da Rosa, e um coração
          ab2BracoDe(cc,tx,ty,st,[[-19,-76],[-34,-64],[(rx - 34 - tx) / st,(ry - 31 * sr - ty) / st]]);
          cc.globalAlpha = abSeg(abraco,0.4,1) * (1 - abSeg(entra,0,0.4)); heart(cc,(rx + tx) / 2,ry - 300 - (T > 0 ? Math.sin(T * 3) * 6 : 0),15,'#E0559A'); cc.globalAlpha = 1;
        }
      } });
    return { bia:[bx,Y - AB_ALT.biaCrianca * AB2.k - 10 - pulo * 0.5,10], tonhao:[tx + 13 * st,ty - 128 * st,196], rosa:[rx,ry - AB_ALT.rosa * AB2.k - 8] };
  },
  /* 4, o molho: o Tonhão polvilha o cominho, prova e acha que falta algo; a Rosa cobre a panela com o corpo, sobe o brilho rosado (a pétala não aparece), ele prova de novo e arregala os olhos */
  molho(c,p,T,cam){
    const A = AB2_AUR, Y = AB2.chao, sr = abEsc('rosa',AB2.k), st = abEsc('tonhao',AB2.k), tx = 492, px = A.panela[0], rim = A.panela[1] - 53;
    const brilho = abSuave(abSeg(p,0.48,0.56)) * (1 - 0.4 * abSuave(abSeg(p,0.64,0.9)));
    // o Tonhão: a mão da frente polvilha, leva a colher à boca, descansa, prova de novo
    const Hm = ab2Chave([[0.08,[26,-46]],[0.13,[44,-70]],[0.2,[44,-70]],[0.25,[11,-83]],[0.31,[11,-83]],[0.38,[27,-48]],[0.55,[27,-48]],[0.6,[11,-83]],[0.68,[11,-83]],[0.76,[30,-58]],[1,[30,-58]]],p);
    const polvilha = abSeg(p,0.12,0.14) * (1 - abSeg(p,0.2,0.22)), prova = Math.max(abSeg(p,0.22,0.25) * (1 - abSeg(p,0.32,0.36)),abSeg(p,0.57,0.6) * (1 - abSeg(p,0.7,0.76)));
    const falta = abSeg(p,0.27,0.3) * (1 - abSeg(p,0.5,0.56)), nao = T > 0 ? Math.sin(T * 11) * 1.3 * abSeg(p,0.27,0.3) * (1 - abSeg(p,0.37,0.4)) : 0, espanto = abSeg(p,0.61,0.65);
    const cot = [(19 + Hm[0]) / 2 + 7,(-76 + Hm[1]) / 2 + 5];
    // a Rosa: olha para os dois lados, vai para a frente da panela, vira de costas; depois volta, pisca um olho e põe o dedo nos lábios
    const frente = abSuave(abSeg(p,0.42,0.47)) * (1 - abSuave(abSeg(p,0.57,0.62))), rx = 792 - frente * 136, costas = p > 0.445 && p < 0.59;
    const lados = p > 0.35 && p < 0.425 ? (p < 0.385 ? -1.9 : 1.9) : 0, segredo = abSuave(abSeg(p,0.64,0.7)), pisca = segredo > 0.5 && (T <= 0 || (T * 0.9) % 1 < 0.6);
    ab2CozinhaAurora(c,cam,{ T, brilho, gente: cc => {
      ab2Sombra(cc,tx - 10,Y + 4,100,13,0.4);
      abTonhao(cc,tx,Y,st,{ t:T, olha:espanto > 0.5 ? 1 : nao, mood:falta > 0.5 ? 2 : 0, bracoE:[[-12,-62]], bracoD:[cot,Hm] });
      // o pote de cominho na outra mão
      ab2BracoDe(cc,tx,Y,st,[[-19,-76],[-31,-60],[-15,-50]],'#fff','#B9794B',k => ab2Pote(k,-13,-49,1,'cominho','#9A6A3A'));
      if (prova > 0.05){   // a colherzinha
        cc.save(); cc.translate(tx,Y); cc.scale(st,st); cc.lineCap = 'round';
        cc.strokeStyle = PAL.tinta; cc.lineWidth = 3.4; cc.beginPath(); cc.moveTo(Hm[0] + 7,Hm[1] + 5); cc.lineTo(Hm[0] - 7,Hm[1] - 4); cc.stroke(); cc.strokeStyle = PAL.cromo; cc.lineWidth = 1.8; cc.stroke();
        ell(cc,Hm[0] - 8,Hm[1] - 4.5,3.6,2.4); fs(cc,brilho > 0.3 ? '#E8557A' : AB_COR.molho,1.2);
        cc.restore();
      }
      if (polvilha > 0.05){   // o cominho caindo
        const hx = tx + Hm[0] * st, hy = Y + Hm[1] * st;
        cc.fillStyle = '#8A5A2E'; for (let i = 0; i < 9; i++){ const k = T > 0 ? ((T * 1.6 + i * 0.23) % 1) : i / 9; cc.globalAlpha = polvilha * (1 - k * 0.5); circ(cc,hx + 6 + Math.sin(i * 2.4) * 16,hy + 14 + k * (rim - hy - 16),2.6); cc.fill(); }
        cc.globalAlpha = 1;
      }
      if (espanto > 0.5){   // os olhos arregalados
        cc.save(); cc.translate(tx + 3 * st,Y); cc.scale(st,st);
        [-5.5,5.5].forEach(d => { circ(cc,d,-101,4.3); fs(cc,'#fff',1.4); circ(cc,d + 1,-101,1.9); cc.fillStyle = PAL.tinta; cc.fill(); });
        cc.strokeStyle = PAL.tinta; cc.lineWidth = 2; cc.beginPath(); cc.moveTo(-9.5,-108.5); cc.lineTo(-2,-109.5); cc.moveTo(9.5,-108.5); cc.lineTo(2,-109.5); cc.stroke();
        cc.restore();
      }
      ab2Sombra(cc,rx - 10,Y + 4,84,13,0.4);
      ab2Vivo(cc,rx,Y,T,0,() => abRosa(cc,rx,Y,sr,{ roupa:'#fff', avental:costas ? false : '#E9E4D8', t:T, costas, olha:lados || (segredo > 0.3 ? -1.2 : -0.8), andando:frente > 0.02 && frente < 0.98, ph:T * 10,
        bracoD:segredo > 0.05 ? [[14 - segredo * 2,-27 - segredo * 2],[15.5 - segredo * 13,-17 - segredo * 17.5]] : undefined }));
      if (costas){ cc.strokeStyle = 'rgba(34,32,28,.3)'; cc.lineWidth = 3; cc.beginPath(); cc.moveTo(rx,Y - 31 * sr); cc.lineTo(rx,Y - 13 * sr); cc.stroke(); rr(cc,rx - 9 * sr,Y - 21 * sr,18 * sr,2.2 * sr,3); fs(cc,'#E9E4D8',2); }   // o laço do avental, nas costas
      if (segredo > 0.6){   // a mão e o dedo nos lábios, e a piscadela
        const fx = rx + (0.6 - 3) * sr, my = Y - 33.4 * sr;
        cc.strokeStyle = PAL.tinta; cc.lineWidth = 9; cc.lineCap = 'round'; cc.beginPath(); cc.moveTo(fx,my); cc.lineTo(fx,my - 5.6 * sr); cc.stroke(); cc.strokeStyle = SKINS[3]; cc.lineWidth = 5; cc.stroke();
        circ(cc,fx + 1.2 * sr,my + 1.6 * sr,3.4 * sr); fs(cc,SKINS[3],4);
        if (pisca){ const ex = rx + (4.2 - 3) * sr, ey = Y - 41.5 * sr; cc.fillStyle = SKINS[3]; circ(cc,ex,ey,2.3 * sr); cc.fill(); cc.fillStyle = PAL.tinta; cc.fillRect(ex - 2.2 * sr,ey - 0.3 * sr,4.4 * sr,1.7 * sr); }
      }
    } });
    return { tonhao:[tx,Y - 108 * st,-36], rosa:[rx,Y - AB_ALT.rosa * AB2.k - 8] };
  },
  /* 5, a estrela: o Bráulio ergue a placa do Michelzão sob o holofote; a câmera desliza até a porta da cozinha, onde o Tonhão fecha o punho e a Rosa segura o braço dele */
  estrela(c,p,T,cam){
    const G = AB2_GALA, sbr = abEsc('braulio',AB2.k), bx = 470, by = G.palco, sr = abEsc('rosa',AB2.k * 0.94), st = abEsc('tonhao',AB2.k * 0.94);
    const up = abSuave(abSeg(p,0.04,0.2)), peito = up * (T > 0 ? 1 + Math.sin(T * 2.4) * 0.3 : 1);
    const passo = abSuave(abSeg(p,0.5,0.66)), punho = abSuave(abSeg(p,0.46,0.6)), segura = abSuave(abSeg(p,0.6,0.74)), baixa = segura > 0.7;
    const tx = 1030 - passo * 22, ty = G.chao + 2, rx = 1100 - segura * 8, ry = G.chao + 2;
    const plc = abLerp([bx + 6,by - 62 * sbr],[bx + 118,by - 128 * sbr],up), rot = -0.05 + up * 0.17;
    ab2Gala(c,cam,{ T, foco:1,
      palco: cc => {
        if (up > 0.5){   // o brilho girando atrás da placa
          cc.save(); cc.translate(plc[0],plc[1]); cc.rotate(T > 0 ? T * 0.6 : 0.3); cc.globalCompositeOperation = 'screen';
          cc.fillStyle = 'rgba(242,194,61,' + (0.34 * abSeg(up,0.5,1)).toFixed(3) + ')'; for (let i = 0; i < 8; i++){ cc.rotate(TAU / 8); cc.beginPath(); cc.moveTo(0,0); cc.lineTo(-22,-190); cc.lineTo(22,-190); cc.closePath(); cc.fill(); }
          cc.restore();
        }
        ab2Sombra(cc,bx,by + 4,104,11,0.5);
        cc.save(); cc.translate(bx,by); cc.scale(1 + peito * 0.05,1 + peito * 0.012); cc.translate(-bx,-by);
        abBraulio(cc,bx,by,sbr,{ semPlaca:true });
        ab2BracoDe(cc,bx,by,sbr,[[-18,-78],abLerp([-24,-66],[-31,-62],up),abLerp([-10,-58],[-21,-47],up)],'#fff','#F2C9A5');                 // a outra mão vai para a cintura
        cc.restore();
        abPlacaMichel(cc,plc[0],plc[1],158,100,1,rot,true,T > 0 ? Math.max(0,Math.sin(T * 3)) * up : up * 0.6);
        ab2BracoDe(cc,bx,by,sbr,[[18,-78],abLerp([24,-64],[34,-84],up),[(plc[0] - 44 - bx) / sbr,(plc[1] + 40 - by) / sbr]],'#fff','#F2C9A5');   // o braço que ergue a placa
      },
      porta: cc => {
        abTonhao(cc,tx,ty,st,{ t:T, mood:2, olha:-1, andando:passo > 0.02 && passo < 0.98, ph:T * 8, bracoD:[[28 + punho * 4,-62 - punho * 6],[25 + punho * 9,-46 - punho * 30]] });
        ab2Vivo(cc,rx,ry,T,0,() => abRosa(cc,rx,ry,sr,{ roupa:'#fff', avental:'#E9E4D8', t:T, mood:segura > 0.5 ? 3 : 1, fecha:baixa, olha:-1.4, bracoE:segura > 0.05 ? [[-16 - segura * 2,-29],[-15.5 - segura * 1.5,-17 - segura * 13]] : undefined }));
      } });
    return { braulio:[bx,by - 118 * sbr,-70], tonhao:[tx,ty - 118 * st], rosa:[rx,ry - 66 * sr] };
    },
  /* 6, a despedida: o close nas mãos dadas sobe para os rostos; a Rosa põe o caderno nas mãos da Bia, que o abraça e promete; a Rosa passa a mão no rosto dela */
  despedida(c,p,T,cam){
    const Q = AB2_QTO, sr = abEsc('rosa',AB2.k), rx = Q.rosa[0], ry = Q.rosa[1], sb = abEsc('biaCrianca',AB2.k), kb = sb * 0.74, bx0 = Q.bia[0], by = Q.bia[1];
    const afago = abSuave(abSeg(p,0.75,0.86)), abraca = abSuave(abSeg(p,0.5,0.6)), bx = bx0 + afago * 4;
    const RL = q => [(q[0] - rx) / sr,(q[1] - ry) / sr], BL = q => [(q[0] - bx) / kb,(q[1] - by) / kb - 12];   // da cena para as medidas de cada uma (a Bia, sentada)
    const cot = (a,b,dy) => [(a[0] + b[0]) / 2,(a[1] + b[1]) / 2 + (dy || 4)];
    // as mãos da Rosa: a esquerda dá a mão, recebe o caderno, entrega, descansa e afaga; a direita busca o caderno no criado-mudo
    const mE = ab2Chave([[0.22,[552,426]],[0.3,[628,420]],[0.4,[530,424]],[0.5,[570,438]],[0.75,[570,438]],[0.86,[bx + 44,by - 78]],[1,[bx + 44,by - 78]]],p);
    const mD = ab2Chave([[0.1,[694,436]],[0.2,[768,408]],[0.3,[656,418]],[0.38,[694,436]],[1,[694,436]]],p);
    const eL = RL(mE), dL = RL(mD), vai = T > 0 && afago > 0.9 ? Math.sin(T * 3) * 0.6 : 0;
    // o caderno: no criado-mudo, na mão direita, na esquerda, nas mãos da Bia, no peito dela
    const cad = p < 0.2 ? [790,404,0.6,-0.12] : p < 0.3 ? [mD[0] - 16,mD[1] - 14,0.6,-0.2] : p < 0.4 ? [mE[0] - 14,mE[1] - 14,0.62,-0.1]
      : ab2Chave([[0.4,[516,410,0.62,-0.1]],[0.48,[500,418,0.64,-0.06]],[0.6,[bx + 2,by - 34,0.66,0.05]],[1,[bx + 2,by - 34,0.66,0.05]]],p);
    // as mãos da Bia: dá a mão, recebe o caderno com as duas, abraça
    const bD = p < 0.24 ? BL([544,428]) : ab2Chave([[0.24,BL([544,428])],[0.4,BL([510,428])],[0.5,BL([498,432])],[0.6,[-5,-23]],[1,[-5,-23]]],p);
    const bE = ab2Chave([[0.3,[-15.5,-17]],[0.42,BL([474,430])],[0.5,BL([474,432])],[0.6,[5,-21]],[1,[5,-21]]],p);
    ab2Quarto(c,cam,{ T,
      rosa: cc => {
        cc.save(); cc.beginPath(); cc.rect(-200,-200,TW + 400,Q.colcha + 206); cc.clip();
        ab2Vivo(cc,rx,ry,T,0,() => abRosa(cc,rx,ry,sr,{ roupa:'#E6DFF2', avental:false, semFlor:true, t:T, olha:-1.5, fecha:afago > 0.6,
          bracoE:[cot([-11,-30],eL,5),[eL[0] + vai,eL[1]]], bracoD:[cot([11,-30],dL,6),dL] }));
        cc.restore();
      },
      gente: cc => {
        const aqui = p >= 0.2;   // o caderno: no criado-mudo, atrás da Bia; depois, por cima dela
        if (!aqui) ab2Caderno(cc,cad[0],cad[1],sr * cad[2] / 2.4,cad[3]);
        ab2Vivo(cc,bx,by,T,1.3,() => abBiaCrianca(cc,bx,by,sb,{ sentada:true, t:T, olha:1.5, mood:p < 0.56 ? 3 : 0, fecha:afago > 0.75,
          bracoD:p < 0.6 || abraca < 1 ? [cot([11,-30],bD,3),bD] : [[13,-24],bD], bracoE:p > 0.32 ? (abraca < 1 ? [cot([-11,-30],bE,3),bE] : [[-13,-24],bE]) : undefined }));
        if (aqui) ab2Caderno(cc,cad[0],cad[1],sr * cad[2] / 2.4,cad[3]);
        if (p >= 0.44){   // as mãozinhas por cima do caderno
          circ(cc,bx + bD[0] * kb,by + (bD[1] + 12) * kb,3.6 * kb); fs(cc,SKINS[4],3); circ(cc,bx + bE[0] * kb,by + (bE[1] + 12) * kb,3.6 * kb); fs(cc,SKINS[4],3);
        }
        if (p >= 0.2 && p < 0.3){ circ(cc,mD[0],mD[1],3.6 * sr); fs(cc,SKINS[3],3.4); }
        if (p >= 0.3 && p < 0.4){ circ(cc,mE[0],mE[1],3.6 * sr); fs(cc,SKINS[3],3.4); }
        if (p < 0.24){   // as mãos dadas: a da Rosa por cima da da Bia
          circ(cc,mE[0],mE[1],3.6 * sr); fs(cc,SKINS[3],3.4);
          cc.strokeStyle = 'rgba(34,32,28,.5)'; cc.lineWidth = 2; cc.beginPath(); cc.moveTo(mE[0] - 10,mE[1] - 4); cc.lineTo(mE[0] + 4,mE[1] - 6); cc.moveTo(mE[0] - 10,mE[1] + 3); cc.lineTo(mE[0] + 4,mE[1] + 1); cc.stroke();
        }
        if (afago > 0.5){ circ(cc,mE[0] + vai * sr,mE[1],3.6 * sr); fs(cc,SKINS[3],3.4); }   // a mão no rosto da Bia
      } });
    const sai = T > 0 ? abSeg(p,1 - 0.8 / 7,1) : 0;   // o escuro da saída dura 0,8 s
    if (sai > 0){ c.fillStyle = 'rgba(16,14,12,' + sai.toFixed(3) + ')'; c.fillRect(0,0,TW,H); }
    return { rosa:[rx + 10,ry - 52.5 * sr,70], bia:[bx,by - (59 - 12) * kb - 6,-20] };
  },
  /* 7, a janela: a cozinha de casa à noite, vazia; a chuva para, as nuvens abrem, uma estrela acende e o facho desce até a foto; a Bia entra, sobe no banquinho e olha a estrela */
  janela(c,p,T,cam){
    const Z = AB2_COZ, P = Z.porta, sb0 = abEsc('biaCrianca',AB2.k);
    const chuva = 1 - abSuave(abSeg(p,0.4,0.5)), nuvens = 1 - abSuave(abSeg(p,0.42,0.55)), estrela = abSuave(abSeg(p,0.55,0.62)), facho = abSuave(abSeg(p,0.58,0.7));
    const anda = abSeg(p,0.65,0.88), vem = abSuave(clamp(anda * 4,0,1)), sobe = abSuave(abSeg(p,0.88,0.96));
    const bx = 152 + (548 - 152) * anda + sobe * (AB2_BANCO[0] - 548), by = Z.rodape + 6 + (AB2.chao - Z.rodape - 6) * vem - sobe * (AB2.chao - AB2_BANCO[1]) - Math.sin(sobe * Math.PI) * 14;
    const sb = sb0 * (0.88 + 0.12 * vem), costas = sobe > 0.6;
    ab2Cozinha(c,cam,'noite',{ T, banco:AB2_BANCO, estado:{ chuva, nuvens, estrela, facho },
      gente: cc => {
        if (anda <= 0) return;
        ab2Sombra(cc,bx,(sobe > 0.5 ? AB2_BANCO[1] : by) + 3,46,8,0.35 * vem);
        ab2Vivo(cc,bx,by,T,1.3,() => abBiaCrianca(cc,bx,by,sb,costas ? { t:T, costas:true } : { t:T, olha:1.6, mood:1, andando:anda < 1 || (sobe > 0 && sobe < 1), ph:T * 9 }));
      } });
    return { bia:[bx,by - 190] };
  },
  /* 8, a promessa: o tempo passa (o céu vira dia e noite três vezes, as folhas do calendário caem, a planta cresce, a criança dá lugar à adulta); a Bia abre o caderno, olha a estrela e promete; a estrela pisca */
  promessa(c,p,T,cam){
    const Z = AB2_COZ, sb = abEsc('biaCrianca',AB2.k), sa = abEsc('bia',AB2.k), bx = AB2_BANCO[0], Y = AB2.chao;
    const tempo = abSeg(p,0,0.35), dia = tempo < 1 ? (1 - Math.cos(tempo * 3 * TAU)) / 2 : 0, lar = abSuave(abSeg(p,0.2,0.33));
    const pisca = T > 0 ? Math.sin(abSeg(p,0.85,0.93) * Math.PI) : 0, sorri = p >= 0.88;
    const some = abSeg(p,0.27,0.31), surge = abSeg(p,0.29,0.33), clarao = Math.sin(abSeg(p,0.23,0.37) * Math.PI);
    const abre = abSuave(abSeg(p,0.4,0.46)), olhar = abSuave(abSeg(p,0.58,0.64)), dedo = T > 0 ? (0.5 + 0.5 * Math.sin(T * 2.4)) * (1 - olhar) : 0.5;
    const cy = Y - 21 * sa, cw = 54 + abre * 54;   // o caderno, na altura do peito
    ab2Cozinha(c,cam,'noite',{ T, banco:[lar > 0.5 ? 452 : bx,AB2_BANCO[1],lar > 0.5 ? abSeg(lar,0.5,1) : 1 - abSeg(lar,0,0.5)],
      estado:{ dia, lar, noite:(1 - dia) * (1 - 0.68 * lar), estrela:1, facho:1 - abSeg(tempo,0,0.3), folhas:tempo, planta:abSuave(tempo), pisca },
      gente: cc => {
        if (some < 1){ cc.globalAlpha = 1 - some; ab2Vivo(cc,bx,AB2_BANCO[1],T,1.3,() => abBiaCrianca(cc,bx,AB2_BANCO[1],sb,{ t:T, costas:true })); cc.globalAlpha = 1; }
        if (surge > 0){
          cc.globalAlpha = surge; ab2Sombra(cc,bx - 8,Y + 3,84,13,0.4);
          const antes = EXPR; EXPR = sorri ? 'alegre' : (p >= 0.56 ? 'firme' : (abre > 0.3 ? 'insegura' : 'neutra'));
          try { ab2Vivo(cc,bx,Y,T,0.7,() => abBia(cc,bx,Y,{ s:sa, t:T, olha:olhar * 1.7, maos:[[-13 - abre * 6,-21],[13 + abre * 6 - (abre > 0.5 ? dedo * 9 : 0),-21 - (abre > 0.5 ? 2 : 0)]] })); } finally { EXPR = antes; }
          // o caderno "Receitas da Rosa": fechado e, depois, aberto, com o dedo passando na página
          cc.save(); cc.translate(bx,cy); cc.rotate(-0.04);
          rr(cc,-cw / 2 - 4,-34,cw + 8,62,5); fs(cc,AB_COR.rosa,3.4);
          if (abre < 0.5){ rr(cc,-cw / 2 + 6,-26,cw - 12,34,3); fs(cc,PAL.creme,1.8); cc.font = '10px ' + FB; cc.fillStyle = PAL.tinta; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('Receitas',0,-14); cc.fillText('da Rosa',0,-2); abFlor(cc,0,17,5); }
          else {
            rr(cc,-cw / 2,-30,cw / 2 - 2,54,3); fs(cc,PAL.creme,1.8); rr(cc,2,-30,cw / 2 - 2,54,3); fs(cc,PAL.creme,1.8);
            cc.fillStyle = 'rgba(34,32,28,.4)'; [-20,-12,-4,4,12].forEach((y,i) => { cc.fillRect(-cw / 2 + 7,y,cw / 2 - 18 - (i % 2) * 8,2.4); cc.fillRect(9,y,cw / 2 - 18 - ((i + 1) % 2) * 8,2.4); });
            abFlor(cc,-cw / 4 - 2,-22,3.4);
          }
          cc.restore();
          const mx = q => bx + q * sa; [-13 - abre * 6,13 + abre * 6 - (abre > 0.5 ? dedo * 9 : 0)].forEach((q,i) => { circ(cc,mx(q),Y + (-21 - (i && abre > 0.5 ? 2 : 0)) * sa,3.8 * sa); fs(cc,'#6B3F25',3.2); });   // as mãos por cima do caderno
          cc.globalAlpha = 1;
        }
      },
      brilho: cc => { if (clarao > 0){ cc.save(); cc.globalCompositeOperation = 'screen'; ab2Luz(cc,bx,Y - 150,260,'255,244,214',0.95 * clarao); ab2Luz(cc,bx,Y - 150,120,'255,255,255',0.9 * clarao); cc.restore(); for (let i = 0; i < 6; i++){ const a = i * TAU / 6 + (T > 0 ? T * 1.4 : 0); cc.globalAlpha = clarao; star(cc,bx + Math.cos(a) * 120,Y - 150 + Math.sin(a) * 150,6 + (i % 2) * 3,AB_COR.ouro); } cc.globalAlpha = 1; } } });
    return { bia:[bx,Y - AB_ALT.bia * AB2.k - 8,150] };
    },
  /* 9, o tio: o Tonhão sai da Casa Aurora, pendura o avental vinho na maçaneta, atravessa a rua arregaçando as mangas; a Bia espera com o caderno, sorri e abraça o tio */
  tio(c,p,T,cam){
    const R = AB2_RUA, P = R.porta, Y = AB2.chao, st0 = abEsc('tonhao',AB2.k), sa = abEsc('bia',AB2.k), cx = P.x + P.w / 2;
    const abre = abSuave(abSeg(p,0.05,0.12)) * (1 - abSuave(abSeg(p,0.2,0.27))), sai = abSuave(abSeg(p,0.1,0.2)), tira = abSuave(abSeg(p,0.22,0.3)), ombros = Math.sin(abSeg(p,0.29,0.36) * Math.PI);
    const anda = abSuave(abSeg(p,0.35,0.6)), mangas = abSuave(abSeg(p,0.38,0.47)), abraco = abSuave(abSeg(p,0.8,0.9));
    const st = st0 * (0.86 + 0.14 * sai), tx = cx + sai * 14 - anda * (cx + 14 - 444), ty = Y - 36 + sai * 36 + ombros * 5, andando = (sai > 0 && sai < 1) || (anda > 0 && anda < 1);
    const bx = 296 + abraco * 62, hx = P.x + P.w / 2 - 9, hy = P.y + P.h * 0.5 + 8;   // a maçaneta
    const tonhao = cc => {
      abTonhao(cc,tx,ty,st,{ t:T, olha:anda > 0 ? -1 : 0, mood:p < 0.37 ? 2 : 0, andando, ph:T * 8.5, braco:mangas > 0.02 && abraco < 0.5 ? 'flex' : null, g:mangas,
        bracoE:abraco >= 0.5 ? [[-12,-62]] : undefined, bracoD:abraco >= 0.5 ? [[30,-64],[24,-52]] : (tira > 0.05 && tira < 1 ? [[30,-66],[24 + tira * 10,-58]] : undefined) });
      if (tira < 0.5){   // o avental vinho da Casa Aurora, ainda no corpo
        cc.save(); cc.translate(tx,ty); cc.scale(st,st); cc.globalAlpha = 1 - abSeg(tira,0.3,0.5);
        cc.strokeStyle = PAL.tinta; cc.lineWidth = 1.6; cc.beginPath(); cc.moveTo(-10,-70); cc.lineTo(-6,-82); cc.moveTo(10,-70); cc.lineTo(6,-82); cc.stroke();
        cc.beginPath(); cc.moveTo(-12,-71); cc.lineTo(12,-71); cc.lineTo(19,-32); cc.lineTo(-19,-32); cc.closePath(); fs(cc,AB_COR.aurora,2.4); star(cc,0,-56,4.4,AB_COR.ouro);
        cc.restore(); cc.globalAlpha = 1;
      }
    };
    const fora = sai > 0.05;
    ab2RuaAurora(c,cam,'tarde',{ T, abre, dentro: !fora && abre > 0.05 ? tonhao : null,
      gente: cc => {
        if (tira >= 0.5){   // o avental pendurado na maçaneta
          const q = abSeg(tira,0.5,1), ax = hx + (1 - q) * (tx - hx) * 0.5, ay = hy - (1 - q) * 60, bal = T > 0 ? Math.sin(T * 2.4) * 0.05 * q : 0;
          cc.save(); cc.translate(ax,ay); cc.rotate(bal + (1 - q) * 0.5);
          cc.strokeStyle = PAL.tinta; cc.lineWidth = 3; cc.beginPath(); cc.moveTo(-8,14); cc.quadraticCurveTo(0,-6,8,14); cc.stroke();
          cc.beginPath(); cc.moveTo(-15,12); cc.lineTo(15,12); cc.lineTo(27,112); cc.quadraticCurveTo(0,122,-27,112); cc.closePath(); fs(cc,AB_COR.aurora,3); star(cc,0,52,9,AB_COR.ouro);
          cc.strokeStyle = 'rgba(0,0,0,.25)'; cc.lineWidth = 2.5; cc.beginPath(); cc.moveTo(-8,30); cc.lineTo(-12,108); cc.moveTo(9,30); cc.lineTo(13,108); cc.stroke();
          cc.restore();
        }
        const aBia = () => {
        ab2Sombra(cc,bx + 60,Y + 4,120,11,0.34);
        const antes = EXPR; EXPR = p >= 0.78 ? 'alegre' : (p < 0.4 ? 'insegura' : 'neutra');
        try { ab2Vivo(cc,bx,Y,T,0.7,() => abBia(cc,bx,Y,{ s:sa, t:T, olha:1.5, maos:abraco > 0.5 ? [[-15,-20],[19,-31]] : [[-6,-21],[15,-18]] })); } finally { EXPR = antes; }
        ab2Caderno(cc,bx - 26 + abraco * 4,Y - 24 * sa,1.05,-0.1);
        circ(cc,bx - 6 * sa,Y - 21 * sa,3.8 * sa); fs(cc,'#6B3F25',3.2);
        };
        // a Bia, na outra calçada, com o caderno; no abraço, ela fica na frente do tio
        if (abraco <= 0.3) aBia();
        if (fora){ ab2Sombra(cc,tx + 70,ty + 4,150,13,0.36 * sai); tonhao(cc); }
        if (abraco > 0.3) aBia();
        if (abraco > 0.5){ ab2BracoDe(cc,tx,ty,st,[[-19,-76],[-36,-66],[(bx + 34 - tx) / st,(Y - 31 * sa - ty) / st]]); cc.globalAlpha = abSeg(abraco,0.5,1); heart(cc,(bx + tx) / 2 + 10,Y - 322 - (T > 0 ? Math.sin(T * 3) * 6 : 0),15,'#E0559A'); cc.globalAlpha = 1; }
      } });
    return { tonhao:[tx + 13 * st,ty - 128 * st,130], bia:[bx,Y - AB_ALT.bia * AB2.k - 8] };
  },
  /* 10, o banco: a Bia espera diante do balcão, com o pote de moedas e a planta da garagem; a gerente lê, o carimbo desce (o quadro treme) e o papel diz APROVADO */
  banco(c,p,T,cam){
    const B = AB2_BCO, Y = AB2.chao, sa = abEsc('bia',AB2.k), bx = 440, gx = B.gerente[0], gy = B.gerente[1], gs = 4.4, pp = B.papel;
    const desce = abSuave(abSeg(p,0.5,0.55)), sobe = abSuave(abSeg(p,0.61,0.68)), carimbado = p >= 0.55, alivio = abSuave(abSeg(p,0.7,0.78));
    const treme = T > 0 && p >= 0.55 && p < 0.55 + 0.2 / 6, tm = T > 0 && alivio < 1 ? Math.sin(T * 31) : 0;
    const cy0 = B.balcao - 96, cyb = pp[1] - 22, cb = [pp[0] + 104 - 60 * desce * (1 - sobe),cy0 + (cyb - cy0) * desce * (1 - sobe)];   // o carimbo: no ar, no papel, no ar
    const gl = q => [(q[0] - gx) / gs,(q[1] - gy) / gs];
    c.save(); if (treme) c.translate(Math.sin(T * 91) * 4,Math.cos(T * 73) * 4);
    ab2Banco(c,cam,{ T,
      gerente: cc => {   // uma pessoa do jogo, de óculos e blazer
        const m = gl([cb[0] + 4,cb[1] - 34]);
        ab2Vivo(cc,gx,gy,T,2.1,() => drawPerson(cc,{ skin:1, hair:1, hairC:'#5B3A21', pants:'#2F3E5C', glasses:true, blazer:true, gravata:'#C2362B' },gx,gy,{ s:gs, shirt:'#3F4E7A', noShadow:true, mood:alivio > 0.5 ? 0 : 1, t:T,
          pisca:abPisca(T,0.9), bracoD:[[19,-27],m], bracoE:[[-17,-24],[-12,-19]] }));
      },
      papel: cc => {
        cc.beginPath(); cc.moveTo(pp[0] - 76,pp[1] - 38); cc.lineTo(pp[0] + 76,pp[1] - 38); cc.lineTo(pp[0] + 92,pp[1] + 40); cc.lineTo(pp[0] - 92,pp[1] + 40); cc.closePath(); fs(cc,'#FFFDF7',3);
        cc.fillStyle = 'rgba(34,32,28,.3)'; [-26,-16,-6].forEach((d,i) => cc.fillRect(pp[0] - 62,pp[1] + d,i === 2 ? 70 : 124,3.4));
        cc.fillStyle = 'rgba(34,32,28,.3)'; cc.fillRect(pp[0] - 70,pp[1] + 28,60,3);
        if (carimbado){   // APROVADO, em verde
          const q = T > 0 ? abSeg(p,0.55,0.6) : 1;
          cc.save(); cc.translate(pp[0] + 6,pp[1] + 12); cc.rotate(-0.07); cc.globalAlpha = 0.55 + 0.45 * q;
          rr(cc,-72,-17,144,34,6); cc.lineWidth = 4; cc.strokeStyle = PAL.ok; cc.stroke(); txt(cc,'APROVADO',0,1,24,PAL.ok,'center',FD);
          cc.restore();
        }
        // o carimbo e a mão da gerente
        rr(cc,cb[0] - 24,cb[1] + 4,48,14,4); fs(cc,'#3a3a3c',3); rr(cc,cb[0] - 9,cb[1] - 30,18,36,6); fs(cc,PAL.madeira,3);
        circ(cc,cb[0] + 4,cb[1] - 34,3.6 * gs); fs(cc,SKINS[1],3.4);
      },
      gente: cc => {
        ab2Sombra(cc,bx,Y + 3,84,13,0.4);
        const antes = EXPR; EXPR = alivio > 0.5 ? 'alegre' : 'insegura';
        try { ab2Vivo(cc,bx,Y,T,0.7,() => abBia(cc,bx,Y,{ s:sa, t:T, olha:1.5, maos:[[-12 + tm * 0.25,-22],[13 - tm * 0.25,-20 - alivio * 2]] })); } finally { EXPR = antes; }
        // o pote de moedas num braço e a planta da garagem, enrolada, no outro
        const jx = bx - 15 * sa + tm, jy = Y - 20 * sa;
        rr(cc,jx - 21,jy - 40,42,50,9); cc.fillStyle = 'rgba(214,236,244,.7)'; cc.fill();
        [[-8,0],[7,2],[0,-10],[-9,-16],[8,-14]].forEach(m => { circ(cc,jx + m[0],jy + m[1],7.5); fs(cc,AB_COR.ouro,2); });
        rr(cc,jx - 21,jy - 40,42,50,9); cc.strokeStyle = PAL.tinta; cc.lineWidth = 3; cc.stroke(); rr(cc,jx - 24,jy - 48,48,11,4); fs(cc,PAL.madeira,2.6);
        circ(cc,bx - 12 * sa + tm,Y - 22 * sa + 14,3.8 * sa); fs(cc,'#6B3F25',3.2);
        cc.save(); cc.translate(bx + 15 * sa - tm,Y - 21 * sa); cc.rotate(-0.5);
        rr(cc,-13,-62,26,124,11); fs(cc,'#DCE8F6',3); cc.strokeStyle = PAL.faixa; cc.lineWidth = 2; cc.beginPath(); cc.moveTo(-13,-40); cc.lineTo(13,-40); cc.moveTo(-13,42); cc.lineTo(13,42); cc.stroke(); ell(cc,0,-62,13,5); fs(cc,'#F4F8FD',2.4);
        cc.restore();
        circ(cc,bx + 13 * sa - tm,Y - (20 + alivio * 2) * sa + 6,3.8 * sa); fs(cc,'#6B3F25',3.2);
      } });
    c.restore();
    return { bia:[bx,Y - AB_ALT.bia * AB2.k - 8,-40] };
  },
  /* 11, o portão: a Bia e o Tonhão diante do portão, de costas; ela hesita, olha a foto da mãe, ele põe a mão no ombro dela; ela ergue o portão, a luz inunda a calçada, o letreiro acende e a estrela pisca */
  portao(c,p,T,cam){
    const K = AB2_CASA, P = K.portao, Y = AB2.chao, st = abEsc('tonhao',AB2.k * 0.78), sbi = st * 0.86, bx = 556, tx = 672, yb = P.y + P.h;
    const N = ab2Noite, vd = N('#2E8B57'), pb = N('#6B3F25'), br = N('#ffffff'), pt = N('#B9794B');   // as cores das pessoas, à noite
    const estende = Math.sin(abSeg(p,0.05,0.2) * Math.PI), foto = abSuave(abSeg(p,0.14,0.22)) * (1 - abSuave(abSeg(p,0.4,0.46))), ombro = abSuave(abSeg(p,0.25,0.31)) * (1 - abSuave(abSeg(p,0.42,0.47)));
    const k = abSuave(abSeg(p,0.45,0.65)), pega = abSuave(abSeg(p,0.4,0.46)) * (1 - abSuave(abSeg(p,0.66,0.74))), letras = abSeg(p,0.7,0.8), pisca = Math.sin(abSeg(p,0.8,0.9) * Math.PI), festa = abSuave(abSeg(p,0.72,0.8));
    const borda = yb - P.h * k, alc = Math.max(Y - 140 * sbi,borda);   // até onde as mãos dela acompanham o portão
    const L = q => [(q[0] - bx) / sbi,(q[1] - Y) / sbi];
    ab2RuaCasa(c,cam,k,{ T, letras, pisca, gente: cc => {
      ab2Sombra(cc,tx,Y + 4,104,13,0.4); ab2Sombra(cc,bx,Y + 4,88,12,0.4);
      abCostas(cc,tx,Y,st,{ roupa:br, calca:N('#3A3F4A'), pele:pt, cabelo:'toca', cor:N('#8C8C8C') });
      ab2BracoDe(cc,tx,Y,st,[[19,-76],festa > 0.05 ? [30,-80 - festa * 14] : [25,-60],festa > 0.05 ? [34 + (T > 0 ? Math.sin(T * 8) * 2 : 0),-96 - festa * 24] : [25,-44]],br,pt);
      const pulo = festa > 0 && T > 0 ? Math.abs(Math.sin(T * 7)) * 6 * festa : 0;
      ab2Vivo(cc,bx,Y,T,0.7,() => abCostas(cc,bx,Y,sbi,{ roupa:vd, calca:vd, pele:pb, cabelo:'puff', cor:'#15100D', laco:N(C_LACO) }),pulo);
      // os braços dela: estende a mão e recua; segura a foto; ergue o portão; comemora
      const mD = pega > 0.05 ? L([bx + 34,alc]) : (festa > 0.05 ? [30,-80 - festa * 30] : [23 + estende * 6,-46 - estende * 34]);
      const mE = pega > 0.05 ? L([bx - 34,alc]) : (festa > 0.05 ? [-30,-80 - festa * 30] : [-24 - foto * 8,-46 - foto * 26]);
      cc.save(); cc.translate(0,-pulo);
      ab2BracoDe(cc,bx,Y,sbi,[[19,-76],[(19 + mD[0]) / 2 + 5,(-76 + mD[1]) / 2 + 3],mD],vd,pb);
      ab2BracoDe(cc,bx,Y,sbi,[[-19,-76],[(-19 + mE[0]) / 2 - 5,(-76 + mE[1]) / 2 + 3],mE],vd,pb);
      if (foto > 0.05 && pega <= 0.05){ cc.globalAlpha = Math.min(1,foto * 2); cc.save(); cc.translate(bx + (mE[0] - 9) * sbi,Y + (mE[1] - 6) * sbi); cc.rotate(-0.12); drawFotoRosa(cc,0,0,1.5); cc.restore(); cc.globalAlpha = 1; }   // a foto da mãe na outra mão
      cc.restore();
      if (ombro > 0.05) ab2BracoDe(cc,tx,Y,st,[[-19,-76],[-34,-70],[(bx + 44 - tx) / st * ombro + (-25) * (1 - ombro),(-78 * sbi / st) * ombro + (-44) * (1 - ombro)]],br,pt);   // a mão do Tonhão no ombro dela
      else ab2BracoDe(cc,tx,Y,st,[[-19,-76],festa > 0.05 ? [-30,-80 - festa * 14] : [-25,-60],festa > 0.05 ? [-34,-96 - festa * 24] : [-25,-44]],br,pt);
    } });
    const ti = T > 0 ? abSeg(p,0.82,0.9) : 1;   // o título entra em cima (com movimento reduzido, já está lá)
    if (ti > 0){ c.globalAlpha = ti; txt(c,'O sonho da Bia',TW / 2,52,50,PAL.mostarda,'center',FD,9); c.globalAlpha = 1; }
    return { tonhao:[tx + 10,Y - 128 * st,170], bia:[bx,Y - 130 * sbi] };
  }
};

/* ---------- transições, legenda, bolinhas e o desenho de tudo ---------- */
// a cena i no tempo t, vista pela câmera; devolve a câmera e as cabeças de quem fala
function ab2Quadro(c,ab,i,t){
  const cena = ab.cenas[i], par = RM || ab.rm;
  const p = par ? (cena.pRM != null ? cena.pRM : 0.8) : clamp(t / cena.t,0,1), cam = ab2Cam(cena,par ? 1 : t / cena.t);
  return { cam, cab:AB2_CENAS[cena.id](c,p,par ? 0 : ab.tm,cam) || {} };
}
/* a transição de saída (Abertura.trans), por recorte e cor por cima: flash (branco), passa (a próxima entra por uma cortina lateral) e iris (um círculo
   fecha num ponto e a próxima abre dele; o centro é o [cx, cy] do cam.para da cena que sai). O escuro é o de sempre; corte e segue não desenham nada. */
function ab2Trans(c,ab,desenhaProxima){
  const tr = ab.trans; if (!tr) return;
  const k = tr.k;
  if (tr.tipo === 'flash'){
    if (k > 0.5) desenhaProxima();
    c.fillStyle = 'rgba(255,255,255,' + (k < 0.5 ? k * 2 : (1 - k) * 2).toFixed(3) + ')'; c.fillRect(0,0,TW,H);
  } else if (tr.tipo === 'passa'){
    const x = TW * (1 - abSuave(k));
    c.save(); c.beginPath(); c.rect(x,0,TW - x,H); c.clip(); desenhaProxima(); c.restore();
    const g = c.createLinearGradient(x - 46,0,x,0); g.addColorStop(0,'rgba(16,14,12,0)'); g.addColorStop(1,'rgba(16,14,12,.5)');
    c.fillStyle = g; c.fillRect(x - 46,0,46,H);
    c.fillStyle = PAL.creme; c.fillRect(x - 2,0,4,H);
  } else if (tr.tipo === 'iris'){
    const o = ab.cena.cam.para, q = ab2Tela(ab.cam,o[0],o[1]), cx = clamp(q[0],0,TW), cy = clamp(q[1],0,H);
    const R = Math.sqrt(Math.pow(Math.max(cx,TW - cx),2) + Math.pow(Math.max(cy,H - cy),2)) + 6;
    if (k < 0.5){
      c.fillStyle = PAL.tinta; c.beginPath(); c.rect(0,0,TW,H); c.arc(cx,cy,Math.max(0.01,R * (1 - abSuave(k * 2))),0,TAU,true); c.fill();
    } else {
      c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
      c.save(); c.beginPath(); c.arc(cx,cy,Math.max(0.01,R * abSuave(k * 2 - 1)),0,TAU); c.clip(); desenhaProxima(); c.restore();
    }
  }
}
// a legenda: uma linha em y = 548, creme com contorno escuro, sobre um degradê escuro só nos 130 px de baixo; entra com a opacidade de Abertura.legA
function ab2Legenda(c,ab){
  const s = ab.leg, a = ab.legA;
  if (!s || a <= 0) return;
  c.save(); c.globalAlpha = a;
  const g = c.createLinearGradient(0,H - 130,0,H); g.addColorStop(0,'rgba(16,14,12,0)'); g.addColorStop(1,'rgba(16,14,12,.6)');
  c.fillStyle = g; c.fillRect(0,H - 130,TW,130);
  c.font = '600 24px ' + FB; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.lineWidth = 5; c.strokeStyle = 'rgba(22,18,14,.92)'; c.strokeText(s,TW / 2,548);
  c.fillStyle = PAL.creme; c.fillText(s,TW / 2,548);
  c.restore();
}
// as bolinhas das cenas, pequenas, e a dica do toque só na cena 1; v11.16: sem elas nos créditos (`cheia`), que também não entram na conta
function ab2Bolinhas(c,ab){
  if (ab.cena.cheia) return;
  const n = ab.cenas.filter(q => !q.cheia).length, x0 = TW / 2 - (n - 1) * 8;
  for (let i = 0; i < n; i++){
    circ(c,x0 + i * 16,584,i === ab.i ? 4.5 : 3); c.fillStyle = i <= ab.i ? PAL.mostarda : 'rgba(247,239,216,.5)'; c.fill();
    c.strokeStyle = 'rgba(22,18,14,.55)'; c.lineWidth = 1.2; c.stroke();
  }
  if (ab.i === 0) txt(c,'toque para seguir',TW - 20,584,13,'rgba(247,239,216,.85)','right',FB,3);
}
function drawAbertura(c,ab){
  const par = RM || ab.rm, T = par ? 0 : ab.tm;
  // a boca de quem fala abre e fecha nos primeiros segundos do balão (nada disso com movimento reduzido)
  AB_VIVO.fala = {}; AB_VIVO.est = ab.est;
  if (T > 0) ab.falas().forEach(f => { const d = ab.t - f.de; if (d >= 0 && d < 1.8) AB_VIVO.fala[f.q] = Math.abs(Math.sin(d * 11)); });
  c.save();
  c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
  const q = ab2Quadro(c,ab,ab.i,ab.t), falas = ab.falas();
  falas.forEach(f => { const a = q.cab[f.q]; if (a){ const s = ab2Tela(q.cam,a[0],a[1]); if (s[0] > 0 && s[0] < TW) abBalao(c,f.s,s[0],s[1],a[2]); } });   // quem saiu do quadro (a câmera deslizou) fica sem balão
  ab2Legenda(c,ab);
  if (ab.trans) ab2Trans(c,ab,() => { AB_VIVO.fala = {}; ab2Quadro(c,ab,ab.i + 1,0); });
  ab2Bolinhas(c,ab);
  const e = ab.escuro;
  if (e > 0){ c.fillStyle = 'rgba(16,14,12,' + e + ')'; c.fillRect(0,0,TW,H); }
  c.restore();
}
