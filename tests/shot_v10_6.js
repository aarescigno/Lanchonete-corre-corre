// capturas da v10.6 (eventos de bairro) em ../capturas/v10_6: a festa junina na Garagem (bandeirinhas no salão e na calçada, pratos juninos na mesa), o jogo do Brasil na
// Garagem com a TV no campo e o letreiro "GOOOL!", e o jogo na área industrial com as TVs. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v10_6.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_6'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SV = (ponto, ev, extra) => "g.save=L.normSave(Object.assign({dia:8,bank:9000,cap:5,histV:1,capV:2,maxDay:8,v10:1,pontoDia:8,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,up:{tenis:true,maquina:true},equipe:{tonhao:2,dani:2},salao:{ponto:'" + ponto + "'},evento:{sem:0,d:8,ev:'" + ev + "'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const JOGAR = "g.startDay(8); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; g.mode='carreira'; ";
const SENTA = (pratos) => "const P=" + JSON.stringify(pratos) + "; for(let i=0;i<4;i++){ const k=g.spawn({type:i%2?'familia':'estudante',color:i,vip:false,av:true}); const t=g.tables.find(q=>q.free&&q.seats>=k.size); if(t){ g.seatGroup(k,t); k.setState('eating'); k.timer=0; k.esperaSuco=false; if(P[i%P.length]){ k.extras=k.people.map(()=>P[i%P.length]); } } } ";
const CENAS = [
  ['junina_garagem', BASE + SV('garagem', 'junina', "{barraca:8,up:{tenis:true},cursos:{pastel:1}}") + JOGAR + SENTA(['pamonha', 'milho', 'canjica', 'milho'])],
  ['jogo_garagem_gol', BASE + SV('garagem', 'jogo', "{equipe:{tonhao:2,dani:2,tv:true}}") + JOGAR + SENTA([]) + "g.golDoBrasil();"],
  ['jogo_garagem_campo', BASE + SV('garagem', 'jogo', "{equipe:{tonhao:2,dani:2,tv:true}}") + JOGAR + SENTA([])],
  ['jogo_industrial_tvs', BASE + SV('industrial', 'jogo', "{up:{tenis:true,fogaoInd:true,tvs:true},equipe:{tonhao:2,dani:2,tvs:1}}") + JOGAR + SENTA([])],
  ['jogo_industrial_gol', BASE + SV('industrial', 'jogo', "{up:{tenis:true,fogaoInd:true,tvs:true},equipe:{tonhao:2,dani:2,tvs:1}}") + JOGAR + SENTA([]) + "g.golDoBrasil();"],
  ['loja_barraca', BASE + SV('garagem', 'junina', "{}") + "g.goShop(8); L.setShopTab('cardapio');"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:1220, height:600 }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
  await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
  for (const [f, js] of CENAS) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    await pg.goto('file://' + W); await pg.waitForTimeout(600);
    const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
    await pg.screenshot({ path:path.join(OUT, f + '.png') });
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
