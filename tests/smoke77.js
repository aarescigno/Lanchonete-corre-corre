// v11.1, etapa 8a: a voz da Bia na Garagem e na área industrial (só texto). Roteiro em docs/ARCO.md §4; spec em docs/spec-v11.1.md.
// CA1 cada fala trocada tem o texto exato; CA2 a última fala de HIST_VONTADE_DOCE fica como está (pendente: ver Avisos da spec);
// CA3 nenhuma fala trocada passa de 120 letras; CA4 as conversas que apontam uma aba da lojinha seguem com as mesmas palavras;
// CA5 o campo `e` é um dos cinco; CA6 HIST_SOCORRO.firme e a escolha pelo nivel 3 ou mais; CA7 save antigo segue igual.
const load=require('./harness.js'), fs=require('fs');
let fails=0,total=0; const ok=(c,m)=>{ total++; if(!c){fails++;console.log('FAIL:',m);} else console.log('ok  :',m); };
const L=load({historia:true}).L;
const ach=falas=>falas.map(f=>[f.q,f.e||'',f.s]);
const ESP_HIST={
  1:{antes:[['tonhao','alegre','Panela no fogo, avental no lugar. Abre o portão, Bia!'],['bia','insegura','Será que eu dou conta, mãe?'],['bia','insegura','E se não vier ninguém, tio?'],['tonhao','firme','Vem. E a gente fecha o dia no azul, que o banco não espera.']],
     depois:[['bia','alegre','Dois dias no azul, tio! Eu nem acreditei.'],['tonhao','','Pois acredite. Agora é aguentar a parcela todo dia.']]},
  2:{antes:[['bia','insegura','Deixei a pia encher de novo. Não dou conta da mesa e da louça...'],['tonhao','','Sozinha, ninguém dá. Pedi ajuda pra Dani, filha da vizinha.'],['dani','insegura','Sou meio lenta ainda, mas aprendo rápido!'],['bia','alegre','Então somos duas aprendendo.']],
     depois:[['dani','alegre','Ouvi um freguês dizer que aqui é tudo limpinho!'],['bia','alegre','O Gurugol subiu, tio! Já tá em 2,4.'],['tonhao','','Devagar e sempre.']]},
  3:{antes:[['bia','','O Gurugol tá cheio de comentário sobre a gente!'],['dani','','Tem freguês perguntando se a gente vai abrir num lugar maior.'],['bia','insegura','Lugar maior? A gente mal paga a reforma...'],['tonhao','','Primeiro quita a reforma. Depois junta pra mudança.']],
     depois:[['bia','firme','Reforma quitada e R$ 800 guardados. Fui eu que juntei, tio!'],['tonhao','','Cominho com açafrão... a Rosa ia rir de mim agora.'],['bia','','Por quê, tio?'],['tonhao','','Um dia eu te conto da Casa Aurora.'],['bia','firme','Vou cobrar.']]},
  4:{antes:[['bia','alegre','Olha só, mãe: vinte lugares!'],['tonhao','','E aluguel todo dia. O pessoal da fábrica tem hora pra voltar.'],['bia','firme','Então eu sirvo rápido e a gente fecha no azul. Já fiz isso na garagem.']],
     depois:[['tonhao','','Três dias no azul pagando aluguel. Tá provado, Bia.'],['bia','alegre','Tá provado mesmo. E a moto não para de pedir marmita!']]},
  5:{antes:[['dani','','Os motoqueiros já sabem o meu nome!'],['tonhao','','Marmita bem fechada e na hora. Quem sai da fábrica volta amanhã.'],['bia','firme','E eu tô de olho na nota. Subindo, a gente vai pra Avenida Brasil.']],
     depois:[['bia','alegre','R$ 2.000 guardados! Dá pra Avenida Brasil, tio.'],['tonhao','insegura','Lá fica a Casa Aurora, do Bráulio. Vamos pra outro bairro, Bia.'],['tonhao','','A estrela dele veio do molho da sua mãe. Eu não quero olhar pra aquela porta todo dia.'],['bia','firme','Eu quero. Não, tio: a gente não vai se esconder dele.'],['tonhao','alegre','...Falou igual à Rosa.'],['dani','alegre','Então é lá que a gente vai abrir!']]} };
const ESP_AVULSAS={
  CARDAPIO:[['bia','insegura','Tio, um monte de gente perguntou se só tem PF e coxinha... Eu não soube o que dizer.'],['tonhao','','É... a Rosa fazia um pastel que era uma beleza. Eu nunca aprendi.'],['bia','','E se o senhor fizesse um curso? Tem uns baratinhos...'],['tonhao','','Tá bom, tá bom. Vê aí no Cardápio da lojinha o que cabe no bolso.']],
  SOCORRO:[['tonhao','','O banco ligou, Bia. Deixa que eu falo com o gerente.'],['bia','insegura','Não, tio. A dívida tá no meu nome. Eu ligo.'],['bia','insegura','Ele segurou a parcela desta vez.'],['tonhao','alegre','Tremeu, mas ligou. E é só desta vez: na próxima, ele toma a lanchonete. Olha o caixa antes de comprar.']],
  SOCORRO_FIRME:[['bia','firme','Falei com o gerente, tio. Ele segurou a parcela desta vez.'],['tonhao','','E na próxima?'],['bia','firme','Na próxima ele toma a lanchonete. Não vai ter próxima: eu olho o caixa antes de comprar.']],
  CONFEITARIA:[['dani','','Bia, as famílias daqui sempre perguntam se tem sobremesa.'],['bia','','E eu sempre digo que não tem... Você faz doce, Dani?'],['dani','alegre','Brigadeiro, desde pequena! Com um curso de confeitaria, dá pra vender na mesa e na marmita.'],['tonhao','','Doce bom segura freguês. Vê no Cardápio da lojinha.']],
  JOCA:[['dani','','Terminei o curso de confeitaria! Mas, se eu ficar nos doces, quem cuida da louça e do lixo?'],['bia','','Boa pergunta. Conhece alguém de confiança?'],['dani','','O Joca, do meu colégio. Tá procurando serviço e é trabalhador.'],['joca','insegura','Lixo, louça, mesa suja... pode deixar comigo.'],['bia','firme','Bem-vindo, Joca. Eu acerto tudo na lojinha, em Equipe.']] };
const LIB=id=>L.LIBERA.find(l=>l.id===id).falas;
const tudo=[];
for(const c of [1,2,3,4,5]){ tudo.push(...ESP_HIST[c].antes, ...ESP_HIST[c].depois); }

// ---------- CA1: o texto exato de cada fala trocada ----------
{ const H=L.HISTORIA.slice(0,5), dif=[];
  for(const c of [1,2,3,4,5]){ const h=H[c-1];
    if(JSON.stringify(ach(h.antes))!==JSON.stringify(ESP_HIST[c].antes)) dif.push('cap'+c+' antes');
    if(JSON.stringify(ach(h.depois))!==JSON.stringify(ESP_HIST[c].depois)) dif.push('cap'+c+' depois'); }
  ok(dif.length===0, 'CA1 capítulos 1 a 5 com o texto exato da §4.2 (diferente: '+(dif.join(', ')||'nenhum')+')');
  const abert=L.ABERTURA.cenas.find(c=>c.id==='banco');
  const exp=[
    ['ABERTURA banco', abert && ach(abert.falas), [['bia','','Tem que dar certo...']] ],
    ['CARDAPIO', ach(L.HIST_CARDAPIO.falas), ESP_AVULSAS.CARDAPIO],
    ['SOCORRO falas', ach(L.HIST_SOCORRO.falas), ESP_AVULSAS.SOCORRO],
    ['SOCORRO firme', L.HIST_SOCORRO.firme && ach(L.HIST_SOCORRO.firme), ESP_AVULSAS.SOCORRO_FIRME],
    ['QUITOU 1ª', [ach(L.HIST_QUITOU.falas)[0]], [['bia','alegre','Última parcela da reforma paga, tio! Paguei uma por uma.']]],
    ['TETO última', [ach(L.HIST_TETO.falas).pop()], [['bia','firme','Então eu junto pra mudança.']]],
    ['DIVULGA insegura', [ach(L.HIST_DIVULGA.falas)[1]], [['bia','insegura','No boca a boca? Então vai ter dia fraco...']]],
    ['DIVULGA alegre', [ach(L.HIST_DIVULGA.falas)[2]], [['bia','alegre','E se a gente fizer panfleto? Eu entrego no ponto de ônibus antes de abrir!']]],
    ['LIBERA bia 1ª', [ach(LIB('bia'))[0]], [['bia','insegura','Hoje um freguês disse que eu corro pra lá e pra cá e não dou conta.']]],
    ['LIBERA manut', [ach(LIB('manut'))[1]], [['bia','insegura','Vai quebrar?']]],
    ['LIBERA luxo', [ach(LIB('luxo'))[2]], [['bia','alegre','E se a gente pusesse mais? A foto da mãe na parede...']]],
    ['PLANTA', [ach(L.HIST_PLANTA.falas)[1]], [['bia','alegre','Uma espada-de-são-jorge! Vai ficar na entrada.']]],
    ['LIBERA confeitaria', ach(LIB('confeitaria')), ESP_AVULSAS.CONFEITARIA],
    ['LIBERA joca', ach(LIB('joca')), ESP_AVULSAS.JOCA] ];
  const ruins=exp.filter(([n,a,e])=>JSON.stringify(a)!==JSON.stringify(e)).map(x=>x[0]);
  ok(ruins.length===0, 'CA1 avulsas e aberturas com o texto exato da §4.3 (diferente: '+(ruins.join(', ')||'nenhum')+')'); }

// ---------- CA2: a fala da Dani dada ao Tonhão em HIST_VONTADE_DOCE segue pendente (ver Avisos) ----------
{ const u=L.HIST_VONTADE_DOCE.falas.slice(-1)[0];
  ok(u.q==='bia' && u.s==='Boa, Dani. Vou ver o curso no Cardápio da lojinha.' && u.s2==='Boa ideia. Vou ver o curso no Cardápio da lojinha.', 'CA2 última fala de HIST_VONTADE_DOCE trocada na v11.2 (com s2; antes pendente de confirmação do usuário)'); }

// ---------- CA3: nenhuma fala trocada passa de 120 letras ----------
{ const todas=[...tudo, ...ESP_AVULSAS.CARDAPIO, ...ESP_AVULSAS.SOCORRO, ...ESP_AVULSAS.SOCORRO_FIRME, ...ESP_AVULSAS.CONFEITARIA, ...ESP_AVULSAS.JOCA];
  const longas=todas.filter(f=>[...f[2]].length>120).map(f=>f[2].slice(0,30));
  ok(longas.length===0, 'CA3 nenhuma fala trocada passa de 120 letras (longas: '+(longas.length)+')'); }

// ---------- CA4: as conversas que apontam uma aba da lojinha seguem com as mesmas palavras ----------
{ const txt=(arr)=>arr.map(f=>f[2]).join(' ');
  const abas=[
    [txt(ESP_AVULSAS.CARDAPIO),'Cardápio da lojinha'],
    [txt(ESP_AVULSAS.CONFEITARIA),'Cardápio da lojinha'],
    [txt(ESP_AVULSAS.JOCA),'lojinha, em Equipe'],
    [L.LIBERA.find(l=>l.id==='bia').falas.map(f=>f.s).join(' '),'lojinha, em Equipe'],
    [L.LIBERA.find(l=>l.id==='melhorias').falas.map(f=>f.s).join(' '),'nas Melhorias'],
    [L.LIBERA.find(l=>l.id==='manut').falas.map(f=>f.s).join(' '),'na Manutenção'],
    [L.LIBERA.find(l=>l.id==='salao').falas.map(f=>f.s).join(' '),'no Salão'],
    [L.LIBERA.find(l=>l.id==='luxo').falas.map(f=>f.s).join(' '),'no Luxo'],
    [L.HIST_DIVULGA.falas.map(f=>f.s).join(' '),'Divulgação da lojinha'] ];
  const perdidas=abas.filter(([t,p])=>t.indexOf(p)<0).map(x=>x[1]);
  ok(perdidas.length===0, 'CA4 as conversas com aba da lojinha seguem com as mesmas palavras (perdidas: '+(perdidas.join(', ')||'nenhuma')+')'); }

// ---------- CA5: o campo e é um dos cinco ----------
{ const cinco=['neutra','insegura','firme','alegre','brava'];
  const es=[...tudo, ...ESP_AVULSAS.CARDAPIO, ...ESP_AVULSAS.SOCORRO, ...ESP_AVULSAS.SOCORRO_FIRME, ...ESP_AVULSAS.CONFEITARIA, ...ESP_AVULSAS.JOCA].map(f=>f[1]).filter(e=>e);
  ok(es.length>0 && es.every(e=>cinco.indexOf(e)>=0), 'CA5 o campo e das falas trocadas é um dos cinco ('+es.length+' com e)'); }

// ---------- CA6: HIST_SOCORRO.firme e a escolha pelo nivel 3 ou mais ----------
{ const sv=id=>({ salao:{ ponto:id } });   // v11.2: pela função socorroFalas, nos quatro pontos (antes era uma regex na linha de src/43-telas.js)
  ok(!!L.HIST_SOCORRO.firme && L.socorroFalas(sv('garagem'))===L.HIST_SOCORRO.falas && L.socorroFalas(sv('industrial'))===L.HIST_SOCORRO.falas && L.socorroFalas(sv('avenida'))===L.HIST_SOCORRO.firme && L.socorroFalas(sv('terraco'))===L.HIST_SOCORRO.firme, 'CA6 HIST_SOCORRO.firme existe e socorroFalas escolhe firme na Avenida e no Terraço (nivel 3 ou mais) e falas na Garagem e na área industrial'); }

// ---------- CA7: save antigo segue igual ----------
{ const s=L.normSave({ cap:3, dia:5, convSocorro:'pend', convCard:1 });
  ok(s.convSocorro==='pend' && s.convCard===1 && s.cap===4 && s.dia===5, 'CA7 save com convSocorro pend segue igual depois de normSave (cap 3 vira 4, como antes desta versão)'); }

console.log('\n'+(total-fails)+' de '+total+' checagens ok');
if(fails) process.exit(1);
