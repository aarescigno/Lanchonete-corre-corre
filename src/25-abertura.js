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
const AB_ALT = { rosa:210, bia:210, biaCrianca:130, tonhao:230, braulio:230, dani:200, joca:215, cami:205, anselmo:220, lia:200 };   // v11: a equipe da foto e a Dani adulta
const AB_BASE = { rosa:63, bia:73.5, biaCrianca:46, tonhao:114, braulio:115, dani:63, joca:63, cami:63, anselmo:63, lia:63 };
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
    bracoE:o.bracoE, bracoD:o.bracoD, pisca:!!o.fecha || abPisca(o.t || 0,0.3), fala:abBoca('rosa'), olha:o.olha, back:!!o.costas });   // v11.12: bracoE (a abertura nova posa os dois braços); v11.13: fecha (olhos fechados) e costas
  c.scale(s,s);
  if (o.avental !== false){ c.beginPath(); c.moveTo(-8,-29); c.lineTo(8,-29); c.lineTo(11,-12); c.lineTo(-11,-12); c.closePath(); fs(c,o.avental || '#fff',2); }
  if (!o.semFlor) abFlor(c,9,-53,3.2);   // v11.14: semFlor (no quarto, a flor está no copo)
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
  drawPerson(c,{ kid:true, skin:4, hair:3, hairC:'#15100D', pants:'#7B4A2C' },x,y,{ s, shirt:PAL.mostarda, handUp:!!o.aceno, t:o.t || 0, mood:o.mood || 0, sit:!!o.sentada, noShadow:!!o.sentada, moving:!!o.andando, ph:o.ph || 0,   // v11.12: andando
    bracoE:o.bracoE, bracoD:o.bracoD, pisca:!!o.fecha || abPisca(o.t || 0,2.6), fala:abBoca('bia'), olha:o.olha, back:!!o.costas });   // v11.12: fecha (olhos fechados) e olha; v11.14: costas
  c.save(); c.translate(x,y + (o.sentada ? 12 * k : 0)); c.scale(k,k);
  if (o.andando && !RM) c.translate(0,-Math.abs(Math.sin(o.ph || 0)) * 2.4);   // v11.12: o laço sobe e desce com a cabeça, no passo
  c.beginPath(); c.moveTo(12,-58); c.lineTo(20,-64); c.lineTo(20,-52); c.closePath(); fs(c,PAL.alerta,1.5);
  c.beginPath(); c.moveTo(12,-58); c.lineTo(4,-66); c.lineTo(5,-53); c.closePath(); fs(c,PAL.alerta,1.5);
  c.restore();
}
// a Bia adulta, com o piscar e a boca da fala
function abBia(c,x,y,o){ drawBia(c,{},x,y,Object.assign({ roupa:1, s:abEsc('bia'), pisca:abPisca(o.t || 0,1.9), fala:abBoca('bia') },o)); }
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
  else abBraco(c,[[-19,-76]].concat(o.bracoE || [[-25,-44]]),roupa,pele);   // v11.13: bracoE (os pontos do braço de trás, depois do ombro)
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
  else abBraco(c,[[19,-76]].concat(o.bracoD || [[25,-44]]),roupa,pele);   // v11.13: bracoD (os pontos do braço da frente)
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
  // olhos fechados de orgulho e o nariz empinado (v11.16, o.triste: olhos abertos e sobrancelhas caídas, para o final)
  c.strokeStyle = PAL.tinta; c.lineWidth = 2;
  if (o.triste){ c.fillStyle = PAL.tinta; circ(c,-5.5,hy-3,1.8); c.fill(); circ(c,5.5,hy-3,1.8); c.fill(); c.beginPath(); c.moveTo(-9.5,hy-8); c.lineTo(-2.5,hy-10.5); c.moveTo(9.5,hy-8); c.lineTo(2.5,hy-10.5); c.stroke(); }
  else { c.beginPath(); c.arc(-5.5,hy-4,2.6,Math.PI,TAU); c.moveTo(8.1,hy-4); c.arc(5.5,hy-4,2.6,0,Math.PI,true); c.stroke(); }
  c.beginPath(); c.moveTo(1,hy-2); c.lineTo(6,hy+2); c.lineTo(1,hy+3); c.stroke();
  // bigodinho enrolado, logo abaixo do nariz; a boca fica embaixo dele
  c.lineWidth = 2.4; c.beginPath();
  c.moveTo(0,hy+5); c.quadraticCurveTo(-8,hy+2,-12,hy+5); c.arc(-12,hy+2,3,Math.PI/2,Math.PI*1.8);
  c.moveTo(0,hy+5); c.quadraticCurveTo(8,hy+2,12,hy+5); c.arc(12,hy+2,3,Math.PI/2,-Math.PI*0.8,true);
  c.stroke();
  const fala = abBoca('braulio');
  if (fala){ ell(c,0,hy+10.5,3.2,1.2 + fala * 2.2); fs(c,'#7A2E2E',1.5); }
  else { c.lineWidth = 1.8; c.beginPath(); if (o.triste) c.arc(0,hy+13,3.5,Math.PI + 0.3,TAU - 0.3); else c.arc(0,hy+9,3.5,0.3,Math.PI-0.3); c.stroke(); }
  // os braços seguram a plaquinha na frente do peito, erguida (o: ergue de 0 a 1)
  if (o.semPlaca){ c.restore(); return; }   // v11.13: a abertura nova posa os braços e a placa por fora
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
/* as cenas do final (as da abertura, refeitas, estão na AB2_CENAS, em 27-abertura-nova.js; as 10 antigas saíram na v11.15) */
const AB_CENAS = {};
/* ---------- o final (v11): figuras e cenários novos ---------- */
// avental por cima do tronco de quem foi desenhado com drawPerson (x,y: os pés; s: a escala)
function abAvental(c,x,y,s,cor){
  c.save(); c.translate(x,y); c.scale(s,s);
  c.beginPath(); c.moveTo(-8,-30); c.lineTo(8,-30); c.lineTo(11,-12); c.lineTo(-11,-12); c.closePath(); fs(c,cor,2.2);
  c.restore();
}
// a Dani adulta, de avental roxo (o look dela no jogo)
function abDani(c,x,y,o){
  o = o || {};
  const s = o.s || abEsc('dani');
  drawPerson(c,DANI_LOOK,x,y,Object.assign({ s, shirt:'#F7EFD8', pisca:abPisca(o.t || 0,0.9), fala:abBoca('dani') },o));
  abAvental(c,x,y,s,'#7B4FB5');
}
// uma criança do bairro: o: pele, cabelo (0 a 6), cor (do cabelo), camisa, calca, bracoD, bracoE, t
function abCrianca(c,x,y,s,o){
  o = o || {};
  drawPerson(c,{ kid:true, skin:o.pele == null ? 2 : o.pele, hair:o.cabelo == null ? 6 : o.cabelo, hairC:o.cor || '#1B1512', pants:o.calca || '#3C5A4A' },x,y,
    { s, shirt:o.camisa || '#3C7BD9', t:o.t || 0, pisca:abPisca(o.t || 0,o.sd || 0.6), bracoD:o.bracoD, bracoE:o.bracoE, olha:o.olha, handUp:!!o.aceno, noShadow:!!o.semSombra });
}
// uma pessoa de costas (a Bia e o Tonhão olhando o céu): o: roupa, calca, pele, cabelo ('puff' | 'toca'), cor, laco
function abCostas(c,x,y,s,o){
  c.save(); c.translate(x,y); c.scale(s,s);
  shadowEll(c,0,0,24,6,0.22);
  rr(c,-14,-34,11,33,3); fs(c,o.calca,2.4); rr(c,3,-34,11,33,3); fs(c,o.calca,2.4);
  ell(c,-9,-1,8,4); fs(c,'#2c2a26',2); ell(c,9,-1,8,4); fs(c,'#2c2a26',2);
  c.beginPath(); c.moveTo(-23,-30); c.lineTo(-19,-82); c.lineTo(19,-82); c.lineTo(23,-30); c.closePath(); fs(c,o.roupa,2.6);
  c.strokeStyle = 'rgba(34,32,28,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0,-80); c.lineTo(0,-32); c.stroke();   // a costura das costas
  if (o.laco){ c.beginPath(); c.moveTo(-20,-44); c.lineTo(20,-44); c.lineTo(19,-38); c.lineTo(-19,-38); c.closePath(); fs(c,o.laco,2); circ(c,0,-41,5); fs(c,o.laco,2); }
  rr(c,-6,-92,12,12,3); fs(c,o.pele,2);                                          // o pescoço
  const hy = -100;
  circ(c,-15,hy+2,3.6); fs(c,o.pele,1.8); circ(c,15,hy+2,3.6); fs(c,o.pele,1.8);   // as orelhas
  circ(c,0,hy,15.5); fs(c,o.pele,2.6);
  if (o.cabelo === 'puff'){ circ(c,0,hy,15.8); fs(c,o.cor,2.4); circ(c,0,hy - 11,15); fs(c,o.cor,2.4); circ(c,0,hy - 4,12); c.fillStyle = o.cor; c.fill(); }
  else {
    c.beginPath(); c.arc(0,hy + 3,15,Math.PI * 0.05,Math.PI * 0.95); c.closePath(); fs(c,o.cor,1.6);   // a nuca com cabelo grisalho
    rr(c,-13,hy - 20,26,12,2); fs(c,'#fff',2.4);
    c.beginPath(); c.arc(-9,hy - 24,8,0,TAU); c.arc(0,hy - 29,9,0,TAU); c.arc(9,hy - 24,8,0,TAU); fs(c,'#fff',2.4);
    rr(c,-13,hy - 20,26,8,2); c.fillStyle = '#fff'; c.fill();
  }
  c.restore();
}
// uma mesa do Terraço, vazia, com toalha branca (x,y: o chão sob o pé da mesa)
function abMesaTe(c,x,y,s){
  c.save(); c.translate(x,y); c.scale(s,s);
  [-1,1].forEach(d => { rr(c,d * 88 - 14,-70,28,70,5); fs(c,'#7B4A2C',2.4); rr(c,d * 88 - 18,-42,36,10,4); fs(c,'#C8506A',2.2); });
  c.strokeStyle = PAL.tinta; c.lineWidth = 9; c.beginPath(); c.moveTo(0,-4); c.lineTo(0,-62); c.stroke(); c.strokeStyle = '#B9C2CC'; c.lineWidth = 5; c.stroke();
  ell(c,0,-2,28,7); fs(c,'#B9C2CC',2.2);
  ell(c,0,-66,74,17); fs(c,'#fff',2.6);
  c.beginPath(); c.moveTo(-74,-66); c.lineTo(-68,-44); c.lineTo(-30,-40); c.lineTo(0,-46); c.lineTo(30,-40); c.lineTo(68,-44); c.lineTo(74,-66); c.fillStyle = '#fff'; c.fill(); c.strokeStyle = PAL.tinta; c.lineWidth = 2.4; c.stroke();
  rr(c,-5,-86,10,16,3); fs(c,'rgba(255,255,255,.7)',2); circ(c,0,-91,4); fs(c,AB_COR.petala,1.6);   // a florzinha no copo
  c.restore();
}
// a janela com a cidade ao amanhecer (x,y,w,h); T: o relógio
function abJanelaCidade(c,x,y,w,h,T){
  c.save(); rr(c,x,y,w,h,8); c.clip();
  const g = c.createLinearGradient(0,y,0,y + h); g.addColorStop(0,'#FFC99A'); g.addColorStop(0.55,'#FFE9C2'); g.addColorStop(1,'#BFE3F7');
  c.fillStyle = g; c.fillRect(x,y,w,h);
  const sx = x + w * 0.74, sy = y + h * 0.5, sr = 34 + (RM ? 0 : Math.sin(T * 1.5) * 1.5);
  const gl = c.createRadialGradient(sx,sy,sr * 0.4,sx,sy,sr * 3); gl.addColorStop(0,'rgba(255,240,170,.8)'); gl.addColorStop(1,'rgba(255,240,170,0)'); c.fillStyle = gl; c.fillRect(x,y,w,h);
  circ(c,sx,sy,sr); c.fillStyle = '#FFF1B0'; c.fill();
  [[0.02,0.10,0.34,'#A9B8CC'],[0.14,0.12,0.46,'#9FB0C6'],[0.27,0.09,0.30,'#B3C1D4'],[0.62,0.1,0.38,'#9FB0C6'],[0.8,0.12,0.30,'#A9B8CC'],[0.9,0.1,0.42,'#9FB0C6']].forEach(b => { c.fillStyle = b[3]; c.fillRect(x + b[0] * w,y + h * (1 - b[2]),b[1] * w,h * b[2] + 2); });
  [[0.0,0.13,0.26,'#7C93AE'],[0.18,0.1,0.32,'#7289A6'],[0.33,0.14,0.2,'#7C93AE'],[0.5,0.11,0.3,'#7289A6'],[0.68,0.14,0.24,'#7C93AE'],[0.86,0.14,0.34,'#7289A6']].forEach(b => {
    const bx = x + b[0] * w, bw = b[1] * w, bh = h * b[2], by = y + h - bh;
    c.fillStyle = b[3]; c.fillRect(bx,by,bw,bh + 2);
    c.fillStyle = 'rgba(255,236,160,.85)'; for (let j = 0; j < bh - 12; j += 18) for (let k = 6; k < bw - 8; k += 14) c.fillRect(bx + k,by + 8 + j,5,8);
  });
  c.restore();
  rr(c,x,y,w,h,8); c.strokeStyle = PAL.tinta; c.lineWidth = 5; c.stroke();
  c.strokeStyle = PAL.tinta; c.lineWidth = 4; c.beginPath(); c.moveTo(x + w/2,y); c.lineTo(x + w/2,y + h); c.moveTo(x,y + h * 0.62); c.lineTo(x + w,y + h * 0.62); c.stroke();
  rr(c,x - 8,y + h,w + 16,12,3); fs(c,'#E9D8BF',2.4);   // o parapeito da janela
}
// a parede e o piso do Terraço (parede creme com lambri, piso de tábuas)
function abTerracoSala(c,noite){
  c.fillStyle = noite ? '#D9CBB0' : '#F3E8D2'; c.fillRect(0,0,TW,AB_CHAO);
  c.fillStyle = 'rgba(122,46,58,.07)'; for (let x=0;x<TW;x+=60) c.fillRect(x,0,26,AB_CHAO);
  c.fillStyle = '#D9C3A0'; c.fillRect(0,300,TW,AB_CHAO - 300);
  c.fillStyle = '#C9AE86'; c.fillRect(0,294,TW,10);
  c.strokeStyle = 'rgba(34,32,28,.18)'; c.lineWidth = 2; for (let x=40;x<TW;x+=120){ c.beginPath(); c.moveTo(x,304); c.lineTo(x,AB_CHAO); c.stroke(); }
  abChao(c,'#B89A74');
  c.strokeStyle = 'rgba(34,32,28,.15)'; c.lineWidth = 2; for (let y=AB_CHAO + 10;y<500;y+=10){ c.beginPath(); c.moveTo(0,y); c.lineTo(TW,y); c.stroke(); }
}
// o telefone de mesa: base preta com o disco e o gancho; (x,y): o centro da base. fora: o fone saiu do gancho
function abTelefone(c,x,y,fora,T,toca){
  rr(c,x - 34,y - 14,68,28,8); fs(c,'#2c2a26',2.6);
  circ(c,x,y,10); fs(c,'#D9D4C8',2); circ(c,x,y,3.4); c.fillStyle = '#2c2a26'; c.fill();
  rr(c,x - 30,y - 22,12,12,4); fs(c,'#2c2a26',2); rr(c,x + 18,y - 22,12,12,4); fs(c,'#2c2a26',2);
  if (!fora){ const t = toca && !RM ? Math.sin(T * 45) * 1.4 : 0; rr(c,x - 42 + t,y - 30,84,14,7); fs(c,'#3A3A40',2.6); }
  if (toca){   // as ondinhas do toque
    c.strokeStyle = AB_COR.ouro; c.lineWidth = 3.4; c.lineCap = 'round';
    for (let i=0;i<2;i++){ const k = RM ? 0.5 + i * 0.3 : ((T * 1.6 + i * 0.5) % 1); c.globalAlpha = RM ? 0.9 : 1 - k;
      [-1,1].forEach(d => { c.beginPath(); c.arc(x,y - 34,20 + k * 34,d > 0 ? -Math.PI * 0.45 : -Math.PI * 0.95,d > 0 ? -Math.PI * 0.05 : -Math.PI * 0.55); c.stroke(); }); }
    c.globalAlpha = 1;
  }
}
// o fone do telefone na mão: ao longo da bochecha (cx,cy: o meio)
function abFone(c,cx,cy,rot){
  c.save(); c.translate(cx,cy); c.rotate(rot || 0);
  rr(c,-7,-36,14,72,7); fs(c,'#3A3A40',2.6);
  rr(c,-9,-38,18,16,7); fs(c,'#2c2a26',2.2); rr(c,-9,22,18,16,7); fs(c,'#2c2a26',2.2);
  c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(-3,-18,3,36);
  c.restore();
}
// a placa de latão do Michelzão (cx,cy: o centro; inclinada um tiquinho). est: as estrelas vermelhas; parafuso: false deixa o último sem parafuso
function abPlacaMichel(c,cx,cy,w,h,est,rot,parafuso,brilho){
  c.save(); c.translate(cx,cy); c.rotate(rot || 0);
  const g = c.createLinearGradient(-w/2,-h/2,w/2,h/2); g.addColorStop(0,'#F0D78A'); g.addColorStop(0.5,'#D9B24A'); g.addColorStop(1,'#B8902E');
  c.fillStyle = g; rr(c,-w/2,-h/2,w,h,10); c.fill(); c.strokeStyle = PAL.tinta; c.lineWidth = 3.4; c.stroke();
  rr(c,-w/2 + 8,-h/2 + 8,w - 16,h - 16,6); c.strokeStyle = '#8A6A1E'; c.lineWidth = 2.4; c.stroke();
  txt(c,'Michelzão',0,-h * 0.16,Math.round(h * 0.34),'#4A3510','center',FD,0,w - 70);
  for (let i=0;i<est;i++) star(c,(i - (est - 1) / 2) * h * 0.34,h * 0.26,h * 0.15,'#D8342C');
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach((q,i) => {
    if (i === 3 && !parafuso) return;
    circ(c,q[0] * (w/2 - 17),q[1] * (h/2 - 17),5.4); fs(c,'#C9CED6',1.8);
    c.strokeStyle = '#6E7480'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(q[0] * (w/2 - 17) - 3.4,q[1] * (h/2 - 17) - 1); c.lineTo(q[0] * (w/2 - 17) + 3.4,q[1] * (h/2 - 17) + 1); c.stroke();
  });
  if (brilho > 0){ c.globalAlpha = brilho; star(c,w * 0.34,-h * 0.36,10 + brilho * 6,'#FFF8D6'); c.globalAlpha = 1; }
  c.restore();
}
// a roseira: o arbusto (x,y: o pé) com rosas
function abRoseira(c,x,y,s,T){
  c.save(); c.translate(x,y); c.scale(s,s);
  [[-34,-34,34],[0,-52,40],[34,-30,32],[-12,-22,30],[18,-68,26]].forEach(b => { ell(c,b[0],b[1],b[2],b[2] * 0.86); fs(c,'#3E8F4A',2.4); });
  [[-40,-48],[-8,-72],[30,-58],[44,-30],[-22,-20],[6,-38],[24,-82]].forEach((f,i) => abFlor(c,f[0],f[1] + (RM ? 0 : Math.sin(T * 1.5 + i) * 1.2),7));
  c.restore();
}
// uma pessoa da equipe na foto da parede (de avental), no tamanho da cena vezes k
function abPessoaFoto(c,q,x,y,k){
  const s = abEsc(q,k);
  if (q === 'bia') return abBia(c,x,y,{ s,t:0 });
  if (q === 'tonhao') return abTonhao(c,x,y,s,{ t:0 });
  if (q === 'dani') return abDani(c,x,y,{ s,t:0 });
  const L = { joca:[JOCA_LOOK,'#B9BDC4','#1F4E8C'], cami:[CAMI_LOOK,'#8A1F3D','#1E1D21'], anselmo:[ANSELMO_LOOK,'#FFFFFF','#1E1D21'], lia:[LIA_LOOK,'#FFFFFF','#9FB8A8'] }[q];
  drawPerson(c,L[0],x,y,{ s,shirt:L[1],t:0 });
  abAvental(c,x,y,s,L[2]);
  if (q === 'lia'){ c.save(); c.translate(x,y); c.scale(s,s); circ(c,0,-57,6.4); fs(c,'#1B1512',1.8); c.beginPath(); c.arc(0,-43,12.6,Math.PI * 1.08,Math.PI * 1.92); c.lineTo(12,-46); c.quadraticCurveTo(0,-51,-12,-46); c.closePath(); fs(c,'#D9A21B',1.8); c.restore(); }
}
Object.assign(AB_CENAS, {
  // a manhã seguinte: o telefone toca no Terraço vazio; a Bia atende e leva a mão à boca; o Tonhão espia pela janela da cozinha
  telefone(c,p,T){
    abTerracoSala(c,false);
    abJanelaCidade(c,80,70,400,220,T);
    abMesaTe(c,250,452,1); abMesaTe(c,440,470,0.9);
    rr(c,566,396,300,AB_CHAO - 396,5); fs(c,PAL.madeira,3); rr(c,556,384,320,16,4); fs(c,PAL.creme,3);   // o balcão da entrada
    const k = abSuave(abSeg(p,0,0.28)), pega = abSuave(abSeg(p,0.3,0.4)), boca = abSuave(abSeg(p,0.66,0.78)), sb = abEsc('bia');
    const bx = 330 + k * 270, base = [680,372];
    abTelefone(c,base[0],base[1],pega > 0.1,T,p < 0.3);
    const mao = abLerp([40,-25],[14,-44],pega), anda = k > 0 && k < 1;
    abBia(c,bx,AB_CHAO,{ t:T, moving:anda, ph:T * 10, olha:k < 1 ? 1 : 0, maos:[abLerp([-15,-18],[-4,-37],boca), pega > 0 ? mao : [15,-18]] });
    if (boca > 0.02){ const sh = [bx - 10 * sb,AB_CHAO - 30 * sb], m = abLerp([-15,-18],[-5,-39],boca), hm = [bx + m[0] * sb,AB_CHAO + m[1] * sb]; abBraco(c,[sh,hm],'#2E8B57','#6B3F25',5 * sb); circ(c,hm[0],hm[1],3.8 * sb); fs(c,'#6B3F25',1.8 * sb / 1.6); }   // a mão sobe até a boca, por cima do rosto
    if (pega > 0.1){ const hp = [bx + mao[0] * sb,AB_CHAO + mao[1] * sb]; abFone(c,hp[0] + 2,hp[1] - 6,0.12); circ(c,hp[0],hp[1] + 8,3.8 * sb); fs(c,'#6B3F25',1.8 * sb / 1.6); }
    // a janela da cozinha, com o Tonhão espiando (um pouco mais longe)
    rr(c,930,170,220,200,6); fs(c,'#F7E2A6',3);
    c.save(); c.beginPath(); c.rect(930,170,220,200); c.clip();
    const sobe = abSuave(abSeg(p,0.36,0.6));
    abTonhao(c,1040,520 - sobe * 56,abEsc('tonhao',0.82),{ flip:-1, t:T, olha:-1 });
    c.restore();
    c.strokeStyle = PAL.tinta; c.lineWidth = 4; c.strokeRect(930,170,220,200); rr(c,920,366,240,14,3); fs(c,PAL.creme,2.6);
    return { bia:[bx + 10,AB_CHAO - AB_ALT.bia - 6,-30] };
  },
  // a placa de latão vai para a parede ao lado da porta: o Tonhão, na ponta dos pés, aperta o último parafuso
  placa(c,p,T){
    abTerracoSala(c,false);
    // a porta de vidro do Terraço, com o ABERTO pendurado
    rr(c,90,150,210,AB_CHAO - 150,6); fs(c,'#8A5226',3.4);
    rr(c,108,170,174,AB_CHAO - 200,4); fs(c,'rgba(191,227,247,.85)',2.6);
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 8; c.beginPath(); c.moveTo(130,AB_CHAO - 50); c.lineTo(190,200); c.stroke();
    circ(c,268,330,6); fs(c,AB_COR.ouro,2);
    rr(c,148,262,84,34,6); fs(c,PAL.perigo,2.6); txt(c,'ABERTO',190,280,18,'#fff','center',FB);
    const est = AB_VIVO.est || 1, fim = abSuave(abSeg(p,0.4,0.55));
    abPlacaMichel(c,820,200,280,124,est,-0.035,fim > 0.5,abSeg(p,0.6,0.8) * (1 - abSeg(p,0.85,1)));
    // o Tonhão, na ponta dos pés, com a chave de fenda no último parafuso (canto de baixo, à direita)
    const up = 8 + (RM ? 0 : Math.sin(T * 3) * 2), tx = 1040, st = abEsc('tonhao'), gira = p < 0.5 && !RM ? Math.sin(T * 12) * 3 : 0;
    abTonhao(c,tx,AB_CHAO - up,st,{ flip:-1, braco:'aceno', g:1, t:p < 0.5 ? T : 0.4, olha:-1 });
    const mx = tx - 36 * st, my = AB_CHAO - up - 112 * st;
    c.lineCap = 'round'; c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(mx + 6,my - 2 + gira); c.lineTo(mx - 24,my + 2 + gira); c.stroke();
    c.strokeStyle = PAL.perigo; c.lineWidth = 4.4; c.beginPath(); c.moveTo(mx + 6,my - 2 + gira); c.lineTo(mx - 12,my + gira); c.stroke();
    abBia(c,540,AB_CHAO,{ t:T, olha:1, maos:[[8,-26],[-8,-24]] });   // de braços cruzados
    return { tonhao:[tx,AB_CHAO - AB_ALT.tonhao - up - 8,60], bia:[540,AB_CHAO - AB_ALT.bia - 6,-60] };
  },
  // a Casa Aurora de noite: a estrela do letreiro pisca e apaga; o Bráulio, de costas para a panela, com as mãos na cabeça
  apagou(c,p,T){
    abCeu(c,'#101A33','#3A3F6E');
    c.fillStyle = 'rgba(255,255,255,.75)';
    [[70,60],[190,150],[300,50],[430,120],[1010,70],[1120,160],[1160,50],[960,150]].forEach((s,i) => { circ(c,s[0],s[1],RM ? 1.8 : 1.3 + Math.abs(Math.sin(T * 2 + i)) * 1.1); c.fill(); });
    circ(c,120,110,26); c.fillStyle = '#FFF4C2'; c.fill(); circ(c,132,104,22); c.fillStyle = '#101A33'; c.fill();   // a lua minguante
    abFachadaAurora(c,340,90,600,AB_CHAO - 90,false);
    c.fillStyle = 'rgba(16,26,51,.3)'; c.fillRect(340,90,600,AB_CHAO - 90);   // a rua escura sobre a fachada
    rr(c,340 + 300 - 150,104,300,48,10); fs(c,AB_COR.aurora,3); txt(c,'Casa Aurora',640,130,30,PAL.creme,'center',FD);   // o letreiro continua aceso
    // a plaquinha da estrela: acesa, pisca e apaga
    const ex = 470, ey = 262, acesa = p < 0.3 ? 1 : p < 0.62 ? (!RM && Math.floor(T * 8) % 2 === 0 ? 0.25 : 1) : 0, pisca = p >= 0.3 && p < 0.62;
    circ(c,ex,ey,26); fs(c,'#5A3A22',2.5);
    if (acesa > 0.5){ const gl = c.createRadialGradient(ex,ey,6,ex,ey,70); gl.addColorStop(0,'rgba(255,226,140,.6)'); gl.addColorStop(1,'rgba(255,226,140,0)'); c.fillStyle = gl; c.fillRect(ex - 70,ey - 70,140,140); }
    star(c,ex,ey,16,acesa > 0.5 ? AB_COR.ouro : '#4A3A33');
    if (p >= 0.62){ c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(ex + 20,ey - 28); c.lineTo(ex + 34,ey - 40); c.moveTo(ex + 26,ey - 18); c.lineTo(ex + 42,ey - 24); c.stroke(); }
    // a janela da cozinha, acesa, com o Bráulio de costas para a panela
    rr(c,700,190,200,170,6); fs(c,'#FFE7A8',3);
    c.save(); c.beginPath(); c.rect(700,190,200,170); c.clip();
    rr(c,712,300,76,70,6); fs(c,'#8E99A6',3); rr(c,706,294,88,10,4); fs(c,'#B9C2CC',2.4); ell(c,750,296,32,5); c.fillStyle = AB_COR.molho; c.fill();   // a panela do molho
    if (!RM){ const vp = (T * 1.4) % 1; c.globalAlpha = 1 - vp; c.strokeStyle = 'rgba(110,128,148,.6)'; c.lineWidth = 6; c.beginPath(); c.moveTo(750,288 - vp * 24); c.bezierCurveTo(740,270 - vp * 24,764,262 - vp * 24,752,244 - vp * 24); c.stroke(); c.globalAlpha = 1; }
    const sbr = abEsc('braulio',0.7), mao = abSuave(abSeg(p,0.5,0.66));
    abCostas(c,842,410,sbr,{ roupa:'#fff',calca:'#2B2B33',pele:'#F2C9A5',cabelo:'toca',cor:'#8C8C8C' });
    const sh = [842 - 19 * sbr,410 - 80 * sbr], sh2 = [842 + 19 * sbr,410 - 80 * sbr], cab = [842,410 - 112 * sbr];
    [[sh,-1],[sh2,1]].forEach(([s0,d]) => { const m = abLerp([s0[0] + d * 6,s0[1] + 50],[cab[0] + d * 26,cab[1] - 4],mao); abBraco(c,[s0,abLerp(s0,m,0.5).map((v,i) => v + (i ? 0 : d * 10)),m],'#fff','#F2C9A5'); });
    c.restore();
    c.strokeStyle = PAL.tinta; c.lineWidth = 3.4; c.strokeRect(700,190,200,170); c.beginPath(); c.moveTo(800,190); c.lineTo(800,360); c.stroke();
    abChao(c,'#2E2A30');
    // um poste de luz na esquina
    c.strokeStyle = PAL.tinta; c.lineWidth = 7; c.beginPath(); c.moveTo(150,AB_CHAO); c.lineTo(150,260); c.stroke(); c.strokeStyle = '#8E99A6'; c.lineWidth = 3.4; c.stroke();
    circ(c,150,250,14); fs(c,'#FFE7A8',2.4);
    return { braulio:[842,200,150] };
  },
  // a parede do Cantinho da Rosa: a Bia pendura a estrelinha ao lado da foto da dona Rosa; no fim, uma pétala cai devagar
  retrato(c,p,T){
    c.fillStyle = '#E8CFA8'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = 'rgba(122,46,58,.08)'; for (let x=0;x<TW;x+=50) c.fillRect(x,0,22,AB_CHAO);
    c.fillStyle = '#B58A5A'; c.fillRect(0,330,TW,AB_CHAO - 330); c.fillStyle = '#9B7140'; c.fillRect(0,324,TW,10);
    abChao(c,'#8A6A44');
    // a fotografia da dona Rosa na moldura, com o busto dela
    rr(c,360,92,220,250,10); fs(c,'#7A4A22',4); rr(c,376,108,188,218,6); fs(c,'#F3E8D2',2.6);
    c.save(); c.beginPath(); c.rect(378,110,184,214); c.clip();
    c.fillStyle = '#BFE3F7'; c.fillRect(378,110,184,214); c.fillStyle = '#F7EFD8'; ell(c,470,300,120,60); c.fill();
    abRosa(c,470,420,4.2,{ t:0 });
    c.restore();
    rr(c,376,108,188,218,6); c.strokeStyle = '#4A2A12'; c.lineWidth = 3; c.stroke();
    rr(c,396,348,148,30,6); fs(c,PAL.creme,2.6); txt(c,'Cantinho da Rosa',470,364,17,AB_COR.aurora,'center',FD);
    // a prateleira, com a rosa no copo e a vela
    rr(c,300,392,380,14,3); fs(c,PAL.madeira,2.6);
    rr(c,360,350,34,42,8); fs(c,'rgba(255,255,255,.6)',2.4); c.strokeStyle = PAL.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(377,372); c.lineTo(377,330); c.stroke(); abFlor(c,377,324,8);
    rr(c,560,360,24,32,4); fs(c,'#F7EFD8',2.4); c.fillStyle = AB_COR.ouro; ell(c,572,352 + (RM ? 0 : Math.sin(T * 7)),4,7); c.fill();
    // a estrelinha: na mão da Bia, depois na parede (e um brilho quando prende)
    const g = abSuave(abSeg(p,0.05,0.3)), preso = abSuave(abSeg(p,0.46,0.56)), solta = abSuave(abSeg(p,0.58,0.74)), sb = abEsc('bia'), bx = 770;
    const alvo = [bx - 20 * sb,AB_CHAO - 60 * sb];
    const mao = abLerp(abLerp([15,-18],[20,-60],g),[15,-18],solta);
    abBia(c,bx,AB_CHAO,{ t:T, flip:-1, olha:1, maos:[[-15,-18],mao] });
    const pos = preso < 1 ? [bx - mao[0] * sb,AB_CHAO + mao[1] * sb - 14] : alvo;
    star(c,pos[0],pos[1],preso < 1 ? 20 : 22 + (RM ? 0 : Math.sin(T * 4) * 1.5),AB_COR.ouro);
    if (preso > 0.9 && p < 0.7){ c.globalAlpha = 1 - abSeg(p,0.56,0.7); for (let i=0;i<4;i++){ const a = i * TAU / 4 + 0.4; star(c,pos[0] + Math.cos(a) * 36,pos[1] + Math.sin(a) * 36,5,'#FFF8D6'); } c.globalAlpha = 1; }
    // a pétala cai do copo da rosa, devagar
    const cai = abSeg(p,0.72,1);
    if (cai > 0){ const px = 392 + (RM ? 30 : Math.sin(cai * 7) * 22 + cai * 40), py = 326 + cai * 130; c.save(); c.translate(px,py); c.rotate(RM ? 0.5 : Math.sin(cai * 6) * 0.9); ell(c,0,0,12,7); fs(c,AB_COR.petala,2.2); c.restore(); }
    return { bia:[bx,AB_CHAO - AB_ALT.bia - 6,70] };
  },
  // a foto da equipe na parede: um clarão de flash no começo
  equipe(c,p,T){
    c.fillStyle = '#E3C79B'; c.fillRect(0,0,TW,AB_CHAO);
    c.fillStyle = 'rgba(122,46,58,.08)'; for (let x=0;x<TW;x+=50) c.fillRect(x,0,22,AB_CHAO);
    abChao(c,'#8A6A44');
    c.fillStyle = '#B58A5A'; c.fillRect(0,420,TW,AB_CHAO - 420);
    // a moldura grande e a foto
    rr(c,170,28,860,432,12); fs(c,'#7A4A22',5); rr(c,194,50,812,388,6); fs(c,'#4A2A12',3);
    c.save(); c.beginPath(); c.rect(198,54,804,380); c.clip();
    const cf = c.createLinearGradient(0,54,0,434); cf.addColorStop(0,'#FFE9C2'); cf.addColorStop(1,'#F3E8D2'); c.fillStyle = cf; c.fillRect(198,54,804,380);
    // o fundo da foto: as luminárias do Terraço e a faixa com o nome
    [320,600,880].forEach(x => { c.strokeStyle = PAL.tinta; c.lineWidth = 2; c.beginPath(); c.moveTo(x,54); c.lineTo(x,92); c.stroke(); circ(c,x,104,12); fs(c,'#FFE7A8',2); });
    rr(c,470,110,260,30,6); fs(c,AB_COR.aurora,2.4); txt(c,'Terraço Suíça',600,125,19,PAL.creme,'center',FD);
    const yT = 424, k = 0.95, yB = 376, kb = 0.82;
    // atrás: Cami, Lia e Anselmo
    abPessoaFoto(c,'cami',420,yB,kb); abPessoaFoto(c,'lia',575,yB,kb); abPessoaFoto(c,'anselmo',765,yB,kb);
    // na frente: Dani, Bia, Tonhão e Joca
    abPessoaFoto(c,'dani',320,yT,k); abPessoaFoto(c,'bia',495,yT,k); abPessoaFoto(c,'tonhao',650,yT,k); abPessoaFoto(c,'joca',880,yT,k);
    c.restore();
    rr(c,194,50,812,388,6); c.strokeStyle = '#4A2A12'; c.lineWidth = 3; c.stroke();
    // o clarão do flash no começo
    const f = RM ? 0 : 1 - abSeg(p,0.04,0.2);
    if (f > 0 && p > 0.03){ c.fillStyle = 'rgba(255,255,255,' + (f * 0.95) + ')'; c.fillRect(0,0,TW,500); }
    return { tonhao:[660,198,200] };
  },
  // a garagem da Rosa, agora escola de cozinha: a Dani ensina três crianças; a roseira ao lado do portão
  escola(c,p,T){
    abCeu(c,'#BFE3F7','#F7EFD8');
    rr(c,300,214,620,AB_CHAO - 214,4); fs(c,'#E2C9A0',3);
    c.beginPath(); c.moveTo(270,224); c.lineTo(610,140); c.lineTo(950,224); c.closePath(); fs(c,'#B5533A',3);
    const gx = 380, gy = 290, gw = 460, gh = AB_CHAO - 290;
    rr(c,gx,gy,gw,gh,4); fs(c,'#FFE7A8',3);
    c.fillStyle = PAL.piso1; c.fillRect(gx + 4,gy + gh - 40,gw - 8,36);
    // a bancada com as vasilhas, as crianças atrás (a do meio na ponta dos pés) e a Dani mexendo o molho
    const rel = abEsc('dani',0.8), sc = abEsc('biaCrianca',1.05);
    [[455,'#E0523C',1,'#2F1D12',3,0],[545,'#F2B33D',2,'#1B1512',6,1],[635,'#7B4FB5',3,'#2F1D12',5,0]].forEach((k,i) => {
      const pe = k[5] ? 22 + (RM ? 0 : Math.abs(Math.sin(T * 2.2)) * 3) : 0;
      abCrianca(c,k[0],AB_CHAO - 2 - pe,sc,{ pele:k[2] + 1,cabelo:k[4],cor:k[3],camisa:k[1],calca:'#5A4A3A',t:T,sd:i,semSombra:true,olha:i === 2 ? 1 : 0 });
    });
    const dx = 792, ma = [-34 + (RM ? 0 : Math.sin(T * 3) * 3),-40];
    abDani(c,dx,AB_CHAO - 2,{ s:rel,t:T,bracoE:[[-22,-34],ma] });
    abColher(c,[dx + (ma[0] - 8) * rel,AB_CHAO + (ma[1] - 22) * rel],[dx + (ma[0] - 14) * rel - 24,AB_CHAO + ma[1] * rel + 8],null,0,AB_COR.molho);
    rr(c,410,410,440,AB_CHAO - 410,5); fs(c,PAL.madeira,3); rr(c,402,402,456,14,4); fs(c,PAL.creme,3);
    [[500,'#E0523C'],[590,'#F2F2EE']].forEach(b => { ell(c,b[0],400,26,8); fs(c,b[1],2); rr(c,b[0] - 26,392,52,12,3); fs(c,b[1],2); });
    abPanela(c,704,402,60,T,true);
    // a placa nova sobre o portão
    rr(c,400,238,420,48,10); fs(c,PAL.tinta,3); txt(c,'Cozinha da Rosa',610,262,28,PAL.mostarda,'center',FD,0,390);
    abFlor(c,420,246,6); abFlor(c,800,246,6);
    abChao(c,'#BDB6A8');
    abRoseira(c,250,AB_CHAO,1.5,T); abRoseira(c,1000,AB_CHAO,1.2,T);
    return { dani:[dx,AB_CHAO - 2 - AB_ALT.dani * 0.8 - 4,200] };
  },
  // o parapeito do Terraço, de noite: a Bia e o Tonhão, de costas, olham as três estrelinhas; a do meio pisca
  ceu(c,p,T){
    abCeu(c,'#0B1230','#2A2F5E');
    c.fillStyle = 'rgba(255,255,255,.75)';
    [[60,80],[160,200],[260,60],[360,160],[470,40],[800,70],[900,180],[1000,50],[1100,140],[1160,230],[110,300],[1060,310]].forEach((s,i) => { circ(c,s[0],s[1],RM ? 1.6 : 1.2 + Math.abs(Math.sin(T * 2 + i)) * 1.1); c.fill(); });
    // as três juntinhas; a do meio pisca
    const pisca = RM ? 1 : 0.7 + Math.sin(T * 4) * 0.3, mx = 600, my = 120;
    const gl = c.createRadialGradient(mx,my,6,mx,my,110); gl.addColorStop(0,'rgba(255,226,140,' + (0.5 * pisca) + ')'); gl.addColorStop(1,'rgba(255,226,140,0)'); c.fillStyle = gl; c.fillRect(mx - 110,my - 110,220,220);
    star(c,mx - 56,my + 14,13,AB_COR.ouro); star(c,mx + 56,my + 14,13,AB_COR.ouro); star(c,mx,my,20 + pisca * 6,'#FFF4B8');
    // a cidade lá embaixo, com as luzinhas
    c.fillStyle = '#1B2342'; [[0,300,120],[110,330,90],[210,290,130],[330,340,100],[440,310,110],[800,320,100],[900,290,140],[1030,330,110]].forEach(b => c.fillRect(b[0],b[1],b[2],AB_CHAO - b[1]));
    c.fillStyle = 'rgba(255,226,140,.8)'; for (let i=0;i<46;i++){ const x = (i * 97) % 1160 + 20, y = 310 + (i * 53) % 90; if ((x > 560 && x < 790)) continue; c.fillRect(x,y,4,6); }
    // a Bia e o Tonhão, de costas; ele passa o braço pelos ombros dela e ela aponta
    const ap = abSuave(abSeg(p,0.25,0.45));
    abCostas(c,500,AB_CHAO + 8,1.75,{ roupa:'#2E8B57',calca:'#2E8B57',pele:'#6B3F25',cabelo:'puff',cor:'#15100D',laco:PAL.alerta });
    abCostas(c,630,AB_CHAO + 8,2,{ roupa:'#fff',calca:'#3A3F4A',pele:'#B9794B',cabelo:'toca',cor:'#8C8C8C' });
    abBraco(c,[[500 + 17 * 1.75,AB_CHAO + 8 - 80 * 1.75],abLerp([552,330],[572,290],ap),abLerp([548,350],[584,236],ap)],'#2E8B57','#6B3F25');
    abBraco(c,[[630 - 19 * 2,AB_CHAO + 8 - 80 * 2],[576,326],[526,320]],'#fff','#B9794B');
    // o parapeito de pedra, na frente deles
    rr(c,0,392,TW,16,4); fs(c,'#CFC6B8',2.8); rr(c,0,408,TW,AB_CHAO - 408,0); fs(c,'#B8AFA2',2.8);
    for (let x=40;x<TW;x+=80){ rr(c,x - 12,410,24,AB_CHAO - 410,6); fs(c,'#DDD5C8',2.2); }
    abChao(c,'#4A433E');
    return { bia:[500,AB_CHAO + 8 - 1.75 * 125,-130], tonhao:[630,AB_CHAO + 8 - 2 * 139,130] };
  },
  // a mesma cozinha da casa: agora é a Bia adulta que cozinha, e uma criança do bairro olha da porta
  roda(c,p,T){
    abCozinhaCasa(c,T,false);
    abPanela(c,690,AB_FOGAO,110,T,true);
    abCoracoes(c,690,AB_FOGAO - 70,T,3);
    // a porta da cozinha, aberta para o corredor, no lugar do banquinho
    rr(c,0,150,170,AB_CHAO - 150,6); fs(c,'#FFF3D0',3);
    rr(c,150,150,20,AB_CHAO - 150,3); fs(c,'#7A5232',2.6);
    abCrianca(c,96,AB_CHAO,abEsc('biaCrianca',0.92),{ pele:2,cabelo:6,cor:'#1B1512',camisa:'#3C7BD9',calca:'#3C5A4A',t:T,sd:1.4,olha:1 });
    // a Bia adulta mexe o molho, a mão acima da borda; a ponta da colher no molho, em roda
    const sb = abEsc('bia'), bx = 628, a = RM ? 0.6 : T * 3.2;
    const ponta = [700 + Math.cos(a) * 15,AB_FOGAO - 50 + Math.sin(a) * 3], mao = [ponta[0] - 28,AB_FOGAO - 64 + Math.sin(a) * 2];
    abBia(c,bx,AB_CHAO,{ t:T,maos:[[-15,-18],[(mao[0] - bx) / sb,(mao[1] - AB_CHAO) / sb]] });
    abColher(c,[mao[0] - 22,mao[1] - 12],ponta,mao.concat('#6B3F25'),3.8 * sb);
    // depois da fala, a cena escurece nas bordas e o título entra
    const es = abSuave(abSeg(p,0.58,0.8)), ti = abSeg(p,0.78,0.92);
    if (es > 0){ const v = c.createRadialGradient(TW / 2,250,200,TW / 2,250,780); v.addColorStop(0,'rgba(16,14,12,' + (es * 0.15) + ')'); v.addColorStop(1,'rgba(16,14,12,' + (es * 0.92) + ')'); c.fillStyle = v; c.fillRect(0,0,TW,500); }
    if (ti > 0){ c.globalAlpha = ti; txt(c,'Fim',990,230,96,PAL.mostarda,'center',FD,10); c.globalAlpha = 1; }
    return { bia:[bx,AB_CHAO - AB_ALT.bia - 6,-180] };
  },
  // os créditos: um quadro só, sem legenda
  creditos(c,p,T){
    c.fillStyle = AB_COR.noite; c.fillRect(0,0,TW,H);
    c.fillStyle = 'rgba(255,255,255,.7)';
    [[80,60],[210,170],[330,40],[460,110],[720,70],[860,140],[1010,60],[1150,150],[140,420],[1100,440],[600,520],[300,500],[950,500]].forEach((s,i) => { circ(c,s[0],s[1],RM ? 1.8 : 1.4 + Math.abs(Math.sin(T * 2 + i)) * 1.2); c.fill(); });
    star(c,TW/2,150,46 + (RM ? 0 : Math.sin(T * 3) * 3),AB_COR.ouro);
    txt(c,'Lanchonete Corre-Corre',TW/2,290,64,PAL.mostarda,'center',FD,8,TW - 120);
    txt(c,'O sonho da Bia',TW/2,360,34,PAL.creme,'center',FD,4);
    txt(c,'Obrigado por jogar!',TW/2,470,28,PAL.creme,'center',FB);
    return {};
  }
});
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
  const lin = treinoLinhas(c,ab.leg,1040,U.leg), y0 = 548 - (lin.length - 1) * U.legLinha / 2 - 6;
  lin.forEach((l,i) => txt(c,l,TW/2,y0 + i * U.legLinha,U.leg,PAL.creme,'center',FB));
  // as bolinhas das cenas e a dica do toque
  const n = ab.n, x0 = TW/2 - (n - 1) * 9;
  for (let i=0;i<n;i++){ circ(c,x0 + i * 18,586,i === ab.i ? 5 : 3.5); c.fillStyle = i <= ab.i ? PAL.mostarda : '#6b6457'; c.fill(); }
  txt(c,'toque para seguir',TW - 20,586,13,'#b8ae98','right',FB);
}
function drawAbertura(c,ab){
  if (ab.roteiro.cheio) return drawAbertura2(c,ab);   // v11.12: a abertura, de quadro cheio (27-abertura-nova.js); daqui para baixo, só o final
  const T = RM || ab.rm ? 0 : ab.tm;
  // a boca de quem fala abre e fecha nos primeiros segundos do balão (nada disso com movimento reduzido)
  AB_VIVO.fala = {}; AB_VIVO.est = ab.est;
  if (T > 0) ab.falas().forEach(f => { const d = ab.t - f.de; if (d >= 0 && d < 1.8) AB_VIVO.fala[f.q] = Math.abs(Math.sin(d * 11)); });
  c.save();
  c.fillStyle = PAL.tinta; c.fillRect(0,0,TW,H);
  const desenha = AB_CENAS[ab.cena.id];
  const cab = (desenha && desenha(c,ab.p,T)) || {};
  ab.falas().forEach(f => { const a = cab[f.q]; if (a) abBalao(c,f.s,a[0],a[1],a[2]); });
  if (ab.cena.cheia) txt(c,'toque para seguir',TW - 20,586,13,'#b8ae98','right',FB); else abLegenda(c,ab);   // v11: os créditos ocupam o quadro todo
  const e = ab.escuro;
  if (e > 0){ c.fillStyle = 'rgba(16,14,12,' + e + ')'; c.fillRect(0,0,TW,H); }
  c.restore();
}
