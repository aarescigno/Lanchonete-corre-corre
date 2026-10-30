// v8.5, abertura do Modo História (o sonho da Bia): toca sozinha só na 1ª vez; pelo botão História termina no cartão
// "Em breve"; o toque segue, Pular termina; não mexe no save; com movimento reduzido, quadros parados que só o toque avança.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const mostra=(els,id)=>els[id].classList.contains('show');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});

// 1ª vez: toca sozinha e marca como vista; no fim (sozinha), vai ao menu
{ const H=load({abertura:true}), {g,L,els,store}=H, ab=L.aberturaAtual();
  ok(ab && ab.origem==='auto' && mostra(els,'ov-abertura') && !mostra(els,'ov-menu'),'1ª vez: a abertura toca sozinha, por cima do menu');
  ok(store.lcc2_abertura==='1','fica marcada como vista');
  ok(L.ABERTURA.cenas.length===10 && L.ABERTURA.cenas.map(c=>c.id).join()==='casa,aurora,tempero,estrela,hospital,saudade,promessa,tonhao,banco,inauguracao','10 cenas, na ordem do roteiro (v8.5.1: a saudade depois do hospital)');
  const tot=L.ABERTURA.cenas.reduce((a,c)=>a+c.t,0); ok(tot>=55 && tot<=80,'duração total ~1 min ('+tot+' s)');
  ok(L.ABERTURA.cenas.every(c=>c.t>=5 && c.t<=10 && c.leg && c.falas.every(f=>f.de<c.t-1)),'cada cena tem de 5 a 10 s, legenda e falas a tempo');
  ok(L.ABERTURA.cenas.every(c=>L.AB_CENAS[c.id]),'cada cena tem desenho');
  ok(els['ab-live'].textContent.includes('Rosa'),'o texto da cena vai para o leitor de tela');
  const sv=JSON.stringify(g.save), st=g.state;
  // o tempo passa: as cenas seguem sozinhas, com as falas aparecendo no tempo delas
  ok(ab.falas().length===0 && ab.escuro>0.9,'começa no escuro, sem falas');
  ab.update(2); ok(ab.i===0 && ab.falas().length===1 && ab.escuro===0,'a fala aparece no tempo dela');
  { const sv2=[ab.i,ab.t]; ab.i=4; ab.t=4; const a1=ab.falas().length; ab.t=6; const a2=ab.falas().length; ab.i=sv2[0]; ab.t=sv2[1];
    ok(a1===2 && a2===0,'hospital: as falas somem antes de a cortina fechar'); }
  for(let i=0;i<200;i++) ab.update(0.05);
  ok(ab.i===1,'a cena 1 termina e vem a 2 sozinha');
  ok(els['ab-live'].textContent.includes('Casa Aurora'),'o leitor de tela acompanha a cena');
  // o desenho de cada cena, no começo, no meio e no fim (sem erro)
  let erro=null; try{ for(let i=0;i<ab.n;i++){ ab.i=i; [0,0.3,0.5,0.7,0.99].forEach(p=>{ ab.t=ab.cena.t*p; L.drawAbertura(H.ctx,ab); }); } } catch(e){ erro=e; }
  ok(!erro,'desenha todas as cenas'+(erro?': '+erro.message:''));
  ab.i=1; ab.t=0;
  toque(els); ok(ab.i===2 && ab.t===0,'um toque passa para a próxima cena');
  for(let i=0;i<20;i++) toque(els);
  ok(!L.aberturaAtual() && mostra(els,'ov-menu') && !mostra(els,'ov-abertura'),'depois da última cena, sozinha, volta ao menu');
  ok(JSON.stringify(g.save)===sv && g.state===st,'não mexe no save nem no estado do jogo');
}
// já vista: não toca sozinha; pelo botão "Ver abertura" (v8.7), termina e volta ao menu
{ const H=load({abertura:true, store:{lcc2_abertura:'1'}}), {g,L,els}=H;
  ok(!L.aberturaAtual() && mostra(els,'ov-menu'),'já vista: abre direto no menu');
  ok(/id="btn-historia">Ver abertura</.test(require('fs').readFileSync(__dirname+'/../lanchonete.html','utf8')),'o botão do menu diz "Ver abertura"');
  els['btn-historia'].fire('click');
  const ab=L.aberturaAtual(); ok(ab && ab.origem==='menu' && ab.i===0 && mostra(els,'ov-abertura'),'o botão toca a abertura do começo');
  toque(els); toque(els); ok(ab.i===2,'o toque segue');
  els['btn-ab-pular'].fire('click');
  ok(!L.aberturaAtual() && mostra(els,'ov-menu') && g.state==='menu','Pular volta ao menu (sem o cartão "Em breve")');
  // o toque no canvas, sem abertura, volta a ser do jogo
  ok(!L.aberturaAtual(),'sem abertura depois do menu');
}
// modo dev: não toca sozinha
{ const H=load({abertura:true, store:{lcc2_dev:'1'}}); ok(!H.L.aberturaAtual(),'modo dev: não toca sozinha'); }
// movimento reduzido: quadro parado (o fim da cena), sem escuro, com todas as falas; só o toque avança
{ const H=load({abertura:true, rm:true}), {L,els}=H, ab=L.aberturaAtual();
  ok(ab.rm && ab.p===1 && ab.escuro===0,'movimento reduzido: o quadro final, sem escurecer');
  ab.i=4; ok(ab.p<0.66,'hospital com movimento reduzido: o quadro de antes da cortina, com as falas');
  ab.i=4; ok(ab.falas().length===2,'todas as falas da cena à vista');
  for(let i=0;i<100;i++) ab.update(0.5);
  ok(ab.i===4,'o tempo não troca a cena');
  toque(els); ok(ab.i===5,'o toque troca');
  ab.voltar(); ok(ab.i===4 && ab.t===0,'voltar: a cena anterior, do começo');
  ab.i=0; ab.t=3; ab.voltar(); ok(ab.i===0 && ab.t===0,'voltar na primeira cena: recomeça');
  let erro=null; try{ for(let i=0;i<ab.n;i++){ ab.i=i; L.drawAbertura(H.ctx,ab); } } catch(e){ erro=e; } ok(!erro,'desenha os quadros parados');
}
// v8.6.1 (revisão estética): as alturas saem da tabela; a boca de quem fala mexe, mas não com movimento reduzido
{ const H=load({abertura:true}), {L}=H, ab=L.aberturaAtual();
  ok(['rosa','bia','biaCrianca','tonhao','braulio'].every(q=>Math.abs(L.abEsc(q)*L.AB_BASE[q]-L.AB_ALT[q])<1e-9),'a escala de cada um vem da altura na tabela');
  ok(L.AB_ALT.rosa===L.AB_ALT.bia && L.AB_ALT.biaCrianca<L.AB_ALT.rosa*0.7 && L.AB_ALT.tonhao>L.AB_ALT.rosa,'a Bia adulta da altura da mãe, a criança bem menor, o Tonhão mais alto');
  ab.i=0; ab.t=ab.cena.falas[0].de+0.15; ab.tm=ab.t; L.drawAbertura(H.ctx,ab); ok(L.AB_VIVO.fala.rosa>0,'a Rosa mexe a boca quando o balão aparece');
  ab.t=ab.cena.falas[0].de+3; ab.tm=ab.t; L.drawAbertura(H.ctx,ab); ok(!L.AB_VIVO.fala.rosa,'e para depois de um tempo, com o balão ainda à vista');
  const R=load({abertura:true, rm:true}), ar=R.L.aberturaAtual(); R.L.drawAbertura(R.ctx,ar); ok(Object.keys(R.L.AB_VIVO.fala).length===0,'movimento reduzido: a boca não mexe');
}
console.log('total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
