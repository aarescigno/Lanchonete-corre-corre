// capturas da v9.0.1 em ../capturas/v9.0.1: grupo Lanchonete com o selo, Cardápio, Tonhão (sem curso e com 2 cursos) e o balão da conversa
// (cardápio e cap. 1) perto do Pular; tela larga, 1600x800, celular deitado e em pé
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9.0.1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc; g.save=L.normSave({dia:4,bank:%B%,cursos:%C%,up:{tenis:true}}); g.up=g.save.up; g.goShop(4);";
const base = (b, c) => BASE.replace('%B%', b).replace('%C%', c);
const CENAS = [
  ['lanchonete', base(200, '{}')],
  ['cardapio', base(200, '{}') + "L.setShopTab('cardapio');"],
  ['tonhao_sem', base(200, '{}') + "L.setShopTab('tonhao');"],
  ['tonhao_com', base(900, '{pastel:1,chapa:1}') + "L.setShopTab('tonhao');"],
  ['conv_cardapio', base(200, '{}') + "L.falar(L.HIST_CARDAPIO.falas, ()=>{});"],
  ['conv_cap1', base(200, '{}') + "L.falar(L.HISTORIA[0].antes.filter(f=>f.q==='tonhao').length?L.HISTORIA[0].antes:L.HISTORIA[0].antes, ()=>{});"]];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_1600', [1600, 800], false], ['_celular_deitado', [740, 360], true], ['_celular_em_pe', [390, 844], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      if (f === 'conv_cap1') await pg.evaluate("()=>{ const c=window.__game.conversa; while(c && c.fala && c.fala.q!=='tonhao') c.seguir(); }");
      await pg.waitForTimeout(300);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
