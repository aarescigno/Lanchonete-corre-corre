# Resumo do projeto e das alterações (até 14/10/2026)

## Estado atual
- **Versão:** v5, publicada como Versão 11 do artifact https://claude.ai/artifact/MJxrgDg8S4akvg47SoQAvj (privado).
- **Branch:** `claude/elegant-curie-sgcl11` no repositório `aarescigno/Lanchonete-corre-corre`.
- **Arquivos publicados:** `lanchonete.html` (página), mais `versoes/v1.html`, `versoes/v2.html`, `versoes/v3.html` e `versoes/v4.html`, abertos pelo painel Versões.
- **Capacidades declaradas (mantidas ao republicar sem `capabilities`):**
  - `db`: `ranking-carreira` e `ranking-semfim` com read "view" e write "owner";
  - `db`: `ranking-*/{self}` com write "interact";
  - `user`.
- **Ranking:**
  - documentos `ranking-carreira/<userId>` e `ranking-semfim/<userId>`, com `nome`, `pontos`, `dia` ou `tempo` e `quando`;
  - só sobrescreve quando a pontuação é maior;
  - fallback local em `localStorage` (`lcc2_ranking`).
- **Save:** `lcc2_save`, que importa o `lcc_save_v1` da v1.

## Versões
| Versão | Data | O que trouxe | Detalhes |
|---|---|---|---|
| v1 | 13/10 | carreira de 7 dias, fila de ações, mãos, corrente, bônus de cor, lojinha com 5 upgrades, som | `docs/spec-v1.md` |
| v2 | 14/10 | comandas coloridas, aro de humor, "Lotado!", Turno sem fim, ranking compartilhado, painel Versões | `docs/spec-v2.md` |
| v3 | 14/10 | clientes VIP | `docs/spec-v3.md` |
| v4 | 14/10 | balcão de sucos, bandeja, comandas empilhadas, lixeira | `docs/spec-v4.md` |
| v5 | 14/10 | equipe (Tonhão, Dani, couvert), louça limitada, lixeira que enche, água saborizada, renda de 30% | `docs/spec-v5.md` |

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
   - **Metas:** dias 6 e 7 em R$ 1200 e R$ 1250.

## Testes (verdes no último commit)
- `smoke` (bot nos 7 dias);
- `smoke2` (mecânicas);
- `smoke3` (120/120: v2);
- `smoke4` (23/23: VIP);
- `smoke5` (41/41: sucos, bandeja e lixeira);
- `smoke6` (48/48: equipe, louça, lixeira que enche, couvert, água, economia);
- `menu_fit` (14 tamanhos de tela);
- `balance` (bot, N rodadas por dia).

## Ideias pendentes
- Testar som e toque em celular real.
- O painel "Como jogar" ainda rola no celular deitado.
- Ajuste de dificuldade.
- A lojinha ainda rola no menor celular deitado (568×320).
