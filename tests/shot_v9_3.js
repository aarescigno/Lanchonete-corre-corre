// capturas da v9.3 (sessão 3b-3) em ../capturas/v9_3: o salão da Avenida com a vitrine gourmet, a máquina de espresso, os cafés pedidos, o Joca barista, a Cami nos
// 3 níveis, os três ajudantes juntos; a lojinha (Cardápio com o gourmet e o espresso, cartões da Cami, do Joca e da Dani) e a conversa da Cami.
// Uso: node shot_v9_3.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_3'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SALVA = (eq, extra) => "g.save=L.normSave(Object.assign({dia:11,bank:9000,cap:7,histV:1,maxDay:11,pontoDia:5,up:{tenis:true,maquina:true,assento:'sofa',fogaoInd:true,bandeja:true,ventilador:true},equipe:" + eq + ",daniCursos:{confCaseira:1,confGourmet:1},jocaCursos:{espresso:1},cursos:{},decor:{},salao:{ponto:'avenida'},convCard:1,convDiv:1,libera:{confeitaria:2,joca:2,cami:2}}," + (extra || '{}') + ")); g.up=g.save.up;";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[2]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const EQ = "{tonhao:2,dani:3,joca:3,cami:2,daniTasks:['doce'],jocaTasks:['lixo','pratos'],camiTasks:['lixo','pratos','lavar'],couvert:true}";
const JOGO = eq => BASE + SALVA(eq || EQ) + MESAS + "g.startDay(11); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
// um grupo sentado que acabou de comer e espera doces e cafés
const MESA = (i, tipo, doces, cafes) => "{const t=g.tables[" + i + "], m=new L.Group(g,'" + tipo + "',++g.gid," + (i % 4) + ",false); m.juiceWant=0; m.cafePede=false; g.groups.push(m); t.group=m; m.table=t; m.x=t.cx; m.y=t.cy+30; m.setState('eating'); m.timer=0.01; m.hearts=4; m.doces=" + JSON.stringify(doces || []) + "; m.cafes=" + JSON.stringify(cafes || []) + "; m.update(0.05); }";
const LOJA = (tab, grupo, extra, eq) => BASE + SALVA(eq || "{tonhao:2,dani:3,joca:3,cami:2,daniTasks:['doce'],jocaTasks:['lixo','pratos'],camiTasks:['lixo','pratos','lavar']}", extra) + "g.save.aval=Array(10).fill([4,4,4,4,4]); g.goShop(11); L.setShopGrupo('" + (grupo || 'equipe') + "'); " + (tab ? "L.setShopTab('" + tab + "');" : '');
const CONV = (id) => BASE + SALVA("{tonhao:1,dani:3,joca:3}", "{libera:{cami:0}}") + "g.goShop(11); L.falar(L.liberaOf('" + id + "').falas, ()=>{}); ";
const CENAS = [
  ['salao_vitrine_espresso', JOGO() + MESA(0, 'executiva', ['shortcake', 'torta'], ['espresso', 'cappuccino']) + MESA(1, 'vovos', ['brigGourmet'], ['cappuccino']) + MESA(2, 'negocios', [], ['espresso', 'espresso']) + "g.joca.hands=[{kind:'cafeesp',group:g.tables[0].group,id:'espresso'},{kind:'cafeesp',group:g.tables[0].group,id:'cappuccino'}]; g.joca.x=690; g.joca.y=400; g.cami.x=620; g.cami.y=500; g.dani.hands=[{kind:'doce',group:g.tables[0].group,id:'shortcake'}]; g.dani.x=700; g.dani.y=300; for(let i=0;i<3;i++) g.update(0.01);"],
  ['salao_tres_ajudantes', JOGO() + "g.trash=6; g.tables[3].dirty=true; g.tables[3].dirtyN=2; g.cami.x=560; g.cami.y=470; g.cami.hands=[{kind:'dirty',n:2}]; g.joca.x=690; g.joca.y=350; g.dani.x=700; g.dani.y=250; for(let i=0;i<3;i++) g.update(0.01);"],
  ['cami_nivel1', JOGO("{tonhao:2,dani:3,joca:3,cami:1,daniTasks:['doce'],jocaTasks:['lixo'],camiTasks:['lixo','pratos','lavar']}") + "g.cami.x=560; g.cami.y=470; for(let i=0;i<3;i++) g.update(0.01);"],
  ['cami_nivel2', JOGO() + "g.cami.x=560; g.cami.y=470; for(let i=0;i<3;i++) g.update(0.01);"],
  ['cami_nivel3', JOGO("{tonhao:2,dani:3,joca:3,cami:3,daniTasks:['doce'],jocaTasks:['lixo'],camiTasks:['lixo','pratos','lavar']}") + "g.cami.x=560; g.cami.y=470; for(let i=0;i<3;i++) g.update(0.01);"],
  ['marmita_doce_gourmet', JOGO() + "{const e=g.arrive({t:0,type:'entregador',color:1,vip:false}); e.docesMarm=1; g.potes=2;} for(let i=0;i<30;i++) g.update(0.05);"],
  ['loja_cardapio', LOJA('cardapio', 'lanchonete')],
  ['loja_cardapio_fim', LOJA('cardapio', 'lanchonete', "{daniCursos:{confCaseira:1},jocaCursos:{}}") + "document.querySelectorAll('#ov-shop *').forEach(e=>{ if(e.scrollHeight>e.clientHeight+20) e.scrollTop=e.scrollHeight; });"],
  ['loja_cami', LOJA('cami', 'equipe')],
  ['loja_cami_contratar', LOJA('cami', 'equipe', "{libera:{cami:1}}", "{tonhao:2,dani:3,joca:3,daniTasks:['doce'],jocaTasks:['lixo','pratos']}")],
  ['loja_joca', LOJA('joca', 'equipe')],
  ['loja_dani', LOJA('dani', 'equipe')],
  ['loja_equipe_cartoes', LOJA(null, 'equipe')],
  ['conversa_cami', CONV('cami')],
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
