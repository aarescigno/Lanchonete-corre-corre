// v8.6.15, etapa 2c-r4b: lojinha em 4 grupos (Lanchonete, Equipe, Dinheiro, Gurugol) com cartões de ícone e nome
const load=require('./harness.js');
const H=load(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const grid=()=>els['shop-grid'];
const nomes=()=>grid().children.map(c=>c.children[1].textContent);
const cartoes=()=>grid().children.map(c=>c.getAttribute('data-sec'));
const voltar=els['btn-shop-voltar'];
g.save=L.normSave({bank:5000,maxDay:3,up:{tenis:true}}); g.up=g.save.up; g.buildTables(); g.save.equipe.dani=2; g.goShop(3);
// abre em Lanchonete, nos cartões
ok(grid().className==='shopcards' && cartoes().join()==='melhorias,salao,decor,manut,divulga','abre em Lanchonete, nos 5 cartões na ordem');
ok(nomes().join()==='Melhorias,Salão,Decoração,Manutenção,Divulgação','nomes dos cartões da Lanchonete');
ok(grid().children.every(c=>c.children[0].tagName==='CANVAS' && c.children.length===2),'cartão: só ícone e nome');
ok(els['shop-nav'].hidden===true,'nos cartões, sem o botão Voltar');
// grupos
L.setShopGrupo('equipe'); ok(cartoes().join()==='bia,tonhao,dani' && nomes().join()==='Bia,Tonhão,Dani','Equipe: Bia, Tonhão e Dani');
L.setShopGrupo('dinheiro'); ok(cartoes().join()==='banco,mudanca,caixa' && nomes().join()==='Banco,Mudança,Caixa','Dinheiro: Banco, Mudança (cap. 4 em diante, v9) e Caixa');
L.setShopGrupo('gurugol'); ok(grid().className.indexOf('shopgrid')===0 && els['shop-nav'].hidden===true && /Ainda ninguém avaliou/.test(txt(grid())),'Gurugol abre direto, sem cartões nem Voltar');
// abrir seção e voltar
L.setShopGrupo('lanchonete'); grid().children[0].fire('click');
ok(els['shop-nav'].hidden===false && els['shop-sec'].textContent==='Melhorias' && /Ventilador de teto/.test(txt(grid())),'abrir Melhorias: Voltar aparece');
voltar.fire('click'); ok(cartoes().join()==='melhorias,salao,decor,manut,divulga' && els['shop-nav'].hidden===true,'Voltar volta aos cartões do grupo');
grid().children[0].fire('click'); L.setShopGrupo('equipe');
ok(cartoes().join()==='bia,tonhao,dani','trocar de grupo vai aos cartões dele');
// conteúdo das seções
L.setShopTab('cursos'); ok(els['shop-sec'].textContent==='Tonhão' && /Curso de /.test(txt(grid())) && /Tonhão · nível/.test(txt(grid())),'setShopTab("cursos") cai em Equipe › Tonhão (aumento e cursos)');
L.setShopTab('bia'); { const t=nomes(); ok(t.includes('Tênis de corrida') && t.includes('Bandeja') && t.includes('Livrinho de Sudoku'),'Bia: Tênis (de corrida, pois já tem os novos), Bandeja e Sudoku'); }
L.setShopTab('melhorias'); { const t=nomes(); ok(!t.includes('Bandeja') && !t.some(n=>/Tênis|Sudoku/.test(n)) && t.includes('Jogo de pratos') && t.includes('Ventilador de teto'),'Melhorias sem os itens da Bia'); }
L.setShopTab('melhorias'); ok(/TV e som/.test(txt(grid())) && /Ventilador de teto/.test(txt(grid())),'Melhorias tem a TV e som');
L.setShopTab('divulga'); ok(!/TV e som/.test(txt(grid())) && /Contas do dia/.test(txt(grid())),'Divulgação não tem a TV e som');
// v8.9.1: cartão Manutenção muda de cor com o pior equipamento
{ const mc=()=>{ L.setShopGrupo('lanchonete'); return grid().children.find(c=>c.getAttribute('data-sec')==='manut'); };
  const cls=c=>[...c.classList._s].join(' '), ids=Object.keys(g.manut);
  ids.forEach(k=>g.manut[k]=1); let c=mc(); ok(!/alerta|perigo/.test(cls(c)),'Manutenção normal: sem cor');
  g.manut[ids[0]]=0.6; c=mc(); ok(/alerta/.test(cls(c)) && !/perigo/.test(cls(c)) && c.getAttribute('aria-label')==='Manutenção: precisa de revisão','Manutenção amarela');
  g.manut[ids[0]]=0.3; c=mc(); ok(/perigo/.test(cls(c)) && c.getAttribute('aria-label')==='Manutenção: risco de quebra','Manutenção vermelha');
  ids.forEach(k=>g.manut[k]=1); }
L.setShopTab('tonhao'); ok(!/TV e som/.test(txt(grid())),'Tonhão não tem a TV e som');
L.setShopTab('dani'); ok(!/TV e som/.test(txt(grid())) && /Dani · nível/.test(txt(grid())),'Dani: só ela');
L.setShopTab('banco'); ok(els['shop-sec'].textContent==='Banco' && /Empréstimo/.test(txt(grid())),'setShopTab("banco") acerta o grupo Dinheiro');
// reabrir a lojinha volta à Lanchonete, nos cartões
els['btn-shop-go'].fire('click'); g.goShop(4); ok(cartoes().join()==='melhorias,salao,decor,manut,divulga','a lojinha reabre em Lanchonete, nos cartões');
console.log('smoke33: '+(total-fails)+'/'+total+' ok'); process.exit(fails?1:0);
