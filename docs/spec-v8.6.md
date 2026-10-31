# v8.6 — Entregadores com fila própria e marmitas (etapa 2e)

Etapa 2e do `docs/PLANO.md` (pedido do usuário em 27/10; textos em `docs/PROPOSTAS.md`). Decisões do usuário em 28/10:
- **Marmita:** o prato do cardápio feito em marmita, pelo preço do prato.
- **Adiantar:** até 2 marmitas, mantendo sempre mais 1 vaga na prateleira para a encomenda feita para o entregador que está esperando; a adiantada tem validade curta, porque esfria. O custo sai quando a marmita fica pronta: a que ninguém levar até o fim do dia fica só no prejuízo. Para depois (melhorias): prateleira de 4 marmitas e estufa, que deixa a validade quase o dia todo.
- **Custos:** R$ 2 de embalagem, e a Efood (o app de entrega do jogo) fica com 15% do valor do prato.
- **A marmita ocupa uma boca do fogão, mas não usa prato limpo;** sai pronta como uma quentinha com o desenho da comida na tampa.
- **O balcão de retirada fica na calçada, ao lado do portão; a Dani também leva as marmitas.**

## O que mudou
- **Fila de retirada** (`RETIRADA`, `Game.retirada`): o entregador (`TIPOS`/`CUSTOMER_TYPES.entregador`) não vai mais para a espera nem senta. Ao chegar (`Game.spawn`, com `Group.retira`), ele vai para um dos `MARMITA.fila` = 3 lugares em pé no alto da calçada, à esquerda do balcão de retirada, no estado `retirada` (paciência `PAT.retirada` = 9 s por coração × 0,5 do entregador = 4,5 s). Fila cheia: "Lotado!", como na espera. Para caber, os 4 lugares da espera desceram e ficaram um pouco mais juntos (`QUEUE.ys` de 476 a 236; eram de 436 a 178).
- **O pedido vai sozinho ao Tonhão** (`Game.marmitaPara`): se houver uma marmita sem dono do prato dele (na prateleira, na mão de alguém, pronta ou no fogão, nessa ordem), ela fica sendo dele; senão, a encomenda da Efood entra na fila do fogão (`Kitchen.submitMarmita`, com `dono` e `enc`). Sem 2º item.
- **A marmita no fogão** ocupa uma boca, com o tempo de um prato (gripe e Turno sem fim valem), e no quadro de pedidos aparece com a faixa laranja da Efood e a quentinha. Pronta (`Kitchen.marmitaPronta`), vai para a janela de prontos **sem usar prato limpo**; o custo sai na hora: os ingredientes do prato (35% do preço; ×1,5 com a geladeira quebrada) mais `MARMITA.embalagem` = R$ 2.
- **Levar:** a Bia toca na marmita pronta (vai na mão como um prato; na bandeja, conta como prato: `trayOk`) e depois no **balcão de retirada** (estação `retirada`; a Bia atende de dentro, no portão). A do entregador que está no balcão vai direto para ele; a de quem ainda está chegando fica na vaga da reserva da prateleira; a sem dono vai para a prateleira, se couber (`Game.levaMarmitas`). Na prateleira, o entregador pega a sua (ou uma sem dono do prato dele, que chegou antes da encomenda) assim que chega ao balcão (`Game.pegaPrateleira`).
- **Pagamento** (`Game.entregaMarmita`): o preço do prato com a gorjeta dos corações (`GORJETA`), menos a parte da Efood (`MARMITA.efood` = 15% do preço). PF: até R$ 24 líquidos (28 − 4). Rende 20 pontos de atendimento (`PONTOS_ACAO.marmita`) e conta como atendido.
- **Adiantar** (`Game.adiantar`): um botãozinho "+ marmita" na janela de pedidos (estação `adiantar`, com o número de sem dono, "1/2"; só no dia com entregador, `Game.marmitaOk`). Cada toque manda a Bia pedir ao Tonhão uma marmita de PF sem dono (`MARMITA.prato`), até `MARMITA.vagas` = 2 sem dono ao mesmo tempo (no fogão, prontas, na mão ou na prateleira). Elas esfriam em `MARMITA.validade` = 60 s desde que ficam prontas (o selo da marmita é um anel que vai do verde ao vermelho) e vão para o lixo ("Esfriou!", +1 na lixeira, `Game.esfriar`). A marmita com dono não esfria. Tocar em PEDIDOS sem comanda continua dando "?": adiantar é só no botãozinho, para não adiantar sem querer.
- **Quem desiste** (`angryLeave` no estado `retirada`): conta como perdido (`lostBy.retirada`, 3ª estrela, multa); a encomenda que nem começou sai do fogão; a que já está cozinhando, pronta ou a caminho fica sem dono, como uma adiantada (`Game.soltaMarmitas`).
- **Dani:** tarefa nova "Levar as marmitas" (`DANI_TASKS`, `marmita`): busca na janela de prontos (primeiro as de quem espera; as sem dono só se couberem na prateleira; nunca a que a Bia já vai buscar), até 2, e leva ao balcão; a que não couber fica com ela no balcão até abrir vaga ou esfriar.
- **Gurugol:** o entregador avalia como os outros; a espera no balcão conta na espera e na agilidade (`perdMesa`), o prato é a nota da marmita, e o bravo reclama "Cadê a marmita?!" ou "Saí sem o pedido!" (`AVAL_BRAVO.retirada`).
- **Desenho:** o balcão de madeira com a plaquinha RETIRADA e o adesivo da Efood, a prateleira no tampo (2 vagas e a da reserva, tracejada) (`drawRetirada`); a quentinha de alumínio com a tampa e a comida desenhada (`drawMarmita`, `drawComida` saiu de `drawDish`); o selo "E" laranja na marmita com dono e o anel da validade na sem dono (`drawMarmitaSelo`); o balão do entregador com a marmita dele (anel do preparo no fogão, verde pulsando pronta, seta a caminho, `drawRetiradaBalao`); corações menores na fila de retirada (`drawHearts(..., k)`); ícones da fila de ações para o balcão e o adiantar.
- **Textos:** introdução do dia 4, dica nova no Como jogar e a linha "Marmitas" no fim do dia (entregues, a parte da Efood, as que esfriaram e as que sobraram, `result.marmitas/efood/esfriou/sobra`). O faturamento já vem sem a parte da Efood; a embalagem entra nos ingredientes.
- **Turno sem fim:** o entregador também vai ao balcão. **Missão zero:** sem passo de marmita (o treino só tem o casal de vovós).

## Números (`balance.js 80`, metas batidas nos dias 3 a 7)
| Jogador | Antes (v8.5.1) | v8.6 |
|---|---|---|
| Bot sem equipe | 63% | 52% (alvo 40–70%) |
| Bot com `EQUIPE=auto` | 90% | 93% (alvo 85–95%) |
| Bot afiado com equipe (dia 4, dias sem perder ninguém) | 15% | 73% |

- O entregador deixou de ser o cliente que mais derrubava o jogo perfeito (paciência 0,5 numa mesa): o afiado sem perder ninguém no dia 4 foi de 9/60 a 58/80. Nos dias 5 a 7 os VIPs continuam pesando (~25% a 35% dos dias sem perda, eram ~15%).
- Sem equipe, a Bia agora sai do salão até o portão para cada marmita: o bot perde ~0,7 entregador por dia e bate a meta um pouco menos.
- O bot afiado adianta 1 marmita por vez nas brechas (até 45 s antes do fim) e perde ~2 por dia por esfriar ou sobrar; o padrão não adianta.
- **Chuva** (35% de entregadores; `CLIMA_CFG='{"chuva":{"chance":1}}' MANUT=com MANUT_CFG='{"dia":99}'`): sem equipe 22 a 48 de 60 nas metas dos dias 4 a 7, com equipe 46 a 55, afiado 56 a 58 e quase sempre sem perder ninguém. O dia de chuva continua fácil.
- **Carreira** (`carreira.js 20`): R$ 800 no dia mediano 9.

## Testes
- `tests/smoke28.js` (59 verificações): fila de retirada, encomenda no fogão, marmita sem prato limpo e com o custo, a Bia levando e o pagamento com a Efood, adiantar até 2 (a 3ª não), prateleira, o entregador de PF levando a adiantada na hora, validade, prateleira cheia e a vaga da reserva, entregador perdido (multa, encomenda cancelada, a do fogão sem dono), fila de retirada cheia, avaliação, a Dani levando, bandeja, toque no balcão e no "+ marmita" (só no dia com entregador), chuva com o bot afiado, Turno sem fim, fim do dia e desenho.
- `smoke.js` (o bot próprio leva as marmitas; a Bia pode ir à calçada) e `smoke3.js` (o teste de "não coube" no Turno sem fim sorteia sem entregador).
- `tests/bot.js`: o padrão busca a marmita de quem espera e leva ao balcão; o afiado pesa a pressa do entregador e adianta nas brechas. `balance.js` mostra `retirada` nas causas e marmitas, Efood, esfriou e sobra.
- Capturas: `python3 tests/shot_v8_6.py` → `capturas/v8.6`.
