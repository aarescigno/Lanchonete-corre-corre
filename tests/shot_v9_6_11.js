// capturas da v9.6.7 (sessão 3f-1) em ../capturas/v9_6_7: o Manual (abas Básico, Clientes, Equipe, Lojinha, Lugares e Imprevistos), em tela cheia e em 740x360; menu e pausa com o botão Manual.
// Uso: node shot_v9_6_7.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_6_11'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const RUN = "const roda=(s,c)=>{for(let i=0;i<s/0.05;i++){g.update(0.05);if(c&&c())return true;}return false;};";
const DIA = (ponto, n) => "g.save=L.normSave({dia:" + n + ",bank:3000,maxDay:" + n + (ponto ? ",salao:{ponto:'" + ponto + "'}" : "") + "}); g.up=g.save.up; g.startDay(" + n + "); document.getElementById('btn-start')&&document.getElementById('btn-start').click(); if(g.state!=='playing') g.begin(); g.schedule=[{t:1e9,type:'entregador'}]; ";
const ENTR = RUN + "const e=g.spawn({type:'entregador',color:1}); e.patLeft=1e9; e.hearts=5; roda(25,()=>g.kitchen.marmJ.some(Boolean));";
const CENAS = [
  ['mesinha_garagem', BASE + DIA(null, 4) + ENTR],
  ['mesinha_avenida', BASE + DIA('avenida', 12) + ENTR],
  ['fumaca_meio', BASE + DIA(null, 3) + RUN + "g.trash=L.TRASH.cap; roda(14);"],
  ['fumaca_max', BASE + DIA(null, 3) + RUN + "g.trash=L.TRASH.cap; roda(32);"],
  ['fim_do_dia_baloes', BASE + DIA(null, 3) + "g.schedule=[]; g.nextIdx=0; g.avals=[{r:[5,5,5,5,5],s:[5,5,5,5,5],txt:'Adorei o atendimento!',k:'vovos'},{r:[2,2,2,2,2],s:[2,2,2,2,2],txt:'Demorou demais.',k:'familia'},{r:[4,4,4,4,4],s:[4,4,4,4,4],txt:'Comida boa e rápida.',k:'executiva'}]; g.finishDay(); g.conversa=null; document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show')); document.getElementById('ov-end').classList.add('show');"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vw, vh] of [['_pc', 1220, 600], ['_568x320', 568, 320]]) {
    const ctx = await b.newContext({ viewport:{ width:vw, height:vh }, deviceScaleFactor:2 });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(1800);
      await pg.screenshot({ path:path.join(OUT, f + name + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
