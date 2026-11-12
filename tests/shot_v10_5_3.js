// capturas da v10.5.3 (etapa V: a vontade da freguesia) em ../capturas/v10_5_3: uma mesa da área industrial com o balão apagado do doce e a conversa do doce aberta. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v10_5_3.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_5_3'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SV = "g.save=L.normSave({dia:30,bank:9000,cap:5,histV:1,capV:2,maxDay:30,v10:1,pontoDia:24,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,up:{tenis:true,fogaoInd:true},equipe:{tonhao:2,dani:2},salao:{ponto:'industrial'}}); g.up=g.save.up; g.tablesKey=''; g.buildTables();";
const JOGO = BASE + SV + "g.startDay(30); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; g.mode='carreira'; ";
const CENAS = [
  ['mesa_balao', JOGO + "for(let i=0;i<3;i++){ const k=g.spawn({type:'familia',color:i,vip:false,av:true}); const t=g.tables.find(q=>q.free&&q.seats>=k.size); if(t){ g.seatGroup(k,t); k.setState('eating'); k.timer=0; k.esperaSuco=false; k.update(0.01); k.vontade={doce:true,cafe:false}; k.vontadeT=3.2; } } g.update(0.05);"],
  ['conversa_doce', BASE + SV + "g.goShop(30); L.falar(L.HIST_VONTADE_DOCE.falas, ()=>{});"],
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
