# v8.3.2 — Empréstimo com amortização

Pedido do usuário em 23/10, depois da v8.3.1 (texto em `docs/PROPOSTAS.md`): incluir a amortização do empréstimo e conferir que pegar empréstimo não vale sempre a pena ("relativamente neutro ou pelo menos um pouco desvantajoso no longo prazo na maioria dos casos", com risco).

## Antes (v8.3 e v8.3.1)
Juros fixos de 10% sobre o valor (20% à força), somados de uma vez à dívida e divididos em 5 parcelas iguais. Quitar pagava o resto sem desconto dos juros.

## Agora (tabela SAC)
- **Juros ao dia sobre o saldo devedor:** `BANCO.juros` = 3% ao dia (à força, `BANCO.forcado` = 6% ao dia sobre o saldo todo). O empréstimo guarda `emp = { resto (o saldo), amort, j, atr }`; `n` (parcelas que faltam) é calculado (`resto ÷ amort`, para cima).
- **Parcela:** a amortização fixa (o valor ÷ 5) mais os juros do dia sobre o saldo, por isso as parcelas vão diminuindo. R$ 1.000 viram 230, 224, 218, 212 e 206 (R$ 90 de juros); R$ 500 viram 115, 112, 109, 106 e 103 (R$ 45). Funções `jurosDe`, `parcelaDe`, `devidoDe`, `tabelaDe` e `simulaEmprestimo` em `10-constantes.js`.
- **Amortizar** (aba Banco): "Amortizar R$ X" adianta uma parcela (abate X do saldo, sem juros); o prazo encurta e os juros dos dias seguintes caem. "Quitar" amortiza o saldo todo: no mesmo dia do empréstimo, devolve só o valor; depois de 2 parcelas de R$ 1.000, paga R$ 54 de juros em vez de R$ 90. `Game.amortizar(x)` e `Game.quitar()`.
- **Atraso (v8.3.1, com juros):** a parcela que não cabe no caixa fica atrasada, e os juros do dia vão para o saldo. No dia seguinte, o banco cobra 2 amortizações e os juros do saldo novo (R$ 500: 115 atrasa, amanhã 215, e sobra uma 6ª parcela). Sem pagar, o banco toma a lanchonete, como na v8.3.1.
- **À força:** o que o banco cobre soma ao saldo, a amortização volta a ser o saldo ÷ 5 e os juros do saldo todo passam a 6% ao dia.
- **Aba Banco:** a oferta mostra as 5 parcelas do maior valor e os juros; cada botão (R$ 200, 500, 1.000) tem as parcelas no título. Com empréstimo, mostra o saldo, a próxima parcela (do saldo + de juros), as seguintes, "Amortizar" e "Quitar".
- **Caixa:** as linhas guardam `jur` (a parte de juros do que foi pago ao banco); "Para onde foi" mostra "Juros do banco" (o custo de verdade; o resto só devolve o empréstimo) e o resumo, "banco −115 (juros 15)".
- Save da v8.3 e da v8.3.1 (`{ resto, n }`, com os juros já somados): vira saldo com amortização `resto ÷ n` e sem juros.

## Equilíbrio (`tests/emprestimo.js`)
Bot na campanha, 30 carreiras de 14 dias; patrimônio (caixa − dívida) no fim do dia 14:

| situação | sem empréstimo | R$ 1.000 no dia 2, gasto logo | pega e amortiza o que sobra | pega sempre que pode |
|---|---|---|---|---|
| bot normal | 11.990 | 11.953 | 11.786 | 11.689 |
| investindo em mesas de 4 (`MOVEIS=quatro`) | 19.223 | 18.933 | 19.229 | — |
| com quebras, chuva e feriado (`IMPREV=1`) | 10.963 | 10.483 | — | 10.465 |

No melhor caso, o empréstimo empata; na maioria, perde de R$ 200 a R$ 500 em 14 dias. O motivo: a lanchonete junta dinheiro rápido (R$ 1.500 no dia 3), a lojinha vende 1 melhoria por dia, e os móveis e a equipe comprados antes não se pagam a tempo de cobrir os juros. O risco fica no atraso: com 2 dias ruins seguidos, a parcela não paga leva ao fim da carreira (v8.3.1). Com os juros fixos da v8.3, os números eram parecidos (neutro a −R$ 500); a amortização deixa o empréstimo mais barato para quem paga antes, e os 3% ao dia compensam isso.

## Testes
- `smoke20` (88 checagens; v8.3.2: saldo, amortização e juros, tabela SAC, aba Banco, amortizar, quitar com e sem juros, juros no caixa e no "para onde foi") e `smoke21` (34; atraso com juros no saldo e a 6ª parcela).
- `node tests/emprestimo.js [N] [DIAS] [nenhum|cedo|amortiza|sempre]` (com `MOVEIS`, `IMPREV`, `BANCO_CFG`, `VALOR` e `DIA0`).
