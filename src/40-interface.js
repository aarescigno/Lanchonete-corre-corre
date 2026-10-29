/* ============================================================
   INTERFACE (HTML + canvas) E INICIALIZAÇÃO
   ============================================================ */
const $ = id => document.getElementById(id);
const canvas = $('c');
const ctx = canvas.getContext('2d');
const stage = $('stage');
const game = new Game(canvas, ctx);
/* quem nunca fez a Missão zero (e ainda está no dia 1) encontra o botão dela em destaque */
function treinoPrimeiro(){ return !game.save.treino && game.proxDia <= 1 && !DEV.on; }

const SCREENS = ['ov-menu','ov-how','ov-intro','ov-treino','ov-pause','ov-end','ov-shop','ov-falencia','ov-endless','ov-rank','ov-ver','ov-app','ov-abertura','ov-historia'];
function showOnly(ids){
  SCREENS.forEach(id => { const el = $(id); if (!el) return; if (ids.indexOf(id) >= 0) el.classList.add('show'); else el.classList.remove('show'); });
}
function clearEl(el){ while (el.firstChild) el.removeChild(el.firstChild); }
function el(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function starsHtml(box, n, total){
  clearEl(box);
  for (let i=0;i<total;i++){ box.appendChild(el('span', i < n ? 'on' : 'off', '★')); }
}

/* ---------- escala / DPR ---------- */
function fit(){
  const vw = window.innerWidth || 960, vh = window.innerHeight || 600;
  const s = Math.max(0.2, Math.min(vw / TW, vh / H));   // tela larga (v7.6)
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  // numa tela mais estreita que a do jogo (~2:1), o jogo encolhe; o palco ganha a altura que teria com a tela de antes
  // (960 de largura), para os painéis (menu, lojinha) não ficarem apertados, e o jogo fica no meio dele
  const sh = Math.max(H*s, Math.min(vh, H * Math.min(vw / W, vh / H)));
  stage.style.width = Math.floor(TW*s) + 'px';
  stage.style.height = Math.floor(sh) + 'px';
  stage.style.setProperty('--u', s + 'px');
  canvas.style.height = Math.floor(H*s) + 'px';
  canvas.style.marginTop = Math.floor((sh - H*s) / 2) + 'px';
  canvas.width = Math.round(TW*s*dpr);
  canvas.height = Math.round(H*s*dpr);
}

/* ---------- menu (v8.3): a carreira é uma campanha; "Continuar" abre o próximo dia ---------- */
let resetPede = false;   // "Recomeçar do zero": o 1º toque pede confirmação
function buildMenu(){
  const sv = game.save, n = game.proxDia, novo = n <= 1 && !sv.caixa.length;
  $('menu-dia').textContent = sv.fechou ? 'Carreira: fechou no dia ' + sv.fechou : novo ? 'Carreira' : 'Carreira: dia ' + n;
  const info = [];
  if (sv.fechou) info.push('O banco tomou a lanchonete por falta de pagamento.', sv.estrelas + ' ★', 'lucro acumulado ' + fmt(sv.lucroTot));   // v8.3.1
  else if (novo) info.push('A Bia vai abrir a lanchonete na garagem da mãe.' + (treinoPrimeiro() ? ' Primeira vez? Comece pela Missão zero, um treino passo a passo.' : ''));
  else {
    info.push((sv.bank < 0 ? 'Caixa no negativo: ' : 'Caixa: ') + fmt(sv.bank), sv.estrelas + ' ★', 'lucro acumulado ' + fmt(sv.lucroTot));
    if (sv.emp.resto) info.push('banco: faltam ' + fmt(sv.emp.resto));
  }
  $('menu-info').textContent = info.join(' · ');
  // v8.6.9: o aviso de uma vez só para quem tinha campanha antes do cardápio que cresce (save.avisoCard, apagado ao fechar)
  $('menu-aviso').style.display = sv.avisoCard ? '' : 'none';
  $('menu-aviso-txt').textContent = 'Novidade: o cardápio agora cresce com os cursos do Tonhão. Por isso, a campanha recomeçou do dia 1.';
  $('btn-play').textContent = sv.fechou ? 'Recomeçar do zero' : novo ? 'Começar o dia 1' : 'Continuar: dia ' + n;
  $('btn-play').className = 'btn ' + (treinoPrimeiro() ? 'alt' : 'go');
  $('btn-treino').className = 'btn ' + (treinoPrimeiro() ? 'go' : 'alt');
  resetPede = false; $('btn-reset').textContent = 'Recomeçar do zero';
  $('btn-reset').style.display = novo || sv.fechou ? 'none' : '';   // nada a apagar ainda (ou o botão principal já recomeça)
  buildChips();
}
/* modo dev: os dias à escolha (o save dev pula para o dia tocado) */
function buildChips(){
  const box = $('daychips');
  clearEl(box);
  box.style.display = DEV.on ? '' : 'none';
  if (!DEV.on) return;
  for (let i=1;i<=10;i++){
    const b = el('button', 'chip', String(i));
    b.type = 'button';
    b.setAttribute('aria-label', 'Dia ' + i);
    b.setAttribute('aria-pressed', i === game.proxDia ? 'true' : 'false');
    b.addEventListener('click', () => { game.save.dia = i; writeSave(game.save); Sfx.init(); Sfx.tap(); buildMenu(); });
    box.appendChild(b);
  }
}

/* ---------- modo dev: "Modo dev" no selo da versão e no alto da tela, e o link de sair ---------- */
function devSync(){
  const t = $('vtag'), b = $('devbadge'), o = $('btn-dev-off');
  if (t){ t.textContent = VERSAO + (DEV.on ? ' · dev' : ''); t.classList[DEV.on ? 'add' : 'remove']('dev'); }
  if (b) b.style.display = DEV.on ? '' : 'none';
  if (o) o.style.display = DEV.on ? '' : 'none';
}

/* ---------- Como jogar ---------- */
function tipCanvas(draw){
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 128;
  const c = cv.getContext('2d');
  c.scale(2,2);
  c.lineJoin = 'round'; c.lineCap = 'round';
  draw(c);
  return cv;
}
function buildTips(){
  const ul = $('tips');
  clearEl(ul);
  const tips = [
    ['A freguesia espera lá fora, na calçada. Arraste o grupo até uma mesa livre (ou toque no grupo e depois na mesa). Grupos grandes precisam das mesas de 4 lugares. Na lojinha, aba Salão, compre mesas e arraste-as para arrumar a garagem: mais lugares trazem mais clientes. Na aba Decoração, plantas, o cantinho da Rosa e toalhas deixam a garagem mais bonita e melhoram o ambiente no Gurugol.', c => {
      drawPerson(c,{skin:3,hair:3,hairC:'#1B1512',pants:'#2F3E5C'},12,52,{shirt:CHAIRS[1].c,mood:0,s:0.8});
      c.strokeStyle = PAL.alerta; c.lineWidth = 3; c.setLineDash([4,4]); c.beginPath(); c.moveTo(22,40); c.lineTo(40,30); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.moveTo(42,28); c.lineTo(35,28); c.lineTo(40,35); c.closePath(); c.fillStyle = PAL.alerta; c.fill();
      c.save(); c.translate(51,44); c.scale(0.5,0.5); drawChair(c,0,0,1,false,true); c.restore();
      rr(c,38,32,26,13,2); fs(c,'#F7F4EB',2);
    }],
    ['Toque nas mesas, na cozinha, nos pratos prontos, no cafezinho, nos sucos e na pia: a Bia faz tudo em ordem, na fila de ações (5 tarefas marcadas; o Livrinho de Sudoku, na lojinha, acrescenta 3), e um número em cada lugar mostra a vez dela. Dá para pedir 2 coisas na mesma mesa; para cancelar, toque no quadrinho da fila.', c => {
      [['hat',14,16],['dish',32,16],['coffee',50,16],['dirty',14,46],['ticket',32,46],['coin',50,46]].forEach(a => { rr(c,a[1]-10,a[2]-10,20,22,5); fs(c,PAL.creme,1.8); drawIcon(c,a[0],a[1],a[2]+1,0.6,'pastel'); });
    }],
    ['Ciclo da mesa: anote, leve à cozinha, busque o prato, entregue, cobre e recolha a louça. Na pia, um toque deixa a louça e outro, sem louça na mão, lava (2,5 s por pilha). Do dia 3 em diante, sem prato limpo o Tonhão espera; sozinha a Bia não dá conta: contrate ajuda.', c => {
      drawIcon(c,'ticket',12,16,0.7); drawIcon(c,'hat',30,16,0.7); drawIcon(c,'dish',48,16,0.7,'coxinha');
      drawIcon(c,'coin',16,46,0.7); drawIcon(c,'dirty',34,46,0.7); drawIcon(c,'drop',52,46,0.7);
    }],
    ['Cada grupo tem 5 corações de paciência. Atender (sentar, anotar, entregar, cafezinho) devolve um coração. Mais corações, mais gorjeta na conta! Na espera, quem não tem mesa onde caiba (balãozinho com mesa e relógio) espera com mais calma e, na carreira, não passa de 1 coração.', c => {
      for (let i=0;i<5;i++) heart(c,10+i*11,20,5,i<3?'#E5384A':'rgba(255,255,255,.55)', i<3?PAL.tinta:'rgba(34,32,28,.45)');
      drawPerson(c,{skin:1,hair:1,hairC:'#5B3A21',pants:'#4A4036'},20,58,{shirt:CHAIRS[3].c,mood:0,s:0.6});
      drawPerson(c,{skin:4,hair:0,hairC:'#1B1512',pants:'#4A4036'},44,58,{shirt:CHAIRS[0].c,mood:2,s:0.6});
    }],
    ['Com a Água da torneira, quem espera lá fora (de pé, na Garagem) pede água (1 copo por pessoa): toque na torneira e a Bia enche os copos que couberem e leva a cada grupo. Atender devolve 1 coração e quem bebe espera com mais calma. A água é de graça: não entra na conta.', c => {
      drawTorneira(c,22,24,0.9); drawIcon(c,'agua',22,36,0.45);
      drawPerson(c,{skin:3,hair:2,hairC:'#2F1D12',pants:'#4A4036'},46,40,{shirt:CHAIRS[1].c,mood:0,s:0.5});
      c.save(); c.translate(16,52); drawBubble(c,0,0,8,PAL.ok); drawIcon(c,'agua',-1,1,0.36); c.restore();
      c.strokeStyle = PAL.faixa; c.lineWidth = 2.5; c.beginPath(); c.moveTo(30,54); c.lineTo(56,54); c.moveTo(50,49); c.lineTo(56,54); c.lineTo(50,59); c.stroke();
    }],
    ['As ações da Bia rendem pontos de atendimento (o dinheiro vem só do que o cliente paga). Combine a cor da camisa do grupo com a cor da cadeira para ganhar pontos a mais. Repetir o mesmo tipo de ação em sequência forma uma corrente, com cada vez mais pontos.', c => {
      drawChair(c,18,34,1,false,true);
      drawPerson(c,{skin:2,hair:5,hairC:'#2F1D12',pants:'#2F3E5C'},18,54,{shirt:CHAIRS[1].c,mood:0,s:0.7,sit:true});
      txt(c,'×3!',46,22,18,PAL.alerta,'center',FD,3);
      star(c,46,46,9,PAL.mostarda);
    }],
    ['Do dia 3 em diante, alguns grupos pedem suco (copinho com o número na mesa): só pedem a conta depois do suco, e esperam perdendo a paciência. Suco e cafezinho entram na conta. A bandeja leva 2 pratos, 3 bebidas ou prato + bebida. Lixeira cheia cheira mal: toque nela de mãos vazias para esvaziar.', c => {
      ell(c,32,50,22,6); fs(c,PAL.inox,2);
      drawIcon(c,'juice',20,38,0.8); drawIcon(c,'juice',32,36,0.8); drawIcon(c,'juice',44,38,0.8);
      rr(c,8,4,48,18,6); fs(c,'#fff',1.8); drawIcon(c,'juice',20,13,0.5); txt(c,'×3',38,13,11,PAL.tinta,'center',FD);
    }],
    ['A partir do dia 5 aparece o cliente VIP (óculos escuros e plaquinha dourada): fura a fila e tem menos paciência, mas pede o prato especial (mais caro), dá gorjeta e, com 5 corações, pontos a mais. Bravo, a multa dobra.', c => {
      drawPerson(c,{skin:4,hair:3,hairC:'#1B1512',pants:'#2F3E5C',shades:true},28,60,{shirt:CHAIRS[2].c,mood:0,s:0.85});
      drawVipBadge(c,40,14,0);
    }],
    ['A meta do dia é o lucro: o que a freguesia paga (cada um paga o que pediu: de início, ' + listaE(['pf', 'coxinha'].map(k => CARDAPIO[k].nome + ' R$ ' + precoPrato(k))) + '; os cursos do Tonhão acrescentam pratos; alguns pedem um 2º item) menos os ingredientes (' + Math.round(INGRED.prato * 100) + '% de cada prato), as contas (luz e gás crescem com o salão; a garagem não paga aluguel), a folha e a divulgação. O dia começa no vermelho! Do dia 3 em diante, escolha a divulgação na lojinha: mais gente só vale se couber.', c => {
      rr(c,8,12,30,40,3); fs(c,'#fff',2);
      for (let i=0;i<4;i++){ c.fillStyle = PAL.cromoEsc; c.fillRect(13,19+i*7,14,2.4); c.fillRect(30,19+i*7,4,2.4); }
      c.strokeStyle = PAL.perigo; c.lineWidth = 2.4; c.beginPath(); c.moveTo(13,47); c.lineTo(34,47); c.stroke();
      drawIcon(c,'coin',48,40,0.8);
    }],
    ['O fogão, a geladeira e a cafeteira se gastam um pouco a cada dia. Do dia 4 em diante, o que está gasto pode quebrar no meio do dia: toque na plaquinha com a chave para chamar o técnico na hora (mais caro) ou aguente até a lojinha, onde a revisão (aba Manutenção) deixa tudo novo. Às vezes chove (menos gente) ou é feriado (mais gente).', c => {
      circ(c,32,32,20); fs(c,PAL.mostarda,2.4);
      c.save(); c.translate(32,32); c.rotate(-0.7);
      rr(c,-3,-4,6,22,2); fs(c,PAL.cromo,1.8);
      c.beginPath(); c.arc(0,-10,8,0.6,Math.PI*2-0.6+Math.PI,false); c.closePath(); fs(c,PAL.cromo,1.8);
      rr(c,-3,-19,6,8,1); c.fillStyle = PAL.mostarda; c.fill();
      c.restore();
    }]
  ];
  // v8.6: o entregador e as marmitas
  tips.push(['Do dia 4 em diante vem o entregador de moto: ele não senta, espera no balcão de retirada (no alto da calçada), e o pedido dele, pela Efood, vai sozinho ao Tonhão, que faz o prato numa marmita (sem usar prato limpo). Toque na marmita pronta e depois no balcão: ele paga na hora, com a gorjeta dos corações (a Efood fica com ' + Math.round(MARMITA.efood * 100) + '%). Tem pressa! No "+ marmita" da janela de pedidos, o Tonhão adianta até ' + MARMITA.vagas + ' marmitas de PF, que esperam na prateleira do balcão e esfriam em ' + MARMITA.validade + ' s. Embalagem: R$ ' + MARMITA.embalagem + '; marmita que ninguém leva fica no prejuízo. A Dani pode levar as marmitas.', c => {
    drawMarmita(c,'pf',22,22,1.2);
    rr(c,30,38,30,18,3); fs(c,PAL.madeira,1.8); rr(c,34,42,16,8,2); fs(c,EFOOD_COR,1.2);
    drawPerson(c,{skin:2,hair:0,hairC:'#1B1512',pants:'#2F3E5C',acc:'helmet'},16,60,{shirt:CHAIRS[0].c,mood:0,s:0.55});
  }]);
  // v8.3: a campanha e o banco
  tips.push(['A carreira segue dia após dia, levando tudo o que veio antes: dinheiro, móveis, equipe, melhorias e o desgaste. Meta não batida deixa o dia sem estrelas, mas o dia seguinte vem. Faltou dinheiro? O caixa pode ficar negativo ' + BANCO.neg + ' dias seguidos (no ' + (BANCO.neg + 1) + 'º, o banco cobre à força) e a aba Banco da lojinha empresta, com juros de ' + Math.round(BANCO.juros * 100) + '% ao dia sobre o que falta (amortizar antes corta os juros). Não atrase: parcela sem pagar 2 dias seguidos, e o banco toma a lanchonete!', c => {
    c.translate(32,34); c.scale(1.4,1.4);
    drawBanco(c);
  }]);
  // v8.4: as avaliações do Gurugol
  tips.push(['Cada grupo que sai avalia a lanchonete no Gurugol, de 1 a 5, em 5 critérios: espera por mesa e agilidade (cada coração perdido tira 1 ponto; cor certa, corrente e prato caprichado ajudam), qualidade da comida (o Tonhão com aumento acerta mais), diversidade do cardápio (cada curso do Tonhão soma) e ambiente (TV, som, torneira, ventilador, cafezinho, as plantas, o cantinho da Rosa e a toalha xadrez; lixeira cheia atrapalha). A nota é a média das últimas ' + AVAL.max + ' avaliações e aparece a partir da ' + AVAL.min + 'ª; a aba Gurugol da lojinha mostra os últimos comentários. Na Garagem, lugar simples, o atendimento perfeito vale ' + fmtNota(AVAL.teto[0]) + ' ★ (um cliente encantado dá um pouco mais); cada ponto melhor sobe a nota, até 5 ★ no Terraço Suíça. Nota alta traz até ' + Math.round(AVAL.mov * 100) + '% mais gente; nota baixa afasta.', c => {
    for (let i=0;i<5;i++) star(c,8 + i*12,22,5.5,i < 3 ? PAL.mostarda : '#d8cfb8');
    txt(c,'3,0',32,48,18,PAL.tinta,'center',FD);
  }]);
  // v8.6.9: os cursos do Tonhão e os gostos da freguesia
  tips.push(['A cozinha começa sabendo PF e coxinha. Na aba Cursos, o Tonhão aprende pratos novos (um curso por dia); o curso avançado deixa os pratos mais caros e caprichados. Cada tipo de cliente tem o seu gosto, e o entregador muda de ideia ao longo do dia.', c => {
    drawDish(c,'pf',18,30,0.9); drawDish(c,'coxinha',46,30,0.9); txt(c,'+',32,34,14,PAL.faixa,'center',FD);
  }]);
  tips.forEach(t => {
    const li = document.createElement('li');
    li.appendChild(tipCanvas(t[1]));
    li.appendChild(el('span', null, t[0]));
    ul.appendChild(li);
  });
}

