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

**Resultado:** v3 no repositório, ainda não publicada no artifact. O smoke4 passou 23/23 e os demais testes continuam verdes. A meta do dia 7 caiu para R$ 1300, depois do balanceamento com o bot.
