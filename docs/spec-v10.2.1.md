# v10.2.1 — Modo dev completo, parte 1 (etapa D-1, 11/11)

Origem: `docs/PLANO.md`, sessão D-1. O modo dev passa a ter dois jeitos e um painel em abas, para pular de capítulo, mexer no dinheiro e na equipe e jogar a História de verdade.

## O que mudou
- **Dois jeitos** (`DEV.real`, agora gravado em `localStorage` `lcc2_dev_real`): **Livre** (tudo de graça e aberto, sem História) e **De verdade** (preços, travas e o Modo História). `histLiga()` (`12-clientes.js`) = `HIST.on && !devLivre()` e substitui `HIST.on && !DEV.on` em `16-jogo.js` e `43-telas.js` (o `normSave`, a abertura e o `treinoPrimeiro` seguem com `!DEV.on`).
- **Painel em abas** (`buildDev`, `40-interface.js`; `DEV.aba`): **Pular** (capítulos 1 a 9 e Fim, Desfazer o pulo, Dia, Ponto, "No dia" com 1×, 2×, 4× e 8×), **Dinheiro** (caixa +100, +1.000, +10.000, −1.000, Zerar; banco: Quitar, Pegar R$ 1.000, Atrasar a parcela) e **Equipe e lojinha** (Tudo no máximo, Do começo, uma linha por pessoa com − e +, Cursos, Melhorias, Decoração, Manutenção e a Nota do Gurugol). As abas História e Hoje vêm na D-2.
- **`DEV_CAPS`** (`10-constantes.js`): a tabela do começo de cada capítulo (dia, ponto, caixa, nota, equipe, cursos, melhorias).
- **Ações** (`16-jogo.js`, só com `DEV.on`): `devCapitulo(n)` (guarda o save dev em `lcc2_save_dev_bak`, monta o save pela tabela: banco, conversas soltas, cartões da lojinha, Manual), `devDesfaz`, `devDinheiro`, `devBanco`, `devNivel`, `devCursos`, `devDecor`, `devManut`; `devEquipe` passou a usar `devCursos` e `devSegueCursos`. O `devCaixa` saiu do painel (o Dinheiro o substitui); o método continua, só para os testes antigos.
- `window.__lcc` expõe `histLiga` e `DEV_CAPS`.

## Testes
`tests/smoke63.js` (81 checagens): Livre sem História; `lcc2_dev_real`; os ids da `DEV_CAPS` existem; `devCapitulo(1..10)` confere cap, ponto, dia, `pontoDia`, caixa, equipe, `capObj` e a conversa de antes; desfazer volta o save (JSON igual); dinheiro e banco; `devNivel` (Anselmo 0→2); cursos, decoração e manutenção; as 3 abas; `DEV.vel = 8`; o save de verdade intacto. `smoke44` ajustado ao painel novo.

## Fora do que foi conferido
Captura visual do painel (900×600 e 390×844): as capturas foram bloqueadas na sessão; só se mediu pelo DOM que a página não rola (o painel rola por dentro).
