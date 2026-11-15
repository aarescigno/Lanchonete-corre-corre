# v11.15 — A abertura nova no ar: a virada (9, 10 e 11), a troca e a limpeza (etapa 9d)

**Situação:** aprovada (15/11)
**Origem:** `docs/ABERTURA.md` §9 e §10 (roteiro e direção fechados na entrevista de 15/11; pedido em `docs/PROPOSTAS.md`); etapa 9d do `docs/PLANO.md`.

## Objetivo
A abertura nova fica completa e passa a ser a do jogo: o tio que larga a Casa Aurora, o carimbo do banco e a Bia erguendo o portão da garagem. A abertura antiga sai.

## Fora do escopo
- O final (`FINAL`) e os créditos no mesmo tratamento: Etapa 10 do `docs/PLANO.md`, a planejar. Até lá o `FINAL` segue com a faixa de legenda e os cenários antigos.

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/ABERTURA.md` §3 (direção de arte), §9 (os cenários e as cenas desta versão, quadro a quadro) e §10. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão na `ABERTURA2` desde a v11.12 e não mudam.
- **Desenho:** em `src/27-abertura-nova.js`, os cenários `ab2Banco(c,cam)` e `ab2RuaCasa(c,cam,k)` e as cenas `AB2_CENAS.tio`, `.banco` e `.portao`; o `ab2Obra` (cartão de obra) sai.
- **A troca:** `ABERTURA` passa a ser o roteiro novo (o nome `ABERTURA2` deixa de existir; `AB2_CENAS` e os `ab2...` ficam com o nome que têm). A abertura que toca sozinha na 1ª vez e a do botão "Ver abertura" são a nova. Quem já viu a antiga não a vê de novo sozinho (`LS.abertura` não muda).
- **A limpeza:** saem as 10 cenas antigas da `AB_CENAS` (`casa`, `aurora`, `tempero`, `estrela`, `hospital`, `saudade`, `promessa`, `tonhao`, `banco`, `inauguracao`) e as funções de `src/25-abertura.js` que só elas usavam. Tudo o que o `FINAL` usa fica, e o `FINAL` continua desenhado pelo caminho antigo (`abLegenda`, `fade`).
- **Modo dev:** a entrada "Abertura nova (em obras)" sai; "Abertura" toca a nova.
- **Leitor de tela:** `Abertura.texto()` como hoje, com os textos novos.
- **Versão:** `VERSAO` e `vtag` `v11.15`; no `#ov-ver`, a linha da abertura passa a dizer: "Abertura nova: a história da Bia e da Rosa refeita como um filminho, com quadro cheio, câmera, luz e música."
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (`AB2_CENAS.tio`, `.banco` e `.portao` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido; `tonhao` na 9 e na 11 e `bia` na 10 caem na tela no instante da fala, com 40 px de margem) → `smoke90` (CA1)
- **CA2** (`ABERTURA` é o roteiro novo: 11 cenas, os `id` e os textos de `docs/ABERTURA.md` §4, soma 77 s; `ABERTURA2` não existe; nenhuma cena cai em cartão de obra) → `smoke90` (CA2)
- **CA3** (a abertura nova toca sozinha na 1ª vez e marca `LS.abertura`; pelo botão, volta ao menu; o toque segue, Voltar volta, Pular termina; não mexe no save; com movimento reduzido só o toque avança; o som da cena é cortado ao trocar; depois de "Recomeçar do zero" (v11.11), é a nova que toca e segue para a Missão zero) → `smoke26` reescrito
- **CA4** (modo dev: há "Abertura" e não há "Abertura nova (em obras)"; "Abertura" abre o roteiro novo) → `smoke90` (CA4)
- **CA5** (as 10 cenas antigas não existem mais na `AB_CENAS`; as do `FINAL` existem e desenham sem erro com 1, 2 e 3 estrelas) → `smoke90` (CA5) e `smoke76` sem mudança
- **CA6** (o `#ov-abertura` cabe nos 14 tamanhos de tela) → `python3 menu_fit.py`
- **CA7** (o que se vê) → captura `shot_v11_15.js`: as cenas 9, 10 e 11 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 11 também em p 0,5 e 0,75 (o portão subindo e o letreiro acendendo), e a folha das 11 cenas em p 0,6; conferir em recorte, contra `docs/ABERTURA.md` §3 e §9: na 9 o avental fica na maçaneta e a touca na cabeça; na 10 o "APROVADO" se lê; na 11 a luz sai da garagem para a calçada, o letreiro acende, a estrela pisca e o título não cobre ninguém; as 11 cenas juntas têm unidade de luz e de cor

## Partes
- `src/27-abertura-nova.js`: `ab2Banco`, `ab2RuaCasa`, as três cenas, a saída do `ab2Obra`.
- `src/18-abertura.js`: `ABERTURA` (o roteiro novo no lugar do antigo), `aberturaSom`.
- `src/25-abertura.js`: a limpeza da `AB_CENAS` e das funções órfãs; `drawAbertura`.
- `src/43-telas.js`: `devCenas`, `devAssistir`, `abrirAbertura`, `window.__lcc`.
- `src/10-constantes.js` (`VERSAO`) e `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke90.js` (CA1, CA2, CA4 e CA5) e o `tests/smoke26.js` reescrito (CA3), vistos falhar; `smoke90` no `tests/run_all.sh`.
- [ ] T2 A cena 9, `tio`; captura, recorte e acerto.
- [ ] T3 `ab2Banco` e a cena 10, `banco`; captura, recorte e acerto.
- [ ] T4 `ab2RuaCasa` e a cena 11, `portao`; captura, recorte e acerto.
- [ ] T5 A troca (`ABERTURA`), o modo dev e os smokes `87` a `89` ajustados.
- [ ] T6 A limpeza de `src/25-abertura.js`, com o `smoke76` verde.
- [ ] T7 `tests/shot_v11_15.js`, a folha das 11 cenas e a conferência do CA7; o editor de desenhos abrindo a `AB2_CENAS`.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, o `CLAUDE.md` (a parte `27` e o editor), esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge; avisar o usuário para publicar e para atualizar o artifact do editor.

## Avisos para a execução
- Antes de apagar qualquer função de `src/25-abertura.js`, confira com `grep` se o `FINAL` (as cenas `telefone` a `creditos`), o `src/27-abertura-nova.js` ou outra parte a usa; na dúvida, fica.
- A cena 9 reusa `ab2RuaAurora` em `'tarde'` (v11.13); a Bia de costas é a `abCostas`; a foto na mão é a `drawFotoRosa`, pequena.
- O `smoke26` confere a abertura antiga cena a cena: reescreva-o para a nova (as mesmas garantias: toca sozinha uma vez, o toque segue, Pular termina, não mexe no save, movimento reduzido só avança por toque).
- O editor de desenhos (`ferramentas/editor.py`) acha as cenas pela `AB_CENAS`: confira que ele abre `src/27-abertura-nova.js` e a `AB2_CENAS`; se precisar, ajuste a ferramenta (não pede spec).
- Se as cenas não ficarem bonitas em duas rodadas de captura, pare e avise.

## Testes
`smoke90` novo; `smoke26` reescrito para a abertura nova; `smoke87` a `smoke89` ajustados onde citavam `ABERTURA2` ou a entrada "em obras"; `smoke76` sem mudança; `tests/run_all.sh --tudo` verde (o `menu_fit` confere o `#ov-abertura`). Capturas de `shot_v11_15.js` conferidas e apagadas. (No fechamento: o número de checagens do `smoke90` e do `smoke26`.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto — três cenas, a troca e a limpeza do código antigo, que pede cuidado com o que o final ainda usa.
