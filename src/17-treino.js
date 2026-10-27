/* ============================================================
   MISSÃO ZERO (v8.2): o dia de treino, com pop-ups passo a passo
   Uma mesa só: um casal de vovós chega com 1 coração, e a Bia faz o ciclo inteiro (sentar na cor
   certa, esperar o cardápio, anotar, levar ao Tonhão, buscar o prato, servir, cafezinho, cobrar,
   recolher a louça, pia, lavar e tirar o lixo). A paciência não acaba e nada vai para a carreira.
   Cada passo tem o texto do pop-up e o alvo (retângulos do mundo, ou da tela com `tela`). Passo com
   `ok` explica e o jogo espera um toque; passo com `feito` segue sozinho quando a condição vale.
   `segura` para o relógio da mesa (cardápio e refeição), para dar tempo de fazer o passo
   ============================================================ */
const TREINO_COR = ['vermelhas', 'azuis', 'amarelas', 'verdes'];
const TREINO_CHEGA = 0.6;   // segundos até o grupo aparecer na rua

function treinoMesaR(g){ const t = g.treino.mesa; return tableRect(t); }
function treinoGrupoR(g){ const grp = g.treino.grupo; return grp && grp.state === 'queue' ? queueRect(grp) : treinoMesaR(g); }
function treinoSt(k){ return () => STATIONS[k].rect; }
function treinoPrato(g){ return g.kitchen.plates.find(p => p && p.group === g.treino.grupo); }
function treinoNaMao(g, kind){ return g.bia.hands.some(h => h.kind === kind && (!h.group || h.group === g.treino.grupo)); }

const TREINO_PASSOS = [
  { id:'oi', ok:true, tit:'Missão zero: o dia de treino',
    txt:'Vamos aprender todo o trabalho da Bia com uma mesa só. No treino, ninguém perde a paciência e o dinheiro não vai para a carreira.' },
  { id:'chega', alvo:g => [{ x:QUEUE.x - 90, y:QUEUE.ys[0] - 84, w:180, h:104 }], tit:'Chegou freguesia!',
    txt:'Quem chega espera lá fora, na calçada. Lá vêm o vovô e a vovó...', feito:g => { const grp = g.treino.grupo; return !!grp && grp.state === 'queue' && !grp.path.length; } },
  { id:'coracoes', ok:true, alvo:g => { const grp = g.treino.grupo; return [{ x:grp.x - 40, y:grp.y - 80, w:80, h:30 }]; }, tit:'Os corações são a paciência',
    txt:'Este casal chegou cansado: só 1 coração. Esperar gasta corações, e cada atendimento devolve 1. Quanto mais corações na hora da conta, mais gorjeta.' },
  { id:'cor', ok:true, alvo:g => [treinoGrupoR(g), treinoMesaR(g)], tit:'Combine as cores',
    txt:g => 'Veja a cor das camisas: ' + CHAIRS[g.treino.grupo.color].n + '. A mesa ' + g.treino.mesa.id + ' tem cadeiras ' + TREINO_COR[g.treino.mesa.color] + '. Sentar o grupo na mesa da mesma cor dá 15 pontos a mais.' },
  { id:'sentar', alvo:g => [treinoGrupoR(g), treinoMesaR(g)], tit:'Leve o grupo à mesa',
    txt:g => 'Arraste o grupo até a mesa de cadeiras ' + TREINO_COR[g.treino.mesa.color] + ' (ou toque no grupo e depois na mesa).', feito:g => !!g.treino.grupo.table },
  { id:'cardapio', alvo:g => [treinoMesaR(g)], tit:'Combinou!',
    txt:'Sentar vale 10 pontos de atendimento e 1 coração; a cor certa, mais 15 pontos. Agora eles escolhem no cardápio (o balão com o anel). Espere eles chamarem.',
    feito:g => g.treino.grupo.state === 'wantOrder' },
  { id:'anotar', alvo:g => [treinoMesaR(g)], tit:'Chamaram!',
    txt:'O balão com "!" é o grupo chamando a Bia. Toque na mesa para ela anotar o pedido.', feito:g => g.treino.grupo.state !== 'wantOrder' && g.treino.grupo.state !== 'reading' },
  { id:'fila', ok:true, tela:true, alvo:g => [{ x:HUDX.dir + 696, y:546, w:96, h:52 }, { x:HUDX.fila + 354, y:546, w:316, h:52 }], tit:'Mãos e fila de ações',
    txt:'A comanda está nas mãos da Bia (MÃOS, lá embaixo). Cada toque vira uma tarefa na FILA, ao lado: a Bia faz uma depois da outra. Um toque no quadrinho cancela a tarefa.' },
  { id:'cozinha', alvo:treinoSt('order'), tit:'Leve o pedido ao Tonhão',
    txt:'Toque na cozinha, no Chef Tonhão, para entregar a comanda.', feito:g => g.kitchen.progressFor(g.treino.grupo) >= 0 || !!treinoPrato(g) },
  { id:'preparo', alvo:treinoSt('order'), tit:'O Tonhão está cozinhando',
    txt:'Agora é esperar o prato ficar pronto. Na carreira, a Bia aproveita esse tempo para atender as outras mesas.', feito:g => !!treinoPrato(g) || treinoNaMao(g, 'dish') },
  { id:'prato', alvo:treinoSt('plates'), tit:'Prato pronto!',
    txt:'Toque no prato, no balcão, para a Bia pegar.', feito:g => treinoNaMao(g, 'dish') || g.treino.grupo.state === 'eating' },
  { id:'servir', alvo:g => [treinoMesaR(g)], tit:'Sirva a comida',
    txt:'Toque na mesa para servir. Prato entregue vale 20 pontos e 1 coração. Dinheiro, só na conta: cada um paga o que comeu.', feito:g => g.treino.grupo.state === 'eating' },
  { id:'cafe', segura:true, alvo:treinoSt('coffee'), tit:'Hora do cafezinho',
    txt:'Enquanto eles comem, a Bia pode levar um cafezinho. Toque na cafeteira.', feito:g => treinoNaMao(g, 'coffee') || g.treino.grupo.coffee },
  { id:'cafe2', segura:true, alvo:g => [treinoMesaR(g)], tit:'Sirva o cafezinho',
    txt:'Agora toque na mesa para servir o cafezinho.', feito:g => g.treino.grupo.coffee },
  { id:'bonus', ok:true, segura:true, alvo:g => [treinoMesaR(g)], tit:'Os bônus do cafezinho',
    txt:'Cada cafezinho põe R$ ' + DRINK_PRICE.coffee + ' na conta, rende 5 pontos e 1 coração (2 com a Cafeteira de 2 bocas, da lojinha). E coração vale gorjeta: com 5 corações, a conta sai 10% maior; com 1, o grupo reclama e paga 20% menos.' },
  { id:'comendo', alvo:g => [treinoMesaR(g)], tit:'Bom apetite',
    txt:'Eles estão comendo. Quando acabarem, pedem a conta (balão com "$").', feito:g => g.treino.grupo.state === 'wantBill' },
  { id:'cobrar', alvo:g => [treinoMesaR(g)], tit:'Hora de cobrar',
    txt:'Toque na mesa para a Bia cobrar a conta.', feito:g => g.treino.grupo.paid },
  { id:'conta', ok:true, alvo:g => [treinoMesaR(g)], tit:'Conta paga!',
    txt:g => { const c = g.treino.conta || { v:0, h:5, base:0 }; return 'Com ' + c.h + (c.h > 1 ? ' corações' : ' coração') + ', a conta de R$ ' + c.base + ' virou R$ ' + c.v + '. O dinheiro paga as contas da lanchonete; os pontos mostram como a Bia atendeu.'; } },
  { id:'louca', alvo:g => [treinoMesaR(g)], tit:'Recolha a louça',
    txt:'Ficou louça suja na mesa, e mesa suja não recebe ninguém. Toque na mesa para recolher.', feito:g => !g.treino.mesa.dirty },
  { id:'pia', alvo:treinoSt('sink'), tit:'Leve à pia',
    txt:'Toque na pia: a Bia deixa a louça lá.', feito:g => g.kitchen.sinkN > 0 || g.stats.washed > 0 },
  { id:'lavar', alvo:treinoSt('sink'), tit:'Lave os pratos',
    txt:'Agora, com as mãos vazias, toque na pia de novo para lavar. O prato lavado volta para a cozinha (do dia 3 em diante, os pratos limpos são contados).', feito:g => g.stats.washed > 0 },
  { id:'lixo', alvo:treinoSt('trash'), tit:'Tire o lixo',
    txt:'Lavar joga os restos na lixeira. Cheia, ela cheira mal e a freguesia perde a paciência mais rápido. Toque na lixeira, de mãos vazias, para tirar o lixo.', feito:g => g.stats.emptied > 0 },
  { id:'fim', ok:true, tit:'Esse é o ciclo da Bia!',
    txt:'Na carreira, vários grupos chegam juntos: toque em várias coisas seguidas e a Bia faz tudo em ordem. Repetir a mesma ação em sequência forma corrente, com pontos a mais. Depois de comer, alguns grupos pedem mais um salgado. Boa sorte!' }
];

class Treino {
  constructor(game){
    this.g = game; this.i = 0; this.t = 0; this.grupo = null; this.conta = null;
    // a mesa do treino: a de 2 lugares com cadeiras azuis (ou a primeira de 2), e o grupo com camisas da mesma cor
    const ts = game.tables;
    this.mesa = ts.find(t => t.seats === 2 && t.color === 1) || ts.find(t => t.seats === 2) || ts[0];
    this.mudou();
  }
  /* passo novo: avisa a interface (o texto vai para o leitor de tela) */
  mudou(){ if (this.g.hooks.treino) this.g.hooks.treino(this); }
  get passo(){ return TREINO_PASSOS[this.i]; }
  get total(){ return TREINO_PASSOS.length; }
  /* pop-up de explicação: o jogo espera um toque */
  get para(){ return !!(this.passo && this.passo.ok); }
  get segura(){ return !!(this.passo && this.passo.segura); }
  texto(p){ p = p || this.passo; return typeof p.txt === 'function' ? p.txt(this.g) : p.txt; }
  alvos(){
    const p = this.passo;
    if (!p || !p.alvo) return [];
    const r = p.alvo(this.g);
    return (Array.isArray(r) ? r : [r]).filter(Boolean).map(q => p.tela ? q : { x:q.x + this.g.cam, y:q.y, w:q.w, h:q.h });   // na tela
  }
  chegar(){
    const g = this.g, grp = g.spawn({ type:'vovos', color:this.mesa.color, vip:false });
    grp.hearts = 1; grp.patLeft = grp.patPer();
    this.grupo = grp;
  }
  seguir(){
    if (!this.passo) return;
    this.i++; this.t = 0;
    Sfx.tap();
    if (this.i >= this.total) this.g.acabouTreino(); else this.mudou();
  }
  update(dt){
    this.t += dt;
    if (!this.grupo && this.i >= 1 && this.t >= TREINO_CHEGA) this.chegar();
    const p = this.passo;
    if (p && p.feito && this.grupo && p.feito(this.g)){ this.i++; this.t = 0; Sfx.ok(); this.mudou(); }
  }
}

