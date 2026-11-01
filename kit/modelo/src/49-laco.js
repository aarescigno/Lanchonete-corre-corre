
/* ========== Início e eventos ========== */
let jogo = null;

function expoe(){
  window.__jogo = jogo;
  window.__api = { VERSAO, SAVE_V, CHAVE, CFG, NOMES, RIVAIS, MIGRA, Jogo, Save, novoEstado, migra, criaSorte, fmt, fmtPct };
}

function comeca(estado){
  jogo = new Jogo(estado);
  expoe();
  desenhaPainel(jogo);
  mostraTela(jogo.acabou ? 'tela-fim' : 'tela-painel');
  if (jogo.acabou) desenhaFim(jogo);
}

$('vtag').textContent = VERSAO;
$('bt-novo').addEventListener('click', () => {
  comeca(novoEstado(Date.now() >>> 0));   // a única fonte de acaso fora da sorte: a semente do jogo novo
  Save.salvar(jogo.estado);
});
$('bt-continuar').addEventListener('click', () => {
  const r = Save.carregar();
  if (!r) return aviso('Não há jogo salvo.');
  if (r.erro) return aviso('Não deu para abrir o jogo salvo (' + r.erro + ').');
  comeca(r.estado);
});
$('bt-avancar').addEventListener('click', () => {
  if (!jogo || jogo.acabou) return;
  jogo.avancar();
  Save.salvar(jogo.estado);
  desenhaPainel(jogo);
  if (jogo.acabou){ desenhaFim(jogo); mostraTela('tela-fim'); }
});
$('bt-proxima').addEventListener('click', () => {
  jogo.novaTemporada();
  Save.salvar(jogo.estado);
  desenhaPainel(jogo);
  mostraTela('tela-painel');
});
$('bt-menu').addEventListener('click', () => mostraTela('tela-menu'));

expoe();
})();
</script>
