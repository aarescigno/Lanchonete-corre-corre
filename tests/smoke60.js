// v10, etapa 4a-1 (parte A): o Terraço Suíça. O cartão Mudança (cap. 8), o que vai, o que sai e a venda das mesas que sobram, o aluguel e os preços,
// a clientela (o casal, sem estudante, entregador, turma, motorista nem encomenda; VIP só de tipo do ponto), as poltronas do foyer, o piano como
// obstáculo fixo, o cap. 8 e o cartão de fim, o save da v9.6.13 e as fichas do Manual. (A parte B acrescenta a refeição completa neste arquivo.)
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

// ---------- 1. o cartão Mudança (cap. 8 em diante) ----------
{ let H=jogo(7,'avenida',{ bank:9000 }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro');
  ok(cartoes(H).join()==='banco,caixa' && !H.g.mudancaVisivel,'na Avenida com o cap. 7: sem o cartão Mudança');
  H=jogo(8,'avenida',{ bank:9000 }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro'); const lista=cartoes(H).join(); H.L.setShopTab('mudanca');
  ok(H.g.mudancaVisivel && lista==='banco,mudanca,caixa' && H.g.proximoPonto.id==='terraco','com o cap. 8: o cartão Mudança aparece (para o Terraço Suíça)');
  ok(/Mudança: Terraço Suíça/.test(txt(grid(H))) && /Mudança R\$ 5000 · aluguel R\$ 1000\/dia/.test(txt(grid(H))),'o cartão: só o nome, a mudança (R$ 5.000) e o aluguel (R$ 1.000)');
  ok(btn(H) && /Mudar: R\$ 5000/.test(btn(H).textContent) && !btn(H).disabled && H.L.avalMinimo(H.L.PONTOS[2])===3.9,'com R$ 5.000 e nota ≥ 3,9: o botão fica aceso (nota mínima 3,9)');
  H=jogo(8,'avenida',{ bank:3000 }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Falta R\$ 2000/.test(btn(H).textContent),'sem o dinheiro: apagado, "Falta R$ 2000"');
  H=jogo(8,'avenida',{ bank:9000 }); notaDe(H.g,3.8); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(btn(H).disabled && /Nota 3,9 \(agora 3,8\)/.test(btn(H).textContent),'sem a nota: apagado, "Nota 3,9 (agora 3,8)"');
  H=jogo(8,'avenida',{ bank:100 }); notaDe(H.g,2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
  ok(/Falta R\$ 4900 · Nota 3,9/.test(btn(H).textContent),'sem os dois: mostra os dois');
  H=jogo(8,'avenida',{ bank:9000, salao:salaoAv(H.L) }); notaDe(H.g,4.2); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca'); btn(H).fire('click');
  ok(/Mudar para o Terraço Suíça por R\$ 5000\? Aluguel de R\$ 1000 por dia\. O Terraço tem 20 lugares: as mesas que não couberem são vendidas\. Não dá para voltar\./.test(txt(grid(H))) && H.g.save.salao.ponto==='avenida','1º toque: pede a confirmação (com a frase das mesas), nada muda');
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
  ok(g.ponto.aluguel===1000 && L.precoPrato('pf',g.ponto,g.cursos)===63 && L.PONTOS[3].cardapio===2.5 && L.precoPrato('coxinha',g.ponto,g.cursos)===Math.round(L.CARDAPIO.coxinha.preco*2.5),'aluguel R$ 1.000 e cardápio ×2,5 (PF R$ 63)');
  g.begin(); const base=L.CONTAS.base+g.tables.filter(t=>t.open).length*L.CONTAS.mesa+g.tables.filter(t=>t.open).reduce((a,t)=>a+t.seats,0)*L.CONTAS.lugar;
  ok(g.contas===base+1000,'as contas do dia somam o aluguel de R$ 1.000');
  g.schedule=[]; g.nextIdx=0; g.money=1500; g.custo=0; const b0=g.save.bank; g.finishDay();
  ok(g.save.bank===b0+1500-g.contas-g.paid-g.paidDiv && g.save.caixa[g.save.caixa.length-1].contas===g.contas,'o aluguel sai no fim do dia e entra no livro-caixa');
  const D=g.diaPonto(L.diaOf(10)); ok(D.meta===Math.round(L.diaOf(10).meta*4/5)*5 && D.expert===Math.round(L.diaOf(10).expert*5/5)*5,'metas ×4 e expert ×5 (valores de partida), arredondadas para 5'); }

// ---------- 4. a clientela ----------
{ const H=jogo(8,'terraco',{ bank:3000, dia:10 }), {g,L}=H; g.save.divulga='boca'; g.resetDay(10);
  ok(L.PONTOS[3].tipos.casal===2 && L.PONTOS[3].semRetirada===true && L.PONTOS[3].tempos===true && L.PONTOS[3].bebida===null,'PONTOS[3]: casal peso 2, sem retirada, com tempos (parte B) e sem bebida da espera');
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

// ---------- 7. o desenho sem erro ----------
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

// ---------- 13. o cap. 8 ----------
{ const H=jogo(8,'terraco',{ bank:3000, capAzul:0, caixa:[], conversa:'antes' }), {g,L,els}=H; g.save.conversa=null;
  ok(L.HISTORIA[7].titulo==='Lá no alto' && L.HISTORIA[7].ponto==='terraco' && L.HISTORIA[7].obj.azul===3 && L.HISTORIA[7].antes.length===5 && L.HISTORIA[7].depois.length===3,'o cap. 8, "Lá no alto": 3 dias no azul, 5 falas antes e 3 depois');
  ok(L.HISTORIA[7].antes[1].nota==='olhando o piano no canto' && L.HISTORIA[7].antes[1].s==='E esse piano de cauda?' && L.HISTORIA[7].depois[2].s==='Hoje uma mesa bateu palma pra sobremesa!' && L.HISTORIA[6].fim.p==='Quando quiser, a mudança para o Terraço Suíça está na lojinha.','as falas e o `fim` do cap. 7');
  g.startDay(10); ok(/Capítulo 8, Lá no alto: Fechar 3 dias no azul pagando o aluguel \(0 de 3\)/.test(els['intro-manut'].textContent),'a introdução traz o objetivo do cap. 8');
  for(let k=0;k<3;k++){ g.save.dia=10+k; g.startDay(10+k); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=2500; g.custo=0; g.finishDay(); }
  ok(g.save.capAzul===3 && g.result.cap.n===8 && g.result.cap.ok && g.save.conversa==='depois','3 dias no azul pagando o aluguel: cap. 8 cumprido');
  els['btn-next'].fire('click'); passa(H);
  ok(g.save.cap===9 && mostra(els,'ov-continua') && els['cont-h'].textContent==='Fim dos capítulos do Terraço Suíça','depois do cap. 8: o cartão de fim de capítulos do Terraço');
  g.setState('menu'); ok(/Terraço Suíça completo/.test(els['menu-dia'].textContent),'o menu diz "Terraço Suíça completo"');
  const H2=jogo(8,'terraco'); H2.g.setState('menu'); ok(/cap\. 8, Lá no alto/.test(H2.els['menu-dia'].textContent),'menu no Terraço: "cap. 8, Lá no alto"'); }

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
  T.arrive({ t:0, type:'casal', color:0, vip:false }); ok(T.save.manual.indexOf('c-casal')>=0,'a ficha c-casal abre na 1ª vez que um casal chega'); }

console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
