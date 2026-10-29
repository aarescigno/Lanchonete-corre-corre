// v8.6.4: decoração da Garagem (aba Decoração da lojinha). Plantas e o cantinho da Rosa (save.decor) e a toalha
// xadrez de cada mesa ({ t:1 }). Só visual: nada muda nas contas do dia nem nas avaliações.
const H=require('./harness.js')(); const {g,L,ctx,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=s=>{ g.save=L.normSave(Object.assign({bank:500,dia:5},s||{})); g.up=g.save.up; g.boughtFor=0; g.shopBought=false; g.buildTables(); };

ok(L.DECOR.length===6 && L.DECOR.every(d=>d.cost>0 && L.DECOR_GRUPOS.some(x=>x.id===d.grupo)),'6 enfeites, cada um com preço e grupo');
ok(JSON.stringify(L.normDecor({espada:1,foto:0,xyz:1}))==='{"espada":1,"foto":0}' && JSON.stringify(L.normDecor(null))==='{}','normDecor: só os enfeites que existem, 1 à mostra e 0 guardado');

// as plantas da v7.7 saíram: o jogo começa sem enfeite nenhum
novo(); ok(JSON.stringify(g.save.decor)==='{}' && !L.decorOn(g,'espada') && !L.decorOn(g,'lata'),'save novo: sem plantas nem enfeites');

// compra: à vontade, fora da melhoria do dia, e vai para o caixa do salão
novo(); g.goShop(5); { const d=L.decorOf('samambaia'), b0=g.save.bank;
  ok(g.buyDecor('samambaia') && g.save.bank===b0-d.cost && g.save.decor.samambaia===1 && L.decorOn(g,'samambaia'),'comprou a samambaia (à mostra)');
  ok(g.save.caixaPend.sal===d.cost,'o gasto entra no caixa do salão');
  ok(!g.buyDecor('samambaia') && g.save.bank===b0-d.cost,'não compra o mesmo enfeite 2 vezes');
  ok(g.buyDecor('foto') && g.buyDecor('giz') && g.buyDecor('placa') && g.buyDecor('espada') && g.buyDecor('lata'),'compra todos no mesmo dia');
  ok(!g.shopBought && g.buy('bandeja'),'e a melhoria do dia continua livre');
  ok(!g.buyDecor('nada'),'enfeite que não existe não compra'); }
novo({bank:5}); ok(!g.buyDecor('giz') && g.save.bank===5,'sem dinheiro não compra');

// guardar e pôr de volta, de graça
novo({decor:{foto:1}}); { const b0=g.save.bank;
  ok(g.mostraDecor('foto',false) && g.save.decor.foto===0 && !L.decorOn(g,'foto') && g.save.bank===b0,'guardou a foto');
  ok(g.mostraDecor('foto',true) && L.decorOn(g,'foto'),'pôs a foto de volta');
  ok(!g.mostraDecor('giz',true),'não põe o que não comprou'); }
{ const s=L.normSave(JSON.parse(JSON.stringify(Object.assign({}, g.save, {decor:{foto:0,giz:1}})))); ok(s.decor.foto===0 && s.decor.giz===1,'o save guarda a decoração'); }

// toalha xadrez: por mesa, vai junto com a mesa
novo(); g.goShop(5); { const b0=g.save.bank, n=g.save.salao.mesas.length;
  ok(g.buyToalha(0) && g.save.salao.mesas[0].t===1 && g.save.bank===b0-L.TOALHA.cost,'toalha na mesa 1');
  ok(!g.buyToalha(0),'a mesma mesa não leva 2 toalhas');
  g.buildTables(); ok(g.tables[0].toalha===true && g.tables.slice(1).every(t=>!t.toalha),'a mesa do dia sabe da toalha');
  ok(g.guardarMesa(0) && g.estoque.length===1 && g.estoque[0].t===1,'guardada no estoque, com a toalha');
  ok(g.tirarMesa(0) && g.save.salao.mesas.filter(m=>m.t).length===1 && !g.estoque.length,'de volta ao salão, com a toalha');
  ok(L.normSalao(JSON.parse(JSON.stringify(g.save.salao))).mesas.filter(m=>m.t).length===1,'normSalao mantém a toalha');
  ok(g.semToalha.length===n-1,'faltam '+(n-1)+' mesas');
  const b1=g.save.bank; ok(g.buyToalhas() && g.semToalha.length===0 && g.save.bank===b1-(n-1)*L.TOALHA.cost,'toalha em todas de uma vez');
  ok(!g.buyToalhas(),'com todas, não cobra de novo');
  const k=g.save.salao.mesas.length; ok(g.venderMesa(0) && g.save.salao.mesas.length===k-1,'vendeu uma mesa (a toalha vai junto)'); }
novo({bank:5}); g.goShop(5); ok(!g.buyToalha(0) && !g.save.salao.mesas[0].t,'sem dinheiro, sem toalha');

// lojinha: a aba Decoração
const cartoes=()=>els['shop-grid'].children;
novo({decor:{espada:1,foto:0}}); g.goShop(5); L.setShopTab('decor'); {
  const c=cartoes(), nome=i=>c[i].children[2].textContent, btn=i=>c[i].children[c[i].children.length-1].textContent;
  ok(c.length===7,'7 cartões: 6 enfeites e a toalha');
  ok(nome(0)==='Espada-de-são-jorge' && btn(0)==='Guardar','espada comprada: Guardar');
  ok(btn(1)==='Comprar R$ 8','lata: Comprar R$ 8');
  ok(btn(3)==='Pôr de volta','foto guardada: Pôr de volta');
  ok(nome(6)==='Toalha xadrez' && /Pôr em todas/.test(btn(6)),'toalha: Pôr em todas'); }

// desenho: tudo à mostra, com e sem toalha, no dia, no editor e nos ícones
novo({decor:{espada:1,lata:1,samambaia:1,foto:1,giz:1,placa:1}}); g.save.salao.mesas.forEach(m=>{ m.t=1; }); g.buildTables(); g.startDay(5); g.begin();
{ let err=null; try{ L.render(g,ctx); }catch(e){ err=e; } ok(!err,'desenha o dia com tudo'+(err?': '+err.message:'')); }
g.goShop(5); { let err=null; try{ L.setShopTab('decor'); L.setShopTab('salao'); }catch(e){ err=e; } ok(!err,'desenha a aba Decoração e o editor'+(err?': '+err.message:'')); }

console.log((fails?'FALHOU':'OK')+' smoke30: '+(total-fails)+'/'+total);
process.exit(fails?1:0);
