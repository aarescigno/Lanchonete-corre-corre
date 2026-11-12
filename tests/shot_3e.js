// capturas da etapa 3e (revisão da interface) em ../capturas/3e: cada ponto no pico do dia, com tudo comprado e a equipe toda, o bot jogando;
// tela larga e celular deitado. Uso: node shot_3e.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', '3e'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const CUR = "{pastel:2,chapa:2,fritos:2,assados:2,pf:2,veg:2,restaurante:2}";
const DEC = "{espada:1,lata:1,samambaia:1,violeta:1,anturio:1,pendente:1,tulipa:1,copo:1,orquidea:1,foto:1,giz:1,placa:1,plantas:1,rosa:1}";
const UP = "{tenis:true,corrida:true,maquina:true,cafeteira:true,bandeja:true,sudoku:true,ventilador:true,triturador:true,pratos:2,tvs:true,fogaoInd:true,assento:'sofa',confCaseira:true,confGourmet:true}";
const PT = {
  garagem:  { dia:7,  cap:3, eq:"{tonhao:2,dani:3}", extra:"" },
  industrial:{ dia:11, cap:5, eq:"{tonhao:2,dani:3,joca:3,tvs:1}", extra:",daniCursos:{confCaseira:1},libera:{confeitaria:2,joca:2}" },
  avenida:  { dia:15, cap:8, eq:"{tonhao:2,dani:3,joca:3,cami:3,camiModo:'mesas',anselmo:2,tvs:1}", extra:",daniCursos:{confCaseira:1,confGourmet:1},jocaCursos:{espresso:1},camiCursos:{agil:1,mesa:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2}" },
};
const SALVA = id => { const p = PT[id]; return "g.save=L.normSave({dia:" + p.dia + ",bank:9000,cap:" + p.cap + ",histV:1,capV:2,maxDay:" + p.dia + ",pontoDia:5,up:" + UP + ",equipe:" + p.eq + ",cursos:" + CUR + ",decor:" + DEC + ",salao:{ponto:'" + id + "'}" + p.extra + "}); g.up=g.save.up;" +
  "{const P=L.pontoOf('" + id + "'); const n=P.lugares/4; const r=L.salaoAuto(Array.from({length:n},(_,i)=>({seats:4,c:i%4})),P); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao);} g.tablesKey=''; g.buildTables();}" +
  (id === 'avenida' ? "{ g.save.salao.mesas.slice(0,2).forEach(m=>m.cami=1); g.tablesKey=''; g.buildTables(); }" : ""); };
const DIA = (id, seg) => BASE + SALVA(id) + "g.mode='carreira'; g.startDay(" + PT[id].dia + "); g.begin(); window.run(" + seg + ",true);";
const CENAS = [];
for (const id of ['garagem', 'industrial', 'avenida']) for (const s of [70, 110, 150]) CENAS.push([id + '_pico' + s, DIA(id, s)]);
for (const id of ['garagem', 'industrial', 'avenida']) CENAS.push([id + '_loja', BASE + SALVA(id) + "g.goShop(" + PT[id].dia + ");"]);
CENAS.push(['menu', BASE + SALVA('avenida') + "g.setState('menu');"]);
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_cel', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(500);
      await pg.addScriptTag({ path:path.join(__dirname, 'botpage.js') });
      const r = await pg.evaluate('(()=>{try{' + js + '; return "ok el="+Math.round(g.elapsed)+" grupos="+g.groups.length+" fila="+g.queue.length+" st="+g.state}catch(e){return String(e.stack)}})()'); console.log(f + name, r); await pg.waitForTimeout(400);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
