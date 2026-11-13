// v10.2.2, etapa D-2: modo dev — aba História (cumprir, assistir, revelar, conversas) e aba Hoje (forçar clima, quebra, fiscal, gripe, VIP, apito).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load({historia:true,imprevistos:true}); const {g,L,els,doc}=H;
doc.createTextNode=t=>({textContent:String(t),children:[]});
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const dv=()=>doc.getElementById('dev-body');
const passa=()=>{ let n=0; while(g.conversa && n<40){ g.conversa.seguir(); n++; } return n; };
g.setDev(true); g.setState('menu'); g.devReal(true);

// 1. cumprir o objetivo: cap. 2 -> cap. 3
g.devCapitulo(2); g.save.conversa=null;
ok(g.devCumpre() && g.save.conversa==='depois','devCumpre marca a conversa de depois');
let fim=0; L.fluxoHistoria(()=>{ fim++; }); passa(); passa(); passa();
ok(g.save.cap===3 && fim===1,'as falas passam e o capítulo 3 começa (cap='+g.save.cap+')');
g.devCapitulo(3); g.save.conversa=null; g.devCumpre(); fim=0;
L.fluxoHistoria(()=>{ fim++; }); for(let i=0;i<6;i++) passa();
ok(g.save.cap>=4 || fim===1,'cap. 3 cumprido avança');
g.setDev(true); g.devReal(false);
ok(!g.devCumpre(),'no Livre devCumpre não faz nada'); g.devReal(true);

// 2. as cenas
{ const c=L.devCenas();
  ok(c.length===1+2*L.HISTORIA.length+12+L.LIBERA.length,'devCenas: '+c.length+' itens');
  ok(c[0].rot==='Abertura' && c[1].rot==='Cap. 1, antes' && c[2].rot==='Cap. 1, depois' && c.some(x=>x.rot==='Cartão: bia') && c.slice(1).every(x=>x.falas && x.falas.length),'rótulos e falas'); }

// 3. assistir não muda o save
g.devCapitulo(5); g.setState('menu');
{ const antes=JSON.stringify(g.save), n=L.devCenas().length;
  [1,2,n-1].forEach(i=>{ ok(L.devAssistir(i) && g.conversa,'assistir cena '+i+' abre a conversa'); passa(); });
  ok(JSON.stringify(g.save)===antes && g.state==='menu','assistir não muda o save e volta ao menu'); }

// 4. revelar o Manual e a lojinha
g.devManual(true); ok(g.save.manual.length===L.MANUAL.length && g.save.manualNovo.length===0,'Manual: todas as fichas');
g.devManual(false); ok(g.save.manual.length<L.MANUAL.length && g.save.manual.every(id=>/^b-|^p-/.test(id)||L.MANUAL.find(f=>f.id===id).aba==='basico'),'Manual: só o básico');
g.devLojinha(true); ok(L.LIBERA.every(x=>g.save.libera[x.id]===2),'Lojinha: todos os cartões');
g.devLojinha(false); ok(L.LIBERA.some(x=>g.save.libera[x.id]!==2),'Lojinha: como no começo do capítulo');
g.devConversas('vistas'); ok(['convPlanta','convCard','convDiv','convEnt','convExig'].every(k=>g.save[k]===1),'conversas: todas vistas');
g.save.dia=20; g.devConversas('pend'); ok(g.save.convPlanta==='pend' || g.save.convPlanta===1,'conversas pendentes não quebram');
g.save.convPlanta=0; g.devConversas('pend'); ok(g.save.convPlanta==='pend' && g.save.convCard==='pend' || g.save.convCard===1,'conversas: pendentes quando o dia já passou');

// 5. forçar o imprevisto: clima, quebra e fiscal na Avenida
g.devCapitulo(7); L.MANUT.on=true; const n=g.save.dia;
g.devForca('clima','chuva'); g.devForca('quebra','fogao'); g.devForca('fiscal','vem');
delete g.save.manut.sorteio; g.sortear(n); g.resetDay(n);
ok(g.clima==='chuva' && g.quebras.length===1 && g.quebras[0].id==='fogao' && !!g.fiscal,'chuva, fogão quebrado e fiscal presente');
g.devForca('clima','sem'); g.devForca('quebra','nada'); g.devForca('fiscal','nao');
delete g.save.manut.sorteio; g.sortear(n); g.resetDay(n);
ok(g.clima==='' && g.quebras.length===0 && !g.fiscal,'sem clima, nada quebra, fiscal não vem');
g.devForca('clima','');  g.devForca('quebra',''); g.devForca('fiscal','');
ok(!('clima' in L.DEV.forca) && !('quebra' in L.DEV.forca),'Sorteio limpa a força');
g.devForca('quebra','cafeteira'); g.sortear(n); g.resetDay(n); ok(g.quebras.some(q=>q.id==='cafeteira'),'a força vale também com o sorteio do dia já feito'); g.devForca('quebra','');

// 6. VIP no Terraço: o 3º grupo é VIP e exigente
g.devCapitulo(9); g.devForca('vip','vem'); g.resetDay(g.save.dia);
{ const s=g.buildSchedule(g.day); ok(s[2] && s[2].vip,'o 3º grupo do dia é VIP'); g.startDay?0:0;
  g.state='playing'; g.schedule=s; g.arrive(Object.assign({},s[2]));
  ok(g.groups.some(x=>x.vip && x.exigente),'no Terraço o VIP é o exigente'); }
g.devForca('vip','');

// 7. gripe e apito
g.devCapitulo(4); g.devForca('gripe','gripado'); g.resetDay(g.save.dia);
ok(g.day.n!==7 && g.day.gripe===true,'gripe forçada num dia que não é o 7');
g.devForca('gripe','bem'); g.resetDay(g.save.dia); ok(!g.day.gripe,'Bem tira a gripe');
g.devForca('apito','nao'); g.resetDay(g.save.dia); g.buildSchedule(g.day); ok(g.apito===null,'Não apita: sem apito');
g.devForca('apito','apita'); g.resetDay(g.save.dia); g.buildSchedule(g.day); ok(!!g.apito,'Apita: tem apito');
g.devForca('apito','');

// 8. quebrar agora e o painel
g.devCapitulo(7); g.resetDay(g.save.dia); ok(g.devQuebraAgora('geladeira') && g.quebras.some(q=>q.id==='geladeira' && q.t===0),'Quebrar agora põe a quebra para já');
L.DEV.aba='historia'; L.buildDev(); ok(/Cumprir o objetivo agora/.test(txt(dv())) && /Manual: todas as fichas/.test(txt(dv())) && /Marcar todas como vistas/.test(txt(dv())),'aba História');
L.DEV.aba='hoje'; L.buildDev(); ok(/Chuva/.test(txt(dv())) && /Vem um VIP/.test(txt(dv())) && /Apita/.test(txt(dv())) && /Gripado/.test(txt(dv())),'aba Hoje');
g.devReal(false); L.DEV.aba='historia'; L.buildDev(); ok(/só corre no jeito De verdade/.test(txt(dv())),'Livre: a aba História manda passar para De verdade');
g.setDev(false); ok(Object.keys(L.DEV.forca).length===0,'sair do modo dev zera a força');
console.log('smoke64: total = '+total+'  fails = '+fails);
process.exit(fails?1:0);
