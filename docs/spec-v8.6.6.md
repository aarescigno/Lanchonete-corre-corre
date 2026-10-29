# v8.6.6 — A decoração no Ambiente do Gurugol

Pedido do usuário em 29/10: rever o rebalanceamento das notas (v8.6.4, teto por ponto) depois do merge da decoração da Garagem (v8.6.5), que tinha ficado só visual. A proposta já aceita (etapa 4b do `docs/PLANO.md`, item "Decoração no Ambiente do Gurugol") entra com os valores sugeridos. Queixa de origem: o Ambiente "parece um número aleatório ou fixo", porque quase todo mundo tem as mesmas coisas.

## O que mudou
- **Ambiente** (`AVAL.amb`, na escala do serviço, de 1 a 5, antes do teto e do humor):
  - a base cai de 3 para **2**: a garagem pelada fica "meio sem graça";
  - cada planta à mostra (espada, muda na lata, samambaia) soma **+0,3**, até 0,9;
  - cada peça do cantinho da Rosa (foto, quadro de giz, plaquinha) soma **+0,25**, até 0,75;
  - a **toalha xadrez** soma **+0,5** só para o grupo que senta numa mesa com ela, como o bônus da cadeira da cor. `g.table` ainda existe na hora de `avaliar`, tanto ao pagar quanto ao sair bravo da mesa;
  - enfeite guardado não conta (`decorOn`).
- Sem enfeite nenhum, a TV, o som, a torneira, o ventilador e o cafezinho levam o ambiente só até 4,5. Para chegar ao teto de 3 ★ da Garagem, é preciso decorar.
- **Elogios:** com o ambiente em 4 ou mais, 35% dos elogios citam um enfeite que o grupo viu (`AVAL_DECOR`: "Que samambaia bonita!", "A toalha xadrez dá um charme!", "Que foto bonita na parede!"...).
- **Textos:** os cartões da aba Decoração dizem que o enfeite melhora o ambiente no Gurugol; o Como jogar cita a decoração no ambiente.
- **Saves:** as avaliações guardadas continuam como estão; só as novas usam a conta nova.

## Balanço (`DUMP=1 AVAL_MOV=1 node balance.js 100`)
| Bot | nota geral p50 antes (v8.6.5) | sem enfeites | com tudo (`DECOR=tudo`) | dias com a geral ≥ 3,0 (com tudo) |
|---|---|---|---|---|
| afiado com equipe | 2,83 | 2,74 | 2,91 | 27% |
| sem equipe | 2,41* | 2,41 | 2,62 | 0% |

\* Sem equipe, medido na v8.6.4 (~2,5, com 150 rodadas).

No 1º dia (sem TV, som nem ventilador), o Ambiente do afiado vai de 1,7 ★ (garagem pelada) a 2,8 ★ com tudo. No dia 7, de 2,7 a 3,15. Toda a decoração custa R$ 103 mais R$ 12 por mesa. O movimento quase não muda: o afiado sem enfeites cai de +8% para +7%.

## Testes
- `smoke30`: os pesos, a garagem pelada, plantas, cantinho da Rosa, enfeite guardado, a toalha só na mesa dela, quem sai bravo e os elogios.
- `balance.js`: `DECOR=tudo`.
- `run_all.sh`: todos passam. O `smoke3` falha às vezes no Turno sem fim (1 a 2 em 12 rodadas); falha igual na v8.6.5, sem estas mudanças.
