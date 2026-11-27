// capturas da v12.11 em ../capturas/v12_11 (CA10): a Avenida com 12 mesas de 2 no jogo e no editor (estoque vazio e com mesas), a mesa arrastada por cima de outra,
// o balãozinho de uma mesa do estoque, a área industrial e o Terraço com 10 mesas de 2. 960x540 e 844x390. Confira recortes ampliados e apague.
// Uso: node shot_v12_11.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_11'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// n mesas de 2 arrumadas no ponto; est: quantas ficam no estoque (as últimas)
const SV = (ponto, n, est) => "const P=L.pontoOf('" + ponto + "'), tot=Array(" + n + ").fill(2).map((s,c)=>({x:0,y:0,seats:s,c:c%4})), sal=L.salaoAuto(tot.slice(0," + (n - est) + "),P);" +
  "g.save=L.normSave({dia:50,bank:9000,cap:12,maxDay:50,v10:1,pontoDia:5,salao:{ponto:'" + ponto + "'},tonDeg:1,cursos:{pastel:{garagem:1}}});g.up=g.save.up;g.save.salao.mesas=sal;g.save.salao.estoque=tot.slice(" + (n - est) + ").map(m=>({seats:2,c:m.c}));g.tablesKey='';g.buildTables();";
const JOGO = (p, n) => BASE + SV(p, n, 0) + "g.startDay(50);g.begin();g.schedule=[];g.nextIdx=0;";
const EDITOR = (p, n, est, extra) => BASE + SV(p, n, est) + "g.goShop(50);L.setShopGrupo('lanchonete');L.setShopTab('salao');" + (extra || '');
const CENAS = [
  ['avenida_jogo', JOGO('avenida', 12)],
  ['industrial_jogo', JOGO('industrial', 10)],
  ['terraco_jogo', JOGO('terraco', 10)],
  ['avenida_editor_vazio', EDITOR('avenida', 12, 0)],
  ['avenida_editor_estoque', EDITOR('avenida', 12, 4)],
  ['avenida_editor_balao', EDITOR('avenida', 12, 4, "g.estoqueSel=1;L.setShopTab('salao');")],
  ['avenida_arrasto', EDITOR('avenida', 12, 0), 'arrasto'],
  ['avenida_arrasto_cheio', EDITOR('avenida', 12, 0), 'arrasto2'],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width:960, height:540 }, { width:844, height:390 }]) {
    const ctx = await b.newContext({ viewport:vp, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js, mov] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(700);
      if (mov) {   // arrasta a mesa 1 do salão sobre a 4 (arrasto) ou sobre a 3 da fileira de baixo (arrasto2), sem soltar
        const info = await pg.evaluate("(()=>{const g=window.__game, cv=document.querySelector('#shop-grid canvas'), r=cv.getBoundingClientRect(), m=g.save.salao.mesas;return {l:r.left,t:r.top,w:r.width,h:r.height,m:m.map(x=>[x.x,x.y])};})()");
        const pt = (x, y) => [info.l + x * info.w / 800, info.t + (y - 56) * info.h / 484];
        const A = info.m[0], B = info.m[mov === 'arrasto' ? 3 : 9];
        const a = pt(A[0], A[1] + 20), z = pt(B[0], B[1] + 20);
        await pg.mouse.move(a[0], a[1]); await pg.mouse.down(); await pg.mouse.move((a[0] + z[0]) / 2, (a[1] + z[1]) / 2, { steps:6 }); await pg.mouse.move(z[0], z[1], { steps:6 }); await pg.waitForTimeout(300);
      }
      await pg.screenshot({ path:path.join(OUT, f + '_' + vp.width + '.png') });
      if (mov) await pg.mouse.up();
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
