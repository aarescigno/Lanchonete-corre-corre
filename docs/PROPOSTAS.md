# Log de propostas

Registro das ideias e dos retornos de quem jogou, com o texto original, e de onde cada proposta foi parar (versão feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo (com `python3 ferramentas/anota.py docs/PROPOSTAS.md < texto.md`, sem ler o arquivo). Aqui ficam só os retornos com destino ainda aberto; os já entregues foram para `docs/PROPOSTAS-FEITAS.md` (só para consulta). Índice: `tests/indice.sh PROPOSTAS`.

---

## 01/11 (noite) — usuário: menos texto explicativo e um Manual que se revela com a história
> Eu percebo que tem tanto no menu de melhorias quanto em novos dias aparecem descrições bem extensas, sabe? E essas descrições são muito enfadonhas de se ler, explicando, por exemplo, a explicação sobre o cliente VIP. Ah, que ele não gosta de prato frio, em compensação ele perde prato especial, perde paciência rápida, sabe? É chato ler essas coisas. Então seria bacana se tivesse tipo como tem os jogos, os bestiário, em que fala as características de cada um e tal, né? Então tem algo que é tipo tipos de clientes, e aí aparece lá o vovô, vovó, VIP, família, estudante, etc, etc. Números, características de cada um, sem colocar números matemáticos, sem colocar tipo números, só coloca paciência curta, paciência longa, demora para escolher, rápido na escolha, sabe? Que o jogo não é para fazer cálculos, o jogo é só para sentir e entender mais ou menos o perfil dos personagens. E a mesma coisa outras definições, né? Outras escritas, tipo... descrições que falam exatamente o que vai acontecer a partir de uma outra... de uma melhoria, por exemplo. Isso é extenso, não precisa. As pessoas conseguem inferir pelo título, sabe? Em suma, o que eu quero dizer é tirar quase todo o texto explicativo que tem por aí. É para o tutorial apresentar e para alguma fala no modo história explicar brevemente. E se a pessoa não entender, ela abre lá o manual. Tem um cantinho de manual que vai ter tipos de clientes, tipos de upgrades que cada um faz, tal, né? E aí, esse manual, ele vai se revelando à medida que vai avançando na história, para não ter spoiler nele. Gostaria disso implementado antes do 4A.

**Decisões (com o usuário, 01/11):** etapa **3f** do `docs/PLANO.md`, em 2 sessões (3f-1, v9.6.7: o Manual; 3f-2, v9.6.8: o corte dos textos), **depois da 3d-3 e antes da 3e**. Cartões da lojinha só com nome, preço e um "?" que abre a ficha no Manual; as tabelas da equipe viram bolinhas. O que ainda não apareceu na história fica como ficha "???" trancada. O Manual entra no lugar do "Como jogar" (menu, pausa e lojinha).
**Destino:** etapa 3f do `docs/PLANO.md`.

---

## 01/11 — Renan (beta-tester, WhatsApp, repassado pelo usuário): 16 retornos de jogo
> [01/11, 15:56] Louça suja deixar a pia mais suja
> [01/11, 15:56] Lixo soltar mais vapores feios
> [01/11, 15:58] Dar pra lavar menos do que todos os pratos de uma vez e ir liberando prato a prato para o Tonhão usar
> [01/11, 16:01] Marmita de entregador que desistiu fica preso na mão, deixar jogar no lixo
> [01/11, 16:04] Recado de número de pratos ficou pequeno e, talvez, desnecessário
> [01/11, 16:06] Famílias chegando várias em fila longa sem ter liberado ainda o salão para comprar mais mesas
> [01/11, 16:07] Quando acaba o timer não deixar mais entrar ninguém, quem está ainda fica até terminar o atendimento
> [01/11, 16:07] Disparador para liberar upgrades de salão com a perda de uma família
> [01/11, 16:08] História do efood muito depois que o efood já iniciou, quando iniciar o efood já aparecer essa história, se não, esperar para iniciar o efood
> [01/11, 16:10] máximo que o jogo envia de grupos de 3 ou 4 pessoas para esperar na fila de 2x o número de mesas de 4
> [01/11, 16:12] Gente vip demais na garagem, é pra ter nenhum, eles devem ser raros, chatos e com frequência crescente ao longo dos níveis
> [01/11, 16:15] Se o entregador desistir, a marmita desaparecer da bancada do Tonhão também
> [01/11, 16:23] Bancada dos doces ficou pequena e difícil de entender que é nova função
> [01/11, 16:26] Os pedidos de marmita do horário de almoço causaram overflood de gente esperando marmita e de marmitas sobrando na bancada, sem deixar sair pratos para quem come nas mesas
> [01/11, 16:28] É como se a UI não se expande de acordo com o gameplay
>
> Depois: "Vc não consegue escolher o prato que está pegando direito quando tem vários prontos, a lógica de coleta quando vc clica de qualquer jeito é sempre pegar o último prato que saiu, quando deveria ser o contrário, pegar sempre o que está esperando a mais tempo. Pq em tese é esse que está mais urgente"

Usuário: "achei todos relevantes, bora agrupar, organizar e planejar correções. Tudo antes da 4a." Entrevista com o usuário em 01/11 (respostas abaixo; o plano está na etapa 3d do `docs/PLANO.md`).

| Retorno | Decidido | Destino |
|---|---|---|
| Fim do timer | A porta fecha; quem está nas mesas (e no balcão de retirada) termina e paga; quem espera lá fora vai embora calmo, sem multa e sem nota | 3d-1 |
| Famílias em fila longa / no máximo 2× as mesas de 4 | Grupo de 3 ou 4 além de 2 por mesa de 4 vira um grupo pequeno do dia | 3d-1 |
| Gatilho do Salão | Abre depois da 1ª família perdida na fila, do dia 2 em diante (garantia no fim do dia 4) | 3d-1 |
| Conversa do Efood | Vem na véspera do 1º dia com motoboy, antes das outras conversas; sem ela, não vem entregador | 3d-1 |
| VIP | Nenhum na Garagem; ~3% por grupo na área industrial, ~30% na Avenida; paciência 0,65 e prato frio custa 1 coração (nenhum cliente senta em mesa suja, regra que já vale para todos) | 3d-1 |
| Marmitas lotando a janela no almoço; "a UI não se expande" | Fileira própria de marmitas na janela, as mesas têm prioridade no fogão, entregadores a 12 s um do outro | 3d-2 |
| Marmita do entregador que desistiu | Some do fogão, da janela e da prateleira; na mão da Bia, vai para o lixo com um toque na lixeira | 3d-2 |
| Pegar o prato | Qualquer toque na janela pega o prato pronto há mais tempo | 3d-2 |
| Pia e lixo mais sujos | Água turva, pratos e manchas na pia, mais fumaça no lixo, moscas | 3d-3 |
| Lavar prato a prato | Cada pilha lavada volta na hora; a Bia para no fim da pilha se houver outra ação na fila | 3d-3 |
| "Recado de número de pratos" | Sai o balão "Não se esqueça de lavar os pratos!" da abertura; o ×4 da janela fica | 3d-3 |
| Bancada dos doces | Maior, placa DOCES, selo NOVO! até 5 doces e balão do pedido na mesa maior | 3d-3 |
| "A UI não se expande" (geral) | Revisão da interface com o Opus antes de planejar a 4a | 3e |

---

## 01/11 — usuário: Dani sem curso de barista
> "Tem que tirar esse curso de barista iniciante da Dani, ela vai para o caminho do doce só. E creio que na garagem tínhamos combinado da Dani se especializar somente em atendimentos etc, não em preparos"

Destino: feito em 01/11 (sem versão nova). Saiu o curso "Barista iniciante" (R$ 180) de `DANI_CURSOS`; na Garagem ficam só "Atendimento ao cliente" e "Organização da cozinha" (tarefas da casa: louça, pratos, lixo). Saves com o curso perdem esses 2 de experiência.

---

## 31/10 (noite) — usuário: a equipe passa o bastão (Dani → Joca → Cami) e o Anselmo na Avenida
> "É pra Dani começar com doces no meio da área industrial, demonstrando desejo e fazendo cursos, Dani recomenda o Joca, conhecido dela dos tempos de colégio, para seu posto quando termina o curso básico de confeitaria. Joca inicia no nível 2 ou 3 da Dani e progride até mesmo nível máximo da Dani em questão de atendimento. Na avenida, ele passa esse bastão para a Cami, que consegue ir além com cursos especializados que a tornam extremamente ágil. Anselmo entra no nível da avenida também"

Respostas às perguntas da sessão: o Joca **vira barista** na Avenida; entra no **nível 2** da Dani; a Cami chega **nas tarefas**, e os cursos a deixam mais rápida e abrem os modos ("Minhas mesas" na Avenida, "Ajuda em tudo" no Terraço).
Destino: `docs/PLANO.md`, seção "A equipe ponto a ponto" e sessões 3b-2 (Dani confeiteira e Joca, v9.2), 3b-3 (vitrine, Joca barista e Cami, v9.3), 3b-4 (fiscal, v9.4), 3b-5 (Anselmo, v9.5) e 3b-6 (Cami em "Minhas mesas", v9.6); a Cami saiu da 4a, que fica com o "Ajuda em tudo". O Joca deixou de ser primo da Dani (é do colégio dela). Decidido sem pergunta: a conversa da Dani no 4º dia na área industrial, a do Joca no fim do dia do curso dela, a da Cami no fim do dia do espresso, os números e o visual da Cami e a regra de quem faz o básico (o ajudante mais novo do dia).

---

## 31/10 — usuário: entrevista da equipe ponto a ponto (Dani, Joca, Anselmo, Cami e o Tonhão)
Entrevista para planejar as 4 mensagens de 31/10 abaixo (respostas escolhidas pelo usuário):
- **Doces da Dani:** começam na **área industrial** (a Garagem fica como está, a Dani só assistente).
- **Joca:** entra na 3b-2, **já liberado na área industrial** (a ordem das sessões não muda).
- **Anselmo:** **sessão nova 3b-4** (v9.4), depois do fiscal; a 4a fica com os upgrades dele.
- **Cami:** entra **no Terraço (4a)**; pode ter **qualquer das 3 funções** (cuidar de uma parte do salão, tarefas escolhidas como a Dani ou ajudar a Bia em tudo): o jogador escolhe o modo no cartão. **No fim da história (etapa 6) vira gerente de salão.**
- **Café da Dani:** ela faz o cafezinho até o Joca aprender o café na Avenida; daí o café **passa ao Joca** e a Dani fica com os doces (o curso Barista iniciante dela continua valendo como experiência).
- **Café do Joca** (o "grid" do áudio): **Avenida, máquina de espresso** (espresso e cappuccino); **Terraço, cafés de método** (coado no filtro, prensa francesa, cold brew), com etapas.
- **Especialização:** **curso pago por ponto**, como os da Dani hoje; o curso já traz o equipamento (geladeirinha, vitrine, máquina).
- **Doces na área industrial:** na **mesa** (depois do almoço) **e na marmita** ("+ doce").
- **Coquetéis do Anselmo:** pedidos **na mesa, ao sentar** (como o suco); no Terraço soma o balcãozinho da espera. **Nomes inventados, sem dizer se têm álcool.**
- **Tonhão no Terraço:** **cursos de alta gastronomia e um ajudante de cozinha** (nome e visual no planejamento da 4a).
- **Números aprovados como ponto de partida** (o `balance.js` calibra): doces R$ 7 (industrial) / R$ 16 (Avenida) / R$ 30 (Terraço); cafés R$ 8 e R$ 12 (Avenida) / R$ 20 (Terraço); drinks R$ 22 (Avenida) / R$ 35 (Terraço); Anselmo R$ 90/dia; Cami R$ 120/dia (90% da velocidade da Bia); ajudante de cozinha R$ 80/dia (Tonhão 25% mais rápido); cursos de R$ 180 a R$ 800.
- **Ordem aprovada:** 3b-1 Avenida (v9.1) → 3b-2 Joca + Dani confeiteira + café e confeitaria da Avenida (v9.2) → 3b-3 fiscal (v9.3) → 3b-4 Anselmo (v9.4); a 4a junta Cami, ajudante de cozinha, os cursos de topo e o Anselmo lá fora.
Destino: sessões 3b-2 (reescrita) e 3b-4 (nova) do `docs/PLANO.md`; o que é do Terraço, na 4a ("Equipe do Terraço"); a Cami gerente, na etapa 6. As ideias guardadas "Especialização e progressão da equipe", "Bebidas da Dani no Cardápio" e "Cozinheiros da Avenida Brasil e do Terraço Suíça" saíram das Ideias guardadas (viraram etapa).

---

## 31/10 — usuário: progressão ponto a ponto de Dani, Joca e Anselmo
Texto original: "E aí fica nesse esquema, né? A Dani já entrou desde a garagem e ela vai crescendo, né? Assistente, aí ela cresce como confeiteira júnior, com alguns docinhos, né? Bolo de pote, essas coisas assim. E aí sobe para Avenida Brasil. Ali ela vira, faz uns doces diferentes, tipo shortcake e outros docinhos gourmets assim, né? Esses assim mais caros, entremês, sei lá, né? E aí quando ela chega na Terra Suíça, ela faz os doces mais caros de todos, né? É, eu acho que o entremê fica pro terraço Suíça. E a gente vai ponderando isso. Já o Joca, ele entra na área industrial. Depois pro grid, pro café na Avenida Brasil. E vira o mega barista de cafés top no Terra Suíça. O Anselmo entra na Avenida Brasil como coqueteleiro, já com alguma habilidade e tal. É o coqueteleiro antigo do restaurante do Braulio, que saiu de lá e falou: não, era muito difícil trabalhar lá e acho um novo espaço por ter conversado com o Tonhão, sabe? E aí, quando passa por Terra Suíça, ele ganha vários upgrades para virar os melhores coquetéis que tem."
Destino: entrevista de 31/10 (entrada acima): sessões 3b-2 e 3b-4 e a 4a do `docs/PLANO.md`.

---

## 31/10 — usuário: Anselmo, o coqueteleiro
Texto original: "Anselmo. Esse vai ser o nome da pessoa coqueteleira. Porque o especialista em cafés vai ser o Joca, mas o Anselmo vai fazer os melhores coquetéis do mundo. E ele pode entrar já, talvez, na Avenida Brasil e vai receber upgrades para chegar até o nível top, que é o que vai ser o terraço suíça, né?"
Destino: entrevista de 31/10 (entrada acima): sessões 3b-2 e 3b-4 e a 4a do `docs/PLANO.md`.

---

## 31/10 — usuário: Dani confeiteira, Joca coqueteleiro/barista e a Cami (atendimento) no Terraço
Texto original: "Ah tá, então pode deixar a Dani como confeiteira e o Joca mais pra frente entra como coqueteleiro ou como barista, né? Porque a ideia é que no terraço suíça tenha alguém especializado em fazer cafés gourmet especial, etc, né? Vários processos, e alguém para fazer doces muito especiais e tal. E o chef Tonhão, que vai preparar pratos de alto estirpe após vários cursos, etc. E vai ter que ter alguém para ajudar a Bia na pegada do dia a dia ali. Talvez seja um terceiro assistente. A Cami, essa terceira assistente, vai ser especializada em atendimento de pessoas. Então ela vai ser muito rápida. Vai ser mais rápida que a Bia, talvez. Ou tão rápida quanto a Bia, sabe? Coisa que o Joca e a Dani não conseguem ser. Porque a especialidade deles é outra e eles estão descobrindo."
Destino: entrevista de 31/10 (entrada acima): sessões 3b-2 e 3b-4 e a 4a do `docs/PLANO.md`.

---

## 31/10 — usuário: especialização e progressão da equipe (Dani, Joca e assistente)
Texto original: "adiciona aí para mim nas ideias, que assim como a Dani vai progredir de função, né, com alguma outra coisa que ele especialize e tal, o Joca também vai passar por esse processo, né, e ele encontre uma função aí dentro. Não sei se a Dani vira barista, ele vira da doceria ou vice-versa, e aí tem uma outra pessoa entra como assistente, que na última instância, no último momento lá, também pode receber um upgrade ou ficar essa última pessoa aí como assistente só também."
Destino: entrevista de 31/10 (entrada acima): sessões 3b-2 e 3b-4 e a 4a do `docs/PLANO.md`.

---

## 31/10/2026 — Usuário: planejamento da etapa 3b (Avenida Brasil)
Respostas na sessão de planejamento (perguntas de escolha):
> Joca: "O básico; a Dani se especializa (Recomendado)". Sobremesas: "Dani confeiteira + vitrine (Recomendado)". Coquetelaria: "Fica para a 4a (Recomendado)". Conta rachada e fiscal: "Só o fiscal".

**Destino:** etapa **3b** do `docs/PLANO.md`, em 3 sessões: **3b-1** (v9.1, o Restaurante na Avenida Brasil, o cliente "Almoço de negócios", o curso Cozinha de restaurante com o Filé à parmegiana, sofás, águas saborizadas, flores, couvert, 6 vagas de prato e os caps. 6 e 7), **3b-2** (v9.2, o Joca com as tarefas básicas, salário e experiência pelo trabalho; a vitrine de sobremesas e o curso de Confeitaria da Dani) e **3b-3** (v9.3, o fiscal da vigilância sanitária). A coquetelaria com o profissional de drinks foi para a **4a**; a conta rachada continua nas Ideias guardadas. Decidido por mim, sem pergunta: os números do ponto (a calibrar), o cliente novo, o prato e o curso, os preços dos itens, os níveis e o visual do Joca, as regras do fiscal e as falas dos capítulos.

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
