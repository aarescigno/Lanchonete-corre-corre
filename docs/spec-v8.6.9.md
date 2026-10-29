# v8.6.9 — O cardápio cresce: cursos do Tonhão e gostos dos clientes

Etapa 2c-r3a (`docs/PLANO.md`). Os desenhos próprios dos pratos vêm na 2c-r3b (v8.6.10) e os vegetarianos na 2c-r3c (v8.6.11).

## O que mudou
- **`CARDAPIO`** (`10-constantes.js`): 14 pratos, cada um com `cat` (pf, frito, assado, chapa, pastel), `curso`, `carne` e `cor` (do desenho provisório). A Garagem começa com **PF 25 e coxinha 8**; o misto caiu de 12 para 10. O pastel virou "Pastel de carne".
- **`CURSOS`**: pastel (R$ 150 / avançado 300), chapa (180 / 360), fritos (220 / 440), assados (250 / 500) e PF (sem básico; só o avançado "Carnes variadas", R$ 400, que na 2c-r3b sorteia a proteína). `CURSO_AV = { preco:1.15, crit:1.5 }`. O curso se chama "Chapa" (pedido do usuário: sem o "1").
- **Preço** (`precoPrato(k, ponto, cursos)`): ×1,15 nos pratos do avançado feito (PF 29, coxinha 9). **Caprichado**: `Kitchen.chefCrit(dish)` multiplica a chance do Tonhão por 1,5 nesses pratos (pratos e marmitas).
- **Gostos** (`GOSTOS`, `pedePrato(tipo, game, semPf)`): pesos por categoria para cada tipo; o entregador muda por terço do turno. Só entram pratos que a cozinha sabe; o 2º item (`extras`) usa os mesmos pesos sem o PF. `CUSTOMER_TYPES.prefere` e `MAIS.pratos` deixaram de existir.
- **Onde vale cada cardápio** (`Game.cursos`): carreira pelo save; Missão zero, só PF e coxinha; Turno sem fim, os 14 pratos dos 4 básicos, sem avançado.
- **Diversidade do cardápio** (Gurugol): `AVAL.menu = { base:2, porCurso:0.6 }`; `avalMenu(cursos)` conta só os cursos básicos (2,0 de início, 4,4 com os quatro).
- **Save**: `cursos`, `cursoDia`, `cardV:1`, `avisoCard`. Save sem `cardV` (de antes): a campanha recomeça do dia 1 (a Missão zero, o ranking e a abertura ficam); se já tinha jogado, o menu mostra "Novidade: o cardápio agora cresce..." até o jogador tocar em "Entendi". Um curso por lojinha (`Game.cursoTrava`).
- **Lojinha, aba Cursos** (`buildCursos`): um cartão por curso (o básico com os pratos e preços e "+0,6 ★ na Diversidade"; feito o básico, o avançado com a receita, "+15%" e "capricha mais ×1,5"). `Game.buyCurso(id)` desconta, anota no Caixa (Compras) e mostra "O Tonhão foi fazer o curso de <nome>!".
- **Placa do cardápio**: "PF · Coxinha · Cafezinho". **Como jogar**: dica nova dos cursos e dos gostos.
- **Desenho provisório** (`drawComida`): os pratos novos usam o desenho da categoria, na cor do prato.
- **Metas** dos dias 2 a 5 −10% (calibração): 120→108, 150→135, 70→63, 100→90.

## Testes e ferramentas
- Smoke 31 (novo, 45 conferências); smokes 24 e 25 ajustados (preços, `GOSTOS`, metas, `avalMenu`); `harness.js` marca o save injetado como novo (`cardV`), salvo com `saveAntigo:true`.
- `bot.js`: `cursosApos` e `cursos` (ordem padrão: os 4 básicos, depois PF, fritos, pastel, chapa, assados avançados). `balance.js`: `CURSOS=bot|todos|0|lista`, o dia d começa com d−1 compras. `carreira.js`: compra 1 curso por lojinha com a reserva dos móveis, mostra o dia de cada curso, aceita `BOT=afiado` e mostra a nota geral do Gurugol por dia. `tests/shot_v8_6_9.py`: capturas em `capturas/v8.6.9`.

## Calibração (`balance.js 60`, % das metas batidas nos dias 3 a 7)
| | base (v8.6.8) | novo, metas antigas | com as metas −10% (média de 2 rodadas) | alvo |
|---|---|---|---|---|
| sem equipe | 63,7% | 54,0% | ~54% (−9) | até −8 |
| `EQUIPE=auto` | 93,7% | 87,3% | ~88% (−6) | até −5 |
| afiado, `EQUIPE=auto` (N=40) | 78% | — | 75% | — |

Fechou quase: o que sobrou de queda vem dos dias 6 e 7, que o plano não deixa mexer, e a variação entre rodadas é de ±4 pontos. O ticket médio caiu ~25% (PF passou de ~65% para ~25% dos pedidos do estudante), por isso o lucro de equipe completa foi de R$ 267 para ~R$ 220 por dia.
- Nota geral do Gurugol (`carreira.js`, bot afiado, 10 dias): 2,3 no dia 2 a 2,6 no dia 10, ou seja, **abaixo da nota mínima de 2,9** da Garagem. O bot compra os cursos devagar (só com o preço mais a reserva de R$ 300): fica para a etapa 3, onde a nota mínima passa a valer, ver com o usuário se as metas ou a nota base mudam.

**Próximo passo:** depois da 2c-r3c (v8.6.11) haverá uma rodada de balanceamento (2c-r3d, v8.6.12) para fechar a calibração e a nota mínima.
