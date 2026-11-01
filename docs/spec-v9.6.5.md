# v9.6.5 — As marmitas e o prato mais antigo (etapa 3d-2)

Retornos do Renan de 01/11 (`docs/PROPOSTAS.md`).

## O que mudou
1. **Fileira própria das marmitas na janela de PRONTOS** (`PONTOS.marmJanela`: Garagem 2, área industrial 3, Avenida 3; `MARMJ_SLOTS` em y 242, x 800, 826 e 852; `Kitchen.marmJ`): a marmita pronta nunca mais ocupa vaga de prato (`PLATE_SLOTS` ficou só para pratos). Marmita em escala 0,62 (0,7 encostava no rótulo) com o selo da Efood menor. `Kitchen.achaPronto(pid)` acha prato ou marmita; `Game.marmitas()`, `esfriar`, `Helper.marmitaAlvo`/`pegaMarmita`, o `perform` da Bia (`type:'plate'`) e o desenho usam `marmJ`.
2. **As mesas na frente no fogão** (`Kitchen.update`): o próximo pedido é o 1º ticket de prato; o de marmita só entra se (marmitas no fogão + em `marmJ`) < `marmJanela`; com só marmitas na fila e o limite cheio, a boca fica livre.
3. **Entregadores espaçados** (`buildSchedule`): dois entregadores comuns (não a encomenda) chegam com pelo menos `MARMITA.gap = 12` s de diferença; o que chegaria antes vira `tipoPequeno()`.
4. **A marmita do entregador que desistiu** (`Game.descartaMarmitas`, chamado em `leaveCommon`): no fogão sai sem custo; na janela e na prateleira vai para o lixo ("Pro lixo!", `stats.jogadas`); na mão da Dani, do Joca ou da Cami some e vai para o lixo; na mão da Bia fica sem dono com um **X vermelho** no selo (`jogar`), e um toque na lixeira joga fora (+1 lixo, sem esvaziar a lixeira). Um entregador novo do mesmo prato ainda pode ficar com ela. O fim do dia soma "· N jogada(s) fora" na linha Marmitas.
5. **Pegar o mais antigo** (`tapStation('plates')`): qualquer toque na faixa de baixo pega o prato pronto há mais tempo que não seja da Cami e não esteja na fila da Bia; a faixa de cima (y < 256) pega a marmita mais antiga (a de entregador esperando no balcão primeiro); sem marmita, vale o prato. Só pratos da Cami: "É da Cami!". A Cami também pega o mais antigo dos dela.
6. **Balanceamento**: a área industrial `metaF` 2,3 → 2,5 e `expertF` 1,6 → 1,7 (as mudanças deixaram o jogo um pouco mais fácil).

## Números medidos (`balance.js`, bot comum)
| Configuração | antes (v9.6.4) | depois |
|---|---|---|
| Garagem sem equipe, dias 3 a 7 (40 rodadas) | 70% | 70% |
| Garagem `EQUIPE=auto`, dias 3 a 7 | 99% | 100% |
| Área industrial `EQUIPE=auto`, dias 8 a 10 (80 rodadas) | 92% | 96% → **90%** com `metaF` 2,5 e `expertF` 1,7 |
| Avenida `EQUIPE=auto`, dias 8 a 10 (60 rodadas) | 88% | 87% |

## Testes
- `smoke51` (novo, 18 conferências): `marmJanela` por ponto, marmita em `marmJ` e nunca em `plates`, `marmJ` cheia deixa o fogão fazer os pratos, agenda sem 2 entregadores a menos de 12 s (40 dias), entregador que desiste (fogão, janela, prateleira, mão da Dani, mão da Bia com X e lixeira), 3 toques pegam os pratos do mais antigo ao mais novo, faixa de cima pega a marmita.
- `smoke28` (a marmita do fogão sai sem custo; marmitas em `marmJ`; o teste da chuva no dia 5 passou a 20 rodadas, limiar 8, para não oscilar), `smoke38` (metaF/expertF da área industrial; 30 agendas no teste de tipos), `bot.js` e `botpage.js` (marmJ e o X vermelho; o bot afiado esquecia a fileira nova e deixava os entregadores sem marmita: com o conserto, a chuva volta a ~2/3 e o afiado na área industrial passa 97%). Os 3 resultados de balanceamento acima são do bot comum.
- Capturas em `capturas/v9_6_5` (`tests/shot_v9_6_5.js`): a janela nos 3 pontos, pratos e marmitas cheios, sem sobreposição.

Modelo: Sonnet, esforço alto (cozinha, ajudantes, bot e desenho ao mesmo tempo).
