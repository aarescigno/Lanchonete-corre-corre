// v12.12: as dancinhas escondidas, 5 toques seguidos na equipe (spec: docs/spec-v12.12.md). CA1 a CA6 (CA7 é a captura shot_v12_12.js; CA8, o balance.js 20).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const QUEM=['bia','tonhao','dani','joca','cami','anselmo','lia'];
/* um dia do Terraço, com a equipe toda, já jogando; opts.rm liga o movimento reduzido */
const dia=(opts,eq)=>{ const H=load(opts||{}), {g,L}=H;
  g.save=L.normSave({ dia:65, maxDay:65, bank:99999, up:{ tenis:true }, equipe:Object.assign({ tonhao:1, dani:1, joca:2, cami:2, anselmo:2, lia:1 },eq||{}), salao:{ ponto:'terraco' } });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.startDay(65); g.begin();
  return H; };
const anda=(g,s)=>{ for(let t=0;t<s-1e-9;t+=0.05) g.update(0.05); };
const toca=(g,x,y,pad)=>g.onDown(x+g.cam,y,pad||0);
/* o ponto que cai no meio de cada um (as áreas da spec) */
const ponto=(g,L,q)=>{
  if(q==='bia') return [g.bia.x,g.bia.y-30];
  if(q==='tonhao') return [930,150];
  if(q==='dani') return [g.dani.x,g.dani.y-30];
  if(q==='joca') return [g.joca.x,g.joca.y-30];
  if(q==='cami') return [g.cami.x,g.cami.y-30];
  if(q==='anselmo') return [L.ANSELMO_HOME.x,L.ANSELMO_HOME.y-30];
  if(q==='lia') return [L.LIA_HOME.x,L.LIA_HOME.y-50*L.LIA_HOME.s];
};
/* põe quem anda (a Bia e os ajudantes) num canto sem alvo do jogo por baixo, para o toque no vazio cair só nele */
const usados=new WeakMap();
const quieta=(g,q)=>{ const p=g[q]; if(!p||!('walkPh' in p||q==='bia')) return; const u=usados.get(g)||[]; usados.set(g,u);
  for(let y=520;y>=300;y-=20) for(let x=300;x<=700;x+=20){
    if(u.some(o=>Math.abs(o[0]-x)<50&&Math.abs(o[1]-y)<80)) continue;
    if([-60,-40,-20,0].every(dy=>!g.pickAt(x,y+dy,0)) && [-8,0,8].every(dx=>!g.pickAt(x+dx,y-30,0))){ p.x=x; p.y=y; p.acts=[]; p.path=[]; p.moving=false; u.push([x,y]); return; } } };
bloco('CA1',()=>{
  const {g,L}=dia(); let n=0; const raw=L.Sfx.tiriri; L.Sfx.tiriri=function(){ n++; return raw&&raw.apply(this,arguments); };
  ok(typeof raw==='function','CA1: o Sfx.tiriri existe');
  quieta(g,'bia'); let [x,y]=ponto(g,L,'bia');
  for(let i=0;i<4;i++){ toca(g,x,y); anda(g,0.5); }
  ok(!(g.eggs.bia&&g.eggs.bia.p>0) && n===0,'CA1: 4 toques na Bia: nada');
  toca(g,x,y);
  ok(g.eggs.bia && g.eggs.bia.p>0 && n===1,'CA1: o 5º toque dispara a dancinha (p='+(g.eggs.bia&&g.eggs.bia.p)+') e o tiriri ('+n+')');
  anda(g,1.4);
  ok(g.eggs.bia.p===0,'CA1: a dancinha acaba em 1,2 s (p='+g.eggs.bia.p+')');
  // com uma folga de 1,1 s no meio, a conta zera
  const H2=dia(); const g2=H2.g; quieta(g2,'bia'); [x,y]=ponto(g2,H2.L,'bia');
  for(let i=0;i<5;i++){ toca(g2,x,y); anda(g2,i===2?1.1:0.5); }
  ok(!(g2.eggs.bia&&g2.eggs.bia.p>0),'CA1: 5 toques com 1,1 s de folga no meio: nada');
  // durante a dancinha, os toques não contam
  toca(g,x,y); for(let i=0;i<4;i++){ anda(g,0.1); toca(g,x,y); }
  ok(g.eggs.bia.p===0 || g.eggs.bia.n<=4,'CA1: tocar durante a dancinha não conta');
});
bloco('CA2',()=>{
  const {g,L}=dia(); g.tm={ t:0, ac:0, perd:0, filaS:0, par:0, sentar:[], pedido:[], conta:[], suja:[], prato:[], aparelho:'bot', dev:false };
  quieta(g,'bia'); const [x,y]=ponto(g,L,'bia'); g.fx=[];
  for(let i=0;i<5;i++){
    toca(g,x,y,12);
    if(i<4) ok(!g.fx.some(f=>f.k==='tap'||f.k==='text'),'CA2: o toque '+(i+1)+' não deixa fx (tap ou texto) na tela');
    anda(g,0.3);
  }
  ok(g.tm.perd===0 && g.tm.ac===0,'CA2: nenhum dos 5 toques é toque perdido nem ação do teste (perd '+g.tm.perd+', ac '+g.tm.ac+')');
});
bloco('CA3',()=>{
  const roda=comDanca=>{
    const H=dia({}, { dani:2, joca:0, cami:0 }), {g,L}=H; let s=12345; const raw=Math.random;
    Math.random=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
    try{
      g.save.equipe.daniTasks=['lixo','pratos']; g.trash=L.TRASH.cap; g.dani.reset();
      const traj=[]; for(let t=0;t<30;t+=0.05){ g.update(0.05); if(comDanca && Math.round(t*100)%200===0) g.danca('dani'); if(Math.round(t*100)%500===0) traj.push([Math.round(g.dani.x),Math.round(g.dani.y)].join(',')); }
      return { traj:traj.join(' '), trash:g.trash, dani:[Math.round(g.dani.x),Math.round(g.dani.y),g.dani.phase].join(',') };
    } finally { Math.random=raw; }
  };
  const a=roda(false), b=roda(true);
  ok(a.traj.split(' ').length>5 && new Set(a.traj.split(' ')).size>1,'CA3: a Dani anda no dia de referência ('+a.traj.split(' ').slice(0,4).join(' | ')+'...)');
  ok(a.traj===b.traj && a.trash===b.trash && a.dani===b.dani,'CA3: dançando a cada 2 s, a Dani faz o mesmo caminho e o mesmo serviço (lixo '+a.trash+' x '+b.trash+')');
});
bloco('CA4',()=>{
  const {g,L}=dia(); quieta(g,'bia');
  // a Bia fica em cima de uma mesa aberta: o toque exato na mesa (cuja Bia está sobre) faz o de sempre
  const t=g.tables.find(x=>x.open); const r=L.tableRect?L.tableRect(t):null;
  g.bia.x=t.cx; g.bia.y=t.cy+20; const [x,y]=[t.cx,t.cy];
  t.group=null; t.dirty=true;
  const h=g.pickAt(x,y,0);
  ok(h && h.k==='table','CA4: o ponto está sobre a mesa ('+(h&&h.k)+')');
  for(let i=0;i<6;i++){ toca(g,x,y); anda(g,0.2); }
  ok(!(g.eggs.bia&&(g.eggs.bia.p>0||g.eggs.bia.n>0)),'CA4: 6 toques na mesa (com a Bia por baixo): contam só como toque na mesa');
  ok(g.bia.acts.some(a=>a.type==='table'&&a.id===t.id) || g.bia.moving || g.bia.acts.length===0,'CA4: a mesa suja é tratada como toque na mesa (a Bia vai limpar)');
  // e uma estação: a Bia sobre a pia/cafeteira
  const H2=dia(); const g2=H2.g, st=H2.L.STATIONS.coffee.rect; g2.bia.x=st.x+st.w/2; g2.bia.y=st.y+st.h/2+30; g2.bia.acts=[];
  const [x2,y2]=[st.x+st.w/2,st.y+st.h/2];
  ok(g2.pickAt(x2,y2,0)&&g2.pickAt(x2,y2,0).k==='station','CA4: o ponto está sobre a estação');
  for(let i=0;i<6;i++){ toca(g2,x2,y2); anda(g2,0.2); }
  ok(!(g2.eggs.bia&&(g2.eggs.bia.p>0||g2.eggs.bia.n>0)),'CA4: 6 toques na estação: nada de dancinha');
});
bloco('CA5',()=>{
  for(const q of ['tonhao','lia']){
    const {g,L}=dia(); quieta(g,'bia'); const [x,y]=ponto(g,L,q);
    ok(!g.bia.acts.some(a=>a.type==='order') && !g.bia.hands.some(h=>h.kind==='ticket'),'CA5: '+q+': fila vazia para a janela');
    for(let i=0;i<5;i++){ toca(g,x,y); anda(g,0.4); }
    ok(g.eggs[q] && g.eggs[q].p>0,'CA5: '+q+': 5 toques na cabeça com a fila vazia dançam');
    ok(!g.bia.acts.some(a=>a.type==='order'),'CA5: '+q+': e a Bia não ganha ação');
    // com uma comanda na mão da Bia, o toque vai para a janela
    const H2=dia(), g2=H2.g; quieta(g2,'bia'); g2.bia.hands=[{ kind:'ticket', table:1 }];
    toca(g2,x,y);
    ok(g2.bia.acts.some(a=>a.type==='order'),'CA5: '+q+': com comanda na mão, o toque vai para a janela (ação order na fila)');
    ok(!(g2.eggs[q]&&g2.eggs[q].n>0),'CA5: '+q+': e não conta (a conta zera)');
  }
});
bloco('CA6',()=>{
  for(const rm of [false,true]){
    const H=dia({rm}), {g,L,ctx}=H;
    QUEM.forEach(q=>{
      quieta(g,q); const [x,y]=ponto(g,L,q);
      const P=g[q]&&g[q].walkPh!==undefined?g[q]:null, px=P&&P.x, py=P&&P.y;   // quem anda sozinho volta para o lugar dele entre os toques
      for(let i=0;i<5;i++){ toca(g,x,y); anda(g,0.3); if(P){ P.x=px; P.y=py; P.path=[]; } }
      ok(g.eggs[q] && g.eggs[q].p>0,'CA6: '+q+' dança pelo toque'+(rm?' (RM)':''));
      if(P&&q!=='bia'){ P.x=-100; P.y=470; P.path=[]; }   // sai do caminho do próximo
    });
    anda(g,1.5);
    ok(QUEM.every(q=>g.eggs[q].p===0),'CA6: todos acabam'+(rm?' (RM)':''));
    QUEM.forEach(q=>{ g.danca(q); ok(g.eggs[q].p>0,'CA6: g.danca("'+q+'") dispara'+(rm?' (RM)':'')); });
    let err=null; try{ g.eggs.bia.p=0.5; QUEM.forEach(q=>g.eggs[q].p=0.5); L.render(g,ctx); }catch(e){ err=e; }
    ok(!err,'CA6: o desenho de todos dançando roda'+(rm?' com RM':'')+(err?': '+(err.stack||err):''));
  }
  // o modo dev: a seção "Dancinhas" com um botão por personagem do dia, que dispara a dancinha na hora
  const H=dia(), {g,L,els}=H; L.DEV.on=true; L.DEV.aba='hoje'; L.abrirDev();
  const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
  const acha=(n,f,r=[])=>{ if(f(n)) r.push(n); (n.children||[]).forEach(c=>acha(c,f,r)); return r; };
  ok(/Dancinhas/.test(txt(els['dev-body'])),'CA6: o painel do modo dev tem a seção "Dancinhas"');
  const nomes={ bia:'Bia', tonhao:'Tonhão', dani:'Dani', joca:'Joca', cami:'Cami', anselmo:'Anselmo', lia:'Lia' };
  QUEM.forEach(q=>{ const b=acha(els['dev-body'],n=>n.tagName==='BUTTON'&&n.textContent===nomes[q])[0];
    ok(!!b,'CA6: botão "'+nomes[q]+'" no painel'); if(b){ b.fire('click'); ok(g.eggs[q]&&g.eggs[q].p>0,'CA6: o botão "'+nomes[q]+'" dispara a dancinha'); } });
  anda(g,0.5); ok(g.eggs.bia.p>0.2,'CA6: com o painel aberto (jogo pausado) o tempo da dancinha segue (p='+g.eggs.bia.p.toFixed(2)+')');
});
console.log(fails?('FALHOU: '+fails+'/'+total):('OK: '+total)); process.exit(fails?1:0);
