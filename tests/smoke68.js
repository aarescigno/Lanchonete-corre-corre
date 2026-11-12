// v10.5.1, etapa R1: metas no alvo e "mais uma rodada" da música do Terraço.
// CA1 os números das metas; CA2 a rodada no Terraço com trio; CA3 sem música ou fora do Terraço nada muda; CA4 a ficha l-musica; CA5 um save da v10.5.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(ponto,sv,cap)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, cap:cap||8, dia:10, maxDay:10, bank:9000, v10:1, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const sentar=(g,type)=>{ const grp=g.spawn({ type:type||'casal', color:0, vip:false, av:true }), t=g.tables.find(q=>q.free&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('wantBill'); grp.hearts=3; return { grp, t }; };
// cobra uma conta fixa e devolve { din: dinheiro que entrou, custo: o custo que subiu, rod: stats.rodadas }
const cobra=(H,chance)=>{ const {g,L}=H; const M=L.musicaDe(g.save.equipe); if(M&&M.rodada) M.rodada.chance=chance;
  const x=sentar(g,'casal'); x.grp.bill=100; x.grp.bebConta=0;
  const m0=g.money, c0=g.custo, r0=g.stats.rodadas; g.collectBill(x.grp,x.t,true);
  return { din:g.money-m0, custo:g.custo-c0, rod:g.stats.rodadas-r0, grp:x.grp }; };
const comecaDia=H=>{ H.g.startDay(10); H.els['btn-start'].fire('click'); H.g.mode='carreira'; };

// ---------- 1. as metas ----------
{ const {L}=nova(), P=L.PONTOS;
  ok(L.DAYS[0].meta===35 && L.DAYS[0].expert===80,'dia 1: meta 35, expert 80');
  ok(L.DAYS[5].meta===185 && L.DAYS[5].expert===415,'dia 6: meta 185, expert 415');
  ok(P[1].metaF===2.3 && P[1].expertF===1.5,'área industrial: metaF 2,3 e expertF 1,5');
  ok(P[2].metaF===3.1 && P[2].expertF===3.4,'Avenida: metaF 3,1 e expertF 3,4');
  const M=L.TERRACO.musica; ok(M[1].rodada.chance===0.5 && M[1].rodada.valor===0.2 && M[2].rodada.chance===0.65 && M[2].rodada.valor===0.2,'música: rodada do trio 0,5 e do pianista 0,65 (+20%)'); }

// ---------- 2. a rodada no Terraço ----------
{ const H=jogo('terraco',{ equipe:{ tonhao:1, dani:1, musica:1 } }), {g}=H; comecaDia(H);
  const sem=cobra(H,0); ok(sem.rod===0 && sem.custo===0,'trio, sorteio que não sai: sem rodada e o custo não muda');
  const com=cobra(H,1); const extra=com.din-sem.din;
  ok(com.rod===1 && g.stats.rodadas===1,'sorteio que sai: stats.rodadas soma 1');
  ok(extra>0 && Math.abs(extra - Math.round(sem.din*0.2))<=1,'a conta sobe 20% (R$ '+sem.din+' → '+com.din+')');
  ok(com.custo===Math.round(Math.round(sem.din*0.2)*0.35),'o custo do dia sobe 35% do acréscimo (R$ '+com.custo+')'); }
{ const H=jogo('terraco',{ equipe:{ tonhao:1, dani:1, musica:2 } }); comecaDia(H);
  const r=cobra(H,1); ok(r.rod===1,'o pianista também pede a rodada (chance 1 forçada)'); }

// ---------- 3. sem música, e fora do Terraço, nada muda ----------
{ const H=jogo('terraco',{ equipe:{ tonhao:1, dani:1, musica:0 } }); comecaDia(H);
  const a=cobra(H,1), b=cobra(H,1); ok(a.rod===0 && b.rod===0 && a.din===b.din && H.g.stats.rodadas===0,'Terraço sem música: nenhuma conta muda'); }
{ const H=jogo('avenida',{ equipe:{ tonhao:1, dani:1, musica:1 } }); comecaDia(H);
  ok(H.g.save.equipe.musica===0,'na Avenida a música não vale (normSave zera)');
  const a=cobra(H,1); ok(a.rod===0 && H.g.stats.rodadas===0,'Avenida: nenhuma conta muda e stats.rodadas fica 0'); }

// ---------- 4. a ficha do Manual ----------
{ const L=nova().L, f=L.MANUAL.find(x=>x.id==='l-musica');
  ok(f && f.linha==='Trio ou pianista: a paciência nas mesas dura mais, o ambiente melhora e a mesa pede mais uma rodada.','a ficha l-musica tem o texto novo'); }

// ---------- 5. um save da v10.5 ----------
{ const H=jogo('terraco',{ dia:40, maxDay:40, equipe:{ tonhao:3, dani:3, joca:3, cami:2, anselmo:2, lia:1, musica:2 } }), {g}=H;
  ok(g.save.equipe.musica===2,'o save com o pianista carrega');
  let erro=null; try{ comecaDia(H); cobra(H,1); g.endDay && g.endDay(); }catch(e){ erro=e; }
  ok(!erro,'e fecha um dia sem erro'+(erro?' ('+erro.message+')':'')); }

console.log('smoke68: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
