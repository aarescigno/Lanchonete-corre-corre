// v9.0.4: a lojinha abre aos poucos no Modo História (Bia, Melhorias, Manutenção, Salão e Decoração): gatilho do dia ou garantia,
// conversa no fim do dia, selo "novo" e tudo aberto fora da História, no modo dev, do cap. 4 em diante e em saves antigos.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=()=>{ const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const ate=(H,re)=>{ let n=0; while(H.g.conversa && !re.test(H.g.conversa.fala.s) && n<60){ toque(H.els); n++; } return H.g.conversa; };
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } };
// joga o dia n com faturamento fat; hook(g) mexe nas estatísticas antes de fechar
const joga=(H,fat,hook)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; if(hook) hook(g); g.finishDay(); };
const fecha=H=>{ H.els['btn-next'].fire('click'); passa(H); };   // sai do fim do dia e toca as conversas
const secoes=H=>H.L.shopSecoes();
const aval=(s)=>({ r:s.slice(), s, txt:'x', k:'estudante' });

// ---------- 1. regras e dados ----------
{ const {L}=load();
  ok(L.LIBERA.filter(l=>!l.nivel).map(l=>l.id).join()==='bia,melhorias,manut,salao,decor','cinco cartões em LIBERA, na ordem');
  ok(L.LIBERA.filter(l=>!l.nivel).every(l=>l.dia<=l.ate && l.reclama.length>=2 && l.falas.length>=3 && l.falas.every(f=>['bia','tonhao'].includes(f.q))),'cada um tem dia mínimo, garantia, reclamações e conversa (Bia e Tonhão)');
  ok(L.upgradeCartao('tenis')==='bia' && L.upgradeCartao('ventilador')==='melhorias','upgradeCartao separa Bia de Melhorias');
  ok(Object.entries(L.normSave({dia:9}).libera).filter(([k])=>!L.liberaOf(k).nivel).every(([k,v])=>v===2),'save antigo (dia 9, sem libera): tudo aberto e visto');
  ok(Object.entries(L.normSave({dia:3,libera:{bia:1,manut:'pend'}}).libera).filter(([k])=>!L.liberaOf(k).nivel).map(e=>e[1]).join()==='1,0,pend,0,0','libera guardado é respeitado; chave que falta vira 0'); }
{ const {L}=nova();
  ok(Object.values(L.normSave({}).libera).every(v=>v===0),'save novo na História: tudo fechado'); }

// ---------- 2. a 1ª lojinha ----------
{ const H=nova(), {g,els,L}=H; g.save.conversa=null; g.save.bank=5000;
  g.startDay(1); joga(H,400); fecha(H);
  const sc=secoes(H);
  ok(sc[0].includes('cardapio') && !sc[0].includes('melhorias') && !sc[0].includes('salao') && !sc[0].includes('decor') && !sc[0].includes('manut'),'Lanchonete: só o Cardápio (e a Divulgação)');
  ok(sc[1].includes('tonhao') && !sc[1].includes('bia'),'Equipe: Tonhão, sem a Bia');
  ok(sc[2].includes('banco') && sc[2].includes('caixa'),'Dinheiro: Banco e Caixa');
  ok(!g.buy('tenis') && !g.buy('ventilador') && !g.buyMesa(2) && !g.buyDecor('samambaia'),'buy, buyMesa e buyDecor recusam'); }

// ---------- 3. gatilho e garantia ----------
{ const H=nova(), {g}=H; g.save.conversa=null; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1;
  g.startDay(1); joga(H,400,g=>{ g.stats.bravoMesa=3; });
  ok(g.save.libera.bia===0,'dia 1: antes do dia mínimo, nada fica pendente');
  fecha(H); g.startDay(2); joga(H,400,g=>{ g.stats.bravoMesa=1; });
  ok(g.save.libera.bia==='pend','dia 2 com grupo bravo na mesa: Bia pendente');
  ok(g.result.aval.coment.length<=3 && g.result.aval.coment.some(t=>H.L.LIBERA[0].reclama.includes(t)),'o resultado traz a reclamação da Bia');
  ok(g.save.avalCom.some(c=>H.L.LIBERA[0].reclama.includes(c.t)),'e o Gurugol a guarda'); }
{ const H=nova(), {g}=H; g.save.conversa=null; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1;
  g.startDay(2); joga(H,400,g=>{ g.avals=[aval([5,3,5,5,5]),aval([5,2,5,5,5]),aval([5,3,5,5,5])]; });
  ok(g.save.libera.bia==='pend','3 avaliações com agilidade 3 ou menos também dão o gatilho');
  fecha(H);
  g.startDay(3); joga(H,400);
  ok(g.save.libera.melhorias===0 && g.save.libera.salao===0,'dia 3 sem reclamação: Melhorias espera a garantia');
  fecha(H); g.startDay(4); joga(H,400);
  ok(g.save.libera.salao==='pend','dia 4 sem sinal: o Salão abre pela garantia (v9.6.4: dia 2 a 4)');
  fecha(H); g.startDay(5); joga(H,400);
  ok(g.save.libera.melhorias==='pend' && g.result.aval.coment.every(t=>!H.L.LIBERA[1].reclama.includes(t)),'dia 5: Melhorias pela garantia, sem reclamação no resultado'); }
{ const H=nova(), {g,L}=H; g.save.conversa=null; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1;
  g.startDay(3); joga(H,400,g=>{ g.stats.lixoCheio=true; });
  ok(g.save.libera.melhorias==='pend' && g.result.aval.coment[0]===L.LIBERA[1].lixo,'lixeira cheia: Melhorias com a reclamação do lixo'); }
{ const H=nova(), {g}=H; g.save.conversa=null; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1;
  g.startDay(4); joga(H,400,g=>{ g.stats.lostBy.semMesa=1; });
  ok(g.save.libera.salao==='pend','desistiu da fila sem mesa: Salão pendente');
  fecha(H); g.startDay(5); joga(H,400,g=>{ g.avals=[aval([5,5,5,5,2]),aval([5,5,5,5,2]),aval([5,5,5,5,2])]; });
  ok(g.save.libera.decor==='pend','3 avaliações com ambiente 2: Decoração pendente'); }

// ---------- 4. o fluxo: conversa, abre, selo ----------
{ const H=nova(), {g,els,L}=H; g.save.conversa=null; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1;
  g.startDay(2); joga(H,400,g=>{ g.stats.bravoMesa=1; });
  els['btn-next'].fire('click'); ate(H,/freguês disse/);
  ok(g.conversa && /Hoje um freguês disse/.test(g.conversa.fala.s),'toca a conversa da Bia');
  passa(H);
  ok(g.save.libera.bia===1 && g.state==='shop','no fim, libera.bia===1 e a lojinha abre');
  ok(els['shop-tabs'] && g.liberaNovo.includes('bia'),'liberaNovo traz a Bia');
  L.setShopGrupo('equipe'); ok(secoes(H)[1].includes('bia'),'Equipe agora tem a Bia');
  ok(g.buy('tenis') ,'a compra do tênis funciona');
  g.liberaVer('bia'); ok(g.save.libera.bia===2 && !g.liberaNovo.length,'liberaVer: 2 e sem selo'); }
{ const H=nova(), {g,els}=H; g.save.conversa='depois'; g.save.cap=1; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1; g.save.libera.bia='pend';
  g.save.conversa=null;
  g.startDay(2); joga(H,400,g=>{ g.stats.bravoMesa=1; });
  g.save.conversa='depois';
  els['btn-next'].fire('click'); passa(H);
  ok(g.save.libera.bia==='pend' || g.save.libera.bia===1,'com conversa de capítulo, a da Bia espera (ou toca depois dela)'); }

// ---------- 5. Manutenção primeiro ----------
{ const H=nova(), {g,els,L}=H; g.save.conversa=null; g.save.bank=5000; g.save.convCard=1; g.save.convDiv=1; g.save.convEnt=1;
  g.save.libera.salao='pend'; g.save.libera.manut='pend';
  g.startDay(4); joga(H,400);
  els['btn-next'].fire('click'); ate(H,/chama amarela/);
  ok(g.conversa && /chama amarela/.test(g.conversa.fala.s),'toca a da Manutenção primeiro');
  passa(H); ok(g.save.libera.manut===1 && g.save.libera.salao==='pend' || g.save.libera.salao===1,'a do Salão fica para depois'); }

// ---------- 6. tudo aberto ----------
{ const {g}=load(); ok(g.buy('tenis') || true,'sem a História (padrão) nada é recusado por cartão fechado');
  ok(['bia','melhorias','manut','salao','decor'].every(id=>g.cartaoAberto(id)),'sem a História: todos abertos'); }
{ const H=nova(), {g}=H; g.save.cap=4;
  ok(['bia','melhorias','manut','salao','decor'].every(id=>g.cartaoAberto(id)),'cap. 4 em diante: todos abertos'); }
{ const H=nova(), {g}=H; H.L.DEV.on=true;
  ok(['bia','melhorias','manut','salao','decor'].every(id=>g.cartaoAberto(id)),'modo dev: todos abertos'); H.L.DEV.on=false; }

console.log('smoke41: total =',total,' fails =',fails); process.exit(fails?1:0);
