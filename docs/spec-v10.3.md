# v10.3 — O salão e o bar do Terraço: a Cami em tudo, os cafés do Joca e os coquetéis de autor (etapa 4a-4)

**Situação:** aprovada (planejada em 10/11; levada do `docs/PLANO.md` para o formato do `docs/SDD.md` em 11/11, sem decisão nova)
**Origem:** `docs/PLANO.md`, sessão 4a-4, e a entrevista de 31/10 ("A equipe ponto a ponto"). As decisões que valem para a 4a inteira continuam no `PLANO.md` (`tests/indice.sh PLANO 4a`).

## Objetivo
No Terraço, cada ajudante do salão chega ao topo: a Cami passa a ajudar em qualquer mesa sem atropelar a Bia, o Joca serve cafés especiais e o Anselmo faz coquetéis de autor e recebe quem espera no foyer com um carrinho de boas-vindas.

## Fora do escopo
- Música, flores e o rebalanceamento do Terraço: sessão 4a-5 (v10.4). Aqui o `balance.js` só ganha as chaves e o ajuste previsto no CA8.

## Regras (decisões tomadas)
- **Cami, curso "Atendimento de salão"** (`CAMI_CURSOS`: `{ id:'salao', nome:'Atendimento de salão', preco:900, nivel:4, dep:'mesa' }`): nível 4, `STAFF.cami.levels[4] = { speed:1.35, tasks:4, pay:190, mesas:true, tudo:true }`, e o modo **"Ajuda em tudo"** (`equipe.camiModo = 'tudo'`; o cartão passa a ter 3 botões: "Tarefas", "Minhas mesas" e "Ajuda em tudo"). Nesse modo ela faz, em **qualquer mesa**, o que a Bia não pegou: anota o pedido, leva o prato pronto, cobra a conta e recolhe a louça, mas só o que espera há `CAMI_TUDO.espera` (3 s) ou mais e não está na fila de ações da Bia (`grp.stateT`, `p.age` e `t.sujaT`). A Bia continua podendo pegar qualquer prato (o "É da Cami!" só vale para o prato que a Cami já está indo buscar). O básico da casa volta para o Joca (ou a Dani), como em "Minhas mesas".
- **Joca, curso "Cafés especiais"** (`JOCA_CURSOS`: `{ id:'cafesEsp', nome:'Cafés especiais', preco:600, nivel:4, dep:'espresso', item:true }`): `CAFES.metodos = [ { id:'coado', nome:'Coado no filtro', preco:20, prep:2.5, etapas:2 }, { id:'prensa', nome:'Prensa francesa', preco:20, prep:3.5, etapas:3 }, { id:'coldbrew', nome:'Cold brew', preco:20, prep:1, etapas:1 } ]`, ingrediente R$ 5. Com `up.cafesEsp`, os pedidos de café passam a ser esses. As etapas (moer, passar ou prensar, servir) aparecem como marcas no anel de progresso da bancada enquanto o café é feito; a bancada ganha o filtro, a prensa e a jarra. 3 ícones novos de café. Comentário: "Nunca tomei um coado assim!".
- **Anselmo, dois cursos** (`ANSELMO_CURSOS`, um por dia, `save.anselmoCursos` e `anselmoCursoDia`; no cartão dele, no lugar de "Cursos no Terraço Suíça"):
  - `{ id:'classica', nome:'Coquetelaria clássica', preco:500, nivel:4 }`: o balcão passa a ter 4 vagas de copo e o preparo fica 20% mais rápido.
  - `{ id:'autor', nome:'Coquetelaria de autor', preco:800, nivel:4, dep:'classica', item:true }`: ele sobe para o nível 3 (`speed` 1,0, R$ 130/dia); os drinks passam a ser os de autor, a **R$ 35** (ingrediente R$ 9): **"Neblina da Serra"** (branco-azulado, com fumacinha), **"Jardim do Terraço"** (rosa, com flor) e **"Ouro da Casa"** (dourado, com raspa de laranja); e o foyer ganha o **carrinho de boas-vindas**, a bebida da espera do Terraço: `PONTOS[3].bebida = 'coquetel'`, `BEBIDA_ESPERA.coquetel = { preco:18, ingred:5, prep:3, take:0.5, fim:'Coquetéis de boas-vindas' }` (frases no molde das águas: "Um coquetel, por favor!"), ligado pelo curso (`up.maquina`) e servindo só nos dias em que o Anselmo vem. O carrinho fica no alto do foyer, onde nos outros pontos fica o balcão de retirada (a estação `maquina` muda de lugar no Terraço: `rect:{ x:-94, y:98, w:90, h:80 }`, `ap:{ x:16, y:156 }`). Nomes inventados, sem dizer se têm álcool.
- Os cursos com item (cafés especiais, coquetelaria de autor) ficam no cartão Cardápio com o rosto de quem faz e contam na Diversidade (`cursosItem`).
- **Manual:** as fichas `e-cami`, `e-joca` e `e-anselmo` ganham o que mudou (linha da Cami: "Garçonete de rodízio: com cursos, cuida das mesas dela ou ajuda em todas."); `l-maquina` cita o coquetel de boas-vindas.
- **Modo dev:** os cursos novos (`salao`, `cafesEsp`, `classica`, `autor`) e o modo "Ajuda em tudo" entram na aba da equipe do painel, como os outros cursos (gancho da Etapa D).
- **Save:** `equipe.camiModo = 'tudo'`, `joca`/`cami` com os cursos novos, `save.anselmoCursos` e `anselmoCursoDia`; o save da v10.2.2 carrega igual.

## Critérios de aceite
- **CA1** "Atendimento de salão" só aparece no Terraço e depois do curso "de mesa"; leva a Cami ao nível 4, a R$ 190 por dia → `smoke65` (1)
- **CA2** Em "Ajuda em tudo" a Cami anota, serve, cobra e recolhe em mesa não marcada, só depois de 3 s de espera e nunca o que está na fila da Bia; a Bia pega prato de qualquer mesa; o básico da casa fica com o Joca → `smoke65` (2)
- **CA3** Cafés especiais: dependem do espresso, custam R$ 20 e cada método leva o seu tempo (2,5 s, 3,5 s e 1 s) → `smoke65` (3)
- **CA4** Coquetelaria clássica: 4 vagas de copo e preparo 20% mais rápido. De autor: depende da clássica, Anselmo no nível 3 com R$ 130 na folha, drinks a R$ 35 → `smoke65` (4)
- **CA5** O carrinho de boas-vindas só serve com o curso de autor e com o Anselmo no dia; soma R$ 18 na conta; a estação `maquina` fica no lugar novo no Terraço → `smoke65` (5)
- **CA6** A Diversidade do cardápio conta os cursos com item (`cursosItem`) → `smoke65` (6)
- **CA7** O save da v10.2.2 carrega igual → `smoke65` (7)
- **CA8** Com a Cami em "Ajuda em tudo", a equipe toda não passa de 97% das metas → `PONTO=terraco node balance.js 40` com `CAMI=4 CAFESESP=1 AUTOR=1`; se passar, `CAMI_TUDO.espera` vai de 3 para 5 (e o CA2 e o smoke acompanham)
- **CA9** O modo dev liga cada curso novo e o modo "Ajuda em tudo" → `smoke65` (8)
- **CA10** O visual: o cartão da Cami com os 3 modos, ela servindo mesa não marcada, a bancada dos cafés com as etapas, os 3 cafés e os 3 drinks novos, o carrinho no foyer com gente bebendo, o cartão do Anselmo com os cursos → capturas `tests/shot_v10_3.js` (olhar e apagar)

## Partes
`10-constantes.js` (`CAMI_CURSOS`, `STAFF.cami`, `CAMI_TUDO`, `JOCA_CURSOS`, `CAFES`, `ANSELMO_CURSOS`, `DRINKS`, `BEBIDA_ESPERA`, `PONTOS[3].bebida`, a estação no Terraço, `MANUAL`), `12-clientes.js` (`normEquipe`, `normSave`), `14-bia.js`, `15-dani.js` (o modo "Ajuda em tudo", `donoBasico`), `16-jogo.js` (`setCamiModo`, `buyAnselmoCurso`, a fila dos drinks, a bebida da espera), `20-desenho-base.js` (3 cafés e 3 drinks), `21-cenario.js` (a bancada dos cafés, o carrinho do foyer), `22-salao-hud.js` (balões), `41-lojinha.js` (cartões).
Mais `40-interface.js` (o gancho no painel do modo dev).

## Tarefas
- [ ] T1 `tests/smoke65.js` com os CA1 a CA7 e o CA9, falhando; entra no `tests/run_all.sh`.
- [ ] T2 Constantes: cursos, níveis, `CAMI_TUDO`, `CAFES`, `DRINKS`, `BEBIDA_ESPERA`, `PONTOS[3].bebida`, a estação no Terraço, `MANUAL` (`10-constantes.js`) e a normalização do save (`12-clientes.js`).
- [ ] T3 A Cami em "Ajuda em tudo" (`15-dani.js`, `14-bia.js`, `setCamiModo` em `16-jogo.js`) e o cartão com 3 botões (`41-lojinha.js`).
- [ ] T4 Cafés especiais do Joca: os pedidos, as etapas no anel da bancada, a bancada e os 3 ícones (`16-jogo.js`, `20-desenho-base.js`, `21-cenario.js`, `22-salao-hud.js`).
- [ ] T5 Os cursos do Anselmo: `buyAnselmoCurso`, 4 vagas, drinks de autor e os 3 desenhos, o cartão dele.
- [ ] T6 O carrinho de boas-vindas no foyer (a bebida da espera e a estação no lugar novo).
- [ ] T7 Cartão Cardápio e Diversidade (`cursosItem`); Manual (`e-cami`, `e-joca`, `e-anselmo`, `l-maquina`).
- [ ] T8 Gancho no modo dev (`40-interface.js`).
- [ ] T9 `bot.js` (compra os cursos, Cami em "Ajuda em tudo"), chaves do `balance.js` e o CA8.
- [ ] T10 Capturas do CA10: tirar, olhar os recortes e apagar.
- [ ] Fechamento: v10.3 (`vtag`, `VERSAO`, `#ov-ver`), `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, a linha da tabela Situação do `PLANO.md`, `tests/run_all.sh` verde, PR e merge.

## Testes
- **`tests/smoke65.js` (novo):** uma checagem numerada por critério (CA1 a CA7 e CA9), na ordem acima.
- `bot.js`: compra os cursos e põe a Cami em "Ajuda em tudo". `PONTO=terraco node balance.js`: chaves `CAMI=4`, `CAFESESP=1`, `AUTOR=1`.
- Capturas: `tests/shot_v10_3.js` (`capturas/v10_3`, fora do git).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.) Do plano de 10/11 para esta spec só mudaram dois números: o smoke novo é o `smoke65` (o plano dizia `smoke63`, que a etapa D-1 usou) e o save a carregar igual é o da v10.2.2 (o plano dizia v10.2).

**Modelo:** Sonnet, esforço alto. São três sistemas, e o modo novo da Cami é comportamento de ajudante, que pede cuidado para não atropelar o jogador.
