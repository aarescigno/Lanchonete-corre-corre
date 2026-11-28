// v12.12.1: os outros segredos e a dança da equipe (spec: docs/spec-v12.12.1.md). CA1 a CA7 (CA8 é a captura shot_v12_12_1.js).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
/* um dia do Terraço, com a equipe toda, o couvert e a música (1 trio, 2 pianista), já jogando */
const dia=(opts,eq,mus)=>{ const H=load(opts||{}), {g,L}=H;
  g.save=L.normSave({ dia:65, maxDay:65, bank:99999, up:{ tenis:true }, equipe:Object.assign({ tonhao:1, dani:1, joca:2, cami:2, anselmo:2, lia:1 },eq||{}), salao:{ ponto:'terraco' } });
  g.save.equipe.couvert=!(eq&&eq.couvert===false); g.save.equipe.musica=mus==null?1:mus;   // o normSave tira o couvert do Terraço; o teste liga os dois para ver cada um
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.startDay(65); g.begin();
  return H; };
const anda=(g,s)=>{ for(let t=0;t<s-1e-9;t+=0.05) g.update(0.05); };
const toca=(g,x,y,pad)=>g.onDown(x+g.cam,y,pad||0);
/* conta as chamadas de um Sfx */
const conta=(L,nome)=>{ const o={ n:0 }, raw=L.Sfx[nome]; L.Sfx[nome]=function(){ o.n++; return raw&&raw.apply(this,arguments); }; return o; };
/* a altura (entre y0 e y1) em que a coluna x não tem alvo do jogo por baixo, para o toque no vazio cair só no personagem */
const vazio=(g,x,y0,y1)=>{ for(let y=y1;y>=y0;y-=4) if([-6,0,6].every(dx=>!g.pickAt(x+dx,y,0))) return y; return null; };
const cinco=(g,x,y,passo)=>{ for(let i=0;i<5;i++){ toca(g,x,y); anda(g,passo||0.4); } };
/* a Bia fica longe para não cobrir ninguém */
const bia_longe=g=>{ g.bia.x=400; g.bia.y=300; g.bia.acts=[]; g.bia.path=[]; g.bia.moving=false; };
const fiscalNovo=(g,L,x,y)=>{ const f=new L.Fiscal(g,0); f.st='olha'; f.resta=999; f.x=x; f.y=y; f.path=[]; f.moving=false; g.fiscal=f; return f; };
const MENU_X=L=>L.TW-170;

bloco('CA1',()=>{
  const {g,L}=dia(); bia_longe(g); const n=conta(L,'tiriri');
  const x=420, y=vazio(g,x,300,480); const f=fiscalNovo(g,L,x,y+32);
  const py=f.y-30; ok(g.pickAt(x,py,0)===null||g.pickAt(x,py,0)===undefined,'CA1: o ponto do fiscal está sem alvo do jogo por baixo');
  ok(g.eggOn('fiscal'),'CA1: com o fiscal no salão, o segredo dele vale');
  for(let i=0;i<4;i++){ toca(g,x,py); anda(g,0.5); }
  ok(!(g.eggs.fiscal&&g.eggs.fiscal.p>0)&&n.n===0,'CA1: 4 toques no fiscal: nada');
  toca(g,x,py);
  ok(g.eggs.fiscal&&g.eggs.fiscal.p>0&&n.n===1,'CA1: o 5º toque dispara a dancinha do fiscal e o tiriri');
  // a área: x ± 15, de y − 64 a y + 2
  const h=dia(); bia_longe(h.g); const f2=fiscalNovo(h.g,h.L,x,y+32);
  toca(h.g,x+16,py); anda(h.g,0.3); toca(h.g,x,f2.y-66); anda(h.g,0.3); toca(h.g,x-14,f2.y+1); anda(h.g,0.3);
  ok(h.g.eggs.fiscal&&h.g.eggs.fiscal.n===1,'CA1: a área é x ± 15, de y − 64 a y + 2 (fora: não conta; dentro: conta)');
  // sem o fiscal ativo, nada
  const k=dia(); bia_longe(k.g); const f3=fiscalNovo(k.g,k.L,x,y+32); f3.st='espera';
  ok(!k.g.eggOn('fiscal'),'CA1: o fiscal que ainda não entrou não tem o segredo');
  // ele segue no mesmo caminho e no mesmo tempo que sem a dancinha (a mesma semente)
  const roda=danca=>{ const raw=Math.random; let s=777; Math.random=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
    try{ const H=dia(), g2=H.g; bia_longe(g2); const f=new H.L.Fiscal(g2,0); g2.fiscal=f; f.t=0; const traj=[]; let ativo=0;
      for(let t=0;t<40;t+=0.05){ g2.update(0.05); if(f.ativo) ativo++; if(danca&&f.ativo&&Math.round(t*100)%250===0) g2.danca('fiscal'); if(Math.round(t*100)%500===0) traj.push([f.st,Math.round(f.x),Math.round(f.y)].join(',')); }
      return { traj:traj.join(' '), ativo, res:f.res }; } finally { Math.random=raw; } };
  const a=roda(false), b=roda(true);
  ok(a.ativo>20 && new Set(a.traj.split(' ')).size>2,'CA1: o fiscal anda e olha no dia de referência ('+a.traj.split(' ').slice(0,5).join(' | ')+'...)');
  ok(a.traj===b.traj && a.res===b.res,'CA1: dançando de 2,5 em 2,5 s, ele faz o mesmo caminho e o mesmo tempo');
});
bloco('CA2',()=>{
  // o músico do couvert
  { const {g,L}=dia({}, {}, 0); bia_longe(g); const n=conta(L,'tiriri');
    ok(g.eggOn('musico')&&!g.eggOn('trio')&&!g.eggOn('pianista'),'CA2: com o couvert e sem música do Terraço, só o músico do couvert');
    const x=186, y=vazio(g,x,440,528); ok(y!=null,'CA2: há uma altura sem alvo do jogo na coluna do músico ('+y+')');
    for(let i=0;i<4;i++){ toca(g,x,y); anda(g,0.5); } ok(!(g.eggs.musico&&g.eggs.musico.p>0),'CA2: 4 toques no músico: nada');
    toca(g,x,y); ok(g.eggs.musico&&g.eggs.musico.p>0&&n.n===1,'CA2: o 5º toque dispara o floreio do músico e o tiriri');
    const h=dia({}, {}, 0); bia_longe(h.g); toca(h.g,x+17,y); anda(h.g,0.2); toca(h.g,x,439); anda(h.g,0.2); toca(h.g,x,529); anda(h.g,0.2);
    ok(!(h.g.eggs.musico&&h.g.eggs.musico.n>0),'CA2: fora da área (x ± 16, y de 440 a 528) não conta'); }
  // o trio: os três somam na mesma conta
  { const {g,L}=dia({}, {}, 1); bia_longe(g); const n=conta(L,'tiriri');
    ok(g.eggOn('trio')&&!g.eggOn('pianista'),'CA2: no Terraço com música 1, o trio');
    const pts=L.TRIO.map(q=>[q.x,vazio(g,q.x,464,534)]); ok(pts.every(p=>p[1]!=null),'CA2: cada um do trio tem uma altura sem alvo ('+pts.map(p=>p.join(',')).join(' ')+')');
    toca(g,pts[0][0],pts[0][1]); anda(g,0.3); toca(g,pts[1][0],pts[1][1]); anda(g,0.3); toca(g,pts[2][0],pts[2][1]); anda(g,0.3); toca(g,pts[0][0],pts[0][1]); anda(g,0.3);
    ok(!(g.eggs.trio&&g.eggs.trio.p>0),'CA2: 4 toques, em qualquer um dos três: nada');
    toca(g,pts[1][0],pts[1][1]); ok(g.eggs.trio&&g.eggs.trio.p>0&&n.n===1,'CA2: o 5º, somando os três, dispara o floreio dos três juntos'); }
  // o pianista
  { const {g,L}=dia({}, {}, 2); bia_longe(g); const n=conta(L,'tiriri'); const P=L.TERRACO.piano, x=P.x0+60, yb=P.y0+98;
    ok(g.eggOn('pianista')&&!g.eggOn('trio'),'CA2: no Terraço com música 2, o pianista');
    const y=vazio(g,x,yb-60,yb); ok(y!=null,'CA2: há uma altura sem alvo do jogo na coluna do pianista ('+y+')');
    cinco(g,x,y,0.4); ok(g.eggs.pianista&&g.eggs.pianista.p>0&&n.n===1,'CA2: 5 toques no pianista disparam o floreio dele'); }
  // quem não toca no dia não tem o segredo
  { const {g}=dia({}, { couvert:false }, 0); ok(!g.eggOn('musico')&&!g.eggOn('trio')&&!g.eggOn('pianista'),'CA2: sem couvert nem música, ninguém'); }
});
bloco('CA3',()=>{
  const H=load({}), {g,L,els}=H; const n=conta(L,'tiriri');
  g.save=L.normSave({ dia:65, maxDay:65, bank:99999, equipe:{ tonhao:1 }, salao:{ ponto:'terraco' } }); g.setState('menu');
  ok(g.state==='menu','CA3: o jogo está no menu');
  const ov=els['ov-menu'], X=MENU_X(L), Y=450, kx=960/L.TW;
  const fire=(alvo,px,py)=>ov.fire('pointerdown',{ target:alvo, clientX:px*kx, clientY:py, pointerType:'mouse', preventDefault(){} });
  ok(ov.listeners.pointerdown&&ov.listeners.pointerdown.length>0,'CA3: o #ov-menu escuta o pointerdown');
  const botao={ id:'btn-x', tagName:'BUTTON' };
  for(let i=0;i<5;i++){ fire(botao,X,Y); anda(g,0.3); }
  ok(!(g.eggs.biaMenu&&g.eggs.biaMenu.p>0)&&n.n===0,'CA3: 5 toques que chegam por um botão do menu não contam');
  for(let i=0;i<4;i++){ fire(ov,X,Y); anda(g,0.3); } ok(!(g.eggs.biaMenu&&g.eggs.biaMenu.p>0),'CA3: 4 toques na Bia grande: nada');
  fire(ov,X,Y); ok(g.eggs.biaMenu&&g.eggs.biaMenu.p>0&&n.n===1,'CA3: o 5º toque dispara a pirueta da Bia grande e o tiriri');
  anda(g,0.6); ok(g.eggs.biaMenu&&g.eggs.biaMenu.p>0.4,'CA3: o tempo da dancinha anda no menu (p='+(g.eggs.biaMenu&&g.eggs.biaMenu.p).toFixed(2)+')');
  anda(g,1); ok(g.eggs.biaMenu.p===0,'CA3: e acaba');
  // a área: TW − 170 ± 34, y de 375 a 522
  const h=load({}); h.g.save=h.L.normSave({ dia:65, maxDay:65, equipe:{ tonhao:1 } }); h.g.setState('menu'); const ov2=h.els['ov-menu'];
  const f2=(px,py)=>ov2.fire('pointerdown',{ target:ov2, clientX:px*kx, clientY:py, pointerType:'mouse', preventDefault(){} });
  [[X+35,450],[X-35,450],[X,374],[X,523]].forEach(p=>{ f2(p[0],p[1]); anda(h.g,0.2); });
  ok(!(h.g.eggs.biaMenu&&h.g.eggs.biaMenu.n>0),'CA3: fora do retângulo da Bia grande não conta');
  f2(X+33,376); ok(h.g.eggs.biaMenu&&h.g.eggs.biaMenu.n===1,'CA3: dentro do retângulo conta');
  // o desenho do menu com a Bia girando roda
  let err=null; try{ g.eggs.biaMenu={ n:0,t:0,p:0.5 }; L.render(g,H.ctx); }catch(e){ err=e; } ok(!err,'CA3: o desenho do menu com a Bia grande girando roda'+(err?': '+(err.stack||err):''));
});
bloco('CA4',()=>{
  const {g,L}=dia(); bia_longe(g); g.tm={ t:0, ac:0, perd:0, filaS:0, par:0, sentar:[], pedido:[], conta:[], suja:[], prato:[], aparelho:'bot', dev:false };
  const pl=conta(L,'plim'), ti=conta(L,'tiriri'), bell=conta(L,'bell'); const CX=754, CY=214;
  ok(typeof L.Sfx.plim==='function','CA4: o Sfx.plim existe');
  ok(Object.keys(L.STATIONS).every(k=>{ const r=L.STATIONS[k].rect; return !(CX>=r.x&&CX<=r.x+r.w&&CY>=r.y&&CY<=r.y+r.h); }),'CA4: o centro da campainha (754, 214) fica fora de todos os retângulos das estações');
  ok(g.eggAt(CX,CY)==='campainha','CA4: o toque no centro dela é a campainha');
  ok(g.eggAt(CX+12,CY)==='campainha'&&g.eggAt(CX+13,CY)!=='campainha','CA4: o raio é 12');
  g.fx=[];
  for(let i=0;i<5;i++){
    toca(g,CX,CY,12); anda(g,0.3);
    ok(pl.n===i+1,'CA4: o toque '+(i+1)+' toca o plim ('+pl.n+')');
    if(i<4) ok(!g.fx.some(f=>f.k==='text'&&/Já vai/.test(f.text)),'CA4: o toque '+(i+1)+' ainda não chama o Tonhão');
  }
  { const k2=dia(); bia_longe(k2.g); toca(k2.g,CX,CY,12); ok(k2.g.eggs.campainha&&k2.g.eggs.campainha.af>0,'CA4: a cúpula afunda ao toque (af='+(k2.g.eggs.campainha&&k2.g.eggs.campainha.af)+')'); anda(k2.g,0.2); ok(k2.g.eggs.campainha.af===0,'CA4: e sobe de volta em 0,15 s'); }
  ok(g.fx.some(f=>f.k==='text'&&f.text==='Já vai, já vai!'),'CA4: o 5º toque põe o "Já vai, já vai!" na tela');
  ok(ti.n===0&&bell.n===0,'CA4: sem o tiriri nem o sino do prato pronto');
  ok(g.tm.perd===0&&g.tm.ac===0,'CA4: nenhum dos toques é toque perdido nem ação do teste (perd '+g.tm.perd+', ac '+g.tm.ac+')');
  ok(g.bia.acts.length===0,'CA4: a Bia não ganha ação');
  ok(g.eggs.campainha.n===0,'CA4: e a conta zera');
  g.fx=[]; toca(g,CX,CY,12); anda(g,0.3); ok(!g.fx.some(f=>f.k==='text'&&/Já vai/.test(f.text)),'CA4: o toque seguinte recomeça a conta (sem o texto)');
  // a folga de 1,1 s zera a conta
  const h=dia(); bia_longe(h.g); h.g.fx=[]; for(let i=0;i<5;i++){ toca(h.g,CX,CY); anda(h.g,i===2?1.1:0.4); }
  ok(!h.g.fx.some(f=>f.k==='text'&&/Já vai/.test(f.text)),'CA4: 5 toques com 1,1 s de folga no meio: sem resposta');
  // vale também na Garagem
  const k=load({}); k.g.mode='carreira'; k.g.save=k.L.normSave({ dia:1 }); k.g.startDay(1); k.g.begin(); bia_longe(k.g); k.g.fx=[]; cinco(k.g,CX,CY,0.4);
  ok(k.g.fx.some(f=>f.k==='text'&&/Já vai/.test(f.text)),'CA4: na Garagem também');
  let err=null; try{ g.eggs.campainha={ n:0,t:0,p:0,af:0.1 }; L.render(g,H0().ctx); }catch(e){ err=e; }
  function H0(){ return { ctx:dia().ctx }; }
  ok(!err,'CA4: o desenho da campainha afundada roda'+(err?': '+(err.stack||err):''));
});
bloco('CA5',()=>{
  const texts=[]; // o que o desenho escreve
  const passo=(gripe,rm)=>{ const H=dia({rm}), {g,L,ctx}=H; bia_longe(g); const ti=conta(L,'tiriri'), at=conta(L,'atchim');
    if(gripe) g.day=Object.assign({},g.day,{ gripe:true });
    ctx.fillText=(t)=>{ texts.push(String(t)); };
    for(let i=0;i<4;i++){ toca(g,930,150); anda(g,0.4); } toca(g,930,150);   // o 5º, sem esperar depois
    return { H, g, L, ctx, ti, at }; };
  { const { g, ti, at }=passo(true,false);
    ok(g.eggs.tonhao&&g.eggs.tonhao.p>0,'CA5: o 5º toque no Tonhão gripado dispara a dancinha');
    ok(ti.n===0,'CA5: sem o Sfx.tiriri');
    ok(at.n===1,'CA5: o 1º "Atchim!" e o Sfx.atchim aos 0 s ('+at.n+')');
    anda(g,0.45); ok(at.n===2,'CA5: o 2º aos 0,4 s ('+at.n+')');
    anda(g,0.4); ok(at.n===3,'CA5: o 3º aos 0,8 s ('+at.n+')');
    anda(g,0.5); ok(at.n===3&&g.eggs.tonhao.p===0,'CA5: e só três, a dancinha acaba'); }
  const veAtchim=(gripe,p,rm)=>{ const H=dia({rm}), {g,L,ctx}=H; if(gripe) g.day=Object.assign({},g.day,{ gripe:true }); g.anim=0.5; g.eggs={ tonhao:{ n:0,t:0,p } };
    const ts=[]; ctx.fillText=t=>{ ts.push(String(t)); }; L.render(g,ctx); return ts.filter(t=>/Atchim/.test(t)).length; };
  ok(veAtchim(true,0.1,false)===1&&veAtchim(true,0.45,false)===1&&veAtchim(true,0.8,false)===1,'CA5: o desenho mostra um "Atchim!" em cada terço (0,1, 0,45 e 0,8)');
  ok(veAtchim(true,0.5,true)===1,'CA5: com RM os "Atchim!" aparecem também');
  ok(veAtchim(false,0.45,false)===0,'CA5: no dia sem gripe, nenhum "Atchim!"');
  // no dia sem gripe, a touca que pula e o tiriri
  { const {g,L}=dia(); bia_longe(g); const ti=conta(L,'tiriri'), at=conta(L,'atchim'); cinco(g,930,150,0.4);
    ok(g.eggs.tonhao&&g.eggs.tonhao.p>0&&ti.n===1&&at.n===0,'CA5: sem gripe: a touca (tiriri) e nenhum atchim'); }
  { const {g,L}=dia(); const at=conta(L,'atchim'); g.day=Object.assign({},g.day,{ gripe:true }); g.danca('tonhao'); ok(at.n===1,'CA5: o botão do modo dev (danca) também dá o atchim no dia da gripe'); }
  // com a comanda na mão da Bia o toque vai para a janela, como na v12.12
  { const {g}=dia(); bia_longe(g); g.day=Object.assign({},g.day,{ gripe:true }); g.bia.hands=[{ kind:'ticket', table:1 }]; toca(g,930,150);
    ok(g.bia.acts.some(a=>a.type==='order'),'CA5: com comanda na mão, o toque vai para a janela'); }
});
bloco('CA6',()=>{
  const prep=(todos)=>{ const raw=Math.random; let s=4242; Math.random=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
    const H=dia(); const {g}=H; g.restore=()=>{ Math.random=raw; }; if(todos) g.festaQuem().forEach(q=>g.danca(q)); anda(g,1.5); return H; };
  const fim=(g)=>{ let festa=null,passos=0; g.clock=0; while(g.state==='playing'&&passos++<400){ g.update(0.05); if(g.ending&&festa===null) festa=g.festa; } return festa; };
  let a,b;
  try{
    const A=prep(true); ok(A.g.festaQuem().join()==='bia,tonhao,dani,joca,cami,anselmo,lia','CA6: quem precisa dançar: a Bia, o Tonhão e os ajudantes do dia ('+A.g.festaQuem().join()+')');
    ok(A.g.dancou&&typeof A.g.dancou.has==='function'&&typeof A.g.dancou.add==='function','CA6: g.dancou é um Set');
    ok(A.g.festaQuem().every(q=>A.g.dancou.has(q)),'CA6: danca(quem) acrescenta quem dançou');
    const festaA=fim(A.g); a={ lucro:Math.round(A.g.lucro), stars:A.g.result&&A.g.result.stars, bank:A.g.save.bank, dia:A.g.save.dia, state:A.g.state };
    ok(festaA===2,'CA6: com todos em g.dancou, o fim do dia pelo tempo põe g.festa em 2 ('+festaA+')'); A.g.restore();
    const B=prep(true); const q=B.g.festaQuem(); B.g.dancou.delete('lia'); const festaB=fim(B.g); b={ lucro:Math.round(B.g.lucro), stars:B.g.result&&B.g.result.stars, bank:B.g.save.bank, dia:B.g.save.dia, state:B.g.state };
    ok(festaB===0,'CA6: faltando a Lia, não tem festa ('+festaB+')'); B.g.restore();
    ok(a.state==='dayend'&&b.state==='dayend','CA6: os dois dias chegam ao Caixa ('+a.state+', '+b.state+')');
    ok(JSON.stringify(a)===JSON.stringify(b),'CA6: o resultado do dia (lucro, estrelas, dinheiro e dia) é o mesmo com e sem a festa: '+JSON.stringify(a)+' x '+JSON.stringify(b)); }
  finally { }
  // durante a festa todos dançam duas vezes, com brilhinhos a cada 0,5 s e o tiriri aos 0 e 1 s
  { const {g,L,ctx}=dia(); const ti=conta(L,'tiriri'); g.festaQuem().forEach(q=>g.danca(q)); g.fx=[]; ti.n=0;
    g.festaIni?g.festaIni(true):null; ok(g.festa===2,'CA6: g.festa começa em 2');
    const ps=[]; let sp=0, ult=-1;
    for(let t=0;t<2.0;t+=0.05){ g.update(0.05); const e=g.eggs.bia; ps.push(e.p); const ns=g.fx.filter(f=>f.k==='spark').length; if(ns>sp&&t-ult>0.2){ ult=t; } sp=ns; }
    ok(ti.n===2,'CA6: o Sfx.tiriri aos 0 e 1 s da festa ('+ti.n+')');
    ok(ps.filter(p=>p>0).filter((p,i,a)=>i>0&&p<a[i-1]).length===1,'CA6: a dancinha da Bia dá duas voltas na festa ('+ps.filter(p=>p>0).filter((p,i,a)=>i>0&&p<a[i-1]).length+' recomeço)');
    ok(g.festa<=0,'CA6: a festa acaba depois de 2 s ('+g.festa+')');
    ok(g.festaQuem().every(q=>!(g.eggs[q]&&g.eggs[q].p>0)),'CA6: e ninguém fica dançando'); }
  { const {g,L,ctx}=dia(); g.festaQuem().forEach(q=>g.danca(q)); g.festaIni(true); g.fx=[]; anda(g,0.05);
    const sp=g.fx.filter(f=>f.k==='spark').length; ok(sp>=g.festaQuem().length*3,'CA6: brilhinhos sobre cada um ('+sp+')');
    let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'CA6: o desenho da festa roda'+(err?': '+(err.stack||err):''));
    const H=dia({rm:true}); H.g.festaQuem().forEach(q=>H.g.danca(q)); H.g.festaIni(true); H.g.fx=[]; anda(H.g,0.05); err=null; try{ H.L.render(H.g,H.ctx); }catch(e){ err=e; }
    ok(!err,'CA6: o desenho da festa com RM roda'+(err?': '+(err.stack||err):'')); }
  // no dia da gripe o Tonhão faz o dele de gripado (o atchim)
  { const {g,L}=dia(); const at=conta(L,'atchim'); g.day=Object.assign({},g.day,{ gripe:true }); g.festaQuem().forEach(q=>g.danca(q)); at.n=0; g.festaIni(true); anda(g,2.1); ok(at.n>=3,'CA6: na festa da gripe, o Tonhão espirra ('+at.n+')'); }
});
bloco('CA7',()=>{
  const {g,L,els}=dia({}, {}, 1); g.fiscal=null; bia_longe(g); const f=fiscalNovo(g,L,420,420); L.DEV.on=true; L.DEV.aba='hoje'; L.abrirDev();
  const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
  const acha=(n,f2,r=[])=>{ if(f2(n)) r.push(n); (n.children||[]).forEach(c=>acha(c,f2,r)); return r; };
  const btn=nome=>acha(els['dev-body'],n=>n.tagName==='BUTTON'&&n.textContent===nome)[0];
  ok(/Dancinhas/.test(txt(els['dev-body'])),'CA7: a seção "Dancinhas" segue no painel');
  ['Fiscal','Trio','Campainha','Bia do menu','Todos dançam'].forEach(nome=>ok(!!btn(nome),'CA7: botão "'+nome+'" no painel'));
  ok(!btn('Pianista'),'CA7: o "Pianista" só aparece quando ele toca no dia (aqui é o trio)');
  btn('Fiscal').fire('click'); ok(g.eggs.fiscal&&g.eggs.fiscal.p>0,'CA7: "Fiscal" dispara a dancinha dele');
  btn('Trio').fire('click'); ok(g.eggs.trio&&g.eggs.trio.p>0,'CA7: "Trio" dispara o floreio');
  g.fx=[]; btn('Campainha').fire('click'); ok(g.fx.some(x=>x.k==='text'&&x.text==='Já vai, já vai!'),'CA7: "Campainha" põe o "Já vai, já vai!" na hora');
  btn('Todos dançam').fire('click'); ok(g.festa>0&&g.festaQuem().every(q=>g.eggs[q]&&g.eggs[q].p>0)||g.festa>0,'CA7: "Todos dançam" começa a festa na hora ('+g.festa+')');
  g.festa=0; btn('Bia do menu').fire('click'); g.setState('menu'); ok(g.eggs.biaMenu&&g.eggs.biaMenu.p>0,'CA7: "Bia do menu" faz a pirueta vista ao voltar ao menu');
  const mus=dia({}, {}, 2); mus.g.fiscal=null; mus.L.DEV.on=true; mus.L.DEV.aba='hoje'; mus.L.abrirDev();
  const b2=nome=>acha(mus.els['dev-body'],n=>n.tagName==='BUTTON'&&n.textContent===nome)[0];
  ok(!!b2('Pianista')&&!b2('Trio'),'CA7: com o pianista no dia, o botão "Pianista" (e não o "Trio")'); if(b2('Pianista')){ b2('Pianista').fire('click'); ok(mus.g.eggs.pianista&&mus.g.eggs.pianista.p>0,'CA7: "Pianista" dispara o floreio'); }
  const co=dia({}, {}, 0); co.g.fiscal=null; co.L.DEV.on=true; co.L.DEV.aba='hoje'; co.L.abrirDev();
  const b3=nome=>acha(co.els['dev-body'],n=>n.tagName==='BUTTON'&&n.textContent===nome)[0];
  ok(!!b3('Músico')&&!b3('Fiscal'),'CA7: com o couvert, o "Músico"; sem fiscal no salão, nada de "Fiscal"'); if(b3('Músico')){ b3('Músico').fire('click'); ok(co.g.eggs.musico&&co.g.eggs.musico.p>0,'CA7: "Músico" dispara o floreio'); }
});
console.log(fails?('FALHOU: '+fails+'/'+total):('OK: '+total)); process.exit(fails?1:0);
