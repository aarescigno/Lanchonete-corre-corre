// capturas da v9.1.1 (sessão 3b-1r) em ../capturas/v9_1_1: a parede da área industrial e da Avenida com o Cantinho da Rosa (foto, samambaia,
// plaquinha e quadro de giz), no PC e no celular deitado. Uso: node shot_v9_1_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_1_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const MESAS_I = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[1]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const TUDO = "{tenis:true,maquina:true,fogaoInd:true,assento:'sofa',pratos:1,ventilador:true}";
const SALVA = (pt, extra) => "g.save=L.normSave(Object.assign({dia:9,bank:6000,cap:" + (pt === 'avenida' ? 6 : 4) + ",histV:1,maxDay:9,up:" + (pt === 'avenida' ? TUDO : "{tenis:true,maquina:true,assento:'banco',tvs:true,fogaoInd:true}") + ",equipe:{tonhao:1,dani:1,couvert:true},decor:{violeta:1,anturio:1,pendente:1,espada:1,tulipa:1,copo:1,orquidea:1,giz:1},cursos:{restaurante:1,pastel:1},salao:{ponto:'" + pt + "'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const LOJA = (bank, nota, tab, grupo) => BASE + SALVA('industrial', "{bank:" + bank + ",cap:6,decor:{},up:{tenis:true},equipe:{tonhao:1,dani:1},cursos:{}}") + "g.save.aval=Array(10).fill(Array(5).fill(" + nota + ")); g.goShop(9); L.setShopGrupo('" + (grupo || 'dinheiro') + "'); " + (tab ? "L.setShopTab('" + tab + "');" : '');
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[2]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const JOGO = BASE + SALVA('avenida', "{decor:{samambaia:1,foto:1,placa:1,giz:1,espada:1,lata:1,tulipa:1,copo:1,orquidea:1}}") + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const gente = tipos => tipos.map((t, i) => "g.arrive({t:0,type:'" + t + "',color:" + (i % 4) + ",vip:" + (t === 'vip') + "});").join('').replace(/type:'vip'/g, "type:'executiva'");
const JOGO_I = BASE + SALVA('industrial', "{decor:{samambaia:1,foto:1,placa:1,giz:1,espada:1,lata:1,violeta:1,anturio:1,pendente:1}}") + MESAS_I + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const CENAS = [
  ['parede_industrial', JOGO_I + gente(['estudante', 'familia']) + "for(let i=0;i<60;i++) g.update(0.05);"],
  ['parede_avenida', JOGO + gente(['negocios', 'familia']) + "for(let i=0;i<60;i++) g.update(0.05);"],
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
