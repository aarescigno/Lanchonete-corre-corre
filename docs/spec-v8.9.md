# v8.9 — Etapa 2h: a Dani sobe de nível com trabalho e cursos (30/10/2026)

Mesma ideia do Tonhão (v8.8): o nível da Dani passa a ser **experiência (XP)**; com a XP do nível seguinte ela fica pronta para subir, e o aumento de salário **consolida** o nível. A XP vem de dois jeitos: do **trabalho** (ela aprende fazendo) e de **cursos** dela na lojinha.

## O que mudou
- **Níveis** (`STAFF.dani.levels`, com `xp`): aprendiz 0 / 2º 4 / 3º 8 / 4º 13. Velocidade, tarefas e rapidez como antes; **diárias 0 / 15 / 20 / 25** (eram 0 / 25 / 40 / 55), pela conferência abaixo.
- **XP** (`DANI_XP = { tarefas:5, curso:2 }`, `daniXp(save)`, `daniNivelXp(save)` em `10-constantes.js`): +1 a cada 5 tarefas que ela termina (`save.daniTar`, total da carreira) e +2 por curso dela (`save.daniCursos`).
- **Tarefas contadas** (`Helper.feitas`, `15-dani.js`): lixo esvaziado, viagem de pratos sujos à pia, pilha lavada, cafezinho servido, água/suco levado, marmita levada ao balcão. Só o **dia completo** conta: `finishDay` soma `feitas` em `save.daniTar`; dia interrompido não soma.
- **3 cursos dela** (`DANI_CURSOS`): Atendimento ao cliente R$ 120, Organização da cozinha R$ 150, Barista iniciante R$ 180; +2 de XP cada, sem outro efeito por enquanto. `buyDaniCurso(id)`, um por lojinha (`save.daniCursoDia`), **à parte** do curso do Tonhão. Só aparecem depois que ela chega (cap. 2; modo dev, sempre).
- **`setStaff('dani', v)`** recusa `v` acima da XP e qualquer baixa (fora do modo dev). **Sem "Reduzir"**. Sem dinheiro para a folha ela cai 1 nível (nunca abaixo de aprendiz) e a XP fica.
- **Lojinha** (`buildDani`): linha "Experiência: X de Y para o nível N" com a barrinha da 2g, "Trabalho: Z tarefas até o próximo ponto", botão "Aumento: +R$ N/dia" (apagado com "Faltam Z de experiência: ela aprende trabalhando e com os cursos (+2 cada)."). Os 3 cartões de curso vêm logo depois ("+2 de experiência", "Curso feito", "A Dani já está num curso. Volte depois do próximo dia.").
- **Fim do dia:** "Dani: N tarefas hoje · experiência X." e, se ficou pronta, "A Dani já pode subir para o nível N!". "Como jogar" ganhou a frase da Dani.
- **Numeração:** a mesma do título do cartão ("aprendiz", depois "nível 1 de 3" a "nível 3 de 3"); por isso o 1º aumento é "para o nível 1" nas mensagens (no plano, o índice interno 2).
- **Save:** `daniTar`, `daniCursos`, `daniCursoDia`, `daniXp:1`. `loadSave` rebaixa **uma vez** a Dani ao nível da XP (save antigo volta a aprendiz); `normSave` não rebaixa.

## Calibração de `DANI_XP.tarefas` (`node carreira.js`, linha `DANI`)
O bot faz ~3 tarefas por dia como aprendiz; 1 XP a cada ~1,5 dia dá **5** tarefas por ponto (com 30, a XP quase só vinha dos cursos). `DIAS=18 node carreira.js 8`: nível 2 no dia 7,4, nível 3 no dia 9,0 e nível 4 no dia 10,6 (alvos: 7 / 11 / 16). Com 10: 8,0 / 9,8 / 14,9. Ficou 5 (o menor passo permitido); o `xp` do nível 4 segue 13.

## Conferência do "Reduzir" (`balance.js 120`, `EQUIPE={"tonhao":2,"dani":k}`, dias 3 a 7)
| k | lucro líquido médio | + diária = bruto | ganho do passo |
|---|---|---|---|
| 1 (aprendiz) | 250,8 | 250,8 | |
| 2 | 244,6 | 269,6 | +18,8 (rende R$ 25 em 2 de 5 dias; R$ 15 em 4 de 5) |
| 3 | 228,8 | 268,8 | −0,8 |
| 4 | 217,6 | 272,6 | +3,8 |

Pela regra do plano, o passo 1→2 baixou de R$ 25 para **R$ 15**; os outros não rendem nem com R$ 5 e foram ao piso (nível de baixo + R$ 5): **0 / 15 / 20 / 25**. Como na 2g, o bot não vê o ganho no Gurugol; o "Reduzir" saiu mesmo assim.

## Testes
- `smoke37` (novo, 38): XP, nível por XP, aumento, tarefas no dia completo, cursos e trava, lojinha, fim do dia, folha que não cabe, `loadSave`, modo dev.
- Ajustados: `smoke6`, `smoke17`, `smoke19`, `smoke24` (diárias novas), `smoke15` (`daniXp:1` no save) e `smoke34` (aumento com XP, sem "Reduzir").
- `carreira.js`: `capT` limita também a Dani pela XP; o bot compra os cursos dela depois do curso do Tonhão, com reserva de R$ 150; linhas novas `DANI` (dia em que chega a cada nível, tarefas por dia, XP no fim do dia). `emprestimo.js`: `capT` da Dani.
- `node carreira.js 20`: caps. 1 a 3 nos dias 2 / 3 / 14 (v8.8: 2 / 3 / 14); 10 de 20 carreiras chegam a R$ 800 (v8.8: 4); 0 dia no negativo. `balance.js 40`: sem equipe passou 25, 32, 29, 23 e 22 de 40; `EQUIPE=auto`: 40 em todos os dias (acima do alvo de 85–95%, pois a Dani cheia custa R$ 25 em vez de R$ 55).
- Capturas em `capturas/v8.9` (`tests/shot_v8_9.py`).

## Fora
A Dani barista/confeiteira, o Joca e o funcionário novo (Ideias guardadas).
