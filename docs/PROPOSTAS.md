# Log de propostas

Registro das ideias e dos retornos de quem jogou, com o texto original, e de onde cada proposta foi parar (versão feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo.

---

## 30/10/2026 — Usuário: entrevista para planejar a 2f (a campanha vira o Modo História)
**Origem:** perguntas no chat, para deixar a sessão pronta para o Sonnet. Respostas do usuário (as escolhidas entre as opções e o texto dele):

> Menu: "Só a História (Recomendado)". Objetivo não cumprido: "Continua até cumprir (Recomendado)". Dívida: "R$ 1.000, 10 parcelas (Recomendado)". Trama: "Só uma pista (Recomendado)".

> Objetivos: "Mais difícil" (o cap. 3 pede quitar a reforma, nota 2,7 e R$ 800). Fim do cap. 3: "Segue jogando (Recomendado)". Conversas: "Balões sobre o salão (Recomendado)". Save antigo: "Recomeça". 1ª vez: "Missão zero, depois cap. 1 (Recomendado)". Falas do cap. 1: "Aprovo".

> Cap. 2 (sobre contratar a Dani e pagar 3 parcelas): "Não necessariamente estará com 3 parcelas pagas ao se contratar a Dani né? E se a pessoa escolher contratar a Dani só depois de quitar a dívida?"

> Cap. 3: "Então, e se a Dani não estiver no dia? Talvez a Dani já deva entrar no 3o dia de graça nerfada, mas grátis, tipo o Tonhão que começa funcional, mas fica cada vez melhor conforme upa ele."

> Dani aprendiz de graça, com aumentos de R$ 25, 40 e 55: "Aprovo (Recomendado)". Objetivo do cap. 2: "Nota do Gurugol 2,4". Falas novas dos caps. 2 e 3: "Aprovo".

**Destino:** etapa **2f** do `docs/PLANO.md` (v8.7), com as decisões tomadas, as falas dos 3 capítulos e os alvos do `carreira.js`. A Dani de graça como aprendiz (ideia do usuário) entra nela. Decidido por mim, sem pergunta: as falas de depois do cap. 2 trocadas para combinar com o objetivo da nota; o botão História vira "Ver abertura"; partes novas `19-conversa.js` e `26-conversa.js`; a reforma começa a cobrar no dia 2, com juros de 1% ao dia.
## 30/10/2026 — Usuário: o "(n)" do Gurugol e a lojinha com abas demais
**Quem:** o usuário (Arthur), no chat:

> As notas do Gurugol após cada dia estão com um número depois da categoria, tipo agilidade (4). Pra que esses números? Da pra tirar.
>
> No menu entre os níveis tem muitas abas em cima, está cansativo de olhar e procurar, melhor fazer agrupamentos e submenus, tipo: melhorias da lanchonete, melhorias dos funcionários (Bia, Tonhão, Dani) etc. Me entreviste para esses ajustes

**Entrevista (30/10):** 4 grupos, Lanchonete (Melhorias, Salão, Decoração, Manutenção e Divulgação: "divulgação não encaixa no grupo dinheiro, está mais para lanchonete mesmo"), Equipe (Bia, Tonhão, Dani), Dinheiro (Banco, Caixa) e Gurugol sozinho; Equipe por pessoa, e "rompa com esse limite de 1 por dia, o limite é o dinheiro só e o número de cursos que dá pra fazer por dia"; submenu em cartões, só ícone e nome; as melhorias que não são de uma pessoa, o músico e a TV ficam na Lanchonete; tirar o limite e só medir o balanço; o "(n)" sai só do fim do dia.

| Ideia | Destino |
|---|---|
| Tirar o "(n)" dos critérios do Gurugol | Sessão 2c-r4a (v8.6.14): só da caixa do fim do dia; fica na aba Gurugol |
| Agrupar as abas da lojinha com submenus | Sessão 2c-r4b (v8.6.15): 4 grupos com cartões |
| Melhorias da Bia, do Tonhão e da Dani por pessoa | Sessão 2c-r4b: Equipe › Bia, Tonhão (aumento e cursos), Dani |
| Sem o limite de 1 melhoria por dia | Sessão 2c-r4a: o limite é o dinheiro; cursos seguem 1 por dia; balanço só medido |

---

## 29/10/2026 — Usuário: sabatina para planejar a 2c-r3 (cardápio e cursos do Tonhão)
**Origem:** perguntas no chat, para deixar a sessão pronta para o Sonnet. Respostas do usuário (as escolhidas entre as opções e o texto dele):

> Começo: "PF e coxinha". Pastel: "Curso na Garagem". Save antigo: "Volta para 2", e depois "Recomeça a campanha".

> Cursos: "curso salgados fritos com risolis, kibe e bolinho japonês, curso salgados assados com empada, esfiha aberta e fechada de carne, curso Chapa 1: misto quente, Bauru, pão na chapa." "pastel vira curso de pastel de feira: com esses 3 sabores aí. cada curso tem sua versão avançada para fazer para deixar mais requintadinho". Preço: "R$ 150 a 250".

> Avançado: "em vez de dobrar a chance do nível do tonhão, multiplique por 1,5 a chance do nível". "O avançado aumenta em 15% o preço, mas temos que definir os sabores/receitas \"avançadas\" para a lore do jogo".

> Pedidos: "cada tipo de cliente tem seu estilo, famílias com crianças, por exemplo, tendem a pegar mais PF, idosos gostam mais de coisas assadas ou PF, estudantes gostam de salgados, entregadores pegam salgados no primeiro terço do turno, PF no segundo terço e salgado/frituras no terceiro terço. vamos ponderar para os outros perfis. coisas parecidas". Depois, a tabela de pesos sugerida.

> Diversidade: "Por curso", 2,0 + 0,6 por curso básico; o avançado não conta.

> PF: "o avançado da coxinha entra junto dos salgados fritos avançado. PF tem 2 upgrades: opções vegetarianas como curso básico único que adiciona mais uma opção ao ramo dos PFs (15 pratos total então para nota 5) e um sprite próprio com Proteínas de soja refogada em vez do bife (grumos marronzinhos tipo carne moída refogada mesmo) e curso avançado carnes variadas, que, além dos benefícios do curso avançado, adiciona 3 sprites estéticos de carnes diferentes no prato, selecionados aleatoriamente por quem pede PF (filé de Frango grelhado, peixe frito, bife a cavalo)". Carnes variadas: R$ 400, PF +15%.

> Preços: "Fritos: risoles 6, kibe 7, bolinho japonês 8. Assados: empada 9, esfiha aberta 7, fechada 7. Chapa: misto 10, bauru 12, pão na chapa 7. Pastel: carne 10, queijo 10, pizza 11."

> Vegetariano: "o curso vegetariano pode adicionar opções vegetarianas para salgados como empada de palmito, bolinho japonês e kibe (com um \"v\" estilizado em verde sobre o prato), o que faz ele valer tanto quanto ou até mais é por aumentar atratividade da lanchonete por conta da inclusão de pessoas que não consomem carnes. o curso avançado do vegetariano é curso pratos veganos, que adiciona versão veg em quase todos os pratos (temos que ver quais são possíveis), com uma folhinha verde pequena em cima do prato pronto." PF veg R$ 23, curso R$ 150; clientes vegetarianos (~10%) que, sem o curso, pedem "pão na chapa ou pastel de queijo se a cozinha souber; se não, pede uma coxinha de qualquer jeito e dá Cardápio 1"; Pratos veganos R$ 300.

> Receitas dos avançados: "Fritos: 'coxinha massa de batata com catupiry' (vale para coxinha), risoles de camarão, kibe com coalhada, bolinho japonês com queijo). Assados: 'Massa podre da vó Nilza' (empada de frango com azeitona, esfihas com coalhada e limão). Chapa: 'Pão francês da padaria e requeijão de corte', misto quente de presunto parma e mussarela de búfala, Bauru clássico com rosbife e picles. Pastel: 'Pastel de feira de verdade' (carne com ovo e azeitona, queijo com orégano, pizza com calabresa). PF: 'Carnes variadas'."

> Lojinha: "Aba 'Cursos', 1 curso por dia". Sessões: "3 sessões", "Regras · Desenhos · Veg".

**Destino:** a sessão 2c-r3 do `docs/PLANO.md` virou 3 partes: 2c-r3a (cursos e gostos, v8.6.9), 2c-r3b (desenhos, v8.6.10) e 2c-r3c (vegetarianos e veganos, v8.6.11). Decidido por mim, sem pergunta: a Nilza é a avó da Bia (mãe da Rosa e do Tonhão); o bolinho japonês ficou de fora dos pratos veg (na última resposta, o usuário o tirou da lista); a empada de palmito e o kibe de abóbora só aparecem com o curso de assados e o de fritos; o "+ marmita" continua fazendo PF.

> Correções depois: "bolinho japonês é de carne, é uma massa frita de carne"; "mude o parma com bufala para presunto defumado com queijo minas"; e pediu clareza sobre os salgados vegetarianos no cartão do curso (os que dependem de outro curso aparecem apagados, com "precisa do curso de ...").

---

## 29/10/2026 — Usuário: entrevista sobre o relatório do Gurugol
**Origem:** entrevista no chat sobre o `docs/RELATORIO-GURUGOL.md` (as perguntas da seção 8). Respostas do usuário (as escolhidas entre as opções e o texto dele):

> Bravo: "Cada pessoa pode avaliar só o que experienciou, se não viu o cardápio sua nota não conta pra media. Imagino que isso gere as 5 notas do Gurugol contabilizadas de forma diferente, mas pode ser isso mesmo se for para balancear a pessoas que desistem no caminho"

> Humor: "Terraço pode chegar a 5" (humor proporcional ao teto e, no Terraço, o serviço perfeito com encantados crava 5).

> Cardápio: "Começa de baixo e cresce, com, na garagem, opções de salgados brasileiros clássicos diferentes, evoluindo para pastéis, e para PFs de varias formas clássicas brasileiras, como o arroz feijão bife batata frita etc. A nota por ter coisas no cardápio vai crescendo conforme várias opções vão se adicionando. O preço para adicionar é o curso de tal comida que o Tonhão fará. Com opção de fazer o curso avançado que aumenta a chance de prato ótimo para esse em específico". Começo e preço: "2 itens · R$ 150–250" (o avançado, o dobro).

> Comida: "Prato quente" (o prato que espera no balcão esfria e perde nota).

> Nota mínima para sair da Garagem: "~95% do teto" (~2,9 ★).

> Faixas da caixa do fim do dia: "Mantém absolutas, mas pode adicionar uma nota bronze para acima de 3 ou de 3,25, que tal?"

> Bônus da Agilidade: "Vira chance de encantar" (cor certa, corrente e caprichado aumentam a chance de o cliente sair encantado).

> Depois, as 2 decisões que faltavam: bronze "3,0" e os critérios "Pelo que viveu" (calçada: só Espera; bravo antes do pedido: Espera, Agilidade, Ambiente; bravo depois do pedido: + Cardápio; comeu: os 5; entregador: Espera, Agilidade e Comida).

**Destino:** nova **etapa 2c-r** do `docs/PLANO.md` (3 sessões: as regras da nota, v8.6.7; o prato quente, v8.6.8; e o cardápio com os cursos do Tonhão, v8.6.9). As decisões estão também no fim do `docs/RELATORIO-GURUGOL.md`. Ficaram de fora da entrevista: o peso do Ambiente e a oscilação da nota (4 avaliações por dia, janela de 30).

---

## 29/10/2026 — Usuário: rever o rebalanceamento com a decoração
**Origem:** pedido do usuário no chat, depois do merge da v8.6.5: "Reveja o rebalanceamento agora que entrou um novo Merge de estética", com o resumo da sessão da decoração (a proposta aceita da decoração no Ambiente, adiada para não conflitar com o teto da v8.6.4).

**Destino:** feito na **v8.6.6** (`docs/spec-v8.6.6.md`), com os valores da proposta.

---

## 29/10/2026 — Usuário: decoração da Garagem
**Origem:** pedido do usuário no chat (sugeri 4 opções: plantas, parede e luz, mesas arrumadas e o cantinho da Rosa):

> Precisamos adicionar upgrades de estética no salão da garagem, sugira 4 opções de como fazer isso. Eu pensei em uma que é tirar a planta que já está e dar a opção de colocar ela

> vamos com a 1, 3 e 4, com o critério Ambiente. É, eu já imaginava que tivesse alguma coisa sobre avaliação do ambiente nas notas do Google. Mas se não tem, é importante ter. Porque já tem lá o critério, já tem lá a barrinha que preenche com a nota, né? E ela então dá um número aleatório, né? Ou um número fixo. Isso tem que ser corrigido.

> Guarda essa mudança da nota do Google para depois, porque eu estou numa outra branch trabalhando sobre o geral de avaliações. Eu não quero que interfira um trabalho com o outro. Implementa só a parte estética e a possibilidade de upgrades de estética também. Então, as florzinhas e essas outras coisas bonitinhas, os sprites e o design e o menu de upgrades e a compra dos upgrades. A parte da influência disso segura para uma próxima etapa.

(O critério Ambiente já existia desde a v8.4 e não é sorteado: base 3 e +0,5 por TV, som, torneira, ventilador e cafezinho, +1 o couvert, −1 com a lixeira cheia. Como quase todo mundo tem as mesmas coisas, parece fixo. O rebalanceamento das notas, feito no outro branch, entrou como v8.6.4, logo antes desta.)

| Proposta | Destino |
|---|---|
| Plantas (as espadas viram compra) e samambaia | feito na **v8.6.5** (`docs/spec-v8.6.5.md`) |
| Mesas arrumadas: toalha xadrez, porta-guardanapo e florzinha | feito na **v8.6.5** |
| Cantinho da Rosa: foto, quadro de giz, plaquinha "Comida é afeto" | feito na **v8.6.5** |
| Parede pintada e varal de luz (a opção 2) | não escolhida |
| Decoração conta no Ambiente do Gurugol (base 2 e cada enfeite soma; toalha só para o grupo daquela mesa) | **adiada** a pedido do usuário (ele mexe nas avaliações em outro branch); anotada no `docs/PLANO.md`, na 4b |

## 29/10/2026 — Usuário: rebalanceamento das notas do Gurugol
**Origem:** pedido do usuário no chat (falado):

> A gente precisa fazer um rebalanceamento de notas do Guru Gol para esse jogo. Porque receber 4, muito numa garagem me parece algo... uma nota muito alta, né? Porque o que que ele vai receber de upgrade, né? O que que a pessoa que joga vai se sentir satisfeita de ver aumentar se no próximo nível já tem que ser maior que 4.35? E no outro, tipo, o objetivo vai ser sempre atingir o 5? Vai ficar nessa briga por vírgulas, 0, vírgula, pouca coisa? Acho ruim. Eu proponho que um nível máximo e mais difícil de conseguir na garagem seja 3. E assim progride para os outros até o máximo atingível ser 5 ali no terraço suíça lá. Eventualmente, foi uma margenzinha, né, que sobe um pouquinho, abaixa um pouquinho e tal, né? Então, eventualmente, no primeiro nível da garagem ali, pode chegar em 3,5, 3,8, em algum dia muito especial, assim, sei lá. Mas... tem que ter esse senso de progressão, né?

**Destino:** feito na **v8.6.4** (`docs/spec-v8.6.4.md`): teto por ponto (Garagem 3, área industrial 3,7, Avenida Brasil 4,3, Terraço Suíça 5), com o humor do cliente como a "margenzinha" (até 3,8 na Garagem). A nota mínima para sair da Garagem (era 4,5 ★) ficou como sugestão de 2,8 ★ na etapa 3 do `docs/PLANO.md`, a decidir.

---

## 29/10/2026 — Usuário: Livrinho de Sudoku
**Origem:** pedido do usuário no chat:

> Adicione mais um upgrade: livrinho de Sudoku, que aumenta a barra de tarefas em 3 gomos. Para tal, reduza a base de tarefas pré agendadas para 5

**Destino:** feito na **v8.6.3** (`docs/spec-v8.6.3.md`): a fila de ações da Bia passa de 6 para 5 quadrinhos de base e a melhoria nova (R$ 200) acrescenta 3, chegando a 8.

## 28/10/2026 — Usuário: inconsistências da abertura
**Origem:** pedido do usuário no chat:

> revise a animação inicial por inconsistências, buscando aspectos visuais ou interrupções que possam prejudicar a estética de quem vê, por exemplo, Rosa na cama não tem corpo

**Destino:** feito na **v8.6.2** (`docs/spec-v8.6.2.md`): a Rosa deitada ganhou o corpo sob o cobertor e abre os olhos enquanto fala; a cortina do leito desce até o chão; o pote de moedas do banco fica no chão em vez de sumir.

## 28/10/2026 — Usuário: decisões da etapa 2e (marmitas)
**Origem:** respostas do usuário às decisões em aberto da etapa 2e (escolhas e textos dele):

> Marmita: "Prato em marmita (Recomendado)".
> Adiantar: "dá pra adiantar até 2 por enquanto, mantendo sempre 1 outro espaço (futuramente aumentável) para entregadores retirarem outra encomenda que esteja sendo feita especificamente para eles, e com validade reduzida porque vai esfriando, futuros upgrades de poder adiantar 4 marmitas e colocar elas em estufa que estende a validade quase que para o dia todo. o custo de produção é contabilizado no momento em que a marmita é gerada, se não for pega por um entregador até o fim do dia, fica só o prejuízo de tê-la feito."
> Custo: "2 reais de embalagem e a operadora da entrega, a Efood, fica com 15% do valor pago pelo prato."
> Detalhes: "fazer marmita ocupa boca do fogão, mas não ocupa pratos, ela sai pronta com uma sprite de marmita com o desenho da comida em cima." Também marcou: balcão na calçada, a Dani entrega, ocupa boca do fogão.

**Destino:**

| Proposta | Destino |
|---|---|
| Prato do cardápio em marmita, pelo preço do prato | v8.6, feita |
| Adiantar até 2, com mais 1 vaga para a encomenda de quem espera | v8.6, feita (adiantadas de PF, no botão "+ marmita") |
| Validade curta da adiantada (esfria) | v8.6, feita: 60 s, e vai para o lixo |
| Custo na hora em que a marmita fica pronta; a que sobra é prejuízo | v8.6, feita |
| R$ 2 de embalagem e 15% da Efood | v8.6, feita |
| Ocupa boca do fogão, não usa prato; quentinha com a comida desenhada | v8.6, feita |
| Balcão na calçada; a Dani entrega | v8.6, feita (tarefa "Levar as marmitas") |
| Prateleira de 4 e estufa (upgrades futuros) | guardada no `docs/PLANO.md`, para as melhorias da 3a |

---

## 28/10/2026 — Usuário: revisão estética da abertura
**Origem:** mensagens do usuário:

> reavalie a animação de abertura e gere insights sobre o que está potencialmente inadequado quanto à estética das animações, por exemplo: a dona Rosa é mais baixa que o fogão (erro de proporção) e mexe a panela com uma vareta apontada pra cima (erro da proposta de funcionamento de uma colher de pau)

> Organize um plano de correção para esses pontos. Para fazer por etapas com checagem minha

A sessão revisou as 10 cenas em capturas e no código e achou erros de proporção (fogão, Rosa deitada, escalas soltas), de gesto (as colheres da Rosa e da Bia, o segredo do tempero), de leitura da cena (o banco como ícone, a Bia sentada sem pernas, a Rosa que não entra na Casa Aurora) e de composição (balões, vapor, inauguração).

**Destino:** Etapa 2d-r do `docs/PLANO.md` (v8.5.2), em 5 partes (R1 a R5), cada uma com capturas antes e depois e a aprovação do usuário antes do merge. Em 28/10 o usuário pediu "que tal fazer todas? de r1 a r5?": as 5 partes saíram juntas na **v8.6.1**, com as sugestões do plano nas decisões em aberto (a legenda da `promessa` ficou como estava).

---

## 28/10/2026 — Usuário: revisão do plano e das propostas sem etapa
**Origem:** mensagem do usuário:

> Bora revisar o documento de propostas e o documento de plano para a gente fazer adicionar as propostas que estão só nas propostas em planos de implementação. E aí eu quero revisar isso e revisar a ordem dos planos também.

A sessão listou o que estava só no log ou nas Ideias guardadas, sem etapa, e propôs uma ordem. O usuário respondeu às perguntas assim: marmitas "Antes da área industrial (Recomendado)"; campanha e Modo História "Juntar (Recomendado)"; eventos de bairro "Depois do Terraço (Recomendado)"; nível de luxo "Junto com o Terraço".

**Destino (`docs/PLANO.md`):**

| Proposta | Destino |
|---|---|
| Entregadores com fila própria e marmitas (27/10) | etapa **2e** (v8.6), a próxima |
| Juntar a campanha e o Modo História, com a dívida do banco da abertura, a receita da Casa Aurora e o Bráulio | etapa **2f** (v8.7: estrutura e capítulos da Garagem); um capítulo em cada ponto (3a, 3b, 4a); a etapa **6** fica com o crítico do Michelzão e o final; a antiga etapa 5 deixou de existir |
| Decoração da calçada por nível (22/10), espera e ambiente por nível | dentro da **3a**, da **3b** e da **4a**, cada nível no seu |
| Equipamento melhor (fogão industrial) | o fogão industrial da **3a**, que dá a +1 boca |
| Rebalancear as melhorias ("1 por dia, por enquanto", 23/10) | **3a** |
| Modo dev com os pontos liberados (21/10) | **3a** e **3b** |
| Nível de luxo (21/10) | etapa **4b** (v10.1), junto com o Terraço |
| Eventos de bairro: festa junina, jogo do Brasil | etapa **4c** (v10.2) |
| Pendências de conferir com jogadores (`RESUMO.md`) | etapa **7** |
| Cardápio com preço escolhido pelo jogador | continua guardada ("talvez nunca") |

---

## 27/10/2026 — Usuário: fila própria dos entregadores e marmitas
**Origem:** mensagem do usuário:

> Adiciona nas ideias de implementações futuras que os entregadores têm uma fila própria para retirar comida e não para comer no lugar. Deixa eu levar a marmita. E aí preparar algum fluxo de preparação de marmitas para liberar para os entregadores

**Destino:** ideia guardada em `docs/PLANO.md` (Ideias guardadas, "Entregadores: fila própria e marmitas"), sem etapa ainda. Nada mudou no jogo.

---

## 27/10/2026 — Usuário: conta antes do suco
**Origem:** mensagem do usuário:

> as pessoas estão pedindo as contas antes de tomarem o suco, não pode, só o café é opcional o suco elas ficam esperando até ser entregue. Inclusive o faturamento do suco e do café deve ser como o da comida, nada de pagamentos adiantados.

**Destino:** feito sobre a v8.5.1 (sem mudar o número da versão): quem pediu suco e acabou de comer não pede a conta; fica esperando o suco (`Group.esperaSuco`), perdendo a paciência no ritmo de quem espera o prato, e se for embora conta como perdido no prato. Sai o "Faltou o suco!" da conta. O suco e o cafezinho da mesa (da Bia e da Dani) não dão mais dinheiro na hora: vão para a conta do grupo (`bebConta`, "+8 na conta") e entram no valor da conta, pelo preço, fora da gorjeta (como já era o suco da espera). Como jogar e Missão zero com o texto novo. Equilíbrio sem mudança relevante (`balance.js`, dias 3 a 7: sem equipe 59% → 63%, com `EQUIPE=auto` 89% → 92%). Testes: `smoke5`, `smoke9`, `smoke24`.

---

## 27/10/2026 — Usuário: o lembrete dos pratos só nos dias 3 a 5
**Origem:** mensagem do usuário:

> esse aviso de não se esqueça de lavar os pratos aparecer só no dia 3, 4 e 5 do modo história e no modo infinito só no dia 1 e 2.

E, na pergunta sobre o Turno sem fim (que é um turno só, sem dias): "ignore isso sobre o turno sem fim, faça só a implementação no modo história mesmo".

**Destino:** feito sobre a v8.5.1: na campanha, o lembrete aparece só nos dias 3, 4 e 5; no Turno sem fim, continua em toda partida. Teste: `smoke27`.

---

## 27/10/2026 — Usuário: lembrete de lavar os pratos
**Origem:** mensagem do usuário:

> adicione que no dia 3 em diante aparece uma notificação de: Não se esqueça de lavar os pratos! no início

**Destino:** feito sobre a v8.5.1 (sem mudar o número da versão): ao abrir o dia (`Game.begin`), quando os pratos limpos são contados (dia 3 em diante e Turno sem fim), aparece por 3,5 s no centro do salão o balão branco "Não se esqueça de lavar os pratos!". Teste: `smoke27`.

---

## 27/10/2026 — Usuário: o prato some com quem desiste
**Origem:** mensagem do usuário:

> bugíssimo detectado, quando uma pessoa desiste de comer e vai embora com o prato já pronto ou em transporte para a mesa, não só a comida some, mas o prato desaparece também, e vez disso prefiro que o prato, se estiver na mão, se transforme em prato sujo para ser levado para a pia ou, se estiver no balcão, transporte-se para a pia automaticamente para ser lavado

**Destino:** feito sobre a v8.5.1 (sem mudar o número da versão): o prato pronto no balcão de quem vai embora vai sozinho para a pia ("Pra pia!", `Kitchen.purge`); o prato na mão da Bia vira louça suja (`Waitress.purgeGroup`) e, só se a louça não couber nas mãos (comandas na mão e cafezinho na bandeja), vai direto para a pia. Lavado, volta como prato limpo. Teste: `smoke27`.

---

## 26/10/2026 — Usuário: a Rosa sem corpo na cama
**Origem:** mensagem do usuário depois da correção dos braços:

> A rosa ainda é uma cabeça flutuante na cama

**Destino:** v8.5.1 (ainda não publicada; `docs/spec-v8.5.1.md`): a Rosa ganhou o corpo de camisola azul-clara saindo do travesseiro, o cobertor cobre do peito aos pés com o volume do corpo e a dobra branca do lençol, e o braço sai de baixo da dobra até a mão da Bia.

---

## 26/10/2026 — Usuário: os braços na cena do hospital
**Origem:** mensagem do usuário na v8.5.1:

> Corrige a cena da rosa no hospital segurando a mão da bia estão estranhos os braços delas

**Destino:** v8.5.1 (ainda não publicada; `docs/spec-v8.5.1.md`): a Bia tinha 3 braços (os 2 do desenho padrão e um a mais esticado) e o braço da Rosa era um bastão cor do cobertor solto em cima da cama. Agora o braço esquerdo da Bia é o que desce até a mão da mãe (`drawPerson` aceita `bracoE`), e a Rosa tem o ombro e a manga da camisola por cima do cobertor e o braço de pele estendido para a Bia.

---

## 26/10/2026 — Usuário: a morte da Rosa na abertura e a receita especial
**Origem:** mensagem do usuário depois da v8.5:

> Sobre a morte da mãe, eu acho que pode mostrar a mãe deitada no leito de hospital com a coberta, depois fecha a cortina e depois da fala derradeira da mãe, né, de cozinha com carinho, muda de cena para uma cena da Bia triste, só, sem mostrar nada gráfico, né?
> receita especial era o toque do Tonhão de cominho com açafrão e a pétala de rosa da Dona Rosa. Mas guarda isso para depois.

**Destino:** v8.5.1 (`docs/spec-v8.5.1.md`): a cortina do leito se fecha depois das falas, e entra a cena da saudade (a Bia sozinha e triste no corredor). A receita (cominho com açafrão do Tonhão e a pétala de rosa da Dona Rosa) ficou guardada para o Modo História, nas etapas 5 e 6 do `docs/PLANO.md`.

---

## 26/10/2026 — Usuário: o roteiro da abertura (etapa 2d)
**Origem:** a sessão da etapa 2d perguntou as decisões em aberto. O usuário escolheu o tom só emocionante (sem a piscadela da meritocracia), a Casa Aurora com um chef estrelado à parte e a abertura tocando sozinha uma vez. Depois, contou o roteiro em áudio:

> Vou te descrever o que eu tô pensando, você me ajuda a traduzir em cenas e depois a gente começa a executar, tá bom? A Bia, pequena criança, vendo a mãe cozinhar. Ela gostava muito da mãe cozinhar, a mãe sempre quis ser cozinheira e tal, ela cozinhava sempre muito bem, ela queria ser uma chefe e tal, né? E aí, a mãe conseguiu uma oportunidade, começou a trabalhar num restaurante e aí ficou adoecida. E aí eu pensei numa cena da Bia junto com a mãe, num leito de um hospital, né? E aí a mãe morre. E aí a Bia, que sempre aprendeu que comida era afeto, né? Era carinho e trazia alegria, né? Que seguir esse caminho em homenagem à mãe, com o sonho de ser um restaurante muito condecorado. O irmão dessa mãe, da Bia, né? Que é o Tonhão, o Antônio. Era o irmão mais velho da mãe, né? É o tio mais velho da Bia. Ele trabalhava nesse restaurante que a mãe tinha sido recém-contratada. E o restaurante, pouco depois da chegada da mãe da Bia, ganhou uma estrela Michelin. Pela ajuda do Tonhão e da mãe da Bia. Mas quem recebeu a titulação e a fama foi o cozinheiro-chefe do dia, que disse que ele que tinha usado os temperos, que na verdade foi sugestão do Tonhão e da mãe da Bia. E aí Tonhão desanimou e saiu do restaurante. Sabendo do sonho da Bia, ele decidiu arregaçar as mangas e ajudar como podia, apesar de não terem dinheiro nenhum. E aí Bia resolveu dar a cartada de correr até um banco, pegar um empréstimo e abrir seu estabelecimento na garagem. Algo assim, me ajuda aí.

A sessão propôs as cenas, e o usuário respondeu:

> Pode ser Rosa o nome da mãe. E aí, o chefe do bigode lá, pode chamar Braulio. E o Braulio nunca conseguiu fazer o mesmo molho . Talvez esteja para um momento posterior da história, sabe? O Braulio nunca conseguiu fazer o molho porque ele não sabia exatamente o que tinha sido feito. Porque o segredo da Rosa era uma pétala de rosa na panela toda de molho. Isso mudava completamente e dava nuance perfeita que garantiu o Michelin. O Michelzão, né?

**Destino:** v8.5 (`docs/spec-v8.5.md`), em 9 cenas. A estrela é a do Michelzão, nome inventado no lugar da marca real. O segredo da pétala fica guardado para o Modo História (etapas 5 e 6): na abertura, só aparece a pétala caindo na panela, como pista. O Bráulio nunca conseguir repetir o molho também fica para lá.

---

## 26/10/2026 — Usuário: nomes dos critérios e aba Gurugol
**Origem:** mensagem do usuário depois da v8.4.1:

> em vez de "prato" troque por "Qualidade da comida", Cardápio troque por "Diversidade do cardápio" crie um aba no menu entre-partidas só para o Gurugol em que apareça os últimos comentários das pessoas

**Destino:** v8.4.2 (`docs/spec-v8.4.2.md`). O "menu entre-partidas" é a lojinha, que abre entre um dia e outro: a aba Gurugol fica entre Banco e Caixa, e mostra os últimos 30 comentários.

---

## 26/10/2026 — Usuário: caixa animada do Gurugol no fim do dia
**Origem:** mensagem do usuário depois da v8.4, com a captura do fim do dia e de um quadro de atributos de um jogo de corrida (barras amarelas segmentadas, uma por atributo):

> gostaria de uma caixa animada do lado esquerdo dessa com a avaliação gurugol, em vez de texto bruto, tipo essa aqui no print, em que a barrinha vai preenchendo ate´chegar na nota dela e em baixo aparece a nota final numa animação de número que vai aumentando até chegar no valor da nota. números menores que 4 são puros, de 4 a 4,5 são prateados e metalizados, 4,5 a 4,8 são dourados e soltam um brilhinho de estrelinha, >4,8 fica reluzente e brilhante como diamante e soltam mais brilhos.

**Destino:** v8.4.1 (`docs/spec-v8.4.1.md`). As faixas valem pela nota com uma casa: 4,0 a 4,4 prata, 4,5 a 4,8 ouro, 4,9 e 5,0 diamante. A arte é original (barras no estilo do jogo, sem copiar a do print).

---

## 26/10/2026 — Usuário: etapa 2c, decisões e a média das 100 últimas
**Origem:** a sessão da etapa 2c (avaliações) perguntou as decisões em aberto, e o usuário escolheu as sugestões: a nota mexe no movimento (−10% a +10%), pesos iguais, os pontos de atendimento como bônus na agilidade e os comentários no fim do dia e num balãozinho ao sair. Durante a sessão, mandou:

> em vez de ser a media das 200 últimas avaliações, faça ser das 100 últimas avaliações, começando a contar a partir da 20 mesmo

**Destino:** v8.4 (`docs/spec-v8.4.md`): `AVAL.max` = 100 e `AVAL.min` = 20.

---

## 24/10/2026 — Usuário: desgaste sem risco de quebrar
**Origem:** mensagem do usuário, depois da v8.3.10:

> O desgaste dos equipamentos da cozinha tem que ser em valores absolutos, né? Essa questão de ser um risco de quebrar no dia é bem ruim, porque o jogo não é sobre ponderar riscos. É um jogo sobre ponderar custos e coisas assim. Então tira essa parte de riscos e pode ter uma progressão para a quebra do produto, né? Que se deixar muito para depois, ele quebra mesmo. E aí pode ter só um... Ah, quando chega no vermelho, assim, e coloca lá, 50% de chance de quebrar nesse próximo turno, sabe? Alguma coisa assim. Mas até ele, quando ele tá no verde, no amarelo, é só o desgaste que vai acumulando mesmo.

**Destino:** v8.3.11 (`docs/spec-v8.3.11.md`): verde e amarelo só desgastam; vermelho (< 40%) 50% de quebrar no dia; no limite (≤ 15%, escolha minha) quebra com certeza, para "deixar para depois" sempre acabar quebrando.

---

## 24/10/2026 — Usuário: Triturador de lixo
**Origem:** mensagem do usuário, depois da v8.3.9:

> Nova ideia de upgrade! Adicionar a melhoria triturador, que drena 1 Gominho de lixo a cada 6 segundos, acha que é boa essa velocidade? Não isenta ter que esvaziar ainda de vez em quando

**O que os números dizem** (bot comum, 10 rodadas por dia, lixeira de 6 gominhos, `TRASH.cap`): entra 1 gominho a cada ~20 s sem equipe e a cada ~14 s com a equipe completa (cada pilha lavada e cada copo jogado fora vale 1). Esvaziadas por dia, nos dias 3 a 7:

| Triturador | Sem equipe | Com equipe (a Dani também esvazia) |
|---|---|---|
| sem | 0,8 a 1,7 (cheia 3–10% do dia) | 2,0 a 2,6 |
| 1 a cada 6 s | 0 | 0 |
| 1 a cada 12 s | 0 | — |
| 1 a cada 15 s | — | 0,7 a 1,1 |
| 1 a cada 20 s | 0 a 0,4 | — |
| 1 a cada 30 s | 0,3 a 1,1 | 1,5 a 1,9 |

Com 6 s, o triturador tira o lixo 2 a 3 vezes mais rápido do que ele entra: a lixeira nunca enche e a tarefa some, ao contrário do que o pedido quer. Sugestão: **1 a cada 30 s** (a lixeira enche quase na metade das vezes e ainda é preciso esvaziar ~1 vez por dia sem equipe); 20 s se a ideia for quase tirar a tarefa.

**Decisão do usuário (24/10):**

> faz o triturador com 30 s e muda o ventilador para só fazer as pessoas comerem mais rápido. Também adicione mais evidência de que a lixeira está cheia, fazendo-a variar de cor entre a lata cinza e ela esverdeada, mude o sprite dela quando cheia para uma com saco de lixo preto ao lado com fumacinha verde saindo dele

**Para onde foi:** **feito na v8.3.10** (`docs/spec-v8.3.10.md`): Triturador por R$ 180, 1 gominho a cada 30 s; Ventilador sem o efeito do cheiro; lixeira do cinza ao verde e, cheia, com saco preto e fumacinha verde.

## 23/10/2026 — Usuário: dia 1 perfeito e só 1 estrela
**Origem:** mensagem do usuário, depois da v8.3.8:

> Joguei nível 1 do zero totalmente flawless e tirei 1 estrela só ein

**Para onde foi:** as metas da v8.3.8 vinham do bot comum, e o lucro dos primeiros dias varia muito com a sorte (no dia 1, de R$ 44 a 174 para o bot perfeito, sem perder ninguém). **Feito na v8.3.9** (`docs/spec-v8.3.9.md`): metas e 3 estrelas recalculadas pelo jogo perfeito (dia 1: meta R$ 30, 2 estrelas R$ 50, 3 estrelas R$ 60). O bot afiado leva 3 estrelas em ~93% dos dias 1 a 3. A regra não muda.

---

## 23/10/2026 — Usuário: ganho demais na Garagem
**Origem:** mensagens do usuário, depois da v8.3.7:

> Então, fui jogando joguinho e acumulo muito dinheiro ainda assim. Tô no nível garagem, tô juntando muito dinheiro por dia. Ali no... Isso é ruim, né? O que que tá acontecendo? Acho que as pessoas estão pagando demais. Cada pessoa tá comendo e gastando demais ali. Digo, a arrecadação tá muito grande por dia. Talvez seja uma questão de ajustar nesse sentido. Porque é 10 reais só de sentar, 5 do café, mas não sei quanto, sabe? Acho que esses ganhos marginais assim não estão sendo corretos, né? O que você acha?

> Então, eu acho que a proposta é ser relativamente realista, né, esse jogo. Então, os valores também pagos, os valores do restaurante também tem que ser compatíveis com a localização dele, né? Então, não tem como alguém gastar 100 reais numa lanchonete na garagem de alguém, né?

Respostas às perguntas (23/10): as ações "rendem pontos e contam para o marcador de qualidade do restaurante, pois funciona como uma forma das pessoas se sentirem bem atendidas, uma das metas para upgrade, ser garagem avaliada 4,5+ estrelas no Gurugol para poder avançar para próximo nível"; a conta "por prato do cardápio, mas some que uma pessoa pode pedir mais de um prato se quiser comer e beber mais. Máximo de 2 pedidos por pessoa pra não ficar travando a mesa"; gorjeta de até +10%; "pesquise como seriam preços na vida real e me traga para decidirmos ajustes para jogabilidade". Depois da pesquisa: juntar os R$ 800 em ~10 dias; Bandeja, Jogo de pratos e juros ficam caros; meta só de lucro, mais baixa; primeiro os preços e depois a nota.

**Para onde foi:** o bot mostrou ~R$ 1.870 de lucro por dia contra metas de ~R$ 600, e 36% do faturamento vinha das ações. **Feito na v8.3.8** (`docs/spec-v8.3.8.md`): cardápio com preços de 2026 (PF R$ 25), 2º item na mesma comanda, gorjeta de até 10%, ações viram pontos de atendimento, e custos e metas de garagem. A nota do Gurugol, com 4,5★ para subir de ponto, foi anotada na etapa 2c do `docs/PLANO.md`.

---

## 23/10/2026 — Usuário: a 3ª estrela não veio
**Origem:** mensagem do usuário, com a captura do fim do dia 7 (lucro de R$ 1583, expert R$ 1250, 1 perdido, 2 estrelas):

> Olha só, tive lucro suficiente para 3 estrelas e o jogo me deu 2 só.

**Para onde foi:** a regra estava certa (3ª estrela = lucro da expert **e** nenhum cliente perdido), mas a tela não deixava isso claro. **Feito na v8.3.7** (`docs/spec-v8.3.7.md`): "expert" vira "3 estrelas ... sem perder ninguém" na introdução, na barra de lucro e no fim do dia; a barra mostra "3ª estrela perdida" depois da 1ª perda, e o fim do dia diz quantos clientes foram embora. A regra não mudou.

---

## 23/10/2026 — Usuário: Jogo de pratos sem limite
**Origem:** mensagem do usuário, depois da v8.3.5:

> pratos devem ser melhorias sempre disponíveis para compra de quantas vezes a pessoa quiser, as demais melhorias ainda limitadas a 1 por dia (por enquanto até rebalanceamento financeiro)

**Para onde foi:** **feito na v8.3.6** (`docs/spec-v8.3.6.md`): o Jogo de pratos fica sempre à venda (R$ 300 cada, +1 prato limpo por compra) e não conta como a melhoria do dia; as outras seguem 1 por dia. O preço e o limite das outras ficam para o rebalanceamento financeiro.

---

## 23/10/2026 — Usuário: estoque no editor do salão
**Origem:** mensagem do usuário, depois da v8.3.4:

> no editor de posições das cadeiras do menu entre níveis, importante ter um espaço de "estoque" para deixar as cadeiras para mais fácil reorganização, quando o salão está cheio fica difícil de remanejar as cadeiras só com a área do salão mesmo.

**Para onde foi:** **feito na v8.3.5** (`docs/spec-v8.3.5.md`): o editor do salão (lojinha, aba Salão) ganhou o estoque, na faixa à esquerda do salão. Arrastar a mesa até ele a guarda; arrastar de volta (ou "Pôr no salão") a recoloca. A mesa guardada não abre no dia nem paga luz e gás, mas conta no teto de lugares (para não virar um jeito de comprar além do teto).

---

## 23/10/2026 — Usuário: balão de comida pronta
**Origem:** mensagem do usuário, depois da v8.3.3:

> quando a comida estiver pronta, aparecer balão com a imagem dela no grupo que a pediu

**Para onde foi:** **feito na v8.3.4** (`docs/spec-v8.3.4.md`): com o prato no balcão, a mesa que pediu mostra um balão verde pulsando com o desenho do prato; na mão da Bia ou da Dani, o balão fica branco até a entrega. Enquanto cozinha, continua sem balão (a panelinha que saiu na v8.1.1, a pedido de jogador, não volta).

---

## 23/10/2026 — Usuário: jogo offline por enquanto
**Origem:** mensagem do usuário, depois da v8.3.2 (sobre a pendência de declarar a coleção `ranking-campanha` ao publicar):

> Não precisa de modo online com ranking compartilhado, é pra ser um jogo offline a princípio, onlinização eu prevejo só para os ajustes finais do jogo

**Para onde foi:** **feito na v8.3.3** (`docs/spec-v8.3.3.md`): `Rank.online = false`, o ranking fica só no aparelho e o jogo não usa o `db` nem o `user` do artifact. Religar o compartilhado ficou na etapa 7 (polimento) do `docs/PLANO.md`.

---

## 23/10/2026 — Usuário: amortização e empréstimo que não valha sempre a pena
**Origem:** mensagem do usuário, depois da v8.3.1:

> Aproveita e inclui a dinâmica de amortização de empréstimo também.
> Fiquei preocupado de essa dinâmica ficar muito vantajosa, tipo pegar empréstimo sempre valer a pena pelo lucro proporcional que o empréstimo traria, está balanceado isso? Deve ter risco pegar empréstimo e ser relativamente neutro ou pelo menos um pouco desvantajoso pegar empréstimo no longo prazo na maioria dos casos

**Para onde foi:** **feito na v8.3.2** (`docs/spec-v8.3.2.md`): tabela SAC com juros de 3% ao dia sobre o saldo, amortizar e quitar na aba Banco. Medido com `tests/emprestimo.js`: no melhor caso empata, na maioria perde R$ 200 a R$ 500 em 14 dias; o risco é o atraso que fecha a lanchonete (v8.3.1).

---

## 23/10/2026 — Usuário: atrasar o banco é game over
**Origem:** mensagem do usuário, depois da v8.3 (campanha contínua e banco):

> Se atrasar de pagar o banco, ele autua e game over

Decisões confirmadas na mesma conversa (as sugeridas): prazo de 1 dia (a parcela que não cabe no caixa fica atrasada, com aviso; se no fim do dia seguinte não der para pagar a atrasada e a do dia, o banco toma a lanchonete); o empréstimo à força do 4º dia no negativo continua; no game over, a carreira acaba e o único caminho é recomeçar do zero.

**Para onde foi:** **feito na v8.3.1** (`docs/spec-v8.3.1.md`).

---

## 22/10/2026 — Usuário: revisão da ordem do plano e abertura animada do Modo História
**Origem:** a sessão juntou tudo o que estava planejado e nas ideias guardadas e propôs uma ordem nova (campanha contínua com banco, avaliações, área industrial, Avenida Brasil, Terraço Suíça e, depois, Modo História e polimento). Resposta do usuário:

> Até E tá ótimo, FGH e depois vai precisar rever, aí vemos depois.
> Entre B e C, vamos criar uma animação de abertura do modo história sobre de onde a Bia tirou a ideia é o profundo desejo de ter um restaurante estrela Michelzão

**Para onde foi cada ideia (`docs/PLANO.md`):**
- **Ordem nova até o Terraço Suíça:** etapa **2b** (v8.3, campanha contínua, dinheiro no negativo e empréstimo no banco), **2c** (v8.4, avaliações dos clientes), **2d** (v8.5, abertura animada), **3a** (v9, mudança e área industrial), **3b** (v9.1, Avenida Brasil) e **4** (v10, Terraço Suíça). A campanha, o banco e as avaliações saíram das ideias guardadas e viraram etapas.
- **Modo História (5 e 6), polimento (7) e o que vem depois:** marcados "a rever" com o usuário antes de começar.
- **Abertura animada** sobre de onde a Bia tirou a ideia e o desejo da estrela: etapa **2d**, entre as avaliações e os pontos, com roteiro sugerido de 5 cenas (decisões em aberto lá). Vira o prólogo do Modo História.
- **"Michelzão":** é o nome do guia, que era "Guia Garfo de Ouro" na etapa 6. Como o Terraço Suíça, é uma brincadeira com o nome real, com estrela e plaquinha desenhadas por nós, sem logo nem arte do guia de verdade.
- Na revisão, saiu da etapa 3 a trava "mesa a mais não dá lucro", já resolvida na v7.4.1.

---

## 22/10/2026 — Usuário: largar o dia com clientes na porta ou na mesa é penalizado
**Origem:** mensagem do usuário, depois da v8.2.2 (citando o resumo da v8.2.1):

> Quando a pessoa encerrar o dia no meio e tiver clientes na porta ou na mesa, a pessoa deve ser penalizada como se as pessoas tivessem desistido por zerar corações.

**Para onde foi:** **feito na v8.2.3** (`docs/spec-v8.2.3.md`): ao Reiniciar ou sair pelo Menu no meio do dia, cada grupo na espera ou nas mesas vai embora bravo e paga a multa de quem zera os corações (R$ 30, mais R$ 30 se VIP), direto do dinheiro acumulado. O resto da v8.2.2 continua (o dia largado não rende nada).

---

## 22/10/2026 — Usuário: só dias completos rendem; progresso por experiência e dinheiro
**Origem:** mensagem do usuário, depois da v8.2.1:

> E aí o processo vai ser através, o progresso, né? Vai ser através do acúmulo de experiências, dinheiro, etc., para progredir para novos restaurantes.
>
> Cobrar o salário ao fim do dia só e, quando a pessoa interromper no meio de um dia, não ganha nada, só dias completos rendem

**Para onde foi cada ideia:**
- **Feito na v8.2.2** (`docs/spec-v8.2.2.md`): a folha e a divulgação são pagas no fim do dia (ao abrir, só ficam reservadas); Reiniciar ou Menu na pausa não pagam nem ganham nada. Substitui a regra da v8.2.1.
- **Ideia guardada** no `docs/PLANO.md`, junto com a "Carreira como campanha contínua": o progresso vem do acúmulo de experiência e dinheiro, que levam a novos restaurantes (combina com os pontos das etapas 3 e 4).

---

## 22/10/2026 — Usuário: rejogar o dia mantendo o dinheiro; depois, campanha contínua
**Origem:** mensagem do usuário, depois da v8.1.2 (feito sobre a v8.2):

> Outra avaliação. Liberar para, quando a pessoa rejogar o nível, ela manter o dinheiro que ela ganhou. Isso por enquanto, né? Porque depois, anota aí, depois a gente vai abolir esse sistema de níveis para ser uma campanha de novo dia. Novo dia, novo acúmulo, novo serviço, nova vida, e vai seguir com tudo que tinha antes.

**Para onde foi cada ideia:**
- **Feito na v8.2.1** (`docs/spec-v8.2.1.md`): terminar o dia e "Repetir dia" já guardavam o dinheiro; o que se perdia era Reiniciar ou Menu na pausa, no meio do dia. Agora eles também guardam o que o dia rendeu (contas, folha e divulgação só da parte jogada; o resto da folha volta), com linha "interrompido" no caixa.
- **Ideia guardada** no `docs/PLANO.md` ("Carreira como campanha contínua"): acabar com os níveis que se escolhem e rejogam; cada dia é um dia novo, que segue com tudo o que havia antes (dinheiro, móveis, equipe, desgaste).
---

## 22/10/2026 — Usuário: Missão zero, o tutorial com pop-ups
**Origem:** mensagem do usuário, depois da v8.1.1 (a sessão se chamava "Missão zero tutorial com pop-ups"; o primeiro pedido não chegou e ele explicou de novo):

> Boa, tem que ter uma missão tutorial, tipo um dia zero, assim, ou mesmo dia um. E precisa mostrar todo o fluxo de tarefas que a Bia pode fazer. Então, direcionar a pessoa para a mesa, é importante direcionar da mesma cor, que tem bônus. É, esperar o cardápio, pegar o pedido, levar para o Tonhão, esperar, servir a comida, servir o cafezinho, explicar os bônus que tem no cafezinho, de dinheiro e de pontuação. E de coração, né? É, retirar os pratos, lavar os pratos, cobrar, tirar o lixo, lavar os pratos, todo esse ciclo aí.

**Para onde foi cada ideia:**
- **Feito na v8.2:** o dia 0 é a Missão zero, um treino com uma mesa só e 23 pop-ups (`docs/spec-v8.2.md`).
- Levar à mesa da mesma cor, com o bônus: passos "cor" e "sentar" (só a mesa da cor certa aceita o grupo no treino).
- Esperar o cardápio, pegar o pedido, levar ao Tonhão, esperar, servir: passos "cardapio" a "servir".
- Cafezinho e os bônus dele (dinheiro, pontuação e coração): passos "cafe", "cafe2" e "bonus"; o passo "conta" mostra a conta de verdade com os 5 corações ("a conta de R$ 36 virou R$ 54") e que o que entra é a pontuação do ranking.
- Cobrar, recolher os pratos, lavar e tirar o lixo: passos "cobrar" a "lixo". Na ordem do jogo, cobrar vem antes de recolher (a louça só fica na mesa depois que o grupo paga e sai).
- "Dia zero ou mesmo dia um": ficou como dia 0, à parte, que não conta para a carreira (a paciência não acaba); quem nunca treinou já encontra o 0 escolhido no menu, e o dia 1 convida quem pulou.

---

## 22/10/2026 — Retorno de jogador: a ordem da espera lá fora
**Origem:** mensagem do usuário, repassando um retorno da beta tester, depois da v8.1.1:

> Outro feedback que recebi da minha beta tester: a fila de chegada das pessoas, ela acumula de uma forma errada. ela acumula, sendo que o último fica em cima, né? O que está mais tempo fica em cima e deveria estar abaixo. Então deveria acumular na porta embaixo, ser o antigo, e vai acumulando para cima os outros que chegam depois

**Para onde foi cada ideia:**
- **Feito na v8.1.2:** o 1º da fila fica no lugar 1, embaixo, e quem chega depois fica acima dele; quando alguém sai, quem estava acima desce.

---

## 22/10/2026 — Retorno de jogador: só três balões nas mesas
**Origem:** mensagem do usuário, repassando um retorno, depois da v8.1:

> Recebi um feedback aqui. Durante o jogo, cada pessoa sentada, né, cada grupo sentado, vai ter um timerzinho, né, de um círculo fechando ali, de escolher no cardápio. E depois ele vai chamar para você ir lá pegar o pedido. Depois que pega o pedido, fica um símbolo da panelinha. Pode tirar esse balãozinho da panelinha e depois tira o símbolozinho também deles comendo. Pra ficar só o símbolo do lendo cardápio, exclamação pra chamar e dinheirinho pra terminar. Só.

**Para onde foi cada ideia:**
- **Feito na v8.1.1:** sem balão da panelinha (esperando a comida) nem do prato com anel (comendo); ficam só o cardápio com anel, o "!" e o "$". O visto verde de "prato no balcão", que ficava no balão da panela, saiu junto.

---

## 22/10/2026 — Usuário: o dinheiro da folha já estava comprometido
**Origem:** mensagem do usuário, depois da v8:

> Eu tive a oportunidade de começar o jogo e eu tinha R$159 ali, né, no dinheirinho do jogo. E eu falei, vou comprar mais uma cadeira. Comprei mais um kit de cadeiras, duas cadeiras lá. E aí, quando começou o jogo, desativou automaticamente as televisões e a Dani. Eu acho que isso não é bom. Eu fiquei iludido achando que ia ter dinheiro para comprar um upgrade, mas na verdade o dinheiro já estava travado. Então acho que seria bom sinalizar que esse dinheiro da paga da Dani e da televisão já estão sendo contados inicialmente, né? Então eu não tenho 159 livres para gastar. Eu tenho menos que isso, porque boa parte já está comprometido pros custos dos equipamentos e da equipe. Talvez valha a pena até deixar ficar no negativo, sabe? E aí no negativo você tem a opção de não pode ficar negativo mais que 3 dias seguidos, e tem a opção de pegar um empréstimo num banco. Aí o empréstimo no banco aplica-se juros, né? Aliás, uma ideia também para a história é que ela quis começar esse trabalho para começar a pagar tudo, a reforma da garagem, essas coisas, para deixar tudo nos conformes da vigilância sanitária, etc. Ela pegou um empréstimo do banco e tem um prazo para saldar esse empréstimo. Eu acho que seria interessante isso para o futuro, né, na lore. Mas por agora, só essa questão de demonstrar que o dinheiro já... que dá na conta, teoricamente já está comprometido.

**Para onde foi cada ideia:**

| Ideia | Destino |
|---|---|
| Mostrar que o dinheiro da Dani e da TV já está comprometido | **v8.1, feita** (`docs/spec-v8.1.md`): "livre" e "reservados para Dani e TV" no alto da lojinha; em vermelho quando falta; compra que faz algo ficar de fora tem ⚠ e pede um 2º toque |
| Deixar o caixa ficar negativo (no máximo 3 dias seguidos) | Ideia guardada no `docs/PLANO.md`: "Dinheiro no negativo e empréstimo no banco" |
| Empréstimo no banco, com juros | Mesma ideia guardada |
| Na história, a Bia pegou um empréstimo para a reforma da garagem (vigilância sanitária), com prazo para quitar | Etapa 5 (Modo História, parte 1), nas decisões em aberto: a dívida de abertura pode ser essa |

---

## 22/10/2026 — Usuário: "QUEBRADO", não "FORA DE SERVIÇO"
**Origem:** mensagem do usuário, na sessão da v8, sobre a placa da cafeteira quebrada:

> "\"QUEBRADO\" é melhor, usar termos mais comuns no brasil é mais adequado para esse projeto"

**Destino:** v8, feito (placa da cafeteira) e regra nova no `CLAUDE.md` ("Palavras do dia a dia").

---

## 22/10/2026 — Usuário: decisões da etapa 2 (manutenção)
**Origem:** mensagem do usuário, ao começar a sessão da v8, com as 4 sugestões da etapa 2 do `docs/PLANO.md`:

> "Bora dar seguimento nos próximos pontos e propostas?"

**Respostas** (aceitou as 4 sugestões):
1. Equipamentos: fogão, geladeira e cafeteira.
2. Conserto: de emergência, com um toque no equipamento quebrado (plaquinha), além da revisão na lojinha.
3. Chuva e feriado: já na v8.
4. Quebras: só a partir do dia 4 (o desgaste corre desde o dia 1).

**Destino:** v8, feito (`docs/spec-v8.md`).

---

## 22/10/2026 — Usuário: decoração por nível e o Joca
**Origem:** mensagem do usuário, logo depois da v7.7 (antes de publicar):

> "E decoração, plantas, essas coisas, né? Decoraçãozinha da casa da Bia, lá da garagem da Bia, né? Nível 1. Pode ser só a espada de São Jorge, né? As plantinhas assim, mais simplinhas, né? No nível 2 pode ter de planta na decoração, talvez uma... violeta. Não sei, alguma planta que seja um pouquinho maior, um pouquinho mais bonita, né? E nível 3, coisas mais rebuscadas, né? Aí pode ser, sei lá, uma tulipa ou uma flor mais rebuscada que você saiba, que eu não conheço tantas. E nível 4, flores muito belas e arranjos bonitos, tipo ikebana, essas coisas assim. E mais uma vez, o que não for para usar nesse nível 1 agora, anota nas ideias para o nível 2. E 3 e 4.
> Ideias para implementar a partir do nível 2 ou 3. É possibilidade de contratar um segundo ajudante. Joca."

**Destino:**

| Nível | Decoração | Destino |
|---|---|---|
| 1, Garagem | espada-de-são-jorge, plantinhas simples | **v7.7, feito** (entrou na mesma versão, que ainda não tinha sido publicada): no vaso de barro e numa lata de tinta reaproveitada |
| 2, área industrial | planta um pouco maior e mais bonita: violetas (sugestões: antúrio, samambaia pendurada) | etapa 3 do `docs/PLANO.md` ("Decoração da calçada por nível", nas Ideias guardadas) |
| 3, Avenida Brasil | flores mais rebuscadas: tulipas (sugestões: orquídeas, copos-de-leite) | etapa 3 (idem) |
| 4, Terraço Suíça | flores muito belas e arranjos: ikebana (sugestão: arranjos de orquídeas) | etapa 4 (idem) |

- **Joca, o 2º ajudante** (do nível 2 ou 3 em diante): guardado no `docs/PLANO.md` (etapa 3, "2º garçom", e nas Ideias guardadas, "Mais funcionários"), com as decisões em aberto (tarefas, salário, níveis, visual).

---

## 22/10/2026 — Usuário: a espera lá fora com a cara de cada nível
**Origem:** mensagem do usuário, depois da v7.6:

> "Eu percebi algumas coisas na fila de espera, que agora tá na tela grande, né, lá de fora, que a estética da fila de espera de fora tem que ser similar aos níveis dos restaurantes, né? Por exemplo, nível 1 não pode ter nada. Tem que ser o lado de fora, a fila de espera, servindo o copo d'água da torneira, sabe? E aí o próximo nível, que tem o jarra de suco, o próximo nível tem... águas saborizadas diferentes, e o nível maior é coquetelaria lá de fora, sabe? Acho que é isso. E também os banquinhos lá de fora, né? É de pé no primeiro, no segundo pode ter esses cadeirinha de plástico, ou banquinho de madeira, assim, né? Essa coisinha assim. No terceiro já põe sofás. E no quarto coloca poltronas individuais e coisa assim. É isso. O que não for para aplicar agora, que a gente só está mexendo no nível 1, guarde nas ideias e propostas para a próxima."

Respostas às dúvidas da sessão (as sugestões aceitas): Torneira: "Melhoria barata (Recomendado)", R$ 80 na lojinha, com R$ 100 de volta para quem já tinha a máquina · Pedido: "Pede no balão (Recomendado)", sem tablet, e a Bia enche os copos na hora (~1 s).

**Destino:**

| Nível | Assento | Bebida da espera | Destino |
|---|---|---|---|
| 1, Garagem | de pé | copo d'água da torneira | **v7.7, feito** (`docs/spec-v7.7.md`): faixa pintada no chão; a Máquina de suco virou a Água da torneira (de graça, R$ 80) |
| 2, área industrial | cadeirinha de plástico ou banquinho de madeira | jarra de suco | etapa 3 do `docs/PLANO.md` (guardado em "Espera lá fora por nível", nas Ideias guardadas) |
| 3, Avenida Brasil | sofás | águas saborizadas diferentes | etapa 3 (idem) |
| 4, Terraço Suíça | poltronas individuais | coquetelaria lá fora | etapa 4 (idem) |

---

## 22/10/2026 — Retorno de jogador: rolar a tela faz perder o controle
**Origem:** mensagem do usuário, repassando o retorno de um jogador sobre a v7.5:

> "recebi feedback que esse rolar para o lado faz perder o controle sobre o jogo, que deve ser dinâmico e com tudo à vista, será que dá para espremer tudo numa tela só? faça propostas com a fila de espera fora à esquerda, fora acima e fora abaixo do salão ou outras que você compreenda ser útil"

Propostas (com montagens): 1) tela mais larga, sem rolar (recomendada); 2) espera à esquerda, dentro dos 960 px; 3) espera em cima, na faixa da parede; 4) espera embaixo (não recomendada: perto do HUD); 5) mistura da 1 com a 3. O usuário respondeu: "Faça a 1".

**Destino:** v7.6, feito (`docs/spec-v7.6.md`): tela de 1220×600 com a calçada, o salão e a cozinha juntos; saem a rolagem e as abinhas da v7.5.

---

## 21/10/2026 — Usuário: modo dev sem painel à parte
**Origem:** mensagem do usuário, depois da 1ª versão do modo dev (com painel próprio):

> Faltou incluir nesse modo dev a possibilidade de todos os restantes, né? Tipo, a equipe completa, todas as outras coisas que são upgrades ali, estar disponíveis no menu. Eu tinha pensado em ter um menu, como se fosse um menu de upgrades, de ir para o próximo nível, essas coisas, né? Em que todas as coisas estivessem ali, habilitáveis. Em vez de ser um menu à parte do modo dev, sabe? Só põe o modo dev escrito em todo lugar e vira modo dev. Com o jogo praticamente igual.

**Destino:** v7.5.1, refeita antes de publicar (`docs/spec-v7.5.1.md`): saiu o painel; o jogo fica igual, com "Modo dev" no selo e no alto da tela. A lojinha abre antes de qualquer dia (até o 1) com tudo liberado: as 7 melhorias de graça (liga e desliga), equipe completa (o dinheiro volta a R$ 10.000 a cada lojinha), couvert mesmo na Garagem e divulgação desde o dia 1. "Próximo nível" do salão ainda não existe (só a Garagem): quando vierem os pontos das etapas 3 e 4, entram liberados no modo dev.

---

## 21/10/2026 — Usuário: modo dev
**Origem:** mensagem do usuário, depois da v7.5:

> Adicione um dev  mode ao clicar/tocar 10x no ícone com a versão do jogo (p. Ex. v7.5) nesse dev mode quero todos os níveis liberados, 10000 de dinheiro e liberação para ativar ou desativar quaisquer upgrades do jogo

**Destino:** v7.5.1, feito (`docs/spec-v7.5.1.md`): 10 toques seguidos no selo da versão ligam o modo dev, com os 7 dias liberados, R$ 10.000 (e um botão para repor) e todas as melhorias ligadas e desligadas de graça, no painel do modo dev e na lojinha. Para não estragar o progresso nem o ranking, o modo dev usa um save à parte (o de verdade volta ao sair) e não salva no ranking.

---

## 21/10/2026 — Usuário: decisões da etapa 1d-2 (calçada)
**Origem:** respostas do usuário às dúvidas da 1d-2, no começo da sessão (todas as sugestões aceitas):

> Calçada: "Estreita, ~260 px (Recomendado)" · Arrastar: "Arrastar só no vazio + abinha (Recomendado)" · Suco: "R$ 12, igual ao do balcão (Recomendado)" · Dani: "Levar o suco da espera (Recomendado)"

**Destino:** v7.5, feito (`docs/spec-v7.5.md`): a calçada tem 260 px (olhando a calçada, só a cozinha sai da tela); o arrasto do fundo só começa onde nenhum alvo pega o toque, e as abinhas fixas no alto ("◀ Calçada" e "Salão ▶") levam a tela, com a da calçada piscando quando lá fora precisa de atenção; o suco da espera custa R$ 12 na conta; a Dani pode levar o suco da espera.

---

## 21/10/2026 — Usuário: ambiente de cada nível do salão
**Origem:** mensagem do usuário, depois da v7.4.4:

> para nivel 1 são esses aí e anote nas propostas o que será para os próximos níveis:
> nivel 2: 3 televisores com playlist de sertanejo versão com anúncios reduz em 10% a perda de paciência, versão sem anúncios com custo de 20 reais por dia com redução de 15% da perda de paciencia
> nível 3: couvert artístico como já conhecemos
> nível 4: Couvert com quarteto de cordas ou pianista, ambos reduzindo em 20%, mas pianista adiciona em luxo do ambiente também e tem custo de manutenção do piano também. guarde nas ideias

**Destino** (guardado nas Ideias do `docs/PLANO.md`, item "Ambiente por nível do salão", e citado nas etapas 3 e 4):

| Nível | Ponto | Ambiente | Paciência nas mesas | Custo |
|---|---|---|---|---|
| 1 | Garagem da mãe da Bia | TV de tubo na Rede Esfera e som na rádio Velha Brasil FM (**feito na v7.4.4**) | 5% cada (10% os dois) | luz: R$ 15 e R$ 10/dia |
| 2 | Lanchonete na área industrial | 3 televisores com playlist de sertanejo, **com anúncios** | 10% | a luz (valor a definir) |
| 2 | | a mesma playlist **sem anúncios** | 15% | R$ 20/dia mais a luz |
| 3 | Restaurante na Avenida Brasil | couvert artístico como o de hoje (músico; taxa opcional de R$ 3 por pessoa, que corta o efeito à metade) | 20% | R$ 80/dia |
| 4 | Terraço Suíça | couvert com **quarteto de cordas** | 20% | diária a definir |
| 4 | | couvert com **pianista**: soma ao **nível de luxo** do ambiente | 20% | diária a definir + manutenção diária do piano |

**Respostas do usuário às decisões em aberto** (21/10, na mesma conversa):
> são trocados, os bonus são perdidos ao avançar
> tem que incluir valor da luz também
> os custos do quarteto e pianista estão a definir, manutenção diária, não estádefinida pontuação do luxo ainda... deixar para o futuro

- **Ao mudar de ponto, o ambiente é trocado:** o do nível de baixo sai (a TV e o som da Garagem não vão para a área industrial), e os bônus dele se perdem. Cada ponto só tem o ambiente do seu nível.
- **Luz das TVs do nível 2:** as duas versões pagam a luz dos 3 televisores. A versão sem anúncios custa R$ 20/dia **mais** a luz. (Leitura da sessão: "incluir a luz também" = somar a luz aos R$ 20; se a ideia era R$ 20 já com a luz, é só ajustar na etapa 3.)
- **Nível 4:** a diária do quarteto e a do pianista ficam a definir; a manutenção do piano é **diária**; quanto o pianista soma ao nível de luxo fica para o futuro (o nível de luxo ainda não tem pontuação).
- Continua em aberto: se os efeitos de um mesmo nível se somam (TV e som somam desde a v7.4.4) e o valor da luz das TVs do nível 2.

---

## 21/10/2026 — Usuário: couvert só no nível 3; TV e som na Garagem
**Origem:** mensagem do usuário:

> couvert artístico é para o nível 3 só, para nível 1 é televisão passando Rede Esfera com redução de 5% de perda de paciência e sistema de som tocando rádio Velha Brasil FM, com redução de mais 5% de perda de paciencia, custo, pode deixar na aba equipe mesmo por enquanto, pra adicionar o custo de energia elétrica de manter eles ativados

**Destino:**
- **Feito na v7.4.4:** na Garagem (nível 1), a aba Equipe tem o card "TV e som": TV de tubo na Rede Esfera (5%, luz R$ 15/dia) e som na rádio Velha Brasil FM (mais 5%, luz R$ 10/dia), ligados e desligados à parte, com a luz na folha do dia. Os dois aparecem numa estante no canto do salão. Valores de luz escolhidos na sessão (com eles, o bot com a equipe completa lucra ~R$ 30 a mais por dia).
- **Couvert artístico:** só do nível 3 do salão (Restaurante na Avenida Brasil) em diante, que chega na etapa 3 do `docs/PLANO.md`; até lá some da lojinha e sai dos saves.
- **"Por enquanto" na aba Equipe:** quando houver um lugar para o ambiente (o nível de luxo, nas Ideias guardadas do plano), TV, som e couvert podem mudar de aba.

---

## 21/10/2026 — Usuário: cor das cadeiras
**Origem:** mensagem do usuário, depois da v7.4.2:

> "faltou poder trocar as cores das cadeiras"

**Destino:**
- **Feito na v7.4.3:** no editor do salão (lojinha, aba Salão), o balãozinho da mesa escolhida ganhou a linha "Cadeiras:" com as 4 cores (vermelha, azul, amarela, verde). Tocar numa troca a cor das cadeiras da mesa, de graça; a mesa continua escolhida e o Desfazer volta a cor.

---

## 21/10/2026 — Usuário: título da lojinha
**Origem:** mensagem do usuário:

> "Lojinha do seu zé" não, "Garagem da da mãe da Bia"

**Destino:**
- **Feito (depois da v7.4.2, sem número de versão):** o título do painel da lojinha passou de "Lojinha do Seu Zé" para "Garagem da mãe da Bia". Em seguida, com o "sim" do usuário, o ponto também passou a se chamar "Garagem da mãe da Bia" (era "Garagem da Bia e do tio Tonhão"); o letreiro "LANCHES da Bia e do Tonhão", que é o nome do negócio, ficou.
- Responde em parte à decisão em aberto da etapa 5 ("quem é o Seu Zé"): ele deixa de ser o dono da lojinha.

---

## 21/10/2026 — Usuário: ícone de "aguardando o preparo"
**Origem:** mensagem do usuário:

> "os ícones sobre os grupos de pessoas sentados de: "vendo cardápio" e "aguardando preparo da comida" são muito parecidos, sugiro trocar o segundo por um ícone de panelas quentes e tirar o timer de circunferencia se completando do icone de aguardando preparo"

**Destino:**
- **Feito na v7.4.2:** no estado "pedido feito", o balão da mesa mostra uma panela no fogo com vapor (ícone `pot`), do pedido anotado até o prato sair, no lugar da comanda e do prato com anel de progresso. Sem anel. Quando o prato fica pronto no balcão, aparece um visto verde no canto do balão (era o anel verde cheio). O vapor fica parado com `prefers-reduced-motion`.

---

## 21/10/2026 — Usuário: mesas que valham a pena, pratos, fila e avaliações
**Origem:** mensagens do usuário numa sessão de equilíbrio, depois da v7.4:

> "aumente a quantidade de pratos para 4 logo de início e rode o teste para ver ser dá mais lucro."

> "o objetivo é que valha a pena comprar mais mesas e mais cadeiras no fim das contas"

> "faça esse ajuste de chegada de pessoas, vá testando se 6% é suficiente ou demais, corrija esse bug que vc achou também, mantenha os 4 pratos"

> "talvez reduzir um pouco a complacência das pessoas esperando na fila quando a casa estiver cheia, lembro que era um valor elevado"

> "guarde para depois essa ideia: uma das metas para conseguir avançar de fase é a meta de avaliações das pessoas, tipo avaliações do google que vão subindo ou descendo de acordo com as últimas 200 avaliações das pessoas que passaram. avaliações compostas por pontuação: tempo de espera para mesa, qualidade do menu, qualidade do prato, agilidade de atendimento, ambiente e amenidades, cada vez que o grupo perde um coração na espera, é um ponto a menos no critério, cada vez que perde um coração esperando a Bia, perde ponto no aspecto agilidade, qualidade do prato teria que gerar uma faixa de qualidade e acerto para o tonhão/ outros cozinheiros, maior qualificação maior a faixa de acerto e maior a taxa de crítico (100% perfeito - pontuação máxima), qualidade do menu são pela quantidade de pratos disponíveis (que os chefs tenham sido treinados para), ambiente e amenidades é estética do espaço, presença de couvert/entretenimentos, cafezinho etc."

**Destino:**
- **v7.4.1, feito:** 4 pratos limpos do dia 3 em diante; cada lugar acima de 10 traz 6% mais grupos (testados 3% a 10%: com 6%, mesas de 4 com equipe se pagam em 1 a 3 dias; mesas de 2 demais e salão grande sem equipe continuam dando prejuízo); fila justa a 60% (era 40%); o salão de 16 lugares do `balance.js`, que voltava ao kit sem avisar, corrigido. Números em `docs/spec-v7.4.1.md`.
- **Avaliações dos clientes:** guardada em `docs/PLANO.md`, "Ideias guardadas" (sem etapa ainda; combina com o nível de luxo, com os pontos das etapas 3 e 4 e com o crítico do guia da etapa 6).

---

## 21/10/2026 — Usuário: mesas de bar na Garagem
**Origem:** mensagem do usuário durante a sessão da 1d-1, com a foto de um conjunto branco de mesa quadrada e 4 cadeiras de plástico de bar:

> "as mesas devem ser quadradas, tipo de bar mesmo, ó"

**Destino:** v7.4, feito. Mesa quadrada de plástico (cantos chanfrados, furo do guarda-sol, pernas que afinam); a mesa de 4 são 2 mesas quadradas juntas; cadeira com encosto de frisos verticais. As cadeiras continuam coloridas por causa do bônus de cor.

---

## 21/10/2026 — Usuário: decisões da etapa 1d e dos pontos
**Origem:** respostas do usuário às dúvidas da 1d (e às perguntas que vieram depois):

> "1. deixe render a mais na garagem, isso é importante para o pé de meia, pois deve ter um custo inicial para mudar de local de trabalho (levar as coisas, montar e reajustar etc), em novos ambientes teremos possibilidade de contratação de mais pessoas, mais espaço para mais pratos etc.
> 2. pessoas pedem no tablet da mesa de espera e o suco sai pronto da maquina
> 3. arrastar até a borda rola a tela sozinha e, se tocar 2x no grupo, automaticamente muda a tela para o salão para escolher onde colocar eles
> 4. garagem com 4 de espera
> 5. boa.
> 6. temos que pesquisar se esses valores são relativamente compatíveis com preços do aluguel de espaço similar em regiões assim, como o 2 na região de subúrbio tipo são bernardo do campo, 3 na avenida brasil, avenida paulista/augusta etc e 4 similar a terraço itália ou outro espaço muito luxuoso de são paulo/rio de janeiro. Manter quantidade de cadeiras: 16, 20, 24, 28 respectivamente para os níveis.
> planeje os passos a serem tomados e anote para eu poder dar o clear antes de iniciar a programação"

Nas perguntas seguintes, o usuário escolheu:
- a máquina de suco **lá fora, ao lado da espera**, com o suco cobrado na conta;
- a **Água saborizada vira a máquina de suco**;
- o que os pontos novos destravam: "poder contratar outro cozinheiro/confeiteiro, um com especialização em sobremesas para o nível 3 e 4. balcão de coquetelaria a partir do nível 3, com necessidade de contratação de profissional de drinks", 2º garçom (área industrial), mais bocas no fogão, mais pratos no cardápio e balcão de pratos maior;
- **sem limite de mesas**: "Só o total de lugares e a área útil limitam (dá para fazer tudo com mesas de 2, se couber), mas isso não muda que clientes em 3 ou em 4 fiquem insatisfeitos e desistam do atendimento";
- aluguel na **proporção real** (R$ 0 · 120 · 400 · 1.000 por dia) e mudança de R$ 800 · 2.000 · 5.000;
- **carreira por pontos, sem fim fixo**;
- inauguração: "O arranjo do jogador vale inteiro desde o início; o movimento menor dos dias 1 e 2 vem só de menos grupos por pouca visibilidade pública e do fato de não ter dinheiro para mais cadeiras";
- móveis: kit de 10 lugares; mesa de 2 por R$ 150, mesa de 4 por R$ 250, 2 cadeiras por R$ 100; "A Garagem vem com mesas quadradas e cadeiras de plástico estilo 'bar', que futuramente serão pontuação bem baixa para upgrade".

**Para onde foi:** `docs/PLANO.md`, etapa 1d em 2 sessões (**1d-1**, v7.4: Garagem, móveis e editor; **1d-2**, v7.5: tela que rola, espera lá fora e máquina de suco), e etapas 3 e 4 com os valores e o que cada ponto destrava. A pesquisa de aluguel ficou em `docs/pesquisa-aluguel.md`.

---

## 21/10/2026 — Usuário: níveis do salão são os pontos, Garagem da Bia, área de espera lá fora e nível de luxo
**Origem:** mensagem do usuário, respondendo à proposta do editor do salão:

> "O espaço viria de poder arrastar a tela para ver o lado de fora (futuro espaço para implementação estética também, mesinhas, toldo etc, que nos níveis maiores pode virar até um "foyer"/antessala com amenities etc)
> nivel 4 só com 30 lugares, o nível do salão é o mudar-se para regiões mais nobres (mais caras para o aluguel), aliás, o preço do aluguel do salão deve constar nos custos fixos a se ponderar todo dia (menos nivel 1 de salão, que será, futuramente, a garagem da casa da bia).
> * nivel 1: Garagem da Bia e de seu tio Tonhão (a justificativa de ser gratuito no nível 1 é ele ser da família, cozinheiro aposentado que topa voltar à ativa para apoiar a sobrinha em seu sonho)
> * nível 2: Lanchonete na área industrial
> * Nível 3: Restaurante na avenida Brasil
> * Nível 4: Terraço Suíça (piadinha com terraço itália)
> uma das implementações futuras vai ser o nível de luxo, que sobre de 0 a 5, com um somatório dos atributos decorativos + localização da lanchonete + impacto da mídia + avaliação de críticos surpresa + outras coisas a serem ponderadas. a lógica será parecida com o sistema de level up do Kratos no God of War ragnarok, mas isso é bem para frente, depois de tudo que já está na fila"

E, nas perguntas sobre como organizar o plano, o usuário escolheu "1d editor + Garagem; etapas 3 e 4 = pontos" e respondeu sobre a tela:

> "O salão fica mais largo que a tela: arrasta-se o fundo para ver a calçada, o HUD fica fixo, e uma setinha na borda avisa quando uma cadeira de fora precisa de atenção. As mesas de fora não contam nos lugares e enquanto estão fora as pessoas só esperam e tomam suco que solicitam no totem para a bia só ter que levar para entregar."

**Para onde foi (`docs/PLANO.md`):**
- **Etapa 1d** (v7.4): editor do salão, **Garagem da Bia e do tio Tonhão** (nível 1, sem aluguel, 16 lugares), arrastar a tela para ver a calçada (também durante o dia, com o HUD fixo e a setinha na borda) e a **área de espera lá fora** (cadeiras que não contam nos lugares, totem de suco, a Bia só entrega).
- **Etapa 3** (v9): Lanchonete na área industrial (nível 2, 20 lugares) e Restaurante na Avenida Brasil (nível 3, ~26 lugares), com aluguel nas contas fixas do dia. Substitui o "Centro".
- **Etapa 4** (v10): Terraço Suíça (nível 4, 30 lugares) com os VIPs exigentes e a antessala. Substitui a "área nobre".
- **Etapa 5:** a história começa na garagem, e o Tonhão é tio da Bia.
- **Nível de luxo** (0 a 5): em "Ideias guardadas", bem para frente. A referência de progressão (God of War Ragnarök) fica só nos docs, não na interface (regra do `CLAUDE.md`).

---

## 21/10/2026 — Usuário: editor do salão (mesas e cadeiras onde o jogador quiser)
**Origem:** mensagem do usuário, logo depois da proposta dos 4 níveis do salão:

> "meu desejo quanto a espaço é que quando clicar na aba do salão/otimização de mesas e cadeiras, o jogador realmente possa ver o salão e redistribuir as mesas e cadeiras como achar melhor dentro da área útil do salão."

**Para onde foi:** a etapa **1d** do `docs/PLANO.md` foi reescrita em volta de um **editor do salão** na aba Salão. O jogador vê o salão desenhado, arrasta as mesas (com encaixe numa grade fina), toca para trocar entre 2 e 4 lugares e guarda ou tira mesas de uma bandeja. Os níveis do espaço continuam dando o total de lugares, o máximo de mesas e a área útil. Ainda sem código; decisões em aberto no plano (área útil dos níveis 3 e 4, posição livre ou por encaixes).

---

## 21/10/2026 — Usuário: como fazer a etapa 1c (Bia, fila e salão)
**Origem:** pedido do usuário ao começar a etapa 1c:

> "para o Bia mais rápida aumente a velocidade base e adicione segundo nível de tênis: o nível 2 parecendo um tênis de corrida - implemente e teste
> para a marca do que já está na fila, adicione um numerinho da ordem em que a Bia vai passar, cancelar somente se tocar na tarefa ali nos quadrinhos de baixo, isso porque se eu quiser fazer 2 coisas na mesma mesa, ficaria cancelando a tarefa anterior ao adicionar a nova.
> para as mesas, proponha 4 níveis de evolução do espaço, que incrementa em quantidade de mesas/cadeiras possíveis no ambiente, mas não implemente ainda, só para nossa discussão e decisão futura"

**Para onde foi:**
- Bia mais rápida e Tênis de corrida: **feito na v7.3** (base 260 → 300; Tênis novos +10%; Tênis de corrida +20% por R$ 350). Metas mantidas por escolha do usuário. Ver `docs/spec-v7.3.md`.
- Número da vez: **feito na v7.3** (etiquetas "1º, 2º...", todas as vezes do mesmo lugar juntas, pulinho ao surgir; mesa pode repetir na fila; cancelar só pelo quadrinho).
- 4 níveis do salão: **proposta na etapa 1d do `docs/PLANO.md`** (16, 20, 26 e 32 lugares; o jogador só escolhe quantas mesas de 4), à espera da decisão do usuário.

---

## 18/10/2026 — Renan (beta-tester): Bia mais rápida, marca do que já está na fila, salão mais simples
**Origem:** retorno do beta-tester Renan Martorelli sobre a v7.2, repassado pelo usuário:

> "Adicione na lista de propostas a serem implementadas mais velocidade para a Bia e/ou deixar alguma forma de check para os locais que já estão na fila para a Bia fazer; o manejo das mesas ficou complexo demais.. talvez fique atrelado somente a número total de cadeiras possiveis para cada tamanho de salão, podendo ser distribuídas em mesas de 4 ou de 2 pessoas. Não mexa em nada do código ainda"

**As propostas:**

| Ideia | Como está hoje (v7.2) |
|---|---|
| Bia mais rápida | Anda a 260 px/s; os Tênis novos (R$ 150) dão +10%. |
| Marca ("check") nos lugares que já estão na fila da Bia | A fila de ações só aparece no HUD, nos 6 quadrinhos de baixo; a mesa, a estação ou o prato que já foi pedido não mostra nada no salão. Mesas e estações podem entrar duas vezes sem o jogador perceber (só o prato pronto já não repete). |
| Salão mais simples: só um total de cadeiras por tamanho de salão, distribuídas em mesas de 4 ou de 2 | Aba Salão da v6: compra de 2 cadeiras (R$ 60, até 24) e de mesa (R$ 300, até 8), botões 2 e 4 em cada mesa e a regra de só 1 mesa de 4 por fileira de 4 mesas. |

**Para onde foi:** etapa **1c** do `docs/PLANO.md` (v7.3), com **prioridade maior** que as outras, por ser retorno do beta-tester (pedido do usuário em 21/10). Velocidade e marca **feitas na v7.3** (21/10); o salão virou a etapa **1d**, em discussão (ver a entrada de 21/10 acima). Pontos que estavam em aberto:
- velocidade: aumento fixo na base, um 2º nível dos Tênis ou os dois; conferir no `balance.js` (sem equipe e `BOT=afiado`) que as metas não ficam fáceis demais;
- marca: um "✓" (ou o número da vez na fila) sobre cada mesa, estação ou prato pedido, que some quando a Bia faz a ação; ver se um 2º toque no mesmo lugar deve tirar o pedido da fila;
- salão: o "tamanho de salão" casa com a etapa 3 (mudar para o Centro, onde o salão vai junto com ajuste se não couber); o total de lugares de cada ponto seria o limite, e o jogador só escolhe quantas mesas de 4 e de 2 cabem nele. Rever as contas do dia (R$ 30 por mesa e R$ 6 por lugar) e o `smoke8`.

---

## 15/10/2026 — Plano de novidades em etapas
**Origem:** pedido do usuário: "Vamos elaborar plano de novidades para implementação, com steps graduais, para fazer de sessão em sessão uma implementação". Depois: "Gostei dos passos, guardemos com carinho no log de propostas".

**Proposta aprovada:** o roteiro em `docs/PLANO.md`, uma etapa por sessão:

| # | Etapa | Versão |
|---|---|---|
| 0 | Contas: lucro, ingredientes, contas do dia, divulgação | v7 (feita) |
| 1a | Jogo justo: dá para não perder ninguém (retorno do Renan, abaixo) | v7.1 (feita) |
| 1b | Livro-caixa e ajuste fino com jogadores | v7.2 |
| 2 | Manutenção e imprevistos | v8 |
| 3 | Ponto: mudar para o Centro | v9 |
| 4 | Área nobre e VIPs exigentes | v10 |
| 5 | Modo História, parte 1: estrutura e primeiros capítulos | v11 |
| 6 | Modo História, parte 2: subir de ponto, crítico do guia e final | v12 |
| 7 | Polimento: celular, ranking da história, ajuste geral | v12.1 |

A etapa 1a entrou depois do plano aprovado, por causa do áudio do Renan.

---

## 15/10/2026 — Renan Martorelli (áudio): "o jogo parece injusto"
**Quem:** Renan Martorelli, que trabalha com design de games. Áudio de 15/10, 08:43, transcrito pelo usuário:

> "Outra coisa que eu pensei para esse tipo de jogo, pelo menos a sensação que eu tive, acho que a partir do nível três, quatro, já já tive um pouco essa sensação.
> Que não é possível você conseguir atender todo mundo. Tipo, você obrigatoriamente vai perder alguém. E aí dá uma sensação de que o jogo é injusto, porque o jogo tá te forçando, tipo assim, nem que você fosse extremamente bom, você conseguiria atender todo mundo, sabe? É tipo, humanamente impossível. Nem que você regule as cadeiras, tal, tudo certinho.
> Então acho que dentro dessa questão de balanceamento também seria legal pensar um cenário, um balanceamento ali de corações, de quantidade de pessoas que aparecem, onde você conseguisse atender... Tipo assim, sabe? Você acabou de botar um monte de gente na mesa, o pessoal tá tudo pensando no pedido ainda e tem, sei lá, seis pessoas esperando na fila e você tem cafezinho e tem tudo o que precisa para esse pessoal não se estressar o menos possível, mas não tem tempo hábil como você botar as seis pessoas porque as outras dez estão estão estão estão comendo ali, né, ainda.
> Então você meio que, querendo ou não, você vai perder alguém ali, sabe? Ainda que você fosse supereficiente. Então acho que tem que achar um lugar onde, de balanceamento, onde se você for tipo extremamente eficiente, você em tese não perde absolutamente ninguém. Pode ser que você não atenda no mesmo nível de corações, mas você não perde ninguém.
> Acho que dá uma sensação de o jogo ser mais justo, de você não é obrigado a perder nenhum cliente. Te dá uma sensação melhor de tipo: 'Cara, se eu perdi um cliente, realmente é porque não era... Tipo assim, falhei em termos de velocidade, falhei em termos de priorização.' Mas se essa curva de tipo: 'Cara, tá faltando muito ainda, né? Assim, tá... Tô muito para trás no que eu devia tá', eu acho que dá essa sensação de que de que seria humanamente impossível, né?"

**A proposta, em uma frase:** quem joga com perfeição pode terminar o dia com menos corações, mas **sem perder nenhum cliente**. Perder alguém tem que ser culpa da velocidade ou da prioridade do jogador, nunca da conta do jogo.

**O que os números dizem:**
- Na v6, com a equipe completa, o bot perdia de 4 a 6 grupos por dia nos dias 4 a 7, e 5 a 13 nem cabiam na fila.
- A v7 baixou o movimento (13 a 17 grupos nos dias 3 a 7) e as perdas caíram para 0,6 a 2,6 por dia. Ainda não é zero.
- A 3ª estrela exige não perder ninguém, então a sensação de "impossível" pesa justamente no objetivo máximo.
- O caso que ele descreve: fila cheia esperando, enquanto todas as mesas estão ocupadas com gente pensando ou comendo. Nessa hora a fila perde paciência sem que o jogador possa fazer nada além do cafezinho e da água.

**Para onde foi:** etapa **1a, Jogo justo**, do `docs/PLANO.md`, antes do livro-caixa. **Feita na v7.1** (`docs/spec-v7.1.md`):
- fila justa: sem mesa que sirva, a paciência na fila corre a 40% e, na carreira, não passa de 1 coração;
- porta que respeita a lotação: com o salão cheio e 3+ grupos na fila, quem chega espera um pouco;
- ícone "aguardando mesa".

Decisão do usuário ao escolher: a fila justa "vale [no Turno sem fim] mas sem a proteção de nunca zerar os corações". O bot afiado, com a equipe completa e o Jogo de pratos comprado primeiro, não perde ninguém em 94% dos dias 3 a 7.

---

## 15/10/2026 — Renan e Arthur (WhatsApp): escassez de recursos
**Quem:** Renan Martorelli e Arthur (o usuário). Conversa de 15/10:

> [15/10, 08:14] Renan Martorelli: Pro balanceamento, estou no dia 5 e eu tenho dinheiro de sobra pra fazer tudo, tem que ter uma sensação de escassez de recursos
> [15/10, 10:23] Arthur: Senti isso TBM, mas estou com dificuldade de fazer essa limitação, talvez eu suba o preço das coisas e diminua o preço dos produtos, fica um pouco fora da realidade, ou adicione custos survival tipo iluminação e manutenções do espaço, ou até a opção de alugar espaços maiores com mais mesas e mais funcionários
> [15/10, 10:25] Arthur: Acho que tem que rolar um esquema de visibilidade externa etc
> [15/10, 10:25] Arthur: Gastar com divulgação, espaço etc
> [15/10, 10:26] Arthur: Alugar em área nobre preço alto de aluguel, preço maior de produtos, mais pessoas vips exigentes que entram e pedem pratos especiais
> [15/10, 10:26] Arthur: Divulgar nas redes aumenta chegada de gente, não divulgar diminui a entrada de pessoas, risco de não ter clientes no dia
> [15/10, 10:27] Arthur: Talvez adicionar esse management ajude a dar vazão para o dinheiro
> [15/10, 10:28] Arthur: Aí vai faltar o modo história, talvez o sonho da Bia de ter um restaurante estrela Michelin mas começa do zero, num universo paralelo em que meritocracia é possível

**Para onde foi cada ideia:**

| Ideia | Destino |
|---|---|
| Escassez de recursos | v7, feita: meta em lucro; o bot chega ao dia 5 com R$ 1.319 em vez de R$ 3.410 |
| Subir preço das coisas / baixar preço dos produtos | Descartada pelo próprio Arthur ("fora da realidade"). Ficou guardada como "cardápio com preço escolhido" |
| Iluminação (contas do espaço) | v7, feita: contas do dia, com aluguel, luz e gás por mesa e por lugar |
| Manutenção do espaço | Etapa 2 (manutenção e imprevistos) |
| Divulgação; sem divulgar vem menos gente | v7, feita: boca a boca, panfletos e redes sociais |
| Alugar espaço maior, área nobre | Etapas 3 (Centro) e 4 (área nobre) |
| VIPs exigentes com pratos especiais | Etapa 4 |
| Modo história: o sonho da Bia, do zero até a estrela | Etapas 5 e 6, com um guia gastronômico inventado no lugar do "Michelin" (marca real) |
| "Universo paralelo em que meritocracia é possível" | Etapa 5: o tom da abertura fica para o usuário decidir |
