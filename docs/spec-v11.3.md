# v11.3 — As conversas do arco: o motor e as 7 da Garagem e da área industrial (etapa 8c)

**Situação:** entregue em 14/11
**Origem:** `docs/ARCO.md` §6 e §12 (roteiro fechado na entrevista de 14/11; pedido em `docs/PROPOSTAS.md`); etapa 8c do `docs/PLANO.md`. Aprovada em 14/11.

## Objetivo
A Bia, o Tonhão, a Dani e o Joca passam a conversar por conta própria no fim de certos dias da Garagem e da área industrial: o desânimo da Bia e a resposta do tio, o elogio da freguesa, a Dani e o prato quebrado, o caderno do caixa, o pudim devolvido, o Joca calado e o motoqueiro. Uma conversa por fim de dia, só no Modo História, quando o dia dá o motivo.

## Fora do escopo
- As 10 entradas da Avenida e do Terraço (§7): v11.4. O Bráulio em cena (§9): v11.6.
- O retrato no balão e as expressões (`e` só é guardado no texto): v11.5.
- Do `docs/ARCO.md` §7 em diante: nada.

## Regras (decisões tomadas)
Copiadas de `docs/ARCO.md` §6, sem mudança de texto. Notação: `quem [expressão] (nota): texto`; a expressão vira o campo `e` da fala (`{ q, e?, nota?, s }`); sem colchete, sem campo `e`.

### 6.1 O motor (`ARCO`)
- Lista `ARCO` em `src/10-constantes.js`, depois de `LIBERA`, no mesmo molde: `{ id, nivel, quando:(sv, g) => bool, falas }` (e `falasB`, quando houver versão alternativa, com `qualB:(sv) => bool`).
- `save.arco`: um valor por `id`: `0` (não vista), `'pend'` (toca no próximo cartão de fim de dia) ou `1` (vista). `normSave` (em `src/12-clientes.js`, como `save.libera`) cria o campo.
- **Só no Modo História** (`histLiga()`), no fim do dia, depois de resolver capítulo e `LIBERA` (em `src/16-jogo.js`, onde `convQuit` e `convPlanta` são marcadas): se nenhuma entrada está `'pend'`, a **primeira** da lista, na ordem, com `nivel` igual ao do ponto de agora, valor `0` e `quando` verdadeiro passa a `'pend'`. **Uma por fim de dia.** Não marca no dia em que o banco tomou a lanchonete.
- Toca na fila de conversas de `src/43-telas.js` **por último** (depois das de capítulo, das `HIST_*` e da `LIBERA`), com `falar(...)`; ao terminar, vira `1` e grava.
- **Save antigo** (sem `save.arco`): entradas de `nivel` menor que o do ponto de agora nascem `1`; as outras, `0`. Quem muda de ponto com entradas `0` do ponto anterior: passam a `1` (não tocam mais).
- **Modo dev:** as entradas entram na lista de conversas para assistir (`src/43-telas.js`, onde está `'Cartão: ' + L.id`), com o rótulo `Arco: <id>`; o "Conversas: vistas" marca todas como `1`.
- `window.__lcc` expõe `ARCO`.

### 6.2 Garagem (`nivel` 1), nesta ordem
**`desanimo`** — `quando`: o dia que terminou é o 3º ou depois e fechou no negativo; ou é o 6º dia ou depois.
- bia [insegura] (sentada no degrau, com a foto da mãe na mão): Tio... e se eu não for como a mãe?
- bia [insegura]: Peguei dívida, errei pedido, deixei gente esperando. Acho que não nasci pra isso.
- tonhao: A Rosa queimou o arroz no primeiro dia da Casa Aurora. Chorou na despensa.
- tonhao [firme]: No outro dia, voltou. Você não precisa ser ela, Bia. Só precisa voltar amanhã.
- bia [firme] (levantando): ...Amanhã eu abro o portão.

**`elogio`** — `quando`: `desanimo` vista e o dia fechou com 2 estrelas ou mais.
- bia [alegre]: Tio! Uma senhora disse que fazia tempo que ninguém atendia ela com tanto carinho.
- tonhao: E quem atendeu?
- bia [alegre]: ...Eu.
- tonhao: Então guarda isso. Em dia ruim, você vai precisar.

**`daniPrato`** — `quando`: a Dani está contratada e veio no dia, e `elogio` vista.
- dani [insegura]: Quebrei dois pratos hoje, Bia. Desculpa. Eu sou lenta e ainda estrago as coisas.
- bia: Sabe quantos pedidos eu errei na primeira semana?
- dani: Quantos?
- bia [alegre]: Perdi a conta. O tio me disse que é só voltar amanhã. Volta amanhã, Dani.

### 6.3 Área industrial (`nivel` 2), nesta ordem
**`caderno`** — `quando`: `save.cap` é 5 ou mais e o dia fechou no azul.
- tonhao: Bia, me passa o caderno do caixa pra eu conferir.
- bia [firme]: Já fechei, tio. Bateu até o último real.
- tonhao (folheando o caderno): ...Bateu mesmo. Desde quando você faz isso sozinha?
- bia [alegre]: Desde a semana passada. O senhor é que não reparou.
- tonhao [alegre]: Então o caderno é seu.

**`daniDoce`** — `quando`: `save.daniCursos.confCaseira` e o Joca contratado.
- dani [insegura]: Devolveram meu pudim, Bia. Disseram que tava mole. Acho melhor eu voltar pra louça.
- bia [firme]: A louça agora é do Joca. E o doce é seu.
- dani: E se devolverem de novo?
- bia [alegre]: Aí você faz outro. Pudim mole a gente conserta. Desistir, não.

**`jocaCalado`** — `quando`: o Joca contratado e `daniDoce` vista.
- dani: O Joca não abre a boca, Bia. O freguês pergunta e ele aponta pra mim.
- joca [insegura]: É que eu sou só o da louça...
- bia [firme]: Aqui não tem "só", Joca. Sem prato limpo, ninguém almoça.
- joca [alegre]: ...Amanhã eu digo bom-dia.

**`motoqueiro`** — `quando`: `save.cap` é 5 ou mais, a Dani veio no dia e o dia teve ao menos uma marmita entregue.
- dani [insegura]: Aquele motoqueiro gritou comigo de novo por causa da marmita...
- tonhao [brava]: Deixa que eu vou lá fora falar com ele.
- bia [firme]: Deixa, tio. O salão é comigo.
- bia [firme] (voltando da calçada): Falei com ele: aqui se pede com educação, ou se pede em outro lugar.
- dani [alegre]: E ele?
- bia [alegre]: Pediu desculpa. E mais uma marmita.


### De onde vem cada dado do `quando` (a execução leu o código; nada foi inventado)
- `quando(sv, g)` recebe o save e o jogo (`this` do `finishDay`). O dia que terminou é `g.day.n`; as marmitas entregues no dia, `g.stats.marmitas`.
- As estrelas do dia e o lucro do dia eram variáveis locais do `finishDay`; passam a ficar em `g.fimDia = { stars, lucro }` (o `lucro` é o `m` do dia, o mesmo que `capAzul` usa: azul é `m > 0`, negativo é `m < 0`).
- "A Dani está contratada e veio no dia": `sv.equipe.dani > 0` (a folha só rebaixa a Dani, nunca a deixa de fora). "O Joca contratado": `sv.equipe.joca > 0`. `save.cap`, `save.daniCursos.confCaseira` e `save.arco` vêm do save.

## Critérios de aceite
- **CA1** (`ARCO` existe em `src/10-constantes.js` com as 7 entradas, ids, `nivel` e ordem de §6.2 e §6.3; as falas têm o texto, o `e` e a rubrica exatos; nenhuma passa de 120 letras; o `e` é um dos cinco) → `smoke79` (1, 2)
- **CA2** (`save.arco` tem um valor por `id`; save sem ele nasce com 1 nas entradas de `nivel` menor que o do ponto e 0 nas outras; `normSave` mantém `'pend'`, 1 e 0) → `smoke79` (3, 4)
- **CA3** (no fim do dia, só no Modo História, a primeira entrada do `nivel` do ponto, valor 0 e `quando` verdadeiro passa a `'pend'`; uma só por fim de dia; nenhuma se já há uma `'pend'`) → `smoke79` (5, 6)
- **CA4** (os gatilhos: `desanimo` (3º dia no negativo, ou 6º dia), `elogio`, `daniPrato`, `caderno`, `daniDoce`, `jocaCalado`, `motoqueiro`, cada um com o dado de §6.2 e §6.3) → `smoke79` (7, 8)
- **CA5** (não marca fora do Modo História, nem no dia em que o banco tomou a lanchonete) → `smoke79` (9)
- **CA6** (a conversa toca por último na fila de fim de dia, depois das de capítulo e da `LIBERA`, ao terminar vira 1; o limite de conversas do dia continua valendo: não coube, fica `'pend'`) → `smoke79` (10, 11)
- **CA7** (a mudança de ponto passa a 1 as entradas 0 de `nivel` menor) → `smoke79` (12)
- **CA8** (modo dev: `Arco: <id>` na lista de conversas para assistir; "Conversas: vistas" marca todas como 1; "Deixar pendentes as do dia" não mexe no motor) → `smoke79` (13)
- **CA9** (`window.__lcc` expõe `ARCO`) → `smoke79` (14)
- **CA10** (`node carreira.js` com a História chega ao Fim como antes) → `DIAS=120 node carreira.js 10` (o Fim em 10 de 10)

## Partes
- `src/10-constantes.js`: `ARCO` (depois de `LIBERA`).
- `src/12-clientes.js`: `normArco` (molde `normLibera`) e `save.arco` no `normSave`.
- `src/16-jogo.js`: `finishDay` (`g.fimDia` e a marcação `'pend'` depois do bloco da `LIBERA`), `trocaPonto` (passa a 1 as entradas 0 de `nivel` menor), `devConversas`, `devCenas`.
- `src/43-telas.js`: `fluxoHistoria` (último passo da lista), `window.__lcc` (`ARCO`).

## Tarefas
- [x] T1 Smoke novo `tests/smoke79.js` (CA1 a CA9), falhando, incluído no `tests/run_all.sh`.
- [x] T2 `ARCO` e `normArco`.
- [x] T3 A marcação no `finishDay` e a mudança de ponto.
- [x] T4 O toque em `fluxoHistoria`, o modo dev e `__lcc`.
- [x] T5 Atualizar smokes antigos que quebrarem.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PLANO.md` (8c feita, texto arquivado), esta spec como entregue, `tests/run_all.sh` verde, commit local.

## Testes
- `tests/smoke79.js` (novo): 35 checagens, para CA1 a CA9 (CA4 conferido por `quando` com jogo de mentira; CA3, CA5, CA6 e CA7 jogando o fim do dia de verdade).
- `tests/smoke64.js`: a contagem de `devCenas` soma `ARCO.length` (sem mudar o que confere).
- Medido: `run_all.sh` verde (`smoke79` 35 de 35); `DIAS=120 node carreira.js 10`: os caps. 1 a 14 em 10 de 10 carreiras e a 1ª noite da estrela em 10 de 10 (dia mediano 60, como na v11.2).

## Decisões em aberto
Nenhuma.

## Desvios
- **Smoke escrito antes, falhando** (como manda o SDD); os textos e o `ARCO` foram gerados do mesmo roteiro (`docs/ARCO.md` §6) por script.
- **`g.fimDia`** (novo, `{ stars, lucro }`): as estrelas e o lucro do dia eram variáveis locais do `finishDay`; o `quando` os lê do jogo, como o roteiro pede (`quando(sv, g)`).
- **Dani "veio no dia"** = `sv.equipe.dani > 0` (a folha só rebaixa a Dani, não a deixa de fora). "Negativo" = lucro do dia `< 0` (azul = `> 0`, como o `capAzul`).
- **`normArco` com `arco` parcial:** id que falta num save que já tem `arco` segue a mesma regra do save antigo (ponto anterior nasce 1), para a v11.4 não reabrir as dos pontos passados.
- **`trocaPonto`** (usado também pelo salto de capítulo do modo dev) é quem passa a 1 as entradas 0 de `nivel` menor; uma entrada já `'pend'` do ponto anterior continua pendente.

**Modelo:** Sonnet, esforço médio (mecanismo novo, com molde na `LIBERA`).
