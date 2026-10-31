// capturas da v9.4 (sessão 3b-4) em ../capturas/v9_4: a introdução com o aviso, o fiscal no salão (entrando, olhando com as 3 falhas, aprovado com o selo na parede),
// o fim do dia com a multa e o fim do dia aprovado. Uso: node shot_v9_4.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_4'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";

const SALVA = (eq, extra) => "g.save=L.normSave(Object.assign({dia:11,bank:9000,cap:7,histV:1,maxDay:11,pontoDia:5,up:{tenis:true,maquina:true,assento:'sofa',fogaoInd:true,bandeja:true,ventilador:true},equipe:" + eq + ",daniCursos:{confCaseira:1,confGourmet:1},jocaCursos:{espresso:1},cursos:{},decor:{},salao:{ponto:'avenida'},convCard:1,convDiv:1,libera:{confeitaria:2,joca:2,cami:2}}," + (extra || '{}') + ")); g.up=g.save.up;";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[2]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const EQ = "{tonhao:2}";
const FISCAL = "g.save.manut.sorteio={d:11,clima:'',quebra:[],fiscal:{f:0.4}}; ";
const JOGO = (extra) => BASE + SALVA(EQ, extra) + MESAS + FISCAL + "g.startDay(11); g.begin(); g.schedule.forEach(s=>s.t=9999); ";
const PASSO = n => "for(let i=0;i<" + n + ";i++){ g.clock=9999; g.update(0.05); } ";
const CHEGA = "g.elapsed=g.fiscal.t; {let n=0; while(g.fiscal.st!=='olha' && n++<2000){ g.clock=9999; g.update(0.05); }} ";
const FALHAS = "g.trash=6; g.kitchen.sinkN=5; g.tables[3].dirty=true; g.tables[3].dirtyN=3; g.tables[1].dirty=true; g.tables[1].dirtyN=2; ";
const FIM = "{let n=0; while(g.fiscal.st!=='fim' && n++<4000){ g.clock=9999; g.update(0.05); }} g.money=420; g.schedule=[]; g.nextIdx=0; g.finishDay(); ";
const CENAS = [
  ['intro_aviso', BASE + SALVA(EQ) + MESAS + FISCAL + "g.startDay(11);"],
  ['salao_fiscal_entrando', JOGO() + "g.elapsed=g.fiscal.t; {let n=0; while(g.fiscal.st!=='entra' && n++<200){ g.clock=9999; g.update(0.05); }} " + PASSO(150)],
  ['salao_fiscal_falhas', JOGO() + CHEGA + FALHAS + PASSO(190)],
  ['salao_fiscal_aprovado_selo', JOGO("{selo:0}") + CHEGA + "{let n=0; while(!g.fiscal.res && n++<2000){ g.clock=9999; g.update(0.05); }} " + PASSO(10)],
  ['fim_do_dia_multa', JOGO() + CHEGA + FALHAS + FIM],
  ['fim_do_dia_aprovado', JOGO() + CHEGA + FIM],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_celular_deitado', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();

