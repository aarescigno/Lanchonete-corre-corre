# v12.11 — O salão que cabe o teto e a troca de mesas (etapa 19a)

**Situação:** aprovada (27/11)
**Origem:** retornos do usuário de 27/11 no `docs/PROPOSTAS.md`: "o salão da Avenida não cabe os 24 lugares" e "a troca de lugar das mesas". Decisões fechadas com o usuário em 27/11 (Opus); a etapa 19 foi dividida em 3 versões (19a, 19b e 19c), uma por sessão.

## Objetivo
Qualquer mistura de mesas de 2 e de 4 até o teto de lugares cabe no salão, na arrumação automática e no arrasto, nos quatro pontos. Arrastar uma mesa para cima de outra abre espaço: a outra se desloca e, se não houver lugar, vai para o estoque, que no editor passa a ser uma faixa no alto.

## Fora do escopo
- A chuva nas janelas e as pernas no sofá da Avenida: v12.11.1 (`docs/spec-v12.11.1.md`).
- O couvert cinza e a cabecinha nos cursos do Cardápio: v12.11.2 (`docs/spec-v12.11.2.md`).
- A Dani que perde uma tarefa na chegada à Avenida (retorno de 27/11): segue em aberto no `docs/PROPOSTAS.md`, sem reprodução.

## Regras (decisões tomadas)
### O salão (medido em 27/11 com a `salaoAuto` em todas as misturas, em 3 ordens)
- `SALAO.gap`: 46 → **30** (a menor folga que ainda deixa a Bia parar ao lado da mesa: o `tableApproach` fica 28 px fora da mesa).
- `area` dos pontos (`PONTOS`, `src/10-constantes.js`): Garagem fica `{ x0:196, y0:150, x1:684, y1:500 }`; área industrial e Terraço, `x0` 160 → **150** (no Terraço, logo à direita do piano, que vai até 148); Avenida, `x0` 160 → **40**. `y0`, `x1` e `y1` não mudam (x 700 em y 150 é onde a Bia pega marmitas e drinks).
- Com isso cabem (medido): Garagem, até 16 lugares; área industrial e Terraço, até 20; Avenida, até 24, em qualquer mistura (12 mesas de 2, 1 de 4 com 10 de 2, ...). Continua com 2 fileiras; nada muda no desenho das mesas nem no `MESA`.
- Os salões já salvos continuam válidos (a folga só diminuiu e a área só cresceu): o `normSalao` não rearruma nada.
- A mensagem do `buyMesa` acima do teto passa de "A garagem tem lugar para N pessoas, no máximo." para **"O salão tem lugar para N pessoas, no máximo."** (aparecia em todo ponto).

### O estoque no editor: faixa no alto
- O painel do estoque (`EST`, `src/41-lojinha.js`) sai da esquerda (que agora é salão na Avenida) e vira uma **faixa no alto do editor, por cima da parede do fundo**: `EST = { x0:8, y0:60, x1:760, y1:146 }` (px do salão; o `ED` não muda de tamanho, e a `area` começa em y 150, então a faixa não cobre mesa).
- O rótulo "ESTOQUE" fica no canto esquerdo da faixa; as mesas guardadas ficam **em fila, da esquerda para a direita**, na escala 0,55 (`EST.k`); se a fila não couber na largura, a escala cai até caber (mínimo 0,4). O pior caso (11 mesas de 2 na Avenida) cabe a 0,55.
- Com o estoque vazio, a faixa mostra: **"Arraste uma mesa para cá: aqui ela não abre no dia."**
- Soltar a mesa na faixa guarda (`naEst` passa a ser o retângulo da faixa). O balãozinho da mesa do estoque abre logo abaixo da faixa, sob a mesa escolhida.
- Textos: o `aria-label` do editor passa a ser "Salão: arraste as mesas para mudar de lugar ou para o estoque, no alto, e toque numa mesa para ver as opções".

### A troca ao arrastar (`salaoTroca`)
- Função nova e pura em `src/10-constantes.js`: `salaoTroca(mesas, i, m, x, y, ponto)`: a mesa `m` (a do salão de índice `i`, ou uma do estoque com `i = -1`) solta em (x, y). Devolve `{ mesas, est, movidas }` (o salão novo, as mesas que vão para o estoque e quantas se deslocaram no salão) ou `{ why }`.
- Como decide:
  1. Fora da área (`mesaProblema` com "Fora do salão.") é recusa, como hoje.
  2. As mesas "no caminho" são as que ficam perto demais da mesa solta (a mesma conta do `mesaProblema`, com a `SALAO.gap`). Sem nenhuma, vale o de hoje (`salaoProblema`).
  3. Elas saem do salão e voltam uma a uma, na ordem do salão, **no lugar livre mais perto de onde estavam** (`salaoPerto`, que já testa a folga e o caminho da Bia), sem empurrar nenhuma outra.
  4. A que não acha lugar vai para o **estoque** (mantém cor, toalha e a marca da Cami sai, como no `guardarMesa`).
  5. Se o arranjo final ainda tiver problema (a mesa solta tapa o caminho da Bia), todas as deslocadas vão para o estoque e confere de novo; se nem assim, recusa com o motivo (como hoje).
- Os lugares do salão mais os do estoque não mudam (o teto conta os dois), e o salão nunca fica sem mesa.
- No editor (`edValida`/`pointerup`), o arrasto usa a `salaoTroca`: enquanto a mesa passa por cima de outra e a troca dá certo, a marca da mesa arrastada fica verde (vale soltar) e cada mesa que vai se mover ganha a marca tracejada (`edMarca`, como a mesa escolhida). Ao soltar, um só **Desfazer** volta tudo (o `salaoSet(l, true, est)`).
- Mensagem ao soltar, só quando alguma mesa foi para o estoque: **"Sem lugar no salão: 1 mesa foi para o estoque."** (ou "N mesas foram para o estoque."). Quando só se deslocaram no salão, sem mensagem.
- `Game.moverMesa(i, x, y)` e `Game.tirarMesa(k, x, y)` passam a chamar a `salaoTroca`; a Arrumação automática, comprar, virar, guardar e vender não mudam.

- **Modo dev:** o editor do salão já abre na lojinha do modo dev (a troca e o estoque se testam lá); nada novo no painel.
- **Manual:** nada muda.
- **Save:** nada novo. Os salões salvos continuam como estão.

## Critérios de aceite
- **CA1** Nos 4 pontos, toda mistura de mesas de 2 e de 4 até o teto de lugares, nas ordens "as de 4 primeiro", "as de 2 primeiro" e alternada, tem arrumação automática (`salaoAuto` não dá null) → `smoke125` (1)
- **CA2** Na Avenida com 12 mesas de 2 arrumadas, a Bia tem caminho da janela de pedidos até o balcão de retirada, a bebida da espera e os 6 lugares da espera (`pathOk`); no Terraço com 10 mesas de 2, nenhuma mesa cruza o piano → `smoke125` (2)
- **CA3** Um salão salvo com a arrumação da v12.10.7 (6 mesas de 4 na Avenida, kit na Garagem) passa pelo `normSalao` sem mudar nenhuma posição → `smoke125` (3)
- **CA4** Troca com lugar: mesa A solta em cima da B, com espaço livre perto: A fica onde foi solta, B se desloca no salão, nada vai para o estoque, os lugares não mudam e um Desfazer volta o arranjo de antes → `smoke125` (4)
- **CA5** Troca sem lugar: na Avenida com 24 lugares no salão, A solta em cima da B: B vai para o estoque (com a cor e a toalha), a mensagem é "Sem lugar no salão: 1 mesa foi para o estoque." e o total de lugares (salão + estoque) não muda → `smoke125` (5)
- **CA6** Do estoque: a mesa do estoque solta em cima de uma do salão abre espaço do mesmo jeito (a do salão se desloca ou vai para o estoque) → `smoke125` (6)
- **CA7** Soltar fora da área continua recusado ("Fora do salão."), e sem mesa no caminho o arrasto é o de sempre → `smoke125` (7)
- **CA8** O estoque é a faixa do alto: `naEst` vale num ponto da faixa e não num ponto do salão; 11 mesas de 2 no estoque ficam todas dentro da faixa, sem se cruzar → `smoke125` (8)
- **CA9** Acima do teto, o `buyMesa` diz "O salão tem lugar para 24 pessoas, no máximo." na Avenida → `smoke125` (9)
- **CA10** O que se vê → captura `shot_v12_11.js` (960x540 e 844x390): a Avenida com 12 mesas de 2 no jogo e no editor (a faixa do estoque com mesas, sem cobrir mesa do salão; o estoque vazio com o texto); uma mesa arrastada por cima de outra (marca verde e a tracejada na que vai se mover); o balãozinho de uma mesa do estoque; a área industrial e o Terraço (o piano) com 10 mesas de 2
- **CA11** `python3 menu_fit.py`: a lojinha com o editor do salão continua cabendo nos 14 tamanhos

## Partes
- `src/10-constantes.js`: `SALAO.gap`, `PONTOS[].area`, `salaoTroca` (nova, perto da `salaoPerto`).
- `src/16-jogo.js`: `buyMesa` (texto), `moverMesa`, `tirarMesa`.
- `src/41-lojinha.js`: `EST`, `estSlots`, `naEst`, `drawEstoque`, `edValida`, `edEvents` (`pointerup`), `drawEditor` (as marcas), `buildSalao` (o `aria-label` e o balãozinho do estoque).
- `src/43-telas.js`: expor `salaoTroca`, `EST`, `naEst`, `estSlots` no `window.__lcc`.

## Tarefas
- [ ] T1 Smoke novo `smoke125` com os critérios de aceite (falhando) e no `tests/run_all.sh`.
- [ ] T2 O salão: `SALAO.gap`, as áreas, o texto do `buyMesa`.
- [ ] T3 O estoque na faixa do alto (`EST`, `estSlots`, `naEst`, `drawEstoque`, o balãozinho, o `aria-label`).
- [ ] T4 A `salaoTroca`, o `moverMesa`/`tirarMesa` e o arrasto do editor com as marcas e a mensagem.
- [ ] T5 `shot_v12_11.js` (CA10): conferir em recortes ampliados, ajustar e apagar as capturas; `python3 menu_fit.py` (CA11).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, os destinos no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A conta da geometria foi feita com um script que muda `L.SALAO.gap` e `L.PONTOS[i].area` pelo `harness.js` e roda a `salaoAuto` em todas as misturas: o CA1 do smoke pode ser o mesmo laço.
- `salaoPerto(l, i, ponto)` já procura o lugar válido mais perto da mesa `i` (folga e caminho): a `salaoTroca` põe a deslocada na posição antiga dentro da lista sem as outras deslocadas e chama a `salaoPerto`.
- Com a área da Avenida começando em x 40, a mesa da esquerda tem o lado esquerdo de chegada da Bia em x ~-24 (na calçada, dentro do `BOUNDS`): vale como chegada; não restrinja a `tableApproach`.
- O `tableApproach` do lado esquerdo das mesas da fileira de baixo no Terraço cai dentro do piano e fica fechado; o lado direito resolve (o CA1 já mede com o caminho).

## Testes
- Smoke novo: `smoke125` (CA1 a CA9). Captura: `shot_v12_11.js` (CA10). `python3 menu_fit.py` (CA11).
- Sem mudança no equilíbrio: a Bia e as mesas são as mesmas; não precisa de `balance.js` nem de `carreira.js` (o `run_all.sh` cobre o resto).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (a lógica da troca com o caminho da Bia e o editor refeito, conferido em captura)
