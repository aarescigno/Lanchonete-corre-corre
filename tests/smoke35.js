// v8.8, etapa 2g: o Tonhão sobe de nível com os cursos; o aumento de salário consolida o nível (v12.10: sem experiência, o nível ao alcance vem dos cursos do ponto)
const load=require('./harness.js');
const H=load(); const {g,L,els}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const grid=()=>els['shop-grid'];
const cartao=p=>grid().children.find(c=>c.children[1] && p.test(c.children[1].textContent));
const botao=c=>{ let r=null; (function f(e){ if(e.tagName==='BUTTON' && /^Aumento/.test(e.textContent)) r=e; (e.children||[]).forEach(f); })(c); return r; };
const novo=(cursos,eq,bank)=>{ g.save=L.normSave({bank:bank==null?5000:bank,maxDay:3,cursos,equipe:Object.assign({tonhao:0},eq)}); g.up=g.save.up; g.buildTables(); g.goShop(3); L.setShopTab('tonhao'); };
const C=L.CURSOS;
// v12.10: sem experiência: o nível ao alcance vem dos cursos do ponto (tonhaoNivelAlc; os degraus e a conversão no smoke117)
const GB={ pastel:{ garagem:1 }, chapa:{ garagem:1 } }, GB3=Object.assign({ fritos:{ garagem:1 } },GB), G=L.PONTOS[0];
// (1) tonhaoNivelAlc
ok(L.tonhaoNivelAlc({},G)===0 && L.tonhaoNivelAlc(GB,G)===0 && L.tonhaoNivelAlc(GB3,G)===1,'Garagem: sem cursos 0; com 2 dos 3 básicos 0; com os 3, o nível 1 (índice)');
// (3) setStaff
novo({}); ok(!g.setStaff('tonhao',1) && g.save.equipe.tonhao===0,'sem cursos, o aumento é recusado');
novo(GB3); { const f0=g.payroll(); ok(g.setStaff('tonhao',1) && g.payroll()-f0===8,'com os 3 básicos da Garagem, aceita o nível 2 e a folha sobe R$ 8'); }
ok(!g.setStaff('tonhao',2),'pedir o nível 3 com o 2 ao alcance: recusa');
ok(!g.setStaff('tonhao',0),'não dá para reduzir (o nível pago é definitivo)');
// (4) buyCurso
novo(GB,{},5000); g.save.cursoDia=0; g.cursoMsg='';
ok(g.buyCurso('fritos') && /Ele já pode subir para o nível 2/.test(g.cursoMsg),'o curso que completa os básicos avisa que já pode subir');
// (5) lojinha
novo({}); { const t=txt(grid());
  ok(/Tonhão · nível 1 de 9/.test(t) && /Cursos daqui/.test(t) && !/Experiência/.test(t),'título "nível 1 de 9" e o rótulo "Cursos daqui"');
  const b=botao(grid().children.find(c=>/Tonhão ·/.test(txt(c)))); ok(b && b.disabled && !/Faltam/.test(t) && !/Pronto para o aumento/.test(t) && !/Reduzir/.test(t),'sem curso: botão apagado, sem "Faltam", sem Reduzir');
  L.setShopTab('cardapio'); ok(!/de experiência/.test(txt(grid())),'o cartão de curso não fala mais em experiência'); L.setShopTab('tonhao'); }
novo(GB3); { const b=botao(grid().children.find(c=>/Tonhão ·/.test(txt(c)))); ok(b && !b.disabled && b.textContent==='Aumento: +R$ 8/dia' && /Pronto para o aumento/.test(txt(grid())),'com os 3 básicos: "Aumento: +R$ 8/dia" aceso'); }
novo(GB3,{tonhao:1}); ok(/Cursos daqui/.test(txt(grid())) && !/Pronto para o aumento/.test(txt(grid())),'no nível 2 a barra aponta os avançados da Garagem');
novo(L.cursosAte(),{tonhao:8}); ok(/nível 9 de 9/.test(txt(grid())) && /Nível máximo/.test(txt(grid())),'nível 9: nível máximo');
// (6) folha que não cabe derruba 1 nível e os cursos ficam
novo(GB3,{tonhao:1},10); g.save.corta=true; g.startDay(3); g.begin();
ok(g.save.equipe.tonhao===0,'sem dinheiro para a folha: cai 1 nível');
g.save.bank=5000; ok(g.setStaff('tonhao',1),'o aumento volta a valer sem curso novo');
// (7) loadSave: o save convertido (tonDeg 1) carrega como está
{ const save={maxDay:3,bank:420,cardV:1,histV:1,tonDeg:1,cursos:GB3,equipe:{tonhao:1}};
  const H2=load({store:{lcc2_save:JSON.stringify(save)}}); ok(H2.g.save.equipe.tonhao===1 && H2.g.save.cursos.pastel.garagem===1 && H2.g.save.tonDeg===1,'save com tonDeg:1 carrega sem mexer no nível nem nos cursos'); }
// (8) nível 9
{ const T=L.STAFF.tonhao.levels[8]; ok(T.cook===0.45 && T.xp===undefined && L.AVAL.prato[8][0]===4 && L.AVAL.prato[8][1]===5 && L.AVAL.prato.length===9,'nível 9: cook 0,45 e faixa do prato 4 a 5'); }
// (9) modo dev
L.DEV.on=true; novo({},{tonhao:0}); ok(g.setStaff('tonhao',8),'modo dev: aumento sem cursos'); L.DEV.on=false;
console.log('total =',total,' fails =',fails);
