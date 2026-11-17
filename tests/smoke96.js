// v11.19: a 3ª estrela do Michelzão ao alcance. CA1: NOITE.cortes é [44, 66, X] e a régua da 3ª estrela vale em X.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const X=75;
{ const L=load().L, N=L.NOITE;
  ok(N.cortes.length===3 && N.cortes[0]===44 && N.cortes[1]===66 && N.cortes[2]===X,'CA1: NOITE.cortes é [44, 66, '+X+']');
  ok(L.guiaEstrelas(X)===3,'CA1: guiaEstrelas('+X+') dá 3');
  ok(L.guiaEstrelas(X-0.5)===2,'CA1: guiaEstrelas('+(X-0.5)+') dá 2');
  ok(L.guiaEstrelas(66)===2,'CA1: guiaEstrelas(66) dá 2'); }
console.log(total-fails+'/'+total,'checagens'); process.exit(fails?1:0);
