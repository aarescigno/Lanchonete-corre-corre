// v9.6.4, etapa 3d-1: a porta fecha no fim do turno, no máximo 2 grupos grandes por mesa de 4 na espera, o Salão abre com a 1ª família
// perdida, a conversa do Efood antes dos motoboys, e o VIP (nenhum na Garagem, raro na área industrial, não perdoa prato frio).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<60){ toque(H.els); n++; } return n; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
// um dia da carreira já começado, sem agenda (os grupos entram à mão)
const dia=(n,sv,o)=>{ const H=load(o), {g,L}=H; g.save=L.normSave(Object.assign({ bank:2000, dia:n, maxDay:n, equipe:{ tonhao:1, dani:1 } },sv||{})); g.up=g.save.up; g.buildTables(); g.startDay(n); g.begin(); g.schedule=[]; g.nextIdx=0; return H; };
const passos=(g,n)=>{ for(let i=0;i<n;i++) g.update(0.05); };

// ---------- 1. a porta fecha no fim do turno ----------
{ const {g,L}=dia(2), VIP0=L.VIP;
  ok(L.FECHA.max===60 && VIP0.pat===0.65,'constantes: FECHA.max 60 s e VIP.pat 0,65');
  const a=g.arrive({type:'estudante',color:0}), b=g.arrive({type:'estudante',color:1});
  const t=g.tables.find(x=>x.free&&x.seats>=a.size); g.seatGroup(a,t);
  g.clock=0.05; passos(g,2);
  ok(g.fechado && !g.ending && g.clock===0,'com o relógio zerado: fechado, e o dia ainda não acabou (tem gente na mesa)');
  ok(b.state==='leaving' && !g.queue.length,'quem estava na espera vai embora');
  ok(g.stats.lost===0 && g.stats.lostBy.semMesa===0 && g.money>=0,'... sem multa, sem `lost`');
  ok(g.fx.some(f=>f.text==='Fechou!'),'... com o "Fechou!" sobre o grupo');
  ok(g.nextIdx===g.schedule.length,'a agenda acaba (ninguém mais chega)');
  a.setState('wantBill'); g.collectBill(a,t);
  passos(g,2);
  ok(g.ending && g.reason==='time' && g.stats.served===1,'o grupo sentado paga e só então o dia acaba (reason "time")');
  let n=0; while(g.state==='playing' && n++<200) g.update(0.05);
  ok(g.state==='dayend','e o fim do dia aparece'); }
{ const {g,L}=dia(2), a=g.arrive({type:'estudante',color:0}); const t=g.tables.find(x=>x.free&&x.seats>=a.size); g.seatGroup(a,t);
  g.clock=0.05; passos(g,2);
  let n=0; while(!g.ending && n++<1500){ a.patLeft=1e9; g.update(0.05); }
  ok(g.ending && g.fechadoT>=L.FECHA.max-0.1 && n>1100,'trava de segurança: passados '+L.FECHA.max+' s do relógio zerado, quem ficou vai embora ('+(n*0.05).toFixed(0)+' s)');
  ok(a.state==='leaving','... o grupo da mesa saiu'); }
{ // dia sem ninguém: acaba logo; o Turno sem fim e a Missão zero não mudam
  const {g}=dia(2); g.clock=0.05; passos(g,3); ok(g.ending && g.reason==='time','sem ninguém no salão, o dia acaba logo'); }
{ const H=load(); const {g}=H; g.startDay(0); g.begin(); passos(g,40); ok(g.mode==='semfim' && !g.fechado,'Turno sem fim: sem fechamento'); }
{ // o desenho com o FECHANDO e a placa, também com movimento reduzido
  [false,true].forEach(rm=>{ const H=dia(2,null,{rm}), {g,L}=H; const a=g.arrive({type:'estudante',color:0}); g.seatGroup(a,g.tables.find(x=>x.free&&x.seats>=a.size)); g.clock=0.05; passos(g,3); let err=null; try{ L.render(g,H.ctx); }catch(e){ err=e; }
    ok(!err && g.fechado,'render fechado sem erros'+(rm?' (movimento reduzido)':'')+(err?': '+err.stack:'')); }); }

// ---------- 2. no máximo 2 grupos grandes por mesa de 4 na espera ----------
{ const {g}=dia(3), m4=g.tables.filter(t=>t.open&&t.seats>=4).length;
  const fam=[]; for(let i=0;i<2*m4;i++) fam.push(g.arrive({type:'familia',color:0}));
  ok(m4>=1 && fam.every(x=>x&&x.type==='familia'),'até 2 famílias por mesa de 4 ('+m4+' mesa: '+2*m4+' famílias) entram como família');
  const extra=g.arrive({type:'familia',color:0});
  ok(extra && extra.type!=='familia' && extra.size<=2 && !extra.retira,'a seguinte chega como tipo pequeno ('+(extra&&extra.type)+')');
  const tu=g.arrive({type:'turma',color:0}); ok(!tu || tu.size<=2,'a turma também (passa como grupo pequeno)'); }
{ const {g}=dia(3); g.tables.forEach(t=>{ if(t.seats>=4) t.open=false; });
  const x=g.arrive({type:'familia',color:0}); ok(x && x.size<=2,'sem mesa de 4 aberta, todo grupo grande vira pequeno'); }
{ const {g}=dia(3); g.arrive({type:'vovos',color:0,vip:true}); const v=g.arrive({type:'familia',color:0,vip:true}); ok(v && v.vip,'o VIP continua VIP'); }
{ const {g}=dia(3); let ok2=true; for(let k=0;k<60;k++){ const tp=g.tipoPequeno(true); if(!['estudante','vovos','executiva'].includes(tp)) ok2=false; const t2=g.tipoPequeno(); if(g.day.types.indexOf(t2)<0 || t2==='entregador' || t2==='familia') ok2=false; } ok(ok2,'tipoPequeno: só tipos do dia, de 1 ou 2 pessoas, sem entregador'); }

// ---------- 3. o Salão abre com a 1ª família perdida ----------
{ const {L}=load(); const s=L.LIBERA.find(l=>l.id==='salao'); ok(s.dia===2 && s.ate===4,'Salão: dia 2, garantia no dia 4');
  ok(L.DAYS[1].note==='Chegou a família! Grupos de 3 ou 4 só cabem nas mesas de 4 lugares: se faltar mesa, eles vão embora.','nota do dia 2 nova');
  ok(L.DAYS[4].note==='O movimento cresce: fique de olho na louça e no lixo.','nota do dia 5 nova'); }
{ const H=nova(), {g,els}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convEnt=1; sv.convDiv=1;
  g.startDay(2); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0;
  g.arrive({type:'estudante',color:0}); const f=g.arrive({type:'familia',color:0}); g.angryLeave(g.queue[0]);   // um estudante: não conta
  ok(g.stats.lostGrande===0,'estudante que desiste da fila não conta como família perdida');
  g.angryLeave(g.queue.find(x=>x.size>=3)||f); ok(g.stats.lostGrande===1,'a família que desiste na fila conta em `lostGrande`');
  g.money=400; g.custo=0; g.finishDay();
  ok(sv.libera.salao==='pend','no dia 2 com a família perdida, o cartão Salão fica pendente (a conversa vem na troca de dia)');
  els['btn-next'].fire('click'); let ach=false,n=0; while(g.conversa && n<60){ if(/uma família foi embora da fila: só tem uma mesa de quatro/.test(g.conversa.fala.s)) ach=true; toque(els); n++; }
  ok(ach && sv.libera.salao===1,'toca a conversa nova da Bia e o Salão abre'); }
{ const H=nova(), {g,els}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convEnt=1; sv.convDiv=1;
  g.startDay(2); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=400; g.custo=0; g.finishDay();
  ok(sv.libera.salao===0,'dia 2 sem família perdida: o Salão ainda espera'); }

// ---------- 4. a conversa do Efood antes dos motoboys ----------
{ const {g,L}=dia(4,{ convEnt:'pend' });
  ok(!L.efoodAberto(g.save) && L.efoodAberto({convEnt:1}) && L.efoodAberto({}) ,'efoodAberto: fechada só com a conversa pendente');
  let ent=0; for(let k=0;k<40;k++){ g.resetDay(4); ent+=g.schedule.filter(s=>L.CUSTOMER_TYPES[s.type].retira).length; }
  ok(ent===0,'com a conversa pendente, o dia 4 não tem entregador (o forçado do dia vira tipo pequeno)');
  g.save.convEnt=1; let com=0; for(let k=0;k<10;k++){ g.resetDay(4); com+=g.schedule.filter(s=>s.type==='entregador').length; }
  ok(com>=10,'com a Efood aberta, o entregador do dia 4 vem ('+com+')'); }
{ const H=load({historia:true}), {g,L,els}=H; g.save.convEnt='pend'; g.save.efoodNota=0;
  g.startDay(4); ok(/Dia de movimento: a freguesia não para de chegar/.test(els['intro-note'].textContent) && !/entregador de moto/.test(els['intro-note'].textContent),'introdução do dia 4 sem Efood: "Dia de movimento"');
  ok(g.save.efoodNota===0,'... e o texto do entregador ainda não foi usado');
  g.save.convEnt=1; g.startDay(5); ok(/Chegou o entregador de moto/.test(els['intro-note'].textContent) && g.save.efoodNota===1,'no 1º dia com a Efood aberta (dia 4 em diante), o texto do entregador aparece e fica marcado');
  g.startDay(6); ok(!/entregador de moto/.test(els['intro-note'].textContent),'... uma vez só'); }
{ const {L}=load(); ok(L.normSave({dia:3}).efoodNota===0 && L.normSave({dia:5}).efoodNota===1 && L.normSave({dia:2,efoodNota:1}).efoodNota===1,'normSave: efoodNota (saves que passaram do dia 4 já viram)');
  ok(L.normSave({dia:5}).vipVisto===0 && L.normSave({dia:6}).vipVisto===1 && L.normSave({dia:2,vipVisto:1}).vipVisto===1,'normSave: vipVisto (saves que passaram do dia 5 já viram)'); }
{ // o 'convEnt' pendente toca antes da Manutenção e da Divulgação no mesmo fim de dia
  const H=nova(), {g,els,L}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convEnt='pend'; sv.convDiv='pend'; sv.libera.manut='pend';
  g.startDay(3); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=400; g.custo=0; g.finishDay();
  els['btn-next'].fire('click'); const falas=[]; let n=0; while(g.conversa && n++<60){ falas.push(g.conversa.fala.s); toque(els); }
  ok(falas.length && /Tio, que história é essa de motoqueiro/.test(falas[0]) && sv.convEnt===1 && sv.convDiv==='pend' && sv.libera.manut==='pend','a dos entregadores vem na frente; a Manutenção e a Divulgação esperam'); }

// ---------- 5. o VIP ----------
{ // nenhum na Garagem; raro na área industrial; a Avenida fica como estava
  const ct=(ponto,dias,k)=>{ const H=load(), {g,L}=H; g.save.salao=L.normSalao({ ponto }); let v=0,n=0; for(let i=0;i<k;i++) for(const d of dias){ g.resetDay(d); g.schedule.forEach(s=>{ n++; if(s.vip) v++; }); } return { v, n, f:v/n }; };
  const gar=ct('garagem',[5,6,7,8,9,10],20), ind=ct('industrial',[8,9,10],60), ave=ct('avenida',[8,9,10],60);
  ok(gar.v===0,'Garagem: nenhum VIP em '+gar.n+' grupos (nem o garantido do dia 5)');
  ok(ind.f>0.01 && ind.f<0.06,'área industrial: VIP raro, ~3% por grupo ('+(ind.f*100).toFixed(1)+'%)');
  ok(ave.f>ind.f*4,'Avenida: bem mais VIP que a área industrial ('+(ave.f*100).toFixed(1)+'%)');
  const {L}=load(); ok(L.PONTOS[0].vip===0 && L.PONTOS[1].vip===0.2 && L.PONTOS[2].vip===2,'PONTOS: vip 0, 0,2 e 2'); }
{ // prato frio pesa no VIP
  const {g,L}=dia(6); const mk=(vip)=>{ const x=g.arrive({type:'executiva',color:0,vip}); const t=g.tables.find(y=>y.free&&y.seats>=x.size); g.seatGroup(x,t); return {x,t}; };
  let {x,t}=mk(true); x.hearts=4; g.fx=[]; g.entregaPrato(x,{fria:true,q:3},t); ok(x.hearts===3 && x.state==='eating','VIP com prato frio perde 1 coração (4 → 3)');
  ok(g.fx.some(f=>f.text==='Isso aqui tá frio!'),'... e diz "Isso aqui tá frio!"');
  ({x,t}=mk(true)); x.hearts=1; g.entregaPrato(x,{fria:true},t); ok(x.hearts===1,'... sem passar de 1 coração');
  ({x,t}=mk(true)); x.hearts=3; g.entregaPrato(x,{q:4},t); ok(x.hearts===4,'VIP com prato quente ganha 1 coração, como sempre');
  ({x,t}=mk(false)); x.hearts=3; g.entregaPrato(x,{fria:true},t); ok(x.hearts===4,'cliente comum com prato frio ainda ganha 1 coração'); }
{ // o balão do 1º VIP da carreira
  const {g}=dia(5,{ vipVisto:0 }); g.fx=[];
  g.arrive({type:'executiva',color:0,vip:true});
  const b=g.fx.find(f=>f.box); ok(b && /Chegou cliente VIP!.*não perdoa prato frio/s.test(b.text) && b.life===5 && g.save.vipVisto===1,'o 1º VIP da carreira traz o balão branco de 5 s e fica marcado');
  g.fx=[]; g.arrive({type:'executiva',color:1,vip:true}); ok(!g.fx.some(f=>f.box),'... o 2º VIP não repete');
  const H=dia(5,{ vipVisto:0 }), g2=H.g; g2.arrive({type:'executiva',color:0,vip:true}); let err=null; try{ H.L.render(g2,H.ctx); }catch(e){ err=e; } ok(!err,'o balão de duas linhas desenha sem erro'); }

// ---------- 6. textos ----------
{ const H=load(), {g,L}=H; ok(/Da área industrial em diante aparece/.test(JSON.stringify(Object.keys(L).length?'':'')+require('fs').readFileSync(__dirname+'/game.js','utf8')),'Como jogar: dica do VIP atualizada'); }

console.log('smoke50: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
