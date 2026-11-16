// A abertura do Modo História (o sonho da Bia). Desde a v11.15 é a abertura nova (11 cenas, quadro cheio): toca sozinha só na 1ª vez e marca como vista;
// pelo botão "Ver abertura", volta ao menu; o toque segue, Voltar volta, Pular termina; não mexe no save; com movimento reduzido, quadros parados que só o
// toque avança; o som da cena é cortado ao trocar; depois de "Recomeçar do zero" (v11.11), é ela que toca e segue para a Missão zero.
// (v8.5 a v11.14: este smoke conferia a abertura antiga, de 10 cenas.)
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const mostra=(els,id)=>els[id].classList.contains('show');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});

// 1ª vez: toca sozinha e marca como vista; no fim (sozinha), vai ao menu
{ const H=load({abertura:true}), {g,L,els,store}=H, ab=L.aberturaAtual();
  ok(ab && ab.origem==='auto' && mostra(els,'ov-abertura') && !mostra(els,'ov-menu'),'1ª vez: a abertura toca sozinha, por cima do menu');
  ok(store.lcc2_abertura==='1','fica marcada como vista');
  ok(ab.roteiro===L.ABERTURA && L.ABERTURA.cheio && L.ABERTURA.cenas.length===11 && L.ABERTURA.cenas.map(c=>c.id).join()==='porta,carinho,aurora,molho,estrela,despedida,janela,promessa,tio,banco,portao','é a abertura nova: 11 cenas, na ordem do roteiro');
  const tot=L.ABERTURA.cenas.reduce((a,c)=>a+c.t,0); ok(tot===77,'duração total de 77 s');
  ok(L.ABERTURA.cenas.every(c=>c.t>=5 && c.t<=10 && c.falas.every(f=>f.de<c.t-1)),'cada cena tem de 5 a 10 s e as falas a tempo');
  ok(L.ABERTURA.cenas.every(c=>typeof L.AB2_CENAS[c.id]==='function'),'cada cena tem desenho');
  ok(els['ab-live'].textContent.includes('Rosa'),'o texto da cena vai para o leitor de tela');
  const sv=JSON.stringify(g.save), st=g.state;
  // o tempo passa: as cenas seguem sozinhas, com as falas aparecendo no tempo delas
  ok(ab.falas().length===0 && ab.escuro>0.9,'começa no escuro, sem falas');
  ab.update(3.5); ok(ab.i===0 && ab.falas().length===1 && ab.escuro===0,'a fala aparece no tempo dela');
  for(let i=0;i<100;i++) ab.update(0.05);
  ok(ab.i===1,'a cena 1 termina e vem a 2 sozinha');
  ok(els['ab-live'].textContent.includes('carinho'),'o leitor de tela acompanha a cena');
  // o desenho de cada cena, no começo, no meio e no fim (sem erro)
  let erro=null; try{ for(let i=0;i<ab.n;i++){ ab.i=i; [0,0.3,0.5,0.7,0.99].forEach(p=>{ ab.t=ab.cena.t*p; ab.tm=i*7+ab.t; L.drawAbertura(H.ctx,ab); }); } } catch(e){ erro=e; }
  ok(!erro,'desenha todas as cenas'+(erro?': '+erro.message:''));
  ab.i=1; ab.t=0;
  toque(els); ok(ab.i===2 && ab.t===0,'um toque passa para a próxima cena');
  els['btn-ab-voltar'].fire('click'); ok(ab.i===1 && ab.t===0,'Voltar volta uma cena');
  for(let i=0;i<20;i++) toque(els);
  ok(!L.aberturaAtual() && mostra(els,'ov-menu') && !mostra(els,'ov-abertura'),'depois da última cena, sozinha, volta ao menu');
  ok(JSON.stringify(g.save)===sv && g.state===st,'não mexe no save nem no estado do jogo');
}
// já vista: não toca sozinha; pelo botão "Ver abertura" (v8.7), termina e volta ao menu
{ const H=load({abertura:true, store:{lcc2_abertura:'1'}}), {g,L,els}=H;
  ok(!L.aberturaAtual() && mostra(els,'ov-menu'),'já vista: abre direto no menu');
  ok(/id="btn-historia">Ver abertura</.test(require('fs').readFileSync(__dirname+'/../lanchonete.html','utf8')),'o botão do menu diz "Ver abertura"');
  els['btn-historia'].fire('click');
  const ab=L.aberturaAtual(); ok(ab && ab.origem==='menu' && ab.i===0 && ab.roteiro===L.ABERTURA && mostra(els,'ov-abertura'),'o botão toca a abertura do começo');
  toque(els); toque(els); ok(ab.i===2,'o toque segue');
  els['btn-ab-pular'].fire('click');
  ok(!L.aberturaAtual() && mostra(els,'ov-menu') && g.state==='menu','Pular volta ao menu');
  ok(!L.aberturaAtual(),'sem abertura depois do menu');
}
// modo dev: não toca sozinha
{ const H=load({abertura:true, store:{lcc2_dev:'1'}}); ok(!H.L.aberturaAtual(),'modo dev: não toca sozinha'); }
// movimento reduzido: quadro parado (p 0,8, ou o pRM), a câmera no fim, sem escuro nem transição, com todas as falas; só o toque avança
{ const H=load({abertura:true, rm:true}), {L,els}=H, ab=L.aberturaAtual();
  ok(ab.rm && ab.p===0.8 && ab.escuro===0 && ab.trans===null && ab.legA===1,'movimento reduzido: o quadro de p 0,8, sem escurecer, sem transição, a legenda inteira');
  ab.i=1; ok(ab.p===0.6,'a cena 2 com movimento reduzido: o quadro do pRM (antes do clique da foto)');
  ab.i=5; ok(ab.falas().length===2,'todas as falas da cena à vista');
  const cp=L.ab2Cabe(ab.cena.cam.para); ok(Math.abs(ab.cam.cx-cp[0])<1e-9 && Math.abs(ab.cam.z-cp[2])<1e-9,'a câmera fica no fim do movimento');
  for(let i=0;i<100;i++) ab.update(0.5);
  ok(ab.i===5,'o tempo não troca a cena');
  toque(els); ok(ab.i===6,'o toque troca');
  ab.voltar(); ok(ab.i===5 && ab.t===0,'voltar: a cena anterior, do começo');
  ab.i=0; ab.t=3; ab.voltar(); ok(ab.i===0 && ab.t===0,'voltar na primeira cena: recomeça');
  let erro=null; try{ for(let i=0;i<ab.n;i++){ ab.i=i; L.drawAbertura(H.ctx,ab); } } catch(e){ erro=e; } ok(!erro,'desenha os quadros parados'+(erro?': '+erro.message:''));
}
// as alturas saem da tabela; a boca de quem fala mexe, mas não com movimento reduzido
{ const H=load({abertura:true}), {L}=H, ab=L.aberturaAtual();
  ok(['rosa','bia','biaCrianca','tonhao','braulio'].every(q=>Math.abs(L.abEsc(q)*L.AB_BASE[q]-L.AB_ALT[q])<1e-9),'a escala de cada um vem da altura na tabela');
  ok(L.AB_ALT.rosa===L.AB_ALT.bia && L.AB_ALT.biaCrianca<L.AB_ALT.rosa*0.7 && L.AB_ALT.tonhao>L.AB_ALT.rosa,'a Bia adulta da altura da mãe, a criança bem menor, o Tonhão mais alto');
  ab.i=0; ab.t=ab.cena.falas[0].de+0.15; ab.tm=ab.t; L.drawAbertura(H.ctx,ab); ok(L.AB_VIVO.fala.rosa>0,'a Rosa mexe a boca quando o balão aparece');
  ab.t=ab.cena.falas[0].de+3; ab.tm=ab.t; L.drawAbertura(H.ctx,ab); ok(!L.AB_VIVO.fala.rosa,'e para depois de um tempo, com o balão ainda à vista');
  const R=load({abertura:true, rm:true}), ar=R.L.aberturaAtual(); R.L.drawAbertura(R.ctx,ar); ok(Object.keys(R.L.AB_VIVO.fala).length===0,'movimento reduzido: a boca não mexe');
}
// o som: cada cena toca numa faixa própria, cortada ao trocar de cena e ao fechar
{ const H=load({abertura:true, store:{lcc2_abertura:'1'}}), {L,els}=H, S=L.Sfx; let cortes=0, tons=0; const F={f:1};
  S.corta=()=>{ cortes++; }; S.faixa=()=>F; S.tone=function(){ if(arguments[6]===F) tons++; }; S.noise=()=>{};
  els['btn-historia'].fire('click'); const ab=L.aberturaAtual();
  ok(cortes===1 && tons>=6,'abrir agenda o tema da cena 1 na faixa ('+tons+' notas)');
  toque(els); ok(cortes===2 && ab.i===1,'o toque troca de cena e corta o som da anterior');
  els['btn-ab-voltar'].fire('click'); ok(cortes===3,'Voltar também corta');
  ab.update(7.1); ok(cortes===4 && ab.i===1,'o fim da cena também');
  els['btn-ab-pular'].fire('click'); ok(cortes===5 && !L.aberturaAtual(),'Pular fecha a abertura e corta a faixa');
}
// "Recomeçar do zero" (v11.11): a abertura (a nova) toca de novo e, no fim, segue para a Missão zero
{ const H=load({abertura:true, store:{lcc2_abertura:'1'}, historia:true}), {g,L,els,store}=H;
  ok(!L.aberturaAtual(),'recomeçar: antes, sem abertura');
  els['btn-reset'].fire('click'); els['btn-reset'].fire('click');
  const ab=L.aberturaAtual(); ok(ab && ab.origem==='auto' && ab.roteiro===L.ABERTURA && ab.n===11,'recomeçar do zero abre a abertura nova, como na 1ª vez');
  ok(store.lcc2_abertura==='1' && !g.save.treino,'e a marca como vista; a Missão zero está por fazer');
  if(ab){ for(let i=0;i<12;i++) toque(els); }
  ok(!L.aberturaAtual() && g.treino,'no fim da abertura, começa a Missão zero');
}
console.log('total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
