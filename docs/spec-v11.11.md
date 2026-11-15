# v11.11 — Recomeçar do zero refaz abertura e Missão zero (etapa 11)

**Situação:** entregue em 15/11
**Origem:** conversa, 15/11 (pedido do usuário: quem recomeça do zero passa de novo pela abertura e pela Missão zero)

## Objetivo
Quem aperta "Recomeçar do zero" (menu, ou depois que o banco toma a lanchonete) volta ao começo de verdade: vê a abertura de novo e, ao fim dela, faz a Missão zero de novo.

## Regras (decisões tomadas)
- `Game.resetProgress` não guarda mais `treino`: o save novo nasce com a Missão zero por fazer, e `LS.abertura` volta a '0' (a abertura volta a ser "ainda não vista").
- Em `src/43-telas.js`, `recomeca()` (nova): `game.resetProgress()` e, fora do modo dev, `abrirAbertura('auto')`; no modo dev vai ao menu. A abertura 'auto' já segue para a Missão zero e depois para a conversa do capítulo 1.
- `btn-reset` (menu) e `playCareer` com `save.fechou` (botão principal e `btn-falencia-zero`) chamam `recomeca()`.
- **Modo dev / Manual:** sem mudança. **Save:** nenhum campo novo; saves antigos não mudam até o jogador recomeçar.

## Critérios de aceite
- **CA1** depois de `resetProgress`, `save.treino` é falso e `aberturaVista()` é falso → `smoke15`
- **CA2** `recomeca()` (sem dev) abre a abertura e o fim dela inicia a Missão zero → conferência no smoke

## Partes
`src/16-jogo.js` (`resetProgress`), `src/43-telas.js` (`playCareer`, `btn-reset`).

## Tarefas
- [x] T1 Mudança de código e checagens no smoke.
- [x] Fechamento: `VERSAO` v11.11, `vtag`, `#ov-ver`, `run_all.sh` verde.

## Testes
`smoke15` (ajustar a linha do Recomeçar do zero).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (mudança pequena e localizada)
