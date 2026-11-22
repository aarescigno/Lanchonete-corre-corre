# v12.9.1 — A decoração de cada ponto: as duas famílias, os preços e a mudança (etapa 17b)

**Situação:** aprovada
**Origem:** conversa de 21/11 (`docs/PROPOSTAS.md`, "a decoração de cada ponto"): "comprar samambaia no terraço surfista lá não vai fazer nenhum sentido [...] Às vezes faça sentido até a área industrial, os luxos da garagem", e, sobre a mudança: "nessa transição entre a área industrial e a avenida, tem que rolar essa história falando, olha, que é outro nível [...] dentro do perfil psicológico de cada personagem". Na escolha: duas famílias; os simples vendidos pela metade na mudança para a Avenida; o preço pelo ponto em que se compra (luxo 1: R$ 15, 30, 60, 150; luxo 2: R$ 30, 180, 200, 600; luxo 3: R$ 450 e R$ 1.500), o lustre com 3 de luxo e a estante de vinhos com 2; as falas da chegada à Avenida como foram propostas; a espada da dona Cida vai para a casa da mãe. Depende da v12.9 (`docs/spec-v12.9.md`: os enfeites novos e os redesenhos).

## Objetivo
Cada ponto tem a decoração que combina com ele. Na Garagem e na área industrial, a decoração simples; na Avenida e no Terraço, a fina. Ao chegar à Avenida, a equipe se despede das coisinhas da Garagem: o que não combina mais é vendido pela metade, e a decoração começa de novo, mais cara e mais bonita. A foto da dona Rosa vai junto, sempre.

## Fora do escopo
- Os desenhos: v12.9.
- O enfeite de mesa, o jogo de mesas, a TV, o som e os assentos: nada muda.
- A mudança da Garagem para a área industrial e da Avenida para o Terraço: nada sai (a família é a mesma).

## Regras (decisões tomadas)
- **Famílias** (campo `fam` no `DECOR`): `'simples'` para os de `nivel` 1 e 2 (espada, temperos, samambaia, quadro de giz, plaquinha, pisca-pisca, cortina de chita; cactos, antúrio, jiboia, luminárias), `'fina'` para os de `nivel` 3 e 4, e a foto da dona Rosa sem família (vale nos quatro pontos). `decorCombina(d, ponto)`: a foto sempre; `'simples'` com o nível do ponto 1 ou 2; `'fina'` com 3 ou 4; e o `nivel` do enfeite até o do ponto.
- **Luxo** (`lux`): os de hoje, menos os quadros de artista (2 → **3**) e o lustre (2 → **3**); os novos da v12.9 como lá, menos a estante de vinhos, que fica com **2** (já é 2 na v12.9). A Decoração cheia de cada ponto (todos os enfeites que combinam): Garagem 10, área industrial 15, Avenida **19** (hoje 20), Terraço 25.
- **Preço** (`decorPreco(d, ponto)`, no lugar do `cost` de cada enfeite, que sai): pelo luxo do enfeite e pelo ponto em que se compra, `DECOR_PRECO = { 1:[15, 30, 60, 150], 2:[30, 180, 200, 600], 3:[0, 0, 450, 1500] }` (índice = nível do ponto − 1). Ex.: a samambaia sai por R$ 15 na Garagem e R$ 30 na área industrial; o espelho, R$ 200 na Avenida e R$ 600 no Terraço; o lustre, R$ 1.500. A lojinha mostra o preço do ponto de agora.
- **A lojinha** (`buildDecor`) mostra só os que combinam com o ponto; `buyDecor` recusa (sem cobrar) o que não combina, mesmo no modo dev com a lojinha de graça (ali, o que vale são os de `devDecor`).
- **Na mudança da área industrial para a Avenida** (`mudarPonto`, nível 2 → 3): sai do `save.decor` todo enfeite da família simples (à mostra ou guardado), e volta ao dinheiro `Math.round(soma × 0,5)`, em que cada enfeite conta o preço do ponto dele (`DECOR_PRECO[lux][nivel − 1]`, Garagem para os de `nivel` 1), numa linha negativa do Salão no Caixa (`caixaGasto(sv, 'sal', -v)`, como a venda de mesas). A foto fica. No Modo História (`histLiga() && sv.histV === 1`), se a espada veio de presente (`sv.convPlanta === 1`), ela sai sem entrar na conta (vai para a casa da mãe da Bia).
- **Save antigo na Avenida ou no Terraço com enfeites simples:** ao carregar (`normSave`), eles saem e voltam pela mesma conta, numa linha do Caixa, como a devolução do salão antigo (`salaoDevolucao`, v7.4); a espada da dona Cida, pela mesma regra.
- **O cartão Mudança** (`buildMudanca`), indo para a Avenida com algum enfeite simples (fora a espada da dona Cida no Modo História): a confirmação ganha, depois da frase das mesas, **"Os enfeites simples não combinam com a Avenida: voltam pela metade."**
- **A chegada à Avenida** (o `antes` do cap. 6, `HISTORIA`, `src/10-constantes.js`): depois das 4 falas de hoje, nesta ordem:
  1. `{ q:'tonhao', e:'insegura', nota:'segurando a cortina de chita', s:'E as nossas coisinhas? A chita, o pisca-pisca...' }`
  2. `{ q:'bia', e:'firme', s:'Aqui é outro nível, tio. O que não combina, eu vendo. O novo tá no Luxo.' }`
  3. `{ q:'dani', s:'Espelho, quadro de artista... Bi, eu vou ter medo de encostar em tudo!' }`
  4. `{ q:'tonhao', s:'Casa nova, avental novo. Mas o tempero é o mesmo.' }`
  5. `{ q:'dani', s:'E a espada da dona Cida?' }`
  6. `{ q:'bia', e:'alegre', s:'Vai pra casa da mãe. Lá ela segue cuidando da gente.' }`
  7. `{ q:'bia', s:'E a foto da mãe vem junto. Com moldura nova.' }`
- **Manual** (ficha `l-luxo`): a linha passa a ser **"Enfeites, móveis, música e um endereço melhor deixam a casa mais chique, e cada ponto tem os enfeites que combinam com ele. Mais luxo traz mais VIPs e melhora o ambiente no Gúgou."**
- **Modo dev:** `devDecor(true)` e o "Ir para o ponto" (o save montado do ponto) põem só os enfeites que combinam com o ponto; nada novo no painel (a mudança e a conversa já se assistem pelo "Ir para o ponto" e pelos capítulos).
- **Arco:** as 7 falas entram no `docs/ARCO.md`, numa seção nova "13. v12.9.1 — A chegada à Avenida com a decoração nova".
- **Versão:** `VERSAO` e `vtag` em v12.9.1; linha no `#ov-ver`: **"Cada ponto tem a sua decoração: na Avenida, os enfeites simples saem pela metade e a decoração fina começa do zero."**

## Critérios de aceite
- **CA1** `decorPreco`: samambaia R$ 15 na Garagem e R$ 30 na área industrial; luminárias R$ 180 na área industrial; tulipas R$ 60 na Avenida e R$ 150 no Terraço; espelho R$ 200 e R$ 600; quadros R$ 450 e R$ 1.500; lustre R$ 1.500; a foto R$ 15, 30, 60 e 150 → `smoke116` (1)
- **CA2** Na aba Luxo, a Garagem mostra os 8 enfeites dela; a área industrial, os 11 simples e a foto; a Avenida, a foto e os 9 finos de `nivel` 3; o Terraço, a foto e os 13 finos → `smoke116` (2)
- **CA3** Na Avenida, comprar a samambaia devolve `false` e não cobra; na área industrial, comprar o espelho também → `smoke116` (3)
- **CA4** Com todos os enfeites que combinam à mostra, a Decoração (`luxoPts(g).dec`) dá 10 na Garagem, 15 na área industrial, 19 na Avenida e 25 no Terraço → `smoke116` (4)
- **CA5** Fora do Modo História, mudar da área industrial para a Avenida com os 11 simples e a foto: sobra só a foto, e o dinheiro sobe R$ 203 (metade de R$ 405) além de descer o preço da mudança → `smoke116` (5)
- **CA6** No Modo História, com `convPlanta === 1`, a mesma mudança devolve R$ 195 (a espada não entra) e a espada também sai → `smoke116` (6)
- **CA7** Mudar da Garagem para a área industrial não tira nem devolve nenhum enfeite → `smoke116` (7)
- **CA8** O `antes` do cap. 6 tem as 4 falas de antes e, depois, as 7 novas, na ordem e com os textos da Regra → `smoke116` (8)
- **CA9** O cartão Mudança, na área industrial, com algum enfeite simples, mostra "Os enfeites simples não combinam com a Avenida: voltam pela metade."; sem nenhum, não → `smoke116` (9)
- **CA10** Um save na Avenida com a samambaia e a foto, ao carregar, fica só com a foto e com R$ 8 a mais (metade de R$ 15, arredondada) → `smoke116` (10)
- **CA11** No modo dev, `devDecor(true)` na Avenida põe só a foto e os finos de `nivel` 3 → `smoke116` (11)
- **CA12** `DIAS=65 node carreira.js 3`: nenhuma carreira com dia no negativo nos 5 dias depois da mudança para a Avenida (o bot não compra decoração; a venda só soma) → linha `PONTOS` do `carreira.js`

## Partes
- `src/10-constantes.js`: `DECOR` (`fam`, `lux` dos quadros e do lustre, sem `cost`), `DECOR_PRECO`, `decorPreco`, `decorCombina`, a ficha `l-luxo`, o `antes` do cap. 6 de `HISTORIA`, `VERSAO`.
- `src/12-clientes.js`: `normSave` (a saída dos simples no save antigo, junto da `salaoDevolucao`).
- `src/16-jogo.js`: `buyDecor`, `mudarPonto`, `devDecor` e o save do "Ir para o ponto" (a linha do `dec` do nível do ponto).
- `src/41-lojinha.js`: `buildDecor` (o filtro e o preço), `buildMudanca` (a frase).
- `src/02-telas.html`: `vtag`, `#ov-ver`.
- `tests/balance.js`: o `LUXO=tudo` passa a usar `decorCombina` (hoje filtra só pelo `nivel`).
- `docs/ARCO.md`: a seção 13.

## Tarefas
- [ ] T1 `smoke116` com CA1 a CA11 (falhando), no `run_all.sh`.
- [ ] T2 `DECOR` com `fam` e o luxo novo, `DECOR_PRECO`, `decorPreco`, `decorCombina`; tirar o `cost` e trocar cada uso dele por `decorPreco`.
- [ ] T3 A lojinha e o `buyDecor` com o filtro e o preço do ponto.
- [ ] T4 A mudança (`mudarPonto`) e o save antigo (`normSave`) com a venda pela metade e a espada da dona Cida; a frase do cartão Mudança.
- [ ] T5 As 7 falas do cap. 6, a ficha `l-luxo`, o `devDecor` e o "Ir para o ponto"; a seção 13 do `docs/ARCO.md`.
- [ ] T6 `tests/balance.js` (`LUXO=tudo`) e o CA12 (`DIAS=65 node carreira.js 3`).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86` e `menu_fit.py`), `docs/RESUMO.md`, `docs/PARTES.md`, a tabela Situação do `docs/PLANO.md` (a Etapa 17 vai para o `docs/PLANO-FEITO.md`), o destino no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Os smokes antigos que contam enfeites, preços ou o luxo por ponto vão mudar (o `smoke72` espera hoje a Avenida com 64 pontos de luxo com tudo comprado: passa a 63; procure por `DECOR`, `buyDecor`, `.cost` de enfeite e `luxoPts`). Corrija cada um para o comportamento desta spec e registre nos Desvios.
- O `normSave` é chamado muitas vezes: a saída dos simples tem de acontecer só uma vez (depois dela, não há mais simples no save) e a linha do Caixa vai junto da devolução, como na `salaoDevolucao`.
- A mudança da área industrial já apaga as TVs, o assento e a jarra (`mudarPonto`, "saem sem devolver"): a venda dos enfeites entra no mesmo lugar.

## Testes
- `smoke116` novo, no `run_all.sh`.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões.
- `smoke72` e os outros que mudarem, nos Desvios.
- `DIAS=65 node carreira.js 3` (CA12).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (regras, números e falas decididos; várias partes, mas cada uma pequena)
