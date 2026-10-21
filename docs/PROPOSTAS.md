# Log de propostas

Registro das ideias e dos retornos de quem jogou, com o texto original, e de onde cada proposta foi parar (versão feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo.

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
