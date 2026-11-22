// capturas da v12.10.1 em ../capturas/v12_10_1: os 6 pratos de estrada ao lado dos parecidos (CA7) e a cozinha com e sem o suor (CA8). Confira recortes ampliados e apague.
// Uso: node shot_v12_10_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_10_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const PRATOS = BASE + "document.body.innerHTML='';document.body.style.cssText='background:#E8E2D0;margin:0';const ks=['pastelFrango','pastelCarneSeca','xSalada','xTudo','enroladinho','bolinhoCarneSeca','pastel','pastelP','bauru','risoles','bolinho'];const c=document.createElement('canvas');c.width=ks.length*100;c.height=230;document.body.appendChild(c);const x=c.getContext('2d');ks.forEach((k,i)=>{[false,true].forEach((av,j)=>{L.drawDish(x,k,50+i*100,55+j*100,3,false,'boi',av);});});";
const SV = (ponto) => "g.save=L.normSave({dia:20,bank:9000,cap:8,maxDay:20,v10:1,pontoDia:5,salao:{ponto:'" + ponto + "'},tonDeg:1,cursos:{pastel:{garagem:1}}});g.up=g.save.up;g.tablesKey='';g.buildTables();g.startDay(20);g.begin();g.schedule=[];g.nextIdx=0;";
const CENAS = [
  ['pratos', PRATOS],
  ['cozinha_sem', BASE + SV('avenida') + "L.DEV.on=false;"],
  ['cozinha_suor', BASE + SV('avenida') + "L.DEV.on=true;L.DEV.forca.suor='1';"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const rm of [false, true]) {
    const ctx = await b.newContext({ viewport:{ width:960, height:540 }, deviceScaleFactor:2, reducedMotion: rm ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; if (rm && f === 'pratos') continue; f_ = f;
      if (f === 'pratos') await pg.setViewportSize({ width:1120, height:240 }); else await pg.setViewportSize({ width:960, height:540 });
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(900);
      await pg.screenshot({ path:path.join(OUT, f + (rm ? '_rm' : '') + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
