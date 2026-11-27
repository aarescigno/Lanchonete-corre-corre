// capturas da v12.12 em ../capturas/v12_12 (CA7): cada um dos 7 em três momentos da dancinha (p 0,25, 0,5 e 0,75) e com movimento reduzido (o coraçãozinho). 960x540.
// Confira recortes ampliados (PIL crop) e apague. Uso: node shot_v12_12.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v12_12'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8') + '</body></html>';
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
// o Terraço com a equipe toda; o jogo congelado (g.update vazio) com os 4 do salão em fila num trecho livre e cada dancinha parada no p dado
const DIA = (P) => BASE + "g.mode='carreira';g.save=L.normSave({dia:58,bank:20000,cap:15,maxDay:58,histV:1,conversa:null,tonDeg:1,treino:true,salao:{ponto:'terraco'}});g.up=g.save.up;g.setDev(true);g.devEquipe('max');g.save.equipe.anselmo=2;g.save.equipe.lia=1;g.tablesKey='';g.buildTables();g.startDay(58);g.begin();g.clima='';g.evento='';g.schedule=[{t:1e6,type:'familia',color:0,vip:false}];g.nextIdx=0;g.groups=[];g.queue=[];"
  + "g.bia.x=250;g.bia.y=300;g.dani.x=330;g.dani.y=300;g.joca.x=410;g.joca.y=300;g.cami.x=490;g.cami.y=300;"
  + "const P=" + P + ";g.update=function(){};['bia','tonhao','dani','joca','cami','anselmo','lia'].forEach(k=>{g.eggs[k]={n:0,t:0,s:P*1.2,p:P,on:true};});";
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const rm of [false, true]) {
    for (const P of (rm ? [0.5] : [0.0625, 0.125, 0.25, 0.5, 0.75])) {
      const ctx = await b.newContext({ viewport:{ width:960, height:540 }, deviceScaleFactor:2, reducedMotion: rm ? 'reduce' : 'no-preference' });
      await ctx.addInitScript("try{localStorage.setItem('lcc2_abertura','1')}catch(e){}");
      const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.stack).split('\n').slice(0,3).join(' <- ')));
      await pg.goto('file://' + W); await pg.waitForTimeout(600);
      const r = await pg.evaluate('(()=>{try{' + DIA(P) + '}catch(e){return String(e.stack)}})()'); if (r) console.log(r);
      await pg.waitForTimeout(500);
      await pg.screenshot({ path:path.join(OUT, (rm ? 'rm' : 'p' + String(Math.round(P * 100))) + '.png') });
      await ctx.close();
    }
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros de página; capturas em ' + OUT); await b.close(); fs.unlinkSync(W);
})();
