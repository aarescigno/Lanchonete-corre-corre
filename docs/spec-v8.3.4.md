# v8.3.4 — Balão de comida pronta

Pedido do usuário em 23/10 (texto em `docs/PROPOSTAS.md`): "quando a comida estiver pronta, aparecer balão com a imagem dela no grupo que a pediu".

## Antes
Desde a v8.1.1, a mesa esperando a comida (`ordered`) ficava sem balão: só o balcão da cozinha mostrava o prato pronto, com o número da mesa. Para achar o grupo, era preciso ler o número no prato e procurar a mesa.

## Agora
- Um 4º balão nas mesas (em `drawTableOverlay`, `22-salao-hud.js`), só no estado `ordered` e só depois que o prato do grupo sai: o desenho do prato (`drawDish` com o `grp.dish`, o mesmo do balcão) dentro do balão.
  - Prato no balcão: balão **verde** (`PAL.ok`, a cor de "pronto" da espera lá fora) pulsando, como o "!" e o "$".
  - Prato na mão da Bia ou da Dani: balão **branco**, parado, até a entrega (aí o grupo passa a `eating` e o balão some).
- Enquanto o Tonhão cozinha, a mesa continua sem balão (a panelinha que saiu na v8.1.1 não volta).
- Com `prefers-reduced-motion`, o balão verde não pulsa.

Só desenho: sem mudança de regra, equilíbrio ou testes (smokes 1 a 21 ok). Capturas: `python3 tests/shot_v8_3_4.py` gera `capturas/v8.3.4` (mesa 1 com o prato no balcão, mesa 2 com o prato na mão da Bia, mesa 3 cozinhando).
