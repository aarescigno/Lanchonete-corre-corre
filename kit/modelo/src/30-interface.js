
/* ========== Interface ==========
   Só lê o estado e chama o Jogo; nada de regra de jogo aqui. */
const $ = id => document.getElementById(id);
const fmtNum = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmt = n => (n < 0 ? '−R$ ' : 'R$ ') + fmtNum(Math.abs(n));
const fmtPct = x => (x * 100).toFixed(1).replace('.', ',') + '%';
const plural = (n, um, varios) => n + ' ' + (n === 1 ? um : varios);
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function mostraTela(id){
  for (const t of ['tela-menu', 'tela-painel', 'tela-fim']) $(t).classList.remove('ativa');
  $(id).classList.add('ativa');
}

let avisoTimer = null;
function aviso(txt){
  const a = $('aviso'); a.textContent = txt; a.classList.add('ativo');
  clearTimeout(avisoTimer); avisoTimer = setTimeout(() => a.classList.remove('ativo'), 2500);
}

function tabelaHTML(cab, linhas){
  const th = cab.map(c => `<th class="${c.num ? 'num' : ''}">${esc(c.t)}</th>`).join('');
  const tr = linhas.map(l => '<tr>' + l.map((v, i) => `<td class="${cab[i].num ? 'num' : ''}">${v}</td>`).join('') + '</tr>').join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

const NOME_RES = { V: 'Vitória', E: 'Empate', D: 'Derrota' };

function desenhaPainel(jogo){
  const e = jogo.estado;
  $('pn-titulo').textContent = `Temporada ${e.temporada} · semana ${e.semana} de ${CFG.semanas}`;
  $('pn-caixa').textContent = 'Caixa: ' + fmt(e.caixa);
  $('pn-caixa').className = e.caixa < 0 ? 'ruim' : '';
  const u = e.historico[e.historico.length - 1];
  $('pn-ultima').textContent = u ? `${NOME_RES[u.res]} contra ${u.rival} · receita ${fmt(u.receita)}, salários ${fmt(u.salarios)}` : 'Nada ainda.';
  const ord = e.tabela.slice().sort((a, b) => b.pts - a.pts);
  $('pn-tabela').innerHTML = tabelaHTML([{t:'#',num:true},{t:'Equipe'},{t:'Pontos',num:true}],
    ord.map((t, i) => [i + 1, t.nos ? `<strong>${esc(t.nome)}</strong>` : esc(t.nome), t.pts]));
  $('pn-equipe').innerHTML = tabelaHTML([{t:'Nome'},{t:'Nível',num:true},{t:'Salário',num:true}],
    e.equipe.map(m => [esc(m.nome), m.nivel, fmt(m.nivel * CFG.salarioPorNivel)]));
  $('bt-avancar').disabled = jogo.acabou;
}

function desenhaFim(jogo){
  const r = jogo.resumoTemporada();
  $('fim-resumo').innerHTML = `<p>Temporada ${r.temporada}: <strong>${r.posicao}º lugar</strong>.</p>`
    + `<p>${plural(r.V, 'vitória', 'vitórias')}, ${plural(r.E, 'empate', 'empates')}, ${plural(r.D, 'derrota', 'derrotas')}.</p><p>Caixa: <span class="${r.caixa < 0 ? 'ruim' : 'bom'}">${fmt(r.caixa)}</span></p>`;
}
