# v7.5 — Calçada: tela que rola, espera lá fora e máquina de suco

Etapa 1d-2 do `docs/PLANO.md`. Decisões do usuário em 21/10 (textos em `docs/PROPOSTAS.md`): calçada estreita (~260 px); arrastar o fundo só no vazio, com abinhas fixas na borda; suco da espera a R$ 12 (igual ao do balcão); a tarefa da água da Dani vira "levar o suco da espera".

## Câmera
- O mundo vai de `-CALCADA.w` (260 px, a rua e a calçada) até `W` (960, o salão como antes). `Game.cam` (0 a 260) é quanto o mundo anda para a direita: **0** mostra o salão e a cozinha; **260**, a calçada inteira e todas as mesas (a área útil das mesas vai até x = 684, que fica à vista dos dois lados). Só a cozinha (com 260) ou a espera (com 0) saem da tela.
- O dia começa olhando a calçada (onde a freguesia chega). No menu, a câmera fica em 0.
- `render` desenha o mundo com `translate(cam, 0)`: piso, parede, calçada, cozinha, mesas, gente, balões, selos da fila e efeitos. O **HUD** (faixa de baixo) e as **abinhas** ficam fixos na tela. As moedas voam até o dinheiro do HUD (`120 − cam`) e os avisos do meio da tela (`W/2 − cam`) saem no meio de onde se está olhando.
- **Entrada:** `onDown/onMove/onUp` recebem coordenadas da tela. O HUD e as abinhas são testados na tela; o resto vira mundo (`x − cam`). `toLogical` não mudou.
- **Arrastar o fundo:** só começa onde nenhum alvo pega o toque (com a folga do dedo, `pickAt`), então tocar perto de uma mesa, prato ou balcão continua igual. Rola a tela com o dedo (8 px ou a folga do dedo antes de começar). Tocar no vazio sem arrastar desfaz a escolha do grupo, como antes; arrastando, a escolha fica (dá para escolher o grupo e rolar até a mesa).
- **Grupo arrastado até a borda** (`CAM.borda`, 56 px da tela): a tela rola sozinha para aquele lado (520 px/s) e o grupo acompanha.
- **2 toques no grupo** (menos de 0,4 s entre eles): o grupo fica escolhido e a tela vai para o salão (`camGo(0)`); aí é só tocar na mesa. Tocar no grupo e depois na mesa continua valendo.
- **Abinhas** (`ABAS`, no alto, sobre a parede): "◀ Calçada" (com quantos esperam) aparece enquanto a calçada não está toda à vista; "Salão ▶" (com o relógio do dia e, numa bolinha verde, os pratos prontos que a Bia ainda não vai buscar) aparece enquanto a cozinha não está toda à vista. Tocar leva a tela até lá (1500 px/s). O relógio da parede some quando ficaria embaixo da abinha (a hora está nela).
- **Setinha:** a abinha da calçada pisca (laranja, com "!") quando, fora da tela, há suco pronto na máquina sem ninguém indo buscar (nem a Bia, nem a Dani com a tarefa) ou alguém da espera com 1 coração.
- **Setas do teclado:** ← leva à calçada, → ao salão.
- **`prefers-reduced-motion`:** abinhas, toque duplo e borda levam a tela na hora, sem rolar.

## Espera lá fora
- A fila de espera virou **4 bancos na calçada** (`PONTOS.espera` = 4 na Garagem; `QUEUE.x = −132`, as mesmas alturas de antes). Quem chega vem da rua (`DOOR`, à esquerda, fora do mundo), senta no banco e, ao sair, volta para a rua. As cadeiras de fora não contam nos lugares nem nas contas.
- Espera cheia: o grupo chega à calçada, diz "Lotado!" e volta (como antes). A porta que respeita a lotação (`PORTA`) não mudou: quem não tem banco espera "na porta", fora da tela.
- Sentado no banco, o grupo aparece sentado (e, depois do suco, com o copo na mão).
- O caminho da Bia e da freguesia passa pelo portão aberto: `BOUNDS.x0` foi para a calçada (−244). As mesas continuam na mesma área útil (o vão onde ficava a fila, dentro da garagem, fica livre).

## Máquina de suco (melhoria, R$ 180, no lugar da Água saborizada)
- `MAQUINA = { pede:2.5, prep:3, take:0.5, slow:0.4 }`. Fica na calçada, embaixo dos bancos (`STATIONS.maquina`).
- **Tablet:** 2,5 s depois de sentar no banco, o grupo pede no tablet do lugar **1 suco por pessoa** (`Game.maqPedir`; "Suco no tablet!"). A máquina leva **3 s** e o pedido fica pronto lá (copos na bandeja da máquina e uma bolinha verde com quantos).
- **Bia:** tocar na máquina põe a ação na fila (com selo). Na máquina, ela pega **todos os copos prontos que couberem** nas mãos (do pedido mais antigo para o mais novo; sem bandeja, 2; com bandeja, até 4) e a **mesma ação** segue para quem pediu, um grupo depois do outro, enquanto houver copo na mão (o selo da fila vai junto). Se o grupo mudou de banco no caminho (um VIP furou a fila), ela refaz o caminho.
- **Entrega** (`Game.entregaSuco`): +1 coração (atender), quem ainda espera bebe e a paciência na espera cai **40%** mais devagar (como a água: na proporção de quem bebeu), o ingrediente sai na hora (R$ 5 por copo, `INGRED.suco`) e cada copo vai para a **conta do grupo** (R$ 12, `JUICE.price`), somado depois dos corações e da gorjeta ("Suco da espera +24").
- **Cancelamento:** quem sai da espera (sentou ou foi embora) cancela o que a máquina ainda não entregou na mão de ninguém. Copo já na mão de quem sentou vai até a mesa; de quem foi embora bravo, sai da mão. Copo da espera na mão conta como bebida (bandeja, lixeira: jogar fora custa metade do preço). Na mão, o copo tem uma bolinha da cor de quem pediu.
- Balão em cima do tablet: preparando (anel), pronto (verde, pulsando, com quantos copos) ou a caminho (→).
- **Dani:** a tarefa "Recarregar a água saborizada" virou **"Levar o suco da espera"** (precisa da máquina): de mãos vazias, ela busca o pedido pronto que a Bia não vai pegar (até 2 copos) e entrega.
- **Save antigo:** quem tinha a Água saborizada ganha a máquina (`up.agua` → `up.maquina`, inclusive a Jukebox de antes da v5, que já virava água); a tarefa da água da Dani vira a do suco.
- Fim do dia: linha "Sucos da espera" com os copos e quanto foram na conta.

## Desenho
- **Calçada** (`drawCalcada`): rua e meio-fio à esquerda, piso de concreto em placas, muro da casa (com janela e "Nº 27") e o **toldo** listrado por cima da espera; cada lugar com **banco de ripas**, número e o tablet num pedestal; no canto de baixo, um **vaso num banquinho de plástico**; na borda do salão, o portão de enrolar aberto (rolo e soleira).
- Na parede de cima da garagem, o vão do portão virou uma janela basculante (o portão agora é a parede da esquerda).
- **Máquina** (`drawMaquina`): tanque de suco (borbulha enquanto prepara, parado com `prefers-reduced-motion`), bica, bandeja com os copos prontos e "SUCOS".
- Ícone novo na lojinha, no quadrinho da fila de ações (copo com o tablet, ou com a cor de quem pediu na 2ª parte) e uma dica nova no Como jogar.

## Equilíbrio
100 rodadas por dia, dias 3 a 7 (`balance.js`; a máquina entra no lugar da água na ordem de compra):

| Bot | v7.4.4 (lucro, metas, perdidos/dia) | v7.5 |
|---|---|---|
| simples, sem equipe | R$ 745, 447/500, 5,6 | R$ 725, 440/500, 6,2 |
| simples, `EQUIPE=auto` | R$ 1.055, 491/500, 2,7 | R$ 1.021, 490/500, 3,3 |
| afiado, `EQUIPE=auto` | R$ 1.302, 500/500, 0,6 | R$ 1.116, 485/500, 1,2 |
| afiado, sem comprar a máquina | — | R$ 1.361, 499/500, 0,6 |

- A calçada não pesa: sem a máquina, o bot afiado fica igual ou um pouco acima da v7.4.4 (a freguesia anda ~1 s a mais até a mesa).
- O bot simples busca o suco só quando não tem mais nada a fazer, e fica empatado. A ida lá fora é longa (~6 s, da cozinha até a máquina e de volta), então o bot afiado, que busca sempre que sobra uma brecha, perde ~R$ 190 por dia: com a Bia sozinha, a máquina é para os momentos de folga. Com a Dani na tarefa, a Bia não sai do salão.
- `carreira.js` (30): dinheiro na lojinha do dia 5 R$ 1.495 (v7.4.4: R$ 1.780) e no dia 7 R$ 2.877 (R$ 3.338); a mudança de R$ 800 até o dia 5 continua folgada. Comprando tudo menos a máquina, R$ 1.512 e R$ 3.061.

## Testes
- Novo `smoke14` (75): calçada e espera de 4, "Lotado!" no 5º, câmera (limites, começo na calçada), toque com a tela deslocada (grupo, mesa, cozinha, HUD), arrastar o fundo (rola, não desfaz a escolha, não começa em alvo, tremidinho, folga do dedo), borda (rola dos dois lados e para), toque duplo, abinhas (quando aparecem, levam a tela, contador de pratos, alerta), máquina (pedido, preparo, Bia pega e entrega, coração, paciência, ingrediente, conta), cancelamento, mãos cheias e copos parciais, entrega na mesa, quem vai embora, sem a máquina, Dani, movimento reduzido e render.
- `smoke6`: a água saiu (máquina no lugar, saves antigos, tarefa da Dani). `smoke`, `smoke2` e `smoke7`: a entrada agora chega em coordenadas da tela (com a câmera em 0, tela = mundo; a fila fica em x < 0); `smoke2` espera o grupo chegar à mesa (vem da calçada).
- Capturas `shot_v7_5.py` (`capturas/v7.5`, 960×600 e 740×360 com toque, arrastando o fundo com o mouse e o dedo de verdade): calçada, salão com a abinha piscando, meio do caminho, a Bia entregando o suco e a lojinha.
