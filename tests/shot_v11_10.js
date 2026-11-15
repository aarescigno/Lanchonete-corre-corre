// capturas da v11.10 (etapa 7b) em ../capturas/v11_10: a lojinha com o topo fixo (Cardápio rolado, Caixa, Salão) em 1366x768 e 667x375; Ranking, Instalar e fim do Turno sem fim em 568x320; Versões. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v11_10.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_10'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const FIM = "g.save=L.normSave({dia:60,bank:90000,cap:14,histV:1,capV:2,maxDay:60,v10:1,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,up:" + UP + ",equipe:{tonhao:3,dani:3,joca:3,cami:4,camiModo:'tudo',anselmo:3,lia:1,musica:1},camiCursos:{agil:1,mesa:1,salao:1},jocaCursos:{espresso:1,cafesEsp:1},anselmoCursos:{classica:1,autor:1},daniCursos:{confCaseira:1,confGourmet:1,confAlta:1},cursos:{restaurante:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},salao:{ponto:'terraco'}});g.up=g.save.up;g.tablesKey='';g.buildTables();";
const LOJA = (sec, rola) => BASE + FIM + "g.goShop(60);" + (sec ? "L.setShopTab('" + sec + "');" : "") + (rola ? "document.getElementById('shop-grid').scrollTop=" + rola + ";" : "");
const RANK = "for(let i=0;i<50;i++) L.Rank.saveLocal('carreira',{nome:'Jogador '+i,pontos:100+i*37,dia:3+i%20}); L.lsSet(L.LS.name,'NomeComDezesseis'); L.rk.tab='carreira'; L.openRank('ov-menu');";
const CENAS = [];
for (const [w, h] of [[1366, 768], [667, 375]]) {
  CENAS.push(['cardapio_' + w, w, h, LOJA('cardapio', 140)], ['caixa_' + w, w, h, LOJA('caixa')], ['salao_' + w, w, h, LOJA('salao')], ['cartoes_' + w, w, h, LOJA(null)]);
}
CENAS.push(['ranking_568', 568, 320, BASE + FIM + RANK], ['instalar_568', 568, 320, BASE + "document.getElementById('ov-app').classList.add('show');"],
  ['turno_568', 568, 320, BASE + FIM + "g.startEndless();g.begin();g.pontos=300;g.money=50;g.finishEndless();"],
  ['versoes_1366', 1366, 768, BASE + "document.getElementById('ov-ver').classList.add('show');"], ['versoes_568', 568, 320, BASE + "document.getElementById('ov-ver').classList.add('show');"]);
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [f, w, h, js] of CENAS) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto('file://' + W); await pg.waitForTimeout(600);
    const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(400);
    await pg.screenshot({ path:path.join(OUT, f + '.png') }); await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
