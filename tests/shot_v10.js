// capturas da v10 (etapa 4a-1, parte A: o Terraço Suíça) em ../capturas/v10: cartão Mudança apagado, aceso e na confirmação, salão do Terraço com 5 mesas, o piano e a vista,
// o foyer com e sem as poltronas, o elevador, as flores, mesa de casal, VIP, a conversa do cap. 8, a lojinha no Terraço (Melhorias, Decoração, Equipe), fim do dia com o aluguel,
// o cartão de fim de capítulos, o menu; tela larga e celular deitado. Uso: node shot_v10.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const TUDO = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SEM = "{tenis:true,fogaoInd:true,pratos:1,ventilador:true}";
const SALVA = (pt, extra) => "g.save=L.normSave(Object.assign({dia:9,bank:6000,cap:" + (pt === 'terraco' ? 8 : 7) + ",histV:1,maxDay:9,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,up:" + (pt === 'terraco' ? TUDO : "{tenis:true,maquina:true,fogaoInd:true,assento:'sofa',pratos:1}") + ",equipe:{tonhao:3,dani:2,couvert:true},decor:{violeta:1,anturio:1,pendente:1,espada:1,tulipa:1,copo:1,orquidea:1,giz:1},cursos:{restaurante:1,pastel:1},salao:{ponto:'" + pt + "'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const LOJA = (bank, nota, tab, grupo) => BASE + SALVA('avenida', "{bank:" + bank + ",cap:8,decor:{},up:{tenis:true},equipe:{tonhao:1,dani:1},cursos:{}}") + "g.save.aval=Array(10).fill(Array(5).fill(" + nota + ")); g.goShop(9); L.setShopGrupo('" + (grupo || 'dinheiro') + "'); " + (tab ? "L.setShopTab('" + tab + "');" : '');
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[3]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const JOGO = (extra) => BASE + SALVA('terraco', extra) + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const gente = tipos => tipos.map((t, i) => "g.arrive({t:0,type:'" + t + "',color:" + (i % 4) + ",vip:" + (t === 'vip') + "});").join('').replace(/type:'vip'/g, "type:'casal'");
const SENTA = (tipos) => tipos.map((t, i) => "{ const m=new L.Group(g,'" + t[0] + "',++g.gid," + i + "," + (t[1] ? 'true' : 'false') + "); m.juiceWant=0; g.groups.push(m); g.seatGroup(m,g.tables[" + i + "]); m.setState('" + (t[2] || 'eating') + "'); m.timer=5; }").join('');
const CENAS = [
  ['mudanca_apagado', LOJA(3000, 3.5, 'mudanca')],
  ['mudanca_aceso', LOJA(9000, 4.2, 'mudanca')],
  ['mudanca_confirma', LOJA(9000, 4.2, 'mudanca') + "document.querySelector('#shop-grid .btn').click();"],
  ['dinheiro_cartoes', LOJA(9000, 4.2, null)],
  ['salao_terraco', JOGO() + gente(['casal', 'casal', 'familia', 'vovos', 'negocios', 'executiva']) + "for(let i=0;i<100;i++) g.update(0.05);"],
  ['foyer_poltronas', JOGO() + gente(['casal', 'familia', 'vovos', 'negocios', 'executiva', 'casal']) + "for(let i=0;i<140;i++) g.update(0.05);"],
  ['foyer_sem_poltronas', JOGO("{up:" + SEM + "}") + gente(['casal', 'familia', 'vovos', 'negocios', 'executiva', 'casal']) + "for(let i=0;i<140;i++) g.update(0.05);"],
  ['foyer_vazio', JOGO("{decor:{}}")],
  ['elevador_chegando', JOGO() + "g.arrive({t:0,type:'casal',color:1,vip:false}); for(let i=0;i<3;i++) g.update(0.05); g.setState('paused');"],
  ['mesa_casal', JOGO() + SENTA([['casal', false, 'eating'], ['casal', false, 'reading'], ['familia', false, 'eating'], ['negocios', false, 'wantOrder']]) + "g.update(0.05); g.fx=[]; g.update=function(){};"],
  ['mesa_vip', JOGO() + SENTA([['casal', true, 'eating'], ['executiva', true, 'reading'], ['vovos', true, 'eating']]) + "g.update(0.05); g.fx=[]; g.update=function(){};"],
  ['melhorias_terraco', BASE + SALVA('terraco') + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('melhorias');"],
  ['decoracao_terraco', BASE + SALVA('terraco', "{decor:{}}") + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('decor');"],
  ['equipe_terraco', BASE + SALVA('terraco') + "g.goShop(9); L.setShopGrupo('equipe');"],
  ['salao_loja', BASE + SALVA('terraco') + MESAS + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('salao');"],
  ['fim_do_dia_aluguel', BASE + SALVA('terraco') + "g.startDay(9); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=1500; g.custo=300; g.finishDay();"],
  ['conversa_cap8', BASE + SALVA('terraco', "{cap:8,conversa:'antes'}") + MESAS + "g.setState('menu'); L.playCareer();"],
  ['fim_capitulos_terraco', BASE + SALVA('terraco', "{cap:8,conversa:'depois'}") + "g.setState('menu'); L.playCareer();"],
  ['menu_terraco', BASE + SALVA('terraco', "{cap:8}") + "g.setState('menu'); L.buildMenu();"],
  ['manual_terraco', BASE + SALVA('terraco', "{manual:['p-terraco','c-casal']}") + "g.setState('menu'); L.buildMenu(); L.abrirManual && L.abrirManual('lugares');"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_celular_deitado', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      if (touch && ['salao_terraco', 'mudanca_aceso'].indexOf(f) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
