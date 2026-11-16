// v11.13 (etapa 9b): as cenas da Casa Aurora na abertura nova. A 3 (aurora, a rua), a 4 (molho, a cozinha) e a 5 (estrela, o salão de gala)
// deixam de ser cartão de obra: desenham sem erro e devolvem a cabeça de quem fala dentro da tela. O roteiro (ABERTURA2) não muda: smoke88.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TH=600, CENAS=[['aurora',2,['bia','tonhao']],['molho',3,['tonhao']],['estrela',4,['braulio']]];

// ---------- CA1: desenham sem erro e não são mais cartão de obra ----------
[false,true].forEach(rm=>{ const H=load({rm}), {L}=H, R=L.ABERTURA2, ab=new L.Abertura('menu',rm,R);
  CENAS.forEach(([id,i])=>{ let erro=null; const tx=[]; H.ctx.fillText=s=>tx.push(s);
    try{ ab.i=i; [0,0.25,0.5,0.75,0.95].forEach(p=>{ ab.t=R.cenas[i].t*p; ab.tm=20+i+p*7; L.drawAbertura(H.ctx,ab); }); } catch(e){ erro=e; }
    delete H.ctx.fillText;
    ok(!erro,'CA1: a cena '+(i+1)+' ('+id+') desenha em p 0, 0,25, 0,5, 0,75 e 0,95'+(rm?', com movimento reduzido':'')+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:''));
    ok(typeof L.AB2_CENAS[id]==='function' && !tx.includes('cena em obras') && !tx.includes(id),'CA1: a cena '+(i+1)+' não é mais cartão de obra'+(rm?' (movimento reduzido)':'')); }); });
{ const H=load(), {L}=H;
  ok(['aurora','molho','estrela'].every(k=>typeof L.AB2_CENAS[k]==='function'),'CA1: AB2_CENAS tem aurora, molho e estrela ('+Object.keys(L.AB2_CENAS).sort().join()+')');
  // as cenas que ainda faltam (se faltar alguma) seguem como cartão de obra
  const R=L.ABERTURA2, ab=new L.Abertura('menu',false,R), tx=[]; H.ctx.fillText=s=>tx.push(s);
  const falta=R.cenas.map((c,i)=>i).filter(i=>!L.AB2_CENAS[R.cenas[i].id]); let n=0;
  falta.forEach(i=>{ tx.length=0; ab.i=i; ab.t=2; ab.tm=2; L.drawAbertura(H.ctx,ab); if(tx.includes('cena em obras') && tx.includes(R.cenas[i].id)) n++; });
  ok(n===falta.length,'CA1: as cenas ainda sem desenho seguem como cartão de obra ('+n+' de '+falta.length+')'); delete H.ctx.fillText;
  // os cenários existem e desenham sozinhos (a rua, nos dois modos, que a cena 9 reusa)
  let erro=null; try{ const cam={cx:610,cy:300,z:1}; L.ab2RuaAurora(H.ctx,cam,'manha',{T:1}); L.ab2RuaAurora(H.ctx,cam,'tarde',{T:1,abre:1,voo:0.5}); L.ab2CozinhaAurora(H.ctx,cam,{T:1,brilho:1}); L.ab2Gala(H.ctx,cam,{T:1}); } catch(e){ erro=e; }
  ok(!erro,'CA1: ab2RuaAurora (manha e tarde), ab2CozinhaAurora e ab2Gala desenham'+(erro?': '+erro.message:''));
}

// ---------- CA2: a cabeça de quem fala cai na tela, com 40 px de margem, no instante da fala ----------
{ const H=load(), {L}=H, R=L.ABERTURA2, TW=L.TW;
  CENAS.forEach(([id,i,quem])=>{ const c=R.cenas[i];
    ok(JSON.stringify(c.falas.map(f=>f.q))===JSON.stringify(quem),'CA2: na cena '+(i+1)+' fala(m) '+quem.join(' e '));
    c.falas.forEach(f=>{ [f.de,f.de+0.9].forEach(t=>{ const p=t/c.t, cam=L.ab2Cam(c,p);
      let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,10+t,cam); } catch(e){ erro=e; }
      const a=r && r[f.q], q=a ? L.ab2Tela(cam,a[0],a[1]) : null;
      ok(!erro && q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40,'CA2: '+id+', '+f.q+' em '+t.toFixed(1)+' s: a cabeça cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); }); });
    // com movimento reduzido (quadro de p 0,8, câmera no para)
    // com movimento reduzido (quadro de p 0,8, câmera no para): na 5 a câmera termina na Rosa e no Tonhão, e o Bráulio fica fora do quadro
    const cam=L.ab2Cam(c,1), r=L.AB2_CENAS[id](H.ctx,c.pRM!=null?c.pRM:0.8,0,cam), quemRM=id==='estrela'?['tonhao','rosa']:quem;
    ok(quemRM.every(k=>{ const a=r[k], q=a && L.ab2Tela(cam,a[0],a[1]); return q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40; }),'CA2: '+id+', com movimento reduzido, as cabeças de '+quemRM.join(' e ')+' caem na tela');
    if(id==='estrela'){ const a=r.braulio, q=L.ab2Tela(cam,a[0],a[1]); ok(q[0]<0,'CA2: no fim da 5, o Bráulio está fora do quadro (a câmera foi para a porta da cozinha)'); } });
}

console.log(`\nsmoke89: ${total-fails}/${total}`); process.exit(fails?1:0);
