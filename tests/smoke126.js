// v12.11.1: a espera no seco e as pernas no sofá da Avenida (spec: docs/spec-v12.11.1.md). CA1 e CA2 (CA3 é a captura shot_v12_11_1.js).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
bloco('CA1',()=>{ const {L}=load();
  ok(['garagem','industrial'].every(p=>L.chuvaNaRua(L.pontoOf(p))) && ['avenida','terraco'].every(p=>!L.chuvaNaRua(L.pontoOf(p))),'CA1: chuvaNaRua é verdadeira na Garagem e na área industrial e falsa na Avenida e no Terraço');
  let n=0, prev=0; for(let t=0;t<60;t+=0.05){ const v=L.relampago(t); if(v>0 && prev===0) n++; prev=v; }
  ok(n>=5 && n<=10,'CA1: relampago dá de 5 a 10 clarões em 60 s ('+n+')');
  let max=0; for(let t=0;t<60;t+=0.05) max=Math.max(max,L.relampago(t)); ok(max>0.5 && max<=1,'CA1: o clarão chega perto de 1 ('+max.toFixed(2)+')');
  });
bloco('CA1rm',()=>{ const {L}=load({rm:true}); let soma=0; for(let t=0;t<60;t+=0.05) soma+=L.relampago(t);
  ok(soma===0,'CA1: com movimento reduzido relampago dá sempre 0'); });
const achaBotao=(no,txt)=>{ if(no.tagName==='BUTTON' && String(no.textContent).indexOf(txt)>=0) return no; for(const c of (no.children||[])){ const r=achaBotao(c,txt); if(r) return r; } return null; };
bloco('CA2',()=>{ const H=load(), {L,g}=H;
  g.mode='carreira'; g.save=L.normSave({dia:10,maxDay:10,bank:9000,salao:{ponto:'avenida'}}); g.up=g.save.up; g.setDev(true); g.buildTables(); g.goShop(10);
  g.clima='chuva'; g.state='playing'; L.DEV.aba='hoje'; L.buildDev();
  const b=achaBotao(H.els['dev-body'],'Relâmpago agora'); ok(!!b,'CA2: o modo dev tem o botão "Relâmpago agora" na aba Hoje em dia de chuva');
  g.anim=100.1; const antes=L.relampago(g.anim); b && b.fire('click');
  ok(L.DEV.relampago===g.anim && L.relampago(g.anim)>0 && antes===0,'CA2: o botão faz o relampago passar de 0 ('+antes+' → '+L.relampago(g.anim)+')');
  g.clima='sem'; L.buildDev(); ok(!achaBotao(H.els['dev-body'],'Relâmpago agora'),'CA2: sem chuva o botão não aparece'); });
console.log(fails?('FALHOU: '+fails+'/'+total):('OK: '+total)); process.exit(fails?1:0);
