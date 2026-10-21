# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- Antes de programar, a sessão confirma com o usuário as **decisões em aberto** da etapa (cada uma já tem uma sugestão).
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data) e anota o que mudou no plano.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). **A 1d (editor do salão e Garagem) ainda está em discussão**: enquanto o usuário não decidir os níveis, a próxima é a 2. A 1b e a 2 podiam trocar de lugar. A 3 vem antes da 4, e a 4 antes da 6.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 0 | Contas: lucro, ingredientes, contas do dia, divulgação | v7 | feita (15/10) |
| 1a | Jogo justo: dá para não perder ninguém | v7.1 | feita (15/10) |
| 1b | Livro-caixa e ajuste fino com jogadores | v7.2 | feita (15/10) |
| 1c | Retorno do Renan: Bia mais ágil e selos da fila | v7.3 | feita (21/10) |
| 1d | Editor do salão, Garagem da Bia e área de espera lá fora | v7.4 | **em discussão** (proposta abaixo) |
| 2 | Manutenção e imprevistos | v8 | **próxima** (se a 1d não for decidida antes) |
| 3 | Pontos: área industrial e Avenida Brasil | v9 | a fazer |
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

## Etapa 1d — Editor do salão, Garagem da Bia e área de espera lá fora (v7.4) — em discussão
> Proposta de 21/10, refeita com as respostas do usuário no mesmo dia (texto original em `docs/PROPOSTAS.md`): o jogador **vê o salão e arruma as mesas e cadeiras como quiser**; o **nível do salão é o ponto** (cada nível é um lugar novo, com aluguel maior), e a 1d fica com o editor e o nível 1, a **Garagem**; os níveis 2 a 4 vão para as etapas 3 e 4. Nada no código até a decisão.

**Os 4 níveis do salão = os 4 pontos da carreira:**

| Nível | Ponto | Lugares | Aluguel por dia | Etapa |
|---|---|---|---|---|
| 1 | **Garagem da Bia e do tio Tonhão** | 16 | grátis (é da família) | 1d |
| 2 | **Lanchonete na área industrial** | 20 | sugestão: R$ 120 (o de hoje) | 3 |
| 3 | **Restaurante na Avenida Brasil** | sugestão: 26 | sugestão: R$ 220 | 3 |
| 4 | **Terraço Suíça** | 30 | sugestão: R$ 380 | 4 |

- O aluguel entra nas **contas fixas do dia** (com luz e gás, que continuam por mesa e por lugar), aparece na lojinha antes de decidir e no Caixa.
- A Garagem não paga aluguel porque é a casa da família: o **Tonhão é tio da Bia**, cozinheiro aposentado que topou voltar à ativa para apoiar o sonho da sobrinha (vale também para o Modo História, etapa 5).

**Entra na 1d:**
1. **Editor do salão (aba Salão da lojinha).** O jogador vê o salão desenhado e arrasta as mesas para onde quiser dentro da área útil (encaixe numa grade fina). Tocar numa mesa troca entre 2 e 4 lugares; uma bandeja ao lado guarda as mesas que não estão no salão. Contador sempre à vista ("Lugares 14 de 16 · Mesas 6"). Posição válida: dentro da área útil, sem encostar em outra mesa (folga para a Bia passar, como o `SALAO.gap`) e com caminho da Bia até cada mesa (`setObst`/`findPath` já funcionam com qualquer arranjo). Mesa em lugar inválido fica vermelha e volta ao soltar. Botões "Arrumação automática" e "Desfazer". Os números das mesas seguem a ordem no salão. Some a compra de cadeira avulsa, de mesa e a regra de 1 mesa de 4 por fileira.
2. **Arrastar a tela para ver o lado de fora.** O salão fica mais largo que a tela: arrastando o fundo, aparece a calçada, e o HUD fica fixo. Uma **setinha na borda** avisa quando uma cadeira de fora precisa de atenção. Vale durante o dia e no editor.
3. **Área de espera lá fora** (no lugar da fila de espera de hoje, na faixa da esquerda). Cadeiras na calçada onde os grupos **esperam mesa**; elas **não contam nos lugares**. Enquanto esperam, os grupos podem **pedir suco no totem**: o pedido vira um suco a entregar, e a Bia só leva até eles (sem anotar pedido). Daqui a área de espera cresce com os níveis e com enfeites: mesinhas, toldo e, nos níveis maiores, uma antessala ("foyer") com amenidades.
4. **Visual da Garagem:** portão de garagem aberto, piso de cimento queimado, letreiro feito à mão. Só paleta e detalhes, sem arte pesada.

**Decisões em aberto:**
- **Contas da Garagem:** sem os R$ 120 de aluguel, o dia rende ~R$ 120 a mais. Recalibrar as metas com o bot (sugestão) ou deixar mais folgado, já que a carreira passa a ter mudanças caras pela frente?
- **Totem de suco:** quem prepara (sugestão: sai pronto no balcão de sucos e entra na fila como "entregar suco"; com a Dani, ela pode preparar), quanto custa e se a água saborizada continua (ou vira um item da área de espera).
- **Arrastar o fundo × arrastar grupo:** hoje o grupo da fila é arrastado até a mesa. Sugestão: arrastar um grupo perto da borda rola a tela sozinho; tocar no grupo e depois na mesa continua valendo.
- **Editor:** posição livre com grade fina (sugestão) ou só encaixes; mesas só deitadas na primeira versão (sugestão).
- **Quantas cadeiras de espera** na Garagem (sugestão: 4, como a fila de hoje) e o que acontece com quem chega e não tem cadeira (hoje: espera na porta, `PORTA`).
- **Save da v6/v7:** sugestão: quem comprou cadeiras e mesas recebe de volta o que gastou no salão (no dinheiro e numa linha do Caixa) e começa na Garagem com o arranjo automático.
- Tamanho: provavelmente 2 sessões: (1) save, Garagem, contas e editor; (2) rolagem da tela, área de espera e totem.

**Partes:** `10-constantes.js` (`SALAO`, `PONTOS` com a Garagem, área útil, `CONTAS`), `11-base.js` (`setObst`, caminhos até a calçada), `12-clientes.js` (`normSalao`: lista de mesas com `x`, `y` e lugares; espera lá fora, pedido no totem), `16-jogo.js` (rolagem, validação, contas), `21-cenario.js` e `22-salao-hud.js` (Garagem, calçada, totem, setinha da borda), `23-render.js` (deslocamento da câmera, HUD fixo), `41-lojinha.js` (editor), `43-telas.js` (entrada: arrastar o fundo, tela → mundo), `tests/bot.js`. **Testes:** rever o `smoke8` e criar o `smoke13` (posição válida e inválida, caminho até cada mesa, limites, save antigo, rolagem e toque com a tela deslocada, espera e totem); `balance.js` e `carreira.js` com a Garagem; capturas em 960×600 e 740×360.

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

## Etapa 3 — Pontos: área industrial e Avenida Brasil (v9)
**Objetivo:** primeira decisão grande de dinheiro: **mudar de ponto** é subir o nível do salão (ver a tabela da etapa 1d). Mecânica genérica de `PONTOS`, que a etapa 4 só completa com o Terraço Suíça.

**Entra:**
- `PONTOS`: Garagem (1d), **Lanchonete na área industrial** (nível 2, 20 lugares) e **Restaurante na Avenida Brasil** (nível 3, ~26 lugares). Cada um com aluguel por dia (nas contas fixas), multiplicador do preço do cardápio, mistura de clientes (área industrial: mais entregadores e trabalhadores com pressa; Avenida Brasil: mais executivas, famílias e VIPs), chance de VIP, área útil, área de espera lá fora e custo de mudança.
- **Mudança** na lojinha (aba nova "Ponto" ou dentro da aba Salão): custo único (reforma + caução) e aluguel maior dali em diante. O editor do salão (1d) abre no ponto novo com o arranjo automático.
- Visual de cada ponto: piso, fachada, letreiro, vista da janela e a calçada (toldo, mesinhas da espera). Só paleta e detalhes.
- Metas por ponto: a mesma meta de lucro com multiplicador por ponto, ou metas próprias calibradas com o bot.

**Fora:** Terraço Suíça, VIP exigente e modo história.

**Partes:** `10-constantes.js` (`PONTOS`), `12-clientes.js` (save `ponto`, preço), `16-jogo.js` (agenda, contas), `20/21-*.js` (paleta, fachada e calçada de cada ponto), `41-lojinha.js`.

**Testes:** `smoke14` (mudança, custo, aluguel nas contas, arranjo no ponto novo, preços e clientela por ponto, save antigo = Garagem). `carreira.js` com mudança no dia 3 ou 4.

**Calibração:**
- Mudar de ponto deve compensar em ~3 dias para quem atende bem e não compensar para quem perde muitos clientes.
- No dia 5, o jogador deve ter que escolher entre a mudança e (equipe + melhorias).

**Decisões em aberto:**
- A mudança é permanente ou dá para voltar?
- As metas da carreira mudam com o ponto ou ficam fixas (aí o ponto melhor vira atalho para estrelas)?
- Custos de mudança e aluguéis (a tabela da 1d é sugestão).

---

## Etapa 4 — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (30 lugares): aluguel alto, preços +45%, VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera.
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
