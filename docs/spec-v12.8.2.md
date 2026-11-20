# v12.8.2 — O entretenimento também nas Melhorias (etapa correção)

**Situação:** entregue em 20/11
**Origem:** conversa de 20/11 (`docs/PROPOSTAS.md`, "o entretenimento nas Melhorias"): "Os itens de entretenimento, como televisão, rádio, sertanejo etc. Tem que ficar nas melhorias, eles destoam no luxo". Na escolha, o usuário pediu os cartões nos dois lugares: "O objetivo de ter em 2 lugares é para o jogador intuir que ele ajuda tanto na diminuição da velocidade de perda de corações quanto na beleza do ambiente." Desde a v10.7 esses cartões estão só na aba Luxo (`buildLuxo`).

## Objetivo
O jogador acha a TV, o som, as TVs com sertanejo, o couvert e a música ao vivo nas Melhorias, junto do que ajuda a paciência das mesas, e continua vendo os mesmos cartões no Luxo, ligados ou não, para entender que eles também deixam o ambiente mais bonito.

## Fora do escopo
- Os pontos de luxo: `luxoPts`, `LUXO.tv`, `LUXO.som`, `LUXO.tvs`, `LUXO.couvert`, `LUXO.musica` e a barra Ambiente não mudam.
- Os efeitos na paciência, os custos e a conta de luz: nada muda.
- Os textos dos cartões e as fichas do Manual (`l-tvsom`, `l-tvs`, `l-couvert`, `l-musica`, `l-luxo`): nada muda.

## Regras (decisões tomadas)
- **Aba Melhorias** (`buildMelhorias`, `src/41-lojinha.js`): depois dos cartões das melhorias e do assento da espera, mostra os cartões de entretenimento do ponto, na mesma ordem e com as mesmas condições de hoje no Luxo:
  - `if (game.ponto.nivel === 1) buildTvSom(grid);`
  - `if (game.ponto.nivel === 2) buildTvs(grid);`
  - `buildCouvert(grid);` (ele mesmo só aparece com `couvertOk`)
  - `buildMusica(grid);` (ele mesmo só aparece com `musicaOk`)
- **Aba Luxo** (`buildLuxo`): fica como está (o quadro, os enfeites, os móveis e os mesmos quatro cartões). É o mesmo cartão nas duas abas, construído pela mesma função: compra, liga e desliga dos dois lados, e o estado ("Ligado: ...", "Já comprado", o modo das TVs) aparece igual nos dois.
- O jeito mais simples: tirar as quatro linhas de `buildLuxo` para uma função `buildEntrete(grid)` e chamar ela nas duas abas.
- Os comentários de `buildMelhorias` e da aba Luxo (linha "v10.7: a TV, o som e as TVs foram para a aba Luxo") passam a dizer que, desde a v12.8.2, os cartões de entretenimento aparecem nas duas abas.
- **Modo dev:** nada novo (o "Ir para o ponto" e o "tudo liberado" já mostram os quatro cartões; no modo dev o couvert aparece antes da Avenida, como hoje).
- **Manual e save:** nada.
- **Versão:** `VERSAO` e `vtag` em v12.8.2; linha no `#ov-ver`: **"A TV, o som, as TVs com sertanejo, o couvert e a música ao vivo aparecem também nas Melhorias."**

## Critérios de aceite
- **CA1** Na Garagem, a aba Melhorias tem o cartão "TV e som" (`data-ficha="l-tvsom"`), e a aba Luxo continua com ele → `smoke112` (1)
- **CA2** Na área industrial, as duas abas têm o cartão das TVs (`l-tvs`) → `smoke112` (2)
- **CA3** Na Avenida, as duas abas têm o Couvert (`l-couvert`); no Terraço, as duas têm a Música ao vivo (`l-musica`) → `smoke112` (3)
- **CA4** Ligar a TV pelo cartão das Melhorias (Garagem) muda `game.save.equipe.tv` e a aba Luxo mostra o cartão ligado; `luxoPts(game).amb` sobe com a TV ligada → `smoke112` (4)
- **CA5** Nenhum cartão de entretenimento de outro ponto aparece nas Melhorias (ex.: na Garagem não há `l-tvs`, `l-couvert` nem `l-musica`) → `smoke112` (5)

## Partes
- `src/41-lojinha.js`: `buildLuxo`, `buildMelhorias` (e a função nova `buildEntrete`, logo depois de `buildLuxo`).
- `src/10-constantes.js` e `src/02-telas.html`: `VERSAO`, `vtag`, `#ov-ver`.

## Tarefas
- [x] T1 `smoke112` com CA1 a CA5 (falhando), abrindo a lojinha em cada ponto e montando as abas Melhorias e Luxo como os smokes da aba Luxo já fazem (ver `smoke` que usa `shopTab = 'luxo'`).
- [x] T2 `buildEntrete` e as chamadas em `buildLuxo` e `buildMelhorias`; comentários.
- [x] T3 `menu_fit.py` (a aba Melhorias fica mais comprida; o topo fixo da lojinha tem de continuar cabendo) e uma olhada numa captura da aba Melhorias da Garagem e do Terraço (conferir e apagar).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86` e `menu_fit.py`: a contagem de linhas do painel de Versões), `docs/RESUMO.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A v12.8.1 (pratos do Terraço, `smoke111`) saiu em 20/11, enquanto esta era planejada: esta é a v12.8.2, com o `smoke112`.
- O selo "novo" por cartão da lojinha (perto da linha 1390 de `src/41-lojinha.js`, v9.0.4) olha as fichas vistas: confira que o cartão nas duas abas não faz a aba Melhorias acender o selo à toa depois de visto no Luxo (`manualVer` usa a mesma ficha).
- Os smokes antigos que abrem a aba Luxo e contam cartões (`smoke15`, `smoke33`, `smoke38`, `smoke40` a `smoke42b`, `smoke53`, `smoke54` aparecem no grep de `'luxo'`) devem continuar verdes sem mudança, porque o Luxo não muda; se algum contar os cartões das Melhorias, ajuste só a contagem.

## Testes
- `smoke112` novo, no `run_all.sh`.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões.

## Decisões em aberto
Nenhuma.

## Desvios
- `buildEntrete` fica logo depois de `buildLuxo`; o selo "novo" não mudou (a mesma ficha, `manualVer`).
- O `smoke86` e o `menu_fit.py` estavam com a contagem das Versões atrasada desde a v12.8 (25 linhas, v12.7 como atual): agora 28 linhas e v12.8.2. Eram falhas antigas, e o `run_all.sh` só mostra o resumo.
- T3: `menu_fit.py` verde (742 conferências, 0 falhas); a captura da aba não foi tirada (o smoke monta as duas abas em cada ponto).
- `smoke112`: 9 checagens, `run_all.sh` verde.

**Modelo:** Sonnet, esforço médio (código de jogo com plano fechado, pequeno; o smoke monta a lojinha em cada ponto)
