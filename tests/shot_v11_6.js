// capturas da v11.6 (o Bráulio em cena) em ../capturas/v11_6: a grade dos retratos com o Bráulio; o balão da 1ª fala de braulio1 e o da fala [brava], na Avenida,
// em 844x390 e 568x320; o balão da 1ª fala do cap. 14 depois, no Terraço. Confira em recorte (PIL crop + resize) e descarte: capturas não vão para o git. Uso: node shot_v11_6.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', process.env.RM ? 'v11_6_rm' : 'v11_6'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// o salão do ponto, parado, e a fala por cima (como o jogo faz no fim do dia)
const SV = (ponto, cap) => "g.save=L.normSave({dia:30,bank:9000,cap:" + cap + ",histV:1,capV:2,maxDay:30,v10:1,pontoDia:20,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,up:{tenis:true,maquina:true},equipe:{tonhao:2,dani:2,anselmo:2},salao:{ponto:'" + ponto + "'}});g.up=g.save.up;g.tablesKey='';g.buildTables();g.startDay(30);g.begin();g.schedule.forEach(s=>s.t=9999);g.elapsed=30;g.mode='carreira';g.evento='';g.clima='';";
const FALA = (ponto, cap, js) => BASE + SV(ponto, cap) + "const F=" + js + "; L.falar([F],()=>{});";
const FALAS = {
  braulio1_primeira: ['avenida', 7, "L.ARCO.find(a=>a.id==='braulio1').falas[0]"],
  braulio1_brava: ['avenida', 7, "L.ARCO.find(a=>a.id==='braulio1').falas[3]"],
  cap14_depois: ['terraco', 14, "L.HISTORIA[13].depois[0]"],
};
const TELAS = [['960x600', 960, 600], ['844x390', 844, 390], ['568x320', 568, 320]];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [nome, w, h] of TELAS) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    const lista = [['grade_' + nome, BASE + "L.devRetratos();"]].concat(Object.keys(FALAS).map(k => [k + '_' + nome, FALA(FALAS[k][0], FALAS[k][1], FALAS[k][2])]));
    for (const [f, js] of lista) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(500);
      await pg.evaluate(js); await pg.waitForTimeout(500);
      await pg.screenshot({ path: path.join(OUT, f + '.png') });
    }
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT);
})();
