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
