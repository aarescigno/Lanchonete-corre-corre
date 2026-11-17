// v12.3.2: o relatório do Teste diz se foi jogado no celular, no tablet ou no computador (formato 2).
// CA1 a CA4.
const load=require('./harness.js');
const fs=require('fs'), os=require('os'), path=require('path'), cp=require('child_process');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const bloco=(nome,fn)=>{ try{ fn(); }catch(e){ total++; fails++; console.log('FAIL: '+nome+' lançou '+String(e&&e.stack||e).split('\n').slice(0,3).join(' | ')); } };
const REAL={ dia:70, bank:12345, estrelas:77, lucroTot:54321, histV:1, capV:6, cap:15, conversa:null, salao:{ponto:'terraco'}, treino:true, convEnt:1, convCard:1, convDiv:1, convPlanta:1, convSocorro:1, desafios:{ soBia:2 } };
const mk=(extra,opts)=>load(Object.assign({ store:Object.assign({ lcc2_save:JSON.stringify(REAL) },extra||{}) },opts||{}));
const fecha=g=>{ g.begin(); g.schedule=[]; g.nextIdx=0; g.groups=[]; g.queue=[]; g.custo=0; g.money=g.fixo+g.day.meta+10; g.finishDay(); };

bloco('CA1',()=>{
  const {L}=mk(), t=L.tipoAparelho;
  ok(typeof t==='function','CA1: tipoAparelho está no __lcc');
  const IPHONE='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  const ANDM='Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';
  const ANDT='Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  const IPAD='Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  const MAC='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
  const WIN='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  ok(t(IPHONE,5,undefined)==='celular','CA1: iPhone (Safari) é celular');
  ok(t(ANDM,5,undefined)==='celular','CA1: Android com "Mobile" é celular');
  ok(t(ANDT,5,undefined)==='tablet','CA1: Android sem "Mobile" é tablet');
  ok(t(IPAD,5,undefined)==='tablet','CA1: iPad é tablet');
  ok(t(MAC,5,undefined)==='tablet','CA1: Macintosh com 5 toques (iPad que se diz Mac) é tablet');
  ok(t(MAC,0,undefined)==='computador','CA1: Macintosh com 0 toques é computador');
  ok(t(WIN,0,undefined)==='computador','CA1: Windows Chrome é computador');
  ok(t(WIN,0,true)==='celular' && t(MAC,5,true)==='celular','CA1: com uaMobile true, qualquer UA é celular'); });

bloco('CA2',()=>{
  { const {g,L}=mk({ lcc2_name:'Ana' }); g.setDev(true); g.startTeste('garagem'); fecha(g);
    const l=g.testeRel.split('\n');
    ok(/^LCC-TESTE 2 · /.test(l[0]) && L.VERSAO==='v12.3.2','CA2: a 1ª linha começa com "LCC-TESTE 2 · " ('+l[0].slice(0,30)+')');
    ok(/^Jogador: Ana · tentativa 1 · bot · bot - · \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(l[1]),'CA2: no bot, "bot · bot -" ('+l[1]+')'); }
  { const {g,L}=mk({ lcc2_name:'Ana' },{ navigator:{ userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148', maxTouchPoints:5 } }); g.setDev(true); g.startTeste('garagem'); g.begin(); g.tm.aparelho='toque';
    const l=L.testeRelatorio(g).split('\n');
    ok(/^Jogador: Ana · tentativa 1 · celular · toque \d+×\d+ · /.test(l[1]),'CA2: no celular, o tipo vem entre a tentativa e o toque ('+l[1]+')'); } });

bloco('CA3',()=>{
  const {g,L}=mk(); g.setDev(true); g.startDesafio('soBia'); fecha(g);
  const l=g.testeRel.split('\n');
  ok(/^LCC-TESTE 2 · /.test(l[0]) && /^Jogador: .+ · tentativa 1 · bot · bot - · /.test(l[1]),'CA3: o relatório do Desafio também traz o tipo ('+l[1]+')'); });

bloco('CA4',()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lcc-rel-')), arq=path.join(tmp,'rel.md');
  const bloco2=(fmt,jog,tipo)=>['LCC-TESTE '+fmt+' · v12.3 · Garagem · dia 7 · semente 7001',
    'Jogador: '+jog+' · tentativa 1 · '+(fmt===2?tipo+' · ':'')+'toque 412×915 · 17/11/2026 18:40',
    'Resultado: lucro R$ 150 · meta R$ 200 (75%) · ★ · servidos 10 de 12 · Gúgou 4,1',
    'Perdidos: 2 · fila sem mesa 1 · fila com mesa 0 · pedido 0 · prato 1 · conta 0 · retirada 0 · esfriou 0',
    'Reação em s (média / mediana / casos): sentar 1,5 / 1,5 / 3 · pedido 2,0 / 2,0 / 3 · prato — · conta — · mesa suja —',
    'Ritmo: 30,0 ações/min · 2 toques perdidos · fila média 1,0',
    'Bia parada: 10% do turno com coisa à espera'].join('\n');
  fs.writeFileSync(arq,'\n'+bloco2(1,'Zé')+'\n\n'+bloco2(2,'Ana','celular')+'\n\n'+bloco2(2,'Bia','computador')+'\n');
  const raiz=path.resolve(__dirname,'..');
  const out=cp.execFileSync('python3',[path.join(raiz,'ferramentas','relatorios.py'),arq],{ encoding:'utf8' });
  fs.rmSync(tmp,{ recursive:true, force:true });
  ok(/3 relatórios lidos$/m.test(out) && !/ignorado/.test(out),'CA4: lê os três blocos (um no formato 1 e dois no 2) sem ignorar nenhum');
  ok(/celular 1 · computador 1 · \? 1/.test(out) || /\? 1/.test(out) && /celular 1/.test(out) && /computador 1/.test(out),'CA4: o resumo da fase conta por tipo, com "?" para o formato 1 ('+(out.match(/.*celular.*/)||[''])[0]+')');
  ok(/^Ana \(celular\): /m.test(out) && /^Zé \(\?\): /m.test(out),'CA4: a linha de cada jogador mostra o tipo'); });

console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
