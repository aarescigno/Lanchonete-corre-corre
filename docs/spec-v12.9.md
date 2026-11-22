# v12.9 — Os enfeites novos da família fina e os redesenhos (etapa 17a)

**Situação:** aprovada
**Origem:** conversa de 21/11 (`docs/PROPOSTAS.md`, "a decoração de cada ponto"): "se eu for no terraço, eu não vou querer comprar samambaias ou espada São Jorge [...] ao se avançar, muitas coisas devem ser compradas de novo do zero". Na escolha: duas famílias de enfeites (a simples, da Garagem e da área industrial; a fina, da Avenida e do Terraço), "com ajustes no que claramente ficar sobreposto", "o retrato da Rosa persiste, mudando moldura", e enfeites novos na família fina (a proposta da tabela foi aprovada como veio). Esta versão faz os desenhos; a regra das famílias, os preços e a mudança são a v12.9.1 (`docs/spec-v12.9.1.md`).

## Objetivo
A Avenida e o Terraço ganham uma decoração à altura: espelho, palmeiras, cortinas de linho, arandelas e estante de vinhos. Na família simples, o que se repetia vira coisa própria (temperos na lata, cactos, jiboia), o arranjo de orquídeas do Terraço vira um bonsai, e a foto da dona Rosa ganha moldura dourada na Avenida e no Terraço.

## Fora do escopo
- Que enfeite vale em que ponto, os preços por ponto, o luxo novo dos quadros e do lustre, a venda na mudança, a conversa da chegada à Avenida: v12.9.1. Nesta versão a lojinha continua vendendo tudo do `nivel` em diante, e a Decoração continua com o teto de hoje.
- O enfeite de mesa (`ENFEITE_MESA`) e o jogo de mesas (`MOVEIS`): nada muda.

## Regras (decisões tomadas)
- **Enfeites novos** (`DECOR`, `src/10-constantes.js`; os ids ficam como estão escritos aqui):

  | id | grupo | name | cost | nivel | lux |
  |---|---|---|---|---|---|
  | `espelho` | `enfeites` | Espelho de moldura | 200 | 3 | 2 |
  | `palmeira` | `plantas` | Palmeiras na entrada | 200 | 3 | 2 |
  | `vinhos` | `enfeites` | Estante de vinhos | 200 | 3 | 2 |
  | `cortina` | `enfeites` | Cortinas de linho | 450 | 3 | 3 |
  | `arandela` | `enfeites` | Arandelas | 450 | 3 | 3 |

- **Renomeados e redesenhados** (o id fica, para os saves; só o `name`, o desenho no cenário, o ícone da lojinha e o elogio mudam): `lata` → **Temperos na lata** (cebolinha e manjericão numa lata de óleo, no lugar da espada na lata); `violeta` → **Cactos** (três vasinhos de cacto no parapeito, no lugar das violetas, que repetiam o enfeite de mesa da área industrial); `pendente` → **Jiboia pendurada** (folhas em coração caindo de um vaso pendurado, no lugar da samambaia pendurada); `orqArranjo` → **Bonsai** (árvore pequena num vaso raso, no pedestal do arranjo de orquídeas). Preço, luxo e `nivel` desses quatro ficam como estão.
- **A foto da dona Rosa** (`drawFotoRosa`): na Avenida e no Terraço (nível do ponto 3 ou mais), moldura dourada larga com cantoneiras, no lugar do porta-retrato de madeira com o prego e o barbante; o retrato de dentro não muda. Na Garagem e na área industrial, como hoje.
- **Onde cada um fica** (desenho no cenário, `src/21-cenario.js` e `src/23-render.js`; só na Avenida e no Terraço para os cinco novos):
  - Temperos, Cactos, Jiboia e Bonsai: no lugar exato do que substituem (os `drawLataEspada`, `drawVioleta`, `drawSamambaia` do `pendente` e `drawArranjoOrquideas` de hoje dão lugar a `drawTemperos`, `drawCactos`, `drawJiboia` e `drawBonsai`).
  - Espelho: no lugar da samambaia da parede da Avenida e do Terraço (`DECOR_POS[2].samambaia`).
  - Estante de vinhos: no lugar do quadro de giz da Avenida e do Terraço (`DECOR_POS[2].giz`).
  - Cortinas de linho: na janela de `LUXO_JAN` do ponto, como a chita (`drawCortinaLinho(ctx, j)`, linho cru com prega e bandô).
  - Arandelas: duas, na parede do fundo, cada uma no meio do vão entre dois quadros de `LUXO_QUADROS` do ponto (x = (fim de um + começo do outro) ÷ 2; y = o meio da altura dos quadros), acesas (um halo quente, sem animação com `prefers-reduced-motion`).
  - Palmeiras: dois vasos altos com palmeira-ráfis na calçada, um de cada lado da porta do salão, atrás da fila da espera.
  - **No mesmo lugar, o fino ganha:** enquanto a v12.9.1 não tira os simples da Avenida e do Terraço, com o espelho à mostra a samambaia da parede não é desenhada, com a estante a lousa de giz não é desenhada, e com as cortinas de linho a chita não é desenhada.
  - Posição fina (alguns px para cada lado) e tamanho: os que não cobrem mesa, pessoa, quadro, letreiro nem outro enfeite, conferidos na captura.
- **Ícones da lojinha** (`upgradeIcon('d-' + id)`, `src/41-lojinha.js`): um para cada um dos 9 (os 5 novos e os 4 redesenhados), o próprio enfeite em miniatura, como os de hoje.
- **Elogios no Gúgou** (`AVAL_DECOR`): `lata:'Adorei os temperos na lata!'`, `violeta:'Que cactos mais simpáticos na janela!'`, `pendente:'A jiboia no toldo ficou linda!'`, `orqArranjo:'Que bonsai mais caprichado!'`, `espelho:'Que espelho mais elegante!'`, `palmeira:'As palmeiras na entrada são um luxo!'`, `vinhos:'Que estante de vinhos caprichada!'`, `cortina:'Que cortinas de linho mais finas!'`, `arandela:'As arandelas deixam a luz uma beleza!'`.
- **Modo dev:** o "toda a decoração" (`devDecor`) e o "Ir para o ponto" já põem todo enfeite do `nivel` do ponto para baixo; os 5 novos entram sozinhos.
- **Manual:** nada (a ficha `l-luxo` muda na v12.9.1).
- **Save:** nada novo (ids novos em `save.decor`; os renomeados mantêm o id).
- **Versão:** `VERSAO` e `vtag` em v12.9; linha no `#ov-ver`: **"Enfeites novos na Avenida e no Terraço: espelho, palmeiras, cortinas de linho, arandelas e estante de vinhos. A foto da dona Rosa ganha moldura dourada."**

## Critérios de aceite
- **CA1** O `DECOR` tem os 5 enfeites novos com grupo, nome, preço, `nivel` e luxo da tabela → `smoke115` (1)
- **CA2** Os 4 renomeados têm o nome novo e o preço, o luxo e o `nivel` de antes → `smoke115` (2)
- **CA3** O `AVAL_DECOR` tem o elogio de cada um dos 9, com o texto da Regra → `smoke115` (3)
- **CA4** O ícone da lojinha de cada um dos 9 sai sem erro → `smoke115` (4)
- **CA5** Na aba Luxo da lojinha, na Avenida, aparecem os cartões dos 5 novos com o nome e o preço; na área industrial, nenhum deles → `smoke115` (5)
- **CA6** Desenhar o salão (o `render` do jogo) na Avenida e no Terraço, com toda a decoração à mostra (`devDecor(true)`), e na Garagem e na área industrial com os temperos, os cactos e a jiboia, sai sem erro → `smoke115` (6)
- **CA7** O que se vê → captura `shot_v12_9.js`: a Avenida e o Terraço com toda a decoração (a parede do fundo, a janela, a calçada da porta e o pedestal do bonsai, ampliados), a área industrial com os cactos e a jiboia, a Garagem com os temperos, a foto da dona Rosa nos quatro pontos e a aba Luxo da Avenida com os ícones

## Partes
- `src/10-constantes.js`: `DECOR` (os 5 novos e os 4 nomes), `AVAL_DECOR`, `VERSAO`.
- `src/21-cenario.js`: `drawFotoRosa` (a moldura dourada), `drawTemperos`, `drawCactos`, `drawJiboia`, `drawBonsai`, `drawEspelho`, `drawEstanteVinhos`, `drawCortinaLinho`, `drawArandela`, `drawPalmeira` (novas) e os pontos em que o cenário chama os enfeites (`drawDecorParede` e os trechos de `decorOn` das linhas da janela, da calçada e do foyer); `src/23-render.js`, se as palmeiras ou as arandelas precisarem entrar na ordem de profundidade (como o lustre e as luminárias).
- `src/41-lojinha.js`: `upgradeIcon` (os 9 ícones).
- `src/02-telas.html`: `vtag`, `#ov-ver`.

## Tarefas
- [ ] T1 `smoke115` com CA1 a CA6 (falhando), no `run_all.sh`.
- [ ] T2 `DECOR`, os nomes e o `AVAL_DECOR`.
- [ ] T3 Os 4 redesenhos (temperos, cactos, jiboia, bonsai) e a moldura dourada da foto, no cenário e nos ícones.
- [ ] T4 Os 5 enfeites novos no cenário da Avenida e do Terraço (com a regra "no mesmo lugar, o fino ganha") e nos ícones.
- [ ] T5 `shot_v12_9.js` (CA7): conferir os recortes ampliados, ajustar posição e tamanho, apagar as capturas.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões), `docs/RESUMO.md`, `docs/PARTES.md`, a tabela Situação do `docs/PLANO.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Os desenhos dos enfeites seguem o traço dos de hoje (`fs(ctx, cor, espessura)` com contorno `PAL.tinta`, `rr`, `circ`, `ell`); o dourado do Terraço é o `TE_OURO`. Reaproveite `drawSamambaia` só como referência de folhagem: a jiboia tem folha em coração.
- O `shot_v12_8.js` mostra como montar o save de um ponto com `L.normSave` e abrir a lojinha numa aba; o `devDecor(true)` precisa de `L.DEV.on = true`.
- A lousa de giz é desenhada à parte (`edDesenho` e `drawGiz` com o prato do dia): a regra "o fino ganha" vale também para ela.

## Testes
- `smoke115` novo, no `run_all.sh`.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões.
- `shot_v12_9.js` novo (capturas em `capturas/v12_9`, apagadas no fim).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (9 desenhos novos no canvas, conferidos por captura, em duas partes de desenho)
