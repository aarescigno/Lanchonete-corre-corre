# v8.3.11 — Desgaste sem sorteio

Retorno do usuário em 24/10: o desgaste dos equipamentos da cozinha devia ser em valores absolutos; o risco de quebrar no dia não combina com um jogo de ponderar custos, não riscos.

## O que mudou
- Fogão, geladeira e cafeteira continuam gastando por dia e por uso (de 100% a 0%), mas só quebram em dois pontos: **vermelho** (abaixo de 40%): 50% de chance de quebrar no dia; **limite** (15% ou menos): quebra com certeza. No verde (≥ 70%) e no amarelo (40–70%) é só desgaste acumulando.
- `manutChance(e)` virou uma escada (0, 0,5, 1); `MANUT.vermelho`, `MANUT.chanceVermelho` e `MANUT.limite` guardam os pontos.
- Desgaste ~25% mais rápido (fogão 5 + 0,5 por prato, geladeira 7 + 0,4, cafeteira 5 + 1 por cafezinho), para o vermelho chegar por volta do dia 7 sem revisão. Revisar tudo em toda lojinha: ~25% do lucro (a revisão tem taxa; o amarelo fica em ~14%).
- **Revisão (segundo retorno do usuário):** o melhor momento é o amarelo. O preço agora é `MANUT.taxa` (R$ 10 de visita) mais o desgaste, ×`MANUT.urgente` (1,5) no vermelho; antes era só proporcional, e quem revisava só no vermelho (na lojinha, antes do dia) nunca corria risco e ainda pagava menos. `MANUT.verde` (70%) marca o começo do amarelo. Com `MANUT=amarelo|vermelho|cuida|com node carreira.js 20` (revisa quem está abaixo de 70%, só quem está abaixo de 40%, tudo, ou nunca), nos dias 3 a 7: amarelo 14% do lucro e 0 quebras; vermelho 17%; revisar tudo todo dia 25%; sem revisar, ~0,85 quebra por carreira e só 84% das metas.
- **Textos sem porcentagem e sem segurança falsa (terceiro retorno):** o jogo não diz "só desgasta"/"não quebra", porque desgaste sempre deixa um pouco de insegurança. Amarelo: "Já mostra desgaste."; vermelho: "Risco de quebra durante o expediente."; limite: "Alto risco de quebra!"; verde e dias 1 a 3: nada. "Revisar tudo" avisa que a visita técnica tem custo e que quanto mais desgastado, mais cara a manutenção. A introdução do dia segue o mesmo tom ("Fogão: risco de quebra durante o expediente.").
- **Sem dica no jogo (pedido do usuário):** a taxa, o acréscimo do vermelho e o "melhor momento" não aparecem em texto; o jogador descobre pelo preço do botão e jogando.
- Aba Manutenção: "Só desgasta", "No vermelho: 50% de chance de quebrar no dia N" ou "No limite: quebra no dia N!". Introdução do dia: "vai quebrar hoje" (limite) e "pode quebrar hoje" (vermelho).
- Testes: `smoke16` atualizado; `carreira.js` mostra o estado médio dos equipamentos por dia.
