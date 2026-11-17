// capturas da v12 (Desafios) em ../capturas/v12, em 1220 x 600 e 844 x 390: o menu com o botão, a tela de Desafios (uma medalha de cada cor e cartões sem medalha),
// a introdução de Só a Bia, o cartão do fim com medalha e com o `falhou`, e a tela com o Manual na aba Desafios. Confira em recorte (PIL crop) e descarte: capturas não vão para o git.
// Uso: node shot_v12.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// o save de quem já viu o Fim da história (cap 15), no Terraço, com as medalhas `des`
const FIM = des => "g.save=L.normSave({dia:70,bank:12345,estrelas:77,lucroTot:54321,histV:1,capV:6,cap:15,conversa:null,treino:true,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,salao:{ponto:'terraco'},desafios:" + des + "});g.up=g.save.up;g.tablesKey='';g.buildTables();";
// termina o desafio `id` com o lucro `meta` (ou `exp`/`bom`) e `lost` grupos bravos
const FECHA = (id, alvo, lost) => "g.startDesafio('" + id + "'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day." + alvo + "; g.stats.lost=" + lost + "; g.finishDay();";
const CENAS = [
  ['menu', BASE + FIM('{}') + "g.setState('menu');"],
  ['desafios_a', BASE + FIM('{soBia:1,semBravo:2,efood:3}') + "g.setState('desafios');"],
  ['desafios_b', BASE + FIM('{soBia:0,semBravo:1}') + "g.setState('desafios');"],
  ['intro_soBia', BASE + FIM('{}') + "g.startDesafio('soBia');"],
  ['fim_bronze', BASE + FIM('{}') + FECHA('semBravo', 'meta', 0)],
  ['fim_ouro', BASE + FIM('{}') + FECHA('semBravo', 'expert', 0)],
  ['fim_falhou', BASE + FIM('{}') + FECHA('semBravo', 'expert', 2)],
  ['fim_nao_deu', BASE + FIM('{}') + FECHA('efood', 'meta', 0).replace('g.money=g.fixo+g.day.meta', 'g.money=g.fixo')],
  ['manual_desafios', BASE + FIM('{}') + "g.setState('menu'); L.abrirManual('d-semBravo','desafios');"],
  ['jogando_soBia', BASE + FIM('{}') + "g.startDesafio('soBia'); g.begin(); g.elapsed=40; for(let i=0;i<400;i++) g.update(0.05);"]
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
