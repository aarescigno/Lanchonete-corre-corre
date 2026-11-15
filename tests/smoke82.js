// v11.6, etapa 8f: o Bráulio em cena. Roteiro em docs/ARCO.md §9; spec em docs/spec-v11.6.md.
// CA1 nome, retrato (5 expressões) e tela Retratos com 8; CA2 braulio1 (a 1ª da Avenida, falas e falasB exatas); CA3 o quando e a ordem; CA4 com o Anselmo as falas, sem ele as falasB;
// CA5 cap. 14 depois; CA6 a ficha c-braulio do Manual; CA7 modo dev. O desenho em si: shot_v11_6.js.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=(o)=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const cinco=['neutra','insegura','firme','alegre','brava'];
const FALAS=[["braulio", "", "de braços cruzados, na porta", "Então é esta a lanchonete da garagem. Vim buscar o meu coqueteleiro."], ["bia", "insegura", "", "Ele... ele não é seu, chef. Pergunta pra ele."], ["anselmo", "firme", "", "Eu fico aqui. Aqui ninguém grita."], ["braulio", "brava", "", "Vocês não duram um ano nesta avenida."], ["bia", "firme", "com a voz ainda tremendo", "Pode ser. Mas a mesa do senhor fica do outro lado da rua."], ["tonhao", "alegre", "", "A Rosa ia aplaudir de pé."]];
const FALAS_B=[["braulio", "", "de braços cruzados, na porta", "Então é esta a lanchonete da garagem. Sobrinha do Tonhão, não é?"], ["bia", "insegura", "", "Filha da Rosa. E dona da casa."], ["braulio", "brava", "", "Vocês não duram um ano nesta avenida."], ["bia", "firme", "com a voz ainda tremendo", "Pode ser. Mas a mesa do senhor fica do outro lado da rua."], ["tonhao", "alegre", "", "A Rosa ia aplaudir de pé."]];
const DEPOIS=[["braulio", "insegura", "parado na porta, de saída", "Esse molho... é o da Rosa."], ["bia", "firme", "", "É. E agora a cidade inteira sabe de quem é."], ["braulio", "", "", "...Ela cozinhava melhor que eu."], ["bia", "firme", "", "A porta fica aberta, chef. Pra jantar."], ["tonhao", "", "", "Saiu calado. Pela primeira vez na vida."], ["bia", "firme", "", "Agora o guia liga. Vai dormir, tio. Amanhã o telefone toca, e eu atendo."]];
const ach=falas=>falas.map(f=>[f.q,f.e||'',f.nota||'',f.s]);
const passa=g=>{ let n=0; while(g.conversa && n<40){ g.conversa.seguir(); n++; } return n; };
const L0=load({historia:true}).L;
const A1=L0.ARCO.find(a=>a.id==='braulio1');

// ---------- CA1: o nome e o retrato ----------
{ ok(L0.HIST_NOMES.braulio==='Bráulio','CA1 HIST_NOMES.braulio é Bráulio');
  const H=nova(), {L,g,ctx}=H; ok(L.RETRATO_QUEM.includes('braulio') && L.RETRATO_QUEM.length===8,'CA1 RETRATO_QUEM tem o Bráulio (8 retratos)');
  let erro=null,n=0; try{ cinco.forEach(e=>{ L.drawRetrato(ctx,'braulio',e,100,100,g); n++; }); L.drawRetrato(ctx,'braulio','sei-la',100,100,g); }catch(x){ erro=x; }
  ok(!erro && n===5,'CA1 o retrato do Bráulio desenha nas 5 expressões sem erro'+(erro?' ('+erro.message+')':''));
  ok(L.exprAtual()==='neutra','CA1 depois do retrato do Bráulio a expressão volta a neutra');
  let e2=null; try{ L.drawRetratosTela(ctx,g); }catch(x){ e2=x; } ok(!e2 && L.RETRATO_QUEM.length===8,'CA1 a tela Retratos desenha as 8 colunas sem erro');
  ok(L.BRAULIO_LOOK && L.BRAULIO_LOOK.bigode===true && L.BRAULIO_LOOK.blazer===true && L.BRAULIO_LOOK.gravata==='#F2C23D','CA1 o Bráulio do retrato tem bigode, paletó e gravata #F2C23D');
  const [x,y]=L.convCabeca(g,'braulio'); ok(typeof x==='number' && typeof y==='number' && x>0 && x<L.TW && y>0,'CA1 convCabeca do Bráulio: um ponto na tela ('+x+', '+y+')'); }

// ---------- CA2: a entrada braulio1 ----------
{ const av=L0.ARCO.filter(a=>a.nivel===3);
  ok(av[0] && av[0].id==='braulio1' && av[1].id==='anselmoCopo' && L0.ARCO.length===18,'CA2 braulio1 é a 1ª entrada de nivel 3, antes de anselmoCopo (18 entradas)');
  ok(A1 && typeof A1.quando==='function' && typeof A1.qualB==='function' && Array.isArray(A1.falas) && Array.isArray(A1.falasB),'CA2 braulio1 tem quando, falas, falasB e qualB');
  ok(A1 && JSON.stringify(ach(A1.falas))===JSON.stringify(FALAS),'CA2 as falas (com o Anselmo) têm o texto, o e e a nota exatos do roteiro');
  ok(A1 && JSON.stringify(ach(A1.falasB))===JSON.stringify(FALAS_B),'CA2 as falasB (sem o Anselmo) têm o texto, o e e a nota exatos do roteiro');
  const todas=A1.falas.concat(A1.falasB,L0.HISTORIA[13].depois);
  ok(todas.every(f=>f.s.length<=120 && (!f.e || cinco.includes(f.e))),'CA2 nenhuma fala passa de 120 letras e o e é um dos cinco');
  ok(A1.qualB({ equipe:{ anselmo:0 } })===true && A1.qualB({ equipe:{ anselmo:1 } })===false && A1.qualB({ equipe:{ anselmo:3 } })===false,'CA2 qualB: o Anselmo não está contratado'); }

// ---------- CA3: o quando e a ordem ----------
{ const sv=(o)=>Object.assign({ cap:7, pontoDia:10, equipe:{}, arco:{} },o||{}), g=n=>({ day:{ n }, fimDia:{ stars:1, lucro:5 }, stats:{} });
  ok(!A1.quando(sv({ cap:6 }),g(15)) && A1.quando(sv({ cap:7 }),g(15)) && A1.quando(sv({ cap:12 }),g(15)),'CA3 quando: cap. 7 ou mais (com o 6º dia no ponto)');
  ok(!A1.quando(sv(),g(14)) && A1.quando(sv(),g(15)) && A1.quando(sv(),g(30)),'CA3 quando: o 6º dia no ponto ou depois (pontoDia 10: dia 14 é o 5º, dia 15 o 6º)'); }
const pends=sv=>Object.keys(sv.arco).filter(k=>sv.arco[k]==='pend');
const joga=(H)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=900; g.custo=0; g.finishDay(); };
const dia=(arr,n)=>{ const H=nova(), {g}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
  g.trocaPonto(H.L.PONTOS[2]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); sv.arco.braulio1=0; sv.arco.anselmoCopo=0; sv.equipe.anselmo=2; sv.cap=7; sv.pontoDia=15; if(arr) arr(sv);
  g.startDay(n||20); joga(H); return { H, p:pends(sv) }; };
{ const r=dia(); ok(r.p.join()==='braulio1','CA3 no 6º dia na Avenida com o cap. 7: braulio1 fica pendente, e só ela (anselmoCopo também seria verdadeira e vem depois) (pendentes: '+(r.p.join()||'nenhuma')+')');
  const r2=dia(null,19); ok(r2.p.join()==='anselmoCopo','CA3 no 5º dia no ponto: sem braulio1 (a anselmoCopo marca) ('+(r2.p.join()||'nenhuma')+')');
  const r3=dia(sv=>{ sv.cap=6; }); ok(r3.p.join()==='anselmoCopo','CA3 com o cap. 6: sem braulio1 ('+(r3.p.join()||'nenhuma')+')');
  const r4=dia(sv=>{ sv.equipe.anselmo=0; }); ok(r4.p.join()==='braulio1','CA3 sem o Anselmo contratado braulio1 também marca (é a versão B)'); }

// ---------- CA4: qual versão toca ----------
const toca=(anselmo)=>{ const H=nova(), {g,L}=H, sv=g.save; sv.conversa=null; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
  sv.vontDoce=1; sv.vontCafe=1; Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); sv.arco.braulio1='pend'; sv.equipe.anselmo=anselmo; sv.manual=sv.manual.filter(x=>x!=='c-braulio');
  let fim=0; L.fluxoHistoria(()=>{ fim++; }); const usada=g.conversa && g.conversa.falas; const antes=sv.manual.indexOf('c-braulio')>=0; passa(g); return { H, usada, fim, antes, sv, g, L }; };
{ const a=toca(2), b=toca(0);
  ok(a.usada===a.L.ARCO.find(x=>x.id==='braulio1').falas && a.fim===1 && a.sv.arco.braulio1===1,'CA4 com o Anselmo contratado tocam as falas, e braulio1 vira 1');
  ok(b.usada===b.L.ARCO.find(x=>x.id==='braulio1').falasB && b.fim===1 && b.sv.arco.braulio1===1,'CA4 sem o Anselmo tocam as falasB, e braulio1 vira 1');
  ok(!a.antes && a.sv.manual.indexOf('c-braulio')>=0 && !b.antes && b.sv.manual.indexOf('c-braulio')>=0,'CA6 a ficha c-braulio do Manual aparece depois de braulio1 vista (e não antes)'); }

// ---------- CA5: o cap. 14, depois ----------
{ const d=L0.HISTORIA[13].depois;
  ok(d.length===6 && d[0].q==='braulio' && JSON.stringify(ach(d))===JSON.stringify(DEPOIS),'CA5 o depois do cap. 14 tem 6 falas, a 1ª do Bráulio, com o texto, o e e a nota exatos');
  ok(L0.HISTORIA[13].antes.length===5 && L0.HISTORIA[13].antes[0].s==='O crítico vem de cara limpa. E o Bráulio reservou uma mesa.','CA5 o antes do cap. 14 não mudou'); }

// ---------- CA6: a ficha depois da noite da estrela continua ----------
{ const sv=L0.normSave({ dia:80, cap:15, salao:{ ponto:'terraco' }, guia:{ n:2, prox:0, v:[], ult:60, est:2, noite:0, rec:0, ver:1 } });
  ok(sv.manual.indexOf('c-braulio')>=0,'CA6 depois da noite da estrela a ficha c-braulio continua aparecendo (save com guia.ult)');
  const novo=L0.normSave({}); ok(novo.manual.indexOf('c-braulio')<0,'CA6 save novo: a ficha ainda fechada'); }

// ---------- CA7: modo dev ----------
{ const H=nova(), {g,L}=H; g.setDev(true);
  const cs=L.devCenas(), rot=cs.map(c=>c.rot);
  ok(rot.includes('Arco: braulio1') && rot.includes('Arco: braulio1 (sem o Anselmo)'),'CA7 o modo dev lista Arco: braulio1 e Arco: braulio1 (sem o Anselmo)');
  const A=L.ARCO.find(a=>a.id==='braulio1');
  ok(cs.find(c=>c.rot==='Arco: braulio1').falas===A.falas && cs.find(c=>c.rot==='Arco: braulio1 (sem o Anselmo)').falas===A.falasB,'CA7 cada rótulo traz a sua versão das falas');
  ok(rot.filter(r=>/^Arco: /.test(r)).length===19,'CA7 19 cenas de arco no modo dev (18 entradas e a versão sem o Anselmo)');
  g.devConversas('vistas'); ok(g.save.arco.braulio1===1,'CA7 "Conversas: vistas" marca braulio1 como 1'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails);
if(fails) process.exit(1);
