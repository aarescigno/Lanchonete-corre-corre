// v11.4, etapa 8d: as 10 conversas do arco da Avenida e do Terraço (entradas novas na ARCO da v11.3). Roteiro em docs/ARCO.md §7; spec em docs/spec-v11.4.md.
// CA1 as 10 entradas com o texto exato (<= 120 letras, e entre os cinco); CA2 save.arco e o save antigo no Terraço; CA3 cada uma fica 'pend' com o quando dela, na ordem, uma por fim de dia;
// CA4 os gatilhos (quando); CA5 fora do Modo História não marca; CA6 modo dev (Arco: <id>, Conversas: vistas); CA7 __lcc.ARCO.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const EXP=[["anselmoCopo", 3, [["anselmo", "insegura", "catando os cacos", "Desculpa, desculpa! Eu pago o copo, pode descontar..."], ["bia", "", "", "Anselmo. Olha pra mim. É um copo."], ["anselmo", "", "", "No outro restaurante, um copo era meia hora de grito."], ["bia", "firme", "", "Aqui é uma vassoura e um copo novo. Respira e volta pro balcão."]]], ["jocaEspresso", 3, [["joca", "insegura", "", "O homem de terno perguntou se \"o menino da louça\" sabia mexer na máquina."], ["bia", "firme", "", "Eu ouvi. E disse a ele que o nosso barista se chama Joca."], ["joca", "", "", "Você disse isso?"], ["bia", "alegre", "", "Disse. Agora tira um espresso que faça ele engolir a piada."]]], ["camiPressa", 3, [["bia", "", "", "Cami, a mesa do casal reclamou que o prato chegou antes de eles tirarem o casaco."], ["cami", "", "", "No rodízio era assim: girou, serviu, próxima!"], ["bia", "firme", "", "Aqui mesa não é número. Pergunta o nome, olha no olho. Rápida você já é."], ["cami", "alegre", "", "Nome e olho no olho. Anotado, chefe!"]]], ["daniEnsina", 3, [["dani", "alegre", "", "Bia, me pediram pra ensinar o ponto do brigadeiro. Eu! Ensinando!"], ["bia", "alegre", "", "E ensinou?"], ["dani", "firme", "", "Ensinei. E descobri que eu explico bem."], ["tonhao", "", "", "Quem diria. A menina lenta dando aula."], ["dani", "alegre", "", "Lenta, não, seu Tonhão. Caprichosa."]]], ["cortina", 3, [["bia", "", "", "Tio, o senhor passou o dia olhando pra Casa Aurora."], ["tonhao", "insegura", "", "Vinte anos naquela cozinha, Bia. E saí sem levar nem o meu nome."], ["bia", "firme", "", "O senhor trouxe o que importava: a mão. O nome a gente faz aqui."], ["tonhao", "alegre", "fechando a cortina", "...Então vamos trabalhar, que nome não se faz sozinho."]]], ["liaPerfeita", 4, [["tonhao", "", "", "Lia, a mesa quatro tá esperando a entrada faz tempo!"], ["lia", "insegura", "", "Refiz três vezes, chef. O corte não ficou igual."], ["tonhao", "firme", "", "Prato perfeito e frio não serve pra ninguém. Capricho tem hora, e a hora é a do freguês."], ["lia", "firme", "", "Entendido. Sai agora."], ["bia", "alegre", "", "Tá ensinando bonito, tio."]]], ["anselmoRi", 4, [["anselmo", "alegre", "rindo alto atrás do balcão", "Opa... desculpa o barulho."], ["bia", "", "", "Desculpa por quê?"], ["anselmo", "", "", "Fazia anos que eu não ria no serviço. Nem lembrava como era."], ["bia", "alegre", "", "Então ri mais alto, que o salão gostou."]]], ["jocaNome", 4, [["joca", "alegre", "", "Bia, a mesa da janela pediu \"o café do Joca\". Pelo nome!"], ["bia", "alegre", "", "E o que o barista da casa respondeu?"], ["joca", "firme", "", "Que hoje tem coado, prensa e cold brew. E que eu recomendo o coado."], ["bia", "", "", "Olha ele. Há pouco tempo, nem bom-dia."]]], ["liaPetala", 4, [["tonhao", "", "com a pétala na palma da mão", "Lia, hoje quem põe a pétala é você."], ["lia", "insegura", "", "Eu, chef? Esse prato é da sua família."], ["tonhao", "firme", "", "Por isso mesmo. Receita que fica numa mão só some. Eu já vi isso acontecer."], ["lia", "firme", "pondo a pétala", "...Na hora. Como a Rosa."]]], ["roda", 4, [["bia", "firme", "", "Antes da noite da estrela, eu quero dizer uma coisa a vocês."], ["bia", "", "", "Eu comecei numa garagem, com medo de abrir o portão."], ["bia", "alegre", "", "Hoje eu não tenho medo. Porque nunca mais abri sozinha."], ["dani", "alegre", "", "Ai, Bia, eu vou chorar em cima do doce!"], ["tonhao", "alegre", "", "Chora depois. Primeiro a estrela."]]]];
const IDS=EXP.map(e=>e[0]);
const nova=(o)=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const joga=(H,fat,custo,hook)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=custo||0; if(hook) hook(g); g.finishDay(); };
const pends=sv=>Object.keys(sv.arco).filter(k=>sv.arco[k]==='pend');
const cinco=['neutra','insegura','firme','alegre','brava'];
const ach=falas=>falas.map(f=>[f.q,f.e||'',f.nota||'',f.s]);
const L0=load({historia:true}).L;
// uma partida no ponto `pi` (2 Avenida, 3 Terraço), com todo o arco visto menos `id`, e o save arrumado por `arr`; devolve as pendentes depois do fim do dia
const dia=(pi,id,arr,n)=>{ const H=nova(), {g}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
  g.trocaPonto(H.L.PONTOS[pi]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); if(id) sv.arco[id]=0; if(arr) arr(sv);
  g.startDay(n||20); joga(H,900,0); return pends(sv); };

// ---------- CA1: as 10 entradas novas ----------
{ const A=L0.ARCO||[];
  ok(Array.isArray(A) && A.length===17 && A.slice(7).map(a=>a.id+':'+a.nivel).join()===EXP.map(e=>e[0]+':'+e[1]).join() && A.every(a=>typeof a.quando==='function'),'CA1 ARCO tem 17 entradas: as 7 de antes e as 10 novas, na ordem de §7.1 e §7.2 e com o nivel certo (3 e 4), cada uma com quando');
  const dif=EXP.filter(e=>{ const a=A.find(x=>x.id===e[0]); return !a || JSON.stringify(ach(a.falas))!==JSON.stringify(e[2]); }).map(e=>e[0]);
  ok(A.length===17 && dif.length===0,'CA1 as falas têm o texto, o e e a rubrica exatos do roteiro (diferente: '+(dif.join(', ')||'nenhuma')+')');
  const todas=[].concat(...A.slice(7).map(a=>a.falas));
  ok(todas.length>0 && todas.every(f=>f.s.length<=120 && (!f.e || cinco.includes(f.e))),'CA1 nenhuma fala nova passa de 120 letras e o e é um dos cinco');
  ok(A.slice(7).every(a=>!a.falasB && a.falas.every(f=>['bia','tonhao','dani','joca','cami','anselmo','lia'].includes(f.q))),'CA1 as novas não têm falasB e quem fala é uma das sete personagens'); }

// ---------- CA2: save.arco ----------
{ const novo=L0.normSave({});
  ok(novo.arco && Object.keys(novo.arco).length===17 && Object.keys(novo.arco).every(k=>novo.arco[k]===0),'CA2 save novo: 17 ids, tudo 0');
  const av=L0.normSave({ dia:40, salao:{ ponto:'avenida' } });
  ok(L0.ARCO.every(a=>av.arco[a.id]===(a.nivel<3?1:0)),'CA2 save antigo na Avenida: as da Garagem e da área industrial nascem 1, as 5 da Avenida 0, as 5 do Terraço 0');
  const te=L0.normSave({ dia:70, salao:{ ponto:'terraco' } });
  ok(L0.ARCO.every(a=>te.arco[a.id]===(a.nivel<4?1:0)),'CA2 save antigo no Terraço: as da Avenida NÃO chegam (nascem 1), só as 5 do Terraço ficam 0');
  const p=L0.normSave({ dia:40, salao:{ ponto:'avenida' }, arco:{ desanimo:1, anselmoCopo:'pend', cortina:1 } });
  ok(p.arco.anselmoCopo==='pend' && p.arco.cortina===1 && p.arco.jocaEspresso===0 && p.arco.roda===0,'CA2 normSave mantém pend e 1 das novas, e o resto fica 0'); }

// ---------- CA4: os gatilhos (quando) ----------
{ const A=id=>L0.ARCO.find(a=>a.id===id), q=(id,sv,g)=>!!A(id).quando(sv,g);
  const sv=(o)=>Object.assign({ cap:1, rosa:0, equipe:{}, daniCursos:{}, jocaCursos:{}, anselmoCursos:{}, arco:{} },o||{});
  const g={ day:{ n:30 }, fimDia:{ stars:1, lucro:5 }, stats:{ marmitas:0 } };
  ok(!q('anselmoCopo',sv(),g) && !q('anselmoCopo',sv({ equipe:{ anselmo:2, anselmoFora:true } }),g) && q('anselmoCopo',sv({ equipe:{ anselmo:1 } }),g) && q('anselmoCopo',sv({ equipe:{ anselmo:2, anselmoFora:false } }),g),'CA4 anselmoCopo: o Anselmo contratado e que veio no dia (não está Fora)');
  ok(!q('jocaEspresso',sv({ jocaCursos:{ atend:1 } }),g) && q('jocaEspresso',sv({ jocaCursos:{ espresso:1 } }),g),'CA4 jocaEspresso: o curso de espresso feito');
  ok(!q('camiPressa',sv(),g) && !q('camiPressa',sv({ equipe:{ cami:3, camiFora:true } }),g) && q('camiPressa',sv({ equipe:{ cami:3 } }),g),'CA4 camiPressa: a Cami contratada e que veio no dia');
  ok(!q('daniEnsina',sv({ daniCursos:{ confCaseira:1 } }),g) && q('daniEnsina',sv({ daniCursos:{ confCaseira:1, confGourmet:1 } }),g),'CA4 daniEnsina: o curso de confeitaria gourmet feito');
  ok(!q('cortina',sv({ cap:7 }),g) && q('cortina',sv({ cap:8 }),g) && q('cortina',sv({ cap:12 }),g),'CA4 cortina: cap. 8 ou mais');
  ok(!q('liaPerfeita',sv(),g) && !q('liaPerfeita',sv({ equipe:{ lia:1, liaFora:true } }),g) && q('liaPerfeita',sv({ equipe:{ lia:1 } }),g),'CA4 liaPerfeita: a Lia contratada e que veio no dia');
  ok(!q('anselmoRi',sv({ anselmoCursos:{ classica:1 } }),g) && q('anselmoRi',sv({ anselmoCursos:{ classica:1, autor:1 } }),g),'CA4 anselmoRi: o curso de coquetelaria de autor feito');
  ok(!q('jocaNome',sv({ jocaCursos:{ espresso:1 } }),g) && q('jocaNome',sv({ jocaCursos:{ espresso:1, cafesEsp:1 } }),g),'CA4 jocaNome: o curso de cafés especiais (nivel 4 de JOCA_CURSOS) feito');
  const ok1={ cap:13, rosa:1, equipe:{ lia:1 }, arco:{ liaPerfeita:1 } };
  ok(q('liaPetala',sv(ok1),g) && !q('liaPetala',sv(Object.assign({},ok1,{ rosa:0 })),g) && !q('liaPetala',sv(Object.assign({},ok1,{ cap:12 })),g) && !q('liaPetala',sv(Object.assign({},ok1,{ equipe:{ lia:0 } })),g) && !q('liaPetala',sv(Object.assign({},ok1,{ arco:{ liaPerfeita:'pend' } })),g) && !q('liaPetala',sv(Object.assign({},ok1,{ arco:{ liaPerfeita:0 } })),g),'CA4 liaPetala: o molho da Rosa comprado, cap. 13 ou mais, a Lia contratada e liaPerfeita vista');
  ok(!q('roda',sv({ cap:13 }),g) && q('roda',sv({ cap:14 }),g) && !q('roda',sv({ cap:15 }),g),'CA4 roda: cap. 14'); }

// ---------- CA3: cada uma fica pend com o quando dela ----------
{ const arr={
    anselmoCopo:[2,sv=>{ sv.equipe.anselmo=2; }], jocaEspresso:[2,sv=>{ sv.jocaCursos.espresso=1; }], camiPressa:[2,sv=>{ sv.equipe.cami=1; }],
    daniEnsina:[2,sv=>{ sv.daniCursos.confCaseira=1; sv.daniCursos.confGourmet=1; }], cortina:[2,sv=>{ sv.cap=8; }],
    liaPerfeita:[3,sv=>{ sv.equipe.lia=1; }], anselmoRi:[3,sv=>{ sv.anselmoCursos.classica=1; sv.anselmoCursos.autor=1; }], jocaNome:[3,sv=>{ sv.jocaCursos.espresso=1; sv.jocaCursos.cafesEsp=1; }],
    liaPetala:[3,sv=>{ sv.rosa=1; sv.cap=13; sv.equipe.lia=1; }], roda:[3,sv=>{ sv.cap=14; }] };
  IDS.forEach(id=>{ const [pi,f]=arr[id]; const p=dia(pi,id,sv=>{ sv.equipe.anselmo=0; sv.equipe.cami=0; sv.equipe.lia=0; f(sv); if(id==='liaPetala'){ sv.arco.liaPerfeita=1; } });
    ok(p.join()===id,'CA3 '+id+': com o quando dela verdadeiro, fica pendente no fim do dia (pendentes: '+(p.join()||'nenhuma')+')'); });
  // sem o dado, não marca
  const n=dia(2,'cortina',sv=>{ sv.cap=7; });
  ok(n.length===0,'CA3 cortina com o cap. 7: nada pendente'); }

// ---------- CA3: ordem, uma por fim de dia, o ponto ----------
{ const p=dia(2,null,sv=>{ sv.arco.anselmoCopo=0; sv.arco.jocaEspresso=0; sv.arco.camiPressa=0; sv.equipe.anselmo=2; sv.equipe.cami=1; sv.jocaCursos.espresso=1; });
  ok(p.join()==='anselmoCopo','CA3 três verdadeiras na Avenida: só a primeira da lista (anselmoCopo) fica pendente'); }
{ const H=nova(), {g}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
  g.trocaPonto(H.L.PONTOS[2]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); ['anselmoCopo','jocaEspresso','camiPressa'].forEach(k=>{ sv.arco[k]=0; }); sv.equipe.anselmo=2; sv.equipe.cami=1; sv.jocaCursos.espresso=1;
  g.startDay(20); joga(H,900,0);
  ok(pends(sv).join()==='anselmoCopo','CA3 dia 1: anselmoCopo'); sv.arco.anselmoCopo=1;
  g.startDay(21); joga(H,900,0);
  ok(pends(sv).join()==='jocaEspresso','CA3 vista a primeira, a seguinte (jocaEspresso) marca no fim do dia seguinte e só ela'); sv.arco.jocaEspresso=1;
  g.startDay(22); joga(H,900,0);
  ok(pends(sv).join()==='camiPressa','CA3 e depois a terceira (camiPressa)'); }
{ // na Avenida, as do Terraço não marcam; no Terraço, as da Avenida não marcam
  const a=dia(2,'roda',sv=>{ sv.cap=14; });
  ok(a.length===0,'CA3 na Avenida, a do Terraço (roda) não marca');
  const t=dia(3,null,sv=>{ sv.arco.cortina=0; sv.cap=14; sv.arco.roda=1; });
  ok(t.length===0,'CA3 no Terraço, uma da Avenida (cortina) com o save novo não marca'); }

// ---------- CA2/CA3: save antigo no Terraço não recebe as da Avenida ----------
{ const H=nova(), {g}=H; const sv0=H.L.normSave({ dia:70, salao:{ ponto:'terraco' }, cap:14, equipe:{ anselmo:2 } });
  ok(IDS.slice(0,5).every(i=>sv0.arco[i]===1) && sv0.arco.roda===0,'CA2 o Terraço com cap. 14 e Anselmo: as 5 da Avenida já vistas, a roda por tocar'); }

// ---------- CA5: fora do Modo História ----------
{ const H=nova({ historia:false }); const sv=H.g.save; sv.conversa=null; sv.cap=14; sv.equipe.lia=1; H.g.trocaPonto(H.L.PONTOS[3]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=0; }); H.g.startDay(80); joga(H,900,0);
  ok(!H.L.histLiga() && pends(sv).length===0,'CA5 fora do Modo História nenhuma marca, mesmo com o quando verdadeiro'); }

// ---------- CA6: modo dev ----------
{ const H=nova(), {g,L}=H; g.setDev(true);
  const rot=L.devCenas().map(c=>c.rot);
  ok(IDS.every(i=>rot.includes('Arco: '+i)) && L.devCenas().find(c=>c.rot==='Arco: roda').falas===L.ARCO.find(a=>a.id==='roda').falas,'CA6 a lista de cenas do modo dev tem Arco: <id> das 10 novas, com as falas');
  g.devConversas('vistas');
  ok(Object.keys(g.save.arco).length===17 && Object.keys(g.save.arco).every(k=>g.save.arco[k]===1),'CA6 "Marcar todas como vistas" põe as 17 em 1'); }

// ---------- CA7 ----------
ok(Array.isArray(L0.ARCO) && L0.ARCO.length===17,'CA7 window.__lcc expõe ARCO (17 entradas)');

console.log('\n'+(total-fails)+' de '+total+' checagens ok');
if(fails) process.exit(1);
