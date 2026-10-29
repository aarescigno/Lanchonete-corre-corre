// v7.3, retorno do Renan: Bia mais rápida (base 300 e 2 níveis de tênis), selos da fila no salão
// (vez de cada ação, mesa repetida permitida, cancelar só pelo quadrinho da fila) e a lojinha.
const H=require('./harness.js')(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=up=>{ g.save=L.normSave({bank:2000,maxDay:5,up:up||{}}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const J=o=>JSON.stringify(o);

// velocidade
novo(); ok(g.bia.speed===300,'base 300 px/s');
novo({tenis:true}); ok(Math.abs(g.bia.speed-330)<1e-9,'Tênis novos: 330 (+10%)');
novo({tenis:true,corrida:true}); ok(Math.abs(g.bia.speed-360)<1e-9,'Tênis de corrida: 360 (+20%, não soma com os +10%)');
{ const u=L.UPGRADES.find(x=>x.id==='corrida'); ok(u&&u.req==='tenis'&&u.cost===350,'Tênis de corrida: R$ 350, pedem os Tênis novos'); }

// compra: corrida só depois dos tênis, uma melhoria por visita
novo(); g.goShop(2); ok(!g.buy('corrida'),'sem os Tênis novos não compra os de corrida');
ok(g.buy('tenis')&&g.save.bank===1850,'compra os Tênis novos');
ok(!g.buy('corrida'),'na mesma visita não leva a 2ª melhoria');
g.goShop(3); ok(g.buy('corrida')&&g.save.bank===1500&&g.up.corrida,'na visita seguinte compra os Tênis de corrida');

// lojinha: o cartão dos tênis vira o de corrida; a grade continua com 6
const cartoes=()=>els['shop-grid'].children.map(c=>c.children[1].textContent);
novo(); g.goShop(2); L.setShopTab('melhorias');
ok(cartoes().length===8&&cartoes()[0]==='Tênis novos'&&!cartoes().includes('Tênis de corrida'),'antes: Tênis novos na grade de 8 (com o Triturador, v8.3.10, e o Livrinho de Sudoku, v8.6.3)');
novo({tenis:true}); g.goShop(3); L.setShopTab('melhorias');
ok(cartoes().length===8&&cartoes()[0]==='Tênis de corrida'&&!cartoes().includes('Tênis novos'),'com os Tênis novos: o cartão vira Tênis de corrida');
novo({tenis:true,corrida:true}); g.goShop(4); L.setShopTab('melhorias');
ok(cartoes()[0]==='Tênis de corrida'&&els['shop-grid'].children[0].children[3].textContent==='Já comprado','Tênis de corrida já comprados');

// selos da fila
novo(); g.startDay(3); g.begin();
const grp=new L.Group(g,'estudante',990,0);
const t=g.tables.find(x=>x.open&&x.seats>=grp.size); t.group=grp; grp.table=t; grp.seated=true; grp.setState('wantOrder');
ok(g.tapTable(t)&&g.tapStation('coffee')&&g.tapTable(t),'toca na mesa, no cafezinho e de novo na mesma mesa');
ok(g.bia.acts.length===3,'o 2º toque na mesa entra na fila (não cancela nem é ignorado)');
ok(J(g.bia.marks())===J({['table:'+t.id]:[1,3],coffee:[2]}),'selos: mesa com 1º e 3º, cafezinho com 2º');
ok(g.bia.acts.every(a=>typeof a.t0==='number'),'cada ação guarda a hora em que entrou (para o pulinho do selo)');
// cancelar só pelo quadrinho: o toque no slot 1 (cafezinho) tira só ele e renumera
g.onDown(L.HUDX.fila+360+1*52+20,570,0);   // v7.6: a fila de ações anda HUDX.fila na tela larga
ok(J(g.bia.marks())===J({['table:'+t.id]:[1,2]}),'tocar no 2º quadrinho cancela o cafezinho; a mesa fica com 1º e 2º');
// prato pronto não repete
g.kitchen.plates=[{id:77,table:t.id,group:grp,dish:'pf',slot:0,age:0},null,null,null];
ok(g.tapStation('plates',806,270)&&!g.tapStation('plates',806,270),'prato pronto: o 2º toque não repete');
ok(J(g.bia.marks()['plate:77'])===J([3]),'selo 3º no prato');
// o selo some quando a Bia faz a ação
let st=0; while(g.bia.acts.length===3&&st<2000){ g.update(0.02); st++; }
ok(g.bia.acts.length===2&&J(g.bia.marks()[ 'table:'+t.id])===J([1]),'feita a 1ª ação, a mesa fica só com o 1º (o antigo 2º)');

// desenho com e sem prefers-reduced-motion, com selos na tela
let err=null; try{ L.render(g,H.ctx); }catch(e){ err=e; } ok(!err,'render com selos'+(err?': '+err:''));
{ const H2=require('./harness.js')({rm:true}); const g2=H2.g; g2.startDay(3); g2.begin(); g2.bia.enqueue({type:'sink'}); g2.bia.enqueue({type:'coffee'});
  let e2=null; try{ H2.L.render(g2,H2.ctx); }catch(e){ e2=e; } ok(!e2,'render com RM e selos'); }

console.log(total-fails+'/'+total+' ok; fails= '+fails);
process.exit(fails?1:0);
