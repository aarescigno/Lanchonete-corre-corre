// v8.4, avaliações do Gurugol: cada grupo que sai na carreira dá de 1 a 5 em 5 critérios; a nota é a média das últimas
// 100, a partir da 20ª; ela mexe no movimento (−10% a +10%); vai no save, no fim do dia, no caixa e no HUD.
const H=require('./harness.js')(); const {g,L,els}=H;
const bot=require('./bot.js')(g,L,{});
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const texto=e=>(e.textContent||'')+(e.children||[]).map(texto).join(' ');
const A=L.AVAL, cinco=n=>Array.from({length:n},()=>[5,5,5,5,5]), um=n=>Array.from({length:n},()=>[1,1,1,1,1]);

// constantes e contas
ok(A.max===100 && A.min===20,'média das últimas 100, a partir da 20ª');
ok(L.AVAL_CRIT.length===5 && L.AVAL_CRIT.map(c=>c.id).join()==='espera,agil,prato,menu,amb','5 critérios');
ok(L.normAval(cinco(150)).length===100,'guarda só as últimas 100');
ok(JSON.stringify(L.normAval([[9,0,'x',3.14,2],[1,2],'lixo']))==='[[5,1,1,3.1,2]]','normAval: limita de 1 a 5, uma casa, e joga fora o inválido');
ok(L.avalGeral(cinco(19))===null && L.avalGeral(cinco(20)).nota===5,'sem nota até a 20ª');
ok(L.avalGeral(L.normAval(um(50).concat(cinco(100)))).nota===5,'as 100 últimas (as 50 de 1 ★ antes delas saem)');
{ const m=L.avalMedias([[5,4,3,2,1],[3,4,5,2,1]]); ok(m.n===2 && m.crit.join()==='4,4,4,2,1' && Math.abs(m.nota-3)<1e-9,'médias por critério e a nota (pesos iguais)'); }
ok(L.avalMovimento([])===1 && Math.abs(L.avalMovimento(cinco(20))-1.1)<1e-9 && Math.abs(L.avalMovimento(um(20))-0.9)<1e-9 && L.avalMovimento(Array.from({length:20},()=>[3,3,3,3,3]))===1,'movimento: 1 ★ −10%, 3 ★ igual, 5 ★ +10%');
ok(L.fmtNota(4.25)==='4,3' && L.fmtNota(null)==='–','nota com vírgula');
ok(Math.abs(L.avalMenu()-4.5)<1e-9,'cardápio da Garagem (4 pratos): 4,5');
ok(L.avalComentario([5,5,5,5,5])!=='' && L.AVAL_BRAVO.fila.includes(L.avalComentario([1,1,1,4,3],'fila')),'comentário (e o de quem desistiu na fila)');
ok(L.AVAL_CRIT[0].ruim.includes(L.avalComentario([1,3,3,3,3])),'nota baixa reclama do pior critério');
ok(L.avalComentario([4,4,4,4,1],'',true)==='Que cheiro de lixo!','ambiente ruim com a lixeira cheia: o cheiro');

// save
{ const s=L.normSave({aval:cinco(120)}); ok(s.aval.length===100,'save: aval normalizado'); ok(L.normSave({}).aval.length===0,'save novo: sem avaliações'); }

// movimento do dia pela nota
g.save=L.normSave({dia:7,bank:500}); g.up=g.save.up; g.buildTables();
const N=av=>{ g.save.aval=av; g.resetDay(7); return g.schedule.length; };
ok(N(cinco(20))>N([]) && N(um(20))<N([]),'nota alta traz mais grupos; baixa, menos');

// critérios de um grupo
g.save=L.normSave({dia:3,bank:500}); g.up=g.save.up; g.buildTables(); g.startDay(3); g.begin();
{ const gr=g.spawn({type:'estudante',color:0,vip:false});
  gr.perdFila=2; gr.perdMesa=1; gr.pratoQ=4.2; gr.corCerta=true; gr.coffee=true;
  g.avaliar(gr,0,0); const r=g.avals[0].r;
  ok(r[0]===3.5,'espera: 2 corações perdidos lá fora tiram 1,5');
  ok(r[1]===4.8,'agilidade: 1 coração na mesa (−0,75) e a cor certa (+0,5)');
  ok(r[2]===4.2 && r[3]===4.5,'prato e cardápio');
  ok(r[4]===A.amb.base+A.amb.cafe,'ambiente: a base e o cafezinho');
  gr.corrente=true; gr.capricho=true; gr.perdMesa=0; g.avaliar(gr,0,0); ok(g.avals[1].r[1]===5,'agilidade não passa de 5');
  gr.perdMesa=0; gr.state='ordered'; gr.hearts=3; gr.perdMesa=2; gr.gain(1); ok(gr.perdMesa===1,'coração devolvido na mesa compensa um perdido');
  gr.state='queue'; gr.hearts=3; gr.perdFila=2; gr.gain(1); ok(gr.perdFila===1,'e na espera também');
  g.trash=L.TRASH.cap; g.avaliar(gr,0,0); ok(g.avals[2].r[4]===A.amb.base+A.amb.cafe+A.amb.lixo,'lixeira cheia tira do ambiente'); g.trash=0;
  const n0=g.avals.length; gr.hearts=1; gr.perdFila=5; gr.pratoQ=0; g.angryLeave(gr); const rb=g.avals[n0].r;
  ok(g.avals.length===n0+1 && rb[1]===1 && rb[2]===1 && rb[0]===1.3,'quem desiste na fila: espera baixa, agilidade e prato 1');
  ok(L.AVAL_BRAVO.fila.includes(g.avals[n0].txt),'e reclama de ter desistido'); }
{ g.kitchen.submit({group:g.spawn({type:'estudante',color:0,vip:false}),table:null}); g.kitchen.clean=9; g.kitchen.queue[0].time=0.01; g.kitchen.update(0.1);
  const p=g.kitchen.plates.find(Boolean), fx=A.prato[g.save.equipe.tonhao];
  ok(p && (p.crit ? p.q===5 : p.q>=fx[0] && p.q<=fx[1]),'prato pronto com a nota da faixa do Tonhão (caprichado: 5)'); }

// só a carreira avalia
{ g.save=L.normSave({bank:500}); g.up=g.save.up; g.buildTables(); g.resetDay(0); g.setState('playing');
  const gr=g.spawn({type:'estudante',color:0,vip:false}); g.avaliar(gr,0,0); ok(g.avals.length===0,'Turno sem fim não avalia'); }

// dia inteiro com o bot: as avaliações entram no save, no resultado, no caixa e no fim do dia
g.save=L.normSave({dia:3,bank:2000,equipe:{tonhao:2,dani:3,daniTasks:['pratos','lavar','lixo']}}); g.up=g.save.up; g.buildTables();
g.startDay(3); g.begin();
let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
{ const r=g.result, a=r&&r.aval;
  ok(a && a.dia && a.dia.n>=8 && a.dia.n===g.save.aval.length,'as avaliações do dia vão para o save ('+(a&&a.dia&&a.dia.n)+')');
  ok(a.dia.nota>=1 && a.dia.nota<=5 && a.coment.length>=1 && a.coment.length<=3,'nota do dia '+L.fmtNota(a.dia.nota)+' e '+a.coment.length+' comentário(s)');
  ok(a.geral===null || a.dia.n>=20,'sem nota geral antes da 20ª');
  const row=g.save.caixa[g.save.caixa.length-1]; ok(row.av===Math.round(a.dia.nota*10),'linha do caixa com a nota do dia');
  ok(L.normCaixa([{d:3,av:44}])[0].av===44,'normCaixa guarda a nota');
  const gb=els['end-stats'].children[0];
  ok(gb.className==='guru' && /^Gurugol: .*Espera por mesa \d,\d/.test(gb.getAttribute('aria-label')) && /^Hoje, em \d+ avaliações: espera por mesa/.test(els['end-aval'].title),'fim do dia: a caixa do Gurugol à esquerda dos quadros');
  ok(gb.children.filter(c=>c.className==='guru-crit').length===5,'uma barra por critério');
  ok(L.notaFaixa(3.94)==='pura' && L.notaFaixa(3.96)==='prata' && L.notaFaixa(4.44)==='prata' && L.notaFaixa(4.5)==='ouro' && L.notaFaixa(4.8)==='ouro' && L.notaFaixa(4.85)==='diamante','faixas: pura, prata (4 a 4,4), ouro (4,5 a 4,8) e diamante (acima de 4,8)');
  ok(/Gurugol sem nota \(\d+\/20\)/.test(L.caixaResumo(g.save)),'resumo do caixa: sem nota ainda'); }
g.save.aval=L.normAval(cinco(30));
ok(g.gurugol.nota===5 && /Gurugol 5,0 \(espera por mesa 5,0/.test(L.caixaResumo(g.save)),'com 20 ou mais: a nota no HUD e no resumo');
// v8.4.2: aba Gurugol na lojinha, com a caixa da nota e os últimos comentários; os critérios com os nomes novos
ok(L.AVAL_CRIT[2].nome==='Qualidade da comida' && L.AVAL_CRIT[3].nome==='Diversidade do cardápio','critérios: qualidade da comida e diversidade do cardápio');
{ const n=g.save.avalCom.length, c=g.save.avalCom[n-1];
  ok(n>=8 && n<=L.AVAL_COM && c.d===3 && c.n>=10 && c.n<=50 && typeof c.t==='string' && L.CUSTOMER_TYPES[c.k],'comentários do dia no save (dia, nota, texto e quem)');
  ok(L.normAvalCom(Array.from({length:50},(_,i)=>({d:i+1,n:45,t:'Bom!',k:'familia'}))).length===L.AVAL_COM && L.normAvalCom([{d:2,n:99,t:'x',k:'alien',v:1},{t:''},null])[0].n===50 && L.normAvalCom([{d:2,n:30,t:'x',k:'alien'}])[0].k==='estudante','normAvalCom: guarda os últimos 30 e limpa o resto');
  ok(L.normSave({avalCom:[{d:1,n:40,t:'Oi',k:'vovos'}]}).avalCom.length===1,'save leva os comentários'); }
g.save.avalCom=L.normAvalCom([{d:2,n:32,t:'Comida meio fria.',k:'executiva'},{d:3,n:49,t:'Comida de mãe!',k:'familia',v:1}]);
g.goShop(4); L.setShopTab('gurugol');
{ const t=texto(els['shop-grid']), gr=els['shop-grid'];
  ok(gr.className==='shopgrid gurugol' && gr.children[0].children[0].className==='guru','aba Gurugol: a caixa da nota');
  ok(/\+10% de movimento/.test(t) && /média das últimas 30 avaliações/.test(t),'aba Gurugol: movimento e quantas avaliações');
  const li=gr.children[1].children; ok(li.length===2 && /Comida de mãe!/.test(texto(li[0])) && /Família \(VIP\) · dia 3/.test(texto(li[0])) && /Comida meio fria/.test(texto(li[1])),'aba Gurugol: os comentários, do mais novo para o mais velho'); }
L.setShopTab('caixa'); ok(!/Gurugol/.test(texto(els['shop-grid'])),'o Gurugol saiu da aba Caixa');
g.save.aval=[]; L.setShopTab('gurugol'); ok(/Ainda ninguém avaliou/.test(texto(els['shop-grid'])),'aba Gurugol sem avaliações'); g.save.aval=L.normAval(cinco(30));
g.startDay(4); g.begin(); let rn=true; try{ for(let i=0;i<40;i++){ bot(); g.update(0.05); L.render(g,H.ctx); } }catch(e){ rn=false; console.log(e); } ok(rn,'HUD com a nota desenha sem erro');
console.log('smoke25.js: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
