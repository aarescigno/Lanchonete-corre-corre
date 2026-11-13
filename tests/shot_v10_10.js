// capturas da v10.10 (a noite da estrela) em ../capturas/v10_10: o Terraço de noite (céu, velas), o crítico com a plaquinha do Michelzão, o Bráulio à mesa com o balão, o cartão da lojinha, o boletim com 0, 1 e 3 estrelas e o selo no menu.
// Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v10_10.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_10'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SV = (extra) => "g.save=L.normSave(Object.assign({dia:64,bank:9000,cap:14,histV:1,capV:5,maxDay:64,v10:1,pontoDia:50,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,convExig:1,vipVisto:1,exigVisto:1,efoodNota:1,guia:{n:2,prox:0,v:[{d:55,it:[2,2,2,1,1]},{d:58,it:[2,2,2,1,1]}],noite:64},up:{tenis:true,bandeja:true,maquina:true},equipe:{tonhao:4,dani:3,anselmo:3,lia:1,cami:5},camiCursos:{agil:1,mesa:1,salao:1,gerente:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},conversa:null,salao:{ponto:'terraco'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";

const NOITE = "g.startDay(64); g.begin(); g.schedule=[]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; ";
const SENTA = (q, estado) => "const S=g.schedule0.find(x=>x." + q + "); const G=g.spawn(S); const t=g.tables.find(q=>q.free&&q.seats>=G.size&&!q.group); g.seatGroup(G,t); G.setState('" + estado + "'); G.path=[]; G.x=t.cx; G.y=t.cy+30; ";
const BOLETIM = (est, rec, bol) => "g.save.guia.est=" + est + "; g.save.guia.rec=" + rec + "; g.save.guia.ult=64; g.save.guia.bol=" + bol + "; L.abreBoletim(()=>{});";
const CENAS = [
  ['terraco_de_noite', BASE + SV('{rosa:1}') + NOITE.replace("g.schedule=[];", "") + "g.schedule=[{t:99999,type:'casal'}]; g.tables.forEach((t,i)=>{ if(i<3){ const G=g.spawn({type:'casal',color:i,vip:false,av:true}); g.seatGroup(G,t); G.setState('eating'); G.path=[]; G.x=t.cx; G.y=t.cy+30; } }); g.fx=[];"],
  ['critico_michelzao', BASE + SV('{rosa:1}') + "g.startDay(64); g.begin(); g.schedule0=g.schedule.slice(); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; " + SENTA('critico', 'ordered') + "G.caderno=1.5; g.fx=[];"],
  ['braulio_com_balao', BASE + SV('{rosa:1}') + "g.startDay(64); g.begin(); g.schedule0=g.schedule.slice(); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; " + SENTA('braulio', 'reading') + "G.diz('Vim provar a cópia.'); g.fx=[];"],
  ['braulio_bravo_saindo', BASE + SV('{rosa:1}') + "g.startDay(64); g.begin(); g.schedule0=g.schedule.slice(); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; " + SENTA('braulio', 'ordered') + "G.hearts=1; g.angryLeave(G); g.fx=[];"],
  ['cartao_lojinha', BASE + SV('{rosa:1,guia:{n:2,prox:0,v:[],noite:0}}') + "g.goShop(64); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['boletim_0_estrelas', BASE + SV('{rosa:1}') + BOLETIM(0, 1, '[0.4,0.2,0,0,0,0]')],
  ['boletim_1_estrela', BASE + SV('{rosa:1}') + BOLETIM(1, 0, '[0.8,0.6,0.33,0.66,1,0]')],
  ['boletim_3_estrelas', BASE + SV('{rosa:1}') + BOLETIM(3, 0, '[1,1,1,1,1,1]')],
  ['selo_no_menu', BASE + SV('{rosa:1,guia:{n:2,prox:0,v:[],est:2,ult:60,bol:[1,1,1,1,1,1]}}') + "g.setState('menu');"]
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
