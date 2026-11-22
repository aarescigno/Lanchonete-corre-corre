// capturas da v12.10.2 em ../capturas/v12_10_2: a aba Caderno com uma página da Garagem e uma do Terraço (CA8). Confira recortes ampliados e apague.
// Uso: node shot_v12_10_2.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_10_2'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const CAD = (cursos, ponto) => BASE + "g.save=L.normSave({dia:60,bank:9000,cap:12,maxDay:60,v10:1,pontoDia:50,salao:{ponto:'" + ponto + "'},tonDeg:1,cursos:" + cursos + "});g.save.manual=[];g.save.manualNovo=[];g.save.manualNovo.push('cad:pastel.industrial');g.save.manual.push('cad:pastel.industrial');document.getElementById('btn-manual').click();Array.from(document.querySelectorAll('#manual-abas button')).find(b=>b.textContent==='Caderno').click();";
const CENAS = [
  ['caderno_garagem', CAD("{pastel:{garagem:1,industrial:1},chapa:{garagem:1}}", 'industrial')],
  ['caderno_terraco', CAD("{pastel:{garagem:1,industrial:1,avenida:1,terraco:1},pf:{terraco:1},alta:{terraco:1}}", 'terraco')],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const rm of [false, true]) {
    const ctx = await b.newContext({ viewport:{ width:960, height:540 }, deviceScaleFactor:2, reducedMotion: rm ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
      await pg.setViewportSize({ width:960, height:540 });
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(900);
      await pg.screenshot({ path:path.join(OUT, f + (rm ? '_rm' : '') + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
