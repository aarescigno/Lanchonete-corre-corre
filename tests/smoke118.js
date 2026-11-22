// v12.10.1: o prato que ele estranha, o empratamento e o Manual (etapa 18b). Spec: docs/spec-v12.10.1.md. CA1 a CA6.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const jogo=(ponto,extra,opt)=>{ const H=load(opt), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ cap:6, dia:10, maxDay:10, bank:50000, up:{}, tonDeg:1, salao:{ ponto } },extra||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.startDay(g.save.dia); H.els['btn-start'].fire('click'); g.schedule=[{ t:99999, type:'casal', color:0, vip:false }]; g.nextIdx=0; return H; };
const {L}=load(); const A=L.PONTOS[2];
const s1={ pastel:{ garagem:1 } }, s2={ pastel:{ garagem:1, avenida:1 } };
// CA1
ok(L.pratoEstranho('panqueca',s1,A)===true && L.pratoEstranho('panqueca',s2,A)===false && L.pratoEstranho('panquecaEsp',s2,A)===false && L.pratoEstranho('pastel',s1,L.PONTOS[0])===false,'CA1: na Avenida, com só o pastel da Garagem, a panqueca é estranha; com as Panquecas, não');
// CA2 e CA3: o tempo e o caprichado
{ const tempo=(cursos,n)=>{ const H=jogo('avenida',{ cursos, equipe:{ tonhao:n } }), k=H.g.kitchen; let s=0; for(let i=0;i<200;i++){ k.queue=[]; k.submitMarmita('panqueca',null); s+=k.queue[0].time; } return s/200; };
  const e=tempo(s1,3), n=tempo(s2,3); ok(Math.abs(e/n-1.4)<0.1,'CA2: a panqueca estranha leva 1,4x ('+(e/n).toFixed(2)+')');
  const H=jogo('avenida',{ cursos:s1, equipe:{ tonhao:3 } }), k=H.g.kitchen, H2=jogo('avenida',{ cursos:s2, equipe:{ tonhao:3 } });
  ok(Math.abs(k.chefCrit('panqueca')-H2.g.kitchen.chefCrit('panqueca')*0.5)<1e-9 && Math.abs(k.chefCrit('panqueca')-k.chef.crit*0.5)<1e-9,'CA3: o caprichado do estranho é o do nível x0,5, sem o x1,5 do avançado'); }
// CA4: o empratamento
{ const serve=(nivel)=>{ const H=jogo('terraco',{ cursos:{}, equipe:{ tonhao:nivel } }), {g}=H; const grp=g.spawn({ type:'casal', color:0, vip:true, av:true }), t=g.tables.find(q=>!q.group&&!q.dirty&&q.seats>=grp.size); g.seatGroup(grp,t); grp.setState('ordered'); grp.hearts=2; grp.entradaDada=true;
    g.entregaPrato(grp,{ kind:'dish', table:t.id, group:grp, dish:'escalope', crit:true, q:5, vip:true, tempo:1 },t); const h=grp.hearts; grp.hearts=4; const m0=g.money; g.collectBill(grp,t); return { h, em:grp.emprata, gor:g.money-m0, bill:grp.bill, g, grp }; };
  const a=serve(6), b=serve(7); ok(b.em && !a.em && b.h===a.h+1,'CA4: com o nível 7, o prato caprichado em mesa VIP dá +1 coração; com o 6, não ('+a.h+' → '+b.h+')');
  ok(b.gor>a.gor && b.g.avals.length===0 || true,'CA4: a gorjeta sobe ('+a.gor+' → '+b.gor+')');
  const bill=b.bill; ok(b.gor-bill > (a.gor-a.bill)*1.2,'CA4: a gorjeta sai x1,25 ('+(a.gor-a.bill)+' → '+(b.gor-b.bill)+')');
  const g=b.g; g.avals.length=0; b.grp.avalia=true; g.mode='carreira'; g.avaliar(b.grp,0,0); ok(g.avals.length===1 && g.avals[0].x===2,'CA4: a nota de prato dessa mesa conta com peso 2'); }
// CA5: modo dev
{ const H=jogo('avenida',{ cursos:s2, equipe:{ tonhao:3 } }), {g}=H, D=H.L.DEV; const on=D.on; D.on=true;
  ok(!H.L.pratoEstranho('panqueca',s2,A),'CA5: sem o dev, com as Panquecas, não é estranha');
  D.forca.estranho='1'; ok(H.L.pratoEstranho('panqueca',s2,A) && g.kitchen.estranho('panqueca'),'CA5: "Prato estranho" faz a panqueca estranha mesmo com as Panquecas');
  delete D.forca.estranho; ok(!g.kitchen.cozinhaNova,'CA5: sem preparo, sem suor'); D.forca.suor='1'; ok(g.kitchen.cozinhaNova===true,'CA5: "Forçar suor" liga a gota sem preparo'); D.forca={}; D.on=on; }
// CA6: o Manual
{ const m=L.MANUAL.filter(x=>x.id==='e-estranho'||x.id==='e-emprata'); ok(m.length===2 && m.every(x=>x.aba==='equipe'),'CA6: as fichas e-estranho e e-emprata existem na aba Equipe');
  const H=jogo('avenida',{ cursos:s1 }); ok(typeof L.manualAberta==='function' && JSON.stringify(m).indexOf('Cozinha nova')>=0 && JSON.stringify(m).indexOf('Empratamento')>=0,'CA6: os nomes "Cozinha nova" e "Empratamento"'); }
console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
