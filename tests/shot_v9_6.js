// capturas da v9.6 (sessão 3b-6) em ../capturas/v9_6: a Cami atendendo as mesas dela (avental no tampo), o editor do salão com a mesa marcada
// e o cartão da Cami com os dois modos. Uso: node shot_v9_6.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_6'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";

const SALVA = (eq, extra) => "g.save=L.normSave(Object.assign({dia:11,bank:9000,cap:7,histV:1,maxDay:11,pontoDia:5,up:{tenis:true,maquina:true,assento:'sofa',fogaoInd:true,bandeja:true,ventilador:true},equipe:" + eq + ",daniCursos:{confCaseira:1,confGourmet:1},jocaCursos:{espresso:1},camiCursos:{agil:1,mesa:1},cursos:{},decor:{},salao:{ponto:'avenida'},convCard:1,convDiv:1,libera:{confeitaria:2,joca:2,cami:2}}," + (extra || '{}') + ")); g.up=g.save.up;";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[2]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const EQ = "{tonhao:2,dani:3,joca:3,cami:3,camiModo:'mesas',anselmo:2}";
// as 2 mesas mais perto da janela viram da Cami
const MARCA = "{ const W=L.LAYOUT.STATIONS.order.ap; g.save.salao.mesas.map((m,i)=>[Math.hypot(m.x-W.x,m.y-W.y),i]).sort((a,b)=>a[0]-b[0]).slice(0,2).forEach(q=>{ g.save.salao.mesas[q[1]].cami=1; }); g.tablesKey=''; g.buildTables(); }";
const JOGO = BASE + SALVA(EQ) + MESAS + MARCA + "g.startDay(11); g.begin(); g.tables.forEach(t=>t.open=true); g.schedule.forEach(s=>s.t=9999); g.mode='carreira'; ";
const PASSO = n => "for(let i=0;i<" + n + ";i++){ g.update(0.05); } ";
const GRUPOS = "['executiva','familia'].forEach((tp,i)=>{ const t=g.tables.filter(q=>q.cami)[i], m=new L.Group(g,tp,++g.gid,0,false); m.size=Math.min(m.size,2); m.drinks=[]; m.people=m.people.slice(0,m.size); m.dishes=m.dishes.slice(0,m.size); t.group=m; m.table=t; m.x=t.cx; m.y=t.cy+30; m.setState('wantOrder'); g.groups.push(m); }); ";
const CENAS = [
  ['salao_avental_vazio', JOGO + PASSO(5)],
  ['salao_cami_anotando', JOGO + GRUPOS + PASSO(40)],
  ['salao_cami_com_prato', JOGO + GRUPOS + PASSO(160)],
  ['loja_cartao_cami', BASE + SALVA(EQ) + MESAS + MARCA + "g.goShop(11); L.setShopGrupo('equipe'); L.setShopTab('cami'); "],
  ['loja_editor_mesa_cami', BASE + SALVA(EQ) + MESAS + MARCA + "g.goShop(11); L.setShopGrupo('lanchonete'); L.setShopTab('salao'); g.salaoSel=g.save.salao.mesas.findIndex(m=>m.cami); L.setShopTab('salao'); "],
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

