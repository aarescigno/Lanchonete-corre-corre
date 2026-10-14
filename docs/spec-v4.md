# Lanchonete Corre-Corre — v4 (balcão de sucos e bandeja)

## Balcão de sucos
- A bancada do cafezinho foi dividida em duas metades. A da esquerda é o **CAFEZINHO**, a da direita os **SUCOS** (suqueira de laranja, laranjas e copos prontos). As duas usam o mesmo ponto de parada da Bia (`STATIONS.coffee` e `STATIONS.juice`).
- Alguns grupos pedem suco junto com a comida:
  - campo `juice` em `DAYS`, a probabilidade por grupo;
  - dias 1 e 2: 0; dias 3 a 7 e Turno sem fim: 0,3;
  - cada grupo que pede quer de 1 copo até o número de pessoas (`grp.juiceWant`).
- O pedido aparece quando a comanda é anotada (`juiceOpen`: estados `ordered`, `eating` e `wantBill`), num balãozinho ao lado da mesa com copo e "×n". Ele pulsa quando o grupo já pediu a conta.
- Tocar no balcão de sucos põe a ação na fila; a Bia leva 0,6 s para servir 1 copo (`JUICE.prep`). Tocar na mesa entrega todos os copos que ela carrega e que a mesa espera, junto com a outra ação daquele toque (entregar prato, cobrar a conta etc.).
- Cada copo vale R$ 12 (`JUICE.price`, conta para a corrente como ação "juice"), e cada entrega devolve 1 coração.
- Conta paga com suco faltando: o grupo perde 1 coração antes do cálculo (mínimo 1) e aparece "Faltou o suco!".
- Estatísticas: "Sucos" no fim do dia (entregues e mesas sem suco) e "Sucos entregues" no fim do Turno sem fim.

## Mãos, comandas e bandeja (lojinha, R$ 220)
Regras definidas pelo usuário na revisão da v4:
- **Comandas:** só vão na mão sem bandeja, todas juntas, até o número de bocas da cozinha (`kitchen.slots`, hoje 3, constante `KITCHEN_SLOTS`; um upgrade futuro pode aumentar). A mão que leva comandas não leva mais nada.
- **Mão sem bandeja:** 1 item qualquer (prato, bebida ou pilha de louça suja) ou o maço de comandas.
- **Sem o upgrade:** as duas mãos seguem essa regra (1 item em cada, ou comandas numa mão e 1 item na outra).
- **Com a bandeja,** uma mão leva no máximo:
  - 1 prato + 1 bebida;
  - 2 pratos;
  - 3 bebidas (cafezinho e suco, que podem ir misturados);
  - 2 pilhas de louça suja;
  - ou qualquer quantidade menor que essas.
- Sujo e limpo nunca vão juntos na bandeja, mas a bandeja pode ir com coisas limpas enquanto a outra mão leva louça suja. Comanda nunca vai na bandeja.
- Implementação:
  - `trayOk(itens)` valida a bandeja;
  - `handLayout(itens, bandeja, maxComandas)` distribui os itens entre [bandeja ou 1ª mão, outra mão] ou devolve `null`;
  - `Waitress.layout()` e `canTake(tipo)` usam `kitchen.slots` como limite de comandas.
- No HUD, o rótulo vira "BANDEJA · MÃO" e os itens agrupados aparecem lado a lado. A Bia aparece com uma bandeja de inox na mão esquerda.

## Balanceamento (bot, 80 rodadas por dia)
- Na primeira versão da v4 (bandeja mais restrita e 1 comanda por mão), os sucos derrubaram as metas batidas nos dias 4 a 7, e as metas chegaram a ser reduzidas.
- Com as regras finais (comandas empilhadas e bandeja mais versátil), o jogo voltou a render como na v3. As **metas da v3 foram mantidas**.
- Metas batidas pelo bot: dias 1 a 3, 78 a 80 de 80; dia 4, 77; dia 5, 78; dia 6, 74; dia 7, 76.
- O bot de teste (`tests/bot.js`) busca de uma vez todos os sucos que cabem nas mãos e os entrega. `tests/botpage.js` é gerado a partir dele.
- O save continua `lcc2_save` e o upgrade novo entra em `save.up.bandeja`.
