# v8.4 — Avaliações dos clientes no Gurugol (etapa 2c)

Etapa 2c do `docs/PLANO.md` (pedido do usuário em 21/10 e 23/10; textos em `docs/PROPOSTAS.md`). Decisões do usuário em 26/10: a nota mexe no movimento de −10% a +10%; os 5 critérios pesam igual; os pontos de atendimento entram como bônus na agilidade; os comentários aparecem no fim do dia e num balãozinho quando o grupo sai; e, pedido durante a sessão, a nota é a média das **últimas 100** avaliações (e não das 200 do plano), contando a partir da 20ª. Sem nota até a 20ª avaliação, como sugeria o plano. A nota mínima para mudar de ponto fica para a etapa 3 (o usuário já tinha pedido 4,5★ na Garagem).

## O que mudou
- **Cada grupo que sai na carreira avalia** (`Game.avaliar`, chamada em `collectBill` e em `angryLeave`), de 1 a 5, com uma casa decimal, em 5 critérios (`AVAL`, `AVAL_CRIT`, em `10-constantes.js`):
  - **Espera por mesa:** cada coração perdido lá fora (`Group.perdFila`) tira `AVAL.porCoracao` = 0,75.
  - **Agilidade:** cada coração perdido na mesa esperando a Bia (`perdMesa`: pedido, prato, conta e o suco que faltou) tira 0,75. A cadeira da cor do grupo, uma ação em corrente para ele (`Game.score` recebe o grupo) e o prato caprichado somam 0,5 cada (até +1,5).
  - O coração que o grupo ganha de volta (sentar, a água da espera, anotar, entregar, cafezinho) compensa um perdido naquela etapa (`Group.gain`). Sem isso, até o bot afiado ficava com 2,5 na agilidade.
  - **Prato:** cada prato pronto ganha uma nota (`plate.q`) na faixa de acerto do Tonhão (`AVAL.prato`: 2,5–4,5 sem aumento, 3–4,7 e 3,5–5); o caprichado (`CRIT`) vale 5.
  - **Cardápio:** `avalMenu()` = 1,5 + 0,75 por prato do `CARDAPIO` (4 na Garagem: 4,5). Os pontos de cima, com mais pratos, sobem.
  - **Ambiente:** 3 de base, +0,5 para TV, som, torneira (Água da torneira), Ventilador e o cafezinho servido ao grupo, +1 com couvert; a lixeira cheia tira 1.
  - Quem sai bravo dá 1 na agilidade e no prato (se não comeu) e reclama: "Desisti de esperar!" (da espera) ou "Fui embora sem comer!" (da mesa) (`AVAL_BRAVO`).
  - Não avaliam: quem não coube ("Lotado!"), quem ainda está lá quando o dia acaba (a lanchonete fecha), o Turno sem fim e a Missão zero. Dia largado no meio também não conta.
- **Comentário:** com nota 4 ou mais, elogia o melhor critério; abaixo disso, reclama do pior (`avalComentario`; com a lixeira cheia, "Que cheiro de lixo!"). Aparece num **balãozinho branco** sobre a mesa (ou sobre o grupo bravo) com a nota, a borda na cor da nota, subindo devagar por 2,8 s (`fx` de texto com `box`, desenhado em `23-render.js`).
- **A nota do Gurugol** é a média dos critérios das últimas `AVAL.max` = 100 avaliações (`avalGeral`), e só aparece a partir da `AVAL.min` = 20ª. Ela fica no save (`save.aval`, uma lista de `[espera, agil, prato, menu, amb]`, `normAval`) e entra lá no fim de cada dia completo.
- **Movimento:** `avalMovimento` multiplica os grupos do dia (`buildSchedule`) por 1 + 0,1 × (nota − 3) / 2: 1 ★ dá −10%, 3 ★ fica igual e 5 ★ dá +10%. Sem nota, nada muda.
- **HUD:** quadrinho "Gurugol" entre o lucro e a fila, com a nota e 5 estrelinhas preenchidas até ela, ou "sem nota: 8/20" (`Game.gurugol`, que soma as avaliações do dia às do save).
- **Fim do dia:** a linha "Gurugol" no quadro da esquerda ("4,4 ★ · hoje 4,0") e, embaixo, 2 ou 3 comentários do dia (a melhor avaliação, a pior e uma qualquer); os critérios do dia ficam no `title`. Para caber sem rolar na tela de 1220×600, as linhas dos quadros ficaram mais juntas.
- **Caixa:** a nota com cada critério e o efeito no movimento; a nota do dia vai na linha do caixa (`av`, ×10, no `title` do dia) e no resumo para o WhatsApp.
- **Como jogar:** dica nova sobre o Gurugol.

## Números (calibração, `balance.js 40`)
| Jogador | Dias 3 a 7 |
|---|---|
| Bot sem equipe | ~3,6 ★ (agilidade ~3,2, prato ~2,6) |
| Bot com `EQUIPE=auto` | ~4,2 ★ |
| Bot afiado com equipe (`BOT=afiado ORDEM=pratos,...`) | ~4,4 ★ (de 4,35 a 4,5; p90 ~4,6) |

Os 4,5 ★ ficam ao alcance de quem joga muito bem e combina cores e correntes; quem perde muita gente cai abaixo de 3 (cada bravo vale ~2). Na campanha (`carreira.js 20`), a nota em ~4 traz ~5% mais gente: os R$ 800 chegam no dia 9 (eram 10).

O `balance.js` zera as avaliações em cada dia (assim a nota não mexe no movimento e os números antigos valem); `AVAL_MOV=1` leva as avaliações de um dia para o outro. A linha nova "Gurugol" mostra a nota média do dia, p10, p90, cada critério e quantas avaliações.

## Testes
- `smoke25.js` (38): constantes, média das 100 últimas a partir da 20ª, `normAval`, médias, movimento, comentários, save, grupos a mais e a menos pela nota, cada critério de um grupo, coração devolvido, lixeira cheia, grupo bravo, nota do prato, Turno sem fim sem avaliação, um dia inteiro com o bot (save, resultado, caixa, fim do dia, resumo), aba Caixa e o HUD desenhando.
- `python3 shot_v8_4.py` gera as capturas em `capturas/v8.4` (HUD sem e com nota, o balãozinho, fim do dia e Caixa, no PC e no celular deitado).
