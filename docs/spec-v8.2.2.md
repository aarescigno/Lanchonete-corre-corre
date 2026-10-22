# v8.2.2 — Só o dia completo rende

Pedido do usuário em 22/10, logo depois da v8.2.1 (texto em `docs/PROPOSTAS.md`): "Cobrar o salário ao fim do dia só e, quando a pessoa interromper no meio de um dia, não ganha nada, só dias completos rendem". Troca a regra da v8.2.1 (que guardava o que a parte jogada rendia, com contas e folha proporcionais).

## Antes (v8.2.1)
- A folha e a divulgação saíam do dinheiro acumulado ao abrir o dia (`payDay`).
- Reiniciar ou Menu na pausa fechavam as contas da parte jogada (`Game.interromper()`), com linha "interrompido" no caixa.

## Agora
- **Folha e divulgação no fim do dia.** Ao abrir, o `payDay` só reserva: confere se o dinheiro paga a folha e a divulgação (o que não couber fica de fora, na mesma ordem da v8.1) e guarda `paid` e `paidDiv`, sem tirar nada do dinheiro. No `finishDay`, o dinheiro acumulado recebe o lucro do dia inteiro: faturamento − ingredientes − contas − folha − divulgação (o conserto na hora já saiu). O dinheiro não fica negativo, como antes. No turno sem fim, igual (`finishEndless`).
- **Dia interrompido não conta.** Reiniciar ou Menu na pausa não pagam nem ganham nada: o dinheiro fica como estava ao abrir o dia. Saíram `interromper()`, `parcial`, a linha "interrompido" do caixa e o aviso na introdução. A pausa diz: "Se reiniciar ou sair, o dia não conta: só dias completos rendem. A folha e as contas só são pagas no fim do dia."
- **Conserto na hora (v8):** continua saindo na hora e não volta se o dia for interrompido (o equipamento continua novo). Ele só usa o que sobra além da folha e da divulgação do dia, que estão reservadas ("Falta dinheiro!" se não sobrar).
- Para um dia completo, o resultado é o mesmo de antes (só muda quando o dinheiro sai). A lojinha (livre e reservado da v8.1) não muda; a linha de baixo diz que folha, contas e ingredientes são pagos no fim do dia, que só rende completo.
- Fim do dia sem a meta: a mensagem continua lembrando que o que se ganhou fica, mesmo repetindo o dia.
- Missão zero (v8.2): igual (o treino usa um save de mentira).

## Testes
- `tests/smoke19.js` refeito (22 checagens): nada sai ao abrir; reiniciar e Menu no meio não mudam dinheiro, caixa, estrelas nem recorde; conserto pago fica pago; dia completo paga a folha no fim; prejuízo para em R$ 0; turno sem fim; Missão zero.
- `smoke6`, `smoke9` e `smoke16` passam a esperar a folha no fim do dia (e o conserto só com o que sobra além dela).
- `carreira.js`: "depois da folha" passa a ser o dinheiro menos a folha e a divulgação reservadas.
