// v12.10.3: o escalope pede degrau de PF comprado e o teto do Tonhão no Teste de habilidade (etapa 18d). Spec: docs/spec-v12.10.3.md. CA7 e CA8.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const {L}=load(); const A=L.PONTOS[2], T=L.PONTOS[3];
// CA7
ok(!L.pratoSabido('escalope',{},T),'CA7: sem curso nenhum, o escalope não é sabido no Terraço');
ok(!L.pratoSabido('escalope',{ pastel:{ garagem:1 } },T),'CA7: só com outros cursos (pastel da Garagem), o escalope não é sabido');
const carnes={ pf:{ industrial:2 } };
ok(L.pratoSabido('escalope',carnes,T) && L.pratoEstranho('escalope',carnes,T),'CA7: com Carnes variadas (avançado de PF da área industrial), o escalope é sabido e estranho');
const mav={ pf:{ avenida:1 } };
ok(L.pratoSabido('escalope',mav,T) && L.pratoEstranho('escalope',mav,T),'CA7: com o Molhos de panela da Avenida, sabido e estranho');
const mter={ pf:{ terraco:1 } };
ok(L.pratoSabido('escalope',mter,T) && !L.pratoEstranho('escalope',mter,T),'CA7: com o básico de PF do Terraço, sabido e não estranho');
ok(L.pratoSabido('strogonoff',{},A) && L.pratoEstranho('strogonoff',{},A),'CA7: o strogonoff na Avenida continua sabido sem curso (a Garagem conta)');
// CA8
const nv=L.PONTOS.map(p=>L.testeNivelMax('tonhao',p.nivel,12));
ok(JSON.stringify(nv)==='[2,4,6,8]','CA8: testeNivelMax do Tonhão dá 2, 4, 6 e 8 nos quatro pontos ('+nv+')');
ok(L.testeNivelMax('dani',1,1)===L.STAFF.dani.levels.length-1 && L.testeNivelMax('joca',2,1)===L.STAFF.joca.levels.length-1,'CA8: a Dani e o Joca seguem no máximo');
console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
