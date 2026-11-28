// capturas da v12.12.1 em ../capturas/v12_12_1 (CA8): o fiscal, o músico do couvert, o trio, o pianista e a Bia do menu em quatro momentos (parado, p 0,25, 0,5 e 0,75) e com
// prefers-reduced-motion (p 0,5); a campainha (parada, afundada, e o "Já vai, já vai!"), na Garagem e no Terraço; os três "Atchim!"; e a festa da equipe toda da Avenida. Recortes a DSF 2.
// Confira ampliando e apague. Uso: node shot_v12_12_1.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_12_1'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const MOMENTOS = [['parado', 0], ['p25', 0.25], ['p50', 0.5], ['p75', 0.75]];
const EQ = "{tonhao:1,dani:1,joca:2,cami:2,anselmo:2,lia:1}";
/* ponto: 'terraco' (dia 65) ou 'avenida' (dia 50) ou 'garagem' (dia 1); mus: 0, 1 (trio) ou 2 (pianista); couvert liga o músico do couvert */
const prep = (ponto, dia, mus, couvert) => "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;" +
  "g.mode='carreira';g.save=L.normSave({dia:" + dia + ",maxDay:" + dia + ",bank:99999,up:{tenis:true},equipe:" + EQ + ",salao:{ponto:'" + ponto + "'}});g.save.equipe.couvert=" + !!couvert + ";g.save.equipe.musica=" + mus + ";g.up=g.save.up;g.tablesKey='';g.buildTables();g.startDay(" + dia + ");g.begin();" +
  "g.update=function(){};" +   // o relógio do jogo para: só o desenho, com o progresso da dancinha que a captura escolhe
  "g.bia.x=450;g.bia.y=330;g.dani.x=380;g.dani.y=470;g.joca.x=520;g.joca.y=470;g.cami.x=640;g.cami.y=470;g.dani.hands=[];g.joca.hands=[];g.cami.hands=[];" +
  "g.groups=[];g.queue=[];g.tables.forEach(t=>{t.group=null;});g.clima='';g.evento=null;";
const FISCAL = "const f=new L.Fiscal(g,0);f.st='olha';f.resta=999;f.x=420;f.y=420;f.path=[];g.fiscal=f;";
/* [nome, preparo, quem (a chave de g.eggs), centro (pés), recorte a partir dos pés: esquerda, cima, largura, altura] */
const CASOS = [
  ['fiscal', prep('terraco', 65, 0, false) + FISCAL, 'fiscal', [420, 420], [-60, -125, 120, 145]],
  ['musico', prep('terraco', 65, 0, true), 'musico', [186, 528], [-60, -105, 120, 130]],
  ['trio', prep('terraco', 65, 1, false), 'trio', [269, 534], [-100, -100, 200, 125]],
  ['pianista', prep('terraco', 65, 2, false), 'pianista', [88, 502], [-60, -135, 120, 150]],
  ['biamenu', prep('terraco', 65, 0, false) + "g.state='menu';", 'biaMenu', [790, 520], [-130, -260, 260, 290]],
];
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const rm of [false, true]) {
    const ctx = await b.newContext({ viewport:{ width:1220, height:650 }, deviceScaleFactor:2, reducedMotion:rm ? 'reduce' : 'no-preference' });
    await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
    const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.stack).split('\n').slice(0, 3).join(' <- ')));
    await pg.goto('file://' + W); await pg.waitForTimeout(500);
    const clipe = async (nome, cx, cy, r, k) => {
      const sx = k[0] + (cx + r[0] + k[3]) * k[2], sy = k[1] + (cy + r[1]) * k[2];
      await pg.screenshot({ path:path.join(OUT, nome + '.png'), clip:{ x:Math.max(0, sx), y:Math.max(0, sy), width:r[2] * k[2], height:r[3] * k[2] } });
    };
    const kdo = () => pg.evaluate('(()=>{const c=document.querySelector("canvas").getBoundingClientRect();return [c.left,c.top,c.width/1220,window.__game.cam]})()');
    const rodar = async (js) => { const r = await pg.evaluate('(()=>{try{' + js + ';return ""}catch(e){return String(e.stack)}})()'); if (r) console.log('erro', r); };
    for (const [nome, pre, q, [cx, cy], r] of CASOS) {
      await rodar(pre); await pg.waitForTimeout(150); const k = await kdo();
      for (const [mn, p] of (rm ? [['rm', 0.5]] : MOMENTOS)) {
        await rodar("const g=window.__game;g.eggs={};" + (p ? "g.eggs." + q + "={n:0,t:0,p:" + p + "};" : ""));
        await pg.waitForTimeout(120); await clipe(nome + '_' + mn, cx, cy, r, k);
      }
    }
    if (!rm) {
      // a campainha: parada, afundada e o "Já vai, já vai!", na Garagem e no Terraço
      for (const [pn, pre] of [['garagem', prep('garagem', 1, 0, false)], ['terraco', prep('terraco', 65, 0, false)]]) {
        await rodar(pre); await pg.waitForTimeout(150); const k = await kdo();
        await rodar("const g=window.__game;g.eggs={};g.fx=[];");
        await pg.waitForTimeout(100); await clipe('campainha_' + pn + '_parada', 754, 214, [-90, -60, 180, 110], k);
        await rodar("const g=window.__game;g.eggs={campainha:{n:0,t:0,p:0,af:0.1}};");
        await pg.waitForTimeout(100); await clipe('campainha_' + pn + '_afunda', 754, 214, [-90, -60, 180, 110], k);
        await rodar("const g=window.__game;g.eggs={};g.campainhaResposta();");
        await pg.waitForTimeout(100); await clipe('campainha_' + pn + '_resposta', 754, 214, [-90, -125, 300, 175], k);
      }
      // o Tonhão gripado: os três "Atchim!"
      await rodar(prep('terraco', 65, 0, false) + "g.day=Object.assign({},g.day,{gripe:true});g.anim=0.5;"); await pg.waitForTimeout(150); const k = await kdo();
      for (const [mn, p] of [['p10', 0.1], ['p45', 0.45], ['p80', 0.8]]) {
        await rodar("const g=window.__game;g.eggs={tonhao:{n:0,t:0,p:" + p + "}};"); await pg.waitForTimeout(120); await clipe('atchim_' + mn, 930, 172, [-75, -110, 130, 140], k);
      }
      // a festa: a equipe toda da Avenida dançando junta (a Cami e o Anselmo já estão na Avenida)
      await rodar(prep('avenida', 50, 0, false) + "g.anim=0.5;"); await pg.waitForTimeout(150);
      await rodar("const g=window.__game;g.dancou=new Set(['bia','tonhao','dani','joca','cami','anselmo']);g.festa=1.2;g.festaI=1;g.eggs={};g.festaQuem().forEach(q=>{g.eggs[q]={n:0,t:0,p:0.5};const o=g.festaOnde(q);g.festaBrilho(o.x,o.y-60);});");
      await pg.waitForTimeout(150); const kf = await kdo();
      await pg.screenshot({ path:path.join(OUT, 'festa_avenida.png'), clip:{ x:kf[0], y:kf[1], width:960 * kf[2] + 200, height:540 * kf[2] } });
    }
    await ctx.close();
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
