# v7.4.3 — Cor das cadeiras

Pedido do usuário em 21/10 (texto em `docs/PROPOSTAS.md`): desde a v7.4, o jogador compra e arruma as mesas, mas a cor das cadeiras de cada mesa era escolhida sozinha (a menos usada no salão, em `salaoCor`) e não mudava mais.

## Agora
- **Balãozinho da mesa** (`buildSalao`, em `41-lojinha.js`): abaixo de "Mesa N · L lugares", a linha "Cadeiras:" com 4 bolinhas nas cores de `CHAIRS` (vermelha, azul, amarela, verde). A cor atual tem um visto e um aro (`aria-pressed`); cada bolinha tem o nome da cor no rótulo (`aria-label` e `title`), para não depender só da cor.
- **`Game.pintarMesa(i, c)`** (`16-jogo.js`): troca `c` da mesa no save, de graça. Passa por `salaoSet(l, true)`, então entra no Desfazer, a mesa continua escolhida e o salão do jogo ao fundo já mostra a cor nova. Mesa ou cor que não existe: recusa.
- Dica do editor: "toque numa para trocar a cor das cadeiras, virar mesa de 4 ou vender".
- `CHAIRS` entra em `window.__lcc` (para os testes).

## Regra
A cor da camisa dos grupos continua sorteada entre as cores das mesas e as 4 cores (`Game` em `16-jogo.js`), então pintar várias mesas da mesma cor deixa essa cor um pouco mais comum na fila. Sem mudança de preço ou equilíbrio.

## Testes
- `smoke13`: 5 testes novos (4 bolinhas com a atual marcada, troca de graça no save e no salão do jogo com a mesa escolhida, a cor nova marcada, recusa de cor ou mesa inválida, Desfazer volta a cor).
- `python3 shot_v7_4_3.py`: capturas em `capturas/v7.4.3` (balão em cima e embaixo, antes e depois de trocar, em 960×600 e 740×360).
