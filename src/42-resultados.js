/* ---------- fim do dia ---------- */
function buildEnd(){
  const r = game.result;
  if (!r) return;
  $('end-title').textContent = r.passed ? ('Dia ' + r.day + ' concluído!') : 'Faltou pouquinho...';
  starsHtml($('end-stars'), r.stars, 3);
  $('end-money').textContent = (r.money < 0 ? 'Prejuízo de ' + fmt(-r.money) : 'Lucro de ' + fmt(r.money)) + ' (meta ' + fmt(r.meta) + ' · 2 estrelas ' + fmt(r.bom) + ' · expert ' + fmt(r.expert) + ')';
  const st = $('end-stats');
  clearEl(st);
  const rows = [['Atendidos', r.served],['Perdidos', r.lost],['Não couberam', r.full],['Maior corrente', '×' + r.chain]];
  if (r.trash) rows.splice(2, 0, ['Na lixeira', r.trash + ' bebida' + (r.trash > 1 ? 's' : '')]);
  if (r.juice || r.juiceMiss) rows.splice(2, 0, ['Sucos', r.juice + ' entregue' + (r.juice === 1 ? '' : 's') + (r.juiceMiss ? ' · ' + r.juiceMiss + ' mesa' + (r.juiceMiss > 1 ? 's' : '') + ' sem suco' : '')]);
  if (r.sucoEsp){ const b = BEBIDA_ESPERA[r.bebida] || BEBIDA_ESPERA.suco; rows.splice(2, 0, [b.fim, b.preco ? r.sucoEsp + ' na conta (' + fmt(r.sucoEsp * b.preco) + ')' : r.sucoEsp + (r.sucoEsp > 1 ? ' copos' : ' copo') + ', de graça']); }
  // imprevistos (v8): o que quebrou (e se foi consertado na hora) e o clima do dia
  if (r.quebras && r.quebras.length) rows.push(['Quebrou', r.quebras.map(q => manutOf(q.id).name.toLowerCase() + (q.fixed ? ' (consertado)' : '')).join(', ')]);
  if (r.clima) rows.push(['Imprevisto', CLIMA[r.clima].nome]);
  if (r.vip || r.vipLost) rows.splice(2, 0, ['VIPs', r.vip + ' atendido' + (r.vip === 1 ? '' : 's') + (r.vipLost ? ' · ' + r.vipLost + ' bravo' + (r.vipLost > 1 ? 's' : '') : '')]);
  // as contas do dia (v7), do faturamento ao lucro, num quadro ao lado
  const neg = v => v ? '-' + fmt(v) : '-';
  const conta = [['Faturamento', fmt(r.fat)],['Ingredientes', neg(r.custo)],['Contas do dia', neg(r.contas)],['Folha', neg(r.paid)]];
  if (r.divName) conta.push([r.divName, neg(r.div)]);
  if (r.conserto) conta.push(['Conserto na hora', neg(r.conserto)]);
  conta.push(['Lucro do dia', fmt(r.money), 'tot'], ['Dinheiro acumulado', fmt(game.save.bank)]);
  [rows, conta].forEach(list => {
    const box = el('div', 'stats');
    list.forEach(p => { box.appendChild(el('span', p[2] || null, p[0])); box.appendChild(el('b', p[2] || null, String(p[1]))); });
    st.appendChild(box);
  });
  let msg = '';
  if (!r.passed) msg = 'Bata a meta de ' + fmt(r.meta) + ' para liberar o próximo dia.';
  else if (r.stars === 3) msg = 'Perfeito! Expert sem perder nenhum cliente.';
  else if (r.stars === 2) msg = r.money >= r.expert ? 'Meta expert batida! Para a 3ª estrela, não perca nenhum cliente.' : 'Duas estrelas! Para a 3ª, chegue a ' + fmt(r.expert) + ' sem perder nenhum cliente.';
  else msg = 'Meta batida! Chegue a ' + fmt(r.bom) + ' para a 2ª estrela.';
  $('end-msg').textContent = msg;
  const next = $('btn-next');
  next.style.display = r.passed ? '' : 'none';
  next.textContent = r.day < 7 ? 'Melhorias e dia ' + (r.day + 1) : 'Ver resultado final';
  buildSaveForm($('end-save'), 'carreira');
}
function buildFinal(){
  const t = game.totals();
  const fs3 = $('final-stars');
  clearEl(fs3);
  fs3.appendChild(el('span','on', '★ ' + t.stars + '/21'));
  const st = $('final-stats');
  clearEl(st);
  [['Faturamento total (melhores dias)', fmt(t.money)],['Estrelas', t.stars + ' de 21'],['Melhorias compradas', Object.keys(game.up).filter(k => game.up[k]).length + ' de ' + UPGRADES.length]].forEach(p => {
    st.appendChild(el('span', null, p[0])); st.appendChild(el('b', null, p[1]));
  });
  buildSaveForm($('final-save'), 'carreira');
}
function buildEndless(){
  const r = game.endless;
  if (!r) return;
  const st = $('endless-stats');
  clearEl(st);
  [['Pontos', r.pontos],['Tempo sobrevivido', mmssUp(r.tempo)],['Grupos atendidos', r.served],['VIPs atendidos', r.vip],['Sucos entregues', r.juice],['Maior corrente', '×' + r.chain],['Não couberam na espera', r.full],['Ingredientes e contas', '-' + fmt(r.custo + r.contas)],['Dinheiro acumulado', fmt(game.save.bank)]].forEach(p => {
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
    if (kind === 'carreira'){ pontos = game.totals().money; extra = { dia: game.careerMaxDone() }; }
    else { const r = game.endless || { pontos:0, tempo:0 }; pontos = r.pontos; extra = { tempo: r.tempo }; }
    if (!(pontos > 0)){ msg.textContent = 'Faça alguns pontos antes de salvar.'; return; }
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
  $('rank-source').textContent = 'Conectando...';
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

