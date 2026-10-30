# Log de propostas

Registro das ideias e dos retornos de quem jogou, com o texto original, e de onde cada proposta foi parar (versão feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo (com `python3 ferramentas/anota.py docs/PROPOSTAS.md < texto.md`, sem ler o arquivo). Aqui ficam só os retornos com destino ainda aberto; os já entregues foram para `docs/PROPOSTAS-FEITAS.md` (só para consulta). Índice: `tests/indice.sh PROPOSTAS`.

---

## 30/10/2026 — beta-tester (via usuário): não achou como aumentar o cardápio
**Texto (resumo do usuário):** "Recebi um feedback de uma beta tester. Ela disse que não fica claro que ela tem que comprar os cursos do Tonhão para aumentar o cardápio. Ela procurou e não achou a opção de melhorar cardápio ou coisa assim." O usuário sugeriu um menu de upgrade só para o cardápio (os cursos do Tonhão e, no futuro, os de barista da Dani) ou uma conversa na história ("Nossa, tio, estão reclamando da falta de cardápio" / "Ah, é verdade, né? Acho que vou fazer alguns cursos"), por volta do dia 2 a 4.
**Entrevista (30/10):** cartão Cardápio (1º do grupo Lanchonete) com os cursos; na seção Tonhão fica só a lista dos cursos de cardápio concluídos; cursos abertos desde o dia 1 (sem trava); conversa no fim do dia 2, com a Rosa ("a Rosa fazia um pastel que era uma beleza"), e uma versão curta para quem já fez curso; depois, a lojinha abre no Cardápio; selo "novo" quando algum curso cabe no caixa; reclamação dos clientes que cita "só PF e coxinha" enquanto não houver curso básico. Os cursos da Dani ficam na Dani por ora. A dica no Gurugol e o aviso no fim do dia ficaram de fora.
**Destino:** etapa 2c-r6 (v9.0.1) em `docs/PLANO.md`, a próxima. As bebidas da Dani no Cardápio foram para as Ideias guardadas.

---

## 30/10/2026 — Usuário: ajustes da lojinha (TV e som, toalha, equipe, manutenção)
> "No menu de upgrades, transfira TV e som para a aba melhorias. Quando eu vou em equipe, os sprites da Bia e da Dani estão cortados. Então, no encaixe ali da equipe e o card da Bia e o card da Dani. A manutenção o card da manutenção ele pode mudar de cor se ficar no amarelo ou no vermelho. O próprio card já demonstra se já tem alguma coisa crítica ou não. E a toalha xadrez... que está ali na melhoria melhorias, não. Da decoração, a toalha xadrez tem que ir para o salão para poder comprar no salão."
> "Aproveita e inclua nesse planejamento para o sprite do Tonhão tá esquisito. Coloca um chapéu de cozinheiro ou o rosto dele mesmo com um chapéu. Ou, similar ao como tá da Bia e da Dani."

**Destino:** etapa **2c-r5** (v8.9.1) no `docs/PLANO.md`, antes da 3a, para o Sonnet executar. O couvert fica na Divulgação; o Tonhão vira de corpo inteiro com a touca (o desenho da abertura).

---

## 30/10/2026 — usuário: barras do Gurugol na Garagem
"esse é o relatório do gurugol do nível 1 que fiz com perfeição a espera e a agilidade, achei injusto não ter nota máxima neles, por que isso acontece?" Causa: o teto da Garagem (3 ★) vale para cada critério, e a barra ia até 5. Destino: feito (só o visual) — a barra do card do Gurugol (fim do dia e lojinha) enche pelo teto do ponto, sem mostrar o bônus do encantado; números, movimento e metas sem mudança.

---

## 30/10/2026 — Usuário: level up da Dani (e, bem no futuro, do Joca)
> "Beleza, agora vamos pensar num sistema de level up para Dani também. E futuramente a gente pensa num level up pro Joca. Mas bem futuramente, lá só depois que ele entrar, né?"

Respostas na sessão de planejamento. De onde vem a XP: **"Os dois [trabalho e cursos] e, futuramente eu estou pensando para Dani ganhando experiência né ela se tornar a barista ou confeiteira nos níveis mais altos e o Joca assumir tarefas mais basais assim, junto com mais 1 funcionário a planejar"**. Níveis: **"4 níveis e futuramente o upgrade no que ela mais se identifica, café de vários tipos e qualidade, sobremesas de café etc de café"**.

**Destino:** etapa **2h** (v8.9), depois da 2g e antes da 3a, em `docs/PLANO.md` (XP do trabalho a cada 30 tarefas, 3 cursos de +2; mesmas regras do Tonhão para o aumento, o "Reduzir" e os saves antigos). A Dani barista/confeiteira, o Joca com as tarefas básicas e o level up dele, e o funcionário novo foram para as Ideias guardadas.

---

---

## 30/10/2026 — Usuário: clientes novos da área industrial
**Origem:** depois de planejar a 3a, o usuário pediu: "Me ajude a pensar em novos tipos de clientes para frequentarem nessa etapa." A sessão propôs 5 ideias (turma da fábrica com o apito do meio-dia, motorista de caminhão, encomenda do setor, conta rachada, fiscal da vigilância sanitária). Resposta:

> "Planeje a implementação da 1, 2 e 3. E reserve a 4 e a 5 nas ideias para a próxima etapa."

**Destino:** a **turma da fábrica** (com o apito), o **motorista de caminhão** (com o cafezinho no fim) e a **encomenda do setor** (lote de 4 a 6 marmitas, avisada na introdução do dia, prateleira de 4) entraram na sessão **3a** do `docs/PLANO.md`, com valores, visual, testes e alvos decididos pela sessão. O apito substitui o "pico do meio do dia" e o `ponto.tipos` substitui o `mix`. A **conta rachada** e o **fiscal da vigilância sanitária** foram para as Ideias guardadas, citadas no planejamento da 3b.

---

---

## 30/10/2026 — Usuário: o Tonhão sobe de nível com experiência dos cursos
> "Eu quero implementar, antes de avançar para a área industrial, uma modificação no Tonhão. Em vez de eu comprar aumentos de salário para o Tonhão, e isso ser o aumento das habilidades dele, eu quero ter um sistema parecido com um sistema de experiência, né, de XP. Que à medida que ele vai fazendo cursos, ele vai juntando XP e faz um upgrade. E aí, esse upgrade, ele, para consolidar, tem que ter um aumento de salário, entendeu? Então ele precisaria fazer pelo menos 2 cursos para ir para o Tonhão nível 2. E aí, liberar o Tonhão nível 2, que eu pago o salário e ele fica nível 2. E aí tem que fazer mais cursos para chegar no Tonhão nível 3, sabe? E aí talvez a gente tenha que criar mais níveis de Tonhão, pensando até nos cursos avançados, né? Isso por enquanto na etapa da garagem e da industrial, né? Depois Avenida Brasil e Terraço Suíça seria diferente o processo, né? Porque aí não vai vender coxinha nos restaurantes de luxo, né? Mas isso é pro futuro. Guarda aí pro futuro."

Respostas na sessão de planejamento: **5 níveis** (básico +1 XP, avançado +2; níveis 2 a 5 com 2, 5, 9 e 14 de XP; diárias R$ 15, 30, 45 e 60). Sobre o "Reduzir": "cada nível que eu tomei aumenta ele quase que se paga na sua qualidade [...] e ajuda o bot pelo menos a ganhar mais dinheiro, então talvez se isso for verdade esse upgrade dele ser definitivo e não ter retorno, mas precisaria avaliar isso". Saves antigos: **rebaixa ao nível da XP**.

**Destino:** etapa **2g** (v8.8), antes da 3a, em `docs/PLANO.md` (o "Reduzir" sai se o `balance.js` mostrar que cada nível rende a diária dele). Os cozinheiros da Avenida Brasil e do Terraço foram para as Ideias guardadas.

---

## 30/10/2026 — Usuário: entrevista para planejar a 3a (área industrial)
**Origem:** perguntas no chat, com a 2f em execução noutra sessão, para deixar a 3a pronta para o Sonnet. Respostas do usuário:

> Mudança: "Para sempre (Recomendado)". Joca: "Na real deixa sem o Joca por enquanto o Joca entra na na próximo nível que é o nível da da paulista/avenida Brasil etc". Como o Joca entra: "Contratado, com salário (Recomendado)". Capítulos: "2 capítulos (Recomendado)".

> Fogão industrial: "R$ 400, gasta ½ (Recomendado)". Balcão de 5 vagas: "Vem com o ponto (Recomendado)". TVs: "Luz R$ 9 e R$ 20 (Recomendado)". Espera: "Assento segura a paciência (Recomendado)".

> Cardápio: "×1,2 (Recomendado)". Clientela: "Pressa e entrega (Recomendado)". Gurugol: "Mantém e sobe aos poucos (Recomendado)". Liberar a mudança: "Depois do cap. 3 (Recomendado)".

> Objetivos dos caps. 4 e 5: "Proposta (Recomendado)". Trama: "Já cita o Bráulio". Plantas da calçada: "Compra na lojinha", e depois "Um pouco na nota". O que vai na mudança: "Como o plano (Recomendado)". Falas dos caps. 4 e 5: "Aprovo (Recomendado)".

**Destino:** sessão **3a** do `docs/PLANO.md` (v9), com as decisões, os valores, as falas e os alvos. O **Joca** passou para a **3b** (Avenida Brasil), contratado com salário. Decidido por mim, sem pergunta: os valores de Ambiente das TVs (0,5 e 0,75), a mistura exata da clientela (entregador ×2, família ×0,5, vovós ×0,7, VIP ×0,3, paciência ×0,85 para grupos de 1 e 2, pico de ×1,2 no meio do dia), as metas ×1,25, o visual do ponto, o crédito de R$ 2.000 no banco e as regras de calibração do `carreira.js`.

---

---

## 30/10/2026 — Usuário: entrevista para planejar a 2f (a campanha vira o Modo História)
**Origem:** perguntas no chat, para deixar a sessão pronta para o Sonnet. Respostas do usuário (as escolhidas entre as opções e o texto dele):

> Menu: "Só a História (Recomendado)". Objetivo não cumprido: "Continua até cumprir (Recomendado)". Dívida: "R$ 1.000, 10 parcelas (Recomendado)". Trama: "Só uma pista (Recomendado)".

> Objetivos: "Mais difícil" (o cap. 3 pede quitar a reforma, nota 2,7 e R$ 800). Fim do cap. 3: "Segue jogando (Recomendado)". Conversas: "Balões sobre o salão (Recomendado)". Save antigo: "Recomeça". 1ª vez: "Missão zero, depois cap. 1 (Recomendado)". Falas do cap. 1: "Aprovo".

> Cap. 2 (sobre contratar a Dani e pagar 3 parcelas): "Não necessariamente estará com 3 parcelas pagas ao se contratar a Dani né? E se a pessoa escolher contratar a Dani só depois de quitar a dívida?"

> Cap. 3: "Então, e se a Dani não estiver no dia? Talvez a Dani já deva entrar no 3o dia de graça nerfada, mas grátis, tipo o Tonhão que começa funcional, mas fica cada vez melhor conforme upa ele."

> Dani aprendiz de graça, com aumentos de R$ 25, 40 e 55: "Aprovo (Recomendado)". Objetivo do cap. 2: "Nota do Gurugol 2,4". Falas novas dos caps. 2 e 3: "Aprovo".

**Destino:** etapa **2f** do `docs/PLANO.md` (v8.7), com as decisões tomadas, as falas dos 3 capítulos e os alvos do `carreira.js`. A Dani de graça como aprendiz (ideia do usuário) entra nela. Decidido por mim, sem pergunta: as falas de depois do cap. 2 trocadas para combinar com o objetivo da nota; o botão História vira "Ver abertura"; partes novas `19-conversa.js` e `26-conversa.js`; a reforma começa a cobrar no dia 2, com juros de 1% ao dia.

---

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

## 23/10/2026 — Usuário: jogo offline por enquanto
**Origem:** mensagem do usuário, depois da v8.3.2 (sobre a pendência de declarar a coleção `ranking-campanha` ao publicar):

> Não precisa de modo online com ranking compartilhado, é pra ser um jogo offline a princípio, onlinização eu prevejo só para os ajustes finais do jogo

**Para onde foi:** **feito na v8.3.3** (`docs/spec-v8.3.3.md`): `Rank.online = false`, o ranking fica só no aparelho e o jogo não usa o `db` nem o `user` do artifact. Religar o compartilhado ficou na etapa 7 (polimento) do `docs/PLANO.md`.

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
