// capturas da v9.6.4 (sessão 3d-1) em ../capturas/v9_6_4: o relógio "FECHANDO" e a placa "FECHADO" na calçada com gente ainda nas mesas, e o balão do 1º VIP.
// Uso: node shot_v9_6_4.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_6_4'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SALVA = pt => "g.save=L.normSave({dia:5,bank:3000,cap:4,histV:1,maxDay:5,vipVisto:0,salao:{ponto:'" + pt + "'},up:{tenis:true,maquina:true},equipe:{tonhao:1,dani:1}}); g.up=g.save.up; g.tablesKey=''; g.buildTables(); ";
const GRUPOS = "['familia','estudante','vovos'].forEach((tp,i)=>{ const m=g.arrive({type:tp,color:i}); if(i<2){ const t=g.tables.find(q=>q.free&&q.seats>=m.size); if(t) g.seatGroup(m,t); } }); ";
const PASSO = n => "for(let i=0;i<" + n + ";i++){ g.update(0.05); } ";
const CENAS = [
  ['fechando', BASE + SALVA('garagem') + "g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0; " + GRUPOS + PASSO(60) + "g.arrive({type:'executiva',color:3}); g.clock=0.05; " + PASSO(8)],
  ['vip_balao', BASE + SALVA('industrial') + "g.startDay(5); g.begin(); g.schedule=[]; g.nextIdx=0; g.arrive({type:'estudante',color:1}); " + PASSO(20) + "g.arrive({type:'executiva',color:0,vip:true}); " + PASSO(10)],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch, rm] of [['_pc', [1220, 600], false, 'no-preference'], ['_celular_deitado', [740, 360], true, 'no-preference'], ['_movimento_reduzido', [1220, 600], false, 'reduce']]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2, reducedMotion:rm });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(400);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
