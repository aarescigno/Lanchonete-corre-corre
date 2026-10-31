# v8.3.1 — Atrasar o banco é game over

Pedido do usuário em 23/10, depois da v8.3 (texto em `docs/PROPOSTAS.md`): "Se atrasar de pagar o banco, ele autua e game over". Decisões confirmadas na conversa: prazo de 1 dia; o empréstimo à força continua; no game over, a carreira acaba.

## Antes (v8.3)
A parcela do empréstimo saía no fim do dia mesmo sem dinheiro, deixando o caixa negativo; o único limite era o empréstimo à força no 4º dia seguido no negativo.

## Agora
- **Parcela atrasada:** no fim do dia, a parcela só sai se o caixa (já com o resultado do dia) tiver o valor. Se não tiver, nada sai e ela fica atrasada (`save.emp.atr`). O fim do dia avisa quanto o caixa precisa ter no dia seguinte (`devidoDe`: a atrasada mais a do dia; a última parcela atrasada é só ela), e o aviso se repete no menu de sempre, na introdução, no alto da lojinha (em vermelho), na aba Banco (cartão em rosa) e na linha da folha.
- **No dia seguinte:** com o valor no caixa, sai a atrasada e a do dia (2 parcelas) e o atraso some. Sem ele, **o banco toma a lanchonete**: tela "O banco tomou a lanchonete" (`#ov-falencia`, estado `falencia`) com o porquê, os dias jogados, as estrelas, o lucro acumulado, o lucro do último dia, a dívida e o formulário do ranking; botões "Recomeçar do zero", Ranking e Menu.
- **Fim da carreira:** `save.fechou` guarda o dia. No menu, "Carreira: fechou no dia N" e o botão principal vira "Recomeçar do zero" (sem o link à parte); continua assim ao reabrir o jogo. Recomeçar volta ao dia 1, com a Missão zero feita.
- **Quitar** na aba Banco paga tudo e tira o atraso. O **empréstimo à força** (4º dia no negativo) continua e mantém o atraso que houver: no dia seguinte, o caixa precisa da atrasada e da do dia do empréstimo novo.
- **Caixa:** as linhas marcam `atr` (parcela atrasada) e `tom` (o banco tomou a lanchonete), com "atrasou" ou "tomou" em vermelho na coluna Banco e no resumo.
- Sem empréstimo, nada muda. Turno sem fim e Missão zero não cobram parcela.
- O "Como jogar" avisa: parcela sem pagar 2 dias seguidos, e o banco toma a lanchonete.

## Testes
- `tests/smoke21.js` (33 checagens): `devidoDe`, atraso e avisos, pagar no dia seguinte, o banco tomando a lanchonete (tela, caixa, save, menu, reabrir, recomeçar pelo menu e pela tela), quitar, última parcela, empréstimo à força com atraso, sem empréstimo, turno sem fim.
- `smoke20` continua verde (a parcela paga com dinheiro no caixa).
- Capturas: `python3 tests/shot_v8_3_1.py` (fim do dia com a parcela atrasada, aba Banco com o atraso, tela do fim e menu depois; PC e celular).
