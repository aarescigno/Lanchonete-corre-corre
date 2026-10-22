# v8.1.3 — Rejogar sem perder o dinheiro

Pedido do usuário em 22/10 (texto em `docs/PROPOSTAS.md`): ao rejogar um dia, manter o dinheiro ganho. É uma solução para agora; depois, os dias devem virar uma campanha contínua (ideia guardada no `docs/PLANO.md`).

## Antes
- **Fim do dia e "Repetir dia":** já guardavam o dinheiro. O `finishDay` soma ao dinheiro acumulado o faturamento menos ingredientes e contas, passando ou não da meta, e "Repetir dia" abre a lojinha com esse dinheiro.
- **Reiniciar ou Menu na pausa, no meio do dia:** o que o dia tinha rendido sumia, e a folha e a divulgação, que saem ao abrir o dia (`payDay`), ficavam pagas à toa. Reiniciar ainda cobrava a folha uma 2ª vez.

## Agora
- `Game.interromper()` (em `16-jogo.js`), chamado por Reiniciar e por Menu na pausa, fecha as contas da parte jogada (só na carreira, com o dia aberto, `this.aberto`):
  - o faturamento menos os ingredientes fica no dinheiro acumulado;
  - as contas do dia, a folha e a divulgação valem pela fração do dia que passou (`1 − clock/time`); o resto da folha e da divulgação volta. Reiniciar logo no começo não custa nada; reiniciar com o relógio no fim conta tudo, como um fim de dia;
  - o conserto na hora (v8) já saiu e não volta;
  - o dinheiro não fica negativo (como no fim do dia).
- Não conta como dia jogado: estrelas, recorde (ranking), próximo dia liberado, desgaste e sorteio dos imprevistos ficam como estavam (o dia reiniciado tem o mesmo clima e as mesmas quebras, como antes).
- O dia reiniciado é um dia novo: paga a folha e a divulgação inteiras ao abrir.
- O caixa ganha uma linha "Dia N (interrompido)" com os valores da parte jogada (e o resumo do Caixa também), marcada com `int` (mantida pelo `normCaixa`).
- Na pausa, uma linha diz quanto vai para o dinheiro acumulado (`game.parcial`); depois de Reiniciar, a introdução do dia diz quanto o dia interrompido rendeu e o dinheiro de agora.
- No fim do dia sem a meta, a mensagem lembra que o que se ganhou fica, mesmo repetindo o dia.
- Turno sem fim: igual a antes.

## Testes
- `tests/smoke18.js` (24 checagens): reiniciar na metade, logo no começo e no fim; Menu na pausa; prejuízo com R$ 0; linha do caixa; fim do dia e "Repetir dia"; turno sem fim.
- `python3 tests/shot_v8_1_3.py`: a pausa e a introdução depois de reiniciar, no PC e no celular deitado, em `capturas/v8.1.3`.
