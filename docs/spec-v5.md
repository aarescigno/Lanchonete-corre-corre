# Lanchonete Corre-Corre — v5 (Equipe)

Pedido: sobra dinheiro no cofre. Entram contratações com salário, aumento do Tonhão, louça limitada com a Bia lavando, lixo que enche e couvert artístico. A proposta original tinha robôs para o lixo e a louça, mas o usuário vetou: só pessoas.

## Economia (revisada a pedido do usuário: sem "cofre")
- **Dinheiro acumulado** (`save.bank`): recebe **todo o faturamento** de cada dia de carreira e de cada Turno sem fim. Antes era só o que passava do recorde, e na primeira v5 eram 30%.
- **Folha do dia** (`payroll(equipe)`): é **debitada no início do dia**, ao clicar em "Abrir a lanchonete" (`Game.payDay`). O faturamento do dia nunca entra na conta para pagar a equipe.
- **Sem dinheiro para pagar todos:** o funcionário não trabalha naquele dia e é dispensado, nesta ordem: couvert, Dani, um nível de aumento do Tonhão. Aparece o aviso "Sem dinheiro para pagar: …".
- **Contratar na lojinha** (`setStaff`): só é possível se o dinheiro acumulado cobrir a folha nova. Contratar e dispensar não contam no limite de 1 melhoria por dia.
- **Telas:** a lojinha mostra "Dinheiro acumulado"; o fim do dia mostra "Folha paga hoje" e "Dinheiro acumulado".
- **Save:** `save.equipe = { tonhao, dani, daniTasks, couvert, taxa }`, normalizado por `normEquipe`.

## Lojinha com abas
- A lojinha passa a ter duas abas: "Melhorias", com as 6 melhorias, e "Equipe".
- A aba Equipe tem 3 cartões:

| Cartão | O que tem |
|---|---|
| Chef Tonhão | aumento e redução de nível |
| Dani | contratar, promover, dispensar e as 5 tarefas como botões de liga e desliga |
| Couvert | contratar ou dispensar, e o botão "Cobrar couvert" |

- Os cartões ficaram horizontais (ícone à esquerda) para não rolar a tela. Em telas baixas, o título e a linha da folha somem. Só o menor celular deitado (568×320) ainda rola.

## Chef Tonhão (`STAFF.tonhao`)
Revisto depois da análise das melhorias: as bocas a mais não ajudavam (o gargalo é a Bia e a louça). Agora são sempre 3 bocas, e o aumento mexe na velocidade, no capricho e na pia.

| Nível | Tempo de preparo | Prato caprichado ★ | Lava na pia | Salário |
|---|---|---|---|---|
| 1 | normal (4 a 7 s) | 5% | — | — |
| 2 | 85% | 12% | 1 pilha a cada 7 s | +R$ 40/dia |
| 3 | 70% | 20% | 1 pilha a cada 4 s | +R$ 90/dia |

- **Prato caprichado** (`CRIT`): sai com ★ na janela de prontos e na mão da Bia; na entrega dá +2 corações (em vez de +1) e R$ 10 a mais (R$ 20 para VIP).
- **Prato especial do VIP** (`VIP.dish`, `VIP.cook`): soma R$ 25 à conta do VIP (antes dos corações e da gorjeta) e leva 1,8× o tempo; aparece com aro dourado na janela de prontos. Um Tonhão mais rápido deixa o VIP menos tempo esperando.
- **Pia:** quando alguém além da Bia lava (a Dani com a tarefa, ou o Tonhão com aumento: `game.otherWasher`), a Bia só deixa a louça (0,3 s). Tocando na pia de mãos vazias, ela mesma lava tudo o que estiver lá.

## Dani, a ajudante (`class Helper`, `STAFF.dani`)
| Nível | Velocidade (fração da Bia sem tênis) | Tarefas | Salário |
|---|---|---|---|
| 1 | 50% | 2 | R$ 60/dia |
| 2 | 65% | 2 | R$ 90/dia (+50%) |
| 3 | 80% | 3 | R$ 135/dia (+50%) |
- **Tarefas possíveis** (`DANI_TASKS`): tirar o lixo, retirar pratos sujos, lavar a louça, servir cafezinho e recarregar a água saborizada (quando restam 2 doses ou menos, pagando R$ 15). A escolha é feita na lojinha; valem as primeiras N da lista, conforme o nível.
- **Funcionamento:** ela age sozinha (`think` a cada 0,25 s) e leva 1 item em cada mão.
- **Prioridades:** entregar o café que está carregando; recolher louça (até 2 pilhas); levar a louça à pia; lavar o que estiver na pia; esvaziar a lixeira a partir de 6/8; buscar cafezinho para a mesa com menos corações (≤3).
- **Convivência com a Bia:**
  - a Dani não mexe em mesas que estão na fila de ações da Bia;
  - o bot e o jogo evitam a mesa para onde a Dani está indo (`dani.targets(t)`);
  - as ações dela rendem dinheiro direto (+10 por mesa limpa, +5 por café), sem mexer na corrente da Bia.
- **Visual:** cabelo cacheado, avental roxo e crachá "Dani".

## Louça limitada e lavagem
- **Estoque de pratos limpos** (`dishStock`): sem limite nos dias 1 e 2; do dia 3 em diante, igual ao número de mesas abertas (−1 nos dias 6 e 7); 6 no Turno sem fim.
- **Prato pronto:** só vai ao balcão se houver prato limpo. Se não houver, o Tonhão espera com o balão "Sem prato!". O estoque aparece ao lado de "PRONTOS" (pilha + "×n", vermelho quando zera).
- **Pia:** a louça entra numa fila (`kitchen.sinkN`). Lavar leva 0,3 s + 1,5 s por pilha (`WASH`). Cada pilha lavada devolve 1 prato limpo e joga os restos na lixeira (+1).
- **Quem lava:** quando a Bia toca na pia (com ou sem louça na mão), ela lava tudo o que está lá. Se a Dani estiver encarregada de lavar, a Bia só deixa a louça (0,3 s) e a Dani lava.

## Lixeira que enche (`TRASH`)
- Capacidade de 8. Enche com os restos de cada pilha lavada e com cada bebida jogada fora.
- **Sem espaço para as bebidas que a Bia traz** (lixeira cheia ou vagas a menos): a lixeira aceita todas as bebidas uma última vez e a Bia já a esvazia em seguida (0,3 s + 2 s). Pratos e louça suja ficam na mão. Comandas também ficam, para não perder pedidos.
- **Cheia:** recusa bebidas ("Lixo cheio!") e o cheiro faz a paciência de todos cair 15% mais rápido. Aparecem a placa "CHEIO" e as linhas de cheiro, e o nível fica numa régua de 8 tracinhos ao lado da lixeira.
- **Esvaziar:** a Bia toca na lixeira de mãos vazias e leva 2 s. A Dani faz isso se a tarefa estiver escolhida.

## Couvert artístico (`STAFF.couvert`)
- R$ 80 por dia. Um músico num banquinho no canto do salão, que muda conforme o dia (violão, sanfona ou cavaquinho), com notinhas flutuando (paradas com `prefers-reduced-motion`).
- A paciência **nas mesas** cai 20% mais devagar; a fila não é afetada.
- **Opção "Cobrar couvert":** R$ 3 por pessoa somados na conta, mas a eficácia cai pela metade (efeito de 10%). Antes caía só 10% e era sempre vantagem ligar.

## Água saborizada
- Substitui a Jukebox, que passava a ideia de poluição sonora. Custa o mesmo e tem o mesmo efeito: a paciência na fila cai 20% mais devagar.
- Aparece desenhada na entrada (jarra com frutas numa mesinha). O save antigo com `up.jukebox` é convertido em `up.agua`.
- **Jarra com doses** (`AGUA`): 12 doses, cheia no início de cada dia. Cada pessoa que chega à fila toma 1 dose (`Group.drink`); só quem tomou ganha o efeito (paciência na fila cai 40% mais devagar), proporcional às doses do grupo. Jarra vazia: sem efeito. A Dani pode recarregar (tarefa "Água").
- **Recarregar:** a Bia toca na jarra (estação `agua`, 0,8 s) e paga R$ 15. Cheia, não cobra; sem dinheiro, não recarrega. A jarra mostra o nível, o número de doses e "VAZIA".
- Medido com o bot: ~1 recarga no dia 2 e 1 a 2 por dia nos dias 3 a 7 (média ~1,5).

## Balanceamento: sem equipe é quase impossível (pedido do usuário)
Objetivo: nos 3/4 finais da carreira (dias 3 a 7), quem não contrata bate a meta só ~10% das vezes; com a equipe que o dinheiro acumulado já paga, ~85%.
- **Mais movimento:** grupos por dia 6, 9, **18, 22, 26, 29, 33** (antes eram 12, 14, 16, 18, 22 nos dias 3 a 7).
- **Louça curta:** **3 pratos limpos** do dia 3 em diante e 5 no Turno sem fim. Lavar leva **2,5 s por pilha** para a Bia; a Dani leva isso ÷ a velocidade dela. A Dani lava **1 pilha por vez**, sem limite de pilhas: só o tempo conta, e os pratos voltam aos poucos; ela fica na pia até a louça acabar.
- **Lixeira:** capacidade de **6**; cheia, o cheiro acelera a impaciência em **30%**.
- **Metas e experts:**

| Dia | Meta | Expert |
|---|---|---|
| 3 | R$ 1400 | R$ 1800 |
| 4 | R$ 1300 | R$ 1750 |
| 5 | R$ 1480 | R$ 2050 |
| 6 | R$ 1500 | R$ 2150 |
| 7 | R$ 1650 | R$ 2300 |

- Com a água limitada, as metas dos dias 5 a 7 baixaram (eram R$ 1440, 1440 e 1500). Nova medição (160 rodadas): com equipe 74% a 82%; sem equipe 5% a 13%.
- Depois da revisão das melhorias (Tonhão, água, jogo de pratos, ventilador e taxa), as metas subiram de novo. Medição (`balance.js`, 100 a 160 rodadas): com equipe 79% a 84%; sem equipe 6% a 9%.
- A abertura do dia 3 avisa que a Bia sozinha não dá conta.
- **Medição (bot, 80 a 100 rodadas):**
  - **sem equipe:** dia 3 ~20%, dias 4 a 7 entre 4% e 9%;
  - **com equipe completa** (`EQUIPE=auto`: Tonhão nível 3, Dani nível 3 com pratos, lavar e lixo, couvert; folha de R$ 305 por dia, que o acumulado já paga no dia 3): 76% a 90%.
- Os dias 1 e 2 continuam de aprendizado (100% e ~98% sem equipe).
- Comandos: `node balance.js 80` (sem equipe), `EQUIPE=auto node balance.js 80` (equipe que cabe no orçamento) e `EQUIPE='{...}'` (equipe fixa).

## Lixeira: esvaziar exige mãos livres
- A Bia só esvazia a lixeira com as **duas mãos vazias**, ou com **só bebidas** nas mãos, na última leva quando elas não cabem: joga as bebidas e esvazia em seguida.
- Com prato de comida, louça suja ou comanda na mão, a lixeira cheia recusa ("Lixo cheio!").

## Revisão das melhorias (análise com o bot)
Pergunta do usuário: um jogador experiente veria vantagem em comprar cada melhoria? O dinheiro acumulado recebe todo o faturamento, então o custo pesa pouco; o que importa é o efeito. Medido com `EQUIPE` completa, tirando um item de cada vez (150 rodadas, ruído de ±R$ 40 por dia).

**Antes:** só o tênis rendia claramente; a água limitada ficou negativa; chapa, ventilador e bocas do Tonhão davam ~0, porque o gargalo é a Bia e a louça, não a cozinha; a taxa do couvert era sempre vantagem.

**Mudanças:**
- **Água saborizada:** efeito de 20% para 40%; a Dani pode recarregar.
- **Chef Tonhão:** sem bocas a mais; o aumento dá velocidade, prato caprichado e ajuda na pia (tabela acima). VIP pede prato especial (mais caro e mais demorado).
- **Chapa nova → Jogo de pratos** (R$ 300): +1 prato limpo do dia 3 em diante (+2 era forte demais: até +R$ 420 por dia). O save antigo com `up.chapa` vira `up.pratos`.
- **Ventilador:** além de a freguesia comer 15% mais rápido, a lixeira cheia não cheira.
- **Taxa do couvert:** efeito cai para 10%.
- **Dani:** atalhos "Recolher" e "Lavar" nos botões das tarefas, para caber no celular.

**Depois** (ganho por dia nos dias 3 / 5 / 7):

| Item | Ganho |
|---|---|
| Tênis | +44 / +149 / +125 |
| Água | +22 / +72 / +165 |
| Jogo de pratos | +50 / +165 / +225 |
| Bandeja | ~0 / +10 / +24 (fraca) |
| Ventilador | ~0 (fraco) |
| Cafeteira | ~0 com o bot, que não serve cafezinho |
| Tonhão nível 1 → 3 | +78 / +152 / +72 |
| Dani | +200 a +350; com cafezinho como 3ª tarefa, +50 a +200 a mais que com o lixo |
| Couvert | +65 / +297 / +234 |
| Taxa do couvert | +75 / −17 / −97 (escolha de verdade) |
