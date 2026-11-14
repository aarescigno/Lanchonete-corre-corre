// capturas da v11 (o final) em ../capturas/v11: as oito cenas (no meio e no fim de cada uma), os créditos e a placa na parede do Terraço com 1 e 3 estrelas e o adesivo.
// Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v11.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', process.env.RM ? 'v11_rm' : 'v11'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// o final com 3 estrelas e os créditos, parado na cena i, a fração f do tempo dela
const CENA = (est, i, f) => BASE + "L.abrirAbertura('menu',{roteiro:L.FINAL,est:" + est + ",creditos:true}); const a=L.aberturaAtual(); a.i=" + i + "; a.t=a.cena.t*" + f + "; a.tm=a.t+1; a.onCena=null;";
const CENAS = [];
['telefone','placa','apagou','retrato','equipe','escola','ceu','roda','creditos'].forEach((id, i) => {
  [['meio', 0.55], ['fim', 0.85]].forEach(([m, f]) => CENAS.push([id + '_' + m, CENA(3, i, f)]));
});
CENAS.push(['placa_1_estrela_fim', CENA(1, 1, 0.85)]);
CENAS.push(['placa_2_estrelas_fim', CENA(2, 1, 0.85)]);
// a placa na parede do Terraço: com 1 e 3 estrelas, e o adesivo "Recomendado" (sem estrela)
const TERRACO = (guia) => BASE + "g.save=L.normSave(Object.assign({dia:64,bank:9000,cap:15,histV:1,capV:6,maxDay:64,v10:1,pontoDia:50,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,convExig:1,convCrit:1,rosa:1,salao:{ponto:'terraco'},guia:" + guia + "},{})); g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.startDay(64); g.begin(); g.schedule=[]; g.elapsed=20; g.mode='carreira'; g.evento=''; g.clima='';";
CENAS.push(['parede_1_estrela', TERRACO("{n:2,prox:0,v:[],est:1,ult:60,visto:1}")]);
CENAS.push(['parede_3_estrelas', TERRACO("{n:2,prox:0,v:[],est:3,ult:60,visto:3}")]);
CENAS.push(['parede_recomendado', TERRACO("{n:2,prox:0,v:[],est:0,rec:1,ult:60,visto:0}")]);
CENAS.push(['parede_sem_nada', TERRACO("{n:2,prox:0,v:[],est:0,rec:0,ult:0,visto:0}")]);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:960, height:600 }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
  await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
  for (const [f, js] of CENAS) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    await pg.goto('file://' + W); await pg.waitForTimeout(500);
    await pg.evaluate(js); await pg.waitForTimeout(120);
    await pg.screenshot({ path: path.join(OUT, f + '.png') });
  }
  await b.close();
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT);
})();
