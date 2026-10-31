# Plano: etapas já feitas

Etapas concluídas (1a a 3a), movidas de `docs/PLANO.md` em 30/10/2026 e 31/10/2026 (rodada 2 do enxugamento) sem editar o texto. Só para consulta; a situação de cada uma está na tabela do `PLANO.md`.

---

### Sessão 3b-5 — O Anselmo e os drinks da Avenida (v9.5)
**O Anselmo** (coqueteleiro): era o coqueteleiro do restaurante do Bráulio, saiu porque lá era muito difícil trabalhar e achou a casa nova depois de conversar com o Tonhão. Entra **só na Avenida** (`ponto.nivel >= 3`; no modo dev, em qualquer ponto), **já com habilidade**: não passa por aprendiz e não faz as tarefas da lista; fica no balcão de drinks.
- `STAFF.anselmo = { levels:[ null, null, { speed:0.8, pay:90, xp:0 }, { speed:1.0, pay:130, xp:0 } ] }`: contratar já põe no **nível 2** (R$ 90/dia). O nível 3 vem dos cursos do Terraço (4a); na Avenida ele não sobe pelo trabalho. Save: `equipe.anselmo` (0, 2 ou 3). `FOLHA_CORTE`: o **Anselmo não vem** (`anselmo`: `eq.anselmoFora = true` só naquele dia, como o `jocaFora`) logo depois das TVs e antes da Cami (a ordem em "A equipe ponto a ponto"); `normEquipe` e `payroll` contam ele.
- **Balcão de drinks** (vem com a contratação): estação `STATIONS.drinks` na parede do fundo, à esquerda da vitrine da Dani: `rect:{ x:620, y:92, w:60, h:50 }`, `ap:{ x:700, y:150 }` (no corredor à direita das mesas, fora da `area` do ponto, que vai até x 684: um `ap` em x 650 ficaria em cima das cadeiras da 1ª fileira; na `STATION_KEYS`, com `estacaoOn('drinks')` só com o Anselmo), com **2 vagas** de copo pronto. O Anselmo fica atrás dele (`ANSELMO_HOME = { x:650, y:118 }`), com o desenho de chacoalhar a coqueteleira enquanto prepara (parado com `prefers-reduced-motion`). Não é um `Helper`: é uma fila de preparo em `16-jogo.js`, um drink por vez, **4 s / `speed`** cada (`DRINKS.prep`).
- **Quem pede** (`DRINKS.pede`), **ao sentar**, junto com o pedido: `{ executiva:0.35, negocios:0.5, familia:0.15, vovos:0.15, estudante:0.25 }`, VIP +0,2, nunca o entregador; `randi(1, size)` drinks, cada um sorteado entre os 3. Sem o Anselmo, ninguém pede. O pedido vai para a fila dele quando a Bia anota; o copo pronto fica no balcão, a Bia pega (toque, 2 por mão com a bandeja) e leva. O grupo come normalmente, mas só pede a conta depois de receber os drinks (como o suco da mesa); drink não entregue sai da conta e o grupo perde paciência como no suco pendente.
- **Os drinks** (`DRINKS.itens`; nomes inventados, sem dizer se têm álcool): **"Pôr do Sol da Avenida"** (laranja e vermelho, em degradê), **"Brisa de Maracujá"** (amarelo, com hortelã) e **"Esmeralda"** (verde, com rodela de limão). **R$ 22** cada (ingrediente R$ 6), +5 pontos (`PONTOS_ACAO.drink`), devolve 1 coração e +0,25 no Ambiente de quem tomou (`AVAL.amb.drink`).
- **Visual** (sem estereótipo, com crachá): homem de uns 45 anos, pele negra retinta, cabeça raspada e barba grisalha curta, camisa branca de manga dobrada com colete preto, gravata-borboleta bordô e crachá "ANSELMO".
- **Lojinha (Equipe):** cartão do Anselmo ao lado da Cami: nível, salário, "Drinks no balcão" e, no lugar dos cursos, "Cursos no Terraço Suíça". No Modo História abre pelo `LIBERA` (abaixo); fora dele, aberto na Avenida.
- **Conversa** (`LIBERA`, `id:'anselmo'`, `nivel:3`, `dia:3`, `ate:6`); gatilho: Ambiente ≤ 3,5 em 3 avaliações do dia (`tres(4, 3.5)`, como o da Decoração, que usa 2,5); reclamações: "Não tem nem um drinkzinho aqui?", "No restaurante da frente tem drink." Falas: Tonhão "Bia, lembra do Anselmo, o dos drinks do Bráulio? Encontrei ele na feira." / Anselmo "Seu Tonhão me contou da casa nova. Lá no Bráulio não dava mais: era grito o dia inteiro." / Bia "Aqui ninguém grita. Só a chapa, de vez em quando." / Anselmo "Me dá um balcão e eu faço o drink mais bonito da Avenida." / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.anselmo = 'Anselmo'`, `convCabeca` com ele e cor do nome própria (bordô `#8E3B46`).
- Gurugol: comentário bom "O drink do balcão é uma obra de arte!"; ruim (esperou o drink e perdeu coração) "Pedi um drink e ele nunca veio."

**Partes:** `10-constantes.js` (`STAFF.anselmo`, `DRINKS`, `STATIONS.drinks`, `PONTOS_ACAO`, `AVAL`, `LIBERA`, `HIST_NOMES`), `12-clientes.js` (pedido ao sentar), `16-jogo.js` (fila de preparo, folha), `19-conversa.js`, `20-desenho-base.js` (Anselmo, os 3 drinks), `21-cenario.js` (balcão), `22-salao-hud.js` (balão do drink), `41-lojinha.js` (cartão), `42-resultados.js` (drinks no fim do dia).

**Testes:** **`tests/smoke46.js` (novo):** (1) cartão do Anselmo só na Avenida; contratar põe nível 2 e R$ 90 na folha; (2) sem ele ninguém pede drink; com ele, as chances por tipo (em 300 grupos) e nunca o entregador; (3) a fila: um drink por vez, 4 s / 0,8, no máximo 2 copos no balcão; (4) o grupo só pede a conta depois dos drinks e paga R$ 22 cada; não entregue sai da conta; (5) Ambiente +0,25; (6) corte da folha: ele é o primeiro a não vir; (7) conversa do `LIBERA` no 3º a 6º dia na Avenida; (8) save da v9.4 sem Anselmo carrega igual. `bot.js`: contrata o Anselmo e leva os drinks. `balance.js` `PONTO=avenida EQUIPE=auto`: o alvo de 85–95% continua; se passar de 95%, drinks R$ 18. `carreira.js`: o ganho por dia com ele menos o salário fica ≥ R$ 30; se não, `DRINKS.pede` +0,1 em cada tipo. Capturas `tests/shot_v9_5.py`: o Anselmo no balcão (preparando e parado), os 3 drinks, balão do drink, cartão dele, conversa.

**Fechamento:** v9.5 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.5.md`, `RESUMO.md`), PR e merge.

**Modelo:** Sonnet, esforço médio. Segue o molde do suco da mesa e do cartão do Joca, com números e textos fechados.

## Situação das etapas feitas

| # | Etapa | Versão | Situação |
|---|---|---|---|
| 3b-2d | Painel do modo dev: qualquer dia, ponto, nota, equipe e cursos; lojinha de verdade; acelerar e encerrar o dia | v9.2.1 | feita em 31/10 (`docs/spec-v9.2.1.md`) |
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
| 2c-r4a | Melhorias sem o limite de 1 por dia e o fim do dia sem o (n) do Gurugol | v8.6.14 | feita (30/10; ver `docs/spec-v8.6.14.md`) |
| 2c-r4b | Lojinha em 4 grupos com cartões | v8.6.15 | feita (30/10; ver `docs/spec-v8.6.15.md`) |
| 2f | A campanha vira o Modo História: estrutura e capítulos da Garagem | v8.7 | feita (30/10; ver `docs/spec-v8.7.md`; alvos do `carreira.js` e do `balance.js` batidos sem mexer nos valores) |
| 2g | O Tonhão sobe de nível com os cursos (XP e aumento que consolida; 5 níveis) | v8.8 | feita em 30/10 (`docs/spec-v8.8.md`) |
| 2h | A Dani sobe de nível com trabalho e cursos (XP e aumento que consolida) | v8.9 | feita em 30/10 |
| 2c-r6 | Retorno de beta-tester: cardápio fácil de achar (cartão Cardápio com os cursos, conversa do dia 2, selo "novo", reclamação dos clientes) e balão do Tonhão embaixo do Pular | v9.0.1 | feita em 30/10 (`docs/spec-v9.0.1.md`); depois, v9.0.2 e v9.0.3 fora do plano |
| 2c-r7a | A lojinha abre aos poucos: cartões que aparecem com reclamação e conversa (Bia, Melhorias, Manutenção, Salão, Decoração) | v9.0.4 | feita em 31/10 (`docs/spec-v9.0.4.md`) |
| 2c-r7b | Rebalanceamento e a melhor ordem de liberação dos cartões | v9.0.5 | feita em 31/10 sem versão nova: a ordem A (rascunho) ficou; a fila de uma conversa por fim de dia faz os 5 cartões abrirem até a lojinha do dia 11 (`docs/spec-v9.0.4.md`, fim) |
| 3b-1 | Restaurante na Avenida Brasil: os caps. 6 e 7, o almoço de negócios, a parmegiana, os sofás, as águas saborizadas e as flores | v9.1 | feita em 31/10 (`docs/spec-v9.1.md`; a 5ª vaga de espera da área industrial ganhou posição; metas ×1,7) |
| 3b-1r | Realinhamento: o `LIBERA` depois da Garagem (base do Joca e do Anselmo) e o Cantinho da Rosa desenhado nos pontos novos | v9.1.1 | feita em 31/10 (`docs/spec-v9.1.1.md`) |
| 3b-2 | A Dani confeiteira e o Joca, na área industrial | v9.2 | feita em 31/10 (`docs/spec-v9.2.md`; a geladeirinha ficou em (696, 206), abaixo da geladeira grande) |

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

## Etapa 2c-r4 — Lojinha em grupos e fim do dia mais limpo (v8.6.14 e v8.6.15, em 2 sessões)
> Pedido do usuário de 30/10 (texto em `docs/PROPOSTAS.md`), decidido na entrevista da mesma data. Vem antes da 2f. **Sem decisões em aberto:** as duas sessões são de execução, com o Sonnet. Cada sessão é uma versão completa (testes verdes, `docs/spec-vN.md`, `RESUMO.md`, `CLAUDE.md` se mudar algo dos testes, PR com merge no `claude/main`; publicar no artifact só se o usuário pedir). Se a sessão achar algo que o plano não decide, para e pergunta.

**Objetivo:** a lojinha tem 10 abas numa fileira, cansativa de olhar. As melhorias deixam de ter o limite de 1 por dia (a), e as abas viram 4 grupos com cartões (b). No fim do dia, a caixa do Gurugol perde o número entre parênteses (a).

### Sessão 2c-r4a — Sem o limite de 1 melhoria por dia e sem o "(n)" no fim do dia (v8.6.14)
Vem primeiro porque mexe na regra e no balanço; a 2c-r4b só reorganiza a tela.

#### Fim do dia: sem o "(n)" do Gurugol
- O número depois de cada critério, como "Agilidade (4)", é quantas avaliações do dia deram nota àquele critério (v8.6.7). **Sai só da caixa do fim do dia.** Continua na aba Gurugol da lojinha, no `aria-label` e no `title`.
- `src/42-resultados.js`: `gurugolCaixa` (linha `c.nome + (m.cnt ? ' (' + m.cnt[i] + ')' : '')`) ganha uma opção (ex.: `semCnt`) que o fim do dia passa e a aba Gurugol não passa.

#### Melhorias sem o limite de 1 por dia
- O limite agora é o dinheiro. **Os cursos do Tonhão continuam 1 por lojinha** (`cursoTrava`, sem mudança).
- `src/16-jogo.js`: em `buy`, sai `this.shopBought` da condição e das atribuições; saem `shopBought` e `boughtFor` do jogo (construtor, `goShop`, linha 801). Os Tênis de corrida continuam pedindo os Tênis novos (`req`).
- `src/41-lojinha.js`: o texto `#shop-limit` vira "Melhorias à vontade, se o dinheiro der. Cursos: 1 por dia." (modo dev igual); sai o `fecha` por `game.shopBought`. Tirar "fora da melhoria do dia" da descrição do Jogo de pratos (`10-constantes.js`) e de qualquer texto do Como jogar (`40-interface.js`) e da Missão zero (`17-treino.js`) que fale em 1 melhoria por dia (grep "melhoria do dia", "1 melhoria", "uma melhoria").
- Bot (`tests/bot.js`, `carreira.js`, `balance.js`): o bot compra **na ordem de sempre, todas as que o dinheiro der, guardando a folha do dia** (mesma reserva que já usa). **Só medir, sem reajustar preços** (decisão do usuário): rodar `balance.js` (sem equipe, `EQUIPE=auto`, `BOT=afiado`) e `carreira.js`, anotar os números novos na spec e no `CLAUDE.md` e avisar o usuário; se ficar fácil demais, o reajuste é outra conversa.

**Testes:**
- Ajustar os smokes que conferem o limite: `smoke.js:61`, `smoke12.js` (corrida depois dos tênis continua; "uma melhoria por visita" sai), `smoke13.js:32`, `smoke23.js:23 e 32`, `smoke29.js:24`, `smoke30.js:19`: passam a conferir que **dá para comprar 2 melhorias na mesma lojinha** e que **o 2º curso no mesmo dia continua recusado**.
- Smoke novo `smoke32.js`: compra Tênis, Bandeja e Ventilador na mesma lojinha com dinheiro; recusa sem dinheiro; Tênis de corrida antes dos Tênis novos é recusado; 2º curso no mesmo dia recusado; a caixa do fim do dia não tem "(" nos nomes dos critérios e a aba Gurugol tem.
- `balance.js` sem equipe, `EQUIPE=auto` e `BOT=afiado`, e `carreira.js`: anotar antes e depois na spec.

**Partes:** `10-constantes.js` (texto do Jogo de pratos), `16-jogo.js` (`buy`, `shopBought`, `boughtFor`), `17-treino.js` e `40-interface.js` (só textos, se houver), `41-lojinha.js` (`#shop-limit`, `fecha`), `42-resultados.js` (`gurugolCaixa`), `tests/` (`bot.js`, `carreira.js`, smokes).

**Modelo:** Sonnet, esforço médio: regra simples e plano fechado; o trabalho maior é ajustar smokes e rodar o balanço.

### Sessão 2c-r4b — Lojinha em 4 grupos com cartões (v8.6.15)
Depende da 2c-r4a (sem o limite, a seção da Bia não precisa de aviso de "melhoria do dia").

#### O que muda
A fileira `#shop-tabs` (`02-telas.html`) passa a ter 4 botões; ao tocar num grupo, a área da lojinha mostra os **cartões das seções** do grupo; ao tocar num cartão, abre a seção, com um botão **"‹ Voltar"** no alto que volta aos cartões do grupo. **Cartão: só ícone e nome** (sem resumo nem selo), ícones de `upgradeIcon` (`41-lojinha.js`) ou um novo no mesmo estilo.

| Grupo | Cartões (nesta ordem) | Conteúdo |
|---|---|---|
| **Lanchonete** | Melhorias · Salão · Decoração · Manutenção · Divulgação | Melhorias: Água da torneira, Cafeteira de 2 bocas, Ventilador de teto, Triturador de lixo, Jogo de pratos. Divulgação: a de hoje, mais o músico (couvert) e a TV e som, que saem da aba Equipe. Salão, Decoração e Manutenção ficam como estão. |
| **Equipe** | Bia · Tonhão · Dani | Bia: Tênis novos (e os de corrida), Bandeja, Livrinho de Sudoku (saem de Melhorias). Tonhão: o aumento (nível 1 a 3) e os Cursos (a aba Cursos inteira). Dani: contratar, nível e tarefas. |
| **Dinheiro** | Banco · Caixa | Como estão. |
| **Gurugol** | — | Abre direto a aba Gurugol, sem cartões. |

- Estado: `shopTab` continua guardando a seção (`melhorias`, `bia`, `tonhao`, `dani`, `salao`, …) e entra `shopGrupo` (`lanchonete`, `equipe`, `dinheiro`, `gurugol`); `shopTab = null` mostra os cartões. A lojinha abre em **Lanchonete, nos cartões**. Trocar de grupo vai aos cartões dele.
- `buildEquipe` se divide em `buildBia`, `buildTonhao` (aumento + o conteúdo de `buildCursos`) e `buildDani`; os cartões do músico e da TV vão para `buildDivulga`. `buildMelhorias` filtra os ids da Bia (`tenis`, `corrida`, `bandeja`, `sudoku`).
- `window.__lcc.setShopTab(v)` segue funcionando com o nome da seção (acerta o grupo sozinho), para os smokes e scripts de captura antigos; entra `setShopGrupo(g)`.
- CSS (`01-estilo.css`): `.shopcards` (grade de cartões grandes, 3 por fileira; 2 no celular em pé) e o botão Voltar. O menu da lojinha não pode rolar (`menu_fit.py`).

**Testes:**
- Smoke novo `smoke33.js`: a lojinha abre em Lanchonete nos cartões (5 cartões); cada grupo mostra os seus cartões na ordem da tabela; Gurugol abre direto; Voltar volta aos cartões; trocar de grupo vai aos cartões; `setShopTab('cursos')` cai em Equipe › Tonhão; a Bia mostra Tênis, Bandeja e Sudoku e Melhorias não; o músico e a TV aparecem em Divulgação e não em Tonhão nem em Dani.
- Os smokes antigos que usam `setShopTab` continuam verdes sem mudança.
- `python3 menu_fit.py` e uma captura nova `shot_v8_6_15.py` (cartões dos 4 grupos, Bia, Tonhão, Divulgação; tela larga e celular em pé) em `capturas/v8.6.15`, conferida por recortes.

**Partes:** `02-telas.html` (`#shop-tabs`), `01-estilo.css` (`.shopcards`, Voltar), `41-lojinha.js` (grupos, cartões, `buildBia`/`buildTonhao`/`buildDani`, músico e TV em `buildDivulga`, filtro em Melhorias), `43-telas.js` (`__lcc`), `tests/`.

**Modelo:** Sonnet, esforço médio: só interface, com a tabela de grupos e os nomes já decididos.

---

## Etapa 2f — A campanha vira o Modo História (v8.7) — FEITA em 30/10 (`docs/spec-v8.7.md`)
> Decidido na revisão de 28/10: a campanha (Carreira) e o Modo História viram uma coisa só, com um save só. Esta etapa monta a estrutura e os 3 capítulos da Garagem; os capítulos dos outros pontos entram nas etapas 3a, 3b e 4a, e o final na etapa 6. Substitui a antiga etapa 5. **Planejada com o usuário em 30/10** (respostas em `docs/PROPOSTAS.md`): as decisões abaixo estão tomadas.

**Objetivo:** "o sonho da Bia de ter um restaurante estrelado, começando do zero". Os dias da campanha contam a história em capítulos, com a abertura animada como prólogo e a dívida da reforma da garagem desde o dia 1.

### Decisões tomadas (30/10)
- **A Carreira some; tudo é a História.** Um save só (`lcc2_save`), os dias continuam os da campanha (`DAYS`, `SEMANA`).
- **Objetivo não cumprido:** o capítulo continua, dia após dia, até cumprir. Sem prazo e sem game over próprio (o que pune é só o banco, como na v8.3.1).
- **Dívida da reforma:** R$ 1.000 em 10 parcelas de R$ 100, juros de 1% ao dia sobre o saldo, a 1ª parcela no fim do dia 2 (quita no fim do dia 11 sem amortizar). O atraso da v8.3.1 vale (2 dias atrasados: o banco toma a lanchonete).
- **A Dani entra de graça, como o Tonhão:** no começo do cap. 2 chega como aprendiz, sem salário, e sobe de nível com aumentos na lojinha (ideia do usuário).
- **Trama:** na Garagem, só uma pista no fim do cap. 3 (o Tonhão e o cominho com açafrão). O Bráulio não é citado.
- **Conversas:** balões sobre o salão (o dia parado e escurecido ao fundo), não um painel.
- **Save antigo:** recomeça do dia 1, com aviso, como a v8.6.9 fez com os cursos.
- **1ª vez:** abertura → Missão zero (se ainda não fez) → conversa do cap. 1 → dia 1.
- **Depois do cap. 3:** os dias seguem como hoje, sem objetivo, com um cartão "Continua na próxima versão".

### Capítulos (`HISTORIA` em `10-constantes.js`)
`const HISTORIA = [{ cap, titulo, ponto:'garagem', obj:{...}, objTxt, antes:[falas], depois:[falas] }]`; fala = `{ q:'bia'|'tonhao'|'dani', s:'texto', nota?:'rubrica' }` (a `nota` sai em itálico pequeno, acima do texto, no mesmo balão). `save.cap` (1 a 3; 4 = Garagem completa), `save.capDia` (o dia em que o capítulo começou), `save.capAzul` (dias no azul do cap. 1), `save.conversa` (`'antes'`/`'depois'` pendente, ou null).

**Cap. 1, "A garagem da Rosa"** — objetivo `{ azul:2 }`: fechar 2 dias no azul (lucro do dia > 0; não precisam ser seguidos). Texto: "Fechar 2 dias no azul (x de 2)".
- Antes: Tonhão "Panela no fogo, avental no lugar. Abre o portão, Bia!" / Bia "A garagem da mãe... Ela ia gostar de ver isso cheio de gente." / Tonhão "Então vamos encher! E fechar o dia no azul, que o banco não espera."
- Depois: Bia "Dois dias no azul, tio!" / Tonhão "Isso! Agora é aguentar a parcela todo dia."

**Cap. 2, "A Dani chega"** — ao começar, a Dani entra na equipe no nível 1 (aprendiz). Objetivo `{ nota:2.4 }`: nota geral do Gurugol (`avalGeral(save.aval)`) de 2,4 ou mais no fim de um dia. Texto: "Nota do Gurugol 2,4 (agora x,x)".
- Antes: Bia "Não dou conta da mesa e da pia ao mesmo tempo..." / Tonhão "Pedi ajuda pra Dani, filha da vizinha. Ela vem aprender com a gente." / Dani "Sou meio lenta ainda, mas aprendo rápido!"
- Depois: Dani "Ouvi um freguês dizer que aqui é tudo limpinho!" / Bia "O Gurugol subiu, tio! Já tá em 2,4." / Tonhão "Devagar e sempre."
  (as falas de depois foram aprovadas para "3 dias no azul"; o objetivo escolhido virou a nota, e só o texto delas foi trocado para combinar)

**Cap. 3, "Casa cheia"** — objetivo `{ quitar:true, nota:2.7, caixa:800 }`, tudo ao mesmo tempo no fim de um dia: sem dívida no banco (`save.emp.resto === 0`), nota geral 2,7 e R$ 800 no caixa. Texto: "Quitar a reforma (faltam R$ x) · nota 2,7 (agora x,x) · R$ 800 no caixa (agora R$ x)", cada item com ✓ quando cumprido.
- Antes: Bia "O Gurugol tá cheio de comentário sobre a gente!" / Dani "Tem freguês perguntando se a gente vai abrir num lugar maior." / Tonhão "Primeiro quita a reforma. Depois junta pra mudança."
- Depois: Bia "Reforma quitada e R$ 800 guardados!" / Tonhão (nota: "cheirando o pote de cominho") "Cominho com açafrão... a Rosa ia rir de mim agora." / Bia "Por quê, tio?" / Tonhão "Um dia eu te conto da Casa Aurora."
- Em seguida, o cartão (painel simples, um botão "Seguir jogando"): **"Fim dos capítulos da Garagem. Continua na próxima versão: a área industrial."** `save.cap = 4`; os dias seguem sem objetivo.

### O que muda, parte por parte
- **`10-constantes.js`:** `HISTORIA` (acima) e `REFORMA = { valor:1000, amort:100, juros:0.01, ini:2 }`. `STAFF.dani.levels` vira `[ null, { speed:0.4, tasks:1, pay:0 }, { speed:0.5, tasks:2, pay:25 }, { speed:0.65, tasks:2, pay:40 }, { speed:0.8, tasks:3, pay:55 } ]` (o nível 1 é a aprendiz nova; os níveis 2 a 4 são os antigos 1 a 3, mais baratos). `normEmprestimo` guarda `ini` (sem parcela nem juros antes do dia `ini`) e `ref:true` (é a reforma). Nota do dia 3 (`DAYS[2].note`): tirar "contrate ajuda na lojinha" (fica "O movimento aumentou e agora só há 4 pratos limpos. A executiva..."). `FOLHA_CORTE` perde a Dani (ela não sai da folha; os aumentos dela, sim, podem ser cortados como o do Tonhão: volta ao nível 1).
- **`12-clientes.js` (`normSave`):** campos `cap`, `capDia`, `capAzul`, `conversa`, `histV:1`. Save sem `histV` e com jogo (dia > 1 ou dinheiro diferente do inicial) recomeça do dia 1 guardando só `treino`, e liga `avisoHist` (como o `cardV`/`avisoCard` da v8.6.9). Save novo: `emp` = a reforma (`resto:1000, amort:100, j:0.01, ini:2, ref:true`), `cap:1`, `conversa:'antes'`, `eq.dani:0`.
- **`16-jogo.js`:** `capObj(sv)` devolve `{ ok, itens:[{txt, ok}] }` do capítulo atual; no fim do dia (onde fecha o resultado, perto da linha 785), conta `capAzul`, confere o objetivo e, se cumpriu, marca `sv.conversa = 'depois'` e põe `cap` e `objetivo` no `this.result`. `avancaCap(sv)`: cap+1, `capDia`, `conversa:'antes'`; ao entrar no cap. 2, `eq.dani = Math.max(eq.dani, 1)`. As parcelas e os juros respeitam `emp.ini`. `podeEmprestar` já é um por vez: com a reforma, só o empréstimo à força soma (como hoje).
- **`19-conversa.js` (parte nova):** classe `Conversa(falas, fim)`: uma fala por vez, toque/clique/Enter/espaço passa, "Pular" fica à vista, `fim()` no final. Com `prefers-reduced-motion`, sem animação de entrada.
- **`26-conversa.js` (parte nova):** `drawConversa(g, conv)`: o salão do dia como fundo (o `render` normal, parado), um véu escuro (`rgba(0,0,0,.45)`) e o balão saindo de quem fala (Bia onde ela está; Tonhão na janela da cozinha; Dani onde ela está, ou ao lado da Bia se ainda não entrou). Reaproveitar o balão de fala das cenas da abertura (`25-abertura.js`), com o nome de quem fala e "toque para seguir" pequeno.
- **`02-telas.html`:** sai o painel "Em breve: o Modo História"; entra `#ov-continua` (o cartão do fim do cap. 3); o botão "História" vira **"Ver abertura"**; o rótulo `#menu-dia` passa a dizer "História"; o botão Carreira do seletor do ranking (`data-v="carreira"`) passa a dizer "História"; nova entrada da v8.7 no `#ov-ver`.
- **`18-abertura.js` / `43-telas.js`:** o fim da abertura que tocou sozinha (save novo) segue para a Missão zero (se `!save.treino`) ou para a conversa do cap. 1; vista pelo "Ver abertura", volta ao menu. "Continuar": se `save.conversa === 'antes'`, toca a conversa antes da introdução do dia; a de `'depois'` toca ao fechar a tela de fim do dia, antes da lojinha (e, no cap. 3, depois dela vem o `#ov-continua`). Ao terminar a Missão zero vinda da 1ª vez, segue para a conversa do cap. 1.
- **`40-interface.js`:** rótulo do menu "História · cap. 2, A Dani chega · dia 5" (`save.cap = 4`: "História · Garagem completa · dia 15"; `fechou`: "História: o banco fechou no dia N"); aviso `avisoHist`: "Novidade: a campanha virou o Modo História, com a dívida da reforma da garagem. Por isso, recomeçou do dia 1."; "Como jogar": trocar "Carreira" por "História" e explicar capítulos, objetivo e a reforma em 2 frases.
- **`41-lojinha.js`:** aba Banco, com a reforma, título "Reforma da garagem" e "1ª parcela no fim do dia 2" enquanto `dia < ini`; aba Equipe, a Dani mostra "Aprendiz (sem salário)" e "Aumento: R$ 25/dia" (como o card do Tonhão), sem botão de dispensar; antes do cap. 2, o card da Dani diz "Chega no capítulo 2".
- **`42-resultados.js`:** no fim do dia, uma linha do capítulo: "Capítulo 2, A Dani chega: nota do Gurugol 2,4 (agora 2,3)" ou "✓ Objetivo cumprido!". Na introdução do dia (`22-salao-hud.js` ou onde fica a nota do dia), a mesma linha do objetivo.
- **`30-ranking.js`:** o tipo interno continua `'carreira'` (coleção `ranking-campanha`), só os textos dizem "História".

### Testes
- **`tests/smoke32.js` (novo):** (1) save novo: reforma de R$ 1.000, sem parcela no fim do dia 1, R$ 100 + juros no fim do dia 2; (2) fim da abertura automática vai à Missão zero e depois à conversa do cap. 1 (com `save.treino`, direto à conversa); (3) a conversa passa fala a fala com toque e com "Pular" e grava `conversa:null`; (4) cap. 1 com 1 dia no azul continua, com 2 avança e marca `'depois'`; (5) entrar no cap. 2 põe a Dani no nível 1 com folha R$ 0; (6) cap. 2 não cumprido (nota 2,3) continua; cumprido (2,4) avança; (7) cap. 3 só cumpre com os 3 itens juntos (testar faltando cada um); depois dele, `cap:4`, o `#ov-continua` e o dia seguinte sem objetivo; (8) save da v8.6.13 (sem `histV`) recomeça com aviso e mantém `treino`; (9) a reforma bloqueia empréstimo novo e o atraso de 2 dias fecha a lanchonete; (10) o menu diz "História" e o botão "Ver abertura" toca a abertura e volta ao menu.
- Ajustar os smokes antigos que esperam a Dani nos níveis 1 a 3 com salários de 40 a 60, o "Carreira" no menu, o "Em breve" e o save novo sem dívida (o `harness.js` pode ganhar `load({semReforma:true})` para os testes antigos de banco).
- **`bot.js`/`balance.js`/`carreira.js`:** os níveis da Dani mudaram de índice (o bot paga a Dani "de hoje" = nível 2). O `carreira.js` joga a História e mostra o dia em que cada capítulo foi cumprido (linha `HISTORIA`).
- **Alvos e como decidir:**
  - `node carreira.js 3` (padrão e `MOVEIS=quatro`, `DIAS=20`): **0 dias no negativo** nos dias 1 a 14. Se houver, `REFORMA.ini` passa a 3; se ainda houver, `amort` 80.
  - Cap. 1 cumprido no dia 2 em 3/3; cap. 2 até o dia 5 em ≥ 2/3.
  - Cap. 3: com `MOVEIS=quatro`, até o dia 14 em ≥ 2/3; com o bot padrão, até o dia 20 em ≥ 2/3. Se o padrão não chegar, baixar a nota do cap. 3 para 2,6 (não mexer no caixa nem na quitação, que o usuário escolheu "mais difícil").
  - `node balance.js` com `EQUIPE=auto`: alvo ~85–95% (a Dani mais barata dá ~R$ 15 a 40 por dia). Se passar de 95%, subir as metas dos dias 3 a 7 em 10% (arredondar para 5).
- Capturas: `tests/shot_v8_7.py` em `capturas/v8.7` (menu, conversa do cap. 1 e a do cap. 3 com a rubrica, fim do dia com o objetivo, aba Banco com a reforma, aba Equipe com a aprendiz, `#ov-continua`, celular).

### Fechamento
v8.7: guardar a v8.6.13 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v8.7.md`, `docs/RESUMO.md`, CLAUDE.md (partes novas `19-conversa.js` e `26-conversa.js`, smoke 32, alvos novos do `carreira.js`), PR e merge.

**Fora:** os capítulos dos outros pontos (3a, 3b, 4a), o crítico do Michelzão e o final (etapa 6), desenho novo de objetos (o pote de cominho fica só na rubrica da fala).

**Lojinha:** a 2c-r4b (v8.6.15) reorganiza a lojinha em 4 grupos com cartões antes desta etapa; onde se lê "aba Banco" e "aba Equipe", aplique nos cartões equivalentes (o do banco e o da Dani).

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas mexe em muitas partes ao mesmo tempo, no save e nos smokes antigos, e o balanceamento da dívida pode pedir uma rodada de ajuste.

---

## Etapa 2g — O Tonhão sobe de nível com os cursos (v8.8)
> **Feita em 30/10 (v8.8)**, ver `docs/spec-v8.8.md`. Desvio: as diárias dos níveis 3 a 5 baixaram para 20 / 25 / 30 pela conferência do "Reduzir"; o bot da carreira compra o curso antes dos móveis, com reserva de R$ 150.
> **Planejada com o usuário em 30/10** (texto em `docs/PROPOSTAS.md`), para vir **antes da 3a**. Hoje o nível do Tonhão é só salário: paga o aumento e ele melhora. Passa a ser **experiência (XP)**: cada curso dá XP; com a XP do nível seguinte, ele fica **pronto para subir**, e o aumento de salário **consolida** o nível. Vale para a Garagem e a área industrial; na Avenida Brasil e no Terraço o processo vai ser outro (ver Ideias guardadas).

#### Decisões tomadas (30/10)
- **5 níveis** (eram 3). **XP:** curso básico **+1**, curso avançado **+2** (o "Carnes variadas" do PF conta como avançado, +2; o PF não tem básico). XP máxima: 5 básicos + 6 avançados = **17**.
- **XP para cada nível:** nível 2 com **2**, nível 3 com **5**, nível 4 com **9**, nível 5 com **14**. Os níveis 4 e 5 só chegam com cursos avançados.
- **O aumento consolida:** com a XP, o botão "Aumento" acende; sem ela, fica apagado e diz quanto falta. Pode pagar o aumento no mesmo dia do curso. Sem dinheiro para a folha (chave "cortar" ligada), o Tonhão cai 1 nível como hoje (`folhaCorta`), mas a XP fica: dá para pagar o aumento de novo depois, sem refazer cursos.
- **"Reduzir": sai, se o aumento se paga** (pedido do usuário: o nível pago é definitivo). A sessão confere no `balance.js` (abaixo) que cada nível rende ao menos a diária dele; se algum não render, baixa a diária desse passo de R$ 5 em R$ 5 até render, e então tira o "Reduzir". Assim o nível pago é sempre para sempre (só a falta de dinheiro derruba).
- **Saves antigos são rebaixados à XP:** quem pagou aumento sem ter os cursos volta ao nível que a XP dos cursos já feitos permite (e a diária cai junto). Uma vez só, na leitura do save guardado (`loadSave`), marcada com `tonXp:1`. O `normSave` **não** rebaixa (os testes e bots montam equipes à mão).
- **Modo dev:** o aumento ignora a XP (qualquer nível, como hoje).

#### Os níveis (`STAFF.tonhao.levels`, `10-constantes.js`)
| Nível | XP | Rapidez (`cook`) | Caprichados (`crit`) | Pia (`wash`, s por pilha) | Diária (`pay`) | Faixa do prato no Gurugol (`AVAL.prato`) |
|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 0,05 | não | R$ 0 | 2,5 a 4,5 |
| 2 | 2 | 0,85 | 0,12 | 7 | R$ 15 | 3 a 4,7 |
| 3 | 5 | 0,7 | 0,2 | 4 | R$ 30 | 3,5 a 5 |
| 4 | 9 | 0,62 | 0,26 | 3 | R$ 45 | 3,8 a 5 |
| 5 | 14 | 0,55 | 0,32 | 2,5 | R$ 60 | 4 a 5 |
- `slots` continua 3 em todos (a 4ª boca vem do fogão industrial da 3a). Cada nível ganha o campo `xp`.

#### O que muda, parte por parte
- **`10-constantes.js`:** os 5 níveis acima; `AVAL.prato` com 5 faixas; `CURSO_XP = { basico:1, avancado:2 }`; `tonhaoXp(cursos)` (soma: +1 por curso com `preco > 0` e nível ≥ 1, +2 por nível 2; o PF só conta o avançado); `tonhaoNivelXp(cursos)` (o maior índice de nível cuja `xp` cabe). O comentário do `STAFF.tonhao` explica a regra nova.
- **`12-clientes.js`:** `normSave` aceita `tonhao` de 0 a 4 (`STAFF.tonhao.levels.length - 1`); `loadSave` faz a rebaixa única (`tonXp`).
- **`16-jogo.js`:** `setStaff('tonhao', v)` recusa `v` acima de `tonhaoNivelXp` (fora do modo dev) e, sem o "Reduzir", recusa baixar. `buyCurso`: se o curso deixou o Tonhão pronto para subir, `cursoMsg` ganha **" Ele já pode subir para o nível N: pague o aumento no cartão dele."**
- **`41-lojinha.js` (`buildTonhao`):** título **"Tonhão · nível N de 5"**; uma linha **"Experiência: X de Y para o nível N+1"** com uma barrinha (no nível 5: **"Experiência: X · nível máximo"**). Abaixo, a comparação de hoje (`tRows`). Botão: com XP, **"Aumento: +R$ 15/dia"** (a diferença de diária), aceso se a folha couber; sem XP, apagado, com a frase **"Faltam Z de experiência: cada curso básico dá +1 e cada avançado +2."** Sem o botão "Reduzir" (se a conferência abaixo mandar tirar). Nos cartões de curso (`buildCursos`), ao lado do preço: **"+1 de experiência"** ou **"+2 de experiência"**.
- **`40-interface.js` (Como jogar):** a frase do Tonhão vira **"O Tonhão sobe de nível com experiência: cada curso dá XP e, quando ele estiver pronto, o aumento de salário confirma o nível novo."**
- **`42-resultados.js`:** nada novo (a folha já mostra a diária).
- O resumo do Caixa (`41-lojinha.js:644`) já diz "Tonhão nível N"; conferir que vai até 5.

#### Testes
- **`tests/smoke35.js` (novo; o smoke da 2h é o 36 e o da 3a, o 37):** (1) `tonhaoXp`: nada = 0; pastel e chapa básicos = 2; pastel básico e avançado = 3; PF avançado = 2; tudo = 17; (2) `tonhaoNivelXp` nos limites: 1→nível 1, 2→nível 2, 4→2, 5→3, 9→4, 13→4, 14→5; (3) sem cursos, `setStaff('tonhao',1)` recusa; depois de 2 cursos, aceita e a folha sobe R$ 15; pedir o nível 3 com XP 2 recusa; (4) `buyCurso` que completa a XP põe a frase "já pode subir" no `cursoMsg`; (5) lojinha: título "nível 1 de 5", linha de experiência, botão apagado com "Faltam 2"; com XP, "Aumento: +R$ 15/dia" aceso; sem "Reduzir"; cartão de curso com "+1 de experiência"; (6) folha que não cabe derruba 1 nível e o aumento volta a acender sem curso novo; (7) `loadSave` de um save guardado com `tonhao:2` e 1 curso volta ao nível 1 e grava `tonXp:1`; carregar de novo não mexe; save com `tonhao:2` e 5 de XP fica no 3; (8) nível 5: `cook` 0,55 nos tempos da cozinha e faixa 4 a 5 no `AVAL.prato`; (9) modo dev: aumento sem XP.
- Ajustar os smokes que esperam 3 níveis (`smoke6` no laço `[0,1,2]` está certo; procurar `de 3` e `levels[2]` como "máximo") e os que pagam aumento sem cursos pela lojinha (dar `cursos` no save do teste).
- **`balance.js`:** `FULL` continua `tonhao:2` (os alvos de hoje não mudam). Conferência do "Reduzir": `EQUIPE='{"tonhao":k}' node balance.js 40` para k = 0 a 4 (com `dani:4`), olhando o lucro médio dos dias 3 a 7. **Cada passo (k → k+1) deve render ≥ R$ 15 a mais por dia** em ≥ 4 dos 5 dias. Se render, tira o "Reduzir"; se um passo não render, baixa a diária dele de R$ 5 em R$ 5 (sem passar da diária do nível de baixo + R$ 5) e confere de novo. Anotar a tabela em `docs/spec-v8.8.md`.
- **`carreira.js` e `emprestimo.js`:** o bot não pode mais pôr o Tonhão acima da XP: no `FULL`, o `tonhao` vira `Math.min(tonhao, L.tonhaoNivelXp(g.save.cursos))`, e o `FULL` passa a começar com `tonhao:4` (`{tonhao:4,dani:4,tv,som}`, `{tonhao:3,...}`, depois os de hoje). A linha `HISTORIA` (ou uma linha nova `TONHAO`) mostra o dia médio em que ele chega a cada nível. **Alvos:** nível 2 até o dia 6 e nível 3 até o dia 12, em média (`node carreira.js 3`); os caps. 1 a 3 no mesmo dia da v8.7 ±2; 0 dia no negativo a mais que na v8.7. Se o nível 3 passar do dia 12, `xp` do nível 3 vira 4; não mexer no preço dos cursos.
- Capturas: `tests/shot_v8_8.py` em `capturas/v8.8` (cartão do Tonhão sem XP, pronto para subir, nível 5; cartão de curso com o "+1 de experiência"; celular).

#### Fechamento
v8.8: guardar a v8.7 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v8.8.md` (com a tabela da conferência do "Reduzir"), `docs/RESUMO.md`, CLAUDE.md (smoke 35), PR e merge.

**Fora:** a progressão dos cozinheiros da Avenida Brasil e do Terraço (Ideias guardadas); cursos novos.

**Modelo:** Sonnet, esforço médio. Tudo decidido; a única conta é a conferência do "Reduzir" no `balance.js`, com a regra escrita acima.

---

## Etapa 2h — A Dani sobe de nível com trabalho e cursos (v8.9)
> **Feita em 30/10 (v8.9)**, ver `docs/spec-v8.9.md`. Desvios: `DANI_XP.tarefas` ficou 5 (a calibração pelo bot); as diárias baixaram para 15 / 20 / 25 pela conferência do "Reduzir"; a numeração das mensagens segue o título do cartão (o 1º aumento é "para o nível 1"); o smoke da Dani é o `smoke37` (o 36 foi tomado pela v8.8.1, "Pular tutorial"), então o smoke da 3a passa a ser o 38.
> **Planejada com o usuário em 30/10** (texto em `docs/PROPOSTAS.md`), depois da 2g e **antes da 3a**. Mesma ideia do Tonhão: a experiência (XP) deixa a Dani **pronta para subir**, e o aumento de salário **consolida** o nível. A XP dela vem **de dois jeitos**: do trabalho (ela aprende fazendo) e de cursos dela na lojinha. Depende da 2g (v8.8): reaproveita a regra do aumento, a barrinha de experiência e a conferência do "Reduzir".

#### Decisões tomadas (30/10)
- **Os 4 níveis de hoje** (aprendiz, 2, 3 e 4), com a velocidade, as tarefas e as diárias de hoje (`STAFF.dani.levels`: R$ 0, 25, 40, 55). Muda só o jeito de subir. Cada nível ganha o campo `xp`: **aprendiz 0, nível 2 com 4, nível 3 com 8, nível 4 com 13**.
- **XP do trabalho:** cada tarefa que ela termina conta 1 (`save.daniTar`, o total da carreira): lixo esvaziado, viagem de pratos sujos, pilha lavada, cafezinho servido, água/suco da espera levado, marmita levada ao balcão. **A cada `DANI_XP.tarefas` tarefas, +1 XP** (valor inicial **30**; ver Testes). Só o dia completo conta (regra da v8.2.2): as tarefas do dia entram no save no fim do dia, junto com a folha.
- **XP dos cursos:** 3 cursos dela, **+2 XP cada** (6 no total, então o nível 4 sempre pede trabalho). Só dão XP, sem outro efeito por enquanto:
  - **Atendimento ao cliente** — R$ 120
  - **Organização da cozinha** — R$ 150
  - **Barista iniciante** — R$ 180 (a semente da Dani barista; ver Ideias guardadas)
  
  Um curso da Dani por lojinha, com a trava própria (`save.daniCursoDia`), à parte da do Tonhão: no mesmo dia dá para fazer um curso de cada um. Os cursos só aparecem depois que ela chega (cap. 2; no modo dev, sempre).
- **Igual ao Tonhão (2g):** o aumento acende com a XP e pode ser pago no mesmo dia; sem dinheiro para a folha ela cai 1 nível (nunca abaixo de aprendiz) e a XP fica; o **"Reduzir" sai** se a conferência abaixo mostrar que cada nível rende a diária dele (senão, baixa a diária desse passo de R$ 5 em R$ 5 até render); saves antigos são **rebaixados ao nível da XP** (os cursos não existiam, então a XP de um save antigo é 0 e ela volta a aprendiz), uma vez só no `loadSave`, marcada com `daniXp:1`; o `normSave` não rebaixa; modo dev ignora a XP.

#### O que muda, parte por parte
- **`10-constantes.js`:** `xp` em cada nível de `STAFF.dani.levels`; `DANI_XP = { tarefas:30, curso:2 }`; `DANI_CURSOS = [{ id:'atend', nome:'Atendimento ao cliente', preco:120 }, { id:'cozinha', nome:'Organização da cozinha', preco:150 }, { id:'barista', nome:'Barista iniciante', preco:180 }]`; `daniXp(save)` (= 2 × cursos feitos + `floor(daniTar / DANI_XP.tarefas)`) e `daniNivelXp(save)` (o maior nível cuja `xp` cabe, no mínimo 1 quando ela já chegou).
- **`12-clientes.js`:** `normSave` com `daniTar` (inteiro ≥ 0), `daniCursos` (`{ id:1 }`) e `daniCursoDia`; `loadSave` com a rebaixa única (`daniXp`).
- **`15-dani.js`:** `this.feitas` (zera no `reset` do dia) +1 onde cada tarefa termina (as 6 acima; uma pilha lavada conta 1, uma viagem de pratos conta 1 mesmo com 2 pilhas).
- **`16-jogo.js`:** no fim do dia completo, `save.daniTar += dani.feitas`; `setStaff('dani', v)` recusa acima de `daniNivelXp` (fora do modo dev) e, sem o "Reduzir", recusa baixar (contratar a aprendiz continua livre, de graça, no cap. 2); `buyDaniCurso(id)` (desconta, `caixaGasto(..., 'mel', ...)`, grava a trava; mensagem **"A Dani foi fazer o curso de X!"** e, se ficou pronta, **" Ela já pode subir para o nível N: pague o aumento no cartão dela."**).
- **`41-lojinha.js` (`buildDani`):** título como hoje ("Dani · aprendiz (sem salário)" / "nível N de 3"); a linha **"Experiência: X de Y para o nível N"** com a barrinha da 2g e, embaixo, em letra menor, **"Trabalho: Z tarefas até o próximo ponto"**; botão **"Aumento: +R$ 15/dia"** aceso com XP, ou apagado com **"Faltam Z de experiência: ela aprende trabalhando e com os cursos (+2 cada)."**; sem "Reduzir" (se a conferência mandar). Logo abaixo do cartão dela, os 3 cartões de curso da Dani (no estilo dos do Tonhão, com **"+2 de experiência"**; feito: **"Curso feito"**; trava: **"A Dani já está num curso. Volte depois do próximo dia."**).
- **`42-resultados.js` (fim do dia):** com a Dani na equipe, uma linha **"Dani: N tarefas hoje · experiência X"**; se ficou pronta, **"A Dani já pode subir para o nível N!"**.
- **`40-interface.js` (Como jogar):** **"A Dani aprende trabalhando: cada tarefa conta, e os cursos dela ajudam. Quando estiver pronta, o aumento confirma o nível novo."**

#### Testes
- **`tests/smoke36.js` (novo; o smoke da 3a passa a ser o 37):** (1) `daniXp`: nada = 0; 29 tarefas = 0; 30 = 1; 1 curso + 60 tarefas = 4; (2) `daniNivelXp`: 3→1, 4→2, 8→3, 12→3, 13→4; (3) aumento recusado sem XP, aceito com XP, a folha sobe a diferença; (4) um dia completo com a Dani lavando soma as tarefas em `daniTar`; dia interrompido não soma; (5) curso: desconta, +2 XP, trava do dia (um da Dani e um do Tonhão no mesmo dia, sim; dois da Dani, não); antes do cap. 2 os cursos não aparecem; (6) lojinha: linha de experiência, "Faltam", "+2 de experiência", sem "Reduzir"; (7) fim do dia com a linha da Dani e o "já pode subir"; (8) folha que não cabe derruba 1 nível (não abaixo de aprendiz) e a XP fica; (9) `loadSave` de save antigo com `dani:4` volta a aprendiz e grava `daniXp:1`; (10) modo dev: aumento sem XP.
- Ajustar os smokes que pagam aumento da Dani pela lojinha sem XP (dar `daniTar` ou `daniCursos` no save do teste).
- **Calibrar `DANI_XP.tarefas`:** `node carreira.js 3` com uma linha nova **`DANI`** (tarefas por dia em média, por nível, e o dia médio em que ela chega a cada nível). Escolher o número redondo (de 5 em 5) que dê **1 XP a cada ~1,5 dia** trabalhado como aprendiz. Alvos, com o bot fazendo os cursos dela quando sobra o preço + a reserva de R$ 300: **nível 2 até o dia 7, nível 3 até o dia 11, nível 4 até o dia 16**. Se o nível 4 passar do dia 16, `xp` do nível 4 vira 12; não mexer no preço dos cursos.
- **Conferência do "Reduzir":** como na 2g, `EQUIPE='{"tonhao":2,"dani":k}' node balance.js 40` para k = 1 a 4, lucro médio dos dias 3 a 7: cada passo deve render a diferença de diária (R$ 25, 15, 15) em ≥ 4 dos 5 dias. Tabela em `docs/spec-v8.9.md`.
- **`carreira.js` e `emprestimo.js`:** o `dani` do `FULL` vira `Math.min(dani, L.daniNivelXp(g.save))` (como o Tonhão na 2g); o bot compra os cursos da Dani (na ordem acima) depois do curso do Tonhão do dia. Os caps. 1 a 3 no mesmo dia da v8.8 ±2; nenhum dia no negativo a mais.
- Capturas: `tests/shot_v8_9.py` em `capturas/v8.9` (cartão da Dani aprendiz com a barrinha, pronta para subir, cursos dela, linha do fim do dia, celular).

#### Fechamento
v8.9: guardar a v8.8 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v8.9.md`, `docs/RESUMO.md`, CLAUDE.md (smoke 36, linha `DANI` do `carreira.js`), PR e merge.

**Fora:** a Dani barista/confeiteira, o Joca e o funcionário novo (Ideias guardadas).

**Modelo:** Sonnet, esforço médio. Tudo decidido; a calibração de `DANI_XP.tarefas` e a conferência do "Reduzir" têm regra escrita.

---

## Etapa 2c-r5 — Ajustes da lojinha: TV e som em Melhorias, toalha no Salão, cartões da equipe e da Manutenção (v8.9.1)
> **Planejada em 30/10** (pedido do usuário, texto em `docs/PROPOSTAS.md`), **antes da 3a**. Só a lojinha (`src/41-lojinha.js`, `src/01-estilo.css`) e os testes; nenhuma regra de jogo muda, nem o balanceamento (não precisa de `balance.js`).

#### Decisões tomadas (30/10)
1. **TV e som vão para Melhorias** (Lanchonete › Melhorias). O **couvert artístico fica na Divulgação**, como hoje (o pedido foi só TV e som).
2. **Toalha xadrez sai da Decoração e vai para o Salão.** A Decoração fica com os 6 enfeites. No Salão, a toalha "em todas as mesas" entra no painel da direita (`.ed-side`), logo abaixo do botão "Mesa de 4". A toalha mesa a mesa, no balãozinho da mesa, continua como está.
3. **Cartões do grupo Equipe:** hoje os desenhos da Bia (boné e pés) e da Dani (cabelo) saem cortados no ícone. Cada figura passa a caber inteira no ícone, com folga.
4. **Tonhão de corpo inteiro com a touca de cozinheiro**, como a Bia e a Dani (hoje o ícone é um fogão com a touca por cima e fica estranho). Usar o desenho da abertura, `abTonhao` (`src/25-abertura.js:78`), que já tem a touca. O mesmo ícone vale no cartão do Tonhão dentro da seção (`buildTonhao`).
5. **O cartão Manutenção muda de cor** conforme o pior equipamento, com as mesmas faixas das barras (`MANUT.verde` 0,7 e `MANUT.vermelho` 0,4):
   - algum equipamento **abaixo de 0,4**: cartão **vermelho** (classe `perigo`);
   - senão, algum **abaixo de 0,7**: cartão **amarelo** (classe `alerta`);
   - senão, a cor normal.
   Vale em qualquer dia (as barras também já mudam de cor antes do `MANUT.dia`). O texto do cartão não muda; para leitores de tela, `aria-label` = "Manutenção: precisa de revisão" (amarelo) ou "Manutenção: risco de quebra" (vermelho).

#### O que muda, parte por parte (`src/41-lojinha.js`, salvo onde diz)
- **TV e som:** dividir `buildAmbiente` em duas funções:
  - `buildTvSom(grid)`: o cartão "TV e som" com os 2 botões (o trecho de hoje, sem mudar textos);
  - `buildCouvert(grid)`: o "Couvert artístico" (com o `if (!couvertOk(game.ponto)) return;`).
  `buildMelhorias` vira `function buildMelhorias(grid){ upgradeCartoes(grid, false); buildTvSom(grid); }`. Em `buildDivulga`, trocar `buildAmbiente(grid)` por `buildCouvert(grid)`. Apagar as variáveis que sobrarem sem uso (`T`, `D`, `pc`, `sec`...). Atualizar o comentário do topo (`/* TV e som (Melhorias, v8.9.1) e o couvert (Divulgação) */`).
- **Toalha:** em `buildDecor`, apagar o bloco do cartão da toalha (das linhas `const todas = ...` até o `grid.appendChild(c)` do fim) e tirar "E a toalha xadrez..." do comentário. Em `buildSalao`, logo depois do `side.appendChild(edBtn('Mesa de 4: ...'))`, acrescentar:
  ```js
  // v8.9.1: a toalha xadrez em todas as mesas (antes na Decoração); mesa a mesa, no balãozinho
  const todas = mesas.concat(est), sem = game.semToalha.length, vt = sem * TOALHA.cost;
  side.appendChild(edBtn(!sem ? 'Toalha xadrez: todas têm' : 'Toalha xadrez em ' + (sem > 1 ? 'todas (' + sem + ')' : '1 mesa') + ': ' + fmt(vt), 'btn', sem > 0 && bank >= vt, () => game.buyToalhas(), vt));
  ```
  e, no texto de `ed-contas` de baixo (depois da linha do movimento), mais uma linha `ed-contas`: **"Toalha xadrez: " + fmt(TOALHA.cost) + " por mesa; melhora o ambiente no Gurugol para quem senta nela. " + (todas.length − sem) + " de " + todas.length + " mesas têm."** (singular "mesa tem" com 1, como hoje). Conferir que `edBtn` aceita o 5º argumento `cost` (aceita: mesma assinatura do `shopBtn`).
- **Ícones da equipe (`upgradeIcon`):** o ícone é um canvas de 64×64 com `translate(32,32); scale(1.5,1.5)`, ou seja, cabe de −21 a +21 em cada eixo. Para `bia`, `dani` e `tonhao`, desfazer a escala no começo do ramo (`c.scale(1/1.5,1/1.5)`, então cabe de −32 a +32) e desenhar a figura inteira com **pelo menos 2 px de folga** em cima e embaixo (do alto do boné/cabelo/touca ao pé, incluindo a sombra). Valores de partida, a ajustar pela captura:
  - `bia`: `drawBia(c,{},0,27,{ s:0.62 })`;
  - `dani`: `drawPerson(c,DANI_LOOK,0,27,{ shirt:'#F7EFD8', mood:0, s:0.62 })` e o avental roxo redesenhado na mesma escala (hoje está em coordenadas da escala antiga: multiplicar as coordenadas por 1,5 × 0,62/0,75 ≈ 1,24, ou redesenhar conferindo na captura);
  - `tonhao`: `abTonhao(c,0,27,0.5,{ t:0 })` (o ramo de hoje, com fogão e `ctx2chef`, sai; se `ctx2chef` ficar sem uso, apagar de `src/21-cenario.js:522`).
  Regra para fechar os números: aumentar `y` ou baixar `s` até a figura caber com a folga; entre os que cabem, a figura maior. As três devem ficar com altura parecida (a Dani pode ser um pouco menor que a Bia, como no jogo; o Tonhão, um pouco maior). Se `abTonhao` depender de algo da abertura que quebre fora dela (erro no console), passe as opções que faltarem (`g:1`, `mood:0`) em vez de mexer na abertura.
- **Cartão da Manutenção:** em `shopCartoes`, depois de criar o botão, quando `id === 'manut'`:
  ```js
  const pior = Math.min.apply(null, MANUT.equip.map(q => game.manut[q.id]));
  if (pior < MANUT.vermelho){ b.classList.add('perigo'); b.setAttribute('aria-label', 'Manutenção: risco de quebra'); }
  else if (pior < MANUT.verde){ b.classList.add('alerta'); b.setAttribute('aria-label', 'Manutenção: precisa de revisão'); }
  ```
- **`src/01-estilo.css`** (logo depois da linha `.shopcards canvas{...}`):
  ```css
  .shopcards button.alerta{background:#FBE7B0;border-color:#C98A12}   /* v8.9.1: Manutenção com equipamento no amarelo */
  .shopcards button.perigo{background:#F6C9C3;border-color:var(--perigo);color:#7A1D16}   /* e no vermelho */
  ```

#### Testes
- **`tests/smoke33.js`:** a linha `'Divulgação tem a TV e som'` vira duas: Melhorias tem "TV e som" e "Ventilador de teto"; Divulgação **não** tem "TV e som" e tem "Contas do dia". Acrescentar: (a) com `g.manut` todo em 1, o cartão `manut` (no grupo Lanchonete) não tem `alerta` nem `perigo`; com um equipamento em 0,6, tem `alerta`; com um em 0,3, tem `perigo` (e o `aria-label` certo). Ver como o smoke lê as classes dos botões no `harness.js` (os elementos falsos têm `classList`); se não der, conferir o `className`.
- **`tests/smoke30.js`:** a Decoração passa a ter **6 cartões** (era 7: tirar o teste do `nome(6)==='Toalha xadrez'`); acrescentar que no Salão o painel tem um botão com "Toalha xadrez em todas" e que clicar nele chama a compra (ou só conferir o texto e usar `g.buyToalhas()` como já faz a linha 39).
- `tests/run_all.sh --tudo` verde (o `menu_fit` não muda; o `balance` deve dar o mesmo da v8.9).
- **Capturas:** `tests/shot_v8_9_1.py` em `capturas/v8.9.1`, no modelo do `shot_v8_6_15.py` (tela larga 1220×600 e celular deitado 740×360): grupo Equipe (Bia, Tonhão e Dani inteiros), seção Tonhão (ícone do cartão), grupo Lanchonete com a Manutenção normal, amarela (`g.manut.fogao=0.6`) e vermelha (`0.3`), Melhorias rolada até a TV e som, Salão com o botão da toalha, Decoração com 6 cartões. Conferir recortes ampliados (PIL `crop`) dos ícones da equipe: nada cortado.

#### Fechamento
v8.9.1: guardar a v8.9 em `versoes/` (`v8.9-fonte.html` e `v8.9.html`), `vtag`, `VERSAO`, lista do `#ov-ver`, `docs/spec-v8.9.1.md` (curto), `docs/RESUMO.md`, marcar a etapa como feita na tabela da Situação, PR para o `claude/main` e merge. Não publicar no artifact sem o usuário pedir.

**Modelo:** Sonnet, esforço médio. Tudo decidido; só os números dos ícones são por tentativa, com a regra escrita acima.

---

## Etapa 2c-r6 — Cardápio fácil de achar: cartão Cardápio, conversa do dia 2, selo "novo" e reclamação dos clientes (v9.0.1)
Origem: retorno de uma beta-tester (30/10, `docs/PROPOSTAS.md`): não ficou claro que os cursos do Tonhão aumentam o cardápio; ela procurou uma opção de "melhorar o cardápio" e não achou (hoje os cursos ficam em Lojinha › Equipe › Tonhão, abaixo do nível dele). Planejada com o usuário em 30/10 (entrevista); as decisões abaixo estão tomadas. Nada muda no balanceamento: os cursos continuam abertos desde o dia 1, com os mesmos preços, a mesma regra de 1 curso por dia e a mesma XP.

### Decisões tomadas (30/10)
- **Cartão Cardápio:** os cursos do Tonhão saem da seção Tonhão e vão para uma seção nova, **Cardápio**, que é o 1º cartão do grupo Lanchonete. Na seção Tonhão fica só a lista dos "Cursos de cardápio concluídos".
- **Cursos da Dani:** ficam na Dani por ora (eles não trazem pratos). O Cardápio fica pronto para receber as bebidas da Dani numa etapa futura (ver Ideias guardadas).
- **Sem trava:** quem já sabe compra no dia 1. A conversa e o selo só chamam a atenção.
- **Conversa no fim do dia 2** (só no Modo História), com a Rosa; se a pessoa já fez algum curso, toca a versão curta. Depois das duas versões, a lojinha abre direto no Cardápio.
- **Selo "novo"** no cartão Cardápio quando houver curso ao alcance do caixa (some ao abrir o cartão e volta quando outro curso couber no bolso).
- **Reclamação dos clientes:** enquanto o Tonhão não fez nenhum curso básico, a reclamação de cardápio no Gurugol cita os pratos.
- **Fica de fora:** dica embaixo da nota do Gurugol e aviso no resumo do fim do dia (o usuário não escolheu).
- **Balão embaixo do Pular** (outro retorno de 30/10): a fala do Tonhão sai da janela da cozinha, no canto de cima à direita, e o balão fica embaixo do botão Pular (conferido em 30/10 na tela larga, 1220×600 e 1600×800, e no celular deitado, 740×360; no celular em pé o botão fica acima do canvas e não cobre). O botão continua onde está (o mesmo lugar do Pular da abertura); quem desvia é o balão.

### O que muda, parte por parte
**`src/10-constantes.js`**
- Depois de `HISTORIA`, a conversa avulsa do cardápio (fala no formato das de `HISTORIA`):
  ```js
  /* v9.0.1: a conversa do cardápio, no fim do dia `dia` (ou do 1º dia completo depois dele, para saves antigos), só no Modo História.
     falas: o Tonhão ainda não fez curso; fez: já fez algum (básico de qualquer curso ou o avançado do PF). save.convCard: 'pend' | 1 (vista) */
  const HIST_CARDAPIO = { dia:2,
    falas:[ { q:'bia', s:'Tio, hoje um monte de gente perguntou se só tem PF e coxinha...' },
            { q:'tonhao', s:'É... a Rosa fazia um pastel que era uma beleza. Eu nunca aprendi.' },
            { q:'bia', s:'Então faz um curso! Tem uns baratinhos.' },
            { q:'tonhao', s:'Tá bom, tá bom. Vê aí no Cardápio da lojinha o que cabe no bolso.' } ],
    fez:[ { q:'bia', s:'O pessoal adorou o prato novo!' },
          { q:'tonhao', s:'Então vou fazer mais cursos. Tá tudo no Cardápio da lojinha.' } ] };
  ```
- `function cursoFeito(cursos)`: true se algum curso tem o básico (`c.preco > 0 && cursoNivel(cursos, c.id) >= 1`) ou se o PF tem o avançado (`cursoNivel(cursos, 'pf') >= 2`).
- Junto de `AVAL_BRAVO`: `const AVAL_POUCO = ['Só tem PF e coxinha?', 'Queria um pastel, mas não tem...', 'Sempre a mesma coisa no cardápio.'];`
- `avalComentario(..., tipo, pouco)`: novo último parâmetro. Logo depois da linha do `semVeg` (que continua com prioridade): `if (!bom && pouco){ const m = índice de 'menu'; if (r[m] != null && r[m] <= r[k]) return pick(AVAL_POUCO); }` (a mesma regra do `semVeg`: só quando o Cardápio é o pior critério).

**`src/16-jogo.js`**
- Na chamada de `avalComentario` (~linha 721), passe `pouco = !CURSOS.some(c => c.preco > 0 && cursoNivel(this.save.cursos, c.id) >= 1)` (só os básicos; o avançado do PF não conta, porque não traz prato novo).
- No fim do dia, logo depois do bloco do Modo História (~linha 858–871): `if (!tomou && HIST.on && !DEV.on && sv.histV === 1 && d.n >= HIST_CARDAPIO.dia && !sv.convCard) sv.convCard = 'pend';` (saves antigos que já passaram do dia 2 veem a conversa no próximo fim de dia, de propósito: é o caso da beta-tester).
- Getter `get cardapioNovo()`: a lista das chaves `id + nível` (ex.: `'pastel1'`, `'pf2'`) dos cursos com `cursoProx(id)`, com `!this.cursoTrava` e `this.save.bank >= p.preco`, que **não** estão em `this.save.cardVisto`; o selo acende se a lista não estiver vazia. `cardVer()`: junta essas chaves em `save.cardVisto` e grava o save.
- `save.convCard` e `save.cardVisto` entram na normalização do save (`12-clientes.js`, onde está o `normCursos`): `convCard` vale `'pend'`, `1` ou nada; `cardVisto` é uma lista de textos (padrão `[]`). O `resetProgress` zera os dois.

**`src/41-lojinha.js`**
- `SHOP_SECOES.cardapio = { nome:'Cardápio', icon:'cardapio', build:g => buildCardapio(g) }` e `SHOP_GRUPOS` Lanchonete: `['cardapio', 'melhorias', 'salao', 'decor', 'manut', 'divulga']`. `SHOP_ANTIGAS.cursos` passa a `'cardapio'`.
- Ícone `'cardapio'` no `upgradeIcon`: um pastel e uma coxinha lado a lado com `drawDish` (como o `cursoIcon`).
- `shopCartoes`: no cartão `cardapio`, se `game.cardapioNovo` acender, classe `novo` e `aria-label` "Cardápio: tem curso novo que cabe no caixa". Ao tocar no cartão, chame `game.cardVer()` antes do `buildShop()`. Na fileira de grupos, o grupo Lanchonete leva a mesma classe `novo` quando outro grupo está aberto e o selo está aceso.
- `buildCardapio(grid)`: (1) um `staffCard` com o ícone `cardapio`, título "No cardápio hoje (N pratos)" e o texto com `pratosSabidos(cursos)` e os preços (`precoPrato(k, game.ponto, cursos)`, separados por " · "), mais a linha "Diversidade do cardápio no Gurugol: x,x ★ (cada curso básico dá +0,6)" (`avalMenu`, uma casa, vírgula); (2) o `buildCursos(grid)` de hoje, sem mudar; (3) no fim, `el('span', 'cursos-lista', 'Cada curso também dá experiência ao Tonhão (Equipe › Tonhão).')`.
- `buildTonhao`: troque `buildCursos(grid)` por `buildCursosFeitos(grid)`, um `staffCard` com o ícone `cardapio` e o título "Cursos de cardápio concluídos". Para cada curso feito, uma linha: "Curso de X (básico)" e, com o avançado, "c.av.nome (avançado)"; o PF só aparece com o avançado. Sem nenhum: "Nenhum ainda. Os cursos ficam no Cardápio da lojinha." Sempre com o botão "Ver cursos", que chama `shopAbrir('cardapio')`. A frase do "Faltam N de experiência" ganha no fim " Os cursos ficam no Cardápio."

**`src/01-estilo.css`**
- `.shopcards button.novo` e a aba do grupo com `.novo`: selo amarelo "novo" (pílula pequena no canto de cima à direita, `::after` com `content:'novo'`), parado (sem animação, o que já respeita o `prefers-reduced-motion`). Os 6 cartões do grupo Lanchonete devem caber como os 5 de hoje (2 colunas no celular).

**`src/43-telas.js`**
- Variável `let shopEntra = null;` e, na troca para a tela `shop` (linha ~34): `shopGrupo = 'lanchonete'; shopTab = shopEntra; shopEntra = null;`.
- `fluxoHistoria(fim)`: depois das conversas de capítulo (`depois` e `antes`, que continuam primeiro), e antes do `fim()`: se `sv.convCard === 'pend'`, toca `HIST_CARDAPIO.fez` se `cursoFeito(sv.cursos)`, senão `HIST_CARDAPIO.falas`; ao terminar (ou ao pular): `sv.convCard = 1`, `writeSave`, `shopEntra = 'cardapio'` e `fim()`. A conversa usa o mesmo `Conversa`/`ov-conversa` de hoje (o `falar` recebe a lista de falas; se hoje ele só aceita `'antes'`/`'depois'`, acrescente um jeito de passar as falas direto).

**Balão que desvia do Pular (`src/43-telas.js` e `src/26-conversa.js`)**
- `43-telas.js`: `function convEvita()` devolve o retângulo do `#btn-conv-pular` em coordenadas do canvas, com 8 de folga em volta: pega o `getBoundingClientRect()` do botão e o do `canvas`, e converte como o `toLogical` (x por `TW / largura`, y por `H / altura`). Devolve `null` se o botão não tiver tamanho (testes no node) ou se ficar fora do canvas (celular em pé). No laço, logo antes do `drawConversa` (linha ~253), `game.conversa.evita = convEvita();` (medir a cada quadro acompanha a troca de tamanho da tela).
- `26-conversa.js`, `drawConversa`: depois de calcular `x`, `y`, `w` e `h` do balão, se `conv.evita` cruzar o balão, empurre o balão para a esquerda: `x = Math.max(16, ev.x - w)`. Se mesmo assim ainda cruzar (tela estreita), desça o balão: `y = ev.y + ev.h`. O `bx` (a ponta) é recalculado depois disso, como hoje (ela continua apontando para a cabeça de quem fala). As falas da Bia e da Dani não mudam quando o balão já não cruza o botão.
- Confira também, nas capturas, as cenas da abertura com balão perto do Pular dela (`#ov-abertura`); se alguma cruzar, use o mesmo `convEvita` com o botão da abertura.

**Textos que apontam para o lugar antigo dos cursos**
- `src/40-interface.js` (Como jogar, ~linha 187): "Na aba Cursos, o Tonhão aprende..." vira "No Cardápio da lojinha, o Tonhão aprende...". Procure outros "aba Cursos" e "cursos do Tonhão na lojinha" em `src/` (menos a lista do painel `#ov-ver`, que é histórico) e aponte para o Cardápio.

### Testes
- **`smoke39.js` (novo):**
  1. Lojinha, grupo Lanchonete: o 1º cartão é `data-sec="cardapio"`. Ao abrir, aparecem "No cardápio hoje (2 pratos)" e os cursos ("Comprar R$ 150" no Pastel de feira). A seção Tonhão não tem botão de comprar curso, mostra "Cursos de cardápio concluídos" e "Nenhum ainda", e "Ver cursos" abre o Cardápio (`shopTab === 'cardapio'`).
  2. Selo: com R$ 200 no caixa, o cartão tem a classe `novo`; depois de abrir e voltar, não tem; com o caixa em R$ 300 (o curso de Salgados fritos, R$ 220, passa a caber), volta. Com R$ 100, não aparece. No dia em que o curso já foi comprado (`cursoTrava`), não aparece.
  3. Conversa: com `load({historia:true})`, ao fechar o dia 2, `save.convCard === 'pend'`. O fluxo toca a conversa, com a 1ª fala "Tio, hoje um monte de gente perguntou se só tem PF e coxinha...". No fim, `convCard === 1` e a lojinha abre com `shopTab === 'cardapio'`. Com `cursos:{pastel:1}`, a 1ª fala é "O pessoal adorou o prato novo!". Sem a História (`load()` padrão), `convCard` nunca fica `'pend'`. Fechar o dia 3 depois não toca de novo.
  4. Balão e Pular: com `game.conversa.evita = {x:TW-150, y:0, w:150, h:80}` e a 1ª fala do cap. 1 (do Tonhão), o retângulo desenhado do balão não cruza o `evita` (exponha o retângulo calculado em `conv.caixa = {x, y, w, h}` no `drawConversa` para o teste conferir); com `evita` nulo, o balão fica onde fica hoje.
  5. Comentário: `avalComentario` com o Cardápio como pior critério, `bom` falso e `pouco` verdadeiro sai de `AVAL_POUCO`; com `pouco` falso sai de "Pouca opção no cardápio." / "Queria mais pratos."; com `semVeg` verdadeiro continua "Não tinha nada vegetariano.".
- **Testes que compravam curso pela seção Tonhão** (veja `smoke15`, `smoke26`, `smoke33`, `smoke35`, `shot_v8_3.py` e `shot_v8_6_15.py`; procure `'tonhao'`, `'cursos'` e "Comprar" perto de curso): passe a abrir `'cardapio'`. Não mude o que eles conferem.
- **`carreira.js`:** a linha 74 fecha as conversas de capítulo entre os dias; feche também a do cardápio (`if (g.save.convCard === 'pend') g.save.convCard = 1;`). Os números do `carreira.js` e do `balance.js` não podem mudar (nada no jogo mudou de valor): rode os dois e compare com a v9 (`docs/spec-v9.md`).
- `./run_all.sh --tudo` verde (o `menu_fit` confere a lojinha com o 6º cartão).
- Captura `shot_v9_0_1.py` em `capturas/v9.0.1`: grupo Lanchonete com o selo, seção Cardápio, seção Tonhão (sem curso e com 2 cursos feitos) e o balão da 1ª fala da conversa do cardápio e a 1ª fala do cap. 1 (Tonhão, conferindo que o Pular não cobre o balão), em 1220×600, 1600×800, no celular deitado (740×360) e em pé (390×844). Confira com recortes ampliados (PIL `crop`) do cartão com o selo e do topo da seção Cardápio.

### Fechamento
- Versão **v9.0.1**: guarde a v9 em `versoes/v9-fonte.html` e `versoes/v9.html`, atualize o `vtag`, a `VERSAO` e o painel `#ov-ver` ("v9.0.1 — 30/10/2026 — Ficou mais fácil achar os cursos do Tonhão: eles moram no cartão Cardápio, o primeiro da lojinha, com um selo "novo" quando algum cabe no caixa. No fim do dia 2 do Modo História, a Bia avisa que a freguesia quer mais opções, e quem ainda só tem PF e coxinha ouve isso no Gurugol. E o balão do Tonhão nas conversas não fica mais embaixo do botão Pular."). Escreva `docs/spec-v9.0.1.md`, atualize `docs/RESUMO.md`, `docs/PARTES.md` (seção Cardápio nova, `HIST_CARDAPIO`, `AVAL_POUCO`) e esta tabela, e marque o destino do retorno em `docs/PROPOSTAS.md`. PR para o `claude/main` com merge; avise que está pronta para publicar (não publique sem o usuário pedir).

Modelo: Sonnet, esforço médio (o plano está fechado; o trabalho é mudar a lojinha, uma conversa, o balão e um comentário, ajustar testes antigos e checar a tela).

### Sessão 3a — Mudança de ponto e Lanchonete na área industrial (v9) — FEITA em 30/10 (`docs/spec-v9.md`; cardápio ×1,5 e `grupos` 0,8 calibrados em vez de ×1,2; o smoke é o `smoke38`)
> **Planejada com o usuário em 30/10** (respostas em `docs/PROPOSTAS.md`): as decisões abaixo estão tomadas. Depende da 2f (v8.7): `HISTORIA`, `Conversa`, `capObj`, `#ov-continua`, a reforma e a Dani aprendiz. **O Joca saiu desta etapa:** entra na 3b (Avenida Brasil), contratado com salário.

#### Decisões tomadas (30/10)
- **A mudança é para sempre:** não dá para voltar à Garagem.
- **Quando aparece:** depois do cap. 3 (`save.cap >= 4`), o cartão **"Mudança"** entra na lojinha (no grupo do banco/contas da 2c-r4b). Para mudar: R$ 800 no caixa **e** nota do Gurugol ≥ `avalMinimo(garagem)` (2,7) no dia. Sem um dos dois, o cartão mostra o que falta ("Falta R$ x" / "Nota 2,7 (agora x,x)") e o botão fica apagado. O cartão `#ov-continua` do fim do cap. 3 muda de texto: **"Fim dos capítulos da Garagem. Quando quiser, a mudança para a área industrial está na lojinha."**
- **O que vai junto:** mesas e cadeiras (o editor abre no ponto novo com a arrumação automática), pratos, cursos, equipe, melhorias que não são do ponto, desgaste e o empréstimo. **Saem do save, sem devolver dinheiro:** TV, som (`equipe.tv`, `equipe.som`) e a Água da torneira (`up.maquina`). O limite do banco (`credito`) sobe de R$ 1.000 para R$ 2.000.
- **Gurugol:** as avaliações antigas continuam na média; as novas já vêm na escala do teto 3,7, e a nota sobe aos poucos. Nota mínima para sair da área industrial: `avalMinimo` = **3,4** (90% de 3,7).
- **Balcão de pratos com 5 vagas:** vem com o ponto (5ª vaga em `PLATE_SLOTS`, só quando `ponto.pratos === 5`; o `plates` do `13-cozinha.js` passa a ter o tamanho do ponto).

#### O ponto (`PONTOS[1]` em `10-constantes.js`)
`{ id:'industrial', nome:'Lanchonete na área industrial', nivel:2, lugares:20, aluguel:120, mudanca:800, credito:2000, cardapio:1.5 (decidido em 30/10 com as medições da v9: com 1,2 a mudança dava lucro menor que a Garagem), area:(a da Garagem com x0 160: 20 lugares não cabiam com 196), espera:5, assento:'pe', bebida:'suco', pratos:5, prateleira:4, tipos:{ estudante:1, executiva:1, familia:0.5, vovos:0.7, entregador:2, turma:2, motorista:1 }, grupos:0.8 (fator dos grupos do dia, v9), encomenda:0.6, apito:{ quando:0.45, max:3, gap:[8,12], aviso:10 }, patPressa:0.85, vip:0.3, metaF:1.25 }`
- **Aluguel:** R$ 120 nas contas do fim do dia (linha "Aluguel" no fim do dia e no livro-caixa). Segue a regra da v8.2.2: só o dia completo cobra, junto com a folha; dia interrompido não paga aluguel.
- **Cardápio ×1,5** (mantido pelo usuário em 30/10; o plano dizia ×1,2): `precoPrato` já multiplica pelo ponto.
- **Clientela "pressa e entrega":** na área industrial, o tipo de cada grupo sai de `ponto.tipos` (pesos), no lugar do `day.types` da Garagem; o tipo da semana (`day.tipo`) e o clima continuam valendo por cima. Grupos de 1 e 2 pessoas têm paciência ×`patPressa` (0,85). A chance de VIP vai ×`vip` (0,3). O pico do meio do dia é o **apito da fábrica** (abaixo). Os 3 clientes novos estão em "Clientes da área industrial".
- **Metas:** as metas e o `expert` de cada dia ×`metaF` (1,25), arredondado para 5. Alvo: o bot afiado continua tirando 3 ★ (ver Testes).

#### Clientes da área industrial (planejados com o usuário em 30/10)
Três tipos novos em `CUSTOMER_TYPES` e `GOSTOS`, que só vêm na área industrial (nem na Garagem, nem no Turno sem fim, nem na Missão zero). Nenhum deles é VIP (`VIP.types` não muda). O vegetariano (v8.6.11) vale para todos eles, como para os outros. Visual sem estereótipo: em cada grupo, gente de várias cores, idades e gêneros, sorteados como nos tipos de hoje.

**1. Turma da fábrica** (`turma`)
- `{ label:'Turma da fábrica', pat:0.8, eat:[4,5.5], read:[3,4], size:[3,4], mais:0.15, tip:0 }`; `GOSTOS.turma = [5, 1, 0, 1, 1]` (quase todo mundo no PF). Não sofre o `patPressa` (só vale para 1 e 2 pessoas).
- Visual: macacão azul-marinho ou cinza com crachá no peito; um ou outro com protetor de ouvido pendurado no pescoço.
- **O apito da fábrica** (`ponto.apito`): no `buildSchedule`, as primeiras `max` (3) turmas do dia saem do lugar sorteado e chegam juntas a partir de `quando` (45%) do turno, uma a cada 8 a 12 s (`gap`). `aviso` (10) s antes, o texto **"A fábrica vai apitar!"** sobe na calçada; na hora, **"Apitou!"** com um som de apito (dois tons, curto). As outras turmas do dia chegam como qualquer grupo. Com `prefers-reduced-motion`, o texto aparece parado.
- Comentários próprios no Gurugol: o critério Agilidade (`AVAL_CRIT`) ganha `tipo:{ turma:{ bom:[...], ruim:[...] }, encomenda:{...} }`; quando o grupo é desse tipo, a frase sai dali em 50% das vezes. Turma: bom "Deu tempo de almoçar com calma!", ruim "Quase perdi a volta do intervalo."

**2. Motorista de caminhão** (`motorista`)
- `{ label:'Motorista de caminhão', pat:1.4, eat:[6,8], read:[3,4], size:[1,1], mais:0.6, tip:0.1 }`; `GOSTOS.motorista = [4, 1, 2, 1, 0]` (PF e assados). Não sofre o `patPressa` (tem tempo).
- **Horário:** o peso do motorista no sorteio vai ×2 nos primeiros e nos últimos 20% do turno e ×0,3 no meio (as horas fracas).
- **Cafezinho no fim:** ao terminar de comer, 80% de chance de o balão mostrar o cafezinho (`pedeCafe:0.8`). Servido antes da conta: os R$ 3 de sempre na conta e a gorjeta dele vai de 10% a 15%. Sem café, nada se perde.
- Visual: boné e camisa xadrez ou polo da transportadora, chave do caminhão na mão; homem ou mulher, sorteado a cada vez (50%).

**3. Encomenda do setor** (`encomenda`)
- `{ label:'Encomenda do setor', pat:2, size:[1,1], retira:true, lote:[4,6], tip:0.1 }`: uma pessoa com crachá e uma sacola térmica, que vem buscar `lote` marmitas para a equipe dela. Usa a fila de retirada, com paciência ×2 em relação ao entregador (`PAT.retirada × pat`). Cada marmita sorteia o prato pelos gostos da turma (`GOSTOS.turma`). Não paga Efood (vem a pé, não pelo app): `efood` 0.
- **Quando:** no máximo 1 por dia, com chance `ponto.encomenda` (60%), por volta de 30% do turno. **Avisada na introdução do dia:** "Encomenda do setor de montagem: x marmitas, lá pelo começo da tarde." Assim dá para adiantar marmitas no "+ marmita".
- **Prateleira de 4:** na área industrial, a prateleira do balcão de retirada tem `ponto.prateleira` (4) vagas, no lugar de `MARMITA.vagas` (2). A reserva continua 1.
- **Entrega:** a Bia (ou a Dani) leva as marmitas ao balcão uma a uma, como hoje; a pessoa da encomenda fica no balcão até receber todas (as marmitas adiantadas do mesmo prato servem). Cada marmita entregue conta nas marmitas do dia (o cap. 5).
- **Pagamento:** cada marmita paga o preço do prato (×1,5) menos a embalagem; o lote completo dá **+20 pontos** (`PONTOS_ACAO.lote`) e a gorjeta de 10%. Se a paciência acaba com parte entregue, paga só as entregues, sem gorjeta, e sai insatisfeita (1 coração; avalia com agilidade baixa), mas **não conta como perdida** para a 3ª estrela; com nenhuma entregue, sai brava como o entregador (multa e conta como perdida).
- Comentários (o mesmo `tipo` da Agilidade): bom "Chegou tudo certinho pro setor!", ruim "Faltou marmita pra metade do pessoal."

#### Itens da área industrial (lojinha; só aparecem com `ponto.nivel === 2`)
- **Fogão industrial** (cartão de manutenção): **R$ 400**, compra única. 4 bocas (`slots` do Tonhão + 1) e gasta **metade** do fogão da Garagem por dia (`base` e `uso` × 0,5). Conserto de emergência R$ 160. `save.up.fogaoInd`; o selo e o desgaste continuam no mesmo `MANUT.fogao`.
- **3 televisores com sertanejo** (no lugar do cartão "TV e som"): instalar **R$ 120**, uma vez. Depois, um seletor por dia: desligadas / **com anúncios** (paciência nas mesas 10% mais devagar, luz R$ 9/dia) / **sem anúncios** (15%, R$ 20 + R$ 9 = R$ 29/dia). O custo entra na folha do dia, como a TV da Garagem. Ambiente do Gurugol (`AVAL.amb`): `tvs:0.5` com anúncios, `tvsPlus:0.75` sem (decidido na sessão de planejamento).
- **Espera lá fora** (5 lugares): **cadeirinhas de plástico R$ 60** ou **banquinhos de madeira R$ 90** (um ou outro; trocar paga o novo). Quem espera sentado perde a paciência na espera **15% mais devagar** (as duas iguais; o banquinho é só mais bonito). Sem nenhum, de pé como na Garagem. `save.up.assento = 'cadeira'|'banco'`.
- **Jarra de suco** (a mesma melhoria `maquina`, com nome, desenho e preço do ponto): **R$ 120**. O grupo pede no balão, a Bia leva, R$ 12 na conta (`BEBIDA_ESPERA.suco`), paciência 40% mais devagar como a água. A tarefa "Levar a água da espera" da Dani vira "Levar o suco da espera".
- **Plantas da calçada** (só na área industrial, cada uma uma compra): **violetas em vasinhos R$ 20, antúrio R$ 30, samambaia pendurada R$ 40**. Cada uma soma **+0,1** ao Ambiente do Gurugol (`AVAL.amb.violeta/anturio/samambaia = 0.1`). A espada-de-são-jorge e as plantas da Garagem vão junto (são do save, não do ponto).
- **Preço das melhorias:** sem mudança (o limite de 1 por dia já saiu na 2c-r4a). Só conferir no `carreira.js` se o jogador ainda junta para os itens acima.

#### Visual (`21-cenario.js`)
- Piso de cimento queimado cinza, parede de tijolinho aparente pintado de branco, letreiro **"Lanchonete Corre-Corre"** em placa de metal com lâmpadas, portão de enrolar aberto em cima da porta, vista da janela com galpões e uma chaminé ao fundo, calçada com faixa amarela de carga e descarga e um poste.
- Os 3 televisores no alto da parede (desenhados só depois de instalados), com uma notinha musical quando ligados.
- Cadeirinhas de plástico vermelhas / banquinhos de madeira na espera; jarra de suco num caixote com copos; violetas na janela, antúrio no chão perto da porta, samambaia pendurada no toldo.
- O menu e o card do ponto dizem o nome do ponto. `prefers-reduced-motion`: sem notinha animada.

#### Capítulos (`HISTORIA`, `ponto:'industrial'`)
O cap. 4 começa ao mudar (`avancaCap` no momento da mudança, e a conversa `'antes'` toca no dia seguinte, antes da introdução). `save.cap` vai até 6 (6 = área industrial completa). O que já existe da 2f (falas, rubrica, `capObj`, linha do objetivo no fim do dia e na introdução) vale igual.

**Cap. 4, "Ponto novo"** — objetivo `{ azul:3 }`: 3 dias no azul na área industrial (não precisam ser seguidos; o aluguel já entra no lucro). Texto: "Fechar 3 dias no azul pagando o aluguel (x de 3)".
- Antes: Bia "Olha o tamanho disso, tio! Vinte lugares!" / Tonhão "E aluguel todo dia. Aqui o almoço é corrido: o pessoal da fábrica tem hora pra voltar." / Bia "Então é servir rápido e fechar no azul."
- Depois: Tonhão "Três dias no azul pagando aluguel. Tá provado, Bia." / Bia "E a moto não para de chegar pedindo marmita!"

**Cap. 5, "Hora do almoço"** — objetivo em 2 itens, que ficam ✓ quando cumpridos (o 1º não se perde depois): (a) num mesmo dia, **6 marmitas entregues a tempo e nota 3,4 no fim dele** (`{ marmitas:6, nota:3.4 }`, guardado em `save.capFeito`); (b) **R$ 2.000 no caixa** no fim de um dia (pode ser o mesmo dia ou depois). Cumpre quando os 2 estão ✓. Texto: "6 marmitas e nota 3,4 no mesmo dia (hoje: x marmitas, nota x,x) · R$ 2.000 no caixa (agora R$ x)".
- Antes: Dani "Os motoqueiros já sabem o meu nome!" / Tonhão "Marmita bem fechada e na hora. Quem sai da fábrica volta amanhã." / Bia "E se a nota subir, dá pra sonhar com a Avenida Brasil."
- Depois: Bia "R$ 2.000 guardados! Dá pra Avenida Brasil, tio." / Tonhão (nota: "largando a colher") "Na Avenida Brasil tem o restaurante do Bráulio." / Bia "O chef de bigode da Casa Aurora?" / Tonhão "Ele mesmo. A estrela veio do molho da sua mãe... e ele nunca conseguiu repetir." / Dani "Então é lá que a gente vai abrir!"
- Em seguida, o `#ov-continua` com **"Fim dos capítulos da área industrial. Continua na próxima versão: a Avenida Brasil."** `save.cap = 6`; os dias seguem sem objetivo.

#### O que muda, parte por parte
- **`10-constantes.js`:** `PONTOS[1]` (acima); `PLATE_SLOTS` com a 5ª vaga; `UPGRADES`/itens novos (fogão industrial, TVs, assento, plantas) com `nivel:2`; `AVAL.amb` com `tvs`, `tvsPlus`, `violeta`, `anturio`, `samambaia`; `HISTORIA` caps. 4 e 5; `MANUT.fogao` lendo o fator do fogão industrial.
- **`12-clientes.js`:** os 3 tipos novos no `Group` (turma de 3 ou 4; motorista com o pedido de café; encomenda com `lote`, a lista de pratos e o que já foi entregue); `normSave` com `ponto` (padrão `'garagem'`), `up.fogaoInd`, `up.assento`, `equipe.tvs` (0 desligadas, 1 com anúncios, 2 sem), plantas e `capFeito`; o sorteio de tipo com `ponto.tipos`, VIP com `ponto.vip`, paciência ×`patPressa` para grupos de 1 e 2, paciência na espera ×0,85 com assento.
- **`13-cozinha.js`:** `plates` do tamanho de `ponto.pratos`; `slots` +1 com `up.fogaoInd`.
- **`16-jogo.js`:** `mudarPonto(sv)` (confere dinheiro e nota, desconta R$ 800, troca `ponto`, tira TV/som/torneira, arranjo automático, `avancaCap`); aluguel nas contas do dia; metas ×`metaF`; o apito da fábrica e o horário do motorista no `buildSchedule`; a encomenda do dia (sorteio, aviso na introdução, lote no balcão, pagamento parcial); contagem de marmitas a tempo no dia (para o cap. 5); `capObj` com `azul` contado só no capítulo atual, `marmitas`, `nota` e `caixa`.
- **`20/21-*.js`:** o cenário da área industrial (acima), escolhido pelo `ponto` do save.
- **`41-lojinha.js`:** cartão "Mudança" (com o que falta, e uma confirmação: "Mudar para a Lanchonete na área industrial por R$ 800? Aluguel de R$ 120 por dia. Não dá para voltar."); cartões novos da área industrial; o card "TV e som" some fora da Garagem.
- **`42-resultados.js`:** linha "Aluguel R$ 120" nas contas; a linha do capítulo para os caps. 4 e 5.
- **`40-interface.js`:** rótulo do menu com o ponto ("História · cap. 4, Ponto novo · dia 18"); `save.cap = 6`: "História · área industrial completa · dia N"; "Como jogar" ganha 1 frase sobre a mudança de ponto.
- **`30-ranking.js`:** o ponto alcançado ao lado do resultado (regra da 2b).
- **Modo dev:** o cartão "Mudança" aparece sempre, sem custo nem nota mínima.

#### Testes
- **`tests/smoke37.js` (novo):** (1) antes do cap. 4 não há cartão Mudança; com `cap:4`, aparece e fica apagado sem R$ 800 ou sem nota 2,7 (testar cada um); (2) mudar: −R$ 800, `ponto:'industrial'`, TV/som/torneira fora, mesas levadas, arranjo válido, 20 lugares, 5 vagas de prato, `cap` 4 e `conversa:'antes'`; (3) aluguel de R$ 120 no fim do dia e preços ×1,2; (4) clientela: em 200 grupos sorteados, entregadores ≈ o dobro da Garagem e VIPs ≈ 0,3×; (5) fogão industrial: 4 bocas e metade do desgaste; (6) TVs: instalar, os 3 modos, custo na folha e paciência; (7) assento: espera 15% mais devagar; jarra cobra R$ 12; (8) plantas somam +0,1 cada no Ambiente; (9) cap. 4 com 2 dias no azul continua, com 3 avança; (10) cap. 5: 6 marmitas com nota 3,3 não marca; com 3,4 marca (a); depois R$ 2.000 cumpre; `cap:6` e o `#ov-continua` novo; (11) save da v8.7 sem `ponto` carrega como Garagem; (12) turma: 3 ou 4 pessoas, as 3 primeiras do dia chegam juntas a partir de 45% do turno com o aviso 10 s antes, e nenhuma turma, motorista ou encomenda na Garagem; (13) motorista: mais nas pontas do turno que no meio (em 200 dias sorteados), pede café ao terminar e a gorjeta vai a 15% com o café; (14) encomenda: no máximo 1 por dia, aviso na introdução, prateleira de 4, lote completo paga tudo + 20 pontos sem Efood, lote pela metade paga as entregues e não conta como perdida, nenhuma entregue conta; (15) as marmitas da encomenda contam no cap. 5.
- Ajustar smokes antigos que esperam 4 vagas fixas de prato ou o texto antigo do `#ov-continua`.
- **`bot.js`:** o bot serve o café do motorista (quando a Bia está livre) e trata a encomenda como entregadores em fila (leva as marmitas do lote; adianta o PF no "+ marmita" quando há encomenda avisada).
- **`carreira.js`:** o bot muda de ponto assim que pode (e compra fogão industrial, TVs com anúncios, cadeirinhas e jarra quando sobra R$ 300 acima da folha); `DIAS=35`. Linha `HISTORIA` com o dia de cada capítulo e o dia da mudança.
- **Alvos e como decidir:**
  - Mudar deve se pagar em **3 a 5 dias** (lucro médio por dia na área industrial − o da Garagem ≥ R$ 160). Se demorar mais que 5, `cardapio` 1,25; se pagar em menos de 3, aluguel R$ 150. **Medido na v9 com `cardapio` 1,5: +R$ 140 por dia, volta em ~6 dias; fica assim (decisão do usuário).**
  - `node carreira.js 3` (padrão e `MOVEIS=quatro`): **0 dias no negativo** nos 5 dias depois da mudança; se houver, `mudanca` 700.
  - Cap. 4 cumprido em até 5 dias depois da mudança em 3/3; cap. 5 em até 15 dias depois da mudança em ≥ 2/3. Se o cap. 5 não chegar, as marmitas baixam para 5 (não mexer na nota 3,4 nem nos R$ 2.000).
  - Bot afiado (`balance.js` com o ponto industrial, `PONTO=industrial`): 3 ★ em ≥ 2 de 3 dias; se não, `metaF` 1,2; se passar com folga (todos os dias acima de `expert` em 15%), `metaF` 1,3.
  - **Clientes novos:** o apito não pode virar derrota certa. Com o bot afiado, as turmas do apito perdem ≤ 1 grupo em 3 dias; se perderem mais, `apito.max` 2. A encomenda é entregue completa em ≥ 2 de 3 dias com o bot afiado; se não, `lote` [3,5].
  - Bot com perdas (o padrão sem equipe): a mudança **não** deve compensar (lucro na área industrial ≤ o da Garagem + R$ 40).
- Capturas: `tests/shot_v9.py` em `capturas/v9` (cartão Mudança apagado e aceso, confirmação, salão da área industrial com tudo comprado, o apito com as turmas chegando, o motorista com o balão do café, a encomenda no balcão de retirada, calçada com cadeirinhas, jarra e plantas, TVs ligadas, fim do dia com o aluguel, conversa do cap. 5 com a rubrica, `#ov-continua`, celular).

#### Fechamento
v9: guardar a v8.9 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.md`, `docs/RESUMO.md`, CLAUDE.md (smoke 37, `PONTO=` no balance, `DIAS=35` no carreira), PR e merge.

**Fora:** o Joca (vai para a 3b), a Avenida Brasil, eventos de bairro (4c), o nível de luxo.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas é sistema novo (mudança de ponto, clientela por ponto, cenário inteiro novo) e mexe em muitas partes; a calibração da mudança pode pedir 2 ou 3 rodadas.

## Etapa 2c-r7 — A lojinha abre aos poucos (v9.0.4 e v9.0.5, em 2 sessões)
Origem: pedido do usuário (31/10, `docs/PROPOSTAS.md`): a lojinha não deve assustar quem chega nela pela primeira vez. Os cartões aparecem com o tempo, quando a freguesia reclama de alguma coisa e a Bia tem a ideia de investir nela, como já acontece com o Cardápio (conversa do fim do dia 1) e a Divulgação (conversa do fim do dia 3). Planejada com o usuário em 31/10; as decisões abaixo estão tomadas. A **sessão a** monta o sistema com a ordem-rascunho; a **sessão b** é o momento separado de rebalanceamento: compara ordens com o bot e fecha a ordem com o usuário.

### Decisões tomadas (31/10)
- **Gatilho misto:** cada cartão tem um **dia mínimo** e uma **garantia**. Do dia mínimo em diante, ele fica pendente no fim do dia em que acontece a reclamação ligada a ele; se ela não vier, fica pendente no fim do dia da garantia de qualquer jeito.
- **Pendente → conversa → aberto:** pendente, o cartão continua escondido (como a Divulgação na v9.0.3). A conversa dele toca no próximo fim de dia livre, pela fila de hoje (uma conversa por fim de dia; as de capítulo primeiro). No fim, a lojinha abre direto nele.
- **Escondido:** antes de abrir, o cartão nem aparece (sem cadeado). Aberto, ganha o selo "novo" até ser tocado (o mesmo selo do Cardápio), e o grupo dele também, quando outro grupo está aberto.
- **Só os cartões:** quando um cartão abre, todos os itens dele aparecem juntos (Melhorias inteira, Bia inteira). Itens não são liberados um a um.
- **Só no Modo História:** fora dele (`HIST.on` falso ou save sem a História), no modo dev, no Turno sem fim e do cap. 4 em diante (área industrial), tudo aberto. **Saves de antes da v9.0.4** abrem com tudo aberto, sem conversa (ninguém perde cartão que já usava).
- **Sempre abertos:** Cardápio, Tonhão, Banco, Caixa e Gurugol. Dani (cap. 2), Divulgação (dia 4 e conversa) e Mudança (cap. 3) seguem as regras de hoje. **Liberados por esta etapa:** Bia, Melhorias, Manutenção, Salão e Decoração.
- **Antes da 3b**, para o Joca e o que a Avenida Brasil trouxer à lojinha já nascerem nesse sistema.

### Ordem-rascunho (a sessão b confirma ou troca)
Na 1ª lojinha (fim do dia 1) ficam à vista: Lanchonete › Cardápio; Equipe › Tonhão; Dinheiro › Banco e Caixa; Gurugol.

| Ordem | Cartão | Dia mínimo | Gatilho no dia (reclamação) | Garantia |
|---|---|---|---|---|
| 1 | `bia` (Equipe › Bia) | 2 | algum grupo saiu bravo da mesa (`bravo === 'mesa'`) ou 3+ avaliações do dia com Agilidade `s[1] <= 3` | 4 |
| 2 | `melhorias` | 3 | a lixeira encheu em algum momento do dia, ou 3+ avaliações com Espera `s[0] <= 3` | 5 |
| 3 | `manut` | 3 | no fim do dia, o pior equipamento está abaixo de `MANUT.verde` (barra amarela) | 5 |
| 4 | `salao` | 4 | alguém desistiu da fila sem mesa (`lostBy.semMesa >= 1`) ou `stats.lotadoT >= 90` | 6 |
| 5 | `decor` | 5 | 3+ avaliações com Ambiente `s[4] <= 2.5` (na Garagem quase sempre: o Ambiente começa em 2; na prática abre no dia mínimo) | 7 |

`s` é a lista de notas cruas de cada avaliação (escala 1 a 5, a do `avalComentario`), guardada hoje em `this.avals[].s`. A Manutenção não espera a fila: se ela e outro cartão estiverem pendentes, a dela toca primeiro (a quebra só acontece no vermelho, e da amarela até lá são alguns dias). Sequência típica: fim do dia 1, Cardápio; dia 2, cap. 1 → 2; dia 3, Divulgação; dia 4, Bia; dia 5, Manutenção ou Melhorias; e assim até a Decoração, por volta do dia 8.

### Sessão 2c-r7a — Cartões que abrem com reclamação e conversa (v9.0.4)
**`src/10-constantes.js`**
- Depois de `HIST_DIVULGA`:
  ```js
  /* v9.0.4: a lojinha abre aos poucos no Modo História. Cada cartão: dia mínimo, garantia (ate), as reclamações do Gurugol
     no dia do gatilho e a conversa do fim do dia. save.libera[id]: 0 fechado | 'pend' | 1 aberto (selo "novo") | 2 aberto e visto */
  const LIBERA = [
    { id:'bia', dia:2, ate:4, reclama:['A moça corre pra lá e pra cá e não dá conta!', 'Demorou um século pra anotarem o pedido.'],
      falas:[ { q:'bia', s:'Hoje um freguês disse que eu corro pra lá e pra cá e não dou conta.' },
              { q:'tonhao', nota:'olhando o pé dela', s:'Também, com esse chinelo! Compra um tênis decente, Bia.' },
              { q:'bia', s:'E uma bandeja, pra levar dois pratos de uma vez...' },
              { q:'tonhao', s:'Tá tudo na lojinha, em Equipe, no seu nome.' } ] },
    { id:'melhorias', dia:3, ate:5, reclama:['Esperei no sol sem nem um copo d\'água.', 'Que calor aqui dentro!'], lixo:'Que cheiro de lixo!',
      falas:[ { q:'bia', s:'Tio, um moço reclamou que esperou no sol sem nem um copo d\'água.' },
              { q:'tonhao', s:'Dá pra pôr uma torneira lá fora. E um ventilador aqui, que a cozinha tá um forno.' },
              { q:'bia', s:'E um triturador, pra lixeira não encher tão rápido!' },
              { q:'tonhao', s:'Calma, uma coisa de cada vez. Vê nas Melhorias o que cabe no bolso.' } ] },
    { id:'manut', dia:3, ate:5, primeiro:true, reclama:['O café veio com gosto de queimado.', 'A comida demorou... o fogão tá fraco?'],
      falas:[ { q:'tonhao', nota:'batendo na lateral do fogão', s:'Esse fogão tá com a chama amarela. Coisa boa não é.' },
              { q:'bia', s:'Vai quebrar?' },
              { q:'tonhao', s:'Se ninguém olhar, um dia quebra no meio do almoço. Melhor chamar o técnico antes.' },
              { q:'bia', s:'Vou ver na Manutenção quanto custa a revisão.' } ] },
    { id:'salao', dia:4, ate:6, reclama:['Nem consegui sentar.', 'Só tem quatro mesinhas?'],
      falas:[ { q:'bia', s:'Hoje teve gente indo embora da fila: não tinha mesa pra todo mundo.' },
              { q:'tonhao', s:'Na garagem ainda cabem umas mesinhas. Cadeira de plástico é baratinha.' },
              { q:'bia', s:'Vou ver no Salão onde encaixar.' } ] },
    { id:'decor', dia:5, ate:7, reclama:['Parece uma garagem.', 'Lugar meio sem graça.'],
      falas:[ { q:'bia', s:'Escreveram no Gurugol: "parece uma garagem".' },
              { q:'tonhao', s:'Mas é uma garagem!' },
              { q:'bia', s:'Uma plantinha, a foto da mãe na parede... fica com cara de casa.' },
              { q:'tonhao', nota:'sorrindo', s:'Isso a Rosa ia gostar. Vê na Decoração.' } ] } ];
  function liberaOf(id){ return LIBERA.find(l => l.id === id) || null; }
  ```
- Mova `BIA_IDS` de `41-lojinha.js` para cá (a lógica precisa dele) e acrescente `function upgradeCartao(id){ return BIA_IDS.indexOf(id) >= 0 ? 'bia' : 'melhorias'; }`.

**`src/12-clientes.js` (`normSave`)**
- `libera`: objeto com uma chave por `LIBERA` (valores `0`, `'pend'`, `1` ou `2`). Save novo: tudo `0`. Save sem `s.libera` que não é novo (já tem `s.dia`): tudo `2`. O `resetProgress` zera.

**`src/16-jogo.js`**
- `cartaoAberto(id)`: `true` se o id não está em `LIBERA`, ou com `DEV.on`, `!HIST.on`, `this.save.histV !== 1`, `this.save.cap >= 4`, ou `this.save.libera[id] >= 1`.
- `buy(id)` recusa se `!this.cartaoAberto(upgradeCartao(id))`; `buyMesa`, `buyToalha` e `buyToalhas` recusam sem `salao`; `buyDecor` sem `decor`; `revisar` sem `manut` (o conserto de emergência na plaquinha continua valendo sempre).
- Durante o dia: `this.stats.lixoCheio = true` quando `this.trashFull` (no `update`, onde o lixo enche).
- Fim do dia, junto das linhas do `convCard`/`convDiv` (~linha 872), com as mesmas condições (`!tomou && HIST.on && !DEV.on && sv.histV === 1`) e `sv.cap < 4`: para cada `L` de `LIBERA` com `sv.libera[L.id] === 0` e `d.n >= L.dia`, calcule o gatilho (tabela acima, sobre `this.avals`, `this.stats` e `this.manut`). Se o gatilho veio ou `d.n >= L.ate`, `sv.libera[L.id] = 'pend'`. Quando foi pelo gatilho, ponha uma das `L.reclama` (no `melhorias`, `L.lixo` se a lixeira encheu) na frente do `coment` do resultado (com 3, sai o último) e no `sv.avalCom`. Pode ficar mais de um pendente no mesmo dia.
- `get liberaNovo()`: a lista dos ids com `sv.libera[id] === 1`; `liberaVer(id)`: `1 → 2` e grava o save.

**`src/43-telas.js` (`fluxoHistoria`)**
- Depois das de capítulo e antes do `fim()`, a ordem das extras passa a ser: a da Manutenção pendente (a que tem `primeiro`), Cardápio, Divulgação e as outras de `LIBERA` na ordem da lista. Uma só por fim de dia, como hoje. Ao terminar (ou ao pular): `sv.libera[id] = 1`, `writeSave`, `shopEntra = id`, `fim()`.
- Na entrada da lojinha com `shopEntra`, o grupo aberto é o do cartão (`shopGrupoDe`), não sempre o Lanchonete.

**`src/41-lojinha.js`**
- `shopSecoesVis`: também filtra `game.cartaoAberto(id)`.
- `shopCartoes`: cartão com `game.liberaNovo` contendo o id ganha a classe `novo` e o `aria-label` "Nome: novo na lojinha"; ao tocar, `game.liberaVer(id)`. A fileira de grupos: o grupo leva `novo` (quando outro grupo está aberto) se tiver cartão novo, generalizando o código de hoje do Cardápio.
- `shopAbrir(sec)` para um cartão fechado (ex.: o "Ver cursos" ou algum atalho antigo) abre os cartões do grupo, sem a seção.

**`src/40-interface.js` (Como jogar)**
- Uma frase: "No Modo História, a lojinha abre aos poucos: quando a freguesia reclama de alguma coisa, a Bia descobre o que comprar." Procure em Como jogar e nas dicas textos que mandam a pessoa a um cartão que pode estar fechado no começo; mantenha-os (valem para depois), sem prometer o cartão no dia 1.

**Testes**
- **`smoke41.js` (novo)**, com `load({historia:true})`:
  1. Lojinha depois do dia 1: grupo Lanchonete só com Cardápio; Equipe só com Tonhão; Dinheiro com Banco e Caixa. `game.buy('tenis')` e `game.buyMesa(2)` recusam.
  2. Gatilho: no dia 2, com um grupo saindo bravo da mesa, `libera.bia === 'pend'` e o `coment` do resultado começa com uma das `reclama` da Bia; sem gatilho, no dia 4 vira `'pend'` pela garantia (e o `coment` não ganha a reclamação).
  3. Fluxo: com `bia` pendente e sem capítulo, toca a 1ª fala "Hoje um freguês disse...", depois `libera.bia === 1`, a lojinha abre em Equipe › Bia e o cartão tem `novo`; tocar nele deixa `2` e tira o selo. Com capítulo na troca de dia, a conversa da Bia espera para a seguinte.
  4. Manutenção primeiro: com `manut` e `salao` pendentes juntos, toca a da Manutenção.
  5. Sem a História (`load()` padrão), modo dev e save com `cap: 4`: todos os cartões à vista e `buy` funciona. Save antigo (com `dia: 9` e sem `libera`): tudo `2`.
- Testes antigos que compram Melhorias, mesas ou enfeites com a História ligada (`smoke34`, `smoke38`, `smoke39`, `smoke40` e os `shot_*.py`): ponha `libera` com tudo `2` no save do teste. Não mude o que eles conferem.
- **`carreira.js`:** fecha as conversas pendentes entre os dias (como a do cardápio, linha ~74): `'pend'` → `2`. O bot já compra pelo `game.buy`, que recusa cartão fechado: os números mudam um pouco (é esperado; a sessão b compara). Rode `node carreira.js 20` e anote no spec os dias dos capítulos e da mudança, ao lado dos da v9.0.3.
- `./run_all.sh --tudo` verde (o `balance.js` não liga a História, então não pode mudar).
- Captura `shot_v9_0_4.py` em `capturas/v9.0.4`: a 1ª lojinha (grupos Lanchonete, Equipe e Dinheiro), a conversa da Bia e a lojinha aberta em Equipe com o selo, em 1220×600 e no celular em pé (390×844). Confira com recortes ampliados (PIL `crop`) dos cartões com o selo.

**Fechamento:** v9.0.4. Guarde a v9.0.3 em `versoes/`, atualize `vtag`, `VERSAO` e o painel `#ov-ver` ("v9.0.4 — A lojinha abre aos poucos no Modo História: Bia, Melhorias, Manutenção, Salão e Decoração aparecem quando a freguesia reclama, com uma conversa da Bia e do Tonhão."), escreva `docs/spec-v9.0.4.md`, atualize `docs/RESUMO.md`, `docs/PARTES.md` (`LIBERA`, `cartaoAberto`) e a tabela. PR com merge; avise que está pronta para publicar.

Modelo: Sonnet, esforço médio (plano fechado: dados novos, um filtro na lojinha, a fila de conversas e testes).

### Sessão 2c-r7b — Rebalanceamento e a melhor ordem de liberação (v9.0.5, se algum valor mudar)
O momento separado para conferir a ordem e o equilíbrio. Nada de cartão novo nem de texto novo; só os números de `LIBERA` (ordem, `dia`, `ate`) e, se preciso, o que está dito abaixo.

**Ferramentas (`tests/`, sem mexer em `src/`)**
- `carreira.js` ganha: `LIBERA=0` (tudo aberto, o jogo da v9.0.3: a base de comparação); `LIBERA_ORDEM=bia,salao,...` (reordena a lista); `LIBERA_CFG='{"salao":{"dia":3,"ate":5}}'` (troca dia e garantia); e uma linha `LIBERA | cartão: dia médio em que abre (n/N) · cartões à vista por dia, dias 1 a 10 · cartões novos no mesmo dia (máx.) · Manutenção aberta antes da 1ª barra vermelha (n/N)`.

**Ordens a comparar** (`node carreira.js 40` em cada, mais a base `LIBERA=0`):
- **A** (rascunho): bia, melhorias, manut, salao, decor.
- **B** (mesas antes): bia, salao, melhorias, manut, decor (o `dia`/`ate` de cada posição seguem a coluna da tabela: 2/4, 3/5, 3/5, 4/6, 5/7).
- **C** (enfeites antes, porque são baratos e sobem o Ambiente para as notas dos caps. 2 e 3): decor, bia, melhorias, manut, salao.

**Critérios (decididos):**
1. Obrigatórios, contra a base: dia médio do cap. 3 cumprido e da mudança no máximo **+1 dia**; dias no negativo no máximo **+10%** (relativo); lucro acumulado no dia 14 no mínimo **90%**; Manutenção aberta antes da 1ª barra vermelha em **100%** das rodadas.
2. Curva: no máximo **1 cartão novo por fim de dia**; todos os cinco abertos **até o dia 9** em pelo menos 90% das rodadas.
3. Entre as ordens que passam, a de cap. 3 mais cedo; empate (diferença menor que 0,3 dia), a **A** (a narrativa foi escrita nela).
4. **Se nenhuma passar:** baixe em 1 o `ate` de todos os cartões (nunca abaixo do `dia`) e rode de novo as três. Se ainda assim nenhuma passar, pare e mostre a tabela ao usuário, sem mexer em metas, preços nem capítulos.

**Checagem com o usuário:** monte no `docs/spec-v9.0.5.md` (ou no spec da v9.0.4, se nada mudar) a tabela das três ordens com os números e a curva de cartões por dia. Gere `shot_v9_0_5.py` em `capturas/v9.0.5` com a lojinha no fim dos dias 1 a 8 da ordem escolhida (1220×600), e peça ao usuário para jogar os 7 primeiros dias no Modo História e dizer: (a) se a 1ª lojinha ficou leve; (b) se alguma conversa chegou tarde demais (ex.: queria mesa antes); (c) se alguma chegou junto demais de outra. Se ele pedir troca, aplique a ordem ou o dia que ele escolher e rode o `carreira.js` só para conferir os critérios 1 e 2.

**Fechamento:** se `LIBERA` mudou, v9.0.5 (como na v9.0.4: `versoes/`, `vtag`, `VERSAO`, `#ov-ver` "v9.0.5 — A ordem em que a lojinha abre foi conferida e ajustada."); se não mudou, só o spec e a tabela acima, sem versão nova. `./run_all.sh --tudo` verde, PR com merge.

Modelo: Sonnet, esforço alto (balanceamento por tentativa com critérios fechados e conversa com o usuário no fim).

### Sessão 3b-1 — Restaurante na Avenida Brasil (v9.1) — FEITA em 31/10 (`docs/spec-v9.1.md`; `queueYsFor` conserta a 5ª vaga de espera da área industrial; metas ×1,7; VIP ×2 do sorteio)
**Mudança generalizada** (a 3a amarrou partes ao "nível 2" e ao cap. 4; aqui vale para qualquer ponto):
- `mudancaVisivel`: o cartão aparece com `save.cap >=` o 1º capítulo do próximo ponto (`HISTORIA.find(c => c.ponto === para.id).cap`: 4 para a área industrial, 6 para a Avenida); no modo dev, sempre.
- `mudarPonto`: o `if (sv.cap === 4)` vira "se o capítulo de agora é do ponto novo" (`HISTORIA[sv.cap - 1].ponto === para.id`). Ao sair da área industrial **saem do save, sem devolver**: as TVs (`up.tvs`, `equipe.tvs = 0`), o assento (`up.assento`) e a jarra (`up.maquina`). **Vão junto:** fogão industrial, mesas (arrumação automática), pratos, cursos, equipe, melhorias, decoração (as plantas da Garagem e da área industrial também aparecem na Avenida), empréstimo.
- `normSave`: o "cap. 4 pendente" (`12-clientes.js:149`) vira "o capítulo de agora é de outro ponto que não o do save" (vale para o 4 e o 6).
- Itens da área industrial (TVs, cadeirinhas/banquinhos, jarra, `normEquipe.tvs`, `buildMelhorias`, o seletor das TVs) passam de `nivel >= 2` para `nivel === 2`; o fogão industrial e as plantas `nivel:2` continuam à venda de 2 em diante. `upgradeDe` troca o `ind` por `porNivel:{ 2:{...}, 3:{...} }`; `daniTaskDe` chama a tarefa pela bebida do ponto ("Levar a água saborizada", curto "Água").
- O cartão de fim de capítulos (`contTexto`, `43-telas.js`) sai do texto fixo: o último capítulo de cada ponto ganha `fim:{ h, p }` em `HISTORIA` (a Garagem e a área industrial com os textos de hoje).
- O "Como jogar" (`40-interface.js:184`) diz "cardápio 20% mais caro" (errado desde a v9): use a porcentagem de `PONTOS[1].cardapio` e acrescente 1 frase da Avenida (o cartão Mudança depois do cap. 5).

**O ponto** (`PONTOS[2]`): `{ id:'avenida', nome:'Restaurante na Avenida Brasil', nivel:3, lugares:24, aluguel:400, mudanca:2000, credito:4000, cardapio:2.0, area:{ x0:160, y0:150, x1:684, y1:500 }, espera:6, assento:'pe', bebida:'saborizada', pratos:6, prateleira:4, tipos:{ estudante:0.5, executiva:2, familia:1.5, vovos:1, entregador:1, negocios:1.5 }, vip:2, metaF:1.6, grupos:0.7 }`
- Nota mínima para sair (Terraço, 4a): `avalMinimo` = 3,9 (teto 4,3). Para chegar: 3,4 da área industrial e R$ 2.000.
- Se 24 lugares não couberem na arrumação automática: `y0` 140 e `y1` 510; ainda não, `x0` 140. Se a espera de 6 não couber na calçada com os sofás, 5.
- **6 vagas no balcão de pratos:** `plateSlotsFor(6)` com x = 786 + 32·i (confira no recorte que o 6º prato não sai do balcão).
- Sem `patPressa`, sem apito e sem encomenda (a turma, o motorista e a encomenda não vêm). VIP ×2.

**Cliente novo: Almoço de negócios** (`negocios`, só na Avenida; não é VIP; vale o vegetariano): `{ label:'Almoço de negócios', pat:0.8, eat:[7,9], read:[4,5], size:[3,4], mais:0.2, tip:0.15 }`, `GOSTOS.negocios = [5, 0, 1, 1, 0]`. Visual: blazer ou camisa social de cores sóbrias e variadas (cinza, azul, vinho, bege), um com pasta ou notebook debaixo do braço; gente de várias cores, idades e gêneros. Comentário próprio na Agilidade (`AVAL_CRIT.tipo`): bom "Deu pra fechar o negócio com calma!", ruim "A reunião atrasou por causa do almoço."

**Prato novo e curso de restaurante** (a "Cozinha de restaurante" das ideias guardadas): curso do Tonhão `{ id:'restaurante', nome:'Cozinha de restaurante', preco:400, pratos:['parmegiana'], nivel:3, av:{ nome:'Parmegiana da casa', preco:600, receita:'molho de tomate de 6 horas e queijo gratinado na hora', pratos:['parmegiana'] } }`; `CARDAPIO.parmegiana = { nome:'Filé à parmegiana', preco:30, cat:'pf', curso:'restaurante', carne:true, cor:'#B5432E' }` (R$ 60 na Avenida). O curso só aparece no cartão Cardápio com `ponto.nivel >= 3` (`nivel:3` no curso; no modo dev, sempre). Conta na experiência do Tonhão e na Diversidade do cardápio como os outros. Desenho do prato no estilo das artes da v8.6.10 (filé empanado com molho vermelho e queijo, arroz e batata).

**Itens da Avenida** (lojinha; só com `ponto.nivel === 3`):
- **Couvert artístico:** já existe (`STAFF.couvert`, R$ 80/dia, 20%, taxa de R$ 3 que corta pela metade); aparece sozinho com `nivel:3`. Só conferir o músico no salão de 24 lugares.
- **Sofás** (o assento da espera): **"Sofás com almofadas", R$ 250**, compra única. Quem espera sentado no sofá perde a paciência **25% mais devagar** (`AVENIDA.sofa = { cost:250, slow:0.25 }`; `up.assento = 'sofa'`). Desenho: 2 sofás de 3 lugares, verde-musgo, almofadas coloridas.
- **Águas saborizadas** (a melhoria `maquina` da Avenida, `porNivel[3]`): **R$ 200**. `BEBIDA_ESPERA.saborizada = { preco:14, ingred:3, prep:2, take:0.5 }`, o resto como o suco. Cada grupo sorteia um sabor (limão, morango ou hortelã), que só muda a cor do copo e do balão. Paciência 40% mais devagar (`MAQUINA.slow`, igual). Desenho: mesinha de canto com 3 garrafas de vidro coloridas e copos.
- **Flores da calçada** (`DECOR`, grupo plantas, `nivel:3`, +0,15 no Ambiente cada): **tulipas R$ 40, copos-de-leite R$ 50, orquídeas R$ 60**.
- O cartão "TVs" some da Avenida (o ambiente é o couvert).

**Visual** (`21-cenario.js`, `avenida(g)` ao lado do `industrial(g)`): piso de taco de madeira em espinha de peixe, meia-parede de azulejo verde-água com papel de parede creme em cima, luminárias pendentes, janela grande com prédios e um ipê-amarelo da avenida, letreiro **"Corre-Corre · Restaurante"** em letras douradas sobre toldo listrado vinho e creme, calçada de pedra portuguesa em ondas preto e branco, sofás, mesinha das águas e as flores na calçada (tulipas em jardineira, copos-de-leite num vaso alto, orquídea numa mesinha perto da porta). `prefers-reduced-motion` como nos outros pontos.

**Capítulos** (`HISTORIA`, `ponto:'avenida'`): o cap. 6 começa na mudança (como o 4); até lá `save.cap` fica em 6, "à espera". `save.cap = 8` = Avenida completa. O Bráulio é só citado (ele fala na etapa 6).
- **Cap. 6, "Do outro lado da rua"** — `obj:{ azul:3 }`.
  - Antes: Bia "Avenida Brasil, tio! Olha o movimento dessa calçada." / Tonhão (olhando pela janela) "E ali, do outro lado da rua... o restaurante do Bráulio." / Bia "Então ele vai ver a gente crescer de pertinho." / Dani "E aqui cabe até música ao vivo!"
  - Depois: Tonhão "Três dias no azul com aluguel de gente grande." / Bia "O pessoal do Bráulio passou duas vezes espiando pela janela." / Tonhão (rindo) "Deixa espiar."
- **Cap. 7, "Nota de restaurante"** — `obj:{ nota:3.9, caixa:5000 }` (o texto do objetivo já sai do `capObj`).
  - Antes: Bia "Aqui o Gurugol é mais exigente. Restaurante é outra régua." / Tonhão "Então capricha: prato bonito, mesa limpa e ninguém esperando." / Dani "E guardar dinheiro. Ouvi falar de um terraço lá no alto..."
  - Depois: Bia "Nota 3,9 e R$ 5.000 guardados!" / Tonhão (tirando o avental) "O Bráulio veio jantar aqui ontem. Pediu PF." / Bia "E aí?" / Tonhão "Comeu tudo e não disse nada. Mas raspou o prato." / Dani "Próxima parada: o Terraço Suíça!"
  - `fim:{ h:'Fim dos capítulos da Avenida Brasil', p:'Continua na próxima versão: o Terraço Suíça.' }`.

**O que muda, parte por parte:** `10-constantes.js` (`PONTOS[2]`, `negocios`, `GOSTOS`, `AVAL_CRIT.tipo`, `CURSOS`/`CARDAPIO`, `AVENIDA`, `BEBIDA_ESPERA.saborizada`, `UPGRADES.maquina.porNivel`, `DECOR` das flores com `AVAL.amb`, `HISTORIA` caps. 6 e 7 e os `fim`, `plateSlotsFor`); `12-clientes.js` (`normSave`, `normEquipe`, o assento com `slow` por tipo, o sabor da água); `16-jogo.js` (`mudancaVisivel`, `mudarPonto`, `comprarInd` ou uma `comprarAv` para os sofás); `20/21-*.js` (cenário, clientes novos, sofás, águas, flores, prato); `41-lojinha.js` (cartões da Avenida, curso com `nivel:3`, a confirmação "Mudar para o Restaurante na Avenida Brasil por R$ 2.000? Aluguel de R$ 400 por dia. Não dá para voltar."); `40-interface.js` (rótulo "História · cap. 6, Do outro lado da rua · dia N" e "Avenida Brasil completa"; "Como jogar"); `43-telas.js` (`contTexto`).

**Testes:**
- **`tests/smoke42.js` (novo):** (1) na área industrial com `cap` 5 não há cartão Mudança; com `cap` 6 aparece, apagado sem R$ 2.000 ou sem nota 3,4 (cada um); (2) mudar: −R$ 2.000, `ponto:'avenida'`, TVs/assento/jarra fora, fogão industrial e plantas ficam, 24 lugares com arranjo válido, 6 vagas de prato, `cap` 6 com `conversa:'antes'`; (3) aluguel R$ 400 e preços ×2,0 (PF R$ 50); (4) clientela: em 200 grupos, `negocios` aparece, nenhuma turma/motorista/encomenda, VIPs ≈ 2× os da Garagem; (5) sofás: espera 25% mais devagar; (6) água saborizada R$ 14 na conta, 3 sabores; (7) flores +0,15 cada no Ambiente; (8) couvert à venda só na Avenida (fora do modo dev); (9) curso Cozinha de restaurante só na Avenida, ensina o Filé à parmegiana (R$ 60; R$ 69 com o avançado); (10) cap. 6 com 3 dias no azul avança; cap. 7 com nota 3,9 e R$ 5.000 cumpre, `cap` 8 e o cartão de fim novo; (11) save da v9 na área industrial (sem nada novo) carrega igual, e um com `cap` 6 fica "à espera".
- Ajustar smokes antigos que esperam 5 vagas fixas, o texto do `#ov-continua`, `cap` 6 como "fim" ou o `ind` de `UPGRADES.maquina`.
- **`bot.js`/`carreira.js`:** o bot muda para a Avenida assim que pode e compra sofás, águas e o curso de restaurante quando sobra R$ 400 acima da folha; liga o couvert com a taxa. `DIAS=50` chega à Avenida. Linha `HISTORIA` com os caps. 6 e 7.
- **Calibração** (as Checagens de fim de sessão, com `PONTO=avenida`; meça com `PONTO_CFG` antes de editar `src/`):
  - **Volta do investimento em 5 a 8 dias** (ganho médio por dia na Avenida − o da área industrial ≥ R$ 250, medido com `MUDA=1`, novo no `carreira.js`: o bot muda só para a área industrial). Mais de 8 dias: `cardapio` +0,1 por vez, até 2,3; menos de 4: `aluguel` 450.
  - **0 dias no negativo** nos 5 dias depois da mudança (padrão e `MOVEIS=quatro`). Se houver: o cartão Mudança passa a pedir a mudança **e o 1º aluguel** (R$ 2.400 no caixa; texto "Falta R$ x (a mudança e o 1º aluguel)").
  - Cap. 6 em até 5 dias depois da mudança em 3/3; cap. 7 em até 15 dias em ≥ 2/3. Se o cap. 7 não chegar, `caixa` 4000 (não mexer na nota 3,9).
  - Bot afiado com equipe: 3★ em ≥ 2 de 3 dias; se não, `metaF` 1,5; com folga (todos os dias acima do `expert` em 15%), 1,7. 24 lugares sem perder ninguém: se o afiado perde mais de 1 grupo por dia, `grupos` 0,65.
  - Sem equipe, a mudança **não** compensa (lucro na Avenida ≤ o da área industrial + R$ 40).
- Capturas `tests/shot_v9_1.py` em `capturas/v9_1`: cartão Mudança apagado e aceso, confirmação, salão da Avenida com tudo comprado e 24 lugares, mesa de negócios, VIP, calçada com sofás, águas e flores, couvert, 6 pratos no balcão, parmegiana, fim do dia com o aluguel, conversa do cap. 7, `#ov-continua`, celular deitado.

**Fechamento:** guardar a v9.0.4 em `versoes/`, `vtag`, `VERSAO` 'v9.1', `#ov-ver`, `docs/spec-v9.1.md`, `docs/RESUMO.md`, CLAUDE.md (smoke42, `PONTO=avenida`, `DIAS=50`), PR e merge.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas é um ponto inteiro (cenário, cliente, itens, capítulos), a generalização da mudança mexe em várias partes, e a calibração pode pedir 2 ou 3 rodadas.

## Ideias já entregues (itens tirados do PLANO.md)
- **Feito na v8.6.6** (`docs/spec-v8.6.6.md`, com os valores sugeridos): **Decoração no Ambiente do Gurugol** (adiada na v8.6.5 a pedido do usuário, que mexia nas avaliações em outro branch, o do teto por ponto da v8.6.4; pode vir antes da 4b; os valores abaixo são na escala do serviço, de 1 a 5, antes do teto): a base do Ambiente cai de 3 para 2 (a Garagem pelada fica "meio sem graça"), cada planta soma ~0,3, cada peça do cantinho da Rosa ~0,25 e a toalha +0,5 só para o grupo daquela mesa (como o bônus da cadeira da cor); comentários próprios ("Que plantinha linda!", "A toalha xadrez dá um charme").
- **Virou a etapa 2e (revisão de 28/10), feita na v8.6.** **Entregadores: fila própria e marmitas** (pedido do usuário em 27/10; texto em `docs/PROPOSTAS.md`): hoje o entregador de moto entra na fila como qualquer cliente, senta e come no salão. A ideia é ele **não comer no lugar**: chega pela porta (ou por um balcão de retirada) e entra numa **fila própria de retirada**, separada da fila de mesas, e leva a comida embora. O prato dele é a **marmita**, e para liberá-la pede um **fluxo de preparação**: o Tonhão faz a marmita (tempo e ingredientes próprios, talvez com embalagem como custo), ela fica pronta num ponto de retirada (balcão ou prateleira, com limite de vagas) e a Bia (ou a Dani) entrega ao entregador quando a marmita está pronta. Quem não é atendido a tempo vai embora (paciência curta, como hoje); retirada rápida paga bem. Decidir: se a marmita é um item do cardápio ou um modo de preparo de qualquer prato; se dá para **adiantar marmitas** em horário calmo (estoque no balcão) para liberar os entregadores sem parar o salão; custo da embalagem e preço (taxa de retirada?); como aparece na chuva, quando mais clientes viram entregadores (`CLIMA`), e na sexta, quando vêm mais; efeito nas avaliações do Gurugol (`AVAL`: a espera do entregador conta como agilidade). Combina com o balcão de pratos e com os funcionários extras (Joca).
- **Vai na sessão 3b-3 (31/10).** **Fiscal da vigilância sanitária** (pensada com o usuário em 30/10): uma visita surpresa, como evento, que repara na mesa suja, na lixeira cheia e na pia lotada. Aprovado, selo e um tanto a mais na nota do Gurugol; reprovado, multa. Ensaia o crítico do Michelzão (etapa 6). Decidir: a frequência, o que se confere, o valor da multa e do bônus, e se há aviso (ex.: "Dizem que a vigilância está na rua").
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
- **Vai na sessão 3b-2 (31/10): a Dani confeiteira e o Joca com o básico; o funcionário novo fica para a 4a (o profissional de drinks).** **A Dani se especializa, o Joca pega o básico e um funcionário novo** (pedido do usuário em 30/10, junto com a 2h; texto em `docs/PROPOSTAS.md`): nos níveis mais altos, a Dani vira **barista ou confeiteira**, o que ela mais gosta: **cafés de vários tipos e qualidades e sobremesas de café** (o curso "Barista iniciante" da 2h é a semente). As tarefas mais básicas dela (lixo, louça, pratos sujos) passam para o **Joca**, e entra **mais 1 funcionário**, a planejar. O **Joca também terá level up**, mas só depois que ele entrar (3b). Decidir: em que ponto a especialização chega (Avenida Brasil?), o cardápio de cafés e sobremesas (preço, tempo, efeito no Gurugol), e quem é o funcionário novo.
- **Virou o fogão industrial da etapa 3a (revisão de 28/10).** Equipamento melhor no lugar da manutenção (fogão industrial etc.).
- **Vai na sessão 3b-2 (o Joca; planejado em 31/10).** Mais funcionários: um segundo garçom, além da Dani. **Pedido do usuário em 22/10:** a partir do nível 2 ou 3, dá para contratar um **segundo ajudante, o Joca** (o 2º garçom da etapa 3; texto em `docs/PROPOSTAS.md`). Decidir: se o Joca faz as mesmas tarefas da Dani ou outras (por exemplo, cuidar só da calçada: levar o grupo à mesa e servir a espera), salário, níveis e visual (sem estereótipo, com crachá como a Dani).
- **Virou a etapa 4c (revisão de 28/10).** Eventos de bairro: festa junina, jogo do Brasil.
- **Virou a etapa 2c (revisão de 22/10).** **Avaliações dos clientes como meta para avançar** (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`): uma nota parecida com as avaliações de mapa na internet, que sobe ou desce pela média das **últimas 200 avaliações** de quem passou. Cada grupo avalia 5 critérios:
  - **espera por mesa:** cada coração perdido na fila tira 1 ponto;
  - **agilidade do atendimento:** cada coração perdido esperando a Bia (pedido, prato, conta) tira 1 ponto;
  - **qualidade do prato:** cada cozinheiro tem uma faixa de qualidade e de acerto; mais treinado, faixa mais alta e mais pratos caprichados (o crítico de hoje, `CRIT`, vira 100% de perfeição, nota máxima);
  - **qualidade do menu:** quantos pratos o cardápio tem (só os que os cozinheiros foram treinados para fazer);
  - **ambiente e amenidades:** a estética do salão (enfeites, móveis melhores que as mesas de plástico da Garagem), couvert e outros entretenimentos, cafezinho etc.

  Uma das metas para passar de fase seria a nota mínima de avaliação. Combina com o **nível de luxo** (abaixo), com a escada de pontos (etapas 3 e 4) e com o crítico do guia (etapa 6).
- **Virou a etapa 4b, junto com o Terraço (revisão de 28/10).** **Nível de luxo** (0 a 5, bem para frente, depois de tudo o que está na fila; pedido do usuário em 21/10): a soma dos enfeites (decoração da área de espera e do salão), da localização (ponto), do impacto da mídia (divulgação), da avaliação de críticos surpresa e de outras coisas a ponderar. A progressão seria parecida com a de subir de nível de um personagem por atributos (o usuário citou o sistema do Kratos em God of War Ragnarök como referência; na interface, sem citar o jogo).
- **Especialização e progressão da equipe, ponto a ponto** (pedido do usuário em 31/10, 4 mensagens; texto em `docs/PROPOSTAS.md`). Cada um cresce com o ponto, e o Tonhão faz pratos de alto nível no Terraço depois de vários cursos:
  - **Dani (confeiteira):** já está desde a Garagem como assistente e cresce. Garagem: **confeiteira júnior** (docinhos simples, bolo de pote). Avenida: doces diferentes (shortcake, docinhos gourmet, mais caros). Terraço: os doces mais caros de todos; **o entremet fica para o Terraço** (a ponderar com os preços).
  - **Joca (barista):** **entra já na área industrial** (hoje a 3b-2 o põe na Avenida: ao planejar, decidir se ele vem na 3a ou se a 3b-2 sobe para lá). Avenida: **café** (aprende o grid/o café da Avenida; decidir o nome e o processo). Terraço: **mega barista, cafés top** com vários processos. Na área industrial ele faz o básico até se especializar.
  - **Anselmo (coqueteleiro):** **entra na Avenida Brasil já com habilidade**. História: era o coqueteleiro do restaurante do Bráulio, saiu porque era muito difícil trabalhar lá e achou o novo espaço depois de conversar com o Tonhão (conversa do `LIBERA`, ligada ao Bráulio). No Terraço ganha **vários upgrades** e vira o dos **melhores coquetéis do mundo**.
  - **Cami (atendimento):** terceira assistente para ajudar a Bia no dia a dia; **tão rápida quanto a Bia, ou quase** (o que Dani e Joca não são, porque ainda estão descobrindo a especialidade). Entra no Terraço (a decidir).
  Decidir no planejamento: níveis e salários de cada um, preços dos doces, cafés e coquetéis por ponto, quando a Cami entra, se ela tem upgrade no fim, o que muda na coquetelaria da 4a (o Anselmo a antecipa para a Avenida), visual sem estereótipo. Liga com "Bebidas da Dani no Cardápio" e "Cozinheiros da Avenida Brasil e do Terraço Suíça" (acima).
- **Bebidas da Dani no Cardápio** (entrevista de 30/10, da etapa 2c-r6): quando o curso de barista da Dani passar a trazer bebidas (cafezinho coado, pingado, cappuccino), os cursos dela que trazem itens entram no cartão Cardápio da lojinha, com o rosto da Dani, ao lado dos do Tonhão; os de Atendimento e Organização da cozinha ficam na seção Dani. Pede etapa própria, com preço, balanceamento e desenho das bebidas.
- **Cozinheiros da Avenida Brasil e do Terraço Suíça** (pedido do usuário em 30/10, junto com a 2g; texto em `docs/PROPOSTAS.md`): o XP por cursos da 2g vale para a Garagem e a área industrial. Nos restaurantes de luxo o processo de subir o cozinheiro vai ser outro, porque lá não se vende coxinha (os cursos de salgado não fazem sentido). **Na 3b-1 entra o curso "Cozinha de restaurante" (Filé à parmegiana);** o resto fica para a 4a. Decidir na 4a: cursos próprios do ponto (cozinha de restaurante, alta gastronomia), outro cozinheiro além do Tonhão, ou outra fonte de experiência.

### Sessão 3b-1r — Realinhamento depois da v9.1 (v9.1.1)
> **Por quê** (revisão de 31/10): o plano da equipe (hoje 3b-2 a 3b-6) foi escrito ao mesmo tempo que a v9.1, e os dois não se cruzaram. O `LIBERA` da v9.0.4 só funciona na Garagem (o fim do dia só roda com `sv.cap < 4`, conta o dia da carreira e `cartaoAberto` abre tudo do cap. 4 em diante), mas o Joca e o Anselmo abrem por ele "no 2º/3º dia no ponto". E a v9.1 deixou o Cantinho da Rosa e a samambaia sem desenho fora da Garagem (compra-se, conta no Ambiente e não aparece). Esta sessão arruma a base, para a 3b-2 só usar.

**1. O `LIBERA` depois da Garagem** (`10-constantes.js`, `12-clientes.js`, `16-jogo.js`, `43-telas.js`):
- **`save.pontoDia`** (novo): o `save.dia` em que o save chegou ao ponto de agora. `mudarPonto` grava `sv.pontoDia = sv.dia`. `normSave`: inteiro ≥ 1; save sem ele, com o ponto de nível ≥ 2, recebe `dia - 1` (conta como 2º dia no ponto); na Garagem, 1. Função `diaNoPonto(sv) = sv.dia - sv.pontoDia + 1` (o dia que está terminando; exposta no `window.__lcc`).
- **Entrada do `LIBERA` com `nivel`** (opcional): sem `nivel`, tudo como hoje (dia da carreira, só com `cap < 4`, e do cap. 4 em diante aberto). Com `nivel`: só vale com `ponto.nivel >= nivel`, e `dia`/`ate` contam pelo `diaNoPonto`, em qualquer capítulo.
- **Fim do dia** (`16-jogo.js`, o bloco "a lojinha abre aos poucos"): o `sv.cap < 4` sai da condição geral e passa a valer só para as entradas sem `nivel`.
- **`cartaoAberto(id)`**: a regra "do cap. 4 em diante, tudo aberto" vale só para as entradas sem `nivel`. Com `nivel`: no modo dev, aberto; fora do Modo História (ou `histV !== 1`), aberto com `ponto.nivel >= nivel`; no Modo História, aberto com `libera[id] >= 1`.
- **`normLibera`**: entrada com `nivel` que falta num save antigo fica **0** (nunca 2, nem no "antigo").
- **`liberaGatilho`**: troca o `if` por id por um campo `gatilho` opcional na entrada (`gatilho(st, av, g)`; sem ele, só a garantia do `ate`); as 5 entradas de hoje passam a usar o campo, com as mesmas regras.
- **Conversa** (`43-telas.js`, `fluxoHistoria`): a pendente do `LIBERA` já sai uma por fim de dia; conferir que sai também depois do cap. 4, e que `shopGrupoDe(id)` aceita um id novo (a 3b-2 manda `'joca'` para a Equipe).

**2. O Cantinho da Rosa e a samambaia nos pontos novos** (`21-cenario.js`): `drawDecorParede` passa a desenhar em todo ponto (hoje só em `garagem(g)`), com as posições por nível: Garagem como hoje; **área industrial e Avenida**: foto da Rosa `(330, 74, 0.8)` e samambaia `(630, 78, 0.8)` (na faixa de parede embaixo do cartaz de preços), plaquinha `(237, 68, 1)` na área industrial e `(242, 68, 1)` na Avenida (embaixo do letreiro), quadro de giz `(62, 150, 1)` (no chão, perto da porta). As descrições do `DECOR` que dizem "garagem" e "portão" passam a "parede" e "porta". O ajuste fino das posições é do usuário, no editor de desenhos (avise no fim; publique o artifact do editor só se ele pedir).

**Testes:** **`tests/smoke42b.js` (novo; entra na lista do `run_all.sh` depois do smoke42):** (1) `pontoDia` gravado na mudança, `normSave` de save sem ele (Garagem: 1; área industrial: `dia - 1`); (2) com uma entrada de teste empurrada no `LIBERA` pelo `window.__lcc` (`{ id:'teste', nivel:2, dia:2, ate:4, gatilho:() => false, falas:[...] }`): não vale na Garagem; na área industrial, fica `'pend'` no fim do 4º dia no ponto (garantia) mesmo com `cap >= 4`, e `cartaoAberto('teste')` só depois da conversa; com o gatilho verdadeiro, no 2º dia; (3) as 5 entradas antigas abrem como antes (o smoke41 continua verde) e seguem abertas do cap. 4 em diante; (4) save antigo sem a chave `teste`: fica 0; (5) modo dev e `HIST` desligado abrem a de teste pelo nível. Capturas `tests/shot_v9_1_1.py`: a parede da área industrial e da Avenida com o Cantinho da Rosa e a samambaia (recorte ampliado), sem encostar no cartaz, no letreiro, na janela e no relógio; se encostar, desloque até 20 px para o lado livre.

**3. Teste instável:** o `tests/smoke.js` falha em ~1 de cada 5 rodadas ("day 8 ended (state falencia)", sorteio do dia). Dê ao save do teste dinheiro para não falir até o dia 9 (ou fixe o `Math.random` com semente, como os outros smokes que precisam), sem mudar o jogo; rode 10 vezes seguidas, todas verdes.

**Fechamento:** v9.1.1 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.1.1.md`, `RESUMO.md`), PR e merge.

**Modelo:** Sonnet, esforço médio. Regras e posições fechadas; mexe em 4 partes, mas pouco em cada, e o smoke usa a entrada de teste.

### Sessão 3b-2 — A Dani confeiteira e o Joca, na área industrial (v9.2)
**1. A vontade da Dani** (`LIBERA`, `id:'confeitaria'`, `nivel:2`, `dia:4`, `ate:4`, sem gatilho: o 4º dia na área industrial, no meio dos capítulos dela). Falas: Dani "Bia, as famílias daqui sempre perguntam se tem sobremesa." / Bia "E não tem..." / Dani "Eu faço brigadeiro desde pequena! Com um curso de confeitaria, dá pra vender doce na mesa e na marmita." / Tonhão "Doce bom segura freguês. Vê no Cardápio da lojinha." Abre o curso no cartão Cardápio (`shopGrupoDe('confeitaria')` = Cardápio); fora do Modo História, aberto na área industrial.

**2. Curso "Confeitaria caseira"** (`DANI_CURSOS`, `{ id:'confCaseira', nome:'Confeitaria caseira', preco:180, nivel:2, item:true }`, +2 de experiência; com as confeitarias, a experiência dos cursos da Dani vai a 10 e ela sobe um pouco mais cedo, de propósito). Traz a **geladeirinha de doces**: `STATIONS.doces`, `rect:{ x:690, y:92, w:50, h:50 }`, `ap:{ x:714, y:150 }`, na `STATION_KEYS` com `estacaoOn('doces')` só com o curso; geladeirinha branca de porta de vidro com potes. Doces (`DOCES.caseira`): **bolo de pote, brigadeiro de colher e pudim**, **R$ 7** cada (ingrediente R$ 2). Tarefa nova da Dani **"Servir doces"** (curto "Doce", `need:'confCaseira'`); antes do Joca, ela a marca na lista como as outras.

**3. Pedidos de fim de refeição** (o molde do cafezinho do motorista, `cafePede`/`esperaSuco`, generalizado; a 3b-3 usa para os cafés): ao terminar de comer, o grupo pode pedir **doces** (`DOCES.pede`: `{ familia:0.5, vovos:0.6, estudante:0.3, executiva:0.2, negocios:0.4, turma:0.3, motorista:0.3 }`, VIP +0,2, nunca o entregador; sem o curso, ninguém pede): `randi(1, size)` itens, cada um sorteado entre os do patamar. Balão com os itens, a paciência corre e o grupo só pede a conta depois de receber todos. Cada item: ocupa mão como bebida (2 por mão com a bandeja), devolve 1 coração, +5 pontos (`PONTOS_ACAO.doce`) e entra na conta (`bebConta`). Item não entregue sai da conta e o grupo perde paciência como no suco pendente. Gurugol: bom "A sobremesa da casa é uma delícia!"; ruim (esperou o doce e perdeu coração) "A sobremesa demorou mais que o almoço."

**4. Doce na marmita:** com o curso, cada marmita tem **30%** (`DOCES.marmita`) de vir com "+ doce" (pote pequeno no ícone). O pote vai para o balcão de retirada: a Bia toca a geladeirinha e depois o balcão, ou a Dani com a tarefa "Doce". Se o entregador leva sem o doce, só se perdem os R$ 7.

**5. O Joca** (conhecido da Dani dos tempos de colégio): a Dani o indica para o posto dela quando termina a Confeitaria caseira. `LIBERA`, `id:'joca'`, `nivel:2`, `dia:1`, `ate:999`, `gatilho:(st, av, g) => !!g.save.daniCursos.confCaseira` (a conversa vem no fim do dia do curso). Falas: Dani "Terminei o curso de confeitaria! Mas, se eu ficar nos doces, quem cuida da louça e do lixo?" / Bia "Pois é..." / Dani "Lembra do Joca, do meu colégio? Tá procurando serviço e é trabalhador." / Tonhão "Esse salão é grande demais pra vocês duas, mesmo." / Joca "Lixo, louça, mesa suja: pode deixar comigo!" / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.joca = 'Joca'`, `convCabeca` com ele, cor do nome `#2C7A7B`. Fora do Modo História, o cartão dele abre com a Confeitaria caseira feita.
- **Níveis iguais aos da Dani, do 2 ao 4** (pedido do usuário): `STAFF.joca = { levels:[ null, null, { speed:0.5, tasks:2, pay:45, xp:0 }, { speed:0.65, tasks:2, pay:60, xp:6 }, { speed:0.8, tasks:3, pay:75, xp:12 } ] }`. Contratar põe no nível 2 (R$ 45/dia). Experiência: +1 a cada `JOCA_XP.tarefas` (5) tarefas (`save.jocaTar`, só dia completo) e +2 por curso (`JOCA_XP.curso`); o aumento consolida o nível (as regras do Tonhão e da Dani).
- **Cursos de atendimento do Joca** (no cartão dele): `JOCA_CURSOS = [ { id:'atend', nome:'Atendimento ao cliente', preco:120, nivel:2 }, { id:'cozinha', nome:'Organização da cozinha', preco:150, nivel:2 }, { id:'espresso', nome:'Barista: espresso', preco:350, nivel:3, item:true } ]` (o espresso é da 3b-3; aqui só entra na lista, escondido abaixo do nível 3).
- Faz o básico (`donoBasico`), nunca o cafezinho; as tarefas dele escolhidas no cartão, como as da Dani (padrão `['lixo','lavar']`). Save: `equipe.joca` (0 ou 2 a 4), `equipe.jocaTasks`, `jocaTar`, `jocaCursos`, `jocaCursoDia`; `normEquipe` e `payroll` contam o Joca; na folha, "aumento do Joca" e "o Joca não vem" (a ordem acima).
- **Código:** a classe `Helper` (`15-dani.js`) recebe quem é (`new Helper(g, 'dani')`, `new Helper(g, 'joca')`): nível, `spec`, tarefas, casa (`JOCA_HOME = { x:640, y:515 }`) e contagem de tarefas. As marcas de "um ajudante já vai pegar" (`p.dani`, `o.dani`, `group.daniCoffee`) guardam quem e cada um respeita a do outro (mesa, pia, marmita, suco: `targets`, `washing`). Onde o jogo percorre `[this.bia, this.dani]` (marmitas nas mãos, `16-jogo.js`), entra o Joca.
- **Visual** (sem estereótipo, com crachá): rapaz de uns 20 anos, pele parda, cabelo cacheado preto curto, óculos redondos, camiseta cinza com avental azul-marinho e crachá "JOCA", tênis branco; os níveis 3 e 4 mudam o avental como os da Dani.

**Partes:** `10-constantes.js` (`STAFF.joca`, `JOCA_XP`, `JOCA_CURSOS`, `DANI_CURSOS`, `DANI_TASKS`, `DOCES`, `STATIONS.doces`, `PONTOS_ACAO`, `LIBERA`, `HIST_NOMES`, `FOLHA_CORTE`, `payroll`), `12-clientes.js` (pedidos de fim de refeição, `normEquipe`), `15-dani.js` (`Helper` para os dois, `donoBasico`), `16-jogo.js` (folha, marmita com doce, estação), `19-conversa.js`, `20-desenho-base.js` (Joca, doces), `21-cenario.js` (geladeirinha), `22-salao-hud.js` (balão do doce), `41-lojinha.js` (cartão do Joca, curso no Cardápio), `42-resultados.js` (doces no fim do dia).

**Testes:** **`tests/smoke43.js` (novo):** (1) conversa da confeitaria no 4º dia na área industrial; o curso só depois dela (no Modo História) e só a partir da área industrial; (2) sem o curso ninguém pede doce; com ele, as chances por tipo em 300 grupos, o grupo espera os doces para pedir a conta e paga R$ 7 cada; (3) marmita com "+ doce" em ~30%; com o pote, R$ 7; sem, só perde os R$ 7; (4) conversa do Joca no fim do dia do curso; contratar põe nível 2 e R$ 45 na folha; (5) com o Joca, o básico sai da lista da Dani e vai para ele; sem ele no dia (folha), volta para ela; nunca o cafezinho; os dois num dia: nenhuma mesa limpa duas vezes, nenhum item perdido; (6) experiência pelo trabalho e pelos cursos, aumento até o nível 4 (velocidade 0,8, 3 tarefas); (7) a ordem da folha; (8) save da v9.1.1 sem Joca carrega igual. `bot.js`: compra a confeitaria, contrata o Joca e serve os doces (`carreira.js` mostra a folha com ele e quanto vem de doce). `balance.js PONTO=industrial EQUIPE=auto`: o alvo de 85–95% continua; se passar de 95%, `pay` do Joca 55/70/85 e, se ainda passar, `DOCES.pede` −0,1 em cada tipo. Capturas `tests/shot_v9_2.py`: o Joca nos 3 níveis, os dois trabalhando, os cartões, a geladeirinha, o balão do doce, a marmita com doce, o Cardápio com o rosto da Dani, as 2 conversas.

**Fechamento:** v9.2 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.2.md`, `RESUMO.md`), PR e merge.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas o 2º ajudante mexe na classe da Dani, os dois não podem se atrapalhar e entra o pedido de fim de refeição; pede depuração com o bot. Se passar de umas 15 trocas, feche o Joca como v9.2 e deixe os doces para uma v9.2.1 com o mesmo plano.

### Sessão 3b-2d — Painel do modo dev (v9.2.1; planejada em 31/10)
Pedido do usuário: o modo dev (10 toques no selo; save à parte, `DEV` em `12-clientes.js`) deve deixar testar **todos os níveis, pontos, upgrades, cursos e equipe** e **avançar rápido**, sem jogar dias inteiros, para a 3b-3 em diante, o Terraço e os eventos já serem testados por ele. **O jogo normal não muda; o modo dev nunca grava no save normal** (`saveKey()` já separa; nada novo grava fora dele).

**O que já existe e fica:** chips dos dias 1 a 10 no menu (o `smoke15` usa), R$ 10.000 que voltam no `goShop`, lojinha sem custo e sem trava (`DEV.on` em `cursoOk`, `cursoDaniVis`, `couvertOk`, `divulgaAberta`, `mudancaFalta`, `cartaoAberto`, níveis da equipe, cursos, melhorias `devToggle`, fogão `devInd`), sem História e sem ranking.

**1. Modo dev "de verdade" (`12-clientes.js`, `16-jogo.js`, `41-lojinha.js`, `10-constantes.js`).** `DEV` ganha `real:false` e `vel:1` (só na memória; `setDev` volta os dois a `false` e `1`). Nova função logo depois de `DEV`: `function devLivre(){ return DEV.on && !DEV.real; }`. Troque `DEV.on` por `devLivre()` **em toda checagem de custo, trava ou liberação**: `cursoOk`, `cursoDaniVis`, `couvertOk`, `divulgaAberta`, `normSave` (só o `divulga: ... 'boca'`), `consertar`/`revisar` (159, 163, 175, 176), o reabastecer de R$ 10.000 do `goShop`, `setStaff` (954–956), `mudancaFalta`, `mudancaVisivel`, `mudarPonto` (o custo), `buy` (1057–1058), `cartaoAberto` (1126), `cursoTrava`, `daniCursoTrava`, `daniChegou`, `jocaCursoTrava`, o curso do Joca (1203), a decoração (1320) e, na `41-lojinha.js`, todos os `DEV.on` de preço, botão grátis, "Ligar/Desligar" e `shop-limit` (259, 297, 318, 368, 675, 761, 772, 777, 787, 804, 811, 824, 829, 1004, 1010–1014, 1038; os números são da v9.2, confira pelo `grep -n "DEV.on" src/`). **Ficam com `DEV.on`:** `saveKey`, `loadSave` (184), a História (`normSave` 160, `16-jogo` 903–905, 982, 1003, 1037), `resetProgress`, `setDev`, `devInd`, `devToggle`, `treinoPrimeiro`, menu, selo e ranking. Com `DEV.real`, o `shop-limit` diz: **"Modo dev com preços de verdade: paga e espera como no jogo."**

**2. Ações do dev na classe `Game` (`16-jogo.js`, logo depois de `setDev`; todas devolvem `false` com `!DEV.on` e gravam com `writeSave`):**
- `devDia(n)`: `n` entre 1 e 99; `save.dia = n`, `save.pontoDia = Math.min(save.pontoDia, n)`; na lojinha, `shopNext = n` e `resetDay(n)`.
- `devPonto(id)`: vai direto a qualquer ponto de `PONTOS` (subir ou descer). Tire o miolo do `mudarPonto` (da troca de `salao.ponto` até `normEquipe`, sem o custo, sem o capítulo e sem o `Sfx`) para `trocaPonto(para)`, usado pelos dois; `devPonto` faz `trocaPonto`, `tablesKey = ''`, `buildTables()`, `kitchen/dani/joca.reset()` e, na lojinha, `resetDay(shopNext)`.
- `devNota(v)`: `save.aval` = `AVAL.max` avaliações iguais com todos os critérios em `min(v, avalTeto(this.ponto))`; `v === 0` limpa (`save.aval = []`).
- `devEquipe(modo)`: `'max'` põe Tonhão, Dani e Joca no último nível de `STAFF` (Dani com as tarefas `['pratos','lavar','suco']`, Joca com `['lixo','lavar','pratos']`), todos os `CURSOS` no nível 2 (o que o `normCursos` aceita), todos os `DANI_CURSOS` e `JOCA_CURSOS`; `'zero'` volta Tonhão 0, Dani 1 (com `DANI_PADRAO`), Joca 0 e cursos vazios (`normCursos({})`, `{}`, `{}`). Depois, `normEquipe(save.equipe, this.ponto)`, `kitchen/dani/joca.reset()`, `cursoDia = daniCursoDia = jocaCursoDia = 0`.
- `devMelhorias(on)`: `true` liga todas as `UPGRADES` (como o `devToggle`: `multi` vira 1); `false` tira todas (e o fogão industrial, `fogaoInd`); depois `kitchen.slots = cozinhaSlots(this)`.
- `devCaixa(v)`: `save.bank = v` (só faz diferença com `DEV.real`).
- `devReal(on)`: `DEV.real = !!on`; ao desligar, o banco volta a no mínimo `DEV.bank`.
- `devFimDia()`: só com `mode === 'carreira'` e `state` `'playing'` ou `'paused'` (que antes volta a `'playing'`): `clock = 0` (o fim de dia normal acontece no próximo `update`).

**3. Velocidade (`43-telas.js`).** Nova `function passoJogo(dt){ const k = DEV.on && game.state === 'playing' ? DEV.vel : 1; for (let i = 0; i < k; i++) game.update(dt); }`; o `frame` chama `passoJogo(dt)` no lugar de `game.update(dt)`. `DEV.vel` é 1, 2 ou 4.

**4. Painel do dev (`02-telas.html`, `01-estilo.css`, `40-interface.js`, `43-telas.js`).**
- O `#devbadge` vira `<button class="devbadge" id="devbadge" type="button" aria-label="Abrir o painel do modo dev">Modo dev · painel</button>` (sem o `pointer-events:none`; `min-height:max(28px, calc(var(--u)*30))`). Toque: `abrirDev()`; com o jogo rodando (`playing`), antes `game.pause()`, e o `#ov-pause` fica por baixo.
- Painel `#ov-dev` depois dos outros `#ov-*`, por cima deles (não usa `showOnly`: liga e desliga só ele; `z-index` acima dos `.ov`). `<div class="panel dev-panel">` com rolagem própria (`max-height:90%; overflow:auto`), título **"Painel do dev"** e as seções, cada uma com um `<div class="lbl">`, montadas por `buildDev()` (`40-interface.js`) com `el(...)`, `.btn` e `.chip` que já existem:
  1. **Dia** (no menu e na lojinha): "Dia N" e os botões **−10, −1, +1, +10** (`devDia`).
  2. **Ponto** (menu e lojinha): um botão por ponto de `PONTOS`, com o `nome`; o atual com `aria-pressed="true"`. O Terraço entra sozinho quando estiver em `PONTOS`.
  3. **Nota do Gurugol** (menu e lojinha): "Agora: X ★" (ou "sem nota") e os botões **2,0 · 2,7 · 3,4 · 4,0 · Teto · Limpar** (`devNota`; Teto = `avalTeto(ponto)`; Limpar = 0).
  4. **Equipe, cursos e melhorias** (menu e lojinha): **"Tudo no máximo"** (`devEquipe('max')` + `devMelhorias(true)`) e **"Do começo"** (`devEquipe('zero')` + `devMelhorias(false)`).
  5. **Lojinha de verdade** (menu e lojinha): **"Preços e travas de verdade: desligado"** / **"…: ligado"** (`devReal`) e, com ele ligado, **Caixa: R$ 0 · R$ 500 · R$ 2.000 · R$ 10.000** (`devCaixa`).
  6. **No dia** (só com o jogo pausado no meio de um dia da carreira): **Velocidade 1× · 2× · 4×** (`DEV.vel`, o atual com `aria-pressed`) e **"Encerrar o dia agora"** (`devFimDia()`, fecha o painel e continua o jogo).
  - Rodapé: **"Fechar"** (`fecharDev()`: esconde o `#ov-dev` e, conforme o `state`, `buildMenu()` ou `buildShop()`; na pausa, a pausa continua).
  - Cada toque: `Sfx.tap()` e `buildDev()` de novo (os números mudam na hora).
- `window.__lcc` ganha `abrirDev, fecharDev, buildDev, passoJogo, devLivre`.

**5. Versão v9.2.1.** `versoes/v9.2-fonte.html` e `versoes/v9.2.html`, selo `vtag`, `VERSAO = 'v9.2.1'`, `docs/spec-v9.2.1.md`, `docs/RESUMO.md` e, no `#ov-ver`: **"v9.2.1 — 31/10/2026 — Modo dev com painel, para testar: um toque em "Modo dev · painel" escolhe qualquer dia, qualquer ponto, a nota do Gurugol, a equipe e os cursos no máximo (ou do começo) e as melhorias; liga a lojinha com preços e travas de verdade e, no meio do dia, acelera o jogo (2× ou 4×) ou encerra o dia. O jogo normal não muda."** (e o link "Abrir a v9.2" na entrada da v9.2).

**6. Smoke novo `tests/smoke44.js`** (no `run_all.sh`), confere:
1. Fora do modo dev: as `dev*` devolvem `false` e não mexem no save; `#devbadge` e `#ov-dev` escondidos; `passoJogo` faz um `update` só.
2. Liga o dev guardando antes o `localStorage` do save normal (`LS.save`); no fim, ele está igual.
3. `devDia(35)` → `proxDia === 35`; `devDia(0)` → 1; `devDia(120)` → 99; na lojinha, `shopNext` acompanha.
4. `devPonto('avenida')` → `ponto.nivel === 3`, `pontoDia === dia`, sem `equipe.tv`, `up.tvs` nem `up.maquina`; `devPonto('garagem')` e `devPonto('industrial')` também funcionam; `salaoProblema` sem problema em cada um.
5. `devNota(3.4)` na área industrial → `notaGurugol === 3.4`; `devNota(5)` na Garagem → 3 (o teto); `devNota(0)` → `null`.
6. `devEquipe('max')` → níveis máximos e todos os cursos; `'zero'` → Tonhão 0, Dani 1, Joca 0, sem cursos.
7. `devMelhorias(true)` → toda `UPGRADES` em `up`; `false` → nenhuma.
8. `devReal(true)`, `devCaixa(0)`, `devNota(2)` → `mudancaFalta` com `din` e `nota`; `buy` de uma melhoria falha; `goShop` não devolve os R$ 10.000; `devReal(false)` → `mudancaFalta === null` e banco ≥ 10.000.
9. Num dia da carreira: `DEV.vel = 4`, `passoJogo(0.05)` → o `clock` cai ~0,2 s; `devFimDia()` e alguns `update` → `state === 'dayend'`.
10. Painel: `abrirDev()` no menu mostra Dia, Ponto, Nota, Equipe e Lojinha de verdade, sem "No dia"; os botões de ponto são `PONTOS.length`; tocar "+10" muda o "Dia N"; na pausa de um dia, "No dia" aparece; `fecharDev()` esconde o painel.
11. `setDev(false)`: `DEV.vel === 1`, `DEV.real === false` e o save normal igual ao do item 2.

**Checagens:** `./run_all.sh --tudo` verde (o `menu_fit` não muda: o menu não ganhou linha); capturas do painel no menu, na lojinha e na pausa (desktop e 740×360, sem cortar, rolando por dentro), conferidas em recorte. Sem balanceamento (o jogo normal não muda).

**Modelo:** Sonnet, esforço médio: plano fechado, código mecânico em várias partes, sem decisão de jogo.

---

### Sessão 3b-3 — A Avenida: a vitrine da Dani, o Joca barista e a Cami (v9.3)
**1. Curso "Confeitaria gourmet" da Dani** (`{ id:'confGourmet', nome:'Confeitaria gourmet', preco:350, nivel:3, dep:'confCaseira', item:true }`, +2 de experiência; no Cardápio). A geladeirinha vira **vitrine refrigerada** (mesmo lugar) e os doces passam a ser os gourmet (`DOCES.gourmet`; os caseiros saem do sorteio): **shortcake de morango, torta de limão e brigadeiro gourmet**, **R$ 16** cada (ingrediente R$ 4), e +0,25 no Ambiente de quem comeu (`AVAL.amb.doce`). A marmita com doce leva o gourmet.

**2. O Joca barista** (curso `espresso` da lista dele, R$ 350, só na Avenida, no Cardápio). Traz a **máquina de espresso**, desenhada sobre a estação do café (`STATIONS.coffee`; a cafeteira segue com a manutenção dela). Itens (`CAFES.espresso`): **espresso R$ 8** (preparo 0,8 s) e **cappuccino R$ 12** (1,2 s); ingrediente R$ 2. Pedidos de fim de refeição (o molde da 3b-2) com `CAFES.pede`: `{ executiva:0.5, negocios:0.6, vovos:0.4, familia:0.2, estudante:0.3 }`, +5 pontos (`PONTOS_ACAO.cafeEsp`). O cafezinho passa da Dani para o Joca ("Servir cafezinho" sai da lista dela; se estava marcada, a vaga fica livre), e ele leva os espressos; o Barista iniciante da Dani continua valendo como experiência. Enquanto a Cami não vem, o Joca segue com o básico nas vagas que sobram (café fixo + `tasks − 1`). Gurugol: bom "Que cappuccino caprichado!".

**3. A Cami** (atendimento; o Joca passa o bastão para ela). `LIBERA`, `id:'cami'`, `nivel:3`, `dia:1`, `ate:999`, `gatilho:(st, av, g) => !!(g.save.jocaCursos && g.save.jocaCursos.espresso)`. Falas: Joca "Agora que eu tô na máquina de café, a louça vai acumular..." / Bia "E o salão daqui não perdoa." / Joca "Tem a Cami, do meu curso de barista. Ela era garçonete de rodízio: rápida que só!" / Cami "Me mostra onde fica tudo que eu dou conta!" / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.cami = 'Cami'`, `convCabeca` com ela, cor do nome `#6B46C1`. Fora do Modo História, o cartão abre com o espresso feito (no modo dev, sempre).
- Chega já no nível do topo do Joca e fica com o básico (`donoBasico`); o Joca fica só nos cafés. **Sobe só por curso** (como o Anselmo; o salário sobe junto): `STAFF.cami = { levels:[ null, { speed:0.9, tasks:3, pay:120 }, { speed:1.1, tasks:4, pay:140 }, { speed:1.25, tasks:4, pay:160, mesas:true } ] }`. `CAMI_CURSOS = [ { id:'agil', nome:'Atendimento ágil', preco:400, nivel:3 }, { id:'mesa', nome:'Atendimento de mesa', preco:600, nivel:3, dep:'agil' } ]`: o 1º põe no nível 2; o 2º no nível 3 e abre o modo "Minhas mesas" (a 3b-6; até lá, o curso aparece com "Em breve" e não se compra). Save: `equipe.cami` (0 a 3), `equipe.camiTasks`, `camiCursos`, `camiCursoDia`; folha: "a Cami não vem" (a ordem acima).
- **Visual** (sem estereótipo, com crachá): mulher de uns 30 anos, pele morena clara, cabelo preto liso num rabo de cavalo alto, camisa polo vinho (a cor da Avenida) com avental curto preto, crachá "CAMI", tênis preto. O nível 2 ganha um tênis de corrida; o 3, uma caneta atrás da orelha e o bloquinho no avental.

**Partes:** `10-constantes.js` (`DANI_CURSOS`, `DOCES.gourmet`, `CAFES`, `STAFF.cami`, `CAMI_CURSOS`, `PONTOS_ACAO`, `AVAL`, `LIBERA`, `HIST_NOMES`, `FOLHA_CORTE`, `payroll`), `12-clientes.js` (cafés no fim da refeição, `normEquipe`), `15-dani.js` (`Helper` para três), `16-jogo.js`, `19-conversa.js`, `20-desenho-base.js` (Cami, doces gourmet, cafés), `21-cenario.js` (vitrine, máquina), `22-salao-hud.js`, `41-lojinha.js` (cartão da Cami, cursos no Cardápio), `42-resultados.js`.

**Testes:** **`tests/smoke44.js` (novo):** (1) Confeitaria gourmet só na Avenida e só depois da caseira: vitrine, R$ 16, Ambiente +0,25, marmita com o gourmet; (2) espresso só na Avenida: cafés pelas chances (300 grupos), R$ 8 e R$ 12; o cafezinho sai da Dani e vai para o Joca; (3) conversa da Cami no fim do dia do espresso; contratar põe nível 1 e R$ 120; (4) com a Cami, o básico vai para ela e o Joca fica só no café; sem ela no dia, volta para ele; os três num dia sem disputa; (5) os cursos da Cami: velocidade e salário por curso; o "Atendimento de mesa" não se compra até a 3b-6; (6) a ordem da folha; (7) save da v9.2 carrega igual. `bot.js`: compra os cursos e contrata a Cami. `balance.js PONTO=avenida EQUIPE=auto`: 85–95%; se passar de 95%, `pay` da Cami 140/160/180 e, se ainda passar, `CAFES.pede` −0,1. Capturas `tests/shot_v9_3.py`: a vitrine, a máquina, a Cami nos 3 níveis, os três ajudantes trabalhando, o balão do café, o Cardápio com os rostos, a conversa dela.

**Fechamento:** v9.3 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.3.md`, `RESUMO.md`), PR e merge.

**Modelo:** Sonnet, esforço alto. Decidido, mas o 3º ajudante e a regra do básico pedem cuidado com o bot e com as marcas de quem pega o quê.

### Sessão 3b-4 — Fiscal da vigilância sanitária (v9.4)
- **Quando:** só na Avenida (`nivel >= 3`) e na carreira, do 2º dia no ponto em diante, com chance de **15% por dia** (`FISCAL.chance`), sorteada com o clima (`manut.sorteio`, para não mudar ao rejogar). Nunca na Missão zero nem no Turno sem fim. **Avisado na introdução do dia:** "Dizem que a vigilância sanitária está rondando a Avenida." (sem dizer a hora).
- **A visita:** num momento entre 30% e 70% do turno, o fiscal (`FISCAL`, não é grupo e não ocupa mesa) entra pela porta, anda até o meio do salão e fica **20 s** (`FISCAL.visita`) olhando, com a prancheta; depois sai. Visual: colete azul-claro com "VIGILÂNCIA" escrito, prancheta e caneta; homem ou mulher, sorteado.
- **O que ele confere durante a visita** (cada um é uma falha): (1) alguma mesa ficou **suja por mais de 8 s seguidos**; (2) a **lixeira esteve cheia**; (3) a **pia chegou a 4 pilhas** ou mais. Um ícone pequeno de cada falha aparece em cima dele quando acontece.
- **Resultado** (texto grande no salão quando ele sai): **0 falhas, "Aprovado!"**: selo "Aprovado pela vigilância" na parede por 7 dias (`save.selo`, o último dia do selo), que soma **+0,5 no Ambiente** do Gurugol (`AVAL.amb.selo`) e +30 pontos; **1 falha, "Advertência"**: só o aviso, sem multa; **2 ou 3 falhas, "Multa!"**: **R$ 150** nas contas do dia (linha "Multa da vigilância" no fim do dia e no livro-caixa).
- Gurugol: no dia aprovado, comentário "Vi o selo da vigilância: lugar limpinho!"
- **Testes:** **`tests/smoke45.js` (novo):** (1) não vem na Garagem nem na área industrial; na Avenida, ~15% dos dias em 400 sorteios, e o mesmo sorteio ao rejogar; (2) aviso na introdução; (3) cada falha detectada (mesa suja 8 s, lixeira cheia, pia com 4); (4) 0, 1 e 2 falhas dão selo, advertência e multa; (5) o selo soma +0,5 no Ambiente por 7 dias e some; (6) multa no fim do dia e no livro-caixa; (7) save sem `selo` carrega. `bot.js`: nada novo (só medir). `carreira.js`: quantas visitas e o resultado de cada uma; com o bot comum, a multa não pode passar de 1 em cada 3 visitas (se passar, a mesa suja vira 12 s). Capturas `tests/shot_v9_4.py`: o fiscal no salão com as falhas, o selo, o fim do dia com a multa.
- **Fechamento:** v9.4 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.4.md`, `RESUMO.md`), PR e merge.

**Modelo:** Sonnet, esforço médio. Evento pequeno, com regras e números fechados, que segue o molde do clima e do texto de fim do dia.
