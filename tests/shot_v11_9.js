// capturas da v11.9 (etapa 7a) em ../capturas/v11_9: o Terraço com o trio de cordas, a tela do Ranking com o nome (1366x768 e 667x375) e o fim do dia sem o formulário. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v11_9.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_9'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (extra) => "g.save=L.normSave(Object.assign({dia:9,bank:9000,cap:9,histV:1,capV:2,maxDay:9,v10:1,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,up:" + UP + ",equipe:{tonhao:3,dani:3,joca:3,cami:4,camiModo:'tudo',anselmo:3,lia:1,musica:__M__},camiCursos:{agil:1,mesa:1,salao:1},jocaCursos:{espresso:1,cafesEsp:1},anselmoCursos:{classica:1,autor:1},daniCursos:{confCaseira:1,confGourmet:1,confAlta:1},cursos:{restaurante:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},salao:{ponto:'terraco'}}," + extra + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[3]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const JOGO = (extra) => BASE + SV(extra || '{}') + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const FLORES = "decor:{ikebana:1,orqArranjo:1,campo:1,tulipa:1,copo:1,orquidea:1,anturio:1,pendente:1,espada:1,lata:1}";
const RANK = "L.Rank.saveLocal('carreira',{nome:'Marina',pontos:5400,dia:12}); L.Rank.saveLocal('carreira',{nome:'Você',pontos:2300,dia:9}); L.Rank.saveLocal('carreira',{nome:'Zeca',pontos:900,dia:5}); L.lsSet(L.LS.name,'Marina'); L.rk.tab='carreira'; L.openRank('ov-menu');";
const CENAS = [
  ['trio', 1, 1220, 600, JOGO('{' + FLORES + '}') + "g.mode='carreira'; for(let i=0;i<4;i++) g.arrive({t:0,type:'casal',color:i,vip:false}); for(let i=0;i<60;i++) g.update(0.05);"],
  ['ranking_1366', 1, 1366, 768, BASE + SV('{}') + RANK],
  ['ranking_667', 1, 667, 375, BASE + SV('{}') + RANK],
  ['fim_do_dia', 1, 1366, 768, BASE + SV('{}') + "g.startDay(9); g.begin(); g.schedule=[]; g.money=900; g.finishDay();"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [f, m, w, h, js0] of CENAS) { const js = js0.replace('__M__', String(m));
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto('file://' + W); await pg.waitForTimeout(600);
    const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
    await pg.screenshot({ path:path.join(OUT, f + '.png') }); await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
