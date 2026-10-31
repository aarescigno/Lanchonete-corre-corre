# v8.3.7 — 3ª estrela mais clara

Retorno do usuário em 23/10 (texto em `docs/PROPOSTAS.md`): "tive lucro suficiente para 3 estrelas e o jogo me deu 2 só" (dia 7: lucro R$ 1583, expert R$ 1250, 1 cliente perdido).

## Antes
A regra das estrelas (v6) já era: 1 na meta, 2 na metade do caminho até a expert (`bomGoal`), 3 na expert **sem perder nenhum cliente**. Mas a introdução, a barra de lucro e a linha do fim do dia mostravam só "expert R$ X", que se lê como "3 estrelas por R$ X"; o "não perca nenhum cliente" só aparecia na mensagem embaixo da tabela, depois do dia.

## Agora
- Introdução do dia: "3 estrelas: R$ X sem perder ninguém" no lugar de "Expert: R$ X".
- Fim do dia: "(meta · 2 estrelas · 3 estrelas R$ X sem perder ninguém)". Com o lucro batido e perdas, a mensagem diz "Lucro das 3 estrelas batido, mas N cliente(s) foi/foram embora: a 3ª estrela pede que ninguém saia sem ser atendido."
- Barra de lucro (HUD): o rótulo da direita vira "3 estrelas R$ X"; depois do 1º cliente perdido, "3ª estrela perdida" em vermelho claro, para o jogador saber na hora.
- A regra não muda (`stars = 3` com `m >= d.expert && stats.lost === 0`); os "não couberam" seguem sem contar.

Testes: `smoke8.js` confere os textos do fim do dia com 0, 1 e 2 perdas. Capturas: `python3 tests/shot_v8_3_7.py` gera `capturas/v8.3.7`.
