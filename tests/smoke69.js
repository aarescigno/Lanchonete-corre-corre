// v10.5.2, etapa R2: o ritmo da história. CA1 os 11 capítulos; CA2 as conversas do cap. 3 (HIST_QUITOU e HIST_TETO);
// CA3 cap. 7 (Cami e VIPs); CA4 cap. 10 (Lia e coquetéis); CA5 capVezes, cartões de fim e a mudança; CA6 saves da v10.5; CA7 o modo dev.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const mostra=(els,id)=>els[id].classList.contains('show');
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<30){ toque(H.els); n++; } return n; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const notaDe=(g,v,n)=>{ g.save.aval=Array(n||10).fill([v,v,v,v,v]); };
// um jogo de História no cap. dado, num ponto
const jogo=(cap,ponto,sv)=>{ const H=nova(), {g,L}=H;
  g.save=L.normSave(Object.assign({ histV:1, capV:2, cap, dia:10, maxDay:10, bank:5000, v10:1, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto:ponto||'garagem' } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
// fecha um dia (com stats do dia) sem jogar
const fecha=(H,st,fat)=>{ const {g,els}=H; g.startDay(g.save.dia); els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=fat||0; g.custo=0; Object.assign(g.stats,st||{}); g.finishDay(); };

const H0=nova(), L0=H0.L, HI=L0.HISTORIA;

// ---------- 1. os 11 capítulos ----------
{ const tit=['A garagem da Rosa','A Dani chega','Casa cheia','Ponto novo','Hora do almoço','Do outro lado da rua','Salão de gente grande','Nota de restaurante','Lá no alto','A casa completa','Do começo ao fim'];
  const pts=['garagem','garagem','garagem','industrial','industrial','avenida','avenida','avenida','terraco','terraco','terraco'];
  ok(HI.length===11 && HI.every((c,i)=>c.cap===i+1 && c.titulo===tit[i] && c.ponto===pts[i]),'HISTORIA: 11 capítulos, com número, título e ponto da spec');
  const c7=HI[6], c10=HI[9];
  ok(c7.obj.equipe==='cami' && c7.obj.vip===3 && c7.obj.vezes===3 && Object.keys(c7.obj).length===3,'cap. 7: obj { equipe:cami, vip:3, vezes:3 }');
  ok(c10.obj.equipe==='lia' && c10.obj.drinks===8 && c10.obj.vezes===3 && Object.keys(c10.obj).length===3,'cap. 10: obj { equipe:lia, drinks:8, vezes:3 }');
  const f=(c,t)=>c.map(x=>x.q+':'+x.s+(x.nota?'|'+x.nota:'')).join('\n')===t.join('\n');
  ok(f(c7.antes,['bia:Vinte e quatro lugares, tio. Sozinha no salão eu não dou conta.','tonhao:Conheço uma garçonete de rodízio, a Cami. Rápida que só ela.','dani:E aqui vem gente importante. Não pode sair ninguém de cara feia!']),'cap. 7: as falas de antes');
  ok(f(c7.depois,['bia:Três dias de VIP saindo feliz!','dani:A Cami já sabe o nome de todo freguês.','tonhao:Salão redondo. Agora é a nota subir.']),'cap. 7: as falas de depois');
  ok(f(c10.antes,['tonhao:Quatro tempos por mesa, Bia. Sozinho no fogão eu não venço.','bia:A Lia, ajudante de cozinha, tá procurando serviço.','dani:E o pessoal daqui gosta de um coquetel antes da entrada!']),'cap. 10: as falas de antes');
  ok(f(c10.depois,['bia:A cozinha tá voando, tio!','tonhao:E o balcão de drinks não para.|provando um coquetel','dani:Agora só falta a refeição perfeita.']),'cap. 10: as falas de depois (a rubrica do Tonhão)');
  ok(!c7.fim && !c10.fim && HI[7].fim.h==='Fim dos capítulos da Avenida Brasil' && HI[10].fim.h==='Fim dos capítulos do Terraço Suíça' && HI[2].fim && HI[4].fim,'o `fim` fica nos capítulos 3, 5, 8 e 11');
  ok(HI[7].obj.nota===3.9 && HI[7].obj.caixa===5000 && HI[7].antes.length===3 && HI[7].depois.length===5 && HI[8].obj.azul===3 && HI[8].antes.length===5 && HI[10].obj.completas===6 && HI[10].obj.nota===4.5 && HI[10].depois.length===5,'os antigos 7, 8 e 9 (agora 8, 9 e 11) seguem como eram');
  ok(L0.HIST_QUITOU.falas.length===4 && L0.HIST_TETO.falas.length===4 && L0.HIST_QUITOU.falas[1].nota==='rasgando o carnê' && L0.HIST_TETO.falas[0].s==='Bia, olha o Gurugol! Nota 2,7!','HIST_QUITOU e HIST_TETO com 4 falas e as rubricas'); }

// ---------- 2. as conversas do cap. 3 ----------
{ // a reforma zera mas a nota não chega: só a do carnê
  const H=jogo(3,'garagem',{ emp:{}, bank:100, conversa:null }), {g}=H; notaDe(g,2.5,30);
  ok(g.save.convQuit===0 && g.save.convTeto===0,'cap. 3: as duas começam em 0');
  fecha(H); ok(g.save.convQuit==='pend' && g.save.convTeto===0 && g.save.conversa===null,'reforma quitada (nota 2,5): só HIST_QUITOU fica pendente');
  // toca uma vez só
  H.els['btn-next'].fire('click'); const n=passa(H);
  ok(n>0 && g.save.convQuit===1,'a conversa toca e vira 1 (vista)');
  g.save.dia++; notaDe(g,2.8,30); fecha(H); ok(g.save.convTeto==='pend' && g.save.convQuit===1,'nota 2,8: HIST_TETO fica pendente; a do carnê não volta');
  H.els['btn-next'].fire('click'); passa(H); ok(g.save.convTeto===1,'a do teto toca e vira 1');
  g.save.dia++; fecha(H); ok(g.save.convQuit===1 && g.save.convTeto===1,'nada pendente de novo'); }
{ // a nota chega mas a reforma não zerou: só a do teto
  const H=jogo(3,'garagem',{ emp:{ resto:300, amort:100, j:0.01, ini:2, ref:true }, bank:100, conversa:null }), {g}=H; notaDe(g,2.7,30);
  fecha(H); ok(g.save.convTeto==='pend' && g.save.convQuit===0,'nota 2,7 com a reforma ainda aberta: só HIST_TETO'); }
{ // o capítulo se cumpre no mesmo dia: as duas passam direto a 1
  const H=jogo(3,'garagem',{ emp:{}, bank:3000, conversa:null }), {g}=H; notaDe(g,2.9,30);
  fecha(H); ok(g.result.cap && g.result.cap.ok && g.save.conversa==='depois','(cap. 3 cumprido)');
  ok(g.save.convQuit===1 && g.save.convTeto===1,'cumprido no mesmo dia: as duas ficam em 1, sem tocar'); }
{ // fora do cap. 3 ou sem a História nada acontece
  const H=jogo(2,'garagem',{ emp:{}, conversa:null }), {g}=H; notaDe(g,2.9,30); fecha(H); ok(g.save.convQuit===0 && g.save.convTeto===0,'no cap. 2: nada pendente');
  const H2=jogo(4,'industrial',{ emp:{}, conversa:null }); ok(H2.g.save.convQuit===1 && H2.g.save.convTeto===1,'save além do cap. 3: entram como 1'); }

// ---------- 3. cap. 7 ----------
{ const H=jogo(7,'avenida',{ conversa:null, equipe:{ tonhao:3, dani:3, joca:3, anselmo:2 }, bank:3000 }), {g,L}=H;
  ok(g.capObj().itens[0].txt==='Contratar a Cami' && !g.capObj().itens[0].ok,'sem a Cami: "Contratar a Cami"');
  ok(g.capLinha()==='Capítulo 7, Salão de gente grande: Contratar a Cami · 3 VIPs bem atendidos num dia, 3 vezes (0 de 3)','a linha do objetivo, sem nada feito');
  g.save.equipe.cami=1; ok(g.capObj().itens[0].txt==='Cami contratada' && g.capObj().itens[0].ok,'com ela: "Cami contratada"');
  fecha(H,{ vip:2 }); ok(g.save.capVezes===0 && !g.result.cap.ok,'um dia com 2 VIPs: não soma');
  g.save.dia++; fecha(H,{ vip:3 }); ok(g.save.capVezes===1 && /\(1 de 3\)/.test(g.result.cap.itens[1].txt),'um dia com 3 VIPs: soma 1 ("1 de 3")');
  g.save.dia++; fecha(H,{ vip:5 }); ok(g.save.capVezes===2,'5 VIPs também soma só 1 (por dia)');
  g.save.dia++; fecha(H,{ vip:0 }); ok(g.save.capVezes===2 && !g.result.cap.ok,'um dia ruim no meio não zera (não precisam ser seguidos)');
  g.save.dia++; fecha(H,{ vip:3 }); ok(g.save.capVezes===3 && g.result.cap.ok && g.save.conversa==='depois','3 dias: cap. 7 cumprido, com a Cami contratada');
  ok(g.capLinha()==='Capítulo 7, Salão de gente grande: ✓ Cami contratada · ✓ 3 VIPs bem atendidos num dia, 3 vezes (3 de 3)','a linha do objetivo cumprido');
  // sem a Cami, mesmo com os VIPs, não cumpre
  const H2=jogo(7,'avenida',{ conversa:null, capVezes:2, equipe:{ tonhao:3, dani:3 } }); fecha(H2,{ vip:3 }); ok(H2.g.save.capVezes===3 && !H2.g.result.cap.ok,'3 vezes sem a Cami: não cumpre'); }

// ---------- 4. cap. 10 ----------
{ const H=jogo(10,'terraco',{ conversa:null, equipe:{ tonhao:3, dani:3, joca:3, cami:2, anselmo:2 }, bank:3000 }), {g}=H;
  ok(g.capObj().itens[0].txt==='Contratar a Lia' && !g.capObj().itens[0].ok,'sem a Lia: "Contratar a Lia"');
  ok(g.capLinha()==='Capítulo 10, A casa completa: Contratar a Lia · 8 coquetéis servidos num dia, 3 vezes (0 de 3)','a linha do objetivo, sem nada feito');
  g.save.equipe.lia=1; ok(g.capObj().itens[0].txt==='Lia contratada' && g.capObj().itens[0].ok,'com ela: "Lia contratada"');
  fecha(H,{ drinks:7 }); ok(g.save.capVezes===0,'7 coquetéis: não soma');
  g.save.dia++; fecha(H,{ drinks:8 }); ok(g.save.capVezes===1 && /\(1 de 3\)/.test(g.result.cap.itens[1].txt),'8 coquetéis: soma 1');
  g.save.dia++; fecha(H,{ drinks:12 }); g.save.dia++; fecha(H,{ drinks:8 });
  ok(g.save.capVezes===3 && g.result.cap.ok && g.save.conversa==='depois','3 dias: cap. 10 cumprido');
  ok(g.capLinha()==='Capítulo 10, A casa completa: ✓ Lia contratada · ✓ 8 coquetéis servidos num dia, 3 vezes (3 de 3)','a linha do objetivo cumprido'); }

// ---------- 5. capVezes zera; cartões de fim; a mudança ----------
{ const H=jogo(7,'avenida',{ conversa:'depois', capVezes:3, equipe:{ tonhao:3, dani:3, cami:1 } }), {g}=H;
  ok(g.avancaCap()===false && g.save.cap===8 && g.save.capVezes===0 && g.save.conversa==='antes','avancaCap: o cap. 8 começa e capVezes zera');
  ok(!g.mudancaVisivel,'cap. 8 na Avenida: a mudança para o Terraço ainda não aparece'); }
{ const H=jogo(8,'avenida',{ conversa:null, capFeito:0, bank:6000 }), {g,els}=H; notaDe(g,4.1,30); fecha(H);
  ok(g.save.conversa==='depois','(cap. 8 cumprido)'); els['btn-next'].fire('click'); passa(H);
  ok(g.save.cap===9 && mostra(els,'ov-continua') && els['cont-h'].textContent==='Fim dos capítulos da Avenida Brasil','fim do cap. 8: o cartão "Fim dos capítulos da Avenida Brasil"');
  ok(g.mudancaVisivel && g.proximoPonto.id==='terraco','cap. 9 à espera na Avenida: a mudança para o Terraço fica à mostra'); }
{ const H=jogo(11,'terraco',{ conversa:null, bank:3000 }), {g,els}=H; notaDe(g,4.7,30); g.save.capFeito=1; fecha(H); notaDe(g,4.7,30);
  ok(g.save.conversa==='depois' || (g.result.cap && g.result.cap.ok),'(cap. 11 cumprido)'); g.save.conversa='depois'; els['btn-next'].fire('click'); passa(H);
  ok(g.save.cap===12 && mostra(els,'ov-continua') && els['cont-h'].textContent==='Fim dos capítulos do Terraço Suíça','fim do cap. 11: o cartão "Fim dos capítulos do Terraço Suíça"'); }
{ const H=jogo(6,'industrial',{ conversa:null }); ok(H.g.mudancaVisivel,'cap. 6 na área industrial: a mudança para a Avenida aparece (como antes)');
  const H2=jogo(7,'avenida',{ conversa:null }); ok(!H2.g.mudancaVisivel,'cap. 7 na Avenida: nada de mudança'); }

// ---------- 6. saves da v10.5 ----------
{ const sv=(cap,ponto,x)=>({ histV:1, cap, dia:30, bank:3000, v10:1, conversa:null, salao:{ ponto }, capAzul:2, capFeito:1, ...(x||{}) });
  const n=(cap,ponto,x)=>L0.normSave(sv(cap,ponto,x));
  const a=n(6,'avenida'); ok(a.cap===6 && a.capV===2 && a.conversa===null && a.capAzul===2,'cap. 6 fica 6 (e capV passa a 2)');
  const b=n(7,'avenida'); ok(b.cap===7 && b.conversa==='antes' && b.capAzul===0 && b.capFeito===0 && b.capVezes===0,'cap. 7 → 7: o cap. novo da Avenida começa, com a conversa de antes e os contadores zerados');
  const c=n(8,'terraco'); ok(c.cap===9 && c.conversa===null && c.capAzul===2,'cap. 8 → 9 (Lá no alto), sem mexer no resto');
  const d=n(9,'terraco'); ok(d.cap===10 && d.conversa==='antes' && d.capAzul===0 && d.capFeito===0 && d.capVezes===0,'cap. 9 → 10: o cap. novo do Terraço começa, com a conversa de antes');
  const e=n(10,'terraco'); ok(e.cap===12 && e.conversa===null,'cap. 10 (o Fim) → 12');
  const e8=n(8,'avenida'); ok(e8.cap===9 && e8.conversa===null,'cap. 8 à espera na Avenida → 9 à espera');
  ok(n(7,'avenida').cap===7 && L0.normSave(n(7,'avenida')).cap===7 && L0.normSave(n(10,'terraco')).cap===12 && L0.normSave(n(8,'terraco')).cap===9 && L0.normSave(n(9,'terraco')).cap===10,'carregar de novo não converte outra vez');
  const f=n(8,'terraco',{ capV:2 }); ok(f.cap===8 && f.capVezes===0,'com capV 2, o cap. 8 é o 8 mesmo');
  const g=n(7,'avenida',{ conversa:'depois' }); ok(g.cap===8 && g.conversa==='depois','cap. 7 com a conversa de depois pendente: segue como o 8 (o antigo 7 cumprido)');
  const h=n(9,'terraco',{ conversa:'depois' }); ok(h.cap===11 && h.conversa==='depois','cap. 9 com a conversa de depois pendente: segue como o 11');
  const i=n(5,'industrial'); ok(i.cap===5 && i.convQuit===1 && i.convTeto===1,'save antigo acima do cap. 3: convQuit e convTeto entram como 1'); }

// ---------- 7. o modo dev ----------
{ const H=nova({ store:{ lcc2_dev:'1' } }), {g,L,els}=H; g.setDev(true); g.devReal(true); g.setState('menu');
  const C=L.DEV_CAPS;
  ok(C.length===12 && C.every((c,i)=>c.n===i+1),'DEV_CAPS: 12 linhas');
  const lin=(n,k)=>C[n-1][k];
  ok(lin(7,'dia')===34 && lin(7,'caixa')===1500 && lin(7,'eq').cami===0 && lin(7,'pdia')===30 && lin(7,'ponto')==='avenida','DEV_CAPS 7: dia 34, caixa 1500, Cami 0');
  ok(lin(8,'dia')===38 && lin(8,'caixa')===2500 && lin(8,'eq').cami===1,'DEV_CAPS 8: a 7 de antes, com dia 38');
  ok(lin(9,'dia')===50 && lin(9,'pdia')===50 && lin(9,'ponto')==='terraco' && lin(9,'caixa')===1500,'DEV_CAPS 9: a 8 de antes, com dia 50 e pdia 50');
  ok(lin(10,'dia')===54 && lin(10,'pdia')===50 && lin(10,'caixa')===4000 && lin(10,'eq').lia===0 && lin(10,'eq').anselmo===3,'DEV_CAPS 10: a 9 de antes, com dia 54, caixa 4000 e Lia 0');
  ok(lin(11,'dia')===58 && lin(11,'pdia')===50 && lin(11,'caixa')===6000 && lin(11,'eq').lia===1,'DEV_CAPS 11: a 9 de antes, com dia 58');
  ok(lin(12,'dia')===64 && lin(12,'pdia')===50 && lin(12,'eq')===null,'DEV_CAPS 12 (o Fim): dia 64');
  let erro=null; const caps=[];
  try{ for(let n=1;n<=12;n++){ ok(g.devCapitulo(n),'devCapitulo('+n+')'); caps.push(g.save.cap); } }catch(e){ erro=e; }
  ok(!erro && caps.join()==='1,2,3,4,5,6,7,8,9,10,11,12','os 12 saves se montam sem erro'+(erro?' ('+erro.message+')':''));
  g.devCapitulo(7); ok(g.save.equipe.cami===0 && g.save.libera.cami===2 && g.capObj().itens[0].txt==='Contratar a Cami' && g.save.conversa==='antes','dev 7: sem a Cami, com o cartão dela aberto e a conversa de antes');
  g.devCapitulo(10); ok(g.save.equipe.lia===0 && g.save.libera.lia===2 && g.capObj().itens[0].txt==='Contratar a Lia' && g.save.convExig===1,'dev 10: sem a Lia, com o cartão dela aberto');
  g.devCapitulo(9); ok(g.save.convExig===0,'dev 9 (Lá no alto): o exigente ainda não foi visto');
  g.devCapitulo(3); ok(g.save.convQuit===0 && g.save.convTeto===0,'dev 3: as conversas do cap. 3 ainda por vir');
  g.devCapitulo(4); ok(g.save.convQuit===1 && g.save.convTeto===1,'dev 4: já vistas');
  g.devCapitulo(3); g.devConversas('pend'); ok(g.save.convQuit==='pend' && g.save.convTeto==='pend','devConversas: pendentes inclui as duas novas');
  g.devConversas('vistas'); ok(g.save.convQuit===1 && g.save.convTeto===1,'devConversas: vistas inclui as duas novas');
  // o painel: botões 1 a 11 e o Fim
  g.setState('menu'); g.devCapitulo(1); L.DEV.aba='pular'; L.buildDev();
  const body=H.doc.getElementById('dev-body'); const botoes=[]; const colhe=e=>{ (e.children||[]).forEach(c=>{ if(c.tagName==='BUTTON') botoes.push(c.textContent); colhe(c); }); }; colhe(body);
  const nums=botoes.filter(t=>/^\d+$/.test(t) || t==='Fim');
  ok(nums.length===12 && nums.slice(0,11).every((t,i)=>t===String(i+1)) && nums[11]==='Fim','o painel do modo dev tem os botões 1 a 11 e o Fim ('+nums.join(',')+')'); }

console.log('smoke69: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
