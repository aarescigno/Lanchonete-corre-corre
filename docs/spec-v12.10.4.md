# v12.10.4 — O Ranking só no modo dev (etapa correção)

**Situação:** aprovada
**Origem:** conversa de 23/11: "O ranking também não faz sentido agora mais de se ter no menu principal". Na escolha, o usuário tirou o botão de todas as telas do jogador ("não sei a utilidade dele pra esse jogo. Única utilidade de registrar algo de uma partida me parece ser o relatório dos testes e dos jogos missão pós-jogo") e o deixou só com o modo dev ligado.

## Objetivo
O jogador não vê mais o Ranking em nenhuma tela: o menu, o fim do dia e a falência ficam sem o botão. Quem joga com o modo dev ligado continua abrindo o Ranking, como o Turno sem fim e o Teste.

## Fora do escopo
- O código do ranking (`30-ranking.js`, `Rank`, `openRank`, `renderRank`, a tela `#ov-rank`) e o registro automático (`rankAuto`, que já não grava no modo dev): ficam como estão, escondidos, para voltar se o ranking compartilhado voltar.
- O Teste de habilidade e os Desafios: nada muda (o nome do Teste já se escreve na própria tela do Teste, pelo `testeNome`, e grava o mesmo `LS.name`).
- O fim do Turno sem fim (`#btn-endless-rank`): fica como está, porque essa tela só aparece no modo dev desde a v12.10.

## Regras (decisões tomadas)
- **Menu** (`buildMenu`, `src/40-interface.js`): `$('btn-rank').style.display = DEV.on ? '' : 'none';`, junto das linhas do `btn-teste` e do `btn-endless`. A conta dos botões da 2ª fileira passa a `const nbt = 1 + (dv ? 1 : 0) + (DEV.on ? 3 : 0);` (o Manual, mais o Desafios e, com o modo dev, o Turno sem fim, o Teste e o Ranking), com o comentário trocado para isso. As classes `quatro` (`nbt >= 4`) e `cinco` (`nbt >= 5`) seguem como estão.
- **Fim do dia** (`buildEnd`, `src/42-resultados.js`) e **falência** (`buildFalencia`): `$('btn-end-rank').style.display = DEV.on ? '' : 'none';` e `$('btn-falencia-rank').style.display = DEV.on ? '' : 'none';`, no começo de cada função (antes do `return` do `buildFalencia` sem `r`, para o botão nunca ficar à mostra).
- **HTML** (`src/02-telas.html`): os três botões (`btn-rank`, `btn-end-rank`, `btn-falencia-rank`) ganham `style="display:none"`, como o `btn-teste`, para não piscarem antes do `build*`.
- **Painel Instalar** (`#ov-app`): sai a frase " No app, o ranking fica só no aparelho." do fim do parágrafo (fica "Pronto: abra pelo ícone do hambúrguer na tela inicial e jogue com o celular deitado.").
- **Modo dev:** o botão Ranking volta ao menu, ao fim do dia e à falência com o modo dev ligado (é o jeito de assistir).
- **Manual e save:** nada (o `lcc2_ranking` e o `lcc2_name` continuam guardados).
- **Versão:** `VERSAO` e `vtag` (texto e `aria-label`) em v12.10.4; linha nova no topo do `#ov-ver`, com o "versão atual" saindo da v12.10.3: **"O Ranking sai do menu, do fim do dia e da falência (fica só no modo dev)."**, data 23/11/2026.

## Critérios de aceite
- **CA1** Sem o modo dev, depois do `buildMenu`, o `btn-rank` está escondido; com o modo dev, à mostra → `smoke121` (2)
- **CA2** Sem o modo dev, o `btn-end-rank` (depois do `buildEnd`) e o `btn-falencia-rank` (depois do `buildFalencia`) estão escondidos; com o modo dev, à mostra → `smoke121` (4)
- **CA3** Sem o modo dev, a 2ª fileira do menu não tem a classe `quatro` nem `cinco` (com os Desafios à mostra: 2 botões); com o modo dev e os Desafios, tem `cinco` → `smoke121` (2)
- **CA4** O `#ov-app` não fala mais em ranking, e a `VERSAO` é `v12.10.4` → `smoke121` (2)
- **CA5** O menu, o fim do dia e a falência cabem nos 14 tamanhos de tela → `python3 tests/menu_fit.py` verde

## Partes
- `src/02-telas.html`: os três botões, o `vtag`, o `#ov-app` e o `#ov-ver`.
- `src/40-interface.js`: `buildMenu` (linhas ~47 a 55).
- `src/42-resultados.js`: começo de `buildEnd` (~71) e de `buildFalencia` (~230).
- `src/10-constantes.js`: `VERSAO`.

## Tarefas
- [ ] T1 `tests/smoke121.js` com os CA1 a CA4 (falhando).
- [ ] T2 HTML, `buildMenu`, `buildEnd` e `buildFalencia` como nas Regras.
- [ ] T3 Testes antigos: `smoke21` (o clique no `btn-falencia-rank` liga o `DEV.on` antes, ou chama o `openRank('ov-falencia')` direto) e `menu_fit.py` (tirar o `#btn-falencia-rank` da lista da falência, e o `#btn-end-rank` se aparecer em alguma lista); os outros (`smoke3`, `smoke85`, `smoke97`) chamam o `openRank` direto ou só olham o HTML e devem seguir verdes.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86`, `smoke98` e `menu_fit.py` contam as linhas do `#ov-ver`: ajuste os números se mudarem), `docs/RESUMO.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge.

## Testes
- Novo: `smoke121` (10 checagens).
- Mudam: `smoke21` e `menu_fit.py` (ver T3); `smoke86`, `smoke98` se a conta de linhas do `#ov-ver` mudar.
- Sem balanceamento (nada muda na partida).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Haiku, esforço médio (mecânico e localizado: esconder três botões, uma frase, a versão e dois testes antigos)
