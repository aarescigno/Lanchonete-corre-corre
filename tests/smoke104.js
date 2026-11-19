// v12.4.1 (correção): o cabelo preso da Bia (roupas 2 e 3) fica para trás de onde ela anda (o lado −x; o +x é o da frente). Spec: docs/spec-v12.4.1.md.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const {L}=load();
// um contexto que anota as chamadas de arc (x, y, raio)
const arcos=roupa=>{ const a=[]; const t={};
  const ctx=new Proxy(t,{ get:(o,k)=>{ if(k in o) return o[k]; if(k==='measureText') return ()=>({width:10}); if(/^create(Linear|Radial)Gradient$/.test(k)) return ()=>({addColorStop(){}});
      if(k==='arc') return (x,y,r)=>a.push([x,y,r]); return ()=>{}; }, set:(o,k,v)=>{ o[k]=v; return true; } });
  L.drawBia(ctx,{},100,200,{ roupa, t:0 }); return a; };
const com=(l,r)=>l.filter(c=>Math.abs(c[2]-r)<0.01);
const xs=l=>l.map(c=>Math.round(c[0]*10)/10).join(',');
{ const a=arcos(2), p=com(a,6.2), e=com(a,2.4).filter(c=>Math.abs(Math.abs(c[0])-7.8)>0.01);   // as bochechas também têm raio 2,4 (em x ±7,8)
  ok(p.length>0 && p.every(c=>c[0]<0),'CA1: roupa 2: o puff baixo fica atrás (x '+xs(p)+')');
  ok(e.length>0 && e.every(c=>c[0]<0),'CA1: roupa 2: o elástico fica atrás (x '+xs(e)+')'); }
{ const a=arcos(3), p=com(a,12*0.62), e=com(a,2.3);
  ok(p.length>0 && p.every(c=>c[0]<0),'CA2: roupa 3: o puff alto fica atrás (x '+xs(p)+')');
  ok(e.length>0 && e.every(c=>c[0]<0),'CA2: roupa 3: o elástico fica atrás (x '+xs(e)+')'); }
{ const p1=com(arcos(1),13.5), p4=com(arcos(4),9.5*0.62);
  ok(p1.length>0 && p1.every(c=>c[0]===0),'CA3: roupa 1: o puff continua centrado (x '+xs(p1)+')');
  ok(p4.length>0 && p4.every(c=>c[0]===0),'CA3: roupa 4: o coque continua centrado (x '+xs(p4)+')'); }
console.log(fails?`${fails}/${total} FALHARAM`:`TODOS OK (${total})`);
process.exit(fails?1:0);
