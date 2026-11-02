// v9.6.6, etapa 3d-3: lavar prato a prato, sem o lembrete da louça, a geladeirinha de doces maior e o selo NOVO!
const H=require('./harness.js')(); const {g,L}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=(dia,o)=>{ o=o||{}; g.save=L.normSave(Object.assign({bank:2000,dia,maxDay:dia},o)); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.startDay(dia); g.begin(); g.schedule=[{t:1e9,type:'entregador',color:0}]; g.nextIdx=0; };
const roda=(s,cond)=>{ for(let i=0;i<s/0.05;i++){ g.update(0.05); if(cond&&cond()) return true; } return false; };

// (a) lavagem prato a prato
novo(3);
{ const k=g.kitchen, b=g.bia; k.sinkN=4; const c0=k.clean;
  b.enqueue({type:'sink'});
  roda(20,()=>b.washing); roda(2.6); ok(k.sinkN===4,'2,6 s depois de começar a lavar, nenhuma pilha ainda (base 0,3 + 2,5)');
  roda(0.4); ok(k.sinkN===3 && k.clean===c0+1,'aos ~3 s, 1 prato limpo (a 1ª pilha)');
  roda(2.6); ok(k.sinkN===2 && k.clean===c0+2,'+2,5 s: a 2ª pilha');
  roda(20,()=>b.acts.length===0);
  ok(k.sinkN===0 && k.clean===c0+4,'sozinha, lava as 4 pilhas, um prato limpo por vez'); }
novo(3);
{ const k=g.kitchen, b=g.bia; k.sinkN=4; const c0=k.clean;
  b.enqueue({type:'sink'}); b.enqueue({type:'trash'});
  roda(20,()=>b.acts.length<=1);
  ok(k.sinkN===3 && k.clean===c0+1,'com outra ação na fila, para depois da 1ª pilha e sobram 3'); }

// (b) sem o balão do lembrete
novo(3);
ok(!g.fx.some(f=>f.aviso==='pratos' || /lavar os pratos/.test(f.text||'')),'abertura do dia 3 sem o lembrete da louça');

// (c) geladeirinha de doces
ok(L.LAYOUT.STATIONS.doces.rect.x===690 && L.LAYOUT.STATIONS.doces.rect.y===200 && L.LAYOUT.STATIONS.doces.rect.w===52 && L.LAYOUT.STATIONS.doces.rect.h===60 && L.LAYOUT.STATIONS.doces.ap.x===744 && L.LAYOUT.STATIONS.doces.ap.y===226,'STATIONS.doces com o tamanho novo e o mesmo ap');

// (d) docesTot soma no fim do dia
novo(4,{up:{confCaseira:1}});
{ g.stats.doces=3; g.schedule=[]; g.nextIdx=0; g.finishDay(); const a=g.save.docesTot;
  ok(a===3,'docesTot soma os doces do dia ('+a+')');
  ok(L.normSave({docesTot:7}).docesTot===7 && L.normSave({}).docesTot===0,'normSave guarda docesTot'); }

console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
