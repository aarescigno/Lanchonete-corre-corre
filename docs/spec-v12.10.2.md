# v12.10.2 — A cozinha nova de cada ponto e o Caderno da Rosa (etapa 18c)

**Situação:** aprovada
**Origem:** a mesma entrevista da v12.10 (21 e 22/11): "Fala na chegada", "O caderno da Rosa" ("Achado na mudança"), "Eu escrevo, você aprova". O tio disse no cap. 4 (`docs/ARCO.md` §4.2): "a Rosa fazia um pastel que era uma beleza. Eu nunca aprendi."

## Objetivo
Em cada ponto novo, o Tonhão diz em voz alta o que o jogador já sente no fogão: aquela cozinha é nova para ele. Na mudança para a área industrial, ele acha o caderno de receitas da Rosa, e cada curso feito abre uma página dele no Manual, com uma frase dela e a receita. As últimas páginas a Rosa deixou só com o título, e quem escreve as receitas é o Tonhão.

## Fora do escopo
- As outras conversas do arco: nada muda. A conversa `caderno` (o caderno do **caixa**, `docs/ARCO.md` §6.3) continua e não tem a ver com este.
- O molho e o Prato da Rosa: o caderno não fala deles (são o segredo do arco).
- Desenho novo de cena: a conversa usa o balão e os retratos de sempre.

## Regras (decisões tomadas)
### As conversas da chegada (motor `ARCO`, `docs/ARCO.md` §6.1)
- Três entradas novas, cada uma **a primeira da lista do seu `nivel`** (toca antes das outras daquele ponto), com `quando: (sv, g) => diaNoPonto(sv) >= 1` (o fim do primeiro dia no ponto). Só no Modo História, como todo o `ARCO`.
- **Save antigo** (sem as entradas em `save.arco`): a do ponto atual nasce `1` (já vista) se `diaNoPonto(sv) > 3`; as de pontos anteriores, `1`, como manda o motor.
- **`cozinhaNova2`** (`nivel` 2):
  - tonhao (abrindo uma caixa da mudança): Ué... isso veio no meio das panelas.
  - bia [alegre]: O caderno da mãe!
  - tonhao [insegura] (folheando): Letra da Rosa. Pastel, salgado, tudo anotado... e eu achando que sabia.
  - tonhao: O povo da estrada quer lanche grande. X-tudo, carne-seca. Isso aqui é novo pra mim, Bia.
  - bia [firme]: Na garagem você também não sabia pastel, tio, e aprendeu. Tem curso no Cardápio da lojinha.
  - tonhao [alegre]: ...Panela nova, tempero velho. Bora.
- **`cozinhaNova3`** (`nivel` 3):
  - tonhao [insegura] (olhando o fogão novo): Coifa, forno de restaurante... Panqueca, Bia? Eu sou de pastel.
  - bia [firme]: Então faz panqueca do jeito que faz pastel: no capricho. Deixa comigo.
  - tonhao (folheando o caderno): A Rosa anotou uma de panqueca. Nunca vi ela fazer.
  - bia: A gente aprende junto. O curso tá no Cardápio da lojinha.
  - tonhao: Até lá, vai sair devagar.
  - bia [alegre]: Devagar e sempre. Foi você que me ensinou.
- **`cozinhaNova4`** (`nivel` 4):
  - tonhao [insegura] (de avental limpo demais): Molho de vinho, folhado, croquete de costela... Aqui eu sou aprendiz de novo, Bia.
  - bia [firme]: Aprendiz que me trouxe da garagem até aqui.
  - bia: Aqui dá pra estudar de manhã e de noite. Tá no Cardápio da lojinha.
  - tonhao (abrindo o caderno no fim): As últimas páginas a Rosa deixou em branco. Só o título: "Quando a gente tiver casa grande".
  - bia [alegre]: Então quem escreve é você, tio.
  - tonhao [alegre] (pegando a caneta, de costas): ...Cebola. É a cebola.

### O Caderno da Rosa (Manual)
- **Aba nova** `['caderno', 'Caderno']` no fim de `MANUAL_ABAS`, visível do primeiro dia na área industrial em diante (com ou sem o Modo História; no modo dev, sempre).
- **Uma página por degrau** com o básico feito (ou incluído; no `pf` da área industrial, com o avançado Carnes variadas), na ordem da carreira: Garagem, área industrial, Avenida, Terraço e, dentro do ponto, a ordem dos cursos. Os degraus da Garagem feitos antes de achar o caderno aparecem todos de uma vez. A página nova acende o "novo" da aba, como as fichas do Manual.
- **Página:** o nome do degrau (o do cartão) como título, a frase da Rosa entre aspas e em itálico, e a receita em texto corrido, sem números. Nas páginas do Terraço, a frase é o que a Rosa escreveu sob o título "Quando a gente tiver casa grande", e a receita leva antes **"Na letra do Tonhão:"**.
- **As 25 páginas** (constante `CADERNO`, chave `técnica.ponto`):

  | página | frase da Rosa | receita |
  |---|---|---|
  | `pastel.garagem` | "Massa boa estala. Se não estalou, o Tonhão comeu a de teste." | Massa de farinha, óleo e um gole de cachaça. Recheio frio, borda apertada com o garfo, óleo bem quente. |
  | `chapa.garagem` | "Quem tem pressa espera o chiado." | Pão francês aberto, manteiga dos dois lados, presunto e queijo, prensa até o queijo escorrer. |
  | `fritos.garagem` | "Coxinha boa se segura pelo bico e não desmancha." | Massa cozida no caldo do frango, recheio desfiado com cheiro-verde, ovo e farinha de rosca. |
  | `pastel.industrial` | "Caminhoneiro come com uma mão. Fecha bem." | Pastel grande, recheio farto de frango com catupiry ou carne-seca com queijo, borda dobrada duas vezes. |
  | `chapa.industrial` | "Hambúrguer se aperta uma vez só. Quem aperta de novo tira o suco." | Bola de carne moída na chapa, sal por cima, queijo no fim, pão tostado na gordura dela. |
  | `fritos.industrial` | "Carne-seca vai de molho na véspera. Quem esquece come sal." | Carne-seca dessalgada e desfiada, mandioca amassada por fora; salsicha enrolada em massa de pão. |
  | `assados.industrial` | "Massa podre é da minha mãe. Não conta pro Tonhão da manteiga gelada." | Manteiga gelada esfarelada na farinha, gema por cima, forno forte até dourar. |
  | `veg.industrial` | "Prato sem carne tem que ter cor. Se ficou bege, faltou coisa." | Legume refogado no alho, ovo da casa; palmito e abóbora no lugar da carne nos salgados. |
  | `pf.industrial` | "Bife a cavalo: o ovo vai mole. Ovo duro é castigo." | Bife batido, frango grelhado, peixe frito na farinha de milho, ovo frito por cima de quem pedir. |
  | `pastel.avenida` | "Panqueca é pastel que deitou pra descansar." | Massa mole de leite e ovo, frigideira fina e untada, enrola o recheio, molho por cima e forno para gratinar. |
  | `chapa.avenida` | "Beirute é sanduíche que viajou." | Pão sírio na chapa, rosbife, queijo, tomate e orégano; coalho na chapa até fazer casquinha. |
  | `fritos.avenida` | "Peixe frito não se mexe. A casquinha se forma sozinha." | Isca no limão e no alho, farinha de trigo e de rosca, óleo quente e pouco de cada vez. |
  | `assados.avenida` | "A torta de domingo da Casa Aurora. A fila dobrava a esquina." | Massa podre por baixo e por cima, frango cremoso ou palmito, gema por cima, forno devagar. |
  | `veg.avenida` | "Escondidinho de abóbora: o Tonhão nunca percebeu que não tinha carne." | Purê de mandioca por cima, abóbora com cebola e cheiro-verde por baixo, queijo para gratinar. |
  | `pf.avenida` | "Strogonoff é fogo baixo e paciência. Creme de leite só no fim." | Carne em tiras selada aos poucos, cebola, mostarda e tomate, creme de leite no fim, batata palha na hora. |
  | `restaurante.avenida` | "Filé batido fino e empanado com calma. O resto, um dia eu te conto." | Filé batido, empanado duas vezes, molho de tomate de panela e queijo gratinado na hora. |
  | `pastel.terraco` | "Ravioli igual ao da cantina do centro." | Na letra do Tonhão: massa fresca de ovo aberta fina, recheio de queijo ou de camarão, fecha com dois dedos e frita rápido. |
  | `chapa.terraco` | "Pão de padaria de bairro chique. Um dia eu aprendo o fermento." | Na letra do Tonhão: pão de fermentação natural tostado, presunto cru, coalho dourado com melaço de cana. |
  | `fritos.terraco` | "Costela que desmancha no garfo. Um dia eu tenho tempo pra isso." | Na letra do Tonhão: costela cozida devagar até desfiar, massa de batata, empanada e frita de pouquinho. |
  | `assados.terraco` | "Massa folhada, que eu nunca tive paciência de dobrar." | Na letra do Tonhão: massa dobrada várias vezes com manteiga gelada, brie ou camarão por dentro, forno forte. |
  | `veg.terraco` | "Nhoque de abóbora com sálvia. Vi numa revista." | Na letra do Tonhão: abóbora assada e amassada com farinha, nhoque cortado no garfo, manteiga com sálvia; polenta mole com legume grelhado. |
  | `pf.terraco` | "Molho de cogumelo, pra quem come de guardanapo no colo." | Na letra do Tonhão: escalope selado em fogo alto, cogumelo na manteiga, um pouco de vinho branco e creme para encorpar. |
  | `restaurante.terraco` | "Filé ao molho de vinho. Esse eu quero aprender antes do Bráulio." | Na letra do Tonhão: filé alto selado, vinho tinto reduzido devagar com cebola, manteiga gelada no fim para brilhar. |
  | `entradas.terraco` | "Entrada é o bom-dia da mesa." | Na letra do Tonhão: bruschetta de tomate e manjericão, bolinho de bacalhau cremoso, quiche de alho-poró na massa fina. |
  | `alta.terraco` | "Prato bonito também alimenta. Primeiro o olho." | Na letra do Tonhão: risoto mexido sem parar, peixe do dia na manteiga de ervas, medalhão ao molho madeira, tudo empratado na hora. |

- **Visual da aba:** fundo creme com linhas finas de caderno, a frase da Rosa em itálico na cor do texto e a receita do Terraço numa cor de caneta azul (`--caneta` nos tokens claro e escuro do CSS); o resto como as fichas do Manual.
- **Modo dev:** as três conversas entram na lista de conversas para assistir pelo motor (`Arco: cozinhaNova2` etc.); com o modo dev ligado, a aba Caderno mostra as 25 páginas.
- **Save:** só as entradas novas em `save.arco`; as páginas saem dos cursos (`save.cursos`), sem campo novo. O "novo" da aba usa o mesmo registro de vistos das fichas do Manual.
- **Versão:** `VERSAO` e `vtag` em v12.10.2; linha no `#ov-ver`: **"O Tonhão estranha a cozinha de cada ponto novo e acha o caderno de receitas da Rosa: cada curso abre uma página no Manual."**
- **`docs/ARCO.md`:** seção nova "13. v12.10.2 — A cozinha nova e o Caderno da Rosa (etapa 18c)" com as três conversas e a lista das páginas (cópia desta spec).

## Critérios de aceite
- **CA1** No Modo História, o fim do primeiro dia na área industrial marca `cozinhaNova2` como `'pend'` antes de qualquer outra entrada de `nivel` 2; na Avenida, `cozinhaNova3`; no Terraço, `cozinhaNova4` → `smoke119` (1)
- **CA2** Save antigo no 5º dia da Avenida, sem as entradas: `cozinhaNova3` nasce `1` e não toca; no 2º dia, nasce `0` → `smoke119` (2)
- **CA3** Na Garagem não há aba Caderno; na área industrial há, com uma página por degrau da Garagem já feito → `smoke119` (3)
- **CA4** Comprar o Pastel de estrada abre `pastel.industrial` e acende o "novo" da aba → `smoke119` (4)
- **CA5** As páginas do Terraço levam "Na letra do Tonhão:" antes da receita; as outras não → `smoke119` (5)
- **CA6** Modo dev: a aba mostra 25 páginas; as três conversas aparecem na lista de conversas → `smoke119` (6)
- **CA7** Nenhum texto do caderno tem algarismo → `smoke119` (7)
- **CA8** A aba Caderno no claro e no escuro, com uma página da Garagem e uma do Terraço → captura `shot_v12_10_2.js`: recorte da página com a frase e a receita em azul
- **CA9** O painel do Manual com a aba nova cabe nas 14 telas → `python3 menu_fit.py`

## Partes
- `src/10-constantes.js`: `ARCO` (3 entradas no começo de cada `nivel`), `CADERNO`, `MANUAL_ABAS`.
- `src/12-clientes.js`: `normSave` (save antigo das entradas novas).
- `src/40-interface.js`: `buildManual` (a aba e as páginas), `temNovo`.
- `src/01-estilo.css`: o visual da página e o token `--caneta`.
- `docs/ARCO.md`: a seção 13.

## Tarefas
- [ ] T1 `smoke119` com os critérios CA1 a CA7 (falhando).
- [ ] T2 As três conversas no `ARCO` e o save antigo.
- [ ] T3 `CADERNO` e a aba no Manual (páginas pelos cursos, "novo", modo dev).
- [ ] T4 Visual da página; `shot_v12_10_2.js` e conferência no claro e no escuro.
- [ ] T5 `docs/ARCO.md` seção 13.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge.

## Testes
- `smoke119` novo (7 checagens). `shot_v12_10_2.js` novo. `menu_fit.py`.

## Decisões em aberto
Nenhuma (fechada em 22/11: os textos aprovados como estão).

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (textos prontos, aba nova no molde das fichas)
