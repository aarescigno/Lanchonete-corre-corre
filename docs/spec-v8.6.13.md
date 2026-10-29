# v8.6.13 — Rodada de balanceamento do cardápio

Etapa 2c-r3d (`docs/PLANO.md`), depois da revisão da 2c-r3a (v8.6.9), 2c-r3c (v8.6.11) e 2c-r3b (v8.6.12).

## Revisão da 2c-r3a, b e c
- **Os cursos derrubavam o lucro.** Cada curso abre uma categoria nova e dilui o PF (R$ 25) entre salgados de R$ 6 a 11: com `EQUIPE=auto`, `CURSOS=0` dava 95,5% das metas nos dias 3 a 7 e R$ 217 a 293 de lucro; `CURSOS=todos`, 85,2% e R$ 178 a 277. Pagar um curso deixava o dia pior: armadilha para o jogador. Corrigido abaixo.
- **A nota mínima (2,9 na Garagem, 95% do teto) só saía com tudo comprado.** O bot afiado com os 4 cursos básicos e toda a decoração fica em ~2,9 de média no dia (p10 2,5); sem decoração e com os cursos que compra na carreira, 2,4 a 2,6 até o dia 14. Corrigido abaixo.
- **Smoke 25 instável** desde a v8.6.11: o estudante sorteado às vezes é vegetariano e o Cardápio vira 1. O teste agora fixa `gr.semVeg=false`.
- O resto confere: todos os smokes passam, `pedePrato` respeita os gostos, o vegetariano e o `dep`; o desenho dos 22 pratos não quebra. O smoke 3 tem uma falha ocasional (~10%, "não coube: −1 estrela" no Turno sem fim) que já existia antes e não é desta etapa.
- Fica como observação: o bot da carreira compra móveis antes dos cursos (os cursos saem dos dias 8 a 14); com `MOVEIS=0`, sai dos dias 4 a 11.

## O que mudou
- **Salgado se pede de dois** (`MAIS.salgado = 0.8`, `12-clientes.js`): quem pede um prato que não é do tipo PF pede o 2º item em 80% das vezes (ou na chance do tipo, se for maior); quem pede PF continua na chance do tipo. A cozinha leva o tempo do 2º item como antes (`MAIS.cozinha`). Com isso, os cursos ficam neutros no lucro (`CURSOS=todos` 93,5% contra 95,8% com `CURSOS=0`, mesma faixa de lucro) e somam na Diversidade do Gurugol.
- **Metas** do dia 6 de 150 para 140 e do dia 7 de 180 para 170 (o que sobrou da 2c-r3a).
- **Nota mínima** para sair de um ponto: `AVAL.minimo` de 0,95 para 0,9 do teto (Garagem 2,7; área industrial 3,4; Avenida Brasil 3,9; Terraço 4,5). Na carreira com o bot afiado que faz os cursos (`MOVEIS=0`), a nota geral passa de 2,7 no dia 10 e chega a 2,9 no dia 14, sem decoração.
- Como jogar: "alguns pedem um 2º item, e quem pede salgado quase sempre pede dois". Painel Versões e `VERSAO` na v8.6.13.
- Testado e descartado: salgado comido mais rápido (a mesa gira antes) mexia pouco no lucro.

## Calibração (`balance.js 100`, % das metas batidas nos dias 3 a 7)
| | antes dos cursos (v8.6.8) | v8.6.12 (base desta etapa) | v8.6.13 |
|---|---|---|---|
| sem equipe | 63,7% | ~60% (49 a 60 entre rodadas) | ~59 a 62% |
| `EQUIPE=auto` | 93,7% | ~87% | ~91 a 94% |
| `BOT=afiado EQUIPE=auto` | 78% | ~70% | ~72 a 77% |

Por dia, com equipe (v8.6.13): dia 3 94%, 4 96%, 5 98%, 6 90%, 7 92%. Sem equipe o dia 7 continua o mais difícil (~40%), como antes dos cursos.

Gurugol (`AVAL_MOV=1`): com equipe e os cursos do bot, a nota do dia vai de 2,4 (dias 1 e 2, só PF e coxinha) a ~2,8 (dias 6 e 7). Carreira com o bot afiado (`carreira.js`, 14 dias): chega a R$ 800 no dia mediano 9 (com móveis) ou 6 (`MOVEIS=0`); a nota geral fica em 2,5 a 2,6 comprando móveis primeiro e chega a 2,7 no dia 10 fazendo os cursos.
