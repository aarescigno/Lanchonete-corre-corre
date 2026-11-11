// v10, etapa 4a-1 (parte A): o Terraço Suíça. O cartão Mudança (cap. 8), o que vai, o que sai e a venda das mesas que sobram, o aluguel e os preços,
// a clientela (o casal, sem estudante, entregador, turma, motorista nem encomenda; VIP só de tipo do ponto), as poltronas do foyer, o piano como
// obstáculo fixo, o cap. 8, o save da v9.6.13 e as fichas do Manual. A parte B acrescenta a refeição completa (o pedido em dois tempos, a cozinha, a bebida e a
// sobremesa, as notas de cada tempo e o Gurugol, a refeição completa e a trilha dos tempos), o cap. 9 com o cartão de fim e a ficha b-tempos.
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
// um jogo de História no cap. dado, num ponto ('garagem', 'industrial', 'avenida' ou 'terraco')
const jogo=(cap,ponto,sv)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto:ponto||'garagem' } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const html=fs.readFileSync(__dirname+'/../lanchonete.html','utf8');
const btn=H=>grid(H).children[0].children.filter(c=>c.tagName==='BUTTON'&&!/qm/.test(c.className||'')).pop();
// a Avenida com 6 mesas de 4 (24 lugares) e, se pedido, mais uma de 4 no estoque
const salaoAv=(L,est)=>({ ponto:'avenida', mesas:L.salaoAuto([4,4,4,4,4,4].map((seats,c)=>({ seats, c:c%4 })),L.PONTOS[2]), estoque:est?[{ seats:4, c:0 }]:[] });

// um dia de Terraço aberto, com a equipe toda por padrão (Anselmo e a confeitaria da Dani); sem mesas fora dos 5 lugares de sempre
const terr=(sv,cap)=>{ const H=jogo(cap||8,'terraco',Object.assign({ bank:5000, v10:1, daniCursos:{ confCaseira:1 }, up:{ tenis:true, fogaoInd:true }, equipe:{ tonhao:3, dani:2, anselmo:2 } },sv||{})); H.g.startDay(10); H.els['btn-start'].fire('click'); H.g.schedule=[]; H.g.nextIdx=0; return H; };
const sentar=(g,type,vip)=>{ const grp=g.spawn({ type:type||'casal', color:0, vip:!!vip, av:true }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantOrder'); return { grp, t }; };
// a Bia anota e leva a comanda à janela
const pedir=(H,grp,t)=>{ const b=H.g.bia; b.hands=[]; b.perform({ type:'table', id:t.id }); b.perform({ type:'order' }); };
const preco=(L,g,k)=>k?L.precoPrato(k,g.ponto,g.cursos):0;
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const pegaPrato=(H,grp)=>{ const g=H.g, p=g.kitchen.plates.find(q=>q&&q.group===grp); if(!p) return null; g.bia.hands=[]; g.bia.perform({ type:'plate', pid:p.id }); return p; };

// ---------- 1. o cartão Mudança (cap. 8 em diante) ----------
{ let H=jogo(7,'avenida',{ bank:9000 }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro');
  ok(cartoes(H).join()==='banco,caixa' && !H.g.mudancaVisivel,'na Avenida com o cap. 7: sem o cartão Mudança');
  H=jogo(8,'avenida',{ bank:9000 }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro'); const lista=cartoes(H).join(); H.L.setShopTab('mudanca');
  ok(H.g.mudancaVisivel && lista==='banco,mudanca,caixa' && H.g.proximoPonto.id==='terraco','com o cap. 8: o cartão Mudança aparece (para o Terraço Suíça)');
  ok(/Mudança: Terraço Suíça/.test(txt(grid(H))) && /Mudança R\$ 5000 · aluguel R\$ 1200\/dia/.test(txt(grid(H))),'o cartão: só o nome, a mudança (R$ 5.000) e o aluguel (R$ 1.200)');
  ok(btn(H) && /Mudar: R\$ 5000/.test(btn(H).textContent) && !btn(H).disabled && H.L.avalMinimo(H.L.PONTOS[2])===3.9,'com R$ 5.000 e nota ≥ 3,9: o botão fica aceso (nota mínima 3,9)');
  H=jogo(8,'avenida',{ bank:3000 }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Falta R\$ 2000/.test(btn(H).textContent),'sem o dinheiro: apagado, "Falta R$ 2000"');
  H=jogo(8,'avenida',{ bank:9000 }); notaDe(H.g,3.8); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Nota 3,9 \(agora 3,8\)/.test(btn(H).textContent),'sem a nota: apagado, "Nota 3,9 (agora 3,8)"');
  H=jogo(8,'avenida',{ bank:100 }); notaDe(H.g,2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(/Falta R\$ 4900 · Nota 3,9/.test(btn(H).textContent),'sem os dois: mostra os dois');
  H=jogo(8,'avenida',{ bank:9000, salao:salaoAv(H.L) }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca'); btn(H).fire('click');
  ok(/Mudar para o Terraço Suíça por R\$ 5000\? Aluguel de R\$ 1200 por dia\. O Terraço tem 20 lugares: as mesas que não couberem são vendidas\. Não dá para voltar\./.test(txt(grid(H))) && H.g.save.salao.ponto==='avenida','1º toque: pede a confirmação (com a frase das mesas), nada muda');
  const ic=H.L.iconeMudanca(H.g.proximoPonto); ok(ic==='mudanca-te' && H.L.iconeMudanca(H.L.PONTOS[2])==='mudanca-av' && H.L.iconeMudanca(H.L.PONTOS[1])==='mudanca','o ícone do cartão: prédio alto para o Terraço (mudanca-te)');
  const sim=grid(H).children[0].children.find(c=>c.tagName==='DIV').children[0]; sim.fire('click');
  ok(H.g.save.salao.ponto==='terraco','2º toque: mudou');
  // o botão do cartão no grupo Dinheiro tem o ícone novo
  // a área industrial não vê o cartão do Terraço; a mudança para a Avenida segue igual
  H=jogo(6,'industrial',{ bank:5000 }); notaDe(H.g,3.6); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(/Mudança: Restaurante na Avenida Brasil/.test(txt(grid(H))) && !/Terraço/.test(txt(grid(H))),'na área industrial o cartão segue o da Avenida (sem a frase das mesas, que só vale com menos lugares)');
  // modo dev: o cartão da Avenida já leva ao Terraço
  const D=load({ store:{ lcc2_dev:'1' } }); D.g.save.aval=[]; D.g.save.salao.ponto='avenida'; D.g.save.salao=D.L.normSalao(D.g.save.salao); D.g.goShop(3); const b0=D.g.save.bank;
  ok(D.g.mudancaVisivel && !D.g.mudancaFalta && D.g.mudarPonto() && D.g.save.salao.ponto==='terraco' && D.g.save.bank===b0,'modo dev: o cartão aparece sempre e a mudança é de graça'); }

// ---------- 2. mudar ----------
{ const H=jogo(8,'avenida',{ bank:9000, up:{ tenis:true, maquina:true, assento:'sofa', fogaoInd:true, pratos:2 }, equipe:{ tonhao:3, dani:2, joca:2, cami:1, anselmo:2, couvert:true }, cursos:{ restaurante:1 }, decor:{ espada:1, tulipa:1, anturio:1 } }), {g,L}=H;
  g.save.salao=L.normSalao(salaoAv(L)); notaDe(g,4.2);
  const antes=g.save.salao.mesas.length, lug=g.lugaresTot;
  ok(antes===6 && lug===24 && g.up.assento==='sofa' && g.up.maquina,'(antes) 6 mesas de 4, sofás e águas na Avenida');
  const b0=g.save.bank; ok(g.mudarPonto(),'mudou'); const sv=g.save;
  ok(sv.salao.ponto==='terraco' && g.ponto.lugares===20 && g.ponto.nivel===4,'o ponto novo (20 lugares, nível 4)');
  ok(sv.bank===b0-5000+125,'−R$ 5.000 e a mesa que sobrou, vendida pela metade (+R$ 125)');
  ok(sv.salao.mesas.length===5 && g.lugaresTot===20 && L.salaoProblema(sv.salao.mesas,L.PONTOS[3])==='' && sv.salao.estoque.length===0,'5 mesas de 4 (20 lugares) com arranjo válido, a 6ª vendida');
  ok(!sv.up.assento && !sv.up.maquina,'os sofás e as águas saem do save');
  ok(sv.up.fogaoInd && sv.up.tenis && sv.up.pratos===2 && sv.equipe.tonhao===3 && sv.equipe.dani===2 && sv.equipe.joca===2 && sv.equipe.cami===1 && sv.equipe.anselmo===2 && sv.equipe.couvert && sv.cursos.restaurante===1 && sv.decor.espada===1 && sv.decor.tulipa===1 && sv.decor.anturio===1,'o fogão industrial, as melhorias, os pratos, a equipe (com o Anselmo e a Cami), o couvert, os cursos e as plantas vão junto');
  ok(sv.cap===8 && sv.conversa==='antes' && sv.capAzul===0,'o cap. 8 começa, com a conversa de antes pendente');
  g.resetDay(10); ok(L.PLATE_SLOTS.length===6 && g.kitchen.plates.length===6 && L.QUEUE.ys.length===6 && g.ponto.credito===8000,'6 vagas de prato e 6 de espera; o limite do banco sobe para R$ 8.000');
  ok(!g.mudancaVisivel && g.proximoPonto===null,'o Terraço é o último ponto: não há mais mudança');
  ok(L.DOOR.x===-230 && L.DOOR.y===116,'a freguesia chega pela porta do elevador (DOOR)');
  g.resetDay(0); ok(L.DOOR.x===-300 && L.DOOR.y===106,'o Turno sem fim volta para a rua'); g.resetDay(10);
  // o estoque é vendido primeiro: 5 mesas no salão + 1 no estoque (24 lugares)
  const H2=jogo(8,'avenida',{ bank:9000, salao:salaoAv(L,false) }), g2=H2.g; g2.save.salao=H2.L.normSalao({ ponto:'avenida', mesas:salaoAv(L).mesas.slice(0,5), estoque:[{ seats:4, c:1 }] }); notaDe(g2,4.2);
  const m5=JSON.stringify(g2.save.salao.mesas.map(m=>m.seats)), c0=g2.save.bank; g2.mudarPonto();
  ok(g2.save.salao.estoque.length===0 && g2.save.salao.mesas.length===5 && JSON.stringify(g2.save.salao.mesas.map(m=>m.seats))===m5 && g2.save.bank===c0-5000+125,'a mesa do estoque é vendida primeiro; o salão não perde nenhuma');
  // duas mesas de 2 no estoque (24 lugares): saem as duas, a R$ 75 cada, e o salão fica como está
  const H3=jogo(8,'avenida',{ bank:9000, salao:{ ponto:'avenida', mesas:L.salaoAuto([4,4,4,4,4].map((seats,c)=>({ seats, c:c%4 })),L.PONTOS[2]), estoque:[{ seats:2, c:0 },{ seats:2, c:1 }] } }), g3=H3.g; notaDe(g3,4.2); const d0=g3.save.bank, n0=g3.lugaresTot; g3.mudarPonto();
  ok(n0===24 && g3.lugaresTot===20 && g3.save.salao.mesas.length===5 && g3.save.salao.estoque.length===0 && g3.save.bank===d0-5000+150,'duas mesas de 2 no estoque (24 lugares): saem as duas, a R$ 75 cada'); }

// ---------- 3. aluguel e preços ----------
{ const H=jogo(8,'terraco',{ bank:3000 }), {g,L}=H; g.resetDay(10);
  ok(g.ponto.aluguel===1200 && L.precoPrato('pf',g.ponto,g.cursos)===60 && L.PONTOS[3].cardapio===2.4 && L.precoPrato('coxinha',g.ponto,g.cursos)===Math.round(L.CARDAPIO.coxinha.preco*2.4),'aluguel R$ 1.200 e cardápio ×2,4 (PF R$ 60; calibrado: o plano partia de R$ 1.000 e ×2,5)');
  g.begin(); const base=L.CONTAS.base+g.tables.filter(t=>t.open).length*L.CONTAS.mesa+g.tables.filter(t=>t.open).reduce((a,t)=>a+t.seats,0)*L.CONTAS.lugar;
  ok(g.contas===base+1200,'as contas do dia somam o aluguel de R$ 1.200');
  g.schedule=[]; g.nextIdx=0; g.money=1500; g.custo=0; const b0=g.save.bank; g.finishDay();
  ok(g.save.bank===b0+1500-g.contas-g.paid-g.paidDiv && g.save.caixa[g.save.caixa.length-1].contas===g.contas,'o aluguel sai no fim do dia e entra no livro-caixa');
  const D=g.diaPonto(L.diaOf(10)); ok(D.meta===Math.round(L.diaOf(10).meta*9/5)*5 && D.expert===Math.round(L.diaOf(10).expert*6/5)*5 && L.PONTOS[3].grupos===0.5,'metas ×9 e expert ×6 (calibrados em 10/11 com a equipe toda), arredondadas para 5; grupos 0,50'); }

// ---------- 4. a clientela ----------
{ const H=jogo(8,'terraco',{ bank:3000, dia:10 }), {g,L}=H; g.save.divulga='boca'; g.resetDay(10);
  ok(L.PONTOS[3].tipos.casal===2 && L.PONTOS[3].semRetirada===true && L.PONTOS[3].tempos===true && L.PONTOS[3].bebida==='coquetel','PONTOS[3]: casal peso 2, sem retirada, com tempos (parte B) e coquetel de boas-vindas (v10.3)');
  const cont=(game,mod)=>{ const r={ tipos:{}, n:0, vip:0, vipFora:0 }; for(let k=0;k<300;k++){ const d=mod?mod(game):game.day; const sc=game.buildSchedule(d); sc.forEach(s=>{ r.tipos[s.type]=(r.tipos[s.type]||0)+1; r.n++; if(s.vip){ r.vip++; if(!L.vipTipos(game.ponto).includes(s.type)) r.vipFora++; } }); } return r; };
  const proibidos=r=>['estudante','entregador','turma','motorista','encomenda'].every(k=>!r.tipos[k]);
  const r0=cont(g); ok(r0.tipos.casal>0 && r0.tipos.casal/r0.n>0.2 && r0.tipos.casal/r0.n<0.45 && proibidos(r0),'em 300 dias o casal aparece (~35%) e não vem estudante, entregador, turma, motorista nem encomenda');
  g.clima='chuva'; const r1=cont(g); ok(proibidos(r1) && r1.tipos.casal>0,'nem com chuva');
  g.clima=''; const r2=cont(g,game=>Object.assign({},game.day,{ tipo:'entregador', tipoP:0.4 })); ok(proibidos(r2),'nem na sexta-feira (o tipo do dia vira um tipo pequeno do ponto)');
  g.clima='feriado'; const r3=cont(g); ok(proibidos(r3) && r3.tipos.familia>0,'nem no feriado (famílias, sim)'); g.clima='';
  ok(r0.vip>0 && r0.vipFora===0 && r1.vipFora===0 && r2.vipFora===0 && L.vipTipos(g.ponto).join()==='vovos,familia,executiva,casal','VIP só de tipo do ponto: vovós, família, executiva ou casal');
  ok(L.VIP.types.includes('casal') && L.vipTipos(L.PONTOS[2]).join()==='estudante,vovos,familia,executiva' && L.vipTipos(L.PONTOS[0]).join()==='estudante,vovos,familia,executiva' && L.vipTipos(L.PONTOS[1]).join()==='estudante,vovos,familia,executiva','VIP.types ganha casal, mas a Garagem, a área industrial e a Avenida seguem com os de sempre');
  g.schedule=[{ t:0, type:'entregador', color:0, vip:false }]; ok(g.marmitaOk===false,'marmitaOk é falso no Terraço (mesmo com entregador na lista)');
  const a=jogo(8,'avenida').g; a.resetDay(10); a.schedule=[{ t:0, type:'entregador', color:0, vip:false }]; ok(a.marmitaOk===true,'na Avenida, nada muda');
  const T=L.CUSTOMER_TYPES.casal; ok(T.label==='Casal' && T.pat===1.3 && T.eat.join()==='8,10' && T.read.join()==='4,5.5' && T.size.join()==='2,2' && T.mais===0.2 && T.tip===0.15 && !T.ind && !T.retira,'Casal: paciência 1,3, come 8 a 10 s, 2 pessoas, gorjeta 15%');
  ok(L.GOSTOS.casal.join()==='4,1,2,1,1' && L.DOCES.pede.casal===0.6 && L.CAFES.pede.casal===0.5 && L.DRINKS.pede.casal===0.6,'gostos e os pedidos de doce, café e drink do casal');
  ok(L.AVAL_CRIT[1].tipo.casal.bom[0]==='Data especial do jeitinho que a gente sonhou!' && L.AVAL_CRIT[1].tipo.casal.ruim[0]==='Era pra ser uma data especial...','comentários próprios do casal na Agilidade');
  let viu=0; for(let k=0;k<200;k++){ const c=L.avalComentario([4.5,4.5,4.5,4.5,4.5],'',false,4,[],false,false,'casal',false); if(c==='Data especial do jeitinho que a gente sonhou!') viu++; } ok(viu>60 && viu<140,'o comentário do casal aparece em ~metade das vezes');
  // o visual: pares de adultos, uma roupa de sair cada um e uma flor num deles
  let semFlor=0, dupla=0, okRoupa=true, peles=new Set(), vest=0, camisa=0, blazer=0, lap=0, cab=0, vel=0, kid=0;
  for(let k=0;k<200;k++){ const q=new L.Group(g,'casal',++g.gid,0,false); if(q.people.length!==2) dupla++; const fl=q.people.filter(p=>p.flor); if(fl.length!==1) semFlor++;
    q.people.forEach(p=>{ peles.add(p.skin); if(p.kid) kid++; if(p.elder) vel++; const n=(p.vestido?1:0)+(p.camisa==='social'?1:0)+(p.blazer?1:0); if(n!==1) okRoupa=false; if(p.vestido) vest++; if(p.camisa==='social') camisa++; if(p.blazer) blazer++; if(p.flor==='lapela') lap++; if(p.flor==='cabelo') cab++; }); }
  ok(!dupla && !semFlor && okRoupa && kid===0 && peles.size>=4 && vest>40 && camisa>40 && blazer>40 && lap>20 && cab>20 && vel>10 && vel<100,'casal: 2 adultos, uma roupa de sair cada (vestido, camisa ou blazer, qualquer pessoa), idades e peles variadas e uma flor (lapela ou cabelo)');
  let erro=''; try { const q=new L.Group(g,'casal',++g.gid,1,false); q.people.forEach(p=>{ L.drawPerson(H.ctx,p,100,100,{ shirt:'#C2362B', mood:0 }); L.drawPerson(H.ctx,p,100,100,{ sit:true, back:true, mood:1 }); L.drawPerson(H.ctx,p,100,100,{ sit:true, mood:2 }); }); } catch(e){ erro=String(e.stack); }
  ok(!erro,'desenha o casal de frente, sentado e de costas sem erro'+(erro?': '+erro:''));
  g.arrive({ t:0, type:'casal', color:0, vip:true }); ok(g.groups.some(q=>q.type==='casal' && q.vip) && L.VIP.types.includes('casal'),'o casal pode ser VIP'); }

// ---------- 5. as poltronas do foyer ----------
{ const H=jogo(8,'terraco',{ bank:2000 }), {g,L}=H; g.resetDay(10);
  ok(L.TERRACO.poltrona.cost===600 && L.TERRACO.poltrona.slow===0.35 && L.assentoSlow('poltrona')===0.35 && L.assentoSlow('sofa')===0.25 && L.assentoSlow('banco')===0.15,'poltronas: R$ 600, espera 35% mais devagar (o sofá 25%, o banco 15%)');
  H.L.setShopGrupo('lanchonete'); H.L.setShopTab('melhorias'); const t=txt(grid(H));
  ok(/Poltronas do foyer/.test(t) && !/Água|Jarra|saborizadas|Sofás/.test(t),'a aba Melhorias do Terraço: as poltronas, sem o cartão da bebida da espera nem o sofá');
  ok(!g.comprarInd('assento','sofa') && !g.comprarInd('assento','cadeira') && !g.comprarInd('assento','banco') && g.save.bank===2000 && !g.up.assento,'o sofá e a cadeirinha não se compram no Terraço');
  ok(!g.buy('maquina') && !g.up.maquina && g.save.bank===2000,'buy("maquina") recusa (sem bebida da espera)');
  ok(g.comprarInd('assento','poltrona') && g.up.assento==='poltrona' && g.save.bank===1400 && !g.comprarInd('assento','poltrona') && g.save.bank===1400,'comprar as poltronas: −R$ 600, uma vez só');
  H.L.setShopTab('melhorias'); ok(/Já comprado/.test(txt(grid(H))) && g.sentado===true,'o cartão vira "Já comprado" e a espera passa a ser sentada');
  g.begin(); const q=new L.Group(g,'casal',++g.gid,0,false); q.setState('queue'); const comP=q.patPer(); g.up.assento=null; q.setState('queue'); const sem=q.patPer();
  ok(Math.abs(comP/sem-1/(1-0.35))<1e-9,'a paciência na espera dura 1/(1−0,35) vezes mais com as poltronas');
  const A=jogo(8,'avenida',{ bank:2000 }).g; ok(!A.comprarInd('assento','poltrona') && A.comprarInd('assento','sofa'),'a poltrona não se compra na Avenida (o sofá, sim)');
  const D=load({ store:{ lcc2_dev:'1' } }); D.g.save.salao.ponto='terraco'; D.g.save.salao=D.L.normSalao(D.g.save.salao); D.g.up=D.g.save.up; ok(D.g.devToggle('maquina')===false,'modo dev: a água da espera não liga no Terraço'); }

// ---------- 6. o piano ----------
{ const H=jogo(8,'terraco',{ bank:2000 }), {g,L}=H; g.resetDay(10);
  const P=L.TERRACO.piano, a=L.PONTOS[3].area;
  ok(P.x0===28 && P.y0===404 && P.x1===148 && P.y1===520 && P.x1<=a.x0,'o piano: caixa fora da área das mesas (x 28 a 148, y 404 a 520)');
  ok(L.fixosDe(L.PONTOS[3]).length===1 && !L.fixosDe(L.PONTOS[2]).length && !L.fixosDe(L.PONTOS[0]).length && L.OBST.some(o=>o.x0===P.x0 && o.y0===P.y0 && o.x1===P.x1 && o.y1===P.y1),'é obstáculo fixo dos caminhos só no Terraço (entra em setObst com as mesas)');
  const de={ x:L.QUEUE.x, y:L.QUEUE.ys[0] }, para=[{ x:178, y:470 },{ x:178, y:440 },{ x:190, y:500 },{ x:200, y:480 }].find(p=>!L.OBST.some(o=>p.x>o.x0 && p.x<o.x1 && p.y>o.y0 && p.y<o.y1)), cam=L.findPath(de,para);
  let b=de, livre=true; cam.forEach(p=>{ if(!L.pathOk(b,p)) livre=false; b=p; });
  ok(cam.length>1 && L.pathOk(de,para) && livre,'o caminho da fila até uma mesa de baixo dá a volta no piano');
  const reto={ x:L.QUEUE.x, y:470 }; ok(L.findPath(reto,para).length>1 && L.pathOk(reto,para),'a linha reta pelo piano está bloqueada (o caminho dá a volta por cima ou por baixo)');
  // o arranjo e a compra de mesa respeitam o piano (a área já o deixa de fora) e o editor mostra o piano
  ok(L.salaoProblema(g.save.salao.mesas,g.ponto)==='' && L.salaoCaminho(g.save.salao.mesas,g.ponto),'o salão do Terraço tem caminho até todas as mesas com o piano');
  ok(L.salaoAuto([4,4,4,4,4].map((seats,c)=>({ seats, c:c%4 })),g.ponto)!==null,'5 mesas de 4 cabem na arrumação automática do Terraço');
  const AvH=jogo(8,'avenida',{ bank:2000 }); ok(AvH.g.tables.length>0 && !AvH.L.OBST.some(o=>o.x0===P.x0 && o.y1===P.y1),'na Avenida o piano não existe (os obstáculos são refeitos)'); }

// ---------- 6b. o desenho sem erro ----------
{ const H=jogo(8,'terraco',{ bank:3000, up:{ tenis:true, fogaoInd:true, assento:'poltrona' }, equipe:{ tonhao:3, dani:2, joca:2, cami:1, anselmo:2, couvert:true }, decor:{ tulipa:1, copo:1, orquidea:1, violeta:1, anturio:1, pendente:1, espada:1, lata:1, foto:1, placa:1, giz:1, samambaia:1 } }), {g,L}=H;
  let erro=''; try {
    g.startDay(10); H.els['btn-start'].fire('click'); for(const t of ['casal','casal','familia','vovos','negocios','executiva','casal']) g.arrive({ t:0, type:t, color:0, vip:t==='casal' });
    for(let i=0;i<60;i++) g.update(0.05); L.render(g,H.ctx);
    g.up.assento=null; g.save.up=g.up; L.render(g,H.ctx);
    g.setState('menu'); L.render(g,H.ctx);
    L.drawPiano(H.ctx,g); L.drawPoltrona(H.ctx,50,50,1); L.drawElevadorTe(H.ctx,g); L.drawFoyerTe(H.ctx,g,0); L.drawLugarTe(H.ctx,-132,300,0,true); L.drawLugarTe(H.ctx,-132,300,0,false);
    const t0=new L.Table({ id:1, cx:300, cy:300, seats:4, color:1, toalha:false }); t0.open=true; L.drawTable(H.ctx,g,t0,0,false); t0.open=false; L.drawTable(H.ctx,g,t0,0,false);
    g.resetDay(10); g.seloOn=true; L.render(g,H.ctx);
  } catch(e){ erro=String(e.stack); }
  ok(!erro,'renderiza o Terraço com gente, poltronas, flores, piano e elevador sem erro'+(erro?': '+erro:''));
  const RMH=load({ rm:true, historia:true }); RMH.doc.createTextNode=t=>({textContent:String(t),children:[]}); let e2='';
  try { RMH.g.save=RMH.L.normSave({ histV:1, cap:8, dia:10, maxDay:10, bank:3000, salao:{ ponto:'terraco' } }); RMH.g.tablesKey=''; RMH.g.buildTables(); RMH.g.startDay(10); RMH.g.arrive({ t:0, type:'casal', color:0, vip:false }); for(let i=0;i<20;i++) RMH.g.update(0.05); RMH.L.render(RMH.g,RMH.ctx); } catch(e){ e2=String(e.stack); }
  ok(!e2,'com movimento reduzido também renderiza sem erro'+(e2?': '+e2:''));
  ok(/mudanca-te/.test(html) && /Poltronas do foyer/.test(html) && /Terraço Suíça/.test(html),'o arquivo montado tem o ícone, as poltronas e o nome do ponto'); }

// ---------- 7. o pedido da refeição completa ----------
{ const H=terr(), {g,L}=H; let semEntrada=0, semPf=0, contaErrada=0, veg=0, n=0;
  for(let k=0;k<300;k++){ const q=new L.Group(g,['casal','familia','vovos','negocios','executiva'][k%5],++g.gid,0,false); n++;
    ok2: { if(!q.tempos){ semPf+=1000; break ok2; }
      q.people.forEach((p,i)=>{ if(L.CARDAPIO[q.dishes[i]].cat!=='pf') semPf++; if(p.veg){ veg++; } else if(!q.extras[i]) semEntrada++; });
      const soma=q.dishes.concat(q.extras).reduce((v,x)=>v+preco(L,g,x),0)+(q.vip?L.vipDish(q):0); if(q.bill!==soma) contaErrada++; } }
  ok(n===300 && semEntrada===0 && semPf===0 && contaErrada===0 && veg>0,'o grupo do Terraço: uma entrada para cada pessoa (menos o vegetariano sem opção) e o principal da categoria PF; a conta soma os dois');
  const q=new L.Group(g,'familia',++g.gid,0,false); ok(q.tempos===true && q.tempo===0 && q.notaT.length===4 && q.notaT.every(v=>v===null) && L.TEMPOS.entrada.cook===0.6 && L.TEMPOS.entrada.eat===0.5 && L.TEMPOS.pts===30 && L.PONTOS_ACAO.completa===30,'grupo com `tempos`: começa na entrada (tempo 0), notas vazias; TEMPOS e os 30 pontos');
  // o principal com os pratos que a cozinha sabe: parmegiana (curso Cozinha de restaurante) e o PF vegetariano
  const G2=terr({ cursos:{ restaurante:1, veg:1 } }).g; const vistos={}; for(let k=0;k<400;k++){ const q2=new L.Group(G2,'negocios',++G2.gid,0,false); q2.dishes.forEach(d=>{ vistos[d]=(vistos[d]||0)+1; }); }
  ok(Object.keys(vistos).every(d=>L.CARDAPIO[d].cat==='pf') && vistos.pf>0 && vistos.parmegiana>0 && vistos.pfVeg>0,'o principal sai de PF, PF vegetariano e parmegiana (os que a cozinha sabe)');
  const vg=L.pedePrincipal('casal',G2,true); ok(!L.CARDAPIO[vg].carne,'vegetariano: o principal é sem carne');
  const G3=terr().g; ok(L.pedePrincipal('casal',G3,true)==='pf','vegetariano sem prato vegetariano: o PF (e o grupo reclama no Cardápio)');
  const q3=new L.Group(G3,'casal',++G3.gid,0,false); q3.people.forEach(p=>{ p.veg=true; });
  // na Missão zero e no Turno sem fim não há tempos
  const Z=load({}); Z.g.startTreino && Z.g.startTreino(); const qz=new L.Group(Z.g,'vovos',1,0,false); ok(!qz.tempos,'na Missão zero o grupo não tem tempos'); }

// ---------- 8. a cozinha em dois pedidos ----------
{ const H=terr(), {g,L}=H, k=g.kitchen; k.clean=5; k.slots=3;
  const { grp, t }=sentar(g,'casal'); grp.extras=['coxinha','coxinha']; grp.dishes=['pf','pf']; grp.dish='pf'; grp.bill=2*preco(L,g,'coxinha')+2*preco(L,g,'pf');
  const c0=g.custo, cook=k.chef.cook; pedir(H,grp,t);
  const e=k.queue.concat(k.cooking).filter(q=>q.group===grp);
  ok(e.length===1 && e[0].tempo===0 && e[0].dish==='coxinha' && grp.state==='ordered' && e[0].time>=4*cook*0.6-1e-9 && e[0].time<=7*cook*0.6+1e-9,'a comanda entra na cozinha como o pedido da entrada: tempo ×0,6 (sem o 2º item nem o ×VIP)');
  let guarda=false; for(let i=0;i<400 && !k.plates.some(q=>q&&q.group===grp);i++){ g.update(0.05); }
  const pe=k.plates.find(q=>q&&q.group===grp);
  ok(pe && pe.tempo===0 && k.clean===5,'a entrada pronta ocupa uma vaga do balcão mas não gasta prato limpo');
  ok(Math.round(g.custo-c0)===Math.round(2*preco(L,g,'coxinha')*L.INGRED.prato),'ingrediente da entrada: sobre o valor das entradas');
  ok(g.kitchen.queue.concat(k.cooking).every(q=>q.group!==grp),'o principal ainda não foi para a cozinha (só depois da entrada entregue)');
  const mao=pegaPrato(H,grp); ok(g.bia.hands.length===1 && g.bia.hands[0].tempo===0 && g.bia.hands[0].dish==='coxinha','o prato na mão leva o tempo (a entrada)');
  const cx=g.custo; g.bia.perform({ type:'table', id:t.id });
  ok(grp.state==='eating' && grp.tempo===0 && grp.notaT[1]!=null && grp.entradaDada,'entregue a entrada: o grupo come e a nota da entrada fica guardada');
  const pr=k.queue.concat(k.cooking).filter(q=>q.group===grp);
  ok(pr.length===1 && pr[0].tempo===1 && pr[0].dish==='pf' && pr[0].time>=4*cook-1e-9 && pr[0].time<=7*cook+1e-9,'a cozinha recebe sozinha o principal (tempo normal)');
  ok(grp.timer>=L.CUSTOMER_TYPES.casal.eat[0]*0.5*0.85-1e-9 && grp.timer<=L.CUSTOMER_TYPES.casal.eat[1]*0.5+1e-9,'a entrada come em metade do tempo da refeição');
  roda(g,grp.timer+0.2);
  ok(grp.state==='ordered' && grp.tempo===1 && !grp.esperaSuco,'acabada a entrada, o grupo volta a esperar (tempo 1: o principal)');
  for(let i=0;i<400 && !k.plates.some(q=>q&&q.group===grp);i++) g.update(0.05);
  const pp=k.plates.find(q=>q&&q.group===grp), cp=g.custo; ok(pp && pp.tempo===1 && pp.dish==='pf' && k.clean===4,'o principal pronto gasta um prato limpo');
  pegaPrato(H,grp); g.bia.perform({ type:'table', id:t.id });
  ok(grp.state==='eating' && grp.tempo===1 && grp.principalDado && grp.notaT[2]!=null,'principal entregue: o grupo come de verdade');
  // ingrediente do principal (sobre o valor dos principais), medido quando o prato fica pronto
  const H2=terr(), g2=H2.g; g2.kitchen.clean=5; const s2=sentar(g2,'casal',true); s2.grp.extras=['coxinha','coxinha']; s2.grp.dishes=['pf','pf']; s2.grp.dish='pf'; s2.grp.bill=0; const cc=g2.custo;
  g2.kitchen.submitTempo(s2.grp,s2.t.id,1); for(let i=0;i<600 && !g2.kitchen.plates.some(q=>q&&q.group===s2.grp);i++) g2.update(0.05);
  ok(Math.round(g2.custo-cc)===Math.round((2*preco(L,g2,'pf')+L.vipDish(s2.grp))*L.INGRED.prato),'ingrediente do principal: sobre o valor dos principais mais o prato do VIP (o da casa)');
  { const vc=g2.kitchen.chef.cook; const tq=g2.kitchen.queue.concat(g2.kitchen.cooking), v=new L.Group(g2,'casal',++g2.gid,0,true); const k2=g2.kitchen; k2.queue=[]; k2.cooking=[]; k2.submitTempo(v,1,1); const it=k2.queue[0]; ok(it.time>=4*vc*L.vipCook(v,g2)-1e-9 && it.time<=7*vc*L.vipCook(v,g2)+1e-9,'o principal do VIP leva o ×VIP (no Terraço, o do prato da casa); a entrada dele, não'); k2.queue=[]; k2.submitTempo(v,1,0); ok(k2.queue[0].time<=7*vc*0.6+1e-9,'(entrada do VIP sem o ×VIP)'); }
  // o principal fura a fila das entradas que ainda não começaram
  const H3=terr(), g3=H3.g, k3=g3.kitchen; k3.slots=1; const A=new L.Group(g3,'casal',++g3.gid,0,false), B=new L.Group(g3,'casal',++g3.gid,0,false), C=new L.Group(g3,'casal',++g3.gid,0,false), D=new L.Group(g3,'casal',++g3.gid,0,false);
  k3.submitTempo(B,1,0); k3.update(0.01); k3.submitTempo(C,2,0); k3.submitTempo(D,3,0); k3.submitTempo(A,4,1);
  ok(k3.cooking[0].group===B && k3.queue.map(q=>q.group).join()===[A,C,D].join() && k3.queue[0].tempo===1,'o principal entra na fila na frente das entradas que ainda não começaram');
  // o grupo que vai embora tira os dois pedidos da cozinha
  g3.leaveCommon(C); ok(k3.queue.every(q=>q.group!==C),'quem sai tira o pedido da cozinha'); }

// ---------- 9. bebida e sobremesa ----------
{ const H=terr(), {g,L}=H; const q=sentar(g,'familia').grp; const w=terr({ equipe:{ tonhao:3, dani:2 } }); const q2=sentar(w.g,'familia').grp;
  ok(q.drinks.length===q.size && q.juiceWant===0 && !q.drinks.some(d=>!d),'com o Anselmo: um drink por pessoa e ninguém pede suco');
  ok(q2.drinks.length===0 && q2.juiceWant===q2.size,'sem o Anselmo: um suco por pessoa (o balcão de sucos de sempre)');
  // o drink só vai para a fila do Anselmo quando a Bia anota; cada um volta como coração e entra na conta
  pedir(H,q,g.tables.find(t=>t.group===q)); ok(g.drinkQ.length===q.size,'os drinks entram na fila do Anselmo ao anotar');
  const dq=terr(), gq=dq.g; q.state; 
  // a sobremesa: um doce por pessoa ao terminar o principal; sem a confeitaria, nenhum
  const fim=(gg,grp)=>{ grp.setState('eating'); grp.tempo=1; grp.principalDado=true; grp.timer=0.01; gg.update(0.05); gg.update(0.05); };
  const d1=sentar(g,'casal').grp; fim(g,d1); ok(d1.doces && d1.doces.length===d1.size && d1.esperaSuco,'com a confeitaria: um doce por pessoa ao terminar o principal (sem sorteio) e o grupo espera por eles');
  const sc=terr({ daniCursos:{} }); const d2=sentar(sc.g,'casal').grp; fim(sc.g,d2); ok(d2.doces && d2.doces.length===0,'sem a confeitaria: não há sobremesa');
  let todos=true; for(let i=0;i<60;i++){ const x=new L.Group(g,'executiva',++g.gid,0,false); x.setState('eating'); x.tempo=1; x.timer=0; x.update(0); if(!x.doces || x.doces.length!==x.size) todos=false; } ok(todos,'(sem sorteio: sempre, em 60 grupos)');
  // o café do Joca segue por chance (como hoje)
  const jj=terr({ equipe:{ tonhao:3, dani:2, anselmo:2, joca:2 }, up:{ tenis:true, fogaoInd:true }, jocaCursos:{ espresso:1 } }).g; let cs=0; ok(jj.up.espresso,'(o Joca tem o espresso)'); for(let i=0;i<200;i++){ const x=new L.Group(jj,'casal',++jj.gid,0,false); x.setState('eating'); x.tempo=1; x.timer=0; x.update(0); if(x.cafes && x.cafes.length) cs++; }
  ok(cs>40 && cs<160,'o café do Joca segue por chance (casal ~50%), depois da sobremesa'); }

// ---------- 10. as notas de cada tempo e o Gurugol ----------
{ const H=terr(), {g,L}=H, mk=(sv)=>{ const R=terr(sv); const s=sentar(R.g,'casal'); const q=s.grp; q.extras=['coxinha','coxinha']; q.dishes=['pf','pf']; q.dish='pf'; return { R, g:R.g, q, t:s.t }; };
  const entrega=(x,tempo,qv)=>{ x.g.bia.hands=[{ kind:'dish', table:x.t.id, group:x.q, dish:'pf', q:qv, tempo }]; x.q.setState('ordered'); x.q.tempo=tempo; x.g.bia.perform({ type:'table', id:x.t.id }); };
  let x=mk(); x.q.perdTempo[1]=1; entrega(x,1,4.4); ok(Math.abs(x.q.notaT[2]-3.4)<1e-9,'coração perdido esperando o principal tira 1 da nota dele (4,4 → 3,4)');
  x=mk(); x.q.perdTempo[0]=2; entrega(x,0,4); ok(Math.abs(x.q.notaT[1]-2)<1e-9,'dois corações perdidos esperando a entrada: −2 (4 → 2)');
  x=mk(); entrega(x,0,5); ok(x.q.notaT[1]===5,'sem perda, a nota é a do prato');
  x=mk(); x.q.perdTempo[0]=9; entrega(x,0,3); ok(x.q.notaT[1]===1,'a nota não passa de 1 para baixo');
  // bebida: 5; −1 por coração perdido só esperando; −1 se veio depois do principal
  x=mk(); x.q.drinksDados=0; x.q.juiceGot=x.q.juiceWant; x.q.drinks=[]; x.q.juiceWant=0; x.q.notaBeb(); ok(x.q.notaT[0]===null,'(sem bebida pedida, nada de nota)');
  x=mk({ equipe:{ tonhao:3, dani:2 } }); x.q=x.q; { const q=x.q; q.juiceGot=q.juiceWant-1; const b=x.g.bia; b.hands=[{ kind:'juice' }]; q.setState('ordered'); b.perform({ type:'table', id:x.t.id }); ok(q.juicePending===0 && q.notaT[0]===5,'suco entregue antes do principal: nota 5'); }
  x=mk({ equipe:{ tonhao:3, dani:2 } }); { const q=x.q; q.juiceGot=q.juiceWant-1; q.principalDado=true; const b=x.g.bia; b.hands=[{ kind:'juice' }]; q.setState('ordered'); b.perform({ type:'table', id:x.t.id }); ok(q.notaT[0]===4,'a bebida que chegou depois do principal: −1'); }
  x=mk({ equipe:{ tonhao:3, dani:2 } }); { const q=x.q; q.juiceGot=q.juiceWant-1; q.principalDado=true; q.perdBeb=2; const b=x.g.bia; b.hands=[{ kind:'juice' }]; q.setState('ordered'); b.perform({ type:'table', id:x.t.id }); ok(q.notaT[0]===2,'…e −1 por coração perdido só esperando a bebida (5 − 2 − 1)'); }
  x=mk(); { const q=x.q; q.perdBeb=0; q.drinksPedidos=true; q.drinksDados=0; q.setState('eating'); q.esperaSuco=true; q.patLeft=0.001; q.hearts=3; const pb=q.perdBeb, pt=q.perdTempo.slice(); q.tick(0.01); ok(q.perdBeb===pb+1 && q.perdTempo[0]===pt[0] && q.perdTempo[1]===pt[1],'coração perdido esperando só a bebida (depois da refeição) conta na bebida'); q.setState('ordered'); q.tempo=1; q.patLeft=0.001; q.tick(0.01); ok(q.perdTempo[1]===1,'e esperando o principal, na nota do principal'); }
  // sobremesa: 5 − corações perdidos esperando (perdDoce)
  x=mk(); { const q=x.q; q.doces=['pudim','pudim']; q.docesDados=0; q.perdDoce=2; q.setState('eating'); q.esperaSuco=true; x.g.entregaDoces(q,2,x.t.cx,x.t.cy); ok(q.notaT[3]===3,'sobremesa: 5 menos 1 por coração perdido esperando (5 − 2)'); }
  // o Gurugol: a comida é a média dos tempos servidos; o cardápio perde 1 sem a confeitaria e 0,5 sem o Anselmo
  const gur=(sv,notas)=>{ const R=terr(sv), s=sentar(R.g,'casal'), q=s.grp; q.notaT=notas.slice(); q.semVeg=false; q.setState('wantBill'); q.hearts=5; q.avalia=true; R.g.collectBill(q,s.t); const a=R.g.avals[R.g.avals.length-1]; a.base=R.L.avalMenu(R.g.cursos, R.L.cursosItem(R.g.save)); return a; };
  const lim=v=>Math.max(1,Math.min(5,Math.round(v*10)/10));
  const a1=gur({},[5,4,3,2]);
  ok(a1 && a1.s[2]===3.5 && a1.s[3]===lim(a1.base),'Gurugol no Terraço: a comida é a média dos tempos servidos ([5,4,3,2] → 3,5); o cardápio sem perda com a equipe toda');
  const a2=gur({ daniCursos:{} },[5,4,3,null]); ok(a2.s[2]===4 && a2.s[3]===lim(a2.base-1),'sem a confeitaria: o cardápio perde 1 (e a média só dos tempos servidos: [5,4,3] → 4)');
  const a3=gur({ equipe:{ tonhao:3, dani:2 } },[5,4,3,2]); ok(a3.s[3]===lim(a3.base-0.5),'sem o Anselmo no dia: o cardápio perde 0,5');
  const a4=gur({ daniCursos:{}, equipe:{ tonhao:3, dani:2 } },[5,4,3,null]); ok(a4.s[3]===lim(a4.base-1.5),'sem os dois: perde 1,5');
  // os comentários novos
  const com=(f,n)=>{ const set=new Set(); for(let i=0;i<n;i++){ const R=terr(f.sv), s=sentar(R.g,'casal'), q=s.grp; f.pre(q); q.setState('wantBill'); q.hearts=5; q.avalia=true; R.g.collectBill(q,s.t); set.add(R.g.avals[R.g.avals.length-1].txt); } return set; };
  const c1=com({ sv:{}, pre:q=>{ q.notaT=[5,5,5,5]; } },150), c2=com({ sv:{}, pre:q=>{ q.notaT=[5,5,5,5]; q.perdTempo[1]=1; } },150), c3=com({ sv:{ daniCursos:{} }, pre:q=>{ q.notaT=[5,5,5,null]; } },150), c4=com({ sv:{ equipe:{ tonhao:3, dani:2 } }, pre:q=>{ q.notaT=[3,3,3,3]; } },150);
  ok(c1.has('Do drink à sobremesa, tudo no tempo certo!') && c1.has('Refeição completa de verdade!'),'comentário: tudo servido com nota 4 ou mais');
  ok(c2.has('Um tempão entre a entrada e o prato.'),'comentário: coração perdido esperando o principal');
  ok(c3.has('Faltou a sobremesa para fechar.') && c4.has('Faltou uma carta de drinks.'),'comentários: sem sobremesa e sem o Anselmo'); }

// ---------- 11. a refeição completa e a trilha dos tempos ----------
{ const H=terr(), {g,L}=H;
  const cobra=(notas)=>{ const s=sentar(g,'casal'), q=s.grp; q.notaT=notas.slice(); q.setState('wantBill'); q.hearts=5; g.lastKind=''; const p0=g.pontos, c0=g.stats.completas; g.collectBill(q,s.t); return { pts:g.pontos-p0, comp:g.stats.completas-c0, q }; };
  const a=cobra([5,5,4,null]), b=cobra([5,5,4,5]);
  ok(a.comp===0 && b.comp===1 && b.pts-a.pts===30 && g.stats.completas===1,'a refeição completa (as 4 coisas servidas) conta em stats.completas e dá 30 pontos');
  ok(g.fx.some(f=>f.k==='text' && f.text==='Refeição completa!') && g.fx.some(f=>f.k==='spark'),'o texto "Refeição completa!" com faíscas');
  // a trilha: o estado das 4 marcas
  const s=sentar(g,'familia'), q=s.grp; q.extras=['coxinha','coxinha','coxinha','coxinha']; const est=()=>L.tempoMarcas(q).map(m=>m.est[0]).join('');
  ok(est()==='pppp' && L.tempoMarcas(q).length===4,'antes de pedir: as 4 marcas pendentes');
  pedir(H,q,s.t); ok(est()==='vvpp','pediu: a bebida e a entrada são "da vez"; o principal e a sobremesa, pendentes');
  q.notaT[0]=5; ok(est()==='svpp' && L.tempoMarcas(q)[0].cor==='ok','bebida servida: cheia e verde');
  q.notaT[1]=3; q.setState('eating'); ok(est()==='ssp'+'p' && L.tempoMarcas(q)[1].cor==='alerta','entrada servida com 3: amarela');
  q.setState('ordered'); q.tempo=1; ok(est()==='ssvp','esperando o principal: ele é o da vez');
  q.notaT[2]=2; q.setState('eating'); q.esperaSuco=true; q.doces=['pudim']; q.docesDados=0; ok(est()==='sssv' && L.tempoMarcas(q)[2].cor==='perigo','principal com 2: vermelho; a sobremesa é a da vez');
  q.notaT[3]=4; ok(est()==='ssss' && L.tempoMarcas(q).map(m=>m.cor).join()==='ok,alerta,perigo,ok','tudo servido: 4 marcas cheias, uma cor pela nota (4 ok, 3 amarelo, 2 vermelho)');
  const sc=terr({ daniCursos:{}, equipe:{ tonhao:3, dani:2 } }), q2=sentar(sc.g,'casal').grp; ok(sc.L.tempoMarcas(q2).map(m=>m.est).join()==='nao,pendente,pendente,nao' || sc.L.tempoMarcas(q2)[3].est==='nao','o que a casa não serve: um tracinho (a sobremesa; a bebida, só se nem o suco existisse)');
  const A=terr({ equipe:{ tonhao:3, dani:2 } }); A.g.save.salao.ponto; const av=jogo(8,'avenida',{ bank:2000 }).g; av.startDay(10); const qa=new L.Group(av,'familia',++av.gid,0,false); ok(L.tempoMarcas(qa)===null,'sem `tempos` (Avenida): sem trilha');
  // desenho: a trilha e o balão com o prato do tempo da vez, sem erro, com e sem movimento reduzido
  let erro=''; try { sentar(g,'casal'); const t0=g.tables.find(t=>t.group); L.drawTempoTrilha(H.ctx,t0.group,100,100,1.5); L.render(g,H.ctx); g.up.assento=null; for(let i=0;i<40;i++) g.update(0.05); L.render(g,H.ctx); } catch(e){ erro=String(e.stack); }
  ok(!erro,'desenha a trilha dos tempos sem erro'+(erro?': '+erro:''));
  const RMH=load({ rm:true, historia:true }); RMH.doc.createTextNode=t=>({textContent:String(t),children:[]}); let e2=''; try { const R=terr.call(null); const gg=RMH.g; gg.save=RMH.L.normSave({ histV:1, cap:8, dia:10, maxDay:10, bank:5000, v10:1, salao:{ ponto:'terraco' } }); gg.tablesKey=''; gg.buildTables(); gg.startDay(10); RMH.els['btn-start'].fire('click'); gg.schedule=[]; const s2=sentar(gg,'casal'); RMH.L.drawTempoTrilha(RMH.ctx,s2.grp,100,100,2); RMH.L.render(gg,RMH.ctx); } catch(e){ e2=String(e.stack); }
  ok(!e2,'com movimento reduzido também desenha sem erro'+(e2?': '+e2:'')); }

// ---------- 12. fora do Terraço nada muda ----------
{ const av=jogo(8,'avenida',{ bank:2000, equipe:{ tonhao:3, dani:2, anselmo:2 }, daniCursos:{ confCaseira:1 } }), {g,L}=av; g.startDay(10); av.els['btn-start'].fire('click'); g.schedule=[]; g.kitchen.clean=5;
  let tem=0, soma=true; for(let i=0;i<200;i++){ const q=new L.Group(g,['familia','negocios','executiva','vovos'][i%4],++g.gid,0,false); if(q.tempos) tem++; const b=q.dishes.concat(q.extras).reduce((v,x)=>v+(x?L.precoPrato(x,g.ponto,g.cursos):0),0)+(q.vip?L.VIP.dish:0); if(q.bill!==b) soma=false; }
  ok(!tem && soma,'na Avenida: grupo sem `tempos` e a conta de sempre (pratos mais o 2º item sorteado)');
  const { grp, t }=sentar(g,'familia'); grp.extras=[null,null,null,null].slice(0,grp.size); grp.dishes=grp.dishes.map(()=>'pf'); grp.dish='pf'; grp.bill=grp.size*L.precoPrato('pf',g.ponto,g.cursos);
  const c0=g.custo; pedir(av,grp,t); const it=g.kitchen.queue.concat(g.kitchen.cooking).find(q=>q.group===grp);
  ok(it && it.tempo===undefined && it.dish==='pf','a cozinha recebe um pedido só, sem tempo');
  for(let i=0;i<500 && !g.kitchen.plates.some(q=>q&&q.group===grp);i++) g.update(0.05);
  ok(g.kitchen.clean===4 && Math.round(g.custo-c0)===Math.round(grp.bill*L.INGRED.prato),'gasta prato limpo e o ingrediente é sobre a conta toda');
  pegaPrato(av,grp); g.bia.perform({ type:'table', id:t.id }); ok(grp.state==='eating' && grp.tempo===0 && !grp.principalDado,'entregue o prato: come e depois vai para a conta (sem voltar a esperar)');
  roda(g,grp.timer+3); ok(['wantBill','leaving'].includes(grp.state) || grp.esperaSuco,'acabou de comer: conta (ou os pedidos de bebida e doce de sempre)');
  const E=load({}); const qe=new E.L.Group(E.g,'estudante',1,0,false); ok(!qe.tempos,'Turno sem fim e Garagem: nada de tempos');
  const dev=load({ store:{ lcc2_dev:'1' } }); dev.g.save.salao.ponto='terraco'; dev.g.save.salao=dev.L.normSalao(dev.g.save.salao); dev.g.tablesKey=''; dev.g.buildTables(); dev.g.startDay(3); const qd=new dev.L.Group(dev.g,'casal',1,0,false); ok(qd.tempos===true,'(o modo dev no Terraço também joga em tempos)'); }

// ---------- 13. o cap. 8 e o cap. 9 ----------
{ const H=jogo(8,'terraco',{ bank:3000, capAzul:0, caixa:[], conversa:'antes' }), {g,L,els}=H; g.save.conversa=null;
  ok(L.HISTORIA[7].titulo==='Lá no alto' && L.HISTORIA[7].ponto==='terraco' && L.HISTORIA[7].obj.azul===3 && L.HISTORIA[7].antes.length===5 && L.HISTORIA[7].depois.length===3,'o cap. 8, "Lá no alto": 3 dias no azul, 5 falas antes e 3 depois');
  ok(L.HISTORIA[7].antes[1].nota==='olhando o piano no canto' && L.HISTORIA[7].antes[1].s==='E esse piano de cauda?' && L.HISTORIA[7].depois[2].s==='Hoje uma mesa bateu palma pra sobremesa!' && L.HISTORIA[6].fim.p==='Quando quiser, a mudança para o Terraço Suíça está na lojinha.','as falas e o `fim` do cap. 7');
  g.startDay(10); ok(/Capítulo 8, Lá no alto: Fechar 3 dias no azul pagando o aluguel \(0 de 3\)/.test(els['intro-manut'].textContent),'a introdução traz o objetivo do cap. 8');
  for(let k=0;k<3;k++){ g.save.dia=10+k; g.startDay(10+k); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=2500; g.custo=0; g.finishDay(); }
  ok(g.save.capAzul===3 && g.result.cap.n===8 && g.result.cap.ok && g.save.conversa==='depois','3 dias no azul pagando o aluguel: cap. 8 cumprido');
  els['btn-next'].fire('click'); passa(H);
  ok(g.save.cap===9 && g.save.conversa===null && !mostra(els,'ov-continua') && L.HISTORIA[7].fim===undefined,'depois do cap. 8: o cap. 9 começa (a conversa de antes toca em seguida) e não há cartão de fim (o cap. 8 não tem mais o `fim`)');
  g.setState('menu'); ok(/cap\. 9, Do começo ao fim/.test(els['menu-dia'].textContent),'o menu diz "cap. 9, Do começo ao fim"');
  const H2=jogo(8,'terraco'); H2.g.setState('menu'); ok(/cap\. 8, Lá no alto/.test(H2.els['menu-dia'].textContent),'menu no Terraço: "cap. 8, Lá no alto"'); }

{ // o cap. 9, "Do começo ao fim": 6 refeições completas e nota 4,5 no mesmo dia
  const C=L9=>L9, H=jogo(9,'terraco',{ bank:3000, v10:1, capAzul:0, caixa:[], conversa:'antes' }), {g,L,els}=H, c=L.HISTORIA[8];
  ok(c.cap===9 && c.titulo==='Do começo ao fim' && c.ponto==='terraco' && c.obj.completas===6 && c.obj.nota===4.5 && c.antes.length===3 && c.depois.length===5,'o cap. 9, "Do começo ao fim": 6 refeições completas e nota 4,5; 3 falas antes e 5 depois');
  ok(c.antes[0].s==='Refeição completa é como música: não pode faltar nota.' && c.antes[2].s==='Se faltar a sobremesa, eu choro.' && c.depois[1].nota==='guardando o pote de cominho' && c.depois[3].s==='Ele mesmo. Dizem que o crítico chega sem avisar.' && c.depois[4].s==='Então é deixar tudo brilhando!','as falas do cap. 9');
  ok(c.fim.h==='Fim dos capítulos do Terraço Suíça' && c.fim.p==='Continua na próxima versão: o crítico do Michelzão.','o `fim` final');
  passa(H); g.save.conversa=null; g.save.aval=[]; g.startDay(10); ok(/Capítulo 9, Do começo ao fim: 6 refeições completas e nota 4,5 no mesmo dia \(no último dia: 0 completas, nota —\)/.test(els['intro-manut'].textContent) || /Capítulo 9, Do começo ao fim: 6 refeições completas e nota 4,5 no mesmo dia/.test(els['intro-manut'].textContent),'a introdução traz o objetivo do cap. 9');
  const dia=(comp,nota)=>{ g.save.aval=Array(10).fill([nota,nota,nota,nota,nota]); g.save.dia=10; g.startDay(10); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=3000; g.custo=0; g.stats.completas=comp; g.finishDay(); };
  dia(5,4.7); ok(!g.save.capFeito && g.save.capComp===5 && !g.result.cap.ok && /5 completas, nota 4,7/.test(g.result.cap.itens[0].txt),'5 completas com nota 4,7: ainda não (o item mostra "hoje: 5 completas, nota 4,7")');
  dia(8,4.3); ok(!g.save.capFeito && g.save.capComp===8,'8 completas mas nota 4,3: ainda não');
  g.save.conversa=null; dia(6,4.5); ok(g.save.capFeito===1 && g.result.cap.ok && g.save.conversa==='depois' && /6 refeições completas e nota 4,5 no mesmo dia \(hoje: 6 completas, nota 4,5\)/.test(g.result.cap.itens[0].txt),'6 completas e nota 4,5 no mesmo dia: cumprido (a conversa de depois fica pendente)');
  els['btn-next'].fire('click'); passa(H);
  ok(g.save.cap===10 && mostra(els,'ov-continua') && els['cont-h'].textContent==='Fim dos capítulos do Terraço Suíça' && /o crítico do Michelzão/.test(els['cont-p'].textContent),'depois do cap. 9: o cartão de fim de capítulos, "Continua na próxima versão: o crítico do Michelzão."');
  g.setState('menu'); ok(/Terraço Suíça completo/.test(els['menu-dia'].textContent),'o menu diz "Terraço Suíça completo"');
  ok(!/\d+ de \d+/.test(L.HISTORIA[8].obj.completas+''),'(sem texto solto)'); }
{ // o save que terminou o cap. 8 na parte A (cap 9, sem o campo v10) começa o cap. 9 com a conversa de antes; o que já tem v10 não repete
  const H=nova(), {L}=H;
  const a=L.normSave({ histV:1, cap:9, dia:20, bank:4000, conversa:null, salao:{ ponto:'terraco' } }); ok(a.conversa==='antes' && a.cap===9 && a.v10===1,'save da parte A no cap. 9 (sem v10): começa o cap. 9 com a conversa de antes');
  const b=L.normSave(JSON.parse(JSON.stringify(a))); ok(b.conversa==='antes' && JSON.stringify(L.normSave(JSON.parse(JSON.stringify(b))))===JSON.stringify(b),'e normalizar de novo não muda nada');
  const c=L.normSave({ histV:1, cap:9, dia:20, bank:4000, conversa:null, v10:1, salao:{ ponto:'terraco' } }); ok(c.conversa===null,'quem já ouviu a conversa (v10 no save) não ouve de novo');
  const d=L.normSave({ histV:1, cap:10, dia:20, bank:4000, salao:{ ponto:'terraco' } }); ok(d.conversa===null && d.cap===10,'cap. 10 (história acabou): sem conversa');
  const e=L.normSave({ histV:1, cap:9, dia:20, conversa:'depois', capComp:4, salao:{ ponto:'terraco' } }); ok(e.conversa==='depois' && e.capComp===4,'a conversa de depois e o capComp se mantêm'); }

// ---------- 14. saves e Manual ----------
{ const H=nova(), {g,L}=H;
  const v=L.normSave({ histV:1, cap:8, dia:30, bank:7000, salao:{ ponto:'avenida', mesas:L.salaoAuto([4,4,4,4,4,4].map((seats,c)=>({ seats, c:c%4 })),L.PONTOS[2]) }, up:{ assento:'sofa', maquina:true, fogaoInd:true }, equipe:{ tonhao:3, dani:3, couvert:true } });
  ok(v.salao.ponto==='avenida' && v.cap===8 && v.conversa===null && v.up.assento==='sofa' && v.up.maquina && v.salao.mesas.length===6,'save da v9.6.13 na Avenida com o cap. 8 (era "completa"): "à espera" da mudança, carrega igual');
  ok(JSON.stringify(L.normSave(JSON.parse(JSON.stringify(v))))===JSON.stringify(v),'e normalizar de novo não muda nada');
  g.save=v; g.up=v.up; g.tablesKey=''; g.buildTables(); g.setState('menu'); ok(/Avenida Brasil completa/.test(H.els['menu-dia'].textContent) && g.capObj(v)===null,'o menu da Avenida continua "completa" e não há objetivo');
  const sv2=L.normSave({ histV:1, cap:8, dia:40, bank:3000, conversa:'antes', salao:{ ponto:'terraco' }, up:{ assento:'poltrona', fogaoInd:true } });
  ok(sv2.salao.ponto==='terraco' && sv2.up.assento==='poltrona' && sv2.conversa==='antes','save no Terraço: as poltronas e a conversa do cap. 8 ficam');
  const lixo=L.normSave({ histV:1, cap:8, dia:40, salao:{ ponto:'terraco' }, up:{ assento:'sofa' } }); ok(lixo.up.assento==='sofa' || !lixo.up.assento,'(o assento do ponto errado não quebra o save)'); }
{ const L=load({ historia:true }).L, ids=L.MANUAL.map(f=>f.id);
  ok(ids.indexOf('p-terraco')>=0 && ids.indexOf('c-casal')>=0 && L.MANUAL.find(f=>f.id==='p-terraco').aba==='lugares' && L.MANUAL.find(f=>f.id==='c-casal').aba==='clientes' && L.MANUAL.find(f=>f.id==='c-casal').tipo==='casal','o Manual tem as fichas p-terraco (Lugares) e c-casal (Clientes)');
  ok(L.MANUAL.find(f=>f.id==='p-terraco').linha==='O topo da cidade: poucas mesas e refeição completa, do drink à sobremesa.' && L.MANUAL.find(f=>f.id==='c-casal').linha==='Data especial: sem pressa, e a conta é generosa.','os textos das fichas');
  ok(!/\d/.test(L.MANUAL.find(f=>f.id==='p-terraco').linha+L.MANUAL.find(f=>f.id==='c-casal').linha),'sem número nas fichas');
  const tr=L.manualTracos('casal',{}); ok(tr.some(x=>/Grupo: em dupla/.test(x)) && tr.some(x=>/Gorjeta: ótima/.test(x)) && tr.some(x=>/Prefere: PF/.test(x)),'os traços do casal vêm dos números (dupla, gorjeta ótima, prefere PF)');
  const tr2=L.manualTracos('casal',{ aberta:id=>id==='p-terraco' }), tr3=L.manualTracos('casal',{ aberta:()=>false }); ok(tr2.some(x=>x==='Onde: Terraço Suíça') && !tr3.some(x=>/Onde:/.test(x)),'"Onde: Terraço Suíça" só quando a ficha do ponto já abriu'); }
{ const H=jogo(8,'avenida',{ bank:9000, manual:[] }), {g}=H; g.goShop(10); g.manualInicio && g.manualInicio();
  ok(g.save.manual.indexOf('p-terraco')>=0,'a ficha p-terraco abre quando o cartão Mudança aparece na lojinha (ver o ponto novo)');
  const T=jogo(8,'terraco',{ manual:[] }).g; T.resetDay(10); T.begin(); ok(T.save.manual.indexOf('p-terraco')>=0,'e no 1º dia no Terraço');
  T.arrive({ t:0, type:'casal', color:0, vip:false }); ok(T.save.manual.indexOf('c-casal')>=0,'a ficha c-casal abre na 1ª vez que um casal chega');
  ok(T.save.manual.indexOf('b-tempos')>=0 && T.save.manualNovo.indexOf('b-tempos')>=0,'a ficha b-tempos abre no 1º dia no Terraço (como novidade)');
  const A=jogo(8,'avenida',{ manual:[] }).g; A.resetDay(10); A.begin(); ok(A.save.manual.indexOf('b-tempos')<0,'e não abre fora do Terraço');
  const f=H.L.MANUAL.find(x=>x.id==='b-tempos'); ok(f && f.aba==='basico' && f.nome==='Refeição completa' && f.linha==='No Terraço, cada mesa pede bebida, entrada, prato e sobremesa. Cada tempo conta no Gurugol.' && !/\d/.test(f.linha),'a ficha b-tempos (aba Básico, sem número)'); }

console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
