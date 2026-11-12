// v10.4, etapa 4a-5: a música ao vivo do Terraço (quarteto de cordas ou pianista), o couvert só da Avenida e as 3 flores finas do foyer.
// CA1 o cartão, as diárias, a paciência e o Ambiente; CA2 o couvert; CA3 a folha; CA4 as flores; CA5 a ficha l-musica; CA6 o botão do modo dev; CA7 o save da v10.3.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(ponto,sv,cap)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap:cap||8, dia:10, maxDay:10, bank:9000, v10:1, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };
const sentar=(g,type)=>{ const grp=g.spawn({ type:type||'casal', color:0, vip:false, av:true }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantOrder'); return { grp, t }; };

// ---------- 1. a música ao vivo: cartão, diárias, paciência e Ambiente ----------
{ const {L}=nova(), M=L.TERRACO.musica;
  ok(M[0]===null && M[1].nome==='Trio de cordas' && M[1].pay===500 && M[1].effect===0.35 && M[1].amb===1,'TERRACO.musica[1]: Trio de cordas, R$ 500, 35% de paciência, +1 no Ambiente (v10.5: era o quarteto, 150, 30% e 0,75)');
  ok(M[2].nome==='Pianista' && M[2].pay===300 && M[2].piano===5 && M[2].effect===0.25 && M[2].amb===1.5,'TERRACO.musica[2]: Pianista, R$ 300 + R$ 5 de afinação, 25% de paciência, +1,5 no Ambiente (v10.5: era 120 + 30, 20% e 1,25)');
  ok(L.ambienteEffect({ musica:1 })===0.35 && L.ambienteEffect({ musica:2 })===0.25 && L.ambienteEffect({ musica:0 })===0,'ambienteEffect: a paciência nas mesas cai 35% (trio) e 25% (pianista) mais devagar');
  const base=L.payroll({ tonhao:1, dani:1, musica:0 }); ok(L.payroll({ tonhao:1, dani:1, musica:1 })-base===500 && L.payroll({ tonhao:1, dani:1, musica:2 })-base===305,'a folha soma 500 (trio) e 300 + 5 (pianista)');
  ok(L.folhaItens({ tonhao:0, musica:1 }).indexOf('trio de cordas')>=0 && L.folhaItens({ tonhao:0, musica:2 }).indexOf('pianista e afinação')>=0,'a folha mostra "trio de cordas" ou "pianista e afinação"'); }
{ const H=jogo('terraco'), {g,L}=H; const t=loja(H,'lanchonete','divulga');
  ok(/Música ao vivo/.test(t) && /Sem música/.test(t) && /Trio de cordas · R\$ ?500/.test(t) && /Pianista · R\$ ?305/.test(t),'no Terraço o cartão "Música ao vivo" tem os 3 botões e as diárias');
  ok(!/Couvert/.test(t),'e o couvert não aparece');
  const b0=g.save.bank; ok(g.setStaff('musica',1) && g.save.equipe.musica===1 && g.payroll()===L.payroll(Object.assign({},g.save.equipe,{ musica:0 }))+500,'contratar o trio');
  ok(g.setStaff('musica',2) && g.save.equipe.musica===2,'trocar para o pianista'); ok(g.setStaff('musica',0) && g.save.equipe.musica===0,'dispensar');
  ok(!g.setStaff('musica',3) && !g.setStaff('musica',-1),'só 0, 1 ou 2');
  // o Ambiente do Gurugol: base + música
  const nota=m=>{ g.save.equipe.musica=m; g.mode='carreira'; g.avals.length=0; const x=sentar(g,'casal'); x.grp.avalia=true; x.grp.setState('wantBill'); x.grp.hearts=5; g.avaliar(x.grp,0,0); return g.avals[g.avals.length-1].s[4]; };
  g.startDay(10); H.els['btn-start'].fire('click'); g.mode='carreira';
  const a0=nota(0), a1=nota(1), a2=nota(2);
  ok(Math.abs(a1-a0-1)<0.06 && Math.abs(a2-a0-1.5)<0.06,'no Ambiente do Gurugol a música soma +1 (trio) e +1,5 (pianista) ('+a0+' → '+a1+' / '+a2+')'); }
{ const H=jogo('avenida',{ cap:7 },7), {g}=H; const t=loja(H,'lanchonete','divulga');
  ok(!/Música ao vivo/.test(t) && /Couvert/.test(t),'na Avenida: sem o cartão da música, com o do couvert');
  ok(!g.setStaff('musica',1) && g.save.equipe.musica===0,'a música é recusada fora do Terraço');
  const H2=jogo('industrial',{},6); ok(!H2.g.setStaff('musica',2),'e na área industrial'); }

// ---------- 2. o couvert é só da Avenida ----------
{ const H=jogo('terraco'), {g,L}=H;
  ok(!g.setStaff('couvert',true) && !L.couvertOk(g.ponto),'o couvert é recusado no Terraço');
  const Ha=jogo('avenida',{},7); ok(Ha.g.setStaff('couvert',true) && Ha.g.save.equipe.couvert,'e vale na Avenida');
  ok(L.PONTOS[2].deixa==='os sofás, as águas saborizadas e o couvert ficam','o "deixa" da Avenida cita o couvert');
  const sv=L.normSave({ histV:1, equipe:{ tonhao:3, dani:2, couvert:true, taxa:true }, salao:{ ponto:'terraco' } });
  ok(!sv.equipe.couvert && !sv.equipe.taxa && sv.equipe.musica===0,'um save no Terraço com couvert chega com couvert e taxa desligados e musica 0');
  const sa=L.normSave({ histV:1, equipe:{ tonhao:3, dani:2, couvert:true, taxa:true }, salao:{ ponto:'avenida' } }); ok(sa.equipe.couvert && sa.equipe.taxa,'na Avenida o couvert e a taxa ficam');
  const Hd=nova(); Hd.g.setDev(true); Hd.g.devPonto('terraco'); ok(!Hd.L.couvertOk(Hd.g.ponto),'nem no modo dev, no Terraço');
  Hd.g.devPonto('garagem'); ok(Hd.L.couvertOk(Hd.g.ponto),'no modo dev Livre o couvert ainda vale nos níveis 1 e 2');
  // a troca de ponto desliga
  const Hm=jogo('avenida',{ equipe:{ tonhao:3, dani:2, couvert:true, taxa:true } },8); Hm.g.save.salao=Hm.L.normSalao(Hm.L.salaoAuto([4,4,4,4,4,4].map((seats,c)=>({ seats, c:c%4 })),Hm.L.PONTOS[2]) && { mesas:Hm.L.salaoAuto([4,4,4,4,4,4].map((seats,c)=>({ seats, c:c%4 })),Hm.L.PONTOS[2]), ponto:'avenida' });
  Hm.g.save.bank=9000; Hm.g.save.equipe.couvert=true; Hm.g.save.equipe.taxa=true; Hm.g.trocaPonto(Hm.L.PONTOS[3]);
  ok(!Hm.g.save.equipe.couvert && !Hm.g.save.equipe.taxa,'a mudança para o Terraço desliga o couvert'); }

// ---------- 3. sem dinheiro para a folha, a música é a primeira a sair ----------
{ const L=nova().L; const eq={ tonhao:2, dani:3, couvert:false, tv:false, som:false, tvs:0, musica:2 };
  ok(L.FOLHA_CORTE[0][0]==='musica','FOLHA_CORTE: a música em primeiro lugar');
  const eq2=Object.assign({},eq,{ lia:1 }); const n=L.folhaCorta(eq2); ok(n==='música' && eq2.musica===0 && eq2.lia===1,'folhaCorta tira a música antes da Lia e do resto');
  const c=L.folhaCortes(Object.assign({},eq),null,L.payroll(eq)-1); ok(c[0]==='música' && c.length===1,'folhaCortes: faltando R$ 1, só a música sai'); }

// ---------- 4. as 3 flores do foyer ----------
{ const L=nova().L, f=id=>L.DECOR.find(d=>d.id===id);
  ok(f('ikebana') && f('ikebana').cost===90 && f('orqArranjo').cost===120 && f('campo').cost===70,'custam R$ 90, 120 e 70');
  ok(['ikebana','orqArranjo','campo'].every(id=>f(id).nivel===4 && f(id).amb===0.2 && f(id).grupo==='plantas'),'só do nível 4, +0,2 no Ambiente cada, no grupo das plantas');
  ok(L.AVAL_DECOR.ikebana==='Que ikebana mais elegante!' && L.AVAL_DECOR.orqArranjo==='O arranjo de orquídeas é um espetáculo!' && L.AVAL_DECOR.campo==='Adorei as flores do campo!','os 3 elogios');
  ok(L.normDecor({ ikebana:1, orqArranjo:1, campo:0 }).ikebana===1 && L.normDecor({ campo:1 }).campo===1,'normDecor aceita os 3 ids');
  const Ht=jogo('terraco'); const t=loja(Ht,'lanchonete','decor'); ok(/Ikebana/.test(t) && /Arranjo de orquídeas/.test(t) && /Flores do campo/.test(t),'a Decoração do Terraço mostra as 3');
  const Ha=jogo('avenida',{},7); const ta=loja(Ha,'lanchonete','decor'); ok(!/Ikebana|Arranjo de orquídeas|Flores do campo/.test(ta),'a da Avenida não');
  const {g}=Ht; const b=g.save.bank; ok(g.buyDecor('ikebana') && g.save.bank===b-90 && g.save.decor.ikebana===1,'comprar a ikebana (R$ 90)');
  g.buyDecor('orqArranjo'); g.buyDecor('campo');
  g.startDay(10); Ht.els['btn-start'].fire('click'); g.mode='carreira';
  const amb=()=>{ g.avals.length=0; const x=sentar(g,'casal'); x.grp.avalia=true; x.grp.setState('wantBill'); x.grp.hearts=5; g.avaliar(x.grp,0,0); return g.avals[g.avals.length-1].s[4]; };
  const com=amb(); ['ikebana','orqArranjo','campo'].forEach(id=>g.mostraDecor(id,false)); const sem=amb();
  ok(Math.abs(com-sem-0.6)<0.06,'as 3 somam +0,6 no Ambiente ('+sem+' → '+com+')');
  const Hd=nova(); Hd.g.setDev(true); Hd.g.devPonto('garagem'); ok(/Ikebana/.test(loja(Hd,'lanchonete','decor')),'no modo dev aparecem em qualquer ponto'); }

// ---------- 5. a ficha l-musica ----------
{ const H=jogo('terraco'), {g,L}=H; const f=L.MANUAL.find(x=>x.id==='l-musica');
  ok(f && f.aba==='lojinha' && f.nome==='Música ao vivo' && f.linha==='Trio ou pianista: a paciência nas mesas dura mais, o ambiente melhora e a mesa pede mais uma rodada.','a ficha l-musica existe, na aba lojinha');
  ok(!/\d/.test(f.linha),'sem números');
  g.save.manual=g.save.manual.filter(x=>x!=='l-musica'); g.mode='carreira'; loja(H,'lanchonete','divulga');
  ok(g.save.manual.indexOf('l-musica')>=0,'o cartão aparece e a ficha é revelada'); }

// ---------- 6. o botão "Música: trocar" do modo dev ----------
{ const H=nova(), {g,L}=H, dv=()=>H.doc.getElementById('dev-body');
  g.setDev(true); g.setState('menu'); g.devReal(false); g.devPonto('terraco'); L.DEV.aba='hoje'; L.buildDev();
  ok(/Música: trocar/.test(txt(dv())),'no Terraço o painel Hoje tem o botão');
  const m=[]; for(let i=0;i<4;i++){ g.devMusica(); m.push(g.save.equipe.musica); } ok(m.join()==='1,2,0,1','passa por quarteto → pianista → sem música → quarteto');
  g.devPonto('avenida'); L.buildDev(); ok(!/Música: trocar/.test(txt(dv())) && !g.devMusica() && g.save.equipe.musica===0,'fora do Terraço não aparece nem faz nada'); }

// ---------- 7. o save da v10.3 ----------
{ const L=nova().L, sv=L.normSave({ histV:1, cap:8, dia:30, bank:5000, equipe:{ tonhao:3, dani:3, joca:2, cami:3, anselmo:2 }, salao:{ ponto:'terraco' } });
  ok(sv.equipe.musica===0 && sv.equipe.tonhao===3 && sv.equipe.anselmo===2 && sv.bank===5000,'um save da v10.3 (sem musica) carrega igual, com musica 0');
  ok(L.normSave({ equipe:{ musica:2 }, salao:{ ponto:'terraco' } }).equipe.musica===2 && L.normSave({ equipe:{ musica:2 }, salao:{ ponto:'avenida' } }).equipe.musica===0 && L.normSave({ equipe:{ musica:9 }, salao:{ ponto:'terraco' } }).equipe.musica===2,'a música guarda só 0 a 2 e só no Terraço'); }

// ---------- o desenho: roda os 3 modos sem erro ----------
{ for(const m of [0,1,2]){ const H=jogo('terraco',{ equipe:{ tonhao:3, dani:2, musica:m }, decor:{ ikebana:1, orqArranjo:1, campo:1 } }), {g,L}=H; let erro='';
    try { g.startDay(10); H.els['btn-start'].fire('click'); for(let i=0;i<40;i++) g.update(0.05); L.render(g,H.ctx); g.setState('menu'); L.render(g,H.ctx); } catch(e){ erro=e.message; }
    ok(!erro,'desenha o Terraço com música '+m+' (dia e menu) sem erro '+erro); } }

console.log('smoke66: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
