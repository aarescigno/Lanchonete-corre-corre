# v12.7 — Cardápio de verdade em cada ponto (etapa 16a)

**Situação:** entregue em 20/11
**Origem:** conversa de 19/11 com o usuário ("os preços têm que ficar mais realistas... sem PF no terraço"), entrevista na mesma sessão

## Objetivo
Cada ponto vende o que um lugar daquele vende de verdade, a preço de verdade (não precisa ser exato, mas não pode ficar longe). A Garagem e a área industrial continuam lanchonete: PF, salgados, chapa e pastel. A Avenida vira restaurante brasileiro executivo e o Terraço, cozinha fina, sem PF, coxinha nem pastel. Os cursos do Tonhão viram técnicas que valem em todo ponto: quem aprendeu a fritar frita coxinha na Garagem, mandioca na Avenida e croquete no Terraço. A carreira rende parecido com hoje.

## Fora do escopo
- Desenhos próprios dos pratos novos: nesta versão, cada prato novo usa o desenho da categoria com cor própria (como o risoles e o kibe já fazem). Os desenhos próprios vão na v12.8 (etapa 16b), junto com os da barraca chique da festa junina.
- Mudar o que cada tipo de cliente gosta (`GOSTOS`), os tempos de cozinha e as regras da refeição completa do Terraço.
- O Turno sem fim e a Missão zero (ficam na Garagem, com os preços dela).

## Regras (decisões tomadas)
- **Sem multiplicador:** sai o `cardapio` de `PONTOS`. Cada prato tem o preço escrito por ponto em que é vendido: `preco:{ garagem:30, industrial:34 }` (campo `preco` vira objeto com os ids de `PONTOS`). `precoPrato(k, ponto, cursos)` lê `CARDAPIO[k].preco[ponto.id]` e continua somando o `CURSO_AV.preco` (+15%) do curso avançado, arredondado ao real. O `barracaPreco` da festa junina passa a ler `EVENTOS.junina.barraca.preco[ponto.id]`.
- **Onde cada prato é vendido:** prato de lanchonete só na Garagem e na área industrial; prato da Avenida só na Avenida; prato do Terraço só no Terraço. Quem diz é a chave de `preco` (o prato é vendido no ponto que tem preço). `pratoSabido(k, cursos, ponto)` passa a pedir o ponto: um prato sem preço no ponto não é sabido ali. Quem chama sem ponto (Turno sem fim, Missão zero, testes antigos) usa a Garagem.
- **Curso é técnica:** cada curso (`CURSOS`) continua o mesmo, com o mesmo nome e preço na lojinha. O prato novo leva no `curso:` o id da técnica, e o curso, feito uma vez, ensina os pratos dela em todo ponto. O avançado vale para os pratos da técnica em todo ponto: `pratoAv` passa a olhar o `curso` do prato (e o PF de base, `curso:null`, conta como da técnica `pf`; a coxinha, como hoje, sobe com o avançado de fritos). A lista `av.pratos` sai.
- **O prato de base do ponto** (o que se sabe sem curso, no lugar do PF): Garagem e industrial, o PF e a coxinha; Avenida, o executivo de frango e a mandioca frita; Terraço, o galeto e o dadinho de tapioca. Tudo que hoje cai no `'pf'` de sobra (vegetariano sem opção, a marmita `RETIRADA.prato`, o fallback do `pedePrincipal`) passa a cair no prato de base do ponto (`pratoBase(ponto)`). A marmita da Avenida é o executivo de frango na embalagem.
- **Cardápio por ponto** (2 pratos por técnica nos pontos novos; preços em R$, sem o avançado; `cat` é a categoria do gosto e da cozinha, igual à de hoje):

  Garagem → área industrial (os mesmos pratos, uns 12% acima, arredondado):
  | Prato | Garagem | Industrial |
  |---|---|---|
  | PF | 30 | 34 |
  | Coxinha | 10 | 11 |
  | Risoles | 7 | 8 |
  | Kibe | 8 | 9 |
  | Bolinho japonês | 10 | 11 |
  | Empada | 11 | 12 |
  | Esfiha aberta / fechada | 8 | 9 |
  | Misto quente | 12 | 13 |
  | Bauru | 14 | 16 |
  | Pão na chapa | 8 | 9 |
  | Pastel de carne / queijo | 12 | 13 |
  | Pastel de pizza | 13 | 15 |
  | PF vegetariano / vegano | 28 | 32 |
  | Empada de palmito | 11 | 12 |
  | Kibe de abóbora | 8 | 9 |
  | Coxinha de jaca | 10 | 11 |
  | Pastel de palmito | 12 | 13 |
  | Esfiha de soja | 8 | 9 |
  | Misto vegano | 12 | 13 |

  Avenida Brasil (restaurante executivo):
  | Técnica | Prato (cat) | R$ |
  |---|---|---|
  | base (PF) | Executivo de frango grelhado (pf) | 39 |
  | base (PF) | Strogonoff de carne (pf) | 44 |
  | base (fritos) | Mandioca frita (frito, vegana) | 26 |
  | fritos | Isca de peixe (frito) | 36 |
  | assados | Torta de frango (assado) | 22 |
  | assados | Empadão de palmito (assado, veg) | 22 |
  | chapa | Beirute (chapa) | 38 |
  | chapa | Queijo coalho na chapa (chapa, veg) | 24 |
  | pastel (massas) | Panqueca de carne (pastel) | 34 |
  | pastel (massas) | Panqueca de espinafre (pastel, veg) | 32 |
  | veg | Executivo vegetariano (pf, pfv) | 36 |
  | veg | Escondidinho de abóbora (assado, veg) | 34 |
  | veg avançado | Executivo vegano (pf, pfv, vegano) | 36 |
  | veg avançado | Moqueca de banana-da-terra (pf, pfv, vegano) | 42 |
  | restaurante | Filé à parmegiana (pf) | 58 |

  Terraço Suíça (cozinha fina; os principais são `cat:'pf'`, as entradas, as outras categorias):
  | Técnica | Prato (cat) | R$ |
  |---|---|---|
  | base (PF) | Galeto com legumes (pf) | 72 |
  | base (PF) | Escalope ao molho de cogumelos (pf) | 78 |
  | base (fritos) | Dadinho de tapioca (frito, veg) | 32 |
  | fritos | Croquete de costela (frito) | 38 |
  | assados | Folhado de brie (assado, veg) | 36 |
  | assados | Empadinha de camarão (assado) | 38 |
  | chapa | Queijo coalho com melaço (chapa, veg) | 32 |
  | chapa | Crostini de presunto cru (chapa) | 36 |
  | pastel (massas) | Pastelzinho de camarão (pastel) | 38 |
  | pastel (massas) | Ravioli frito de queijo (pastel, veg) | 34 |
  | veg | Nhoque de abóbora na sálvia (pf, pfv) | 62 |
  | veg | Polenta com legumes grelhados (pf, pfv) | 58 |
  | veg avançado | Curry de grão-de-bico (pf, pfv, vegano) | 62 |
  | veg avançado | Moqueca de palmito (pf, pfv, vegano) | 64 |
  | restaurante | Filé ao molho de vinho (pf) | 92 |
  | entradas finas | Bruschetta / Bolinho de bacalhau / Quiche de alho-poró | 34 / 42 / 38 |
  | alta gastronomia | Risoto de cogumelos / Peixe do dia / Medalhão ao molho madeira | 82 / 94 / 108 |
  | Lia (autor) | Risoto de feijão-manteiguinha | 88 |

  A regra do prato fino do Terraço (sabendo um fino, só os finos) continua, com os finos de hoje (entradas finas e alta gastronomia). A parmegiana sai do Terraço (lá a técnica do restaurante dá o filé ao molho de vinho). O risoto da Lia continua acima do risoto de cogumelos (regra do CA10 da v12.5).
- **Bebidas e doces com preço por ponto** (Garagem / industrial / Avenida / Terraço; "—" onde não existe):
  | Item | G | I | A | T |
  |---|---|---|---|---|
  | Cafezinho (`coffee`) | 4 | 4 | 6 | 8 |
  | Suco na mesa (`juice`) | 8 | 9 | 12 | 18 |
  | Bebida da espera | água 0 | suco 8 | saborizada 9 | coquetel 24 |
  | Espresso / cappuccino (Joca) | — | 8 / 12 | 8 / 12 | 10 / 15 |
  | Cafés especiais (Joca) | — | — | — | 24 |
  | Doce caseiro / gourmet / alta confeitaria | 9 | 9 | 22 | 44 |
  | Drink clássico / de autor (Anselmo) | — | — | 42 | 42 / 56 |

  O doce passa a ter o preço do ponto (o caseiro na Garagem e na industrial, o gourmet na Avenida, a alta confeitaria no Terraço), seguindo o que a confeitaria sabe: sem a confeitaria do ponto, sai o doce do nível abaixo, ao preço dele. O custo de ingrediente de cada item fica na mesma proporção do preço de hoje. `DRINK_PRICE` (o custo de jogar fora) segue os preços novos.
- **Festa junina por ponto:** Garagem e industrial, a barraca de hoje (Pamonha 10, Milho cozido 8, Canjica 9; barraca R$ 40). Avenida, "Arraiá da Avenida": Curau 14, Milho com queijo coalho 16, Bolo de fubá com goiabada 14 (barraca R$ 80). Terraço, "Arraiá do Terraço": Creme de milho com crocante 26, Pamonha de queijo com mel 24, Canjica de coco com cumaru 26 (barraca R$ 150). Desenho nesta versão: o da barraca de hoje, com cor própria.
- **Falas:** `AVAL_POUCO` ("Só tem PF e coxinha?") só na Garagem e na industrial. Na Avenida e no Terraço, o elogio `bom` da comida sem "PF": "O prato estava caprichado!" no lugar de "O PF estava caprichado!".
- **Balanceamento ("manter a curva"):** antes de mudar preço, medir na v12.6.1 o ganho do dia (bot, `EQUIPE=auto`, 40 rodadas) e a taxa de metas em cada ponto; depois, cada ponto fica com o ganho do dia a ±15% do medido e as metas no alvo de hoje (Garagem sem equipe 40–70%, com equipe 85–95%; industrial, Avenida e Terraço 85–95%). Para chegar lá, mexa nesta ordem e só no que precisar: `metaF`/`expertF` do ponto, depois o `aluguel`, depois a chance do 2º item (`MAIS`). Salários e preços da lojinha não mudam. A carreira (`node carreira.js`, `DIAS=65`) continua fechando a história como hoje (registrar o dia em que fecha).
- **Modo dev:** no painel, o cardápio do ponto atual com o preço de cada prato (só leitura) e o botão "Saber tudo do ponto" (liga todos os pratos vendidos no ponto, sem comprar curso). A troca de ponto do modo dev já existe e passa a trocar o cardápio.
- **Manual:** a ficha de cada curso diz o que a técnica faz em cada ponto em uma frase, sem números (ex.: Fritos: "Na lanchonete, salgados; na Avenida, porções; no Terraço, entradas fritas"). `MANUAL_CATS.pf` passa a "prato principal".
- **Save:** nenhum campo novo (`save.cursos` continua igual). O save da v12.6.1 carrega e, num ponto novo, a cozinha já sabe os pratos novos pelas técnicas feitas.

## Critérios de aceite
- **CA1** Nenhum prato tem preço sem ponto e `PONTOS` não tem mais `cardapio` → `smoke109` (1)
- **CA2** Na Garagem e na industrial, os pratos sabidos são os da lanchonete e os preços batem com a tabela (PF 30 e 34) → `smoke109` (2)
- **CA3** Na Avenida, sem curso nenhum, os pedidos saem só do executivo de frango, do strogonoff e da mandioca; nenhum pedido de PF, coxinha ou pastel em 200 grupos sorteados → `smoke109` (3)
- **CA4** No Terraço, com todos os cursos, nenhum pedido de PF, PF vegetariano, parmegiana, coxinha ou pastel em 200 grupos; o principal sai dos pratos `cat:'pf'` do Terraço → `smoke109` (4)
- **CA5** Técnica: com só o curso de fritos, a Avenida sabe a isca de peixe e o Terraço o croquete; o avançado de fritos sobe em 15% o preço da isca → `smoke109` (5)
- **CA6** A marmita da Avenida é o executivo de frango; o vegetariano sem opção cai no prato de base do ponto → `smoke109` (6)
- **CA7** Bebidas, doces e barraca junina com os preços da tabela em cada ponto → `smoke109` (7)
- **CA8** Um save da v12.6.1 no Terraço carrega e o cardápio do dia tem pratos do Terraço → `smoke109` (8)
- **CA9** Metas por ponto no alvo e ganho do dia a ±15% do medido na v12.6.1 → `node balance.js 40` com `EQUIPE=auto` e `PONTO=industrial|avenida|terraco`
- **CA10** A carreira fecha a história → `node carreira.js` com `DIAS=65`, 6 carreiras: em todas
- **CA11** Os nomes cabem nos balões, no cartão Cardápio da lojinha e no resumo do Caixa → captura `shot_v12_7.js`: o balão do pedido com "Escalope ao molho de cogumelos" e o cartão Cardápio da Avenida

## Partes
- `src/10-constantes.js`: `CARDAPIO` (preço por ponto e os pratos novos), `CURSOS` (sai `av.pratos`), `pratoSabido`, `pratosSabidos`, `precoPrato`, `pratoAv`, `pedePrato`, `pedePrincipal`, `PONTOS` (sai `cardapio`), `RETIRADA.prato`, `BEBIDA_ESPERA`, `JUICE`, `DRINK_PRICE`, `DOCES`, `CAFES`, `DRINKS`, `EVENTOS.junina`, `AVAL`/`AVAL_POUCO`, `MANUAL`, `MANUAL_CATS`
- `src/12-clientes.js`: onde os pratos e extras são sorteados (passar o ponto)
- `src/16-jogo.js`: `barracaPreco`, o cardápio do dia (`cardapioNovo`), quem chama `pratosSabidos`
- `src/20-desenho-base.js`: o desenho por categoria aceitar os pratos novos (cor própria)
- `src/41-lojinha.js` e `src/40-interface.js`: o cartão Cardápio e as fichas do Manual
- O painel do modo dev (achar com `tests/mapa.sh dev`)

## Tarefas
- [x] T1 Medir a linha de base na v12.6.1 (ganho do dia e metas por ponto, `balance.js 40`, `EQUIPE=auto`) e anotar aqui em Testes.
- [x] T2 `smoke109` com os CA1 a CA8 (falhando).
- [x] T3 Preço por ponto em `CARDAPIO`, `precoPrato` sem multiplicador, `pratoSabido` com ponto, `pratoAv` pela técnica, `pratoBase`.
- [x] T4 Os pratos novos da Avenida e do Terraço e os da festa junina por ponto; sai a parmegiana do Terraço.
- [x] T5 Bebidas, doces e cafés com preço por ponto.
- [x] T6 Falas, Manual, cartão Cardápio e modo dev.
- [x] T7 Balanceamento até o CA9 e o CA10, na ordem da regra.
- [x] T8 Captura do CA11 (olhar e apagar).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- `CARDAPIO[k].preco` é lido em muitos lugares (`grep -n "CARDAPIO\[" src/`, 26 ocorrências): troque todos por `precoPrato` antes de virar objeto.
- O `'pf'` aparece fixo como sobra em `pedePrato`, `pedePrincipal` e `RETIRADA.prato`: todos passam por `pratoBase(ponto)`.
- Smokes antigos que conferem preço da Avenida ou do Terraço (ex.: parmegiana R$ 60, risoto da Lia R$ 52) mudam de número: corrija o número, não a checagem.

## Testes
- **T1, linha de base (v12.6.1, `balance.js 40`, `EQUIPE=auto`):** ganho do dia (média) e metas: Garagem dias 3 a 7 R$ 331 (95%); área industrial R$ 755 (86%); Avenida R$ 1.176 (88%); Terraço (comando da equipe toda com o bot afiado: `PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 CAMI=4 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 LIA=3`) R$ 3.371 (99%). O `EQUIPE=auto` sem a equipe toda dá 0% no Terraço, antes e depois.
- **`smoke109` novo (36 checagens, CA1 a CA8), no `run_all.sh`.** Smokes antigos com os números corrigidos (não as checagens): `smoke14`, `24`, `31`, `38`, `42`, `43`, `45`, `47`, `60`, `62`, `65`, `67`, `68`, `71`, `86` (painel Versões: 25 linhas), `98`, `106`; `menu_fit.py` (esperado 25 linhas; não rodou aqui: falta o `playwright` do Python).
- **Calibração final (CA9):** metas: Garagem 96% (ganho R$ 330, 0% do medido), área industrial `metaF` 2,3 → 1,5 e `expertF` 1,5 → 1 (88%), Avenida `metaF` 3,1 → 2,5 (88%; ganho R$ 1.144, −3%), Terraço `metaF` 8 → 18 e `expertF` 6 → 13,5 (~98% das metas e 3★ em ~55%, a 1ª noite da estrela ≥1★ em 67%). Ganho do dia fora dos ±15%: área industrial R$ 755 → ~R$ 510 (−32%) e Terraço R$ 3.371 → ~R$ 6.000 (+78%) (ver Desvios).
- **CA10 (`DIAS=80 node carreira.js 6`, 6 carreiras):** a história fecha em 6/6, no dia 66 (na v12.6.1: 6/6 no dia 60). Com `DIAS=65`: 3/6 no dia 61 (4/6 no dia 60 na v12.6.1). Lucro médio por dia na carreira: Garagem R$ 358 (377), industrial R$ 394 (681), Avenida R$ 1.198 (1.143), Terraço R$ 4.715 (2.414). Nenhum dia no negativo depois das mudanças.
- **CA11 (`shot_v12_7.js`):** conferidos em 844x390 e 568x320: as placas "Executivo R$ 39 · Mandioca R$ 26 · Cafezinho R$ 6" e "Galeto R$ 72 · Dadinho R$ 32 · Cafezinho R$ 8", o balcão de pratos do Terraço e da Avenida (escalope, filé ao molho de vinho, executivo, strogonoff e mandioca com o desenho da categoria e cor própria), o cartão Cardápio da Avenida (com o Arraiá da Avenida a R$ 80) e o do Terraço (Arraiá do Terraço a R$ 150). Capturas apagadas.

## Decisões em aberto
Nenhuma. (19/11: o usuário aprovou as tabelas de pratos e preços como estão e a divisão em duas versões: esta, com a lógica, os preços e o balanceamento; a v12.8, etapa 16b, com os desenhos próprios dos pratos novos e das barracas juninas chiques.)

## Desvios
- **Ganho do dia (CA9) fora dos ±15% na área industrial e no Terraço** (decisão do usuário em 20/11: aceitar a nova curva). Os preços da tabela tiram uns 24% do faturamento da área industrial (o PF deixou de ser R$ 45) e dobram o do Terraço (galeto R$ 72 contra R$ 39); as alavancas da spec (metas, aluguel, 2º item) não alcançam: o aluguel zerado da industrial devolve só R$ 120 por dia. Ficou só a calibração das metas (`metaF`/`expertF`); nada de `grupos`, aluguel nem `MAIS`. A carreira fecha mais tarde (dia 66 contra 60).
- **A festa junina no Terraço:** a barraca estava escondida no Terraço (`barracaVisivel` com `nivel < 4`) e o pedido do dia da festa ignorava a refeição completa (`!this.tempos`). Para o "Arraiá do Terraço" valer, as duas travas saíram; na refeição completa a barraca troca a entrada (ou pede uma a quem ficou sem). `smoke71` trocou a checagem "no Terraço não aparece" por "aparece como Arraiá do Terraço, a R$ 150". Nomes dos arraiás em `EVENTOS.junina.nomeBarraca`.
- **Desenho dos pratos juninos novos:** o `drawJunino` tem cores fixas; os 6 pratos novos reusam o desenho de um dos três (pamonha, milho ou canjica). Cor própria só nos pratos das outras categorias.
- **Sem `dep` nos pratos veganos e vegetarianos novos** (escondidinho, executivos, nhoque, polenta, curry, moquecas): a spec não pede; só os da v8.6.11 seguem com `dep`.
- **Novos nomes de função:** `pratoBase`, `fritoBase`, `precoCarta`, `vendeNoPonto`, `tecnicaDe`, `pratosCurso`, `pratosDoPonto`, `cafePreco`, `sucoPreco`, `sucoIngred`, `cafePrecoDe` (expostas em `window.__lcc`); `CURSOS[].pratos` e `av.pratos` saíram (`pratosCurso(id, ponto, nivel)`). `MARMITA.prato` ficou como estava (o "+ marmita" está desligado), mas o desenho e o `adiantar` já usam `pratoBase(ponto)`. `balance.js` e `carreira.js`: `CARDAPIO='{"pf":25}'` vale para todos os pontos.
- **Modo dev:** a seção "Cardápio do ponto" (aba Equipe e lojinha) lista os pratos com preço; "Saber tudo do ponto" liga `DEV.forca.saberTudo` (só na memória).
- **Ingredientes:** suco da mesa `sucoIngred` = R$ 3 × preço ÷ 8 (3, 3, 5, 7); suco da espera R$ 2, saborizada R$ 2, coquetel R$ 7; doces R$ 3, 6 e 10; cafés especiais R$ 6; drinks R$ 11 e R$ 14.
- **Manual:** a ficha `l-cardapio` ganhou a frase de cada técnica (a spec fala em "ficha de cada curso", que não existe): uma ficha só, sem números.

**Modelo:** Sonnet, esforço alto (muitas partes ao mesmo tempo e balanceamento por tentativa)
