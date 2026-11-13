// capturas da v10.7 (nível de luxo) em ../capturas/v10_7: cada ponto vazio e com todo o luxo (enfeites, mesas, toalha), uma mesa de cada degrau e a aba Luxo.
// Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v10_7.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_7'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const NIV = { garagem:1, industrial:2, avenida:3, terraco:4 };
// o ponto, com os degraus de mesa até `mv` (0 a 4), `enf` (todos os enfeites do ponto), `toalha` (xadrez em todas as mesas) e `senta` (grupos nas mesas)
const SV = (ponto, mv, enf, toalha, extra) => "g.save=L.normSave(Object.assign({dia:20,bank:9000,cap:5,histV:1,capV:2,maxDay:20,v10:1,pontoDia:19,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,up:{tenis:true,maquina:true},equipe:{tonhao:2,dani:2},salao:{ponto:'" + ponto + "'}}," + (extra || '{}') + "));g.up=g.save.up;"
  + "{const pn=" + NIV[ponto] + ", mv={}; L.MOVEIS.forEach((m,i)=>{ if(i<" + mv + ") mv[m.id]=1; }); g.save.moveis=L.normMoveis(mv); const d={}; if(" + enf + ") L.DECOR.forEach(x=>{ if(!x.nivel||pn>=x.nivel) d[x.id]=1; }); g.save.decor=L.normDecor(d); g.save.salao.mesas.concat(g.save.salao.estoque||[]).forEach(m=>{ m.t=" + (toalha ? 1 : 0) + "; }); }"
  + "g.tablesKey='';g.buildTables();";
const JOGAR = "g.startDay(20); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; ";
const SENTA = "for(let i=0;i<3;i++){ const k=g.spawn({type:i%2?'familia':'estudante',color:i,vip:false,av:true}); const t=g.tables.find(q=>q.free&&q.seats>=k.size); if(t){ g.seatGroup(k,t); k.setState('eating'); } } ";
const PONTOS = ['garagem', 'industrial', 'avenida', 'terraco'];
const CENAS = [];
PONTOS.forEach(p => {
  CENAS.push([p + '_vazio', BASE + SV(p, 0, 0, 0) + JOGAR]);
  CENAS.push([p + '_tudo', BASE + SV(p, 4, 1, 1) + JOGAR + SENTA]);
});
[1, 2, 3, 4].forEach(k => CENAS.push(['mesas_' + k, BASE + SV(PONTOS[k - 1], k, 0, k < 3) + JOGAR + SENTA]));
[[1,'madeira'],[3,'linho'],[4,'marmore']].forEach(([k,n]) => CENAS.push(['gar_' + n, BASE + SV('garagem', k, 0, 0) + JOGAR + SENTA]));
PONTOS.forEach(p => CENAS.push(['aba_luxo_fim_' + p, BASE + SV(p, 2, 1, 0) + "g.goShop(20); L.setShopGrupo('lanchonete'); L.setShopTab('luxo'); document.querySelectorAll('#ov-shop, #ov-shop .panel, #shop-grid').forEach(e=>{ e.scrollTop=99999; });"]));
CENAS.push(['cartoes_garagem', BASE + SV('garagem', 0, 0, 0) + "g.goShop(20); L.setShopGrupo('lanchonete');"]);
PONTOS.forEach(p => CENAS.push(['aba_luxo_' + p, BASE + SV(p, 2, 1, 0) + "g.goShop(20); L.setShopGrupo('lanchonete'); L.setShopTab('luxo');"]));
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
