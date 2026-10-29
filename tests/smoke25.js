// v8.4, avaliações do Gurugol: cada grupo que sai na carreira dá de 1 a 5 em 5 critérios; a nota é a média das últimas
// 30, a partir da 8ª; só 4 grupos sorteados por dia avaliam; ela mexe no movimento (−10% a +10%); vai no save, no fim do dia, no caixa e no HUD.
const H=require('./harness.js')(); const {g,L,els}=H;
const bot=require('./bot.js')(g,L,{});
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const texto=e=>(e.textContent||'')+(e.children||[]).map(texto).join(' ');
const A=L.AVAL, cinco=n=>Array.from({length:n},()=>[5,5,5,5,5]), um=n=>Array.from({length:n},()=>[1,1,1,1,1]);

// constantes e contas
ok(A.max===30 && A.min===8 && A.porDia===4,'média das últimas 30, a partir da 8ª, 4 por dia');
ok(L.AVAL_CRIT.length===5 && L.AVAL_CRIT.map(c=>c.id).join()==='espera,agil,prato,menu,amb','5 critérios');
ok(L.normAval(cinco(150)).length===30,'guarda só as últimas 30');
ok(JSON.stringify(L.normAval([[9,0,'x',3.14,2],[1,2],'lixo']))==='[[5,1,1,3.1,2]]','normAval: limita de 1 a 5, uma casa, e joga fora o inválido');
ok(L.avalGeral(cinco(7))===null && L.avalGeral(cinco(8)).nota===5,'sem nota até a 8ª');
ok(L.avalGeral(L.normAval(um(50).concat(cinco(30)))).nota===5,'as 30 últimas (as 50 de 1 ★ antes delas saem)');
{ const m=L.avalMedias([[5,4,3,2,1],[3,4,5,2,1]]); ok(m.n===2 && m.crit.join()==='4,4,4,2,1' && Math.abs(m.nota-3)<1e-9,'médias por critério e a nota (pesos iguais)'); }
const tres=n=>Array.from({length:n},()=>[3,3,3,3,3]), dois=n=>Array.from({length:n},()=>[2,2,2,2,2]);
ok(L.avalMovimento([])===1 && Math.abs(L.avalMovimento(tres(20))-1.1)<1e-9 && Math.abs(L.avalMovimento(cinco(20))-1.1)<1e-9 && Math.abs(L.avalMovimento(um(20))-0.9)<1e-9 && Math.abs(L.avalMovimento(dois(20))-1)<1e-9,'movimento na Garagem: 1 ★ −10%, 2 ★ igual, 3 ★ (o teto) ou mais +10%');
// v8.6.4: teto por ponto
ok(A.teto.join()==='3,3.7,4.3,5' && L.avalTeto(L.PONTOS[0])===3 && L.avalTeto({nivel:4})===5 && L.avalTeto({nivel:2})===3.7,'teto: Garagem 3, área industrial 3,7, Avenida Brasil 4,3, Terraço Suíça 5');
ok(L.avalEscala(5,3)===3 && L.avalEscala(1,3)===1 && L.avalEscala(3,3)===2 && L.avalEscala(5,5)===5,'o serviço 5 vale o teto; 1 continua 1');
ok(Math.abs(L.avalMovimento(Array.from({length:20},()=>[4.3,4.3,4.3,4.3,4.3]),{nivel:4})-1.065)<1e-9 && Math.abs(L.avalMovimento(tres(20),{nivel:4})-1)<1e-9,'no Terraço: neutro em 3 ★, +10% só com 5 ★');
{ const s=L.normSave({aval:cinco(10),avalCom:[{d:1,n:46,t:'Bom!',k:'familia'}],caixa:[{d:1,av:44}]});
  ok(s.avalEsc===2 && s.aval[0].join()==='3,3,3,3,3' && s.avalCom[0].n===28 && s.caixa[0].av===27,'save antigo: as notas passam para a escala da Garagem (4,6 vira 2,8)');
  const s2=L.normSave(JSON.parse(JSON.stringify(s))); ok(s2.aval[0].join()==='3,3,3,3,3' && s2.avalCom[0].n===28,'e só uma vez'); }
ok(L.AVAL_SIMPLES[0].length>=2,'comentários de lugar simples na Garagem');
ok(L.fmtNota(4.25)==='4,3' && L.fmtNota(null)==='–','nota com vírgula');
ok(Math.abs(L.avalMenu({})-2)<1e-9 && Math.abs(L.avalMenu({pastel:1,chapa:1})-3.2)<1e-9,'cardápio da Garagem: 2,0 de início e +0,6 por curso (v8.6.9)');
ok(L.avalComentario([5,5,5,5,5])!=='' && L.AVAL_BRAVO.fila.includes(L.avalComentario([1,1,1,4,3],'fila')),'comentário (e o de quem desistiu na fila)');
ok(L.AVAL_CRIT[0].ruim.includes(L.avalComentario([1,3,3,3,3])),'nota baixa reclama do pior critério');
ok(L.avalComentario([4,4,4,4,1],'',true)==='Que cheiro de lixo!','ambiente ruim com a lixeira cheia: o cheiro');

// save
{ const s=L.normSave({aval:cinco(120)}); ok(s.aval.length===30,'save: aval normalizado'); ok(L.normSave({}).aval.length===0,'save novo: sem avaliações'); }

// movimento do dia pela nota
g.save=L.normSave({dia:7,bank:500}); g.up=g.save.up; g.buildTables();
const N=av=>{ g.save.aval=av; g.resetDay(7); return g.schedule.length; };
ok(N(cinco(8))>N([]) && N(um(8))<N([]),'nota alta traz mais grupos; baixa, menos');

// critérios de um grupo
g.save=L.normSave({dia:3,bank:500}); g.up=g.save.up; g.buildTables(); g.startDay(3); g.begin();
{ const gr=g.spawn({type:'estudante',color:0,vip:false,av:true});
  gr.perdFila=2; gr.perdMesa=1; gr.pratoQ=4.2; gr.corCerta=true; gr.coffee=true;
  g.avaliar(gr,0,0); const r=g.avals[0].s;
  ok(r[0]===3.5,'espera: 2 corações perdidos lá fora tiram 1,5');
  ok(r[1]===4.3,'agilidade: 1 coração na mesa (−0,75); a cor certa não soma mais (v8.6.7)');
  ok(r[2]===4.2 && r[3]===2,'prato e cardápio (2,0 sem cursos, v8.6.9)');
  ok(r[4]===A.amb.base+A.amb.cafe,'ambiente: a base e o cafezinho');
  const v=g.avals[0].r, d=v.map((x,i)=>x-L.avalEscala(r[i],3)), h=d[0];   // r[0] é o menor: não passa do teto + folga
  ok(v.every((x,i)=>Math.abs(x-Math.min(3+A.humor.folga*2,L.avalEscala(r[i],3)+h))<0.11) && h>=-A.humor.var*2-0.06 && h<=(A.humor.var+A.humor.extra[1])*2+0.06,'no Gurugol: a escala da Garagem mais o humor do cliente, até 3,8 ('+v+')');
  { let mx=0; for(let i=0;i<300;i++){ g.avaliar(gr,0,0); mx=Math.max(mx,...g.avals[g.avals.length-1].r); } g.avals.length=1; ok(mx<=3+A.humor.folga*2+1e-9,'nenhum critério passa de 3,8 na Garagem ('+mx+')'); }
  gr.corrente=true; gr.capricho=true; gr.perdMesa=0; g.avaliar(gr,0,0); ok(g.avals[1].s[1]===5,'agilidade não passa de 5');
  gr.perdMesa=0; gr.state='ordered'; gr.hearts=3; gr.perdMesa=2; gr.gain(1); ok(gr.perdMesa===1,'coração devolvido na mesa compensa um perdido');
  gr.state='queue'; gr.hearts=3; gr.perdFila=2; gr.gain(1); ok(gr.perdFila===1,'e na espera também');
  g.trash=L.TRASH.cap; g.avaliar(gr,0,0); ok(g.avals[2].s[4]===A.amb.base+A.amb.cafe+A.amb.lixo,'lixeira cheia tira do ambiente'); g.trash=0;
  const n0=g.avals.length; gr.hearts=1; gr.perdFila=5; gr.pratoQ=0; g.angryLeave(gr); const rb=g.avals[n0].r;
  ok(g.avals[n0].s[0]===1.3 && rb[0]===1.2,'na Garagem, a espera 1,3 do serviço vira 1,2 (sem humor para quem saiu bravo)');
  ok(g.avals.length===n0+1 && rb.slice(1).every(v=>v===null),'quem desiste na fila avalia só a espera (v8.6.7): os outros critérios ficam null');
  ok(L.AVAL_BRAVO.fila.includes(g.avals[n0].txt),'e reclama de ter desistido'); }
{ g.kitchen.submit({group:g.spawn({type:'estudante',color:0,vip:false,av:true}),table:null}); g.kitchen.clean=9; g.kitchen.queue[0].time=0.01; g.kitchen.update(0.1);
  const p=g.kitchen.plates.find(Boolean), fx=A.prato[g.save.equipe.tonhao];
  ok(p && (p.crit ? p.q===5 : p.q>=fx[0] && p.q<=fx[1]),'prato pronto com a nota da faixa do Tonhão (caprichado: 5)');
  // v8.6.8, prato quente: quente até 8 s no balcão; depois perde até 1,5 em 20 s
  const P=L.PRATO;
  ok(L.pratoPerde(0)===0 && L.pratoPerde(P.quente)===0 && Math.abs(L.pratoPerde(P.quente+P.rampa/2)-P.perde/2)<1e-9 && L.pratoPerde(999)===P.perde,'prato: quente até 8 s, perde até 1,5 em 20 s');
  ok(L.pratoVapor(P.quente)===1 && L.pratoVapor(P.quente+P.rampa)===0,'o vapor some aos poucos');
  p.q=5; p.crit=true; p.age=P.quente; g.bia.hands=[]; g.bia.perform({type:'plate',pid:p.id});
  ok(g.bia.hands[0].q===5 && !g.bia.hands[0].fria,'caprichado entregue quente continua 5');
  const gf=g.spawn({type:'estudante',color:0,vip:false,av:true}); gf.fria=true; gf.pratoQ=2; gf.perdFila=0; gf.perdMesa=0;
  ok(L.avalComentario([4,4,2,3,3],'',false,1,[],true)==='Comida meio fria.' && L.AVAL_CRIT[2].ruim.includes(L.avalComentario([4,4,2,3,3])),'o prato frio reclama de "Comida meio fria."'); }
{ g.kitchen.plates=[null,null,null,null]; g.bia.hands=[]; const gp=g.spawn({type:'estudante',color:0,vip:false,av:true});
  g.kitchen.plates[0]={id:99,table:null,group:gp,dish:'pf',slot:0,age:L.PRATO.quente+L.PRATO.rampa,crit:false,q:4,vip:false}; g.bia.perform({type:'plate',pid:99});
  ok(Math.abs(g.bia.hands[0].q-(4-L.PRATO.perde))<1e-9 && g.bia.hands[0].fria,'o prato que esfriou de vez perde 1,5 e vem "fria"'); }

// v8.6.7: cada um avalia só o que viveu (null: não viu); médias por critério com contagem; humor pela faixa do ponto; nota mínima
{ const m=L.avalMedias([[5,4,null,null,null],[3,4,5,2,1],[null,null,null,null,3]]);
  ok(m.n===3 && m.cnt.join()==='2,2,1,1,2' && m.crit.join()==='4,4,5,2,2' && Math.abs(m.nota-3.4)<1e-9,'médias por critério só de quem viu, e a nota é a média das médias ('+m.crit+' '+m.nota+')');
  ok(L.avalMedias([[5,null,null,null,null]]).crit[1]===null && L.avalMedias([[5,null,null,null,null]]).nota===5,'critério que ninguém viu fica null e não entra na nota');
  ok(L.avalNota([4,null,2,null,null])===3,'nota de uma avaliação: só os critérios vistos');
  ok(L.normAval([[3,null,2.44,1,5],[1,2,3]]).length===1 && L.normAval([[3,null,2.44,1,5]])[0].join()==='3,,2.4,1,5','normAval guarda null (e o save antigo, sem null, continua valendo)');
  ok(L.avalComentario([null,null,null,null,2])!=='' && L.AVAL_CRIT[4].ruim.includes(L.avalComentario([null,null,null,null,2])),'comentário com critérios null'); }
{ g.save=L.normSave({dia:3,bank:500}); g.up=g.save.up; g.buildTables(); g.startDay(3); g.begin();
  const quem=(estado,extra)=>{ const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); Object.assign(gr,extra||{}); gr.state=estado; gr.perdFila=1; gr.perdMesa=1; gr.pratoQ=3; g.avals.length=0; g.angryLeave(gr); return g.avals[0]&&g.avals[0].r.map(v=>v===null?'-':'x').join(''); };
  ok(quem('queue')==='x----','bravo na fila: só a Espera');
  ok(quem('wantOrder')==='xx--x','bravo antes do pedido: Espera, Agilidade e Ambiente');
  ok(quem('ordered')==='xx-xx','bravo depois do pedido, sem comer: mais o Cardápio');
  ok(quem('wantBill')==='xxxxx' && quem('eating')==='xxxxx','bravo que já comeu: os 5');
  ok(quem('retirada',{retira:true})==='xx---','entregador bravo (sem a marmita): Espera e Agilidade');
  { const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); gr.retira=true; gr.pratoQ=4; gr.perdMesa=0; g.avals.length=0; g.avaliar(gr,0,0); ok(g.avals[0].r.map(v=>v===null?'-':'x').join('')==='xxx--','entregador que levou a marmita: Espera, Agilidade e Comida'); }
  { const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); gr.pratoQ=4; g.avals.length=0; g.avaliar(gr,0,0); ok(g.avals[0].r.every(v=>v!==null),'quem comeu e pagou: os 5'); }
  // humor pela faixa do ponto: no Terraço (teto 5), limite 5; a Garagem (teto 3) segue com folga de 0,8
  const lim=(nivel)=>{ Object.defineProperty(g,'ponto',{get:()=>({nivel}),configurable:true}); const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); gr.pratoQ=5; gr.corCerta=true; gr.corrente=true; gr.capricho=true; let mx=0,mn=9; g.avals.length=0; for(let i=0;i<400;i++){ g.avaliar(gr,0,0); const r=g.avals[g.avals.length-1].r; mx=Math.max(mx,r[0]); mn=Math.min(mn,r[0]); } return [mx,mn]; };
  const t=lim(4); ok(t[0]===5 && t[1]<5 && t[1]>=5-A.humor.var*4-0.06,'Terraço: o humor chega a 5 e desce em fração da faixa ('+t+')');
  const b=lim(3); ok(b[0]<=5 && b[0]>4.3 && b[1]<4.3,'Avenida Brasil: o encantado passa do teto 4,3 (até 5) e o humor ruim fica abaixo dele ('+b+')');
  delete g.ponto; }
{ const mn=[3,3.7,4.3,5].map(t=>L.avalMinimo({nivel:[3,3.7,4.3,5].indexOf(t)+1}));
  ok(mn.join()==='2.9,3.6,4.1,4.8','nota mínima: 95% do teto, arredondada para cima ('+mn+')'); }
{ // a chance de encantar sobe com a cor certa, a corrente e o caprichado
  const taxa=(f)=>{ const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); gr.pratoQ=5; f(gr); gr.perdMesa=0; gr.perdFila=0; let n=0; const base=L.avalEscala(5,3); g.avals.length=0; for(let i=0;i<2000;i++){ g.avaliar(gr,0,0); const r=g.avals[g.avals.length-1].r[3]; if(r>L.avalEscala(g.avals[g.avals.length-1].s[3],3)+A.humor.var*2+0.15) n++; } g.avals.length=0; return n/2000; };
  const sem=taxa(()=>{}), com=taxa(gr=>{ gr.corCerta=true; gr.corrente=true; gr.capricho=true; });
  ok(com>sem+0.15,'cor certa, corrente e caprichado aumentam a chance de encantar ('+sem.toFixed(2)+' → '+com.toFixed(2)+')'); }
// só a carreira avalia
{ g.save=L.normSave({bank:500}); g.up=g.save.up; g.buildTables(); g.resetDay(0); g.setState('playing');
  const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); g.avaliar(gr,0,0); ok(g.avals.length===0,'Turno sem fim não avalia'); }

// dia inteiro com o bot: as avaliações entram no save, no resultado, no caixa e no fim do dia
g.save=L.normSave({dia:3,bank:2000,equipe:{tonhao:2,dani:3,daniTasks:['pratos','lavar','lixo']}}); g.up=g.save.up; g.buildTables();
g.startDay(3); g.begin();
let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; }
{ const r=g.result, a=r&&r.aval;
  ok(a && a.dia && a.dia.n>=1 && a.dia.n<=4 && a.dia.n===g.save.aval.length,'só até 4 avaliações por dia, e vão para o save ('+(a&&a.dia&&a.dia.n)+')');
  ok(a.dia.nota>=1 && a.dia.nota<=5 && a.coment.length>=1 && a.coment.length<=3,'nota do dia '+L.fmtNota(a.dia.nota)+' e '+a.coment.length+' comentário(s)');
  ok(a.geral===null || g.save.aval.length>=8,'sem nota geral antes da 8ª');
  const row=g.save.caixa[g.save.caixa.length-1]; ok(row.av===Math.round(a.dia.nota*10),'linha do caixa com a nota do dia');
  ok(L.normCaixa([{d:3,av:44}])[0].av===44,'normCaixa guarda a nota');
  const gb=els['end-stats'].children[0];
  ok(gb.className==='guru' && /^Gurugol: .*Espera por mesa \d,\d/.test(gb.getAttribute('aria-label')) && /^Hoje, em \d+ avaliações: espera por mesa/.test(els['end-aval'].title),'fim do dia: a caixa do Gurugol à esquerda dos quadros');
  ok(gb.children.filter(c=>c.className==='guru-crit').length===5,'uma barra por critério');
  ok(L.notaFaixa(2.94)==='pura' && L.notaFaixa(2.96)==='bronze' && L.notaFaixa(3)==='bronze' && L.notaFaixa(3.94)==='bronze' && L.notaFaixa(3.96)==='prata' && L.notaFaixa(4.44)==='prata' && L.notaFaixa(4.5)==='ouro' && L.notaFaixa(4.8)==='ouro' && L.notaFaixa(4.85)==='diamante','faixas: pura, bronze (3 a 3,9), prata (4 a 4,4), ouro (4,5 a 4,8) e diamante (acima de 4,8)');
  ok(/Gurugol sem nota \(\d+\/8\)/.test(L.caixaResumo(g.save)),'resumo do caixa: sem nota ainda'); }
g.save.aval=L.normAval(cinco(30));
ok(g.gurugol.nota===5 && /Gurugol 5,0 \(espera por mesa 5,0/.test(L.caixaResumo(g.save)),'com 8 ou mais: a nota no HUD e no resumo');
// v8.4.2: aba Gurugol na lojinha, com a caixa da nota e os últimos comentários; os critérios com os nomes novos
ok(L.AVAL_CRIT[2].nome==='Qualidade da comida' && L.AVAL_CRIT[3].nome==='Diversidade do cardápio','critérios: qualidade da comida e diversidade do cardápio');
{ const n=g.save.avalCom.length, c=g.save.avalCom[n-1];
  ok(n>=1 && n<=4 && c.d===3 && c.n>=10 && c.n<=50 && typeof c.t==='string' && L.CUSTOMER_TYPES[c.k],'comentários do dia no save (dia, nota, texto e quem)');
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
