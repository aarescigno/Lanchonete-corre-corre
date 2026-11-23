/* ---------- v10.10: o boletim do Michelzão ---------- */
let guiaFim = null;
/* abre o boletim com o último veredito (save.guia): três estrelas (cheias as da melhor marca) e seis barras, sem número; `depois` roda ao tocar em Continuar */
function abreBoletim(depois){
  const g = game.save.guia; if (!g){ depois(); return; }
  const est = $('guia-est'), bar = $('guia-barras'), rec = $('guia-rec'); clearEl(est); clearEl(bar);
  est.setAttribute('aria-label', g.est + (g.est === 1 ? ' estrela' : ' estrelas') + ' no Michelzão');
  for (let i = 0; i < 3; i++){ const cv = document.createElement('canvas'); cv.width = 108; cv.height = 108; const c = cv.getContext('2d'); star(c, 54, 56, 44, i < g.est ? PAL.mostarda : 'rgba(34,32,28,.12)'); est.appendChild(cv); }
  rec.textContent = g.est === 0 && g.rec ? 'Recomendado pelo Michelzão' : '';
  (g.bol || [0, 0, 0, 0, 0, 0]).forEach((f, i) => {
    const lin = el('div', 'guia-lin'), b = el('div', 'guia-bar'), fi = el('i');
    lin.setAttribute('aria-label', NOITE.linhas[i] + ': ' + (f >= 1 ? 'cheia' : f > 0 ? 'parte' : 'vazia'));
    fi.style.width = Math.round(f * 100) + '%'; b.appendChild(fi);
    lin.appendChild(el('span', null, NOITE.linhas[i])); lin.appendChild(b); bar.appendChild(lin);
  });
  game.manualVer('b-michelzao');
  guiaFim = depois; showOnly(['ov-guia']);
}
/* ---------- fim do dia ---------- */
/* faixa da nota do Gúgou (v8.4.1), pela nota com uma casa: abaixo de 3 pura, de 3 a 3,9 bronze (v8.6.7: o teto da Garagem),
   de 4 a 4,4 prata, de 4,5 a 4,8 ouro e acima disso diamante */
function notaFaixa(n){ n = Math.round(n * 10) / 10; return n > 4.8 ? 'diamante' : n >= 4.5 ? 'ouro' : n >= 4 ? 'prata' : n >= 3 ? 'bronze' : 'pura'; }
const GURU_BRILHOS = { pura:0, bronze:0, prata:0, ouro:3, diamante:7 };
let guruAnim = 0;   // a animação em curso (abrir de novo o fim do dia cancela a anterior)
/* caixa do Gúgou no fim do dia (v8.4.1): uma barra por critério, que enche até a nota dele, e embaixo a nota contando
   de 0 até o valor, com a cor da faixa; ouro e diamante soltam brilhinhos. Com prefers-reduced-motion, já aparece pronta.
   Depois da v8.8: a barra vai pelo teto do ponto (a.teto): o atendimento perfeito a enche (na Garagem, 3 ★), e o encantado não passa dela */
function gurugolCaixa(a, sub, semCnt){
  const m = a.geral || a.dia, box = el('div', 'guru'), teto = a.teto || 5;
  const larg = i => clamp(avalFrac(m.crit[i] || 1, teto), 0, 1) * 100;
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', 'Gúgou: ' + (a.geral ? fmtNota(m.nota) + ' estrelas' : 'sem nota ainda, ' + a.n + ' de ' + AVAL.min + ' avaliações' + (sub ? '' : '; hoje ' + fmtNota(m.nota))) + '. ' + AVAL_CRIT.map((c, i) => c.nome + ' ' + fmtNota(m.crit[i]) + (m.cnt ? ' em ' + m.cnt[i] : '')).join(', ') + '.');
  box.appendChild(el('b', 'guru-tit', 'Gúgou'));
  const fills = AVAL_CRIT.map((c, i) => {
    const row = el('div', 'guru-crit');
    row.appendChild(el('span', null, c.nome + (m.cnt && !semCnt ? ' (' + m.cnt[i] + ')' : '')));   // v8.6.7: quantas avaliações viram o critério
    const bar = el('div', 'guru-bar'), f = el('i');
    f.style.width = RM ? larg(i) + '%' : '0%';
    bar.appendChild(f); row.appendChild(bar); box.appendChild(row);
    return f;
  });
  const wrap = el('div', 'guru-nota'), num = el('span', 'guru-num', RM ? fmtNota(m.nota) : '0,0');
  num.className = 'guru-num ' + (RM ? notaFaixa(m.nota) : 'pura');
  wrap.appendChild(num); wrap.appendChild(el('span', 'guru-est', '★')); box.appendChild(wrap);
  box.appendChild(el('small', null, sub || (a.geral ? 'hoje ' + fmtNota(a.dia.nota) + ' em ' + a.dia.n + (a.dia.n > 1 ? ' avaliações' : ' avaliação') : 'sem nota: ' + a.n + ' de ' + AVAL.min + ' (hoje)')));
  const brilhos = () => {
    for (let k = 0; k < GURU_BRILHOS[notaFaixa(m.nota)]; k++){
      const s = el('span', 'guru-brilho', '✦');
      s.style.left = (8 + Math.random() * 84) + '%'; s.style.top = (Math.random() * 80) + '%';
      s.style.animationDelay = (Math.random() * 1.6).toFixed(2) + 's';
      wrap.appendChild(s);
    }
  };
  if (RM){ brilhos(); return box; }
  // as barras enchem uma depois da outra; depois a nota conta até o valor, mudando de faixa no caminho
  const id = ++guruAnim, raf = window.requestAnimationFrame ? f => window.requestAnimationFrame(f) : f => setTimeout(f, 16);
  let t0 = 0, feito = false;
  const passo = t => {
    if (id !== guruAnim) return;
    if (!t0) t0 = t;
    const s = (t - t0) / 1000;
    fills.forEach((f, i) => { const p = clamp((s - 0.15 * i) / 0.7, 0, 1); f.style.width = (larg(i) * (1 - Math.pow(1 - p, 3))) + '%'; });
    const p = clamp((s - 0.5) / 1.3, 0, 1), v = m.nota * (1 - Math.pow(1 - p, 3));
    num.textContent = fmtNota(v); num.className = 'guru-num ' + notaFaixa(v);
    if (p >= 1 && !feito){ feito = true; num.className += ' pronto'; brilhos(); }
    if (!feito || s < 2) raf(passo);
  };
  raf(passo);
  return box;
}
function buildEnd(){
  const r = game.result;
  $('btn-end-rank').style.display = DEV.on ? '' : 'none';   // v12.10.4: o Ranking só com o modo dev ligado
  if (!r) return;
  $('end-title').textContent = r.passed ? ('Dia ' + r.day + ' concluído!') : 'Dia ' + r.day + ': faltou pouquinho...';
  starsHtml($('end-stars'), r.stars, 3);
  $('end-money').textContent = (r.money < 0 ? 'Prejuízo de ' + fmt(-r.money) : 'Lucro de ' + fmt(r.money)) + ' (meta ' + fmt(r.meta) + ' · 2 estrelas ' + fmt(r.bom) + ' · 3 estrelas ' + fmt(r.expert) + ' sem perder ninguém)';
  const st = $('end-stats');
  clearEl(st);
  const rows = [['Atendidos', r.served],['Perdidos', r.lost],['Não couberam', r.full],['Maior corrente', '×' + r.chain],['Pontos de atendimento', r.pontos || 0]];
  if (game.ponto.tempos) rows.splice(1, 0, ['Refeições completas', r.completas || 0]);   // v10: só no Terraço Suíça
  // v9.6.12: o trabalho da equipe e o que ela vendeu (antes, frases soltas no rodapé), no fim da tabela
  { const sv = game.save, tar = n => (n || 0) + ((n || 0) === 1 ? ' tarefa' : ' tarefas');
    if (sv.equipe.dani > 0) rows.push(['Dani', tar(r.daniFeitas) + ' · experiência ' + daniXp(sv)]);   // v8.9
    if (sv.equipe.joca > 0) rows.push(['Joca', tar(r.jocaFeitas) + ' · experiência ' + jocaXp(sv)]);   // v9.2
    if (sv.equipe.cami > 0) rows.push(['Cami', tar(r.camiFeitas)]);   // v9.3
    if (sv.equipe.anselmo > 0 || r.drinks) rows.push(['Drinks do Anselmo', r.drinks || 0]);   // v9.5
    if (r.cafesEsp) rows.push(['Espressos e cappuccinos', r.cafesEsp]);
    if (r.doces || r.docesMarm) rows.push(['Doces', (r.doces || 0) + ' na mesa' + (r.docesMarm ? ' e ' + r.docesMarm + ' na marmita' : '')]); }
  if (r.trash) rows.splice(2, 0, ['Na lixeira', r.trash + ' bebida' + (r.trash > 1 ? 's' : '')]);
  if (r.juice || r.juiceMiss) rows.splice(2, 0, ['Sucos', r.juice + ' entregue' + (r.juice === 1 ? '' : 's') + (r.juiceMiss ? ' · ' + r.juiceMiss + ' mesa' + (r.juiceMiss > 1 ? 's' : '') + ' sem suco' : '')]);
  if (r.sucoEsp){ const b = BEBIDA_ESPERA[r.bebida] || BEBIDA_ESPERA.suco; rows.splice(2, 0, [b.fim, b.preco ? r.sucoEsp + ' na conta (' + fmt(r.sucoEsp * b.preco) + ')' : r.sucoEsp + (r.sucoEsp > 1 ? ' copos' : ' copo') + ', de graça']); }
  // imprevistos (v8): o que quebrou (e se foi consertado na hora) e o clima do dia
  if (r.quebras && r.quebras.length) rows.push(['Quebrou', r.quebras.map(q => manutOf(q.id).name.toLowerCase() + (q.fixed ? ' (consertado)' : '')).join(', ')]);
  if (r.clima) rows.push(['Imprevisto', CLIMA[r.clima].nome]);
  else if (r.evento) rows.push(['Imprevisto', EVENTOS[r.evento].nome]);   // v10.6: o evento de bairro do dia
  if (r.vig){   // v9.4: a visita da vigilância sanitária
    const fl = [r.vig.falhas.suja ? 'mesa suja' : '', r.vig.falhas.lixo ? 'lixeira cheia' : '', r.vig.falhas.pia ? 'pia lotada' : ''].filter(x => x);
    rows.push(['Vigilância', r.vig.res === 'aprovado' ? 'Aprovado! Selo por ' + FISCAL.selo + ' dias (+' + FISCAL.seloPts + ' pontos)' : (r.vig.res === 'advertencia' ? 'Advertência' : 'Multa') + ': ' + fl.join(' e ')]);
  }
  // marmitas (v8.6): as entregues (e a parte da Efood), as que esfriaram e as que sobraram no fim do dia
  if (r.marmitas || r.esfriou || r.jogadas || r.sobra) rows.splice(2, 0, ['Marmitas', r.marmitas + ' entregue' + (r.marmitas === 1 ? '' : 's') + (r.efood ? ' (Efood −' + fmt(r.efood) + ')' : '') + (r.jogadas ? ' · ' + r.jogadas + ' jogada' + (r.jogadas > 1 ? 's' : '') + ' fora' : '') + (r.esfriou ? ' · ' + r.esfriou + ' esfri' + (r.esfriou > 1 ? 'aram' : 'ou') : '') + (r.sobra ? ' · ' + r.sobra + ' sobr' + (r.sobra > 1 ? 'aram' : 'ou') : '')]);
  if (r.vip || r.vipLost) rows.splice(2, 0, ['VIPs', r.vip + ' atendido' + (r.vip === 1 ? '' : 's') + (r.vipLost ? ' · ' + r.vipLost + ' bravo' + (r.vipLost > 1 ? 's' : '') : '')]);
  if (r.amanha) rows.push(['Amanhã', EVENTOS[r.amanha].nome]);   // v10.6: a véspera do evento de bairro, a última linha da tabela
  if (r.noite) rows.push(['Michelzão', 'O guia liga amanhã cedo']);   // v10.10: a noite da estrela
  // Gúgou (v8.4): a caixa animada à esquerda dos quadros (v8.4.1); embaixo, 2 ou 3 comentários (os critérios do dia no title)
  const av = $('end-aval'); clearEl(av); av.title = ''; clearEl($('end-baloes'));
  { const cr = $('end-critico'); clearEl(cr);   // v10.9: a ficha da visita do crítico: cinco linhas com 0 a 2 garfinhos, sem número
    if (r.critico){
      cr.setAttribute('aria-label', 'A ficha do crítico'); cr.appendChild(el('h3', null, 'O crítico esteve aqui'));
      CRITICO.itens.forEach((nome, i) => {
        const lin = el('div', 'cr-lin'), fg = el('span', 'cr-fg'), n = r.critico.it[i];
        lin.appendChild(el('span', null, nome)); lin.setAttribute('aria-label', nome + ': ' + n + ' de 2');
        for (let k = 0; k < 2; k++){ const cv = document.createElement('canvas'); cv.width = 44; cv.height = 44; const c = cv.getContext('2d'); drawGarfo(c, 22, 22, k < n, 1.7); fg.appendChild(cv); }
        lin.appendChild(fg); cr.appendChild(lin);
      });
    } }
  const a = r.aval;
  guruAnim++;
  if (a && a.dia){
    st.appendChild(gurugolCaixa(a, undefined, true));
    av.title = 'Hoje, em ' + a.dia.n + (a.dia.n > 1 ? ' avaliações: ' : ' avaliação: ') + AVAL_CRIT.map((c, i) => c.nome.toLowerCase() + ' ' + fmtNota(a.dia.crit[i]) + ' (' + a.dia.cnt[i] + ')').join(', ');
    // v9.6.11: os comentários viram balões grandes no topo (com o rostinho de quem falou), acima das tabelas
    if (a.coment.length){
      const bal = $('end-baloes'); bal.setAttribute('aria-label', 'Comentários do Gúgou');
      a.coment.forEach((t, i) => { const b = el('div', 'end-balao'); b.appendChild(rostinhoCliente((a.comentK || [])[i])); b.appendChild(el('q', null, t)); bal.appendChild(b); });
    }
  }
  // as contas do dia (v7), do faturamento ao lucro, num quadro ao lado
  const neg = v => v ? '-' + fmt(v) : '-';
  const conta = [['Faturamento', fmt(r.fat)],['Ingredientes', neg(r.custo)]].concat(r.aluguel ? [['Aluguel', neg(r.aluguel)],['Luz e gás', neg(r.contas - r.aluguel)]] : [['Contas do dia', neg(r.contas)]]).concat([['Folha', neg(r.paid)]]);   // v9: o aluguel do ponto à parte
  if (r.divName) conta.push([r.divName, neg(r.div)]);
  if (r.conserto) conta.push(['Conserto na hora', neg(r.conserto)]);
  if (r.multaVig) conta.push(['Multa da vigilância', neg(r.multaVig)]);
  conta.push(['Lucro do dia', fmt(r.money), 'tot']);
  if (r.par) conta.push(['Parcela do banco', neg(r.par)]);   // v8.3: fora do lucro (a meta), mas sai do dinheiro
  if (r.forcado) conta.push(['Banco (à força)', '+' + fmt(r.forcado)]);
  conta.push(['Dinheiro acumulado', fmt(game.save.bank)]);
  [rows, conta].forEach(list => {
    const box = el('div', 'stats');
    list.forEach(p => { box.appendChild(el('span', p[2] || null, p[0])); box.appendChild(el('b', p[2] || null, String(p[1]))); });
    st.appendChild(box);
  });
  /* v9.6.12: os recados em linhas curtas (cls: '' resultado, 'alerta' banco, 'boa' quem pode subir de nível, 'cap' o capítulo);
     o trabalho da equipe e o que ela vendeu foram para a tabela (rows) */
  const linhas = [], diz = (t, cls) => linhas.push([t, cls || '']);
  // campanha (v8.3): o dia seguinte vem de qualquer jeito; a meta não batida só fica sem estrelas
  let msg = '';
  if (!r.passed) msg = 'Meta de ' + fmt(r.meta) + ' não batida: o dia fica sem estrelas, mas a lanchonete abre amanhã de novo.';
  else if (r.stars === 3) msg = 'Perfeito! Lucro das 3 estrelas sem perder nenhum cliente.';
  else if (r.stars === 2) msg = r.money >= r.expert ? 'Lucro das 3 estrelas batido, mas ' + (r.lost === 1 ? '1 cliente foi embora' : r.lost + ' clientes foram embora') + ': a 3ª estrela pede que ninguém saia sem ser atendido.' : 'Duas estrelas! Para a 3ª, chegue a ' + fmt(r.expert) + ' sem perder nenhum cliente.';
  else msg = 'Meta batida! Chegue a ' + fmt(r.bom) + ' para a 2ª estrela.';
  diz(msg);
  if (r.day === DAYS.length) diz('Fim da semana de inauguração! Daqui em diante, cada dia tem o movimento do dia da semana.');
  // caixa no negativo (v8.3): quantos dias seguidos, ou o banco que cobriu à força
  const sv = game.save;
  // v8.3.1: a parcela que não coube no caixa ficou atrasada
  if (r.atrasou) diz('Faltou dinheiro para a parcela do banco: ficou atrasada. Amanhã, no fim do dia, o caixa precisa ter ' + fmt(game.devido) + ' (a atrasada e a do dia), senão o banco toma a lanchonete!', 'alerta');
  if (r.socorro) diz('O banco segurou a parcela desta vez. Na próxima, ele toma a lanchonete.', 'alerta');   // v9.6.13
  if (r.forcado) diz('O caixa fechou no negativo pelo ' + (BANCO.neg + 1) + 'º dia seguido: o banco cobriu ' + fmt(r.forcado) + ', com juros de ' + Math.round(BANCO.forcado * 100) + '% ao dia sobre o saldo, em ' + sv.emp.n + ' parcelas (a próxima, ' + fmt(game.parcela) + ').', 'alerta');
  else if (sv.bank < 0) diz('Caixa no negativo há ' + sv.neg + (sv.neg > 1 ? ' dias' : ' dia') + (sv.neg >= BANCO.neg ? ': se fechar amanhã no negativo, o banco cobre à força.' : ' (pode ficar até ' + BANCO.neg + ').'), 'alerta');
  // v8.9 e v9.2: quem já juntou experiência para subir de nível
  if (sv.equipe.dani > 0 && daniNivelXp(sv) > sv.equipe.dani) diz('A Dani já pode subir para o nível ' + (daniNivelXp(sv) - 1) + '!', 'boa');
  if (sv.equipe.joca > 0 && jocaNivelXp(sv) > sv.equipe.joca) diz('O Joca já pode subir para o nível ' + (jocaNivelXp(sv) - 1) + '!', 'boa');
  // Modo História (v8.7): o objetivo do capítulo no fim do dia
  if (r.cap) diz('Capítulo ' + r.cap.n + ', ' + r.cap.titulo + ': ' + (r.cap.ok ? '✓ Objetivo cumprido!' : r.cap.itens.map(it => (it.ok ? '✓ ' : '') + it.txt).join(' · ')), r.cap.ok ? 'cap feito' : 'cap');
  const em = $('end-msg'); clearEl(em);
  linhas.forEach(l => em.appendChild(el('div', 'end-linha' + (l[1] ? ' ' + l[1] : ''), l[0])));
  // v9.6.7: as fichas do Manual que o dia revelou (no máximo 3 nomes)
  const mn = (game.manualDia || []).map(manualFicha).filter(Boolean).map(manualNome), fm = $('end-manual');
  fm.textContent = mn.length ? 'Novo no Manual: ' + (mn.length > 3 ? mn.slice(0, 3).join(', ') + ' e mais ' + (mn.length - 3) : mn.join(', ')) + '.' : '';
  fm.style.display = mn.length ? '' : 'none';
  $('btn-next').textContent = 'Lojinha e dia ' + game.proxDia;
  if (game.mode === 'carreira') rankAuto('carreira');
}
/* v8.3.1: o banco tomou a lanchonete (a parcela atrasada não foi paga no dia seguinte): fim da carreira */
/* v12: o cartão do fim do Desafio: o nome, a medalha grande e uma linha com o resultado (a medalha, o `falhou` da regra ou "Não deu a meta.") */
function buildDesafioFim(){
  const r = game.desafioRes, D = DESAFIOS.find(x => x.id === r.id), box = $('desafio-fim-medalha');
  $('desafio-fim-titulo').textContent = D.nome;
  clearEl(box); box.appendChild(medalhaEl(r.medalha, true));
  $('desafio-fim-aviso').textContent = ''; clearEl($('desafio-fim-caixa'));   // v12.3: o relatório do desafio, só no modo dev
  $('btn-desafio-copia').style.display = DEV.on ? '' : 'none';
  $('desafio-fim-msg').textContent = r.medalha ? 'Medalha de ' + MEDALHAS[r.medalha] + '!' + (r.nova ? ' Nova melhor marca!' : '') : r.falhou ? D.falhou : 'Não deu a meta.';
}
/* v12.2, o relatório do Teste de habilidade (texto puro, vírgula decimal, uma linha por bloco; a 1ª linha leva o número do formato para a ferramenta ler sempre igual). Só lê o jogo: não muda nada */
function testeRelatorio(g){
  const D = g.teste ? null : g.desafio, T = g.teste || { nome:'Desafio: ' + D.nome, semente:D.semente, tent:g.dTent.tent, quando:g.dTent.quando };   // v12.3: o mesmo relatório no fim do Desafio (com a linha Desafio:)
  const m = g.tm, st = g.stats, d = g.day, lb = st.lostBy;
  const fn = (v, c) => v.toFixed(c == null ? 1 : c).replace('.', ',');
  const soma = a => a.reduce((x, y) => x + y, 0);
  const mediana = a => { const o = a.slice().sort((x, y) => x - y), h = o.length >> 1; return o.length % 2 ? o[h] : (o[h - 1] + o[h]) / 2; };
  const reac = a => a.length ? fn(soma(a) / a.length) + ' / ' + fn(mediana(a)) + ' / ' + a.length : '—';
  const p2 = n => (n < 10 ? '0' : '') + n, q = T.quando || new Date();
  const lucro = Math.round(g.lucro), est = g.estrelasDe(lucro), av = avalMedias(g.avalsPeso());
  const nv = typeof navigator !== 'undefined' ? navigator : {}, tipo = m.aparelho === 'bot' ? 'bot' : tipoAparelho(nv.userAgent, nv.maxTouchPoints || 0, nv.userAgentData ? nv.userAgentData.mobile : undefined);   // v12.3.2
  const tela = m.aparelho === 'bot' ? '-' : window.innerWidth + '×' + window.innerHeight;
  const min = m.t / 60;
  const rd = g.desafioRes, linhaD = D && rd ? ['Desafio: ' + (rd.medalha ? 'medalha de ' + MEDALHAS[rd.medalha] : 'sem medalha') + ' · regra ' + (!D.cond ? '—' : rd.falhou ? 'não valeu' : 'valeu')] : [];
  return [
    'LCC-TESTE ' + TESTE_FORMATO + ' · ' + VERSAO + ' · ' + T.nome + ' · dia ' + d.n + ' · semente ' + T.semente,
    'Jogador: ' + (lastName() || 'sem nome') + ' · tentativa ' + T.tent + ' · ' + tipo + ' · ' + m.aparelho + ' ' + tela + ' · ' + p2(q.getDate()) + '/' + p2(q.getMonth() + 1) + '/' + q.getFullYear() + ' ' + p2(q.getHours()) + ':' + p2(q.getMinutes()),
    'Equipe: ' + (g.eqLinha || ''),   // v12.4 (formato 3)
    'Resultado: lucro ' + fmt(lucro) + ' · meta ' + fmt(d.meta) + ' (' + Math.round(lucro / d.meta * 100) + '%) · ' + (est ? '★'.repeat(est) : '0★') + ' · servidos ' + st.served + ' de ' + st.spawned + ' · Gúgou ' + (av ? fn(av.nota) : '—')
  ].concat(linhaD, [
    'Perdidos: ' + st.lost + ' · fila sem mesa ' + lb.semMesa + ' · fila com mesa ' + lb.comMesa + ' · pedido ' + lb.pedido + ' · prato ' + lb.prato + ' · conta ' + lb.conta + ' · retirada ' + lb.retirada + ' · esfriou ' + st.esfriou,
    'Reação em s (média / mediana / casos): sentar ' + reac(m.sentar) + ' · pedido ' + reac(m.pedido) + ' · prato ' + reac(m.prato) + ' · conta ' + reac(m.conta) + ' · mesa suja ' + reac(m.suja),
    'Ritmo: ' + fn(min > 0 ? m.ac / min : 0) + ' ações/min · ' + m.perd + ' toques perdidos · fila média ' + fn(m.t > 0 ? m.filaS / m.t : 0),
    'Bia parada: ' + Math.round(m.t > 0 ? 100 * m.par / m.t : 0) + '% do turno com coisa à espera'
  ], m.dev ? ['(encerrado no modo dev)'] : []).join('\n');
}
/* v12.2: a tela do fim do teste: o título, a linha do lucro e das estrelas (como no fim do Desafio, sem medalha) e os botões; o relatório só aparece se a cópia falhar */
function buildTesteFim(){
  const g = game, m = Math.round(g.lucro), est = g.estrelasDe(m);
  $('teste-fim-titulo').textContent = 'Teste: ' + g.teste.nome;
  $('teste-fim-msg').textContent = 'Lucro ' + fmt(m) + ' · ' + (est ? '★'.repeat(est) : '0★');
  $('teste-fim-aviso').textContent = '';
  const cx = $('teste-fim-caixa'); clearEl(cx);
}
function testeCopia(pre){
  pre = pre || 'teste';   // v12.3: 'teste' (ov-teste-fim) ou 'desafio' (ov-desafio-fim)
  const t = game.testeRel, st = $(pre + '-fim-aviso'), cx = $(pre + '-fim-caixa');
  copyText(t).then(ok => {
    if (ok){ Sfx.ok(); st.textContent = 'Copiado! Cole na conversa.'; clearEl(cx); return; }
    st.textContent = 'Não deu para copiar sozinho: selecione o texto abaixo.';
    let ta = cx.children[0];
    if (!ta){ ta = el('textarea', 'cx-txt'); ta.setAttribute('readonly', ''); ta.setAttribute('aria-label', 'Relatório do teste'); cx.appendChild(ta); }
    ta.value = t; if (ta.select) ta.select();
  });
}
function buildFalencia(){
  const r = game.result, sv = game.save;
  $('btn-falencia-rank').style.display = DEV.on ? '' : 'none';   // v12.10.4: o Ranking só com o modo dev ligado
  if (!r) return;
  $('falencia-msg').textContent = 'No fim do dia ' + r.day + ', o caixa (' + fmt(sv.bank) + ') não tinha os ' + fmt(r.devido) + ' da parcela atrasada e da do dia. A carreira acabou: recomece do zero quando quiser.';
  const st = $('falencia-stats');
  clearEl(st);
  [['Dias jogados', String(r.day)], ['Estrelas', sv.estrelas + ' ★'], ['Lucro acumulado', fmt(sv.lucroTot)], ['Lucro do último dia', fmt(r.money)], ['Dívida com o banco', fmt(sv.emp.resto)]].forEach(p => {
    st.appendChild(el('span', null, p[0])); st.appendChild(el('b', null, p[1]));
  });
  rankAuto('carreira');
}
function buildEndless(){
  const r = game.endless;
  if (!r) return;
  const st = $('endless-stats');
  clearEl(st);
  [['Pontos de atendimento', r.pontos],['Faturamento', fmt(r.fat || 0)],['Tempo sobrevivido', mmssUp(r.tempo)],['Grupos atendidos', r.served],['VIPs atendidos', r.vip],['Sucos entregues', r.juice],['Maior corrente', '×' + r.chain],['Não couberam na espera', r.full],['Ingredientes e contas', '-' + fmt(r.custo + r.contas)],['Dinheiro acumulado', fmt(game.save.bank)]].forEach(p => {
    st.appendChild(el('span', null, p[0])); st.appendChild(el('b', null, String(p[1])));
  });
  rankAuto('semfim');
}

/* ---------- registro automático no ranking (v11.9) e o nome, escrito na tela do Ranking ---------- */
function lastName(){ return cleanName(lsGet(LS.name) || ''); }
function rankNome(){ return lastName() || RANK_VOCE; }
function rankAuto(kind){
  if (DEV.on) return;
  let pontos, extra;
  if (kind === 'carreira'){ if (!game || game.mode !== 'carreira') return; pontos = game.save.lucroTot; extra = { dia: game.proxDia - 1 }; }   // o lucro acumulado da campanha e o último dia jogado
  else { const r = game && game.endless; if (!r) return; pontos = r.pontos; extra = { tempo: r.tempo }; }
  if (!(pontos > 0)) return;
  try { Promise.resolve(Rank.saveScore(kind, rankNome(), pontos, extra)).catch(() => {}); } catch(e) {}
}
function rankNomeForm(){
  const inp = $('rank-nome-inp'), msg = $('rank-nome-msg'), form = $('rank-nome');
  if (!inp || !form) return;
  inp.value = lastName();
  msg.textContent = '';
  if (form.getAttribute('data-bound')) return;
  form.setAttribute('data-bound', '1');
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const nome = cleanName(inp.value);
    if (!nome){ msg.textContent = 'Digite seu nome.'; return; }
    const antes = lastName();
    lsSet(LS.name, nome);
    if (!antes) Rank.renomeiaLocal(RANK_VOCE, nome);
    msg.textContent = 'Nome salvo.';
    rk.started = null; rankStart();
  });
}

/* ---------- tela de Ranking ---------- */
const rk = { tab:'carreira', by:'pontos', dir:'desc', rows:[], source:'local', unsub:null, open:false, back:'ov-menu', started:null };
function rankStop(){ if (rk.unsub){ try { rk.unsub(); } catch(e) {} rk.unsub = null; } rk.started = null; }
function rankStart(){
  const want = (Rank.shared ? 'shared:' : 'local:') + rk.tab;
  if (rk.started === want) return;
  rankStop();
  rk.started = want;
  rk.rows = [];
  rk.unsub = Rank.subscribe(rk.tab, (rows, src) => { rk.rows = rows; rk.source = src; renderRank(); });
}
function segSync(id, val){
  const box = $(id);
  if (!box) return;
  Array.prototype.forEach.call(box.querySelectorAll('button'), b => b.setAttribute('aria-pressed', b.getAttribute('data-v') === val ? 'true' : 'false'));
}
function renderRank(){
  if ($('rank-tabs')) Array.prototype.forEach.call($('rank-tabs').querySelectorAll('button'), b => { if (b.getAttribute('data-v') === 'semfim') b.style.display = DEV.on ? '' : 'none'; });   // v12.10: o Turno sem fim só aparece com o modo dev (o código fica, para voltar como extra)
  if (!DEV.on && rk.tab === 'semfim') rk.tab = 'carreira';
  segSync('rank-tabs', rk.tab); segSync('rank-by', rk.by); segSync('rank-dir', rk.dir);
  $('rank-source').textContent = rk.source === 'shared' ? 'Ranking compartilhado' : 'Ranking deste aparelho';
  const wrap = $('rank-wrap');
  clearEl(wrap);
  const rows = sortRows(rk.rows, rk.by, rk.dir);
  if (!rows.length){ wrap.appendChild(el('div', 'rank-empty', 'Ninguém no ranking ainda. Seja o primeiro!')); return; }
  const tb = el('table', 'rank');
  const hd = el('tr');
  ['Nome','Pontos', rk.tab === 'carreira' ? 'Dia' : 'Tempo'].forEach((h,i) => { const th = el('th', null, h); if (i) th.style.textAlign = 'right'; hd.appendChild(th); });
  tb.appendChild(hd);
  rows.forEach(r => {
    const tr = el('tr', r.me ? 'me' : null);
    tr.appendChild(el('td', null, r.nome + (r.me ? ' (você)' : '')));
    tr.appendChild(el('td', 'n', String(r.pontos)));
    tr.appendChild(el('td', 'n', rk.tab === 'carreira' ? (r.dia ? String(r.dia) : '-') : mmssUp(r.tempo)));
    tb.appendChild(tr);
  });
  wrap.appendChild(tb);
}
function openRank(back){
  rk.back = back || 'ov-menu'; rk.open = true;
  rankNomeForm();
  showOnly(['ov-rank']);
  renderRank();
  if (Rank.online) $('rank-source').textContent = 'Conectando...';
  Promise.race([Rank.init(), delay(2500)]).then(() => { if (rk.open) rankStart(); });
  Rank.init().then(() => { if (rk.open) rankStart(); });
}
function closeRank(){
  rk.open = false; rankStop();
  showOnly([rk.back]);
}
function bindSeg(id, key, after){
  const box = $(id);
  if (!box) return;
  Array.prototype.forEach.call(box.querySelectorAll('button'), b => b.addEventListener('click', () => {
    Sfx.init(); Sfx.tap();
    rk[key] = b.getAttribute('data-v');
    if (after) after(); else renderRank();
  }));
}
bindSeg('rank-tabs', 'tab', () => { rk.rows = []; rk.started = null; renderRank(); rankStart(); });
bindSeg('rank-by', 'by');
bindSeg('rank-dir', 'dir');


/* v9.6.11: o rostinho do tipo de cliente (a 1ª pessoa do grupo, só a cabeça) no balão do Gúgou */
function rostinhoCliente(k){
  const cv = document.createElement('canvas'); cv.width = 72; cv.height = 72; cv.className = 'end-rosto';
  const c = cv.getContext('2d'); c.scale(1.5, 1.5); c.lineJoin = 'round'; c.lineCap = 'round';
  c.beginPath(); c.arc(24, 24, 22, 0, TAU); c.fillStyle = '#EFE6CF'; c.fill(); c.clip();
  const p = makePeople(CUSTOMER_TYPES[k] ? k : 'estudante', 1)[0];
  drawPerson(c, p, 24, 77, { mood:0, s:1.05 });
  return cv;
}
