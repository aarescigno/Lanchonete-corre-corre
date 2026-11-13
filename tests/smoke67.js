// v10.5, etapa S: salários de verdade (as diárias da equipe e da música a ~80% do custo real, a carreira da Dani e do Joca, o cardápio × 1,2).
// CA1 as diárias e a folha da Garagem; CA1b a diária do degrau mais alto (cursos da Dani e do Joca) e "Aumento: sem custo"; CA2 sem dinheiro, o Tonhão 0 e a Dani 1 ficam;
// CA3 os textos da folha e da lojinha; CA4 os preços do cardápio; CA5 as fichas e-tonhao e l-musica; CA6 o save da v10.4.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(ponto,sv,cap)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap:cap||8, dia:10, maxDay:10, bank:9000, v10:1, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };

// ---------- 1. as diárias ----------
{ const {L}=nova(), S=L.STAFF;
  ok(S.tonhao.levels.map(l=>l.pay).join()==='50,65,80,100,120','Tonhão: 50 · 65 · 80 · 100 · 120 (a diária inteira do nível)');
  ok(S.dani.levels.slice(1).map(l=>l.pay).join()==='15,25,32,40','Dani: 15 (ajuda de custo) · 25 · 32 · 40');
  ok(S.joca.levels.slice(2).map(l=>l.pay).join()==='65,78,90','Joca: 65 · 78 · 90');
  ok(S.cami.levels.slice(1).map(l=>l.pay).join()==='95,115,135,160','Cami: 95 · 115 · 135 · 160');
  ok(S.anselmo.levels.slice(2).map(l=>l.pay).join()==='105,150','Anselmo: 105 · 150');
  ok(S.lia.pay===80,'Lia: 80 (não muda)');
  ok(S.couvert.pay===200 && S.couvert.fee===8,'couvert: R$ 200 por dia e taxa de R$ 8 por cliente');
  const M=L.TERRACO.musica;
  ok(M[0]===null && M[1].nome==='Trio de cordas' && M[1].pay===500 && M[1].effect===0.35 && M[1].amb===1,'música 1: Trio de cordas, R$ 500, 35% de paciência, +1 no Ambiente');
  ok(M[2].nome==='Pianista' && M[2].pay===300 && M[2].piano===5 && M[2].effect===0.25 && M[2].amb===1.5,'música 2: Pianista, R$ 300 + R$ 5 de afinação, 25% de paciência, +1,5 no Ambiente');
  ok(L.payroll({ tonhao:4, dani:4, tv:true, som:true })===165,'a folha completa da Garagem (Tonhão 4, Dani 4, TV e som) dá R$ 165');
  ok(L.payroll({ tonhao:0, dani:1 })===65,'e a de quem começa (Tonhão 0, Dani 1) é R$ 65');
  const b=L.payroll({ tonhao:1, dani:1, musica:0 }); ok(L.payroll({ tonhao:1, dani:1, musica:1 })-b===500 && L.payroll({ tonhao:1, dani:1, musica:2 })-b===305,'a música soma 500 (trio) e 300 + 5 (pianista)'); }

// ---------- 1b. a diária do degrau mais alto ----------
{ const {L}=nova();
  ok(L.diariaDani({ dani:4 },{})===40 && L.diariaDani({ dani:4 },undefined)===40,'Dani no nível 4 sem curso: 40');
  ok(L.diariaDani({ dani:4 },{ confCaseira:1 })===75 && L.diariaDani({ dani:4 },{ confCaseira:1, confGourmet:1 })===105 && L.diariaDani({ dani:4 },{ confCaseira:1, confGourmet:1, confAlta:1 })===145,'com Confeitaria caseira 75, gourmet 105, alta 145');
  ok(L.diariaDani({ dani:4 },{ atend:1, cozinha:1 })===40,'os cursos de atendimento da Dani não mudam a diária');
  ok(L.diariaDani({ dani:0 },{ confAlta:1 })===0,'sem a Dani na equipe, nada');
  ok(L.diariaJoca({ joca:4 },{})===90 && L.diariaJoca({ joca:4 },{ espresso:1 })===100 && L.diariaJoca({ joca:4 },{ espresso:1, cafesEsp:1 })===125,'Joca no nível 4: 90; com espresso 100; com cafés especiais 125');
  ok(L.diariaJoca({ joca:4 },{ atend:1, cozinha:1 })===90,'os cursos de atendimento do Joca não mudam a diária');
  ok(L.payroll({ tonhao:2, dani:4, joca:4 },{ dani:{ confGourmet:1 }, joca:{ espresso:1 } })===80+105+100,'o payroll soma o degrau do curso (2º parâmetro)');
  ok(L.payroll({ tonhao:2, dani:4, joca:4, jocaFora:true },{ dani:{}, joca:{ espresso:1 } })===80+40,'e o Joca que não vem não entra');
  // a folha cortada: o aumento que não baixa a diária não é cortado
  const eq={ tonhao:0, dani:3, joca:3, jocaFora:false }, cp={ dani:{ confCaseira:1 }, joca:{ espresso:1 } };
  const e1=Object.assign({},eq); ok(L.folhaCorta(e1,cp)==='o Joca (sem salário hoje)' && e1.dani===3 && e1.joca===3,'com os cursos feitos, sai o Joca inteiro e não o aumento dele nem o da Dani');
  const e2={ tonhao:0, dani:3, joca:3, jocaFora:false }; ok(L.folhaCorta(e2,{ dani:{}, joca:{} })==='aumento do Joca' && e2.joca===2,'sem curso, o aumento do Joca sai primeiro');
  const e3={ tonhao:0, dani:3 }; ok(L.folhaCorta(e3,{ dani:{ confCaseira:1 } })===null && e3.dani===3,'a Dani no degrau do curso não perde nível');
  const e4={ tonhao:0, dani:3 }; ok(L.folhaCorta(e4,{ dani:{} })==='aumento da Dani' && e4.dani===2,'sem curso, a Dani perde 1 nível');
  // o botão de aumento
  const H=jogo('avenida',{ cap:8, equipe:{ tonhao:2, dani:2 }, daniCursos:{ confCaseira:1 }, daniTar:100 },7); const t=loja(H,'equipe','dani');
  ok(/Aumento: sem custo/.test(t),'com a Dani no nível 2 e a caseira feita, o botão diz "Aumento: sem custo"');
  const H2=jogo('avenida',{ cap:8, equipe:{ tonhao:2, dani:2 }, daniTar:100 },7); const t2=loja(H2,'equipe','dani');
  ok(/Aumento: \+R\$ 7\/dia/.test(t2),'sem curso, o botão diz o aumento de 25 para 32 (+R$ 7/dia)');
  const g=H.g, b=g.payroll(); ok(g.setStaff('dani',3) && g.payroll()===b,'e subir sem custo não muda a folha');
  const H3=jogo('avenida',{ cap:8, equipe:{ tonhao:2, dani:3, joca:3 }, jocaCursos:{ espresso:1 }, jocaTar:100, libera:{ joca:1, cami:1 } },7); const t3=loja(H3,'equipe','joca');
  ok(/Aumento: sem custo/.test(t3),'o Joca no nível 3 com o espresso feito (100): "Aumento: sem custo" para o nível 4');
  ok(H3.g.payroll()===H3.L.payroll({ tonhao:2, dani:3, joca:3 },{ joca:{ espresso:1 } }) && H3.g.payroll()===80+32+100,'e a folha do jogo usa o degrau do curso do Joca'); }

// ---------- 2. sem dinheiro, a base do Tonhão e da Dani fica ----------
{ const L=nova().L, eq={ tonhao:0, dani:1 };
  ok(L.folhaCortes(eq,null,0).length===0 && L.folhaCorta(Object.assign({},eq))===null,'folhaCortes com caixa 0: o Tonhão no nível 0 e a Dani no 1 não saem');
  const eq2={ tonhao:2, dani:3, tv:true, som:true }; const c=L.folhaCortes(eq2,null,0); ok(c.join()==='som,TV,aumento da Dani,aumento do Tonhão' || /^som,TV,/.test(c.join()),'com os de cima, só saem os aumentos (cortes: '+c.join(', ')+')');
  const e=Object.assign({},eq2); let n; while((n=L.folhaCorta(e))); ok(e.tonhao===0 && e.dani===1 && !e.tv && !e.som,'no fim da folha cortada, ficam o Tonhão 0 e a Dani 1');
  const H=jogo('garagem',{ cap:8, bank:0, equipe:{ tonhao:0, dani:1 } },2), {g}=H; g.save.corta=true; g.save.bank=0;
  g.startDay(10); g.payDay();
  ok(g.aberto && g.paid===65 && g.unpaid.length===0 && g.save.equipe.tonhao===0 && g.save.equipe.dani===1,'o dia abre sem dinheiro com a folha deles reservada (R$ '+g.paid+') e ninguém cortado'); }

// ---------- 3. os textos da folha e da lojinha ----------
{ const L=nova().L;
  ok(L.folhaItens({ tonhao:0, dani:0 }).join()==='Tonhão','folhaItens: o Tonhão sempre ("Tonhão", não "aumento do Tonhão")');
  ok(L.folhaItens({ tonhao:2, dani:1 }).join()==='Tonhão,Dani' && L.folhaItens({ tonhao:3, dani:3, joca:2 }).join()==='Tonhão,Dani,Joca','"Dani" entra sempre que ela está na equipe');
  ok(L.folhaItens({ tonhao:1, dani:1, musica:1 }).indexOf('trio de cordas')>=0 && L.folhaItens({ tonhao:1, dani:1, musica:2 }).indexOf('pianista e afinação')>=0,'a folha diz "trio de cordas" e "pianista e afinação"'); }
{ const H=jogo('garagem',{ cap:8, equipe:{ tonhao:0, dani:1 } },2); const t=loja(H,'equipe','dani');
  ok(/aprendiz \(R\$ 15\/dia\)/.test(t) && !/sem salário/.test(t),'o cartão da Dani no nível 1 diz "aprendiz (R$ 15/dia)"'); }
{ const H=jogo('terraco'); const t=loja(H,'lanchonete','divulga');
  ok(/Trio de cordas · R\$ ?500\/dia/.test(t) && /Pianista · R\$ ?305\/dia/.test(t) && !/Quarteto/.test(t),'o cartão da música: "Trio de cordas · R$ 500/dia" e "Pianista · R$ 305/dia"'); }

// ---------- 4. o cardápio × 1,2 ----------
{ const L=nova().L, v10={ pf:25, coxinha:8, risoles:6, kibe:7, bolinho:8, empada:9, esfihaA:7, esfihaF:7, misto:10, bauru:12, paoChapa:7, pastel:10, pastelQ:10, pastelP:11,
    pfVeg:23, empadaPalmito:9, kibeAbobora:7, pfVegano:23, coxinhaJaca:8, pastelPalmito:10, esfihaSoja:7, mistoVegano:10, parmegiana:30,
    bruschetta:14, bacalhau:16, quiche:15, risoto:38, peixe:42, medalhao:46 };
  const ks=Object.keys(v10), bons=ks.filter(k=>L.CARDAPIO[k] && L.CARDAPIO[k].preco===Math.round(v10[k]*1.2));
  ok(ks.length===Object.keys(L.CARDAPIO).filter(k=>L.CARDAPIO[k].cat!=='junina').length && bons.length===ks.length,'os '+ks.length+' pratos custam Math.round(antigo × 1,2) (erros: '+ks.filter(k=>!bons.includes(k)).join(',')+')');
  const C=L.CARDAPIO; ok(C.pf.preco===30 && C.coxinha.preco===10 && C.misto.preco===12 && C.pastel.preco===12 && C.bauru.preco===14 && C.pfVeg.preco===28,'PF 30, coxinha 10, misto 12, pastel 12, bauru 14, PF vegetariano 28');
  ok(L.precoPrato('pf',L.PONTOS[0],{})===30,'o PF da Garagem vende por R$ 30'); }

// ---------- 5. as fichas do Manual ----------
{ const L=nova().L, f=id=>L.MANUAL.find(x=>x.id===id);
  ok(f('e-tonhao').linha==='O chef. Aprende pratos nos cursos e, com aumento, cozinha mais rápido e ajuda na pia.','a ficha e-tonhao tem o texto novo');
  ok(f('l-musica').linha==='Trio ou pianista: a paciência nas mesas dura mais, o ambiente melhora e a mesa pede mais uma rodada.','a ficha l-musica tem o texto novo (trio)'); }

// ---------- 6. um save da v10.4 ----------
{ const H=nova(), {L}=H;
  const sv=L.normSave({ histV:1, cap:8, dia:40, maxDay:40, bank:5000, v10:1, equipe:{ tonhao:3, dani:3, joca:3, cami:2, anselmo:2, lia:1, musica:1 }, salao:{ ponto:'terraco' } });
  ok(sv.equipe.musica===1 && L.musicaDe(sv.equipe).nome==='Trio de cordas','um save com musica: 1 carrega como Trio de cordas');
  ok(L.payroll(sv.equipe,L.cursosPay(sv))===100+32+78+115+105+80+500,'e paga os valores novos a partir daí (R$ '+L.payroll(sv.equipe,L.cursosPay(sv))+')');
  ok(sv.equipe.tonhao===3 && sv.equipe.dani===3 && sv.equipe.joca===3,'os níveis não mudam'); }

console.log('smoke67: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
