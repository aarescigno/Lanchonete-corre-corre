# Relatório: como funcionam as notas do Gurugol (v8.6.6)

Feito em 29/10/2026, lendo o código (`src/10-constantes.js`, `Game.avaliar` em `src/16-jogo.js`, `src/13-cozinha.js`, `src/12-clientes.js`) e rodando o bot (`tests/balance.js`, `DUMP=1 AVAL_MOV=1 EQUIPE=auto`, 15 rodadas, dias 1 a 7). O objetivo é entender o sistema e achar o que está desbalanceado. Nada foi alterado no jogo.

## 1. Visão geral

O Gurugol é o site de avaliações do jogo (só na carreira). Em cada dia, **4 grupos sorteados** (`AVAL.porDia`) avaliam ao sair, pagando ou bravos. Quem fica para o fim do dia não avalia. Cada avaliação tem **5 critérios de peso igual**. A nota da lanchonete é a **média das últimas 30 avaliações** (`AVAL.max`, cerca de 7 dias de memória) e só aparece depois das **8 primeiras** (`AVAL.min`, ou seja, a partir do dia 2). A nota mexe no **movimento do dia** (de −10% a +10%) e, no futuro, vai liberar a mudança de ponto (etapa 3 do plano; hoje não bloqueia nada).

## 2. Da ação do jogador até a estrela

```
1. serviço de cada critério (1 a 5)         ← o que o jogador fez e comprou
2. escala do ponto: 1 + (s − 1)·(teto − 1)/4 ← serviço 5 vale o teto (Garagem 3, Industrial 3,7, Avenida 4,3, Terraço 5)
3. + humor do cliente                        ← −0,3 a +0,3; 20% saem encantados (+0,6 a +1,2)
4. limite: de 1 até min(5, teto + 0,8)       ← Garagem: no máximo 3,8 por avaliação
5. nota da avaliação = média dos 5 critérios
6. nota da lanchonete = média das últimas 30 avaliações
```

Quem sai **bravo** (zerou os corações) não tem humor.

## 3. Os 5 critérios (serviço de 1 a 5, antes da escala)

| Critério | Fórmula | O que o jogador controla |
|---|---|---|
| **Espera por mesa** | 5 − 0,75 por coração perdido lá fora (o entregador usa a espera no balcão) | Sentar rápido, torneira. Cada coração devolvido (sentar, água, atendimento) compensa um perdido naquela etapa |
| **Agilidade** | 5 − 0,75 por coração perdido na mesa + bônus (cor certa +0,5, corrente +0,5, caprichado +0,5; máx. 1,5). Bravo: 1 | Atender rápido. Como o resultado é limitado a 5, o bônus só **compensa perdas** (vale até 2 corações) |
| **Qualidade da comida** | Sorteio na faixa do Tonhão: nível 0 de 2,5 a 4,5; nível 1 de 3 a 4,7; nível 2 de 3,5 a 5. O caprichado vale 5 (chance de 5%, 12% e 20%). Quem não comeu: 1 | Só a contratação do Tonhão (e a sorte do caprichado). Não depende da execução |
| **Diversidade do cardápio** | 1,5 + 0,75 por prato do cardápio. Garagem, 4 pratos: **4,5 fixo** | Nada por enquanto (só crescerá com novos pratos) |
| **Ambiente** | Base **2** + TV 0,5 + som 0,5 + torneira 0,5 + ventilador 0,5 + cafezinho servido 0,5 (só na mesa que tomou) + planta 0,3 cada + peça do cantinho da Rosa 0,25 cada + toalha xadrez 0,5 (só na mesa dela) − 1 se a lixeira estiver cheia. Couvert +1 (só nível 3 em diante) | Compras e decoração; a lixeira é a única parte "jogada" |

Escada do Ambiente na Garagem (serviço → nota na escala 1 a 3): base 2 → 1,50; +TV 2,5 → 1,75; +som 3 → 2,00; +torneira 3,5 → 2,25; +ventilador 4 → 2,50; +cafezinho 4,5 → 2,75. Os 5 equipamentos levam a 4,5; para chegar a 5 é preciso decoração (≈2 enfeites e uma toalha).

Peso de um coração perdido na escala da Garagem: −0,375 no critério, ou −0,075 na nota da avaliação.

## 4. O humor, quem sai bravo e o teto

**Humor** (`AVAL.humor`): soma-se o mesmo valor absoluto em todos os pontos. Simulei o serviço sempre perfeito (5 em tudo):

| Ponto | Teto | Média com serviço perfeito | Serviço 4 | Serviço 3 |
|---|---|---|---|---|
| Garagem | 3 | **3,15** | 2,68 | 2,18 |
| Industrial | 3,7 | 3,85 | 3,21 | 2,53 |
| Avenida Brasil | 4,3 | 4,43 | 3,65 | 2,83 |
| Terraço Suíça | 5 | **4,94** | 4,17 | 3,18 |

Nos pontos baixos a média passa do teto (os encantados puxam para cima); no Terraço fica abaixo (o limite de 5 corta o lado positivo).

**Quem sai bravo** recebe 1 em Agilidade e Comida, mas Cardápio (4,5) e Ambiente continuam valendo, e a Espera só cai se perdeu corações lá fora:

| Caso | Serviço médio | Nota na Garagem | % do teto |
|---|---|---|---|
| Bravo na calçada (5 corações perdidos) | 2,15 | 1,57 | 29% |
| Bravo na mesa | 2,90 | 1,95 | 48% |
| Bravo na mesa, ambiente 4,5 | 3,20 | 2,10 | 55% |

Um bravo na mesa chega à metade do teto, e a faixa de 2 ★ é a que a Garagem considera neutra para o movimento.

## 5. O que a nota afeta

- **Movimento do dia:** `1 + 0,1 · clamp(2·fração − 1, −1, 1)`, em que fração = (nota − 1)/(teto − 1). Garagem: 1 ★ dá −10%; 2 ★ é neutro; 3 ★ dá +10%; 2,7 ★ dá +7%.
- **Cor do número no HUD e no balãozinho:** verde a partir de 75% do teto (2,5 ★ na Garagem), amarelo a partir de 50%, senão vermelho.
- **Faixas da caixa do fim do dia (`notaFaixa`):** pura abaixo de 4, prata a partir de 4, ouro a partir de 4,5, diamante acima de 4,8. **Não escalam com o ponto**: na Garagem a nota fica sempre "pura" (máximo por avaliação 3,8; geral ~3,1 no melhor dia).
- **Comentários:** elogio se o serviço médio da avaliação é 4 ou mais, senão reclamação do pior critério. Abaixo do Terraço, 30% dos elogios lembram que o lugar é simples; com ambiente ≥ 4, 35% citam um enfeite.

## 6. Números do bot (Garagem, `EQUIPE=auto`, 15 rodadas, cada dia sozinho)

| Dia | Nota do dia p10 / média / p90 | Espera | Agilidade | Comida | Cardápio | Ambiente |
|---|---|---|---|---|---|---|
| 1 | 2,42 / 2,71 / 3,02 | 3,17 | 3,17 | 2,55 | 2,95 | **1,71** |
| 2 | 2,36 / 2,51 / 2,78 | 2,74 | 2,98 | 2,35 | 2,88 | 1,63 |
| 3 | 2,36 / 2,75 / 3,12 | 2,87 | 2,91 | 2,68 | 2,89 | 2,40 |
| 4 | 2,25 / 2,79 / 3,14 | 2,85 | 2,79 | 2,82 | 2,99 | 2,51 |
| 5 | 2,07 / 2,62 / 2,93 | 2,59 | 2,68 | 2,56 | 2,88 | 2,38 |
| 6 | 2,53 / 2,76 / 3,05 | 2,66 | 2,79 | 2,78 | 2,90 | 2,66 |
| 7 | 2,27 / 2,66 / 2,94 | 2,59 | 2,70 | 2,63 | 2,82 | 2,57 |

- Da v8.6.4 (150 rodadas, janela de 30): nota geral p10 / p50 / p90, 2,73 / 2,82 / 2,92 (afiado com equipe), 2,65 / 2,76 / 2,87 (comum com equipe), 2,40 / 2,52 / 2,64 (sem equipe). Dias com a geral ≥ 3,0: 5%, 2% e 0%.
- Um jogo "perfeito" (espera e agilidade 5, ambiente 4,5, Tonhão no nível 2) dá geral ≈ 3,0 (simulação), ou seja, o teto de 3 ★ é alcançável na prática, mas só no limite.

## 7. Pontos que parecem desbalanceados (hipóteses)

1. **Quem sai bravo ainda recebe cerca de metade do teto** (seção 4). O comentário diz "Nunca mais volto!" e a nota diz 2 ★. Cardápio e Ambiente não deveriam pesar para quem nem experimentou; ou o bravo deveria ter um teto próprio.
2. **O humor é absoluto e não escala com o ponto.** Na Garagem, 20% de encantados com +0,6 a +1,2 sobre uma amplitude de 2 pontos inflam a média (serviço perfeito dá 3,15, acima do teto). No Terraço o mesmo humor só tira (4,94): o "5 ★" nunca é atingido. O comportamento se inverte entre os pontos.
3. **Cardápio é constante e não é jogado:** vale 4,5 desde o dia 1, 1/5 da nota sem nenhuma decisão. Na Garagem, ele sustenta a média e esconde o desempenho nos outros critérios.
4. **Comida é decidida pela contratação do Tonhão, não pela execução** (média de 3,5 a 4,25 de serviço). O jogador que joga melhor não a melhora (só o caprichado, 5% a 20%).
5. **O bônus da Agilidade só compensa perdas** (a nota já é limitada a 5): quem não perde corações não ganha nada com a cor certa, a corrente e o caprichado, ou seja, o bônus premia quem erra.
6. **Ambiente pesa o mesmo que o resto, mas varia mais:** de 1,6 (dias 1 e 2) a 2,7 (equipado), com a decoração só aparecendo acima de 4,5 de serviço. É o critério que mais separa o jogador que gasta do que não gasta.
7. **Faixas visuais (prata, ouro, diamante) são inalcançáveis na Garagem:** a recompensa visual só existe nos pontos de cima (era a intenção da v8.6.4, mas o jogador da Garagem nunca vê nada além de "pura").
8. **Limiar de saída sugerido (2,8 ★) coincide com a mediana do bot com equipe** (2,76 a 2,82): metade dos jogadores passaria sem esforço, enquanto sem equipe ninguém passa. Para ser "difícil", ficaria perto de 2,9 (acima do p75 do bot afiado). Ainda não está implementado.
9. **Variabilidade:** com 4 avaliações por dia, a nota do dia oscila de 2,1 a 3,1 (p10 a p90), só a média de 30 (≈7 dias) estabiliza. Os 2 primeiros dias não têm nota (8 avaliações) e a janela de 30 demora a "esquecer" um mau dia.

## 8. Perguntas para decidir

- O bravo deve ter nota própria (por exemplo, no máximo 1,5 a 2 ★ na Garagem), independente do Cardápio e do Ambiente?
- O humor passa a ser proporcional ao teto do ponto (fração da amplitude)?
- O Cardápio deve virar um critério que muda (mais pratos, pratos do dia) ou sair do cálculo e virar peso menor?
- A Comida deve ganhar algo da execução (por exemplo, prato servido quente e rápido), em vez de só o nível do Tonhão?
- Qual a nota mínima para sair da Garagem? (2,8 ★ está no plano; a simulação sugere ~2,9.)
- As faixas prata, ouro e diamante passam a escalar com o ponto?

## 9. Decisões da entrevista (29/10)

| Pergunta | Decisão |
|---|---|
| Nota do bravo | Cada um avalia só o que viveu: os critérios que o cliente não viu ficam fora da média (cada critério com a sua contagem). Calçada: só Espera; bravo antes do pedido: Espera, Agilidade, Ambiente; bravo depois do pedido: + Cardápio; comeu: os 5; entregador: Espera, Agilidade e Comida |
| Humor | Proporcional ao teto; no Terraço o perfeito com encantados chega a 5 |
| Cardápio | Começa com 2 itens e cresce com os cursos do Tonhão (R$ 150 a 250; o avançado aumenta o caprichado daquele prato) |
| Comida | Prato quente: o que espera no balcão esfria e perde nota |
| Nota mínima para sair da Garagem | 95% do teto (~2,9 ★) |
| Faixas | Ficam absolutas, com uma faixa bronze nova a partir de 3,0 |
| Bônus da Agilidade | Vira chance de sair encantado |

Fora da entrevista: o peso do Ambiente (ponto 6) e a oscilação da nota (ponto 9). Plano: etapa 2c-r do `docs/PLANO.md`.
