# Partes do código, versão a versão (só quando precisar)

Para achar uma função, use `tests/mapa.sh [filtro]`. Aqui fica o que cada parte de `src/` tem e em que versão entrou cada coisa.

| Parte | O que tem | Mudanças por versão |
|---|---|---|
| `00-topo.html` | `<title>`, viewport, abre o `<style>` | v0.1 |
| `01-estilo.css` | variáveis de cor, telas, tabelas, botões | v0.1 |
| `02-telas.html` | fecha o `<style>`, as telas `#tela-*`, o `#aviso`, abre o `<script>` e o `(function(){` | v0.1 |
| `10-dados.js` | `VERSAO`, `SAVE_V`, `CHAVE`, `CFG`, tabelas de conteúdo | v0.1 |
| `11-sorte.js` | `criaSorte` (mulberry32 com estado salvável) | v0.1 |
| `12-estado.js` | `novoEstado`, `MIGRA`, `migra`, `Save` | v0.1 |
| `13-simulacao.js` | classe `Jogo` (`avancar`, `forca`, `posicao`, `resumoTemporada`, `novaTemporada`) | v0.1 |
| `30-interface.js` | `fmt`, `fmtPct`, `plural`, `esc`, `mostraTela`, `aviso`, `tabelaHTML`, `desenhaPainel`, `desenhaFim` | v0.1 |
| `49-laco.js` | `comeca`, `expoe`, eventos dos botões, fecha o JS | v0.1 |
