// v12.2 (etapa 14a): o Teste de habilidade, só no modo dev: quatro fases padrão (uma por ponto) com os mesmos clientes, as medidas do jeito de jogar e o relatório.
// CA1 a CA6 (o CA7, o bot nas quatro fases, é o `TESTE=<id> node balance.js 20`; o CA8, a tela nos 14 tamanhos, é o `python3 menu_fit.py paineis`).
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const perto=(a,b,tol)=>Math.abs(a-b)<=(tol==null?0.07:tol);
const IDS=['garagem','industrial','avenida','terraco'], NOMES=['Garagem','Área industrial','Avenida Brasil','Terraço Suíça'], DIAS=[7,17,38,58], PONTOS=['garagem','industrial','avenida','terraco'], SEM=[7001,7002,7003,7004];
// o save de verdade (cap 15, no Terraço, com a carreira andada): o teste não pode mexer em nada dele
const REAL={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1, desafios:{ soBia:2 } };
const mk=(extra,opts)=>load(Object.assign({ store:Object.assign({ lcc2_save:JSON.stringify(REAL) },extra||{}) },opts||{}));
// um dia roteirizado: a agenda fica com um grupo que só chega muito depois (o dia não acaba sozinho), sem ninguém na casa
const roteiro=(g,id)=>{ g.startTeste(id); g.begin(); g.schedule=[{ t:1e6, type:'familia', color:0, vip:false }]; g.nextIdx=0; g.groups=[]; g.queue=[]; return g; };
const fam=g=>g.spawn({ type:'familia', color:0, vip:false, av:false });
const mesa=(g,grp)=>g.tables.find(q=>q.free&&q.seats>=grp.size);
const semHelp=g=>{ ['dani','joca','cami','anselmo','lia'].forEach(q=>{ g.save.equipe[q]=0; }); };
const salva=store=>{ const o=Object.assign({},store); delete o['lcc-teste']; return JSON.stringify(o); };   // o localStorage sem a chave do teste

// ---------- CA1: fora do modo dev nenhuma tela mostra o teste; no painel, a seção com o nome e os 4 botões ----------
bloco('CA1',()=>{
  { const {L,els,g}=mk(); L.buildMenu(); L.buildDesafios(); const sem=Object.keys(els).filter(k=>/Teste de habilidade|LCC-TESTE/.test(txt(els[k])));
    ok(sem.length===0,'CA1: fora do modo dev, nem o menu nem a tela de Desafios falam do Teste de habilidade ('+sem.join()+')');
    ok(L.TESTES.map(x=>x.id).join()===IDS.join() && L.TESTE_LS==='lcc-teste','CA1: TESTES tem as quatro fases, na ordem, e a chave lcc-teste'); }
  { const {L,els,g,store}=mk(); g.setDev(true); g.devReal(true); L.abrirDev(); L.DEV.aba='pular'; L.buildDev();
    const corpo=els['dev-body'], bt=()=>todos(corpo,n=>n.tagName==='BUTTON'), inp=()=>todos(corpo,n=>n.id==='dev-teste-nome')[0];
    ok(/Teste de habilidade/.test(txt(corpo)),'CA1: no painel do modo dev, a seção "Teste de habilidade"');
    ok(inp() && inp().tagName==='INPUT' && inp().maxLength===16,'CA1: o campo do nome (16 letras, como o do Ranking)');
    ok(NOMES.every((n,i)=>bt().some(b=>b.textContent===n+' (0)' && b.getAttribute('data-teste')===IDS[i])),'CA1: os quatro botões, cada um com a tentativa entre parênteses (0 antes de jogar)');
    store['lcc-teste']=JSON.stringify({ garagem:2, terraco:5 }); L.buildDev();
    ok(bt().some(b=>b.textContent==='Garagem (2)') && bt().some(b=>b.textContent==='Terraço Suíça (5)') && bt().some(b=>b.textContent==='Avenida Brasil (0)'),'CA1: com as tentativas guardadas: Garagem (2), Terraço Suíça (5), Avenida Brasil (0)');
    inp().value='  Ana   Maria  '; inp().fire('change'); ok(store.lcc2_name==='Ana Maria','CA1: o campo grava o nome no LS.name, com o cleanName ('+store.lcc2_name+')');
    L.buildDev(); ok(inp().value==='Ana Maria','CA1: ao abrir de novo, o campo traz o nome gravado');
    bt().find(b=>b.textContent==='Avenida Brasil (0)').fire('click');
    ok(g.state==='intro' && g.teste && g.teste.id==='avenida' && !els['ov-dev'].classList.contains('show') && /Teste: Avenida Brasil/.test(txt(els['intro-title'])),'CA1: o botão fecha o painel e vai à introdução ("Teste: Avenida Brasil")');
    ok(/Meta: R\$ \d+/.test(txt(els['intro-goal'])) && txt(els['intro-note'])==='Jogue um dia como sempre. No fim, copie o relatório e mande.','CA1: a introdução tem a meta, como nos Desafios, e o aviso'); }
  { const {L,els,g}=mk(); g.startTeste('garagem'); g.begin(); g.setState('paused'); ok(txt(els['pause-note'])==='Se sair agora, não sai relatório.','CA1: a nota da pausa: "Se sair agora, não sai relatório."'); }
  { const {L,els,g}=mk(); g.setDev(true); L.buildMenu(); ok(!/Teste de habilidade/.test(txt(els['ov-menu'])) && !/Teste de habilidade/.test(txt(els['ov-desafios'])),'CA1: nem com o modo dev ligado o menu mostra o teste (só o painel do dev)'); } });

// ---------- CA2: o botão monta o dia da tabela ----------
bloco('CA2',()=>{
  IDS.forEach((id,i)=>{
    const {g,L,store}=mk(); g.setDev(true); const real=g.save, antes=JSON.stringify(real);   // o save do modo dev é o "de verdade" desta checagem
    const FORCA=()=>({ clima:'chuva', evento:'junina', quebra:'fogao', fiscal:'vem', vip:'vem', apito:'apita', critico:'hoje', noite:'hoje', gripe:'gripado' });
    L.DEV.vel=4; L.DEV.forca=FORCA(); const forca=L.DEV.forca;
    const st1=salva(store);
    ok(g.startTeste(id)===true && g.state==='intro' && g.teste.id===id && g.teste.semente===SEM[i],'CA2: '+id+': startTeste vai à introdução, com a semente '+SEM[i]);
    ok(g.ponto.id===PONTOS[i] && g.day.n===DIAS[i] && g.day.meta===g.diaPonto(L.diaOf(DIAS[i])).meta && g.day.expert===g.diaPonto(L.diaOf(DIAS[i])).expert && g.day.groups===g.diaPonto(L.diaOf(DIAS[i])).groups,'CA2: '+id+': o ponto, o dia '+DIAS[i]+' e as metas e os grupos do diaPonto, sem multiplicar (meta '+g.day.meta+')');
    const eq=g.save.equipe;
    if(i===0) ok(['dani','joca','cami','anselmo','lia'].every(q=>eq[q]===0) && eq.tonhao>0,'CA2: Garagem: só a Bia e o Tonhão (equipe zerada)');
    else ok(eq.dani>0 && eq.tonhao>0 && eq.joca>0 && g.save.divulga==='redes' && g.save._desafio===true,'CA2: '+id+': a equipe "Tudo no máximo" e as Redes sociais, no save de mentira (dani '+eq.dani+', joca '+eq.joca+', cami '+eq.cami+')');
    ok(g.clima==='' && g.quebras.length===0 && g.fiscal===null && g.evento==='' && g.visita===null && g.noite===false && g.conversa===null && !!g.day.gripe===!!L.diaOf(DIAS[i]).gripe,'CA2: '+id+': sem clima, quebra, fiscal, evento, crítico, noite nem conversa, mesmo com DEV.forca ligado');
    ok(L.DEV.vel===1 && Object.keys(L.DEV.forca).length===0,'CA2: '+id+': DEV.vel em 1 e os forçados do dev não valem durante o teste');
    { const sig=x=>JSON.stringify(x.schedule.map(q=>[q.type,Math.round(q.t*1000),q.color,q.vip,!!q.apito,!!q.critico])), com=sig(g), y=mk(); y.g.setDev(true); y.L.DEV.forca={}; y.g.startTeste(id);
      ok(com===sig(y.g),'CA2: '+id+': a agenda é a mesma com os forçados do dev ligados ou não (nem o VIP, nem o apito forçado entram)'); }
    ok(salva(store)===st1 && g.save!==real && g.salvo===real,'CA2: '+id+': nada vai ao localStorage além do lcc-teste, e o save de verdade fica guardado');
    g.begin(); roda(g,2); g.setState('menu');
    ok(g.save===real && JSON.stringify(g.save)===antes && g.salvo===null && g.teste===null && g.tm===null && g.desafio===null,'CA2: '+id+': ao sair, o save de verdade igual ao de antes, campo a campo, e o teste acabado');
    ok(L.DEV.forca===forca && forca.clima==='chuva' && salva(store)===st1,'CA2: '+id+': o DEV.forca de antes volta ao sair, e o localStorage segue igual');
  });
  // o dia inteiro: o fim do teste não grava nada
  { const {g,L,store}=mk(), real=g.save, antes=JSON.stringify(real), st=salva(store); roteiro(g,'avenida'); g.schedule=[]; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta; roda(g,3);
    ok(g.state==='testefim' && salva(store)===st && g.desafioRes===null,'CA2: no fim do dia o estado é testefim, e nada (save, ranking, medalha) foi gravado');
    g.setState('menu'); ok(JSON.stringify(g.save)===antes && g.save.desafios.soBia===2 && Object.keys(g.save.desafios).length===1,'CA2: depois de voltar, o save de verdade segue igual (as medalhas também)'); } });

// ---------- CA3: os mesmos clientes ----------
bloco('CA3',()=>{
  const sigA=g=>JSON.stringify(g.schedule.map(s=>[s.type,Math.round(s.t*1000),s.color,s.vip,s.i]));
  const sigG=g=>{ const o=[]; for(let i=0;i<8;i++){ const x=g.spawn(g.schedule[i]); o.push([x.type,x.size,x.dishes,x.extras,x.bill,x.vip,x.color,JSON.stringify(x.people)]); } return JSON.stringify(o); };
  const sigs={};
  IDS.forEach((id,i)=>{
    const {g,L}=mk(), ref=Math.random, res=[];
    const ruidos=[()=>0.5, (()=>{ let a=1; return ()=>{ a=(a*16807)%2147483647; return a/2147483647; }; })(), ref];
    ruidos.forEach(rr=>{ Math.random=rr; try{ g.startTeste(id); res.push([sigA(g),sigG(g)]); } finally { Math.random=ref; } });
    ok(res.every(x=>x[0]===res[0][0]) && g.schedule.length>=8,'CA3: '+id+': a mesma fase, começada com sorteios diferentes no meio, dá a mesma agenda (tipo, hora, cor, VIP de '+g.schedule.length+' grupos)');
    ok(res.every(x=>x[1]===res[0][1]),'CA3: '+id+': e os mesmos 8 primeiros grupos (tamanho, pessoas, pedidos e conta)');
    sigs[id]=res[0][0]; });
  ok(new Set(IDS.map(id=>sigs[id])).size===4,'CA3: as quatro fases dão agendas diferentes');
  { const {g,L}=mk(); const r0=Math.random; g.startTeste('terraco'); ok(Math.random===r0,'CA3: o Math.random original volta depois do sorteio com semente');
    g.startTeste('industrial'); const encom=g.schedule.filter(s=>s.type==='encomenda').length; g.startTeste('industrial'); ok(g.schedule.filter(s=>s.type==='encomenda').length===encom,'CA3: a encomenda do setor também sai da semente ('+encom+')'); }
  { const {g}=mk(); const x=g.startDesafio('soBia'), a=JSON.stringify(g.schedule.map(s=>Math.round(s.t*1000))); g.startDesafio('soBia'); ok(JSON.stringify(g.schedule.map(s=>Math.round(s.t*1000)))===a && g.teste===null,'CA3: (controle) o Desafio comum, sem o Teste (v12.3: ele tem semente própria, então a agenda é a mesma)'); } });

// ---------- CA4: as medidas, num dia roteirizado ----------
bloco('CA4',()=>{
  // a Garagem, sem ajudante: o roteiro inteiro, passo a passo, com um oráculo que conta por fora
  const {g,L,els}=mk(); roteiro(g,'garagem'); const m=g.tm, o={ fila:0, par:0 }, dt=0.05;
  const espera=()=>g.queue.some(q=>q.state==='queue' && g.tables.some(t=>t.free&&t.seats>=q.size)) || g.tables.some(t=>t.open&&((t.group&&(t.group.state==='wantOrder'||t.group.state==='wantBill'))||(t.dirty&&!t.group))) || g.kitchen.plates.some(p=>p&&p.group&&p.group.state==='ordered');
  const passo=s=>{ for(let i=0;i<Math.round(s/dt);i++){ g.update(dt); o.fila+=g.bia.acts.length*dt; if(!g.bia.acts.length && !g.bia.moving && espera()) o.par+=dt; } };
  passo(2);
  ok(perto(m.t,2) && m.par===0 && m.filaS===0 && m.ac===0 && m.perd===0,'CA4: dois segundos de salão vazio: o relógio anda e a Bia não fica parada (nada à espera)');
  const A=fam(g), tA=mesa(g,A); passo(1.5);
  ok(perto(m.par,1.5),'CA4: o grupo na fila com mesa livre que caiba e a Bia sem fazer nada: 1,5 s de Bia parada ('+m.par.toFixed(2)+')');
  ok(g.seatGroup(A,tA)===true && m.ac===1 && m.sentar.length===1 && perto(m.sentar[0],1.5),'CA4: sentar o grupo é 1 ação e dá a reação de sentar 1,5 ('+m.sentar.map(x=>x.toFixed(2))+')');
  A.setState('wantOrder'); passo(2);
  ok(g.tapTable(tA)===true && m.ac===2 && m.pedido.length===1 && perto(m.pedido[0],2.0),'CA4: o grupo em wantOrder, tocado 2 s depois: reação de pedido 2,0 ('+m.pedido.map(x=>x.toFixed(2))+')');
  ok(g.tapTable(tA)===true && m.pedido.length===1,'CA4: o 2º toque na mesma mesa não vale outra reação');
  passo(1.5); g.bia.clearActs();   // as duas ações na fila (a Bia anda) enchem a fila média
  // a Bia anda (fila cheia de 2) e o grupo vira conta e prato
  const B=fam(g), tB=mesa(g,B); g.seatGroup(B,tB,true); ok(m.ac===3 && m.sentar.length===1,'CA4: o que a Cami gerente senta (semCorrente) não conta como ação nem como reação');
  B.setState('wantBill'); g.bia.clearActs(); passo(2.5);
  ok(g.tapTable(tB)===true && m.conta.length===1 && perto(m.conta[0],2.5),'CA4: a conta, tocada com a mesa esperando 2,5 s: reação de conta 2,5 ('+m.conta.map(x=>x.toFixed(2))+')');
  g.bia.clearActs();
  const C=tA; C.group=null; C.dirty=true; C.dirtyN=2; C.sujaT=0; g.groups=g.groups.filter(x=>x!==A); passo(3);
  ok(g.tapTable(C)===true && m.suja.length===1 && perto(m.suja[0],3.0),'CA4: a mesa suja, tocada 3 s depois: reação de mesa suja 3,0 ('+m.suja.map(x=>x.toFixed(2))+')');
  g.bia.clearActs(); C.dirty=false;
  const D=fam(g), tD=mesa(g,D); g.seatGroup(D,tD,true); D.setState('ordered'); const pl={ id:++g.kitchen.pid, table:tD.id, group:D, dish:D.dish, slot:0, age:0, crit:false, q:3, vip:false, tempo:undefined, casa:false }; g.kitchen.plates[0]=pl; g.bia.clearActs(); passo(2.5);
  ok(g.tapStation('plates',0,0)===true && m.prato.length===1 && perto(m.prato[0],2.5),'CA4: o prato no balcão para o grupo à espera, pego 2,5 s depois: reação de prato 2,5 ('+m.prato.map(x=>x.toFixed(2))+')');
  // os toques perdidos: o chão vazio e o toque recusado
  g.bia.clearActs(); g.kitchen.plates[0]=null; D.setState('eating'); const p0=m.perd;
  let vazio=null; for(let x=60;x<900&&!vazio;x+=20) for(let y=60;y<520&&!vazio;y+=20) if(!g.pickAt(x,y,0)) vazio={x,y};
  g.onDown(vazio.x+g.cam,vazio.y,0); ok(m.perd===p0+1,'CA4: o toque no chão vazio é 1 toque perdido');
  ok(g.tapStation('plates',0,0)===false && m.perd===p0+2,'CA4: o toque recusado (sem prato pronto) é o 2º toque perdido');
  { const E=fam(g); g.drag={ g:E, sx:0, sy:0, x:vazio.x, y:vazio.y, moved:true, pad:0 }; g.onUp(vazio.x+g.cam,vazio.y); ok(m.perd===p0+3,'CA4: arrastar o grupo e soltar fora de mesa também é toque perdido'); }
  // a fila média e a Bia parada batem com o oráculo
  g.bia.clearActs(); g.groups=[]; g.queue=[]; g.tables.forEach(t=>{ t.group=null; t.dirty=false; }); passo(1);
  ok(perto(m.filaS,o.fila,0.4) && m.filaS>0,'CA4: a soma da fila de ações bate com a contada por fora ('+m.filaS.toFixed(2)+' contra '+o.fila.toFixed(2)+')');
  ok(perto(m.par,o.par,0.4) && m.par>5,'CA4: a Bia parada bate com a contada por fora ('+m.par.toFixed(2)+' s contra '+o.par.toFixed(2)+')');
  const fm=m.filaS/m.t, pp=m.par/m.t; ok(fm>0 && fm<3 && pp>0 && pp<1,'CA4: fila média '+fm.toFixed(2)+' e Bia parada '+Math.round(100*pp)+'% do turno');
  // ações por minuto: o 'ac' por minuto de turno
  ok(L.testeRelatorio(g).split('\n')[5].indexOf('Ritmo: '+(m.ac/(m.t/60)).toFixed(1).replace('.',',')+' ações/min')===0,'CA4: as ações por minuto de turno saem no relatório ('+(m.ac/(m.t/60)).toFixed(1)+')'); }
  );
bloco('CA4 (ajudante e aparelho)',()=>{
  // o caso resolvido por ajudante não entra: a mesa suja que a Dani limpa sozinha
  { const {g}=mk(); roteiro(g,'industrial'); g.save.equipe.cami=0; g.save.equipe.joca=0; g.save.equipe.daniTasks=['pratos','lavar','lixo']; g.dani.reset();
    ok(g.dani.tasks.indexOf('pratos')>=0,'CA4: (preparo) a Dani tem a tarefa de recolher a louça');
    const t=g.tables[0]; t.dirty=true; t.dirtyN=2; t.sujaT=0; roda(g,25);
    ok(t.dirty===false && g.tm.suja.length===0 && g.tm.ac===0,'CA4: a mesa suja que a Dani limpou sozinha não entra na reação nem nas ações'); }
  { const {g}=mk(); roteiro(g,'garagem'); const grp=fam(g), t=mesa(g,grp); g.seatGroup(grp,t); grp.setState('wantOrder'); roda(g,1); grp.setState('ordered');   // alguém (um ajudante) resolveu o pedido
    g.tapTable(t); ok(g.tm.pedido.length===0,'CA4: o pedido que já foi resolvido por outro (o grupo saiu do wantOrder) não dá reação'); }
  // o aparelho: o pointerType do último pointerdown
  { const {g,els}=mk(); roteiro(g,'garagem'); const c=els['c'], ev=t=>({ pointerType:t, pointerId:1, clientX:100, clientY:100, preventDefault(){} });
    ok(g.tm.aparelho==='bot','CA4: sem pointerdown da página, o aparelho é bot');
    c.fire('pointerdown',ev('touch')); ok(g.tm.aparelho==='toque','CA4: o pointerType touch dá "toque"');
    c.fire('pointerdown',ev('pen')); ok(g.tm.aparelho==='toque','CA4: a caneta também é "toque"');
    c.fire('pointerdown',ev('mouse')); ok(g.tm.aparelho==='mouse','CA4: o mouse dá "mouse"'); } });

// ---------- CA5: o relatório ----------
bloco('CA5',()=>{
  const R='(\\d+,\\d / \\d+,\\d / \\d+|—)';
  const re=[/^LCC-TESTE 2 · v12(\.\d+)+ · Garagem · dia 7 · semente 7001$/,
    /^Jogador: Ana · tentativa 3 · (celular|tablet|computador|bot) · (toque \d+×\d+|mouse \d+×\d+|bot -) · \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/,
    /^Resultado: lucro -?R\$ \d+ · meta R\$ \d+ \(-?\d+%\) · (0★|★{1,3}) · servidos \d+ de \d+ · Gúgou (\d,\d|—)$/,
    /^Perdidos: \d+ · fila sem mesa \d+ · fila com mesa \d+ · pedido \d+ · prato \d+ · conta \d+ · retirada \d+ · esfriou \d+$/,
    new RegExp('^Reação em s \\(média / mediana / casos\\): sentar '+R+' · pedido '+R+' · prato '+R+' · conta '+R+' · mesa suja '+R+'$'),
    /^Ritmo: \d+,\d ações\/min · \d+ toques perdidos · fila média \d+,\d$/,
    /^Bia parada: \d+% do turno com coisa à espera$/];
  const fim=(g,s)=>{ roda(g,s||1); g.schedule=[]; g.groups=[]; g.queue=[]; g.custo=0; g.money=g.fixo+g.day.meta+20; roda(g,3); };
  const {g,L,store,els}=mk({ lcc2_name:'Ana' });
  g.startTeste('garagem'); g.startTeste('garagem'); roteiro(g,'garagem');
  const A=fam(g), t=mesa(g,A); roda(g,1.5); g.seatGroup(A,t); A.setState('wantOrder'); roda(g,2); g.tapTable(t); g.tapStation('plates',0,0); fim(g,1);
  ok(g.state==='testefim' && typeof g.testeRel==='string' && g.testeRel.length>0,'CA5: no fim do dia o relatório está em g.testeRel');
  const linhas=g.testeRel.split('\n');
  ok(linhas.length===7,'CA5: sete linhas (sem a do modo dev) ('+linhas.length+')');
  re.forEach((r,i)=>ok(r.test(linhas[i]||''),'CA5: linha '+(i+1)+' no formato: '+(linhas[i]||'').slice(0,110)));
  ok(/pedido 2,0 \/ 2,0 \/ 1/.test(linhas[4]) && /sentar 1,5 \/ 1,5 \/ 1 /.test(linhas[4]) && /· prato — · conta — · mesa suja —/.test(linhas[4]),'CA5: as reações com vírgula decimal (pedido 2,0 / 2,0 / 1) e "—" sem caso');
  ok(/bot -/.test(linhas[1]) && /tentativa 3/.test(linhas[1]) && /\(\d+%\)/.test(linhas[2]) && /★/.test(linhas[2]) && /1 toques perdidos|1 toque perdido|\d+ toques perdidos/.test(linhas[5]),'CA5: o nome vem do LS.name ("Ana"), o aparelho no bot é "bot -" e a tentativa é a 3ª');
  ok(JSON.parse(store['lcc-teste']).garagem===3,'CA5: lcc-teste guarda 3 tentativas da Garagem (uma por começo, mesmo quem sai no meio)');
  g.setState('menu'); g.startTeste('industrial'); g.startTeste('terraco'); g.startTeste('terraco');
  ok(JSON.stringify(JSON.parse(store['lcc-teste']))===JSON.stringify({ garagem:3, industrial:1, avenida:0, terraco:2 }) && g.teste.tent===2,'CA5: a tentativa é contada por fase ('+store['lcc-teste']+')');
  // sem nome e sem caso nenhum
  { const x=mk(); x.g.startTeste('terraco'); x.g.begin(); roda(x.g,2); x.g.schedule=[]; x.g.groups=[]; x.g.custo=0; x.g.money=0; roda(x.g,3); const l=x.g.testeRel.split('\n');
    ok(/^Jogador: sem nome · tentativa 1 /.test(l[1]) && /^LCC-TESTE 2 · v12(\.\d+)+ · Terraço Suíça · dia 58 · semente 7004$/.test(l[0]),'CA5: sem nome no Ranking, o relatório diz "sem nome"');
    ok(l[4]==='Reação em s (média / mediana / casos): sentar — · pedido — · prato — · conta — · mesa suja —','CA5: sem nenhum caso, as cinco reações saem "—"');
    ok(/^Resultado: lucro -?R\$ \d+ · meta R\$ \d+ \(-?\d+%\) · 0★ · servidos 0 de \d+ · Gúgou —$/.test(l[2]),'CA5: sem estrela, "0★"; sem nota, "Gúgou —" ('+l[2]+')'); }
  // o dia encerrado no modo dev
  { const x=mk(); x.g.setDev(true); x.g.startTeste('garagem'); x.g.begin(); roda(x.g,3); ok(x.g.devFimDia()===true,'CA5: o dev encerra o dia'); roda(x.g,40);
    const l=x.g.testeRel.split('\n'); ok(x.g.state==='testefim' && l.length===8 && l[7]==='(encerrado no modo dev)','CA5: o dia encerrado no modo dev ganha a última linha "(encerrado no modo dev)" ('+x.g.state+', '+l.length+' linhas)'); } });

// ---------- CA6: o fim do teste (a tela, os botões, o que não pode mudar) ----------
const espera=ms=>new Promise(r=>setTimeout(r,ms));
const prepara=(copia)=>{ const H=mk(); if(copia){ const cr=H.doc.createElement, cap={ v:null }; H.doc.createElement=t=>{ const e=cr(t); e.select=()=>{}; return e; }; H.doc.body={ appendChild(c){ cap.v=c.value; }, removeChild(){} }; H.doc.execCommand=()=>true; H.cap=cap; }
  const {g}=H; H.antes=JSON.stringify(g.save); H.real=g.save; H.st=H.store.lcc2_save; H.caixa=JSON.stringify(g.save.caixa); H.desafios=JSON.stringify(g.save.desafios);
  roteiro(g,'garagem'); g.schedule=[]; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+20; roda(g,3); return H; };
(async()=>{
  try {
    { const H=prepara(true), {g,els,cap}=H;
      ok(g.state==='testefim' && els['ov-teste-fim'].classList.contains('show') && !els['ov-desafio-fim'].classList.contains('show') && !els['ov-end'].classList.contains('show'),'CA6: o fim mostra a tela ov-teste-fim (e não a do Desafio nem a do resultado do dia)');
      ok(txt(els['teste-fim-titulo'])==='Teste: Garagem' && /^Lucro R\$ \d+ · ★{1,3}$/.test(txt(els['teste-fim-msg'])),'CA6: o título "Teste: Garagem" e a linha do lucro e das estrelas ('+txt(els['teste-fim-msg'])+')');
      ok(!/LCC-TESTE/.test(txt(els['ov-teste-fim'])),'CA6: o relatório não aparece na tela');
      els['btn-teste-copia'].fire('click'); await espera(10);
      ok(cap.v===g.testeRel && /^LCC-TESTE 2/.test(cap.v),'CA6: "Copiar relatório" chama o copyText com o texto do relatório');
      ok(txt(els['teste-fim-aviso'])==='Copiado! Cole na conversa.' && todos(els['teste-fim-caixa'],n=>n.tagName==='TEXTAREA').length===0 && !/LCC-TESTE/.test(txt(els['ov-teste-fim'])),'CA6: copiou: "Copiado! Cole na conversa." e o relatório continua fora da tela'); }
    // a cópia que falha, jogar de novo e voltar
    { const F=prepara(false), {g:g2,els:e2}=F; e2['btn-teste-copia'].fire('click'); await espera(10);
      const ta=todos(e2['teste-fim-caixa'],n=>n.tagName==='TEXTAREA');
      ok(txt(e2['teste-fim-aviso'])==='Não deu para copiar sozinho: selecione o texto abaixo.' && ta.length===1 && ta[0].value===g2.testeRel,'CA6: a cópia que falha: o aviso e a caixa com o relatório');
      e2['btn-teste-copia'].fire('click'); await espera(10);
      ok(todos(e2['teste-fim-caixa'],n=>n.tagName==='TEXTAREA').length===1,'CA6: copiar de novo não duplica a caixa');
      const t0=g2.teste.tent; e2['btn-teste-de-novo'].fire('click');
      ok(g2.state==='intro' && g2.teste.id==='garagem' && g2.teste.tent===t0+1 && /Teste: Garagem/.test(txt(e2['intro-title'])),'CA6: "Jogar de novo" recomeça a mesma fase, com a tentativa + 1 ('+g2.teste.tent+')');
      g2.begin(); g2.schedule=[]; g2.groups=[]; g2.custo=0; g2.money=g2.fixo+g2.day.meta+20; roda(g2,3);
      ok(g2.state==='testefim' && txt(e2['teste-fim-aviso'])==='' && todos(e2['teste-fim-caixa'],n=>n.tagName==='TEXTAREA').length===0,'CA6: no 2º fim, o aviso e a caixa da cópia anterior somem');
      e2['btn-teste-volta'].fire('click');
      ok(g2.state==='menu' && g2.teste===null && g2.salvo===null && g2.save===F.real && JSON.stringify(g2.save)===F.antes,'CA6: "Voltar" vai ao menu com o save de verdade, igual ao de antes');
      ok(JSON.stringify(g2.save.desafios)===F.desafios && g2.desafioRes===null && JSON.stringify(g2.save.caixa)===F.caixa && F.store.lcc2_save===F.st && !('lcc2_ranking' in F.store),'CA6: nenhuma medalha, nenhum ranking e nenhuma linha de Caixa, e o lcc2_save no localStorage ficou como estava'); }
  } catch(e){ total++; fails++; console.log('FAIL: CA6 lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); }
  console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
})();
