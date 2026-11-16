// v11.14 (etapa 9c): a perda e a promessa na abertura nova. A 6 (despedida, o quarto), a 7 (janela, a cozinha de casa à noite) e a 8 (promessa,
// o tempo passa e a cozinha vira lar) deixam de ser cartão de obra. A 8 começa no quadro em que a 7 termina. O roteiro não muda: smoke88.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const perto=(a,b,e)=>Math.abs(a-b)<=(e||1e-6);
const TH=600, CENAS=[['despedida',5,['rosa','bia']],['janela',6,[]],['promessa',7,['bia']]];

// ---------- CA1: desenham sem erro e não são mais cartão de obra ----------
[false,true].forEach(rm=>{ const H=load({rm}), {L}=H, R=L.ABERTURA, ab=new L.Abertura('menu',rm,R);
  CENAS.forEach(([id,i])=>{ let erro=null; const tx=[]; H.ctx.fillText=s=>tx.push(s);
    let obra=false;   // (em p 0,95 a troca "passa" já mostra a cena seguinte, que pode estar em obra: o cartão só não pode aparecer até p 0,75)
    try{ ab.i=i; [0,0.25,0.5,0.75,0.95].forEach(p=>{ ab.t=R.cenas[i].t*p; ab.tm=40+i+p*7; L.drawAbertura(H.ctx,ab); if(p<=0.75 && tx.includes('cena em obras')) obra=true; }); } catch(e){ erro=e; }
    delete H.ctx.fillText;
    ok(!erro,'CA1: a cena '+(i+1)+' ('+id+') desenha em p 0, 0,25, 0,5, 0,75 e 0,95'+(rm?', com movimento reduzido':'')+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:''));
    ok(typeof L.AB2_CENAS[id]==='function' && !obra && !tx.includes(id),'CA1: a cena '+(i+1)+' não é mais cartão de obra'+(rm?' (movimento reduzido)':'')); }); });
{ const H=load(), {L}=H, R=L.ABERTURA;
  ok(['despedida','janela','promessa'].every(k=>typeof L.AB2_CENAS[k]==='function'),'CA1: AB2_CENAS tem despedida, janela e promessa ('+Object.keys(L.AB2_CENAS).sort().join()+')');
  const ab=new L.Abertura('menu',false,R), tx=[]; H.ctx.fillText=s=>tx.push(s);
  const falta=R.cenas.map((c,i)=>i).filter(i=>!L.AB2_CENAS[R.cenas[i].id]); let n=0;
  falta.forEach(i=>{ tx.length=0; ab.i=i; ab.t=2; ab.tm=2; L.drawAbertura(H.ctx,ab); if(tx.includes('cena em obras') && tx.includes(R.cenas[i].id)) n++; });
  ok(n===falta.length,'CA1: as cenas ainda sem desenho seguem como cartão de obra ('+n+' de '+falta.length+')'); delete H.ctx.fillText;
  // o quarto e a cozinha nos três modos (e com o estado da passagem do tempo) desenham sozinhos
  let erro=null; try{ const cam={cx:610,cy:300,z:1}; L.ab2Quarto(H.ctx,cam,{T:1}); ['tarde','noite','lar'].forEach(m=>L.ab2Cozinha(H.ctx,cam,m,{T:1}));
    L.ab2Cozinha(H.ctx,cam,'noite',{T:1,estado:{dia:0.5,lar:0.5,noite:0.4,chuva:1,nuvens:0.5,estrela:1,facho:1,folhas:0.5,planta:0.5,pisca:1}}); } catch(e){ erro=e; }
  ok(!erro,'CA1: ab2Quarto e ab2Cozinha (tarde, noite, lar e a passagem do tempo) desenham'+(erro?': '+erro.message:''));
  // o caderno "Receitas da Rosa" aparece na 6 e na 8
  [[5,0.5],[7,0.38]].forEach(([i,p])=>{ tx.length=0; H.ctx.fillText=s=>tx.push(s); ab.i=i; ab.t=R.cenas[i].t*p; ab.tm=9; L.drawAbertura(H.ctx,ab); delete H.ctx.fillText;
    ok(tx.includes('Receitas') && tx.includes('da Rosa'),'CA1: o caderno "Receitas da Rosa" está na cena '+(i+1)); });
}

// ---------- CA2: as cabeças de quem fala caem na tela, com 40 px de margem, no instante da fala ----------
{ const H=load(), {L}=H, R=L.ABERTURA, TW=L.TW;
  CENAS.forEach(([id,i,quem])=>{ const c=R.cenas[i];
    ok(JSON.stringify(c.falas.map(f=>f.q))===JSON.stringify(quem),'CA2: na cena '+(i+1)+(quem.length?' fala(m) '+quem.join(' e '):' ninguém fala'));
    c.falas.forEach(f=>{ [f.de,f.de+0.9].forEach(t=>{ const p=t/c.t, cam=L.ab2Cam(c,p);
      let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,10+t,cam); } catch(e){ erro=e; }
      const a=r && r[f.q], q=a ? L.ab2Tela(cam,a[0],a[1]) : null;
      ok(!erro && q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40,'CA2: '+id+', '+f.q+' em '+t.toFixed(1)+' s: a cabeça cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); }); });
    if(quem.length){ const cam=L.ab2Cam(c,1), r=L.AB2_CENAS[id](H.ctx,c.pRM!=null?c.pRM:0.8,0,cam);
      ok(quem.every(k=>{ const a=r[k], q=a && L.ab2Tela(cam,a[0],a[1]); return q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40; }),'CA2: '+id+', com movimento reduzido, as cabeças caem na tela'); } });
}

// ---------- CA3: a 8 começa no quadro em que a 7 termina ----------
{ const H=load(), {L}=H, R=L.ABERTURA, c7=R.cenas[6], c8=R.cenas[7];
  const a=L.ab2Cam(c7,1), b=L.ab2Cam(c8,0);
  ok(c7.sai==='segue' && perto(a.cx,b.cx) && perto(a.cy,b.cy) && perto(a.z,b.z),'CA3: a câmera do fim da 7 é a do começo da 8, e o sai da 7 é segue');
  const k0=L.ab2Cam(c7,0), k4=L.ab2Cam(c7,0.4), k5=L.ab2Cam(c7,0.5), k8=L.ab2Cam(c7,0.8);
  ok(k4.cx===k0.cx && k4.z===1 && k5.z===1 && k8.z>1 && k8.cx>k0.cx,'CA3: na 7 a câmera fica parada até p 0,5 e só então se aproxima');
  const ab=new L.Abertura('menu',false,R); ab.i=6; ab.t=6.9; ok(ab.trans && ab.trans.tipo==='segue' && ab.escuro===0,'CA3: a troca da 7 para a 8 não escurece nem corta');
  // a Bia criança está no mesmo lugar (no banquinho, de costas) no fim da 7 e no começo da 8
  const r7=L.AB2_CENAS.janela(H.ctx,1,50,a), r8=L.AB2_CENAS.promessa(H.ctx,0,50,b);
  ok(r7.bia && r8.bia && perto(r7.bia[0],r8.bia[0],0.5),'CA3: a Bia está no mesmo x no fim da 7 e no começo da 8 ('+Math.round(r7.bia[0])+', '+Math.round(r8.bia[0])+')');
}

console.log(`\nsmoke90: ${total-fails}/${total}`); process.exit(fails?1:0);
