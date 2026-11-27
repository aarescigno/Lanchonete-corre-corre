/* ============================================================
   DESENHO — helpers
   ============================================================ */
const TAU = Math.PI * 2;
function rr(ctx,x,y,w,h,r){
  r = Math.min(r, w/2, h/2);
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);     ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function ell(ctx,x,y,rx,ry){ ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,TAU); }
function circ(ctx,x,y,r){ ctx.beginPath(); ctx.arc(x,y,r,0,TAU); }
/* v12.12: com `prefers-reduced-motion` a dancinha escondida é só um coraçãozinho parado sobre a cabeça (uns 7 px); (x, y) é o centro do coração */
/* v12.12: a escala horizontal do giro da dancinha (cos 2πp), com um fio de largura (nunca some de vez) */
function eggGiro(p){ const c = Math.cos(TAU * p); return Math.abs(c) < 0.1 ? (c < 0 ? -0.1 : 0.1) : c; }
function drawEggCoracao(ctx,x,y){
  ctx.beginPath(); ctx.moveTo(x,y + 4); ctx.bezierCurveTo(x - 8,y - 1,x - 4,y - 7,x,y - 3); ctx.bezierCurveTo(x + 4,y - 7,x + 8,y - 1,x,y + 4); ctx.closePath(); fs(ctx,PAL.perigo,1.6);
}
function fs(ctx,fill,lw){
  if (fill){ ctx.fillStyle = fill; ctx.fill(); }
  ctx.lineWidth = lw || 2.5; ctx.strokeStyle = PAL.tinta; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.stroke();
}
function txt(ctx,s,x,y,size,color,align,font,stroke,maxW){
  ctx.font = size + 'px ' + (font || FD);
  ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
  if (maxW){
    if (stroke){ ctx.lineWidth = stroke; ctx.strokeStyle = PAL.tinta; ctx.lineJoin = 'round'; ctx.strokeText(s,x,y,maxW); }
    ctx.fillStyle = color; ctx.fillText(s,x,y,maxW); return;
  }
  if (stroke){ ctx.lineWidth = stroke; ctx.strokeStyle = PAL.tinta; ctx.lineJoin = 'round'; ctx.strokeText(s,x,y); }
  ctx.fillStyle = color; ctx.fillText(s,x,y);
}
function cmdColor(grp){ return (grp && grp.cmd >= 0) ? CMD[grp.cmd].c : null; }
function drawTray(ctx,x,y,s,col){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  rr(ctx,-19,-10,38,22,6); fs(ctx,col,2.2);
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.2; rr(ctx,-16,-7,32,16,4); ctx.stroke();
  ctx.restore();
}
/* aro de humor sob o grupo: verde (5-4 corações), amarelo (3-2), vermelho piscando (1) */
function drawMoodRing(ctx,hearts,x,y,rx,ry,tm){
  const col = hearts >= 4 ? MOOD.ok : (hearts >= 2 ? MOOD.warn : MOOD.bad);
  let a = 1;
  if (hearts <= 1 && !RM) a = 0.45 + 0.55 * (0.5 + 0.5*Math.sin(tm*10));
  ctx.save();
  ctx.globalAlpha = 0.28 * a; ctx.fillStyle = col; ell(ctx,x,y,rx,ry); ctx.fill();
  ctx.globalAlpha = a; ctx.lineWidth = 3.5; ctx.strokeStyle = col; ell(ctx,x,y,rx,ry); ctx.stroke();
  ctx.restore();
}
/* selo VIP: plaquinha dourada com estrela e "VIP" (o texto, não só a cor, identifica o VIP) */
function drawVipBadge(ctx,x,y,tm,dupla){
  const p = RM ? 1 : 1 + 0.06*Math.sin(tm*5);
  ctx.save(); ctx.translate(x,y); ctx.scale(p,p);
  if (dupla === 'michel'){   // v10.10: o crítico da noite da estrela: a plaquinha de exigente com uma estrela vermelha
    rr(ctx,-26,-9,52,18,6); fs(ctx,PAL.mostarda,2.2);
    star(ctx,-14,0,6.4,'#D2262E');
    txt(ctx,'VIP',9,1,12,PAL.tinta,'center',FD);
  } else if (dupla){   // v10.1: o VIP exigente, com duas estrelas
    rr(ctx,-26,-9,52,18,6); fs(ctx,PAL.mostarda,2.2);
    star(ctx,-17,0,5.2,'#fff'); star(ctx,-6.5,0,5.2,'#fff');
    txt(ctx,'VIP',12,1,12,PAL.tinta,'center',FD);
  } else {
    rr(ctx,-19,-9,38,18,6); fs(ctx,PAL.mostarda,2.2);
    star(ctx,-10,0,5.5,'#fff');
    txt(ctx,'VIP',5,1,12,PAL.tinta,'center',FD);
  }
  ctx.restore();
}
/* v10.9, a pista do crítico: um caderninho com a caneta na frente do peito (a caneta escreve; parado com prefers-reduced-motion). A ficha do fim do dia usa o garfinho (cheio: ganho; apagado: perdido) */
function drawCaderno(ctx,x,y,tm,parado,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1);
  rr(ctx,-6.5,-8.5,13,17,1.8); fs(ctx,'#FFF8E3',1.8);
  ctx.fillStyle = PAL.faixa; ctx.fillRect(-6.5,-8.5,3.2,17);
  ctx.strokeStyle = 'rgba(34,32,28,.45)'; ctx.lineWidth = 0.9; ctx.beginPath(); [-4,-0.5,3].forEach(yy => { ctx.moveTo(-1.5,yy); ctx.lineTo(4.5,yy); }); ctx.stroke();
  const w = parado ? 0 : Math.sin(tm * 16) * 1.4;
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(3 + w,3); ctx.lineTo(9 + w,-5.5); ctx.stroke();
  ctx.strokeStyle = PAL.mostarda; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(3 + w,3); ctx.lineTo(9 + w,-5.5); ctx.stroke();
  ctx.restore();
}
function drawGarfo(ctx,x,y,cheio,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s || 1,s || 1); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = cheio ? PAL.tinta : 'rgba(34,32,28,.35)'; ctx.fillStyle = cheio ? PAL.mostarda : 'rgba(34,32,28,.12)'; ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.moveTo(-5,-10); ctx.lineTo(-5,-3); ctx.quadraticCurveTo(-5,1,0,1); ctx.quadraticCurveTo(5,1,5,-3); ctx.lineTo(5,-10); ctx.moveTo(0,-10); ctx.lineTo(0,1); ctx.moveTo(0,1); ctx.lineTo(0,10); ctx.stroke();
  if (cheio){ ctx.lineWidth = 1.8; ctx.strokeStyle = PAL.mostarda; ctx.beginPath(); ctx.moveTo(-5,-10); ctx.lineTo(-5,-3); ctx.quadraticCurveTo(-5,1,0,1); ctx.quadraticCurveTo(5,1,5,-3); ctx.lineTo(5,-10); ctx.moveTo(0,-10); ctx.lineTo(0,10); ctx.stroke(); }
  ctx.restore();
}
/* v10.1: os acessórios do VIP exigente (sorteados em Group): chapéu de aba, lenço de seda no pescoço ou echarpe; `p.accC` é a cor */
function acExigente(ctx,p,hy,costas){
  const c = p.accC || '#B23A48';
  if (p.chapeu){
    ctx.beginPath(); ctx.arc(0,hy-3,9.8,Math.PI,0); ctx.closePath(); fs(ctx,c,2.2);
    rr(ctx,-16,hy-4.6,32,3.8,1.9); fs(ctx,c,1.8);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-9.4,hy-7.6,18.8,1.8);
  }
  if (costas) return;
  if (p.lenco){
    ctx.beginPath(); ctx.moveTo(-5,hy+11); ctx.lineTo(5,hy+11); ctx.lineTo(0,hy+16.5); ctx.closePath(); fs(ctx,c,1.8);
    circ(ctx,0,hy+11.2,2.2); fs(ctx,c,1.4);
  }
  if (p.echarpe){
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 5.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0,hy+2,11.4,Math.PI*0.16,Math.PI*0.84); ctx.stroke();
    ctx.strokeStyle = c; ctx.lineWidth = 3.6; ctx.beginPath(); ctx.arc(0,hy+2,11.4,Math.PI*0.16,Math.PI*0.84); ctx.stroke();
    ctx.lineWidth = 3.6; ctx.beginPath(); ctx.moveTo(6,hy+11.5); ctx.lineTo(8.5,hy+21); ctx.stroke();
    ctx.lineCap = 'butt';
  }
}
function shadowEll(ctx,x,y,rx,ry,a){
  ctx.fillStyle = 'rgba(34,32,28,' + (a||0.2) + ')'; ell(ctx,x,y,rx,ry); ctx.fill();
}
function heart(ctx,x,y,r,fill,stroke){
  ctx.beginPath();
  ctx.moveTo(x, y + r*0.95);
  ctx.bezierCurveTo(x + r*1.6, y - r*0.1, x + r*0.8, y - r*1.25, x, y - r*0.4);
  ctx.bezierCurveTo(x - r*0.8, y - r*1.25, x - r*1.6, y - r*0.1, x, y + r*0.95);
  ctx.closePath();
  if (fill){ ctx.fillStyle = fill; ctx.fill(); }
  ctx.lineWidth = 1.8; ctx.strokeStyle = stroke || PAL.tinta; ctx.lineJoin = 'round'; ctx.stroke();
}
function star(ctx,x,y,r,fill){
  ctx.beginPath();
  for (let i=0;i<10;i++){ const a = -Math.PI/2 + i*Math.PI/5, rad = i%2 ? r*0.45 : r; ctx.lineTo(x+Math.cos(a)*rad, y+Math.sin(a)*rad); }
  ctx.closePath(); fs(ctx, fill, 2);
}
function mmssUp(s){ s = Math.max(0, Math.floor(s)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
function mmss(s){ s = Math.max(0, Math.ceil(s)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }

/* ---------- pratos ---------- */
/* v10.8, a pétala do molho da Rosa (x, y: o centro; s: a escala; rot: a inclinação; apagada: a que falta no HUD) */
function drawPetala(ctx,x,y,s,rot,apagada){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot == null ? -0.5 : rot); ctx.scale(s,s);
  ctx.beginPath(); ctx.moveTo(0,-6.5); ctx.bezierCurveTo(6.5,-5,6.5,4,0,7); ctx.bezierCurveTo(-6.5,4,-6.5,-5,0,-6.5); ctx.closePath();
  fs(ctx,apagada ? '#5b554a' : AB_COR.petala,1.3);
  if (!apagada){ ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(0,-3.5); ctx.lineTo(0,4); ctx.stroke(); }
  ctx.restore();
}
function drawDish(ctx,k,x,y,s,empty,carne,av,rosa){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ell(ctx,0,0,15,10.5); fs(ctx,'#fff',2.4);
  ell(ctx,0,0,9.5,6); ctx.lineWidth = 1.2; ctx.strokeStyle = '#d4d0c4'; ctx.stroke();
  if (empty){
    ctx.fillStyle = '#b9772f'; circ(ctx,-3,1,1.6); ctx.fill(); circ(ctx,4,-1,1.2); ctx.fill();
    ctx.restore(); return;
  }
  drawComida(ctx,k,carne,av);
  if (rosa) drawPetala(ctx,5,-4,1.4);   // v10.8: o Prato da Rosa
  ctx.restore();
}
/* marmita (v8.6): a quentinha de alumínio com a tampa de papelão e o desenho da comida em cima; (x, y) é o meio da tampa */
function drawMarmita(ctx,k,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.beginPath(); ctx.moveTo(-16,0); ctx.lineTo(16,0); ctx.lineTo(13,10); ctx.lineTo(-13,10); ctx.closePath(); fs(ctx,'#C9D0D7',2.2);   // a forma de alumínio
  ctx.strokeStyle = 'rgba(34,32,28,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-14,5); ctx.lineTo(14,5); ctx.stroke();
  rr(ctx,-18,-13,36,14,4); fs(ctx,'#F4EEDD',2.2);   // a tampa
  ctx.save(); ctx.translate(0,-6); ctx.scale(0.95,0.62); drawComida(ctx,k); ctx.restore();
  ctx.restore();
}
/* a comida do prato (sem o prato), centrada em (0, 0). v8.6.10: um desenho para cada prato; `av` (o detalhe do curso avançado) vem do
   curso do jogo (COMIDA_CURSOS, posto pelo render) quando não é dado; `carne` é a proteína do PF com as Carnes variadas */
let COMIDA_CURSOS = null, COMIDA_PONTO = null;   // v12.10: o ponto também (o prato de base vale com o avançado do ponto atual)
function drawCarne(ctx,carne){
  if (carne === 'frango'){
    rr(ctx,-3,1.5,12,5,2.5); fs(ctx,'#E9C98F',1.6);
    ctx.strokeStyle = '#8A5426'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let x=-0.5;x<=6;x+=3){ ctx.moveTo(x,2.3); ctx.lineTo(x+2,5.7); } ctx.stroke();
  } else if (carne === 'peixe'){
    ctx.beginPath(); ctx.moveTo(-4,4); ctx.quadraticCurveTo(2,-0.5,9,2.5); ctx.quadraticCurveTo(10.5,5.5,8,7); ctx.quadraticCurveTo(2,8.5,-4,4); ctx.closePath(); fs(ctx,'#D9902F',1.6);
    ctx.fillStyle = '#F2C06A'; for (const d of [[0,4],[3,4.2],[6,4.8],[2,6.2]]){ circ(ctx,d[0],d[1],0.7); ctx.fill(); }
  } else {
    rr(ctx,-3,1.5,12,5,2.5); fs(ctx,'#A0522D',1.6);
    if (carne === 'cavalo'){ ell(ctx,3,3,4.6,2.8); fs(ctx,'#fff',1.3); circ(ctx,3,3,1.5); ctx.fillStyle = '#F5B800'; ctx.fill(); }
  }
}
const DESENHO_BASE = { empadaPalmito:'empada', kibeAbobora:'kibe', esfihaSoja:'esfihaA', pastelPalmito:'pastel', coxinhaJaca:'coxinha', mistoVegano:'misto' };   // os veganos e vegetarianos reusam o desenho do prato com carne (v12.10.1: os pratos de estrada têm o próprio, drawEstrada)
/* v10.2: os 6 pratos finos do Terraço (cursos Entradas finas e Alta gastronomia), no estilo das artes da v8.6.10; av = o detalhe do curso avançado */
function drawFino(ctx,k,av){
  if (k === 'bruschetta'){   // duas fatias de pão tostado com tomate, manjericão (e, no avançado, gotas de balsâmico)
    [[-4.6,-0.6,-0.14],[4.6,1.2,0.12]].forEach(f => {
      ctx.save(); ctx.translate(f[0],f[1]); ctx.rotate(f[2]);
      rr(ctx,-6,-4.8,12,9.6,2.4); fs(ctx,'#D9A25B',1.5);
      rr(ctx,-4.6,-3.6,9.2,5.6,1.8); fs(ctx,'#E24B3B',0.9);
      ctx.fillStyle = '#F4876F'; circ(ctx,-2,-1.4,1); ctx.fill(); circ(ctx,2,0,1); ctx.fill();
      ctx.fillStyle = '#3E9B5A'; ell(ctx,0,-2,1.9,1); ctx.fill();
      ctx.restore();
    });
    if (av){ ctx.fillStyle = '#3B1F2B'; [[-3.4,6],[0,6.6],[3.4,6]].forEach(d => { circ(ctx,d[0],d[1],0.8); ctx.fill(); }); }
  } else if (k === 'bacalhau'){   // três bolinhos dourados e um gomo de limão
    [[-6,0.5,4.3],[1,-1.5,4.7],[7,2,4]].forEach(b => { circ(ctx,b[0],b[1],b[2]); fs(ctx,'#E2A64A',1.7); ctx.fillStyle = 'rgba(120,70,20,.5)'; circ(ctx,b[0]-1,b[1]-1,0.7); ctx.fill(); circ(ctx,b[0]+1.4,b[1]+1,0.6); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(-3,6); ctx.quadraticCurveTo(2,10,7,6); ctx.closePath(); fs(ctx,'#F2DD4E',1.3);
    if (av){ ctx.fillStyle = '#3E9B5A'; ell(ctx,1,-6.5,2.2,1.1); ctx.fill(); }
  } else if (k === 'quiche'){   // uma fatia de quiche: massa folhada, recheio claro e alho-poró
    ctx.beginPath(); ctx.moveTo(-9,5); ctx.lineTo(-9,-1); ctx.quadraticCurveTo(0,-9,9,-1); ctx.lineTo(9,5); ctx.closePath(); fs(ctx,'#E3B25A',1.8);
    ctx.beginPath(); ctx.moveTo(-7,3.4); ctx.lineTo(-7,-0.4); ctx.quadraticCurveTo(0,-6.6,7,-0.4); ctx.lineTo(7,3.4); ctx.closePath(); ctx.fillStyle = '#F6E7A8'; ctx.fill();
    ctx.fillStyle = '#7FB045'; [[-4,0],[0,-2.6],[3.6,0.4],[-1,1.8]].forEach(d => { ell(ctx,d[0],d[1],1.9,0.9); ctx.fill(); });
    ctx.strokeStyle = 'rgba(120,70,20,.55)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-8.5,5.4); ctx.lineTo(8.5,5.4); ctx.stroke();
    if (av){ ctx.fillStyle = '#C23B22'; circ(ctx,6,-4.4,0.9); ctx.fill(); circ(ctx,-6,-3.6,0.8); ctx.fill(); }
  } else if (k === 'risoto'){   // risoto cremoso com cogumelos fatiados e salsinha
    ell(ctx,0,0.5,11,7.4); fs(ctx,'#F2E3B5',1.8);
    ctx.fillStyle = 'rgba(200,170,100,.7)'; [[-5,0],[-1,2.4],[3,-1.2],[6,2],[-3,-3],[2,3.6]].forEach(d => { circ(ctx,d[0],d[1],0.7); ctx.fill(); });
    [[-4,-1.4,-0.4],[1.4,0.6,0.3],[5,-1.8,0.1]].forEach(m => { ctx.save(); ctx.translate(m[0],m[1]); ctx.rotate(m[2]); ell(ctx,0,0,3.3,2.2); fs(ctx,'#8A6240',1.2); rr(ctx,-0.9,0.8,1.8,2.6,0.8); fs(ctx,'#D9C7A0',0.8); ctx.restore(); });
    ctx.fillStyle = '#3E9B5A'; [[-1.6,-3.8],[3,3],[-6,2.4]].forEach(d => { circ(ctx,d[0],d[1],0.8); ctx.fill(); });
    if (av){ ctx.strokeStyle = '#FFF8E2'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-3,-5.4); ctx.lineTo(0,-6.4); ctx.moveTo(1,-5.6); ctx.lineTo(4,-5); ctx.stroke(); }
  } else if (k === 'peixe'){   // filé grelhado na manteiga de ervas, batata e limão
    ctx.beginPath(); ctx.moveTo(-10,2); ctx.quadraticCurveTo(-2,-6,8,-2); ctx.quadraticCurveTo(11,1,8,4); ctx.quadraticCurveTo(-1,8,-10,2); ctx.closePath(); fs(ctx,'#E7B867',1.8);
    ctx.strokeStyle = 'rgba(120,70,20,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5,-0.4); ctx.lineTo(-3,3.4); ctx.moveTo(0,-2); ctx.lineTo(2,3.4); ctx.moveTo(5,-1.4); ctx.lineTo(6,2.4); ctx.stroke();
    ctx.fillStyle = '#F3E39B'; ell(ctx,-1,0.6,4.4,1.6); ctx.fill();
    ctx.fillStyle = '#3E9B5A'; [[-2,0.6],[2,-0.6],[0,1.8]].forEach(d => { circ(ctx,d[0],d[1],0.7); ctx.fill(); });
    circ(ctx,-8,-4.6,3); fs(ctx,'#F2DD4E',1.2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-8,-7); ctx.lineTo(-8,-2.2); ctx.moveTo(-10.4,-4.6); ctx.lineTo(-5.6,-4.6); ctx.stroke();
    circ(ctx,6,6.2,2.2); fs(ctx,'#F2DDA2',1.2);
    if (av){ ctx.fillStyle = '#3E9B5A'; ell(ctx,9,-5,1.9,1); ctx.fill(); }
  } else if (k === 'liaRisoto'){   // v12.8.1, o risoto da Lia: cremoso, com grãozinhos de feijão-manteiguinha, lascas de queijo e uma folha
    ell(ctx,0,0.5,11,7.4); fs(ctx,'#F2E3B5',1.8);
    ctx.fillStyle = 'rgba(200,170,100,.6)'; [[-6,0.4],[-1,3.4],[4,-1],[6.4,2.6],[-3.4,-3]].forEach(d => { circ(ctx,d[0],d[1],0.6); ctx.fill(); });
    [[-5.6,-1.2,0.3],[-2.4,1.6,-0.4],[1.6,-2.6,0.5],[3.4,1.4,0.1],[6.6,-0.8,-0.3],[-0.4,4.2,0.6],[-6.6,2.6,0.2],[2,5,-0.2]].forEach(f => { ctx.save(); ctx.translate(f[0],f[1]); ctx.rotate(f[2]); ell(ctx,0,0,2,1.3); fs(ctx,'#E8D27A',0.7); ctx.restore(); });
    ctx.fillStyle = '#FFF4CC'; ctx.strokeStyle = '#D9C27A'; ctx.lineWidth = 0.6; [[-2,-4.6],[4.6,-3.4],[-5.2,4]].forEach(d => { ctx.beginPath(); ctx.moveTo(d[0] - 1.8,d[1] + 0.8); ctx.lineTo(d[0] + 0.4,d[1] - 1.2); ctx.lineTo(d[0] + 1.8,d[1] + 0.8); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = '#3E9B5A'; ell(ctx,7.6,4.4,2,1); ctx.fill();
  } else {   // medalhão: o corte redondo no molho madeira, batatas e vagem
    ell(ctx,0,1,11,7.2); fs(ctx,'#5A2D17',1.5);
    circ(ctx,-1,0,6.2); fs(ctx,'#8A4B2A',1.8);
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ell(ctx,-3,-2,2.4,1.2); ctx.fill();
    ctx.strokeStyle = '#F4D9A0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-1,0,6.8,0.3,2.6); ctx.stroke();
    circ(ctx,8,-3,2.5); fs(ctx,'#F2DDA2',1.2); circ(ctx,9,3,2.3); fs(ctx,'#F2DDA2',1.2);
    ctx.strokeStyle = '#3E9B5A'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-9,5); ctx.lineTo(-3,7.2); ctx.moveTo(-9,2.6); ctx.lineTo(-4,5); ctx.stroke();
    if (av){ ctx.fillStyle = '#D9B24A'; circ(ctx,-1,-0.4,1); ctx.fill(); }
  }
}
/* v10.6, os pratos da barraca junina (sem carne, sem o "v"): a pamonha no embrulho de palha, a espiga de milho cozido e a canjica com canela */
function drawJunino(ctx,k){
  if (k === 'pamonha'){
    ctx.beginPath(); ctx.moveTo(-14,0); ctx.lineTo(-10,-6); ctx.quadraticCurveTo(0,-9,10,-6); ctx.lineTo(14,0); ctx.lineTo(10,6); ctx.quadraticCurveTo(0,9,-10,6); ctx.closePath(); fs(ctx,'#B9CE7A',2);
    ctx.strokeStyle = 'rgba(70,100,30,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-9,-4); ctx.lineTo(8,-4.6); ctx.moveTo(-10,0); ctx.lineTo(10,0); ctx.moveTo(-9,4); ctx.lineTo(8,4.6); ctx.stroke();
    ctx.strokeStyle = '#7A5A2E'; ctx.lineWidth = 1.6; [-7,7].forEach(x => { ctx.beginPath(); ctx.moveTo(x,-6.5); ctx.lineTo(x,6.5); ctx.stroke(); });   // o barbante
    ell(ctx,13,0,2.6,3.4); fs(ctx,'#F2D86B',1.2);   // a massa aparecendo na ponta
  } else if (k === 'milho'){
    ctx.save(); ctx.rotate(-0.45);
    ell(ctx,1,0,12.5,5.6); fs(ctx,'#F2C94C',2);
    ctx.fillStyle = 'rgba(190,130,10,.6)'; for (let i=-3;i<=3;i++) for (const y of [-2.6,0,2.6]) { circ(ctx,i*3.1 + 2 + (y ? 1 : 0),y,0.85); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-5,-4.4); ctx.quadraticCurveTo(-14,-7,-16,0); ctx.quadraticCurveTo(-14,7,-5,4.4); ctx.quadraticCurveTo(-8,0,-5,-4.4); ctx.closePath(); fs(ctx,'#6FAE3E',1.6);   // a palha
    ctx.restore();
  } else if (k === 'curau'){   // v12.8: a cumbuca de creme amarelo-vivo, liso, com canela em pó por cima
    ctx.beginPath(); ctx.moveTo(-11,-2); ctx.lineTo(11,-2); ctx.quadraticCurveTo(10,9,0,9); ctx.quadraticCurveTo(-10,9,-11,-2); ctx.closePath(); fs(ctx,'#FFFFFF',2);
    ell(ctx,0,-2,11,4); fs(ctx,'#F2C94C',1.6);
    ctx.fillStyle = 'rgba(255,248,200,.7)'; ell(ctx,-4,-3.2,3.6,1); ctx.fill();
    ctx.fillStyle = '#8A4B2A'; for (const d of [[-6,-2],[-2.5,-1.4],[1,-2.6],[4.5,-1.2],[7,-2.8],[-0.5,-0.2],[-4.5,-3.6],[3,-4]]){ circ(ctx,d[0],d[1],0.6); ctx.fill(); }
  } else if (k === 'milhoCoalho'){   // a espiga (menor, à esquerda) cruzada com um espetinho de queijo coalho grelhado
    ctx.save(); ctx.translate(-2.5,-1.5); ctx.scale(0.78,0.78); drawJunino(ctx,'milho'); ctx.restore();
    ctx.save(); ctx.translate(3,2); ctx.rotate(0.55);
    ctx.strokeStyle = '#B98A52'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-12,0); ctx.lineTo(12,0); ctx.stroke(); ctx.lineCap = 'butt';
    rr(ctx,-7,-3,14,6,1.8); fs(ctx,'#F4E6B8',1.6);
    ctx.strokeStyle = '#C98A3A'; ctx.lineWidth = 1.1; ctx.beginPath(); for (const x of [-4.5,-0.5,3.5]){ ctx.moveTo(x-1.4,-2.4); ctx.lineTo(x+1.4,2.4); } ctx.stroke();
    ctx.restore();
  } else if (k === 'bolo'){   // a fatia de bolo de fubá, com a goiabada no meio e por cima
    ctx.beginPath(); ctx.moveTo(-11,6); ctx.lineTo(11,6); ctx.lineTo(11,-0.5); ctx.lineTo(-11,-5.5); ctx.closePath(); fs(ctx,'#E8B85A',2);
    ctx.beginPath(); ctx.moveTo(-9.6,4.6); ctx.lineTo(9.6,4.6); ctx.lineTo(9.6,0.6); ctx.lineTo(-9.6,-3.6); ctx.closePath(); ctx.fillStyle = '#F4D88E'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-11,2); ctx.lineTo(11,2); ctx.lineTo(11,3.8); ctx.lineTo(-11,3.8); ctx.closePath(); fs(ctx,'#B5303A',1.2);   // a camada do meio
    ctx.beginPath(); ctx.moveTo(-11,-5.5); ctx.lineTo(11,-0.5); ctx.lineTo(11,-3.6); ctx.lineTo(-11,-8.6); ctx.closePath(); fs(ctx,'#B5303A',1.4);   // a cobertura
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ell(ctx,-4,-6,4,0.8); ctx.fill();
  } else if (k === 'cremeMilho'){   // o ramequim branco de creme de milho com lasquinhas de crocante e uma folhinha
    ctx.beginPath(); ctx.moveTo(-8,-1.5); ctx.lineTo(8,-1.5); ctx.quadraticCurveTo(7.4,7,0,7); ctx.quadraticCurveTo(-7.4,7,-8,-1.5); ctx.closePath(); fs(ctx,'#FFFFFF',2);
    ell(ctx,0,-1.5,8,3.2); fs(ctx,'#F2D86B',1.5);
    ctx.fillStyle = '#B9803A'; ctx.strokeStyle = '#7A4F20'; ctx.lineWidth = 0.7;
    for (const l of [[-4.4,-1.8,-0.5],[-1.4,-2.8,0.3],[1.8,-1.3,-0.2],[4.4,-2.4,0.6],[-0.4,-0.4,0.8]]){ ctx.save(); ctx.translate(l[0],l[1]); ctx.rotate(l[2]); rr(ctx,-1.8,-0.8,3.6,1.6,0.6); ctx.fill(); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = '#3E9B5A'; ell(ctx,4.6,-5.4,2.4,1.1); ctx.fill();
  } else if (k === 'pamonhaMel'){   // a pamonha aberta: a palha em barco, a massa à mostra, um fio de mel e dois cubinhos de queijo
    ctx.beginPath(); ctx.moveTo(-14,0); ctx.quadraticCurveTo(0,-13,14,0); ctx.quadraticCurveTo(0,13,-14,0); ctx.closePath(); fs(ctx,'#B9CE7A',2);
    ctx.strokeStyle = 'rgba(70,100,30,.5)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-11,-1.4); ctx.quadraticCurveTo(0,-8,11,-1.4); ctx.moveTo(-11,1.4); ctx.quadraticCurveTo(0,8,11,1.4); ctx.stroke();
    ell(ctx,0,0,10,3.8); fs(ctx,'#F2D86B',1.4);
    rr(ctx,-4.8,-2.8,3.2,3.2,0.6); fs(ctx,'#FFFBEA',0.9); rr(ctx,1.6,-0.4,3.2,3.2,0.6); fs(ctx,'#FFFBEA',0.9);
    ctx.strokeStyle = '#D98A1E'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-9,-0.6); ctx.quadraticCurveTo(-4,-2.8,0,0.4); ctx.quadraticCurveTo(4,3,9,0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1,1.6); ctx.lineTo(1,4.4); ctx.stroke(); ctx.lineCap = 'butt';
  } else if (k === 'canjicaCoco'){   // a taça de vidro com canjica branca, coco ralado e raspas de cumaru
    ctx.save(); ctx.translate(0,-1.4);
    ctx.beginPath(); ctx.moveTo(-10,-4); ctx.lineTo(10,-4); ctx.quadraticCurveTo(9,4.4,0,4.4); ctx.quadraticCurveTo(-9,4.4,-10,-4); ctx.closePath(); fs(ctx,'#EAF4F6',1.8);
    ctx.strokeStyle = '#9FB8C2'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(0,4.4); ctx.lineTo(0,8); ctx.stroke(); ell(ctx,0,8.2,5,1.4); fs(ctx,'#EAF4F6',1.6);
    ctx.beginPath(); ctx.moveTo(-9,-3); ctx.lineTo(9,-3); ctx.quadraticCurveTo(8.2,3.6,0,3.6); ctx.quadraticCurveTo(-8.2,3.6,-9,-3); ctx.closePath(); ctx.fillStyle = '#F6F0DA'; ctx.fill();
    ell(ctx,0,-4,10,3.2); fs(ctx,'#F6F0DA',1.3);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); for (const f of [[-6,-4.6,-3,-3.8],[-2,-5.6,1,-4.6],[2,-4.2,5,-5.2],[-5,-2.8,-2,-2.2],[4,-3.2,7,-3.8],[0,-3.2,3,-2.6]]){ ctx.moveTo(f[0],f[1]); ctx.lineTo(f[2],f[3]); } ctx.stroke(); ctx.lineCap = 'butt';
    ctx.fillStyle = '#4A2E18'; for (const d of [[-4,-4],[1,-5],[5,-4],[-1,-3],[3,-3.4]]){ circ(ctx,d[0],d[1],0.6); ctx.fill(); }
    ctx.restore();
  } else {   // canjica
    ctx.beginPath(); ctx.moveTo(-11,-2); ctx.lineTo(11,-2); ctx.quadraticCurveTo(10,9,0,9); ctx.quadraticCurveTo(-10,9,-11,-2); ctx.closePath(); fs(ctx,'#FFFFFF',2);
    ell(ctx,0,-2,11,4); fs(ctx,'#F4E6B8',1.6);
    ctx.fillStyle = '#E9D79A'; for (const d of [[-5,-3],[-1,-1.5],[3,-3],[6,-1],[-7,-1],[1,-4]]){ circ(ctx,d[0],d[1],1.3); ctx.fill(); }
    ctx.fillStyle = '#8A4B2A'; for (const d of [[-3,-2.5],[2,-1.2],[5,-3.2],[-6,-2],[0,-3.8]]){ circ(ctx,d[0],d[1],0.7); ctx.fill(); }   // a canela em pó
    ctx.strokeStyle = '#8A4B2A'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(4,-4); ctx.lineTo(9,-9); ctx.stroke(); ctx.lineCap = 'butt';   // o pau de canela
  }
}
/* v12.8: o arroz e o feijão do prato executivo (o mesmo do PF) e o raminho de ervas do avançado */
function avArrozFeijao(ctx){ ell(ctx,-5,-1,5.5,4.2); fs(ctx,'#FFF6DA',1.6); ell(ctx,4,-3.5,5,3.4); fs(ctx,'#5B2E1A',1.6); }
function avErvas(ctx,x,y){ ctx.fillStyle = '#3E9B5A'; ell(ctx,x,y,2.1,1.05); ctx.fill(); ell(ctx,x+2.2,y-1.6,1.9,0.95); ctx.fill(); }
function avOvo(ctx,x,y){ ell(ctx,x,y,3.4,2.2); fs(ctx,'#fff',1.4); circ(ctx,x,y,1.2); ctx.fillStyle = '#F5B800'; ctx.fill(); }
/* v12.8: os pratos novos da Avenida, cada um com a cara dele (devolve true quando desenhou); a comida enche o prato */
/* v12.10.1: os 6 pratos de estrada da área industrial, com desenho próprio (o mesmo tamanho e a mesma luz dos outros); av = o detalhe do curso avançado (uma folhinha de salsa) */
function drawEstrada(ctx,k,av){
  const pr = CARDAPIO[k], cor = pr ? pr.cor : '#D9A25B', sals = (x,y) => { ctx.fillStyle = '#3E9B5A'; ell(ctx,x,y,2,1); ctx.fill(); };
  if (k === 'pastelFrango'){   // pastel dourado, borda de garfo e catupiry saindo num canto
    rr(ctx,-12,-7,24,14,2.4); fs(ctx,cor,2);
    ctx.fillStyle = '#F4C874'; rr(ctx,-9.5,-5,12,3,1.2); ctx.fill();
    ctx.strokeStyle = 'rgba(120,70,20,.6)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x=-10.5;x<=10.5;x+=3){ ctx.moveTo(x,-6.4); ctx.lineTo(x,-4.6); ctx.moveTo(x,6.4); ctx.lineTo(x,4.6); } ctx.stroke();
    ctx.fillStyle = 'rgba(150,90,20,.45)'; for (const d of [[-6,1],[0,3],[5,0],[-2,-1.4]]){ circ(ctx,d[0],d[1],0.9); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(10,-3); ctx.quadraticCurveTo(15.5,-4.5,15,0.5); ctx.quadraticCurveTo(14,3,10.5,2); ctx.closePath(); fs(ctx,'#FFFBEA',1.3);
    if (av) sals(-8,-2);
  } else if (k === 'pastelCarneSeca'){   // pastel maior e mais escuro, fiapos de carne-seca e queijo derretido na ponta
    rr(ctx,-13.5,-8,27,16,2.4); fs(ctx,cor,2);
    ctx.fillStyle = '#B9711F'; rr(ctx,-11,-6,13,3,1.2); ctx.fill();
    ctx.fillStyle = 'rgba(90,45,10,.55)'; for (const d of [[-8,2],[-3,4],[3,3],[8,-3],[0,-3.5],[-9,-1]]){ circ(ctx,d[0],d[1],1); ctx.fill(); }
    ctx.strokeStyle = '#7A3B1D'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(11,-2); ctx.lineTo(15.5,-3.5); ctx.moveTo(11,0.5); ctx.lineTo(16,0.8); ctx.moveTo(11,3); ctx.lineTo(15,5); ctx.stroke(); ctx.lineCap = 'butt';
    ctx.fillStyle = '#F7D86A'; ctx.beginPath(); ctx.moveTo(9,4); ctx.quadraticCurveTo(14,4,13.5,9); ctx.quadraticCurveTo(10,9,9,4); ctx.fill();
    if (av) sals(-5,0);
  } else if (k === 'xSalada'){   // pão com gergelim, hambúrguer, queijo, alface e tomate aparecendo na borda
    rr(ctx,-12,3,24,5,2.5); fs(ctx,cor,2);
    rr(ctx,-12.5,-0.6,25,4.4,2); fs(ctx,'#6B3A22',1.4);
    ctx.fillStyle = '#F6D44A'; ctx.beginPath(); ctx.moveTo(-11,-0.8); ctx.lineTo(11,-0.8); ctx.lineTo(9,2.4); ctx.lineTo(-9,2.4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-12,-1.4); for (let x=-12;x<=12;x+=3){ ctx.quadraticCurveTo(x+1.5,1.4,x+3,-1.4); } ctx.closePath(); fs(ctx,'#6FAE3E',1.2);
    circ(ctx,-7,-2.6,2.3); fs(ctx,'#E24B3B',1.1); circ(ctx,6,-2.6,2.3); fs(ctx,'#E24B3B',1.1);
    ctx.beginPath(); ctx.moveTo(-12,-3.5); ctx.quadraticCurveTo(0,-15,12,-3.5); ctx.closePath(); fs(ctx,cor,2);
    ctx.fillStyle = '#FFF1C8'; for (const d of [[-6,-7.6],[-1,-9.4],[4,-8],[8,-5.4],[-9,-5]]){ ell(ctx,d[0],d[1],0.9,0.5); ctx.fill(); }
    if (av) sals(0,-12.6);
  } else if (k === 'xTudo'){   // mais alto: ovo frito, bacon, presunto e milho saindo pelos lados
    rr(ctx,-12,5,24,4.4,2.2); fs(ctx,cor,2);
    rr(ctx,-12.5,1.6,25,4,2); fs(ctx,'#6B3A22',1.4);
    ctx.fillStyle = '#E58C8C'; ctx.beginPath(); ctx.moveTo(-13.5,0.2); ctx.lineTo(13.5,0.2); ctx.lineTo(11.5,2.4); ctx.lineTo(-11.5,2.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#B5473A'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(-13,-1.8); ctx.quadraticCurveTo(-8,-0.2,-4,-1.8); ctx.quadraticCurveTo(0,-3,4,-1.6); ctx.quadraticCurveTo(9,-0.4,13.5,-2); ctx.stroke();
    ell(ctx,0,-3.6,8.4,3.2); fs(ctx,'#fff',1.3); circ(ctx,0.4,-3.8,2.2); ctx.fillStyle = '#F5B800'; ctx.fill();
    ctx.fillStyle = '#F6D44A'; for (const d of [[-13.5,2],[-14.6,4.4],[13.8,1.8],[14.8,4.6]]){ circ(ctx,d[0],d[1],1); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-12,-5.2); ctx.quadraticCurveTo(0,-18.5,12,-5.2); ctx.closePath(); fs(ctx,cor,2);
    ctx.fillStyle = '#FFF1C8'; for (const d of [[-6,-10.2],[-1,-12.6],[4,-11],[8,-8]]){ ell(ctx,d[0],d[1],0.9,0.5); ctx.fill(); }
    if (av) sals(0,-15.2);
  } else if (k === 'enroladinho'){   // 2 enroladinhos de massa dourada em espiral, com a ponta da salsicha aparecendo
    [[-5,-3.4,-0.18],[5,3.4,0.14]].forEach(f => {
      ctx.save(); ctx.translate(f[0],f[1]); ctx.rotate(f[2]);
      rr(ctx,-10,-3.6,20,7.2,3.6); fs(ctx,cor,1.8);
      ctx.strokeStyle = 'rgba(120,70,20,.6)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x=-6;x<=5;x+=4){ ctx.moveTo(x,-3.4); ctx.lineTo(x+3,3.4); } ctx.stroke();
      circ(ctx,-10.2,0,2.4); fs(ctx,'#C2503A',1.2); circ(ctx,10.2,0,2.4); fs(ctx,'#C2503A',1.2);
      ctx.restore();
    });
    if (av) sals(0,-0.4);
  } else if (k === 'bolinhoCarneSeca'){   // 3 bolinhas douradas e rugosas, uma aberta mostrando a carne-seca desfiada
    [[-7,2,4.6],[7,3,4.6],[0,-4.6,5]].forEach((b,i) => {
      circ(ctx,b[0],b[1],b[2]); fs(ctx,cor,1.8);
      ctx.fillStyle = 'rgba(100,55,15,.6)'; for (const d of [[-1.8,-1.2],[1.4,-1.8],[1.6,1.4],[-1.2,1.8]]){ circ(ctx,b[0]+d[0],b[1]+d[1],0.6); ctx.fill(); }
      if (i === 2){
        ctx.fillStyle = '#FFF1D2'; ell(ctx,b[0]+1.4,b[1]-0.6,3,2.4); ctx.fill();
        ctx.strokeStyle = '#8A3F22'; ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(b[0]-0.6,b[1]-1.6); ctx.lineTo(b[0]+3,b[1]-0.4); ctx.moveTo(b[0]-0.4,b[1]+0.4); ctx.lineTo(b[0]+2.6,b[1]+1.2); ctx.moveTo(b[0]+0.4,b[1]-0.4); ctx.lineTo(b[0]+3.2,b[1]-1.8); ctx.stroke(); ctx.lineCap = 'butt';
      }
    });
    if (av) sals(0,8.6);
  } else return false;
  return true;
}
function drawAvenida(ctx,k,av){
  const pr = CARDAPIO[k];
  let dx = 0, dy = 0, cat = pr ? pr.cat : '', ok = true;
  if (k === 'execFrango'){   // arroz, feijão, o filé de frango grelhado e a salada no lugar do ovo
    avArrozFeijao(ctx);
    ctx.save(); ctx.translate(3,4.2); ctx.scale(1.17,1.2); ctx.translate(-3,-4); drawCarne(ctx,'frango'); ctx.restore();
    ctx.fillStyle = '#8CC152'; ctx.strokeStyle = '#4F7F2A'; ctx.lineWidth = 0.8;
    ctx.save(); ctx.translate(-8,4.4); ctx.rotate(-0.5); ell(ctx,0,0,3.4,1.8); ctx.fill(); ctx.stroke(); ctx.rotate(1.1); ell(ctx,0,0.4,3.2,1.6); ctx.fill(); ctx.stroke(); ctx.restore();
    circ(ctx,-6.2,6.4,1.8); fs(ctx,'#E24B3B',1.1);
    if (av) avErvas(ctx,2.6,3.4);
  } else if (k === 'strogonoff'){   // arroz à esquerda; molho rosado com cubinhos de carne e champignon, e batata palha por cima
    ell(ctx,-6.5,0,5,5.2); fs(ctx,'#FFF6DA',1.6);
    ell(ctx,4.5,1,8.4,7.4); fs(ctx,'#D98A5A',1.8);
    ctx.fillStyle = '#7A3B1E'; for (const c of [[0.5,-2.6],[5,-1.6],[2.4,3.6],[7.4,3.8]]){ rr(ctx,c[0]-1.4,c[1]-1.3,2.8,2.6,0.7); ctx.fill(); }
    ctx.fillStyle = '#EADFC4'; ctx.strokeStyle = '#B7A57F'; ctx.lineWidth = 0.7; for (const c of [[-0.4,2.4],[8,-1.6]]){ ell(ctx,c[0],c[1],1.9,1.2); ctx.fill(); ctx.stroke(); }
    ctx.strokeStyle = '#F2C94C'; ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.beginPath();
    [[1,0,0.7],[4,-3,-0.6],[6,1,0.4],[3,2,-0.9],[8,3,0.2],[-1,-1,-0.4],[5,4.6,0.9],[7.4,-0.2,-0.8],[2,-0.4,1.2]].forEach(b => { ctx.moveTo(b[0]-Math.cos(b[2])*1.9,b[1]-Math.sin(b[2])*1.9); ctx.lineTo(b[0]+Math.cos(b[2])*1.9,b[1]+Math.sin(b[2])*1.9); });
    ctx.stroke(); ctx.lineCap = 'round';
    if (av) avErvas(ctx,6.6,-5.6);
  } else if (k === 'mandioca'){   // cinco bastões grossos em leque e um potinho de maionese
    [[-6,-0.6],[-3.2,-0.3],[-0.2,0],[2.8,0.3],[5.6,0.6]].forEach(b => {
      ctx.save(); ctx.translate(b[0] - 2,0.5); ctx.rotate(b[1]); rr(ctx,-2,-8,4,16,1.8); fs(ctx,'#E3B25A',1.6);
      rr(ctx,-1.3,-7.2,2.6,2,0.9); ctx.fillStyle = '#F7EBC4'; ctx.fill(); ctx.restore();
    });
    circ(ctx,9.2,4.6,2.7); fs(ctx,'#FFFFFF',1.4); ell(ctx,9.2,4.4,1.6,1); ctx.fillStyle = '#FFF4CC'; ctx.fill();
    dx = -1.5; dy = -6;
  } else if (k === 'isca'){   // quatro tirinhas empanadas tortas, um gomo de limão e o molho tártaro
    [[-1,-5.2,-0.3],[1,-1.7,-0.08],[-1,1.9,0.18],[1,5.4,0.42]].forEach(t => {
      ctx.save(); ctx.translate(t[0],t[1]); ctx.rotate(t[2]);
      ctx.beginPath(); ctx.moveTo(-6,-1.6); ctx.quadraticCurveTo(-3,-2.8,6,-1.8); ctx.quadraticCurveTo(7.6,0,6,1.8); ctx.quadraticCurveTo(0,2.8,-6,1.6); ctx.quadraticCurveTo(-7.4,0.2,-6,-1.6); ctx.closePath(); fs(ctx,'#E0B46A',1.6);
      ctx.fillStyle = '#F6E2A8'; for (const d of [[-3.4,-0.6],[0,0.8],[3.6,-0.4]]){ circ(ctx,d[0],d[1],0.5); ctx.fill(); }
      ctx.restore();
    });
    ctx.beginPath(); ctx.arc(-9.6,-5.6,3.4,0.2,Math.PI + 0.2); ctx.closePath(); fs(ctx,'#B5D33A',1.4);
    ctx.strokeStyle = '#EAF3B0'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(-9.6,-5.2); ctx.lineTo(-9.6,-2.8); ctx.moveTo(-12,-5); ctx.lineTo(-11,-3); ctx.moveTo(-7.2,-5); ctx.lineTo(-8.2,-3); ctx.stroke();
    circ(ctx,9.4,4.6,2.7); fs(ctx,'#FFFFFF',1.4); ctx.fillStyle = '#6FAE3E'; for (const d of [[8.4,4],[10.2,5],[9.2,5.6]]){ circ(ctx,d[0],d[1],0.45); ctx.fill(); }
    dx = 3; dy = -3.6;
  } else if (k === 'torta'){   // uma fatia em cunha: a tampa de massa e, na face do corte, o recheio com frango e ervilha
    ctx.beginPath(); ctx.moveTo(-12,-2); ctx.lineTo(10,-7.5); ctx.lineTo(10,0.6); ctx.closePath(); fs(ctx,'#D9A55B',1.8);
    ctx.strokeStyle = 'rgba(120,70,20,.45)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-5,-2.4); ctx.lineTo(7,-4.4); ctx.moveTo(-1,-3.4); ctx.lineTo(7,-1.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12,-2); ctx.lineTo(10,0.6); ctx.lineTo(10,6.4); ctx.lineTo(-12,0.4); ctx.closePath(); fs(ctx,'#F2DDA2',1.8);
    ctx.fillStyle = '#D9BE8A'; for (const c of [[-3,0.6],[2.6,2.8],[6.4,4.2],[5,1.8]]){ rr(ctx,c[0]-1.7,c[1]-1.1,3.4,2.2,0.9); ctx.fill(); }
    ctx.fillStyle = '#5FAE3E'; circ(ctx,0,3.6,1.1); ctx.fill(); circ(ctx,8,3.2,1.1); ctx.fill();
    ctx.strokeStyle = '#D9A55B'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-12,0.4); ctx.lineTo(10,6.4); ctx.stroke();
    dx = 4; dy = -3.6;
  } else if (k === 'empadao'){   // pedaço quadrado com cobertura em treliça e palmito nos furos
    rr(ctx,-7,-5.5,14,11,2); fs(ctx,'#CDB866',2);
    for (const x of [-3.5,3.5]){ circ(ctx,x,0,1.9); fs(ctx,'#FFF8E6',0.9); circ(ctx,x,0,0.7); ctx.fillStyle = '#E9D9A2'; ctx.fill(); }
    ctx.save(); rr(ctx,-7,-5.5,14,11,2); ctx.clip();
    for (const pass of [[3.4,'#8A5A24'],[1.8,'#D9A55B']]){
      ctx.strokeStyle = pass[1]; ctx.lineWidth = pass[0]; ctx.beginPath();
      for (const d of [-7,0,7]){ ctx.moveTo(d-7,-7); ctx.lineTo(d+7,7); ctx.moveTo(d+7,-7); ctx.lineTo(d-7,7); } ctx.stroke();
    }
    ctx.restore();
    rr(ctx,-7,-5.5,14,11,2); ctx.strokeStyle = '#22201C'; ctx.lineWidth = 2; ctx.stroke();
    dx = 0; dy = 0;
  } else if (k === 'beirute'){   // dois triângulos de pão sírio com o recheio em camadas na borda
    for (const cx of [-6,6]){
      ctx.beginPath(); ctx.moveTo(cx,-9); ctx.lineTo(cx + 5.8,2); ctx.lineTo(cx - 5.8,2); ctx.closePath(); fs(ctx,'#E8C98F',1.8);
      ctx.fillStyle = 'rgba(160,100,40,.5)'; for (const d of [[0,-4],[-2,-1],[2.4,-0.4],[0.4,0.4]]){ circ(ctx,cx+d[0],d[1],0.7); ctx.fill(); }
      [['#B04A3E',2],['#F6D44A',3],['#6FAE3E',4],['#E24B3B',5]].forEach(l => { ctx.fillStyle = l[0]; ctx.fillRect(cx - 5.8,l[1],11.6,1); });
      ctx.strokeStyle = '#22201C'; ctx.lineWidth = 1.2; ctx.strokeRect(cx - 5.8,2,11.6,4);
    }
    dx = 0; dy = -3;
  } else if (k === 'coalho'){   // dois espetinhos de queijo com marcas de grelha
    [[-4.4,-0.05],[4.6,0.05]].forEach(e => {
      ctx.save(); ctx.translate(0,e[0]); ctx.rotate(e[1]);
      ctx.strokeStyle = '#B98A52'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-12,0); ctx.lineTo(12,0); ctx.stroke(); ctx.lineCap = 'butt';
      rr(ctx,-7,-3,14,6,1.8); fs(ctx,'#F4E6B8',1.8);
      ctx.strokeStyle = '#C98A3A'; ctx.lineWidth = 1.1; ctx.beginPath(); for (const x of [-4.6,-0.6,3.4]){ ctx.moveTo(x-1.4,-2.4); ctx.lineTo(x+1.4,2.4); } ctx.stroke();
      ctx.restore();
    });
    dx = 0; dy = -4.4;
  } else if (k === 'panqueca' || k === 'panquecaEsp'){   // duas panquecas enroladas com molho no meio e o recheio na ponta
    const esp = k === 'panquecaEsp', massa = esp ? '#C9D48A' : '#E9C27A';
    [-4.6,4.6].forEach(y => {
      rr(ctx,-9,y - 3,18,6,3); fs(ctx,massa,1.8);
      ell(ctx,9,y,1.7,2.5); fs(ctx,esp ? '#4F8A3A' : '#7A3B1E',1.1);
      rr(ctx,-4.4,y - 2.6,8.8,5.2,2.4); ctx.fillStyle = esp ? '#F4EEDD' : '#C23B22'; ctx.fill();
      ctx.fillStyle = esp ? '#D9D2B8' : '#F6D44A'; for (const d of [[-2.4,-0.8],[0,0.9],[2.4,-0.6]]){ circ(ctx,d[0],y + d[1],0.6); ctx.fill(); }
    });
    dx = 0; dy = 0;
  } else if (k === 'execVeg'){   // arroz, feijão, legumes (brócolis e cenoura) e o ovo frito
    avArrozFeijao(ctx);
    avOvo(ctx,-8.4,5.4);
    for (const b of [[-1.4,3.2],[3,3.6],[7.2,3.2]]){
      ctx.strokeStyle = '#6FA04A'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(b[0],b[1] + 3); ctx.lineTo(b[0],b[1]); ctx.stroke();
      ctx.fillStyle = '#3E7B3A'; ctx.strokeStyle = '#22201C'; ctx.lineWidth = 0.8; for (const c of [[-1.2,-0.4],[1.2,-0.4],[0,-1.6]]){ circ(ctx,b[0] + c[0],b[1] + c[1],1.4); ctx.fill(); ctx.stroke(); }
    }
    for (const c of [[-0.6,7],[3.4,7.2],[7.2,6.8]]){ circ(ctx,c[0],c[1],1.5); fs(ctx,'#E88A2E',1); }
    if (av) avErvas(ctx,9.4,-0.2);
  } else if (k === 'escondidinho'){   // a travessinha de louça com o purê e o gratinado
    rr(ctx,-12,-7.5,24,15,3); fs(ctx,'#FFFFFF',2.4);
    rr(ctx,-10,-5.5,20,11,2); fs(ctx,'#E3A04A',1.3);
    ctx.fillStyle = 'rgba(150,80,20,.6)'; for (const m of [[-5,-2.4,3.4,1.8],[2.4,-3,3.8,1.6],[5,2.2,3.2,1.8],[-3,2.8,3,1.5],[-8,1,1.6,1.2]]){ ell(ctx,m[0],m[1],m[2],m[3]); ctx.fill(); }
    dx = 0.5; dy = 0;
  } else if (k === 'execVegano'){   // arroz, feijão, couve refogada e farofa
    avArrozFeijao(ctx);
    ctx.strokeStyle = '#2F6B2F'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (const f of [[-11,3.2],[-10.4,5],[-9.8,6.8],[-6.6,3.6],[-6,5.4],[-5.4,7.2]]){ ctx.beginPath(); ctx.moveTo(f[0],f[1]); ctx.lineTo(f[0] + 2,f[1] - 1); ctx.lineTo(f[0] + 4,f[1] + 1); ctx.lineTo(f[0] + 6,f[1] - 0.6); ctx.stroke(); }
    ctx.lineCap = 'butt';
    ell(ctx,5.6,5.4,5.4,3.2); fs(ctx,'#E8C46A',1.4);
    ctx.fillStyle = '#B88A2E'; for (const d of [[3,4.6],[5.4,6.4],[8,5],[6.4,4],[3.6,6.6],[9,6.2]]){ circ(ctx,d[0],d[1],0.55); ctx.fill(); }
    ctx.fillStyle = '#F6E2A0'; for (const d of [[4.4,5.4],[7,5.6],[6,4.4]]){ circ(ctx,d[0],d[1],0.45); ctx.fill(); }
  } else if (k === 'moquecaBanana'){   // a panela de barro vista de cima, com o caldo de dendê, banana, pimentão e coentro
    rr(ctx,-13,-1.6,6,3.2,1.4); fs(ctx,'#8A4322',1.6); rr(ctx,7,-1.6,6,3.2,1.4); fs(ctx,'#8A4322',1.6);
    circ(ctx,0,0,9.4); fs(ctx,'#A8532E',2);
    circ(ctx,0,0,7.2); fs(ctx,'#E8892A',1.2);
    ctx.fillStyle = '#F2D06B'; ctx.strokeStyle = '#B58A1B'; ctx.lineWidth = 0.9;
    for (const b of [[-3.2,-2.4],[2.4,-3.2],[3.4,1.8],[-2.2,2.8]]){ circ(ctx,b[0],b[1],2); ctx.fill(); ctx.stroke(); circ(ctx,b[0],b[1],0.6); ctx.fillStyle = '#C99A3A'; ctx.fill(); ctx.fillStyle = '#F2D06B'; }
    ctx.strokeStyle = '#D3382B'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-5,0.4); ctx.quadraticCurveTo(-1,-1.6,1,1.2); ctx.stroke(); ctx.lineCap = 'butt';
    ctx.fillStyle = '#3E9B5A'; for (const d of [[0,-5],[5,-0.4],[-5.4,-3.4],[-0.4,5.2]]){ ell(ctx,d[0],d[1],1.5,0.8); ctx.fill(); }
  } else ok = false;
  if (!ok) return false;
  if (pr && pr.veg) drawVegSelo(ctx, pr.vegano);
  if (av && !(pr && pr.semAv)){
    if (cat !== 'pf') drawAvDetalhe(ctx,cat,dx,dy);
  }
  return true;
}
/* v12.8.1: os pratos do Terraço, de cozinha fina (porção menor, prato branco à mostra, um fio de molho e uma folhinha); devolve true quando desenhou */
function terCamarao(ctx,x,y,s){   // um camarão inteiro em C, rosa-alaranjado com listrinhas
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0,0,3.4,-2.5,1.1); ctx.strokeStyle = '#8A4A2A'; ctx.lineWidth = 4.2; ctx.stroke();
  ctx.strokeStyle = '#E7A972'; ctx.lineWidth = 2.6; ctx.stroke();
  ctx.strokeStyle = '#C97B4A'; ctx.lineWidth = 0.7; ctx.beginPath();
  for (const a of [-1.8,-1.1,-0.4,0.3]){ ctx.moveTo(Math.cos(a)*2,Math.sin(a)*2); ctx.lineTo(Math.cos(a)*4.6,Math.sin(a)*4.6); } ctx.stroke();
  ctx.beginPath(); ctx.moveTo(Math.cos(1.1)*3.4,Math.sin(1.1)*3.4); ctx.lineTo(0.2,5.6); ctx.moveTo(Math.cos(1.1)*3.4,Math.sin(1.1)*3.4); ctx.lineTo(2.6,5.8); ctx.strokeStyle = '#E7A972'; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.restore();
}
function terSerra(ctx,x,y,w,rot,cor){   // um quadradinho de borda serrilhada (zigue-zague nas 4 bordas)
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot); const h = w / 2, n = 4, st = w / n;
  ctx.beginPath(); ctx.moveTo(-h,-h);
  for (let i=0;i<n;i++) ctx.lineTo(-h + st*(i+0.5),-h - 0.8), ctx.lineTo(-h + st*(i+1),-h);
  for (let i=0;i<n;i++) ctx.lineTo(h + 0.8,-h + st*(i+0.5)), ctx.lineTo(h,-h + st*(i+1));
  for (let i=0;i<n;i++) ctx.lineTo(h - st*(i+0.5),h + 0.8), ctx.lineTo(h - st*(i+1),h);
  for (let i=0;i<n;i++) ctx.lineTo(-h - 0.8,h - st*(i+0.5)), ctx.lineTo(-h,h - st*(i+1));
  ctx.closePath(); fs(ctx,cor,1.3); ctx.restore();
}
function terMeiaLua(ctx,x,y,r,rot,cor){   // um pasteizinho meia-lua com a borda de garfo
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  ctx.beginPath(); ctx.arc(0,0,r,Math.PI,0); ctx.closePath(); fs(ctx,cor,1.5);
  ctx.strokeStyle = 'rgba(120,70,20,.7)'; ctx.lineWidth = 0.8; ctx.beginPath();
  for (let a=3.4;a<6.1;a+=0.4){ ctx.moveTo(Math.cos(a)*(r-1.7),Math.sin(a)*(r-1.7)); ctx.lineTo(Math.cos(a)*(r-0.3),Math.sin(a)*(r-0.3)); } ctx.stroke();
  ctx.restore();
}
function drawTerraco(ctx,k,av){
  const pr = CARDAPIO[k];
  let dx = 0, dy = 0, cat = pr ? pr.cat : '', ok = true, ervas = null;
  if (k === 'vinho'){   // um arco de molho de vinho, o filé alto em cima, o purê em gota e o alecrim
    ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-9.5,3.6); ctx.quadraticCurveTo(0,-8.4,9.5,3.6); ctx.strokeStyle = '#5A1F2E'; ctx.lineWidth = 3.4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-6,0.2); ctx.quadraticCurveTo(-3,-3.4,0,-3.6); ctx.strokeStyle = 'rgba(255,200,210,.45)'; ctx.lineWidth = 0.9; ctx.stroke();
    rr(ctx,-5.5,-3.8,9,7,2.4); fs(ctx,'#7A3F2A',1.6); rr(ctx,-4.4,-2.8,6.8,1.8,0.9); ctx.fillStyle = '#A86A48'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(5.2,5.2); ctx.quadraticCurveTo(5.2,0.6,8.6,0.4); ctx.quadraticCurveTo(10.2,3.6,8,5.4); ctx.quadraticCurveTo(6.4,6,5.2,5.2); ctx.closePath(); fs(ctx,'#F3E7C8',1.3);
    ctx.strokeStyle = '#3E9B5A'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(-1,-3.6); ctx.lineTo(-3,-6.6); ctx.moveTo(0.4,-3.8); ctx.lineTo(0.4,-7); ctx.moveTo(1.8,-3.6); ctx.lineTo(3.4,-6.4); ctx.stroke();
    ervas = [-8.4,-3.6];
  } else if (k === 'galeto'){   // meio galeto: a coxa com o ossinho, a sobrecoxa e três legumes
    ctx.save(); ctx.translate(-1.2,0.8); ctx.rotate(0.3);
    ell(ctx,3.4,1.8,4.4,3); fs(ctx,'#B97835',1.5);
    ell(ctx,2,0,5.2,3.5); fs(ctx,'#C98A4B',1.7);
    ctx.fillStyle = 'rgba(255,235,190,.5)'; ell(ctx,2.6,-1.5,2.6,0.8); ctx.fill();
    rr(ctx,-6.4,-0.8,4.4,1.6,0.8); fs(ctx,'#FFFDF4',1.1); circ(ctx,-6.6,-1,1); fs(ctx,'#FFFDF4',1); circ(ctx,-6.6,1,1); fs(ctx,'#FFFDF4',1);
    ctx.restore();
    ell(ctx,8.6,-4,1.3,2.4); fs(ctx,'#F08A2E',1.1);
    circ(ctx,8.6,0.2,1.9); fs(ctx,'#B8D88A',1.1); circ(ctx,8.6,0.2,0.8); ctx.fillStyle = '#E6F2C0'; ctx.fill();
    circ(ctx,8.6,4.4,1.7); fs(ctx,'#E24B3B',1.1);
    ervas = [-4,-5.6];
  } else if (k === 'escalope'){   // três escalopes finos em leque, o molho bege escorrendo e três fatias de cogumelo
    [[-4.6,-2.6,-0.4],[0,0.2,0],[4.6,2.8,0.4]].forEach(e => { ctx.save(); ctx.translate(e[0],e[1]); ctx.rotate(e[2]); ell(ctx,0,0,4.4,2.7); fs(ctx,'#9A6A45',1.5); ctx.restore(); });
    ctx.beginPath(); ctx.moveTo(-6,-1.6); ctx.quadraticCurveTo(-1,-3,4,-0.4); ctx.quadraticCurveTo(7,0.6,6.6,3.4); ctx.quadraticCurveTo(5.4,3.8,5.2,2.4); ctx.quadraticCurveTo(0,1.6,-1,3.2); ctx.quadraticCurveTo(-2.4,3.6,-2.6,1.8); ctx.quadraticCurveTo(-5,0.4,-6,-1.6); ctx.closePath(); ctx.fillStyle = 'rgba(217,199,160,.92)'; ctx.fill();
    [[-3.6,-1.2,-0.4],[0.8,0.2,0.2],[4.6,1.8,0.3]].forEach(m => { ctx.save(); ctx.translate(m[0],m[1]); ctx.rotate(m[2]); ell(ctx,0,0,1.9,1.2); fs(ctx,'#8A6240',0.9); rr(ctx,-0.5,0.4,1,1.4,0.5); ctx.fillStyle = '#D9C7A0'; ctx.fill(); ctx.restore(); });
    ctx.fillStyle = '#3E9B5A'; for (const d of [[-8,3.6],[7.6,-3.6],[-1,5.6]]){ circ(ctx,d[0],d[1],0.8); ctx.fill(); }
    ervas = [6,-6];
  } else if (k === 'dadinho'){   // cinco cubinhos em pirâmide e o potinho de geleia de pimenta
    [[-9,0.4],[-4,0.4],[1,0.4],[-6.5,-4.6],[-1.5,-4.6]].forEach(c => { rr(ctx,c[0],c[1],5,5,0.8); fs(ctx,'#E3B25A',1.3); ctx.fillStyle = '#F4E6B8'; ctx.fillRect(c[0] + 0.6,c[1] + 0.6,3.8,1.7); });
    circ(ctx,8,1.2,2.4); fs(ctx,'#FFFFFF',1.3); circ(ctx,8,1.2,1.5); ctx.fillStyle = '#C8302B'; ctx.fill();
    dx = -4; dy = -7.4;
  } else if (k === 'croquete'){   // três cilindros empanados deitados e uma gota de mostarda
    [[-2.5,-4.4],[-0.5,0],[-2.5,4.4]].forEach(c => { rr(ctx,c[0] - 5.5,c[1] - 2.5,11,5,2.4); fs(ctx,'#B8793A',1.6); ctx.fillStyle = 'rgba(60,30,8,.55)'; for (const d of [[-3,-0.8],[0,1],[3,-0.6]]){ circ(ctx,c[0] + d[0],c[1] + d[1],0.5); ctx.fill(); } ctx.fillStyle = 'rgba(255,225,150,.6)'; circ(ctx,c[0] + 1.6,c[1] - 1.2,0.5); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(8.2,-0.4); ctx.quadraticCurveTo(10.6,3,8.2,5); ctx.quadraticCurveTo(5.8,3,8.2,-0.4); ctx.closePath(); fs(ctx,'#E8B830',1.1);
    dx = 6; dy = -5.6;
  } else if (k === 'folhado'){   // um quadrado de massa folhada com camadas, o brie escorrendo e a geleia
    rr(ctx,-6.5,-5,11.5,9,1.6); fs(ctx,'#E6C27A',1.7);
    ctx.strokeStyle = 'rgba(150,100,30,.6)'; ctx.lineWidth = 0.8; ctx.beginPath(); for (const y of [0,1.7,3.4]){ ctx.moveTo(-6,y); ctx.lineTo(4.6,y); } ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-5.4,-0.6); ctx.quadraticCurveTo(-1,-2.6,3.8,-0.8); ctx.quadraticCurveTo(5.6,2.8,3,5); ctx.quadraticCurveTo(1,2.6,-0.4,5.8); ctx.quadraticCurveTo(-2.6,2.4,-4.2,4.6); ctx.quadraticCurveTo(-6,2,-5.4,-0.6); ctx.closePath(); fs(ctx,'#FFF8E6',1.2);
    circ(ctx,-1.6,-3,1.6); fs(ctx,'#B0203A',1.1);
    dx = 4; dy = -4.2;
  } else if (k === 'empadinhaCam'){   // duas empadinhas pequenas e um camarão em cima de cada
    [[-5.2,2.4],[5.4,2.4]].forEach(e => {
      ctx.save(); ctx.translate(e[0],e[1]); ctx.scale(0.62,0.62);
      ctx.beginPath(); ctx.moveTo(-8,-1); ctx.lineTo(8,-1); ctx.lineTo(6,7); ctx.lineTo(-6,7); ctx.closePath(); fs(ctx,'#D9A55B',2.2);
      ctx.strokeStyle = 'rgba(90,50,20,.45)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-4,1); ctx.lineTo(-3,6); ctx.moveTo(0,1); ctx.lineTo(0,6); ctx.moveTo(4,1); ctx.lineTo(3,6); ctx.stroke();
      ell(ctx,0,-2,9.5,5.5); fs(ctx,'#E7A972',2.2); ctx.restore();
      terCamarao(ctx,e[0],e[1] - 3.6,0.6);
    });
    dx = 0; dy = 4.4;
  } else if (k === 'coalhoMel'){   // três cubos de queijo coalho grelhados e o fio de melaço em zigue-zague
    [-6.4,0,6.4].forEach(x => { rr(ctx,x - 3,-2.6,6,6,1.1); fs(ctx,'#EBC96B',1.5); ctx.strokeStyle = 'rgba(150,80,20,.55)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x - 2,-1.6); ctx.lineTo(x + 2,2.4); ctx.moveTo(x - 0.6,-1.8); ctx.lineTo(x + 2.4,0.8); ctx.stroke(); });
    ctx.strokeStyle = '#8A4A1A'; ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-9,-3.6);
    [[-6.4,2.4],[-3.6,-3.4],[-0.4,2.6],[2.6,-3.4],[5.6,2.6],[9,-3.2]].forEach(p => ctx.lineTo(p[0],p[1])); ctx.stroke();
    circ(ctx,-0.4,5.8,0.9); ctx.fillStyle = '#8A4A1A'; ctx.fill();
  } else if (k === 'crostini'){   // três fatias de pão em diagonal, cada uma com presunto cru em dobra e rúcula
    [[-5.2,3.6],[0,0],[5.2,-3.6]].forEach(f => {
      ctx.save(); ctx.translate(f[0],f[1]); ctx.rotate(-0.5);
      ell(ctx,0,0,4.8,2.7); fs(ctx,'#D9A25B',1.3);
      ctx.beginPath(); ctx.moveTo(-3.6,0.4); ctx.quadraticCurveTo(-1.8,-2,0,0); ctx.quadraticCurveTo(1.8,2,3.6,-0.2); ctx.quadraticCurveTo(1.8,1.8,0,1.4); ctx.quadraticCurveTo(-1.8,-0.2,-3.6,0.4); ctx.closePath(); fs(ctx,'#D79A8A',0.9);
      ctx.strokeStyle = '#FFE9E2'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-1.6,-0.4); ctx.lineTo(1.6,0.8); ctx.stroke();
      ctx.fillStyle = '#2F7A3A'; ell(ctx,1.8,-1.2,1.2,0.6); ctx.fill();
      ctx.restore();
    });
    dx = 0; dy = 0;
  } else if (k === 'pastelCamarao'){   // três pasteizinhos meia-lua com borda de garfo e um camarão ao lado
    terMeiaLua(ctx,-5.4,3.4,4.2,-0.3,'#EBAE7A'); terMeiaLua(ctx,0.4,-1.4,4.2,0.25,'#EBAE7A'); terMeiaLua(ctx,5.2,5,4.2,0.1,'#EBAE7A');
    terCamarao(ctx,7,-3.6,0.55);
  } else if (k === 'ravioli'){   // quatro quadradinhos serrilhados em xadrez e um potinho de molho de tomate
    terSerra(ctx,-6.4,-3.2,5.6,-0.12,'#EED08A'); terSerra(ctx,-0.4,-3.2,5.6,0.12,'#EED08A'); terSerra(ctx,-6.4,3,5.6,0.12,'#EED08A'); terSerra(ctx,-0.4,3,5.6,-0.12,'#EED08A');
    circ(ctx,7.6,0.4,2.6); fs(ctx,'#FFFFFF',1.3); circ(ctx,7.6,0.4,1.7); ctx.fillStyle = '#D23B2A'; ctx.fill();
  } else if (k === 'nhoque'){   // sete travesseirinhos na poça de manteiga e três folhas de sálvia
    ell(ctx,0,0.4,9.6,6); ctx.fillStyle = '#F7E2A0'; ctx.fill();
    [[-5.6,-1.6],[-1.8,-3.2],[2.4,-2.2],[6,-0.2],[-4,2.2],[0.2,1.4],[4,3.4]].forEach((p,i) => { ctx.save(); ctx.translate(p[0],p[1]); ctx.rotate(i * 0.5 - 1); ell(ctx,0,0,2.4,1.7); fs(ctx,'#E8B455',1.1); ctx.strokeStyle = 'rgba(140,80,20,.6)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(-0.7,-1); ctx.lineTo(-0.7,1); ctx.moveTo(0.7,-1); ctx.lineTo(0.7,1); ctx.stroke(); ctx.restore(); });
    ctx.fillStyle = '#7E9C6A'; [[-7.6,3.4,0.6],[6.8,-4.4,-0.5],[-0.4,-5.6,0.1]].forEach(l => { ctx.save(); ctx.translate(l[0],l[1]); ctx.rotate(l[2]); ell(ctx,0,0,2.2,1.1); ctx.fill(); ctx.restore(); });
    ervas = [8,3.6];
  } else if (k === 'polenta'){   // dois retângulos de polenta grelhados, rodelas de abobrinha e uma tira de pimentão
    [[-9,-4.6],[-8,1.2]].forEach(r => { rr(ctx,r[0],r[1],8.4,4.8,1.2); fs(ctx,'#EBCB6A',1.4); ctx.strokeStyle = 'rgba(120,70,10,.55)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(r[0] + 2,r[1] + 0.6); ctx.lineTo(r[0] + 3.4,r[1] + 4.2); ctx.moveTo(r[0] + 5,r[1] + 0.6); ctx.lineTo(r[0] + 6.4,r[1] + 4.2); ctx.stroke(); });
    circ(ctx,4,-4,2.5); fs(ctx,'#7FB045',1.1); circ(ctx,4,-4,1.5); ctx.fillStyle = '#D6E6A0'; ctx.fill();
    circ(ctx,8,-1.2,2.3); fs(ctx,'#7FB045',1.1); circ(ctx,8,-1.2,1.3); ctx.fillStyle = '#D6E6A0'; ctx.fill();
    rr(ctx,1.2,2.2,8,2.2,1.1); fs(ctx,'#C8302B',1.1); ctx.strokeStyle = 'rgba(60,10,0,.6)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(3.4,2.4); ctx.lineTo(4,4.2); ctx.moveTo(6.4,2.4); ctx.lineTo(7,4.2); ctx.stroke();
    ervas = [5,6];
  } else if (k === 'curry'){   // cumbuca branca funda com curry e grãos-de-bico, e uma montanha de arroz
    ell(ctx,-2.6,0.6,7.8,6.4); fs(ctx,'#FFFFFF',1.6); ell(ctx,-2.6,-0.4,6.2,4.4); ctx.fillStyle = '#D99A3A'; ctx.fill();
    [[-5.6,-1.6],[-2.2,-2.6],[1,-0.8],[-4.4,1.4],[-0.6,1.6],[-3,-0.2]].forEach(b => { circ(ctx,b[0],b[1],1.2); fs(ctx,'#E8D2A0',0.8); ctx.strokeStyle = 'rgba(120,80,20,.6)'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(b[0] - 0.6,b[1]); ctx.lineTo(b[0] + 0.6,b[1] - 0.2); ctx.stroke(); });
    ctx.fillStyle = '#3E9B5A'; for (const d of [[-1.4,-3.6],[1.4,2],[-6.4,0.6]]){ circ(ctx,d[0],d[1],0.7); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(5.8,5); ctx.quadraticCurveTo(8.2,-3.4,10.6,5); ctx.closePath(); fs(ctx,'#FFFFFF',1.3);
    ctx.strokeStyle = '#D9D4C4'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(7.4,3.6); ctx.lineTo(8.2,2); ctx.moveTo(9,3.6); ctx.lineTo(8.6,2.2); ctx.stroke();
  } else if (k === 'moquecaPalmito'){   // a panela de barro preta com o caldo laranja, quatro rodelas de palmito, pimentão e coentro
    rr(ctx,-10.4,-1.2,3.6,2.4,1.1); fs(ctx,'#2E2A28',1.1); rr(ctx,6.8,-1.2,3.6,2.4,1.1); fs(ctx,'#2E2A28',1.1);
    circ(ctx,0,0.4,7.8); fs(ctx,'#2E2A28',1.6); circ(ctx,0,0.2,5.9); ctx.fillStyle = '#E5822E'; ctx.fill();
    [[-2.8,-1.6],[2.4,-2.4],[-1.4,2.2],[3.2,1.4]].forEach(p => { circ(ctx,p[0],p[1],1.9); fs(ctx,'#F5EBC8',0.9); circ(ctx,p[0],p[1],0.7); ctx.fillStyle = '#E8D9A0'; ctx.fill(); });
    rr(ctx,-0.8,-0.4,2,1.6,0.6); ctx.fillStyle = '#C8302B'; ctx.fill();
    ctx.fillStyle = '#3E9B5A'; for (const d of [[-4.4,0.6],[0.4,-4],[4.6,-0.2]]){ circ(ctx,d[0],d[1],0.7); ctx.fill(); }
  } else ok = false;
  if (!ok) return false;
  if (pr && pr.veg) drawVegSelo(ctx, pr.vegano);
  if (av && !(pr && pr.semAv)){
    if (cat === 'pf') avErvas(ctx,ervas[0],ervas[1]);
    else drawAvDetalhe(ctx,cat,dx,dy);
  }
  return true;
}
function drawComida(ctx,k,carne,av){
  const pr = CARDAPIO[k], cat = pr ? pr.cat : 'chapa', cor = pr ? pr.cor : '#D9A25B';
  if (av === undefined || av === null) av = pratoAv(k, COMIDA_CURSOS, COMIDA_PONTO) && !(pr && pr.semAv);
  const kk = DESENHO_BASE[k] || k;   // os pratos veganos e vegetarianos reusam o desenho do prato com carne
  let dx = 0, dy = 0;   // onde fica o detalhe do avançado
  if (pr && pr.fino){ drawFino(ctx,k,av); return; }   // v10.2
  if (pr && pr.cat === 'junina'){ drawJunino(ctx,k); return; }   // v10.6
  if (drawEstrada(ctx,k,av)) return;   // v12.10.1
  if (drawAvenida(ctx,k,av)) return;   // v12.8
  if (drawTerraco(ctx,k,av)) return;   // v12.8.1
  if (kk === 'parmegiana'){   // v9.1: filé empanado com molho vermelho e queijo gratinado, arroz e batata frita
    ell(ctx,-7,-1.5,5.3,4); fs(ctx,'#FFF6DA',1.6);
    ctx.fillStyle = '#F2C94C'; ctx.strokeStyle = '#B58A1B'; ctx.lineWidth = 0.8;
    [[-3.5,-6.5,-0.5],[0,-7.5,-0.2],[3.5,-7,0.2],[6.5,-6,0.5]].forEach(f => { ctx.save(); ctx.translate(f[0],f[1]); ctx.rotate(f[2]); ctx.fillRect(-0.9,-3.5,1.8,7); ctx.restore(); });   // palitos de batata
    rr(ctx,-4,-0.5,17,10,4.5); fs(ctx,'#D49A45',1.8);   // o empanado dourado
    ctx.beginPath(); ctx.moveTo(-2,2); ctx.quadraticCurveTo(4,-0.5,10.5,1.2); ctx.quadraticCurveTo(12.2,5,9,7.2); ctx.quadraticCurveTo(3,8.4,-2,6.2); ctx.closePath(); ctx.fillStyle = '#C23B22'; ctx.fill();   // o molho
    ctx.fillStyle = '#F7E08E'; ell(ctx,3,3.5,4.6,2.4); ctx.fill(); ell(ctx,8.2,4.6,3.2,1.9); ctx.fill();   // o queijo derretido
    ctx.fillStyle = 'rgba(190,120,30,.6)'; circ(ctx,2,3.2,0.9); ctx.fill(); circ(ctx,7.5,4.8,0.8); ctx.fill();   // gratinado
    if (av){ ctx.fillStyle = '#3E9B5A'; ell(ctx,-1,0.8,2.3,1.2); ctx.fill(); ell(ctx,10,0.6,2.1,1.1); ctx.fill(); }   // manjericão (Parmegiana da casa)
    return;
  }
  if (cat === 'pf'){
    ell(ctx,-5,-1,5.5,4.2); fs(ctx,'#FFF6DA',1.6);
    ell(ctx,4,-3.5,5,3.4); fs(ctx,'#5B2E1A',1.6);
    if (kk === 'pf') drawCarne(ctx,av ? carne : 'bife');
    else { ctx.fillStyle = '#7A4A2B'; [[-1,3],[2,5],[5,3],[8,5],[3,2]].forEach(g => { circ(ctx,g[0],g[1],1.9); ctx.fill(); }); }   // v8.6.11: a soja refogada, grumos marrons
    if (!(pr && pr.vegano) && !(kk === 'pf' && av && carne === 'cavalo')){ ell(ctx,-7,5,3.4,2.2); fs(ctx,'#fff',1.4); circ(ctx,-7,5,1.2); ctx.fillStyle = '#F5B800'; ctx.fill(); }
    if (pr && pr.veg) drawVegSelo(ctx, pr.vegano);
    return;
  } else if (kk === 'risoles'){
    ctx.beginPath(); ctx.arc(0,3,10.5,Math.PI,0); ctx.closePath(); fs(ctx,cor,2);
    ctx.fillStyle = '#F7C168'; ell(ctx,-3.5,-1.5,2,3); ctx.fill();
    ctx.fillStyle = 'rgba(120,70,20,.5)'; for (const d of [[3,0],[5,2],[1,2.2]]){ circ(ctx,d[0],d[1],0.7); ctx.fill(); }
    dx = 5; dy = -4.5;
  } else if (kk === 'kibe'){
    // o kibe frito: fuso simétrico de pontas bem pontudas, casca áspera (sem risquinhos)
    ctx.beginPath(); ctx.moveTo(-13,0); ctx.bezierCurveTo(-6,-11,6,-11,13,0); ctx.bezierCurveTo(6,11,-6,11,-13,0); ctx.closePath(); ctx.lineJoin = 'miter'; fs(ctx,cor,2); ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(40,20,5,.5)'; for (const d of [[-6,-1.5],[-2,-4],[2,-3],[6,-1],[-6,2],[-1,3.5],[3,3],[7,1.5],[0,0]]){ circ(ctx,d[0],d[1],0.75); ctx.fill(); }
    ctx.fillStyle = 'rgba(240,190,110,.55)'; for (const d of [[-3,0.5],[3,-0.5],[-9,0],[9,0],[0,-6],[0,6]]){ circ(ctx,d[0],d[1],0.55); ctx.fill(); }
    dx = 0; dy = -4.5;
  } else if (kk === 'bolinho'){
    // o bolinho japonês: uma bolinha de massa frita, empanada e áspera, com manchas escuras do recheio
    circ(ctx,0,0,9); fs(ctx,cor,2);
    ctx.fillStyle = 'rgba(70,35,10,.55)'; for (const d of [[-4,-3],[3,-4.5],[5,1],[-1,3.5],[-6,2]]){ ell(ctx,d[0],d[1],1.5,1); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,235,170,.7)'; for (const d of [[-1,-1],[4,3],[-5,-0.5],[1,-5.5]]){ circ(ctx,d[0],d[1],0.6); ctx.fill(); }
    dx = 0; dy = -7.5;
  } else if (kk === 'empada'){
    ctx.beginPath(); ctx.moveTo(-8,-1); ctx.lineTo(8,-1); ctx.lineTo(6,7); ctx.lineTo(-6,7); ctx.closePath(); fs(ctx,'#D9A55B',2);
    ctx.strokeStyle = 'rgba(90,50,20,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-4,1); ctx.lineTo(-3,6); ctx.moveTo(0,1); ctx.lineTo(0,6); ctx.moveTo(4,1); ctx.lineTo(3,6); ctx.stroke();
    ell(ctx,0,-2,9.5,5.5); fs(ctx,cor,2);
    ctx.fillStyle = 'rgba(90,50,20,.6)'; circ(ctx,0,-2,1); ctx.fill();
    dx = -3.5; dy = -3.5;
  } else if (kk === 'esfihaA'){
    // a esfiha aberta: borda de massa dourada e, por cima da massa clara, montinhos de carne moída com tomate e cebola, deixando a massa aparecer
    circ(ctx,0,0,10.5); fs(ctx,'#DDA054',2);
    circ(ctx,0,0,6.6); ctx.fillStyle = '#F3D9A0'; ctx.fill();
    ctx.fillStyle = '#7E4B2F'; for (let i=0;i<20;i++){ const r = 5.3*Math.sqrt((i+0.5)/20), a = i*2.39996; ctx.beginPath(); ctx.ellipse(Math.cos(a)*r,Math.sin(a)*r,1.32,0.95,a*1.7,0,TAU); ctx.fill(); }   // 20 pedacinhos de carne moída que se tocam, cobrindo mais da metade da massa
    for (const g of [-160,-138,-116,-94,-72,-50,-28,-6,176,18,36,54,72,90,108,126,144,162]){ const a = g*Math.PI/180; ctx.beginPath(); ctx.ellipse(Math.cos(a)*5.7,Math.sin(a)*5.7,1.3,0.95,a+1.57,0,TAU); ctx.fill(); }   // mais pedacinhos encostados na borda, em arco por cima e por baixo
    ctx.fillStyle = '#C8452B'; for (const d of [[-1.2,-1.8],[3.4,2.6],[-3.2,4]]){ rr(ctx,d[0]-1,d[1]-0.7,2.1,1.4,0.5); ctx.fill(); }
    ctx.fillStyle = '#FFF4D6'; for (const d of [[-0.5,-5],[-5.4,-0.8],[5.2,-2.6]]){ circ(ctx,d[0],d[1],0.9); ctx.fill(); }
    dx = 0; dy = 0;
  } else if (kk === 'esfihaF'){
    ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(10.5,7); ctx.lineTo(-10.5,7); ctx.closePath(); ctx.lineJoin = 'round'; fs(ctx,cor,2);
    ctx.strokeStyle = 'rgba(90,50,20,.5)'; ctx.lineWidth = 1.1; ctx.beginPath();
    ctx.moveTo(0,-5); ctx.lineTo(0,1); ctx.moveTo(-5,4); ctx.lineTo(0,1); ctx.moveTo(5,4); ctx.lineTo(0,1); ctx.stroke();
    dx = 0; dy = 4;
  } else if (kk === 'bauru'){
    rr(ctx,-12,2,24,5.5,2.5); fs(ctx,cor,2);
    ctx.beginPath(); ctx.moveTo(-11,2);
    for (let x=-11;x<=11;x+=2.75){ ctx.quadraticCurveTo(x+1.4,4.6,x+2.75,2); } ctx.closePath(); fs(ctx,'#6FAE3E',1.3);
    rr(ctx,-10.5,-2.2,21,4,1.8); fs(ctx,'#B04A3E',1.4);
    ctx.fillStyle = '#FFF6DA'; for (const x of [-6,0,6]){ circ(ctx,x,-0.2,0.8); ctx.fill(); }
    rr(ctx,-12,-9,24,7,3.5); fs(ctx,cor,2);
    ctx.fillStyle = 'rgba(255,230,160,.6)'; ell(ctx,-4,-6.5,4,1.2); ctx.fill();
    dx = 0; dy = -2.5;
  } else if (kk === 'paoChapa'){
    ell(ctx,0,0,12.5,6.2); fs(ctx,cor,2);
    ctx.strokeStyle = 'rgba(120,70,20,.5)'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(-4,-3.5); ctx.lineTo(-1,0.5); ctx.moveTo(1,-4); ctx.lineTo(4,0); ctx.stroke();
    rr(ctx,-9,0,18,3.2,1.6); fs(ctx,'#F6D44A',1.3);
    dx = 0; dy = 0;
  } else if (k === 'pastelQ' || k === 'pastelP' || cat === 'pastel'){
    // o pastel: retângulo de massa frita e bolhosa, de cantos quase retos
    rr(ctx,-12,-7,24,14,2.2); fs(ctx,cor,2);
    ctx.fillStyle = '#F4C874'; rr(ctx,-9.5,-5,12,3,1.2); ctx.fill();
    ctx.fillStyle = 'rgba(150,90,20,.45)'; for (const d of [[-7,2],[-2,3.5],[4,2.5],[8,-2],[1,-3],[-8,-0.5],[7,4.5]]){ circ(ctx,d[0],d[1],0.9); ctx.fill(); }
    if (k === 'pastelQ'){
      ctx.strokeStyle = '#F6D44A'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(8,-1); ctx.quadraticCurveTo(12,-3,13,-7); ctx.stroke(); ctx.lineCap = 'butt';
    } else if (k === 'pastelP'){
      ctx.fillStyle = '#C8302B'; circ(ctx,4,-1.5,1.7); ctx.fill(); ctx.fillStyle = '#5E9B3A'; circ(ctx,6.6,1,0.8); ctx.fill();
    }
  } else if (cat === 'frito'){
    ctx.beginPath(); ctx.moveTo(0,-10);
    ctx.bezierCurveTo(11,-5, 10,5, 3,8); ctx.lineTo(-3,8);
    ctx.bezierCurveTo(-10,5, -11,-5, 0,-10); ctx.closePath(); fs(ctx,cor,2);
    ctx.fillStyle = '#F7C168'; ell(ctx,-3,-2,2.2,3.6); ctx.fill();
    dx = 0; dy = -8;
  } else if (cat === 'assado'){
    circ(ctx,0,0,9.5); fs(ctx,cor,2);
  } else { // misto quente: duas metades de pão tostado empilhadas, com presunto e queijo à mostra
    rr(ctx,-11,0.5,22,6.5,2.2); fs(ctx,cor,2);
    ctx.fillStyle = '#E58C8C'; ctx.fillRect(-9.5,1.4,19,1.6);
    ctx.fillStyle = '#F6D44A'; ctx.fillRect(-9.5,3,19,2.2); ell(ctx,6,6,2.2,1.6); ctx.fill();
    rr(ctx,-9,-7.5,22,6.5,2.2); fs(ctx,cor,2);
    ctx.fillStyle = '#E58C8C'; ctx.fillRect(-7.5,-6.6,19,1.6);
    ctx.fillStyle = '#F6D44A'; ctx.fillRect(-7.5,-5,19,2.2);
    dx = 0; dy = 0;
  }
  if (pr && pr.veg) drawVegSelo(ctx, pr.vegano);
  if (!av) return;
  drawAvDetalhe(ctx,cat,dx,dy);
}
/* o detalhe do curso avançado (v8.6.10): um por curso; (dx, dy) é onde fica no desenho (v12.8: função à parte, a drawAvenida também usa) */
function drawAvDetalhe(ctx,cat,dx,dy){
  if (cat === 'frito'){ circ(ctx,dx,dy,1.9); fs(ctx,'#FFFDF4',1.1); }                                  // fritos: a pontinha de catupiry
  else if (cat === 'assado'){ circ(ctx,dx,dy,2.3); fs(ctx,'#2B2B2B',1); ctx.fillStyle = '#9A9A9A'; circ(ctx,dx,dy,0.7); ctx.fill(); }   // assados: a azeitona
  else if (cat === 'chapa'){                                                                           // chapa: as listras da grelha
    ctx.strokeStyle = 'rgba(50,25,8,.6)'; ctx.lineWidth = 1.3; ctx.beginPath();
    for (const x of [-6,-2,2,6]){ ctx.moveTo(x-1.6,dy-3.4); ctx.lineTo(x+1.6,dy+3.4); } ctx.stroke();
  } else if (cat === 'pastel'){                                                                        // pastel: as bolhinhas da massa de feira
    ctx.fillStyle = 'rgba(255,240,200,.85)'; ctx.strokeStyle = '#B97A1E'; ctx.lineWidth = 0.7;
    for (const d of [[-3,2],[3,-3],[6,2],[-6,-2]]){ circ(ctx,d[0],d[1],1.3); ctx.fill(); ctx.stroke(); }
  }
}
/* o selo dos pratos sem carne (v8.6.11): um "v" verde nos vegetarianos e uma folhinha nos veganos, no canto do prato */
function drawVegSelo(ctx,vegano){
  ctx.save(); ctx.translate(9,-7);
  if (vegano){
    ctx.beginPath(); ctx.moveTo(-4,3); ctx.quadraticCurveTo(-4,-4,4,-4); ctx.quadraticCurveTo(4,4,-4,3); ctx.closePath(); fs(ctx,'#3E9B5A',1.6);
    ctx.strokeStyle = '#E9F5E4'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-3,2.5); ctx.lineTo(2,-2); ctx.stroke();
  } else {
    circ(ctx,0,0,5.2); fs(ctx,'#FFFFFF',1.6);
    ctx.strokeStyle = '#2E8B3E'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-2.6,-2); ctx.lineTo(0,2.6); ctx.lineTo(2.6,-2); ctx.stroke(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  }
  ctx.restore();
}

/* torneira de parede (v7.7, a água da espera da Garagem): cano, registro de borboleta e bica; (x, y) é a ponta da bica */
function drawTorneira(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); if (s) ctx.scale(s,s);
  rr(ctx,-30,-15,20,6,2); fs(ctx,PAL.cromoEsc,1.8);
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-6,-12); ctx.quadraticCurveTo(0,-12,0,-3); ctx.stroke();
  ctx.strokeStyle = PAL.cromo; ctx.lineWidth = 3.6; ctx.stroke(); ctx.lineCap = 'butt';
  rr(ctx,-13,-18,11,11,3); fs(ctx,PAL.cromo,1.8);
  ctx.fillStyle = PAL.cromoEsc; ctx.fillRect(-8.5,-23,2,5);
  rr(ctx,-14,-26,13,4,2); fs(ctx,PAL.cromo,1.4);
  ctx.restore();
}
/* ---------- ícones (HUD / mãos) ---------- */
function drawIcon(ctx,k,x,y,s,extra,extra2,extra3){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  if (k === 'ticket'){
    const tc = (typeof extra === 'string' && extra.charAt(0) === '#') ? extra : null;
    rr(ctx,-8,-11,16,22,2); fs(ctx,'#FFFBEA',2);
    ctx.strokeStyle = tc || PAL.perigo; ctx.lineWidth = 1.6;
    for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-4,-3+i*5); ctx.lineTo(4,-3+i*5); ctx.stroke(); }
    ctx.fillStyle = tc || PAL.faixa; ctx.fillRect(-8,-11,16,tc ? 6 : 3);
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.2; ctx.strokeRect(-8,-11,16,tc ? 6 : 3);
  } else if (k === 'dish'){
    if (extra2) drawTray(ctx,0,2,1,extra2);
    drawDish(ctx,extra||'pf',0,2,0.95,false,extra3);
  } else if (k === 'marmita'){
    drawMarmita(ctx,extra||'pf',0,1,0.95);
  } else if (k === 'coffee'){
    ell(ctx,0,7,11,3.5); fs(ctx,'#fff',2);
    rr(ctx,-7,-5,14,12,3); fs(ctx,'#fff',2);
    ctx.beginPath(); ctx.arc(8,0.5,4,-1.2,1.3); ctx.lineWidth = 2.4; ctx.strokeStyle = PAL.tinta; ctx.stroke();
    ctx.fillStyle = '#5B2E1A'; ctx.fillRect(-5.5,-3.5,11,3);
    ctx.strokeStyle = 'rgba(34,32,28,.45)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-2,-8); ctx.quadraticCurveTo(-5,-11,-2,-14); ctx.moveTo(3,-8); ctx.quadraticCurveTo(0,-11,3,-14); ctx.stroke();
  } else if (k === 'juice'){
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2,-9); ctx.lineTo(6,-16); ctx.lineTo(9,-16); ctx.stroke();
    ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(2,-9); ctx.lineTo(6,-16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-7,-10); ctx.lineTo(7,-10); ctx.lineTo(5,11); ctx.lineTo(-5,11); ctx.closePath(); fs(ctx,'rgba(255,255,255,.85)',2);
    ctx.beginPath(); ctx.moveTo(-6.2,-4); ctx.lineTo(6.2,-4); ctx.lineTo(4.6,9.5); ctx.lineTo(-4.6,9.5); ctx.closePath(); ctx.fillStyle = '#F39A1E'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-4.5,-2,2,9);
    circ(ctx,-6,-10,3.2); fs(ctx,'#F6C343',1.4);
  } else if (k === 'doce'){
    // v9.2, doce da geladeirinha: potinho de vidro com tampa; extra = o índice em DOCES.caseira (0 bolo de pote, 1 brigadeiro de colher, 2 pudim)
    const di = extra === 0 || extra === 2 ? extra : 1;
    if (extra >= 6){
      // v10.2, a alta confeitaria do Terraço, no pratinho: 6 entremet de chocolate, 7 mil-folhas, 8 macarons
      ell(ctx,0,9.5,11,3.2); fs(ctx,'#fff',1.6);
      if (extra === 6){
        ctx.beginPath(); ctx.moveTo(-7,8); ctx.lineTo(7,8); ctx.lineTo(7,-1); ctx.quadraticCurveTo(0,-8,-7,-1); ctx.closePath(); fs(ctx,'#4A2A1C',1.4);
        ctx.fillStyle = '#7A4A32'; ctx.fillRect(-7,2.2,14,1.8); ctx.fillStyle = '#F3D9B0'; ctx.fillRect(-7,5.4,14,1.4);
        ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-5.4,-3,1.6,8);
        ctx.fillStyle = '#E2B94A'; ctx.save(); ctx.translate(2,-4.4); ctx.rotate(0.7); ctx.fillRect(-1.6,-1.6,3.2,3.2); ctx.restore();
      } else if (extra === 7){
        [[0,'#E5B96A'],[3.6,'#F6E7B8'],[7.2,'#E5B96A']].forEach(l => { rr(ctx,-8,l[0] - 3.4,16,3.2,1.2); fs(ctx,l[1],1.2); });
        rr(ctx,-8,-5.4,16,3.2,1.2); fs(ctx,'#fff',1.2); ctx.fillStyle = '#E5B96A'; ctx.fillRect(-6,-4.6,12,0.8);
        ctx.fillStyle = '#C93A54'; circ(ctx,-3,-7,1.4); ctx.fill(); circ(ctx,2,-7.4,1.4); ctx.fill();
      } else {
        [[-5.6,2,'#E58AA8'],[0,-0.6,'#9ED28A'],[5.6,2.4,'#F1C65A']].forEach(m => { rr(ctx,m[0] - 4.6,m[1] - 2.8,9.2,5.6,2.8); fs(ctx,m[2],1.3); ctx.fillStyle = '#FFF3E4'; ctx.fillRect(m[0] - 4.2,m[1] - 0.4,8.4,1.1); });
      }
      ctx.restore(); return;
    }
    if (extra >= 3){      // v9.3, doces gourmet da vitrine, no pratinho: 3 shortcake de morango, 4 torta de limão, 5 brigadeiro gourmet
      ell(ctx,0,9.5,11,3.2); fs(ctx,'#fff',1.6);
      if (extra === 3){
        rr(ctx,-6.5,-1,13,9.5,2); fs(ctx,'#F4D79E',1.4);
        ctx.fillStyle = '#fff'; ctx.fillRect(-6.5,2.6,13,2.2); ctx.fillStyle = '#FFF2F4'; ctx.fillRect(-7,-2.6,14,2.6);
        circ(ctx,0,-4.6,3.2); fs(ctx,'#D8334A',1.2); ctx.fillStyle = '#4C9A3A'; ctx.fillRect(-1.4,-8,2.8,1.8);
      } else if (extra === 4){
        ctx.beginPath(); ctx.moveTo(-8,8); ctx.lineTo(8,8); ctx.lineTo(5,-3); ctx.lineTo(-5,-3); ctx.closePath(); fs(ctx,'#E3B772',1.4);
        ctx.fillStyle = '#F2DD4E'; ctx.beginPath(); ctx.moveTo(-6.6,5); ctx.lineTo(6.6,5); ctx.lineTo(5.3,-1); ctx.lineTo(-5.3,-1); ctx.closePath(); ctx.fill();
        [[-3.5,-3],[0,-5],[3.5,-3]].forEach(q => { circ(ctx,q[0],q[1],2.6); fs(ctx,'#fff',1); });
        ctx.fillStyle = '#4C9A3A'; ctx.fillRect(-1,-9,2,2.6);
      } else {
        ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(8,0); ctx.lineTo(6,9); ctx.lineTo(-6,9); ctx.closePath(); fs(ctx,'#E0B64A',1.4);
        circ(ctx,-3.2,-2,4.4); fs(ctx,'#4A2A1C',1.2); circ(ctx,3.4,-2.4,4.4); fs(ctx,'#4A2A1C',1.2);
        ctx.fillStyle = '#F3D56B'; [[-4.6,-3.4],[-2,-1.4],[2,-4],[4.8,-1]].forEach(q => ctx.fillRect(q[0],q[1],1.4,1.4));
      }
      ctx.restore(); return;
    }
    ell(ctx,0,10,9,2.6); fs(ctx,'rgba(255,255,255,.7)',1.4);
    ctx.beginPath(); ctx.moveTo(-8,-6); ctx.lineTo(8,-6); ctx.lineTo(7,10); ctx.lineTo(-7,10); ctx.closePath(); fs(ctx,'rgba(255,255,255,.88)',2);
    if (di === 1){ ctx.fillStyle = '#5A3425'; ctx.beginPath(); ctx.moveTo(-6.4,-2); ctx.lineTo(6.4,-2); ctx.lineTo(5.8,8.8); ctx.lineTo(-5.8,8.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#F3C94B'; [[-3,0],[1,-0.5],[3.5,1.5],[-1,2.5]].forEach(q => ctx.fillRect(q[0],q[1] - 1,1.6,1.6)); }   // brigadeiro com granulado
    else if (di === 2){ ctx.fillStyle = '#F2B83A'; ctx.beginPath(); ctx.moveTo(-6.4,-2); ctx.lineTo(6.4,-2); ctx.lineTo(5.8,8.8); ctx.lineTo(-5.8,8.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8A4B1E'; ctx.fillRect(-6.4,-2,12.8,3); }   // pudim com a calda de caramelo
    else { ctx.fillStyle = '#E9B8CB'; ctx.fillRect(-6,3,12,5.8); ctx.fillStyle = '#FFF7E3'; ctx.fillRect(-6.4,-2,12.8,4.6); circ(ctx,0,-3.6,2.4); fs(ctx,'#D8334A',1); }   // bolo de pote: massa, creme e uma cereja
    rr(ctx,-8.6,-9,17.2,4,1.8); fs(ctx,'#D8334A',1.6);   // a tampinha
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-5,-4,1.8,11);
  } else if (k === 'drink'){
    // v9.5, drinks do Anselmo (extra = índice em DRINKS.itens): 0 Pôr do Sol da Avenida (laranja e vermelho em degradê), 1 Brisa de Maracujá (amarelo com hortelã), 2 Esmeralda (verde com rodela de limão)
    const di = extra || 0;
    ell(ctx,0,10,9,2.6); fs(ctx,'rgba(255,255,255,.75)',1.4);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-8,-9); ctx.lineTo(8,-9); ctx.lineTo(2.6,9); ctx.lineTo(-2.6,9); ctx.closePath(); ctx.clip();
    if (di === 0){ const gr = ctx.createLinearGradient(0,-9,0,9); gr.addColorStop(0,'#F6A21E'); gr.addColorStop(1,'#D8334A'); ctx.fillStyle = gr; }
    else ctx.fillStyle = ['#F4D13A', '#3BB273', '#BFE3F2', '#F08AA8', '#E2A92B'][di - 1] || '#3BB273';   // v10.3: 3 Neblina da Serra (branco-azulado), 4 Jardim do Terraço (rosa), 5 Ouro da Casa (dourado)
    ctx.fillRect(-9,-5,18,15); ctx.restore();
    ctx.beginPath(); ctx.moveTo(-8,-9); ctx.lineTo(8,-9); ctx.lineTo(2.6,9); ctx.lineTo(-2.6,9); ctx.closePath(); fs(ctx,'rgba(255,255,255,.28)',1.8);
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-5.6,-7,1.6,9);
    if (di === 1){ ctx.fillStyle = '#2F9E5A'; ctx.beginPath(); ctx.ellipse(-2,-11,3.2,1.8,-0.6,0,TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(2.4,-11.6,3.2,1.8,0.6,0,TAU); ctx.fill(); }
    if (di === 3 && !RM){ ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-3,-9); ctx.quadraticCurveTo(-7,-13,-3,-17); ctx.moveTo(2,-9); ctx.quadraticCurveTo(-1,-13,3,-17); ctx.stroke(); }   // v10.3: a fumacinha
    if (di === 3 && RM){ ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-1,-9); ctx.lineTo(-1,-15); ctx.stroke(); }
    if (di === 4){ circ(ctx,6,-10,3.4); fs(ctx,'#fff',1); circ(ctx,6,-10,1.3); fs(ctx,'#F4C230',0.6); [[6,-14],[10,-10],[6,-6],[2,-10]].forEach(p => { circ(ctx,p[0],p[1],1.6); fs(ctx,'#fff',0.8); }); }   // a flor
    if (di === 5){ ctx.strokeStyle = '#F28A1E'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(5,-9); ctx.quadraticCurveTo(9,-14,6,-18); ctx.moveTo(8,-8); ctx.quadraticCurveTo(12,-12,11,-16); ctx.stroke(); }   // a raspa de laranja
    if (di === 2){ circ(ctx,8,-8,4.2); fs(ctx,'#B7E34A',1.3); ctx.strokeStyle = '#F4FAD0'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(8,-12); ctx.lineTo(8,-4); ctx.moveTo(4,-8); ctx.lineTo(12,-8); ctx.stroke(); }
    if (di === 0){ ctx.strokeStyle = PAL.perigo; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(3,-8); ctx.lineTo(6,-15); ctx.stroke(); }
  } else if (k === 'cafeesp'){
    // v9.3, cafés da máquina de espresso: 0 espresso (xicrinha com creminha), 1 cappuccino (xícara maior com espuma e coração)
    const cap = extra === 1;
    ell(ctx,0,9,12,3.4); fs(ctx,'#fff',1.8);
    if (extra === 2){   // v10.3, coado: xícara com o funil de filtro no topo e o café pingando
      ctx.beginPath(); ctx.moveTo(-6.5,0); ctx.lineTo(6.5,0); ctx.lineTo(5,8); ctx.lineTo(-5,8); ctx.closePath(); fs(ctx,'#fff',2);
      ctx.beginPath(); ctx.moveTo(-8,-9); ctx.lineTo(8,-9); ctx.lineTo(3,-1); ctx.lineTo(-3,-1); ctx.closePath(); fs(ctx,'#F2E3C4',1.8);
      ell(ctx,0,-9,8,1.8); fs(ctx,'#5B3418',1.2); ctx.fillStyle = '#5B3418'; ctx.fillRect(-0.8,-1,1.6,3.5);
    } else if (extra === 3){   // prensa francesa: jarra de vidro com o êmbolo
      rr(ctx,-6,-8,12,16,2.5); fs(ctx,'rgba(255,255,255,.75)',2); ctx.fillStyle = '#6B3E1E'; ctx.fillRect(-4.6,-2,9.2,8.6);
      ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(0,-15); ctx.stroke(); circ(ctx,0,-15.5,2.4); fs(ctx,PAL.tinta,1);
      ctx.beginPath(); ctx.arc(8.5,0,3.4,-1.3,1.3); ctx.lineWidth = 2; ctx.stroke();
    } else if (extra === 4){   // cold brew: jarra alta com café escuro, gelo e a rodela de laranja
      rr(ctx,-6.5,-11,13,20,3); fs(ctx,'rgba(214,236,244,.8)',2); ctx.fillStyle = '#3A2012'; ctx.fillRect(-5.2,-5,10.4,13);
      [[-2.5,-3],[2.5,-1]].forEach(p => { rr(ctx,p[0]-2.2,p[1]-2.2,4.4,4.4,1); fs(ctx,'rgba(255,255,255,.85)',1); });
      ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(1,-6); ctx.lineTo(5,-15); ctx.stroke();
    } else if (cap){
      ctx.beginPath(); ctx.moveTo(-9,-4); ctx.lineTo(9,-4); ctx.lineTo(7,8); ctx.lineTo(-7,8); ctx.closePath(); fs(ctx,'#fff',2);
      ctx.beginPath(); ctx.arc(10,1.5,4,-1.3,1.4); ctx.lineWidth = 2.2; ctx.strokeStyle = PAL.tinta; ctx.stroke();
      ell(ctx,0,-4,8.6,2.6); fs(ctx,'#C98A55',1.2); ell(ctx,0,-4.4,6,1.7); fs(ctx,'#FFF3DC',0.8);
      ctx.fillStyle = '#7A4527'; ctx.beginPath(); ctx.moveTo(0,-3.2); ctx.bezierCurveTo(-2.6,-5.4,-1,-6.2,0,-5); ctx.bezierCurveTo(1,-6.2,2.6,-5.4,0,-3.2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(-6.5,-2); ctx.lineTo(6.5,-2); ctx.lineTo(5,8); ctx.lineTo(-5,8); ctx.closePath(); fs(ctx,'#fff',2);
      ctx.beginPath(); ctx.arc(8,3,3.2,-1.3,1.4); ctx.lineWidth = 2; ctx.strokeStyle = PAL.tinta; ctx.stroke();
      ell(ctx,0,-2,6,2); fs(ctx,'#3A1F12',1.2); ell(ctx,0,-2.3,3.8,1.1); fs(ctx,'#C98A55',0.6);
    }
    ctx.strokeStyle = 'rgba(34,32,28,.4)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-2,-8); ctx.quadraticCurveTo(-4.5,-11,-2,-14); ctx.moveTo(2.5,-8); ctx.quadraticCurveTo(0,-11,2.5,-14); ctx.stroke();
  } else if (k === 'saborizada'){
    // v9.1, água saborizada: copo alto com a água na cor do sabor (extra: o índice em SABORES), canudo e a fruta ou a folha na borda
    const sb = SABORES[extra] || SABORES[0];
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2,-8); ctx.lineTo(6,-17); ctx.lineTo(9,-17); ctx.stroke();
    ctx.strokeStyle = sb.cor; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(2,-8); ctx.lineTo(6,-17); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-7,-10); ctx.lineTo(7,-10); ctx.lineTo(5,11); ctx.lineTo(-5,11); ctx.closePath(); fs(ctx,'rgba(255,255,255,.85)',2);
    ctx.beginPath(); ctx.moveTo(-6.3,-5); ctx.lineTo(6.3,-5); ctx.lineTo(4.6,9.5); ctx.lineTo(-4.6,9.5); ctx.closePath(); ctx.fillStyle = sb.cor; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-4.6,-3,1.8,10);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; circ(ctx,1,2,1.2); ctx.fill(); circ(ctx,-1,6,0.9); ctx.fill();   // as bolhinhas
    if (extra === 1){ ctx.beginPath(); ctx.moveTo(-8,-10); ctx.bezierCurveTo(-13,-11,-12,-3,-7,-3); ctx.closePath(); fs(ctx,'#D8334A',1.2); ctx.fillStyle = '#4E9A4A'; ctx.fillRect(-10.5,-12,3,1.8); }   // morango na borda
    else if (extra === 2){ ell(ctx,-9,-12,4.2,2.2); fs(ctx,'#3E9B5A',1.2); ell(ctx,-5.5,-13.5,3.6,1.9); fs(ctx,'#58B26C',1.2); }   // folhas de hortelã
    else { circ(ctx,-8.5,-10,4.4); fs(ctx,'#F2E04A',1.3); ctx.strokeStyle = 'rgba(120,120,20,.55)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-8.5,-14.4); ctx.lineTo(-8.5,-5.6); ctx.moveTo(-12.9,-10); ctx.lineTo(-4.1,-10); ctx.stroke(); }   // rodela de limão
  } else if (k === 'agua'){
    // copo americano com água da torneira (v7.7): a boca lisa em cima e os gomos
    ctx.beginPath(); ctx.moveTo(-7,-10); ctx.lineTo(7,-10); ctx.lineTo(5,11); ctx.lineTo(-5,11); ctx.closePath(); fs(ctx,'rgba(255,255,255,.85)',2);
    ctx.beginPath(); ctx.moveTo(-6.3,-5); ctx.lineTo(6.3,-5); ctx.lineTo(4.6,9.5); ctx.lineTo(-4.6,9.5); ctx.closePath(); ctx.fillStyle = 'rgba(110,184,234,.7)'; ctx.fill();
    ctx.strokeStyle = 'rgba(34,32,28,.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-6.6,-6.5); ctx.lineTo(6.6,-6.5);
    for (const f of [-3,0,3]){ ctx.moveTo(f*1.15,-6.5); ctx.lineTo(f*0.8,10.5); }
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-4.8,-3,1.6,10);
  } else if (k === 'dirty'){
    for (let i=0;i<3;i++){ ell(ctx,0,6-i*5,12,4.2); fs(ctx,i%2?'#f0efe9':'#fff',2); }
    ctx.fillStyle = '#b9772f'; circ(ctx,-3,-5,1.5); ctx.fill();
  } else if (k === 'coin'){
    circ(ctx,0,0,11); fs(ctx,PAL.mostarda,2.2);
    txt(ctx,'$',0,1,15,PAL.tinta,'center',FD);
  } else if (k === 'hat'){
    ctx.beginPath(); ctx.arc(-6,-4,6,0,TAU); ctx.arc(0,-8,7,0,TAU); ctx.arc(6,-4,6,0,TAU); fs(ctx,'#fff',2);
    rr(ctx,-8,-2,16,11,2); fs(ctx,'#fff',2);
    ctx.strokeStyle = '#cfcab9'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(-3,0); ctx.lineTo(-3,8); ctx.moveTo(3,0); ctx.lineTo(3,8); ctx.stroke();
  } else if (k === 'drop'){
    ctx.beginPath(); ctx.moveTo(0,-11); ctx.bezierCurveTo(10,0,9,9,0,10); ctx.bezierCurveTo(-9,9,-10,0,0,-11); ctx.closePath(); fs(ctx,'#6EB8EA',2.2);
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ell(ctx,-3,1,1.8,3.5); ctx.fill();
  } else if (k === 'trash'){
    rr(ctx,-10,-8,20,4,2); fs(ctx,PAL.cromo,1.8);
    ctx.beginPath(); ctx.moveTo(-8,-4); ctx.lineTo(8,-4); ctx.lineTo(6,11); ctx.lineTo(-6,11); ctx.closePath(); fs(ctx,PAL.cromoEsc,2);
    rr(ctx,-3,-11,6,3,1); fs(ctx,PAL.cromoEsc,1.4);
  } else if (k === 'table'){
    rr(ctx,-11,-5,22,12,4); fs(ctx,PAL.formica,2.2);
    ctx.fillStyle = PAL.cromo; ctx.fillRect(-9,7,3,5); ctx.fillRect(6,7,3,5);
  } else if (k === 'menu'){
    rr(ctx,-12,-8,11,16,2); fs(ctx,'#FFFBEA',2); rr(ctx,1,-8,11,16,2); fs(ctx,'#FFFBEA',2);
    ctx.strokeStyle = PAL.faixa; ctx.lineWidth = 1.5;
    for (let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-10,-4+i*4); ctx.lineTo(-3,-4+i*4); ctx.moveTo(3,-4+i*4); ctx.lineTo(10,-4+i*4); ctx.stroke(); }
  }
  ctx.restore();
}

/* ============================================================
   PESSOAS
   ============================================================ */
/* v11.5: as cinco expressões do retrato do balão (docs/ARCO.md §8). EXPR vale só enquanto o drawRetrato desenha; fora dele é 'neutra'
   e o boneco do salão fica exatamente como sempre foi. rostoExpr troca olhos, sobrancelhas e boca (ex: meia distância entre os olhos; ey: altura dos olhos;
   my: altura da boca) e desenha com traço mais grosso, para ler no retrato pequeno. */
let EXPR = 'neutra';
const EXPRESSOES = ['neutra','insegura','firme','alegre','brava'];
function exprDe(e){ return EXPRESSOES.indexOf(e) >= 0 ? e : 'neutra'; }
function rostoExpr(ctx,e,ex,ey,my,bh,halo){
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = PAL.tinta; ctx.fillStyle = PAL.tinta; ctx.lineWidth = 2.1;
  const by = ey - (bh || 4.6);
  const risca = f => { if (halo){ ctx.save(); ctx.strokeStyle = halo; ctx.lineWidth = 4.4; f(); ctx.restore(); } f(); };   // halo: contorno da cor da pele sob a sobrancelha (a Bia, de cabelo escuro)
  const sob = (a,b,c,d) => risca(() => { ctx.beginPath(); ctx.moveTo(a,b); ctx.lineTo(c,d); ctx.stroke(); });
  const ln = (a,b,c,d) => { ctx.beginPath(); ctx.moveTo(a,b); ctx.lineTo(c,d); ctx.stroke(); };
  const olho = (sx,dy,r) => { circ(ctx,sx * ex,ey + dy,r); ctx.fill(); };
  if (e === 'insegura'){   // sobrancelhas "/ \" com a ponta de dentro mais alta, olhar baixo, boca pequena e torta
    sob(-ex-3.4,by+1.8,-ex+3,by-1.4); sob(ex+3.4,by+1.8,ex-3,by-1.4);
    olho(-1,1,1.8); olho(1,1,1.8);
    ctx.beginPath(); ctx.moveTo(-2.6,my+0.7); ctx.quadraticCurveTo(-1.2,my-0.5,0,my+0.4); ctx.quadraticCurveTo(1.2,my+1.3,2.6,my+0.1); ctx.stroke();
  } else if (e === 'firme'){   // sobrancelhas retas e horizontais, olhos de frente, meio sorriso de canto erguido
    sob(-ex-3,by+1.3,-ex+3,by+1.3); sob(ex-3,by+1.3,ex+3,by+1.3);
    olho(-1,0,1.9); olho(1,0,1.9);
    ctx.beginPath(); ctx.moveTo(-2.4,my+0.7); ctx.lineTo(1.6,my+0.7); ctx.quadraticCurveTo(3,my+0.7,3.9,my-0.9); ctx.stroke();
  } else if (e === 'alegre'){   // sobrancelhas arqueadas, olhos em arco, sorriso aberto
    [-1,1].forEach(sx => {
      risca(() => { ctx.beginPath(); ctx.moveTo(sx*ex-3.2,by+0.8); ctx.quadraticCurveTo(sx*ex,by-4.4,sx*ex+3.2,by+0.8); ctx.stroke(); });
      ctx.beginPath(); ctx.arc(sx*ex,ey+1.6,2.4,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(-4.8,my-0.8); ctx.quadraticCurveTo(0,my+0.8,4.8,my-0.8); ctx.quadraticCurveTo(0,my+7.4,-4.8,my-0.8); ctx.closePath();
    ctx.fillStyle = '#7A2E2E'; ctx.fill(); ctx.lineWidth = 1.7; ctx.stroke();
    ctx.fillStyle = 'rgba(226,106,44,.3)'; circ(ctx,-ex-3.4,my-0.4,2.4); ctx.fill(); circ(ctx,ex+3.4,my-0.4,2.4); ctx.fill();
  } else {   // brava: sobrancelhas em V (ponta de dentro mais baixa), olhos um pouco achatados, boca em arco para baixo
    sob(-ex-3.6,by-1.2,-ex+3,by+2.2); sob(ex+3.6,by-1.2,ex-3,by+2.2);
    ctx.beginPath(); ctx.ellipse(-ex,ey+0.4,2.1,1.5,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(ex,ey+0.4,2.1,1.5,0,0,TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0,my+4.4,3.9,Math.PI+0.45,TAU-0.45); ctx.stroke();
  }
  ctx.restore();
}
/* v10: uma florzinha de 5 pétalas (casal: na lapela ou no cabelo) */
function florCasal(ctx,x,y,cor){
  for (let i=0;i<5;i++){ const a = i * TAU / 5; ell(ctx,x + Math.cos(a) * 2.6,y + Math.sin(a) * 2.6,2.2,2.2); ctx.fillStyle = cor || '#F28AA8'; ctx.fill(); }
  circ(ctx,x,y,1.5); fs(ctx,'#F2C94C',0.8);
}
function drawPerson(ctx,p,x,y,o){
  o = o || {};
  const sc = (p.kid ? 0.74 : (p.elder ? 0.95 : 1)) * (o.s || 1);
  const moving = !!o.moving, ph = o.ph || 0, sit = !!o.sit;
  const bob = (moving && !RM) ? -Math.abs(Math.sin(ph)) * 2.4 : (o.bob || 0);
  const mood = o.mood || 0;
  ctx.save();
  ctx.translate(x + (o.dx||0), y);
  ctx.scale(sc, sc);
  if (sit) ctx.translate(0, 12);
  if (!sit && !o.noShadow) shadowEll(ctx,0,0,13,4,0.2);
  const skin = SKINS[p.skin];
  const shirt = p.paleto || p.shirt || o.shirt || '#888';   // v10.10: o paletó bordô do Bráulio   // v9: a turma, o motorista e a encomenda têm roupa própria
  // pernas
  if (!sit){
    const sw = moving ? Math.sin(ph) * 4 : 0;
    ctx.fillStyle = p.pants;
    rr(ctx,-8+sw,-14,7,13,2); fs(ctx,p.pants,2);
    rr(ctx,1-sw,-14,7,13,2); fs(ctx,p.pants,2);
    ell(ctx,-5+sw,-0.5,5,2.6); fs(ctx,'#2c2a26',1.6);
    ell(ctx,5-sw,-0.5,5,2.6); fs(ctx,'#2c2a26',1.6);
  } else if (o.pernas){   // v11.16.1: quem espera na cadeirinha ou no banquinho tem as pernas à frente, paradas (antes do tronco, a saia cobre)
    rr(ctx,-8,-12,7,11,2); fs(ctx,p.pants,2);
    rr(ctx,1,-12,7,11,2); fs(ctx,p.pants,2);
    ell(ctx,-4.5,-0.5,5,2.6); fs(ctx,'#2c2a26',1.6);
    ell(ctx,4.5,-0.5,5,2.6); fs(ctx,'#2c2a26',1.6);
  }
  // acessórios atrás
  if (p.acc === 'backpack'){ rr(ctx,-15,-33+bob,30,19,6); fs(ctx,'#E8A73A',2); }
  if (p.acc === 'helmet'){ rr(ctx,-17,-39+bob,34,27,5); fs(ctx,PAL.mostarda,2); ctx.fillStyle = PAL.perigo; ctx.fillRect(-17,-31+bob,34,4); }
  // cabelo atrás
  const hy = -42 + bob;
  const hc = HAIRC.indexOf(p.hairC) >= 0 ? p.hairC : '#2F1D12';
  if (p.hair === 1){ rr(ctx,-13,hy-8,26,34,9); fs(ctx,hc,2); }
  else if (p.hair === 3){ circ(ctx,0,hy-3,17); fs(ctx,hc,2.2); }
  else if (p.hair === 5){
    for (let i=0;i<7;i++){ const a = Math.PI + i*(Math.PI/6); circ(ctx,Math.cos(a)*11,hy-1+Math.sin(a)*11,6); fs(ctx,hc,2); }
  }
  else if (p.hair === 6){
    rr(ctx,-14,hy-4,5.5,28,3); fs(ctx,hc,1.8); rr(ctx,8.5,hy-4,5.5,28,3); fs(ctx,hc,1.8);
    ctx.fillStyle = PAL.mostarda; circ(ctx,-11,hy+22,2); ctx.fill(); circ(ctx,11,hy+22,2); ctx.fill();
  }
  // tronco
  ctx.beginPath();
  ctx.moveTo(-11,-32+bob); ctx.lineTo(11,-32+bob); ctx.lineTo(13.5,-12); ctx.lineTo(-13.5,-12); ctx.closePath();
  fs(ctx,shirt,2.5);
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(-9,-30+bob,5,16);
  // v9: macacão (zíper e bolso), camisa xadrez ou polo, crachá e o protetor de ouvido no pescoço
  if (p.macacao){ ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0,-31+bob); ctx.lineTo(0,-13); ctx.stroke(); rr(ctx,3,-24+bob,7,6,1); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.stroke(); }
  if (p.vestido){   // v10, casal: vestido (a saia cai sobre as pernas e o cinto marca a cintura)
    ctx.beginPath(); ctx.moveTo(-13.5,-14+bob*0.5); ctx.lineTo(13.5,-14+bob*0.5); ctx.lineTo(18,-3); ctx.quadraticCurveTo(0,0,-18,-3); ctx.closePath(); fs(ctx,shirt,2.3);
    ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(-12,-12,4,8);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-13,-15+bob*0.5,26,2.4);
  }
  if (p.flor === 'lapela' && !o.back) florCasal(ctx,-6,-26+bob,p.florC);   // v10: a flor na lapela
  if (p.camisa === 'xadrez'){ ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1.6; [-6,0,6].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx,-31+bob); ctx.lineTo(dx*1.2,-13); ctx.stroke(); }); [-26,-20,-14].forEach(yy => { ctx.beginPath(); ctx.moveTo(-12,yy+bob); ctx.lineTo(12,yy+bob); ctx.stroke(); }); }
  if (p.camisa === 'polo'){ ctx.beginPath(); ctx.moveTo(-5,-32+bob); ctx.lineTo(0,-26+bob); ctx.lineTo(5,-32+bob); ctx.closePath(); fs(ctx,'#fff',1.4); }
  if (p.blazer){   // v9.1, almoço de negócios: blazer (lapelas e a camisa clara em V), com gravata em alguns, e botões
    ctx.beginPath(); ctx.moveTo(-5.5,-32+bob); ctx.lineTo(0,-19+bob); ctx.lineTo(5.5,-32+bob); ctx.closePath(); fs(ctx,'#F3F1EA',1.3);
    if (p.gravata){ ctx.fillStyle = p.gravata; ctx.beginPath(); ctx.moveTo(0,-30+bob); ctx.lineTo(-1.8,-26+bob); ctx.lineTo(0,-18+bob); ctx.lineTo(1.8,-26+bob); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = 'rgba(0,0,0,.38)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-6.5,-32+bob); ctx.lineTo(-1.2,-18+bob); ctx.moveTo(6.5,-32+bob); ctx.lineTo(1.2,-18+bob); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,.4)'; circ(ctx,-3,-16+bob,1); ctx.fill(); circ(ctx,3,-16+bob,1); ctx.fill();
  }
  if (p.camisa === 'social'){ ctx.beginPath(); ctx.moveTo(-6,-32+bob); ctx.lineTo(0,-24+bob); ctx.lineTo(6,-32+bob); ctx.closePath(); fs(ctx,'#fff',1.3); if (p.gravata){ ctx.fillStyle = p.gravata; ctx.beginPath(); ctx.moveTo(0,-29+bob); ctx.lineTo(-1.6,-25+bob); ctx.lineTo(0,-16+bob); ctx.lineTo(1.6,-25+bob); ctx.closePath(); ctx.fill(); } }
  if (p.fone && !o.back){ ctx.strokeStyle = '#E8A73A'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0,-33+bob,10,0.15,Math.PI-0.15); ctx.stroke(); [-10,10].forEach(dx => { rr(ctx,dx-3.5,-34+bob,7,9,3); fs(ctx,'#5A5A63',1.4); }); }
  if (p.cracha && !o.back){ ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5,-32+bob); ctx.lineTo(-4,-24+bob); ctx.stroke(); rr(ctx,-8,-24+bob,8,10,1.5); fs(ctx,'#fff',1.3); ctx.fillStyle = '#2F5FA8'; ctx.fillRect(-7,-23+bob,6,3); ctx.fillStyle = 'rgba(34,32,28,.5)'; ctx.fillRect(-7,-18+bob,5,1.2); ctx.fillRect(-7,-16+bob,4,1.2); }
  if (p.acc === 'backpack'){ ctx.strokeStyle = '#B9791B'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-7,-31+bob); ctx.lineTo(-8,-14); ctx.moveTo(7,-31+bob); ctx.lineTo(8,-14); ctx.stroke(); }
  // braços
  ctx.lineCap = 'round';
  const armCol = shirt;
  const upY = o.handUp ? -52 + Math.sin((o.t||0)*9) * 4 : -17;
  const lv = o.lava ? Math.sin((o.t||0)*11) : 0;   // lavando: os dois braços vão para a frente (a pia) e balançam
  const bE = o.bracoE || (o.lava ? [[-2,-24-lv*2],[19+lv*4,-24+lv*2]] : [[-15.5,-17]]);
  const rX = o.lava ? 20-lv*4 : 15.5, rY = o.lava ? -24-lv*2 : -17;   // o braço esquerdo pode ir a outro lugar: (cotovelo e) mão, sem contar o ombro
  const bD = o.bracoD || [[o.handUp?16:rX,o.handUp?upY:rY]];   // o direito também (abertura, v8.6.1)
  const mE = bE[bE.length-1], hE = o.bracoE ? 0 : 1.5, mD = bD[bD.length-1], hD = o.bracoD ? 0 : (o.handUp ? -2 : 1.5);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-11,-30+bob); bE.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(11,-30+bob); bD.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  ctx.strokeStyle = armCol; ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.moveTo(-11,-30+bob); bE.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(11,-30+bob); bD.forEach(q => ctx.lineTo(q[0],q[1])); ctx.stroke();
  circ(ctx,mE[0],mE[1] + hE,3.6); fs(ctx,skin,1.8);
  circ(ctx,mD[0],mD[1] + hD,3.6); fs(ctx,skin,1.8);
  if (p.acc === 'chave'){ ctx.strokeStyle = '#B58A1B'; ctx.lineWidth = 1.6; circ(ctx,mD[0] + 3,mD[1] + 8,2.6); ctx.stroke(); ctx.fillStyle = '#D9A21E'; ctx.fillRect(mD[0] + 2.2,mD[1] + 10,1.6,6); ctx.fillRect(mD[0] + 3.8,mD[1] + 13,2.6,1.4); }
  if (p.sacola){ rr(ctx,mE[0] - 8,mE[1] + 1,17,14,3); fs(ctx,'#2F7D86',1.8); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(mE[0] - 8,mE[1] + 6); ctx.lineTo(mE[0] + 9,mE[1] + 6); ctx.stroke(); }
  if (p.acc === 'laptop'){ rr(ctx,-10,-22+bob,20,13,2); fs(ctx,'#9aa5b1',2); ctx.fillStyle = '#d9e4ee'; ctx.fillRect(-7,-20+bob,14,8); }
  if (p.acc === 'pasta'){ rr(ctx,mD[0] - 4,mD[1] + 1,16,11,2); fs(ctx,'#6B4A2B',1.8); ctx.strokeStyle = '#3F2A16'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mD[0] + 1,mD[1] + 1); ctx.lineTo(mD[0] + 1,mD[1] - 2); ctx.lineTo(mD[0] + 7,mD[1] - 2); ctx.lineTo(mD[0] + 7,mD[1] + 1); ctx.stroke(); }   // v9.1
  if (p.acc === 'book'){ rr(ctx,-20,-22,9,12,1.5); fs(ctx,PAL.faixa,1.8); }
  if (p.acc === 'cane'){ ctx.strokeStyle = PAL.madeiraEsc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(21,0); ctx.lineTo(21,-20); ctx.arc(18,-20,3,0,-Math.PI,true); ctx.stroke(); }
  // cabeça
  circ(ctx,-11,hy+1,2.8); fs(ctx,skin,1.6); circ(ctx,11,hy+1,2.8); fs(ctx,skin,1.6);
  circ(ctx,0,hy,11); fs(ctx,skin,2.5);
  if (o.back){   // de costas (sentado na frente da mesa, olhando para ela): nuca coberta, sem rosto
    if (p.acc !== 'helmet'){ circ(ctx,0,hy,11.3); fs(ctx,p.hair === 4 && !p.elder ? skin : hc,2.2); }
    else { ctx.beginPath(); ctx.arc(0,hy-1,12.5,Math.PI,0); ctx.closePath(); fs(ctx,PAL.faixa,2.5); rr(ctx,-13,hy-3,26,3.5,1.5); fs(ctx,'#1b1b1b',1.6); circ(ctx,0,hy+2,9.5); fs(ctx,skin,1.6); }
    if (p.hair === 2){ ctx.save(); if (o.rabo){ ctx.translate(0,hy); ctx.rotate(o.rabo); ctx.translate(0,-hy); } circ(ctx,0,hy-15,6); fs(ctx,hc,2); ctx.restore(); }
    if (p.flor === 'cabelo') florCasal(ctx,8.5,hy - 6,p.florC);   // v10
    if (p.chapeu) acExigente(ctx,p,hy,true);   // v10.1
    ctx.restore();
    return;
  }
  // cabelo frente
  if (p.bone){   // v9: o boné do motorista (cúpula e aba)
    ctx.beginPath(); ctx.arc(0,hy-1,12.4,Math.PI,0); ctx.closePath(); fs(ctx,p.boneC || PAL.perigo,2.4);
    rr(ctx,-13,hy-3.5,26,3.5,1.7); fs(ctx,p.boneC || PAL.perigo,1.8);
  } else if (p.acc === 'helmet'){
    ctx.beginPath(); ctx.arc(0,hy-1,12.5,Math.PI,0); ctx.closePath(); fs(ctx,PAL.faixa,2.5);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ell(ctx,-4,hy-8,3.5,2); ctx.fill();
    rr(ctx,-13,hy-3,26,3.5,1.5); fs(ctx,'#1b1b1b',1.6);
  } else if (p.hair !== 4){
    ctx.beginPath(); ctx.arc(0,hy-1,11.6,Math.PI*1.02,Math.PI*1.98);
    if (p.hair === 0 || p.hair === 2) { ctx.quadraticCurveTo(5,hy-6,-2,hy-7); ctx.quadraticCurveTo(-8,hy-6,-11.5,hy-1); }
    else { ctx.lineTo(8,hy-5); ctx.lineTo(-8,hy-5); }
    ctx.closePath(); fs(ctx,hc,2);
    if (p.hair === 2){ ctx.save(); if (o.rabo){ ctx.translate(0,hy); ctx.rotate(o.rabo); ctx.translate(0,-hy); } circ(ctx,0,hy-15,6); fs(ctx,hc,2); ctx.restore(); }
  } else if (p.elder){
    ctx.strokeStyle = hc; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(0,hy+1,11.5,Math.PI*0.85,Math.PI*1.1); ctx.stroke(); ctx.beginPath(); ctx.arc(0,hy+1,11.5,-Math.PI*0.1,Math.PI*0.15); ctx.stroke();
  }
  if (p.flor === 'cabelo') florCasal(ctx,8.5,hy - 6,p.florC);   // v10, casal: a flor no cabelo
  // rosto (abertura, v8.6.1: olha vira o rosto para o lado em que anda; pisca e fala animam)
  if (o.olha) ctx.translate(o.olha * 2.5,0);
  if (EXPR !== 'neutra') rostoExpr(ctx,EXPR,4.2,hy+0.5,hy+6.4,p.glasses ? 5.6 : 4.6);   // v11.5: o retrato do balão
  else {
  ctx.fillStyle = PAL.tinta;
  if (o.sleepy || o.pisca) { ctx.fillRect(-6,hy,4,1.6); ctx.fillRect(2,hy,4,1.6); }
  else { circ(ctx,-4.2,hy+0.5,1.7); ctx.fill(); circ(ctx,4.2,hy+0.5,1.7); ctx.fill(); }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
  if (o.fala){ ell(ctx,0,hy+5.2,3,1.2 + o.fala * 1.8); fs(ctx,'#7A2E2E',1.5); if (mood === 0){ ctx.fillStyle = 'rgba(226,106,44,.28)'; circ(ctx,-7.5,hy+4,2.4); ctx.fill(); circ(ctx,7.5,hy+4,2.4); ctx.fill(); } }
  else if (mood === 0){ ctx.beginPath(); ctx.arc(0,hy+3.4,4.4,0.2,Math.PI-0.2); ctx.stroke(); ctx.fillStyle = 'rgba(226,106,44,.28)'; circ(ctx,-7.5,hy+4,2.4); ctx.fill(); circ(ctx,7.5,hy+4,2.4); ctx.fill(); }
  else if (mood === 1){ ctx.beginPath(); ctx.moveTo(-3,hy+6.5); ctx.lineTo(3,hy+6.5); ctx.stroke(); }
  else if (mood === 3){   // triste (abertura, v8.5.1): boca para baixo e sobrancelhas erguidas no meio
    ctx.beginPath(); ctx.arc(0,hy+9.5,3.6,Math.PI+0.5,TAU-0.5); ctx.stroke();
    ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-7,hy-3); ctx.lineTo(-2.5,hy-5); ctx.moveTo(7,hy-3); ctx.lineTo(2.5,hy-5); ctx.stroke();
  }
  else {
    ctx.beginPath(); ctx.arc(0,hy+9,4,Math.PI+0.3,TAU-0.3); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-7.5,hy-4.6); ctx.lineTo(-2,hy-2.4); ctx.moveTo(7.5,hy-4.6); ctx.lineTo(2,hy-2.4); ctx.stroke();
  }
  }
  if (p.shades){
    ctx.fillStyle = '#1b1b1b'; ctx.lineWidth = 1.5;
    rr(ctx,-8.6,hy-2.6,7.4,5.6,2.2); ctx.fill(); rr(ctx,1.2,hy-2.6,7.4,5.6,2.2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-1.2,hy-0.6); ctx.lineTo(1.2,hy-0.6); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-7,hy-1.6,2,1.4); ctx.fillRect(2.8,hy-1.6,2,1.4);
  }
  else if (p.glasses){ ctx.lineWidth = 1.5; circ(ctx,-4.4,hy+0.5,3.6); ctx.stroke(); circ(ctx,4.4,hy+0.5,3.6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-0.9,hy+0.5); ctx.lineTo(0.9,hy+0.5); ctx.stroke(); }
  if (p.bigode){   // v10.10: o bigode grande do Bráulio
    ctx.beginPath(); ctx.moveTo(0,hy+4); ctx.quadraticCurveTo(-5,hy+1.4,-11.5,hy+5.4); ctx.quadraticCurveTo(-5.5,hy+8.4,0,hy+6.8); ctx.quadraticCurveTo(5.5,hy+8.4,11.5,hy+5.4); ctx.quadraticCurveTo(5,hy+1.4,0,hy+4); ctx.closePath(); fs(ctx,'#1B1512',1.4);
  }
  if (p.chapeu || p.lenco || p.echarpe) acExigente(ctx,p,hy,false);   // v10.1
  ctx.restore();
}

/* v11.7 (etapa 8g, docs/ARCO.md §10): a roupa da Bia por ponto. roupaBia(g) dá 1 a 4 pelo `nivel` do ponto (o modo dev força por cima, DEV.forca.roupa);
   drawBia(..., { roupa }) escolhe a roupa (sem `roupa`, a 1, a da Garagem: é o que a abertura usa). 1 camiseta e o avental florido da mãe, cabelo solto com o lenço;
   2 avental da casa com "Corre-Corre" bordado, rabo; 3 camisa de botão de mangas dobradas e avental de cintura, rabo alto; 4 colete com a rosa na lapela, camisa clara, coque. */
const BIA_ROUPA_COR = { colete:'#2F3A4A', rosa:'#D9486E', verde:'#2E8B57', camisa:'#1F4FA3', clara:'#FBFAF5', saiaEsc:'#3B4252', avEsc:'#1B1F27', cabelo:'#15100D', florido:'#F7EFD8', folha:'#4F9F6A' };
function roupaBia(g){
  const f = DEV.on ? DEV.forca.roupa : undefined;
  if (typeof f === 'number' && f >= 1 && f <= 4) return f;
  return clamp(Math.round((g && g.ponto && g.ponto.nivel) || 1), 1, 4);
}
/* v11.8 (etapa 8h, docs/ARCO.md §11): o gesto de reação da Bia, por cima do andar. `p` de 0 a 1: sobe em 20%, fica e desce nos últimos 25%; em 0 e em 1 vale 0 (o desenho é o de sempre) */
function reacaoEnv(p){ p = clamp(p, 0, 1); const s = k => k * k * (3 - 2 * k); return p < 0.2 ? s(p / 0.2) : p > 0.75 ? s((1 - p) / 0.25) : 1; }
const REACAO_EXPR = { sorriso:'alegre', punho:'alegre', cabeca:'insegura', respira:'firme', cintura:'firme' };
/* v11.16.1: um tufo de cabelo crespo (o círculo do meio e n em volta). Duas passadas: o contorno de todos e depois o miolo de todos, para não sobrar linha entre as bolinhas */
function puffCrespo(ctx,cx,cy,r,n,cor){   // v11.18: cor (opcional): outra cor de cabelo (a Bia de costas, à noite)
  const cs = [[cx,cy,r*0.62]];
  for (let i=0;i<n;i++){ const a = -Math.PI/2 + i*TAU/n; cs.push([cx + Math.cos(a)*r*0.6, cy + Math.sin(a)*r*0.6, r*0.42]); }
  const trilho = () => { ctx.beginPath(); cs.forEach(c => { ctx.moveTo(c[0] + c[2],c[1]); ctx.arc(c[0],c[1],c[2],0,TAU); }); };
  trilho(); ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 4; ctx.stroke();
  trilho(); ctx.fillStyle = cor || BIA_ROUPA_COR.cabelo; ctx.fill();
}
function drawBia(ctx,b,x,y,o){
  o = o || {};
  const sc = o.s || 1, moving = !!o.moving, ph = o.ph || 0;
  const env = o.reacao ? reacaoEnv(o.reacao.p) : 0, R = env > 0 ? o.reacao.id : '';   // v11.8: o gesto de agora ('' = nenhum)
  const dBob = R === 'punho' ? -2.5 * env : R === 'suspiro' ? 2.4 * env : R === 'respira' ? -1.2 * env : R === 'cabeca' ? 1.4 * env : 0;
  const bob = ((moving && !RM) ? -Math.abs(Math.sin(ph)) * 2.8 : (RM ? 0 : Math.sin((o.t||0)*3) * 0.6)) + dBob;
  const skin = '#6B3F25', rp = clamp(Math.round(o.roupa || 1), 1, 4), C = BIA_ROUPA_COR;
  const blusa = rp === 3 ? C.camisa : rp === 4 ? C.clara : C.verde;       // a camiseta, a camisa
  const saia = rp >= 3 ? (rp === 4 ? C.saiaEsc : '#2B2B33') : C.verde;
  const egg = o.egg || 0;   // v12.12: a dancinha escondida (a pirueta: gira no lugar e dá um pulinho)
  ctx.save(); ctx.translate(x,y - (egg && !RM ? 8 * Math.sin(Math.PI * egg) : 0)); ctx.scale(sc * (o.flip || 1) * (egg && !RM ? eggGiro(egg) : 1), sc);
  shadowEll(ctx,0,0,16,5,0.22);
  const sw = moving ? Math.sin(ph) * 5 : 0;
  // pernas
  rr(ctx,-7+sw,-14,6,13,2.5); fs(ctx,skin,2);
  rr(ctx,1-sw,-14,6,13,2.5); fs(ctx,skin,2);
  ell(ctx,-4+sw,-0.5,6,3); fs(ctx,'#fff',2);
  ell(ctx,4-sw,-0.5,6,3); fs(ctx,'#fff',2);
  ctx.fillStyle = PAL.formica; ctx.fillRect(-8+sw,-2.5,5,1.8); ctx.fillRect(2-sw,-2.5,5,1.8);
  // saia (e, da camisa em diante, a camisa por cima do tronco)
  ctx.beginPath(); ctx.moveTo(-10,-32+bob); ctx.lineTo(10,-32+bob); ctx.lineTo(15,-14); ctx.lineTo(-15,-14); ctx.closePath(); fs(ctx,saia,2.5);
  if (rp >= 3){ ctx.beginPath(); ctx.moveTo(-10,-32+bob); ctx.lineTo(10,-32+bob); ctx.lineTo(11.5,-19); ctx.lineTo(-11.5,-19); ctx.closePath(); fs(ctx,blusa,2.2); }
  // braços: a manga cobre uma parte do braço (camiseta curta, camisa dobrada, o resto longa); a mão é sempre de pele
  ctx.lineCap = 'round';
  const wave = o.wave ? Math.sin((o.t||0)*8) * 5 : 0;
  const lv = o.lava ? Math.sin((o.t||0)*11) : 0;   // lavando: braços à frente, balançando em direção à pia
  let aE = o.lava ? [-2+lv*4+18,-24+lv*2] : [-15,-18], aD = o.wave ? [19+wave,-52] : (o.lava ? [20-lv*4,-24-lv*2] : [15,-18]);
  if (o.wave && o.wa != null){ const k = o.wa; aD = [15 + (4 + wave) * k,-18 - 34 * k]; }   // o aceno entra aos poucos (abertura)
  if (o.maos){ aE = o.maos[0]; aD = o.maos[1]; }                                             // as mãos onde a cena pede (abertura)
  if (R){   // v11.8: as mãos do gesto (do que ela fazia até o alvo, pelo envelope); a cintura leva cotovelo (3º e 4º valores)
    const mix = (a,t) => [a[0] + (t[0] - a[0]) * env, a[1] + (t[1] - a[1]) * env];
    if (R === 'sorriso') aE = mix(aE,[-1,-27]);
    else if (R === 'punho') aD = mix(aD,[17,-62]);
    else if (R === 'cabeca' || R === 'suspiro'){ aE = mix(aE,[-13,-12]); aD = mix(aD,[13,-12]); }
    else if (R === 'respira'){ aE = mix(aE,[-19,-21]); aD = mix(aD,[19,-21]); }
    else if (R === 'cintura'){ const e0 = aE, d0 = aD; aE = mix(e0,[-11,-19]).concat(mix([-15,-24],[-21,-25])); aD = mix(d0,[11,-19]).concat(mix([15,-24],[21,-25])); }
  }
  const mang = rp === 1 ? 0.42 : rp === 3 ? 0.66 : 1;
  const braco = (sx,pt) => {
    const sy = -30 + bob, ex = pt[0], ey = pt[1];
    if (pt.length > 2){   // v11.8: braço dobrado (mãos na cintura): ombro, cotovelo, mão; a manga cobre `mang` do comprimento todo
      const cx = pt[2], cy = pt[3], l1 = Math.hypot(cx - sx, cy - sy), l2 = Math.hypot(ex - cx, ey - cy), alvo = mang * (l1 + l2);
      const poli = (w,c,fim) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(sx,sy);
        if (fim == null){ ctx.lineTo(cx,cy); ctx.lineTo(ex,ey); } else if (fim <= l1) ctx.lineTo(sx + (cx - sx) * fim / l1, sy + (cy - sy) * fim / l1);
        else { ctx.lineTo(cx,cy); const k = (fim - l1) / l2; ctx.lineTo(cx + (ex - cx) * k, cy + (ey - cy) * k); } ctx.stroke(); };
      poli(8.5,PAL.tinta); if (mang < 1) poli(5,skin); poli(5,blusa,alvo);
      if (rp === 3){   // a barra da manga dobrada
        const f0 = Math.max(0, alvo - 0.14 * (l1 + l2)); ctx.lineCap = 'butt'; ctx.strokeStyle = C.clara; ctx.lineWidth = 6; ctx.beginPath();
        const pt2 = f => f <= l1 ? [sx + (cx - sx) * f / l1, sy + (cy - sy) * f / l1] : [cx + (ex - cx) * (f - l1) / l2, cy + (ey - cy) * (f - l1) / l2];
        const a = pt2(f0), z = pt2(alvo); ctx.moveTo(a[0],a[1]); ctx.lineTo(z[0],z[1]); ctx.stroke(); ctx.lineCap = 'round';
      }
      ctx.lineJoin = 'miter'; return;
    }
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 8.5; ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
    if (mang < 1){ ctx.strokeStyle = skin; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke(); }
    const mx = sx + (ex - sx) * mang, my = sy + (ey - sy) * mang;
    ctx.strokeStyle = blusa; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(mx,my); ctx.stroke();
    if (rp === 3){   // a barra da manga dobrada: um friso mais claro
      const k = 0.14, bx = mx - (ex - sx) * k, by = my - (ey - sy) * k;
      ctx.lineCap = 'butt'; ctx.strokeStyle = C.clara; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(mx,my); ctx.stroke(); ctx.lineCap = 'round';
    }
  };
  braco(-10,aE); braco(10,aD);
  circ(ctx,aE[0],aE[1]+2,3.8); fs(ctx,skin,1.8);
  circ(ctx,aD[0],aD[1]+(o.maos ? 0 : (o.wave?-2:2)),3.8); fs(ctx,skin,1.8);
  if (R === 'punho'){   // v11.8: o punho fechado: a mão maior e os dedos marcados
    circ(ctx,aD[0],aD[1]-1,4.6); fs(ctx,skin,1.8);
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(aD[0]-2.6,aD[1]-0.4); ctx.lineTo(aD[0]+2.6,aD[1]-0.4); ctx.moveTo(aD[0]-2.6,aD[1]+1.6); ctx.lineTo(aD[0]+2.6,aD[1]+1.6); ctx.stroke();
  }
  // a gola e o pescoço (aparecem no retrato)
  rr(ctx,-3.4,-37+bob,6.8,6,1.5); fs(ctx,skin,1.6);
  if (rp === 1){ ctx.beginPath(); ctx.arc(0,-33+bob,5.2,0.1,Math.PI-0.1); ctx.lineWidth = 2; ctx.strokeStyle = PAL.tinta; ctx.stroke(); }   // gola redonda da camiseta
  if (rp >= 3){ ctx.beginPath(); ctx.moveTo(-3.2,-34.5+bob); ctx.lineTo(-8,-31+bob); ctx.lineTo(-1.2,-29+bob); ctx.closePath(); fs(ctx,rp === 4 ? C.clara : C.camisa,1.8);
    ctx.beginPath(); ctx.moveTo(3.2,-34.5+bob); ctx.lineTo(8,-31+bob); ctx.lineTo(1.2,-29+bob); ctx.closePath(); fs(ctx,rp === 4 ? C.clara : C.camisa,1.8); }
  if (rp === 3){   // a carreira de botões
    ctx.fillStyle = C.clara; [-27.5,-24.5,-21.5].forEach(by => { circ(ctx,0,by+bob*0.4,0.9); ctx.fill(); });
  }
  if (rp === 4){   // o colete escuro aberto em V, a lapela e a rosa bordada
    ctx.beginPath(); ctx.moveTo(-10,-31+bob); ctx.lineTo(-4.2,-31+bob); ctx.lineTo(0,-23.5+bob*0.5); ctx.lineTo(4.2,-31+bob); ctx.lineTo(10,-31+bob); ctx.lineTo(11,-19); ctx.lineTo(-11,-19); ctx.closePath(); fs(ctx,C.colete,2.2);
    ctx.beginPath(); ctx.moveTo(4.2,-31+bob); ctx.lineTo(8.6,-30.4+bob); ctx.lineTo(3.2,-24.2+bob); ctx.lineTo(0,-23.5+bob*0.5); ctx.closePath(); fs(ctx,'#3C4A5F',1.4);   // a lapela
    ctx.save(); ctx.translate(5.6,-27+bob*0.6); circ(ctx,0,0,2.7); fs(ctx,C.rosa,1.5);
    ctx.strokeStyle = '#8E2446'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(0,0,1.4,0.4,Math.PI*1.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1.6,2.2); ctx.lineTo(4,3.6); ctx.lineTo(2.2,0.8); ctx.closePath(); fs(ctx,C.folha,1.1); ctx.restore();
  }
  // avental: 1 e 2 inteiro (peitilho), 3 e 4 de cintura
  if (rp <= 2){
    ctx.beginPath(); ctx.moveTo(-8,-30+bob); ctx.lineTo(8,-30+bob); ctx.lineTo(11,-12); ctx.lineTo(-11,-12); ctx.closePath(); fs(ctx,rp === 1 ? C.florido : PAL.alerta,2.4);
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-6,-31+bob); ctx.lineTo(-3,-38+bob); ctx.moveTo(6,-31+bob); ctx.lineTo(3,-38+bob); ctx.stroke();
    if (rp === 1){   // o pano florido da mãe: rosas miúdas, com folhinha
      [[-4.5,-26.5],[3.4,-27.8],[-7,-20.5],[0.4,-21],[6.6,-19.6],[-3.6,-15],[4,-14.2]].forEach(([fx,fy]) => { ctx.fillStyle = C.folha; ctx.fillRect(fx+0.9,fy-0.2,2,1); circ(ctx,fx,fy,1.25); ctx.fillStyle = C.rosa; ctx.fill(); });
    } else {   // o "Corre-Corre" bordado no peito, e o bolso mais baixo
      ctx.save(); ctx.scale(o.flip || 1,1);   // o texto não vira ao contrário quando ela anda para o outro lado
      txt(ctx,'Corre-',0,-26.6+bob*0.4,3.7,PAL.creme,'center',FD); txt(ctx,'Corre',0,-23.2+bob*0.4,3.7,PAL.creme,'center',FD); ctx.restore();
      rr(ctx,-5,-18.4,10,5,1.5); fs(ctx,'#F58A4E',1.6);
    }
  } else {
    ctx.beginPath(); ctx.moveTo(-11,-21); ctx.lineTo(11,-21); ctx.lineTo(15,-9); ctx.lineTo(-15,-9); ctx.closePath(); fs(ctx,rp === 3 ? PAL.alerta : C.avEsc,2.4);
    ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-11,-20); ctx.lineTo(-14,-24); ctx.moveTo(11,-20); ctx.lineTo(14,-24); ctx.stroke();
    rr(ctx,-4.5,-16,9,5.2,1.5); fs(ctx,rp === 3 ? '#F58A4E' : '#2B3340',1.5);
    if (rp === 4){ ctx.strokeStyle = PAL.creme; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-14,-10.4); ctx.lineTo(14,-10.4); ctx.moveTo(-9.8,-19.8); ctx.lineTo(9.8,-19.8); ctx.stroke(); }   // o debrum claro do avental escuro
  }
  // cabeça e cabelo (1 solto com o puff; 2 rabo; 3 rabo alto; 4 coque)
  const hy = -46 + bob + (R === 'cabeca' ? 4 * env : R === 'respira' ? -2.5 * env : R === 'cintura' ? -2 * env : R === 'suspiro' ? 1.2 * env : 0), ph2 = moving ? Math.sin(ph) * 2.2 : (RM ? 0 : Math.sin((o.t||0)*2.2) * 0.8);
  if (rp === 1){ circ(ctx,0,hy-14,13.5); fs(ctx,C.cabelo,2.5); }              // puff
  else if (rp === 2) puffCrespo(ctx,-16 - ph2,hy + 3,10,6);   // v11.16.1: puff crespo baixo na nuca, balançando (era o rabo); v12.4.1: atrás (o +x é a frente)
  else if (rp === 3) puffCrespo(ctx,-5 - ph2 * 0.5,hy - 19,12,7);   // v12.4.1: puxado para trás; puff crespo alto, preso no alto da cabeça
  else puffCrespo(ctx,0,hy - 20,9.5,7);                           // coque crespo
  circ(ctx,-11.5,hy+1,2.8); fs(ctx,skin,1.6); circ(ctx,11.5,hy+1,2.8); fs(ctx,skin,1.6);
  circ(ctx,0,hy,11.5); fs(ctx,skin,2.5);
  if (rp >= 2) [200,235,270,305,340].forEach(d => { const a = d * Math.PI / 180; circ(ctx,Math.cos(a)*10.5,hy - 1 + Math.sin(a)*10.5,3.6); fs(ctx,C.cabelo,1.6); });   // v11.16.1: o alto da cabeça crespo (a franja cobre a parte de baixo)
  ctx.beginPath(); ctx.arc(0,hy-1,12,Math.PI*1.05,Math.PI*1.95); ctx.quadraticCurveTo(0,hy-7,-12,hy-1); ctx.closePath(); fs(ctx,C.cabelo,2);
  if (rp === 1){   // lenço amarelo
    ctx.beginPath(); ctx.moveTo(-12.5,hy-5); ctx.quadraticCurveTo(0,hy-11,12.5,hy-5); ctx.lineTo(12,hy-9); ctx.quadraticCurveTo(0,hy-16,-12,hy-9); ctx.closePath(); fs(ctx,PAL.mostarda,2);
    ctx.beginPath(); ctx.moveTo(10,hy-8); ctx.lineTo(18,hy-12); ctx.lineTo(16,hy-5); ctx.closePath(); fs(ctx,PAL.mostarda,1.8);
  } else if (rp === 2){ circ(ctx,-9.2,hy-4.2,2.4); fs(ctx,PAL.alerta,1.6); }       // o elástico do puff baixo
  else if (rp === 3){ circ(ctx,-3,hy-11.5,2.3); fs(ctx,PAL.alerta,1.6); }           // o elástico, onde o puff encontra a cabeça
  else { rr(ctx,-6,hy-13.5,12,2.6,1.3); fs(ctx,PAL.creme,1.2); }   // a faixa creme na base do coque
  // rosto
  if (o.olha) ctx.translate(o.olha * 2.5,0);
  const E = EXPR !== 'neutra' ? EXPR : (env > 0.2 && REACAO_EXPR[R]) || 'neutra';   // v11.5: o retrato do balão; v11.8: a cara do gesto
  const pisca = o.pisca || (R === 'suspiro' && env > 0.2), fala = o.fala || (R === 'suspiro' && env > 0.2 ? 0.5 : 0);   // o suspiro: olhos fechados e a boca em "o"
  if (E !== 'neutra') rostoExpr(ctx,E,4.3,hy+2.5,hy+8,4.9,skin);
  else {
  ctx.fillStyle = PAL.tinta;
  if (pisca){ ctx.fillRect(-6.2,hy+0.4,4,1.6); ctx.fillRect(2.2,hy+0.4,4,1.6); } else { circ(ctx,-4.3,hy+1,1.8); ctx.fill(); circ(ctx,4.3,hy+1,1.8); ctx.fill(); }
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1.9;
  if (fala){ ell(ctx,0,hy+5.6,3.2,1.2 + fala * 2); fs(ctx,'#7A2E2E',1.5); } else { ctx.beginPath(); ctx.arc(0,hy+3.8,4.6,0.2,Math.PI-0.2); ctx.stroke(); }
  ctx.fillStyle = 'rgba(226,106,44,.3)'; circ(ctx,-7.8,hy+4.6,2.4); ctx.fill(); circ(ctx,7.8,hy+4.6,2.4); ctx.fill();
  }
  if (R === 'suspiro'){   // v11.8: o sopro de alívio: três bolinhas claras que saem da boca e sobem
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 1;
    [[9,hy+8,1.8],[14,hy+5,2.6],[20,hy+1,3.4]].forEach(([qx,qy,qr]) => { circ(ctx,qx,qy - 4 * env,qr * env); ctx.fill(); ctx.stroke(); });
  }
  ctx.restore();
}


/* banco (v8.3): o prediozinho de colunas, com a moeda na frente (centro em 0,0; ~30 px) */
function drawBanco(c){
  c.beginPath(); c.moveTo(-15,-6); c.lineTo(0,-16); c.lineTo(15,-6); c.closePath(); fs(c,PAL.creme,2);
  rr(c,-14,10,28,5,1); fs(c,PAL.creme,2);
  for (let i=-1;i<=1;i++){ rr(c,i*9-2.5,-5,5,15,1); fs(c,'#fff',1.6); }
  circ(c,10,9,7); fs(c,PAL.mostarda,1.8); txt(c,'$',10,9.5,9,PAL.tinta,'center',FD);
}
/* chave inglesa (v8), desenhada: cabo e boca aberta, com contorno; (x,y) é o centro, s a escala, rot em radianos */
function drawWrench(ctx,x,y,s,rot,cor){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot || 0); ctx.scale(s || 1,s || 1); ctx.lineCap = 'butt';
  ctx.strokeStyle = PAL.tinta; ctx.lineWidth = 6.4; ctx.beginPath(); ctx.moveTo(0,9); ctx.lineTo(0,-2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-6,4.6,-Math.PI/2 + 0.65,-Math.PI/2 - 0.65 + TAU); ctx.stroke();
  ctx.strokeStyle = cor || '#fff'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(0,9); ctx.lineTo(0,-2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-6,4.6,-Math.PI/2 + 0.65,-Math.PI/2 - 0.65 + TAU); ctx.stroke();
  ctx.lineCap = 'round'; circ(ctx,0,9,1.9); ctx.fillStyle = cor || '#fff'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = PAL.tinta; ctx.stroke();
  ctx.restore();
}
