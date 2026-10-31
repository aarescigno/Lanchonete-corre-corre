# v9.6 — Sessão 3b-6: a Cami em "Minhas mesas" (31/10/2026)

## O que entrou
- **Curso e modo:** o curso "Atendimento de mesa" (R$ 600, depende do ágil, só na Avenida) agora se compra: nível 3 (velocidade 1,25, R$ 160 por dia). O "Em breve" e a constante `CAMI_MESA_ON` saíram. O cartão da Cami (nível 3) ganha o seletor **Tarefas | Minhas mesas** (`equipe.camiModo`, `'tarefas'` por padrão; `Game.setCamiModo`). Sem mesa marcada, "Minhas mesas" fica apagado e o cartão diz "Marque as mesas dela no Salão".
- **Mesas dela:** no editor do salão, o balãozinho da mesa tem "Mesa da Cami (n de 3)" / "Tirar da Cami" (`Game.camiMesa`; precisa do curso de mesa; `CAMI_MESAS_MAX` = 3). Save: `salao.mesas[i].cami = 1` (`normSalao` guarda e corta acima de 3; guardar no estoque tira a marca; tirar a última volta o modo para "Tarefas"). Avental vinho no tampo (`drawAventalCami`), no editor sempre e no jogo só com o modo ligado (`Game.camiMesasOn`). `Table.cami`.
- **O que ela faz** (`Helper.thinkMesas`, só nas mesas dela, 2 mãos, sem bandeja): entrega o prato que carrega; leva 1 ou 2 comandas à janela; cobra a conta; pega o prato pronto do grupo; anota o pedido (0,6 s); recolhe a louça suja e leva à pia (não lava). Prioridade nessa ordem; entre mesas, a de menos corações primeiro; pula a mesa que a Bia já tem na fila. Suco, café, doce e drink seguem com quem faz.
- **Marcação:** cada ação dela marca o grupo (`Group.cami`). A Bia não pega o prato dele (toque no balcão mostra "É da Cami!" e a ação da fila falha); o prato que já está na fila da Bia a Cami deixa. Prato na mão dela de grupo que foi embora vai para a pia.
- **Pontos e gorjeta:** `PONTOS_ACAO` e a gorjeta da conta como os da Bia; a sequência (`chain`) é só da Bia (`Game.score(..., semCorrente)`, `collectBill(g, t, semCorrente)`). `Game.entregaPrato` saiu do `doTable` da Bia e é usado pelas duas.
- **Básico:** `donoBasico` ignora a Cami no modo "Minhas mesas" (volta para o Joca, ou a Dani); `Helper.tasks` dela fica vazio nesse modo.

## Testes
- **`tests/smoke48.js` (novo, 40):** o plano chamava de smoke47 (número do Anselmo). Confere curso, marcar/desmarcar/limite de 3 e save, básico do Joca, um grupo do pedido à conta sem a Bia (sequência zerada, mãos ≤ 2, louça na pia), 2 grupos, a Bia que não pega o prato dela e a Cami que deixa o prato da fila da Bia, mesa comum só da Bia, cartão, desenho e save da v9.5. `smoke45` mudou onde dizia "Em breve".
- `bot.js`: a Bia deixa as mesas da Cami (`delaCami`); `balance.js`: `CAMI=3` liga o modo com `CAMI_MESAS` (3) mesas mais perto da janela.
- Capturas: `tests/shot_v9_6.js` (`capturas/v9_6`).

## Números medidos (`PONTO=avenida EQUIPE=auto JOCA=3 ESPRESSO=1`, `balance.js 20`)
- Cami em "Tarefas" (`CAMI=2`): passou 20/20 nos dias 8 a 10; perdidos 2,4 / 1,3 / 0,9; 3★ 2, 9 e 9 de 20; nota do Gurugol ~4,0.
- "Minhas mesas" com 3 mesas (`CAMI=3`): 20/20, 20/20, 20/20; perdidos 0,3 / 0,0 / 0,1; 3★ 16, 20 e 18 de 20; nota ~4,1 a 4,3. Com 2 mesas (`CAMI_MESAS=2`): 20/20 ×3; perdidos 0,8 / 0,1 / 0,3; 3★ 12, 18 e 14.
- **Decisão:** a Avenida já passava de 95% antes (v9.5: 20/20, 19/20, 19/20), então a regra "passou de 95%, fica com 2 mesas" dispara com ou sem o modo; como na 3b-3 e na 3b-5, **mantive 3 mesas** e deixo o ajuste (metas do ponto, ou o teto de mesas da Cami) para a 3b-7. O modo é mais forte que "Tarefas" nas estrelas e nos perdidos.
