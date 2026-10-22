# v7.7 — Espera da Garagem: de pé e água da torneira

Pedido do usuário em 22/10 (texto em `docs/PROPOSTAS.md`): a espera lá fora tem que ter a cara do nível do salão. Só o nível 1 (Garagem) existe, então só ele muda agora; os outros níveis ficam guardados no `docs/PLANO.md` ("Espera lá fora por nível", nas Ideias guardadas, e nas etapas 3 e 4). Decisões do usuário: a torneira continua melhoria, mais barata (R$ 80), com R$ 100 de volta para quem já tinha a máquina; o pedido é no balão (sem tablet), e a Bia enche na hora.

## Espera por nível (`PONTOS.assento` e `PONTOS.bebida`)
| Nível | Assento | Bebida | Nesta versão |
|---|---|---|---|
| 1, Garagem | de pé | copo d'água da torneira | **feito** |
| 2, área industrial | cadeirinhas de plástico ou banquinhos de madeira | jarra de suco | guardado (etapa 3) |
| 3, Avenida Brasil | sofás | águas saborizadas | guardado (etapa 3) |
| 4, Terraço Suíça | poltronas individuais | coquetelaria | guardado (etapa 4) |

- **De pé (`assento:'pe'`):** sem bancos nem tablets. Cada lugar é uma faixa amarela tracejada pintada no concreto, com o número no chão; o grupo fica em pé nela (e, depois da água, com o copo na mão). O vaso saiu do banquinho de plástico (que fica para o nível 2) e foi para o chão. O toldo e o muro da casa ficam.
- O código guarda o banco de ripas e o tablet da v7.5 para os pontos com assento (o tablet só aparece se a bebida tem preparo).

## Água da torneira (melhoria `maquina`, no lugar da Máquina de suco)
- **R$ 80** (era R$ 180). Na calçada, no mesmo lugar da máquina: um caixote de feira com copos americanos de boca para baixo, o cano saindo do chão, a torneira e o ralo.
- `BEBIDA_ESPERA.agua = { preco:0, ingred:0, prep:0, take:1 }`: 2,5 s depois de chegar ao lugar (`MAQUINA.pede`), o grupo pede 1 copo por pessoa no balão ("Uma água, por favor!"), que já sai pronto (bolinha verde com quantos copos pediram, sem anel de preparo). A Bia toca na torneira, leva **1 s** enchendo (o fio d'água e o copo aparecem embaixo da bica; parado com `prefers-reduced-motion`) e pega os copos que couberem, como na v7.5.
- **Entrega:** +1 coração, quem bebe perde a paciência 40% mais devagar (como antes). **De graça:** não entra na conta e não custa ingrediente; jogar o copo na lixeira não custa nada.
- Ícone novo `agua` (copo americano com água) nas mãos, no balão, no quadrinho da fila (com uma gotinha no lugar do tablet) e na lojinha; desenho `drawTorneira`.
- Dani: a tarefa virou "Levar a água da espera" (mesmo id `suco`).
- Fim do dia: linha "Água na espera" com os copos ("de graça").
- Como jogar: a dica da máquina virou a da torneira.

## Save antigo
- Quem tinha a Máquina de suco (ou a Água saborizada, ou a Jukebox) fica com a torneira e recebe **R$ 100** (`UPGRADES.devolve`), uma vez, numa linha do Caixa "Devolução da máquina de suco" (`devK:'maquina'`). O save novo guarda `torneira:true`, e o save convertido é gravado na hora (como o salão da v7.4).

## Máquina de suco (guardada para o nível 2)
`BEBIDA_ESPERA.suco` tem os valores da v7.5 (R$ 12 na conta, ingrediente R$ 5, preparo 3 s, pegar 0,5 s, tablet). Nenhum ponto usa ainda; é a base da jarra de suco da área industrial. O `smoke14` testa os dois, pondo o suco no ponto.

## Equilíbrio
60 rodadas por dia, dias 3 a 7, bot simples sem equipe (`balance.js`):

| | v7.6 | v7.7 |
|---|---|---|
| lucro médio por dia | R$ 767 | R$ 718 |
| metas batidas | 275/300 (92%) | 266/300 (89%) |
| copos na espera por dia | 7 | 7 |

- A diferença (~R$ 50/dia) é o suco que deixou de entrar na conta (~7 copos × R$ 7 líquidos). Continua acima do alvo, de propósito (a Garagem rende a mais).
- `carreira.js` (20): dinheiro na lojinha do dia 5 R$ 1.519 (v7.6: R$ 1.614) e do dia 7 R$ 2.964 (R$ 3.252); a mudança de R$ 800 até o dia 5 continua folgada.

## Testes
- `smoke14` (63): Garagem de pé com água; preço, devolução (uma vez, também da Água saborizada antiga), pedido pronto na hora, 1 s para encher (Bia e Dani), entrega de graça com coração e paciência, lixeira sem custo, render (de pé, torneira enchendo, copo na mão) e o fim do dia; a máquina de suco da v7.5 com o suco posto no ponto.
- `smoke15`: o save de teste é da v7.7 (`torneira:true`), para o save de verdade não ser regravado.
- Capturas `shot_v7_7.py` (`capturas/v7.7`, 960×600 e 740×360): a calçada com 4 grupos de pé, a Bia enchendo na torneira, e a lojinha.
