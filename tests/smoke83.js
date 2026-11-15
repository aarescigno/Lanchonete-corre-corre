// v11.7, etapa 8g: a roupa da Bia por ponto (docs/ARCO.md §10; spec em docs/spec-v11.7.md).
// CA1 roupaBia (o nivel do ponto, o modo dev por cima); CA2 drawBia desenha as 4 roupas, parada e andando, e elas diferem; CA3 as cores e os detalhes de cada roupa;
// CA4 retrato, tela Retratos e abertura; CA5 modo dev. O desenho em si: shot_v11_7.js.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const {L,g}=H;
// um contexto que anota tudo o que é chamado e pintado (cores e textos), para comparar uma roupa com a outra
const grava=()=>{ const log=[]; const t={};
  return { log, ctx:new Proxy(t,{ get:(o,k)=>{ if(k in o) return o[k]; if(k==='measureText') return ()=>({width:10}); if(/^create(Linear|Radial)Gradient$/.test(k)) return ()=>({addColorStop(){}});
      return (...a)=>{ log.push(k+'('+a.map(x=>typeof x==='number'?Math.round(x*10)/10:String(x)).join(',')+')'); }; },
    set:(o,k,v)=>{ if(k==='fillStyle'||k==='strokeStyle') log.push('cor:'+v); o[k]=v; return true; } }) }; };
const desenha=(roupa,o)=>{ const r=grava(); L.drawBia(r.ctx,{},100,200,Object.assign({ roupa },o||{})); return r.log; };
const cores=log=>log.filter(l=>l.startsWith('cor:')).map(l=>l.slice(4).toUpperCase());

// ---------- CA1: roupaBia ----------
{ ok(typeof L.roupaBia==='function' && L.BIA_ROUPA_COR && L.BIA_ROUPA_COR.colete==='#2F3A4A' && L.BIA_ROUPA_COR.rosa==='#D9486E','CA1 roupaBia existe e BIA_ROUPA_COR tem o colete #2F3A4A e a rosa #D9486E');
  const pt=n=>({ ponto:{ nivel:n } });
  ok([1,2,3,4].every(n=>L.roupaBia(pt(n))===n),'CA1 sem o modo dev, a roupa é o nivel do ponto (1 a 4)');
  ok(L.roupaBia(null)===1 && L.roupaBia({})===1 && L.roupaBia({ ponto:{ nivel:9 } })===4 && L.roupaBia({ ponto:{ nivel:0 } })===1,'CA1 sem ponto vale 1; o nivel fica entre 1 e 4');
  g.setDev(true); g.devRoupa(3); ok(L.roupaBia(pt(1))===3 && L.roupaBia(pt(4))===3,'CA1 o modo dev força a roupa por cima do ponto');
  g.devRoupa(null); ok(L.roupaBia(pt(2))===2,'CA1 "Normal" volta à roupa do ponto');
  g.setDev(false); ok(g.devRoupa(2)===false && L.roupaBia(pt(2))===2,'CA1 com o modo dev desligado o devRoupa não faz nada');
  const gm=load({ historia:true }); const g2=gm.g; g2.mode='treino'; ok(L.roupaBia(g2)===1,'CA1 na Missão zero (treino) a roupa é a da Garagem');
  g2.mode='semfim'; ok(L.roupaBia(g2)===1,'CA1 no Turno sem fim a roupa é a da Garagem'); }

// ---------- CA2: as 4 roupas desenham e diferem ----------
{ const L4=[1,2,3,4].map(n=>desenha(n)), A4=[1,2,3,4].map(n=>desenha(n,{ moving:true, ph:1.1, lava:false }));
  ok(L4.every(l=>l.length>40) && A4.every(l=>l.length>40),'CA2 as 4 roupas desenham, paradas e andando, sem erro');
  const s=L4.map(l=>l.join('|')); let todas=true; for(let i=0;i<4;i++) for(let j=i+1;j<4;j++) if(s[i]===s[j]) todas=false;
  ok(todas,'CA2 cada roupa dá um desenho diferente das outras três');
  const an=A4.map(l=>l.join('|')); ok(an.every((x,i)=>x!==s[i]),'CA2 andando difere de parada em cada roupa');
  let e=null; try{ [1,2,3,4].forEach(n=>{ desenha(n,{ wave:true, t:1 }); desenha(n,{ lava:true, t:1 }); desenha(n,{ maos:[[-15,-18],[15,-18]], pisca:true }); desenha(n,{ flip:-1, s:2.3, fala:0.5 }); }); }catch(x){ e=x; }
  ok(!e,'CA2 as 4 roupas aguentam aceno, lavar, mãos da cena, piscar, fala e escala'+(e?' ('+e.message+')':'')); }

// ---------- CA3: cores e detalhes ----------
{ const C=[1,2,3,4].map(n=>cores(desenha(n))), T=[1,2,3,4].map(n=>desenha(n).filter(l=>l.startsWith('fillText')).join(' '));
  ok(C[3].includes('#2F3A4A') && C[3].includes('#D9486E'),'CA3 a roupa 4 usa o colete #2F3A4A e a rosa #D9486E');
  ok(!C[0].includes('#2F3A4A') && !C[1].includes('#2F3A4A') && !C[2].includes('#2F3A4A'),'CA3 as roupas 1 a 3 não usam o colete');
  ok(C[0].includes('#D9486E') && !C[1].includes('#D9486E') && !C[2].includes('#D9486E'),'CA3 o florido (rosas miúdas) é só da roupa 1, com o mesmo rosa; a 2 e a 3 não têm rosa');
  ok(/Corre/.test(T[1]) && !/Corre/.test(T[0]) && !/Corre/.test(T[2]) && !/Corre/.test(T[3]),'CA3 só a roupa 2 tem o "Corre-Corre" bordado no peito');
  const lenco=n=>cores(desenha(n)).filter(c=>c==='#F2B33D').length;
  ok(lenco(1)>lenco(2) && lenco(1)>lenco(3) && lenco(1)>lenco(4),'CA3 o lenço amarelo do cabelo solto é só da Garagem'); }

// ---------- CA4: retrato, tela Retratos e abertura ----------
{ const mk=n=>{ const r=grava(); g.setDev(true); g.devRoupa(n); L.drawRetrato(r.ctx,'bia','neutra',50,50,g); const l=r.log; g.devRoupa(null); g.setDev(false); return l.join('|'); };
  const R=[1,2,3,4].map(mk); let dif=true; for(let i=0;i<4;i++) for(let j=i+1;j<4;j++) if(R[i]===R[j]) dif=false;
  ok(dif,'CA4 o retrato da Bia muda com a roupa (4 retratos diferentes)');
  ok(L.exprAtual()==='neutra','CA4 depois do retrato a expressão volta a neutra');
  let e=null; try{ const r=grava(); ['neutra','insegura','firme','alegre','brava'].forEach(x=>[1,2,3,4].forEach(n=>{ g.setDev(true); g.devRoupa(n); L.drawRetrato(r.ctx,'bia',x,50,50,g); })); L.drawRetratosTela(r.ctx,g); }catch(x){ e=x; } g.devRoupa(null); g.setDev(false);
  ok(!e,'CA4 o retrato da Bia desenha nas 5 expressões com cada roupa, e a tela Retratos também'+(e?' ('+e.message+')':''));
  const ab=grava(); g.setDev(true); g.devRoupa(4); L.abBia(ab.ctx,100,200,{ t:0 }); const cb=cores(ab.log); g.devRoupa(null); g.setDev(false);
  ok(!cb.includes('#2F3A4A') && cb.includes('#D9486E') && cb.includes('#F2B33D'),'CA4 a Bia da abertura (abBia) fica com a roupa 1 (florido e lenço, sem colete) mesmo com o modo dev forçando a 4'); }

// ---------- CA5: modo dev ----------
{ const HH=load({ historia:true }), gg=HH.g; gg.setDev(true); gg.devReal(true);
  ok(gg.devRoupa(2)===true && HH.L.DEV.forca.roupa===2,'CA5 devRoupa(2) força a roupa 2 (DEV.forca.roupa)');
  ok(gg.devRoupa(7)===true && HH.L.DEV.forca.roupa===4 && gg.devRoupa(-3)===true && HH.L.DEV.forca.roupa===1,'CA5 devRoupa fica entre 1 e 4');
  ok(gg.devRoupa(null)===true && HH.L.DEV.forca.roupa===undefined,'CA5 devRoupa(null) volta ao normal');
  const els=HH.els; gg.state==='menu' || 0; HH.L.abrirDev(); HH.L.DEV.aba='hoje'; HH.L.buildDev();
  const body=els['dev-body'], txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
  const t=txt(body); ok(/Roupa da Bia/.test(t),'CA5 a aba Hoje tem a linha "Roupa da Bia"');
  const botoes=[]; const ach=n=>{ if(n.tagName==='BUTTON') botoes.push(n); (n.children||[]).forEach(ach); }; ach(body);
  const rb=botoes.filter(b=>['Normal','1','2','3','4'].includes(b.textContent));
  ok(rb.length>=5 && ['Normal','1','2','3','4'].every(x=>rb.some(b=>b.textContent===x)),'CA5 a linha tem os botões Normal, 1, 2, 3 e 4'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails);
if(fails) process.exit(1);
