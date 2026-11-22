// v12.9.1: a decoração de cada ponto: as duas famílias, os preços e a mudança (etapa 17b). Spec: docs/spec-v12.9.1.md. CA1 a CA11.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const todos=(e,f,o)=>{ o=o||[]; if(f(e)) o.push(e); (e.children||[]).forEach(c=>todos(c,f,o)); return o; };
const texto=e=>(e.textContent||'')+(e.children||[]).map(texto).join('');
const NV={garagem:1,industrial:2,avenida:3,terraco:4};
const jogo=(ponto,extra,opt)=>{ const H=load(opt), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ cap:6, dia:10, maxDay:10, bank:5000, up:{}, salao:{ ponto } },extra||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const todosOs=(L,p)=>L.DECOR.filter(d=>L.decorCombina(d,NV[p])).map(d=>d.id);
const {L}=load(); const f=id=>L.decorOf(id);
// CA1
{ const P=(id,n)=>L.decorPreco(f(id),n);
  ok(P('samambaia',1)===15 && P('samambaia',2)===30,'CA1: samambaia R$ 15 na Garagem e R$ 30 na área industrial');
  ok(P('luminaria',2)===180,'CA1: luminárias R$ 180 na área industrial');
  ok(P('tulipa',3)===60 && P('tulipa',4)===150,'CA1: tulipas R$ 60 na Avenida e R$ 150 no Terraço');
  ok(P('espelho',3)===200 && P('espelho',4)===600,'CA1: espelho R$ 200 e R$ 600');
  ok(P('quadros',3)===450 && P('quadros',4)===1500 && P('lustre',4)===1500,'CA1: quadros R$ 450 e R$ 1.500; lustre R$ 1.500');
  ok([1,2,3,4].map(n=>P('foto',n)).join()==='15,30,60,150','CA1: a foto R$ 15, 30, 60 e 150');
  ok(L.DECOR.every(d=>d.cost===undefined),'CA1: o `cost` saiu do DECOR'); }
// CA2
{ const lojas=p=>{ const H=jogo(p); H.L.setShopGrupo('lanchonete'); H.L.setShopTab('luxo'); const g=H.els['shop-grid'];
    return L.DECOR.filter(d=>texto(g).indexOf(d.name)>=0).map(d=>d.id); };
  const dec=(p)=>todosOs(L,p).sort().join();
  const R={ garagem:8, industrial:12, avenida:10, terraco:14 };
  Object.keys(R).forEach(p=>{ const v=lojas(p); ok(v.length===R[p] && v.sort().join()===dec(p),'CA2: '+p+' mostra '+R[p]+' enfeites ('+v.length+')'); });
  ok(todosOs(L,'avenida').filter(i=>i!=='foto').every(i=>f(i).fam==='fina' && f(i).nivel===3) && todosOs(L,'terraco').filter(i=>i!=='foto').every(i=>f(i).fam==='fina'),'CA2: Avenida e Terraço só com finos (e a foto)');
  ok(todosOs(L,'industrial').filter(i=>i!=='foto').length===11 && todosOs(L,'terraco').filter(i=>i!=='foto').length===13,'CA2: 11 simples na área industrial e 13 finos no Terraço'); }
// CA3
{ let H=jogo('avenida'), b=H.g.save.bank; ok(H.g.buyDecor('samambaia')===false && H.g.save.bank===b && !H.g.save.decor.samambaia,'CA3: na Avenida, comprar a samambaia devolve false e não cobra');
  H=jogo('industrial'); b=H.g.save.bank; ok(H.g.buyDecor('espelho')===false && H.g.save.bank===b,'CA3: na área industrial, comprar o espelho também');
  H=jogo('avenida'); b=H.g.save.bank; ok(H.g.buyDecor('espelho')===true && H.g.save.bank===b-200,'CA3: o espelho se compra na Avenida por R$ 200');
  H=jogo('garagem'); b=H.g.save.bank; ok(H.g.buyDecor('samambaia') && H.g.save.bank===b-15,'CA3: a samambaia custa R$ 15 na Garagem');
  H=jogo('avenida',{},{}); H.L.DEV.on=true; b=H.g.save.bank; ok(!H.g.buyDecor('samambaia'),'CA3: nem no modo dev'); }
// CA4
Object.keys(NV).forEach(p=>{ const exp={garagem:10,industrial:15,avenida:19,terraco:25}[p]; const H=jogo(p), {g}=H;
  g.save.decor=H.L.normDecor(Object.fromEntries(todosOs(H.L,p).map(i=>[i,1])));
  ok(H.L.luxoPts(g).dec===exp,'CA4: a Decoração cheia em '+p+' = '+exp+' ('+H.L.luxoPts(g).dec+')'); });
// os 11 simples e a foto, para a mudança
const SIMPLES=()=>Object.fromEntries(todosOs(L,'industrial').map(i=>[i,1]));
const muda=(H)=>{ const {g}=H; g.save.aval=Array(10).fill([4,4,4,4,4]); const b0=g.save.bank; const r=g.mudarPonto(); return { r, b0, bank:g.save.bank }; };
// CA5
{ const H=jogo('industrial',{ histV:1, capV:6, bank:5000, decor:SIMPLES() }), {g}=H; const m=muda(H);
  ok(m.r && g.save.salao.ponto==='avenida','CA5: mudou para a Avenida');
  ok(Object.keys(g.save.decor).join()==='foto','CA5: sobra só a foto ('+Object.keys(g.save.decor)+')');
  ok(m.bank===m.b0-2000+203,'CA5: o dinheiro sobe R$ 203 além do preço da mudança ('+(m.bank-m.b0+2000)+')'); }
// CA6
{ const H=jogo('industrial',{ histV:1, capV:6, convPlanta:1, bank:5000, decor:SIMPLES() },{historia:true}), {g}=H; const m=muda(H);
  ok(m.r && Object.keys(g.save.decor).join()==='foto','CA6: no Modo História, a espada também sai ('+Object.keys(g.save.decor)+')');
  ok(m.bank===m.b0-2000+195,'CA6: devolve R$ 195 (a espada não entra) ('+(m.bank-m.b0+2000)+')'); }
// CA7
{ const H=jogo('garagem',{ bank:5000, decor:SIMPLES() }), {g}=H; g.save.aval=Array(10).fill([4,4,4,4,4]); const b0=g.save.bank, n0=Object.keys(g.save.decor).length;
  ok(g.mudarPonto() && g.save.salao.ponto==='industrial' && Object.keys(g.save.decor).length===n0 && g.save.bank<=b0,'CA7: Garagem → área industrial não tira nem devolve enfeite'); }
// CA8
{ const c=L.HISTORIA.find(x=>x.cap===6), a=c.antes, n=a.length;
  ok(n===11 && a[3].s==='E aqui cabe até música ao vivo!','CA8: o antes do cap. 6 tem as 4 falas de antes ('+n+' no total)');
  const T=['E as nossas coisinhas? A chita, o pisca-pisca...','Aqui é outro nível, tio. O que não combina, eu vendo. O novo tá no Luxo.','Espelho, quadro de artista... Bi, eu vou ter medo de encostar em tudo!','Casa nova, avental novo. Mas o tempero é o mesmo.','E a espada da dona Cida?','Vai pra casa da mãe. Lá ela segue cuidando da gente.','E a foto da mãe vem junto. Com moldura nova.'];
  const Q=['tonhao','bia','dani','tonhao','dani','bia','bia'];
  ok(T.every((t,i)=>a[4+i] && a[4+i].s===t && a[4+i].q===Q[i]) && a[4].nota==='segurando a cortina de chita' && a[4].e==='insegura' && a[5].e==='firme' && a[9].e==='alegre','CA8: as 7 falas novas, na ordem, com os textos da Regra'); }
// CA9
{ const frase='Os enfeites simples não combinam com a Avenida: voltam pela metade.';
  const cartao=(decor)=>{ const H=jogo('industrial',{ histV:1, capV:6, bank:5000, decor },{historia:true}); H.g.save.aval=Array(10).fill([4,4,4,4,4]); H.L.setShopGrupo('dinheiro'); H.L.setShopTab('mudanca');
    const g=H.els['shop-grid']; const b=g.children[0].children.filter(c=>c.tagName==='BUTTON'&&!/qm/.test(c.className||'')).pop(); b.fire('click'); return texto(g); };
  ok(cartao({ samambaia:1, foto:1 }).indexOf(frase)>=0,'CA9: com enfeite simples, o cartão avisa');
  ok(cartao({ foto:1 }).indexOf(frase)<0,'CA9: só com a foto, não avisa');
  ok(cartao({}).indexOf(frase)<0,'CA9: sem nenhum, não avisa'); }
// CA10
{ const L2=load().L, sv=L2.normSave({ cap:6, dia:10, maxDay:10, bank:100, up:{}, salao:{ ponto:'avenida' }, decor:{ samambaia:1, foto:1 } });
  ok(Object.keys(sv.decor).join()==='foto' && sv.bank===108,'CA10: o save antigo na Avenida fica só com a foto e R$ 8 a mais ('+sv.bank+')');
  const sv2=L2.normSave(JSON.parse(JSON.stringify(sv))); ok(sv2.bank===108 && sv2.caixa.length===sv.caixa.length,'CA10: normalizar de novo não devolve outra vez');
  ok(sv.caixa.some(r=>r.dev===8 && r.devK==='decor'),'CA10: a devolução entra numa linha do Caixa'); }
// CA11
['garagem','industrial','avenida','terraco'].forEach(p=>{ const H=jogo(p), {g,L}=H; L.DEV.on=true; g.devDecor(true);
  ok(Object.keys(g.save.decor).sort().join()===todosOs(L,p).sort().join(),'CA11: devDecor(true) em '+p+' põe só os que combinam ('+Object.keys(g.save.decor).length+')'); });
console.log(fails?('FALHOU: '+fails+'/'+total):('tudo certo ('+total+')')); process.exit(fails?1:0);
