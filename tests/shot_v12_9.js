// capturas da v12.9 (enfeites novos e redesenhos) em ../capturas/v12_9 (CA7): o salão de cada ponto com toda a decoração e a aba Luxo da Avenida. 844x390 e 568x320 (as lojas); o salão a 960x540. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v12_9.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_9'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (ponto) => "g.save=L.normSave({dia:20,bank:9000,cap:8,histV:1,capV:2,maxDay:20,v10:1,pontoDia:5,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,salao:{ponto:'" + ponto + "'},cursos:{},up:" + UP + "});g.up=g.save.up;g.buildTables();";
const DIA = "g.startDay(20);g.begin();g.schedule=[];g.nextIdx=0;";
const DEC = "L.DEV.on=true;g.devDecor(true);";
const SALAO = (p, extra) => BASE + SV(p) + DEC + (extra || '') + DIA;
const CENAS = [
  ['salao_garagem', SALAO('garagem', "['lata','samambaia','foto','giz','placa','espada'].forEach(k=>g.save.decor[k]=1);")],
  ['salao_industrial', SALAO('industrial', "['lata','violeta','pendente','foto'].forEach(k=>g.save.decor[k]=1);")],
  ['salao_avenida', SALAO('avenida')],
  ['salao_terraco', SALAO('terraco')],
  ['icones', BASE + SV('avenida') + "document.body.innerHTML='';document.body.style.cssText='background:#E8E2D0;margin:0';const ids=['lata','violeta','pendente','orqArranjo','espelho','palmeira','vinhos','cortina','arandela','foto','espada','samambaia'];const w=document.createElement('div');w.style.cssText='display:flex;flex-wrap:wrap;gap:6px;padding:6px;width:600px;transform:scale(1.35);transform-origin:0 0';ids.forEach(k=>{const c=L.upgradeIcon('d-'+k);c.style.cssText='width:64px;height:64px;background:#fff;border:1px solid #999';w.appendChild(c)});document.body.appendChild(w);"],
  ['loja_luxo_avenida', BASE + SV('avenida') + DEC + "g.goShop(20); L.setShopGrupo('lanchonete'); L.setShopTab('luxo');"]
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [nome, w, h] of [['844x390', 844, 390], ['568x320', 568, 320]]) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
      await pg.setViewportSize({ width:w, height:h }); await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + '_' + nome + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
