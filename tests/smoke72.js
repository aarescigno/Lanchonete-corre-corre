// v10.7, etapa 4b: o nível de luxo (0 a 5, cinco barras), a aba Luxo, os 5 enfeites e 4 degraus de mesa novos, mais VIPs, exigentes na Avenida e o Ambiente do Gurugol.
// CA1 pontos na Garagem; CA2 tudo comprado em cada ponto; CA3 a escada de móveis; CA4 a nota de Ambiente; CA5 a chance de VIP; CA6 exigentes na Avenida;
// CA7 a aba Luxo; CA8 o save; CA9 o modo dev.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const acha=(e,cls,out=[])=>{ if((e.className||'').split(' ').indexOf(cls)>=0) out.push(e); (e.children||[]).forEach(c=>acha(c,cls,out)); return out; };
const nova=o=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const jogo=(ponto,sv,dia)=>{ const H=nova(), {g,L}=H; const n=dia||10;
  g.save=L.normSave(Object.assign({ histV:1, cap:8, dia:n, maxDay:n, bank:9000, v10:1, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, salao:{ ponto } }, sv||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(n); return H; };
const loja=(H,grupo,aba)=>{ H.L.setShopGrupo(grupo); H.L.setShopTab(aba); return txt(H.doc.getElementById('shop-grid')||{}); };
const gridDe=H=>H.doc.getElementById('shop-grid');
const NIV={ garagem:1, industrial:2, avenida:3, terraco:4 };
/* tudo comprado e ligado no ponto, a nota no teto e as redes sociais */
const tudo=(H,ponto)=>{ const {g,L}=H, sv=g.save, pn=NIV[ponto];
  const d={}; L.DECOR.forEach(x=>{ if(!x.nivel||pn>=x.nivel) d[x.id]=1; }); sv.decor=L.normDecor(d);
  const mv={}; L.MOVEIS.forEach(m=>{ if(pn>=m.nivel) mv[m.id]=1; }); sv.moveis=L.normMoveis(mv);
  sv.salao.mesas.concat(sv.salao.estoque||[]).forEach(m=>{ m.t=1; });
  const eq=sv.equipe; if(pn===1){ eq.tv=true; eq.som=true; } if(pn===2){ g.up.tvs=true; eq.tvs=2; } if(pn===3) eq.couvert=1; if(pn===4) eq.musica=2;
  g.up.assento=['','','banco','sofa','poltrona'][pn]||undefined; if(pn===1) delete g.up.assento; if(pn===4) g.up.louca=true;
  const teto=L.avalTeto(g.ponto); sv.aval=Array.from({length:10},()=>[teto,teto,teto,teto,teto]);
  g.div=L.divulgaOf('redes'); return L.luxoPts(g); };

// ---------- 1. a Garagem: vazia e com tudo (CA1) ----------
{ const H=jogo('garagem'), {g,L}=H; g.mode='carreira'; g.div=L.divulgaOf('boca');
  const v=L.luxoPts(g); ok(['end','dec','mov','amb','fama','tot'].every(k=>v[k]===0) && L.luxoNivel(g)===0,'save vazio na Garagem: tudo 0 e nível 0 ('+JSON.stringify(v)+')');
  const t=tudo(H,'garagem'); ok(JSON.stringify(t)==='{"end":0,"dec":10,"mov":6,"amb":4,"fama":5,"tot":25}' && L.luxoNivel(g)===1,'Garagem com tudo: end 0, dec 10, mov 6, amb 4, fama 5, tot 25, nível 1 ('+JSON.stringify(t)+')');
  ok(L.LUXO.endereco.join()==='0,10,20,40' && L.LUXO.pede.join()==='20,40,60,90' && L.LUXO.vip===0.1 && L.LUXO.exigAv===0.25,'LUXO: endereço 0,10,20,40; pede 20,40,60,90; vip 0,1; exigAv 0,25'); }

// ---------- 2. tudo comprado em cada ponto (CA2) ----------
{ const alvo={ industrial:[44,2], avenida:[64,3], terraco:[100,5] };
  for(const p of ['industrial','avenida','terraco']){ const H=jogo(p), {g,L}=H; g.mode='carreira'; const v=tudo(H,p);
    ok(v.tot===alvo[p][0] && L.luxoNivel(g)===alvo[p][1],p+': tudo comprado dá '+alvo[p][0]+' (nível '+alvo[p][1]+') — deu '+v.tot+' '+JSON.stringify(v)); }
  const H=jogo('avenida'), {g,L}=H; const v=tudo(H,'avenida'); g.save.decor.quadros=0; const w=L.luxoPts(g);
  ok(w.dec===v.dec-2 && w.tot===v.tot-2,'enfeite guardado não conta (quadros de artista: −2)');
  const novos=['pisca','chita','luminaria','quadros','lustre'].map(id=>L.decorOf(id));
  ok(novos.map(d=>d.cost).join()==='30,25,180,450,1500' && novos.map(d=>d.nivel).join()==='1,1,2,3,4' && novos.every(d=>d.lux===2 && d.grupo==='enfeites') && L.DECOR.filter(d=>!d.grupo||d.grupo!=='enfeites').every(d=>d.lux===1),'os 5 enfeites novos (preço, ponto, 2 pontos) e os 15 antigos com 1');
  ok(L.DECOR_GRUPOS.some(x=>x.id==='enfeites' && x.nome==='Enfeites'),'grupo Enfeites');
  const f=L.AVAL_DECOR; ok(f.pisca==='Que luzinhas mais charmosas!' && f.chita==='Adorei a cortina de chita!' && f.luminaria==='As luminárias dão um charme!' && f.quadros==='Que quadros bonitos!' && f.lustre==='Que lustre maravilhoso!','os elogios dos enfeites novos'); }

// ---------- 3. a escada de móveis (CA3) ----------
{ const H=jogo('industrial'), {g,L}=H; g.mode='carreira'; const b0=g.save.bank;
  ok(g.buyMovel('acolch')===false && !g.save.moveis.acolch,'sem as mesas de madeira, as cadeiras acolchoadas não se compram');
  ok(g.buyMovel('madeira')===true && g.save.moveis.madeira===1 && g.save.bank===b0-200,'mesas de madeira: R$ 200 descontados');
  const m0=L.luxoPts(g).mov; ok(g.buyMovel('acolch')===true && g.save.bank===b0-200-350 && L.luxoPts(g).mov===m0+2,'cadeiras acolchoadas: R$ 350 e +2 na barra Móveis');
  ok(g.buyMovel('linho')===false,'o linho é do ponto de nível 3 em diante (a área industrial é 2)');
  const G=jogo('garagem'); ok(G.g.buyMovel('madeira')===true && G.g.buyMovel('acolch')===false,'na Garagem só o 1º degrau; o 2º é do nível 2');
  // vai junto na mudança
  g.trocaPonto(L.PONTOS[2]); ok(g.save.moveis.madeira===1 && g.save.moveis.acolch===1 && g.ponto.id==='avenida','a mudança leva o jogo de mesas junto');
  g.buyMovel('linho'); ok(g.save.moveis.linho===1 && g.save.salao.mesas.every(m=>!m.t),'(linho comprado, mesas sem toalha xadrez)');
  const v=L.luxoPts(g); ok(v.mov===3+3+2+2,'com o linho a toalha conta 3 cheio, sem xadrez em mesa nenhuma (mov '+v.mov+')');
  ok(L.MOVEIS.map(m=>m.id).join()==='madeira,acolch,linho,marmore' && L.MOVEIS.map(m=>m.cost).join()==='200,350,600,2000' && L.MOVEIS.map(m=>m.nivel).join()==='1,2,3,4' && L.MOVEIS.map(m=>m.lux).join()==='3,2,2,4','MOVEIS: preços, pontos e luxo');
  // a toalha xadrez: 3 × mesas com toalha ÷ mesas
  const T=jogo('garagem'); T.g.mode='carreira'; const ms=T.g.save.salao.mesas; ms.forEach((m,i)=>{ m.t=i<Math.floor(ms.length/2)?1:0; });
  const cx=T.L.luxoPts(T.g).mov; ok(cx===Math.round(3*Math.floor(ms.length/2)/ms.length),'a toalha xadrez conta 3 × mesas com toalha ÷ mesas ('+cx+')'); }

// ---------- 4. a nota de Ambiente (CA4) ----------
{ const amb=(H,fn)=>{ const {g}=H; g.mode='carreira'; g.startDay(10); g.begin(); const gr=g.spawn({type:'estudante',color:0,vip:false,av:true}); gr.perdFila=0; gr.perdMesa=0; gr.pratoQ=4; gr.semVeg=false; gr.coffee=false; if(fn) fn(g,gr); const n=g.avals.length; g.avaliar(gr,0,0); return g.avals[n].s[4]; };
  const mk=(pts)=>{ const H=jogo('garagem'), {g,L}=H; const ids=['espada','lata','samambaia','foto','giz','placa','pisca','chita'], d={}; let t=0; ids.forEach(id=>{ if(t<pts){ d[id]=1; t+=L.decorOf(id).lux; } }); g.save.decor=L.normDecor(d); return H; };
  { const H=mk(10); ok(H.L.luxoPts(H.g).tot===10,'(10 pontos de luxo montados)'); ok(amb(H)===3.5,'Garagem, 10 pontos, sem café, doce, drink, selo nem lixeira: Ambiente 3,5'); }
  { const H=mk(10); ok(amb(H,g=>{ g.trash=H.L.TRASH.cap; })===2.5,'com a lixeira cheia, 1 a menos (2,5)'); }
  { const H=mk(10); const {g,L}=H; g.save.decor=L.normDecor({}); ok(amb(H)===2,'sem luxo nenhum: o Ambiente é a base, 2'); }
  { const H=mk(10); const {g,L}=H; g.save.decor=L.normDecor(Object.fromEntries(L.DECOR.filter(d=>!d.nivel||d.nivel<=1).map(d=>[d.id,1]))); ok(L.luxoPts(g).tot>=10 && amb(H)>=3.5,'com mais enfeites, sobe'); }
  { const H=jogo('garagem'), {g,L}=H; tudo(H,'garagem'); g.save.salao.mesas.forEach(m=>{ m.t=1; }); ok(L.luxoPts(g).tot>=20 && amb(H)===5,'com 20 pontos ou mais, Ambiente 5'); }
  { const H=jogo('garagem'), {g,L}=H; tudo(H,'garagem'); ok(amb(H,g=>{ g.trash=H.L.TRASH.cap; })===4,'com 20 ou mais e a lixeira cheia: 4'); }
  { const H=jogo('garagem'), {g,L}=H; g.save.equipe.tv=true; g.save.equipe.som=true; g.up.ventilador=true; g.maquinaOn=true; const v=L.luxoPts(g); ok(v.amb===4 && L.AVAL.amb.base===2,'a TV e o som entram pelo luxo (4 pontos), não mais pela soma');
    const a1=amb(H); ok(Math.abs(a1-(2+3*4/20))<0.051,'Garagem com TV e som (4 pontos): Ambiente '+a1+' (2,6); o ventilador e a máquina não somam mais'); }
  { const H=jogo('terraco'), {g,L}=H; const v=tudo(H,'terraco'); ok(amb(H)===5,'no Terraço com tudo, 5 (pede 90, tem '+v.tot+')'); } }

// ---------- 5. a chance de VIP (CA5) ----------
{ const H=jogo('avenida'), {g,L}=H; g.mode='carreira'; const day=g.day||L.DAYS[9]; L.DEV.on=true;
  L.DEV.forca.luxo=0; const p0=g.vipChance(day); L.DEV.forca.luxo=3; const p3=g.vipChance(day); L.DEV.forca.luxo=5; const p5=g.vipChance(day); L.DEV.forca={}; L.DEV.on=false;
  ok(p0>0 && Math.abs(p3/p0-1.3)<1e-9 && Math.abs(p5/p0-1.5)<1e-9,'a vipP com luxo 3 é 1,3× a do nível 0 (e 1,5× com 5): '+(p3/p0).toFixed(3)+' e '+(p5/p0).toFixed(3));
  const G=jogo('garagem'); G.g.mode='carreira'; G.L.DEV.on=true; G.L.DEV.forca.luxo=5; const q5=G.g.vipChance(G.g.day); G.L.DEV.forca.luxo=0; const q0=G.g.vipChance(G.g.day); G.L.DEV.forca={}; G.L.DEV.on=false;
  ok(q5===q0,'na Garagem (ponto sem VIP) o luxo não muda nada'); }

// ---------- 6. exigentes na Avenida (CA6) ----------
{ const conta=(nivel)=>{ const H=jogo('avenida'), {g,L}=H; g.mode='carreira'; g.startDay(10); L.DEV.on=true; L.DEV.forca.luxo=nivel; let vip=0, exg=0;
    for(let k=0;k<400;k++){ const day=Object.assign({},g.day,{ vip:1 }); const sch=g.buildSchedule(day); sch.forEach(s=>{ if(s.vip){ vip++; if(s.exig) exg++; } }); if(vip>=400) break; }
    L.DEV.forca={}; L.DEV.on=false; return { vip, exg, f:exg/Math.max(1,vip) }; };
  const a=conta(3), b=conta(2);
  ok(a.vip>=400 && a.f>=0.20 && a.f<=0.30,'luxo 3 na Avenida: '+Math.round(a.f*1000)/10+'% dos '+a.vip+' VIPs vêm exigentes (20 a 30%)');
  ok(b.vip>=400 && b.exg===0,'luxo 2: nenhum VIP exigente ('+b.exg+')');
  const H=jogo('avenida'), {g,L}=H; g.mode='carreira'; g.startDay(10); g.begin(); const gr=g.spawn({type:'executiva',color:0,vip:true,av:true,exig:true});
  ok(gr.exigente===true && gr.vip,'o grupo com s.exig é exigente');
  const gn=g.spawn({type:'executiva',color:0,vip:true,av:true}); ok(gn.exigente===false,'sem s.exig, na Avenida, o VIP é comum');
  const T=jogo('terraco'), tg=T.g; tg.mode='carreira'; tg.startDay(10); tg.begin(); ok(tg.spawn({type:'casal',color:0,vip:true,av:true}).exigente===true,'no Terraço continua todo VIP exigente'); }

// ---------- 7. a aba Luxo (CA7) ----------
{ const H=jogo('garagem'), {g,L}=H; const sec=L.shopSecoes()[0];
  ok(sec.includes('luxo') && !sec.includes('decor'),'grupo Lanchonete: a seção luxo existe e a decor não ('+sec.join()+')');
  const t=loja(H,'lanchonete','luxo'); const bar=acha(gridDe(H),'luxo-b');
  ok(bar.length===5 && /Endereço/.test(t) && /Decoração/.test(t) && /Móveis/.test(t) && /Ambiente/.test(t) && /Fama/.test(t) && /Luxo 0/.test(t),'o quadro: "Luxo 0" e as 5 barras (Endereço, Decoração, Móveis, Ambiente e Fama)');
  ok(!/\d+\s*\/\s*\d+/.test(txt(acha(gridDe(H),'luxo-quadro')[0])),'o quadro sem números de pontos');
  ok(/Samambaia/.test(t) && /Pisca-pisca/.test(t) && /Cortina de chita/.test(t) && !/Luminárias/.test(t) && /Mesas de madeira/.test(t),'cartões: enfeites do ponto (pisca-pisca e chita na Garagem, luminárias não) e o 1º degrau de mesa');
  ok(/TV e som/.test(t) && !/Couvert/.test(t) && !/Música ao vivo/.test(t),'Garagem: TV e som na aba Luxo');
  ok(!/TV e som/.test(loja(H,'lanchonete','melhorias')) && !/Couvert/.test(loja(H,'lanchonete','divulga')),'e não em Melhorias nem em Divulgação');
  ok(!/TV e som/.test(loja(H,'equipe','bia')) && !/TV e som/.test(loja(H,'equipe','tonhao')),'nem na Equipe'); }
{ const H=jogo('industrial'); const t=loja(H,'lanchonete','luxo'); ok(/televisores/.test(t) && /Luminárias de fábrica/.test(t),'área industrial: as TVs e as luminárias na aba Luxo'); ok(!/televisores/.test(loja(H,'lanchonete','melhorias')) && /Assento|assento|Cadeirinhas|Banquinhos/.test(loja(H,'lanchonete','melhorias')),'e não em Melhorias (o assento da espera fica lá)'); }
{ const H=jogo('avenida'); const t=loja(H,'lanchonete','luxo'); ok(/Couvert artístico/.test(t) && /Quadros de artista/.test(t),'Avenida: o couvert e os quadros na aba Luxo'); ok(!/Couvert artístico/.test(loja(H,'lanchonete','divulga')),'e não em Divulgação'); }
{ const H=jogo('terraco'); const t=loja(H,'lanchonete','luxo'); ok(/Música ao vivo/.test(t) && /Lustre de cristal/.test(t) && /Mesas de madeira/.test(t),'Terraço: a música e o lustre na aba Luxo'); ok(!/Música ao vivo/.test(loja(H,'lanchonete','divulga')),'e não em Divulgação');
  const {g,L}=H; const b=g.save.bank; ok(g.buyDecor('lustre') && g.save.bank===b-1500 && g.save.decor.lustre===1,'comprar o lustre (R$ 1.500)');
  ok(/Mesas de madeira/.test(loja(H,'lanchonete','luxo')),'o cartão de móveis mostra o 1º degrau; comprado, o próximo'); g.buyMovel('madeira'); ok(/Cadeiras acolchoadas/.test(loja(H,'lanchonete','luxo')),'comprada a madeira, o cartão vira o das cadeiras acolchoadas'); }
{ const H=jogo('garagem'); H.g.save.moveis.madeira=1; ok(!/Mesas de madeira/.test(loja(H,'lanchonete','luxo')) || /Já comprado/.test(loja(H,'lanchonete','luxo')),'sem o degrau seguinte no ponto, o cartão mostra o degrau mais alto como já comprado'); }
{ const H=jogo('garagem'); const o=H.g.save.manual.length; loja(H,'lanchonete','luxo'); ok(H.g.save.manual.indexOf('l-luxo')>=0 && L_ficha(H),'a ficha l-luxo é revelada ao abrir a aba'); }
function L_ficha(H){ const f=H.L.MANUAL.find(x=>x.id==='l-luxo'); return !!f && f.nome==='Luxo' && /mais VIPs/.test(f.linha) && !H.L.MANUAL.some(x=>x.id==='l-decor'); }

// ---------- 8. o save (CA8) ----------
{ const H=nova(), {L}=H; const sv=L.normSave({ dia:12, maxDay:12, bank:500, v10:1, decor:{ espada:1, foto:0 }, salao:{ ponto:'industrial' }, libera:{ decor:1 }, manual:['l-decor','l-salao'] });
  ok(JSON.stringify(sv.moveis)==='{"madeira":0,"acolch":0,"linho":0,"marmore":0}' && sv.decor.espada===1 && sv.decor.foto===0,'save da v10.6 (sem moveis): moveis vazio e o mesmo decor');
  ok(JSON.stringify(L.normMoveis({ acolch:1 }))==='{"madeira":0,"acolch":0,"linho":0,"marmore":0}','normMoveis({ acolch:1 }) zera o acolch (sem o degrau anterior)');
  ok(JSON.stringify(L.normMoveis({ madeira:1, acolch:1, marmore:1, lixo:1 }))==='{"madeira":1,"acolch":1,"linho":0,"marmore":0}','normMoveis: só os ids de MOVEIS, em escada');
  ok(sv.libera.luxo===1 && sv.libera.decor===undefined,'a liberação da Decoração vira a do Luxo');
  ok(sv.manual.indexOf('l-luxo')>=0 && sv.manual.indexOf('l-decor')<0,'quem tinha visto a ficha da Decoração vê a do Luxo');
  const s2=L.normSave(JSON.parse(JSON.stringify(Object.assign({},sv,{ moveis:{ madeira:1, acolch:1 } })))); ok(s2.moveis.madeira===1 && s2.moveis.acolch===1,'o save guarda os móveis');
  ok(Object.keys(sv).indexOf('luxo')<0,'o luxo não vai no save'); }

// ---------- 9. o modo dev (CA9) ----------
{ const H=jogo('terraco'), {g,L}=H; g.mode='carreira'; g.setDev(true); g.devPonto('terraco'); L.DEV.forca.luxo=4; ok(L.luxoNivel(g)===4,'DEV.forca.luxo = 4: luxoNivel dá 4');
  ok(g.devLuxo(2)===true && L.DEV.forca.luxo===2 && L.luxoNivel(g)===2 && g.devLuxo(null) && L.DEV.forca.luxo===undefined,'o botão do luxo (devLuxo): força 2 e volta ao normal');
  L.DEV.forca.luxo=5; L.buildDev && 0; g.devLuxo(null);
  const b=g.save.bank; g.devLuxoTudo(); const v=L.luxoPts(g);
  ok(g.save.bank===b && v.dec===25 && v.mov>=3+3+2+2+4 && g.save.moveis.marmore===1,'"Tudo do luxo": Decoração no máximo (25) e todos os móveis do Terraço, sem mexer no caixa ('+JSON.stringify(v)+')');
  const G=jogo('garagem'); G.g.setDev(true); G.g.devLuxoTudo(); ok(G.g.save.moveis.madeira===1 && !G.g.save.moveis.acolch && G.L.luxoPts(G.g).dec===10,'na Garagem, só o que é da Garagem');
  L.DEV.on=true; L.DEV.aba='hoje'; L.buildDev(); const t=txt(H.doc.getElementById('dev-body')||H.doc.getElementById('dev-panel')||{}); ok(/Luxo/.test(t),'a aba Hoje do painel tem a linha Luxo');
  L.DEV.aba='equipe'; L.buildDev(); ok(/Tudo do luxo/.test(txt(H.doc.getElementById('dev-body')||H.doc.getElementById('dev-panel')||{})),'a aba Equipe e lojinha tem "Tudo do luxo"'); L.DEV.on=false; }

console.log('total',total,'fails =',fails);
process.exit(fails?1:0);
