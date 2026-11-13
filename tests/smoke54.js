// v9.6.8, etapa 3f-2: menos texto na tela. A lojinha sem descrições (cartão: desenho, nome, preço, situação curta e o "?" do Manual),
// o quadro "agora → próximo nível" em bolinhas, a abertura do dia curta e as notas novas dos dias.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const todos=(e,f,o)=>{ o=o||[]; if(f(e)) o.push(e); (e.children||[]).forEach(c=>todos(c,f,o)); return o; };
const ehItem=e=>(e.className||'').split(' ').indexOf('item')>=0;
const grid=H=>H.els['shop-grid'];
const jogo=(cap,ponto,sv)=>{ const H=load(), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ cap, dia:10, maxDay:10, bank:50000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1, joca:2, cami:1, anselmo:2 }, salao:{ ponto:ponto||'garagem' } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const SECOES=['cardapio','melhorias','bia','luxo','manut','divulga','tonhao','dani','joca','cami','anselmo','banco','mudanca'];

for (const ponto of ['garagem','industrial','avenida']){
  const H=jogo(ponto==='avenida'?7:ponto==='industrial'?5:3,ponto,{ salao:{ ponto } }), {L,els}=H;
  let longos=[], semQm=[], itens=0, fichaRuim=[];
  SECOES.forEach(sec=>{
    L.setShopGrupo(sec==='banco'||sec==='mudanca'?'dinheiro':['tonhao','dani','joca','cami','anselmo','bia'].includes(sec)?'equipe':'lanchonete'); L.setShopTab(sec);
    todos(grid(H),ehItem).forEach(c=>{
      itens++;
      if(sec!=='banco') todos(c,e=>e.tagName==='SPAN'&&(e.textContent||'').length>40).forEach(e=>longos.push(sec+': '+e.textContent));
      const q=c.children.find(x=>/qm/.test(x.className||''));
      if(!q || !/^No Manual: /.test(q.getAttribute('aria-label')||'') || q.textContent!=='?') semQm.push(sec+': '+txt(c).slice(0,30));
      else if(!L.MANUAL.some(f=>f.id===q.getAttribute('data-ficha'))) fichaRuim.push(sec+': '+q.getAttribute('data-ficha'));
    });
  });
  ok(itens>20,ponto+': '+itens+' cartões percorridos');
  ok(longos.length===0,ponto+': nenhum span de cartão com mais de 40 caracteres (fora o Banco)'+(longos.length?' → '+longos.slice(0,4).join(' | '):''));
  ok(semQm.length===0,ponto+': todo cartão tem o "?"'+(semQm.length?' → '+semQm.slice(0,4).join(' | '):''));
  ok(fichaRuim.length===0,ponto+': o "?" aponta para uma ficha que existe'+(fichaRuim.length?' → '+fichaRuim.join(', '):''));
}

// (b) o "?" abre a ficha certa
{ const H=jogo(7,'avenida'), {L,els,g}=H;
  const toca=(sec,grupo,pega,ficha)=>{ L.setShopGrupo(grupo); L.setShopTab(sec); const c=todos(grid(H),ehItem).find(pega); const q=c.children.find(x=>/qm/.test(x.className||''));
    ok(q.getAttribute('data-ficha')===ficha,sec+': o "?" é da ficha '+ficha);
    q.fire('click'); ok(els['ov-manual'].classList.contains('show'),sec+': o "?" abre o Manual');
    els['btn-manual-voltar'].fire('click'); ok(els['ov-shop'].classList.contains('show'),sec+': Voltar volta à lojinha'); };
  toca('melhorias','lanchonete',c=>/Ventilador/.test(txt(c)),'l-ventilador');
  toca('luxo','lanchonete',c=>true,'l-luxo');
  toca('divulga','lanchonete',c=>/Redes sociais/.test(txt(c)),'l-divulga');
  toca('cardapio','lanchonete',c=>/Curso de/.test(txt(c)),'l-cardapio');
  toca('tonhao','equipe',c=>/Tonhão ·/.test(txt(c)),'e-tonhao');
  toca('dani','equipe',c=>/Dani ·/.test(txt(c)),'e-dani');
}

// (c) o quadro "agora → próximo nível": bolinhas, sem % e sem segundos; a diária em R$
{ const H=jogo(7,'avenida',{ equipe:{ tonhao:1, dani:2, joca:2, cami:1, anselmo:2 } }), {L}=H;
  ['tonhao','dani','joca','cami','anselmo'].forEach(sec=>{
    L.setShopGrupo('equipe'); L.setShopTab(sec);
    const boxes=todos(grid(H),e=>(e.className||'')==='next'); const t=boxes.map(txt).join(' | ');
    ok(boxes.length>0 && /●/.test(t) && /Diária/.test(t) && /R\$ \d+/.test(t) && !/%/.test(t) && !/ s\b/.test(t) && !/Lava/.test(t),sec+': o quadro tem bolinhas e a diária em R$, sem % nem segundos'+(boxes.length?'':' (sem quadro)'));
  });
  L.setShopTab('tonhao'); ok(/Experiência|Pronto para o aumento!/.test(txt(grid(H))) && !/Faltam|Prato caprichado/.test(txt(grid(H))),'Tonhão: rótulo Experiência, sem "Faltam" nem o prato caprichado');
}

// (d) a abertura do dia
{ const H=load(), {g,L,els}=H; g.save=L.normSave({bank:2000,dia:3,maxDay:3}); g.up=g.save.up; g.buildTables(); g.startDay(3);
  ok(/^Meta: R\$ \d+ · ★★ R\$ \d+ · ★★★ R\$ \d+$/.test(els['intro-goal'].textContent) && !/Custos do dia/.test(els['intro-goal'].textContent),'dia 3: meta com as estrelas, sem os custos do dia');
  ok(els['intro-note'].textContent==='Chegou a executiva! E abriu o balcão de sucos.','dia 3: a nota nova ('+els['intro-note'].textContent+')');
  g.startDay(1); ok(els['intro-note'].textContent==='Arraste cada grupo até uma mesa livre.'+' Primeira vez? Faça a Missão zero, no menu.' || els['intro-note'].textContent==='Arraste cada grupo até uma mesa livre.','dia 1: a nota nova e a Missão zero');
  g.save.efoodNota=1; g.startDay(7); ok(els['intro-note'].textContent==='Tonhão está gripado: a cozinha anda devagar.','dia 7: a nota nova ('+els['intro-note'].textContent+')');
}
console.log('smoke54: total = '+total+'  fails = '+fails);
