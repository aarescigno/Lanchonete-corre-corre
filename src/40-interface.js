/* ============================================================
   INTERFACE (HTML + canvas) E INICIALIZAÇÃO
   ============================================================ */
const $ = id => document.getElementById(id);
const canvas = $('c');
const ctx = canvas.getContext('2d');
const stage = $('stage');
const game = new Game(canvas, ctx);
let selectedDay = Math.min(game.unlocked, 7);

const SCREENS = ['ov-menu','ov-how','ov-intro','ov-pause','ov-end','ov-shop','ov-final','ov-endless','ov-rank','ov-ver','ov-app'];
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

/* ---------- menu: seletor de dia ---------- */
function buildChips(){
  const box = $('daychips');
  clearEl(box);
  selectedDay = Math.min(selectedDay, game.unlocked);
  for (let i=1;i<=7;i++){
    const b = el('button','chip', String(i));
    b.type = 'button';
    b.setAttribute('aria-label', 'Dia ' + i);
    b.setAttribute('aria-pressed', i === selectedDay ? 'true' : 'false');
    if (i > game.unlocked) b.disabled = true;
    b.addEventListener('click', () => { selectedDay = i; Sfx.init(); Sfx.tap(); buildChips(); });
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
    ['A freguesia espera lá fora, na calçada. Arraste o grupo até uma mesa livre (ou toque no grupo e depois na mesa). Grupos grandes precisam das mesas de 4 lugares. Na lojinha, aba Salão, compre mesas e arraste-as para arrumar a garagem: mais lugares trazem mais clientes.', c => {
      drawPerson(c,{skin:3,hair:3,hairC:'#1B1512',pants:'#2F3E5C'},12,52,{shirt:CHAIRS[1].c,mood:0,s:0.8});
      c.strokeStyle = PAL.alerta; c.lineWidth = 3; c.setLineDash([4,4]); c.beginPath(); c.moveTo(22,40); c.lineTo(40,30); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.moveTo(42,28); c.lineTo(35,28); c.lineTo(40,35); c.closePath(); c.fillStyle = PAL.alerta; c.fill();
      c.save(); c.translate(51,44); c.scale(0.5,0.5); drawChair(c,0,0,1,false,true); c.restore();
      rr(c,38,32,26,13,2); fs(c,'#F7F4EB',2);
    }],
    ['Toque nas mesas, na cozinha, nos pratos prontos, no cafezinho, nos sucos e na pia: a Bia faz tudo em ordem, na fila de ações, e um número em cada lugar mostra a vez dela. Dá para pedir 2 coisas na mesma mesa; para cancelar, toque no quadrinho da fila.', c => {
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
    ['Com a Máquina de suco, quem espera lá fora pede no tablet (1 suco por pessoa) e o suco sai pronto em poucos segundos: toque na máquina e a Bia pega os copos que couberem e leva a cada grupo. Atender devolve 1 coração, quem bebe espera com mais calma e o suco (R$ ' + JUICE.price + ') entra na conta.', c => {
      rr(c,6,10,20,28,4); fs(c,'#F2F2EE',1.8); rr(c,9,13,14,10,2); fs(c,'rgba(242,140,40,.75)',1.2); drawIcon(c,'juice',16,32,0.4);
      c.save(); c.translate(44,26); c.rotate(-0.18); rr(c,-12,-9,24,17,3); fs(c,PAL.tinta,1.4); c.fillStyle = '#FFE0A6'; c.fillRect(-9,-6,18,11); c.restore(); drawIcon(c,'juice',44,26,0.32);   // tablet
      c.save(); c.translate(16,52); drawBubble(c,0,0,8,PAL.ok); drawIcon(c,'juice',-1,1,0.36); c.restore();
      c.strokeStyle = PAL.faixa; c.lineWidth = 2.5; c.beginPath(); c.moveTo(30,54); c.lineTo(56,54); c.moveTo(50,49); c.lineTo(56,54); c.lineTo(50,59); c.stroke();
    }],
    ['Combine a cor da camisa do grupo com a cor da cadeira para ganhar bônus. Repetir o mesmo tipo de ação em sequência forma uma corrente cada vez mais valiosa.', c => {
      drawChair(c,18,34,1,false,true);
      drawPerson(c,{skin:2,hair:5,hairC:'#2F1D12',pants:'#2F3E5C'},18,54,{shirt:CHAIRS[1].c,mood:0,s:0.7,sit:true});
      txt(c,'×3!',46,22,18,PAL.alerta,'center',FD,3);
      star(c,46,46,9,PAL.mostarda);
    }],
    ['Do dia 3 em diante, alguns grupos pedem suco (copinho com o número na mesa): entregue antes da conta, ou perdem um coração. A bandeja leva 2 pratos, 3 bebidas ou prato + bebida. Lixeira cheia cheira mal: toque nela de mãos vazias para esvaziar.', c => {
      ell(c,32,50,22,6); fs(c,PAL.inox,2);
      drawIcon(c,'juice',20,38,0.8); drawIcon(c,'juice',32,36,0.8); drawIcon(c,'juice',44,38,0.8);
      rr(c,8,4,48,18,6); fs(c,'#fff',1.8); drawIcon(c,'juice',20,13,0.5); txt(c,'×3',38,13,11,PAL.tinta,'center',FD);
    }],
    ['A partir do dia 5 aparece o cliente VIP (óculos escuros e plaquinha dourada): fura a fila e tem menos paciência, mas paga gorjeta extra e bônus com 5 corações. Bravo, a multa dobra.', c => {
      drawPerson(c,{skin:4,hair:3,hairC:'#1B1512',pants:'#2F3E5C',shades:true},28,60,{shirt:CHAIRS[2].c,mood:0,s:0.85});
      drawVipBadge(c,40,14,0);
    }],
    ['A meta do dia é o lucro: o que entra menos os ingredientes (' + Math.round(INGRED.prato * 100) + '% de cada prato), as contas (luz e gás crescem com o salão; a garagem não paga aluguel), a folha e a divulgação. O dia começa no vermelho! Do dia 3 em diante, escolha a divulgação na lojinha: mais gente só vale se couber.', c => {
      rr(c,8,12,30,40,3); fs(c,'#fff',2);
      for (let i=0;i<4;i++){ c.fillStyle = PAL.cromoEsc; c.fillRect(13,19+i*7,14,2.4); c.fillRect(30,19+i*7,4,2.4); }
      c.strokeStyle = PAL.perigo; c.lineWidth = 2.4; c.beginPath(); c.moveTo(13,47); c.lineTo(34,47); c.stroke();
      drawIcon(c,'coin',48,40,0.8);
    }]
  ];
  tips.forEach(t => {
    const li = document.createElement('li');
    li.appendChild(tipCanvas(t[1]));
    li.appendChild(el('span', null, t[0]));
    ul.appendChild(li);
  });
}

