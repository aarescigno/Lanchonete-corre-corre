/* ============================================================
   MISSÃO ZERO (v8.2): o pop-up do passo a passo, na tela (por cima do HUD)
   Cartão creme com o título, o texto e o passo; no passo de explicação, "Continuar" e o resto
   escurecido (com um buraco em cada alvo). O alvo ganha um anel tracejado e uma seta, que pulsam
   (parados com movimento reduzido). O cartão vai para o primeiro canto que não cobre o alvo
   ============================================================ */
const TREINO_UI = { w:470, pad:20, tit:22, corpo:17, linha:23 };

function treinoLinhas(ctx, s, maxW, size){
  ctx.font = size + 'px ' + FB;
  const out = []; let cur = '';
  s.split(' ').forEach(w => {
    const t = cur ? cur + ' ' + w : w;
    if (cur && ctx.measureText(t).width > maxW){ out.push(cur); cur = w; } else cur = t;
  });
  if (cur) out.push(cur);
  return out;
}
function treinoCruza(a, b, m){ return a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m; }
/* onde fica o cartão: no alto ou embaixo, no meio ou nos cantos, sem cobrir nenhum alvo */
function treinoLugar(alvos, w, h){
  const L = 16, R = TW - w - 16, C = (TW - w) / 2, T = 14, B = 532 - h;
  const opts = [[C,T],[C,B],[L,T],[R,T],[L,B],[R,B],[L,(540 - h) / 2],[R,(540 - h) / 2]];
  for (const o of opts){ const r = { x:o[0], y:o[1], w, h }; if (!alvos.some(a => treinoCruza(r, a, 14))) return r; }
  return { x:C, y:T, w, h };
}
/* anel tracejado em cada alvo e seta no 1º (pulsam; parados com movimento reduzido). Devolve o cabo da seta
   ({ x, y, s: -1 seta em cima do alvo, 1 embaixo }), para a etiqueta da dica ficar depois dele */
function treinoAneis(ctx, alvos, tm){
  const pulso = RM ? 0 : Math.sin(tm * 5);
  let cabo = null;
  alvos.forEach((a, k) => {
    rr(ctx, a.x - 8, a.y - 8, a.w + 16, a.h + 16, 14);
    ctx.setLineDash([]); ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.stroke();
    ctx.setLineDash([12, 8]); ctx.lineDashOffset = RM ? 0 : -tm * 30; ctx.lineWidth = 4; ctx.strokeStyle = PAL.mostarda; ctx.stroke();
    ctx.setLineDash([]);
    if (k) return;
    const cima = a.y > 70, ax = a.x + a.w / 2, ay = cima ? a.y - 16 - 6 * (1 + pulso) : a.y + a.h + 16 + 6 * (1 + pulso), s = cima ? -1 : 1;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 13, ay + 20 * s); ctx.lineTo(ax - 5, ay + 20 * s); ctx.lineTo(ax - 5, ay + 34 * s);
    ctx.lineTo(ax + 5, ay + 34 * s); ctx.lineTo(ax + 5, ay + 20 * s); ctx.lineTo(ax + 13, ay + 20 * s); ctx.closePath();
    fs(ctx, PAL.mostarda, 3);
    cabo = { x:ax, y:(cima ? a.y - 28 : a.y + a.h + 28) + 34 * s, s };   // pelo ponto mais longe do pulso: a etiqueta não balança
  });
  return cabo;
}
/* DICA NA HORA (v9.6.12): o anel e a seta da Missão zero no próximo passo, com uma etiqueta de duas ou três palavras; sem cartão
   e sem escurecer o salão. No "sentar", uma linha pontilhada liga o grupo à mesa e uma bolinha anda por ela (só a linha, com
   movimento reduzido). Surge em DICAS.surge s. Na tela (o mundo anda g.cam) */
const DICA_UI = { letra:17, alt:30, folga:13 };
function drawDica(ctx,g,tm){
  const d = g.dica;
  if (!d) return;
  const U = DICA_UI, alvos = d.alvos.map(q => ({ x:q.x + g.cam, y:q.y, w:q.w, h:q.h }));
  ctx.save();
  ctx.globalAlpha = RM ? 1 : clamp((g.anim - g.dicaDesde) / DICAS.surge, 0, 1);
  if (d.arrasta && alvos.length > 1){
    const a = alvos[0], c = alvos[1], x0 = a.x + a.w / 2, y0 = a.y + a.h / 2, x1 = c.x + c.w / 2, y1 = c.y + c.h / 2;
    ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
    if (!RM){ const p = (tm * 0.7) % 1, e = p * p * (3 - 2 * p); circ(ctx, x0 + (x1 - x0) * e, y0 + (y1 - y0) * e, 10); fs(ctx, PAL.mostarda, 3); }
  }
  const cabo = treinoAneis(ctx, alvos, tm);
  if (cabo){
    ctx.font = U.letra + 'px ' + FD;
    const w = ctx.measureText(d.txt).width + 2 * U.folga, x = clamp(cabo.x - w / 2, 8, TW - w - 8), y = cabo.s < 0 ? cabo.y - U.alt - 4 : cabo.y + 4;
    rr(ctx, x, y + 3, w, U.alt, 10); ctx.fillStyle = PAL.tinta; ctx.fill();
    rr(ctx, x, y, w, U.alt, 10); fs(ctx, PAL.creme, 2.6);
    txt(ctx, d.txt, x + w / 2, y + U.alt / 2 + 1, U.letra, PAL.tinta, 'center', FD);
  }
  ctx.restore();
}
function drawTreino(ctx,g,tm){
  const tr = g.treino, p = tr && tr.passo;
  if (!p) return;
  const U = TREINO_UI, alvos = tr.alvos();
  ctx.save();
  // explicação: o resto escurece, com um buraco em cada alvo
  if (p.ok){
    ctx.beginPath(); ctx.rect(0, 0, TW, H);
    alvos.forEach(a => rr(ctx, a.x - 8, a.y - 8, a.w + 16, a.h + 16, 14));
    ctx.fillStyle = 'rgba(34,32,28,.38)'; ctx.fill('evenodd');
  }
  // anel tracejado e seta em cada alvo
  treinoAneis(ctx, alvos, tm);
  // cartão
  const tw = U.w - 2 * U.pad, linhas = treinoLinhas(ctx, tr.texto(), tw, U.corpo);
  const h = U.pad + U.tit + 10 + linhas.length * U.linha + 14 + 34 + U.pad - 6;
  const r = treinoLugar(alvos, U.w, h);
  ctx.save(); ctx.globalAlpha = 0.3; rr(ctx, r.x + 4, r.y + 6, r.w, r.h, 16); ctx.fillStyle = PAL.tinta; ctx.fill(); ctx.restore();
  rr(ctx, r.x, r.y, r.w, r.h, 16); fs(ctx, PAL.creme, 3);
  ctx.fillStyle = PAL.faixa; rr(ctx, r.x, r.y, 10, r.h, 5); ctx.fill();
  let y = r.y + U.pad + U.tit / 2;
  txt(ctx, p.tit, r.x + U.pad, y, U.tit, PAL.faixa, 'left', FD, 0, tw);
  y += U.tit / 2 + 10 + U.linha / 2;
  linhas.forEach(l => { txt(ctx, l, r.x + U.pad, y, U.corpo, PAL.tinta, 'left', FB); y += U.linha; });
  const fy = r.y + r.h - U.pad - 11;
  // "Pular tutorial": canto de cima do cartão; o retângulo fica em tr.pular para o toque (Game.onDown)
  const pw = 122, ph = 24, pr = { x:r.x + r.w - 12 - pw, y:r.y + 10, w:pw, h:ph };
  tr.pular = pr;
  rr(ctx, pr.x, pr.y, pr.w, pr.h, 8); fs(ctx, '#efe6d2', 2);
  txt(ctx, 'Pular tutorial ⏭', pr.x + pr.w / 2, pr.y + pr.h / 2, 13, PAL.tinta, 'center', FB);
  txt(ctx, 'Missão zero · passo ' + (tr.i + 1) + ' de ' + tr.total, r.x + U.pad, fy, 13, '#6b6355', 'left', FB);
  if (p.ok){
    const bw = 150, bx = r.x + r.w - U.pad - bw, by = fy - 17;
    rr(ctx, bx, by + 4, bw, 34, 10); ctx.fillStyle = PAL.tinta; ctx.fill();
    rr(ctx, bx, by, bw, 34, 10); fs(ctx, PAL.ok, 2.6);
    txt(ctx, tr.i + 1 >= tr.total ? 'Concluir ▸' : 'Continuar ▸', bx + bw / 2, by + 17, 17, '#fff', 'center', FD, 3);
  } else if (p.espera) txt(ctx, 'Aguarde...', r.x + r.w - U.pad, fy, 15, '#6b6355', 'right', FD);   // v9.6.12: passo de só esperar
  else txt(ctx, 'Sua vez!', r.x + r.w - U.pad, fy, 17, PAL.alerta, 'right', FD);
  ctx.restore();
}

