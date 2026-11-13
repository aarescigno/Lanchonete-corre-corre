// v10.8, etapa 6a: o molho da Rosa (cap. 12): a compra, o vaso e as pétalas, o Prato da Rosa, o capítulo 12, a Cami gerente de salão, o modo dev e o Manual.
// CA1 o cartão e a compra; CA2 o vaso e as pétalas; CA3 a pétala no prato da casa; CA4 os ajudantes não pegam o prato da casa; CA5 servir o Prato da Rosa;
// CA6 o capítulo 12; CA7 o save; CA8 a gerência (o curso); CA9 a fila organizada; CA10 o modo dev; CA11 o Manual.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const achaTag=(e,tag,out=[])=>{ if(e.tagName===tag) out.push(e); (e.children||[]).forEach(c=>achaTag(c,tag,out)); return out; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,sv,ponto)=>{ const H=nova(), {g,L}=H; const n=60;
  g.save=L.normSave(Object.assign({ histV:1, capV:3, cap, dia:n, maxDay:n, bank:6000, v10:1, up:{ tenis:true, bandeja:true }, equipe:{ tonhao:3, dani:2, anselmo:2 }, salao:{ ponto:ponto||'terraco' }, conversa:null, pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2, lia:2 } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(n); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };
const botao=(H,texto)=>achaTag(H.doc.getElementById('shop-grid')||{},'BUTTON').find(b=>b.textContent===texto || (b.textContent||'').indexOf(texto)===0);
const dia=(H)=>{ const {g,els}=H; g.startDay(g.save.dia); els['btn-start'].fire('click'); g.schedule=[{ t:99999, type:'casal', color:0, vip:false }]; g.nextIdx=0; return H; };   // uma chegada lá longe: o dia não acaba
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const sentar=(g,type,vip)=>{ const grp=g.spawn({ type:type||'casal', color:0, vip:!!vip, av:true }), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); return { grp, t }; };
/* um prato pronto no balcão do grupo (casa: o prato da casa) */
const prato=(g,grp,casa,extra)=>{ const k=g.kitchen; const slot=k.plates.findIndex(p=>!p); const p=Object.assign({ id:++k.pid, table:grp.table.id, group:grp, dish:'pf', slot:slot<0?0:slot, age:0, crit:false, q:4, vip:true, tempo:1, casa:!!casa },extra||{}); k.plates[p.slot]=p; return p; };
/* fecha um dia (com stats do dia) sem jogar */
const fecha=(H,st,fat)=>{ const {g,els}=H; g.startDay(g.save.dia); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; Object.assign(g.stats,st||{}); g.finishDay(); };

// ---------- 1. o cartão e a compra (CA1) ----------
{ const H=jogo(12,{ bank:3000 }), {g,L}=H; const t=loja(H,'lanchonete','cardapio');
  ok(/O molho da Rosa/.test(t) && /Aprender R\$ 800/.test(t),'Terraço, cap. 12: o cartão "O molho da Rosa" com "Aprender R$ 800"');
  ok(L.ROSA.preco===800 && L.ROSA.max===2 && L.ROSA.pega===0.8 && L.ROSA.mais===20 && L.ROSA.coracao===1 && L.ROSA.pts===20 && L.ROSA.cap===12 && L.ROSA.coment==='Que molho é esse?!','ROSA: R$ 800, 2 pétalas, 0,8 s, +R$ 20, +1 coração, 20 pontos, cap. 12');
  const b0=g.save.bank, c0=(g.save.caixaPend||[]).length; const bt=botao(H,'Aprender'); ok(!!bt && !bt.disabled,'o botão Aprender está ligado'); bt.fire('click');
  ok(g.save.rosa===1 && g.save.bank===b0-800,'comprar custa R$ 800 e grava save.rosa');
  ok(/Aprendido/.test(loja(H,'lanchonete','cardapio')),'depois da compra, o cartão diz "Aprendido"');
  ok(g.buyRosa()===false && g.save.bank===b0-800,'comprar de novo não faz nada');
  const H2=jogo(11,{ bank:3000 }); ok(!/O molho da Rosa/.test(loja(H2,'lanchonete','cardapio')) && H2.g.buyRosa()===false,'cap. 11: sem o cartão (e sem compra)');
  const H3=jogo(12,{ bank:3000 },'avenida'); ok(!/O molho da Rosa/.test(loja(H3,'lanchonete','cardapio')) && H3.g.buyRosa()===false,'fora do Terraço: sem o cartão');
  const H4=jogo(12,{ bank:300 }); ok(H4.g.buyRosa()===false && !H4.g.save.rosa,'sem dinheiro: não compra'); }

// ---------- 2. o vaso e as pétalas (CA2) ----------
{ const H=jogo(12,{ rosa:0 }), {g,L}=H; dia(H);
  ok(g.pickAt(700,150,0)===null && g.estacaoOn('rosas')===false,'sem o molho: o toque no vaso não pega nada');
  const H2=jogo(12,{ rosa:1 }), g2=H2.g; dia(H2);
  const hit=g2.pickAt(700,150,0); ok(hit && hit.k==='station' && hit.st==='rosas' && L.STATIONS.rosas.ap.x===700 && L.STATIONS.rosas.ap.y===150 && L.STATIONS.rosas.rect.w===48,'com o molho: o vaso é uma estação (ap 700,150)');
  ok(g2.tapStation('rosas')===true && g2.bia.acts.length===1 && g2.bia.acts[0].type==='rosas','tocar no vaso põe a ação na fila da Bia');
  let t=0; for(;t<400 && g2.bia.petalas<2;t++) g2.update(0.05);
  ok(g2.bia.petalas===2 && g2.bia.hands.length===0,'a Bia fica com 2 pétalas de uma vez, sem ocupar as mãos');
  ok(g2.tapStation('rosas')===false && g2.bia.acts.length===0 && g2.fx.some(f=>f.text==='Já tenho pétalas'),'com 2 pétalas, o toque mostra "Já tenho pétalas", sem andar');
  // a ação leva 0,8 s depois de chegar
  const H3=jogo(12,{ rosa:1 }), g3=H3.g; dia(H3); g3.bia.x=700; g3.bia.y=150; g3.tapStation('rosas'); roda(g3,0.4); ok(g3.bia.petalas===0,'antes de 0,8 s, ainda sem pétala'); roda(g3,0.5); ok(g3.bia.petalas===2,'depois de 0,8 s, com as 2');
  // zeram no dia seguinte
  g3.finishDay(); g3.goShop(g3.save.dia); g3.startDay(g3.save.dia); ok(g3.bia.petalas===0,'as pétalas zeram no começo do dia');
  ok(L.STATION_KEYS===undefined || L.STATION_KEYS.indexOf('rosas')>=0,'(a estação rosas entra nas estações)'); }

// ---------- 3. a pétala no prato da casa (CA3) ----------
{ const H=jogo(12,{ rosa:1 }), {g}=H; dia(H); const { grp }=sentar(g,'casal',true);
  const faz=(casa,pet)=>{ g.bia.hands=[]; g.bia.petalas=pet; const p=prato(g,grp,casa); g.bia.perform({ type:'plate', pid:p.id }); return g.bia.hands.find(h=>h.kind==='dish'); };
  let d=faz(true,2); ok(d && d.rosa===true && d.crit===true && g.bia.petalas===1,'com pétala, o prato da casa sai Prato da Rosa (rosa e crit) e gasta 1 pétala');
  d=faz(true,0); ok(d && !d.rosa && d.casa===true && g.bia.petalas===0,'sem pétala, o prato da casa sai comum');
  d=faz(false,2); ok(d && !d.rosa && g.bia.petalas===2,'o prato comum não gasta pétala'); }

// ---------- 4. os ajudantes não pegam o prato da casa (CA4) ----------
{ const mk=(rosa)=>{ const H=jogo(12,{ rosa, equipe:{ tonhao:3, dani:2, cami:5, anselmo:2 }, camiCursos:{ agil:1, mesa:1, salao:1, gerente:1 } }), {g}=H; g.save.equipe.camiModo='tudo'; dia(H); const { grp }=sentar(g,'casal',true); const p=prato(g,grp,true,{ age:10 }); roda(g,3); return { g, p }; };
  const a=mk(0); ok(a.p.camiVai===true || a.g.cami.hands.some(h=>h.kind==='dish') || a.g.kitchen.plates.indexOf(a.p)<0,'(sem o molho a Cami pega o prato da casa)');
  const b=mk(1); ok(!b.p.camiVai && b.g.kitchen.plates.indexOf(b.p)>=0 && !b.g.cami.hands.some(h=>h.kind==='dish'),'com o molho, a Cami deixa o prato da casa para a Bia'); }

// ---------- 5. servir o Prato da Rosa (CA5) ----------
{ const serve=(rosa,h0)=>{ const H=jogo(12,{ rosa:1 }), {g}=H; dia(H); const { grp, t }=sentar(g,'casal',true); grp.hearts=h0; grp.entradaDada=true; const b0=grp.bill, p0=g.pontos, s0=g.stats.rosa;
    g.entregaPrato(grp,{ kind:'dish', table:t.id, group:grp, dish:'pf', crit:true, q:4, vip:true, tempo:1, casa:true, rosa },t); return { grp, bill:grp.bill-b0, pts:g.pontos-p0, rosa:g.stats.rosa-s0, g }; };
  const n=serve(false,1), r=serve(true,1);
  ok(r.grp.hearts===n.grp.hearts+1,'o Prato da Rosa dá 1 coração a mais ('+n.grp.hearts+' → '+r.grp.hearts+')');
  ok(r.bill-n.bill===20,'a conta do grupo sobe R$ 20');
  ok(Math.abs((r.pts-n.pts)-20)<1e-9,'a Bia ganha 20 pontos a mais ('+(r.pts-n.pts)+')');
  ok(r.rosa===1 && n.rosa===0 && r.grp.rosa===true && !n.grp.rosa,'stats.rosa conta e o grupo guarda `rosa`');
  ok(r.g.fx.some(f=>f.text==='Prato da Rosa!'),'sobe o texto "Prato da Rosa!"');
  const c=serve(true,4); ok(c.grp.hearts===5,'o coração a mais não passa de 5');
  // o comentário no Gurugol: em metade das vezes, nas notas boas de comida
  const H=jogo(12,{ rosa:1 }), {g}=H; dia(H); g.mode='carreira'; let com=0, tot=0;
  for(let i=0;i<200;i++){ const { grp }=sentar(g,'casal',true); grp.avalia=true; grp.rosa=true; grp.pratoQ=5; grp.tempos=null; const n=g.avals.length; g.avaliar(grp,0,0); if(g.avals[n]){ tot++; if(g.avals[n].txt==='Que molho é esse?!') com++; } grp.table.group=null; grp.table=null; g.queue=g.queue.filter(q=>q!==grp); g.groups=g.groups.filter(q=>q!==grp); }
  ok(tot>150 && com>=tot*0.3 && com<=tot*0.7,'o comentário "Que molho é esse?!" vem em cerca de metade ('+com+' de '+tot+')'); }

// ---------- 6. o capítulo 12 (CA6) ----------
{ const H=jogo(12,{ capDia:50, conversa:null }), {g,L}=H, c=L.HISTORIA[11];
  ok(L.HISTORIA.length===12 && c.cap===12 && c.titulo==='O molho da Rosa' && c.ponto==='terraco' && c.obj.compra==='rosa' && c.obj.rosa===3 && c.obj.vezes===3 && c.antes.length===6 && c.depois.length===4,'HISTORIA[11]: cap. 12, "O molho da Rosa", obj { compra, rosa:3, vezes:3 }, 6 falas antes e 4 depois');
  ok(c.antes[2].s==='O molho da estrela era meu e da sua mãe. Cominho com açafrão... e o segredo dela.' && c.depois[3].q==='bia' && c.fim.h==='Fim do capítulo 12','(os textos da spec)');
  ok(L.HISTORIA[10].fim===undefined,'o cap. 11 não tem mais cartão de fim');
  const ob=g.capObj(); ok(ob.itens.length===2 && ob.itens[0].txt==='Aprender o molho da Rosa' && !ob.itens[0].ok && /^3 Pratos da Rosa servidos num dia, 3 vezes \(0 de 3\)/.test(ob.itens[1].txt),'os dois itens do objetivo');
  g.save.rosa=1; ok(g.capObj().itens[0].txt==='Molho da Rosa aprendido' && g.capObj().itens[0].ok,'o item "Molho da Rosa aprendido"');
  fecha(H,{ rosa:2 }); ok(g.save.capVezes===0 && !g.result.cap.ok,'um dia com 2 Pratos da Rosa: não soma');
  g.save.dia++; fecha(H,{ rosa:3 }); ok(g.save.capVezes===1 && /\(1 de 3\)/.test(g.result.cap.itens[1].txt),'um dia com 3: soma 1 ("1 de 3")');
  g.save.dia++; fecha(H,{ rosa:6 }); ok(g.save.capVezes===2,'6 também soma só 1 (por dia)');
  g.save.dia++; fecha(H,{ rosa:3 }); ok(g.save.capVezes===3 && g.result.cap.ok && g.save.conversa==='depois','3 vezes com o molho aprendido: cap. 12 cumprido, a conversa de depois fica pendente');
  const H2=jogo(12,{ capVezes:2, conversa:null }); fecha(H2,{ rosa:3 }); ok(H2.g.save.capVezes===3 && !H2.g.result.cap.ok,'3 vezes sem ter comprado o molho: não cumpre'); }

// ---------- 7. o save (CA7) ----------
{ const L=load({ historia:true }).L;
  const a=L.normSave({ histV:1, capV:2, cap:12, dia:60, bank:4000, capDia:50, capVezes:2, conversa:null, salao:{ ponto:'terraco' } });
  ok(a.cap===12 && a.conversa==='antes' && a.capDia===60 && a.capVezes===0 && a.capV===3 && a.rosa===0,'save da v10.7 no Fim (capV 2, cap 12) no Terraço: começa o cap. 12 com a conversa de antes (capDia = dia, capVezes 0)');
  ok(JSON.stringify(L.normSave(JSON.parse(JSON.stringify(a))))===JSON.stringify(a) && L.normSave(JSON.parse(JSON.stringify(a))).conversa==='antes','e normalizar de novo não muda nada');
  const b=L.normSave({ histV:1, capV:2, cap:9, dia:50, bank:4000, conversa:null, salao:{ ponto:'terraco' } }); ok(b.cap===9 && b.capV===3,'o save com capV 2 em outro capítulo só troca o capV');
  const c=L.normSave({ histV:1, capV:3, cap:12, dia:70, bank:4000, conversa:null, capVezes:1, salao:{ ponto:'terraco' } }); ok(c.cap===12 && c.conversa===null && c.capVezes===1,'o save já na v10.8 não recomeça o cap. 12');
  ok(L.normSave({ histV:1, capV:3, cap:12, rosa:5, salao:{ ponto:'terraco' } }).rosa===0 && L.normSave({ histV:1, capV:3, cap:12, rosa:'x', salao:{ ponto:'terraco' } }).rosa===0 && L.normSave({ histV:1, capV:3, cap:12, rosa:1, salao:{ ponto:'terraco' } }).rosa===1,'save.rosa: só 0 ou 1');
  const eq=v=>L.normSave({ histV:1, capV:3, cap:12, equipe:{ camiFila:v }, salao:{ ponto:'terraco' } }).equipe.camiFila;
  ok(eq(false)===false && eq(true)===true && eq('x')===true && eq(undefined)===true && eq(0)===true,'equipe.camiFila: booleano, padrão true (o lixo vira true)'); }

// ---------- 8. a gerência (CA8) ----------
{ const sv={ equipe:{ tonhao:3, dani:2, anselmo:2, cami:4 }, camiCursos:{ agil:1, mesa:1, salao:1 } };
  const H=jogo(11,sv), {g,L}=H; const t11=loja(H,'equipe','cami'); ok(!/Gerência de salão/.test(t11),'cap. 11: sem o curso de gerência');
  ok(g.buyCamiCurso('gerente')===false,'cap. 11: não compra');
  const H2=jogo(12,sv), g2=H2.g, t12=loja(H2,'equipe','cami'); ok(/Curso de Gerência de salão/.test(t12) && /Comprar R\$ 1200/.test(t12) && /nível 4 de 5/.test(t12),'cap. 12: o curso de Gerência de salão aparece (R$ 1200) e o cartão diz "nível 4 de 5"');
  const cc=L.CAMI_CURSOS.find(x=>x.id==='gerente'); ok(cc && cc.preco===1200 && cc.nivel===4 && cc.dep==='salao' && cc.cap===12,'CAMI_CURSOS: gerente R$ 1200, nível 4, depois do de salão, cap. 12');
  const lv=L.STAFF.cami.levels[5]; ok(lv && lv.speed===1.35 && lv.tasks===4 && lv.pay===200 && lv.mesas===true && lv.tudo===true && lv.gerente===true && L.STAFF.cami.levels.length===6,'STAFF.cami.levels[5]: o nível 5, R$ 200, gerente');
  const H3=jogo(12,{ equipe:{ tonhao:3, dani:2, anselmo:2, cami:3 }, camiCursos:{ agil:1, mesa:1 } }); ok(H3.g.buyCamiCurso('gerente')===false,'sem o curso de salão, não compra a gerência');
  const b0=g2.save.bank; ok(g2.buyCamiCurso('gerente')===true && g2.save.bank===b0-1200 && g2.save.equipe.cami===5 && g2.save.camiCursos.gerente===1,'compra: R$ 1200, a Cami vai ao nível 5');
  ok(L.camiNivelCursos(g2.save)===5 && L.payroll(g2.save.equipe,L.cursosPay(g2.save))>0,'(o nível pelos cursos é 5)');
  const t5=loja(H2,'equipe','cami'); ok(/Organiza a fila/.test(t5),'no nível 5, o cartão traz "Organiza a fila"');
  const sim=botao(H2,'Sim'), nao=botao(H2,'Não'); ok(!!sim && !!nao && g2.save.equipe.camiFila!==false,'os botões Sim e Não (padrão: Sim)');
  nao.fire('click'); ok(g2.save.equipe.camiFila===false,'"Não" desliga'); loja(H2,'equipe','cami'); botao(H2,'Sim').fire('click'); ok(g2.save.equipe.camiFila===true,'"Sim" liga');
  const H4=jogo(12,{ equipe:{ tonhao:3, dani:2, anselmo:2, cami:4 } },'avenida'); ok(H4.g.save.equipe.cami<=3,'fora do Terraço a Cami não passa do nível 3'); }

// ---------- 9. a fila organizada (CA9) ----------
{ const mk=(extra,fila)=>{ const H=jogo(12,Object.assign({ equipe:{ tonhao:3, dani:2, anselmo:2, cami:5, camiFila:fila!==false, camiTasks:['lixo'] }, camiCursos:{ agil:1, mesa:1, salao:1, gerente:1 } },extra||{})); dia(H); H.g.mode='carreira'; return H; };
  const fila=(g,type,cor)=>{ const grp=g.spawn({ type:type||'casal', color:cor==null?0:cor, vip:false, av:true }); return grp; };
  { const H=mk(), {g}=H; const grp=fila(g); grp.stateT=3.9; roda(g,0.4); ok(grp.state==='queue','antes de 4 s parado, fica na fila'); grp.stateT=4.1; roda(g,0.6); ok(grp.state!=='queue' && !!grp.table,'depois de 4 s com mesa livre, a Cami senta o grupo sozinha');
    ok(g.fx.some(f=>f.text && /^Mesa \d+!$/.test(f.text)),'sobe o texto "Mesa N!" (ela chama da porta)'); }
  { const H=mk(), {g}=H; const grp=fila(g,'casal'); grp.stateT=5; const livres=g.tables.filter(t=>t.open&&!t.group&&!t.dirty&&t.seats>=grp.size), min=Math.min.apply(null,livres.map(t=>t.seats)); roda(g,0.6); ok(grp.table && grp.table.seats===min,'a menor mesa em que cabe (de '+min+' lugares)'); }
  { const H=mk(), {g}=H; const grp=fila(g,'familia'); grp.stateT=5; roda(g,0.6); const ok2=!grp.table || grp.table.seats>=grp.size; ok(ok2,'(uma família só senta onde cabe)'); }
  { const H=mk(null,false), {g}=H; const grp=fila(g); grp.stateT=9; roda(g,1.5); ok(grp.state==='queue','com "Organiza a fila: Não", fica na fila'); }
  { const H=mk(), {g}=H; g.tables.forEach(t=>{ t.dirty=true; }); const grp=fila(g); grp.stateT=9; roda(g,1.5); ok(grp.state==='queue','sem mesa limpa, fica na fila'); }
  { const H=mk({ equipe:{ tonhao:3, dani:2, anselmo:2, cami:4 }, camiCursos:{ agil:1, mesa:1, salao:1 } }), {g}=H; const grp=fila(g); grp.stateT=9; roda(g,1.5); ok(grp.state==='queue','a Cami no nível 4 não organiza a fila'); }
  { const H=mk(), {g}=H; const grp=fila(g); grp.stateT=9; g.drag={ g:grp, sx:0, sy:0, x:0, y:0, moved:true, pad:0 }; roda(g,1.2); ok(grp.state==='queue','o grupo arrastado pelo jogador fica onde está'); g.drag=null; }
  { const H=mk(), {g}=H; const c0=g.chainN, l0=g.lastKind; const grp=fila(g); grp.stateT=9; roda(g,0.6); ok(g.chainN===c0 && g.lastKind===l0,'a corrente da Bia não muda'); } }

// ---------- 10. o modo dev (CA10) ----------
{ const H=nova({ store:{ lcc2_dev:'1' } }), {g,L,els}=H; g.setDev(true); g.devReal(true); g.setState('menu');
  ok(g.devCapitulo(12) && g.save.cap===12 && g.save.salao.ponto==='terraco' && g.save.conversa==='antes' && g.save.dia===64 && g.save.bank===10000,'o capítulo 12 da lista: Terraço, dia 64, caixa 10000, com a conversa de antes');
  ok(!g.save.rosa && !g.save.camiCursos.gerente && g.save.equipe.cami===4 && g.save.equipe.lia===1 && g.save.equipe.tonhao===4,'sem o molho e sem a gerência; o resto no máximo');
  ok(g.devCapitulo(13) && g.save.cap===13 && g.save.rosa===1 && g.save.camiCursos.gerente===1 && g.save.equipe.cami===5,'o Fim (13): com o molho e a gerência');
  g.devCapitulo(12); g.devEquipe('max'); ok(g.save.rosa===1 && g.save.camiCursos.gerente===1 && g.save.equipe.cami===5,'"Tudo no máximo" compra o molho e a gerência');
  g.devEquipe('zero'); ok(!g.save.rosa,'"Do começo" tira o molho');
  ok(g.devForca('rosa','sempre') && L.DEV.forca.rosa==='sempre','Pétala: Sempre');
  const H2=jogo(12,{ rosa:0 }, 'avenida'), g2=H2.g; dia(H2); g2.mode='carreira'; const { grp }=sentar(g2,'casal',true); g2.bia.petalas=0; g2.bia.hands=[]; const p=prato(g2,grp,true);
  H2.L.DEV.on=true; H2.L.DEV.forca.rosa='sempre'; g2.bia.perform({ type:'plate', pid:p.id }); const d=g2.bia.hands.find(h=>h.kind==='dish'); ok(d && d.rosa===true && g2.bia.petalas===0,'com "Sempre", o prato da casa sai com pétala sem vaso, em qualquer ponto'); H2.L.DEV.forca={}; H2.L.DEV.on=false;
  L.abrirDev(); L.DEV.aba='hoje'; L.buildDev(); const dv=txt(H.doc.getElementById('dev-body')||{}); ok(/Pétala \(molho da Rosa\)/.test(dv) && /Sempre/.test(dv),'a aba Hoje traz a linha Pétala: Normal | Sempre'); }

// ---------- 11. o Manual (CA11) ----------
{ const H=jogo(12,{ bank:5000, manual:[] , equipe:{ tonhao:3, dani:2, anselmo:2, cami:4 }, camiCursos:{ agil:1, mesa:1, salao:1 } }), {g,L}=H; g.mode='carreira';
  const f1=L.MANUAL.find(f=>f.id==='l-rosa'), f2=L.MANUAL.find(f=>f.id==='l-gerente');
  ok(f1 && f1.aba==='lojinha' && f1.nome==='O molho da Rosa' && f1.linha==='O prato da casa ganha o molho da Rosa. Pegue pétalas no vaso antes de buscar o prato: só a Bia sabe pôr.','a ficha l-rosa');
  ok(f2 && f2.aba==='lojinha' && f2.nome==='Gerência de salão' && f2.linha==='A Cami leva à mesa quem espera na porta. Dá para desligar no cartão dela.','a ficha l-gerente');
  ok(!/\d/.test(f1.linha+f2.linha),'sem número nas fichas');
  ok(g.save.manual.indexOf('l-rosa')<0 && g.save.manual.indexOf('l-gerente')<0,'(as duas fechadas no começo)');
  loja(H,'lanchonete','cardapio'); ok(g.save.manual.indexOf('l-rosa')<0,'só ver o cartão do molho não abre a ficha'); g.buyRosa(); ok(g.save.manual.indexOf('l-rosa')>=0,'l-rosa abre na compra');
  loja(H,'equipe','cami'); ok(g.save.manual.indexOf('l-gerente')>=0,'l-gerente abre quando o cartão aparece'); }

console.log('smoke73: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
