// v11, etapa 6d: o futuro da Corre-Corre: a cena final (oito cenas no motor da abertura), os créditos, o fluxo da 1ª estrela e das estrelas novas,
// o save da v10.10, o botão História ("O final"), o modo dev, o movimento reduzido e a v10 guardada. A placa na parede e o adesivo (T6) vão no fim.
// CA1 o motor; CA2 as cenas por estrela; CA3 a legenda da placa; CA4 a 1ª estrela; CA5 estrela nova; CA6 save da v10.10; CA7 o botão História;
// CA8 o modo dev; CA9 movimento reduzido e Pular; CA10 a v10 guardada. (CA11 é o carreira.js; CA12 é o shot_v11.js.)
const load=require('./harness.js'), fs=require('fs'), cp=require('child_process');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const GUIA=(extra)=>Object.assign({ n:2, prox:0, v:[{ d:52, it:[2,2,2,2,2] },{ d:56, it:[2,2,2,2,2] }], noite:0, ult:60, est:1, rec:0, bol:[1,1,1,1,1,1], convRec:1, ver:1 },extra||{});
const jogo=(cap,sv,opt)=>{ const H=nova(opt), {g,L}=H; const n=61;
  g.save=L.normSave(Object.assign({ histV:1, capV:6, cap, dia:n, maxDay:n, bank:6000, v10:1, rosa:1, up:{ tenis:true, bandeja:true }, equipe:{ tonhao:3, anselmo:2 }, salao:{ ponto:'terraco' }, conversa:null, pontoDia:5, libera:{ confeitaria:2, joca:2, cami:2, anselmo:2, lia:2 }, convCard:1, convDiv:1, convEnt:1, convPlanta:1, convQuit:1, convTeto:1, convExig:1, convSocorro:1, convCrit:1, guia:GUIA() }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); return H; };
const passa=g=>{ let n=0; while(g.conversa && n<40){ g.conversa.seguir(); n++; } return n; };
const ids=ab=>ab.cenas.map(c=>c.id);
/* toca a abertura atual até o fim, cena por cena (seguir), e devolve os ids que passaram */
const toca=(L)=>{ const v=[]; let ab=L.aberturaAtual(), n=0; while(ab && !ab.fim && n<30){ v.push(ab.cena.id); ab.seguir(); ab=L.aberturaAtual(); n++; } return v; };
const ORIG=['casa','aurora','tempero','estrela','hospital','saudade','promessa','tonhao','banco','inauguracao'];
const E1=['telefone','placa','apagou','retrato','escola','roda'], E2=['telefone','placa','apagou','retrato','equipe','escola','roda'], E3=['telefone','placa','apagou','retrato','equipe','escola','ceu','roda'];

// ---------- 1. o motor: a abertura como antes e o FINAL (CA1) ----------
{ const L=load({ historia:true }).L;
  const a=new L.Abertura('menu',false);
  ok(a.n===10 && ids(a).join()===ORIG.join() && a.cena.t===7 && a.cenas[4].pRM===0.55 && a.cenas[9].titulo==='O sonho da Bia','a abertura toca as mesmas dez cenas, tempos e títulos de antes');
  ok(a.leg==='A Bia cresceu na cozinha de casa, vendo a mãe, a Rosa, cozinhar.' && a.texto().indexOf('Rosa: Comida boa é carinho')>=0,'a legenda e o texto do leitor de tela da abertura seguem iguais');
  const f=new L.Abertura('menu',false,L.FINAL,{ est:3 });
  ok(L.FINAL.cenas.length===8 && L.FINAL.fade===0.5 && f.n===8 && f.cena.id==='telefone' && f.cena.t===6.5,'o roteiro FINAL tem oito cenas e a Abertura toca o que recebe');
  ok(L.FINAL.cenas.map(c=>c.t).join()==='6.5,8,7.5,8,8,8.5,8,9' && L.FINAL.cenas.map(c=>c.min).join()==='1,1,1,1,2,1,3,1','os tempos e as estrelas mínimas de cada cena (min) são os da spec');
  ok(L.FINAL.cenas[7].titulo==='Fim' && L.FINAL.cenas[0].falas[0].s==='Alô?... É do Michelzão?!' && L.FINAL.cenas[2].falas[0].q==='braulio' && L.FINAL.cenas[5].falas[0].q==='dani','falas e título da spec (Fim; o Bráulio e a Dani falam)');
  const e=new L.Abertura('menu',false,L.FINAL,{ est:1 }); e.i=4; ok(/Dani: Eu era lenta, mas aprendi rápido\. Vocês também vão!/.test(e.texto()),'o leitor de tela diz "Dani: ..." (nome de quem fala)');
  ok(L.AB_ALT.dani>0 && L.AB_BASE.dani>0 && L.AB_CENAS && E3.every(id=>typeof L.AB_CENAS[id]==='function') && typeof L.AB_CENAS.creditos==='function','AB_ALT e AB_BASE têm a Dani, e as oito cenas e os créditos estão desenhados no AB_CENAS'); }

// ---------- 2. as cenas por estrela (CA2) e a legenda da placa (CA3) ----------
{ const L=load({ historia:true }).L, mk=(est,desde,cred)=>new L.Abertura('menu',false,L.FINAL,{ est, desde:desde||0, creditos:!!cred });
  ok(ids(mk(1)).join()===E1.join(),'1 estrela: '+ids(mk(1)).join(' › '));
  ok(ids(mk(2)).join()===E2.join(),'2 estrelas: a equipe entra depois do retrato');
  ok(ids(mk(3)).join()===E3.join(),'3 estrelas: a equipe e o céu (depois da escola)');
  ok(ids(mk(3,0,true)).join()===E3.concat('creditos').join() && mk(1,0,true).cenas.slice(-1)[0].t===6,'os créditos vêm depois da roda e duram 6 s');
  ok(ids(mk(2,1)).join()==='placa,equipe' && ids(mk(3,1)).join()==='placa,equipe,ceu' && ids(mk(3,2)).join()==='placa,ceu','estrela nova: só a placa e as cenas ainda não vistas');
  const leg=est=>{ const a=mk(est); a.i=1; return a.leg; };
  ok(leg(1)==='A Lanchonete Corre-Corre ganhou a estrela do Michelzão.' && leg(2)==='A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão.' && leg(3)==='A Lanchonete Corre-Corre ganhou três estrelas do Michelzão, a nota mais alta do guia.','a legenda da placa muda com 1, 2 e 3 estrelas'); }

// ---------- 3. o fluxo da 1ª estrela (CA4) ----------
{ const estrelas=est=>{ const H=jogo(14,{ conversa:'depois', guia:GUIA({ est, ver:1 }) }), {g,L,els}=H; g.save.guia.visto=0;
    let fim=0; L.fluxoHistoria(()=>{ fim++; }); ok(g.conversa && g.conversa.falas===L.HISTORIA[13].depois,'('+est+') a conversa de depois do cap. 14 toca primeiro'); passa(g);
    ok(L.aberturaAtual() && L.aberturaAtual().cena.id==='telefone' && els['ov-abertura'].classList.contains('show'),'('+est+') depois da conversa, a cena final (no #ov-abertura)');
    const v=toca(L); ok(v.join()===(est===1?E1:est===2?E2:E3).concat('creditos').join(),'('+est+') toca '+v.length+' quadros, a roda e os créditos');
    ok(g.save.guia.visto===est && g.save.cap===15,'('+est+') guia.visto = '+est+' e o cap. vira 15 (o Fim)');
    ok(els['ov-guia'].classList.contains('show') && !els['ov-continua'].classList.contains('show'),'('+est+') depois dos créditos vem o boletim, ainda sem o cartão'); els['btn-guia'].fire('click');
    ok(els['ov-continua'].classList.contains('show') && els['cont-h'].textContent==='Fim da história' && g.save.guia.ver===0,'('+est+') e então o cartão "Fim da história"');
    return { H, p:els['cont-p'].textContent, fim:()=>fim, btn:()=>els['btn-continua'].fire('click') }; };
  const r1=estrelas(1); ok(r1.p==='A casa segue aberta. Para mais estrelas, marque outra noite na lojinha.','1 estrela: "A casa segue aberta. Para mais estrelas, marque outra noite na lojinha."'); r1.btn(); ok(r1.fim()===1,'"Seguir jogando" volta ao jogo (a campanha continua)');
  const r3=estrelas(3); ok(r3.p==='A casa segue aberta, com a nota mais alta do guia na parede.','3 estrelas na 1ª noite: "A casa segue aberta, com a nota mais alta do guia na parede."');
  estrelas(2);
  // Pular nos créditos e em qualquer cena também marca como vista
  const H=jogo(14,{ conversa:'depois' }), {g,L}=H; g.save.guia.visto=0; L.fluxoHistoria(()=>{}); passa(g); L.aberturaAtual().pular(); ok(g.save.guia.visto===1 && g.save.cap===15 && !L.aberturaAtual(),'"Pular" termina a cena final, marca como vista e segue'); }

// ---------- 4. estrela nova mais tarde (CA5) ----------
{ const H=jogo(15,{ guia:GUIA({ est:2, ver:1, visto:1 }) }), {g,L,els}=H;
  let fim=0; L.fluxoHistoria(()=>{ fim++; });
  ok(L.aberturaAtual() && L.aberturaAtual().cena.id==='placa' && ids(L.aberturaAtual()).join()==='placa,equipe','na 2ª estrela tocam só a placa e a equipe (sem créditos)');
  ok(L.aberturaAtual().leg==='A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão.','com a legenda e a placa novas');
  toca(L); ok(g.save.guia.visto===2,'guia.visto sobe para 2');
  ok(els['ov-guia'].classList.contains('show') && fim===0,'e depois vem o boletim'); els['btn-guia'].fire('click'); ok(fim===1 && g.save.guia.ver===0,'"Continuar" segue (ver 0)');
  const H2=jogo(15,{ guia:GUIA({ est:3, ver:1, visto:1 }) }); H2.L.fluxoHistoria(()=>{}); ok(ids(H2.L.aberturaAtual()).join()==='placa,equipe,ceu' && toca(H2.L).length===3 && H2.g.save.guia.visto===3,'de 1 para 3 estrelas: a placa, a equipe e o céu');
  const H3=jogo(15,{ guia:GUIA({ est:2, ver:1, visto:2 }) }); let f3=0; H3.L.fluxoHistoria(()=>{ f3++; }); ok(!H3.L.aberturaAtual() && H3.els['ov-guia'].classList.contains('show'),'sem estrela nova, só o boletim'); }

// ---------- 5. o save da v10.10 (CA6) ----------
{ const H=jogo(15,{ guia:GUIA({ est:1, ver:0, visto:undefined }) }), {g,L}=H;
  ok(g.save.guia.visto===0 && L.normGuia({ n:2, prox:0, v:[], visto:9 }).visto===0 && L.normGuia({ n:2, prox:0, v:[], visto:2 }).visto===2,'normGuia: `visto` de 0 a 3 (ausente ou inválido, 0)');
  ok(g.save.capV===6,'normSave grava capV 6');
  let fim=0; L.fluxoHistoria(()=>{ fim++; });
  ok(L.aberturaAtual() && L.aberturaAtual().cena.id==='telefone' && fim===0,'save da v10.10 com estrela e sem `visto`: a cena final toca antes de seguir');
  const v=toca(L); ok(v.join()===E1.concat('creditos').join() && g.save.guia.visto===1 && fim===1,'com os créditos, marca como vista e segue o fluxo');
  let f2=0; L.fluxoHistoria(()=>{ f2++; }); ok(!L.aberturaAtual() && f2===1,'na vez seguinte não toca de novo');
  const H2=jogo(15,{ guia:GUIA({ est:0, rec:1, ver:0 }) }); let f3=0; H2.L.fluxoHistoria(()=>{ f3++; }); ok(!H2.L.aberturaAtual() && f3===1,'sem estrela, nada pendente');
  // o save de 10.10 entra pela normSave (capV 5, no Fim, com estrela): vale como pendente
  const s=H.L.normSave({ histV:1, capV:5, cap:15, dia:70, maxDay:70, v10:1, salao:{ ponto:'terraco' }, guia:{ n:2, prox:0, v:[], est:2, rec:0, bol:null, convRec:1, ver:0 } });
  ok(s.cap===15 && s.guia.est===2 && s.guia.visto===0 && s.capV===6,'normSave de um save capV 5 no Fim: cap 15, estrelas mantidas, visto 0'); }

// ---------- 6. o botão História: "O final" (CA7) ----------
{ const semFinal=jogo(15,{ guia:GUIA({ est:0, visto:0, ver:0 }) }), {L,els}=semFinal; els['btn-historia'].fire('click');
  ok(L.aberturaAtual() && L.aberturaAtual().cena.id==='casa' && !els['ov-escolha'].classList.contains('show'),'sem `visto`, o botão abre direto a abertura');
  L.aberturaAtual().pular(); ok(!L.aberturaAtual(),'(a abertura termina)');
  const H=jogo(15,{ guia:GUIA({ est:2, visto:2, ver:0 }) }), h=H.els; H.L.buildMenu(); h['btn-historia'].fire('click');
  ok(!H.L.aberturaAtual() && h['ov-escolha'].classList.contains('show') && !!h['btn-esc-ab'] && !!h['btn-esc-final'],'com `visto` ≥ 1, o botão abre a escolha: "A abertura" ou "O final"');
  h['btn-esc-ab'].fire('click'); ok(H.L.aberturaAtual() && H.L.aberturaAtual().cena.id==='casa','"A abertura" toca a abertura');
  H.L.aberturaAtual().pular(); h['btn-historia'].fire('click'); h['btn-esc-final'].fire('click');
  ok(H.L.aberturaAtual() && ids(H.L.aberturaAtual()).join()===E2.concat('creditos').join(),'"O final" toca as cenas até o `visto` (2 estrelas), com os créditos');
  const antes=JSON.stringify(H.g.save); toca(H.L); ok(JSON.stringify(H.g.save)===antes,'rever não muda o save'); }

// ---------- 7. o modo dev (CA8) ----------
{ const H=jogo(15,{}), {g,L,els}=H; g.setDev(true); g.setState('menu'); g.devReal(true);
  const antes=JSON.stringify(g.save);
  ok(typeof L.devFinal==='function' && L.devFinal(3),'devFinal(3) abre o final');
  ok(ids(L.aberturaAtual()).join()===E3.concat('creditos').join(),'"Assistir o final" ★★★ toca as oito cenas e os créditos');
  toca(L); ok(JSON.stringify(g.save)===antes && g.state==='menu','sem mudar o save, e volta ao menu');
  ok(ids((L.devFinal(1),L.aberturaAtual())).join()===E1.concat('creditos').join() && !(L.aberturaAtual().pular(),L.aberturaAtual()),'★ toca o final de uma estrela; Pular fecha');
  const c=L.DEV_CAPS.find(x=>x.n===15); ok(c && c.guiaEst===1 && c.guiaVisto===1,'DEV_CAPS n:15 (o Fim) tem guia.est 1 e guia.visto 1');
  g.devCapitulo(15); ok(g.save.cap===15 && g.save.guia.est===1 && g.save.guia.visto===1,'devCapitulo(15): cap 15, 1 estrela, já vista');
  L.DEV.aba='historia'; L.buildDev(); const dv=txt(H.doc.getElementById('dev-body')); ok(/Assistir o final/.test(dv),'o painel dev tem a linha "Assistir o final"'); }

// ---------- 8. movimento reduzido (CA9) ----------
{ const L=load({ historia:true, rm:true }).L, ctxs=[];
  const f=new L.Abertura('menu',true,L.FINAL,{ est:3, creditos:true });
  ok(f.n===9 && ids(f).join()===E3.concat('creditos').join(),'(RM) as mesmas cenas');
  let parado=true; for(let i=0;i<f.n;i++){ f.i=i; f.t=0; const p0=f.p; f.update(30); parado=parado && f.i===i && f.p===p0 && f.escuro===0; }
  ok(parado,'(RM) cada cena é um quadro parado: o tempo não avança nada nem escurece');
  f.i=0; f.seguir(); f.seguir(); ok(f.i===2,'(RM) só o toque avança');
  const H=nova({ rm:true }), ctx=H.ctx; let erro=null; try{ for(let i=0;i<f.n;i++){ f.i=i; L.drawAbertura(ctx,f); } }catch(e){ erro=e; } ok(!erro,'(RM) desenha todos os quadros sem erro'+(erro?': '+erro.message:''));
  [0,3,8].forEach(i=>{ const a=new L.Abertura('menu',true,L.FINAL,{ est:3, creditos:true }); a.i=i; let fim=0; a.onFim=()=>{ fim++; }; a.pular(); ok(a.fim && fim===1,'"Pular" termina na cena '+i); });
  // sem RM, todas as cenas desenham em 0, 0,5 e 1 sem erro e devolvem a cabeça de quem fala
  const H2=nova(), c2=H2.ctx; let erro2=null; const mkAb=()=>new H2.L.Abertura('menu',false,H2.L.FINAL,{ est:3, creditos:true });
  try{ for(let i=0;i<9;i++){ [0.01,0.5,1].forEach(k=>{ const a=mkAb(); a.i=i; a.t=a.cena.t*k; a.tm=a.t+1; H2.L.drawAbertura(c2,a); }); } }catch(e){ erro2=e; } ok(!erro2,'desenha todos os quadros no começo, no meio e no fim sem erro'+(erro2?': '+erro2.message:''));
  const placa=mkAb(); ok(!!H2.L.AB_CENAS.placa(c2,0.5,3),'(a cena devolve onde fica a cabeça de quem fala)'); }

// ---------- 9. a v10 guardada (CA10) ----------
{ const v10=fs.readFileSync(__dirname+'/../versoes/v10.html','utf8'), v1=fs.readFileSync(__dirname+'/../versoes/v1.html','utf8');
  let base=''; try{ base=cp.execSync('git show e85d8ac:lanchonete.html',{ cwd:__dirname+'/..', maxBuffer:64*1024*1024 }).toString(); }catch(e){}
  ok(v10.split('\n')[0]===v1.split('\n')[0] && base.length>1000 && v10.split('\n').slice(1).join('\n')===base,'versoes/v10.html: a 1ª linha é a do v1 e o resto é o lanchonete.html do commit da v10.10');
  const html=fs.readFileSync(__dirname+'/../lanchonete.html','utf8'); ok(/href="versoes\/v10\.html"[^>]*>Abrir a v10</.test(html),'o painel Versões tem o link "Abrir a v10"'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails); process.exit(fails?1:0);
