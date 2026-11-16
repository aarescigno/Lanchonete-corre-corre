/* ============================================================
   ABERTURA NOVA (v11.12, etapa 9a; docs/ABERTURA.md §3 e §6): o desenho
   Quadro cheio (TW x H). Cada cena é desenhada no espaço da cena e vista pela câmera (Abertura.cam): o fundo (paralaxe menor que 1), o meio
   (paralaxe 1, onde as pessoas pisam, em y = AB2.chao) e a frente (maior que 1, silhuetas escuras nas bordas), com uma fonte de luz, sombras,
   a camada de cor do clima e a vinheta. A cena recebe (c, p, T, cam) e devolve a cabeça de quem fala, no espaço da cena ([x, y, deslocamento
   do balão]); os balões, a legenda e as bolinhas vão no espaço da tela. Cena ainda sem desenho toca como cartão de obra (ab2Obra).
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
function ab2Janela(c,cam){
  const J = AB2_COZ.janela, xa = J.x, xb = J.x + J.w, ya = J.y, yb = J.y + J.h;
  ab2LaFora(c,cam,J);
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
}
// a parede (o fundo): creme com o barrado de azulejo, a janela, a prateleira dos temperos, as panelas penduradas, o relógio e a folhinha
function ab2CozinhaFundo(c,cam,modo,T){
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
  ab2Janela(c,cam);
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
}
// o piso de ladrilho em xadrez creme e terracota, em perspectiva, com o rodapé
function ab2Piso(c){
  const y0 = AB2_COZ.rodape, vy = 215, w0 = 46, ys = [y0,484,502,526,558,600,660];
  c.fillStyle = '#F1DFB8'; c.fillRect(-140,y0,TW + 280,H - y0 + 80);
  c.fillStyle = '#D68C5E'; c.beginPath();
  for (let r = 0; r < ys.length - 1; r++){
    const ka = (ys[r] - vy) / (y0 - vy), kb = (ys[r + 1] - vy) / (y0 - vy);
    for (let i = -18; i < 18; i++) if ((i + r) & 1){
      c.moveTo(TW / 2 + i * w0 * ka,ys[r]); c.lineTo(TW / 2 + (i + 1) * w0 * ka,ys[r]); c.lineTo(TW / 2 + (i + 1) * w0 * kb,ys[r + 1]); c.lineTo(TW / 2 + i * w0 * kb,ys[r + 1]); c.closePath();
    }
  }
  c.fill();
  const g = c.createLinearGradient(0,y0,0,H + 40); g.addColorStop(0,'rgba(110,64,30,.16)'); g.addColorStop(0.25,'rgba(110,64,30,0)'); g.addColorStop(1,'rgba(90,50,26,.22)');
  c.fillStyle = g; c.fillRect(-140,y0,TW + 280,H - y0 + 80);
  c.fillStyle = '#FBF3DC'; c.fillRect(-140,y0 - 13,TW + 280,13);
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
function ab2Bancada(c){
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
  // a tábua, os tomates e a faca
  rr(c,x + 72,y - 9,92,9,3); fs(c,'#DDA869',2.5);
  [[92,13],[116,12]].forEach(q => { circ(c,x + q[0],y - 9 - q[1] + 2,q[1]); fs(c,'#DC4A34',2.5); c.fillStyle = 'rgba(255,255,255,.5)'; ell(c,x + q[0] - 4,y - 9 - q[1] - 3,3.5,2); c.fill(); ab2Folha(c,x + q[0],y - 7 - q[1] * 2,-2.5,8,3,'#3F8454'); ab2Folha(c,x + q[0],y - 7 - q[1] * 2,-0.6,8,3,'#3F8454'); });
  c.beginPath(); c.arc(x + 142,y - 9,11,Math.PI,0); c.closePath(); fs(c,'#F0705C',2.2); c.fillStyle = '#F7C9A8'; circ(c,x + 138,y - 13,1.6); c.fill(); circ(c,x + 146,y - 13,1.6); c.fill();
  // o copo com uma rosa
  const gx = x + 214;
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
/* a cozinha de casa. modo: 'tarde' (o sol baixo pela janela; o 'noite' e o 'lar' das cenas 7 e 8 entram na v11.14). o: { T, banco:[x, y do assento],
   vapor, atras(c): quem está no corredor, gente(c): as pessoas, no meio, frente(c): a frente própria da cena } */
function ab2Cozinha(c,cam,modo,o){
  o = o || {};
  const T = o.T || 0, Z = AB2_COZ, tarde = !modo || modo === 'tarde';
  ab2Camada(c,cam,0.85,() => ab2CozinhaFundo(c,cam,modo,T));
  ab2Camada(c,cam,1,() => {
    ab2Piso(c);
    if (tarde){ c.fillStyle = 'rgba(255,232,160,.42)'; c.beginPath(); c.moveTo(452,486); c.lineTo(742,486); c.lineTo(668,604); c.lineTo(318,604); c.closePath(); c.fill(); }   // o sol no piso
    ab2Tapete(c,452,552);
    ab2Porta(c,o.atras);
    [[344,514,84,13],[696,516,118,13],[950,516,160,13]].forEach(q => ab2Sombra(c,q[0],q[1],q[2],q[3],0.4));
    ab2Geladeira(c);
    ab2Fogao(c,T,true);
    ab2Panela(c,Z.panela[0],Z.panela[1],T,o.vapor !== false);
    ab2Bancada(c);
    ab2Sombra(c,1158,548,84,12,0.35); ab2Mesinha(c);
    if (o.banco){ ab2Sombra(c,o.banco[0],AB2.chao + 6,62,10,0.35); ab2Banquinho(c,o.banco[0],o.banco[1]); }
    if (tarde){   // o facho de sol, em diagonal (atrás das pessoas, para não lavar os rostos)
      c.save(); c.globalCompositeOperation = 'screen';
      const g = c.createLinearGradient(960,150,500,590); g.addColorStop(0,'rgba(255,226,150,.3)'); g.addColorStop(1,'rgba(255,226,150,.05)');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(846,104); c.lineTo(1060,104); c.lineTo(1060,292); c.lineTo(742,604); c.lineTo(318,604); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(900,104); c.lineTo(1040,104); c.lineTo(1040,240); c.lineTo(680,604); c.lineTo(400,604); c.closePath(); c.fill();
      c.restore();
    }
    if (o.gente) o.gente(c);
    if (tarde){
      c.fillStyle = 'rgba(255,226,150,.07)'; c.beginPath(); c.moveTo(846,104); c.lineTo(1060,104); c.lineTo(1060,292); c.lineTo(742,604); c.lineTo(318,604); c.closePath(); c.fill();
      // a poeirinha subindo no facho
      for (let i = 0; i < 18; i++){
        const u = (i * 0.618) % 1, v = ((i * 0.381) % 1) - 0.5, sob = T > 0 ? (T * (5 + i % 4) + i * 17) % 70 : 20;
        const x = 930 - u * 420 + v * 170 + (T > 0 ? Math.sin(T * 0.6 + i) * 7 : 0), y = 190 + u * 380 - sob;
        c.fillStyle = 'rgba(255,246,206,' + (0.35 + 0.3 * Math.sin((T > 0 ? T * 1.4 : 1) + i * 2.1)).toFixed(3) + ')';
        circ(c,x,y,1.6 + (i % 3) * 0.8); c.fill();
      }
      c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,Z.panela[0],Z.fogao.topo - 4,78,'255,150,70',0.5 + (T > 0 ? Math.sin(T * 9) * 0.06 : 0)); c.restore();   // o halo da chama
    }
  });
  ab2Camada(c,cam,1.2,() => { ab2CozinhaFrente(c,T); if (o.frente) o.frente(c); });
  if (tarde) ab2Clima(c,'242,178,61',0.07);
  ab2Vinheta(c,0.5);
}

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

/* ---------- as cenas (as que ainda não estão aqui tocam como cartão de obra) ---------- */
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
  }
};

/* ---------- cartão de obra, transições, legenda, bolinhas e o desenho de tudo ---------- */
// a cena i ainda sem desenho: o número e o id no centro (a legenda e as falas vêm do drawAbertura2)
function ab2Obra(c,ab,i){
  const cena = ab.cenas[i == null ? ab.i : i], n = (i == null ? ab.i : i) + 1;
  c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
  c.strokeStyle = 'rgba(242,179,61,.16)'; c.lineWidth = 22; c.beginPath();
  for (let x = -H; x < TW; x += 90){ c.moveTo(x,H); c.lineTo(x + H,0); }
  c.stroke();
  c.fillStyle = 'rgba(34,32,28,.82)'; c.fillRect(0,60,TW,H - 120);
  if (cena.titulo) txt(c,cena.titulo,TW / 2,140,44,PAL.mostarda,'center',FD);
  txt(c,String(n),TW / 2,236,40,PAL.creme,'center',FD);
  txt(c,cena.id,TW / 2,286,40,PAL.creme,'center',FD);
  txt(c,'cena em obras',TW / 2,326,15,'rgba(247,239,216,.5)','center',FB);
}
// as falas no cartão de obra: balões sem ponta, empilhados
function ab2ObraFalas(c,falas){
  const U = AB_UI; let y = 372;
  falas.forEach(f => {
    const lin = treinoLinhas(c,f.s,560,U.fala);
    c.font = U.fala + 'px ' + FB;
    const w = Math.max.apply(null,lin.map(l => c.measureText(l).width)) + 34, h = lin.length * U.linha + 18;
    rr(c,TW / 2 - w / 2,y,w,h,16); fs(c,'#fff',3);
    lin.forEach((l,i) => txt(c,l,TW / 2,y + 9 + U.linha * (i + 0.5),U.fala,PAL.tinta,'center',FB));
    y += h + 10;
  });
}
// a cena i no tempo t, vista pela câmera; devolve a câmera e as cabeças (null no cartão de obra)
function ab2Quadro(c,ab,i,t){
  const cena = ab.cenas[i], par = RM || ab.rm, fn = AB2_CENAS[cena.id];
  const p = par ? (cena.pRM != null ? cena.pRM : 0.8) : clamp(t / cena.t,0,1), cam = ab2Cam(cena,par ? 1 : t / cena.t);
  if (!fn){ ab2Obra(c,ab,i); return { cam, cab:null }; }
  return { cam, cab:fn(c,p,par ? 0 : ab.tm,cam) || {} };
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
// as bolinhas das cenas, pequenas, e a dica do toque só na cena 1
function ab2Bolinhas(c,ab){
  const n = ab.n, x0 = TW / 2 - (n - 1) * 8;
  for (let i = 0; i < n; i++){
    circ(c,x0 + i * 16,584,i === ab.i ? 4.5 : 3); c.fillStyle = i <= ab.i ? PAL.mostarda : 'rgba(247,239,216,.5)'; c.fill();
    c.strokeStyle = 'rgba(22,18,14,.55)'; c.lineWidth = 1.2; c.stroke();
  }
  if (ab.i === 0) txt(c,'toque para seguir',TW - 20,584,13,'rgba(247,239,216,.85)','right',FB,3);
}
function drawAbertura2(c,ab){
  const par = RM || ab.rm, T = par ? 0 : ab.tm;
  // a boca de quem fala abre e fecha nos primeiros segundos do balão (nada disso com movimento reduzido)
  AB_VIVO.fala = {}; AB_VIVO.est = ab.est;
  if (T > 0) ab.falas().forEach(f => { const d = ab.t - f.de; if (d >= 0 && d < 1.8) AB_VIVO.fala[f.q] = Math.abs(Math.sin(d * 11)); });
  c.save();
  c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
  const q = ab2Quadro(c,ab,ab.i,ab.t), falas = ab.falas();
  if (q.cab) falas.forEach(f => { const a = q.cab[f.q]; if (a){ const s = ab2Tela(q.cam,a[0],a[1]); abBalao(c,f.s,s[0],s[1],a[2]); } });
  else ab2ObraFalas(c,falas);
  ab2Legenda(c,ab);
  if (ab.trans) ab2Trans(c,ab,() => { AB_VIVO.fala = {}; ab2Quadro(c,ab,ab.i + 1,0); });
  ab2Bolinhas(c,ab);
  const e = ab.escuro;
  if (e > 0){ c.fillStyle = 'rgba(16,14,12,' + e + ')'; c.fillRect(0,0,TW,H); }
  c.restore();
}
