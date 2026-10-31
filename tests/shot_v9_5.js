// capturas da v9.4 (sessão 3b-4) em ../capturas/v9_5: a introdução com o aviso, o fiscal no salão (entrando, olhando com as 3 falhas, aprovado com o selo na parede),
// o fim do dia com a multa e o fim do dia aprovado. Uso: node shot_v9_5.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_5'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";

const SALVA = (eq, extra) => "g.save=L.normSave(Object.assign({dia:11,bank:9000,cap:7,histV:1,maxDay:11,pontoDia:5,up:{tenis:true,maquina:true,assento:'sofa',fogaoInd:true,bandeja:true,ventilador:true},equipe:" + eq + ",daniCursos:{confCaseira:1,confGourmet:1},jocaCursos:{espresso:1},cursos:{},decor:{},salao:{ponto:'avenida'},convCard:1,convDiv:1,libera:{confeitaria:2,joca:2,cami:2}}," + (extra || '{}') + ")); g.up=g.save.up;";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[2]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const EQ = "{tonhao:2,dani:3,joca:3,cami:1,anselmo:2}";
const JOGO = (extra) => BASE + SALVA(EQ, extra) + MESAS + "g.startDay(11); g.begin(); g.schedule.forEach(s=>s.t=9999); ";
const PASSO = n => "for(let i=0;i<" + n + ";i++){ g.clock=9999; g.update(0.05); } ";
// três mesas com grupos pedindo drinks
const GRUPOS = "g.mode='carreira'; ['executiva','familia','negocios'].forEach((tp,i)=>{ const t=g.tables[i], m=new L.Group(g,tp,++g.gid,0,false); m.size=Math.min(m.size,2); m.drinks=['por','brisa','esmeralda'].slice(i,i+2); t.group=m; m.table=t; m.x=t.cx; m.y=t.cy+30; m.setState('wantOrder'); }); ";
const PEDIDOS = "g.tables.slice(0,3).forEach(t=>{ g.bia.hands=[]; g.bia.doTable(t); }); g.bia.hands=[]; ";
const CENAS = [
  ['salao_balcao_vazio', JOGO() + PASSO(5)],
  ['salao_preparando', JOGO() + GRUPOS + PEDIDOS + PASSO(40)],
  ['salao_copos_prontos_baloes', JOGO() + GRUPOS + PEDIDOS + PASSO(120)],
  ['salao_bia_com_drinks', JOGO("{bandeja:true}") + GRUPOS + PEDIDOS + PASSO(120) + "g.bia.perform({type:'drinks'}); " + PASSO(2)],
  ['loja_cartao_anselmo', BASE + SALVA(EQ) + MESAS + "g.save.libera=Object.assign({},g.save.libera,{anselmo:2}); g.goShop(11); L.setShopGrupo('equipe'); L.setShopTab('anselmo'); "],
  ['conversa_anselmo', BASE + SALVA("{tonhao:2}") + MESAS + "L.falar(L.liberaOf('anselmo').falas.slice(0,4), ()=>{}); "],
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

