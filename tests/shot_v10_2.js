// capturas da v10.2 (etapa 4a-3: a cozinha do Terraço) em ../capturas/v10_2: os 6 pratos finos (no prato, na mesa e no cartão Cardápio), os 3 doces da alta confeitaria
// (vitrine e fila), a Lia na cozinha, o cartão dela, o Cardápio com os dois cursos e a conversa. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v10_2.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_2'); fs.mkdirSync(OUT, { recursive:true });
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
const FINOS = "['bruschetta','bacalhau','quiche','risoto','peixe','medalhao']";
const TE = "{equipe:{tonhao:4,dani:2,anselmo:2,lia:1,couvert:true},daniCursos:{confCaseira:1,confGourmet:1,confAlta:1},cursos:{restaurante:1,entradas:2,alta:2},up:{tenis:true,fogaoInd:true,assento:'poltrona',pratos:1,ventilador:true}}";
const CENAS = [
  ['lia_cozinha', JOGO(TE) + "g.update(0.05);"],
  ['pratos_finos', BASE + "{ const cv=document.createElement('canvas'); cv.width=1200; cv.height=560; cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#F7EFD8'; document.body.appendChild(cv); const c=cv.getContext('2d'); const F=" + FINOS + "; F.forEach((k,i)=>{ L.drawDish(c,k,110+i*190,120,5.5,false,'bife',false); L.drawDish(c,k,110+i*190,300,5.5,false,'bife',true); L.drawMarmita(c,k,110+i*190,470,2.2); }); }"],
  ['doces_alta', BASE + "{ const cv=document.createElement('canvas'); cv.width=1200; cv.height=300; cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#F7EFD8'; document.body.appendChild(cv); const c=cv.getContext('2d'); [0,1,2,3,4,5,6,7,8].forEach(i=>L.drawIcon(c,'doce',70+i*120,150,4,i)); }"],
  ['mesa_prato_fino', JOGO(TE) + SENTA([['casal', true, 'eating'], ['executiva', false, 'eating']]) + "g.tables[0].group.dishes=g.tables[0].group.people.map(()=>'medalhao'); g.tables[1].group.dishes=g.tables[1].group.people.map(()=>'risoto'); g.update(0.05);"],
  ['loja_lia', BASE + SALVA('terraco', "{bank:3000,cap:8,v10:1,equipe:{tonhao:3,dani:2},cursos:{restaurante:1}}") + "g.goShop(9); L.setShopGrupo('equipe'); L.setShopTab('lia');"],
  ['loja_equipe', BASE + SALVA('terraco', "{bank:3000,cap:8,v10:1,equipe:{tonhao:3,dani:2,lia:1}}") + "g.goShop(9); L.setShopGrupo('equipe'); L.setShopTab(null);"],
  ['loja_cardapio', BASE + SALVA('terraco', "{bank:5000,cap:8,v10:1,equipe:{tonhao:3,dani:2},daniCursos:{confCaseira:1,confGourmet:1},cursos:{restaurante:1,entradas:1}}") + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['loja_cardapio_cheio', BASE + SALVA('terraco', "{bank:5000,cap:8,v10:1,equipe:{tonhao:3,dani:2},daniCursos:{confCaseira:1,confGourmet:1,confAlta:1},cursos:{restaurante:1,entradas:2,alta:2}}") + "g.goShop(9); L.setShopGrupo('lanchonete'); L.setShopTab('cardapio');"],
  ['conversa_lia', BASE + SALVA('terraco', "{cap:8,v10:1,cursos:{restaurante:1,entradas:1},libera:{lia:'pend'}}") + MESAS + "g.startDay(9); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=2000; g.custo=400; g.finishDay();"],
  ['manual_lia', BASE + SALVA('terraco', "{manual:['p-terraco','e-lia'],manualNovo:['e-lia'],equipe:{tonhao:3,dani:2,lia:1}}") + "g.setState('menu'); L.buildMenu(); L.abrirManual && L.abrirManual('equipe');"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vp, touch] of [['_pc', [1220, 600], false], ['_celular_deitado', [740, 360], true]]) {
    const ctx = await b.newContext({ viewport:{ width:vp[0], height:vp[1] }, hasTouch:touch, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      if (touch && ['lia_cozinha', 'mesa_prato_fino'].indexOf(f) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
