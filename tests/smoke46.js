// v9.4, etapa 3b-4: o fiscal da vigilância sanitária na Avenida (sorteio, aviso, as 3 falhas, o resultado, o selo, a multa e o save).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
// jogo no ponto, com os imprevistos ligados (o sorteio só existe com MANUT.on) e sem ajudantes (nada limpa a pia nem as mesas)
const jogo=(ponto,pontoDia,dia,sv)=>{ const H=load({historia:true,imprevistos:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); const {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap:6, dia, maxDay:dia, pontoDia, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1 }, salao:{ ponto }, convCard:1, convDiv:1 }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(dia); return H; };
const sorteios=(H,n,vezes)=>{ const {g}=H; let c=0; for(let i=0;i<vezes;i++){ delete g.save.manut.sorteio; g.sortear(n); if(g.save.manut.sorteio && g.save.manut.sorteio.fiscal) c++; } return c; };
// dia aberto na Avenida com o fiscal marcado para f (fração do turno), sem chegadas
const aberto=(f,sv)=>{ const H=jogo('avenida',5,10,sv), {g}=H; g.save.manut.sorteio={ d:10, clima:'', quebra:[], fiscal:f==null?undefined:{ f } }; g.startDay(10); g.begin(); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); g.state='playing'; return H; };
const passo=(g,n)=>{ for(let i=0;i<n;i++){ g.clock=9999; g.update(0.05); } };
const ate=(g,st)=>{ let n=0; while(g.fiscal.st!==st && n<4000){ g.clock=9999; g.update(0.05); n++; } return g.fiscal.st===st; };
const vem=g=>{ g.elapsed=g.fiscal.t; return ate(g,'olha'); };

// ---------- 1. o sorteio: só na Avenida, do 2º dia no ponto, ~15%, e o mesmo ao rejogar ----------
{ let H=jogo('garagem',1,12); ok(sorteios(H,12,400)===0,'na Garagem o fiscal não vem (400 sorteios)');
  H=jogo('industrial',5,12); ok(sorteios(H,12,400)===0,'na área industrial também não');
  H=jogo('avenida',12,12); ok(sorteios(H,12,400)===0,'no 1º dia na Avenida (pontoDia = dia) ele não vem');
  H=jogo('avenida',10,12); const c=sorteios(H,12,400); ok(c>=36 && c<=86 && H.L.FISCAL.chance===0.15,'no 3º dia na Avenida: ~15% dos dias ('+c+' em 400)');
  const {g,L}=H; let guardado=null; for(let i=0;i<200 && !guardado;i++){ delete g.save.manut.sorteio; g.sortear(12); guardado=g.save.manut.sorteio.fiscal; }
  const f0=guardado.f; g.sortear(12); g.resetDay(12); const t0=g.fiscal.t; g.sortear(12); g.resetDay(12);
  ok(g.save.manut.sorteio.fiscal.f===f0 && g.fiscal && g.fiscal.t===t0 && Math.abs(t0-f0*g.day.time)<1e-9,'o mesmo sorteio ao rejogar o dia (a hora da visita não muda)');
  ok(f0>=L.FISCAL.quando[0] && f0<=L.FISCAL.quando[1],'a visita cai entre 30% e 70% do turno');
  g.resetDay(12,true); ok(g.fiscal===null,'na Missão zero ele não vem'); g.sortear(0); ok(!g.save.manut.sorteio,'no Turno sem fim (n = 0) não há sorteio'); }

// ---------- 2. o aviso na introdução ----------
{ const H=jogo('avenida',5,10), {g,els}=H; g.save.manut.sorteio={ d:10, clima:'', quebra:[], fiscal:{ f:0.5 } }; g.startDay(10);
  ok(g.state==='intro' && els['intro-manut'].textContent.indexOf('Dizem que a vigilância sanitária está rondando a Avenida.')>=0 && !/\d+ ?s|%/.test(H.L.FISCAL.aviso),'a introdução avisa, sem dizer a hora');
  g.save.manut.sorteio={ d:10, clima:'', quebra:[] }; g.startDay(10); ok(els['intro-manut'].textContent.indexOf('vigilância')<0,'sem fiscal no dia, sem aviso'); }

// ---------- 3. cada falha é detectada ----------
{ let H=aberto(0.4), {g,L}=H; g.dani.active=false;
  ok(g.fiscal && g.fiscal.st==='espera' && vem(g) && g.fiscal.resta>19,'o fiscal entra na hora marcada, anda até o salão e começa a olhar');
  const t=g.tables[0]; t.dirty=true; t.dirtyN=2; passo(g,150); ok(!g.fiscal.falhas.suja,'mesa suja há 7,5 s: ainda não é falha'); passo(g,25); ok(g.fiscal.falhas.suja,'mesa suja há mais de 8 s seguidos: falha');
  H=aberto(0.4); g=H.g; vem(g); g.tables[0].dirty=true; passo(g,100); g.tables[0].dirty=false; passo(g,10); g.tables[0].dirty=true; passo(g,100); ok(!g.fiscal.falhas.suja,'a mesa limpa no meio zera a conta (8 s seguidos)');
  H=aberto(0.4); g=H.g; vem(g); g.trash=3; passo(g,5); ok(!g.fiscal.falhas.lixo,'lixeira pela metade: sem falha'); g.trash=L.TRASH.cap; passo(g,2); ok(g.fiscal.falhas.lixo,'lixeira cheia: falha');
  H=aberto(0.4); g=H.g; vem(g); g.kitchen.sinkN=3; passo(g,5); ok(!g.fiscal.falhas.pia,'pia com 3 pilhas: sem falha'); g.kitchen.sinkN=4; passo(g,2); ok(g.fiscal.falhas.pia,'pia com 4 pilhas: falha'); }

// ---------- 4. 0, 1 e 2 falhas: selo, advertência e multa ----------
{ const visita=(prep)=>{ const H=aberto(0.4), {g}=H; g.dani.active=false; g.pontos=0; vem(g); prep(g); ate(g,'fim'); return H; };
  let H=visita(()=>{}), g=H.g;
  ok(g.fiscal.res==='aprovado' && g.aprovado && g.multaVig===0 && g.pontos===30 && g.seloOn,'0 falhas: Aprovado, selo e +30 pontos');
  H=visita(g=>{ g.trash=6; }); g=H.g; ok(g.fiscal.res==='advertencia' && !g.aprovado && g.multaVig===0 && g.fixo===g.contas+g.paid+g.paidDiv+g.conserto,'1 falha: advertência, sem multa e sem selo');
  H=visita(g=>{ g.trash=6; g.kitchen.sinkN=5; }); g=H.g; ok(g.fiscal.res==='multa' && g.multaVig===150 && g.fixo===g.contas+g.paid+g.paidDiv+g.conserto+150,'2 falhas: multa de R$ 150 nas contas do dia (entra no fixo e no lucro)');
  H=visita(g=>{ g.trash=6; g.kitchen.sinkN=5; g.tables[0].dirty=true; }); g=H.g; ok(g.fiscal.nFalhas===3 && g.fiscal.res==='multa' && g.multaVig===150,'3 falhas: também multa (uma só, R$ 150)');
  ok(g.fiscal.st==='fim' && !g.fiscal.ativo,'depois do resultado ele sai de volta para a rua'); }

// ---------- 5. fim do dia: multa nas contas e no livro-caixa; selo no save ----------
{ const fecha=(prep)=>{ const H=aberto(0.4), {g}=H; g.dani.active=false; vem(g); prep(g); ate(g,'fim'); g.money=400; g.custo=0; g.schedule=[]; g.nextIdx=0; const bank0=g.save.bank, contas=g.contas, paid=g.paid; g.finishDay(); return { H, g, bank0, contas, paid }; };
  let r=fecha(g=>{ g.trash=6; g.kitchen.sinkN=5; }), g=r.g, H=r.H, R=g.result;
  ok(R.multaVig===150 && R.vig.res==='multa' && R.money===400-r.contas-r.paid-150 && g.save.bank===r.bank0+400-r.contas-r.paid-150,'a multa sai do lucro e do dinheiro: −R$ 150');
  const lin=g.save.caixa[g.save.caixa.length-1]; ok(lin.vig===150 && lin.contas===r.contas+150,'o livro-caixa guarda a multa (vig) dentro das Contas');
  ok(/Multa da vigilância/.test(txt(H.els['end-stats'])) && /Vigilância/.test(txt(H.els['end-stats'])) && /lixeira cheia e pia lotada/.test(txt(H.els['end-stats'])),'o fim do dia mostra "Multa da vigilância" e as falhas');
  H.L.setShopTab('caixa'); ok(g.save.caixa.length>0,'o Caixa abre com a linha da multa');
  ok(!g.save.selo,'sem selo no save depois da multa');
  r=fecha(()=>{}); g=r.g; ok(g.save.selo===10+6 && r.g.result.vig.res==='aprovado' && g.result.multaVig===0,'aprovado: save.selo = último dia do selo (dia 10 + 6 = 16, 7 dias contando hoje)');
  ok(/Aprovado! Selo por 7 dias/.test(txt(r.H.els['end-stats'])),'o fim do dia anuncia o selo');
  r=fecha(g=>{ g.trash=6; }); ok(!r.g.save.selo && r.g.result.multaVig===0,'advertência: sem selo e sem multa');
  // dia sem fiscal: nenhuma linha nova
  const H2=aberto(null), g2=H2.g; g2.money=400; g2.schedule=[]; g2.nextIdx=0; g2.finishDay(); ok(g2.fiscal===null && g2.result.vig===null && !/Vigilância/.test(txt(H2.els['end-stats'])),'dia sem fiscal: sem linha de vigilância'); }

// ---------- 6. o selo soma +0,5 no Ambiente por 7 dias e some ----------
{ const H=aberto(null), {g,L}=H; g.dani.active=false; g.mode='carreira';
  const amb=()=>{ const q=new L.Group(g,'executiva',++g.gid,0,false); q.avalia=true; q.state='wantBill'; q.hearts=5; q.pratoQ=5; g.avals.length=0; g.avaliar(q,0,0); return g.avals[0].s[4]; };
  const dia=g.day; const em=n=>{ g.day=Object.assign({},dia,{ n }); };
  g.save.selo=0; em(10); const sem=amb();
  g.save.selo=16; em(10); ok(g.seloOn && Math.abs(amb()-sem-0.5)<0.01 && L.AVAL.amb.selo===0.5,'com o selo, a nota crua do Ambiente sobe 0,5');
  em(16); ok(g.seloOn,'no último dia do selo (16) ainda vale'); em(17); ok(!g.seloOn && Math.abs(amb()-sem)<0.01,'no dia 17 o selo acabou e o Ambiente volta');
  g.mode='semfim'; g.save.selo=99; ok(!g.seloOn,'no Turno sem fim o selo não conta');
  // o comentário do Gurugol no dia aprovado
  g.mode='carreira'; em(10); g.aprovado=true; let achou=false; for(let i=0;i<200 && !achou;i++){ amb(); achou=g.avals[0].txt===L.FISCAL.coment; }
  ok(achou && L.FISCAL.coment==='Vi o selo da vigilância: lugar limpinho!','no dia aprovado, alguém comenta "Vi o selo da vigilância: lugar limpinho!"');
  g.aprovado=false; let sem2=true; for(let i=0;i<200;i++){ amb(); if(g.avals[0].txt===L.FISCAL.coment) sem2=false; } ok(sem2,'sem o dia aprovado, ninguém comenta o selo'); }

// ---------- 7. o save: sem `selo` carrega; o sorteio guarda o fiscal ----------
{ const H=load({}), {L}=H;
  ok(L.normSave({}).selo===0 && L.normSave({ selo:16 }).selo===16 && L.normSave({ selo:'x' }).selo===0 && L.normSave({ selo:-3 }).selo===0,'save sem selo (ou com lixo) carrega com selo 0');
  const m=L.normManut({ sorteio:{ d:3, clima:'', quebra:[], fiscal:{ f:0.5 } } }); ok(m.sorteio.fiscal && m.sorteio.fiscal.f===0.5,'normManut guarda o fiscal do sorteio');
  ok(!L.normManut({ sorteio:{ d:3, clima:'', quebra:[] } }).sorteio.fiscal && L.normManut({ sorteio:{ d:3, clima:'', quebra:[], fiscal:{ f:'x' } } }).sorteio.fiscal===undefined,'sem fiscal (ou com lixo), nada é guardado');
  ok(L.normCaixa([{ d:3, vig:150, contas:170 }])[0].vig===150 && L.normCaixa([{ d:3 }])[0].vig===undefined,'normCaixa guarda vig'); }

// ---------- 8. o desenho: o fiscal, os ícones das falhas e o selo na parede ----------
{ const H=aberto(0.4), {g,L}=H; g.dani.active=false; let erro=''; try {
    L.render(g,H.ctx); vem(g); g.trash=6; g.kitchen.sinkN=5; g.tables[0].dirty=true; passo(g,200); L.render(g,H.ctx); g.aprovado=true; L.render(g,H.ctx); g.fiscal.st='entra'; g.fiscal.path=[{ x:300, y:300 }]; L.render(g,H.ctx);
  } catch(e){ erro=String(e); } ok(!erro,'o salão desenha o fiscal (entrando e olhando), os 3 ícones e o selo sem erro '+erro);
  const R=load({ rm:true }); const gg=R.g; let e2=''; try { gg.fiscal=new R.L.Fiscal(gg,0.4); gg.fiscal.st='olha'; gg.fiscal.falhas={ suja:true, lixo:true, pia:true }; R.L.render(gg,R.ctx); } catch(e){ e2=String(e); } ok(!e2,'com movimento reduzido também '+e2); }

console.log('smoke46: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
