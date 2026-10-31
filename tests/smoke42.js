// v9.1, etapa 3b-1: Restaurante na Avenida Brasil. O cartão Mudança generalizado (cap. 6 em diante), o que vai e o que sai na mudança,
// o aluguel e os preços, a clientela (almoço de negócios, sem turma/motorista/encomenda, mais VIPs), os sofás, as águas saborizadas,
// as flores, o couvert, o curso Cozinha de restaurante (a parmegiana), as 6 vagas de prato e as 6 de espera, e os capítulos 6 e 7.
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const mostra=(els,id)=>els[id].classList.contains('show');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<20){ toque(H.els); n++; } return n; };
const nova=()=>{ const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const grid=H=>H.els['shop-grid'];
const cartoes=H=>grid(H).children.map(c=>c.getAttribute('data-sec'));
const notaDe=(g,v,n)=>{ g.save.aval=Array(n||10).fill([v,v,v,v,v]); };
// um jogo de História no cap. dado, num ponto ('garagem', 'industrial' ou 'avenida')
const jogo=(cap,ponto,sv)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto:ponto||'garagem' } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const joga=(H,fat,custo)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; g.finishDay(); };
const html=fs.readFileSync(__dirname+'/../lanchonete.html','utf8');

// ---------- 1. o cartão Mudança (cap. 6 em diante) ----------
{ let H=jogo(5,'industrial'); H.L.setShopGrupo('dinheiro');
  ok(cartoes(H).join()==='banco,caixa' && !H.g.mudancaVisivel,'na área industrial com o cap. 5: sem o cartão Mudança');
  H=jogo(6,'industrial',{ bank:5000 }); notaDe(H.g,3.6); H.L.setShopGrupo('dinheiro'); const lista=cartoes(H).join(); H.L.setShopTab('mudanca');
  const btn=H=>grid(H).children[0].children.filter(c=>c.tagName==='BUTTON').pop();
  ok(lista==='banco,mudanca,caixa' && /Mudança: Restaurante na Avenida Brasil/.test(txt(grid(H))),'cap. 6: o cartão Mudança aparece, para o Restaurante na Avenida Brasil');
  ok(btn(H) && /Mudar: R\$ 2000/.test(btn(H).textContent) && !btn(H).disabled && H.L.avalMinimo(H.L.PONTOS[1])===3.4,'com R$ 2.000 e nota ≥ 3,4: o botão fica aceso (nota mínima 3,4)');
  ok(/24 lugares \(hoje, 20\)/.test(txt(grid(H))) && /cardápio 33% mais caro/.test(txt(grid(H))) && /as TVs, o assento da espera e a jarra de suco ficam/.test(txt(grid(H))) && /almoço de negócios/.test(txt(grid(H))),'o texto do cartão: 24 lugares, cardápio, o que fica e o que vem');
  H=jogo(6,'industrial',{ bank:500 }); notaDe(H.g,3.6); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Falta R\$ 1500/.test(btn(H).textContent),'sem o dinheiro: apagado, "Falta R$ 1500"');
  H=jogo(6,'industrial',{ bank:5000 }); notaDe(H.g,3.3); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Nota 3,4 \(agora 3,3\)/.test(btn(H).textContent),'sem a nota: apagado, "Nota 3,4 (agora 3,3)"');
  H=jogo(6,'industrial',{ bank:100 }); notaDe(H.g,2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(/Falta R\$ 1900 · Nota 3,4/.test(btn(H).textContent),'sem os dois: mostra os dois');
  H=jogo(6,'industrial',{ bank:5000 }); notaDe(H.g,3.6); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca'); btn(H).fire('click');
  ok(/Mudar para o Restaurante na Avenida Brasil por R\$ 2000\? Aluguel de R\$ 400 por dia\. Não dá para voltar\./.test(txt(grid(H))) && H.g.save.salao.ponto==='industrial','1º toque: pede a confirmação, nada muda');
  const sim=grid(H).children[0].children.find(c=>c.tagName==='DIV').children[0]; sim.fire('click');
  ok(H.g.save.salao.ponto==='avenida','2º toque: mudou');
  // a Garagem não vê o cartão da Avenida; a mudança para a área industrial segue igual
  H=jogo(4,'garagem',{ bank:5000 }); notaDe(H.g,3); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(/Mudança: Lanchonete na área industrial/.test(txt(grid(H))) && /a TV, o som e a torneira ficam/.test(txt(grid(H))) && /freguesia da fábrica/.test(txt(grid(H))),'na Garagem, o cartão segue o da área industrial (v9)');
  // modo dev: sem custo nem nota, desde o início
  const D=load({ store:{ lcc2_dev:'1' } }); D.g.save.aval=[]; D.g.save.salao.ponto='industrial'; D.g.save.salao=D.L.normSalao(D.g.save.salao); D.g.goShop(3); const b0=D.g.save.bank;
  ok(D.g.mudancaVisivel && !D.g.mudancaFalta && D.g.mudarPonto() && D.g.save.salao.ponto==='avenida' && D.g.save.bank===b0,'modo dev: o cartão aparece sempre e a mudança é de graça'); }

// ---------- 2. mudar ----------
{ const H=jogo(6,'industrial',{ bank:5000, torneira:true, up:{ tenis:true, maquina:true, tvs:true, assento:'cadeira', fogaoInd:true, pratos:2 }, equipe:{ tonhao:1, dani:1, tvs:2 }, decor:{ espada:1, violeta:1, anturio:1 } }), {g,L}=H;
  notaDe(g,3.6); const antes=g.save.salao.mesas.length, lug=g.lugaresTot;
  ok(g.up.tvs && g.up.assento==='cadeira' && g.up.maquina && g.save.equipe.tvs===2,'(antes) TVs, cadeirinhas e jarra na área industrial');
  ok(g.mudarPonto(),'mudou'); const sv=g.save;
  ok(sv.bank===3000 && sv.salao.ponto==='avenida' && g.ponto.lugares===24,'−R$ 2.000 e o ponto novo (24 lugares)');
  ok(!sv.up.tvs && !sv.up.assento && !sv.up.maquina && sv.equipe.tvs===0,'as TVs, o assento da espera e a jarra saem do save');
  ok(sv.up.fogaoInd && sv.up.tenis && sv.up.pratos===2 && sv.equipe.tonhao===1 && sv.equipe.dani===1 && sv.decor.espada===1 && sv.decor.violeta===1 && sv.decor.anturio===1,'o fogão industrial, melhorias, pratos, equipe e as plantas vão junto');
  ok(sv.salao.mesas.length===antes && g.lugaresTot===lug && L.salaoAuto([4,4,4,4,4,4].map((seats,c)=>({seats,c:c%4})),L.PONTOS[2])!==null,'as mesas vão junto e 24 lugares (6 mesas de 4) cabem na arrumação automática');
  ok(sv.cap===6 && sv.conversa==='antes' && sv.capAzul===0,'o cap. 6 começa, com a conversa de antes pendente');
  g.resetDay(10); ok(L.PLATE_SLOTS.length===6 && g.kitchen.plates.length===6 && g.vagas===4 && L.PLATE_SLOTS.every((s,i)=>i===0 || s.x-L.PLATE_SLOTS[i-1].x>=28) && L.PLATE_SLOTS[5].x+19<=960 && L.PLATE_SLOTS[0].x-19>=766,'balcão de pratos com 6 vagas dentro da janela e prateleira de 4');
  ok(g.ponto.credito===4000,'o limite do banco sobe para R$ 4.000');
  ok(!g.mudancaVisivel && g.proximoPonto===null,'não dá para voltar nem mudar de novo (sem outro ponto)');
  // as vagas da espera: 6 posições, todas definidas e distintas (até a v9 a 5ª vaga da área industrial não tinha posição)
  ok(L.QUEUE.ys.length===6 && L.QUEUE.ys.every(y=>isFinite(y)) && new Set(L.QUEUE.ys).size===6 && L.QUEUE.ys[0]>L.QUEUE.ys[5] && L.QUEUE.ys[5]>=230,'6 lugares de espera com posição (de baixo para cima)');
  for(let i=0;i<7;i++) g.arrive({ t:0, type:'estudante', color:0, vip:false });
  ok(g.queue.length===6 && g.queue.every((q,i)=>q.path.length===1 && isFinite(q.path[0].y) && q.path[0].y===L.QUEUE.ys[i]),'a espera comporta 6 grupos, cada um com seu lugar; o 7º não entra');
  const IH=jogo(4,'industrial'), I=IH.g; I.resetDay(10); I.begin(); for(let i=0;i<6;i++) I.arrive({ t:0, type:'estudante', color:0, vip:false });
  ok(IH.L.QUEUE.ys.length===5 && I.queue.length===5 && I.queue.every((q,i)=>isFinite(q.path[0].y) && q.path[0].y===IH.L.QUEUE.ys[i]),'área industrial: a 5ª vaga de espera ganhou posição (conserto da v9)');
  const GH=jogo(4,'garagem'); GH.g.resetDay(10); ok(GH.L.QUEUE.ys.join()==='476,396,316,236','Garagem: 4 lugares nas posições de sempre');
  g.resetDay(0); ok(g.ponto.id==='garagem' && L.PLATE_SLOTS.length===4 && L.QUEUE.ys.length===4,'o Turno sem fim é sempre na Garagem'); g.resetDay(10); }

// ---------- 3. aluguel e preços ----------
{ const H=jogo(6,'avenida'), {g,L}=H; g.resetDay(10);
  ok(g.ponto.aluguel===400 && L.precoPrato('pf',g.ponto,g.cursos)===50 && L.PONTOS[2].cardapio===2 && L.precoPrato('coxinha',g.ponto,g.cursos)===16,'PF custa R$ 50 e a coxinha R$ 16 (cardápio ×2,0)');
  g.begin(); const base=L.CONTAS.base+g.tables.filter(t=>t.open).length*L.CONTAS.mesa+g.tables.filter(t=>t.open).reduce((a,t)=>a+t.seats,0)*L.CONTAS.lugar;
  ok(g.contas===base+400,'as contas do dia somam o aluguel de R$ 400');
  g.schedule=[]; g.nextIdx=0; g.money=2000; g.custo=0; const b0=g.save.bank; g.finishDay();
  ok(g.save.bank===b0+2000-g.contas-g.paid-g.paidDiv && g.result.aluguel===400,'o aluguel sai no fim do dia');
  const D=g.diaPonto(L.diaOf(10)); ok(D.meta===Math.round(L.diaOf(10).meta*1.7/5)*5 && D.expert===Math.round(L.diaOf(10).expert*1.7/5)*5,'meta e expert ×1,7, arredondadas para 5');
  ok(L.avalTeto(g.ponto)===4.3 && L.avalMinimo(g.ponto)===3.9,'teto 4,3 e nota mínima 3,9 (para sair, no Terraço)');
  ok(/Restaurante na Avenida Brasil/.test(g.ponto.nome) && L.PONTOS[2].espera===6 && L.PONTOS[2].pratos===6 && L.PONTOS[2].bebida==='saborizada','dados do ponto: nome, 6 de espera, 6 pratos, água saborizada'); }

// ---------- 4. a clientela ----------
{ const H=jogo(6,'avenida'), {g,L}=H; g.save.divulga='boca'; g.resetDay(10);
  const conta=(game,res)=>{ for(let k=0;k<40;k++){ const sc=game.buildSchedule(game.day); sc.forEach(s=>{ res.tipos[s.type]=(res.tipos[s.type]||0)+1; res.n++; if(s.vip) res.v++; }); } return res; };
  const ra=conta(g,{ tipos:{}, v:0, n:0 });
  const G=jogo(4,'garagem').g; G.save.divulga='boca'; G.resetDay(10); const rg=conta(G,{ tipos:{}, v:0, n:0 });
  ok(ra.tipos.negocios>0 && ra.tipos.negocios/ra.n>0.08 && ra.tipos.negocios/ra.n<0.22,'Avenida: o almoço de negócios aparece (peso 1,5 de 7,5; ~15% porque o VIP troca de tipo)');
  ok(!ra.tipos.turma && !ra.tipos.motorista && !ra.tipos.encomenda && !rg.tipos.negocios,'a Avenida não tem turma, motorista nem encomenda; a Garagem não tem almoço de negócios');
  ok(Math.abs(ra.v/ra.n-0.30)<0.07 && L.PONTOS[2].vip===2 && L.PONTOS[2].vip>L.PONTOS[1].vip*5,'VIP ×2 do sorteio (30% dos grupos, sem o VIP garantido do dia; a Garagem sorteia 15% e garante 1 a 3 por dia): '+(ra.v/ra.n*100).toFixed(0)+'% (Garagem '+(rg.v/rg.n*100).toFixed(0)+'%)');
  ok(!g.apito && !g.encomendaDia && !L.PONTOS[2].apito && !L.PONTOS[2].encomenda && !L.PONTOS[2].patPressa,'sem apito, sem encomenda e sem pressa a mais');
  const T=L.CUSTOMER_TYPES.negocios; ok(T.label==='Almoço de negócios' && T.size[0]===3 && T.size[1]===4 && T.tip===0.15 && !T.ind && !L.VIP.types.includes('negocios'),'almoço de negócios: 3 ou 4 pessoas, gorjeta 15%, não é VIP');
  ok(L.GOSTOS.negocios.join()==='5,0,1,1,0','gostos: PF 5, assados 1 e chapa 1');
  // o grupo: roupa sóbria, um com pasta ou notebook
  let semAcc=0, soCor=true; for(let k=0;k<60;k++){ const q=new L.Group(g,'negocios',++g.gid,0,false); if(!q.people.some(p=>p.acc==='pasta'||p.acc==='laptop')) semAcc++; if(!q.people.every(p=>p.blazer||p.camisa==='social')) soCor=false; }
  ok(semAcc===0 && soCor,'todo grupo de negócios tem blazer ou camisa social e um com pasta ou notebook');
  // a paciência: sem o fator de pressa
  g.begin(); const q=new L.Group(g,'negocios',++g.gid,0,false); q.setState('wantOrder'); ok(Math.abs(q.patPer()-L.PAT.wantOrder*0.8)<1e-9,'paciência: PAT × 0,8 (sem pressa)');
  // o comentário próprio na Agilidade
  ok(L.AVAL_CRIT[1].tipo.negocios.bom[0]==='Deu pra fechar o negócio com calma!' && L.AVAL_CRIT[1].tipo.negocios.ruim[0]==='A reunião atrasou por causa do almoço.','comentários próprios do almoço de negócios na Agilidade');
  let viu=0; for(let k=0;k<200;k++){ const c=L.avalComentario([4.5,4.5,4.5,4.5,4.5],'',false,3,[],false,false,'negocios',false); if(c==='Deu pra fechar o negócio com calma!') viu++; } ok(viu>60 && viu<140,'o comentário bom aparece em ~50% das avaliações do tipo'); }

// ---------- 5. sofás ----------
{ const H=jogo(6,'avenida',{ bank:5000 }), {g,L}=H; g.resetDay(10); g.begin();
  ok(!g.sentado,'sem comprar: de pé');
  const q0=new L.Group(g,'estudante',++g.gid,0,false); q0.setState('queue'); const pe=q0.patPer();
  ok(g.comprarInd('assento','sofa') && g.save.bank===4750 && g.up.assento==='sofa' && g.sentado,'sofás: R$ 250');
  q0.setState('queue'); ok(Math.abs(q0.patPer()*(1-0.25)-pe)<1e-9,'quem espera sentado no sofá perde a paciência 25% mais devagar');
  ok(!g.comprarInd('assento','sofa') && !g.comprarInd('assento','cadeira') && !g.comprarInd('tvs') && g.save.bank===4750,'compra única; cadeirinha e TVs não existem na Avenida');
  const I=jogo(4,'industrial',{ bank:5000 }).g; ok(!I.comprarInd('assento','sofa'),'na área industrial não há sofá');
  H.L.setShopGrupo('lanchonete'); H.L.setShopTab('melhorias');
  ok(/Sofás com almofadas/.test(txt(grid(H))) && /Águas saborizadas/.test(txt(grid(H))) && !/televisores/.test(txt(grid(H))) && !/Espera sentada/.test(txt(grid(H))),'Melhorias da Avenida: sofás e águas saborizadas; sem TVs nem cadeirinhas');
  ok(L.assentoSlow('sofa')===0.25 && L.assentoSlow('cadeira')===0.15 && L.assentoSlow('banco')===0.15 && L.assentoSlow()===0,'assentoSlow: 25% o sofá, 15% os da área industrial'); }

// ---------- 6. águas saborizadas ----------
{ const H=jogo(6,'avenida',{ bank:5000 }), {g,L}=H; g.resetDay(10);
  const u=L.UPGRADES.find(x=>x.id==='maquina'), pv=L.upgradeDe(u,g.ponto);
  ok(pv.name==='Águas saborizadas' && pv.cost===200 && L.upgradeDe(u,L.PONTOS[1]).cost===120 && L.upgradeDe(u,L.PONTOS[0]).cost===80,'a melhoria "maquina" da Avenida: Águas saborizadas, R$ 200');
  ok(g.buy('maquina') && g.save.bank===4800 && g.up.maquina,'comprar: R$ 200');
  const b=g.bebida; ok(b.id==='saborizada' && b.preco===14 && b.ingred===3 && b.prep===2 && b.take===0.5,'água saborizada: R$ 14 na conta, R$ 3 de ingrediente, 2 s de preparo');
  const sab=new Set(); for(let k=0;k<80;k++) sab.add(new L.Group(g,'estudante',++g.gid,0,false).sabor); ok(sab.size===3 && L.SABORES.length===3 && L.SABORES.map(s=>s.nome).join()==='limão,morango,hortelã','cada grupo sorteia um dos 3 sabores');
  const t=L.daniTaskDe(L.DANI_TASKS.find(x=>x.id==='suco'),g.ponto); ok(t.name==='Levar a água saborizada' && t.short==='Água','a tarefa da Dani vira "Levar a água saborizada"');
  ok(L.daniTaskDe(L.DANI_TASKS.find(x=>x.id==='suco'),L.PONTOS[1]).name==='Levar o suco da espera' && L.daniTaskDe(L.DANI_TASKS.find(x=>x.id==='suco'),L.PONTOS[0]).name==='Levar a água da espera','os outros pontos seguem iguais');
  // a conta do grupo: o copo entra na conta
  g.begin(); const q=new L.Group(g,'estudante',++g.gid,0,false); q.size=1; q.sucoConta=2; const v=g.bebida.preco*q.sucoConta; ok(v===28,'2 copos na conta: R$ 28');
  ok(MAQ_SLOW()===0.4,'paciência 40% mais devagar (MAQUINA.slow, como na jarra)'); function MAQ_SLOW(){ return L.MAQUINA.slow; } }

// ---------- 7. as flores ----------
{ const H=jogo(6,'avenida',{ bank:5000 }), {g,L}=H; g.resetDay(10); g.begin(); g.mode='carreira';
  ok(['tulipa','copo','orquidea'].every(id=>{ const d=L.decorOf(id); return d.nivel===3 && d.amb===0.15 && d.grupo==='plantas'; }) && [40,50,60].join()===['tulipa','copo','orquidea'].map(id=>L.decorOf(id).cost).join(),'tulipas R$ 40, copos-de-leite R$ 50 e orquídeas R$ 60, +0,15 cada');
  const amb=()=>{ g.avals=[]; const q={ avalia:true, retira:false, angry:false, state:'wantBill', perdFila:0, perdMesa:0, pratoQ:5, semVeg:false, coffee:false, table:null, fria:false, type:'estudante', vip:false }; g.avaliar(q,0,0); return g.avals[0].s[4]; };
  const a0=amb(); ok(g.buyDecor('tulipa') && g.save.bank===4960,'comprar tulipas na Avenida'); const a1=amb(); g.buyDecor('copo'); const a2=amb(); g.buyDecor('orquidea'); const a3=amb();
  ok(Math.abs(a1-a0-0.15)<0.051 && Math.abs(a2-a1-0.15)<0.051 && Math.abs(a3-a2-0.15)<0.051 && a3>a0,'cada flor soma 0,15 ao Ambiente');
  ok(g.buyDecor('violeta') && g.buyDecor('anturio') && g.buyDecor('pendente') && g.buyDecor('espada'),'as plantas da Garagem e da área industrial também estão à venda na Avenida');
  const I=jogo(4,'industrial',{ bank:5000 }).g; ok(!I.buyDecor('tulipa') && I.buyDecor('violeta'),'na área industrial, as flores da Avenida não estão à venda');
  H.L.setShopGrupo('lanchonete'); H.L.setShopTab('decor'); ok(/Tulipas/.test(txt(grid(H))) && /Copos-de-leite/.test(txt(grid(H))) && /Orquídeas/.test(txt(grid(H))),'na lojinha da Avenida, os cartões das flores');
  ok(Object.keys(L.AVAL_DECOR).includes('tulipa') && Object.keys(L.AVAL_DECOR).includes('copo') && Object.keys(L.AVAL_DECOR).includes('orquidea'),'elogios das flores no Gurugol'); }

// ---------- 8. o couvert ----------
{ const L=load({}).L;
  ok(L.couvertOk(L.PONTOS[2]) && !L.couvertOk(L.PONTOS[1]) && !L.couvertOk(L.PONTOS[0]),'couvert artístico: à venda só da Avenida em diante (fora do modo dev)');
  const H=jogo(6,'avenida',{ bank:5000 }), {g}=H; g.resetDay(10);
  ok(g.setStaff('couvert',true) && g.save.equipe.couvert && g.setStaff('couvert',false),'contratar e dispensar o couvert na Avenida');
  const I=jogo(4,'industrial',{ bank:5000 }).g; ok(!I.setStaff('couvert',true),'na área industrial, não');
  g.setStaff('couvert',true); H.L.setShopGrupo('lanchonete'); H.L.setShopTab('divulga'); ok(/Couvert artístico/.test(txt(grid(H))),'o cartão do couvert na aba Divulgação da Avenida'); }

// ---------- 9. o curso Cozinha de restaurante ----------
{ const H=jogo(6,'avenida',{ bank:5000 }), {g,L}=H; g.resetDay(10);
  const c=L.cursoOf('restaurante'); ok(c && c.nome==='Cozinha de restaurante' && c.preco===400 && c.pratos.join()==='parmegiana' && c.nivel===3 && c.av.nome==='Parmegiana da casa' && c.av.preco===600 && /molho de tomate de 6 horas/.test(c.av.receita),'o curso: R$ 400 e o avançado "Parmegiana da casa" R$ 600');
  ok(L.CARDAPIO.parmegiana.nome==='Filé à parmegiana' && L.CARDAPIO.parmegiana.preco===30 && L.CARDAPIO.parmegiana.cat==='pf' && L.CARDAPIO.parmegiana.carne===true,'o prato: Filé à parmegiana, R$ 30, categoria PF, com carne');
  H.L.setShopGrupo('lanchonete'); H.L.setShopTab('cardapio'); ok(/Curso de Cozinha de restaurante/.test(txt(grid(H))) && /Filé à parmegiana R\$ 60/.test(txt(grid(H))),'o cartão aparece no Cardápio da Avenida, com a parmegiana a R$ 60');
  ok(g.buyCurso('restaurante') && g.save.bank===4600 && g.save.cursos.restaurante===1,'comprar: R$ 400');
  ok(L.precoPrato('parmegiana',g.ponto,g.cursos)===60 && L.pratoSabido('parmegiana',g.save.cursos) && !L.pratoSabido('parmegiana',{}),'ensina o Filé à parmegiana (R$ 60)');
  g.save.cursoDia=0; g.cursoMsg=''; ok(g.buyCurso('restaurante') && g.save.cursos.restaurante===2 && g.save.bank===4000,'o avançado: R$ 600');
  ok(L.precoPrato('parmegiana',g.ponto,g.cursos)===69,'com o avançado, a parmegiana custa R$ 69');
  ok(L.tonhaoXp({ restaurante:1 })===1 && L.tonhaoXp({ restaurante:2 })===3,'conta na experiência do Tonhão (+1 e +2) como os outros');
  ok(L.avalMenu({ restaurante:1 })>L.avalMenu({}),'conta na Diversidade do cardápio');
  // quem pede PF pode pedir a parmegiana; vegetariano nunca
  g.save.cursos={ restaurante:1 }; let parm=0, pf=0, vegParm=0; for(let k=0;k<400;k++){ const d=L.pedePrato('negocios',g,false,false); if(d==='parmegiana') parm++; if(d==='pf') pf++; if(L.pedePrato('negocios',g,false,true)==='parmegiana') vegParm++; }
  ok(parm>100 && pf>100 && vegParm===0,'metade dos PFs vira parmegiana depois do curso; vegetariano nunca ('+parm+' contra '+pf+')');
  // só na Avenida (fora do modo dev)
  const I=jogo(4,'industrial',{ bank:5000 }), gi=I.g; ok(gi.cursoProx('restaurante')===null && !gi.buyCurso('restaurante'),'na área industrial, o curso não está ao alcance');
  I.L.setShopGrupo('lanchonete'); I.L.setShopTab('cardapio'); ok(!/Cozinha de restaurante/.test(txt(grid(I))) && !gi.cardapioNovo.some(k=>/^restaurante/.test(k)),'e o cartão Cardápio não mostra o curso nem acende o selo "novo"');
  const D=load({ store:{ lcc2_dev:'1' } }); ok(D.L.cursoOk(D.L.cursoOf('restaurante'),D.L.PONTOS[0]),'no modo dev, o curso aparece em qualquer ponto'); }

// ---------- 10. cap. 6 ----------
{ const H=jogo(6,'avenida',{ capAzul:2 }), {g,L}=H; g.save.capDia=10;
  g.startDay(10); ok(/Capítulo 6, Do outro lado da rua: Fechar 3 dias no azul pagando o aluguel \(2 de 3\)/.test(H.els['intro-manut'].textContent),'a introdução traz "Fechar 3 dias no azul pagando o aluguel (2 de 3)"');
  H.els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=2500; g.custo=0; g.finishDay();
  ok(g.save.capAzul===3 && g.result.cap.n===6 && g.result.cap.ok && g.save.conversa==='depois','3 dias no azul: cap. 6 cumprido');
  ok(g.avancaCap()===false && g.save.cap===7 && g.save.conversa==='antes','depois do cap. 6: o cap. 7 começa com a conversa de antes');
  ok(L.HISTORIA.length===7 && L.HISTORIA[5].titulo==='Do outro lado da rua' && L.HISTORIA[5].antes.length===4 && L.HISTORIA[5].depois.length===3 && L.HISTORIA[6].titulo==='Nota de restaurante' && L.HISTORIA[6].antes.length===3 && L.HISTORIA[6].depois.length===5,'as falas dos caps. 6 e 7');
  ok(L.HISTORIA[5].depois[2].nota==='rindo' && L.HISTORIA[6].depois[1].nota==='tirando o avental' && L.HISTORIA[5].antes[1].nota==='olhando pela janela','as rubricas em itálico'); }

// ---------- 11. cap. 7 ----------
{ const H=jogo(7,'avenida',{ bank:1000 }), {g,L}=H; g.save.conversa=null;
  const dia=(nota,bank)=>{ H.g.startDay(H.g.save.dia); H.els['btn-start'].fire('click'); notaDe(H.g,nota,30); H.g.save.bank=bank; H.g.schedule=[]; H.g.nextIdx=0; H.g.money=0; H.g.custo=0; H.g.finishDay(); };
  g.startDay(10); ok(/Capítulo 7, Nota de restaurante: Nota do Gurugol 3,9/.test(H.els['intro-manut'].textContent) && /R\$ 5000 no caixa/.test(H.els['intro-manut'].textContent),'a introdução traz os 2 itens do cap. 7');
  dia(3.8,6000); ok(!g.result.cap.ok,'nota 3,8 com R$ 6.000: não cumpre');
  g.save.dia=11; dia(4.2,2000); ok(!g.result.cap.ok,'nota 4,2 com R$ 2.000: não cumpre');
  g.save.dia=12; dia(3.9,6000); ok(g.result.cap.ok && g.save.conversa==='depois','nota 3,9 e R$ 5.000: cap. 7 cumprido');
  ok(g.avancaCap()===true && g.save.cap===8 && g.save.conversa===null,'depois dele, save.cap = 8 e os dias seguem sem objetivo');
  g.save.dia=13; g.startDay(13); ok(!/Capítulo/.test(H.els['intro-manut'].textContent),'sem objetivo na introdução');
  g.setState('menu'); ok(/Avenida Brasil completa/.test(H.els['menu-dia'].textContent),'o menu diz "Avenida Brasil completa"'); }

// ---------- 12. os cartões de fim de capítulos ----------
{ const H=jogo(7,'avenida',{ capAzul:0, caixa:[] }), {g,L,els}=H; notaDe(g,4.1,30); g.save.bank=6000; g.save.conversa=null;
  g.startDay(10); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=0; g.custo=0; g.finishDay();
  ok(g.save.conversa==='depois','(cap. 7 cumprido)'); els['btn-next'].fire('click'); passa(H);
  ok(g.save.cap===8 && mostra(els,'ov-continua') && els['cont-h'].textContent==='Fim dos capítulos da Avenida Brasil' && els['cont-p'].textContent==='Continua na próxima versão: o Terraço Suíça.','depois do cap. 7: "Fim dos capítulos da Avenida Brasil", continua no Terraço Suíça');
  const H2=jogo(5,'industrial',{ bank:3000 }), g2=H2.g; notaDe(g2,3.5,30); g2.save.conversa=null; g2.save.capFeito=1; g2.startDay(10); H2.els['btn-start'].fire('click'); notaDe(g2,3.5,30); g2.schedule=[]; g2.nextIdx=0; g2.money=0; g2.custo=0; g2.finishDay();
  ok(g2.save.conversa==='depois','(cap. 5 cumprido)'); H2.els['btn-next'].fire('click'); passa(H2);
  ok(g2.save.cap===6 && g2.save.conversa===null && mostra(H2.els,'ov-continua') && H2.els['cont-h'].textContent==='Fim dos capítulos da área industrial' && /mudança para a Avenida Brasil está na lojinha/.test(H2.els['cont-p'].textContent),'depois do cap. 5: o cartão manda para a mudança para a Avenida Brasil (na lojinha)');
  ok(/Continua na próxima versão: o Terraço Suíça\./.test(html) && /mudança para a área industrial está na lojinha/.test(html),'os textos de fim estão em HISTORIA.fim'); }

// ---------- 13. saves ----------
{ const H=nova(), {g,L}=H;
  const v9=L.normSave({ histV:1, cap:6, dia:30, bank:3000, salao:{ ponto:'industrial' }, up:{ tvs:true, assento:'banco', maquina:true, fogaoInd:true }, equipe:{ tonhao:2, dani:2, tvs:1 } });
  ok(v9.salao.ponto==='industrial' && v9.cap===6 && v9.conversa===null && v9.up.tvs && v9.up.assento==='banco' && v9.equipe.tvs===1,'save da v9 na área industrial com o cap. 6 (fim do cap. 5): carrega igual, "à espera" da mudança');
  const v91=L.normSave({ histV:1, cap:6, dia:30, bank:3000, conversa:'antes', salao:{ ponto:'avenida' }, up:{ assento:'sofa', fogaoInd:true }, equipe:{ tonhao:2, dani:2, couvert:true, tvs:2, tv:true } });
  ok(v91.salao.ponto==='avenida' && v91.up.assento==='sofa' && v91.conversa==='antes' && v91.equipe.couvert && v91.equipe.tvs===0 && !v91.equipe.tv,'save na Avenida: o sofá e o couvert ficam; TVs e TV da Garagem não existem lá');
  const gar=L.normSave({ histV:1, cap:4, dia:12, bank:900 }); ok(gar.salao.ponto==='garagem' && gar.cap===4 && gar.conversa===null,'save da Garagem com o cap. 4: à espera da mudança (como na v9)');
  const ind=L.normSave({ histV:1, cap:4, dia:12, bank:900, conversa:'antes', salao:{ ponto:'industrial' } }); ok(ind.conversa==='antes','na área industrial o cap. 4 começa normalmente');
  const lixo=L.normSave({ histV:1, cap:6, dia:12, bank:900, up:{ assento:'sofá errado' } }); ok(!lixo.up.assento,'assento desconhecido é ignorado');
  const H2=jogo(6,'industrial'); H2.g.setState('menu'); ok(/área industrial completa/.test(H2.els['menu-dia'].textContent),'menu: cap. 6 na área industrial é "área industrial completa"');
  const H3=jogo(6,'avenida'); H3.g.setState('menu'); ok(/cap\. 6, Do outro lado da rua/.test(H3.els['menu-dia'].textContent),'menu na Avenida: "cap. 6, Do outro lado da rua"'); }

// ---------- 14. o desenho (cenário, gente e prato) sem erro ----------
{ const H=jogo(6,'avenida',{ bank:5000, up:{ tenis:true, assento:'sofa', maquina:true, fogaoInd:true }, equipe:{ tonhao:1, dani:1, couvert:true }, decor:{ tulipa:1, copo:1, orquidea:1, violeta:1, anturio:1, pendente:1 }, cursos:{ restaurante:2 } }), {g,L}=H;
  let erro=''; try {
    g.startDay(10); H.els['btn-start'].fire('click'); for(const t of ['negocios','negocios','familia','vovos','estudante','executiva']) g.arrive({ t:0, type:t, color:0, vip:false });
    for(let i=0;i<40;i++) g.update(0.05); L.render(g,H.ctx);
    const q=new L.Group(g,'negocios',++g.gid,0,false); q.people.forEach(p=>{}); L.drawDish(H.ctx,'parmegiana',0,0,1.2,false,'bife',true); L.drawDish(H.ctx,'parmegiana',0,0,1.2,false,'bife',false);
    g.setState('menu'); L.render(g,H.ctx);
  } catch(e){ erro=String(e.stack); }
  ok(!erro,'renderiza a Avenida com gente, sofás, flores e a parmegiana sem erro'+(erro?': '+erro:'')); }

console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
