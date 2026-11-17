// capturas da v11.16 (o final novo, etapa 10a) em ../capturas/v11_16: as cenas 1, 2 e 3 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 2 com 1, 2 e 3 estrelas em p 0,9,
// as trocas (corte da 1 para a 2, íris da 2 para a 3), o Terraço de noite e outros instantes. Confira em recorte (PIL crop + resize), contra docs/FINAL.md §3 e §6, e descarte:
// capturas não vão para o git. Uso: node shot_v11_16.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_16'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const TS = [6.5, 8, 7.5];
// abre o final novo pelo modo dev (est estrelas) e para o relógio na cena i (de 0), no instante t (s); tm é o relógio dos gestos
const CENA = (est, i, t) => `const L=window.__lcc; L.DEV.on=true; L.devFinal(${est}, L.FINAL); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=${i}; ab.t=${t}; ab.tm=${(10 + i * 7 + t).toFixed(2)};`;
const P = (i, p, est) => CENA(est || 1, i, Math.round(TS[i] * p * 1000) / 1000);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const lista = [];
  [[1220, 600, ''], [844, 390, '_cel']].forEach(([w, h, suf]) => [0, 1, 2].forEach(i => [0.25, 0.6, 0.9].forEach(p => lista.push(['cena' + (i + 1) + '_p' + String(p).replace('.', '') + suf, P(i, p), w, h, false]))));
  [1, 2, 3].forEach(e => lista.push(['cena2_est' + e + '_p09', P(1, 0.9, e), 1220, 600, false]));
  [[0, [0.05, 0.15, 0.3, 0.38, 0.46, 0.7, 0.8, 0.99]], [1, [0.05, 0.1, 0.2, 0.33, 0.45, 0.55, 0.65, 0.72, 0.8, 0.99]], [2, [0.05, 0.2, 0.32, 0.42, 0.5, 0.56, 0.62, 0.7, 0.8, 0.99]]].forEach(([i, ps]) => ps.forEach(p => lista.push(['cena' + (i + 1) + '_x' + String(Math.round(p * 100)).padStart(2, '0'), P(i, p), 1220, 600, false])));
  lista.push(['troca_corte', P(0, 0.985), 1220, 600, false], ['troca_iris', P(1, 0.97), 1220, 600, false]);
  lista.push(['terraco_noite', "const L=window.__lcc; L.DEV.on=true; L.devFinal(1, L.FINAL); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=0; ab.t=1; ab.tm=11; const o=L.AB2_CENAS.telefone; L.AB2_CENAS.telefone=function(c,p,T,cam){ L.ab2Terraco(c,cam,'noite',{T}); return {}; };", 1220, 600, false]);
  [0, 1, 2].forEach(i => lista.push(['cena' + (i + 1) + '_rm', CENA(1, i, 0), 1220, 600, true]));
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
