// v11.17 (etapa 10b): o final novo ganha as cenas 4 (retrato), 5 (equipe, a foto e os nomes) e 6 (escola); o ab2RuaCasa ganha dia, letreiro e dentro.
// Só toca pelo modo dev; o FINAL antigo e a cena 11 da abertura seguem como estão.
const load=require('./harness.js'), crypto=require('crypto');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TH=600, TW=1220;
const CENAS=[['retrato',3,['bia']],['equipe',4,['tonhao']],['escola',5,['dani']]];
const NOMES=['Cami','Lia','Anselmo','Dani','Bia','Tonhão','Joca'];

// ---------- CA1: as cenas 4, 5 e 6 desenham e não são mais o cartão de obra ----------
[false,true].forEach(rm=>[1,2,3].forEach(est=>{ const H=load({rm}), {L}=H, R=L.FINAL2, ab=new L.Abertura('menu',rm,R,{est}), tx=[]; H.ctx.fillText=s=>tx.push(s);
  CENAS.forEach(([id,i0])=>{ const i=ab.cenas.findIndex(q=>q.id===id); if(i<0) return; let erro=null, obra=false;   // com 1 estrela, a equipe não toca
    try{ ab.i=i; [0,0.25,0.5,0.75,0.95].forEach(p=>{ tx.length=0; ab.t=ab.cenas[i].t*p; ab.tm=70+i+p*7; L.drawAbertura(H.ctx,ab); if(p<0.9 && tx.includes('cena em obras')) obra=true; }); } catch(e){ erro=e; }   // em p 0,95 a transição já mostra a cena seguinte (que pode ser o cartão)
    ok(!erro && typeof L.AB2_CENAS[id]==='function' && !obra,'CA1: '+id+' desenha em p 0, 0,25, 0,5, 0,75 e 0,95, com '+est+' estrela(s)'+(rm?', com movimento reduzido':'')+', e não é o cartão de obra'+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:'')); });
  delete H.ctx.fillText; }));

// ---------- CA2: as cabeças de quem fala caem na tela ----------
{ const H=load(), {L}=H, R=L.FINAL2;
  CENAS.forEach(([id,i,quem])=>{ const c=R.cenas[i];
    ok(JSON.stringify(c.falas.map(f=>f.q))===JSON.stringify(quem),'CA2: na cena '+(i+1)+' ('+id+') fala '+quem.join());
    c.falas.forEach(f=>{ [f.de,f.de+0.9].forEach(t=>{ const p=t/c.t, cam=L.ab2Cam(c,p);
      let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,10+t,cam); } catch(e){ erro=e; }
      const a=r && r[f.q], q=a ? L.ab2Tela(cam,a[0],a[1]) : null;
      ok(!erro && q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40,'CA2: '+id+', '+f.q+' em '+t.toFixed(1)+' s: a cabeça cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); }); });
    const cam=L.ab2Cam(c,1); let r=null; try{ r=L.AB2_CENAS[id](H.ctx,0.8,0,cam); } catch(e){}
    ok(r && quem.every(k=>{ const a=r[k], q=a && L.ab2Tela(cam,a[0],a[1]); return q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40; }),'CA2: '+id+', com movimento reduzido, a cabeça também'); });
}

// ---------- CA3: na cena 5, os sete nomes são escritos na foto, a partir de p 0,6 ----------
{ const H=load(), {L}=H, R=L.FINAL2, c=R.cenas[4], tx=[]; H.ctx.fillText=s=>tx.push(s);
  const nomes=(p,T)=>{ tx.length=0; try{ L.AB2_CENAS.equipe(H.ctx,p,T,L.ab2Cam(c,p)); } catch(e){} return tx.filter(s=>NOMES.includes(s)); };
  [0,0.2,0.4,0.55,0.59].forEach(p=>ok(nomes(p,10+p).length===0,'CA3: em p '+p+' nenhum nome está escrito'));
  [0.6,0.7,0.8,0.95,1].forEach(p=>{ const n=nomes(p,10+p); ok(n.join()===NOMES.join(),'CA3: em p '+p+' os sete nomes, na ordem: Cami, Lia, Anselmo, Dani, Bia, Tonhão, Joca ('+n.join(', ')+')'); });
  { const n=nomes(0.8,0); ok(n.join()===NOMES.join(),'CA3: com movimento reduzido (T 0), em p 0,8, os sete nomes também'); }
  delete H.ctx.fillText; }

// ---------- CA4: o ab2RuaCasa sem dia, letreiro e dentro desenha a cena 11 da abertura como antes ----------
// o registro de tudo o que o ab2RuaCasa manda desenhar (métodos, argumentos, cores e degradês) vira uma assinatura; as de referência foram medidas antes da v11.17
function rec(){ const log=[]; const r=v=>typeof v==='number'?Math.round(v*100)/100:(v&&v.__g?'G':v), mk=n=>(...a)=>{ log.push(n+JSON.stringify(a.map(r))); };
  const ctx=new Proxy({},{get:(o,k)=>{ if(k in o) return o[k]; if(k==='__log') return log; if(k==='measureText') return s=>({width:String(s).length*10});
    if(/^create(Linear|Radial)Gradient$/.test(k)) return (...a)=>{ log.push(k+JSON.stringify(a.map(r))); return {__g:1,addColorStop:(x,cor)=>log.push('stop'+x+cor)}; };
    return mk(String(k)); }, set:(o,k,v)=>{ log.push('='+String(k)+(v&&v.__g?'G':String(v))); o[k]=v; return true; }});
  return ctx; }
const sig=(L,k,o)=>{ const c=rec(); L.ab2RuaCasa(c,{cx:610,cy:300,z:1},k,o); return crypto.createHash('md5').update(c.__log.join('|')).digest('hex').slice(0,12)+':'+c.__log.length; };
{ const H=load(), {L}=H;
  const REF=[[0,{T:1,letras:0,pisca:0},'0ee52c1c5f40:1031'],[0.5,{T:1,letras:0.5,pisca:0.3},'eae269b28f60:1236'],[1,{T:2,letras:1,pisca:1},'6c87c0ebf5c0:1192']];
  REF.forEach(([k,o,ref])=>{
    ok(sig(L,k,o)===ref,'CA4: sem as opções novas, o portão a '+k+' desenha exatamente como antes ('+ref+')');
    ok(sig(L,k,Object.assign({dia:0,letreiro:undefined,dentro:undefined},o))===ref,'CA4: com dia 0 e sem letreiro nem dentro (o padrão), o portão a '+k+' também'); });
  const tx=[], c=rec(), fill=c.fillText; c.fillText=s=>tx.push(s); L.ab2RuaCasa(c,{cx:610,cy:300,z:1},1,{T:1,letras:1,pisca:0});
  ok(tx.join('')==='Lanchonete Corre-Corre','CA4: o letreiro padrão segue "Lanchonete Corre-Corre" (letra por letra)');
  const tx2=[], c2=rec(); c2.fillText=s=>tx2.push(s); L.ab2RuaCasa(c2,{cx:610,cy:300,z:1},1,{T:1,letras:1,pisca:0,letreiro:'Cozinha da Rosa'});
  ok(tx2.join('')==='Cozinha da Rosa','CA4: com o.letreiro, o texto é o dado');
  let chamou=0; sig(L,1,{T:1,letras:1,dentro:()=>{ chamou++; }}); ok(chamou===1,'CA4: com o.dentro, o lado de dentro da garagem é o que a cena manda');
  let nenhum=0; sig(L,0,{T:1,dentro:()=>{ nenhum++; }}); ok(nenhum===0,'CA4: com o portão fechado, o dentro não aparece');
  ok(sig(L,1,{T:1,letras:1,dia:1})!==sig(L,1,{T:1,letras:1}),'CA4: o.dia muda o cenário (de dia)');
  let erro=null; try{ [0,0.5,1].forEach(d=>L.ab2RuaCasa(H.ctx,{cx:610,cy:300,z:1},1,{T:1,letras:1,dia:d,letreiro:'Cozinha da Rosa',dentro:cc=>{ cc.fillRect(0,0,1,1); }})); } catch(e){ erro=e; }
  ok(!erro,'CA4: dia 0, 0,5 e 1 desenham'+(erro?': '+erro.message:''));
}
console.log('smoke93: '+total+' checagens, fails = '+fails);
process.exit(fails?1:0);
