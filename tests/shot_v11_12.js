// capturas da v11.12 (a abertura nova: o motor e as cenas 1 e 2) em ../capturas/v11_12: as cenas 1 e 2 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390),
// a troca da 1 para a 2, um cartão de obra, as transições passa e iris e a cena 2 com movimento reduzido. Confira em recorte (PIL crop + resize), contra
// docs/ABERTURA.md §3, e descarte: capturas não vão para o git. Uso: node shot_v11_12.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_12'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
// abre a abertura nova pelo modo dev e para o relógio na cena i (de 0), no instante t (s); tm é o relógio dos gestos
const CENA = (i, t) => `const L=window.__lcc; L.DEV.on=true; L.devAssistir(1); const ab=L.aberturaAtual(); ab.update=()=>{}; ab.i=${i}; ab.t=${t}; ab.tm=${(10 + i * 7 + t).toFixed(2)};`;
const P = (i, p) => CENA(i, Math.round(window_t[i] * p * 1000) / 1000);
const window_t = [7, 7, 7, 7, 7, 7, 7, 8, 6, 6, 8];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const lista = [];
  [[1220, 600, ''], [844, 390, '_cel']].forEach(([w, h, suf]) => [0, 1].forEach(i => [0.25, 0.6, 0.9].forEach(p => lista.push(['cena' + (i + 1) + '_p' + String(p).replace('.', '') + suf, P(i, p), w, h, false]))));
  lista.push(['cena1_p74', P(0, 0.74), 1220, 600, false], ['cena1_p80', P(0, 0.8), 1220, 600, false], ['cena1_p86', P(0, 0.86), 1220, 600, false], ['cena1_p0', P(0, 0.02), 1220, 600, false], ['cena1_p45', P(0, 0.47), 1220, 600, false], ['cena1_p1', P(0, 0.995), 1220, 600, false]);
  lista.push(['cena2_p0', P(1, 0.02), 1220, 600, false], ['cena2_p12', P(1, 0.12), 1220, 600, false], ['cena2_p40', P(1, 0.4), 1220, 600, false], ['cena2_p87', P(1, 0.868), 1220, 600, false]);
  lista.push(['troca_1_fim', CENA(0, 6.95), 1220, 600, false], ['troca_2_comeco', CENA(1, 0.05), 1220, 600, false], ['cena2_escuro', CENA(1, 6.75), 1220, 600, false]);
  lista.push(['obra_cena3', CENA(2, 3.5), 1220, 600, false], ['obra_cena9_fala', CENA(8, 3.5), 1220, 600, false], ['obra_cena11', CENA(10, 6), 1220, 600, false]);
  lista.push(['trans_passa', CENA(2, 6.75), 1220, 600, false], ['trans_iris_fecha', CENA(3, 6.65), 1220, 600, false], ['trans_iris_abre', CENA(3, 6.9), 1220, 600, false]);
  lista.push(['cena1_rm', CENA(0, 0), 1220, 600, true], ['cena2_rm', CENA(1, 0), 1220, 600, true], ['cena2_rm_cel', CENA(1, 0), 844, 390, true]);
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
