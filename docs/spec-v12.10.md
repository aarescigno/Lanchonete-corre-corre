# v12.10 — Os cursos do Tonhão em degraus por ponto (etapa 18a)

**Situação:** rascunho
**Origem:** conversa de 21 e 22/11 (entrevista com o usuário; retorno no `docs/PROPOSTAS.md`, "os níveis do Tonhão"): "um curso [...] relativamente básico, tipo pastel, [...] quando ele avança [...] para uma Avenida Brasil ou [...] um terraço, ele não tem mais o mesmo impacto"; "é importante para mim que ele tenha que fazer novos cursos a cada nível [...] e não zerar tudo de uma vez na garagem ou na área industrial e o Tonhão ficar [...] congelado nos próximos"; "não ligo de ter que fazer grandes rebalanceamentos se isso for deixar o jogo mais legal".

## Objetivo
Cada ponto tem os seus cursos do Tonhão: a técnica que ele aprendeu na Garagem não ensina a cozinha da Avenida nem a do Terraço. Em cada ponto há cursos novos que valem a pena, porque trazem pratos ao cardápio e os dois níveis do Tonhão daquele ponto. Ninguém chega ao topo na Garagem, e o Tonhão evolui até o fim da carreira.

## Fora do escopo
- A decoração de cada ponto (Etapa 17, v12.9 e v12.9.1, planejada antes desta): executa antes da v12.10, e esta parte do `claude/main` com ela entregue.
- Os desenhos próprios dos 6 pratos de estrada, a lentidão do prato que ele estranha e o suor: **v12.10.1** (18b). Aqui o prato estranho já entra no cardápio, na velocidade normal, e os pratos de estrada usam o desenho do parecido (ver Regras).
- As falas da chegada a cada ponto e o Caderno da Rosa: **v12.10.2** (18c).
- O ajuste de preços dos cursos, das metas e dos alvos do bot: **v12.10.3** (18d). Aqui os valores são os de partida, e os smokes antigos que medem dinheiro só são corrigidos no que a regra nova muda.
- O Empratamento do nível 7 é **v12.10.1** (18b). Aqui o nível 7 tem só os números da tabela.
- Os cursos da Dani, do Joca, da Cami, do Anselmo e da Lia: nada muda (a Lia continua chegando com o básico das Entradas finas ou da Alta gastronomia, que agora são degraus do Terraço).

## Regras (decisões tomadas)
### Técnicas e degraus
- **Técnica** é o que o `curso` (ou o `tec`) do prato diz: `pastel`, `chapa`, `fritos`, `assados`, `veg`, `pf`, `restaurante`, `entradas`, `alta`. **Degrau** é a técnica num ponto. Cada degrau tem um **básico** (ensina os pratos) e um **avançado** (soma `CURSO_AV.preco`, ×1,15, ao preço dos pratos do degrau e `CURSO_AV.crit`, ×1,5, ao capricho deles, como hoje; nos vegetarianos, o avançado ensina os veganos, `nivel:2`, que continuam `semAv`).
- **O degrau do prato** é o primeiro ponto (na ordem de `PONTOS`) que o vende (`CARDAPIO[k].preco`). Os pratos da Garagem que a área industrial também vende continuam sendo do degrau da Garagem. Função nova `degrauDe(k)` devolve o id do ponto.
- **Saem da Garagem** (perdem o preço `garagem`, ficam só com o `industrial`): `empada`, `esfihaA`, `esfihaF`, `pfVeg`, `empadaPalmito`, `kibeAbobora`, `pfVegano`, `coxinhaJaca`, `pastelPalmito`, `esfihaSoja`, `mistoVegano`. A Garagem vende PF, coxinha, os 3 fritos, os 3 da chapa e os 3 pastéis.
- **Pratos de estrada** (novos, só `industrial`; `cor` a escolher pela execução no tom do parecido):

  | id | nome | preço | técnica | carne | desenho até a v12.10.1 |
  |---|---|---|---|---|---|
  | `pastelFrango` | Pastel de frango com catupiry | R$ 14 | `pastel` | sim | o do `pastel` |
  | `pastelCarneSeca` | Pastel de carne-seca com queijo | R$ 16 | `pastel` | sim | o do `pastelP` |
  | `xSalada` | X-salada | R$ 16 | `chapa` | sim | o do `bauru` |
  | `xTudo` | X-tudo | R$ 21 | `chapa` | sim | o do `bauru` |
  | `enroladinho` | Enroladinho de salsicha | R$ 8 | `fritos` | sim | o do `risoles` |
  | `bolinhoCarneSeca` | Bolinho de carne-seca | R$ 12 | `fritos` | sim | o do `bolinho` |

- **Os degraus, com nomes e preços de partida** (básico / avançado; nomes do cartão; ver Decisões em aberto, item 1, para a aprovação dos nomes):

  | técnica | Garagem | Área industrial | Avenida Brasil | Terraço Suíça |
  |---|---|---|---|---|
  | `pastel` | Pastel de feira R$ 150 / Pastel de feira de verdade R$ 300 | Pastel de estrada R$ 200 / Pastel de estrada recheado R$ 400 | Panquecas R$ 450 / Panqueca gratinada R$ 900 | Massas finas R$ 1.000 / Massa fresca da casa R$ 2.000 |
  | `chapa` | Chapa R$ 180 / Pão francês da padaria e requeijão de corte R$ 360 | Lanche de chapa R$ 240 / Hambúrguer de verdade R$ 480 | Chapa de restaurante R$ 500 / Beirute da casa R$ 1.000 | Chapa fina R$ 1.100 / Pão de fermentação natural R$ 2.200 |
  | `fritos` | Salgados fritos R$ 220 / Coxinha de massa de batata com catupiry R$ 440 | Fritos de estrada R$ 280 / Carne-seca desfiada na hora R$ 560 | Peixe empanado R$ 550 / Empanado crocante R$ 1.100 | Croquetes R$ 1.200 / Croquete de costela de 12 horas R$ 2.400 |
  | `assados` | — | Salgados assados R$ 250 / Massa podre da vó Nilza R$ 500 | Tortas R$ 550 / Torta de massa folhada R$ 1.100 | Folhados R$ 1.200 / Folhado na manteiga R$ 2.400 |
  | `veg` | — | Vegetariano R$ 150 / Pratos veganos R$ 300 | Vegetariano de restaurante R$ 400 / Veganos de restaurante R$ 800 | Vegetariano fino R$ 900 / Veganos finos R$ 1.800 |
  | `pf` | — (o PF é de base) | só o avançado: Carnes variadas R$ 400 | Molhos de panela R$ 600 / Carnes ao ponto R$ 1.200 | Molhos finos R$ 1.400 / Carnes nobres R$ 2.800 |
  | `restaurante` | — | — | Cozinha de restaurante R$ 700 / Parmegiana da casa R$ 1.000 | Molho de vinho R$ 1.500 / Redução de vinho da casa R$ 2.500 |
  | `entradas` | — | — | — | Entradas finas R$ 1.200 / Entradas de chef R$ 1.800 |
  | `alta` | — | — | — | Alta gastronomia R$ 1.800 / Menu do chef R$ 2.800 |

  Os textos `receita` dos avançados de hoje ficam nos degraus de onde vieram (Garagem: pastel, chapa, fritos; área industrial: assados, PF e veganos; Avenida: Parmegiana; Terraço: Entradas de chef e Menu do chef); os degraus novos não têm `receita` (o Caderno da Rosa, na v12.10.2, faz esse papel).
- **Cartões por ponto:** Garagem 6, área industrial 11, Avenida 14, Terraço 18 (contando os avançados).

### O que ele sabe fazer
- **Prato do degrau:** sabido com o básico do degrau (`cursos[t][ponto] >= 1`); os veganos (`nivel:2`), com o avançado. O `dep` dos vegetarianos (`kibeAbobora` precisa de `fritos` etc.) pede o básico de qualquer degrau da técnica do `dep` até o ponto atual.
- **O degrau novo inclui o antigo:** comprar o básico de um degrau dá também o básico dos degraus anteriores da técnica cujos pratos o ponto atual ainda vende (na prática, os degraus da Garagem de `pastel`, `chapa` e `fritos`, comprados na área industrial).
- **Prato que ele estranha** (`lento:true` no `CARDAPIO`, escolhido a dedo, um por técnica e ponto): sabido sem o básico do degrau dele desde que o Tonhão tenha o básico de algum degrau anterior da mesma técnica. No `pf`, a Garagem conta como degrau feito (o PF é de base). Na v12.10 ele sai como qualquer prato; a lentidão e o suor vêm na v12.10.1. Os escolhidos:
  - área industrial: `pastelFrango`, `xSalada`, `enroladinho`;
  - Avenida: `panqueca`, `coalho`, `isca`, `torta`, `execVeg`, `strogonoff`;
  - Terraço: `pastelCamarao`, `coalhoMel`, `croquete`, `empadinhaCam`, `polenta`, `escalope`, `vinho`.
- **Avançado nos pratos de base** (`curso:null` com `tec`: PF, coxinha, executivo de frango, mandioca, galeto, dadinho): o ×1,15 vale com o avançado da técnica do degrau do ponto atual **ou** do degrau do prato (exemplo: a coxinha na área industrial, com o avançado de fritos da Garagem ou o da área industrial).

### Lojinha (cartão Cardápio, `buildCursos`)
- Mostra só os degraus do ponto atual. O cartão do avançado só aparece depois que o básico do degrau foi comprado (no `pf` da área industrial, que só tem o avançado, ele aparece desde o começo). Degraus de pontos anteriores não comprados não aparecem.
- **Preço da troca:** quem tem o básico de um degrau anterior da técnica paga o preço do básico novo menos o preço do básico do degrau mais alto que já tem (exemplo: Panquecas R$ 450 com o Pastel de estrada feito: R$ 250). O avançado antigo não desconta. Sem degrau anterior, preço cheio. O avançado é sempre preço cheio. No botão, o preço que vai ser cobrado.
- A linha "+N de experiência" sai do cartão (a experiência deixa de existir).
- **Um curso por lojinha, dois no Terraço:** `cursoTrava` passa a contar as compras da lojinha (`save.cursoQt`, junto do `save.cursoDia`): o máximo é 1 na Garagem, na área industrial e na Avenida e 2 no Terraço (`CURSO_DIA = { 1:1, 2:1, 3:1, 4:2 }`, pelo `ponto.nivel`). O "Em curso" aparece quando o máximo foi atingido.
- `cursoMsg` continua "O Tonhão foi fazer o curso de <nome>!" e, se o nível novo ficou ao alcance, "Ele já pode subir para o nível N: pague o aumento no cartão dele." (N de 1 a 9 na tela, como hoje: índice + 1).

### Níveis
- `STAFF.tonhao.levels` passa a ter 9 níveis (0 a 8), todos com `slots:3` (pontos de partida; a v12.10.3 pode mexer em `cook`, `crit` e `wash` até ±10% e na `pay` até ±R$ 10 de cada valor, mantendo a ordem):

  | nível | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
  |---|---|---|---|---|---|---|---|---|---|
  | `cook` | 1 | 0,92 | 0,85 | 0,78 | 0,71 | 0,64 | 0,57 | 0,51 | 0,45 |
  | `crit` | 0,05 | 0,08 | 0,11 | 0,15 | 0,19 | 0,24 | 0,29 | 0,34 | 0,40 |
  | `wash` (s por pilha; 0 = não lava) | 0 | 0 | 0 | 7 | 5,5 | 4,5 | 3,5 | 3 | 2,5 |
  | `pay` (R$/dia) | 50 | 58 | 66 | 76 | 86 | 98 | 112 | 130 | 160 |

- **Nível ao alcance** (`tonhaoNivelAlc(cursos, ponto)`, no lugar de `tonhaoXp` e `tonhaoNivelXp`): no ponto de índice p (1 a 4), o nível 2p−1 vem com todos os básicos dos degraus do ponto, e o 2p com todos os básicos e todos os avançados. Vale o maior alcançado entre o ponto atual e os anteriores (os degraus de pontos anteriores, comprados ou incluídos, contam no ponto deles). Quem pulou cursos num ponto não fica preso: no ponto seguinte, fazer tudo de lá leva aos níveis de lá. O teto do ponto é 2p.
- **O aumento confirma o nível**, como hoje: o cartão do Tonhão tem o botão "Aumento: +R$ X/dia" quando o nível ao alcance passa do atual, e cada aumento sobe um nível (`setStaff('tonhao', eq.tonhao + 1)`). O `setStaff` recusa nível acima do ao alcance (fora do modo dev) e abaixo do atual, como hoje.
- **Cartão do Tonhão** (`src/41-lojinha.js`, perto da linha 382): o título fica "Tonhão · nível N de 9"; a barra mostra a fração de cursos feitos do próximo nível do ponto (básicos para o ímpar; básicos e avançados para o par), com o rótulo **"Cursos daqui"**; sem nada a fazer no ponto, **"Tudo o que tem aqui"**; no nível 8, "Nível máximo" como hoje.
- **Regras que usavam o nível de 0 a 4** (o nível k de antes vira o 2k): `AVAL.prato` passa a ter 9 faixas, `[[2.5,4.5],[2.75,4.6],[3,4.7],[3.25,4.85],[3.5,5],[3.65,5],[3.8,5],[3.9,5],[4,5]]`; `EXIGENTE.casa.nivel` de 3 para 6; o corte da folha (`folhaCorta`) desce um nível por vez, como hoje; a tabela de capítulos do modo dev (`HIST`, perto da linha 1421) passa `eq.tonhao` para o dobro (99 continua o máximo) e os `cursos` para o formato novo (Regras de Save).
- **Diversidade do cardápio no Gúgou** (`avalMenu`): o `porCurso` passa a contar as técnicas com ao menos um prato sabido no ponto atual (o prato que ele estranha conta), no lugar dos cursos básicos feitos.

### Turno sem fim
- O botão "Turno sem fim" (`#btn-endless`) e a aba "Turno sem fim" do painel do ranking (`data-v="semfim"`) somem fora do modo dev; o código fica, para voltar depois como extra. Com o modo dev ligado, os dois aparecem como hoje. A conta de botões do menu (`nbt`, `src/40-interface.js:51`) segue o que aparece. `CURSOS_SEMFIM` passa a `{ pastel:{ garagem:1 }, chapa:{ garagem:1 }, fritos:{ garagem:1 } }`.

### Modo dev
- **Degrau por técnica:** no painel, uma linha por técnica com um botão por ponto que gira 0 → básico → avançado → 0 (com o nome curto do ponto: "Gar", "Ind", "Av", "Ter"), mudando `save.cursos` direto (sem cobrar e sem o "incluir o antigo").
- **Forçar nível:** botões de 0 a 8 que põem `equipe.tonhao` no valor, ignorando o ao alcance e o teto, e a linha "Teto aqui: N · ao alcance: M".
- O "Saber tudo do ponto" continua.

### Manual
- `e-tonhao`: **"O chef. Em cada ponto, os cursos de lá ensinam pratos novos; com eles e com aumento, cozinha mais rápido, capricha mais e ajuda na pia."**
- `l-cardapio`: **"Cursos do Tonhão e da equipe. Cada ponto tem os seus: o básico ensina pratos, e o avançado, liberado depois do básico, deixa os pratos daquele curso mais caros e caprichados. Quem já fez o curso de um ponto paga menos pelo do seguinte. No ponto novo, o Tonhão já arrisca um prato de cada coisa que sabe."**

### Save
- `save.cursos` passa de `{ id: 1|2 }` para `{ id: { ponto: 1|2 } }` (exemplo `{ pastel:{ garagem:2, industrial:1 } }`). `normCursos` aceita só técnicas e pontos que têm degrau.
- **Save antigo** (sem `save.tonDeg`, convertido uma vez, com `save.tonDeg = 1`): `pastel`, `chapa` e `fritos` vão para `garagem`; `assados`, `veg` e `pf` para `industrial`; `restaurante` para `avenida`; `entradas` e `alta` para `terraco`. O nível vira `max(2 × nível antigo, nível ao alcance pelas regras novas)`, até 8; o jogador não perde força, e quem passar do teto do ponto fica onde está. O `save.tonXp` antigo é ignorado. `save.cardVisto` antigo é apagado (as chaves mudam para `id.ponto.nivel`).
- `save.cursoQt` novo (número de cursos do Tonhão comprados na lojinha de `save.cursoDia`).

### Versão
- `VERSAO` e `vtag` em v12.10; linha no `#ov-ver`: **"Cada ponto tem os seus cursos do Tonhão: pratos novos e dois níveis por ponto, até o nível 9. Na área industrial, os lanches de estrada."**

## Critérios de aceite
- **CA1** A Garagem não vende assados nem vegetarianos; a área industrial vende os 6 pratos de estrada com os preços da tabela → `smoke117` (1)
- **CA2** `degrauDe('pastel')` é `garagem`, `degrauDe('pastelFrango')` é `industrial`, `degrauDe('panqueca')` é `avenida` e `degrauDe('ravioli')` é `terraco` → `smoke117` (2)
- **CA3** Com só o básico de pastel da Garagem, na Avenida o Tonhão sabe a `panqueca` (estranha) e não a `panquecaEsp`; com o básico das Panquecas, sabe as duas → `smoke117` (3)
- **CA4** No `pf`, sem curso nenhum, o `strogonoff` é sabido na Avenida; o `escalope` no Terraço só com algum degrau de `pf` feito → `smoke117` (4)
- **CA5** Na área industrial, sem o pastel da Garagem, comprar o Pastel de estrada cobra R$ 200 e dá o básico dos dois degraus; com o da Garagem, cobra R$ 50 → `smoke117` (5)
- **CA6** Na Avenida, a lojinha mostra só os 7 básicos (sem degraus de outros pontos); o avançado de um degrau só aparece depois do básico → `smoke117` (6)
- **CA7** Na Garagem, com os 3 básicos, o nível ao alcance é 1; com os 3 avançados também, 2; nada mais na Garagem passa do 2 → `smoke117` (7)
- **CA8** Na área industrial, chegando com nível 0 e fazendo os 5 básicos de lá, o nível ao alcance é 3 → `smoke117` (8)
- **CA9** Cada aumento sobe um nível; o `setStaff` recusa nível acima do ao alcance → `smoke117` (9)
- **CA10** Na Avenida, depois de um curso, a lojinha trava ("Em curso"); no Terraço, trava só depois do segundo → `smoke117` (10)
- **CA11** Os números dos 9 níveis em `STAFF.tonhao.levels` batem com a tabela; `AVAL.prato` tem 9 faixas; `EXIGENTE.casa.nivel` é 6 → `smoke117` (11)
- **CA12** Save antigo `{ pastel:2, assados:1, pf:2, restaurante:1 }` com Tonhão no nível 3 vira `{ pastel:{garagem:2}, assados:{industrial:1}, pf:{industrial:2}, restaurante:{avenida:1} }`, nível 6, e `tonDeg:1` → `smoke117` (12)
- **CA13** O avançado de fritos da Garagem soma ×1,15 à coxinha na Garagem e na área industrial, e não ao `enroladinho` → `smoke117` (13)
- **CA14** Fora do modo dev, o menu não mostra "Turno sem fim"; com ele, mostra → `smoke117` (14)
- **CA15** Modo dev: o botão de degrau gira básico → avançado → 0 sem cobrar; "Forçar nível" 8 na Garagem põe o nível 8 → `smoke117` (15)
- **CA16** A lojinha da Avenida e do Terraço, com todos os cartões, cabe nas 14 telas → `python3 menu_fit.py`
- **CA17** O jogo roda a carreira sem erro do dia 1 ao 65 (`DIAS=65 node carreira.js 2`): a história anda e o bot compra cursos em todos os pontos → `carreira` (o número de dias é o da v12.10.3; aqui só não pode travar)

## Partes
- `src/10-constantes.js`: `CARDAPIO` (preços da Garagem, pratos de estrada, `lento`), `CURSOS` (vira técnicas com `degraus`), `CURSO_AV`, `cursoOf`, `cursoNivel`, `CURSO_XP`, `tonhaoXp`, `tonhaoNivelXp`, `tecnicaDe`, `pratoAv`, `pratosCurso`, `cursoFeito`, `normCursos`, `pratoSabido`, `CURSOS_SEMFIM`, `precoPrato`, `STAFF.tonhao`, `AVAL.prato`, `avalMenu`, `EXIGENTE`, `HIST` (tabela dos capítulos), `MANUAL` (`e-tonhao`, `l-cardapio`), `cursoOk`.
- `src/12-clientes.js`: `normSave` (perto da linha 289, a conversão).
- `src/13-cozinha.js`: os usos de `STAFF.tonhao.levels[...]` e `AVAL.prato[...]` (só conferir com 9 níveis).
- `src/16-jogo.js`: `cursoProx`, `cardapioNovo`, `cursoTrava`, `buyCurso`, `setStaff` (perto da linha 1565).
- `src/41-lojinha.js`: `buildCursos`, o cartão do Tonhão (perto da linha 382), `buildCursosFeitos`.
- `src/40-interface.js`: `buildDev` (degrau por técnica, forçar nível), o menu (`nbt`, `#btn-endless`).
- `src/02-telas.html`: `#btn-endless`, a aba `semfim`.
- `src/20-desenho-base.js` (ou onde estiver `drawDish`): os 6 pratos de estrada com o desenho do parecido.
- `tests/bot.js`: `CURSOS_ORDEM`, `proximoCurso`, `cursosApos`, `cursos` (compra pelo degrau do ponto atual, ver Testes).

## Tarefas
- [ ] T1 `smoke117` com os critérios CA1 a CA15 (falhando).
- [ ] T2 Dados: `CARDAPIO` (Garagem sem assados e vegetarianos; pratos de estrada; `lento`), `CURSOS` em técnicas com degraus, `degrauDe`.
- [ ] T3 Saber e preço: `pratoSabido` (degrau, estranho, incluir o antigo), `pratoAv`, `precoPrato`, `avalMenu`.
- [ ] T4 Níveis: `STAFF.tonhao` com 9 níveis, `tonhaoNivelAlc`, `setStaff`, `AVAL.prato`, `EXIGENTE.casa.nivel`, `HIST`.
- [ ] T5 Lojinha: `cursoProx` (troca), `buyCurso` (incluir o antigo, `cursoQt`), `cursoTrava` (2 no Terraço), `buildCursos`, cartão do Tonhão, `cardapioNovo`.
- [ ] T6 Save: `normCursos`, conversão única (`tonDeg`), `cursoQt`.
- [ ] T7 Turno sem fim fora do menu; modo dev (degrau por técnica, forçar nível); Manual.
- [ ] T8 `tests/bot.js` no formato novo; smokes antigos que quebrarem pelo formato dos cursos ou pelo número de níveis corrigidos (só o formato, ver Avisos).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge.

## Avisos para a execução
- Procure em `src/` todo uso de `save.cursos`, `game.cursos`, `cursoNivel`, `equipe.tonhao`, `eq.tonhao` e `STAFF.tonhao` antes de mudar o formato: a conversa da chegada da Lia (`gatilho`, perto da linha 1751) e as fichas do Manual reveladas por curso também leem os cursos.
- O `cursoNivel(cursos, id)` de hoje é usado fora do Tonhão como "tem a técnica?": deixe uma `cursoNivel(cursos, id, ponto)` que, sem `ponto`, devolve o maior nível entre os degraus (para esses usos) e, com `ponto`, o daquele degrau.
- Smokes antigos que conferem preço de curso, experiência ou nível do Tonhão: corrija para a regra nova e anote em Testes quais foram. Os que medem dinheiro ou metas ficam para a v12.10.3, se só o valor mudar (marque no `run_all.sh` como na v12.7, se precisar).
- O `bot.js` hoje compra pela lista `CURSOS_ORDEM` de ids: passe a comprar o próximo cartão do ponto atual na ordem básicos (pastel, chapa, fritos, assados, veg, pf, restaurante, entradas, alta) e depois avançados, com a mesma reserva de hoje.

## Testes
- `smoke117` novo (15 checagens, CA1 a CA15). `menu_fit.py` (CA16) e `DIAS=65 node carreira.js 2` (CA17).
- `tests/bot.js`: a compra por cartão do ponto (Avisos). `CURSOS=bot|todos|0|lista` no `balance.js` passa a aceitar `todos` = todos os degraus até o ponto jogado.
- No fechamento: a lista dos smokes antigos corrigidos e o que o `balance.js 20` e o `carreira.js 6` mediram (só registro; os alvos são da v12.10.3).

## Decisões em aberto
1. **Nomes dos degraus** (tabela em Regras): aprovar ou trocar. Sugestão: os da tabela.
2. **Preços de partida** (tabela em Regras): aprovar como ponto de partida da v12.10.3. Sugestão: os da tabela; com eles, todos os cursos de um ponto custam ~5 dias de lucro na Garagem, ~10 na área industrial, ~9 na Avenida e ~7 no Terraço (lucro médio da v12.7).
3. **Save antigo acima do teto** (nível = 2 × o antigo): na Garagem, quem tinha o nível 4 de antes passa ao 8 e à diária de R$ 160 (hoje paga R$ 120). Sugestão: aceitar (é raro e o jogador não perde força); a outra opção é limitar ao nível com a diária mais perto da antiga.

## Desvios
(No fechamento.)

**Modelo:** planejar com o Opus antes (rascunho; na aprovação, vira "Sonnet, esforço alto": muitas partes ao mesmo tempo e troca de formato do save)
