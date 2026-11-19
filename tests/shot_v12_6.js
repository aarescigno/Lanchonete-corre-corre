// capturas da v12.6 (as vozes da equipe) em ../capturas/v12_6: camiNome, a roda, jocaNome e LIBERA anselmo em 844x390 e 568x320 (CA6). Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v12_6.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_6'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (lia, extra) => "g.save=L.normSave(Object.assign({dia:60,bank:9000,cap:11,histV:1,capV:2,maxDay:60,v10:1,pontoDia:5,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,libera:{lia:2},up:" + UP + ",equipe:{tonhao:3,dani:3,joca:3,cami:4,camiModo:'tarefas',anselmo:3,lia:" + lia + "},cursos:{restaurante:2,entradas:1,alta:1},salao:{ponto:'terraco'},arco:{liaRosa:1,liaPetala:1}}," + extra + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const FALA = (cap, js) => BASE + SV(1, "{cap:" + cap + "}") + "const F=" + js + "; L.falar([F],()=>{});";
const A = id => "L.ARCO.find(a=>a.id==='" + id + "').falas";
const CENAS = [
  ['camiNome_0', FALA(7, A('camiNome') + "[0]")], ['camiNome_4', FALA(7, A('camiNome') + "[4]")],
  ['roda_3', FALA(14, A('roda') + "[3]")], ['roda_5', FALA(14, A('roda') + "[5]")],
  ['jocaNome_0', FALA(14, A('jocaNome') + "[0]")], ['jocaNome_4', FALA(14, A('jocaNome') + "[4]")],
  ['anselmo_1', FALA(7, "L.liberaOf('anselmo').falas[1]")], ['anselmo_3', FALA(7, "L.liberaOf('anselmo').falas[3]")]
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [nome, w, h] of [['844x390', 844, 390], ['568x320', 568, 320]]) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + '_' + nome + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
