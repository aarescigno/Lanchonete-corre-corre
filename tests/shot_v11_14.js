// capturas da v11.14 (a abertura nova: a perda e a promessa) em ../capturas/v11_14: as cenas 6, 7 e 8 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390),
// outros instantes (a 8 em p 0,15 e 0,3, o tempo passando), a troca da 7 para a 8, as cenas 1 e 2 de novo e o movimento reduzido. Confira em recorte
// (PIL crop + resize), contra docs/ABERTURA.md §3 e §8, e descarte: capturas não vão para o git. Uso: node shot_v11_14.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_14'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
// abre a abertura nova pelo modo dev e para o relógio na cena i (de 0), no instante t (s); tm é o relógio dos gestos
const CENA = (i, t) => `const L=window.__lcc; L.DEV.on=true; L.devAssistir(0); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=${i}; ab.t=${t}; ab.tm=${(10 + i * 7 + t).toFixed(2)};`;
const P = (i, p) => CENA(i, Math.round(window_t[i] * p * 1000) / 1000);
const window_t = [7, 7, 7, 7, 7, 7, 7, 8, 6, 6, 8];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const lista = [];
  [[1220, 600, ''], [844, 390, '_cel']].forEach(([w, h, suf]) => [5, 6, 7].forEach(i => [0.25, 0.6, 0.9].forEach(p => lista.push(['cena' + (i + 1) + '_p' + String(p).replace('.', '') + suf, P(i, p), w, h, false]))));
  [[5, [0.05, 0.15, 0.35, 0.45, 0.8, 0.95]], [6, [0.05, 0.45, 0.56, 0.7, 0.8, 0.99]], [7, [0.01, 0.06, 0.15, 0.24, 0.3, 0.36, 0.5, 0.7, 0.88, 0.99]]].forEach(([i, ps]) => ps.forEach(p => lista.push(['cena' + (i + 1) + '_x' + String(Math.round(p * 100)).padStart(2, '0'), P(i, p), 1220, 600, false])));
  lista.push(['troca_7_fim', CENA(6, 6.99), 1220, 600, false], ['troca_8_comeco', CENA(7, 0.01), 1220, 600, false]);
  [0, 1].forEach(i => [0.25, 0.6, 0.9].forEach(p => lista.push(['cena' + (i + 1) + '_p' + String(p).replace('.', ''), P(i, p), 1220, 600, false])));
  [5, 6, 7].forEach(i => lista.push(['cena' + (i + 1) + '_rm', CENA(i, 0), 1220, 600, true]));
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
