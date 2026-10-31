/* ============================================================
   ABERTURA (v8.5): o desenho das cenas do sonho da Bia
   Cada cena desenha o fundo e as pessoas a partir de p (0 a 1, o andamento) e T (o relógio, parado com movimento
   reduzido) e devolve onde fica a cabeça de quem fala, para os balões ([x, y, deslocamento do balão para o lado]).
   Embaixo, a faixa da legenda e as bolinhas das cenas; por cima, o escuro da entrada e da saída (sem ele com
   movimento reduzido). v8.6.1 (revisão estética): alturas pela tabela AB_ALT, gestos com objetos, piscar e falar
   ============================================================ */
const AB_CHAO = 470;   // linha do chão das cenas (a faixa da legenda começa em 500)
const AB_FOGAO = 356;  // a boca do fogão de casa: na cintura da Rosa (~55% da altura dela)
const AB_COR = { rosa:'#C8506A', petala:'#E8457A', noite:'#1E2A4A', noite2:'#3A3F6E', aurora:'#7A2E3A', ouro:'#F2C23D', molho:'#C2362B', segredo:'#F2A53A' };
// altura de cada um na cena, em px do chão ao alto da cabeça (sem a touca), e a mesma altura no desenho em escala 1
const AB_ALT = { rosa:210, bia:210, biaCrianca:130, tonhao:230, braulio:230 };
const AB_BASE = { rosa:63, bia:73.5, biaCrianca:46, tonhao:114, braulio:115 };
const abEsc = (q,k) => AB_ALT[q] / AB_BASE[q] * (k || 1);   // k: mais longe (< 1), como na janela ou na porta
const abSeg = (p,a,b) => clamp((p - a) / (b - a), 0, 1);
const abSuave = p => p * p * (3 - 2 * p);
const abLerp = (a,b,k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
// piscar de vez em quando (cada um no seu ritmo) e a boca de quem está falando (AB_VIVO, de drawAbertura)
const AB_VIVO = { fala:{} };
const abPisca = (T,sd) => T > 0 && ((T + sd) % 3.7) < 0.14;
const abBoca = q => AB_VIVO.fala[q] || 0;

/* ---------- pessoas ---------- */
function abFlor(c,x,y,r){
  for (let i=0;i<5;i++){ const a = i * TAU / 5 - Math.PI / 2; circ(c,x + Math.cos(a)*r,y + Math.sin(a)*r,r*0.75); fs(c,'#F07A9A',1.2); }
  circ(c,x,y,r*0.55); fs(c,AB_COR.ouro,1.2);
}
// a Rosa, mãe da Bia: coque com uma rosa no cabelo e avental
function abRosa(c,x,y,s,o){
  o = o || {};
  c.save(); c.translate(x,y); c.scale(o.flip || 1,1);   // flip -1: espelhada (o braço direito fica do lado esquerdo)
  drawPerson(c,{ skin:3, hair:2, hairC:'#1B1512', pants:'#4A4036' },0,0,{ s, shirt:o.roupa || AB_COR.rosa, mood:o.mood || 0, handUp:!!o.aceno, t:o.t || 0, moving:!!o.andando, ph:o.ph || 0,
    bracoD:o.bracoD, pisca:abPisca(o.t || 0,0.3), fala:abBoca('rosa'), olha:o.olha });
  c.scale(s,s);
  if (o.avental !== false){ c.beginPath(); c.moveTo(-8,-29); c.lineTo(8,-29); c.lineTo(11,-12); c.lineTo(-11,-12); c.closePath(); fs(c,o.avental || '#fff',2); }
  abFlor(c,9,-53,3.2);
  c.restore();
}
// a Bia criança: cabelão redondo com laço amarelo e vestido mostarda; sentada, as pernas ficam penduradas no assento
function abBiaCrianca(c,x,y,s,o){
  o = o || {};
  const k = s * 0.74;
  if (o.sentada){
    c.save(); c.translate(x,y); c.scale(k,k);
    rr(c,-8,-6,7,16,2); fs(c,'#7B4A2C',2); rr(c,1,-6,7,16,2); fs(c,'#7B4A2C',2);
    ell(c,-4.5,10,5,2.6); fs(c,'#2c2a26',1.6); ell(c,4.5,10,5,2.6); fs(c,'#2c2a26',1.6);
    c.restore();
  }
  drawPerson(c,{ kid:true, skin:4, hair:3, hairC:'#15100D', pants:'#7B4A2C' },x,y,{ s, shirt:PAL.mostarda, handUp:!!o.aceno, t:o.t || 0, mood:o.mood || 0, sit:!!o.sentada, noShadow:!!o.sentada,
    bracoE:o.bracoE, bracoD:o.bracoD, pisca:abPisca(o.t || 0,2.6), fala:abBoca('bia') });
  c.save(); c.translate(x,y + (o.sentada ? 12 * k : 0)); c.scale(k,k);
  c.beginPath(); c.moveTo(12,-58); c.lineTo(20,-64); c.lineTo(20,-52); c.closePath(); fs(c,PAL.alerta,1.5);
  c.beginPath(); c.moveTo(12,-58); c.lineTo(4,-66); c.lineTo(5,-53); c.closePath(); fs(c,PAL.alerta,1.5);
  c.restore();
}
// a Bia adulta, com o piscar e a boca da fala
function abBia(c,x,y,o){ drawBia(c,{},x,y,Object.assign({ s:abEsc('bia'), pisca:abPisca(o.t || 0,1.9), fala:abBoca('bia') },o)); }
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
// colher de pau: do cabo (a) à ponta (b), com a concha na ponta; mao: a mão por cima, segurando
function abColher(c,a,b,mao,rm,cor){
  c.lineCap = 'round';
  c.strokeStyle = PAL.tinta; c.lineWidth = 9; c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.stroke();
  c.strokeStyle = PAL.madeira; c.lineWidth = 5; c.stroke();
  ell(c,b[0],b[1],9,5); fs(c,cor || PAL.madeira,2);
  if (mao){ circ(c,mao[0],mao[1],rm); fs(c,mao[2],2); }
}
// o Tonhão de corpo inteiro: dólmã branco, bigodão; o: toca, braco ('aceno' | 'flex' | 'mexe', com a mão em mao),
// g (o gesto entrando, de 0 a 1), andando, ph, mood (2: desanimado), flip, olha
function abTonhao(c,x,y,s,o){
  o = o || {};
  const pele = '#B9794B', roupa = o.roupa || '#fff', sw = o.andando ? Math.sin(o.ph || 0) * 6 : 0;
  const bob = o.andando && !RM ? -Math.abs(Math.sin(o.ph || 0)) * 3 : 0;
  const g = o.g == null ? 1 : o.g;
  c.save(); c.translate(x,y); c.scale(s * (o.flip || 1),s);
  shadowEll(c,0,0,24,6,0.22);
  rr(c,-15+sw,-34,12,33,3); fs(c,'#3A3F4A',2.4); rr(c,3-sw,-34,12,33,3); fs(c,'#3A3F4A',2.4);
  ell(c,-9+sw,-1,8,4); fs(c,'#2c2a26',2); ell(c,9-sw,-1,8,4); fs(c,'#2c2a26',2);
  c.translate(0,bob);
  // braço de trás (esquerdo): mão na cintura no 'flex', solto nos outros
  if (o.braco === 'flex') abBraco(c,[[-19,-76],abLerp([-24,-60],[-32,-56],g),abLerp([-25,-44],[-19,-44],g)],roupa,pele);
  else abBraco(c,[[-19,-76],[-25,-44]],roupa,pele);
  // corpo
  c.beginPath(); c.moveTo(-23,-30); c.lineTo(-19,-82); c.lineTo(19,-82); c.lineTo(23,-30); c.closePath(); fs(c,roupa,2.6);
  c.fillStyle = PAL.tinta; [-70,-58,-46].forEach(b => { circ(c,-6,b,1.8); c.fill(); circ(c,6,b,1.8); c.fill(); });
  c.beginPath(); c.moveTo(-10,-82); c.lineTo(0,-73); c.lineTo(10,-82); c.closePath(); fs(c,PAL.formica,2);
  // braço da frente (direito); o aceno e o muque sobem aos poucos (g)
  if (o.braco === 'aceno') abBraco(c,[[19,-76],abLerp([25,-44],[36,-112 + Math.sin((o.t || 0) * 9) * 5],g)],roupa,pele);
  else if (o.braco === 'flex'){
    const e = abLerp([22,-60],[42,-72],g), m = abLerp([25,-44],[44,-104],g);
    if (g < 0.5) abBraco(c,[[19,-76],e,m],roupa,pele);
    else {
      abBraco(c,[e,m],pele,pele,8);                    // manga arregaçada: o antebraço de fora, mostrando o muque
      abBraco(c,[[19,-76],e],roupa,roupa,9);
      rr(c,e[0] - 5,e[1] - 7,11,14,3); fs(c,'#E9E4D8',1.6);   // a dobra da manga
    }
  }
  else if (o.braco === 'mexe') abBraco(c,[[19,-76],[36,-70],o.mao || [44,-58]],roupa,pele);
  else abBraco(c,[[19,-76],[25,-44]],roupa,pele);
  // cabeça
  const hy = -98;
  circ(c,0,hy,16); fs(c,pele,2.6);
  if (o.toca !== false){
    rr(c,-13,hy-20,26,12,2); fs(c,'#fff',2.4);
    c.beginPath(); c.arc(-9,hy-24,8,0,TAU); c.arc(0,hy-29,9,0,TAU); c.arc(9,hy-24,8,0,TAU); fs(c,'#fff',2.4);
    rr(c,-13,hy-20,26,8,2); c.fillStyle = '#fff'; c.fill();
  } else { c.beginPath(); c.arc(0,hy-2,16,Math.PI*1.08,Math.PI*1.92); c.lineTo(8,hy-11); c.lineTo(-8,hy-11); c.closePath(); fs(c,'#2a2320',2); }
  // rosto: olha para o lado em que anda; pisca; sobrancelhas tristes (mood 2) ou de bem com a vida
  c.translate((o.olha || 0) * 3,0);
  c.fillStyle = PAL.tinta;
  if (abPisca(o.t || 0,1.1)){ c.fillRect(-8,hy-3.8,5,1.8); c.fillRect(3,hy-3.8,5,1.8); }
  else { circ(c,-5.5,hy-3,1.9); c.fill(); circ(c,5.5,hy-3,1.9); c.fill(); }
  c.strokeStyle = PAL.tinta; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath();
  if (o.mood === 2){ c.moveTo(-9,hy-7.5); c.lineTo(-3,hy-10); c.moveTo(9,hy-7.5); c.lineTo(3,hy-10); }
  else { c.arc(-5.5,hy-6.5,3.6,Math.PI*1.15,Math.PI*1.85); c.moveTo(9.1,hy-7.6); c.arc(5.5,hy-6.5,3.6,Math.PI*1.15,Math.PI*1.85); }
  c.stroke();
  const fala = abBoca('tonhao');
  if (fala){ ell(c,0,hy+11,4,1.5 + fala * 3); fs(c,'#5A1E1E',1.6); }
  c.beginPath(); c.moveTo(0,hy+4); c.bezierCurveTo(-5,hy-1,-16,hy+1,-16,hy+7); c.bezierCurveTo(-12,hy+5,-5,hy+7,0,hy+6); c.bezierCurveTo(5,hy+7,12,hy+5,16,hy+7); c.bezierCurveTo(16,hy+1,5,hy-1,0,hy+4); c.closePath(); fs(c,'#1B1512',2);
  if (!fala){
    c.strokeStyle = PAL.tinta; c.lineWidth = 1.8; c.beginPath();
    if (o.mood === 2) c.arc(0,hy+15,4,Math.PI+0.4,TAU-0.4); else c.arc(0,hy+10,4,0.3,Math.PI-0.3);
    c.stroke();
  }
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
  c.beginPath(); c.arc(-5.5,hy-4,2.6,Math.PI,TAU); c.moveTo(8.1,hy-4); c.arc(5.5,hy-4,2.6,0,Math.PI,true); c.stroke();
  c.beginPath(); c.moveTo(1,hy-2); c.lineTo(6,hy+2); c.lineTo(1,hy+3); c.stroke();
  // bigodinho enrolado, logo abaixo do nariz; a boca fica embaixo dele
  c.lineWidth = 2.4; c.beginPath();
  c.moveTo(0,hy+5); c.quadraticCurveTo(-8,hy+2,-12,hy+5); c.arc(-12,hy+2,3,Math.PI/2,Math.PI*1.8);
  c.moveTo(0,hy+5); c.quadraticCurveTo(8,hy+2,12,hy+5); c.arc(12,hy+2,3,Math.PI/2,-Math.PI*0.8,true);
  c.stroke();
  const fala = abBoca('braulio');
  if (fala){ ell(c,0,hy+10.5,3.2,1.2 + fala * 2.2); fs(c,'#7A2E2E',1.5); }
  else { c.lineWidth = 1.8; c.beginPath(); c.arc(0,hy+9,3.5,0.3,Math.PI-0.3); c.stroke(); }
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
// a cozinha de casa (cenas 1 e 7): azulejo, janela, bancada e o fogão, com a boca na cintura da Rosa
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
  const f = AB_FOGAO;
  rr(c,860,f + 10,300,AB_CHAO - f - 10,6); fs(c,PAL.madeira,3);
  rr(c,850,f - 4,320,18,4); fs(c,PAL.creme,3);
  rr(c,600,f + 8,200,AB_CHAO - f - 8,8); fs(c,'#F2F2EE',3);
  rr(c,618,f + 40,164,AB_CHAO - f - 54,6); fs(c,'#2E2E30',2.5);
  c.fillStyle = PAL.cromo; c.fillRect(632,f + 50,136,6);
  rr(c,596,f,208,16,4); fs(c,'#3a3a3c',2.5);
  [628,660,740,772].forEach(x => { circ(c,x,f + 27,6); fs(c,'#555',1.6); });
}
// panela (y: o fundo); o vapor é cinza-azulado com contorno, para aparecer na parede clara; brilho: o molho reluz
function abPanela(c,x,y,w,T,vapor,cor,brilho){
  rr(c,x - w/2,y - 50,w,52,8); fs(c,'#8E99A6',3);
  rr(c,x - w/2 - 6,y - 56,w + 12,10,4); fs(c,'#B9C2CC',2.5);
  c.fillStyle = cor || AB_COR.molho; ell(c,x,y - 52,w/2 - 4,5); c.fill();
  if (brilho){
    const gl = c.createRadialGradient(x,y - 54,4,x,y - 54,w * 0.7); gl.addColorStop(0,'rgba(255,214,110,' + (0.6 * brilho) + ')'); gl.addColorStop(1,'rgba(255,214,110,0)');
    c.fillStyle = gl; c.fillRect(x - w * 0.7,y - 54 - w * 0.7,w * 1.4,w * 0.7);
    c.globalAlpha = brilho * (RM ? 0.8 : 0.6 + Math.sin(T * 5) * 0.3);
    c.fillStyle = '#FFF4C2'; ell(c,x - w * 0.12,y - 53,w * 0.16,2); c.fill(); ell(c,x + w * 0.16,y - 52,w * 0.08,1.5); c.fill();
    c.globalAlpha = 1;
  }
  if (vapor){
    c.lineCap = 'round';
    for (let i=0;i<3;i++){
      const ph = T * 1.6 + i * 2.1, k = RM ? 0.5 : (ph % 1);
      c.globalAlpha = RM ? 0.7 : 1 - k;
      c.beginPath(); c.moveTo(x - 24 + i*24,y - 64 - k*40);
      c.bezierCurveTo(x - 34 + i*24,y - 84 - k*40,x - 14 + i*24,y - 94 - k*40,x - 24 + i*24,y - 114 - k*40);
      c.strokeStyle = 'rgba(110,128,148,.55)'; c.lineWidth = 8; c.stroke();
      c.strokeStyle = 'rgba(232,240,247,.95)'; c.lineWidth = 4.5; c.stroke();
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
function abBanquinho(c,x,y){
  rr(c,x - 42,y,84,14,4); fs(c,PAL.madeira,2.5);
  c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(x - 32,y + 14); c.lineTo(x - 38,AB_CHAO); c.moveTo(x + 32,y + 14); c.lineTo(x + 38,AB_CHAO); c.stroke();
  c.strokeStyle = PAL.madeiraEsc; c.lineWidth = 4; c.stroke();
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
// a fachada do banco, no traço da cena: frontão com o R$, placa, colunas, porta e escadinha
function abFachadaBanco(c,x,y,w){
  const h = AB_CHAO - y, cx = x + w/2;
  rr(c,x - 20,AB_CHAO - 22,w + 40,22,3); fs(c,'#D9D4C8',3);              // a escadinha
  rr(c,x - 6,AB_CHAO - 34,w + 12,14,3); fs(c,'#E4DFD3',2.5);
  rr(c,x,y + 80,w,h - 114,3); fs(c,'#EDE6D6',3);                          // o corpo
  c.beginPath(); c.moveTo(x - 24,y + 84); c.lineTo(cx,y); c.lineTo(x + w + 24,y + 84); c.closePath(); fs(c,'#E2DACA',3);
  circ(c,cx,y + 50,22); fs(c,AB_COR.ouro,2.5); txt(c,'R$',cx,y + 51,20,PAL.tinta,'center',FD);
  rr(c,cx - 80,y + 88,160,36,6); fs(c,PAL.tinta,2.5); txt(c,'Banco',cx,y + 107,24,PAL.creme,'center',FD);
  [x + 22,x + 82,x + w - 108,x + w - 48].forEach(q => {                    // as colunas
    rr(c,q,y + 136,26,h - 170,2); fs(c,'#F7F2E6',2.5);
    rr(c,q - 5,y + 130,36,10,2); fs(c,'#E4DFD3',2); rr(c,q - 5,AB_CHAO - 44,36,10,2); fs(c,'#E4DFD3',2);
  });
  rr(c,cx - 38,y + 160,76,h - 194,4); fs(c,'#5A3A22',3);                   // a porta
  c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx,y + 160); c.lineTo(cx,AB_CHAO - 34); c.stroke();
}

/* ---------- as cenas ---------- */
const AB_CENAS = {
  casa(c,p,T){
    abCozinhaCasa(c,T,false);
    abPanela(c,690,AB_FOGAO,110,T,true);
    abCoracoes(c,690,AB_FOGAO - 70,T,3);
    // o banquinho e a Bia provando o molho: a colherinha com o molho na boca e o cabo para fora e para baixo
    const sb = abEsc('biaCrianca'), kb = sb * 0.74, bx = 470, by = 400;
    abBanquinho(c,bx,by);
    abBiaCrianca(c,bx,by,sb,{ t:T, bracoD:[[16,-22],[10,-30]] });
    const bp = q => [bx + q[0] * kb,by + q[1] * kb];
    abColher(c,bp([19,-21]),bp([2,-38.5]),bp([10,-30]).concat(SKINS[4]),3.6 * kb,AB_COR.molho);
    // a Rosa mexe a panela por cima: a mão acima da borda, o cabo para fora e a ponta no molho, em roda
    const sr = abEsc('rosa'), rx = 628, a = RM ? 0.6 : T * 3.2;
    const ponta = [700 + Math.cos(a) * 15,AB_FOGAO - 50 + Math.sin(a) * 3], mao = [ponta[0] - 28,AB_FOGAO - 64 + Math.sin(a) * 2];
    abRosa(c,rx,AB_CHAO,sr,{ t:T, bracoD:[[20,-34],[(mao[0] - rx) / sr,(mao[1] - AB_CHAO) / sr]] });
    abColher(c,[mao[0] - 22,mao[1] - 12],ponta,mao.concat(SKINS[3]),3.6 * sr);
    return { rosa:[rx,AB_CHAO - AB_ALT.rosa - 6,-200], bia:[bx,by - 110] };
  },
  aurora(c,p,T){
    abCeu(c,'#9FD3F0','#F7EFD8');
    abFachadaAurora(c,360,90,560,AB_CHAO - 90,false);
    rr(c,750,200,140,150,6); fs(c,'#F7E2A6',3);                       // a janela, com o Tonhão
    c.save(); c.beginPath(); c.rect(750,200,140,150); c.clip();
    const ac = abSuave(abSeg(p,0.36,0.44));
    abTonhao(c,812,480,abEsc('tonhao',0.8),{ braco:'aceno', g:ac, t:T });
    c.restore();
    c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.strokeRect(750,200,140,150);
    abChao(c,'#BDB6A8');
    // a porta abre, a Rosa (de roupa rosa, sem o dólmã: ainda não trabalha lá) entra, e a porta fecha
    const dx = 560, dw = 150, dy = 240, dh = AB_CHAO - 240;
    const abre = abSuave(abSeg(p,0.36,0.46)) * (1 - abSuave(abSeg(p,0.7,0.8))), entra = abSuave(abSeg(p,0.47,0.66));
    rr(c,dx,dy,dw,dh,6); fs(c,'#FFE7A8',3);                               // lá dentro, aceso
    c.fillStyle = 'rgba(122,46,58,.25)'; c.fillRect(dx + 4,dy + 4,dw - 8,40);
    const k = abSuave(abSeg(p,0.05,0.45)), rx = 250 + k * 385, sr = abEsc('rosa');
    const rosa = { roupa:AB_COR.rosa, avental:false, andando:k > 0 && (k < 1 || entra < 1), ph:T * 9, t:T, olha:k < 1 ? 1 : 0 };
    if (entra > 0){
      if (entra < 1){
        c.save(); c.beginPath(); c.rect(dx + 3,dy + 3,dw - 6,dh - 3); c.clip();
        c.globalAlpha = 1 - entra; abRosa(c,rx,AB_CHAO - entra * 14,sr * (1 - entra * 0.18),rosa);
        c.restore(); c.globalAlpha = 1;
      }
    }
    // a folha da porta, presa à esquerda, abre para dentro (fica estreita)
    const fw = dw * (1 - abre * 0.82);
    rr(c,dx,dy,fw,dh,6); fs(c,'#5A3A22',3);
    if (fw > 60){ rr(c,dx + 16 * fw / dw,dy + 16,fw - 32 * fw / dw,110,4); fs(c,'#F7E2A6',2.4); }
    c.fillStyle = AB_COR.ouro; circ(c,dx + fw - 16 * fw / dw,dy + 130,5); c.fill();
    if (entra <= 0) abRosa(c,rx,AB_CHAO,sr,rosa);
    abBiaCrianca(c,150,AB_CHAO,abEsc('biaCrianca'),{ aceno:true, t:T });
    return { bia:[150,AB_CHAO - AB_ALT.biaCrianca - 6], tonhao:[812,196], rosa:[rx,AB_CHAO - AB_ALT.rosa] };
  },
  tempero(c,p,T){
    c.fillStyle = PAL.inox; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = '#fff'; for (let x=0;x<TW;x+=60) for (let y=0;y<AB_CHAO;y+=30) c.fillRect(x + (y/30%2)*30,y,56,26);
    abChao(c,'#8E99A6');
    rr(c,400,380,400,90,6); fs(c,'#C7CED6',3);                      // o fogão grande
    rr(c,390,366,420,18,4); fs(c,'#3a3a3c',2.5);
    // a pétala cai da mão da Rosa e o molho fica dourado, com brilho e estrelinhas
    const cai = abSeg(p,0.2,0.6), muda = abSuave(abSeg(p,0.6,0.7)), pronto = muda > 0;
    abPanela(c,620,366,160,T,true,pronto ? (muda < 1 ? abMistura(AB_COR.molho,AB_COR.segredo,muda) : AB_COR.segredo) : AB_COR.molho,muda);
    if (pronto){ c.globalAlpha = muda; for (let i=0;i<6;i++){ const a = i * TAU / 6 + (RM ? 0 : T * 2); star(c,620 + Math.cos(a)*70,282 + Math.sin(a)*18,5 + muda * 2,AB_COR.ouro); } c.globalAlpha = 1; }
    // o Tonhão mexe com a colher de pau, a mão acima da borda e a ponta no molho
    const st = abEsc('tonhao'), tx = 470, a = RM ? 2.4 : T * 3;
    const ponta = [585 + Math.cos(a) * 14,315 + Math.sin(a) * 3], mao = [ponta[0] - 26,ponta[1] - 20];
    abTonhao(c,tx,AB_CHAO,st,{ braco:'mexe', mao:[(mao[0] - tx) / st,(mao[1] - AB_CHAO) / st], t:T });
    abColher(c,[mao[0] - 18,mao[1] - 14],ponta,mao.concat('#B9794B'),5 * st);
    // a Rosa, espelhada, com a mão sobre a panela, soltando uma pitada: a pétala
    const sr = abEsc('rosa'), rx = 728, mr = [-22,-52];
    abRosa(c,rx,AB_CHAO,sr,{ roupa:'#fff', avental:'#E9E4D8', t:T, flip:-1, bracoD:[[19,-36],[-mr[0],mr[1]]] });
    if (cai > 0 && !pronto){
      const px = rx + mr[0] * sr - cai * 20 + (RM ? 0 : Math.sin(T * 5) * 12 * (1 - cai)), py = AB_CHAO + mr[1] * sr + 12 + cai * 6;
      c.save(); c.translate(px,py); c.rotate(RM ? 0.4 : Math.sin(T * 4) * 0.8);
      ell(c,0,0,13,8); fs(c,AB_COR.petala,2.2);
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-8,0); c.lineTo(8,0); c.stroke();
      c.restore();
    }
    return { tonhao:[tx,AB_CHAO - 275,-60], rosa:[rx,AB_CHAO - AB_ALT.rosa] };
  },
  estrela(c,p,T){
    c.fillStyle = '#5B2A33'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = 'rgba(242,194,61,.08)'; for (let x=0;x<TW;x+=80) c.fillRect(x,0,40,AB_CHAO);
    abChao(c,'#3B2420');
    // o lustre e o foco no chef
    c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.beginPath(); c.moveTo(560,0); c.lineTo(560,40); c.stroke();
    ell(c,560,50,50,14); fs(c,AB_COR.ouro,2.5);
    c.fillStyle = 'rgba(255,240,190,.22)'; c.beginPath(); c.moveTo(530,60); c.lineTo(590,60); c.lineTo(700,AB_CHAO); c.lineTo(420,AB_CHAO); c.closePath(); c.fill();
    // a porta da cozinha, com a Rosa e o Tonhão espiando (um pouco mais longe)
    rr(c,940,180,190,AB_CHAO - 180,6); fs(c,'#3A2A22',3);
    c.save(); c.beginPath(); c.rect(940,180,190,AB_CHAO - 180); c.clip();
    abTonhao(c,1000,AB_CHAO + 10,abEsc('tonhao',0.92),{ mood:2, t:T });
    abRosa(c,1078,AB_CHAO + 10,abEsc('rosa',0.92),{ roupa:'#fff', avental:'#E9E4D8', mood:1, t:T });
    c.restore();
    rr(c,1120,180,60,AB_CHAO - 180,4); fs(c,'#7A5232',3);   // a folha da porta, entreaberta
    // o Bráulio ergue a plaquinha; brilho girando atrás da estrela
    const up = abSuave(abSeg(p,0.1,0.4)), sbr = abEsc('braulio');
    if (up > 0.5){
      c.save(); c.translate(560,AB_CHAO - (60 + up * 5) * sbr); c.rotate(RM ? 0 : T * 0.6);
      c.fillStyle = 'rgba(242,194,61,.35)'; for (let i=0;i<8;i++){ c.rotate(TAU/8); c.beginPath(); c.moveTo(0,0); c.lineTo(-14,-110); c.lineTo(14,-110); c.closePath(); c.fill(); }
      c.restore();
    }
    abBraulio(c,560,AB_CHAO,sbr,{ ergue:up });
    // o público, de costas, na frente: cada um com o seu gesto e o seu ritmo
    const pal = [[0,'#3C7BD9',1,'palmas',7],[2,'#7B4FB5',4,'ergue',5],[4,'#3E9B5A',0,'parado',0],[1,'#E0523C',2,'palmas',9.5],[5,'#F2B33D',3,'vibra',6],[3,'#1FA6A0',5,'palmas',5.5]];
    pal.forEach((q,i) => {
      const x = 90 + i * 150, v = q[4], pula = RM || !v ? 0 : Math.abs(Math.sin(T * v * 0.8 + i)) * 4;
      const o = { s:2.4, shirt:q[1], back:true, t:T * v / 9 + i };
      if (q[3] === 'palmas'){ const b = RM ? 0.5 : Math.abs(Math.sin(T * v + i)); o.bracoE = [[-8,-40],[-2 - b * 5,-50]]; o.bracoD = [[8,-40],[2 + b * 5,-50]]; }
      else if (q[3] === 'ergue') o.handUp = true;
      else if (q[3] === 'vibra'){ const b = RM ? 0 : Math.sin(T * v) * 2; o.bracoE = [[-17,-50 + b]]; o.bracoD = [[17,-50 - b]]; }
      drawPerson(c,{ skin:q[0], hair:q[2], hairC:HAIRC[i % 4], pants:PANTS[i % 5] },x,560 - pula,o);
    });
    return { braulio:[590,AB_CHAO - 236,210] };
  },
  hospital(c,p,T){
    c.fillStyle = '#CFE3DF'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = '#B8D3CE'; c.fillRect(0,300,TW,10);
    abJanela(c,880,70,220,160,AB_COR.noite,T,true);
    abChao(c,'#A9BCC4');
    // a mesinha com a rosa no copo
    rr(c,760,350,80,120,4); fs(c,'#E9E4D8',3);
    rr(c,786,300,28,50,6); fs(c,'rgba(255,255,255,.6)',2.4);
    c.strokeStyle = PAL.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(800,330); c.lineTo(800,276); c.stroke();
    abFlor(c,800,270,7);
    // a cama, do tamanho da Rosa deitada (a cabeça do tamanho dela em pé, o corpo com o comprimento dela)
    const sr = abEsc('rosa'), hr = 11 * sr;
    rr(c,310,352,272,58,8); fs(c,'#fff',3);
    c.lineCap = 'butt'; c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(322,410); c.lineTo(322,AB_CHAO); c.moveTo(570,410); c.lineTo(570,AB_CHAO); c.stroke();
    c.strokeStyle = PAL.cromo; c.lineWidth = 4; c.stroke();
    rr(c,296,262,20,148,6); fs(c,PAL.cromo,2.5);
    ell(c,370,346,52,16); fs(c,'#fff',2.5);                                     // o travesseiro
    circ(c,340,318,20); fs(c,'#1B1512',2.4);                                   // o coque
    circ(c,382,326,hr); fs(c,SKINS[3],2.6);
    c.beginPath(); c.arc(382,323,hr + 1,Math.PI * 0.95,Math.PI * 1.75); c.lineTo(382,323 - hr * 0.55); c.closePath(); fs(c,'#1B1512',2);   // o cabelo
    abFlor(c,334,304,6);
    // os olhos abrem enquanto ela fala (olhando para a Bia) e fecham depois
    const fa = ABERTURA.cenas.find(q => q.id === 'hospital').falas[0], tf = p * ABERTURA.cenas.find(q => q.id === 'hospital').t;
    const abertos = tf >= fa.de && tf < fa.ate && !abPisca(T,0.3);
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.4;
    if (abertos){ circ(c,372,327,3.4); c.fillStyle = PAL.tinta; c.fill(); circ(c,397,327,3.4); c.fill(); }
    else { c.beginPath(); c.arc(370,328,5,0.2,Math.PI-0.2); c.moveTo(400,328); c.arc(395,328,5,0.2,Math.PI-0.2); c.stroke(); }   // olhos fechadinhos
    const fr = abBoca('rosa');
    if (fr){ ell(c,383,344,4.5,1.5 + fr * 3); fs(c,'#7A2E2E',1.6); }
    else { c.beginPath(); c.arc(383,340,6,0.3,Math.PI-0.3); c.stroke(); }
    // o cobertor rosa, do peito aos pés, com o volume do corpo (respira devagar) e a dobra do lençol no alto
    const resp = RM ? 0 : Math.sin(T * 1.4) * 2;
    c.beginPath(); c.moveTo(406,404); c.lineTo(406,344);
    c.quadraticCurveTo(410,322 - resp,444,318 - resp); c.quadraticCurveTo(484,315 - resp,504,328);
    c.quadraticCurveTo(520,337,536,333); c.quadraticCurveTo(550,310,566,314); c.quadraticCurveTo(580,318,580,340);
    c.lineTo(580,404); c.closePath(); fs(c,'#E7A9B8',3);
    c.strokeStyle = 'rgba(122,46,58,.35)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(410,394); c.lineTo(576,394); c.stroke();   // a barra
    c.beginPath(); c.moveTo(466,322 - resp); c.quadraticCurveTo(480,340,474,360); c.moveTo(546,322); c.quadraticCurveTo(552,336,548,350); c.stroke();   // as dobras do pano
    // o braço da Rosa sai de baixo da dobra do lençol e estende a mão para a Bia
    abBraco(c,[[424,352],[452,366],[478,370]],SKINS[3],SKINS[3],9);
    c.beginPath(); c.moveTo(406,404); c.lineTo(406,344); c.quadraticCurveTo(407,330 - resp,418,324 - resp); c.lineTo(418,404); c.closePath(); fs(c,'#F4F1EA',2.2);
    // a Bia na cadeira (mais baixa que a cama), as pernas penduradas, segurando a mão da mãe
    rr(c,494,400,100,14,4); fs(c,PAL.madeira,2.5);
    c.lineCap = 'butt'; c.strokeStyle = PAL.tinta; c.lineWidth = 6; c.beginPath(); c.moveTo(504,414); c.lineTo(504,AB_CHAO); c.moveTo(584,414); c.lineTo(584,AB_CHAO); c.stroke();
    abBiaCrianca(c,545,402,abEsc('biaCrianca'),{ sentada:true, mood:1, t:T, bracoE:[[-22,-24],[-31,-30]] });
    // tudo um pouco mais escuro, como de noite
    c.fillStyle = 'rgba(30,42,74,.18)'; c.fillRect(0,0,TW,500);
    // depois da fala derradeira, a cortina do leito corre no trilho e cobre a cama e a Bia (a janela e a rosa ficam)
    c.fillStyle = PAL.cromoEsc; c.fillRect(0,36,730,6);
    const fecha = abSuave(abSeg(p,0.66,0.88)), cx = 30 + fecha * 690;
    if (cx > 34){
      c.fillStyle = '#9FC4BC'; c.fillRect(0,42,cx,AB_CHAO - 42);
      c.strokeStyle = 'rgba(34,32,28,.22)'; c.lineWidth = 3;
      for (let x=20;x<cx - 6;x+=34){ c.beginPath(); c.moveTo(x,46); c.lineTo(x,AB_CHAO - 4); c.stroke(); }
      c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.strokeRect(-4,42,cx + 4,AB_CHAO - 42);
      c.fillStyle = PAL.cromo; for (let x=12;x<cx;x+=34){ circ(c,x,40,4); c.fill(); }
    }
    return { rosa:[380,284,-70], bia:[545,292,80] };
  },
  saudade(c,p,T){
    // o corredor do hospital, à noite: a porta da enfermaria com a plaquinha, o rodapé e a Bia sozinha na cadeira
    c.fillStyle = '#B9CFCA'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = '#A7C0BA'; c.fillRect(0,290,TW,10);
    c.fillStyle = '#7E9A95'; c.fillRect(0,AB_CHAO - 18,TW,18);
    c.strokeStyle = PAL.tinta; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0,AB_CHAO - 18); c.lineTo(TW,AB_CHAO - 18); c.stroke();
    rr(c,110,200,130,AB_CHAO - 200,4); fs(c,'#E9E4D8',3);                       // a porta
    rr(c,140,224,70,56,4); fs(c,'#BFD8E8',2.4);
    c.fillStyle = PAL.cromo; rr(c,214,330,18,6,3); c.fill();
    rr(c,105,150,140,36,6); fs(c,'#2F6E8E',2.5); txt(c,'Enfermaria',175,169,17,'#fff','center',FB);
    abJanela(c,820,80,200,150,AB_COR.noite,T,false);
    if (!RM){ c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; for (let i=0;i<10;i++){ const x = 830 + ((i * 47 + T * 60) % 180), y = 90 + ((i * 31 + T * 220) % 130); c.beginPath(); c.moveTo(x,y); c.lineTo(x - 3,y + 10); c.stroke(); } }
    abChao(c,'#93AAA6');
    // a fileira de cadeiras vazias e a Bia na do meio
    [380,500,620,740].forEach(x => {
      rr(c,x - 40,300,80,74,8); fs(c,'#3C7BD9',2.5);
      rr(c,x - 44,372,88,14,4); fs(c,'#3C7BD9',2.5);
      c.strokeStyle = PAL.tinta; c.lineWidth = 6; c.beginPath(); c.moveTo(x - 34,386); c.lineTo(x - 34,AB_CHAO); c.moveTo(x + 34,386); c.lineTo(x + 34,AB_CHAO); c.stroke();
    });
    const sb = abEsc('biaCrianca'), kb = sb * 0.74, by = 375;
    abBiaCrianca(c,500,by,sb,{ sentada:true, mood:3, t:T, bracoE:[[-6,-20]], bracoD:[[6,-20]] });
    // a rosa nas mãos e uma lágrima
    const bp = q => [500 + q[0] * kb,by + (q[1] + 12) * kb];
    const m0 = bp([0,-20]), f0 = bp([3,-31]);
    c.strokeStyle = PAL.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(m0[0] - 2,m0[1] + 6); c.lineTo(f0[0],f0[1]); c.stroke();
    abFlor(c,f0[0],f0[1] - 3,6);
    [bp([-5,-20]),bp([5,-20])].forEach(m => { circ(c,m[0],m[1],3.6 * kb); fs(c,SKINS[4],1.8 * kb / 1.6); });
    const la = RM ? 0.5 : (T * 0.5) % 1, ol = bp([-4.2,-41.5]);
    c.globalAlpha = RM ? 1 : 1 - la;
    c.beginPath(); const lx = ol[0], ly = ol[1] + 8 + la * 12; c.moveTo(lx,ly - 6); c.quadraticCurveTo(lx + 5,ly + 2,lx,ly + 4); c.quadraticCurveTo(lx - 5,ly + 2,lx,ly - 6); fs(c,'#8EC5E8',1.4);
    c.globalAlpha = 1;
    c.fillStyle = 'rgba(30,42,74,.22)'; c.fillRect(0,0,TW,500);
    return { bia:[500,240] };
  },
  promessa(c,p,T){
    abCozinhaCasa(c,T,true);
    abPanela(c,690,AB_FOGAO,110,T,false);
    // o banquinho vazio e o copo com a rosa na bancada
    abBanquinho(c,440,400);
    rr(c,1040,AB_FOGAO - 50,28,46,6); fs(c,'rgba(255,255,255,.6)',2.4);
    c.strokeStyle = PAL.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(1054,AB_FOGAO - 24); c.lineTo(1054,AB_FOGAO - 74); c.stroke();
    abFlor(c,1054,AB_FOGAO - 80,7);
    // a Bia adulta segura o caderno de receitas da mãe com as duas mãos
    const sb = abEsc('bia'), cy = AB_CHAO - 22 * sb;
    abBia(c,560,AB_CHAO,{ t:T, maos:[[-19,-23],[19,-23]] });
    c.save(); c.translate(560,cy); c.rotate(-0.06);
    rr(c,-56,-34,112,62,5); fs(c,AB_COR.rosa,3);
    rr(c,-50,-30,48,54,3); fs(c,PAL.creme,1.6); rr(c,2,-30,48,54,3); fs(c,PAL.creme,1.6);
    c.font = '11px ' + FB; c.fillStyle = PAL.tinta; c.textAlign = 'center'; c.fillText('Receitas',-26,-14); c.fillText('da Rosa',-26,0);
    abFlor(c,26,-6,6);
    [-54,54].forEach(x => { circ(c,x,4,3.8 * sb); fs(c,'#6B3F25',1.8 * sb / 1.6); });   // as mãos nas bordas do caderno
    c.restore();
    return { bia:[560,AB_CHAO - AB_ALT.bia - 6] };
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
    // o Tonhão sai desanimado da Casa Aurora e vai até a Bia; lá, sorri e arregaça as mangas
    const k = abSuave(abSeg(p,0,0.32)), tx = 240 + k * 480, chegou = k >= 1, fl = abSuave(abSeg(p,0.32,0.4));
    abTonhao(c,tx,AB_CHAO,abEsc('tonhao'),{ toca:false, andando:!chegou, ph:T * 8, braco:chegou ? 'flex' : null, g:fl, mood:chegou ? 0 : 2, t:T, olha:chegou ? 0 : 1 });
    abBia(c,880,AB_CHAO,{ t:T, flip:-1, olha:1 });
    return { tonhao:[tx,AB_CHAO - 240], bia:[880,AB_CHAO - AB_ALT.bia] };
  },
  banco(c,p,T){
    abCeu(c,'#BFE3F7','#F7EFD8');
    abFachadaBanco(c,790,150,320);
    abChao(c,'#BDB6A8');
    // a Bia conta as moedinhas do pote e sai correndo para o banco
    const sb = abEsc('bia'), k = abSuave(abSeg(p,0.3,0.6)), bx = 260 + k * 380, corre = k > 0 && k < 1;
    const pousa = abSuave(abSeg(p,0.56,0.6)), px = bx + 6 * pousa, py = AB_CHAO + 56 * pousa;
    rr(c,px + 36,py - 120,56,64,10); fs(c,'rgba(255,255,255,.55)',3);
    rr(c,px + 32,py - 128,64,12,4); fs(c,PAL.madeira,2.4);
    [[50,-70],[66,-66],[58,-78]].forEach(m => { circ(c,px + m[0],py + m[1],7); fs(c,AB_COR.ouro,1.6); });
    const wa = abSuave(abSeg(p,0.6,0.66));
    abBia(c,bx,AB_CHAO,{ t:T, moving:corre, ph:T * 12, wave:k >= 1, wa, olha:corre ? 1 : 0 });
    // o papel sai da porta do banco e voa até a mão da Bia; lá, ganha o carimbo de APROVADO
    const vo = abSuave(abSeg(p,0.62,0.78));
    if (vo > 0){
      const wv = RM ? 0 : Math.sin(T * 8) * 5;
      const mao = [bx + (15 + (4 + wv) * wa) * sb,AB_CHAO - (18 + 34 * wa) * sb];
      const fim = [mao[0] + 46,mao[1] - 34], ini = [950,AB_CHAO - 110];
      const pos = abLerp(ini,fim,vo), esc = 0.22 + vo * 0.4, voo = vo < 1 && !RM ? Math.sin(vo * Math.PI) * 60 : 0;
      c.save(); c.translate(pos[0],pos[1] - voo); c.rotate(-0.12 - (1 - vo) * 0.6); c.scale(esc,esc);
      rr(c,-90,-60,180,120,4); fs(c,'#fff',3 / esc * 0.6);
      c.fillStyle = '#B9C2CC'; for (let i=0;i<4;i++) c.fillRect(-70,-40 + i*16,140,5);
      const cb = abSeg(p,0.8,0.88);
      if (cb > 0){
        const sc = RM ? 1 : 1 + (1 - cb) * 0.8;
        c.scale(sc,sc); c.globalAlpha = RM ? 1 : cb;
        rr(c,-84,-20,168,44,6); c.lineWidth = 5; c.strokeStyle = PAL.ok; c.stroke();
        txt(c,'APROVADO',0,2,30,PAL.ok,'center',FD);
        c.globalAlpha = 1;
      }
      c.restore();
      if (vo >= 1){ circ(c,mao[0],mao[1],3.8 * sb); fs(c,'#6B3F25',1.8 * sb / 1.6); }   // a mão por cima do papel
    }
    return { bia:[bx,AB_CHAO - AB_ALT.bia,-40] };
  },
  inauguracao(c,p,T){
    abCeu(c,AB_COR.noite,AB_COR.noite2);
    // estrelinhas do céu e a estrela que pisca (longe dos botões Voltar e Pular)
    c.fillStyle = 'rgba(255,255,255,.7)';
    [[80,60],[210,170],[330,40],[460,150],[720,170],[860,140],[1010,90],[1150,160]].forEach((s,i) => { circ(c,s[0],s[1],RM ? 1.8 : 1.4 + Math.abs(Math.sin(T * 2 + i)) * 1.2); c.fill(); });
    const brilha = abSeg(p,0.6,0.72), ex = 150, ey = 120;
    if (brilha > 0){
      const r = 16 + (RM ? 0 : Math.sin(T * 4) * 4);
      c.globalAlpha = brilha;
      const gl = c.createRadialGradient(ex,ey,r * 0.5,ex,ey,r * 2.6); gl.addColorStop(0,'rgba(255,226,140,.55)'); gl.addColorStop(1,'rgba(255,226,140,0)');
      c.fillStyle = gl; circ(c,ex,ey,r * 2.6); c.fill();
      star(c,ex,ey,r,AB_COR.ouro);
      c.globalAlpha = 1;
    }
    // a casa com a garagem; a porta de enrolar sobe e mostra a lanchonete acesa
    rr(c,300,226,620,AB_CHAO - 226,4); fs(c,'#E2C9A0',3);
    c.beginPath(); c.moveTo(270,236); c.lineTo(610,148); c.lineTo(950,236); c.closePath(); fs(c,'#B5533A',3);
    const sobe = abSuave(abSeg(p,0.05,0.4)), gx = 400, gy = 306, gw = 420, gh = AB_CHAO - 306;
    rr(c,gx,gy,gw,gh,4); fs(c,'#FFE7A8',3);
    c.fillStyle = PAL.piso1; c.fillRect(gx + 4,gy + gh - 50,gw - 8,46);
    [470,620,760].forEach(x => {
      [-48,48].forEach(d => { c.strokeStyle = PAL.tinta; c.lineWidth = 4; c.beginPath(); c.moveTo(x + d,AB_CHAO - 50); c.lineTo(x + d,AB_CHAO - 30); c.stroke(); rr(c,x + d - 12,AB_CHAO - 56,24,7,3); fs(c,PAL.alerta,2); });   // os banquinhos
      ell(c,x,AB_CHAO - 70,34,10); fs(c,PAL.formica,2.4); c.fillStyle = PAL.tinta; c.fillRect(x - 3,AB_CHAO - 68,6,28);
    });
    const porta = gh * (1 - sobe);
    if (porta > 2){
      rr(c,gx,gy,gw,porta,3); fs(c,'#A3A9B0',3);
      c.strokeStyle = PAL.cromoEsc; c.lineWidth = 3; for (let y=gy + 22;y<gy + porta;y+=22){ c.beginPath(); c.moveTo(gx + 4,y); c.lineTo(gx + gw - 4,y); c.stroke(); }
    }
    // o letreiro acende (pisca 2 vezes antes de firmar)
    const acende = p >= 0.45, pisca = !RM && p < 0.52 && Math.floor(T * 10) % 2 === 0;
    rr(c,410,244,400,52,12); fs(c,PAL.tinta,3);
    txt(c,'Lanchonete Corre-Corre',610,270,28,acende && !pisca ? PAL.mostarda : '#5b5446','center',FD,0,380);
    if (acende && !pisca){ c.strokeStyle = 'rgba(242,179,61,.5)'; c.lineWidth = 6; rr(c,404,238,412,64,15); c.stroke(); }
    abChao(c,'#5B5F6B');
    // a Bia e o Tonhão na frente; os acenos sobem aos poucos
    const ac = abSuave(abSeg(p,0.45,0.52));
    abBia(c,300,AB_CHAO,{ t:T, wave:ac > 0, wa:ac });
    abTonhao(c,950,AB_CHAO,abEsc('tonhao'),{ braco:ac > 0 ? 'aceno' : null, g:ac, t:T });
    // o título, acima do telhado
    const ti = abSeg(p,0.55,0.7);
    if (ti > 0){ c.globalAlpha = ti; txt(c,'O sonho da Bia',610,82,64,PAL.mostarda,'center',FD,8); c.globalAlpha = 1; }
    return { bia:[300,AB_CHAO - AB_ALT.bia], tonhao:[950,AB_CHAO - 275] };
  }
};
// mistura duas cores #rrggbb (k de 0 a 1)
function abMistura(a,b,k){
  const h = s => [1,3,5].map(i => parseInt(s.substr(i,2),16)), x = h(a), y = h(b);
  return 'rgb(' + x.map((v,i) => Math.round(v + (y[i] - v) * k)).join(',') + ')';
}

/* ---------- balões, legenda e o desenho de tudo ---------- */
const AB_UI = { fala:20, linha:25, falaW:330, leg:21, legLinha:27 };
// o balão fica acima de quem fala; dx o leva para o lado livre (a ponta continua apontando para a cabeça)
function abBalao(c,s,ax,ay,dx){
  const U = AB_UI, lin = treinoLinhas(c,s,U.falaW,U.fala);
  c.font = U.fala + 'px ' + FB;
  const w = Math.max.apply(null,lin.map(l => c.measureText(l).width)) + 34, h = lin.length * U.linha + 22;
  const x = clamp(ax + (dx || 0) - w/2,16,TW - 16 - w), y = Math.max(10,ay - 22 - h);
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
  // a boca de quem fala abre e fecha nos primeiros segundos do balão (nada disso com movimento reduzido)
  AB_VIVO.fala = {};
  if (T > 0) ab.falas().forEach(f => { const d = ab.t - f.de; if (d >= 0 && d < 1.8) AB_VIVO.fala[f.q] = Math.abs(Math.sin(d * 11)); });
  c.save();
  c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
  const desenha = AB_CENAS[ab.cena.id];
  const cab = (desenha && desenha(c,ab.p,T)) || {};
  ab.falas().forEach(f => { const a = cab[f.q]; if (a) abBalao(c,f.s,a[0],a[1],a[2]); });
  abLegenda(c,ab);
  const e = ab.escuro;
  if (e > 0){ c.fillStyle = 'rgba(16,14,12,' + e + ')'; c.fillRect(0,0,TW,H); }
  c.restore();
}
