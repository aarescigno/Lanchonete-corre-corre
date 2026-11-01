// v9.1.1, sessão 3b-1r: o LIBERA depois da Garagem. save.pontoDia, diaNoPonto, entradas com `nivel` (dia e garantia contados no ponto,
// em qualquer capítulo), cartaoAberto por nível, normLibera (o que falta e tem nível é 0) e o gatilho como campo da entrada.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } };
const nova=()=>{ const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };
// a entrada de teste (nível 2, dia 2, garantia no 4º dia no ponto), com o gatilho comandado por `gat.v`
const gat={ v:false };
const entrada=L=>{ if(!L.LIBERA.some(l=>l.id==='teste')) L.LIBERA.push({ id:'teste', nivel:2, dia:2, ate:4, gatilho:()=>gat.v, reclama:['Teste.'], falas:[{ q:'bia', s:'Conversa de teste.' },{ q:'tonhao', s:'Segunda fala.' }] }); };
const J=(cap,ponto,sv)=>{ const H=nova(); entrada(H.L); const {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto:ponto||'garagem' }, convCard:1, convDiv:1, convEnt:1 }, sv||{}));
  g.save.libera.confeitaria=2; g.save.libera.joca=2;   // v9.2: as entradas reais do ponto ficam fora do teste
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };

// ---------- 1. pontoDia ----------
{ const {L}=nova();
  ok(L.normSave({dia:5,salao:{ponto:'garagem'}}).pontoDia===1,'normSave: save sem pontoDia na Garagem: 1');
  ok(L.normSave({dia:12,salao:{ponto:'industrial'}}).pontoDia===11,'normSave: na área industrial: dia - 1');
  ok(L.normSave({dia:12,salao:{ponto:'avenida'}}).pontoDia===11,'normSave: na Avenida: dia - 1');
  ok(L.normSave({dia:12,pontoDia:7,salao:{ponto:'industrial'}}).pontoDia===7,'normSave: o pontoDia guardado é respeitado');
  ok(L.normSave({dia:5,pontoDia:99,salao:{ponto:'industrial'}}).pontoDia===5,'normSave: pontoDia nunca passa do dia');
  ok(L.normSave({dia:5,pontoDia:'x',salao:{ponto:'garagem'}}).pontoDia===1,'normSave: lixo vira o padrão');
  ok(L.diaNoPonto({dia:11,pontoDia:10},10)===1 && L.diaNoPonto({dia:11,pontoDia:10})===1 && L.diaNoPonto({dia:14,pontoDia:10})===4,'diaNoPonto: o 1º dia no ponto é 1 (padrão: o dia que terminou)'); }
{ const H=J(6,'garagem'), {g,L}=H; L.DEV.on=true; const d=g.save.dia;
  ok(g.mudarPonto() && g.save.salao.ponto==='industrial' && g.save.pontoDia===d,'mudarPonto grava pontoDia = o dia da chegada'); L.DEV.on=false; }

// ---------- 2. entrada com nível: onde vale ----------
{ gat.v=true; const H=J(4,'garagem',{pontoDia:1}), {g}=H; joga(H,400);
  ok(g.save.libera.teste===0,'na Garagem, a entrada de nível 2 não vale (nem com o gatilho)'); }
{ gat.v=false; const H=J(5,'industrial',{pontoDia:10}), {g}=H; joga(H,400);
  ok(g.save.libera.teste===0,'área industrial, 1º dia no ponto, sem gatilho: fechada'); }
{ gat.v=true; const H=J(5,'industrial',{pontoDia:10}), {g}=H; joga(H,400);
  ok(g.save.libera.teste===0,'área industrial, 1º dia no ponto, mesmo com o gatilho: antes do dia mínimo'); }
{ gat.v=true; const H=J(5,'industrial',{pontoDia:9}), {g}=H; joga(H,400);
  ok(g.save.libera.teste==='pend' && g.save.cap>=4,'2º dia no ponto, com o gatilho e depois do cap. 4: pendente'); }
{ gat.v=false; const H=J(5,'industrial',{pontoDia:8}), {g}=H; joga(H,400);
  ok(g.save.libera.teste===0,'3º dia no ponto, sem gatilho: ainda fechada'); }
{ gat.v=false; const H=J(5,'industrial',{pontoDia:7}), {g}=H; joga(H,400);
  ok(g.save.libera.teste==='pend','4º dia no ponto, sem gatilho: a garantia deixa pendente (cap. 5)'); }
{ gat.v=false; const H=J(7,'avenida',{pontoDia:7}), {g}=H; joga(H,400);
  ok(g.save.libera.teste==='pend','na Avenida (cap. 7) também vale pelo nível'); }

// ---------- 3. conversa e cartaoAberto ----------
{ gat.v=false; const H=J(5,'industrial',{pontoDia:7}), {g,els}=H; joga(H,400);
  ok(!g.cartaoAberto('teste'),'pendente: o cartão segue fechado');
  els['btn-next'].fire('click');
  let n=0; while(!(g.conversa && /Conversa de teste/.test(g.conversa.fala.s)) && n<30){ toque(els); n++; }
  ok(g.conversa && /Conversa de teste/.test(g.conversa.fala.s),'a conversa da entrada nova toca no fim do dia (cap. 5)');
  passa(H);
  ok(g.save.libera.teste===1 && g.cartaoAberto('teste') && g.liberaNovo.includes('teste') && g.state==='shop','depois da conversa: aberto, com selo, e a lojinha abre'); }

// ---------- 4. as 5 antigas e o save antigo ----------
{ const H=J(5,'industrial',{pontoDia:5}), {g}=H;
  ok(['bia','melhorias','manut','salao','decor'].every(id=>g.cartaoAberto(id)),'as 5 entradas de sempre seguem abertas do cap. 4 em diante, no ponto novo'); }
{ const H=nova(); entrada(H.L); const s=H.L.normSave({dia:9,salao:{ponto:'industrial'}});
  ok(s.libera.teste===0 && ['bia','melhorias','manut','salao','decor'].every(id=>s.libera[id]===2),'save antigo sem a chave: as 5 antigas 2, a de nível 0'); }
{ const H=nova(); entrada(H.L); const s=H.L.normSave({dia:9,libera:{bia:1}});
  ok(s.libera.teste===0 && s.libera.bia===1,'save com libera parcial: a de nível que falta é 0'); }

// ---------- 5. fora da História e modo dev ----------
{ const H=load(), {g,L}=H; entrada(L); g.save.libera.teste=0; g.save.salao.ponto='industrial';
  ok(g.cartaoAberto('teste'),'sem a História: aberto no ponto de nível 2');
  g.save.salao.ponto='garagem'; ok(!g.cartaoAberto('teste'),'sem a História: fechado na Garagem'); }
{ const H=J(5,'garagem'), {g,L}=H; L.DEV.on=true; ok(g.cartaoAberto('teste'),'modo dev: aberto'); L.DEV.on=false; }

console.log('smoke42b: total =',total,' fails =',fails); process.exit(fails?1:0);
