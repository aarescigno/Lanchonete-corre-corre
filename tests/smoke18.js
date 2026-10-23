// v8.2, Missão zero: o dia 0 é um treino com uma mesa só e pop-ups passo a passo (o ciclo inteiro da Bia).
// Joga o treino todo com toques de verdade (onDown/onUp em coordenadas da tela) e confere que nada vai para a carreira.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els,store}=H;
const tela=(x,y)=>({x:x+g.cam,y});
const toca=(x,y)=>{ const p=tela(x,y); g.onDown(p.x,p.y,0); g.onUp(p.x,p.y); };
const arrasta=(a,b)=>{ const p=tela(a.x,a.y), q=tela(b.x,b.y); g.onDown(p.x,p.y,0); g.onMove((p.x+q.x)/2,(p.y+q.y)/2); g.onMove(q.x,q.y); g.onUp(q.x,q.y); };
const passo=()=>g.treino && g.treino.passo && g.treino.passo.id;
const roda=(f,max)=>{ for(let i=0;i<(max||4000);i++){ if(f()) return true; g.update(0.05); } return f(); };
const desenha=()=>{ try { L.render(g,H.ctx); return true; } catch(e){ console.log(e); return false; } };
const st=k=>{ const r=L.LAYOUT.STATIONS[k].rect; return {x:r.x+r.w/2,y:r.y+r.h/2}; };
const segue=id=>{ ok(passo()===id && g.treino.para,'pop-up "'+id+'" para o jogo'); const a=g.elapsed; g.update(0.5); ok(g.elapsed===a,'"'+id+'": o tempo não anda'); ok(desenha(),'"'+id+'": desenha'); toca(200,300); };

// ---------- menu: quem nunca treinou encontra a Missão zero em destaque (v8.3: um botão à parte) ----------
ok(L.TREINO_PASSOS.length>=20,'passo a passo com '+L.TREINO_PASSOS.length+' passos');
ok(/go/.test(els['btn-treino'].className) && /alt/.test(els['btn-play'].className) && /Missão zero/.test(els['menu-info'].textContent),'Missão zero em destaque para quem nunca treinou');
const real=store[L.LS.save];
els['btn-treino'].fire('click');
ok(g.mode==='treino' && g.state==='playing' && g.day===L.TREINO && g.schedule.length===0,'o botão Missão zero começa o treino, sem a introdução do dia');
ok(g.save._treino && g.salvo && g.up===g.save.up && !Object.keys(g.up).length && !g.save.equipe.dani,'save de jogador novo: sem melhorias nem equipe');
ok(g.tables.length===4 && g.treino.mesa.seats===2 && g.treino.mesa.color===1,'kit da Garagem, mesa do treino de 2 lugares com cadeiras azuis');
ok(/^Missão zero/.test(els['treino-live'].textContent),'o texto do pop-up vai para o leitor de tela');

// ---------- chegada, corações e cor ----------
segue('oi');
ok(roda(()=>passo()==='coracoes'),'o grupo chega à calçada e o passo segue sozinho');
const grp=g.treino.grupo;
ok(grp && grp.type==='vovos' && grp.size===2 && grp.hearts===1 && grp.color===g.treino.mesa.color,'vovô e vovó com 1 coração e camisas da cor da mesa');
segue('coracoes'); segue('cor');
ok(passo()==='sentar' && !g.treino.para,'"sentar" espera o jogador');
g.update(30); ok(grp.hearts===1 && grp.state==='queue','no treino, a paciência não acaba');
const outra=g.tables.find(t=>t!==g.treino.mesa && t.seats>=2);
arrasta(grp,{x:outra.cx,y:outra.cy});
ok(grp.state==='queue' && !outra.group,'mesa de outra cor não aceita o grupo');
arrasta(grp,{x:g.treino.mesa.cx,y:g.treino.mesa.cy});
ok(grp.table===g.treino.mesa && g.money===0 && g.pontos===L.PONTOS_ACAO.sit+L.PONTOS_ACAO.cor && grp.hearts===2,'arrastado até a mesa azul: 10 pontos + 15 da cor (v8.3.8: sem dinheiro) e +1 coração');

// ---------- cardápio, pedido, cozinha, prato ----------
ok(roda(()=>passo()==='anotar'),'esperou o cardápio: chamaram');
toca(g.treino.mesa.cx,g.treino.mesa.cy);
ok(roda(()=>passo()==='fila'),'anotou o pedido');
ok(grp.hearts===3 && g.bia.hands.some(h=>h.kind==='ticket'),'comanda na mão e +1 coração');
segue('fila');
ok(passo()==='cozinha','agora, levar ao Tonhão');
toca(st('order').x,st('order').y);
ok(roda(()=>passo()==='prato'),'pedido entregue e prato pronto');
const pl=g.kitchen.plates.findIndex(p=>p&&p.group===grp);
ok(pl>=0 && !g.kitchen.plates[pl].crit,'prato no balcão (no treino, sem caprichado)');
toca(L.LAYOUT.PLATE_SLOTS[pl].x,L.LAYOUT.PLATE_SLOTS[pl].y);
ok(roda(()=>passo()==='servir'),'a Bia pegou o prato');
toca(g.treino.mesa.cx,g.treino.mesa.cy);

// ---------- cafezinho ----------
ok(roda(()=>passo()==='cafe'),'prato servido');
ok(grp.state==='eating' && grp.hearts===4,'comendo, com 4 corações');
const tm=grp.timer; g.update(1); ok(grp.timer===tm,'a refeição espera o cafezinho');
toca(st('coffee').x,st('coffee').y);
ok(roda(()=>passo()==='cafe2'),'cafezinho na mão');
toca(g.treino.mesa.cx,g.treino.mesa.cy);
ok(roda(()=>passo()==='bonus'),'cafezinho servido');
ok(grp.coffee && grp.hearts===5 && grp.state==='eating','5 corações, ainda comendo');
segue('bonus');

// ---------- conta ----------
ok(roda(()=>passo()==='cobrar'),'acabaram de comer: pedem a conta');
toca(g.treino.mesa.cx,g.treino.mesa.cy);
ok(roda(()=>passo()==='conta'),'conta cobrada');
const c=g.treino.conta;
ok(c && c.h===5 && c.v===Math.round(c.base*1.1),'com 5 corações a conta sai 10% maior (v8.3.8): '+c.base+' -> '+c.v);
ok(new RegExp('R\\$ '+c.base+' virou R\\$ '+c.v).test(g.treino.texto()),'o pop-up mostra a conta: '+g.treino.texto());
segue('conta');

// ---------- louça, pia, lavar, lixo ----------
ok(passo()==='louca' && g.treino.mesa.dirty,'mesa suja');
toca(g.treino.mesa.cx,g.treino.mesa.cy);
ok(roda(()=>passo()==='pia'),'louça recolhida');
toca(st('sink').x,st('sink').y);
ok(roda(()=>passo()==='lavar'),'louça na pia');
toca(st('sink').x,st('sink').y);
ok(roda(()=>passo()==='lixo'),'lavou');
ok(g.trash>0,'lavar encheu um pouco a lixeira');
toca(st('trash').x,st('trash').y);
ok(roda(()=>passo()==='fim'),'lixo pra fora');
ok(store[L.LS.save]===real,'durante o treino, o save de verdade não muda');
segue('fim');

// ---------- fim ----------
ok(g.state==='treinoend' && els['ov-treino'].classList.contains('show'),'"Missão zero completa!"');
ok(!g.treino && !g.salvo && !g.save._treino && g.save.treino===true,'o save de verdade volta, com a Missão zero feita');
ok(JSON.parse(store[L.LS.save]).treino===true,'e fica gravado');
ok(desenha(),'desenha a tela do fim');
els['btn-treino-dia1'].fire('click');
ok(g.state==='intro' && g.mode==='carreira' && g.day.n===1 && g.save.bank===0,'"Começar o dia 1" abre o dia 1 da carreira, sem o dinheiro do treino');
ok(!/Missão zero/.test(els['intro-note'].textContent),'quem já treinou não vê o convite no dia 1');

// ---------- de novo, saindo pela pausa ----------
g.setState('menu');
ok(/go/.test(els['btn-play'].className) && /alt/.test(els['btn-treino'].className) && /dia 1/.test(els['btn-play'].textContent),'quem já treinou encontra o "Começar o dia 1" em destaque');
els['btn-treino'].fire('click');
ok(g.mode==='treino' && g.treino.i===0,'dá para treinar de novo');
toca(200,300); roda(()=>g.treino.grupo); g.pause();
els['btn-restart'].fire('click');
ok(g.mode==='treino' && g.treino.i===0 && g.state==='playing' && g.salvo,'Reiniciar recomeça a Missão zero');
g.pause(); els['btn-pause-menu'].fire('click');
ok(g.state==='menu' && g.mode==='carreira' && !g.salvo && !g.save._treino && g.save.treino===true,'Menu no meio do treino devolve o save de verdade');

// ---------- jogador novo: convite no dia 1 ----------
{ const H2=load(); H2.els['btn-play'].fire('click');
  ok(H2.g.mode==='carreira' && /Missão zero/.test(H2.els['intro-note'].textContent),'quem pula o treino vê o convite na introdução do dia 1'); }

// ---------- cartão longe do alvo ----------
{ const a=[{x:400,y:20,w:400,h:200}], r=L.treinoLugar(a,470,200);
  ok(!(r.x<800 && r.x+r.w>400 && r.y<220 && r.y+r.h>20),'o cartão não cobre o alvo'); }

console.log('total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
