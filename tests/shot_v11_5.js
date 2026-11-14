// capturas da v11.5 (o retrato no balão e as cinco expressões) em ../capturas/v11_5: a grade dos 7 x 5; o balão da Bia insegura (ARCO desanimo, 1ª fala) e firme (cap. 14 antes, última);
// um do Tonhão e um do Anselmo com nota; em 844x390 e 568x320. Confira em recorte (PIL crop + resize) e descarte: capturas não vão para o git. Uso: node shot_v11_5.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', process.env.RM ? 'v11_5_rm' : 'v11_5'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const FALA = (js) => BASE + "g.setState('menu'); const F=" + js + "; L.falar([F],()=>{});";
const FALAS = {
  bia_insegura: "L.ARCO.find(a=>a.id==='desanimo').falas[0]",
  bia_firme: "(()=>{const a=L.HISTORIA[13].antes; return a[a.length-1];})()",
  tonhao_insegura_nota: "L.HISTORIA.flatMap(c=>[...c.antes,...c.depois]).find(f=>f.q==='tonhao'&&f.e==='insegura'&&f.nota)",
  anselmo_nota: "L.ARCO.find(a=>a.id==='anselmoCopo').falas[0]",
  lia_firme_nota: "L.ARCO.find(a=>a.id==='liaPetala').falas[3]",
  dani_alegre: "L.ARCO.find(a=>a.id==='daniEnsina').falas[0]",
};
const TELAS = [['960x600', 960, 600], ['844x390', 844, 390], ['568x320', 568, 320]];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [nome, w, h] of TELAS) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    const lista = [['grade_' + nome, BASE + "L.devRetratos();"]].concat(Object.keys(FALAS).map(k => [k + '_' + nome, FALA(FALAS[k])]));
    for (const [f, js] of lista) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(500);
      await pg.evaluate(js); await pg.waitForTimeout(400);
      await pg.screenshot({ path: path.join(OUT, f + '.png') });
    }
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT);
})();
