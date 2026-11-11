# v10.2.2 — Modo dev completo, parte 2 (etapa D-2, 11/11)

Origem: `docs/PLANO.md`, sessão D-2. O painel do modo dev ganha as abas **História** e **Hoje**.

## O que mudou
- **Aba História** (`devAbaHistoria`, `40-interface.js`; só no De verdade, no Livre manda passar para ele): o objetivo (`capLinha`), **Cumprir o objetivo agora** (`devCumpre`: `conversa = 'depois'`; no dia em andamento encerra o dia e a conversa toca antes dos resultados), **Assistir** (`devCenas()` e `devAssistir(i)`, `43-telas.js`: Abertura, `Cap. N, antes/depois`, as 7 conversas soltas e `Cartão: id`; não muda o save; de dentro de um dia vai antes ao menu), **Manual** (todas as fichas / só o básico), **Lojinha** (todos os cartões / como no começo do capítulo) e **Conversas soltas** (todas vistas / pendentes as do dia).
- **Aba Hoje** (`devAbaHoje`; `DEV.forca`, só na memória, zera ao sair do dev): Clima, Quebra, Fiscal, Tonhão gripado, VIP e Apito, cada um com `Sorteio` e as opções; vale a partir do próximo dia que começar. `Game.devForcaSorteio` (clima, quebra `f:0.4`, fiscal `f:0.4`, que no Livre ignora o nível do ponto), `resetDay` (gripe), `buildSchedule` (o 3º grupo vira VIP; no Terraço é o exigente; o apito). No dia: velocidade, **Encerrar o dia agora** e **Quebrar agora** (`devQuebraAgora`).
- `Game`: `devCumpre`, `devManual`, `devLojinha`, `devConversas`, `devForca`, `devQuebraAgora`. `window.__lcc` expõe `devCenas` e `devAssistir`.

## Testes
`tests/smoke64.js` (32 checagens): cumprir leva ao cap. 3; `devCenas` tem `1 + 2 * HISTORIA.length + 7 + LIBERA.length` itens; assistir não muda o save; revelar Manual, lojinha e conversas; chuva, fogão e fiscal forçados (e o contrário); VIP exigente no Terraço; gripe e apito; Quebrar agora; as abas.
