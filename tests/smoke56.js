// v9.6.10, etapa 3g-1: as conversas vêm no fim do turno, antes dos resultados (até 2 por fim de dia, em ordem fixa), a Bia e o Salão
// abrem mais cedo, o presente da dona Cida (planta) no fim do dia 1, a Decoração pelo elogio à planta e a Dani só com cartão depois de chegar.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=()=>{ const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<80){ toque(H.els); n++; } };
const fala=H=>H.g.conversa ? H.g.conversa.fala.s : '';
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const aval=(s)=>({ r:s.slice(), s, txt:'x', k:'estudante' });
const joga=(H,fat,hook)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; if(hook) hook(g); g.finishDay(); };
const base=H=>{ const sv=H.g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; return sv; };
const mostra=(H,id)=>H.els[id].classList.contains('show');

// 1. a conversa toca antes dos resultados
{ const H=nova(), {g,els}=H, sv=base(H); sv.libera.bia='pend';
  g.startDay(2); joga(H,400);
  ok(g.state==='dayend' && g.conversa && /freguês disse/.test(fala(H)),'fim do dia: a conversa pendente toca na hora');
  ok(mostra(H,'ov-conversa') && !mostra(H,'ov-end'),'e os resultados esperam por ela');
  ok(g.result && g.result.day===2 && /Lojinha e dia 3/.test(els['btn-next'].textContent),'o resultado do dia segue valendo durante a conversa');
  passa(H);
  ok(mostra(H,'ov-end') && !g.conversa && sv.libera.bia===1,'ao acabar, aparecem os resultados e a Bia fica aberta');
  els['btn-next'].fire('click'); ok(g.state==='shop','"Lojinha e dia" vai direto à lojinha (sem nova conversa)'); }

// 2. no máximo 2 por fim de dia, em ordem fixa
{ const H=nova(), {g,els}=H, sv=base(H);
  sv.convEnt='pend'; sv.libera.salao='pend'; sv.libera.bia='pend'; sv.libera.manut='pend';
  g.startDay(4); joga(H,0);
  const vistas=[]; let n=0; while(g.conversa && n<120){ if(!vistas.includes(g.conversa.falas)) vistas.push(g.conversa.falas); toque(els); n++; }
  ok(vistas.length===2 && vistas[0]===H.L.HIST_ENTREGA.falas && vistas[1]===H.L.liberaOf('salao').falas,'4 pendentes: tocam só 2 (entregadores e Salão)');
  ok(sv.convEnt===1 && sv.libera.salao===1 && sv.libera.bia==='pend' && sv.libera.manut==='pend' && mostra(H,'ov-end'),'as outras ficam pendentes e os resultados aparecem');
  els['btn-next'].fire('click'); g.startDay(5); joga(H,0);
  const v2=[]; n=0; while(g.conversa && n<120){ if(!v2.includes(g.conversa.falas)) v2.push(g.conversa.falas); toque(els); n++; }
  ok(v2.length===2 && v2[0]===H.L.liberaOf('bia').falas && v2[1]===H.L.liberaOf('manut').falas,'no dia seguinte: Bia e Manutenção'); }

// 3. a conversa de capítulo não conta no limite
{ const H=nova(), {g,els}=H, sv=base(H); sv.libera.salao='pend'; sv.libera.bia='pend'; sv.libera.manut='pend';
  g.startDay(1); sv.cap=1; joga(H,400); // dia 1 fecha com o capítulo ainda em andamento
  sv.conversa='depois'; passa(H); els['btn-next'].fire('click'); g.startDay(2);
  sv.conversa='depois'; sv.capAzul=2; sv.cap=1;
  joga(H,400); sv.conversa='depois';
  const vistas=[]; let n=0; while(g.conversa && n<200){ if(!vistas.includes(g.conversa.falas)) vistas.push(g.conversa.falas); toque(els); n++; }
  ok(vistas.length>=1,'(capítulo e cartões rodam sem travar)'); }

// 4. a família perdida no dia 1 abre o Salão no fim do dia 1
{ const H=nova(), {g}=H, sv=base(H);
  g.startDay(1); joga(H,400,g=>{ g.stats.lostBy.semMesa=1; });
  ok(sv.libera.salao==='pend' || sv.libera.salao===1,'família perdida no dia 1: o Salão abre no fim do dia 1');
  const H2=nova(), sv2=base(H2); H2.g.startDay(1); joga(H2,400);
  ok(sv2.libera.salao===0,'sem sinal, o Salão espera'); H2.g.startDay(2); joga(H2,400);
  ok(sv2.libera.salao===0,'dia 2 sem sinal: ainda fechado'); H2.g.startDay(3); joga(H2,400);
  ok(sv2.libera.salao==='pend' || sv2.libera.salao===1,'dia 3: garantia'); }

// 5. a Bia: gatilho no dia 2, garantia no dia 3
{ const H=nova(), {g}=H, sv=base(H);
  g.startDay(1); joga(H,400,g=>{ g.stats.bravoMesa=3; });
  ok(sv.libera.bia===0,'bravoMesa no dia 1: a Bia ainda não (dia 2 em diante)');
  g.startDay(2); joga(H,400); ok(sv.libera.bia===0,'dia 2 sem gatilho: fechada');
  g.startDay(3); joga(H,400); ok(sv.libera.bia==='pend' || sv.libera.bia===1,'dia 3: garantia'); }

// 6. o presente da dona Cida
{ const H=nova(), {g,els}=H, sv=H.g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1;
  ok(sv.convPlanta===0 && !sv.decor.espada,'save novo: sem planta nem conversa');
  g.startDay(1); joga(H,400);
  ok(sv.convPlanta==='pend' && g.conversa && g.conversa.falas===H.L.HIST_PLANTA.falas,'fim do dia 1: o presente da dona Cida toca');
  ok(/dona Cida/.test(fala(H)),'1ª fala do Tonhão');
  passa(H);
  ok(sv.convPlanta===1 && sv.decor.espada===1 && sv.libera.decor===0 && mostra(H,'ov-end'),'depois, a espada está à mostra e o cartão Decoração segue fechado'); }

// 7. o elogio à planta abre a Decoração
{ const H=nova(), {g}=H, sv=base(H); sv.decor.espada=1;
  g.startDay(3); joga(H,400,g=>{ g.avals=[aval([5,5,5,5,3])]; });
  ok(sv.libera.decor==='pend' || sv.libera.decor===1,'elogio (ambiente 3) com a planta à mostra: Decoração');
  const H2=nova(), sv2=base(H2); H2.g.startDay(3); joga(H2,400,g=>{ g.avals=[aval([5,5,5,5,3])]; });
  ok(sv2.libera.decor===0,'sem a planta à mostra, o elogio não abre a Decoração');
  const L=H.L.LIBERA.find(l=>l.id==='decor'); ok(L.dia===3 && L.ate===6 && L.reclama.some(t=>/plantinha/.test(t)),'dia 3, garantia 6, comentário sobre a plantinha'); }

// 8. a Dani
{ const H=nova(), {g,L,els}=H; g.save.cap=1; g.save.conversa=null; g.goShop(2); L.setShopGrupo('equipe'); L.setShopTab('dani');
  ok(!g.daniChegou && txt(els['shop-grid']).trim()==='','antes do cap. 2, a Dani não tem cartão');
  g.save.cap=2; L.setShopTab('dani'); ok(g.daniChegou && /Dani/.test(txt(els['shop-grid'])),'no cap. 2, o cartão aparece');
  const H2=nova(), {g:g2,L:L2,els:e2}=H2; g2.save.cap=2; g2.save.daniCursos={ atend:true }; g2.save.daniTar=999; g2.save.equipe.dani=4;
  g2.goShop(2); L2.setShopGrupo('equipe'); L2.setShopTab('dani');
  ok(L2.daniNivelXp(g2.save)===L2.STAFF.dani.levels.length-1 && !/Curso de Organização/.test(txt(e2['shop-grid'])) && /Atendimento/.test(txt(e2['shop-grid'])),'no nível máximo, o curso sem item que falta some; o feito fica'); }

// 9. saves antigos
{ const {L}=load(); ok(L.normSave({}).convPlanta===0 && L.normSave({dia:3}).convPlanta===1 && L.normSave({dia:1,convPlanta:'pend'}).convPlanta==='pend','saves: novo 0; quem passou do dia 1 vira 1; pendente segue'); }

console.log('smoke56: total =',total,' fails =',fails); process.exit(fails?1:0);
