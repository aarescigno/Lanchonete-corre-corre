// capturas da v11.16.1 (R1, retornos da Letícia) em ../capturas/v11_16_1: a espera sentada com pernas, as bandeirinhas presas, a Bia crespa (4x),
// o enfeite da mesa em cada ponto e a área industrial com todo o luxo. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v11_16_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v11_16_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const NIV = { garagem:1, industrial:2, avenida:3, terraco:4 };
const UP = (assento) => "{tenis:true,maquina:true,tvs:true,assento:'" + assento + "'}";
// o ponto, com os degraus de mesa até `mv` (0 a 4), `enf` (todos os enfeites do ponto), `toalha` (o enfeite da mesa em todas) e o `extra` do save
const SV = (ponto, mv, enf, toalha, up) => "g.save=L.normSave({dia:20,bank:9000,cap:5,histV:1,capV:2,maxDay:20,v10:1,pontoDia:19,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,up:" + (up || "{tenis:true,maquina:true}") + ",equipe:{tonhao:2,dani:2},salao:{ponto:'" + ponto + "'}});g.up=g.save.up;"
  + "{const pn=" + NIV[ponto] + ", mv={}; L.MOVEIS.forEach((m,i)=>{ if(i<" + mv + ") mv[m.id]=1; }); g.save.moveis=L.normMoveis(mv); const d={}; if(" + enf + ") L.DECOR.forEach(x=>{ if(!x.nivel||pn>=x.nivel) d[x.id]=1; }); g.save.decor=L.normDecor(d); g.save.salao.mesas.concat(g.save.salao.estoque||[]).forEach(m=>{ m.t=" + (toalha ? 1 : 0) + "; }); }"
  + "g.tablesKey='';g.buildTables();";
const JOGAR = "g.startDay(20); g.begin(); g.schedule.forEach(s=>s.t=9999); g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; ";
const SENTA = "for(let i=0;i<3;i++){ const k=g.spawn({type:i%2?'familia':'estudante',color:i,vip:false,av:true}); const t=g.tables.find(q=>q.free&&q.seats>=k.size); if(t){ g.seatGroup(k,t); k.setState('eating'); } } ";
const COMENDO = "g.tables.forEach((t,i)=>{ if(i%2===0) return; const k=g.spawn({type:'estudante',color:i,vip:false,av:true}); if(t.free&&t.seats>=k.size){ g.seatGroup(k,t); k.setState('eating'); } }); ";
// grupos na espera (tipo, tamanho) e entregadores na retirada, e o relógio andando para todos chegarem ao lugar
const FILA = (lista, n) => "for (const [ty,sz] of " + JSON.stringify(lista) + "){ const k=g.spawn({type:ty,color:0,vip:false}); k.size=sz; k.people=k.people.slice(0,sz); while(k.people.length<sz) k.people.push(k.people[0]); } for(let i=0;i<" + (n || 260) + ";i++){ g.groups.forEach(x=>{ if(x.state!=='leaving') x.patLeft=1e9; }); g.update(0.05); } ";
const PONTOS = ['garagem', 'industrial', 'avenida', 'terraco'];
const CENAS = [];
// (a) a espera sentada na área industrial
[['banco', [['estudante',1],['estudante',2],['familia',4],['vovos',2],['casal',2]]], ['cadeira', [['familia',3],['estudante',2],['casal',2],['estudante',1],['executiva',1]]]].forEach(([as, fila]) => {
  CENAS.push(['pernas_' + as, BASE + SV('industrial', 0, 0, 0, UP(as)) + JOGAR + FILA(fila)]);
});
// (b) as bandeirinhas da festa junina nos 4 pontos
PONTOS.forEach(p => CENAS.push(['band_' + p, BASE + SV(p, 0, 0, 0) + JOGAR + "g.evento='junina'; g.update(0.05); "]));
// (c) a Bia com cada roupa, parada e andando, e o retrato, a 4x (num canvas de teste)
CENAS.push(['bia_roupas', BASE + "L.DEV.on=true; const cv=document.createElement('canvas'); cv.width=960; cv.height=600; cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#e9e4d8'; document.body.appendChild(cv); const c=cv.getContext('2d'); c.lineJoin='round'; c.lineCap='round';"
  + "[1,2,3,4].forEach((n,i)=>{ g.devRoupa(n); c.save(); c.translate(70+i*226,230); c.scale(3,3); L.drawBia(c,g.bia,0,0,{roupa:n,moving:false,t:0}); c.restore(); c.save(); c.translate(70+i*226,470); c.scale(3,3); L.drawBia(c,g.bia,0,0,{roupa:n,moving:true,ph:1.2,t:0.4}); c.restore(); c.save(); c.translate(70+i*226,560); c.scale(1.3,1.3); L.drawRetrato(c,'bia','neutra',0,0,g); c.restore(); }); g.devRoupa(null);"]);
CENAS.push(['bia_retrato', BASE + "L.DEV.on=true; const cv=document.createElement('canvas'); cv.width=960; cv.height=300; cv.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#2b2620'; document.body.appendChild(cv); const c=cv.getContext('2d'); c.lineJoin='round'; c.lineCap='round';"
  + "[1,2,3,4].forEach((n,i)=>{ g.devRoupa(n); c.save(); c.translate(130+i*230,150); c.scale(3.2,3.2); L.drawRetrato(c,'bia',['neutra','alegre','firme','brava'][i],0,0,g); c.restore(); }); g.devRoupa(null);"]);
// (d) o enfeite da mesa em cada ponto: vazias e com gente comendo, nos 4 tampos
PONTOS.forEach((p, i) => { [0, 1, 4].concat(i === 3 ? [3] : []).forEach(mv => { CENAS.push(['enf_' + p + '_mv' + mv, BASE + SV(p, mv, 0, 1) + JOGAR + (mv === 1 ? COMENDO : '')]); }); });
CENAS.push(['enf_terraco_noite', BASE + SV('terraco', 0, 0, 1) + JOGAR + "g.noite=true; "]);
CENAS.push(['enf_terraco_nao_noite', BASE + SV('terraco', 0, 0, 1) + JOGAR + COMENDO]);
// CA11: a área industrial com todo o luxo, as 3 TVs, a fila e a retirada cheias; e a Avenida (plaquinha do eFood e a lata)
const CHEIA = [['estudante',1],['estudante',2],['familia',4],['vovos',2],['casal',2],['entregador',1],['entregador',1],['entregador',1]];
CENAS.push(['ind_tudo', BASE + SV('industrial', 4, 1, 1, UP('banco')) + JOGAR + "g.save.up.tvs=true; " + FILA(CHEIA) + SENTA]);
CENAS.push(['ind_tudo_cadeira', BASE + SV('industrial', 4, 1, 1, UP('cadeira')) + JOGAR + FILA(CHEIA, 400)]);
CENAS.push(['ave_tudo', BASE + SV('avenida', 4, 1, 1, UP('sofa')) + JOGAR + FILA(CHEIA) + SENTA]);
CENAS.push(['gar_efood', BASE + SV('garagem', 0, 1, 0) + JOGAR + FILA([['entregador',1],['entregador',1],['estudante',2]])]);
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
