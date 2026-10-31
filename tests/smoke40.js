// v9.0.2: a divulgação abre no dia 4, o padrão é o boca a boca e, no Modo História, a conversa do fim do dia 3 explica
// o boca a boca, os panfletos e as redes sociais (a lojinha abre na Divulgação).
// v9.0.3: uma conversa por fim de dia; a extra espera se houve conversa de capítulo, e a divulgação só abre depois da dela.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=()=>{ const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const ate=(H,re)=>{ let n=0; while(H.g.conversa && !re.test(H.g.conversa.fala.s) && n<60){ toque(H.els); n++; } return H.g.conversa; };
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } };
const L0=H=>H.L;
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };

// ---------- 1. regras ----------
{ const {L}=load();
  ok(L.DIVULGA_DIA===4 && !L.divulgaAberta(3) && L.divulgaAberta(4),'a divulgação abre no dia 4');
  ok(L.normSave({}).divulga==='boca' && L.divulgaOf('xyz').id==='boca','save novo e escolha inválida: boca a boca');
  ok(L.normSave({dia:3,divulga:'panfleto'}).divulga==='boca' && L.normSave({dia:6,divulga:'panfleto'}).divulga==='panfleto','antes do dia 4 fica no boca a boca; depois, vale a escolha');
  ok(L.HIST_DIVULGA.falas.length>=4 && L.HIST_DIVULGA.falas.every(f=>['bia','tonhao'].includes(f.q)) && /panfleto/i.test(L.HIST_DIVULGA.falas.map(f=>f.s).join(' ')),'a conversa (Bia e Tonhão) fala dos panfletos'); }

// ---------- 2. a conversa no fim do dia 3 ----------
{ const H=nova(), {g,els}=H, sv=g.save;
  sv.conversa=null; sv.bank=5000;
  g.startDay(1); joga(H,400); els['btn-next'].fire('click'); passa(H);
  g.startDay(2); joga(H,400); els['btn-next'].fire('click'); passa(H);
  ok(!g.save.convDiv,'depois dos dias 1 e 2, sem conversa da divulgação');
  g.startDay(3); joga(H,400);
  ok(g.save.convDiv==='pend','ao fechar o dia 3, convDiv fica pendente');
  els['btn-next'].fire('click'); ate(H,/festa da inauguração/);
  ok(g.conversa && /A festa da inauguração acabou/.test(g.conversa.fala.s),'toca a conversa, com a 1ª fala certa');
  passa(H);
  ok(g.save.convDiv===1 && g.state==='shop' && g.shopNext===4 && els['shop-sec'].textContent==='Divulgação','no fim, convDiv=1 e a lojinha do dia 4 abre na Divulgação');
  ok(g.save.divulga==='boca','o dia 4 começa no boca a boca');
  g.startDay(4); joga(H,400); els['btn-next'].fire('click'); passa(H);
  ok(g.save.convDiv===1,'fechar o dia 4 não toca de novo'); }
{ const H=load(), {g}=H;
  g.save.bank=5000; for(let n=1;n<=3;n++){ g.startDay(n); joga(H,400); }
  ok(g.save.convDiv!=='pend','sem o Modo História, convDiv nunca fica pendente'); }

// ---------- 3. uma conversa por vez (v9.0.3) ----------
{ const {L}=load(); const sv={convDiv:'pend'};
  ok(!L.divulgaAberta(5,sv) && L.divulgaAberta(5,{convDiv:1}) && L.divulgaAberta(5),'com a conversa da divulgação pendente, a divulgação não abre'); }
{ const H=nova(), {g,els}=H, sv=g.save;
  sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv='pend'; sv.conversa='antes';
  els['btn-next'].fire('click'); ate(H,/./);
  ok(g.conversa && g.conversa.falas===L0(H).HISTORIA[sv.cap-1].antes,'conversa de capítulo pendente: ela toca primeiro');
  passa(H);
  ok(g.state==='shop' && sv.convDiv==='pend','e a da divulgação espera o próximo fim de dia');
  g.resetDay(4); ok(!g.div,'enquanto espera, o dia 4 segue com o movimento da inauguração');
  g.startDay(4); joga(H,400); els['btn-next'].fire('click'); ate(H,/festa da inauguração/);
  ok(g.conversa && /festa da inauguração/.test(g.conversa.fala.s),'no fim de dia seguinte, sem capítulo, toca a da divulgação'); passa(H);
  ok(sv.convDiv===1 && els['shop-sec'].textContent==='Divulgação','e a lojinha abre na Divulgação'); }
{ const H=nova(), {g,els}=H, sv=g.save;
  sv.conversa=null; sv.convCard='pend'; sv.convDiv='pend';
  els['btn-next'].fire('click'); ate(H,/./); ok(g.conversa && /Tio, hoje|pessoal adorou/.test(g.conversa.fala.s),'cardápio e divulgação pendentes: só a do cardápio'); passa(H);
  ok(sv.convCard===1 && sv.convDiv==='pend' && g.state==='shop','a da divulgação fica para depois'); }
console.log('smoke40: total =',total,' fails =',fails);
process.exit(fails?1:0);
