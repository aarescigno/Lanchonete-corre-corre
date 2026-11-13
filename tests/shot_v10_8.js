// capturas da v10.8 (o molho da Rosa) em ../capturas/v10_8: o vaso de rosas no armário e as pétalas no HUD, o Prato da Rosa na mão, no balcão e na mesa, o cartão do molho e o da Cami gerente.
// Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v10_8.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_8'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SV = (extra) => "g.save=L.normSave(Object.assign({dia:64,bank:9000,cap:12,histV:1,capV:3,maxDay:64,v10:1,pontoDia:50,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,convExig:1,vipVisto:1,efoodNota:1,up:{tenis:true,bandeja:true,maquina:true},equipe:{tonhao:4,dani:3,anselmo:3,lia:1,cami:5},camiCursos:{agil:1,mesa:1,salao:1,gerente:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},conversa:null,salao:{ponto:'terraco'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const JOGAR = "g.startDay(64); g.begin(); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; ";
// duas mesas com grupo exigente comendo; um prato da casa no balcão; a Bia com um Prato da Rosa na mão e 1 pétala
const CENA = "const A=g.spawn({type:'casal',color:0,vip:true,av:true}); const t1=g.tables.find(q=>q.free&&q.seats>=A.size); g.seatGroup(A,t1); A.setState('ordered'); A.entradaDada=true; A.path=[]; A.x=t1.cx; A.y=t1.cy+30; g.entregaPrato(A,{kind:'dish',table:t1.id,group:A,dish:'pf',crit:true,q:4,vip:true,tempo:1,casa:true,rosa:true},t1); A.principalDado=true;" +
  "const B=g.spawn({type:'casal',color:2,vip:true,av:true}); const t2=g.tables.find(q=>q.free&&q.seats>=B.size); g.seatGroup(B,t2); B.setState('ordered');" +
  "const k=g.kitchen; k.plates[0]={id:++k.pid,table:t2.id,group:B,dish:'pf',slot:0,age:2,crit:false,q:4,vip:true,tempo:1,casa:true};" +
  "g.bia.hands=[{kind:'dish',table:t2.id,group:B,dish:'pf',crit:true,q:4,vip:true,tempo:1,casa:true,rosa:true}]; g.bia.petalas=1; g.bia.x=520; g.bia.y=330;";
const CENAS = [
  ['vaso_com_rosas', BASE + SV('{rosa:1}') + JOGAR + CENA],
  ['vaso_sem_rosas', BASE + SV('{rosa:0}') + JOGAR + CENA],
  ['pegando_petalas', BASE + SV('{rosa:1}') + JOGAR + "g.bia.x=700;g.bia.y=150;g.bia.petalas=2;g.bia.hands=[];"],
  ['cartao_molho', BASE + SV('{rosa:0}') + "g.goShop(64); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio'); document.querySelectorAll('#ov-shop, #ov-shop .panel, #shop-grid').forEach(e=>{ e.scrollTop=99999; });"],
  ['cartao_cami', BASE + SV('{rosa:1}') + "g.goShop(64); L.setShopGrupo('equipe'); L.setShopTab('cami'); document.querySelectorAll('#ov-shop, #ov-shop .panel, #shop-grid').forEach(e=>{ e.scrollTop=99999; });"]
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:960, height:600 }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
  await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
  for (const [f, js] of CENAS) {
    if (FILTRO && f.indexOf(FILTRO) < 0) continue;
    await pg.goto('file://' + W); await pg.waitForTimeout(600);
    const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
    await pg.screenshot({ path:path.join(OUT, f + '.png') });
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
