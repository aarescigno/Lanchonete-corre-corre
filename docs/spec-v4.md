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

## Bandeja (lojinha, R$ 220)
- Sem a bandeja: 1 item por mão (2 no total), como antes.
- Com a bandeja, uma mão leva 2 pratos **ou** 3 bebidas (cafezinho e suco podem ir juntos) **ou** 1 item qualquer. A outra mão leva 1 item. Comanda e louça suja não vão empilhadas na bandeja.
- `handLayout(itens, bandeja)` distribui os itens entre [bandeja, outra mão] ou devolve `null` se não couberem. `Waitress.canTake(tipo)` usa essa função em todas as ações.
- No HUD, o rótulo vira "BANDEJA · MÃO" e os itens da bandeja aparecem lado a lado. A Bia aparece com uma bandeja de inox na mão esquerda.

## Balanceamento (bot, 80 rodadas por dia)
- Os sucos dão trabalho extra, e o bot passou a perder mais clientes nos dias 4 a 7. As metas foram recalibradas:
  - dia 4: expert de 1600 para 1500;
  - dia 5: meta de 1100 para 1050, expert de 1650 para 1550;
  - dia 6: meta de 1250 para 1150, expert de 1850 para 1700;
  - dia 7: meta de 1300 para 1200, expert de 2100 para 1900.
- Metas batidas pelo bot: dias 1 a 3, 80/80; dia 4, 74; dia 5, 79; dia 6, 73; dia 7, 70.
- O bot de teste (`tests/bot.js`) busca de uma vez todos os sucos que cabem nas mãos e os entrega. `tests/botpage.js` é gerado a partir dele.
- O save continua `lcc2_save` e o upgrade novo entra em `save.up.bandeja`.
