# v7.4.1 — Salão cheio chama gente

Ajuste de equilíbrio pedido pelo usuário em 21/10 (textos em `docs/PROPOSTAS.md`): "o objetivo é que valha a pena comprar mais mesas e mais cadeiras no fim das contas". Na v7.4, mesa a mais só dava prejuízo, com qualquer número de pratos e até para o bot "perfeito".

## 1. Por que as mesas não se pagavam
Testes com o `balance.js` (dias 3 a 7, 3 a 6 pratos, salões de 10 a 16 lugares, com e sem equipe, bot normal e afiado):
- **O movimento do dia era fixo** (`DAYS[n].groups`). Com o kit de 10 lugares, só ~1 grupo por dia ia embora com "Lotado!": não havia cliente a mais para ganhar.
- **Quem trava é a Bia, não a cadeira.** Mais mesas = mais grupos esperando sentados ao mesmo tempo, perdendo corações; e a conta é multiplicada pelos corações (`HEART_MULT`). Até o bot afiado, sem perder ninguém, faturava menos com 16 lugares do que com 10.
- Cada mesa ainda custa por dia (R$ 30 + R$ 6 por lugar).
- Os pratos limpos não eram o gargalo: com 6 pratos, o kit continuava ganhando. Desligar a fila justa e a porta também não mudava a ordem.

## 2. O que mudou
- **Movimento do salão** (`MOVIMENTO = { kit:10, porLugar:0.06 }` e `movimentoSalao(lugares)`, em `10-constantes.js`): cada lugar aberto acima dos 10 do kit traz 6% mais grupos no dia (16 lugares: +36%). Entra em `Game.buildSchedule` multiplicando o número de grupos (junto da divulgação); o intervalo entre chegadas encolhe na mesma proporção. Vale em todos os dias da carreira; o Turno sem fim não muda.
- **Lojinha, aba Salão:** linha nova "Cada lugar acima de 10 traz 6% mais clientes (hoje, +X%)." (some no celular deitado, como a linha de luz e gás). "Como jogar": "mais lugares trazem mais clientes".
- **4 pratos limpos** do dia 3 em diante (eram 3; com o Jogo de pratos, 5). O aviso do dia 3 diz "agora só há 4 pratos limpos". Sozinho, rende ~R$ 20 a 80 por dia.
- **Fila justa um pouco menos paciente:** `FILA_JUSTA.ritmo` 0,4 → 0,6 (sem mesa que sirva, a paciência na fila corre a 60% do normal; o piso de 1 coração continua). Pedido do usuário ("reduzir um pouco a complacência das pessoas esperando na fila quando a casa estiver cheia"). Efeito pequeno: ~R$ 10 a 40 a menos por dia, parecido em todos os salões.

## 3. Quanto 6% rende
`balance.js`, lucro médio por dia nos dias 3 a 7, ganho sobre o kit e dias para pagar os móveis (bot afiado, equipe auto, movimento 0 · 3% · 4,5% · **6%** · 8% · 10% por lugar):

| Salão (custo) | 0 | 3% | 4,5% | **6%** | 8% | 10% |
|---|---|---|---|---|---|---|
| 12, virar 1 mesa (R$ 100) | +23 | +127 | +154 | **+224 (0,4 dia)** | +290 | +322 |
| 14, +2 mesas de 2 (R$ 300) | −107 | +14 | +57 | **+68 (4,4 dias)** | +102 | +106 |
| 16, +3 mesas de 2 (R$ 450) | −168 | −69 | −43 | **−95** | −88 | −108 |
| 16, virar + mesa de 4 (R$ 350) | −61 | +170 | +300 | **+329 (1,1 dia)** | +351 | +366 |

- **Sem equipe**, salão maior continua dando prejuízo (a Bia sozinha não dá conta de tanta gente), em qualquer valor testado.
- **Muitas mesas de 2** nunca se pagam: são mais mesas para a Bia visitar. O que rende são **mesas de 4** (e virar as de 2).
- Por isso 6%: com 4,5% as mesas de 4 já se pagam; com 6% a recompensa fica clara; acima disso o ganho a mais é pequeno e o salão grande sem equipe continua punido.

`carreira.js` (dinheiro na lojinha do dia 7, 100 carreiras): kit (`MOVEIS=0`) R$ 4.258; mesas de 2, regra padrão do bot, R$ 3.501; **mesas de 4 (`MOVEIS=quatro`, chega a 4 mesas de 4 no dia 4) R$ 5.185** (com 0%: R$ 3.966; 4,5%: R$ 5.009; 8%: R$ 5.430).

## 4. Testes
- **Erro corrigido no `balance.js`:** o salão de 16 lugares dos dias 4 a 7 (`[2,2,2,4,2,2,2]`) não cabia na arrumação automática e o `normSalao` voltava ao kit sem avisar: esses dias eram medidos com 10 lugares. Agora é `[2,2,2,2,2,2,4]` (o salão a que a `carreira.js` chega), e o `balance.js` para com erro se um salão pedido não couber.
- `MOVIMENTO='{"porLugar":0.04}'` no `balance.js` e no `carreira.js` testa outros valores; `MOVEIS=quatro` no `carreira.js` usa a compra de mesas de 4 (`bot.moveis(..., 'quatro')`).
- `smoke6` e `smoke13` com 4 pratos. `smoke6`, "a Dani chega a 2 itens": joga até 4 rodadas dos 10 dias enquanto ela não chega a 2 (dependia do sorteio e falhava ~1 em 15).
- `balance.js` padrão (agora com 16 lugares de verdade e +36% de grupos nos dias 4 a 7): sem equipe passa a meta em 99 · 95 · 89 · 91 · 75% nos dias 3 a 7; `EQUIPE=auto` em ~98%.
- Bot afiado com `EQUIPE=auto` e 4 mesas de 4: 0,0 perdidos sentados nos dias 3 a 7; os dias "sem perda nenhuma" caem (8 a 49 de 60) só por causa de "Lotado!" na porta, já que vem mais gente. Com o kit, continua em ~97%.
- Capturas: `shot_v7_4_1.py` → `capturas/v7.4.1`.
