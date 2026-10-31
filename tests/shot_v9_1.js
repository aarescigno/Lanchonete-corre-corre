// capturas da v9.1 (etapa 3b-1: Restaurante na Avenida Brasil) em ../capturas/v9_1: cartão Mudança apagado e aceso, confirmação, salão da Avenida com tudo
// comprado e 24 lugares, mesa de negócios, VIP, calçada com sofás, águas e flores, couvert, 6 pratos no balcão, parmegiana, fim do dia com o aluguel,
// conversa do cap. 7, cartão de fim dos capítulos; tela larga e celular deitado. Uso: node shot_v9_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const TUDO = "{tenis:true,maquina:true,fogaoInd:true,assento:'sofa',pratos:1,ventilador:true}";
const SALVA = (pt, extra) => "g.save=L.normSave(Object.assign({dia:9,bank:6000,cap:" + (pt === 'avenida' ? 6 : 4) + ",histV:1,maxDay:9,up:" + (pt === 'avenida' ? TUDO : "{tenis:true,maquina:true,assento:'banco',tvs:true,fogaoInd:true}") + ",equipe:{tonhao:1,dani:1,couvert:true},decor:{violeta:1,anturio:1,pendente:1,espada:1,tulipa:1,copo:1,orquidea:1,giz:1},cursos:{restaurante:1,pastel:1},salao:{ponto:'" + pt + "'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const LOJA = (bank, nota, tab, grupo) => BASE + SALVA('industrial', "{bank:" + bank + ",cap:6,decor:{},up:{tenis:true},equipe:{tonhao:1,dani:1},cursos:{}}") + "g.save.aval=Array(10).fill(Array(5).fill(" + nota + ")); g.goShop(9); L.setShopGrupo('" + (grupo || 'dinheiro') + "'); " + (tab ? "L.setShopTab('" + tab + "');" : '');
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[2]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const JOGO = BASE + SALVA('avenida') + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const gente = tipos => tipos.map((t, i) => "g.arrive({t:0,type:'" + t + "',color:" + (i % 4) + ",vip:" + (t === 'vip') + "});").join('').replace(/type:'vip'/g, "type:'executiva'");
const CENAS = [
  ['mudanca_apagado', LOJA(300, 3.3, 'mudanca')],
  ['mudanca_aceso', LOJA(2500, 3.5, 'mudanca')],
  ['mudanca_confirma', LOJA(2500, 3.5, 'mudanca') + "document.querySelector('#shop-grid .btn').click();"],
  ['dinheiro_cartoes', LOJA(2500, 3.5, null)],
  ['salao_avenida', JOGO + gente(['negocios', 'negocios', 'familia', 'vovos', 'vip', 'estudante']) + "for(let i=0;i<100;i++) g.update(0.05);"],
  ['calcada', JOGO + gente(['estudante', 'negocios', 'familia', 'vovos', 'executiva', 'estudante']) + "g.stats && 0; for(let i=0;i<100;i++) g.update(0.05);"],
  ['mesa_negocios', JOGO + "[0,1,2].forEach((k,i)=>{ const m=new L.Group(g,i===2?'executiva':'negocios',++g.gid,i,i===2); m.vip=i===2; m.juiceWant=0; g.groups.push(m); g.seatGroup(m,g.tables[i]); if(!m.table) console.log('sem mesa'); m.setState('eating'); m.timer=5; }); g.update(0.05);"],
  ['pratos_balcao', JOGO + "const ds=['parmegiana','pf','coxinha','parmegiana','pastel','pf']; ds.forEach((d,i)=>{ g.kitchen.plates[i]={ id:++g.kitchen.pid, table:i+1, group:null, dish:d, slot:i, age:i===5?20:1, crit:i===3, q:4, vip:false }; }); g.update(0.05);"],
  ['melhorias_avenida', BASE + SALVA('avenida') + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('melhorias');"],
  ['cardapio_avenida', BASE + SALVA('avenida') + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['decoracao_avenida', BASE + SALVA('avenida', "{decor:{}}") + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('decor');"],
  ['manutencao_avenida', BASE + SALVA('avenida') + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('manut');"],
  ['divulga_avenida', BASE + SALVA('avenida') + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('divulga');"],
  ['fim_do_dia_aluguel', BASE + SALVA('avenida') + "g.startDay(9); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=1200; g.custo=300; g.finishDay();"],
  ['conversa_cap7', BASE + SALVA('avenida', "{cap:7,conversa:'antes'}") + "g.setState('menu'); L.playCareer();"],
  ['fim_capitulos_avenida', BASE + SALVA('avenida', "{cap:7,conversa:'depois'}") + "g.setState('menu'); L.playCareer();"],
  ['menu_avenida', BASE + SALVA('avenida', "{cap:8}") + "g.setState('menu'); L.buildMenu();"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_celular_deitado', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      if (touch && ['salao_avenida', 'mudanca_aceso'].indexOf(f) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
