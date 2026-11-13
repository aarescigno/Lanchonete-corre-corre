// v10.2.1, etapa D-1: modo dev em dois jeitos (Livre e De verdade), painel em abas, pular para o começo de qualquer capítulo (e desfazer),
// dinheiro e banco à mão, a equipe pessoa por pessoa, e o save de verdade nunca muda.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const real=JSON.stringify({maxDay:3,bank:420,up:{bandeja:true},torneira:true,cardV:1,histV:1,tonXp:1,daniXp:1,dia:3});
const H=load({historia:true,store:{lcc2_save:real}}); const {g,L,els,store}=H;
H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const salvoNormal=store[L.LS.save];
const dv=()=>H.doc.getElementById('dev-body');
const txt=e=>(e.textContent||'')+(e.children||[]).map(txt).join(' ');

// ---------- 1. Livre: sem História; o caixa volta a R$ 10.000 ----------
g.setDev(true); g.setState('menu');
ok(L.DEV.on && !L.DEV.real && !L.histLiga() && L.devLivre(),'Livre: histLiga() é falso');
g.devDinheiro(-99999); ok(g.save.bank===0,'devDinheiro(-99999) deixa 0');
g.goShop(3); ok(g.save.bank===10000,'no Livre, a lojinha repõe os R$ 10.000'); g.setState('menu');

// ---------- 2. De verdade grava e liga a História ----------
g.devReal(true);
ok(store['lcc2_dev_real']==='1' && L.DEV.real && L.histLiga(),'devReal(true): grava lcc2_dev_real = 1 e histLiga() é verdadeiro');
g.setDev(false); g.setDev(true); ok(L.DEV.real,'o jeito De verdade volta ao religar o dev');
g.devReal(false); ok(store['lcc2_dev_real']==='0' && !L.histLiga(),'devReal(false): grava 0');

// ---------- 3. os ids da tabela existem ----------
{ const C=L.DEV_CAPS, tem=(l,ids)=>(ids||[]).every(id=>l.some(x=>x.id===id));
  ok(C.length===13 && C.every((c,i)=>c.n===i+1) && C.every(c=>L.PONTOS.some(p=>p.id===c.ponto)),'DEV_CAPS: 13 linhas (v10.8), pontos existentes');
  ok(C.every(c=>!c.eq || (tem(L.CURSOS,Object.keys(c.cursos)) && tem(L.DANI_CURSOS,c.dani) && tem(L.JOCA_CURSOS,c.joca) && tem(L.CAMI_CURSOS,c.cami) && tem(L.UPGRADES,c.up))),'DEV_CAPS: todos os ids de cursos e melhorias existem'); }

// ---------- 4. pular para cada capítulo ----------
const TAB={1:[1,'garagem',1,0,[0,0]],2:[4,'garagem',1,300,[0,1]],3:[8,'garagem',1,500,[1,2]],4:[13,'industrial',13,400,[1,2]],5:[17,'industrial',13,900,[2,3]],6:[30,'avenida',30,600,[2,3]],7:[34,'avenida',30,1500,[3,4]],8:[38,'avenida',30,2500,[3,4]],9:[50,'terraco',50,1500,[3,4]],10:[54,'terraco',50,4000,[4,4]],11:[58,'terraco',50,6000,[4,4]],12:[64,'terraco',50,10000,[4,4]],13:[64,'terraco',50,10000,[4,4]]};   // v10.5.2: 12 linhas
for(let n=1;n<=13;n++){
  const [dia,ponto,pdia,caixa,[ton,dan]]=TAB[n];
  ok(g.devCapitulo(n),'devCapitulo('+n+') funciona');
  const sv=g.save;
  ok(sv.cap===n && sv.salao.ponto===ponto && sv.dia===dia && sv.pontoDia===pdia && sv.bank===caixa && sv.equipe.tonhao===ton && sv.equipe.dani===dan,'cap '+n+': dia '+dia+', '+ponto+', caixa '+caixa+', equipe da tabela');
  ok(L.DEV.real && L.histLiga(),'cap '+n+': liga o De verdade');
  if(n<=12) ok(g.capObj()!==null && sv.conversa==='antes','cap '+n+': tem objetivo e a conversa de antes'); else ok(g.capObj()===null && sv.conversa===null,'Fim: sem objetivo nem conversa');
}
{ g.devCapitulo(8); const e=g.save.equipe; ok(e.cami===1 && e.anselmo===2 && e.joca===3 && g.up.espresso && g.up.confGourmet,'cap 8: Cami 1, Anselmo 2, Joca 3, espresso e vitrine gourmet');
  ok(g.save.emp.resto===0 && g.save.libera.cami===2 && g.save.libera.anselmo===2 && g.save.libera.joca===2 && g.save.libera.bia===2,'cap 8: sem empréstimo; Cami, Anselmo, Joca e Bia com o cartão aberto');
  ok(g.save.manual.indexOf('p-avenida')>=0 && g.save.manual.indexOf('p-terraco')<0 && g.save.manual.indexOf('b-sentar')>=0,'cap 8: Manual com o Básico e a Avenida');
  g.devCapitulo(1); ok(g.save.emp.resto===1000 && g.save.emp.ref && g.save.aval.length===0 && g.save.convPlanta===0,'cap 1: reforma inteira, sem nota, conversa da planta ainda por vir');
  g.devCapitulo(13); ok(g.save.equipe.lia===1 && g.save.equipe.anselmo>0 && L.UPGRADES.every(u=>g.up[u.id]),'Fim: tudo no máximo, com a Lia'); }

// ---------- 5. desfazer ----------
{ g.devCapitulo(4); const antes=JSON.stringify(g.save);
  g.devCapitulo(9); ok(g.save.cap===9 && !!store['lcc2_save_dev_bak'],'o pulo guarda lcc2_save_dev_bak');
  ok(g.devDesfaz() && JSON.stringify(g.save)===antes && !store['lcc2_save_dev_bak'],'desfazer volta o save de antes e apaga a cópia');
  ok(!g.devDesfaz(),'sem cópia, não há o que desfazer'); }

// ---------- 6. dinheiro e banco ----------
{ g.devCapitulo(9); g.devDinheiro(-99999); g.devDinheiro(1000); ok(g.save.bank===1000,'devDinheiro(1000) soma 1000'); g.devDinheiro(-99999); ok(g.save.bank===0,'piso 0');
  ok(g.devBanco('pegar') && g.save.emp.resto===1000 && g.save.emp.amort===200,'banco: pegar R$ 1.000');
  ok(g.devBanco('atrasar') && g.save.emp.atr===true,'banco: atrasar a parcela');
  ok(g.devBanco('quitar') && !g.save.emp.resto && !g.devBanco('atrasar') && !g.devBanco('xis'),'banco: quitar; sem dívida não atrasa'); }

// ---------- 7. pessoas, cursos, decoração, manutenção ----------
{ g.devCapitulo(7); g.devNivel('anselmo',-1); ok(g.save.equipe.anselmo===0,'Anselmo 2 -> 0');
  g.devNivel('anselmo',1); ok(g.save.equipe.anselmo===2,'devNivel(anselmo, 1): de 0 a 2'); g.devNivel('anselmo',1); g.devNivel('anselmo',1); ok(g.save.equipe.anselmo===3,'limita no 3');
  g.devNivel('joca',-1); g.devNivel('joca',-1); g.devNivel('joca',-1); ok(g.save.equipe.joca===0,'Joca desce até 0 (pulando o 1)');
  g.devNivel('joca',1); ok(g.save.equipe.joca===2 && g.save.libera.joca===2,'Joca vai de 0 a 2 e fica com o cartão aberto');
  g.devNivel('lia',1); ok(g.save.equipe.lia===0,'Lia não existe na Avenida (de verdade)');
  ok(!g.devNivel('ninguem',1),'pessoa que não existe: false');
  g.devCursos(true); ok(L.CURSOS.every(c=>g.save.cursos[c.id]===2) && g.up.confGourmet,'cursos: todos'); g.devCursos(false); ok(!Object.keys(g.save.cursos).length && !g.up.espresso && !g.up.confGourmet,'cursos: nenhum');
  g.devDecor(true); ok(L.DECOR.every(d=>!d.nivel||d.nivel>3||g.save.decor[d.id]===1),'decoração: toda a da Avenida'); g.devDecor(false); ok(g.save.decor.espada===1 && !g.save.decor.foto,'decoração: nenhuma (a espada fica)');
  g.devManut(0.2); ok(L.MANUT.equip.every(q=>g.save.manut[q.id]===0.2),'manutenção: tudo gasto'); g.devManut(1); ok(L.MANUT.equip.every(q=>g.save.manut[q.id]===1),'tudo novo'); }

// ---------- 8. painel em abas ----------
{ L.DEV.real=true; g.setState('menu');
  L.abrirDev(); const t=()=>txt(dv());
  ok(/Livre/.test(t()) && /De verdade/.test(t()) && /Pular/.test(t()) && /Dinheiro/.test(t()) && /Equipe e lojinha/.test(t()) && /Capítulo/.test(t()),'painel: jeitos, abas e a aba Pular');
  L.DEV.aba='dinheiro'; L.buildDev(); ok(/Caixa:/.test(t()) && /Zerar/.test(t()) && /Quitar/.test(t()) && /Atrasar a parcela/.test(t()),'aba Dinheiro (De verdade): caixa e banco');
  L.DEV.aba='equipe'; L.buildDev(); ok(/Tonhão: nível/.test(t()) && /Anselmo: nível/.test(t()) && /Tudo gasto/.test(t()) && /Decoração/.test(t()),'aba Equipe e lojinha');
  g.devReal(false); L.DEV.aba='dinheiro'; L.buildDev(); ok(/não acaba/.test(t()) && /Passar para De verdade/.test(t()) && !/Zerar/.test(t()),'aba Dinheiro (Livre): só o aviso e o botão');
  L.DEV.aba='pular'; g.devReal(true); L.fecharDev(); }

// ---------- 9. velocidade 8× ----------
{ g.devCapitulo(2); g.setState('menu'); let n=0; const u=g.update; g.update=function(dt){ n++; return u.call(this,dt); }; g.state='playing'; L.DEV.vel=8; L.passoJogo(0.05);
  ok(n===8,'DEV.vel = 8 roda 8 passos por quadro'); g.update=u; L.DEV.vel=1; g.setState('menu'); }

// ---------- 10. o save de verdade nunca muda ----------
ok(store[L.LS.save]===salvoNormal,'lcc2_save (o de verdade) ficou igual do começo ao fim');
{ g.setDev(false); ok(!L.DEV.on && g.save.cap!==undefined && store[L.LS.save]===salvoNormal,'sair do dev: o save de verdade volta intacto'); }

console.log('\n'+total+' testes; fails = '+fails); process.exit(fails?1:0);
