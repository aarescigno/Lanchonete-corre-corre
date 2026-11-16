// v11.12 (etapa 9a): a abertura nova. O roteiro ABERTURA2 (11 cenas), a câmera que encosta na borda, as transições, a legenda,
// o som (o tema da Rosa por clima e os efeitos) e o desenho das cenas 1 e 2; as outras nove tocam como cartão de obra.
// O jogador ainda vê a abertura antiga; a nova toca pelo modo dev ("Abertura nova (em obras)").
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const mostra=(els,id)=>els[id].classList.contains('show');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const perto=(a,b,e)=>Math.abs(a-b)<=(e||1e-6);
const TH=600;

// o roteiro de docs/ABERTURA.md §4 a §9: id, t, legenda, legDe, falas [q, s, de], sai, cam de, cam para, clima, fx
const ROT=[
 ['porta',7,'A Bia cresceu na porta da cozinha.',0.6,[['rosa','Vem provar, filha.',3.2]],'corte',[330,330,1.7],[610,300,1],'casa',[['panela',0.4]]],
 ['carinho',7,'',0.6,[['rosa','Comida boa é carinho que a gente põe no prato.',2.6]],'escuro',[660,330,1.9],[680,310,2.1],'casa',[['panela',0.3],['clique',6.0]]],
 ['aurora',7,'A Rosa sonhava ser chef.',0.6,[['bia','Vai, mãe!',1.0],['tonhao','Bem-vinda, maninha!',3.0]],'passa',[560,310,1],[690,330,1.25],'sonho',[['sino',3.1]]],
 ['molho',7,'Com o irmão, ela criou um molho. E guardou um segredo.',0.6,[['tonhao','Que molho é esse, Rosa?!',4.2]],'iris',[610,320,1.15],[640,340,1.8],'sonho',[['panela',0.5],['brilho',3.6]]],
 ['estrela',7,'A estrela veio. A fama ficou com o chef Bráulio.',3.4,[['braulio','Receita minha!',1.6]],'escuro',[470,300,1.5],[900,320,1.7],'gala',[['aplauso',0.2]]],
 ['despedida',7,'Pouco depois, a Rosa adoeceu.',0.6,[['rosa','Cozinha sempre com carinho, filha.',1.6],['bia','Prometo, mãe.',4.2]],'escuro',[560,400,2],[575,330,2],'triste',[]],
 ['janela',7,'A Rosa partiu.',1.0,[],'segue',[610,300,1],[700,280,1.35],'triste',[['chuva',0.2],['estrela',3.9]]],
 ['promessa',8,'A Bia cresceu. E fez uma promessa.',0.8,[['bia','Essa estrela vai ser nossa, mãe.',4.6]],'passa',[700,280,1.35],[650,290,1.6],'esperanca',[['panela',3.4],['estrela',6.8]]],
 ['tio',6,'O tio Tonhão largou a Casa Aurora.',0.6,[['tonhao','Dinheiro eu não tenho, Bia. Mas braço pra cozinha tenho de sobra!',2.4]],'passa',[760,320,1.2],[420,320,1.2],'esperanca',[]],
 ['banco',6,'Sem um tostão, a Bia foi ao banco.',0.6,[['bia','Tem que dar certo...',0.8]],'iris',[600,310,1],[640,300,1.9],'esperanca',[['carimbo',3.3]]],
 ['portao',8,'E a garagem da Rosa virou a Lanchonete Corre-Corre.',4.6,[['tonhao','Abre, Bia.',2.2]],'escuro',[560,340,1.5],[610,300,1],'fim',[['portao',3.6],['estrela',6.4]]]
];
// o som de cada clima (§5): a onda e o volume da melodia, o tempo por nota e o que mais pode soar junto ([onda, volume])
const CLIMA={ casa:{o:'triangle',v:0.045,passo:0.42,mais:[['sine',0.03]]}, sonho:{o:'triangle',v:0.045,passo:0.34,mais:[['sine',0.03],['triangle',0.025]]},
  gala:{o:'square',v:0.04,passo:0.2,mais:[['sine',0.04]]}, triste:{o:'sine',v:0.04,passo:0.8,mais:[]}, esperanca:{o:'triangle',v:0.045,passo:0.46,mais:[['sine',0.03]]},
  fim:{o:'triangle',v:0.045,passo:0.42,mais:[['sine',0.03]]} };
const FX_ONDE={ panela:[[1,0.4],[2,0.3],[4,0.5],[8,3.4]], clique:[[2,6.0]], sino:[[3,3.1]], brilho:[[4,3.6]], aplauso:[[5,0.2]], chuva:[[7,0.2]], estrela:[[7,3.9],[8,6.8],[11,6.4]], carimbo:[[10,3.3]], portao:[[11,3.6]] };

// ---------- CA1: o roteiro ----------
{ const H=load(), {L}=H, R=L.ABERTURA2;
  ok(R && R.cheio===true && R.trans===0.5 && R.cenas && R.cenas.length===11,'CA1: ABERTURA2 é de quadro cheio, com 0,5 s de transição e 11 cenas');
  const cs=(R&&R.cenas)||[];
  ok(cs.map(c=>c.id).join()===ROT.map(r=>r[0]).join(),'CA1: os id, na ordem do roteiro ('+cs.map(c=>c.id).join()+')');
  ok(cs.length===11 && cs.every((c,i)=>c.t===ROT[i][1]) && cs.reduce((a,c)=>a+c.t,0)===77,'CA1: os tempos de cada cena e a soma de 77 s');
  ok(cs.length===11 && cs.every((c,i)=>c.leg===ROT[i][2]),'CA1: as legendas, letra por letra');
  ok(cs.every(c=>c.leg.length<=60) && cs[1] && cs[1].leg==='','CA1: legenda de até 60 letras; a cena 2 não tem');
  ok(cs.length===11 && cs.every((c,i)=>(c.legDe==null?0.6:c.legDe)===ROT[i][3]),'CA1: os legDe (0,6 de padrão; 3,4 na 5; 1,0 na 7; 0,8 na 8; 4,6 na 11)');
  ok(cs.length===11 && cs.every((c,i)=>JSON.stringify(c.falas.map(f=>[f.q,f.s,f.de]))===JSON.stringify(ROT[i][4])),'CA1: as falas (quem, texto e de), letra por letra');
  ok(cs.length===11 && cs.every((c,i)=>c.sai===ROT[i][5]),'CA1: os sai ('+cs.map(c=>c.sai).join()+')');
  ok(cs.length===11 && cs.every((c,i)=>c.cam && JSON.stringify(c.cam.de)===JSON.stringify(ROT[i][6]) && JSON.stringify(c.cam.para)===JSON.stringify(ROT[i][7])),'CA1: as câmeras (de e para) de §6 a §9');
  ok(cs.length===11 && JSON.stringify(cs[7].cam.meio)==='[610,300,1.1,0.5]' && cs.every((c,i)=>i===7 || !c.cam.meio),'CA1: só a cena 8 tem cam.meio');
  ok(cs.length===11 && cs.every((c,i)=>c.clima===ROT[i][8] && JSON.stringify(c.fx||[])===JSON.stringify(ROT[i][9])),'CA1: os climas e os fx');
  ok(cs.length===11 && cs.every((c,i)=>(c.titulo||'')===(i===10?'O sonho da Bia':'')) && cs[1].pRM===0.6 && cs[5].pRM===0.7 && cs.every((c,i)=>i===1||i===5||c.pRM==null),'CA1: titulo só na 11; pRM 0,6 na 2 e 0,7 na 6');
  const ab=new (L.Abertura)('menu',false,R);
  ok(ab.texto && ab.texto()==='A Bia cresceu na porta da cozinha. Rosa: Vem provar, filha.','CA1: o texto do leitor de tela segue a regra de hoje');
}

// ---------- CA2: a abertura antiga segue como está ----------
{ const H=load({abertura:true}), {L,els,store}=H, ab=L.aberturaAtual();
  ok(ab && ab.roteiro===L.ABERTURA && ab.origem==='auto' && ab.n===10 && mostra(els,'ov-abertura') && store.lcc2_abertura==='1','CA2: na 1ª vez toca sozinha a abertura antiga, de 10 cenas');
  ok(ab && ab.cam && ab.cam.z===1 && perto(ab.cam.cx,L.TW/2) && ab.trans===null && ab.legA===1,'CA2: no roteiro antigo, câmera parada, sem transição nova, legenda inteira');
  ok(ab && ab.escuro>0.9,'CA2: começa no escuro'); if(ab){ ab.update(2); ok(ab.escuro===0,'CA2: o escuro some em 0,5 s'); ab.t=ab.cena.t-0.25; ok(perto(ab.escuro,0.5,0.01),'CA2: e volta na saída de toda cena'); }
  const ch=[]; H.ctx.fillRect=(x,y,w,h)=>ch.push([x,y,w,h]); if(ab){ ab.t=3; L.drawAbertura(H.ctx,ab); }
  ok(ch.some(r=>r[0]===0 && r[1]===500 && r[2]===L.TW && r[3]===100),'CA2: com a faixa de legenda (0, 500, TW, 100)');
  for(let i=0;i<20;i++) toque(els);
  ok(!L.aberturaAtual() && mostra(els,'ov-menu'),'CA2: no fim, o menu');
  els['btn-historia'].fire('click'); const b=L.aberturaAtual();
  ok(b && b.roteiro===L.ABERTURA && b.origem==='menu' && b.n===10,'CA2: o botão do menu toca a antiga');
}

// ---------- CA3: o modo dev ----------
{ const H=load(), {g,L,els,store}=H; L.DEV.on=true;
  const cs=L.devCenas();
  ok(cs[0].rot==='Abertura' && cs[1].rot==='Abertura nova (em obras)','CA3: "Abertura nova (em obras)" vem logo depois de "Abertura"');
  delete store.lcc2_abertura; g.setState('shop'); const st=g.state;
  ok(L.devAssistir(1)===true,'CA3: assistir abre'); const ab=L.aberturaAtual();
  ok(ab && ab.roteiro===L.ABERTURA2 && ab.n===11 && ab.i===0 && mostra(els,'ov-abertura'),'CA3: abre o roteiro novo, da cena 1');
  ok(store.lcc2_abertura===undefined,'CA3: não grava LS.abertura');
  const sv=JSON.stringify(g.save);
  for(let i=0;i<10;i++) toque(els); ok(L.aberturaAtual() && L.aberturaAtual().i===10,'CA3: 10 toques levam à cena 11');
  toque(els); ok(!L.aberturaAtual() && g.state===st && !mostra(els,'ov-abertura'),'CA3: no fim, volta para onde estava ('+g.state+')');
  ok(JSON.stringify(g.save)===sv && store.lcc2_abertura===undefined,'CA3: não mexe no save');
  g.setState('menu'); L.devAssistir(1); els['btn-ab-pular'].fire('click'); ok(!L.aberturaAtual() && g.state==='menu','CA3: Pular também volta');
  L.devAssistir(0); ok(L.aberturaAtual() && L.aberturaAtual().roteiro===L.ABERTURA,'CA3: "Abertura" segue abrindo a antiga');
}

// ---------- CA4: a câmera ----------
{ const H=load(), {L}=H, R=L.ABERTURA2, TW=L.TW;
  const cabe=k=>k.z>=1 && k.cx-TW/2/k.z>=-1e-6 && k.cx+TW/2/k.z<=TW+1e-6 && k.cy-TH/2/k.z>=-1e-6 && k.cy+TH/2/k.z<=TH+1e-6;
  let ruim=[]; R.cenas.forEach((c,i)=>[0,0.25,0.5,0.75,1].forEach(p=>{ const k=L.ab2Cam(c,p); if(!cabe(k)) ruim.push((i+1)+'@'+p); }));
  ok(ruim.length===0,'CA4: nas 11 cenas, z é 1 ou mais e o retângulo visto cabe no quadro '+ruim.join(' '));
  const igual=(k,v)=>perto(k.cx,v[0])&&perto(k.cy,v[1])&&perto(k.z,v[2]);
  ok(R.cenas.every(c=>igual(L.ab2Cam(c,0),L.ab2Cabe(c.cam.de)) && igual(L.ab2Cam(c,1),L.ab2Cabe(c.cam.para))),'CA4: em p 0 e 1 bate com de e para, encostados na borda');
  const fora=R.cenas.map((c,i)=>['de','para'].filter(q=>JSON.stringify(L.ab2Cabe(c.cam[q]))!==JSON.stringify(c.cam[q])).map(q=>(i+1)+q)).reduce((a,b)=>a.concat(b),[]);
  ok(fora.join()==='1de,3de,5para,9de,9para,10de','CA4: só passam da borda 1 de, 3 de, 5 para, 9 de e para, 10 de ('+fora.join()+')');
  ok(JSON.stringify(L.ab2Cabe([330,330,1.7]).map(v=>Math.round(v*10)/10))==='[358.8,330,1.7]' && JSON.stringify(L.ab2Cabe([560,310,1]))==='[610,300,1]','CA4: encostar mantém o z e leva o centro até a borda');
  const m=L.ab2Cam(R.cenas[7],0.5); ok(igual(m,[610,300,1.1]),'CA4: a cena 8 passa pelo meio em p 0,5');
  const t=L.ab2Tela({cx:610,cy:300,z:2},610,300), u=L.ab2Tela({cx:610,cy:300,z:2},710,250);
  ok(t[0]===610 && t[1]===300 && u[0]===810 && u[1]===200,'CA4: ab2Tela leva o ponto da cena para a tela');
  const ab=new L.Abertura('menu',false,R); ab.t=0; ok(igual(ab.cam,L.ab2Cabe(R.cenas[0].cam.de)),'CA4: Abertura.cam em t 0 é o de');
  ab.t=3.5; const k=ab.cam; ok(k.z<1.7 && k.z>1 && k.cx>358.8 && k.cx<610,'CA4: e desliza com o tempo');
  const rm=new L.Abertura('menu',true,R); rm.t=0; ok(R.cenas.every((c,i)=>{ rm.i=i; return igual(rm.cam,L.ab2Cabe(c.cam.para)); }),'CA4: com movimento reduzido, é o para');
  rm.i=0; ok(rm.p===0.8,'CA4: com movimento reduzido, o quadro parado é o de p 0,8'); rm.i=1; ok(rm.p===0.6,'CA4: ou o do pRM (0,6 na cena 2)');
}

// ---------- CA5: transições, escuro e legenda ----------
{ const H=load(), {L}=H, R=L.ABERTURA2, ab=new L.Abertura('menu',false,R);
  let fora=true, dentro=true, cresce=true;
  R.cenas.forEach((c,i)=>{ ab.i=i; [0,1,c.t-0.6,c.t-0.5].forEach(t=>{ ab.t=t; if(ab.trans!==null) fora=false; });
    ab.t=c.t-0.4; const a=ab.trans; ab.t=c.t-0.1; const b=ab.trans;
    if(!(a && b && a.tipo===c.sai && b.tipo===c.sai)) dentro=false; else if(!(perto(a.k,0.2,1e-6) && perto(b.k,0.8,1e-6))) cresce=false; });
  ok(fora,'CA5: trans é null fora dos últimos 0,5 s');
  ok(dentro,'CA5: nos últimos 0,5 s, trans tem o tipo (sai) da cena');
  ok(cresce,'CA5: e k cresce de 0 a 1 (0,2 a 0,4 s do fim; 0,8 a 0,1 s)');
  const rm=new L.Abertura('menu',true,R); ok(R.cenas.every((c,i)=>{ rm.i=i; rm.t=c.t-0.1; return rm.trans===null && rm.escuro===0 && rm.legA===1; }),'CA5: com movimento reduzido, sem transição, sem escuro e a legenda inteira');
  // a última cena: só há transição se o sai for escuro
  const R2={ cheio:true, trans:0.5, cenas:[{ id:'a', t:4, leg:'x', falas:[], sai:'passa', cam:{de:[610,300,1],para:[610,300,1]} }] }, u=new L.Abertura('menu',false,R2); u.t=3.8;
  ok(u.trans===null,'CA5: na última cena com sai diferente de escuro, trans é null');
  // a legenda entra em legDe, com 0,4 s de transparência
  ab.i=0; ab.t=0.5; const l0=ab.legA; ab.t=0.8; const l1=ab.legA; ab.t=1.0; const l2=ab.legA; ab.t=3; const l3=ab.legA;
  ok(l0===0 && perto(l1,0.5) && perto(l2,1) && l3===1,'CA5: legA vai de 0 a 1 de 0,6 a 1,0 s ('+[l0,l1,l2,l3].join(' ')+')');
  ab.i=4; ab.t=3.3; const m0=ab.legA; ab.t=3.6; const m1=ab.legA; ok(m0===0 && perto(m1,0.5),'CA5: na cena 5, a partir de 3,4 s');
  // o escuro do quadro cheio: a entrada da 1ª, e a saída das cenas com sai escuro e a entrada da seguinte
  const esc=(i,t)=>{ ab.i=i; ab.t=t; return ab.escuro; };
  ok(esc(0,0)===1 && perto(esc(0,0.25),0.5) && esc(0,6.9)===0,'CA5: a 1ª cena entra do escuro e sai em corte (sem escuro)');
  ok(esc(1,0)===0 && perto(esc(1,6.75),0.5) && perto(esc(2,0.25),0.5),'CA5: a 2 entra sem escuro, sai no escuro e a 3 entra dele');
  ok(esc(3,0.1)===0 && esc(3,6.9)===0 && esc(7,0.1)===0 && perto(esc(10,7.75),0.5),'CA5: passa, iris e segue não escurecem; a 11 sai no escuro');
}

// ---------- CA6: o som ----------
{ const H=load(), {L,els}=H, R=L.ABERTURA2;
  const N=R.cenas.map(c=>L.ab2Notas(c));
  ok(N.every(v=>Array.isArray(v) && v.length>=6 && v.every(n=>n.length===5)),'CA6: ab2Notas devolve 6 notas ou mais por cena, [freq, atraso, duração, onda, volume] ('+N.map(v=>v.length).join()+')');
  ok(N.every((v,i)=>v.every(n=>n[1]>=0 && n[1]<R.cenas[i].t && n[2]>0 && n[0]>0)),'CA6: todas começam antes do fim da cena');
  ok(N.every((v,i)=>{ const K=CLIMA[R.cenas[i].clima]; return v[0][3]===K.o && perto(v[0][4],K.v) && v.every(n=>(n[3]===K.o && perto(n[4],K.v)) || K.mais.some(m=>m[0]===n[3] && perto(n[4],m[1]))); }),'CA6: com a onda e o volume do clima');
  const mel=i=>{ const K=CLIMA[R.cenas[i].clima]; return N[i].filter(n=>n[3]===K.o && perto(n[4],K.v)); };
  ok(perto(N[0][0][0],392) && N[0][0][1]===0 && JSON.stringify(mel(0).slice(0,9).map(n=>Math.round(n[0])))==='[392,523,494,523,659,587,523,440,392]','CA6: casa começa em 392 Hz e toca o tema, que fecha em Sol4');
  ok(perto(mel(0)[1][1],0.42) && perto(mel(2)[1][1],0.34) && perto(mel(5)[1][1],0.8) && perto(mel(7)[1][1],0.46) && perto(mel(4)[1][1],0.2),'CA6: 0,42 s por nota em casa, 0,34 em sonho, 0,8 em triste, 0,46 em esperanca e 0,2 na fanfarra');
  ok(perto(N[5][0][0],392*5/6) && perto(N[6][0][0],392*5/6) && N[5].every(n=>n[3]==='sine'),'CA6: triste começa em 392 x 5/6, só em sine, sem baixo');
  ok(N[0].some(n=>n[3]==='sine' && n[0]===131 && n[1]===0) && N[0].some(n=>n[3]==='sine' && n[0]===196 && perto(n[1],0.42*4)),'CA6: o baixo de casa (Dó3 e Sol3) a cada 4 notas');
  ok(N[2].some(n=>perto(n[0],523*1.25) && perto(n[4],0.025) && perto(n[1],0.34)) && !N[2].some(n=>perto(n[4],0.025) && n[1]===0),'CA6: sonho tem a terça acima nas notas pares');
  ok(mel(4).length===4 && N[4].filter(n=>n[3]==='sine').every(n=>n[1]>=3.2) && perto(N[4].filter(n=>n[3]==='sine')[0][0],392*5/6) && perto(N[4].filter(n=>n[3]==='sine')[0][1],3.2),'CA6: gala são 4 notas de fanfarra e, a partir de 3,2 s, o tema triste');
  { const v=N[10], ac=v.filter(n=>perto(n[2],1.4)), alto=v.filter(n=>n[1]>=5.4-1e-9 && !perto(n[2],1.4));
    ok(JSON.stringify(ac.map(n=>n[0]))==='[523,659,784,1046]' && ac.every(n=>n[1]===ac[0][1] && n[1]+1.4<=8+1e-9),'CA6: fim fecha com o acorde Dó-Mi-Sol-Dó de 1,4 s, dentro da cena');
    ok(alto.length>=3 && perto(alto[0][0],784) && perto(alto[0][1],5.4) && perto(alto[1][1]-alto[0][1],0.3) && v.filter(n=>n[1]<5.4-1e-9).every(n=>n[0]<700),'CA6: de 5,4 s em diante, o tema uma oitava acima, 0,3 s por nota'); }
  ok(R.cenas.every(c=>(c.fx||[]).every(f=>typeof L.AB_FX[f[0]]==='function')) && Object.keys(L.AB_FX).sort().join()===Object.keys(FX_ONDE).sort().join(),'CA6: todo nome de fx existe na AB_FX (9 efeitos)');
  ok(Object.keys(FX_ONDE).every(n=>{ const tem=[]; R.cenas.forEach((c,i)=>(c.fx||[]).forEach(f=>{ if(f[0]===n) tem.push([i+1,f[1]]); })); return JSON.stringify(tem)===JSON.stringify(FX_ONDE[n]); }),'CA6: os tempos dos fx batem com §5');
  // os efeitos tocam pela faixa, com Sfx.tone e Sfx.noise
  { const S=L.Sfx, t0=S.tone, n0=S.noise; let usa=[]; S.tone=function(){ usa.push(['t',arguments[4]||0,arguments[6]]); }; S.noise=function(){ usa.push(['n',arguments[2]||0,arguments[4]]); };
    const F={f:1}; let certo=true; Object.keys(L.AB_FX).forEach(n=>{ usa=[]; L.AB_FX[n](1.5,F); if(!usa.length || !usa.every(u=>u[1]>=1.5 && u[2]===F)) certo=false; });
    ok(certo,'CA6: cada efeito toca com Sfx.tone ou Sfx.noise, no atraso pedido e na saída (faixa) pedida'); S.tone=t0; S.noise=n0; }
  ok(L.Sfx.faixa()===null,'CA6: sem áudio, Sfx.faixa() devolve null');
  // trocar de cena corta a faixa e agenda as notas e os fx da cena nova na faixa nova
  { const S=L.Sfx; let cortes=0, tons=[], rui=0; const F={f:2}; S.corta=()=>{ cortes++; }; S.faixa=()=>F; S.tone=function(){ tons.push(Array.prototype.slice.call(arguments)); }; S.noise=function(){ rui++; };
    L.DEV.on=true; L.devAssistir(1); const ab=L.aberturaAtual();
    ok(cortes===1 && tons.length===N[0].length && tons.every(t=>t[6]===F) && rui===6,'CA6: abrir agenda as notas da cena 1 na faixa e o fx panela ('+tons.length+' notas, '+rui+' ruídos)');
    ok(tons[0][0]===392 && tons[0][2]==='triangle' && perto(tons[0][3],0.045) && tons[0][4]===0,'CA6: as notas vão para o Sfx.tone como [freq, dur, onda, volume, atraso]');
    tons=[]; toque(els); ok(cortes===2 && ab.i===1 && tons.length>=N[1].length,'CA6: o toque troca de cena e chama Sfx.corta');
    els['btn-ab-voltar'].fire('click'); ok(cortes===3 && ab.i===0,'CA6: Voltar também corta');
    ab.update(7.1); ok(cortes===4 && ab.i===1,'CA6: o fim da cena também');
    els['btn-ab-pular'].fire('click'); ok(cortes===5 && !L.aberturaAtual(),'CA6: fechar a abertura corta a faixa');
    // a abertura antiga toca como hoje: 3 notas da cena 1, direto na saída de sempre, sem faixa
    tons=[]; cortes=0; L.devAssistir(0); ok(tons.length===3 && tons.every(t=>t[6]===undefined) && tons[0][0]===523,'CA6: com ABERTURA, toca como hoje (3 notas, sem faixa)'); }
}

// ---------- CA7: o desenho ----------
{ [false,true].forEach(rm=>{ const H=load({rm}), {L}=H, R=L.ABERTURA2, ab=new L.Abertura('menu',rm,R);
    let erro=null; try{ R.cenas.forEach((c,i)=>{ ab.i=i; [0,0.5,0.95].forEach(p=>{ ab.t=c.t*p; ab.tm=10+i+p; L.drawAbertura(H.ctx,ab); }); }); } catch(e){ erro=e; }
    ok(!erro,'CA7: drawAbertura roda nas 11 cenas em p 0, 0,5 e 0,95'+(rm?', com movimento reduzido':'')+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:'')); });
  const H=load(), {L}=H, R=L.ABERTURA2, TW=L.TW;
  ok(L.AB2 && L.AB2.chao===520 && L.AB2.k===1.38,'CA7: AB2 = { chao:520, k:1.38 }');
  ok(typeof L.AB2_CENAS.porta==='function' && typeof L.AB2_CENAS.carinho==='function' && Object.keys(L.AB2_CENAS).every(k=>R.cenas.some(c=>c.id===k)),'CA7: AB2_CENAS tem porta e carinho (e só cenas do roteiro); as que faltam são cartão de obra');
  // quadro cheio: nada da faixa antiga da legenda
  { const ab=new L.Abertura('menu',false,R), ch=[]; H.ctx.fillRect=(x,y,w,h)=>ch.push([x,y,w,h]); ab.t=3; ab.tm=3; L.drawAbertura(H.ctx,ab);
    ok(!ch.some(r=>r[0]===0 && r[1]===500 && r[2]===TW && r[3]===100),'CA7: no roteiro novo, sem a faixa de legenda'); delete H.ctx.fillRect; }
  // a legenda nova e as falas vão para a tela (fillText) no tempo delas
  { const ab=new L.Abertura('menu',false,R), tx=[]; H.ctx.fillText=s=>tx.push(s);
    ab.t=0.3; ab.tm=0.3; L.drawAbertura(H.ctx,ab); const antes=tx.slice(); tx.length=0; ab.t=4; ab.tm=4; L.drawAbertura(H.ctx,ab);
    ok(!antes.includes(R.cenas[0].leg) && tx.includes(R.cenas[0].leg) && tx.includes('toque para seguir'),'CA7: a legenda entra depois de legDe; "toque para seguir" na cena 1');
    ok(!antes.some(s=>/Vem provar/.test(s)) && tx.some(s=>/Vem provar/.test(s)),'CA7: o balão da Rosa aparece no tempo da fala');
    const io=R.cenas.findIndex(c=>!L.AB2_CENAS[c.id] && c.falas.length && c.leg);   // a 1ª cena ainda em obra (v11.13: a 6)
    if(io>=0){ const co=R.cenas[io]; tx.length=0; ab.i=io; ab.t=co.t-1; L.drawAbertura(H.ctx,ab);
      ok(tx.includes(String(io+1)) && tx.includes(co.id) && tx.includes(co.leg) && tx.some(s=>s.indexOf(co.falas[0].s.split(' ')[0])===0) && !tx.includes('toque para seguir'),'CA7: o cartão de obra mostra o número, o id, a legenda e as falas (cena '+(io+1)+')'); }
    else ok(true,'CA7: não há mais cartão de obra');
    tx.length=0; ab.i=10; ab.t=7; L.drawAbertura(H.ctx,ab); ok(tx.includes('O sonho da Bia'),'CA7: o título na cena 11'); delete H.ctx.fillText; }
  // a cabeça da Rosa cai na tela, com 40 px de margem, no instante da fala
  ['porta','carinho'].forEach((id,i)=>{ const c=R.cenas[i], f=c.falas[0], p=f.de/c.t, cam=L.ab2Cam(c,p);
    let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,f.de,cam); } catch(e){ erro=e; }
    const q=r && r.rosa ? L.ab2Tela(cam,r.rosa[0],r.rosa[1]) : null;
    ok(!erro && q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40,'CA7: '+id+' devolve a cabeça da Rosa e, em '+f.de+' s, ela cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); });
  // a foto do clique: só depois de p 0,86
  { const a=L.AB2_CENAS.carinho(H.ctx,0.5,3.5,L.ab2Cam(R.cenas[1],0.5)), b=L.AB2_CENAS.carinho(H.ctx,0.9,6.3,L.ab2Cam(R.cenas[1],0.9));
    ok(a && !a.foto && b && b.foto===true,'CA7: a foto da Rosa só aparece depois do clique (p 0,86)'); }
}

console.log(`\nsmoke88: ${total-fails}/${total}`); process.exit(fails?1:0);
