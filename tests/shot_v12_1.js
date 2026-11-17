// capturas da v12.1 (os quatro desafios novos) em ../capturas/v12_1, em 1220 x 600 e 844 x 390: a tela com os sete, a introdução de cada novo, a ficha do crítico no Manual
// e um momento de cada dia (a barraca, a TV do jogo, o crítico à mesa, o salão de exigentes). Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v12_1.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// o save de quem já viu o Fim da história (cap 15), no Terraço, com as medalhas `des`
const FIM = des => "g.save=L.normSave({dia:70,bank:12345,estrelas:77,lucroTot:54321,histV:1,capV:6,cap:15,conversa:null,treino:true,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,salao:{ponto:'terraco'},desafios:" + des + "});g.up=g.save.up;g.tablesKey='';g.buildTables();";
// termina o desafio `id` com o lucro `meta` (ou `exp`/`bom`) e `lost` grupos bravos
const FECHA = (id, alvo, lost) => "g.startDesafio('" + id + "'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day." + alvo + "; g.stats.lost=" + lost + "; g.finishDay();";
const JOGA = (id, t) => "g.startDesafio('" + id + "'); g.begin(); for(let i=0;i<" + t + ";i++) g.update(0.05);";
const CENAS = [
  ['desafios_sete', BASE + FIM('{soBia:3,semBravo:2,efood:1,junina:1,jogo:0}') + "g.setState('desafios');"],
  ['intro_junina', BASE + FIM('{}') + "g.startDesafio('junina');"],
  ['intro_jogo', BASE + FIM('{}') + "g.startDesafio('jogo');"],
  ['intro_critico', BASE + FIM('{}') + "g.startDesafio('critico');"],
  ['intro_vips', BASE + FIM('{}') + "g.startDesafio('vips');"],
  ['manual_desafios', BASE + FIM('{}') + "g.setState('menu'); L.abrirManual('d-critico','desafios');"],
  ['jogando_junina', BASE + FIM('{}') + JOGA('junina', 1200)],
  ['jogando_jogo', BASE + FIM('{}') + JOGA('jogo', 1200)],
  ['jogando_critico', BASE + FIM('{}') + JOGA('critico', 1200)],
  ['jogando_vips', BASE + FIM('{}') + JOGA('vips', 1200)]
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[1220, 600], [844, 390]]) {
    const ctx = await b.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:2, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e)));
    for (const [f, js] of CENAS) {
      if (FILTRO && f.indexOf(FILTRO) < 0) continue;
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + js + '}catch(e){return String(e.stack)}})()'); if (r) console.log(f, r); await pg.waitForTimeout(400);
      await pg.screenshot({ path:path.join(OUT, f + '_' + w + 'x' + h + '.png') });
    }
    await ctx.close();
  }
  console.log('ERRORS:', errs); await b.close(); fs.unlinkSync(W);
})();
