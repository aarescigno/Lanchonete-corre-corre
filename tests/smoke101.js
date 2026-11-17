// v12.3.1: o Teste de habilidade no menu principal, só com o modo dev ligado (botão "Teste" e a tela #ov-teste).
// CA1 a CA5 (o CA6, os 14 tamanhos, é o `python3 menu_fit.py`; o CA7, as capturas, é conferido à mão).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const html=require('fs').readFileSync('../lanchonete.html','utf8');
const IDS=['garagem','industrial','avenida','terraco'], NOMES=['Garagem','Área industrial','Avenida Brasil','Terraço Suíça'];
const REAL={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1, desafios:{ soBia:2 } };
const mk=(extra,opts)=>load(Object.assign({ store:Object.assign({ lcc2_save:JSON.stringify(REAL) },extra||{}) },opts||{}));
const fases=els=>todos(els['teste-lista'],n=>n.tagName==='BUTTON'&&n.getAttribute('data-teste'));
const inp=els=>todos(els['teste-lista'],n=>n.id==='teste-nome')[0];

bloco('CA1',()=>{
  { const {g,L,els}=mk(); L.buildMenu(); ok(els['btn-teste'].style.display==='none','CA1: sem o modo dev, o botão "Teste" fica escondido'); }
  { const {g,L,els}=mk(); g.setDev(true); L.buildMenu();
    ok(els['btn-teste'].style.display!=='none' && /<button class="btn alt" id="btn-teste" style="display:none">Teste<\/button>/.test(html),'CA1: com o modo dev ligado, o botão "Teste" (classe btn alt, texto Teste, no HTML) aparece');
    g.setDev(false); L.buildMenu(); ok(els['btn-teste'].style.display==='none','CA1: desligando o modo dev, ele some de novo'); } });

bloco('CA2',()=>{
  const {g,L,els}=mk(); g.setDev(true); g.setState('menu'); els['btn-teste'].fire('click');
  ok(g.state==='teste' && els['ov-teste'].classList.contains('show') && !els['ov-menu'].classList.contains('show'),'CA2: o toque em "Teste" leva ao estado teste, com a tela #ov-teste');
  { const i=html.indexOf('id="ov-teste"'), j=html.indexOf('id="ov-desafio-fim"',i), bl=html.slice(i,j);   // o título e a frase são HTML fixo (o harness não monta o HTML)
    ok(/<h2>Teste de habilidade<\/h2>/.test(bl) && bl.indexOf('Quatro fases, sempre com os mesmos clientes. No fim, copie o relatório e mande.')>0 && /id="btn-teste-menu-volta"[^>]*>Voltar</.test(bl) && /class="btn go" id="btn-teste-menu-volta"/.test(bl),'CA2: o título "Teste de habilidade", a frase e o botão "Voltar" (btn go)'); }
  ok(inp(els) && inp(els).maxLength===16 && inp(els).placeholder==='Seu nome','CA2: o campo do nome (16 letras, "Seu nome")');
  const bt=fases(els); ok(bt.map(b=>b.getAttribute('data-teste')).join()===IDS.join() && NOMES.every((n,i)=>bt[i].textContent===n+' (0)'),'CA2: os quatro botões das fases, com as tentativas (0)');
  ok(g.save===g.save && g.salvo===null,'CA2: o save de verdade segue no lugar'); });

bloco('CA3',()=>{
  IDS.forEach((id,i)=>{
    const {g,L,els,store}=mk(); g.setDev(true); g.setState('teste');
    inp(els).value='  Ana   Maria  '; inp(els).fire('change');
    fases(els).find(b=>b.getAttribute('data-teste')===id).fire('click');
    ok(g.state==='intro' && g.teste && g.teste.id===id && store.lcc2_name==='Ana Maria','CA3: '+NOMES[i]+': começa a fase certa ('+(g.teste&&g.teste.id)+') e grava o nome ('+store.lcc2_name+')'); });
  { const {g,L,els,store}=mk({ lcc2_name:'Zé' }); g.setDev(true); g.setState('teste'); ok(inp(els).value==='Zé','CA3: o campo começa com o nome gravado'); } });

bloco('CA4',()=>{
  const {g,L,els,store}=mk(); g.setDev(true); g.setState('teste');
  fases(els).find(b=>b.getAttribute('data-teste')==='garagem').fire('click'); g.begin(); g.schedule=[]; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+20; roda(g,3);
  ok(g.state==='testefim','CA4: o dia do teste termina na tela do fim');
  els['btn-teste-volta'].fire('click');
  ok(g.state==='teste' && els['ov-teste'].classList.contains('show') && g.teste===null && g.salvo===null,'CA4: "Voltar" do fim leva à tela do Teste, com o save de verdade de volta');
  ok(fases(els)[0].textContent==='Garagem (1)' && fases(els)[1].textContent==='Área industrial (0)','CA4: a tentativa da Garagem subiu para 1 no botão'); });

bloco('CA5',()=>{
  { const {g,els}=mk(); g.setDev(true); g.setState('teste'); fases(els)[1].fire('click'); els['btn-intro-menu'].fire('click');
    ok(g.state==='teste' && g.teste===null,'CA5: "Menu" da introdução de um teste volta à tela do Teste'); 
    els['btn-teste-menu-volta'].fire('click'); ok(g.state==='menu' && els['ov-menu'].classList.contains('show'),'CA5: "Voltar" da tela do Teste leva ao menu'); }
  { const {g,els}=mk(); g.setDev(true); g.setState('teste'); fases(els)[0].fire('click'); g.begin(); g.pause(); els['btn-pause-menu'].fire('click'); if(g.state==='paused') els['btn-pause-menu'].fire('click');
    ok(g.state==='teste','CA5: "sair do dia" na pausa de um teste leva à tela do Teste ('+g.state+')'); }
  { const {g,els}=mk(); g.setDev(true); g.setState('teste'); fases(els)[0].fire('click'); g.setDev(false); els['btn-intro-menu'].fire('click');
    ok(g.state==='menu','CA5: se o modo dev foi desligado no meio, "Menu" vai ao menu'); }
  { const {g,els}=mk(); g.setDev(true); g.startDesafio('soBia'); els['btn-intro-menu'].fire('click'); ok(g.state==='desafios','CA5: (controle) o Desafio continua voltando à tela de Desafios'); } });

console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
