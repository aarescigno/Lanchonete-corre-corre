// v12.6.1 (correção): no Terraço a mesinha das marmitas vira um aparador com o vaso, e somem as marquinhas das vagas. Spec: docs/spec-v12.6.1.md.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const mk=ponto=>{ const H=load(), {L,g}=H;
  g.save=L.normSave({dia:10,maxDay:10,bank:9000,salao:{ponto}}); g.up=g.save.up; g.buildTables(); g.startDay(10); g.begin(); g.schedule=[]; g.nextIdx=0; return {L,g}; };
const spy=()=>{ const cores=[], ell=[]; const grad=()=>({addColorStop(){}});
  const ctx=new Proxy({},{ get:(o,k)=>{ if(k in o) return o[k]; if(/^create.*Gradient$/.test(k)) return grad; if(k==='measureText') return ()=>({width:10}); if(k==='ellipse') return (...a)=>ell.push(a); return ()=>{}; },
    set:(o,k,v)=>{ if(k==='fillStyle'||k==='strokeStyle') cores.push(String(v)); o[k]=v; return true; } });
  return {ctx,cores,ell}; };
const vagas=(s,L)=>L.MARMJ_SLOTS.filter(m=>s.ell.some(e=>e[0]===m.x && e[1]===m.y+3 && e[2]===12 && e[3]===6)).length;   // a elipse de cada vaga (x, y+3, 12 x 6)
{ const {L,g}=mk('terraco'); ok(L.terraco(g),'prep: o ponto é o Terraço');
  const s=spy(); L.drawMesinha(s.ctx,g,0);
  ok(!s.cores.includes(L.PAL.madeira) && s.cores.includes('#3B2416') && s.cores.includes(L.TE_OURO),'CA1: o Terraço não pinta PAL.madeira e pinta #3B2416 e TE_OURO');
  const k=spy(); L.drawKitchen(k.ctx,g,0);
  ok(vagas(k,L)===0,'CA2: o Terraço não pinta a elipse das vagas ('+vagas(k,L)+')'); }
for (const p of ['garagem','industrial','avenida']){ const {L,g}=mk(p);
  const s=spy(); L.drawMesinha(s.ctx,g,0);
  ok(s.cores.includes(L.PAL.madeira) && !s.cores.includes('#3B2416'),'CA3: '+p+': a mesinha continua com PAL.madeira');
  const k=spy(); L.drawKitchen(k.ctx,g,0);
  ok(L.MARMJ_SLOTS.length>=2 && vagas(k,L)===L.MARMJ_SLOTS.length,'CA3: '+p+': uma elipse por vaga ('+vagas(k,L)+' de '+L.MARMJ_SLOTS.length+'; a Garagem tem 2 vagas)'); }
console.log(fails?`${fails}/${total} FALHARAM`:`TODOS OK (${total})`);
process.exit(fails?1:0);
