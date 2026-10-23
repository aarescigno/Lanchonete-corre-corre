// v8.3.5, estoque do salão: mesas guardadas fora do salão (não abrem no dia nem pagam luz e gás, mas contam no teto),
// guardar e tirar pelos métodos e pelo editor (arrastar e balãozinho), desfazer, compra com o salão cheio e o save.
const H=require('./harness.js')(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const S=L.SALAO, P=L.PONTOS[0], mesas=()=>g.save.salao.mesas, est=()=>g.estoque, lug=()=>L.salaoLugares(mesas());
const novo=(bank)=>{ g.save=L.normSave({maxDay:3,bank:bank==null?5000:bank}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.goShop(3); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);
const pop=()=>acha(els['shop-grid'],e=>/ed-pop/.test(e.className||''));
const botao=(raiz,re)=>acha(raiz,e=>e.tagName==='BUTTON'&&re.test(e.textContent));

// save
novo();
ok(Array.isArray(g.save.salao.estoque) && !est().length,'save novo: estoque vazio');
{ const n=L.normSalao({mesas:L.salaoKit(P),estoque:[{seats:4,c:1},{seats:3},'lixo',{seats:2,c:9}]});
  ok(n.estoque.length===2 && n.estoque[0].seats===4 && n.estoque[0].c===1 && n.estoque[1].c>=0 && n.estoque[1].c<=3,'save do estoque: mesa estragada sai, cor fora da lista vira outra'); }
{ const n=L.normSalao({mesas:L.salaoKit(P),estoque:[{seats:4},{seats:4}]});
  ok(L.salaoLugares(n.mesas)+L.salaoLugares(n.estoque)<=16 && L.salaoLugares(n.mesas)===10,'salão e estoque passam do teto: sai a do estoque'); }
{ const n=L.normSalao({mesas:[],estoque:[{seats:4,c:2}]});
  ok(n.mesas.length===1 && n.mesas[0].seats===4 && !n.estoque.length && !L.salaoProblema(n.mesas,P),'salão vazio com estoque: a mesa do estoque volta para o salão'); }

// guardar e tirar
novo(); const n0=mesas().length, b0=g.save.bank;
ok(g.guardarMesa(1) && mesas().length===n0-1 && est().length===1 && g.save.bank===b0 && g.salaoUndo.length===1,'guardar no estoque: de graça e dá para desfazer');
ok(g.tables.length===n0-1 && L.contasDia(g.tables,P)<L.contasDia(L.salaoKit(P).map(m=>({seats:m.seats,open:true})),P),'mesa no estoque não abre no dia nem paga luz e gás');
ok(g.desfazerSalao() && mesas().length===n0 && !est().length,'Desfazer volta a mesa para o salão');
g.guardarMesa(0); g.guardarMesa(0); g.guardarMesa(0);
ok(mesas().length===1 && est().length===3 && !g.guardarMesa(0) && /pelo menos 1 mesa/.test(g.salaoMsg),'o salão fica com pelo menos 1 mesa');
ok(g.tirarMesa(0) && mesas().length===2 && est().length===2 && !L.salaoProblema(mesas(),P) && g.salaoSel>=0,'Pôr no salão: a mesa entra no primeiro lugar livre e fica escolhida');
{ const m=mesas()[0]; ok(!g.tirarMesa(0,m.x+20,m.y) && /Perto demais/.test(g.salaoMsg) && est().length===2,'tirar para cima de outra mesa: recusa'); }
// teto contando o estoque
novo(); g.buyMesa(2); g.buyMesa(4); ok(g.lugaresTot===16,'16 lugares');
g.guardarMesa(0);
ok(lug()<16 && g.lugaresTot===16 && !g.buyMesa(2) && /16 pessoas/.test(g.salaoMsg),'mesa no estoque conta no teto: não compra mais');
{ const k=est()[0].seats===2?0:-1; if(k===0) ok(!g.virarMesa(0,true),'no teto, a do estoque não vira mesa de 4'); }
{ const b=g.save.bank, v=Math.round(L.mesaPreco(est()[0].seats)*S.venda); ok(g.venderMesa(0,true) && !est().length && g.save.bank===b+v,'vender a mesa do estoque'); }
novo(); g.guardarMesa(mesas().findIndex(m=>m.seats===2));
{ const b=g.save.bank; ok(g.virarMesa(0,true) && est()[0].seats===4 && g.save.bank===b-S.virar && g.estoqueSel===0,'a mesa de 2 do estoque vira mesa de 4'); }
{ const c=(est()[0].c+1)%4; ok(g.pintarMesa(0,c,true) && est()[0].c===c && g.estoqueSel===0 && g.desfazerSalao() && est()[0].c!==c,'cor das cadeiras no estoque (e Desfazer)'); }
// compra com o salão sem lugar: vai para o estoque
{ g.save.salao={ponto:'garagem',mesas:[{x:440,y:320,seats:4,c:0}],estoque:[]}; g.buildTables(); g.save.bank=1000;
  const area=P.area; P.area={x0:370,y0:250,x1:510,y1:400};
  let r; try{ r=g.buyMesa(2); } finally { P.area=area; }
  ok(r && mesas().length===1 && est().length===1 && g.estoqueSel===0 && /estoque/.test(g.salaoMsg) && g.save.bank===1000-S.mesa2,'sem lugar no salão, a mesa comprada vai para o estoque'); }

// editor: arrastar para o estoque e de volta, balãozinho
novo(); L.setShopTab('salao');
const cv=()=>acha(els['shop-grid'],e=>e.tagName==='CANVAS');
const tela=(x,y)=>({clientX:x*960/800, clientY:(y-56)*600/484});
const ev=(p,o)=>Object.assign({preventDefault(){}, pointerId:1, pointerType:'mouse'},p,o||{});
const arrasta=(a,b)=>{ const c=cv(); c.fire('pointerdown',ev(tela(a.x,a.y))); c.fire('pointermove',ev(tela((a.x+b.x)/2,(a.y+b.y)/2))); c.fire('pointermove',ev(tela(b.x,b.y))); c.fire('pointerup',ev(tela(b.x,b.y))); };
ok(/ESTOQUE|estoque/.test(txt(els['shop-grid'])),'aba Salão fala do estoque');
{ const m=mesas()[0], n=mesas().length; arrasta(m,{x:100,y:300});
  ok(mesas().length===n-1 && est().length===1 && /No estoque: 1 mesa/.test(txt(els['shop-grid'])),'arrastar a mesa para o estoque'); }
{ const c=cv(); c.fire('pointerdown',ev(tela(56,195))); c.fire('pointerup',ev(tela(56,195)));
  ok(g.estoqueSel===0 && g.salaoSel<0,'tocar na mesa do estoque escolhe a mesa');
  const p=pop(); ok(!!p && /Mesa no estoque/.test(txt(p)) && !!botao(p,/Pôr no salão/) && !!botao(p,/Vender/),'balãozinho do estoque: pôr no salão e vender');
  botao(p,/Pôr no salão/).fire('click'); ok(!est().length && mesas().length===4,'botão Pôr no salão'); }
{ g.salaoSel=1; L.setShopTab('salao'); const p=pop(), n=mesas().length; ok(!!botao(p,/Guardar no estoque/),'balãozinho da mesa do salão: guardar no estoque');
  botao(p,/Guardar no estoque/).fire('click'); ok(mesas().length===n-1 && est().length===1,'botão Guardar no estoque'); }
{ // do estoque para um lugar livre do salão, arrastando
  const m=est()[0], alvo=L.salaoVaga(mesas(),m.seats,P); arrasta({x:56,y:195},alvo);
  ok(!est().length && mesas().some(x=>x.x===alvo.x&&x.y===alvo.y),'arrastar do estoque para o salão'); }
{ g.guardarMesa(0); const o=mesas()[0], n=mesas().length; arrasta({x:56,y:195},{x:o.x+20,y:o.y});
  ok(est().length===1 && mesas().length===n && /Aí não dá: perto demais/.test(txt(els['shop-grid'])),'do estoque para cima de outra mesa: volta e explica'); }
let err=null; try{ L.render(g,H.ctx); }catch(e){ err=e; } ok(!err,'o salão ao fundo redesenha'+(err?': '+err:''));
// o dia joga só com as mesas do salão
{ g.startDay(3); ok(g.tables.length===mesas().length && est().length===1,'no dia, só as mesas do salão'); }
console.log('total = '+total+'  fails = '+fails); if(fails) process.exit(1);
