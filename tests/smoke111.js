// v12.8.1: os desenhos dos pratos novos do Terraço e o risoto da Lia. Spec: docs/spec-v12.8.1.md. CA1 a CA5 (CA6: shot_v12_8.js com PONTO=terraco).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TODOS={ pastel:2, chapa:2, fritos:2, assados:2, veg:2, restaurante:2, entradas:2, alta:2 };
const mk=(ponto)=>{ const H=load(), {L,g}=H;
  g.mode='carreira'; g.save=L.normSave(Object.assign({dia:10,maxDay:10,bank:9000,salao:{ponto},cursos:TODOS})); g.up=g.save.up; g.buildTables(); g.startDay(10); g.begin(); g.schedule=[]; g.nextIdx=0; return {L,g,H}; };
const rec=()=>{ const log=[]; const r=v=>typeof v==='number'?Math.round(v*10)/10:(typeof v==='string'?v:typeof v);
  const px=new Proxy({},{ get:(o,k)=>{ if(k==='__log') return log; if(k in o) return o[k]; if(k==='measureText') return ()=>({width:10}); if(/^create(Linear|Radial)Gradient$/.test(k)) return ()=>({addColorStop(){}});
      return (...a)=>{ log.push(String(k)+'('+a.map(r).join(',')+')'); }; },
    set:(o,k,v)=>{ o[k]=v; log.push(String(k)+'='+r(v)); return true; } });
  return px; };
const sig=(fn)=>{ const c=rec(); fn(c); return c.__log.join(';'); };
const {L,g,H}=mk('terraco');
const C=L.CARDAPIO;
const novos=['vinho','galeto','escalope','dadinho','croquete','folhado','empadinhaCam','coalhoMel','crostini','pastelCamarao','ravioli','nhoque','polenta','curry','moquecaPalmito'];
const terraco=Object.keys(C).filter(k=>C[k].preco.terraco!=null && C[k].cat!=='junina');
const sigD=(k,av)=>sig(c=>L.drawDish(c,k,0,0,1,false,null,av));

// CA1: o DESENHO_BASE só tem os 6 pratos da v8.6.11
{ const ks=Object.keys(L.DESENHO_BASE);
  ok(ks.length===6 && novos.every(k=>!L.DESENHO_BASE[k]),'CA1: DESENHO_BASE com '+ks.length+' pratos ('+ks.join()+')'); }

// CA2: cada prato do Terraço (com o risoto da Lia) é diferente de todos os outros, com e sem o avançado
{ ok(novos.every(k=>terraco.includes(k)) && terraco.includes('liaRisoto'),'CA2: os 15 pratos novos e o risoto da Lia estão no Terraço ('+terraco.length+' pratos)');
  for (const av of [false,true]){
    const m={}, rep=[]; terraco.forEach(k=>{ const s=sigD(k,av); if(m[s]) rep.push(m[s]+'='+k); else m[s]=k; });
    ok(rep.length===0,'CA2: desenhos do Terraço todos diferentes (av='+av+')'+(rep.length?' (iguais: '+rep.join()+')':'')); }
  const med=sigD('medalhao',false), ris=sigD('risoto',false), lia=sigD('liaRisoto',false);
  ok(lia!==med && lia!==ris,'CA2: o risoto da Lia não é o medalhão nem o risoto de cogumelos'); }

// CA3: com avançado o desenho muda (nos novos sem semAv); nos semAv, não
{ const mudam=novos.filter(k=>!C[k].semAv), iguais=novos.filter(k=>C[k].semAv);
  const sem=mudam.filter(k=>sigD(k,true)===sigD(k,false)), com=iguais.filter(k=>sigD(k,true)!==sigD(k,false));
  ok(mudam.length===13 && sem.length===0,'CA3: '+mudam.length+' pratos novos mudam com o avançado'+(sem.length?' (não mudam: '+sem.join()+')':''));
  ok(iguais.length===2 && com.length===0,'CA3: os semAv ('+iguais.join()+') ficam iguais'+(com.length?' (mudam: '+com.join()+')':''));
  ok(sigD('liaRisoto',true)===sigD('liaRisoto',false),'CA3: o risoto da Lia fica igual com o avançado'); }

// CA4: tudo roda sem erro (dish, marmita, vazio) e o save/restore fecha
{ let erro=null, desb=[];
  try{
    terraco.forEach(k=>{ for (const av of [false,true]){
      const c=rec(); L.drawDish(c,k,10,10,0.9,false,'frango',av); const a=c.__log.filter(s=>s.startsWith('save(')).length, b=c.__log.filter(s=>s.startsWith('restore(')).length; if(a!==b) desb.push(k);
      L.drawDish(rec(),k,0,0,1,true,null,av); }
      L.drawMarmita(rec(),k,0,0,1); });
  }catch(e){ erro=e.stack.split('\n').slice(0,3).join(' | '); }
  ok(!erro,'CA4: os desenhos rodam sem erro'+(erro?' ('+erro+')':''));
  ok(desb.length===0,'CA4: save e restore fecham'+(desb.length?' ('+desb.join()+')':'')); }

// CA5: o painel do modo dev, no Terraço, mostra um desenho para cada prato do cardápio do ponto
{ const x=mk('terraco'); x.g.setDev(true); x.g.mode='carreira'; x.g.save=x.L.normSave({dia:10,maxDay:10,bank:9000,salao:{ponto:'terraco'},cursos:TODOS}); x.g.up=x.g.save.up; x.g.goShop(10); x.L.DEV.aba='equipe'; x.L.buildDev();
  const cx=x.H.els['dev-body'].children.find(c=>c.id==='dev-cardapio'); const itens=cx?cx.children.filter(c=>c.children.some(q=>q.tagName==='CANVAS')):[];
  ok(cx && itens.length===x.L.pratosDoPonto(x.g.ponto).length && itens.length>0,'CA5: o painel dev (terraco) tem um desenho para cada prato: '+itens.length+' de '+x.L.pratosDoPonto(x.g.ponto).length); }

console.log(fails? ('\n'+fails+' FALHAS de '+total) : ('\nsmoke111: '+total+' checagens ok')); process.exit(fails?1:0);
