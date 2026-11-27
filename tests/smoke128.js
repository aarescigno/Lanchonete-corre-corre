// v12.12: as dancinhas escondidas, 5 toques na equipe (spec: docs/spec-v12.12.md). CA1 a CA6 (CA7 é a captura shot_v12_12.js; CA8, o balance.js 20).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const acha=(n,f,r=[])=>{ if(f(n)) r.push(n); (n.children||[]).forEach(c=>acha(c,f,r)); return r; };
const QUEM=['bia','tonhao','dani','joca','cami','anselmo','lia'];
// um dia no Terraço com a equipe toda e ninguém chegando (o dia não acaba sozinho)
const dia=(opts)=>{ const H=load(Object.assign({}, opts&&opts.rm?{ rm:true }:{}, { store:{ lcc2_save:JSON.stringify({ dia:58, maxDay:58, bank:20000, histV:1, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true }) } })), {g,L}=H;
  g.setDev(true); g.devEquipe('max'); (opts&&opts.sem||[]).forEach(q=>{ g.save.equipe[q]=0; }); g.save.equipe.anselmo=2; g.save.equipe.lia=1; g.save.salao.ponto='terraco'; g.buildTables(); g.startDay(58); g.begin();
  g.schedule=[{ t:1e6, type:'familia', color:0, vip:false }]; g.nextIdx=0; g.groups=[]; g.queue=[]; g.bia.clearActs();
  H.sfx=0; L.Sfx.tiriri=()=>{ H.sfx++; };
  H.toca=(x,y,pad)=>g.onDown(x+g.cam,y,pad||0);
  return H; };
// um ponto onde o personagem cabe sem nenhum alvo do jogo (fila, mesa, estação, conserto) dentro do retângulo dele
const livre=(g)=>{ for(let x=100;x<640;x+=10) for(let y=200;y<500;y+=10){ let l=true; for(let xx=x-16;xx<=x+16&&l;xx+=4) for(let yy=y-66;yy<=y+4&&l;yy+=4) if(g.pickAt(xx,yy,0)) l=false; if(l) return { x, y }; } return null; };
// no lugar de quem não é fixo (a Bia e os ajudantes), em pontos livres diferentes
const livres=(g,n)=>{ const r=[]; for(let x=100;x<640&&r.length<n;x+=10) for(let y=200;y<500&&r.length<n;y+=10){ let l=true; for(let xx=x-16;xx<=x+16&&l;xx+=4) for(let yy=y-66;yy<=y+4&&l;yy+=4) if(g.pickAt(xx,yy,0)) l=false; if(l&&r.every(q=>Math.abs(q.x-x)>=50||Math.abs(q.y-y)>=80)) r.push({ x, y }); } return r; };
const poe=(g)=>{ const ps=livres(g,4); [g.bia,g.dani,g.joca,g.cami].forEach((o,i)=>{ o.x=ps[i].x; o.y=ps[i].y; }); return ps[0]; };
const ONDE={ bia:g=>[g.bia.x,g.bia.y-30], dani:g=>[g.dani.x,g.dani.y-30], joca:g=>[g.joca.x,g.joca.y-30], cami:g=>[g.cami.x,g.cami.y-30], tonhao:()=>[930,140], lia:g=>[868,168], anselmo:()=>[650,70] };

bloco('CA1',()=>{ const H=dia(), {g}=H; poe(g);
  const [x,y]=ONDE.bia(g); ok(!g.pickAt(x,y,0),'CA1: o ponto do teste na Bia não tem alvo do jogo');
  for(let i=0;i<4;i++){ H.toca(x,y); roda(g,0.2); }
  ok(g.eggP('bia')===0 && H.sfx===0,'CA1: 4 toques na Bia não fazem dancinha nem som');
  H.toca(x,y); ok(g.eggs.bia.p>0 && g.eggP('bia')>0 && H.sfx===1,'CA1: o 5º toque dispara a dancinha da Bia (p '+g.eggs.bia.p+') e o Sfx.tiriri');
  roda(g,0.6); ok(g.eggP('bia')>0.3 && g.eggP('bia')<0.7,'CA1: a dancinha anda com o tempo (p '+g.eggP('bia').toFixed(2)+' aos 0,6 s)');
  for(let i=0;i<5;i++){ H.toca(x,y); roda(g,0.05); } roda(g,0.7);   // os toques durante a dancinha não contam
  ok(g.eggP('bia')===0 && g.eggs.bia.n===0 && H.sfx===1,'CA1: a dancinha acaba aos 1,2 s e os toques dentro dela não contam');
  for(let i=0;i<5;i++){ H.toca(x,y); roda(g,0.95); } ok(g.eggP('bia')>0 && H.sfx===2,'CA1: com 0,95 s entre os toques, os 5 valem (a conta recomeçou depois da dancinha)');
  { const H2=dia(), g2=H2.g; poe(g2); const [a,b]=ONDE.bia(g2); for(let i=0;i<3;i++){ H2.toca(a,b); roda(g2,0.2); } roda(g2,1.1); for(let i=0;i<2;i++){ H2.toca(a,b); roda(g2,0.2); }
    ok(g2.eggP('bia')===0 && H2.sfx===0,'CA1: 5 toques com uma folga de 1,1 s no meio não fazem a dancinha'); }
});
bloco('CA2',()=>{ const H=dia(), {g}=H; poe(g); g.tm={ ac:0, perd:0 }; const [x,y]=ONDE.bia(g), n0=g.fx.length;
  for(let i=0;i<4;i++){ H.toca(x,y,24); roda(g,0.1); }
  ok(g.fx.length===n0 && !g.fx.some(f=>f.k==='tap' || f.k==='text'),'CA2: os toques de 1 a 4 não deixam nada na tela (nenhum fx de toque nem texto)');
  H.toca(x,y,24); ok(g.tm.ac===0 && g.tm.perd===0,'CA2: nenhum dos 5 é toque perdido nem ação do Teste de habilidade (ac '+g.tm.ac+', perd '+g.tm.perd+')');
  const antes=g.tm.perd; H.toca(10,10,0); ok(g.tm.perd===antes+1,'CA2: o toque no vazio continua sendo toque perdido');
});
bloco('CA3',()=>{ const roda1=(dancando)=>{ const H=dia({ sem:['cami','joca'] }), {g}=H; g.save.equipe.daniTasks=['pratos','lavar']; g.dani.reset&&g.dani.reset(); g.dani.active=true;
    const t=g.tables.find(q=>q.open)||g.tables[0]; t.group=null; t.dirty=true; t.dirtyN=2; t.sujaT=0;
    const tr=[]; for(let i=0;i<300;i++){ if(dancando && i%40===0) g.danca('dani'); g.update(0.05); if(i%10===0) tr.push([Math.round(g.dani.x),Math.round(g.dani.y),g.dani.hands.length,!!t.dirty]); }
    return tr; };
  const a=roda1(false), b=roda1(true);
  ok(a.some(p=>p[0]!==a[0][0]||p[1]!==a[0][1]),'CA3: a Dani anda no dia de controle ('+a.length+' amostras)');
  ok(JSON.stringify(a)===JSON.stringify(b),'CA3: com a Dani dançando a cada 2 s ela faz o mesmo caminho, no mesmo tempo (a dancinha é só desenho)');
});
bloco('CA4',()=>{ const H=dia(), {g}=H; poe(g);
  let alvo=null; for(let x=100;x<640&&!alvo;x+=6) for(let y=150;y<500&&!alvo;y+=6){ const h=g.pickAt(x,y,0); if(h&&h.k==='table') alvo={x,y,t:h.t}; }
  ok(!!alvo,'CA4: acha um ponto de mesa para o teste');
  g.bia.x=alvo.x; g.bia.y=alvo.y+14; alvo.t.dirty=true; alvo.t.dirtyN=2; alvo.t.group=null;   // o corpo da Bia cobre o ponto da mesa
  ok(g.eggAt(alvo.x,alvo.y)==='bia','CA4: o ponto está dentro do retângulo da Bia');
  for(let i=0;i<5;i++){ H.toca(alvo.x,alvo.y); roda(g,0.1); }
  ok(g.eggP('bia')===0 && !(g.eggs.bia&&g.eggs.bia.n) && H.sfx===0,'CA4: o toque exato na mesa faz o de sempre e não conta para a dancinha');
  ok(g.bia.acts.some(a=>a.type==='table'),'CA4: o toque na mesa entrou na fila da Bia');
});
bloco('CA5',()=>{
  { const H=dia(), {g}=H; poe(g); const [x,y]=ONDE.tonhao(); g.bia.hands=[]; g.bia.clearActs();
    for(let i=0;i<5;i++){ H.toca(x,y); roda(g,0.1); }
    ok(g.eggP('tonhao')>0 && H.sfx===1,'CA5: 5 toques na cabeça do Tonhão com a fila vazia fazem a dancinha dele');
    ok(g.bia.acts.length===0,'CA5: a Bia não ganha ação nenhuma ('+g.bia.acts.length+')'); }
  { const H=dia(), {g}=H; poe(g); const [x,y]=ONDE.lia(g); g.bia.hands=[]; g.bia.clearActs();
    ok(g.eggCabeca(x,y)==='lia','CA5: o ponto de teste é a cabeça da Lia');
    for(let i=0;i<5;i++){ H.toca(x,y); roda(g,0.1); }
    ok(g.eggP('lia')>0 && g.bia.acts.length===0,'CA5: 5 toques na cabeça da Lia com a fila vazia fazem a dancinha dela e a Bia não sai'); }
  { const H=dia(), {g}=H; poe(g); const [x,y]=ONDE.tonhao(); g.bia.hands=[{ kind:'ticket', n:1 }]; g.bia.clearActs();
    H.toca(x,y);
    ok(g.bia.acts.some(a=>a.type==='order'),'CA5: com comanda na mão da Bia, o toque na cabeça do Tonhão vai para a janela (a ação order entra na fila)');
    for(let i=0;i<4;i++){ roda(g,0.1); H.toca(x,y); } ok(g.eggP('tonhao')===0 && H.sfx===0,'CA5: e com a comanda na mão a dancinha dele não conta'); }
  { const H=dia(), {g}=H; poe(g); const [x,y]=ONDE.tonhao(); H.toca(x,y); H.toca(x,y); g.bia.hands=[{ kind:'ticket', n:1 }]; H.toca(x,y); g.bia.hands=[]; g.bia.clearActs(); roda(g,0.2);
    H.toca(x,y); H.toca(x,y); ok(g.eggP('tonhao')===0,'CA5: o toque que foi para a janela zera a conta dele (2 + 1 janela + 2 = nada)'); }
});
bloco('CA6',()=>{ const H=dia(), {g,L}=H; poe(g); g.bia.hands=[]; g.bia.clearActs();
  [g.dani,g.joca,g.cami].forEach(h=>{ h.update=()=>{}; });   // parados nos pontos livres (sem ir para casa)
  QUEM.forEach(k=>{ ok(g.eggPresente(k),'CA6: '+k+' está no dia'); });
  QUEM.forEach(k=>{ const [x,y]=ONDE[k](g); if(k!=='bia'&&k!=='tonhao'&&k!=='lia') ok(!g.pickAt(x,y,0),'CA6: o ponto de '+k+' não tem alvo do jogo'); ok(g.eggAt(x,y)===k || g.eggCabeca(x,y)===k,'CA6: o ponto de '+k+' é dele ('+g.eggAt(x,y)+')');
    for(let i=0;i<5;i++){ H.toca(x,y); roda(g,0.1); } ok(g.eggP(k)>0,'CA6: 5 toques em '+k+' fazem a dancinha dele'); roda(g,1.3); });
  g.state='paused'; L.DEV.aba='hoje'; L.buildDev();
  const nomes=['Bia','Tonhão','Dani','Joca','Cami','Anselmo','Lia']; const bts=nomes.map(n=>acha(H.els['dev-body'],q=>q.tagName==='BUTTON' && q.textContent===n)[0]);
  ok(bts.every(Boolean),'CA6: o modo dev tem os 7 botões da seção "Dancinhas" na aba Hoje');
  bts.forEach((b,i)=>{ if(!b) return; L.buildDev(); const bb=acha(H.els['dev-body'],q=>q.tagName==='BUTTON' && q.textContent===nomes[i])[0]; bb.fire('click'); ok(g.eggP(QUEM[i])>0,'CA6: o botão "'+nomes[i]+'" dispara a dancinha'); roda(g,0);});
  g.state='playing'; roda(g,1.3);
  g.save.equipe.joca=0; g.save.equipe.cami=0; g.joca.active=false; g.cami.active=false; g.state='paused'; L.buildDev();
  ok(!acha(H.els['dev-body'],q=>q.tagName==='BUTTON' && q.textContent==='Joca').length,'CA6: quem não está no dia não tem botão (sem o Joca)');
  // o desenho: sem erro, e o coraçãozinho (2 curvas por personagem) só com movimento reduzido
  const curvas=(rm)=>{ const H2=dia({ rm }), g2=H2.g; poe(g2); let n=0; H2.ctx.bezierCurveTo=()=>{ n++; };
    g2.state='playing'; H2.L.render(g2,H2.ctx); const base=(()=>{ n=0; H2.L.render(g2,H2.ctx); return n; })();
    QUEM.forEach(k=>g2.danca(k)); g2.eggs.bia.p=0.5; Object.keys(g2.eggs).forEach(k=>{ g2.eggs[k].p=0.5; });
    n=0; H2.L.render(g2,H2.ctx); return n-base; };
  const cn=curvas(false), cr=curvas(true);
  ok(cn===0,'CA6: sem movimento reduzido a dancinha não desenha o coração ('+cn+' curvas a mais)');
  ok(cr===2*QUEM.length,'CA6: com movimento reduzido cada um dos 7 ganha o coraçãozinho parado ('+cr+' curvas a mais, esperado '+2*QUEM.length+')');
});
console.log(fails?('FALHOU: '+fails+'/'+total):('OK: '+total)); process.exit(fails?1:0);
