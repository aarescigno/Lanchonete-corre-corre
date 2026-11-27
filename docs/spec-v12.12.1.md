# v12.12.1 — Os outros segredos e a dança da equipe (etapa 20b)

**Situação:** aprovada (27/11)
**Origem:** retorno do usuário de 27/11 no `docs/PROPOSTAS.md` ("easter eggs, os 5 toques nos personagens"), com as sugestões que ele escolheu. Decisões fechadas com o usuário em 27/11 (Opus). Vem depois da v12.12 (`docs/spec-v12.12.md`), que faz os 5 toques e as dancinhas da equipe; esta usa o mesmo mecanismo (`g.eggs`, `eggAt`, `danca`, `Sfx.tiriri`, a ordem do toque no `onDown`).

## Objetivo
Mais segredos do mesmo jeito: o fiscal, os músicos e a Bia grande do menu também respondem aos 5 toques; a campainha nova do balcão chama o Tonhão; no dia da gripe ele espirra; e quem faz todo mundo dançar num dia vê a equipe inteira dançar junta no fim do expediente.

## Fora do escopo
- Outras ideias de surpresa: ficam nas Ideias guardadas do `docs/PLANO.md`.

## Regras (decisões tomadas)
Valem as regras dos 5 toques da v12.12 (1 s entre toques, sem pista, 1,2 s de dancinha, só no desenho, o acerto exato num alvo do jogo vence, o toque não é perdido nem ação no Teste de habilidade, o coraçãozinho parado com `RM`).

### O fiscal (`quem 'fiscal'`, com `g.fiscal.ativo`)
- Área: `g.fiscal.x ± 15`, de `g.fiscal.y − 64` a `g.fiscal.y + 2`.
- A dancinha: de `p` 0 a 0,3, leva a mão à gola, como quem ajeita a gravata; de 0,3 a 0,55, olha para um lado e para o outro (a cabeça desloca ±2 px); de 0,55 a 0,85, um passinho escondido (sobe `6·sin`, vai ±4 px para o lado); de 0,85 a 1, volta à pose séria. Ele segue andando e fiscalizando como sempre.

### Os músicos (`'musico'`, `'trio'`, `'pianista'`, quando tocam no dia)
- Áreas: o do couvert (`drawMusico`, `x` 186, `y` 528): `186 ± 16`, `y` de 440 a 528; o trio (`drawTrio`, cada um em `q.x`, base 534, escala 0,8): `q.x ± 14`, `y` de 464 a 534, e **os três somam na mesma conta** (`'trio'`) e fazem o floreio juntos; o pianista (`drawPianista`): `x ± 16`, de `y − 64` a `y`. Se na captura a área não cobrir a pessoa desenhada (da cabeça ao assento), ajuste os números até cobrir e corrija esta regra.
- O floreio: o triplo de notinhas subindo (`drawNotas` com 3× a quantidade; no do couvert, 6 notinhas no lugar das 2) e o balanço do corpo (`bob`) com o dobro da altura, por 1,2 s.

### A Bia grande do menu (`'biaMenu'`)
- Na tela do menu, a Bia que dá tchau (`drawBia(ctx,b,TW-170,520,{ s:2.3, wave:true, ... })`, `src/23-render.js`) faz a pirueta da Bia (a da v12.12, na escala 2,3, sem os brilhinhos) com 5 toques nela, no retângulo `TW − 170 ± 34`, `y` de 375 a 522.
- O menu é coberto pelo `#ov-menu` (`position:absolute; inset:0`): o toque chega por um `pointerdown` no próprio `#ov-menu` só quando `e.target` é ele mesmo (não um botão nem um cartão), convertido com o `toLogical(e)` de `src/43-telas.js`. O tempo da dancinha anda também no menu.

### A campainha do balcão (`'campainha'`)
- Desenho novo em `drawKitchen`: uma campainha de balcão dourada (base escura e cúpula `TE_OURO_CL` ou um dourado do `PAL`, raio 7) no canto esquerdo do balcão dos pratos, centro (754, 214), **fora de todos os `STATIONS[k].rect`**. Se na captura ela não ficar sobre o balcão, leve-a ao ponto mais perto do canto esquerdo do balcão dos pratos que fique fora dos retângulos das estações e corrija esta regra. Em todos os pontos.
- Área: o círculo de raio 12 em volta do centro, conferido **antes** do `pickAt` (é pequeno e fica fora das estações).
- Cada toque nela faz `Sfx.plim()` (novo: uma nota `sine` de 2093 Hz, 0,15 s, volume 0,06; não é o `Sfx.bell` do prato pronto) e a cúpula afunda 1,5 px por 0,15 s (com `RM`, sem afundar).
- No 5º toque seguido (1 s entre toques), o Tonhão responde: `g.addText(930, 104, 'Já vai, já vai!', PAL.tinta, 15)`, e a conta zera.

### O Tonhão gripado
- No dia da gripe (`g.day.gripe`), os 5 toques no Tonhão (as mesmas regras da v12.12, com a fila vazia) dão, no lugar da touca que pula: **"Atchim!" três vezes**, aos 0, 0,4 e 0,8 s, cada um num lugar perto da cabeça (o texto vermelho que já existe na `drawChef`, à esquerda, acima e à direita), com `Sfx.atchim()` (novo: um `noise` de 0,12 s, volume 0,08, frequência 1800) em cada um, e a touca voa um pouquinho (sobe `24·sin(π·p)` px e inclina `0,4·sin(π·p)` rad). Sem o `Sfx.tiriri`. Com `RM`, os três "Atchim!" aparecem sem a touca voar.
- Conta como a dancinha do Tonhão para "Todos dançaram".

### Todos dançaram
- `g.dancou` (um `Set`, zerado no `resetDay`) guarda quem dançou no dia; `danca(quem)` acrescenta (pelo toque ou pelo modo dev).
- Quem precisa: `'bia'`, `'tonhao'` e cada ajudante que está no dia (`'dani'`, `'joca'`, `'cami'` com `active`; `'anselmo'` com `g.anselmoAtivo`; `'lia'` com `g.liaAtiva`). O fiscal, os músicos e a Bia do menu não contam.
- Quando o expediente acaba pelo tempo (o `ending` com `reason 'time'`, os 2 s antes do Caixa) e todos que precisam estão em `g.dancou`, começa a **festa** (`g.festa = 2`): todos fazem a dancinha deles juntos, duas vezes seguidas (1 s cada), com brilhinhos sobre cada um a cada 0,5 s (`addSparks(x, y − 60, 4, PAL.mostarda)`) e o `Sfx.tiriri` aos 0 e 1 s. Sem texto. No dia da gripe, o Tonhão faz o dele de gripado. Com `RM`, o coraçãozinho parado sobre cada um e sem brilhinhos.
- Só no desenho: o fim do dia, o Caixa e o save seguem iguais.

- **Modo dev:** na seção "Dancinhas" da aba "Hoje" (v12.12), os botões novos `Fiscal`, `Músico`, `Trio` e `Pianista` (quando estão no dia), `Campainha` (o "Já vai, já vai!" na hora), `Bia do menu` (a pirueta da Bia grande, vista ao voltar ao menu) e `Todos dançam` (a festa na hora, sem precisar do fim do dia). O Tonhão gripado sai do botão `Tonhão` com o "Tonhão gripado: Gripado" dos imprevistos.
- **Manual:** nada (é segredo).
- **Save:** nada novo (`g.dancou` e `g.festa` são só da memória do dia).

## Critérios de aceite
- **CA1** 5 toques no fiscal disparam a dancinha dele, e ele segue no mesmo caminho e no mesmo tempo que sem ela → `smoke129` (1)
- **CA2** 5 toques no músico do couvert, no pianista e no trio (em qualquer um dos três, somando) disparam o floreio de cada um → `smoke129` (2)
- **CA3** No menu, 5 toques na Bia grande (pelo `#ov-menu`) disparam a pirueta dela; um toque num botão do menu não conta → `smoke129` (3)
- **CA4** A campainha: cada toque toca o `Sfx.plim`, não vira ação da Bia nem toque perdido, e o 5º põe o "Já vai, já vai!" na tela; o centro dela fica fora de todos os retângulos das estações → `smoke129` (4)
- **CA5** No dia da gripe, os 5 toques no Tonhão dão os três "Atchim!" (aos 0, 0,4 e 0,8 s) e não a touca que pula; no dia sem gripe, a touca → `smoke129` (5)
- **CA6** Com a Bia, o Tonhão e os ajudantes do dia em `g.dancou`, o fim do dia pelo tempo põe `g.festa` em 2 e todos dançam; faltando um, não; o resultado do dia (o lucro, as estrelas e o save) é o mesmo com e sem a festa → `smoke129` (6)
- **CA7** O modo dev tem os botões novos e cada um dispara o seu → `smoke129` (7)
- **CA8** O que se vê → captura `shot_v12_12_1.js` (960x540): o fiscal, o músico do couvert, o trio, o pianista e a Bia do menu em três momentos (`p` 0,25, 0,5 e 0,75); a campainha parada e afundada, na Garagem e no Terraço, e o "Já vai, já vai!"; os três "Atchim!"; a festa com a equipe toda da Avenida; e com `RM`, em recortes ampliados

## Partes
- `src/16-jogo.js`: `eggAt` (as áreas novas e a campainha), `danca`, `onDown`, `update` (a festa), `resetDay` (`g.dancou`, `g.festa`), o começo do `ending` por tempo (a festa).
- `src/11-base.js`: `Sfx.plim`, `Sfx.atchim`.
- `src/21-cenario.js`: `drawFiscal`, `drawMusico`, `drawTrio`, `drawPianista`, `drawKitchen` (a campainha), `drawChef` (o gripado).
- `src/23-render.js`: a Bia grande do menu e a festa.
- `src/40-interface.js`: os botões novos da seção "Dancinhas".
- `src/43-telas.js`: o `pointerdown` do `#ov-menu` e o tempo da dancinha no menu.

## Tarefas
- [ ] T1 Smoke novo `smoke129` com os critérios de aceite (falhando) e no `tests/run_all.sh`.
- [ ] T2 O fiscal e os músicos (as áreas e os desenhos).
- [ ] T3 A Bia grande do menu.
- [ ] T4 A campainha e o "Já vai, já vai!".
- [ ] T5 O Tonhão gripado.
- [ ] T6 Todos dançaram (a festa).
- [ ] T7 O modo dev: os botões novos.
- [ ] T8 `shot_v12_12_1.js` (CA8): conferir em recortes ampliados, ajustar e apagar as capturas.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, o destino no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O fim do expediente pelo tempo é o trecho de `Game.update` com `this.ending = true; this.endTimer = 2.0; this.reason = 'time'` (`src/16-jogo.js`); a festa dura o mesmo `endTimer`, então o Caixa não atrasa.
- O "Atchim!" da gripe já é desenhado na `drawChef` (`txt(ctx,'Atchim!',-26,-34,...)`, piscando); na dancinha de gripado, os três são desenhados à parte, além desse.
- O `drawTouchFx` e os `fx` só aparecem fora do menu: por isso a Bia do menu não tem brilhinhos.

## Testes
- Smoke novo: `smoke129` (CA1 a CA7). Captura: `shot_v12_12_1.js` (CA8).
- Sem mudança no equilíbrio (só desenho e toques que o bot não faz).
- O `smoke86`, o `menu_fit.py` e a lista do `#ov-ver` ganham a linha da v12.12.1.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (muitas partes ao mesmo tempo: o menu, a cozinha, a festa no fim do dia e cinco desenhos novos)
