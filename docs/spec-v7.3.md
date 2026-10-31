# v7.3 — Bia mais ágil e selos da fila

Etapa 1c do `docs/PLANO.md`: retorno do beta-tester Renan (18/10): "mais velocidade para a Bia e/ou alguma forma de check para os locais que já estão na fila". O 3º pedido (salão por lugares) ficou só como proposta, para decidir depois (etapa 1d do plano).

Decisões do usuário (21/10):
- velocidade: aumentar a base **e** criar um 2º nível dos tênis, com cara de tênis de corrida;
- marca: o **número da vez** (não um ✓). Um 2º toque no mesmo lugar **entra de novo na fila** (dá para pedir 2 coisas na mesma mesa), e cancelar só pelo quadrinho da fila no HUD;
- valores: base 300, Tênis novos +10%, Tênis de corrida +20% por R$ 350, com cartão próprio na lojinha; mesmo lugar 2 vezes mostra todos os números; selo com pulinho ao surgir;
- metas: **mantidas**, mesmo com o jogo um pouco mais folgado (ver item 4).

## 1. Velocidade da Bia
- `BIA_SPEED = { base:300, tenis:1.1, corrida:1.2 }` (`10-constantes.js`). Antes: 260 e +10%.
- `Waitress.speed`: 300 sem tênis, 330 com os Tênis novos, 360 com os Tênis de corrida. Os +20% substituem os +10% (não somam).

## 2. Tênis de corrida (melhoria nova)
- `UPGRADES`: `{ id:'corrida', name:'Tênis de corrida', cost:350, req:'tenis' }`. `Game.buy` recusa a compra sem os Tênis novos (`req`) e continua valendo 1 melhoria por visita.
- **Lojinha:** com 7 cartões a aba Melhorias não cabia na tela (o rodapé e o "Começar o dia" sumiam). Por isso o cartão dos Tênis de corrida só aparece depois dos Tênis novos, **no lugar deles**, e a grade continua com 6. A descrição dos Tênis novos avisa: "Depois, libera os Tênis de corrida".
- **Ícone:** tênis baixo e esticado, laranja, com faixa branca, solado alto em gomos, cadarço e linhas de velocidade atrás (sem logo nem traço de marca conhecida).
- No fim da carreira, "Melhorias compradas" passa a contar de 7.

## 3. Selos da fila
- `Waitress.enqueue` guarda `a.t0` (hora em que a ação entrou, para o pulinho). `Waitress.marks()` devolve lugar → vezes, ex.: `{ 'table:1':[1,4], coffee:[2], 'plate:77':[6] }` (usado pelos testes).
- **Desenho** (`22-salao-hud.js`, `drawFilaMarcas`, chamado no `render` na camada de cima, fora do menu): etiqueta arredondada com o ordinal **"1º", "2º"...**, para não confundir com a plaquinha branca do número da mesa. A ação atual (1º) é mostarda; as outras, escuras com número branco.
  - mesa: à esquerda do tampo, empilhando para baixo quando a mesa está mais de uma vez na fila;
  - prato pronto: em cima do prato (some quando a Bia pega);
  - estações (pedidos, cafezinho, sucos, pia, lixeira, água): no canto de cima, para a direita.
- **Pulinho:** a etiqueta cresce ~45% e volta em 0,3 s ao surgir; com `prefers-reduced-motion`, aparece parada.
- **HUD:** cada quadrinho cheio da fila ganha a mesma etiqueta (menor) no canto, ligando a tarefa ao selo no salão.
- **Toques:** sem mudança de regra (mesa e estação podem repetir; prato pronto não repete); cancelar continua sendo tocar no quadrinho. O "Como jogar" agora explica os números e que dá para pedir 2 coisas na mesma mesa.

## 4. Equilíbrio (metas mantidas)
`balance.js 60` (dias 3 a 7, metas batidas):

| | v7.2 (260) | v7.3 (300) | v7.3 com metas +12% (não adotado) |
|---|---|---|---|
| Sem equipe (alvo 40–70%) | ~62% | ~74% (93, 80, 60, 80, 57) | ~64% |
| `EQUIPE=auto` (alvo 85–95%) | ~96% | ~98% | ~98% |
| `BOT=afiado` (0 perdidos em ≥ 80%) | 0,0–0,2 perdidos | 0 perdidos em todos os dias | — |

`carreira.js 30`: dinheiro na lojinha do dia 5 R$ 1.644 (v7.2: R$ 1.313). O usuário preferiu manter as metas: a folga a mais é o alívio que o Renan pediu, e os Tênis de corrida (R$ 350) são um gasto novo. `balance.js` ganhou `METAS='{"3":420}'` para testar metas sem mexer em `src/`; o `carreira.js` compra os Tênis de corrida por último.

## 5. Testes
- `smoke12` (21 verificações): velocidade (300, 330, 360), compra dos Tênis de corrida (pede os Tênis novos, 1 por visita), cartão que troca na lojinha e grade com 6, selos (mesa 2 vezes, renumeração ao cancelar pelo quadrinho, prato que não repete, selo que some quando a Bia faz a ação) e render com e sem `prefers-reduced-motion`.
- `smoke5`: agora são 7 melhorias.
- `shot_v7_3.py`: capturas em `capturas/v7.3` (salão com selos, logo depois do pulinho e parado, e a lojinha com os Tênis de corrida), em 960×600 e 740×360.

## Partes alteradas
`10-constantes.js` (`BIA_SPEED`, `UPGRADES`, `VERSAO`), `14-bia.js` (`speed`, `enqueue`, `marks`), `16-jogo.js` (`buy`), `22-salao-hud.js` (`drawFilaSelo`, `filaPos`, `drawFilaMarcas`, quadrinhos da fila), `23-render.js`, `40-interface.js` (Como jogar), `41-lojinha.js` (ícone e cartões), `02-telas.html` (selo e painel Versões), `43-telas.js` (`__lcc`).
