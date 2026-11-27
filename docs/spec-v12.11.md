# v12.11 — O salão que cabe o teto, a troca de mesas e a espera coberta (etapa 19)

**Situação:** aprovada (27/11)
**Origem:** retornos do usuário de 27/11 no `docs/PROPOSTAS.md`: "o salão da Avenida não cabe os 24 lugares", "a troca de lugar das mesas", "as pernas no sofá da Avenida", "a espera da Avenida na chuva", "o couvert cinza antes de contratar" e "a cabecinha nos cursos do Cardápio". Decisões fechadas com o usuário em 27/11 (Opus).

## Objetivo
Qualquer mistura de mesas de 2 e de 4 até o teto de lugares cabe no salão, na arrumação automática e no arrasto, nos quatro pontos. Arrastar uma mesa para cima de outra abre espaço: a outra se desloca e, se não houver lugar, vai para o estoque. Na Avenida e no Terraço, quem espera fica no seco (a chuva aparece só nas janelas do fundo, com relâmpagos); no sofá da Avenida, as pessoas sentadas têm pernas; o "Cobrar couvert" fica cinza até o couvert ser contratado; e cada curso do Cardápio mostra a cabecinha de quem aprende, sem a conta da experiência.

## Fora do escopo
- A Dani que perde uma tarefa na chegada à Avenida (retorno de 27/11): segue em aberto no `docs/PROPOSTAS.md`, sem reprodução.
- Pernas nas poltronas do Terraço: ficam como estão (o retorno fala só da Avenida).
- A chuva na Garagem e na área industrial: a espera é na rua, e a chuva continua na calçada como hoje.

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

### A espera no seco (Avenida e Terraço)
- `chuvaNaRua(ponto)`: verdadeira na Garagem e na área industrial, falsa na Avenida e no Terraço. Com ela falsa, em dia de chuva a calçada (ou o foyer) não escurece, não tem poças, nem pingos do toldo, nem os pingos diagonais por cima de tudo (`drawChuvaFundo` e `drawChuvaPingos` não desenham nada ali).
- No lugar, `drawChuvaJanela(ctx, x0, y0, x1, y1, tm)`, recortado em cada janela do fundo: o céu escurece (`rgba(52,72,104,.35)`), um chuvisco de 12 riscos curtos e finos caindo devagar, e o relâmpago.
  - Avenida: a janela grande do `drawParedeAv` (x 104–176, y 10–62) e a janela do muro da calçada (`drawCalcada`).
  - Terraço: a vista da cidade (`drawVistaTe`, onde ela é desenhada no `drawParedeTe`).
- O relâmpago sai de `relampago(tm)` (de 0 a 1, sem estado, só do tempo: um clarão a cada 6 a 12 s, numa sequência fixa, com 0,25 s de duração): a janela clareia (branco até 0,7 de opacidade, apagando), um raio em zigue-zague aparece em uma das janelas, e a tela inteira ganha um clarão leve (branco a 0,10). Com movimento reduzido (`RM`), `relampago` dá sempre 0 (nem clarão nem raio) e o chuvisco fica parado.
- O jogo não muda: o dia de chuva continua com menos gente e mais entregadores; a ficha "Dia de chuva" do Manual fica como está.

### As pernas no sofá da Avenida
- No `render` (`src/23-render.js`), quem espera sentado no sofá da Avenida passa a ter pernas (`pernas` no `drawCluster`: a condição deixa de excluir a Avenida; o Terraço continua sem). Nada muda no sofá.

### O couvert
- No cartão do couvert (`buildCouvert`, `src/41-lojinha.js`), o botão "Cobrar couvert: ..." fica **desligado e cinza** (`disabled`, `aria-pressed="false"`, CSS `.item .toggle[disabled]{opacity:.4;cursor:not-allowed}`) enquanto o couvert não é contratado. A escolha de cobrar (`equipe.taxa`) fica guardada e volta a aparecer quando ele for contratado.

### Os cursos do Cardápio com a cabecinha de quem aprende
- Todo cartão de curso da seção Cardápio (`buildCardapio` e `buildCursosAjudantes`) ganha, no canto de baixo à direita do ícone, a **cabecinha** de quem o curso afeta: o retrato redondo das conversas (`drawRetrato`, `src/26-conversa.js`), na escala 0,36, com borda branca. O Tonhão nos cursos dele; a Dani na Confeitaria; o Joca no Barista e nos Cafés especiais; o Anselmo na Coquetelaria; a Lia na Cozinha de autor. Função nova `cursoCabeca(canvas, q)` em `src/41-lojinha.js`, chamada depois de desenhar o ícone.
- Nos cartões dos ajudantes, o bonequinho inteiro de hoje (`upgradeIcon('dani')`, `'joca'`, `'anselmo'`, `'lia'`) dá lugar ao desenho do 1º item que o curso abre, com o que já desenha esse item no jogo: o doce (`drawIcon(c,'doce',...)`, com a variante 1 na caseira, 5 na gourmet e 8 na alta, as do `doceIcone`), o café (`drawIcon(c,'cafeesp',...)`, a variante 0, o espresso, no Barista e a 2, o coado, nos Cafés especiais), o drink (o ícone do 1º drink do curso, como no balão da mesa) e o prato da Lia (`drawDish` do 1º prato do curso). Os cartões do Tonhão mantêm o prato do `cursoIcon`.
- A frase "+2 de experiência para a Dani" e "+2 de experiência para o Joca" **sai** desses cartões (sempre, não só no nível máximo). Os cartões da Equipe (o da Dani e o do Joca) não mudam.

- **Modo dev:** o editor do salão já abre na lojinha do modo dev (a troca e o estoque se testam lá). Na aba Hoje, com o clima do dia em chuva, botão novo **"Relâmpago agora"** (faz o `relampago` dar o clarão no mesmo instante, `DEV.relampago = tm`). O "Clima: Chuva" que já existe força a chuva.
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
- **CA10** O "Cobrar couvert" fica `disabled` sem o couvert, liga ao contratar, e a escolha guardada de cobrar sobrevive a dispensar e recontratar → `smoke125` (10)
- **CA11** `chuvaNaRua` é falsa na Avenida e no Terraço e verdadeira na Garagem e na área industrial; `relampago` dá de 5 a 10 clarões em 60 s e, com movimento reduzido, sempre 0 → `smoke125` (11)
- **CA12** O modo dev tem o "Relâmpago agora" na aba Hoje em dia de chuva, e ele faz o `relampago` passar de 0 → `smoke125` (12)
- **CA13** Nos cartões de curso do Cardápio, nenhum texto tem "de experiência", e cada cartão de curso chama a `cursoCabeca` com quem aprende (o Tonhão nos dele, a Dani, o Joca, o Anselmo e a Lia nos deles) → `smoke125` (13)
- **CA14** O que se vê → captura `shot_v12_11.js` (960x540 e 844x390): a Avenida com 12 mesas de 2 no jogo e no editor (a faixa do estoque com mesas, sem cobrir mesa do salão); uma mesa arrastada por cima de outra (marca verde e a tracejada na que vai se mover); o sofá da Avenida com as pessoas de pernas; a chuva da Avenida e do Terraço (calçada e foyer secos, chuvisco nas janelas, um quadro com relâmpago e um com movimento reduzido); o cartão do couvert não contratado (o botão cinza); o Cardápio da Avenida e o do Terraço com a cabecinha em cada curso (Tonhão, Dani, Joca, Anselmo e Lia) e os desenhos novos dos cursos dos ajudantes
- **CA15** `python3 menu_fit.py`: a lojinha com o editor do salão continua cabendo nos 14 tamanhos

## Partes
- `src/10-constantes.js`: `SALAO.gap`, `PONTOS[].area`, `salaoTroca` (nova, perto da `salaoPerto`), `chuvaNaRua` (nova).
- `src/16-jogo.js`: `buyMesa` (texto), `moverMesa`, `tirarMesa`.
- `src/41-lojinha.js`: `EST`, `estSlots`, `naEst`, `drawEstoque`, `edValida`, `edEvents` (`pointerup`), `drawEditor` (as marcas), `buildSalao` (o `aria-label` e o balãozinho do estoque), `buildCouvert`, `buildCardapio`, `buildCursosAjudantes`, `cursoCabeca` (nova).
- `src/01-estilo.css`: `.item .toggle[disabled]`.
- `src/21-cenario.js`: `drawChuvaFundo`, `drawChuvaPingos`, `drawChuvaJanela` e `relampago` (novas), `drawParedeAv`, `drawCalcada`, `drawParedeTe`.
- `src/23-render.js`: a condição `pernas` da espera (linha do `drawCluster`, ~92) e o clarão da tela.
- `src/40-interface.js`: `devAbaHoje` (o "Relâmpago agora").
- `src/43-telas.js`: expor `salaoTroca`, `chuvaNaRua`, `relampago`, `EST`, `naEst`, `estSlots` no `window.__lcc`.

## Tarefas
- [ ] T1 Smoke novo `smoke125` com os critérios de aceite (falhando) e no `tests/run_all.sh`.
- [ ] T2 O salão: `SALAO.gap`, as áreas, o texto do `buyMesa`.
- [ ] T3 O estoque na faixa do alto (`EST`, `estSlots`, `naEst`, `drawEstoque`, o balãozinho, o `aria-label`).
- [ ] T4 A `salaoTroca`, o `moverMesa`/`tirarMesa` e o arrasto do editor com as marcas e a mensagem.
- [ ] T5 A chuva nas janelas e o relâmpago (Avenida e Terraço), com o "Relâmpago agora" do modo dev.
- [ ] T6 As pernas no sofá da Avenida e o couvert cinza.
- [ ] T7 A cabecinha nos cursos do Cardápio, os desenhos dos cursos dos ajudantes e a frase da experiência fora.
- [ ] T8 `shot_v12_11.js` (CA14): conferir em recortes ampliados, ajustar e apagar as capturas; `python3 menu_fit.py` (CA15).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, os destinos no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A conta da geometria foi feita com um script que muda `L.SALAO.gap` e `L.PONTOS[i].area` pelo `harness.js` e roda a `salaoAuto` em todas as misturas: o CA1 do smoke pode ser o mesmo laço.
- `salaoPerto(l, i, ponto)` já procura o lugar válido mais perto da mesa `i` (folga e caminho): a `salaoTroca` põe a deslocada na posição antiga dentro da lista sem as outras deslocadas e chama a `salaoPerto`.
- Com a área da Avenida começando em x 40, a mesa da esquerda tem o lado esquerdo de chegada da Bia em x ~-24 (na calçada, dentro do `BOUNDS`): vale como chegada; não restrinja a `tableApproach`.
- O `tableApproach` do lado esquerdo das mesas da fileira de baixo no Terraço cai dentro do piano e fica fechado; o lado direito resolve (o CA1 já mede com o caminho).

## Testes
- Smoke novo: `smoke125` (CA1 a CA13). Captura: `shot_v12_11.js` (CA14). `python3 menu_fit.py` (CA15).
- Sem mudança no equilíbrio: a Bia e as mesas são as mesmas; não precisa de `balance.js` nem de `carreira.js` (o `run_all.sh` cobre o resto).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (muitas partes ao mesmo tempo: a geometria, o editor com a troca, o desenho novo da chuva, do relâmpago e dos ícones dos cursos, conferido em captura)
