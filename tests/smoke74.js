// v10.9, etapa 6b: o crítico sem aviso (cap. 13): o sorteio das visitas, o crítico disfarçado, o caderninho, a ficha, o boato do Bráulio, o comentário plantado, o capítulo, o modo dev e o Manual.
// CA1 o sorteio; CA2 o crítico no dia; CA3 o disfarce; CA4 o caderninho; CA5 a ficha; CA6 o fim do dia e a conversa; CA7 o boato; CA8 o comentário plantado; CA9 o capítulo 13 e o save; CA10 o modo dev; CA11 o Manual.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const achaTag=(e,tag,out=[])=>{ if(e.tagName===tag) out.push(e); (e.children||[]).forEach(c=>achaTag(c,tag,out)); return out; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,sv,ponto,opt)=>{ const H=nova(opt), {g,L}=H; const n=60;
  g.save=L.normSave(Object.assign({ histV:1, capV:4, cap, dia:n, maxDay:n, bank:6000, v10:1, rosa:1, up:{ tenis:true, bandeja:true }, equipe:{ tonhao:3, anselmo:2 }, salao:{ ponto:ponto||'terraco' }, conversa:null, pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2, lia:2 } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(n); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); if(aba) H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };
const comeca=(H,n)=>{ const {g,els}=H; g.startDay(n||g.save.dia); els['btn-start'].fire('click'); return H; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const passa=(g)=>{ let n=0; while(g.conversa && n<40){ g.conversa.seguir(); n++; } return n; };
const GUIA=(n,prox,v)=>({ n, prox, v:v||[] });
const FICHA=(d,it)=>({ d, it:it||[2,2,2,2,2] });
/* o crítico da programação do dia, sentado numa mesa (estado 'ordered') */
const critico=(H,ajuda)=>{ const {g}=H; comeca(H); const s=g.schedule.find(x=>x.critico); const grp=g.spawn(s); const t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); g.mode='carreira'; return { grp, t, s }; };
const dia1=(sv)=>jogo(13,Object.assign({ guia:GUIA(0,60), conversa:null, capDia:50 },sv||{}));
/* fecha o dia sem jogar (a ficha, se houver, já foi posta) */
const fecha=(H,ficha)=>{ const {g}=H; g.schedule=[]; g.nextIdx=0; g.money=3000; g.custo=0; if(ficha) g.ficha=ficha; g.finishDay(); };

// ---------- 1. o sorteio das visitas (CA1) ----------
{ const L=load({ historia:true }).L;
  ok(L.CRITICO.tipo==='executiva' && L.CRITICO.chega[0]===0.3 && L.CRITICO.chega[1]===0.6 && L.CRITICO.primeira[0]===1 && L.CRITICO.primeira[1]===3 && L.CRITICO.segunda[0]===2 && L.CRITICO.segunda[1]===3 && L.CRITICO.caderno===1.8 && L.CRITICO.lotada===1.25 && L.CRITICO.salaoT===6 && L.CRITICO.pac===2,'CRITICO: executiva, chega 30–60%, 1ª em 1 a 3 dias, 2ª em 2 a 3, caderno 1,8 s, lotada ×1,25, salaoT 6, pac 2');
  ok(L.CRITICO.itens.join(',')==='Recepção,Atendimento,Prato,Salão,Refeição' && L.CRITICO.boato==='Boato na cidade: dizem que hoje a casa dá sobremesa de graça. Vai lotar!' && L.CRITICO.coment==='Ouvi dizer que o molho de lá é copiado.','CRITICO: os cinco itens e os textos');
  const vistos={}; let tudoOk=true;
  for(let i=0;i<40;i++){ const H=jogo(12,{ conversa:'depois', capVezes:3 }), g=H.g; g.avancaCap(); const sv=g.save, d=sv.guia.prox-sv.dia; vistos[d]=1; if(!(sv.cap===13 && sv.guia.n===0 && sv.guia.v.length===0 && d>=1 && d<=3)) tudoOk=false; }
  ok(tudoOk && vistos[1] && vistos[3],'ao começar o cap. 13, a 1ª visita cai de 1 a 3 dias à frente (vistos: '+Object.keys(vistos).join(',')+')');
  const H=dia1({ guia:GUIA(0,62) }), g=H.g; const p0=JSON.stringify(g.save.guia); g.startDay(60); g.startDay(60); g.startDay(60);
  ok(JSON.stringify(g.save.guia)===p0 && g.save.guia.prox===62,'recomeçar o dia não muda o sorteio');
  ok(g.visita===null,'(dia 60 não é o dia da visita)');
  // depois da 1ª visita: de 2 a 3 dias; só o fim do dia grava a ficha
  const vistos2={}; let ok2=true;
  for(let i=0;i<40;i++){ const H2=dia1(), g2=H2.g; comeca(H2); if(!g2.visita || g2.visita.n!==1 || g2.visita.boato) ok2=false; ok2=ok2 && g2.save.guia.v.length===0 && g2.save.guia.n===0; fecha(H2,FICHA(60)); const d=g2.save.guia.prox-60; vistos2[d]=1; if(!(g2.save.guia.n===1 && g2.save.guia.v.length===1 && d>=2 && d<=3)) ok2=false; }
  ok(ok2 && vistos2[2] && vistos2[3],'a 1ª visita grava a ficha só no fim do dia, e a 2ª cai de 2 a 3 dias depois (vistos: '+Object.keys(vistos2).join(',')+')');
  const H3=dia1({ guia:GUIA(1,60,[FICHA(57)]) }); comeca(H3); fecha(H3,FICHA(60,[1,1,1,1,1]));
  ok(H3.g.save.guia.n===2 && H3.g.save.guia.prox===0 && H3.g.save.guia.v.length===2,'depois da 2ª visita: prox 0, duas fichas');
  const H4=dia1({ guia:GUIA(0,58) }); comeca(H4); ok(H4.g.visita && H4.g.visita.n===1,'o dia da visita que passou sem ela vale no seguinte (nunca trava)');
  const H5=jogo(12,{ guia:GUIA(0,60) }); comeca(H5); ok(H5.g.visita===null && !H5.g.schedule.some(s=>s.critico),'fora do cap. 13 não há visita'); }

// ---------- 2. o crítico no dia (CA2) ----------
{ let tudo=true, vistos=0;
  for(let i=0;i<30;i++){ const H=dia1(), g=H.g; g.startDay(60); const cs=g.schedule.filter(s=>s.critico), win=g.day.speed*g.day.time, c=cs[0];
    if(cs.length!==1 || c.type!=='executiva' || !c.disfarce){ tudo=false; continue; } const f=c.t/win; if(f<0.3-1e-9 || f>0.6+1e-9) tudo=false; else vistos++; }
  ok(tudo && vistos===30,'no dia da visita, exatamente um grupo é o crítico (executiva, sozinha), chegando entre 30% e 60% da janela');
  const H=dia1({ guia:GUIA(0,62) }), g=H.g; g.startDay(60); ok(!g.schedule.some(s=>s.critico),'nos outros dias, nenhum');
  const H2=dia1(), g2=H2.g; g2.startDay(60); const so=g2.schedule.filter(s=>s.critico), n0=g2.schedule.length; ok(so.length===1 && g2.schedule.filter(s=>s.av).length>=1 && so[0].av===true,'o crítico sempre avalia no Gurugol');
  // sem nenhum grupo na faixa, entra um a mais aos 45%
  const H3=dia1(), g3=H3.g; const mb=g3.buildSchedule.bind(g3); g3.visita={ n:1, boato:false, real:true };
  const sch=g3.buildSchedule(g3.day); ok(sch.filter(s=>s.critico).length===1,'(buildSchedule direto: um crítico)');
  let extra=0, um=true; for(let i=0;i<60;i++){ g3.day=Object.assign({},g3.day,{ groups:1 }); g3.divF=1; const sc=g3.buildSchedule(g3.day), win=g3.day.speed*g3.day.time, k=sc.filter(s=>s.critico); if(k.length!==1 || k[0].t/win<0.3-1e-9 || k[0].t/win>0.6+1e-9) um=false; if(sc.length>3) extra++; }
  ok(um,'com poucos grupos, ainda há um crítico na faixa (e, sem ninguém nela, entra um a mais aos 45%: '+extra+' de 60 dias com grupo a mais)'); }

// ---------- 3. o disfarce (CA3) ----------
{ const H=dia1(), {g,L}=H; comeca(H); const man0=g.save.manual.join(','); const { grp, t, s }=critico(H);
  ok(grp.critico && grp.disfarce && grp.size===1 && grp.type==='executiva','o grupo do crítico: sozinho, executiva, critico e disfarce');
  ok(grp.people.every(p=>!p.chapeu && !p.lenco && !p.echarpe && !p.shades),'sem chapéu, lenço, echarpe nem óculos escuros');
  ok(grp.vip===true && grp.exigente===true && grp.vipAberto===false,'por dentro é VIP exigente, mas o VIP não aparece (vipAberto falso: sem plaquinha nem marca na fila)');
  ok(grp.bill>=L.EXIGENTE.casa.preco && grp.avalia===true,'pede o prato da casa (a conta leva R$ '+L.EXIGENTE.casa.preco+') e sempre avalia');
  ok(!g.fx.some(f=>f.text==='VIP chegou!'),'sem o aviso "VIP chegou!"');
  ok(g.save.manual.join(',')===man0 && g.stats.exigentes===0,'não abre fichas do Manual (VIP, exigente) nem conta como exigente do dia');
  { const ctl=g.spawn({ type:'executiva', color:1, vip:true, exig:true, av:true }); ctl.state=grp.state; ok(Math.abs(grp.patPer()/ctl.patPer()-L.CRITICO.pac)<1e-9,'o crítico tem o dobro da paciência de um VIP exigente comum (CRITICO.pac)'); }
  g.collectBill(grp,t); ok(g.stats.vip===0,'não conta em stats.vip ('+g.stats.vip+')');
  // o VIP de verdade (controle): com acessório, plaquinha e na conta
  const H2=jogo(13,{ guia:GUIA(0,70) }), g2=H2.g; comeca(H2); const v=g2.spawn({ type:'casal', color:0, vip:true, av:true });
  ok(v.vipAberto===true && v.people.some(p=>p.chapeu||p.lenco||p.echarpe),'(o VIP comum segue com acessório e plaquinha)');
  // fura a fila sem avisar
  const H3=dia1(), g3=H3.g; comeca(H3); g3.mode='carreira'; const a=g3.spawn({ type:'estudante', color:0, vip:false, av:true }), c=g3.spawn({ type:'executiva', color:1, vip:true, exig:true, critico:true, disfarce:true, av:true });
  ok(g3.queue.indexOf(c)<g3.queue.indexOf(a) && !g3.fx.some(f=>f.text==='VIP chegou!'),'como todo VIP, o crítico fura a fila (mas sem o aviso "VIP chegou!")');
  const b2=g3.spawn({ type:'estudante', color:2, vip:false, av:true }); ok(g3.queue.indexOf(c)===0 && g3.queue.indexOf(b2)>g3.queue.indexOf(a),'(e os outros seguem na ordem)');
  // bravo: não tira movimento do dia seguinte nem conta como VIP perdido
  const H4=dia1(), g4=H4.g; const c4=critico(H4); g4.angryLeave(c4.grp); ok(!g4.save.exigBravo && g4.stats.vipLost===0,'o crítico bravo não conta como VIP perdido nem tira gente do dia seguinte'); }

// ---------- 4. o caderninho (CA4) ----------
{ const H=dia1(), {g,L}=H; comeca(H); const s=g.schedule.find(x=>x.critico), grp=g.spawn(s), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size);
  g.seatGroup(grp,t); ok(grp.caderno===0,'antes de chegar à mesa, sem caderninho');
  for(let i=0;i<200 && grp.state!=='reading';i++) g.update(0.05);
  ok(grp.state==='reading' && grp.caderno>1.6 && grp.caderno<=1.8,'logo depois de sentar, o caderninho sai por 1,8 s ('+grp.caderno.toFixed(2)+')');
  roda(g,1.9); ok(grp.caderno===0,'e guarda depois de 1,8 s');
  grp.setState('ordered');
  const nomes=['bebida','entrada','prato','sobremesa']; nomes.forEach((nm,i)=>{ grp.notaT[i]=5; roda(g,0.1); ok(grp.caderno>1.6 && grp.cadV[i],'depois de servir a '+nm+', o caderninho sai de novo'); roda(g,1.9); });
  roda(g,0.5); ok(grp.caderno===0,'cada tempo só puxa o caderninho uma vez');
  const H2=jogo(13,{ guia:GUIA(0,70) }); comeca(H2); const q=H2.g.spawn({ type:'executiva', color:0, vip:true, av:true }); H2.g.groups.forEach(x=>x.update(1)); ok(q.caderno===0 && !q.critico,'o freguês comum nunca tem caderninho');
  ok(typeof L.drawCaderno==='function' && typeof L.drawGarfo==='function','(o desenho do caderninho e do garfinho existe)');
  const ops=[]; const cx=new Proxy({},{ get:(o,k)=> k==='canvas'?{}:(typeof k==='string'?(()=>{ ops.push(k); return cx; }):undefined), set:()=>true }); try{ L.drawCaderno(cx,50,50,1,true,1); L.drawCaderno(cx,50,50,1,false,1); ok(ops.length>10,'o caderninho desenha (com a caneta mexendo e parada)'); }catch(e){ ok(false,'drawCaderno: '+e.message); } }

// ---------- 5. a ficha (CA5) ----------
{ const mk=(campos)=>{ const H=dia1(), {g}=H; const c=critico(H), grp=c.grp; grp.perdFila=0; grp.hearts=5; grp.pratoMain={ rosa:true, crit:true, fria:false }; grp.salaoSeg=0; grp.notaT=[5,5,5,5]; Object.assign(grp,campos||{}); g.collectBill(grp,c.t); return g.ficha; };
  const f=mk(); ok(f && f.d===60 && f.it.length===5 && f.it.every(x=>x===2) && f.it.reduce((a,b)=>a+b,0)===10,'visita perfeita: 2 garfos em cada um dos cinco itens, 10 no total ('+JSON.stringify(f)+')');
  ok(mk({ perdFila:1 }).it[0]===1 && mk({ perdFila:2 }).it[0]===0,'Recepção: 0 corações perdidos na fila 2; 1 perdido 1; mais 0');
  ok(mk({ hearts:4 }).it[1]===1 && mk({ hearts:3 }).it[1]===0 && mk({ hearts:1 }).it[1]===0,'Atendimento: 5 corações 2; 4 corações 1; menos 0');
  ok(mk({ pratoMain:{ rosa:false, crit:true, fria:false } }).it[2]===1 && mk({ pratoMain:{ rosa:false, crit:true, fria:true } }).it[2]===0 && mk({ pratoMain:{ rosa:false, crit:false, fria:false } }).it[2]===0 && mk({ pratoMain:null }).it[2]===0,'Prato: Prato da Rosa 2; caprichado e quente 1; o resto 0');
  ok(mk({ salaoSeg:3 }).it[3]===1 && mk({ salaoSeg:6 }).it[3]===1 && mk({ salaoSeg:6.5 }).it[3]===0,'Salão: 0 s 2; até 6 s 1; mais 0');
  ok(mk({ notaT:[5,5,5,null] }).it[4]===1 && mk({ notaT:[5,5,null,null] }).it[4]===0 && mk({ notaT:[null,null,null,null] }).it[4]===0,'Refeição: quatro tempos 2; três 1; menos 0');
  // bravo, da mesa ou da fila
  { const H=dia1(), g=H.g; const c=critico(H); g.angryLeave(c.grp); ok(g.ficha && g.ficha.it.every(x=>x===0),'bravo da mesa: a ficha inteira é 0'); }
  { const H=dia1(), g=H.g; comeca(H); const grp=g.spawn(g.schedule.find(x=>x.critico)); g.angryLeave(grp); ok(g.ficha && g.ficha.it.every(x=>x===0),'bravo da fila: a ficha inteira é 0'); }
  { const H=dia1(), g=H.g; comeca(H); const grp=g.spawn(g.schedule.find(x=>x.critico)); g.timeUpLeave(grp); ok(g.ficha && g.ficha.d===60,'a porta que fecha fecha a ficha também'); }
  // o Prato da Rosa de verdade
  { const H=dia1(), g=H.g; const c=critico(H); g.entregaPrato(c.grp,{ kind:'dish', table:c.t.id, group:c.grp, dish:'pf', crit:true, q:4, vip:true, tempo:1, casa:true, rosa:true },c.t); ok(c.grp.pratoMain && c.grp.pratoMain.rosa===true && c.grp.pratoMain.crit===true && c.grp.pratoMain.fria===false,'servir o principal guarda como veio (rosa, caprichado, frio)');
    const H2=dia1(), g2=H2.g; const c2=critico(H2); g2.entregaPrato(c2.grp,{ kind:'dish', table:c2.t.id, group:c2.grp, dish:'pf', crit:true, q:4, vip:true, tempo:0, casa:false },c2.t); ok(c2.grp.pratoMain===null,'a entrada não conta como prato'); }
  // os segundos de salão bagunçado só contam com ele sentado
  { const H=jogo(13,{ guia:GUIA(0,60), conversa:null, equipe:{ tonhao:3, anselmo:2 } }), g=H.g; const c=critico(H); const t2=g.tables.find(q=>q!==c.t && q.open); t2.dirty=true; t2.dirtyN=1; t2.sujaT=8; roda(g,2); ok(c.grp.salaoSeg>1.8 && c.grp.salaoSeg<2.3,'salão bagunçado com ele sentado: os segundos somam ('+c.grp.salaoSeg.toFixed(2)+')');
    const H2=jogo(13,{ guia:GUIA(0,60), conversa:null, equipe:{ tonhao:3, anselmo:2 } }), g2=H2.g; const c2=critico(H2); roda(g2,2); ok(c2.grp.salaoSeg===0,'salão em ordem: nada soma'); } }

// ---------- 6. o fim do dia da visita e a conversa (CA6) ----------
{ const H=dia1(), {g,L,els,doc}=H; comeca(H); fecha(H,FICHA(60,[2,1,0,2,1]));
  ok(g.result.critico && g.result.critico.it.join(',')==='2,1,0,2,1' && g.result.critico.real===true,'o resultado do dia traz a ficha da visita');
  g.setState('dayend'); const cr=doc.getElementById('end-critico'), t=txt(cr);
  ok(/O crítico esteve aqui/.test(t) && L.CRITICO.itens.every(n=>t.indexOf(n)>=0),'o cartão "O crítico esteve aqui" tem as cinco linhas');
  const lin=[]; const acha=(e)=>{ if((e.className||'')==='cr-lin') lin.push(e); (e.children||[]).forEach(acha); }; acha(cr);
  ok(lin.length===5 && !/\d/.test(t) && achaTag(cr,'CANVAS').length===10,'cinco linhas, dois garfinhos em cada, sem número nenhum');
  ok(lin.map(l=>l.getAttribute('aria-label')).join('|')==='Recepção: 2 de 2|Atendimento: 1 de 2|Prato: 0 de 2|Salão: 2 de 2|Refeição: 1 de 2','o leitor de tela lê quantos garfos cada linha ganhou');
  const H2=dia1({ guia:GUIA(0,70) }); comeca(H2); fecha(H2); H2.g.setState('dayend'); ok(txt(H2.doc.getElementById('end-critico')).trim()==='','sem visita, o cartão não aparece');
  // a conversa da 1ª visita: pendente, toca uma vez, antes dos resultados
  ok(g.save.convCrit==='pend','depois da 1ª visita, a conversa fica pendente');
  ok(L.HIST_CRITICO.falas.length===3 && L.HIST_CRITICO.falas[0].q==='dani' && L.HIST_CRITICO.falas[0].s==='Bia! Aquele freguês sozinho... ele tinha um caderninho!' && L.HIST_CRITICO.falas[2].s==='Era. E deixou a ficha da visita. Olha aí.','HIST_CRITICO: as três falas da spec');
  let fim=0; L.fluxoHistoria(()=>{ fim++; }); ok(g.conversa && g.conversa.falas===L.HIST_CRITICO.falas && fim===0,'o fim do dia toca a conversa antes de seguir'); passa(g);
  ok(g.save.convCrit===1 && fim===1,'e marca como vista'); let fim2=0; L.fluxoHistoria(()=>{ fim2++; }); const outra=!!g.conversa && g.conversa.falas===L.HIST_CRITICO.falas; passa(g); ok(!outra && g.save.convCrit===1,'não toca de novo');
  // a 2ª visita não tem conversa
  const H3=dia1({ guia:GUIA(1,60,[FICHA(57)]), convCrit:1 }); comeca(H3); fecha(H3,FICHA(60)); ok(H3.g.save.convCrit===1,'a 2ª visita não deixa conversa pendente'); }

// ---------- 7. o boato do Bráulio (CA7) ----------
{ const mk=(sv)=>{ const H=jogo(13,Object.assign({ guia:GUIA(1,60,[FICHA(57)]), conversa:null, capDia:50 },sv||{}),'terraco',{ imprevistos:true }); return H; };
  let dif=0, tudo=true, intro=true;
  for(let i=0;i<20;i++){ const H=mk(), g=H.g; g.startDay(60); const n1=g.schedule.length; if(g.clima!=='' || g.evento!=='') tudo=false; if(!g.visita || g.visita.n!==2 || !g.visita.boato) tudo=false; if(H.els['intro-manut'].textContent.indexOf(H.L.CRITICO.boato)<0) intro=false;
    g.divF=1; g.visita={ n:2, boato:true, real:true }; const m1=g.buildSchedule(g.day).length; g.visita=null; const m0=g.buildSchedule(g.day).length; dif=Math.max(dif,Math.abs(m1-m0*1.25)); }
  ok(tudo && dif<=1.6,'no dia da 2ª visita: sem clima nem evento, e os grupos são os do dia comum × 1,25 (±1; maior diferença '+dif.toFixed(2)+')');   // (a divulgação sorteia o movimento: fixada em 1 nos dois lados)
  ok(intro,'a introdução do dia traz o texto do boato');
  { const H=mk(), g=H.g, L=H.L; g.startDay(60); ok(L.introManut().indexOf(L.CRITICO.boato)===0,'o boato vem em primeiro lugar em introManut'); }
  // ganha do evento da semana, sem mexer no save.evento
  { const H=mk(), {g,L}=H; const k=Math.floor((60-L.EVENTOS.dia)/L.EVENTOS.semana); g.save.evento={ sem:k, d:60, ev:'jogo' }; const antes=JSON.stringify(g.save.evento); g.startDay(60); ok(g.evento==='' && JSON.stringify(g.save.evento)===antes,'o dia do boato ganha do evento de bairro, e o save.evento fica como estava'); }
  // a 1ª visita não tem boato nem muda o movimento
  { const H=jogo(13,{ guia:GUIA(0,60), conversa:null },'terraco',{ imprevistos:true }), g=H.g; g.startDay(60); ok(g.visita && g.visita.n===1 && !g.visita.boato && H.els['intro-manut'].textContent.indexOf(H.L.CRITICO.boato)<0,'a 1ª visita não tem boato'); } }

// ---------- 8. o comentário plantado (CA8) ----------
{ const H=jogo(12,{ conversa:'depois', capVezes:3, aval:Array(12).fill([4,4,4,4,4]), avalCom:[{ d:55, n:40, t:'Muito bom!', k:'estudante' }] }), {g,L}=H; const nota0=g.notaGurugol; g.avancaCap();
  const c=g.save.avalCom[g.save.avalCom.length-1]; ok(c && c.boato===1 && c.t===L.CRITICO.coment && c.n===10,'ao começar o cap. 13, o comentário de uma estrela entra no topo, marcado boato');
  ok(g.notaGurugol===nota0 && g.save.aval.length===12,'a nota geral não muda com ele');
  g.avancaCap=null; const t=loja(H,'gurugol'); ok(t.indexOf(L.CRITICO.coment)>=0,'ele aparece na lista do Gurugol');
  const dois=L.plantaBoato(L.plantaBoato([],60),61); ok(dois.filter(x=>x.boato).length===1,'só entra uma vez');
  const n2=L.normSave(JSON.parse(JSON.stringify(g.save))); ok(n2.avalCom.some(x=>x.boato===1),'e o save normalizado guarda o `boato`');
  // um dia depois: a nota do dia não conta o plantado
  const H2=dia1({ aval:Array(12).fill([4,4,4,4,4]), avalCom:L.plantaBoato([],60) }); comeca(H2); fecha(H2,FICHA(60)); ok(H2.g.save.avalCom.some(x=>x.boato) && H2.g.save.aval.length>=12 && H2.g.save.aval.every(r=>r.length===5),'o fim do dia mantém o comentário e não põe nota por causa dele'); }

// ---------- 9. o capítulo 13 e o save (CA9) ----------
{ const H=dia1(), {g,L}=H, c=L.HISTORIA[12];
  ok(L.HISTORIA.length===14 && c.cap===13 && c.titulo==='O crítico sem aviso' && c.ponto==='terraco' && c.obj.critico===2 && c.antes.length===5 && c.depois.length===5,'HISTORIA[12]: cap. 13, "O crítico sem aviso", obj { critico:2 }, 5 falas antes e 5 depois');
  ok(c.antes[0].s==='O crítico do Michelzão não usa crachá. Senta, come e anota.' && c.antes[3].nota==='olhando o Gurugol' && c.depois[3].nota==='lendo um cartão' && c.depois[4].s==='A noite da estrela!' && c.fim===undefined,'(os textos da spec; v10.10: o cap. 13 não tem mais cartão de fim)');
  ok(L.HISTORIA[11].fim===undefined,'o cap. 12 não mostra mais cartão de fim');
  let ob=g.capObj(); ok(ob.itens.length===1 && ob.itens[0].txt==='Receber o crítico do Michelzão 2 vezes (0 de 2)' && !ob.itens[0].ok,'o objetivo: "Receber o crítico do Michelzão 2 vezes (0 de 2)"');
  comeca(H); fecha(H,FICHA(60,[0,0,0,0,0])); ok(g.save.guia.n===1 && !g.result.cap.ok && /\(1 de 2\)/.test(g.result.cap.itens[0].txt) && g.save.conversa===null,'a 1ª visita soma 1 e não cumpre o capítulo');
  g.save.guia.prox=g.save.dia; g.startDay(g.save.dia); ok(g.visita && g.visita.n===2,'(a 2ª visita)'); fecha(H,FICHA(g.day.n,[0,0,0,0,0]));
  ok(g.save.guia.n===2 && g.result.cap.ok && g.save.conversa==='depois','a 2ª visita cumpre o capítulo, qualquer que seja a ficha (ficha 0 no total)');
  // o fim do capítulo: a conversa de depois e o cartão
  let fim=0; L.fluxoHistoria(()=>{ fim++; }); passa(g); ok(g.save.cap===14,'as falas de depois passam e o capítulo acaba (cap='+g.save.cap+')');
  ok(g.save.conversa===null && g.save.cap===14,'(v10.10: sem cartão de fim; a conversa de antes do cap. 14 toca direto)');
  // o save: a v10.8 no Fim (cap 13, capV 3) começa o 13
  const a=L.normSave({ histV:1, capV:3, cap:13, dia:70, bank:4000, capDia:50, capVezes:2, conversa:null, salao:{ ponto:'terraco' } });
  ok(a.cap===13 && a.conversa==='antes' && a.capDia===70 && a.capVezes===0 && a.capV===6 && a.guia && a.guia.n===0 && a.guia.prox-70>=1 && a.guia.prox-70<=3 && a.avalCom.some(x=>x.boato),'save da v10.8 no Fim (capV 3, cap 13) no Terraço: começa o 13 com a conversa de antes, a 1ª visita sorteada e o comentário');
  ok(JSON.stringify(L.normSave(JSON.parse(JSON.stringify(a))))===JSON.stringify(a),'e normalizar de novo não muda nada');
  const b=L.normSave({ histV:1, capV:4, cap:13, dia:70, conversa:null, guia:GUIA(1,72,[FICHA(68,[1,2,1,2,1])]), convCrit:1, salao:{ ponto:'terraco' } }); ok(b.cap===13 && b.conversa===null && b.guia.n===1 && b.guia.prox===72 && b.guia.v[0].it.join('')==='12121' && b.convCrit===1,'o save já na v10.9 segue como veio');
  const bad=v=>L.normSave({ histV:1, capV:4, cap:12, dia:70, conversa:null, guia:v, salao:{ ponto:'terraco' } }).guia;
  ok(bad(GUIA(3,5))===null && bad(GUIA(1,-2))===null && bad({ n:1, prox:5, v:[{ d:3, it:[1,2,3,0,0] }] })===null && bad({ n:1, prox:5, v:[{ d:3, it:[1,2] }] })===null && bad({ n:0, prox:5, v:[1,2,3] })===null && bad('x')===null && bad(undefined)===null && bad(GUIA(2,0,[FICHA(1),FICHA(2)])).n===2,'save.guia: inválido apaga (n de 0 a 2, prox ≥ 0, até 2 fichas de 5 inteiros de 0 a 2)');
  ok(L.normSave({ histV:1, capV:4, cap:13, dia:70, conversa:null, convCrit:'pend', salao:{ ponto:'terraco' } }).convCrit==='pend' && L.normSave({ histV:1, capV:4, cap:13, convCrit:'x', salao:{ ponto:'terraco' } }).convCrit===0,'save.convCrit: 0, pend ou 1');
  const cc=L.normSave({ histV:1, capV:4, cap:13, dia:70, conversa:null, salao:{ ponto:'terraco' } }); ok(cc.guia && cc.guia.n===0,'save no cap. 13 sem sorteio (ou apagado por estar inválido) sorteia a 1ª visita'); }

// ---------- 10. o modo dev (CA10) ----------
{ const H=nova({ store:{ lcc2_dev:'1' }, imprevistos:true }), {g,L,els,doc}=H; g.setDev(true); g.devReal(true); g.setState('menu');
  ok(g.devCapitulo(13) && g.save.cap===13 && g.save.salao.ponto==='terraco' && g.save.conversa==='antes' && g.save.dia===64 && g.save.bank===10000 && g.save.rosa===1 && g.save.camiCursos.gerente===1 && g.save.equipe.cami===5,'o capítulo 13 da lista: Terraço, dia 64, caixa 10000, com o molho e a gerência, e a conversa de antes');
  ok(g.save.guia && g.save.guia.n===0 && g.save.avalCom.some(x=>x.boato),'o 13 da lista traz o sorteio da 1ª visita e o comentário plantado');
  ok(g.devCapitulo(15) && g.save.cap===15 && g.save.conversa===null && g.capObj()===null,'o Fim agora é o 15 (v10.10)');
  ok(L.DEV_CAPS.length===15,'DEV_CAPS: 15 linhas');
  // forçar: 'Hoje' e 'Hoje com boato', em qualquer ponto e capítulo, sem mexer no save.guia
  g.devCapitulo(4); g.save.conversa=null; const guia0=JSON.stringify(g.save.guia);
  ok(g.devForca('critico','hoje') && L.DEV.forca.critico==='hoje','Crítico: Hoje');
  g.startDay(g.save.dia); ok(g.visita && g.visita.n===1 && !g.visita.boato && g.visita.real===false && g.schedule.filter(s=>s.critico).length===1,'"Hoje" traz o crítico no dia que começa (cap. 4, Garagem)');
  g.devForca('critico','boato'); g.startDay(g.save.dia+1); const hf=g.save.dia+1; ok(g.visita && g.visita.n===2 && g.visita.boato && g.clima==='' && g.evento==='' && els['intro-manut'].textContent.indexOf(L.CRITICO.boato)>=0,'"Hoje com boato" traz o boato, sem clima nem evento');
  ok(JSON.stringify(g.save.guia)===guia0,'sem mexer no save.guia');
  els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.ficha={ d:g.day.n, it:[2,2,2,2,2] }; const sv0=JSON.stringify(g.save.guia); g.finishDay(); ok(g.result.critico && g.result.critico.real===false && JSON.stringify(g.save.guia)===sv0,'a ficha aparece no fim do dia e não é guardada');
  g.devForca('critico',''); g.startDay(g.save.dia); ok(g.visita===null,'"Sorteio" volta ao normal');
  L.abrirDev(); L.DEV.aba='hoje'; L.buildDev(); const dv=txt(doc.getElementById('dev-body')||{}); ok(/Crítico \(em qualquer ponto\)/.test(dv) && /Hoje com boato/.test(dv),'a aba Hoje traz a linha Crítico: Sorteio | Hoje | Hoje com boato');
  ok(L.devCenas().some(c=>c.falas===L.HIST_CRITICO.falas),'a conversa da 1ª visita está nas cenas do modo dev'); }

// ---------- 11. o Manual (CA11) ----------
{ const H=dia1({ manual:[] }), {g,L}=H; const f1=L.MANUAL.find(f=>f.id==='i-critico'), f2=L.MANUAL.find(f=>f.id==='i-boato');
  ok(f1 && f1.aba==='imprevistos' && f1.nome==='Crítico do Michelzão' && f1.linha==='Chega sem avisar, sozinho, e anota tudo num caderninho. Repara na espera, no atendimento, no prato, no salão e na refeição do começo ao fim.','a ficha i-critico');
  ok(f2 && f2.aba==='imprevistos' && f2.nome==='Boato' && f2.linha==='Alguém espalha que hoje tem coisa de graça, e a casa lota.','a ficha i-boato');
  ok(!/\d/.test(f1.linha+f2.linha),'sem número nas fichas');
  ok(g.save.manual.indexOf('i-critico')<0 && g.save.manual.indexOf('i-boato')<0,'(as duas fechadas no começo)');
  comeca(H); ok(g.save.manual.indexOf('i-critico')<0,'a ficha não abre no começo do dia (a visita é surpresa)');
  fecha(H,FICHA(60)); ok(g.save.manual.indexOf('i-critico')>=0 && g.save.manual.indexOf('i-boato')<0 && g.manualDia.indexOf('i-critico')>=0,'i-critico abre no fim do dia da 1ª visita (e entra no "Novo no Manual")');
  const H2=dia1({ guia:GUIA(1,60,[FICHA(57)]), manual:[] }); comeca(H2); fecha(H2,FICHA(60)); ok(H2.g.save.manual.indexOf('i-boato')>=0,'i-boato abre no fim do dia do boato');
  const H3=dia1({ guia:GUIA(0,70), manual:[] }); comeca(H3); fecha(H3); ok(H3.g.save.manual.indexOf('i-critico')<0 && H3.g.save.manual.indexOf('i-boato')<0,'sem visita, nenhuma das duas abre'); }

console.log('smoke74: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
