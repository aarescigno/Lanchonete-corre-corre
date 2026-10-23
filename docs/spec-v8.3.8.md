# v8.3.8 — Preços de verdade

Retorno do usuário em 23/10 (texto em `docs/PROPOSTAS.md`): na Garagem, "acumulo muito dinheiro"; "não tem como alguém gastar 100 reais numa lanchonete na garagem de alguém". O jogo deve ser relativamente realista, com preços compatíveis com o ponto.

## O que estava errado (medido com o bot, v8.3.7)
- Dias 8 a 14, Garagem, equipe completa, 16 lugares: lucro de ~R$ 1.870 por dia, contra uma meta de ~R$ 600; R$ 16.800 no dia 14.
- Do faturamento (~R$ 2.935/dia), só 47% era a conta. As ações da Bia davam 36%: sentar R$ 10, anotar R$ 15, entregar R$ 20, recolher R$ 10, ~R$ 55 por grupo, sem custo nenhum. Mais 6% das correntes e 11% de cor, VIP e cafezinho.
- Os 5 corações multiplicavam a conta por 1,5. Uma família de 4 pagava ~R$ 148.
- A comida em si dava prejuízo: ingredientes de 60% da conta, mais as contas e a folha.

## Decisões do usuário
- As ações viram **pontos de atendimento** (a etapa 2c vai ligá-los à nota da lanchonete; o plano é exigir 4,5★ para subir de ponto).
- A conta é **por prato do cardápio**, e cada pessoa pode pedir **até 2 itens** sem travar a mesa.
- Gorjeta pelos corações: **até +10%**.
- Juntar os R$ 800 da mudança em **~10 dias**.
- Bandeja, Jogo de pratos e juros do banco **ficam caros** (jogabilidade).
- A meta do dia continua sendo **só o lucro**, mais baixa.
- Primeiro os preços (esta versão); a nota do Gurugol fica para a v8.4.

## Pesquisa (out/2026)
PF médio no Brasil R$ 31,90 (FAC-SP, 2º tri); coxinha e pastel de R$ 4 a 8; cafezinho de R$ 2,70 a 5,70; ingredientes ("CMV") de 30 a 40% do faturamento; diária de freelancer de cozinha de R$ 100 a 150 por 10 h; salário mínimo de R$ 54,04 por dia; botijão de 13 kg de R$ 108 a 129; conjunto de mesa plástica com 4 cadeiras de R$ 270 a 370; 1.000 panfletos de R$ 80 a 330.

## O que mudou
**Cardápio (`CARDAPIO`, `precoPrato`):** PF R$ 25, misto quente R$ 12, pastel R$ 10, coxinha R$ 8, vezes `PONTOS.cardapio` (1 na Garagem). Cada tipo de cliente escolhe pratos de `prefere`: almoço, com mais PF para executiva, família e vovós.

**2º item (`MAIS`, `T.mais`):** ao chegar, cada pessoa pode querer mais um salgado (misto, pastel ou coxinha), com chance de 10 a 35% conforme o tipo. Nunca na Missão zero. O item vai na mesma comanda e no mesmo prato, e a cozinha leva 40% a mais por item, na proporção dos itens do grupo. A 1ª versão pedia o 2º depois de comer, mas isso travava a mesa (nova comanda, cozinha e entrega) e derrubava o lucro do bot de ~R$ 280 para ~R$ 60 por dia.

**Conta (`Group.bill`):** a soma do que cada um pediu, mais o prato especial do VIP (R$ 12). Na cobrança: `bill × (1 + GORJETA[corações] + gorjeta do tipo + gorjeta do VIP)`, com `GORJETA = [0, −20%, −10%, 0, +5%, +10%]`. A executiva e o VIP dão +10%.

**Pontos de atendimento (`PONTOS_ACAO`, `Game.pontos`):** sentar 10, anotar 15, entregar 20, recolher 10, cafezinho 5, suco 5, conta 20, cor certa 15; a corrente (+10, 20, 40… até 160), o caprichado (10, ou 20 no VIP) e o VIP com 5 corações (40) também. Nada disso é dinheiro. O que se paga vira dinheiro: a conta, o cafezinho (R$ 3) e o suco (R$ 8), mesmo servidos pela Dani. Na tela, "+N pts" (azul) e "+R$ N" (verde). O HUD mostra "N pts · grupos x/y". O fim do dia ganha a linha "Pontos de atendimento". `result.pontos` e `save.pontosTot` (soma da campanha) ficam guardados para a v8.4. No Turno sem fim, a pontuação do ranking passa a ser os pontos, e o fim mostra também o faturamento.

**Custos:**

| Item | v8.3.7 | v8.3.8 |
|---|---|---|
| Ingredientes | 60% da conta | 35% |
| Suco (preço / ingredientes) | 12 / 5 | 8 / 3 |
| Contas do dia | R$ 30 por mesa + R$ 6 por lugar | R$ 20 (gás e geladeira) + R$ 3 por mesa + R$ 1 por lugar |
| Aumento do Tonhão | R$ 40 / 90 | R$ 15 / 30 |
| Dani | R$ 60 / 90 / 135 | R$ 40 / 50 / 60 |
| TV / som | R$ 15 / 10 | R$ 3 / 2 |
| Panfletos / redes | R$ 40 / 100 | R$ 20 / 40 |
| Multa de quem sai bravo (VIP: +) | R$ 30 (+30) | R$ 10 (+10) |
| Revisão (fogão / geladeira / cafeteira) | 500 / 440 / 240 | 120 / 100 / 60 |
| Conserto na hora | 120 / 100 / 50 | 40 / 30 / 15 |

Ficam como estavam: mesas (R$ 150 e 250, já preço de loja), melhorias, Bandeja, Jogo de pratos, banco e couvert (só do nível 3).

**Metas (lucro) e 3 estrelas:** dia 1 60/130, 2 200/340, 3 150/290, 4 100/230, 5 150/320, 6 150/300, 7 180/360 (antes 200 a 600 / 320 a 1.250). Do dia 8 em diante, a do dia 7 com o fator do dia da semana.

**Textos:** a placa da parede lê o cardápio. Mudaram a Missão zero (pontos, gorjeta de 10%, 2º item), o Como jogar (preços do cardápio, pontos de atendimento, VIP), a nota do dia 5 (VIP) e a lojinha (caprichado em pontos).

## Números (bot)
- `balance.js 40`, dias 3 a 7: sem equipe, 66% das metas (alvo 40–70%); com `EQUIPE=auto`, 88% (alvo 85–95%). Com equipe, faturamento de R$ 530 a 740 e lucro médio de R$ 190 a 310 por dia.
- `carreira.js 10`: o bot padrão chega a R$ 800 no dia 10 (era o dia 3); comprando mesas de 4, no dia 5; só com o kit, no dia 5, mas fica com 10 lugares. No dia 14, de R$ 1.400 a 3.500 (eram ~R$ 16.800).
- `MANUT=cuida`: revisar tudo custa 14,7% do lucro (alvo 10–15%).
- `emprestimo.js` (mesas de 4): pegar empréstimo cedo agora empata ou ganha um pouco (+R$ 60 com "cedo", +R$ 360 com "amortiza" no dia 14), porque as mesas ficaram baratas em relação ao lucro. Os juros ficaram como estavam, por decisão do usuário.
- `BOT=afiado` perde gente nos dias 4 a 7 como na v8.3.7 (o limite de louça e a fila); não piorou.

## Testes
- `smoke24.js` (novo): cardápio e conta, 2º item (máximo 2 por pessoa, nunca no treino), tempo da cozinha, ingredientes da conta inteira, pontos (e não dinheiro) de cada ação e da corrente, cafezinho e conta pagos, gorjeta de 10%, resultado e `pontosTot`, HUD, fim do dia, custos, metas e Como jogar.
- Os smokes 2 a 6, 9, 11, 13, 14, 16 a 20 passam a ler os valores de `L` (folha, divulgação, multa, contas) em vez de números fixos.
- `balance.js` e `carreira.js` aceitam `CARDAPIO='{"pf":28}'` e `MAIS='{"cozinha":0.3}'`.
- Capturas em `capturas/v8.3.8` (`tests/shot_v8_3_8.py`): o dia com os pontos e a placa, o fim do dia e o Como jogar.
