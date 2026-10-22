// v8.1, dinheiro comprometido: a lojinha mostra o que já é da folha (e da divulgação) do próximo dia e o que sobra
// livre; compra que come esse dinheiro deixa o botão em alerta e pede um 2º toque, dizendo o que fica de fora.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load(); const {g,L,els}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);
const botao=re=>acha(els['shop-grid'],e=>e.tagName==='BUTTON'&&re.test(e.textContent));
const novo=(bank,equipe,divulga)=>{ g.save=L.normSave({maxDay:7,bank,equipe,divulga}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };

// ---------- regras ----------
{ const eq={tonhao:1,dani:1,tv:true,som:true,couvert:false};
  ok(L.folhaCortes(eq,null,1000).length===0,'com dinheiro, nada fica de fora');
  ok(L.folhaCortes(eq,null,50).join()==='som,TV,Dani' && eq.dani===1 && eq.tv,'folhaCortes segue a ordem do payDay e não mexe na equipe');
  ok(L.folhaCortes(eq,L.divulgaOf('redes'),200).join()==='redes sociais','a divulgação sai antes da equipe');
  ok(L.folhaItens(eq,L.divulgaOf('panfleto')).join()==='aumento do Tonhão,Dani,TV,som,panfletos','folhaItens lista o que se paga ao abrir');
  ok(L.listaE(['TV','Dani'])==='TV e Dani' && L.listaE(['a','b','c'])==='a, b e c','listaE junta com "e"'); }

// ---------- o caso do jogador: R$ 159, Dani e TV, compra de mesa ----------
novo(159,{dani:1,tv:true},'boca'); g.goShop(3); L.setShopTab('salao');
ok(g.compromisso===75 && g.livre===84,'R$ 159 com Dani (60) e TV (15): R$ 75 comprometidos, R$ 84 livres');
ok(/livre R\$ 84/.test(els['shop-livre'].textContent) && /R\$ 75 reservados para Dani e TV/.test(els['shop-livre'].textContent),'o alto da lojinha mostra o livre e o que está reservado: '+els['shop-livre'].textContent);
{ const b=botao(/Mesa de 2/), p=L.SALAO.mesa2, n=g.save.salao.mesas.length;
  ok(p>84 && p<=159,'a mesa de 2 custa mais que o livre e menos que o total');
  ok(b && !b.disabled && b.classList.contains('warn'),'o botão da mesa fica em alerta');
  ok(/sem TV e Dani/.test(b.getAttribute('data-aviso')) && /sem TV e Dani/.test(b.title),'o alerta diz o que fica de fora');
  b.fire('click');
  ok(g.save.salao.mesas.length===n && g.save.bank===159 && /^Confirmar: sem TV e Dani$/.test(b.textContent),'1º toque só avisa: '+b.textContent);
  b.fire('click');
  ok(g.save.salao.mesas.length===n+1 && g.save.bank===159-p,'2º toque compra');
  ok(/faltam R\$ 66 para a folha: o dia 3 abre sem TV e Dani/.test(els['shop-livre'].textContent) && els['shop-livre'].className==='livre falta','depois, o alto avisa em vermelho: '+els['shop-livre'].textContent);
  const b2=botao(/Mesa de 2/); ok(!b2 || b2.disabled || !b2.classList.contains('warn'),'já sem dinheiro para a folha, outra compra não avisa de novo o que já ficou de fora');
  g.begin(); ok(g.unpaid.join()==='TV,Dani','ao abrir, ficam de fora exatamente os avisados'); }

// ---------- sem alerta quando o livre paga ----------
novo(500,{dani:1,tv:true},'boca'); g.goShop(3); L.setShopTab('salao');
{ const b=botao(/Mesa de 2/); ok(b && !b.classList.contains('warn') && !b.getAttribute('data-aviso'),'com o livre pagando a mesa, botão normal');
  const n=g.save.salao.mesas.length; b.fire('click'); ok(g.save.salao.mesas.length===n+1,'1 toque compra'); }
novo(159,{},'boca'); g.goShop(3);
ok(g.compromisso===0 && els['shop-livre'].textContent==='','sem folha, o alto fica como antes');

// ---------- melhorias, manutenção e divulgação ----------
novo(240,{dani:1},'panfleto'); g.goShop(3); L.setShopTab('melhorias');
ok(g.compromisso===100 && /R\$ 100 reservados para Dani e panfletos/.test(els['shop-livre'].textContent),'a divulgação entra no reservado');
{ const u=L.UPGRADES.find(x=>x.cost>140&&x.cost<=240), b=botao(new RegExp('^Comprar R\\$ '+u.cost+'$'));
  ok(b && b.classList.contains('warn') && /sem panfletos/.test(b.getAttribute('data-aviso')),'melhoria que come a folha: alerta ('+u.name+')');
  b.fire('click'); ok(!g.up[u.id],'1º toque não compra'); b.fire('click'); ok(g.up[u.id] && g.save.bank===240-u.cost,'2º toque compra'); }
console.log('total =',total,' fails =',fails);
process.exit(fails?1:0);
