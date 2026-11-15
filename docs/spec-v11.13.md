# v11.13 — A abertura nova: a perda e a promessa (6, 7 e 8) (etapa 9c)

**Situação:** aprovada (15/11)
**Origem:** `docs/ABERTURA.md` §8 e §10 (roteiro e direção fechados na entrevista de 15/11; pedido em `docs/PROPOSTAS.md`); etapa 9c do `docs/PLANO.md`.

## Objetivo
O coração da abertura ganha desenho: a despedida no quarto, a cozinha vazia onde uma estrela acende na janela e a Bia que cresce no mesmo lugar e faz a promessa. Continua só no modo dev.

## Fora do escopo
- As cenas 9 a 11 e a troca da abertura oficial (v11.14); o final (`FINAL`).

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/ABERTURA.md` §3 (direção de arte), §8 (os cenários e as cenas desta versão, quadro a quadro) e §10. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão na `ABERTURA2` desde a v11.11 e não mudam.
- **Desenho:** em `src/27-abertura-nova.js`, o cenário `ab2Quarto(c,cam)`, os modos `'noite'` e `'lar'` de `ab2Cozinha` e as cenas `AB2_CENAS.despedida`, `.janela` e `.promessa`, que deixam de ser cartão de obra.
- **Modo dev:** a entrada "Abertura nova (em obras)" já mostra as oito primeiras cenas desenhadas; nada novo no painel.
- **Versão:** `VERSAO` e `vtag` `v11.13`; a linha da abertura no `#ov-ver` passa a dizer: "A abertura está sendo refeita: quadro cheio, câmera e música. Oito cenas prontas, por enquanto só no modo dev."
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (`AB2_CENAS.despedida`, `.janela` e `.promessa` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido, e não são mais o cartão de obra) → `smoke89` (CA1)
- **CA2** (a 6 devolve as cabeças de `rosa` e `bia` e a 8, a de `bia`; no instante `de` de cada fala, a cabeça cai na tela com 40 px de margem; a 7 não tem fala) → `smoke89` (CA2)
- **CA3** (a câmera do fim da 7 é a do começo da 8, e o `sai` da 7 é `segue`) → `smoke89` (CA3)
- **CA4** (a `ABERTURA2`, as cenas 1 a 5, a abertura antiga e o `FINAL` não mudaram) → `smoke87`, `smoke88`, `smoke26` e `smoke76` sem mudança
- **CA5** (o que se vê) → captura `shot_v11_13.js`: as cenas 6, 7 e 8 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 8 também em p 0,15 e 0,3 (o tempo passando), a troca 7 para 8 e as cenas 1 e 2 de novo; conferir em recorte, contra `docs/ABERTURA.md` §3 e §8: o quarto é aconchegante, sem aparelhos; na 7 a estrela acende e o facho chega à foto; na 8 a criança dá lugar à adulta sem pulo e a estrela pisca; as cenas 1 e 2 saem iguais às da v11.11; balão fora dos rostos

## Partes
- `src/27-abertura-nova.js`: `ab2Quarto`, `ab2Cozinha` (os dois modos novos) e as três cenas.
- `src/25-abertura.js`, para ler: `abRosa`, `abBiaCrianca`, `abBia`, `abCostas`, a cena `promessa` antiga (o caderno), `abJanela`.
- `src/21-cenario.js`, para ler: `drawFotoRosa`.
- `src/43-telas.js` (`window.__lcc`, se faltar expor algo), `src/10-constantes.js` (`VERSAO`) e `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke89.js` (CA1 a CA3), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 `ab2Quarto` e a cena 6, `despedida`; captura, recorte e acerto.
- [ ] T3 `ab2Cozinha` em `'noite'` e a cena 7, `janela`; captura, recorte e acerto.
- [ ] T4 `ab2Cozinha` em `'lar'` e a cena 8, `promessa`, com a passagem do tempo; captura, recorte e acerto.
- [ ] T5 `tests/shot_v11_13.js` e a conferência do CA5.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- As cenas 7 e 8 reusam `ab2Cozinha` (v11.11): acrescente os modos `'noite'` e `'lar'` sem mudar o `'tarde'` (as capturas das cenas 1 e 2 têm de sair iguais).
- A cena 8 começa no quadro em que a 7 termina (`sai:'segue'`): confira na captura da troca que nada pula.
- A foto é a `drawFotoRosa` (`src/21-cenario.js`); a Bia adulta é a `abBia` (roupa 1); o caderno "Receitas da Rosa" já foi desenhado na cena `promessa` antiga (`src/25-abertura.js`), para aproveitar.
- É o trecho mais delicado: nada de aparelho, soro, cortina fechando ou corredor. Se não ficar bonito em duas rodadas, pare e avise.

## Testes
`smoke89` novo; `smoke87`, `smoke88`, `smoke26` e `smoke76` sem mudança; `tests/run_all.sh` verde. Capturas de `shot_v11_13.js` conferidas e apagadas. (No fechamento: o número de checagens do `smoke89`.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto — o trecho mais delicado (luz da noite, passagem do tempo), com o quadro a quadro fechado; a beleza se confere em captura.
