# A abertura nova (Etapa 9, v11.11 a v11.14)

Roteiro e direção fechados na entrevista de 15/11 (pedido em `docs/PROPOSTAS.md`). É a fonte dos textos, dos quadros e do som da Etapa 9: a sessão de cada versão **copia a sua seção para a spec** sem decidir nada. Leia por faixa: `tests/indice.sh ABERTURA`.

## 1. Decisões da entrevista (15/11)
- **O que incomodava:** cenários vazios, personagens pequenos, pouca animação e texto demais (os quatro).
- **Estilo:** cinema com os mesmos bonecos. O traço dos personagens do jogo fica; os cenários passam a ter camadas, luz e sombra; a câmera desliza e aproxima; há closes e transições entre as cenas.
- **Roteiro:** reescrito (11 cenas), sem contradizer nenhuma fala do jogo e plantando o que o jogo colhe depois (§2).
- **Duração:** igual à de hoje, 77 s.
- **Texto:** quadro cheio. Some a faixa preta; a narração é uma linha curta sobre a imagem, só quando precisa. Os balões continuam.
- **A perda da Rosa:** delicada e simbólica. A despedida no leito fica (a promessa nasce ali); a partida é a cozinha vazia e uma estrela que acende na janela. Sem corredor de hospital, sem cortina fechando.
- **O segredo do molho:** só o brilho rosado. A pétala não aparece; quem revela é o Tonhão, no Terraço.
- **Som:** um tema musical (o tema da Rosa) que atravessa a abertura mudando de clima, mais efeitos.
- **Escopo:** só a abertura. O final (`FINAL`, 8 cenas e os créditos) continua como está e ganha o mesmo tratamento numa etapa seguinte (Etapa 10, a planejar).
- **Sessões:** 4 versões. Até a última, o jogador vê a abertura antiga e a nova só toca pelo modo dev ("Abertura nova (em obras)"); na v11.14 a nova vira a oficial e a antiga sai.

## 2. O que a abertura planta e o jogo colhe (não quebrar)
| Na abertura | No jogo |
|---|---|
| Cena 1: a criança espiando da porta da cozinha | Última cena do final: "sempre tem uma criança na porta da cozinha, olhando" |
| Cena 2: "Comida boa é carinho que a gente põe no prato." | A mesma frase, na boca da Bia, fecha o final |
| Cena 2: o clique que vira a foto da Rosa (`drawFotoRosa`) | A foto da mãe é o fio do arco (uma fala para ela em cada ponto) |
| Cena 4: o pote de cominho na mão do Tonhão; o açafrão na bancada | "Cominho com açafrão... a Rosa ia rir de mim agora."; o pote volta em vários capítulos |
| Cena 4: o Bráulio gritando ao fundo | O Anselmo: "era grito o dia inteiro" |
| Cena 4: o brilho rosado, sem mostrar a pétala | "Uma pétala de rosa, posta na hora. O Bráulio nunca descobriu." (Terraço) |
| Cena 5: a fama com o Bráulio | "A estrela dele veio do molho da sua mãe." |
| Cenas 6 e 8: o caderno "Receitas da Rosa" | O molho volta para casa no Terraço |
| Cenas 7, 8 e 11: a estrela que acende e pisca na janela | Final: "Uma delas pisca pra mim, tio." |
| Cena 8: "Essa estrela vai ser nossa, mãe." | Final: "Essa estrela é nossa, mãe." |
| Cena 9: o Tonhão sai magoado da Casa Aurora | O arco dele é curar essa mágoa |
| Cena 10: "Tem que dar certo..." (a Bia com medo) | A Bia começa insegura (`docs/ARCO.md` §1) |
| Cena 11: a Bia hesita diante do portão | Terraço: "Eu comecei numa garagem, com medo de abrir o portão." |
| Cena 11: "a garagem da Rosa" | "A garagem da Rosa é nossa de novo."; a escola do final |

Não usar na abertura: a pétala à mostra; a rosa no cabelo da Bia (é só da roupa do Terraço); "Será que eu dou conta?" (é do cap. 1).

## 3. Direção de arte (vale para as 11 cenas)
- **Quadro:** a tela toda, 1220 x 600 (`TW` x `H`). O chão dos planos abertos fica em y = 520 (`AB2.chao`). Os botões Voltar e Pular (HTML) continuam no alto.
- **Tamanho das pessoas:** no plano aberto, o adulto tem 290 px de altura (hoje, 210): `AB2.k = 1.38` sobre o `abEsc`. Nos closes a câmera chega a 2,2 vezes; o rosto em close ocupa pelo menos 40% da altura do quadro.
- **Câmera:** cada cena tem `cam:{ de:[cx,cy,z], para:[cx,cy,z] }` (o centro do que se vê, em coordenadas da cena, e a aproximação); vai de um ao outro com `abSuave` ao longo da cena. `z` nunca é menor que 1 e o retângulo visto nunca sai do quadro. Com movimento reduzido, fica em `para`.
- **Camadas:** toda cena tem fundo (paralaxe 0,6 a 0,85, cores mais claras e frias), meio (onde as pessoas pisam, paralaxe 1) e frente (paralaxe 1,15 a 1,25, silhuetas escuras nas bordas: batente, folhagem, plateia). A paralaxe é o deslocamento da camada em relação ao centro da câmera.
- **Luz:** cada cena tem uma fonte de luz nomeada (sol na janela, chama, holofote, abajur, estrela, a luz da garagem), com halo (degradê radial), sombra elíptica sob cada pessoa e móvel, e uma vinheta escura suave nas bordas. Uma camada de cor por cima dá o clima (dourado, azul da noite, âmbar).
- **Nada de plano liso:** nenhuma área maior que um quarto do quadro fica sem objeto, textura (azulejo, ladrilho, tábua, veludo) ou variação de luz.
- **Atuação:** em toda cena cada pessoa faz pelo menos duas coisas (um gesto e uma reação), além de piscar, respirar (1 a 2 px) e mexer a boca ao falar. Com movimento reduzido, o quadro parado é o de `pRM` (padrão 0,8).
- **Legenda:** uma linha, até 60 letras, em y = 548, 24 px, creme com contorno escuro, sobre um degradê escuro só nos 130 px de baixo (0 a 0,6 de opacidade). Entra em `legDe` segundos (padrão 0,6) com 0,4 s de transparência. Cena com `leg:''` não tem degradê.
- **Bolinhas das cenas:** 11, em y = 584, pequenas (raio 3; a atual, 4,5). "toque para seguir" à direita, 13 px, só na cena 1.
- **Balões:** os de hoje (`abBalao`), desenhados no espaço da tela (a cabeça de quem fala passa pela câmera), para a letra não mudar de tamanho. Nunca cobrem o rosto de ninguém.
- **Transições** (`sai`, nos últimos 0,5 s da cena; nada disso com movimento reduzido): `corte` (seco), `escuro` (como hoje), `flash` (branco), `passa` (a próxima cena entra por uma cortina lateral, por `clip`), `iris` (um círculo fecha num ponto e a próxima cena abre dele), `segue` (a próxima cena começa no mesmo quadro: nenhuma transição).
- **Paleta por momento:** infância, dourado e creme (`#F6E7C1`, `#F2C23D`, `#E88A4A`); Casa Aurora, vinho e cobre (`#7A2E3A`, `#C97B4A`, `#F4EFE6`); a perda, azul da noite (`#1E2A4A`, `#3A3F6E`, `#9FB4D8`); a virada, âmbar sobre azul (`#F2A53A` sobre `#2A315A`). As cores das pessoas não mudam.

## 4. O roteiro (textos exatos)
`id` | segundos | legenda (e `legDe`) | falas (`de`, em segundos) | `sai`

| # | `id` | t | Legenda | Falas | `sai` |
|---|---|---|---|---|---|
| 1 | `porta` | 7 | A Bia cresceu na porta da cozinha. | rosa (3,2): Vem provar, filha. | `corte` |
| 2 | `carinho` | 7 | (sem legenda) | rosa (2,6): Comida boa é carinho que a gente põe no prato. | `escuro` |
| 3 | `aurora` | 7 | A Rosa sonhava ser chef. | bia (1,0): Vai, mãe! · tonhao (3,0): Bem-vinda, maninha! | `passa` |
| 4 | `molho` | 7 | Com o irmão, ela criou um molho. E guardou um segredo. | tonhao (4,2): Que molho é esse, Rosa?! | `iris` |
| 5 | `estrela` | 7 | A estrela veio. A fama ficou com o chef Bráulio. (`legDe` 3,4) | braulio (1,6): Receita minha! | `escuro` |
| 6 | `despedida` | 7 | Pouco depois, a Rosa adoeceu. | rosa (1,6): Cozinha sempre com carinho, filha. · bia (4,2): Prometo, mãe. | `escuro` |
| 7 | `janela` | 7 | A Rosa partiu. (`legDe` 1,0) | (sem fala) | `segue` |
| 8 | `promessa` | 8 | A Bia cresceu. E fez uma promessa. (`legDe` 0,8) | bia (4,6): Essa estrela vai ser nossa, mãe. | `passa` |
| 9 | `tio` | 6 | O tio Tonhão largou a Casa Aurora. | tonhao (2,4): Dinheiro eu não tenho, Bia. Mas braço pra cozinha tenho de sobra! | `passa` |
| 10 | `banco` | 6 | Sem um tostão, a Bia foi ao banco. | bia (0,8): Tem que dar certo... | `iris` |
| 11 | `portao` | 8 | E a garagem da Rosa virou a Lanchonete Corre-Corre. (`legDe` 4,6) | tonhao (2,2): Abre, Bia. | `escuro` |

A cena 11 tem `titulo:'O sonho da Bia'`. Soma: 77 s. O texto do leitor de tela (`Abertura.texto`) segue a regra de hoje: legenda, falas e título.

## 5. O som
- **O tema da Rosa** (8 notas, em Dó maior): Sol4, Dó5, Si4, Dó5, Mi5, Ré5, Dó5, Lá4 (392, 523, 494, 523, 659, 587, 523, 440 Hz); a frase fecha em Sol4 (392).
- **Climas** (`clima` da cena): a função `ab2Notas(cena)` devolve a lista `[freq, atraso, duração, onda, volume]` que enche a cena, repetindo o tema.

| `clima` | Cenas | Como toca |
|---|---|---|
| `casa` | 1, 2 | tema em Dó maior, `triangle`, 0,42 s por nota, volume 0,045; baixo `sine` (Dó3 131, Sol3 196) a cada 4 notas, volume 0,03 |
| `sonho` | 3, 4 | como `casa`, 0,34 s por nota, com a terça acima (freq x 1,25) nas notas pares, volume 0,025 |
| `gala` | 5 | as 4 primeiras notas em `square`, 0,2 s, volume 0,04 (fanfarra); a partir de 3,2 s, o tema `triste` |
| `triste` | 6, 7 | tema uma terça menor abaixo (freq x 5/6, soa em Lá menor), `sine`, 0,8 s por nota, volume 0,04, sem baixo |
| `esperanca` | 8, 9, 10 | como `casa`, 0,46 s por nota |
| `fim` | 11 | `casa` até 5,4 s; depois o tema uma oitava acima (freq x 2), 0,3 s por nota, e o acorde final Dó-Mi-Sol-Dó (523, 659, 784, 1046) de 1,4 s |

- **Efeitos** (`fx:[[nome, segundo]]`; a tabela `AB_FX` tem um som para cada nome, feito com `Sfx.tone` e `Sfx.noise`):

| Nome | Som | Onde |
|---|---|---|
| `panela` | 6 ruídos curtos (0,05 s, 400 a 700 Hz), borbulha | 1 (0,4), 2 (0,3), 4 (0,5), 8 (3,4) |
| `clique` | ruído de 0,03 s a 3000 Hz e um tom de 1800 Hz | 2 (6,0) |
| `sino` | tom `sine` 1318 Hz, 0,4 s | 3 (3,1) |
| `brilho` | arpejo `sine` 1568, 1976, 2349 Hz | 4 (3,6) |
| `aplauso` | ruído de 2,4 s a 1800 Hz, volume 0,05 | 5 (0,2) |
| `chuva` | ruído de 2,6 s a 1200 Hz, volume 0,03 | 7 (0,2) |
| `estrela` | tons `sine` 1568 e 2093 Hz, 0,6 s | 7 (3,9), 8 (6,8), 11 (6,4) |
| `carimbo` | tom `sine` 110 Hz de 0,18 s, volume 0,12, e ruído de 0,08 s | 10 (3,3) |
| `portao` | ruído de 1,1 s a 500 Hz e um tom `sawtooth` de 90 a 180 Hz | 11 (3,6) |

- **Trocar de cena corta o som:** a trilha e os efeitos de uma cena saem por um nó de ganho próprio (`Sfx.faixa()`), que vai a zero em 0,15 s quando a cena troca (toque, Voltar, Pular ou fim). O botão de som vale como no resto do jogo. Com movimento reduzido, o som toca igual.

## 6. v11.11 — O motor, o som e as cenas 1 e 2 (sessão 9a)
O motor (§3), o roteiro (§4) e o som (§5) inteiros, e o desenho das duas cenas da cozinha de casa. As cenas 3 a 11 tocam como **cartão de obra**: fundo `PAL.tinta`, o número e o `id` da cena no centro (creme, 40 px), com a legenda, as falas (sem ponta), a câmera parada e o som de verdade.

**O cenário "cozinha de casa"** (`ab2Cozinha(c,cam,modo)`, com `modo` `'tarde'`, `'noite'` ou `'lar'`; as cenas 7 e 8 reusam):
- Fundo: parede creme `#F6E7C1` com barrado de azulejo azul e branco até 1/3 da altura; janela grande à direita do centro, com cortina rosa presa dos lados; lá fora, céu e a copa de uma árvore. Prateleira com seis potes de tempero e um vaso; três panelas penduradas; um gancho com o avental da Rosa (só no `modo` `'noite'`); um relógio de parede; um calendário de folhinha.
- Meio: à esquerda, a porta aberta com o corredor mais escuro atrás; geladeira antiga com um desenho de criança preso; fogão de quatro bocas com a chama acesa e a panela vermelha; bancada de madeira com tábua, tomates e o copo com uma rosa; mesa pequena com a toalha xadrez (a da lojinha); o banquinho; piso de ladrilho em xadrez creme e terracota; um tapete.
- Frente: o batente da porta, escuro, na borda esquerda; folhas de um vaso na borda direita.
- Luz `'tarde'`: sol baixo pela janela, um facho diagonal dourado com poeirinha subindo, halo da chama, tudo com a camada dourada.

**Cena 1, `porta`** — `cam` de `[330,330,1.7]` para `[610,300,1]`; `clima` `casa`; `fx` `panela` 0,4.
- p 0 a 0,45: a câmera está na porta. A Bia criança espia de trás do batente (meio corpo e uma mão à mostra). Ao fundo, a Rosa mexe a panela e cantarola (três notinhas musicais sobem do rosto dela).
- p 0,45: a Rosa vira o rosto para a porta e sorri. Fala em 3,2 s.
- p 0,7 a 1: a Bia sai de trás do batente e dá dois passos para dentro, de braços abertos.

**Cena 2, `carinho`** — `cam` de `[660,330,1.9]` para `[680,310,2.1]`; `clima` `casa`; `fx` `panela` 0,3, `clique` 6,0; `pRM` 0,6.
- p 0 a 0,15: a Bia de pé no banquinho, ao lado do fogão; a Rosa tira a colher da panela e sopra.
- p 0,15 a 0,4: a Rosa leva a colher à boca da Bia, com a outra mão embaixo.
- p 0,45: a Bia fecha os olhos, as bochechas coram, sobem corações e estrelinhas. A Rosa ri. Fala em 2,6 s.
- p 0,86: o clique. Um clarão branco de 0,15 s; a cena escurece 60% e, no centro, aparece a foto da Rosa na moldura (`drawFotoRosa`, com 300 px de altura, girada 4 graus), com um halo dourado. Fica até o fim.

## 7. v11.12 — As cenas da Casa Aurora: 3, 4 e 5 (sessão 9b)
**O cenário "rua da Casa Aurora"** (`ab2RuaAurora(c,cam,modo)`, `'manha'` ou `'tarde'`; a cena 9 reusa):
- Fundo: céu em degradê; duas fileiras de prédios em silhueta (paralaxe 0,6 e 0,8), com janelinhas; o sol atrás deles.
- Meio: a fachada da Casa Aurora, larga e elegante, do centro para a direita: toldo listrado vinho e creme, letreiro "Casa Aurora" dourado sobre vinho, porta dupla com vidro, duas janelas altas com luz quente e cortina, dois vasos de buxinho, um lampião de rua; calçada de pedra em mosaico preto e branco; do lado esquerdo, a outra calçada, com uma árvore e um banco.
- Frente: galhos da árvore na borda esquerda; três pombos que levantam voo.
- `'manha'`: laranja-rosa `#F5B58A` embaixo e azul-claro `#9FD3F0` em cima, o lampião ainda aceso. `'tarde'`: laranja `#F0A45A` para roxo `#7A4E7E`, sombras compridas e a placa da estrela ao lado da porta.

**Cena 3, `aurora`** — `cam` de `[560,310,1]` para `[690,330,1.25]`; `clima` `sonho`; `fx` `sino` 3,1.
- p 0 a 0,45: a Rosa (vestido rosa, bolsa, a flor no cabelo) anda da esquerda até a porta, respira fundo e ajeita a flor. A Bia criança, à esquerda, pula e acena. Fala da Bia em 1,0 s; a Rosa olha para trás e acena de volta.
- p 0,45: a porta dupla se abre e a luz quente sai para a calçada. O Tonhão aparece de braços abertos. Fala em 3,0 s.
- p 0,75 a 1: os dois se abraçam e entram; os pombos voam.

**O cenário "cozinha da Casa Aurora"** (`ab2CozinhaAurora(c,cam)`):
- Fundo (paralaxe 0,8, mais claro): azulejo branco de metrô; coifa grande de cobre; panelas de cobre penduradas; o passa-pratos com a campainha e as comandas no varal; dois cozinheiros de costas, trabalhando; o Bráulio (a touca alta), de dedo em riste, com um balãozinho só de "!!!" (não é fala) e uma frigideira flambando ao lado.
- Meio: bancada de inox comprida com tábua, legumes, o pote de cominho (rótulo "cominho") e o de açafrão; a panela grande no centro; o Tonhão à esquerda e a Rosa à direita, os dois de dólmã.
- Frente: a borda de uma prateleira com pratos empilhados, embaixo; vapor passando.
- Luz: branca e fria no fundo, quente das chamas no meio.

**Cena 4, `molho`** — `cam` de `[610,320,1.15]` para `[640,340,1.8]`; `clima` `sonho`; `fx` `panela` 0,5, `brilho` 3,6.
- p 0,1 a 0,3: o Tonhão polvilha o cominho, prova e balança a cabeça: falta alguma coisa.
- p 0,4 a 0,55: a Rosa olha para os dois lados, vira de costas para a câmera e cobre a panela com o corpo.
- p 0,5: sobe da panela um brilho rosado (`AB_COR.petala`) com halo dourado; o vapor fica rosa; estrelinhas. A pétala não aparece.
- p 0,6: o Tonhão prova de novo e arregala os olhos. Fala em 4,2 s. A Rosa pisca um olho e põe o dedo nos lábios.
- A íris fecha no brilho da panela.

**O cenário "salão de gala"** (`ab2Gala(c,cam)`):
- Fundo: cortina de veludo vinho com dobras e franja dourada; um lustre; um palco baixo de madeira.
- Meio: o Bráulio no palco, sob um holofote em cone, erguendo a placa do Michelzão (`abPlacaMichel`); confete dourado caindo. À direita, a porta da cozinha entreaberta, com luz azulada e fria: a Rosa e o Tonhão, de avental, na penumbra.
- Frente (paralaxe 1,2): a plateia em silhueta, de costas, com braços aplaudindo e três câmeras cujos flashes estouram (pontos brancos que piscam).

**Cena 5, `estrela`** — `cam` de `[470,300,1.5]` para `[900,320,1.7]`; `clima` `gala`; `fx` `aplauso` 0,2.
- p 0 a 0,4: a câmera está no Bráulio. Ele ergue a placa e estufa o peito. Fala em 1,6 s.
- p 0,4 a 1: a câmera desliza até a porta da cozinha. O Tonhão fecha o punho e dá um passo; a Rosa segura o braço dele e baixa os olhos. A legenda entra em 3,4 s.
- O volume do aplauso cai à metade quando a câmera chega à sombra (é a trilha `gala` passando para `triste`).

## 8. v11.13 — A perda e a promessa: 6, 7 e 8 (sessão 9c)
**O cenário "quarto"** (`ab2Quarto(c,cam)`): um quarto de hospital, mas aconchegante, sem aparelhos nem soro.
- Fundo: parede verde-água escurecida pela noite; janela com o céu azul-escuro, a lua e uma cortina leve que balança.
- Meio: a cama com travesseiros altos e uma colcha de retalhos rosa; o criado-mudo com um abajur aceso (a luz da cena, âmbar), o copo com a flor da Rosa e o caderno "Receitas da Rosa"; a cadeirinha da Bia.
- Frente: a grade do pé da cama, escura, embaixo.

**Cena 6, `despedida`** — `cam` de `[560,400,2]` para `[575,330,2]`; `clima` `triste`; `pRM` 0,7.
- p 0 a 0,2: o close está nas mãos dadas. A Rosa está recostada, sem a flor no cabelo.
- p 0,2 a 0,4: a câmera sobe para os rostos. A Rosa pega o caderno e o põe nas mãos da Bia. Fala da Rosa em 1,6 s.
- p 0,6: a Bia abraça o caderno. Fala em 4,2 s.
- p 0,75 a 1: a Rosa passa a mão no rosto da Bia e sorri de olhos fechados. O escuro da saída dura 0,8 s.

**Cena 7, `janela`** — a cozinha de casa em `modo` `'noite'` (tudo apagado, azul; a panela emborcada no escorredor, o avental no gancho, o banquinho vazio no centro, a foto da Rosa e o copo com a flor na bancada). `cam` de `[610,300,1]` para `[700,280,1.35]` (parada até p 0,5); `clima` `triste`; `fx` `chuva` 0,2, `estrela` 3,9.
- p 0 a 0,4: chuva na janela (riscos) e nada se mexe, a não ser a cortina.
- p 0,4 a 0,55: a chuva para e as nuvens abrem.
- p 0,55: acende uma estrela na janela. Um facho azul-claro desce dela até a foto, que ganha um brilho.
- p 0,65 a 1: a Bia criança entra pela porta, sobe no banquinho e olha a estrela, de costas para a câmera.

**Cena 8, `promessa`** — começa no quadro final da 7. `cam` de `[700,280,1.35]` para `[650,290,1.6]` (abre até 1,1 em p 0,5 e fecha no rosto); `clima` `esperanca`; `fx` `panela` 3,4, `estrela` 6,8.
- p 0 a 0,35: o tempo passa. Na janela, o céu vira dia e noite três vezes, e a luz da cozinha acompanha; as folhas do calendário caem; a planta do vaso cresce; a Bia criança dá lugar à Bia adulta (as duas se fundem num brilho em p 0,3).
- p 0,35: é noite de novo, mas a cozinha está em `modo` `'lar'`: a luz acesa, âmbar, a panela no fogo, a foto da Rosa agora na parede.
- p 0,4 a 0,6: a Bia adulta (roupa 1) abre o caderno "Receitas da Rosa" e passa o dedo na página.
- p 0,6: ela ergue os olhos para a estrela. Fala em 4,6 s.
- p 0,85: a estrela pisca em resposta, e a Bia sorri.

## 9. v11.14 — A virada, a troca e a limpeza: 9, 10 e 11 (sessão 9d)
**Cena 9, `tio`** — a rua da Casa Aurora em `modo` `'tarde'`. `cam` de `[760,320,1.2]` para `[420,320,1.2]`; `clima` `esperanca`.
- p 0,15 a 0,35: o Tonhão sai pela porta, tira o avental vinho da Casa Aurora, pendura na maçaneta e solta os ombros. A touca fica.
- p 0,35 a 0,6: ele atravessa a rua; a câmera vai junto. Na outra calçada, a Bia espera com o caderno.
- p 0,4: ele arregaça as mangas. Fala em 2,4 s.
- p 0,8 a 1: a Bia sorri e abraça o tio.

**O cenário "banco"** (`ab2Banco(c,cam)`), por dentro:
- Fundo: parede com lambri de madeira, duas colunas, um relógio grande, o letreiro "Banco".
- Meio: o balcão alto de madeira com o guichê de grade dourada; atrás, a gerente (uma pessoa do jogo, de óculos e blazer); em cima do balcão, o papel e o carimbo; piso de mármore em xadrez; a Bia diante do balcão, pequena perto dele, com o pote de moedas num braço e a planta da garagem enrolada no outro.
- Frente: os pilaretes dourados da fila com o cordão vermelho, embaixo.

**Cena 10, `banco`** — `cam` de `[600,310,1]` para `[640,300,1.9]`; `clima` `esperanca`; `fx` `carimbo` 3,3.
- p 0 a 0,5: a Bia espera; as mãos tremem (1 px). Fala em 0,8 s. A gerente lê o papel, séria.
- p 0,55: o carimbo desce. O quadro treme 4 px por 0,2 s (sem tremor com movimento reduzido) e a câmera fecha no papel: "APROVADO", em verde.
- p 0,7 a 1: a Bia solta o ar e sorri; a gerente sorri também.

**O cenário "rua de casa, à noite"** (`ab2RuaCasa(c,cam,k)`, com `k` de 0 a 1, o portão aberto):
- Fundo: céu `AB_COR.noite` para `AB_COR.noite2`, com muitas estrelas pequenas e a estrela da Rosa, maior; casas vizinhas em silhueta, com janelinhas acesas; uma árvore.
- Meio: a casa da Rosa com a garagem (o telhado vermelho de hoje), o portão de enrolar, o letreiro "Lanchonete Corre-Corre" em cima, apagado, dois vasinhos, um poste; a calçada e a rua.
- Com `k`: o portão sobe e a luz quente sai, primeiro por baixo; um leque dourado se abre na calçada; lá dentro, o balcão e as mesinhas vermelhas.

**Cena 11, `portao`** — `cam` de `[560,340,1.5]` para `[610,300,1]`; `clima` `fim`; `fx` `portao` 3,6, `estrela` 6,4; `titulo` `O sonho da Bia`.
- p 0 a 0,3: a Bia (roupa 1) e o Tonhão diante do portão, de costas em três quartos. Ela estende a mão para o portão e recua; olha a foto da mãe na outra mão.
- p 0,27: o Tonhão põe a mão no ombro dela. Fala em 2,2 s.
- p 0,45 a 0,65: ela ergue o portão; a luz inunda a calçada e a câmera abre.
- p 0,7: o letreiro acende, letra por letra.
- p 0,8: a estrela da Rosa pisca forte. O título entra em p 0,82, em cima. A legenda entra em 4,6 s.

**A troca:** a abertura nova vira a oficial (`ABERTURA`), a antiga sai do jogo (as 10 cenas e os desenhos que só elas usavam; o que o `FINAL` usa fica), a entrada "Abertura nova (em obras)" some do modo dev e a "Abertura" passa a tocar a nova. O `FINAL` continua na faixa de legenda antiga.

## 10. Para todas as sessões
- **Conferir pela captura.** Cada cena é tirada em três momentos (p 0,25, 0,6 e 0,9), mais o celular deitado (844 x 390), e olhada em recorte ampliado contra a direção de arte (§3). Se a cena não estiver bonita, refaça antes de fechar; se depois de duas tentativas ainda não estiver, avise o usuário e sugira um modelo mais forte.
- **O usuário assiste a cada sessão** pelo modo dev (aba das cenas, "Abertura nova (em obras)") e pode pedir ajustes, que entram como versão de correção com spec enxuta ou pelo editor de desenhos.
- **O `FINAL` não muda** em nenhuma das quatro versões: os smokes do final passam sem alteração.
- **Movimento reduzido:** quadro parado em `pRM`, câmera em `para`, sem transição, sem tremor; só o toque avança.
