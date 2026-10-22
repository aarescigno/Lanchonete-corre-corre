# v8.1.2 — Espera na ordem certa

Ajuste pedido pelo usuário em 22/10 (retorno da beta tester; texto em `docs/PROPOSTAS.md`): na espera lá fora, a fila crescia para baixo.

## Antes
`QUEUE.ys` (em `10-constantes.js`) ia de cima para baixo: o 1º da fila (`slot` 0) ficava no lugar 1, no alto da calçada, e quem chegava depois ia para baixo dele. Quem esperava há mais tempo ficava em cima.

## Agora
- `QUEUE.ys` vai de baixo para cima (`[436, 350, 264, 178]`): o 1º da fila fica no lugar 1, embaixo (perto da torneira), e quem chega depois fica acima dele, do lado da rua por onde chega. Os números pintados no chão acompanham (o 1 embaixo, o 4 no alto).
- Quando alguém sai da espera, quem estava acima desce um lugar (o `reslot` não mudou). O VIP continua furando a fila: vai para o lugar 1 (ou logo acima dos outros VIPs).
- `salaoCaminho` confere o caminho até as mesas a partir do lugar 1, que agora é o de baixo.

Sem mudança de regra nem de equilíbrio (`balance.js` nos dias 1 a 3 igual, dentro do ruído). No `smoke16.js`, o "dia 2 jogado pelo bot" pedia 8 pratos e falhava ~18% das vezes já na v8.1.1 (o bot às vezes perde 1 ou 2 grupos); agora pede 5.
