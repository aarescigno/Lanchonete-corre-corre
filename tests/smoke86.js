// v11.10 (etapa 7b): a lojinha com o topo fixo (o scrollTop do grid), a lista das Versões enxuta. As medidas de tela estão no menu_fit.py.
const load=require('./harness.js');
const fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const html=fs.readFileSync('../lanchonete.html','utf8');

// ---------- CA5: a lista das Versões ----------
{ const i=html.indexOf('<ul class="verlist">'), j=html.indexOf('</ul>',i); const bloco=html.slice(i,j);
  const lis=bloco.split('<li>').slice(1); const vs=lis.map(l=>/^<b>(v[\d.]+)<\/b>/.exec(l)[1]);
  const esp=['v11.11','v11.10','v11.9','v11.8','v11.7','v11.6','v11.5','v11.4','v11.3','v11.2','v11.1','v11','v10','v9','v8','v7','v6','v5','v4','v3','v2','v1'];
  ok(vs.join()===esp.join(),'CA5: a lista tem as 22 linhas, de v11.11 a v11.1, v11 e v10 a v1, nesta ordem ('+vs.length+')');
  ok(lis.filter(l=>l.indexOf('versão atual')>=0).length===1 && lis[0].indexOf('versão atual')>=0,'CA5: "versão atual" só na v11.11');
  const comLink=lis.filter(l=>/Abrir a v\d+<\/a>/.test(l)).map(l=>/^<b>(v[\d.]+)<\/b>/.exec(l)[1]);
  ok(comLink.join()==='v10,v9,v8,v7,v6,v5,v4,v3,v2,v1','CA5: link "Abrir" em v1 a v10 e em nenhuma outra ('+comLink.join()+')');
  ok(lis[12].indexOf('<br><a href="versoes/v9.html" target="_blank" rel="noopener">Abrir a v9</a>')<0 && lis[13].indexOf('<br><a href="versoes/v9.html" target="_blank" rel="noopener">Abrir a v9</a>')>=0,'CA5: o link da v9 no formato dos outros');
  ok(fs.existsSync('../versoes/v9.html') && fs.existsSync('../versoes/v10.html'),'CA5: os arquivos versoes/v9.html e v10.html existem');
  ok(/ id="vtag" aria-label="Versão 11\.11">v11\.11</.test(html) && /VERSAO = 'v11\.11'/.test(html),'CA5: o selo e a VERSAO dizem v11.11'); }

// ---------- CA6: o grid da lojinha guarda o lugar na mesma seção e volta ao alto ao trocar ----------
{ const H=load(); const {g,L,els}=H; g.save=L.normSave({bank:90000,dia:12,maxDay:12,up:{tenis:true}}); g.up=g.save.up; g.buildTables(); g.goShop(12);
  const grid=()=>els['shop-grid'];
  L.setShopGrupo('lanchonete'); ok(grid().scrollTop===0 || grid().scrollTop===undefined,'CA6: abre no alto');
  const alvo=(sec)=>{ L.setShopTab(sec); grid().scrollTop=120; };
  alvo('melhorias');
  const bt=(function f(e){ if(e.tagName==='BUTTON' && /btn/.test(e.className||'') && !e.disabled && /R\$/.test(e.textContent||'') ) return e; for(const c of (e.children||[])){ const r=f(c); if(r) return r; } return null; })(grid());
  ok(!!bt,'CA6: acha um botão de compra na seção Melhorias');
  const banco0=g.save.bank; if(bt) bt.fire('click');
  ok(g.save.bank!==banco0,'CA6: a compra aconteceu ('+banco0+' → '+g.save.bank+')');
  ok(grid().scrollTop===120,'CA6: comprar na mesma seção mantém o scrollTop em 120 ('+grid().scrollTop+')');
  els['btn-shop-voltar'].fire('click'); ok(grid().scrollTop===0,'CA6: "‹ Voltar" leva a 0');
  grid().scrollTop=120; L.setShopTab('salao'); ok(grid().scrollTop===0,'CA6: abrir uma seção leva a 0');
  grid().scrollTop=120; L.setShopGrupo('equipe'); ok(grid().scrollTop===0,'CA6: trocar de grupo leva a 0');
  // o clique em um cartão (abrir a seção) pelo próprio grid
  L.setShopGrupo('lanchonete'); grid().scrollTop=120; grid().children[1].fire('click'); ok(grid().scrollTop===0,'CA6: o clique no cartão leva a 0'); }

console.log(`\nsmoke86: ${total-fails}/${total}`); process.exit(fails?1:0);
