// v12.10.5: os relatórios do Teste e dos Desafios guardados no aparelho. Spec: docs/spec-v12.10.5.md. CA1 a CA7.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const acaba=(g)=>{ g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+20; roda(g,3); };
const copia=(H)=>{ const cap={ v:null, n:0 }, cr=H.doc.createElement; H.doc.createElement=t=>{ const e=cr(t); e.select=()=>{}; return e; }; H.doc.body={ appendChild(c){ cap.v=c.value; cap.n++; }, removeChild(){} }; H.doc.execCommand=()=>true; return cap; };
const R=n=>'LCC-TESTE 3 garagem\nJogador: Ana · 23/11/2026 10:'+String(n).padStart(2,'0')+'\nlinha '+n;

(async()=>{
  // CA3 e CA1 (funções): ordem, junção, corte nas linhas em branco
  bloco('CA3',()=>{ const H=load(), {L,store}=H;
    ok(L.RELS_LS==='lcc-relatorios' && L.RELS_MAX===200,'CA3: a chave lcc-relatorios e o máximo 200');
    ok(Array.isArray(L.relsLe()) && L.relsLe().length===0 && L.relsTexto()==='','CA3: sem nada guardado, relsLe é [] e relsTexto é vazio');
    [1,2,3].forEach(n=>L.relsGuarda(R(n)));
    const t=L.relsTexto(), blocos=t.split(/\n\n(?=LCC-TESTE )/);
    ok(t===L.relsLe().join('\n\n') && blocos.length===3 && blocos.every((b,i)=>b===R(i+1)),'CA3: relsTexto junta com uma linha em branco e os blocos, cortados antes de "LCC-TESTE ", ficam iguais aos guardados'); });
  // CA2
  bloco('CA2',()=>{ const H=load(), {L,store}=H;
    for(let i=0;i<201;i++) L.relsGuarda(R(i));
    const a=L.relsLe(); ok(a.length===200 && a[0]===R(1) && a[199]===R(200),'CA2: com 201 guardados ficam os 200 mais novos ('+a.length+')');
    L.relsGuarda('lixo'); L.relsGuarda(42); L.relsGuarda(null); ok(L.relsLe().length===200,'CA2: texto que não começa com "LCC-TESTE " (ou não é texto) não entra');
    store['lcc-relatorios']=JSON.stringify([R(1),7,'lixo',null,R(2)]); ok(L.relsLe().join('|')===[R(1),R(2)].join('|'),'CA2: ao ler, só ficam os textos que começam com "LCC-TESTE "');
    store['lcc-relatorios']='{quebrado'; ok(L.relsLe().length===0,'CA2: JSON quebrado vira lista vazia');
    store['lcc-relatorios']='{"a":1}'; ok(L.relsLe().length===0,'CA2: formato errado (não é lista) vira lista vazia');
    L.relsGuarda(R(9)); ok(L.relsLe().length===1,'CA2: depois de dado quebrado, guardar recomeça a lista');
    L.relsApaga(); ok(store['lcc-relatorios']==='[]' && L.relsLe().length===0,'CA2: relsApaga grava []'); });
  // CA1: o fim do Teste e o do Desafio guardam
  bloco('CA1',()=>{ const H=load(), {g,L}=H;
    g.startTeste('garagem'); acaba(g); const r1=g.testeRel;
    ok(g.state==='testefim' && /^LCC-TESTE /.test(r1) && L.relsLe().length===1 && L.relsLe()[0]===r1,'CA1: depois do finishTeste, o relatório está guardado, igual ao testeRel');
    g.sairDesafio&&g.sairDesafio(); g.startDesafio('soBia'); acaba(g); const r2=g.testeRel;
    ok(g.state==='desafiofim' && /^LCC-TESTE /.test(r2) && L.relsLe().length===2 && L.relsLe()[0]===r1 && L.relsLe()[1]===r2,'CA1: depois do finishDesafio, o 2º relatório está guardado, na ordem, igual ao testeRel'); });
  // CA4, CA5, CA6: os botões
  try{
    { const H=load(), {g,L,els}=H; g.setDev(true); g.setDev(true);
      L.buildTeste&&0; g.setState('teste');
      const caixa=()=>todos(els['teste-lista'],n=>n.id==='teste-rels')[0], bt=k=>todos(caixa(),n=>n.getAttribute&&n.getAttribute('data-rels')===k)[0];
      ok(!!caixa() && bt('copia') && bt('apaga') && bt('copia').disabled && bt('apaga').disabled && /Copiar todos \(0\)/.test(bt('copia').textContent),'CA4: na tela do Teste, com a lista vazia, "Copiar todos (0)" e "Apagar relatórios" desabilitados');
      [1,2,3].forEach(n=>L.relsGuarda(R(n))); g.setState('teste');
      ok(bt('copia').textContent==='Copiar todos (3)' && !bt('copia').disabled && !bt('apaga').disabled && bt('apaga').textContent==='Apagar relatórios','CA4: com 3 guardados, "Copiar todos (3)" e os dois habilitados');
      g.setState('menu'); L.abrirDev(); L.DEV.aba='pular'; L.buildDev();
      const dc=todos(els['dev-body'],n=>n.id==='dev-rels')[0], dbt=k=>todos(dc,n=>n.getAttribute&&n.getAttribute('data-rels')===k)[0];
      ok(/Relatórios guardados/.test(txt(els['dev-body'])) && !!dc && dbt('copia').textContent==='Copiar todos (3)','CA4: no painel do modo dev, a seção "Relatórios guardados" com "Copiar todos (3)"');
      L.relsApaga(); L.buildDev(); const dc2=todos(els['dev-body'],n=>n.id==='dev-rels')[0];
      ok(todos(dc2,n=>n.getAttribute&&n.getAttribute('data-rels')==='copia')[0].disabled,'CA4: no painel do dev, com a lista vazia, os botões ficam desabilitados'); }
    // CA5 e CA6 com a cópia aceita
    { const H=load(), {g,L,els}=H, cap=copia(H); g.setDev(true); [1,2,3].forEach(n=>L.relsGuarda(R(n))); g.setState('teste');
      const caixa=()=>todos(els['teste-lista'],n=>n.id==='teste-rels')[0], bt=k=>todos(caixa(),n=>n.getAttribute&&n.getAttribute('data-rels')===k)[0], aviso=()=>txt(todos(caixa(),n=>n.tagName==='P')[0]);
      bt('copia').fire('click'); await espera(10);
      ok(cap.v===L.relsTexto() && aviso()==='Copiados 3 relatórios! Cole na conversa.' && todos(caixa(),n=>n.tagName==='TEXTAREA').length===0,'CA5: o toque copia o relsTexto e avisa "Copiados 3 relatórios! Cole na conversa."');
      // CA6: 1º toque não apaga
      bt('apaga').fire('click');
      ok(L.relsLe().length===3 && bt('apaga').textContent==='Toque de novo para apagar','CA6: o 1º toque em "Apagar relatórios" não apaga e pede "Toque de novo para apagar"');
      bt('copia').fire('click'); await espera(10);
      ok(bt('apaga').textContent==='Apagar relatórios' && L.relsLe().length===3,'CA6: tocar em "Copiar" entre os dois toques desfaz o pedido');
      bt('apaga').fire('click'); bt('apaga').fire('click');
      ok(L.relsLe().length===0 && aviso()==='Relatórios apagados.' && bt('copia').textContent==='Copiar todos (0)' && bt('copia').disabled && bt('apaga').disabled,'CA6: o 2º toque apaga, avisa "Relatórios apagados." e desabilita os dois'); }
    { const H=load(), {g,L,els}=H, cap=copia(H); g.setDev(true); L.relsGuarda(R(1)); g.setState('teste');
      const caixa=()=>todos(els['teste-lista'],n=>n.id==='teste-rels')[0], bt=k=>todos(caixa(),n=>n.getAttribute&&n.getAttribute('data-rels')===k)[0];
      bt('copia').fire('click'); await espera(10);
      ok(txt(todos(caixa(),n=>n.tagName==='P')[0])==='Copiado 1 relatório! Cole na conversa.','CA5: com 1 relatório, "Copiado 1 relatório! Cole na conversa."'); }
    // cópia recusada
    { const H=load(), {g,L,els}=H; g.setDev(true); [1,2].forEach(n=>L.relsGuarda(R(n))); g.setState('teste');
      const caixa=()=>todos(els['teste-lista'],n=>n.id==='teste-rels')[0], bt=k=>todos(caixa(),n=>n.getAttribute&&n.getAttribute('data-rels')===k)[0];
      bt('copia').fire('click'); await espera(10);
      const ta=todos(caixa(),n=>n.tagName==='TEXTAREA');
      ok(txt(todos(caixa(),n=>n.tagName==='P')[0])==='Não deu para copiar sozinho: selecione o texto abaixo.' && ta.length===1 && ta[0].value===L.relsTexto(),'CA5: com a cópia recusada, o aviso e a caixa com o texto inteiro');
      bt('copia').fire('click'); await espera(10);
      ok(todos(caixa(),n=>n.tagName==='TEXTAREA').length===1,'CA5: copiar de novo não duplica a caixa'); }
  }catch(e){ total++; fails++; console.log('FAIL: botões lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); }
  // CA7
  bloco('CA7',()=>{ const H=load(), {g,L,store}=H; L.relsGuarda(R(1)); g.resetProgress();
    ok(L.relsLe().length===1 && store['lcc-relatorios'],'CA7: "Recomeçar do zero" não apaga os relatórios guardados');
    ok(L.VERSAO==='v12.10.5','CA7: a VERSAO é v12.10.5 ('+L.VERSAO+')'); });
  console.log(fails?'\n'+fails+' FALHA(S) de '+total:'\nTudo ok ('+total+' checagens)'); process.exit(fails?1:0);
})();
