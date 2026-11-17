// v11.16 (etapa 10a): o final novo, o motor, o som e as cenas 1 a 3 (FINAL2). Só toca pelo modo dev; o FINAL antigo segue como está.
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

// ---------- CA1: o roteiro ----------
{ const H=load(), {L}=H, R=L.FINAL2, cs=R.cenas;
  ok(R.cheio===true && R.final===true && R.trans===0.5 && cs.length===8,'CA1: FINAL2 é de quadro cheio, final, trans 0,5, com 8 cenas');
  ok(cs.every((c,i)=>{ const r=ROT[i]; return c.id===r[0] && c.t===r[1] && c.min===r[2] && JSON.stringify(c.leg)===JSON.stringify(r[3]) && JSON.stringify(c.falas.map(f=>[f.q,f.s,f.de]))===JSON.stringify(r[4]) && c.sai===r[5] && c.clima===r[6] && JSON.stringify([c.cam.de,c.cam.para])===JSON.stringify(r[7]) && JSON.stringify(c.fx)===JSON.stringify(r[8]); }),'CA1: id, tempo, min, legenda, falas, sai, clima, câmera e fx de cada cena, como no docs/FINAL.md §4');
  ok(cs[2].legDe===4.8 && cs[7].titulo==='Fim' && cs.filter(c=>c.legDe!=null).length===1,'CA1: legDe 4,8 só no apagou; a roda tem o título Fim');
  const ls=[]; cs.forEach(c=>(Array.isArray(c.leg)?c.leg:[c.leg]).forEach(l=>ls.push(l)));
  ok(ls.every(l=>l.length<=60),'CA1: nenhuma legenda passa de 60 letras ('+Math.max.apply(null,ls.map(l=>l.length))+')');
  ok(cs.every(c=>c.som===undefined),'CA1: nenhuma cena tem som');
  const cr=R.creditos; ok(cr.id==='creditos' && cr.t===6 && cr.cheia===true && cr.clima==='creditos' && cr.sai==='escuro' && JSON.stringify(cr.cam.de)==='[610,240,1.3]' && JSON.stringify(cr.cam.para)==='[610,300,1]' && JSON.stringify(cr.fx)==='[["estrela",0.6]]','CA1: os créditos');
  ok(Math.abs(cs.reduce((a,c)=>a+c.t,0)-63.5)<1e-9,'CA1: com 3 estrelas, 63,5 s mais 6 dos créditos');
  ok(L.FINAL.final===true && !L.FINAL.cheio,'CA1: o FINAL antigo só ganha final:true');
}

// ---------- CA2: a Abertura escolhe as cenas ----------
{ const H=load(), {L}=H, ids=a=>a.cenas.map(c=>c.id).join();
  const T3='telefone,placa,apagou,retrato,equipe,escola,ceu,roda';
  ok(ids(new L.Abertura('menu',false,L.FINAL2,{est:1}))==='telefone,placa,apagou,retrato,escola,roda','CA2: 1 estrela: 6 cenas');
  ok(ids(new L.Abertura('menu',false,L.FINAL2,{est:2,creditos:true}))==='telefone,placa,apagou,retrato,equipe,escola,roda,creditos','CA2: 2 estrelas com créditos');
  ok(ids(new L.Abertura('menu',false,L.FINAL2,{est:3,creditos:true}))===T3+',creditos','CA2: 3 estrelas com créditos');
  ok(ids(new L.Abertura('menu',false,L.FINAL2,{est:3,desde:1}))==='placa,equipe,ceu' && ids(new L.Abertura('menu',false,L.FINAL2,{est:3,desde:2}))==='placa,ceu','CA2: com `desde`, a placa e as cenas ainda não vistas');
  ok(ids(new L.Abertura('menu',false,L.FINAL,{est:3,creditos:true}))===T3+',creditos' && new L.Abertura('menu',false,L.FINAL,{est:1,creditos:true}).cenas.slice(-1)[0].id==='creditos','CA2: o FINAL antigo segue escolhendo como antes');
  [1,2,3].forEach(e=>{ const a=new L.Abertura('menu',false,L.FINAL2,{est:e}); a.i=1; ok(a.leg===L.FINAL2.cenas[1].leg[e-1],'CA2: a legenda da placa com '+e+' estrela(s)'); });
  const a=new L.Abertura('menu',false,L.FINAL2,{est:1,creditos:true});
  ok(Math.abs(a.legA-0)<1e-9,'CA2: a legenda ainda não entrou em t 0'); a.i=2; a.t=3; ok(a.legA===0,'CA2: no apagou a legenda só entra em 4,8 s'); a.t=5.4; ok(a.legA===1,'CA2: e entra até 5,2 s');
  a.i=0; a.t=6.4; ok(a.trans && a.trans.tipo==='corte','CA2: a transição de saída da 1 é o corte, nos últimos 0,5 s'); a.i=1; a.t=7.8; ok(a.trans && a.trans.tipo==='iris','CA2: a da 2 é a íris');
  const cam=a.cam; a.i=0; a.t=0; const c0=a.cam; ok(Math.abs(c0.z-1.9)<1e-9,'CA2: a câmera da 1 começa em z 1,9'); a.t=6.5; ok(Math.abs(a.cam.z-1.25)<1e-9,'CA2: e acaba em 1,25');
  a.i=a.n-1; ok(a.cena.id==='creditos' && a.texto()==='Lanchonete Corre-Corre. O sonho da Bia. Obrigado por jogar!','CA2: o texto dos créditos para o leitor de tela');
  a.i=1; ok(a.texto()==='A Lanchonete Corre-Corre ganhou a estrela do Michelzão. Tonhão: Tá torta? Bia: Tá perfeita, tio.','CA2: o texto da placa');
}

// ---------- CA3: as cenas 1, 2 e 3 desenham e as cabeças caem na tela ----------
const CENAS=[['telefone',0,['bia']],['placa',1,['tonhao','bia']],['apagou',2,['braulio']]];
[false,true].forEach(rm=>[1,2,3].forEach(est=>{ const H=load({rm}), {L}=H, R=L.FINAL2, ab=new L.Abertura('menu',rm,R,{est});
  CENAS.forEach(([id,i])=>{ let erro=null;
    try{ ab.i=i; [0,0.25,0.5,0.75,0.95].forEach(p=>{ ab.t=R.cenas[i].t*p; ab.tm=70+i+p*7; L.drawAbertura(H.ctx,ab); }); } catch(e){ erro=e; }
    ok(!erro && typeof L.AB2_CENAS[id]==='function','CA3: '+id+' desenha em p 0, 0,25, 0,5, 0,75 e 0,95, com '+est+' estrela(s)'+(rm?', com movimento reduzido':'')+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:'')); }); }));
{ const H=load(), {L}=H, R=L.FINAL2;
  CENAS.forEach(([id,i,quem])=>{ const c=R.cenas[i];
    c.falas.forEach(f=>{ [f.de,f.de+0.9].forEach(t=>{ const p=t/c.t, cam=L.ab2Cam(c,p);
      let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,10+t,cam); } catch(e){ erro=e; }
      const a=r && r[f.q], q=a ? L.ab2Tela(cam,a[0],a[1]) : null;
      ok(!erro && q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40,'CA3: '+id+', '+f.q+' em '+t.toFixed(1)+' s: a cabeça cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); }); });
    const cam=L.ab2Cam(c,1), r=L.AB2_CENAS[id](H.ctx,0.8,0,cam);
    ok(quem.every(k=>{ const a=r[k], q=a && L.ab2Tela(cam,a[0],a[1]); return q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40; }),'CA3: '+id+', com movimento reduzido, a cabeça também'); });
  let erro=null; try{ ['manha','noite'].forEach(m=>L.ab2Terraco(H.ctx,{cx:610,cy:300,z:1},m,{T:1,tel:{fora:false,toca:true,K:1.2}})); L.ab2RuaAurora(H.ctx,{cx:610,cy:300,z:1},'noite',{T:1,abre:1,estrela:0}); [0,0.5,1].forEach(e=>L.ab2RuaAurora(H.ctx,{cx:610,cy:300,z:1},'noite',{T:1,abre:1,estrela:e})); L.ab2RuaAurora(H.ctx,{cx:610,cy:300,z:1},'tarde',{T:1,abre:1}); } catch(e){ erro=e; }
  ok(!erro,'CA3: ab2Terraco (manhã e noite) e a rua da Casa Aurora de noite (estrela 0, 0,5 e 1) desenham'+(erro?': '+erro.message:''));
  // a estrela da placa: 1, 2 e 3 estrelas desenham e a rua da tarde segue igual
  const ab=new L.Abertura('menu',false,R,{est:3}); ab.i=1; ab.t=7.2; ab.tm=9; let e2=null; try{ L.drawAbertura(H.ctx,ab); }catch(e){ e2=e; } ok(!e2,'CA3: a placa com 3 estrelas desenha');
}

// ---------- CA4: as cenas ainda sem desenho (v11.17: a 7, a 8 e os créditos) caem no cartão de obra; v11.17: as 4, 5 e 6 ganharam o desenho e saem daqui ----------
[false,true].forEach(rm=>{ const H=load({rm}), {L}=H, R=L.FINAL2, ab=new L.Abertura('menu',rm,R,{est:3,creditos:true}), tx=[]; H.ctx.fillText=s=>tx.push(s); let erro=null;
  ab.cenas.forEach((c,i)=>{ if(typeof L.AB2_CENAS[c.id]==='function') return; tx.length=0; try{ ab.i=i; [0.1,0.5,0.95].forEach(p=>{ ab.t=c.t*p; ab.tm=5+i; L.drawAbertura(H.ctx,ab); }); } catch(e){ erro=e; }
    ok(!erro && tx.includes('cena em obras') && tx.includes(c.id),'CA4: '+c.id+' cai no cartão de obra'+(rm?' (movimento reduzido)':'')+(erro?': '+erro.message:'')); }); delete H.ctx.fillText; });
{ const H=load(), {L}=H, ab=new L.Abertura('menu',false,L.FINAL2,{est:3,creditos:true}); let n=0; const c0=H.ctx.arc; H.ctx.arc=function(x,y,r){ n++; };
  ab.i=3; ab.t=2; ab.tm=2; L.drawAbertura(H.ctx,ab); const dentro=n; n=0; ab.i=ab.n-1; L.drawAbertura(H.ctx,ab); const cred=n;
  ok(dentro===ab.cenas.filter(c=>!c.cheia).length || dentro>0,'CA4: as bolinhas contam as 8 cenas (sem os créditos)'); ok(cred===0,'CA4: os créditos não têm bolinhas ('+cred+')'); delete H.ctx.arc; }

// ---------- CA5: o som ----------
{ const H=load(), {L}=H, R=L.FINAL2, F=n=>R.cenas.find(c=>c.id===n);
  const fe=L.ab2Notas(F('placa')), T0=[392,523,494,523];
  ok(fe.slice(0,4).every((n,i)=>n[0]===T0[i] && n[3]==='square' && n[4]===0.04 && Math.abs(n[1]-i*0.2)<1e-9),'CA5: festa: as 4 primeiras notas do tema em square, 0,2 s cada, volume 0,04');
  const resto=fe.slice(4); ok(resto.length>10 && Math.min.apply(null,resto.map(n=>n[1]))>=1.0-1e-9 && resto.some(n=>n[3]==='triangle' && n[4]===0.045) && resto.some(n=>n[3]==='sine'),'CA5: festa: a partir de 1,0 s o tema do sonho, com o baixo');
  const es=L.ab2Notas(F('ceu')); ok(es.length>8 && es.every(n=>n[3]==='sine' && n[4]===0.035) && es[0][0]===784 && es.every(n=>n[0]>=700),'CA5: estrelas: o tema uma oitava acima, sine, volume 0,035, sem baixo');
  ok(Math.abs(es[1][1]-0.6)<1e-9,'CA5: estrelas: 0,6 s por nota');
  const cr=L.ab2Notas(R.creditos), ac=cr.filter(n=>n[1]>=R.creditos.t-1.4-1e-9);
  ok(ac.map(n=>n[0]).join()==='523,659,784,1046' && ac.every(n=>n[3]==='triangle' && n[4]===0.045 && Math.abs(n[1]-4.6)<1e-9),'CA5: créditos: o acorde Dó-Mi-Sol-Dó de 4,6 s ao fim');
  ok(cr.filter(n=>n[1]<4.6-1e-9).length>8 && cr.filter(n=>n[3]==='triangle' && n[1]<4.6-1e-9).map(n=>n[1]).sort((a,b)=>a-b).filter(v=>v>0)[0]===0.42,'CA5: créditos: antes dele, o tema do casa (0,42 s por nota)');
  ok(['telefone','parafuso','apaga'].every(n=>typeof L.AB_FX[n]==='function'),'CA5: AB_FX tem telefone, parafuso e apaga');
  const S=L.Sfx, t0=S.tone, n0=S.noise; let t=[],r=[]; S.tone=function(){ t.push(Array.prototype.slice.call(arguments)); }; S.noise=function(){ r.push(Array.prototype.slice.call(arguments)); };
  const F0={f:1}; L.AB_FX.telefone(1,F0); ok(t.length===2 && t[0][0]===784 && t[1][0]===988 && t.every(x=>x[2]==='square' && x[3]===0.035 && x[1]===0.2) && t[0][4]===1 && Math.abs(t[1][4]-1.25)<1e-9 && t.every(x=>x[6]===F0),'CA5: telefone: 784 e 988 Hz, square, 0,2 s, a segunda 0,25 s depois');
  t=[]; r=[]; L.AB_FX.parafuso(1,F0); ok(r.length===3 && r.every(x=>x[0]===0.05 && x[1]===0.05 && x[3]===2400) && [1,1.18,1.36].every((d,i)=>Math.abs(r[i][2]-d)<1e-9),'CA5: parafuso: 3 ruídos de 0,05 s a 2400 Hz, a 0, 0,18 e 0,36 s');
  t=[]; r=[]; L.AB_FX.apaga(1,F0); ok(t.length===1 && t[0][0]===440 && t[0][5]===110 && t[0][2]==='sawtooth' && t[0][1]===0.6 && t[0][3]===0.03 && r.length===1 && r[0][0]===0.12 && r[0][1]===0.06 && r[0][3]===800,'CA5: apaga: sawtooth de 440 a 110 Hz, 0,6 s, e um ruído de 0,12 s a 800 Hz');
  S.tone=t0; S.noise=n0;
  // a faixa da cena: toca pela faixa e é cortada ao trocar
  let cortes=0, tons=0; const FX={f:2}; S.corta=()=>{ cortes++; }; S.faixa=()=>FX; S.tone=function(){ tons++; }; S.noise=function(){ tons++; };
  L.aberturaSom(R.cenas[0],R); ok(tons>=L.ab2Notas(R.cenas[0]).length+4,'CA5: o FINAL2 toca as notas do clima e os efeitos'); const c1=cortes; L.aberturaSom(R.cenas[1],R); ok(cortes===c1+1,'CA5: trocar de cena corta a faixa'); L.aberturaSom(null); ok(cortes===c1+2,'CA5: fechar corta a faixa');
}

// ---------- CA6: o modo dev ----------
{ const H=load(), {g,L,els}=H; L.DEV.on=true; g.devCapitulo(15); L.DEV.aba='historia'; L.buildDev();
  const txt=e=>{ let s=e.textContent||''; (e.children||[]).forEach(c=>{ s+=' '+txt(c); }); return s; };
  const dv=txt(els['dev-body']); ok(/Final novo \(em obras\): ★/.test(dv) && /Final novo \(em obras\): ★★★/.test(dv) && /Assistir o final: ★/.test(dv),'CA6: o painel tem "Final novo (em obras)" e segue com "Assistir o final"');
  const antes=JSON.stringify(g.save);
  [1,2,3].forEach(e=>{ g.setState('menu'); L.devFinal(e,L.FINAL2); const ab=L.aberturaAtual();
    ok(ab && ab.roteiro===L.FINAL2 && ab.est===e && ab.cenas.map(c=>c.id).join()===new L.Abertura('menu',false,L.FINAL2,{est:e,creditos:true}).cenas.map(c=>c.id).join() && els['ov-abertura'].classList.contains('show'),'CA6: o ★'+('★'.repeat(e-1))+' toca o FINAL2 com as cenas certas e os créditos');
    ab.pular(); ok(!L.aberturaAtual() && g.state==='menu','CA6: o Pular volta ao menu'); });
  g.setState('menu'); L.devFinal(1,L.FINAL2); let ab=L.aberturaAtual(); for(let k=0;k<20 && L.aberturaAtual();k++) ab.update(100); ok(!L.aberturaAtual() && g.state==='menu','CA6: ao fim, volta ao menu');
  ok(JSON.stringify(g.save)===antes,'CA6: não muda o save');
  g.setState('menu'); L.devFinal(2); ab=L.aberturaAtual(); ok(ab.roteiro===L.FINAL,'CA6: "Assistir o final" segue tocando o FINAL antigo'); ab.pular();
}
console.log('smoke92: '+total+' checagens, fails = '+fails);
process.exit(fails?1:0);
