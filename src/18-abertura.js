/* ============================================================
   ABERTURA DO MODO HISTÓRIA (v8.5): o sonho da Bia
   Cenas com tempo, legenda e falas; o desenho fica em 25-abertura.js. Um toque passa para a próxima cena, "Pular"
   termina. Com movimento reduzido, cada cena é um quadro parado (o fim da cena, ou pRM) e só avança por toque.
   Toca sozinha uma vez, na 1ª vez que o jogo abre (LS.abertura); depois, pelo botão História do menu.
   ============================================================ */
const ABERTURA = {
  fade: 0.5,   // s de escuro na entrada e na saída de cada cena
  // trilha: cada cena abre com uma frase curta (notas em Hz; [freq, atraso, duração])
  cenas: [
    { id:'casa', t:7, leg:'A Bia cresceu na cozinha de casa, vendo a mãe, a Rosa, cozinhar.',
      falas:[{ q:'rosa', s:'Comida boa é carinho que a gente põe no prato.', de:1.4 }],
      som:[[523,0,.5],[659,.35,.5],[784,.7,.9]] },
    { id:'aurora', t:7, leg:'A Rosa sonhava ser chef. Um dia, conseguiu uma vaga na Casa Aurora, onde o irmão mais velho dela, o Tonhão, já cozinhava.',
      falas:[{ q:'bia', s:'Vai, mãe!', de:1.2 }, { q:'tonhao', s:'Bem-vinda, maninha!', de:3 }],
      som:[[587,0,.4],[740,.3,.4],[880,.6,.8]] },
    { id:'tempero', t:6.5, leg:'Juntos, a Rosa e o Tonhão acertaram o molho da casa. E a Rosa tinha um segredo...',
      falas:[{ q:'tonhao', s:'Que molho é esse, Rosa?!', de:3.2 }],
      som:[[659,0,.4],[587,.3,.4],[659,.6,.4],[880,.9,.8]] },
    { id:'estrela', t:7.5, leg:'Pouco depois, a Casa Aurora ganhou a estrela do Michelzão. O tempero era deles, mas a fama ficou com o chef Bráulio.',
      falas:[{ q:'braulio', s:'O tempero? Receita minha!', de:2.6 }],
      som:[[784,0,.3],[988,.2,.3],[1175,.4,.3],[1568,.6,.9],[440,1.8,.9]] },
    // a fala derradeira da Rosa e, depois, a cortina se fecha (com movimento reduzido, o quadro é o de antes da cortina: pRM)
    { id:'hospital', t:8.5, pRM:0.55, leg:'Logo depois, a Rosa adoeceu.',
      falas:[{ q:'rosa', s:'Cozinha sempre com carinho, filha.', de:1.4, ate:5.2 }, { q:'bia', s:'Prometo, mãe.', de:3.4, ate:5.4 }],
      som:[[440,0,.9],[392,.8,.9],[349,1.6,1.4]] },
    // a Bia sozinha, triste, no corredor; nada mostrado da morte
    { id:'saudade', t:6.5, leg:'A Rosa partiu.',
      falas:[],
      som:[[349,0,1.2],[330,1.1,1.2],[294,2.2,1.8]] },
    { id:'promessa', t:8, leg:'A Bia guardou a lição da mãe: comida é afeto, é alegria. Em homenagem a ela, decidiu ter um restaurante com a estrela do Michelzão.',
      falas:[{ q:'bia', s:'Essa estrela vai ser nossa, mãe.', de:3.6 }],
      som:[[349,0,.7],[440,.6,.7],[523,1.2,1.1]] },
    { id:'tonhao', t:7.5, leg:'Desanimado, o Tonhão largou a Casa Aurora. Sabendo do sonho da sobrinha, arregaçou as mangas.',
      falas:[{ q:'tonhao', s:'Dinheiro eu não tenho, Bia. Mas braço pra cozinha tenho de sobra!', de:2.4 }],
      som:[[392,0,.3],[494,.25,.3],[587,.5,.6]] },
    { id:'banco', t:7.5, leg:'Sem um tostão, a Bia deu a cartada: correu ao banco e pegou um empréstimo para reformar a garagem, tudo nos conformes da vigilância sanitária.',
      falas:[{ q:'bia', s:'Vai dar certo!', de:1 }],
      som:[[523,0,.15],[587,.15,.15],[659,.3,.15],[784,.45,.4],[1046,4.4,.5]] },
    { id:'inauguracao', t:8.5, leg:'E assim nasceu a Lanchonete Corre-Corre.', titulo:'O sonho da Bia',
      falas:[],
      som:[[523,0,.2],[659,.18,.2],[784,.36,.2],[1046,.54,.9],[1318,1.1,1.2]] }
  ]
};
/* v11: o final (a manhã seguinte à noite da estrela), no mesmo motor. `min`: as estrelas que o trecho pede; `leg` pode ser uma lista de três textos (para 1, 2 e 3 estrelas) */
const FINAL = { fade:0.5, cenas:[
  { id:'telefone', t:6.5, min:1, leg:'Na manhã seguinte, o telefone do Terraço tocou cedo.',
    falas:[{ q:'bia', s:'Alô?... É do Michelzão?!', de:2.4 }], som:[[784,0,.2],[988,.25,.2],[784,.9,.2],[988,1.15,.2]] },
  { id:'placa', t:8, min:1, leg:['A Lanchonete Corre-Corre ganhou a estrela do Michelzão.', 'A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão.', 'A Lanchonete Corre-Corre ganhou três estrelas do Michelzão, a nota mais alta do guia.'],
    falas:[{ q:'tonhao', s:'Tá torta?', de:2.6 }, { q:'bia', s:'Tá perfeita, tio.', de:4.4 }], som:[[784,0,.3],[988,.2,.3],[1175,.4,.3],[1568,.6,.9]] },
  { id:'apagou', t:7.5, min:1, leg:'Na mesma semana, o guia voltou à Casa Aurora e pediu o molho da casa. O Bráulio nunca soube repetir. A estrela de lá se apagou.',
    falas:[{ q:'braulio', s:'Cadê o tempero?!', de:3 }], som:[[440,0,.5],[392,.5,.5],[330,1,.9]] },
  { id:'retrato', t:8, min:1, leg:'A Bia pendurou a estrela ao lado do retrato da mãe.',
    falas:[{ q:'bia', s:'Essa estrela é nossa, mãe.', de:3.4 }], som:[[349,0,.7],[440,.6,.7],[523,1.2,1.1]] },
  { id:'equipe', t:8, min:2, leg:'Ninguém ganha estrela sozinho. A foto da equipe foi para a parede: a Dani, o Joca, a Cami, o Anselmo e a Lia.',
    falas:[{ q:'tonhao', s:'Olha o passarinho!', de:2.8 }], som:[[523,0,.2],[659,.18,.2],[784,.36,.2],[1046,.54,.7]] },
  { id:'escola', t:8.5, min:1, leg:'E a garagem da Rosa reabriu. Agora é a Cozinha da Rosa, a escola de cozinha do bairro.',
    falas:[{ q:'dani', s:'Eu era lenta, mas aprendi rápido. Vocês também vão!', de:3 }], som:[[587,0,.4],[740,.3,.4],[880,.6,.8]] },
  { id:'ceu', t:8, min:3, leg:'Dizem que, do Terraço, nas noites limpas, dá para ver três estrelas bem juntinhas.',
    falas:[{ q:'bia', s:'Uma delas pisca pra mim, tio.', de:2.6 }, { q:'tonhao', s:'Eu sei qual é.', de:4.6 }], som:[[1046,0,.4],[1318,.5,.4],[1568,1,1.2]] },
  { id:'roda', t:9, min:1, leg:'Toda tarde, a Bia desce até a garagem. E sempre tem uma criança na porta da cozinha, olhando.', titulo:'Fim',
    falas:[{ q:'bia', s:'Comida boa é carinho que a gente põe no prato.', de:3.2 }], som:[[523,0,.5],[659,.35,.5],[784,.7,.9],[1046,1.6,1.4]] }
] };
/* os créditos: um quadro só, depois da última cena do final (some com um toque ou em 6 s) */
const FINAL_CREDITOS = { id:'creditos', t:6, leg:'', falas:[], cheia:true, som:[[523,0,.5],[659,.35,.5],[784,.7,.9]] };
/* as cenas do final que tocam: as de `min` até as estrelas ganhas (est); com `desde` (as estrelas já vistas), só a placa e as cenas que ainda não tinham sido vistas; os créditos, se pedidos */
function finalCenas(est, desde, creditos){
  est = clamp(Math.round(+est) || 1, 1, 3); desde = clamp(Math.round(+desde) || 0, 0, 3);
  const v = FINAL.cenas.filter(c => c.min <= est && (desde < 1 || c.id === 'placa' || c.min > desde));
  return creditos ? v.concat([FINAL_CREDITOS]) : v;
}
function aberturaVista(){ return lsGet(LS.abertura) === '1'; }

class Abertura {
  // origem: 'auto' (a 1ª vez que o jogo abre: no fim, vai ao menu) ou 'menu' (botão História: no fim, o cartão "Em breve")
  // v11: roteiro (o ABERTURA, ou o FINAL com opt = { est, desde, creditos }: as cenas do final que tocam, ver finalCenas)
  constructor(origem, rm, roteiro, opt){
    this.origem = origem === 'auto' ? 'auto' : 'menu';
    this.roteiro = roteiro || ABERTURA; opt = opt || {};
    this.est = clamp(Math.round(+opt.est) || 1, 1, 3);
    this.cenas = this.roteiro === FINAL ? finalCenas(this.est, opt.desde, opt.creditos) : this.roteiro.cenas;
    this.rm = !!rm; this.i = 0; this.t = 0; this.fim = false; this.tm = 0;
    this.onCena = null; this.onFim = null;
  }
  get n(){ return this.cenas.length; }
  get cena(){ return this.cenas[this.i]; }
  // a legenda da cena (uma lista de textos vale para 1, 2 e 3 estrelas)
  get leg(){ const l = this.cena.leg; return Array.isArray(l) ? l[this.est - 1] : l; }
  // andamento da cena, de 0 a 1 (com movimento reduzido, sempre o quadro final)
  get p(){ return this.rm ? (this.cena.pRM != null ? this.cena.pRM : 1) : clamp(this.t / this.cena.t, 0, 1); }
  // opacidade do escuro por cima da cena (entrada e saída); 0 com movimento reduzido
  get escuro(){
    if (this.rm) return 0;
    const f = this.roteiro.fade, t = this.t, d = this.cena.t;
    return t < f ? 1 - t / f : (t > d - f ? clamp((t - (d - f)) / f, 0, 1) : 0);
  }
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
function aberturaSom(c){ (c.som || []).forEach(n => Sfx.tone(n[0], n[2], 'triangle', 0.045, n[1])); }

