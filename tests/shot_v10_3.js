// capturas da v10.3 (etapa 4a-4: o salão e o bar do Terraço) em ../capturas/v10_3: o cartão da Cami com os 3 modos, a bancada dos cafés com as etapas, os 5 cafés e os 6 drinks,
// o carrinho de boas-vindas no foyer, os cartões do Anselmo e do Cardápio. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v10_3.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_3'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const UP = "{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}";
const SV = (extra) => "g.save=L.normSave(Object.assign({dia:9,bank:9000,cap:9,histV:1,capV:2,maxDay:9,v10:1,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,up:" + UP + ",equipe:{tonhao:3,dani:3,joca:3,cami:4,camiModo:'tudo',anselmo:3,lia:1},camiCursos:{agil:1,mesa:1,salao:1},jocaCursos:{espresso:1,cafesEsp:1},anselmoCursos:{classica:1,autor:1},daniCursos:{confCaseira:1,confGourmet:1,confAlta:1},cursos:{restaurante:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},salao:{ponto:'terraco'}}," + extra + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const MESAS = "{const r=L.salaoAuto([4,4,4,4,4].map((seats,i)=>({seats,c:i%4})),L.PONTOS[3]); if(r){ g.save.salao.mesas=r; g.save.salao=L.normSalao(g.save.salao); } g.tablesKey=''; g.buildTables();}";
const JOGO = (extra) => BASE + SV(extra || '{}') + MESAS + "g.startDay(9); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; ";
const FOLHA = "{ const cv=document.createElement('canvas'); cv.width=1000; cv.height=260; cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#F7EFD8'; document.body.appendChild(cv); const c=cv.getContext('2d'); ";
const CENAS = [
  ['loja_cami', BASE + SV('{}') + "g.goShop(9); L.setShopGrupo('equipe'); L.setShopTab('cami');"],
  ['loja_anselmo', BASE + SV('{anselmoCursos:{}}') + "g.goShop(9); L.setShopGrupo('equipe'); L.setShopTab('anselmo');"],
  ['loja_cardapio', BASE + SV('{anselmoCursos:{classica:1},jocaCursos:{espresso:1}}') + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['icones', BASE + FOLHA + "for(let i=0;i<5;i++) L.drawIcon(c,'cafeesp',60+i*90,60,2.4,i); for(let i=0;i<6;i++) L.drawIcon(c,'drink',60+i*90,170,2.4,i); } "],
  ['bancada_cafes', JOGO() + "g.bia.phase='do'; g.bia.doing={type:'espresso',item:'prensa'}; g.bia.timer=1.4; g.update(0.01); g.bia.phase='do'; g.bia.doing={type:'espresso',item:'prensa'}; g.bia.timer=1.4;"],
  ['carrinho_foyer', JOGO() + "g.mode='carreira'; for(let i=0;i<3;i++){ g.arrive({t:0,type:'casal',color:i,vip:false}); } g.update(0.05); g.drinkPronto=[]; g.maq.push({ group:g.groups[0], n:2, t:0 });"],
  ['balcao_drinks', JOGO() + "g.mode='carreira'; g.drinkPronto=[{id:'neblina'},{id:'jardim'},{id:'ouro'}]; g.update(0.05);"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport:{ width:1220, height:600 }, deviceScaleFactor:2 });
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
