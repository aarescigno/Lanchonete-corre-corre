// v12.1 (etapa 13b): os quatro desafios novos: Festa junina, Jogo do Brasil, Noite do crítico e VIPs exigentes (o motor, a tela e o save são os da v12, no smoke97).
// CA1 a CA4 (a calibração é o balance.js com DESAFIO=<id>; o que se vê, o shot_v12_1.js; a tela nos 14 tamanhos, o menu_fit.py).
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const html=fs.readFileSync('../lanchonete.html','utf8');
const IDS=['soBia','semBravo','efood','junina','jogo','critico','vips'];
// o save de quem já viu o Fim da história (cap 15), no Terraço, com a carreira andada
const FIMSAVE={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1 };
const mk=(extra,opts)=>{ const sv=Object.assign({},FIMSAVE,extra||{}); return load(Object.assign({ store:{ lcc2_save:JSON.stringify(sv) }, historia:true },opts||{})); };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const ch=(els,id)=>(els[id]||{children:[]}).children;

// ---------- CA1: a lista com os sete, na ordem, com os campos e valores das tabelas; a tela com sete cartões ----------
bloco('CA1',()=>{ const {L}=load(), D=L.DESAFIOS, por=id=>D.find(x=>x.id===id);
  ok(Array.isArray(D) && D.map(x=>x.id).join()===IDS.join(),'CA1: DESAFIOS tem os sete, na ordem (soBia, semBravo, efood, junina, jogo, critico, vips)');
  const a=por('junina'), b=por('jogo'), c=por('critico'), d=por('vips');
  ok(a && b && c && d,'CA1: os quatro novos existem');
  ok(a.nome==='Festa junina' && a.cap===8 && a.dia===38 && a.mod.evento==='junina' && !a.cond,'CA1: Festa junina: cap 8 (Avenida), dia 38, evento junina, sem cond');
  ok(b.nome==='Jogo do Brasil' && b.cap===5 && b.dia===17 && b.mod.evento==='jogo' && b.mod.up.join()==='tvs' && b.mod.tvs===1 && !b.cond,'CA1: Jogo do Brasil: cap 5 (área industrial), dia 17, evento jogo, up tvs, tvs 1, sem cond');
  ok(c.nome==='Noite do crítico' && c.cap===13 && c.dia===64 && c.mod.critico===true && typeof c.cond==='function','CA1: Noite do crítico: cap 13 (Terraço), dia 64, critico true, com cond');
  ok(d.nome==='VIPs exigentes' && d.cap===13 && d.dia===64 && d.mod.vip===1 && typeof d.cond==='function','CA1: VIPs exigentes: cap 13 (Terraço), dia 64, vip 1, com cond');
  ok([a,b].every(x=>x.mod.groups===0.55 && x.mod.meta>=1.5 && x.mod.meta<=3) && [c,d].every(x=>x.mod.groups>=0.4 && x.mod.groups<=1.4 && x.mod.meta>=0.6 && x.mod.meta<=1.5),'CA1: festa e jogo com groups 0,55 e meta de 1,5 a 3; crítico e VIPs com groups de 0,4 a 1,4 e meta de 0,6 a 1,5 ('+[a,b,c,d].map(x=>x.mod.groups+'/'+x.mod.meta).join(' ')+')');
  ok(Math.min(a.mod.groups,b.mod.groups)>Math.max(c.mod.groups,d.mod.groups),'CA1: a junina e o jogo ficam com o groups acima do crítico e dos VIPs (seguem os dias mais cheios)');
  ok(a.aviso==='Festa junina lotada: o bairro inteiro veio!' && b.aviso==='Jogo do Brasil e a casa cheia de torcedor!' && c.aviso==='O crítico do Michelzão vem hoje. Ninguém sabe qual mesa é a dele.' && d.aviso==='Hoje só vem gente exigente.','CA1: os quatro avisos');
  ok(c.falhou==='O crítico não saiu com todos os corações.' && d.falhou==='Uma mesa saiu descontente.' && !a.falhou && !b.falhou,'CA1: os falhou (só o crítico e os VIPs têm)');
  ok(c.cond({criticoH:5,lost:0})===true && c.cond({criticoH:4,lost:0})===false && c.cond({criticoH:0,lost:1})===false && c.cond({criticoH:5,lost:3})===true,'CA1: a cond do crítico vale com 5 corações; falha com 4 ou com ele bravo (0)');
  ok(d.cond({lost:0,saiMin:5})===true && d.cond({lost:0,saiMin:4})===true && d.cond({lost:0,saiMin:3})===false && d.cond({lost:1,saiMin:5})===false,'CA1: a cond dos VIPs vale com 4 corações ou mais e ninguém bravo; falha com 3 ou com bravo');
  const f=L.MANUAL.filter(x=>x.aba==='desafios');
  ok(f.map(x=>x.id).join()==='d-soBia,d-semBravo,d-efood,d-junina,d-jogo,d-critico,d-vips','CA1: a aba "Desafios" do Manual tem as sete fichas, as quatro novas no fim');
  const fj=id=>f.find(x=>x.id===id)||{};
  ok(fj('d-junina').nome==='Festa junina' && fj('d-junina').linha==='A festa junina na Avenida, com mais gente que nunca e a meta lá em cima.','CA1: a ficha d-junina');
  ok(fj('d-jogo').nome==='Jogo do Brasil' && fj('d-jogo').linha==='O dia do jogo na área industrial: antes e depois, casa cheia; durante, rua vazia. A meta é alta.','CA1: a ficha d-jogo');
  ok(fj('d-critico').nome==='Noite do crítico' && fj('d-critico').linha==='Um dia no Terraço com o crítico à mesa. Ele tem de sair com todos os corações.','CA1: a ficha d-critico');
  ok(fj('d-vips').nome==='VIPs exigentes' && fj('d-vips').linha==='Um dia no Terraço só de clientes exigentes. Toda mesa tem de sair feliz.','CA1: a ficha d-vips');
  ok(f.every(x=>!/\d/.test(x.linha)),'CA1: as fichas não têm número');
  ok(JSON.stringify(L.normDesafios({ junina:3, jogo:2, critico:1, vips:0, xx:3 }))==='{"junina":3,"jogo":2,"critico":1,"vips":0}','CA1: o normDesafios aceita os ids novos (estão na DESAFIOS)');
  ok(/Mais quatro desafios: a festa junina lotada, o jogo do Brasil, a noite do crítico e os VIPs exigentes\./.test(html) && /<li><b>v12\.1<\/b><span class="cur">versão atual<\/span>/.test(html) && L.VERSAO==='v12.1' && /id="vtag"[^>]*>v12\.1</.test(html),'CA1: VERSAO e vtag em v12.1 e a linha da v12.1 no #ov-ver'); });
bloco('CA1 (tela)',()=>{
  { const {L,els,g}=mk(); L.buildMenu(); els['btn-desafios'].fire('click');
    const cartoes=todos(els['desafios-grid'],n=>n.getAttribute && n.getAttribute('data-desafio'));
    ok(cartoes.length===7 && cartoes.map(c=>c.getAttribute('data-desafio')).join()===IDS.join(),'CA1: a tela mostra sete cartões, na ordem');
    const qs=todos(els['desafios-grid'],n=>(n.className||'').split(' ').indexOf('qm')>=0);
    ok(qs.length===7 && qs.slice(3).map(q=>q.getAttribute('data-ficha')).join()==='d-junina,d-jogo,d-critico,d-vips','CA1: cada cartão novo tem o "?" com a ficha dele');
    ok(['d-junina','d-jogo','d-critico','d-vips'].every(id=>g.save.manual.indexOf(id)>=0),'CA1: as quatro fichas novas são reveladas quando o botão aparece');
    const rot=c=>todos(c,n=>n.tagName==='BUTTON' && (n.className||'').split(' ').indexOf('qm')<0)[0];
    ok(rot(cartoes[5]).getAttribute('aria-label')==='Noite do crítico, sem medalha','CA1: o leitor de tela lê "Noite do crítico, sem medalha"'); }
  { const {L,els,g}=mk(); g.setDev(true); g.devReal(true); L.abrirDev(); L.DEV.aba='pular'; L.buildDev();
    const bt=()=>todos(els['dev-body'],n=>n.tagName==='BUTTON'), acha=t=>bt().find(b=>b.textContent===t);
    acha('Ouro em todos').fire('click'); ok(IDS.every(id=>g.save.desafios[id]===3),'CA1: no modo dev, "Ouro em todos" põe 3 nos sete');
    acha('Zerar').fire('click'); ok(JSON.stringify(g.save.desafios)==='{}','CA1: "Zerar" limpa os sete'); } });

// ---------- CA2: a Festa junina e o Jogo do Brasil ----------
bloco('CA2',()=>{
  // a Festa junina: o evento do dia, forçado, e a barraca montada
  [false,true].forEach(mut=>{ const {g,L,store}=mk(), antes=store.lcc2_save; L.MANUT.on=mut; g.startDesafio('junina');
    ok(g.evento==='junina' && g.ponto.id==='avenida' && g.day.n===38,'CA2: junina (MANUT '+(mut?'ligado':'desligado')+'): o evento do dia é a festa junina, na Avenida, no dia 38');
    ok(g.barracaOn===true && g.save.barraca===g.day.n,'CA2: junina: a barraca já vem montada (barracaOn)');
    ok(g.clima==='' && g.quebras.length===0 && g.fiscal===null && g.visita===null && g.noite===false && !g.save.manut.sorteio,'CA2: junina: continua sem clima, quebra, fiscal, crítico, noite nem sorteio');
    ok(store.lcc2_save===antes && !g.salvo.barraca && !g.salvo.evento,'CA2: junina: o save de verdade (e o localStorage) não ganha barraca nem evento'); });
  { const {g,L}=mk(); g.startDesafio('junina'); g.begin();
    let pj=0,tot=0; for(let i=0;i<80;i++){ const x=g.spawn({ type:'familia', color:0, vip:false, av:false }); tot++; if(x.extras.concat([x.dish]).some(k=>L.EVENTOS.junina.pratos.indexOf(k)>=0)) pj++; g.groups=[]; }
    ok(pj>0,'CA2: junina: com a barraca, os pedidos trazem pamonha, milho ou canjica ('+pj+' de '+tot+' famílias)');
    const g2=mk().g; g2.startDesafio('semBravo'); g2.begin(); let pj2=0; for(let i=0;i<80;i++){ const x=g2.spawn({ type:'familia', color:0, vip:false, av:false }); if(x.extras.some(k=>L.EVENTOS.junina.pratos.indexOf(k)>=0)) pj2++; g2.groups=[]; }
    ok(pj2===0,'CA2: (controle) Ninguém bravo, no mesmo ponto, não tem prato junino'); }
  { const {g}=mk(), fam=id=>{ g.startDesafio(id); let f=0,t=0; for(let i=0;i<150;i++) g.buildSchedule(g.day).forEach(s=>{ t++; if(s.type==='familia') f++; }); return f/t; };
    const fj=fam('junina'), fs=fam('semBravo'); ok(fj>fs,'CA2: junina: há mais famílias que no dia comum da Avenida ('+Math.round(100*fj)+'% contra '+Math.round(100*fs)+'%)'); }
  // o Jogo do Brasil: o evento, a TV ligada com anúncios e o gol sorteado
  [false,true].forEach(mut=>{ const {g,L,store}=mk(), antes=store.lcc2_save; L.MANUT.on=mut; g.startDesafio('jogo');
    ok(g.evento==='jogo' && g.ponto.id==='industrial' && g.day.n===17,'CA2: jogo (MANUT '+(mut?'ligado':'desligado')+'): o evento do dia é o jogo, na área industrial, no dia 17');
    ok(g.up.tvs===true && g.save.equipe.tvs===1 && g.tvLigada===true && g.ambienteEv>0,'CA2: jogo: as TVs instaladas e ligadas com anúncios (tvLigada, e o ambiente do jogo vale)');
    const WJ=g.day.time*g.day.speed; ok(g.gol>=0.45*WJ-1e-6 && g.gol<=0.55*WJ+1e-6 && !g.golFeito,'CA2: jogo: o gol sorteado entre 45% e 55% da janela de chegadas ('+Math.round(g.gol)+' s de '+Math.round(WJ)+')');
    ok(g.clima==='' && g.quebras.length===0 && g.fiscal===null && g.visita===null && g.noite===false && !g.save.manut.sorteio,'CA2: jogo: sem clima, quebra, fiscal, crítico, noite nem sorteio');
    ok(store.lcc2_save===antes && !g.salvo.evento && !g.salvo.up.tvs,'CA2: jogo: o save de verdade (e o localStorage) não ganha evento nem TVs'); });
  { const {g}=mk(); g.startDesafio('jogo'); g.begin(); g.schedule=[]; g.nextIdx=0;
    const seat=(h)=>{ const grp=g.spawn({ type:'familia', color:0, vip:false, av:false }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantOrder'); grp.hearts=h; return grp; };
    const a=seat(3); g.gol=g.elapsed+0.5; roda(g,0.4); ok(!g.golFeito,'CA2: jogo: antes do momento sorteado, nada acontece'); roda(g,0.3);
    ok(g.golFeito && g.stats.gol===1 && a.hearts>=4,'CA2: jogo: no momento do gol, stats.gol = 1 e quem estava sentado ganhou 1 coração ('+a.hearts+')'); }
  { const {g}=mk(); g.startDesafio('jogo'); const T=g.day.time*g.day.speed; let meio=0,tot=0; for(let k=0;k<40;k++){ const sc=g.buildSchedule(g.day).filter(s=>s.type!=='encomenda'); tot+=sc.length; meio+=sc.filter(s=>s.t>0.35*T && s.t<0.65*T).length; }
    ok(meio/tot<=0.12,'CA2: jogo: só '+Math.round(meio/tot*1000)/10+'% das chegadas caem entre 35% e 65% da janela (≤ 12%: antes e depois, casa cheia; durante, rua vazia)');
    ok(g.apito===null,'CA2: jogo: a fábrica não apita'); }
  // os desafios antigos continuam sem evento
  { const {g}=mk(); ['soBia','semBravo','efood','critico','vips'].forEach(id=>{ g.startDesafio(id); ok(g.evento==='','CA2: '+id+': sem evento'); }); } });

// ---------- CA3: a Noite do crítico ----------
bloco('CA3',()=>{
  const {g,L,els,store}=mk(), antes=store.lcc2_save; L.MANUT.on=true; g.startDesafio('critico');
  ok(g.ponto.id==='terraco' && g.day.n===64 && g.desafio.id==='critico','CA3: critico no Terraço, no dia 64');
  ok(g.visita && g.visita.n===1 && g.visita.boato===false && g.noite===false,'CA3: começa com a 1ª visita do crítico, sem boato ('+JSON.stringify(g.visita)+')');
  ok(g.schedule.filter(s=>s.critico).length===1 && g.schedule.filter(s=>s.critico)[0].type===L.CRITICO.tipo && g.schedule.filter(s=>s.critico)[0].disfarce===true,'CA3: exatamente um grupo é o crítico, sozinho e disfarçado');
  const base=g.diaPonto(L.diaOf(g.desafio.dia)); ok(Math.abs(g.day.groups-base.groups*g.desafio.mod.groups)<1e-9,'CA3: sem boato, o movimento é só o do mod.groups (nada de "casa lotada")');
  ok(g.clima==='' && g.quebras.length===0 && g.fiscal===null && !g.save.manut.sorteio && g.conversa===null,'CA3: sem clima, quebra, fiscal, sorteio nem conversa');
  ok(store.lcc2_save===antes,'CA3: o localStorage fica como estava');
  let todosCrit=true; for(let i=0;i<30;i++){ g.startDesafio('critico'); if(!g.visita || g.schedule.filter(s=>s.critico).length!==1) todosCrit=false; }
  ok(todosCrit,'CA3: em 30 dias montados, sempre com o crítico');
  // outros desafios, nunca crítico
  ['soBia','semBravo','efood','junina','jogo','vips'].forEach(id=>{ g.startDesafio(id); if(g.visita!==null || g.schedule.some(s=>s.critico)) ok(false,'CA3: '+id+' não devia ter o crítico'); }); ok(true,'CA3: os outros seis desafios seguem sem crítico');
  // como o grupo dele sai: corações e bravo
  const D=g.desafio=L.DESAFIOS.find(x=>x.id==='critico');
  const sai=(h)=>{ g.startDesafio('critico'); g.begin(); const s=g.schedule.find(x=>x.critico), grp=g.spawn(s), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); grp.hearts=h; g.collectBill(grp,t); return g.stats; };
  let st=sai(5); ok(st.criticoH===5 && D.cond(st)===true,'CA3: o crítico paga com 5 corações: a cond vale (criticoH '+st.criticoH+')');
  st=sai(4); ok(st.criticoH===4 && D.cond(st)===false,'CA3: com 4 corações a cond falha');
  { g.startDesafio('critico'); g.begin(); const s=g.schedule.find(x=>x.critico), grp=g.spawn(s), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); grp.hearts=0; g.angryLeave(grp);
    ok(g.stats.criticoH===0 && D.cond(g.stats)===false,'CA3: se o crítico vai embora bravo, a cond falha'); }
  { g.startDesafio('critico'); g.begin(); ok(g.stats.criticoH===0 && D.cond(g.stats)===false,'CA3: um dia em que o crítico não saiu (nem sentou) não vale'); }
  // o fim do dia: a medalha vem pelas estrelas e pela cond
  { g.startDesafio('critico'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.expert; g.stats.lost=0; g.stats.criticoH=4; g.finishDay();
    ok(g.desafioRes.medalha===0 && g.desafioRes.falhou===true,'CA3: com a expert batida mas o crítico com 4 corações, a medalha é 0 e o falhou aparece'); }
  { g.sairDesafio(); g.startDesafio('critico'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.expert; g.stats.lost=0; g.stats.criticoH=5; g.finishDay();
    ok(g.desafioRes.medalha===3,'CA3: com a expert e o crítico com 5 corações, ouro'); }
  g.sairDesafio(); });

// ---------- CA4: os VIPs exigentes ----------
bloco('CA4',()=>{
  const {g,L,els,store}=mk(), antes=store.lcc2_save; g.startDesafio('vips');
  ok(g.ponto.id==='terraco' && g.day.n===64 && g.desafio.id==='vips' && g.visita===null,'CA4: vips no Terraço, no dia 64, sem crítico');
  ok(g.vipChance(g.day)===1,'CA4: a chance de VIP de cada grupo é 1');
  let tudoVip=true, n=0; for(let k=0;k<40;k++) g.buildSchedule(g.day).forEach(s=>{ n++; if(!s.vip) tudoVip=false; });
  ok(tudoVip && n>0,'CA4: em 40 dias sorteados, todo grupo da programação é VIP ('+n+' grupos)');
  { g.begin(); let ex=true; for(let i=0;i<20;i++){ const s=g.schedule[i%g.schedule.length], x=g.spawn(s); if(!x.vip || !x.exigente) ex=false; g.groups=[]; } ok(ex,'CA4: todo grupo é VIP exigente (no Terraço todo VIP é exigente)'); }
  ok(g.clima==='' && g.quebras.length===0 && g.fiscal===null && !g.save.manut.sorteio && g.conversa===null && store.lcc2_save===antes,'CA4: sem imprevisto, sem conversa, e o localStorage fica como estava');
  // os outros desafios não são só de VIP
  { g.startDesafio('semBravo'); let v=0,t=0; for(let k=0;k<20;k++) g.buildSchedule(g.day).forEach(s=>{ t++; if(s.vip) v++; }); ok(g.vipChance(g.day)<1 && v/t<0.8,'CA4: (controle) Ninguém bravo não é de VIPs ('+Math.round(100*v/t)+'%)'); }
  // a cond e o menor número de corações com que um grupo sai
  const D=L.DESAFIOS.find(x=>x.id==='vips');
  const paga=(h)=>{ const s=g.schedule.find(x=>x.vip), grp=g.spawn(s), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); grp.hearts=h; g.collectBill(grp,t); return grp; };
  g.startDesafio('vips'); g.begin(); ok(g.stats.saiMin===5 && D.cond(g.stats)===true,'CA4: no começo, ninguém saiu: saiMin 5');
  paga(5); ok(g.stats.saiMin===5 && D.cond(g.stats)===true,'CA4: uma mesa com 5 corações: a cond vale');
  paga(4); ok(g.stats.saiMin===4 && D.cond(g.stats)===true,'CA4: uma mesa com 4 corações: ainda vale (saiMin 4)');
  paga(5); ok(g.stats.saiMin===4,'CA4: uma mesa melhor depois não apaga a pior');
  paga(3); ok(g.stats.saiMin===3 && D.cond(g.stats)===false,'CA4: uma mesa com 3 corações: a cond falha');
  { g.startDesafio('vips'); g.begin(); const s=g.schedule.find(x=>x.vip), grp=g.spawn(s), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); grp.hearts=0; g.angryLeave(grp);
    ok(g.stats.lost===1 && D.cond(g.stats)===false,'CA4: um grupo bravo: a cond falha'); }
  { g.sairDesafio(); g.startDesafio('vips'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.expert; g.stats.lost=0; g.stats.saiMin=3; g.finishDay();
    ok(g.desafioRes.medalha===0 && g.desafioRes.falhou===true,'CA4: com a expert batida mas uma mesa com 3 corações, a medalha é 0'); }
  { g.sairDesafio(); g.startDesafio('vips'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.expert; g.stats.lost=0; g.stats.saiMin=4; g.finishDay();
    ok(g.desafioRes.medalha===3,'CA4: com a expert e todas as mesas com 4 corações ou mais, ouro'); }
  g.sairDesafio(); });

console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
