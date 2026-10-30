// v8.7, etapa 2f: a campanha vira o Modo História. Save novo com a reforma da garagem (R$ 1.000, 1ª parcela no fim do dia 2),
// conversas em balões (toque passa, Pular fecha), capítulos 1 a 3 com objetivo, a Dani entra de graça no cap. 2 e o cartão
// "Continua na próxima versão". Os testes antigos rodam sem a História (harness: window.__semHist); aqui, load({historia:true}).
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const mostra=(els,id)=>els[id].classList.contains('show');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const nova=(o,store)=>{ const H=load(Object.assign({historia:true},o||{},store?{store}:{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const html=fs.readFileSync(__dirname+'/../lanchonete.html','utf8');
// joga o dia que estiver aberto (lojinha ou introdução), com o faturamento pedido
const joga=(H,fat,custo)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; g.finishDay(); };
// passa a conversa em andamento com toques; devolve quantas falas teve
const passa=H=>{ let n=0; while(H.g.conversa && n<20){ toque(H.els); n++; } return n; };
const notaDe=(g,v,n)=>{ g.save.aval=Array(n||10).fill([v,v,v,v,v]); };

// ---------- 1. save novo: a reforma ----------
{ const H=nova(), {g,L,els}=H, sv=g.save, e=sv.emp;
  ok(sv.histV===1 && sv.cap===1 && sv.conversa==='antes' && sv.capAzul===0 && sv.capDia===1,'save novo: capítulo 1, conversa de antes pendente');
  ok(e.resto===1000 && e.amort===100 && e.j===0.01 && e.ini===2 && e.ref===true && e.n===10,'a reforma: R$ 1.000, 10 parcelas de R$ 100, 1% ao dia, a partir do dia 2');
  ok(L.REFORMA.valor===1000 && L.carencia(e,1) && !L.carencia(e,2) && L.parcelaDe(e,1)===0 && L.parcelaDe(e,2)===110 && L.jurosDe(e,1)===0 && L.jurosDe(e,2)===10,'dia 1 sem parcela nem juros; dia 2: R$ 100 + R$ 10 de juros');
  ok(sv.equipe.dani===0 && L.STAFF.dani.levels.length===5 && L.STAFF.dani.levels[1].pay===0 && [2,3,4].map(i=>L.STAFF.dani.levels[i].pay).join()==='15,20,25','a Dani só chega no cap. 2; níveis: aprendiz (R$ 0) e aumentos de R$ 15, 20 e 25');
  sv.conversa=null; sv.bank=5000;
  g.startDay(1); ok(/Capítulo 1, A garagem da Rosa: Fechar 2 dias no azul \(0 de 2\)/.test(els['intro-manut'].textContent) && /só vence no fim do dia 2/.test(els['intro-manut'].textContent),'a introdução do dia 1 traz o objetivo e a carência da reforma');
  joga(H,200,0); ok(g.result.par===0 && g.save.emp.resto===1000 && g.save.bank===5000+200-g.contas-g.paid,'fim do dia 1: nenhuma parcela, a dívida segue em R$ 1.000');
  g.startDay(2); joga(H,400,0); ok(g.result.par===110 && g.save.emp.resto===900 && !g.save.emp.atr,'fim do dia 2: R$ 100 + R$ 10 de juros, saldo R$ 900');
  g.startDay(3); joga(H,400,0); ok(g.result.par===109 && g.save.emp.resto===800,'dia 3: juros de 1% sobre R$ 900 (R$ 9), saldo R$ 800');
  ok(!g.podeEmprestar(200),'com a reforma, não dá para pegar outro empréstimo');
  g.save.bank=5000; ok(g.quitar() && g.save.emp.resto===0 && g.podeEmprestar(200),'quitada a reforma, o banco empresta de novo'); }

// ---------- 2. a 1ª vez: abertura -> Missão zero -> conversa do cap. 1 -> dia 1 ----------
{ const H=nova({abertura:true}), {g,L,els}=H, ab=L.aberturaAtual();
  ok(ab && ab.origem==='auto' && g.save.cap===1 && !g.save.treino,'1ª vez: a abertura toca sozinha');
  ab.pular();
  ok(!L.aberturaAtual() && g.mode==='treino' && g.state==='playing','o fim da abertura vai à Missão zero');
  g.acabouTreino(); ok(g.state==='treinoend' && g.save.treino===true,'Missão zero completa');
  els['btn-treino-dia1'].fire('click');
  ok(g.conversa && mostra(els,'ov-conversa') && !mostra(els,'ov-treino') && g.state==='treinoend','"Começar o dia 1" toca antes a conversa do cap. 1');
  ok(/Tonhão/.test(els['conv-live'].textContent),'o leitor de tela recebe a fala');
  ok(passa(H)===3 && !g.conversa && g.state==='intro' && g.day.n===1 && g.save.conversa===null,'3 toques passam as 3 falas, gravam conversa:null e abrem o dia 1');
  ok(!mostra(els,'ov-conversa'),'o painel da conversa fecha'); }
{ // com a Missão zero já feita, a abertura leva direto à conversa
  const H=nova({abertura:true},{lcc2_save:JSON.stringify({cardV:1,treino:true})}), {g,L}=H;
  L.aberturaAtual().pular();
  ok(!L.aberturaAtual() && g.conversa && g.save.treino===true && g.save.cap===1,'com a Missão zero feita, a abertura vai direto à conversa do cap. 1'); }
{ // Ver abertura (menu): volta ao menu
  const H=nova(), {g,L,els}=H; els['btn-historia'].fire('click');
  ok(L.aberturaAtual() && L.aberturaAtual().origem==='menu','Ver abertura toca a abertura');
  els['btn-ab-pular'].fire('click'); ok(!L.aberturaAtual() && g.state==='menu' && mostra(els,'ov-menu') && !g.conversa,'e termina no menu, sem conversa');
  ok(/id="btn-historia">Ver abertura</.test(html) && /data-v="carreira" aria-pressed="true">História</.test(html) && !/ov-historia/.test(html),'o botão do menu e o seletor do ranking dizem História / Ver abertura; o cartão "Em breve" saiu'); }

// ---------- 3. Pular, Continuar e o desenho ----------
{ const H=nova(), {g,L,els}=H;
  els['btn-play'].fire('click'); ok(g.conversa && g.conversa.i===0,'Continuar toca a conversa de antes do dia 1');
  toque(els); ok(g.conversa.i===1,'o toque passa a fala');
  els['btn-conv-pular'].fire('click'); ok(!g.conversa && g.save.conversa===null && g.state==='intro','Pular fecha a conversa e segue ao dia 1');
  // desenha todas as falas, com e sem a Dani em campo
  let erro=null; try{ L.HISTORIA.forEach(c=>['antes','depois'].forEach(t=>{ const cv=new L.Conversa(c[t],null,false); for(let i=0;i<c[t].length;i++){ cv.i=i; g.conversa=cv; L.render(g,H.ctx); L.drawConversa(H.ctx,g,cv); } })); g.conversa=null; }catch(e){ erro=e; }
  ok(!erro,'desenha as '+L.HISTORIA.reduce((a,c)=>a+c.antes.length+c.depois.length,0)+' falas'+(erro?': '+erro.message:''));
  const cv=new L.Conversa(L.HISTORIA[2].depois,null,true); cv.i=1; ok(/cominho/.test(cv.fala.nota) && /Tonhão: cheirando o pote de cominho/.test(cv.texto()) && cv.entra===1,'a rubrica do Tonhão (cap. 3) vai no texto; com movimento reduzido o balão entra direto'); }

// ---------- 4. cap. 1: dois dias no azul (não precisam ser seguidos) ----------
const H=nova(), {g,L,els}=H;
els['btn-play'].fire('click'); passa(H); g.save.bank=5000;
joga(H,0,0); ok(g.result.money<0 && g.save.capAzul===0 && g.result.cap && !g.result.cap.ok && g.save.conversa===null,'dia no vermelho não conta para o cap. 1');
ok(/Capítulo 1, A garagem da Rosa: Fechar 2 dias no azul \(0 de 2\)/.test(els['end-msg'].textContent),'o fim do dia mostra o objetivo (0 de 2)');
els['btn-next'].fire('click'); ok(g.state==='shop' && !g.conversa,'sem conversa pendente, a lojinha abre direto');
joga(H,400,0); ok(g.save.capAzul===1 && g.save.cap===1 && g.save.conversa===null && /\(1 de 2\)/.test(els['end-msg'].textContent),'1 dia no azul: o capítulo continua (1 de 2)');
els['btn-next'].fire('click'); L.setShopTab('dani'); ok(/Chega no capítulo 2/.test(txt(els['shop-grid'])),'antes do cap. 2, o card da Dani diz "Chega no capítulo 2"');
joga(H,400,0); ok(g.save.capAzul===2 && g.save.conversa==='depois' && g.result.cap.ok && /Objetivo cumprido/.test(els['end-msg'].textContent) && g.save.cap===1,'2 dias no azul: objetivo cumprido, conversa de depois pendente');
// ---------- 5. do fim do cap. 1 ao cap. 2: depois, antes e a Dani chega ----------
els['btn-next'].fire('click');
ok(g.conversa && g.conversa.falas===L.HISTORIA[0].depois && g.save.cap===1,'Lojinha e dia: toca antes a conversa de depois do cap. 1');
toque(els); toque(els);
ok(g.conversa && g.conversa.falas===L.HISTORIA[1].antes && g.save.cap===2 && g.save.equipe.dani===1 && g.save.capDia===g.save.dia && g.save.capAzul===0,'acabou, o cap. 2 começa e a conversa de antes dele toca em seguida');
ok(g.dani.active && L.payroll(g.save.equipe)===0,'a Dani chega de graça: aprendiz, folha R$ 0');
passa(H); ok(!g.conversa && g.state==='shop' && g.save.conversa===null,'depois das conversas, a lojinha');
L.setShopGrupo('equipe'); L.setShopTab('dani'); ok(/aprendiz \(sem salário\)/.test(txt(els['shop-grid'])) && /Aumento: \+R\$ 15\/dia/.test(txt(els['shop-grid'])) && !/Dispensar/.test(txt(els['shop-grid'])),'o card da Dani: aprendiz sem salário, aumento de R$ 25/dia, sem Dispensar');
ok(!g.setStaff('dani',2),'v8.9: sem experiência o aumento da Dani é recusado'); g.save.daniTar=4*L.DANI_XP.tarefas; ok(g.setStaff('dani',2) && L.payroll(g.save.equipe)===15 && g.save.equipe.dani===2,'o aumento custa R$ 15/dia');
ok(!g.setStaff('dani',1) && g.save.equipe.dani===2,'v8.9: o nível pago é definitivo (sem "Reduzir")'); g.save.equipe.dani=1; g.save.daniTar=0;   // volta a aprendiz para o resto do teste
{ const eq={tonhao:0,dani:3,tv:false,som:false,couvert:false}; ok(L.folhaCortes(eq,null,10).join()==='aumento da Dani,aumento da Dani' && eq.dani===3,'sem dinheiro, a folha corta os aumentos da Dani (volta a aprendiz), nunca ela'); }
// ---------- 6. cap. 2: nota do Gurugol 2,4 ----------
g.save.bank=5000; notaDe(g,2.3);
joga(H,400,0); ok(g.result.cap.n===2 && !g.result.cap.ok && g.save.conversa===null && /Nota do Gurugol 2,4 \(agora 2,3\)/.test(els['end-msg'].textContent),'nota 2,3: o cap. 2 continua');
els['btn-next'].fire('click'); joga(H,400,0); ok(g.save.cap===2 && g.save.conversa===null,'e continua, dia após dia, sem prazo');
notaDe(g,2.4); joga(H,400,0); ok(g.result.cap.ok && g.save.conversa==='depois' && /Objetivo cumprido/.test(els['end-msg'].textContent),'nota 2,4: objetivo cumprido');
els['btn-next'].fire('click'); passa(H);
ok(g.save.cap===3 && g.state==='shop' && g.save.equipe.dani===1,'depois das conversas, o cap. 3 começa e a lojinha abre');
// ---------- 7. cap. 3: quitar + nota 2,7 + R$ 800, tudo junto ----------
const cap3=(resto,nota,bank)=>{ g.save.emp=resto?L.normEmprestimo({resto,amort:100,j:0.01}):{resto:0,n:0}; g.save.bank=bank; notaDe(g,nota); g.save.conversa=null; g.save.neg=0; if(g.state==='shop') els['btn-shop-go'].fire('click'); joga(H,0,0); return g.result.cap; };
{ let c=cap3(300,2.8,5000); ok(c.n===3 && !c.ok && c.itens.length===3 && !c.itens[0].ok && c.itens[1].ok && c.itens[2].ok,'cap. 3 com dívida ainda: não cumpre (falta quitar)');
  c=cap3(0,2.6,5000); ok(!c.ok && c.itens[0].ok && !c.itens[1].ok && c.itens[2].ok,'sem dívida e com caixa, mas nota 2,6: não cumpre');
  c=cap3(0,2.8,500); ok(!c.ok && c.itens[0].ok && c.itens[1].ok && !c.itens[2].ok,'sem dívida e com nota, mas só R$ 500: não cumpre');
  ok(c.itens.map(i=>i.txt).join(' · ')==='Reforma quitada · nota do Gurugol 2,7 (agora 2,8) · R$ 800 no caixa (agora R$ '+g.save.bank+')','os itens do cap. 3 na linha: ✓ quando cumpridos');
  c=cap3(0,2.8,5000); ok(c.ok && g.save.conversa==='depois' && /Objetivo cumprido/.test(els['end-msg'].textContent),'os 3 juntos: objetivo cumprido'); }
els['btn-next'].fire('click');
ok(g.conversa && g.conversa.falas===L.HISTORIA[2].depois,'toca a conversa de depois do cap. 3');
passa(H);
ok(g.save.cap===4 && g.save.conversa===null && mostra(els,'ov-continua') && !g.conversa && /próxima versão/.test(html) && /Fim dos capítulos da Garagem/.test(html),'depois dela, o cartão "Continua na próxima versão" (cap. 4, Garagem completa)');
els['btn-continua'].fire('click'); ok(g.state==='shop' && !mostra(els,'ov-continua'),'Seguir jogando abre a lojinha');
els['btn-shop-go'].fire('click'); ok(g.capLinha()==='' && !/Capítulo/.test(els['intro-manut'].textContent),'o dia seguinte não tem objetivo');
joga(H,400,0); ok(g.result.cap===null && g.save.conversa===null && !/Capítulo/.test(els['end-msg'].textContent),'nem o fim do dia');
g.setState('menu'); ok(/História · Garagem completa · dia \d+/.test(els['menu-dia'].textContent),'o menu diz "Garagem completa"');

// ---------- 8. menu ----------
{ const H=nova(), {g,L,els}=H;
  ok(els['menu-dia'].textContent==='História' && /Começar o dia 1/.test(els['btn-play'].textContent),'jogador novo: "História" e "Começar o dia 1"');
  g.save.dia=5; g.save.cap=2; g.save.caixa=[{d:4,fat:0,ingr:0,contas:0,folha:0,div:0,lucro:0,meta:0,ok:false,perd:0,mel:0,sal:0,man:0,saldo:0}]; g.setState('menu');
  ok(els['menu-dia'].textContent==='História · cap. 2, A Dani chega · dia 5','no meio: "História · cap. 2, A Dani chega · dia 5"');
  g.save.fechou=4; g.setState('menu'); ok(els['menu-dia'].textContent==='História: o banco fechou no dia 4','banco fechou: "História: o banco fechou no dia 4"'); }

// ---------- 9. save antigo e a reforma atrasada ----------
{ const antigo=JSON.stringify({cardV:1,treino:true,dia:6,bank:900,lucroTot:300,estrelas:5});
  const H=nova({saveAntigo:true},{lcc2_save:antigo}), {g,L,els,store}=H;
  ok(g.save.dia===1 && g.save.treino===true && g.save.cap===1 && g.save.emp.resto===1000 && g.save.avisoHist===true && g.save.bank===0,'save da v8.6.13 (sem histV) recomeça do dia 1, mantém a Missão zero e liga o aviso');
  ok(els['menu-aviso'].style.display==='' && /Modo História/.test(els['menu-aviso-txt'].textContent) && JSON.parse(store.lcc2_save).histV===1,'o menu avisa e o save novo já fica gravado');
  els['btn-aviso'].fire('click'); ok(g.save.avisoHist===false && els['menu-aviso'].style.display==='none','"Entendi" fecha o aviso'); }
{ const H=nova({},{lcc2_save:JSON.stringify({cardV:1,histV:1,cap:2,capDia:4,capAzul:0,conversa:null,dia:6,bank:900})});
  ok(H.g.save.dia===6 && H.g.save.cap===2 && H.g.save.capDia===4 && H.g.save.avisoHist===false && H.g.save.emp.resto===0,'save com histV segue como veio (sem aviso, sem reforma nova)'); }
{ const H=nova({},{lcc2_save:JSON.stringify({cardV:1,histV:1,cap:2,conversa:'depois',dia:2})});
  ok(H.g.save.conversa==='depois','a conversa pendente fica no save'); }
{ const H=nova(), {g,L,els}=H; g.save.conversa=null; g.save.bank=0;
  g.startDay(1); joga(H,0,0); ok(!g.save.emp.atr && g.state==='dayend','dia 1 sem dinheiro: sem parcela, sem atraso');
  g.startDay(2); joga(H,0,0); ok(g.save.emp.atr===true && g.result.atrasou && g.state==='dayend','dia 2 sem dinheiro: a parcela da reforma atrasa');
  g.startDay(3); joga(H,0,0); ok(g.state==='falencia' && g.save.fechou===3 && mostra(els,'ov-falencia'),'atrasou 2 dias: o banco toma a lanchonete (como na v8.3.1)'); }
// o modo dev e os testes antigos ficam fora da História
{ const H=load({store:{lcc2_dev:'1'}}); ok(H.g.save.cap===4 && H.g.save.conversa===null && H.g.save.emp.resto===0,'modo dev: sem História nem reforma'); }
{ const H=load(); ok(H.g.save.cap===4 && H.g.save.emp.resto===0 && H.L.HIST.on===false,'harness padrão (testes antigos): sem História'); }

console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
