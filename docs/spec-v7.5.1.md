# v7.5.1 — Modo dev

Pedido do usuário em 21/10 (texto em `docs/PROPOSTAS.md`): um modo dev, ligado com 10 toques no selo da versão, com todos os dias liberados, R$ 10.000 e as melhorias ligadas e desligadas à vontade.

## Regras
- **Ligar:** 10 toques (ou cliques) seguidos no selo da versão do menu (`#vtag`), com no máximo 1,5 s entre um e outro (`DEV.toques`). Liga, seleciona o dia 7 e abre o painel `#ov-dev`. Ligado, o selo mostra "v7.5.1 · dev" (laranja) e 1 toque abre o painel.
- **Save à parte:** no modo dev o save é `lcc2_save_dev` (`saveKey()`); o de verdade (`lcc2_save`) não muda e volta ao sair. O modo fica guardado em `lcc2_dev` ("1" ou "0"), então continua ligado ao reabrir o jogo.
- **Dias:** o save dev tem sempre `maxDay` 7 (os 7 dias liberados).
- **Dinheiro:** ao ligar, R$ 10.000 (`DEV.bank`); no painel, "Repor R$ 10.000". "Zerar progresso" no modo dev volta a 7 dias e R$ 10.000.
- **Melhorias:** no painel, uma chave por melhoria (aria-pressed), de graça. Ligar os Tênis de corrida liga os Tênis novos; desligar os Tênis novos desliga os de corrida (`Game.devToggle`). Na lojinha, aba Melhorias, os botões viram "Ligar" e "Desligar", de graça e sem o limite de 1 por dia.
- **Ranking:** no modo dev, o fim do dia, o resultado final e o fim do Turno sem fim mostram "Modo dev: o ranking fica de fora." no lugar do formulário.
- **Sair:** "Sair do modo dev" no painel carrega o save de verdade de novo.

## Código
- `12-clientes.js`: `LS.dev`, `LS.devSave`, `DEV`, `saveKey()`; `loadSave` e `writeSave` usam `saveKey()` (no modo dev, sem a importação da v1).
- `16-jogo.js`: `setDev(on)`, `devBank()`, `devToggle(id)`; `resetProgress` respeita o modo dev.
- `40-interface.js`: `devSync()` (selo), `buildDev()` e `openDev()`. `43-telas.js`: contagem dos toques e botões do painel. `41-lojinha.js` e `42-resultados.js`: lojinha e ranking no modo dev.
- Teste `smoke15` (25/25).
