# v9.2.1 — Sessão 3b-2d: painel do modo dev (31/10/2026)

## O que entrou
- `DEV` ganhou `real` e `vel` (só na memória; `setDev` volta a `false` e `1`) e `devLivre()` (`DEV.on && !DEV.real`). Toda checagem de custo, trava ou liberação (constantes, `Game`, lojinha, `normSave` da divulgação) usa `devLivre()`; ficam com `DEV.on` o save do dev, a História, o ranking, `setDev`, `devInd`, `devToggle` e o menu.
- `Game.trocaPonto(para)` (miolo do `mudarPonto`, sem custo, capítulo nem som) e as ações do dev: `devDia`, `devPonto`, `devNota`, `devEquipe('max'|'zero')`, `devMelhorias`, `devCaixa`, `devReal`, `devFimDia` (todas `false` fora do dev).
- `passoJogo(dt)` (`43-telas.js`): até `DEV.vel` (1, 2 ou 4) updates por quadro no dev, com o dia em `playing`.
- Painel `#ov-dev` (`buildDev`, `abrirDev`, `fecharDev` em `40-interface.js`); o selo vira o botão "Modo dev · painel". Seções: Dia, Ponto, Nota do Gurugol, Equipe/cursos/melhorias, Lojinha de verdade (com Caixa) e, na pausa de um dia da carreira, No dia (velocidade e encerrar).
- Versão v9.2.1, `versoes/v9.2*.html`, painel Versões.

## Testes
- `tests/smoke44.js` (novo, 38; no `run_all.sh`). `smoke38` tem uma checagem estatística que falha às vezes (entregador ~24%), sem relação com esta etapa.
- `menu_fit.py` verde. Capturas: `tests/shot_v9_2_1.js` (`capturas/v9_2_1`, PC e celular deitado, `ERRORS: []`); o painel rola por dentro.
- Sem balanceamento: o jogo normal não mudou.
