// v12.10.7: o couvert sem a porcentagem. Spec: docs/spec-v12.10.7.md. CA1 e CA2.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
bloco('CA1',()=>{ const H=load(), {g,L,els}=H;
  g.save=L.normSave({ dia:50, maxDay:50, bank:9000, up:{ tenis:true }, equipe:{ tonhao:1 }, salao:{ ponto:'avenida' } });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(50); L.setShopTab('melhorias');
  const t=txt(els['shop-grid']), m=t.match(/Cobrar couvert[^)]*\)/);
  ok(m && /\(o efeito fica menor\)$/.test(m[0]) && !/%/.test(m[0]),'CA1: o botão do couvert diz "(o efeito fica menor)", sem "%" ('+(m?m[0]:'sem o botão')+')'); });
bloco('CA2',()=>{ const {L}=load(); ok(/^v12\.10\.([7-9]|\d\d)$|^v12\.(1[1-9]|[2-9]\d)|^v1[3-9]/.test(L.VERSAO),'CA2: a VERSAO é v12.10.7 ou mais nova ('+L.VERSAO+')'); });
console.log(fails?`\n${fails} de ${total} FALHARAM`:`\nTODOS OS ${total} PASSARAM`); process.exit(fails?1:0);
