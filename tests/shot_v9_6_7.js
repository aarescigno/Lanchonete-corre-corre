// capturas da v9.6.7 (sessão 3f-1) em ../capturas/v9_6_7: o Manual (abas Básico, Clientes, Equipe, Lojinha, Lugares e Imprevistos), em tela cheia e em 740x360; menu e pausa com o botão Manual.
// Uso: node shot_v9_6_7.js [filtro]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v9_6_7'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// carreira no dia 10 da área industrial, com parte das fichas abertas
const SAVE = "g.save=L.normSave({dia:10,bank:3000,maxDay:10,salao:{ponto:'industrial'},equipe:{tonhao:2,dani:2,joca:2}}); g.up=g.save.up; g.up.bandeja=true; g.save.manual=g.save.manual.filter(x=>x!=='c-vovos'&&x!=='c-motorista'&&x!=='c-turma'&&x!=='i-apito'); g.save.manualNovo=['c-familia']; g.setState('menu');";
const CENAS = [
  ['manual_basico', BASE + SAVE + "L.abrirManual('b-sentar','menu');"],
  ['manual_clientes', BASE + SAVE + "L.abrirManual('c-estudante','menu');"],
  ['manual_equipe', BASE + SAVE + "L.abrirManual('e-dani','menu');"],
  ['manual_lojinha', BASE + SAVE + "L.abrirManual('l-bandeja','menu');"],
  ['manual_lugares', BASE + SAVE + "L.abrirManual('p-garagem','menu');"],
  ['manual_imprevistos', BASE + SAVE + "L.abrirManual('i-quebra','menu');"],
  ['lojinha_com_ajuda', BASE + SAVE + "g.goShop(10); document.getElementById('ov-shop').classList.add('show');"],
  ['pausa', BASE + SAVE + "g.startDay(10); g.begin(); g.pause();"],
  ['menu', BASE + SAVE + "document.getElementById('ov-menu').classList.add('show');"],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [name, vw, vh] of [['_pc', 1220, 600], ['_740x360', 740, 360], ['_celular_em_pe_ish', 520, 700]]) {
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
