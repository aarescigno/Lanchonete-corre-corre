/* ============================================================
   O FINAL NOVO (refeito nas v11.16 a v11.18, etapa 10; docs/FINAL.md): o desenho
   As cenas do FINAL2 (src/18-abertura.js) no motor da abertura nova (27-abertura-nova.js): quadro cheio, câmera, camadas, luz. Cada cena recebe
   (c, p, T, cam) e devolve a cabeça de quem fala ([x, y, deslocamento do balão]), como as da abertura; entram na AB2_CENAS por Object.assign.
   Aqui ficam o cenário "Terraço por dentro" (ab2Terraco, de manhã e à noite) e as cenas telefone, placa e apagou (v11.16).
   ============================================================ */

/* ---------- o cenário "Terraço por dentro" ---------- */
// as medidas (docs/FINAL.md §6; desvios em docs/spec-v11.16.md): rodape = onde a parede encontra o piso; as pessoas pisam em AB2.chao (520)
const AB2_TE = { rodape:480, porta:{ x:40, y:150, w:160, h:330 }, placa:[330,210,170,76], aparador:{ x:380, w:200, tampo:430 }, retrato:[480,300],
  janela:{ x:620, y:60, w:470, h:270 }, balcao:{ x:860, w:220, tampo:430 }, tel:[960,424], passa:{ x:1108, y:252, w:108, h:158 }, pend:[300,640,1000] };

// uma fileira de prédios pequenos para a vista do janelão (x0 a x1, em pé sobre `base`; k: o tamanho)
function ab2TeSkyline(c,x0,x1,base,cor,jan,sem,k){
  let x = x0;
  for (let i = 0; x < x1; i++){
    const w = 34 + ((i * 37 + sem * 13) % 34), h = (46 + ((i * 53 + sem * 29) % 84)) * k;
    c.fillStyle = cor; c.fillRect(x,base - h,w,h + 90);
    if ((i + sem) % 3 === 0) c.fillRect(x + w * 0.3,base - h - 8 * k,w * 0.3,8 * k);
    c.fillStyle = jan;
    for (let yy = base - h + 9; yy < base - 8; yy += 14) for (let xx = x + 6; xx < x + w - 8; xx += 11) if (((xx * 7 + yy * 3 + i) | 0) % 3) c.fillRect(xx,yy,5,7);
    x += w + 3;
  }
}
// o que se vê pelo janelão: o céu, o sol nascendo (ou a noite com a estrela da Rosa) e a cidade em duas camadas; desliza menos que a parede
function ab2TeVista(c,cam,J,noite,T){
  c.save(); c.beginPath(); c.rect(J.x,J.y,J.w,J.h); c.clip();
  c.translate((cam.cx - TW / 2) * 0.25,(cam.cy - H / 2) * 0.25);
  const g = c.createLinearGradient(0,J.y,0,J.y + J.h);
  if (noite){ g.addColorStop(0,'#1A2548'); g.addColorStop(1,'#4A4F8A'); } else { g.addColorStop(0,'#FFC99A'); g.addColorStop(0.55,'#FFE9C2'); g.addColorStop(1,'#BFE3F7'); }
  c.fillStyle = g; c.fillRect(J.x - 90,J.y - 40,J.w + 180,J.h + 80);
  if (noite){
    c.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 0; i < 22; i++){ const sx = J.x + 14 + (i * 97) % (J.w - 20), sy = J.y + 10 + (i * 53) % 110; circ(c,sx,sy,0.9 + (T > 0 ? Math.abs(Math.sin(T * 1.7 + i)) * 0.9 : 0.6)); c.fill(); }
    ab2Estrela(c,J.x + J.w * 0.2,J.y + 62,13 + (T > 0 ? Math.sin(T * 3) * 1.4 : 0),1);
  } else {
    const sx = J.x + J.w * 0.76, sy = J.y + J.h * 0.62;
    ab2Luz(c,sx,sy,230,'255,236,170',0.9); circ(c,sx,sy,32 + (T > 0 ? Math.sin(T * 1.5) * 1.2 : 0)); c.fillStyle = '#FFF1B0'; c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; ell(c,J.x + 90,J.y + 50,40,9); c.fill(); ell(c,J.x + 130,J.y + 42,26,8); c.fill(); ell(c,J.x + 330,J.y + 78,34,8); c.fill();
  }
  const base = J.y + J.h + 24;
  ab2TeSkyline(c,J.x - 90,J.x + J.w + 90,base - 8,noite ? '#2A3260' : '#A9B8CC',noite ? 'rgba(255,214,120,.7)' : 'rgba(255,255,255,.3)',3,0.9);
  ab2TeSkyline(c,J.x - 90,J.x + J.w + 90,base + 24,noite ? '#1B2245' : '#7C93AE',noite ? 'rgba(255,200,100,.85)' : 'rgba(255,236,160,.8)',1,0.8);
  c.restore();
}
// o janelão: a vista, as colunas finas de nogueira com friso dourado, o peitoril, a vara da cortina e as cortinas creme presas com laço dourado
function ab2TeJanelao(c,cam,noite,T){
  const J = AB2_TE.janela;
  ab2TeVista(c,cam,J,noite,T);
  c.strokeStyle = '#4A3628'; c.lineWidth = 7; for (let k = 1; k <= 5; k++){ const x = J.x + J.w * k / 6; c.beginPath(); c.moveTo(x,J.y); c.lineTo(x,J.y + J.h); c.stroke(); }
  c.strokeStyle = TE_OURO; c.lineWidth = 1.6; for (let k = 1; k <= 5; k++){ const x = J.x + J.w * k / 6 - 1.6; c.beginPath(); c.moveTo(x,J.y); c.lineTo(x,J.y + J.h); c.stroke(); }
  c.strokeStyle = PAL.tinta; c.lineWidth = 12; c.strokeRect(J.x - 3,J.y - 3,J.w + 6,J.h + 6);
  c.strokeStyle = '#5B3A26'; c.lineWidth = 7; c.strokeRect(J.x - 3,J.y - 3,J.w + 6,J.h + 6);
  c.strokeStyle = TE_OURO; c.lineWidth = 1.8; c.strokeRect(J.x + 1,J.y + 1,J.w - 2,J.h - 2);
  rr(c,J.x - 16,J.y + J.h + 3,J.w + 32,13,4); fs(c,'#E8DFC8',2.6);
  c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 9; c.beginPath(); c.moveTo(J.x - 36,J.y - 24); c.lineTo(J.x + J.w + 36,J.y - 24); c.stroke();
  c.strokeStyle = TE_OURO; c.lineWidth = 5; c.stroke();
  [J.x - 38,J.x + J.w + 38].forEach(x => { circ(c,x,J.y - 24,8); fs(c,TE_OURO_CL,2.4); });
  [-1,1].forEach(d => {   // as duas cortinas: d < 0 à esquerda
    const e = d < 0 ? J.x : J.x + J.w, x = q => e - d * q, y0 = J.y - 20, y1 = J.y + J.h + 10, yl = J.y + J.h * 0.55;
    c.beginPath(); c.moveTo(x(-30),y0); c.lineTo(x(78),y0); c.quadraticCurveTo(x(66),yl - 44,x(10),yl); c.quadraticCurveTo(x(34),yl + 60,x(40),y1); c.lineTo(x(-30),y1); c.quadraticCurveTo(x(-20),yl - 20,x(-30),y0); c.closePath(); fs(c,'#F4EBD6',2.8);
    c.strokeStyle = '#D9CBA8'; c.lineWidth = 2.4; c.beginPath();
    c.moveTo(x(44),y0 + 2); c.quadraticCurveTo(x(38),yl - 40,x(2),yl - 6); c.moveTo(x(12),y0 + 2); c.quadraticCurveTo(x(10),yl - 40,x(-10),yl - 8);
    c.moveTo(x(-4),yl + 18); c.lineTo(x(4),y1 - 4); c.moveTo(x(18),yl + 22); c.lineTo(x(24),y1 - 4); c.stroke();
    rr(c,d < 0 ? e - 8 : e - 22,yl - 8,30,15,7); fs(c,TE_OURO_CL,2.4);   // o laço dourado
  });
}
// a parede (creme, com o lambri de nogueira e o friso dourado) e o janelão; vai atrás de tudo (paralaxe menor que 1)
function ab2TeParede(c,cam,noite,T){
  const R = AB2_TE.rodape, L = R - 86;
  c.fillStyle = '#EFE6D2'; c.fillRect(-180,-140,TW + 360,R + 150);
  c.strokeStyle = 'rgba(190,160,100,.16)'; c.lineWidth = 2; c.beginPath(); for (let x = -180; x < TW + 180; x += 26){ c.moveTo(x,-140); c.lineTo(x,L); } c.stroke();
  c.fillStyle = 'rgba(122,46,58,.07)'; c.fillRect(-180,-140,TW + 360,150);   // a faixa mais escura no alto
  c.fillStyle = '#5B3A26'; c.fillRect(-180,L,TW + 360,R + 40 - L);
  c.strokeStyle = '#7A5236'; c.lineWidth = 2; for (let x = -176; x < TW + 180; x += 64){ rr(c,x,L + 14,54,R - L - 22,4); c.stroke(); }
  c.fillStyle = TE_OURO; c.fillRect(-180,L - 2,TW + 360,5);
  c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-180,L - 2); c.lineTo(TW + 180,L - 2); c.stroke();
  ab2TeJanelao(c,cam,noite,T);
}
// o piso de tábuas em espinha de peixe e o rodapé
function ab2TePiso(c){
  const R = AB2_TE.rodape;
  c.fillStyle = '#C69A6A'; c.fillRect(-180,R,TW + 360,H + 160 - R);
  for (let r = 0, y = R; y < H + 100; r++, y += 22){
    for (let x = -180 - (r % 2) * 22; x < TW + 180; x += 44){
      c.fillStyle = (r + (x / 44 | 0)) % 2 ? 'rgba(120,76,38,.16)' : 'rgba(255,230,180,.12)';
      c.beginPath(); c.moveTo(x,y); c.lineTo(x + 22,y + 22); c.lineTo(x + 44,y); c.lineTo(x + 22,y - 0.1); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(70,40,20,.26)'; c.lineWidth = 1.6; c.beginPath();
    for (let x = -180 - (r % 2) * 22; x < TW + 180; x += 44){ c.moveTo(x,y); c.lineTo(x + 22,y + 22); c.lineTo(x + 44,y); }
    c.stroke();
  }
  const g = c.createLinearGradient(0,R,0,H + 100); g.addColorStop(0,'rgba(60,36,20,.28)'); g.addColorStop(0.25,'rgba(60,36,20,0)'); g.addColorStop(1,'rgba(60,36,20,.3)');
  c.fillStyle = g; c.fillRect(-180,R,TW + 360,H + 160 - R);
  c.fillStyle = '#5B3A26'; c.fillRect(-180,R - 12,TW + 360,14); c.fillStyle = TE_OURO; c.fillRect(-180,R - 12,TW + 360,3);
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(-180,R + 2); c.lineTo(TW + 180,R + 2); c.stroke();
}
// a porta de duas folhas com vidro fosco, puxadores de latão e o ABERTO pendurado; manha: o sol atravessa o vidro
function ab2TePorta(c,manha){
  const D = AB2_TE.porta, w = (D.w - 8) / 2;
  rr(c,D.x - 12,D.y - 14,D.w + 24,D.h + 14,6); fs(c,'#3B2416',3.4);
  [D.x,D.x + w + 8].forEach((x,i) => {
    rr(c,x,D.y,w,D.h,4); fs(c,'#6B452B',2.6);
    rr(c,x + 10,D.y + 16,w - 20,172,22); fs(c,manha ? '#F6F0DA' : '#C7D3DA',2.2);
    c.strokeStyle = TE_OURO; c.lineWidth = 1.8; c.beginPath(); c.moveTo(x + w / 2,D.y + 18); c.lineTo(x + w / 2,D.y + 186); c.moveTo(x + 12,D.y + 100); c.lineTo(x + w - 12,D.y + 100); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x + 18,D.y + 30,5,60);
    rr(c,x + 10,D.y + 208,w - 20,D.h - 232,4); fs(c,'#5A3B26',2); c.strokeStyle = '#7A5236'; c.lineWidth = 1.6; rr(c,x + 16,D.y + 214,w - 32,D.h - 244,3); c.stroke();
  });
  [D.x + w - 12,D.x + w + 22].forEach(x => { rr(c,x,D.y + 170,5,52,2.5); fs(c,TE_OURO,1.8); });   // os puxadores de latão
  const cx = D.x + D.w / 2;
  c.strokeStyle = PAL.tinta; c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx - 26,D.y + 54); c.lineTo(cx - 20,D.y + 80); c.moveTo(cx + 26,D.y + 54); c.lineTo(cx + 20,D.y + 80); c.stroke();
  rr(c,cx - 34,D.y + 78,68,26,5); fs(c,TE_OURO_CL,2.4); txt(c,'ABERTO',cx,D.y + 91,14,PAL.tinta,'center',FD,0,58);
}
// o passa-pratos da cozinha: uma janelinha na parede; a cena recorta nela quem aparece lá dentro (hook `dentro`)
function ab2TePassa(c,dentro){
  const P = AB2_TE.passa;
  c.save(); rr(c,P.x,P.y,P.w,P.h,4); c.clip();
  const g = c.createLinearGradient(0,P.y,0,P.y + P.h); g.addColorStop(0,'#5A3A24'); g.addColorStop(1,'#F2B96C'); c.fillStyle = g; c.fillRect(P.x,P.y,P.w,P.h);
  ab2Luz(c,P.x + P.w / 2,P.y + P.h * 0.7,110,'255,214,140',0.55);
  c.fillStyle = 'rgba(40,26,18,.55)'; for (let i = 0; i < 3; i++) c.fillRect(P.x + 8 + i * 34,P.y + 14,24,6);   // as panelas penduradas lá dentro
  if (dentro) dentro(c,P);
  c.restore();
  rr(c,P.x - 7,P.y - 7,P.w + 14,P.h + 14,6); c.lineWidth = 12; c.strokeStyle = PAL.tinta; c.stroke(); c.lineWidth = 7; c.strokeStyle = '#5B3A26'; c.stroke();
  rr(c,P.x,P.y,P.w,P.h,3); c.lineWidth = 1.8; c.strokeStyle = TE_OURO; c.stroke();
  rr(c,P.x - 12,P.y + P.h - 2,P.w + 24,14,4); fs(c,'#7A5236',2.6);   // a bancadinha onde saem os pratos
  circ(c,P.x + 18,P.y + P.h - 7,7); fs(c,TE_OURO_CL,2); rr(c,P.x + 17,P.y + P.h - 16,2,6,1); c.fillStyle = PAL.tinta; c.fill();   // o sininho
}
// um pendente dourado pendurado do alto (x; a cúpula termina em y ~ 140); aceso, com o halo âmbar (por cima do azul da noite, em ab2Terraco)
function ab2TePendente(c,x,aceso){
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(x,-300); c.lineTo(x,92); c.stroke();
  c.beginPath(); c.moveTo(x - 17,100); c.lineTo(x + 17,100); c.lineTo(x + 46,142); c.lineTo(x - 46,142); c.closePath(); fs(c,TE_OURO,2.8);
  c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(x - 12,104); c.lineTo(x - 5,104); c.lineTo(x - 22,138); c.lineTo(x - 32,138); c.closePath(); c.fill();
  rr(c,x - 20,92,40,10,3); fs(c,TE_OURO_CL,2.2);
  ell(c,x,143,45,6); fs(c,aceso ? '#FFF1B8' : '#F1E4C2',2);
}
// o Cantinho da Rosa: o aparador de nogueira, o retrato grande numa moldura dourada, o copo com uma rosa e a vela (acesa na noite)
function ab2TeCantinho(c,noite,T){
  const A = AB2_TE.aparador, R = AB2_TE.retrato, y0 = A.tampo, x1 = A.x + A.w;
  ab2Sombra(c,A.x + A.w / 2,516,A.w * 0.62,12,0.34);
  rr(c,A.x + 6,y0 + 12,A.w - 12,76,4); fs(c,'#5B3A26',3);
  [[A.x + 20],[A.x + A.w / 2 + 6]].forEach(q => { rr(c,q[0],y0 + 24,A.w / 2 - 26,50,3); fs(c,'#6B452B',1.8); circ(c,q[0] + (A.w / 2 - 26) / 2,y0 + 49,4); fs(c,TE_OURO_CL,1.6); });
  c.strokeStyle = PAL.tinta; c.lineWidth = 8; [A.x + 14,x1 - 14].forEach(x => { c.beginPath(); c.moveTo(x,y0 + 86); c.lineTo(x,512); c.stroke(); }); c.strokeStyle = '#5B3A26'; c.lineWidth = 4; [A.x + 14,x1 - 14].forEach(x => { c.beginPath(); c.moveTo(x,y0 + 86); c.lineTo(x,512); c.stroke(); });
  rr(c,A.x - 4,y0 - 2,A.w + 8,16,4); fs(c,'#7A5236',2.8); c.fillStyle = TE_OURO; c.fillRect(A.x,y0 + 12,A.w,2.4);
  // o retrato, na parede
  const rx = R[0], ry = R[1];
  rr(c,rx - 62,ry - 82,124,160,8); { const g = c.createLinearGradient(rx - 62,ry - 82,rx + 62,ry + 78); g.addColorStop(0,'#F0D78A'); g.addColorStop(0.5,TE_OURO); g.addColorStop(1,'#A87A28'); c.fillStyle = g; c.fill(); c.strokeStyle = PAL.tinta; c.lineWidth = 3.4; c.stroke(); }
  rr(c,rx - 50,ry - 70,100,136,4); fs(c,'#F6E7C9',2);
  drawFotoRosa(c,rx,ry - 2,2.5);
  // o copo com a rosa e a vela
  rr(c,A.x + 38,y0 - 38,18,36,4); fs(c,'rgba(210,235,245,.75)',2.2); c.strokeStyle = '#3E8F4A'; c.lineWidth = 3; c.beginPath(); c.moveTo(A.x + 47,y0 - 4); c.lineTo(A.x + 47,y0 - 56); c.stroke();
  abFlor(c,A.x + 47,y0 - 62,8);
  rr(c,x1 - 56,y0 - 38,16,38,3); fs(c,'#FBF6E6',2.2); c.strokeStyle = PAL.tinta; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x1 - 48,y0 - 38); c.lineTo(x1 - 48,y0 - 44); c.stroke();
  const fl = noite ? 1 + (T > 0 ? Math.sin(T * 9) * 0.1 : 0) : 0;
  if (noite){ c.beginPath(); c.moveTo(x1 - 48,y0 - 66); c.quadraticCurveTo(x1 - 40,y0 - 52,x1 - 48,y0 - 44); c.quadraticCurveTo(x1 - 56,y0 - 52,x1 - 48,y0 - 66); c.fillStyle = '#FFD36B'; c.fill(); }
  return fl;
}
// a ponta de uma mesa com toalha e um arranjo de flores, e a borda da cortina de veludo vinho (na frente de tudo)
function ab2TeFrente(c,T){
  // a cortina de veludo vinho, na borda esquerda
  c.beginPath(); c.moveTo(-200,-100); c.lineTo(30,-100); c.quadraticCurveTo(70,160,22,330); c.quadraticCurveTo(-8,470,30,720); c.lineTo(-200,720); c.closePath(); fs(c,'#6A2433',3.4);
  c.strokeStyle = 'rgba(30,8,14,.45)'; c.lineWidth = 6; c.beginPath(); c.moveTo(-18,-100); c.quadraticCurveTo(24,200,-6,720); c.moveTo(-70,-100); c.quadraticCurveTo(-32,260,-58,720); c.stroke();
  c.strokeStyle = 'rgba(210,100,120,.3)'; c.lineWidth = 4; c.beginPath(); c.moveTo(8,-100); c.quadraticCurveTo(46,190,10,720); c.stroke();
  rr(c,14,300,34,16,6); fs(c,TE_OURO_CL,2.4);
  // a mesa: a toalha branca e um arranjo
  c.beginPath(); c.ellipse(1250,606,190,36,0,0,TAU); fs(c,'#FFFFFF',3);
  c.beginPath(); c.moveTo(1060,606); c.quadraticCurveTo(1100,680,1130,720); c.lineTo(1400,720); c.lineTo(1440,606); c.closePath(); c.fillStyle = '#F2EEE4'; c.fill();
  rr(c,1212,520,34,70,8); fs(c,'rgba(210,235,245,.8)',2.6);
  [[-22,-4,'#E8457A'],[8,-26,'#F2C23D'],[28,-6,'#FFFFFF'],[-4,-8,'#E8457A'],[20,-34,'#E8457A']].forEach((f,i) => {
    c.strokeStyle = '#3E8F4A'; c.lineWidth = 3; c.beginPath(); c.moveTo(1229,522); c.lineTo(1229 + f[0],508 + f[1]); c.stroke();
    circ(c,1229 + f[0],504 + f[1] + (T > 0 ? Math.sin(T * 1.4 + i) * 1 : 0),10); fs(c,f[2],2);
  });
}
/* o Terraço por dentro. modo: 'manha' (o sol nascendo, pêssego e dourado) ou 'noite' (os pendentes âmbar sobre o azul).
   o: { T, tel: { fora, toca, K } (o telefone de mesa; K: a escala), passa(c, P): quem aparece no passa-pratos, parede(c): o que vai na parede, gente(c): as pessoas, frente(c) } */
function ab2Terraco(c,cam,modo,o){
  o = o || {};
  const T = o.T || 0, noite = modo === 'noite', R = AB2_TE, B = R.balcao, K = o.tel && o.tel.K || 1.2;
  ab2Camada(c,cam,0.85,() => ab2TeParede(c,cam,noite,T));
  let vela = 0;
  ab2Camada(c,cam,1,() => {
    ab2TePiso(c);
    if (!noite){   // o facho do sol: da janela, em diagonal, até o piso, e a luz que entra pelo vidro da porta
      c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,226,150,.2)';
      c.beginPath(); c.moveTo(740,R.rodape); c.lineTo(1040,R.rodape); c.lineTo(760,H + 100); c.lineTo(220,H + 100); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(R.porta.x + 20,R.rodape); c.lineTo(R.porta.x + R.porta.w - 20,R.rodape); c.lineTo(R.porta.x + R.porta.w + 250,H + 100); c.lineTo(R.porta.x + 60,H + 100); c.closePath(); c.fillStyle = 'rgba(255,232,170,.16)'; c.fill();
      c.restore();
    }
    ab2Sombra(c,120,516,110,10,0.3);
    ab2TePorta(c,!noite);
    if (!noite){ c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,R.porta.x + R.porta.w / 2,R.porta.y + 90,150,'255,236,180',0.55); c.restore(); }
    ab2TePassa(c,o.passa);
    vela = ab2TeCantinho(c,noite,T);
    if (o.parede) o.parede(c);
    [[300,506,0.8],[735,506,0.8]].forEach(q => { ab2Sombra(c,q[0],q[1] + 4,80,9,0.3); abMesaTe(c,q[0],q[1],q[2]); });
    // o balcão da entrada, com o telefone em cima
    ab2Sombra(c,B.x + B.w / 2,518,B.w * 0.62,12,0.34);
    rr(c,B.x + 4,B.tampo + 10,B.w - 8,80,4); fs(c,'#5B3A26',3);
    for (let i = 0; i < 3; i++){ rr(c,B.x + 14 + i * 68,B.tampo + 22,56,58,3); fs(c,'#6B452B',1.8); }
    c.fillStyle = TE_OURO; c.fillRect(B.x + 4,B.tampo + 10,B.w - 8,2.4);
    rr(c,B.x - 10,B.tampo - 6,B.w + 20,22,5); fs(c,'#EFE6D2',2.8);
    if (o.tel){ c.save(); c.translate(R.tel[0],R.tel[1]); c.scale(K,K); abTelefone(c,0,0,!!o.tel.fora,T,!!o.tel.toca); c.restore(); }
    R.pend.forEach(x => ab2TePendente(c,x,noite));
    if (o.gente) o.gente(c);
    if (!noite){
      c.fillStyle = 'rgba(255,226,150,.06)'; c.beginPath(); c.moveTo(740,R.rodape - 80); c.lineTo(1040,R.rodape - 80); c.lineTo(760,H + 100); c.lineTo(220,H + 100); c.closePath(); c.fill();
      for (let i = 0; i < 18; i++){   // a poeirinha subindo no facho
        const u = (i * 0.618) % 1, v = ((i * 0.381) % 1) - 0.5, sob = T > 0 ? (T * (5 + i % 4) + i * 17) % 70 : 20;
        const x = 880 - u * 440 + v * 190 + (T > 0 ? Math.sin(T * 0.6 + i) * 7 : 0), y = 380 + u * 200 - sob;
        c.fillStyle = 'rgba(255,246,206,' + (0.35 + 0.3 * Math.sin((T > 0 ? T * 1.4 : 1) + i * 2.1)).toFixed(3) + ')'; circ(c,x,y,1.6 + (i % 3) * 0.8); c.fill();
      }
    }
  });
  ab2Camada(c,cam,1.2,() => { ab2TeFrente(c,T); if (o.frente) o.frente(c); });
  if (noite){
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(70,82,148,.7)'; c.fillRect(0,0,TW,H); c.restore();
    ab2Camada(c,cam,1,() => {   // por cima do azul: os halos âmbar dos pendentes e a vela
      c.save(); c.globalCompositeOperation = 'screen';
      R.pend.forEach(x => { ab2Luz(c,x,150,210,'255,170,60',0.62); ab2Luz(c,x,146,60,'255,236,170',0.8); });
      ab2Luz(c,R.aparador.x + R.aparador.w - 48,R.aparador.tampo - 52,90 * vela,'255,190,90',0.55);
      c.restore();
    });
    ab2Clima(c,'42,49,90',0.1);
  } else ab2Clima(c,'255,201,154',0.09);
  ab2Vinheta(c,0.5);
}

/* ---------- as cenas ---------- */
// o fone na mão: no centro (x, y), girado (0 = em pé, ao longo da bochecha; 1,5708 = deitado, no gancho), na escala K
function ab2TeFone(c,x,y,rot,K){ c.save(); c.translate(x,y); c.scale(K,K); abFone(c,0,0,rot); c.restore(); }
// a Bia de roupa 4 (a do Terraço), no tamanho dos planos abertos
function ab2TeBia(c,x,y,o){ abBia(c,x,y,Object.assign({ roupa:4, s:abEsc('bia',AB2.k) },o)); }

Object.assign(AB2_CENAS, {
  /* 1, o telefone: close no telefone tocando; a câmera abre, a Bia entra enxugando as mãos, atende, arregala os olhos e leva a mão à boca; o Tonhão aparece no passa-pratos */
  telefone(c,p,T,cam){
    const R = AB2_TE, Y = AB2.chao, K = AB2.k, sb = abEsc('bia',K);
    const entra = abSuave(abSeg(p,0.2,0.4)), pega = abSuave(abSeg(p,0.34,0.43)), ouve = abSuave(abSeg(p,0.55,0.63)), boca = abSuave(abSeg(p,0.66,0.78));
    const bx = 1330 - 270 * entra, anda = entra > 0.001 && entra < 0.999, sac = T > 0 ? Math.sin(T * 9) * 3 : 0;
    const aD = pega <= 0 ? [4 + sac * 0.3,-20] : (pega < 0.5 ? abLerp([4,-20],[25,-32],pega * 2) : abLerp([25,-32],[11,-44],(pega - 0.5) * 2));
    const aE = boca > 0 ? abLerp([-4,-20],[-1,-41],boca) : [-4 - sac * 0.3,-20];
    const hx = bx - aD[0] * sb, hy = Y + aD[1] * sb;   // a mão do fone, na tela (a Bia olha para a esquerda: flip)
    ab2Terraco(c,cam,'manha',{ T, tel:{ fora:pega > 0.05, toca:pega < 0.05, K },
      passa: (cc,P) => {   // o Tonhão, do peito para cima, com a colher de pau e as sobrancelhas para cima; no fim, a mão no peito
        const sobe = abSuave(abSeg(p,0.58,0.8)), peito = abSuave(abSeg(p,0.84,0.95)), st = abEsc('tonhao',0.62);
        if (sobe <= 0) return;
        const tx = P.x + P.w / 2 + 2, ty = 584 - 120 * sobe + (T > 0 ? Math.sin(T * 2.4) * 1.2 : 0), m = abLerp([34,-108],[2,-62],peito);
        abTonhao(cc,tx,ty,st,{ flip:-1, t:T, olha:1, bracoD:[abLerp([30,-84],[20,-62],peito),m] });
        const mx = tx - m[0] * st, my = ty + m[1] * st;
        abColher(cc,[mx,my + 8],[mx + 2,my - 40],[mx,my + 2,SKINS[3]],5,PAL.madeira);
        cc.strokeStyle = PAL.tinta; cc.lineWidth = 3; cc.lineCap = 'round'; cc.beginPath();   // as sobrancelhas para cima
        const hy0 = ty - 98 * st;
        cc.moveTo(tx - 12 * st,hy0 - 10 * st); cc.lineTo(tx - 4 * st,hy0 - 14 * st); cc.moveTo(tx + 12 * st,hy0 - 10 * st); cc.lineTo(tx + 4 * st,hy0 - 14 * st); cc.stroke();
      },
      gente: cc => {
        ab2Sombra(cc,bx,Y + 4,70,11,0.4);
        ab2TeBia(cc,bx,Y,{ t:T, flip:-1, moving:anda, ph:T * 10, olha:anda ? 1 : 0, maos:[aE,aD] });
        if (pega > 0.02){   // o fone: no gancho, sobe ao ouvido
          const k = abSuave(clamp((pega - 0.5) * 2,0,1)), ear = pega >= 0.5 ? [hx + 2 * K,hy - 6 * K] : [hx - 6 * K,hy];
          ab2TeFone(cc,ear[0],ear[1],1.5708 * (1 - k) + 0.12 * k,K);
          circ(cc,hx,hy + 6,3.8 * sb); fs(cc,'#6B3F25',1.8 * sb / 1.6);
        }
        if (ouve > 0.02){   // os olhos arregalam
          [-1,1].forEach(d => { const ex = bx + d * 4.3 * sb, ey = Y - 45 * sb; circ(cc,ex,ey,(1.8 + 1.7 * ouve) * sb); fs(cc,'#fff',1.4); circ(cc,ex,ey,1.5 * sb); cc.fillStyle = PAL.tinta; cc.fill(); });
        }
        if (boca > 0.02){   // a mão livre sobe até a boca, por cima do rosto
          const sh = [bx + 10 * sb,Y - 30 * sb], hm = [bx - aE[0] * sb,Y + aE[1] * sb];
          abBraco(cc,[sh,hm],BIA_ROUPA_COR.clara,'#6B3F25',5 * sb); circ(cc,hm[0],hm[1],3.8 * sb); fs(cc,'#6B3F25',1.8 * sb / 1.6);
        }
      } });
    return { bia:[bx,Y - AB_ALT.bia * K - 8,-30] };
  },
  /* 2, a placa: o Tonhão, na escadinha, aperta o último parafuso da placa do Michelzão; desce um degrau e pergunta se está torta; a Bia, de braços cruzados, acha perfeita;
     o brilho passa pelo latão e as estrelas acendem; os dois se abraçam no pé do quadro */
  placa(c,p,T,cam){
    const R = AB2_TE, Y = AB2.chao, K = AB2.k, st = abEsc('tonhao',K), sbi = abEsc('bia',K), est = AB_VIVO.est || 1, pl = R.placa;
    const desce1 = abSuave(abSeg(p,0.3,0.36)), desce2 = abSuave(abSeg(p,0.78,0.86)), apoia = abSuave(abSeg(p,0.7,0.9));
    const fy = 452 + 34 * desce1 + 34 * desce2, tx = 481 + 89 * apoia, bx = 215 + 240 * abSuave(abSeg(p,0.7,0.92));
    const gira = p < 0.3 && T > 0 ? Math.sin(T * 12) * 3 : 0, solta = abSuave(abSeg(p,0.3,0.4)), abraca = abSuave(abSeg(p,0.8,0.92));
    const inclina = abSuave(abSeg(p,0.5,0.58)) * (1 - abSuave(abSeg(p,0.7,0.8))) * -0.05 + abraca * 0.04;
    const bal = p >= 0.32 ? Math.sin((p - 0.32) * 48) * 0.035 * (1 - abSeg(p,0.32,0.52)) : 0, rot = -0.02 + bal + (p < 0.32 ? -0.015 : 0);
    const brilho = abSeg(p,0.6,0.8);
    ab2Terraco(c,cam,'manha',{ T,
      parede: cc => {
        cc.save(); cc.translate(pl[0],pl[1]); cc.rotate(rot);
        abPlacaMichel(cc,0,0,pl[2],pl[3],0,0,p > 0.12,brilho * (1 - abSeg(p,0.86,1)) * 0.9);
        const h = pl[3];   // as estrelas vermelhas: apagadas, acendem uma a uma
        for (let i = 0; i < est; i++){
          const sx = (i - (est - 1) / 2) * h * 0.34, sy = h * 0.26, a = abSuave(abSeg(p,0.6 + i * 0.07,0.66 + i * 0.07));
          star(cc,sx,sy,h * 0.15,a > 0.5 ? '#D8342C' : 'rgba(120,80,30,.45)');
          if (a > 0 && a < 1){ cc.globalAlpha = 1 - a; star(cc,sx,sy,h * 0.15 * (1 + a),'#FFF8D6'); cc.globalAlpha = 1; }
        }
        if (brilho > 0 && brilho < 1){   // o brilho passa pelo latão, da esquerda para a direita
          cc.save(); rr(cc,-pl[2] / 2,-pl[3] / 2,pl[2],pl[3],10); cc.clip(); cc.globalCompositeOperation = 'screen';
          const x = -pl[2] * 0.7 + pl[2] * 1.4 * brilho; cc.fillStyle = 'rgba(255,248,214,.55)';
          cc.beginPath(); cc.moveTo(x - 10,-pl[3]); cc.lineTo(x + 14,-pl[3]); cc.lineTo(x + 4,pl[3]); cc.lineTo(x - 20,pl[3]); cc.closePath(); cc.fill(); cc.restore();
        }
        cc.restore();
      },
      gente: cc => {
        // a escadinha de dois degraus
        ab2Sombra(cc,481,516,80,8,0.34);
        rr(cc,429,486,104,30,3); fs(cc,'#B98A56',2.6); rr(cc,441,452,80,34,3); fs(cc,'#C99A66',2.6);
        cc.strokeStyle = 'rgba(70,40,20,.3)'; cc.lineWidth = 1.6; cc.beginPath(); cc.moveTo(432,500); cc.lineTo(530,500); cc.moveTo(444,468); cc.lineTo(518,468); cc.stroke();
        // a Bia, de braços cruzados, olha de baixo; depois vai até ele
        ab2Sombra(cc,bx,Y + 4,70,11,0.4);
        cc.save(); cc.translate(bx,Y); cc.rotate(inclina); cc.translate(-bx,-Y);
        ab2TeBia(cc,bx,Y,{ t:T, olha:1, moving:p > 0.7 && p < 0.92, ph:T * 10, maos:abraca > 0.3 ? [[10,-22],[-12,-24]] : [[8,-26],[-8,-24]] });
        cc.restore();
        // o Tonhão: de costas para a Bia, com a chave de fenda no parafuso; solta, desce e abraça
        ab2Sombra(cc,tx,fy + 4,72,10,0.34);
        const mao = abLerp(abLerp([26,-79.5],[24,-52],solta),[24,-43],abraca), cot = abLerp(abLerp([25,-78],[26,-60],solta),[28,-62],abraca);   // abraça: a mão no ombro dela
        abTonhao(cc,tx,fy,st,{ flip:-1, t:T, olha:1, mood:0, bracoD:[cot,mao] });
        if (solta < 0.7){   // a chave de fenda: a ponta no parafuso, o cabo vermelho
          const tx0 = pl[0] + (pl[2] / 2 - 17), ty0 = pl[1] + (pl[3] / 2 - 17);
          cc.save(); cc.globalAlpha = 1 - solta; cc.lineCap = 'round';
          cc.strokeStyle = PAL.tinta; cc.lineWidth = 8; cc.beginPath(); cc.moveTo(tx0,ty0); cc.lineTo(tx0 + 40,ty0 + gira); cc.stroke();
          cc.strokeStyle = '#C9CED6'; cc.lineWidth = 4; cc.beginPath(); cc.moveTo(tx0,ty0); cc.lineTo(tx0 + 20,ty0 + gira * 0.5); cc.stroke();
          cc.strokeStyle = PAL.perigo; cc.lineWidth = 8; cc.beginPath(); cc.moveTo(tx0 + 20,ty0 + gira * 0.5); cc.lineTo(tx0 + 44,ty0 + gira); cc.stroke();
          cc.restore();
        }
      } });
    return { tonhao:[tx,fy - AB_ALT.tonhao * K - 8,60], bia:[bx,Y - AB_ALT.bia * K - 8,p < 0.7 ? -40 : 70] };
  }
});

/* ---------- a Casa Aurora de noite (cena 3) ---------- */
// o salão visto pela porta aberta: vazio, com as cadeiras de pernas para cima nas mesas (desenha dentro do vão da porta)
function ab2AuSalaVazia(c){
  const P = AB2_RUA.porta, fy = P.y + P.h - 14;
  [[P.x + 34,0.9],[P.x + 104,1]].forEach(q => {
    const x = q[0], k = q[1];
    c.strokeStyle = PAL.tinta; c.lineWidth = 5; c.beginPath(); c.moveTo(x,fy - 30 * k); c.lineTo(x,fy + 8); c.stroke(); c.strokeStyle = '#8C6A4A'; c.lineWidth = 2.6; c.stroke();
    ell(c,x,fy - 32 * k,30 * k,7 * k); fs(c,'#F2EEE4',2.2);
    c.strokeStyle = PAL.tinta; c.lineWidth = 2; c.beginPath(); [-9,9].forEach(d => { c.moveTo(x + d * k,fy - 38 * k); c.lineTo(x + d * k,fy - 58 * k); }); c.moveTo(x + 11 * k,fy - 38 * k); c.lineTo(x + 11 * k,fy - 28 * k); c.stroke();
    rr(c,x - 12 * k,fy - 41 * k,24 * k,5 * k,2); fs(c,'#8C6A4A',1.8);
  });
}
// a panelinha do molho: (x, y) é o meio do fundo; s: a escala
function ab2AuPanelinha(c,x,y,s){
  c.save(); c.translate(x,y); c.scale(s,s);
  c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(-34,-30); c.lineTo(-48,-30); c.moveTo(34,-30); c.lineTo(48,-30); c.stroke();
  c.strokeStyle = '#2E3A36'; c.lineWidth = 3.4; c.stroke();
  c.beginPath(); c.moveTo(-32,-44); c.lineTo(32,-44); c.lineTo(27,0); c.lineTo(-27,0); c.closePath(); fs(c,'#8E99A6',2.6);
  ell(c,0,-44,32,7); fs(c,'#B9C2CC',2.4); ell(c,0,-44,25,4.6); c.fillStyle = AB_COR.molho; c.fill();
  c.restore();
}
// o Bráulio sentado no degrau da porta (x, y: o chão); o torso é o do abBraulio, mais baixo, e as pernas ficam penduradas à frente
function ab2AuSentado(c,x,y,s,drop,arms){
  const base = y + drop, hip = base - 34 * s;
  c.save(); c.beginPath(); c.rect(x - 300,-600,600,hip + 600); c.clip();
  c.translate(x,hip); c.scale(1.05,0.92); c.translate(-x,-hip);   // os ombros caídos
  abBraulio(c,x,base,s,{ semPlaca:true, triste:true });
  arms(base);
  c.restore();
  [-1,1].forEach(d => {   // as pernas: os joelhos à frente, as canelas penduradas e os sapatos no chão
    rr(c,x + d * 14 * s - 7 * s,hip + 6,14 * s,y - 4 - hip - 6,5); fs(c,'#2B2B33',2.4);
    ell(c,x + d * 14 * s,y - 3,9 * s,4.4 * s); fs(c,'#1b1b1b',2);
    ell(c,x + d * 14 * s,hip + 4,12 * s,10 * s); fs(c,'#33333D',2.4);
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 2.4; c.beginPath(); c.arc(x + d * 14 * s,hip + 4,8 * s,Math.PI * 1.15,Math.PI * 1.7); c.stroke();
  });
}

Object.assign(AB2_CENAS, {
  /* 3, o apagou: close na estrelinha acesa; a câmera abre; o Bráulio sai da porta com a panelinha, prova o molho e faz careta; a estrela pisca e apaga;
     ele leva as mãos à cabeça e se senta no degrau, com a panelinha no colo */
  apagou(c,p,T,cam){
    const R = AB2_RUA, P = R.porta, Y = AB2.chao, K = AB2.k, sbr = abEsc('braulio',K), pele = '#F2C9A5';
    const sai = abSuave(abSeg(p,0.3,0.45)), prova = abSuave(abSeg(p,0.35,0.4)) * (1 - abSuave(abSeg(p,0.43,0.48))), maos = abSuave(abSeg(p,0.62,0.7)), senta = abSuave(abSeg(p,0.72,0.86));
    const apaga = p >= 0.62, pisca = p >= 0.5 && !apaga, es = apaga ? 0 : (pisca && T > 0 && Math.floor(T * 9) % 2 ? 0.3 : 1);
    const bx = P.x + P.w / 2, by = 486 + 34 * sai, s = sbr * (0.9 + 0.1 * sai), drop = 50 * senta;
    const bal = T > 0 ? Math.sin(T * 14) * 4 * abSeg(p,0.4,0.5) * (1 - abSeg(p,0.5,0.56)) : 0;   // sacode a panelinha
    const vis = abSeg(p,0.3,0.325);
    ab2RuaAurora(c,cam,'noite',{ T, abre:1, estrela:es, dentro:ab2AuSalaVazia,
      gente: cc => {
        if (vis <= 0) return;
        cc.save(); cc.globalAlpha = vis;
        const L = (a,b,k) => [a[0] + (b[0] - a[0]) * k,a[1] + (b[1] - a[1]) * k];
        if (senta > 0.02){   // sentado: os braços nos joelhos, os ombros caídos
          ab2Sombra(cc,bx,Y + 4,80,10,0.4);
          rr(cc,P.x - 10,474,P.w + 20,26,3); fs(cc,'#D9D0BE',3); cc.fillStyle = 'rgba(60,50,60,.22)'; cc.fillRect(P.x - 8,490,P.w + 16,8);   // o degrau da porta
          ab2AuSentado(cc,bx,by,s,drop,base => {
            const k = senta, em = L(L([30,-62],[26,-62],0),[22,-48],k);
            ab2BracoDe(cc,bx,base,s,[[18,-78],[30,-62],L(L([22,-110],[40,-80],0),[24,-46],k)],'#fff',pele);
            ab2BracoDe(cc,bx,base,s,[[-18,-78],[-30,-62],L([-22,-110],[-26,-46],k)],'#fff',pele);
            });
          ab2AuPanelinha(cc,bx,by + drop - 29 * s - 8,0.7 * s / 2.4);   // no colo, por cima dos joelhos
        } else {
          ab2Sombra(cc,bx,by + 4,80 * (s / sbr),10,0.4 * (0.4 + 0.6 * sai));
          abBraulio(cc,bx,by,s,{ semPlaca:true, triste:p >= 0.38 });
          // braço da colher (a direita dele): descansa, vai à boca, e depois sobe com o da panelinha para a cabeça
          const cd = L(L([26,-50],[7,-90],prova),[24,-106],maos), ce = L([-30,-52],[-24,-106],maos);
          ab2BracoDe(cc,bx,by,s,[[18,-78],[30,-66 - prova * 10],cd],'#fff',pele);
          ab2BracoDe(cc,bx,by,s,[[-18,-78],[-34,-66],ce],'#fff',pele);
          const hx = bx + cd[0] * s, hy = by + cd[1] * s;
          if (maos < 0.5) abColher(cc,[hx,hy + 6],[hx + 6,hy - 42],[hx,hy,SKINS[1]],5,AB_COR.molho);
          if (maos < 0.5) ab2AuPanelinha(cc,bx + ce[0] * s - 26,by + ce[1] * s + 28 + bal,0.7 * s / 2.4);
          else ab2AuPanelinha(cc,bx - 92,by - 2,0.7 * s / 2.4);
        }
        cc.restore();
      } });
    return { braulio:[bx,Y - 118 * sbr + drop,-70] };
  }
});
