# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data) e anota o que mudou no plano.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A próxima é a 2f.** A etapa 7 fica **a rever** com o usuário antes de começar.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 0 | Contas: lucro, ingredientes, contas do dia, divulgação | v7 | feita (15/10) |
| 1a | Jogo justo: dá para não perder ninguém | v7.1 | feita (15/10) |
| 1b | Livro-caixa e ajuste fino com jogadores | v7.2 | feita (15/10) |
| 1c | Retorno do Renan: Bia mais ágil e selos da fila | v7.3 | feita (21/10) |
| 1d-1 | Garagem da Bia, móveis e editor do salão | v7.4 | feita (21/10) |
| — | Ajuste fora do plano: salão cheio chama gente, 4 pratos, fila justa a 60% | v7.4.1 | feita (21/10) |
| — | Fora do plano: TV e som na Garagem, couvert só no nível 3 | v7.4.4 | feita (21/10) |
| 1d-2 | Tela que rola até a calçada, espera lá fora e máquina de suco | v7.5 | feita (21/10) |
| — | Retorno de jogador: tela larga, tudo à vista sem rolar | v7.6 | feita (22/10) |
| — | Fora do plano: espera da Garagem de pé, Água da torneira e espada-de-são-jorge | v7.7 | feita (22/10) |
| 2 | Manutenção e imprevistos | v8 | feita (22/10) |
| — | Retorno do usuário: dinheiro comprometido com a folha à vista na lojinha | v8.1 | feita (22/10) |
| — | Pedido do usuário: Missão zero, o dia 0 de treino com pop-ups | v8.2 | feita (22/10) |
| — | Pedido do usuário: rejogar o dia (Reiniciar ou Menu na pausa) sem perder o dinheiro | v8.2.1 | feita (22/10) |
| — | Pedido do usuário: só o dia completo rende (folha no fim do dia; interromper não paga nem ganha) | v8.2.2 | feita (22/10) |
| — | Pedido do usuário: largar o dia com gente na espera ou nas mesas cobra a multa de quem sai bravo | v8.2.3 | feita (22/10) |
| 2b | Carreira como campanha contínua, dinheiro no negativo e empréstimo no banco | v8.3 | feita (23/10) |
| — | Pedido do usuário: parcela atrasada 2 dias seguidos, o banco toma a lanchonete (game over) | v8.3.1 | feita (23/10) |
| — | Pedido do usuário: amortização (SAC, 3% ao dia sobre o saldo) e empréstimo neutro a um pouco desvantajoso | v8.3.2 | feita (23/10) |
| — | Pedido do usuário: jogo offline por enquanto (ranking só no aparelho; o compartilhado volta na etapa 7) | v8.3.3 | feita (23/10) |
| — | Pedido do usuário: balão com o prato na mesa quando a comida fica pronta | v8.3.4 | feita (23/10) |
| — | Pedido do usuário: estoque no editor do salão, para rearrumar o salão cheio | v8.3.5 | feita (23/10) |
| — | Pedido do usuário: Jogo de pratos sem limite, fora da melhoria do dia | v8.3.6 | feita (23/10) |
| — | Retorno do usuário: a 3ª estrela pede não perder ninguém, e a tela passa a dizer isso | v8.3.7 | feita (23/10) |
| — | Retorno do usuário: preços de verdade (cardápio, 2º item, gorjeta de até 10%, ações viram pontos de atendimento, custos e metas de garagem) | v8.3.8 | feita (23/10) |
| — | Retorno do usuário: jogo perfeito no dia 1 deu 1 estrela; metas e 3 estrelas pelo bot afiado | v8.3.9 | feita (23/10) |
| 2c | Avaliações dos clientes (nota de 0 a 5 ★, 5 critérios) | v8.4 | feita (26/10) |
| 2d | Abertura animada do Modo História: o sonho da Bia | v8.5 | feita (26/10) |
| 2d-r | Revisão estética da abertura, em 5 partes com checagem do usuário | v8.6.1 | feita (28/10, as 5 partes juntas) |
| 2e | Entregadores com fila própria e marmitas | v8.6 | feita (28/10) |
| — | Pedido do usuário: decoração da Garagem (plantas, cantinho da Rosa, toalha xadrez), só visual | v8.6.5 | feita (29/10) |
| 2c-r1 | Rebalanceamento do Gurugol, parte 1: as regras da nota (null, humor pelo teto, chance de encantar, bronze, nota mínima) | v8.6.7 | feita (29/10) |
| 2c-r2 | Rebalanceamento do Gurugol, parte 2: prato quente | v8.6.8 | feita (29/10) |
| 2c-r3a | Cardápio que cresce: cursos do Tonhão e gostos dos clientes | v8.6.9 | feita (29/10; calibração quase fechada, ver `docs/spec-v8.6.9.md`) |
| 2c-r3b | Desenhos dos pratos novos, dos avançados e das carnes do PF | v8.6.12 | feita (29/10; grade de desenhos aprovada pelo usuário, ver `docs/spec-v8.6.12.md`; saiu como v8.6.12 porque a 2c-r3c já tinha tomado a v8.6.11) |
| 2c-r3c | Vegetarianos e veganos | v8.6.11 | feita (29/10; ver `docs/spec-v8.6.11.md`) |
| 2c-r3d | Rodada de balanceamento do cardápio (metas dos dias 2 a 7, ticket médio, nota mínima do Gurugol) | v8.6.13 | feita (29/10; salgado se pede de dois, metas dos dias 6 e 7, nota mínima 90% do teto; ver `docs/spec-v8.6.13.md`) |
| 2f | A campanha vira o Modo História: estrutura e capítulos da Garagem | v8.7 | a fazer |
| 3a | Mudança de ponto e Lanchonete na área industrial (e o capítulo dela) | v9 | a fazer |
| 3b | Restaurante na Avenida Brasil (e o capítulo dela) | v9.1 | a fazer |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 1a — Jogo justo: dá para não perder ninguém (v7.1)
> **Feita em 15/10 (v7.1, `docs/spec-v7.1.md`).** Decisões: A + B; no Turno sem fim vale o ritmo da fila justa, sem o piso; ícone "aguardando mesa" sim. A medição mostrou que, com a equipe, a maior parte das perdas era a espera pelo prato, e não a fila. O que sobra é o limite de louça nos dias de 6 mesas: o bot afiado só chega ao alvo (0 perdidos em 94% dos dias) comprando o Jogo de pratos primeiro. A louça não mudou; se jogadores reclamarem da espera pelo prato, a etapa 1b pode rever `dishStock` ou a mecânica D. Metas sem mudança.

**Objetivo:** atender o retorno do Renan (áudio em `docs/PROPOSTAS.md`). Quem joga com perfeição pode terminar com menos corações, mas consegue não perder ninguém. Perder um cliente tem que ser culpa da velocidade ou da prioridade do jogador.

**Situação hoje (v7):** com a equipe completa, o bot ainda perde 0,6 a 2,6 grupos por dia nos dias 3 a 7, e a 3ª estrela exige zero perdas. O caso dele é a fila cheia com todas as mesas ocupadas: a fila perde a paciência sem que dê para fazer nada além de cafezinho e água.

**Passos:**
1. **Medir onde se perde.** `balance.js` passa a contar as perdas por causa:
   - na fila sem mesa livre que caiba o grupo;
   - na fila com mesa livre;
   - esperando pedido, prato ou conta;
   - VIP.

   Também conta quanto tempo o salão fica lotado com a fila cheia. Só assim dá para separar o que é impossível do que é falha do bot.
2. **Bot afiado:** melhorar a prioridade do bot (quem está para sair primeiro) para ele servir de "jogador perfeito". Se o bot afiado ainda perde gente, a conta do jogo está apertada demais.
3. **Mecânicas candidatas** (escolher na sessão; sugestão: A + B):
   - **A. Fila justa:** enquanto não há mesa livre que caiba o grupo, a paciência na fila cai bem mais devagar (ex.: 40%) e não passa de 1 coração. Ela volta ao ritmo normal quando abre uma mesa que serve. Um ícone "aguardando mesa" mostra isso.
   - **B. Porta que respeita a lotação:** com o salão cheio e a fila com 3 ou mais grupos, as próximas chegadas atrasam um pouco em vez de se empilhar. O total do dia não muda, só o ritmo.
   - C. Ajuste de corações e paciência por tipo (entregador e VIP são os mais apertados).
   - D. Mesas que esvaziam mais rápido ao final (a conta pedida mais cedo), se a medição mostrar que o gargalo é a mesa ocupada.
4. **Recalibrar:** com menos perdas, o lucro sobe. Conferir as metas (`balance.js`) e a escassez (`carreira.js`, alvo da v7 no dia 5).

**Alvos:**
- Bot afiado com a equipe completa: **0 perdidos em ≥ 80% dos dias 3 a 7** (média < 0,3).
- 3 estrelas possíveis em todos os dias.
- Sem equipe, perder gente continua normal: a equipe segue valendo a pena.
- Turno sem fim: continua acabando um dia, mas por velocidade, não por conta impossível.

**Partes:** `12-clientes.js` (paciência na fila), `16-jogo.js` (chegadas, causa da perda), `22-salao-hud.js` (ícone "aguardando mesa"), `10-constantes.js`, `tests/bot.js` e `botpage.js`, `tests/balance.js`.

**Testes:** `smoke10` (paciência na fila com e sem mesa livre, piso de 1 coração, atraso das chegadas, contagem por causa). `balance` com as perdas por causa.

**Decisões em aberto:**
- Quais mecânicas (sugestão: A + B)?
- A fila justa vale também no Turno sem fim (sugestão: sim, com o ritmo apertando com o tempo como hoje)?
- Mostrar o ícone "aguardando mesa" na fila (sugestão: sim)?

---

## Etapa 1b — Livro-caixa e ajuste fino (v7.2)
**Feita (v7.2, 15/10):** aba Caixa na lojinha, 14 dias, "Copiar resumo". Rodada de retorno dispensada pelo usuário; `INGRED.prato` 0,7 testado e descartado (tirava só ~R$ 150 do bot até o dia 5 e deixava os dias 5 a 7 sem equipe abaixo do alvo). O ajuste de valores fica para quando chegar o primeiro resumo de jogador (pode entrar em qualquer etapa seguinte). Detalhes em `docs/spec-v7.2.md`.

**Objetivo:** ver a escassez com números de jogo real (não só do bot) e ajustar os botões da v7 antes de empilhar mais sistemas.

**Entra:**
- `save.caixa`: registro dos últimos 14 dias jogados na carreira, com dia, faturamento, ingredientes, contas, folha, divulgação, lucro, compras na lojinha e saldo ao fim.
- Aba **Caixa** na lojinha: tabela curta com os últimos dias e uma linha "para onde foi o dinheiro" (melhorias, salão, equipe, contas). Ajuda o jogador a sentir a escassez e o playtester a relatar.
- Botão "Copiar resumo" no Caixa: texto pronto para colar no WhatsApp (dias, lucro, saldo e compras). É o jeito mais simples de o Renan e o Arthur mandarem os números.
- Ajuste de `INGRED`, `CONTAS`, `DIVULGA` e das metas com o que chegar dos jogadores. Se ainda sobrar dinheiro no dia 5, comece por `INGRED.prato` 0,6 → 0,7.

**Fora:** sistemas novos.

**Partes:** `12-clientes.js` (save), `16-jogo.js` (`finishDay`, compras), `41-lojinha.js`, `02-telas.html`, `01-estilo.css`.

**Testes:** `smoke11` (registro, limite de 14, resumo em texto, save antigo sem `caixa`). `carreira.js` continua sendo a referência.

**Pronto quando:** o Caixa aparece desde o dia 2, o resumo copia, `carreira.js` e `balance.js` passam nos alvos, e houve pelo menos 1 rodada de retorno de jogador (ou o usuário dispensou).

**Decisões em aberto:**
- O Caixa fica numa aba da lojinha (sugestão) ou num painel do menu?
- Quantos dias guardar (sugestão: 14)?

---

## Etapa 1c — Retorno do Renan: Bia mais ágil e salão simples (v7.3)
> **Feita em 21/10** (ver `docs/spec-v7.3.md`): base 300 px/s, Tênis de corrida (R$ 350, +20%), selos "1º, 2º..." na mesa, na estação e no prato pedidos (mesa pode repetir; cancelar só pelo quadrinho da fila) e metas mantidas. O item 3 (salão por lugares) virou a **etapa 1d**, só proposta por enquanto (pedido do usuário).

**Objetivo:** atender o retorno do Renan (entrada de 18/10 em `docs/PROPOSTAS.md`): a Bia anda devagar, não dá para ver o que já foi pedido a ela, e "o manejo das mesas ficou complexo demais".

**Situação hoje (v7.2):**
- a Bia anda a 260 px/s (`Waitress.speed`, `14-bia.js`); os Tênis novos (R$ 150) dão +10%;
- a fila de ações só aparece nos 6 quadrinhos do HUD; no salão, a mesa, a estação ou o prato pedido não mostra nada. Mesas e estações podem entrar duas vezes na fila (só o prato pronto não repete, `16-jogo.js`, toque);
- aba Salão da v6: 2 cadeiras por R$ 60 (até 24), mesa por R$ 300 (até 8), botões 2 e 4 em cada mesa e só 1 mesa de 4 por fileira de 4 mesas.

**Entra:**
1. **Bia mais ágil:** aumentar a velocidade de base (ex.: 260 → 300) e, se precisar, um 2º nível dos Tênis. Conferir com o `balance.js` que as metas não ficam fáceis demais (sem equipe: ~40–70% das metas nos dias 3 a 7; `EQUIPE=auto`: ~85–95%) e recalibrar as metas se for o caso.
2. **Marca do que está na fila:** cada mesa, estação ou prato que já está na fila da Bia ganha, no salão, um selo pequeno com o número da vez (ou um ✓), que some quando ela faz a ação. Sem animação com `prefers-reduced-motion`. Tocar de novo num lugar marcado não repete o pedido; antes, conferir se algum caso precisa da mesma mesa 2 vezes seguidas na fila (ex.: anotar o pedido e depois entregar o prato).
3. **Salão por lugares:** cada salão tem um total de lugares (o do Bairro hoje; o Centro e a área nobre das etapas 3 e 4 terão o seu). O jogador só distribui esses lugares em mesas de 4 e de 2, sem comprar cadeira por cadeira nem a regra de 1 mesa de 4 por fileira. Comprar o salão maior (mais lugares) continua sendo um gasto. Rever as contas do dia (R$ 30 por mesa e R$ 6 por lugar) e converter o `save.salao` antigo sem perder o que o jogador já pagou.

**Fora:** mudar de ponto (etapa 3).

**Partes (como foi planejado):** `14-bia.js` (velocidade, fila de ações), `10-constantes.js` (`UPGRADES`, `SALAO`, `CONTAS`, metas em `DAYS`), `16-jogo.js` (toques, compras do salão, contas), `21-cenario.js` e `22-salao-hud.js` (selos nas estações, mesas e pratos), `12-clientes.js` (`normSalao` e save), `41-lojinha.js` (aba Salão), `tests/bot.js` e `botpage.js`.

**Testes:** `smoke12` (velocidade, selo aparece e some, toque repetido não duplica, salão por lugares, save antigo convertido); rever o `smoke8` (salão da v6). `balance.js` (sem equipe, `EQUIPE=auto` e `BOT=afiado`) e `carreira.js` (pouca sobra no dia 5).

**Decisões em aberto:**
- Velocidade: só a base (sugestão: 260 → 300), um 2º nível dos Tênis ou os dois?
- Selo: número da vez (sugestão, porque mostra a ordem) ou só um ✓?
- Lugares: quantos no Bairro (sugestão: começar com o que cabe nas 6 mesas de hoje e crescer até ~24 comprando "ampliação", no lugar das cadeiras e mesas avulsas)? Mesas de 2 e 4 livres, ou com um limite de mesas pelo espaço?
- O que acontece com quem já comprou cadeiras e mesas na v6 (sugestão: vira o mesmo total de lugares, sem perder dinheiro)?

---

## Etapa 1d — Garagem da Bia, editor do salão e espera lá fora (v7.4 e v7.5)
> Decidida pelo usuário em 21/10 (textos originais em `docs/PROPOSTAS.md`; pesquisa de aluguel em `docs/pesquisa-aluguel.md`). São **2 sessões**: a **1d-1** (v7.4) e a **1d-2** (v7.5). Cada uma termina como as outras (testes, spec, RESUMO, PR com merge e publicação).

### O que foi decidido (vale para a 1d e para as etapas 3 e 4)
- **O nível do salão é o ponto.** Mudar de ponto é subir de nível:

| Nível | Ponto | Teto de lugares | Aluguel por dia | Mudança (custo único) | Cardápio (sugestão) | Etapa |
|---|---|---|---|---|---|---|
| 1 | **Garagem da Bia e do tio Tonhão** | 16 | **grátis** (é da família) | — | ×1 | 1d |
| 2 | **Lanchonete na área industrial** | 20 | R$ 120 | R$ 800 | ×1 | 3 |
| 3 | **Restaurante na Avenida Brasil** | 24 | R$ 400 | R$ 2.000 | ×1,4 | 3 |
| 4 | **Terraço Suíça** | 28 | R$ 1.000 | R$ 5.000 | ×2,2 | 4 |

  - Aluguéis na **proporção real** entre os pontos (ver a pesquisa). A Garagem não paga aluguel e **rende a mais de propósito**: é o pé-de-meia para a mudança (levar as coisas, montar, reajustar, caução).
  - O aluguel entra nas **contas fixas do dia** (com luz e gás, que continuam R$ 30 por mesa e R$ 6 por lugar), aparece na lojinha e no Caixa.
- **Móveis:** dentro de cada ponto, mesas e cadeiras são compradas até o teto de lugares, e **vão junto na mudança**. Não há limite de mesas: só o teto de lugares e a área útil. Grupos de 3 ou 4 sem mesa de 4 continuam ficando insatisfeitos e desistindo (regra de hoje, `semMesa`).
- **Espera lá fora por nível** (decidido em 22/10; nível 1 feito na v7.7, os outros nas Ideias guardadas): nível 1, de pé e copo d'água da torneira; nível 2, cadeirinhas de plástico ou banquinhos de madeira e jarra de suco; nível 3, sofás e águas saborizadas; nível 4, poltronas individuais e coquetelaria.
- **Ambiente por nível** (decidido em 21/10; nível 1 feito na v7.4.4, os outros nas Ideias guardadas): nível 1, TV (Rede Esfera) e som (rádio Velha Brasil FM), 5% de paciência cada, pagando a luz; nível 2, 3 televisores com playlist de sertanejo (10% com anúncios, 15% sem, por R$ 20/dia); nível 3, o **couvert artístico** de hoje (`STAFF.couvert.nivel`); nível 4, quarteto de cordas ou pianista (20%; o pianista soma luxo e tem a manutenção do piano).
- **Novos pontos destravam** (etapas 3 e 4; o que vai em cada nível é sugestão): 2º garçom (área industrial); mais bocas no fogão; balcão de pratos maior; mais pratos no cardápio; um cozinheiro/confeiteiro especializado em sobremesas (níveis 3 e 4); balcão de coquetelaria com profissional de drinks (do nível 3 em diante).
- **Carreira por pontos, sem fim fixo** (etapa 3): cada ponto tem a sua série de metas; batidas as metas e juntado o dinheiro, dá para mudar. Até a etapa 3, a carreira continua com 7 dias, todos na Garagem.
- **Mais para frente:** o **nível de luxo** (0 a 5) vai pontuar enfeites, móveis, ponto, mídia e críticos. As mesas quadradas e as cadeiras de plástico de bar da Garagem são o degrau mais baixo.

### Sessão 1d-1 — Garagem, móveis e editor do salão (v7.4)
**Objetivo:** trocar o Bairro e a aba Salão da v6 pela Garagem, com móveis comprados um a um e um editor em que o jogador vê o salão e arrasta as mesas.

**Entra:**
1. **`PONTOS`** em `10-constantes.js`, só com a Garagem por enquanto: `{ id:'garagem', nome, lugares:16, aluguel:0, mudanca:0, cardapio:1, area:{...}, espera:4 }`. `CONTAS.aluguel` passa a vir do ponto (Garagem: 0). Na Garagem, `contasDia` = R$ 30 por mesa + R$ 6 por lugar.
2. **Save do salão** (`save.salao`): lista de mesas `[{ x, y, seats }]` mais o ponto. `normSalao` novo: confere limites, posições e lugares. Arranjo inválido vira o automático.
3. **Kit inicial da Garagem:** 3 mesas de 2 e 1 de 4 (**10 lugares**), mesas quadradas e cadeiras de plástico de bar.
4. **Loja de móveis** (aba Salão): mesa de 2 com cadeiras **R$ 150**; mesa de 4 com cadeiras **R$ 250**; 2 cadeiras para virar uma mesa de 2 em mesa de 4 **R$ 100**. Até o teto de 16 lugares. As compras entram no Caixa (`caixaGasto(...,'sal')`). Continua 1 melhoria por visita, mas os móveis não contam nesse limite.
5. **Editor do salão** (aba Salão): o salão desenhado em escala (piso, parede, porta, balcão), sem clientes.
   - Arrastar a mesa para mover (encaixe numa grade de 10 px). Tocar na mesa abre "virar mesa de 4" (se der).
   - A mesa nova comprada entra no primeiro lugar livre.
   - Contador "Lugares 10 de 16".
   - Posição válida: dentro da área útil, sem encostar em outra mesa (folga `SALAO.gap`) e com caminho da Bia até cada mesa (`setObst` + `findPath` a partir da porta/estações). Inválida: vermelha e volta ao soltar.
   - Botões "Arrumação automática" e "Desfazer".
   - Números das mesas pela ordem no salão (de cima para baixo, da esquerda para a direita).
   - Funciona com mouse e dedo (mesma folga de toque da v6), em 960×600 e 740×360.
6. **Todas as mesas abertas desde o dia 1.** Some o `tables:[...]` de `DAYS` (que abria 3 mesas no dia 1 e 4 no dia 2). O movimento menor dos dias 1 e 2 vem de **menos grupos** (pouca visibilidade) e do pouco dinheiro para móveis. Rever `groups` dos dias 1 e 2 com o bot.
7. **Visual da Garagem:** portão de garagem aberto no lugar da porta, piso de cimento queimado, letreiro feito à mão, mesas quadradas e cadeiras de plástico de bar. Só paleta e desenho simples, sem arte pesada.
8. **Save antigo (v6 a v7.3):** devolve o que o jogador gastou em cadeiras e mesas (`SALAO.chairPrice` e `tablePrice` × o que comprou) no dinheiro acumulado e numa linha do Caixa ("Devolução do salão"). Começa na Garagem com o kit.
9. **Bot** (`tests/bot.js`): compra móveis na lojinha (regra simples: mesa de 4 enquanto houver grupos perdidos por `semMesa`, senão mesa de 2) e usa a arrumação automática.
10. Como jogar, painel Versões, `VERSAO` e `vtag`.

**Fora (vai para a 1d-2):** rolar a tela, espera lá fora, máquina de suco.

**Feita em 21/10 (v7.4, `docs/spec-v7.4.md`).** O que mudou em relação ao plano: dá para **vender** a mesa por metade do preço (sem isso, 16 lugares em mesas de 2 travavam a mesa de 4); a mesa de 4 são 2 mesas quadradas juntas (mesa de bar, pedido do usuário com foto); o Turno sem fim usa um salão fixo de 16 lugares; dias 1 e 2 com 5 e 8 grupos. Sem equipe, o bot que compra móveis passa em ~97% das metas dos dias 3 a 7 (acima do alvo, pela folga da Garagem). Achado para a etapa 3: com equipe, mesa a mais não dá lucro (o gargalo são os 3 pratos limpos), então o pé-de-meia não depende dos móveis.

**Calibração:** **não** tirar a folga da Garagem (pedido do usuário: rende a mais para o pé-de-meia). Conferir com `balance.js` e `carreira.js` que, sem equipe, o jogador que compra móveis bate as metas dos dias 3 a 7 no alvo ou acima (~40–75%), e que dá para juntar ~R$ 800 da mudança até o dia 5 sem deixar de contratar.

**Partes:** `10-constantes.js` (`PONTOS`, `SALAO`, `CONTAS`, `DAYS`), `11-base.js` (`setObst`), `12-clientes.js` (`normSalao`, `normSave`, devolução), `16-jogo.js` (`buildTables`, compras de móveis, `contasDia`), `21-cenario.js` (Garagem), `22-salao-hud.js` (mesa quadrada, cadeira de bar), `41-lojinha.js` (aba Salão com editor: canvas próprio, arrastar e tocar), `43-telas.js` (entrada do editor), `tests/bot.js`.

**Testes:** novo `smoke13` com:
- kit inicial, compras e teto de 16;
- posição válida e inválida, caminho até cada mesa, arrumação automática;
- contas sem aluguel;
- save antigo com devolução;
- todas as mesas abertas no dia 1.

Também: rever `smoke8` (salão da v6, que sai ou vira teste de conversão) e o `smoke9` (contas), rodar `balance.js` (sem equipe, `EQUIPE=auto`, `BOT=afiado`) e `carreira.js`. Capturas `shot_v7_4.py`: editor e Garagem em 960×600 e 740×360.

### Sessão 1d-2 — Tela que rola, espera lá fora e máquina de suco (v7.5)
**Objetivo:** abrir espaço lá fora: o salão fica mais largo que a tela e a fila de espera vira uma área de espera na calçada.

**Entra:**
1. **Câmera:** o mundo fica mais largo que a tela (a calçada à esquerda da porta). Arrastar o **fundo** rola a tela, e o HUD fica fixo. `render` desenha com deslocamento, e a entrada converte tela → mundo. Com `prefers-reduced-motion`, a rolagem automática é instantânea.
2. **Área de espera lá fora:** **4 cadeiras na Garagem** (`PONTOS.espera`), no lugar da fila de espera de hoje. Essas cadeiras não contam nos lugares. Quem chega e não tem cadeira espera na porta, como hoje (`PORTA`).
3. **Levar o grupo até a mesa:**
   - arrastar o grupo até a borda **rola a tela sozinho**;
   - **tocar 2 vezes no grupo** leva a tela automaticamente para o salão, para escolher a mesa;
   - tocar no grupo e depois na mesa continua valendo.
4. **Setinha na borda:** aparece quando uma cadeira de fora precisa de atenção (suco pronto para entregar, grupo com 1 coração), e tocar nela leva a tela até lá.
5. **Máquina de suco da espera** (melhoria, no lugar da **Água saborizada**; quem tinha a água ganha a máquina):
   - quem espera **pede no tablet da mesa de espera**, e o suco **sai pronto da máquina**, que fica lá fora ao lado da espera;
   - a Bia vai até a máquina, pega e entrega (entra na fila de ações, com selo);
   - o suco é cobrado na conta do grupo (ingrediente R$ 5), e beber segura a paciência de quem espera, como a água fazia (`AGUA.slow`).
6. **Enfeites da espera** (só visual, para o nível de luxo no futuro): banquinho de plástico, vaso, toldo simples na Garagem.

**Partes:** `23-render.js` (câmera), `43-telas.js` (arrastar o fundo, toque duplo, tela → mundo), `16-jogo.js` (câmera, espera, pedidos do tablet), `12-clientes.js` (grupo na espera, suco da espera), `14-bia.js` (ação "máquina"), `21-cenario.js` (calçada, máquina, tablet), `22-salao-hud.js` (setinha, selos), `10-constantes.js` (`UPGRADES`: água → máquina), `tests/bot.js`.

**Testes:** novo `smoke14`:
- rolagem e toque com a tela deslocada;
- arrastar até a borda e toque duplo;
- espera com 4 cadeiras e a porta;
- pedido no tablet, máquina, entrega e conta;
- save com água vira máquina.

Também: rever o `smoke7` (toque) e o `smoke10` (fila justa e porta), mais `balance.js` e capturas `shot_v7_5.py`.

**Dúvidas que ainda podem surgir (perguntar na sessão):** largura da calçada visível; se o arrastar do fundo conflita com o toque com folga do celular; preço do suco da espera.

**Feita em 21/10 (v7.5, `docs/spec-v7.5.md`).** Decisões: calçada de 260 px; arrastar o fundo só no vazio, com abinhas fixas no alto (a da calçada vira a setinha, piscando); suco da espera a R$ 12; a tarefa da água da Dani virou "Levar o suco da espera". O que mudou em relação ao plano: a setinha é a abinha do alto (com quantos esperam), e a da direita mostra o relógio (que sai da tela junto com a cozinha) e os pratos prontos; o dia começa olhando a calçada; a Bia pega de uma vez todos os copos prontos que couberem e entrega grupo a grupo; o suco entregue também devolve 1 coração; os enfeites são o toldo, os bancos de ripas e um vaso num banquinho de plástico. Achado: com a Bia sozinha, a ida até a máquina (~6 s) faz o bot afiado perder ~R$ 190/dia se busca suco em toda brecha; o bot simples (só na folga) empata. Fica para conferir com jogadores (Ideias pendentes do `RESUMO.md`).

**Mudou na v7.6 (22/10, retorno de jogador):** a rolagem fazia perder o controle do jogo; a tela ficou mais larga (1220×600) e mostra a calçada, o salão e a cozinha juntos, sem câmera, abinhas, borda nem 2 toques (`docs/spec-v7.6.md`). A espera lá fora e a máquina de suco ficam como estavam.

---

## Etapa 2 — Manutenção e imprevistos (v8)
**Objetivo:** gastos recorrentes com escolha (a "manutenção do espaço" do Arthur), sem virar só um imposto.

**Entra:**
- **Desgaste:** fogão, geladeira e cafeteira (e a chapa, se for o caso) têm um estado de 100% a 0%, que cai um pouco por dia de uso e mais em dias cheios.
- **Manutenção preventiva** na lojinha: pagar R$ X para voltar a 100%. Sem manutenção, cresce a chance de **imprevisto** no dia:
  - geladeira quebrada: ingredientes +20% naquele dia;
  - fogão falhando: Tonhão 20% mais lento;
  - cafeteira parada: sem cafezinho.
- Conserto de emergência durante o dia, mais caro que a preventiva.
- Aviso na introdução do dia e um ícone no cenário (fumacinha, poça, "fora de serviço" na cafeteira).
- Imprevistos raros e sem culpa: **chuva** (menos gente, mais entregadores) e **feriado** (mais gente). Eles dão variedade e testam a reserva de dinheiro.

**Fora:** troca de equipamento por modelo melhor (fica para depois, se fizer falta).

**Partes:** `10-constantes.js` (`MANUT`), `16-jogo.js`, `13-cozinha.js`, `14-bia.js` (cafezinho), `21-cenario.js` (sinais visuais), `41-lojinha.js`, `43-telas.js` (introdução).

**Testes:** `smoke13` (desgaste, chance de quebra, conserto, efeitos e save). `balance` com e sem manutenção.

**Calibração:**
- Cuidar de tudo custa ~10–15% do lucro de um dia médio.
- Sem nenhuma manutenção, ~1 imprevisto a cada 3 dias a partir do dia 4.

**Decisões em aberto:**
- Quais equipamentos (sugestão: fogão, geladeira e cafeteira)?
- Conserto de emergência dentro do dia (sugestão: sim, com um toque no equipamento quebrado) ou só na lojinha?
- Chuva e feriado entram aqui ou numa etapa própria?

**Feito (v8, 22/10):** decisões do usuário: equipamentos fogão, geladeira e cafeteira; conserto de emergência com um toque na plaquinha, além da revisão na lojinha; chuva e feriado já na v8; quebras só a partir do dia 4 (o desgaste corre desde o dia 1). O que mudou em relação ao plano: os efeitos ficaram mais fortes (fogão 40% mais lento, em vez de 20%; geladeira +50%, em vez de +20%), porque com 20% e 20% a quebra custava só R$ 20 a 65 e cuidar não compensava; a revisão custa o valor cheio × o que se gastou (cheio: fogão R$ 500, geladeira R$ 440, cafeteira R$ 240), e o conserto na hora custa R$ 120, R$ 100 e R$ 50 (no plano, R$ 80 a 180); o "fora de serviço" virou a placa "QUEBRADO" (pedido do usuário, regra no `CLAUDE.md`); a geladeira foi desenhada nova (de pé, ao lado do balcão), e a quebrada ganhou porta aberta e poça; a revisão não conta como a melhoria do dia. Detalhes em `docs/spec-v8.md`.

---

## Etapa 2b — Carreira como campanha contínua e banco (v8.3)
**Feita em 23/10 (v8.3, `docs/spec-v8.3.md`).** Decisões: todas as sugestões abaixo (meta não batida segue sem estrelas; no 4º dia negativo, o banco cobre à força com juros de 20%; empréstimo de 10% em 5 parcelas, até R$ 1.000 na Garagem, em `PONTOS.credito`; chave "cortar a folha se faltar dinheiro" na aba Banco, ligada por padrão; ranking pelo lucro acumulado, numa coleção nova, `ranking-campanha`; Reiniciar como na v8.2.3). Os dias 8+ seguem o dia da semana (`SEMANA`, `diaOf`). Para a 2c: a meta não batida está nas linhas do caixa (`ok`, `st`), à espera da nota.

**Objetivo:** "novo dia, novo acúmulo, novo serviço, nova vida" (pedido do usuário em 22/10). A carreira deixa de ser uma lista de dias que se escolhem e se rejogam e vira uma sequência de dias, levando tudo o que havia antes: dinheiro, móveis, equipe, melhorias e desgaste. Como sem rejogar um dia ruim pode travar a carreira, entram junto o caixa no negativo e o empréstimo no banco. Vem antes dos pontos (etapa 3) para a carreira não ser refeita duas vezes.

**Entra:**
- **Menu da carreira com "Continuar":** abre o próximo dia; sai a escolha de dia e o "Repetir dia". A Missão zero e o Turno sem fim continuam à parte.
- **Os dias 1 a 7 viram a rampa de abertura** (movimento que cresce, como hoje); do dia 8 em diante, os dias seguem com o perfil do dia 7 e variação (chuva, feriado e o movimento de cada dia da semana, se couber).
- **A meta do dia continua** (lucro e estrelas), mas não trava: o dia seguinte vem de qualquer jeito.
- **Caixa no negativo:** a folha e as contas são pagas mesmo sem dinheiro; o caixa pode ficar negativo por até 3 dias seguidos, com aviso na introdução do dia e na lojinha.
- **Banco** (aba na lojinha, ou uma linha no Caixa): empréstimo com juros e parcelas diárias, que entram nas contas do fim do dia e aparecem no livro-caixa.
- **Recomeçar do zero**, com confirmação.
- Save antigo: segue do maior dia alcançado, com o dinheiro que tem.

**Partes:** `10-constantes.js` (dias depois do 7, `BANCO`), `16-jogo.js` (sequência, negativo, parcelas), `40-interface.js` (menu), `41-lojinha.js` (banco, folha), `42-resultados.js` (fim do dia, caixa), `43-telas.js`, `30-ranking.js`, `tests/bot.js`, `balance.js` e `carreira.js`.

**Testes:** smoke novo (sequência de dias, sem rejogar, save antigo, negativo por 3 dias e o 4º, empréstimo e parcelas, recomeçar). `carreira.js` passa a jogar a campanha (dias além do 7).

**Calibração:** um dia ruim não pode travar a carreira; o empréstimo deve custar mais do que esperar juntando; quem joga bem chega ao dinheiro da mudança para a área industrial (R$ 800) em ~5 dias, como hoje.

**Decisões em aberto:**
- O que acontece com a meta não batida (sugestão: segue, sem estrelas, e mais tarde pesa na nota da 2c)?
- O que acontece no 4º dia negativo (sugestão: o banco empresta o que falta, à força e com juros maiores; alternativa: fim da carreira, com "Recomeçar")?
- Juros, prazo e limite do empréstimo (sugestão: 10% sobre o valor, 5 parcelas diárias, até R$ 1.000 na Garagem)?
- A folha ainda pode ficar de fora quando falta dinheiro, como hoje (sugestão: sim, como opção na lojinha)?
- O que vira o ranking da carreira, que hoje soma os melhores dias (sugestão: o lucro acumulado da campanha, com o dia alcançado ao lado)?
- Reiniciar no meio do dia: continua como hoje (o dia largado não rende e cobra a multa da v8.2.3)?

---

## Etapa 2c — Avaliações dos clientes (v8.4)
**Objetivo:** a nota da lanchonete, parecida com as avaliações de mapa na internet (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`). Ela vira a "experiência" que, junto com o dinheiro, abre os pontos novos (etapa 3) e é a reputação do Terraço Suíça (etapa 4) e a régua do crítico (etapa 6).

**Entra:**
- **Cada grupo avalia ao sair** (inclusive quem sai bravo), de 1 a 5 em 5 critérios:
  - **espera por mesa:** cada coração perdido na fila tira 1 ponto;
  - **agilidade do atendimento:** cada coração perdido esperando a Bia (pedido, prato, conta) tira 1 ponto;
  - **qualidade do prato:** a faixa de acerto do cozinheiro; o Tonhão mais treinado faz mais pratos caprichados (o crítico de hoje, `CRIT`, vale a nota máxima);
  - **qualidade do menu:** quantos pratos a cozinha sabe fazer;
  - **ambiente e amenidades:** cor das cadeiras, móveis, TV e som, cafezinho, torneira e, nos pontos de cima, couvert e decoração.
- **A nota** (0 a 5 ★, uma casa decimal) é a média das **últimas 200 avaliações**. Aparece no HUD, no fim do dia e no Caixa, com a nota de cada critério e 2 ou 3 comentários curtos inventados ("A comida veio rapidinho!", "Esperei muito por uma mesa").
- **Efeito no movimento** (a decidir): nota alta traz mais gente, como um boca a boca; nota baixa, menos.
- **Pontos de atendimento (v8.3.8):** desde a v8.3.8, as ações da Bia (sentar, anotar, entregar, recolher, cor certa, corrente, caprichado) dão pontos e não dinheiro (`Game.pontos`, `result.pontos`, `save.pontosTot`). Pedido do usuário em 23/10: esses pontos contam para a nota da lanchonete ("as pessoas se sentirem bem atendidas"), e uma das metas para subir de ponto é a Garagem ter **4,5★ ou mais no Gurugol** (o site de avaliações do jogo). Decidir como os pontos entram nos critérios (sobretudo agilidade e ambiente).

**Fora:** o nível de luxo (ideia guardada) e o crítico do guia (etapa 6).

**Partes:** `10-constantes.js` (`AVAL`), `12-clientes.js` (avaliar ao sair), `13-cozinha.js` (faixa de acerto), `16-jogo.js` (média e save), `22-salao-hud.js` (nota no HUD), `41-lojinha.js` (Caixa), `42-resultados.js`, `tests/balance.js` (nota por dia).

**Testes:** smoke novo (cada critério, média das 200, save, efeito no movimento). `balance` mostra a nota média por dia, com e sem equipe.

**Calibração:** o bot afiado com equipe fica em ~4,5 ★; sem equipe, ~3,5 ★; perder muita gente derruba a nota abaixo de 3.

**Decisões em aberto:**
- O peso de cada critério (sugestão: todos iguais).
- A nota mexe no movimento (sugestão: sim, de −10% a +10%)?
- A nota inicial (sugestão: sem nota até as 20 primeiras avaliações).
- A nota mínima para mudar de ponto (sugestão: 3,5 ★ para a área industrial, 4,0 para a Avenida Brasil e 4,5 para o Terraço Suíça). **Revista na v8.6.4** (teto por ponto, abaixo): sugestão nova de 2,8 ★ para sair da Garagem, 3,4 para sair da área industrial e 4,0 para sair da Avenida Brasil (90% do teto de cada ponto).
- Os comentários aparecem só no fim do dia ou também em balõezinhos quando o grupo sai?

**Feito na v8.4 (26/10, `docs/spec-v8.4.md`).** Decisões do usuário: pesos iguais; a nota mexe no movimento de −10% a +10%; os pontos de atendimento viram bônus na agilidade (cor certa, corrente e prato caprichado, +0,5 cada); comentários no fim do dia e num balãozinho quando o grupo sai; e a média é das **últimas 100** avaliações (não 200), contando a partir da 20ª. Na calibração, cada coração vale 0,75 (com 1, nem o jogo perfeito passava de ~4,25 ★) e o coração devolvido pelo atendimento compensa um perdido. Bot afiado com equipe ~4,4 ★, com equipe ~4,2, sem equipe ~3,6. **Para a etapa 3:** a nota mínima para sair da Garagem (o usuário pediu 4,5 ★, que exige jogar muito bem; o afiado fica entre 4,35 e 4,5) e o cardápio maior dos pontos de cima (`avalMenu`).

**Teto por ponto (v8.6.4, 29/10, `docs/spec-v8.6.4.md`).** Pedido do usuário: 4 ★ e pouco numa garagem é nota alta demais e deixa a progressão numa briga por vírgulas. Agora o serviço perfeito vale o **teto do ponto** (`AVAL.teto`: Garagem 3, área industrial 3,7, Avenida Brasil 4,3, Terraço Suíça 5), mais o humor do cliente (os encantados dão até 0,8 acima do teto). Bot afiado com equipe ~2,8 ★ na Garagem (3,0 ou mais em ~5% dos dias); a nota do dia passa de 3,5 em ~1% dos dias. O movimento vai pela fração do teto (neutro em 2 ★ na Garagem).

---

## Etapa 2c-r — Rebalanceamento do Gurugol (v8.6.7 a v8.6.11)
**Objetivo:** corrigir os pontos desbalanceados do `docs/RELATORIO-GURUGOL.md` com as decisões da entrevista de 29/10 (texto em `docs/PROPOSTAS.md`). Cada sessão termina com o `balance.js` (`DUMP=1 AVAL_MOV=1`, com e sem equipe e com o bot afiado) e a nota mínima recalibrada. **Na calibração, mostre ao usuário os números do `balance.js` antes e depois de cada ajuste;** se não fechar em 2 ou 3 rodadas, pare e avise (o usuário pode trocar de modelo só para essa parte).

### Sessão 2c-r1 — As regras da nota (v8.6.7)
**Feita em 29/10 (v8.6.7, `docs/spec-v8.6.7.md`), calibrada em uma rodada.** Valores: `humor` var 0,15, encanta 0,15, extra 0,3 a 0,6, folga 0,4 (frações de `teto − 1`); bônus de 0,1 de chance por cor certa, corrente e caprichado; nota mínima arredondada para cima (2,9 / 3,6 / 4,1 / 4,8).
- **Cada um avalia só o que viveu:** a avaliação guarda `null` nos critérios que o cliente não chegou a ver, e cada critério tem a sua média (com a sua contagem); a nota da lanchonete é a média das médias. **Decidido (29/10):** desistiu na calçada, só a Espera; saiu bravo antes do pedido, Espera, Agilidade e Ambiente; bravo depois do pedido, sem comer, mais o Cardápio; quem comeu, os 5; o entregador, Espera, Agilidade e Comida (a marmita; quem não levou a marmita, só Espera e Agilidade). Mexe em `normAval` e `avalMedias` (o save antigo, sem `null`, continua valendo) e na caixa do fim do dia e na aba Gurugol (o número de avaliações de cada critério).
- **Humor proporcional ao teto:** o humor e os encantados passam a ser fração da faixa do ponto (`teto − 1`), não um valor absoluto; o limite de cada avaliação continua `teto + folga` (também proporcional) e, no Terraço, 5. Calibrar para o serviço perfeito ficar perto do teto na média e o Terraço poder cravar 5 num dia especial.
- **Bônus da Agilidade vira chance de encantar:** a cor certa, a corrente e o caprichado deixam de somar na Agilidade (que fica só pelos corações) e aumentam a chance de o cliente sair encantado (`humor.encanta`).
- **Faixa bronze** na caixa do fim do dia (`notaFaixa`), antes da prata: **a partir de 3,0** (o teto da Garagem; decidido em 29/10), com brilho de bronze. Prata, ouro e diamante ficam como estão.
- **Nota mínima para sair de um ponto:** 95% do teto (Garagem ~2,9 ★, área industrial ~3,6, Avenida Brasil ~4,2); entra de fato na etapa 3, mas a calibração é desta sessão.

**Modelo:** Sonnet, esforço alto. Mexe em 4 regras da nota e tem calibração por tentativa e erro; se a calibração não fechar em 2 ou 3 rodadas, trocar para o Opus só nessa parte (como diz o objetivo).

### Sessão 2c-r2 — Prato quente (v8.6.8) — **feito em 29/10** (`docs/spec-v8.6.8.md`; antes da 2c-r1, que ainda falta)
- O prato que fica no balcão da cozinha esperando a Bia esfria e perde nota na Comida (como as marmitas da v8.6, `esfriar`); o caprichado entregue quente continua 5. Sugestão: quente até ~8 s no balcão, depois perde até ~1,5 de serviço em ~20 s.
- Mostrar o prato esfriando (o vapor que some aos poucos; sem animação com `prefers-reduced-motion`) e comentário próprio ("Comida meio fria." já existe).
- Mexe em `13-cozinha.js` (a hora em que o prato fica pronto), `14-bia.js`/`16-jogo.js` (a entrega), `22-salao-hud.js` (o vapor) e no smoke 25; calibrar com o `balance.js` (o bot deixa prato no balcão quando está ocupado).

**Modelo:** Sonnet, esforço médio. É mecânica parecida com o `esfriar` das marmitas, com valores sugeridos; a calibração é curta.

### Sessão 2c-r3 — Cardápio que cresce com os cursos do Tonhão (v8.6.9 a v8.6.11, em 3 partes)
**Decidido na sabatina de 29/10** (texto em `docs/PROPOSTAS.md`). A Garagem começa com **PF e coxinha**; cada **curso** do Tonhão (um por lojinha) ensina um pacote de pratos e sobe a Diversidade do cardápio; cada curso tem a sua versão **avançada** ("mais requintadinha"): +15% no preço de venda dos pratos dele e chance de caprichado ×1,5 nesses pratos. Os clientes pedem pelo **gosto do tipo** (categoria), entre os pratos que a cozinha sabe. Quem já joga **recomeça a campanha** (o ranking, a abertura e a Missão zero ficam).

**Os pratos da Garagem** (chave, nome, preço de venda em R$, categoria; `carne:false` marca os sem carne, usados na 2c-r3c):

| Curso (preço) | Pratos | Avançado (preço): nome e receitas |
|---|---|---|
| — (de início) | `pf` PF 25 (pf) · `coxinha` Coxinha 8 (frito) | — |
| `fritos` Salgados fritos (R$ 220) | `risoles` Risoles 6 · `kibe` Kibe 7 · `bolinho` Bolinho japonês 8 (frito; massa frita com carne moída) | R$ 440, **"Coxinha de massa de batata com catupiry"**: vale também para a coxinha; risoles de camarão, kibe com coalhada, bolinho japonês com queijo |
| `assados` Salgados assados (R$ 250) | `empada` Empada 9 · `esfihaA` Esfiha aberta 7 · `esfihaF` Esfiha fechada 7 (assado) | R$ 500, **"Massa podre da vó Nilza"** (a Nilza é a mãe da Rosa e do Tonhão, avó da Bia): empada de frango com azeitona, esfihas com coalhada e limão |
| `chapa` Chapa (R$ 180) | `misto` Misto quente 10 (era 12) · `bauru` Bauru 12 · `paoChapa` Pão na chapa 7, `carne:false` (chapa) | R$ 360, **"Pão francês da padaria e requeijão de corte"**: misto de presunto defumado com queijo minas, bauru clássico com rosbife e picles |
| `pastel` Pastel de feira (R$ 150) | `pastel` Pastel de carne 10 · `pastelQ` Pastel de queijo 10, `carne:false` · `pastelP` Pastel de pizza 11 (pastel) | R$ 300, **"Pastel de feira de verdade"**: carne com ovo e azeitona, queijo com orégano, pizza com calabresa |
| `pf` (sem básico) | — | R$ 400, **"Carnes variadas"**: o PF passa a vir com bife, filé de frango grelhado, peixe frito ou bife a cavalo (sorteado por quem pede; desenho na 2c-r3b) |
| `veg` Vegetariano (R$ 150, na 2c-r3c) | `pfVeg` PF vegetariano 23 (pf; soja refogada no lugar do bife) · `empadaPalmito` Empada de palmito 9 (só com `assados`) · `kibeAbobora` Kibe de abóbora 7 (só com `fritos`) | R$ 300, **"Pratos veganos"**: veja a 2c-r3c |

As receitas dos avançados aparecem no cartão da lojinha e na fala do Tonhão; o avançado só aparece depois do básico (o de `pf` aparece desde o início). O nome do prato no jogo não muda com o avançado.

#### Sessão 2c-r3a — Os cursos e os gostos dos clientes (v8.6.9)
- **`10-constantes.js`:** `CARDAPIO` com os 14 pratos acima, cada um com `cat` (`pf`, `frito`, `assado`, `chapa`, `pastel`), `curso` (`null` no PF e na coxinha) e `carne` (`false` no pão na chapa e no pastel de queijo). `CURSOS` (lista na ordem da aba: `pastel`, `chapa`, `fritos`, `assados`, `pf`), cada um com `id`, `nome`, `preco` (0 no `pf`, que não tem básico), `pratos`, e `av:{ nome, preco, receita, pratos }` (o avançado de `fritos` inclui a `coxinha`; o de `pf`, só o `pf`). `CURSO_AV = { preco:1.15, crit:1.5 }`. `precoPrato(k, ponto, cursos)`: com o avançado do curso do prato, ×1,15 e arredondado (PF 25 → 29, coxinha 8 → 9).
- **Diversidade:** `AVAL.menu = { base:2, porCurso:0.6 }`; `avalMenu(cursos)` = base + 0,6 × cursos **básicos** feitos (o `veg` conta na 2c-r3c; o avançado não conta), até 5. Na 2c-r3a, o máximo é 4,4 (4 cursos); com o vegetariano, 5,0.
- **Gostos por tipo** (`GOSTOS`, no lugar de `CUSTOMER_TYPES.prefere`), pesos de PF · frito · assado · chapa · pastel: estudante 2·3·1·2·2; executiva 4·0·2·1·0; família 4·1·0·1·2; vovô e vovó 3·0·3·1·0; entregador por terço do turno (pela fração do dia que passou, `1 − clock/day.time`): 1º terço 0·3·2·1·0, 2º terço 1·0·0·0·0, 3º terço 0·4·1·0·1. Função `pedePrato(tipo, game, semPf)`: tira as categorias sem nenhum prato que a cozinha sabe, refaz a proporção com os pesos que sobram (se não sobrar nenhum, PF; com `semPf`, coxinha), sorteia a categoria e depois um prato sabido dela, com a mesma chance. O 2º item (`extras`) usa `pedePrato(..., true)`: os mesmos pesos sem o PF. `MAIS.pratos` deixa de existir. O `MARMITA.prato` do "+ marmita" continua `pf` (com os terços, adiantar só vale no meio do turno, de propósito).
- **Onde vale cada cardápio:** carreira, pelos cursos do save; **Missão zero**, só PF e coxinha (o treino continua sem 2º item); **Turno sem fim**, todos os pratos dos 4 cursos básicos, sem avançado. A placa do cardápio (`21-cenario.js`, linha do `precoPrato`) mostra "PF · Coxinha · Cafezinho".
- **Caprichado:** em `13-cozinha.js`, a chance `chef.crit` do Tonhão vezes 1,5 quando o prato é de um curso avançado feito (5% → 7,5%; 12% → 18%; 20% → 30%).
- **Save** (`12-clientes.js`, `normSave`): `cursos:{ id: 1 (básico) | 2 (avançado) }` e `cursoDia` (o dia da última compra de curso). **Um curso por lojinha:** com `cursoDia === dia`, os outros cartões ficam travados com "O Tonhão já está num curso. Volte depois do próximo dia." O curso comprado vale já no dia que começa. **Save antigo** (sem `cardV:1`): a campanha recomeça do dia 1 (`normSave({})`, só o `LS.save`; ranking, `lcc2_abertura` e o treino ficam), e o menu mostra uma vez o aviso "Novidade: o cardápio agora cresce com os cursos do Tonhão. Por isso, a campanha recomeçou do dia 1." (`save.avisoCard`, apagado ao fechar).
- **Lojinha, aba "Cursos"** (`02-telas.html`, depois de Equipe; `41-lojinha.js`, `buildCursos`): um cartão por curso com o desenho do 1º prato, o nome, o preço, a lista dos pratos com o preço de venda e "+0,6 ★ na Diversidade do cardápio"; feito o básico, o mesmo cartão vira o do avançado, com a receita, "+15% no preço destes pratos" e "Tonhão capricha mais (×1,5)"; feito o avançado, "Curso completo". Comprar segue as regras de dinheiro da aba Melhorias (livre, reservado e o aviso da folha, v8.1) e entra no Caixa na coluna Compras (`mel`). `Game.buyCurso(id)` em `16-jogo.js` (básico se não tem, avançado se tem o básico). A fala ao comprar: "O Tonhão foi fazer o curso de <nome>!".
- **Desenho provisório:** em `drawComida`, os pratos novos usam o desenho da categoria (frito, a coxinha; assado, a empada como um círculo dourado; chapa, o misto; pastel, o pastel) com uma cor por prato. Os desenhos de verdade são da 2c-r3b.
- **Como jogar** (`40-interface.js`): a dica do Gurugol troca "diversidade do cardápio" por "diversidade do cardápio (cada curso do Tonhão soma)", e uma dica nova: "A cozinha começa sabendo PF e coxinha. Na aba Cursos, o Tonhão aprende pratos novos (um curso por dia); o curso avançado deixa os pratos mais caros e caprichados. Cada tipo de cliente tem o seu gosto, e o entregador muda de ideia ao longo do dia."
- **Bot e testes:** `bot.js` (`bot.cursos`) compra 1 curso por lojinha, quando sobra o preço mais a mesma reserva dos móveis, na ordem `pastel, chapa, fritos, assados`, depois os avançados `pf, fritos, pastel, chapa, assados` (`CURSOS=0` não compra; `CURSOS='chapa,pastel'` muda a ordem). No `balance.js` (dias soltos), o dia d começa com os d−1 primeiros cursos dessa ordem (`CURSOS=bot`, padrão; `CURSOS=todos`; `CURSOS=0`). O `carreira.js` compra de verdade e mostra o dia de cada curso.
- **Smoke 31 (novo):** save novo só com PF e coxinha e `avalMenu` 2,0; +0,6 por básico, nada pelo avançado; um curso por lojinha; avançado: PF 29, coxinha 9 e caprichado ×1,5 só nos pratos do curso; 1.000 grupos sorteados só pedem pratos sabidos, o 2º item nunca é PF, o entregador pede só PF no 2º terço e nunca PF no 1º; save antigo recomeça do dia 1 com o aviso, e o ranking fica; Missão zero só PF e coxinha; Turno sem fim com os 14 pratos. Ajustar os smokes 24 e 25 (contavam 4 pratos e `avalMenu` 4,5).
- **Calibração** (mostre ao usuário antes e depois): rode `node balance.js` sem equipe e com `EQUIPE=auto`, e `BOT=afiado EQUIPE=auto DUMP=1 AVAL_MOV=1`, no `claude/main` antes de mexer (a base, depois da 2c-r2) e depois. Alvo: com equipe, até 5 pontos abaixo da base nos dias 3 a 7; sem equipe, até 8. Se cair mais, baixe as metas dos dias 2 a 5 em 5% (`METAS`) por rodada, no máximo 2 rodadas; se não fechar, pare e avise. A nota mínima (2,9 na Garagem) não muda: confira no `carreira.js` com o bot afiado que a nota geral passa de 2,9 até o dia 10; se não passar, só avise.

**Modelo:** Sonnet, esforço alto. Mexe em muitas partes (cardápio, pedido, cozinha, save, lojinha, bot) e tem calibração; as decisões estão tomadas.

**Sobra da 2c-r3a para a rodada de balanceamento (2c-r3d, depois da 2c-r3c):** a 2c-r3a fechou com as metas dos dias 2 a 5 −10% e a calibração quase fechada (sem equipe ~54% contra 63,7% de antes; com equipe ~88% contra 93,7%; alvos −8 e −5), porque o ticket médio caiu ~25% e os dias 6 e 7 não foram mexidos. A nota geral do Gurugol com o bot afiado ficou em 2,3 a 2,6 até o dia 10, abaixo dos 2,9 da Garagem. A 2c-r3d, já com os vegetarianos e veganos no jogo, volta a medir tudo (`balance.js` sem equipe, `EQUIPE=auto`, `BOT=afiado`, e o `carreira.js` com o bot afiado) e ajusta as metas dos dias 2 a 7, o ticket médio (preços ou pesos dos gostos) e a nota mínima. Planejar com o Opus: decisão de design e balanceamento por tentativa e erro. **Feita em 29/10 (v8.6.13, `docs/spec-v8.6.13.md`):** os cursos derrubavam o lucro porque diluíam o PF; agora quem pede salgado pede o 2º item em 80% das vezes (`MAIS.salgado`), as metas dos dias 6 e 7 foram para R$ 140 e 170 e a nota mínima para 90% do teto (Garagem 2,7).

#### Sessão 2c-r3b — Os desenhos dos pratos (v8.6.10)
- Em `drawComida` (`20-desenho-base.js`), um desenho próprio para cada prato da 2c-r3a, que se reconheça no prato da mesa (escala 0,52), no balão (0,85), no balcão (1,1) e na marmita: risoles (meia-lua empanada), kibe (fuso marrom com risquinhos), bolinho japonês (bolinho de massa frita recheado de carne moída, dourado e comprido), empada (forminha com tampa dourada), esfiha aberta (círculo com recheio vermelho à mostra), esfiha fechada (triângulo), misto (o de hoje), bauru (pão de forma com rosbife e alface à mostra), pão na chapa (pão francês aberto com manteiga), pastel de carne (o de hoje), de queijo (com fio amarelo) e de pizza (com pontinho vermelho de tomate).
- **Avançado, um detalhe por curso:** fritos, uma pontinha branca de catupiry; assados, uma azeitona preta em cima; chapa, as listras da chapa; pastel, as bolhinhas da massa de feira. Guardado no prato (`dish.av`) na hora em que fica pronto.
- **Carnes variadas:** com o avançado de `pf`, cada pessoa que pede PF sorteia a proteína (`bife`, `frango` grelhado com listras, `peixe` frito empanado, `cavalo`: o bife com o ovo frito em cima), guardada no prato (`dish.carne`) e desenhada no lugar do bife.
- `tests/shot_v8_6_10.py`: uma grade com todos os pratos (comum e avançado) nas 3 escalas e na marmita, e a aba Cursos, em `capturas/v8.6.10`. **Mande a grade ao usuário e espere o ok antes do PR.** Smoke 31 ganha: todo prato do `CARDAPIO` desenha sem erro, e o PF com Carnes variadas sorteia as 4 proteínas.

**Modelo:** Sonnet, esforço médio. Desenho no canvas com a lista fechada; a checagem é visual, com o usuário.

#### Sessão 2c-r3c — Vegetarianos e veganos (v8.6.11)
- **Clientes vegetarianos:** ~10% das pessoas (`VEG.chance = 0.1`; nunca o entregador) são vegetarianas (`p.veg`). Pedem só pratos com `carne:false` que a cozinha sabe, pelo gosto do tipo; sem nenhum, pedem uma coxinha de qualquer jeito, e o grupo dá **Cardápio 1** com o comentário "Não tinha nada vegetariano." (entra em `AVAL_CRIT` do menu, ruim).
- **Sem carne de fábrica:** dos 14 pratos da 2c-r3a, só o pão na chapa (Chapa) e o pastel de queijo (Pastel de feira) não têm carne. O resto, inclusive o bolinho japonês (massa frita com carne moída), tem.
- **Curso Vegetariano** (`veg`, R$ 150): ensina o PF vegetariano (R$ 23), a empada de palmito (R$ 9, só com `assados`) e o kibe de abóbora (R$ 7, só com `fritos`), todos `carne:false`. **No cartão da aba Cursos**, os 3 pratos aparecem com desenho e preço; o que depende de outro curso ainda não feito fica apagado, com "precisa do curso de Salgados assados" (ou fritos), e passa a valer sozinho quando esse curso for feito (o cartão do outro curso mostra "+ Empada de palmito (vegetariano)"); conta na Diversidade (+0,6: com os 5 básicos, 5,0) e traz **+5% de movimento**. Quem não é vegetariano pede o PF vegetariano em 20% das vezes que pede PF; os outros pratos veg entram no sorteio da categoria como os demais. Desenho: o PF com soja refogada (grumos marronzinhos, como carne moída) no lugar do bife, e um **"v" estilizado verde** sobre o prato.
- **Avançado "Pratos veganos"** (R$ 300): PF vegano (sem o ovo), coxinha de jaca, pastel de palmito (só com `pastel`), esfiha de soja (só com `assados`) e misto vegano com queijo de castanha (só com `chapa`); no cartão, como no Vegetariano, o que depende de outro curso aparece apagado com "precisa do curso de ..."; pratos novos com `carne:false` e `vegano:true`, ao preço do prato comum; +15% no PF vegetariano e caprichado ×1,5 nos pratos veg, como os outros avançados; **+5% de movimento** a mais. Desenho: uma **folhinha verde** pequena em cima do prato. Ficam sem versão vegana a empada e o bolinho japonês.
- `bot.js`: o `veg` entra na ordem logo depois de `pastel`, e `pratos veganos` no fim dos avançados. Smoke 31 ganha o vegetariano (pede só sem carne; sem opção, Cardápio 1 e o comentário; o curso soma 5% no movimento), e `shot_v8_6_11.py` mostra os pratos veg e veganos. Calibração como na 2c-r3a (o movimento a mais só pode subir o lucro; se o bot afiado passar de 95% com equipe, baixe o `VEG.mov` de 5% para 3%).

**Modelo:** Sonnet, esforço médio. Regra simples sobre a estrutura da 2c-r3a, com valores e textos fechados.

**Decisões em aberto:** o peso do Ambiente (o critério que mais separa quem gasta de quem não gasta) e a oscilação da nota (4 avaliações por dia, janela de 30), que ficaram fora da entrevista.

---

## Etapa 2d — Abertura animada do Modo História: o sonho da Bia (v8.5)
**Objetivo:** pedido do usuário em 22/10 (texto em `docs/PROPOSTAS.md`): uma animação de abertura do Modo História que conta **de onde a Bia tirou a ideia** e o **profundo desejo de ter um restaurante com a estrela do Michelzão**. Vem antes dos pontos e do modo jogável para dar o coração da história já cedo; nas etapas 5 e 6 ela vira o prólogo do Modo História.

**Entra:**
- **Botão "História" no menu**, ao lado de Carreira e Turno sem fim. Enquanto o modo não existe, ele toca a abertura e termina num cartão "Em breve: o Modo História", voltando ao menu.
- **Animação em canvas, em cenas:** cada uma com 5 a 10 s, falas em balões ou legenda na parte de baixo, e trilha curta com o áudio do jogo (respeitando o botão de som). Um toque ou clique avança a cena, e o botão "Pular" fica sempre à vista. Total de ~45 a 60 s.
- **Roteiro sugerido** (a decidir com o usuário):
  1. **A cozinha do tio:** a Bia criança num banquinho, provando o molho do tio Tonhão, então cozinheiro de um restaurante famoso do centro.
  2. **A noite da estrela:** o restaurante onde o Tonhão trabalhava ganha a estrela do Michelzão; a plaquinha brilha na porta, o salão aplaude, e a Bia, espiando da porta da cozinha, decide: "Um dia eu vou ter a minha".
  3. **Os anos de correria:** a Bia já crescida, garçonete numa lanchonete, correndo entre as mesas e guardando as gorjetas num pote escrito "Meu restaurante".
  4. **A ideia:** o tio Tonhão aposentado e a garagem da mãe da Bia vazia; ela olha para a garagem, depois para o tio, e conta as moedas do pote: não dá para a reforma. Vem o empréstimo no banco para a reforma, "tudo nos conformes da vigilância sanitária" (liga à dívida de abertura da etapa 5).
  5. **A inauguração:** a Bia e o Tonhão levantam a porta da garagem, acendem o letreiro "Lanchonete Corre-Corre" e, no céu, uma estrela pisca. Título: "O sonho da Bia".
- **Movimento reduzido:** com `prefers-reduced-motion`, as cenas viram quadros parados que trocam sem animação (só um fade curto ou nenhum) e avançam por toque.
- Lógica (cenas, tempo, falas) separada do desenho, como no resto do jogo: partes novas, por exemplo `18-abertura.js` (`ABERTURA`) e `25-abertura.js` (desenho).

**Fora:** o Modo História jogável (etapas 5 e 6).

**Partes:** `02-telas.html` (botão e tela da abertura), `10-constantes.js`, `18-abertura.js` e `25-abertura.js` (novas), `40-interface.js` (menu), `43-telas.js` (troca de telas, toque), `01-estilo.css`.

**Testes:** smoke novo (abre pelo menu, avança por toque, pula, volta ao menu, não mexe no save, movimento reduzido sem animação). Capturas de cada cena (`shot_v8_5.py`).

**Decisões em aberto:**
- O roteiro: cenas, falas e duração (sugestão acima: 5 cenas, ~50 s).
- O tom: leve e emocionante; entra a piscadela do "universo paralelo em que a meritocracia é possível" (decisão que era da etapa 5)?
- **Michelzão:** nome do guia escolhido pelo usuário em 22/10 (era "Guia Garfo de Ouro" na etapa 6). Como o Terraço Suíça, é uma brincadeira com o nome real: a estrela, a plaquinha e o letreiro são desenhos nossos, sem logo, mascote nem arte do guia de verdade.
- Onde o Tonhão trabalhava (nome inventado do restaurante) e se o chef estrelado aparece.
- A abertura toca sozinha na 1ª vez que o jogo abre (sugestão: não, para não atrasar a Missão zero; fica no botão História)?

**Feito na v8.5 (26/10, `docs/spec-v8.5.md`).** Decisões do usuário: o roteiro é dele (texto em `docs/PROPOSTAS.md`), em 9 cenas (~68 s): a mãe da Bia, a **Rosa**, cozinha com carinho e entra na Casa Aurora, onde o irmão mais velho, o **Tonhão**, já cozinhava. A casa ganha a estrela do Michelzão com o tempero dos dois, mas a fama fica com o chef **Bráulio**. A Rosa adoece e morre (só na legenda). A Bia promete seguir o caminho dela, o Tonhão sai da Casa Aurora para ajudar e a Bia pega o empréstimo para a garagem. O tom é só emocionante, sem a piscadela da meritocracia. A abertura toca sozinha uma vez, na 1ª vez que o jogo abre, e depois pelo botão História. **Para as etapas 5 e 6:** a receita especial da Casa Aurora era o toque do Tonhão, de cominho com açafrão, e a pétala de rosa da Dona Rosa (na abertura, só a pétala caindo, como pista); o Bráulio nunca conseguiu repetir o molho porque não sabia o que tinha sido feito. Na v8.5.1 (retorno do usuário), o hospital fecha a cortina depois da fala derradeira da Rosa, e uma cena nova mostra a Bia triste, sozinha (10 cenas, ~75 s). A dívida do banco da cena 8 é a dívida de abertura do Modo História.

---

## Etapa 2d-r — Revisão estética da abertura (v8.5.2)
> **Feita em 28/10 (v8.6.1, `docs/spec-v8.6.1.md`):** o usuário pediu as 5 partes de uma vez, com as sugestões abaixo nas decisões em aberto; a legenda da `promessa` ("Anos depois...") ficou como estava, à espera do sim dele.
> Nota de 28/10: a v8.6 (etapa 2e) saiu antes desta etapa; o número da versão que fecha a revisão passa a ser **v8.6.1** (onde se lê v8.5.2 abaixo).
**Objetivo:** pedido do usuário em 28/10 (texto em `docs/PROPOSTAS.md`): corrigir o que está fora no desenho e na animação da abertura. O exemplo dele foi a Rosa parecer mais baixa que o fogão e mexer a panela com uma "vareta" apontada para cima. A revisão das 10 cenas achou erros de proporção, de gesto, de leitura da cena e de composição. Os pontos estão abaixo, divididos em 5 partes.

**Como cada parte funciona (checagem do usuário):**
1. A sessão faz só a parte da vez, em `src/25-abertura.js` (e em `src/18-abertura.js` só se mudar texto ou tempo).
2. Monta, roda `tests/run_all.sh` (o smoke 26 tem que continuar verde) e manda ao usuário as capturas **antes e depois** de cada cena que mudou, em recortes.
3. **Espera a resposta.** O usuário aprova, pede mudanças no chat ou manda "Ajustes feitos no editor de desenhos" (`ferramentas/editor.py`), e a sessão aplica.
4. Só depois da aprovação: commit, PR para o `claude/main`, merge e branch apagado, como no `CLAUDE.md`. As partes 1 a 4 são commits sem versão nova, como os ajustes da abertura depois da v8.5.1. A parte 5 fecha a **v8.5.2**.
5. A sessão marca a parte como feita na lista abaixo e para. A próxima parte começa quando o usuário pedir.

**Partes:**

| Parte | O que entra | Cenas | Situação |
|---|---|---|---|
| R1 | Proporções | casa, aurora, tempero, estrela, hospital, promessa, tonhao, inauguracao | feita (v8.6.1) |
| R2 | Gestos e objetos | casa, tempero, promessa | feita (v8.6.1) |
| R3 | A cena conta a legenda | aurora, hospital, saudade, tonhao, banco | feita (v8.6.1) |
| R4 | Composição e sobreposições | casa, tempero, estrela, inauguracao | feita (v8.6.1) |
| R5 | Vida na animação e fechamento da v8.5.2 | todas | feita (v8.6.1) |

### R1 — Proporções
- **Alturas comuns:** uma tabela de alturas em px na cena (`AB_ALT`) e a escala de cada personagem calculada por ela, no lugar dos números soltos de hoje (Rosa 3.6, Tonhão 2, Bráulio 2.2, Bia criança 2.6, Bia adulta 3 e 3.2). Assim, a Bia adulta tem a mesma altura em `promessa`, `tonhao`, `banco` e `inauguracao`.
- **Fogão e bancada** (`abCozinhaCasa`, cenas `casa` e `promessa`): hoje o fogão tem 180 px (de y 290 a 470), 84% da altura da Rosa. A boca do fogão desce para a altura da cintura do avental, ~55% da altura dela (y ≈ 365), e a bancada desce junto. A panela e os corações acompanham o fogão. O banquinho da Bia criança continua fazendo sentido: em cima dele, a cabeça dela fica um pouco acima da panela.
- **Rosa deitada** (`hospital`): a cabeça passa de r=28 para o tamanho dela em pé (r ≈ 40, com o coque e a flor), e o corpo sob o cobertor fica com o comprimento dela em pé (hoje é quase o dobro). A cama encolhe para caber.
- **Fogão da Casa Aurora** (`tempero`) e as pessoas na porta (`estrela`): conferir com a tabela nova.

### R2 — Gestos e objetos
- **Colher de pau da Rosa** (`casa`): hoje ela segura a colher no quadril, em (606, 414), e a colher sobe pela frente do forno até a borda da panela. Passa a ser segurada por cima: a mão acima da borda, o cabo inclinado para fora e a ponta dentro do molho, fazendo uma pequena elipse em vez de ir e voltar para os lados.
- **Colherinha da Bia** (`casa`): hoje está ao contrário, com a parte vermelha do molho na testa (y 294). A parte vermelha vai para a boca e o cabo sai para fora e para baixo.
- **Tonhão mexendo** (`tempero`, `braco:'mexe'`): ganha uma colher de pau ou concha dentro da panela (hoje a mão só pousa na borda).
- **O segredo da Rosa** (`tempero`): no lugar do aceno, a mão fica sobre a panela, como quem solta uma pitada. A pétala fica maior e de um rosa mais forte, com contorno, para se ver cair. Quando ela cai, o molho muda de cor de um jeito que se perceba (hoje passa de `#C2362B` para `#D9502E`, quase igual), com um brilho na superfície.
- **Caderno de receitas** (`promessa`): as mãos da Bia aparecem segurando o caderno.

### R3 — A cena conta a legenda
- **Casa Aurora** (`aurora`): a porta abre e a Rosa entra (ela some atrás da porta). A Rosa chega de roupa rosa, sem o dólmã, porque ainda não trabalha lá.
- **Bia sentada** (`hospital`, `saudade`): pernas penduradas para fora do assento (hoje o corpo fica colado na cadeira). No hospital, a cadeira fica numa altura coerente com a cama.
- **Corredor do hospital** (`saudade`): uma porta com uma plaquinha (sem cruz vermelha, que é símbolo protegido) e um rodapé, para se ler "hospital" sem a legenda.
- **Tonhão animado** (`tonhao`): desanimado ao sair da Casa Aurora e sorrindo na fala "braço pra cozinha tenho de sobra!" (hoje as sobrancelhas parecem bravas).
- **Banco** (`banco`): fachada desenhada no traço da cena (colunas, porta, placa "Banco"), no lugar de `drawBanco` ampliado 7 vezes, que deixa o contorno ~7× mais grosso. A moeda vira "R$". O papel do APROVADO sai da porta do banco (ou da mão de alguém no balcão) e chega até a Bia. Fica a decidir se a reforma da garagem aparece, por exemplo numa plaquinha "Em obras".
- **Passagem de tempo** (da `saudade` para a `promessa`): a decidir (ver as decisões).

### R4 — Composição e sobreposições
- **Balões:** não cobrem a panela, a colher, os corações (`casa`) nem o lustre (`estrela`). O balão vai para o lado livre de quem fala, ou fica mais alto.
- **Vapor:** cinza-azulado claro ou com contorno, para aparecer na parede creme e no azulejo branco (`casa`, `tempero`).
- **Inauguração:** a estrela que brilha sai de perto dos botões Voltar e Pular (hoje em (1060, 90)). O título "O sonho da Bia" não encosta no telhado. As mesas ganham banquinhos.
- **Plateia** (`estrela`): gestos variados (palmas, braço erguido, braços parados) e ritmos diferentes, para não parecer cópia. O bigode do Bráulio sai de cima da boca.

### R5 — Vida na animação e fechamento da v8.5.2
- **Andar:** o personagem vira para o lado em que anda (`flip`), e não desliza de frente (Rosa em `aurora`, Tonhão em `tonhao`, Bia em `banco`).
- **Piscar e falar:** piscadas de vez em quando e a boca abrindo e fechando enquanto o balão aparece. Com `prefers-reduced-motion`, nada disso acontece.
- **Gestos suaves:** os acenos e o braço flexionado entram com uma curva rápida, em vez de aparecer de uma vez.
- **Fechamento:** versão v8.5.2 (`versoes/`, `vtag`, `VERSAO`, painel `#ov-ver`), `docs/spec-v8.5.2.md`, `docs/RESUMO.md`, `tests/shot_v8_5_2.py` com as capturas em `capturas/v8.5.2` e o artifact do editor atualizado se o usuário for usar. O artifact do jogo só é publicado quando o usuário pedir.

**Partes de `src/`:** `25-abertura.js` (quase tudo), `20-desenho-base.js` (só se a boca e o piscar entrarem em `drawPerson`/`drawBia`), `18-abertura.js` (só se mudar texto ou tempo).

**Testes:** `tests/run_all.sh` em toda parte (o smoke 26 confere a abertura). Capturas antes e depois de cada cena que mudou.

**Decisões em aberto** (cada uma com uma sugestão):
- **Ordem:** fazer a 2d-r antes da 2e? Sugestão: sim, porque a abertura é a primeira coisa que o jogador vê.
- **Alturas (R1):** Rosa e Bia adulta com ~210 px, Tonhão e Bráulio com ~230 px sem a touca, Bia criança com ~130 px (cerca de 60% da mãe).
- **Cor do molho com o segredo (R2):** sugestão: um laranja-dourado mais claro, com brilho, ligado às estrelinhas.
- **Banco (R3):** fachada desenhada (sugestão) ou o ícone de hoje com contorno fino?
- **Reforma da garagem (R3):** mostrar uma plaquinha "Em obras" no fim da cena do banco? Sugestão: não, para não alongar a cena. A inauguração já mostra a garagem pronta.
- **Passagem de tempo (R3):** a legenda da `promessa` começa com "Anos depois, a Bia guardou a lição da mãe..."? O roteiro é do usuário, então só muda com o sim dele.
- **R5 entra?** É a parte mais longa e a menos urgente. Sugestão: fazer, mas ela pode virar uma ideia guardada.

---

## Etapa 2e — Entregadores com fila própria e marmitas (v8.6)
> **Feita na v8.6 (28/10, `docs/spec-v8.6.md`).** Decisões do usuário: o prato do cardápio em marmita, pelo preço do prato; adiantar até 2 (de PF), com mais 1 vaga na prateleira para a encomenda de quem espera e validade curta (esfria em 60 s); o custo sai quando a marmita fica pronta (a que sobrar fica no prejuízo); R$ 2 de embalagem e a Efood (o app de entrega) fica com 15% do prato; ocupa uma boca do fogão, mas não usa prato limpo, e sai como quentinha com a comida desenhada na tampa; balcão na calçada, ao lado do portão; a Dani também leva. Adiantar ficou num botãozinho "+ marmita" na janela de pedidos (e não em PEDIDOS sem comanda, para não adiantar sem querer). Missão zero sem passo novo. **Para depois** (o usuário citou como upgrades futuros): prateleira de 4 marmitas e estufa, que deixa a validade quase o dia todo (`MARMITA.vagas`, `MARMITA.validade`); cabem como melhorias na 3a, que terá mais entregadores.
> Entrou no plano na revisão de 28/10 (pedido do usuário de 27/10; texto em `docs/PROPOSTAS.md`). Vem antes da área industrial, que terá mais entregadores na clientela: assim a calibração da 3a já sai com a marmita.

**Objetivo:** o entregador de moto não come no salão. Ele entra numa fila própria de retirada e leva a marmita, e a cozinha ganha um fluxo de preparo de marmitas.

**Situação hoje (v8.5.1):** o entregador (`TIPOS.entregador`: 1 pessoa, paciência 0,5, sem gorjeta) entra na fila como qualquer cliente, ocupa uma mesa e come no salão. Ele aparece desde o dia 4 e vem mais na chuva (`CLIMA.chuva`, 35%) e na sexta (`SEMANA`, 20%).

**Entra:**
- **Fila de retirada:** um balcão de retirada na calçada, ao lado da porta e separado da espera, com a sua fila. O entregador não ocupa mesa nem lugar na espera.
- **Marmita:** o pedido do entregador vai ao Tonhão como marmita (tempo e ingredientes próprios, mais a embalagem como custo).
- **Prateleira de marmitas prontas** no balcão de retirada, com limite de vagas. A Bia (ou a Dani) pega a marmita e entrega ao entregador da vez, que paga na hora.
- **Adiantar marmitas** em horário calmo (estoque na prateleira), para atender os entregadores sem parar o salão.
- A paciência continua curta; retirada rápida paga bem; quem não é atendido vai embora e conta como perdido (3ª estrela, multa).
- **Gurugol:** a espera do entregador conta na agilidade (`AVAL`).
- Como jogar, Missão zero (um passo curto, se couber), bot (`tests/bot.js`) e `balance.js` com a fila de retirada.

**Partes:** `10-constantes.js` (`MARMITA`, `TIPOS.entregador`), `12-clientes.js` (o entregador na fila de retirada), `13-cozinha.js` (marmita, prateleira), `14-bia.js` e `15-dani.js` (entregar a marmita), `16-jogo.js` (fila de retirada, chegadas, pagamento, avaliação), `21-cenario.js` (balcão de retirada e prateleira), `22-salao-hud.js` (balão do entregador, selos), `40-interface.js` (Como jogar), `tests/bot.js`.

**Testes:** smoke novo (o entregador vai à fila de retirada e não à mesa, marmita feita e entregue, prateleira cheia, marmita adiantada, entregador perdido, avaliação, chuva com mais entregadores). `balance.js` sem equipe, `EQUIPE=auto` e `BOT=afiado`.

**Calibração:** as metas dos dias 3 a 7 continuam no alvo (sem equipe ~40–70%, `EQUIPE=auto` ~85–95%) e o bot afiado segue sem perder ninguém em ≥ 80% dos dias 3 a 7. Na chuva, o dia não pode ficar impossível.

**Decisões em aberto:**
- A marmita é um item do cardápio ou um jeito de preparar qualquer prato (sugestão: o prato do cardápio feito em marmita, pelo preço do prato)?
- Dá para adiantar marmitas (sugestão: sim, até as vagas da prateleira, que começam em 2)?
- Custo da embalagem e taxa de retirada (sugestão: embalagem de R$ 2 no ingrediente, sem taxa)?
- Onde fica o balcão de retirada (sugestão: na calçada, ao lado da porta)?
- A Dani também entrega marmitas (sugestão: sim, como uma tarefa nova)?
- A marmita ocupa uma boca do fogão como um prato (sugestão: sim)?

---

**Modelo:** planejar com o Opus (esforço alto) antes, para fechar quais pratos entram na Garagem, os preços de venda e dos cursos e a chance do curso avançado; executar com o Sonnet, esforço alto (mexe no cardápio, no save, na Missão zero, no Como jogar e no bot).


## Etapa 2f — A campanha vira o Modo História (v8.7)
> Decidido na revisão de 28/10: a campanha (Carreira) e o Modo História viram uma coisa só, com um save só. A campanha já começa na Garagem com a dívida do banco, que é a história da abertura (v8.5). Esta etapa monta a estrutura e o capítulo da Garagem; os capítulos dos outros pontos entram nas etapas 3a, 3b e 4a, e o final na etapa 6. Substitui a antiga etapa 5.

**Objetivo:** "o sonho da Bia de ter um restaurante estrelado, começando do zero". Os dias da campanha passam a contar a história em capítulos, com a abertura animada como prólogo.

**Entra:**
- **Menu:** o botão História abre a campanha (no lugar do "Em breve" da v8.5). Na 1ª vez, toca a abertura e segue para a Missão zero ou o dia 1; depois, "Continuar". Decidir o que fica do botão Carreira.
- **Capítulos** (`HISTORIA = [{ cap, titulo, ponto, objetivo, falas }]`): cada um tem um objetivo (lucro acumulado, nota do Gurugol, contratar alguém, quitar parte da dívida) e um cartão de conversa curto antes e depois (Bia, Tonhão, Dani), com 2 a 4 falas em balões sobre o cenário. Os dias continuam os da campanha (`DAYS`, `SEMANA`).
- **Capítulos da Garagem** (sugestão; textos a decidir com o usuário):
  - Cap. 1, "A garagem da Rosa": os primeiros dias, aprender o ciclo e fechar no azul.
  - Cap. 2, "A Dani chega": contratar a Dani e pagar parte da dívida.
  - Cap. 3, "Casa cheia": a nota do Gurugol e o dinheiro da mudança para a área industrial.
- **A dívida de abertura** é o empréstimo da reforma da garagem (cena 8 da abertura), "nos conformes da vigilância sanitária", com prazo para quitar, usando o banco da v8.3 (`BANCO`). Sai o Seu Zé como credor.
- **A trama** (guardada desde a v8.5): a receita da Casa Aurora era o toque do Tonhão, de cominho com açafrão, e a pétala de rosa da Dona Rosa; o chef Bráulio ficou com a fama e nunca conseguiu repetir o molho. Ela se revela aos poucos, nos capítulos dos pontos.
- **Save antigo:** a campanha que já está em curso vira a história no capítulo que corresponde ao dia e ao dinheiro.
- Tom só emocionante, sem a piscadela da meritocracia (decidido na 2d).

**Fora:** os capítulos dos outros pontos (3a, 3b, 4a), o crítico do Michelzão e o final (etapa 6).

**Partes:** `02-telas.html` (menu e painel de conversa), `10-constantes.js` (`HISTORIA`), `16-jogo.js` (capítulo, objetivos), `18-abertura.js` (fim da abertura vai para a história), `40-interface.js` (menu), `42-resultados.js` (objetivo do capítulo no fim do dia), `43-telas.js`, `30-ranking.js`.

**Testes:** smoke novo (abertura e depois dia 1, objetivo cumprido e não cumprido, conversa antes e depois, save antigo da campanha, dívida de abertura). O bot joga os capítulos da Garagem.

**Decisões em aberto:**
- O botão Carreira some ou continua como "campanha sem conversas" (sugestão: some; a História é a campanha)?
- Objetivo não cumprido: o capítulo continua até cumprir (sugestão, como a meta do dia na v8.3) ou há um prazo?
- A dívida de abertura: valor e prazo (sugestão: R$ 1.000 em parcelas, com o atraso da v8.3.1 valendo game over)?
- Quanto da trama do Bráulio e da receita aparece na Garagem (sugestão: só uma pista, como a pétala da abertura)?

**Modelo:** planejar com o Opus (esforço alto) numa sessão curta antes: fechar as 4 decisões em aberto e escrever as falas dos 3 capítulos. Com isso, executar com o Sonnet, esforço alto (muitas partes ao mesmo tempo e o save antigo).

---

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).

### Vale para a 3a e a 3b
- **Mudança** na lojinha (aba "Ponto"): custo único, aluguel dali em diante e os móveis levados junto. O editor abre no ponto novo com a arrumação automática.
- Para mudar, é preciso o dinheiro da mudança **e a nota mínima do Gurugol** (etapa 2c; o usuário pediu 4,5 ★ para sair da Garagem, que exige jogar muito bem: o bot afiado ficava entre 4,35 e 4,5. Desde a v8.6.4, com o teto de 3 ★ da Garagem, o equivalente é **~2,8 ★**: o afiado fica entre 2,73 e 2,92; a decidir com o usuário). Ao mudar, as avaliações antigas continuam na média, e a nota sobe aos poucos até o teto novo.
- Cada ponto traz: multiplicador do cardápio (sugestão: ×1 e ×1,4), mistura de clientes, área útil, cadeiras de espera, visual (piso, fachada, letreiro, vista da janela, calçada) e o **capítulo da história** do ponto.
- **Ao mudar, o ambiente e a bebida da espera são trocados** pelos do ponto novo (decidido em 21/10): a TV e o som da Garagem saem do save (`equipe.tv`, `equipe.som`), como o couvert abaixo do nível 3. A torneira sai do mesmo jeito (sugestão).
- **Modo dev** (v7.5.1): os pontos entram liberados, para testar.
- O ranking da carreira segue a regra da 2b, com o ponto alcançado ao lado.
- O "cardápio maior" dos pontos de cima mexe na diversidade do cardápio do Gurugol (`avalMenu`).

### Sessão 3a — Mudança de ponto e Lanchonete na área industrial (v9)
- `PONTOS` ganha a **Lanchonete na área industrial** (nível 2: 20 lugares, aluguel R$ 120, mudança R$ 800). Clientela: trabalhadores com pressa e entregadores (que já usam a fila de retirada da etapa 2e).
- **Destravados:**
  - o 2º garçom, o **Joca** (pedido do usuário em 22/10);
  - **fogão industrial** (+1 boca: 4 pratos ao mesmo tempo), comprado na aba Manutenção no lugar do fogão da Garagem e que desgasta mais devagar (era a ideia guardada "equipamento melhor");
  - balcão de pratos com 5 vagas;
  - **ambiente:** 3 televisores com playlist de sertanejo (com anúncios: 10%, pagando a luz; sem anúncios: 15%, por R$ 20/dia mais a luz);
  - **espera:** cadeirinhas de plástico ou banquinhos de madeira e jarra de suco (a base é `BEBIDA_ESPERA.suco`, R$ 12 na conta);
  - **decoração da calçada:** violetas em vasinhos (ou um antúrio, uma samambaia pendurada).
- **Capítulo da área industrial** na história (falas a decidir com o usuário).
- **Rebalancear as melhorias** (pendência da v8.3.6): com o aluguel, rever o preço das melhorias e o limite de 1 por dia.

**Modelo:** planejar com o Opus antes (as decisões em aberto da etapa 3 e o que o Joca faz, salário e visual, valores dos destravados, falas do capítulo); executar com o Sonnet, esforço alto (sistema novo de mudança de ponto e o 2º garçom).

### Sessão 3b — Restaurante na Avenida Brasil (v9.1)
- `PONTOS` ganha o **Restaurante na Avenida Brasil** (nível 3: 24 lugares, aluguel R$ 400, mudança R$ 2.000). Clientela: executivas, famílias e mais VIPs.
- **Destravados:** confeiteiro (sobremesas), balcão de coquetelaria com profissional de drinks, um prato novo no cardápio, balcão de pratos com 6 vagas.
  - **ambiente:** o **couvert artístico** (já pronto no código desde a v5, escondido abaixo do nível 3 desde a v7.4.4: basta o ponto ter `nivel:3`);
  - **espera:** sofás e águas saborizadas diferentes;
  - **decoração da calçada:** tulipas, orquídeas ou copos-de-leite.
- **Capítulo da Avenida Brasil** na história.

**Modelo:** Sonnet, esforço médio, desde que a 3a deixe pronto o molde de um ponto novo e o planejamento já traga valores e falas da Avenida Brasil.

**Fora:** Terraço Suíça, VIP exigente e o final da história.

**Partes:** `10-constantes.js` (`PONTOS`, metas por ponto, equipe nova, `HISTORIA`), `12-clientes.js` (save `ponto`, preço), `13-cozinha.js` (bocas, balcão, sobremesa), `15-dani.js`/novo ajudante (Joca), `16-jogo.js` (carreira por pontos, contas), `20/21-*.js` (visual), `30-ranking.js`, `41-lojinha.js` (aba Ponto, fogão industrial), `42-resultados.js`.

**Testes:** smoke novo (mudança, custo, nota mínima, aluguel nas contas, móveis levados, ambiente e espera trocados, preços e clientela por ponto, destravados, save antigo = Garagem, capítulo). `carreira.js` com mudança.

**Calibração:**
- Mudar de ponto deve compensar em ~3 a 5 dias para quem atende bem e não compensar para quem perde muitos clientes.
- O jogador deve ter que escolher entre mudar e (equipe + melhorias + móveis).
- **Achado da v7.4, resolvido na v7.4.1** (`docs/spec-v7.4.1.md`): na v7.4, mesa a mais não dava lucro; com 4 pratos limpos, +6% de grupos por lugar acima de 10 e a fila justa a 60%, mesas de 4 com equipe se pagam em 1 a 3 dias. Conferir no ponto novo se os 20 e 24 lugares também rendem.

**Decisões em aberto:** a mudança é permanente ou dá para voltar; o que cada destravado custa; o que o Joca faz (o mesmo que a Dani ou só a calçada e a fila de retirada), salário, níveis e visual (sem estereótipo, com crachá como a Dani); preço e efeito de cada bebida da espera e se o assento também segura a paciência; o valor da luz das TVs do nível 2; as falas de cada capítulo.

---

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. Confeiteiro e coquetelaria continuam disponíveis.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Reputação do ponto:** é a nota do Gurugol (etapa 2c, últimas 100 avaliações). No Terraço ela muda a freguesia do dia (mais VIPs com nota alta), e na etapa 6 vira a régua do Michelzão.
- Um item de lojinha do Terraço, por exemplo "Louça fina": prato especial mais rápido.
- **Ambiente:** couvert com quarteto de cordas ou pianista (20% cada; diárias a definir; o pianista traz a manutenção diária do piano).
- **Decoração da calçada:** flores muito belas e arranjos, como ikebana, arranjos de orquídeas e flores do campo em vasos de cerâmica.
- **Capítulo do Terraço** na história, que prepara o final (etapa 6).

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `21-cenario.js` (Terraço, foyer, piano), `22-salao-hud.js` (balão do pedido especial).

**Testes:** smoke novo (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` no Terraço Suíça com equipe completa.

**Calibração:**
- O Terraço dá mais lucro só com equipe completa + Tonhão nível 3 + salão bem montado.
- Para quem não está pronto, é um passo arriscado: lucro abaixo da Avenida Brasil.

**Decisões em aberto:**
- A avaliação ruim do VIP exigente pesa mais na nota do Gurugol do que a de um cliente comum?
- O que o exigente usa para se distinguir visualmente.
- As diárias do quarteto e do pianista e a manutenção do piano.

**Modelo:** planejar com o Opus antes (as 3 decisões em aberto, regras do prato da casa e da reputação, falas do capítulo); executar com o Sonnet, esforço alto (cliente novo com regras próprias e o desenho do Terraço).

### Sessão 4b — Nível de luxo (v10.1)
**Objetivo:** o nível de luxo de 0 a 5 (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`), que soma o que o jogador montou em todos os pontos.

**Entra:**
- **Nível de luxo** (0 a 5), a soma de atributos: decoração da espera e do salão, móveis (as mesas de plástico de bar da Garagem são o degrau mais baixo), o ponto, o ambiente (TV, som, couvert, quarteto, pianista, que soma mais), o impacto da divulgação e a avaliação de críticos surpresa.
- A progressão é por atributos, como subir de nível um personagem (referência do usuário só nos docs; na interface, sem citar o jogo): cada atributo tem a sua barra, e o nível sobe quando elas sobem.
- Onde aparece: uma aba ou um quadro na lojinha, com as barras (pode reaproveitar o estilo da caixa do Gurugol da v8.4.1).
- Efeito no jogo (a decidir): mais VIPs, mais gorjeta, nota de ambiente do Gurugol, régua do Michelzão (etapa 6).
- TV, som e couvert podem sair da aba Equipe e ir para o lugar do ambiente (anotado na v7.4.4).
- **Enfeites e móveis melhores** à venda, para subir o luxo (decidir quais). Os da Garagem já existem desde a v8.6.5 (`DECOR` e a toalha xadrez), só visuais.
- **Feito na v8.6.6** (`docs/spec-v8.6.6.md`, com os valores sugeridos): **Decoração no Ambiente do Gurugol** (adiada na v8.6.5 a pedido do usuário, que mexia nas avaliações em outro branch, o do teto por ponto da v8.6.4; pode vir antes da 4b; os valores abaixo são na escala do serviço, de 1 a 5, antes do teto): a base do Ambiente cai de 3 para 2 (a Garagem pelada fica "meio sem graça"), cada planta soma ~0,3, cada peça do cantinho da Rosa ~0,25 e a toalha +0,5 só para o grupo daquela mesa (como o bônus da cadeira da cor); comentários próprios ("Que plantinha linda!", "A toalha xadrez dá um charme").

**Partes:** `10-constantes.js` (`LUXO`), `16-jogo.js` (cálculo), `41-lojinha.js` (aba ou quadro do luxo, enfeites), `21-cenario.js` e `22-salao-hud.js` (enfeites e móveis), `12-clientes.js` (efeito na freguesia).

**Testes:** smoke novo (cada atributo, nível de 0 a 5, efeito, save).

**Decisões em aberto:** os atributos e o peso de cada um; o efeito no jogo; quais enfeites e móveis entram; se a nota de ambiente do Gurugol passa a ser o luxo.

**Modelo:** planejar com o Opus antes (atributos, pesos e efeito no jogo, a lista de enfeites e móveis com preços); executar com o Sonnet, esforço médio (é cálculo e interface sobre o que já existe).

---

## Etapa 4c — Eventos de bairro (v10.2)
> Entrou no plano na revisão de 28/10 (era ideia guardada). Vem depois do Terraço, para variar com cada ponto.

**Objetivo:** dias especiais que dão variedade e testam a reserva de dinheiro, como a chuva e o feriado da v8.

**Entra:**
- **Festa junina** (em junho, ou num dia sorteado da campanha): mais famílias, pratos típicos (pamonha, milho, canjica) e enfeites de bandeirinhas.
- **Jogo do Brasil:** antes do jogo, a casa lota; durante, quase ninguém vem (todo mundo vendo), e depois vem o pico. Com a TV ligada (Garagem e área industrial), mais paciência e mais gente.
- Os eventos usam o sistema de `CLIMA` (sorteio, aviso na introdução do dia) e mudam com o ponto (o jogo do Brasil enche a área industrial; a festa junina pesa mais na Garagem).
- Times, emissoras e músicas sempre inventados; sem logos reais.

**Partes:** `10-constantes.js` (`EVENTOS`), `16-jogo.js` (sorteio, movimento do dia), `21-cenario.js` (enfeites), `43-telas.js` (introdução do dia).

**Testes:** smoke novo (sorteio, efeito no movimento, enfeites, save). `balance.js` com os eventos.

**Decisões em aberto:** quais eventos entram (sugestão: os 2); com que frequência; se o jogador pode se preparar (comprar ingredientes, decoração) antes.

**Modelo:** planejar com o Opus numa sessão curta (eventos, frequência, efeito no movimento e preparo); executar com o Sonnet, esforço médio (segue o molde do `CLIMA` da v8).

---

## Etapa 6 — Modo História: o crítico do Michelzão e o final (v11)
> Revista em 28/10: desde que a campanha virou o Modo História (etapa 2f), esta etapa fica só com o crítico e o final. O guia se chama **Michelzão** (escolha do usuário em 22/10).

**Objetivo:** a estrela do Michelzão, o fim do sonho da Bia.

**Entra:**
- **O crítico do guia:** um guia gastronômico **inventado**, o **Michelzão**. Não usar o nome "Michelin", nem logo, mascote ou arte do guia real.
  - No capítulo final, um cliente disfarçado aparece em dia sorteado.
  - Atendê-lo com 5 corações, prato caprichado e mesa limpa conta para a avaliação.
- **A receita da Casa Aurora** volta: o molho com o cominho com açafrão do Tonhão e a pétala de rosa da Dona Rosa, que o Bráulio nunca conseguiu repetir (sugestão: o prato do crítico, que a Bia faz no final).
- **Final:** a avaliação junta reputação (Gurugol), lucro, nível de luxo e o atendimento do crítico, e dá de 0 a 3 estrelas, com cena final (falas) e créditos curtos. Rejogar o final para tentar mais estrelas.
- Selo do resultado no menu (ex.: "★★ no Michelzão").
- O que acontece depois do final: a campanha continua (sugestão) ou acaba.

**Partes:** `10-constantes.js` (`HISTORIA`), `12-clientes.js` (crítico disfarçado, sem sinal óbvio, talvez um caderninho), `16-jogo.js`, `22-salao-hud.js`, `25-abertura.js` (cena final, se reaproveitar o desenho das cenas), `42-resultados.js`.

**Testes:** smoke novo (aparição do crítico, avaliação, finais). O bot termina a história.

**Decisões em aberto:**
- O crítico pode ser reconhecido (pista sutil) ou é surpresa total?
- Quantas estrelas possíveis (sugestão: 3).
- O Bráulio aparece no final?

**Modelo:** planejar com o Opus (decisões em aberto, regra de pontuação do final e as falas da cena final, que pedem cuidado de texto); executar com o Sonnet, esforço alto.

---

## Etapa 7 — Polimento (v11.1)
> **A rever com o usuário antes de começar** (revisão de 22/10).

- Celular: "Como jogar" sem rolar no celular deitado; lojinha sem rolar no 568×320 (pendências antigas do `RESUMO.md`). Testar som e toque num aparelho real.
- **Jogo online (pedido do usuário em 23/10: "onlinização só para os ajustes finais"):** desde a v8.3.3 o jogo é offline (`Rank.online = false`, ranking só no aparelho). Aqui, religar o ranking compartilhado: `Rank.online = true` e as capacidades do artifact com a leitura de `ranking-campanha` (a coleção da campanha, criada na v8.3). Fazer só com o OK do usuário.
- Revisão geral de equilíbrio com `carreira.js` e com o retorno dos jogadores (o "Copiar resumo" do Caixa). Revisar textos do "Como jogar" para os sistemas novos.
- **Conferir com jogadores** o que ficou pendente no `RESUMO.md` (Ideias pendentes): a Bia e os selos da v7.3, o editor do salão, a fila justa e a porta, as estrelas, a escassez, o "livre" e "reservados" da lojinha e a tela larga.

**Modelo:** a revisão com o usuário é com o Opus; depois, ajustes de tela no celular com o Sonnet, esforço médio; religar o ranking (`Rank.online = true` e capacidades) com o Haiku, esforço baixo; a revisão geral de equilíbrio com o Sonnet, esforço alto.

---

## Ideias guardadas (sem etapa ainda)
- **Virou a etapa 2e (revisão de 28/10), feita na v8.6.** **Entregadores: fila própria e marmitas** (pedido do usuário em 27/10; texto em `docs/PROPOSTAS.md`): hoje o entregador de moto entra na fila como qualquer cliente, senta e come no salão. A ideia é ele **não comer no lugar**: chega pela porta (ou por um balcão de retirada) e entra numa **fila própria de retirada**, separada da fila de mesas, e leva a comida embora. O prato dele é a **marmita**, e para liberá-la pede um **fluxo de preparação**: o Tonhão faz a marmita (tempo e ingredientes próprios, talvez com embalagem como custo), ela fica pronta num ponto de retirada (balcão ou prateleira, com limite de vagas) e a Bia (ou a Dani) entrega ao entregador quando a marmita está pronta. Quem não é atendido a tempo vai embora (paciência curta, como hoje); retirada rápida paga bem. Decidir: se a marmita é um item do cardápio ou um modo de preparo de qualquer prato; se dá para **adiantar marmitas** em horário calmo (estoque no balcão) para liberar os entregadores sem parar o salão; custo da embalagem e preço (taxa de retirada?); como aparece na chuva, quando mais clientes viram entregadores (`CLIMA`), e na sexta, quando vêm mais; efeito nas avaliações do Gurugol (`AVAL`: a espera do entregador conta como agilidade). Combina com o balcão de pratos e com os funcionários extras (Joca).
- **Vai nas etapas 3a, 3b e 4a (revisão de 28/10).** **Espera lá fora por nível do salão** (pedido do usuário em 22/10; texto em `docs/PROPOSTAS.md`): a estética e o serviço da espera na calçada sobem junto com o ponto. Cada ponto tem `assento` e `bebida` (`PONTOS`, `BEBIDA_ESPERA`, desde a v7.7):

| Nível | Ponto | Assento | Bebida da espera | Situação |
|---|---|---|---|---|
| 1 | Garagem | **de pé** (faixa pintada no chão) | **copo d'água da torneira**, de graça (melhoria de R$ 80) | **feito na v7.7** |
| 2 | área industrial (etapa 3) | **cadeirinhas de plástico ou banquinhos de madeira** | **jarra de suco** (a base é a máquina de suco da v7.5, guardada em `BEBIDA_ESPERA.suco`: R$ 12 na conta) | a fazer |
| 3 | Avenida Brasil (etapa 3) | **sofás** | **águas saborizadas diferentes** | a fazer |
| 4 | Terraço Suíça (etapa 4) | **poltronas individuais** | **coquetelaria lá fora** | a fazer |

  - Decisões em aberto: preço e efeito de cada bebida (a de cima rende mais na conta ou segura mais a paciência?); se o assento também segura a paciência (sentado espera com mais calma que de pé) ou só soma ao **nível de luxo**; se a coquetelaria lá fora usa o profissional de drinks do balcão de coquetelaria (níveis 3 e 4); o que acontece com a torneira na mudança (sugestão: como o ambiente, a bebida do nível de baixo sai e entra a do ponto novo).
  - **Decoração da calçada por nível** (pedido do usuário em 22/10, mesma conversa): plantas e enfeites sobem junto com o ponto. Nível 1, Garagem: **espada-de-são-jorge**, plantinhas simples (vaso de barro e lata reaproveitada; **feito na v7.7**). Nível 2: uma planta um pouco maior e mais bonita, por exemplo **violetas** em vasinhos (ou um antúrio, uma samambaia pendurada). Nível 3: flores mais rebuscadas, como **tulipas**, **orquídeas** ou **copos-de-leite**. Nível 4: **flores muito belas e arranjos**, como **ikebana**, arranjos de orquídeas e flores do campo em vasos de cerâmica. Só visual por enquanto; mais tarde soma ao **nível de luxo**.
  - Desenho de cada um com o seu (banquinhos e jarra na mesinha; sofás com almofadas e garrafas coloridas; poltronas, tapete e balcãozinho de drinks), respeitando `prefers-reduced-motion`.
- **Vai nas etapas 3a, 3b e 4a (revisão de 28/10).** **Ambiente por nível do salão** (pedido do usuário em 21/10; texto e decisões em aberto em `docs/PROPOSTAS.md`). Em todos, a paciência nas mesas cai mais devagar, como na v7.4.4 (`ambienteEffect`):
  - **nível 1, Garagem:** TV de tubo na Rede Esfera (5%, luz R$ 15/dia) e som na rádio Velha Brasil FM (5%, luz R$ 10/dia). **Feito na v7.4.4.**
  - **nível 2, área industrial (etapa 3):** 3 televisores com playlist de sertanejo. Com anúncios: 10%, pagando a luz; sem anúncios: 15%, por R$ 20/dia mais a luz.
  - **nível 3, Avenida Brasil (etapa 3):** o couvert artístico de hoje (músico, 20%, R$ 80/dia, taxa opcional de R$ 3 por pessoa que corta o efeito à metade). Já está no código, escondido abaixo do nível 3.
  - **nível 4, Terraço Suíça (etapa 4):** couvert com quarteto de cordas ou com pianista, os dois com 20% (diárias a definir). O pianista também soma ao **nível de luxo** do ambiente (pontuação para o futuro) e traz a manutenção **diária** do piano.
  - **Ao mudar de ponto, o ambiente é trocado** (decidido em 21/10): o do nível de baixo sai, com os bônus dele; cada ponto só tem o ambiente do seu nível. Na etapa 3, a mudança desliga a TV e o som da Garagem (`equipe.tv` e `equipe.som` saem do save, como o couvert abaixo do nível 3).
  - Desenho: cada nível com o seu (paredão de 3 TVs, palco do músico, quarteto, piano de cauda), respeitando `prefers-reduced-motion`; nomes de emissoras, rádios e músicas sempre inventados.
- **Virou a etapa 2b (revisão de 22/10).** **Carreira como campanha contínua** (pedido do usuário em 22/10; texto em `docs/PROPOSTAS.md`): acabar com o sistema de níveis (escolher o dia no menu, repetir o dia para tirar mais estrelas) e virar uma campanha: "novo dia, novo acúmulo, novo serviço, nova vida", seguindo com tudo o que havia antes (dinheiro, móveis, equipe, melhorias, desgaste). **O progresso** (mesmo pedido, depois da v8.2.1): vem do acúmulo de experiência e dinheiro, que levam a novos restaurantes (os pontos das etapas 3 e 4: área industrial, Avenida Brasil, Terraço Suíça); decidir o que é a "experiência" (dias completos? clientes atendidos? avaliações, que já estão nas ideias guardadas?) e quanto de cada uma abre o próximo ponto. Solução de agora: rejogar guarda o dinheiro dos dias completos e, desde a v8.2.2, só o dia completo rende (a folha é paga no fim dele; interromper não paga nem ganha). Decidir: o que acontece com a meta não batida (o dia seguinte vem igual? fica mais difícil? perde reputação?); se os dias 1 a 7 viram uma sequência sem fim (com os pontos das etapas 3 e 4 como degraus); o que vira o ranking da carreira (hoje soma os melhores dias) e as estrelas; se há um jeito de recomeçar do zero. Combina com o Modo História (etapas 5 e 6) e com o dinheiro no negativo (abaixo).
- **Virou a etapa 2b (revisão de 22/10).** **Dinheiro no negativo e empréstimo no banco** (retorno do usuário em 22/10; texto em `docs/PROPOSTAS.md`): em vez de a folha ficar de fora quando falta dinheiro, deixar o caixa ficar negativo, mas no máximo 3 dias seguidos; e a opção de pegar um empréstimo no banco, com juros. A v8.1 só mostrou o dinheiro já comprometido. Decidir: se a folha passa a ser sempre paga (negativo) ou se o corte continua como opção; o que acontece no 4º dia negativo (fim da carreira? empréstimo obrigatório?); juros, prazo e parcelas (saem da folha do dia?); uma aba Banco na lojinha ou uma linha no Caixa. Combina com a dívida de abertura da etapa 5.
- **Feito na v8.3.10.** **Triturador de lixo** (pedido do usuário em 24/10; texto e números em `docs/PROPOSTAS.md`): R$ 180, 1 gominho a cada 30 s; o Ventilador perdeu o efeito do cheiro.
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
- **Virou o fogão industrial da etapa 3a (revisão de 28/10).** Equipamento melhor no lugar da manutenção (fogão industrial etc.).
- **Vai na etapa 3a (o Joca).** Mais funcionários: um segundo garçom, além da Dani. **Pedido do usuário em 22/10:** a partir do nível 2 ou 3, dá para contratar um **segundo ajudante, o Joca** (o 2º garçom da etapa 3; texto em `docs/PROPOSTAS.md`). Decidir: se o Joca faz as mesmas tarefas da Dani ou outras (por exemplo, cuidar só da calçada: levar o grupo à mesa e servir a espera), salário, níveis e visual (sem estereótipo, com crachá como a Dani).
- **Virou a etapa 4c (revisão de 28/10).** Eventos de bairro: festa junina, jogo do Brasil.
- **Virou a etapa 2c (revisão de 22/10).** **Avaliações dos clientes como meta para avançar** (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`): uma nota parecida com as avaliações de mapa na internet, que sobe ou desce pela média das **últimas 200 avaliações** de quem passou. Cada grupo avalia 5 critérios:
  - **espera por mesa:** cada coração perdido na fila tira 1 ponto;
  - **agilidade do atendimento:** cada coração perdido esperando a Bia (pedido, prato, conta) tira 1 ponto;
  - **qualidade do prato:** cada cozinheiro tem uma faixa de qualidade e de acerto; mais treinado, faixa mais alta e mais pratos caprichados (o crítico de hoje, `CRIT`, vira 100% de perfeição, nota máxima);
  - **qualidade do menu:** quantos pratos o cardápio tem (só os que os cozinheiros foram treinados para fazer);
  - **ambiente e amenidades:** a estética do salão (enfeites, móveis melhores que as mesas de plástico da Garagem), couvert e outros entretenimentos, cafezinho etc.

  Uma das metas para passar de fase seria a nota mínima de avaliação. Combina com o **nível de luxo** (abaixo), com a escada de pontos (etapas 3 e 4) e com o crítico do guia (etapa 6).
- **Virou a etapa 4b, junto com o Terraço (revisão de 28/10).** **Nível de luxo** (0 a 5, bem para frente, depois de tudo o que está na fila; pedido do usuário em 21/10): a soma dos enfeites (decoração da área de espera e do salão), da localização (ponto), do impacto da mídia (divulgação), da avaliação de críticos surpresa e de outras coisas a ponderar. A progressão seria parecida com a de subir de nível de um personagem por atributos (o usuário citou o sistema do Kratos em God of War Ragnarök como referência; na interface, sem citar o jogo).
