# v7.4.2 — Panela no fogo

Ajuste visual pedido pelo usuário em 21/10 (texto em `docs/PROPOSTAS.md`): os balões de "vendo o cardápio" e de "aguardando o preparo" eram parecidos demais.

## Antes
No estado `ordered` (pedido anotado), o balão da mesa mostrava a comanda (papel com linhas, quase igual ao cardápio aberto do estado `reading`) até o pedido chegar à cozinha; depois, o prato com um anel laranja de progresso, que ficava verde e cheio quando o prato saía.

## Agora
- **Ícone `pot`** (`drawIcon`, em `20-desenho-base.js`): panela vermelha com tampa, alças, fogo embaixo e três fios de vapor. O vapor ondula com o tempo (`extra`) e fica parado com `prefers-reduced-motion`.
- **Balão do estado `ordered`** (`drawTableOverlay`, em `22-salao-hud.js`): a panela do pedido anotado até a entrega, **sem anel**. Quando o prato do grupo está no balcão (`kitchen.plates`), um visto verde aparece no canto de cima do balão (fazia o papel do anel verde cheio).
- A comanda continua nas mãos da Bia, nos quadrinhos e no "Como jogar"; o cardápio com anel azul do estado `reading` não mudou.

Sem mudança de regra, equilíbrio ou testes (smokes 1 a 13 ok).
