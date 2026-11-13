// capturas da v10.10 (a noite da estrela) em ../capturas/v10_10: o Terraço de noite (céu, velas), o crítico com a plaquinha do Michelzão, o Bráulio à mesa com o balão, o cartão da lojinha,
// o boletim com 0, 1 e 3 estrelas e o selo do menu. Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v10_10.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_10'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SV = (extra) => "g.save=L.normSave(Object.assign({dia:64,bank:9000,cap:14,histV:1,capV:5,maxDay:64,v10:1,pontoDia:50,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,convExig:1,vipVisto:1,exigVisto:1,efoodNota:1,up:{tenis:true,bandeja:true,maquina:true},equipe:{tonhao:4,dani:3,anselmo:3,lia:1,cami:5},camiCursos:{agil:1,mesa:1,salao:1,gerente:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},conversa:null,salao:{ponto:'terraco'},rosa:1,guia:{n:2,prox:0,v:[{d:60,it:[2,2,2,1,1]},{d:62,it:[2,2,2,1,1]}]}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
// a noite no dia 64: o crítico e o Bráulio sentados (o Bráulio com o balão), com a mesa de prato
const NOITE = "g.save.guia.noite=64; g.startDay(64); g.begin(); const SC=g.schedule.find(x=>x.critico), SB=g.schedule.find(x=>x.braulio); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; " +
  "const C=g.spawn(SC), B=g.spawn(SB); const t1=g.tables.find(q=>q.free&&q.seats>=C.size); g.seatGroup(C,t1); C.setState('ordered'); C.path=[]; C.x=t1.cx; C.y=t1.cy+30; C.caderno=1.5; " +
  "const t2=g.tables.filter(q=>q.free&&q.seats>=B.size).sort((a,b)=>Math.abs(a.cx-t1.cx)-Math.abs(b.cx-t1.cx)).pop(); g.seatGroup(B,t2); B.setState('ordered'); B.path=[]; B.x=t2.cx; B.y=t2.cy+30; B.diz('Vim provar a cópia.',99); g.fx=[]; ";
const BOL = (est, rec, lin) => "L.abrirGuia(" + est + "," + rec + "," + JSON.stringify(lin) + ",null);";
const CENAS = [
  ['noite_salao', BASE + SV() + NOITE],
  ['noite_sem_mesas_cheias', BASE + SV() + "g.save.guia.noite=64; g.startDay(64); g.begin(); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; g.fx=[];"],
  ['bralio_feliz', BASE + SV() + NOITE + "B.diz('...',99);"],
  ['bralio_bravo', BASE + SV() + NOITE + "B.diz('Sabia! Amadores.',99);"],
  ['intro_da_noite', BASE + SV() + "g.save.guia.noite=64; g.startDay(64);"],
  ['cartao_lojinha', BASE + SV() + "g.goShop(64); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['cartao_marcada', BASE + SV('{guia:{n:2,prox:0,v:[],noite:64}}') + "g.goShop(64); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['cartao_espera', BASE + SV('{guia:{n:2,prox:0,v:[],ult:63,est:0,rec:1}}') + "g.goShop(64); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['boletim_0_estrelas', BASE + BOL(0, 1, [0.4, 0.5, 0.67, 0.2, 0.5, 0])],
  ['boletim_1_estrela', BASE + BOL(1, 0, [0.62, 0.67, 0.67, 0.4, 1, 0])],
  ['boletim_3_estrelas', BASE + BOL(3, 0, [1, 1, 1, 1, 1, 1])],
  ['selo_menu', BASE + SV('{guia:{n:2,prox:0,v:[],est:2,ult:60,noite:0}}') + "g.setState('menu'); L.buildMenu(); document.getElementById('ov-menu').classList.add('show');"]
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
