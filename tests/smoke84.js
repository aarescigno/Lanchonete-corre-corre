// v11.8, etapa 8h: as reações da Bia durante o dia (docs/ARCO.md §11; spec em docs/spec-v11.8.md).
// CA1 BIA_REACAO e o gesto pelo nivel do ponto; CA2 os três gatilhos (mesa com 5 corações, grupo bravo, meta batida) sem efeito no jogo; CA3 duração, movimento reduzido e reset;
// CA4 drawBia desenha os 6 gestos nas 4 roupas e eles diferem; CA5 modo dev. O desenho em si: shot_v11_8.js.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const H=load({historia:true}); H.doc.createTextNode=t=>({textContent:String(t),children:[]});
const {L,g}=H;
const IDS=['garagem','industrial','avenida','terraco'];
const grava=()=>{ const log=[]; const t={};
  return { log, ctx:new Proxy(t,{ get:(o,k)=>{ if(k in o) return o[k]; if(k==='measureText') return ()=>({width:10}); if(/^create(Linear|Radial)Gradient$/.test(k)) return ()=>({addColorStop(){}});
      return (...a)=>{ log.push(k+'('+a.map(x=>typeof x==='number'?Math.round(x*10)/10:String(x)).join(',')+')'); }; },
    set:(o,k,v)=>{ if(k==='fillStyle'||k==='strokeStyle') log.push('cor:'+v); o[k]=v; return true; } }) }; };
const desenha=(roupa,o)=>{ const r=grava(); L.drawBia(r.ctx,{},100,200,Object.assign({ roupa },o||{})); return r.log.join('|'); };
// um dia de carreira no ponto n (1 a 4), sem chegadas sozinhas
const dia=n=>{ g.mode='carreira'; g.save=L.normSave({ maxDay:30, bank:9000, dia:30, histV:0, salao:{ ponto:IDS[n-1] } }); g.up=g.save.up; g.buildTables(); g.startDay(30); g.begin(); g.schedule=[]; g.nextIdx=0; g.bia.reacao=null; };
const chega=()=>g.spawn({ type:'estudante', color:0, vip:false });
const paga=(h)=>{ const grp=chega(); const t=g.tables.find(t=>t.open&&!t.group); grp.size=1; grp.people=grp.people.slice(0,1); g.seatGroup(grp,t); grp.setState('wantBill'); grp.hearts=h; grp.juiceWant=0; g.collectBill(grp,t); return grp; };
const id=()=>g.bia.reacao&&g.bia.reacao.id;

// ---------- CA1: BIA_REACAO e o gesto pelo ponto ----------
{ const B=L.BIA_REACAO;
  ok(B && B.dur===0.8,'CA1 BIA_REACAO.dur é 0,8 s');
  ok(B && B.por.mesa.join()==='sorriso,punho' && B.por.bravo.join()==='cabeca,respira' && B.por.meta.join()==='suspiro,cintura','CA1 os 6 gestos: mesa (sorriso, punho), bravo (cabeca, respira), meta (suspiro, cintura)');
  const esp={ mesa:['sorriso','sorriso','punho','punho'], bravo:['cabeca','cabeca','respira','respira'], meta:['suspiro','suspiro','cintura','cintura'] };
  let tudo=true; for(const k of Object.keys(esp)) for(let n=1;n<=4;n++){ dia(n); g.bia.reage(k); if(id()!==esp[k][n-1]) tudo=false; }
  ok(tudo,'CA1 o gesto sai do nivel do ponto: 1 e 2 o primeiro de cada par, 3 e 4 o segundo'); }

// ---------- CA2: os gatilhos, sem efeito no jogo ----------
{ dia(1); paga(5); ok(id()==='sorriso','CA2 mesa que paga com 5 corações na Garagem: sorriso');
  dia(3); paga(5); ok(id()==='punho','CA2 mesa que paga com 5 corações na Avenida: punho');
  dia(3); paga(4); ok(id()===null || id()===undefined,'CA2 com menos de 5 corações, nada');
  dia(2); const grp=chega(); g.angryLeave(grp); ok(id()==='cabeca','CA2 grupo que vai embora bravo na área industrial: cabeca');
  dia(4); const gr2=chega(); g.angryLeave(gr2); ok(id()==='respira','CA2 grupo que vai embora bravo no Terraço: respira');
  dia(1); g.bia.reage('mesa'); paga(5); const g3=chega(); g.angryLeave(g3); ok(id()==='cabeca' && g.bia.reacao.t===0,'CA2 a reação nova substitui a anterior (e reinicia o relógio)');
  // o dia fecha: meta batida dispara 'meta', meta não batida não dispara
  dia(1); g.money=g.day.meta+500; g.update(0.05); ok(g.ending && id()==='suspiro','CA2 o dia que fecha com a meta batida (Garagem): suspiro');
  dia(3); g.money=g.day.meta+5000; g.update(0.05); ok(g.ending && id()==='cintura','CA2 o dia que fecha com a meta batida (Avenida): cintura');
  dia(1); g.money=0; g.update(0.05); ok(g.ending && !id(),'CA2 o dia que fecha sem bater a meta: nenhuma reação');
  // sem efeito no jogo
  dia(3); const b=g.bia; b.x=300; b.y=300; b.acts=[{ type:'clear' }]; b.phase='idle';
  const antes=JSON.stringify({ m:g.money, l:g.lucro, s:g.stats, x:b.x, y:b.y, a:b.acts.length, c:g.clock, p:g.pontos, st:g.stars });
  b.reage('mesa'); b.reage('bravo'); b.reage('meta'); L.DEV.on=false;
  const depois=JSON.stringify({ m:g.money, l:g.lucro, s:g.stats, x:b.x, y:b.y, a:b.acts.length, c:g.clock, p:g.pontos, st:g.stars });
  ok(antes===depois,'CA2 disparar a reação não muda dinheiro, lucro, stats, posição, ações, relógio, pontos nem estrelas'); }

// ---------- CA3: duração, movimento reduzido, reset ----------
{ dia(1); g.bia.reage('mesa'); const b=g.bia; b.reacaoAnda(0.4); ok(b.reacao && Math.abs(b.reacao.t-0.4)<1e-6,'CA3 reacaoAnda avança o relógio do gesto');
  b.reacaoAnda(0.39); ok(!!b.reacao,'CA3 com 0,79 s o gesto ainda está lá'); b.reacaoAnda(0.02); ok(!b.reacao,'CA3 passados 0,8 s o gesto some');
  b.reage('bravo'); g.update(0.05); ok(b.reacao && b.reacao.t>0,'CA3 o Game.update anda o relógio do gesto');
  b.reage('bravo'); b.reset(); ok(!b.reacao,'CA3 reset zera a reação');
  g.pause(); b.reage('mesa'); g.update(0.05); ok(b.reacao && b.reacao.t>0,'CA3 o gesto também anda com o jogo pausado (painel do modo dev aberto)'); g.resume();
  const R=load({ historia:true, rm:true }); const gm=R.g; gm.mode='carreira'; gm.bia.reage('mesa'); ok(!gm.bia.reacao,'CA3 com movimento reduzido nada é disparado'); }

// ---------- CA4: o desenho ----------
{ const G=['sorriso','punho','cabeca','respira','suspiro','cintura'];
  let e=null; try{ for(const r of [1,2,3,4]) for(const x of G) for(const p of [0,0.1,0.5,0.9,1]) for(const mv of [false,true]){ desenha(r,{ reacao:{ id:x, p }, moving:mv, ph:1.1, t:1 }); desenha(r,{ reacao:{ id:x, p }, flip:-1, s:2 }); } }catch(x){ e=x; }
  ok(!e,'CA4 os 6 gestos nas 4 roupas, parados e andando, de frente e de costas, sem erro'+(e?' ('+e.message+')':''));
  let dif=true; for(const r of [1,2,3,4]){ const base=desenha(r,{ t:1 }), v=G.map(x=>desenha(r,{ reacao:{ id:x, p:0.5 }, t:1 })); if(v.some(s=>s===base)) dif=false; if(new Set(v).size!==6) dif=false; }
  ok(dif,'CA4 cada gesto dá um desenho diferente dos outros cinco e do sem gesto (nas 4 roupas)');
  let zero=true; for(const r of [1,2,3,4]){ const base=desenha(r,{ t:1 }); G.forEach(x=>{ if(desenha(r,{ reacao:{ id:x, p:0 }, t:1 })!==base || desenha(r,{ reacao:{ id:x, p:1 }, t:1 })!==base) zero=false; }); }
  ok(zero,'CA4 em p = 0 e p = 1 o desenho é o mesmo do sem gesto (o gesto entra e sai sem salto)');
  ok(desenha(1,{ t:1 })===desenha(1,{ t:1, reacao:null }),'CA4 sem gesto o desenho não muda'); }

// ---------- CA5: modo dev ----------
{ const HH=load({ historia:true }), gg=HH.g; gg.mode='carreira';
  ok(gg.devReacao('mesa')===false && !gg.bia.reacao,'CA5 sem o modo dev o devReacao não faz nada');
  gg.setDev(true);
  ok(gg.devReacao('mesa')===true && gg.bia.reacao && gg.bia.reacao.id==='sorriso','CA5 devReacao("mesa") dispara o gesto do ponto de agora');
  ok(gg.devReacao('bravo')===true && gg.bia.reacao.id==='cabeca' && gg.devReacao('meta')===true && gg.bia.reacao.id==='suspiro','CA5 devReacao("bravo") e ("meta") também');
  ok(gg.devReacao('xis')===false,'CA5 tipo inválido é recusado');
  const els=HH.els; HH.L.abrirDev(); HH.L.DEV.aba='hoje'; HH.L.buildDev();
  const body=els['dev-body'], txt=n=>(n.textContent||'')+(n.children||[]).map(txt).join(' ');
  ok(/Reação da Bia/.test(txt(body)),'CA5 a aba Hoje tem a linha "Reação da Bia"');
  const botoes=[]; const ach=n=>{ if(n.tagName==='BUTTON') botoes.push(n); (n.children||[]).forEach(ach); }; ach(body);
  ok(['Mesa feliz','Grupo bravo','Meta'].every(x=>botoes.some(b=>b.textContent===x)),'CA5 a linha tem os botões "Mesa feliz", "Grupo bravo" e "Meta"');
  gg.bia.reacao=null; botoes.find(b=>b.textContent==='Grupo bravo').fire('click'); ok(gg.bia.reacao && gg.bia.reacao.id==='cabeca','CA5 o botão "Grupo bravo" dispara o gesto'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails);
if(fails) process.exit(1);
