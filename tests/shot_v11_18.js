// capturas da v11.18 (o final novo no ar, etapa 10c) em ../capturas/v11_18: as cenas 7 (ceu), 8 (roda) e os créditos em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390),
// a roda lado a lado com a cena 1 da abertura (porta) nos mesmos p, a folha das 8 cenas com 3 estrelas em p 0,6 e a transição. Confira em recorte (PIL crop + resize),
// contra docs/FINAL.md §2, §3 e §8, e descarte: capturas não vão para o git. Uso: node shot_v11_18.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_18'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const TS = [6.5, 8, 7.5, 8, 8, 8.5, 8, 9, 6];   // a duração de cada cena do final com 3 estrelas e os créditos (índices 0 a 8)
// abre o final pelo modo dev (3 estrelas) e para o relógio na cena i (de 0), no instante t (s); tm é o relógio dos gestos
const CENA = (i, t) => `const L=window.__lcc; L.DEV.on=true; L.devFinal(3, L.FINAL); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=${i}; ab.t=${t}; ab.tm=${(10 + i * 7 + t).toFixed(2)};`;
const P = (i, p) => CENA(i, Math.round(TS[i] * p * 1000) / 1000);
// a cena 1 da abertura (porta, 7 s) nos mesmos p
const ABERT = p => `const L=window.__lcc; L.DEV.on=true; L.devAssistir(0); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=0; ab.t=${Math.round(7 * p * 1000) / 1000}; ab.tm=${(10 + 7 * p).toFixed(2)};`;
(async () => {
  const b = await chromium.launch(); const errs = [];
  const lista = [];
  [[1220, 600, ''], [844, 390, '_cel']].forEach(([w, h, suf]) => [6, 7, 8].forEach(i => [0.25, 0.6, 0.9].forEach(p => lista.push(['cena' + (i + 1) + '_p' + String(p).replace('.', '') + suf, P(i, p), w, h, false]))));
  [0.25, 0.6, 0.9].forEach(p => lista.push(['abertura1_p' + String(p).replace('.', ''), ABERT(p), 1220, 600, false]));
  [[6, [0.05, 0.15, 0.3, 0.45, 0.58, 0.7, 0.8, 0.88, 0.99]], [7, [0.05, 0.2, 0.36, 0.45, 0.55, 0.65, 0.75, 0.84, 0.99]], [8, [0.05, 0.15, 0.3, 0.5, 0.7, 0.99]]].forEach(([i, ps]) => ps.forEach(p => lista.push(['cena' + (i + 1) + '_x' + String(Math.round(p * 100)).padStart(2, '0'), P(i, p), 1220, 600, false])));
  for (let i = 0; i < 9; i++) lista.push(['folha_' + (i + 1), P(i, 0.6), 1220, 600, false]);
  [6, 7, 8].forEach(i => lista.push(['cena' + (i + 1) + '_rm', CENA(i, 0), 1220, 600, true]));
  lista.push(['troca_7_8', P(6, 0.97), 1220, 600, false]);
  for (const [f, js, w, h, rm] of lista) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:1, reducedMotion: rm ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f + ': ' + String(e)));
    await pg.goto('file://' + W); await pg.waitForTimeout(400);
    await pg.evaluate(js); await pg.waitForTimeout(250);
    await pg.screenshot({ path: path.join(OUT, f + '.png') });
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT);
})();
