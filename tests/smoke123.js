// v12.10.6: o cartão da Dani conta só as tarefas que dá para escolher. Spec: docs/spec-v12.10.6.md. CA1 a CA3.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const cartao=joca=>{ const H=load(), {g,L,els}=H;
  g.save=L.normSave({ dia:30, maxDay:30, bank:9000, up:{ tenis:true }, equipe:{ tonhao:1, dani:4, joca:joca?2:0 }, daniCursos:{ confCaseira:1 }, salao:{ ponto:'industrial' } });
  g.up=g.save.up; g.up.confCaseira=true; g.tablesKey=''; g.buildTables(); g.goShop(30); L.setShopTab('dani');
  return { g, L, t:txt(els['shop-grid']) }; };
bloco('CA1',()=>{ const {g,L,t}=cartao(true);
  ok(L.donoBasico(g)==='joca' && /Tarefas \(\d de 2\):/.test(t) && !/de 3\):/.test(t),'CA1: Dani no nível 4 nos doces, com o Joca no básico: "Tarefas (… de 2)" ('+(t.match(/Tarefas \([^)]*\)/)||['?'])[0]+')'); });
bloco('CA2',()=>{ const {g,L,t}=cartao(false);
  ok(L.donoBasico(g)==='dani' && /Tarefas \(\d de 3\):/.test(t),'CA2: a mesma Dani dona do básico: "de 3" ('+(t.match(/Tarefas \([^)]*\)/)||['?'])[0]+')'); });
bloco('CA3',()=>{ const {L}=load(); ok(/^v12\.10\.([6-9]|\d\d)$|^v12\.(1[1-9]|[2-9]\d)|^v1[3-9]/.test(L.VERSAO),'CA3: a VERSAO é v12.10.6 ou mais nova ('+L.VERSAO+')'); });
console.log(fails?`\n${fails} de ${total} FALHARAM`:`\nTODOS OS ${total} PASSARAM`); process.exit(fails?1:0);
