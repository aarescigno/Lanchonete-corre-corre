/* ============================================================
   EDITOR DE DESENHOS (ferramentas/editor.py)
   O jogo roda escondido por baixo e empresta as funções de desenho. Cada número das funções dos arquivos do
   editor vira __edN(k): o valor sai da tabela V, que muda quando se arrasta um ponto na cena ou um número no
   código. Dois números seguidos só com vírgula entre eles (x,y) viram um ponto, desenhado onde o canvas
   estava (a transformação do momento em que o número foi lido). No fim, os números novos voltam para o texto
   do arquivo: salvar (com o servidor do editor.py), baixar ou copiar as mudanças para o chat.
   ============================================================ */
(function(){
'use strict';
const L = window.__lcc, ED = window.__ed, FONTES = window.__ED_FONTES || {}, raiz = document.getElementById('ed');
if (!L || !ED){ raiz.textContent = 'O jogo não carregou (falta window.__lcc ou o gancho window.__ed).'; return; }
const TW = L.TW, H = ED.ev('H'), DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- leitura dos arquivos: números, comentários, textos e funções ---------- */
const NUMS = [];      // todos os números editáveis: { arq, s, e, txt, dec, f, k }
const FUNCS = [];     // { arq, nome, tipo: 'func' | 'metodo', obj, s, e, nums: [] }
const ARQS = {};      // arq -> { src, marcas, linhas }
function ler(arq, src){
  const marcas = [], pares = {}, pilha = [], n = src.length;
  let i = 0, prev = '';
  while (i < n){
    const ch = src[i], nx = src[i+1];
    if (ch === '/' && nx === '/'){ let j = src.indexOf('\n', i); if (j < 0) j = n; marcas.push({ s:i, e:j, cls:'c' }); i = j; continue; }
    if (ch === '/' && nx === '*'){ let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; marcas.push({ s:i, e:j, cls:'c' }); i = j; continue; }
    if (ch === "'" || ch === '"' || ch === '`'){
      let j = i + 1; while (j < n && src[j] !== ch){ if (src[j] === '\\') j++; j++; }
      marcas.push({ s:i, e:j + 1, cls:'s' }); i = j + 1; prev = 's'; continue;
    }
    if (/[A-Za-z_$]/.test(ch)){ let j = i; while (j < n && /[\w$]/.test(src[j])) j++; prev = src.slice(i, j); i = j; continue; }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(nx || ''))){
      const re = /\d*\.?\d+/y; re.lastIndex = i; const m = re.exec(src);
      let s = i; const e = i + m[0].length;
      // o menos da frente entra no número quando é sinal, e não conta: ( , [ { : = ? ; e return
      let j = i - 1; while (j >= 0 && /[ \t]/.test(src[j])) j--;
      if (j >= 0 && src[j] === '-'){
        let q = j - 1; while (q >= 0 && /\s/.test(src[q])) q--;
        if (q < 0 || '(,[{:=?;'.includes(src[q]) || /return$/.test(src.slice(Math.max(0, q - 5), q + 1))) s = j;
      }
      marcas.push({ s, e, cls:'n', txt:src.slice(s, e), dec:(m[0].split('.')[1] || '').length });
      prev = '0'; i = e; continue;
    }
    if (ch === '{') pilha.push(i);
    else if (ch === '}'){ const a = pilha.pop(); if (a != null) pares[a] = i; }
    if (!/\s/.test(ch)) prev = ch;
    i++;
  }
  // funções do arquivo: "function nome(...){" e os métodos de "const OBJ = {" ("  nome(...){", como as cenas)
  const fs = [];
  let m; const reF = /^function (\w+)\s*\(/gm;
  while ((m = reF.exec(src))){
    const a = src.indexOf('{', src.indexOf(')', m.index));
    if (pares[a] != null) fs.push({ arq, nome:m[1], tipo:'func', s:m.index, e:pares[a] + 1 });
  }
  const reO = /^const (\w+) = \{/gm;
  while ((m = reO.exec(src))){
    const a = m.index + m[0].length - 1, fim = pares[a]; if (fim == null) continue;
    const reM = /^  (\w+)\(([^)]*)\)\s*\{/gm; reM.lastIndex = a; let mm;
    while ((mm = reM.exec(src)) && mm.index < fim){
      const b = mm.index + mm[0].length - 1;
      if (pares[b] != null){ fs.push({ arq, nome:mm[1], tipo:'metodo', obj:m[1], s:mm.index, e:pares[b] + 1 }); reM.lastIndex = pares[b]; }
    }
  }
  fs.sort((a, b) => a.s - b.s);
  // só os números de dentro das funções são editáveis
  marcas.forEach(t => {
    if (t.cls !== 'n') return;
    const f = fs.find(f => t.s >= f.s && t.e <= f.e); if (!f) { t.cls = ''; return; }
    t.arq = arq; t.f = f; t.k = NUMS.length; NUMS.push(t); (f.nums = f.nums || []).push(t);
  });
  const linhas = [0]; for (let p = 0; p < n; p++) if (src[p] === '\n') linhas.push(p + 1);
  ARQS[arq] = { src, marcas: marcas.filter(t => t.cls), linhas };
  fs.forEach(f => { f.nums = f.nums || []; FUNCS.push(f); });
}
Object.keys(FONTES).forEach(a => ler(a, FONTES[a]));
const linhaDe = (arq, pos) => { const L0 = ARQS[arq].linhas; let a = 0, b = L0.length - 1; while (a < b){ const m = (a + b + 1) >> 1; if (L0[m] <= pos) a = m; else b = m - 1; } return a + 1; };
NUMS.forEach(t => { t.v0 = parseFloat(t.txt.replace(/\s+/g, '')); t.linha = linhaDe(t.arq, t.s); });

// pontos: dois números seguidos com só uma vírgula entre eles. Numa sequência (rr(c,770,350,80,120,4)), só o 1º
// par é x,y; nos caminhos (moveTo, lineTo, quadraticCurveTo, bezierCurveTo), todos os pares são pontos
const PARES = [], junto = (a, b) => a && b && a.arq === b.arq && a.f === b.f && /^\s*,\s*$/.test(ARQS[a.arq].src.slice(a.e, b.s));
for (let i = 0; i < NUMS.length; i++){
  if (junto(NUMS[i-1], NUMS[i])) continue;   // não é o começo da sequência
  let j = i; while (junto(NUMS[j], NUMS[j+1])) j++;
  const a = NUMS[i], antes = ARQS[a.arq].src.slice(Math.max(0, a.s - 40), a.s);
  const caminho = /(moveTo|lineTo|quadraticCurveTo|bezierCurveTo)\(\s*$/.test(antes);
  for (let q = i; q + 1 <= j; q += 2){ PARES.push({ kx:NUMS[q].k, ky:NUMS[q+1].k, f:a.f }); if (!caminho) break; }
}

/* ---------- valores e as funções trocadas ---------- */
const V = NUMS.map(t => t.v0);
let gravando = false, ctxP = null, visto = new Map();
window.__edN = k => { if (gravando && !visto.has(k)) visto.set(k, ctxP.getTransform()); return V[k]; };
function instrumentado(f){
  const src = ARQS[f.arq].src; let out = '', pos = f.s;
  f.nums.forEach(t => { out += src.slice(pos, t.s) + '__edN(' + t.k + ')'; pos = t.e; });
  return out + src.slice(pos, f.e);
}
const falhas = [];
FUNCS.forEach(f => {
  const inst = instrumentado(f), nome = JSON.stringify(f.nome);
  try {
    if (f.tipo === 'func') ED.ev(f.nome + ' = (' + inst + ');');
    else ED.ev(f.obj + '[' + nome + '] = ({' + inst + '})[' + nome + '];');
  } catch (e){ falhas.push(f.nome + ': ' + e.message); }
});

/* ---------- texto novo dos arquivos ---------- */
const passo = t => t.dec ? Math.pow(10, -t.dec) : 1;
const arred = (t, v) => { const p = passo(t); return Math.round(v / p) * p; };
function fmt(t, v){
  let s = t.dec ? v.toFixed(t.dec) : String(Math.round(v));
  if (s === '-0') s = '0';
  if (v < 0 && !t.txt.trim().startsWith('-')) s = '(' + s + ')';   // "x - 24" virando negativo: x - (-3)
  return s;
}
const mudou = t => Math.abs(V[t.k] - t.v0) > 1e-9;
function textoNovo(arq){
  const A = ARQS[arq]; let out = '', pos = 0;
  NUMS.forEach(t => { if (t.arq !== arq || !mudou(t)) return; out += A.src.slice(pos, t.s) + fmt(t, V[t.k]); pos = t.e; });
  return out + A.src.slice(pos);
}
function mudancas(){
  const r = [];
  Object.keys(ARQS).forEach(arq => {
    if (!NUMS.some(t => t.arq === arq && mudou(t))) return;
    const a = ARQS[arq].src.split('\n'), b = textoNovo(arq).split('\n');
    a.forEach((l, i) => { if (l !== b[i]) r.push({ arq, linha:i + 1, antes:l, depois:b[i] }); });
  });
  return r;
}

/* ---------- interface ---------- */
raiz.innerHTML = `
  <div class="barra">
    <label>Cena <select id="e-cena"></select></label>
    <button id="e-toca" title="Tocar ou parar (espaço)">▶ Tocar</button>
    <label><input type="range" id="e-tempo" min="0" max="1000" value="500"> <span id="e-tempo-txt"></span></label>
    <label>Zoom <select id="e-zoom"><option value="0.75">75%</option><option value="1">100%</option><option value="1.5">150%</option><option value="2">200%</option><option value="3">300%</option></select></label>
    <label>Pontos <select id="e-mostra"><option value="cena">da cena</option><option value="tudo">de tudo (também abRosa, abBraco...)</option><option value="nada">nenhum</option></select></label>
    <button id="e-grade">Grade</button>
    <span style="flex:1"></span>
    <button id="e-desfaz" title="Ctrl+Z">↶ Desfazer</button>
    <button id="e-original">Voltar ao original</button>
    <button id="e-copia">Copiar mudanças</button>
    <button id="e-baixa">Baixar arquivo</button>
    <button id="e-salva" hidden>💾 Salvar em src/</button>
  </div>
  <div class="meio">
    <div class="cena"><div class="tela"><canvas id="e-cv"></canvas><canvas id="e-sobre" class="sobre"></canvas></div></div>
    <div class="codigo">
      <div class="titulo"><label>Função <select id="e-func"></select></label><span class="ajuda">arraste um número para os lados; ↑↓ ajustam</span></div>
      <pre id="e-cod"></pre>
    </div>
  </div>
  <div class="info" id="e-info"></div>
  <div class="mudancas" id="e-mud"></div>
  <div class="aviso" id="e-aviso"></div>`;
const $ = id => document.getElementById(id);
const cv = $('e-cv'), sobre = $('e-sobre'), ctx = cv.getContext('2d'), so = sobre.getContext('2d');
const CENAS = L.ABERTURA.cenas;
const ab = new L.Abertura('menu', false);
Object.defineProperty(ab, 'escuro', { get: () => 0 });   // sem o escuro da entrada e da saída
ab.seguir = ab.voltar = ab.pular = ab.terminar = () => {};

const est = { cena:0, tempo:0.5, zoom:1, mostra:'cena', grade:false, func:null };
try { Object.assign(est, JSON.parse(sessionStorage.getItem('ed_estado') || '{}')); } catch (e) {}
const guarda = () => { try { sessionStorage.setItem('ed_estado', JSON.stringify(est)); } catch (e) {} };
let tocando = false, sujo = true, sel = null;   // sel: { tipo:'ponto', p } ou { tipo:'num', k }
const desfazer = [];

CENAS.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = (i + 1) + '. ' + c.id; $('e-cena').appendChild(o); });
FUNCS.forEach((f, i) => {
  if (!f.nums.length) return;
  const o = document.createElement('option'); o.value = i;
  o.textContent = (f.tipo === 'metodo' ? f.obj + '.' : '') + f.nome + (Object.keys(ARQS).length > 1 ? '  (' + f.arq + ')' : '');
  $('e-func').appendChild(o);
});
$('e-cena').value = est.cena; $('e-zoom').value = est.zoom; $('e-mostra').value = est.mostra; $('e-grade').classList.toggle('on', est.grade);
if (window.__ED_SERVIDOR) $('e-salva').hidden = false;
if (window.__ED_ARTIFACT) $('e-baixa').hidden = true;   // o artifact do claude.ai não deixa baixar: copie as mudanças

const funcDaCena = () => FUNCS.find(f => f.tipo === 'metodo' && f.obj === 'AB_CENAS' && f.nome === CENAS[est.cena].id);
function aviso(s){ const a = $('e-aviso'); a.textContent = s; a.classList.add('ver'); clearTimeout(aviso.t); aviso.t = setTimeout(() => a.classList.remove('ver'), 2600); }

/* ---------- desenho da cena e dos pontos ---------- */
let pontos = [];
function desenha(){
  const k = est.zoom * DPR, w = Math.round(TW * k), h = Math.round(H * k);
  if (cv.width !== w || cv.height !== h){
    cv.width = sobre.width = w; cv.height = sobre.height = h;
    cv.style.width = sobre.style.width = (TW * est.zoom) + 'px'; cv.style.height = sobre.style.height = (H * est.zoom) + 'px';
  }
  ab.i = est.cena; ab.t = CENAS[est.cena].t * est.tempo; ab.tm = ab.t;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctxP = ctx; visto = new Map(); gravando = true;
  let erro = '';
  try { L.drawAbertura(ctx, ab); } catch (e){ erro = e.message; }
  gravando = false;
  // os pontos lidos neste quadro, onde o canvas estava quando o número foi lido
  const daCena = funcDaCena();
  pontos = [];
  if (est.mostra !== 'nada') PARES.forEach(p => {
    if (est.mostra === 'cena' && p.f !== daCena) return;
    const M = visto.get(p.kx); if (!M || !visto.has(p.ky)) return;
    const q = M.transformPoint({ x:V[p.kx], y:V[p.ky] });
    if (q.x < -20 || q.y < -20 || q.x > w + 20 || q.y > h + 20) return;
    pontos.push({ p, M, x:q.x, y:q.y });
  });
  so.setTransform(1, 0, 0, 1, 0, 0); so.clearRect(0, 0, w, h);
  if (est.grade){
    so.setTransform(k, 0, 0, k, 0, 0); so.lineWidth = 1 / k;
    for (let x = 0; x <= TW; x += 50){ so.strokeStyle = x % 100 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.3)'; so.beginPath(); so.moveTo(x, 0); so.lineTo(x, H); so.stroke(); }
    for (let y = 0; y <= H; y += 50){ so.strokeStyle = y % 100 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.3)'; so.beginPath(); so.moveTo(0, y); so.lineTo(TW, y); so.stroke(); }
    so.fillStyle = 'rgba(255,255,255,.75)'; so.font = (11 / est.zoom) + 'px monospace';
    for (let x = 100; x < TW; x += 100) so.fillText(x, x + 2, 11 / est.zoom);
    for (let y = 100; y < H; y += 100) so.fillText(y, 2, y - 2);
    so.setTransform(1, 0, 0, 1, 0, 0);
  }
  const r = 5 * DPR;
  pontos.forEach(o => {
    const s = sel && sel.tipo === 'ponto' && sel.p === o.p, m = mudou(NUMS[o.p.kx]) || mudou(NUMS[o.p.ky]);
    so.beginPath(); so.arc(o.x, o.y, s ? r * 1.5 : r, 0, Math.PI * 2);
    so.fillStyle = s ? '#3ec7ff' : (m ? '#7ee08a' : '#f2c23d'); so.fill();
    so.lineWidth = 2 * DPR; so.strokeStyle = '#1d1b18'; so.stroke();
  });
  if (erro){ so.fillStyle = 'rgba(160,30,30,.9)'; so.fillRect(0, 0, w, 30 * DPR); so.fillStyle = '#fff'; so.font = (14 * DPR) + 'px sans-serif'; so.fillText('Erro no desenho: ' + erro, 10 * DPR, 20 * DPR); }
  $('e-tempo').value = Math.round(est.tempo * 1000);
  $('e-tempo-txt').textContent = (CENAS[est.cena].t * est.tempo).toFixed(1).replace('.', ',') + ' s de ' + String(CENAS[est.cena].t).replace('.', ',');
}

/* ---------- código da função ---------- */
let funcCod = null;
function mostraCodigo(f, k){
  if (!f) return;
  if (f !== funcCod){
    funcCod = f; est.func = FUNCS.indexOf(f); guarda();
    $('e-func').value = FUNCS.indexOf(f);
    const A = ARQS[f.arq]; let h = '', pos = f.s;
    A.marcas.forEach(t => {
      if (t.e <= f.s || t.s >= f.e) return;
      h += esc(A.src.slice(pos, t.s));
      if (t.cls === 'n') h += '<span class="n' + (mudou(t) ? ' mud' : '') + '" data-k="' + t.k + '">' + esc(fmt(t, V[t.k])) + '</span>';
      else h += '<span class="' + t.cls + '">' + esc(A.src.slice(t.s, t.e)).replace(/\n/g, '</span>\n<span class="' + t.cls + '">') + '</span>';
      pos = t.e;
    });
    h += esc(A.src.slice(pos, f.e));
    const l0 = linhaDe(f.arq, f.s);
    $('e-cod').innerHTML = h.split('\n').map((l, i) => '<span class="ln"><span class="nr">' + (l0 + i) + '</span>' + l + '</span>').join('');
  }
  marcaSel();
  if (k != null){ const e = $('e-cod').querySelector('[data-k="' + k + '"]'); if (e) e.scrollIntoView({ block:'center', inline:'nearest' }); }
}
function marcaSel(){
  const ks = !sel ? [] : sel.tipo === 'num' ? [sel.k] : [sel.p.kx, sel.p.ky];
  $('e-cod').querySelectorAll('.n.sel').forEach(e => e.classList.remove('sel'));
  ks.forEach(k => { const e = $('e-cod').querySelector('[data-k="' + k + '"]'); if (e) e.classList.add('sel'); });
}
function atualizaNums(ks){
  ks.forEach(k => {
    const e = $('e-cod').querySelector('[data-k="' + k + '"]'); if (!e) return;
    e.textContent = fmt(NUMS[k], V[k]); e.classList.toggle('mud', mudou(NUMS[k]));
  });
  mostraMudancas(); sujo = true;
}
function mostraMudancas(){
  const r = mudancas(), box = $('e-mud');
  if (!r.length){ box.innerHTML = '<span class="vazio">Nenhuma mudança ainda. Arraste os pontos amarelos na cena ou os números azuis no código.</span>'; return; }
  box.innerHTML = '<b>' + r.length + (r.length > 1 ? ' linhas mudadas' : ' linha mudada') + '</b><br>' + r.map(m =>
    '<div>' + esc(m.arq) + ':' + m.linha + '</div><div class="menos">- ' + esc(m.antes.trim()) + '</div><div class="mais">+ ' + esc(m.depois.trim()) + '</div>').join('');
}

/* ---------- mexer nos valores ---------- */
function muda(lista){   // lista: [[k, valor]]; um passo do desfazer por gesto
  lista.forEach(([k, v]) => { V[k] = arred(NUMS[k], v); });
  atualizaNums(lista.map(x => x[0]));
}
let gesto = null;
function abreGesto(ks){ gesto = ks.map(k => [k, V[k]]); }
function fechaGesto(){ if (gesto && gesto.some(([k, v]) => V[k] !== v)) desfazer.push(gesto); gesto = null; }

const cssParaDev = e => { const r = sobre.getBoundingClientRect(); return { x:(e.clientX - r.left) * sobre.width / r.width, y:(e.clientY - r.top) * sobre.height / r.height }; };
function pontoPerto(q){
  let melhor = null, d0 = (10 * DPR) ** 2;
  pontos.forEach(o => { const d = (o.x - q.x) ** 2 + (o.y - q.y) ** 2; if (d <= d0){ d0 = d; melhor = o; } });
  return melhor;
}
const desc = p => { const t = NUMS[p.kx]; return t.arq + ':' + t.linha + '  ' + (t.f.tipo === 'metodo' ? t.f.obj + '.' : '') + t.f.nome + '  (' + fmt(t, V[p.kx]) + ', ' + fmt(NUMS[p.ky], V[p.ky]) + ')  ·  ' + ARQS[t.arq].src.split('\n')[t.linha - 1].trim(); };
function info(q, o){
  const k = est.zoom * DPR;
  $('e-info').textContent = 'x ' + Math.round(q.x / k) + ' · y ' + Math.round(q.y / k) + (o ? '   →   ' + desc(o.p) : '');
}
let arrasto = null;
sobre.addEventListener('pointerdown', e => {
  const q = cssParaDev(e), o = pontoPerto(q);
  if (!o){ sel = null; marcaSel(); sujo = true; return; }
  sel = { tipo:'ponto', p:o.p }; mostraCodigo(o.p.f, o.p.kx);
  const M = o.M, det = M.a * M.d - M.b * M.c;
  arrasto = { q, x0:V[o.p.kx], y0:V[o.p.ky], M, det };
  abreGesto([o.p.kx, o.p.ky]); sobre.setPointerCapture(e.pointerId); sujo = true; e.preventDefault();
});
sobre.addEventListener('pointermove', e => {
  const q = cssParaDev(e);
  if (!arrasto){ info(q, pontoPerto(q)); return; }
  const dx = q.x - arrasto.q.x, dy = q.y - arrasto.q.y, M = arrasto.M, det = arrasto.det || 1;
  const lx = (M.d * dx - M.c * dy) / det, ly = (-M.b * dx + M.a * dy) / det;   // de volta para as medidas do desenho
  muda([[sel.p.kx, arrasto.x0 + lx], [sel.p.ky, arrasto.y0 + ly]]);
  info(q, { p:sel.p });
});
const solta = () => { if (arrasto){ arrasto = null; fechaGesto(); } };
sobre.addEventListener('pointerup', solta); sobre.addEventListener('pointercancel', solta);

// números do código: clicar seleciona, arrastar para os lados muda (Shift: de 10 em 10)
let arrNum = null;
$('e-cod').addEventListener('pointerdown', e => {
  const s = e.target.closest('.n'); if (!s) return;
  const k = +s.dataset.k; sel = { tipo:'num', k }; marcaSel(); sujo = true;
  arrNum = { k, x:e.clientX, v:V[k] }; abreGesto([k]); s.setPointerCapture(e.pointerId); e.preventDefault();
});
$('e-cod').addEventListener('pointermove', e => {
  if (!arrNum) return;
  const t = NUMS[arrNum.k], n = Math.round((e.clientX - arrNum.x) / 4);
  muda([[arrNum.k, arrNum.v + n * passo(t) * (e.shiftKey ? 10 : 1)]]);
  const p = PARES.find(p => p.kx === arrNum.k || p.ky === arrNum.k);
  $('e-info').textContent = t.arq + ':' + t.linha + '  ' + fmt(t, t.v0) + ' → ' + fmt(t, V[arrNum.k]) + (p ? '' : '');
});
const soltaNum = () => { if (arrNum){ arrNum = null; fechaGesto(); } };
$('e-cod').addEventListener('pointerup', soltaNum); $('e-cod').addEventListener('pointercancel', soltaNum);

// teclado: setas mexem o ponto (ou o número) escolhido; Shift: de 10 em 10; Ctrl+Z desfaz; espaço toca
window.addEventListener('keydown', e => {
  if (e.target && /^(SELECT|INPUT|TEXTAREA)$/.test(e.target.tagName) && e.key !== 'z') return;
  const k = e.key, m = e.shiftKey ? 10 : 1;
  if ((e.ctrlKey || e.metaKey) && (k === 'z' || k === 'Z')){ volta(); }
  else if (k === ' '){ toca(!tocando); }
  else if (sel && sel.tipo === 'ponto' && /^Arrow/.test(k)){
    const dx = k === 'ArrowLeft' ? -m : k === 'ArrowRight' ? m : 0, dy = k === 'ArrowUp' ? -m : k === 'ArrowDown' ? m : 0;
    abreGesto([sel.p.kx, sel.p.ky]); muda([[sel.p.kx, V[sel.p.kx] + dx], [sel.p.ky, V[sel.p.ky] + dy]]); fechaGesto();
  }
  else if (sel && sel.tipo === 'num' && (k === 'ArrowUp' || k === 'ArrowDown')){
    const t = NUMS[sel.k]; abreGesto([sel.k]); muda([[sel.k, V[sel.k] + (k === 'ArrowUp' ? 1 : -1) * passo(t) * m]]); fechaGesto();
  }
  else return;
  e.preventDefault(); e.stopPropagation();
}, true);

function volta(){ const g = desfazer.pop(); if (!g) return aviso('Nada para desfazer'); g.forEach(([k, v]) => { V[k] = v; }); atualizaNums(g.map(x => x[0])); }

/* ---------- barra ---------- */
function toca(on){ tocando = on; $('e-toca').textContent = on ? '⏸ Parar' : '▶ Tocar'; $('e-toca').classList.toggle('on', on); }
$('e-toca').onclick = () => toca(!tocando);
$('e-cena').onchange = e => { est.cena = +e.target.value; est.tempo = 0.5; guarda(); sel = null; mostraCodigo(funcDaCena()); sujo = true; };
$('e-tempo').oninput = e => { est.tempo = e.target.value / 1000; toca(false); guarda(); sujo = true; };
$('e-zoom').onchange = e => { est.zoom = +e.target.value; guarda(); sujo = true; };
$('e-mostra').onchange = e => { est.mostra = e.target.value; guarda(); sujo = true; };
$('e-grade').onclick = () => { est.grade = !est.grade; $('e-grade').classList.toggle('on', est.grade); guarda(); sujo = true; };
$('e-func').onchange = e => { sel = null; mostraCodigo(FUNCS[+e.target.value]); };
$('e-desfaz').onclick = volta;
$('e-original').onclick = () => {
  const ks = NUMS.filter(mudou).map(t => t.k); if (!ks.length) return;
  if (!confirm('Desfazer todas as ' + ks.length + ' mudanças?')) return;
  desfazer.push(ks.map(k => [k, V[k]])); ks.forEach(k => { V[k] = NUMS[k].v0; }); atualizaNums(ks);
};
function textoChat(){
  const r = mudancas(); if (!r.length) return '';
  return 'Ajustes feitos no editor de desenhos:\n\n' + r.map(m => m.arq + ':' + m.linha + '\n- ' + m.antes.trim() + '\n+ ' + m.depois.trim()).join('\n\n');
}
$('e-copia').onclick = () => {
  const s = textoChat(); if (!s) return aviso('Nenhuma mudança para copiar');
  const ok = () => aviso('Copiado: cole no chat');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(s).then(ok, () => copiaVelho(s, ok)); else copiaVelho(s, ok);
};
function copiaVelho(s, ok){ const t = document.createElement('textarea'); t.value = s; raiz.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { prompt('Copie:', s); } t.remove(); }
const arqsMudados = () => Object.keys(ARQS).filter(a => NUMS.some(t => t.arq === a && mudou(t)));
$('e-baixa').onclick = () => {
  const arqs = arqsMudados(); if (!arqs.length) return aviso('Nenhuma mudança para baixar');
  arqs.forEach(a => {
    const u = URL.createObjectURL(new Blob([textoNovo(a)], { type:'text/javascript' })), l = document.createElement('a');
    l.href = u; l.download = a.split('/').pop(); document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 1000);
  });
  aviso('Baixado: troque o arquivo em src/ e rode python3 montar.py');
};
$('e-salva').onclick = async () => {
  const arqs = arqsMudados(); if (!arqs.length) return aviso('Nenhuma mudança para salvar');
  for (const a of arqs){
    let r; try { r = await (await fetch('/salvar', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ arquivo:a, texto:textoNovo(a) }) })).json(); }
    catch (e){ r = { ok:false, erro:e.message }; }
    if (!r.ok) return aviso('Não salvou ' + a + ': ' + r.erro);
  }
  est.tempo = est.tempo; guarda();
  aviso('Salvo em src/ (e lanchonete.html montado). Recarregando...'); setTimeout(() => location.reload(), 900);
};
window.addEventListener('beforeunload', e => { if (arqsMudados().length && !$('e-salva').dataset.salvando){ e.preventDefault(); e.returnValue = ''; } });
$('e-salva').addEventListener('click', () => { $('e-salva').dataset.salvando = '1'; }, true);

/* ---------- laço ---------- */
let t0 = performance.now();
function quadro(ts){
  const dt = Math.min(0.1, (ts - t0) / 1000); t0 = ts;
  if (tocando){ est.tempo = (est.tempo + dt / CENAS[est.cena].t) % 1; sujo = true; }
  if (sujo){ sujo = false; desenha(); }
  requestAnimationFrame(quadro);
}
mostraCodigo(FUNCS[est.func] && est.func != null ? FUNCS[est.func] : funcDaCena());
mostraMudancas();
if (falhas.length){ aviso('Algumas funções não puderam ser trocadas: ' + falhas.join('; ')); console.warn(falhas); }
$('e-info').textContent = 'Arraste os pontos amarelos (x,y do código) ou os números azuis. Setas mexem o escolhido; Shift: de 10 em 10.';
requestAnimationFrame(quadro);
window.__editor = { V, NUMS, FUNCS, PARES, mudancas, textoNovo, pontos: () => pontos, falhas };   // para os testes
})();
