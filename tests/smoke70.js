// v10.5.3, etapa V: a vontade da freguesia (doce na área industrial, espresso na Avenida).
// CA1 a CA3 a chance por dia no ponto; CA4 a nota; CA5 entregador e refeição completa; CA6/CA7 a conversa no fim do dia (e a repetição);
// CA8 a fala do Tonhão sem a Dani; CA9 o modo dev; CA10 o save antigo.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const perto=(a,b)=>Math.abs(a-b)<1e-9;
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<40){ toque(H.els); n++; } return n; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
// um jogo da História num ponto, no dia `dia` da carreira, que é o `dnp`-ésimo dia no ponto; sv troca o save
const jogo=(ponto,dnp,sv,cap)=>{ const H=nova(), {g,L}=H, dia=30;
  g.save=L.normSave(Object.assign({ histV:1, capV:2, cap:cap||5, dia, maxDay:dia, pontoDia:dia-dnp+1, bank:9000, v10:1, up:{ tenis:true }, cursos:{ pastel:1, chapa:1, fritos:1 }, equipe:{ tonhao:2, dani:2 }, salao:{ ponto }, conversa:null }, sv||{}));
  Object.keys(g.save.libera).forEach(k=>{ g.save.libera[k]=1; }); Object.assign(g.save,{ convCard:1, convDiv:1, convEnt:1, convPlanta:1, convExig:1, convQuit:1, convTeto:1 });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(dia); g.startDay(dia); H.els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; return H; };
const fecha=(H,st)=>{ const {g,els}=H; g.startDay(g.save.dia); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=0; g.custo=0; Object.assign(g.stats,st||{}); g.finishDay(); };
const sentar=(g,type,vip)=>{ const grp=g.spawn({ type:type||'familia', color:0, vip:!!vip, av:true }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantOrder'); return { grp, t, g }; };
const chance=(H,qual,tipo,vip)=>H.L.vontadeChance(H.g,qual,tipo||'familia',!!vip);
const R=Math.random;

// ---------- 1. a área industrial: a vontade de doce cresce ----------
{ const c=dnp=>chance(jogo('industrial',dnp),'doce','familia');
  ok(c(3)===0,'área industrial, 3º dia no ponto: nenhuma vontade de doce');
  ok(perto(c(4),0.5),'4º dia: a chance de uma família é 0,5 (a mesma de pedir doce com o curso)');
  ok(perto(c(7),0.875),'7º dia: 0,875 (+25% por dia de vontade)');
  ok(c(9)===1 && c(12)===1,'9º dia em diante: 1 (limite: o dobro, cortado em 1)');
  const H=jogo('industrial',4); ok(perto(chance(H,'doce','familia',true),0.7) && perto(chance(H,'doce','estudante'),0.3),'o VIP soma DOCES.vip (0,5 + 0,2) e cada tipo tem a sua chance'); }

// ---------- 2. com o curso feito não há vontade ----------
{ const H=jogo('industrial',9,{ daniCursos:{ confCaseira:1 } });
  ok(H.g.up.confCaseira===true && chance(H,'doce','familia')===0,'com a Confeitaria caseira feita, nenhuma vontade de doce');
  const g=H.g, grp=sentar(g,'familia').grp; Math.random=()=>0; const v=grp.sorteiaVontade(); Math.random=R;
  ok(!v.doce,'e o grupo sorteado não tem vontade de doce'); }

// ---------- 3. a Avenida: a vontade de espresso ----------
{ const c=dnp=>chance(jogo('avenida',dnp),'cafe','negocios');
  ok(c(2)===0 && perto(c(3),0.6) && perto(c(5),0.9),'Avenida: 2º dia sem vontade de espresso; 3º, 0,6 para negócios; 5º, 0,9');
  const H=jogo('avenida',3,{ jocaCursos:{ espresso:1 }, equipe:{ tonhao:2, dani:2, joca:2 } });
  ok(H.g.up.espresso===true && chance(H,'cafe','negocios')===0,'com o Barista: espresso feito, nenhuma vontade de espresso');
  const T=jogo('terraco',1,{ equipe:{ tonhao:2, dani:2 } });
  ok(perto(chance(T,'cafe','negocios'),0.6),'Terraço, 1º dia: desde o 1º dia (e o doce lá também, sem o curso: '+chance(T,'doce','familia')+')'); }

// ---------- 4. a nota do Cardápio ----------
{ const H=jogo('industrial',5), {g}=H;
  const nota=v=>{ g.avals=[]; const x=sentar(g,'familia'); x.grp.avalia=true; x.grp.setState('wantBill'); x.grp.hearts=5; x.grp.perdFila=0; x.grp.perdMesa=0; x.grp.pratoQ=4; x.grp.vontade=v; g.avaliar(x.grp,0,0); const s=g.avals[0].s[3]; x.t.group=null; return s; };
  const base=nota({ doce:false, cafe:false }), doce=nota({ doce:true, cafe:false }), dois=nota({ doce:true, cafe:true });
  const m=H.L.VONTADE.menos;   // 0,3 desde o balance de 12/11 (com 0,5 a área industrial com equipe caía para ~78%)
  ok(m===0.3 && perto(Math.round((base-doce)*10)/10,m),'vontade de doce: o Cardápio perde VONTADE.menos = 0,3 ('+base+' → '+doce+')');
  ok(perto(Math.round((base-dois)*10)/10,2*m),'doce e espresso juntos: perde o dobro, 0,6 ('+dois+')');
  let tx=new Set(); Math.random=()=>0.05; for(let i=0;i<8;i++){ g.avals=[]; const x=sentar(g,'familia'); x.grp.avalia=true; x.grp.setState('wantBill'); x.grp.hearts=5; x.grp.vontade={ doce:true, cafe:false }; g.avaliar(x.grp,0,0); tx.add(g.avals[0].txt); x.t.group=null; } Math.random=R;
  ok([...tx].some(t=>t==='Pedi sobremesa e não tinha!'||t==='Queria um docinho depois do almoço...'),'e, às vezes, o comentário pede a sobremesa ('+[...tx].join(' | ')+')'); }

// ---------- 5. entregador e refeição completa ----------
{ const H=jogo('industrial',9), {g,L}=H; Math.random=()=>0;
  const e=new L.Group(g,'entregador',90,0,false,{}), f=new L.Group(g,'familia',91,0,false,{});
  const ve=e.sorteiaVontade(), vf=f.sorteiaVontade(); Math.random=R;
  ok(!ve.doce && !ve.cafe,'o entregador (retira) nunca tem vontade') ;
  ok(vf.doce,'(controle) a família sentada tem vontade de doce com o sorteio no zero');
  const T=jogo('terraco',3), tg=T.g; Math.random=()=>0; const tf=new T.L.Group(tg,'familia',92,0,false,{}); const vt=tf.sorteiaVontade(); Math.random=R;
  ok(tf.tempos && !vt.doce && vt.cafe,'refeição completa (Terraço): sem vontade de doce (já há TEMPOS.semSobremesa), só de espresso'); }

// ---------- 5b. o balão apagado: 4 s, um depois do outro ----------
{ const H=jogo('avenida',6), {g}=H; const x=sentar(g,'negocios'), grp=x.grp; grp.setState('eating'); grp.timer=0; grp.esperaSuco=false;
  Math.random=()=>0; grp.update(0.01); Math.random=R;
  ok(grp.vontade.doce && grp.vontade.cafe && grp.vontadeT>3.9 && grp.vontadeBalao==='doce','ao acabar de comer: vontade dos dois e o balão do doce primeiro ('+grp.vontadeT.toFixed(2)+' s)');
  grp.vontadeT=1.5; ok(grp.vontadeBalao==='cafe','depois dos 2 s, o balão do espresso');
  grp.update(2); ok(grp.vontadeT===0 && grp.vontadeBalao===null,'e some em 4 s no total');
  const y=sentar(g,'negocios'); y.grp.setState('eating'); y.grp.timer=0; Math.random=()=>0; y.grp.update(0.01); y.grp.update(0.01); Math.random=R; ok(y.grp.vontadeT>3.9,'o sorteio é feito uma vez só por grupo'); }

// ---------- 6. a conversa do doce no fim do dia ----------
{ const H=jogo('industrial',1,{ dia:20, pontoDia:20 }), {g}=H, sv=g.save;
  const estado=[];
  for(let dnp=1;dnp<=9;dnp++){ sv.dia=19+dnp; fecha(H); estado.push(sv.vontDoce);
    if(sv.vontDoce==='pend'){ H.els['btn-next'].fire('click'); passa(H); } }
  ok(estado.slice(0,5).every(v=>v===0),'nenhuma conversa nos 5 primeiros dias na área industrial ('+estado.slice(0,5)+')');
  ok(estado[5]==='pend','no fim do 6º dia (3º de vontade) fica pendente ('+estado[5]+')');
  ok(estado[6]===6+19 && estado[7]===6+19,'depois de vista, guarda o dia em que foi vista e não volta ('+estado[6]+')');
  ok(estado[8]==='pend','a cada 3 dias, no fim do 9º, volta pendente ('+estado[8]+')');
  ok(sv.vontDoce===9+19,'e, vista a curta, guarda o dia novo ('+sv.vontDoce+')'); }
{ const H=jogo('industrial',1,{ dia:20, pontoDia:20 }), {g}=H, sv=g.save;
  for(let dnp=1;dnp<=6;dnp++){ sv.dia=19+dnp; fecha(H); }
  ok(sv.vontDoce==='pend','(preparo) pendente no 6º dia');
  sv.daniCursos.confCaseira=1; sv.up.confCaseira=true; sv.vontDoce=sv.dia; sv.dia+=2; fecha(H); sv.dia+=1; fecha(H);
  ok(sv.vontDoce!=='pend','com o curso feito, a conversa não volta'); }
{ const H=load(), {g,L}=H, sv0=L.normSave({ dia:20, maxDay:20, pontoDia:20, bank:9000, up:{ tenis:true }, equipe:{ tonhao:2, dani:2 }, salao:{ ponto:'industrial' } });   // sem a História (o harness desliga)
  g.save=sv0; g.up=sv0.up; g.tablesKey=''; g.buildTables(); g.goShop(20);
  for(let dnp=1;dnp<=7;dnp++){ sv0.dia=19+dnp; fecha(H); }
  ok(sv0.vontDoce===0 && sv0.vontCafe===0,'sem o Modo História nada fica pendente'); }

// ---------- 7. a conversa do espresso ----------
{ const H=jogo('avenida',1,{ dia:40, pontoDia:40, cap:6 }), {g}=H, sv=g.save, est=[];
  for(let dnp=1;dnp<=6;dnp++){ sv.dia=39+dnp; fecha(H); est.push(sv.vontCafe); if(sv.vontCafe==='pend'){ H.els['btn-next'].fire('click'); passa(H); } }
  ok(est.slice(0,4).every(v=>v===0) && est[4]==='pend','Avenida: pendente no fim do 5º dia (3º de vontade), não antes ('+est+')'); }

// ---------- 8. quem fala ----------
{ const H=jogo('industrial',6), L=H.L;
  const comDani=L.vontadeFalas('doce',{ equipe:{ tonhao:2, dani:2 } }), semDani=L.vontadeFalas('doce',{ equipe:{ tonhao:2, dani:0 } });
  ok(comDani.some(f=>f.q==='dani') && !semDani.some(f=>f.q==='dani'),'sem a Dani contratada, as falas dela saem com q:\'tonhao\'');
  ok(comDani.map(f=>f.s).join('|')===semDani.map(f=>f.s).join('|') && comDani.length===5 && comDani[0].s==='Tio, hoje de novo: um monte de mesa pediu sobremesa.','o texto é o mesmo (5 falas, a 1ª da Bia)');
  const cafe=L.vontadeFalas('cafe',{ equipe:{ tonhao:2, dani:2, joca:0 } });
  ok(cafe.every(f=>f.q!=='joca') && cafe.some(f=>f.q==='tonhao' && f.s==='No café da esquina tem fila pra cappuccino!'),'sem o Joca, as falas dele vão para o Tonhão');
  ok(L.vontadeFalas('doce',{ equipe:{ dani:2 } },true).length===1 && L.vontadeFalas('doce',{ equipe:{ dani:2 } },true)[0].s==='Pediram sobremesa de novo hoje, Bia...','a fala curta tem uma linha'); }

// ---------- 9. o modo dev ----------
{ const H=nova(), {g,L}=H; g.save=L.normSave({ histV:1, capV:2, cap:2, dia:3, bank:500, salao:{ ponto:'garagem' } });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(3);
  L.DEV.on=true; g.devForca('vontade','todos');
  g.startDay(3); H.els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0;
  ok(chance(H,'doce','familia')===1 && chance(H,'cafe','executiva')===1,'"Todos pedem": chance 1, sem olhar ponto nem dia (na Garagem)');
  const x=sentar(g,'familia'); Math.random=()=>0.9999; const v=x.grp.sorteiaVontade(); Math.random=R;
  ok(v.doce && v.cafe,'e todo grupo que senta sai com vontade de doce e de espresso');
  g.devForca('vontade',''); ok(chance(H,'doce','familia')===0,'"Normal" volta ao comum');
  g.devForca('vontade','todos'); g.up.confCaseira=true; ok(chance(H,'doce','familia')===0,'"Todos pedem" não vale com o curso feito');
  L.DEV.on=true; const cenas=L.devCenas().map(c=>c.rot);
  ok(cenas.includes('A vontade de doce') && cenas.includes('A vontade de espresso'),'Assistir tem "A vontade de doce" e "A vontade de espresso"');
  g.devForca('vontade',''); L.DEV.on=false; }

// ---------- 10. save antigo ----------
{ const L=nova().L, s=L.normSave({ dia:5 });
  ok(s.vontDoce===0 && s.vontCafe===0,'save antigo, sem os campos: vontDoce e vontCafe 0');
  const t=L.normSave({ dia:5, vontDoce:'pend', vontCafe:7 }), u=L.normSave({ dia:5, vontDoce:'x', vontCafe:-3 });
  ok(t.vontDoce==='pend' && t.vontCafe===7 && u.vontDoce===0 && u.vontCafe===0,'normSave aceita só 0, "pend" ou inteiro >= 1'); }

console.log('smoke70: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
