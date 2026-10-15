# v7.2 — Livro-caixa

Etapa 1b do `docs/PLANO.md`. O objetivo é ver a escassez da v7 com números de jogo real (não só do bot) e dar ao jogador um jeito de sentir para onde vai o dinheiro.

Decisões do usuário (15/10): o Caixa fica numa **aba da lojinha**; guarda **14 dias**; a rodada de retorno de jogador foi **dispensada por ora** (o ajuste de valores só entraria se o `carreira.js` ainda mostrasse sobra no dia 5).

## 1. Registro (`save.caixa`)
- Uma linha por dia jogado na carreira (o Turno sem fim não entra), gravada em `Game.finishDay` por `caixaAdd`. Ficam só as últimas `CAIXA_MAX = 14`; as mais antigas saem primeiro.
- Campos: `d` (dia), `fat` (faturamento), `ingr` (ingredientes), `contas`, `folha`, `div` (divulgação), `lucro`, `meta`, `ok` (passou), `perd` (perdidos), `mel` e `sal` (compras de melhorias e de salão), `saldo` (dinheiro acumulado ao fim do dia).
- **Compras:** cada compra da lojinha (`buy`, `buyChairs`, `buyTable`) vai para `save.caixaPend` (`caixaGasto`) e entra na linha do dia seguinte, junto com o saldo ao fim dele. Assim cada linha fecha: saldo anterior − compras − folha − divulgação + faturamento − ingredientes − contas = saldo (a não ser que o Turno sem fim tenha mexido no dinheiro entre um dia e outro).
- **Save antigo:** `normSave` cria `caixa: []` e `caixaPend: {mel:0, sal:0}` quando faltam, e `normCaixa` descarta linhas inválidas e corta no limite.

## 2. Aba Caixa (lojinha)
- Quinta aba, depois de Divulgação. Sem dias jogados, explica que o caixa começa no primeiro dia da carreira (na prática, a lojinha só abre antes do dia 2, então já há 1 linha).
- **Tabela** com o dia mais novo em cima: Dia, Faturou, Ingred., Contas, Equipe (folha + divulgação), Lucro (verde se passou da meta, vermelho se não; a meta e os perdidos ficam no `title`), Compras e Saldo. Rola por dentro. Nas telas baixas (`max-height: 620px`) o "R$" das células some, para a tabela caber no celular deitado.
- **Para onde foi o dinheiro:** barra empilhada com ingredientes, contas, equipe, divulgação, melhorias e salão, e a legenda com valor e porcentagem. Abaixo, as compras feitas nesta lojinha (que entram na linha do próximo dia).
- **Copiar resumo:** texto pronto para o WhatsApp (`caixaResumo`), com a versão, uma linha por dia com a conta do lucro, o total de cada gasto e o "agora" (dinheiro, equipe, divulgação, salão e melhorias). Exemplo:

```
Lanchonete Corre-Corre v7.2 · Caixa (valores em R$)
Dia 1 ✓: fatura 652 − ingred. 104 − contas 246 − equipe 0 = lucro 302 (meta 200) · saldo 302
Dia 2 ✓: fatura 953 − ingred. 203 − contas 300 − equipe 0 = lucro 450 (meta 300) · 1 perdido · compras 150 · saldo 602
Dia 3 ✓: fatura 1692 − ingred. 320 − contas 342 − equipe 100 − divulg. 40 = lucro 890 (meta 380) · compras 180 · saldo 1312
Para onde foi (3 dias): ingredientes 627, contas 888, equipe 100, divulgação 40, melhorias 330
Agora: R$ 1312 · Tonhão nível 2, Dani nível 1 · panfletos · 6 mesas e 16 cadeiras · melhorias: tênis novos, água saborizada
```

- A cópia usa `navigator.clipboard` e, se falhar, `execCommand('copy')`. Se o navegador não deixar nenhum dos dois (algumas molduras de artifact), a aba mostra o texto selecionado numa caixa para copiar à mão.

## 3. Ajuste fino (decisão: valores mantidos)
O plano sugeria começar por `INGRED.prato` 0,6 → 0,7 se ainda sobrasse dinheiro no dia 5. Medido com o bot (`balance.js 40`, `carreira.js 20`, `EQUIPE=auto balance.js 30`):

| | `INGRED.prato` 0,6 (atual) | 0,7 |
|---|---|---|
| Carreira: dinheiro na lojinha do dia 5 | R$ 1.483 | R$ 1.336 |
| Sem equipe, metas batidas nos dias 3 a 7 | 78%, 58%, 45%, 55%, 43% | 85%, 58%, 35%, 40%, 33% |
| Com a equipe que o jogador paga (alvo 85–95%) | (v7.1: no alvo) | 90%, 97%, 87%, 97%, 90% |

O 0,7 tira só ~R$ 150 do bot até o dia 5 e leva os dias 5 a 7 sem equipe para baixo do alvo (40–70%). E a sobra do bot no dia 5 (~R$ 1.400–1.500) não paga tudo o que falta comprar: ~R$ 770 de melhorias (o bot só leva 1 por dia) e ~R$ 960 de salão (2 mesas e as cadeiras), além das redes sociais. Por isso os valores ficaram como estão até chegar o primeiro resumo de jogador pelo Caixa.

`balance.js` passou a aceitar `INGRED='{...}'` e `CONTAS='{...}'`, como o `carreira.js`.

## 4. Testes
- `smoke11` (39 verificações): save novo e antigo, linhas inválidas, registro do dia, saldo e conta do lucro que fecham, compras na linha do dia seguinte, Turno sem fim fora do caixa, limite de 14 dias, resumo em texto e aba Caixa (vazia, tabela, barra, compras pendentes, cópia sem área de transferência).
- `shot_v7_2.py`: capturas da aba em `capturas/v7.2` (960×600 e 740×360), com a carreira dos dias 1 a 5 jogada pelo bot.
- Smokes 1 a 10 e `menu_fit` sem mudança.

## Partes alteradas
`10-constantes.js` (`CAIXA_MAX`, `VERSAO`), `12-clientes.js` (`normCaixa`, `normPend`, `caixaGasto`, `caixaAdd`, `normSave`), `16-jogo.js` (`finishDay`, `buy`, `buyChairs`, `buyTable`), `41-lojinha.js` (`buildCaixa`, `caixaResumo`, `caixaTotais`, `copyText`), `02-telas.html` (aba, selo, painel Versões), `01-estilo.css`, `43-telas.js` (`__lcc`).
