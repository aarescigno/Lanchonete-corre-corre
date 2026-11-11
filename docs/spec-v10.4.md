# v10.4 — Música, flores e o rebalanceamento do Terraço (etapa 4a-5)

**Situação:** entregue em 11/11
**Origem:** `docs/PLANO.md`, sessão 4a-5 (planejada em 10/11, com as decisões da 4a em "Terraço Suíça: decisões de 10/11"); pedidos de ambiente do nível 4 de 21 e 22/10 (`docs/PROPOSTAS.md`). Levada para este formato em 11/11.

## Objetivo
No Terraço, o salão ganha música ao vivo: um quarteto de cordas ou um pianista ao piano de cauda, que deixam as mesas mais pacientes e o ambiente mais bonito. O foyer ganha flores finas. Com a equipe toda do Terraço no lugar, os números do ponto são acertados para o jogo ficar desafiador sem ficar impossível.

## Fora do escopo
- O nível de luxo, e o pianista somando nele: 4b (v10.5).
- Música em outros pontos: a Garagem fica com TV e som, a área industrial com as TVs e a Avenida com o couvert.
- Mudar os números da Garagem, da área industrial e da Avenida: só se confere que não saíram das faixas.

## Regras (decisões tomadas)
- **Música no Terraço** (`equipe.musica`: 0 desligada, 1 quarteto, 2 pianista; só com `ponto.nivel === 4`):
  `TERRACO.musica = [ null, { nome:'Quarteto de cordas', pay:150, effect:0.3, amb:1 }, { nome:'Pianista', pay:120, piano:30, effect:0.2, amb:1.5 } ]`. O plano dava 20% aos dois; decidido em 11/11 que o quarteto segura mais as mesas (30%) e o pianista sobe mais a nota (+1,5), para os dois valerem a escolha pelo mesmo preço.
  - `effect` soma em `ambienteEffect` (a paciência nas mesas cai 30% mais devagar com o quarteto e 20% com o pianista), como o couvert; `amb` soma no critério Ambiente do Gurugol (`Game.avaliar`), no lugar do `A.amb.couvert`.
  - `payroll`: o quarteto soma 150; o pianista soma 120 + 30 (a afinação do piano), mostrados juntos na folha como **"Pianista e afinação"** (`folhaItens`: "quarteto de cordas" ou "pianista e afinação").
  - Sem taxa de couvert no Terraço.
  - **Cartão na lojinha**, no lugar do cartão do couvert quando o ponto é o Terraço: título "Música ao vivo", ficha `l-musica`, três botões como os das TVs (`buildTvs`): "Sem música", "Quarteto de cordas · R$ 150/dia" e "Pianista · R$ 150/dia" (a diária mostrada já soma a afinação), com "Ligado: " no escolhido. Desabilitado o que a folha não paga (mesma conta do `buildTvs`). `Game.setStaff('musica', n)` recusa fora do Terraço.
- **O couvert é só da Avenida:** `couvertOk(ponto)` passa a ser `ponto.nivel === 3`, com o modo dev liberando também nos níveis 1 e 2, mas nunca no Terraço (decidido em 11/11). `normEquipe` desliga `couvert` e `taxa` fora do nível 3, e a troca de ponto desliga também. `musica` fica 0 fora do nível 4. No `PONTOS` da Avenida, o `deixa` vira "os sofás, as águas saborizadas e o couvert ficam".
- **Folha:** `FOLHA_CORTE` ganha `['musica', 'música']` em **primeiro** lugar (antes do couvert); `folhaCorta` zera `eq.musica`.
- **Desenho** (`21-cenario.js`; entra na lista de profundidade do `23-render.js`, como o `drawMusico` do couvert):
  - **Pianista:** senta na banqueta do piano (`TERRACO.piano`), de roupa escura; com ele no dia, a tampa do piano aparece aberta (`drawPiano` com a tampa levantada).
  - **Quarteto:** dois violinos, viola e violoncelo, quatro pessoas variadas (tons de pele, cabelos e idades diferentes, sem estereótipo), de roupa escura, sentadas em fila no pé do salão, à direita do piano (x de 190 a 340, chão em y 528), sem ser obstáculo (fora do `OBST`).
  - Notinhas musicais sobem enquanto tocam; com `prefers-reduced-motion`, ficam paradas (sem notinha subindo nem arco mexendo). Nome de música, se aparecer, é inventado.
  - Só nos dias de jogo com a música ligada, e não no menu (como o couvert hoje).
- **Flores do foyer** (`DECOR`, grupo `plantas`, `nivel:4`, `amb:0.2` cada; só no Terraço, ou em qualquer ponto no modo dev, como as outras de `nivel`):
  - `{ id:'ikebana', name:'Ikebana', cost:90 }`: num vaso baixo, sobre uma mesinha de canto ao lado do elevador.
  - `{ id:'orqArranjo', name:'Arranjo de orquídeas', cost:120 }`: num pedestal dourado, no canto de baixo do foyer.
  - `{ id:'campo', name:'Flores do campo', cost:70 }`: num vaso de cerâmica, no chão, perto da porta do salão.
  - Nenhuma cobre as poltronas, as vagas de espera, o elevador, o letreiro nem o carrinho de boas-vindas (conferido na captura).
  - `AVAL_DECOR` ganha: `ikebana`: "Que ikebana mais elegante!", `orqArranjo`: "O arranjo de orquídeas é um espetáculo!" e `campo`: "Adorei as flores do campo!".
- **Manual:** ficha nova `{ id:'l-musica', aba:'lojinha', nome:'Música ao vivo', linha:'Quarteto ou pianista: a paciência nas mesas dura mais e o ambiente melhora.' }`, revelada quando o cartão aparece (`manualVer`). As flores entram na ficha da decoração já existente, se ela citar as plantas por ponto. As fichas do Terraço (`l-assento`, `l-maquina`, as da equipe) são relidas para conferir se falam de tudo o que entrou na 4a; ficha que estiver errada é corrigida sem números.
- **Modo dev:** no Terraço, o cartão "Música ao vivo" troca entre os três modos de graça (o `devLivre` já paga a folha); o painel do modo dev ganha, na aba Hoje, o botão **"Música: trocar"**, que passa por sem música → quarteto → pianista no dia em curso, só no Terraço (decidido em 11/11). A música não existe fora do Terraço, nem no modo dev. As flores ficam liberadas na Decoração, como as outras.
- **Save:** `equipe.musica` novo (0 se faltar); `normDecor` aceita os três ids novos. Um save da v10.3 carrega igual; se estiver no Terraço com `couvert: true`, chega com `couvert` e `taxa` desligados e `musica: 0`.
- **Rebalanceamento do Terraço** (molde da 3b-7: só números, um por vez, medindo de novo; no máximo 3 mudanças por rodada, cada uma registrada em Testes). Medidas: `PONTO=terraco node balance.js 80` com a equipe toda (`BOT=afiado EQUIPE=auto`, com `ALTA=1 LIA=1 CAMI=4 CAFESESP=1 AUTOR=1 MUSICA=2`) e `DIAS=75 node carreira.js 12`. Os passos de ajuste, nesta ordem de prioridade:
  1. **Metas** (equipe toda entre 85% e 95%): acima de 95%, `metaF` sobe 0,5 de cada vez (9 → 9,5 → 10...); abaixo de 85%, desce 0,5.
  2. **3ª estrela** (3★ do bot afiado em ~60%, aceito entre 50% e 70%): acima de 70%, `expertF` sobe 0,5; abaixo de 50%, desce 0,5.
  3. **Grupos perdidos** (o afiado perde no máximo 1 grupo por dia, média): acima disso, `grupos` desce de 0,50 para 0,45.
  4. **Ganho sobre a Avenida** (entre R$ 400 e R$ 900 por dia, pelo `carreira.js` contra `MUDA=2`): acima de R$ 900, `aluguel` sobe de 1.200 para 1.500 e, se ainda passar, para 1.800 (decidido em 11/11: o aluguel já era 1.200 desde a v10); abaixo de R$ 400, desce para 1.000.
  5. **Dias no negativo depois da mudança:** 0. Se houver, o primeiro passo é desfazer a última subida de aluguel.
  6. **Nota do Gurugol** com a equipe toda, entre 4,4 e 4,8: acima de 4,8, a música perde 0,25 de `amb` (pianista 1,25 e quarteto 0,75); abaixo de 4,4, as flores sobem para `amb:0.3`.
  7. **Cap. 9 em até 15 dias** no Terraço, em pelo menos 2/3 das carreiras (`carreira.js`, linha `HISTORIA`): se não, `HISTORIA` cap. 9 `obj.completas` 6 → 5.
  - Os outros pontos não mudam: `node balance.js 40` e `PONTO=industrial|avenida node balance.js 40` continuam nas faixas do `docs/TESTES.md`.

## Critérios de aceite
- **CA1** O cartão "Música ao vivo" só aparece no Terraço; as diárias são 150 (quarteto) e 120 + 30 (pianista); a paciência nas mesas fica 30% mais lenta com o quarteto e 20% com o pianista (`ambienteEffect`); no Ambiente do Gurugol somam +1 e +1,5; a folha mostra "pianista e afinação" → `smoke66` (1)
- **CA2** O couvert não aparece no Terraço (nem no modo dev); um save no Terraço com couvert ligado chega desligado; o `deixa` da Avenida cita o couvert → `smoke66` (2)
- **CA3** Sem dinheiro para a folha toda, a música é a primeira a sair → `smoke66` (3)
- **CA4** As 3 flores só aparecem na Decoração do Terraço (e no modo dev), custam 90, 120 e 70 e somam +0,2 cada no Ambiente; cada uma tem o seu elogio → `smoke66` (4)
- **CA5** A ficha `l-musica` existe e é revelada quando o cartão aparece → `smoke66` (5)
- **CA6** O botão "Música: trocar" do modo dev passa pelos três modos no Terraço e não faz nada fora dele → `smoke66` (6)
- **CA7** Um save da v10.3 carrega igual (sem `musica`, ganha 0) → `smoke66` (7)
- **CA8** Equipe toda no Terraço entre 85% e 95% das metas, 3★ do afiado entre 50% e 70%, no máximo 1 grupo perdido por dia → `PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=4 CAFESESP=1 AUTOR=1 MUSICA=2 node balance.js 80` (ajustes pelos passos 1 a 3 das Regras)
- **CA9** Ganho sobre a Avenida entre R$ 400 e R$ 900 por dia, 0 dias no negativo depois da mudança, nota do Gurugol entre 4,4 e 4,8, cap. 9 em até 15 dias em pelo menos 2/3 → `DIAS=75 node carreira.js 12` (ajustes pelos passos 4 a 7)
- **CA10** Os outros pontos não saem das faixas → `node balance.js 40` e `PONTO=industrial|avenida node balance.js 40`
- **CA11** O visual: o pianista ao piano com a tampa aberta, o quarteto em fila sem cobrir mesa nem caminho, as notinhas (e paradas com `prefers-reduced-motion`), as 3 flores no foyer, o cartão da música na lojinha, a folha no fim do dia, o celular deitado (740×360) e as **Checagens de fim de sessão** do Terraço (`docs/PLANO.md`) → capturas `tests/shot_v10_4.js` (olhar e apagar)

## Partes
- `10-constantes.js`: `TERRACO`, `STAFF.couvert`, `couvertOk`, `ambienteEffect`, `payroll`, `FOLHA_CORTE`, `folhaCorta`, `folhaItens`, `PONTOS` (Avenida `deixa`; Terraço `metaF`, `expertF`, `grupos`, `aluguel`), `DECOR`, `AVAL_DECOR`, `AVAL.amb`, `HISTORIA` (cap. 9, se o passo 7 pedir), `MANUAL`.
- `12-clientes.js`: `normEquipe` (e a normalização do save).
- `16-jogo.js`: `avaliar` (o Ambiente), `setStaff`, a troca de ponto.
- `21-cenario.js`: `drawPiano`, o desenho do pianista e do quarteto, as flores do foyer (perto do `drawFoyerTe` e das flores da calçada).
- `23-render.js`: a lista de profundidade (o músico do couvert e o piano).
- `41-lojinha.js`: `buildCouvert` e o cartão novo da música; a Decoração.
- `40-interface.js`: o mapa das fichas do Manual para o ícone (`'l-musica'`).
- O painel do modo dev (aba Hoje): achar com `tests/mapa.sh dev`.
- `tests/bot.js`, `tests/balance.js` e `tests/carreira.js`: a chave `MUSICA`, sem couvert no Terraço.

## Tarefas
- [x] T1 `tests/smoke66.js` com os critérios CA1 a CA7 (falhando), no `tests/run_all.sh`.
- [x] T2 Constantes: `TERRACO.musica`, `couvertOk`, `ambienteEffect`, `payroll`, `FOLHA_CORTE`, `folhaCorta`, `folhaItens`, o `deixa` da Avenida.
- [x] T3 Save: `normEquipe` com `musica` e o couvert só no nível 3; a troca de ponto.
- [x] T4 O Ambiente do Gurugol com a música.
- [x] T5 O cartão "Música ao vivo" na lojinha, no lugar do couvert no Terraço.
- [x] T6 O desenho do pianista (tampa aberta) e do quarteto, com as notinhas e o `prefers-reduced-motion`.
- [x] T7 As 3 flores do foyer: `DECOR`, `AVAL_DECOR` e o desenho.
- [x] T8 Manual: `l-musica` e as fichas do Terraço conferidas.
- [x] T9 Modo dev: o botão "Música: trocar".
- [x] T10 `bot.js`, `balance.js` e `carreira.js`: `MUSICA` (padrão 2 no Terraço), sem couvert no Terraço; a carreira contrata o pianista quando sobra R$ 300 depois da folha.
- [x] T11 Rebalanceamento pelos passos das Regras, com a tabela medida em Testes.
- [x] T12 Capturas `tests/shot_v10_4.js` com as Checagens de fim de sessão do Terraço; olhar e apagar.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, a etapa arquivada no `docs/PLANO-FEITO.md`, `tests/run_all.sh --tudo` verde, PR e merge.

## Testes
- **`tests/smoke66.js` (novo;** o plano o chamava de `smoke64`, número já usado pela D-2): uma checagem por critério, de CA1 a CA7.
- Smokes antigos que podem mudar: os que ligam o couvert no Terraço ou contam `FOLHA_CORTE` (conferir `smoke60` e `smoke65`; ajustar o número, não a regra).
- `balance.js`: o `FULL` do Terraço perde `couvert` e `taxa`; chave nova `MUSICA=0|1|2` (padrão 2 no Terraço).
- No fechamento: quantas checagens o `smoke66` tem e a tabela de calibração (cada mudança, antes e depois).

## Decisões em aberto
Nenhuma. (Fechadas em 11/11: o quarteto com 30% de paciência; couvert nunca no Terraço e música só no Terraço, também no modo dev, com o botão no painel; o aluguel sobe para 1.500 e depois 1.800. Na execução, o usuário decidiu baixar o cardápio, ver Desvios.)

## Medido
- `tests/smoke66.js`: 46 checagens (CA1 a CA7 e o desenho dos 3 modos), no `run_all.sh`. `smoke3` (flaky, passa sozinho), `smoke6`, `smoke30`, `smoke53` e `smoke60` ajustados (o número, não a regra: couvert e taxa só na Avenida, 15 enfeites, 66 fichas, cardápio e metas do Terraço).
- Terraço, 80 rodadas, `BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=4 CAFESESP=1 AUTOR=1 MUSICA=2 JOCA=4 CONFEITARIA=1` (a equipe toda de verdade; o comando do CA8 sem `JOCA`/`CONFEITARIA` não contrata Joca, Cami nem Anselmo):

| Mudança | Antes | Depois |
|---|---|---|
| (partida: música e cursos da 4a-3/4a-4) | metas 100%, 3★ 100%, ganho sobre a Avenida ~R$ 2.800/dia | — |
| `cardapio` 2,4 → 1,3 (decisão do usuário; com aluguel 1.200) | ganho ~R$ 2.800 | ~R$ 850 (1,6 dava 1.337, 1,6 com aluguel 1.500 dava 8 dias no negativo, 1,4 dava 970) |
| `metaF` 9 → 12 (passo 1, em saltos medidos) | metas 98–99% | ~90% |
| `expertF` 6 → 8,5 (passo 2) | 3★ 92% | ~60% (61% com o pianista, 69% com o quarteto) |
| música `amb` 1 → 0,75 e 1,5 → 1,25 (passo 6) | nota 4,86 | 4,86 (o bot afiado fica no teto; na carreira a nota é ~4,7) |

- `DIAS=75 node carreira.js 12`: ganho do Terraço sobre a Avenida R$ 868 por dia (Avenida sozinha, `MUDA=2`: R$ 934), 0 dias no negativo depois da mudança, nota do Gurugol ~4,7, cap. 9 em 1 a 2 dias depois do cap. 8 (12/12).
- Outros pontos: `balance.js 40` da Garagem, da área industrial e da Avenida sem mudança (antes e depois iguais).

## Desvios
- **Rebalanceamento fora dos passos da spec (pedido ao usuário e aprovado):** com as regras da 4a-3 e 4a-4 o Terraço dava ~R$ 2.800 por dia a mais que a Avenida, e o aluguel até 1.800 só levava a ~R$ 2.200. O usuário mandou baixar o cardápio do Terraço (×2,4 → ×1,3); `metaF` e `expertF` foram achados por varredura (`PONTO_CFG`) em saltos de 0,5 a 1, em vez de um passo de 0,5 por rodada, e o aluguel ficou em 1.200.
- **O comando do CA8 da spec não contrata a equipe toda** (falta `JOCA=4 CONFEITARIA=1`); a calibração usou a equipe toda. Com o comando literal (só Tonhão, Dani, Lia e música) e os números novos, o afiado passa só 33% das metas e 2% das 3★; o `carreira.js` (bot comum, equipe contratada aos poucos) passa ~30 a 70% das metas dos últimos dias. Se isso for difícil demais para quem joga, é a primeira coisa a rever (aluguel ou `metaF`) na 4b ou no polimento.
- **Regras corrigidas:** a música soma `amb` 0,75 (quarteto) e 1,25 (pianista), não 1 e 1,5; o Terraço passa a ter cardápio ×1,3, metas ×12 e 3ª estrela ×8,5 (aluguel 1.200, grupos 0,50).
- **Nota do Gurugol do bot afiado ficou em 4,86** (acima de 4,8) mesmo com o passo 6 aplicado: o `balance.js` satura perto de 4,9; a carreira (4,7) está na faixa.
- **O `smoke66` é de v10.4** (o plano dizia `smoke64`). `menu_fit.py` não rodou neste ambiente (falta o `playwright` do Python); o menu não foi mexido.
- **Capturas** tiradas e apagadas: pianista com a tampa aberta, quarteto (depois de diminuído e baixado para não cobrir as cadeiras da mesa 3), flores no foyer, cartão da música (o ícone virou um violino) e celular deitado (740×360).

**Modelo:** Sonnet, esforço alto. Os itens seguem moldes, mas o rebalanceamento é por tentativa, olhando o Terraço inteiro, e há desenho novo (pianista e quarteto).
