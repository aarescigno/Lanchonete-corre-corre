// v11.3, etapa 8c: as conversas do arco (o motor ARCO e as 7 da Garagem e da área industrial). Roteiro em docs/ARCO.md §6; spec em docs/spec-v11.3.md.
// CA1 as 7 entradas com o texto exato (<= 120 letras, e entre os cinco); CA2 save.arco e o save antigo; CA3 marca 'pend' no fim do dia (uma só; só a 1ª do nível do ponto);
// CA4 os gatilhos (quando); CA5 fora do Modo História e no dia em que o banco toma a lanchonete não marca; CA6 toca por último, vira 1, respeita CONV_MAX;
// CA7 a mudança de ponto passa a 1 as 0 do ponto anterior; CA8 modo dev (Arco: <id>, Conversas: vistas); CA9 __lcc.ARCO.
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const EXP=[["desanimo", 1, [["bia", "insegura", "sentada no degrau, com a foto da mãe na mão", "Tio... e se eu não for como a mãe?"], ["bia", "insegura", "", "Peguei dívida, errei pedido, deixei gente esperando. Acho que não nasci pra isso."], ["tonhao", "", "", "A Rosa queimou o arroz no primeiro dia da Casa Aurora. Chorou na despensa."], ["tonhao", "firme", "", "No outro dia, voltou. Você não precisa ser ela, Bia. Só precisa voltar amanhã."], ["bia", "firme", "levantando", "...Amanhã eu abro o portão."]]], ["elogio", 1, [["bia", "alegre", "", "Tio! Uma senhora disse que fazia tempo que ninguém atendia ela com tanto carinho."], ["tonhao", "", "", "E quem atendeu?"], ["bia", "alegre", "", "...Eu."], ["tonhao", "", "", "Então guarda isso. Em dia ruim, você vai precisar."]]], ["daniPrato", 1, [["dani", "insegura", "", "Quebrei dois pratos hoje, Bi. Desculpa. Eu sou lenta e ainda estrago as coisas."], ["bia", "", "", "Sabe quantos pedidos eu errei na primeira semana?"], ["dani", "", "", "Quantos?"], ["bia", "alegre", "", "Perdi a conta. O tio me disse que é só voltar amanhã. Volta amanhã, Dani."]]], ["caderno", 2, [["tonhao", "", "", "Bia, me passa o caderno do caixa pra eu conferir."], ["bia", "firme", "", "Já fechei, tio. Bateu até o último real."], ["tonhao", "", "folheando o caderno", "...Bateu mesmo. Desde quando você faz isso sozinha?"], ["bia", "alegre", "", "Desde a semana passada. O senhor é que não reparou."], ["tonhao", "alegre", "", "Então o caderno é seu."]]], ["daniDoce", 2, [["dani", "insegura", "", "Devolveram meu pudim, Bi. Disseram que tava mole. Acho melhor eu voltar pra louça."], ["bia", "firme", "", "A louça agora é do Joca. E o doce é seu."], ["dani", "", "", "E se devolverem de novo?"], ["bia", "alegre", "", "Aí você faz outro. Pudim mole a gente conserta. Desistir, não."]]], ["jocaCalado", 2, [["dani", "", "", "O Joquinha não abre a boca, Bi. O freguês pergunta e ele aponta pra mim."], ["joca", "insegura", "", "É que eu sou só o da louça..."], ["bia", "firme", "", "Aqui não tem \"só\", Joca. Sem prato limpo, ninguém almoça."], ["joca", "alegre", "", "...Amanhã eu digo bom-dia."]]], ["motoqueiro", 2, [["dani", "insegura", "", "Aquele motoqueiro gritou comigo de novo por causa da marmita..."], ["tonhao", "brava", "", "Deixa que eu vou lá fora falar com ele."], ["bia", "firme", "", "Deixa, tio. O salão é comigo."], ["bia", "firme", "voltando da calçada", "Falei com ele: aqui se pede com educação, ou se pede em outro lugar."], ["dani", "alegre", "", "E ele?"], ["bia", "alegre", "", "Pediu desculpa. E mais uma marmita."]]]];
const nova=(o)=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const joga=(H,fat,custo,hook)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; if(hook) hook(g); g.finishDay(); };
const vistas=H=>{ const v=[]; let n=0; while(H.g.conversa && n<200){ if(!v.includes(H.g.conversa.falas)) v.push(H.g.conversa.falas); toque(H.els); n++; } return v; };
const base=H=>{ const sv=H.g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; }); ['cozinhaNova2','cozinhaNova3','cozinhaNova4'].forEach(k=>{ sv.arco[k]=1; }); return sv; };   // v12.10.2: as conversas da cozinha nova ficam de fora destes testes

const pends=sv=>Object.keys(sv.arco).filter(k=>sv.arco[k]==='pend');
const cinco=['neutra','insegura','firme','alegre','brava'];
const ach=falas=>falas.map(f=>[f.q,f.e||'',f.nota||'',f.s]);
const L0=load({historia:true}).L;

// ---------- CA1: as 7 entradas ----------
{ const A=(L0.ARCO||[]).filter(a=>!/^cozinhaNova/.test(a.id));
  ok(Array.isArray(A) && A.length>=7 && A.slice(0,7).map(a=>a.id+':'+a.nivel).join()===EXP.map(e=>e[0]+':'+e[1]).join() && A.every(a=>typeof a.quando==='function'),'CA1 ARCO começa com as 7 entradas, na ordem e com o nivel de §6.2 e §6.3, cada uma com quando');
  const dif=EXP.filter(e=>{ const a=A.find(x=>x.id===e[0]); return !a || JSON.stringify(ach(a.falas))!==JSON.stringify(e[2]); }).map(e=>e[0]);
  ok(A.length>=7 && dif.length===0,'CA1 as falas têm o texto, o e e a rubrica exatos do roteiro (diferente: '+(dif.join(', ')||'nenhuma')+')');
  const todas=[].concat(...A.slice(0,7).map(a=>a.falas));
  ok(todas.length>0 && todas.every(f=>f.s.length<=120 && (!f.e || cinco.includes(f.e))),'CA1 nenhuma fala passa de 120 letras e o e é um dos cinco'); }

// ---------- CA2: save.arco ----------
{ const novo=L0.normSave({}), ids=EXP.map(e=>e[0]);
  ok(novo.arco && L0.ARCO.every(a=>novo.arco[a.id]===0) && Object.keys(novo.arco).length===L0.ARCO.length,'CA2 save novo: um valor por id, tudo 0');
  const ind=L0.normSave({ dia:20, salao:{ ponto:'industrial' } });
  ok(ids.every(i=>ind.arco[i]===(EXP.find(e=>e[0]===i)[1]<2?1:0)),'CA2 save antigo (sem arco) na área industrial: as da Garagem nascem 1, as da área industrial 0');
  const av=L0.normSave({ dia:40, salao:{ ponto:'avenida' } });
  ok(ids.every(i=>av.arco[i]===1),'CA2 save antigo na Avenida: as 7 nascem 1');
  const keep=L0.normSave({ arco:{ desanimo:'pend', elogio:1, caderno:'x' } });
  ok(keep.arco.desanimo==='pend' && keep.arco.elogio===1 && keep.arco.caderno===0 && keep.arco.daniPrato===0,'CA2 normSave mantém pend e 1, e o resto fica 0'); }

// ---------- CA4: os gatilhos (quando) ----------
{ const A=id=>L0.ARCO.find(a=>a.id===id), q=(id,sv,g)=>!!A(id).quando(sv,g);
  const sv=(o)=>Object.assign({ cap:1, equipe:{ dani:0, joca:0 }, daniCursos:{}, arco:{} },o||{});
  const g=(n,stars,lucro,marm)=>({ day:{ n }, fimDia:{ stars, lucro }, stats:{ marmitas:marm||0 } });
  ok(q('desanimo',sv(),g(3,0,-1)) && !q('desanimo',sv(),g(3,0,5)) && !q('desanimo',sv(),g(2,0,-9)) && !q('desanimo',sv(),g(5,0,5)) && q('desanimo',sv(),g(6,3,50)) && q('desanimo',sv(),g(9,0,-1)),'CA4 desanimo: do 3º dia em diante no negativo, ou do 6º dia em diante');
  ok(!q('elogio',sv({ arco:{ desanimo:0 } }),g(4,2,10)) && !q('elogio',sv({ arco:{ desanimo:'pend' } }),g(4,3,10)) && !q('elogio',sv({ arco:{ desanimo:1 } }),g(4,1,10)) && q('elogio',sv({ arco:{ desanimo:1 } }),g(4,2,10)) && q('elogio',sv({ arco:{ desanimo:1 } }),g(4,3,10)),'CA4 elogio: desanimo vista e 2 estrelas ou mais');
  ok(!q('daniPrato',sv({ arco:{ elogio:1 } }),g(5,0,0)) && !q('daniPrato',sv({ equipe:{ dani:1, joca:0 }, arco:{ elogio:0 } }),g(5,0,0)) && q('daniPrato',sv({ equipe:{ dani:1, joca:0 }, arco:{ elogio:1 } }),g(5,0,0)),'CA4 daniPrato: Dani contratada e elogio vista');
  ok(!q('caderno',sv({ cap:4 }),g(9,0,10)) && !q('caderno',sv({ cap:5 }),g(9,0,-1)) && q('caderno',sv({ cap:5 }),g(9,0,10)) && q('caderno',sv({ cap:7 }),g(9,0,1)),'CA4 caderno: cap. 5 ou mais e o dia no azul');
  ok(!q('daniDoce',sv({ equipe:{ dani:1, joca:2 } }),g(9,0,0)) && !q('daniDoce',sv({ daniCursos:{ confCaseira:1 } }),g(9,0,0)) && q('daniDoce',sv({ daniCursos:{ confCaseira:1 }, equipe:{ dani:1, joca:2 } }),g(9,0,0)),'CA4 daniDoce: o curso de confeitaria e o Joca contratado');
  ok(!q('jocaCalado',sv({ equipe:{ dani:1, joca:2 }, arco:{ daniDoce:0 } }),g(9,0,0)) && !q('jocaCalado',sv({ arco:{ daniDoce:1 } }),g(9,0,0)) && q('jocaCalado',sv({ equipe:{ dani:1, joca:2 }, arco:{ daniDoce:1 } }),g(9,0,0)),'CA4 jocaCalado: o Joca contratado e daniDoce vista');
  ok(!q('motoqueiro',sv({ cap:4, equipe:{ dani:1, joca:0 } }),g(9,0,0,3)) && !q('motoqueiro',sv({ cap:5 }),g(9,0,0,3)) && !q('motoqueiro',sv({ cap:5, equipe:{ dani:1, joca:0 } }),g(9,0,0,0)) && q('motoqueiro',sv({ cap:5, equipe:{ dani:1, joca:0 } }),g(9,0,0,1)),'CA4 motoqueiro: cap. 5 ou mais, a Dani contratada e ao menos 1 marmita no dia'); }

// ---------- CA3: marca 'pend' no fim do dia ----------
{ const H=nova(), {g}=H, sv=base(H);
  g.startDay(2); joga(H,400,0);
  ok(g.fimDia && typeof g.fimDia.stars==='number' && typeof g.fimDia.lucro==='number','CA3 o jogo guarda g.fimDia (estrelas e lucro do dia que terminou)');
  ok(pends(sv).length===0,'CA3 dia 2 no azul: nenhuma pendente');
  g.startDay(3); joga(H,0,300);
  ok(pends(sv).join()==='desanimo','CA3 dia 3 fechado no negativo: desanimo fica pendente (e só ela)'); }
{ const H=nova(), {g}=H, sv=base(H);
  g.startDay(6); joga(H,400,0);
  ok(pends(sv).join()==='desanimo','CA3 dia 6: desanimo fica pendente mesmo no azul');
  sv.arco.desanimo=1; sv.arco.elogio=0; sv.equipe.dani=1;
  g.startDay(7); joga(H,3000,0);
  const est=g.fimDia.stars;
  ok(est>=2 ? pends(sv).join()==='elogio' : pends(sv).length===0,'CA3 elogio só com 2 estrelas ('+est+' estrela(s) no dia)'); }
{ // só uma por fim de dia e só a primeira da lista; com uma pendente, nenhuma outra marca
  const H=nova(), {g}=H, sv=base(H);
  g.trocaPonto(H.L.PONTOS[1]); sv.cap=5; sv.equipe.dani=1;
  g.startDay(8); joga(H,900,0,g=>{ g.stats.marmitas=3; });
  ok(pends(sv).join()==='caderno','CA3 area industrial: caderno e motoqueiro são verdadeiros, mas só a primeira da lista (caderno) fica pendente');
  g.startDay(9); joga(H,900,0,g=>{ g.stats.marmitas=3; });
  ok(pends(sv).join()==='caderno' && sv.arco.motoqueiro===0,'CA3 com uma pendente, nenhuma outra marca');
  sv.arco.caderno=1;
  g.startDay(10); joga(H,900,0,g=>{ g.stats.marmitas=3; });
  ok(pends(sv).join()==='motoqueiro','CA3 vista a primeira, a próxima marca no fim do dia seguinte'); }
{ // nas entradas de outro ponto: a Garagem não marca as da área industrial
  const H=nova(), {g}=H, sv=base(H); sv.cap=5; sv.equipe.dani=1;
  g.startDay(8); joga(H,900,0,g=>{ g.stats.marmitas=3; });
  ok(sv.arco.caderno===0 && sv.arco.motoqueiro===0,'CA3 na Garagem, as entradas da área industrial não marcam'); }

// ---------- CA5: fora do Modo História e quando o banco toma ----------
{ const H=nova({ historia:false }); H.g.save.conversa=null; H.g.startDay(7); joga(H,400,0);
  ok(!H.L.histLiga() && pends(H.g.save).length===0,'CA5 fora do Modo História nenhuma marca, mesmo no dia 7'); }
{ const H=nova(), {g}=H, sv=base(H); sv.socorro=1; sv.bank=-5000; sv.emp=H.L.normEmprestimo({ resto:900, amort:100, j:0.01, ini:1, atr:true });
  g.startDay(7); joga(H,0,0);
  ok(g.result.tomou===true && pends(sv).length===0,'CA5 no dia em que o banco toma a lanchonete, nenhuma marca (tomou: '+g.result.tomou+')'); }

// ---------- CA6: a fila de fim de dia ----------
{ const H=nova(), {g,els}=H, sv=base(H); sv.arco.desanimo='pend';
  g.startDay(2); joga(H,400,0);
  ok(g.state==='dayend' && g.conversa && g.conversa.falas===H.L.ARCO[0].falas,'CA6 pendente: a conversa toca no fim do dia');
  const v=vistas(H);
  ok(sv.arco.desanimo===1 && v.length===1 && els['ov-end'].classList.contains('show'),'CA6 ao terminar, vira 1 e os resultados aparecem'); }
{ const H=nova(), {g,els}=H, sv=base(H); sv.arco.desanimo='pend'; sv.libera.bia='pend';
  g.startDay(2); joga(H,400,0);
  const v=vistas(H);
  ok(v.length===2 && v[0]===H.L.liberaOf('bia').falas && v[1]===H.L.ARCO[0].falas && sv.arco.desanimo===1,'CA6 toca por último, depois da LIBERA'); }
{ const H=nova(), {g,els}=H, sv=base(H); sv.arco.desanimo='pend'; sv.convEnt='pend'; sv.libera.bia='pend';
  g.startDay(4); joga(H,400,0);
  const v=vistas(H);
  ok(v.length===2 && sv.arco.desanimo==='pend' && sv.convEnt===1 && sv.libera.bia===1,'CA6 o limite de 2 conversas vale: a do arco fica pendente');
  els['btn-next'].fire('click'); g.startDay(5); joga(H,400,0);
  const v2=vistas(H);
  ok(v2.length>=1 && v2[v2.length-1]===H.L.ARCO[0].falas && sv.arco.desanimo===1,'CA6 no fim do dia seguinte ela toca, por último (depois da conversa do capítulo e das outras)'); }

// ---------- CA7: a mudança de ponto ----------
{ const H=nova(), {g,L}=H, sv=g.save;
  g.trocaPonto(L.PONTOS[1]);
  ok(['desanimo','elogio','daniPrato'].every(i=>sv.arco[i]===1) && ['caderno','daniDoce','jocaCalado','motoqueiro'].every(i=>sv.arco[i]===0),'CA7 ao mudar para a área industrial, as da Garagem passam a 1 e as novas ficam 0');
  const H2=nova(), s2=H2.g.save; s2.arco.desanimo='pend'; H2.g.trocaPonto(H2.L.PONTOS[1]);
  ok(s2.arco.desanimo==='pend' && s2.arco.elogio===1,'CA7 uma entrada pendente do ponto anterior continua pendente'); }

// ---------- CA8: modo dev ----------
{ const H=nova(), {g,L}=H; g.setDev(true);
  const rot=L.devCenas().map(c=>c.rot);
  ok(EXP.every(e=>rot.includes('Arco: '+e[0])) && L.devCenas().find(c=>c.rot==='Arco: caderno').falas===L.ARCO.find(a=>a.id==='caderno').falas,'CA8 a lista de cenas do modo dev tem Arco: <id> com as falas');
  g.devConversas('vistas');
  ok(Object.keys(g.save.arco).length===L.ARCO.length && Object.keys(g.save.arco).every(k=>g.save.arco[k]===1),'CA8 "Marcar todas como vistas" põe todas em 1'); }

// ---------- CA9 ----------
ok(Array.isArray(L0.ARCO) && L0.ARCO.length>=7,'CA9 window.__lcc expõe ARCO');

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails);
if(fails) process.exit(1);
