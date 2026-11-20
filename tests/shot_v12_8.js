// capturas da v12.8 (desenhos dos pratos novos da Avenida, dos juninos e das barracas) em ../capturas/v12_8 (CA8): a grade dos pratos a 0,52, 0,9 e 1,7 (sem e com o avançado), uma mesa da Avenida com balcão de pratos, o cartão Cardápio da Avenida e o cartão da barraca na Avenida e no Terraço. 844x390 e 568x320. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v12_8.js [filtro]   (PRATOS="k1,k2,..." troca a lista da grade; a v12.8.1 reusa o arquivo para o Terraço: PONTO=terraco)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_8'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '', PONTO = process.env.PONTO || 'avenida';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (ponto, cursos, extra) => "g.save=L.normSave(Object.assign({dia:20,bank:9000,cap:8,histV:1,capV:2,maxDay:20,v10:1,pontoDia:5,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,salao:{ponto:'" + ponto + "'},cursos:" + cursos + ",up:" + UP + "}," + (extra || '{}') + "));g.up=g.save.up;g.buildTables();";
const DIA = "g.startDay(20);g.begin();g.schedule=[];g.nextIdx=0;";
const MESA = (i, tipo, dishes, st) => "{ const m=new L.Group(g,'" + tipo + "',++g.gid," + i + ",false); m.dishes=" + JSON.stringify(dishes) + "; m.dish=m.dishes[0]; m.extras=m.dishes.map(()=>null); m.juiceWant=0; g.groups.push(m); g.seatGroup(m,g.tables[" + i + "]); m.setState('" + st + "'); m.timer=5; }";
const PRATO = (slot, i, dish) => "g.kitchen.plates[" + slot + "]={id:" + (50 + slot) + ",table:" + (i + 1) + ",group:g.tables[" + i + "].group,dish:'" + dish + "',slot:" + slot + ",age:0,crit:false,q:4,vip:false,tempo:1};";
const TODOS = "{pastel:1,chapa:1,fritos:1,assados:1,veg:1,restaurante:1,entradas:1,alta:1}";
const LOJA = (ponto, aba, extra) => BASE + SV(ponto, TODOS, extra) + "g.goShop(20); L.setShopGrupo('lanchonete'); L.setShopTab('" + aba + "');";
const LISTA = process.env.PRATOS ? process.env.PRATOS.split(',') : ['execFrango','strogonoff','mandioca','isca','torta','empadao','beirute','coalho','panqueca','panquecaEsp','execVeg','escondidinho','execVegano','moquecaBanana','curau','milhoCoalho','bolo','cremeMilho','pamonhaMel','canjicaCoco'];
// a grade: uma linha por prato, a cada escala sem e com o avançado
const GRADE = "document.body.innerHTML='';const L=window.__lcc;const cv=document.createElement('canvas');const ESC=[0.52,0.9,1.7],K=1.7,CW=[56,80,134],LN=" + JSON.stringify(LISTA) + ";const TW=120+2*CW.reduce((a,b)=>a+b,0),TH=LN.length*60;cv.width=TW*2;cv.height=TH*2;cv.style.cssText='position:fixed;left:0;top:0;width:'+TW+'px;height:'+TH+'px;background:#E8E2D0;z-index:99';document.body.appendChild(cv);const c=cv.getContext('2d');c.scale(2,2);c.fillStyle='#E8E2D0';c.fillRect(0,0,TW,TH);c.lineJoin='round';c.lineCap='round';LN.forEach((k,i)=>{c.fillStyle='#000';c.font='10px sans-serif';c.fillText(k,2,i*60+34);let x=120;for(const av of [false,true])ESC.forEach((s,j)=>{L.drawDish(c,k,x+CW[j]/2,i*60+30,s*K,false,null,av);x+=CW[j]});});window.__GW=TW;window.__GH=TH;";
const CENAS = [
  ['grade', GRADE],
  ['avenida_pratos', BASE + SV('avenida', '{}') + DIA + MESA(0, 'executiva', ['execFrango'], 'ordered') + MESA(1, 'familia', ['strogonoff', 'mandioca', 'execFrango'], 'eating') + PRATO(0, 0, 'execFrango') + PRATO(1, 1, 'strogonoff') + PRATO(2, 1, 'mandioca') + PRATO(3, 1, 'moquecaBanana') + PRATO(4, 1, 'beirute') + PRATO(5, 1, 'panqueca')],
  ['loja_cardapio_avenida', LOJA('avenida', 'cardapio')],
  ['loja_barraca_avenida', LOJA('avenida', 'cardapio', "{evento:{sem:1,d:20,ev:'junina'}}")],
  ['loja_barraca_terraco', LOJA('terraco', 'cardapio', "{evento:{sem:1,d:20,ev:'junina'}}")],
  ['dev_cardapio', BASE + "g.setDev(true);" + SV(PONTO, '{}') + "g.goShop(20); L.abrirDev(); L.DEV.aba='equipe'; L.buildDev();"]
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [nome, w, h] of [['844x390', 844, 390], ['568x320', 568, 320]]) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; if (f === 'grade' && nome !== '844x390') continue; f_ = f;
      await pg.setViewportSize({ width:w, height:h }); await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      if (f === 'grade') { const el = await pg.$('canvas'); await pg.setViewportSize({ width:await pg.evaluate('window.__GW'), height:await pg.evaluate('window.__GH') }); await pg.waitForTimeout(200); await pg.screenshot({ path:path.join(OUT, 'grade.png') }); }
      else await pg.screenshot({ path:path.join(OUT, f + '_' + nome + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
