/* ============================================================
   DESENHO DA CONVERSA (v8.7): o salão do dia parado e escurecido ao fundo, com o balão saindo de quem fala
   ============================================================ */
const CONV_UI = { texto:21, linha:27, nome:16, nota:15, w:420 };
/* onde fica a cabeça de quem fala, na tela: [x, y] (a Bia e a Dani onde estão; o Tonhão na janela da cozinha) */
function convCabeca(g, q){
  if (q === 'tonhao') return [930 + g.cam, 140];
  if (q === 'dani' && g.dani.active) return [g.dani.x + g.cam, g.dani.y - 82];
  if (q === 'dani') return [g.bia.x + g.cam + 70, g.bia.y - 82];   // ainda não chegou: ao lado da Bia
  if (q === 'joca' && g.joca.active) return [g.joca.x + g.cam, g.joca.y - 82];   // v9.2
  if (q === 'joca') return [g.bia.x + g.cam - 70, g.bia.y - 82];
  if (q === 'cami' && g.cami.active) return [g.cami.x + g.cam, g.cami.y - 82];   // v9.3
  if (q === 'cami') return [g.bia.x + g.cam + 70, g.bia.y - 82];
  return [g.bia.x + g.cam, g.bia.y - 86];
}
function drawConversa(c, g, conv){
  const f = conv.fala, U = CONV_UI;
  c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(0, 0, TW, H);
  if (!f) return;
  const a = convCabeca(g, f.q), ent = conv.entra;
  const lin = treinoLinhas(c, f.s, U.w, U.texto);
  const cab = 30 + (f.nota ? 22 : 0), h = cab + lin.length * U.linha + 30;
  c.font = U.texto + 'px ' + FB;
  const w = Math.max(220, Math.max.apply(null, lin.map(l => c.measureText(l).width)) + 40);
  let x = clamp(a[0] - w/2, 16, TW - 16 - w), y = Math.max(12, a[1] - 24 - h) + (1 - ent) * 12;
  const ev = conv.evita, cruza = () => ev && x < ev.x + ev.w && x + w > ev.x && y < ev.y + ev.h && y + h > ev.y;
  if (cruza()){ x = Math.max(16, ev.x - w); if (cruza()) y = ev.y + ev.h; }   // v9.0.1: o balão desvia do botão Pular
  conv.caixa = { x, y, w, h };
  const bx = clamp(a[0], x + 26, x + w - 26);
  c.save(); c.globalAlpha = ent;
  c.beginPath(); c.moveTo(bx - 12, y + h - 2); c.lineTo(a[0], Math.max(a[1], y + h + 14)); c.lineTo(bx + 12, y + h - 2); c.closePath(); fs(c, '#fff', 3);
  rr(c, x, y, w, h, 16); fs(c, '#fff', 3);
  c.fillStyle = '#fff'; c.fillRect(bx - 10, y + h - 4, 20, 5);
  txt(c, HIST_NOMES[f.q], x + 18, y + 18, U.nome, f.q === 'tonhao' ? PAL.perigo : f.q === 'dani' ? '#7B4FB5' : f.q === 'joca' ? '#2C7A7B' : f.q === 'cami' ? '#6B46C1' : PAL.ok, 'left', FD);
  if (f.nota) txt(c, '(' + f.nota + ')', x + 18, y + 40, 'italic ' + U.nota, '#6b6457', 'left', FB);
  lin.forEach((l, i) => txt(c, l, x + 18, y + cab + 6 + U.linha * (i + 0.5), U.texto, PAL.tinta, 'left', FB));
  txt(c, 'toque para seguir', x + w - 14, y + h - 12, 12, '#9a917f', 'right', FB);
  c.restore();
}
