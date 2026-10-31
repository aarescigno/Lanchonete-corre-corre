// v9.0.1, etapa 2c-r6: cartão Cardápio na lojinha (cursos do Tonhão), selo "novo", conversa do cardápio no dia 2,
// balão que desvia do botão Pular e comentário do Gurugol quando o cardápio é pequeno.
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=(o)=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<20){ toque(H.els); n++; } return n; };
// passa as conversas de capítulo (que vêm primeiro) até a fala que casa com re
const ate=(H,re)=>{ let n=0; while(H.g.conversa && !re.test(H.g.conversa.fala.s) && n<60){ toque(H.els); n++; } return H.g.conversa; };
const joga=(H,fat)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; g.finishDay(); };

// ---------- 1. a seção Cardápio e a seção Tonhão ----------
{ const H=load(), {g,L,els}=H, grid=()=>els['shop-grid'];
  const cartoes=()=>grid().children.map(c=>c.getAttribute('data-sec'));
  g.save=L.normSave({bank:5000,maxDay:3}); g.up=g.save.up; g.buildTables(); g.goShop(3);
  ok(cartoes()[0]==='cardapio','o 1º cartão do grupo Lanchonete é o Cardápio');
  L.setShopTab('cardapio');
  ok(els['shop-sec'].textContent==='Cardápio' && /No cardápio hoje \(2 pratos\)/.test(txt(grid())),'abre o Cardápio: "No cardápio hoje (2 pratos)"');
  ok(/Comprar R\$ 150/.test(txt(grid())) && /Curso de Pastel/.test(txt(grid())),'os cursos estão no Cardápio, com "Comprar R$ 150" no Pastel de feira');
  ok(/Diversidade do cardápio no Gurugol/.test(txt(grid())) && /Equipe › Tonhão/.test(txt(grid())),'a diversidade no Gurugol e o aviso da experiência');
  L.setShopTab('tonhao');
  ok(!/Comprar/.test(txt(grid())) && /Cursos de cardápio concluídos/.test(txt(grid())) && /Nenhum ainda/.test(txt(grid())),'a seção Tonhão não vende curso e diz "Nenhum ainda"');
  ok(/Os cursos ficam no Cardápio\./.test(txt(grid())),'o "Faltam N de experiência" aponta para o Cardápio');
  const ver=(function f(e){ if(e.tagName==='BUTTON' && e.textContent==='Ver cursos') return e; for(const c of (e.children||[])){ const r=f(c); if(r) return r; } return null; })(grid());
  ok(!!ver,'há o botão "Ver cursos"'); ver.fire('click');
  ok(els['shop-sec'].textContent==='Cardápio','"Ver cursos" abre o Cardápio');
  g.save=L.normSave({bank:5000,maxDay:3,cursos:{pastel:1,chapa:1}}); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopTab('tonhao');
  ok(/Curso de Pastel.*\(básico\)/.test(txt(grid())) && !/Nenhum ainda/.test(txt(grid())),'com cursos feitos, a seção Tonhão lista os concluídos');
  ok(L.cursoFeito({pastel:1}) && !L.cursoFeito({}) && !L.cursoFeito({pf:1}) && L.cursoFeito({pf:2}),'cursoFeito: básico de qualquer curso ou o avançado do PF'); }

// ---------- 2. o selo "novo" ----------
{ const H=load(), {g,L,els}=H, grid=()=>els['shop-grid'];
  const card=()=>grid().children.find(c=>c.getAttribute('data-sec')==='cardapio');
  const tem=()=>card().classList.contains('novo');
  const abre=bank=>{ g.save=L.normSave({bank,maxDay:3,cursos:g.save&&g.save.cursos||{}}); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopGrupo('lanchonete'); };
  g.save=L.normSave({bank:200,maxDay:3}); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopGrupo('lanchonete');
  ok(tem(),'com R$ 200 (cabe o Pastel), o cartão tem o selo "novo"');
  card().fire('click'); els['btn-shop-voltar'].fire('click');
  ok(!tem(),'depois de abrir o Cardápio, o selo some');
  g.save.bank=300; L.setShopGrupo('lanchonete');
  ok(tem(),'com R$ 300 cabe outro curso (Salgados fritos): o selo volta');
  const H2=load(), g2=H2.g, L2=H2.L, e2=H2.els;
  g2.save=L2.normSave({bank:100,maxDay:3}); g2.up=g2.save.up; g2.buildTables(); g2.goShop(3); L2.setShopGrupo('lanchonete');
  ok(!e2['shop-grid'].children.find(c=>c.getAttribute('data-sec')==='cardapio').classList.contains('novo'),'com R$ 100, sem selo');
  g2.save=L2.normSave({bank:5000,maxDay:3}); g2.up=g2.save.up; g2.buildTables(); g2.goShop(3); g2.save.cursoDia=g2.shopNext; L2.setShopGrupo('lanchonete');
  ok(!e2['shop-grid'].children.find(c=>c.getAttribute('data-sec')==='cardapio').classList.contains('novo'),'no dia em que o curso já foi comprado, sem selo'); }

// ---------- 3. a conversa do cardápio ----------
{ const H=nova(), {g,L,els}=H, sv=g.save;
  sv.conversa=null; sv.bank=5000; sv.convCard=0;
  g.startDay(1); joga(H,400); els['btn-next'].fire('click'); passa(H);
  ok(sv.convCard===0 || sv.convCard===undefined || !sv.convCard,'depois do dia 1, sem conversa do cardápio');
  g.startDay(2);
  joga(H,400);
  ok(g.save.convCard==='pend','ao fechar o dia 2, convCard fica pendente');
  els['btn-next'].fire('click'); ate(H,/Tio, hoje/);
  ok(g.conversa && /Tio, hoje um monte de gente perguntou se só tem PF e coxinha/.test(g.conversa.fala.s),'toca a conversa, com a 1ª fala certa');
  let cap=0; while(g.conversa && cap<20){ if(g.save.conversa==='depois'||g.save.conversa==='antes'){} toque(els); cap++; }
  ok(g.save.convCard===1 && g.state==='shop' && els['shop-sec'].textContent==='Cardápio','no fim, convCard=1 e a lojinha abre no Cardápio');
  g.startDay(3); joga(H,400); els['btn-next'].fire('click'); passa(H);
  ok(g.save.convCard===1,'fechar o dia 3 depois não toca de novo'); }
{ const H=nova(), {g,L,els}=H;
  g.save.conversa=null; g.save.bank=5000; g.save.cursos=L.normCursos({pastel:1}); g.startDay(1); joga(H,400); g.startDay(2); joga(H,400); els['btn-next'].fire('click'); ate(H,/O pessoal adorou/);
  ok(g.conversa && /O pessoal adorou o prato novo!/.test(g.conversa.fala.s),'com um curso feito, toca a versão curta'); }
{ const H=load(), {g,L,els}=H;
  g.save.bank=5000; g.startDay(1); joga(H,400); g.startDay(2); joga(H,400);
  ok(g.save.convCard!=='pend','sem o Modo História, convCard nunca fica pendente'); }

// ---------- 4. o balão desvia do Pular ----------
{ const H=nova(), {g,L,els}=H;
  const { Conversa, drawConversa, HISTORIA, TW } = L;
  const ctx=new Proxy({}, { get:(t,k)=> k==='measureText' ? (s=>({width:String(s).length*9})) : (typeof t[k]==='function' ? t[k] : (()=>{})), set:(t,k,v)=>{ t[k]=v; return true; } });
  g.resetDay(1);
  const fala=HISTORIA[0].antes.find(f=>f.q==='tonhao');
  const mk=ev=>{ const c=new Conversa([fala],()=>{},true); c.evita=ev; drawConversa(ctx,g,c); return c.caixa; };
  const livre=mk(null);
  const ev={x:TW-150,y:0,w:150,h:80};
  const cx=mk(ev);
  const cruza=b=>b.x<ev.x+ev.w && b.x+b.w>ev.x && b.y<ev.y+ev.h && b.y+b.h>ev.y;
  ok(cruza(livre) && !cruza(cx),'sem desvio o balão do Tonhão cruza o Pular; com `evita` não cruza');
  const sem=mk(null); ok(sem.x===livre.x && sem.y===livre.y,'com `evita` nulo, o balão fica onde fica hoje'); }

// ---------- 5. o comentário do Gurugol ----------
{ const H=load(), {L}=H, r=[4,4,4,2,4];
  const POUCO=L.AVAL_POUCO, RUIM=['Pouca opção no cardápio.','Queria mais pratos.'];
  let a=true,b=true,c=true;
  for(let i=0;i<60;i++){
    a = a && POUCO.indexOf(L.avalComentario(r.slice(),false,false,1,[],false,false,null,true))>=0;
    b = b && RUIM.indexOf(L.avalComentario(r.slice(),false,false,1,[],false,false,null,false))>=0;
    c = c && L.avalComentario(r.slice(),false,false,1,[],false,true,null,true)==='Não tinha nada vegetariano.';
  }
  ok(a,'cardápio como pior critério e `pouco`: sai de AVAL_POUCO');
  ok(b,'sem `pouco`: "Pouca opção no cardápio." ou "Queria mais pratos."');
  ok(c,'com `semVeg` continua "Não tinha nada vegetariano."'); }

console.log('smoke39: total =',total,' fails =',fails);
