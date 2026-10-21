# v7.4 — Garagem da Bia e do tio Tonhão, móveis e editor do salão

Etapa 1d-1 do `docs/PLANO.md` (decidida pelo usuário em 21/10; textos em `docs/PROPOSTAS.md`). O Bairro e a aba Salão da v6 (cadeiras em pares, 2 fileiras fixas, até 8 mesas) saem; entra o 1º ponto da escada de pontos, a Garagem, com mesas compradas uma a uma e um editor para arrumar o salão.

## 1. Pontos
- `PONTOS` (`10-constantes.js`), só com a Garagem: `{ id:'garagem', nome:'Garagem da Bia e do tio Tonhão', lugares:16, aluguel:0, mudanca:0, cardapio:1, area:{ x0:196, y0:150, x1:684, y1:500 }, espera:4 }`. `pontoOf(id)` e `Game.ponto` (o ponto do save).
- `area` é onde cabe a mesa inteira (o retângulo `mesaBox`: do centro, 50 px para cima e 62 para baixo, e a meia largura da mesa para os lados). `espera` e `cardapio` só serão usados na v7.5 e na etapa 3.
- **Contas:** `CONTAS = { mesa:30, lugar:6 }` (saiu o `aluguel`). `contasDia(tables, ponto)` = aluguel do ponto + R$ 30 por mesa + R$ 6 por lugar. Na Garagem, o kit custa R$ 180 por dia e 16 lugares em 7 mesas, R$ 306 (antes, R$ 396 com 6 mesas e 16 lugares).

## 2. Salão no save
- `save.salao = { ponto:'garagem', mesas:[{ x, y, seats, c }] }`: centro da mesa, 2 ou 4 lugares e a cor das cadeiras (0 a 3, a menos usada na hora da compra; a cor fica com a mesa quando ela muda de lugar).
- As mesas ficam sempre na ordem do salão (`salaoOrdena`: de cima para baixo, com as mesas a menos de meia mesa de altura na mesma fileira, e da esquerda para a direita), que dá os números (`tables[id-1]`).
- `normSalao`: tira mesas estragadas, corta do fim o que passar do teto, sem mesas usa o kit e com o arranjo inválido usa a arrumação automática (ou o kit).
- **Kit inicial:** 3 mesas de 2 e 1 de 4 (10 lugares), na arrumação automática.
- **Turno sem fim:** salão fixo de 6 mesas e 16 lugares (`SALAO_SEMFIM`, o mesmo da v7.3), igual para todos no ranking.

## 3. Regras de posição (`mesaProblema`, `salaoCaminho`, `salaoProblema`)
- dentro da área útil do ponto;
- a pelo menos `SALAO.gap` (46 px) de qualquer outra mesa, na horizontal ou na vertical;
- caminho: de um dos lados de cada mesa (`tableApproach`), que não pode cair em outra mesa, há caminho de verdade (`pathOk`, novo em `11-base.js`) a partir do balcão de pedidos e do 1º lugar da fila. O teste monta os obstáculos do arranjo e devolve os do salão de antes;
- de 1 mesa ao teto de lugares.
- **Arrumação automática** (`salaoAuto`): fileiras de cima a baixo (2 na Garagem, nos y 210 e 420); as mesas, na ordem do salão, são divididas em fileiras seguidas, com a mais larga o mais curta possível, e espaçadas por igual com encaixe na grade. Arrumar de novo não muda nada. Todas as 24 combinações até 16 lugares cabem.
- **Lugar livre** (`salaoVaga`): primeiro nas alturas das fileiras que já existem, depois em qualquer altura, de cima para baixo e da esquerda para a direita. Sem vaga, a compra rearruma o salão sozinha.

## 4. Loja de móveis (aba Salão)
- Mesa de 2 com cadeiras **R$ 150**; mesa de 4 com cadeiras **R$ 250**; 2 cadeiras para virar uma mesa de 2 em mesa de 4 **R$ 100** (no mesmo lugar ou no lugar válido mais perto; senão, rearruma).
- **Vender a mesa por metade do preço** (R$ 75 ou R$ 125; o salão fica com pelo menos 1 mesa). Não estava no plano: sem isso, quem enche os 16 lugares com mesas de 2 não consegue mais ter mesa de 4. A venda abate das compras do caixa (`caixaPend.sal` pode ficar negativo).
- Até o teto de 16 lugares. Entram no Caixa (`caixaGasto(...,'sal')`) e não contam no limite de 1 melhoria por visita.
- `Game`: `buyMesa(seats)`, `virarMesa(i)`, `venderMesa(i)`, `moverMesa(i, x, y)`, `arrumarSalao()`, `desfazerSalao()`; o motivo da recusa fica em `salaoMsg`, a mesa escolhida em `salaoSel` e os arranjos anteriores em `salaoUndo` (só mudanças de lugar; compra e venda zeram o Desfazer).

## 5. Editor do salão
- Canvas próprio na aba Salão (`41-lojinha.js`, `drawEditor`): o pedaço x 0 a 800 e y 56 a 540 do salão em escala (pé da parede com o portão, piso, área útil tracejada, balcão), com as mesas e cadeiras e sem clientes, a 1,25× de resolução. Ao lado: "Lugares 10 de 16", o ponto, Mesa de 2, Mesa de 4, Arrumação automática, Desfazer, a dica ou o motivo da recusa e as contas de luz e gás.
- **Arrastar** a mesa muda o lugar dela, com encaixe numa grade de 10 px. Lugar inválido: contorno e fundo vermelhos, e ao soltar a mesa volta ("Aí não dá: perto demais de outra mesa."). Lugar válido: contorno verde tracejado. A mesa arrastada fica por cima das outras.
- **Tocar** na mesa abre um balãozinho em cima do salão: "Mesa N · 2 lugares", "Virar mesa de 4: R$ 100" (se der) e "Vender por R$ 75", com ×. Tocar no vazio fecha.
- Mouse e dedo: mesma folga de toque do salão do jogo (~14 px de tela) e um tremido de até ~14 px não vira arrasto. `touch-action:none` no canvas.
- Cabe sem rolar em 960×600 e 740×360 (no celular deitado, a grade da aba fica mais larga e some o texto do ponto e das contas).

## 6. Todas as mesas abertas desde o dia 1
- Saiu o `tables:[...]` de `DAYS` e do `ENDLESS`. `dishStock` passa a dar 3 pratos limpos do dia 3 em diante (era `min(3, mesas abertas − 2)`, que já dava 3).
- **Menos grupos nos dias 1 e 2:** 6 → 5 e 9 → 8 (com o bot: dia 1, média de R$ 291 e expert em 1 a 4 de 40; dia 2, R$ 606 e 6 de 40; na v7.3, R$ 292 e 4 de 40, R$ 595 e 5 de 40).

## 7. Visual da Garagem
- Piso de **cimento queimado** (manchas fixas e juntas), parede de bloco pintada, **portão de enrolar aberto** no lugar da porta (com a rua, uma casinha e uma árvore lá fora, o rolo de aço em cima e os trilhos), soleira e **letreiro feito à mão** (tábua torta com pregos: "LANCHES da Bia e do Tonhão"). Cartaz de preços, relógio e placa da cozinha continuam.
- **Mesa quadrada de plástico de bar** (pedido do usuário no meio da sessão, com foto): tampo branco de cantos chanfrados, furo do guarda-sol, borda e pernas que afinam; a mesa de 4 são 2 mesas quadradas juntas, como no bar. Plaquinha do número amarela.
- **Cadeira de plástico de bar:** pernas da mesma cor, abertas, encosto de aro que abre para cima com frisos verticais vazados. Continuam nas 4 cores (o bônus de cor da camisa depende delas).
- O desenho de antes (azulejo, porta de madeira, mesa de fórmica, cadeira de metal) fica para os pontos das etapas 3 e 4 (`garagem(g)` escolhe).

## 8. Save antigo (v6 a v7.3)
- `salaoDevolucao`: 300 por mesa comprada (até 2) + 60 por par de cadeiras compradas (até 4 pares). `normSave` soma ao dinheiro, põe uma linha `{ d, dev, saldo }` no caixa e começa na Garagem com o kit. `loadSave` grava o save convertido na hora, para não devolver de novo.
- Aba Caixa: linha "Devolução do salão antigo: +R$ N" com o saldo; no resumo, "Devolução do salão: +N · saldo S". A devolução não entra em "para onde foi o dinheiro".

## 9. Bot e calibração
- `bot.moveis(g, L, semMesa, reserva)` (`tests/bot.js`): 1 móvel por lojinha; mesa de 4 (ou virar uma de 2) se houve perdas por falta de mesa no dia anterior, senão mesa de 2; depois a arrumação automática. Na `carreira.js`, reserva de R$ 300 do dia 3 em diante (como as melhorias); `MOVEIS=0` fica no kit e `MESAS=1` mostra o salão de cada dia.
- `balance.js`: salão de quem compra móveis como o bot (kit; +1 mesa de 2 por dia até 16 lugares no dia 4), `MOVEIS=kit` ou `MOVEIS='[2,2,4,4]'`. Novos: `GRUPOS='{"1":5}'` e `DIAS=1,2`. Saiu o `SALAO` (formato da v6).
- Resultados (40 rodadas):
  - sem equipe: 194 de 200 metas nos dias 3 a 7 (**97%**; v7.3: ~74%). Acima do alvo de 40–75%, como o plano pedia: a Garagem não paga aluguel (R$ 120 por dia a menos) e rende a mais de propósito, para o pé-de-meia;
  - `EQUIPE=auto`: 200 de 200;
  - `BOT=afiado EQUIPE=auto ORDEM=pratos,...`: 0 perdidos em 194 de 200 dias 3 a 7 (97%; alvo ≥ 80%);
  - `carreira.js` (30 carreiras): R$ 1.455 na lojinha do dia 5 (v7.3: R$ 1.630), com a equipe completa contratada desde o dia 3 e 16 lugares no dia 5. Dá para juntar os R$ 800 da mudança.
- **Achado:** com equipe, o kit de 10 lugares dá **mais** lucro que 16 lugares (dia 5: R$ 1.332 contra R$ 1.007), porque o gargalo são os 3 pratos limpos e a fila justa segura quem espera mesa; mesa a mais só soma luz e gás. Sem equipe a diferença é pequena. Fica para decidir (etapa 3 ou ajuste): fazer o pé-de-meia depender de mais mesas (ex.: pratos limpos pelos lugares, ou grupos que vão embora quando a fila enche).

## 10. Testes
- `smoke13` (novo, 53): kit, cores e números; todas as mesas abertas no dia 1; 5 e 8 grupos nos dias 1 e 2; pratos limpos; contas sem aluguel; compras, teto de 16, sem dinheiro, virar e vender; lugar inválido (perto, fora), Desfazer, arrumação automática idempotente; parede de mesas sem caminho; as 24 combinações; compra sem vaga; save e save estragado; Turno sem fim fixo; aba Salão com o editor (tocar, balãozinho, virar, arrastar com o dedo até um lugar inválido e até um válido); bot no dia 2 com 6 mesas; `bot.moveis`.
- `smoke8` virou o teste da conversão do salão antigo (devolução, linha do caixa, gravado uma vez só, aba e resumo do Caixa) e manteve as faixas de estrelas (19).
- Ajustados: `smoke2` (sem mesa fechada; mesa suja), `smoke9` (contas da Garagem e aluguel do ponto), `smoke10` (mesa de 2 livre), `smoke11` (compras de mesa e resumo).
- Capturas: `tests/shot_v7_4.py` → `capturas/v7.4` (menu, Garagem jogando, editor, balãozinho, arrasto vermelho e verde, compra; em 960×600 e 740×360 com toque).
