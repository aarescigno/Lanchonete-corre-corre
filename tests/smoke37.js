// v8.9, etapa 2h: a Dani sobe de nível com a experiência (XP) do trabalho e dos cursos dela; o aumento consolida o nível
const load=require('./harness.js');
const H=load(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const grid=()=>els['shop-grid'];
const botao=(c,re)=>{ let r=null; (function f(e){ if(e.tagName==='BUTTON' && re.test(e.textContent)) r=e; (e.children||[]).forEach(f); })(c); return r; };
const T=L.DANI_XP.tarefas;   // tarefas por ponto de XP
const novo=(sv,eq,bank)=>{ g.save=L.normSave(Object.assign({bank:bank==null?5000:bank,maxDay:3,cap:2,equipe:Object.assign({tonhao:0,dani:1},eq)},sv)); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopGrupo('equipe'); L.setShopTab('dani'); };
// (1) daniXp
ok(L.daniXp({})===0,'nada: 0 de XP');
ok(L.daniXp({daniTar:T-1})===0 && L.daniXp({daniTar:T})===1,'T-1 tarefas = 0; T = 1 (T = '+T+')');
ok(L.daniXp({daniTar:2*T,daniCursos:{atend:1}})===4,'1 curso + 2T tarefas = 4');
// (2) daniNivelXp (índice 1 = aprendiz; 2, 3 e 4 = os aumentos)
[[0,1],[3,1],[4,2],[7,2],[8,3],[12,3],[13,4]].forEach(([x,n])=>ok(L.daniNivelXp({daniTar:x*T})===n,'XP '+x+' → nível índice '+n));
// (3) aumento
novo({}); ok(!g.setStaff('dani',2) && g.save.equipe.dani===1,'sem XP, o aumento é recusado');
novo({daniTar:4*T}); { const f0=g.payroll(); ok(g.setStaff('dani',2) && g.payroll()-f0===15,'com 4 de XP, aceita o aumento e a folha sobe R$ 15'); }
ok(!g.setStaff('dani',3),'pedir o nível seguinte com 4 de XP: recusa');
ok(!g.setStaff('dani',1),'não dá para reduzir (o nível pago é definitivo)');
// (4) o trabalho vira XP só no dia completo
novo({},{dani:2,daniTasks:['lavar','lixo']}); g.startDay(3); g.begin(); g.dani.feitas=7; g.schedule=[]; g.nextIdx=0; g.money=0; g.custo=0; g.finishDay();
ok(g.save.daniTar===7 && g.result.daniFeitas===7,'dia completo: as tarefas entram em daniTar e no resultado');
g.save.daniTar=0; g.startDay(3); g.begin(); g.dani.feitas=9; g.goShop(3);
ok(g.save.daniTar===0 && g.dani.feitas===0,'dia interrompido não soma (e o dia novo zera as tarefas)');
// as tarefas contam de verdade
novo({},{dani:2,daniTasks:['lavar','lixo']}); g.startDay(3); g.begin(); g.schedule=[{t:1e9,type:'estudante',color:0}]; g.nextIdx=0; g.trash=6; g.kitchen.sinkN=3;
{ let n=0; while(g.dani.feitas<2 && n++<2000) g.update(0.05); ok(g.dani.feitas>=2,'a Dani lavando e esvaziando o lixo soma tarefas ('+g.dani.feitas+')'); }
// (5) cursos
const D=L.DANI_CURSOS;
novo({},{dani:0}); g.save.cap=1; L.setShopTab('dani'); ok(!/Curso de Atendimento/.test(txt(grid())),'antes do cap. 2 os cursos não aparecem');
novo({},{dani:1},1000); g.save.daniCursoDia=0; g.cursoMsg='';
{ const b0=g.save.bank; ok(g.buyDaniCurso('atend') && g.save.bank===b0-120 && L.daniXp(g.save)===2 && /A Dani foi fazer o curso de Atendimento ao cliente!/.test(g.cursoMsg),'curso: desconta, +2 XP e a mensagem'); }
ok(!g.buyDaniCurso('cozinha'),'trava: dois cursos da Dani na mesma lojinha, não');
g.save.cursoDia=0; ok(g.buyCurso('pastel') && g.save.daniCursoDia===g.shopNext,'um da Dani e um do Tonhão no mesmo dia, sim');
g.save.daniCursoDia=0; g.cursoMsg=''; g.save.daniTar=2*T; ok(g.buyDaniCurso('cozinha') && /Ela já pode subir para o nível 1/.test(g.cursoMsg),'o curso que completa a XP avisa que já pode subir');
ok(!g.buyDaniCurso('cozinha'),'curso já feito: não compra de novo');
ok(D.filter(c=>!c.nivel).length===3 && D.filter(c=>!c.nivel).map(c=>c.preco).join()==='120,150,180','3 cursos: R$ 120, 150 e 180');
// (6) lojinha
novo({}); { const t=txt(grid());
  ok(/Dani · aprendiz \(sem salário\)/.test(t) && /Experiência: 0 de 4 para o nível 1/.test(t) && new RegExp('Trabalho: '+T+' tarefas até o próximo ponto').test(t),'título, linha de experiência e de trabalho');
  const b=botao(grid(),/^Aumento/); ok(b && b.disabled && /Faltam 4 de experiência/.test(t) && !/Reduzir/.test(t),'sem XP: botão apagado, "Faltam 4", sem Reduzir');
  ok(/\+2 de experiência/.test(t),'cartões de curso com "+2 de experiência"'); }
novo({daniTar:4*T}); { const b=botao(grid(),/^Aumento/); ok(b && !b.disabled && b.textContent==='Aumento: +R$ 15/dia','com XP: "Aumento: +R$ 15/dia" aceso'); }
novo({daniTar:4*T+1,daniCursos:{atend:1}},{dani:2}); ok(new RegExp('Trabalho: '+(T-1)+' tarefas? até o próximo ponto').test(txt(grid())),'conta as tarefas que faltam para o próximo ponto');
novo({daniCursoDia:3}); ok(/A Dani já está num curso/.test(txt(grid())),'trava: "A Dani já está num curso"');
novo({daniCursos:{atend:1}}); ok(/Curso feito/.test(txt(grid())),'curso feito');
// (7) fim do dia
novo({daniTar:4*T},{dani:1}); g.startDay(3); g.begin(); g.dani.feitas=5; g.schedule=[]; g.nextIdx=0; g.money=0; g.custo=0; g.finishDay();
ok(new RegExp('Dani: 5 tarefas hoje · experiência '+L.daniXp(g.save)+'\\.').test(els['end-msg'].textContent) && /A Dani já pode subir para o nível 1!/.test(els['end-msg'].textContent),'fim do dia: tarefas, experiência e "já pode subir"');
// (8) folha que não cabe derruba 1 nível e a XP fica
novo({daniTar:8*T},{dani:3},15); g.save.corta=true; g.startDay(3); g.begin();
ok(g.save.equipe.dani===2 && L.daniXp(g.save)===8,'sem dinheiro para a folha: cai 1 nível e a XP fica');
novo({daniTar:T},{dani:1},0); g.save.corta=true; g.startDay(3); g.begin(); ok(g.save.equipe.dani===1,'nunca abaixo de aprendiz');
// (9) loadSave
{ const save={maxDay:3,bank:420,cardV:1,histV:1,tonXp:1,cap:2,equipe:{dani:4}};
  const H2=load({store:{lcc2_save:JSON.stringify(save)}}); const L2=H2.L, g2=H2.g;
  ok(g2.save.equipe.dani===1 && g2.save.daniXp===1 && JSON.parse(H2.store[L2.LS.save]).daniXp===1,'save antigo com dani:4 volta a aprendiz e grava daniXp:1');
  const H3=load({store:{lcc2_save:JSON.stringify(Object.assign({},save,{daniXp:1}))}}); ok(H3.g.save.equipe.dani===4,'com daniXp:1, carregar de novo não mexe');
  const H4=load({store:{lcc2_save:JSON.stringify(Object.assign({},save,{equipe:{dani:0}}))}}); ok(H4.g.save.equipe.dani===0,'quem ainda não tem a Dani continua sem ela'); }
// (10) modo dev
L.DEV.on=true; novo({},{dani:1}); ok(g.setStaff('dani',4),'modo dev: aumento sem XP'); L.DEV.on=false;
console.log('total =',total,' fails =',fails);
