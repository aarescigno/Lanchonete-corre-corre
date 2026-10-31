# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 2c-r5 | Ajustes da lojinha: TV e som em Melhorias, toalha no Salão, ícones da equipe (Tonhão de corpo inteiro) e cartão da Manutenção com cor | v8.9.1 | feita em 30/10 (`docs/spec-v8.9.1.md`) |
| 3a | Mudança de ponto e Lanchonete na área industrial (e os caps. 4 e 5) | v9 | feita em 30/10 (`docs/spec-v9.md`) |
| 2c-r6 | Retorno de beta-tester: cardápio fácil de achar (cartão Cardápio com os cursos, conversa do dia 2, selo "novo", reclamação dos clientes) e balão do Tonhão embaixo do Pular | v9.0.1 | feita em 30/10 (`docs/spec-v9.0.1.md`); depois, v9.0.2 e v9.0.3 fora do plano |
| 2c-r7a | A lojinha abre aos poucos: cartões que aparecem com reclamação e conversa (Bia, Melhorias, Manutenção, Salão, Decoração) | v9.0.4 | feita em 31/10 (`docs/spec-v9.0.4.md`) |
| 2c-r7b | Rebalanceamento e a melhor ordem de liberação dos cartões | v9.0.5 | a fazer; **a próxima** |
| 3b | Restaurante na Avenida Brasil, o Joca (e o capítulo dela) | v9.1 | a fazer |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 2c-r7 — A lojinha abre aos poucos (v9.0.4 e v9.0.5, em 2 sessões)
Origem: pedido do usuário (31/10, `docs/PROPOSTAS.md`): a lojinha não deve assustar quem chega nela pela primeira vez. Os cartões aparecem com o tempo, quando a freguesia reclama de alguma coisa e a Bia tem a ideia de investir nela, como já acontece com o Cardápio (conversa do fim do dia 1) e a Divulgação (conversa do fim do dia 3). Planejada com o usuário em 31/10; as decisões abaixo estão tomadas. A **sessão a** monta o sistema com a ordem-rascunho; a **sessão b** é o momento separado de rebalanceamento: compara ordens com o bot e fecha a ordem com o usuário.

### Decisões tomadas (31/10)
- **Gatilho misto:** cada cartão tem um **dia mínimo** e uma **garantia**. Do dia mínimo em diante, ele fica pendente no fim do dia em que acontece a reclamação ligada a ele; se ela não vier, fica pendente no fim do dia da garantia de qualquer jeito.
- **Pendente → conversa → aberto:** pendente, o cartão continua escondido (como a Divulgação na v9.0.3). A conversa dele toca no próximo fim de dia livre, pela fila de hoje (uma conversa por fim de dia; as de capítulo primeiro). No fim, a lojinha abre direto nele.
- **Escondido:** antes de abrir, o cartão nem aparece (sem cadeado). Aberto, ganha o selo "novo" até ser tocado (o mesmo selo do Cardápio), e o grupo dele também, quando outro grupo está aberto.
- **Só os cartões:** quando um cartão abre, todos os itens dele aparecem juntos (Melhorias inteira, Bia inteira). Itens não são liberados um a um.
- **Só no Modo História:** fora dele (`HIST.on` falso ou save sem a História), no modo dev, no Turno sem fim e do cap. 4 em diante (área industrial), tudo aberto. **Saves de antes da v9.0.4** abrem com tudo aberto, sem conversa (ninguém perde cartão que já usava).
- **Sempre abertos:** Cardápio, Tonhão, Banco, Caixa e Gurugol. Dani (cap. 2), Divulgação (dia 4 e conversa) e Mudança (cap. 3) seguem as regras de hoje. **Liberados por esta etapa:** Bia, Melhorias, Manutenção, Salão e Decoração.
- **Antes da 3b**, para o Joca e o que a Avenida Brasil trouxer à lojinha já nascerem nesse sistema.

### Ordem-rascunho (a sessão b confirma ou troca)
Na 1ª lojinha (fim do dia 1) ficam à vista: Lanchonete › Cardápio; Equipe › Tonhão; Dinheiro › Banco e Caixa; Gurugol.

| Ordem | Cartão | Dia mínimo | Gatilho no dia (reclamação) | Garantia |
|---|---|---|---|---|
| 1 | `bia` (Equipe › Bia) | 2 | algum grupo saiu bravo da mesa (`bravo === 'mesa'`) ou 3+ avaliações do dia com Agilidade `s[1] <= 3` | 4 |
| 2 | `melhorias` | 3 | a lixeira encheu em algum momento do dia, ou 3+ avaliações com Espera `s[0] <= 3` | 5 |
| 3 | `manut` | 3 | no fim do dia, o pior equipamento está abaixo de `MANUT.verde` (barra amarela) | 5 |
| 4 | `salao` | 4 | alguém desistiu da fila sem mesa (`lostBy.semMesa >= 1`) ou `stats.lotadoT >= 90` | 6 |
| 5 | `decor` | 5 | 3+ avaliações com Ambiente `s[4] <= 2.5` (na Garagem quase sempre: o Ambiente começa em 2; na prática abre no dia mínimo) | 7 |

`s` é a lista de notas cruas de cada avaliação (escala 1 a 5, a do `avalComentario`), guardada hoje em `this.avals[].s`. A Manutenção não espera a fila: se ela e outro cartão estiverem pendentes, a dela toca primeiro (a quebra só acontece no vermelho, e da amarela até lá são alguns dias). Sequência típica: fim do dia 1, Cardápio; dia 2, cap. 1 → 2; dia 3, Divulgação; dia 4, Bia; dia 5, Manutenção ou Melhorias; e assim até a Decoração, por volta do dia 8.

### Sessão 2c-r7a — Cartões que abrem com reclamação e conversa (v9.0.4)
**`src/10-constantes.js`**
- Depois de `HIST_DIVULGA`:
  ```js
  /* v9.0.4: a lojinha abre aos poucos no Modo História. Cada cartão: dia mínimo, garantia (ate), as reclamações do Gurugol
     no dia do gatilho e a conversa do fim do dia. save.libera[id]: 0 fechado | 'pend' | 1 aberto (selo "novo") | 2 aberto e visto */
  const LIBERA = [
    { id:'bia', dia:2, ate:4, reclama:['A moça corre pra lá e pra cá e não dá conta!', 'Demorou um século pra anotarem o pedido.'],
      falas:[ { q:'bia', s:'Hoje um freguês disse que eu corro pra lá e pra cá e não dou conta.' },
              { q:'tonhao', nota:'olhando o pé dela', s:'Também, com esse chinelo! Compra um tênis decente, Bia.' },
              { q:'bia', s:'E uma bandeja, pra levar dois pratos de uma vez...' },
              { q:'tonhao', s:'Tá tudo na lojinha, em Equipe, no seu nome.' } ] },
    { id:'melhorias', dia:3, ate:5, reclama:['Esperei no sol sem nem um copo d\'água.', 'Que calor aqui dentro!'], lixo:'Que cheiro de lixo!',
      falas:[ { q:'bia', s:'Tio, um moço reclamou que esperou no sol sem nem um copo d\'água.' },
              { q:'tonhao', s:'Dá pra pôr uma torneira lá fora. E um ventilador aqui, que a cozinha tá um forno.' },
              { q:'bia', s:'E um triturador, pra lixeira não encher tão rápido!' },
              { q:'tonhao', s:'Calma, uma coisa de cada vez. Vê nas Melhorias o que cabe no bolso.' } ] },
    { id:'manut', dia:3, ate:5, primeiro:true, reclama:['O café veio com gosto de queimado.', 'A comida demorou... o fogão tá fraco?'],
      falas:[ { q:'tonhao', nota:'batendo na lateral do fogão', s:'Esse fogão tá com a chama amarela. Coisa boa não é.' },
              { q:'bia', s:'Vai quebrar?' },
              { q:'tonhao', s:'Se ninguém olhar, um dia quebra no meio do almoço. Melhor chamar o técnico antes.' },
              { q:'bia', s:'Vou ver na Manutenção quanto custa a revisão.' } ] },
    { id:'salao', dia:4, ate:6, reclama:['Nem consegui sentar.', 'Só tem quatro mesinhas?'],
      falas:[ { q:'bia', s:'Hoje teve gente indo embora da fila: não tinha mesa pra todo mundo.' },
              { q:'tonhao', s:'Na garagem ainda cabem umas mesinhas. Cadeira de plástico é baratinha.' },
              { q:'bia', s:'Vou ver no Salão onde encaixar.' } ] },
    { id:'decor', dia:5, ate:7, reclama:['Parece uma garagem.', 'Lugar meio sem graça.'],
      falas:[ { q:'bia', s:'Escreveram no Gurugol: "parece uma garagem".' },
              { q:'tonhao', s:'Mas é uma garagem!' },
              { q:'bia', s:'Uma plantinha, a foto da mãe na parede... fica com cara de casa.' },
              { q:'tonhao', nota:'sorrindo', s:'Isso a Rosa ia gostar. Vê na Decoração.' } ] } ];
  function liberaOf(id){ return LIBERA.find(l => l.id === id) || null; }
  ```
- Mova `BIA_IDS` de `41-lojinha.js` para cá (a lógica precisa dele) e acrescente `function upgradeCartao(id){ return BIA_IDS.indexOf(id) >= 0 ? 'bia' : 'melhorias'; }`.

**`src/12-clientes.js` (`normSave`)**
- `libera`: objeto com uma chave por `LIBERA` (valores `0`, `'pend'`, `1` ou `2`). Save novo: tudo `0`. Save sem `s.libera` que não é novo (já tem `s.dia`): tudo `2`. O `resetProgress` zera.

**`src/16-jogo.js`**
- `cartaoAberto(id)`: `true` se o id não está em `LIBERA`, ou com `DEV.on`, `!HIST.on`, `this.save.histV !== 1`, `this.save.cap >= 4`, ou `this.save.libera[id] >= 1`.
- `buy(id)` recusa se `!this.cartaoAberto(upgradeCartao(id))`; `buyMesa`, `buyToalha` e `buyToalhas` recusam sem `salao`; `buyDecor` sem `decor`; `revisar` sem `manut` (o conserto de emergência na plaquinha continua valendo sempre).
- Durante o dia: `this.stats.lixoCheio = true` quando `this.trashFull` (no `update`, onde o lixo enche).
- Fim do dia, junto das linhas do `convCard`/`convDiv` (~linha 872), com as mesmas condições (`!tomou && HIST.on && !DEV.on && sv.histV === 1`) e `sv.cap < 4`: para cada `L` de `LIBERA` com `sv.libera[L.id] === 0` e `d.n >= L.dia`, calcule o gatilho (tabela acima, sobre `this.avals`, `this.stats` e `this.manut`). Se o gatilho veio ou `d.n >= L.ate`, `sv.libera[L.id] = 'pend'`. Quando foi pelo gatilho, ponha uma das `L.reclama` (no `melhorias`, `L.lixo` se a lixeira encheu) na frente do `coment` do resultado (com 3, sai o último) e no `sv.avalCom`. Pode ficar mais de um pendente no mesmo dia.
- `get liberaNovo()`: a lista dos ids com `sv.libera[id] === 1`; `liberaVer(id)`: `1 → 2` e grava o save.

**`src/43-telas.js` (`fluxoHistoria`)**
- Depois das de capítulo e antes do `fim()`, a ordem das extras passa a ser: a da Manutenção pendente (a que tem `primeiro`), Cardápio, Divulgação e as outras de `LIBERA` na ordem da lista. Uma só por fim de dia, como hoje. Ao terminar (ou ao pular): `sv.libera[id] = 1`, `writeSave`, `shopEntra = id`, `fim()`.
- Na entrada da lojinha com `shopEntra`, o grupo aberto é o do cartão (`shopGrupoDe`), não sempre o Lanchonete.

**`src/41-lojinha.js`**
- `shopSecoesVis`: também filtra `game.cartaoAberto(id)`.
- `shopCartoes`: cartão com `game.liberaNovo` contendo o id ganha a classe `novo` e o `aria-label` "Nome: novo na lojinha"; ao tocar, `game.liberaVer(id)`. A fileira de grupos: o grupo leva `novo` (quando outro grupo está aberto) se tiver cartão novo, generalizando o código de hoje do Cardápio.
- `shopAbrir(sec)` para um cartão fechado (ex.: o "Ver cursos" ou algum atalho antigo) abre os cartões do grupo, sem a seção.

**`src/40-interface.js` (Como jogar)**
- Uma frase: "No Modo História, a lojinha abre aos poucos: quando a freguesia reclama de alguma coisa, a Bia descobre o que comprar." Procure em Como jogar e nas dicas textos que mandam a pessoa a um cartão que pode estar fechado no começo; mantenha-os (valem para depois), sem prometer o cartão no dia 1.

**Testes**
- **`smoke41.js` (novo)**, com `load({historia:true})`:
  1. Lojinha depois do dia 1: grupo Lanchonete só com Cardápio; Equipe só com Tonhão; Dinheiro com Banco e Caixa. `game.buy('tenis')` e `game.buyMesa(2)` recusam.
  2. Gatilho: no dia 2, com um grupo saindo bravo da mesa, `libera.bia === 'pend'` e o `coment` do resultado começa com uma das `reclama` da Bia; sem gatilho, no dia 4 vira `'pend'` pela garantia (e o `coment` não ganha a reclamação).
  3. Fluxo: com `bia` pendente e sem capítulo, toca a 1ª fala "Hoje um freguês disse...", depois `libera.bia === 1`, a lojinha abre em Equipe › Bia e o cartão tem `novo`; tocar nele deixa `2` e tira o selo. Com capítulo na troca de dia, a conversa da Bia espera para a seguinte.
  4. Manutenção primeiro: com `manut` e `salao` pendentes juntos, toca a da Manutenção.
  5. Sem a História (`load()` padrão), modo dev e save com `cap: 4`: todos os cartões à vista e `buy` funciona. Save antigo (com `dia: 9` e sem `libera`): tudo `2`.
- Testes antigos que compram Melhorias, mesas ou enfeites com a História ligada (`smoke34`, `smoke38`, `smoke39`, `smoke40` e os `shot_*.py`): ponha `libera` com tudo `2` no save do teste. Não mude o que eles conferem.
- **`carreira.js`:** fecha as conversas pendentes entre os dias (como a do cardápio, linha ~74): `'pend'` → `2`. O bot já compra pelo `game.buy`, que recusa cartão fechado: os números mudam um pouco (é esperado; a sessão b compara). Rode `node carreira.js 20` e anote no spec os dias dos capítulos e da mudança, ao lado dos da v9.0.3.
- `./run_all.sh --tudo` verde (o `balance.js` não liga a História, então não pode mudar).
- Captura `shot_v9_0_4.py` em `capturas/v9.0.4`: a 1ª lojinha (grupos Lanchonete, Equipe e Dinheiro), a conversa da Bia e a lojinha aberta em Equipe com o selo, em 1220×600 e no celular em pé (390×844). Confira com recortes ampliados (PIL `crop`) dos cartões com o selo.

**Fechamento:** v9.0.4. Guarde a v9.0.3 em `versoes/`, atualize `vtag`, `VERSAO` e o painel `#ov-ver` ("v9.0.4 — A lojinha abre aos poucos no Modo História: Bia, Melhorias, Manutenção, Salão e Decoração aparecem quando a freguesia reclama, com uma conversa da Bia e do Tonhão."), escreva `docs/spec-v9.0.4.md`, atualize `docs/RESUMO.md`, `docs/PARTES.md` (`LIBERA`, `cartaoAberto`) e a tabela. PR com merge; avise que está pronta para publicar.

Modelo: Sonnet, esforço médio (plano fechado: dados novos, um filtro na lojinha, a fila de conversas e testes).

### Sessão 2c-r7b — Rebalanceamento e a melhor ordem de liberação (v9.0.5, se algum valor mudar)
O momento separado para conferir a ordem e o equilíbrio. Nada de cartão novo nem de texto novo; só os números de `LIBERA` (ordem, `dia`, `ate`) e, se preciso, o que está dito abaixo.

**Ferramentas (`tests/`, sem mexer em `src/`)**
- `carreira.js` ganha: `LIBERA=0` (tudo aberto, o jogo da v9.0.3: a base de comparação); `LIBERA_ORDEM=bia,salao,...` (reordena a lista); `LIBERA_CFG='{"salao":{"dia":3,"ate":5}}'` (troca dia e garantia); e uma linha `LIBERA | cartão: dia médio em que abre (n/N) · cartões à vista por dia, dias 1 a 10 · cartões novos no mesmo dia (máx.) · Manutenção aberta antes da 1ª barra vermelha (n/N)`.

**Ordens a comparar** (`node carreira.js 40` em cada, mais a base `LIBERA=0`):
- **A** (rascunho): bia, melhorias, manut, salao, decor.
- **B** (mesas antes): bia, salao, melhorias, manut, decor (o `dia`/`ate` de cada posição seguem a coluna da tabela: 2/4, 3/5, 3/5, 4/6, 5/7).
- **C** (enfeites antes, porque são baratos e sobem o Ambiente para as notas dos caps. 2 e 3): decor, bia, melhorias, manut, salao.

**Critérios (decididos):**
1. Obrigatórios, contra a base: dia médio do cap. 3 cumprido e da mudança no máximo **+1 dia**; dias no negativo no máximo **+10%** (relativo); lucro acumulado no dia 14 no mínimo **90%**; Manutenção aberta antes da 1ª barra vermelha em **100%** das rodadas.
2. Curva: no máximo **1 cartão novo por fim de dia**; todos os cinco abertos **até o dia 9** em pelo menos 90% das rodadas.
3. Entre as ordens que passam, a de cap. 3 mais cedo; empate (diferença menor que 0,3 dia), a **A** (a narrativa foi escrita nela).
4. **Se nenhuma passar:** baixe em 1 o `ate` de todos os cartões (nunca abaixo do `dia`) e rode de novo as três. Se ainda assim nenhuma passar, pare e mostre a tabela ao usuário, sem mexer em metas, preços nem capítulos.

**Checagem com o usuário:** monte no `docs/spec-v9.0.5.md` (ou no spec da v9.0.4, se nada mudar) a tabela das três ordens com os números e a curva de cartões por dia. Gere `shot_v9_0_5.py` em `capturas/v9.0.5` com a lojinha no fim dos dias 1 a 8 da ordem escolhida (1220×600), e peça ao usuário para jogar os 7 primeiros dias no Modo História e dizer: (a) se a 1ª lojinha ficou leve; (b) se alguma conversa chegou tarde demais (ex.: queria mesa antes); (c) se alguma chegou junto demais de outra. Se ele pedir troca, aplique a ordem ou o dia que ele escolher e rode o `carreira.js` só para conferir os critérios 1 e 2.

**Fechamento:** se `LIBERA` mudou, v9.0.5 (como na v9.0.4: `versoes/`, `vtag`, `VERSAO`, `#ov-ver` "v9.0.5 — A ordem em que a lojinha abre foi conferida e ajustada."); se não mudou, só o spec e a tabela acima, sem versão nova. `./run_all.sh --tudo` verde, PR com merge.

Modelo: Sonnet, esforço alto (balanceamento por tentativa com critérios fechados e conversa com o usuário no fim).

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).
- A sessão 3a (feita em 30/10, v9) está no `docs/PLANO-FEITO.md`.

### Vale para a 3a e a 3b
- **Mudança** na lojinha (aba "Ponto"): custo único, aluguel dali em diante e os móveis levados junto. O editor abre no ponto novo com a arrumação automática.
- Para mudar, é preciso o dinheiro da mudança **e a nota mínima do Gurugol** (etapa 2c; o usuário pediu 4,5 ★ para sair da Garagem, que exige jogar muito bem: o bot afiado ficava entre 4,35 e 4,5. Desde a v8.6.4, com o teto de 3 ★ da Garagem, o equivalente é ~2,8 ★. **Decidido em 30/10:** `avalMinimo`, 90% do teto: 2,7 para sair da Garagem e 3,4 da área industrial). Ao mudar, as avaliações antigas continuam na média, e a nota sobe aos poucos até o teto novo.
- Cada ponto traz: multiplicador do cardápio (sugestão: ×1 e ×1,4), mistura de clientes, área útil, cadeiras de espera, visual (piso, fachada, letreiro, vista da janela, calçada) e o **capítulo da história** do ponto.
- **Ao mudar, o ambiente e a bebida da espera são trocados** pelos do ponto novo (decidido em 21/10): a TV e o som da Garagem saem do save (`equipe.tv`, `equipe.som`), como o couvert abaixo do nível 3. A torneira sai do mesmo jeito (decidido em 30/10).
- **Modo dev** (v7.5.1): os pontos entram liberados, para testar.
- O ranking da carreira segue a regra da 2b, com o ponto alcançado ao lado.
- O "cardápio maior" dos pontos de cima mexe na diversidade do cardápio do Gurugol (`avalMenu`).

### Checagens de fim de sessão (valem para toda etapa que mexe em ponto, cenário, lojinha ou menu; a 3b e a 4 repetem)
- **Cenário:** capturas do salão do ponto em jogo (`tests/shot_vX.py`; sem playwright de Python, `pip install --target /tmp/pwpy playwright` e `PYTHONPATH=/tmp/pwpy`) com gente de cada tipo novo, tudo comprado e o apito/aviso na tela; conferir em recorte ampliado (PIL `crop`): parede, janela, letreiro, calçada (espera, jarra, plantas), TVs, balcão de pratos e de retirada com as vagas do ponto, roupas e acessórios da clientela nova, balões novos. Nenhum erro de página (`ERRORS: []`) e `prefers-reduced-motion` sem animação. Celular deitado (740×360) do salão.
- **Lojinha:** capturas do cartão novo apagado (falta dinheiro, falta nota, os dois), aceso e na confirmação; das abas Melhorias, Manutenção, Decoração e Dinheiro do ponto novo (nomes, preços e textos do ponto, o cartão que sai, o título com o nome do ponto); nada cortado nem sem rolar; o modo dev libera tudo sem custo.
- **Menu e telas:** `python3 menu_fit.py` verde (o menu não rola em nenhum tamanho; por isso o menu não ganhou linha nova com o nome do ponto); rótulo da História (cap., ponto, dia); cartão de fim de capítulos; conversas dos capítulos novos; fim do dia (aluguel e linha do capítulo) e painel Versões.
- **Teste de balanceamento** (com o ponto novo; cada alvo tem a regra de ajuste no plano da etapa): `PONTO=<ponto> node balance.js 40` com `BOT=afiado EQUIPE=auto` (passa 85–90% das metas; 3★ em ~60% dos dias), com `EQUIPE=auto` comum (~100% nos dias 8+), e sem equipe (a mudança **não** pode compensar); `node carreira.js 8` (e `MOVEIS=quatro`) com `DIAS=35`: dia da mudança, caps no prazo, 0 dias no negativo e o ganho por dia contra a Garagem (`MUDA=0`), que dá o prazo de volta do investimento; `DBGF=1` para ver grupos servidos e lotado por dia. Pontos a medir antes de mexer em `cardapio`, `aluguel`, `grupos` ou `metaF`: use `PONTO_CFG='{...}'` em vez de editar `src/`. Os números medidos vão no `docs/spec-vN.md`.

### Sessão 3b — Restaurante na Avenida Brasil (v9.1)
- `PONTOS` ganha o **Restaurante na Avenida Brasil** (nível 3: 24 lugares, aluguel R$ 400, mudança R$ 2.000). Clientela: executivas, famílias e mais VIPs. **Cardápio:** a área industrial ficou em ×1,5; o da Avenida parte de um valor acima disso e se calibra pelas **Checagens de fim de sessão** (ganho por dia contra o ponto anterior ≥ ~R$ 160 e volta em 3 a 5 dias; lembre que 24 lugares trazem +84% de movimento, e que um fator `grupos` pode ser preciso). Rode as checagens de cenário, lojinha, menu e balanceamento no fim da sessão.
- **O Joca** (decidido em 30/10: saiu da 3a), o 2º ajudante, **contratado com salário** (sugestão: R$ 45/dia no nível 1, aumentos para R$ 60 e R$ 75). O que ele faz (calçada e retirada, o mesmo que a Dani, ou garçom), níveis e visual (sem estereótipo, com crachá como a Dani): a decidir no planejamento da 3b.
- **Destravados:** confeiteiro (sobremesas), balcão de coquetelaria com profissional de drinks, um prato novo no cardápio, balcão de pratos com 6 vagas.
  - **ambiente:** o **couvert artístico** (já pronto no código desde a v5, escondido abaixo do nível 3 desde a v7.4.4: basta o ponto ter `nivel:3`);
  - **espera:** sofás e águas saborizadas diferentes;
  - **decoração da calçada:** tulipas, orquídeas ou copos-de-leite.
- **Capítulo da Avenida Brasil** na história.

**Modelo:** planejar com o Opus antes (o Joca, os valores e as falas da Avenida Brasil); executar com o Sonnet, esforço alto (o 2º ajudante é sistema novo), ou médio se a 3a deixar o molde de ponto pronto e o Joca for simples.

**Fora:** Terraço Suíça, VIP exigente e o final da história.

**Partes:** `10-constantes.js` (`PONTOS`, metas por ponto, equipe nova, `HISTORIA`), `12-clientes.js` (save `ponto`, preço), `13-cozinha.js` (bocas, balcão, sobremesa), `15-dani.js`/novo ajudante (Joca), `16-jogo.js` (carreira por pontos, contas), `20/21-*.js` (visual), `30-ranking.js`, `41-lojinha.js` (aba Ponto, fogão industrial), `42-resultados.js`.

**Testes:** smoke novo (mudança, custo, nota mínima, aluguel nas contas, móveis levados, ambiente e espera trocados, preços e clientela por ponto, destravados, save antigo = Garagem, capítulo). `carreira.js` com mudança.

**Calibração:**
- Mudar de ponto deve compensar em ~3 a 5 dias para quem atende bem e não compensar para quem perde muitos clientes.
- O jogador deve ter que escolher entre mudar e (equipe + melhorias + móveis).
- **Achado da v7.4, resolvido na v7.4.1** (`docs/spec-v7.4.1.md`): na v7.4, mesa a mais não dava lucro; com 4 pratos limpos, +6% de grupos por lugar acima de 10 e a fila justa a 60%, mesas de 4 com equipe se pagam em 1 a 3 dias. Conferir no ponto novo se os 20 e 24 lugares também rendem.

**Ideias para considerar no planejamento da 3b:** a **conta rachada** e o **fiscal da vigilância sanitária** (nas Ideias guardadas, desde 30/10).

**Decisões em aberto (só da 3b; as da 3a foram tomadas em 30/10):** o que cada destravado da Avenida Brasil custa; o que o Joca faz, níveis e visual; preço e efeito das águas saborizadas e dos sofás (a 3a fez o assento segurar a paciência em 15%); as falas dos capítulos da Avenida Brasil (o Bráulio já foi citado no fim do cap. 5).

---

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. Confeiteiro e coquetelaria continuam disponíveis.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Reputação do ponto:** é a nota do Gurugol (etapa 2c, últimas 100 avaliações). No Terraço ela muda a freguesia do dia (mais VIPs com nota alta), e na etapa 6 vira a régua do Michelzão.
- Um item de lojinha do Terraço, por exemplo "Louça fina": prato especial mais rápido.
- **Ambiente:** couvert com quarteto de cordas ou pianista (20% cada; diárias a definir; o pianista traz a manutenção diária do piano).
- **Decoração da calçada:** flores muito belas e arranjos, como ikebana, arranjos de orquídeas e flores do campo em vasos de cerâmica.
- **Capítulo do Terraço** na história, que prepara o final (etapa 6).

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `21-cenario.js` (Terraço, foyer, piano), `22-salao-hud.js` (balão do pedido especial).

**Testes:** smoke novo (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` no Terraço Suíça com equipe completa.

**Calibração:**
- O Terraço dá mais lucro só com equipe completa + Tonhão nível 3 + salão bem montado.
- Para quem não está pronto, é um passo arriscado: lucro abaixo da Avenida Brasil.

**Decisões em aberto:**
- A avaliação ruim do VIP exigente pesa mais na nota do Gurugol do que a de um cliente comum?
- O que o exigente usa para se distinguir visualmente.
- As diárias do quarteto e do pianista e a manutenção do piano.

**Modelo:** planejar com o Opus antes (as 3 decisões em aberto, regras do prato da casa e da reputação, falas do capítulo); executar com o Sonnet, esforço alto (cliente novo com regras próprias e o desenho do Terraço).

### Sessão 4b — Nível de luxo (v10.1)
**Objetivo:** o nível de luxo de 0 a 5 (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`), que soma o que o jogador montou em todos os pontos.

**Entra:**
- **Nível de luxo** (0 a 5), a soma de atributos: decoração da espera e do salão, móveis (as mesas de plástico de bar da Garagem são o degrau mais baixo), o ponto, o ambiente (TV, som, couvert, quarteto, pianista, que soma mais), o impacto da divulgação e a avaliação de críticos surpresa.
- A progressão é por atributos, como subir de nível um personagem (referência do usuário só nos docs; na interface, sem citar o jogo): cada atributo tem a sua barra, e o nível sobe quando elas sobem.
- Onde aparece: uma aba ou um quadro na lojinha, com as barras (pode reaproveitar o estilo da caixa do Gurugol da v8.4.1).
- Efeito no jogo (a decidir): mais VIPs, mais gorjeta, nota de ambiente do Gurugol, régua do Michelzão (etapa 6).
- TV, som e couvert podem sair da aba Equipe e ir para o lugar do ambiente (anotado na v7.4.4).
- **Enfeites e móveis melhores** à venda, para subir o luxo (decidir quais). Os da Garagem já existem desde a v8.6.5 (`DECOR` e a toalha xadrez), só visuais.
- **Feito na v8.6.6** (`docs/spec-v8.6.6.md`, com os valores sugeridos): **Decoração no Ambiente do Gurugol** (adiada na v8.6.5 a pedido do usuário, que mexia nas avaliações em outro branch, o do teto por ponto da v8.6.4; pode vir antes da 4b; os valores abaixo são na escala do serviço, de 1 a 5, antes do teto): a base do Ambiente cai de 3 para 2 (a Garagem pelada fica "meio sem graça"), cada planta soma ~0,3, cada peça do cantinho da Rosa ~0,25 e a toalha +0,5 só para o grupo daquela mesa (como o bônus da cadeira da cor); comentários próprios ("Que plantinha linda!", "A toalha xadrez dá um charme").

**Partes:** `10-constantes.js` (`LUXO`), `16-jogo.js` (cálculo), `41-lojinha.js` (aba ou quadro do luxo, enfeites), `21-cenario.js` e `22-salao-hud.js` (enfeites e móveis), `12-clientes.js` (efeito na freguesia).

**Testes:** smoke novo (cada atributo, nível de 0 a 5, efeito, save).

**Decisões em aberto:** os atributos e o peso de cada um; o efeito no jogo; quais enfeites e móveis entram; se a nota de ambiente do Gurugol passa a ser o luxo.

**Modelo:** planejar com o Opus antes (atributos, pesos e efeito no jogo, a lista de enfeites e móveis com preços); executar com o Sonnet, esforço médio (é cálculo e interface sobre o que já existe).

---

## Etapa 4c — Eventos de bairro (v10.2)
> Entrou no plano na revisão de 28/10 (era ideia guardada). Vem depois do Terraço, para variar com cada ponto.

**Objetivo:** dias especiais que dão variedade e testam a reserva de dinheiro, como a chuva e o feriado da v8.

**Entra:**
- **Festa junina** (em junho, ou num dia sorteado da campanha): mais famílias, pratos típicos (pamonha, milho, canjica) e enfeites de bandeirinhas.
- **Jogo do Brasil:** antes do jogo, a casa lota; durante, quase ninguém vem (todo mundo vendo), e depois vem o pico. Com a TV ligada (Garagem e área industrial), mais paciência e mais gente.
- Os eventos usam o sistema de `CLIMA` (sorteio, aviso na introdução do dia) e mudam com o ponto (o jogo do Brasil enche a área industrial; a festa junina pesa mais na Garagem).
- Times, emissoras e músicas sempre inventados; sem logos reais.

**Partes:** `10-constantes.js` (`EVENTOS`), `16-jogo.js` (sorteio, movimento do dia), `21-cenario.js` (enfeites), `43-telas.js` (introdução do dia).

**Testes:** smoke novo (sorteio, efeito no movimento, enfeites, save). `balance.js` com os eventos.

**Decisões em aberto:** quais eventos entram (sugestão: os 2); com que frequência; se o jogador pode se preparar (comprar ingredientes, decoração) antes.

**Modelo:** planejar com o Opus numa sessão curta (eventos, frequência, efeito no movimento e preparo); executar com o Sonnet, esforço médio (segue o molde do `CLIMA` da v8).

---

## Etapa 6 — Modo História: o crítico do Michelzão e o final (v11)
> Revista em 28/10: desde que a campanha virou o Modo História (etapa 2f), esta etapa fica só com o crítico e o final. O guia se chama **Michelzão** (escolha do usuário em 22/10).

**Objetivo:** a estrela do Michelzão, o fim do sonho da Bia.

**Entra:**
- **O crítico do guia:** um guia gastronômico **inventado**, o **Michelzão**. Não usar o nome "Michelin", nem logo, mascote ou arte do guia real.
  - No capítulo final, um cliente disfarçado aparece em dia sorteado.
  - Atendê-lo com 5 corações, prato caprichado e mesa limpa conta para a avaliação.
- **A receita da Casa Aurora** volta: o molho com o cominho com açafrão do Tonhão e a pétala de rosa da Dona Rosa, que o Bráulio nunca conseguiu repetir (sugestão: o prato do crítico, que a Bia faz no final).
- **Final:** a avaliação junta reputação (Gurugol), lucro, nível de luxo e o atendimento do crítico, e dá de 0 a 3 estrelas, com cena final (falas) e créditos curtos. Rejogar o final para tentar mais estrelas.
- Selo do resultado no menu (ex.: "★★ no Michelzão").
- O que acontece depois do final: a campanha continua (sugestão) ou acaba.

**Partes:** `10-constantes.js` (`HISTORIA`), `12-clientes.js` (crítico disfarçado, sem sinal óbvio, talvez um caderninho), `16-jogo.js`, `22-salao-hud.js`, `25-abertura.js` (cena final, se reaproveitar o desenho das cenas), `42-resultados.js`.

**Testes:** smoke novo (aparição do crítico, avaliação, finais). O bot termina a história.

**Decisões em aberto:**
- O crítico pode ser reconhecido (pista sutil) ou é surpresa total?
- Quantas estrelas possíveis (sugestão: 3).
- O Bráulio aparece no final?

**Modelo:** planejar com o Opus (decisões em aberto, regra de pontuação do final e as falas da cena final, que pedem cuidado de texto); executar com o Sonnet, esforço alto.

---

## Etapa 7 — Polimento (v11.1)
> **A rever com o usuário antes de começar** (revisão de 22/10).

- Celular: "Como jogar" sem rolar no celular deitado; lojinha sem rolar no 568×320 (pendências antigas do `RESUMO.md`). Testar som e toque num aparelho real.
- **Jogo online (pedido do usuário em 23/10: "onlinização só para os ajustes finais"):** desde a v8.3.3 o jogo é offline (`Rank.online = false`, ranking só no aparelho). Aqui, religar o ranking compartilhado: `Rank.online = true` e as capacidades do artifact com a leitura de `ranking-campanha` (a coleção da campanha, criada na v8.3). Fazer só com o OK do usuário.
- Revisão geral de equilíbrio com `carreira.js` e com o retorno dos jogadores (o "Copiar resumo" do Caixa). Revisar textos do "Como jogar" para os sistemas novos.
- **Conferir com jogadores** o que ficou pendente no `RESUMO.md` (Ideias pendentes): a Bia e os selos da v7.3, o editor do salão, a fila justa e a porta, as estrelas, a escassez, o "livre" e "reservados" da lojinha e a tela larga.

**Modelo:** a revisão com o usuário é com o Opus; depois, ajustes de tela no celular com o Sonnet, esforço médio; religar o ranking (`Rank.online = true` e capacidades) com o Haiku, esforço baixo; a revisão geral de equilíbrio com o Sonnet, esforço alto.

---

## Ideias guardadas (sem etapa ainda)
- **Bebidas da Dani no Cardápio** (entrevista de 30/10, da etapa 2c-r6): quando o curso de barista da Dani passar a trazer bebidas (cafezinho coado, pingado, cappuccino), os cursos dela que trazem itens entram no cartão Cardápio da lojinha, com o rosto da Dani, ao lado dos do Tonhão; os de Atendimento e Organização da cozinha ficam na seção Dani. Pede etapa própria, com preço, balanceamento e desenho das bebidas.
- **Virou a etapa 2e (revisão de 28/10), feita na v8.6.** **Entregadores: fila própria e marmitas** (pedido do usuário em 27/10; texto em `docs/PROPOSTAS.md`): hoje o entregador de moto entra na fila como qualquer cliente, senta e come no salão. A ideia é ele **não comer no lugar**: chega pela porta (ou por um balcão de retirada) e entra numa **fila própria de retirada**, separada da fila de mesas, e leva a comida embora. O prato dele é a **marmita**, e para liberá-la pede um **fluxo de preparação**: o Tonhão faz a marmita (tempo e ingredientes próprios, talvez com embalagem como custo), ela fica pronta num ponto de retirada (balcão ou prateleira, com limite de vagas) e a Bia (ou a Dani) entrega ao entregador quando a marmita está pronta. Quem não é atendido a tempo vai embora (paciência curta, como hoje); retirada rápida paga bem. Decidir: se a marmita é um item do cardápio ou um modo de preparo de qualquer prato; se dá para **adiantar marmitas** em horário calmo (estoque no balcão) para liberar os entregadores sem parar o salão; custo da embalagem e preço (taxa de retirada?); como aparece na chuva, quando mais clientes viram entregadores (`CLIMA`), e na sexta, quando vêm mais; efeito nas avaliações do Gurugol (`AVAL`: a espera do entregador conta como agilidade). Combina com o balcão de pratos e com os funcionários extras (Joca).
- **Conta rachada** (pensada com o usuário em 30/10, reservada para a 3b, Avenida Brasil): um jeito de pagar que pode cair em qualquer grupo de colegas (turma, executivas): cada um paga a sua parte, e a Bia leva 2 ou 3 maquininhas em vez de uma conta só. Mais trabalho, mas cada pessoa deixa um pouco de gorjeta. Decidir: a chance, quantas maquininhas, o tempo de cada uma e a gorjeta por pessoa.
- **Fiscal da vigilância sanitária** (pensada com o usuário em 30/10, reservada para a 3b ou para a 4c, eventos de bairro): uma visita surpresa, como evento, que repara na mesa suja, na lixeira cheia e na pia lotada. Aprovado, selo e um tanto a mais na nota do Gurugol; reprovado, multa. Ensaia o crítico do Michelzão (etapa 6). Decidir: a frequência, o que se confere, o valor da multa e do bônus, e se há aviso (ex.: "Dizem que a vigilância está na rua").
- **Vai nas etapas 3a, 3b e 4a (revisão de 28/10).** **Espera lá fora por nível do salão** (pedido do usuário em 22/10; texto em `docs/PROPOSTAS.md`): a estética e o serviço da espera na calçada sobem junto com o ponto. Cada ponto tem `assento` e `bebida` (`PONTOS`, `BEBIDA_ESPERA`, desde a v7.7):

| Nível | Ponto | Assento | Bebida da espera | Situação |
|---|---|---|---|---|
| 1 | Garagem | **de pé** (faixa pintada no chão) | **copo d'água da torneira**, de graça (melhoria de R$ 80) | **feito na v7.7** |
| 2 | área industrial (etapa 3) | **cadeirinhas de plástico ou banquinhos de madeira** | **jarra de suco** (a base é a máquina de suco da v7.5, guardada em `BEBIDA_ESPERA.suco`: R$ 12 na conta) | a fazer |
| 3 | Avenida Brasil (etapa 3) | **sofás** | **águas saborizadas diferentes** | a fazer |
| 4 | Terraço Suíça (etapa 4) | **poltronas individuais** | **coquetelaria lá fora** | a fazer |

  - Decisões em aberto: preço e efeito de cada bebida (a de cima rende mais na conta ou segura mais a paciência?); se o assento também segura a paciência (sentado espera com mais calma que de pé) ou só soma ao **nível de luxo**; se a coquetelaria lá fora usa o profissional de drinks do balcão de coquetelaria (níveis 3 e 4); o que acontece com a torneira na mudança (sugestão: como o ambiente, a bebida do nível de baixo sai e entra a do ponto novo).
  - **Decoração da calçada por nível** (pedido do usuário em 22/10, mesma conversa): plantas e enfeites sobem junto com o ponto. Nível 1, Garagem: **espada-de-são-jorge**, plantinhas simples (vaso de barro e lata reaproveitada; **feito na v7.7**). Nível 2: uma planta um pouco maior e mais bonita, por exemplo **violetas** em vasinhos (ou um antúrio, uma samambaia pendurada). Nível 3: flores mais rebuscadas, como **tulipas**, **orquídeas** ou **copos-de-leite**. Nível 4: **flores muito belas e arranjos**, como **ikebana**, arranjos de orquídeas e flores do campo em vasos de cerâmica. Só visual por enquanto; mais tarde soma ao **nível de luxo**.
  - Desenho de cada um com o seu (banquinhos e jarra na mesinha; sofás com almofadas e garrafas coloridas; poltronas, tapete e balcãozinho de drinks), respeitando `prefers-reduced-motion`.
- **Vai nas etapas 3a, 3b e 4a (revisão de 28/10).** **Ambiente por nível do salão** (pedido do usuário em 21/10; texto e decisões em aberto em `docs/PROPOSTAS.md`). Em todos, a paciência nas mesas cai mais devagar, como na v7.4.4 (`ambienteEffect`):
  - **nível 1, Garagem:** TV de tubo na Rede Esfera (5%, luz R$ 15/dia) e som na rádio Velha Brasil FM (5%, luz R$ 10/dia). **Feito na v7.4.4.**
  - **nível 2, área industrial (etapa 3):** 3 televisores com playlist de sertanejo. Com anúncios: 10%, pagando a luz; sem anúncios: 15%, por R$ 20/dia mais a luz.
  - **nível 3, Avenida Brasil (etapa 3):** o couvert artístico de hoje (músico, 20%, R$ 80/dia, taxa opcional de R$ 3 por pessoa que corta o efeito à metade). Já está no código, escondido abaixo do nível 3.
  - **nível 4, Terraço Suíça (etapa 4):** couvert com quarteto de cordas ou com pianista, os dois com 20% (diárias a definir). O pianista também soma ao **nível de luxo** do ambiente (pontuação para o futuro) e traz a manutenção **diária** do piano.
  - **Ao mudar de ponto, o ambiente é trocado** (decidido em 21/10): o do nível de baixo sai, com os bônus dele; cada ponto só tem o ambiente do seu nível. Na etapa 3, a mudança desliga a TV e o som da Garagem (`equipe.tv` e `equipe.som` saem do save, como o couvert abaixo do nível 3).
  - Desenho: cada nível com o seu (paredão de 3 TVs, palco do músico, quarteto, piano de cauda), respeitando `prefers-reduced-motion`; nomes de emissoras, rádios e músicas sempre inventados.
- **Virou a etapa 2b (revisão de 22/10).** **Carreira como campanha contínua** (pedido do usuário em 22/10; texto em `docs/PROPOSTAS.md`): acabar com o sistema de níveis (escolher o dia no menu, repetir o dia para tirar mais estrelas) e virar uma campanha: "novo dia, novo acúmulo, novo serviço, nova vida", seguindo com tudo o que havia antes (dinheiro, móveis, equipe, melhorias, desgaste). **O progresso** (mesmo pedido, depois da v8.2.1): vem do acúmulo de experiência e dinheiro, que levam a novos restaurantes (os pontos das etapas 3 e 4: área industrial, Avenida Brasil, Terraço Suíça); decidir o que é a "experiência" (dias completos? clientes atendidos? avaliações, que já estão nas ideias guardadas?) e quanto de cada uma abre o próximo ponto. Solução de agora: rejogar guarda o dinheiro dos dias completos e, desde a v8.2.2, só o dia completo rende (a folha é paga no fim dele; interromper não paga nem ganha). Decidir: o que acontece com a meta não batida (o dia seguinte vem igual? fica mais difícil? perde reputação?); se os dias 1 a 7 viram uma sequência sem fim (com os pontos das etapas 3 e 4 como degraus); o que vira o ranking da carreira (hoje soma os melhores dias) e as estrelas; se há um jeito de recomeçar do zero. Combina com o Modo História (etapas 5 e 6) e com o dinheiro no negativo (abaixo).
- **Virou a etapa 2b (revisão de 22/10).** **Dinheiro no negativo e empréstimo no banco** (retorno do usuário em 22/10; texto em `docs/PROPOSTAS.md`): em vez de a folha ficar de fora quando falta dinheiro, deixar o caixa ficar negativo, mas no máximo 3 dias seguidos; e a opção de pegar um empréstimo no banco, com juros. A v8.1 só mostrou o dinheiro já comprometido. Decidir: se a folha passa a ser sempre paga (negativo) ou se o corte continua como opção; o que acontece no 4º dia negativo (fim da carreira? empréstimo obrigatório?); juros, prazo e parcelas (saem da folha do dia?); uma aba Banco na lojinha ou uma linha no Caixa. Combina com a dívida de abertura da etapa 5.
- **Feito na v8.3.10.** **Triturador de lixo** (pedido do usuário em 24/10; texto e números em `docs/PROPOSTAS.md`): R$ 180, 1 gominho a cada 30 s; o Ventilador perdeu o efeito do cheiro.
- **Cozinheiros da Avenida Brasil e do Terraço Suíça** (pedido do usuário em 30/10, junto com a 2g; texto em `docs/PROPOSTAS.md`): o XP por cursos da 2g vale para a Garagem e a área industrial. Nos restaurantes de luxo o processo de subir o cozinheiro vai ser outro, porque lá não se vende coxinha (os cursos de salgado não fazem sentido). Decidir na 3b/4a: cursos próprios do ponto (cozinha de restaurante, alta gastronomia), outro cozinheiro além do Tonhão, ou outra fonte de experiência.
- **A Dani se especializa, o Joca pega o básico e um funcionário novo** (pedido do usuário em 30/10, junto com a 2h; texto em `docs/PROPOSTAS.md`): nos níveis mais altos, a Dani vira **barista ou confeiteira**, o que ela mais gosta: **cafés de vários tipos e qualidades e sobremesas de café** (o curso "Barista iniciante" da 2h é a semente). As tarefas mais básicas dela (lixo, louça, pratos sujos) passam para o **Joca**, e entra **mais 1 funcionário**, a planejar. O **Joca também terá level up**, mas só depois que ele entrar (3b). Decidir: em que ponto a especialização chega (Avenida Brasil?), o cardápio de cafés e sobremesas (preço, tempo, efeito no Gurugol), e quem é o funcionário novo.
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
- **Virou o fogão industrial da etapa 3a (revisão de 28/10).** Equipamento melhor no lugar da manutenção (fogão industrial etc.).
- **Vai na etapa 3b (o Joca; mudou da 3a em 30/10).** Mais funcionários: um segundo garçom, além da Dani. **Pedido do usuário em 22/10:** a partir do nível 2 ou 3, dá para contratar um **segundo ajudante, o Joca** (o 2º garçom da etapa 3; texto em `docs/PROPOSTAS.md`). Decidir: se o Joca faz as mesmas tarefas da Dani ou outras (por exemplo, cuidar só da calçada: levar o grupo à mesa e servir a espera), salário, níveis e visual (sem estereótipo, com crachá como a Dani).
- **Virou a etapa 4c (revisão de 28/10).** Eventos de bairro: festa junina, jogo do Brasil.
- **Virou a etapa 2c (revisão de 22/10).** **Avaliações dos clientes como meta para avançar** (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`): uma nota parecida com as avaliações de mapa na internet, que sobe ou desce pela média das **últimas 200 avaliações** de quem passou. Cada grupo avalia 5 critérios:
  - **espera por mesa:** cada coração perdido na fila tira 1 ponto;
  - **agilidade do atendimento:** cada coração perdido esperando a Bia (pedido, prato, conta) tira 1 ponto;
  - **qualidade do prato:** cada cozinheiro tem uma faixa de qualidade e de acerto; mais treinado, faixa mais alta e mais pratos caprichados (o crítico de hoje, `CRIT`, vira 100% de perfeição, nota máxima);
  - **qualidade do menu:** quantos pratos o cardápio tem (só os que os cozinheiros foram treinados para fazer);
  - **ambiente e amenidades:** a estética do salão (enfeites, móveis melhores que as mesas de plástico da Garagem), couvert e outros entretenimentos, cafezinho etc.

  Uma das metas para passar de fase seria a nota mínima de avaliação. Combina com o **nível de luxo** (abaixo), com a escada de pontos (etapas 3 e 4) e com o crítico do guia (etapa 6).
- **Virou a etapa 4b, junto com o Terraço (revisão de 28/10).** **Nível de luxo** (0 a 5, bem para frente, depois de tudo o que está na fila; pedido do usuário em 21/10): a soma dos enfeites (decoração da área de espera e do salão), da localização (ponto), do impacto da mídia (divulgação), da avaliação de críticos surpresa e de outras coisas a ponderar. A progressão seria parecida com a de subir de nível de um personagem por atributos (o usuário citou o sistema do Kratos em God of War Ragnarök como referência; na interface, sem citar o jogo).
