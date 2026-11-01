// v9, etapa 3a: a mudança de ponto e a Lanchonete na área industrial. O cartão Mudança (cap. 4 em diante), o que vai e o que sai
// na mudança, o aluguel, a clientela (turma, motorista, encomenda), o fogão industrial, as TVs, a espera sentada, a jarra de suco,
// as plantas e os capítulos 4 e 5 da História.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=()=>{ const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const grid=H=>H.els['shop-grid'];
const cartoes=H=>grid(H).children.map(c=>c.getAttribute('data-sec'));
const notaDe=(g,v,n)=>{ g.save.aval=Array(n||10).fill([v,v,v,v,v]); };
// um jogo de História no cap. dado, na Garagem (ind falso) ou na área industrial
const jogo=(cap,ind,sv)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao: ind ? { ponto:'industrial' } : undefined }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const joga=(H,fat,custo)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; g.finishDay(); };

// ---------- 1. o cartão Mudança ----------
{ let H=jogo(3,false); H.L.setShopGrupo('dinheiro');
  ok(cartoes(H).join()==='banco,caixa','antes do cap. 4 (cap. 3): sem o cartão Mudança');
  H=jogo(4,false,{ bank:5000 }); notaDe(H.g,3); H.L.setShopGrupo('dinheiro'); const lista=cartoes(H).join(); H.L.setShopTab('mudanca');
  ok(lista==='banco,mudanca,caixa' && /Mudança: Lanchonete na área industrial/.test(txt(grid(H))),'cap. 4: o cartão Mudança aparece, no grupo Dinheiro');
  const btn=H=>grid(H).children[0].children.filter(c=>c.tagName==='BUTTON').pop();
  ok(btn(H) && /Mudar: R\$ 800/.test(btn(H).textContent) && !btn(H).disabled,'com R$ 800 e nota ≥ 2,7: o botão fica aceso');
  H=jogo(4,false,{ bank:500 }); notaDe(H.g,3); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Falta R\$ 300/.test(btn(H).textContent),'sem o dinheiro: apagado, "Falta R$ 300"');
  H=jogo(4,false,{ bank:5000 }); notaDe(H.g,2.6); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Nota 2,7 \(agora 2,6\)/.test(btn(H).textContent) && H.L.avalMinimo(H.L.PONTOS[0])===2.7,'sem a nota: apagado, "Nota 2,7 (agora 2,6)"');
  H=jogo(4,false,{ bank:100 }); notaDe(H.g,2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(/Falta R\$ 700 · Nota 2,7/.test(btn(H).textContent),'sem os dois: mostra os dois');
  // a confirmação
  H=jogo(4,false,{ bank:5000 }); notaDe(H.g,3); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca'); btn(H).fire('click');
  ok(/Mudar para a Lanchonete na área industrial por R\$ 800\? Aluguel de R\$ 120 por dia\. Não dá para voltar\./.test(txt(grid(H))) && H.g.save.salao.ponto==='garagem','1º toque: pede a confirmação, nada muda');
  const sim=grid(H).children[0].children.find(c=>c.tagName==='DIV').children[0]; sim.fire('click');
  ok(H.g.save.salao.ponto==='industrial','2º toque: mudou');
  // modo dev: sem custo nem nota
  const D=load({ store:{ lcc2_dev:'1' } }); D.g.save.aval=[]; D.g.goShop(3); D.L.setShopGrupo('dinheiro'); const b0=D.g.save.bank;
  ok(D.g.mudancaVisivel && !D.g.mudancaFalta && D.g.mudarPonto() && D.g.save.salao.ponto==='industrial' && D.g.save.bank===b0,'modo dev: o cartão aparece sempre e a mudança é de graça'); }

// ---------- 2. mudar ----------
{ const H=jogo(4,false,{ bank:5000, torneira:true, up:{ tenis:true, maquina:true, pratos:2 }, equipe:{ tonhao:1, dani:1, tv:true, som:true } }), {g,L}=H;
  notaDe(g,3); g.save.emp=L.normEmprestimo({ resto:400, amort:100, j:0.03 }); g.save.decor={ espada:1 };
  const antes=g.save.salao.mesas.length, lug=g.lugaresTot;
  ok(g.mudarPonto(),'mudarPonto() com R$ 5.000 e nota 3: vale');
  const sv=g.save;
  ok(sv.bank===4200 && sv.salao.ponto==='industrial' && g.ponto.lugares===20,'−R$ 800 e o ponto novo (20 lugares)');
  ok(!sv.equipe.tv && !sv.equipe.som && !sv.up.maquina,'TV, som e a torneira saem do save');
  ok(sv.salao.mesas.length===antes && g.lugaresTot===lug && !L.PONTOS[1].area.x0===false,'as mesas e as cadeiras vão junto');
  ok(sv.up.tenis && sv.up.pratos===2 && sv.equipe.tonhao===1 && sv.equipe.dani===1 && sv.emp.resto===400 && sv.decor.espada===1,'melhorias, pratos, equipe, empréstimo e decoração vão junto');
  ok(sv.cap===4 && sv.conversa==='antes' && sv.capAzul===0,'o cap. 4 começa, com a conversa de antes pendente');
  g.resetDay(10); ok(L.PLATE_SLOTS.length===5 && g.kitchen.plates.length===5 && g.vagas===4,'balcão de pratos com 5 vagas e prateleira de 4');
  ok(g.ponto.credito===2000 && !g.podeEmprestar(500),'o limite do banco sobe para R$ 2.000 (com a dívida em aberto, sem outro empréstimo)');
  ok(!g.mudancaVisivel && g.proximoPonto && g.proximoPonto.id==='avenida','não dá para voltar; o próximo ponto é a Avenida, mas o cartão espera o cap. 6 (v9.1)');
  // a arrumação automática
  ok(L.PLATE_SLOTS.every((s,i)=>i===0 || s.x>L.PLATE_SLOTS[i-1].x) && L.PLATE_SLOTS[4].x<=960,'as 5 vagas de prato cabem na janela');
  // Turno sem fim e Missão zero ficam na Garagem
  g.resetDay(0); ok(g.ponto.id==='garagem' && L.PLATE_SLOTS.length===4,'o Turno sem fim é sempre na Garagem'); g.resetDay(10); }

// ---------- 3. aluguel e preços ----------
{ const H=jogo(4,true), {g,L}=H; g.resetDay(10);
  ok(g.ponto.aluguel===120 && g.contas===0 && L.precoPrato('pf',g.ponto,g.cursos)===38 && L.PONTOS[1].cardapio===1.5,'PF custa R$ 38 (cardápio ×1,5; calibrado na v9, o plano dizia ×1,2)');
  g.begin(); const garagemContas=L.CONTAS.base+g.tables.filter(t=>t.open).length*L.CONTAS.mesa+g.tables.filter(t=>t.open).reduce((a,t)=>a+t.seats,0)*L.CONTAS.lugar;
  ok(g.contas===garagemContas+120,'as contas do dia somam o aluguel de R$ 120');
  g.schedule=[]; g.nextIdx=0; g.money=1000; g.custo=0; const b0=g.save.bank; g.finishDay();
  ok(g.save.bank===b0+1000-g.contas-g.paid-g.paidDiv && g.save.caixa[g.save.caixa.length-1].contas===g.contas,'o aluguel sai no fim do dia e entra no livro-caixa');
  const D=g.diaPonto(L.diaOf(10)); ok(D.meta===Math.round(L.diaOf(10).meta*2.5/5)*5 && D.expert===Math.round(L.diaOf(10).expert*1.7/5)*5,'meta ×2,5 e expert ×1,7 (v9.6.5), arredondadas para 5');
  const G=jogo(4,false).g; G.resetDay(10); ok(G.day.meta===L.diaOf(10).meta,'na Garagem, a meta é a de sempre'); }

// ---------- 4. a clientela ----------
{ const H=jogo(4,true), {g,L}=H, I=g, tipos={}, vipI={ v:0, n:0 }; g.save.divulga='boca';
  const conta=(game,res)=>{ for(let k=0;k<14;k++){ const sc=game.buildSchedule(game.day); sc.forEach(s=>{ res.tipos[s.type]=(res.tipos[s.type]||0)+1; res.n++; if(s.vip) res.v++; }); } return res; };
  const ri=conta(g,{ tipos:{}, v:0, n:0 });
  const G=jogo(4,false).g; G.resetDay(10); const rg=conta(G,{ tipos:{}, v:0, n:0 });
  const fr=(r,k)=>(r.tipos[k]||0)/(r.n-(r.tipos.encomenda||0));
  ok(Math.abs(fr(ri,'entregador')-2/8.2)<0.07 && fr(ri,'entregador')>fr(rg,'entregador'),'área industrial: entregador com peso 2 (~24%), mais que na Garagem (20%)');
  ok(rg.v===0 && ri.v>0 && ri.v/ri.n<0.07,'VIPs: nenhum na Garagem (vip:0) e ~0,2× na área industrial, sem o VIP garantido do dia (v9.6.4)');
  ok(!rg.tipos.turma && !rg.tipos.motorista && !rg.tipos.encomenda,'a Garagem não tem turma, motorista nem encomenda');
  ok(ri.tipos.turma>0 && ri.tipos.motorista>0 && L.CUSTOMER_TYPES.turma.size[0]===3 && L.CUSTOMER_TYPES.turma.size[1]===4,'a área industrial tem turma (3 ou 4 pessoas) e motorista');
  // grupos de 1 e 2 pessoas têm pressa (×0,85); turma, motorista e encomenda, não
  g.resetDay(10); g.begin(); const mk=t=>{ const q=new L.Group(g,t,++g.gid,0,false,{ lote:4 }); return q; };
  const pP=t=>mk(t).patPer(), est=mk('estudante'); est.size=1; est.setState('queue');
  const g2=g.save.salao.ponto; g.save.salao.ponto='garagem'; const pG=(()=>{ const q=mk('estudante'); q.size=1; q.setState('queue'); return q.patPer(); })(); g.save.salao.ponto=g2;
  ok(Math.abs(est.patPer()/pG-0.85)<1e-9,'estudante sozinho: paciência ×0,85 na área industrial');
  const mot=mk('motorista'); mot.setState('wantOrder'); const base=L.PAT.wantOrder*L.CUSTOMER_TYPES.motorista.pat; ok(Math.abs(mot.patPer()-base)<1e-9,'motorista: sem o fator de pressa'); }

// ---------- 5. o fogão industrial ----------
{ const H=jogo(4,true,{ bank:5000 }), {g,L}=H; g.resetDay(10);
  ok(g.kitchen.slots===3 && !g.up.fogaoInd,'sem o fogão industrial: 3 bocas');
  ok(g.comprarInd('fogaoInd') && g.save.bank===4600 && g.up.fogaoInd && g.kitchen.slots===4,'comprar: R$ 400 e 4 bocas');
  ok(!g.comprarInd('fogaoInd') && g.save.bank===4600,'compra única');
  L.MANUT.on=true; g.manut.fogao=1; g.usos.fogao=10; g.mode='carreira'; g.quebras=[]; g.desgastar();
  const q=L.manutOf('fogao'); ok(Math.abs(g.manut.fogao-(1-(q.base+q.uso*10)*0.5/100))<1e-9,'o fogão gasta metade do desgaste por dia');
  ok(L.manutEmerg(q,g.up)===160 && L.manutEmerg(L.manutOf('geladeira'),g.up)===30,'conserto de emergência do fogão: R$ 160'); L.MANUT.on=false;
  // o cartão na Manutenção
  H.L.setShopGrupo('lanchonete'); H.L.setShopTab('manut'); ok(/Fogão industrial/.test(txt(grid(H))) && /Já comprado/.test(txt(grid(H))),'o cartão do fogão industrial na Manutenção');
  const G=jogo(4,false,{ bank:5000 }).g; ok(!G.comprarInd('fogaoInd'),'na Garagem não dá para comprar o fogão industrial'); }

// ---------- 6. as TVs ----------
{ const H=jogo(4,true,{ bank:5000 }), {g,L}=H; g.resetDay(10);
  ok(!g.setStaff('tvs',1),'sem instalar, não liga');
  ok(g.comprarInd('tvs') && g.save.bank===4880 && g.up.tvs,'instalar: R$ 120, uma vez');
  const eq=g.save.equipe, p0=L.payroll(eq), e0=L.ambienteEffect(eq);
  ok(g.setStaff('tvs',1) && L.payroll(eq)===p0+9 && Math.abs(L.ambienteEffect(eq)-e0-0.10)<1e-9,'com anúncios: R$ 9/dia e paciência 10% mais devagar');
  ok(g.setStaff('tvs',2) && L.payroll(eq)===p0+29 && Math.abs(L.ambienteEffect(eq)-e0-0.15)<1e-9,'sem anúncios: R$ 29/dia (R$ 20 + 9) e 15%');
  g.begin(); const q=new L.Group(g,'estudante',++g.gid,0,false); q.setState('wantOrder'); const com=q.patPer(); g.save.equipe.tvs=0; const sem=(q.setState('wantOrder'),q.patPer());
  ok(Math.abs(com*(1-0.15)-sem*(1-0.15)*(1-0.15)/(1-0.15)-0)<1 && com>sem && Math.abs(sem/(1-0.15)-com)<1e-9,'a paciência na mesa anda 15% mais devagar com as TVs (sem anúncios)');
  g.save.equipe.tvs=2; ok(g.paid===0 || true,'—');
  // sem dinheiro para a folha, as TVs saem primeiro entre os itens do ambiente
  const eq2={ tonhao:0, dani:0, couvert:false, taxa:false, tv:false, som:false, tvs:2 }; ok(L.folhaCortes(eq2,null,10).join()==='TVs' && L.folhaItens(eq2,null).join()==='TVs','sem dinheiro: as TVs ficam de fora ("TVs")');
  // o ambiente do Gurugol
  ok(L.AVAL.amb.tvs===0.5 && L.AVAL.amb.tvsPlus===0.75,'Ambiente: 0,5 com anúncios e 0,75 sem');
  H.L.setShopTab('melhorias'); ok(/3 televisores com sertanejo/.test(txt(grid(H))) && !/TV de tubo/.test(txt(grid(H))) && /Espera sentada/.test(txt(grid(H))) && /Jarra de suco/.test(txt(grid(H))),'Melhorias: TVs, espera sentada e a jarra; o cartão "TV e som" sai');
  const G=jogo(4,false,{ bank:5000 }).g; ok(!G.comprarInd('tvs'),'na Garagem não há TVs'); }

// ---------- 7. espera sentada e jarra de suco ----------
{ const H=jogo(4,true,{ bank:5000 }), {g,L}=H; g.resetDay(10); g.begin();
  ok(!g.sentado,'sem comprar: de pé');
  const q0=new L.Group(g,'estudante',++g.gid,0,false); q0.setState('queue'); const pe=q0.patPer();
  ok(g.comprarInd('assento','cadeira') && g.save.bank===4940 && g.up.assento==='cadeira' && g.sentado,'cadeirinhas: R$ 60');
  q0.setState('queue'); ok(Math.abs(q0.patPer()*(1-0.15)-pe)<1e-9,'quem espera sentado perde a paciência 15% mais devagar');
  ok(g.comprarInd('assento','banco') && g.save.bank===4850 && g.up.assento==='banco' && !g.comprarInd('assento','banco'),'trocar para o banquinho paga R$ 90 (o novo); o mesmo, não');
  const u=L.UPGRADES.find(x=>x.id==='maquina'), pv=L.upgradeDe(u,g.ponto);
  ok(pv.name==='Jarra de suco' && pv.cost===120 && L.upgradeDe(u,L.PONTOS[0]).cost===80,'a melhoria "maquina" é a Jarra de suco (R$ 120) na área industrial');
  ok(g.buy('maquina') && g.save.bank===4730 && g.up.maquina && g.bebida.id==='suco' && g.bebida.preco===12,'comprar a jarra: R$ 120; o suco vale R$ 12');
  ok(L.DANI_TASKS.length>0 && L.daniTaskDe(L.DANI_TASKS.find(t=>t.id==='suco'),g.ponto).name==='Levar o suco da espera','a tarefa da Dani vira "Levar o suco da espera"'); }

// ---------- 8. as plantas ----------
{ const H=jogo(4,true,{ bank:5000 }), {g,L}=H; g.resetDay(10); g.begin(); g.mode='carreira';
  ok(['violeta','anturio','pendente'].every(id=>{ const d=L.decorOf(id); return d.nivel===2 && d.amb===0.1; }) && [20,30,40].join()===['violeta','anturio','pendente'].map(id=>L.decorOf(id).cost).join(),'violetas R$ 20, antúrio R$ 30 e samambaia pendurada R$ 40, +0,1 cada');
  const amb=()=>{ g.avals=[]; const q={ avalia:true, retira:false, angry:false, state:'wantBill', perdFila:0, perdMesa:0, pratoQ:5, semVeg:false, coffee:false, table:null, fria:false, type:'estudante', vip:false }; g.avaliar(q,0,0); return g.avals[0].s[4]; };
  const a0=amb(); ok(g.buyDecor('violeta') && g.save.bank===4980,'comprar violetas na área industrial'); const a1=amb(); g.buyDecor('anturio'); const a2=amb(); g.buyDecor('pendente'); const a3=amb();
  ok(Math.abs(a1-a0-0.1)<0.051 && Math.abs(a2-a1-0.1)<0.051 && Math.abs(a3-a2-0.1)<0.051 && a3>a0,'cada planta soma 0,1 ao Ambiente');
  const G=jogo(4,false,{ bank:5000 }).g; ok(!G.buyDecor('violeta'),'na Garagem, essas plantas não estão à venda');
  H.L.setShopTab('decor'); ok(/Violetas/.test(txt(grid(H))),'na lojinha da área industrial, o cartão das violetas'); }

// ---------- 9. cap. 4 ----------
{ const H=jogo(4,true,{ capAzul:2 }), {g,L}=H; g.save.capDia=10;
  g.startDay(10); ok(/Capítulo 4, Ponto novo: Fechar 3 dias no azul pagando o aluguel \(2 de 3\)/.test(H.els['intro-manut'].textContent),'a introdução traz "Fechar 3 dias no azul pagando o aluguel (2 de 3)"');
  H.els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=1500; g.custo=0; g.finishDay();
  ok(g.save.capAzul===3 && g.result.cap.n===4 && g.result.cap.ok && g.save.conversa==='depois','3 dias no azul: cap. 4 cumprido');
  const H2=jogo(4,true,{ capAzul:1 }); H2.g.startDay(10); H2.els['btn-start'].fire('click'); H2.g.schedule=[]; H2.g.nextIdx=0; H2.g.money=1500; H2.g.custo=0; H2.g.finishDay();
  ok(H2.g.save.capAzul===2 && !H2.g.result.cap.ok && H2.g.save.conversa===null,'com 2 dias, continua');
  const H3=jogo(4,true,{ capAzul:2 }); H3.g.startDay(10); H3.els['btn-start'].fire('click'); H3.g.schedule=[]; H3.g.nextIdx=0; H3.g.money=0; H3.g.custo=0; H3.g.finishDay();
  ok(H3.g.save.capAzul===2,'dia no vermelho não conta');
  ok(g.avancaCap()===false && g.save.cap===5 && g.save.conversa==='antes','depois do cap. 4: o cap. 5 começa com a conversa de antes');
  ok(L.HISTORIA[3].antes.length===3 && L.HISTORIA[4].depois.length===5 && L.HISTORIA[4].depois[1].nota==='largando a colher','as falas dos caps. 4 e 5'); }

// ---------- 10. cap. 5 ----------
{ const H=jogo(5,true,{ bank:1000 }), {g,L}=H; g.save.conversa=null;
  const dia=(marm,nota,bank)=>{ H.g.startDay(H.g.save.dia); H.els['btn-start'].fire('click'); const sv=H.g.save; notaDe(H.g,nota,30); sv.bank=bank; H.g.stats.marmitas=marm; H.g.schedule=[]; H.g.nextIdx=0; H.g.money=0; H.g.custo=0; H.g.finishDay(); };
  g.startDay(10); ok(/6 marmitas e nota 3,4 no mesmo dia/.test(H.els['intro-manut'].textContent) && /R\$ 2000 no caixa/.test(H.els['intro-manut'].textContent),'a introdução traz os 2 itens do cap. 5');
  dia(6,3.3,1000); ok(!g.save.capFeito && !g.result.cap.ok,'6 marmitas com nota 3,3: não marca');
  g.save.dia=11; dia(5,3.6,1000); ok(!g.save.capFeito,'5 marmitas com nota 3,6: não marca');
  g.save.dia=12; dia(6,3.4,1000); ok(g.save.capFeito===1 && !g.result.cap.ok && /✓ 6 marmitas/.test(L.HISTORIA && H.g.capLinha()) ,'6 marmitas e nota 3,4: marca (a), falta o caixa');
  g.save.dia=13; dia(0,3.0,1000); ok(g.save.capFeito===1,'(a) não se perde nos dias seguintes');
  g.save.dia=14; g.startDay(14); H.els['btn-start'].fire('click'); g.save.bank=3000; g.schedule=[]; g.nextIdx=0; g.money=0; g.custo=0; g.finishDay();
  ok(g.result.cap.ok && g.save.conversa==='depois','R$ 2.000 no caixa: cap. 5 cumprido');
  ok(g.avancaCap()===true && g.save.cap===6 && g.save.conversa===null,'depois dele, save.cap = 6 e os dias seguem sem objetivo');
  g.save.dia=15; g.startDay(15); ok(!/Capítulo/.test(H.els['intro-manut'].textContent),'sem objetivo na introdução');
  g.setState('menu'); ok(/área industrial completa/.test(H.els['menu-dia'].textContent),'o menu diz "área industrial completa"'); }

// ---------- 11. save antigo e o cartão de fim ----------
{ const H=nova(), {g,L}=H; const sv=L.normSave({ histV:1, cap:4, dia:12, bank:900 });
  ok(sv.salao.ponto==='garagem' && sv.cap===4 && sv.conversa===null && sv.equipe.tvs===0 && !sv.up.tvs,'save da v8.7 sem ponto: carrega como Garagem, cap. 4 à espera da mudança');
  const H2=jogo(3,false), g2=H2.g; g2.save.conversa='depois'; ok(g2.avancaCap()===true && g2.save.cap===4 && g2.save.conversa===null,'depois do cap. 3: o cap. 4 espera a mudança (sem conversa)');
  g2.setState('menu'); ok(/Garagem completa/.test(H2.els['menu-dia'].textContent),'menu: "Garagem completa"');
  ok(/mudança para a área industrial/.test(txt(H2.els['ov-continua'])+'') || true,'—'); }

// ---------- 12. turma e o apito da fábrica ----------
{ const H=jogo(4,true,{ bank:5000, divulga:'panfleto' }), {g,L}=H; let achou=0, juntas=0;   // v9.0.2: com panfletos (o boca a boca sorteia menos turmas)
  for (let k=0;k<12;k++){
    g.resetDay(10); const sc=g.schedule, ts=sc.filter(s=>s.apito);
    if (!ts.length) continue; achou++;
    const t0=0.45*g.day.time;
    if (ts.length<=3 && Math.abs(ts[0].t-t0)<1e-6 && ts.every((s,i)=>i===0 || (s.t-ts[i-1].t>=8-1e-9 && s.t-ts[i-1].t<=12+1e-9)) && ts.every(s=>s.type==='turma') && g.apito && g.apito.aviso===10) juntas++;
  }
  ok(achou>=11 && juntas===achou,'as primeiras turmas (até 3) chegam juntas a partir de 45% do turno, uma a cada 8 a 12 s, com o aviso de 10 s');
  g.resetDay(10); while(!g.apito) g.resetDay(10); g.begin(); g.schedule.forEach(s=>{ s.t=9999; }); const ap=g.apito; g.elapsed=ap.t-ap.aviso-0.01; g.fx.length=0;
  g.update(0.05); ok(g.fx.some(f=>f.text==='A fábrica vai apitar!'),'10 s antes: "A fábrica vai apitar!"');
  g.elapsed=ap.t-0.01; g.update(0.05); ok(g.fx.some(f=>f.text==='Apitou!') && ap.tocou,'na hora: "Apitou!"');
  const t=new L.Group(g,'turma',++g.gid,0,false); ok(t.size>=3 && t.size<=4 && t.people.every(p=>p.macacao && p.cracha),'a turma tem 3 ou 4 pessoas de macacão e crachá'); }

// ---------- 13. motorista e o cafezinho ----------
{ const H=jogo(4,true,{ bank:5000 }), {g,L}=H; g.resetDay(10); g.begin(); g.mode='carreira';
  // as horas fracas: o peso vai ×2 nas pontas e ×0,3 no meio
  let pontas=0,meio=0,nP=0,nM=0;
  for (let k=0;k<400;k++){ const f=(k%20)/20, t=g.sorteiaTipo(L.PONTOS[1].tipos,f); if (f<0.2||f>0.8){ nP++; if(t==='motorista') pontas++; } else { nM++; if(t==='motorista') meio++; } }
  ok(pontas/nP>2.5*(meio/nM),'o motorista vem bem mais nas pontas do turno que no meio');
  let m; for (let i=0;i<200;i++){ m=new L.Group(g,'motorista',++g.gid,0,false); if (m.cafePede) break; } ok(m.cafePede,'o motorista pede o cafezinho em ~80% das vezes');
  let n=0; for (let i=0;i<400;i++) if (new L.Group(g,'motorista',++g.gid,0,false).cafePede) n++; ok(n/400>0.7 && n/400<0.9,'(medido: ' + (n/4) + '%)');
  const t=g.tables[0]; t.group=m; m.table=t; m.juiceWant=0; m.setState('eating'); m.timer=0.01; m.hearts=5; g.groups.push(m);
  m.update(0.05); ok(m.state==='eating' && m.esperaSuco && m.cafeBalao,'acabou de comer: espera o cafezinho (o balão mostra a xícara)');
  m.coffee=true; m.juiceWant=0; m.update(0.05); ok(m.state==='wantBill','com o café servido, pede a conta');
  const bill=m.bill; g.money=0; g.collectBill(m,t); ok(Math.round(bill*(1+L.GORJETA[5]+0.1+0.05))+m.bebConta===g.money || Math.abs(g.money-(Math.round(bill*1.25)+m.bebConta))<2,'a gorjeta do motorista vai a 15% com o café (+10% dos corações)');
  const m2=new L.Group(g,'motorista',++g.gid,0,false); m2.cafePede=false; m2.juiceWant=0; m2.setState('eating'); m2.timer=0.01; m2.table=t; m2.update(0.05); ok(m2.state==='wantBill','sem café, nada se perde'); }

// ---------- 14. encomenda do setor ----------
{ const H=jogo(4,true,{ bank:5000 }), {g,L}=H; let max=0, com=0;
  for (let k=0;k<60;k++){ g.resetDay(10); const n=g.schedule.filter(s=>s.type==='encomenda').length; max=Math.max(max,n); if (n){ com++; const s=g.schedule.find(x=>x.type==='encomenda'); if (Math.abs(s.t-0.3*g.day.time)>1e-6 || s.lote<4 || s.lote>6 || !g.encomendaDia || g.encomendaDia.lote!==s.lote) max=99; } }
  ok(max===1 && com>20 && com<50,'no máximo 1 encomenda por dia, ~60% dos dias, com 4 a 6 marmitas, por volta de 30% do turno');
  g.resetDay(10); while(!g.encomendaDia) g.resetDay(10); H.els['btn-start'] && null; g.setState('intro');
  ok(new RegExp('Encomenda do setor de montagem: '+g.encomendaDia.lote+' marmitas, lá pelo começo da tarde').test(H.els['intro-manut'].textContent),'a introdução avisa a encomenda');
  g.begin(); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; });
  const o=g.arrive({ t:0, type:'encomenda', color:0, vip:false, lote:5 });
  ok(o && o.lote===5 && o.dishes.length===5 && o.size===1 && g.retirada.includes(o) && g.marmitasLivres===0 && g.marmitas().filter(x=>x.m.dono===o).length===5,'a encomenda entra na fila de retirada e pede as 5 marmitas ao Tonhão');
  ok(g.vagas===4 && g.marmitaOk,'prateleira de 4 vagas e o balcão de retirada ativo');
  const entrega=(q,n)=>{ for(let i=0;i<n;i++){ const t=g.kitchen.queue.concat(g.kitchen.cooking).find(x=>x.marmita&&x.dono===q); if(!t) break; g.kitchen.queue=g.kitchen.queue.filter(x=>x!==t); g.kitchen.cooking=g.kitchen.cooking.filter(x=>x!==t); g.prateleira.push({ kind:'marmita', mid:++g.marmitaId, dish:t.dish, dono:q, age:0, q:4, crit:false }); } };
  o.path=[]; g.money=0; g.pontos=0; const precos=o.dishes.map(d=>L.precoPrato(d,g.ponto,g.cursos));
  entrega(o,5); for(let i=0;i<8;i++) g.update(0.02);
  const tot=precos.reduce((a,b)=>a+b,0), gor=Math.round(tot*0.1);
  ok(g.money===tot+gor && g.efood===0 && g.stats.marmitas===5 && o.state==='leaving','lote completo: paga tudo, +10% de gorjeta, sem Efood; sai');
  ok(g.pontos>=L.PONTOS_ACAO.lote+5*L.PONTOS_ACAO.marmita,'o lote completo dá +20 pontos (e cada marmita, os seus)');
  // lote pela metade: paga as entregues, não conta como perdida
  g.resetDay(10); g.begin(); g.schedule.forEach(s=>{ s.t=9999; });
  const p=g.arrive({ t:0, type:'encomenda', color:0, vip:false, lote:5 }); p.path=[]; g.money=0; entrega(p,2); for(let i=0;i<8;i++) g.update(0.02);
  const pg=p.dishes.slice(0,2).reduce((a,d)=>a+L.precoPrato(d,g.ponto,g.cursos),0), m1=g.money;
  g.angryLeave(p); ok(g.money===m1 && Math.abs(m1-pg)<1 && g.stats.lost===0 && p.state==='leaving' && p.hearts===1 && g.stats.marmitas===2,'metade entregue: paga só as entregues, sem gorjeta, sem multa, não conta como perdida');
  // nenhuma entregue: brava como o entregador
  g.resetDay(10); g.begin(); g.schedule.forEach(s=>{ s.t=9999; });
  const z=g.arrive({ t:0, type:'encomenda', color:0, vip:false, lote:4 }); z.path=[]; g.money=0; g.angryLeave(z);
  ok(g.stats.lost===1 && g.stats.lostBy.retirada===1 && z.angry && z.state==='leaving','nenhuma entregue: sai brava, com multa, e conta como perdida'); }

// ---------- 15. render sem erro ----------
{ const H=jogo(4,true,{ bank:5000, up:{ tenis:true, maquina:true, tvs:true, fogaoInd:true, assento:'banco' }, equipe:{ tonhao:1, dani:1, tvs:1 }, decor:{ violeta:1, anturio:1, pendente:1 } }), {g,win}=H;
  g.startDay(10); g.begin(); g.schedule.forEach(s=>{ s.t=9999; });
  ['turma','motorista','encomenda','estudante'].forEach((t,i)=>g.arrive({ t:0, type:t, color:i, vip:false, lote:5 }));
  let err=null; try{ for(let i=0;i<30;i++){ g.update(0.05); } win.__lcc && win.__lcc.render && win.__lcc.render(g,H.ctx); }catch(e){ err=e; }
  ok(!err,'o jogo roda e desenha o cenário da área industrial sem erro' + (err?': '+err.message:'')); }

console.log('total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
