// capturas da v12.11.1 em ../capturas/v12_11_1 (CA3): a chuva da Avenida e do Terraço (calçada e foyer secos, chuvisco nas janelas, um quadro com relâmpago e um com movimento reduzido),
// a chuva da Garagem e da área industrial como antes e o sofá da Avenida cheio (pernas). 960x540 e 844x390. Confira recortes ampliados e apague.
// Uso: node shot_v12_11_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_11_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const DIA = (p, extra) => BASE + "g.save=L.normSave({dia:50,bank:9000,cap:12,maxDay:50,v10:1,pontoDia:5,salao:{ponto:'" + p + "'},tonDeg:1,cursos:{pastel:{garagem:1}}});g.up=g.save.up;" + (extra || '') + "g.tablesKey='';g.buildTables();g.clima='chuva';g.startDay(50);g.clima='chuva';g.begin();g.schedule=[];g.nextIdx=0;g.spawn({type:'estudante',color:1,vip:false});";
const SOFA = "g.up.assento=g.save.up.assento='sofa';";
const GENTE = "['familia','estudante','negocios','vovos','executiva','familia'].forEach((t,i)=>{try{g.spawn({type:t,color:i%4,vip:false});}catch(e){}});";
const FLASH = "setInterval(()=>{L.DEV.relampago=g.anim;},100);";
const CENAS = [
  ['avenida_chuva', DIA('avenida')], ['terraco_chuva', DIA('terraco')], ['garagem_chuva', DIA('garagem')], ['industrial_chuva', DIA('industrial')],
  ['avenida_relampago', DIA('avenida') + FLASH], ['terraco_relampago', DIA('terraco') + FLASH],
  ['avenida_sofa', DIA('avenida', SOFA) + GENTE], ['avenida_rm', DIA('avenida'), 'rm'],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width:960, height:540 }, { width:844, height:390 }]) {
    for (const rm of [false, true]) {
      const ctx = await b.newContext({ viewport:vp, deviceScaleFactor:2, reducedMotion: rm ? 'reduce' : 'no-preference' });
      await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
      let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
      for (const [f, js, mov] of CENAS) {
        if ((mov === 'rm') !== rm) continue; if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
        await pg.goto('file://' + W); await pg.waitForTimeout(600);
        const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r);
        await pg.waitForTimeout(f.indexOf('sofa') >= 0 ? 9000 : 2500);
        await pg.screenshot({ path:path.join(OUT, f + '_' + vp.width + '.png') });
      }
      await ctx.close();
    }
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
