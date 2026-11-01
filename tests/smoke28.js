// v8.6, etapa 2e: o entregador vai à fila de retirada (não senta), o pedido dele vira marmita no fogão (sem prato limpo),
// a Bia (ou a Dani) leva a marmita ao balcão e ele paga na hora (a Efood fica com 15%); adiantar marmitas, prateleira
// cheia, validade, entregador perdido, fila de retirada cheia, avaliação no Gurugol, chuva e Turno sem fim
const H=require('./harness.js')(); const {g,L,ctx}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
L.MARMITA.adiantar=true;   // v9.6.2: desligado no jogo; o código segue testado
const M=L.MARMITA, ST=L.LAYOUT.STATIONS;
const novo=(dia,o)=>{ o=o||{}; g.save=L.normSave(Object.assign({bank:2000,dia},o.save||{})); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.startDay(dia); g.begin();
  if(!o.agenda){ g.schedule=[{t:1e9,type:'entregador',color:0}]; g.nextIdx=0; } };   // agenda: a do dia, de verdade
const roda=(s,cond)=>{ for(let i=0;i<s/0.05;i++){ g.update(0.05); if(cond&&cond()) return true; } return false; };
const entregador=dish=>{ const e=g.spawn({type:'entregador',color:1}); if(dish&&e.dish!==dish){ g.soltaMarmitas(e); e.dish=dish; e.dishes=[dish]; e.bill=L.precoPrato(dish); g.marmitaPara(e); } return e; };
const paciencia=e=>{ e.patLeft=1e9; e.hearts=5; };
const leva=()=>{ const i=g.kitchen.marmJ.findIndex(p=>p); if(i<0) return false; g.tapStation('plates',L.LAYOUT.MARMJ_SLOTS[i].x,L.LAYOUT.MARMJ_SLOTS[i].y); return true; };

// 1. o entregador vai à fila de retirada e o pedido dele vai sozinho ao Tonhão
novo(4);
ok(g.marmitaOk,'dia 4: há entregador no dia (balcão de retirada e adiantar)');
{ const e=entregador('pf');
  ok(e.retira && e.state==='retirada' && g.retirada[0]===e && g.queue.indexOf(e)<0,'o entregador vai à fila de retirada, não à espera');
  ok(e.extras.every(x=>!x),'sem 2º item');
  const t=g.kitchen.queue.find(t=>t.marmita);
  ok(t && t.dono===e && t.dish==='pf' && t.enc,'a encomenda da Efood vai ao fogão, com o dono');
  roda(1); ok(Math.hypot(e.x-L.RETIRADA.fila[0].x,e.y-L.RETIRADA.fila[0].y)<1,'chega ao 1º lugar da fila, ao lado do balcão');
  // 2. a marmita não usa prato limpo, mas ocupa a janela de prontos; ingredientes e embalagem saem quando fica pronta
  paciencia(e); g.kitchen.clean=0; const c0=g.custo;
  ok(roda(15,()=>g.kitchen.marmJ.some(p=>p)),'a marmita fica pronta mesmo sem prato limpo');
  const p=g.kitchen.marmJ.find(p=>p);
  ok(g.kitchen.clean===0 && !g.kitchen.noPlate,'não gasta prato limpo');
  ok(Math.round(g.custo-c0)===Math.round(L.precoPrato('pf')*L.INGRED.prato)+M.embalagem,'custo: ingredientes do prato + embalagem de R$ '+M.embalagem+' ('+Math.round(g.custo-c0)+')');
  ok(p.dono===e,'a marmita pronta é do entregador');
  // 3. a Bia leva ao balcão e o entregador paga: o prato com a gorjeta dos corações, menos a Efood
  paciencia(e); const m0=g.money, pt0=g.pontos, sv0=g.stats.served;
  leva(); ok(g.bia.acts[0].type==='plate','toque na marmita pronta: a Bia vai buscar');
  ok(g.tapStation('retirada'),'toque no balcão de retirada entra na fila de ações');
  ok(roda(15,()=>e.state==='leaving'),'o entregador leva a marmita e vai embora');
  const preco=L.precoPrato('pf'), liq=Math.round(preco*(1+L.GORJETA[5]))-Math.round(preco*M.efood);
  ok(Math.round(g.money-m0)===liq,'paga o prato com gorjeta, menos '+Math.round(M.efood*100)+'% da Efood (+'+Math.round(g.money-m0)+')');
  ok(g.efood===Math.round(preco*M.efood) && g.stats.marmitas===1 && g.stats.served===sv0+1,'Efood, marmitas e atendidos contados');
  ok(g.pontos>pt0,'rende pontos de atendimento');
  ok(!g.retirada.length && !g.bia.hands.length,'fila de retirada e mãos vazias'); }

// 4. adiantar: até MARMITA.vagas de PF, na prateleira; o entregador de PF leva uma na hora
novo(4);
{ g.tapStation('adiantar'); g.tapStation('adiantar'); g.tapStation('adiantar');
  ok(roda(3,()=>g.bia.acts.length===0),'a Bia vai à janela de pedidos');
  ok(g.kitchen.queue.concat(g.kitchen.cooking).filter(t=>t.marmita&&!t.dono).length===M.vagas,'adianta '+M.vagas+' marmitas sem dono (a 3ª não)');
  ok(g.marmitasLivres===M.vagas,'marmitasLivres = '+M.vagas);
  ok(roda(20,()=>g.kitchen.marmJ.filter(p=>p).length===2),'as duas ficam prontas');
  g.kitchen.marmJ.forEach((p,i)=>{ if(p) g.tapStation('plates',L.LAYOUT.MARMJ_SLOTS[i].x,L.LAYOUT.MARMJ_SLOTS[i].y); }); g.tapStation('retirada');
  ok(roda(20,()=>g.prateleira.length===2),'sem bandeja, uma por mão: as 2 vão para a prateleira');
  ok(g.prateleira.every(m=>m.dish===M.prato && !m.dono),'na prateleira, sem dono');
  const e=entregador('pf'), q0=g.kitchen.queue.length;
  ok(g.prateleira.some(m=>m.dono===e) && g.kitchen.queue.length===q0,'o entregador de PF fica com a da prateleira (sem encomenda nova)');
  ok(roda(3,()=>e.state==='leaving'),'e leva na hora, ao chegar ao balcão');
  ok(g.prateleira.length===1,'sobra 1 na prateleira');
  const e2=entregador('coxinha');
  ok(g.kitchen.queue.some(t=>t.dono===e2&&t.dish==='coxinha'),'quem pede outro prato: encomenda nova');
  // 5. validade: a sem dono esfria e vai para o lixo
  const lixo=g.trash; g.prateleira[0].age=M.validade-0.01; paciencia(e2);
  roda(0.1); ok(g.prateleira.length===0 && g.stats.esfriou===1 && g.trash===lixo+1,'a marmita adiantada esfria em '+M.validade+' s e vai para o lixo'); }

// 6. prateleira cheia: a 3ª sem dono fica na mão
novo(4);
{ g.prateleira=[{kind:'marmita',dish:'pf',dono:null,age:0,q:4},{kind:'marmita',dish:'pf',dono:null,age:0,q:4}];
  g.bia.hands=[{kind:'marmita',dish:'pf',dono:null,age:0,q:4}];
  ok(g.adiantar(0,0)===false,'com '+M.vagas+' sem dono, não adianta mais');
  g.tapStation('retirada'); roda(6,()=>!g.bia.acts.length);
  ok(g.bia.hands.length===1 && g.prateleira.length===2,'prateleira cheia: a marmita fica na mão');
  // a encomenda cabe na vaga da reserva
  const e=entregador('misto'); paciencia(e);
  g.bia.hands.push({kind:'marmita',dish:'misto',dono:e,age:0,q:4}); g.soltaMarmitas(e); g.bia.hands[1].dono=e;
  e.x=-400; e.path=[{x:L.RETIRADA.fila[0].x,y:L.RETIRADA.fila[0].y}];   // ainda chegando
  ok(g.levaMarmitas(g.bia)===1 && g.prateleira.length===3,'a encomenda de quem está chegando vai para a vaga da reserva');
  ok(roda(4,()=>e.state==='leaving'),'e o entregador pega ao chegar');
  ok(L.prateleiraPos(g).length===2,'prateleiraPos desenha as que ficaram'); }

// 7. entregador perdido: multa, 3ª estrela, a encomenda que nem começou sai do fogão
novo(4);
{ g.kitchen.slots=0;   // nada cozinha
  const e=entregador('pf'), m0=g.money, l0=g.stats.lost;
  ok(roda(40,()=>e.state==='leaving'),'sem a marmita, o entregador perde a paciência e vai embora');
  ok(e.angry && g.stats.lost===l0+1 && g.stats.lostBy.retirada===1,'conta como perdido (retirada)');
  ok(Math.round(m0-g.money)===L.MULTA || g.money===0,'paga a multa');
  ok(!g.kitchen.queue.some(t=>t.marmita),'a encomenda que nem começou sai do fogão');
  ok(!g.retirada.length,'sai da fila de retirada'); }
// v9.6.5: o que já estava no fogão sai sem custo
novo(4);
{ const e=entregador('pf'); roda(0.2); const t=g.kitchen.cooking.find(t=>t.marmita&&t.dono===e);
  ok(!!t,'a encomenda começou a cozinhar');
  e.hearts=1; e.patLeft=0.01; roda(0.1);
  ok(e.angry && g.kitchen.cooking.indexOf(t)<0 && !g.kitchen.queue.includes(t) && g.stats.jogadas===0,'v9.6.5: quem foi embora tira a marmita do fogão, sem custo'); }

// 8. fila de retirada cheia: o 4º entregador não cabe
novo(4);
{ for(let i=0;i<M.fila;i++) g.arrive({type:'entregador',color:0});
  const f0=g.stats.full; g.arrive({type:'entregador',color:0});
  ok(g.retirada.length===M.fila && g.stats.full===f0+1,'fila de retirada com '+M.fila+' lugares: o próximo vê "Lotado!"');
  ok(g.queue.length===0,'ninguém vai para a espera do salão'); }

// 9. avaliação no Gurugol: a espera no balcão conta na espera e na agilidade; bravo reclama da marmita
novo(4);
{ const e=entregador('pf'); e.avalia=true; e.perdMesa=2; e.hearts=3;
  const m={kind:'marmita',dish:'pf',dono:e,age:0,q:4.2}; g.entregaMarmita(e,m);
  const a=g.avals[g.avals.length-1];
  ok(a && a.k==='entregador' && a.s[0]===5-2*L.AVAL.porCoracao && a.s[1]===5-2*L.AVAL.porCoracao,'espera e agilidade pelos corações perdidos no balcão ('+a.s.slice(0,2)+')');
  ok(a.s[2]===4.2,'a nota da marmita');
  const b=entregador('pf'); b.avalia=true; b.hearts=1; b.patLeft=0.01; b.x=L.RETIRADA.fila[0].x; b.y=L.RETIRADA.fila[0].y; b.path=[]; roda(0.1);
  const c=g.avals[g.avals.length-1];
  ok(b.angry && L.AVAL_BRAVO.retirada.includes(c.txt),'o entregador bravo reclama da marmita ("'+c.txt+'")'); }

// 10. a Dani leva as marmitas (tarefa nova)
novo(4,{save:{equipe:{dani:1,daniTasks:['marmita','lavar']}}});
{ ok(L.DANI_TASKS.some(t=>t.id==='marmita') && g.dani.does('marmita'),'tarefa "Levar as marmitas" da Dani');
  const e=entregador('pf'); paciencia(e);
  ok(roda(40,()=>e.state==='leaving'),'a Dani busca a marmita pronta e leva ao balcão');
  ok(g.stats.marmitas===1 && !g.dani.hands.length,'entregue pela Dani'); }

// 11. a Bia leva marmita e prato juntos com a bandeja (a marmita conta como prato)
ok(L.trayOk([{kind:'marmita'},{kind:'dish'}]) && !L.trayOk([{kind:'marmita'},{kind:'dish'},{kind:'juice'}]),'na bandeja, a marmita conta como prato');

// 12. toque: o balcão de retirada e o "+ marmita" só existem no dia com entregador
novo(2,{agenda:true});
{ const r=ST.retirada.rect, a=ST.adiantar.rect;
  ok(!g.marmitaOk && !g.pickAt(r.x+r.w/2,r.y+r.h/2,0),'dia 2: sem balcão de retirada');
  const h=g.pickAt(a.x+a.w/2,a.y+a.h/2,0); ok(!h || h.st!=='adiantar','dia 2: sem o "+ marmita"');
  novo(4); const h2=g.pickAt(r.x+r.w/2,r.y+r.h/2,0), h3=g.pickAt(a.x+a.w/2,a.y+a.h/2,0);
  ok(h2&&h2.st==='retirada','dia 4: toque no balcão de retirada'); ok(h3&&h3.st==='adiantar','dia 4: toque no "+ marmita" (vence a janela de pedidos)');
  const p=g.pickAt(800,130,0); ok(p&&p.st==='order','o resto da janela continua sendo PEDIDOS'); }

// 13. chuva: mais entregadores; o dia não fica impossível (bot)
novo(5);
{ g.clima='chuva'; let ent=0,tot=0; for(let i=0;i<40;i++){ const s=g.buildSchedule(g.day); tot+=s.length; ent+=s.filter(x=>x.type==='entregador').length; }
  ok(ent/tot>0.3,'chuva: '+(100*ent/tot).toFixed(0)+'% de entregadores');
  const bot=require('./bot.js')(g,L,{afiado:true}); let ganhou=0;
  for(let k=0;k<20;k++){ g.save=L.normSave({bank:2000,dia:5,equipe:{tonhao:2,dani:3,daniTasks:['pratos','lavar','lixo']}}); g.up=g.save.up; g.buildTables(); g.startDay(5); g.clima='chuva'; g.schedule=g.buildSchedule(g.day); g.begin();
    let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; if(st%50===0) L.render(g,ctx); }
    if(g.result.passed) ganhou++; }
  ok(ganhou>=8,'chuva no dia 5: o bot afiado bate a meta em '+ganhou+'/20 (v9.6.4: sem VIP na Garagem, ele bate ~2/3 desses dias; antes ~5/6)'); }

// 14. Turno sem fim: o entregador também vai ao balcão
{ g.save=L.normSave({bank:2000}); g.up=g.save.up; g.startEndless(); g.begin();
  ok(g.marmitaOk,'Turno sem fim: balcão de retirada');
  g.arrive({type:'entregador',color:0}); ok(g.retirada.length===1&&g.queue.length===0,'entregador na fila de retirada'); }

// 15. fim do dia: as marmitas entregues, a Efood, as que esfriaram e as que sobraram
novo(4);
{ const e=entregador('pf'); g.entregaMarmita(e,{kind:'marmita',dish:'pf',dono:e,age:0,q:4});
  g.prateleira.push({kind:'marmita',dish:'pf',dono:null,age:0,q:4}); g.stats.esfriou=1;
  g.clock=0.01; roda(4,()=>g.state!=='playing');
  const r=g.result; ok(r && r.marmitas===1 && r.efood===Math.round(L.precoPrato('pf')*M.efood) && r.esfriou===1 && r.sobra===1,'resultado: 1 entregue, Efood, 1 esfriou, 1 sobrou'); }

// 16. desenho com marmita em todo lugar (fogão, pronta, mão, prateleira, fila de ações)
novo(4);
{ const e=entregador('misto'); g.tapStation('adiantar'); roda(12); g.prateleira.push({kind:'marmita',dish:'pf',dono:null,age:30,q:4});
  g.bia.hands=[{kind:'marmita',dish:'coxinha',dono:e,age:0,q:4}]; g.tapStation('retirada'); g.tapStation('adiantar');
  let err=null; try{ L.render(g,ctx); g.state='menu'; L.render(g,ctx); g.state='playing'; }catch(x){ err=x; }
  ok(!err,'render sem erro'+(err?': '+err.message:'')); }

console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
