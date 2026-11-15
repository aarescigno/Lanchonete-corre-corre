// v11.9 (etapa 7a): o nome no Ranking (o fim do dia grava sozinho), a Divulgação só quando abre e o trio de cordas com três músicos.
const load=require('./harness.js');
const fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const nova=(o,sv)=>{ const H=load(o); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); const {g,L}=H; g.save=L.normSave(Object.assign({treino:true},sv||{})); g.up=g.save.up; g.boughtFor=0; g.buildTables(); return H; };
const fecha=(H,dia,lucroTot,money)=>{ const {g}=H; g.save.lucroTot=lucroTot; g.startDay(dia); g.begin(); g.schedule=[]; g.nextIdx=0; g.money=money||0; g.custo=0; g.finishDay(); };
const lista=(H,k)=>{ const o=JSON.parse(H.store['lcc2_ranking']||'{}'); return o[k||'campanha']||[]; };
const html=fs.readFileSync('../lanchonete.html','utf8');
const nome=(H,v)=>{ H.L.openRank('ov-menu'); H.els['rank-nome-inp'].value=v; H.els['rank-nome'].fire('submit',{preventDefault(){}}); };

(async()=>{
// ---------- CA1: registro automático, sem formulário ----------
{ ok(!/id="end-save"|id="falencia-save"|id="endless-save"/.test(html) && !/buildSaveForm/.test(html),'CA1: o HTML não tem mais end-save, falencia-save nem endless-save');
  const H=nova({}, {dia:6,bank:400}); fecha(H,5,2345,0); await sleep(40);
  const l=lista(H); ok(l.length===1 && l[0].nome==='Você' && l[0].pontos===H.g.save.lucroTot && l[0].dia===5,'CA1: o fim do dia grava "Você" com o lucro acumulado ('+H.g.save.lucroTot+') e o dia jogado');
  ok(!H.store['lcc2_name'],'CA1: o lcc2_name continua vazio'); }
// ---------- CA2: com nome; só sobe; falência e Turno sem fim ----------
{ const H=nova({store:{lcc2_name:'Renan'}}, {dia:6,bank:400}); fecha(H,5,2000,0); await sleep(40);
  const l=lista(H); ok(l.length===1 && l[0].nome==='Renan' && l[0].pontos===H.g.save.lucroTot,'CA2: com o lcc2_name "Renan", grava em "Renan"');
  const alto=l[0].pontos; H.g.save.lucroTot=100; H.g.startDay(6); H.g.begin(); H.g.schedule=[]; H.g.money=0; H.g.custo=0; H.g.save.lucroTot=100; H.g.finishDay(); await sleep(40);
  ok(lista(H).length===1 && lista(H)[0].pontos===alto,'CA2: um dia pior depois não baixa os pontos da linha');
  const H2=nova({}, {dia:5,bank:600,emp:{resto:550,n:5,atr:true}}); H2.g.save.lucroTot=500; H2.g.startDay(5); H2.g.begin(); H2.g.schedule=[]; H2.g.money=0; H2.g.custo=100; H2.g.save.bank=0; H2.g.save.emp.atr=true; H2.g.finishDay(); await sleep(40);
  ok(H2.g.state==='falencia' && lista(H2).length===1 && lista(H2)[0].nome==='Você','CA2: a falência também grava');
  const H3=nova({}, {dia:5,bank:600}); H3.g.startEndless(); H3.g.begin(); H3.g.pontos=300; H3.g.money=50; H3.g.finishEndless(); await sleep(40);
  const s=lista(H3,'semfim'); ok(H3.g.state==='endlessend' && s.length===1 && s[0].nome==='Você' && s[0].pontos===300 && s[0].tempo>=0 && !lista(H3).length,'CA2: o fim do Turno sem fim grava na lista semfim, com o tempo'); }
// ---------- CA3: não grava ----------
{ const H=nova({}, {dia:6,bank:400}); H.L.DEV.on=true; fecha(H,5,2345,0); await sleep(40);
  ok(!H.store['lcc2_ranking'],'CA3: no modo dev, não grava');
  const H2=nova({}, {dia:6,bank:400}); fecha(H2,5,0,0); await sleep(40); fecha(H2,6,-300,0); await sleep(40);
  ok(!H2.store['lcc2_ranking'],'CA3: com lucro acumulado zero ou negativo, não grava');
  const H3=nova({}, {dia:6,bank:400}); H3.g.mode='treino'; H3.L.rankAuto('carreira'); await sleep(40);
  ok(!H3.store['lcc2_ranking'],'CA3: no treino, não grava');
  const H4=nova({}, {dia:5,bank:600}); H4.g.startEndless(); H4.g.begin(); H4.g.pontos=0; H4.g.finishEndless(); await sleep(40);
  ok(!H4.store['lcc2_ranking'],'CA3: no Turno sem fim com zero ponto, não grava'); }
// ---------- CA4: o nome na tela do Ranking ----------
{ const H=nova({}, {dia:6,bank:400}); const {els,L}=H; fecha(H,5,2345,0); await sleep(40);
  L.Rank.saveLocal('semfim',{nome:'Você',pontos:70,tempo:30});
  L.Rank.saveLocal('carreira',{nome:'Zeca',pontos:50,dia:2});
  L.openRank('ov-menu'); await sleep(30);
  ok(!!els['rank-nome'] && /Seu nome/.test(JSON.stringify(html.match(/<form class="saveform" id="rank-nome"[\s\S]*?<\/form>/))) && /Salvar/.test(html.match(/<form class="saveform" id="rank-nome"[\s\S]*?<\/form>/)[0]),'CA4: a tela do Ranking tem o formulário rank-nome, com "Seu nome" e "Salvar"');
  els['rank-nome-inp'].value='  '; els['rank-nome'].fire('submit',{preventDefault(){}});
  ok(/Digite seu nome\./.test(els['rank-nome-msg'].textContent) && !H.store['lcc2_name'],'CA4: vazio: "Digite seu nome." e não grava');
  els['rank-nome-inp'].value='Marina'; els['rank-nome'].fire('submit',{preventDefault(){}});
  ok(/Nome salvo\./.test(els['rank-nome-msg'].textContent) && H.store['lcc2_name']==='Marina','CA4: o primeiro nome: "Nome salvo." e grava o lcc2_name');
  ok(lista(H).some(r=>r.nome==='Marina') && !lista(H).some(r=>r.nome==='Você') && lista(H,'semfim').some(r=>r.nome==='Marina') && !lista(H,'semfim').some(r=>r.nome==='Você'),'CA4: as linhas "Você" das duas listas viraram "Marina"');
  // o nome já existia na lista: fica a linha de mais pontos
  const H2=nova({}, {}); H2.L.Rank.saveLocal('carreira',{nome:'Você',pontos:900,dia:3}); H2.L.Rank.saveLocal('carreira',{nome:'Marina',pontos:400,dia:2});
  nome(H2,'Marina'); const l2=lista(H2); ok(l2.length===1 && l2[0].nome==='Marina' && l2[0].pontos===900,'CA4: se o nome já existia, fica a linha de mais pontos');
  const H3=nova({}, {}); H3.L.Rank.saveLocal('carreira',{nome:'Você',pontos:300,dia:3}); H3.L.Rank.saveLocal('carreira',{nome:'Marina',pontos:400,dia:2});
  nome(H3,'Marina'); ok(lista(H3).length===1 && lista(H3)[0].pontos===400,'CA4: (idem) a de Marina fica se tem mais pontos'); }
// ---------- CA5: trocar de nome ----------
{ const H=nova({store:{lcc2_name:'Renan'}}, {dia:6,bank:400}); fecha(H,5,2000,0); await sleep(40);
  nome(H,'Arthur'); await sleep(20);
  ok(H.store['lcc2_name']==='Arthur' && lista(H).length===1 && lista(H)[0].nome==='Renan','CA5: de "Renan" para "Arthur": a linha "Renan" fica como estava');
  fecha(H,6,3000,0); await sleep(40);
  ok(lista(H).some(r=>r.nome==='Arthur' && r.pontos===H.g.save.lucroTot) && lista(H).some(r=>r.nome==='Renan'),'CA5: o fim de dia seguinte grava em "Arthur"'); }
// ---------- CA6: a Divulgação só aparece quando abre (fora da História) ----------
{ const H=nova({}, {dia:2,bank:2000}); const {g,L,els}=H;
  const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
  g.goShop(2); const s2=L.shopSecoes().reduce((a,b)=>a.concat(b),[]);
  ok(s2.indexOf('divulga')<0,'CA6: a lojinha do dia 2 não tem o cartão Divulgação');
  L.setShopTab('divulga'); ok(els['shop-sec'].textContent!=='Divulgação','CA6: shopAbrir("divulga") no dia 2 abre só o grupo');
  g.goShop(3); ok(L.shopSecoes().reduce((a,b)=>a.concat(b),[]).indexOf('divulga')<0,'CA6: nem no dia 3');
  g.goShop(4); ok(L.shopSecoes().reduce((a,b)=>a.concat(b),[]).indexOf('divulga')>=0,'CA6: a do dia 4 tem');
  L.setShopTab('divulga'); const t=txt(els['shop-grid']);
  ok(els['shop-sec'].textContent==='Divulgação' && /Boca a boca/i.test(t) && (t.match(/Escolhid|Escolher/g)||[]).length>=3 && /Contas do dia/.test(t) && !/A partir do dia/.test(t),'CA6: no dia 4, as três divulgações com "Escolher/Escolhida" e as contas; sem "A partir do dia"');
  ok(!/A partir do dia/.test(html.replace(/<li>[\s\S]*?<\/li>/g,'')) ,'CA6: nenhum texto "A partir do dia" no código'); }
// ---------- CA7: no Modo História e no modo dev ----------
{ const H=nova({historia:true}, {dia:4,bank:2000}); const {g,L,els}=H; g.save.convDiv='pend';
  g.goShop(4); ok(L.shopSecoes().reduce((a,b)=>a.concat(b),[]).indexOf('divulga')<0,'CA7: com convDiv "pend", a lojinha do dia 4 não mostra o cartão');
  g.save.convDiv=1; g.goShop(4); L.setShopTab('divulga'); ok(L.shopSecoes().reduce((a,b)=>a.concat(b),[]).indexOf('divulga')>=0 && els['shop-sec'].textContent==='Divulgação','CA7: depois da conversa (convDiv 1), a lojinha abre direto na Divulgação');
  const H2=nova({}, {dia:1,bank:2000}); H2.L.DEV.on=true; H2.g.goShop(1); ok(H2.L.shopSecoes().reduce((a,b)=>a.concat(b),[]).indexOf('divulga')>=0,'CA7: no modo dev o cartão aparece desde o dia 1'); }
// ---------- CA8: o trio ----------
{ const H=nova({}, {}); const {L}=H; const T=L.TRIO;
  ok(Array.isArray(T) && T.length===3 && T.map(q=>q.inst).join()==='violino,viola,violoncelo' && T.map(q=>q.x).join()==='227,269,311','CA8: TRIO: violino, viola e violoncelo em x 227, 269 e 311');
  let erro=''; try { L.drawTrio(H.ctx,H.g,1.3); } catch(e){ erro=e.message; } ok(!erro,'CA8: drawTrio desenha sem erro'+(erro?' ('+erro+')':''));
  const R=load({rm:true}); erro=''; try { R.L.drawTrio(R.ctx,R.g,1.3); } catch(e){ erro=e.message; } ok(!erro,'CA8: e com movimento reduzido'+(erro?' ('+erro+')':''));
  ok(!/drawQuarteto|QUARTETO/.test(html) && !L.QUARTETO && !L.drawQuarteto,'CA8: não existe mais drawQuarteto nem QUARTETO'); }
console.log('smoke85: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
})();
