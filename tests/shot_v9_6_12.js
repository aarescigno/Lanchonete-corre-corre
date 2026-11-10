// capturas da v9.6.12 (revisão geral) em ../capturas/v9_6_12: as dicas na hora (sentar, anotar, pegar o prato), o HUD com as estrelas
// na barra (abaixo da meta, com 2 estrelas e com a 3ª perdida), o fim do dia com os botões no pé e a Missão zero enxuta;
// em tela cheia e em 568x320. Uso: node shot_v9_6_12.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_6_12'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const RODA = "const roda=(f,max)=>{for(let i=0;i<(max||4000);i++){if(f())return true;g.update(0.05);}return f();}; const para=s=>{for(let i=0;i<s/0.05;i++)g.update(0.05);};";
// dia 1 de um save novo, com um casal na calçada e a mesa da cor dele
const DIA1 = BASE + RODA + "g.resetProgress(); g.save.treino=true; g.save.conversa=null; g.startDay(1); g.begin(); g.schedule=[{t:1e9,type:'estudante'}]; g.nextIdx=0; const grp=g.spawn({type:'vovos',color:1}); grp.patLeft=1e9; grp.hearts=5; roda(()=>!grp.path.length); const mesa=g.tables.find(t=>t.color===grp.color&&t.seats>=grp.size);";
const PEDIU = DIA1 + "g.seatGroup(grp,mesa); roda(()=>grp.state==='wantOrder');";
const DIA4 = lucro => BASE + "g.save=L.normSave({dia:4,bank:300,maxDay:4}); g.up=g.save.up; g.startDay(4); g.begin(); window.run(60,true); g.money=g.custo+g.contas+g.paid+g.paidDiv+" + lucro + ";";
// Missão zero até o passo i, jogando sozinho
const TREINO = i => "const g=window.__game, L=window.__lcc; L.playCareer(0); g.treino.t=5; for(let k=0;k<4000 && g.treino && g.treino.i<" + i + ";k++){ const tr=g.treino, p=tr.passo; if(p.ok){tr.seguir();continue;} g.update(0.05); if(tr.i>=" + i + ")break; const gr=tr.grupo; if(!gr)continue; const id=p.id; if(id==='sentar'&&!gr.table&&gr.state==='queue') g.seatGroup(gr,tr.mesa); else if(['anotar','servir','cafe2','cobrar','louca'].includes(id)&&!g.bia.acts.length) g.tapTable(tr.mesa); else if(id==='cozinha'&&!g.bia.acts.length) g.tapStation('order',800,150); else if(id==='prato'&&!g.bia.acts.length){const s=L.STATIONS.plates.rect; g.onDown(s.x+g.cam+20,s.y+s.h/2,0); g.onUp(s.x+g.cam+20,s.y+s.h/2);} else if(id==='cafe'&&!g.bia.acts.length) g.tapStation('coffee',810,350); }";
const CENAS = [
  ['dica_sentar', DIA1 + "para(6);"],
  ['dica_anotar', PEDIU + "g.semToque=0; para(6);"],
  ['dica_prato', PEDIU + "g.tapTable(mesa); roda(()=>g.bia.hands.length&&!g.bia.acts.length); g.tapStation('order',800,150); roda(()=>g.kitchen.plates.some(p=>p)&&!g.bia.acts.length); g.semToque=0; para(6);"],
  ['hud_abaixo_da_meta', DIA4(20) + "g.stats.lost=0;"],
  ['hud_duas_estrelas', DIA4(90) + "g.stats.lost=0;"],
  ['hud_terceira_perdida', DIA4(90) + "g.stats.lost=1;"],
  ['fim_do_dia', BASE + "g.resetProgress(); g.save.treino=true; g.save.conversa=null; g.startDay(1); g.begin(); window.run(400,true); for(let i=0;i<600&&g.conversa;i++){g.conversa.seguir();}", 2600],
  ['treino_sentar', TREINO(3)], ['treino_fila', TREINO(6)],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vw, vh] of [['_pc', 1220, 600], ['_568x320', 568, 320]]) {
    const ctx = await b.newContext({ viewport:{ width:vw, height:vh }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js, espera] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(500);
      await pg.evaluate("try{localStorage.clear();localStorage.setItem('lcc2_abertura','1')}catch(e){}");
      await pg.goto('file://' + W); await pg.waitForTimeout(500);
      await pg.addScriptTag({ path:path.join(__dirname, 'botpage.js') });
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(espera || 500);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
