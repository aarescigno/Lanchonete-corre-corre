// v12.11.2: o couvert cinza e a cabecinha nos cursos do Cardápio (spec: docs/spec-v12.11.2.md). CA1 e CA2 (CA3 é a captura shot_v12_11_2.js).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>String(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const acha=(n,f,r=[])=>{ if(f(n)) r.push(n); (n.children||[]).forEach(c=>acha(c,f,r)); return r; };
const abre=(ponto,sv,tab,grupo)=>{ const H=load(), {g,L}=H;
  g.mode='carreira'; g.save=L.normSave(Object.assign({dia:10,maxDay:10,bank:20000,salao:{ponto}},sv||{})); g.up=g.save.up; g.setDev(true); g.buildTables(); g.goShop(10);
  L.setShopGrupo(grupo); L.setShopTab(tab); return H; };
bloco('CA1',()=>{
  const H=abre('avenida',{},'melhorias','lanchonete'); const {L,els}=H; H.g.save.equipe.couvert=false; H.g.save.equipe.taxa=true; L.setShopTab('melhorias');
  let ult=['lanchonete','melhorias']; const grid=()=>els['shop-grid'];
  let tg=acha(grid(),n=>n.tagName==='BUTTON' && /Cobrar couvert/.test(n.textContent))[0];
  if(!tg){ // procura a seção que tem o couvert
    for(const g of ['lanchonete','equipe']) for(const t of ['melhorias','ambiente','luxo','decor','equipe']){ try{ L.setShopGrupo(g); L.setShopTab(t); }catch(e){} tg=acha(grid(),n=>n.tagName==='BUTTON' && /Cobrar couvert/.test(n.textContent))[0]; if(tg) break; if(tg) break; } }
  ok(!!tg,'CA1: o botão "Cobrar couvert" existe na Avenida');
  ok(tg && tg.disabled===true && tg.getAttribute('aria-pressed')==='false','CA1: sem o couvert o botão está disabled e desligado (mesmo com taxa guardada)');
  H.g.setStaff('couvert',true); L.setShopTab('melhorias');
  tg=acha(grid(),n=>n.tagName==='BUTTON' && /Cobrar couvert/.test(n.textContent))[0];
  ok(tg && !tg.disabled && tg.getAttribute('aria-pressed')==='true','CA1: contratado, o botão liga e mostra a escolha guardada (cobrar)');
  H.g.setStaff('couvert',false); L.setShopTab('melhorias');
  tg=acha(grid(),n=>n.tagName==='BUTTON' && /Cobrar couvert/.test(n.textContent))[0];
  ok(tg && tg.disabled && H.g.save.equipe.taxa===true,'CA1: dispensar apaga o botão mas a escolha de cobrar continua guardada');
  H.g.setStaff('couvert',true); L.setShopTab('melhorias');
  tg=acha(grid(),n=>n.tagName==='BUTTON' && /Cobrar couvert/.test(n.textContent))[0];
  ok(tg && !tg.disabled && tg.getAttribute('aria-pressed')==='true','CA1: recontratado, a escolha de cobrar volta');
});
bloco('CA2',()=>{
  const quem=H=>acha(H.els['shop-grid'],n=>n.tagName==='CANVAS' && n.getAttribute && n.getAttribute('data-cabeca')).map(n=>n.getAttribute('data-cabeca'));
  const H=abre('terraco',{},'cardapio','lanchonete');
  const t=txt(H.els['shop-grid']);
  ok(!/de experiência/.test(t),'CA2: nenhum cartão de curso do Cardápio tem "de experiência"');
  const q=quem(H);
  const cartoes=acha(H.els['shop-grid'],n=>/\bitem\b/.test(n.className||'') && /Curso/.test(txt(n)) && n.children.some(c=>c.tagName==='CANVAS'));
  ok(cartoes.length>0 && cartoes.every(c=>c.children.some(x=>x.tagName==='CANVAS' && x.getAttribute('data-cabeca'))),'CA2: todo cartão de curso do Cardápio tem a cabecinha ('+cartoes.length+' cartões)');
  ['tonhao','dani','joca','anselmo','lia'].forEach(k=>ok(q.includes(k),'CA2: a cabecinha de "'+k+'" aparece no Cardápio do Terraço'));
});
console.log(fails?('FALHOU: '+fails+'/'+total):('OK: '+total)); process.exit(fails?1:0);
