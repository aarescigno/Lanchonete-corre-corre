# v11.5 — O retrato no balão e as cinco expressões (etapa 8e)

**Situação:** entregue em 14/11
**Origem:** `docs/ARCO.md` §8 e §12 (roteiro fechado na entrevista de 14/11; pedido em `docs/PROPOSTAS.md`); etapa 8e do `docs/PLANO.md`. Aprovada em 14/11.

## Objetivo
Quem fala nas conversas do Modo História ganha rosto: um retrato redondo no balão, com a cara da pessoa e uma de cinco expressões (o campo `e` da fala), para a Bia insegura parecer insegura e a firme parecer firme.

## Fora do escopo
- Falas e gatilhos: não mudam (o `e` já está nas falas desde a v11.1 e a v11.2).
- O Bráulio (retrato dele e a `braulio1`): v11.6. A roupa da Bia por ponto: v11.7. As reações da Bia no dia: v11.8.
- Do `docs/ARCO.md` §9 em diante: nada.

## Regras (decisões tomadas)
Copiadas de `docs/ARCO.md` §8, sem mudança de regra.
- **Retrato:** dentro do balão da conversa (`drawConversa`, `src/26-conversa.js`), à esquerda do nome e do texto, um círculo de raio 34 com fundo `#F4EBDD` e a cabeça e os ombros de quem fala, desenhados pela mesma função do boneco do salão, em escala maior e recortados no círculo. O texto e a nota andam 84 px para a direita e o balão fica 84 px mais largo (o texto continua com `CONV_UI.w` 420). O bico do balão continua apontando para o boneco.
- **Cinco expressões** (campo `e` da fala; sem `e`, `neutra`), iguais para todos:

  | `e` | Sobrancelhas | Olhos | Boca | Corpo |
  |---|---|---|---|---|
  | `neutra` | como hoje | como hoje | como hoje | — |
  | `insegura` | erguidas no meio | olhando para baixo | pequena e reta | ombros 3 px mais baixos |
  | `firme` | retas e baixas | abertos, de frente | fechada, canto erguido | cabeça 2 px mais alta |
  | `alegre` | arqueadas | em arco (fechados sorrindo) | sorriso aberto | — |
  | `brava` | em V | apertados | curva para baixo | — |
- Com movimento reduzido, o retrato aparece direto, como o balão.
- **Modo dev:** no painel, "Retratos": uma tela com os 7 (e o Bráulio, quando existir) nas 5 expressões, para conferir de uma vez.
- Como foi feito (a execução, sem mudar regra): `drawRetrato(c, q, e, cx, cy, g)` em `src/26-conversa.js` clipa o círculo, escala e chama a função do boneco (`drawBia`, `drawChef`, `drawDani`, `drawJoca`, `drawCami`, `drawAnselmo`, `drawLia`) com os pés abaixo da cabeça (`RETRATO_POSE`); a expressão vai pela variável `EXPR` (só vale dentro do `drawRetrato`; fora dele é `neutra` e o boneco do salão fica idêntico), lida por `rostoExpr` em `drawPerson`, `drawBia` e `drawChef`. Traços de 2,9 (mais grossos que os do boneco) para ler no retrato pequeno. Um personagem novo entra em `RETRATO_QUEM`, `RETRATO_POSE` e no `if` de `drawRetrato`.

## Critérios de aceite
- **CA1** (`__lcc.drawRetrato` desenha os 7 nas 5 expressões sem erro; expressão desconhecida ou ausente cai em `neutra`; raio 34 e fundo `#F4EBDD`) → `smoke81` (1, 2, 3, 4)
- **CA2** (`drawConversa` grava em `conv.caixa` um balão 84 px mais largo que antes para o mesmo texto, dentro da tela com 16 px de margem, com altura para o círculo) → `smoke81` (CA2)
- **CA3** (o texto continua quebrando em `CONV_UI.w` 420) → `smoke81` (CA3)
- **CA4** (todo `e` de toda fala do jogo é um dos cinco) → `smoke81` (CA4)
- **CA5** (o painel do modo dev tem "Retratos" e a tela desenha sem erro) → `smoke81` (CA5)
- **CA6** (movimento reduzido: o balão e o retrato aparecem direto) → `smoke81` (CA6)
- **CA7** (sem a expressão o boneco do salão fica como era: `EXPR` é `neutra` fora do retrato e volta a ela depois) → `smoke81` (CA7)
- **CA8** (o que se vê) → captura `shot_v11_5.js`: a grade dos 7 x 5; o balão da Bia insegura (`desanimo`) e firme (cap. 14 `antes`) em 844x390 e 568x320; o do Tonhão e o de um ajudante com `nota`
- **CA9** (`node carreira.js` com a História chega ao Fim como antes) → `DIAS=120 node carreira.js 10`

## Partes
- `src/20-desenho-base.js`: `EXPR`, `EXPRESSOES`, `exprDe`, `rostoExpr`; rosto de `drawPerson` e `drawBia`.
- `src/21-cenario.js`: rosto de `drawChef`.
- `src/26-conversa.js`: `RETRATO`, `RETRATO_QUEM`, `RETRATO_POSE`, `drawRetrato`, `drawRetratosTela`, `drawConversa`.
- `src/40-interface.js` (botão no painel, aba História) e `src/43-telas.js` (`devRetratos`, laço, toque e teclas, `__lcc`).
- `src/10-constantes.js`: `VERSAO`.

## Tarefas
- [x] T1 Smoke novo `tests/smoke81.js` (CA1 a CA7), visto falhar sem o código, incluído no `tests/run_all.sh`.
- [x] T2 A expressão em `drawPerson`, `drawBia` e `drawChef` (`EXPR`, `rostoExpr`).
- [x] T3 `drawRetrato` e o balão com retrato em `drawConversa`.
- [x] T4 Modo dev: a tela "Retratos".
- [x] T5 `tests/shot_v11_5.js`; capturas olhadas em recorte e ajustadas (escala, traços, nome da grade).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PLANO.md` (8e feita, texto arquivado), esta spec como entregue, `tests/run_all.sh` verde, commit local.

## Testes
- `tests/smoke81.js` (novo): 18 checagens, CA1 a CA7.
- Nenhum smoke antigo mudou.
- Medido: `tests/run_all.sh` com saída 0 (`smoke81`: 18/18); `DIAS=120 node carreira.js 10`: capítulos 1 a 14 e o Fim em 10 de 10, banco em 0 de 10.

## Decisões em aberto
Nenhuma.

## Desvios
- O smoke foi escrito antes e visto falhar (rodado contra o `src/` anterior); a implementação já estava escrita quando rodei a 1ª vez, então a falha foi conferida depois, com `git stash` de `src/`.
- "Ombros 3 px mais baixos" e "cabeça 2 px mais alta" são feitos deslocando o busto inteiro no círculo (3 px para baixo na `insegura`, 2 px para cima na `firme`), sem mexer nas funções do boneco.
- O balão tem altura mínima de 92 px (o roteiro não diz), para caber o círculo de 68 px numa fala de uma linha.
- Na Bia, as sobrancelhas se perdem no cabelo e no lenço (escuros, como a pele); a diferença entre as expressões dela vem dos olhos e da boca. Não houve mudança na tabela.
- `menu_fit.py` não rodou aqui (falta o módulo `playwright` do Python); o menu não mudou.

**Modelo:** Sonnet, esforço alto (desenho no canvas, conferido por captura).
