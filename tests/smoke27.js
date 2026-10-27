// v8.5.2, retorno do jogador: quem vai embora com o prato pronto não leva o prato junto. No balcão, o prato vai
// sozinho para a pia; na mão da Bia, vira louça suja (ou vai para a pia, se a louça não couber nas mãos).
const H=require('./harness.js')(); const {g,L}=H;
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const novo=up=>{ g.save=L.normSave({bank:2000,maxDay:5,up:up||{}}); g.up=g.save.up; g.boughtFor=0; g.buildTables(); g.startDay(3); g.begin(); };
const senta=id=>{ const grp=new L.Group(g,'estudante',900+id,0); const t=g.tables.filter(x=>x.open&&!x.group&&x.seats>=grp.size)[0];
  t.group=grp; grp.table=t; grp.seated=true; grp.setState('ordered'); g.groups.push(grp); return grp; };

// prato no balcão
novo(); { const grp=senta(1), c0=g.kitchen.clean;
  g.kitchen.plates=[{id:1,table:grp.table.id,group:grp,dish:'pf',slot:0,age:0},null,null,null];
  g.angryLeave(grp);
  ok(g.kitchen.plates[0]===null,'o prato sai do balcão');
  ok(g.kitchen.sinkN===1,'e vai sozinho para a pia');
  ok(g.washPiles(1)===1 && g.kitchen.clean===c0+1,'lavado, volta como prato limpo'); }

// prato na mão, sem bandeja
novo(); { const grp=senta(2);
  g.bia.hands=[{kind:'dish',group:grp,table:grp.table.id,dish:'pf'},{kind:'coffee'}];
  g.angryLeave(grp);
  ok(g.bia.hands.length===2 && g.bia.hands[0].kind==='dirty' && g.bia.hands[0].n===grp.size,'na mão: vira louça suja');
  ok(g.bia.hands[1].kind==='coffee' && g.kitchen.sinkN===0,'o cafezinho fica; nada vai sozinho para a pia'); }

// bandeja com 2 pratos e cafezinho na outra mão: a louça vai para a mão livre e o cafezinho para a bandeja
novo({bandeja:true}); { const a=senta(3), b=senta(4);
  g.bia.hands=[{kind:'dish',group:a,table:a.table.id,dish:'pf'},{kind:'dish',group:b,table:b.table.id,dish:'pf'},{kind:'coffee'}];
  g.angryLeave(a);
  ok(!!g.bia.layout() && g.bia.hands.filter(h=>h.kind==='dirty').length===1 && g.kitchen.sinkN===0,'com bandeja: vira louça suja na mão');
  ok(g.bia.hands.some(h=>h.kind==='dish'&&h.group===b),'o prato do outro grupo continua na mão'); }

// comandas na mão e prato + cafezinho na bandeja: louça suja não vai com o cafezinho, então vai para a pia
novo({bandeja:true}); { const a=senta(5);
  g.bia.hands=[{kind:'dish',group:a,table:a.table.id,dish:'pf'},{kind:'coffee'},{kind:'ticket',table:9,group:null}];
  ok(!!g.bia.layout(),'bandeja com prato e cafezinho, comanda na mão');
  g.angryLeave(a);
  ok(!!g.bia.layout() && !g.bia.hands.some(h=>h.kind==='dirty'||h.kind==='dish') && g.kitchen.sinkN===1,'sem lugar nas mãos: o prato vai para a pia'); }

console.log((fails?'FALHOU':'OK')+' smoke27: '+(total-fails)+'/'+total);
process.exit(fails?1:0);
