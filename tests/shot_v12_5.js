// capturas da v12.5 (o arco da Lia) em ../capturas/v12_5: o cartão da Lia nos 3 níveis, os 2 cartões de curso (Chefe de praça e Cozinha de autor), a entrada na praça dela (o anel de progresso)
// e as conversas LIBERA lia, cap. 10 depois, liaRosa e liaChef em 844x390. Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v12_5.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_5'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (lia, extra) => "g.save=L.normSave(Object.assign({dia:60,bank:9000,cap:11,histV:1,capV:2,maxDay:60,v10:1,pontoDia:5,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,libera:{lia:2},up:" + UP + ",equipe:{tonhao:3,dani:3,joca:3,cami:4,camiModo:'tarefas',anselmo:3,lia:" + lia + "},cursos:{restaurante:2,entradas:1,alta:1},salao:{ponto:'terraco'},arco:{liaRosa:1,liaPetala:1}}," + extra + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[3]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const LOJA = (lia, cursos, grupo, tab) => BASE + SV(lia, "{liaCursos:" + cursos + "}") + "g.goShop(60); L.setShopGrupo('" + grupo + "'); L.setShopTab('" + tab + "');";
const PRACA = BASE + SV(2, "{liaCursos:{praca:1}}") + MESAS + "g.startDay(60); g.begin(); g.mode='carreira'; g.schedule.forEach(s=>s.t=9999); g.elapsed=30; const k=g.kitchen; const t=(n,tempo,p)=>({group:{},table:n,time:6,p,dish:'pf',tempo,base:0}); k.cooking=[t(1,1,2),t(2,1,3.5),t(3,1,1),Object.assign(t(4,0,3.2),{praca:true})]; k.queue=[t(5,0,0),t(6,1,0)]; k.update=()=>{};";
const FALA = (cap, js) => BASE + SV(1, "{cap:" + cap + "}") + "const F=" + js + "; L.falar([F],()=>{});";
const CENAS = [
  ['loja_lia_n1', LOJA(1, '{}', 'equipe', 'lia')], ['loja_lia_n2', LOJA(2, '{praca:1}', 'equipe', 'lia')], ['loja_lia_n3', LOJA(3, '{praca:1,autor:1}', 'equipe', 'lia')],
  ['loja_cardapio_autor', LOJA(2, '{praca:1}', 'lanchonete', 'cardapio')],
  ['praca_anel', PRACA],
  ['fala_libera', FALA(10, "L.liberaOf('lia').falas[2]")], ['fala_cap10_depois', FALA(10, "L.HISTORIA[9].depois[0]")],
  ['fala_liaRosa', FALA(11, "L.ARCO.find(a=>a.id==='liaRosa').falas[3]")], ['fala_liaChef', FALA(13, "L.ARCO.find(a=>a.id==='liaChef').falas[3]")]
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [nome, w, h] of [['1220x600', 1220, 600], ['844x390', 844, 390]]) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    let f_ = ''; const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(f_ + ': ' + String(e.stack).split('\n').slice(0,3).join(' <- ')));
    for (const [f, js] of CENAS) {
      const fala = f.indexOf('fala_') === 0; if ((nome === '844x390') !== fala && !(nome === '844x390' && f === 'praca_anel')) continue;
      if (FILTRO && f.indexOf(FILTRO) < 0) continue; f_ = f;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + '_' + nome + '.png') });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
