// capturas da v9.2.1 (sessão 3b-2d) em ../capturas/v9_2_1: o painel do modo dev no menu, na lojinha e na pausa de um dia (com os preços de verdade ligados).
// Uso: node shot_v9_2_1.js [filtro]
// Uso: node shot_v9_2_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_2_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const DEVON = "if(!L.DEV.on) for(let i=0;i<10;i++) document.getElementById('vtag').click(); ";
const CENAS = [
  ['painel_menu', BASE + DEVON + "L.abrirDev();"],
  ['painel_loja', BASE + DEVON + "g.save.dia=9; g.goShop(9); L.abrirDev();"],
  ['painel_pausa', BASE + DEVON + "L.devReal && g.devReal(true); g.devCaixa(500); g.devDia(9); g.startDay(9); g.begin(); g.setState('playing'); g.pause(); L.abrirDev();"],
  ['selo_menu', BASE + DEVON],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_celular_deitado', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
