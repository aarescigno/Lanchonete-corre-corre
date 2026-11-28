// capturas da v12.12 em ../capturas/v12_12 (CA7): cada um dos 7 em quatro momentos da dancinha (parado, p 0,25, 0,5 e 0,75) e com prefers-reduced-motion (p 0,5), em recortes (DSF 2); depois as folhas de contato (PIL).
// Confira ampliando e apague. Uso: node shot_v12_12.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_12'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const QUEM = ['bia', 'tonhao', 'dani', 'joca', 'cami', 'anselmo', 'lia'];
const MOMENTOS = [['parado', 0], ['p25', 0.25], ['p50', 0.5], ['p75', 0.75]];
const PREP = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;" +
  "g.mode='carreira';g.save=L.normSave({dia:65,maxDay:65,bank:99999,up:{tenis:true},equipe:{tonhao:1,dani:1,joca:2,cami:2,anselmo:2,lia:1},salao:{ponto:'terraco'}});g.up=g.save.up;g.tablesKey='';g.buildTables();g.startDay(65);g.begin();" +
  "g.update=function(){};" +   // o relógio do jogo para: só o desenho, com o progresso da dancinha que a captura escolhe
  "g.bia.x=450;g.bia.y=330;g.dani.x=380;g.dani.y=470;g.joca.x=520;g.joca.y=470;g.cami.x=640;g.cami.y=470;g.dani.hands=[];g.joca.hands=[];g.cami.hands=[];";
const CENTRO = { bia:g => [450, 330], tonhao:() => [930, 172], dani:() => [380, 470], joca:() => [520, 470], cami:() => [640, 470], anselmo:() => [650, 118], lia:() => [868, 203] };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const rm of [false, true]) {
    const ctx = await b.newContext({ viewport:{ width:1220, height:650 }, deviceScaleFactor:2, reducedMotion:rm ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.stack).split('\n').slice(0, 3).join(' <- ')));
    await pg.goto('file://' + W); await pg.waitForTimeout(500);
    const r = await pg.evaluate('(()=>{try{' + PREP + 'return ""}catch(e){return String(e.stack)}})()'); if (r) console.log('prep', r);
    const k = await pg.evaluate('(()=>{const c=document.querySelector("canvas").getBoundingClientRect();return [c.left,c.top,c.width/1220,window.__game.cam]})()');
    for (const q of QUEM) {
      const [cx, cy] = CENTRO[q]();
      for (const [nome, p] of (rm ? [['rm', 0.5]] : MOMENTOS)) {
        await pg.evaluate('(()=>{const g=window.__game;g.eggs={};' + (p ? 'g.eggs.' + q + '={n:0,t:0,p:' + p + '};' : '') + '})()');
        await pg.waitForTimeout(120);
        const sx = k[0] + (cx + k[3]) * k[2], sy = k[1] + cy * k[2];
        await pg.screenshot({ path:path.join(OUT, q + '_' + nome + '.png'), clip:{ x:Math.max(0, sx - 55), y:Math.max(0, sy - 105), width:110, height:125 } });
      }
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
