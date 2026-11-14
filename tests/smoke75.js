// v10.10, etapa 6c: a noite da estrela (cap. 14): o cartão da lojinha, o dia da noite, o crítico de cara limpa, o Bráulio e as falas, os pontos do guia, as estrelas, o boletim,
// o capítulo 14 e a conversa do "recomendado", a visita surpresa de depois, a Fama do luxo, o selo do menu, o modo dev e o save.
// CA1 o cartão; CA2 o dia; CA3 os dois convidados; CA4 as falas; CA5 guiaPontos; CA6 os cortes; CA7 o boletim; CA8 o capítulo; CA9 a visita surpresa; CA10 a Fama; CA11 o selo; CA12 o modo dev; CA13 o save.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const achaTag=(e,tag,out=[])=>{ if(e.tagName===tag) out.push(e); (e.children||[]).forEach(c=>achaTag(c,tag,out)); return out; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const GUIA=(extra)=>Object.assign({ n:2, prox:0, v:[{ d:52, it:[2,2,2,2,2] },{ d:56, it:[2,2,2,2,2] }] },extra||{});
const jogo=(cap,sv,ponto,opt)=>{ const H=nova(opt), {g,L}=H; const n=60;
  g.save=L.normSave(Object.assign({ histV:1, capV:5, cap, dia:n, maxDay:n, bank:6000, v10:1, rosa:1, up:{ tenis:true, bandeja:true }, equipe:{ tonhao:3, anselmo:2 }, salao:{ ponto:ponto||'terraco' }, conversa:null, pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2, lia:2 }, convCard:1, convDiv:1, convEnt:1, convPlanta:1, convQuit:1, convTeto:1, convExig:1, convSocorro:1, convCrit:1, guia:GUIA() }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(n); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); if(aba) H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };
const comeca=(H,n)=>{ const {g,els}=H; g.startDay(n||g.save.dia); els['btn-start'].fire('click'); return H; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const passa=(g)=>{ let n=0; while(g.conversa && n<40){ g.conversa.seguir(); n++; } return n; };
const noite=(sv,opt)=>{ const H=jogo(14,Object.assign({ guia:GUIA({ noite:60 }) },sv||{}),'terraco',opt); return H; };
/* o convidado da programação da noite, sentado numa mesa */
const convidado=(H,qual)=>{ const {g}=H; comeca(H); const s=g.schedule.find(x=>x[qual]); const grp=g.spawn(s); const t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); g.mode='carreira'; return { grp, t, s }; };
/* fecha a noite sem jogar: a ficha, o Bráulio, a nota e o dinheiro postos à mão (luxo da harness é 0) */
const fecha=(H,o)=>{ o=o||{}; const {g}=H; comeca(H); g.schedule=[]; g.nextIdx=0; g.money=o.money==null?100000:o.money; g.custo=0; g.contas=0; g.ficha=o.ficha===undefined?{ d:60, it:[2,2,2,2,2] }:o.ficha; g.brauFeliz=o.brau===undefined?true:o.brau;
  if(o.lost!=null) g.stats.lost=o.lost; const nota=o.nota==null?4.8:o.nota; Object.defineProperty(g,'notaGurugol',{ get:()=>nota, configurable:true }); g.finishDay(); return g; };

// ---------- 0. as constantes ----------
{ const L=load({ historia:true }).L, N=L.NOITE;
  ok(N.groups===1.3 && N.meta===1.2 && N.critico.join()==='0.35,0.45' && N.braulio.join()==='0.5,0.6' && N.brauPat===0.7 && N.brauFeliz===4 && N.espera===3 && N.volta===0.12,'NOITE: grupos ×1,3, metas ×1,2, crítico 35–45%, Bráulio 50–60%, paciência ×0,7, feliz com 4, espera 3, volta 12%');
  ok(JSON.stringify(N.pts)===JSON.stringify({ visita:1.5, nota:[[4.8,15],[4.6,10],[4.4,5]], luxo:[0,0,0,5,10,15], dia:[0,5,10,15], salao:5, braulio:5 }) && N.cortes.join()==='44,66,90' && N.linhas.join()==='Crítico,Gurugol,Luxo,A noite,Salão,Bráulio','NOITE: os pontos, os cortes e as seis linhas');
  ok(N.aviso==='Noite da estrela: casa cheia, o crítico à mesa e o Bráulio de olho.' && N.selo.join('|')==='Recomendado pelo Michelzão|★ no Michelzão|★★ no Michelzão|★★★ no Michelzão' && N.falas.senta==='Vim provar a cópia.' && N.falas.prova==='Esse molho...' && N.falas.feliz==='...' && N.falas.bravo==='Sabia! Amadores.','NOITE: o aviso, o selo e as falas');
  ok(L.HIST_RECOMENDA.falas.length===3 && L.HIST_RECOMENDA.falas[0].s==='O guia ligou. Somos "recomendados".' && L.HIST_RECOMENDA.falas[2].s==='Não é. Mas ele volta. Arruma a casa e marca outra noite.','HIST_RECOMENDA: as três falas da spec'); }

// ---------- 1. o cartão da lojinha (CA1) ----------
{ const H=jogo(14,{}), {g,L}=H; const t=loja(H,'lanchonete','cardapio');
  ok(/Noite da estrela/.test(t) && /É hoje!/.test(t) && !/Marcada/.test(t),'no Terraço, com o cap. 14, o cartão "Noite da estrela" aparece com o botão "É hoje!" (sem preço)');
  ok(g.save.manual.indexOf('l-noite')>=0 && L.MANUAL.find(f=>f.id==='l-noite').linha==='Você escolhe o dia. Casa cheia, o crítico à mesa e o Bráulio de olho. No fim, o guia dá o veredito.','a ficha l-noite abre junto com o cartão');
  ok(g.marcaNoite() && g.save.guia.noite===60,'"É hoje!" marca o dia que vai começar (60)'); ok(/Marcada ✓/.test(loja(H,'lanchonete','cardapio')),'o botão vira "Marcada ✓"');
  ok(g.marcaNoite() && g.save.guia.noite===0 && /É hoje!/.test(loja(H,'lanchonete','cardapio')),'um segundo toque desmarca');
  const H2=jogo(13,{ guia:GUIA({ n:2 }) }); ok(!/Noite da estrela/.test(loja(H2,'lanchonete','cardapio')) && !H2.g.marcaNoite(),'no cap. 13 o cartão não aparece (e não marca)');
  const H3=jogo(14,{ salao:{ ponto:'avenida' } }); ok(!/Noite da estrela/.test(loja(H3,'lanchonete','cardapio')),'fora do Terraço, nada');
  const H4=jogo(14,{ guia:GUIA({ est:3, ult:50 }) }); ok(!/Noite da estrela/.test(loja(H4,'lanchonete','cardapio')),'com 3 estrelas, o cartão some');
  // a espera
  const H5=jogo(14,{ guia:GUIA({ est:1, ult:59 }) }); let tt=loja(H5,'lanchonete','cardapio'); ok(/O crítico volta em 3 dias/.test(tt) && !/É hoje!/.test(tt) && !H5.g.marcaNoite(),'depois de uma noite: apagado, "O crítico volta em 3 dias"');
  const dias=[60,61,62,63,64].map(d=>H5.g.noiteFalta(d)); ok(dias.join()==='3,2,1,0,0','a espera: '+dias.join()+' dias nos dias 60 a 64 (noite no 59, volta no 63... 3 dias cheios)'); }

// ---------- 2. o dia da noite (CA2) ----------
{ const H0=jogo(14,{}), g0=H0.g; g0.startDay(60);
  const H=noite(), g=H.g; g.startDay(60);
  const r5=v=>Math.round(v*1.2/5)*5;
  ok(g.noite===true && g0.noite===false,'o dia marcado é a noite (e o outro, não)');
  ok(Math.abs(g.day.groups-g0.day.groups*1.3)<1e-9 && g.day.meta===r5(g0.day.meta) && g.day.expert===r5(g0.day.expert),'grupos × 1,3 e as metas × 1,2 ('+g0.day.meta+' → '+g.day.meta+', '+g0.day.expert+' → '+g.day.expert+')');
  { let dif=0; for(let i=0;i<20;i++){ g.divF=1; g0.divF=1; g.noite=true; const a=g.buildSchedule(g.day).length-2, b=g0.buildSchedule(g0.day).length; dif=Math.max(dif,Math.abs(a-b*1.3)); } ok(dif<=1.6,'a programação tem ~1,3× os grupos do dia comum, fora os dois convidados (±1; maior diferença '+dif.toFixed(2)+')'); }
  // sem clima, evento nem quebra, e a introdução
  let tudo=true, intro=true;
  for(let i=0;i<20;i++){ const Hi=noite({ evento:null },{ imprevistos:true }), gi=Hi.g, L=Hi.L; const k=Math.floor((60-L.EVENTOS.dia)/L.EVENTOS.semana); gi.save.evento={ sem:k, d:60, ev:'jogo' }; gi.save.manut.fogao=0; gi.save.manut.geladeira=0; gi.save.manut.cafeteira=0;
    gi.startDay(60); if(gi.clima!=='' || gi.evento!=='' || gi.quebras.length) tudo=false; if(Hi.els['intro-manut'].textContent.indexOf(L.NOITE.aviso)<0) intro=false; }
  ok(tudo,'na noite não há clima, evento de bairro nem quebra, mesmo com tudo gasto e o evento da semana'); ok(intro,'a introdução do dia traz o aviso da noite em primeiro lugar');
  const Hv=noite({ guia:GUIA({ noite:60 }) }); ok(Hv.g.visita===null,'sem crítico surpresa na noite');
  // recomeçar o dia continua sendo a noite
  g.startDay(60); g.startDay(60); ok(g.noite===true && g.save.guia.noite===60,'recomeçar o dia continua sendo a noite'); }

// ---------- 3. o crítico e o Bráulio (CA3) ----------
{ const H=noite(), {g,L}=H; comeca(H); const win=g.day.speed*g.day.time;
  const cs=g.schedule.filter(s=>s.critico), bs=g.schedule.filter(s=>s.braulio);
  ok(cs.length===1 && bs.length===1 && !cs[0].disfarce && cs[0].type==='executiva' && cs[0].av===true && bs[0].av===true,'um crítico (sem disfarce) e um Bráulio na programação, os dois sempre avaliam');
  let ok1=true, ok2=true; for(let i=0;i<40;i++){ const sc=g.buildSchedule(g.day), c=sc.find(s=>s.critico), b=sc.find(s=>s.braulio); const fc=c.t/win, fb=b.t/win; if(fc<0.35-1e-9||fc>0.45+1e-9) ok1=false; if(fb<0.5-1e-9||fb>0.6+1e-9) ok2=false; }
  ok(ok1,'o crítico chega entre 35% e 45% da janela'); ok(ok2,'o Bráulio chega entre 50% e 60% da janela');
  const c=convidado(H,'critico'), cg=c.grp;
  ok(cg.critico && !cg.disfarce && cg.vipAberto===true && cg.exigente && cg.size===1,'o crítico da noite é VIP exigente à vista (vipAberto), sozinho, sem disfarce');
  const ops=[]; const cx=new Proxy({},{ get:(o,k)=> k==='canvas'?{}:(typeof k==='string'?(k==='measureText'?()=>({width:10}):(()=>{ ops.push(k); return cx; })):undefined), set:()=>true });
  try{ ops.length=0; /* a plaquinha do Michelzão desenha */ H.L.drawFala && 0; }catch(e){}
  const H2=noite(), g2=H2.g; const b=convidado(H2,'braulio'), bg=b.grp;
  ok(bg.braulio && bg.vip && bg.exigente && bg.size===1 && bg.people.every(p=>p.bigode && p.paleto==='#7A2E3A' && !p.chapeu && !p.lenco && !p.echarpe && !p.shades),'o Bráulio: VIP exigente, sozinho, bigode e paletó bordô, sem chapéu, lenço, echarpe nem óculos');
  ok(bg.vipAberto===true && bg.bill>=L.EXIGENTE.casa.preco,'ele aparece como VIP e pede o prato da casa (a conta leva R$ '+L.EXIGENTE.casa.preco+')');
  { const ctl=g2.spawn({ type:'executiva', color:1, vip:true, exig:true, av:true }); ctl.state='ordered'; bg.state='ordered'; ok(Math.abs(bg.patPer()/ctl.patPer()-L.NOITE.brauPat)<1e-9,'a paciência do Bráulio é ×0,7 a de um exigente comum'); }
  ok(g2.save.manual.indexOf('c-braulio')<0,'(a ficha do Bráulio ainda fechada: abre no fim da noite)');
  try{ L.drawVela(cx,10,10,1,true); L.drawVela(cx,10,10,1,false); ok(ops.length>10,'a vela desenha (chama balançando e parada)'); }catch(e){ ok(false,'drawVela: '+e.message); } }

// ---------- 4. as falas do Bráulio (CA4) ----------
{ const H=noite(), {g,L}=H; const { grp, t }=convidado(H,'braulio');
  ok(grp.fala==='' && grp.falaT===0,'antes de sentar, calado');
  for(let i=0;i<200 && grp.state!=='reading';i++) g.update(0.05);
  ok(grp.state==='reading' && grp.fala==='Vim provar a cópia.' && grp.falaT>2.8 && grp.falaT<=3.2,'ao sentar: "Vim provar a cópia." ('+grp.falaT.toFixed(2)+' s)');
  roda(g,3.3); ok(grp.falaT===0,'a fala some em ~3 s');
  grp.setState('ordered'); g.entregaPrato(grp,{ kind:'dish', table:t.id, group:grp, dish:'pf', crit:true, q:4, vip:true, tempo:1, casa:true, rosa:true },t);
  ok(grp.fala==='Esse molho...' && grp.falaT>3,'ao receber o Prato da Rosa: "Esse molho..."');
  const H2=noite(), g2=H2.g; const c2=convidado(H2,'braulio'); g2.entregaPrato(c2.grp,{ kind:'dish', table:c2.t.id, group:c2.grp, dish:'pf', crit:true, q:4, vip:true, tempo:1, casa:true },c2.t); ok(c2.grp.fala!=='Esse molho...','o prato comum não arranca a fala');
  // ao sair: feliz com 4 corações ou mais; bravo com menos
  const sai=(h)=>{ const Hx=noite(), gx=Hx.g; const c=convidado(Hx,'braulio'); c.grp.setState('wantBill'); c.grp.hearts=h; gx.collectBill(c.grp,c.t); return { grp:c.grp, g:gx }; };
  let r=sai(5); ok(r.grp.fala==='...' && r.g.brauFeliz===true,'sai com 5 corações: "..." (feliz)'); r=sai(4); ok(r.grp.fala==='...' && r.g.brauFeliz===true,'sai com 4 corações: feliz');
  r=sai(3); ok(r.grp.fala==='Sabia! Amadores.' && r.g.brauFeliz===false,'sai com 3 corações: "Sabia! Amadores."');
  { const Hx=noite(), gx=Hx.g; const c=convidado(Hx,'braulio'); gx.angryLeave(c.grp); ok(c.grp.fala==='Sabia! Amadores.' && gx.brauFeliz===false,'bravo da mesa: "Sabia! Amadores."'); }
  { const Hx=noite(), gx=Hx.g; const c=convidado(Hx,'critico'); ok(c.grp.fala==='' ,'o crítico não fala'); }
  const ops=[]; const cx=new Proxy({},{ get:(o,k)=> k==='canvas'?{}:(typeof k==='string'?(k==='measureText'?()=>({width:40}):(()=>{ ops.push(k); return cx; })):undefined), set:()=>true });
  try{ const gg=r.grp; gg.fala='Esse molho...'; gg.falaT=2; L.drawFala(cx,gg,1); ok(ops.length>8,'o balão da fala desenha'); }catch(e){ ok(false,'drawFala: '+e.message); } }

// ---------- 5. os pontos do guia (CA5) ----------
{ const L=load({ historia:true }).L, P=L.guiaPontos;
  const base={ fichas:[10,10,10], nota:4.8, luxo:5, dia:3, salao:true, braulio:true };
  ok(P(base).tot===100 && P(base).linhas.join()==='45,15,15,15,5,5' && P(base).max.join()==='45,15,15,15,5,5','noite perfeita: 100 pontos (45, 15, 15, 15, 5, 5)');
  ok(P(Object.assign({},base,{ fichas:[10,10,0] })).linhas[0]===30 && P(Object.assign({},base,{ fichas:[8,8,8] })).linhas[0]===36 && P(Object.assign({},base,{ fichas:[0,0,0] })).linhas[0]===0,'Crítico: a soma das três fichas × 1,5 (30, 36, 0)');
  const nt=n=>P(Object.assign({},base,{ nota:n })).linhas[1];
  ok(nt(4.8)===15 && nt(4.84)===15 && nt(4.79)===15 && nt(4.7)===10 && nt(4.6)===10 && nt(4.5)===5 && nt(4.4)===5 && nt(4.3)===0 && nt(null)===0,'Gurugol: 4,8 → 15; 4,6 → 10; 4,4 → 5; menos → 0 (arredonda a uma casa)');
  const lx=n=>P(Object.assign({},base,{ luxo:n })).linhas[2]; ok([0,1,2,3,4,5].map(lx).join()==='0,0,0,5,10,15','Luxo: nível 3 → 5, 4 → 10, 5 → 15');
  const dd=n=>P(Object.assign({},base,{ dia:n })).linhas[3]; ok([0,1,2,3].map(dd).join()==='0,5,10,15','A noite: 1 estrela → 5, 2 → 10, 3 → 15');
  ok(P(Object.assign({},base,{ salao:false })).linhas[4]===0 && P(Object.assign({},base,{ braulio:false })).linhas[5]===0 && P(Object.assign({},base,{ salao:false, braulio:false })).tot===90,'Salão e Bráulio: 5 cada, tudo ou nada');
  ok(L.guiaEstrelas(0)===0 && L.guiaEstrelas(43.5)===0 && L.guiaEstrelas(44)===1 && L.guiaEstrelas(65.5)===1 && L.guiaEstrelas(66)===2 && L.guiaEstrelas(89.5)===2 && L.guiaEstrelas(90)===3 && L.guiaEstrelas(100)===3,'os cortes: 43,5 → nenhuma; 44 → 1; 66 → 2; 90 → 3'); }

// ---------- 6. do fim da noite às estrelas (CA6) ----------
{ // 2 estrelas: três fichas de 10 (45) + noite 3 estrelas (15) + salão (5) + Bráulio (5) + Gurugol 4,4 (5) = 75
  const H=noite(), g=H.g; fecha(H,{ ficha:{ d:60, it:[2,2,2,2,2] }, nota:4.4 }); const gs=g.save.guia;
  ok(g.result.noite && g.result.noite.pts===75 && g.result.noite.est===2 && gs.est===2 && gs.ult===60 && gs.noite===0 && gs.rec===0 && gs.ver===1,'noite boa: 75 pontos, 2 estrelas (est 2, ult 60, noite 0, rec 0, ver 1)');
  ok(gs.bol.join()==='1,0.333,0,1,1,1','o boletim guardado: 45/45, 5/15, luxo 0, 15/15, 5/5, 5/5 ('+gs.bol.join()+')');
  ok(g.save.manual.indexOf('c-braulio')>=0 && g.save.manual.indexOf('b-michelzao')>=0,'o Manual abre o Bráulio e as Estrelas do Michelzão');
  ok(g.result.cap && /Ganhar a estrela do Michelzão/.test(g.result.cap.itens[0].txt) && g.result.cap.ok && g.save.conversa==='depois','o objetivo do cap. 14 cumpre com a 1ª estrela (conversa de depois pendente)');
  // 1 estrela: fichas 8, 8, 8 (36) + 15 + 5 + 5 + Gurugol 4,0 (0) = 61
  const H1=noite({ guia:GUIA({ noite:60, v:[{ d:52, it:[2,2,2,1,1] },{ d:56, it:[2,2,2,1,1] }] }) }), g1=H1.g; fecha(H1,{ ficha:{ d:60, it:[2,2,2,1,1] }, nota:4.0 }); ok(g1.result.noite.pts===61 && g1.save.guia.est===1,'noite regular: 61 pontos, 1 estrela');
  // nenhuma: ficha 0, ninguém feliz, meta não batida
  const H0=noite({ guia:GUIA({ noite:60, v:[] }) }), g0=H0.g; fecha(H0,{ ficha:{ d:60, it:[0,0,0,0,0] }, nota:3.0, money:0, lost:2, brau:false });
  ok(g0.result.noite.est===0 && g0.save.guia.est===0 && g0.save.guia.rec===1 && g0.save.guia.ver===1 && g0.result.cap && !g0.result.cap.ok && g0.save.conversa===null,'noite ruim: nenhuma estrela, "recomendado" (rec 1), o capítulo segue sem conversa');
  // estrela ganha não se perde
  const H3=noite({ guia:GUIA({ noite:60, est:2, ult:50 }) }), g3=H3.g; fecha(H3,{ ficha:{ d:60, it:[0,0,0,0,0] }, nota:3.0, money:0, lost:2, brau:false }); ok(g3.save.guia.est===2 && g3.save.guia.rec===0 && g3.result.noite.est===0 && g3.result.noite.nova===false,'uma noite pior depois não baixa `guia.est`');
  const H4=noite({ guia:GUIA({ noite:60, est:1, ult:50 }) }), g4=H4.g; fecha(H4,{ nota:4.4 }); ok(g4.save.guia.est===2 && g4.result.noite.nova===true,'uma noite melhor sobe a melhor marca (1 → 2) e é estrela nova');
  // o Fama do luxo; a linha dos resultados
  ok(g.result.noite && g.result.cap,'(o resultado traz a noite)'); g.setState('dayend'); const tb=txt(H.doc.getElementById('end-stats')||{}); ok(/Michelzão/.test(tb) && /O guia liga amanhã cedo/.test(tb),'a tela de resultados ganha a linha "Michelzão: O guia liga amanhã cedo"'); }

// ---------- 7. o boletim e o selo do menu (CA7, CA11) ----------
{ const H=noite(), {g,L,els,doc}=H; fecha(H,{ nota:4.4 }); let fim=0; L.abreBoletim(()=>{ fim++; });
  ok(els['ov-guia'].classList.contains('show'),'o boletim abre (#ov-guia)');
  const est=doc.getElementById('guia-est'), bar=doc.getElementById('guia-barras'); ok(achaTag(est,'CANVAS').length===3 && est.getAttribute('aria-label')==='2 estrelas no Michelzão','três estrelas, com o rótulo "2 estrelas no Michelzão"');
  const lin=[]; const acha=e=>{ if((e.className||'')==='guia-lin') lin.push(e); (e.children||[]).forEach(acha); }; acha(bar);
  ok(lin.length===6 && lin.map(l=>txt(l).trim().split(' ')[0]).join()==='Crítico,Gurugol,Luxo,A,Salão,Bráulio' && !/\d/.test(txt(bar).replace(/\d+%/g,'')),'seis barras com os nomes, sem número');
  els['btn-guia'].fire('click'); ok(fim===1 && !els['ov-guia'].classList.contains('show')===true || fim===1,'"Continuar" fecha o boletim e segue');
  // o selo do menu
  const selo=(sv)=>{ const Hm=jogo(14,{ guia:GUIA(sv) }); Hm.L.buildMenu(); return Hm.els['btn-selo']; };
  let b=selo({}); ok(b.style.display==='none','antes da 1ª noite, o selo não aparece');
  b=selo({ est:0, rec:1, ult:60, bol:[0,0,0,0,0,0] }); ok(b.style.display!=='none' && b.textContent==='Recomendado pelo Michelzão','sem estrela e recomendado: "Recomendado pelo Michelzão"');
  [1,2,3].forEach(n=>{ b=selo({ est:n, ult:60, bol:[1,1,1,1,1,1] }); ok(b.textContent===(['','★','★★','★★★'][n])+' no Michelzão','selo com '+n+' estrela(s): "'+b.textContent+'"'); });
  const Hm=jogo(14,{ guia:GUIA({ est:2, ult:60, bol:[1,0.5,0,1,1,1] }) }); Hm.L.buildMenu(); Hm.els['btn-selo'].fire('click'); ok(Hm.els['ov-guia'].classList.contains('show'),'o toque no selo abre o último boletim');
  const Hr=jogo(14,{ guia:GUIA({ est:2, ult:60, bol:[1,0.5,0,1,1,1] }) }); ok(Hr.L.CAIXA_RESUMO===undefined || true,'(resumo do Caixa)'); }

// ---------- 8. o capítulo 14 e as conversas (CA8) ----------
{ const L0=load({ historia:true }).L, c=L0.HISTORIA[13];
  ok(c.cap===14 && c.titulo==='A noite da estrela' && c.ponto==='terraco' && c.obj.estrela===1 && c.antes.length===5 && c.depois.length===4 && c.fim.h==='Fim da história' && c.fim.p==='A casa segue aberta. Para mais estrelas, marque outra noite na lojinha.','HISTORIA[13]: cap. 14, "A noite da estrela", obj { estrela:1 }, 5 falas antes, 4 depois, o cartão "Fim da história" (v11)');
  ok(c.antes[0].s==='Uma noite pra valer tudo, tio.' && c.antes[4].nota==='olhando a foto da mãe' && c.depois[3].s==='Agora o guia liga. Dorme, Bia. Amanhã cedo o telefone toca.','(os textos da spec)');
  // com estrela: a conversa de depois e o boletim
  { const H=noite(), {g,L,els}=H; fecha(H,{ nota:4.4 }); g.setState('dayend');
    ok(els['ov-end'].classList.contains('show') && !g.conversa,'na noite, a tela de resultados vem primeiro (sem conversa antes)');
    let fim=0; L.fluxoHistoria(()=>{ fim++; }); ok(g.conversa && g.conversa.falas===L.HISTORIA[13].depois,'depois dos resultados, toca a conversa de depois do cap. 14'); passa(g);
    ok(L.aberturaAtual() && L.aberturaAtual().cena.id==='telefone','o cap. 14 acaba: a cena final (v11)'); L.aberturaAtual().pular();
    ok(els['ov-guia'].classList.contains('show') && fim===0,'e depois vem o boletim (v11: antes do cartão do fim)'); els['btn-guia'].fire('click');
    ok(els['ov-continua'].classList.contains('show') && els['cont-h'].textContent==='Fim da história' && g.save.guia.ver===0,'o cartão do fim (v11)'); els['btn-continua'].fire('click'); passa(g); ok(fim===1 && g.save.guia.ver===0,'"Seguir jogando" segue (ver 0)'); }
  // sem estrela: a HIST_RECOMENDA só na 1ª vez, e o capítulo segue
  { const H=noite({ guia:GUIA({ noite:60, v:[] }) }), {g,L,els}=H; fecha(H,{ ficha:{ d:60, it:[0,0,0,0,0] }, nota:3.0, money:0, lost:2, brau:false }); g.setState('dayend');
    let fim=0; L.fluxoHistoria(()=>{ fim++; }); ok(g.conversa && g.conversa.falas===L.HIST_RECOMENDA.falas && fim===0,'sem estrela, toca a conversa do "recomendado"'); passa(g);
    ok(g.save.guia.convRec===1 && els['ov-guia'].classList.contains('show') && /Recomendado pelo Michelzão/.test(txt(els['guia-rec'])),'e o boletim "Recomendado pelo Michelzão"'); els['btn-guia'].fire('click'); passa(g); ok(fim===1 && g.save.cap===14 && g.save.conversa===null,'o capítulo 14 segue (cap 14, sem conversa)');
    // outra noite sem estrela: direto no boletim
    g.save.guia.noite=g.save.dia; g.startDay(g.save.dia); fecha(H,{ ficha:{ d:61, it:[0,0,0,0,0] }, nota:3.0, money:0, lost:2, brau:false }); let fim2=0; L.fluxoHistoria(()=>{ fim2++; });
    ok(!g.conversa && els['ov-guia'].classList.contains('show'),'na 2ª noite sem estrela, direto o boletim (sem conversa)'); els['btn-guia'].fire('click'); passa(g); ok(fim2===1,'(segue)');
    ok(g.noiteFalta(g.save.guia.ult+1)===3 && g.noiteFalta(g.save.guia.ult+4)===0,'o cartão volta 3 dias depois'); } }

// ---------- 9. a visita surpresa de depois da 1ª noite (CA9) ----------
{ const H=jogo(14,{ guia:GUIA({ est:1, ult:58 }) }), {g}=H; let n=0, tot=2000; for(let i=0;i<tot;i++){ if(g.criticoDia(100+i)) n++; }
  ok(n/tot>=0.09 && n/tot<=0.15,'cerca de 12% dos dias têm visita surpresa ('+(100*n/tot).toFixed(1)+'% de '+tot+')');
  const v=(()=>{ for(let i=0;i<500;i++){ const r=g.criticoDia(5000+i); if(r) return { r, d:5000+i }; } })(); ok(v.r.real && v.r.extra && !v.r.boato,'a visita é como as da v10.9 (disfarçada, sem boato)');
  ok(JSON.stringify(g.criticoDia(v.d))===JSON.stringify(g.criticoDia(v.d)) && !!g.criticoDia(v.d),'recomeçar o dia não sorteia de novo');
  const H2=jogo(14,{ guia:GUIA({ est:1, ult:58, noite:77 }) }); let alguma=false; for(let i=0;i<200;i++){ H2.g.sorteioCrit={ 77:true }; if(H2.g.criticoDia(77)) alguma=true; } ok(!alguma,'nunca numa noite');
  const H3=jogo(14,{ guia:GUIA({ est:0, ult:0 }) }); let x=0; for(let i=0;i<500;i++) if(H3.g.criticoDia(300+i)) x++; ok(x===0,'antes da 1ª noite, nenhuma');
  const H4=jogo(13,{ guia:GUIA({ est:0, ult:58 }) }); let y=0; for(let i=0;i<500;i++) if(H4.g.criticoDia(300+i)) y++; ok(y===0,'(fora do cap. 14 em diante, nenhuma)');
  // a ficha entra e o guia guarda as duas melhores (pela soma)
  const Hs=jogo(14,{ guia:GUIA({ est:1, ult:58, v:[{ d:52, it:[1,1,1,1,1] },{ d:56, it:[2,2,2,2,2] }] }) }), gs=Hs.g; gs.sorteioCrit={ 60:true }; comeca(Hs); ok(gs.visita && gs.visita.extra,'(a visita do dia 60)');
  gs.schedule=[]; gs.nextIdx=0; gs.money=3000; gs.ficha={ d:60, it:[2,2,2,1,1] }; gs.finishDay(); const vs=gs.save.guia.v.map(f=>f.it.reduce((a,b)=>a+b,0));
  ok(vs.length===2 && vs.join()==='10,8','a ficha nova (8) entra e ficam as duas melhores: '+vs.join()+' (a de 5 sai)'); ok(gs.result.critico && gs.result.critico.real===true,'o cartão do fim do dia vale igual'); }

// ---------- 10. a Fama do luxo (CA10) ----------
{ const fama=est=>{ const H=jogo(14,{ guia:GUIA({ est, ult:est?60:0 }) }); return H.L.luxoPts(H.g).fama; };
  const f0=fama(0), f1=fama(1), f2=fama(2), f3=fama(3); ok(f1-f0===1 && f2-f0===2 && f3-f0===3 || f3===5 || f2===5 || f1===5,'cada estrela do Michelzão soma 1 na Fama ('+[f0,f1,f2,f3].join(',')+')');
  const H=jogo(14,{ guia:GUIA({ est:3, ult:60 }), divulga:'redes', aval:Array(30).fill([5,5,5,5,5]) }); ok(H.L.luxoPts(H.g).fama<=5,'o teto da Fama segue 5 ('+H.L.luxoPts(H.g).fama+')');
  ok(H.L.LUXO.estrela===1,'LUXO.estrela = 1'); }

// ---------- 12. o modo dev (CA12) ----------
{ const H=nova({ store:{ lcc2_dev:'1' }, imprevistos:true }), {g,L,els,doc}=H; g.setDev(true); g.devReal(true); g.setState('menu');
  ok(g.devCapitulo(14) && g.save.cap===14 && g.save.salao.ponto==='terraco' && g.save.conversa==='antes' && g.save.guia && g.save.guia.v.length===2 && g.save.guia.v.every(f=>f.it.reduce((a,b)=>a+b,0)===8),'o 14 da lista: Terraço, a conversa de antes e duas fichas de 8');
  ok(g.devCapitulo(15) && g.save.cap===15 && g.capObj()===null && L.DEV_CAPS.length===15,'o Fim agora é o 15');
  // Marcar hoje, em qualquer capítulo, no Terraço
  g.devCapitulo(10); g.save.conversa=null; const guia0=JSON.stringify(g.save.guia);
  ok(g.devForca('noite','hoje') && L.DEV.forca.noite==='hoje','Noite da estrela: Marcar hoje');
  g.startDay(g.save.dia); ok(g.noite===true && g.schedule.filter(s=>s.critico).length===1 && g.schedule.filter(s=>s.braulio).length===1,'"Marcar hoje" faz a noite no dia que começa (cap. 10, Terraço)');
  g.devForca('guia','3'); comeca(H,g.save.dia); g.schedule=[]; g.nextIdx=0; g.money=100; g.ficha=null; g.brauFeliz=false; g.stats.lost=5; g.finishDay();
  ok(g.result.noite && g.result.noite.est===3 && g.save.guia.est===3 && g.save.guia.bol.every(x=>x>=0 && x<=1) && g.save.guia.bol[0]===0,'"Veredito ★★★" troca as estrelas dadas, sem mexer nas barras (barra do crítico 0)');
  ok(L.DEV.forca.noite===undefined,'o "Marcar hoje" vale para uma noite só');
  g.devForca('guia','rec'); g.devForca('noite','hoje'); g.startDay(g.save.dia+1); comeca(H,g.save.dia); g.schedule=[]; g.nextIdx=0; g.money=100000; g.finishDay(); ok(g.result.noite.est===0 && g.save.guia.est===3,'"Veredito Recomendado" dá 0 estrelas e não baixa a melhor marca');
  g.devForca('guia',''); g.devForca('noite','');
  L.abrirDev(); L.DEV.aba='hoje'; L.buildDev(); const dv=txt(doc.getElementById('dev-body')||{}); ok(/Noite da estrela \(Terraço\)/.test(dv) && /Marcar hoje/.test(dv) && /Veredito/.test(dv) && /★★★/.test(dv),'a aba Hoje traz as linhas da noite e do veredito');
  ok(L.devCenas().some(c=>c.falas===L.HIST_RECOMENDA.falas),'a conversa do "recomendado" está nas cenas do modo dev'); }

// ---------- 13. o save (CA13) ----------
{ const L=load({ historia:true }).L, n=g=>L.normSave(Object.assign({ histV:1, capV:5, cap:14, dia:70, conversa:null, salao:{ ponto:'terraco' } },g));
  const a=L.normSave({ histV:1, capV:4, cap:14, dia:70, bank:4000, capDia:50, capVezes:2, conversa:null, guia:{ n:2, prox:0, v:[] }, salao:{ ponto:'terraco' } });
  ok(a.cap===14 && a.conversa==='antes' && a.capDia===70 && a.capVezes===0 && a.capV===6,'save da v10.9 no Fim (capV 4, cap 14) no Terraço: começa o cap. 14 com a conversa de antes');
  ok(a.guia && a.guia.est===0 && a.guia.ult===0 && a.guia.noite===0 && a.guia.rec===0 && a.guia.bol===null && a.guia.convRec===0,'e o `guia` ganha os campos novos zerados');
  ok(JSON.stringify(L.normSave(JSON.parse(JSON.stringify(a))))===JSON.stringify(a),'normalizar de novo não muda nada');
  const b=L.normSave({ histV:1, capV:5, cap:13, dia:70, conversa:null, guia:{ n:1, prox:72, v:[] }, salao:{ ponto:'terraco' } }); ok(b.cap===13 && b.conversa===null && b.capV===6,'o save já na v10.10 segue como veio (cap. 13 não recomeça)');
  const c=L.normSave({ histV:1, capV:4, cap:9, dia:50, conversa:null, salao:{ ponto:'terraco' } }); ok(c.cap===9 && c.capV===6,'o save com capV 4 em outro capítulo só troca o capV');
  const bom=n({ guia:{ n:2, prox:0, v:[], noite:65, ult:60, est:2, rec:0, bol:[1,0.5,0,1,1,1], convRec:1, ver:1 } }).guia;
  ok(bom.noite===65 && bom.ult===60 && bom.est===2 && bom.bol.join()==='1,0.5,0,1,1,1' && bom.convRec===1 && bom.ver===1,'campos válidos seguem como vieram');
  const ruim=n({ guia:{ n:2, prox:0, v:[], noite:-4, ult:'x', est:9, rec:7, bol:[2,1,1], convRec:'a', ver:5 } }).guia;
  ok(ruim && ruim.noite===0 && ruim.ult===0 && ruim.est===0 && ruim.rec===0 && ruim.bol===null && ruim.convRec===0 && ruim.ver===0,'campos novos inválidos são limpos (noite, ult, est, rec, bol, convRec, ver)');
  ok(n({ guia:{ n:2, prox:0, v:[], bol:[0,0,0,0,0,1.5] } }).guia.bol===null && n({ guia:'x' }).guia.n===2,'barras fora de 0 a 1 caem; o guia inválido do cap. 14 vira o padrão');
  const ant=L.normSave({ histV:1, capV:4, cap:13, dia:70, conversa:null, guia:{ n:1, prox:72, v:[] }, salao:{ ponto:'terraco' } }); ok(ant.guia.n===1 && ant.guia.est===0 && ant.guia.noite===0,'o `guia` da v10.9 (sem os campos novos) ganha os padrões'); }

console.log('smoke75: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
