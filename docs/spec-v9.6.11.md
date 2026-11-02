# v9.6.11 — A tela avisa (etapa 3g-2)

Retornos da Letícia (02/11, `docs/PROPOSTAS.md`).

## O que mudou
1. **Gurugol em balões** (`src/42-resultados.js`, `#end-baloes`): até 3 comentários do dia em balões grandes (15 px+) com o rostinho do tipo de cliente (`rostinhoCliente`; `result.aval.comentK`), acima das tabelas, que ficam 2 px menores.
2. **Geladeira fora da tela:** `drawGeladeira` não é mais chamada; a manutenção dela segue escondida (quebra, encarece, plaquinha em `badge`).
3. **Mesinha das marmitas** (`STATIONS.marmj`, `drawMesinha`): `MARMJ_SLOTS` = `{x:710, y:124+24i}`; a Bia pega ali (ponto `{700,150}`) e leva ao entregador; toque na mesinha = `tapStation('marmj')`; Dani também. Pratos seguem na janela.
4. **Letreiro eFood** sobre o entregador que espera (0,6 s acesa de 1 s; fixo com `prefers-reduced-motion`).
5. **Seta** sobre a mesinha (`Game.setaMesinha`): só nos dias 4 e 5 e na Missão zero.
6. **Fumaça do lixo** (`TRASH.fumaca = {cresce:30, raio:900}`, `Game.fumacaT/fumacaRaio/fumacaAlcanca`): o raio cresce em 30 s e some em 3 s ao esvaziar; o cheiro (paciência ÷ 1,3) vale só para quem ela alcança (`Group.tick`), não mais no `patPer`. Nuvens na borda; com `prefers-reduced-motion`, só o véu.

## Testes
`smoke57.js` (27 checagens). Ajustados: `smoke6` (cheiro), `smoke51` (mesinha), `bot.js` (toca `marmj`). `balance.js`: dias 4–5 voltaram ao nível anterior depois do ajuste do bot. `smoke38` já era instável (3 de 12 antes, 2 de 12 depois). `menu_fit.py` não rodou (sem playwright em Python no ambiente). Capturas: `shot_v9_6_11.js`.
