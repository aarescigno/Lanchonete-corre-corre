// capturas da v12.11.2 em ../capturas/v12_11_2 (CA3): o couvert cinza (sem contratar) e contratado, e o Cardápio da Avenida e do Terraço com a cabecinha em cada curso.
// 960x540 e 844x390. Confira recortes ampliados e apague. Uso: node shot_v12_11_2.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_11_2'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const LOJA = (p, grupo, tab, extra) => BASE + "g.mode='carreira';g.save=L.normSave({dia:50,bank:20000,cap:12,maxDay:50,v10:1,salao:{ponto:'" + p + "'}});g.up=g.save.up;g.setDev(true);" + (extra || '') + "g.buildTables();g.goShop(50);L.setShopGrupo('" + grupo + "');L.setShopTab('" + tab + "');";
const CENAS = [
  ['couvert_cinza', LOJA('avenida', 'lanchonete', 'melhorias', "g.save.equipe.couvert=false;g.save.equipe.taxa=true;")],
  ['couvert_contratado', LOJA('avenida', 'lanchonete', 'melhorias', "g.save.equipe.couvert=true;g.save.equipe.taxa=true;")],
  ['cardapio_avenida', LOJA('avenida', 'lanchonete', 'cardapio')],
  ['cardapio_terraco', LOJA('terraco', 'lanchonete', 'cardapio')],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width:960, height:540 }, { width:844, height:390 }]) {
    const ctx = await b.newContext({ viewport:vp, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r);
      await pg.waitForTimeout(700);
      await pg.screenshot({ path:path.join(OUT, f + '_' + vp.width + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
