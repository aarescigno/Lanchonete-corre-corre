# v8.6.3 — Livrinho de Sudoku

Pedido do usuário em 29/10 (texto em `docs/PROPOSTAS.md`): uma melhoria nova, o Livrinho de Sudoku, que aumenta a barra de tarefas (a fila de ações da Bia) em 3 quadrinhos, e a fila de base reduzida para 5.

## O que mudou
- **Fila de ações:** de 6 para **5 quadrinhos** de base. A constante `FILA_ACOES = { base:5, sudoku:3 }` e `filaMax(up)` (em `10-constantes.js`) dizem o tamanho; `Waitress.enqueue` (`14-bia.js`), `hudHit` (`16-jogo.js`), o desenho do HUD (`22-salao-hud.js`) e o destaque do passo "Mãos e fila de ações" da Missão zero (`17-treino.js`) usam essa função, e não mais o 6 fixo.
- **Melhoria `sudoku`, "Livrinho de Sudoku"** (R$ 200, 1 por dia como as outras, sem pré-requisito): com ela, a fila vai a **8 quadrinhos** (5 + 3). Ícone novo na lojinha: livrinho de capa azul com a grade 3×3 e alguns números. A grade da lojinha passa a ter 9 melhorias (8 cartões por vez, com os Tênis novos e de corrida no mesmo lugar).
- **Texto do Como jogar:** diz que a fila tem 5 tarefas marcadas e que o livrinho acrescenta 3.
- Com 8 quadrinhos, a fila termina em x = 906 (tela larga), antes das mãos (x = 956): não há sobreposição.
- **Sem migração de save:** `up.sudoku` é um simples verdadeiro, como as outras melhorias.

## Balanço
Quem joga sem o livrinho perde 1 quadrinho (6 → 5); o bot (`tests/bot.js`) passou a respeitar `filaMax`. Não mexi nos números de dinheiro nem de metas; se o `balance.js` mostrar queda sem equipe, a compra do livrinho (R$ 200) entra na ordem das melhorias do bot afiado.

## Testes
- `run_all.sh`: todos passam (smokes 1 a 29). Novo `smoke29.js` (fila de 5 e de 8, toque nos quadrinhos, compra, desenho). Ajustados `smoke2` (fila máx. 5), `smoke5` (9 melhorias) e `smoke12` (8 cartões).
- Capturas da fila de 5 e de 8 e da lojinha em `capturas/v8.6.3`.
