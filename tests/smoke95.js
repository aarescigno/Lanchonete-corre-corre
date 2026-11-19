// v11.16.1 (etapa R1): retornos da Letícia. O botão de verificar atualização (app e site), o enfeite da mesa por ponto,
// a jarra de suco da área industrial no lugar novo e a buzina do entregador do eFood. (O que se vê: shot_v11_16_1.js.)
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const falso=(resp,calls)=>(url,o)=>{ calls.push([url,o]); return resp==='erro' ? Promise.reject(new Error('sem rede')) : Promise.resolve({ ok:true, json:()=>Promise.resolve({ versao:resp }) }); };
(async()=>{

// ---------- CA1: o ícone só aparece no app ou no modo dev ----------
{ const A=load(), B=load({ app:true }), C=load();
  A.L.devSync(); B.L.devSync(); ok(A.els['btn-atu'].style.display==='none','CA1: sem app e sem modo dev, #btn-atu fica escondido');
  ok(B.els['btn-atu'].style.display==='','CA1: com window.LCC_APP, aparece');
  C.g.setDev(true); C.L.devSync(); ok(C.els['btn-atu'].style.display==='','CA1: com o modo dev, aparece'); C.g.setDev(false); C.L.devSync(); ok(C.els['btn-atu'].style.display==='none','CA1: desligando o modo dev, some de novo'); }

// ---------- CA2: atuEstado ----------
{ const {L}=load(), e=L.atuEstado;
  ok(e('v11.16.1','v11.16.1')==='igual' && e('v11.16','v11.16.1')==='nova' && e('v11.15','v11.16.1')==='nova','CA2: igual e nova');
  ok(e('','v11.16.1')==='erro' && e(null,'v11.16.1')==='erro' && e(42,'v11.16.1')==='erro' && e(undefined,'v11.16.1')==='erro','CA2: vazia, nula, número e indefinida são erro'); }

// ---------- CA3: tocar no ícone ----------
{ const calls=[], H=load({ app:true, fetch:falso('v11.20',calls) }), {L,els}=H;
  els['btn-atu'].fire('click'); ok(els['ov-atu'].classList.contains('show'),'CA3: tocar no ícone abre o #ov-atu');
  await sleep(20);
  ok(txt(els['atu-txt'])==='Tem versão nova: v11.20! Seu jogo salvo continua.' && els['btn-atu-ir'].style.display!=='none','CA3: versão nova: o texto e o botão "Atualizar agora"');
  ok(calls.length===1 && /^versao\.json\?t=\d+/.test(calls[0][0]) && calls[0][1].cache==='no-store','CA3: pede versao.json?t=... com cache no-store');
  els['btn-atu-close'].fire('click'); ok(els['ov-menu'].classList.contains('show') && !els['ov-atu'].classList.contains('show'),'CA3: Voltar volta ao menu'); }
{ const calls=[], H=load({ app:true, fetch:null }), {L,els}=H; H.win.fetch=falso(L.VERSAO,calls);
  els['btn-atu'].fire('click'); await sleep(20);
  ok(txt(els['atu-txt'])==='Você já está na versão mais nova ('+L.VERSAO+').' && els['btn-atu-ir'].style.display==='none','CA3: a mesma versão: "já está na versão mais nova" e sem botão'); }
{ const calls=[], H=load({ app:true, fetch:falso('erro',calls) }), {els}=H;
  els['btn-atu'].fire('click'); await sleep(20);
  ok(txt(els['atu-txt'])==='Sem internet agora. Tente de novo mais tarde.' && els['btn-atu-ir'].style.display==='none','CA3: fetch rejeitado: sem internet'); }
{ const H=load({ app:true }), {els}=H; els['btn-atu'].fire('click'); await sleep(20);
  ok(txt(els['atu-txt'])==='Sem internet agora. Tente de novo mais tarde.','CA3: sem fetch nenhum (harness): também cai em sem internet'); }

// ---------- CA4: modo dev ----------
{ const calls=[], H=load({ fetch:falso('v11.20',calls) }), {g,L,els}=H; g.setDev(true);
  ok(g.devAtu('nova')===true && L.DEV.forca.atu==='nova','CA4: devAtu(nova) grava DEV.forca.atu');
  els['btn-atu'].fire('click'); await sleep(20);
  ok(txt(els['atu-txt'])==='Tem versão nova: v99! Seu jogo salvo continua.' && calls.length===0,'CA4: simulando "nova": v99, sem chamar o fetch');
  els['btn-atu-ir'].fire('click'); await sleep(5); ok(els['ov-menu'].classList.contains('show'),'CA4: simulando, "Atualizar agora" só volta ao menu (sem recarregar)');
  g.devAtu('erro'); els['btn-atu'].fire('click'); await sleep(20); ok(txt(els['atu-txt'])==='Sem internet agora. Tente de novo mais tarde.' && calls.length===0,'CA4: simulando "erro": sem internet, sem fetch');
  g.devAtu(null); ok(L.DEV.forca.atu===undefined,'CA4: devAtu(null) volta ao normal'); els['btn-atu'].fire('click'); await sleep(20); ok(calls.length===1 && /v11\.20/.test(txt(els['atu-txt'])),'CA4: normal de novo: chama o fetch');
  g.setDev(false); ok(g.devAtu('nova')===false,'CA4: fora do modo dev, devAtu não faz nada');
  g.setDev(true); L.abrirDev(); L.DEV.aba='hoje'; L.buildDev(); ok(/Atualização \(app\)/.test(txt(els['dev-body'])),'CA4: a seção "Atualização (app)" aparece no buildDev');
  const bs=[]; const ach=n=>{ if(n.tagName==='BUTTON') bs.push(n); (n.children||[]).forEach(ach); }; ach(els['dev-body']);
  ok(['Normal','Simular nova','Simular sem internet'].every(t=>bs.some(b=>b.textContent===t)),'CA4: com os botões Normal, Simular nova e Simular sem internet'); }

// ---------- CA5: o app ----------
{ const sw=fs.readFileSync(__dirname+'/../app/sw.template.js','utf8'), bd=fs.readFileSync(__dirname+'/../app/build.py','utf8');
  ok(/versao\.json/.test(sw) && sw.indexOf('versao.json')<sw.indexOf('caches.match'),'CA5: o service worker deixa passar o versao.json antes de qualquer cache');
  ok(/versao\.json/.test(bd) && /LCC_APP/.test(bd) && /assert/.test(bd.split('versao.json')[0].split('VERSAO')[0]+bd) ,'CA5: o build.py grava o versao.json e põe window.LCC_APP');
  const pre=bd.split('\n').find(l=>/^PRECACHE *=/.test(l)); ok(pre && !/versao/.test(pre),'CA5: o versao.json não entra no PRECACHE'); }

// ---------- CA8: o enfeite da mesa por ponto ----------
{ const H=load(), {g,L,els}=H;
  const nomes=['garagem','industrial','avenida','terraco'].map(id=>{ g.save=L.normSave({dia:30,maxDay:30,bank:5000,salao:{ponto:id}}); g.up=g.save.up; g.buildTables(); return L.enfeiteMesa(g).nome; });
  ok(nomes.join()==='Toalha xadrez,Violeta,Galheteiro,Vela','CA8: o enfeite da Garagem, da área industrial, da Avenida e do Terraço ('+nomes+')');
  ok(L.ENFEITE_MESA.industrial.elogio==='A violeta na mesa é um charme!' && L.ENFEITE_MESA.avenida.elogio==='Azeite e vinagre na mesa: que capricho!' && L.ENFEITE_MESA.terraco.elogio==='A vela na mesa deixa tudo mais aconchegante!' && L.ENFEITE_MESA.garagem.elogio==='A toalha xadrez dá um charme!','CA8: os elogios');
  g.save=L.normSave({dia:30,maxDay:30,bank:5000,salao:{ponto:'industrial'}}); g.up=g.save.up; g.buildTables(); g.goShop(30); L.setShopTab('salao');
  let t=txt(els['shop-grid']); ok(/Violeta em (todas|1 mesa)/.test(t) && !/Toalha xadrez/.test(t),'CA8: o botão de todas usa o nome do ponto');
  ok(/Violeta: R\$ 12 por mesa; melhora o ambiente no Gúgou para quem senta nela\./.test(t),'CA8: a linha de contas usa o nome do ponto');
  g.buyToalhas(); L.setShopTab('salao'); t=txt(els['shop-grid']); ok(/Violeta: todas têm/.test(t),'CA8: com todas, "Violeta: todas têm"');
  // o elogio no Gúgou
  const R=L.AVAL_CRIT.map(()=>5), rnd=Math.random, fila=[0.9,0.1,0]; Math.random=()=>fila.length?fila.shift():0;
  const el=L.avalComentario(R,'',false,2,['toalha'],false,false,undefined,false); Math.random=rnd;
  ok(el==='A violeta na mesa é um charme!','CA8: o elogio da toalha no Gúgou sai com o texto do ponto ('+el+')');
  ok(L.TOALHA.cost===12 && L.AVAL.amb.toalha===0.5,'CA8: preço e Ambiente não mudam'); }

// ---------- CA9: o lugar da jarra de suco na área industrial ----------
{ const H=load(), {g,L}=H, ST=L.LAYOUT.STATIONS;
  const dia=(ponto,n)=>{ g.save=L.normSave({dia:n,maxDay:n,bank:5000,salao:{ponto}}); g.up=g.save.up; g.up.maquina=true; g.buildTables(); g.startDay(n); g.begin(); g.schedule=[]; g.nextIdx=0; };
  dia('industrial',8); ok(JSON.stringify(ST.maquina.ap)==='{"x":-72,"y":520}' && JSON.stringify(ST.maquina.rect)==='{"x":-60,"y":450,"w":52,"h":86}','CA9: na área industrial, a jarra tem o lugar novo');
  dia('garagem',3); ok(ST.maquina.ap.x===-26 && ST.maquina.ap.y===498,'CA9: na Garagem, o de sempre');
  dia('avenida',12); ok(ST.maquina.ap.x===-26,'CA9: na Avenida, o de sempre');
  dia('terraco',30); ok(ST.maquina.ap.x===16 && ST.maquina.ap.y===156,'CA9: no Terraço, o carrinho');
  // um suco pedido na espera da área industrial é levado até o fim
  dia('industrial',8); const run=(sec,keep)=>{ for(let i=0;i<sec*20;i++){ if(keep) g.groups.forEach(x=>{ if(x.state!=='leaving') x.patLeft=1e9; }); g.update(0.05); } };
  const s=g.spawn({ type:'estudante', color:0, vip:false }); s.size=2; s.people=s.people.slice(0,2); while(s.people.length<2) s.people.push(s.people[0]);
  for(let i=0;i<60 && g.queue.some(x=>x.path.length);i++) g.update(0.05);
  run(L.MAQUINA.pede+0.1,true); run(L.BEBIDA_ESPERA.suco.prep+0.2,true);
  ok(g.ponto.bebida==='suco' && g.maqPronto().length===1,'CA9: o suco foi pedido e ficou pronto');
  g.tapStation('maquina'); let guard=0; while(g.bia.acts.length && guard++<600){ s.patLeft=1e9; g.update(0.05); }
  ok(s.sucoN===2 && !g.bia.hands.length,'CA9: a Bia levou o suco do começo ao fim (o grupo recebeu os 2 copos)'); }

// ---------- CA10: a chegada do entregador ----------
{ const H=load(), {g,L}=H; L.Sfx.muted=false;
  const chamadas=[]; const b0=L.Sfx.buzina, t0=L.Sfx.tone; L.Sfx.buzina=function(){ chamadas.push('buzina'); }; L.Sfx.tone=function(f){ chamadas.push('tone'+f); };
  g.save=L.normSave({dia:8,maxDay:8,bank:5000,salao:{ponto:'industrial'}}); g.up=g.save.up; g.buildTables(); g.startDay(8); g.begin(); g.schedule=[]; g.nextIdx=0;
  const e=g.spawn({ type:'entregador', color:0, vip:false }); L.Sfx.buzina=b0; L.Sfx.tone=t0;
  ok(chamadas.indexOf('buzina')>=0 && !chamadas.some(c=>c==='tone784'||c==='tone1046'),'CA10: a chegada toca a buzina e não os bipes antigos ('+chamadas+')');
  const gl=g.fx.filter(f=>f.k==='efood'); ok(gl.length===1 && gl[0].max===0.8 && L.ENTREGA_CHEGA.brilho===1.2,'CA10: a chegada acende o letreiro do eFood (v12.4.2: no lugar do brilho)');
  g.addGlow('maquina'); ok(g.fx.find(f=>f.k==='glow' && f.key==='maquina').max===0.4,'CA10: o addGlow sem o 2º parâmetro continua com 0,4');
  const sons=[]; L.Sfx.tone=function(f,d,t,v,dl){ sons.push([f,t]); }; L.Sfx.buzina(); L.Sfx.tone=t0; ok(true,'CA10: Sfx.buzina existe e roda');
  g.setDev(true); const n0=g.retirada.length; ok(g.devEntregador()===true && g.retirada.length===n0+1,'CA10: devEntregador() põe um entregador na fila de retirada');
  L.abrirDev(); L.DEV.aba='hoje'; L.buildDev(); { const bs=[]; const ach=n=>{ if(n.tagName==='BUTTON') bs.push(n); (n.children||[]).forEach(ach); }; ach(H.els['dev-body']); const bt=bs.find(b=>b.textContent==='Chegar entregador'); ok(/Entregador do eFood/.test(txt(H.els['dev-body'])) && bt,'CA10: o modo dev tem a seção "Entregador do eFood" com o botão "Chegar entregador"'); const n2=g.retirada.length; bt.fire('click'); ok(g.retirada.length===n2+1 || n2>=L.RETIRADA.fila.length,'CA10: o botão põe um entregador na retirada'); }
  g.save=L.normSave({dia:30,maxDay:30,bank:5000,salao:{ponto:'terraco'}}); g.up=g.save.up; g.buildTables(); g.startDay(30); g.begin(); g.schedule=[]; g.nextIdx=0;
  const n1=g.retirada.length; ok(g.devEntregador()===false && g.retirada.length===n1,'CA10: no Terraço, que não tem retirada, devEntregador não põe ninguém'); g.setDev(false); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails);
if(fails) process.exit(1);
})();
