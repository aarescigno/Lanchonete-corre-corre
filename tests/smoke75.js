// v10.10, etapa 6c: a noite da estrela (cap. 14): o cartão da lojinha, o dia da noite, o crítico de cara limpa, o Bráulio e as falas, os pontos do guia, as estrelas,
// o veredito (conversas e boletim), a visita surpresa, a Fama do luxo, o selo do menu, o modo dev e o save.
// CA1 o cartão; CA2 o dia; CA3 os convidados; CA4 as falas; CA5 os pontos; CA6 os cortes; CA7 o boletim; CA8 o capítulo 14; CA9 a visita surpresa; CA10 a Fama; CA11 o selo; CA12 o modo dev; CA13 o save.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const achaTag=(e,tag,out=[])=>{ if(e.tagName===tag) out.push(e); (e.children||[]).forEach(c=>achaTag(c,tag,out)); return out; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const FICHA=(d,it)=>({ d, it:it||[2,2,2,2,2] });
const GUIA=(o)=>Object.assign({ n:2, prox:0, v:[FICHA(57,[2,2,2,1,1]),FICHA(58,[2,2,2,1,1])] },o||{});
const jogo=(cap,sv,ponto,opt)=>{ const H=nova(opt), {g,L}=H; const n=60;
  g.save=L.normSave(Object.assign({ histV:1, capV:5, cap, dia:n, maxDay:n, bank:6000, v10:1, rosa:1, up:{ tenis:true, bandeja:true }, equipe:{ tonhao:3, anselmo:2 }, salao:{ ponto:ponto||'terraco' }, conversa:null, pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2, lia:2 }, guia:GUIA() }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(n); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); if(aba) H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };
const botoes=(H)=>achaTag(H.doc.getElementById('shop-grid')||{},'BUTTON');
const comeca=(H,n)=>{ const {g,els}=H; g.startDay(n||g.save.dia); els['btn-start'].fire('click'); return H; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const passa=(g)=>{ let n=0; while(g.conversa && n<40){ g.conversa.seguir(); n++; } return n; };
const noite1=(sv,opt)=>jogo(14,Object.assign({ capDia:50 },sv||{}),'terraco',opt);   // o dia 60, com o guia do cap. 14
/* os convidados da noite sentados (estado 'ordered') */
const convidado=(H,quem)=>{ const {g}=H; const s=g.schedule.find(x=>x[quem]); const grp=g.spawn(s); const t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); g.mode='carreira'; return { grp, t, s }; };
/* fecha o dia da noite sem jogar: a ficha, o Bráulio, os perdidos e o dinheiro (stars: 0 a 3 pelas metas da noite) */
const fecha=(H,o)=>{ const {g}=H; o=o||{}; g.schedule=[]; g.nextIdx=0; g.custo=0; g.ficha=o.ficha||null; g.braulioFeliz=!!o.braulio; g.stats.lost=o.lost||0;
  const d=g.day; g.money=[0,d.meta+50,Math.max(d.meta+50,Math.round((d.meta+d.expert)/50)*25+50),d.expert+50][o.stars==null?0:o.stars]; g.finishDay(); return g.result.noite; };
const dev=(L,on,f)=>{ L.DEV.on=!!on; L.DEV.real=!!on; L.DEV.forca=f||{}; };

// ---------- 1. o cartão da lojinha (CA1) ----------
{ const H=noite1(), {g,L}=H; let t=loja(H,'lanchonete','cardapio');
  ok(/Noite da estrela/.test(t) && botoes(H).some(b=>b.textContent==='É hoje!'),'no Terraço, com o cap. 14, o cartão "Noite da estrela" tem o botão "É hoje!"');
  const q=achaTag(H.doc.getElementById('shop-grid'),'BUTTON').find(b=>b.getAttribute('data-ficha')==='l-noite'); ok(!!q,'o "?" abre a ficha l-noite do Manual');
  botoes(H).find(b=>b.textContent==='É hoje!').fire('click');
  ok(g.save.guia.noite===60,'"É hoje!" marca o dia que vai começar (save.guia.noite = '+g.save.guia.noite+')');
  t=txt(H.doc.getElementById('shop-grid')); ok(botoes(H).some(b=>b.textContent==='Marcada ✓'),'o botão vira "Marcada ✓"');
  botoes(H).find(b=>b.textContent==='Marcada ✓').fire('click'); ok(g.save.guia.noite===0 && botoes(H).some(b=>b.textContent==='É hoje!'),'o segundo toque desmarca');
  ok(g.save.manual.indexOf('l-noite')>=0,'a ficha l-noite abre quando o cartão aparece');
  // depois de uma noite jogada: apagado por NOITE.espera dias
  [[59,3,'3 dias'],[57,1,'1 dia']].forEach(([ult,falta,tx])=>{ const H2=noite1({ guia:GUIA({ ult }) }); const t2=loja(H2,'lanchonete','cardapio');
    ok(t2.indexOf('O crítico volta em '+tx)>=0 && !botoes(H2).some(b=>b.textContent==='É hoje!') && H2.g.noiteCartao.falta===falta && H2.g.marcaNoite()===false,'noite no dia '+ult+': "O crítico volta em '+tx+'", sem botão'); });
  { const H2=noite1({ guia:GUIA({ ult:56 }) }); ok(loja(H2,'lanchonete','cardapio').indexOf('volta em')<0 && botoes(H2).some(b=>b.textContent==='É hoje!'),'3 dias depois (noite no dia 56, hoje 60), o cartão volta'); }
  const H3=jogo(13,{ guia:GUIA({ n:0, prox:62, v:[] }) }); ok(loja(H3,'lanchonete','cardapio').indexOf('Noite da estrela')<0,'antes do cap. 14, sem cartão');
  const H4=noite1({ salao:{ ponto:'avenida' }, cap:14 }); ok(H4.g.noiteCartao===null,'fora do Terraço, sem cartão');
  const H5=noite1({ guia:GUIA({ est:3 }) }); ok(loja(H5,'lanchonete','cardapio').indexOf('Noite da estrela')<0,'com as 3 estrelas, o cartão some');
  const H6=jogo(15,{ guia:GUIA({ est:1 }) }); ok(H6.g.noiteCartao && H6.g.noiteCartao.falta===0,'no Fim (cap. 15), com 1 estrela, o cartão continua'); }

// ---------- 2. o dia da noite (CA2) ----------
{ let tudo=true, intro=true, metas=true, dif=0, sem=true;
  for(let i=0;i<14;i++){ const H=noite1({ guia:GUIA({ noite:60 }) },{ imprevistos:true }), {g,L,els}=H; g.startDay(60);
    if(!g.noite || g.noite.real!==true) tudo=false; if(g.clima!=='' || g.evento!=='' || g.quebras.length) sem=false;
    if(els['intro-manut'].textContent.indexOf(L.NOITE.aviso)<0) intro=false;
    const base=g.diaPonto(L.diaOf(60)), r5=v=>Math.round(v*L.NOITE.meta/5)*5;
    if(g.day.meta!==r5(base.meta) || g.day.expert!==r5(base.expert)) metas=false;
    g.divF=1; const n1=g.buildSchedule(g.day).length-2; g.noite=null; g.day=base; g.visita=null; const n0=g.buildSchedule(g.day).length; dif=Math.max(dif,Math.abs(n1-n0*1.3)); }
  ok(tudo,'o dia marcado é a noite (real)'); ok(sem,'sem clima, sem evento de bairro e sem quebra nova');
  ok(metas,'as metas (meta e expert) × NOITE.meta, em múltiplos de 5'); ok(dif<=1.6,'os grupos do dia × 1,3 (±1; maior diferença '+dif.toFixed(2)+')'); ok(intro,'a introdução do dia traz o aviso da noite');
  const H=noite1({ guia:GUIA({ noite:60 }) }), g=H.g; g.startDay(60); g.startDay(60); ok(g.noite && g.save.guia.noite===60,'recomeçar o dia continua sendo a noite');
  g.startDay(61); ok(g.noite===null && !g.schedule.some(s=>s.critico && s.disfarce===undefined && s.braulio),'o dia seguinte não é noite');
  const H2=jogo(13,{ guia:GUIA({ n:0, prox:70, v:[], noite:60 }) }); H2.g.startDay(60); ok(H2.g.noite===null,'antes do cap. 14, o dia marcado não vale');
  const H3=noite1({ guia:GUIA({ noite:60 }), salao:{ ponto:'avenida' } }); H3.g.startDay(60); ok(H3.g.noite===null,'fora do Terraço, nada');
  const H4=noite1({ guia:GUIA({ noite:60 }) }); H4.g.startDay(60); ok(H4.g.visita===null,'a noite não tem visita surpresa'); }

// ---------- 3. o crítico de cara limpa e o Bráulio (CA3) ----------
{ let tudo=true, vistos=0;
  for(let i=0;i<30;i++){ const H=noite1({ guia:GUIA({ noite:60, ult:50 }) }), g=H.g, L=H.L; g.startDay(60); const win=g.day.speed*g.day.time;
    const cr=g.schedule.filter(s=>s.critico), br=g.schedule.filter(s=>s.braulio);
    if(cr.length!==1 || br.length!==1){ tudo=false; continue; }
    const fc=cr[0].t/win, fb=br[0].t/win;
    if(fc<0.35-1e-9 || fc>0.45+1e-9 || fb<0.5-1e-9 || fb>0.6+1e-9 || cr[0].disfarce || !cr[0].av || !br[0].av || cr[0].type!=='executiva' || br[0].type!=='executiva') tudo=false; else vistos++; }
  ok(tudo && vistos===30,'um crítico (35% a 45% da janela, sem disfarce) e um Bráulio (50% a 60%), os dois executivas sozinhos, e os dois sempre avaliam'); }
{ const H=noite1({ guia:GUIA({ noite:60 }) }), {g,L}=H; comeca(H); const c=convidado(H,'critico'), cr=c.grp;
  ok(cr.critico && !cr.disfarce && cr.vipAberto && cr.exigente && cr.size===1,'o crítico da noite: VIP exigente à vista (plaquinha) e sozinho');
  ok(cr.hearts===5 && cr.patPer()>0,'(o crítico da noite)');
  const b=convidado(H,'braulio'), br=b.grp, ctl=g.spawn({ type:'executiva', color:1, vip:true, exig:true, av:true }); ctl.state=br.state;
  ok(br.braulio && br.vipAberto && br.exigente && br.size===1 && br.type==='executiva','o Bráulio: VIP exigente à vista (plaquinha comum) e sozinho');
  ok(Math.abs(br.patPer()/ctl.patPer()-L.NOITE.brauPat)<1e-9,'com a paciência × 0,7 de um exigente comum');
  ok(br.bill>=L.EXIGENTE.casa.preco,'pede o prato da casa (a conta leva R$ '+L.EXIGENTE.casa.preco+')');
  const p=br.people[0]; ok(p.braulio===true && p.shirt==='#7A2E3A' && !p.chapeu && !p.lenco && !p.echarpe && !p.shades,'paletó bordô (AB_COR.aurora), bigode, sem chapéu, lenço nem echarpe');
  ok(cr.people.every(q=>!q.braulio),'(só o Bráulio tem bigode e paletó)');
  // o desenho existe: o bigode e a plaquinha do Michelzão
  const ops=[]; const cx=new Proxy({},{ get:(o,k)=> k==='canvas'?{}:(typeof k==='string'?(()=>{ ops.push(k); return cx; }):undefined), set:()=>true });
  try{ L.drawPerson(cx,p,50,80,{ sit:true }); L.drawVipBadge(cx,50,50,0,true,true); L.drawVipBadge(cx,50,50,0,true,false); ok(ops.length>50,'o Bráulio e as duas plaquinhas desenham'); }catch(e){ ok(false,'desenho: '+e.message); }
  ok(L.drawVipBadge.length>=6,'drawVipBadge recebe o 6º argumento (a plaquinha do Michelzão)'); }

// ---------- 4. as falas do Bráulio (CA4) ----------
{ const mk=()=>{ const H=noite1({ guia:GUIA({ noite:60 }) }), {g,L}=H; comeca(H); const s=g.schedule.find(x=>x.braulio), grp=g.spawn(s), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); g.mode='carreira'; return { H, g, L, grp, t }; };
  { const { g, L, grp }=mk(); ok(grp.fala===null,'antes de sentar, sem fala');
    for(let i=0;i<400 && grp.state!=='reading';i++) g.update(0.05);
    ok(grp.state==='reading' && grp.fala && grp.fala.txt===L.NOITE.falas.senta && L.NOITE.falas.senta==='Vim provar a cópia.','ao sentar: "Vim provar a cópia."');
    roda(g,4); ok(grp.fala===null,'o balão some depois de uns 3 segundos'); }
  { const { g, L, grp, t }=mk(); grp.setState('ordered'); g.entregaPrato(grp,{ kind:'dish', table:t.id, group:grp, dish:'pf', crit:true, q:4, vip:true, tempo:1, casa:true, rosa:true },t);
    ok(grp.fala && grp.fala.txt==='Esse molho...','ao receber o Prato da Rosa: "Esse molho..."');
    const { g:g2, grp:g2p, t:t2 }=mk(); g2p.setState('ordered'); g2.entregaPrato(g2p,{ kind:'dish', table:t2.id, group:g2p, dish:'pf', crit:true, q:4, vip:true, tempo:1, casa:true },t2); ok(g2p.fala===null,'um prato sem a pétala não faz ele falar'); }
  { const { g, grp, t }=mk(); grp.setState('ordered'); grp.hearts=4; g.collectBill(grp,t); ok(grp.fala && grp.fala.txt==='...' && grp.braulioFeliz===true && g.braulioFeliz===true,'sai com 4 corações: "..." (feliz)'); }
  { const { g, grp, t }=mk(); grp.setState('ordered'); grp.hearts=5; g.collectBill(grp,t); ok(grp.fala.txt==='...' && g.braulioFeliz,'sai com 5 corações: feliz'); }
  { const { g, grp, t }=mk(); grp.setState('ordered'); grp.hearts=3; g.collectBill(grp,t); ok(grp.fala && grp.fala.txt==='Sabia! Amadores.' && !grp.braulioFeliz && !g.braulioFeliz,'sai com 3 corações: "Sabia! Amadores."'); }
  { const { g, grp }=mk(); grp.setState('ordered'); grp.hearts=0; g.angryLeave(grp); ok(grp.fala && grp.fala.txt==='Sabia! Amadores.' && !g.braulioFeliz,'sai bravo: a fala brava'); }
  { const H=noite1({ guia:GUIA({ noite:60 }) }), g=H.g; comeca(H); const s=g.schedule.find(x=>x.critico), grp=g.spawn(s); ok(grp.fala===null,'o crítico não fala'); } }

// ---------- 5. os pontos do guia (CA5) ----------
{ const L=load({ historia:true }).L, P=L.guiaPontos;
  const base={ fichas:[10,10,10], nota:4.8, luxo:5, dia:3, salao:true, braulio:true };
  const r=P(base); ok(r.tot===100 && r.lin.join(',')==='45,15,15,15,5,5','noite perfeita (duas fichas de 10, a da noite 10, nota 4,8, luxo 5, 3 estrelas, ninguém bravo, Bráulio feliz): 100 ('+r.lin.join(',')+')');
  ok(L.NOITE.linhas.join(',')==='Crítico,Gurugol,Luxo,A noite,Salão,Bráulio' && L.NOITE.max.reduce((a,b)=>a+b,0)===100,'seis linhas que somam 100');
  const lin=(o)=>P(Object.assign({},base,o)).lin;
  ok(lin({ fichas:[0,0,0] })[0]===0 && lin({ fichas:[8,8,10] })[0]===39 && lin({ fichas:[10,0,0] })[0]===15 && lin({ fichas:[5,5,5] })[0]===22.5,'Crítico: a soma das três fichas × 1,5 (até 45)');
  ok(lin({ nota:4.8 })[1]===15 && lin({ nota:5 })[1]===15 && lin({ nota:4.7 })[1]===10 && lin({ nota:4.6 })[1]===10 && lin({ nota:4.5 })[1]===5 && lin({ nota:4.4 })[1]===5 && lin({ nota:4.3 })[1]===0 && lin({ nota:null })[1]===0,'Gurugol: 4,8 ou mais 15; 4,6 ou mais 10; 4,4 ou mais 5');
  ok([5,4,3,2,1,0].map(n=>lin({ luxo:n })[2]).join(',')==='15,10,5,0,0,0','Luxo: nível 5 dá 15, 4 dá 10, 3 dá 5');
  ok([3,2,1,0].map(n=>lin({ dia:n })[3]).join(',')==='15,10,5,0','A noite: 3 estrelas 15, 2 estrelas 10, 1 estrela 5');
  ok(lin({ salao:false })[4]===0 && lin({ salao:true })[4]===5 && lin({ braulio:false })[5]===0 && lin({ braulio:true })[5]===5,'Salão e Bráulio: 5 pontos cada');
  ok(P({ fichas:[], nota:null, luxo:0, dia:0, salao:false, braulio:false }).tot===0,'o pior caso: 0'); }

// ---------- 6. os cortes e as estrelas (CA6) ----------
{ const L=load({ historia:true }).L, E=L.estrelasDe;
  ok(L.NOITE.cortes.join(',')==='50,72,90','os cortes: 50, 72 e 90');
  ok(E(49)===0 && E(49.5)===0 && E(50)===1 && E(71.5)===1 && E(72)===2 && E(89.5)===2 && E(90)===3 && E(100)===3 && E(0)===0,'49 pontos: recomendado; 50: 1 estrela; 72: 2; 90: 3');
  // o fim da noite de verdade
  const H=noite1({ guia:GUIA({ noite:60 }), aval:Array(14).fill([5,5,5,5,5]) }), {g}=H; comeca(H); const f={ it:[2,2,2,2,2] };
  const res=fecha(H,{ ficha:f, braulio:true, stars:3 }); const exp=H.L.guiaPontos({ fichas:[8,8,10], nota:g.notaGurugol, luxo:H.L.luxoNivel(g), dia:g.result.stars, salao:true, braulio:true });
  ok(res && Math.abs(res.tot-exp.tot)<1e-9 && res.est===H.L.estrelasDe(res.tot) && res.lin.length===6,'o fim do dia soma os pontos pela conta da spec (ficha da noite, duas melhores visitas, nota, luxo, estrelas do dia, salão, Bráulio): '+res.tot);
  ok(g.save.guia.est===res.est && g.save.guia.ult===60 && g.save.guia.noite===0 && g.save.guia.bol.length===6,'guarda a melhor marca, o dia da noite, desmarca e guarda o boletim');
  ok(g.result.noite===res && res.real===true,'o resultado do dia leva o veredito');
  // forçado pelo modo dev: a melhor marca nunca cai
  const H2=noite1({ guia:GUIA({ noite:60, est:2, rec:0 }) }), g2=H2.g; dev(H2.L,true,{ guia:'rec' }); comeca(H2); const r2=fecha(H2,{ stars:0 });
  ok(r2.est===0 && r2.melhor===2 && r2.nova===false && g2.save.guia.est===2,'uma noite pior depois não baixa a melhor marca (est 2)');
  const H3=noite1({ guia:GUIA({ noite:60 }) }), g3=H3.g; dev(H3.L,true,{ guia:'rec' }); comeca(H3); const r3=fecha(H3,{ stars:0 });
  ok(r3.est===0 && r3.melhor===0 && r3.rec===true && g3.save.guia.rec===1 && g3.save.guia.est===0,'abaixo de 50, nenhuma estrela: a casa fica "recomendada" (rec 1)');
  const H4=noite1({ guia:GUIA({ noite:60 }) }), g4=H4.g; dev(H4.L,true,{ guia:'1' }); comeca(H4); const r4=fecha(H4,{ stars:0 });
  ok(r4.est===1 && r4.nova===true && r4.melhor===1 && g4.save.guia.est===1 && g4.save.guia.rec===0,'1 estrela: nova, e a melhor marca sobe');
  const H5=noite1({ guia:GUIA({ noite:60, est:1 }) }), g5=H5.g; dev(H5.L,true,{ guia:'3' }); comeca(H5); const r5=fecha(H5,{ stars:0 });
  ok(r5.est===3 && r5.nova && g5.save.guia.est===3,'subir de 1 para 3 estrelas'); }

// ---------- 7. o boletim (CA7) ----------
{ const H=jogo(15,{ guia:GUIA({ noite:60 }), aval:Array(14).fill([5,5,5,5,5]) }), {g,L,els,doc}=H; dev(L,true,{ guia:'2' }); comeca(H);
  const res=fecha(H,{ ficha:{ it:[2,2,2,2,2] }, braulio:true, stars:2 });
  g.setState('dayend'); ok(txt(doc.getElementById('end-stats')).indexOf('O guia liga amanhã cedo')>=0 && txt(doc.getElementById('end-stats')).indexOf('Michelzão')>=0,'a tela de resultados ganha a linha "Michelzão: O guia liga amanhã cedo"');
  ok(els['ov-end'].classList.contains('show') && !g.conversa,'a noite mostra os resultados primeiro (as conversas esperam)');
  let fim=0; L.veredito(()=>{ fim++; });
  ok(els['ov-guia'].classList.contains('show'),'o veredito abre o boletim (#ov-guia)');
  const est=doc.getElementById('guia-est'), t=txt(doc.getElementById('guia-barras')); const on=(est.children||[]).filter(c=>c.className==='on').length;
  ok(on===2 && est.children.length===3,'o boletim mostra as três estrelas, duas cheias');
  ok(L.NOITE.linhas.every(n=>t.indexOf(n)>=0) && !/\d/.test(t),'seis barras com os nomes das linhas, sem número');
  const barras=(doc.getElementById('guia-barras').children||[]); ok(barras.length===6,'seis linhas de barra');
  const larg=barras.map(b=>b.children[1].children[0].style.width); ok(larg.join('|')===res.lin.map(v=>Math.round(v*100)+'%').join('|'),'cada barra enche na fração dos pontos daquela linha nesta noite ('+larg.join(' ')+')');
  els['btn-guia'].fire('click'); ok(fim===1,'"Continuar" segue para a lojinha');
  // reabre pelo selo
  ok(g.save.guia.bol.length===6 && g.save.guia.bol.join(',')===res.lin.join(','),'o último boletim fica em save.guia.bol');
  L.buildMenu(); els['menu-selo'].fire('click'); ok(els['ov-guia'].classList.contains('show') && (doc.getElementById('guia-est').children||[]).filter(c=>c.className==='on').length===2,'o selo do menu reabre o último boletim');
  els['btn-guia'].fire('click'); ok(els['ov-menu'].classList.contains('show'),'e Continuar volta ao menu');
  // sem estrela, com "Recomendado"
  const H2=noite1({ guia:GUIA({ noite:60, rec:1, bol:[0.2,0.1,0.3,0,1,0] }) }); H2.L.buildMenu(); H2.L.buildGuia(0,1,H2.g.save.guia.bol); ok(txt(H2.doc.getElementById('guia-rec'))==='Recomendado' && (H2.doc.getElementById('guia-est').children||[]).filter(c=>c.className==='on').length===0,'sem estrela e com rec, o boletim diz "Recomendado"'); }

// ---------- 8. o capítulo 14 e o veredito (CA8) ----------
{ const H=noite1(), {g,L}=H, c=L.HISTORIA[13];
  ok(L.HISTORIA.length===14 && c.cap===14 && c.titulo==='A noite da estrela' && c.ponto==='terraco' && c.obj.estrela===1 && c.antes.length===5 && c.depois.length===4,'HISTORIA[13]: cap. 14, "A noite da estrela", obj { estrela:1 }, 5 falas antes e 4 depois');
  ok(c.antes[0].s==='Uma noite pra valer tudo, tio.' && c.antes[4].nota==='olhando a foto da mãe' && c.depois[3].s==='Agora o guia liga. Dorme, Bia. Amanhã cedo o telefone toca.' && c.fim.h==='Fim do capítulo 14' && c.fim.p==='Continua na próxima versão: o futuro da Corre-Corre.','(os textos da spec)');
  ok(L.HISTORIA[12].fim===undefined,'o cap. 13 não tem mais o cartão de fim');
  const ob=g.capObj(); ok(ob.itens.length===1 && ob.itens[0].txt==='Ganhar a estrela do Michelzão' && !ob.itens[0].ok,'o objetivo: "Ganhar a estrela do Michelzão"');
  ok(L.HIST_RECOMENDA.falas.length===3 && L.HIST_RECOMENDA.falas[0].s==='O guia ligou. Somos "recomendados".' && L.HIST_RECOMENDA.falas[2].s==='Não é. Mas ele volta. Arruma a casa e marca outra noite.','HIST_RECOMENDA: as três falas'); }
{ // com a 1ª estrela: o capítulo se cumpre, a conversa de depois toca depois dos resultados e o cartão de fim vem antes do boletim
  const H=noite1({ guia:GUIA({ noite:60 }) }), {g,L,els}=H; dev(L,true,{ guia:'1' }); comeca(H); fecha(H,{ stars:0 });
  ok(g.result.cap && g.result.cap.ok && g.save.conversa==='depois','a 1ª estrela cumpre o objetivo e deixa a conversa de depois pendente');
  g.setState('dayend'); ok(!g.conversa && els['ov-end'].classList.contains('show'),'(os resultados primeiro)');
  let fim=0; L.veredito(()=>{ fim++; }); ok(g.conversa && g.conversa.falas===L.HISTORIA[13].depois,'o veredito toca a conversa de depois do cap. 14');
  passa(g); ok(g.save.cap===15 && els['ov-continua'].classList.contains('show') && els['cont-h'].textContent==='Fim do capítulo 14','o capítulo acaba e o cartão "Fim do capítulo 14" aparece');
  els['btn-continua'].fire('click'); ok(els['ov-guia'].classList.contains('show') && fim===0,'depois dele, o boletim'); els['btn-guia'].fire('click'); ok(fim===1,'e a lojinha'); }
{ // sem estrela: a HIST_RECOMENDA toca uma vez; o capítulo segue; o cartão volta depois de 3 dias
  const H=noite1({ guia:GUIA({ noite:60 }) }), {g,L,els}=H; dev(L,true,{ guia:'rec' }); comeca(H); fecha(H,{ stars:0 });
  ok(g.save.cap===14 && g.save.conversa===null && g.result.cap && !g.result.cap.ok,'sem estrela, o capítulo 14 segue');
  g.setState('dayend'); let fim=0; L.veredito(()=>{ fim++; }); ok(g.conversa && g.conversa.falas===L.HIST_RECOMENDA.falas,'toca a HIST_RECOMENDA'); passa(g);
  ok(g.save.guia.convRec===1 && els['ov-guia'].classList.contains('show'),'marca como vista e abre o boletim'); els['btn-guia'].fire('click'); ok(fim===1,'(lojinha)');
  // a segunda noite sem estrela: direto ao boletim
  g.save.guia.noite=g.save.dia; g.save.dia=g.save.dia; const dia=g.save.dia; g.save.guia.noite=dia; comeca(H); const r=fecha(H,{ stars:0 }); g.setState('dayend'); let fim2=0; L.veredito(()=>{ fim2++; });
  ok(!g.conversa && els['ov-guia'].classList.contains('show'),'nas seguintes, direto ao boletim');
  ok(g.save.guia.ult===dia,'(a última noite)');
  g.save.dia=dia+1; ok(g.noiteCartao.falta===3,'depois da noite, o cartão volta em 3 dias');
  g.save.dia=dia+4; ok(g.noiteCartao.falta===0,'e livre de novo no 4º dia seguinte'); }
{ // com estrela nova depois da 1ª (cap. 15): só o boletim
  const H=jogo(15,{ guia:GUIA({ noite:60, est:1, ult:50 }) }), {g,L,els}=H; dev(L,true,{ guia:'2' }); comeca(H); fecha(H,{ stars:0 }); g.setState('dayend'); let fim=0; L.veredito(()=>{ fim++; });
  ok(!g.conversa && els['ov-guia'].classList.contains('show') && g.result.noite.nova,'a 2ª estrela vai direto ao boletim (sem conversa)'); }

// ---------- 9. a visita surpresa depois da 1ª noite (CA9) ----------
{ const H=noite1({ guia:GUIA({ ult:50 }) }), {g,L}=H; let n=0, tudo=true;
  for(let d=1000;d<3000;d++){ const v=g.criticoDia(d); if(v){ n++; if(!(v.surpresa && v.real && !v.boato)) tudo=false; } }
  ok(tudo && n/2000>=0.09 && n/2000<=0.15,'depois da 1ª noite, a visita surpresa sai em cerca de 12% dos dias ('+(n/20).toFixed(1)+'% em 2000 sorteios)');
  const a=g.criticoDia(5000), b=g.criticoDia(5000); ok(!!a===!!b,'o sorteio do dia fica guardado (recomeçar o dia não sorteia de novo)');
  const H2=noite1({ guia:GUIA({ ult:0 }) }); let n2=0; for(let d=1000;d<1500;d++) if(H2.g.criticoDia(d)) n2++; ok(n2===0,'antes da 1ª noite, nenhuma');
  const H3=noite1({ guia:GUIA({ ult:50, noite:60 }) }); ok(H3.g.criticoDia(60)===null,'numa noite, nunca');
  // a visita disfarçada vira ficha: guarda as duas melhores
  const H4=noite1({ guia:GUIA({ ult:50, v:[FICHA(57,[1,1,1,1,1]),FICHA(58,[2,2,2,1,1])] }) }), g4=H4.g; g4.startDay(60); g4.visita={ n:0, boato:false, real:true, surpresa:true }; g4.schedule=[]; g4.nextIdx=0; g4.money=3000; g4.ficha=FICHA(60,[2,2,2,2,1]); g4.finishDay();
  ok(g4.save.guia.v.length===2 && g4.save.guia.v.map(f=>f.it.reduce((a,x)=>a+x,0)).join(',')==='9,8','a ficha nova entra e o save guarda só as duas melhores pela soma (9 e 8)');
  const H5=noite1({ guia:GUIA({ ult:50, v:[FICHA(57,[2,2,2,2,2]),FICHA(58,[2,2,2,2,1])] }) }), g5=H5.g; g5.startDay(60); g5.visita={ n:0, boato:false, real:true, surpresa:true }; g5.schedule=[]; g5.nextIdx=0; g5.money=3000; g5.ficha=FICHA(60,[0,1,0,0,0]); g5.finishDay();
  ok(g5.save.guia.v.map(f=>f.it.reduce((a,x)=>a+x,0)).join(',')==='10,9','uma ficha pior não entra (10 e 9)');
  g5.setState('dayend'); ok(g5.result.critico && g5.result.critico.real===true,'o cartão do fim do dia vale igual'); }

// ---------- 10. a Fama do luxo (CA10) ----------
{ const H=noite1(), {g,L}=H; const f0=L.luxoPts(g).fama; g.save.guia.est=1; const f1=L.luxoPts(g).fama; g.save.guia.est=3; const f3=L.luxoPts(g).fama;
  ok(L.LUXO.estrela===1 && f1-f0===Math.min(1,5-f0) && f3-f0===Math.min(3,5-f0),'cada estrela soma 1 na Fama (fama '+f0+' → '+f1+' → '+f3+')');
  g.save.guia.est=3; g.save.aval=Array(14).fill([5,5,5,5,5]); g.div={ id:'redes', cost:0, groups:[1,1], vip:1 }; ok(L.luxoPts(g).fama<=5,'a Fama não passa do teto de 5'); }

// ---------- 11. o selo do menu (CA11) ----------
{ const L=load({ historia:true }).L, S=L.guiaSelo;
  ok(S(null)==='' && S({ est:0, rec:0 })==='','antes da 1ª noite, sem selo');
  ok(S({ est:0, rec:1 })==='Recomendado pelo Michelzão' && S({ est:1, rec:0 })==='★ no Michelzão' && S({ est:2, rec:1 })==='★★ no Michelzão' && S({ est:3, rec:0 })==='★★★ no Michelzão','recomendado e 1, 2 e 3 estrelas'); }
{ const H=noite1(), {g,L,els}=H; L.buildMenu(); ok(els['menu-selo'].style.display==='none','o botão do selo fica escondido antes da 1ª noite');
  g.save.guia.est=2; L.buildMenu(); ok(els['menu-selo'].style.display==='' && els['menu-selo'].textContent==='★★ no Michelzão','com 2 estrelas: "★★ no Michelzão"');
  g.save.guia.est=0; g.save.guia.rec=1; L.buildMenu(); ok(els['menu-selo'].textContent==='Recomendado pelo Michelzão','recomendado: "Recomendado pelo Michelzão"');
  ok(L.caixaResumo(g.save).split('\n').pop()==='Recomendado pelo Michelzão','o "Copiar resumo" do Caixa ganha a mesma linha'); }

// ---------- 12. o modo dev (CA12) ----------
{ const H=nova({ store:{ lcc2_dev:'1' }, imprevistos:true }), {g,L,els,doc}=H; g.setDev(true); g.devReal(true); g.setState('menu');
  ok(g.devCapitulo(14) && g.save.cap===14 && g.save.conversa==='antes' && g.save.dia===64 && g.save.guia && g.save.guia.v.length===2 && g.save.guia.v.every(f=>f.it.reduce((a,x)=>a+x,0)===8) && g.save.guia.est===0,'o capítulo 14 da lista: Terraço, dia 64, a conversa de antes e duas fichas de 8');
  ok(g.devCapitulo(15) && g.save.cap===15 && g.capObj()===null && g.save.guia.est===1,'o Fim é o 15 (com a 1ª estrela)');
  ok(L.DEV_CAPS.length===15 && L.DEV_CAPS[13].n===14 && L.DEV_CAPS[14].n===15,'DEV_CAPS: 15 linhas');
  g.devCapitulo(4); g.save.conversa=null; ok(g.save.guia===null,'(no cap. 4, sem guia)');
  ok(g.devForca('noite','hoje') && L.DEV.forca.noite==='hoje','Noite da estrela: Marcar hoje'); g.devCapitulo(9); g.save.conversa=null; g.devForca('noite','hoje');
  g.startDay(g.save.dia); ok(g.noite && g.noite.real===false && g.schedule.filter(s=>s.critico).length===1 && g.schedule.filter(s=>s.braulio).length===1 && els['intro-manut'].textContent.indexOf(L.NOITE.aviso)>=0,'"Marcar hoje": o dia que começa é a noite (em qualquer capítulo), com o aviso, o crítico e o Bráulio');
  els['btn-start'].fire('click'); g.devForca('guia','3'); const sv0=JSON.stringify(g.save.guia); g.schedule=[]; g.nextIdx=0; g.ficha=null; g.money=0; g.finishDay();
  ok(g.result.noite && g.result.noite.est===3 && g.result.noite.real===false && JSON.stringify(g.save.guia)===sv0,'"Veredito ★★★" troca as estrelas dadas, e a noite do modo dev não mexe no save');
  g.devForca('noite',''); g.devForca('guia',''); g.startDay(g.save.dia); ok(g.noite===null,'"Sorteio" volta ao normal');
  L.abrirDev(); L.DEV.aba='hoje'; L.buildDev(); const dv=txt(doc.getElementById('dev-body')||{}); ok(/Noite da estrela/.test(dv) && /Marcar hoje/.test(dv) && /Veredito/.test(dv) && /Recomendado/.test(dv) && /★★★/.test(dv),'a aba Hoje traz as linhas Noite da estrela e Veredito');
  ok(L.devCenas().some(c=>c.falas===L.HIST_RECOMENDA.falas) && L.devCenas().some(c=>c.falas===L.HISTORIA[13].antes),'as conversas novas estão nas cenas do modo dev');
  g.devCapitulo(13); g.save.conversa=null; g.devCumpre(); ok(g.save.conversa==='depois','(Cumprir o objetivo agora segue funcionando)');
  g.devCapitulo(14); g.save.conversa=null; g.devCumpre(); ok(g.save.conversa==='depois' && g.save.guia.est>=1,'no cap. 14, "Cumprir o objetivo agora" dá a 1ª estrela'); }

// ---------- 13. o save (CA13) ----------
{ const L=load({ historia:true }).L, N=L.normSave;
  const mk=(g,extra)=>N(Object.assign({ histV:1, capV:5, cap:14, dia:70, conversa:null, salao:{ ponto:'terraco' }, guia:g },extra||{})).guia;
  const g0=mk({ n:2, prox:0, v:[] }); ok(g0 && g0.noite===0 && g0.ult===0 && g0.est===0 && g0.rec===0 && g0.convRec===0 && Array.isArray(g0.bol) && g0.bol.length===0,'os campos novos nascem zerados');
  const g1=mk({ n:2, prox:0, v:[], noite:71, ult:65, est:2, rec:1, convRec:1, bol:[0.5,1,0,0.25,1,0] }); ok(g1.noite===71 && g1.ult===65 && g1.est===2 && g1.rec===1 && g1.convRec===1 && g1.bol.join(',')==='0.5,1,0,0.25,1,0','os campos válidos ficam como vieram');
  const g2=mk({ n:2, prox:0, v:[], noite:-4, ult:'x', est:9, rec:5, convRec:'a', bol:[2,0,0,0,0,0] }); ok(g2.noite===0 && g2.ult===0 && g2.est===3 && g2.rec===0 && g2.convRec===0 && g2.bol.length===0,'o que é inválido é limpo (est volta ao teto 3, o boletim fora da faixa some)');
  ok(mk({ n:2, prox:0, v:[], bol:[0.1,0.2] }).bol.length===0 && mk({ n:2, prox:0, v:[], bol:'x' }).bol.length===0,'o boletim com o tamanho errado some');
  ok(JSON.stringify(N(JSON.parse(JSON.stringify(N({ histV:1, capV:5, cap:14, dia:70, conversa:null, salao:{ ponto:'terraco' }, guia:{ n:2, prox:0, v:[], est:1, bol:[1,1,1,1,1,1] } })))))===JSON.stringify(N({ histV:1, capV:5, cap:14, dia:70, conversa:null, salao:{ ponto:'terraco' }, guia:{ n:2, prox:0, v:[], est:1, bol:[1,1,1,1,1,1] } })),'normalizar de novo não muda nada');
  // o save da v10.9 no Fim (cap 14, capV 4) no Terraço começa o cap. 14
  const a=N({ histV:1, capV:4, cap:14, dia:70, bank:4000, capDia:50, capVezes:2, conversa:null, salao:{ ponto:'terraco' }, guia:{ n:2, prox:0, v:[{ d:60, it:[2,2,2,2,2] },{ d:62, it:[1,1,1,1,1] }] } });
  ok(a.cap===14 && a.conversa==='antes' && a.capDia===70 && a.capVezes===0 && a.capV===5 && a.guia && a.guia.n===2 && a.guia.v.length===2 && a.guia.est===0,'save da v10.9 no Fim (capV 4, cap 14) no Terraço: começa o cap. 14 com a conversa de antes (capV 5, as fichas ficam)');
  const b=N({ histV:1, capV:5, cap:14, dia:70, conversa:null, salao:{ ponto:'terraco' } }); ok(b.cap===14 && b.guia && b.guia.n===2 && b.guia.v.length===0,'cap. 14 sem guia (apagado por estar inválido): um guia vazio');
  const c=N({ histV:1, capV:4, cap:13, dia:70, conversa:null, salao:{ ponto:'terraco' }, guia:{ n:1, prox:72, v:[{ d:68, it:[1,2,1,2,1] }] } }); ok(c.cap===13 && c.conversa===null && c.capV===5 && c.guia.n===1,'o save da v10.9 no cap. 13 só troca o capV');
  const d=N({ histV:1, capV:4, cap:14, dia:70, conversa:null, salao:{ ponto:'avenida' } }); ok(d.cap===14 && d.capV===5 && d.conversa===null,'(save no Fim fora do Terraço não começa o 14)'); }

console.log('smoke75: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
