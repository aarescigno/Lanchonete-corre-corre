// v12.10: os cursos do Tonhão em degraus por ponto (etapa 18a). Spec: docs/spec-v12.10.md. CA1 a CA15.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const todos=(e,f,o)=>{ o=o||[]; if(f(e)) o.push(e); (e.children||[]).forEach(c=>todos(c,f,o)); return o; };
const texto=e=>(e.textContent||'')+(e.children||[]).map(texto).join('');
const jogo=(ponto,extra,opt)=>{ const H=load(opt), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ cap:6, dia:10, maxDay:10, bank:50000, up:{}, tonDeg:1, salao:{ ponto } },extra||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const cartoes=H=>{ H.L.setShopGrupo('lanchonete'); H.L.setShopTab('cardapio'); const g=H.els['shop-grid'], r=[]; for(const c of g.children.slice(1)){ if(/experiência para|Confeitaria|Espresso|Atendimento|Café/.test(texto(c))) break; r.push(c); } return r; };   // os cartões dos cursos do Tonhão (depois do "No cardápio hoje" e antes dos dos ajudantes)
const {L}=load(); const G=L.PONTOS[0], I=L.PONTOS[1], A=L.PONTOS[2], T=L.PONTOS[3];
// CA1
{ const gar=L.pratosDoPonto(G); const ind=L.pratosDoPonto(I);
  ok(!gar.some(k=>L.CARDAPIO[k].curso==='assados'||L.CARDAPIO[k].curso==='veg') && gar.length===11,'CA1: a Garagem não vende assados nem vegetarianos ('+gar.length+' pratos)');
  const P={pastelFrango:14,pastelCarneSeca:16,xSalada:16,xTudo:21,enroladinho:8,bolinhoCarneSeca:12};
  ok(Object.keys(P).every(k=>L.CARDAPIO[k] && L.CARDAPIO[k].preco.industrial===P[k] && Object.keys(L.CARDAPIO[k].preco).join()==='industrial' && ind.indexOf(k)>=0),'CA1: a área industrial vende os 6 pratos de estrada com os preços da tabela');
  ok(['empada','esfihaA','esfihaF','pfVeg','empadaPalmito','kibeAbobora','pfVegano','coxinhaJaca','pastelPalmito','esfihaSoja','mistoVegano'].every(k=>Object.keys(L.CARDAPIO[k].preco).join()==='industrial'),'CA1: os 11 pratos que saíram da Garagem ficam só com o preço da área industrial'); }
// CA2
ok(L.degrauDe('pastel')==='garagem' && L.degrauDe('pastelFrango')==='industrial' && L.degrauDe('panqueca')==='avenida' && L.degrauDe('ravioli')==='terraco' && L.degrauDe('empada')==='industrial','CA2: degrauDe: pastel garagem, pastelFrango industrial, panqueca avenida, ravioli terraço');
// CA3
{ const s1={ pastel:{ garagem:1 } }, s2={ pastel:{ garagem:1, avenida:1 } };
  ok(L.pratoSabido('panqueca',s1,A) && !L.pratoSabido('panquecaEsp',s1,A) && L.pratoSabido('panqueca',s2,A) && L.pratoSabido('panquecaEsp',s2,A) && !L.pratoSabido('panqueca',{},A),'CA3: só com o pastel da Garagem, na Avenida sabe a panqueca (estranha) e não a de espinafre; com as Panquecas, as duas'); }
// CA4
ok(L.pratoSabido('strogonoff',{},A) && !L.pratoSabido('escalope',{},T) && L.pratoSabido('escalope',{ pf:{ avenida:1 } },T) && !L.pratoSabido('vinho',{},T) && L.pratoSabido('vinho',{ restaurante:{ avenida:1 } },T) && !L.pratoSabido('execVeg',{},A) && L.pratoSabido('execVeg',{ veg:{ industrial:1 } },A),'CA4: no PF o strogonoff (Avenida) sai sem curso, pois a Garagem conta como degrau feito, e o escalope (Terraço) pede um degrau de PF comprado (v12.10.3); o vinho e o executivo vegetariano pedem o degrau anterior');
// CA5
{ let H=jogo('industrial',{ bank:5000, cursos:{}, equipe:{ tonhao:0 } }), {g}=H; g.save.cursoDia=0; let b=g.save.bank;
  const p=g.cursoProx('pastel'); ok(p && p.preco===150,'CA5: sem o pastel da Garagem, o Pastel de estrada custa R$ 150');
  ok(g.buyCurso('pastel') && g.save.bank===b-150 && g.save.cursos.pastel.industrial===1 && g.save.cursos.pastel.garagem===1,'CA5: comprar dá o básico dos dois degraus e cobra R$ 150');
  H=jogo('industrial',{ bank:5000, cursos:{ pastel:{ garagem:1 } }, equipe:{ tonhao:0 } }); const g2=H.g; g2.save.cursoDia=0; b=g2.save.bank;
  ok(g2.cursoProx('pastel').preco===10 && g2.buyCurso('pastel') && g2.save.bank===b-10 && g2.save.cursos.pastel.industrial===1,'CA5: com o da Garagem, cobra só a troca, R$ 10');
  H=jogo('avenida',{ bank:5000, cursos:{ pastel:{ garagem:1, industrial:1 } } }); ok(H.g.cursoProx('pastel').preco===50,'CA5: Panquecas R$ 200 com o Pastel de estrada feito: R$ 50'); }
// CA6
{ const H=jogo('avenida',{ cursos:{} }), c=cartoes(H), t=c.map(texto).join('|');
  ok(c.length===7 && ['Panquecas','Chapa de restaurante','Peixe empanado','Tortas','Vegetariano de restaurante','Molhos de panela','Cozinha de restaurante'].every(n=>t.indexOf('Curso de '+n)>=0),'CA6: a lojinha da Avenida mostra os 7 básicos ('+c.length+')');
  ok(!/Pastel de feira|Pastel de estrada|Panqueca gratinada|Beirute da casa/.test(t),'CA6: sem os degraus de outros pontos e sem o avançado antes do básico');
  H.g.save.cursos={ pastel:{ avenida:1 } }; const t2=cartoes(H).map(texto).join('|'); ok(t2.indexOf('Panqueca gratinada')>=0 && t2.indexOf('Curso de Panquecas')<0,'CA6: depois do básico, o cartão vira o do avançado');
  const I2=jogo('industrial',{ cursos:{} }); ok(texto({children:cartoes(I2)}).indexOf('Carnes variadas')>=0 && cartoes(I2).length===6,'CA6: na área industrial o PF mostra só o avançado desde o começo (6 cartões)'); }
// CA7
{ const gb={ pastel:{ garagem:1 }, chapa:{ garagem:1 }, fritos:{ garagem:1 } }, ga={ pastel:{ garagem:2 }, chapa:{ garagem:2 }, fritos:{ garagem:2 } };
  ok(L.tonhaoNivelAlc(gb,G)===1 && L.tonhaoNivelAlc(ga,G)===2 && L.tonhaoNivelAlc(L.cursosAte(G),G)===2 && L.tonhaoNivelAlc({ pastel:{ garagem:2 }, chapa:{ garagem:2 } },G)===0,'CA7: Garagem: 3 básicos, nível 1; com os avançados, 2; nada passa do 2'); }
// CA8
{ const H=jogo('industrial',{ bank:50000, cursos:{}, equipe:{ tonhao:0 } }), {g}=H;
  ['pastel','chapa','fritos','assados','veg'].forEach(id=>{ g.save.cursoDia=0; g.buyCurso(id); });
  ok(L.tonhaoNivelAlc(g.save.cursos,I)===3 && g.save.cursos.chapa.garagem===1,'CA8: na área industrial, com os 5 básicos de lá, o nível ao alcance é 3 ('+L.tonhaoNivelAlc(g.save.cursos,I)+')'); }
// CA9
{ const H=jogo('industrial',{ bank:50000, cursos:{ pastel:{ garagem:1, industrial:1 }, chapa:{ garagem:1, industrial:1 }, fritos:{ garagem:1, industrial:1 }, assados:{ industrial:1 }, veg:{ industrial:1 } }, equipe:{ tonhao:0 } }), {g}=H;
  const r=[g.setStaff('tonhao',1),g.save.equipe.tonhao,g.setStaff('tonhao',2),g.setStaff('tonhao',3),g.setStaff('tonhao',4),g.save.equipe.tonhao,g.setStaff('tonhao',2)];
  ok(r[0]&&r[1]===1&&r[2]&&r[3]&&!r[4]&&r[5]===3&&!r[6],'CA9: cada aumento sobe um nível; acima do ao alcance (3) ou abaixo do atual, recusa ('+r.join()+')'); }
// CA10
{ let H=jogo('industrial',{ bank:50000, cursos:{} }), {g}=H; g.save.cursoDia=0;
  ok(!g.cursoTrava && g.buyCurso('pastel') && g.cursoTrava && !g.buyCurso('chapa') && /Em curso/.test(cartoes(H).map(texto).join('|')),'CA10: na área industrial, depois de um curso a lojinha trava ("Em curso")');
  H=jogo('avenida',{ bank:50000, cursos:{} }); { const g3=H.g; g3.save.cursoDia=0; const a3=g3.buyCurso('pastel'), t3=g3.cursoTrava, b3=g3.buyCurso('chapa'), t4=g3.cursoTrava, c3=g3.buyCurso('fritos');
    ok(a3&&!t3&&b3&&t4&&!c3&&/Em curso/.test(cartoes(H).map(texto).join('|')),'CA10 (v12.10.3): na Avenida trava só depois do segundo curso ("Em curso")'); }
  H=jogo('terraco',{ bank:50000, cursos:{} }); const g2=H.g; g2.save.cursoDia=0;
  const a=g2.buyCurso('pastel'), t1=g2.cursoTrava, b=g2.buyCurso('chapa'), t2=g2.cursoTrava, c=g2.buyCurso('fritos');
  ok(a&&!t1&&b&&t2&&!c,'CA10: no Terraço trava só depois do segundo'); }
// CA11
{ const lv=L.STAFF.tonhao.levels, cook=[1,.92,.85,.78,.71,.64,.57,.51,.45], crit=[.05,.08,.11,.15,.19,.24,.29,.34,.40], wash=[0,0,0,7,5.5,4.5,3.5,3,2.5], pay=[50,58,66,76,86,98,112,130,160];
  ok(lv.length===9 && lv.every((l,i)=>l.slots===3&&l.cook===cook[i]&&l.crit===crit[i]&&l.wash===wash[i]&&l.pay===pay[i]),'CA11: os 9 níveis do Tonhão batem com a tabela');
  ok(L.AVAL.prato.length===9 && L.AVAL.prato.join(';')==='2.5,4.5;2.75,4.6;3,4.7;3.25,4.85;3.5,5;3.65,5;3.8,5;3.9,5;4,5' && L.EXIGENTE.casa.nivel===6,'CA11: AVAL.prato tem 9 faixas e a casa exigente pede o nível 6'); }
// CA12
{ const LA=load({saveAntigo:true}).L, conv=(ponto,cursos,tonhao)=>{ const o=LA.normSave({ cap:6, dia:10, bank:1000, salao:{ ponto }, cursos, equipe:{ tonhao } }); return o; };
  let o=conv('industrial',{ pastel:2, assados:1, pf:2, restaurante:1 },3);
  ok(JSON.stringify(o.cursos)==='{"pastel":{"garagem":2},"assados":{"industrial":1},"pf":{"industrial":2}}' && o.equipe.tonhao===4 && o.tonDeg===1 && o.bank===1400 && o.cursoAviso===400,'CA12: industrial: cursos convertidos, nível 4 (o teto), R$ 400 a mais ('+JSON.stringify(o.cursos)+' n'+o.equipe.tonhao+' R$'+o.bank+')');
  let H=jogo('industrial',{}); H.g.save=o; H.g.goShop(10); ok(H.g.cursoMsg==='Os cursos do Tonhão mudaram: agora cada ponto tem os seus. R$ 400 dos cursos de outros pontos voltaram para o caixa.' && H.g.save.cursoAviso===0,'CA12: o aviso único na 1ª lojinha ('+H.g.cursoMsg+')');
  o=conv('garagem',{ pastel:1, veg:2 },4); ok(JSON.stringify(o.cursos)==='{"pastel":{"garagem":1}}' && o.equipe.tonhao===2 && o.bank===1450,'CA12: Garagem: só o pastel fica, nível 2, R$ 450 a mais ('+JSON.stringify(o.cursos)+' n'+o.equipe.tonhao+' R$'+o.bank+')');
  o=conv('industrial',{ pastel:1, chapa:2 },2); H=jogo('industrial',{}); H.g.save=o; H.g.goShop(10);
  ok(o.bank===1000 && !o.cursoAviso && H.g.cursoMsg==='' && o.equipe.tonhao===4,'CA12: sem curso acima do ponto, nada volta e não há aviso'); }
// CA13
{ const c={ fritos:{ garagem:2 } };
  ok(L.precoPrato('coxinha',G,c)===Math.round(L.precoPrato('coxinha',G,{})*L.CURSO_AV.preco) && L.precoPrato('coxinha',I,c)===Math.round(L.precoPrato('coxinha',I,{})*L.CURSO_AV.preco) && L.precoPrato('enroladinho',I,c)===8 && L.precoPrato('coxinha',I,{})===11,'CA13: o avançado de fritos da Garagem soma o CURSO_AV.preco (×1,25) à coxinha na Garagem e na área industrial, e não ao enroladinho'); }
// CA14
{ let H=load(); H.L.buildMenu(); const off=H.els['btn-endless'].style.display; H.L.DEV.on=true; H.L.buildMenu(); const on=H.els['btn-endless'].style.display;
  ok(off==='none' && on==='','CA14: o menu só mostra o "Turno sem fim" com o modo dev ('+off+'/'+on+')'); }
// CA15
{ const H=jogo('garagem',{ cursos:{}, equipe:{ tonhao:0 } }), {g}=H; H.L.DEV.on=true; const b=g.save.bank, n=()=>(g.save.cursos.pastel||{}).garagem||0;
  const v=[g.devDegrau('pastel','garagem'),n(),g.devDegrau('pastel','garagem'),n(),g.devDegrau('pastel','garagem'),n()];
  ok(v.join()==='true,1,true,2,true,0' && g.save.bank===b,'CA15: modo dev: o degrau gira básico → avançado → 0 sem cobrar ('+v.join()+')');
  ok(g.devNivelTonhao(8) && g.save.equipe.tonhao===8,'CA15: forçar o nível 8 na Garagem põe o nível 8'); }
console.log('smoke117: '+total+' checagens, fails = '+fails); process.exit(fails?1:0);
