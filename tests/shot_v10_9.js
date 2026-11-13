// capturas da v10.9 (o crítico sem aviso) em ../capturas/v10_9: o crítico à mesa com e sem o caderninho (comparado com um VIP comum), o crítico na fila, o cartão da ficha no fim do dia e a introdução do boato.
// Confira em recorte (PIL crop) e descarte: capturas não vão para o git. Uso: node shot_v10_9.js [filtro]   (RM=1: movimento reduzido)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capturas', 'v10_9'); fs.mkdirSync(OUT, { recursive:true });
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(path.join(__dirname, '..', 'lanchonete.html'), 'utf8');
const W = path.join(__dirname, 'wrapped.html'); fs.writeFileSync(W, html);
const FILTRO = process.argv[2] || '';
const BASE = "document.querySelectorAll('.ov').forEach(o=>o.classList.remove('show'));const g=window.__game, L=window.__lcc;";
const SV = (extra) => "g.save=L.normSave(Object.assign({dia:64,bank:9000,cap:13,histV:1,capV:4,maxDay:64,v10:1,pontoDia:50,convEnt:1,convCard:1,convDiv:1,convPlanta:1,convSocorro:1,convQuit:1,convTeto:1,convExig:1,vipVisto:1,exigVisto:1,efoodNota:1,up:{tenis:true,bandeja:true,maquina:true},equipe:{tonhao:4,dani:3,anselmo:3,lia:1,cami:5},camiCursos:{agil:1,mesa:1,salao:1,gerente:1},libera:{confeitaria:2,joca:2,cami:2,anselmo:2,lia:2},conversa:null,salao:{ponto:'terraco'}}," + (extra || '{}') + "));g.up=g.save.up;g.tablesKey='';g.buildTables();";
const JOGAR = "g.startDay(64); g.begin(); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; ";
// o crítico sentado na mesa (com e sem o caderninho), um VIP comum na outra e o crítico na fila
const CRIT = "g.save.guia={n:0,prox:64,v:[]}; g.startDay(64); g.begin(); const S=g.schedule.find(x=>x.critico); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; " +
  "const C=g.spawn(S); const t1=g.tables.find(q=>q.free&&q.seats>=C.size); g.seatGroup(C,t1); C.setState('ordered'); C.path=[]; C.x=t1.cx; C.y=t1.cy+30; ";
const VIPC = "const B=g.spawn({type:'executiva',color:2,vip:true,exig:true,av:true}); const t2=g.tables.find(q=>q.free&&q.seats>=B.size); g.seatGroup(B,t2); B.setState('ordered'); B.path=[]; B.x=t2.cx; B.y=t2.cy+30; g.fx=[]; ";
const CENAS = [
  ['mesa_com_caderninho', BASE + SV('{rosa:1}') + CRIT + VIPC + "C.caderno=1.5; g.fx=[];"],
  ['mesa_sem_caderninho', BASE + SV('{rosa:1}') + CRIT + VIPC + "C.caderno=0; g.fx=[];"],
  ['na_fila', BASE + SV('{rosa:1}') + "g.save.guia={n:0,prox:64,v:[]}; g.startDay(64); g.begin(); const S=g.schedule.find(x=>x.critico); g.schedule=[{t:99999,type:'casal'}]; g.elapsed=30; g.mode='carreira'; g.evento=''; g.clima=''; g.spawn({type:'estudante',color:0,vip:false,av:true}); g.spawn(S); g.spawn({type:'executiva',color:1,vip:true,exig:true,av:true}); for(let i=0;i<80;i++) g.update(0.05); g.fx=[];"],
  ['ficha_fim_do_dia', BASE + SV('{rosa:1}') + "g.save.guia={n:0,prox:64,v:[]}; g.startDay(64); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=3000; g.ficha={d:64,it:[2,1,2,0,1]}; g.finishDay(); g.save.convCrit=1; g.save.convCard=1; g.save.convEnt=1; g.save.convPlanta=1; g.save.vontDoce=1; g.save.vontCafe=1; g.setState('dayend');"],
  ['intro_do_boato', BASE + SV('{rosa:1,guia:{n:1,prox:64,v:[{d:61,it:[2,2,1,2,1]}]}}') + "g.startDay(64);"]
];
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
