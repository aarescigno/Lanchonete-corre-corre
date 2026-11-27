// v12.10.4: o Ranking só no modo dev (etapa correção). Spec: docs/spec-v12.10.4.md. CA1 a CA4.
const fs=require('fs');
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const html=fs.readFileSync('../lanchonete.html','utf8');
const novo=(H,o)=>{ const g=H.g, L=H.L; g.save=L.normSave(Object.assign({treino:true,divulga:'boca'},o||{})); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const cont=(H)=>{ const g=H.g, els=H.els; g.setState('menu'); els['btn-play'].fire('click'); if(g.state==='shop') els['btn-shop-go'].fire('click'); };
const fecha=(H,fat)=>{ const g=H.g, els=H.els; els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };
// CA1: o botão Ranking do menu só com o modo dev
{ const H=load(), {L,els}=H;
  L.DEV.on=false; L.buildMenu(); const off=els['btn-rank'].style.display;
  L.DEV.on=true; L.buildMenu(); const on=els['btn-rank'].style.display;
  L.DEV.on=false;
  ok(off==='none','CA1: sem o modo dev, o btn-rank do menu está escondido ('+off+')');
  ok(on==='','CA1: com o modo dev, o btn-rank do menu está à mostra ('+on+')'); }
// CA2: o Ranking do fim do dia e da falência só com o modo dev (buildEnd e buildFalencia, pelas telas)
{ const H=load(), {g,L,els}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  novo(H,{dia:5,bank:600}); cont(H); fecha(H,500);
  L.DEV.on=false; g.setState('dayend'); const endOff=els['btn-end-rank'].style.display;
  L.DEV.on=true; g.setState('dayend'); const endOn=els['btn-end-rank'].style.display;
  L.DEV.on=false;
  const H2=load(), g2=H2.g, L2=H2.L; H2.doc.createTextNode=t=>({textContent:String(t),children:[]});
  novo(H2,{dia:8,bank:300,fechou:7}); g2.result={day:8,devido:100,money:0};
  L2.DEV.on=false; g2.setState('falencia'); const falOff=H2.els['btn-falencia-rank'].style.display;
  L2.DEV.on=true; g2.setState('falencia'); const falOn=H2.els['btn-falencia-rank'].style.display;
  L2.DEV.on=false;
  ok(endOff==='none','CA2: sem o modo dev, o btn-end-rank do fim do dia está escondido ('+endOff+')');
  ok(endOn==='','CA2: com o modo dev, o btn-end-rank do fim do dia está à mostra ('+endOn+')');
  ok(falOff==='none','CA2: sem o modo dev, o btn-falencia-rank da falência está escondido ('+falOff+')');
  ok(falOn==='','CA2: com o modo dev, o btn-falencia-rank da falência está à mostra ('+falOn+')'); }
// CA3: a 2ª fileira do menu sem as classes quatro e cinco sem o modo dev, com cinco com o modo dev e os Desafios
{ const H=load(), {g,L}=H;
  g.save.cap=99; L.DEV.on=false; L.buildMenu();
  const semDev=H.els['menu-btns'].classList.contains('quatro')||H.els['menu-btns'].classList.contains('cinco');
  L.DEV.on=true; L.buildMenu();
  const comDev=H.els['menu-btns'].classList.contains('cinco');
  L.DEV.on=false;
  ok(!semDev,'CA3: sem o modo dev e com os Desafios, a 2ª fileira não tem quatro nem cinco');
  ok(comDev,'CA3: com o modo dev e os Desafios, a 2ª fileira tem cinco'); }
// CA4: o painel Instalar não fala de ranking, e a VERSAO é v12.10.4
{ const H=load(), L=H.L;
  const i=html.indexOf('id="ov-app"'), j=html.indexOf('id="ov-ver"');
  const app=html.slice(i,j);
  ok(i>0 && !/ranking/i.test(app),'CA4: o painel Instalar não fala mais em ranking');
  ok(/^v12\.1\d(\.\d+)?$/.test(L.VERSAO),'CA4: a VERSAO é da série v12.1x ('+L.VERSAO+')'); }
console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
