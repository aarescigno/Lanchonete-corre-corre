# v10.3 — O salão e o bar do Terraço: a Cami em tudo, os cafés do Joca e os coquetéis de autor (etapa 4a-4)

**Situação:** entregue em 11/11 (planejada em 10/11; aprovada em 11/11)
**Origem:** `docs/PLANO-FEITO.md`, sessão 4a-4, e a entrevista de 31/10 ("A equipe ponto a ponto"). É a primeira spec no formato do `docs/SDD.md`: a versão foi feita num branch paralelo, a partir do texto do plano, e esta spec juntou os dois no merge.

## Objetivo
No Terraço, cada ajudante do salão chega ao topo: a Cami passa a ajudar em qualquer mesa sem atropelar a Bia, o Joca serve cafés especiais e o Anselmo faz coquetéis de autor e recebe quem espera no foyer com um carrinho de boas-vindas.

## Fora do escopo
- Música, flores e o rebalanceamento do Terraço: sessão 4a-5 (v10.4).

## Regras (o que o jogo faz)
- **Cami, curso "Atendimento de salão"** (`CAMI_CURSOS`, R$ 900, nível 4, depois do "de mesa"): nível 4 (`STAFF.cami.levels[4]`: rapidez 1,35, 4 tarefas, R$ 190, `mesas` e `tudo`; `normEquipe` limita o nível 4 ao Terraço) e o modo **"Ajuda em tudo"** (`equipe.camiModo = 'tudo'`, `camiModoTudo`, `CAMI_TUDO.espera = 3`). O cartão tem 3 botões (Tarefas, Minhas mesas, Ajuda em tudo). Nesse modo `Helper.thinkMesas(true)` (`15-dani.js`) anota o pedido, leva o prato, cobra a conta e recolhe a louça de **qualquer** mesa, só do que espera há 3 s ou mais (`group.stateT`, `plate.age`, `table.sujaT`) e não está na fila da Bia. Não marca o grupo (`group.cami`): a Bia ainda pega qualquer prato; só o que a Cami já vai buscar (`plate.camiVai`) dá "É da Cami!". O básico da casa volta para o Joca (`donoBasico`).
- **Joca, curso "Cafés especiais"** (`JOCA_CURSOS`, R$ 600, nível 4, depende do espresso, com item; `up.cafesEsp`): os pedidos de café passam a ser `CAFES.metodos` (Coado no filtro 2,5 s, Prensa francesa 3,5 s, Cold brew 1 s, todos R$ 20, ingrediente R$ 5: `cafesLista`, `cafeIngred`, `cafeDe`, `cafeIdx`). Ícones novos (índices 2 a 4 do `cafeesp`) e, sobre a máquina, o filtro, a prensa e a jarra; enquanto o café é feito, o anel de progresso com uma marca por etapa (`espressoTrabalho`, `drawCafesEsp`, `21-cenario.js`).
- **Anselmo, dois cursos** (`ANSELMO_CURSOS`, `save.anselmoCursos` e `anselmoCursoDia`, um por lojinha; `up.coqClassica` e `up.coqAutor`): **Coquetelaria clássica** (R$ 500; balcão com 4 vagas, `drinkVagas`, e preparo 20% mais rápido, `drinkPrep`) e **Coquetelaria de autor** (R$ 800, depende da clássica, com item; sobe o Anselmo ao nível 3, R$ 130/dia): drinks Neblina da Serra, Jardim do Terraço e Ouro da Casa a R$ 35 (ingrediente R$ 9; `drinksLista`, `drinkPreco`, `drinkIngred`; ícones 3 a 5 do `drink`). A clássica fica no cartão do Anselmo; a de autor, no Cardápio.
- **Carrinho de boas-vindas:** `PONTOS[3].bebida = 'coquetel'` (`BEBIDA_ESPERA.coquetel`: R$ 18, ingrediente R$ 5, 3 s, "Coquetéis de boas-vindas"), ligado pelo curso de autor (`up.maquina`) e servindo só nos dias em que o Anselmo vem (`Game.maquinaOn`). A estação `maquina` muda de lugar no Terraço (`maquinaLugarFor`, `MAQUINA_LUGAR`: alto do foyer). O carrinho é `drawCarrinhoBoasVindas`; a melhoria "Água da torneira" não aparece nem se compra no Terraço.
- Os cursos com item (cafés especiais, coquetelaria de autor) contam na Diversidade (`cursosItem`). Manual: fichas `e-cami`, `e-joca`, `e-anselmo` e `l-maquina` atualizadas.
- **Modo dev:** Todos/Nenhum cursos inclui os três cursos novos (`devCursos`, `devSegueCursos`); a Cami sobe até o nível 4 em `devNivel`.
- Saves da v10.2 carregam igual (`normSave` ganha `anselmoCursos`, `anselmoCursoDia`, `up.cafesEsp`, `up.coqClassica`, `up.coqAutor`).

## Critérios de aceite
- **CA1** "Atendimento de salão" só aparece no Terraço e depois do curso "de mesa"; leva a Cami ao nível 4, a R$ 190 por dia → `smoke65` (1)
- **CA2** Em "Ajuda em tudo" a Cami anota, serve, cobra e recolhe em mesa não marcada, só depois de 3 s de espera e nunca o que está na fila da Bia; a Bia pega prato de qualquer mesa; o básico da casa fica com o Joca → `smoke65` (2)
- **CA3** Cafés especiais: dependem do espresso, custam R$ 20 e cada método leva o seu tempo (2,5 s, 3,5 s e 1 s) → `smoke65` (3)
- **CA4** Coquetelaria clássica: 4 vagas de copo e preparo 20% mais rápido. De autor: depende da clássica, Anselmo no nível 3 com R$ 130 na folha, drinks a R$ 35 → `smoke65` (4)
- **CA5** O carrinho de boas-vindas só serve com o curso de autor e com o Anselmo no dia; soma R$ 18 na conta; a estação `maquina` fica no lugar novo no Terraço → `smoke65` (5)
- **CA6** A Diversidade do cardápio conta os cursos com item (`cursosItem`), e as páginas desenham → `smoke65` (6)
- **CA7** As fichas do Manual da Cami, do Joca, do Anselmo e da bebida da espera dizem o que mudou → `smoke65` (7)
- **CA8** O save da v10.2 carrega igual → `smoke65` (8)
- **CA9** O modo dev liga e desliga os cursos novos (Todos/Nenhum) e leva a Cami ao nível 4 → `smoke65` (9)
- **CA10** As chaves `CAMI=4`, `CAFESESP=1` e `AUTOR=1` jogam o Terraço com a equipe no topo → `PONTO=terraco node balance.js` (medido em Testes; o teto de 97% ficou para a 4a-5, ver Desvios)
- **CA11** O visual: o cartão da Cami com os 3 modos, a bancada dos cafés, os cafés e os drinks novos, o carrinho no foyer, o cartão do Anselmo → capturas `tests/shot_v10_3.js` (olhar e apagar)

## Partes
`10-constantes.js`, `12-clientes.js`, `14-bia.js`, `15-dani.js`, `16-jogo.js`, `20-desenho-base.js`, `21-cenario.js`, `22-salao-hud.js`, `23-render.js`, `41-lojinha.js`, `43-telas.js` e `02-telas.html`.

## Tarefas
- [x] T1 `tests/smoke65.js`, no `tests/run_all.sh`.
- [x] T2 Constantes, cursos, níveis e a normalização do save.
- [x] T3 A Cami em "Ajuda em tudo" e o cartão com 3 botões.
- [x] T4 Cafés especiais do Joca: pedidos, etapas no anel, bancada e ícones.
- [x] T5 Os cursos do Anselmo, as 4 vagas e os drinks de autor.
- [x] T6 O carrinho de boas-vindas no foyer.
- [x] T7 Cartão Cardápio, Diversidade e Manual.
- [x] T8 Gancho no modo dev.
- [x] T9 Chaves do `balance.js`.
- [x] T10 Capturas (`tests/shot_v10_3.js`).
- [x] Fechamento: v10.3, `docs/RESUMO.md`, `docs/TESTES.md`, a etapa arquivada no `docs/PLANO-FEITO.md`.

## Testes
`tests/smoke65.js` (71 checagens; o plano o chamava de smoke63, número já usado pelo modo dev). `smoke45` e `smoke60` ajustados (3 cursos da Cami; o Terraço agora tem coquetel). `balance.js` (`PONTO=terraco`): `CAMI=4`, `CAFESESP=1`, `AUTOR=1`. Em 10 rodadas por configuração, a equipe completa já passava 100% das metas do Terraço antes e depois (3★ sobe de 4/10 a 9/10 no dia 8); a regra do plano (`CAMI_TUDO.espera` 5 se passar de 97%) não separa a Cami do resto, e o Terraço inteiro é recalibrado na 4a-5, então ficou em 3 s. Capturas: `tests/shot_v10_3.js`.

## Decisões em aberto
Nenhuma.

## Desvios
- **O teto de 97% não foi aplicado.** A regra do plano era passar `CAMI_TUDO.espera` de 3 para 5 se a equipe toda passasse de 97% das metas. A equipe completa já passava 100% antes desta versão, então a regra não separa a Cami do resto; ficou em 3 s e o Terraço inteiro é recalibrado na 4a-5.
- **O smoke novo é o `smoke65`** (o plano dizia `smoke63`, que a etapa D-1 usou).
- **Modo dev:** o painel liga os cursos e o nível da Cami; o modo "Ajuda em tudo" se escolhe no cartão dela, sem botão próprio no painel.
- **Feita antes de a spec existir neste formato:** a execução seguiu o texto do plano; os critérios acima foram conferidos contra o `smoke65` no merge, e não escritos antes dele.

**Modelo:** Sonnet, esforço alto. São três sistemas, e o modo novo da Cami é comportamento de ajudante, que pede cuidado para não atropelar o jogador.
