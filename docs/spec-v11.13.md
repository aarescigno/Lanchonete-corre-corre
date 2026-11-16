# v11.13 — A abertura nova: as cenas da Casa Aurora (3, 4 e 5) (etapa 9b)

**Situação:** aprovada (15/11)
**Origem:** `docs/ABERTURA.md` §7 e §10 (roteiro e direção fechados na entrevista de 15/11; pedido em `docs/PROPOSTAS.md`); etapa 9b do `docs/PLANO.md`.

## Objetivo
As três cenas da Casa Aurora ganham desenho na abertura nova: a rua ao amanhecer, a cozinha onde nasce o molho e o salão de gala onde o Bráulio fica com a fama. Continua só no modo dev.

## Fora do escopo
- As cenas 6 a 11 (v11.14 e v11.15), que seguem em cartão de obra; a troca da abertura oficial (v11.15); o final (`FINAL`).

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/ABERTURA.md` §3 (direção de arte), §7 (os cenários e as cenas desta versão, quadro a quadro) e §10. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão na `ABERTURA2` desde a v11.12 e não mudam.
- **Desenho:** em `src/27-abertura-nova.js`, os cenários `ab2RuaAurora(c,cam,modo)`, `ab2CozinhaAurora(c,cam)` e `ab2Gala(c,cam)` e as cenas `AB2_CENAS.aurora`, `.molho` e `.estrela`, que deixam de ser cartão de obra.
- **Modo dev:** a entrada "Abertura nova (em obras)" já mostra as cinco primeiras cenas desenhadas; nada novo no painel.
- **Versão:** `VERSAO` e `vtag` `v11.13`; a linha da v11.12 no `#ov-ver` passa a dizer: "A abertura está sendo refeita: quadro cheio, câmera e música. Cinco cenas prontas, por enquanto só no modo dev."
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (`AB2_CENAS.aurora`, `.molho` e `.estrela` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido, e não são mais o cartão de obra) → `smoke89` (CA1)
- **CA2** (cada cena devolve a cabeça de quem fala, `bia` e `tonhao` na 3, `tonhao` na 4 e `braulio` na 5, e, no instante `de` da fala, ela cai na tela com 40 px de margem) → `smoke89` (CA2)
- **CA3** (a `ABERTURA2` não mudou: os textos, os tempos e as câmeras das 11 cenas são os da v11.12) → `smoke88` sem mudança
- **CA4** (a abertura antiga e o `FINAL` seguem como estão) → `smoke26` e `smoke76` sem mudança
- **CA5** (o que se vê) → captura `shot_v11_13.js`: as cenas 3, 4 e 5 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390) e as trocas `passa` (3 para 4) e `iris` (4 para 5); conferir em recorte, contra `docs/ABERTURA.md` §3 e §7: o brilho é rosado e a pétala não aparece; o Bráulio grita ao fundo sem balão de fala; o pote de cominho se lê; na 5 a câmera termina na Rosa e no Tonhão, na penumbra; nenhum plano liso maior que um quarto do quadro; balão fora dos rostos

## Partes
- `src/27-abertura-nova.js`: os três cenários e as três cenas (o resto, só para ler: o kit e a cena `porta`).
- `src/25-abertura.js`, para ler: `abTonhao`, `abBraulio`, `abRosa`, `abBiaCrianca`, `abCostas`, `abPlacaMichel`, `abPanela`.
- `src/43-telas.js` (`window.__lcc`, se faltar expor algo), `src/10-constantes.js` (`VERSAO`) e `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke89.js` (CA1 e CA2), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 `ab2RuaAurora` (os dois modos) e a cena 3, `aurora`; captura, recorte e acerto.
- [ ] T3 `ab2CozinhaAurora` e a cena 4, `molho`; captura, recorte e acerto.
- [ ] T4 `ab2Gala` e a cena 5, `estrela`; captura, recorte e acerto.
- [ ] T5 `tests/shot_v11_13.js` e a conferência do CA5.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Leia de `src/27-abertura-nova.js` o kit e uma cena pronta (`porta`) como modelo; o motor não muda nesta versão.
- O Tonhão e o Bráulio já existem (`abTonhao`, `abBraulio`, com pose); a plateia de costas pode partir de `abCostas`; a placa é a `abPlacaMichel`.
- `ab2RuaAurora` recebe `modo` porque a cena 9 (v11.15) reusa em `'tarde'`: faça os dois modos já.
- Uma cena por vez: desenhe, capture, recorte, acerte; só então a próxima. Se não ficar bonita em duas rodadas, pare e avise.
- Da 9a: o boneco tem a cabeça grande, então fogão, bancada e mesa ficam na altura das mãos (y perto de 448 para o adulto de 290 px), e não a 55% da altura; a luz em `screen` vai atrás das pessoas (por cima, lava os rostos); a cena é `(c, p, T, cam)` e devolve as cabeças no espaço da cena; as capturas ficam fora do Read: recorte com o PIL para outra pasta (ver `shot_v11_12.js` e `docs/TESTES.md`).

## Testes
`smoke89` novo; `smoke88`, `smoke26` e `smoke76` sem mudança; `tests/run_all.sh` verde. Capturas de `shot_v11_13.js` conferidas e apagadas. (No fechamento: o número de checagens do `smoke89`.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto — três cenários novos no canvas, com o quadro a quadro fechado; a beleza se confere em captura.
