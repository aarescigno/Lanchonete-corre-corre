# Log de propostas

Registro das ideias e dos retornos de quem jogou, com o texto original, e de onde cada proposta foi parar (versão feita, etapa do `docs/PLANO.md` ou ideia guardada). Entradas novas vão no topo.

---

## 18/10/2026 — Arthur: Bia mais rápida, marca do que já está na fila, salão mais simples
**Origem:** pedido do usuário, ao jogar a v7.2:

> "Adicione na lista de propostas a serem implementadas mais velocidade para a Bia e/ou deixar alguma forma de check para os locais que já estão na fila para a Bia fazer; o manejo das mesas ficou complexo demais.. talvez fique atrelado somente a número total de cadeiras possiveis para cada tamanho de salão, podendo ser distribuídas em mesas de 4 ou de 2 pessoas. Não mexa em nada do código ainda"

**As propostas:**

| Ideia | Como está hoje (v7.2) |
|---|---|
| Bia mais rápida | Anda a 260 px/s; os Tênis novos (R$ 150) dão +10%. |
| Marca ("check") nos lugares que já estão na fila da Bia | A fila de ações só aparece no HUD, nos 6 quadrinhos de baixo; a mesa, a estação ou o prato que já foi pedido não mostra nada no salão. Mesas e estações podem entrar duas vezes sem o jogador perceber (só o prato pronto já não repete). |
| Salão mais simples: só um total de cadeiras por tamanho de salão, distribuídas em mesas de 4 ou de 2 | Aba Salão da v6: compra de 2 cadeiras (R$ 60, até 24) e de mesa (R$ 300, até 8), botões 2 e 4 em cada mesa e a regra de só 1 mesa de 4 por fileira de 4 mesas. |

**Para onde foi:** guardada para implementar; ainda sem etapa no `docs/PLANO.md` e sem mudança no código (pedido do usuário). Pontos a decidir antes:
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
