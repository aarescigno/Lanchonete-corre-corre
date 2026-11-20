// v12.8: os desenhos dos pratos novos da Avenida, os 6 juninos novos e as barracas chiques. Spec: docs/spec-v12.8.md. CA1 a CA7 (CA8: shot_v12_8.js).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TODOS={ pastel:2, chapa:2, fritos:2, assados:2, veg:2, restaurante:2, entradas:2, alta:2 };
const mk=(ponto)=>{ const H=load(), {L,g}=H;
  g.mode='carreira'; g.save=L.normSave(Object.assign({dia:10,maxDay:10,bank:9000,salao:{ponto},cursos:TODOS})); g.up=g.save.up; g.buildTables(); g.startDay(10); g.begin(); g.schedule=[]; g.nextIdx=0; return {L,g,H}; };
// um ctx de mentira que anota cada chamada (método e números a 0,1) e cada atribuição (fillStyle, lineWidth...)
const rec=()=>{ const log=[]; const r=v=>typeof v==='number'?Math.round(v*10)/10:(typeof v==='string'?v:typeof v);
  const px=new Proxy({},{ get:(o,k)=>{ if(k==='__log') return log; if(k in o) return o[k]; if(k==='measureText') return ()=>({width:10}); if(/^create(Linear|Radial)Gradient$/.test(k)) return ()=>({addColorStop(){}});
      return (...a)=>{ log.push(String(k)+'('+a.map(r).join(',')+')'); }; },
    set:(o,k,v)=>{ o[k]=v; log.push(String(k)+'='+r(v)); return true; } });
  return px; };
const sig=(fn)=>{ const c=rec(); fn(c); return c.__log.join(';'); };
const conta=(fn,nome)=>{ const c=rec(); fn(c); const l=c.__log; return l.filter(s=>s.startsWith(nome+'(')).length; };
const {L,g,H}=mk('avenida');
const C=L.CARDAPIO;
const avenida=Object.keys(C).filter(k=>C[k].preco.avenida!=null && C[k].cat!=='junina');
const junNovos=['curau','milhoCoalho','bolo','cremeMilho','pamonhaMel','canjicaCoco'], junVelhos=['pamonha','milho','canjica'];
const sigD=(k,av)=>sig(c=>L.drawDish(c,k,0,0,1,false,null,av));
const sigJ=(k)=>sig(c=>L.drawDish(c,k,0,0,1,false,null,false));

// CA1: nenhum prato da Avenida nem junino cai no DESENHO_BASE
{ const noBase=avenida.concat(Object.keys(C).filter(k=>C[k].cat==='junina' && C[k].preco.avenida!=null)).filter(k=>L.DESENHO_BASE[k]);
  ok(avenida.length===15 && noBase.length===0,'CA1: '+avenida.length+' pratos da Avenida e os juninos dela fora do DESENHO_BASE'+(noBase.length?' (ainda nele: '+noBase.join()+')':''));
  const jn=junNovos.filter(k=>L.DESENHO_BASE[k]); ok(jn.length===0,'CA1: os 6 juninos novos fora do DESENHO_BASE'+(jn.length?' ('+jn.join()+')':'')); }

// CA2: cada prato da Avenida tem desenho diferente de todos os outros, com e sem o avançado
{ for (const av of [false,true]){
    const m={}, rep=[]; avenida.forEach(k=>{ const s=sigD(k,av); if(m[s]) rep.push(m[s]+'='+k); else m[s]=k; });
    ok(rep.length===0,'CA2: desenhos da Avenida todos diferentes (av='+av+')'+(rep.length?' (iguais: '+rep.join()+')':'')); } }

// CA3: os 6 juninos novos são diferentes entre si e dos 3 de hoje
{ const m={}, rep=[]; junVelhos.concat(junNovos).forEach(k=>{ const s=sigJ(k); if(m[s]) rep.push(m[s]+'='+k); else m[s]=k; });
  ok(rep.length===0,'CA3: 9 desenhos juninos todos diferentes'+(rep.length?' (iguais: '+rep.join()+')':'')); }

// CA4: com avançado o desenho muda; nos semAv, não
{ const novos=avenida.filter(k=>k!=='parmegiana');   // os 14 pratos novos (a parmegiana já tinha desenho)
  const mudam=novos.filter(k=>!C[k].semAv), iguais=novos.filter(k=>C[k].semAv);
  const sem=mudam.filter(k=>sigD(k,true)===sigD(k,false)), com=iguais.filter(k=>sigD(k,true)!==sigD(k,false));
  ok(mudam.length===12 && sem.length===0,'CA4: '+mudam.length+' pratos novos mudam com o avançado'+(sem.length?' (não mudam: '+sem.join()+')':''));
  ok(iguais.length===2 && com.length===0,'CA4: os semAv ('+iguais.join()+') ficam iguais'+(com.length?' (mudam: '+com.join()+')':'')); }

// CA5: o ícone da barraca por ponto
{ const ic={};
  for (const p of ['garagem','industrial','avenida','terraco']){ const x=mk(p); const cv=[]; const old=x.H.doc.createElement; x.H.doc.createElement=function(t){ const e=old.call(x.H.doc,t); if(String(t)==='canvas'){ const c=rec(); e.getContext=()=>c; cv.push(c); } return e; };
    x.L.upgradeIcon('barraca'); x.H.doc.createElement=old; ic[p]=cv[0].__log.join(';'); }
  ok(ic.garagem===ic.industrial,'CA5: a barraca da Garagem e a da industrial são iguais');
  ok(ic.garagem!==ic.avenida && ic.garagem!==ic.terraco && ic.avenida!==ic.terraco,'CA5: a barraca da Avenida e a do Terraço são diferentes entre si e da Garagem'); }

// CA6: o painel do modo dev mostra um desenho para cada prato do cardápio do ponto
{ for (const p of ['avenida','terraco']){ const x=mk(p); x.g.setDev(true); x.g.mode='carreira'; x.g.save=x.L.normSave({dia:10,maxDay:10,bank:9000,salao:{ponto:p},cursos:TODOS}); x.g.up=x.g.save.up; x.g.goShop(10); x.L.DEV.aba='equipe'; x.L.buildDev();
    const cx=x.H.els['dev-body'].children.find(c=>c.id==='dev-cardapio'); const itens=cx?cx.children.filter(c=>c.children.some(q=>q.tagName==='CANVAS')):[];
    ok(cx && itens.length===x.L.pratosDoPonto(x.g.ponto).length && itens.length>0,'CA6: o painel dev ('+p+') tem um desenho para cada prato: '+itens.length+' de '+x.L.pratosDoPonto(x.g.ponto).length); } }

// CA7: tudo roda sem erro (com e sem av, na marmita, na barraca) e o save/restore fecha
{ let erro=null, desb=[];
  try{
    avenida.concat(junNovos,junVelhos).forEach(k=>{ for (const av of [false,true]){
      const c=rec(); L.drawDish(c,k,10,10,0.9,false,'frango',av); const a=c.__log.filter(s=>s.startsWith('save(')).length, b=c.__log.filter(s=>s.startsWith('restore(')).length; if(a!==b) desb.push(k);
      L.drawDish(rec(),k,0,0,1,true,null,av); }
      L.drawMarmita(rec(),k,0,0,1); });
    for (const p of ['garagem','industrial','avenida','terraco']){ const x=mk(p); x.L.upgradeIcon('barraca'); }
  }catch(e){ erro=e.stack.split('\n').slice(0,3).join(' | '); }
  ok(!erro,'CA7: os desenhos rodam sem erro'+(erro?' ('+erro+')':''));
  ok(desb.length===0,'CA7: save e restore fecham'+(desb.length?' ('+desb.join()+')':'')); }

console.log(fails? ('\n'+fails+' FALHAS de '+total) : ('\nsmoke110: '+total+' checagens ok')); process.exit(fails?1:0);
