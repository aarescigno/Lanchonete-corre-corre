/* ============================================================
   MISSÃO ZERO (v8.2): o dia de treino, com pop-ups passo a passo
   Uma mesa só: um casal de vovós chega com 1 coração, e a Bia faz o ciclo inteiro (sentar na cor
   certa, esperar o cardápio, anotar, levar ao Tonhão, buscar o prato, servir, cafezinho, cobrar,
   recolher a louça, pia, lavar e tirar o lixo). A paciência não acaba e nada vai para a carreira.
   Cada passo tem o texto do pop-up e o alvo (retângulos do mundo, ou da tela com `tela`). Passo com
   `ok` explica e o jogo espera um toque; passo com `feito` segue sozinho quando a condição vale.
   `segura` para o relógio da mesa (cardápio e refeição), para dar tempo de fazer o passo
   `espera` (v9.6.12): passo em que é só aguardar (o cartão diz "Aguarde..." no lugar de "Sua vez!")
   v9.6.12: textos em frases curtas, sem números (a regra da 3f); as explicações da cor e do cafezinho entraram nos passos
   de fazer ("sentar" e "comendo"), e as paradas com "Continuar" caíram de 7 para 5
   ============================================================ */
const TREINO_COR = ['vermelhas', 'azuis', 'amarelas', 'verdes'];
const TREINO_CHEGA = 0.6;   // segundos até o grupo aparecer na rua

function treinoMesaR(g){ const t = g.treino.mesa; return tableRect(t); }
function treinoGrupoR(g){ const grp = g.treino.grupo; return grp && grp.state === 'queue' ? queueRect(grp) : treinoMesaR(g); }
function treinoSt(k){ return () => STATIONS[k].rect; }
function treinoPrato(g){ return g.kitchen.plates.find(p => p && p.group === g.treino.grupo); }
function treinoNaMao(g, kind){ return g.bia.hands.some(h => h.kind === kind && (!h.group || h.group === g.treino.grupo)); }

const TREINO_PASSOS = [
  { id:'oi', ok:true, tit:'Missão zero: o treino',
    txt:'Uma mesa só, para aprender o trabalho da Bia. Sem pressa: aqui ninguém perde a paciência.' },
  { id:'chega', espera:true, alvo:g => [{ x:QUEUE.x - 90, y:QUEUE.ys[0] - 84, w:180, h:104 }], tit:'Chegou freguesia!',
    txt:'Quem chega espera na calçada.', feito:g => { const grp = g.treino.grupo; return !!grp && grp.state === 'queue' && !grp.path.length; } },
  { id:'coracoes', ok:true, alvo:g => { const grp = g.treino.grupo; return [{ x:grp.x - 40, y:grp.y - 80, w:80, h:30 }]; }, tit:'Corações são a paciência',
    txt:'Este casal chegou cansado, com um coração só. Esperar gasta corações; atender devolve.' },
  { id:'sentar', alvo:g => [treinoGrupoR(g), treinoMesaR(g)], tit:'Leve o casal à mesa',
    txt:g => 'Arraste o casal até a mesa de cadeiras ' + TREINO_COR[g.treino.mesa.color] + ' (ou toque nele e depois na mesa). Camisa e cadeira da mesma cor: a freguesia gosta.', feito:g => !!g.treino.grupo.table },
  { id:'cardapio', espera:true, alvo:g => [treinoMesaR(g)], tit:'Sentaram!',
    txt:'Agora eles escolhem o prato. Espere chamarem.',
    feito:g => g.treino.grupo.state === 'wantOrder' },
  { id:'anotar', alvo:g => [treinoMesaR(g)], tit:'Chamaram!',
    txt:'O balão com "!" chama a Bia. Toque na mesa para anotar o pedido.', feito:g => g.treino.grupo.state !== 'wantOrder' && g.treino.grupo.state !== 'reading' },
  { id:'fila', ok:true, tela:true, alvo:g => [{ x:HUDX.dir + 696, y:546, w:96, h:52 }, { x:HUDX.fila + 354, y:546, w:52 * filaMax(g.up) + 4, h:52 }], tit:'A fila da Bia',
    txt:'Cada toque vira uma tarefa na FILA, e a Bia faz uma por vez. O que ela carrega aparece em MÃOS. Tocar num quadrinho cancela a tarefa.' },
  { id:'cozinha', alvo:treinoSt('order'), tit:'Leve o pedido ao Tonhão',
    txt:'Toque na cozinha para entregar a comanda.', feito:g => g.kitchen.progressFor(g.treino.grupo) >= 0 || !!treinoPrato(g) },
  { id:'preparo', espera:true, alvo:treinoSt('order'), tit:'O Tonhão está cozinhando',
    txt:'É só esperar. Num dia de verdade, dá tempo de atender outras mesas.', feito:g => !!treinoPrato(g) || treinoNaMao(g, 'dish') },
  { id:'prato', alvo:treinoSt('plates'), tit:'Prato pronto!',
    txt:'Toque no prato para a Bia pegar.', feito:g => treinoNaMao(g, 'dish') || g.treino.grupo.state === 'eating' },
  { id:'servir', alvo:g => [treinoMesaR(g)], tit:'Sirva a comida',
    txt:'Toque na mesa. Servir devolve um coração.', feito:g => g.treino.grupo.state === 'eating' },
  { id:'cafe', segura:true, alvo:treinoSt('coffee'), tit:'Hora do cafezinho',
    txt:'Enquanto eles comem, toque na cafeteira.', feito:g => treinoNaMao(g, 'coffee') || g.treino.grupo.coffee },
  { id:'cafe2', segura:true, alvo:g => [treinoMesaR(g)], tit:'Sirva o cafezinho',
    txt:'Agora toque na mesa.', feito:g => g.treino.grupo.coffee },
  { id:'comendo', espera:true, alvo:g => [treinoMesaR(g)], tit:'Bom apetite',
    txt:'O cafezinho entra na conta e agrada. Quando acabarem, eles pedem a conta: o balão com "$".', feito:g => g.treino.grupo.state === 'wantBill' },
  { id:'cobrar', alvo:g => [treinoMesaR(g)], tit:'Hora de cobrar',
    txt:'Toque na mesa para cobrar a conta.', feito:g => g.treino.grupo.paid },
  { id:'conta', ok:true, alvo:g => [treinoMesaR(g)], tit:'Conta paga!',
    txt:g => { const c = g.treino.conta || { v:0 }; return 'Entraram R$ ' + c.v + '. Freguês contente paga mais: os corações viram gorjeta.'; } },
  { id:'louca', alvo:g => [treinoMesaR(g)], tit:'Recolha a louça',
    txt:'Mesa suja não recebe ninguém. Toque na mesa para recolher.', feito:g => !g.treino.mesa.dirty },
  { id:'pia', alvo:treinoSt('sink'), tit:'Leve à pia',
    txt:'Toque na pia para deixar a louça.', feito:g => g.kitchen.sinkN > 0 || g.stats.washed > 0 },
  { id:'lavar', alvo:treinoSt('sink'), tit:'Lave os pratos',
    txt:'De mãos vazias, toque na pia de novo. Prato limpo volta para a cozinha.', feito:g => g.stats.washed > 0 },
  { id:'lixo', alvo:treinoSt('trash'), tit:'Tire o lixo',
    txt:'Lixeira cheia cheira mal e espanta a freguesia. De mãos vazias, toque nela.', feito:g => g.stats.emptied > 0 },
  { id:'fim', ok:true, tit:'Esse é o corre-corre!',
    txt:'No dia de verdade, chegam vários grupos. Toque em várias coisas seguidas e a Bia faz tudo em ordem. Boa sorte!' }
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

/* ============================================================
   DICAS NA HORA (v9.6.12): nos primeiros dias da carreira, quem fica parado com serviço à espera vê o próximo passo:
   o anel e a seta da Missão zero, com duas ou três palavras (o desenho fica em 24-treino.js).
   `dicaDe` só olha o jogo e não muda nada nele: o bot, as metas e o balanceamento não percebem.
   A dica aparece depois de DICAS.espera s sem toque, com o mesmo pedido de pé há DICAS.firme s, e some no 1º toque.
   Sentar um grupo não depende da Bia; as outras só valem com a fila de ações vazia. alvos: retângulos do mundo
   ============================================================ */
const DICAS = { dias:3, espera:4, firme:1.5, surge:0.25 };
function dicaLigada(g){ return g.mode === 'carreira' && g.state === 'playing' && !g.ending && !g.fechado && g.day.n <= DICAS.dias && !devLivre(); }
function dicaDe(g){
  if (!dicaLigada(g) || g.drag) return null;
  const b = g.bia, livre = !b.acts.length, mao = k => b.hands.find(h => h.kind === k);
  const mesaDe = grp => grp && grp.table && grp.seated ? grp.table : null;
  const st = (k, txt) => ({ k, txt, alvos:[STATIONS[k === 'cozinha' ? 'order' : k].rect] });
  if (livre){
    if (mao('ticket')) return st('cozinha', 'Leve ao Tonhão');
    const d = mao('dish'), td = d && mesaDe(d.group);
    if (td) return { k:'servir:' + td.id, txt:'Sirva a mesa', alvos:[tableRect(td)] };
    if (mao('dirty')) return { k:'pia', txt:'Deixe na pia', alvos:[STATIONS.sink.rect] };
    if (mao('juice')){ const t = g.tables.find(t => t.group && t.group.juiceOpen && t.group.juicePending > 0); if (t) return { k:'suco:' + t.id, txt:'Sirva o suco', alvos:[tableRect(t)] }; }
  }
  // sentar: o grupo que chegou primeiro e cabe numa mesa livre (de preferência, da cor dele)
  const grp = g.queue.find(q => q.state === 'queue' && !q.path.length && g.tables.some(t => t.free && t.seats >= q.size));
  if (grp){
    const t = g.tables.filter(t => t.free && t.seats >= grp.size).sort((a, c) => (c.color === grp.color) - (a.color === grp.color) || a.seats - c.seats)[0];
    return { k:'sentar:' + grp.id, txt:'Arraste até a mesa', alvos:[queueRect(grp), tableRect(t)], arrasta:true };
  }
  if (!livre) return null;
  const pl = g.kitchen.plates.find(p => p && mesaDe(p.group) && !p.group.cami);
  if (pl && b.canTake('dish')){ const s = PLATE_SLOTS[pl.slot]; return { k:'prato:' + pl.id, txt:'Pegue o prato', alvos:[{ x:s.x - 22, y:s.y - 24, w:44, h:44 }] }; }
  const quer = (estado, k, txt) => { const t = g.tables.find(t => t.group && t.group.state === estado && !t.cami); return t ? { k:k + ':' + t.id, txt, alvos:[tableRect(t)] } : null; };
  const pede = b.canTake('ticket') && quer('wantOrder', 'anotar', 'Anote o pedido');
  if (pede) return pede;
  const conta = quer('wantBill', 'cobrar', 'Cobre a conta');
  if (conta) return conta;
  const suja = b.canTake('dirty') && g.tables.find(t => t.open && t.dirty && !t.group);
  if (suja) return { k:'louca:' + suja.id, txt:'Recolha a louça', alvos:[tableRect(suja)] };
  if (!b.hands.length){
    if (g.kitchen.noPlate && g.kitchen.sinkN > 0) return { k:'lavar', txt:'Lave a louça', alvos:[STATIONS.sink.rect] };
    if (g.trashFull) return { k:'lixo', txt:'Tire o lixo', alvos:[STATIONS.trash.rect] };
  }
  if (b.canTake('juice') && g.tables.some(t => t.group && t.group.juiceOpen && t.group.juicePending > 0)) return { k:'fazsuco', txt:'Faça um suco', alvos:[STATIONS.juice.rect] };
  return null;
}
/* chamada pelo Game.update: conta o tempo sem toque e o tempo do pedido de pé, e guarda a dica à mostra em g.dica */
function dicaAnda(g, dt){
  g.semToque += dt;
  const c = dicaDe(g), k = c ? c.k : null;
  if (k === g.dicaCand) g.dicaT += dt; else { g.dicaCand = k; g.dicaT = 0; }
  const mostra = c && g.semToque >= DICAS.espera && g.dicaT >= DICAS.firme ? c : null;
  if (mostra && !(g.dica && g.dica.k === mostra.k)) g.dicaDesde = g.anim;
  g.dica = mostra;
}
/* qualquer toque no jogo apaga a dica e zera a espera */
function dicaToque(g){ g.semToque = 0; g.dica = null; }
