# v8.6.7 — As regras da nota do Gurugol (etapa 2c-r1)

Primeira sessão do rebalanceamento do Gurugol (`docs/PLANO.md`, etapa 2c-r), com as decisões da entrevista de 29/10.

## O que mudou
- **Cada um avalia só o que viveu.** A avaliação guarda `null` no critério que o cliente não viu (`normAval` mantém o `null`; o save antigo, sem `null`, continua valendo). Em `Game.avaliar`:
  - desistiu na fila (ou a caminho da mesa): só a **Espera**;
  - saiu bravo antes do pedido: Espera, **Agilidade** e **Ambiente**;
  - saiu bravo depois do pedido, sem comer: mais o **Cardápio**;
  - quem já estava comendo ou esperando a conta, e quem pagou: os 5;
  - entregador (marmita): Espera, Agilidade e **Comida**; se saiu bravo sem a marmita, só Espera e Agilidade.
- **Médias.** `avalMedias` devolve a média de cada critério só de quem o viu, a contagem `cnt` e a nota (média das médias; critério que ninguém viu fica `null` e não entra). `avalNota` de uma avaliação também ignora o `null`. A caixa do fim do dia mostra `Critério (n)` com o número de avaliações de cada critério; o Caixa e o `title` do fim do dia também.
- **Humor proporcional ao teto.** `AVAL.humor` agora é fração da faixa do ponto (`teto − 1`): `var` 0,15, `extra` 0,3 a 0,6, `folga` 0,4. Na Garagem dá os mesmos valores de antes (±0,3, +0,6 a +1,2, folga 0,8); no Terraço a folga passa de 5 e a nota fica limitada a 5.
- **Bônus da Agilidade virou chance de encantar.** A cor certa, a corrente e o caprichado deixam de somar na Agilidade (que fica só pelos corações): cada um soma 0,1 na chance de encantar (`AVAL.bonus`), sobre a base de 0,15 (`humor.encanta`, era 0,2).
- **Faixa bronze** (`notaFaixa`): de 3,0 a 3,9, com gradiente de bronze (`.guru-num.bronze`); prata, ouro e diamante ficam como estavam.
- **Nota mínima** para sair de um ponto: `AVAL.minimo` = 95% do teto, arredondada para cima em uma casa (`avalMinimo`): Garagem 2,9, área industrial 3,6, Avenida Brasil 4,1, Terraço 4,8. Ainda não é usada no jogo (entra na etapa 3).

## Calibração (`balance.js`, `DUMP=1 AVAL_MOV=1 DECOR=tudo`, 20 rodadas, uma só)
- `EQUIPE=auto`, dias 1 a 7: nota do dia 2,85 a 3,02 (p10 ~2,5 e p90 ~3,3), antes 2,65 a 2,84. A Comida subiu de ~2,4 para ~2,9 porque quem saiu bravo sem comer não entra mais na média dela.
- `BOT=afiado EQUIPE=auto`, dias 1 a 4: 2,84 a 3,02 (perto dos 2,9 de mínimo). Sem equipe, dias 1, 3 e 5: 2,51 a 2,88.
- O dinheiro não muda (a nota só mexe no movimento quando `AVAL_MOV=1`).

## Testes
- Smoke 25: critérios `null` por situação (fila, antes do pedido, depois do pedido, comeu, entregador com e sem marmita), médias com contagem, humor no Terraço e na Avenida Brasil, chance de encantar com os bônus, faixa bronze e `avalMinimo`.
