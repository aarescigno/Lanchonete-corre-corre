// v9.6.12 (revisão geral): as dicas na hora (dias 1 a 3 da carreira: anel, seta e etiqueta no próximo passo de quem fica parado),
// o fim do dia em linhas (resultado, capítulo e avisos; o trabalho da equipe na tabela), o HUD com as estrelas na barra e o cartão
// da Dani, que na História só aparece no grupo Equipe depois que ela chega.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');

// ---------- (1) dicas na hora: o ciclo inteiro do dia 1, parando antes de cada passo ----------
{ const H=load(); const {g,L,els}=H;
  const D=L.DICAS;
  const toca=(x,y)=>{ g.onDown(x+g.cam,y,0); g.onUp(x+g.cam,y); };
  const arrasta=(a,b)=>{ g.onDown(a.x+g.cam,a.y,0); g.onMove((a.x+b.x)/2+g.cam,(a.y+b.y)/2); g.onMove(b.x+g.cam,b.y); g.onUp(b.x+g.cam,b.y); };
  const roda=(f,max)=>{ for(let i=0;i<(max||4000);i++){ if(f()) return true; g.update(0.05); } return f(); };
  const para=s=>{ for(let i=0;i<s/0.05;i++) g.update(0.05); };
  const vazio=()=>toca(330,520);   // um toque no chão, longe de tudo: zera a espera sem fazer nada
  const st=k=>{ const r=L.LAYOUT.STATIONS[k].rect; return {x:r.x+r.w/2,y:r.y+r.h/2}; };
  const k=()=>g.dica && g.dica.k;
  const dia=n=>{ g.save=L.normSave({bank:500,dia:n,maxDay:n}); g.up=g.save.up; g.buildTables(); g.startDay(n); if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[{t:1e9,type:'estudante'}]; g.nextIdx=0; };
  const chega=(tipo)=>{ const e=g.spawn({type:tipo||'vovos',color:1}); e.patLeft=1e9; e.hearts=5; roda(()=>!e.path.length); return e; };

  ok(D.dias===3 && D.espera>=3 && D.firme>0,'DICAS: dias 1 a '+D.dias+', '+D.espera+' s sem toque');
  dia(1);
  ok(g.state==='playing' && g.mode==='carreira' && g.day.n===1 && L.dicaLigada(g),'dia 1 da carreira: dicas ligadas');
  ok(g.dica===null,'salão vazio: nenhuma dica');
  const grp=chega(); vazio();
  para(D.espera-1); ok(g.dica===null,'antes de '+D.espera+' s sem toque, nada aparece');
  para(1.5); ok(/^sentar:/.test(k()) && g.dica.txt==='Arraste até a mesa' && g.dica.alvos.length===2 && g.dica.arrasta,'parada com um grupo na calçada: "Arraste até a mesa", com o grupo e a mesa marcados');
  { const t=g.tables.find(t=>t.color===grp.color && t.seats>=grp.size), a=g.dica.alvos[1], r=L.tableRect?L.tableRect(t):null;
    ok(t && Math.abs(a.x+a.w/2-t.cx)<1,'a mesa marcada é a da cor do grupo'); }
  let erro=null; try { L.render(g,H.ctx); } catch(e){ erro=e; } ok(!erro,'desenha a dica sem erro'+(erro?': '+erro:''));
  vazio(); ok(g.dica===null && g.semToque===0,'qualquer toque apaga a dica na hora');
  const mesa=g.tables.find(t=>t.color===grp.color && t.seats>=grp.size);
  arrasta(grp,{x:mesa.cx,y:mesa.cy});
  ok(grp.table===mesa,'grupo sentado');
  roda(()=>grp.state==='wantOrder'); vazio(); para(D.espera+0.5);
  ok(k()==='anotar:'+mesa.id && g.dica.txt==='Anote o pedido','chamaram e ninguém foi: "Anote o pedido"');
  toca(mesa.cx,mesa.cy); ok(g.dica===null,'tocou na mesa: a dica some');
  roda(()=>g.bia.hands.some(h=>h.kind==='ticket') && !g.bia.acts.length); vazio(); para(D.espera+0.5);
  ok(k()==='cozinha' && g.dica.txt==='Leve ao Tonhão','comanda na mão: "Leve ao Tonhão"');
  toca(st('order').x,st('order').y);
  para(1); ok(g.dica===null,'com a Bia a caminho (fila com tarefa), sem dica');
  roda(()=>g.kitchen.plates.some(p=>p&&p.group===grp) && !g.bia.acts.length); vazio(); para(D.espera+0.5);
  ok(/^prato:/.test(k()) && g.dica.txt==='Pegue o prato','prato pronto no balcão: "Pegue o prato"');
  const pl=g.kitchen.plates.findIndex(p=>p&&p.group===grp);
  toca(L.LAYOUT.PLATE_SLOTS[pl].x,L.LAYOUT.PLATE_SLOTS[pl].y);
  roda(()=>g.bia.hands.some(h=>h.kind==='dish') && !g.bia.acts.length); vazio(); para(D.espera+0.5);
  ok(k()==='servir:'+mesa.id && g.dica.txt==='Sirva a mesa','prato na mão: "Sirva a mesa"');
  toca(mesa.cx,mesa.cy);
  roda(()=>grp.state==='eating'); vazio(); para(D.espera+0.5);
  ok(g.dica===null,'comendo, sem nada a fazer: nenhuma dica (o cafezinho não vira cobrança)');
  roda(()=>grp.state==='wantBill'); vazio(); para(D.espera+0.5);
  ok(k()==='cobrar:'+mesa.id && g.dica.txt==='Cobre a conta','pediram a conta: "Cobre a conta"');
  toca(mesa.cx,mesa.cy);
  roda(()=>mesa.dirty && !mesa.group && !g.bia.acts.length); vazio(); para(D.espera+0.5);
  ok(k()==='louca:'+mesa.id && g.dica.txt==='Recolha a louça','mesa suja: "Recolha a louça"');
  toca(mesa.cx,mesa.cy);
  roda(()=>g.bia.hands.some(h=>h.kind==='dirty') && !g.bia.acts.length); vazio(); para(D.espera+0.5);
  ok(k()==='pia' && g.dica.txt==='Deixe na pia','louça na mão: "Deixe na pia"');
  toca(st('sink').x,st('sink').y);
  roda(()=>!g.bia.hands.length && !g.bia.acts.length); vazio(); para(D.espera+0.5);
  ok(g.dica===null,'dias 1 e 2 não contam prato limpo: sem "Lave a louça"');
  g.trash=L.TRASH.cap; para(D.firme+0.5);
  ok(k()==='lixo' && g.dica.txt==='Tire o lixo','lixeira cheia: "Tire o lixo"');
  g.trash=0;
  // sentar não depende da Bia: com ela ocupada, a dica do grupo aparece assim mesmo
  const g2=chega('estudante'); g.kitchen.sinkN=3; toca(st('sink').x,st('sink').y); ok(g.bia.acts.length===1,'a Bia tem tarefa na fila');
  g.bia.acts[0].t0=0; g.semToque=D.espera; para(D.firme+0.2);
  ok(/^sentar:/.test(k()),'com a Bia ocupada, "Arraste até a mesa" aparece assim mesmo');
  // dicaDe só olha: chamar muitas vezes não muda nada
  { const foto=()=>JSON.stringify([g.pontos,g.money,g.queue.length,g.groups.length,g.bia.acts.length,g.bia.hands.length,g.trash,g.kitchen.sinkN]);
    const a=foto(); for(let i=0;i<50;i++) L.dicaDe(g); ok(foto()===a,'dicaDe não mexe no jogo'); }
  // pausado: a dica não anda
  g.pause(); const s0=g.semToque; g.update(1); ok(g.semToque===s0,'na pausa, o tempo da dica não anda'); g.resume();

  // dia 3: os pratos limpos acabam; dia 4: sem dicas
  dia(3); chega();
  g.kitchen.noPlate=true; g.kitchen.sinkN=2; g.queue.slice().forEach(q=>{ q.state='x'; });
  ok(L.dicaDe(g) && L.dicaDe(g).k==='lavar' && L.dicaDe(g).txt==='Lave a louça','dia 3, sem prato limpo e com louça na pia: "Lave a louça"');
  dia(4); chega(); g.semToque=99; para(D.espera+2);
  ok(!L.dicaLigada(g) && g.dica===null && L.dicaDe(g)===null,'do dia 4 em diante, sem dicas');
  // fora da carreira
  g.startEndless(); if(g.state==='intro') els['btn-start'].fire('click');
  ok(!L.dicaLigada(g),'Turno sem fim: sem dicas');
  g.setState('menu'); els['btn-treino'].fire('click');
  ok(g.mode==='treino' && !L.dicaLigada(g),'Missão zero: sem dicas (ela tem o próprio passo a passo)'); }

// ---------- (2) fim do dia: recados em linhas e a equipe na tabela ----------
{ const H=load(); const {g,L,els}=H;
  const fecha=(sv,prep)=>{ g.save=L.normSave(Object.assign({bank:800,dia:9,maxDay:9},sv)); g.up=g.save.up; g.buildTables(); g.startDay(9); if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; if(prep) prep(); g.finishDay(); };
  fecha({equipe:{dani:1},daniTar:999},()=>{ g.stats.daniFeitas=4; g.money=g.custo+g.contas+g.paid+g.paidDiv+g.day.expert+5; });
  const ls=els['end-msg'].children;
  ok(ls.length>=1 && ls.every(l=>/end-linha/.test(l.className)) && !els['end-msg'].textContent,'os recados do fim do dia vêm em linhas ('+ls.length+'), não num parágrafo só');
  ok(/^Perfeito!/.test(ls[0].textContent) && ls[0].className==='end-linha','a 1ª linha é o resultado do dia');
  ok(ls.some(l=>/A Dani já pode subir/.test(l.textContent) && /boa/.test(l.className)),'"já pode subir de nível" é uma linha própria, em verde');
  ok(!/tarefa/.test(txt(els['end-msg'])) && /Dani\s+\d+ tarefas? · experiência \d+/.test(txt(els['end-stats'])),'o trabalho da Dani saiu dos recados e foi para a tabela');
  ok(ls.every(l=>l.textContent.length<=200),'nenhuma linha passa de 200 letras');
  // sem a meta e no negativo: linha de alerta
  fecha({bank:-50,neg:1},()=>{ g.money=0; });
  const l2=els['end-msg'].children;
  ok(/sem estrelas/.test(l2[0].textContent) && l2.some(l=>/negativo há/.test(l.textContent) && /alerta/.test(l.className)),'caixa no negativo: linha de alerta, separada do resultado');
  // os botões ficam fora do corpo que rola
  const src=require('fs').readFileSync(__dirname+'/../src/02-telas.html','utf8'), css=require('fs').readFileSync(__dirname+'/../src/01-estilo.css','utf8');
  const fim=src.slice(src.indexOf('id="ov-end"'), src.indexOf('id="ov-shop"'));
  ok(/class="panel end-panel"/.test(fim) && fim.indexOf('class="end-corpo"')<fim.indexOf('id="end-stats"') && fim.indexOf('id="end-save"')<fim.indexOf('class="row end-pe"') && fim.indexOf('class="row end-pe"')<fim.indexOf('id="btn-next"'),'fim do dia: corpo que rola e a linha de botões no pé, fora dele');
  ok(/\.end-panel\{[^}]*overflow:hidden/.test(css) && /\.end-corpo\{[^}]*overflow:auto/.test(css) && /\.end-pe\{[^}]*flex:none/.test(css),'CSS: o painel não rola, o corpo rola, o pé é fixo'); }

// ---------- (3) na História, o capítulo é uma linha à parte ----------
{ const H=load({historia:true}); const {g,L,els}=H;
  g.save.treino=true; g.save.conversa=null; L.playCareer(); if(g.conversa) while(g.conversa) g.conversa.seguir(); if(g.state==='intro') els['btn-start'].fire('click');
  ok(g.state==='playing' && g.day.n===1 && g.save.cap===1,'História: dia 1 do cap. 1');
  g.schedule=[]; g.nextIdx=0; g.money=g.custo+g.contas+g.paid+g.paidDiv+10; g.finishDay(); while(g.conversa) g.conversa.seguir();
  const cap=els['end-msg'].children.filter(l=>/\bcap\b/.test(l.className));
  ok(cap.length===1 && /^Capítulo 1, A garagem da Rosa: Fechar 2 dias no azul/.test(cap[0].textContent),'o objetivo do capítulo vem numa linha própria ('+(cap[0]&&cap[0].textContent)+')');
  // a Dani ainda não chegou: nem cartão no grupo Equipe, nem seção
  g.goShop(2);
  const eq=L.shopSecoes()[1];
  ok(!g.daniChegou && !L.daniNaLoja() && eq.indexOf('dani')<0 && eq.indexOf('tonhao')>=0,'antes do cap. 2, o grupo Equipe não mostra a Dani ('+eq.join(',')+')');
  L.setShopGrupo('equipe'); ok(!/Dani/.test(txt(els['shop-grid'])),'nenhum cartão "Dani" na tela');
  g.save.cap=2; ok(L.daniNaLoja() && L.shopSecoes()[1].indexOf('dani')>=0,'no cap. 2, o cartão da Dani aparece');
  ok(/^No fim do dia saem: /.test(els['shop-folha'].textContent) && /parcela do banco R\$ \d+/.test(els['shop-folha'].textContent) && !/rende completo/.test(els['shop-folha'].textContent),'linha da lojinha: "No fim do dia saem: ..." ('+els['shop-folha'].textContent+')'); }
{ const H=load(); const {g,L}=H;   // fora da História (testes antigos, Turno sem fim): a Dani aparece como sempre
  g.save=L.normSave({bank:500,dia:3,maxDay:3}); g.up=g.save.up; g.goShop(3);
  ok(L.daniNaLoja() && L.shopSecoes()[1].indexOf('dani')>=0,'sem a História, a Dani segue na lojinha desde o começo'); }

// ---------- (4) HUD: as 3 estrelas na barra do lucro ----------
{ const H=load(); const {g,L}=H;
  const B=L.HUD_LUCRO;
  L.DAYS.forEach(d=>{ const e=L.hudEstrelas(d);
    ok(e.length===3 && e[0]>=B.x && e[0]<e[1] && e[1]<e[2] && e[2]===B.x+B.w && e[1]-e[0]>=17 && e[2]-e[1]>=17,'dia '+d.n+': 3 estrelas em ordem na barra, sem se cobrirem ('+e.map(x=>Math.round(x)).join(', ')+')'); });
  const col=L.hudEstrelas({meta:100,expert:120});
  ok(col[1]-col[0]>=17 && col[2]-col[1]>=17,'alvos colados (meta 100, 3★ 120) continuam separados na barra');
  ok(B.x+B.w+10<=334,'a barra e a 3ª estrela não invadem a caixa do Gurugol');
  // desenha o HUD em cada estado sem erro (o texto do canvas não é conferido; só não pode quebrar)
  const frases=[]; const ctx=new Proxy({},{get:(o,k)=>k==='measureText'?()=>({width:40}):k==='fillText'?(t)=>{ frases.push(String(t)); }:(k in o?o[k]:()=>{}), set:(o,k,v)=>{o[k]=v;return true;}});
  g.save=L.normSave({bank:500,dia:4,maxDay:4}); g.up=g.save.up; g.buildTables(); g.startDay(4); if(g.state==='shop') H.els['btn-shop-go'].fire('click'); if(g.state==='intro') H.els['btn-start'].fire('click');
  const com=(lucro,lost)=>{ g.money=g.custo+g.contas+g.paid+g.paidDiv+lucro; g.stats.lost=lost; frases.length=0; L.drawHud(ctx,g,0); return frases.join(' | '); };
  const d=g.day;
  ok(new RegExp('meta R\\$ '+d.meta).test(com(0,0)),'abaixo da meta, o HUD mostra a meta');
  ok(new RegExp('R\\$ '+L.bomGoal(d)).test(com(d.meta,0)) && !/meta R\$/.test(com(d.meta,0)),'meta batida: o alvo vira a 2ª estrela');
  ok(new RegExp('R\\$ '+d.expert).test(com(L.bomGoal(d),0)),'2ª estrela: o alvo vira a 3ª');
  ok(/3 estrelas!/.test(com(d.expert,0)),'3ª estrela batida: "3 estrelas!"');
  ok(/3ª estrela perdida/.test(com(L.bomGoal(d),1)),'com alguém perdido e a 2ª garantida: "3ª estrela perdida"');
  ok(!/ pts/.test(com(0,0)) && !/grupos/.test(com(0,0)),'na carreira, o HUD não mostra mais "pts · grupos"');
  g.startEndless(); if(g.state==='intro') H.els['btn-start'].fire('click'); frases.length=0; L.drawHud(ctx,g,0);
  ok(/ pts · atendidos/.test(frases.join(' | ')),'no Turno sem fim, os pontos continuam no HUD'); }

console.log('total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
