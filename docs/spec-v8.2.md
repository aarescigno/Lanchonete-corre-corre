# v8.2 — Missão zero (o dia de treino)

Pedido do usuário em 22/10 (texto em `docs/PROPOSTAS.md`): uma missão tutorial, "tipo um dia zero", com pop-ups que mostram todo o fluxo de tarefas da Bia.

## Como se chega
- No menu, a fileira de dias ganhou o **chip 0** (mostarda, "Dia 0: Missão zero, o treino"), sempre aberto. Escolher o 0 e tocar em **Carreira** começa o treino direto, sem a introdução do dia nem a lojinha.
- Quem nunca fez a Missão zero e ainda está no dia 1 (fora do modo dev) já abre o menu com o **0 escolhido** (`treinoPrimeiro`).
- Quem pula o treino vê, na introdução do dia 1, "Primeira vez? No menu, o dia 0 é a Missão zero, um treino passo a passo."
- No fim, a tela **"Missão zero completa!"** (`#ov-treino`) oferece **Começar o dia 1** e **Menu**. O save ganha `treino:true` e o menu volta a abrir no dia 1.

## O treino
- Uma mesa só: o salão é o kit da Garagem e a mesa do treino é a de 2 lugares com cadeiras azuis. Chega um casal de vovós com camisas azuis e **1 coração** (para cada atendimento mostrar o coração voltando; chegam a 5 na conta).
- **A paciência não acaba** (`Group.tick` não anda no modo `treino`), não há relógio (o da parede conta para a frente, como no Turno sem fim), nem caprichado do Tonhão.
- **Nada vai para a carreira:** o treino troca o save por um de jogador novo (`normSave({})` com `_treino`, sem melhorias, equipe, Água da torneira ou Dani), que `writeSave` nunca grava. O de verdade fica em `game.salvo` e volta ao sair (fim, Menu da pausa ou qualquer `resetDay` que não seja o treino). Reiniciar na pausa recomeça o treino.
- Só a mesa do treino recebe o grupo: outra mesa responde "Procure as cadeiras azuis!".
- HUD: "Treino", o que entrou e "Missão zero · passo N de 23", no lugar da meta.

## Os 23 passos (`TREINO_PASSOS`, em `src/17-treino.js`)
Passo de **explicação** (`ok`): o jogo para, o resto da tela escurece com um buraco no alvo e qualquer toque (ou Enter) segue; a pausa e o som continuam funcionando. Passo de **ação** (`feito`): o jogo anda, o cartão diz "Sua vez!" e segue sozinho quando a condição vale.

| # | Passo | Tipo | O que ensina |
|---|---|---|---|
| 1 | oi | explicação | o treino: uma mesa, sem perder paciência, sem contar para a carreira |
| 2 | chega | espera | a freguesia espera lá fora, na calçada |
| 3 | coracoes | explicação | corações são a paciência; atendimento devolve 1; mais corações, mais dinheiro |
| 4 | cor | explicação | cor das camisas e das cadeiras: bônus de R$ 15 |
| 5 | sentar | ação | arrastar o grupo até a mesa (ou tocar no grupo e na mesa) |
| 6 | cardapio | espera | sentar vale R$ 10 e 1 coração, a cor mais R$ 15; o balão do cardápio |
| 7 | anotar | ação | balão "!": tocar na mesa para anotar |
| 8 | fila | explicação | MÃOS e FILA de ações no HUD; tocar no quadrinho cancela |
| 9 | cozinha | ação | levar a comanda ao Tonhão |
| 10 | preparo | espera | o Tonhão cozinhando |
| 11 | prato | ação | pegar o prato pronto no balcão |
| 12 | servir | ação | servir (R$ 20 e 1 coração) |
| 13 | cafe | ação | pegar o cafezinho (a refeição espera: `segura`) |
| 14 | cafe2 | ação | servir o cafezinho |
| 15 | bonus | explicação | cafezinho: R$ 5 e 1 coração (2 com a Cafeteira de 2 bocas); 5 corações: conta 50% maior, 1: 40% menor |
| 16 | comendo | espera | quando acabam, pedem a conta (balão "$") |
| 17 | cobrar | ação | cobrar |
| 18 | conta | explicação | a conta de verdade ("a conta de R$ 36 virou R$ 54"); o que entra é a pontuação |
| 19 | louca | ação | recolher a louça (mesa suja não recebe ninguém) |
| 20 | pia | ação | deixar a louça na pia |
| 21 | lavar | ação | lavar de mãos vazias; o prato volta para a cozinha |
| 22 | lixo | ação | lavar enche a lixeira; cheia, cheira mal; tirar o lixo de mãos vazias |
| 23 | fim | explicação | na carreira, vários grupos e várias tarefas seguidas; corrente |

## Desenho (`src/24-treino.js`)
Cartão creme com faixa azul, título, texto e "Missão zero · passo N de 23"; "Continuar ▸" (ou "Concluir ▸" no último) nas explicações. O cartão vai para o primeiro lugar (alto ou embaixo, no meio ou nos cantos) que não cobre nenhum alvo (`treinoLugar`). Cada alvo ganha um anel tracejado mostarda e o primeiro, uma seta; com movimento reduzido, nada pulsa. O texto de cada passo também vai para `#treino-live` (`role=status`), para leitor de tela.

## Código
- `10-constantes.js`: `TREINO` (o "dia" do treino).
- `12-clientes.js`: `save.treino`; `writeSave` ignora o save com `_treino`; `Group.tick` parado no treino; cardápio e refeição param com `game.treinoSegura`.
- `16-jogo.js`: `startTreino`, `sairTreino`, `acabouTreino`, `resetDay(n, treino)`, modo `treino` no `update` (sem chegadas nem relógio), `seatGroup` só na mesa do treino, `collectBill` guarda a conta, `onDown` segue as explicações.
- `17-treino.js` (novo): `TREINO_PASSOS` e a classe `Treino` (passo, alvos, chegada do grupo, `seguir`, `update`).
- `24-treino.js` (novo): `drawTreino`.
- `22-salao-hud.js`, `23-render.js`, `21-cenario.js`: HUD, chamada do desenho e relógio.
- `40-interface.js` e `43-telas.js`: chip 0, `treinoPrimeiro`, `playCareer(0)`, `#ov-treino`, Reiniciar, Enter e o leitor de tela.
- CSS: chips do menu um pouco mais estreitos (8 numa linha, `menu_fit` ok em 740×360, 667×375 e 568×320) e `.sr`.

## Testes
- `tests/smoke18.js` (70 checagens): joga o treino inteiro com toques de verdade (arrastar, tocar na mesa e nas estações), confere cada passo, os corações (1 → 5), a conta ×1,5, que o save de verdade não muda durante o treino e ganha `treino:true` no fim, o convite do dia 1, Reiniciar e Menu no meio do treino.
- `tests/smoke15.js` acha o chip do dia 1 pelo nome (o 1º chip agora é o 0).
- `tests/shot_v8_2.py`: capturas em `capturas/v8.2`.
- Sem mudança de regra nem de equilíbrio na carreira.
