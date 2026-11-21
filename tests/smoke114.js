// v12.8.4: a espera sentada da área industrial (cadeirinhas → banquinhos, sem voltar) e o enfeite das mesas com o linho. Spec: docs/spec-v12.8.4.md. CA1 a CA10.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const todos=(e,f,o)=>{ o=o||[]; if(f(e)) o.push(e); (e.children||[]).forEach(c=>todos(c,f,o)); return o; };
const texto=e=>(e.textContent||'')+(e.children||[]).map(texto).join('');
const jogo=(cap,ponto,extra)=>{ const H=load(), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ cap, dia:10, maxDay:10, bank:5000, up:{}, salao:{ ponto } },extra||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const cartao=H=>{ H.L.setShopGrupo('lanchonete'); H.L.setShopTab('melhorias'); return todos(H.els['shop-grid'],e=>e.getAttribute&&e.getAttribute('data-ficha')==='l-assento')[0]; };
const botoes=c=>c?todos(c,e=>e.tagName==='BUTTON').map(texto).filter(t=>t!=='?'):[];

// CA1: sem assento, preço cheio
{ const H=jogo(5,'industrial'), {g,L}=H, A=L.INDUSTRIAL.assento;
  ok(A.cadeira.cost===60 && A.banco.cost===90,'CA1: cadeirinhas R$ 60 e banquinhos R$ 90 na tabela');
  const b0=g.save.bank; ok(g.comprarInd('assento','cadeira') && g.save.bank===b0-60,'CA1: sem assento, as cadeirinhas custam R$ 60');
  const H2=jogo(5,'industrial'), g2=H2.g, c0=g2.save.bank; ok(g2.comprarInd('assento','banco') && g2.save.bank===c0-90,'CA1: sem assento, os banquinhos custam R$ 90'); }
// CA2: cadeirinhas → banquinhos por R$ 45
{ const H=jogo(5,'industrial',{ up:{ assento:'cadeira' } }), {g}=H, b0=g.save.bank;
  ok(g.comprarInd('assento','banco') && g.save.bank===b0-45 && g.up.assento==='banco','CA2: com as cadeirinhas, os banquinhos tiram R$ 45 ('+(b0-g.save.bank)+')'); }
// CA3: banquinhos → cadeirinhas não vale
{ const H=jogo(5,'industrial',{ up:{ assento:'banco' } }), {g}=H, b0=g.save.bank;
  ok(g.comprarInd('assento','cadeira')===false && g.save.bank===b0 && g.up.assento==='banco','CA3: com os banquinhos, voltar às cadeirinhas não vale e não cobra'); }
// CA4: cadeirinhas de novo não vale
{ const H=jogo(5,'industrial',{ up:{ assento:'cadeira' } }), {g}=H, b0=g.save.bank;
  ok(g.comprarInd('assento','cadeira')===false && g.save.bank===b0,'CA4: com as cadeirinhas, comprar as cadeirinhas de novo não cobra'); }
// CA5: paciência e luxo
{ const H=jogo(5,'industrial',{ up:{ assento:'cadeira' } }), {g,L}=H;
  ok(L.assentoSlow('cadeira')===0.15 && L.assentoSlow('banco')===0.2,'CA5: a espera 15% mais devagar nas cadeirinhas e 20% nos banquinhos');
  const m1=L.luxoPts(g).mov; g.up.assento='banco'; const m2=L.luxoPts(g).mov;
  ok(m2===m1+1,'CA5: o luxo de Móveis dos banquinhos é 1 maior ('+m1+' → '+m2+')'); }
// CA6: o cartão
{ const H=jogo(5,'industrial',{ up:{ assento:'cadeira' } }), b=botoes(cartao(H));
  ok(b.some(t=>/Banquinhos de madeira/.test(t) && /45/.test(t)) && !b.some(t=>/90/.test(t)),'CA6: com as cadeirinhas, o botão dos banquinhos diz R$ 45 ('+b.join(' | ')+')');
  const H2=jogo(5,'industrial',{ up:{ assento:'banco' } }), b2=botoes(cartao(H2));
  ok(b2.length===1 && /Tem: Banquinhos de madeira/.test(b2[0]),'CA6: com os banquinhos, um botão só ('+b2.join(' | ')+')'); }
// CA7: modo dev com a lojinha de graça
{ const H=jogo(5,'industrial',{ up:{ assento:'banco' } }), {g,L}=H; L.DEV.on=true; L.DEV.real=false;
  const b=botoes(cartao(H)), b0=g.save.bank;
  ok(b.length===2,'CA7: modo dev: os dois botões ('+b.join(' | ')+')');
  ok(g.comprarInd('assento','cadeira') && g.up.assento==='cadeira' && g.save.bank===b0,'CA7: modo dev: volta às cadeirinhas, de graça');
  L.DEV.on=false; }
// CA8: comprar o linho devolve metade dos enfeites
const comLinho=(linho)=>{ const H=jogo(7,'avenida',{ moveis:{ madeira:1, acolch:1, linho:linho?1:0 } }), {g}=H; return H; };
{ const H=comLinho(false), {g,L}=H, ms=g.save.salao.mesas;
  ok(ms.length>=4,'CA8: a Avenida tem '+ms.length+' mesas');
  ms[0].t=1; ms[1].t=1; ms[2].t=1; g.guardarMesa(2); g.salaoSaved && g.salaoSaved();
  const nT=g.save.salao.mesas.concat(g.estoque).filter(m=>m.t).length;
  ok(nT===3 && g.estoque.length===1 && g.estoque[0].t===1,'CA8: 3 mesas com enfeite (uma no estoque)');
  const b0=g.save.bank; ok(g.buyMovel('linho'),'CA8: o linho comprado');
  ok(b0-g.save.bank===582,'CA8: o dinheiro cai R$ 582 (600 − 18): '+(b0-g.save.bank));
  ok(g.save.salao.mesas.concat(g.estoque).every(m=>!m.t),'CA8: nenhuma mesa com enfeite'); }
// CA9: com o linho, o enfeite não se compra
{ const H=comLinho(true), {g}=H, b0=g.save.bank;
  ok(g.buyToalha(0)===false && g.buyToalhas()===false && g.save.bank===b0,'CA9: com o linho, buyToalha e buyToalhas não valem e não cobram'); }
// CA10: o editor do salão
{ const H=comLinho(true), {g,L}=H; L.setShopGrupo('lanchonete'); g.salaoSel=0; L.setShopTab('salao');
  const tudo=todos(H.els['shop-grid'],()=>true), bt=tudo.filter(e=>e.tagName==='BUTTON').map(texto);
  ok(bt.length>3 && !bt.some(t=>/Galheteiro/.test(t)),'CA10: com o linho, nenhum botão do galheteiro ('+bt.length+' botões)');
  ok(tudo.some(e=>e.textContent==='As toalhas de linho cobrem todas as mesas.'),'CA10: a frase do linho aparece');
  const H2=comLinho(false); H2.L.setShopGrupo('lanchonete'); H2.L.setShopTab('salao');
  const bt2=todos(H2.els['shop-grid'],e=>e.tagName==='BUTTON').map(texto);
  ok(bt2.some(t=>/Galheteiro em todas/.test(t)),'CA10: sem o linho, o botão "Galheteiro em todas" continua'); }

console.log(fails?('FALHOU '+fails+'/'+total):('OK '+total+'/'+total)); process.exit(fails?1:0);
