/* ============================================================
   ABERTURA DO MODO HISTÓRIA (v8.5): o sonho da Bia
   Cenas com tempo, legenda e falas; o desenho da abertura fica em 27-abertura-nova.js e o do final, em 28-final.js. Um toque passa para a próxima cena, "Pular"
   termina. Com movimento reduzido, cada cena é um quadro parado (o fim da cena, ou pRM) e só avança por toque.
   Toca sozinha uma vez, na 1ª vez que o jogo abre (LS.abertura); depois, pelo botão História do menu.
   ============================================================ */
/* a abertura (refeita da v11.12 à v11.15, docs/ABERTURA.md): um filminho de quadro cheio. Cada cena tem a câmera (`cam`: de e para, [cx, cy, z], o centro
   do que se vê e a aproximação; `meio`: [cx, cy, z, p], por onde passa), a transição de saída (`sai`, nos últimos `trans` segundos), o clima do tema
   da Rosa (`clima`, ver ab2Notas) e os efeitos (`fx`: [nome da AB_FX, segundo]). `legDe`: quando a legenda entra (padrão 0,6 s). O desenho fica em
   27-abertura-nova.js. O FINAL (refeito nas v11.16 a v11.18) usa o mesmo motor. */
const ABERTURA = { cheio:true, trans:0.5, cenas:[
  { id:'porta', t:7, leg:'A Bia cresceu na porta da cozinha.',
    falas:[{ q:'rosa', s:'Vem provar, filha.', de:3.2 }],
    cam:{ de:[330,330,1.7], para:[610,300,1] }, sai:'corte', clima:'casa', fx:[['panela',0.4]] },
  { id:'carinho', t:7, leg:'', pRM:0.6,
    falas:[{ q:'rosa', s:'Comida boa é carinho que a gente põe no prato.', de:2.6 }],
    cam:{ de:[660,330,1.9], para:[680,310,2.1] }, sai:'escuro', clima:'casa', fx:[['panela',0.3],['clique',6.0]] },
  { id:'aurora', t:7, leg:'A Rosa sonhava ser chef.',
    falas:[{ q:'bia', s:'Vai, mãe!', de:1.0 }, { q:'tonhao', s:'Bem-vinda, maninha!', de:3.0 }],
    cam:{ de:[560,310,1], para:[690,330,1.25] }, sai:'passa', clima:'sonho', fx:[['sino',3.1]] },
  { id:'molho', t:7, leg:'Com o irmão, ela criou um molho. E guardou um segredo.',
    falas:[{ q:'tonhao', s:'Que molho é esse, Rosa?!', de:4.2 }],
    cam:{ de:[610,320,1.15], para:[640,340,1.8] }, sai:'iris', clima:'sonho', fx:[['panela',0.5],['brilho',3.6]] },
  { id:'estrela', t:7, leg:'A estrela veio. A fama ficou com o chef Bráulio.', legDe:3.4,
    falas:[{ q:'braulio', s:'Receita minha!', de:1.6 }],
    cam:{ de:[470,300,1.5], para:[900,320,1.7] }, sai:'escuro', clima:'gala', fx:[['aplauso',0.2]] },
  { id:'despedida', t:7, leg:'Pouco depois, a Rosa adoeceu.', pRM:0.7,
    falas:[{ q:'rosa', s:'Cozinha sempre com carinho, filha.', de:1.6 }, { q:'bia', s:'Prometo, mãe.', de:4.2 }],
    cam:{ de:[560,400,2], para:[575,330,2] }, sai:'escuro', clima:'triste', fx:[] },
  { id:'janela', t:7, leg:'A Rosa partiu.', legDe:1.0,
    falas:[],
    cam:{ de:[610,300,1], meio:[610,300,1,0.5], para:[700,280,1.35] }, sai:'segue', clima:'triste',   // v11.14: a câmera fica parada até a metade
    fx:[['chuva',0.2],['estrela',3.9]] },
  { id:'promessa', t:8, leg:'A Bia cresceu. E fez uma promessa.', legDe:0.8,
    falas:[{ q:'bia', s:'Essa estrela vai ser nossa, mãe.', de:4.6 }],
    cam:{ de:[700,280,1.35], meio:[610,300,1.1,0.5], para:[650,290,1.6] }, sai:'passa', clima:'esperanca', fx:[['panela',3.4],['estrela',6.8]] },
  { id:'tio', t:6, leg:'O tio Tonhão largou a Casa Aurora.',
    falas:[{ q:'tonhao', s:'Dinheiro eu não tenho, Bia. Mas braço pra cozinha tenho de sobra!', de:2.4 }],
    cam:{ de:[760,320,1.2], para:[420,320,1.2] }, sai:'passa', clima:'esperanca', fx:[] },
  { id:'banco', t:6, leg:'Sem um tostão, a Bia foi ao banco.',
    falas:[{ q:'bia', s:'Tem que dar certo...', de:0.8 }],
    cam:{ de:[600,310,1], para:[640,300,1.9] }, sai:'iris', clima:'esperanca', fx:[['carimbo',3.3]] },
  { id:'portao', t:8, leg:'E a garagem da Rosa virou a Lanchonete Corre-Corre.', legDe:4.6, titulo:'O sonho da Bia',
    falas:[{ q:'tonhao', s:'Abre, Bia.', de:2.2 }],
    cam:{ de:[560,340,1.5], para:[610,300,1] }, sai:'escuro', clima:'fim', fx:[['portao',3.6],['estrela',6.4]] }
] };
/* o final (a manhã seguinte à noite da estrela; refeito nas v11.16 a v11.18, docs/FINAL.md §4), no motor da abertura nova (quadro cheio). Como na ABERTURA: `cam` (de e para), `sai`
   (a transição), `clima` (o som, ver ab2Notas), `fx`, `legDe`. `min`: as estrelas que o trecho pede; `leg` pode ser uma lista de três textos (para 1, 2 e 3 estrelas). Os créditos (`creditos`)
   são um quadro só, depois da última cena (somem com um toque ou em 6 s). O desenho fica em 28-final.js. */
const FINAL = { cheio:true, final:true, trans:0.5, cenas:[
  { id:'telefone', t:6.5, min:1, leg:'Na manhã seguinte, o telefone do Terraço tocou cedo.',
    falas:[{ q:'bia', s:'Alô?... É do Michelzão?!', de:2.4 }],
    cam:{ de:[950,400,1.9], para:[760,300,1.25] }, sai:'corte', clima:'sonho', fx:[['telefone',0.2],['telefone',1.4]] },
  { id:'placa', t:8, min:1, leg:['A Lanchonete Corre-Corre ganhou a estrela do Michelzão.', 'A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão.', 'Três estrelas do Michelzão: a nota mais alta do guia.'],
    falas:[{ q:'tonhao', s:'Tá torta?', de:2.6 }, { q:'bia', s:'Tá perfeita, tio.', de:4.4 }],
    cam:{ de:[380,330,1.15], para:[340,230,1.9] }, sai:'iris', clima:'festa', fx:[['parafuso',0.5],['brilho',4.8]] },
  { id:'apagou', t:7.5, min:1, leg:'Sem o molho da Rosa, a estrela da Casa Aurora se apagou.', legDe:4.8,
    falas:[{ q:'braulio', s:'Cadê o tempero?!', de:3 }],
    cam:{ de:[865,300,2], para:[780,330,1.15] }, sai:'escuro', clima:'triste', fx:[['apaga',4.6]] },
  { id:'retrato', t:8, min:1, leg:'A Bia pendurou a estrela ao lado do retrato da mãe.',
    falas:[{ q:'bia', s:'Essa estrela é nossa, mãe.', de:3.4 }],
    cam:{ de:[470,330,1.2], para:[470,270,2] }, sai:'passa', clima:'casa', fx:[['estrela',2.8]] },
  { id:'equipe', t:8, min:2, leg:'Ninguém ganha estrela sozinho.',
    falas:[{ q:'tonhao', s:'Olha o passarinho!', de:2.8 }],
    cam:{ de:[610,330,1], para:[620,310,1.15] }, sai:'passa', clima:'festa', fx:[['clique',4.8]] },
  { id:'escola', t:8.5, min:1, leg:'A garagem da Rosa reabriu: é a escola de cozinha do bairro.',
    falas:[{ q:'dani', s:'Eu era lenta, mas aprendi rápido. Vocês também vão!', de:3 }],
    cam:{ de:[610,330,1], para:[610,390,1.7] }, sai:'escuro', clima:'esperanca', fx:[['sino',0.4],['panela',3.6]] },
  { id:'ceu', t:8, min:3, leg:'Do Terraço, nas noites limpas, dá para ver três estrelas.',
    falas:[{ q:'bia', s:'Uma delas pisca pra mim, tio.', de:2.6 }, { q:'tonhao', s:'Eu sei qual é.', de:4.6 }],
    cam:{ de:[610,190,1.6], para:[610,330,1.1] }, sai:'escuro', clima:'estrelas', fx:[['estrela',1.0],['estrela',6.4]] },
  { id:'roda', t:9, min:1, leg:'E sempre tem uma criança na porta da cozinha, olhando.', titulo:'Fim',
    falas:[{ q:'bia', s:'Comida boa é carinho que a gente põe no prato.', de:3.2 }],
    cam:{ de:[330,330,1.7], para:[610,300,1] }, sai:'escuro', clima:'fim', fx:[['panela',0.4]] }
], creditos:{ id:'creditos', t:6, leg:'', falas:[], cheia:true, cam:{ de:[610,240,1.3], para:[610,300,1] }, sai:'escuro', clima:'creditos', fx:[['estrela',0.6]] } };
/* as cenas do final que tocam: as de `min` até as estrelas ganhas (est); com `desde` (as estrelas já vistas), só a placa e as cenas que ainda não tinham sido vistas; os créditos, se pedidos */
function finalCenas(est, desde, creditos, roteiro){
  roteiro = roteiro || FINAL;
  est = clamp(Math.round(+est) || 1, 1, 3); desde = clamp(Math.round(+desde) || 0, 0, 3);
  const v = roteiro.cenas.filter(c => c.min <= est && (desde < 1 || c.id === 'placa' || c.min > desde));
  return creditos ? v.concat([roteiro.creditos]) : v;
}
/* a câmera da abertura nova. ab2Cabe encosta na borda: mantém o z (nunca menor que 1) e leva o centro só até onde o retângulo visto ainda cabe em
   0 a TW por 0 a H. ab2Cam(cena, p): de `de` a `para` (passando pelo `meio`, se houver), com abSuave. ab2Tela: um ponto da cena na tela. */
function ab2Cabe(v){ const z = Math.max(1, v[2]), mw = TW / 2 / z, mh = H / 2 / z; return [clamp(v[0], mw, TW - mw), clamp(v[1], mh, H - mh), z]; }
function ab2Cam(cena, p){
  const C = cena && cena.cam; if (!C) return { cx:TW / 2, cy:H / 2, z:1 };
  p = clamp(p, 0, 1);
  let a = ab2Cabe(C.de), b = ab2Cabe(C.para), k = p;
  if (C.meio){ const m = ab2Cabe(C.meio), pm = C.meio[3]; if (p < pm){ b = m; k = p / pm; } else { a = m; k = (p - pm) / (1 - pm); } }
  k = abSuave(k);
  return { cx:a[0] + (b[0] - a[0]) * k, cy:a[1] + (b[1] - a[1]) * k, z:a[2] + (b[2] - a[2]) * k };
}
function ab2Tela(cam, x, y){ return [(x - cam.cx) * cam.z + TW / 2, (y - cam.cy) * cam.z + H / 2]; }
function aberturaVista(){ return lsGet(LS.abertura) === '1'; }

class Abertura {
  // origem: 'auto' (a 1ª vez que o jogo abre: no fim, vai ao menu) ou 'menu' (botão História: no fim, o cartão "Em breve")
  // v11: roteiro (o ABERTURA, ou o FINAL com opt = { est, desde, creditos }: as cenas do final que tocam, ver finalCenas)
  constructor(origem, rm, roteiro, opt){
    this.origem = origem === 'auto' ? 'auto' : 'menu';
    this.roteiro = roteiro || ABERTURA; opt = opt || {};
    this.est = clamp(Math.round(+opt.est) || 1, 1, 3);
    this.cenas = this.roteiro.final ? finalCenas(this.est, opt.desde, opt.creditos, this.roteiro) : this.roteiro.cenas;
    this.rm = !!rm; this.i = 0; this.t = 0; this.fim = false; this.tm = 0;
    this.onCena = null; this.onFim = null;
  }
  get n(){ return this.cenas.length; }
  get cena(){ return this.cenas[this.i]; }
  // a legenda da cena (uma lista de textos vale para 1, 2 e 3 estrelas)
  get leg(){ const l = this.cena.leg; return Array.isArray(l) ? l[this.est - 1] : l; }
  // andamento da cena, de 0 a 1 (com movimento reduzido, sempre o quadro final)
  get p(){ return this.rm ? (this.cena.pRM != null ? this.cena.pRM : 0.8) : clamp(this.t / this.cena.t, 0, 1); }   // o quadro parado é o de p 0,8 (ou o pRM da cena)
  // opacidade do escuro por cima da cena (entrada e saída); 0 com movimento reduzido
  get escuro(){
    if (this.rm) return 0;
    const f = this.roteiro.trans, t = this.t, d = this.cena.t;
    // só a entrada da 1ª cena e as cenas com sai 'escuro' (a saída delas e a entrada da seguinte)
    const ant = this.cenas[this.i - 1], ent = this.i === 0 || (ant && ant.sai === 'escuro'), sai = this.cena.sai === 'escuro';
    return ent && t < f ? 1 - t / f : (sai && t > d - f ? clamp((t - (d - f)) / f, 0, 1) : 0);
  }
  // v11.12: a câmera da cena agora ({ cx, cy, z }); com movimento reduzido, fica no `para`
  get cam(){ return ab2Cam(this.cena, this.rm ? 1 : this.t / this.cena.t); }
  // v11.12: a transição de saída, nos últimos `roteiro.trans` segundos ({ tipo, k de 0 a 1 }); null fora deles, com movimento reduzido e na última cena (a não ser no escuro)
  get trans(){
    const R = this.roteiro, c = this.cena;
    if (!R.trans || !c.sai || this.rm) return null;
    if (this.i + 1 >= this.n && c.sai !== 'escuro') return null;
    const k = (this.t - (c.t - R.trans)) / R.trans;
    return k > 1e-9 ? { tipo:c.sai, k:clamp(k, 0, 1) } : null;
  }
  // v11.12: a opacidade da legenda, que entra em `legDe` (padrão 0,6 s) com 0,4 s de transparência
  get legA(){ return this.rm ? 1 : clamp((this.t - (this.cena.legDe != null ? this.cena.legDe : 0.6)) / 0.4, 0, 1); }
  falas(){ return this.cena.falas.filter(f => this.rm || (this.t >= f.de && !(f.ate && this.t >= f.ate))); }   // ate: some (a cortina vai fechar)
  // texto da cena para o leitor de tela: legenda, falas e título
  texto(){
    const c = this.cena, nome = { rosa:'Rosa', bia:'Bia', tonhao:'Tonhão', braulio:'Bráulio', dani:'Dani' };
    return [this.leg].concat(c.falas.map(f => nome[f.q] + ': ' + f.s), c.titulo ? [c.titulo] : [], c.cheia ? ['Lanchonete Corre-Corre. O sonho da Bia. Obrigado por jogar!'] : []).filter(Boolean).join(' ');
  }
  update(dt){
    if (this.fim) return;
    this.tm += dt;
    if (this.rm) return;   // quadro parado: só o toque avança
    this.t += dt;
    if (this.t >= this.cena.t) this.seguir();
  }
  seguir(){
    if (this.fim) return;
    if (this.i + 1 >= this.n) return this.terminar();
    this.i++; this.t = 0;
    if (this.onCena) this.onCena(this);
  }
  // volta um quadro: a cena anterior (na primeira, recomeça a cena)
  voltar(){
    if (this.fim) return;
    if (this.i > 0) this.i--;
    this.t = 0;
    if (this.onCena) this.onCena(this);
  }
  pular(){ this.terminar(); }
  terminar(){ if (this.fim) return; this.fim = true; if (this.onFim) this.onFim(this); }
}
/* a frase da trilha de cada cena (respeita o botão de som, como o resto do áudio) */
/* v11.12: a cena toca o tema da Rosa no clima dela (ab2Notas) e os efeitos (AB_FX), por uma faixa própria (Sfx.faixa), cortada quando a cena troca ou a abertura fecha (aberturaSom(null)). */
let abFaixa = null;
function aberturaSom(c){
  Sfx.corta(abFaixa); abFaixa = null;
  if (!c) return;
  const fx = Sfx.faixa(); abFaixa = fx;
  ab2Notas(c).forEach(n => Sfx.tone(n[0], n[2], n[3], n[4], n[1], 0, fx));
  (c.fx || []).forEach(e => { const f = AB_FX[e[0]]; if (f) f(e[1], fx); });
}
/* o tema da Rosa (docs/ABERTURA.md §5): 8 notas em Dó maior, e a frase fecha em Sol4 (o dobro do tempo) */
const AB2_TEMA = [392,523,494,523,659,587,523,440,392];
/* a frase repetida de `de` até `ate` (s): o.passo (s por nota), o.onda, o.vol, o.k (multiplica a frequência), o.baixo (Dó3 e Sol3 a cada 4 notas), o.terca (a terça acima nas notas pares) */
function ab2Frase(o){
  const v = []; let t = o.de || 0;
  for (let i = 0; t < o.ate - 1e-9; i++){
    const j = i % 9, dobro = j === 8 ? 2 : 1, f = AB2_TEMA[j] * (o.k || 1);
    v.push([f, t, o.passo * dobro * 1.8, o.onda, o.vol]);
    if (o.terca && j % 2 === 1) v.push([f * 1.25, t, o.passo * 1.8, o.onda, 0.025]);
    if (o.baixo && j % 4 === 0) v.push([j === 4 ? 196 : 131, t, o.passo * 4, 'sine', 0.03]);
    t = Math.round((t + o.passo * dobro) * 1000) / 1000;
  }
  return v;
}
/* as notas que enchem a cena, pelo clima: [freq, atraso, duração, onda, volume] */
function ab2Notas(cena){
  const d = cena.t, casa = (passo, ate) => ab2Frase({ passo, onda:'triangle', vol:0.045, baixo:true, ate:ate || d });
  const triste = de => ab2Frase({ de, passo:0.8, onda:'sine', vol:0.04, k:5/6, ate:d });
  switch (cena.clima){
    case 'sonho': return ab2Frase({ passo:0.34, onda:'triangle', vol:0.045, baixo:true, terca:true, ate:d });
    case 'gala': return AB2_TEMA.slice(0,4).map((f,i) => [f, i * 0.2, 0.36, 'square', 0.04]).concat(triste(3.2));
    case 'triste': return triste(0);
    case 'festa': return AB2_TEMA.slice(0,4).map((f,i) => [f, i * 0.2, 0.36, 'square', 0.04]).concat(ab2Frase({ de:1.0, passo:0.34, onda:'triangle', vol:0.045, baixo:true, terca:true, ate:d }));   // v11.16: a fanfarra e o tema do sonho
    case 'estrelas': return ab2Frase({ passo:0.6, onda:'sine', vol:0.035, k:2, ate:d });   // a caixinha de música: o tema uma oitava acima
    case 'creditos': return casa(0.42, d - 1.4).concat([523,659,784,1046].map(f => [f, d - 1.4, 1.4, 'triangle', 0.045]));
    case 'esperanca': return casa(0.46);
    case 'fim': {   // casa até 5,4 s; o tema uma oitava acima; e o acorde final, que acaba junto com a cena
      const ac = d - 1.4, v = casa(0.42, 5.4);
      for (let i = 0, t = 5.4; t < ac - 1e-9; i++, t = Math.round((t + 0.3) * 1000) / 1000) v.push([AB2_TEMA[i % 8] * 2, t, 0.54, 'triangle', 0.045]);
      return v.concat([523,659,784,1046].map(f => [f, ac, 1.4, 'triangle', 0.045]));
    }
    default: return casa(0.42);
  }
}
/* os efeitos da abertura nova: nome → (atraso em s, faixa) */
const AB_FX = {
  panela(d, s){ [0,0.16,0.3,0.5,0.62,0.8].forEach((a,i) => Sfx.noise(0.05, 0.05, d + a, 400 + i * 60, s)); },   // borbulha
  clique(d, s){ Sfx.noise(0.03, 0.09, d, 3000, s); Sfx.tone(1800, 0.04, 'square', 0.035, d + 0.01, 0, s); },
  sino(d, s){ Sfx.tone(1318, 0.4, 'sine', 0.08, d, 0, s); },
  brilho(d, s){ [1568,1976,2349].forEach((f,i) => Sfx.tone(f, 0.3, 'sine', 0.05, d + i * 0.09, 0, s)); },
  aplauso(d, s){ Sfx.noise(2.4, 0.05, d, 1800, s); },
  chuva(d, s){ Sfx.noise(2.6, 0.03, d, 1200, s); },
  estrela(d, s){ Sfx.tone(1568, 0.6, 'sine', 0.07, d, 0, s); Sfx.tone(2093, 0.6, 'sine', 0.04, d + 0.04, 0, s); },
  carimbo(d, s){ Sfx.tone(110, 0.18, 'sine', 0.12, d, 0, s); Sfx.noise(0.08, 0.1, d, 900, s); },
  portao(d, s){ Sfx.noise(1.1, 0.07, d, 500, s); Sfx.tone(90, 1.1, 'sawtooth', 0.03, d, 180, s); },
  // v11.16 (o final): o telefone, os parafusos da placa e a estrela que apaga
  telefone(d, s){ Sfx.tone(784, 0.2, 'square', 0.035, d, 0, s); Sfx.tone(988, 0.2, 'square', 0.035, d + 0.25, 0, s); },
  parafuso(d, s){ [0,0.18,0.36].forEach(a => Sfx.noise(0.05, 0.05, d + a, 2400, s)); },
  apaga(d, s){ Sfx.tone(440, 0.6, 'sawtooth', 0.03, d, 110, s); Sfx.noise(0.12, 0.06, d, 800, s); }
};

