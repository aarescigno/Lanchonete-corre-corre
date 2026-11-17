/* ============================================================
   O FINAL NOVO (refeito nas v11.16 a v11.18, etapa 10; docs/FINAL.md): o desenho
   As cenas do FINAL (src/18-abertura.js) no motor da abertura nova (27-abertura-nova.js): quadro cheio, câmera, camadas, luz. Cada cena recebe
   (c, p, T, cam) e devolve a cabeça de quem fala ([x, y, deslocamento do balão]), como as da abertura; entram na AB2_CENAS por Object.assign.
   Aqui ficam o cenário "Terraço por dentro" (ab2Terraco, de manhã e à noite) e as cenas telefone, placa e apagou (v11.16), retrato, equipe e escola (v11.17), e o cenário da varanda (ab2Varanda) e as cenas ceu, roda e creditos (v11.18).
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
    ab2Estrela(c,J.x + J.w * 0.3,J.y + 130,13 + (T > 0 ? Math.sin(T * 3) * 1.4 : 0),1);
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
function ab2TeCantinho(c,noite,T,lean){   // v11.17: lean (0 a 1): a chama se inclina
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
  if (noite){ const ln = (lean || 0) * 11; c.beginPath(); c.moveTo(x1 - 48 + ln,y0 - 66 + ln * 0.25); c.quadraticCurveTo(x1 - 40 + ln * 0.5,y0 - 52,x1 - 48,y0 - 44); c.quadraticCurveTo(x1 - 56 + ln * 0.5,y0 - 52,x1 - 48 + ln,y0 - 66 + ln * 0.25); c.fillStyle = '#FFD36B'; c.fill(); }
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
   o: { T, tel: { fora, toca, K } (o telefone de mesa; K: a escala), passa(c, P): quem aparece no passa-pratos, parede(c): o que vai na parede, gente(c): as pessoas, frente(c),
   v11.17: pisca (a estrela da Rosa no janelão), vela (a chama se inclina), topo(c): o que fica por cima da noite, sem escurecer (a estrelinha, a pétala) } */
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
    vela = ab2TeCantinho(c,noite,T,o.vela);
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
      if (o.topo) o.topo(c);
    });
    if (o.pisca > 0) ab2Camada(c,cam,0.85,() => {   // a estrela da Rosa, no janelão, pisca forte por cima da noite (onde ab2TeVista a desenha)
      const J = R.janela, x = J.x + J.w * 0.3 + (cam.cx - TW / 2) * 0.25, y = J.y + 130 + (cam.cy - H / 2) * 0.25, r = 13 * (1 + o.pisca * 1.4);
      c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,x,y,r * 2.6,'200,222,255',0.7 * o.pisca); c.restore();
      c.fillStyle = '#FFF8DC'; c.beginPath(); for (let i = 0; i < 8; i++){ const an = i * Math.PI / 4 - Math.PI / 2, rad = i % 2 ? r * 0.3 : r; c.lineTo(x + Math.cos(an) * rad,y + Math.sin(an) * rad); } c.closePath(); c.fill();
    });
    ab2Clima(c,'42,49,90',0.1);
  } else { if (o.topo) ab2Camada(c,cam,1,() => o.topo(c)); ab2Clima(c,'255,201,154',0.09); }
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

/* ---------- o retrato, a equipe e a escola (v11.17: cenas 4, 5 e 6) ---------- */
// a estrelinha de latão (do tamanho de uma mão), com um reflexo
function ab2TeEstrelinha(c,x,y,r,rot){
  c.save(); c.translate(x,y); c.rotate(rot || 0);
  star(c,0,0,r,AB_COR.ouro);
  c.fillStyle = 'rgba(255,248,214,.7)'; c.beginPath(); c.moveTo(-r * 0.12,-r * 0.7); c.lineTo(r * 0.08,-r * 0.15); c.lineTo(-r * 0.25,-r * 0.2); c.closePath(); c.fill();
  c.restore();
}
Object.assign(AB2_CENAS, {
  /* 4, o retrato: o Terraço à noite, vazio; a Bia, de três quartos diante do Cantinho, prende a estrelinha ao lado do retrato da mãe, olha para ele e diz a frase;
     encosta dois dedos na moldura (a chama da vela se inclina); uma pétala cai do copo da rosa e a estrela da Rosa, no janelão, pisca forte */
  retrato(c,p,T,cam){
    const R = AB2_TE, Y = AB2.chao, K = AB2.k, sb = abEsc('bia',K), est = AB_VIVO.est || 1, pl = R.placa, bx = 700, alvo = [576,326];
    const sobe = abSuave(abSeg(p,0.22,0.35)), preso = p >= 0.35, desce = abSuave(abSeg(p,0.36,0.46));
    const toca = abSuave(abSeg(p,0.58,0.68)) * (1 - abSuave(abSeg(p,0.74,0.82))), brilho = abSeg(p,0.35,0.52), cai = abSeg(p,0.75,1);
    const sl0 = [15,-42], slA = [(bx - alvo[0]) / sb,(alvo[1] - Y) / sb];   // a estrelinha, em unidades da Bia: nas mãos e na parede
    const sl = abLerp(sl0,slA,sobe), lift = Math.sin(sobe * Math.PI) * 7, S = [bx - sl[0] * sb,Y + (sl[1] - lift) * sb];
    const aD = abLerp(abLerp([sl[0] + 5,sl[1] - lift + 3],[10,-24],desce),[39.6,-44.4],toca), aE = abLerp([sl[0] - 5,sl[1] - lift + 3],[-6,-22],desce);
    const pisca = Math.sin(abSeg(p,0.84,0.96) * Math.PI);
    ab2Terraco(c,cam,'noite',{ T, pisca, vela:toca,
      parede: cc => { cc.save(); cc.translate(pl[0],pl[1]); cc.rotate(-0.02); abPlacaMichel(cc,0,0,pl[2],pl[3],est,0,true,0); cc.restore(); },
      gente: cc => {
        ab2Sombra(cc,bx,Y + 4,70,11,0.4);
        ab2TeBia(cc,bx,Y,{ t:T, flip:-1, olha:p < 0.42 ? 0.7 : 1.6, maos:[aE,aD] });
      },
      topo: cc => {   // por cima da noite: o brilho e a estrelinha (nas mãos, depois presa), os brilhinhos de quando prende e a pétala
        cc.save(); cc.globalCompositeOperation = 'screen'; ab2Luz(cc,bx - 24,Y - 8 * sb,240,'255,190,110',0.5); ab2Luz(cc,S[0],S[1],90 + (preso && T > 0 ? Math.sin(T * 4) * 8 : 0),'255,214,120',0.5); cc.restore();   // a luz quente do Terraço no rosto dela
        ab2TeEstrelinha(cc,S[0],S[1],preso ? 22 + (T > 0 ? Math.sin(T * 4) * 1.4 : 0) : 20,preso ? 0 : -0.25 * (1 - sobe));
        if (preso && brilho < 1){ cc.globalAlpha = 1 - brilho; for (let i = 0; i < 4; i++){ const a = i * TAU / 4 + 0.4, d = 30 + 26 * brilho; star(cc,S[0] + Math.cos(a) * d,S[1] + Math.sin(a) * d,6,'#FFF8D6'); } cc.globalAlpha = 1; }
        if (cai > 0){ const x = 427 + (Math.sin(cai * 7) * 12 + cai * 20), y = 372 + cai * 56; cc.save(); cc.translate(x,y); cc.rotate(Math.sin(cai * 6) * 0.9); ell(cc,0,0,12,7); fs(cc,AB_COR.petala,2.2); cc.restore(); }
      } });
    return { bia:[bx,Y - AB_ALT.bia * K - 8,-20] };
  }
});

/* ---------- a cena 5, equipe: a foto do Terraço ---------- */
// as posições da foto (x no chão da cena): atrás, a Cami, a Lia e o Anselmo (90% do tamanho, um pouco mais para dentro); na frente, a Dani, a Bia, o lugar do Tonhão e o Joca
const AB2_EQ = { atras:{ y:472, k:0.9, cami:395, lia:605, anselmo:815 }, frente:{ y:520, dani:290, bia:500, tonhao:710, joca:920 }, tripe:[100,350] };
// uma pessoa da equipe: a abPessoaFoto com os gestos (o: bracoD, bracoE, fala, olha, t) e o tamanho k
function ab2EqPessoa(c,q,x,y,k,o){
  const s = abEsc(q,k * AB2.k);
  if (q === 'bia') return ab2TeBia(c,x,y,Object.assign({ s },o));
  if (q === 'dani') return abDani(c,x,y,Object.assign({ s },o));
  const L = { joca:[JOCA_LOOK,'#B9BDC4','#1F4E8C'], cami:[CAMI_LOOK,'#8A1F3D','#1E1D21'], anselmo:[ANSELMO_LOOK,'#FFFFFF','#1E1D21'], lia:[LIA_LOOK,'#FFFFFF','#9FB8A8'] }[q];
  drawPerson(c,L[0],x,y,Object.assign({ s,shirt:L[1] },o));
  abAvental(c,x,y,s,L[2]);
  if (q === 'lia'){ c.save(); c.translate(x,y); c.scale(s,s); circ(c,0,-57,6.4); fs(c,'#1B1512',1.8); c.beginPath(); c.arc(0,-43,12.6,Math.PI * 1.08,Math.PI * 1.92); c.lineTo(12,-46); c.quadraticCurveTo(0,-51,-12,-46); c.closePath(); fs(c,'#D9A21B',1.8); c.restore(); }
}
// a câmera fotográfica num tripé, em silhueta (x, y: o centro da câmera); a luzinha vermelha pisca
function ab2EqTripe(c,x,y,T,pisca){
  const cor = 'rgba(52,34,22,.94)';
  c.strokeStyle = cor; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath();
  c.moveTo(x,y + 30); c.lineTo(x - 66,538); c.moveTo(x,y + 30); c.lineTo(x + 66,538); c.moveTo(x,y + 30); c.lineTo(x + 6,552); c.stroke();
  c.fillStyle = cor; rr(c,x - 7,y + 12,14,26,3); c.fill();
  rr(c,x - 46,y - 30,92,46,9); c.fill();
  rr(c,x - 20,y - 42,34,16,4); c.fill();
  circ(c,x - 8,y - 7,19); c.fill(); c.fillStyle = 'rgba(120,132,150,.55)'; circ(c,x - 8,y - 7,10); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; circ(c,x - 12,y - 11,3); c.fill();
  const on = T > 0 ? Math.floor(T * (pisca ? 6 : 3)) % 2 === 0 : true;   // sem relógio, acesa
  if (on){ c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,x + 30,y - 20,34,'255,60,50',0.8); c.restore(); }
  circ(c,x + 30,y - 20,4.6); c.fillStyle = on ? '#FF4638' : '#7A2A26'; c.fill();
}
// uma bandeja de doces nas duas mãos (x, y: o centro; a Dani)
function ab2EqBandeja(c,x,y){
  ell(c,x,y + 3,98,9); fs(c,'#B9C2CC',2.6); ell(c,x,y,92,7); fs(c,'#E6EBF0',2);
  [[-52,'#E8457A','#F6E7C9'],[-18,'#7A4A22','#F2C23D'],[18,'#F6E7C9','#E0523C'],[52,'#E8A73A','#FFFFFF']].forEach(d => {
    rr(c,x + d[0] - 13,y - 14,26,13,3); fs(c,d[1],2);
    circ(c,x + d[0],y - 20,11); fs(c,d[2],2); circ(c,x + d[0],y - 32,3.4); fs(c,'#D8342C',1.4);
  });
}
// a coqueteleira do Anselmo (x, y: a mão); balança
function ab2EqCoqueteleira(c,x,y,rot){
  c.save(); c.translate(x,y); c.rotate(rot);
  rr(c,-11,-46,22,44,6); fs(c,'#C9CED6',2.6); rr(c,-9,-58,18,14,5); fs(c,'#B9C2CC',2.2); rr(c,-5,-66,10,9,3); fs(c,'#E6EBF0',2);
  c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-7,-42,4,34);
  c.restore();
}
// o quadro da cena 5 no andamento p (a foto desenha o mesmo, parado em p 0,6, no tamanho pequeno)
function ab2EqQuadro(c,cam,p,T){
  const Y = AB2.chao, K = AB2.k, A = AB2_EQ, F = A.frente, B = A.atras, TR = A.tripe;
  const ajeita = abSuave(abSeg(p,0.32,0.4)), abre = abSuave(abSeg(p,0.3,0.45)), ri = abSuave(abSeg(p,0.34,0.42)), ergue = abSuave(abSeg(p,0.34,0.44)), segura = abSuave(abSeg(p,0.3,0.4));
  const corre = abSuave(abSeg(p,0.3,0.55)), dobra = 0.3 * (1 - abSuave(abSeg(p,0.2,0.3))), tx = 205 + (F.tonhao - 205) * corre, ty = Y + 36 * Math.sin(corre * Math.PI);
  const joca = F.joca + 28 * abre, sc = abEsc('tonhao',K), t = T;
  ab2Terraco(c,cam,'manha',{ T,
    gente: cc => {
      // atrás
      ab2Sombra(cc,B.cami,B.y + 4,70,10,0.3); ab2Sombra(cc,B.lia,B.y + 4,70,10,0.3); ab2Sombra(cc,B.anselmo,B.y + 4,70,10,0.3);
      const cd = abLerp([15.5,-17],[13.5,-46],ajeita), cm = abLerp([20,-30],[19,-40],ajeita), bal = T > 0 ? Math.sin(T * 9) * 2 : 0;
      ab2EqPessoa(cc,'cami',B.cami,B.y,B.k,{ t,bracoD:ajeita > 0.01 ? [[cm[0],cm[1]],[cd[0] + bal * ajeita,cd[1]]] : undefined });
      ab2EqPessoa(cc,'lia',B.lia,B.y,B.k,{ t,fala:ri > 0 ? (T > 0 ? Math.abs(Math.sin(T * 10)) * 0.9 : 0.8) : 0,mood:0 });
      const ad = abLerp([15.5,-17],[17,-60],ergue), am = abLerp([22,-30],[24,-46],ergue), sk = T > 0 ? Math.sin(T * 14) * 0.18 * ergue : 0, as = abEsc('anselmo',B.k * K);
      ab2EqPessoa(cc,'anselmo',B.anselmo,B.y,B.k,{ t,bracoD:ergue > 0.01 ? [[am[0],am[1]],[ad[0],ad[1]]] : undefined });
      if (ergue > 0.01) ab2EqCoqueteleira(cc,B.anselmo + ad[0] * as,B.y + ad[1] * as + 4,0.25 + sk);
      // na frente
      [F.dani,F.bia,joca].forEach(x => ab2Sombra(cc,x,Y + 4,76,11,0.38));
      ab2EqPessoa(cc,'dani',F.dani,Y,1,{ t,bracoE:segura > 0.01 ? [[-19,-27],[-20,-23]] : undefined,bracoD:segura > 0.01 ? [[19,-27],[20,-23]] : undefined });
      if (segura > 0.01){ const sd = abEsc('dani',K), by = Y - 23 * sd; ab2EqBandeja(cc,F.dani,by); [-1,1].forEach(d => { circ(cc,F.dani + d * 88,by + 1,7); fs(cc,SKINS[3],1.8); }); }
      ab2EqPessoa(cc,'bia',F.bia,Y,1,{ t,olha:0 });
      ab2EqPessoa(cc,'joca',joca,Y,1,{ t });
      // o Tonhão: atrás da câmera (curvado), corre até o lugar vazio e fica
      ab2Sombra(cc,tx,ty + 4,80,11,0.38);
      cc.save(); cc.translate(tx,ty); cc.rotate(corre > 0 ? 0 : -dobra); cc.translate(-tx,-ty);
      abTonhao(cc,tx,ty,sc,{ flip:corre > 0 ? 1 : -1,t,andando:corre > 0.001 && corre < 0.999,ph:T * 14,olha:corre > 0 ? 1 : 1,
        bracoD:corre > 0 ? undefined : [[34,-76],[44,-72]] });
      cc.restore();
    },
    frente: cc => ab2EqTripe(cc,TR[0],TR[1],T,p > 0.3) });
  return { tx, ty };
}
Object.assign(AB2_CENAS, {
  /* 5, a equipe: o Tonhão, curvado atrás da câmera num tripé, aperta o botão e corre para o lugar vazio; a equipe se ajeita; o clique vira a foto, com os nomes embaixo de cada um */
  equipe(c,p,T,cam){
    const Y = AB2.chao, K = AB2.k, pq = Math.min(p,0.6), Tq = p >= 0.6 ? 0 : T;   // a partir do clique, tudo para (o quadro de p 0,6)
    const q = ab2EqQuadro(c,cam,pq,Tq);
    if (p >= 0.6){   // o clique: o clarão, o quadro escurece e a foto aparece no centro, numa moldura de madeira, com os nomes à mão embaixo de cada um
      const k = abSuave(abSeg(p,0.6,0.67)), sf = 0.54, pw = TW * sf, ph = H * sf, mg = 26, mb = 74, fw = 15;
      const W = pw + mg * 2 + fw * 2, Hh = ph + mg + mb + fw * 2, cf = ab2Cam(FINAL.cenas.find(z => z.id === 'equipe'),0.6);
      c.fillStyle = 'rgba(16,14,12,.6)'; c.fillRect(0,0,TW,H);
      ab2Luz(c,TW / 2,H / 2,440,'242,194,61',0.6 * k);
      c.save(); c.translate(TW / 2,H / 2 - 6); c.rotate(2 * Math.PI / 180); const z = 0.9 + 0.1 * k; c.scale(z,z);
      rr(c,-W / 2,-Hh / 2,W,Hh,10); fs(c,'#7A4A22',4); rr(c,-W / 2 + fw - 3,-Hh / 2 + fw - 3,W - 2 * fw + 6,Hh - 2 * fw + 6,6); fs(c,'#5B3A22',2.4);
      rr(c,-W / 2 + fw,-Hh / 2 + fw,W - 2 * fw,Hh - 2 * fw,4); fs(c,'#F6EBD0',2);   // o passe-partout creme
      const px = -pw / 2, py = -Hh / 2 + fw + mg;
      c.save(); c.translate(px,py); c.scale(sf,sf); c.beginPath(); c.rect(0,0,TW,H); c.clip(); ab2EqQuadro(c,cf,0.6,0); c.restore();
      c.strokeStyle = PAL.tinta; c.lineWidth = 2.4; c.strokeRect(px,py,pw,ph);
      const A = AB2_EQ, ny0 = py + ph + 20, ny1 = py + ph + 46;   // os nomes: os de trás numa linha, os da frente na de baixo
      [['Cami',A.atras.cami,ny0],['Lia',A.atras.lia,ny0],['Anselmo',A.atras.anselmo,ny0],['Dani',A.frente.dani,ny1],['Bia',A.frente.bia,ny1],['Tonhão',A.frente.tonhao,ny1],['Joca',A.frente.joca,ny1]].forEach((n,i) => {
        c.save(); c.translate(px + n[1] * sf,n[2]); c.rotate((i % 2 ? 1 : -1) * 0.03); txt(c,n[0],0,0,18,PAL.tinta,'center',FB); c.restore();
      });
      c.restore();
      const cl = T > 0 ? 1 - abSeg(p,0.6,0.6 + 0.15 / 8) : 0;
      if (cl > 0){ c.fillStyle = 'rgba(255,255,255,' + cl.toFixed(3) + ')'; c.fillRect(0,0,TW,H); }
    }
    return { tonhao:[q.tx,q.ty - AB_ALT.tonhao * K - 8,60] };
  }
});

/* ---------- a cena 6, escola: a garagem da Rosa como escola de cozinha ---------- */
// as medidas lá dentro (a garagem é o AB2_CASA.portao: x 445, y 215, 330 x 285; o chão em y 500)
const AB2_ES = { chao:496, bancada:{ x:470, y:428, w:305 }, panela:[672,428], dani:726, crianca:[498,548,598] };
// uma criança de avental: pele, cabelo (0 a 6), cor do cabelo, avental, mochila (de fora), fecha os olhos; s é o tamanho, no desenho de abCrianca
function ab2EsCrianca(c,x,y,s,o){
  drawPerson(c,{ kid:true, skin:o.pele,hair:o.cabelo,hairC:o.cor,pants:'#3C5A4A',acc:o.mochila ? 'backpack' : null },x,y,
    { s,shirt:'#FFF4DC',t:o.t || 0,pisca:o.fecha || abPisca(o.t || 0,o.sd || 0.6),bracoD:o.bracoD,bracoE:o.bracoE,olha:o.olha,moving:!!o.corre,ph:o.ph || 0,noShadow:!!o.semSombra });
  abAvental(c,x,y,s * 0.74,o.avental);
}
const AB2_ES_KIDS = [{ pele:2,cabelo:3,cor:'#2F1D12',avental:'#E0523C',sd:0.2 },{ pele:4,cabelo:6,cor:'#1B1512',avental:'#2E9CA6',sd:1.1 },{ pele:1,cabelo:1,cor:'#6B3F25',avental:'#F2B33D',sd:2.3 }];
// o lado de dentro da garagem (o.dentro do ab2RuaCasa; já recortado no vão do portão). e: o que a cena mostra agora
function ab2EsDentro(c,T,e){
  const K = AB2_CASA.portao, B = AB2_ES.bancada, Yc = AB2_ES.chao, Pn = AB2_ES.panela, sd = abEsc('dani',1.38 * 0.7), sk = abEsc('biaCrianca',1.38 * 0.7);
  // a parede creme, o barrado de azulejo azul e branco e o piso
  const g = c.createLinearGradient(0,K.y,0,K.y + K.h); g.addColorStop(0,'#FBEFD0'); g.addColorStop(1,'#F2DDB0'); c.fillStyle = g; c.fillRect(K.x,K.y,K.w,K.h);
  for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++){ c.fillStyle = (i + j) % 2 ? '#FFFFFF' : '#3B74B8'; c.fillRect(K.x + i * 21,392 + j * 20.5,21,20.5); }
  c.strokeStyle = 'rgba(40,70,120,.35)'; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= 16; i++){ c.moveTo(K.x + i * 21,392); c.lineTo(K.x + i * 21,474); } for (let j = 0; j <= 4; j++){ c.moveTo(K.x,392 + j * 20.5); c.lineTo(K.x + K.w,392 + j * 20.5); } c.stroke();
  c.fillStyle = '#2A5A96'; c.fillRect(K.x,388,K.w,5); c.fillStyle = '#D9B98A'; c.fillRect(K.x,474,K.w,K.h + K.y - 474); c.strokeStyle = 'rgba(90,60,30,.3)'; c.lineWidth = 1.4; c.beginPath(); for (let x = K.x; x < K.x + K.w; x += 38){ c.moveTo(x,474); c.lineTo(x - 12,K.y + K.h); } c.stroke();
  c.strokeStyle = PAL.tinta; c.lineWidth = 2.4; c.beginPath(); c.moveTo(K.x,474); c.lineTo(K.x + K.w,474); c.stroke();
  // o quadro-negro com "Receitas da Rosa", a foto da Rosa, a prateleira com potes
  rr(c,462,236,150,84,5); fs(c,'#7A4A22',3); rr(c,468,242,138,72,3); fs(c,'#2F4A3E',1.6);
  txt(c,'Receitas da Rosa',537,262,16,'#F7EFD8','center',FD);
  c.strokeStyle = 'rgba(247,239,216,.7)'; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(486,282); c.lineTo(540,282); c.moveTo(486,296); c.lineTo(522,296); c.stroke();
  heart(c,578,292,7,'rgba(232,87,122,.9)'); c.fillStyle = 'rgba(224,82,60,.9)'; circ(c,574,276,6); c.fill(); c.fillStyle = 'rgba(60,160,80,.9)'; c.fillRect(572,267,4,4);
  rr(c,462,320,150,5,2); fs(c,'#B58A5A',1.6);
  drawFotoRosa(c,640,276,1.7);
  rr(c,676,288,92,6,2); fs(c,'#7A4A22',2); [[684,'#E0523C',20],[708,'#F2B33D',24],[732,'#3B74B8',18],[754,'#7DB85A',22]].forEach(q => { rr(c,q[0] - 8,288 - q[2],16,q[2],3); fs(c,'rgba(255,255,255,.75)',1.6); c.fillStyle = q[1]; c.fillRect(q[0] - 6,288 - q[2] * 0.6,12,q[2] * 0.5 - 2); rr(c,q[0] - 9,288 - q[2] - 4,18,5,2); fs(c,q[1],1.6); });
  // a Dani, atrás da bancada: mexe a panela, mostra a colher, dá a provar e bate palmas
  const px = e.hand[0], py = e.hand[1], dl = [(px - AB2_ES.dani) / sd,(py - Yc) / sd];
  const claps = e.palmas > 0 ? (T > 0 ? Math.sin(T * 14) * 3 : 0) : 0, hands = e.palmas > 0 ? abLerp([-15.5,-17],[-5 + claps * 0.3,-36],e.palmas) : null;
  ab2Sombra(c,AB2_ES.dani,Yc + 3,70,9,0.3);
  abDani(c,AB2_ES.dani,Yc,{ s:sd,t:T,fala:e.ri > 0 ? (T > 0 ? 0.1 + Math.abs(Math.sin(T * 10)) * 0.5 : 0.4) : undefined,
    bracoE:e.palmas > 0 ? [[-13,-34],[hands[0] - claps,hands[1]]] : [[-19,-26],[dl[0],dl[1]]], bracoD:e.palmas > 0 ? [[13,-34],[-hands[0] + claps,hands[1]]] : undefined });
  // a bancada de madeira, com a tábua, os tomates e a colher esperando na panela
  rr(c,B.x + 6,B.y + 14,B.w - 12,Yc + 2 - B.y - 14,3); fs(c,'#A9763D',2.6);
  c.strokeStyle = 'rgba(70,40,20,.35)'; c.lineWidth = 1.6; c.beginPath(); [0.33,0.66].forEach(f => { c.moveTo(B.x + B.w * f,B.y + 18); c.lineTo(B.x + B.w * f,Yc - 4); }); c.stroke();
  [0.16,0.5,0.83].forEach(f => { rr(c,B.x + B.w * f - 18,B.y + 26,36,22,3); fs(c,'#8E5F2E',1.6); circ(c,B.x + B.w * f,B.y + 37,2.4); fs(c,AB_COR.ouro,1); });
  rr(c,B.x,B.y,B.w,15,4); fs(c,'#E8C48E',2.6); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(B.x + 6,B.y + 3,B.w - 12,3);
  rr(c,706,B.y - 7,38,7,2); fs(c,'#D9B07A',1.8); [[718,'#E0523C'],[733,'#D8342C']].forEach(t => { circ(c,t[0],B.y - 14,7); fs(c,t[1],1.8); c.fillStyle = '#3E8F4A'; c.fillRect(t[0] - 2,B.y - 22,4,3); });
  circ(c,764,B.y - 8,7.5); fs(c,'#E0523C',1.8);
  if (!e.colherNaMao) abColher(c,[Pn[0] + 14,Pn[1] - 88],[Pn[0] - 4,Pn[1] - 38],null,0,AB_COR.molho);   // o cabo para fora da panela
  abPanela(c,Pn[0],Pn[1],56,T,e.vapor,AB_COR.molho);
  // as crianças, na frente da bancada; a do banquinho, na ponta dos pés
  AB2_ES_KIDS.forEach((k,i) => {
    const a = i === 2 ? 1 : e.entrou[i]; if (a <= 0) return;
    const x = AB2_ES.crianca[i], pe = i === 2 ? 20 + (e.provou < 0.2 && T > 0 ? Math.abs(Math.sin(T * 2.2)) * 3 : 0) : 0, y = Yc - pe;
    c.save(); c.globalAlpha = a;
    if (i === 2){ ab2Sombra(c,x,Yc + 2,34,6,0.3); rr(c,x - 25,Yc - 20,50,22,4); fs(c,'#B98A56',2.4); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x - 22,Yc - 18,44,3); }
    else ab2Sombra(c,x,Yc + 2,36,6,0.3 * a);
    ab2EsCrianca(c,x,y,sk,Object.assign({ t:T,semSombra:true,olha:1,fecha:i === 2 && e.provou > 0.5,
      bracoD:i === 2 && e.provou > 0.5 ? [[13,-30],[8,-38]] : undefined,bracoE:i === 2 && e.provou > 0.5 ? [[-13,-30],[-8,-38]] : undefined },k));
    c.restore();
  });
  if (e.colherNaMao) abColher(c,e.colherNaMao[0],e.colherNaMao[1],null,0,AB_COR.molho);
}
Object.assign(AB2_CENAS, {
  /* 6, a escola: duas crianças de mochila chegam correndo (a sineta) e entram pelo portão aberto; a Dani mexe a panela e mostra a colher; a criança do banquinho prova,
     fecha os olhos e sobem corações; a Dani ri e bate palmas, e o vapor sobe da panela */
  escola(c,p,T,cam){
    const K = AB2_CASA, Y = AB2.chao, Yc = AB2_ES.chao, sk = abEsc('biaCrianca',1.38 * 0.7), sf = abEsc('biaCrianca',1.38 * 0.85), sd = abEsc('dani',1.38 * 0.7), Pn = AB2_ES.panela;
    const ent = abSuave(abSeg(p,0.285,0.305)), entrou = [ent,ent], prova = abSuave(abSeg(p,0.55,0.62)) * (1 - abSuave(abSeg(p,0.76,0.82))), provou = abSuave(abSeg(p,0.58,0.66));
    // a mão da Dani: repouso, a panela (mexendo), a colher no alto, a criança, de volta à panela, e as palmas
    const mex = abSuave(abSeg(p,0.3,0.34)) * (1 - abSuave(abSeg(p,0.4,0.43))), mostra = abSuave(abSeg(p,0.4,0.46)) * (1 - abSuave(abSeg(p,0.5,0.56))), dar = abSuave(abSeg(p,0.5,0.58)) * (1 - abSuave(abSeg(p,0.76,0.82)));
    const palmas = abSuave(abSeg(p,0.82,0.88)), ri = p >= 0.8 ? 1 : 0, sx = T > 0 ? Math.sin(T * 5) * 7 * mex : 0;
    let hand = [AB2_ES.dani - 15.5 * sd,Yc - 17 * sd];
    const alvoPanela = [652 + sx,Yc - 92 + sx * 0.1], alvoAlto = [636,352], alvoCrianca = [626,388];
    hand = abLerp(hand,alvoPanela,Math.max(mex,palmas > 0 ? 0 : 0));
    if (mostra > 0) hand = abLerp(hand,alvoAlto,mostra);
    if (dar > 0) hand = abLerp(hand,alvoCrianca,dar);
    const guarda = p > 0.56 && p < 0.58 ? 0 : 0;
    let colher = null;   // na mão da Dani entre 0,3 e 0,82, fora da panela
    const seg = mex > 0 || mostra > 0 || dar > 0 || (p > 0.3 && p < 0.82);
    if (seg && p < 0.82){
      const tip = mostra > 0.01 && dar < 0.5 ? [hand[0] - 14,hand[1] - 36] : (dar > 0.5 ? [hand[0] - 24,hand[1] - 3] : (mex > 0.01 ? [Pn[0] - 2,Pn[1] - 42] : [hand[0] - 14,hand[1] - 30]));
      colher = [[hand[0] + 6,hand[1] + 4],tip];
    }
    const e = { hand,colherNaMao:colher,palmas,ri,vapor:p >= 0.78,entrou,provou };
    // as crianças que chegam: correm pela calçada de cada lado (85% do tamanho) e entram pelo portão
    const vem = abSuave(abSeg(p,0.02,0.24)), cx = [-70 + (AB2_ES.crianca[0] + 70) * vem,1290 + (AB2_ES.crianca[1] - 1290) * vem];
    ab2RuaCasa(c,cam,1,{ T,letras:1,dia:1,letreiro:'Cozinha da Rosa',dentro:cc => ab2EsDentro(cc,T,e),
      gente: cc => {
        const fora = 1 - ent;
        if (fora > 0.01){
          const sobe = abSuave(abSeg(p,0.22,0.3));
          [0,1].forEach(i => {
            const x = cx[i], yy = Y - (Y - Yc) * sobe, ss = sf + (sk - sf) * sobe, k = AB2_ES_KIDS[i], run = vem > 0.001 && vem < 0.999;
            cc.save(); cc.globalAlpha = fora; ab2Sombra(cc,x,yy + 4,40,7,0.32 * fora);
            ab2EsCrianca(cc,x,yy,ss,Object.assign({ t:T,semSombra:true,mochila:true,corre:run,ph:T * 16 + i * 2,olha:i ? -1 : 1 },k)); cc.restore();
          });
        }
        if (prova > 0 || provou > 0) ab2Mimos(cc,AB2_ES.crianca[2] + 4,Yc - 20 - 127 - 4,T,provou * (1 - abSeg(p,0.9,1) * 0.6));
      } });
    return { dani:[AB2_ES.dani,Yc - AB_ALT.dani * 0.7 - 6,0] };
  }
});

/* ---------- a varanda do Terraço, à noite (v11.18: a cena 7, ceu) ---------- */
// as medidas (docs/FINAL.md §8): o tampo do parapeito em y 400, o piso a partir de 486; as três estrelas juntas no alto do centro (a do meio, a da Rosa, maior); os dois vasos e o cordão de luzinhas
const AB2_VA = { tampo:400, chao:486, estrelas:[[554,134,15],[666,134,15],[610,120,24]], vasos:[150,1070], cordaY:318, cordaSag:76 };
// um ponto do cordão de luzinhas (t de 0 a 1): uma curva, de um vaso ao outro
function ab2VaCorda(t){
  const V = AB2_VA, x0 = V.vasos[0] + 6, x1 = V.vasos[1] - 6, y0 = V.cordaY, cx = (x0 + x1) / 2, cy = y0 + V.cordaSag * 2, u = 1 - t;
  return [u * u * x0 + 2 * u * t * cx + t * t * x1,u * u * y0 + 2 * u * t * cy + t * t * y0];
}
// o céu e as estrelas (fundo, paralaxe 0,5): o degradê da noite, muitas estrelas pequenas e as três juntas; pisca (0 a 1): a do meio brilha mais
function ab2VaCeu(c,T,pisca){
  const V = AB2_VA, g = c.createLinearGradient(0,-300,0,430); g.addColorStop(0,AB_COR.noite); g.addColorStop(1,AB_COR.noite2);
  c.fillStyle = g; c.fillRect(-300,-420,TW + 600,880);
  for (let i = 0; i < 90; i++){
    const x = (i * 197) % 1500 - 140, y = ((i * 83) % 330) - 40, r = (0.8 + (i % 4) * 0.35) * (T > 0 ? 0.75 + Math.abs(Math.sin(T * 1.6 + i * 1.9)) * 0.5 : 1);
    c.fillStyle = 'rgba(255,255,255,' + (0.55 + (i % 3) * 0.12).toFixed(2) + ')'; circ(c,x,y,r); c.fill();
  }
  V.estrelas.forEach((q,i) => {   // as três: um halo pequeno e a estrela de oito pontas; a do meio, maior, brilha mais quando pisca
    const meio = i === 2, r = q[2] * (meio ? 1 + pisca * 0.8 : 1) + (T > 0 ? Math.sin(T * 2.6 + i * 2) * (meio ? 1.6 : 1) : 0);
    c.save(); c.globalCompositeOperation = 'screen'; ab2Luz(c,q[0],q[1],r * 3.4,'200,222,255',(meio ? 0.55 : 0.4) + pisca * 0.3 * (meio ? 1 : 0)); c.restore();
    c.fillStyle = '#FFF8DC'; c.beginPath();
    for (let k = 0; k < 8; k++){ const an = k * Math.PI / 4 - Math.PI / 2, rad = k % 2 ? r * 0.3 : r; c.lineTo(q[0] + Math.cos(an) * rad,q[1] + Math.sin(an) * rad); }
    c.closePath(); c.fill();
  });
}
// a cidade lá embaixo, em duas camadas, e a avenida de luzinhas (cada uma na sua paralaxe)
function ab2VaCidade(c,T,perto){
  const V = AB2_VA;
  if (!perto){ ab2TeSkyline(c,-200,TW + 200,V.tampo - 26,'#2A3260','rgba(255,214,120,.55)',3,0.8); return; }
  ab2TeSkyline(c,-200,TW + 200,V.tampo - 2,'#1B2245','rgba(255,200,100,.85)',1,1.05);
  for (let i = 0; i < 90; i++){   // a avenida: luzinhas amarelas e vermelhas em fila, com um brilho que pulsa de leve
    const x = -150 + i * 16.5 + (i * 7) % 5, y = V.tampo - 8 - (i % 3) * 3, a = 0.7 + (T > 0 ? Math.sin(T * 1.8 + i) * 0.22 : 0);
    c.fillStyle = (i % 7 === 3 ? 'rgba(255,110,90,' : 'rgba(255,226,140,') + a.toFixed(2) + ')'; circ(c,x,y,1.9); c.fill();
  }
}
// o parapeito de pedra clara com os balaústres, o piso de lajota e os dois vasos (meio: onde as pessoas pisam)
function ab2VaMeio(c,T){
  const V = AB2_VA, y0 = V.tampo, y1 = V.chao;
  const gp = c.createLinearGradient(0,y0,0,y1); gp.addColorStop(0,'#BFC4DE'); gp.addColorStop(1,'#8E94B8'); c.fillStyle = gp; c.fillRect(-260,y0 + 14,TW + 520,y1 - y0 - 14);
  for (let x = -230; x < TW + 260; x += 56){   // os balaústres
    ell(c,x,y0 + 34,10.5,8); fs(c,'#E6E9F5',2); rr(c,x - 4,y0 + 40,8,16,3); fs(c,'#D5D9EC',1.8); ell(c,x,y0 + 64,9.5,9); fs(c,'#E6E9F5',2); rr(c,x - 8,y0 + 71,16,7,2); fs(c,'#CDD2E8',1.8);
  }
  rr(c,-260,y0 - 2,TW + 520,17,6); fs(c,'#EEF0FA',3); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-250,y0 + 1,TW + 500,3);   // o tampo
  rr(c,-260,y1 - 14,TW + 520,15,5); fs(c,'#D3D7EA',2.8);
  // o piso de lajota, em perspectiva
  const gl = c.createLinearGradient(0,y1,0,H + 160); gl.addColorStop(0,'#9096B8'); gl.addColorStop(1,'#6E749A'); c.fillStyle = gl; c.fillRect(-260,y1 + 1,TW + 520,H + 160 - y1);
  c.strokeStyle = 'rgba(38,40,84,.34)'; c.lineWidth = 2; c.beginPath();
  for (let k = -16; k <= 16; k++){ c.moveTo(610 + k * 40,y1 + 1); c.lineTo(610 + k * 120,H + 160); }
  for (let j = 0, y = y1 + 22; y < H + 160; j++, y += 22 + j * 9){ c.moveTo(-260,y); c.lineTo(TW + 260,y); }
  c.stroke();
  const gs = c.createLinearGradient(0,y1,0,y1 + 40); gs.addColorStop(0,'rgba(30,32,70,.4)'); gs.addColorStop(1,'rgba(30,32,70,0)'); c.fillStyle = gs; c.fillRect(-260,y1 + 1,TW + 520,40);
  // os dois vasos com plantas, em cima do tampo, e uma estaca onde o cordão se prende
  V.vasos.forEach((x,i) => {
    const d = i ? -1 : 1;
    c.strokeStyle = PAL.tinta; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x,y0 - 30); c.lineTo(x + d * 6,V.cordaY); c.stroke(); c.strokeStyle = '#8A6A4A'; c.lineWidth = 3; c.stroke();
    [[-2.3,78,16,'#2C7A52'],[-1.9,92,15,'#3A9462'],[-1.6,100,14,'#2C7A52'],[-1.3,88,15,'#3A9462'],[-0.9,74,16,'#2C7A52'],[-2.7,56,13,'#3A9462'],[-0.5,56,13,'#3A9462']].forEach((q,j) => ab2Folha(c,x,y0 - 36,q[0] + (T > 0 ? Math.sin(T * 0.9 + i * 2 + j) * 0.035 : 0),q[1],q[2],q[3]));
    c.beginPath(); c.moveTo(x - 27,y0 - 40); c.lineTo(x + 27,y0 - 40); c.lineTo(x + 19,y0 - 1); c.lineTo(x - 19,y0 - 1); c.closePath(); fs(c,'#B5683F',3);
    rr(c,x - 30,y0 - 46,60,10,4); fs(c,'#C97B4A',2.6); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x - 22,y0 - 34,6,28);
  });
}
// a palmeira (borda direita) e a ponta da espreguiçadeira (borda esquerda), em silhueta, na frente de tudo
function ab2VaFrente(c,T){
  const sw = i => T > 0 ? Math.sin(T * 0.8 + i * 1.7) * 0.025 : 0;
  c.strokeStyle = '#0E1426'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(1316,H + 60); c.quadraticCurveTo(1290,360,1264,250); c.stroke();
  [[-2.55,330,46],[-2.2,360,52],[-1.9,330,50],[-1.6,290,46],[-2.95,250,40],[-3.3,230,36]].forEach((q,i) => ab2Folha(c,1264,250,q[0] + sw(i),q[1],q[2],i % 2 ? '#0E1A22' : '#101A2A'));
  // a espreguiçadeira: o encosto inclinado e a perna, com as ripas
  c.strokeStyle = '#121830'; c.lineWidth = 46; c.lineCap = 'round'; c.beginPath(); c.moveTo(-90,H + 20); c.lineTo(112,474); c.stroke();
  c.strokeStyle = 'rgba(120,130,190,.28)'; c.lineWidth = 3; c.lineCap = 'butt'; for (let i = 0; i < 6; i++){ c.beginPath(); c.moveTo(-60 + i * 30,H + 30 - i * 24 - 28); c.lineTo(-40 + i * 30,H + 30 - i * 24 + 20); c.stroke(); }
  c.strokeStyle = '#121830'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(30,520); c.lineTo(48,H + 80); c.stroke();
}
/* a varanda do Terraço, à noite. o: { T, pisca (0 a 1: a estrela do meio brilha forte), gente(c): as pessoas (no meio, na frente do parapeito) } */
function ab2Varanda(c,cam,o){
  o = o || {};
  const T = o.T || 0, V = AB2_VA;
  ab2Camada(c,cam,0.5,() => ab2VaCeu(c,T,o.pisca || 0));
  ab2Camada(c,cam,0.7,() => ab2VaCidade(c,T,false));
  ab2Camada(c,cam,0.85,() => ab2VaCidade(c,T,true));
  ab2Camada(c,cam,1,() => {
    ab2VaMeio(c,T);
    // o cordão de luzinhas: o fio e as lâmpadas, de um vaso ao outro
    c.strokeStyle = 'rgba(18,20,44,.85)'; c.lineWidth = 2.4; c.beginPath(); for (let i = 0; i <= 40; i++){ const q = ab2VaCorda(i / 40); i ? c.lineTo(q[0],q[1]) : c.moveTo(q[0],q[1]); } c.stroke();
    for (let i = 0; i <= 26; i++){ const q = ab2VaCorda(i / 26), a = T > 0 ? 0.88 + Math.sin(T * 2.3 + i * 1.3) * 0.12 : 1; c.globalAlpha = a; circ(c,q[0],q[1] + 5,4.6); fs(c,'#FFE08A',1.5); c.globalAlpha = 1; }
    c.save(); c.globalCompositeOperation = 'screen';   // o brilho de cada lâmpada, atrás das pessoas (para não esbranquiçar)
    for (let i = 0; i <= 26; i++){ const q = ab2VaCorda(i / 26); ab2Luz(c,q[0],q[1] + 5,30,'255,214,120',0.3); }
    c.restore();
    if (o.gente) o.gente(c);
  });
  ab2Camada(c,cam,1.2,() => ab2VaFrente(c,T));
  ab2Clima(c,'50,60,120',0.1);
  ab2Vinheta(c,0.5);
}

Object.assign(AB2_CENAS, {
  /* 7, o céu: a varanda do Terraço à noite; a câmera desce das três estrelas (a do meio pisca) até a cidade e o parapeito; a Bia (de coque e colete, de costas) e o Tonhão chegam ao parapeito;
     ela aponta para a estrela do meio; ele passa o braço pelos ombros dela; a estrela pisca forte duas vezes e ela encosta a cabeça no ombro dele */
  ceu(c,p,T,cam){
    const Y = AB2.chao, K = AB2.k, st = abEsc('tonhao',K * 0.78), sb = st * 0.86, C = BIA_ROUPA_COR, N0 = ab2Noite, N = cor => N0(cor,0.14);
    const entra = abSuave(abSeg(p,0.24,0.3)), aponta = abSuave(abSeg(p,0.3,0.4)) * (1 - abSuave(abSeg(p,0.74,0.82))), abraca = abSuave(abSeg(p,0.5,0.6)), encosta = abSuave(abSeg(p,0.8,0.9));
    const pisca = Math.max(Math.sin(abSeg(p,0.1,0.18) * Math.PI) * 0.5, Math.abs(Math.sin(abSeg(p,0.78,0.96) * 2 * Math.PI)));
    const bx = 556 + 10 * encosta, tx = 668;
    ab2Varanda(c,cam,{ T, pisca, gente: cc => {
      cc.globalAlpha = entra;
      const sob = (1 - entra) * 12, lean = 0.07 * encosta;
      ab2Sombra(cc,tx,Y + 4,104,13,0.4 * entra); ab2Sombra(cc,556,Y + 4,88,12,0.4 * entra);
      abCostas(cc,tx,Y + sob,st,{ roupa:N('#ffffff'), calca:N('#3A3F4A'), pele:N('#B9794B'), cabelo:'toca', cor:N('#8C8C8C') });
      // o braço dele: ao lado do corpo, e (de p 0,5 a 0,6) por cima dos ombros dela
      const mao = [(bx - 22 * sb * Math.cos(lean) - tx) / st,(Y - 78 * sb - Y) / st];
      ab2BracoDe(cc,tx,Y + sob,st,[[-19,-76],abLerp([-25,-60],[(-19 + mao[0]) / 2 - 4,(-76 + mao[1]) / 2 + 2],abraca),abLerp([-25,-44],mao,abraca)],N('#ffffff'),N('#B9794B'));
      ab2BracoDe(cc,tx,Y + sob,st,[[19,-76],[25,-60],[25,-44]],N('#ffffff'),N('#B9794B'));
      // a Bia, de costas: o braço de fora aponta para a estrela do meio
      cc.save(); cc.translate(bx,Y + sob); cc.rotate(lean); cc.translate(-bx,-Y - sob);
      ab2Vivo(cc,bx,Y + sob,T,0.7,() => {
        abCostas(cc,bx,Y + sob,sb,{ roupa:N(C.colete), calca:N(C.saiaEsc), pele:N('#6B3F25'), cabelo:'coque', cor:N(C.cabelo), rosa:N(C.rosa) });
        const sh = [bx + 17 * sb,Y + sob - 80 * sb], alvo = [610,120], d = Math.hypot(alvo[0] - sh[0],alvo[1] - sh[1]), len = 150 * sb / 1.87;
        const mA = [sh[0] + (alvo[0] - sh[0]) / d * len,sh[1] + (alvo[1] - sh[1]) / d * len], rep = [bx + 26 * sb,Y + sob - 44 * sb];
        const m = abLerp(rep,mA,aponta), cot = abLerp([bx + 26 * sb,Y + sob - 62 * sb],[(sh[0] + m[0]) / 2 + 12,(sh[1] + m[1]) / 2],aponta);
        abBraco(cc,[sh,cot,m],N(C.colete),N('#6B3F25'),7 * sb);
      });
      cc.restore();
      cc.globalAlpha = 1;
    } });
    return { bia:[bx,Y - 142 * sb,-150], tonhao:[tx,Y - 140 * st,150] };
  }
});

/* ---------- a cena 8, roda: a cozinha de casa de novo (v11.18) ---------- */
Object.assign(AB2_CENAS, {
  /* 8, a roda: a mesma cozinha e a mesma câmera da cena 1 da abertura; a Bia adulta (avental florido da mãe) mexe a panela e cantarola, no lugar da Rosa, e uma criança do bairro espia
     de trás do batente; ela vira o rosto, sorri e diz a frase; tira a colher, sopra e estende; a criança entra de mãos juntas, prova, fecha os olhos e cora; sobem corações;
     a foto da Rosa, na parede, ganha um halo dourado e o título "Fim" entra no alto */
  roda(c,p,T,cam){
    const Z = AB2_COZ, P = Z.porta, K = AB2.k, Y = AB2.chao, sb = abEsc('bia',K), rim = Z.molho, kx1 = 440;
    const virou = abSuave(abSeg(p,0.34,0.42)), sai = abSuave(abSeg(p,0.54,0.6)), tira = abSuave(abSeg(p,0.55,0.62)), estende = abSuave(abSeg(p,0.62,0.74)), volta = abSuave(abSeg(p,0.82,0.9));
    const entra = abSuave(abSeg(p,0.55,0.74)), cora = abSuave(abSeg(p,0.74,0.8)), fecha = p >= 0.76 && p < 0.9, halo = abSuave(abSeg(p,0.78,0.86)), ti = T > 0 ? abSeg(p,0.835,0.915) : 1;   // o título entra em cima (com movimento reduzido, já está lá)
    // a Bia: ao lado da panela; quando a colher sai, dá um passo para a criança
    const bx = 580 - 20 * sai, anda = sai > 0.001 && sai < 0.999;
    const a = T > 0 ? T * 3.2 : 0.6;
    const ponta0 = [Z.panela[0] + 2 + Math.cos(a) * 17 * (1 - tira),rim + 2 + Math.sin(a) * 3 * (1 - tira)];   // a ponta da colher, mexendo (como a Rosa da cena 1)
    // a criança: no corredor, depois pelo chão da cozinha, até a frente da Bia
    const fora = abSuave(abSeg(p,0.1,0.24)) * 9 + virou * 6, vem = abSuave(clamp(entra * 1.7,0,1));
    const kx = P.x + 8 + fora + (kx1 - P.x - 8 - 15) * entra, ky = Z.rodape + (Y - Z.rodape) * vem, sk = abEsc('biaCrianca',K * (0.86 + 0.14 * vem)), kb = sk * 0.74;
    // a colher: da panela, sobe, vai à boca da criança e, no fim, volta para a mão da Bia
    const tipo = [kx1 + 16,Y - 37 * abEsc('biaCrianca',K) * 0.74];
    const lev = [Z.panela[0] - 8,rim - 64], L3 = (u,v,k) => [u[0] + (v[0] - u[0]) * k,u[1] + (v[1] - u[1]) * k];
    let ponta = L3(L3(ponta0,lev,tira),tipo,estende);
    ponta = L3(ponta,[bx - 30,Y - 20 * sb],volta);
    const vm = L3(L3([-34,-16],[6,-14],tira),[44,-10],estende), vmv = L3(vm,[-20,-4],volta);
    const mao = [ponta[0] + vmv[0],ponta[1] + vmv[1]], cabo = [ponta[0] + vmv[0] * 1.42,ponta[1] + vmv[1] * 1.42];
    const ml = [(mao[0] - bx) / sb,(mao[1] - Y) / sb];
    const corte = P.x - 90 * abSuave(abSeg(entra,0.02,0.26));
    const kid = cc => abCrianca(cc,kx,ky,sk,{ pele:2,cabelo:6,cor:'#1B1512',camisa:'#3C7BD9',calca:'#3C5A4A',t:T,sd:1.4,olha:1,fecha,
      andando:false,bracoE:[[-11,-24],[-2.5,-31]],bracoD:[[11,-24],[2.5,-31]] });
    ab2Cozinha(c,cam,'tarde',{ T, banco:[446,470], foto:true, fotoHalo:halo,
      atras: entra <= 0.02 ? (cc => { kid(cc); }) : null,   // espiando: no corredor, recortada pelo vão da porta
      gente: cc => {
        if (entra <= 0.02){   // os dedinhos no batente
          const hy = ky - 27 * kb; rr(cc,P.x - 9,hy - 9,15,20,6); fs(cc,SKINS[2],2.2);
          cc.strokeStyle = 'rgba(34,32,28,.5)'; cc.lineWidth = 1.5; cc.beginPath(); cc.moveTo(P.x - 7,hy - 2); cc.lineTo(P.x + 3,hy - 2); cc.moveTo(P.x - 7,hy + 4); cc.lineTo(P.x + 3,hy + 4); cc.stroke();
        }
        ab2Sombra(cc,bx - 14,Y + 3,82,13,0.42);
        ab2Vivo(cc,bx,Y,T,0,() => abBia(cc,bx,Y,{ roupa:1,t:T,olha:-1.8 * virou,moving:anda,ph:T * 10,maos:[[-15,-18],[ml[0],ml[1],(10 + ml[0]) / 2,(-30 + ml[1]) / 2 + 6]] }));
        ab2Notinhas(cc,bx + 46,Y - 236,T,1 - abSeg(p,0.36,0.44));
        if (entra > 0.02){
          ab2Sombra(cc,kx - 8,ky + 3,50,9,0.4 * vem); cc.save(); cc.beginPath(); cc.rect(corte,-200,TW + 400,H + 400); cc.clip(); kid(cc); cc.restore();   // entrando: na frente de tudo
          if (cora > 0){ cc.fillStyle = 'rgba(238,84,116,' + (0.42 * cora).toFixed(3) + ')'; ell(cc,kx - 7.6 * kb,ky - 37.4 * kb,2.9 * kb,2.1 * kb); cc.fill(); ell(cc,kx + 7.6 * kb,ky - 37.4 * kb,2.9 * kb,2.1 * kb); cc.fill(); }
          ab2Mimos(cc,kx + 6,ky - 62 * kb,T,cora * (1 - abSeg(p,0.92,1) * 0.5));
        }
        abColher(cc,cabo,ponta,mao.concat('#6B3F25'),3.8 * sb,volta < 0.5 && tira < 0.5 ? AB_COR.molho : (estende > 0.6 && volta < 0.5 ? AB_COR.molho : PAL.madeira));   // a colher por cima de tudo, com o molho até a criança provar
      } });
    if (ti > 0){ c.globalAlpha = ti; txt(c,'Fim',TW / 2,56,80,PAL.mostarda,'center',FD,10); c.globalAlpha = 1; }
    return { bia:[bx,Y - AB_ALT.bia * K - 8,-180] };
  }
});

/* ---------- os créditos (v11.18): a rua de casa à noite, com a garagem acesa como escola ---------- */
Object.assign(AB2_CENAS, {
  /* os créditos: a rua de casa à noite, o portão aberto e a garagem acesa como a escola, com o letreiro "Cozinha da Rosa" e a estrela da Rosa piscando (a cada 2 s); ninguém na calçada;
     por cima, três textos que entram por transparência (sem legenda, balão nem bolinhas). Com movimento reduzido, tudo à vista e a estrela parada em 0,5 */
  creditos(c,p,T,cam){
    const Yc = AB2_ES.chao, sd = abEsc('dani',1.38 * 0.7);
    const pisca = T > 0 ? 1 - Math.abs(((T % 2) / 2) * 2 - 1) : 0.5;
    const e = { hand:[AB2_ES.dani - 15.5 * sd,Yc - 17 * sd],colherNaMao:null,palmas:1,ri:1,vapor:true,entrou:[1,1],provou:0 };
    ab2RuaCasa(c,cam,1,{ T,letras:1,pisca,letreiro:'Cozinha da Rosa',dentro:cc => ab2EsDentro(cc,T,e) });
    const a = d => T > 0 ? abSeg(p,d,d + 0.1) : 1;
    [['Lanchonete Corre-Corre',46,60,PAL.mostarda,FD,8,0.1],['O sonho da Bia',98,32,PAL.creme,FD,5,0.25],['Obrigado por jogar!',136,26,PAL.creme,FB,4,0.45]].forEach(q => {
      const al = a(q[6]); if (al <= 0) return;
      c.globalAlpha = al; txt(c,q[0],TW / 2,q[1],q[2],q[3],'center',q[4],q[5],TW - 120); c.globalAlpha = 1;
    });
    return {};
  }
});
