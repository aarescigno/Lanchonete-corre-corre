# v9.6.3 — Dani nível 1: o menu mostra só a tarefa que ela faz

Retorno de 01/11: a Dani aprendiz (nível 1) tem 1 vaga de tarefa, mas a lojinha mostrava "Retirar pratos" e "Lavar a louça" marcados (a lista guardada, `DANI_PADRAO`, tem as duas), e ela só fazia a 1ª, então parecia que não lavava.
- `src/41-lojinha.js`: os botões marcam `game.dani.tasks` (o que ela de fato faz), e "Tarefas (n de m)" conta isso.
- `src/16-jogo.js`, `toggleDaniTask`: a vaga conta as tarefas efetivas; desligar a 1ª faz a guardada passar a valer. A lista guardada fica como estava (sobe de nível, as duas voltam a valer).
- Teste: `smoke49` (bloco 4).
- Animação de lavar: já era a mesma da Bia (`lava` em `drawPerson`); nada mudou.
