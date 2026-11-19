// v12.4.2 (correção): quando chega um entregador, pisca o letreiro grande do eFood no alto do salão (no lugar do brilho). Spec: docs/spec-v12.4.2.md.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const prep=H=>{ const {g,L}=H; g.save=L.normSave({dia:8,maxDay:8,bank:5000,salao:{ponto:'industrial'}}); g.up=g.save.up; g.buildTables(); g.startDay(8); g.begin(); g.schedule=[]; g.nextIdx=0; return g; };
{ const H=load(), {L}=H, g=prep(H);
  const e=g.spawn({ type:'entregador', color:0, vip:false }), lt=g.fx.filter(f=>f.k==='efood');
  ok(lt.length===1 && lt[0].max===0.8 && L.ENTREGA_CHEGA.letreiro===0.8,'CA1: o entregador acende o letreiro do eFood de 0,8 s');
  ok(!g.fx.some(f=>f.k==='glow' && f.key===e),'CA1: o entregador não ganha mais o brilho');
  g.spawn({ type:'entregador', color:0, vip:false });
  ok(g.fx.filter(f=>f.k==='efood').length===1,'CA3: dois entregadores seguidos deixam um só letreiro');
  for (let i=0;i<17;i++) g.update(0.05);
  ok(!g.fx.some(f=>f.k==='efood'),'CA3: o letreiro some depois de 0,8 s');
  // o desenho
  const chamadas=[]; let alpha=1, font='';
  const ctx=new Proxy({},{ get:(o,k)=>{ if(k==='globalAlpha') return alpha; if(k==='font') return font; if(k in o) return o[k]; if(k==='measureText') return ()=>({width:10});
      if(k==='fillText') return (t,x,y)=>chamadas.push({t,y,font,alpha}); return ()=>{}; }, set:(o,k,v)=>{ if(k==='globalAlpha') alpha=v; else if(k==='font') font=v; else o[k]=v; return true; } });
  L.drawEfoodFlash(ctx,{ fx:[{ k:'efood', life:0.4, max:0.8 }] });
  const t=chamadas.filter(c=>c.t==='eFood');
  ok(t.length>0 && t.every(c=>/84px/.test(c.font) && c.y>=96 && c.y<=200),'CA4: o letreiro escreve "eFood" com letra 84 entre y 96 e 200 ('+t.map(c=>c.font+' y'+c.y)+')');
  const a=p=>L.efoodFlashA({ life:p*0.8, max:0.8 });
  ok(a(0.5)>0.9 && a(0.02)<0.2 && a(0.98)<0.2,'CA4: acende e apaga (meio '+a(0.5).toFixed(2)+', começo '+a(0.02).toFixed(2)+', fim '+a(0.98).toFixed(2)+')'); }
{ const H=load(), g=prep(H);
  g.mode='carreira'; const o=g.arrive({ t:0, type:'encomenda', color:0, vip:false, lote:5 });
  ok(o && g.fx.some(f=>f.k==='glow' && f.key===o && f.max===1.2) && !g.fx.some(f=>f.k==='efood'),'CA2: a encomenda continua com o brilho de 1,2 s, sem letreiro'); }
console.log(fails?`${fails}/${total} FALHARAM`:`TODOS OK (${total})`);
process.exit(fails?1:0);
