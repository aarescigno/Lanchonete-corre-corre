# v8.1 — Dinheiro comprometido

Retorno do usuário em 22/10 (texto em `docs/PROPOSTAS.md`): com R$ 159 na lojinha, comprou mais uma mesa de 2 e, ao começar o dia, a TV e a Dani foram desligadas sozinhas, porque o dinheiro da folha já não estava lá. "Eu fiquei iludido achando que ia ter dinheiro para comprar um upgrade, mas na verdade o dinheiro já estava travado." Pedido: mostrar que parte do dinheiro já está comprometida com a equipe e os equipamentos. (O dinheiro negativo com empréstimo no banco e a dívida da reforma da Garagem na história ficaram guardados no `docs/PLANO.md`.)

## Regras
- **Nada muda na economia.** A folha (aumento do Tonhão, Dani, couvert, TV, som) e a divulgação continuam saindo do dinheiro acumulado ao abrir o dia; o que não puder ser pago continua ficando de fora, na mesma ordem (divulgação vira boca a boca, depois couvert, som, TV, Dani e aumento do Tonhão).
- **Livre e reservado, no alto da lojinha** (visível em todas as abas e no celular deitado), ao lado do dinheiro acumulado:
  - com folha e dinheiro para pagá-la: "Dinheiro acumulado: R$ 159 · livre R$ 84 (R$ 75 reservados para Dani e TV)";
  - quando o dinheiro não paga a folha, em vermelho: "· faltam R$ 66 para a folha: o dia 3 abre sem TV e Dani";
  - sem folha nem divulgação paga, fica como antes.
- **Compra que come o dinheiro reservado** (melhoria, mesa de 2 ou de 4, virar mesa de 4, revisão, revisar tudo): se ela faz mais coisas ficarem de fora no dia, o botão fica em alerta (⚠, fundo mais claro e borda tracejada, com o aviso no `title`). O 1º toque só troca o texto para "Confirmar: sem TV e Dani"; o 2º compra. Tocar em outra coisa desfaz o aviso. Se a folha já não cabia antes da compra e nada novo fica de fora, não há alerta.
- A equipe e a divulgação já não deixavam contratar além do que o dinheiro paga, como antes.

## Código
- `10-constantes.js`: `FOLHA_CORTE` (a ordem do que fica de fora), `folhaCorta(eq)` (tira o próximo; o `payDay` usa), `folhaCortes(eq, div, bank)` (simula, sem mexer na equipe), `folhaItens(eq, div)` (o que se paga ao abrir) e `listaE`.
- `16-jogo.js`: `payDay` usa `folhaCorta`; `compromisso`, `livre` e `cortesSe(v)` na classe `Game`; o aviso do começo do dia junta os nomes com "e".
- `41-lojinha.js`: `#shop-livre` em `buildShop`; `folhaAviso` e `folhaPede` em `shopBtn`, `edBtn` e no botão das melhorias (o custo vai como último argumento).
- `02-telas.html`: `#shop-livre` e a v8.1 no painel Versões; `01-estilo.css`: `.livre`, `.livre.falta`, `.btn.warn`.
- Testes: `smoke17` (22/22). Capturas: `tests/shot_v8_1.py` em `capturas/v8.1`.
