// v8.8, etapa 2g: o Tonhão sobe de nível com a experiência (XP) dos cursos; o aumento de salário consolida o nível
const load=require('./harness.js');
const H=load(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const grid=()=>els['shop-grid'];
const cartao=p=>grid().children.find(c=>c.children[1] && p.test(c.children[1].textContent));
const botao=c=>{ let r=null; (function f(e){ if(e.tagName==='BUTTON' && /^Aumento/.test(e.textContent)) r=e; (e.children||[]).forEach(f); })(c); return r; };
const novo=(cursos,eq,bank)=>{ g.save=L.normSave({bank:bank==null?5000:bank,maxDay:3,cursos,equipe:Object.assign({tonhao:0},eq)}); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopTab('tonhao'); };
const C=L.CURSOS;
// (1) tonhaoXp
ok(L.tonhaoXp({})===0,'sem cursos: 0 de XP');
ok(L.tonhaoXp({pastel:1,chapa:1})===2,'pastel e chapa básicos: 2');
ok(L.tonhaoXp({pastel:2})===3,'pastel básico e avançado: 3');
ok(L.tonhaoXp({pf:2})===2,'PF avançado: 2 (não tem básico)');
{ const t={}; C.forEach(c=>t[c.id]=2); ok(L.tonhaoXp(t)===17,'tudo: 17'); }
// (2) tonhaoNivelXp
[[0,0],[1,0],[2,1],[4,1],[5,2],[9,3],[13,3],[14,4]].forEach(([x,n])=>{
  const cu={}; let r=x; C.forEach(c=>{ if(r<=0) return; if(c.preco>0 && r>=1){ cu[c.id]=1; r-=1; } });
  // completa com avançados quando o básico não chega
  C.forEach(c=>{ if(L.tonhaoXp(cu)+1<=x && cu[c.id]) cu[c.id]=2; });
  C.forEach(c=>{ if(L.tonhaoXp(cu)<x && !cu[c.id] && c.id==='pf') cu.pf=2; });
  ok(L.tonhaoXp(cu)>=x,'(monta '+x+' de XP: '+L.tonhaoXp(cu)+')');
  ok(L.tonhaoNivelXp(cu)===L.STAFF.tonhao.levels.reduce((a,l,i)=>L.tonhaoXp(cu)>=l.xp?i:a,0),'XP '+L.tonhaoXp(cu)+' → nível '+(L.tonhaoNivelXp(cu)+1));
});
ok(L.tonhaoNivelXp({pastel:1,chapa:1})===1 && L.tonhaoNivelXp({pastel:1})===0,'limites: 1→nível 1, 2→nível 2');
// (3) setStaff
novo({}); ok(!g.setStaff('tonhao',1) && g.save.equipe.tonhao===0,'sem cursos, o aumento é recusado');
novo({pastel:1,chapa:1}); { const f0=g.payroll(); ok(g.setStaff('tonhao',1) && g.payroll()-f0===15,'com 2 de XP, aceita o nível 2 e a folha sobe R$ 15'); }
ok(!g.setStaff('tonhao',2),'pedir o nível 3 com 2 de XP: recusa');
ok(!g.setStaff('tonhao',0),'não dá para reduzir (o nível pago é definitivo)');
// (4) buyCurso
novo({pastel:1},{},5000); g.save.cursoDia=0; g.cursoMsg='';
ok(g.buyCurso('chapa') && /Ele já pode subir para o nível 2/.test(g.cursoMsg),'o curso que completa a XP avisa que já pode subir');
// (5) lojinha
novo({}); { const t=txt(grid());
  ok(/Tonhão · nível 1 de 5/.test(t) && /Experiência: 0 de 2 para o nível 2/.test(t),'título "nível 1 de 5" e a linha de experiência');
  const b=botao(grid().children.find(c=>/Tonhão ·/.test(txt(c)))); ok(b && b.disabled && /Faltam 2 de experiência/.test(t) && !/Reduzir/.test(t),'sem XP: botão apagado, "Faltam 2", sem Reduzir');
  L.setShopTab('cardapio'); ok(/\+1 de experiência/.test(txt(grid())),'cartão de curso com "+1 de experiência" (no Cardápio)'); L.setShopTab('tonhao'); }
novo({pastel:1,chapa:1}); { const b=botao(grid().children.find(c=>/Tonhão ·/.test(txt(c)))); ok(b && !b.disabled && b.textContent==='Aumento: +R$ 15/dia','com XP: "Aumento: +R$ 15/dia" aceso'); }
novo({pastel:1,chapa:1},{tonhao:1}); ok(/Experiência: 2 de 5 para o nível 3/.test(txt(grid())),'no nível 2 a barra aponta o nível 3');
{ const t={}; C.forEach(c=>t[c.id]=2); novo(t,{tonhao:4}); ok(/nível 5 de 5/.test(txt(grid())) && /Experiência: 17 · nível máximo/.test(txt(grid())),'nível 5: nível máximo'); }
// (6) folha que não cabe derruba 1 nível e a XP fica
novo({pastel:1,chapa:1},{tonhao:1},10); g.save.corta=true; g.startDay(3); g.begin();
ok(g.save.equipe.tonhao===0,'sem dinheiro para a folha: cai 1 nível');
g.save.bank=5000; ok(g.setStaff('tonhao',1),'o aumento volta a valer sem curso novo');
// (7) loadSave
{ const save={maxDay:3,bank:420,cardV:1,histV:1,cursos:{pastel:1},equipe:{tonhao:2}};
  const H2=load({store:{lcc2_save:JSON.stringify(save)}}); const L2=H2.L, g2=H2.g;
  ok(g2.save.equipe.tonhao===0 && g2.save.tonXp===1 && JSON.parse(H2.store[L2.LS.save]).tonXp===1,'save com tonhao:2 e 1 de XP volta ao nível 1 e grava tonXp:1');
  g2.save.equipe.tonhao=0;
  const H3=load({store:{lcc2_save:JSON.stringify(Object.assign({},save,{cursos:{pastel:1,chapa:1,fritos:1,assados:1,veg:1},equipe:{tonhao:2}}))}});
  ok(H3.g.save.equipe.tonhao===2,'save com tonhao:2 e 5 de XP fica no nível 3 (a rebaixa só olha a XP)');
  const H4=load({store:{lcc2_save:JSON.stringify(Object.assign({},save,{tonXp:1}))}}); ok(H4.g.save.equipe.tonhao===2,'com tonXp:1, carregar de novo não mexe'); }
// (8) nível 5
{ const T=L.STAFF.tonhao.levels[4]; ok(T.cook===0.55 && T.xp===14 && L.AVAL.prato[4][0]===4 && L.AVAL.prato[4][1]===5 && L.AVAL.prato.length===5,'nível 5: cook 0,55 e faixa do prato 4 a 5'); }
// (9) modo dev
L.DEV.on=true; novo({},{tonhao:0}); ok(g.setStaff('tonhao',4),'modo dev: aumento sem XP'); L.DEV.on=false;
console.log('total =',total,' fails =',fails);
