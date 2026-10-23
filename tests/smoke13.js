// v7.4, Garagem: kit inicial, mesas compradas até o teto de 16 lugares, editor do salão (mover, arrumar, desfazer,
// virar mesa de 4, vender, cor das cadeiras), posição válida e caminho até cada mesa, contas sem aluguel e todas as mesas abertas.
const H=require('./harness.js')(); const {g,L,ctx,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const S=L.SALAO, P=L.PONTOS[0], C=L.CONTAS, mesas=()=>g.save.salao.mesas, lug=()=>L.salaoLugares(mesas());
const novo=(bank)=>{ g.save=L.normSave({maxDay:3,bank:bank==null?5000:bank}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.goShop(3); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);

// ponto e kit inicial
ok(P.id==='garagem' && P.lugares===16 && P.aluguel===0 && P.mudanca===0 && P.espera===4 && L.pontoOf('xyz')===P,'Garagem: 16 lugares, sem aluguel, 4 cadeiras de espera');
ok(g.save.salao.ponto==='garagem' && mesas().map(m=>m.seats).sort().join()==='2,2,2,4' && lug()===10,'kit: 3 mesas de 2 e 1 de 4 (10 lugares)');
ok(!L.salaoProblema(mesas(),P),'kit num arranjo válido');
ok(g.tables.map(t=>t.id).join()==='1,2,3,4' && g.tables.every((t,i)=>t.cx===mesas()[i].x && t.cy===mesas()[i].y),'ids seguidos (tables[id-1]) e no lugar das mesas do save');
{ const t=g.tables; ok(t[0].cy===t[1].cy && t[0].cx<t[1].cx && t[2].cy>t[0].cy && t[2].cx<t[3].cx,'números de cima para baixo, da esquerda para a direita'); }
ok(new Set(mesas().map(m=>m.c)).size===4,'cada mesa do kit com uma cor de cadeira');

// todas as mesas abertas desde o dia 1, e menos grupos nos dias 1 e 2
g.startDay(1); ok(g.tables.length===4 && g.tables.every(t=>t.open),'dia 1: todas as mesas abertas');
ok(L.DAYS.every(d=>!('tables' in d)) && !('tables' in L.ENDLESS),'DAYS sem a lista de mesas abertas');
ok(g.schedule.length===L.DAYS[0].groups && L.DAYS[0].groups===5 && L.DAYS[1].groups===8,'dias 1 e 2 com 5 e 8 grupos');
ok(L.dishStock(L.DAYS[2],{})===4 && L.dishStock(L.DAYS[6],{pratos:true})===5 && L.dishStock(L.DAYS[0],{})===Infinity,'pratos limpos: sem limite nos dias 1 e 2, 4 depois (+1 com o Jogo de pratos)');

// contas sem aluguel
g.startDay(3); g.begin(); ok(g.contas===C.base+4*C.mesa+10*C.lugar && g.contas===42,'contas da Garagem: gás e geladeira (R$ '+C.base+') e luz (R$ '+C.mesa+' por mesa e R$ '+C.lugar+' por lugar) = '+g.contas);

// compras
novo(0);
ok(!g.buyMesa(2) && /Falta dinheiro/.test(g.salaoMsg) && mesas().length===4,'sem dinheiro, não compra');
novo(1000);
ok(g.buyMesa(2) && g.save.bank===1000-S.mesa2 && mesas().length===5 && lug()===12,'compra mesa de 2 (R$ '+S.mesa2+')');
ok(!g.shopBought && g.save.caixaPend.sal===S.mesa2,'móveis não contam no limite de 1 melhoria e entram no caixa');
ok(g.salaoSel>=0 && mesas()[g.salaoSel].seats===2 && !L.salaoProblema(mesas(),P),'a mesa nova entra num lugar livre e fica escolhida no editor');
ok(g.state==='shop' && g.tables.length===5,'o salão ao fundo acompanha');
ok(g.buyMesa(4) && g.save.bank===1000-S.mesa2-S.mesa4 && lug()===16,'compra mesa de 4 (R$ '+S.mesa4+'): 16 lugares');
ok(!g.buyMesa(2) && /16 pessoas/.test(g.salaoMsg) && lug()===16,'no teto de 16 lugares, não compra mais');
{ const i=mesas().findIndex(m=>m.seats===2); ok(!g.virarMesa(i) && lug()===16,'no teto, não vira mesa de 4'); }
// virar mesa de 4 e vender
novo(1000);
{ const i=mesas().findIndex(m=>m.seats===2), b=g.save.bank;
  ok(g.virarMesa(i) && g.save.bank===b-S.virar && lug()===12 && mesas().filter(m=>m.seats===4).length===2 && !L.salaoProblema(mesas(),P),'2 cadeiras (R$ '+S.virar+'): a mesa de 2 vira mesa de 4, num lugar válido');
  ok(mesas()[g.salaoSel].seats===4,'a mesa que virou fica escolhida'); }
{ const b=g.save.bank, n=mesas().length, i=mesas().findIndex(m=>m.seats===2);
  ok(g.venderMesa(i) && g.save.bank===b+S.mesa2*S.venda && mesas().length===n-1,'vender a mesa de 2 devolve R$ '+S.mesa2*S.venda);
  ok(g.save.caixaPend.sal===S.virar-S.mesa2*S.venda,'a venda abate das compras do caixa ('+g.save.caixaPend.sal+')'); }
{ g.save.salao=L.normSalao({mesas:[{x:400,y:300,seats:4,c:0}]}); g.buildTables();
  ok(mesas().length===1 && !g.venderMesa(0) && mesas().length===1,'o salão fica com pelo menos 1 mesa'); }

// posição válida e inválida, desfazer e arrumação automática
novo(1000);
{ const m0=mesas()[0], m2=mesas()[2];
  ok(!g.moverMesa(2,m0.x+20,m0.y) && /Perto demais/.test(g.salaoMsg) && mesas()[2].x===m2.x,'em cima de outra mesa: recusa e a mesa volta');
  ok(!g.moverMesa(2,100,m2.y) && /Fora do salão/.test(g.salaoMsg),'fora da área útil: recusa');
  ok(!g.salaoUndo.length,'nada para desfazer ainda');
  const x=m2.x+50; ok(g.moverMesa(2,x,m2.y) && mesas().some(m=>m.x===x && m.y===m2.y) && g.salaoUndo.length===1,'lugar livre: a mesa muda e dá para desfazer');
  ok(g.desfazerSalao() && JSON.stringify(mesas())===JSON.stringify(L.salaoKit(P)) && !g.salaoUndo.length,'Desfazer volta o arranjo');
  g.moverMesa(2,x,m2.y); g.moverMesa(0,m0.x-30,m0.y);
  ok(g.arrumarSalao() && JSON.stringify(mesas())===JSON.stringify(L.salaoAuto(mesas(),P)) && g.salaoUndo.length===3,'arrumação automática (e entra no Desfazer)');
  g.buyMesa(2); ok(!g.salaoUndo.length,'compra zera o Desfazer'); }
// caminho: uma parede de mesas encostadas separa a fila do balcão
{ const wall=[150,260,370,480].map(y=>({x:300,y,seats:4,c:0}));
  ok(!L.salaoCaminho(wall) && L.salaoProblema(wall,Object.assign({},P,{area:{x0:0,y0:0,x1:W=960,y1:600}}))!=='','parede de mesas: sem caminho da Bia até as mesas');
  ok(L.salaoCaminho(mesas()) && L.OBST.length===g.tables.length,'arranjo de verdade tem caminho, e o teste devolve os obstáculos do salão');
  ok(L.pathOk({x:744,y:150},{x:78,y:178}) && !L.pathOk({x:60,y:300},{x:600,y:300}) === false,'pathOk no salão aberto'); }
// todas as combinações até 16 lugares: a arrumação automática cabe, com folga e caminho até cada mesa
{ let n=0, bad=[]; const rec=(l,s)=>{ if(l.length){ n++; const r=L.salaoAuto(l.map((seats,c)=>({x:0,y:0,seats,c:c%4})),P);
      if(!r) bad.push(l.join('')); else { const g2=r.every((a,i)=>r.every((b,j)=>i===j||(()=>{ const A=L.mesaBox(a.x,a.y,a.seats),B=L.mesaBox(b.x,b.y,b.seats); return A.x0>=B.x1+S.gap||B.x0>=A.x1+S.gap||A.y0>=B.y1+S.gap||B.y0>=A.y1+S.gap; })())); if(!g2) bad.push('perto '+l.join('')); } }
    for(const k of [2,4]) if(s+k<=16 && (!l.length||k<=l[l.length-1])) rec(l.concat([k]),s+k); };
  rec([],0); ok(n===24 && !bad.length,'arrumação automática de '+n+' combinações de mesas'+(bad.length?': '+bad.slice(0,3).join(' '):'')); }
// primeiro lugar livre: sem vaga, a compra rearruma o salão
{ g.save.salao={ponto:'garagem',mesas:L.salaoAuto([2,2,2,2,2,2,2].map((seats,c)=>({seats,c:c%4})),P)}; g.buildTables(); g.save.bank=1000;
  ok(lug()===14 && g.buyMesa(2) && lug()===16 && !L.salaoProblema(mesas(),P),'8ª mesa de 2 entra (com vaga ou rearrumando)'); }

// save
{ novo(1000); g.buyMesa(4); g.moverMesa(4,mesas()[4].x+10,mesas()[4].y); const n=L.normSave(JSON.parse(JSON.stringify(g.save)));
  ok(JSON.stringify(n.salao)===JSON.stringify(g.save.salao),'save guarda as mesas onde ficaram'); }
{ const n=L.normSalao({ponto:'xyz',mesas:[{x:300,y:210,seats:3},{x:300,y:210,seats:4},{x:310,y:220,seats:2,c:9},'lixo',{seats:4},{seats:4},{seats:4},{seats:4}]});
  ok(n.ponto==='garagem' && L.salaoLugares(n.mesas)<=16 && !L.salaoProblema(n.mesas,P) && n.mesas.every(m=>m.c>=0&&m.c<=3),'save estragado vira arranjo válido (automático, até 16 lugares)'); }
ok(JSON.stringify(L.normSalao({mesas:[]}).mesas)===JSON.stringify(L.salaoKit(P)),'save sem mesas: o kit');

// Turno sem fim: salão fixo de 6 mesas e 16 lugares, igual para todos
{ g.save.salao=L.normSalao({}); g.startEndless(); ok(g.tables.length===6 && g.tables.reduce((a,t)=>a+t.seats,0)===16 && g.tables.every(t=>t.open),'Turno sem fim: 6 mesas e 16 lugares');
  g.startDay(1); ok(g.tables.length===4,'de volta à carreira, o salão do jogador'); }

// aba Salão: editor e loja de móveis
novo(1000); L.setShopTab('salao');
{ const grid=els['shop-grid'], t=txt(grid), cv=acha(grid,e=>e.tagName==='CANVAS');
  ok(/salao/.test(grid.className) && /Lugares 10 de 16/.test(t) && /Mesa de 2: R\$ 150/.test(t) && /Mesa de 4: R\$ 250/.test(t),'aba Salão: contador de lugares e as mesas à venda');
  ok(/Arrumação automática/.test(t) && /Desfazer/.test(t) && /sem aluguel/.test(t),'botões Arrumação automática e Desfazer');
  ok(!!cv && cv.width===1000 && cv.height===605,'editor com canvas próprio');
  // o canvas do harness mede 960×600 na tela: tela -> salão x*800/960, 56 + y*484/600
  const tela=(x,y)=>({clientX:x*960/800, clientY:(y-56)*600/484});
  const ev=(p,o)=>Object.assign({preventDefault(){}, pointerId:1, pointerType:'mouse'},p,o||{});
  const m=mesas()[1];
  cv.fire('pointerdown',ev(tela(m.x,m.y))); cv.fire('pointerup',ev(tela(m.x,m.y)));
  ok(g.salaoSel===1,'tocar na mesa escolhe a mesa');
  let pop=acha(els['shop-grid'],e=>/ed-pop/.test(e.className||''));
  ok(!!pop && /Mesa 2 · 2 lugares/.test(txt(pop)) && /Virar mesa de 4: R\$ 100/.test(txt(pop)) && /Vender por R\$ 75/.test(txt(pop)),'balãozinho da mesa: virar mesa de 4 e vender');
  // cor das cadeiras (v7.4.3): de graça, a mesa continua escolhida e dá para desfazer
  { const c0=mesas()[1].c, cor=(c0+1)%4, b=g.save.bank, nome=k=>'Cadeiras na cor '+L.CHAIRS[k].n;
    const bolas=pop.children.find(e=>/ed-cores/.test(e.className||'')).children.filter(e=>e.tagName==='BUTTON');
    ok(bolas.length===4 && bolas[c0].getAttribute('aria-pressed')==='true' && bolas.filter(e=>e.getAttribute('aria-pressed')==='true').length===1,'balãozinho: 4 cores de cadeira, a atual marcada');
    acha(pop,e=>e.tagName==='BUTTON'&&e.getAttribute('aria-label')===nome(cor)).fire('click');
    ok(mesas()[1].c===cor && g.tables[1].color===cor && g.save.bank===b && g.salaoSel===1 && g.salaoUndo.length===1,'trocar a cor das cadeiras: de graça, no salão do jogo e com a mesa ainda escolhida');
    pop=acha(els['shop-grid'],e=>/ed-pop/.test(e.className||''));
    ok(acha(pop,e=>e.tagName==='BUTTON'&&e.getAttribute('aria-label')===nome(cor)).getAttribute('aria-pressed')==='true','a cor nova fica marcada');
    ok(!g.pintarMesa(1,4) && !g.pintarMesa(9,0) && mesas()[1].c===cor,'cor ou mesa que não existe: recusa');
    ok(g.desfazerSalao() && mesas()[1].c===c0,'Desfazer volta a cor'); g.salaoSel=1; L.setShopTab('salao');
    pop=acha(els['shop-grid'],e=>/ed-pop/.test(e.className||'')); }
  const vb=acha(pop,e=>e.tagName==='BUTTON'&&/Virar/.test(e.textContent)); vb.fire('click');
  ok(mesas().filter(m=>m.seats===4).length===2 && /Lugares 12 de 16/.test(txt(els['shop-grid'])),'botão do balão vira a mesa de 4');
  // arrastar a mesa 3 para um lugar livre (no dedo, com folga) e para cima de outra (volta)
  const cv2=acha(els['shop-grid'],e=>e.tagName==='CANVAS'), a=mesas()[2], b=mesas()[0];
  cv2.fire('pointerdown',ev(tela(a.x,a.y),{pointerType:'touch'})); cv2.fire('pointermove',ev(tela(b.x+10,b.y),{pointerType:'touch'})); cv2.fire('pointerup',ev(tela(b.x+10,b.y)));
  ok(mesas()[2].x===a.x && mesas()[2].y===a.y && /Aí não dá: perto demais/.test(txt(els['shop-grid'])),'soltar em cima de outra mesa: volta e explica');
  const cv3=acha(els['shop-grid'],e=>e.tagName==='CANVAS'), alvo={x:a.x+60,y:a.y};
  cv3.fire('pointerdown',ev(tela(a.x+20,a.y),{pointerType:'touch'})); cv3.fire('pointermove',ev(tela(alvo.x+20,alvo.y),{pointerType:'touch'})); cv3.fire('pointerup',ev(tela(alvo.x+20,alvo.y)));
  ok(mesas().some(m=>m.x===alvo.x && m.y===alvo.y) && g.salaoUndo.length===1,'arrastar a mesa para um lugar livre (encaixe na grade de '+S.grid+' px)');
  let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'o salão ao fundo redesenha'+(err?': '+err:'')); }

// o bot joga o dia 2 com 16 lugares sem exceções (no dia 5 sem equipe nem melhorias, o atendimento varia demais)
{ const bot=require('./bot.js')(g,L); let err=null, served=0;
  try{ novo(2000); g.buyMesa(2); g.buyMesa(4); g.startDay(2); g.begin(); let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); if(st%10===0) L.render(g,ctx); st++; } served=g.result?g.result.served:0; }catch(e){ err=e; }
  ok(!err && served>=5,'bot joga o dia 2 com 6 mesas ('+served+' atendidos)'+(err?': '+err.stack:'')); }
// bot da carreira compra móveis
{ const BOT=require('./bot.js'); novo(1000); ok(BOT.moveis(g,L,0,0) && lug()===12,'bot: sem perdas por falta de mesa, compra mesa de 2'); ok(BOT.moveis(g,L,2,0) && lug()===16,'bot: com perdas por falta de mesa, compra mesa de 4'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails= '+fails);
process.exitCode = fails ? 1 : 0;
