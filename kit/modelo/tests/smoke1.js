// smoke1 (v0.1): base do kit — sorte com semente, save/migração, simulação sem NaN e botões da interface.
const load = require('./harness');
const t = load.teste();

// 1. Mesma semente, mesmo resultado
function joga(semente, semanas){ const {jogo} = load({novo:semente}); for (let i = 0; i < semanas; i++) jogo.avancar(); return JSON.stringify(jogo.estado); }
t.ok(joga(7, 10) === joga(7, 10), 'mesma semente dá o mesmo estado');
t.ok(joga(7, 10) !== joga(8, 10), 'sementes diferentes dão estados diferentes');

// 2. Simulação: números válidos e temporada termina
{
  const {jogo, api} = load({novo:3});
  while (!jogo.acabou) jogo.avancar();
  const e = jogo.estado;
  t.ok(e.semana === api.CFG.semanas, 'temporada tem CFG.semanas rodadas');
  t.ok(Number.isFinite(e.caixa), 'caixa é número');
  t.ok(e.equipe.every(m => Number.isInteger(m.nivel) && m.nivel <= 99), 'níveis inteiros até 99');
  const r = jogo.resumoTemporada();
  t.ok(r.V + r.E + r.D === api.CFG.semanas, 'V+E+D = rodadas');
  t.ok(jogo.avancar() === null, 'não avança depois do fim');
  jogo.novaTemporada();
  t.ok(e.temporada === 2 && e.semana === 0 && e.tabela.every(l => l.pts === 0), 'nova temporada zera a tabela');
}

// 3. Save: ida e volta, save quebrado, sem acesso, migração
{
  const {jogo, api, store} = load({novo:5});
  jogo.avancar();
  t.ok(api.Save.salvar(jogo.estado), 'salva');
  const r = api.Save.carregar();
  t.ok(r && r.estado && JSON.stringify(r.estado) === JSON.stringify(jogo.estado), 'carrega igual ao que salvou');
  store[api.CHAVE + '_save'] = '{quebrado';
  t.ok(api.Save.carregar().erro, 'save quebrado vira erro, não exceção');
  t.ok(!load({semAcesso:true}).api.Save.salvar({v:1}), 'sem localStorage não quebra');
  t.ok(String((() => { try { api.migra({v:0}); } catch (e) { return e.message; } })()).includes('migração'), 'save antigo sem migração avisa');
}

// 4. Interface: novo jogo, avançar, fim de temporada, continuar
{
  const {els, store, api} = load();
  els['bt-continuar'].fire('click');
  t.ok(els['aviso'].textContent.includes('Não há'), 'continuar sem save avisa');
  els['bt-novo'].fire('click');
  t.ok(els['tela-painel'].classList.contains('ativa'), 'novo jogo abre o painel');
  for (let i = 0; i < api.CFG.semanas; i++) els['bt-avancar'].fire('click');
  t.ok(els['tela-fim'].classList.contains('ativa'), 'fim da temporada abre a tela de fim');
  t.ok(/lugar/.test(els['fim-resumo'].innerHTML), 'resumo mostra a posição');
  const salvo = store[api.CHAVE + '_save'];
  const b = load({store});
  b.els['bt-continuar'].fire('click');
  t.ok(b.jogo && JSON.stringify(b.jogo.estado) === salvo, 'continuar abre o jogo salvo');
}

// 5. Formatação
{
  const {api} = load();
  t.ok(api.fmt(1234567) === 'R$ 1.234.567' && api.fmt(-50) === '−R$ 50', 'fmt em reais');
  t.ok(api.fmtPct(0.125) === '12,5%', 'fmtPct com vírgula');
}

t.fim();
