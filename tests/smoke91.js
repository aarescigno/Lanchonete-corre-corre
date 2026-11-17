// v11.15 (etapa 9d): a abertura nova no ar. As cenas 9 (tio), 10 (banco) e 11 (portao) ganham desenho; ABERTURA passa a ser o roteiro novo
// (ABERTURA2 e o cartão de obra saem); "Abertura" do modo dev toca a nova; as 10 cenas antigas saem da AB_CENAS e o FINAL segue como está.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const TH=600, CENAS=[['tio',8,['tonhao']],['banco',9,['bia']],['portao',10,['tonhao']]];
const ROT=[['porta',7,'A Bia cresceu na porta da cozinha.',['Vem provar, filha.']],['carinho',7,'',['Comida boa é carinho que a gente põe no prato.']],
 ['aurora',7,'A Rosa sonhava ser chef.',['Vai, mãe!','Bem-vinda, maninha!']],['molho',7,'Com o irmão, ela criou um molho. E guardou um segredo.',['Que molho é esse, Rosa?!']],
 ['estrela',7,'A estrela veio. A fama ficou com o chef Bráulio.',['Receita minha!']],['despedida',7,'Pouco depois, a Rosa adoeceu.',['Cozinha sempre com carinho, filha.','Prometo, mãe.']],
 ['janela',7,'A Rosa partiu.',[]],['promessa',8,'A Bia cresceu. E fez uma promessa.',['Essa estrela vai ser nossa, mãe.']],
 ['tio',6,'O tio Tonhão largou a Casa Aurora.',['Dinheiro eu não tenho, Bia. Mas braço pra cozinha tenho de sobra!']],['banco',6,'Sem um tostão, a Bia foi ao banco.',['Tem que dar certo...']],
 ['portao',8,'E a garagem da Rosa virou a Lanchonete Corre-Corre.',['Abre, Bia.']]];

// ---------- CA1: as cenas 9, 10 e 11 desenham e as cabeças caem na tela ----------
[false,true].forEach(rm=>{ const H=load({rm}), {L}=H, R=L.ABERTURA, ab=new L.Abertura('menu',rm,R);
  CENAS.forEach(([id,i])=>{ let erro=null;
    try{ ab.i=i; [0,0.25,0.5,0.75,0.95].forEach(p=>{ ab.t=R.cenas[i].t*p; ab.tm=70+i+p*7; L.drawAbertura(H.ctx,ab); }); } catch(e){ erro=e; }
    ok(!erro && typeof L.AB2_CENAS[id]==='function','CA1: a cena '+(i+1)+' ('+id+') desenha em p 0, 0,25, 0,5, 0,75 e 0,95'+(rm?', com movimento reduzido':'')+(erro?': '+erro.message+' '+String(erro.stack).split('\n')[1]:'')); }); });
{ const H=load(), {L}=H, R=L.ABERTURA, TW=L.TW;
  CENAS.forEach(([id,i,quem])=>{ const c=R.cenas[i];
    ok(JSON.stringify(c.falas.map(f=>f.q))===JSON.stringify(quem),'CA1: na cena '+(i+1)+' fala '+quem.join());
    c.falas.forEach(f=>{ [f.de,f.de+0.9].forEach(t=>{ const p=t/c.t, cam=L.ab2Cam(c,p);
      let r=null, erro=null; try{ r=L.AB2_CENAS[id](H.ctx,p,10+t,cam); } catch(e){ erro=e; }
      const a=r && r[f.q], q=a ? L.ab2Tela(cam,a[0],a[1]) : null;
      ok(!erro && q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40,'CA1: '+id+', '+f.q+' em '+t.toFixed(1)+' s: a cabeça cai na tela com 40 px de margem'+(q?' ('+q.map(Math.round).join(', ')+')':'')+(erro?' '+erro.message:'')); }); });
    const cam=L.ab2Cam(c,1), r=L.AB2_CENAS[id](H.ctx,0.8,0,cam);
    ok(quem.every(k=>{ const a=r[k], q=a && L.ab2Tela(cam,a[0],a[1]); return q && q[0]>=40 && q[0]<=TW-40 && q[1]>=40 && q[1]<=TH-40; }),'CA1: '+id+', com movimento reduzido, a cabeça também'); });
  let erro=null; try{ const cam={cx:610,cy:300,z:1}; L.ab2Banco(H.ctx,cam,{T:1}); [0,0.5,1].forEach(k=>L.ab2RuaCasa(H.ctx,cam,k,{T:1,letras:k,pisca:k})); } catch(e){ erro=e; }
  ok(!erro,'CA1: ab2Banco e ab2RuaCasa (portão fechado, a meio e aberto) desenham'+(erro?': '+erro.message:''));
  // o que a cena mostra: o APROVADO só depois do carimbo, o letreiro e o título no fim da 11
  const ab=new L.Abertura('menu',false,R), tx=[]; H.ctx.fillText=s=>tx.push(s);
  ab.i=9; ab.t=2; ab.tm=2; L.drawAbertura(H.ctx,ab); const antes=tx.includes('APROVADO'); tx.length=0; ab.t=4.5; ab.tm=4.5; L.drawAbertura(H.ctx,ab);
  ok(!antes && tx.includes('APROVADO') && tx.includes('Banco'),'CA1: na 10, o APROVADO aparece no papel só depois do carimbo');
  tx.length=0; ab.i=10; ab.t=2; ab.tm=2; L.drawAbertura(H.ctx,ab); const t0=tx.includes('O sonho da Bia'); tx.length=0; ab.t=7.4; ab.tm=7.4; L.drawAbertura(H.ctx,ab);
  ok(!t0 && tx.includes('O sonho da Bia') && 'Lanchonete Corre-Corre'.split('').every(ch=>tx.includes(ch)),'CA1: na 11, o título entra no fim e o letreiro é escrito letra por letra');
  delete H.ctx.fillText;
}

// ---------- CA2: ABERTURA é o roteiro novo ----------
{ const H=load(), {L}=H, R=L.ABERTURA, cs=R.cenas;
  ok(R.cheio===true && cs.length===11 && cs.map(c=>c.id).join()===ROT.map(r=>r[0]).join(),'CA2: ABERTURA tem as 11 cenas novas, na ordem ('+cs.map(c=>c.id).join()+')');
  ok(cs.every((c,i)=>c.t===ROT[i][1] && c.leg===ROT[i][2] && JSON.stringify(c.falas.map(f=>f.s))===JSON.stringify(ROT[i][3])) && cs.reduce((a,c)=>a+c.t,0)===77,'CA2: os tempos, as legendas e as falas de docs/ABERTURA.md §4; soma 77 s');
  ok(L.ABERTURA2===undefined,'CA2: ABERTURA2 não existe');
  ok(cs.every(c=>typeof L.AB2_CENAS[c.id]==='function') && Object.keys(L.AB2_CENAS).filter(k=>!['telefone','placa','apagou'].includes(k)).length===11,'CA2: as 11 cenas têm desenho na AB2_CENAS (a v11.16 acrescenta as do final novo)');
  const ab=new L.Abertura('menu',false,R), tx=[]; H.ctx.fillText=s=>tx.push(s); let erro=null;
  try{ cs.forEach((c,i)=>{ ab.i=i; [0.1,0.5,0.97].forEach(p=>{ ab.t=c.t*p; ab.tm=5+i+p; L.drawAbertura(H.ctx,ab); }); }); } catch(e){ erro=e; }
  ok(!erro && !tx.includes('cena em obras'),'CA2: nenhuma cena cai em cartão de obra'+(erro?': '+erro.message:'')); delete H.ctx.fillText;
  const d=new L.Abertura('menu',false); ok(d.roteiro===R && d.n===11,'CA2: sem roteiro, a classe Abertura toca a ABERTURA nova');
  ok(d.texto()==='A Bia cresceu na porta da cozinha. Rosa: Vem provar, filha.','CA2: o texto do leitor de tela, com os textos novos');
  d.i=10; ok(d.texto()==='E a garagem da Rosa virou a Lanchonete Corre-Corre. Tonhão: Abre, Bia. O sonho da Bia','CA2: na cena 11, a legenda, a fala e o título');
}

// ---------- CA4: o modo dev ----------
{ const H=load(), {g,L,els}=H; L.DEV.on=true; const cs=L.devCenas();
  ok(cs.filter(c=>c.rot==='Abertura').length===1 && !cs.some(c=>c.rot==='Abertura nova (em obras)'),'CA4: há "Abertura" e não há "Abertura nova (em obras)"');
  g.setState('menu'); L.devAssistir(cs.findIndex(c=>c.rot==='Abertura')); const ab=L.aberturaAtual();
  ok(ab && ab.roteiro===L.ABERTURA && ab.n===11 && els['ov-abertura'].classList.contains('show'),'CA4: "Abertura" abre o roteiro novo');
}

// ---------- CA5: as cenas antigas saíram; as do FINAL ficam ----------
{ const H=load(), {L}=H;
  ok(['casa','aurora','tempero','estrela','hospital','saudade','promessa','tonhao','banco','inauguracao'].every(k=>L.AB_CENAS[k]===undefined),'CA5: as 10 cenas antigas não existem mais na AB_CENAS');
  ok(Object.keys(L.AB_CENAS).sort().join()==='apagou,ceu,creditos,equipe,escola,placa,retrato,roda,telefone','CA5: na AB_CENAS ficam as do FINAL ('+Object.keys(L.AB_CENAS).sort().join()+')');
  [1,2,3].forEach(est=>{ let erro=null, n=0; [false,true].forEach(rm=>{ const f=new L.Abertura('menu',rm,L.FINAL,{est,creditos:true}); n=f.n;
      try{ for(let i=0;i<f.n;i++){ f.i=i; [0,0.5,0.95].forEach(p=>{ f.t=f.cena.t*p; f.tm=f.t+3; L.drawAbertura(H.ctx,f); }); } } catch(e){ erro=e; } });
    ok(!erro,'CA5: o FINAL com '+est+' estrela(s) desenha sem erro ('+n+' cenas)'+(erro?': '+erro.message:'')); });
  const f=new L.Abertura('menu',false,L.FINAL,{est:3}); ok(f.cenas.every(c=>typeof L.AB_CENAS[c.id]==='function') && !f.roteiro.cheio,'CA5: as cenas do FINAL seguem na AB_CENAS, no motor antigo');
}

console.log(`\nsmoke91: ${total-fails}/${total}`); process.exit(fails?1:0);
