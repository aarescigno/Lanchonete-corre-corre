# v11.15 — A abertura nova no ar: a virada (9, 10 e 11), a troca e a limpeza (etapa 9d)

**Situação:** entregue em 16/11
**Origem:** `docs/ABERTURA.md` §9 e §10 (roteiro e direção fechados na entrevista de 15/11; pedido em `docs/PROPOSTAS.md`); etapa 9d do `docs/PLANO.md`.

## Objetivo
A abertura nova fica completa e passa a ser a do jogo: o tio que larga a Casa Aurora, o carimbo do banco e a Bia erguendo o portão da garagem. A abertura antiga sai.

## Fora do escopo
- O final (`FINAL`) e os créditos no mesmo tratamento: Etapa 10 do `docs/PLANO.md`, a planejar. Até lá o `FINAL` segue com a faixa de legenda e os cenários antigos.

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/ABERTURA.md` §3 (direção de arte), §9 (os cenários e as cenas desta versão, quadro a quadro) e §10. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão na `ABERTURA2` desde a v11.12 e não mudam.
- **Desenho:** em `src/27-abertura-nova.js`, os cenários `ab2Banco(c,cam,o)` e `ab2RuaCasa(c,cam,k,o)` (o `o` leva o relógio `T`, as pessoas e o que a cena anima: o papel e a gerente; o letreiro e a estrela) e as cenas `AB2_CENAS.tio`, `.banco` e `.portao`; o `ab2Obra` (cartão de obra) sai.
- **A troca:** `ABERTURA` passa a ser o roteiro novo (o nome `ABERTURA2` deixa de existir; `AB2_CENAS` e os `ab2...` ficam com o nome que têm). A abertura que toca sozinha na 1ª vez e a do botão "Ver abertura" são a nova. Quem já viu a antiga não a vê de novo sozinho (`LS.abertura` não muda).
- **A limpeza:** saem as 10 cenas antigas da `AB_CENAS` (`casa`, `aurora`, `tempero`, `estrela`, `hospital`, `saudade`, `promessa`, `tonhao`, `banco`, `inauguracao`) e as funções de `src/25-abertura.js` que só elas usavam (`abBanquinho` e `abFachadaBanco`; as outras, como `abCozinhaCasa`, `abPanela` e `abFachadaAurora`, o `FINAL` ainda usa). Tudo o que o `FINAL` usa fica, e o `FINAL` continua desenhado pelo caminho antigo (`abLegenda`, `fade`).
- **Modo dev:** a entrada "Abertura nova (em obras)" sai; "Abertura" toca a nova.
- **Leitor de tela:** `Abertura.texto()` como hoje, com os textos novos.
- **Versão:** `VERSAO` e `vtag` `v11.15`; no `#ov-ver`, a linha da abertura passa a dizer: "Abertura nova: a história da Bia e da Rosa refeita como um filminho, com quadro cheio, câmera, luz e música."
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (`AB2_CENAS.tio`, `.banco` e `.portao` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido; `tonhao` na 9 e na 11 e `bia` na 10 caem na tela no instante da fala, com 40 px de margem) → `smoke91` (CA1)
- **CA2** (`ABERTURA` é o roteiro novo: 11 cenas, os `id` e os textos de `docs/ABERTURA.md` §4, soma 77 s; `ABERTURA2` não existe; nenhuma cena cai em cartão de obra) → `smoke91` (CA2)
- **CA3** (a abertura nova toca sozinha na 1ª vez e marca `LS.abertura`; pelo botão, volta ao menu; o toque segue, Voltar volta, Pular termina; não mexe no save; com movimento reduzido só o toque avança; o som da cena é cortado ao trocar; depois de "Recomeçar do zero" (v11.11), é a nova que toca e segue para a Missão zero) → `smoke26` reescrito
- **CA4** (modo dev: há "Abertura" e não há "Abertura nova (em obras)"; "Abertura" abre o roteiro novo) → `smoke91` (CA4)
- **CA5** (as 10 cenas antigas não existem mais na `AB_CENAS`; as do `FINAL` existem e desenham sem erro com 1, 2 e 3 estrelas) → `smoke91` (CA5) e `smoke76` (com os nomes das cenas da abertura trocados, ver Desvios)
- **CA6** (o `#ov-abertura` cabe nos 14 tamanhos de tela) → `python3 menu_fit.py`
- **CA7** (o que se vê) → captura `shot_v11_15.js`: as cenas 9, 10 e 11 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 11 também em p 0,5 e 0,75 (o portão subindo e o letreiro acendendo), e a folha das 11 cenas em p 0,6; conferir em recorte, contra `docs/ABERTURA.md` §3 e §9: na 9 o avental fica na maçaneta e a touca na cabeça; na 10 o "APROVADO" se lê; na 11 a luz sai da garagem para a calçada, o letreiro acende, a estrela pisca e o título não cobre ninguém; as 11 cenas juntas têm unidade de luz e de cor

## Partes
- `src/27-abertura-nova.js`: `ab2Banco`, `ab2RuaCasa`, as três cenas, a saída do `ab2Obra`.
- `src/18-abertura.js`: `ABERTURA` (o roteiro novo no lugar do antigo), `aberturaSom`.
- `src/25-abertura.js`: a limpeza da `AB_CENAS` e das funções órfãs; `drawAbertura`.
- `src/43-telas.js`: `devCenas`, `devAssistir`, `abrirAbertura`, `window.__lcc`.
- `src/10-constantes.js` (`VERSAO`) e `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [x] T1 Smoke novo `tests/smoke91.js` (CA1, CA2, CA4 e CA5) e o `tests/smoke26.js` reescrito (CA3), vistos falhar; `smoke91` no `tests/run_all.sh`.
- [x] T2 A cena 9, `tio`; captura, recorte e acerto.
- [x] T3 `ab2Banco` e a cena 10, `banco`; captura, recorte e acerto.
- [x] T4 `ab2RuaCasa` e a cena 11, `portao`; captura, recorte e acerto.
- [x] T5 A troca (`ABERTURA`), o modo dev e os smokes `87` a `89` ajustados.
- [x] T6 A limpeza de `src/25-abertura.js`, com o `smoke76` verde.
- [x] T7 `tests/shot_v11_15.js`, a folha das 11 cenas e a conferência do CA7; o editor de desenhos abrindo a `AB2_CENAS`.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, o `CLAUDE.md` (a parte `27` e o editor), esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge; avisar o usuário para publicar e para atualizar o artifact do editor.

## Avisos para a execução
- Antes de apagar qualquer função de `src/25-abertura.js`, confira com `grep` se o `FINAL` (as cenas `telefone` a `creditos`), o `src/27-abertura-nova.js` ou outra parte a usa; na dúvida, fica.
- A cena 9 reusa `ab2RuaAurora` em `'tarde'` (v11.13); a Bia de costas é a `abCostas`; a foto na mão é a `drawFotoRosa`, pequena.
- O `smoke26` confere a abertura antiga cena a cena: reescreva-o para a nova (as mesmas garantias: toca sozinha uma vez, o toque segue, Pular termina, não mexe no save, movimento reduzido só avança por toque).
- O editor de desenhos (`ferramentas/editor.py`) acha as cenas pela `AB_CENAS`: confira que ele abre `src/27-abertura-nova.js` e a `AB2_CENAS`; se precisar, ajuste a ferramenta (não pede spec).
- Se as cenas não ficarem bonitas em duas rodadas de captura, pare e avise.

## Testes
`smoke91` novo, com 37 checagens, e `smoke26` reescrito para a abertura nova, com 46 (os dois vistos falhar no jogo da v11.14: 9 e 7 falhas); `smoke88` a `smoke90` ajustados onde citavam `ABERTURA2` ou a entrada "em obras" (o `smoke88` ficou com 84 checagens); `smoke64` e `smoke76` ajustados (ver Desvios); `tests/run_all.sh --tudo` verde (`menu_fit.py` com 644 conferências e 0 falha, 14 delas novas, dos botões da abertura). Capturas de `shot_v11_15.js` (40, em duas rodadas de acerto, mais a folha das 11 cenas) conferidas em recorte e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
- **Medidas:** `smoke91` com 37 checagens e `smoke26` com 46; `tests/run_all.sh --tudo` verde; `menu_fit.py` com 644 conferências e 0 falha.
- **Modelo:** executada com o Fable 5.2, esforço alto, na mesma sessão das outras três, a pedido do usuário (16/11), e não com o Sonnet.
- **`smoke76` e `smoke64` mudaram** (o CA5 pedia o `smoke76` sem mudança): o `smoke76` conferia, de passagem, a abertura antiga (as dez cenas, a legenda da cena 1 e o `id` `casa`); essas quatro checagens passaram a citar a nova. As checagens do `FINAL` não mudaram. O `smoke64` voltou a contar uma só entrada de abertura no modo dev.
- **`smoke88`:** o CA2 dele ("a abertura antiga segue como está") virou "o `FINAL` segue no motor antigo", e o CA3, "a entrada Abertura toca a nova".
- **Cena 11, proporções:** as pessoas ficam com 78% do tamanho dos planos abertos (o portão precisa ser mais alto do que elas e ainda sobrar céu para o letreiro, o telhado e o título). São desenhadas por cima da noite, já com as cores escurecidas (`ab2Noite`), para ficarem em contraluz quando o portão abre, em vez de lavadas pela luz.
- **Cena 11, a estrela da Rosa** fica no alto, à direita (perto dos botões Voltar e Pular, sem ficar atrás deles); o título entra em y = 52, acima do telhado.
- **Cena 10, o papel** fica numa prancheta inclinada na frente do guichê, para o "APROVADO" se ler de frente; o carimbo sobe para o lado depois de bater, sem cobrir o rosto da gerente. A gerente é uma pessoa do jogo (`drawPerson`, de óculos e blazer), não a Cami.
- **Cena 9, o abraço:** a Bia passa para a frente do tio; a câmera, que encosta na borda (v11.12), vai de 712 a 508.
- **`menu_fit.py`:** não conferia o `#ov-abertura` (o CA6 contava com isso) e esperava 21 linhas na lista das Versões, número de antes da v11.11. Ganhou a conferência dos botões Voltar e Pular da abertura nos 14 tamanhos (à vista, com 44 px de altura ou mais, sem se cobrir; `python3 menu_fit.py abertura`) e passou a esperar 24 linhas.
- **Editor de desenhos** (`ferramentas/`): passa a abrir `src/27-abertura-nova.js` e `src/25-abertura.js`, acha as cenas pela `AB2_CENAS` e não mostra a transição para a cena seguinte. Os pontos seguem a câmera sem mudança (ele guarda a transformação do canvas de cada número). O artifact do editor precisa ser publicado de novo para mostrar as cenas novas.
- **`versoes/`:** nada a guardar (a v11.15 segue na série v11).

**Modelo:** Sonnet, esforço alto — três cenas, a troca e a limpeza do código antigo, que pede cuidado com o que o final ainda usa.
