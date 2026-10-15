# v7.1 — Jogo justo: dá para não perder ninguém

Etapa 1a do `docs/PLANO.md`, a partir do áudio do Renan Martorelli (texto em `docs/PROPOSTAS.md`): "nem que você fosse extremamente bom, você conseguiria atender todo mundo". O objetivo é que quem joga com perfeição possa terminar com menos corações, mas sem perder nenhum cliente.

Decisões do usuário (15/10): mecânicas A (fila justa) e B (porta que respeita a lotação); a fila justa vale no Turno sem fim, **mas sem o piso** de 1 coração; com o ícone "aguardando mesa".

## 1. Onde se perdia (medição)
`balance.js` passou a mostrar as perdas por causa (`result.lostBy`): na fila sem mesa que sirva (`semMesa`), na fila com mesa que serve (`comMesa`), esperando o pedido, o prato ou a conta, e os VIPs perdidos. Também mostra o tempo de salão lotado (`lotadoT`), o atraso da porta (`atraso`), os dias com zero perdidos (`zero`) e as 3 estrelas (`3★`).

Na v7, com a equipe completa, o bot de sempre perdia de 1,8 a 2,8 grupos por dia nos dias 4 a 7. Num diagnóstico de 200 dias (dias 3 a 7):
- ~40% esperando o prato **sem prato limpo** (os pratos estavam todos em uso nas mesas ou no balcão);
- ~25% com o prato **pronto no balcão ou na mão da Bia** (prioridade do bot);
- ~15% na **fila**, quase sempre família esperando mesa de 4 com todas ocupadas: o caso do Renan. O bot só olhava o 1º da fila.

## 2. Bot afiado (o "jogador perfeito")
`tests/bot.js` ganhou o bot afiado (`require('./bot.js')(g, L, {afiado:true})`; no `balance.js`, `BOT=afiado`; na página, `botAfiado()` e `run(seg, 'afiado')`). Ele:
- faz uma ação de cada vez, sempre a mais urgente: o tempo que o grupo ainda aguenta (corações × paciência) menos a caminhada até lá;
- senta qualquer grupo da fila que caiba (o mais apressado primeiro, na menor mesa);
- serve cafezinho a quem está com 2 corações ou menos;
- lava a louça quando faltam pratos limpos.

O bot de sempre continua sendo o "jogador comum" das metas (elas foram calibradas com ele).

## 3. Mecânicas
- **A. Fila justa** (`FILA_JUSTA = { ritmo:0.4, piso:0.5 }`, `Group.tickQueue`): enquanto não há mesa aberta e sem grupo onde o grupo caiba, a paciência na fila corre a 40% do ritmo. Mesa suja conta como mesa que serve, porque é só recolher a louça. Na carreira, a paciência não passa de 1 coração com metade da paciência dele (o piso), até abrir uma mesa; aí volta ao ritmo normal. No Turno sem fim vale o ritmo, mas não o piso.
- **B. Porta que respeita a lotação** (`PORTA = { fila:3, max:8, total:0.2 }`, `Game.lotado`): na carreira, com todas as mesas abertas ocupadas por grupos e 3 ou mais grupos na fila, a chegada da vez espera até 8 s, e as seguintes andam junto (`Game.atraso`). O atraso total do dia vai até 20% do tempo do dia. O total de grupos não muda (a agenda ocupa ~55% do dia, então sobra tempo). No Turno sem fim a porta não segura ninguém.
- **Ícone "aguardando mesa"** (`drawWaitBadge`): balãozinho com mesa e relógio ao lado dos corações de quem está na fila sem mesa que sirva. O relógio gira (parado com `prefers-reduced-motion`); no piso, fica azul e parado, e o último coração deixa de piscar.
- **Como jogar:** a dica dos corações explica a fila justa.

## 4. Números (bot afiado, equipe completa do dia 3 em diante)
| | Dias 3 a 7: perdidos por dia | Dias com 0 perdidos |
|---|---|---|
| v7 | 0,5 a 1,3 (fila sem mesa: 0,2 a 0,5) | 49% |
| v7.1 | 0,1 a 0,6 (fila sem mesa: 0) | 71% |
| v7.1, comprando o Jogo de pratos primeiro | **0,0 a 0,2** | **94%** |

- O que sobra sem o Jogo de pratos é o limite de louça nos dias de 6 mesas (4 pratos): com +1 prato, as perdas quase zeram. Comprar os pratos cedo é a "prioridade certa" de quem quer não perder ninguém, então a quantidade de louça não mudou (a escassez da v5 continua).
- **3 estrelas** possíveis em todos os dias: dias 2 e 3 pelo bot de sempre com equipe (16 e 12 em 80); dias 4 a 7 pelo bot afiado (22 a 45 em 80).
- **Sem equipe** perder gente continua normal: 2,3 a 6,9 por dia nos dias 3 a 7 (quase tudo esperando o prato).

## 5. Metas e escassez (bot de sempre, 80 rodadas)
| Dia | Sem equipe v7 → v7.1 | Com equipe v7 → v7.1 |
|---|---|---|
| 3 | 73% → 79% | 95% → 96% |
| 4 | 67% → 72% | 97% → 91% |
| 5 | 45% → 48% | 80% → 89% |
| 6 | 43% → 52% | 90% → 95% |
| 7 | 38% → 33% | 92% → 95% |

As diferenças ficam no ruído das rodadas, então as metas não mudaram. A carreira (`carreira.js 20`) chega ao dia 5 com R$ 1.372 (v7: R$ 1.319).

## 6. Testes
- `smoke10` (26/26): ritmo da fila com e sem mesa, mesa suja, família sem mesa de 4, piso de 1 coração, saída do piso, sem fim sem piso, porta (espera, limite de 8 s, limite total, sem lotação, sem fim), total de grupos do dia, perdas por causa, desenho do ícone.
- `tests/gera_botpage.sh` gera `botpage.js` a partir de `bot.js` (o `run_all.sh` chama).
- `tests/shot_v7_1.py`: capturas em `capturas/v7.1`.
