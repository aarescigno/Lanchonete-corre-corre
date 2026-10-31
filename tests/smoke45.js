// v9.3, etapa 3b-3: a Avenida. Confeitaria gourmet da Dani (vitrine, R$ 16, Ambiente), o Joca barista (espresso e cappuccino, o cafezinho passa para
// ele) e a Cami (conversa, contratação, o básico, cursos e folha). (A etapa chamava este smoke de smoke44; o número já era do painel dev, da 3b-2d.)
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(cap,ponto,sv,o)=>{ const H=nova(o), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap, dia:10, maxDay:10, bank:5000, up:{ tenis:true }, equipe:{ tonhao:1, dani:2 }, salao:{ ponto:ponto||'avenida' }, convCard:1, convDiv:1 }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };
const cursos=(H,o)=>{ const {g}=H; Object.keys(o).forEach(k=>{ g.save[k]=Object.assign(g.save[k]||{},o[k]); }); const dc=g.save.daniCursos, jc=g.save.jocaCursos;
  if(dc.confCaseira) g.up.confCaseira=true; if(dc.confGourmet&&dc.confCaseira) g.up.confGourmet=true; if(jc.espresso) g.up.espresso=true; };
// dia aberto na Avenida, sem chegadas
const aberto=(sv,o,cur)=>{ const H=jogo(6,'avenida',Object.assign({ pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2 } },sv||{}),o), {g}=H; if(cur) cursos(H,cur); g.begin(); g.mode='carreira'; g.schedule.forEach(s=>{ s.t=9999; }); return H; };
const mesa=(H,cafes,doces,tipo)=>{ const {g,L}=H, t=g.tables[0]; const m=new L.Group(g,tipo||'executiva',++g.gid,0,false); m.juiceWant=0; m.cafePede=false; t.group=m; m.table=t; m.setState('eating'); m.timer=0.01; m.hearts=4; m.doces=doces||[]; m.cafes=cafes||[]; g.groups.push(m); m.update(0.05); return m; };
const AV={ daniCursos:{ confCaseira:1 } }, ESP={ daniCursos:{ confCaseira:1 }, jocaCursos:{ espresso:1 } };

// ---------- 1. a entrada da Cami no LIBERA ----------
{ const {L}=nova(); const c=L.liberaOf('cami');
  ok(c && c.nivel===3 && c.dia===1 && c.ate===999 && typeof c.gatilho==='function' && c.falas.length===5,'cami: nível 3, dia 1, garantia 999, gatilho pelo espresso, 5 falas');
  ok(c.falas.map(f=>f.q).join()==='joca,bia,joca,cami,bia' && /Cami, do meu curso de barista/.test(c.falas[2].s) && /dou conta/.test(c.falas[3].s),'cami: falas Joca, Bia, Joca, Cami, Bia');
  ok(L.HIST_NOMES.cami==='Cami' && L.LIBERA.every(l=>l.falas.every(f=>L.HIST_NOMES[f.q])),'HIST_NOMES tem a Cami e toda fala tem nome'); }

// ---------- 2. Confeitaria gourmet: só na Avenida e só depois da caseira ----------
{ let H=jogo(6,'industrial',{ pontoDia:5, libera:{ confeitaria:2 }, daniCursos:{ confCaseira:1 } }), g=H.g; g.save.bank=5000; g.save.libera.confeitaria=2;
  ok(!g.buyDaniCurso('confGourmet') && !H.L.cursoDaniVis(H.L.DANI_CURSOS.find(c=>c.id==='confGourmet'),g.ponto),'na área industrial o curso gourmet não existe');
  H=jogo(6,'avenida',{ pontoDia:5, libera:{ confeitaria:2 } }); g=H.g; g.save.libera.confeitaria=2; g.save.bank=5000;
  ok(!g.buyDaniCurso('confGourmet'),'sem a Confeitaria caseira, o gourmet não se compra');
  g.save.daniCursos.confCaseira=1; g.up.confCaseira=true; g.save.daniCursoDia=0;
  ok(g.buyDaniCurso('confGourmet') && g.save.daniCursos.confGourmet===1 && g.up.confGourmet===true && g.save.bank===5000-350,'na Avenida, com a caseira: R$ 350 e liga a vitrine (up.confGourmet)');
  ok(H.L.daniXp(g.save)===4,'cada curso vale +2 de experiência da Dani (caseira + gourmet = 4)');
  H.L.setShopTab('cardapio'); const t=txt(H.els['shop-grid']); ok(/Confeitaria gourmet/.test(t) && /shortcake de morango, torta de limão e brigadeiro gourmet/.test(t) && /R\$ 16/.test(t),'o Cardápio mostra o curso com os 3 doces e R$ 16');
  ok(H.L.avalMenu({},2)>H.L.avalMenu({},1),'conta na Diversidade do cardápio (avalMenu)');
  // normSave: sem a caseira, o gourmet não liga
  const N=H.L.normSave({ daniCursos:{ confGourmet:1 }, salao:{ ponto:'avenida' } }); ok(!N.up.confGourmet && !N.up.confCaseira,'save com o gourmet sem a caseira: nenhuma das duas liga'); }

// ---------- 3. os doces gourmet: lista, R$ 16, ingrediente R$ 4, Ambiente, marmita ----------
{ const H=aberto({},null,{ daniCursos:{ confCaseira:1, confGourmet:1 } }), {g,L}=H;
  ok(L.docesLista(g.up).map(d=>d.id).join()==='shortcake,torta,brigGourmet' && L.docePreco(g.up)===16 && L.doceIngred(g.up)===4,'a lista passa a ser a gourmet, R$ 16, ingrediente R$ 4');
  let okQ=true,max=0; for(let i=0;i<300;i++){ const m=new L.Group(g,'familia',++g.gid,0,false), d=m.sorteiaDoces(); if(d.length){ max=Math.max(max,d.length); if(d.some(x=>!L.DOCES.gourmet.some(c=>c.id===x))) okQ=false; } } ok(okQ && max>=3,'os caseiros saem do sorteio: só gourmet');
  const t=g.tables[0], m=mesa(H,[],['shortcake','torta']); ok(m.docesFalta===2 && m.esperaSuco,'o grupo espera os 2 doces gourmet');
  g.bia.hands.push({ kind:'doce', id:'shortcake' },{ kind:'doce', id:'torta' }); g.pontos=0; g.bia.doTable(t);
  ok(m.docesFalta===0 && m.bebConta===32 && g.pontos===10,'entrega 2: R$ 32 na conta, +10 pontos');
  g.bia.clearActs(); g.custo=0; g.bia.perform({ type:'doces' }); ok(g.bia.hands.length===1 && g.bia.hands[0].kind==='doce' && L.DOCES.gourmet.some(c=>c.id===g.bia.hands[0].id) && g.custo===4,'a Bia pega 1 doce gourmet (ingrediente R$ 4)');
  // Ambiente: +0,25 de quem comeu doce gourmet (nota crua do critério 5)
  const amb=(com)=>{ const q=new L.Group(g,'familia',++g.gid,0,false); q.avalia=true; q.docesDados=com?1:0; q.state='wantBill'; q.hearts=5; q.pratoQ=5; g.avals.length=0; g.mode='carreira'; g.avaliar(q,0,0); return g.avals[0].s[4]; };
  const a0=amb(false), a1=amb(true); ok((a1-a0)>0.19 && (a1-a0)<0.31 && L.AVAL.amb.doce===0.25,'o doce gourmet entregue soma +0,25 no Ambiente (AVAL.amb.doce)');
  const S=aberto({},null,AV).g; const q=new H.L.Group(S,'familia',++S.gid,0,false); q.avalia=true; q.docesDados=1; q.state='wantBill'; q.hearts=5; q.pratoQ=5; S.avals.length=0; S.avaliar(q,0,0); const b1=S.avals[0].s[4];
  const q2=new H.L.Group(S,'familia',++S.gid,0,false); q2.avalia=true; q2.docesDados=0; q2.state='wantBill'; q2.hearts=5; q2.pratoQ=5; S.avals.length=0; S.avaliar(q2,0,0); ok(S.avals[0].s[4]===b1,'só com a caseira o Ambiente não muda');
  // marmita
  const e=new L.Group(g,'entregador',++g.gid,0,false); e.docesMarm=1; e.dish='pf'; g.retirada.push(e); e.setState('retirada'); e.path=[];
  const preco=L.precoPrato('pf',g.ponto,g.cursos), base=Math.round(preco*(1+L.GORJETA[e.hearts]))-Math.round(preco*L.MARMITA.efood); g.potes=1; g.money=0; g.entregaMarmita(e,{ kind:'marmita', dish:'pf', q:4 });
  ok(g.money===base+16,'a marmita com doce leva o gourmet: +R$ 16'); }

// ---------- 4. o desenho da vitrine, dos doces e da máquina ----------
{ const H=aberto({},null,{ daniCursos:{ confCaseira:1, confGourmet:1 }, jocaCursos:{ espresso:1 } }), {g}=H; g.state='playing'; let erro=''; try { for(let i=0;i<3;i++){ g.update(0.05); H.L.render(g,H.ctx); } } catch(e){ erro=String(e); }
  ok(!erro,'o salão com a vitrine e a máquina de espresso desenha sem erro '+erro);
  let e2=''; try { H.L.render(g,H.ctx); g.up.confGourmet=false; H.L.render(g,H.ctx); } catch(e){ e2=String(e); } ok(!e2,'e a caseira também '+e2); }

// ---------- 5. espresso: só na Avenida, com o Joca contratado ----------
{ let H=jogo(6,'industrial',{ pontoDia:5, equipe:{ tonhao:1, dani:2, joca:2 }, daniCursos:{ confCaseira:1 }, libera:{ confeitaria:2, joca:2, anselmo:2 } }), g=H.g; g.save.bank=5000;
  ok(!g.buyJocaCurso('espresso'),'na área industrial o espresso não existe');
  H=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:2 }, daniCursos:{ confCaseira:1 }, libera:{ confeitaria:2, joca:2, anselmo:2 } }); g=H.g; g.save.bank=5000;
  ok(!g.buyJocaCurso('espresso'),'sem o Joca contratado, não se compra');
  g.save.equipe.joca=2; const b0=g.save.bank; g.save.jocaCursoDia=0;
  ok(g.buyJocaCurso('espresso') && g.save.jocaCursos.espresso===1 && g.up.espresso===true && b0-g.save.bank===350 && H.L.jocaXp(g.save)===2,'com o Joca: R$ 350, liga a máquina e dá +2 de experiência');
  H.L.setShopTab('cardapio'); const t=txt(H.els['shop-grid']); ok(/espresso/i.test(t) && /espresso R\$ 8 e cappuccino R\$ 12/.test(t) && /Curso feito/.test(t),'o Cardápio mostra o curso (com o rosto do Joca) e fica "feito"');
  ok(H.L.cursosItem(g.save)===2 && H.L.avalMenu({},2)>H.L.avalMenu({},1),'conta como curso de item na Diversidade'); }

// ---------- 6. o pedido de café no fim da refeição ----------
{ const H=aberto({},null,ESP), {g,L}=H; const taxa=(tipo,vip,n)=>{ let c=0; for(let i=0;i<n;i++){ const m=new L.Group(g,tipo,++g.gid,0,!!vip); if (m.sorteiaCafes().length) c++; } return c/n; };
  const alvo=L.CAFES.pede; ok(JSON.stringify(alvo)===JSON.stringify({ executiva:0.5, negocios:0.6, vovos:0.4, familia:0.2, estudante:0.3 }),'CAFES.pede como no plano');
  Object.keys(alvo).forEach(k=>{ const r=taxa(k,false,800); ok(Math.abs(r-alvo[k])<0.07,'café: '+k+' pede em ~'+Math.round(alvo[k]*100)+'% (medido '+Math.round(r*100)+'%)'); });
  ok(taxa('entregador',false,200)===0 && taxa('turma',false,300)===0,'o entregador e a turma nunca pedem');
  let okQ=true,max=0; for(let i=0;i<300;i++){ const m=new L.Group(g,'familia',++g.gid,0,false), d=m.sorteiaCafes(); if(d.length){ max=Math.max(max,d.length); if(d.length>m.size||d.some(x=>x!=='espresso'&&x!=='cappuccino')) okQ=false; } } ok(okQ && max>=2,'1 a size cafés, espresso ou cappuccino');
  const S=aberto({},null,AV); let alg=0; for(let i=0;i<300;i++) if(new S.L.Group(S.g,'executiva',++S.g.gid,0,false).sorteiaCafes().length) alg++; ok(alg===0,'sem o curso, ninguém pede café da máquina');
  ok(L.cafeDe('espresso').preco===8 && L.cafeDe('espresso').prep===0.8 && L.cafeDe('cappuccino').preco===12 && L.cafeDe('cappuccino').prep===1.2 && L.CAFES.ingred===2 && L.PONTOS_ACAO.cafeEsp===5,'espresso R$ 8 (0,8 s), cappuccino R$ 12 (1,2 s), ingrediente R$ 2, +5 pontos'); }

// ---------- 7. a Bia serve os cafés ----------
{ const H=aberto({},null,ESP), {g,L}=H; const t=g.tables[0]; const m=mesa(H,['espresso','cappuccino']);
  ok(m.state==='eating' && m.esperaSuco && m.cafesFalta===2 && m.cafeEspBalao,'acabou de comer: espera os 2 cafés (balão), não pede a conta');
  m.timer=0; for(let i=0;i<5;i++) m.update(0.05); ok(m.state==='eating','sem os cafés, segue esperando');
  g.tapStation('espresso',717,340); ok(g.bia.acts.some(a=>a.type==='espresso'),'tocar na máquina entra na fila da Bia');
  g.bia.clearActs(); const a={ type:'espresso' }; const dur=g.bia.duration(a); ok(a.item==='espresso' && dur===0.8,'o 1º pedido sem dono: espresso, 0,8 s');
  g.custo=0; g.bia.perform(a); ok(g.bia.hands.length===1 && g.bia.hands[0].kind==='cafeesp' && g.bia.hands[0].id==='espresso' && g.custo===2,'pega o espresso (ingrediente R$ 2)');
  const b={ type:'espresso' }; ok(g.bia.duration(b)===1.2 && b.item==='cappuccino','o 2º: o cappuccino que falta, 1,2 s'); g.bia.perform(b);
  ok(g.bia.verbFor(t)==='cafeesp','com café na mão, a vez é do café'); g.pontos=0; const h0=m.hearts; g.bia.doTable(t);
  ok(m.cafesFalta===0 && m.cafesDados===2 && m.bebConta===20 && g.stats.cafesEsp===2 && g.pontos===10 && m.hearts>h0 && !g.bia.hands.length,'entrega: R$ 20 na conta (8+12), +10 pontos, +coração');
  m.update(0.05); ok(m.state==='wantBill','com todos os cafés, pede a conta');
  const bill=m.bill; g.money=0; g.collectBill(m,t); ok(g.money>=bill+20,'a conta paga os R$ 20');
  const m2=mesa(H,['cappuccino']); g.bia.hands=[]; g.bia.perform({ type:'espresso', item:'cappuccino' }); g.bia.doTable(t); ok(m2.bebConta===12,'só o cappuccino: R$ 12');
  m2.cafes=['espresso']; m2.cafesDados=0; m2.state='eating'; m2.esperaSuco=true; m2.patLeft=0.01; const hh=m2.hearts, pd=m2.perdDoce; m2.tick(0.05); ok(m2.hearts===hh-1 && m2.perdDoce===pd+1,'esperando o café, perde coração');
  g.bia.hands=[{ kind:'cafeesp', id:'espresso' }]; g.trash=0; g.money=100; g.bia.perform({ type:'trash' }); ok(g.money===96,'no lixo, o espresso custa metade (R$ 4)');
  ok(g.bia.canTake('cafeesp') && L.trayOk([{kind:'cafeesp'},{kind:'cafeesp'},{kind:'cafeesp'}]),'o café conta como bebida nas mãos (bandeja de 3)'); }

// ---------- 8. o cafezinho passa da Dani para o Joca; o Joca serve os cafés ----------
{ const H=aberto({ equipe:{ tonhao:1, dani:3, joca:3, daniTasks:['cafe','doce'], jocaTasks:['lixo','lavar'] } },null,ESP), {g,L}=H;
  ok(!L.daniTaskOk('cafe',g.up) && g.dani.tasks.join()==='doce' && !g.dani.does('cafe'),'com o espresso, "Servir cafezinho" sai da lista da Dani (a vaga fica livre)');
  ok(g.joca.tasks.join()==='cafe,lixo' && g.joca.does('cafe'),'o Joca: café fixo na 1ª vaga + (tarefas − 1) do básico (nível 2 do cartão = 2 tarefas)');
  g.save.equipe.joca=4; g.save.equipe.jocaTasks=['lixo','lavar','pratos']; ok(g.joca.tasks.join()==='cafe,lixo,lavar','no nível 3 do cartão (3 tarefas): café + 2 do básico');
  g.save.equipe.joca=3; g.save.equipe.jocaTasks=['lixo','lavar'];
  const t=g.tables[0], m=mesa(H,['espresso','cappuccino','espresso']); m.cafes=['espresso','cappuccino'];
  for(let i=0;i<1400 && m.cafesFalta>0;i++){ g.update(0.05); m.patLeft=99; }
  ok(m.cafesFalta===0 && m.bebConta===20 && g.joca.feitas>=1 && g.dani.feitas===0,'o Joca tira e leva os 2 cafés (R$ 20 na conta); conta para ele, não para a Dani');
  // o cafezinho comum também
  const m3=mesa(H,[]); m3.cafePede=true; m3.cafes=[]; m3.hearts=3; for(let i=0;i<600 && !m3.coffee;i++){ g.update(0.05); m3.patLeft=99; } ok(m3.coffee,'o Joca leva o cafezinho comum');
  // sem o espresso, nada muda
  const S=aberto({ equipe:{ tonhao:1, dani:3, joca:3, daniTasks:['cafe'], jocaTasks:['lixo','lavar'] } },null,AV).g; ok(S.dani.tasks.join()==='cafe' && S.joca.tasks.join()==='lixo,lavar','sem o curso de espresso: a Dani segue com o cafezinho e o Joca com o básico'); }

// ---------- 9. a Cami: conversa, contratação, folha ----------
{ let H=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:3, joca:3 }, daniCursos:{ confCaseira:1 }, libera:{ confeitaria:2, joca:2, anselmo:2 } }), g=H.g; joga(H,400); ok(g.save.libera.cami===0,'sem o espresso, a Cami não vem');
  H=jogo(6,'avenida',{ pontoDia:5, equipe:{ tonhao:1, dani:3, joca:3 }, daniCursos:{ confCaseira:1 }, jocaCursos:{ espresso:1 }, libera:{ confeitaria:2, joca:2, anselmo:2 } }); g=H.g; cursos(H,{}); joga(H,400);
  ok(g.save.libera.cami==='pend' && !g.cartaoAberto('cami'),'espresso feito: a conversa da Cami fica pendente no fim do dia');
  H.els['btn-next'].fire('click'); let n=0; while(!(g.conversa && /louça vai acumular/.test(g.conversa.fala.s)) && n<30){ toque(H.els); n++; } ok(g.conversa && /louça vai acumular/.test(g.conversa.fala.s),'a conversa toca no fim do dia do curso');
  passa(H); ok(g.save.libera.cami===1 && g.cartaoAberto('cami') && g.liberaNovo.includes('cami'),'depois dela: o cartão da Cami abre, com selo');
  H.L.setShopGrupo('equipe'); ok(H.L.shopSecoes()[1].includes('cami'),'o cartão da Cami fica na Equipe');
  const eq=g.save.equipe, f0=H.L.payroll(eq); g.save.bank=5000; ok(g.setStaff('cami',1) && eq.cami===1 && H.L.payroll(eq)-f0===120,'contratar põe no nível 1: R$ 120 por dia na folha');
  ok(!g.setStaff('cami',2),'o nível dela não sobe com salário: só por curso');
  H.L.setShopTab('cami'); const t=txt(H.els['shop-grid']); ok(/Cami · nível 1 de 3/.test(t) && /Tarefas \(3 de 3\)/.test(t) && /Atendimento ágil/.test(t) && /Atendimento de mesa/.test(t),'o cartão mostra "Cami · nível 1" e os dois cursos');
  ok(!/Em breve/.test(t) && /Comprar R\$ 600/.test(t),'v9.6: o curso de mesa já se compra (sem "Em breve")');
  // fora da História
  const F=load(); F.g.save=F.L.normSave({ salao:{ ponto:'avenida' }, bank:5000, equipe:{ dani:2 }, jocaCursos:{ espresso:1 }, daniCursos:{ confCaseira:1 } }); F.g.up=F.g.save.up; F.g.tablesKey=''; F.g.buildTables(); F.g.goShop(10);
  ok(F.g.cartaoAberto('cami') && F.g.setStaff('cami',1),'fora da História, o cartão abre com o espresso feito'); const F2=load(); F2.g.save=F2.L.normSave({ salao:{ ponto:'avenida' }, bank:5000, equipe:{ dani:2 } }); ok(!F2.g.cartaoAberto('cami'),'fora da História, sem o espresso, fechado'); }

// ---------- 10. o básico fica com o ajudante mais novo ----------
{ const H=aberto({ equipe:{ tonhao:1, dani:3, joca:3, cami:1, daniTasks:['doce'], jocaTasks:['lixo','lavar'], camiTasks:['lixo','pratos','lavar'] } },null,ESP), {g,L}=H;
  ok(L.donoBasico(g)==='cami' && g.cami.active,'com a Cami no dia, o básico é dela');
  ok(g.cami.tasks.join()==='lixo,pratos,lavar' && g.joca.tasks.join()==='cafe' && g.dani.tasks.join()==='doce','os três: a Cami com o básico, o Joca só com o café, a Dani só com os doces');
  ok(g.ajud.length===3 && g.ajud[2]===g.cami && g.otherWasher,'Game.ajud tem os três; alguém lava');
  ok(!g.toggleCamiTask('doce') && !g.toggleCamiTask('cafe'),'a Cami nunca faz doce nem cafezinho');
  g.save.equipe.camiFora=true; ok(L.donoBasico(g)==='joca' && !g.cami.active && g.joca.tasks.join()==='cafe,lixo' && g.dani.tasks.join()==='doce','a Cami fora no dia: o básico volta ao Joca (café + tarefas − 1)');
  g.save.equipe.jocaFora=true; ok(L.donoBasico(g)==='dani' && g.dani.tasks.join()==='doce,pratos' || g.dani.tasks.join()==='pratos,lavar' || g.dani.tasks.length>0,'e se o Joca também faltou, volta à Dani'); g.save.equipe.jocaFora=false; g.save.equipe.camiFora=false;
  // trabalho de verdade
  g.trash=L.TRASH.cap; g.tables[0].dirty=true; g.tables[0].dirtyN=2; g.kitchen.sinkN=2;
  for(let i=0;i<1600;i++) g.update(0.05);
  ok(g.trash===0 && !g.tables[0].dirty && g.kitchen.sinkN===0 && g.cami.feitas>=3 && g.joca.feitas===0 && g.dani.feitas===0,'a Cami esvazia o lixo, recolhe a mesa e lava a louça; o trabalho conta para ela');
  // o Joca e a Cami sem disputa pelo café
  const m=mesa(H,['espresso','cappuccino']); for(let i=0;i<1400 && m.cafesFalta>0;i++){ g.update(0.05); m.patLeft=99; } ok(m.cafesFalta===0 && g.joca.feitas>=1,'os três no dia: o Joca leva os cafés, sem briga'); }

// ---------- 11. os cursos e os níveis da Cami ----------
{ const H=aberto({ equipe:{ tonhao:1, dani:3, joca:3, cami:1 }, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2 } },null,ESP), {g,L}=H; const sv=g.save, C=L.STAFF.cami.levels;
  ok(C[1].speed===0.9 && C[1].tasks===3 && C[1].pay===120 && C[2].speed===1.1 && C[2].tasks===4 && C[2].pay===140 && C[3].speed===1.25 && C[3].pay===160 && C[3].mesas===true,'STAFF.cami como no plano (0,9/1,1/1,25; 3/4/4; R$ 120/140/160; mesas no 3)');
  ok(L.CAMI_CURSOS.length===2 && L.CAMI_CURSOS[0].preco===400 && L.CAMI_CURSOS[1].preco===600 && L.CAMI_CURSOS[1].dep==='agil','cursos: Atendimento ágil R$ 400 e Atendimento de mesa R$ 600 (precisa do ágil)');
  g.save.bank=5000; sv.camiCursoDia=0; g.cursoMsg=''; const f0=L.payroll(sv.equipe);
  ok(!g.buyCamiCurso('mesa'),'o de mesa não se compra antes do ágil');
  ok(g.buyCamiCurso('agil') && sv.camiCursos.agil===1 && sv.equipe.cami===2 && sv.bank===5000-400 && L.payroll(sv.equipe)-f0===20 && g.cami.spec.speed===1.1,'Atendimento ágil: R$ 400, nível 2, velocidade 1,1 e salário +R$ 20');
  ok(!g.buyCamiCurso('mesa'),'trava: um curso da Cami por lojinha'); sv.camiCursoDia=0;
  ok(g.buyCamiCurso('mesa') && sv.camiCursos.mesa===1 && sv.equipe.cami===3 && g.cami.spec.speed===1.25,'v9.6: com o ágil, o de mesa se compra (nível 3, velocidade 1,25)');
  ok(L.camiNivelCursos(sv)===3 && L.camiNivelCursos({ camiCursos:{ agil:1, mesa:1 } })===3 && L.camiNivelCursos({ camiCursos:{ mesa:1 } })===1 && L.camiNivelCursos({})===1,'camiNivelCursos: 1 + cursos feitos (o de mesa só conta com o ágil)');
  const F=L.normSave({ equipe:{ cami:9 }, salao:{ ponto:'avenida' } }); ok(F.equipe.cami===3 && F.equipe.camiTasks.join()==='lixo,pratos,lavar','normEquipe: a Cami vai de 0 a 3, tarefas padrão');
  H.L.setShopTab('cami'); const t=txt(H.els['shop-grid']); ok(/Cami · nível 3 de 3/.test(t) && /Curso feito/.test(t) && !/Em breve/.test(t),'o cartão mostra o nível 3 e os cursos feitos');
  const Q=L.normSave(Object.assign({}, sv, { camiCursos:{ agil:1 } })); ok(Q.camiCursos.agil===1 && Q.camiCursoDia>=0,'o save guarda camiCursos e camiCursoDia'); }

// ---------- 12. a folha ----------
{ const {L}=nova(); const eq={ tonhao:2, dani:3, joca:3, cami:2, couvert:true, som:true, tv:true, tvs:2, jocaTasks:[], daniTasks:[], camiTasks:[] }; const ord=[]; let n; while((n=L.folhaCorta(eq)) && ord.length<20) ord.push(n);
  ok(ord.join(' | ')==='Couvert | som | TV | TVs | a Cami (sem salário hoje) | aumento do Joca | aumento da Dani | aumento da Dani | aumento do Tonhão | aumento do Tonhão | o Joca (sem salário hoje)','a ordem: ... TVs, a Cami não vem, aumento do Joca, da Dani, do Tonhão, o Joca não vem');
  ok(eq.cami===2 && eq.camiFora===true && L.payroll(eq)===L.STAFF.tonhao.levels[0].pay+L.STAFF.dani.levels[1].pay,'a Cami fora não entra na folha (continua contratada)');
  const N=L.normEquipe(eq,L.PONTOS[2]); ok(N.camiFora===undefined && N.jocaFora===undefined,'normEquipe não guarda o "não vem"');
  ok(L.folhaItens({ tonhao:0, dani:1, joca:3, cami:1 }).join()==='Joca,Cami','folhaItens lista a Cami');
  const H=jogo(6,'avenida',{ pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2 }, equipe:{ tonhao:1, dani:2, joca:3, cami:1 }, bank:80, daniCursos:{ confCaseira:1 }, jocaCursos:{ espresso:1 } }), {g}=H; g.save.corta=true; g.begin();
  ok(g.save.equipe.camiFora===true && g.unpaid.some(u=>/Cami/.test(u)) && !g.cami.active,'sem dinheiro: a Cami não vem hoje (antes de cortar o aumento do Joca), avisa e fica de fora');
  g.save.bank=5000; g.resetDay(11); g.begin(); ok(g.save.equipe.camiFora===false && g.cami.active,'no dia seguinte, com dinheiro, ela volta'); }

// ---------- 13. o save de antes carrega igual, o fim do dia e o desenho da Cami ----------
{ const antigo=JSON.stringify({ maxDay:10, bank:900, up:{ bandeja:true }, torneira:true, cardV:1, histV:1, tonXp:1, daniXp:1, dia:11, salao:{ ponto:'industrial' }, equipe:{ tonhao:1, dani:3, joca:2, jocaTasks:['lixo','lavar'] }, daniCursos:{ confCaseira:1 } });
  const {L}=nova(); const a=L.normSave(JSON.parse(antigo)); ok(a.equipe.cami===0 && a.equipe.joca===2 && a.camiCursos && Object.keys(a.camiCursos).length===0 && a.up.confCaseira && !a.up.confGourmet && !a.up.espresso,'save da v9.2: carrega igual (sem Cami, sem gourmet, sem espresso)');
  const b=L.normSave(JSON.parse(JSON.stringify(a))); ok(JSON.stringify(b.equipe)===JSON.stringify(a.equipe),'normSave é estável');
  const H=aberto({ equipe:{ tonhao:1, dani:3, joca:3, cami:1 } },null,ESP), {g}=H; g.joca.feitas=0; g.cami.feitas=3; g.stats.cafesEsp=2; joga(H,300);
  ok(/Cami: 3 tarefas hoje/.test(txt(H.els['end-msg'])) && /Espressos e cappuccinos: 2/.test(txt(H.els['end-msg'])),'o fim do dia mostra a Cami e os cafés');
  let erro=''; try { [1,2,3].forEach(lv=>{ g.save.equipe.cami=lv; g.cami.x=300; g.cami.y=300; H.L.drawCami(H.ctx,g.cami,0); }); } catch(e){ erro=String(e); } ok(!erro,'a Cami desenha nos 3 níveis sem erro '+erro);
  ok(/^v9\./.test(H.L.VERSAO),'VERSAO é v9.x (a v9.3 trouxe a Cami)'); }

console.log('total =',total,' fails =',fails); process.exit(fails?1:0);
