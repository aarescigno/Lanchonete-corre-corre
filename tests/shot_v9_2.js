// capturas da v9.2 (sessão 3b-2) em ../capturas/v9_2: o salão da área industrial com a geladeirinha de doces, o balão do doce, o Joca (níveis 2 a 4) e a
// Dani trabalhando, a marmita com "+ doce"; a lojinha (Cardápio com a Confeitaria caseira, cartão do Joca, cartão da Dani) e as 2 conversas.
// Uso: node shot_v9_2.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_2'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SALVA = (eq, extra) => "g.save=L.normSave(Object.assign({dia:9,bank:6000,cap:5,histV:1,maxDay:9,pontoDia:1,up:{tenis:true,maquina:true,assento:'banco',tvs:true,fogaoInd:true,bandeja:true,ventilador:true},equipe:" + eq + ",daniCursos:{confCaseira:1},cursos:{},decor:{},salao:{ponto:'industrial'},convCard:1,convDiv:1,libera:{confeitaria:2,joca:2}}," + (extra || '{}') + ")); g.up=g.save.up;";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[1]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const EQ = "{tonhao:2,dani:3,joca:3,daniTasks:['cafe','doce'],jocaTasks:['lixo','pratos','lavar'],tvs:1}";
const JOGO = eq => BASE + SALVA(eq || EQ) + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
// um grupo sentado que acabou de comer e espera os doces
const MESA = (i, tipo, doces) => "{const t=g.tables[" + i + "], m=new L.Group(g,'" + tipo + "',++g.gid," + (i % 4) + ",false); m.juiceWant=0; m.cafePede=false; g.groups.push(m); t.group=m; m.table=t; m.x=t.cx; m.y=t.cy+30; m.setState('eating'); m.timer=0.01; m.hearts=4; m.doces=" + JSON.stringify(doces) + "; m.update(0.05); }";
const LOJA = (tab, grupo, extra, eq) => BASE + SALVA(eq || "{tonhao:2,dani:3,joca:3,daniTasks:['cafe','doce'],jocaTasks:['lixo','pratos','lavar']}", extra) + "g.save.aval=Array(10).fill([4,4,4,4,4]); g.goShop(9); L.setShopGrupo('" + (grupo || 'equipe') + "'); " + (tab ? "L.setShopTab('" + tab + "');" : '');
const CONV = (id) => BASE + SALVA("{tonhao:1,dani:2}", "{libera:{confeitaria:0,joca:0}}") + "g.goShop(9); window.__falar=L.falar; L.falar(L.liberaOf('" + id + "').falas, ()=>{}); ";
const CENAS = [
  ['salao_doces', JOGO() + MESA(0, 'familia', ['bolo', 'brigadeiro', 'pudim']) + MESA(1, 'vovos', ['pudim']) + MESA(2, 'estudante', ['brigadeiro', 'bolo']) + "g.dani.hands=[{kind:'doce',group:g.tables[0].group,id:'bolo'}]; g.dani.x=700; g.dani.y=300; g.joca.hands=[{kind:'dirty',n:2}]; g.joca.x=690; g.joca.y=430; g.bia.hands=[{kind:'doce',id:'pudim'}]; for(let i=0;i<4;i++) g.update(0.01);"],
  ['marmita_doce', JOGO() + "{const e=g.arrive({t:0,type:'entregador',color:1,vip:false}); e.docesMarm=1; const e2=g.arrive({t:0,type:'encomenda',color:2,vip:false,lote:5}); g.potes=2;} for(let i=0;i<30;i++) g.update(0.05); g.dani.hands=[{kind:'doce',group:null,ret:true,id:'brigadeiro'}];"],
  ['joca_nivel2', JOGO("{tonhao:2,dani:3,joca:2,daniTasks:['cafe','doce'],jocaTasks:['lixo','lavar']}") + "g.joca.x=600; g.joca.y=480; g.trash=6; for(let i=0;i<4;i++) g.update(0.01);"],
  ['joca_nivel4', JOGO("{tonhao:2,dani:4,joca:4,daniTasks:['cafe','doce'],jocaTasks:['lixo','pratos','lavar']}") + "g.joca.x=600; g.joca.y=480; g.joca.hands=[{kind:'dirty',n:2},{kind:'dirty',n:1}]; for(let i=0;i<4;i++) g.update(0.01);"],
  ['loja_cardapio', LOJA('cardapio', 'lanchonete')],
  ['loja_cardapio_fim', LOJA('cardapio', 'lanchonete') + "document.querySelectorAll('#ov-shop *').forEach(e=>{ if(e.scrollHeight>e.clientHeight+20) e.scrollTop=e.scrollHeight; });"],
  ['loja_joca', LOJA('joca', 'equipe')],
  ['loja_joca_contratar', LOJA('joca', 'equipe', "{libera:{confeitaria:2,joca:1}}", "{tonhao:1,dani:3,daniTasks:['pratos','lavar']}")],
  ['loja_dani', LOJA('dani', 'equipe')],
  ['loja_equipe_cartoes', LOJA(null, 'equipe')],
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
