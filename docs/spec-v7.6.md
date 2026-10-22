# v7.6 — Tela larga: tudo na mesma tela

Retorno de jogador em 22/10 (texto em `docs/PROPOSTAS.md`): rolar para o lado faz perder o controle do jogo, que deve ser dinâmico e com tudo à vista. Das propostas (tela mais larga; espera à esquerda dentro dos 960 px; espera em cima; espera embaixo; mistura), o usuário escolheu a **1, tela mais larga**.

## O que muda
- A tela do jogo passa de 960×600 para **1220×600** (`TW = W + CALCADA.w`): a calçada (260 px), o salão e a cozinha ficam juntos, sem rolar. O mundo não mudou (vai de −260 a 960); `Game.cam` vale sempre `CALCADA.w` e só diz onde o mundo começa na tela.
- **Sai a rolagem da v7.5:** arrastar o fundo, as abinhas do alto, o grupo na borda, os 2 toques no grupo e as setas do teclado (`CAM`, `ABAS`, `setCam`, `camGo`, `updateCam`, `abaOn`, `abaHit`, `abaAlerta`, `abaPratos`, `drawAbas`). Tocar no vazio volta a ser como na v7.4: desfaz a escolha do grupo e, no dedo, mostra o anel.
- O relógio da parede fica sempre à vista (não some mais embaixo da abinha).
- **HUD espalhado** pela largura nova (`HUDX`): dia e lucro à esquerda, como antes; a fila de ações anda 130 px (no meio); mãos, pausa e som andam 260 px (à direita). `hudHit` usa os mesmos deslocamentos.
- **Escala (`fit`):** o jogo ocupa a maior largura que couber na proporção 1220×600 (~2:1).
  - Celular deitado (~2:1): a altura manda, como antes, e tudo fica **do mesmo tamanho** (740×360: escala 0,6 antes e agora), sem as faixas pretas dos lados.
  - Notebook 1366×768: 13% menor (a largura passa a mandar); 960×600 e tablet 4:3, ~21% menor.
  - Quando a tela é mais estreita que o jogo, o palco (`#stage`) fica com a altura que teria com a tela de antes (960 de largura) e o jogo fica no meio dele, para o menu e a lojinha não apertarem (o `menu_fit` passa nos 14 tamanhos). O fundo do palco ficou escuro, igual às faixas.
- Menu: a Bia acenando fica no canto direito da tela larga; a calçada aparece atrás do painel.
- Nota do dia 1 e Como jogar sem a rolagem (a dica da tela que rola virou a da Máquina de suco, com o tablet no ícone).

## Equilíbrio
As distâncias do mundo são as mesmas da v7.5, então nada muda: `balance.js` (40) passa em ~86% das metas dos dias 3 a 7 sem equipe (v7.5: ~88%, dentro da variação).

## Testes
- `smoke14` (47): a parte da câmera virou a da tela larga (`TW`, sem câmera nem abinhas, grupo, mesa, cozinha e máquina na mesma tela, arrastar o grupo até a mesa, tocar no vazio não rola, quadrinhos da fila, som e pausa no HUD largo); saíram a borda, os 2 toques, as abinhas e o movimento reduzido da rolagem.
- `smoke2`, `smoke7` e `smoke12`: os toques nos quadrinhos da fila de ações somam `HUDX.fila`.
- `menu_fit`: 14/14.
- Capturas `shot_v7_6.py` (`capturas/v7.6`): menu, dia em andamento, grupo arrastado da calçada até a mesa (com o mouse ou o dedo de verdade) e lojinha, no PC 960×600 e 1366×768, no tablet 1024×768 e no celular 740×360. O `shot_v7_5.py` saiu (as capturas da v7.5 ficam como histórico).
