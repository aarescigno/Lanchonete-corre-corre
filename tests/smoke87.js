// v11.12: a conversa da 1ª nota baixa (estrelas do fim da fase 2 ou menos, ou nota do dia no Gúgou de 2,0 ou menos com 3 ou mais avaliações): a Bia desabafa, o Tonhão consola. Só na 1ª vez, só no Modo História.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const toque=els=>els['c'].fire('pointerdown',{preventDefault(){},pointerId:1,clientX:300,clientY:200,pointerType:'mouse'});
const passa=H=>{ let n=0; while(H.g.conversa && n<20){ toque(H.els); n++; } return n; };
const nova=(hist,sv)=>{ const H=load(hist?{historia:true,notaBaixa:true}:{notaBaixa:true}), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ histV:hist?1:0, cap:2, dia:6, maxDay:6, bank:3000, up:{ tenis:true }, equipe:{ tonhao:1, dani:1 }, convCard:1, convDiv:1, convEnt:1, convPlanta:1, convQuit:1, convTeto:1 },sv||{}));
  L.ARCO.forEach(A=>{ g.save.arco[A.id]=1; });   // as do arco ficam fora: o teste olha só a da nota
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.save.conversa=null; g.goShop(6); g.startDay(6); H.els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.queue=[]; return H; };
// est: as estrelas do dia (3 por padrão, para o teste do Gúgou valer sozinho): 0 sem a meta, 1 na meta, 2 acima do bom, 3 no expert
const fecha=(H,v,n,est)=>{ const {g}=H; est=est==null?3:est; g.avals=Array.from({length:n},()=>({ r:[v,v,v,v,v], s:[v,v,v,v,v], txt:'x', k:'casal', v:false, x:1 })); g.custo=0; g.stats.lost=0; const d=g.day; d.meta=100; d.expert=200; g.money=[0,100,150,200][est]+g.fixo;   // lucro = dinheiro − custo − fixo
   g.finishDay(); };

// ---------- CA1, CA2: a 1ª nota baixa ----------
{ const H=nova(true), {g,L}=H;
  ok(g.save.convNota===0,'CA1: antes de qualquer nota baixa, convNota é 0');
  fecha(H,2,3);
  ok(g.save.convNota==='pend' && !!g.conversa,'CA1: dia com nota 2,0 (3 avaliações): fica pendente e a conversa toca no fim do dia');
  const n=passa(H); ok(n===4 && g.save.convNota===1 && !g.conversa,'CA2: a conversa tem 4 falas e depois vai a 1 ('+n+')');
  const f=L.HIST_NOTA.falas; ok(f.length===4 && f.map(x=>x.q).join()==='bia,tonhao,tonhao,bia','CA2: HIST_NOTA: Bia, Tonhão, Tonhão, Bia');
  ok(/esforcei tanto/.test(f[0].s.normalize('NFD').replace(/[̀-ͯ]/g,'')) && /É a vida/.test(f[1].s) && /melhorar/.test(f[2].s),'CA2: os textos pedidos (esforço, "É a vida", melhorar a cada dia)');
  // CA3: depois de vista, uma nota baixa nova não toca de novo
  g.save.dia=g.save.dia; g.avals=[]; g.state='playing'; g.ending=false; g.groups=[]; g.queue=[]; g.save.conversa=null; fecha(H,1,4);
  ok(g.save.convNota===1 && !g.conversa,'CA3: depois de vista, outra nota baixa não toca de novo'); }

// ---------- as estrelas do fim da fase: 0, 1 e 2 disparam (com a nota do Gúgou boa), 3 não ----------
for(const est of [0,1,2]){ const H=nova(true), {g}=H; fecha(H,4,4,est); ok(g.save.convNota==='pend' && !!g.conversa,'CA6: dia de '+est+' estrela(s) com nota 4,0 no Gúgou dispara'); }
{ const H=nova(true), {g}=H; fecha(H,4,4,3); ok(g.save.convNota===0 && !g.conversa,'CA6: dia de 3 estrelas e nota 4,0 não dispara'); }
{ const H=nova(true), {g}=H; fecha(H,4,0,3); ok(g.save.convNota===0,'CA6: sem avaliações e com 3 estrelas, não dispara'); }
{ const H=nova(true), {g}=H; fecha(H,4,4,1); passa(H); g.state='playing'; g.ending=false; g.groups=[]; g.queue=[]; g.save.conversa=null; fecha(H,4,4,0); ok(g.save.convNota===1 && !(g.conversa && g.conversa.falas===H.L.HIST_NOTA.falas),'CA6: depois de vista pelas estrelas, outro dia fraco não toca de novo'); }

// ---------- CA3: nota acima de 2,0, ou poucas avaliações, não dispara ----------
{ const H=nova(true), {g}=H; fecha(H,2.1,4); ok(g.save.convNota===0 && !g.conversa,'CA3: nota 2,1 não dispara'); }
{ const H=nova(true), {g}=H; fecha(H,1,2); ok(g.save.convNota===0 && !g.conversa,'CA3: só 2 avaliações não disparam'); }
{ const H=nova(true), {g}=H; fecha(H,2,3); ok(g.save.convNota==='pend','CA3: 2,0 com 3 avaliações dispara (limite)'); }

// ---------- CA4: sem o Modo História, nada; o save ----------
{ const H=nova(false), {g,L}=H; fecha(H,1,4); ok(!g.save.convNota && !g.conversa,'CA4: sem o Modo História, nenhuma conversa');
  ok(L.normSave({ convNota:'x' }).convNota===0 && L.normSave({ convNota:'pend' }).convNota==='pend' && L.normSave({ convNota:1 }).convNota===1,'CA4: normSave normaliza convNota');
  ok(L.normSave({ dia:12 }).convNota===0,'CA4: save antigo carrega com convNota 0'); }

// ---------- CA5: o modo dev ----------
{ const H=nova(true,{ cap:3 }), {g,L}=H; ok(L.devCenas().some(c=>c.rot==='Nota baixa, 1ª vez' && c.falas===L.HIST_NOTA.falas),'CA5: devCenas tem "Nota baixa, 1ª vez"');
  L.DEV.on=true; g.devConversas('pend'); ok(g.save.convNota==='pend','CA5: devConversas(pend) deixa pendente'); g.devConversas('vistas'); ok(g.save.convNota===1,'CA5: devConversas(vistas) marca vista'); L.DEV.on=false; }

console.log(fails?`\n${fails} falha(s) de ${total}`:`\ntodos os ${total} ok`); process.exit(fails?1:0);
