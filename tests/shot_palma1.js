// capturas da palma.1 (P2-1): o mundo em pé com o cenário provisório. Uso: node shot_palma1.js [pasta de saída]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'capturas', 'palma1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const Wp = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(Wp, html);
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const RUN = "const roda=(s,c)=>{for(let i=0;i<s/0.05;i++){g.update(0.05);if(c&&c())return true;}return false;};";
const DIA = (ponto, n) => "g.save=L.normSave({dia:" + n + ",bank:3000,maxDay:" + n + (ponto ? ",salao:{ponto:'" + ponto + "'}" : "") + "}); g.up=g.save.up; g.startDay(" + n + "); const bt=document.getElementById('btn-start'); bt&&bt.click(); if(g.state!=='playing') g.begin(); ";
const GENTE = RUN + "for(let i=0;i<6;i++){ g.spawn({type:'estudante',color:i%4}); } roda(14); g.tapStation('order',0,0); roda(2);";
const CENAS = [['garagem', BASE + DIA(null, 3) + GENTE], ['industrial', BASE + DIA('industrial', 8) + GENTE], ['avenida', BASE + DIA('avenida', 12) + GENTE], ['menu', "document.getElementById('ov-menu').classList.add('show')"]];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vw, vh] of [['_390x844', 390, 844], ['_pc', 1280, 720]]) {
    const ctx = await b.newContext({ viewport:{ width:vw, height:vh }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      await pg.goto('file://' + Wp); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(1200);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  await b.close(); console.log(errs.length ? 'ERROS: ' + errs.join('\n') : 'sem erros de página');
})();
