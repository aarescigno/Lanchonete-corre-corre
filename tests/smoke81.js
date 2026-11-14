// v11.5, etapa 8e: o retrato no balão e as cinco expressões. Roteiro em docs/ARCO.md §8; spec em docs/spec-v11.5.md.
// CA1 drawRetrato (7 x 5 sem erro, cai em neutra); CA2 o balão 84 px mais largo e dentro da tela; CA3 texto ainda quebra em 420; CA4 todo e é um dos cinco;
// CA5 modo dev tem Retratos; CA6 movimento reduzido; CA7 o retrato é do boneco (o boneco do salão não muda sem a expressão). O desenho em si: shot_v11_5.js.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=(o)=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[]}); return H; };
const cinco=['neutra','insegura','firme','alegre','brava'];
const sete=['bia','tonhao','dani','joca','cami','anselmo','lia'];
const H0=nova(), L=H0.L, g=H0.g, ctx=H0.ctx;

// ---------- CA1: a função de retrato ----------
{ ok(typeof L.drawRetrato==='function' && Array.isArray(L.RETRATO_QUEM) && sete.every(q=>L.RETRATO_QUEM.includes(q)),'CA1 __lcc expõe drawRetrato e RETRATO_QUEM com os 7');
  let erro=null, n=0; try{ sete.forEach(q=>cinco.forEach(e=>{ L.drawRetrato(ctx,q,e,100,100,g); n++; })); }catch(x){ erro=x; }
  ok(!erro && n===35,'CA1 os 7 desenham nas 5 expressões sem erro ('+n+' retratos'+(erro?'; '+erro.message:'')+')');
  let e2=null; try{ L.drawRetrato(ctx,'bia','sei-la',100,100,g); L.drawRetrato(ctx,'bia',undefined,100,100,g); L.drawRetrato(ctx,'bia',null,100,100,g); }catch(x){ e2=x; }
  ok(!e2 && L.exprDe('sei-la')==='neutra' && L.exprDe(undefined)==='neutra' && cinco.every(e=>L.exprDe(e)===e),'CA1 expressão desconhecida ou ausente cai em neutra');
  ok(L.RETRATO && L.RETRATO.raio===34 && L.RETRATO.fundo==='#F4EBDD','CA1 o retrato tem raio 34 e fundo #F4EBDD'); }

// ---------- CA2/CA3: o balão ----------
const falaX=(q,e,s,nota)=>({ q, e, s, nota });
const caixa=(f)=>{ const c=nova(), cv=new c.L.Conversa([f],()=>{},false); cv.update(1); c.L.drawConversa(c.ctx,c.g,cv); return cv.caixa; };
{ const txt='Oi, tio! Hoje a gente abre cedo.';
  const cx=caixa(falaX('bia','neutra',txt));
  // a largura antiga: max(220, texto+40); o medidor do harness dá 10 px por linha
  ok(cx && cx.w===Math.max(220,10+40)+84,'CA2 o balão fica 84 px mais largo que antes para o mesmo texto (w='+(cx&&cx.w)+')');
  const longo='Um texto bem comprido para quebrar em várias linhas dentro do balão da conversa, sem passar da largura combinada de quatrocentos e vinte.';
  const c2=caixa(falaX('tonhao','firme',longo,'coçando o bigode'));
  const TWv=L.TW, Hv=600;
  ok(c2.x>=16 && c2.x+c2.w<=TWv-16 && c2.y>=0 && c2.y+c2.h<=Hv,'CA2 o balão com nota fica dentro da tela com 16 px de margem ('+JSON.stringify(c2)+')');
  const todos=sete.map(q=>caixa(falaX(q,'alegre',txt)));
  ok(todos.every(c=>c.x>=16 && c.x+c.w<=TWv-16 && c.h>=68+16),'CA2 o balão de cada um dos 7 cabe na tela e é alto o bastante para o retrato');
  const cc=caixa(falaX('bia','neutra',txt)); ok(cc.h>=84,'CA2 o balão de uma linha tem altura para o círculo (h='+cc.h+')'); }
{ // o texto continua quebrando em CONV_UI.w 420 (medidor de mentira: 10 px por letra => no máximo 42 letras por linha)
  ok(L.CONV_UI && L.CONV_UI.w===420,'CA3 CONV_UI.w continua 420');
  const c=nova(); c.ctx.measureText=s=>({width:String(s).length*10});
  const cv=new c.L.Conversa([falaX('bia','neutra','palavra '.repeat(40).trim())],()=>{},false); cv.update(1); c.L.drawConversa(c.ctx,c.g,cv);
  ok(cv.caixa.w<=420+40+84 && cv.caixa.w>=400+40+84-60 && cv.caixa.h>=3*27,'CA3 o texto quebra em linhas de até 420 px (balão w='+cv.caixa.w+', h='+cv.caixa.h+')'); }

// ---------- CA4: todo e é um dos cinco ----------
{ const falas=[]; const add=a=>(a||[]).forEach(f=>falas.push(f));
  L.HISTORIA.forEach(c=>{ add(c.antes); add(c.depois); });
  ['HIST_PLANTA','HIST_CARDAPIO','HIST_DIVULGA','HIST_ENTREGA','HIST_SOCORRO','HIST_QUITOU','HIST_TETO','HIST_VONTADE_DOCE','HIST_VONTADE_CAFE','HIST_EXIGENTE','HIST_CRITICO'].forEach(k=>{ const o=L[k]; if(o){ add(o.falas); add(o.fez); add(o.avenida); add(o.falasB); } });
  L.LIBERA.forEach(x=>add(x.falas)); L.ARCO.forEach(x=>{ add(x.falas); add(x.falasB); });
  ok(falas.length>100,'CA4 achou as falas do jogo ('+falas.length+')');
  const ruim=falas.filter(f=>f.e!==undefined && !cinco.includes(f.e));
  ok(ruim.length===0,'CA4 todo e de toda fala é um dos cinco ('+ruim.length+' fora)'); }

// ---------- CA5: modo dev ----------
{ const H=nova(), {g:G,els,L:LL}=H; G.setDev(true); G.devReal(true); LL.DEV.aba='historia'; LL.abrirDev(); LL.buildDev();
  const todos=[]; const walk=n=>{ (n.children||[]).forEach(c=>{ todos.push(c.textContent||''); walk(c); }); };
  walk(els['dev-body']);
  ok(todos.some(t=>/Retratos/.test(t)),'CA5 o painel do modo dev (aba História) tem "Retratos"');
  ok(typeof LL.devRetratos==='function' && LL.devRetratos()===true,'CA5 devRetratos abre a tela de retratos');
  let erro=null; try{ LL.drawRetratosTela(H.ctx); }catch(x){ erro=x; } ok(!erro,'CA5 a tela dos retratos desenha os 7 nas 5 expressões sem erro'); }

// ---------- CA6: movimento reduzido ----------
{ const H=nova({ rm:true }); const cv=new H.L.Conversa([falaX('bia','insegura','Oi.')],()=>{},true); cv.update(0); H.L.drawConversa(H.ctx,H.g,cv);
  ok(cv.entra===1 && cv.caixa && cv.caixa.w>=84+220,'CA6 com movimento reduzido o balão (e o retrato) aparece direto'); }

// ---------- CA7: o boneco do salão não muda ----------
{ ok(L.exprAtual && L.exprAtual()==='neutra','CA7 fora do retrato a expressão é neutra (o boneco do salão desenha como antes)');
  L.drawRetrato(ctx,'bia','brava',100,100,g); ok(L.exprAtual()==='neutra','CA7 depois de um retrato a expressão volta a neutra'); }

console.log('\n'+(total-fails)+'/'+total+' ok; fails = '+fails);
if(fails) process.exit(1);
