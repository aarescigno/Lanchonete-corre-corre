// v8.6.14, etapa 2c-r4a: sem o limite de 1 melhoria por dia (o limite é o dinheiro; o curso do Tonhão segue 1 por lojinha)
// e o fim do dia sem o "(n)" depois de cada critério do Gurugol (a aba Gurugol da lojinha continua com ele)
const load=require('./harness.js');
const H=load(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=(o)=>{ g.save=L.normSave(Object.assign({bank:3000,maxDay:3},o||{})); g.up=g.save.up; g.buildTables(); g.goShop(3); };
const custo=id=>L.UPGRADES.find(x=>x.id===id).cost;
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');

novo(); const b0=g.save.bank;
ok(g.buy('tenis') && g.buy('bandeja') && g.buy('ventilador'),'Tênis, Bandeja e Ventilador na mesma lojinha');
ok(g.save.bank===b0-custo('tenis')-custo('bandeja')-custo('ventilador'),'e o dinheiro certo');
ok(!g.buy('tenis'),'a mesma melhoria 2 vezes continua recusada');
ok(/à vontade/.test(els['shop-limit'].textContent),'aviso sem o limite');
novo({bank:100}); ok(!g.buy('tenis') && g.save.bank===100,'sem dinheiro, recusa');
novo(); ok(!g.buy('corrida'),'Tênis de corrida antes dos Tênis novos: recusado');
ok(g.buy('tenis') && g.buy('corrida'),'e depois dos novos, na mesma lojinha, compra');
// o curso: 1 por lojinha
{ novo(); const ids=L.CURSOS.map(c=>c.id); let n=0; for(const id of ids) if(g.buyCurso(id)) n++;
  ok(n===1 && g.cursoTrava,'2º curso no mesmo dia continua recusado ('+n+' comprado)'); }
// a caixa do fim do dia
{ const aval={geral:null,dia:{nota:4,crit:[4,4,4,4,4,4],cnt:[3,3,3,3,3,3]},n:3};
  const a=L.gurugolCaixa(aval,undefined,true), b=L.gurugolCaixa(aval);
  ok(!L.AVAL_CRIT.some(c=>txt(a).includes(c.nome+' (')),'fim do dia: nomes dos critérios sem "("');
  ok(L.AVAL_CRIT.every(c=>txt(b).includes(c.nome+' (3)')),'aba Gurugol: continua com o (n)'); }
console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
