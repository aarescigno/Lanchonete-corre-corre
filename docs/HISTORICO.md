# Histórico do projeto (conversa no Claude, 13–14/10/2026, horário de Brasília)

## 13/10/2026, 18:08: pedido inicial
**Pedido:** "faça uma cópia de diner dash em HTML, pode usar agentes, mas use recursos conscientemente (agentes sonnet/haiku, coordenados por opus)".

**Decisões:**
- Fazer um jogo original no mesmo gênero, sem copiar nome, personagens nem arte do Diner Dash: "Lanchonete Corre-Corre", com a garçonete Bia e o Chef Tonhão, numa lanchonete brasileira de esquina dos anos 70–80.
- Divisão do trabalho: o coordenador (Opus) escreveu a especificação (`docs/spec-v1.md`) e um único agente Sonnet implementou e testou. O Haiku não foi usado, porque não havia tarefa de busca simples.

**Resultado:** v1 publicada como artifact (Versão 1).
- Arquivo de cerca de 102 KB.
- Um bot jogou os 7 dias sem erros.
- Os testes lógicos não tiveram falhas.

## 14/10/2026, 08:10: revisão com base no clone
**Pedido:** "Revise seu trabalho com base nesse clone, mas não descarte essa primeira versão, ao contrário, mantenha histórico de versões salvas". Veio anexado o zip `Diner-Dash-Clone-master` (Java/Swing, projeto acadêmico KFUPM ICS-201, com enunciado em PDF).

**O que o clone tem e foi aproveitado:**
- Cor por pedido: mesa, comanda e prato na mesma cor, com um pool de cores devolvidas ao sair. Virou as comandas coloridas, com 6 cores distintas das cores de cadeira, sempre acompanhadas do número da mesa.
- Humor por cor (verde, amarelo, vermelho). Virou um aro de humor derivado dos corações.
- Tapete cheio: o restaurante não aceita mais clientes. Virou "Lotado!", sem multa na carreira e com perda de estrela no Turno sem fim.
- Leaderboard com ordenação por nome ou pontuação, crescente ou decrescente, e melhor pontuação por jogador. Virou um ranking compartilhado no db do artifact, com fallback local.
- O enunciado cita o modo de sobrevivência do jogo original. Virou o modo "Turno sem fim".

**Do clone que não foi adotado:**
- Selecionar a garçonete antes de cada clique, porque a fila de ações da v1 é mais fluida.
- Movimento sem animação.
- Partida única de 10 minutos.

**Execução:**
- A v1 foi preservada em `versoes/`.
- O coordenador escreveu `docs/spec-v2.md` e um agente Sonnet editou o arquivo no lugar.
- Testes: 120/120 no smoke3, bot nos 7 dias e capturas conferidas.

**Resultado:** v2 publicada no mesmo endereço (Versão 2, rótulo "v2 — revisão com base no clone"). A v1 continua acessível pelo menu Versões. O ranking compartilhado foi conferido vazio após a publicação, e a regra de acesso foi checada no nível de leitura.

## 14/10/2026, 08:21
**Pedido:** exportar tudo para continuar no Claude Code. Este pacote é essa exportação.

## 14/10/2026: continuação no Claude Code
**Pedido:** "bora dar continuidade nisso aqui". O pacote exportado foi importado no repositório `aarescigno/Lanchonete-corre-corre`. Os testes da v2 passaram, e o usuário escolheu os **clientes VIP** entre as ideias pendentes.

**Decisões:**
- O VIP é um modificador de grupo, não um tipo novo. Assim continua valendo a variedade visual dos tipos existentes. O entregador ficou de fora, porque com paciência ×0,75 seria impossível.
- O VIP fura a fila (a mecânica que o torna visível e diferente), e o risco e a recompensa vêm da paciência menor, da gorjeta maior, do bônus com 5♥ e da multa dobrada.
- A identificação não depende só da cor: óculos escuros e plaquinha com o texto "VIP".
- A v2 foi guardada em `versoes/v2-fonte.html` e `versoes/v2.html`.

**Resultado:** v3 no repositório. O smoke4 passou 23/23 e os demais testes continuam verdes. A meta do dia 7 caiu para R$ 1300, depois do balanceamento com o bot.

## 14/10/2026: publicação da v3
**Pedido:** "pode publicar no artifact, deixe o acesso a versões anteriores de forma menor no menu, como um ícone no canto inferior direito do menu principal para 'versões anteriores'".

**Feito:**
- O link "Versões" saiu do painel do menu e virou um botão redondo discreto, com ícone de relógio e seta, no canto inferior direito da tela do menu (sobre a barra escura). Ele tem `title` e `aria-label` "Versões anteriores".
- A versão publicada estava idêntica a `versoes/v2-fonte.html`.
- A v3 foi publicada no mesmo endereço (Versão 3, rótulo "v3 — clientes VIP"), junto com `versoes/v2.html`. A `versoes/v1.html` e as regras do ranking foram mantidas.

## 14/10/2026: menu sem rolagem e v4
**Pedidos:**
- "ideal seria otimizar para não ter barra de rolagem no menu principal". No celular deitado, o painel ficou mais largo, o título passou para 1 linha e os 4 botões para uma fileira só. O teste `tests/menu_fit.py` confere 14 tamanhos de tela.
- "agora faz o balcão de sucos e o upgrade de bandeja para poder levar 2 pratos ou 3 bebidas em uma das mãos, a outra mão ainda leva 1 item só".

**Decisões da v4:**
- O balcão de sucos divide a bancada com o cafezinho, porque a coluna da cozinha não tinha espaço para uma quinta estação. As duas metades têm o mesmo ponto de parada da Bia.
- O suco é pedido junto com a comida e vale até a conta. Tocar na mesa entrega os sucos junto com a outra ação daquele toque, para não exigir um toque extra.
- Sem o suco, a conta custa 1 coração. A penalidade é leve e não tira o cliente.
- Na bandeja, cafezinho e suco contam como bebidas; comanda e louça suja ocupam uma mão inteira.
- Com os sucos, o bot perdeu mais clientes nos dias 4 a 7. Primeiro o bot foi melhorado (busca vários sucos de uma vez); depois o preço do copo subiu para R$ 12, a frequência ficou em 30% e as metas foram recalibradas (ver `docs/spec-v4.md`).
- A v3 foi guardada em `versoes/v3-fonte.html` e `versoes/v3.html`.

## 14/10/2026: regras da bandeja e das comandas
**Pedido:** "a bandeja pode transportar 1 prato e 1 suco, 1 prato e um café ou 2 pratos ou 3 sucos ou 3 cafés ou 2 pilhas de louças sujas ou qualquer quantidade inferior a essas citadas. bandeja não pode carregar coisas sujas com coisas limpas, mas na bandeja pode ter coisas limpas enquanto na mão tenha coisas sujas. papel de pedido só pode ir na mão sem bandeja, com limite do numero de slots atuais da cozinha, que atualmente é 3, mas pode receber upgrade no futuro".

**Decisões:**
- Cafezinho e suco podem ir misturados nas 3 bebidas da bandeja.
- Sem o upgrade da bandeja, as comandas também empilham numa mão (até 3), já que as duas mãos são "mãos sem bandeja".
- Com as regras novas o jogo ficou mais fácil do que a primeira v4, e as metas da v3 voltaram (ver `docs/spec-v4.md`).

## 14/10/2026: v5, Equipe
**Pedido:**
- A proposta anterior (`docs/spec-v5.md` traz o histórico) sugeria robôs para o lixo e a louça. O usuário não quer robôs: as funções precisam de pessoas contratadas.
- A Dani pode fazer o que a Bia faz, mas só serve café, retira prato sujo, lava pratos e tira o lixo. A Bia escolhe as tarefas dela.
- Níveis da Dani: 50% da velocidade e 2 tarefas; depois salário +50% e 65%; no máximo, mais +50% de salário, 80% e 3 tarefas.
- Sai a Jukebox (poluição sonora) e entra a água saborizada.
- O couvert ganha a opção de cobrar taxa dos clientes, com eficácia 10% menor.

**Decisões tomadas sem resposta explícita (recomendações da proposta):**
- Salários saem do cofre ao abrir a lanchonete.
- Tudo numa v5 só.
- "Eficácia −10%" foi lido como relativo: o efeito de 20% vira 18%.
- A Dani anda mais devagar, mas lava na mesma velocidade da Bia (1,5 s por pilha).

## 14/10/2026: ajustes da v5
**Pedido:**
- Tirar o "cofre": o salário sai do total de dinheiro acumulado, debitado no início do dia, sem contar com a entrada do dia.
- Lixo cheio com café na mão não tinha como ser esvaziado: nesse caso a lixeira aceita o que está na mão (menos pratos) uma última vez e é esvaziada logo em seguida.
- A Dani lava mais devagar que a Bia, na mesma proporção do deslocamento.

**Decisões:**
- O dinheiro acumulado recebe 100% do faturamento.
- As comandas também ficam na mão, como os pratos, porque jogá-las fora faria a mesa perder o pedido.

## 14/10/2026: sem equipe tem que ser quase impossível
**Pedidos:**
- A Bia só esvazia a lixeira com as duas mãos vazias, ou com bebidas na última leva.
- Sem contratar, completar os 3/4 finais do jogo deve ser quase impossível (~10%). Se preciso, criar mais níveis.

**Decisões:**
- Não foi preciso criar dias novos. O que separou "sozinha" de "com equipe" foi a louça (3 pratos limpos, 2,5 s por pilha) e a lixeira (6 itens, cheiro de 30%), justamente o trabalho da Dani, mais o movimento maior nos dias 3 a 7.
- As metas ficaram perto do percentil 90 de quem joga sozinho.
- Ver `docs/spec-v5.md`.

## Alterações feitas no Claude Code (14/10/2026)
1. **Importação** do pacote exportado do claude.ai para o repositório (commit `982583b`).
2. **v3, clientes VIP** (`3d93bdb`):
   - aparecem a partir do dia 5 e no Turno sem fim (depois de 1 min);
   - furam a fila e têm paciência ×0,75;
   - gorjeta +50% e bônus de R$ 40 com 5♥; bravos, multa dobrada;
   - óculos escuros e plaquinha "★VIP".
3. **Teste instável do smoke2 corrigido** (`ce4fb87`, PR #1): um grupo esquecido na fila saía bravo durante a cobrança.
4. **Menu:**
   - "Versões anteriores" virou um ícone (relógio com seta) no canto inferior direito do painel do menu (`4d26956`, `97c3ab8`);
   - o menu deixou de rolar no celular deitado: `@media (max-height:460px)` com painel mais largo, título em 1 linha e 4 botões numa fileira (`3e522ae`, teste `tests/menu_fit.py`).
5. **v4, balcão de sucos e bandeja** (`6981e42`, `4741e81`):
   - **Balcão de sucos:** divide a bancada com o cafezinho. Do dia 3 em diante, ~30% dos grupos pedem de 1 copo até o número de pessoas. Cada copo vale R$ 12 e cada entrega devolve 1♥. Conta paga sem o suco: −1♥.
   - **Mãos:** comandas só na mão sem bandeja, todas juntas, até `kitchen.slots` (3). Fora isso, 1 item por mão.
   - **Bandeja (R$ 220):** 1 prato + 1 bebida, 2 pratos, 3 bebidas ou 2 pilhas de louça (ou menos). Sujo nunca junto com limpo; a outra mão pode levar louça suja.
   - **Metas:** iguais às da v3 (o bot bate a meta em 92 a 97% das vezes nos dias 4 a 7).
   - "Como jogar" em duas colunas.
6. **Lixeira** (pedido em comentário no artifact): no chão, ao lado do balcão; a Bia joga fora as bebidas que sobraram, com multa de metade do valor de cada uma (suco R$ 6, cafezinho R$ 2,50). Detalhes em `docs/spec-v4.md`.
7. **Lojinha antes de cada dia**: do dia 2 em diante, escolher o dia (ou repetir) abre a lojinha primeiro, com "Começar o dia N" e "Menu principal"; ainda 1 melhoria por dia. O fim do dia oferece "Melhorias e dia N+1" e "Menu principal".

8. **v5, Equipe** (ver `docs/spec-v5.md`):
   - **Economia (sem "cofre"):** todo o faturamento vai para o dinheiro acumulado; a folha é debitada dele no início do dia.
   - **Lojinha** com abas Melhorias e Equipe.
   - **Tonhão:** aumento de 3 para 4 e 5 bocas, com +R$ 40 e +R$ 90 por dia.
   - **Dani, a ajudante (sem robôs):** níveis com 50%, 65% e 80% da velocidade da Bia e 2, 2 e 3 tarefas, por R$ 60, R$ 90 e R$ 135 por dia. Tarefas escolhidas na lojinha: lixo, pratos sujos, lavar louça e cafezinho.
   - **Louça:** limitada a partir do dia 3; lavar leva 1,5 s por pilha; sem prato limpo, o Tonhão espera.
   - **Lixeira:** enche (8 itens); cheia, o cheiro acelera a impaciência; esvaziar leva 2 s. Se as bebidas da Bia não cabem, a lixeira aceita todas uma última vez e ela esvazia em seguida.
   - **Dani lava** no mesmo ritmo do deslocamento (50%, 65% ou 80% da Bia).
   - **Couvert artístico:** R$ 80 por dia, paciência nas mesas −20%; com a taxa de R$ 3 por pessoa, −18%.
   - **Água saborizada:** substitui a Jukebox.
   - **Sem equipe é quase impossível:** mais grupos nos dias 3 a 7, 3 pratos limpos, lavar 2,5 s por pilha e lixeira de 6. Metas dos dias 3 a 7: R$ 1300, 1300, 1440, 1440 e 1500. Sem equipe, ~5% das metas nos dias 4 a 7; com equipe, ~80% a 90%.
   - **Lixeira:** a Bia só esvazia com as mãos vazias (ou só com bebidas, na última leva).
   - **Água saborizada com doses:** jarra de 12 doses, 1 por pessoa na fila; recarregar custa R$ 15 (1 a 2 vezes por dia).
   - **Dani lava sem limite de pilhas:** 1 pilha por vez, só o tempo conta.
   - **Revisão das melhorias** (análise com o bot, em `docs/spec-v5.md`): água com efeito de 40% e recarga pela Dani; Tonhão sem bocas a mais, com aumento que cozinha mais rápido, faz prato caprichado ★ e lava 1 pilha a cada 7 s ou 4 s; VIP pede prato especial; Chapa nova virou Jogo de pratos (+1 prato limpo); ventilador tira o cheiro da lixeira; taxa do couvert corta o efeito pela metade. Metas dos dias 3 a 7: R$ 1400, 1300, 1480, 1500 e 1650.
   - **Lojinha no celular em pé:** as tarefas da Dani invadiam o card do couvert; com a tela até 600 px de largura (e mais de 460 px de altura), elas ficam em 1 coluna e o botão "Cobrar couvert" fica menos arredondado.
   - **Lojinha, aba Equipe:** a tarefa Água só aparece (e só ocupa vaga) com a Água saborizada comprada; antes de contratar a Dani, o card lista o que ela pode fazer, sem os botões de tarefa. Tonhão e Dani mostram um quadro "agora → próximo nível" (rapidez, ★, pia e diária do Tonhão; velocidade, tempo por pilha, tarefas e diária da Dani) e, no nível máximo, os valores atuais. Os botões viraram "Aumento", "Contratar" e "Promover", porque o preço está no quadro.
   - **Dani tem 2 mãos:** no máximo 2 itens por vez (`DANI_HANDS`); cada pilha de louça (a de uma mesa) ocupa 1 mão, como na Bia. O card de contratação diz isso, e o `smoke6` confere com o bot jogando dias inteiros.
   - **Toque no celular:** no celular deitado o salão fica em ~0,55 a 0,65 da escala, e a lixeira, a jarra de água, cada prato pronto e os ícones da fila tinham de 26 a 30 px na tela (o mínimo confortável para o dedo é ~44 px).
     - No dedo (não no mouse), um toque que cai fora de tudo vai para o alvo mais próximo a até ~14 px de tela (`touchPad` → `Game.pickAt`). O acerto exato vence a folga, então café e suco continuam separados.
     - Um tremido de até ~14 px ao tocar um grupo da fila seleciona em vez de virar arrasto, e um arrasto solto rente à mesa senta o grupo.
     - Pratos: vale a coluna inteira do balcão; numa coluna vazia, vale o prato pronto mais perto.
     - Ícones da fila e os botões de pausa e de som pegam a faixa toda, até a borda de baixo.
     - **Sinal do toque:** cada ação aceita faz o som de toque e um brilho só no desenho do objeto tocado (estação, mesa, prato, grupo da fila ou botão), sem halo em volta, que some em 0,4 s (`glowSprite`: o objeto vai para uma camada à parte e uma cópia é somada por cima com `lighter`). Um toque no vazio mostra só um anel fraco no ponto. O `smoke7` confere tudo isso.
   - **Pia em 2 etapas:** com louça na mão, a Bia só deixa a louça na pia; tocando de novo, sem louça na mão, ela lava. Só 1 pessoa lava por vez (a Bia ou a Dani); o Tonhão lava à parte. O bot dá os 2 toques e não manda lavar enquanto a Dani lava; o equilíbrio não mudou (`balance` sem equipe e com a Dani lavando).

9. **v6, Salão** (ver `docs/spec-v6.md`), a pedido do usuário (só 1 mesa de 4 lugares e várias famílias de 4 esperando):
   - aba Salão na lojinha, com a planta das 2 fileiras e os botões 2 e 4 em cada mesa;
   - 2 cadeiras por R$ 60 (até 24) e mesa nova por R$ 300 (a 7 em cima, a 8 embaixo, abertas todo dia);
   - numa fileira com 4 mesas, só 1 cabe com 4 lugares;
   - não conta no limite de 1 melhoria por dia;
   - teste `smoke8`.
   - **Estrelas:** a 2ª estrela vem na metade do caminho entre a meta e a expert (`bomGoal`). Antes quase nunca saía, porque quem batia a expert levava 3. A 3ª continua sendo a expert sem perder ninguém.
   - A pergunta-lembrete a cada alteração saiu do `CLAUDE.md`, a pedido do usuário.
   - **Dani e o cafezinho** (15/10, a pedido do usuário): ela serve café a quem perdeu pelo menos 1 coração (≤4, antes ≤3) e, com 1 pilha de louça na mão, pega o café no caminho da pia, deixa a louça (sem lavar) e vai servir. Assim usa as 2 mãos 4 a 5 vezes a cada 10 dias (antes ~1), e o teste "a Dani chega a 2 itens" do `smoke6` deixou de oscilar. O equilíbrio não mudou (`balance` com a Dani nível 3 em pratos, lavar e cafezinho: 304/400 → 307/400 metas nos dias 3 a 7).

10. **v7, Contas** (ver `docs/spec-v7.md`), a partir do retorno do Renan Martorelli ("no dia 5 tenho dinheiro de sobra pra fazer tudo"):
   - **Meta em lucro:** faturamento − ingredientes − contas − folha − divulgação. O dia começa no vermelho no HUD.
   - **Ingredientes:** 60% da conta de cada prato quando fica pronto; R$ 5 por suco entregue.
   - **Contas do dia:** aluguel R$ 120 + R$ 30 por mesa aberta + R$ 6 por lugar.
   - **Divulgação** (aba nova na lojinha, do dia 3 em diante): boca a boca (grátis, 60–90% dos grupos), panfletos (R$ 40, 100%), redes sociais (R$ 100, 120% e mais VIPs).
   - **Menos grupos na base** nos dias 3 a 7 (13, 15, 16, 16, 17), porque o gargalo é atender e mais gente só trazia multas; metas recalibradas pelo lucro.
   - Bot na carreira: dinheiro antes do dia 5 caiu de R$ 3.410 (v6) para R$ 1.319. Testes `smoke9` e `carreira.js`.
   - Ficaram para depois: escolher o ponto (bairro, centro, área nobre) e o modo história.

11. **v7.1, Jogo justo** (ver `docs/spec-v7.1.md`; etapa 1a do `docs/PLANO.md`), a partir do áudio do Renan ("o jogo parece injusto"):
   - **Medição:** `balance.js` mostra as perdas por causa. Com a equipe, a maior parte não era a fila, e sim a espera pelo prato (louça em uso e prioridade do bot); na fila, eram famílias sem mesa de 4.
   - **Bot afiado** (`BOT=afiado`): uma ação por vez, a mais urgente; senta qualquer grupo da fila, serve cafezinho e lava quando faltam pratos.
   - **Fila justa:** sem mesa que sirva (mesa suja conta como mesa que serve), a paciência na fila corre a 40% e, na carreira, para em 1 coração com meia paciência. No Turno sem fim vale o ritmo, sem o piso (decisão do usuário).
   - **Porta:** com todas as mesas ocupadas e 3+ grupos na fila, a chegada espera até 8 s (até 20% do dia no total); o total de grupos não muda.
   - **Ícone "aguardando mesa"** na fila (mesa e relógio; azul e parado no piso).
   - Resultado: bot afiado com equipe e Jogo de pratos comprado primeiro, 0 perdidos em 94% dos dias 3 a 7. Metas e escassez sem mudança (dentro do ruído). Teste `smoke10`.

12. **v7.2, Livro-caixa** (ver `docs/spec-v7.2.md`; etapa 1b do `docs/PLANO.md`):
   - `save.caixa`: uma linha por dia da carreira (até 14), com faturamento, ingredientes, contas, folha, divulgação, lucro, meta, perdidos, compras e saldo. As compras da lojinha entram na linha do dia seguinte.
   - **Aba Caixa** na lojinha: tabela (mais novo em cima), barra "para onde foi o dinheiro" e **Copiar resumo** (texto para o WhatsApp; se o navegador não deixar copiar, mostra o texto para copiar à mão).
   - Ajuste fino: `INGRED.prato` 0,7 tirava só ~R$ 150 do bot até o dia 5 e deixava os dias 5 a 7 sem equipe abaixo do alvo; valores mantidos até chegar resumo de jogador (rodada de retorno dispensada pelo usuário). Teste `smoke11`.

13. **v7.3, Bia mais ágil** (ver `docs/spec-v7.3.md`; etapa 1c do `docs/PLANO.md`, retorno do Renan):
   - Velocidade de base 260 → 300 (`BIA_SPEED`); Tênis novos +10%; **Tênis de corrida** (R$ 350, +20%, pedem os Tênis novos e aparecem no lugar deles na lojinha, que continua com 6 cartões).
   - **Selos da fila:** etiqueta "1º, 2º..." na mesa, na estação ou no prato que está na fila da Bia (todas as vezes do mesmo lugar juntas), com pulinho ao surgir (parada com `prefers-reduced-motion`); os quadrinhos da fila ganham a mesma etiqueta. A mesa pode entrar 2 vezes na fila; cancelar só pelo quadrinho.
   - Metas mantidas por escolha do usuário (sem equipe ~74% das metas nos dias 3 a 7; com equipe ~98%). Teste `smoke12`.
   - Salão (decidido em 21/10): o nível do salão é o ponto.
     - Garagem da mãe da Bia (até a v7.4.2, "Garagem da Bia e do tio Tonhão"): 16 lugares, sem aluguel, kit de 10 lugares, móveis comprados, editor do salão (1d-1, feita na v7.4); tela que rola até a calçada, espera lá fora e máquina de suco (1d-2, v7.5).
     - Área industrial (20 lugares) e Avenida Brasil (24), com a carreira por pontos: etapa 3.
     - Terraço Suíça (28): etapa 4.
     - Aluguéis R$ 0, 120, 400 e 1.000 por dia (pesquisa em `docs/pesquisa-aluguel.md`).

14. **v7.4, Garagem** (ver `docs/spec-v7.4.md`; etapa 1d-1 do `docs/PLANO.md`):
   - `PONTOS` só com a Garagem (16 lugares, aluguel 0, área útil, 4 cadeiras de espera para a v7.5); `contasDia(tables, ponto)`.
   - Mesas compradas uma a uma na aba Salão: mesa de 2 R$ 150, mesa de 4 R$ 250, virar mesa de 4 R$ 100, vender pela metade; até 16 lugares; fora do limite de 1 melhoria.
   - Editor do salão (canvas próprio na lojinha): arrastar com encaixe de 10 px, lugar inválido em vermelho (volta ao soltar), tocar abre virar/vender, arrumação automática e desfazer; folga de 46 px entre mesas e caminho da Bia até cada uma.
   - Todas as mesas abertas desde o dia 1; dias 1 e 2 com 5 e 8 grupos; Turno sem fim com salão fixo de 16 lugares.
   - Visual: cimento queimado, portão de enrolar aberto, letreiro feito à mão, mesa quadrada de plástico de bar (a de 4 são 2 juntas) e cadeira de plástico com frisos verticais.
   - Save antigo: devolve cadeiras e mesas compradas, com linha no Caixa.
   - Sem equipe, ~97% das metas dos dias 3 a 7 (folga da Garagem, de propósito); R$ 1.455 na lojinha do dia 5. Com equipe, mesa a mais não dá lucro (gargalo nos pratos limpos): fica para a etapa 3.
15. **v7.5, calçada** (ver `docs/spec-v7.5.md`; etapa 1d-2 do `docs/PLANO.md`):
   - Câmera `Game.cam` de 0 (o salão, como antes) a `CALCADA.w` = 260 (a calçada e todas as mesas); o dia começa na calçada; HUD e abinhas fixos; a entrada chega em coordenadas da tela.
   - Rolagem: arrastar o fundo (só onde nenhum alvo pega o toque), abinhas "◀ Calçada" e "Salão ▶" (relógio e pratos prontos), grupo arrastado até a borda, 2 toques no grupo (vai ao salão), setas do teclado; instantânea com `prefers-reduced-motion`. A abinha da calçada pisca com suco pronto sem ninguém indo buscar ou alguém lá fora com 1 coração.
   - Espera: 4 bancos na calçada (`PONTOS.espera`), a freguesia vem da rua e volta para ela; cadeiras de fora não contam nos lugares. Toldo, vaso num banquinho de plástico e portão de enrolar na parede da esquerda.
   - Máquina de suco (R$ 180, no lugar da Água saborizada; quem tinha a água ganha a máquina): 2,5 s depois de sentar, 1 suco por pessoa no tablet; 3 s de preparo; a Bia pega todos os copos prontos que couberem e entrega grupo a grupo na mesma ação; +1 coração, espera 40% mais devagar, R$ 12 por copo na conta e R$ 5 de ingrediente; quem sai da espera cancela o que não foi pego. A tarefa da água da Dani virou "Levar o suco da espera".
   - Equilíbrio: a calçada não pesa (bot afiado sem a máquina igual à v7.4.4); o bot simples empata com a máquina; o afiado, que busca o suco em toda brecha, perde ~R$ 190/dia (a ida lá fora leva ~6 s). Dinheiro na lojinha do dia 5: ~R$ 1.500. Teste `smoke14`.
16. **v7.5.1, modo dev** (ver `docs/spec-v7.5.1.md`; pedido do usuário):
   - 10 toques seguidos no selo da versão ligam e desligam (e há "Sair do modo dev" no menu); o selo vira "v7.5.1 · dev" e a etiqueta "MODO DEV" fica no alto da tela, até no jogo. Sem painel à parte (2º retorno do usuário: "o jogo praticamente igual").
   - Save à parte (`lcc2_save_dev`; o de verdade fica guardado), 7 dias liberados, R$ 10.000 que a lojinha repõe; lojinha desde o dia 1, com as 7 melhorias ligadas e desligadas de graça, couvert e divulgação liberados; ranking de fora. Teste `smoke15`.
17. **v7.6, tela larga** (ver `docs/spec-v7.6.md`; retorno de jogador, proposta 1 escolhida pelo usuário):
   - Tela de 1220×600 (`TW`): o mundo da v7.5 inteiro à vista; `Game.cam` fixo em 260. Saem a rolagem, as abinhas, a borda e os 2 toques.
   - HUD espalhado (`HUDX`: fila de ações +130, mãos, pausa e som +260). Celular deitado do mesmo tamanho de antes; notebook e tablet um pouco menores; palco com a altura de antes nas telas estreitas (menu e lojinha sem apertar).
   - Equilíbrio igual ao da v7.5. Testes `smoke14` (refeito), `smoke2`, `smoke7`, `smoke12`; capturas `shot_v7_6.py`.

## Tabela de versões v1 a v8.9.1 (arquivada do RESUMO.md em 11/11/2026)
| Versão | Data | O que trouxe | Detalhes |
|---|---|---|---|
| v1 | 13/10 | carreira de 7 dias, fila de ações, mãos, corrente, bônus de cor, lojinha com 5 upgrades, som | `docs/spec-v1.md` |
| v2 | 14/10 | comandas coloridas, aro de humor, "Lotado!", Turno sem fim, ranking compartilhado, painel Versões | `docs/spec-v2.md` |
| v3 | 14/10 | clientes VIP | `docs/spec-v3.md` |
| v4 | 14/10 | balcão de sucos, bandeja, comandas empilhadas, lixeira | `docs/spec-v4.md` |
| v5 | 14/10 | equipe (Tonhão, Dani, couvert), louça limitada, lixeira que enche, água saborizada, renda de 30% | `docs/spec-v5.md` |
| v6 | 14/10 | aba Salão: cadeiras e mesas (até 8) compradas, 2 ou 4 lugares por mesa | `docs/spec-v6.md` |
| v7 | 15/10 | Contas: meta em lucro, ingredientes, contas do dia pelo salão aberto, divulgação (boca a boca, panfletos, redes sociais) | `docs/spec-v7.md` |
| v7.1 | 15/10 | Jogo justo: fila justa (ritmo 40% e piso de 1 coração sem mesa que sirva), porta que respeita a lotação, ícone "aguardando mesa", bot afiado e perdas por causa | `docs/spec-v7.1.md` |
| v7.2 | 15/10 | Livro-caixa: aba Caixa na lojinha (14 dias, para onde foi o dinheiro, "Copiar resumo" para o WhatsApp); valores da v7 mantidos | `docs/spec-v7.2.md` |
| v7.3 | 21/10 | Bia mais ágil (retorno do Renan): base 300 px/s, Tênis de corrida (R$ 350, +20%), selos "1º, 2º..." da fila no salão e nos quadrinhos; metas mantidas | `docs/spec-v7.3.md` |
| v7.4 | 21/10 | Garagem da Bia e do tio Tonhão: sem aluguel, kit de 10 lugares, mesas compradas até 16 lugares (R$ 150, 250, virar R$ 100, vender pela metade), editor do salão (arrastar, tocar, arrumação automática, desfazer), todas as mesas abertas desde o dia 1, mesa quadrada e cadeira de plástico de bar | `docs/spec-v7.4.md` |
| v7.4.1 | 21/10 | Salão cheio chama gente: `MOVIMENTO` (+6% de grupos por lugar acima de 10; mesas de 4 com equipe se pagam em 1 a 3 dias), 4 pratos limpos do dia 3 em diante, fila justa a 60% (era 40%), salão de 16 lugares do `balance.js` corrigido | `docs/spec-v7.4.1.md` |
| v7.4.2 | 21/10 | Balão de "aguardando o preparo" (retorno do usuário): panela no fogo (ícone `pot`) no lugar da comanda e do prato com anel; visto verde quando o prato está no balcão | `docs/spec-v7.4.2.md` |
| v7.4.3 | 21/10 | Cor das cadeiras (pedido do usuário): no balãozinho da mesa, no editor do salão, 4 bolinhas trocam a cor das cadeiras, de graça e com Desfazer | `docs/spec-v7.4.3.md` |
| v7.4.4 | 21/10 | Ambiente da Garagem (pedido do usuário): TV de tubo na Rede Esfera (R$ 15/dia de luz) e som na rádio Velha Brasil FM (R$ 10/dia), 5% de paciência nas mesas cada; couvert só do nível 3 do salão em diante (`PONTOS.nivel`, `couvertOk`) | `docs/spec-v7.4.4.md` |
| v7.5 | 21/10 | Calçada (etapa 1d-2): o mundo fica 260 px mais largo e a tela rola (arrastar o fundo no vazio, abinhas fixas no alto com o relógio e o aviso piscando, grupo na borda, 2 toques no grupo); espera lá fora com 4 bancos, tablet, toldo e vaso; Máquina de suco no lugar da Água (pedido no tablet, a Bia pega todos os copos que couberem e entrega grupo a grupo, R$ 12 na conta; a Dani pode levar) | `docs/spec-v7.5.md` |
| v7.5.1 | 21/10 | Modo dev (pedido do usuário): 10 toques no selo da versão ligam e desligam; sem painel à parte, o jogo fica igual com "Modo dev" na tela; save à parte (`lcc2_save_dev`), 7 dias, R$ 10.000 que a lojinha repõe, lojinha desde o dia 1 com melhorias de graça (liga e desliga), couvert e divulgação liberados; ranking de fora | `docs/spec-v7.5.1.md` |
| v7.6 | 22/10 | Tela larga (retorno de jogador: rolar fazia perder o controle): 1220×600, calçada, salão e cozinha juntos, sem rolar; HUD espalhado; no celular deitado, tudo do mesmo tamanho de antes | `docs/spec-v7.6.md` |
| v7.7 | 22/10 | Espera com a cara do nível (pedido do usuário): na Garagem, de pé numa faixa pintada no chão, e a Água da torneira (R$ 80, de graça na conta, pedida no balão e enchida na hora) no lugar da Máquina de suco (R$ 100 de volta para quem tinha); espada-de-são-jorge no vaso e na lata; `PONTOS.assento` e `BEBIDA_ESPERA` preparados para os níveis 2 a 4 | `docs/spec-v7.7.md` |
| v8 | 22/10 | Manutenção e imprevistos (etapa 2 do plano): fogão, geladeira e cafeteira se desgastam e quebram a partir do dia 4 (conserto na hora com a plaquinha; revisão na aba Manutenção da lojinha); chuva e feriado a partir do dia 3 | `docs/spec-v8.md` |
| v8.1 | 22/10 | Dinheiro comprometido (retorno do usuário): no alto da lojinha, o livre e o reservado para a folha e a divulgação (em vermelho quando falta); compra que faz algo ficar de fora no dia tem ⚠ e pede um 2º toque | `docs/spec-v8.1.md` |
| v8.1.1 | 22/10 | Menos balões nas mesas (retorno de jogador): só o cardápio com anel, o "!" e o "$"; esperando a comida e comendo, sem balão (saem a panela da v7.4.2 e o visto verde) | `docs/spec-v8.1.1.md` |
| v8.1.2 | 22/10 | Espera na ordem certa (retorno de jogador): o 1º da fila fica embaixo, no lugar 1, e quem chega depois fica acima; quando alguém sai, a fila desce | `docs/spec-v8.1.2.md` |
| v8.2 | 22/10 | Missão zero (pedido do usuário): o dia 0 é um treino com uma mesa só e 23 pop-ups do ciclo da Bia (cor da mesa, cardápio, pedido, Tonhão, prato, cafezinho e seus bônus, conta, louça, pia, lixo); paciência que não acaba, save de mentira, chip 0 no menu (escolhido para quem nunca treinou) | `docs/spec-v8.2.md` |
| v8.2.1 | 22/10 | Rejogar sem perder o dinheiro (pedido do usuário): Reiniciar ou Menu na pausa fecham as contas da parte jogada (contas, folha e divulgação proporcionais ao tempo; o resto da folha volta), com linha "interrompido" no caixa; não conta como dia jogado | `docs/spec-v8.2.1.md` |
| v8.2.2 | 22/10 | Só o dia completo rende (pedido do usuário, no lugar da regra da v8.2.1): folha e divulgação ficam reservadas ao abrir e saem no fim do dia, com contas e ingredientes; Reiniciar ou Menu na pausa não pagam nem ganham nada; o conserto na hora só usa o que sobra além da folha | `docs/spec-v8.2.2.md` |
| v8.3 | 23/10 | Carreira contínua e banco (etapa 2b): "Continuar" abre o próximo dia, sem escolher nem repetir; meta não batida fica sem estrelas; dias 8+ com o perfil do dia 7 e o dia da semana; caixa negativo por até 3 dias (no 4º, o banco cobre à força, 20%); aba Banco (até R$ 1.000, 10%, 5 parcelas no fim do dia; chave da folha sem dinheiro); coluna Banco no Caixa; "Recomeçar do zero" com confirmação; ranking pelo lucro acumulado (`ranking-campanha`) | `docs/spec-v8.3.md` |
| v8.3.3 | 23/10 | Jogo offline (pedido do usuário): `Rank.online = false`, o ranking fica só no aparelho, sem "Conectando..."; o compartilhado volta nos ajustes finais | `docs/spec-v8.3.3.md` |
| v8.3.4 | 23/10 | Balão de comida pronta (pedido do usuário): com o prato no balcão, a mesa que pediu mostra o prato num balão verde pulsando; na mão da Bia ou da Dani, branco até a entrega; cozinhando, sem balão | `docs/spec-v8.3.4.md` |
| v8.3.5 | 23/10 | Estoque no editor do salão (pedido do usuário): arrastar mesas para o estoque, à esquerda, e de volta (ou "Guardar no estoque" e "Pôr no salão" no balãozinho); a mesa guardada não abre no dia nem paga luz e gás, mas conta no teto; compra sem lugar vai para o estoque | `docs/spec-v8.3.5.md` |
| v8.3.6 | 23/10 | Jogo de pratos sem limite (pedido do usuário): sempre à venda, R$ 300 e +1 prato limpo por compra, fora do limite de 1 melhoria por dia (as outras seguem 1 por dia); `save.up.pratos` vira número | `docs/spec-v8.3.6.md` |
| v8.3.7 | 23/10 | 3ª estrela mais clara (retorno do usuário): "expert" vira "3 estrelas ... sem perder ninguém" na introdução, na barra de lucro e no fim do dia; a barra diz "3ª estrela perdida" após a 1ª perda e o fim do dia conta quantos foram embora. A regra não muda | `docs/spec-v8.3.7.md` |
| v8.3.8 | 23/10 | Preços de verdade (retorno do usuário): conta pelo cardápio (PF R$ 25, misto 12, pastel 10, coxinha 8) com 2º item na mesma comanda; corações = gorjeta de até 10%; sentar, anotar, entregar, recolher, cor e corrente dão pontos de atendimento, não dinheiro; ingredientes 35%, contas, folha, divulgação, multa e revisões de garagem; metas de R$ 60 a 200. Lucro do bot de ~R$ 1.870 para ~R$ 250/dia; R$ 800 no dia 10 | `docs/spec-v8.3.8.md` |
| v8.3.9 | 23/10 | Estrelas que premiam o jogo bem feito (retorno do usuário: dia 1 perfeito, 1 estrela): metas e 3 estrelas pelo bot afiado (dia 1: 30 / 50 / 60; dia 7: 180 / 250 / 310); o afiado leva 3 estrelas em ~93% dos dias 1 a 3 | `docs/spec-v8.3.9.md` |
| v8.3.11 | 24/10 | Desgaste da cozinha sem sorteio (pedido do usuário): o jogo é de ponderar custos, não riscos. Fogão, geladeira e cafeteira só gastam no verde (≥ 70%) e no amarelo (40–70%); no vermelho (< 40%) há 50% de chance de quebrar no dia e no limite (≤ 15%) quebra com certeza (`MANUT.vermelho/chanceVermelho/limite`, `manutChance`). Desgaste ~25% mais rápido (fogão 5 + 0,5/prato, geladeira 7 + 0,4, cafeteira 5 + 1): sem revisar, o vermelho chega no dia 7. Aba Manutenção e introdução dizem o ponto de cada um. |
| v8.3.10 | 24/10 | Triturador de lixo (pedido do usuário): melhoria de R$ 180 que mói 1 do lixo a cada 30 s, sem tirar a tarefa de esvaziar; o Ventilador só faz comer 15% mais rápido (o cheiro volta); a lixeira vai do cinza ao verde e, cheia, ganha tampa levantada, saco preto e fumacinha verde; aba Melhorias em 4 colunas | `docs/spec-v8.3.10.md` |
| v8.4 | 26/10 | Etapa 2c, avaliações no Gurugol (`docs/spec-v8.4.md`): cada grupo que sai na carreira dá de 1 a 5 em espera por mesa, agilidade (corações perdidos, menos os devolvidos; cor certa, corrente e caprichado somam), prato (faixa de acerto do Tonhão), cardápio e ambiente, com um balãozinho de comentário. A nota (`AVAL`, `save.aval`) é a média das últimas 100, a partir da 20ª (pedido do usuário: 100 e não 200); mexe no movimento de −10% a +10%. HUD, fim do dia e Caixa. Bot afiado com equipe ~4,4 ★, com equipe ~4,2, sem equipe ~3,6. |
| v8.4.1 | 26/10 | Caixa animada do Gurugol no fim do dia (pedido do usuário, `docs/spec-v8.4.1.md`): à esquerda dos quadros, uma barra segmentada por critério enche até a nota dele e a nota conta até o valor; abaixo de 4 pura, de 4 a 4,4 prata metalizada, de 4,5 a 4,8 ouro com brilhinhos, acima de 4,8 diamante reluzente com mais brilhos. Parada com `prefers-reduced-motion`. |
| v8.4.2 | 26/10 | Aba Gurugol na lojinha (pedido do usuário, `docs/spec-v8.4.2.md`): a caixa da nota e os últimos 30 comentários (`save.avalCom`: dia, nota, texto, tipo do grupo e VIP), do mais novo; o Gurugol sai da aba Caixa. Critérios renomeados: "Qualidade da comida" (era Prato) e "Diversidade do cardápio" (era Cardápio). |
| v8.5 | 26/10 | Etapa 2d, o sonho da Bia (`docs/spec-v8.5.md`): a abertura animada do Modo História em 9 cenas (~68 s), com o roteiro do usuário: a Rosa, mãe da Bia, a Casa Aurora, a estrela do Michelzão que ficou com o chef Bráulio, o hospital, a promessa, o Tonhão arregaçando as mangas, o banco e a inauguração na garagem. Toca sozinha uma vez (`lcc2_abertura`) e depois pelo botão História do menu; toque segue, Pular termina, quadros parados com movimento reduzido. Partes novas `18-abertura.js` e `25-abertura.js`. |
| v8.5.1 | 26/10 | Retorno do usuário (`docs/spec-v8.5.1.md`): no hospital, depois da fala derradeira da Rosa, a cortina do leito se fecha; cena nova `saudade`, com a Bia sozinha e triste no corredor (10 cenas, ~75 s). A receita especial (cominho com açafrão do Tonhão e a pétala da Dona Rosa) fica para o Modo História. |
| v8.6 | 28/10 | Etapa 2e, entregadores e marmitas (`docs/spec-v8.6.md`): o entregador espera em pé no balcão de retirada, no alto da calçada (3 lugares; a espera desceu um pouco), e o pedido dele vai pela Efood ao Tonhão, que faz o prato numa marmita (uma boca do fogão, sem prato limpo; ingredientes e R$ 2 de embalagem quando fica pronta). A Bia (ou a Dani, tarefa nova) leva a marmita ao balcão e ele paga o prato com a gorjeta dos corações, menos 15% da Efood. O "+ marmita" da janela de pedidos adianta até 2 de PF, que esperam na prateleira (mais 1 vaga para a encomenda) e esfriam em 60 s. Sem equipe 52% das metas dos dias 3 a 7, com equipe 93%; o afiado sem perder ninguém no dia 4 foi de 15% a 73%. |
| v8.6.1 | 28/10 | Etapa 2d-r, revisão estética da abertura (`docs/spec-v8.6.1.md`), as 5 partes juntas a pedido do usuário: alturas pela tabela `AB_ALT` (Rosa e Bia adulta 210 px, Bia criança 130, Tonhão e Bráulio 230) e o fogão de casa na cintura da Rosa; a Rosa mexe por cima com a colher de pau, a Bia prova com a colherinha na boca, o Tonhão mexe com colher, a pétala cai da mão da Rosa e o molho fica laranja-dourado, a Bia segura o caderno; a Rosa entra pela porta da Casa Aurora, pernas penduradas nas cadeiras, porta da enfermaria no corredor, fachada nova do banco com o papel voando até a Bia; balões no lado livre, vapor com contorno, estrela longe dos botões, plateia variada; olhar para onde anda, piscar, boca que fala e gestos suaves (nada disso com movimento reduzido). |
| v8.6.2 | 28/10 | Pedido do usuário: revisar a abertura em busca de inconsistências (`docs/spec-v8.6.2.md`). No `hospital`, a Rosa deitada ganha o corpo sob o cobertor (ombros sob a dobra do lençol, peito, quadril e pés levantando o pano, que cai pela lateral do colchão) e abre os olhos enquanto fala; a cortina do leito desce até o chão (as pontas das pernas da cama e da cadeira apareciam embaixo). No `banco`, o pote de moedas desce da mão até o chão quando a Bia chega, em vez de sumir. |
| v8.6.3 | 29/10 | Pedido do usuário: Livrinho de Sudoku (`docs/spec-v8.6.3.md`). Melhoria nova de R$ 200 que acrescenta 3 quadrinhos à fila de ações da Bia; a fila de base passa de 6 para 5 (`FILA_ACOES`, `filaMax`). Smoke29 novo | `docs/spec-v8.6.3.md` |
| v8.6.4 | 29/10 | Pedido do usuário: rebalanceamento das notas do Gurugol (`docs/spec-v8.6.4.md`). Teto por ponto (`AVAL.teto`, `avalTeto`, `avalEscala`, `avalFrac`): o serviço 5 vale 3 ★ na Garagem; humor do cliente (`AVAL.humor`, encantados até +0,8); movimento pela fração do teto; comentários de lugar simples (`AVAL_SIMPLES`); save antigo convertido uma vez (`avalEsc`). Smoke25 e 28 ajustados | `docs/spec-v8.6.4.md` |
| v8.6.5 | 29/10 | Pedido do usuário: decoração da Garagem (`docs/spec-v8.6.5.md`). Aba Decoração na lojinha, compras à vontade: plantas (as espadas-de-são-jorge da v7.7 deixam de vir de graça; samambaia nova), cantinho da Rosa (foto, quadro de giz, plaquinha "Comida é afeto"), guardar e pôr de volta de graça, e a toalha xadrez por mesa (também no editor do salão). Só visual: o peso no Ambiente do Gurugol fica para depois. Balãozinho do editor que não cabe abre para o outro lado ou em 2 colunas | `docs/spec-v8.6.5.md` |
| v8.6.6 | 29/10 | Revisão do rebalanceamento com a decoração (`docs/spec-v8.6.6.md`): no Ambiente do Gurugol, base 3 → 2, `AVAL.amb.planta` 0,3, `rosa` 0,25 e `toalha` 0,5 (só a mesa do grupo, também para quem sai bravo); elogios que citam os enfeites (`AVAL_DECOR`); `DECOR=tudo` no `balance.js`. Bot afiado: 2,74 ★ sem enfeites, 2,91 com tudo. Smoke30 com os casos novos | `docs/spec-v8.6.6.md` |
| v8.8 | 30/10 | Etapa 2g (`docs/spec-v8.8.md`): o Tonhão sobe de nível com XP dos cursos (básico +1, avançado +2), 5 níveis (XP 0/2/5/9/14), o aumento só consolida a XP e o "Reduzir" saiu; diárias 0/15/20/25/30 pela conferência do `balance.js`; save antigo rebaixado uma vez (`tonXp`); `smoke35` |
| v8.9.1 | 30/10 | Etapa 2c-r5 (`docs/spec-v8.9.1.md`): TV e som em Melhorias, toalha em todas as mesas no Salão, ícones da equipe inteiros (Tonhão com touca) e cartão da Manutenção amarelo/vermelho |
| v8.9 | 30/10 | Etapa 2h (`docs/spec-v8.9.md`): a Dani sobe de nível com XP (1 por 5 tarefas feitas e +2 por curso dela: Atendimento, Organização da cozinha e Barista), 4 níveis (XP 0/4/8/13), o aumento só consolida a XP e o "Reduzir" saiu; diárias 0 / 15 / 20 / 25 pela conferência do `balance.js`; save antigo rebaixado uma vez (`daniXp`); `smoke37` |
| v8.7 | 30/10 | Etapa 2f (`docs/spec-v8.7.md`): a campanha vira o Modo História (um save só, cap. `HISTORIA` com objetivo e conversas em balões sobre o salão, `19-conversa.js` e `26-conversa.js`); a reforma da garagem (R$ 1.000, 10 parcelas de R$ 100 + 1% ao dia, 1ª no fim do dia 2); cap. 1 (2 dias no azul), cap. 2 (Dani aprendiz de graça, nota 2,4) e cap. 3 (quitar, nota 2,7, R$ 800); Dani com 4 níveis (R$ 0, 25, 40, 55); "Ver abertura" no menu; save antigo recomeça do dia 1, com aviso. Teste `smoke34`. |
| v8.6.15 | 30/10 | Etapa 2c-r4b (`docs/spec-v8.6.15.md`): a fileira de 10 abas da lojinha vira 4 grupos (Lanchonete, Equipe, Dinheiro, Gurugol) com cartões de ícone e nome e botão Voltar; Bia (tênis, bandeja, Sudoku), Tonhão (aumento e cursos) e Dani viram seções; músico e TV e som vão para a Divulgação. Só interface. Smoke 33. |
| v8.6.14 | 30/10 | Etapa 2c-r4a (`docs/spec-v8.6.14.md`): sem o limite de 1 melhoria por dia (o limite é o dinheiro; o curso do Tonhão segue 1 por lojinha; sai `shopBought`/`boughtFor`); a caixa do Gurugol do fim do dia sem o "(n)" (a aba Gurugol mantém). Smoke 32. Carreira de 14 dias: 20/20 chegam a R$ 800, caixa de R$ 918 no dia 14 (antes R$ 723) |
| v8.6.13 | 29/10 | Rodada de balanceamento do cardápio (`docs/spec-v8.6.13.md`, etapa 2c-r3d): revisão da 2c-r3a, b e c; os cursos derrubavam o lucro (diluíam o PF), corrigido com `MAIS.salgado` 0,8; metas dos dias 6 e 7 em 140 e 170; `AVAL.minimo` 0,9 (Garagem 2,7). Calibração: sem equipe ~60%, com equipe ~92%, afiado ~75% |
| v8.6.12 | 29/10 | Desenhos próprios dos pratos, detalhe dos cursos avançados e Carnes variadas do PF (`docs/spec-v8.6.12.md`, etapa 2c-r3b) |
| v8.6.11 | 29/10 | Vegetarianos e veganos (`docs/spec-v8.6.11.md`, etapa 2c-r3c): `VEG`, `vegMov`, `pedePrato(..., veg)`, `Group.semVeg` (Cardápio 1 no Gurugol), curso Vegetariano e Pratos veganos, 8 pratos sem carne, `drawVegSelo`. Calibração: sem equipe 49%, com equipe 84% (a 2c-r3d ajusta as metas) |
| v8.6.9 | 29/10 | O cardápio cresce (`docs/spec-v8.6.9.md`, etapa 2c-r3a): `CARDAPIO` com 14 pratos, `CURSOS`, `CURSO_AV`, `GOSTOS`, `pedePrato`, aba Cursos na lojinha, `avalMenu(cursos)` (2,0 + 0,6 por curso básico), metas dos dias 2 a 5 −10%; save com `cursos`, `cursoDia`, `cardV` e `avisoCard` (save antigo recomeça do dia 1) | `docs/spec-v8.6.9.md` |
| v8.6.8 | 29/10 | Prato quente (`docs/spec-v8.6.8.md`, etapa 2c-r2): `PRATO`, `pratoPerde`, `pratoVapor`; o prato que espera no balcão perde até 1,5 na Comida depois de 8 s (em 20 s), vapor que some e "Comida meio fria."; smoke 25. |
| v8.6.7 | 29/10 | Etapa 2c-r1 do rebalanceamento do Gurugol (`docs/spec-v8.6.7.md`): critérios `null` para o que o cliente não viveu (`avalMedias` com `cnt`, `avalNota` só dos vistos), humor e folga como fração de `teto − 1`, bônus da cor/corrente/caprichado como chance de encantar (`AVAL.bonus`), faixa bronze (≥ 3,0) e `AVAL.minimo`/`avalMinimo` (95% do teto). Smoke 25 ampliado. |
| v8.3.2 | 23/10 | Empréstimo com amortização (pedido do usuário): tabela SAC, juros de 3% ao dia sobre o saldo (6% à força), parcelas que diminuem, "Amortizar" e "Quitar" cortando os juros, juros do banco no Caixa; `tests/emprestimo.js` mostra que pegar empréstimo empata no melhor caso e perde um pouco na maioria | `docs/spec-v8.3.2.md` |
| v8.3.1 | 23/10 | Atrasar o banco é game over (pedido do usuário): a parcela que não cabe no caixa fica atrasada, com aviso; sem a atrasada e a do dia no fim do dia seguinte, o banco toma a lanchonete (tela própria, ranking, só resta recomeçar do zero) | `docs/spec-v8.3.1.md` |
| v8.2.3 | 22/10 | Largar o dia tem preço (pedido do usuário): Reiniciar ou Menu na pausa com gente na espera ou nas mesas cobram, por grupo, a multa de quem sai bravo com 0 corações (R$ 30, +R$ 30 se VIP), direto do dinheiro; aviso na pausa e na introdução, linha "largado no meio" no caixa | `docs/spec-v8.2.3.md` |
