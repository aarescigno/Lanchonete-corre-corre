# v8.6.8 — Prato quente

Etapa 2c-r, sessão 2c-r2 (`docs/PLANO.md`). Feita antes da 2c-r1 (v8.6.7, as regras da nota), porque não depende dela: só mexe na nota da Comida (`g.pratoQ`).

## O que mudou
- **`PRATO`** (`10-constantes.js`): `quente` 8 s, `perde` 1,5, `rampa` 20 s, `friaDe` 0,5. `pratoPerde(age)` dá a perda de nota (0 até 8 s no balcão, até 1,5 em mais 20 s) e `pratoVapor(age)` o que resta de vapor (1 → 0).
- **Entrega** (`14-bia.js`): ao pegar o prato no balcão, a nota `q` cai pela perda (mínimo 1) e a mão leva `fria` (perda ≥ 0,5); ao servir, o grupo guarda `fria`. O caprichado (★) continua dando os bônus de pontos, mas a nota da Comida cai se esfriou; o caprichado entregue quente continua 5.
- **Comentário** (`avalComentario`, `fria`): se a pior nota é a da comida e o prato veio frio, vale "Comida meio fria.".
- **Vapor** (`21-cenario.js`): 3 fiapos sobre o prato no balcão, que encolhem e sumem conforme `pratoVapor`; parados com `prefers-reduced-motion`.
- O esfriar conta só o tempo no balcão (a mão da Bia não esfria).
- **Teste** (smoke 25): perda e vapor por tempo, caprichado quente = 5, prato esfriado de vez perde 1,5 e vem `fria`, comentário.

## Calibração (`balance.js 80`, dias 1 a 7)
| | antes | depois |
|---|---|---|
| afiado com equipe: nota do dia / Comida / dias passados | 2,75 / 2,71 / 95% | 2,74 / 2,61 / 93% |
| `EQUIPE=auto`: nota / Comida / passados | 2,69 / 2,59 / 96% | 2,69 / 2,58 / 94% |
| sem equipe: nota / Comida / passados | 2,41 / 2,13 / 72% | 2,40 / 2,12 / 75% |

O efeito é pequeno de propósito: o bot quase não deixa prato esperando (a nota geral cai ~0,01). Quem demora a pegar o prato sente. Os números de "passados" variam entre rodadas (±2 pontos), sem relação com a mudança.
