# O arco das personagens (Etapa 8, v11.1 a v11.8)

Roteiro fechado na entrevista de 14/11 (pedido em `docs/PROPOSTAS.md`). É a fonte dos textos e das regras da Etapa 8: a sessão de cada versão **copia a sua seção para a spec** (`docs/spec-vN.md`) sem decidir nada, como as etapas de antes de 11/11. Leia por faixa: `tests/indice.sh ARCO`.

Notação das falas: `quem [expressão] (nota): texto`. A expressão vira o campo `e` da fala (`{ q, s, nota?, e? }`); sem colchete, é `neutra`. O campo `e` já entra no texto desde a v11.1 e só passa a ser desenhado na v11.5.

## 1. Decisões da entrevista (14/11)
- **Bia:** parte **insegura, com medo de errar** (esforçada desde sempre; o que cresce é a segurança) e chega a dona que comanda a casa. Na Garagem ela **quase desiste uma vez** e o tio a segura. A fala do banco na abertura muda para já mostrar o medo.
- **Tonhão passa o bastão aos poucos:** Garagem, ele guia; área industrial, decidem juntos; Avenida, ela decide e ele apoia; Terraço, ela comanda e ele pergunta. O arco dele é soltar e curar a mágoa da Casa Aurora.
- **Viradas da Bia:** discorda do tio e vence três vezes (abrir em frente ao Bráulio; servir o molho da Rosa; ligar ela mesma para o banco); encara o Bráulio **duas vezes, em cena** (Avenida, nervosa; noite da estrela, de igual para igual); cuida da equipe (defende, ensina, promove).
- **A foto da Rosa** é o fio: uma fala da Bia para a foto no 1º capítulo de cada ponto (pede força, conta a novidade, promete, agradece), mais a do cap. 14, que já existe.
- **Equipe:** arco de 3 batidas para todos (chegada, que já existe; dificuldade; conquista).
- **Tamanho:** reescrita das falas atuais e **18 conversas novas**, no máximo uma nova por fim de dia.
- **Desenho:** retrato de quem fala dentro do balão, com 5 expressões; roupa da Bia por ponto (do avental ao colete); reações da Bia durante o dia.
- **Ordem:** texto primeiro, desenho depois. O Polimento (Etapa 7) passa para depois, na v11.9.

## 2. Quem é cada um
| Quem | Começa | Dificuldade | Conquista |
|---|---|---|---|
| **Bia** | Com medo de errar, pede confirmação ao tio, se culpa | Quase desiste na Garagem (`desanimo`) | Decide, defende a equipe, encara o Bráulio, comanda a noite da estrela |
| **Tonhão** | Resolve tudo pela sobrinha; esconde a mágoa da Casa Aurora | Não quer abrir em frente ao Bráulio; dói mexer no molho | Entrega o caderno do caixa, fecha a cortina, conta o segredo, chama a Bia de "chefe" e passa a pétala à Lia |
| **Dani** | "Meio lenta", pede desculpa | Quebra pratos; devolvem o pudim e ela quer voltar para a louça | Descobre que ensina bem; a mesa aplaude a sobremesa (e, no final, a escola) |
| **Joca** | Calado, "só o da louça" | Um freguês debocha do "menino da louça" na máquina | Pedem "o café do Joca" pelo nome, e ele recomenda |
| **Cami** | Rápida demais: mesa é número | Despacha um casal como no rodízio | Sabe o nome de todo freguês; vira gerente de salão |
| **Anselmo** | Encolhido pelos gritos do Bráulio, pede desculpa por tudo | Quebra um copo e espera o grito | Diz "eu fico" na cara do Bráulio; volta a rir no serviço |
| **Lia** | Seca, técnica, perfeccionista | Refaz o prato três vezes e atrasa a mesa | O Tonhão entrega a ela a pétala do Prato da Rosa |

## 3. A voz da Bia, fase a fase (vale para toda fala nova ou reescrita)
| Ponto | Como fala | O que não faz mais |
|---|---|---|
| Garagem | Pergunta, hesita ("será que...", "e se..."), se culpa; comemora surpresa ("eu nem acreditei") | — |
| Área industrial | Propõe e cita o que já fez ("já fiz isso na garagem"); primeiro "não" ao tio | Pedir licença para ter ideia |
| Avenida | Decide ("eu chamo", "deixa comigo"); acalma o tio | Perguntar "e aí?" ao tio: é ela quem conta |
| Terraço | Comanda em frases curtas; agradece e reconhece a equipe | Fechar a conversa só com "Tá na lojinha" |

Regras de texto: frases curtas, palavras do dia a dia, sem número novo (os que já existem ficam). Toda conversa que hoje aponta uma aba da lojinha **continua apontando a mesma aba com as mesmas palavras** ("no Cardápio da lojinha", "na lojinha, em Equipe", "na Divulgação da lojinha", "nas Melhorias", "na Manutenção", "no Salão", "no Luxo").

## 4. v11.1 — A voz da Bia na Garagem e na área industrial (sessão 8a)
Só texto: troca as falas abaixo em `src/10-constantes.js` e `src/18-abertura.js`. O que não está listado fica como está (ganha só o `e` indicado em 4.3).

### 4.1 Abertura (`ABERTURA`, cena `banco`)
- bia: `Vai dar certo!` → `Tem que dar certo...`

### 4.2 Capítulos 1 a 5 (`HISTORIA`)
**Cap. 1, antes**
- tonhao [alegre]: Panela no fogo, avental no lugar. Abre o portão, Bia!
- bia [insegura] (olhando a foto da mãe): Será que eu dou conta, mãe?
- bia [insegura]: E se não vier ninguém, tio?
- tonhao [firme]: Vem. E a gente fecha o dia no azul, que o banco não espera.

**Cap. 1, depois**
- bia [alegre]: Dois dias no azul, tio! Eu nem acreditei.
- tonhao: Pois acredite. Agora é aguentar a parcela todo dia.

**Cap. 2, antes**
- bia [insegura]: Deixei a pia encher de novo. Não dou conta da mesa e da louça...
- tonhao: Sozinha, ninguém dá. Pedi ajuda pra Dani, filha da vizinha.
- dani [insegura]: Sou meio lenta ainda, mas aprendo rápido!
- bia [alegre]: Então somos duas aprendendo.

**Cap. 2, depois**
- dani [alegre]: Ouvi um freguês dizer que aqui é tudo limpinho!
- bia [alegre]: O Gurugol subiu, tio! Já tá em 2,4.
- tonhao: Devagar e sempre.

**Cap. 3, antes**
- bia: O Gurugol tá cheio de comentário sobre a gente!
- dani: Tem freguês perguntando se a gente vai abrir num lugar maior.
- bia [insegura]: Lugar maior? A gente mal paga a reforma...
- tonhao: Primeiro quita a reforma. Depois junta pra mudança.

**Cap. 3, depois**
- bia [firme]: Reforma quitada e R$ 800 guardados. Fui eu que juntei, tio!
- tonhao (cheirando o pote de cominho): Cominho com açafrão... a Rosa ia rir de mim agora.
- bia: Por quê, tio?
- tonhao: Um dia eu te conto da Casa Aurora.
- bia [firme]: Vou cobrar.

**Cap. 4, antes**
- bia [alegre] (pondo a foto da mãe na parede): Olha só, mãe: vinte lugares!
- tonhao: E aluguel todo dia. O pessoal da fábrica tem hora pra voltar.
- bia [firme]: Então eu sirvo rápido e a gente fecha no azul. Já fiz isso na garagem.

**Cap. 4, depois**
- tonhao: Três dias no azul pagando aluguel. Tá provado, Bia.
- bia [alegre]: Tá provado mesmo. E a moto não para de pedir marmita!

**Cap. 5, antes**
- dani: Os motoqueiros já sabem o meu nome!
- tonhao: Marmita bem fechada e na hora. Quem sai da fábrica volta amanhã.
- bia [firme]: E eu tô de olho na nota. Subindo, a gente vai pra Avenida Brasil.

**Cap. 5, depois** (a 1ª discordância)
- bia [alegre]: R$ 2.000 guardados! Dá pra Avenida Brasil, tio.
- tonhao [insegura] (largando a colher): Lá fica a Casa Aurora, do Bráulio. Vamos pra outro bairro, Bia.
- tonhao: A estrela dele veio do molho da sua mãe. Eu não quero olhar pra aquela porta todo dia.
- bia [firme]: Eu quero. Não, tio: a gente não vai se esconder dele.
- tonhao [alegre] (pegando a colher de volta): ...Falou igual à Rosa.
- dani [alegre]: Então é lá que a gente vai abrir!

### 4.3 Conversas avulsas
**`HIST_CARDAPIO.falas`** (a `fez` não muda)
- bia [insegura]: Tio, um monte de gente perguntou se só tem PF e coxinha... Eu não soube o que dizer.
- tonhao: É... a Rosa fazia um pastel que era uma beleza. Eu nunca aprendi.
- bia: E se o senhor fizesse um curso? Tem uns baratinhos...
- tonhao: Tá bom, tá bom. Vê aí no Cardápio da lojinha o que cabe no bolso.

**`HIST_QUITOU`**: só a 1ª fala muda: bia [alegre]: `Última parcela da reforma paga, tio! Paguei uma por uma.`

**`HIST_TETO`**: só a última fala muda: bia [firme]: `Então eu junto pra mudança.`

**`HIST_SOCORRO`** (a discordância do banco; duas versões: `falas` na Garagem e na área industrial, `firme` na Avenida e no Terraço, escolhida pelo `nivel` do ponto, 3 ou mais = `firme`)
- `falas`:
  - tonhao: O banco ligou, Bia. Deixa que eu falo com o gerente.
  - bia [insegura]: Não, tio. A dívida tá no meu nome. Eu ligo.
  - bia [insegura] (desligando o telefone, com a mão tremendo): Ele segurou a parcela desta vez.
  - tonhao [alegre]: Tremeu, mas ligou. E é só desta vez: na próxima, ele toma a lanchonete. Olha o caixa antes de comprar.
- `firme`:
  - bia [firme] (desligando o telefone): Falei com o gerente, tio. Ele segurou a parcela desta vez.
  - tonhao: E na próxima?
  - bia [firme]: Na próxima ele toma a lanchonete. Não vai ter próxima: eu olho o caixa antes de comprar.

**`HIST_VONTADE_DOCE.falas`**: passou para a v11.2 (§5.2), junto com a do café, porque pede um campo novo na fala (`s2`).

**`LIBERA`, `confeitaria`**
- dani: Bia, as famílias daqui sempre perguntam se tem sobremesa.
- bia: E eu sempre digo que não tem... Você faz doce, Dani?
- dani [alegre]: Brigadeiro, desde pequena! Com um curso de confeitaria, dá pra vender na mesa e na marmita.
- tonhao: Doce bom segura freguês. Vê no Cardápio da lojinha.

**`LIBERA`, `joca`** (quem decide é a Bia; sai a fala do Tonhão)
- dani: Terminei o curso de confeitaria! Mas, se eu ficar nos doces, quem cuida da louça e do lixo?
- bia: Boa pergunta. Conhece alguém de confiança?
- dani: O Joca, do meu colégio. Tá procurando serviço e é trabalhador.
- joca [insegura]: Lixo, louça, mesa suja... pode deixar comigo.
- bia [firme]: Bem-vindo, Joca. Eu acerto tudo na lojinha, em Equipe.

**Só o `e` (texto igual; `melhorias`, `salao` e `HIST_ENTREGA` ficam sem `e` nenhum):** `LIBERA` `bia` (1ª fala [insegura]), `manut` (bia "Vai quebrar?" [insegura]), `luxo` (bia "E se a gente pusesse mais?..." [alegre]); `HIST_DIVULGA` (bia "No boca a boca?..." [insegura]; "E se a gente fizer panfleto?..." [alegre]); `HIST_PLANTA` (bia [alegre]).

## 5. v11.2 — A voz da Bia na Avenida e no Terraço (sessão 8b)
Só texto, como a 8a. O cap. 14 `depois` desta versão ainda não tem o Bráulio em cena (entra na v11.6).

### 5.1 Capítulos 6 a 14
**Cap. 6, antes**
- bia [alegre]: Avenida Brasil, tio! Olha o movimento dessa calçada.
- tonhao [insegura] (olhando pela janela): E ali, do outro lado da rua... a Casa Aurora.
- bia [firme] (virando a foto da mãe pra janela): Daqui ela vê tudo. E ele vai ver a gente crescer.
- dani: E aqui cabe até música ao vivo!

**Cap. 6, depois**
- tonhao: Três dias no azul com aluguel de gente grande.
- bia: O pessoal do Bráulio passou duas vezes espiando pela janela.
- tonhao [brava]: Atrevidos...
- bia [alegre]: Deixa espiar, tio. Tem lugar na fila.

**Cap. 7, antes**
- bia [firme]: Vinte e quatro lugares. Preciso de mais gente no salão, tio.
- tonhao: Tem a Cami, garçonete de rodízio. Rápida que só ela.
- bia [firme]: Então eu chamo. E VIP nenhum sai daqui de cara feia.
- dani: Aqui vem gente importante mesmo!

**Cap. 7, depois**
- bia [alegre]: Três dias de VIP saindo feliz!
- dani: A Cami já sabe o nome de todo freguês.
- tonhao [alegre]: Salão redondo. E agora, chefe?
- bia [firme]: Agora é a nota subir.

**Cap. 8, antes**
- bia: Aqui o Gurugol é mais exigente. Restaurante é outra régua.
- tonhao: E como você quer a casa?
- bia [firme]: Prato bonito, mesa limpa e ninguém esperando.
- dani: E guardar dinheiro. Ouvi falar de um terraço lá no alto...

**Cap. 8, depois**
- bia [alegre]: Nota 3,9 e R$ 5.000 guardados!
- tonhao (tirando o avental): O Bráulio veio jantar aqui ontem. Pediu PF.
- bia [firme]: Eu vi. Fui eu que servi.
- tonhao: E ele?
- bia [alegre]: Não disse nada. Mas raspou o prato.
- dani: Próxima parada: o Terraço Suíça!

**Cap. 9, antes**
- bia [alegre]: Último andar, tio! Dá pra ver a cidade inteira.
- tonhao (olhando o piano no canto): E esse piano de cauda?
- bia: Veio com o ponto. Um dia eu acho quem toque.
- tonhao: Aqui ninguém vem com pressa. Vem pra comer do começo ao fim: bebida, entrada, prato e sobremesa.
- bia [firme] (pendurando a foto da mãe): Obrigada por me trazer até aqui, mãe. Daqui eu levo.

**Cap. 9, depois**
- bia: Três dias no azul pagando esse aluguel!
- tonhao: Menos mesa, mais capricho. É outra cozinha.
- dani [alegre]: Hoje uma mesa bateu palma pra minha sobremesa!

**Cap. 10, antes**
- tonhao [insegura]: Quatro tempos por mesa, Bia. Sozinho no fogão eu não venço.
- bia [firme]: Então o senhor vai ter ajuda. A Lia, ajudante de cozinha, tá procurando serviço.
- tonhao: Ajudante na minha cozinha?...
- bia [alegre]: Foi o senhor que me ensinou a pedir ajuda, tio.
- dani: E o pessoal daqui gosta de um coquetel antes da entrada!

**Cap. 10, depois:** igual ao de hoje (bia [alegre], tonhao, dani).

**Cap. 11, antes**
- tonhao: Refeição completa é como música: não pode faltar nota.
- bia [firme]: Bebida, entrada, prato e sobremesa, sem ninguém esperando. Deixa o salão comigo.
- dani: Se faltar a sobremesa, eu choro.

**Cap. 11, depois**
- bia [alegre]: Nota 4,5, tio! No Terraço Suíça!
- tonhao (guardando o pote de cominho): Sabe quem ligou? O Bráulio. Disse que o Michelzão anda rondando a cidade.
- bia: O guia das estrelas?
- tonhao: Ele mesmo. Dizem que o crítico chega sem avisar.
- bia [firme]: Que venha. A casa tá pronta todo dia.

**Cap. 12, antes** (a discordância do molho)
- bia [firme]: Tio, se o crítico vem, eu quero servir o molho da mãe.
- tonhao [insegura] (segurando o pote de cominho): Aquele molho ficou na Casa Aurora, Bia. Dói mexer nisso.
- bia [firme]: Dói mais deixar ele lá. Tá na hora de me contar.
- tonhao: O molho da estrela era meu e da sua mãe. Cominho com açafrão... e o segredo dela.
- tonhao: Uma pétala de rosa, posta na hora. O Bráulio nunca descobriu.
- bia [alegre]: Então o molho volta pra casa. Me ensina.

**Cap. 12, depois:** igual ao de hoje; a última fala ganha [firme].

**Cap. 13, antes**
- tonhao: O crítico do Michelzão não usa crachá. Senta, come e anota.
- bia [firme]: Então a gente trata todo mundo como se fosse ele. Como sempre.
- cami (olhando o Gurugol): Gente... tem comentário novo dizendo que o nosso molho é copiado.
- tonhao [brava]: Isso tem bigode! Eu vou lá agora...
- bia [firme]: Não vai, tio. Deixa o Bráulio falar. A gente cozinha.

**Cap. 13, depois**
- bia: Casa lotada por causa de um boato, e o crítico bem no meio.
- cami: E a gente deu conta.
- bia [alegre]: Deu porque cada um segurou o seu canto. Obrigada, gente.
- tonhao (lendo um cartão): O Michelzão deixou um recado: a última visita é um jantar. A gente escolhe a noite.
- dani [alegre]: A noite da estrela!

**Cap. 14, antes**
- tonhao: O crítico vem de cara limpa. E o Bráulio reservou uma mesa.
- dani: Ele vem provar o molho?!
- bia [firme]: Vem procurar defeito. Não vai achar.
- tonhao [alegre]: Panela no fogo, avental no lugar. É só você mandar, chefe.
- bia [firme] (olhando a foto da mãe): Quando a casa estiver pronta, eu marco a noite.

**Cap. 14, depois**
- bia [alegre]: O crítico raspou o prato. Não sobrou molho!
- tonhao: E o Bráulio saiu calado. Pela primeira vez na vida.
- dani: E agora?
- bia [firme]: Agora o guia liga. Vai dormir, tio. Amanhã o telefone toca, e eu atendo.

### 5.2 Conversas avulsas
**`HIST_EXIGENTE`** (agora é a Bia quem explica)
- tonhao: Bia, que plaquinha de duas estrelas era aquela na mesa?
- bia [firme]: Cliente exigente, tio. Quer a bebida antes da entrada, o salão em ordem e o prato da casa.
- tonhao: E se ele gostar?
- bia: Paga como ninguém. Se sair bravo, a cidade inteira fica sabendo. Deixa comigo.

**`HIST_CRITICO`**
- dani: Bia! Aquele freguês sozinho... ele tinha um caderninho!
- bia [firme]: Eu desconfiei. Servi como sirvo todo mundo.
- tonhao: Era ele. E deixou a ficha da visita. Olha aí.

**`HIST_RECOMENDA`**
- tonhao [insegura]: O guia ligou. Somos "recomendados".
- bia: Recomendado não é estrela.
- bia [firme]: Mas ele volta. Eu arrumo a casa e marco outra noite.

**As conversas da vontade (`HIST_VONTADE_DOCE.falas` e `HIST_VONTADE_CAFE.falas`)**: em cada uma, **só a última fala (a da Bia, hoje `Tá no Cardápio da lojinha.`) muda**; as outras falas e as `curta` ficam como estão. A fala nova cita o ajudante pelo nome, e ele pode não estar contratado (é quando `vontadeFalas` passa as falas dele para o Tonhão). Por isso a fala ganha um campo novo, `s2`: o texto para quando o ajudante (`quem`) não está contratado.
- `HIST_VONTADE_DOCE.falas`, última: `{ q:'bia', s:'Boa, Dani. Vou ver o curso no Cardápio da lojinha.', s2:'Boa ideia. Vou ver o curso no Cardápio da lojinha.' }` (sem `e`).
- `HIST_VONTADE_CAFE.falas`, última: `{ q:'bia', e:'firme', s:'Fechado, Joca. O curso tá no Cardápio da lojinha.', s2:'Fechado. O curso tá no Cardápio da lojinha.' }`.
- `vontadeFalas(qual, sv, curta)`: além do que já faz, quando `quem` não está contratado, toda fala com `s2` sai com `s` igual ao `s2`. A fala devolvida nunca leva o campo `s2` (com o ajudante contratado, sai o `s`).

**O socorro do banco numa função** (pendência da v11.1, que conferia a escolha lendo o código): `socorroFalas(sv)` em `src/10-constantes.js`, logo depois de `HIST_SOCORRO`, devolve `HIST_SOCORRO.firme` quando o `nivel` do ponto do save é 3 ou mais e `HIST_SOCORRO.falas` nos outros casos (save sem ponto = Garagem). `src/43-telas.js` passa a chamar a função, `window.__lcc` a expõe, e o smoke confere os quatro pontos por ela (a checagem por regex do `smoke77` é trocada por essa).

**`LIBERA`, `anselmo`**
- tonhao: Bia, lembra do Anselmo, o dos drinks do Bráulio? Encontrei ele na feira.
- anselmo [insegura]: Com licença... Lá no Bráulio não dava mais: era grito o dia inteiro.
- bia [firme]: Aqui ninguém grita. Só a chapa, de vez em quando.
- anselmo: Me dá um balcão e eu faço o drink mais bonito da Avenida.
- bia [firme]: O balcão é seu. Eu acerto na lojinha, em Equipe.

**`LIBERA`, `cami`**
- joca: Agora que eu tô na máquina de café, a louça vai acumular...
- bia: E o salão daqui não perdoa. Tem alguém em mente?
- joca: A Cami, do meu curso de barista. Era garçonete de rodízio: rápida que só!
- cami [alegre]: Me mostra onde fica tudo que eu dou conta!
- bia [firme]: Gostei. Eu acerto na lojinha, em Equipe.

**`LIBERA`, `lia`**
- tonhao (secando as mãos no avental): Bia, no curso tinha uma moça que cortava cebola mais rápido que eu.
- bia [alegre]: Mais rápido que o senhor? Essa eu quero conhecer.
- lia [firme]: Lia. Onde eu guardo as facas?
- bia [firme]: Na cozinha do chef Tonhão. Eu acerto na lojinha, em Equipe.

## 6. v11.3 — As conversas do arco: o motor e as 7 da Garagem e da área industrial (sessão 8c)
### 6.1 O motor (`ARCO`)
- Lista `ARCO` em `src/10-constantes.js`, depois de `LIBERA`, no mesmo molde: `{ id, nivel, quando:(sv, g) => bool, falas }` (e `falasB`, quando houver versão alternativa, com `qualB:(sv) => bool`).
- `save.arco`: um valor por `id`: `0` (não vista), `'pend'` (toca no próximo cartão de fim de dia) ou `1` (vista). `normSave` (em `src/12-clientes.js`, como `save.libera`) cria o campo.
- **Só no Modo História** (`histLiga()`), no fim do dia, depois de resolver capítulo e `LIBERA` (em `src/16-jogo.js`, onde `convQuit` e `convPlanta` são marcadas): se nenhuma entrada está `'pend'`, a **primeira** da lista, na ordem, com `nivel` igual ao do ponto de agora, valor `0` e `quando` verdadeiro passa a `'pend'`. **Uma por fim de dia.** Não marca no dia em que o banco tomou a lanchonete.
- Toca na fila de conversas de `src/43-telas.js` **por último** (depois das de capítulo, das `HIST_*` e da `LIBERA`), com `falar(...)`; ao terminar, vira `1` e grava.
- **Save antigo** (sem `save.arco`): entradas de `nivel` menor que o do ponto de agora nascem `1`; as outras, `0`. Quem muda de ponto com entradas `0` do ponto anterior: passam a `1` (não tocam mais).
- **Modo dev:** as entradas entram na lista de conversas para assistir (`src/43-telas.js`, onde está `'Cartão: ' + L.id`), com o rótulo `Arco: <id>`; o "Conversas: vistas" marca todas como `1`.
- `window.__lcc` expõe `ARCO`.

### 6.2 Garagem (`nivel` 1), nesta ordem
**`desanimo`** — `quando`: o dia que terminou é o 3º ou depois e fechou no negativo; ou é o 6º dia ou depois.
- bia [insegura] (sentada no degrau, com a foto da mãe na mão): Tio... e se eu não for como a mãe?
- bia [insegura]: Peguei dívida, errei pedido, deixei gente esperando. Acho que não nasci pra isso.
- tonhao: A Rosa queimou o arroz no primeiro dia da Casa Aurora. Chorou na despensa.
- tonhao [firme]: No outro dia, voltou. Você não precisa ser ela, Bia. Só precisa voltar amanhã.
- bia [firme] (levantando): ...Amanhã eu abro o portão.

**`elogio`** — `quando`: `desanimo` vista e o dia fechou com 2 estrelas ou mais.
- bia [alegre]: Tio! Uma senhora disse que fazia tempo que ninguém atendia ela com tanto carinho.
- tonhao: E quem atendeu?
- bia [alegre]: ...Eu.
- tonhao: Então guarda isso. Em dia ruim, você vai precisar.

**`daniPrato`** — `quando`: a Dani está contratada e veio no dia, e `elogio` vista.
- dani [insegura]: Quebrei dois pratos hoje, Bia. Desculpa. Eu sou lenta e ainda estrago as coisas.
- bia: Sabe quantos pedidos eu errei na primeira semana?
- dani: Quantos?
- bia [alegre]: Perdi a conta. O tio me disse que é só voltar amanhã. Volta amanhã, Dani.

### 6.3 Área industrial (`nivel` 2), nesta ordem
**`caderno`** — `quando`: `save.cap` é 5 ou mais e o dia fechou no azul.
- tonhao: Bia, me passa o caderno do caixa pra eu conferir.
- bia [firme]: Já fechei, tio. Bateu até o último real.
- tonhao (folheando o caderno): ...Bateu mesmo. Desde quando você faz isso sozinha?
- bia [alegre]: Desde a semana passada. O senhor é que não reparou.
- tonhao [alegre]: Então o caderno é seu.

**`daniDoce`** — `quando`: `save.daniCursos.confCaseira` e o Joca contratado.
- dani [insegura]: Devolveram meu pudim, Bia. Disseram que tava mole. Acho melhor eu voltar pra louça.
- bia [firme]: A louça agora é do Joca. E o doce é seu.
- dani: E se devolverem de novo?
- bia [alegre]: Aí você faz outro. Pudim mole a gente conserta. Desistir, não.

**`jocaCalado`** — `quando`: o Joca contratado e `daniDoce` vista.
- dani: O Joca não abre a boca, Bia. O freguês pergunta e ele aponta pra mim.
- joca [insegura]: É que eu sou só o da louça...
- bia [firme]: Aqui não tem "só", Joca. Sem prato limpo, ninguém almoça.
- joca [alegre]: ...Amanhã eu digo bom-dia.

**`motoqueiro`** — `quando`: `save.cap` é 5 ou mais, a Dani veio no dia e o dia teve ao menos uma marmita entregue.
- dani [insegura]: Aquele motoqueiro gritou comigo de novo por causa da marmita...
- tonhao [brava]: Deixa que eu vou lá fora falar com ele.
- bia [firme]: Deixa, tio. O salão é comigo.
- bia [firme] (voltando da calçada): Falei com ele: aqui se pede com educação, ou se pede em outro lugar.
- dani [alegre]: E ele?
- bia [alegre]: Pediu desculpa. E mais uma marmita.

## 7. v11.4 — As 10 conversas da Avenida e do Terraço (sessão 8d)
Só entradas novas na `ARCO` (o motor é da v11.3).

### 7.1 Avenida (`nivel` 3), nesta ordem
**`anselmoCopo`** — `quando`: o Anselmo contratado e veio no dia.
- anselmo [insegura] (catando os cacos): Desculpa, desculpa! Eu pago o copo, pode descontar...
- bia: Anselmo. Olha pra mim. É um copo.
- anselmo: No outro restaurante, um copo era meia hora de grito.
- bia [firme]: Aqui é uma vassoura e um copo novo. Respira e volta pro balcão.

**`jocaEspresso`** — `quando`: `save.jocaCursos.espresso`.
- joca [insegura]: O homem de terno perguntou se "o menino da louça" sabia mexer na máquina.
- bia [firme]: Eu ouvi. E disse a ele que o nosso barista se chama Joca.
- joca: Você disse isso?
- bia [alegre]: Disse. Agora tira um espresso que faça ele engolir a piada.

**`camiPressa`** — `quando`: a Cami contratada e veio no dia.
- bia: Cami, a mesa do casal reclamou que o prato chegou antes de eles tirarem o casaco.
- cami: No rodízio era assim: girou, serviu, próxima!
- bia [firme]: Aqui mesa não é número. Pergunta o nome, olha no olho. Rápida você já é.
- cami [alegre]: Nome e olho no olho. Anotado, chefe!

**`daniEnsina`** — `quando`: `save.daniCursos.confGourmet`.
- dani [alegre]: Bia, me pediram pra ensinar o ponto do brigadeiro. Eu! Ensinando!
- bia [alegre]: E ensinou?
- dani [firme]: Ensinei. E descobri que eu explico bem.
- tonhao: Quem diria. A menina lenta dando aula.
- dani [alegre]: Lenta, não, seu Tonhão. Caprichosa.

**`cortina`** — `quando`: `save.cap` é 8 ou mais.
- bia: Tio, o senhor passou o dia olhando pra Casa Aurora.
- tonhao [insegura]: Vinte anos naquela cozinha, Bia. E saí sem levar nem o meu nome.
- bia [firme]: O senhor trouxe o que importava: a mão. O nome a gente faz aqui.
- tonhao [alegre] (fechando a cortina): ...Então vamos trabalhar, que nome não se faz sozinho.

(A sexta da Avenida, `braulio1`, entra na v11.6, com o retrato do Bráulio.)

### 7.2 Terraço (`nivel` 4), nesta ordem
**`liaPerfeita`** — `quando`: a Lia contratada e veio no dia.
- tonhao: Lia, a mesa quatro tá esperando a entrada faz tempo!
- lia [insegura]: Refiz três vezes, chef. O corte não ficou igual.
- tonhao [firme]: Prato perfeito e frio não serve pra ninguém. Capricho tem hora, e a hora é a do freguês.
- lia [firme]: Entendido. Sai agora.
- bia [alegre]: Tá ensinando bonito, tio.

**`anselmoRi`** — `quando`: `save.anselmoCursos.autor`.
- anselmo [alegre] (rindo alto atrás do balcão): Opa... desculpa o barulho.
- bia: Desculpa por quê?
- anselmo: Fazia anos que eu não ria no serviço. Nem lembrava como era.
- bia [alegre]: Então ri mais alto, que o salão gostou.

**`jocaNome`** — `quando`: o curso de cafés especiais do Joca feito (o curso de `JOCA_CURSOS` de `nivel` 4).
- joca [alegre]: Bia, a mesa da janela pediu "o café do Joca". Pelo nome!
- bia [alegre]: E o que o barista da casa respondeu?
- joca [firme]: Que hoje tem coado, prensa e cold brew. E que eu recomendo o coado.
- bia: Olha ele. Há pouco tempo, nem bom-dia.

**`liaPetala`** — `quando`: o molho da Rosa comprado, `save.cap` é 13 ou mais, a Lia contratada e `liaPerfeita` vista.
- tonhao (com a pétala na palma da mão): Lia, hoje quem põe a pétala é você.
- lia [insegura]: Eu, chef? Esse prato é da sua família.
- tonhao [firme]: Por isso mesmo. Receita que fica numa mão só some. Eu já vi isso acontecer.
- lia [firme] (pondo a pétala): ...Na hora. Como a Rosa.

**`roda`** — `quando`: `save.cap` é 14 (a noite da estrela ainda não ganha).
- bia [firme]: Antes da noite da estrela, eu quero dizer uma coisa a vocês.
- bia: Eu comecei numa garagem, com medo de abrir o portão.
- bia [alegre]: Hoje eu não tenho medo. Porque nunca mais abri sozinha.
- dani [alegre]: Ai, Bia, eu vou chorar em cima do doce!
- tonhao [alegre]: Chora depois. Primeiro a estrela.

## 8. v11.5 — O retrato no balão e as expressões (sessão 8e)
- **Retrato:** dentro do balão da conversa (`drawConversa`, `src/26-conversa.js`), à esquerda do nome e do texto, um círculo de raio 34 com fundo `#F4EBDD` e a cabeça e os ombros de quem fala, desenhados pela mesma função do boneco do salão, em escala maior e recortados no círculo. O texto e a nota andam 84 px para a direita e o balão fica 84 px mais largo (o texto continua com `CONV_UI.w` 420). O bico do balão continua apontando para o boneco.
- **Cinco expressões** (campo `e` da fala; sem `e`, `neutra`), iguais para todos:
  | `e` | Sobrancelhas | Olhos | Boca | Corpo |
  |---|---|---|---|---|
  | `neutra` | como hoje | como hoje | como hoje | — |
  | `insegura` | erguidas no meio | olhando para baixo | pequena e reta | ombros 3 px mais baixos |
  | `firme` | retas e baixas | abertos, de frente | fechada, canto erguido | cabeça 2 px mais alta |
  | `alegre` | arqueadas | em arco (fechados sorrindo) | sorriso aberto | — |
  | `brava` | em V | apertados | curva para baixo | — |
- Com movimento reduzido, o retrato aparece direto, como o balão.
- **Modo dev:** no painel, "Retratos": uma tela com os 7 (e o Bráulio, quando existir) nas 5 expressões, para conferir de uma vez.
- **Capturas a olhar** (tirar, olhar ampliado e apagar): a grade dos retratos; o balão de `desanimo` (Bia insegura) e o do cap. 14 `antes` (Bia firme), em 844×390 e 568×320.

## 9. v11.6 — O Bráulio em cena (sessão 8f)
- `HIST_NOMES.braulio = 'Bráulio'`; cor do nome `#4A4A4A`; a cabeça dele para o balão fica na porta do salão (o ponto de entrada dos clientes), com o retrato: bigode, paletó e gravata `#F2C23D` (como o grupo `braulio` de `src/12-clientes.js`).
- **`braulio1`** — entrada da `ARCO`, `nivel` 3, a **primeira** da Avenida na ordem. `quando`: `save.cap` é 7 ou mais e é o 6º dia no ponto ou depois. `qualB`: o Anselmo não está contratado.
  - `falas` (com o Anselmo):
    - braulio (de braços cruzados, na porta): Então é esta a lanchonete da garagem. Vim buscar o meu coqueteleiro.
    - bia [insegura]: Ele... ele não é seu, chef. Pergunta pra ele.
    - anselmo [firme]: Eu fico aqui. Aqui ninguém grita.
    - braulio [brava]: Vocês não duram um ano nesta avenida.
    - bia [firme] (com a voz ainda tremendo): Pode ser. Mas a mesa do senhor fica do outro lado da rua.
    - tonhao [alegre]: A Rosa ia aplaudir de pé.
  - `falasB` (sem o Anselmo):
    - braulio (de braços cruzados, na porta): Então é esta a lanchonete da garagem. Sobrinha do Tonhão, não é?
    - bia [insegura]: Filha da Rosa. E dona da casa.
    - braulio [brava]: Vocês não duram um ano nesta avenida.
    - bia [firme] (com a voz ainda tremendo): Pode ser. Mas a mesa do senhor fica do outro lado da rua.
    - tonhao [alegre]: A Rosa ia aplaudir de pé.
- **Cap. 14, `depois`** (troca o da v11.2):
  - braulio [insegura] (parado na porta, de saída): Esse molho... é o da Rosa.
  - bia [firme]: É. E agora a cidade inteira sabe de quem é.
  - braulio: ...Ela cozinhava melhor que eu.
  - bia [firme]: A porta fica aberta, chef. Pra jantar.
  - tonhao: Saiu calado. Pela primeira vez na vida.
  - bia [firme]: Agora o guia liga. Vai dormir, tio. Amanhã o telefone toca, e eu atendo.
- **Manual:** a ficha `c-braulio` passa a aparecer depois de `braulio1` vista (hoje, só depois da noite da estrela).
- **Modo dev:** `Arco: braulio1` e `Arco: braulio1 (sem o Anselmo)` na lista de conversas.

## 10. v11.7 — A roupa da Bia por ponto (sessão 8g)
Vale no jogo todo (boneco do salão, retrato, Missão zero na Garagem), pelo `nivel` do ponto, com ou sem Modo História. Os tênis e a bandeja da lojinha continuam aparecendo como hoje.
| Ponto | Roupa | Cabelo |
|---|---|---|
| Garagem | camiseta e o avental de pano florido da mãe (rosas miúdas) | solto, como hoje |
| Área industrial | avental liso da cor da casa, com "Corre-Corre" bordado no peito | preso num rabo |
| Avenida | camisa de botão da casa, mangas dobradas, avental de cintura | rabo alto |
| Terraço | colete escuro com uma rosa bordada na lapela, camisa clara, avental de cintura escuro | coque |
- As cores saem da paleta que o `drawBia` já usa; as novas (colete `#2F3A4A`, rosa `#D9486E`) entram em `PAL` ou ao lado dela.
- **Modo dev:** "Roupa da Bia": 1 a 4, para ver qualquer uma em qualquer ponto.
- **Capturas a olhar:** a Bia parada e andando com bandeja em cada ponto, ampliada 4×; o retrato com cada roupa.

## 11. v11.8 — As reações da Bia durante o dia (sessão 8h)
Gestos curtos (0,8 s), sem efeito no jogo (não param a Bia nem mudam tempo de nada: são desenhados por cima do andar). Desligados com movimento reduzido. Uma reação por vez; a nova substitui a anterior.
| Quando | Garagem e área industrial | Avenida e Terraço |
|---|---|---|
| Uma mesa sai com todos os corações | sorriso surpreso e a mão no peito | punho fechado para cima ("isso!") |
| Um grupo vai embora bravo (mesa ou fila) | cabeça baixa por 0,8 s | respira fundo e ergue a cabeça |
| O dia termina com a meta batida (na tela de fim do dia, antes do resumo) | suspiro de alívio, ombros caindo | mãos na cintura, queixo erguido |
- **Modo dev:** três botões, "Reação: mesa feliz / grupo bravo / meta", que disparam o gesto do ponto de agora.
- **Capturas a olhar:** os seis gestos, ampliados 4×.

## 12. Para todas as sessões
- Cada versão fecha como as outras: spec `entregue`, `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `tests/run_all.sh` verde, PR e merge.
- **Smoke novo por versão** (o próximo número livre depois do `smoke76`), com uma checagem por critério de aceite. Nas versões de texto (v11.1 e v11.2): cada fala trocada confere pelo texto exato; nenhuma fala passa de 120 letras; toda conversa que apontava uma aba da lojinha continua com as mesmas palavras da aba; o campo `e`, quando existe, é um dos cinco. Nas da `ARCO` (v11.3, v11.4, v11.6): cada entrada fica `'pend'` com o `quando` dela e só uma por fim de dia; não toca fora do Modo História; save antigo não recebe as dos pontos passados; aparece no modo dev.
- **Smokes antigos que citam falas** (procure por `HISTORIA[`, `.falas[` e trechos de fala em `tests/`): atualize o texto esperado, sem mudar o que conferem.
- `node carreira.js` (com a História) tem de continuar chegando ao Fim como hoje: as conversas novas não mudam o jogo.
- Se um texto não couber no balão, ou um `quando` não tiver o dado no save, a sessão **pergunta ao usuário**; não reescreve fala nem troca gatilho por conta própria.
