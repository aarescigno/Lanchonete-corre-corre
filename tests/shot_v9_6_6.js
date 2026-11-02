// capturas da v9.6.6 (sessão 3d-3) em ../capturas/v9_6_6: pia com 0, 2 e 6 pilhas, lixo com 4 e 6, geladeirinha de doces (caseira e gourmet) e o balão de doce; normal e com movimento reduzido.
// Uso: node shot_v9_6_6.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_6_6'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const JOGO = (gm, extra) => BASE + "g.save=L.normSave({dia:4,bank:2500,maxDay:4,up:{confCaseira:true,confGourmet:" + gm + "},equipe:{tonhao:1,dani:1}}); g.up=g.save.up; g.up.confCaseira=true; g.up.confGourmet=" + gm + "; g.tablesKey=''; g.buildTables(); g.startDay(4); g.begin(); g.schedule=[{t:1e9,type:'entregador',color:0}]; g.nextIdx=0; g.elapsed=30; " + extra + " g.update(0.05);";
const CENAS = [
  ['pia0', JOGO(false, "g.kitchen.sinkN=0;")], ['pia2', JOGO(false, "g.kitchen.sinkN=2;")], ['pia6', JOGO(false, "g.kitchen.sinkN=6;")],
  ['lixo4', JOGO(false, "g.trash=4;")], ['lixo6', JOGO(false, "g.trash=6;")],
  ['doces_caseira', JOGO(false, "g.fx=[];")], ['doces_gourmet', JOGO(true, "g.save.docesTot=9; g.fx=[];")],
  ['balao_doce', JOGO(false, "const m=g.arrive({type:'estudante',color:0}); g.seatGroup(m,g.tables.find(q=>q.free&&q.seats>=m.size)); m.state='eating'; m.doces=['bolo','brigadeiro']; m.docesDados=0; m.docesFalta=2; m.esperaSuco=true;")],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, rm] of [['_pc', 'no-preference'], ['_movimento_reduzido', 'reduce']]) {
    const ctx = await b.newContext({ viewport:{ width:1220, height:600 }, deviceScaleFactor:2, reducedMotion:rm });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      if (rm === 'reduce' && !/pia6|lixo6|doces_caseira/.test(f)) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(400);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
