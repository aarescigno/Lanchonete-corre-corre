# Resumo do projeto e das alterações (até 21/10/2026)

## Estado atual
- **Versão:** v7.5 (a espera foi para a calçada: tela que rola, 4 bancos lá fora e a Máquina de suco no lugar da Água saborizada), pronta no `claude/main` e ainda não publicada no artifact; a publicada é a v7.4.4 (TV e som na Garagem), Versão 32 do artifact https://claude.ai/artifact/MJxrgDg8S4akvg47SoQAvj (privado).
- **Branch:** `claude/main` (renomeado pelo usuário; o antigo `claude/intelligent-gauss-3owv29` não existe mais) no repositório `aarescigno/Lanchonete-corre-corre`.
- **Arquivos publicados:** `lanchonete.html` (página), mais `versoes/v1.html` a `versoes/v7.4.3.html`, abertos pelo painel Versões (a `versoes/v7.4.4.html` vai na próxima publicação).
- **Capacidades declaradas (mantidas ao republicar sem `capabilities`):**
  - `db`: `ranking-carreira` e `ranking-semfim` com read "view" e write "owner";
  - `db`: `ranking-*/{self}` com write "interact";
  - `user`.
- **Ranking:**
  - documentos `ranking-carreira/<userId>` e `ranking-semfim/<userId>`, com `nome`, `pontos`, `dia` ou `tempo` e `quando`;
  - só sobrescreve quando a pontuação é maior;
  - fallback local em `localStorage` (`lcc2_ranking`).
- **Save:** `lcc2_save`, que importa o `lcc_save_v1` da v1. Desde a v6 guarda também o salão (`save.salao`); desde a v7, a divulgação (`save.divulga`); desde a v7.2, o livro-caixa (`save.caixa`, últimos 14 dias da carreira, e `save.caixaPend`, compras da lojinha que entram na linha do dia seguinte). Desde a v7.4, `save.salao` é `{ ponto, mesas:[{ x, y, seats, c }] }`; o salão da v6 vira a Garagem com o kit e o que custou volta numa linha "Devolução do salão" do caixa. `save.best` continua guardando o melhor faturamento de cada dia (é o que o ranking da carreira soma).

## Versões
| Versão | Data | O que trouxe | Detalhes |
|---|---|---|---|
| v1 | 13/10 | carreira de 7 dias, fila de ações, mãos, corrente, bônus de cor, lojinha com 5 upgrades, som | `docs/spec-v1.md` |
| v2 | 14/10 | comandas coloridas, aro de humor, "Lotado!", Turno sem fim, ranking compartilhado, painel Versões | `docs/spec-v2.md` |
| v3 | 14/10 | clientes VIP | `docs/spec-v3.md` |
| v4 | 14/10 | balcão de sucos, bandeja, comandas empilhadas, lixeira | `docs/spec-v4.md` |
| v5 | 14/10 | equipe (Tonhão, Dani, couvert), louça limitada, lixeira que enche, água saborizada, renda de 30% | `docs/spec-v5.md` |
| v6 | 14/10 | aba Salão: cadeiras e mesas (até 8) compradas, 2 ou 4 lugares por mesa | `docs/spec-v6.md` |
| v7 | 15/10 | Contas: meta em lucro, ingredientes, contas do dia pelo salão aberto, divulgação (boca a boca, panfletos, redes sociais) | `docs/spec-v7.md` |
| v7.1 | 15/10 | Jogo justo: fila justa (ritmo 40% e piso de 1 coração sem mesa que sirva), porta que respeita a lotação, ícone "aguardando mesa", bot afiado e perdas por causa | `docs/spec-v7.1.md` |
| v7.2 | 15/10 | Livro-caixa: aba Caixa na lojinha (14 dias, para onde foi o dinheiro, "Copiar resumo" para o WhatsApp); valores da v7 mantidos | `docs/spec-v7.2.md` |
| v7.3 | 21/10 | Bia mais ágil (retorno do Renan): base 300 px/s, Tênis de corrida (R$ 350, +20%), selos "1º, 2º..." da fila no salão e nos quadrinhos; metas mantidas | `docs/spec-v7.3.md` |
| v7.4 | 21/10 | Garagem da Bia e do tio Tonhão: sem aluguel, kit de 10 lugares, mesas compradas até 16 lugares (R$ 150, 250, virar R$ 100, vender pela metade), editor do salão (arrastar, tocar, arrumação automática, desfazer), todas as mesas abertas desde o dia 1, mesa quadrada e cadeira de plástico de bar | `docs/spec-v7.4.md` |
| v7.4.1 | 21/10 | Salão cheio chama gente: `MOVIMENTO` (+6% de grupos por lugar acima de 10; mesas de 4 com equipe se pagam em 1 a 3 dias), 4 pratos limpos do dia 3 em diante, fila justa a 60% (era 40%), salão de 16 lugares do `balance.js` corrigido | `docs/spec-v7.4.1.md` |
| v7.4.2 | 21/10 | Balão de "aguardando o preparo" (retorno do usuário): panela no fogo (ícone `pot`) no lugar da comanda e do prato com anel; visto verde quando o prato está no balcão | `docs/spec-v7.4.2.md` |
| v7.4.3 | 21/10 | Cor das cadeiras (pedido do usuário): no balãozinho da mesa, no editor do salão, 4 bolinhas trocam a cor das cadeiras, de graça e com Desfazer | `docs/spec-v7.4.3.md` |
| v7.4.4 | 21/10 | Ambiente da Garagem (pedido do usuário): TV de tubo na Rede Esfera (R$ 15/dia de luz) e som na rádio Velha Brasil FM (R$ 10/dia), 5% de paciência nas mesas cada; couvert só do nível 3 do salão em diante (`PONTOS.nivel`, `couvertOk`) | `docs/spec-v7.4.4.md` |
| v7.5 | 21/10 | Calçada (etapa 1d-2): o mundo fica 260 px mais largo e a tela rola (arrastar o fundo no vazio, abinhas fixas no alto com o relógio e o aviso piscando, grupo na borda, 2 toques no grupo); espera lá fora com 4 bancos, tablet, toldo e vaso; Máquina de suco no lugar da Água (pedido no tablet, a Bia pega todos os copos que couberem e entrega grupo a grupo, R$ 12 na conta; a Dani pode levar) | `docs/spec-v7.5.md` |

## Alterações feitas no Claude Code (14/10/2026)
1. **Importação** do pacote exportado do claude.ai para o repositório (commit `982583b`).
2. **v3, clientes VIP** (`3d93bdb`):
   - aparecem a partir do dia 5 e no Turno sem fim (depois de 1 min);
   - furam a fila e têm paciência ×0,75;
   - gorjeta +50% e bônus de R$ 40 com 5♥; bravos, multa dobrada;
   - óculos escuros e plaquinha "★VIP".
3. **Teste instável do smoke2 corrigido** (`ce4fb87`, PR #1): um grupo esquecido na fila saía bravo durante a cobrança.
4. **Menu:**
   - "Versões anteriores" virou um ícone (relógio com seta) no canto inferior direito do painel do menu (`4d26956`, `97c3ab8`);
   - o menu deixou de rolar no celular deitado: `@media (max-height:460px)` com painel mais largo, título em 1 linha e 4 botões numa fileira (`3e522ae`, teste `tests/menu_fit.py`).
5. **v4, balcão de sucos e bandeja** (`6981e42`, `4741e81`):
   - **Balcão de sucos:** divide a bancada com o cafezinho. Do dia 3 em diante, ~30% dos grupos pedem de 1 copo até o número de pessoas. Cada copo vale R$ 12 e cada entrega devolve 1♥. Conta paga sem o suco: −1♥.
   - **Mãos:** comandas só na mão sem bandeja, todas juntas, até `kitchen.slots` (3). Fora isso, 1 item por mão.
   - **Bandeja (R$ 220):** 1 prato + 1 bebida, 2 pratos, 3 bebidas ou 2 pilhas de louça (ou menos). Sujo nunca junto com limpo; a outra mão pode levar louça suja.
   - **Metas:** iguais às da v3 (o bot bate a meta em 92 a 97% das vezes nos dias 4 a 7).
   - "Como jogar" em duas colunas.
6. **Lixeira** (pedido em comentário no artifact): no chão, ao lado do balcão; a Bia joga fora as bebidas que sobraram, com multa de metade do valor de cada uma (suco R$ 6, cafezinho R$ 2,50). Detalhes em `docs/spec-v4.md`.
7. **Lojinha antes de cada dia**: do dia 2 em diante, escolher o dia (ou repetir) abre a lojinha primeiro, com "Começar o dia N" e "Menu principal"; ainda 1 melhoria por dia. O fim do dia oferece "Melhorias e dia N+1" e "Menu principal".

8. **v5, Equipe** (ver `docs/spec-v5.md`):
   - **Economia (sem "cofre"):** todo o faturamento vai para o dinheiro acumulado; a folha é debitada dele no início do dia.
   - **Lojinha** com abas Melhorias e Equipe.
   - **Tonhão:** aumento de 3 para 4 e 5 bocas, com +R$ 40 e +R$ 90 por dia.
   - **Dani, a ajudante (sem robôs):** níveis com 50%, 65% e 80% da velocidade da Bia e 2, 2 e 3 tarefas, por R$ 60, R$ 90 e R$ 135 por dia. Tarefas escolhidas na lojinha: lixo, pratos sujos, lavar louça e cafezinho.
   - **Louça:** limitada a partir do dia 3; lavar leva 1,5 s por pilha; sem prato limpo, o Tonhão espera.
   - **Lixeira:** enche (8 itens); cheia, o cheiro acelera a impaciência; esvaziar leva 2 s. Se as bebidas da Bia não cabem, a lixeira aceita todas uma última vez e ela esvazia em seguida.
   - **Dani lava** no mesmo ritmo do deslocamento (50%, 65% ou 80% da Bia).
   - **Couvert artístico:** R$ 80 por dia, paciência nas mesas −20%; com a taxa de R$ 3 por pessoa, −18%.
   - **Água saborizada:** substitui a Jukebox.
   - **Sem equipe é quase impossível:** mais grupos nos dias 3 a 7, 3 pratos limpos, lavar 2,5 s por pilha e lixeira de 6. Metas dos dias 3 a 7: R$ 1300, 1300, 1440, 1440 e 1500. Sem equipe, ~5% das metas nos dias 4 a 7; com equipe, ~80% a 90%.
   - **Lixeira:** a Bia só esvazia com as mãos vazias (ou só com bebidas, na última leva).
   - **Água saborizada com doses:** jarra de 12 doses, 1 por pessoa na fila; recarregar custa R$ 15 (1 a 2 vezes por dia).
   - **Dani lava sem limite de pilhas:** 1 pilha por vez, só o tempo conta.
   - **Revisão das melhorias** (análise com o bot, em `docs/spec-v5.md`): água com efeito de 40% e recarga pela Dani; Tonhão sem bocas a mais, com aumento que cozinha mais rápido, faz prato caprichado ★ e lava 1 pilha a cada 7 s ou 4 s; VIP pede prato especial; Chapa nova virou Jogo de pratos (+1 prato limpo); ventilador tira o cheiro da lixeira; taxa do couvert corta o efeito pela metade. Metas dos dias 3 a 7: R$ 1400, 1300, 1480, 1500 e 1650.
   - **Lojinha no celular em pé:** as tarefas da Dani invadiam o card do couvert; com a tela até 600 px de largura (e mais de 460 px de altura), elas ficam em 1 coluna e o botão "Cobrar couvert" fica menos arredondado.
   - **Lojinha, aba Equipe:** a tarefa Água só aparece (e só ocupa vaga) com a Água saborizada comprada; antes de contratar a Dani, o card lista o que ela pode fazer, sem os botões de tarefa. Tonhão e Dani mostram um quadro "agora → próximo nível" (rapidez, ★, pia e diária do Tonhão; velocidade, tempo por pilha, tarefas e diária da Dani) e, no nível máximo, os valores atuais. Os botões viraram "Aumento", "Contratar" e "Promover", porque o preço está no quadro.
   - **Dani tem 2 mãos:** no máximo 2 itens por vez (`DANI_HANDS`); cada pilha de louça (a de uma mesa) ocupa 1 mão, como na Bia. O card de contratação diz isso, e o `smoke6` confere com o bot jogando dias inteiros.
   - **Toque no celular:** no celular deitado o salão fica em ~0,55 a 0,65 da escala, e a lixeira, a jarra de água, cada prato pronto e os ícones da fila tinham de 26 a 30 px na tela (o mínimo confortável para o dedo é ~44 px).
     - No dedo (não no mouse), um toque que cai fora de tudo vai para o alvo mais próximo a até ~14 px de tela (`touchPad` → `Game.pickAt`). O acerto exato vence a folga, então café e suco continuam separados.
     - Um tremido de até ~14 px ao tocar um grupo da fila seleciona em vez de virar arrasto, e um arrasto solto rente à mesa senta o grupo.
     - Pratos: vale a coluna inteira do balcão; numa coluna vazia, vale o prato pronto mais perto.
     - Ícones da fila e os botões de pausa e de som pegam a faixa toda, até a borda de baixo.
     - **Sinal do toque:** cada ação aceita faz o som de toque e um brilho só no desenho do objeto tocado (estação, mesa, prato, grupo da fila ou botão), sem halo em volta, que some em 0,4 s (`glowSprite`: o objeto vai para uma camada à parte e uma cópia é somada por cima com `lighter`). Um toque no vazio mostra só um anel fraco no ponto. O `smoke7` confere tudo isso.
   - **Pia em 2 etapas:** com louça na mão, a Bia só deixa a louça na pia; tocando de novo, sem louça na mão, ela lava. Só 1 pessoa lava por vez (a Bia ou a Dani); o Tonhão lava à parte. O bot dá os 2 toques e não manda lavar enquanto a Dani lava; o equilíbrio não mudou (`balance` sem equipe e com a Dani lavando).

9. **v6, Salão** (ver `docs/spec-v6.md`), a pedido do usuário (só 1 mesa de 4 lugares e várias famílias de 4 esperando):
   - aba Salão na lojinha, com a planta das 2 fileiras e os botões 2 e 4 em cada mesa;
   - 2 cadeiras por R$ 60 (até 24) e mesa nova por R$ 300 (a 7 em cima, a 8 embaixo, abertas todo dia);
   - numa fileira com 4 mesas, só 1 cabe com 4 lugares;
   - não conta no limite de 1 melhoria por dia;
   - teste `smoke8`.
   - **Estrelas:** a 2ª estrela vem na metade do caminho entre a meta e a expert (`bomGoal`). Antes quase nunca saía, porque quem batia a expert levava 3. A 3ª continua sendo a expert sem perder ninguém.
   - A pergunta-lembrete a cada alteração saiu do `CLAUDE.md`, a pedido do usuário.
   - **Dani e o cafezinho** (15/10, a pedido do usuário): ela serve café a quem perdeu pelo menos 1 coração (≤4, antes ≤3) e, com 1 pilha de louça na mão, pega o café no caminho da pia, deixa a louça (sem lavar) e vai servir. Assim usa as 2 mãos 4 a 5 vezes a cada 10 dias (antes ~1), e o teste "a Dani chega a 2 itens" do `smoke6` deixou de oscilar. O equilíbrio não mudou (`balance` com a Dani nível 3 em pratos, lavar e cafezinho: 304/400 → 307/400 metas nos dias 3 a 7).

10. **v7, Contas** (ver `docs/spec-v7.md`), a partir do retorno do Renan Martorelli ("no dia 5 tenho dinheiro de sobra pra fazer tudo"):
   - **Meta em lucro:** faturamento − ingredientes − contas − folha − divulgação. O dia começa no vermelho no HUD.
   - **Ingredientes:** 60% da conta de cada prato quando fica pronto; R$ 5 por suco entregue.
   - **Contas do dia:** aluguel R$ 120 + R$ 30 por mesa aberta + R$ 6 por lugar.
   - **Divulgação** (aba nova na lojinha, do dia 3 em diante): boca a boca (grátis, 60–90% dos grupos), panfletos (R$ 40, 100%), redes sociais (R$ 100, 120% e mais VIPs).
   - **Menos grupos na base** nos dias 3 a 7 (13, 15, 16, 16, 17), porque o gargalo é atender e mais gente só trazia multas; metas recalibradas pelo lucro.
   - Bot na carreira: dinheiro antes do dia 5 caiu de R$ 3.410 (v6) para R$ 1.319. Testes `smoke9` e `carreira.js`.
   - Ficaram para depois: escolher o ponto (bairro, centro, área nobre) e o modo história.

11. **v7.1, Jogo justo** (ver `docs/spec-v7.1.md`; etapa 1a do `docs/PLANO.md`), a partir do áudio do Renan ("o jogo parece injusto"):
   - **Medição:** `balance.js` mostra as perdas por causa. Com a equipe, a maior parte não era a fila, e sim a espera pelo prato (louça em uso e prioridade do bot); na fila, eram famílias sem mesa de 4.
   - **Bot afiado** (`BOT=afiado`): uma ação por vez, a mais urgente; senta qualquer grupo da fila, serve cafezinho e lava quando faltam pratos.
   - **Fila justa:** sem mesa que sirva (mesa suja conta como mesa que serve), a paciência na fila corre a 40% e, na carreira, para em 1 coração com meia paciência. No Turno sem fim vale o ritmo, sem o piso (decisão do usuário).
   - **Porta:** com todas as mesas ocupadas e 3+ grupos na fila, a chegada espera até 8 s (até 20% do dia no total); o total de grupos não muda.
   - **Ícone "aguardando mesa"** na fila (mesa e relógio; azul e parado no piso).
   - Resultado: bot afiado com equipe e Jogo de pratos comprado primeiro, 0 perdidos em 94% dos dias 3 a 7. Metas e escassez sem mudança (dentro do ruído). Teste `smoke10`.

12. **v7.2, Livro-caixa** (ver `docs/spec-v7.2.md`; etapa 1b do `docs/PLANO.md`):
   - `save.caixa`: uma linha por dia da carreira (até 14), com faturamento, ingredientes, contas, folha, divulgação, lucro, meta, perdidos, compras e saldo. As compras da lojinha entram na linha do dia seguinte.
   - **Aba Caixa** na lojinha: tabela (mais novo em cima), barra "para onde foi o dinheiro" e **Copiar resumo** (texto para o WhatsApp; se o navegador não deixar copiar, mostra o texto para copiar à mão).
   - Ajuste fino: `INGRED.prato` 0,7 tirava só ~R$ 150 do bot até o dia 5 e deixava os dias 5 a 7 sem equipe abaixo do alvo; valores mantidos até chegar resumo de jogador (rodada de retorno dispensada pelo usuário). Teste `smoke11`.

13. **v7.3, Bia mais ágil** (ver `docs/spec-v7.3.md`; etapa 1c do `docs/PLANO.md`, retorno do Renan):
   - Velocidade de base 260 → 300 (`BIA_SPEED`); Tênis novos +10%; **Tênis de corrida** (R$ 350, +20%, pedem os Tênis novos e aparecem no lugar deles na lojinha, que continua com 6 cartões).
   - **Selos da fila:** etiqueta "1º, 2º..." na mesa, na estação ou no prato que está na fila da Bia (todas as vezes do mesmo lugar juntas), com pulinho ao surgir (parada com `prefers-reduced-motion`); os quadrinhos da fila ganham a mesma etiqueta. A mesa pode entrar 2 vezes na fila; cancelar só pelo quadrinho.
   - Metas mantidas por escolha do usuário (sem equipe ~74% das metas nos dias 3 a 7; com equipe ~98%). Teste `smoke12`.
   - Salão (decidido em 21/10): o nível do salão é o ponto.
     - Garagem da mãe da Bia (até a v7.4.2, "Garagem da Bia e do tio Tonhão"): 16 lugares, sem aluguel, kit de 10 lugares, móveis comprados, editor do salão (1d-1, feita na v7.4); tela que rola até a calçada, espera lá fora e máquina de suco (1d-2, v7.5).
     - Área industrial (20 lugares) e Avenida Brasil (24), com a carreira por pontos: etapa 3.
     - Terraço Suíça (28): etapa 4.
     - Aluguéis R$ 0, 120, 400 e 1.000 por dia (pesquisa em `docs/pesquisa-aluguel.md`).

14. **v7.4, Garagem** (ver `docs/spec-v7.4.md`; etapa 1d-1 do `docs/PLANO.md`):
   - `PONTOS` só com a Garagem (16 lugares, aluguel 0, área útil, 4 cadeiras de espera para a v7.5); `contasDia(tables, ponto)`.
   - Mesas compradas uma a uma na aba Salão: mesa de 2 R$ 150, mesa de 4 R$ 250, virar mesa de 4 R$ 100, vender pela metade; até 16 lugares; fora do limite de 1 melhoria.
   - Editor do salão (canvas próprio na lojinha): arrastar com encaixe de 10 px, lugar inválido em vermelho (volta ao soltar), tocar abre virar/vender, arrumação automática e desfazer; folga de 46 px entre mesas e caminho da Bia até cada uma.
   - Todas as mesas abertas desde o dia 1; dias 1 e 2 com 5 e 8 grupos; Turno sem fim com salão fixo de 16 lugares.
   - Visual: cimento queimado, portão de enrolar aberto, letreiro feito à mão, mesa quadrada de plástico de bar (a de 4 são 2 juntas) e cadeira de plástico com frisos verticais.
   - Save antigo: devolve cadeiras e mesas compradas, com linha no Caixa.
   - Sem equipe, ~97% das metas dos dias 3 a 7 (folga da Garagem, de propósito); R$ 1.455 na lojinha do dia 5. Com equipe, mesa a mais não dá lucro (gargalo nos pratos limpos): fica para a etapa 3.
15. **v7.5, calçada** (ver `docs/spec-v7.5.md`; etapa 1d-2 do `docs/PLANO.md`):
   - Câmera `Game.cam` de 0 (o salão, como antes) a `CALCADA.w` = 260 (a calçada e todas as mesas); o dia começa na calçada; HUD e abinhas fixos; a entrada chega em coordenadas da tela.
   - Rolagem: arrastar o fundo (só onde nenhum alvo pega o toque), abinhas "◀ Calçada" e "Salão ▶" (relógio e pratos prontos), grupo arrastado até a borda, 2 toques no grupo (vai ao salão), setas do teclado; instantânea com `prefers-reduced-motion`. A abinha da calçada pisca com suco pronto sem ninguém indo buscar ou alguém lá fora com 1 coração.
   - Espera: 4 bancos na calçada (`PONTOS.espera`), a freguesia vem da rua e volta para ela; cadeiras de fora não contam nos lugares. Toldo, vaso num banquinho de plástico e portão de enrolar na parede da esquerda.
   - Máquina de suco (R$ 180, no lugar da Água saborizada; quem tinha a água ganha a máquina): 2,5 s depois de sentar, 1 suco por pessoa no tablet; 3 s de preparo; a Bia pega todos os copos prontos que couberem e entrega grupo a grupo na mesma ação; +1 coração, espera 40% mais devagar, R$ 12 por copo na conta e R$ 5 de ingrediente; quem sai da espera cancela o que não foi pego. A tarefa da água da Dani virou "Levar o suco da espera".
   - Equilíbrio: a calçada não pesa (bot afiado sem a máquina igual à v7.4.4); o bot simples empata com a máquina; o afiado, que busca o suco em toda brecha, perde ~R$ 190/dia (a ida lá fora leva ~6 s). Dinheiro na lojinha do dia 5: ~R$ 1.500. Teste `smoke14`.

## Código em partes (`src/`)
- Desde 15/10/2026 o código fica em 19 partes em `src/` (lista no `CLAUDE.md`), juntadas por `montar.py` em `lanchonete.html` sem acrescentar nada: o arquivo montado é idêntico, byte a byte, ao anterior à divisão.
- `lanchonete.html` continua no git (artifact, `app/build.py`, testes e capturas usam ele). `montar.py --check` confere que ele está em dia (o workflow do Pages roda isso); `montar.py` recusa sobrescrever um `lanchonete.html` editado à mão depois das partes (`--forcar` passa por cima).
- `tests/run_all.sh` monta antes de testar; `tests/mapa.sh` indexa as partes (arquivo:linha).
- Branches: todo trabalho termina com merge no `claude/main` e o branch apagado (pedido do usuário).

## App para Android (PWA)
- **Menu principal:** o ícone de celular com seta (ao lado do de Versões) abre o painel `#ov-app`, "Instalar no celular", com o endereço do Pages, um botão "Copiar endereço" e o passo a passo para Android (Chrome → ⋮ → Instalar app) e iPhone/iPad (Safari → Compartilhar → Adicionar à Tela de Início). Cabe sem rolar do 1366×768 ao 568×320 deitado. No app já instalado (tela cheia/standalone), o ícone some.
- `app/build.py` monta `app/site/` (ignorado no git) a partir de `lanchonete.html`, sem mudar o jogo: `index.html` com invólucro, `manifest.webmanifest` (tela cheia, horizontal), ícones próprios (hambúrguer), `sw.js` (offline; fontes do Google em cache) e as `versoes/vN.html`.
- `.github/workflows/app.yml` publica `app/site` no GitHub Pages a cada push no branch padrão que mexa no jogo (ou manualmente). Requer Settings → Pages → Source: GitHub Actions.
- No app o ranking compartilhado não existe (não há `window.claude`); fica o ranking local do aparelho.
- No Android: abrir o endereço do Pages no Chrome → menu ⋮ → "Instalar app".

## Testes (verdes no último commit)
- `smoke` (bot nos 7 dias);
- `smoke2` (mecânicas);
- `smoke3` (120/120: v2);
- `smoke4` (23/23: VIP);
- `smoke5` (41/41: sucos, bandeja e lixeira);
- `smoke6` (97/97: equipe, louça, lixeira que enche, couvert, TV e som, máquina de suco no lugar da água, economia). O teste "a Dani chega a 2 itens" dependia do sorteio do dia; desde a v7.4.1 joga até 4 rodadas enquanto ela não chega a 2;
- `smoke7` (15/15: toque no celular e brilho);
- `smoke8` (19/19: conversão do salão da v6 com devolução, e as faixas de estrelas);
- `smoke9` (33/33: v7, lucro, ingredientes, contas e divulgação);
- `smoke10` (26/26: v7.1, fila justa, piso, porta e perdas por causa);
- `smoke11` (39/39: v7.2, livro-caixa, limite de 14 dias, resumo e aba Caixa);
- `smoke12` (21/21: v7.3, velocidade, Tênis de corrida, selos da fila);
- `smoke13` (58/58: v7.4 e os 4 pratos da v7.4.1, Garagem, móveis, editor do salão, posição e caminho, contas sem aluguel);
- `smoke14` (75/75: v7.5, câmera, arrastar o fundo, borda, toque duplo, abinhas, espera de 4, máquina de suco, Dani, movimento reduzido);
- `menu_fit` (14 tamanhos de tela);
- `balance` (bot, N rodadas por dia; `DIV`, `MULT`, `MOVEIS`, `MOVIMENTO`, `GRUPOS`, `DIAS`, `BOT=afiado`, `ORDEM`, `INGRED`, `CONTAS`, `METAS`; perdas por causa e 3★);
- `carreira` (bot jogando a carreira com o dinheiro acumulado de verdade e comprando móveis; `MOVEIS=0`, `MOVEIS=quatro`, `MOVIMENTO`, `MESAS=1`).

## Ideias pendentes
- Testar som e toque em celular real (o toque foi ajustado depois de relato de dificuldade, mas só testado no Chromium com toque emulado).
- Salão: conferir com o Renan se o editor da Garagem (v7.4) ficou simples. Desde a v7.4.1, mesa a mais dá lucro com equipe e mesas de 4 (o gargalo era a Bia e o movimento fixo, não os pratos); conferir com jogadores se 6% por lugar ficou no ponto e se dá para perceber que mesas de 2 demais cansam a Bia.
- v7.3: conferir com o Renan se a Bia ficou ágil o bastante e se os selos "1º, 2º..." se entendem.
- Estrelas: conferir com jogadores se a 2ª estrela (`bomGoal`, metade do caminho entre a meta e a expert) ficou no ponto.
- O painel "Como jogar" ainda rola no celular deitado.
- Ajuste de dificuldade.
- v7: conferir com jogadores se a escassez ficou no ponto (valores em `CONTAS`, `INGRED`, `DIVULGA` e nas metas). Desde a v7.2, o jeito é pedir o "Copiar resumo" da aba Caixa.
- v7.1: conferir com jogadores se a fila justa (`FILA_JUSTA`) e a porta (`PORTA`) ficaram no ponto, e se o ícone "aguardando mesa" se entende.
- **Roteiro das próximas versões em `docs/PLANO.md`** (uma etapa por sessão; log das ideias e retornos em `docs/PROPOSTAS.md`): jogo justo (feito na v7.1), livro-caixa (feito na v7.2), Bia mais ágil (feito na v7.3), Garagem e editor do salão (feito na v7.4), espera lá fora (feito na v7.5), manutenção e imprevistos, ponto (Centro, área nobre com VIPs exigentes), modo história em 2 partes e polimento.
- A lojinha ainda rola no menor celular deitado (568×320).
- v7.5: conferir com jogadores (e no celular de verdade) se a tela que rola se entende (abinhas, arrastar o fundo, 2 toques) e se a Máquina de suco vale a ida lá fora; com a Bia sozinha, o bot afiado perde dinheiro buscando suco em toda brecha.
