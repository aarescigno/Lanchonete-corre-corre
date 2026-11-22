// v12.4 (etapa 14d): o Teste e os Desafios com o máximo de cada ponto (a equipe, os cursos, as melhorias e a decoração que a campanha dá, no nível mais alto) e a tela da fase para escolher quem vem e o que cada um faz.
// CA1 a CA7 (o CA8, as sementes dos Desafios, é o `DESAFIO=<id> node balance.js 200`; o CA10, a tela nos 14 tamanhos, é o `python3 menu_fit.py paineis`).
const load=require('./harness.js'), fs=require('fs'), os=require('os'), path=require('path'), cp=require('child_process');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const IDS=['garagem','industrial','avenida','terraco'], NV={ garagem:1, industrial:2, avenida:3, terraco:4 };
const REAL={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1, desafios:{ soBia:2 } };
const mk=(extra,opts)=>load(Object.assign({ store:Object.assign({ lcc2_save:JSON.stringify(REAL) },extra||{}) },opts||{}));
const arr=o=>JSON.stringify(o);
const fecha=g=>{ g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.queue=[]; g.custo=0; g.money=g.fixo+g.day.meta+10; g.finishDay(); };

// ---------- CA1: o máximo do ponto (a equipe, os cursos, as melhorias) ----------
bloco('CA1',()=>{
  const {g,L}=mk(); const S={};
  IDS.forEach(id=>{ g.startTeste(id); S[id]={ eq:Object.assign({},g.save.equipe), sv:g.save, up:Object.assign({},g.up) }; g.setState('menu'); });
  const e=id=>S[id].eq;
  ok(e('garagem').tonhao===4 && e('garagem').dani===4 && ['joca','cami','anselmo','lia'].every(q=>e('garagem')[q]===0),'CA1: Garagem: Tonhão 4, Dani 4 e nenhum outro ajudante ('+arr(['tonhao','dani','joca','cami','anselmo','lia'].map(q=>e('garagem')[q]))+')');
  ok(e('industrial').joca===4 && e('industrial').dani===4 && e('industrial').cami===0 && e('industrial').anselmo===0 && e('industrial').lia===0,'CA1: área industrial: Joca 4 e nenhuma Cami, Anselmo ou Lia');
  ok(e('avenida').cami===3 && e('avenida').anselmo===2 && e('avenida').lia===0 && e('avenida').joca===4,'CA1: Avenida: Cami 3 e Anselmo 2 (sem Lia)');
  { const t=S.terraco; ok(t.eq.cami===4 && t.eq.anselmo===3 && t.eq.lia===3 && t.sv.rosa===0 && !t.sv.camiCursos.gerente,'CA1: Terraço (cap 11): Cami 4, Anselmo 3, Lia 3 (v12.5), sem o molho da Rosa e sem o curso gerente'); }
  { const {g:h}=mk(); h.startDesafio('critico'); const sv=h.save; ok(sv.cap===13 && sv.equipe.cami===5 && sv.rosa===1 && sv.camiCursos.gerente===1 && sv.equipe.camiFila===true,'CA1: Noite do crítico (cap 13): Cami 5 (gerente, "Organiza a fila" ligado) e o molho da Rosa'); }
  // nada acima do ponto
  const acima=[];
  IDS.forEach(id=>{ const nv=NV[id], sv=S[id].sv, up=S[id].up;
    L.CURSOS.forEach(c=>{ if(c.nivel&&c.nivel>nv&&sv.cursos[c.id]) acima.push(id+':'+c.id); });
    [['daniCursos',L.DANI_CURSOS],['camiCursos',L.CAMI_CURSOS],['anselmoCursos',L.ANSELMO_CURSOS]].forEach(([k,l])=>l.forEach(c=>{ if((c.nivel||1)>nv&&sv[k][c.id]) acima.push(id+':'+k+'.'+c.id); }));
    L.JOCA_CURSOS.forEach(c=>{ if((c.nivel||1)>nv&&sv.jocaCursos[c.id]) acima.push(id+':joca.'+c.id); });
    L.UPGRADES.forEach(u=>{ if(u.nivel&&u.nivel>nv&&up[u.id]) acima.push(id+':'+u.id); }); });
  ok(acima.length===0,'CA1: nenhum curso nem melhoria com nível acima do ponto ('+acima.join()+')');
  ok(!S.industrial.up.espresso && !S.industrial.up.confGourmet && !S.industrial.sv.cursos.restaurante && !S.industrial.up.louca && !S.industrial.up.confAlta && S.industrial.up.confCaseira===true,'CA1: a área industrial sem restaurante, confeitaria gourmet, espresso e louça fina, com a confeitaria caseira');
  ok(S.garagem.sv.cursos.pastel===2 && S.garagem.sv.cursos.pf===2 && !S.garagem.sv.cursos.restaurante && !S.garagem.sv.cursos.entradas && S.terraco.sv.cursos.alta===2 && S.terraco.sv.cursos.restaurante===2,'CA1: os cursos do Tonhão no avançado, só os do ponto (Garagem sem restaurante; Terraço com todos)');
  ok(IDS.every(id=>!!e(id).tv===(id==='garagem') && !!e(id).som===(id==='garagem')) && IDS.every(id=>!!e(id).couvert===(id==='avenida') && !!e(id).taxa===(id==='avenida')) && IDS.every(id=>(e(id).musica===1)===(id==='terraco')) && e('industrial').tvs===2 && IDS.every(id=>id==='industrial'||e(id).tvs===0),'CA1: TV e som só na Garagem; as TVs (modo 2) só na área industrial; couvert com taxa só na Avenida; música só no Terraço'); });

// v12.4 (relato do usuário): a máquina de cafés especiais não aparece no Teste nem nos Desafios da Garagem e da área industrial; o espresso só da Avenida em diante e os cafés especiais (cafesEsp) só no Terraço
bloco('CA1 (espresso)',()=>{
  const {g}=mk(), tem=k=>g.up[k]===true;
  const alvos=[['teste garagem',()=>g.startTeste('garagem'),0,0],['teste industrial',()=>g.startTeste('industrial'),0,0],['teste avenida',()=>g.startTeste('avenida'),1,0],['teste terraco',()=>g.startTeste('terraco'),1,1]]
    .concat(['soBia','efood','jogo'].map(id=>['desafio '+id+' (área industrial)',()=>g.startDesafio(id),0,0]),['semBravo','junina'].map(id=>['desafio '+id+' (Avenida)',()=>g.startDesafio(id),1,0]),['critico','vips'].map(id=>['desafio '+id+' (Terraço)',()=>g.startDesafio(id),1,1]));
  alvos.forEach(([nome,f,esp,caf])=>{ f(); ok(tem('espresso')===!!esp && tem('cafesEsp')===!!caf && !!g.save.jocaCursos.espresso===!!esp && !!g.save.jocaCursos.cafesEsp===!!caf,'CA1: '+nome+': up.espresso '+(esp?'ligado':'falso')+' e up.cafesEsp '+(caf?'ligado':'falso')+' ('+tem('espresso')+', '+tem('cafesEsp')+')'); g.setState('menu'); }); });

// ---------- CA2: a decoração e as compras do ponto ----------
bloco('CA2',()=>{
  const {g,L}=mk();
  IDS.forEach(id=>{ g.startTeste(id); const nv=NV[id], sv=g.save, up=g.up;
    const dec=L.DECOR.filter(d=>L.decorCombina(d,nv)).map(d=>d.id).sort(), tem=Object.keys(sv.decor).filter(k=>sv.decor[k]).sort();
    ok(arr(dec)===arr(tem),'CA2: '+id+': todos os itens de DECOR do ponto à mostra e nenhum de fora ('+tem.length+' itens)');
    ok(L.movelNivel(g)===nv && sv.salao.mesas.length>0 && sv.salao.mesas.every(m=>m.t===1),'CA2: '+id+': o jogo de mesas do ponto (degrau '+L.movelNivel(g)+') e o enfeite em todas as mesas ('+sv.salao.mesas.length+' mesas)');
    if(id==='industrial') ok(up.fogaoInd===true && up.assento==='banco' && up.tvs===true && sv.equipe.tvs===2,'CA2: área industrial: fogão industrial, banquinhos de madeira e as TVs sem anúncios');
    if(id==='avenida') ok(up.assento==='sofa' && sv.equipe.couvert && sv.equipe.taxa,'CA2: Avenida: o sofá da espera e o couvert com a taxa');
    if(id==='terraco') ok(up.assento==='poltrona' && up.louca===true && sv.equipe.musica===1,'CA2: Terraço: poltronas, louça fina e o Trio de cordas');
    if(id==='garagem') ok(!up.fogaoInd && !up.assento && !up.tvs && up.pratos===1 && up.maquina===true,'CA2: Garagem: sem fogão industrial nem assento; a torneira e o jogo de pratos');
    g.setState('menu'); }); });

// ---------- CA3: a equipe padrão ----------
bloco('CA3',()=>{
  const {g,L}=mk(), t=h=>h.tasks.slice();
  g.startTeste('garagem'); ok(arr(t(g.dani))===arr(['pratos','lavar','suco']) && !g.joca.active && !g.cami.active,'CA3: Garagem: a Dani faz pratos, lavar e suco ('+t(g.dani)+')'); g.setState('menu');
  g.startTeste('industrial'); ok(arr(t(g.joca))===arr(['lixo','lavar','pratos']) && arr(t(g.dani))===arr(['cafe','doce']),'CA3: área industrial: o Joca com lixo, lavar e pratos; a Dani com cafezinho e doce ('+t(g.joca)+' / '+t(g.dani)+')'); g.setState('menu');
  ['avenida','terraco'].forEach(id=>{ g.startTeste(id); ok(g.save.equipe.camiModo==='tarefas' && arr(t(g.cami))===arr(['lixo','lavar','pratos','suco']) && arr(t(g.joca))===arr(['cafe']) && arr(t(g.dani))===arr(['doce']),'CA3: '+id+': a Cami nas tarefas (lixo, lavar, pratos, suco), o Joca com o café e a Dani com o doce ('+t(g.cami)+' / '+t(g.joca)+' / '+t(g.dani)+')'); g.setState('menu'); });
  ok(arr(L.testeEqPadrao(L.TESTES[3])) === arr(L.TESTE_EQ_PADRAO.terraco) ,'CA3: a constante TESTE_EQ_PADRAO é a equipe padrão de cada ponto');
  g.startDesafio('semBravo'); ok(arr(t(g.cami))===arr(['lixo','lavar','pratos','suco']) && g.save.cap===8 && g.save.equipe.cami===3,'CA3: o Desafio também usa a equipe padrão (e o máximo do ponto: Avenida, Cami 3)'); g.setState('menu');
  g.startDesafio('soBia'); ok(['dani','joca','cami','anselmo','lia'].every(q=>g.save.equipe[q]===0) && g.save.equipe.tonhao===4,'CA3: o mod.sem do Desafio vale por cima do máximo (Só a Bia: ninguém, o Tonhão no 4)'); });

// ---------- CA4: a tela da fase ----------
const abre=(H,id)=>{ const {g,L,els}=H; g.setDev(true); g.setState('teste'); const b=todos(els['teste-lista'],n=>n.getAttribute&&n.getAttribute('data-teste')===id)[0]; b.fire('click'); };
const lin=(H,q)=>todos(H.els['teste-fase-lista'],n=>n.getAttribute&&n.getAttribute('data-quem')===q)[0];
const bot=(H,sel)=>todos(H.els['teste-fase-lista'],n=>n.tagName==='BUTTON'&&Object.keys(sel).every(k=>n.getAttribute(k)===sel[k]))[0];
const clica=(H,sel)=>{ const b=bot(H,sel); if(!b) throw new Error('sem botão '+arr(sel)); b.fire('click'); return b; };
const jogar=H=>H.els['btn-teste-fase-jogar'].fire('click');
bloco('CA4',()=>{
  { const H=mk(), {g,els}=H; abre(H,'industrial');
    ok(g.state==='testefase' && els['ov-teste-fase'].classList.contains('show') && !els['ov-teste'].classList.contains('show') && !els['ov-intro'].classList.contains('show') && g.teste===null,'CA4: o toque numa fase abre a tela da fase (e não começa o dia)');
    ok(txt(els['teste-fase-titulo'])==='Teste: Área industrial' && ['dani','joca'].every(q=>lin(H,q)) && !lin(H,'cami') && !lin(H,'anselmo') && !lin(H,'lia') && !lin(H,'tonhao'),'CA4: o título "Teste: Área industrial" e uma linha por ajudante do ponto (Dani e Joca; o Tonhão não aparece)');
    ok(todos(els['teste-fase-lista'],n=>n.tagName==='BUTTON'&&n.getAttribute('data-vem')).length===2 && txt(bot(H,{'data-vem':'joca'}))==='Vem' && /Cafezinho|Doce/.test(txt(lin(H,'dani'))),'CA4: cada linha tem "Vem" e as tarefas da Dani (Cafezinho, Doce...)');
    // a Dani com o Joca: as básicas dela ficam apagadas "com o Joca"
    const lixo=bot(H,{'data-tarefa':'lixo','aria-pressed':'false'}); ok(!!lixo && lixo.disabled && /com o Joca/.test(txt(lixo)) && lin(H,'dani').children.length>0,'CA4: a tarefa básica da Dani, com o Joca vindo, aparece apagada com a nota "com o Joca"');
    // "Não vem" tira a pessoa do dia
    clica(H,{'data-vem':'joca'}); ok(txt(bot(H,{'data-vem':'joca'}))==='Não vem' && !todos(lin(H,'joca'),n=>n.getAttribute&&n.getAttribute('data-tarefa')).length,'CA4: "Não vem" no Joca troca o botão e esconde as tarefas dele');
    ok(!bot(H,{'data-tarefa':'lixo'}).disabled,'CA4: sem o Joca, as tarefas da casa voltam para a Dani (o "lixo" já não está apagado)');
    // a Dani fica com as básicas: o limite de 3 tarefas ao mesmo tempo
    clica(H,{'data-tarefa':'lixo'}); ok(bot(H,{'data-tarefa':'lavar'}).disabled && bot(H,{'data-tarefa':'pratos'}).disabled && !bot(H,{'data-tarefa':'cafe'}).disabled,'CA4: com 3 tarefas (cafezinho, doce, lixo) as outras ficam apagadas (o limite do nível máximo) e as marcadas seguem livres');
    clica(H,{'data-tarefa':'cafe'}); ok(!bot(H,{'data-tarefa':'lavar'}).disabled,'CA4: tirar uma tarefa abre a vaga');
    jogar(H);
    ok(g.state==='intro' && g.teste && g.teste.id==='industrial' && g.save.equipe.joca===0 && !g.joca.active && g.dani.tasks.indexOf('lixo')>=0 && g.dani.tasks.indexOf('cafe')<0 && arr(g.save.equipe.daniTasks)===arr(['doce','lixo']),'CA4: "Jogar" começa o teste com a equipe do dia: sem o Joca e a Dani com doce e lixo ('+arr(g.dani.tasks)+')'); }
  // a Cami em "Minhas mesas" e o "Padrão"
  { const H=mk(), {g,els}=H; abre(H,'avenida');
    ok(['dani','joca','cami','anselmo'].every(q=>lin(H,q)) && !lin(H,'lia') && !!bot(H,{'data-modo':'mesas'}) && !bot(H,{'data-modo':'tudo'}),'CA4: Avenida: Dani, Joca, Cami e Anselmo; a Cami com "Tarefas" e "Minhas mesas" (sem "Ajuda em tudo")');
    clica(H,{'data-modo':'mesas'}); ok(!todos(lin(H,'cami'),n=>n.getAttribute&&n.getAttribute('data-tarefa')).length && bot(H,{'data-modo':'mesas'}).getAttribute('aria-pressed')==='true','CA4: no "Minhas mesas" a Cami não mostra as tarefas');
    jogar(H); const sv=g.save;
    ok(g.tables[0].cami===true && g.tables[1].cami===true && !g.tables[2].cami && H.L.camiModoMesas(sv) && H.L.donoBasico(g)==='joca','CA4: "Minhas mesas" marca as duas primeiras mesas (tables[0] e tables[1]) e o básico volta para o Joca');
    g.setState('teste'); abre(H,'avenida'); ok(bot(H,{'data-modo':'mesas'}).getAttribute('aria-pressed')==='true','CA4: ao reabrir a fase a escolha continua');
    els['btn-teste-fase-padrao'].fire('click'); ok(bot(H,{'data-modo':'tarefas'}).getAttribute('aria-pressed')==='true' && !JSON.parse(H.store['lcc-teste'])['eq-avenida'],'CA4: "Padrão" volta à equipe padrão da fase e apaga a escolha guardada');
    els['btn-teste-fase-volta'].fire('click'); ok(g.state==='teste' && els['ov-teste'].classList.contains('show') && !els['ov-teste-fase'].classList.contains('show'),'CA4: "Voltar" vai à tela do Teste'); }
  // o Terraço: as cinco pessoas; a Cami com os três modos; Anselmo e Lia só "Vem"
  { const H=mk(), {g}=H; abre(H,'terraco');
    ok(['dani','joca','cami','anselmo','lia'].every(q=>lin(H,q)) && !!bot(H,{'data-modo':'tudo'}) && !todos(lin(H,'anselmo'),n=>n.getAttribute&&n.getAttribute('data-tarefa')).length && !todos(lin(H,'lia'),n=>n.getAttribute&&n.getAttribute('data-tarefa')).length,'CA4: Terraço: as cinco pessoas, a Cami com "Ajuda em tudo" e o Anselmo e a Lia só com "Vem"');
    clica(H,{'data-vem':'anselmo'}); clica(H,{'data-vem':'lia'}); clica(H,{'data-modo':'tudo'}); jogar(H);
    ok(g.save.equipe.anselmo===0 && g.save.equipe.lia===0 && H.L.camiModoTudo(g.save) && g.save.equipe.cami===4,'CA4: sem o Anselmo e a Lia, e a Cami em "Ajuda em tudo" no dia'); } });

// ---------- CA5: a equipe guardada ----------
bloco('CA5',()=>{
  const H=mk(), {g,els,store}=H; abre(H,'industrial'); clica(H,{'data-vem':'joca'}); clica(H,{'data-tarefa':'cafe'});
  const gu=JSON.parse(store['lcc-teste'])['eq-industrial'];
  ok(gu && gu.joca.vem===0 && arr(gu.dani.tasks)===arr(['doce']),'CA5: a escolha fica no lcc-teste, na chave eq-industrial ('+arr(gu)+')');
  g.setState('teste'); abre(H,'industrial'); ok(bot(H,{'data-vem':'joca'}).getAttribute('data-vem')==='joca' && txt(bot(H,{'data-vem':'joca'}))==='Não vem' && bot(H,{'data-tarefa':'doce'}).getAttribute('aria-pressed')==='true' && bot(H,{'data-tarefa':'cafe'}).getAttribute('aria-pressed')==='false','CA5: ao reabrir a fase a equipe volta como estava');
  jogar(H); g.begin(); g.schedule=[]; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+20; roda(g,3);
  ok(g.state==='testefim' && /Joca não vem/.test(g.testeRel),'CA5: no fim do teste o relatório já diz que o Joca não veio');
  els['btn-teste-de-novo'].fire('click'); ok(g.state==='intro' && g.teste.tent===2 && g.save.equipe.joca===0 && arr(g.save.equipe.daniTasks)===arr(['doce']),'CA5: "Jogar de novo" usa a mesma equipe ('+arr(g.save.equipe.daniTasks)+')');
  ok(JSON.parse(store['lcc-teste'])['eq-industrial'] && JSON.parse(store['lcc-teste']).industrial===2,'CA5: as tentativas contam e a equipe guardada não se perde'); });

// ---------- CA6: o relatório (formato 3) e o relatorios.py ----------
bloco('CA6',()=>{
  const eqAv={ dani:{ vem:1, tasks:['doce'] }, joca:{ vem:0 }, cami:{ vem:1, modo:'mesas' }, anselmo:{ vem:1 } };
  { const {g,L}=mk({ lcc2_name:'Ana' }); g.setDev(true); g.startTeste('avenida',eqAv); fecha(g); const l=g.testeRel.split('\n');
    ok(l[0]==='LCC-TESTE 3 · '+L.VERSAO+' · Avenida Brasil · dia 38 · semente 7003' && /^Jogador: Ana · tentativa 1 /.test(l[1]),'CA6: a 1ª linha é "LCC-TESTE 3 · <VERSAO> · Avenida ..." e o Jogador vem em seguida');
    ok(l[2]==='Equipe: Dani (doce) · Joca não vem · Cami (minhas mesas) · Anselmo' && /^Resultado: /.test(l[3]),'CA6: a linha Equipe (Joca fora, Cami em "Minhas mesas", Anselmo) vem depois do Jogador ('+l[2]+')'); }
  { const {g}=mk(); g.startTeste('avenida',{ cami:{ vem:0 }, anselmo:{ vem:0 }, dani:{ vem:1, tasks:['doce'] }, joca:{ vem:1, tasks:['lixo','lavar'] } }); const l=g.eqLinha;
    ok(l==='Dani (doce) · Joca (cafezinho, lixo, lavar) · Cami não vem · Anselmo não vem','CA6: Cami e Anselmo fora (o Joca fica com o básico): "Cami não vem · Anselmo não vem" ('+l+')'); }
  { const {g}=mk(); g.startTeste('terraco',{ cami:{ vem:1, modo:'tudo' }, lia:{ vem:0 } }); ok(/ · Cami \(ajuda em tudo\) · Anselmo · Lia não vem$/.test(g.eqLinha),'CA6: Terraço: "Cami (ajuda em tudo) · Anselmo · Lia não vem" ('+g.eqLinha+')'); }
  { const {g}=mk(); g.startTeste('garagem'); ok(g.eqLinha==='Dani (recolher, lavar, água)','CA6: Garagem: só a Dani ('+g.eqLinha+')'); }
  { const {g}=mk(); g.setDev(true); g.startDesafio('semBravo'); fecha(g); const l=g.testeRel.split('\n');
    ok(/^LCC-TESTE 3 · /.test(l[0]) && l[2]==='Equipe: Dani (doce) · Joca (cafezinho) · Cami (lixo, lavar, recolher, água) · Anselmo','CA6: o relatório do Desafio também tem a linha Equipe, com a equipe padrão ('+l[2]+')'); }
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lcc-rel-')), arq=path.join(tmp,'rel.md');
  const bl=(fmt,jog,eq)=>['LCC-TESTE '+fmt+' · v12.3 · Garagem · dia 7 · semente 7001','Jogador: '+jog+' · tentativa 1 · '+(fmt>=2?'celular · ':'')+'toque 412×915 · 17/11/2026 18:40'].concat(fmt===3?['Equipe: '+eq]:[],[
    'Resultado: lucro R$ 150 · meta R$ 200 (75%) · ★ · servidos 10 de 12 · Gúgou 4,1','Perdidos: 2 · fila sem mesa 1 · fila com mesa 0 · pedido 0 · prato 1 · conta 0 · retirada 0 · esfriou 0',
    'Reação em s (média / mediana / casos): sentar 1,5 / 1,5 / 3 · pedido 2,0 / 2,0 / 3 · prato — · conta — · mesa suja —','Ritmo: 30,0 ações/min · 2 toques perdidos · fila média 1,0','Bia parada: 10% do turno com coisa à espera']).join('\n');
  fs.writeFileSync(arq,'\n'+bl(1,'Zé')+'\n\n'+bl(2,'Ana')+'\n\n'+bl(3,'Bia','Dani (doce) · Joca não vem')+'\n\n'+bl(3,'Bia','Dani (cafezinho)')+'\n\n'+bl(3,'Caio','Dani (doce) · Joca não vem')+'\n');
  const out=cp.execFileSync('python3',[path.join(path.resolve(__dirname,'..'),'ferramentas','relatorios.py'),arq],{ encoding:'utf8' }); fs.rmSync(tmp,{ recursive:true, force:true });
  ok(/5 relatórios lidos$/m.test(out) && !/ignorado/.test(out),'CA6: o relatorios.py lê os formatos 1, 2 e 3 (5 blocos, nenhum ignorado)');
  ok(/Equipe: Dani \(doce\) · Joca não vem/.test(out),'CA6: a melhor tentativa de cada jogador mostra a linha Equipe ('+(out.match(/.*Equipe:.*/)||[''])[0].trim()+')');
  ok(/Bia \(celular\): 2 tentativas em 2 equipes/.test(out) && /Equipe: Dani \(doce\) · Joca não vem · 1 tentativas/.test(out),'CA6: o jogador que usou equipes diferentes na mesma fase sai separado por equipe'); });

// ---------- CA7: TESTE_EQ no balance.js ----------
bloco('CA7',()=>{
  const eq=JSON.stringify({ dani:{ vem:1, tasks:['doce'] }, joca:{ vem:0 } });
  const out=cp.execFileSync('node',['balance.js','1'],{ cwd:__dirname, encoding:'utf8', env:Object.assign({},process.env,{ TESTE:'industrial', TESTE_EQ:eq, REL:'1' }) });
  ok(/Equipe: Dani \(doce\) · Joca não vem/.test(out),'CA7: TESTE_EQ troca a equipe do bot ('+(out.match(/Equipe: .*/)||[''])[0]+')'); });

console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
