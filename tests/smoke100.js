// v12.3 (etapa 14c): os Desafios com os mesmos clientes para todos (semente por desafio) e o "Copiar relatório" no fim do desafio, só no modo dev.
// CA1 a CA3 (o CA4, a calibração das sementes, é o `DESAFIO=<id> node balance.js 200`; o CA5 é o run_all.sh).
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
const todos=(n,f,out=[])=>{ if(f(n)) out.push(n); (n.children||[]).forEach(c=>todos(c,f,out)); return out; };
const roda=(g,s)=>{ for(let i=0;i<Math.round(s/0.05);i++) g.update(0.05); };
const FAIXA={ soBia:8101, semBravo:8201, efood:8301, junina:8401, jogo:8501, critico:8601, vips:8701 };
const IDS=Object.keys(FAIXA);
const REAL={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1, desafios:{ soBia:2 } };
const mk=(extra,opts)=>load(Object.assign({ store:Object.assign({ lcc2_save:JSON.stringify(REAL) },extra||{}) },opts||{}));
const espera=ms=>new Promise(r=>setTimeout(r,ms));

// ---------- CA1: a semente de cada desafio e os mesmos clientes ----------
bloco('CA1',()=>{
  const sigA=g=>JSON.stringify(g.schedule.map(s=>[s.type,Math.round(s.t*1000),s.color,s.vip,!!s.exig,!!s.critico,s.i]));
  const sigG=g=>{ const o=[]; for(let i=0;i<8;i++){ const x=g.spawn(g.schedule[i]); o.push([x.type,x.size,x.dishes,x.extras,x.bill,x.vip,x.color,JSON.stringify(x.people)]); } return JSON.stringify(o); };
  const sigs={};
  IDS.forEach(id=>{
    const {g,L}=mk(), D=L.DESAFIOS.find(x=>x.id===id), ref=Math.random;
    ok(Number.isInteger(D.semente) && D.semente>=FAIXA[id] && D.semente<=FAIXA[id]+19,'CA1: '+id+': tem semente dentro da faixa '+FAIXA[id]+' a '+(FAIXA[id]+19)+' ('+D.semente+')');
    const res=[], ruidos=[()=>0.5, (()=>{ let a=1; return ()=>{ a=(a*16807)%2147483647; return a/2147483647; }; })(), ref];
    ruidos.forEach(rr=>{ Math.random=rr; try{ g.startDesafio(id); res.push([sigA(g),sigG(g),g.schedule.findIndex(s=>s.critico)]); } finally { Math.random=ref; } });
    ok(res.every(x=>x[0]===res[0][0]) && g.schedule.length>=8,'CA1: '+id+': começado com sorteios diferentes no meio, dá a mesma agenda (tipo, hora, cor, VIP, exigente de '+g.schedule.length+' grupos)');
    ok(res.every(x=>x[1]===res[0][1]),'CA1: '+id+': e os mesmos 8 primeiros grupos (tamanho, pessoas, pedidos e conta)');
    if(id==='critico') ok(res.every(x=>x[2]===res[0][2]) && res[0][2]>=0,'CA1: Noite do crítico: o crítico é o mesmo grupo ('+res[0][2]+')');
    ok(g.tm!==null && g.teste===null,'CA1: '+id+': as medidas (g.tm) correm também no desafio');
    sigs[id]=res[0][0]; });
  ok(new Set(IDS.map(id=>sigs[id])).size===IDS.length,'CA1: desafios diferentes dão agendas diferentes');
  { const {g}=mk(), r0=Math.random; g.startDesafio('vips'); ok(Math.random===r0,'CA1: o Math.random original volta depois do sorteio com semente'); }
  { const {g,L}=mk(); const r=g.startTeste('garagem'); ok(g.desafio.semente===7001 && g.teste.semente===7001,'CA1: (controle) o Teste de habilidade segue com a semente dele'); }
});

bloco('CA1 (dev)',()=>{
  const {g,L}=mk(); g.setDev(true); const forca={ vip:'vem', apito:'apita', clima:'chuva' }; L.DEV.forca=forca;
  g.startDesafio('vips'); const sig=x=>JSON.stringify(x.schedule.map(s=>[s.type,Math.round(s.t*1000),s.color,s.vip]));
  ok(Object.keys(L.DEV.forca).length===0,'CA1: durante o Desafio, o DEV.forca fica vazio (decisão do usuário, 17/11)');
  const a=sig(g); g.startDesafio('vips'); ok(sig(g)===a,'CA1: e a agenda é a mesma com os forçados do dev ligados ou não');
  g.setState('menu'); ok(L.DEV.forca===forca && forca.vip==='vem','CA1: ao sair, o DEV.forca de antes volta'); });

// ---------- CA2: o relatório no fim do desafio, só no modo dev ----------
const fecha=(g,id,lucro,extra)=>{ g.startDesafio(id); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+lucro; g.stats.lost=0; g.stats.lostBy.retirada=0; Object.assign(g.stats,extra||{}); g.finishDay(); return g.desafioRes; };
(async()=>{
  try {
    bloco('CA2',()=>{});
    { const {g,els}=mk(); fecha(g,'soBia',g.day?0:0);
      ok(g.state==='desafiofim' && els['btn-desafio-copia'].style.display==='none','CA2: fora do modo dev, o botão "Copiar relatório" do desafio não existe (escondido)'); }
    const dev=()=>{ const H=mk(); H.g.setDev(true); return H; };
    { const H=dev(), {g,els,L}=H; g.startDesafio('soBia'); g.begin(); const meta=g.day.meta; g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+meta+10; g.finishDay();
      const rel=g.testeRel, l=rel.split('\n');
      ok(g.state==='desafiofim' && els['btn-desafio-copia'].style.display!=='none','CA2: no modo dev, o fim do desafio tem "Copiar relatório"');
      ok(l[0]==='LCC-TESTE 3 · '+L.VERSAO+' · Desafio: Só a Bia · dia 17 · semente '+L.DESAFIOS[0].semente,'CA2: a 1ª linha: '+l[0]);
      ok(/^Resultado:/.test(l[3]) && /^Desafio: medalha de (bronze|prata|ouro) · regra — $|^Desafio: medalha de (bronze|prata|ouro) · regra —$/.test(l[4]) && /^Equipe: /.test(l[2]),'CA2: depois do Resultado, a linha do Desafio (medalha, desafio sem regra: —; v12.4: com a linha Equipe antes do Resultado): '+l[4]);
      ok(/tentativa 1 /.test(l[1]),'CA2: a tentativa 1 ('+l[1]+')'); }
    { const {g,L}=dev(); fecha(g,'semBravo',0,{}); /* sem a meta: sem medalha */
      const l=g.testeRel.split('\n'); ok(l[4]==='Desafio: sem medalha · regra valeu','CA2: sem a meta, a regra que valeu: '+l[4]); }
    { const {g,L}=dev(); g.startDesafio('semBravo'); g.begin(); const meta=g.day.meta; g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+meta+10; g.stats.lost=2; g.finishDay();
      const l=g.testeRel.split('\n'); ok(l[4]==='Desafio: sem medalha · regra não valeu','CA2: com a regra que não valeu (alguém saiu bravo): '+l[4]); }
    { const {g,L}=dev(); g.startDesafio('semBravo'); g.begin(); const meta=g.day.meta; g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+meta+10; g.finishDay();
      const l=g.testeRel.split('\n'); ok(/^Desafio: medalha de (bronze|prata|ouro) · regra valeu$/.test(l[4]),'CA2: meta batida e regra valeu: '+l[4]); }
    // o clique: copia, ou mostra a caixa
    { const H=mk(); const cr=H.doc.createElement, cap={ v:null }; H.doc.createElement=t=>{ const e=cr(t); e.select=()=>{}; return e; }; H.doc.body={ appendChild(c){ cap.v=c.value; }, removeChild(){} }; H.doc.execCommand=()=>true;
      const {g,els}=H; g.setDev(true); g.startDesafio('soBia'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+10; g.finishDay();
      els['btn-desafio-copia'].fire('click'); await espera(10);
      ok(cap.v===g.testeRel && /^LCC-TESTE 3/.test(cap.v) && txt(els['desafio-fim-aviso'])==='Copiado! Cole na conversa.','CA2: o clique copia o relatório e mostra "Copiado! Cole na conversa."');
      ok(!/LCC-TESTE/.test(txt(els['ov-desafio-fim'])),'CA2: o relatório fica fora da tela'); }
    { const H=mk(); const {g,els}=H; g.setDev(true); g.startDesafio('soBia'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+10; g.finishDay();
      els['btn-desafio-copia'].fire('click'); await espera(10);
      ok(todos(els['desafio-fim-caixa'],n=>n.tagName==='TEXTAREA').length===1,'CA2: se a cópia falha, a caixa com o texto');
      els['btn-desafio-de-novo'].fire('click'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+10; g.finishDay();
      ok(g.state==='desafiofim' && txt(els['desafio-fim-aviso'])==='' && todos(els['desafio-fim-caixa'],n=>n.tagName==='TEXTAREA').length===0,'CA2: no 2º fim, o aviso e a caixa da cópia anterior somem'); }

    // ---------- CA3: a tentativa d-<id> ----------
    bloco('CA3',()=>{});
    { const H=mk(), {g,store,L}=H; const tent=()=>JSON.parse(store['lcc-teste']||'{}');
      g.startDesafio('soBia'); ok(tent()['d-soBia']===1,'CA3: começar o desafio conta a tentativa d-soBia (1)');
      g.startDesafio('soBia'); g.startDesafio('vips'); ok(tent()['d-soBia']===2 && tent()['d-vips']===1,'CA3: soBia 2 e vips 1 (cada um com a sua)');
      g.startTeste('garagem'); ok(tent().garagem===1 && tent()['d-soBia']===2 && !('d-garagem' in tent()),'CA3: o Teste de habilidade tem a chave dele, separada ('+JSON.stringify(tent())+')');
      g.sairDesafio();
      const sv=JSON.stringify(g.save.desafios); g.startDesafio('efood'); ok(JSON.stringify(g.salvo.desafios)===sv && g.salvo.desafios.soBia===2,'CA3: as medalhas do save não mudam com a versão (soBia 2 fica)'); }
    { const {g,L}=mk(); g.startDesafio('soBia'); g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.custo=0; g.money=g.fixo+g.day.meta+10; g.finishDay();
      ok(g.testeRel.split('\n')[1].indexOf('tentativa 1 ')>0 && g.salvo.desafios.soBia>=1,'CA3: a tentativa vai ao relatório, e a medalha do desafio segue sendo gravada'); }
  } catch(e){ total++; fails++; console.log('FAIL: lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); }
  console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
})();
