/* ============================================================
   ABERTURA (v8.5): o desenho das cenas do sonho da Bia
   Cada cena desenha o fundo e as pessoas a partir de p (0 a 1, o andamento) e T (o relógio, parado com movimento
   reduzido) e devolve onde fica a cabeça de quem fala, para os balões. Embaixo, a faixa da legenda e as bolinhas
   das cenas; por cima, o escuro da entrada e da saída (sem ele com movimento reduzido)
   ============================================================ */
const AB_CHAO = 470;   // linha do chão das cenas (a faixa da legenda começa em 500)
const AB_COR = { rosa:'#C8506A', petala:'#F07A9A', noite:'#1E2A4A', noite2:'#3A3F6E', aurora:'#7A2E3A', ouro:'#F2C23D' };
const abSeg = (p,a,b) => clamp((p - a) / (b - a), 0, 1);
const abSuave = p => p * p * (3 - 2 * p);

/* ---------- pessoas ---------- */
function abFlor(c,x,y,r){
  for (let i=0;i<5;i++){ const a = i * TAU / 5 - Math.PI / 2; circ(c,x + Math.cos(a)*r,y + Math.sin(a)*r,r*0.75); fs(c,AB_COR.petala,1.2); }
  circ(c,x,y,r*0.55); fs(c,AB_COR.ouro,1.2);
}
// a Rosa, mãe da Bia: coque com uma rosa no cabelo e avental
function abRosa(c,x,y,s,o){
  o = o || {};
  c.save(); c.translate(x,y); c.scale(o.flip || 1,1);   // flip -1: espelhada (a mão erguida fica do lado esquerdo)
  drawPerson(c,{ skin:3, hair:2, hairC:'#1B1512', pants:'#4A4036' },0,0,{ s, shirt:o.roupa || AB_COR.rosa, mood:o.mood || 0, handUp:!!o.aceno, t:o.t || 0, moving:!!o.andando, ph:o.ph || 0 });
  c.scale(s,s);
  if (o.avental !== false){ c.beginPath(); c.moveTo(-8,-29); c.lineTo(8,-29); c.lineTo(11,-12); c.lineTo(-11,-12); c.closePath(); fs(c,o.avental || '#fff',2); }
  abFlor(c,9,-53,3.2);
  c.restore();
}
// a Bia criança: cabelão redondo com laço amarelo e vestido mostarda
function abBiaCrianca(c,x,y,s,o){
  o = o || {};
  drawPerson(c,{ kid:true, skin:4, hair:3, hairC:'#15100D', pants:'#7B4A2C' },x,y,{ s, shirt:PAL.mostarda, handUp:!!o.aceno, t:o.t || 0, mood:o.mood || 0, sit:!!o.sentada, noShadow:!!o.sentada });
  c.save(); c.translate(x,y + (o.sentada ? 12 * 0.74 * s : 0)); c.scale(s*0.74,s*0.74);
  c.beginPath(); c.moveTo(12,-58); c.lineTo(20,-64); c.lineTo(20,-52); c.closePath(); fs(c,PAL.alerta,1.5);
  c.beginPath(); c.moveTo(12,-58); c.lineTo(4,-66); c.lineTo(5,-53); c.closePath(); fs(c,PAL.alerta,1.5);
  c.restore();
}
// braço com contorno: ombro, (cotovelo) e mão
function abBraco(c,pts,cor,mao,larg){
  larg = larg || 7;
  c.lineCap = 'round'; c.lineJoin = 'round';
  [[PAL.tinta, larg + 4],[cor, larg]].forEach(k => {
    c.strokeStyle = k[0]; c.lineWidth = k[1]; c.beginPath(); c.moveTo(pts[0][0],pts[0][1]);
    for (let i=1;i<pts.length;i++) c.lineTo(pts[i][0],pts[i][1]); c.stroke();
  });
  const m = pts[pts.length-1]; circ(c,m[0],m[1],5); fs(c,mao,1.8);
}
// o Tonhão de corpo inteiro: dólmã branco, bigodão; o: toca, braco ('aceno' | 'flex' | 'mexe'), andando, ph, mood, flip
function abTonhao(c,x,y,s,o){
  o = o || {};
  const pele = '#B9794B', roupa = o.roupa || '#fff', sw = o.andando ? Math.sin(o.ph || 0) * 6 : 0;
  const bob = o.andando && !RM ? -Math.abs(Math.sin(o.ph || 0)) * 3 : 0;
  c.save(); c.translate(x,y); c.scale(s * (o.flip || 1),s);
  shadowEll(c,0,0,24,6,0.22);
  rr(c,-15+sw,-34,12,33,3); fs(c,'#3A3F4A',2.4); rr(c,3-sw,-34,12,33,3); fs(c,'#3A3F4A',2.4);
  ell(c,-9+sw,-1,8,4); fs(c,'#2c2a26',2); ell(c,9-sw,-1,8,4); fs(c,'#2c2a26',2);
  c.translate(0,bob);
  // braço de trás (esquerdo): mão na cintura no 'flex', solto nos outros
  if (o.braco === 'flex') abBraco(c,[[-19,-76],[-32,-56],[-19,-44]],roupa,pele);
  else abBraco(c,[[-19,-76],[-25,-44]],roupa,pele);
  // corpo
  c.beginPath(); c.moveTo(-23,-30); c.lineTo(-19,-82); c.lineTo(19,-82); c.lineTo(23,-30); c.closePath(); fs(c,roupa,2.6);
  c.fillStyle = PAL.tinta; [-70,-58,-46].forEach(b => { circ(c,-6,b,1.8); c.fill(); circ(c,6,b,1.8); c.fill(); });
  c.beginPath(); c.moveTo(-10,-82); c.lineTo(0,-73); c.lineTo(10,-82); c.closePath(); fs(c,PAL.formica,2);
  // braço da frente (direito)
  if (o.braco === 'aceno') abBraco(c,[[19,-76],[36,-112 + Math.sin((o.t || 0) * 9) * 5]],roupa,pele);
  else if (o.braco === 'flex'){
    abBraco(c,[[42,-72],[44,-104]],pele,pele,8);   // manga arregaçada: o antebraço de fora, mostrando o muque
    abBraco(c,[[19,-76],[42,-72]],roupa,roupa,9);
    rr(c,37,-79,11,14,3); fs(c,'#E9E4D8',1.6);       // a dobra da manga
  }
  else if (o.braco === 'mexe') abBraco(c,[[19,-76],[44,-58]],roupa,pele);
  else abBraco(c,[[19,-76],[25,-44]],roupa,pele);
  // cabeça
  const hy = -98;
  circ(c,0,hy,16); fs(c,pele,2.6);
  if (o.toca !== false){
    rr(c,-13,hy-20,26,12,2); fs(c,'#fff',2.4);
    c.beginPath(); c.arc(-9,hy-24,8,0,TAU); c.arc(0,hy-29,9,0,TAU); c.arc(9,hy-24,8,0,TAU); fs(c,'#fff',2.4);
    rr(c,-13,hy-20,26,8,2); c.fillStyle = '#fff'; c.fill();
  } else { c.beginPath(); c.arc(0,hy-2,16,Math.PI*1.08,Math.PI*1.92); c.lineTo(8,hy-11); c.lineTo(-8,hy-11); c.closePath(); fs(c,'#2a2320',2); }
  c.fillStyle = PAL.tinta; circ(c,-5.5,hy-3,1.9); c.fill(); circ(c,5.5,hy-3,1.9); c.fill();
  c.lineWidth = 2; c.beginPath();
  if (o.mood === 2){ c.moveTo(-9,hy-10); c.lineTo(-3,hy-7.5); c.moveTo(9,hy-10); c.lineTo(3,hy-7.5); }   // tristinho
  else { c.moveTo(-9,hy-8); c.lineTo(-3,hy-6.5); c.moveTo(9,hy-8); c.lineTo(3,hy-6.5); }
  c.stroke();
  c.beginPath(); c.moveTo(0,hy+4); c.bezierCurveTo(-5,hy-1,-16,hy+1,-16,hy+7); c.bezierCurveTo(-12,hy+5,-5,hy+7,0,hy+6); c.bezierCurveTo(5,hy+7,12,hy+5,16,hy+7); c.bezierCurveTo(16,hy+1,5,hy-1,0,hy+4); c.closePath(); fs(c,'#1B1512',2);
  c.strokeStyle = PAL.tinta; c.lineWidth = 1.8; c.beginPath();
  if (o.mood === 2) c.arc(0,hy+15,4,Math.PI+0.4,TAU-0.4); else c.arc(0,hy+10,4,0.3,Math.PI-0.3);
  c.stroke();
  c.restore();
}
// o chef Bráulio: toca alta, bigodinho enrolado, nariz empinado e a plaquinha da estrela nas mãos
function abBraulio(c,x,y,s,o){
  o = o || {};
  const pele = '#F2C9A5';
  c.save(); c.translate(x,y); c.scale(s,s);
  shadowEll(c,0,0,24,6,0.22);
  rr(c,-14,-34,11,33,3); fs(c,'#2B2B33',2.4); rr(c,3,-34,11,33,3); fs(c,'#2B2B33',2.4);
  ell(c,-8,-1,8,4); fs(c,'#1b1b1b',2); ell(c,8,-1,8,4); fs(c,'#1b1b1b',2);
  c.beginPath(); c.moveTo(-21,-30); c.lineTo(-18,-84); c.lineTo(18,-84); c.lineTo(21,-30); c.closePath(); fs(c,'#fff',2.6);
  c.fillStyle = '#C9A227'; [-72,-60].forEach(b => { circ(c,-6,b,2); c.fill(); circ(c,6,b,2); c.fill(); });
  c.beginPath(); c.moveTo(-9,-84); c.lineTo(0,-76); c.lineTo(9,-84); c.closePath(); fs(c,'#2B2B33',2);
  const hy = -100;
  circ(c,0,hy,15); fs(c,pele,2.6);
  rr(c,-12,hy-56,24,42,6); fs(c,'#fff',2.4);                                    // a toca alta
  c.strokeStyle = '#D9D9D9'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-4,hy-52); c.lineTo(-4,hy-18); c.moveTo(4,hy-52); c.lineTo(4,hy-18); c.stroke();
  rr(c,-14,hy-20,28,8,2); fs(c,'#fff',2.2);
  // olhos fechados de orgulho e o nariz empinado
  c.strokeStyle = PAL.tinta; c.lineWidth = 2;
  c.beginPath(); c.arc(-5.5,hy-3,2.6,Math.PI,TAU); c.moveTo(8.1,hy-3); c.arc(5.5,hy-3,2.6,0,Math.PI,true); c.stroke();
  c.beginPath(); c.moveTo(1,hy-1); c.lineTo(6,hy+4); c.lineTo(1,hy+5); c.stroke();
  // bigodinho enrolado
  c.lineWidth = 2.4; c.beginPath();
  c.moveTo(0,hy+8); c.quadraticCurveTo(-8,hy+5,-12,hy+8); c.arc(-12,hy+5,3,Math.PI/2,Math.PI*1.8);
  c.moveTo(0,hy+8); c.quadraticCurveTo(8,hy+5,12,hy+8); c.arc(12,hy+5,3,Math.PI/2,-Math.PI*0.8,true);
  c.stroke();
  c.lineWidth = 1.8; c.beginPath(); c.arc(0,hy+11,3.5,0.3,Math.PI-0.3); c.stroke();
  // os braços seguram a plaquinha na frente do peito, erguida (o: ergue de 0 a 1)
  const up = (o.ergue || 0) * 5;
  abBraco(c,[[-18,-78],[-22,-56 - up]],'#fff',pele);
  abBraco(c,[[18,-78],[22,-56 - up]],'#fff',pele);
  rr(c,-24,-80 - up,48,40,5); fs(c,'#5A3A22',2.4);
  rr(c,-19,-75 - up,38,30,3); fs(c,'#7A5232',1.6);
  star(c,0,-60 - up,12,AB_COR.ouro);
  c.restore();
}

/* ---------- cenário ---------- */
function abCeu(c,a,b,h){
  const g = c.createLinearGradient(0,0,0,h || 500); g.addColorStop(0,a); g.addColorStop(1,b);
  c.fillStyle = g; c.fillRect(0,0,TW,h || 500);
}
function abChao(c,cor,y){ c.fillStyle = cor; c.fillRect(0,y || AB_CHAO,TW,500 - (y || AB_CHAO)); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(0,y || AB_CHAO); c.lineTo(TW,y || AB_CHAO); c.stroke(); }
function abJanela(c,x,y,w,h,ceu,T,estrela){
  rr(c,x,y,w,h,6); fs(c,ceu,3);
  if (estrela) star(c,x + w*0.62,y + h*0.35,9 + (RM ? 0 : Math.sin(T*3) * 2),AB_COR.ouro);
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(x + w/2,y); c.lineTo(x + w/2,y + h); c.moveTo(x,y + h/2); c.lineTo(x + w,y + h/2); c.stroke();
}
// a cozinha de casa (cenas 1 e 6): azulejo, janela, fogão com panela e banquinho
function abCozinhaCasa(c,T,noite){
  c.fillStyle = noite ? '#D9CBB0' : PAL.piso2; c.fillRect(0,0,TW,AB_CHAO);
  c.fillStyle = noite ? '#C7DCD0' : PAL.piso1;
  for (let x=0;x<TW;x+=40) for (let y=250;y<AB_CHAO;y+=40) if (((x+y)/40)%2 === 0) c.fillRect(x,y,40,40);
  c.fillStyle = PAL.faixa; c.fillRect(0,236,TW,14);
  abJanela(c,150,70,200,140,noite ? AB_COR.noite : '#BFE3F7',T,!!noite);
  if (!noite){ c.fillStyle = '#fff'; ell(c,215,110,26,10); c.fill(); }
  c.fillStyle = 'rgba(200,80,106,.85)'; c.fillRect(140,62,30,156); c.fillRect(330,62,30,156);   // cortininhas
  abChao(c,noite ? '#8A7560' : '#B89A74');
  // bancada e fogão
  rr(c,860,330,300,140,6); fs(c,PAL.madeira,3);
  rr(c,850,316,320,20,4); fs(c,PAL.creme,3);
  rr(c,600,300,200,170,8); fs(c,'#F2F2EE',3);
  rr(c,618,380,164,70,6); fs(c,'#2E2E30',2.5);
  c.fillStyle = PAL.cromo; c.fillRect(632,392,136,6);
  rr(c,596,290,208,16,4); fs(c,'#3a3a3c',2.5);
  [628,660,740,772].forEach(x => { circ(c,x,318,6); fs(c,'#555',1.6); });
}
function abPanela(c,x,y,w,T,vapor,cor){
  rr(c,x - w/2,y - 50,w,52,8); fs(c,'#8E99A6',3);
  rr(c,x - w/2 - 6,y - 56,w + 12,10,4); fs(c,'#B9C2CC',2.5);
  c.fillStyle = cor || '#C2362B'; ell(c,x,y - 52,w/2 - 4,5); c.fill();
  if (vapor){
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 5; c.lineCap = 'round';
    for (let i=0;i<3;i++){
      const ph = T * 1.6 + i * 2.1, k = RM ? 0.5 : (ph % 1);
      c.globalAlpha = RM ? 0.7 : 1 - k;
      c.beginPath(); c.moveTo(x - 24 + i*24,y - 64 - k*40);
      c.bezierCurveTo(x - 34 + i*24,y - 84 - k*40,x - 14 + i*24,y - 94 - k*40,x - 24 + i*24,y - 114 - k*40); c.stroke();
    }
    c.globalAlpha = 1;
  }
}
// coraçõezinhos subindo da panela: comida é carinho
function abCoracoes(c,x,y,T,n){
  for (let i=0;i<n;i++){
    const k = RM ? (i + 1) / (n + 1) : ((T * 0.45 + i / n) % 1);
    c.globalAlpha = RM ? 0.9 : Math.min(1, (1 - k) * 2);
    heart(c,x + Math.sin(k * 6 + i) * 28,y - k * 150,9 + i % 2 * 3,'#E0559A');
  }
  c.globalAlpha = 1;
}
function abFachadaAurora(c,x,y,w,h,estrela){
  rr(c,x,y,w,h,4); fs(c,'#E9D8BF',3);
  c.fillStyle = 'rgba(122,46,58,.12)'; for (let i=0;i<w;i+=36) c.fillRect(x + i,y,2,h);
  // toldo listrado
  for (let i=0;i<10;i++){ c.fillStyle = i % 2 ? PAL.creme : AB_COR.aurora; c.fillRect(x + 20 + i*(w-40)/10,y + 70,(w-40)/10,34); }
  c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.strokeRect(x + 20,y + 70,w - 40,34);
  rr(c,x + w/2 - 150,y + 14,300,48,10); fs(c,AB_COR.aurora,3);
  txt(c,'Casa Aurora',x + w/2,y + 40,30,PAL.creme,'center',FD);
  if (estrela){ circ(c,x + w/2 + 120,y + 150,22); fs(c,'#5A3A22',2.5); star(c,x + w/2 + 120,y + 150,13,AB_COR.ouro); }
}

/* ---------- as cenas ---------- */
const AB_CENAS = {
  casa(c,p,T){
    abCozinhaCasa(c,T,false);
    abPanela(c,700,290,110,T,true);
    abCoracoes(c,700,210,T,3);
    // o banquinho e a Bia provando o molho
    rr(c,398,392,84,14,4); fs(c,PAL.madeira,2.5);
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(408,406); c.lineTo(402,AB_CHAO); c.moveTo(472,406); c.lineTo(478,AB_CHAO); c.stroke();
    c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 4; c.stroke();
    abBiaCrianca(c,440,394,2.6,{ t:T });
    // a colherinha de pau na boca
    c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 5; c.beginPath(); c.moveTo(474,316); c.lineTo(452,296); c.stroke(); ell(c,450,294,6,4); fs(c,'#C2362B',1.6);
    // a Rosa mexendo a panela
    const m = RM ? 0 : Math.sin(T * 4) * 8;
    abRosa(c,550,AB_CHAO,3.6,{ t:T });
    c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 6; c.beginPath(); c.moveTo(606,AB_CHAO - 56); c.lineTo(690 + m,232); c.stroke();
    return { rosa:[550,AB_CHAO - 215], bia:[440,240] };
  },
  aurora(c,p,T){
    abCeu(c,'#9FD3F0','#F7EFD8');
    abFachadaAurora(c,360,90,560,AB_CHAO - 90,false);
    rr(c,560,240,150,AB_CHAO - 240,6); fs(c,'#5A3A22',3);           // a porta
    rr(c,576,256,118,110,4); fs(c,'#F7E2A6',2.4);
    rr(c,750,200,140,150,6); fs(c,'#F7E2A6',3);                       // a janela, com o Tonhão
    c.save(); c.beginPath(); c.rect(750,200,140,150); c.clip();
    abTonhao(c,812,480,1.8,{ braco:'aceno', t:T });
    c.restore();
    c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.strokeRect(750,200,140,150);
    abChao(c,'#BDB6A8');
    // a Rosa vai da calçada até a porta; a Bia fica acenando
    const k = abSuave(abSeg(p,0.05,0.55)), rx = 250 + k * 330;
    abRosa(c,rx,AB_CHAO,3.6,{ roupa:'#fff', avental:'#E9E4D8', andando:k > 0 && k < 1, ph:T * 9 });
    abBiaCrianca(c,150,AB_CHAO,2.6,{ aceno:true, t:T });
    return { bia:[150,AB_CHAO - 130], tonhao:[812,196], rosa:[rx,AB_CHAO - 215] };
  },
  tempero(c,p,T){
    c.fillStyle = PAL.inox; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = '#fff'; for (let x=0;x<TW;x+=60) for (let y=0;y<AB_CHAO;y+=30) c.fillRect(x + (y/30%2)*30,y,56,26);
    abChao(c,'#8E99A6');
    rr(c,400,380,400,90,6); fs(c,'#C7CED6',3);                      // o fogão grande
    rr(c,390,366,420,18,4); fs(c,'#3a3a3c',2.5);
    // o molho fica dourado quando a pétala cai
    const cai = abSeg(p,0.2,0.62), pronto = p >= 0.62;
    abPanela(c,620,366,160,T,true,pronto ? '#D9502E' : '#C2362B');
    if (pronto){ for (let i=0;i<6;i++){ const a = i * TAU / 6 + (RM ? 0 : T * 2); star(c,620 + Math.cos(a)*70,282 + Math.sin(a)*18,5,AB_COR.ouro); } }
    abTonhao(c,470,AB_CHAO,2,{ braco:'mexe', t:T });
    // a Rosa, espelhada, com a mão erguida sobre a panela; a pétala cai girando
    abRosa(c,780,AB_CHAO,3.6,{ roupa:'#fff', avental:'#E9E4D8', aceno:true, t:0, flip:-1 });
    if (!pronto){
      const px = 718 - cai * 70 + (RM ? 0 : Math.sin(T * 5) * 8 * (1 - cai)), py = 282 + cai * 30;
      c.save(); c.translate(px,py); c.rotate(RM ? 0.4 : T * 3); ell(c,0,0,8,5); fs(c,AB_COR.petala,1.6); c.restore();
    }
    return { tonhao:[470,AB_CHAO - 275], rosa:[780,AB_CHAO - 215] };
  },
  estrela(c,p,T){
    c.fillStyle = '#5B2A33'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = 'rgba(242,194,61,.08)'; for (let x=0;x<TW;x+=80) c.fillRect(x,0,40,AB_CHAO);
    abChao(c,'#3B2420');
    // o lustre e o foco no chef
    c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(560,0); c.lineTo(560,40); c.stroke();
    ell(c,560,50,50,14); fs(c,AB_COR.ouro,2.5);
    c.fillStyle = 'rgba(255,240,190,.22)'; c.beginPath(); c.moveTo(530,60); c.lineTo(590,60); c.lineTo(700,AB_CHAO); c.lineTo(420,AB_CHAO); c.closePath(); c.fill();
    // a porta da cozinha, com a Rosa e o Tonhão espiando
    rr(c,940,180,190,AB_CHAO - 180,6); fs(c,'#3A2A22',3);
    c.save(); c.beginPath(); c.rect(940,180,190,AB_CHAO - 180); c.clip();
    abTonhao(c,1005,AB_CHAO + 10,1.9,{ mood:2 });
    abRosa(c,1075,AB_CHAO + 10,3.3,{ roupa:'#fff', avental:'#E9E4D8', mood:1 });
    c.restore();
    rr(c,1120,180,60,AB_CHAO - 180,4); fs(c,'#7A5232',3);   // a folha da porta, entreaberta
    // o Bráulio ergue a plaquinha; brilho girando atrás da estrela
    const up = abSuave(abSeg(p,0.1,0.4));
    if (up > 0.5){
      c.save(); c.translate(560,AB_CHAO - 145 - up * 10); c.rotate(RM ? 0 : T * 0.6);
      c.fillStyle = 'rgba(242,194,61,.35)'; for (let i=0;i<8;i++){ c.rotate(TAU/8); c.beginPath(); c.moveTo(0,0); c.lineTo(-14,-110); c.lineTo(14,-110); c.closePath(); c.fill(); }
      c.restore();
    }
    abBraulio(c,560,AB_CHAO,2.2,{ ergue:up });
    // o público aplaudindo, de costas, na frente
    const pal = [[0,'#3C7BD9',1],[2,'#7B4FB5',4],[4,'#3E9B5A',0],[1,'#E0523C',2],[5,'#F2B33D',3],[3,'#1FA6A0',5]];
    pal.forEach((q,i) => {
      const x = 90 + i * 150, pula = RM ? 0 : Math.abs(Math.sin(T * 7 + i)) * 4;
      drawPerson(c,{ skin:q[0], hair:q[2], hairC:HAIRC[i % 4], pants:PANTS[i % 5] },x,560 - pula,{ s:2.4, shirt:q[1], back:true, handUp:true, t:T + i });
    });
    return { braulio:[560,AB_CHAO - 350] };
  },
  hospital(c,p,T){
    c.fillStyle = '#CFE3DF'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = '#B8D3CE'; c.fillRect(0,300,TW,10);
    abJanela(c,880,70,220,160,AB_COR.noite,T,true);
    abChao(c,'#A9BCC4');
    // a mesinha com a rosa no copo
    rr(c,770,350,80,120,4); fs(c,'#E9E4D8',3);
    rr(c,796,300,28,50,6); fs(c,'rgba(255,255,255,.6)',2.4);
    c.strokeStyle = PAL.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(810,330); c.lineTo(810,276); c.stroke();
    abFlor(c,810,270,7);
    // a cama, com a Rosa deitada
    rr(c,300,330,440,70,8); fs(c,'#fff',3);
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(310,400); c.lineTo(310,AB_CHAO); c.moveTo(730,400); c.lineTo(730,AB_CHAO); c.stroke();
    c.strokeStyle = PAL.cromo; c.lineWidth = 4; c.stroke();
    rr(c,290,250,20,150,6); fs(c,PAL.cromo,2.5);
    ell(c,370,322,56,22); fs(c,'#fff',2.5);                                     // o travesseiro
    circ(c,372,296,30); fs(c,'#1B1512',2.4);                                   // o coque
    circ(c,388,316,28); fs(c,SKINS[3],2.6);
    abFlor(c,360,290,5);
    c.fillStyle = PAL.tinta; c.lineWidth = 2;
    c.strokeStyle = PAL.tinta; c.beginPath(); c.arc(382,312,4,0.2,Math.PI-0.2); c.moveTo(402,312); c.arc(398,312,4,0.2,Math.PI-0.2); c.stroke();   // olhos fechadinhos
    c.beginPath(); c.arc(392,326,5,0.3,Math.PI-0.3); c.stroke();
    // o cobertor rosa (respira devagar)
    const resp = RM ? 0 : Math.sin(T * 1.4) * 2;
    c.beginPath(); c.moveTo(410,334 - resp); c.quadraticCurveTo(560,300 - resp,730,322); c.lineTo(730,372); c.lineTo(410,372); c.closePath(); fs(c,'#E7A9B8',3);
    // a mão da Rosa e a da Bia
    abBraco(c,[[470,330],[520,352]],'#E7A9B8',SKINS[3]);
    // a Bia na cadeira, segurando a mão da mãe
    rr(c,520,360,90,16,4); fs(c,PAL.madeira,2.5);
    c.strokeStyle = PAL.tinta; c.lineWidth = 6; c.beginPath(); c.moveTo(530,376); c.lineTo(530,AB_CHAO); c.moveTo(600,376); c.lineTo(600,AB_CHAO); c.stroke();
    abBiaCrianca(c,566,372,2.6,{ sentada:true, mood:1, t:T });
    abBraco(c,[[548,320],[526,352]],PAL.mostarda,SKINS[4]);
    // tudo um pouco mais escuro, como de noite
    c.fillStyle = 'rgba(30,42,74,.18)'; c.fillRect(0,0,TW,500);
    return { rosa:[330,250], bia:[610,232] };
  },
  promessa(c,p,T){
    abCozinhaCasa(c,T,true);
    abPanela(c,700,290,110,T,false);
    // o banquinho vazio e o copo com a rosa na bancada
    rr(c,398,392,84,14,4); fs(c,PAL.madeira,2.5);
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(408,406); c.lineTo(402,AB_CHAO); c.moveTo(472,406); c.lineTo(478,AB_CHAO); c.stroke();
    c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 4; c.stroke();
    rr(c,1040,270,28,46,6); fs(c,'rgba(255,255,255,.6)',2.4);
    c.strokeStyle = PAL.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(1054,296); c.lineTo(1054,246); c.stroke();
    abFlor(c,1054,240,7);
    // a Bia adulta com o caderno de receitas da mãe
    drawBia(c,{},560,AB_CHAO,{ s:3.2, t:T });
    c.save(); c.translate(560,AB_CHAO - 62); c.rotate(-0.08);
    rr(c,-56,-34,112,62,5); fs(c,AB_COR.rosa,3);
    rr(c,-50,-30,48,54,3); fs(c,PAL.creme,1.6); rr(c,2,-30,48,54,3); fs(c,PAL.creme,1.6);
    c.font = '11px ' + FB; c.fillStyle = PAL.tinta; c.textAlign = 'center'; c.fillText('Receitas',-26,-14); c.fillText('da Rosa',-26,0);
    abFlor(c,26,-6,6);
    c.restore();
    return { bia:[560,AB_CHAO - 230] };
  },
  tonhao(c,p,T){
    abCeu(c,'#F2A65A','#7A4A7A');
    abFachadaAurora(c,40,120,380,AB_CHAO - 120,true);
    rr(c,160,270,120,AB_CHAO - 270,6); fs(c,'#5A3A22',3);
    // a garagem da casa da Bia, à direita
    rr(c,820,180,360,AB_CHAO - 180,4); fs(c,'#E2C9A0',3);
    c.beginPath(); c.moveTo(800,190); c.lineTo(1000,110); c.lineTo(1200,190); c.closePath(); fs(c,'#B5533A',3);
    rr(c,870,270,260,AB_CHAO - 270,4); fs(c,'#A3A9B0',3);
    c.strokeStyle = PAL.cromoEsc; c.lineWidth = 3; for (let y=290;y<AB_CHAO;y+=22){ c.beginPath(); c.moveTo(874,y); c.lineTo(1126,y); c.stroke(); }
    abChao(c,'#8F8578');
    // o Tonhão sai da Casa Aurora e vai até a Bia; lá, arregaça as mangas
    const k = abSuave(abSeg(p,0,0.32)), tx = 240 + k * 480, chegou = k >= 1;
    abTonhao(c,tx,AB_CHAO,2,{ toca:false, andando:!chegou, ph:T * 8, braco:chegou ? 'flex' : null, mood:chegou ? 0 : 2 });
    drawBia(c,{},880,AB_CHAO,{ s:3, t:T, flip:-1 });
    return { tonhao:[tx,AB_CHAO - 225], bia:[880,AB_CHAO - 225] };
  },
  banco(c,p,T){
    abCeu(c,'#BFE3F7','#F7EFD8');
    // o banco, grandão (o mesmo prediozinho do jogo)
    c.save(); c.translate(900,280); c.scale(7,7); drawBanco(c); c.restore();
    abChao(c,'#BDB6A8');
    // a Bia conta as moedinhas do pote e sai correndo para o banco
    const k = abSuave(abSeg(p,0.3,0.6)), bx = 260 + k * 380, corre = k > 0 && k < 1;
    if (k < 1){
      rr(c,bx + 36,AB_CHAO - 120,56,64,10); fs(c,'rgba(255,255,255,.55)',3);
      rr(c,bx + 32,AB_CHAO - 128,64,12,4); fs(c,PAL.madeira,2.4);
      [[50,-70],[66,-66],[58,-78]].forEach(m => { circ(c,bx + m[0],AB_CHAO + m[1],7); fs(c,AB_COR.ouro,1.6); });
    }
    drawBia(c,{},bx,AB_CHAO,{ s:3, t:T, moving:corre, ph:T * 12, wave:!corre && k >= 1 });
    // o carimbo de APROVADO na papelada
    const cb = abSeg(p,0.62,0.72);
    if (cb > 0){
      c.save(); c.translate(1000,140); c.rotate(-0.12);
      rr(c,-90,-60,180,120,4); fs(c,'#fff',3);
      c.fillStyle = '#B9C2CC'; for (let i=0;i<4;i++) c.fillRect(-70,-40 + i*16,140,5);
      const sc = RM ? 1 : 1 + (1 - cb) * 0.8;
      c.scale(sc,sc); c.globalAlpha = RM ? 1 : cb;
      rr(c,-84,-20,168,44,6); c.lineWidth = 5; c.strokeStyle = PAL.ok; c.stroke();
      txt(c,'APROVADO',0,2,30,PAL.ok,'center',FD);
      c.globalAlpha = 1; c.restore();
    }
    return { bia:[bx,AB_CHAO - 210] };
  },
  inauguracao(c,p,T){
    abCeu(c,AB_COR.noite,AB_COR.noite2);
    // estrelinhas do céu e a estrela que pisca
    c.fillStyle = 'rgba(255,255,255,.7)';
    [[80,60],[210,130],[330,40],[460,110],[720,50],[860,140],[1010,70],[1150,120]].forEach((s,i) => { circ(c,s[0],s[1],RM ? 1.8 : 1.4 + Math.abs(Math.sin(T * 2 + i)) * 1.2); c.fill(); });
    const brilha = abSeg(p,0.6,0.72);
    if (brilha > 0){
      const r = 16 + (RM ? 0 : Math.sin(T * 4) * 4);
      c.globalAlpha = brilha;
      const gl = c.createRadialGradient(1060,90,r * 0.5,1060,90,r * 2.6); gl.addColorStop(0,'rgba(255,226,140,.55)'); gl.addColorStop(1,'rgba(255,226,140,0)');
      c.fillStyle = gl; circ(c,1060,90,r * 2.6); c.fill();
      star(c,1060,90,r,AB_COR.ouro);
      c.globalAlpha = 1;
    }
    // a casa com a garagem; a porta de enrolar sobe e mostra a lanchonete acesa
    rr(c,300,220,620,AB_CHAO - 220,4); fs(c,'#E2C9A0',3);
    c.beginPath(); c.moveTo(270,230); c.lineTo(610,120); c.lineTo(950,230); c.closePath(); fs(c,'#B5533A',3);
    const sobe = abSuave(abSeg(p,0.05,0.4)), gx = 400, gy = 300, gw = 420, gh = AB_CHAO - 300;
    rr(c,gx,gy,gw,gh,4); fs(c,'#FFE7A8',3);
    c.fillStyle = PAL.piso1; c.fillRect(gx + 4,gy + gh - 50,gw - 8,46);
    [[470,AB_CHAO - 40],[620,AB_CHAO - 40],[760,AB_CHAO - 40]].forEach(m => { ell(c,m[0],m[1] - 30,34,10); fs(c,PAL.formica,2.4); c.fillStyle = PAL.tinta; c.fillRect(m[0] - 3,m[1] - 28,6,28); });
    const porta = gh * (1 - sobe);
    if (porta > 2){
      rr(c,gx,gy,gw,porta,3); fs(c,'#A3A9B0',3);
      c.strokeStyle = PAL.cromoEsc; c.lineWidth = 3; for (let y=gy + 22;y<gy + porta;y+=22){ c.beginPath(); c.moveTo(gx + 4,y); c.lineTo(gx + gw - 4,y); c.stroke(); }
    }
    // o letreiro acende (pisca 2 vezes antes de firmar)
    const acende = p >= 0.45, pisca = !RM && p < 0.52 && Math.floor(T * 10) % 2 === 0;
    rr(c,410,236,400,52,12); fs(c,PAL.tinta,3);
    txt(c,'Lanchonete Corre-Corre',610,262,28,acende && !pisca ? PAL.mostarda : '#5b5446','center',FD,acende && !pisca ? 0 : 0,380);
    if (acende && !pisca){ c.strokeStyle = 'rgba(242,179,61,.5)'; c.lineWidth = 6; rr(c,404,230,412,64,15); c.stroke(); }
    abChao(c,'#5B5F6B');
    // a Bia e o Tonhão na frente
    drawBia(c,{},300,AB_CHAO,{ s:3, t:T, wave:p > 0.45 });
    abTonhao(c,950,AB_CHAO,2,{ braco:p > 0.45 ? 'aceno' : null, t:T });
    // o título
    const ti = abSeg(p,0.55,0.7);
    if (ti > 0){ c.globalAlpha = ti; txt(c,'O sonho da Bia',610,100,64,PAL.mostarda,'center',FD,8); c.globalAlpha = 1; }
    return { bia:[300,AB_CHAO - 225], tonhao:[950,AB_CHAO - 275] };
  }
};

/* ---------- balões, legenda e o desenho de tudo ---------- */
const AB_UI = { fala:20, linha:25, falaW:330, leg:21, legLinha:27 };
function abBalao(c,s,ax,ay){
  const U = AB_UI, lin = treinoLinhas(c,s,U.falaW,U.fala);
  c.font = U.fala + 'px ' + FB;
  const w = Math.max.apply(null,lin.map(l => c.measureText(l).width)) + 34, h = lin.length * U.linha + 22;
  const x = clamp(ax - w/2,16,TW - 16 - w), y = Math.max(10,ay - 22 - h);
  const bx = clamp(ax,x + 22,x + w - 22);
  c.beginPath(); c.moveTo(bx - 12,y + h - 2); c.lineTo(ax,Math.max(ay,y + h + 12)); c.lineTo(bx + 12,y + h - 2); c.closePath(); fs(c,'#fff',3);
  rr(c,x,y,w,h,16); fs(c,'#fff',3);
  c.fillStyle = '#fff'; c.fillRect(bx - 10,y + h - 4,20,5);
  lin.forEach((l,i) => txt(c,l,x + w/2,y + 11 + U.linha * (i + 0.5),U.fala,PAL.tinta,'center',FB));
}
function abLegenda(c,ab){
  const U = AB_UI;
  c.fillStyle = 'rgba(34,32,28,.92)'; c.fillRect(0,500,TW,100);
  c.fillStyle = PAL.mostarda; c.fillRect(0,500,TW,4);
  const lin = treinoLinhas(c,ab.cena.leg,1040,U.leg), y0 = 548 - (lin.length - 1) * U.legLinha / 2 - 6;
  lin.forEach((l,i) => txt(c,l,TW/2,y0 + i * U.legLinha,U.leg,PAL.creme,'center',FB));
  // as bolinhas das cenas e a dica do toque
  const n = ab.n, x0 = TW/2 - (n - 1) * 9;
  for (let i=0;i<n;i++){ circ(c,x0 + i * 18,586,i === ab.i ? 5 : 3.5); c.fillStyle = i <= ab.i ? PAL.mostarda : '#6b6457'; c.fill(); }
  txt(c,'toque para seguir',TW - 20,586,13,'#b8ae98','right',FB);
}
function drawAbertura(c,ab){
  const T = RM || ab.rm ? 0 : ab.tm;
  c.save();
  c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
  const desenha = AB_CENAS[ab.cena.id];
  const cab = (desenha && desenha(c,ab.p,T)) || {};
  ab.falas().forEach(f => { const a = cab[f.q]; if (a) abBalao(c,f.s,a[0],a[1]); });
  abLegenda(c,ab);
  const e = ab.escuro;
  if (e > 0){ c.fillStyle = 'rgba(16,14,12,' + e + ')'; c.fillRect(0,0,TW,H); }
  c.restore();
}
