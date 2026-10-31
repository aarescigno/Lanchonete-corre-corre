// v9.2.1, etapa 3b-2d: painel do modo dev. Qualquer dia, ponto, nota, equipe, cursos e melhorias; a lojinha com preços e travas de verdade
// (DEV.real); velocidade e "encerrar o dia" no meio do dia. O jogo normal não muda e o save normal nunca é tocado.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const real=JSON.stringify({maxDay:3,bank:420,up:{bandeja:true},torneira:true,cardV:1,histV:1,tonXp:1,daniXp:1,dia:3});
const H=load({store:{lcc2_save:real}}); const {g,L,els,store}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');
const vis=id=>els[id].style.display!=='none';
const ov=()=>H.doc.getElementById('ov-dev'), dv=()=>H.doc.getElementById('dev-body');
const salvoNormal=store[L.LS.save];

// ---------- 1. fora do modo dev ----------
{ const antes=JSON.stringify(g.save);
  ok(!g.devDia(5) && !g.devPonto('industrial') && !g.devNota(3) && !g.devEquipe('max') && !g.devMelhorias(true) && !g.devCaixa(5) && !g.devReal(true) && !g.devFimDia(),'fora do dev, todas as dev* devolvem false');
  ok(JSON.stringify(g.save)===antes && store[L.LS.save]===salvoNormal,'e não mexem no save');
  ok(!vis('devbadge') && !ov().classList.contains('show'),'#devbadge e #ov-dev escondidos');
  g.setState('menu'); let n=0; const u=g.update; g.update=function(dt){ n++; return u.call(this,dt); }; L.DEV.vel=4; L.passoJogo(0.05);
  ok(n===1,'passoJogo faz um update só (fora do dev, mesmo com vel 4)'); g.update=u; L.DEV.vel=1; }

// ---------- 2. liga o dev ----------
g.setDev(true); g.setState('menu');
ok(L.DEV.on && g.save.bank===10000 && !L.DEV.real && L.DEV.vel===1 && L.devLivre() && vis('devbadge'),'dev ligado: R$ 10.000, devLivre, selo "painel" visível');

// ---------- 3. dia ----------
{ ok(g.devDia(35) && g.proxDia===35,'devDia(35)'); g.devDia(0); ok(g.proxDia===1,'devDia(0) -> 1'); g.devDia(120); ok(g.proxDia===99,'devDia(120) -> 99');
  g.devDia(35); g.goShop(35); g.devDia(20); ok(g.shopNext===20 && g.proxDia===20,'na lojinha, shopNext acompanha'); g.setState('menu'); }

// ---------- 4. ponto ----------
{ g.devDia(40);
  g.devPonto('avenida'); ok(g.ponto.nivel===3 && g.save.pontoDia===40 && !g.save.equipe.tv && !g.up.tvs && !g.up.maquina,'devPonto(avenida): nível 3, pontoDia = dia, sem TV/TVs/máquina');
  ok(!g.salaoProblema,'avenida: salão sem problema');
  g.devPonto('garagem'); ok(g.ponto.nivel===1 && !g.salaoProblema,'devPonto(garagem): desce, salão sem problema');
  g.devPonto('industrial'); ok(g.ponto.nivel===2 && !g.salaoProblema && g.kitchen.slots,'devPonto(industrial): sobe, salão sem problema');
  ok(!g.devPonto('naoexiste'),'ponto que não existe: false'); }

// ---------- 5. nota ----------
{ g.devNota(3.4); ok(g.notaGurugol===3.4,'devNota(3.4) na área industrial'); g.devPonto('garagem'); g.devNota(5); ok(g.notaGurugol===3,'devNota(5) na Garagem -> teto 3');
  g.devNota(0); ok(g.notaGurugol===null,'devNota(0) limpa'); g.devPonto('industrial'); }

// ---------- 6. equipe ----------
{ g.devEquipe('max'); const e=g.save.equipe;
  ok(e.tonhao===L.STAFF.tonhao.levels.length-1 && e.dani===L.STAFF.dani.levels.length-1 && e.joca===L.STAFF.joca.levels.length-1,'max: níveis máximos');
  ok(L.CURSOS.every(c=>g.save.cursos[c.id]===2) && L.DANI_CURSOS.every(c=>g.save.daniCursos[c.id]) && L.JOCA_CURSOS.every(c=>g.save.jocaCursos[c.id]),'max: todos os cursos');
  g.devEquipe('zero'); ok(g.save.equipe.tonhao===0 && g.save.equipe.dani===1 && g.save.equipe.joca===0 && !Object.keys(g.save.cursos).length && !Object.keys(g.save.daniCursos).length && !Object.keys(g.save.jocaCursos).length,'zero: Tonhão 0, Dani 1, Joca 0, sem cursos'); }

// ---------- 7. melhorias ----------
{ g.devMelhorias(true); ok(L.UPGRADES.every(u=>g.up[u.id]),'todas as melhorias ligadas'); g.devMelhorias(false); ok(!L.UPGRADES.some(u=>g.up[u.id]),'nenhuma depois de tirar'); }

// ---------- 8. preços e travas de verdade ----------
{ g.devReal(true); g.devCaixa(0); g.devNota(2);
  const f=g.mudancaFalta; ok(!L.devLivre() && f && f.din>0 && f.nota>0,'devReal: mudancaFalta com din e nota');
  const id=L.UPGRADES.find(u=>!u.req&&!u.multi&&u.nivel==null)||L.UPGRADES[0]; ok(!g.buy(id.id),'devReal sem dinheiro: buy falha');
  g.goShop(g.proxDia); ok(g.save.bank===0,'goShop não devolve os R$ 10.000'); g.setState('menu');
  g.devReal(false); ok(g.mudancaFalta===null && g.save.bank>=10000 && L.devLivre(),'devReal(false): tudo liberado e banco >= 10.000'); }

// ---------- 9. velocidade e fim do dia ----------
{ g.devDia(10); g.devNota(3.4); g.resetDay(10); g.begin(); g.setState('playing');
  const c0=g.clock; L.DEV.vel=4; L.passoJogo(0.05); ok(Math.abs((c0-g.clock)-0.2)<0.01,'vel 4: o clock cai ~0,2 s por passo de 0,05');
  L.DEV.vel=1; g.pause(); ok(g.state==='paused' && g.devFimDia() && g.state==='playing' && g.clock===0,'devFimDia na pausa: volta a playing e zera o clock');
  for(let i=0;i<400 && g.state==='playing';i++) g.update(0.05);
  for(let i=0;i<400 && g.state!=='dayend' && g.state!=='falencia' && g.state!=='shop';i++) g.update(0.05);
  ok(['dayend','falencia','shop'].includes(g.state),'o dia termina ('+g.state+')'); g.setState('menu'); }

// ---------- 10. o painel ----------
{ g.setState('menu'); L.abrirDev(); const p=ov();
  const t=txt(dv());
  ok(p.classList.contains('show') && /Dia/.test(t) && /Ponto/.test(t) && /Nota do Gurugol/.test(t) && /Equipe, cursos e melhorias/.test(t) && /Lojinha de verdade/.test(t) && !/No dia/.test(t),'menu: seções Dia, Ponto, Nota, Equipe e Lojinha de verdade, sem "No dia"');
  const bt=dv().children.filter(c=>c.className==='row').reduce((a,r)=>a.concat(r.children),[]);
  ok(bt.filter(b=>L.PONTOS.some(p=>p.nome===b.textContent)).length===L.PONTOS.length,'um botão por ponto');
  const d0=g.proxDia, mais10=bt.find(b=>b.textContent==='+10'); mais10.fire('click');
  ok(g.proxDia===Math.min(99,d0+10) && /Dia /.test(txt(dv())),'tocar +10 muda o dia');
  L.fecharDev(); ok(!p.classList.contains('show'),'fecharDev esconde o painel');
  g.devDia(10); g.resetDay(10); g.begin(); g.setState('playing'); g.pause(); L.abrirDev();
  ok(/No dia/.test(txt(dv())) && /Velocidade/.test(txt(dv())) && /Encerrar o dia agora/.test(txt(dv())),'na pausa de um dia da carreira: "No dia" aparece'); L.fecharDev(); g.setState('menu');
  ok(H.doc.getElementById('devbadge').listeners && H.doc.getElementById('devbadge').listeners.click,'o selo "Modo dev · painel" é um botão com clique');
  H.doc.getElementById('devbadge').fire('click'); ok(ov().classList.contains('show'),'tocar no selo abre o painel'); H.doc.getElementById('btn-dev-close').fire('click'); ok(!ov().classList.contains('show'),'Fechar fecha'); }

// ---------- 11. sai do dev ----------
{ L.DEV.vel=4; g.devReal(true); g.setDev(false);
  ok(!L.DEV.on && L.DEV.vel===1 && L.DEV.real===false && store[L.LS.save]===salvoNormal,'setDev(false): vel 1, real false e o save normal igual ao do começo'); }

console.log('smoke44: total =',total,' fails =',fails);
process.exit(fails?1:0);
