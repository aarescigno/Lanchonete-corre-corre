// v11.18 (etapa 10c): o final novo no ar. As cenas 7 (ceu), 8 (roda) e os créditos; o FINAL passa a ser o roteiro novo (o FINAL2, o FINAL_CREDITOS, a AB_CENAS e o ab2Obra saem);
// o final toca pelo motor novo (câmera, transição, legenda que entra em legDe, faixa de som cortada ao trocar, sem a faixa de legenda antiga).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TH=600, TW=1220;
const ROT=[ // id, t, min, leg (ou lista), falas [q,s,de], sai, clima, cam, fx
 ['telefone',6.5,1,'Na manhã seguinte, o telefone do Terraço tocou cedo.',[['bia','Alô?... É do Michelzão?!',2.4]],'corte','sonho',[[950,400,1.9],[760,300,1.25]],[['telefone',0.2],['telefone',1.4]]],
 ['placa',8,1,['A Lanchonete Corre-Corre ganhou a estrela do Michelzão.','A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão.','Três estrelas do Michelzão: a nota mais alta do guia.'],[['tonhao','Tá torta?',2.6],['bia','Tá perfeita, tio.',4.4]],'iris','festa',[[380,330,1.15],[340,230,1.9]],[['parafuso',0.5],['brilho',4.8]]],
 ['apagou',7.5,1,'Sem o molho da Rosa, a estrela da Casa Aurora se apagou.',[['braulio','Cadê o tempero?!',3]],'escuro','triste',[[865,300,2],[780,330,1.15]],[['apaga',4.6]]],
 ['retrato',8,1,'A Bia pendurou a estrela ao lado do retrato da mãe.',[['bia','Essa estrela é nossa, mãe.',3.4]],'passa','casa',[[470,330,1.2],[470,270,2]],[['estrela',2.8]]],
 ['equipe',8,2,'Ninguém ganha estrela sozinho.',[['tonhao','Olha o passarinho!',2.8]],'passa','festa',[[610,330,1],[620,310,1.15]],[['clique',4.8]]],
 ['escola',8.5,1,'A garagem da Rosa reabriu: é a escola de cozinha do bairro.',[['dani','Eu era lenta, mas aprendi rápido. Vocês também vão!',3]],'escuro','esperanca',[[610,330,1],[610,390,1.7]],[['sino',0.4],['panela',3.6]]],
 ['ceu',8,3,'Do Terraço, nas noites limpas, dá para ver três estrelas.',[['bia','Uma delas pisca pra mim, tio.',2.6],['tonhao','Eu sei qual é.',4.6]],'escuro','estrelas',[[610,190,1.6],[610,330,1.1]],[['estrela',1.0],['estrela',6.4]]],
 ['roda',9,1,'E sempre tem uma criança na porta da cozinha, olhando.',[['bia','Comida boa é carinho que a gente põe no prato.',3.2]],'escuro','fim',[[330,330,1.7],[610,300,1]],[['panela',0.4]]]];
const dentro=q=>q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40;

// ---------- CA1: as cenas 7 (ceu), 8 (roda) e os créditos desenham ----------
const CENAS=[['ceu',6,['bia','tonhao']],['roda',7,['bia']],['creditos',8,[]]];
[false,true].forEach(rm=>[1,2,3].forEach(est=>{ const H=load({rm}), {L}=H, R=L.FINAL, ab=new L.Abertura('menu',rm,R,{est,creditos:true}), tx=[]; H.ctx.fillText=s=>tx.push(s);
  CENAS.forEach(([id])=>{ const i=ab.cenas.findIndex(q=>q.id===id); if(i<0){ ok(est<3 && id==='ceu','CA1: '+id+' toca com '+est+' estrela(s)'); return; }
    let erro=null, obra=false;
    try{ ab.i=i; [0,0.25,0.5,0.75,0.95].forEach(p=>{ tx.length=0; ab.t=ab.cenas[i].t*p; ab.tm=70+i+p*7; L.drawAbertura(H.ctx,ab); if(tx.includes('cena em obras')) obra=true; }); } catch(e){ erro=e; }
    ok(!erro && typeof L.AB2_CENAS[id]==='function' && !obra,'CA1: '+id+' desenha em p 0, 0,25, 0,5, 0,75 e 0,95, com '+est+' estrela(s)'+(rm?', com movimento reduzido':'')+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:'')); });
  delete H.ctx.fillText; }));
{ const H=load(), {L}=H, R=L.FINAL;
  CENAS.slice(0,2).forEach(([id,i,quem])=>{ const c=R.cenas[i];
    ok(c.id===id && JSON.stringify(c.falas.map(f=>f.q))===JSON.stringify(quem),'CA1: na cena '+(i+1)+' ('+id+') falam '+quem.join(' e '));
    c.falas.forEach(f=>{ [f.de,f.de+0.9].forEach(t=>{ const p=t/c.t, cam=L.ab2Cam(c,p);
      let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,10+t,cam); } catch(e){ erro=e; }
      const a=r && r[f.q], q=a ? L.ab2Tela(cam,a[0],a[1]) : null;
      ok(!erro && dentro(q),'CA1: '+id+', '+f.q+' em '+t.toFixed(1)+' s: a cabeça cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); }); });
    const cam=L.ab2Cam(c,1); let r=null; try{ r=L.AB2_CENAS[id](H.ctx,0.8,0,cam); } catch(e){}
    ok(r && quem.every(k=>{ const a=r[k]; return a && dentro(L.ab2Tela(cam,a[0],a[1])); }),'CA1: '+id+', com movimento reduzido, a cabeça também'); });
  // o título "Fim": escrito de p 0,84 em diante, e só nessa cena
  const c=R.cenas[7], tx=[]; H.ctx.fillText=s=>tx.push(s);
  const fim=(p,T)=>{ tx.length=0; try{ L.AB2_CENAS.roda(H.ctx,p,T,L.ab2Cam(c,p)); } catch(e){} return tx.includes('Fim'); };
  [0,0.3,0.6,0.8,0.83].forEach(p=>ok(!fim(p,10+p),'CA1: na roda, em p '+p+' o "Fim" ainda não está escrito'));
  [0.84,0.9,0.95,1].forEach(p=>ok(fim(p,10+p),'CA1: na roda, em p '+p+' o "Fim" está escrito'));
  ok(fim(0.8,0),'CA1: na roda, com movimento reduzido (T 0, p 0,8), o "Fim" já está lá');
  tx.length=0; try{ L.AB2_CENAS.ceu(H.ctx,0.95,12,L.ab2Cam(R.cenas[6],0.95)); }catch(e){} ok(typeof L.AB2_CENAS.ceu==='function' && !tx.includes('Fim'),'CA1: a ceu não escreve "Fim"');
  // os créditos: os três textos
  const cr=R.creditos, txc=(p,T)=>{ tx.length=0; try{ L.AB2_CENAS.creditos(H.ctx,p,T,L.ab2Cam(cr,p)); } catch(e){} return tx.slice(); };
  const T3=['Lanchonete Corre-Corre','O sonho da Bia','Obrigado por jogar!'], visto=t=>T3.filter(s=>t.includes(s)).length;
  ok(visto(txc(0.95,20))===3,'CA1: nos créditos, em p 0,95, os três textos');
  ok(visto(txc(0.0,20))===0,'CA1: nos créditos, em p 0, ainda nenhum texto');
  ok(txc(0.95,20).join('|').includes('Lanchonete Corre-Corre') && visto(txc(0.8,20))===3 && visto(txc(0.8,0))===3,'CA1: nos créditos, com movimento reduzido (T 0), os três à vista');
  const letreiro=[]; H.ctx.fillText=s=>letreiro.push(s); try{ L.AB2_CENAS.creditos(H.ctx,0.8,0,L.ab2Cam(cr,0.8)); }catch(e){} ok(letreiro.join('').includes('Cozinha da Rosa'),'CA1: nos créditos, o letreiro "Cozinha da Rosa" está na garagem');
  delete H.ctx.fillText; }

// ---------- CA2: o FINAL é o roteiro novo; o FINAL2, o FINAL_CREDITOS, a AB_CENAS e o ab2Obra não existem ----------
{ const H=load(), {L}=H, R=L.FINAL, cs=R.cenas;
  ok(R.cheio===true && R.final===true && R.trans===0.5 && cs.length===8 && R.fade===undefined,'CA2: o FINAL é de quadro cheio, final, trans 0,5, com 8 cenas, sem fade');
  ok(cs.every((c,i)=>{ const r=ROT[i]; return c.id===r[0] && c.t===r[1] && c.min===r[2] && JSON.stringify(c.leg)===JSON.stringify(r[3]) && JSON.stringify(c.falas.map(f=>[f.q,f.s,f.de]))===JSON.stringify(r[4]) && c.sai===r[5] && c.clima===r[6] && JSON.stringify([c.cam.de,c.cam.para])===JSON.stringify(r[7]) && JSON.stringify(c.fx)===JSON.stringify(r[8]); }),'CA2: as 8 cenas, com tempos, estrelas, legendas, falas, sai, clima, câmera e fx do roteiro');
  ok(cs[2].legDe===4.8 && cs[7].titulo==='Fim' && cs.filter(c=>c.legDe!=null).length===1 && cs.every(c=>c.som===undefined),'CA2: legDe 4,8 só no apagou; a roda tem o título Fim; nenhuma cena tem som');
  const cr=R.creditos; ok(cr && cr.id==='creditos' && cr.t===6 && cr.cheia===true && cr.clima==='creditos' && cr.sai==='escuro' && JSON.stringify(cr.cam.de)==='[610,240,1.3]' && JSON.stringify(cr.cam.para)==='[610,300,1]' && JSON.stringify(cr.fx)==='[["estrela",0.6]]','CA2: os créditos estão em FINAL.creditos');
  ok(L.FINAL2===undefined && L.FINAL_CREDITOS===undefined && L.AB_CENAS===undefined,'CA2: FINAL2, FINAL_CREDITOS e AB_CENAS não existem');
  ok(L.ab2Obra===undefined,'CA2: o ab2Obra não existe');
  ok(Object.keys(L.AB2_CENAS).every(k=>k in L.AB2_CENAS) && R.cenas.concat([R.creditos]).every(c=>typeof L.AB2_CENAS[c.id]==='function'),'CA2: toda cena do final (as 8 e os créditos) tem desenho na AB2_CENAS');
  [false,true].forEach(rm=>{ const H2=load({rm}), L2=H2.L, ab=new L2.Abertura('menu',rm,L2.FINAL,{est:3,creditos:true}), tx=[]; H2.ctx.fillText=s=>tx.push(s); let erro=null;
    ab.cenas.forEach((c,i)=>{ tx.length=0; try{ ab.i=i; [0.1,0.5,0.95].forEach(p=>{ ab.t=c.t*p; ab.tm=5+i; L2.drawAbertura(H2.ctx,ab); }); } catch(e){ erro=e; }
      ok(!erro && !tx.includes('cena em obras'),'CA2: '+c.id+' não cai no cartão de obra'+(rm?' (movimento reduzido)':'')+(erro?': '+erro.message:'')); }); delete H2.ctx.fillText; });
}

// ---------- CA4: o final toca pelo motor novo ----------
{ const H=load(), {L}=H, R=L.FINAL, f=new L.Abertura('menu',false,R,{est:3,creditos:true});
  ok(f.cam && Math.abs(f.cam.z-1.9)<1e-9 && f.trans===null,'CA4: no FINAL, a câmera da cena 1 começa em z 1,9, e fora dos últimos 0,5 s não há transição');
  f.t=6.2; ok(f.trans && f.trans.tipo==='corte','CA4: a transição de saída da 1 é o corte'); f.i=1; f.t=7.8; ok(f.trans && f.trans.tipo==='iris','CA4: a da 2 é a íris'); f.i=2; f.t=7.2; ok(f.trans && f.trans.tipo==='escuro' && f.escuro>0.3,'CA4: a da 3 é o escuro');
  f.i=2; f.t=3; ok(f.legA===0,'CA4: no apagou a legenda ainda não entrou em 3 s'); f.t=5.4; ok(f.legA===1,'CA4: e entrou em 5,2 s (legDe 4,8)');
  f.i=0; f.t=0; ok(f.escuro===1 || f.escuro>0.9,'CA4: a 1ª cena entra do escuro'); f.update(2); ok(f.escuro===0,'CA4: o escuro some em 0,5 s');
  f.i=f.n-1; ok(f.cena.id==='creditos' && f.texto()==='Lanchonete Corre-Corre. O sonho da Bia. Obrigado por jogar!','CA4: o texto dos créditos para o leitor de tela');
  const ch=[]; H.ctx.fillRect=(x,y,w,h)=>ch.push([x,y,w,h]); const g=new L.Abertura('menu',false,R,{est:3}); g.i=3; g.t=4; g.tm=4; L.drawAbertura(H.ctx,g);
  ok(!ch.some(r=>r[0]===0 && r[1]===500 && r[2]===L.TW && r[3]===100),'CA4: o FINAL não tem mais a faixa de legenda antiga (0, 500, TW, 100)'); delete H.ctx.fillRect;
  // a faixa de som: cortada ao trocar de cena, com as notas do clima e os fx
  const S=L.Sfx; let cortes=0, tons=[], rui=0; const F={f:2}; S.corta=()=>{ cortes++; }; S.faixa=()=>F; S.tone=function(){ tons.push(Array.prototype.slice.call(arguments)); }; S.noise=function(){ rui++; };
  L.DEV.on=true; H.g.setState('menu'); L.devFinal(3); const ab=L.aberturaAtual(), N0=L.ab2Notas(R.cenas[0]).length;
  ok(ab && ab.roteiro===R && cortes>=1 && tons.length>=N0+2 && tons.every(t=>t[6]===F),'CA4: o final toca as notas do clima da cena 1 e os fx, pela faixa ('+tons.length+' tons)');
  const c1=cortes; tons=[]; ab.seguir(); ok(cortes===c1+1 && ab.i===1 && tons.length>=L.ab2Notas(R.cenas[1]).length,'CA4: trocar de cena corta a faixa e agenda a cena nova');
  ab.pular(); ok(cortes>=c1+2 && !L.aberturaAtual(),'CA4: fechar corta a faixa');
}
console.log('smoke94: '+total+' checagens, fails = '+fails);
process.exit(fails?1:0);
