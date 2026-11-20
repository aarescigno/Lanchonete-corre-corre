// capturas da v12.7 (cardápio de verdade em cada ponto) em ../capturas/v12_7 (CA11): o Terraço com o "Escalope ao molho de cogumelos" (balcão de pratos e mesas), o cartão Cardápio da Avenida, o cartão do Arraiá do Terraço e o painel do modo dev. 844x390 e 568x320. Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v12_7.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_7'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (ponto, cursos, extra) => "g.save=L.normSave(Object.assign({dia:20,bank:9000,cap:8,histV:1,capV:2,maxDay:20,v10:1,pontoDia:5,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,salao:{ponto:'" + ponto + "'},cursos:" + cursos + ",up:" + UP + "}," + (extra || '{}') + "));g.up=g.save.up;g.buildTables();";
const DIA = "g.startDay(20);g.begin();g.schedule=[];g.nextIdx=0;";
const MESA = (i, tipo, dishes, st) => "{ const m=new L.Group(g,'" + tipo + "',++g.gid," + i + ",false); m.dishes=" + JSON.stringify(dishes) + "; m.dish=m.dishes[0]; m.extras=m.dishes.map(()=>null); m.juiceWant=0; g.groups.push(m); g.seatGroup(m,g.tables[" + i + "]); m.setState('" + st + "'); m.timer=5; }";
const PRATO = (slot, i, dish) => "g.kitchen.plates[" + slot + "]={id:" + (50 + slot) + ",table:" + (i + 1) + ",group:g.tables[" + i + "].group,dish:'" + dish + "',slot:" + slot + ",age:0,crit:false,q:4,vip:false,tempo:1};";
const TODOS = "{pastel:1,chapa:1,fritos:1,assados:1,veg:1,restaurante:1,entradas:1,alta:1}";
const LOJA = (ponto, aba, extra) => BASE + SV(ponto, TODOS, extra) + "g.goShop(20); L.setShopGrupo('lanchonete'); L.setShopTab('" + aba + "');";
const CENAS = [
  ['terraco_escalope', BASE + SV('terraco', '{}') + DIA + MESA(0, 'casal', ['escalope', 'galeto'], 'ordered') + MESA(1, 'negocios', ['vinho', 'nhoque', 'polenta'], 'eating') + PRATO(0, 0, 'escalope') + PRATO(1, 1, 'vinho')],
  ['avenida_pratos', BASE + SV('avenida', '{}') + DIA + MESA(0, 'executiva', ['execFrango'], 'ordered') + MESA(1, 'familia', ['strogonoff', 'mandioca', 'execFrango'], 'eating') + PRATO(0, 0, 'execFrango') + PRATO(1, 1, 'strogonoff') + PRATO(2, 1, 'mandioca')],
  ['loja_cardapio_avenida', LOJA('avenida', 'cardapio')],
  ['loja_cardapio_terraco', LOJA('terraco', 'cardapio', "{evento:{sem:1,d:20,ev:'junina'}}")],
  ['dev_cardapio', BASE + SV('terraco', '{}') + "g.setDev(true); g.goShop(20); L.abrirDev(); L.DEV.aba='equipe'; L.buildDev();"]
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
