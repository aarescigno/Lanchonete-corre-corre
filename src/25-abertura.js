/* ============================================================
   ABERTURA E FINAL: as pessoas e os objetos (v8.5; v11.18)
   As figuras que as cenas da abertura (27-abertura-nova.js) e do final (28-final.js) desenham: a Rosa, a Bia criança e adulta, o Tonhão, o Bráulio, a Dani, a criança do bairro,
   a pessoa de costas, a equipe da foto, o telefone, a placa do Michelzão, a roseira e o balão de fala. Também as tabelas de altura (AB_ALT, AB_BASE), as cores (AB_COR) e o ritmo
   de piscar e falar (AB_VIVO). v8.6.1 (revisão estética): alturas pela tabela AB_ALT, gestos com objetos, piscar e falar. v11.18: as cenas antigas do final saíram daqui.
   ============================================================ */
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

/* ---------- figuras e objetos do final (v11): a Dani, a criança do bairro, a pessoa de costas, a equipe da foto, o telefone, a placa ---------- */
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
    { s, shirt:o.camisa || '#3C7BD9', t:o.t || 0, pisca:!!o.fecha || abPisca(o.t || 0,o.sd || 0.6), bracoD:o.bracoD, bracoE:o.bracoE, olha:o.olha, handUp:!!o.aceno, noShadow:!!o.semSombra });   // v11.18: fecha (os olhos fechados)
}
// uma pessoa de costas (a Bia e o Tonhão olhando o céu): o: roupa, calca, pele, cabelo ('puff' | 'coque' | 'toca'), cor, laco, rosa (a cor da rosa no ombro, v11.18)
function abCostas(c,x,y,s,o){
  c.save(); c.translate(x,y); c.scale(s,s);
  shadowEll(c,0,0,24,6,0.22);
  rr(c,-14,-34,11,33,3); fs(c,o.calca,2.4); rr(c,3,-34,11,33,3); fs(c,o.calca,2.4);
  ell(c,-9,-1,8,4); fs(c,'#2c2a26',2); ell(c,9,-1,8,4); fs(c,'#2c2a26',2);
  c.beginPath(); c.moveTo(-23,-30); c.lineTo(-19,-82); c.lineTo(19,-82); c.lineTo(23,-30); c.closePath(); fs(c,o.roupa,2.6);
  c.strokeStyle = 'rgba(34,32,28,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0,-80); c.lineTo(0,-32); c.stroke();   // a costura das costas
  if (o.laco){ c.beginPath(); c.moveTo(-20,-44); c.lineTo(20,-44); c.lineTo(19,-38); c.lineTo(-19,-38); c.closePath(); fs(c,o.laco,2); circ(c,0,-41,5); fs(c,o.laco,2); }
  if (o.rosa){   // v11.18: a rosa da lapela, vista no ombro, com uma folhinha
    ell(c,-17,-71,6,2.8); fs(c,'#3E8F4A',1.4);
    circ(c,-17,-76,6); fs(c,o.rosa,1.8); circ(c,-17,-76,3.2); c.strokeStyle = 'rgba(34,32,28,.5)'; c.lineWidth = 1.2; c.stroke();
  }
  rr(c,-6,-92,12,12,3); fs(c,o.pele,2);                                          // o pescoço
  const hy = -100;
  circ(c,-15,hy+2,3.6); fs(c,o.pele,1.8); circ(c,15,hy+2,3.6); fs(c,o.pele,1.8);   // as orelhas
  circ(c,0,hy,15.5); fs(c,o.pele,2.6);
  if (o.cabelo === 'puff'){ circ(c,0,hy,15.8); fs(c,o.cor,2.4); circ(c,0,hy - 11,15); fs(c,o.cor,2.4); circ(c,0,hy - 4,12); c.fillStyle = o.cor; c.fill(); }
  else if (o.cabelo === 'coque'){   // v11.18: a Bia de roupa 4: a nuca com cabelo e o coque crespo no alto, com a faixa creme na base
    circ(c,0,hy,15.8); fs(c,o.cor,2.4);
    puffCrespo(c,0,hy - 26,12.5,7,o.cor);
    rr(c,-8,hy - 22,16,3.4,1.7); fs(c,PAL.creme,1.2);
  }
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
// mistura duas cores #rrggbb (k de 0 a 1)
function abMistura(a,b,k){
  const h = s => [1,3,5].map(i => parseInt(s.substr(i,2),16)), x = h(a), y = h(b);
  return 'rgb(' + x.map((v,i) => Math.round(v + (y[i] - v) * k)).join(',') + ')';
}

/* ---------- o balão ---------- */
const AB_UI = { fala:20, linha:25, falaW:330 };
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
