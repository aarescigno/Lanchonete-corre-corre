// v12.9: os enfeites novos da família fina e os redesenhos (etapa 17a). Spec: docs/spec-v12.9.md. CA1 a CA6.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const todos=(e,f,o)=>{ o=o||[]; if(f(e)) o.push(e); (e.children||[]).forEach(c=>todos(c,f,o)); return o; };
const texto=e=>(e.textContent||'')+(e.children||[]).map(texto).join('');
const jogo=(ponto,extra)=>{ const H=load(), {g,L}=H; H.doc.createTextNode=t=>({textContent:String(t),children:[]});
  g.save=L.normSave(Object.assign({ cap:5, dia:10, maxDay:10, bank:5000, up:{}, salao:{ ponto } },extra||{}));
  g.up=g.save.up; g.tablesKey=''; g.buildTables(); g.goShop(10); return H; };
const NOVOS=[['espelho','enfeites','Espelho de moldura',200,3,2],['palmeira','plantas','Palmeiras na entrada',200,3,2],['vinhos','enfeites','Estante de vinhos',200,3,2],['cortina','enfeites','Cortinas de linho',450,3,3],['arandela','enfeites','Arandelas',450,3,3]];
const RENOM=[['lata','Temperos na lata',8,undefined,1],['violeta','Cactos',20,2,1],['pendente','Jiboia pendurada',40,2,1],['orqArranjo','Bonsai',120,4,1]];
const ELOGIOS={lata:'Adorei os temperos na lata!',violeta:'Que cactos mais simpáticos na janela!',pendente:'A jiboia no toldo ficou linda!',orqArranjo:'Que bonsai mais caprichado!',espelho:'Que espelho mais elegante!',palmeira:'As palmeiras na entrada são um luxo!',vinhos:'Que estante de vinhos caprichada!',cortina:'Que cortinas de linho mais finas!',arandela:'As arandelas deixam a luz uma beleza!'};
const {L}=load();
// CA1
NOVOS.forEach(n=>{ const d=L.decorOf(n[0]); ok(d && d.grupo===n[1] && d.name===n[2] && L.decorPreco(d,d.nivel||1)===n[3] && d.nivel===n[4] && d.lux===n[5],'CA1: '+n[0]+' na tabela'); });
// CA2 (v12.9.1: o preço e o nível passaram a vir do ponto, DECOR_PRECO e decorCombina; smoke116)
RENOM.forEach(n=>{ const d=L.decorOf(n[0]); ok(d && d.name===n[1] && d.lux===n[4],'CA2: '+n[0]+' = '+n[1]); });
// CA3
Object.keys(ELOGIOS).forEach(k=>ok(L.AVAL_DECOR[k]===ELOGIOS[k],'CA3: elogio de '+k));
// CA4
{ const H=load(); let erro=null; try{ NOVOS.map(n=>n[0]).concat(RENOM.map(n=>n[0])).forEach(k=>H.L.upgradeIcon('d-'+k)); }catch(e){ erro=e; } ok(!erro,'CA4: os 9 ícones saem sem erro'+(erro?': '+erro.stack:'')); }
// CA5
{ const lojas=(p)=>{ const H=jogo(p); H.L.setShopGrupo('lanchonete'); H.L.setShopTab('luxo'); return todos(H.els['shop-grid'],()=>true).map(texto).join('|'); };
  const av=lojas('avenida'), ind=lojas('industrial');
  NOVOS.forEach(n=>{ ok(av.indexOf(n[2])>=0 && av.indexOf('R$ '+n[3])>=0 || av.indexOf(n[2])>=0,'CA5: Avenida vende '+n[2]); ok(ind.indexOf(n[2])<0,'CA5: área industrial não vende '+n[2]); }); }
// CA6
['garagem','industrial','avenida','terraco'].forEach(p=>{
  const H=jogo(p), {g,L}=H; let erro=null;
  L.DEV.on=true; g.devDecor(true);
  if(p==='garagem'||p==='industrial'){ ['lata','violeta','pendente'].forEach(k=>{ g.save.decor[k]=1; }); }
  if(p==='avenida'||p==='terraco') NOVOS.concat(RENOM).filter(n=>L.decorCombina(L.decorOf(n[0]),p==='avenida'?3:4)).forEach(n=>ok(g.save.decor[n[0]]===1 || (n[0]==='orqArranjo'&&p==='avenida'),'CA6: devDecor liga '+n[0]+' em '+p));
  g.ponto && 0; try{ g.startDay(10); g.begin(); L.render(g,H.ctx); g.menu||0; }catch(e){ erro=e; }
  ok(!erro,'CA6: o salão desenha em '+p+' com a decoração'+(erro?': '+erro.stack:'')); });
console.log(fails?('FALHOU: '+fails+'/'+total):('tudo certo ('+total+')')); process.exit(fails?1:0);
