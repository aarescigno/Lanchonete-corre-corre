# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- Antes de programar, a sessão confirma com o usuário as **decisões em aberto** da etapa (cada uma já tem uma sugestão).
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data) e anota o que mudou no plano.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). **A 1d-1 foi feita (v7.4); a próxima é a 1d-2** (decididas pelo usuário em 21/10; cada uma numa sessão). A 1b e a 2 podiam trocar de lugar. A 3 vem antes da 4, e a 4 antes da 6.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 0 | Contas: lucro, ingredientes, contas do dia, divulgação | v7 | feita (15/10) |
| 1a | Jogo justo: dá para não perder ninguém | v7.1 | feita (15/10) |
| 1b | Livro-caixa e ajuste fino com jogadores | v7.2 | feita (15/10) |
| 1c | Retorno do Renan: Bia mais ágil e selos da fila | v7.3 | feita (21/10) |
| 1d-1 | Garagem da Bia, móveis e editor do salão | v7.4 | feita (21/10) |
| 1d-2 | Tela que rola até a calçada, espera lá fora e máquina de suco | v7.5 | **próxima** (decidida em 21/10) |
| 2 | Manutenção e imprevistos | v8 | a fazer |
| 3 | Pontos: área industrial e Avenida Brasil, carreira por pontos | v9 | a fazer |
| 4 | Terraço Suíça e VIPs exigentes | v10 | a fazer |
| 5 | Modo História, parte 1: estrutura e primeiros capítulos | v11 | a fazer |
| 6 | Modo História, parte 2: subir de ponto, crítico do guia e final | v12 | a fazer |
| 7 | Polimento: celular, ranking da história, ajuste geral | v12.1 | a fazer |

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

---

## Etapa 3 — Pontos: área industrial e Avenida Brasil, carreira por pontos (v9)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d.

**Entra:**
- `PONTOS` ganha a **Lanchonete na área industrial** (nível 2: 20 lugares, aluguel R$ 120, mudança R$ 800) e o **Restaurante na Avenida Brasil** (nível 3: 24 lugares, aluguel R$ 400, mudança R$ 2.000). Cada um traz:
  - multiplicador do cardápio (sugestão: ×1 e ×1,4);
  - mistura de clientes (área industrial: trabalhadores com pressa e entregadores; Avenida Brasil: executivas, famílias e mais VIPs);
  - área útil, cadeiras de espera e visual próprios.
- **Mudança** na lojinha (aba "Ponto"): custo único, aluguel dali em diante e os móveis levados junto. O editor abre no ponto novo com a arrumação automática.
- **O que cada ponto destrava** (sugestão):
  - área industrial: 2º garçom, +1 boca no fogão (4 pratos ao mesmo tempo) e balcão de pratos com 5 vagas;
  - Avenida Brasil: confeiteiro (sobremesas), balcão de coquetelaria com profissional de drinks, um prato novo no cardápio e balcão de pratos com 6 vagas.
  Se ficar grande demais, a etapa se divide (3a: mudança e área industrial; 3b: Avenida Brasil, confeitaria e coquetelaria).
- **Carreira por pontos, sem fim fixo:** cada ponto tem uma série de metas (ex.: 3 a 5 dias). Batidas as metas e juntado o dinheiro, pode mudar. O ranking da carreira soma o lucro (ou o melhor dia) de cada ponto. Os 7 dias de hoje viram a série da Garagem.
- Visual de cada ponto: piso, fachada, letreiro, vista da janela e calçada.

**Fora:** Terraço Suíça, VIP exigente e modo história.

**Partes:** `10-constantes.js` (`PONTOS`, metas por ponto, equipe nova), `12-clientes.js` (save `ponto`, preço), `13-cozinha.js` (bocas, balcão, sobremesa), `15-dani.js`/novo ajudante (2º garçom), `16-jogo.js` (carreira por pontos, contas), `20/21-*.js` (visual), `30-ranking.js`, `41-lojinha.js` (aba Ponto), `42-resultados.js`.

**Testes:** `smoke15` (mudança, custo, aluguel nas contas, móveis levados, preços e clientela por ponto, destravados, carreira por pontos, save antigo = Garagem). `carreira.js` com mudança.

**Calibração:**
- Mudar de ponto deve compensar em ~3 a 5 dias para quem atende bem e não compensar para quem perde muitos clientes.
- O jogador deve ter que escolher entre mudar e (equipe + melhorias + móveis).

**Decisões em aberto:** a mudança é permanente ou dá para voltar; quantos dias tem a série de cada ponto; como o ranking soma os pontos; o que cada destravado custa.

---

## Etapa 4 — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera. Confeiteiro e coquetelaria continuam disponíveis.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Reputação do ponto** (0 a 5 ★, média móvel dos últimos dias): no Terraço ela muda a freguesia do dia, e na etapa 6 vira a régua do guia. Mais tarde pode virar uma das partes do **nível de luxo** (ver Ideias guardadas).
- Um item de lojinha do Terraço, por exemplo "Louça fina": prato especial mais rápido.

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `22-salao-hud.js` (balão do pedido especial).

**Testes:** `smoke15` (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` no Terraço Suíça com equipe completa.

**Calibração:**
- O Terraço dá mais lucro só com equipe completa + Tonhão nível 3 + salão bem montado.
- Para quem não está pronto, é um passo arriscado: lucro abaixo da Avenida Brasil.

**Decisões em aberto:**
- A reputação aparece já na carreira ou só no modo história (sugestão: aparece só a partir do Terraço)?
- O que o exigente usa para se distinguir visualmente.

---

## Etapa 5 — Modo História, parte 1 (v11)
**Objetivo:** "o sonho da Bia de ter um restaurante estrelado, começando do zero". A estrutura do modo e os primeiros capítulos, usando só o que já existe (Bairro).

**Entra:**
- Botão **História** no menu, ao lado de Carreira e Turno sem fim. Save próprio (`save.historia`), sem mexer na carreira.
- **Começo do zero:** a Bia abre a lanchonete na **garagem de casa**, com pouco dinheiro, 3 mesas e sem equipe. O **tio Tonhão**, cozinheiro aposentado, volta à ativa para apoiar o sonho da sobrinha e aceita trabalhar "pelo prato do dia". Uma dívida pequena de abertura (empréstimo do Seu Zé) se paga aos poucos.
- **Capítulos:** cada um tem alguns dias, um objetivo (lucro acumulado, reputação, contratar alguém, quitar a dívida) e um cartão de conversa curto antes e depois (Bia, Tonhão, Seu Zé, Dani), com 2 a 4 falas em balões sobre o cenário.
  - Cap. 1, "A esquina": 3 dias, aprender o ciclo e fechar no azul.
  - Cap. 2, "A Dani chega": contratar a Dani e quitar metade da dívida.
  - Cap. 3, "Casa cheia": bater a meta com panfletos e um dia de redes sociais.
- Os dias da história reaproveitam `DAYS` com ajustes por capítulo: `HISTORIA = [{ cap, titulo, dias:[...], objetivo, falas }]`.
- Tom: leve e otimista. O "universo paralelo em que meritocracia é possível" pode ser uma piscadela no texto de abertura, se o usuário quiser.

**Fora:** troca de ponto na história, crítico do guia e final.

**Partes:** `02-telas.html` (menu e painel de conversa), `10-constantes.js` (`HISTORIA`), `16-jogo.js` (modo `historia`, objetivos), `40-interface.js`, `42-resultados.js`, `43-telas.js`.

**Testes:** `smoke16` (início do zero, objetivo cumprido e falhado, save separado, carreira intocada). O bot joga os capítulos 1 a 3.

**Decisões em aberto:**
- O texto de abertura e o tom do "universo paralelo".
- Quem é o Seu Zé na história (dono da lojinha e credor?).
- Falha num capítulo: repetir o dia (sugestão) ou o capítulo inteiro?

---

## Etapa 6 — Modo História, parte 2 (v12)
**Objetivo:** a escada até a estrela.

**Entra:**
- **Capítulos de mudança:** a área industrial e a Avenida Brasil (cap. 4 e 5) e o Terraço Suíça (cap. 6), com objetivos de reputação e de lucro, usando os pontos das etapas 3 e 4.
- **O crítico do guia:** um guia gastronômico **inventado**, por exemplo "Guia Garfo de Ouro". Não usar "Michelin" nem outra marca real.
  - No capítulo final, um cliente disfarçado aparece em dia sorteado.
  - Atendê-lo com 5 corações, prato caprichado e mesa limpa conta para a avaliação.
- **Final:** a avaliação junta reputação, lucro e o atendimento do crítico, e dá de 0 a 3 garfos/estrelas, com cena final (falas) e créditos curtos. Rejogar o final para tentar mais estrelas.
- Selo do resultado no menu (ex.: "★★ no Garfo de Ouro").

**Partes:** as da etapa 5, mais `12-clientes.js` (crítico disfarçado, sem sinal óbvio, talvez um caderninho) e `22-salao-hud.js`.

**Testes:** `smoke17` (aparição do crítico, avaliação, finais). O bot termina a história.

**Decisões em aberto:**
- Nome do guia.
- O crítico pode ser reconhecido (pista sutil) ou é surpresa total?
- Quantas estrelas possíveis (sugestão: 3).

---

## Etapa 7 — Polimento (v12.1)
- Celular: "Como jogar" sem rolar no celular deitado; lojinha sem rolar no 568×320 (pendências antigas do `RESUMO.md`). Testar som e toque num aparelho real.
- **Ranking da história:** coleção nova (ex.: `ranking-historia`) exige mudar as capacidades do artifact (passar `capabilities` com a regra nova). Fazer só com o OK do usuário.
- Revisão geral de equilíbrio com `carreira.js` e com o retorno dos jogadores. Revisar textos do "Como jogar" para os sistemas novos.

---

## Ideias guardadas (sem etapa ainda)
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
- Equipamento melhor no lugar da manutenção (fogão industrial etc.).
- Mais funcionários: um segundo garçom, além da Dani.
- Eventos de bairro: festa junina, jogo do Brasil.
- **Nível de luxo** (0 a 5, bem para frente, depois de tudo o que está na fila; pedido do usuário em 21/10): a soma dos enfeites (decoração da área de espera e do salão), da localização (ponto), do impacto da mídia (divulgação), da avaliação de críticos surpresa e de outras coisas a ponderar. A progressão seria parecida com a de subir de nível de um personagem por atributos (o usuário citou o sistema do Kratos em God of War Ragnarök como referência; na interface, sem citar o jogo).
