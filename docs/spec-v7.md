# Lanchonete Corre-Corre — v7 (Contas)

Pedido (15/10/2026): retorno do Renan Martorelli (design de games): "estou no dia 5 e tenho dinheiro de sobra pra fazer tudo, tem que ter uma sensação de escassez de recursos". Na conversa com o usuário surgiram custos de manutenção (luz, espaço), divulgação (redes aumentam a freguesia, sem divulgar vem pouca gente), aluguel em área nobre e modo história. O usuário escolheu, nesta versão, **ingredientes + contas do dia + divulgação**, com **a meta do dia em lucro**. Ponto (bairro, centro, área nobre) e modo história ficam para depois.

## O problema, medido
- Na v6, 100% do faturamento ia para o dinheiro acumulado e a meta era o faturamento: gastar nunca punha o dia em risco.
- Tudo o que dá para comprar (6 melhorias, salão, equipe completa do dia 3 ao 7) somava ~R$ 3.800, contra ~R$ 10.400 de faturamento do bot nos 7 dias.
- `tests/carreira.js` (bot jogando a carreira com o dinheiro de verdade, 1 melhoria por dia e a equipe completa do dia 3 em diante), dinheiro na lojinha:

| Antes do dia | v6 | v7 |
|---|---|---|
| 3 | R$ 1.313 | R$ 518 |
| 4 | R$ 2.402 | R$ 883 |
| 5 | R$ 3.410 | R$ 1.319 |
| 7 | R$ 6.074 | R$ 2.671 |

O bot é um teto (joga melhor que a maioria das pessoas); um jogador real chega ao dia 5 com menos.

## Meta em lucro
- **Lucro do dia = faturamento − ingredientes − contas do dia − folha − divulgação.**
- A folha e a divulgação saem do dinheiro acumulado ao abrir a lanchonete (como a folha na v5). As contas e os ingredientes saem no fim do dia: o acumulado recebe `faturamento − ingredientes − contas`, sem ficar negativo.
- O dia **começa no vermelho**: o HUD mostra o lucro (ex.: R$ −616 em vermelho no começo do dia 5 com a equipe), com "lucro · meta R$ X" embaixo da barra.
- Estrelas: as mesmas regras (1 na meta, 2 em `bomGoal`, 3 na expert sem perder ninguém), agora sobre o lucro.
- **Ranking da carreira:** continua somando o **faturamento** dos melhores dias (`save.best`), para não misturar escalas com as pontuações já gravadas (o db só deixa ler `ranking-carreira` e `ranking-semfim`). O Turno sem fim continua pontuando o faturamento.

## Ingredientes (`INGRED`)
- **Prato:** 60% da conta do grupo (`bill`), cobrado quando o prato **fica pronto** na cozinha (texto vermelho "-N" acima do "Pronto!"). Se o grupo vai embora antes de comer, o prato já custou.
- **Suco:** R$ 5 por copo entregue (vale R$ 12).
- Por que 60% e não os 30–35% de um restaurante de verdade: a conta é só uma parte do que entra (corações, gorjeta, corrente, sentar, cor, sucos e bônus somam ~3× a conta). Com 35% da conta, os ingredientes eram só ~12% do faturamento; com 60%, ~20%.

## Contas do dia (`CONTAS`, `contasDia`)
- Aluguel **R$ 120** + luz e gás de **R$ 30 por mesa aberta** + **R$ 6 por lugar** dessas mesas.
- Dia 1: R$ 246 (3 mesas, 6 lugares). Dias 4 a 7 com o salão padrão: R$ 396 (6 mesas, 16 lugares). Com 8 mesas: +R$ 30 por mesa e +R$ 6 por lugar.
- Assim o salão maior também custa todo dia: mesa nova só compensa se trouxer gente (divulgação) e houver quem atenda.

## Divulgação (`DIVULGA`, aba nova na lojinha)
- Do **dia 3** em diante (`DIVULGA_DIA`), escolhida na aba **Divulgação** e guardada no save (`save.divulga`, padrão panfletos). Nos dias 1 e 2 o movimento é o da inauguração, sem custo.

| Opção | Custo/dia | Grupos do dia | VIPs |
|---|---|---|---|
| Boca a boca | grátis | 60% a 90% (sorteado: pode ser um dia fraco) | normal |
| Panfletos | R$ 40 | 100% | normal |
| Redes sociais | R$ 100 | 120% | ×1,5 (do dia 5 em diante) |

- Paga junto com a folha. Sem dinheiro para as duas, **a divulgação vira boca a boca primeiro** (e a agenda do dia é refeita); depois saem couvert, Dani e aumento do Tonhão, como antes.
- Na lojinha, só dá para escolher a opção que o dinheiro paga junto com a folha; boca a boca sempre pode.
- A mesma aba mostra o cartão **Contas do dia N** (aluguel, mesas, lugares, total e ingredientes). A linha embaixo da lojinha resume: "Folha R$ X + panfletos R$ 40 ao abrir; contas R$ Y e ingredientes no fim do dia. A meta é o lucro."

## Menos gente na base (dias 3 a 7)
- Com a equipe completa, o bot deixava 5 a 13 grupos sem lugar por dia e perdia 2 a 6. O gargalo é atender (a Bia, a Dani e a cozinha), não as mesas: com 8 mesas o bot senta mais gente e perde mais.
- Mais gente além disso só trazia multas (R$ 30 por grupo bravo) e pratos perdidos. Boca a boca rendia o mesmo que panfletos, e redes sociais rendiam menos: a divulgação não seria escolha.
- Grupos dos dias 3 a 7: **13, 15, 16, 16 e 17** (eram 18, 22, 26, 29 e 33), perto do ponto em que o lucro do bot para de subir. Agora panfletos rendem mais que boca a boca nos dias 3 a 6, e redes sociais rendem mais no dia 7 (com mais VIPs). Para quem atende rápido, redes são uma aposta.
- Lucro médio do bot com a equipe completa (60 rodadas):

| Dia | Boca a boca | Panfletos | Redes sociais |
|---|---|---|---|
| 3 | 425 | 674 | 571 |
| 5 | 729 | 800 | 730 |
| 7 | 874 | 932 | 986 |

## Metas (lucro)
| Dia | Meta | 2 estrelas | Expert | Bot com equipe | Bot sem equipe |
|---|---|---|---|---|---|
| 1 | 200 | 250 | 320 | 100% | 100% |
| 2 | 300 | 500 | 720 | 92% | 100% |
| 3 | 380 | 625 | 880 | 95% | 73% |
| 4 | 300 | 550 | 780 | 97% | 67% |
| 5 | 480 | 800 | 1100 | 80% | 45% |
| 6 | 460 | 775 | 1100 | 90% | 43% |
| 7 | 600 | 925 | 1250 | 92% | 38% |

- Sem equipe ficou mais possível que na v6 (antes ~5–10%), porque a equipe agora custa no lucro do dia. Mas ela continua valendo a pena (~+R$ 390 de lucro no dia 5) e a expert praticamente exige equipe.

## Telas
- **Introdução do dia:** "Meta de lucro: R$ X · 2 estrelas · Expert · N grupos (panfletos) · tempo. Custos do dia: contas R$ Y + folha R$ Z + panfletos R$ 40, mais 60% de cada prato em ingredientes."
- **Fim do dia:** "Lucro de R$ X" ou "Prejuízo de R$ X" e dois quadros lado a lado (empilham na tela estreita): o atendimento (atendidos, perdidos, VIPs, sucos, lixeira, não couberam, corrente) e as contas (faturamento, ingredientes, contas do dia, folha, divulgação, **lucro do dia**, dinheiro acumulado).
- **Turno sem fim:** o quadro final mostra "Ingredientes e contas"; o acumulado recebe faturamento − ingredientes − contas.
- **Como jogar:** dica nova sobre o lucro e a divulgação.
- `fmt` mostra valores negativos como "-R$ 50".

## Código
- `10-constantes.js`: `CONTAS`, `INGRED`, `DIVULGA`, `DIVULGA_DIA`, `divulgaOf`, `contasDia`; grupos e metas dos dias.
- `12-clientes.js`: `normSave` guarda `divulga`.
- `13-cozinha.js`: ingredientes do prato pronto. `14-bia.js`: ingredientes do suco entregue.
- `16-jogo.js`: `g.custo`, `g.contas`, `g.paidDiv`, `g.div` e `g.divF` (fator de grupos sorteado em `resetDay`); `get fixo` e `get lucro`; `buildSchedule` usa `g.divF` e o VIP ×`div.vip`; `payDay` paga a divulgação e a rebaixa a boca a boca se faltar dinheiro; `finishDay` e `finishEndless` com as contas; `setDivulga(id)` e `payroll()`.
- `22-salao-hud.js`: HUD do lucro. `41-lojinha.js`: aba Divulgação e ícones. `42-resultados.js`: quadros do fim do dia. `43-telas.js`: introdução; `window.__lcc.setShopTab` (para testes).

## Testes
- `smoke9` (33 testes): save, contas por mesa e lugar, grupos e VIPs de cada divulgação, pagamento e rebaixamento a boca a boca, lojinha, ingredientes do prato e do suco, fim do dia (lucro, acumulado, prejuízo), introdução, HUD e Turno sem fim.
- `smoke6` e `smoke8` ajustados (acumulado e estrelas pelo lucro).
- `balance.js`: mostra faturamento, ingredientes, contas, folha e divulgação; aceita `DIV=boca|panfleto|redes`, `MULT=0.7` (fração fixa dos grupos) e `SALAO='{...}'`.
- `carreira.js` (novo): a carreira com o dinheiro acumulado de verdade; `CONTAS='{...}'` e `INGRED='{...}'` testam valores sem mexer em `src/`.
- `shot_v7.py`: capturas em `capturas/v7`.

## Para ajustar depois
- Os valores (`CONTAS`, `INGRED`, `DIVULGA`, metas) foram calibrados com o bot; falta jogo real. Se ainda sobrar dinheiro, o primeiro botão é `INGRED.prato` (0,7 tirava ~R$ 300 do bot até o dia 5 nas simulações).
- Próximos passos conversados: escolher o ponto (bairro, centro, área nobre com aluguel alto, preços maiores e VIPs exigentes) e o modo história (o sonho da Bia, do zero até a estrela de um guia gastronômico inventado, sem usar marcas reais).
