# v8.3.11 — Desgaste sem sorteio

Retorno do usuário em 24/10: o desgaste dos equipamentos da cozinha devia ser em valores absolutos; o risco de quebrar no dia não combina com um jogo de ponderar custos, não riscos.

## O que mudou
- Fogão, geladeira e cafeteira continuam gastando por dia e por uso (de 100% a 0%), mas só quebram em dois pontos: **vermelho** (abaixo de 40%): 50% de chance de quebrar no dia; **limite** (15% ou menos): quebra com certeza. No verde (≥ 70%) e no amarelo (40–70%) é só desgaste acumulando.
- `manutChance(e)` virou uma escada (0, 0,5, 1); `MANUT.vermelho`, `MANUT.chanceVermelho` e `MANUT.limite` guardam os pontos.
- Desgaste ~25% mais rápido (fogão 5 + 0,5 por prato, geladeira 7 + 0,4, cafeteira 5 + 1 por cafezinho), para o vermelho chegar por volta do dia 7 sem revisão. Revisar tudo em toda lojinha: ~20% do lucro (18,7% antes).
- Aba Manutenção: "Só desgasta", "No vermelho: 50% de chance de quebrar no dia N" ou "No limite: quebra no dia N!". Introdução do dia: "vai quebrar hoje" (limite) e "pode quebrar hoje" (vermelho).
- Testes: `smoke16` atualizado; `carreira.js` mostra o estado médio dos equipamentos por dia.
