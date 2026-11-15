// capturas da v11.7 (a roupa da Bia por ponto) em ../capturas/v11_7: (1) a folha das 4 roupas, parada, andando e de costas, ampliada 4x; (2) os retratos da Bia com cada roupa e a grade dos retratos;
// (3) o salão de cada ponto, com a Bia andando com a bandeja (recorte ao redor dela, em dsf 4). Confira em recorte (PIL crop + resize) e descarte: capturas não vão para o git. Uso: node shot_v11_7.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', process.env.RM ? 'v11_7_rm' : 'v11_7'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const FOLHA = BASE + `const c=document.createElement('canvas'); c.width=960; c.height=600; c.style.cssText='position:fixed;left:0;top:0;width:960px;height:600px;z-index:9999'; document.body.appendChild(c); const x=c.getContext('2d'); x.fillStyle='#F4EBDD'; x.fillRect(0,0,c.width,c.height);
  [1,2,3,4].forEach((r,i)=>{ [[0,{}],[1,{moving:true,ph:1.2}],[2,{moving:true,ph:0.3,flip:-1}],[3,{wave:true,t:1}]].forEach(([j,o])=>{ L.drawBia(x,{},110+j*220,170+i*140,Object.assign({s:1.8,roupa:r,t:0.5},o)); }); });`;
const RETR = BASE + `const c=document.createElement('canvas'); c.width=960; c.height=600; c.style.cssText='position:fixed;left:0;top:0;width:960px;height:600px;z-index:9999'; document.body.appendChild(c); const x=c.getContext('2d'); x.fillStyle='#2b2620'; x.fillRect(0,0,c.width,c.height);
  [1,2,3,4].forEach((r,i)=>{ g.setDev(true); g.devRoupa(r); ['neutra','insegura','firme','alegre','brava'].forEach((e,j)=>L.drawRetrato(x,'bia',e,70+j*130,70+i*130,g)); }); g.devRoupa(null); g.setDev(false);`;
const SALAO = ponto => BASE + "g.save=L.normSave({dia:30,bank:9000,cap:1,histV:1,capV:2,maxDay:30,v10:1,pontoDia:20,up:{tenis:true,maquina:true},equipe:{tonhao:2},salao:{ponto:'" + ponto + "'}});g.up=g.save.up;g.tablesKey='';g.buildTables();g.startDay(30);g.begin();g.schedule.forEach(s=>s.t=9999);g.elapsed=30;g.mode='carreira';g.evento='';g.clima='';g.bia.x=520;g.bia.y=330;g.bia.moving=true;g.bia.walkPh=1.1;g.bia.dir=1;g.bia.hands=['burger','soda'];";
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:960, height:600 }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
  await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
  const lista = [['folha', FOLHA, null], ['retratos', RETR, null], ['grade', BASE + "L.devRetratos();", null]].concat(['garagem', 'industrial', 'avenida', 'terraco'].map(p => ['salao_' + p, SALAO(p), { x:420, y:210, width:200, height:150 }]));
  for (const [f, js, clip] of lista) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    await pg.goto('file://' + W); await pg.waitForTimeout(500);
    await pg.evaluate(js); await pg.waitForTimeout(500);
    await pg.screenshot(Object.assign({ path: path.join(OUT, f + '.png') }, clip ? { clip } : {}));
  }
  await b.close();
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT);
})();
