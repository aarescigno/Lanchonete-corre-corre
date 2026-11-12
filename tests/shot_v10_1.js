// capturas da v10.1 (etapa 4a-2: o VIP exigente e a reputação) em ../capturas/v10_1: mesa de exigente (plaquinha de duas estrelas e acessórios), o prato da casa no balão, na janela
// e na mão, "E a minha bebida?", "Que salão bagunçado!", "Gorjeta generosa!", a Louça fina na lojinha, a conversa, o aviso do dia seguinte e as fichas do Manual.
// (a lista abaixo é herdada da v10 e só serve de base dos atalhos JOGO, SENTA, COMP e TG; as cenas da v10.1 vêm em CENAS)
// Uso: node shot_v10_1.js [filtro]
// ANTES: capturas da v10 (etapa 4a-1, parte A: o Terraço Suíça) em ../capturas/v10: cartão Mudança apagado, aceso e na confirmação, salão do Terraço com 5 mesas, o piano e a vista,
// o foyer com e sem as poltronas, o elevador, as flores, mesa de casal, VIP, a conversa do cap. 8, a lojinha no Terraço (Melhorias, Decoração, Equipe), fim do dia com o aluguel,
// o cartão de fim de capítulos, o menu; tela larga e celular deitado. Parte B (a refeição completa): a trilha dos tempos em 3 momentos (a entrada no balão, o principal, tudo
// servido) e uma mesa com vários balões ao mesmo tempo, "Refeição completa!", o fim do dia com as completas, a conversa do cap. 9 e o cartão de fim do Terraço.
// Uso: node shot_v10.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const TUDO = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SEM = "{tenis:true,fogaoInd:true,pratos:1,ventilador:true}";
const SALVA = (pt, extra) => "g.save=L.normSave(Object.assign({dia:9,bank:6000,cap:" + (pt === 'terraco' ? 9 : 8) + ",histV:1,capV:2,maxDay:9,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,up:" + (pt === 'terraco' ? TUDO : "{tenis:true,maquina:true,fogaoInd:true,assento:'sofa',pratos:1}") + ",equipe:{tonhao:3,dani:2,couvert:true},decor:{violeta:1,anturio:1,pendente:1,espada:1,tulipa:1,copo:1,orquidea:1,giz:1},cursos:{restaurante:1,pastel:1},salao:{ponto:'" + pt + "'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const LOJA = (bank, nota, tab, grupo) => BASE + SALVA('avenida', "{bank:" + bank + ",cap:8,decor:{},up:{tenis:true},equipe:{tonhao:1,dani:1},cursos:{}}") + "g.save.aval=Array(10).fill(Array(5).fill(" + nota + ")); g.goShop(9); L.setShopGrupo('" + (grupo || 'dinheiro') + "'); " + (tab ? "L.setShopTab('" + tab + "');" : '');
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[3]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const JOGO = (extra) => BASE + SALVA('terraco', extra) + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const gente = tipos => tipos.map((t, i) => "g.arrive({t:0,type:'" + t + "',color:" + (i % 4) + ",vip:" + (t === 'vip') + "});").join('').replace(/type:'vip'/g, "type:'casal'");
const SENTA = (tipos) => tipos.map((t, i) => "{ const m=new L.Group(g,'" + t[0] + "',++g.gid," + i + "," + (t[1] ? 'true' : 'false') + "); m.juiceWant=0; g.groups.push(m); g.seatGroup(m,g.tables[" + i + "]); m.setState('" + (t[2] || 'eating') + "'); m.timer=5; }").join('');
// a refeição completa (parte B): um grupo em cada mesa, no momento pedido. o: st (estado), tempo, nota (as 4 notas), vip, pos (código depois de sentar)
const COMP = "{equipe:{tonhao:3,dani:2,anselmo:2,couvert:true},daniCursos:{confCaseira:1},cursos:{restaurante:1,pastel:1}}";
const TG = (i, tipo, o) => "{ const m=new L.Group(g,'" + tipo + "',++g.gid," + (i % 4) + "," + (o.vip ? 'true' : 'false') + "); m.extras=m.people.map(()=>'coxinha'); m.dishes=m.people.map((p,k)=>k%2?'parmegiana':'pf'); m.dish=m.dishes[0]; m.juiceWant=0; g.groups.push(m); g.seatGroup(m,g.tables[" + i + "]); m.setState('" + o.st + "'); m.tempo=" + (o.tempo || 0) + "; m.notaT=" + JSON.stringify(o.nota || [null, null, null, null]) + "; m.timer=5; m.hearts=" + (o.h || 5) + "; " + (o.pos || '') + " }";
const PRATO = (slot, i, dish, tempo) => "g.kitchen.plates[" + slot + "]={id:" + (50 + slot) + ",table:" + (i + 1) + ",group:g.tables[" + i + "].group,dish:'" + dish + "',slot:" + slot + ",age:0,crit:false,q:4,vip:false,tempo:" + tempo + "};";
const TEMPOS_CENA = [
  TG(0, 'casal', { st:'ordered', tempo:0, nota:[5, null, null, null], pos:"m.drinksPedidos=true; m.drinksDados=m.drinks.length; " + PRATO(0, 0, 'coxinha', 0) }),
  TG(1, 'familia', { st:'eating', tempo:0, nota:[5, 4.7, null, null], pos:"m.drinksPedidos=true; m.drinksDados=m.drinks.length;" }),
  TG(2, 'vovos', { st:'ordered', tempo:1, nota:[4, 5, null, null], h:3, pos:"m.drinksPedidos=true; m.drinksDados=m.drinks.length; " + PRATO(1, 2, 'pf', 1) }),
  TG(3, 'negocios', { st:'eating', tempo:1, nota:[5, 4, 3, null], h:4, vip:true, pos:"m.esperaSuco=true; m.principalDado=true; m.drinksPedidos=true; m.drinksDados=1; m.doces=m.people.map(()=>L.docesLista(g.up)[0].id); m.docesDados=0; m.cafes=['espresso','cappuccino']; m.cafesDados=0; m.cafePede=false;" }),
  TG(4, 'executiva', { st:'wantBill', tempo:1, nota:[5, 3, 2, 5], h:2, pos:"m.principalDado=true;" })
].join('');
const EXIG = "g.save.aval=Array(10).fill(Array(5).fill(4.6));";
const PTEXTO = (txt, x, y) => "g.addText(" + x + "," + y + ",'" + txt + "',L.PAL.perigo,16);";
const CENAS = [
  ['mesa_exigente', JOGO(COMP) + SENTA([['casal', true, 'eating'], ['executiva', true, 'reading'], ['vovos', true, 'wantOrder'], ['familia', true, 'eating']]) + "g.update(0.05); g.fx=[]; g.update=function(){};"],
  ['fila_exigente', JOGO(COMP) + "g.arrive({t:0,type:'casal',color:0,vip:true,av:true}); g.arrive({t:0,type:'vovos',color:1,vip:true,av:true}); g.arrive({t:0,type:'familia',color:2,vip:false}); for(let i=0;i<60;i++) g.update(0.05); g.fx=[]; g.update=function(){};"],
  ['prato_casa_balao', JOGO(COMP) + TG(0, 'casal', { st:'ordered', tempo:1, nota:[5, 5, null, null], vip:true, pos:"m.exigente=true; m.drinksPedidos=true; m.drinksDados=m.drinks.length; " + PRATO(0, 0, 'pf', 1).replace('crit:false,q:4,vip:false', 'crit:true,q:5,vip:true,casa:true') }) + "g.update(0.05); g.fx=[]; g.update=function(){};"],
  ['prato_casa_mao', JOGO(COMP) + TG(0, 'casal', { st:'ordered', tempo:1, nota:[5, 5, null, null], vip:true, pos:"m.exigente=true; m.drinksPedidos=true; m.drinksDados=m.drinks.length;" }) + "g.bia.hands=[{kind:'dish',table:1,group:g.tables[0].group,dish:'pf',q:5,crit:true,casa:true,vip:true,tempo:1}]; g.update(0.05); g.fx=[]; g.update=function(){};"],
  ['frase_bebida', JOGO(COMP) + SENTA([['casal', true, 'ordered']]) + "{ const m=g.tables[0].group; m.drinks=[]; m.juiceWant=2; m.juiceGot=0; m.hearts=5; g.bia.hands=[{kind:'dish',table:1,group:m,dish:'coxinha',q:4,tempo:0}]; m.tempo=0; g.bia.perform({type:'table',id:1}); } g.update=function(){};"],
  ['frase_salao', JOGO(COMP) + "{ const u=g.tables[4]; u.dirty=true; u.dirtyN=2; u.sujaT=9; } " + "{ const m=new L.Group(g,'casal',++g.gid,0,true); g.groups.push(m); g.queue.push(m); g.seatGroup(m,g.tables[0]); } g.update=function(){};"],
  ['gorjeta_generosa', JOGO(COMP) + SENTA([['casal', true, 'wantBill']]) + "{ const m=g.tables[0].group; m.hearts=5; m.juiceWant=0; m.drinks=[]; g.collectBill(m,g.tables[0]); } g.update(0.05); g.update=function(){};"],
  ['louca_fina_loja', BASE + SALVA('terraco', "{bank:3000}") + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('melhorias');"],
  ['louca_fina_comprada', BASE + SALVA('terraco', "{bank:3000}") + "g.goShop(9); g.buy('louca'); L.setShopGrupo('lanchonete'); L.setShopTab('melhorias');"],
  ['aviso_bravo', BASE + SALVA('terraco', "{exigBravo:9}") + MESAS + "g.startDay(10);"],
  ['conversa_exigente', BASE + SALVA('terraco', "{cap:8,v10:1,convExig:'pend'}") + MESAS + "g.startDay(9); g.begin(); g.schedule=[]; g.nextIdx=0; g.stats.exigentes=1; g.money=2000; g.custo=400; g.finishDay();"],
  ['manual_exigente', BASE + SALVA('terraco', "{manual:['p-terraco','c-casal','c-vip','c-exigente','l-louca'],manualNovo:['c-exigente']}") + "g.setState('menu'); L.buildMenu(); L.abrirManual && L.abrirManual('clientes');"],
  ['manual_louca', BASE + SALVA('terraco', "{manual:['p-terraco','l-louca']}") + "g.setState('menu'); L.buildMenu(); L.abrirManual && L.abrirManual('lojinha');"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_celular_deitado', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      if (touch && ['mesa_exigente', 'prato_casa_balao'].indexOf(f) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
