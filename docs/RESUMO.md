# Resumo do projeto e das alterações (até 28/10/2026)

## Estado atual
- **Versão:** v8.9 (a Dani sobe de nível com a experiência do trabalho e dos cursos dela: XP, aumento que consolida, sem "Reduzir", diárias 0 / 15 / 20 / 25; `docs/spec-v8.9.md`), pronta para publicar, sobre a v8.8 (o Tonhão sobe de nível com a experiência dos cursos: 5 níveis, aumento que consolida a XP, sem "Reduzir"; `docs/spec-v8.8.md`), pronta para publicar, sobre a v8.7 (o Modo História: a campanha vira capítulos com objetivo e conversas, dívida da reforma da garagem desde o dia 1 e a Dani de graça no cap. 2; `docs/spec-v8.7.md`), pronta para publicar, sobre a v8.6.15 (lojinha em 4 grupos com cartões: Lanchonete, Equipe, Dinheiro e Gurugol), pronta para publicar, sobre a v8.6.14 (melhorias sem o limite de 1 por dia e o fim do dia sem o "(n)" do Gurugol), pronta para publicar, sobre a v8.6.13 (rodada de balanceamento do cardápio: salgado se pede de dois, metas dos dias 6 e 7 em R$ 140 e 170, nota mínima em 90% do teto, Garagem 2,7), pronta para publicar, sobre a v8.6.12 (os pratos ganham desenhos próprios, detalhe do curso avançado e Carnes variadas do PF), pronta para publicar, sobre a v8.6.11 (vegetarianos e veganos: ~10% das pessoas só pedem prato sem carne, curso Vegetariano e avançado Pratos veganos; antes, na v8.6.9, o cardápio cresce: a cozinha começa com PF e coxinha, os cursos do Tonhão na lojinha ensinam pratos e têm versão avançada, e cada tipo de cliente pede pelo seu gosto; a campanha de saves antigos recomeça do dia 1), pronta para publicar, sobre a v8.6.8 (prato quente) e a v8.6.7 (as regras da nota do Gurugol).
- **Branch:** `claude/main` (renomeado pelo usuário; o antigo `claude/intelligent-gauss-3owv29` não existe mais) no repositório `aarescigno/Lanchonete-corre-corre`.
- **Arquivos publicados:** `lanchonete.html` (página), mais `versoes/v1.html` a `versoes/v8.3.2.html` (da v8.1 à v8.3.2 enviadas na Versão 35), abertos pelo painel Versões. Na próxima publicação, enviar os `versoes/v8.3.3.html`, `versoes/v8.3.4.html`, `versoes/v8.3.5.html`, `versoes/v8.3.6.html`, `versoes/v8.3.7.html`, `versoes/v8.3.8.html` e `versoes/v8.3.9.html` `versoes/v8.3.10.html`, `versoes/v8.3.11.html`, `versoes/v8.4.html`, `versoes/v8.4.1.html`, `versoes/v8.4.2.html`, `versoes/v8.5.html`, `versoes/v8.5.1.html` `versoes/v8.6.html` e `versoes/v8.6.1.html` e `versoes/v8.6.2.html`, `versoes/v8.6.3.html` e `versoes/v8.6.4.html` novos (guardados da v8.3.4 à v8.6.4).
- **Capacidades declaradas (mantidas ao republicar sem `capabilities`):**
  - `db`: `ranking-carreira` e `ranking-semfim` com read "view" e write "owner";
  - `db`: `ranking-*/{self}` com write "interact";
  - `user`.
  - **Desde a v8.3.3, o jogo é offline** (pedido do usuário): `Rank.online = false` e o jogo não usa o `db` nem o `user` do artifact; o ranking fica só no aparelho. As capacidades declaradas continuam lá (omitir `capabilities` ao publicar). Quando o ranking compartilhado voltar (ajustes finais, etapa 7), ligar `Rank.online` e declarar a leitura da coleção `ranking-campanha` (read "view", write "owner"), que a v8.3 criou para a campanha.
- **Ranking** (desde a v8.3.3, só o local está ligado):
  - documentos `ranking-campanha/<userId>` (desde a v8.3: lucro acumulado da campanha e o último dia jogado; até a v8.2.3 era `ranking-carreira`, com o faturamento dos melhores dias, que fica guardado e não aparece) e `ranking-semfim/<userId>`, com `nome`, `pontos`, `dia` ou `tempo` e `quando`;
  - só sobrescreve quando a pontuação é maior;
  - fallback local em `localStorage` (`lcc2_ranking`, listas `campanha` e `semfim`; a `carreira` antiga fica guardada).
- **Save:** `lcc2_save` (desde a v8.2, com `treino:true` depois da Missão zero; o treino usa um save de mentira, com `_treino`, que nunca se grava), que importa o `lcc_save_v1` da v1 (no modo dev da v7.5.1, `lcc2_save_dev`, com `lcc2_dev` guardando se o modo está ligado). Desde a v6 guarda também o salão (`save.salao`); desde a v7, a divulgação (`save.divulga`); desde a v7.2, o livro-caixa (`save.caixa`, últimos 14 dias da carreira, e `save.caixaPend`, compras da lojinha que entram na linha do dia seguinte). Desde a v7.4, `save.salao` é `{ ponto, mesas:[{ x, y, seats, c }] }`; o salão da v6 vira a Garagem com o kit e o que custou volta numa linha "Devolução do salão" do caixa. Desde a v7.7, `save.torneira` marca que a Máquina de suco já virou Água da torneira (quem tinha recebe R$ 100, uma vez, na linha "Devolução da máquina de suco"). Até a v8.2.3, `save.maxDay`, `save.best` e `save.stars` guardavam o dia liberado, o melhor faturamento e as estrelas de cada dia; desde a v8.3 (campanha), saem e entram `save.dia` (o próximo dia; o save antigo segue do maior dia alcançado), `save.estrelas` (soma), `save.lucroTot` (lucro acumulado, o ranking), `save.neg` (dias seguidos fechando no negativo), `save.emp` (`{ resto, n }`, o empréstimo) e `save.corta` (a folha que não cabe no dinheiro fica de fora), e desde a v8.3.1 `save.emp.atr` (parcela atrasada; desde a v8.3.2, `save.emp` é `{ resto, amort, j, atr }`, com `n` calculado, e as linhas do caixa ganham `jur`) e `save.fechou` (o dia em que o banco tomou a lanchonete; a carreira acabou); `save.bank` pode ser negativo e as linhas do caixa ganham `st` (estrelas), `emp`/`forc` (empréstimo, à força) e `par` (pago ao banco). Desde a v8, `save.manut` guarda o estado de fogão, geladeira e cafeteira (0 a 1) e o sorteio do dia (`sorteio`), e as linhas do caixa ganham `man` (revisões e consertos).

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
| v7.5.1 | 21/10 | Modo dev (pedido do usuário): 10 toques no selo da versão ligam e desligam; sem painel à parte, o jogo fica igual com "Modo dev" na tela; save à parte (`lcc2_save_dev`), 7 dias, R$ 10.000 que a lojinha repõe, lojinha desde o dia 1 com melhorias de graça (liga e desliga), couvert e divulgação liberados; ranking de fora | `docs/spec-v7.5.1.md` |
| v7.6 | 22/10 | Tela larga (retorno de jogador: rolar fazia perder o controle): 1220×600, calçada, salão e cozinha juntos, sem rolar; HUD espalhado; no celular deitado, tudo do mesmo tamanho de antes | `docs/spec-v7.6.md` |
| v7.7 | 22/10 | Espera com a cara do nível (pedido do usuário): na Garagem, de pé numa faixa pintada no chão, e a Água da torneira (R$ 80, de graça na conta, pedida no balão e enchida na hora) no lugar da Máquina de suco (R$ 100 de volta para quem tinha); espada-de-são-jorge no vaso e na lata; `PONTOS.assento` e `BEBIDA_ESPERA` preparados para os níveis 2 a 4 | `docs/spec-v7.7.md` |
| v8 | 22/10 | Manutenção e imprevistos (etapa 2 do plano): fogão, geladeira e cafeteira se desgastam e quebram a partir do dia 4 (conserto na hora com a plaquinha; revisão na aba Manutenção da lojinha); chuva e feriado a partir do dia 3 | `docs/spec-v8.md` |
| v8.1 | 22/10 | Dinheiro comprometido (retorno do usuário): no alto da lojinha, o livre e o reservado para a folha e a divulgação (em vermelho quando falta); compra que faz algo ficar de fora no dia tem ⚠ e pede um 2º toque | `docs/spec-v8.1.md` |
| v8.1.1 | 22/10 | Menos balões nas mesas (retorno de jogador): só o cardápio com anel, o "!" e o "$"; esperando a comida e comendo, sem balão (saem a panela da v7.4.2 e o visto verde) | `docs/spec-v8.1.1.md` |
| v8.1.2 | 22/10 | Espera na ordem certa (retorno de jogador): o 1º da fila fica embaixo, no lugar 1, e quem chega depois fica acima; quando alguém sai, a fila desce | `docs/spec-v8.1.2.md` |
| v8.2 | 22/10 | Missão zero (pedido do usuário): o dia 0 é um treino com uma mesa só e 23 pop-ups do ciclo da Bia (cor da mesa, cardápio, pedido, Tonhão, prato, cafezinho e seus bônus, conta, louça, pia, lixo); paciência que não acaba, save de mentira, chip 0 no menu (escolhido para quem nunca treinou) | `docs/spec-v8.2.md` |
| v8.2.1 | 22/10 | Rejogar sem perder o dinheiro (pedido do usuário): Reiniciar ou Menu na pausa fecham as contas da parte jogada (contas, folha e divulgação proporcionais ao tempo; o resto da folha volta), com linha "interrompido" no caixa; não conta como dia jogado | `docs/spec-v8.2.1.md` |
| v8.2.2 | 22/10 | Só o dia completo rende (pedido do usuário, no lugar da regra da v8.2.1): folha e divulgação ficam reservadas ao abrir e saem no fim do dia, com contas e ingredientes; Reiniciar ou Menu na pausa não pagam nem ganham nada; o conserto na hora só usa o que sobra além da folha | `docs/spec-v8.2.2.md` |
| v8.3 | 23/10 | Carreira contínua e banco (etapa 2b): "Continuar" abre o próximo dia, sem escolher nem repetir; meta não batida fica sem estrelas; dias 8+ com o perfil do dia 7 e o dia da semana; caixa negativo por até 3 dias (no 4º, o banco cobre à força, 20%); aba Banco (até R$ 1.000, 10%, 5 parcelas no fim do dia; chave da folha sem dinheiro); coluna Banco no Caixa; "Recomeçar do zero" com confirmação; ranking pelo lucro acumulado (`ranking-campanha`) | `docs/spec-v8.3.md` |
| v8.3.3 | 23/10 | Jogo offline (pedido do usuário): `Rank.online = false`, o ranking fica só no aparelho, sem "Conectando..."; o compartilhado volta nos ajustes finais | `docs/spec-v8.3.3.md` |
| v8.3.4 | 23/10 | Balão de comida pronta (pedido do usuário): com o prato no balcão, a mesa que pediu mostra o prato num balão verde pulsando; na mão da Bia ou da Dani, branco até a entrega; cozinhando, sem balão | `docs/spec-v8.3.4.md` |
| v8.3.5 | 23/10 | Estoque no editor do salão (pedido do usuário): arrastar mesas para o estoque, à esquerda, e de volta (ou "Guardar no estoque" e "Pôr no salão" no balãozinho); a mesa guardada não abre no dia nem paga luz e gás, mas conta no teto; compra sem lugar vai para o estoque | `docs/spec-v8.3.5.md` |
| v8.3.6 | 23/10 | Jogo de pratos sem limite (pedido do usuário): sempre à venda, R$ 300 e +1 prato limpo por compra, fora do limite de 1 melhoria por dia (as outras seguem 1 por dia); `save.up.pratos` vira número | `docs/spec-v8.3.6.md` |
| v8.3.7 | 23/10 | 3ª estrela mais clara (retorno do usuário): "expert" vira "3 estrelas ... sem perder ninguém" na introdução, na barra de lucro e no fim do dia; a barra diz "3ª estrela perdida" após a 1ª perda e o fim do dia conta quantos foram embora. A regra não muda | `docs/spec-v8.3.7.md` |
| v8.3.8 | 23/10 | Preços de verdade (retorno do usuário): conta pelo cardápio (PF R$ 25, misto 12, pastel 10, coxinha 8) com 2º item na mesma comanda; corações = gorjeta de até 10%; sentar, anotar, entregar, recolher, cor e corrente dão pontos de atendimento, não dinheiro; ingredientes 35%, contas, folha, divulgação, multa e revisões de garagem; metas de R$ 60 a 200. Lucro do bot de ~R$ 1.870 para ~R$ 250/dia; R$ 800 no dia 10 | `docs/spec-v8.3.8.md` |
| v8.3.9 | 23/10 | Estrelas que premiam o jogo bem feito (retorno do usuário: dia 1 perfeito, 1 estrela): metas e 3 estrelas pelo bot afiado (dia 1: 30 / 50 / 60; dia 7: 180 / 250 / 310); o afiado leva 3 estrelas em ~93% dos dias 1 a 3 | `docs/spec-v8.3.9.md` |
| v8.3.11 | 24/10 | Desgaste da cozinha sem sorteio (pedido do usuário): o jogo é de ponderar custos, não riscos. Fogão, geladeira e cafeteira só gastam no verde (≥ 70%) e no amarelo (40–70%); no vermelho (< 40%) há 50% de chance de quebrar no dia e no limite (≤ 15%) quebra com certeza (`MANUT.vermelho/chanceVermelho/limite`, `manutChance`). Desgaste ~25% mais rápido (fogão 5 + 0,5/prato, geladeira 7 + 0,4, cafeteira 5 + 1): sem revisar, o vermelho chega no dia 7. Aba Manutenção e introdução dizem o ponto de cada um. |
| v8.3.10 | 24/10 | Triturador de lixo (pedido do usuário): melhoria de R$ 180 que mói 1 do lixo a cada 30 s, sem tirar a tarefa de esvaziar; o Ventilador só faz comer 15% mais rápido (o cheiro volta); a lixeira vai do cinza ao verde e, cheia, ganha tampa levantada, saco preto e fumacinha verde; aba Melhorias em 4 colunas | `docs/spec-v8.3.10.md` |
| v8.4 | 26/10 | Etapa 2c, avaliações no Gurugol (`docs/spec-v8.4.md`): cada grupo que sai na carreira dá de 1 a 5 em espera por mesa, agilidade (corações perdidos, menos os devolvidos; cor certa, corrente e caprichado somam), prato (faixa de acerto do Tonhão), cardápio e ambiente, com um balãozinho de comentário. A nota (`AVAL`, `save.aval`) é a média das últimas 100, a partir da 20ª (pedido do usuário: 100 e não 200); mexe no movimento de −10% a +10%. HUD, fim do dia e Caixa. Bot afiado com equipe ~4,4 ★, com equipe ~4,2, sem equipe ~3,6. |
| v8.4.1 | 26/10 | Caixa animada do Gurugol no fim do dia (pedido do usuário, `docs/spec-v8.4.1.md`): à esquerda dos quadros, uma barra segmentada por critério enche até a nota dele e a nota conta até o valor; abaixo de 4 pura, de 4 a 4,4 prata metalizada, de 4,5 a 4,8 ouro com brilhinhos, acima de 4,8 diamante reluzente com mais brilhos. Parada com `prefers-reduced-motion`. |
| v8.4.2 | 26/10 | Aba Gurugol na lojinha (pedido do usuário, `docs/spec-v8.4.2.md`): a caixa da nota e os últimos 30 comentários (`save.avalCom`: dia, nota, texto, tipo do grupo e VIP), do mais novo; o Gurugol sai da aba Caixa. Critérios renomeados: "Qualidade da comida" (era Prato) e "Diversidade do cardápio" (era Cardápio). |
| v8.5 | 26/10 | Etapa 2d, o sonho da Bia (`docs/spec-v8.5.md`): a abertura animada do Modo História em 9 cenas (~68 s), com o roteiro do usuário: a Rosa, mãe da Bia, a Casa Aurora, a estrela do Michelzão que ficou com o chef Bráulio, o hospital, a promessa, o Tonhão arregaçando as mangas, o banco e a inauguração na garagem. Toca sozinha uma vez (`lcc2_abertura`) e depois pelo botão História do menu; toque segue, Pular termina, quadros parados com movimento reduzido. Partes novas `18-abertura.js` e `25-abertura.js`. |
| v8.5.1 | 26/10 | Retorno do usuário (`docs/spec-v8.5.1.md`): no hospital, depois da fala derradeira da Rosa, a cortina do leito se fecha; cena nova `saudade`, com a Bia sozinha e triste no corredor (10 cenas, ~75 s). A receita especial (cominho com açafrão do Tonhão e a pétala da Dona Rosa) fica para o Modo História. |
| v8.6 | 28/10 | Etapa 2e, entregadores e marmitas (`docs/spec-v8.6.md`): o entregador espera em pé no balcão de retirada, no alto da calçada (3 lugares; a espera desceu um pouco), e o pedido dele vai pela Efood ao Tonhão, que faz o prato numa marmita (uma boca do fogão, sem prato limpo; ingredientes e R$ 2 de embalagem quando fica pronta). A Bia (ou a Dani, tarefa nova) leva a marmita ao balcão e ele paga o prato com a gorjeta dos corações, menos 15% da Efood. O "+ marmita" da janela de pedidos adianta até 2 de PF, que esperam na prateleira (mais 1 vaga para a encomenda) e esfriam em 60 s. Sem equipe 52% das metas dos dias 3 a 7, com equipe 93%; o afiado sem perder ninguém no dia 4 foi de 15% a 73%. |
| v8.6.1 | 28/10 | Etapa 2d-r, revisão estética da abertura (`docs/spec-v8.6.1.md`), as 5 partes juntas a pedido do usuário: alturas pela tabela `AB_ALT` (Rosa e Bia adulta 210 px, Bia criança 130, Tonhão e Bráulio 230) e o fogão de casa na cintura da Rosa; a Rosa mexe por cima com a colher de pau, a Bia prova com a colherinha na boca, o Tonhão mexe com colher, a pétala cai da mão da Rosa e o molho fica laranja-dourado, a Bia segura o caderno; a Rosa entra pela porta da Casa Aurora, pernas penduradas nas cadeiras, porta da enfermaria no corredor, fachada nova do banco com o papel voando até a Bia; balões no lado livre, vapor com contorno, estrela longe dos botões, plateia variada; olhar para onde anda, piscar, boca que fala e gestos suaves (nada disso com movimento reduzido). |
| v8.6.2 | 28/10 | Pedido do usuário: revisar a abertura em busca de inconsistências (`docs/spec-v8.6.2.md`). No `hospital`, a Rosa deitada ganha o corpo sob o cobertor (ombros sob a dobra do lençol, peito, quadril e pés levantando o pano, que cai pela lateral do colchão) e abre os olhos enquanto fala; a cortina do leito desce até o chão (as pontas das pernas da cama e da cadeira apareciam embaixo). No `banco`, o pote de moedas desce da mão até o chão quando a Bia chega, em vez de sumir. |
| v8.6.3 | 29/10 | Pedido do usuário: Livrinho de Sudoku (`docs/spec-v8.6.3.md`). Melhoria nova de R$ 200 que acrescenta 3 quadrinhos à fila de ações da Bia; a fila de base passa de 6 para 5 (`FILA_ACOES`, `filaMax`). Smoke29 novo | `docs/spec-v8.6.3.md` |
| v8.6.4 | 29/10 | Pedido do usuário: rebalanceamento das notas do Gurugol (`docs/spec-v8.6.4.md`). Teto por ponto (`AVAL.teto`, `avalTeto`, `avalEscala`, `avalFrac`): o serviço 5 vale 3 ★ na Garagem; humor do cliente (`AVAL.humor`, encantados até +0,8); movimento pela fração do teto; comentários de lugar simples (`AVAL_SIMPLES`); save antigo convertido uma vez (`avalEsc`). Smoke25 e 28 ajustados | `docs/spec-v8.6.4.md` |
| v8.6.5 | 29/10 | Pedido do usuário: decoração da Garagem (`docs/spec-v8.6.5.md`). Aba Decoração na lojinha, compras à vontade: plantas (as espadas-de-são-jorge da v7.7 deixam de vir de graça; samambaia nova), cantinho da Rosa (foto, quadro de giz, plaquinha "Comida é afeto"), guardar e pôr de volta de graça, e a toalha xadrez por mesa (também no editor do salão). Só visual: o peso no Ambiente do Gurugol fica para depois. Balãozinho do editor que não cabe abre para o outro lado ou em 2 colunas | `docs/spec-v8.6.5.md` |
| v8.6.6 | 29/10 | Revisão do rebalanceamento com a decoração (`docs/spec-v8.6.6.md`): no Ambiente do Gurugol, base 3 → 2, `AVAL.amb.planta` 0,3, `rosa` 0,25 e `toalha` 0,5 (só a mesa do grupo, também para quem sai bravo); elogios que citam os enfeites (`AVAL_DECOR`); `DECOR=tudo` no `balance.js`. Bot afiado: 2,74 ★ sem enfeites, 2,91 com tudo. Smoke30 com os casos novos | `docs/spec-v8.6.6.md` |
| v8.8 | 30/10 | Etapa 2g (`docs/spec-v8.8.md`): o Tonhão sobe de nível com XP dos cursos (básico +1, avançado +2), 5 níveis (XP 0/2/5/9/14), o aumento só consolida a XP e o "Reduzir" saiu; diárias 0/15/20/25/30 pela conferência do `balance.js`; save antigo rebaixado uma vez (`tonXp`); `smoke35` |
| v8.9 | 30/10 | Etapa 2h (`docs/spec-v8.9.md`): a Dani sobe de nível com XP (1 por 5 tarefas feitas e +2 por curso dela: Atendimento, Organização da cozinha e Barista), 4 níveis (XP 0/4/8/13), o aumento só consolida a XP e o "Reduzir" saiu; diárias 0 / 15 / 20 / 25 pela conferência do `balance.js`; save antigo rebaixado uma vez (`daniXp`); `smoke37` |
| v8.7 | 30/10 | Etapa 2f (`docs/spec-v8.7.md`): a campanha vira o Modo História (um save só, cap. `HISTORIA` com objetivo e conversas em balões sobre o salão, `19-conversa.js` e `26-conversa.js`); a reforma da garagem (R$ 1.000, 10 parcelas de R$ 100 + 1% ao dia, 1ª no fim do dia 2); cap. 1 (2 dias no azul), cap. 2 (Dani aprendiz de graça, nota 2,4) e cap. 3 (quitar, nota 2,7, R$ 800); Dani com 4 níveis (R$ 0, 25, 40, 55); "Ver abertura" no menu; save antigo recomeça do dia 1, com aviso. Teste `smoke34`. |
| v8.6.15 | 30/10 | Etapa 2c-r4b (`docs/spec-v8.6.15.md`): a fileira de 10 abas da lojinha vira 4 grupos (Lanchonete, Equipe, Dinheiro, Gurugol) com cartões de ícone e nome e botão Voltar; Bia (tênis, bandeja, Sudoku), Tonhão (aumento e cursos) e Dani viram seções; músico e TV e som vão para a Divulgação. Só interface. Smoke 33. |
| v8.6.14 | 30/10 | Etapa 2c-r4a (`docs/spec-v8.6.14.md`): sem o limite de 1 melhoria por dia (o limite é o dinheiro; o curso do Tonhão segue 1 por lojinha; sai `shopBought`/`boughtFor`); a caixa do Gurugol do fim do dia sem o "(n)" (a aba Gurugol mantém). Smoke 32. Carreira de 14 dias: 20/20 chegam a R$ 800, caixa de R$ 918 no dia 14 (antes R$ 723) |
| v8.6.13 | 29/10 | Rodada de balanceamento do cardápio (`docs/spec-v8.6.13.md`, etapa 2c-r3d): revisão da 2c-r3a, b e c; os cursos derrubavam o lucro (diluíam o PF), corrigido com `MAIS.salgado` 0,8; metas dos dias 6 e 7 em 140 e 170; `AVAL.minimo` 0,9 (Garagem 2,7). Calibração: sem equipe ~60%, com equipe ~92%, afiado ~75% |
| v8.6.12 | 29/10 | Desenhos próprios dos pratos, detalhe dos cursos avançados e Carnes variadas do PF (`docs/spec-v8.6.12.md`, etapa 2c-r3b) |
| v8.6.11 | 29/10 | Vegetarianos e veganos (`docs/spec-v8.6.11.md`, etapa 2c-r3c): `VEG`, `vegMov`, `pedePrato(..., veg)`, `Group.semVeg` (Cardápio 1 no Gurugol), curso Vegetariano e Pratos veganos, 8 pratos sem carne, `drawVegSelo`. Calibração: sem equipe 49%, com equipe 84% (a 2c-r3d ajusta as metas) |
| v8.6.9 | 29/10 | O cardápio cresce (`docs/spec-v8.6.9.md`, etapa 2c-r3a): `CARDAPIO` com 14 pratos, `CURSOS`, `CURSO_AV`, `GOSTOS`, `pedePrato`, aba Cursos na lojinha, `avalMenu(cursos)` (2,0 + 0,6 por curso básico), metas dos dias 2 a 5 −10%; save com `cursos`, `cursoDia`, `cardV` e `avisoCard` (save antigo recomeça do dia 1) | `docs/spec-v8.6.9.md` |
| v8.6.8 | 29/10 | Prato quente (`docs/spec-v8.6.8.md`, etapa 2c-r2): `PRATO`, `pratoPerde`, `pratoVapor`; o prato que espera no balcão perde até 1,5 na Comida depois de 8 s (em 20 s), vapor que some e "Comida meio fria."; smoke 25. |
| v8.6.7 | 29/10 | Etapa 2c-r1 do rebalanceamento do Gurugol (`docs/spec-v8.6.7.md`): critérios `null` para o que o cliente não viveu (`avalMedias` com `cnt`, `avalNota` só dos vistos), humor e folga como fração de `teto − 1`, bônus da cor/corrente/caprichado como chance de encantar (`AVAL.bonus`), faixa bronze (≥ 3,0) e `AVAL.minimo`/`avalMinimo` (95% do teto). Smoke 25 ampliado. |
| v8.3.2 | 23/10 | Empréstimo com amortização (pedido do usuário): tabela SAC, juros de 3% ao dia sobre o saldo (6% à força), parcelas que diminuem, "Amortizar" e "Quitar" cortando os juros, juros do banco no Caixa; `tests/emprestimo.js` mostra que pegar empréstimo empata no melhor caso e perde um pouco na maioria | `docs/spec-v8.3.2.md` |
| v8.3.1 | 23/10 | Atrasar o banco é game over (pedido do usuário): a parcela que não cabe no caixa fica atrasada, com aviso; sem a atrasada e a do dia no fim do dia seguinte, o banco toma a lanchonete (tela própria, ranking, só resta recomeçar do zero) | `docs/spec-v8.3.1.md` |
| v8.2.3 | 22/10 | Largar o dia tem preço (pedido do usuário): Reiniciar ou Menu na pausa com gente na espera ou nas mesas cobram, por grupo, a multa de quem sai bravo com 0 corações (R$ 30, +R$ 30 se VIP), direto do dinheiro; aviso na pausa e na introdução, linha "largado no meio" no caixa | `docs/spec-v8.2.3.md` |

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
16. **v7.5.1, modo dev** (ver `docs/spec-v7.5.1.md`; pedido do usuário):
   - 10 toques seguidos no selo da versão ligam e desligam (e há "Sair do modo dev" no menu); o selo vira "v7.5.1 · dev" e a etiqueta "MODO DEV" fica no alto da tela, até no jogo. Sem painel à parte (2º retorno do usuário: "o jogo praticamente igual").
   - Save à parte (`lcc2_save_dev`; o de verdade fica guardado), 7 dias liberados, R$ 10.000 que a lojinha repõe; lojinha desde o dia 1, com as 7 melhorias ligadas e desligadas de graça, couvert e divulgação liberados; ranking de fora. Teste `smoke15`.
17. **v7.6, tela larga** (ver `docs/spec-v7.6.md`; retorno de jogador, proposta 1 escolhida pelo usuário):
   - Tela de 1220×600 (`TW`): o mundo da v7.5 inteiro à vista; `Game.cam` fixo em 260. Saem a rolagem, as abinhas, a borda e os 2 toques.
   - HUD espalhado (`HUDX`: fila de ações +130, mãos, pausa e som +260). Celular deitado do mesmo tamanho de antes; notebook e tablet um pouco menores; palco com a altura de antes nas telas estreitas (menu e lojinha sem apertar).
   - Equilíbrio igual ao da v7.5. Testes `smoke14` (refeito), `smoke2`, `smoke7`, `smoke12`; capturas `shot_v7_6.py`.

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
- `smoke` (bot em 8 dias seguidos da campanha);
- `smoke2` (mecânicas);
- `smoke3` (123/123: v2, com o ranking compartilhado ligado à força no teste (`load({online:true})`), e o offline da v8.3.3);
- `smoke4` (23/23: VIP);
- `smoke5` (45/45: sucos, bandeja e lixeira; quem pediu suco espera por ele antes de pedir a conta, e o suco e o cafezinho são cobrados na conta);
- `smoke6` (97/97: equipe, louça, lixeira que enche, couvert, TV e som, máquina de suco no lugar da água, economia). O teste "a Dani chega a 2 itens" dependia do sorteio do dia; desde a v7.4.1 joga até 4 rodadas enquanto ela não chega a 2;
- `smoke7` (15/15: toque no celular e brilho);
- `smoke8` (19/19: conversão do salão da v6 com devolução, e as faixas de estrelas);
- `smoke9` (34/34: v7, lucro, ingredientes, contas e divulgação);
- `smoke10` (26/26: v7.1, fila justa, piso, porta e perdas por causa);
- `smoke11` (39/39: v7.2, livro-caixa, limite de 14 dias, resumo e aba Caixa);
- `smoke12` (21/21: v7.3, velocidade, Tênis de corrida, selos da fila);
- `smoke13` (58/58: v7.4 e os 4 pratos da v7.4.1, Garagem, móveis, editor do salão, posição e caminho, contas sem aluguel);
- `smoke14` (63/63: v7.5, a tela larga da v7.6 e a v7.7, espera de 4, toque na tela larga, HUD largo, água da torneira com a devolução, máquina de suco posta no ponto, Dani);
- `smoke15` (44/44: v7.5.1, modo dev, save à parte, dias à escolha (v8.3), dinheiro, lojinha desde o dia 1, melhorias, equipe com couvert, divulgação, ranking de fora, sair);
- `smoke16` (101/101: v8, manutenção e imprevistos);
- `smoke17` (22/22: v8.1, dinheiro comprometido, livre e reservado, aviso e 2º toque nas compras);
- `smoke18` (69/69: v8.2, botão Missão zero (v8.3), Missão zero jogada inteira com toques de verdade, save de verdade intacto, convite do dia 1, Reiniciar e Menu no meio do treino);
- `smoke19` (38/38: v8.2.2 e v8.2.3, folha paga no fim do dia, reiniciar ou sair pela pausa não paga nem ganha nada, multa de quem está na espera e nas mesas, conserto pago fica pago, fim do dia e "Próximo dia" sem a meta (v8.3), turno sem fim, Missão zero);
- `smoke20` (88/88: v8.3 e a amortização da v8.3.2, campanha, dias 8+, save antigo, caixa negativo e banco à força, empréstimo e parcelas, quitar, chave da folha, Recomeçar com confirmação, ranking pelo lucro acumulado);
- `smoke21` (34/34: v8.3.1 e o atraso com juros da v8.3.2, parcela atrasada e avisos, pagar no dia seguinte, o banco toma a lanchonete, menu e reabrir, recomeçar, quitar, última parcela, à força com atraso);
- `smoke25` (48/48: v8.4, a caixa da v8.4.1 e a aba Gurugol da v8.4.2, Gurugol: critérios, média das 100 últimas a partir da 20ª, movimento, save, dia inteiro, fim do dia, caixa e HUD);
- `smoke26` (37/37: v8.5, v8.5.1 e v8.6.1, a abertura (a cortina do hospital e a saudade; as alturas da tabela e a boca de quem fala): toca sozinha só na 1ª vez, cenas e tempos, falas e escuro, toque, Pular, cartão "Em breve", save intacto, modo dev, movimento reduzido);
- `smoke27` (16/16: o prato de quem vai embora não some: do balcão vai para a pia, na mão vira louça suja ou vai para a pia se não couber; o lembrete "Não se esqueça de lavar os pratos!" nos dias 3 a 5);
- `menu_fit` (14 tamanhos de tela);
- `balance` (bot, N rodadas por dia; `DIV`, `MULT`, `MOVEIS`, `MOVIMENTO`, `GRUPOS`, `DIAS`, `BOT=afiado`, `ORDEM`, `INGRED`, `CONTAS`, `METAS`; perdas por causa e 3★);
- `emprestimo` (v8.3.2: o patrimônio no fim da campanha sem empréstimo, pegando cedo, amortizando e pegando sempre; `MOVEIS`, `IMPREV`, `BANCO_CFG`, `VALOR`, `DIA0`);
- `smoke35` (v8.8, 40: XP do Tonhão, `setStaff` com a XP, lojinha, `loadSave` rebaixa uma vez, nível 5, modo dev);
- `smoke37` (v8.9, 38: XP da Dani, `setStaff` com a XP, tarefas no dia completo, cursos e trava, lojinha, fim do dia, folha que não cabe, `loadSave` rebaixa uma vez, modo dev);
- `smoke34` (v8.7, 68: reforma, conversas, capítulos 1 a 3, Dani aprendiz, save antigo, atraso; `load({historia:true})`);
- `carreira` (v8.7: joga a História, `HIST=0` sem ela; bot jogando a campanha com o dinheiro acumulado de verdade e comprando móveis; `DIAS` (padrão 14), `MOVEIS=0`, `MOVEIS=quatro`, `MOVIMENTO`, `MESAS=1`; mostra o dia em que chega a R$ 800, os dias no negativo e os empréstimos à força).

## Ideias pendentes
- Testar som e toque em celular real (o toque foi ajustado depois de relato de dificuldade, mas só testado no Chromium com toque emulado).
- Salão: conferir com o Renan se o editor da Garagem (v7.4) ficou simples. Desde a v7.4.1, mesa a mais dá lucro com equipe e mesas de 4 (o gargalo era a Bia e o movimento fixo, não os pratos); conferir com jogadores se 6% por lugar ficou no ponto e se dá para perceber que mesas de 2 demais cansam a Bia.
- v7.3: conferir com o Renan se a Bia ficou ágil o bastante e se os selos "1º, 2º..." se entendem.
- Estrelas: conferir com jogadores se a 2ª estrela (`bomGoal`, metade do caminho entre a meta e a expert) ficou no ponto.
- O painel "Como jogar" ainda rola no celular deitado.
- Ajuste de dificuldade.
- v7: conferir com jogadores se a escassez ficou no ponto (valores em `CONTAS`, `INGRED`, `DIVULGA` e nas metas). Desde a v7.2, o jeito é pedir o "Copiar resumo" da aba Caixa.
- v7.1: conferir com jogadores se a fila justa (`FILA_JUSTA`) e a porta (`PORTA`) ficaram no ponto, e se o ícone "aguardando mesa" se entende.
- **Roteiro das próximas versões em `docs/PLANO.md`** (uma etapa por sessão; log das ideias e retornos em `docs/PROPOSTAS.md`): jogo justo (feito na v7.1), livro-caixa (feito na v7.2), Bia mais ágil (feito na v7.3), Garagem e editor do salão (feito na v7.4), espera lá fora (feito na v7.5), manutenção e imprevistos (feito na v8); ordem revista em 22/10: campanha contínua com banco (2b), avaliações dos clientes (2c), abertura animada do Modo História (2d), área industrial (3a), Avenida Brasil (3b), Terraço Suíça com VIPs exigentes (4) e, a rever, modo história em 2 partes e polimento. **Revista em 28/10:** entregadores e marmitas (2e), a campanha vira o Modo História (2f), área industrial (3a), Avenida Brasil (3b), Terraço Suíça (4a), nível de luxo (4b), eventos de bairro (4c), crítico do Michelzão e final (6) e polimento (7, a rever). A 2e foi feita na v8.6 e a revisão estética da abertura (2d-r) na v8.6.1, as 5 partes juntas (28/10); a próxima é a 2f.
- A lojinha ainda rola no menor celular deitado (568×320).
- v8.6: conferir com jogadores se o balcão de retirada e o "+ marmita" se entendem sem ler o Como jogar, se a ida até o portão com a Bia sozinha não pesa demais (sem equipe, o bot bate um pouco menos as metas) e se a validade de 60 s da adiantada é curta demais.
- v8.1: conferir com jogadores se "livre" e "reservados" no alto da lojinha se entendem, e se o 2º toque nas compras não incomoda.
- v7.6: conferir com jogadores (e no celular de verdade) se a tela larga deixou tudo à vista sem ficar pequeno demais (no notebook e no tablet o jogo encolhe um pouco) e se a ida lá fora vale a pena; com a Bia sozinha, o bot afiado perdia dinheiro buscando suco em toda brecha.
- v7.7: conferir com jogadores se a Água da torneira (de graça, só paciência e coração) ainda vale os R$ 80 e a ida lá fora, e se a faixa pintada no chão se entende como lugar de espera.
