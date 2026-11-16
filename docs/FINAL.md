# O final novo (Etapa 10, v11.16 a v11.18)

Roteiro e direção fechados em 16/11 (planejamento da Etapa 10; decisões do usuário em `docs/PROPOSTAS.md`). É a fonte dos textos, dos quadros e do som da Etapa 10: a sessão de cada versão **segue a sua seção** sem decidir nada. Vale tudo o que o `docs/ABERTURA.md` §3 (direção de arte) e §10 (para todas as sessões) diz, a não ser onde esta página diz outra coisa. Leia por faixa: `tests/indice.sh FINAL`.

## 1. Decisões (16/11)
- **O que muda:** o `FINAL` (8 cenas e os créditos, `src/18-abertura.js` e `src/25-abertura.js`, desde a v11) passa para o motor da abertura nova: quadro cheio, câmera, camadas, luz, transições, o tema da Rosa por clima e os efeitos. O que ele colhe da abertura (§2) fica mais visível: a última cena repete o enquadramento e o movimento da cena 1 (`porta`), e a foto da equipe repete o clique que vira foto da cena 2 (`carinho`).
- **Roteiro:** as 8 cenas, a ordem, as estrelas que cada uma pede (`min`), as falas e os tempos ficam como estão. Só as legendas mudam: uma linha de até 60 letras (a regra da abertura); o que sai do texto passa para a imagem (os nomes da equipe escritos na foto, o "Cozinha da Rosa" no letreiro).
- **Créditos com desenho:** a rua de casa à noite, a garagem aberta e acesa como escola, a estrela da Rosa piscando; por cima, "Lanchonete Corre-Corre", "O sonho da Bia" e "Obrigado por jogar!", com o tema fechando. 6 s, como hoje.
- **Sessões:** 3 versões, de três cenas cada (como a abertura): até a última, o jogador vê o final antigo e o novo só toca pelo modo dev ("Final novo (em obras)"); na v11.18 o novo vira o oficial e o antigo sai.
- **Nada muda no jogo:** quando o final toca (a 1ª estrela, a estrela nova, o save da v10.10), o botão História, o "Assistir o final" do modo dev, os créditos depois da `roda`, o save e o Manual seguem como na v11 (`docs/spec-v11.md`).

## 2. O que o final colhe (não quebrar)
| Na abertura | No final |
|---|---|
| Cena 1 (`porta`): a criança espia da porta; a Rosa mexe a panela e cantarola | Cena 8 (`roda`): o mesmo enquadramento e a mesma câmera; a Bia no lugar da Rosa, com o avental florido da mãe (roupa 1), e uma criança do bairro na porta |
| Cena 2 (`carinho`): a Rosa dá a colher; sobem corações; o clique vira a foto da Rosa | Cena 8: a Bia dá a colher à criança e sobem os corações. Cena 5 (`equipe`): o clique vira a foto da equipe |
| Cena 2: "Comida boa é carinho que a gente põe no prato." | Cena 8: a mesma frase, na boca da Bia |
| Cena 5 (`estrela`): a estrela da Casa Aurora vai para o Bráulio | Cena 3 (`apagou`): a mesma fachada, à noite; a estrela ao lado da porta pisca e apaga |
| Cenas 7, 8 e 11: a estrela da Rosa que acende e pisca | Cenas 4 e 7 e os créditos: a mesma estrela, piscando |
| Cena 8 (`promessa`): "Essa estrela vai ser nossa, mãe." | Cena 4 (`retrato`): "Essa estrela é nossa, mãe.", no mesmo enquadramento de close |
| Cena 11 (`portao`): a garagem da Rosa, o portão que sobe e o letreiro que acende | Cena 6 (`escola`) e os créditos: a mesma rua e a mesma garagem, agora com o letreiro "Cozinha da Rosa" |

No final pode aparecer a pétala (cena 4), que o Tonhão já revelou no Terraço.

## 3. Direção de arte (o que muda em relação à abertura)
- **A Bia** usa a roupa 4 (a do Terraço: colete, rosa na lapela, coque) nas cenas 1, 2, 4, 5 e 7, e a roupa 1 (o avental florido da mãe) na 8. De costas (cena 7), a `abCostas` ganha o cabelo `'coque'` e o colete `BIA_ROUPA_COR.colete` com a rosa (`BIA_ROUPA_COR.rosa`) no ombro.
- **A equipe** (cena 5) aparece de corpo inteiro e no tamanho dos planos abertos, com as roupas e os aventais da `abPessoaFoto` (a Dani de avental roxo, o Joca de cinza e azul, a Cami de vinho, o Anselmo de branco e preto, a Lia de branco com o lenço amarelo) e o Tonhão de touca e avental branco.
- **Paleta por momento:** o Terraço de manhã, pêssego e dourado (`#FFC99A`, `#F2C23D`, `#EFE6D2`, a nogueira `#5B3A26`); a Casa Aurora à noite, vinho sobre azul (`#7A2E3A` sobre `#1E2A4A`); o Terraço à noite, âmbar dos pendentes sobre azul (`#F2A53A` sobre `#2A315A`); a garagem de dia e a cozinha de casa, dourado e creme da infância (`#F6E7C1`, `#F2C23D`, `#E88A4A`).
- **Os créditos** não têm legenda, balão nem bolinhas; os três textos ficam na metade de cima, sobre o céu, com contorno escuro.
- **Bolinhas:** uma por cena que toca (6 a 8 com o `desde` 0, menos com o `desde`), sem contar os créditos.

## 4. O roteiro (textos exatos)
`id` | segundos | `min` | legenda (e `legDe`) | falas (`de`, em segundos) | `sai` | `clima` | `cam` (de → para) | `fx`

| # | `id` | t | min | Legenda | Falas | `sai` | `clima` | `cam` | `fx` |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `telefone` | 6,5 | 1 | Na manhã seguinte, o telefone do Terraço tocou cedo. | bia (2,4): Alô?... É do Michelzão?! | `corte` | `sonho` | [950,400,1.9] → [760,300,1.25] | `telefone` 0,2 e 1,4 |
| 2 | `placa` | 8 | 1 | (1) A Lanchonete Corre-Corre ganhou a estrela do Michelzão. (2) A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão. (3) Três estrelas do Michelzão: a nota mais alta do guia. | tonhao (2,6): Tá torta? · bia (4,4): Tá perfeita, tio. | `iris` | `festa` | [380,330,1.15] → [340,230,1.9] | `parafuso` 0,5; `brilho` 4,8 |
| 3 | `apagou` | 7,5 | 1 | Sem o molho da Rosa, a estrela da Casa Aurora se apagou. (`legDe` 4,8) | braulio (3,0): Cadê o tempero?! | `escuro` | `triste` | [865,300,2] → [780,330,1.15] | `apaga` 4,6 |
| 4 | `retrato` | 8 | 1 | A Bia pendurou a estrela ao lado do retrato da mãe. | bia (3,4): Essa estrela é nossa, mãe. | `passa` | `casa` | [470,330,1.2] → [470,270,2] | `estrela` 2,8 |
| 5 | `equipe` | 8 | 2 | Ninguém ganha estrela sozinho. | tonhao (2,8): Olha o passarinho! | `passa` | `festa` | [610,330,1] → [620,310,1.15] | `clique` 4,8 |
| 6 | `escola` | 8,5 | 1 | A garagem da Rosa reabriu: é a escola de cozinha do bairro. | dani (3,0): Eu era lenta, mas aprendi rápido. Vocês também vão! | `escuro` | `esperanca` | [610,330,1] → [610,390,1.7] | `sino` 0,4; `panela` 3,6 |
| 7 | `ceu` | 8 | 3 | Do Terraço, nas noites limpas, dá para ver três estrelas. | bia (2,6): Uma delas pisca pra mim, tio. · tonhao (4,6): Eu sei qual é. | `escuro` | `estrelas` | [610,190,1.6] → [610,330,1.1] | `estrela` 1,0 e 6,4 |
| 8 | `roda` | 9 | 1 | E sempre tem uma criança na porta da cozinha, olhando. | bia (3,2): Comida boa é carinho que a gente põe no prato. | `escuro` | `fim` | [330,330,1.7] → [610,300,1] | `panela` 0,4 |
| — | `creditos` | 6 | — | (sem legenda; `cheia:true`) | — | `escuro` | `creditos` | [610,240,1.3] → [610,300,1] | `estrela` 0,6 |

A cena 8 tem `titulo:'Fim'`. Com 3 estrelas, as 8 cenas somam 63,5 s, mais 6 s dos créditos. O texto do leitor de tela (`Abertura.texto`) segue a regra de hoje (com a legenda da estrela da vez na cena 2, e "Lanchonete Corre-Corre. O sonho da Bia. Obrigado por jogar!" nos créditos).

**O roteiro no código:** `FINAL2 = { cheio:true, final:true, trans:0.5, cenas:[...], creditos:{ id:'creditos', ... } }` nas v11.16 e v11.17 (o `FINAL` antigo ganha `final:true` e segue tocando para o jogador); na v11.18 ele passa a ser o `FINAL`. As cenas não têm mais o campo `som` (o clima e os `fx` fazem o som). A `finalCenas(est, desde, creditos, roteiro)` e a `Abertura` escolhem as cenas por `roteiro.final` (e não mais por `roteiro === FINAL`), e os créditos vêm de `roteiro.creditos` (ou do `FINAL_CREDITOS`, no antigo).

## 5. O som
- **Climas novos** (em `ab2Notas`; os outros são os da abertura, `docs/ABERTURA.md` §5):

| `clima` | Cenas | Como toca |
|---|---|---|
| `festa` | 2, 5 | as 4 primeiras notas do tema em `square`, 0,2 s cada, volume 0,04 (a fanfarra, como na `gala`); a partir de 1,0 s, o tema como no `sonho` (0,34 s por nota, `triangle`, volume 0,045, com o baixo e a terça acima) |
| `estrelas` | 7 | o tema uma oitava acima (freq x 2), `sine`, 0,6 s por nota, volume 0,035, sem baixo (caixinha de música) |
| `creditos` | créditos | o tema como no `casa` (0,42 s por nota) até 1,4 s antes do fim; ali, o acorde Dó-Mi-Sol-Dó (523, 659, 784, 1046 Hz), `triangle`, volume 0,045, de 1,4 s |

- **Efeitos novos** (em `AB_FX`):

| Nome | Som | Onde |
|---|---|---|
| `telefone` | duas notas `square`, 784 e 988 Hz, 0,2 s cada (a segunda 0,25 s depois), volume 0,035 | 1 (0,2 e 1,4) |
| `parafuso` | três ruídos de 0,05 s a 2400 Hz, volume 0,05, a 0, 0,18 e 0,36 s | 2 (0,5) |
| `apaga` | tom `sawtooth` de 440 a 110 Hz, 0,6 s, volume 0,03, e um ruído de 0,12 s a 800 Hz, volume 0,06 | 3 (4,6) |

Os efeitos `brilho`, `clique`, `estrela`, `sino` e `panela` são os da abertura. Trocar de cena corta o som, como na abertura (`Sfx.faixa()`).

## 6. v11.16 — O motor, o som e as cenas 1, 2 e 3 (sessão 10a)
O roteiro `FINAL2` inteiro (§4), o som (§5), o cartão de obra de volta (`ab2Obra`, como na v11.12: fundo `PAL.tinta`, o número e o `id` da cena no centro, creme, 40 px, com a legenda, as falas sem ponta, a câmera parada e o som de verdade) para as cenas 4 a 8 e os créditos, a parte nova `src/28-final.js` e o desenho das três primeiras cenas.

**O cenário "Terraço por dentro"** (`ab2Terraco(c,cam,modo,o)`, `modo` `'manha'` ou `'noite'`; as cenas 4 e 5 reusam). As medidas ficam numa constante `AB2_TE` (a execução pode mover cada peça até 40 px para a cena caber, anotando em Desvios): a porta de duas folhas em x 40 a 200 (y 150 a 520), a parede livre de 210 a 600 com a placa do Michelzão em [330,210] (`abPlacaMichel`, 170 x 76, só a partir da cena 2) e o Cantinho da Rosa embaixo dela, à direita (um aparador de nogueira de x 380 a 580, tampo em y 430, com o retrato grande da Rosa numa moldura dourada em [480,300], o copo com uma rosa e uma vela); o janelão de 620 a 1170 (y 60 a 330); o balcão da entrada de x 860 a 1080 (tampo em y 430), na frente do janelão, com o telefone de mesa (`abTelefone`) em [960,424].
- Fundo (paralaxe 0,6 a 0,8): pela janela, a cidade (os prédios da `abJanelaCidade`, maiores, em duas camadas) e o céu; colunas finas de nogueira com friso dourado dividindo o janelão; cortinas creme presas com laço dourado nas pontas.
- Meio: a parede creme `#EFE6D2` com o lambri de nogueira `#5B3A26` até 1/4 da altura e o friso dourado; a porta com os vidros foscos, os puxadores de latão e a placa "ABERTO"; três pendentes dourados pendurados do alto; duas mesas com toalha branca e flor no copo (`abMesaTe`, à esquerda do balcão, mais atrás); o piso de tábuas em espinha de peixe.
- Frente (paralaxe 1,2): a borda de uma cortina de veludo vinho na esquerda; a ponta de uma mesa com toalha e um arranjo de flores na direita.
- Luz `'manha'`: o sol nascendo na janela (à direita), fachos dourados longos no piso, poeirinha subindo; camada pêssego. Luz `'noite'`: lá fora, o céu `AB_COR.noite` com a cidade acesa e a estrela da Rosa (`ab2Estrela`) no alto do janelão; dentro, os pendentes acesos (halos âmbar), a vela acesa no Cantinho; camada azul por cima de tudo, menos dos halos.

**Cena 1, `telefone`**
- p 0 a 0,25: close no telefone tocando (as ondinhas, o fone tremendo), o salão vazio atrás, desfocado pela câmera de perto; poeirinha no facho de sol.
- p 0,2 a 0,4: a câmera abre; a Bia (roupa 4) entra pela direita, apressada, enxugando as mãos no avental.
- p 0,37: ela tira o fone do gancho. Fala em 2,4 s.
- p 0,55 a 0,75: ela ouve; os olhos arregalam; a mão livre vai à boca.
- p 0,6 a 1: o Tonhão aparece no passa-pratos da cozinha (uma janelinha na parede, à direita do janelão, recortando o corpo da cintura para cima), com a colher de pau e as sobrancelhas para cima; no fim, leva a mão ao peito.

**Cena 2, `placa`** (`'manha'`)
- p 0 a 0,3: o Tonhão, numa escadinha de dois degraus ao lado da parede livre, aperta o último parafuso da placa com a chave de fenda (a mão gira); a Bia (roupa 4), de braços cruzados, olha de baixo, ao lado da porta; o sol da manhã entra pelo vidro da porta.
- p 0,32: ele desce um degrau e olha por cima do ombro. Fala em 2,6 s. A placa ainda balança de leve (2 graus para cada lado, parando) e fica um tiquinho torta.
- p 0,55: a Bia inclina a cabeça para o mesmo lado da placa e sorri. Fala em 4,4 s.
- p 0,6 a 0,8: um brilho passa pelo latão, da esquerda para a direita, e as estrelas vermelhas acendem uma a uma (as estrelas ganhas, `AB_VIVO.est`).
- p 0,8 a 1: a câmera fecha na placa; o Tonhão desce e passa o braço pelos ombros da Bia (os dois ficam no pé do quadro, de lado).

**O cenário "rua da Casa Aurora à noite":** o `ab2RuaAurora` ganha o `modo` `'noite'`: céu de `AB_COR.noite` para `AB_COR.noite2`, com estrelas pequenas; os prédios escuros com janelinhas acesas; o lampião aceso; a estrelinha ao lado da porta (a da tarde) acesa, com halo; o `o.estrela` (0 a 1) a controla (1 acesa, 0 apagada, cinza, com um fiozinho de fumaça subindo); a porta dupla aberta, o salão lá dentro vazio, com as cadeiras de pernas para cima nas mesas; sem pombos; camada azul.

**Cena 3, `apagou`**
- p 0 a 0,3: close na plaquinha da estrela, acesa; a câmera abre devagar para a fachada e a porta aberta.
- p 0,3 a 0,45: o Bráulio (`abBraulio`, sem a placa) sai pela porta para a calçada, com uma panelinha e a colher de pau; prova o molho.
- p 0,4: careta. Fala em 3,0 s; ele sacode a panelinha.
- p 0,5 a 0,62: a estrela pisca, falhando; em p 0,62 apaga, com o fiozinho de fumaça. O Bráulio olha para ela e leva as mãos à cabeça.
- p 0,75 a 1: ele se senta no degrau da porta, a panelinha no colo, os ombros caídos. A legenda entra em 4,8 s.

## 7. v11.17 — O retrato, a equipe e a escola: 4, 5 e 6 (sessão 10b)
**Cena 4, `retrato`** — `ab2Terraco` em `'noite'`, com a placa na parede.
- p 0 a 0,25: o salão à noite, vazio, as cadeiras encostadas; a Bia (roupa 4) diante do Cantinho, de três quartos, com uma estrelinha dourada de latão (do tamanho de uma mão) nas duas mãos; a vela acesa; no alto do janelão, a estrela da Rosa.
- p 0,25 a 0,4: ela prende a estrelinha na parede, ao lado do retrato; um brilhinho quando prende.
- p 0,42: ela olha o retrato. Fala em 3,4 s.
- p 0,6 a 0,8: ela encosta dois dedos na moldura; a chama da vela se inclina.
- p 0,75 a 1: uma pétala cai devagar do copo da rosa; a estrela da Rosa, no janelão, pisca forte em p 0,9.

**Cena 5, `equipe`** — `ab2Terraco` em `'manha'`; diante do janelão, a equipe em duas fileiras: atrás (um pouco mais alto, 90% do tamanho) a Cami, a Lia e o Anselmo; na frente, a Dani, a Bia e o Joca, com um lugar vazio entre a Bia e o Joca; na camada da frente, à esquerda, a câmera fotográfica num tripé, em silhueta.
- p 0 a 0,3: o Tonhão, curvado atrás da câmera do tripé, ajeita o foco e aperta o botão (uma luzinha vermelha começa a piscar na câmera).
- p 0,3 a 0,55: ele corre para o lugar vazio na frente; o Joca abre espaço; a Cami ajeita o cabelo; o Anselmo ergue a coqueteleira; a Lia ri; a Dani segura uma bandeja de doces. Fala em 2,8 s (ele correndo).
- p 0,6: o clique. Um clarão branco de 0,15 s; a cena para (todos congelam) e vira foto: o quadro escurece 60% e, no centro, aparece o mesmo quadro em ponto pequeno, numa moldura de madeira com passe-partout creme, girada 2 graus, com um halo dourado; no passe-partout, embaixo de cada um, o nome escrito à mão (`FB`, 18 px, tinta): Cami, Lia, Anselmo, Dani, Bia, Tonhão, Joca.
- p 0,6 a 1: a foto fica. Com movimento reduzido, o quadro parado (p 0,8) é a foto.

**O cenário "rua de casa de dia":** o `ab2RuaCasa` ganha `o.dia` (0 a 1), `o.letreiro` (o texto; padrão `AB2_CASA.letreiro`) e `o.dentro(c)` (o que se vê dentro da garagem, no lugar do `ab2Garagem`). De dia: céu de `#8EC9EC` para `#F7D9A8`, sol baixo à esquerda em [200,120], sem estrelas nem a estrela da Rosa; as casas vizinhas em `#C9A9A0` com as janelas apagadas; a árvore verde (`#4C9460`); os vasinhos dão lugar a duas roseiras floridas (`abRoseira`), uma de cada lado do portão; sem a camada da noite; as pessoas sem `ab2Noite`.

**Cena 6, `escola`** — o portão todo aberto (`k` 1), o letreiro "Cozinha da Rosa" aceso (`letras` 1), `dia` 1. Lá dentro (`o.dentro`): a parede creme com o barrado de azulejo azul e branco da cozinha de casa; um quadro-negro com "Receitas da Rosa" escrito a giz; a foto da Rosa (`drawFotoRosa`) ao lado; uma prateleira com potes; a bancada baixa de madeira com tábuas, tomates e a panela grande. As pessoas lá dentro têm 70% do tamanho dos planos abertos: três crianças de avental colorido, uma delas na ponta dos pés num banquinho, e a Dani (avental roxo) atrás da bancada, à direita.
- p 0 a 0,3: duas crianças de mochila chegam correndo pela calçada (uma de cada lado, a 85% do tamanho) e entram pelo portão; a sineta.
- p 0,3 a 0,5: a Dani mexe a panela e mostra a colher para a turma. Fala em 3,0 s.
- p 0,55 a 0,8: a criança do banquinho prova da colher e fecha os olhos; sobem corações e estrelinhas (`ab2Mimos`).
- p 0,8 a 1: a Dani ri e bate palminhas; o vapor sobe da panela.

## 8. v11.18 — O céu, a roda, os créditos, a troca e a limpeza (sessão 10c)
**O cenário "varanda do Terraço"** (`ab2Varanda(c,cam,o)`), de noite:
- Fundo (0,5 a 0,8): o céu `AB_COR.noite` para `AB_COR.noite2` com muitas estrelas pequenas e as três juntas no alto do centro ([554,134], [610,120] e [666,134]; a do meio maior, a estrela da Rosa); a cidade lá embaixo em duas camadas, com as janelinhas acesas e uma avenida de luzinhas.
- Meio: o parapeito de pedra clara (tampo em y 400) com balaústres; dois vasos com plantas; um cordão de luzinhas amarelas de um vaso ao outro, em curva; o piso de lajota.
- Frente (1,2): folhas de uma palmeira na borda direita; a ponta de uma espreguiçadeira na borda esquerda.
- Luz: as três estrelas com halo, o cordão aceso; camada azul.

**Cena 7, `ceu`**
- p 0 a 0,3: o céu e as três estrelas; a do meio pisca; a câmera desce até a cidade e o parapeito.
- p 0,3: a Bia (roupa 4, de costas, `abCostas` com o `'coque'`) e o Tonhão (de costas) no parapeito; ela aponta para a estrela do meio. Fala em 2,6 s.
- p 0,55: ele passa o braço pelos ombros dela. Fala em 4,6 s.
- p 0,8: a estrela do meio pisca forte duas vezes; ela encosta a cabeça no ombro dele.

**Cena 8, `roda`** — `ab2Cozinha` em `'tarde'`, com a mesma câmera e o mesmo movimento da cena 1 da abertura. O `ab2Cozinha` ganha `o.foto` (a foto da Rosa na parede, a mesma do `modo` `'lar'`, também à tarde).
- p 0 a 0,45: a câmera na porta. Uma criança do bairro (`abCrianca`, outro cabelo e outra roupa que os da Bia criança: tranças e camiseta azul) espia de trás do batente (meio corpo e uma mão). Ao fundo, a Bia adulta (roupa 1) mexe a panela e cantarola (as notinhas, `ab2Notinhas`).
- p 0,36: a Bia vira o rosto para a porta e sorri. Fala em 3,2 s.
- p 0,55 a 0,75: ela tira a colher da panela, sopra e estende para a criança, que entra devagar, de mãos juntas.
- p 0,7 a 0,85: a criança prova; fecha os olhos e cora; sobem corações e estrelinhas (`ab2Mimos`).
- p 0,8: a foto da Rosa, na parede, ganha um halo dourado. O título "Fim" entra em p 0,84, no alto e no centro (`FD`, 80 px, mostarda, com contorno), sem cobrir ninguém.

**Os créditos** — `ab2RuaCasa` à noite, com o portão aberto (`k` 1), o letreiro "Cozinha da Rosa" aceso e a estrela da Rosa piscando (`pisca` de 0 a 1 e de volta, a cada 2 s; parada em 0,5 com movimento reduzido); ninguém na calçada. Os textos entram por transparência: "Lanchonete Corre-Corre" (`FD`, 60 px, mostarda) em p 0,1, "O sonho da Bia" (`FD`, 32 px, creme) em p 0,25 e "Obrigado por jogar!" (`FB`, 26 px, creme) em p 0,45, centrados em x = 610 e em y 110, 170 e 222, com contorno escuro. Com movimento reduzido, tudo à vista.

**A troca:** o final novo vira o oficial (`FINAL`; o nome `FINAL2` deixa de existir), o antigo sai (as 9 cenas da `AB_CENAS`, o `FINAL_CREDITOS`, a faixa de legenda `abLegenda`, o `fade` e o caminho antigo do `drawAbertura` e do `aberturaSom`, e os desenhos que só ele usava), a entrada "Final novo (em obras)" some do modo dev e o "Assistir o final" passa a tocar o novo. O `ab2Obra` sai de novo. Tudo o que a abertura usa (`abRosa`, `abTonhao`, `abBraulio`, `abPlacaMichel`, `abCostas`, `abBalao`, `AB_ALT`...) fica.

## 9. Para todas as sessões
- **Conferir pela captura**, como na abertura (`docs/ABERTURA.md` §10): cada cena em p 0,25, 0,6 e 0,9, mais o celular deitado (844 x 390), em recorte ampliado. A cena 2 também com 1, 2 e 3 estrelas; a 5 também em p 0,8 (a foto). Se não estiver bonita em duas rodadas, avise o usuário e sugira um modelo mais forte.
- **O usuário assiste a cada sessão** pelo modo dev ("Final novo (em obras)", aba História) e pode pedir ajustes, que entram como versão de correção com spec enxuta ou pelo editor de desenhos.
- **O `FINAL` antigo não muda** nas v11.16 e v11.17: os smokes do final (`smoke76`, o CA2 e o CA6 do `smoke88`, o CA5 do `smoke91`) passam sem alteração.
- **Movimento reduzido:** quadro parado em `pRM` (padrão 0,8), câmera em `para`, sem transição, sem tremor; só o toque avança.
