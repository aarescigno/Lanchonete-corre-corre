// v12.10.2: a cozinha nova de cada ponto e o Caderno da Rosa (etapa 18c). Spec: docs/spec-v12.10.2.md. CA1 a CA7.
const load=require('./harness.js');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const nova=(o)=>{ const H=load(Object.assign({historia:true},o||{})); H.doc.createTextNode=t=>({textContent:String(t),children:[],tagName:'#text',classList:{add(){},remove(){}}}); return H; };
const pends=sv=>Object.keys(sv.arco).filter(k=>sv.arco[k]==='pend');
const joga=(H)=>{ const {g,els}=H; if(g.state==='shop') els['btn-shop-go'].fire('click'); if(g.state==='intro') els['btn-start'].fire('click'); g.schedule=[]; g.nextIdx=0; g.money=900; g.custo=0; g.finishDay(); };
// CA1: o fim do 1º dia no ponto marca a conversa do ponto, antes das outras do nivel
const dia=(ponto,quais)=>{ const H=nova(), {g,L}=H, sv=g.save; sv.conversa=null; sv.bank=5000; sv.convCard=1; sv.convDiv=1; sv.convEnt=1; sv.convPlanta=1; sv.convQuit=1; sv.convTeto=1; Object.keys(sv.libera).forEach(k=>{ sv.libera[k]=1; });
  g.trocaPonto(L.PONTOS[ponto]); Object.keys(sv.arco).forEach(k=>{ sv.arco[k]=1; }); quais.forEach(k=>{ sv.arco[k]=0; }); sv.cap=8; sv.pontoDia=20; sv.equipe.anselmo=2; sv.equipe.cami=2; sv.equipe.lia=2;
  g.startDay(20); joga(H); return pends(sv); };
{ const r2=dia(1,['cozinhaNova2','caderno','daniDoce']), r3=dia(2,['cozinhaNova3','braulio1','anselmoCopo']), r4=dia(3,['cozinhaNova4','liaPerfeita','roda']);
  ok(r2.join()==='cozinhaNova2','CA1: na área industrial, o 1º dia marca cozinhaNova2, antes de caderno ('+r2+')');
  ok(r3.join()==='cozinhaNova3','CA1: na Avenida, cozinhaNova3, antes de braulio1 ('+r3+')');
  ok(r4.join()==='cozinhaNova4','CA1: no Terraço, cozinhaNova4, antes de liaPerfeita ('+r4+')');
  const {L}=load(); ok(['cozinhaNova2','cozinhaNova3','cozinhaNova4'].every((id,i)=>{ const l=L.ARCO.filter(a=>a.nivel===i+2); return l[0].id===id && l[0].falas.length===6; }),'CA1: as três são a 1ª do seu nivel e têm 6 falas'); }
// CA2: save antigo
{ const {L}=load(), mk=(dia)=>L.normSave({ cap:8, dia, maxDay:dia, salao:{ ponto:'avenida' }, pontoDia:20, histV:1, arco:{ desanimo:1 } });
  const a=mk(25), b=mk(21);
  ok(a.arco.cozinhaNova3===1 && a.arco.cozinhaNova2===1,'CA2: save antigo no 5º dia da Avenida: cozinhaNova3 nasce 1 (e a do ponto anterior também)');
  ok(b.arco.cozinhaNova3===0,'CA2: no 2º dia da Avenida: nasce 0'); }
// CA3, CA4: a aba no Manual e a página nova
const pagina=(H)=>{ const {g,L,els}=H; L.buildManual(); return { abas:els['manual-abas'].children.map(b=>b.textContent), grid:els['manual-grid'] }; };
{ const H=nova(), {g,L,els}=H; g.save.cursos={ pastel:{ garagem:1 }, chapa:{ garagem:1 } }; g.save.salao.ponto='garagem'; g.save.manual=[]; g.save.manualNovo=[];
  let r=pagina(H); ok(!r.abas.includes('Caderno'),'CA3: na Garagem não há a aba Caderno');
  g.trocaPonto(L.PONTOS[1]); g.mode='carreira'; g.startDay(g.save.dia); els['btn-start'].fire('click');
  g.save.manualAba=0; r=pagina(H); ok(r.abas.includes('Caderno'),'CA3: na área industrial há a aba Caderno');
  ok(g.save.manualNovo.includes('cad:pastel.garagem') && g.save.manualNovo.includes('cad:chapa.garagem') && !g.save.manualNovo.includes('cad:fritos.garagem'),'CA3: o 1º dia na área industrial avisa as páginas da Garagem já feitas (pastel e chapa, sem os fritos)');
  ok(L.cadernoPaginas(g.save.cursos).join()==='pastel.garagem,chapa.garagem','CA3: uma página por degrau feito, na ordem');
  // CA4
  g.save.manualNovo=[]; g.save.bank=9000; g.state='shop'; const antes=L.cadernoPaginas(g.save.cursos).length;
  g.save.cursoDia=0; g.shopNext=g.save.dia; const comprou=g.buyCurso('pastel'); const dep=L.cadernoPaginas(g.save.cursos);
  ok(comprou && dep.length===antes+1 && dep.includes('pastel.industrial') && g.save.manualNovo.includes('cad:pastel.industrial'),'CA4: comprar o Pastel de estrada abre pastel.industrial e acende o "novo" ('+dep+')'); }
// CA5: "Na letra do Tonhão:" só no Terraço
{ const {L}=load(), ks=Object.keys(L.CADERNO), t=ks.filter(k=>k.endsWith('.terraco')), o=ks.filter(k=>!k.endsWith('.terraco'));
  ok(t.length===9 && t.every(k=>L.cadernoTexto(k).receita.indexOf('Na letra do Tonhão: ')===0) && o.every(k=>L.cadernoTexto(k).receita.indexOf('Na letra do Tonhão')<0),'CA5: as 9 páginas do Terraço levam "Na letra do Tonhão:" e as outras 16 não');
  ok(L.cadernoTexto('pastel.garagem').titulo==='Pastel de feira' && L.cadernoTexto('pf.industrial').titulo==='Carnes variadas','CA5: o título é o nome do degrau (o PF da área industrial, o do avançado)'); }
// CA6: modo dev
{ const H=nova(), {g,L,els}=H; g.setDev(true); L.buildManual();
  const cs=L.devCenas().map(c=>c.rot);
  ok(['Arco: cozinhaNova2','Arco: cozinhaNova3','Arco: cozinhaNova4'].every(x=>cs.includes(x)),'CA6: as três conversas aparecem na lista de conversas do modo dev');
  const ab=els['manual-abas'].children.find(b=>b.textContent==='Caderno'); ab.fire('click');
  const grid=els['manual-grid']; ok(grid.children.length===25 && grid.children.every(p=>p.className.indexOf('pagina')>=0),'CA6: com o modo dev, a aba Caderno mostra as 25 páginas ('+grid.children.length+')');
  const nomes=L.MANUAL_ABAS; ok(nomes[nomes.length-1][0]==='caderno','CA6: a aba é a última'); }
// CA7: sem algarismo
{ const {L}=load(), txt=Object.keys(L.CADERNO).map(k=>{ const t=L.cadernoTexto(k); return t.titulo+' '+t.frase+' '+t.receita; }).join(' ');
  ok(!/[0-9]/.test(txt),'CA7: nenhum texto do caderno tem algarismo'); }
console.log(`\n${total-fails}/${total} ok`); process.exit(fails?1:0);
