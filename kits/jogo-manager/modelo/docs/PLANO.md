# Plano do jogo (uma etapa por sessão)

Origem: conversa de planejamento com o usuário em {{DATA}}. Os retornos de jogadores e o destino de cada ideia estão em `docs/PROPOSTAS.md`.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com as linhas; leia só a etapa da vez com `offset` e `limit`. As etapas prontas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina igual: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no branch padrão.
- Para começar, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (ver `CLAUDE.md`):** cada etapa termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as decisões em aberto com o usuário, escreve aqui os valores, fórmulas, textos e testes decididos, apaga as opções descartadas e troca a linha **Modelo:** pela de execução.
- **Uma etapa planejada tem:** objetivo em uma frase; regras e fórmulas com os números (que entram no `CFG`); textos da interface, palavra por palavra; partes de `src/` e funções que mudam; formato novo do estado (e a migração, se o `SAVE_V` sobe); o smoke novo e o que ele confere; o alvo do `lote.js` e o que fazer se ficar fora; a linha **Modelo:**.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `python3 ferramentas/arquiva.py docs/PLANO.md docs/PLANO-FEITO.md "## Etapa N"` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 1 | Conceito e núcleo da simulação | v0.2 | a planejar |
| 2 | Decisões do jogador (o primeiro laço completo) | v0.3 | a planejar |
| 3 | Economia e progressão entre temporadas | v0.4 | a planejar |

## Etapa 1 — Conceito e núcleo da simulação (v0.2)
Trocar o exemplo do kit (liga com rivais) pelo núcleo do jogo de verdade. Decidir com o usuário, nesta ordem:
- **Tema e fantasia do jogador:** o que ele gerencia, qual é o papel dele, qual o tom.
- **Entidades e atributos:** quem existe no mundo (pessoas, equipes, empresas, produtos…), com quais atributos e faixas de valor.
- **Ciclo do tempo:** o que é um turno (dia, semana, rodada), o que acontece em cada um e o que fecha uma temporada.
- **O resultado de cada turno:** a fórmula (atributos + sorte → resultado) e o peso da sorte.
- **O que o jogador vê:** as telas e as tabelas de cada uma (colunas e ordem).
- **Testes e alvo:** o que o smoke2 confere e as faixas do `lote.js`.

Modelo: planejar com o Opus antes (esforço alto: é a decisão de design que define o jogo).

## Etapa 2 — Decisões do jogador (v0.3)
O primeiro laço "decidir → simular → ver o resultado": escalar, treinar, contratar, definir preço ou tática (o que couber no tema). Cada decisão com o custo, o efeito na fórmula e o texto do botão. O `lote.js` ganha uma `politica` que decide (um jogador razoável), e a faixa de dificuldade é medida com e sem ela.

Modelo: planejar com o Opus antes.

## Etapa 3 — Economia e progressão (v0.4)
Receitas, custos, metas por temporada, o que acontece se o caixa fica negativo e o que muda de uma temporada para a outra (evolução, saída e chegada de membros, subir de divisão ou de nível). Alvos do `lote.js` em 3 temporadas (`TEMPORADAS=3`).

Modelo: planejar com o Opus antes.

## Ideias guardadas (sem etapa ainda)
- Notícias e eventos aleatórios entre as rodadas (com a sorte do jogo, nunca `Math.random`).
- Gráficos de evolução (caixa, desempenho) no fim da temporada.
- Exportar e importar o save como texto.
