# v8.2.3 — Largar o dia tem preço

Pedido do usuário em 22/10, depois da v8.2.2 (texto em `docs/PROPOSTAS.md`): "Quando a pessoa encerrar o dia no meio e tiver clientes na porta ou na mesa, a pessoa deve ser penalizada como se as pessoas tivessem desistido por zerar corações."

## Antes (v8.2.2)
Reiniciar ou Menu na pausa, no meio de um dia da carreira, não pagavam nem ganhavam nada: dava para largar um dia que ia mal sem custo.

## Agora
- **Multa por grupo.** Ao largar o dia (Reiniciar ou Menu na pausa), cada grupo que está na espera ou no salão (`game.bravosSeSair`: os grupos do dia que não estão indo embora) vai embora bravo, como se tivesse zerado os corações, e paga a multa de quem sai bravo: `MULTA` (R$ 30, nova constante em `10-constantes.js`, a mesma do `angryLeave`) mais `VIP.angry` (R$ 30) se for VIP. Sai direto do dinheiro acumulado (`Game.encerrar()`), sem deixar negativo.
- Sem ninguém na espera nem nas mesas (logo no começo, por exemplo), largar continua sem custo. Quem já está indo embora (pagou, ou viu a espera cheia) não conta.
- O resto da v8.2.2 continua: o dia largado não rende nada, não paga folha nem contas e não conta para estrelas, recorde ou próximo dia.
- **Avisos:** a pausa diz quantos grupos vão embora bravos e a multa ("E os 3 grupos na espera e nas mesas vão embora bravos: multa de R$ 120."); depois de Reiniciar, a introdução do dia conta a multa e o dinheiro de agora.
- **Caixa:** linha "Dia N largado no meio: X grupos foram embora bravos: −R$ Y" (como a da devolução, com o saldo), marcada com `int` (grupos) e `mul` (multa), mantida pelo `normCaixa`; "Para onde foi" ganha a parte "Dias largados no meio". A linha não conta como dia jogado.
- O fim do dia com o tempo esgotado não muda: quem ainda está lá vai embora sem multa, como antes. Turno sem fim e Missão zero também não mudam.

## Testes
- `tests/smoke19.js` (38 checagens; 16 novas): multa normal e de VIP, quem conta e quem não conta, aviso na pausa, desconto, linha do caixa (e no save, no resumo e no "para onde foi"), introdução, sem ninguém sem custo, Menu na pausa até zerar, tempo esgotado sem multa, turno sem fim.
