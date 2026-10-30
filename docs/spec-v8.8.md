# v8.8 — Etapa 2g: o Tonhão sobe de nível com os cursos (30/10/2026)

O nível do Tonhão deixa de ser só salário: passa a ser **experiência (XP)**. Cada curso dá XP; com a XP do nível seguinte ele fica pronto para subir, e o aumento de salário **consolida** o nível.

## O que mudou
- **5 níveis** (`STAFF.tonhao.levels`, cada um com `xp`): 0 / 2 / 5 / 9 / 14. Rapidez (`cook`) 1 / 0,85 / 0,7 / 0,62 / 0,55; caprichados (`crit`) 0,05 / 0,12 / 0,2 / 0,26 / 0,32; pia (`wash`) não / 7 / 4 / 3 / 2,5 s; `AVAL.prato` com 5 faixas (2,5–4,5 até 4–5). Diárias: ver a conferência abaixo.
- **XP** (`CURSO_XP`, `tonhaoXp`, `tonhaoNivelXp` em `10-constantes.js`): curso básico +1, avançado +2 (o PF só tem o avançado, +2); máximo 17.
- **`setStaff('tonhao', v)`** recusa `v` acima da XP e qualquer baixa (fora do modo dev). **Sem "Reduzir"**: o nível pago é definitivo. Sem dinheiro para a folha (`folhaCorta`) ele cai 1 nível, mas a XP fica e o aumento volta a valer sem curso novo.
- **`buyCurso`**: se o curso deixou o Tonhão pronto para subir, a mensagem ganha "Ele já pode subir para o nível N: pague o aumento no cartão dele."
- **Lojinha** (`buildTonhao`): "Tonhão · nível N de 5", linha "Experiência: X de Y para o nível N+1" com barrinha (no 5: "nível máximo"), botão "Aumento: +R$ N/dia" (apagado sem a XP, com "Faltam Z de experiência: cada curso básico dá +1 e cada avançado +2."). Cartões de curso mostram "+1 de experiência" / "+2 de experiência". "Como jogar" explica a regra.
- **Save:** `tonXp:1`. `loadSave` rebaixa **uma vez** o Tonhão ao nível que a XP dos cursos feitos permite; `normSave` não rebaixa (testes e bots montam equipes à mão).

## Conferência do "Reduzir" (`balance.js 120`, `EQUIPE={"tonhao":k,"dani":4,...tv,som}`, dias 3 a 7)
| k (nível) | lucro líquido médio | + diária = bruto | ganho do passo |
|---|---|---|---|
| 0 (1) | 261,2 | 261,2 | |
| 1 (2) | 262,0 | 277,0 | +15,8 |
| 2 (3) | 259,6 | 289,6 | +12,6 |
| 3 (4) | 246,0 | 291,0 | +1,4 |
| 4 (5) | 236,2 | 296,2 | +5,2 |

Com as diárias do plano (15/30/45/60) só o passo 1→2 rende (≥ R$ 15 em 4 dos 5 dias). Pela regra do plano, a diária dos outros passos baixou ao piso (nível de baixo + R$ 5): **0 / 15 / 20 / 25 / 30**. Os passos para os níveis 4 e 5 seguem sem pagar no bot (que não vê o ganho no Gurugol nem nos caprichados), mas custam só R$ 5/dia a mais; por isso o "Reduzir" saiu mesmo assim, como pedido (o nível pago é para sempre).

## Testes
- `smoke35` (novo, 40): XP, nível por XP, `setStaff`, `buyCurso`, lojinha, folha que não cabe, `loadSave` (rebaixa uma vez), nível 5, modo dev. `smoke15` (save de teste já com `tonXp:1`) e `smoke24` (folha completa R$ 80) ajustados.
- `carreira.js`/`emprestimo.js`: `FULL` começa em `tonhao:4` e `capT` limita o Tonhão pela XP; linha nova `TONHAO` (dia médio em que chega a cada nível); o bot compra o curso **antes dos móveis**, com reserva de R$ 150 (`RCURSO=n` troca; com R$ 300, o nível 2 só chegava ao dia 12).
- `node carreira.js 8`: nível 2 no dia 4,8 e nível 3 no dia 9,9 (alvos: dia 6 e dia 12); cap. 1 a 3 nos dias 2 / 3 / 12 (v8.7: 2 / 5 / 13); 0 dia no negativo. `balance.js 40`: sem equipe passou 28, 31, 29, 17 e 22 de 40 (v8.7: 27, 28, 28, 18, 17); `EQUIPE=auto`: 39, 40, 40, 38 e 36 (v8.7: 40, 40, 39, 39, 36).

## Fora
A progressão dos cozinheiros da Avenida Brasil e do Terraço; cursos novos.
