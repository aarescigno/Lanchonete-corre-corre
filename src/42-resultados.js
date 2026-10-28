/* ---------- fim do dia ---------- */
/* faixa da nota do Gurugol (v8.4.1), pela nota com uma casa: abaixo de 4 pura, de 4 a 4,4 prata, de 4,5 a 4,8 ouro e acima disso diamante */
function notaFaixa(n){ n = Math.round(n * 10) / 10; return n > 4.8 ? 'diamante' : n >= 4.5 ? 'ouro' : n >= 4 ? 'prata' : 'pura'; }
const GURU_BRILHOS = { pura:0, prata:0, ouro:3, diamante:7 };
let guruAnim = 0;   // a animação em curso (abrir de novo o fim do dia cancela a anterior)
/* caixa do Gurugol no fim do dia (v8.4.1): uma barra por critério, que enche até a nota dele, e embaixo a nota contando
   de 0 até o valor, com a cor da faixa; ouro e diamante soltam brilhinhos. Com prefers-reduced-motion, já aparece pronta */
function gurugolCaixa(a, sub){
  const m = a.geral || a.dia, box = el('div', 'guru');
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', 'Gurugol: ' + (a.geral ? fmtNota(m.nota) + ' estrelas' : 'sem nota ainda, ' + a.n + ' de ' + AVAL.min + ' avaliações' + (sub ? '' : '; hoje ' + fmtNota(m.nota))) + '. ' + AVAL_CRIT.map((c, i) => c.nome + ' ' + fmtNota(m.crit[i])).join(', ') + '.');
  box.appendChild(el('b', 'guru-tit', 'Gurugol'));
  const fills = AVAL_CRIT.map((c, i) => {
    const row = el('div', 'guru-crit');
    row.appendChild(el('span', null, c.nome));
    const bar = el('div', 'guru-bar'), f = el('i');
    f.style.width = RM ? (m.crit[i] / 5 * 100) + '%' : '0%';
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
    fills.forEach((f, i) => { const p = clamp((s - 0.15 * i) / 0.7, 0, 1); f.style.width = (m.crit[i] / 5 * 100 * (1 - Math.pow(1 - p, 3))) + '%'; });
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
  if (!r) return;
  $('end-title').textContent = r.passed ? ('Dia ' + r.day + ' concluído!') : 'Dia ' + r.day + ': faltou pouquinho...';
  starsHtml($('end-stars'), r.stars, 3);
  $('end-money').textContent = (r.money < 0 ? 'Prejuízo de ' + fmt(-r.money) : 'Lucro de ' + fmt(r.money)) + ' (meta ' + fmt(r.meta) + ' · 2 estrelas ' + fmt(r.bom) + ' · 3 estrelas ' + fmt(r.expert) + ' sem perder ninguém)';
  const st = $('end-stats');
  clearEl(st);
  const rows = [['Atendidos', r.served],['Perdidos', r.lost],['Não couberam', r.full],['Maior corrente', '×' + r.chain],['Pontos de atendimento', r.pontos || 0]];
  if (r.trash) rows.splice(2, 0, ['Na lixeira', r.trash + ' bebida' + (r.trash > 1 ? 's' : '')]);
  if (r.juice || r.juiceMiss) rows.splice(2, 0, ['Sucos', r.juice + ' entregue' + (r.juice === 1 ? '' : 's') + (r.juiceMiss ? ' · ' + r.juiceMiss + ' mesa' + (r.juiceMiss > 1 ? 's' : '') + ' sem suco' : '')]);
  if (r.sucoEsp){ const b = BEBIDA_ESPERA[r.bebida] || BEBIDA_ESPERA.suco; rows.splice(2, 0, [b.fim, b.preco ? r.sucoEsp + ' na conta (' + fmt(r.sucoEsp * b.preco) + ')' : r.sucoEsp + (r.sucoEsp > 1 ? ' copos' : ' copo') + ', de graça']); }
  // imprevistos (v8): o que quebrou (e se foi consertado na hora) e o clima do dia
  if (r.quebras && r.quebras.length) rows.push(['Quebrou', r.quebras.map(q => manutOf(q.id).name.toLowerCase() + (q.fixed ? ' (consertado)' : '')).join(', ')]);
  if (r.clima) rows.push(['Imprevisto', CLIMA[r.clima].nome]);
  // marmitas (v8.6): as entregues (e a parte da Efood), as que esfriaram e as que sobraram no fim do dia
  if (r.marmitas || r.esfriou || r.sobra) rows.splice(2, 0, ['Marmitas', r.marmitas + ' entregue' + (r.marmitas === 1 ? '' : 's') + (r.efood ? ' (Efood −' + fmt(r.efood) + ')' : '') + (r.esfriou ? ' · ' + r.esfriou + ' esfri' + (r.esfriou > 1 ? 'aram' : 'ou') : '') + (r.sobra ? ' · ' + r.sobra + ' sobr' + (r.sobra > 1 ? 'aram' : 'ou') : '')]);
  if (r.vip || r.vipLost) rows.splice(2, 0, ['VIPs', r.vip + ' atendido' + (r.vip === 1 ? '' : 's') + (r.vipLost ? ' · ' + r.vipLost + ' bravo' + (r.vipLost > 1 ? 's' : '') : '')]);
  // Gurugol (v8.4): a caixa animada à esquerda dos quadros (v8.4.1); embaixo, 2 ou 3 comentários (os critérios do dia no title)
  const av = $('end-aval'); clearEl(av); av.title = '';
  const a = r.aval;
  guruAnim++;
  if (a && a.dia){
    st.appendChild(gurugolCaixa(a));
    av.title = 'Hoje, em ' + a.dia.n + (a.dia.n > 1 ? ' avaliações: ' : ' avaliação: ') + AVAL_CRIT.map((c, i) => c.nome.toLowerCase() + ' ' + fmtNota(a.dia.crit[i])).join(', ');
    if (a.coment.length) av.appendChild(el('i', null, a.coment.map(t => '“' + t + '”').join(' ')));
  }
  // as contas do dia (v7), do faturamento ao lucro, num quadro ao lado
  const neg = v => v ? '-' + fmt(v) : '-';
  const conta = [['Faturamento', fmt(r.fat)],['Ingredientes', neg(r.custo)],['Contas do dia', neg(r.contas)],['Folha', neg(r.paid)]];
  if (r.divName) conta.push([r.divName, neg(r.div)]);
  if (r.conserto) conta.push(['Conserto na hora', neg(r.conserto)]);
  conta.push(['Lucro do dia', fmt(r.money), 'tot']);
  if (r.par) conta.push(['Parcela do banco', neg(r.par)]);   // v8.3: fora do lucro (a meta), mas sai do dinheiro
  if (r.forcado) conta.push(['Banco (à força)', '+' + fmt(r.forcado)]);
  conta.push(['Dinheiro acumulado', fmt(game.save.bank)]);
  [rows, conta].forEach(list => {
    const box = el('div', 'stats');
    list.forEach(p => { box.appendChild(el('span', p[2] || null, p[0])); box.appendChild(el('b', p[2] || null, String(p[1]))); });
    st.appendChild(box);
  });
  let msg = '';
  // campanha (v8.3): o dia seguinte vem de qualquer jeito; a meta não batida só fica sem estrelas
  if (!r.passed) msg = 'Meta de ' + fmt(r.meta) + ' não batida: o dia fica sem estrelas, mas a lanchonete abre amanhã de novo.';
  else if (r.stars === 3) msg = 'Perfeito! Lucro das 3 estrelas sem perder nenhum cliente.';
  else if (r.stars === 2) msg = r.money >= r.expert ? 'Lucro das 3 estrelas batido, mas ' + (r.lost === 1 ? '1 cliente foi embora' : r.lost + ' clientes foram embora') + ': a 3ª estrela pede que ninguém saia sem ser atendido.' : 'Duas estrelas! Para a 3ª, chegue a ' + fmt(r.expert) + ' sem perder nenhum cliente.';
  else msg = 'Meta batida! Chegue a ' + fmt(r.bom) + ' para a 2ª estrela.';
  if (r.day === DAYS.length) msg += ' Fim da semana de inauguração! Daqui em diante, cada dia tem o movimento do dia da semana.';
  // caixa no negativo (v8.3): quantos dias seguidos, ou o banco que cobriu à força
  const sv = game.save;
  // v8.3.1: a parcela que não coube no caixa ficou atrasada
  if (r.atrasou) msg += ' Faltou dinheiro para a parcela do banco: ficou atrasada. Amanhã, no fim do dia, o caixa precisa ter ' + fmt(game.devido) + ' (a atrasada e a do dia), senão o banco toma a lanchonete!';
  if (r.forcado) msg += ' O caixa fechou no negativo pelo ' + (BANCO.neg + 1) + 'º dia seguido: o banco cobriu ' + fmt(r.forcado) + ', com juros de ' + Math.round(BANCO.forcado * 100) + '% ao dia sobre o saldo, em ' + sv.emp.n + ' parcelas (a próxima, ' + fmt(game.parcela) + ').';
  else if (sv.bank < 0) msg += ' Caixa no negativo há ' + sv.neg + (sv.neg > 1 ? ' dias' : ' dia') + (sv.neg >= BANCO.neg ? ': se fechar amanhã no negativo, o banco cobre à força.' : ' (pode ficar até ' + BANCO.neg + ').');
  $('end-msg').textContent = msg;
  $('btn-next').textContent = 'Lojinha e dia ' + game.proxDia;
  buildSaveForm($('end-save'), 'carreira');
}
/* v8.3.1: o banco tomou a lanchonete (a parcela atrasada não foi paga no dia seguinte): fim da carreira */
function buildFalencia(){
  const r = game.result, sv = game.save;
  if (!r) return;
  $('falencia-msg').textContent = 'No fim do dia ' + r.day + ', o caixa (' + fmt(sv.bank) + ') não tinha os ' + fmt(r.devido) + ' da parcela atrasada e da do dia. A carreira acabou: recomece do zero quando quiser.';
  const st = $('falencia-stats');
  clearEl(st);
  [['Dias jogados', String(r.day)], ['Estrelas', sv.estrelas + ' ★'], ['Lucro acumulado', fmt(sv.lucroTot)], ['Lucro do último dia', fmt(r.money)], ['Dívida com o banco', fmt(sv.emp.resto)]].forEach(p => {
    st.appendChild(el('span', null, p[0])); st.appendChild(el('b', null, p[1]));
  });
  buildSaveForm($('falencia-save'), 'carreira');
}
function buildEndless(){
  const r = game.endless;
  if (!r) return;
  const st = $('endless-stats');
  clearEl(st);
  [['Pontos de atendimento', r.pontos],['Faturamento', fmt(r.fat || 0)],['Tempo sobrevivido', mmssUp(r.tempo)],['Grupos atendidos', r.served],['VIPs atendidos', r.vip],['Sucos entregues', r.juice],['Maior corrente', '×' + r.chain],['Não couberam na espera', r.full],['Ingredientes e contas', '-' + fmt(r.custo + r.contas)],['Dinheiro acumulado', fmt(game.save.bank)]].forEach(p => {
    st.appendChild(el('span', null, p[0])); st.appendChild(el('b', null, String(p[1])));
  });
  buildSaveForm($('endless-save'), 'semfim');
}

/* ---------- formulário "Seu nome" + "Salvar no ranking" ---------- */
function lastName(){ return cleanName(lsGet(LS.name) || ''); }
function buildSaveForm(host, kind){
  clearEl(host);
  if (DEV.on){ host.appendChild(el('p', 'small savemsg', 'Modo dev: o ranking fica de fora.')); return; }
  const form = el('form', 'saveform');
  form.setAttribute('autocomplete', 'off');
  const id = 'nm-' + kind;
  const lab = el('label', null, 'Seu nome'); lab.setAttribute('for', id);
  const inp = el('input'); inp.type = 'text'; inp.id = id; inp.maxLength = 16; inp.value = lastName();
  inp.setAttribute('autocomplete', 'off'); inp.setAttribute('autocapitalize', 'words'); inp.setAttribute('spellcheck', 'false');
  const btn = el('button', 'btn go', 'Salvar no ranking'); btn.type = 'submit';
  const msg = el('p', 'small savemsg'); msg.setAttribute('role', 'status');
  form.appendChild(lab); form.appendChild(inp); form.appendChild(btn);
  host.appendChild(form); host.appendChild(msg);
  let busy = false;
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    if (busy) return;
    const nome = cleanName(inp.value);
    if (!nome){ msg.textContent = 'Digite seu nome para entrar no ranking.'; return; }
    let pontos, extra;
    if (kind === 'carreira'){ pontos = game.save.lucroTot; extra = { dia: game.proxDia - 1 }; }   // v8.3: o lucro acumulado da campanha e o último dia jogado
    else { const r = game.endless || { pontos:0, tempo:0 }; pontos = r.pontos; extra = { tempo: r.tempo }; }
    if (!(pontos > 0)){ msg.textContent = kind === 'carreira' ? 'O lucro acumulado precisa ficar acima de zero para entrar no ranking.' : 'Faça alguns pontos antes de salvar.'; return; }
    busy = true; btn.disabled = true; msg.textContent = 'Salvando...';
    lsSet(LS.name, nome);
    try {
      const res = await Rank.saveScore(kind, nome, pontos, extra);
      if (res.refused) msg.textContent = 'O ranking compartilhado recusou o registro; salvei só neste aparelho.';
      else if (!res.improved) msg.textContent = 'Seu recorde (' + res.best + ' pontos) continua maior; mantive o melhor.';
      else msg.textContent = res.where === 'shared' ? 'Salvo no ranking compartilhado!' : 'Salvo no ranking deste aparelho.';
    } catch(e) {
      msg.textContent = 'Não consegui salvar agora. Tente de novo.';
    }
    busy = false; btn.disabled = false;
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

