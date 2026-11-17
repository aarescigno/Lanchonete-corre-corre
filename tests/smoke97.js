// v12 (etapa 13a): Desafios. O motor (save de mentira, o dia sem imprevistos nem história, o fim com a medalha), a tela, o cartão do fim,
// a aba do Manual e o modo dev. CA1 a CA6 (a calibração é o balance.js com DESAFIO=<id>; o que se vê, o shot_v12.js).
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const cls=(n,c)=>(n.className||'').split(' ').indexOf(c)>=0;
const html=fs.readFileSync('../lanchonete.html','utf8');
const IDS=['soBia','semBravo','efood'];
// o save de quem já viu o Fim da história (cap 15), no Terraço, com a carreira andada: o desafio não pode mexer em nada disto
const FIMSAVE={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1 };
const mk=(extra,opts)=>{ const sv=Object.assign({},FIMSAVE,extra||{}); return load(Object.assign({ store:{ lcc2_save:JSON.stringify(sv) }, historia:true },opts||{})); };
const sem=(o,k)=>{ const c=JSON.parse(JSON.stringify(o)); delete c[k]; return c; };
const r5=v=>Math.round(v/5)*5;

// ---------- CA1: a lista, os campos, a normalização e o save antigo ----------
bloco('CA1',()=>{ const {L}=load(), D=L.DESAFIOS, por=id=>D.find(x=>x.id===id);
  ok(Array.isArray(D) && D.map(x=>x.id).join()==='soBia,semBravo,efood','CA1: DESAFIOS tem soBia, semBravo e efood, nesta ordem');
  ok(D.every(x=>x.nome && typeof x.cap==='number' && typeof x.dia==='number' && x.mod && typeof x.mod.meta==='number' && x.mod.meta>=0.6 && x.mod.meta<=1.5 && x.aviso && x.falhou!==undefined),'CA1: cada um tem id, nome, cap, dia, mod (com meta de 0,6 a 1,5), aviso e falhou');
  const a=por('soBia'), b=por('semBravo'), c=por('efood');
  ok(a.nome==='Só a Bia' && a.cap===5 && a.dia===17 && a.mod.sem.join()==='dani,joca,cami,anselmo,lia' && a.mod.groups===1 && !a.cond,'CA1: Só a Bia: cap 5, dia 17, sem as cinco pessoas, groups 1, sem cond');
  ok(b.nome==='Ninguém bravo' && b.cap===8 && b.dia===38 && (b.mod.groups===1.1 || b.mod.groups===1),'CA1: Ninguém bravo: cap 8, dia 38, groups 1,1 (ou 1 se a calibração desceu)');
  ok(c.nome==='Hora do eFood' && c.cap===5 && c.dia===17 && c.mod.tipo==='entregador' && (c.mod.tipoP===0.45 || c.mod.tipoP===0.3) && c.mod.groups===1.1,'CA1: Hora do eFood: cap 5, dia 17, tipo entregador (tipoP 0,45, ou 0,3 se a calibração desceu), groups 1,1');
  ok(a.aviso==='Hoje a Bia segura o salão sozinha. O tio fica na cozinha.' && b.aviso==='Hoje ninguém pode sair bravo da Avenida.' && c.aviso==='O eFood mandou entregador que não acaba mais!','CA1: os três avisos');
  ok(b.falhou==='Alguém saiu bravo.' && c.falhou==='Um entregador saiu sem a marmita.','CA1: os dois falhou');
  ok(b.cond({lost:0,lostBy:{retirada:2}})===true && b.cond({lost:1,lostBy:{retirada:0}})===false,'CA1: a cond de Ninguém bravo é lost === 0');
  ok(c.cond({lost:3,lostBy:{retirada:0}})===true && c.cond({lost:3,lostBy:{retirada:1}})===false,'CA1: a cond do eFood é lostBy.retirada === 0');
  const n=L.normDesafios({ soBia:2, xx:3, semBravo:9, efood:-1 }); ok(JSON.stringify(n)==='{"soBia":2}','CA1: normDesafios tira id estranho e valor fora de 0 a 3 ('+JSON.stringify(n)+')');
  ok(JSON.stringify(L.normDesafios({ soBia:2.5, efood:'3', semBravo:3 }))==='{"semBravo":3}' && JSON.stringify(L.normDesafios(null))==='{}' && JSON.stringify(L.normDesafios({ soBia:0 }))==='{"soBia":0}','CA1: só inteiros de 0 a 3; nulo vira {}');
  ok(JSON.stringify(L.normSave({ dia:5, bank:100 }).desafios)==='{}','CA1: o save da v11.19 (sem o campo) abre com desafios {}');
  ok(JSON.stringify(L.normSave({ desafios:{ soBia:3, foo:1 } }).desafios)==='{"soBia":3}','CA1: o campo do save passa pelo normDesafios');
  const f=L.MANUAL.filter(x=>x.aba==='desafios');
  ok(L.MANUAL_ABAS.some(x=>x[0]==='desafios' && x[1]==='Desafios') && f.map(x=>x.id).join()==='d-soBia,d-semBravo,d-efood','CA1: a aba "Desafios" do Manual, com as três fichas');
  ok(f[0].linha==='Um dia na área industrial sem ajudante: só a Bia no salão e o Tonhão no fogão.' && f[1].linha==='Um dia na Avenida em que nenhum grupo pode ir embora bravo, nem da fila.' && f[2].linha==='Um dia na área industrial com entregador chegando o tempo todo. Nenhum pode ir embora de mãos vazias.','CA1: as três linhas das fichas');
  ok(f.every(x=>!/\d/.test(x.linha)),'CA1: as fichas não têm número'); });

// ---------- CA2: o botão, a tela, os cartões e o "?" ----------
bloco('CA2',()=>{
  { const {L,els,g}=load(); L.buildMenu();
    ok(els['btn-desafios'].style.display==='none','CA2: antes do Fim (cap 4), o botão Desafios fica escondido'); }
  { const {L,els,g}=mk(); L.buildMenu();
    ok(els['btn-desafios'].style.display!=='none' && g.save.cap===15,'CA2: com o cap 15 (o Fim), o botão aparece');
    ok(['d-soBia','d-semBravo','d-efood'].every(id=>g.save.manual.indexOf(id)>=0),'CA2: as três fichas são reveladas quando o botão aparece');
    const i=html.indexOf('id="btn-endless"'), j=html.indexOf('id="btn-desafios"'), k=html.indexOf('id="btn-manual"');
    ok(i>0 && j>i && k>j,'CA2: no menu, #btn-desafios vem depois de #btn-endless e antes de #btn-manual'); }
  { const {L,els,g}=load(); g.setDev(true); L.buildMenu(); ok(els['btn-desafios'].style.display!=='none','CA2: no modo dev Livre, o botão aparece'); }
  { const {L,els,g}=mk(); L.buildMenu(); els['btn-desafios'].fire('click');
    ok(g.state==='desafios' && els['ov-desafios'].classList.contains('show') && !els['ov-menu'].classList.contains('show'),'CA2: tocar no botão abre a tela de Desafios');
    ok(/<div class="ov" id="ov-desafios">[\s\S]*?<h2>Desafios<\/h2>/.test(html),'CA2: a tela #ov-desafios tem o título "Desafios"');
    const cartoes=todos(els['desafios-grid'],n=>n.getAttribute && n.getAttribute('data-desafio'));
    ok(cartoes.length===3 && cartoes.map(c=>c.getAttribute('data-desafio')).join()==='soBia,semBravo,efood','CA2: a tela lista os três cartões, na ordem');
    const rot=c=>todos(c,n=>n.tagName==='BUTTON' && !cls(n,'qm'))[0];
    ok(cartoes.every(c=>/sem medalha$/.test(rot(c).getAttribute('aria-label'))) && rot(cartoes[0]).getAttribute('aria-label')==='Só a Bia, sem medalha','CA2: sem medalha, o leitor de tela lê "Só a Bia, sem medalha"');
    ok(cartoes.every(c=>todos(c,n=>n.getAttribute && n.getAttribute('data-medalha')!==undefined && n.getAttribute('data-medalha')!==null).length===1),'CA2: cada cartão tem a medalha (data-medalha)');
    g.save.desafios={ soBia:2, semBravo:1, efood:3 }; L.buildDesafios();
    const c2=todos(els['desafios-grid'],n=>n.getAttribute && n.getAttribute('data-desafio'));
    ok(rot(c2[0]).getAttribute('aria-label')==='Só a Bia, medalha de prata' && rot(c2[1]).getAttribute('aria-label')==='Ninguém bravo, medalha de bronze' && rot(c2[2]).getAttribute('aria-label')==='Hora do eFood, medalha de ouro','CA2: "Só a Bia, medalha de prata", "..., medalha de bronze" e "..., medalha de ouro"');
    const med=c=>todos(c,n=>n.getAttribute && n.getAttribute('data-medalha')!==null && n.getAttribute('data-medalha')!==undefined)[0].getAttribute('data-medalha');
    ok(med(c2[0])==='2' && med(c2[1])==='1' && med(c2[2])==='3','CA2: a medalha de cada cartão (2, 1 e 3)');
    const qs=todos(els['desafios-grid'],n=>cls(n,'qm'));
    ok(qs.length===3 && qs.map(q=>q.getAttribute('data-ficha')).join()==='d-soBia,d-semBravo,d-efood' && qs.every(q=>q.textContent==='?'),'CA2: um "?" por cartão, com a ficha dele');
    qs[1].fire('click');
    ok(els['ov-manual'].classList.contains('show') && todos(els['manual-grid'],n=>n.getAttribute && n.getAttribute('data-id')==='d-semBravo').length===1,'CA2: o "?" abre a ficha no Manual');
    els['btn-manual-voltar'].fire('click'); ok(els['ov-desafios'].classList.contains('show'),'CA2: Voltar do Manual leva à tela de Desafios');
    els['btn-desafios-voltar'].fire('click'); ok(g.state==='menu' && els['ov-menu'].classList.contains('show') && !els['ov-desafios'].classList.contains('show'),'CA2: Voltar da tela de Desafios volta ao menu'); } });

// ---------- CA3: o dia de cada desafio ----------
bloco('CA3',()=>{
  IDS.forEach(id=>{ const H=mk(), {g,L,els,store}=H, D=L.DESAFIOS.find(x=>x.id===id), real=g.save, antes=store.lcc2_save;
    L.MANUT.on=true;   // com os imprevistos ligados, o desafio tem de sair limpo mesmo assim
    g.startDesafio(id);
    const cap=L.DEV_CAPS[D.cap-1];
    ok(g.state==='intro' && g.desafio && g.desafio.id===id && g.mode==='carreira','CA3: '+id+' abre a introdução, no modo carreira, com g.desafio');
    ok(g.save!==real && g.save._desafio===true && g.salvo===real && g.up===g.save.up,'CA3: '+id+' joga com um save de mentira (_desafio) e guarda o de verdade em g.salvo');
    ok(g.save.salao.ponto===cap.ponto && g.ponto.id===cap.ponto,'CA3: '+id+' no ponto da linha cap ('+cap.ponto+')');
    ok(g.day.n===D.dia && g.save.dia===D.dia,'CA3: '+id+' no dia '+D.dia);
    const base=g.diaPonto(L.diaOf(D.dia));
    ok(g.day.meta===r5(base.meta*D.mod.meta) && g.day.expert===r5(base.expert*D.mod.meta) && L.bomGoal(g.day)===Math.round((g.day.meta+g.day.expert)/50)*25,'CA3: '+id+': as metas são as do dia vezes mod.meta, arredondadas para 5 ('+g.day.meta+', '+g.day.expert+')');
    ok(Math.abs(g.day.groups-base.groups*(D.mod.groups||1))<1e-9,'CA3: '+id+': os grupos são os do dia vezes mod.groups');
    ok(g.clima==='' && g.evento==='' && g.quebras.length===0 && g.fiscal===null && g.visita===null && g.noite===false && g.conversa===null && !g.save.manut.sorteio,'CA3: '+id+': sem clima, evento, quebra, fiscal, crítico, noite nem conversa');
    ok(L.histLiga()===false,'CA3: '+id+': histLiga() dá falso durante o desafio');
    if (D.mod.sem) ok(D.mod.sem.every(q=>g.save.equipe[q]===0),'CA3: '+id+': '+D.mod.sem.join(', ')+' em 0');
    else ok(g.save.equipe.dani===L.STAFF.dani.levels.length-1 && g.save.equipe.joca===L.STAFF.joca.levels.length-1 && g.save.equipe.cami>=cap.eq.cami,'CA3: '+id+': a equipe no máximo ("Tudo no máximo"): Dani '+g.save.equipe.dani+', Joca '+g.save.equipe.joca+', Cami '+g.save.equipe.cami);
    ok(g.save.equipe.tonhao===L.STAFF.tonhao.levels.length-1,'CA3: '+id+': o Tonhão no nível máximo ('+g.save.equipe.tonhao+')');
    ok(L.CURSOS.every(c=>g.save.cursos[c.id]===2) && L.DANI_CURSOS.every(c=>g.save.daniCursos[c.id]) && L.JOCA_CURSOS.every(c=>g.save.jocaCursos[c.id]),'CA3: '+id+': todos os cursos (do Tonhão, da Dani e do Joca)');
    ok(cap.up.every(u=>g.up[u]) && L.UPGRADES.every(u=>g.up[u.id]) && Object.keys(g.up).length>cap.up.length+3,'CA3: '+id+': as melhorias do ponto no máximo ('+Object.keys(g.up).length+' contra '+cap.up.length+' da linha cap)');
    ok(L.salaoLugares(g.save.salao.mesas)===g.ponto.lugares && g.save.salao.mesas.every(m=>m.seats===4) && g.save.salao.estoque.length===0,'CA3: '+id+': o salão cheio ('+g.ponto.lugares+' lugares, mesas de 4)');
    ok(g.save.divulga==='redes' && g.div && g.div.id==='redes','CA3: '+id+': a divulgação Redes sociais');
    ok(g.save.equipe.tonhao>0,'CA3: '+id+': o Tonhão segue na cozinha');
    // vários dias sorteados: nunca imprevisto
    let limpo=true; for(let i=0;i<30;i++){ g.startDesafio(id); if(g.clima!=='' || g.evento!=='' || g.quebras.length || g.fiscal || g.visita || g.noite) limpo=false; }
    ok(limpo,'CA3: '+id+': em 30 dias montados, nenhum imprevisto (com MANUT ligado)');
    g.begin(); ok(g.state==='playing' && g.aberto===true,'CA3: '+id+': "Abrir a lanchonete" começa o dia');
    ok(JSON.stringify(real)===JSON.stringify(g.salvo) && store.lcc2_save===antes,'CA3: '+id+': o save de verdade e o localStorage ficam como estavam ao começar o dia');
    g.sairDesafio(); ok(g.save===real && g.salvo===null && g.desafio===null,'CA3: '+id+': sairDesafio devolve o save de verdade'); });
  // o eFood: mais de 35% dos grupos são entregadores
  { const {g,L}=mk(); g.startDesafio('efood'); let ent=0,tot=0; for(let i=0;i<40;i++){ const s=g.buildSchedule(g.day); s.forEach(x=>{ if(x.type==='encomenda') return; tot++; if(x.type==='entregador') ent++; }); }
    ok(ent/tot>0.35,'CA3: efood: os entregadores passam de 35% dos grupos ('+Math.round(100*ent/tot)+'%)');
    const H=mk(), g2=H.g; g2.startDesafio('soBia'); let e2=0,t2=0; for(let i=0;i<40;i++){ g2.buildSchedule(g2.day).forEach(x=>{ if(x.type==='encomenda') return; t2++; if(x.type==='entregador') e2++; }); }
    ok(e2/t2<ent/tot,'CA3: o desafio comum tem menos entregadores que o do eFood ('+Math.round(100*e2/t2)+'%)'); } });

// ---------- CA4: o fim dá a medalha; a melhor fica; nada mais do save de verdade muda ----------
const fecha=(g,lucro,lost,ret)=>{ g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+lucro; g.stats.lost=lost||0; g.stats.lostBy.retirada=ret||0; g.finishDay(); return g.desafioRes; };
bloco('CA4',()=>{
  const H=mk(), {g,L,els,store}=H, real=g.save, antes=JSON.stringify(real), lsAntes=store.lcc2_save, ls0=Object.keys(store).sort().join();
  g.startDesafio('semBravo'); const d=g.day, bom=L.bomGoal(d);
  let r=fecha(g,d.meta-5,0); ok(r.medalha===0 && g.state==='desafiofim','CA4: abaixo da meta: sem medalha');
  g.sairDesafio();
  g.startDesafio('semBravo'); r=fecha(g,d.meta,0); ok(r.medalha===1 && real.desafios.semBravo===1,'CA4: a meta (1 estrela) dá bronze e fica guardada ('+r.medalha+')');
  g.sairDesafio(); g.startDesafio('semBravo'); r=fecha(g,d.meta-5,0); ok(r.medalha===0 && real.desafios.semBravo===1,'CA4: uma rodada pior não apaga a melhor marca');
  g.sairDesafio(); g.startDesafio('semBravo'); r=fecha(g,bom,0); ok(r.medalha===2 && real.desafios.semBravo===2,'CA4: o bomGoal (2 estrelas) dá prata');
  g.sairDesafio(); g.startDesafio('semBravo'); r=fecha(g,d.expert,0); ok(r.medalha===3 && real.desafios.semBravo===3,'CA4: a expert sem perder ninguém (3 estrelas) dá ouro');
  g.sairDesafio(); g.startDesafio('semBravo'); r=fecha(g,bom,0); ok(r.medalha===2 && real.desafios.semBravo===3,'CA4: depois do ouro, uma prata não rebaixa');
  g.sairDesafio(); g.startDesafio('semBravo'); r=fecha(g,d.expert,1); ok(r.medalha===0 && r.falhou===true,'CA4: com um grupo bravo, a cond de Ninguém bravo falha e a medalha é 0');
  g.sairDesafio();
  g.startDesafio('soBia'); r=fecha(g,g.day.expert,2); ok(r.medalha===2 && real.desafios.soBia===2,'CA4: Só a Bia não tem cond: perdendo gente, a expert dá 2 estrelas, prata');
  g.sairDesafio();
  g.startDesafio('efood'); r=fecha(g,g.day.expert,3,0); ok(r.medalha===2,'CA4: eFood: perder gente da sala não zera a medalha (só a retirada); com perda, a expert dá 2 estrelas, prata');
  g.sairDesafio(); g.startDesafio('efood'); r=fecha(g,g.day.expert,0,0); ok(r.medalha===3,'CA4: eFood: ninguém perdido, a expert dá ouro');
  g.sairDesafio(); g.startDesafio('efood'); r=fecha(g,g.day.expert,1,1); ok(r.medalha===0,'CA4: eFood: um entregador que saiu sem a marmita zera a medalha');
  g.sairDesafio();
  ok(JSON.stringify(sem(real,'desafios'))===JSON.stringify(sem(JSON.parse(antes),'desafios')),'CA4: o save de verdade só mudou na medalha (caixa, dia, estrelas, lucro, ranking, manutenção, Gúgou e guia iguais)');
  const dep=JSON.parse(store.lcc2_save);
  ok(JSON.stringify(sem(dep,'desafios'))===JSON.stringify(sem(JSON.parse(lsAntes),'desafios')) && dep.desafios.semBravo===3 && dep.desafios.soBia===2,'CA4: o localStorage só ganhou a medalha (desafios)');
  ok(Object.keys(store).sort().join()===ls0 && !store.lcc2_ranking,'CA4: nenhuma chave nova no localStorage, e o ranking não foi tocado');
  ok(real.bank===12345 && real.dia===70 && real.estrelas===77 && real.lucroTot===54321,'CA4: caixa, dia, estrelas e lucro acumulado iguais'); });

// ---------- CA5: o cartão do fim e a pausa ----------
bloco('CA5',()=>{
  const H=mk(), {g,L,els,store}=H, real=g.save;
  g.startDesafio('semBravo'); const d=g.day, bom=L.bomGoal(d);
  const msg=()=>txt(els['desafio-fim-msg']).trim();
  fecha(g,d.meta,0); ok(g.state==='desafiofim' && els['ov-desafio-fim'].classList.contains('show') && !els['ov-end'].classList.contains('show') && !els['ov-shop'].classList.contains('show'),'CA5: o fim abre o #ov-desafio-fim (e não os resultados nem a lojinha)');
  ok(/Ninguém bravo/.test(txt(els['desafio-fim-titulo'])),'CA5: o título é o nome do desafio');
  ok(msg()==='Medalha de bronze! Nova melhor marca!','CA5: bronze novo: "Medalha de bronze! Nova melhor marca!" ('+msg()+')');
  ok(todos(els['desafio-fim-medalha'],n=>n.getAttribute && n.getAttribute('data-medalha')==='1').length===1,'CA5: a medalha grande é a de bronze');
  g.sairDesafio(); g.startDesafio('semBravo'); fecha(g,d.meta,0); ok(msg()==='Medalha de bronze!','CA5: o mesmo bronze de novo: só "Medalha de bronze!" ('+msg()+')');
  g.sairDesafio(); g.startDesafio('semBravo'); fecha(g,bom,0); ok(msg()==='Medalha de prata! Nova melhor marca!','CA5: prata nova ('+msg()+')');
  g.sairDesafio(); g.startDesafio('semBravo'); fecha(g,d.expert,0); ok(msg()==='Medalha de ouro! Nova melhor marca!','CA5: ouro novo ('+msg()+')');
  g.sairDesafio(); g.startDesafio('semBravo'); fecha(g,d.expert,2); ok(msg()==='Alguém saiu bravo.','CA5: a cond falhou: a frase do falhou ('+msg()+')');
  g.sairDesafio(); g.startDesafio('semBravo'); fecha(g,d.meta-5,0); ok(msg()==='Não deu a meta.','CA5: meta não batida: "Não deu a meta." ('+msg()+')');
  g.sairDesafio(); g.startDesafio('efood'); fecha(g,g.day.meta,1,1); ok(msg()==='Um entregador saiu sem a marmita.','CA5: eFood: "Um entregador saiu sem a marmita."');
  const btn=id=>els[id];
  ok(/id="btn-desafio-de-novo">Tentar de novo</.test(html) && /id="btn-desafio-lista">Desafios</.test(html),'CA5: os botões "Tentar de novo" e "Desafios"');
  btn('btn-desafio-de-novo').fire('click'); ok(g.state==='intro' && g.desafio && g.desafio.id==='efood' && g.salvo===real,'CA5: "Tentar de novo" volta à introdução do mesmo desafio');
  ok(els['ov-intro'].classList.contains('show') && /Hora do eFood/.test(txt(els['intro-title'])) && /eFood mandou entregador/.test(txt(els['intro-note'])),'CA5: a introdução tem o nome do desafio no título e o aviso no lugar do aviso do dia');
  els['btn-intro-menu'].fire('click'); ok(g.state==='desafios' && els['ov-desafios'].classList.contains('show') && g.save===real && g.salvo===null && g.desafio===null,'CA5: "Menu" da introdução volta à tela de Desafios, com o save de verdade de volta');
  // fim -> Desafios
  g.startDesafio('soBia'); fecha(g,g.day.meta,0); btn('btn-desafio-lista').fire('click'); ok(g.state==='desafios' && g.save===real && g.salvo===null && els['ov-desafios'].classList.contains('show'),'CA5: "Desafios" do cartão do fim leva à tela de Desafios, com o save de verdade de volta');
  // a pausa no meio
  const snap=JSON.stringify(real), ls=store.lcc2_save;
  g.startDesafio('efood'); els['btn-start'].fire('click'); ok(g.state==='playing','CA5: "Abrir a lanchonete" começa o dia');
  g.pause(); ok(g.state==='paused' && els['ov-pause'].classList.contains('show'),'CA5: a pausa abre');
  els['btn-pause-menu'].fire('click'); if(g.state==='paused') els['btn-pause-menu'].fire('click');
  ok(g.state==='desafios' && els['ov-desafios'].classList.contains('show') && g.save===real && g.salvo===null,'CA5: sair pela pausa volta à tela de Desafios, sem medalha');
  ok(JSON.stringify(real)===snap && store.lcc2_save===ls,'CA5: a pausa no meio não grava nada'); });

// ---------- CA6: o modo dev ----------
bloco('CA6',()=>{
  const H=load(), {g,L,els}=H; g.setDev(true); g.devReal(true); L.buildMenu();
  ok(els['btn-desafios'].style.display==='none','CA6: no modo dev De verdade e sem o Fim, o botão fica escondido');
  L.abrirDev(); L.DEV.aba='pular'; L.buildDev();
  const bt=()=>todos(els['dev-body'],n=>n.tagName==='BUTTON'), acha=t=>bt().find(b=>b.textContent===t);
  ok(/Desafios/.test(txt(els['dev-body'])) && !!acha('Liberar') && !!acha('Ouro em todos') && !!acha('Zerar'),'CA6: na aba Pular, a linha "Desafios" com Liberar, Ouro em todos e Zerar');
  acha('Liberar').fire('click'); L.fecharDev(); L.buildMenu(); ok(els['btn-desafios'].style.display!=='none','CA6: "Liberar" mostra o botão sem o Fim');
  L.abrirDev(); L.buildDev(); acha('Ouro em todos').fire('click'); ok(g.save.desafios.soBia===3 && g.save.desafios.semBravo===3 && g.save.desafios.efood===3,'CA6: "Ouro em todos" põe 3 em todos');
  acha('Zerar').fire('click'); ok(JSON.stringify(g.save.desafios)==='{}','CA6: "Zerar" limpa save.desafios');
  g.setDev(false); ok(g.devDesafios && g.devDesafios('ouro')===false,'CA6: fora do modo dev, devDesafios não faz nada'); });

console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
