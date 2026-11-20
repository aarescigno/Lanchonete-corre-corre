// v12.8.2: o entretenimento (TV e som, TVs, couvert, música ao vivo) também nas Melhorias. Spec: docs/spec-v12.8.2.md. CA1 a CA5.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const todos=(e,f,o)=>{ o=o||[]; if(f(e)) o.push(e); (e.children||[]).forEach(c=>todos(c,f,o)); return o; };
const jogo=(cap,ponto)=>{ const H=load(), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave({ cap, dia:10, maxDay:10, bank:50000, up:{ tenis:true }, salao:{ ponto } });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const fichas=(H,sec)=>{ H.L.setShopGrupo('lanchonete'); H.L.setShopTab(sec); return todos(H.els['shop-grid'],e=>e.getAttribute&&e.getAttribute('data-ficha')).map(e=>e.getAttribute('data-ficha')); };
const tem=(H,sec,f)=>fichas(H,sec).includes(f);

// CA1
{ const H=jogo(3,'garagem'); ok(tem(H,'melhorias','l-tvsom') && tem(H,'luxo','l-tvsom'),'CA1: Garagem: TV e som nas Melhorias e no Luxo'); }
// CA2
{ const H=jogo(5,'industrial'); ok(tem(H,'melhorias','l-tvs') && tem(H,'luxo','l-tvs'),'CA2: Industrial: TVs nas duas abas'); }
// CA3
{ const H=jogo(7,'avenida'); ok(tem(H,'melhorias','l-couvert') && tem(H,'luxo','l-couvert'),'CA3: Avenida: Couvert nas duas abas');
  const T=jogo(10,'terraco'); ok(tem(T,'melhorias','l-musica') && tem(T,'luxo','l-musica'),'CA3: Terraço: Música ao vivo nas duas abas'); }
// CA4
{ const H=jogo(3,'garagem'), {g,L}=H; L.setShopGrupo('lanchonete'); L.setShopTab('melhorias');
  const antes=L.luxoPts(g).amb, c=todos(H.els['shop-grid'],e=>e.getAttribute&&e.getAttribute('data-ficha')==='l-tvsom')[0];
  const b=todos(c,e=>e.tagName==='BUTTON'&&/TV de tubo/.test((e.textContent||'')+(e.children||[]).map(x=>x.textContent).join('')))[0];
  ok(!!b,'CA4: botão da TV achado nas Melhorias'); b.fire('click');
  ok(g.save.equipe.tv===true,'CA4: ligar pelas Melhorias liga a TV');
  L.setShopTab('luxo'); const c2=todos(H.els['shop-grid'],e=>e.getAttribute&&e.getAttribute('data-ficha')==='l-tvsom')[0];
  ok(todos(c2,e=>/Ligado: TV/.test((e.textContent||''))).length>0,'CA4: o Luxo mostra a TV ligada');
  ok(L.luxoPts(g).amb>antes,'CA4: o ambiente sobe com a TV ligada ('+antes+' → '+L.luxoPts(g).amb+')'); }
// CA5
{ const H=jogo(3,'garagem'), f=fichas(H,'melhorias'); ok(!f.includes('l-tvs')&&!f.includes('l-couvert')&&!f.includes('l-musica'),'CA5: Garagem sem cartões de outro ponto nas Melhorias'); }
console.log(fails?('FALHOU '+fails+'/'+total):('OK '+total+'/'+total)); process.exit(fails?1:0);
