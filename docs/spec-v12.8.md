# v12.8 — Os desenhos dos pratos novos da Avenida e as barracas chiques (etapa 16b-1)

**Situação:** entregue em 20/11
**Origem:** etapa 16b do `docs/PLANO.md` (saiu da v12.7, 19/11: "os desenhos próprios dos pratos novos e das barracas juninas chiques vão na v12.8"); planejada em 20/11 com o usuário (dividida em duas versões: esta e a v12.8.1, o Terraço)

## Objetivo
Na Avenida, cada prato tem a cara dele: o jogador bate o olho no balão e sabe que é o strogonoff (pela batata palha), a moqueca (pela panela de barro) ou a mandioca (pelos bastões), em vez de ver o mesmo PF ou o mesmo salgado em cores diferentes. A Avenida tem jeito de restaurante executivo, de prato cheio. Os pratos juninos da Avenida e do Terraço ganham desenho próprio, e a barraca da festa junina de cada um desses pontos fica com cara de arraiá caprichado.

## Fora do escopo
- **Os pratos do Terraço e o risoto da Lia:** na v12.8.1 (`docs/spec-v12.8.1.md`), a sessão seguinte. Até lá, eles seguem no `DESENHO_BASE`.
- Barraca desenhada no salão no dia da festa (hoje a barraca só aparece no cartão da lojinha) e bandeirinhas diferentes por ponto: ficam como estão.
- Os pratos da Garagem e da área industrial, os veganos e vegetarianos da v8.6.11 (que reusam o desenho do prato com carne pelo `DESENHO_BASE`) e os 6 finos da v10.2: não mudam.
- Preço, cardápio, gosto, tempo de cozinha: nada de regra de jogo muda (é só desenho).

## Regras (decisões tomadas)
- **Onde vale:** o desenho é o de `drawComida` (`src/20-desenho-base.js`), então aparece igual em todo lugar que mostra comida: o balão do pedido (escala 0,85 a 0,95), o prato na mesa (0,52), o balcão de pratos (1,1), a marmita (a tampa, achatada), o cartão Cardápio da lojinha (1,7) e o Manual. O desenho tem de ser lido a 0,52: silhueta e cor dominante dizem o prato; o detalhe fino é para o balão e o cartão.
- **Estilo:** o de hoje (contorno escuro com `fs(ctx,cor,lw)`, formas simples, centrado em (0, 0), dentro do prato de raio 15 × 10,5; nada além de x ±13, y ±9). A cor principal de cada prato é a `cor` dele no `CARDAPIO` (já escolhida na v12.7), salvo onde a tabela diz outra. Na Avenida, prato cheio (como o PF, a comida ocupa o prato). (O Terraço, na v12.8.1, terá porção menor e mais prato branco.)
- **Os pratos saem do `DESENHO_BASE`:** saem as chaves da Avenida (`execFrango`, `strogonoff`, `beirute`, `coalho`, `mandioca`, `isca`, `torta`, `empadao`, `escondidinho`) e as dos 6 juninos novos; ficam os 6 da v8.6.11 e os do Terraço (`galeto`, `escalope`, `coalhoMel`, `crostini`, `dadinho`, `croquete`, `folhado`, `empadinhaCam`, `vinho`), que saem na v12.8.1. Os pratos da Avenida ganham uma função nova `drawAvenida(ctx,k,av)` (devolve `true` quando desenhou), chamada em `drawComida` antes do `if (cat === 'pf')`, como o `drawFino`; a v12.8.1 faz a `drawTerraco` do mesmo jeito. O selo de vegetariano e vegano (`drawVegSelo`) continua em todos os `veg:true`.
- **Os desenhos da Avenida** (14):
  | Prato | O desenho (o que distingue em negrito) |
  |---|---|
  | `execFrango` Executivo de frango grelhado | Arroz (creme, à esquerda em cima) e feijão (marrom, à direita em cima), como o PF; embaixo, o **filé de frango grelhado** (o `drawCarne(ctx,'frango')`, maior: 14 × 6) e, no lugar do ovo, **salada**: duas folhas de alface verde-claras `#8CC152` e uma rodela de tomate `#E24B3B`. Sem ovo. |
  | `strogonoff` Strogonoff de carne | Arroz à esquerda; à direita, o **molho rosado** `#D98A5A` (mancha arredondada) com 4 cubinhos de carne `#7A3B1E` e 2 fatias de champignon (bege); por cima do molho, **batata palha**: 8 a 10 risquinhos amarelos `#F2C94C` curtos e cruzados. |
  | `mandioca` Mandioca frita | **5 bastões grossos** (retângulos arredondados 4 × 16, em leque, cruzando), casca dourada `#E3B25A` e a ponta cortada clara `#F7EBC4`; um potinho de maionese branco no canto. |
  | `isca` Isca de peixe | **4 tirinhas empanadas irregulares** (alongadas 12 × 4, um pouco tortas), dourado `#E0B46A` com pintinhas de farinha; um **gomo de limão** verde `#B5D33A` e um potinho de molho tártaro branco com pontinhos verdes. |
  | `torta` Torta de frango | Uma **fatia em cunha** (triângulo de bico para a esquerda): tampa de massa dourada `#D9A55B` e, na face do corte, o recheio creme `#F2DDA2` com pedacinhos de frango bege e **2 ervilhas verdes**. |
  | `empadao` Empadão de palmito | Um **pedaço quadrado** (14 × 11) com a **cobertura em treliça** (3 + 3 tiras de massa cruzadas em losango) sobre recheio creme-esverdeado `#CDB866`, e 2 rodelas de palmito (círculo branco com miolo creme) aparecendo nos furos. |
  | `beirute` Beirute | **Dois triângulos de pão sírio** (lado a lado, a ponta para cima, massa clara `#E8C98F` com manchinhas tostadas) com o recheio à mostra na borda de baixo: rosbife `#B04A3E`, queijo amarelo, alface e tomate em camadas finas. |
  | `coalho` Queijo coalho na chapa | **Dois espetinhos**: retângulos de queijo branco-creme `#F4E6B8` (14 × 6) com **marcas de grelha** douradas `#C98A3A` em diagonal e o palito de madeira saindo pelas pontas. |
  | `panqueca` Panqueca de carne | **Duas panquecas enroladas** (cilindros 18 × 6 lado a lado, massa `#E9C27A`) cobertas de **molho vermelho** `#C23B22` no meio e queijo ralado (pontinhos amarelos); na ponta de cada uma, a carne moída marrom. |
  | `panquecaEsp` Panqueca de espinafre | As mesmas duas panquecas, com **molho branco** `#F4EEDD` por cima e o **recheio verde** `#4F8A3A` na ponta. |
  | `execVeg` Executivo vegetariano | Arroz e feijão como o PF; embaixo, **legumes**: 3 buquês de brócolis verde-escuro `#3E7B3A` e 3 rodelas de cenoura `#E88A2E`; e o ovo frito (é vegetariano). |
  | `escondidinho` Escondidinho de abóbora | Uma **travessinha retangular de louça** (borda branca grossa) com o purê laranja `#E3A04A` e **manchas de gratinado** marrom-douradas por cima. |
  | `execVegano` Executivo vegano | Arroz e feijão como o PF; embaixo, **couve refogada** (5 a 6 fiapos verde-escuros `#2F6B2F` em zigue-zague) e **farofa** (mancha amarela `#E8C46A` granulada com pontinhos). Sem ovo. |
  | `moquecaBanana` Moqueca de banana-da-terra | A **panela de barro** vista de cima (círculo terracota `#A8532E` com a alça de cada lado) quase enchendo o prato, caldo laranja de dendê `#E8892A`, **4 rodelas de banana** amarelas `#F2D06B`, uma tira de pimentão vermelho e folhas de coentro verdes. |
- **O detalhe do curso avançado** (o `av`; vale também para a v12.8.1): os pratos novos de fritos, assados, chapa e pastel levam o detalhe da técnica que já existe (fritos: a pontinha de catupiry; assados: a azeitona; chapa: as listras da grelha; pastel: as bolhinhas da massa), no ponto `dx, dy` de cada desenho. Os pratos principais novos (`cat:'pf'`: os executivos, o strogonoff e, na v12.8.1, o galeto, o escalope, o filé ao molho de vinho, o nhoque e a polenta) levam, com o avançado, um **raminho de ervas** (2 folhinhas verdes `#3E9B5A`), como o manjericão da parmegiana. Os veganos de `nivel:2` (`semAv`) não têm avançado.
- **Os juninos novos** (6, em `drawJunino`, cada um com o seu ramo; os 3 de hoje não mudam):
  | Prato | O desenho |
  |---|---|
  | `curau` Curau (Avenida) | Uma **cumbuca** com creme amarelo-vivo `#F2C94C` liso (sem grãos, ao contrário da canjica) e canela em pó em cima. |
  | `milhoCoalho` Milho com queijo coalho (Avenida) | A espiga de milho de hoje (menor, à esquerda) e um **espetinho de queijo coalho** grelhado (o do `coalho`) cruzado com ela. |
  | `bolo` Bolo de fubá com goiabada (Avenida) | Uma **fatia de bolo** (cunha) amarela `#E8B85A` com miolo mais claro e uma **camada de goiabada** vermelha `#B5303A` no meio e por cima. |
  | `cremeMilho` Creme de milho com crocante (Terraço) | Um **ramequim branco** pequeno com creme de milho `#F2D86B` e o **crocante dourado** (5 lasquinhas marrom-douradas) por cima; uma folhinha. |
  | `pamonhaMel` Pamonha de queijo com mel (Terraço) | A **pamonha aberta** (a palha verde aberta em barco, a massa amarela à mostra) com um **fio de mel** âmbar e 2 cubinhos de queijo branco. |
  | `canjicaCoco` Canjica de coco com cumaru (Terraço) | Uma **taça de vidro** (contorno claro, pé curto) com a canjica branca, **coco ralado** (fiapos brancos) e raspas de cumaru marrom-escuras. |
- **As barracas chiques** (o ícone do cartão da lojinha, `upgradeIcon('barraca')` em `src/41-lojinha.js`, passa a desenhar a do ponto atual; Garagem e área industrial ficam com a de hoje):
  - **Arraiá da Avenida:** toldo listrado **verde-bandeira `#2E8B3E` e amarelo `#F2C23D`**, um fio de bandeirinhas coloridas (as cores de `BAND_JUNINA`) pendurado na frente do toldo, balcão de madeira clara e, no balcão, a fatia do bolo de fubá.
  - **Arraiá do Terraço:** toldo **creme `#F4EEDD` com listras finas douradas `#C9A24A`** e a borda de baixo **recortada em ondas** (festonê), um varal de **luzinhas** amarelas (5 pontinhos com brilho) no alto, balcão de nogueira escura (`#5A3A24`) e, no balcão, a taça da canjica de coco.
- **Modo dev:** a seção "Cardápio do ponto" do painel (aba Equipe e lojinha, `src/40-interface.js`) ganha o desenhinho de cada prato ao lado do nome (um `tipCanvas` pequeno, com e sem o avançado conforme os cursos), para assistir os desenhos do ponto sem jogar. A festa junina já se força pela aba Hoje (`Evento: Festa junina`), o que mostra o cartão da barraca na lojinha.
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** Nenhum prato vendido na Avenida nem junino cai no `DESENHO_BASE` → `smoke110` (1)
- **CA2** Cada prato vendido na Avenida tem desenho diferente de todos os outros pratos da Avenida (assinatura das chamadas ao `ctx`, ver Avisos), com e sem o avançado → `smoke110` (2)
- **CA3** Os 6 juninos novos têm desenho diferente entre si e dos 3 de hoje → `smoke110` (3)
- **CA4** Nos pratos novos que têm avançado (`pratoAv` possível: não `semAv`, nem junino, nem o risoto da Lia), o desenho com `av` é diferente do desenho sem; nos `semAv`, igual → `smoke110` (4)
- **CA5** O ícone da barraca é diferente na Garagem, na Avenida e no Terraço, e igual na Garagem e na área industrial → `smoke110` (5)
- **CA6** O painel do modo dev, na Avenida, mostra um desenho para cada prato do cardápio do ponto → `smoke110` (6)
- **CA7** Todos os desenhos novos rodam sem erro em `drawDish` (com e sem `av`), em `drawMarmita` e no `upgradeIcon('barraca')` de cada ponto → `smoke110` (7)
- **CA8** Cada prato se reconhece no balão, na mesa, no balcão e no cartão, e nada passa da borda do prato → captura `shot_v12_8.js`: a grade dos pratos da Avenida e dos 6 juninos novos a 0,52, 0,9 e 1,7 (recorte ampliado de cada linha), uma mesa da Avenida com o balão e o balcão de pratos cheios, o cartão Cardápio da Avenida e o cartão da barraca na Avenida e no Terraço; 844x390 e 568x320

## Partes
- `src/20-desenho-base.js`: `DESENHO_BASE`, `drawComida` (a chamada da `drawAvenida`, nova), `drawJunino` (os 6 juninos novos)
- `src/41-lojinha.js`: `upgradeIcon` (o ramo `'barraca'` por ponto, linhas 16 a 20)
- `src/40-interface.js`: a seção "Cardápio do ponto" do `buildDev` (linha 386)
- `tests/smoke110.js` (novo) e `tests/shot_v12_8.js` (novo)

## Tarefas
- [x] T1 `smoke110` com os CA1 a CA7 (falhando).
- [x] T2 Os 14 desenhos da Avenida, com o detalhe do avançado.
- [x] T3 Os 6 juninos novos e as duas barracas chiques.
- [x] T4 O desenhinho na seção "Cardápio do ponto" do modo dev.
- [x] T5 `shot_v12_8.js` e a conferência do CA8 (recortes ampliados; ajustar o que não se lê a 0,52 ou passa da borda; olhar e apagar).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A assinatura do desenho (CA2 a CA5) se tira com um `ctx` de mentira que anota cada chamada (nome do método e números arredondados a 0,1) e cada `fillStyle`/`strokeStyle` atribuído; dois desenhos são iguais se a lista inteira é igual. O `mkCtx` do `harness.js` engole tudo: no smoke, passe ao `L.drawDish` um `Proxy` próprio que grava. `drawDish` e `drawMarmita` já estão em `window.__lcc`; `upgradeIcon` precisa entrar (para o CA5).
- A grade de pratos para olhar se faz como na sessão de planejar: montar, abrir o `lanchonete.html` no Playwright, um `canvas` novo e `L.drawDish(c,k,x,y,s,false,null,av)` para cada prato com `CARDAPIO[k].preco.avenida` (e os juninos). Deixe a lista de pratos do `shot_v12_8.js` num parâmetro: a v12.8.1 reusa o arquivo para o Terraço.
- O `smoke62` (linha 144) desenha os finos com e sem `av` e na marmita: não pode quebrar.
- `COMIDA_CURSOS` decide o `av` quando ele não vem: no smoke, passe `av` sempre explícito (`true`/`false`).

## Testes
- `smoke110` novo (CA1 a CA7), no `run_all.sh`.
- `shot_v12_8.js` novo (CA8), no padrão do `shot_v12_7.js`.
- Sem mudança no `balance.js` nem no `carreira.js` (não há regra de jogo nova).

## Decisões em aberto
Nenhuma. (20/11: o usuário aprovou os desenhos das tabelas como ponto de partida, com o ajuste fino na conferência das capturas; a barraca só no ícone do cartão; o detalhe do avançado da técnica e o raminho de ervas nos principais; e a divisão em duas versões, esta e a v12.8.1.)

## Desvios
- **Medido:** `smoke110` com 13 checagens (CA1 a CA7); CA8 conferido pela `shot_v12_8.js` (grade e cenas); ajustes de forma na conferência (a torta, o bolo e a taça de canjica passavam da borda do prato; na barraca da Avenida, bandeirinhas maiores e o bolo mais baixo).
- A Avenida tem 15 pratos (os 14 da tabela mais a parmegiana, que já tinha desenho próprio); o CA2 conta os 15.
- `upgradeIcon` e `DESENHO_BASE` entraram em `window.__lcc`; `drawAvDetalhe` (o detalhe do avançado) virou função à parte, usada por `drawComida` e `drawAvenida`; o executivo, o strogonoff e o executivo vegetariano levam só o raminho de ervas (não o detalhe da categoria).
- O modo dev ganhou o `div#dev-cardapio` (um `.dev-prato` por prato, canvas e nome com o preço).
- Sem regra de jogo nova: `balance.js` e `carreira.js` não rodaram.

**Modelo:** Sonnet, esforço médio (desenho no canvas com plano detalhado; a conferência das capturas pede olho, não decisão)
