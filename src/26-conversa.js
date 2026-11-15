/* ============================================================
   DESENHO DA CONVERSA (v8.7): o salão do dia parado e escurecido ao fundo, com o balão saindo de quem fala
   ============================================================ */
const CONV_UI = { texto:21, linha:27, nome:16, nota:15, w:420 };
/* v11.5: o retrato no balão: um círculo de raio 34 com a cabeça e os ombros de quem fala, desenhados pela mesma função do boneco do salão
   (drawBia, drawChef, drawDani...), em escala maior e recortados no círculo. RETRATO_QUEM é a ordem da grade do modo dev; um personagem novo
   (o Bráulio, v11.6) entra aqui, em RETRATO_POSE (escala s e a altura dos pés abaixo do centro da cabeça, pe) e no `switch` de drawRetrato. */
const RETRATO = { raio:34, fundo:'#F4EBDD', larg:84 };
const RETRATO_QUEM = ['bia','tonhao','dani','joca','cami','anselmo','lia','braulio'];   // v11.6: o Bráulio, a 8ª coluna
const RETRATO_POSE = { bia:{ s:1.75, pe:40, dy:3 }, tonhao:{ s:1.95, pe:14, dy:3 }, braulio:{ s:1.9, pe:42, dy:3 }, padrao:{ s:2.35, pe:42, dy:3 } };
/* v11.6: o chef Bráulio (docs/ARCO.md §9): o mesmo boneco do cliente `braulio` de src/12-clientes.js (bigode grande, paletó bordô, gravata #F2C23D), de cabelo grisalho; desenhado por drawPerson */
const BRAULIO_LOOK = { skin:0, hair:0, hairC:'#8C8C8C', pants:'#2B2B33', kid:false, elder:false, acc:null, glasses:false, bigode:true, blazer:true, gravata:'#F2C23D', paleto:AB_COR.aurora };
function drawRetrato(c, q, e, cx, cy, g){
  e = exprDe(e);
  const P = RETRATO_POSE[q] || RETRATO_POSE.padrao, r = RETRATO.raio;
  const dy = e === 'insegura' ? 3 : e === 'firme' ? -2 : 0;   // insegura: ombros 3 px mais baixos; firme: cabeça 2 px mais alta
  const d = { x:0, y:0, moving:false, walkPh:0, washing:false, busy:false, hands:[], level:(g && g[q] && g[q].level) || 2, s:1 };
  const antes = CRACHA_A;
  c.save();
  c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fillStyle = RETRATO.fundo; c.fill(); c.clip();
  c.translate(cx, cy + dy); c.scale(P.s, P.s); c.translate(0, P.pe + P.dy / P.s);
  EXPR = e; CRACHA_A = 0;
  try {
    if (q === 'bia') drawBia(c, null, 0, 0, { roupa:roupaBia(g) });   // v11.7: a roupa do ponto
    else if (q === 'tonhao') drawChef(c, { day:{ gripe:false } }, 0, 0, 0);
    else if (q === 'dani') drawDani(c, d, 0);
    else if (q === 'joca') drawJoca(c, d, 0);
    else if (q === 'cami') drawCami(c, d, 0);
    else if (q === 'anselmo') drawAnselmo(c, d, 0);
    else if (q === 'lia') drawLia(c, d, 0);
    else if (q === 'braulio') drawPerson(c, BRAULIO_LOOK, 0, 0, { noShadow:true });   // v11.6
  } finally { EXPR = 'neutra'; CRACHA_A = antes; c.restore(); }
  c.save(); c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.strokeStyle = PAL.tinta; c.lineWidth = 3; c.stroke(); c.restore();
}
/* v11.5 (modo dev, "Retratos"): os personagens nas cinco expressões, um por coluna, uma expressão por linha */
function drawRetratosTela(c, g){
  c.fillStyle = '#2b2620'; c.fillRect(0, 0, TW, H);
  const n = RETRATO_QUEM.length, col = Math.min(130, (TW - 120) / n), x0 = (TW - col * n) / 2 + col / 2 + 40, lin = 90, y0 = 112;
  txt(c, 'Retratos (toque para voltar)', TW / 2, 24, 18, '#fff', 'center', FD);
  RETRATO_QUEM.forEach((q, i) => txt(c, HIST_NOMES[q], x0 + i * col, 62, 14, '#f4ebdd', 'center', FD));
  EXPRESSOES.forEach((e, j) => {
    txt(c, e, 14, y0 + j * lin, 14, '#f4ebdd', 'left', FB);
    RETRATO_QUEM.forEach((q, i) => drawRetrato(c, q, e, x0 + i * col, y0 + j * lin, g));
  });
}
/* onde fica a cabeça de quem fala, na tela: [x, y] (a Bia e a Dani onde estão; o Tonhão na janela da cozinha) */
function convCabeca(g, q){
  if (q === 'tonhao') return [930 + g.cam, 140];
  if (q === 'dani' && g.dani.active) return [g.dani.x + g.cam, g.dani.y - 82];
  if (q === 'dani') return [g.bia.x + g.cam + 70, g.bia.y - 82];   // ainda não chegou: ao lado da Bia
  if (q === 'joca' && g.joca.active) return [g.joca.x + g.cam, g.joca.y - 82];   // v9.2
  if (q === 'joca') return [g.bia.x + g.cam - 70, g.bia.y - 82];
  if (q === 'cami' && g.cami.active) return [g.cami.x + g.cam, g.cami.y - 82];   // v9.3
  if (q === 'cami') return [g.bia.x + g.cam + 70, g.bia.y - 82];
  if (q === 'lia') return [LIA_HOME.x + g.cam, LIA_HOME.y - 50];   // v10.2: na cozinha, ao lado do Tonhão
  if (q === 'braulio') return [Math.max(DOOR.x + g.cam, 48), DOOR.y + 70];   // v11.6: na porta do salão, por onde a freguesia entra (na Garagem, na Avenida e no Terraço a porta fica fora da tela ou no canto: ele fica no canto da calçada)
  if (q === 'anselmo') return [ANSELMO_HOME.x + g.cam, ANSELMO_HOME.y - 82];   // v9.5: atrás do balcão (se ainda não chegou, no mesmo lugar)
  return [g.bia.x + g.cam, g.bia.y - 86];
}
function drawConversa(c, g, conv){
  const f = conv.fala, U = CONV_UI;
  c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(0, 0, TW, H);
  if (!f) return;
  const a = convCabeca(g, f.q), ent = conv.entra;
  if (conv.falas && conv.falas.some(x => x.q === 'braulio')){ const b = convCabeca(g, 'braulio'); c.save(); c.globalAlpha = ent; drawPerson(c, BRAULIO_LOOK, b[0], b[1] + 86, {}); c.restore(); }   // v11.6: o Bráulio parado na porta durante a conversa em que ele fala
  const lin = treinoLinhas(c, f.s, U.w, U.texto);
  const cab = 30 + (f.nota ? 22 : 0), h = Math.max(cab + lin.length * U.linha + 30, 92), RW = RETRATO.larg;   // v11.5: o retrato pede 84 px a mais de largura e uma altura mínima
  c.font = U.texto + 'px ' + FB;
  const w = Math.max(220, Math.max.apply(null, lin.map(l => c.measureText(l).width)) + 40) + RW;
  let x = clamp(a[0] - w/2, 16, TW - 16 - w), y = Math.max(12, a[1] - 24 - h) + (1 - ent) * 12;
  const ev = conv.evita, cruza = () => ev && x < ev.x + ev.w && x + w > ev.x && y < ev.y + ev.h && y + h > ev.y;
  if (cruza()){ x = Math.max(16, ev.x - w); if (cruza()) y = ev.y + ev.h; }   // v9.0.1: o balão desvia do botão Pular
  conv.caixa = { x, y, w, h };
  const bx = clamp(a[0], x + 26, x + w - 26);
  c.save(); c.globalAlpha = ent;
  c.beginPath(); c.moveTo(bx - 12, y + h - 2); c.lineTo(a[0], Math.max(a[1], y + h + 14)); c.lineTo(bx + 12, y + h - 2); c.closePath(); fs(c, '#fff', 3);
  rr(c, x, y, w, h, 16); fs(c, '#fff', 3);
  c.fillStyle = '#fff'; c.fillRect(bx - 10, y + h - 4, 20, 5);
  drawRetrato(c, f.q, f.e, x + 18 + RETRATO.raio, y + clamp(h / 2, 46, 52), g);   // v11.5
  txt(c, HIST_NOMES[f.q], x + 18 + RW, y + 18, U.nome, f.q === 'tonhao' ? PAL.perigo : f.q === 'dani' ? '#7B4FB5' : f.q === 'joca' ? '#2C7A7B' : f.q === 'cami' ? '#6B46C1' : f.q === 'anselmo' ? '#8E3B46' : f.q === 'lia' ? '#5E7A3A' : f.q === 'braulio' ? '#4A4A4A' : PAL.ok, 'left', FD);
  if (f.nota) txt(c, '(' + f.nota + ')', x + 18 + RW, y + 40, 'italic ' + U.nota, '#6b6457', 'left', FB);
  lin.forEach((l, i) => txt(c, l, x + 18 + RW, y + cab + 6 + U.linha * (i + 0.5), U.texto, PAL.tinta, 'left', FB));
  txt(c, 'toque para seguir', x + w - 14, y + h - 12, 12, '#9a917f', 'right', FB);
  c.restore();
}
