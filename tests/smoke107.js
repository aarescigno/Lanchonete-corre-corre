// v12.6, etapa 15b: as vozes da equipe, o tratamento e a revisão das conversas (spec em docs/spec-v12.6.md; perfis em docs/ARCO.md §2.1 e §2.2).
// CA1 as falas trocadas (o resto igual à cópia da v12.5, tests/smoke107_base.json); CA2 a varredura do tratamento; CA3 a camiNome na ARCO; CA4 a roda com 9 falas; CA5 save antigo.
const load=require('./harness.js');
const BASE=require('./smoke107_base.json');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const L0=load({historia:true}).L;
const ach=a=>a.map(f=>[f.q,f.e||'',f.nota||'',f.s]);
const isF=a=>Array.isArray(a)&&a.length&&a.every(f=>f&&typeof f==='object'&&f.q&&typeof f.s==='string');
const REAL={}; const walk=(pre,o)=>{ if(isF(o)) REAL[pre]=ach(o); else if(o&&typeof o==='object') Object.keys(o).forEach(k=>{ if(typeof o[k]==='object') walk(pre+'.'+k,o[k]); }); };
L0.HISTORIA.forEach(h=>walk('cap'+h.cap,h));
['HIST_CARDAPIO','HIST_DIVULGA','HIST_ENTREGA','HIST_SOCORRO','HIST_EXIGENTE','HIST_CRITICO','HIST_RECOMENDA','HIST_NOTA','HIST_QUITOU','HIST_TETO','HIST_PLANTA','HIST_VONTADE_DOCE','HIST_VONTADE_CAFE'].forEach(n=>walk(n,L0[n]));
L0.LIBERA.forEach(l=>walk('libera.'+l.id,l.falas));
L0.ARCO.forEach(a=>{ walk('arco.'+a.id,a.falas); if(a.falasB) walk('arco.'+a.id+'.B',a.falasB); });

// ---------- CA1: o que a spec troca, e só isso ----------
{ const E=JSON.parse(JSON.stringify(BASE));
  E['cap6.antes'].push(['tonhao','insegura','segurando a cortina de chita','E as nossas coisinhas? A chita, o pisca-pisca...'],['bia','firme','','Aqui é outro nível, tio. O que não combina, eu vendo. O novo tá no Luxo.'],['dani','','','Espelho, quadro de artista... Bi, eu vou ter medo de encostar em tudo!'],['tonhao','','','Casa nova, avental novo. Mas o tempero é o mesmo.'],['dani','','','E a espada da dona Cida?'],['bia','alegre','','Vai pra casa da mãe. Lá ela segue cuidando da gente.'],['bia','','','E a foto da mãe vem junto. Com moldura nova.']);   // v12.9.1: as 7 falas da chegada à Avenida
  const tr=(k,i,s)=>{ E[k][i][3]=s; };                       // troca o texto da fala i
  const ins=(k,i,q,e,s)=>{ E[k].splice(i,0,[q,e,'',s]); };   // insere antes do índice i
  tr('HIST_CRITICO.falas',0,'Bi! Aquele freguês sozinho... ele tinha um caderninho!');
  tr('HIST_TETO.falas',0,'Bi, olha o Gúgou! Nota 2,7!');
  tr('HIST_VONTADE_DOCE.curta',0,'Pediram sobremesa de novo hoje, Bi...');
  tr('libera.confeitaria',0,'Bi, as famílias daqui sempre perguntam se tem sobremesa.');
  tr('libera.joca',2,'O Joquinha, do meu colégio. Tá procurando serviço e é trabalhador.');
  tr('libera.joca',3,'Lixo, louça, mesa suja... pode deixar comigo, dona Bia.');
  tr('arco.daniPrato',0,'Quebrei dois pratos hoje, Bi. Desculpa. Eu sou lenta e ainda estrago as coisas.');
  tr('arco.daniDoce',0,'Devolveram meu pudim, Bi. Disseram que tava mole. Acho melhor eu voltar pra louça.');
  tr('arco.jocaCalado',0,'O Joquinha não abre a boca, Bi. O freguês pergunta e ele aponta pra mim.');
  tr('arco.daniEnsina',0,'Bi, me pediram pra ensinar o ponto do brigadeiro. Eu! Ensinando!');
  tr('arco.daniEnsina',4,'Lenta, não, tio Tonhão. Caprichosa.');
  tr('arco.roda',3,'Ai, Bi, eu vou chorar em cima do doce!');
  tr('HIST_VONTADE_CAFE.falas',3,'Se eu fizer o curso de barista... acho que eu tiro um espresso bom.');
  tr('arco.jocaEspresso',2,'Você disse isso, dona Bia?');
  tr('arco.jocaNome',0,'Dona Bia, a mesa da janela pediu "o café do Joca". Pelo nome!');
  E['arco.jocaNome'].push(['joca','alegre','','Valeu, Bia.']);
  tr('libera.anselmo',1,'Com licença, senhora... Lá no Bráulio não dava mais: era grito o dia inteiro.');
  tr('libera.anselmo',3,'Se a senhora me der um balcão, eu faço o drink mais bonito da Avenida.');
  tr('arco.anselmoCopo',0,'Desculpa, senhora, desculpa! Eu pago o copo, pode descontar...');
  E['arco.anselmoRi'].push(['anselmo','alegre','','Pode deixar, Bia.']);
  tr('libera.cami',3,'Me mostra onde fica tudo, chefe, que eu dou conta!');
  tr('cap12.depois',2,'Chefe, deixa a porta comigo. Eu organizo a fila e as mesas.');
  tr('cap7.antes',1,'O rapaz do café falou de uma colega do curso dele. Garçonete de rodízio.');
  tr('cap7.depois',1,'A Cami é um foguete!');
  tr('cap7.depois',2,'Salão redondo. E agora, Bia?');
  E['arco.camiNome']=[['cami','alegre','','Chefe, a dona Lurdes da mesa dois faz aniversário hoje. E o seu Jorge voltou: o dele é sem cebola.'],['bia','alegre','','Você sabe o nome de todo mundo, Cami?'],['cami','firme','','De todo mundo. No rodízio eu contava mesa. Aqui eu conto gente.'],['tonhao','','','Essa moça aprendeu rápido.'],['cami','alegre','','Cami, Tonhão. Pode chamar de Cami.']];
  const r=E['arco.roda'], i=r.findIndex(f=>f[3].startsWith('Hoje eu não tenho medo'));
  r.splice(i+1,0,['joca','alegre','','Nem eu.'],['cami','','','Girou, serviu... estrela!'],['anselmo','alegre','','E sem ninguém gritar.'],['lia','','','Na hora.']);
  const dif=[]; Object.keys(E).forEach(k=>{ if(JSON.stringify(E[k])!==JSON.stringify(REAL[k])) dif.push(k); }); Object.keys(REAL).forEach(k=>{ if(!(k in E)) dif.push('+'+k); });
  ok(dif.length===0,'CA1 as falas trocadas têm texto, quem fala, e e nota da spec, e as outras seguem iguais às da v12.5 (diferente: '+(dif.join(', ')||'nenhuma')+')'); }

// ---------- CA2: a varredura do tratamento ----------
{ const mau=[]; const SEM=/(^|[^a-zA-Zçã])Bia\b/;
  Object.keys(REAL).forEach(k=>REAL[k].forEach((f,i,arr)=>{ const [q,,,s]=f, ult=i===arr.length-1;
    if(q==='dani' && (/\bBia\b/.test(s) || /seu Tonhão/i.test(s))) mau.push(k+'#'+i+' dani: '+s);
    if(q==='joca' && /\bBia\b/.test(s.replace(/[Dd]ona Bia/g,'')) && !(k==='arco.jocaNome' && ult)) mau.push(k+'#'+i+' joca: '+s);
    if(q==='anselmo' && /\bBia\b/.test(s) && !(k==='arco.anselmoRi' && ult)) mau.push(k+'#'+i+' anselmo: '+s);
    if(q==='tonhao' && /\bchefe\b/i.test(s) && k!=='cap14.antes' && k!=='cap14.depois') mau.push(k+'#'+i+' tonhao: '+s);
    if(q!=='bia' && /\btio\b(?! Tonhão)/i.test(s)) mau.push(k+'#'+i+' '+q+' tio: '+s);
    if(q!=='bia' && q!=='dani' && /\btio Tonhão/i.test(s)) mau.push(k+'#'+i+' '+q+' tio Tonhão: '+s); }));
  ok(mau.length===0,'CA2 tratamento: a Dani não diz "Bia" nem "seu Tonhão"; Joca e Anselmo só dizem "Bia" na última fala da jocaNome e da anselmoRi; o Tonhão só diz "chefe" no cap. 14; só a Bia diz "tio" sozinho ('+(mau.join(' | ')||'nenhum')+')');
  const dani=Object.keys(REAL).reduce((n,k)=>n+REAL[k].filter(f=>f[0]==='dani'&&/\bBi\b/.test(f[3])).length,0);
  ok(dani>=9,'CA2 a Dani chama a Bia de "Bi" ('+dani+' falas)'); }

// ---------- CA3: a camiNome na ARCO ----------
{ const ids=L0.ARCO.map(a=>a.id), i=ids.indexOf('camiNome'), A=L0.ARCO[i];
  ok(i>0 && ids[i-1]==='camiPressa' && A.nivel===3 && typeof A.quando==='function','CA3 camiNome na ARCO, nivel 3, logo depois da camiPressa');
  const pends=sv=>Object.keys(sv.arco).filter(k=>sv.arco[k]==='pend');
  const dia=(arr)=>{ const H=nova(), {g,els}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
    g.trocaPonto(H.L.PONTOS[2]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); sv.arco.camiNome=0; sv.equipe.cami=1; sv.camiCursos.agil=1; if(arr) arr(sv);
    g.startDay(20); if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=900; g.custo=0; g.finishDay(); return pends(sv); };
  ok(dia().join()==='camiNome','CA3 camiPressa vista, curso Atendimento ágil e a Cami no dia: camiNome fica pendente');
  ok(dia(sv=>{ sv.camiCursos.agil=0; }).length===0,'CA3 sem o curso Atendimento ágil: não marca');
  const sv0=nova().g.save, qd=(e)=>{ const sv=JSON.parse(JSON.stringify(sv0)); sv.arco.camiPressa=1; sv.camiCursos.agil=1; sv.equipe.cami=1; Object.assign(sv.equipe,e); return A.quando(sv,{}); };
  ok(qd({})===true && qd({ camiFora:true })===false && qd({ cami:0 })===false && dia(sv=>{ sv.equipe.cami=0; }).length===0,'CA3 sem a Cami no dia (fora ou não contratada): não marca');
  ok(dia(sv=>{ sv.arco.camiPressa=0; }).join()==='camiPressa','CA3 a camiPressa ainda por tocar: só ela marca (uma por fim de dia)');
  ok(dia(sv=>{ sv.arco.camiPressa=0; sv.arco.daniEnsina=0; sv.daniCursos.confGourmet=1; }).join()==='camiPressa','CA3 uma por fim de dia: a camiPressa antes da camiNome e da daniEnsina'); }

// ---------- CA4: a roda ----------
{ const r=REAL['arco.roda'].map(f=>f[0]+': '+f[3]);
  ok(r.length===9 && JSON.stringify(r)===JSON.stringify(['bia: Antes da noite da estrela, eu quero dizer uma coisa a vocês.','bia: Eu comecei numa garagem, com medo de abrir o portão.','bia: Hoje eu não tenho medo. Porque nunca mais abri sozinha.','joca: Nem eu.','cami: Girou, serviu... estrela!','anselmo: E sem ninguém gritar.','lia: Na hora.','dani: Ai, Bi, eu vou chorar em cima do doce!','tonhao: Chora depois. Primeiro a estrela.']),'CA4 a roda tem 9 falas, na ordem da spec (Joca, Cami, Anselmo e Lia depois da fala da Bia)'); }

// ---------- CA5: save antigo ----------
{ const velho={}; L0.ARCO.forEach(a=>{ if(a.id!=='camiNome') velho[a.id]=0; });
  const av=L0.normSave({ salao:{ ponto:'avenida' }, arco:velho }), te=L0.normSave({ salao:{ ponto:'terraco' }, arco:velho }), novo=L0.normSave({});
  ok(av.arco.camiNome===0 && te.arco.camiNome===1 && novo.arco.camiNome===0,'CA5 save da v12.5 carrega com arco.camiNome (0 na Avenida, 1 no Terraço; save novo 0)');
  const p=L0.normSave({ salao:{ ponto:'avenida' }, arco:Object.assign({},velho,{ camiNome:'pend' }) }); ok(p.arco.camiNome==='pend','CA5 normSave mantém o pend da camiNome');
  const d=nova(), lista=(d.L.ARCO||[]).some(a=>a.id==='camiNome'); ok(lista,'CA5 a camiNome entra sozinha na lista do modo dev (Arco: camiNome, pela ARCO)'); }

console.log('\nsmoke107: '+total+' checagens, fails = '+fails);
process.exit(fails?1:0);
