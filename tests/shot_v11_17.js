// capturas da v11.17 (o final novo, etapa 10b) em ../capturas/v11_17: as cenas 4, 5 e 6 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 5 também em p 0,8 (a foto),
// as trocas passa (4 para 5 e 5 para 6) e outros instantes. Confira em recorte (PIL crop + resize), contra docs/FINAL.md §3 e §7, e descarte:
// capturas não vão para o git. Uso: node shot_v11_17.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_17'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const TS = { 3:8, 4:8, 5:8.5 };   // a duração de cada cena (índices 3, 4 e 5 do FINAL2 com 3 estrelas)
// abre o final novo pelo modo dev (3 estrelas) e para o relógio na cena i (de 0), no instante t (s); tm é o relógio dos gestos
const CENA = (i, t) => `const L=window.__lcc; L.DEV.on=true; L.devFinal(3, L.FINAL2); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=${i}; ab.t=${t}; ab.tm=${(10 + i * 7 + t).toFixed(2)};`;
const P = (i, p) => CENA(i, Math.round(TS[i] * p * 1000) / 1000);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const lista = [];
  [[1220, 600, ''], [844, 390, '_cel']].forEach(([w, h, suf]) => [3, 4, 5].forEach(i => [0.25, 0.6, 0.9].forEach(p => lista.push(['cena' + (i + 1) + '_p' + String(p).replace('.', '') + suf, P(i, p), w, h, false]))));
  lista.push(['cena5_p08', P(4, 0.8), 1220, 600, false], ['cena5_p08_cel', P(4, 0.8), 844, 390, false]);
  [[3, [0.05, 0.15, 0.3, 0.38, 0.45, 0.65, 0.78, 0.99]], [4, [0.05, 0.15, 0.3, 0.4, 0.5, 0.58, 0.62, 0.7]], [5, [0.05, 0.15, 0.22, 0.3, 0.4, 0.5, 0.62, 0.72, 0.85, 0.99]]].forEach(([i, ps]) => ps.forEach(p => lista.push(['cena' + (i + 1) + '_x' + String(Math.round(p * 100)).padStart(2, '0'), P(i, p), 1220, 600, false])));
  lista.push(['troca_4_5', P(3, 0.97), 1220, 600, false], ['troca_5_6', P(4, 0.97), 1220, 600, false]);
  [3, 4, 5].forEach(i => lista.push(['cena' + (i + 1) + '_rm', CENA(i, 0), 1220, 600, true]));
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
