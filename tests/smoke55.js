// v9.6.9, etapa 3e-1: a tela respira. Textos flutuantes (piso y 170, empilham 24 px), crachás só nos primeiros 20 s,
// selo da fila das estações pequenas, números dos lugares da espera por cima, lojinha sem a lista de reservados.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const jogo=()=>{ const H=load(), {g,L}=H; g.save=L.normSave({ cap:7, dia:10, maxDay:10, bank:9000, up:{ tenis:true }, equipe:{ tonhao:1, dani:2, joca:2, cami:1, anselmo:2 }, salao:{ ponto:'avenida' } });
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.startDay(10); g.state='playing'; return H; };
const desenha=(H)=>{ const rec=[]; H.ctx.fillText=(t,x,y)=>rec.push({t:String(t),x,y}); H.ctx.strokeText=()=>{}; H.L.render(H.g,H.ctx); delete H.ctx.fillText; return rec; };

// (a) texto nascido em y 120 é desenhado em 170
{ const H=jogo(), {g}=H; g.fx=[]; g.addText(300,120,'TESTE_ALTO',  '#000',18);
  const r=desenha(H).filter(x=>x.t==='TESTE_ALTO'); ok(r.length>0 && r.every(x=>x.y>=170),'texto em y 120 é desenhado em 170 ('+r.map(x=>x.y)+')'); }

// (b) dois addText no mesmo ponto ficam a 24 px
{ const H=jogo(), {g}=H; g.fx=[]; g.addText(300,300,'A','#000',18); g.addText(300,300,'B','#000',18); g.addText(310,300,'C','#000',18);
  const t=g.fx.filter(f=>f.k==='text'); ok(t[1].y-t[0].y===24 && t[2].y-t[0].y===48,'empilham 24 px para baixo ('+t.map(f=>f.y)+')');
  g.addText(900,300,'D','#000',18); ok(g.fx[g.fx.length-1].y===300,'texto longe não empilha'); }

// (c) crachá: some depois de 20 s e volta no dia seguinte
{ const H=jogo(), {g}=H; g.elapsed=5; const a=desenha(H).some(x=>x.t==='Dani'||x.t==='JOCA'||x.t==='CAMI'||x.t==='ANSELMO');
  g.elapsed=25; const b=desenha(H).some(x=>x.t==='Dani'||x.t==='JOCA'||x.t==='CAMI'||x.t==='ANSELMO');
  g.startDay(11); g.state='playing'; g.elapsed=3; const c=desenha(H).some(x=>x.t==='ANSELMO'||x.t==='JOCA'||x.t==='Dani'||x.t==='CAMI');
  ok(a,'crachás aparecem aos 5 s'); ok(!b,'crachás somem aos 25 s'); ok(c,'crachás voltam no dia seguinte'); }

// (d) filaPos de doces, drinks e espresso fica à esquerda da estação
{ const H=jogo(), {g,L}=H;
  ['doces','drinks','espresso'].forEach(k=>{ const st=L.STATIONS?L.STATIONS[k]:null; const p=L.filaPos(g,{type:k}); if(!st) return ok(true,k+': sem estação neste ponto (pulado)');
    ok(p && p.x<st.rect.x && !p.dx && p.dy===20,k+': selo à esquerda ('+(p&&p.x)+' < '+st.rect.x+')'); }); }

// (e) lojinha sem "reservados para"
{ const H=jogo(), {g,els}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]}); g.goShop(10);
  const t=els['shop-livre'].textContent; ok(!/reservados para/.test(t),'a linha do dinheiro sem a lista ('+t+')'); }

console.log('smoke55: total = '+total+'  fails = '+fails); process.exit(fails?1:0);
