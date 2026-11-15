// capturas da v11.8 (as reações da Bia) em ../capturas/v11_8: (1) a folha dos 6 gestos nas roupas dos pontos (cada gesto no instante p = 0,5, parada e andando), ampliada 4x;
// (2) o salão de cada ponto com o gesto disparado (recorte ao redor da Bia). Confira em recorte (PIL crop + resize) e descarte: capturas não vão para o git. Uso: node shot_v11_8.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_8'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const GESTOS = ['sorriso', 'punho', 'cabeca', 'respira', 'suspiro', 'cintura'];
const folha = (r, andando) => BASE + `const c=document.createElement('canvas'); c.width=960; c.height=300; c.style.cssText='position:fixed;left:0;top:0;width:960px;height:300px;z-index:9999'; document.body.appendChild(c); const x=c.getContext('2d'); x.fillStyle='#F4E9D2'; x.fillRect(0,0,960,300);
  ${JSON.stringify(GESTOS)}.forEach((e,j)=>{ L.drawBia(x,{},90+j*155,${andando ? 150 : 150},{s:1.8,roupa:${r},t:0.5,reacao:{id:e,p:0.5},moving:${andando},ph:1.2}); });`;
const SALAO = (ponto, gesto) => BASE + "g.save=L.normSave({dia:30,bank:9000,cap:1,histV:1,capV:2,maxDay:30,v10:1,pontoDia:20,up:{tenis:true,maquina:true},equipe:{tonhao:2},salao:{ponto:'" + ponto + "'}});g.up=g.save.up;g.tablesKey='';g.buildTables();g.startDay(30);g.begin();g.schedule=[];g.nextIdx=0;g.bia.x=480;g.bia.y=330;g.bia.reacao={id:'" + gesto + "',t:0.4};g.pause();document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));";
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:960, height:600 }, deviceScaleFactor:2 });
  await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
  const lista = [];
  [1, 2, 3, 4].forEach(r => { lista.push(['folha_roupa' + r, folha(r, false), { x:0, y:0, width:960, height:300 }]); lista.push(['folha_roupa' + r + '_andando', folha(r, true), { x:0, y:0, width:960, height:300 }]); });
  [['garagem', 'sorriso'], ['industrial', 'suspiro'], ['avenida', 'punho'], ['terraco', 'cintura']].forEach(([p, e]) => lista.push(['salao_' + p, SALAO(p, e), { x:380, y:200, width:200, height:180 }]));
  for (const [f, js, clip] of lista) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    await pg.goto('file://' + W); await pg.waitForTimeout(500);
    await pg.evaluate(js); await pg.waitForTimeout(500);
    await pg.screenshot(Object.assign({ path: path.join(OUT, f + '.png') }, clip ? { clip } : {}));
  }
  await b.close();
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT);
})();
