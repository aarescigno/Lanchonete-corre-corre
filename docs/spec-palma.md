# Spec da proposta "Na palma da mão" (branch `proposta/na-palma-da-mao`)
Uma seção por prévia: o que entrou e os testes. O roteiro está em `docs/PLANO-PALMA.md`.

## palma.1 — Esqueleto em pé (P2-1)
`VERSAO = 'palma.1'`, selo `vtag` "em pé · prévia 1" (constante `VTAG`).

**Entrou**
- O mundo de **600 × 1040** (`W`, `H`, `TW = W`) e o `LAYOUT` novo em `10-constantes.js`: `CALCADA = { y0:752, y1:944 }` (a faixa de baixo, no lugar da calçada à esquerda), `BARRA` (944 a 1040), `STATIONS`, `PLATE_SLOTS` (fileira em y 184, de 184 a 320, para 4, 5 ou 6 vagas), `MARMJ_SLOTS` (empilhadas no tampo da mesinha), `BOUNDS`, as casas da equipe (`BIA` em 300,600; `DANI_HOME` 520,300; `JOCA_HOME` 520,460; `CAMI_HOME` 480,700; `ANSELMO_HOME` 36,470), `TRASH.pos`, os `badge` da manutenção e o `area` dos `PONTOS`.
- A espera é uma lista de lugares: `QUEUE.lugares` (`{x,y}`, 2 fileiras de 3, o 1º na porta), `queueLugares(n)` no lugar de `queueYsFor`, e `lugarEspera(i)`. A freguesia vem da rua de baixo (`DOOR` = 300,1060) e entra pela porta: `ENTRADA.fora` (300,790) e `ENTRADA.dentro` (300,747); `caminhoEntra`, `caminhoSai` e `caminhoAte` (Bia e ajudantes que vão à calçada) em `11-base.js`. `AVISO` é onde saem os avisos de chegada (VIP, lotado, apito).
- `salaoCaminho` parte da porta (por dentro). `g.cam = 0`.
- `fit()` em `40-interface.js`: o palco ocupa a janela toda, o canvas (600 × 1040) encaixa pela largura e a sobra fica com a cor da parede (em cima) e da rua (embaixo). `toLogical` não mudou (usa `TW` e `H`). O aviso "Gire o celular" saiu.
- **Cenário provisório** (`drawProvFundo`, `drawProvEstacoes`, `drawProvRelogio` em `21-cenario.js`): blocos lisos com o nome de cada estação, para os 3 pontos. Seguem vivos o Tonhão e os tickets, os pratos e as marmitas prontas, a pia e a louça, a lixeira, a retirada, a bebida da espera, as plaquinhas de conserto e o relógio (topo, à direita). Sem desenho por enquanto: músico, TV e som, quadro de giz e decoração.
- **Barra provisória** (`drawHud` em `22-salao-hud.js`, `hudHit` em `16-jogo.js`): a antiga em 2 fileiras: dia, lucro, meta e Gurugol em cima; fila de ações (38 px por quadrinho), mãos, pausa e som embaixo.
- A abertura segue deitada (1220 × 600, `AB_W` e `AB_H` em `25-abertura.js`), no meio da tela em pé com o resto escuro (a caixa de cinema fica para a P2-7).
- O editor do salão (lojinha) mostra o mundo em pé: `ED` = x 0, y 290, 600 × 654; o estoque virou uma faixa na calçada (`EST`, 6 colunas).

**Desvios do plano** (para a arte e o ajuste final)
- `area` das mesas: x 64–536 e y 300–752 nos 3 pontos (o plano dizia x 96–504 e 72–528, y 304–744). Com o `SALAO.gap` de 46 (mantido), é o que faz caberem 6 mesas de 4 na Avenida (2 colunas × 3 fileiras), 5 na área industrial, 4 na Garagem e o Turno sem fim (16 lugares). **9 mesas de 4 não cabem** (a largura de 3 colunas passa de 490 px).
- `BOUNDS`: y de 232 a 748 e `ENTRADA.dentro` em y 747 (o plano dizia 744 e 740): a fileira de baixo das mesas termina em 742 e o ponto da porta precisa ficar fora de qualquer mesa.
- Na arrumação automática, a mesa do meio da fileira de baixo pode ficar bem em frente da porta (a gente dá a volta). A arte da palma.2 pode empurrar essa mesa para o lado.

**Testes**
- `run_all.sh` verde, com as coordenadas atualizadas em `smoke`, `2`, `5`, `7`, `12`, `13`, `14`, `15`, `16`, `22`, `28`, `29`, `39`, `42`, `45`, `47`, `51`, `52` e `57`.
- Smoke novo `smoke58`: o mundo é 600 × 1040; faixas; todo `ap` e todo retângulo de estação dentro dos limites; a espera na calçada nos 3 pontos; arrumação automática (6 de 4 na Avenida, 4 na Garagem, 5 na área industrial); um grupo vem da rua, espera, passa pela porta, senta e paga.
- Capturas conferidas (390 × 844 e 1280 × 720) com `tests/shot_palma1.js [pasta]`.
- `menu_fit.py` não rodou (sem `playwright` no Python deste ambiente); o menu é revisto na P2-5.

**Balance** (`node balance.js 40`, sem corrigir; entre parênteses, o mesmo bot no commit `815e188`): passou nos dias 1 a 7: 40/40 (40/40), 40/40 (40/40), 36/40 (37), 32/40 (29), 31/40 (29), 22/40 (27), 17/40 (20). Lucro médio dos dias 3 a 7: 265, 162, 177, 158, 162 (252, 137, 181, 174, 159). Ou seja, o esqueleto não mexeu no equilíbrio, dentro do ruído do bot. `carreira.js`: 3 de 10 carreiras chegam a R$ 800 no dia mediano 13.
