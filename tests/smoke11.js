// v7.2, Livro-caixa: registro dos últimos dias da carreira, compras da lojinha na linha do dia seguinte,
// limite de dias, resumo em texto, aba Caixa e save antigo sem caixa.
const H=require('./harness.js')(); const {g,L,els,store}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bot=require('./bot.js')(g,L);
const novo=()=>{ g.save=L.normSave({}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); };
const joga=n=>{ g.startDay(n); g.begin(); let st=0; while(g.state==='playing'&&st<30000){ bot(); g.update(0.05); st++; } return g.result; };
const somaOk=r=>Math.abs(r.fat-r.ingr-r.contas-r.folha-r.div-r.lucro)<=2;

// save novo e save antigo (v7.1, sem caixa)
{ const s=L.normSave({}); ok(Array.isArray(s.caixa)&&s.caixa.length===0&&s.caixaPend.mel===0&&s.caixaPend.sal===0,'save novo: caixa vazio e sem compras pendentes');
  const old=L.normSave({maxDay:4,bank:900,up:{tenis:true}}); ok(old.caixa.length===0&&old.bank===900&&old.dia===4,'save antigo sem caixa: carrega com o caixa vazio');
  const lixo=L.normSave({caixa:[null,5,{d:0},{d:3,fat:'500',lucro:120.4,ok:1,saldo:800}],caixaPend:{mel:-5,sal:'60'}});
  ok(lixo.caixa.length===1&&lixo.caixa[0].fat===500&&lixo.caixa[0].lucro===120&&lixo.caixa[0].ok===true&&lixo.caixa[0].mel===0,'caixa com lixo: só as linhas válidas, com números');
  ok(lixo.caixaPend.mel===0&&lixo.caixaPend.sal===60,'compras pendentes: números não negativos'); }

// um dia da carreira vira uma linha
novo(); { const r=joga(1), c=g.save.caixa;
  ok(c.length===1&&c[0].d===1,'dia 1 jogado: 1 linha no caixa');
  ok(c[0].fat===r.fat&&c[0].lucro===r.money&&c[0].meta===r.meta&&c[0].ok===r.passed&&c[0].perd===r.lost,'a linha guarda faturamento, lucro, meta, se passou e perdidos');
  ok(c[0].saldo===g.save.bank,'saldo da linha = dinheiro acumulado ao fim do dia ('+c[0].saldo+')');
  ok(somaOk(c[0]),'faturou − ingredientes − contas − equipe − divulgação = lucro');
  ok(JSON.parse(store[L.LS.save]).caixa.length===1,'o caixa fica salvo no localStorage'); }

// compras na lojinha entram na linha do dia seguinte e o saldo fecha
novo(); { joga(1); joga(2); g.save.bank=2000; const s0=g.save.bank;
  g.goShop(3); ok(g.buy('tenis'),'compra uma melhoria na lojinha'); ok(g.buyMesa(2),'compra uma mesa de 2'); ok(g.virarMesa(g.salaoSel),'vira a mesa nova em mesa de 4');
  const pend=g.save.caixaPend, mel=L.UPGRADES.find(u=>u.id==='tenis').cost, sal=L.SALAO.mesa2+L.SALAO.virar;
  ok(pend.mel===mel&&pend.sal===sal,'compras anotadas como pendentes (melhorias '+pend.mel+', salão '+pend.sal+')');
  g.save.equipe=L.normSave({equipe:{tonhao:1}}).equipe; g.save.divulga='redes';
  const r=joga(3), c=g.save.caixa, last=c[c.length-1];
  ok(last.d===3&&last.mel===mel&&last.sal===sal,'a linha do dia 3 traz as compras feitas antes dele');
  ok(g.save.caixaPend.mel===0&&g.save.caixaPend.sal===0,'depois do dia, as pendentes zeram');
  ok(last.folha===L.STAFF.tonhao.levels[1].pay&&last.div===(L.divulgaAberta(3)?L.divulgaOf('redes').cost:0),'equipe e divulgação do dia na linha');
  ok(s0-last.mel-last.sal-last.folha-last.div+last.fat-last.ingr-last.contas===last.saldo,'saldo anterior − compras − equipe − divulgação + faturou − ingredientes − contas = saldo');
  ok(somaOk(last),'a conta do lucro fecha no dia 3'); }

// Turno sem fim não entra no caixa; limite de dias
novo(); { joga(1); g.startEndless(); g.begin(); g.finishEndless(); ok(g.save.caixa.length===1,'Turno sem fim não entra no caixa');
  for(let i=0;i<L.CAIXA_MAX+2;i++){ g.startDay(1); g.begin(); g.money=100+i; g.finishDay(); }
  const c=g.save.caixa; ok(c.length===L.CAIXA_MAX,'guarda só os últimos '+L.CAIXA_MAX+' dias ('+c.length+')');
  ok(c[c.length-1].fat===100+L.CAIXA_MAX+1&&c[0].fat===102,'as linhas mais antigas saem primeiro');
  ok(L.normSave({caixa:c.concat(c)}).caixa.length===L.CAIXA_MAX,'save com linhas demais é cortado no limite'); }

// resumo em texto
novo(); { joga(1); g.goShop(2); g.save.bank+=200; g.buy('tenis'); joga(2);
  const t=L.caixaResumo(g.save), lines=t.split('\n');
  ok(lines[0].indexOf(L.VERSAO)>=0,'resumo: 1ª linha com a versão');
  ok(lines.length===5&&/^Dia 1 [✓✗]: fatura \d+ − ingred\. \d+ − contas \d+ − equipe \d+ = lucro -?\d+ \(meta \d+\).* · saldo \d+$/.test(lines[1]),'resumo: uma linha por dia com a conta do lucro ('+lines[1]+')');
  ok(/compras 150/.test(lines[2]),'resumo: as compras aparecem na linha do dia');
  ok(/^Para onde foi \(2 dias\): ingredientes \d+, contas \d+.*melhorias 150/.test(lines[3]),'resumo: para onde foi o dinheiro');
  ok(/Agora: dia \d+ · R\$ \d+ · lucro acumulado -?\d+ · Tonhão nível 1, sem Dani · boca a boca · garagem com 4 mesas e 10 lugares · melhorias: tênis novos/.test(t),'resumo: dinheiro, equipe, divulgação, salão e melhorias de agora');
  const vazio=L.caixaResumo(L.normSave({})); ok(vazio.split('\n').length===2&&!/Para onde/.test(vazio),'resumo sem dias: só o cabeçalho e o agora'); }

// aba Caixa
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const acha=(e,f)=>f(e)?e:(e.children||[]).reduce((a,c)=>a||acha(c,f),null);
(async()=>{
  novo(); g.goShop(2); let err=null; try{ L.setShopTab('caixa'); }catch(e){ err=e; }
  let grid=els['shop-grid']; ok(!err&&/O caixa começa/.test(txt(grid)),'aba Caixa vazia: explica quando começa'+(err?': '+err:''));
  novo(); joga(1); g.goShop(2); g.save.bank+=200; g.buy('tenis'); joga(2); g.goShop(3); g.virarMesa(1);
  err=null; try{ L.setShopTab('caixa'); }catch(e){ err=e; } grid=els['shop-grid'];
  ok(!err&&/caixa/.test(grid.className),'aba Caixa monta'+(err?': '+err:''));
  const tb=acha(grid,e=>e.tagName==='TABLE'); ok(tb&&tb.children.length===3,'tabela com o cabeçalho e 2 dias');
  ok(tb&&/Dia 2/.test(txt(tb.children[1]))&&/Dia 1/.test(txt(tb.children[2])),'o dia mais novo vem primeiro');
  ok(/Para onde foi o dinheiro nos últimos 2 dias/.test(txt(grid))&&/Melhorias R\$ 150/.test(txt(grid)),'para onde foi o dinheiro, com as melhorias');
  ok(/Compras nesta lojinha: R\$ 100 \(entram na linha do dia 3\)/.test(txt(grid)),'compras desta lojinha avisadas');
  const bar=acha(grid,e=>e.className==='cx-bar'); ok(bar&&bar.children.length===3&&bar.children.every(s=>+s.style.flex>0),'barra empilhada (ingredientes, contas, melhorias) com '+(bar?bar.children.length:0)+' partes');
  const b=acha(grid,e=>e.tagName==='BUTTON'&&e.textContent==='Copiar resumo'); ok(!!b,'botão Copiar resumo');
  b.fire('click'); await new Promise(r=>setTimeout(r,10));
  const st=acha(grid,e=>e.className==='cx-st'), ta=acha(grid,e=>e.tagName==='TEXTAREA');
  ok(st&&/selecione o texto/.test(st.textContent)&&ta&&ta.value===L.caixaResumo(g.save),'sem área de transferência: mostra o resumo para copiar à mão');
  b.fire('click'); await new Promise(r=>setTimeout(r,10)); const conta=e=>(e.tagName==='TEXTAREA'?1:0)+(e.children||[]).reduce((a,c)=>a+conta(c),0); ok(conta(grid)===1,'clicar de novo não duplica o texto');
  L.setShopTab('melhorias'); ok(!/caixa/.test(grid.className),'voltar para Melhorias tira o modo caixa');
  console.log((total-fails)+'/'+total+' ok; fails= '+fails); if(fails) process.exit(1);
})();
