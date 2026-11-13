# v10.6 — Eventos de bairro: festa junina e jogo do Brasil (etapa 4c)

**Situação:** entregue em 13/11
**Origem:** a etapa 4c do `docs/PLANO.md` (revisão de 28/10; adiantada em 12/11 para dar novidade aos dias parados da Garagem). Decisões do usuário em 12/11: um evento por semana, aviso na véspera, a barraca junina na lojinha e o gol na TV.

## Objetivo
Uma vez por semana, do dia 8 em diante, o bairro muda o dia da lanchonete: a festa junina enche o salão de famílias e de bandeirinhas, e quem monta a barraca vende pamonha, milho e canjica; no jogo do Brasil, a casa lota antes, esvazia durante e explode depois, e o gol faz o salão inteiro comemorar. O jogador fica sabendo na véspera e pode se preparar.

## Fora do escopo
- Outros eventos (aniversário do bairro, show, maratona): ficam para depois, se pedirem.
- Placar, adversário ou resultado do jogo: o Brasil sempre faz o gol e ninguém fala do outro time.
- Som de torcida ou de música junina (o jogo não tem áudio).
- Decoração comprada para o evento (só a barraca, que é cardápio).

## Regras (decisões tomadas)
- **Constante nova** em `src/10-constantes.js`, logo depois do `CLIMA`:
  ```js
  const EVENTOS = {
    dia:8, semana:7,
    peso:{ garagem:{ junina:0.6, jogo:0.4 }, industrial:{ junina:0.35, jogo:0.65 }, avenida:{ junina:0.5, jogo:0.5 }, terraco:{ junina:0.5, jogo:0.5 } },
    junina:{ nome:'Festa junina', groups:{ garagem:1.3, industrial:1.15, avenida:1.15, terraco:1.1 }, tipo:'familia', tipoP:0.3,
      aviso:'Festa junina no bairro! Mais famílias, e todo mundo com vontade de comida de festa.', amanha:'Amanhã tem festa junina no bairro!',
      barraca:{ preco:40, pede:0.5, troca:0.3 }, pratos:['pamonha', 'milho', 'canjica'] },
    jogo:{ nome:'Jogo do Brasil', groups:{ garagem:1.15, industrial:1.3, avenida:1.1, terraco:1.05 },
      fases:[[0, 0.35, 0.45], [0.35, 0.65, 0.08], [0.65, 1, 0.47]], tv:{ groups:1.15, effect:0.1 }, gol:[0.45, 0.55], golT:2.5,
      aviso:'Dia de jogo do Brasil! Antes do jogo, casa cheia; durante, rua vazia; depois, festa.', amanha:'Amanhã tem jogo do Brasil!' }
  };
  ```
- **Quando acontece (só na carreira, com `MANUT.on`, como o clima):** do dia `EVENTOS.dia` = 8 em diante, a campanha se divide em semanas de 7 dias (semana `k = floor((n - 8) / 7)`: dias 8–14, 15–21...). Cada semana tem **exatamente um** dia de evento, sorteado entre os 7 dias dela; o evento (`junina` ou `jogo`) sai pelos pesos `EVENTOS.peso[ponto.id]` do ponto em que o jogador está na hora do sorteio. Nunca na Missão zero nem no Turno sem fim.
- **O sorteio da semana** (função nova `eventoSemana(save, n)` em `src/16-jogo.js`): garante que a semana do dia `n` está sorteada e devolve `'junina'`, `'jogo'` ou `''` para o dia `n`. É chamada no fim de cada dia para o dia seguinte (é o que permite o aviso na véspera) e no começo do dia (na `sortear(n)`), para o save que chegou sem sorteio. Se o sorteio acontecer tarde (save antigo, chegando no meio da semana), o dia sai entre os dias da semana que ainda não passaram (≥ `n`). Guardado em `save.evento = { sem:k, d:dia, ev:'junina'|'jogo' }`; sorteia de novo só quando a semana muda (recomeçar o dia não sorteia).
- **Evento e clima não se misturam:** no dia do evento, a `sortear(n)` grava `clima = ''` (sem chuva nem feriado). O fiscal, a quebra e o resto do sorteio seguem iguais.
- **Aviso na véspera:** a tela de resultados do dia `n` ganha a última linha `['Amanhã', EVENTOS[ev].nome]` quando o dia `n + 1` tem evento; a lojinha do dia do evento não muda de cabeçalho. Na introdução do dia (`introManut`, `src/43-telas.js`), o `EVENTOS[ev].aviso` vem primeiro, no lugar do aviso do clima.
- **Festa junina:**
  - Movimento: os grupos do dia × `EVENTOS.junina.groups[ponto.id]` (no `buildSchedule`, no mesmo produto do `cl.groups`); cada grupo vira família com chance `tipoP` = 0,3, como o feriado (no Terraço também).
  - Enfeites: na calçada, o fio de bandeirinhas do feriado com as cores juninas (vermelho, amarelo, azul, verde e laranja); no salão, dois fios de bandeirinhas em curva cruzando o alto da área do salão (`ponto.area`), por cima das mesas e sem cobrir a cozinha nem o HUD (função nova `drawBandeirinhasSalao(ctx, g)` em `src/21-cenario.js`). Com `prefers-reduced-motion`, paradas; sem ele, balançam de leve.
  - **Barraca junina:** no dia da festa (e só nele), a seção **Cardápio** da lojinha ganha no topo o cartão "Barraca junina" (ícone de milho, preço `EVENTOS.junina.barraca.preco × ponto.cardapio`, arredondado para cima de 10 em 10: R$ 40 na Garagem, R$ 60 na área industrial, R$ 80 na Avenida; no Terraço, que só tem refeição completa, **não aparece**), com o botão "Montar" e o "?" da ficha `l-barraca`. Comprada, grava `save.barraca = n` e sai do caixa como as outras compras da lojinha (entra na coluna Compras do Caixa, como as outras compras; ver Desvios).
  - Pratos juninos: três entradas novas no `CARDAPIO` com `curso:'junina'` (curso que não existe, então nunca são "sabidas" e não aparecem no cardápio comum): `pamonha: { nome:'Pamonha', preco:9, cat:'junina', carne:false }`, `milho: { nome:'Milho cozido', preco:7, cat:'junina', carne:false }`, `canjica: { nome:'Canjica', preco:8, cat:'junina', carne:false }`, cada uma com a sua `cor`. Com a barraca montada no dia (`save.barraca === day.n`), ao montar os pedidos do grupo (`this.extras` em `src/12-clientes.js`, fora do `retira` e da refeição completa): quem ficou sem 2º item ganha um junino sorteado com chance `pede` = 0,5; quem pediu salgado como 2º item troca por junino com chance `troca` = 0,3. O junino entra na conta pelo `precoPrato` e na cozinha como o 2º item de sempre.
  - Desenhos dos pratos (`drawDish`, `src/20-desenho-base.js`): pamonha (embrulho de palha verde-claro amarrado), milho cozido (espiga amarela com grãos e palha) e canjica (tigela branca com canela por cima). Servem para vegetarianos (sem carne, sem o "v" verde).
- **Jogo do Brasil:**
  - Movimento: os grupos do dia × `EVENTOS.jogo.groups[ponto.id]`, e mais × `tv.groups` = 1,15 se a TV estiver ligada (`eq.tv` na Garagem ou `eq.tvs` na área industrial).
  - As três fases: depois de montar a agenda (`buildSchedule`), as chegadas são redistribuídas pela **janela de chegadas** (`day.speed × day.time`, ~55% do turno, decisão de 13/11, ver Desvios): 45% dos grupos chegam entre 0 e 35% da janela (antes do jogo), 8% entre 35% e 65% (durante) e 47% entre 65% e o fim dela (depois), espalhados por igual em cada faixa, na ordem em que já estavam. A encomenda do setor fica onde estava. **No dia de jogo não tem apito da fábrica** (a fábrica para para ver o jogo).
  - TV: com a TV ligada, o ambiente ganha `tv.effect` = 0,1 a mais na paciência das mesas (somado no `ambiente`), só no dia de jogo; a TV da Garagem (e as da área industrial) passam o jogo o dia todo (campo verde com a bola andando; com `prefers-reduced-motion`, a bola parada).
  - **O gol:** num momento sorteado entre 45% e 55% da janela de chegadas (`gol`, em segundos, guardado no dia), todo grupo sentado à mesa que ainda não pagou nem saiu bravo ganha 1 coração (até o máximo de 5), e aparece no alto do salão o letreiro "GOOOL!" por `golT` = 2,5 s (sem movimento reduzido, cresce e treme de leve; com ele, parado). Se a TV estiver ligada, ela mostra a comemoração no mesmo tempo. Conta em `stats.gol` (0 ou 1).
  - Enfeites: o fio de bandeirinhas da calçada em verde e amarelo.
  - Nenhum nome de time, emissora ou jogador; a TV segue sendo a Rede Esfera, já inventada.
- **Fim do dia:** a linha `Imprevisto` dos resultados mostra o nome do evento do dia (como faz com o clima).
- **Modo dev:** na aba Hoje, linha `Evento: Sorteio | Nenhum | Festa junina | Jogo do Brasil` (`DEV.forca.evento`: `''`, `'nada'`, `'junina'`, `'jogo'`), que força o evento do próximo dia que começar, em qualquer dia e ponto, por cima do sorteio da semana (sem mexer no `save.evento`). No modo dev, a barraca aparece também fora do Terraço quando o evento é forçado, como no dia de festa.
- **Manual:** fichas novas, sem números, que se revelam no começo do dia do evento (como as do clima) e na compra da barraca:
  - `{ id:'i-junina', aba:'imprevistos', nome:'Festa junina', linha:'O bairro faz festa: vêm mais famílias, e quem monta a barraca vende comida de festa.' }`
  - `{ id:'i-jogo', aba:'imprevistos', nome:'Jogo do Brasil', linha:'Antes do jogo a casa lota, durante ninguém vem, e depois vem todo mundo. Com a TV ligada, a freguesia espera com mais calma.' }`
  - `{ id:'l-barraca', aba:'lojinha', nome:'Barraca junina', linha:'Só no dia da festa: pamonha, milho e canjica no cardápio.' }`
- **Save:** `save.evento` (`{ sem, d, ev }`; o `normSave` aceita só `sem` inteiro ≥ 0, `d` inteiro ≥ 8 e `ev` em `EVENTOS`, senão apaga) e `save.barraca` (inteiro ≥ 1 ou apagado). Save da v10.5.3 chega sem os dois: a semana corrente é sorteada no próximo começo de dia, a partir dele.

## Critérios de aceite
- **CA1** Com `MANUT.on`, jogando do dia 8 ao 21, sai exatamente um evento em cada semana (8–14 e 15–21), e nenhum antes do dia 8 → `smoke71` (1)
- **CA2** O peso por ponto: com 2000 sorteios de semana na área industrial, o jogo do Brasil sai entre 60% e 70%; na Garagem, a festa junina, entre 55% e 65% → `smoke71` (2)
- **CA3** O sorteio fica guardado: recomeçar o dia não muda o evento, e o dia do evento não tem clima → `smoke71` (3)
- **CA4** A véspera: o resultado do dia anterior ao evento tem a linha "Amanhã" com o nome do evento; a introdução do dia traz o `aviso` → `smoke71` (4)
- **CA5** Festa junina: o número de grupos do dia na Garagem é o do dia comum × 1,3 (±1, com o mesmo resto da agenda), e o sorteio de tipos dá família em pelo menos 30% dos grupos → `smoke71` (5)
- **CA6** A barraca: o cartão só aparece no dia da festa e fora do Terraço; montar custa R$ 40 na Garagem e grava `save.barraca`; com ela, pelo menos um grupo do dia pede pamonha, milho ou canjica, e o preço entra na conta; sem ela, ninguém pede → `smoke71` (6)
- **CA7** Jogo do Brasil: com 40 grupos simulados, no máximo 10% chegam entre 35% e 65% da janela de chegadas, e não há apito na área industrial → `smoke71` (7)
- **CA8** O gol: entre 45% e 55% da janela de chegadas, os grupos sentados ganham 1 coração (sem passar de 5), `stats.gol` vira 1 e o letreiro fica 2,5 s → `smoke71` (8)
- **CA9** A TV: no dia de jogo com a TV ligada, o `ambiente` sobe 0,1 e os grupos × 1,15 em relação à TV desligada → `smoke71` (9)
- **CA10** Save: `normSave` limpa `save.evento` e `save.barraca` inválidos e aceita o save da v10.5.3 sem eles → `smoke71` (10)
- **CA11** Modo dev: a linha Evento força o evento no dia que começa, também antes do dia 8 → `smoke71` (11)
- **CA12** Manual: as fichas `i-junina` e `i-jogo` se revelam no dia do evento e a `l-barraca` na compra → `smoke71` (12)
- **CA13** Balanceamento, festa com barraca: `EVENTO=junina BARRACA=1 EQUIPE=auto node balance.js 40` fica entre 85% e 100% das metas e com lucro maior que `EVENTO=junina BARRACA=0`; se passar de 100%, baixe `junina.groups.garagem` de 0,05 em 0,05 até caber
- **CA14** Balanceamento, jogo: `EVENTO=jogo EQUIPE=auto node balance.js 40` (com TV) entre 85% e 100% das metas, e `EVENTO=jogo node balance.js 40` (sem equipe) entre 40% e 75%; se passar, baixe `jogo.groups` do ponto de 0,05 em 0,05
- **CA15** A campanha: `DIAS=35 node carreira.js 10` mostra a linha `EVENTOS` com 4 eventos em cada carreira (junina e jogo contados à parte), e o dinheiro médio na lojinha do dia 35 fica a ±15% do medido com `EVENTOS_OFF=1` (chave nova do `carreira.js`, que desliga os eventos); se passar, baixe os `groups` do ponto que mais pesou de 0,05 em 0,05
- **CA16** O que se vê → captura `shot_v10_6.js`: a festa junina na Garagem (bandeirinhas no salão e na calçada, um prato junino na mesa), o jogo na Garagem com a TV no campo e o letreiro "GOOOL!", e o jogo na área industrial com as TVs; conferir que as bandeirinhas não cobrem o HUD, a cozinha nem os balões

## Partes
- `src/10-constantes.js`: `EVENTOS` (depois do `CLIMA`), os 3 pratos no `CARDAPIO`, as fichas no `MANUAL`.
- `src/12-clientes.js`: `normSave` (linha 158: `save.evento` e `save.barraca`) e `this.extras` (o junino com a barraca).
- `src/16-jogo.js`: `eventoSemana`, `sortear` (o clima some no dia de evento), `resetDay` (`this.evento`, o gol sorteado), `buildSchedule` (grupos, família, fases, sem apito), o gol no `update`, o `ambiente` com a TV, a revelação das fichas (perto da linha 1482), `devForcaSorteio` (o evento forçado), o fim do dia (sorteio da véspera e a linha "Amanhã").
- `src/20-desenho-base.js`: `drawDish` com os 3 pratos.
- `src/21-cenario.js`: `drawBandeirinhas` com as cores de quem chama, `drawBandeirinhasSalao`, a TV no jogo (`drawTv` e as TVs da área industrial).
- `src/22-salao-hud.js` e `src/23-render.js`: o letreiro "GOOOL!" e as chamadas dos enfeites.
- `src/40-interface.js`: a linha Evento na aba Hoje (`devAbaHoje`).
- `src/41-lojinha.js`: o cartão da barraca na seção Cardápio.
- `src/42-resultados.js`: a linha "Amanhã" e o evento na linha `Imprevisto`.
- `src/43-telas.js`: `introManut` com o aviso do evento.
- `tests/balance.js`, `tests/bot.js`, `tests/carreira.js`: `EVENTO=junina|jogo` (força o evento em todos os dias jogados), `BARRACA=0|1` (padrão 1: o bot monta a barraca quando aparece), a linha `EVENTOS` e a chave `EVENTOS_OFF=1` do `carreira.js`.

## Tarefas
- [x] T1 Smoke novo `tests/smoke71.js` com os critérios CA1 a CA12 (falhando) e no `run_all.sh`.
- [x] T2 `EVENTOS`, os pratos juninos e as fichas do Manual; `normSave` com `save.evento` e `save.barraca`.
- [x] T3 `eventoSemana`, o sorteio na véspera e no começo do dia, sem clima no dia do evento; o modo dev (linha Evento).
- [x] T4 Festa junina: movimento, famílias, a barraca na lojinha e os juninos nos pedidos.
- [x] T5 Jogo do Brasil: movimento, as fases, sem apito, a TV (ambiente e grupos) e o gol.
- [x] T6 Avisos: a linha "Amanhã" e o evento no `Imprevisto` dos resultados; o aviso na introdução; a revelação das fichas.
- [x] T7 Desenho: os 3 pratos, as bandeirinhas juninas e verde-amarelas, as do salão, a TV no jogo e o letreiro; `shot_v10_6.js` e conferência por recortes ampliados.
- [x] T8 Bot e balanceamento: `EVENTO` e `BARRACA` no `balance.js`, a linha `EVENTOS` no `carreira.js`; calibrar CA13 a CA15 pela receita dos critérios.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (variáveis novas), `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O feriado já usa `drawBandeirinhas` (só na calçada): dê a ela um parâmetro de cores, mantendo as atuais como padrão, e não mude o desenho do feriado.
- O `harness.js` desliga `MANUT.on` (sem imprevistos): como o evento só sorteia com `MANUT.on`, os smokes antigos não mudam; o `smoke71` chama `load({imprevistos:true})` ou força pelo `DEV.forca.evento`.
- Os juninos têm `curso:'junina'`, que não existe em `CURSOS`: confira que `pratoSabido` devolve `false` para eles e que nenhum painel percorre o `CARDAPIO` inteiro (só o `pratosSabidos`, linha 231 de `10-constantes.js`).
- O apito da área industrial é montado no próprio `buildSchedule`, depois das chegadas: redistribua as fases antes do bloco do apito e pule o bloco no dia de jogo.
- Comece pelo `eventoSemana` e pelos avisos (T3 e T6), que destravam os outros testes do smoke.

## Testes
- `smoke71` (48 checagens, CA1 a CA12): verde. Ajustes nos antigos (só contagens): `smoke31` (os 29 pratos mais os 3 juninos à parte), `smoke53` (69 fichas) e `smoke67` (preços dos 29).
- CA13 (40 rodadas, Garagem, dias 3 a 7): festa com barraca passa a meta em 98% dos dias e com lucro médio de R$ 1.849 (sem barraca: 98%, R$ 1.676).
- CA14: jogo com TV (`EQUIPE=auto`) 100% (199/200); sem equipe 62% (125/200; alvo 40–75%).
- CA15 (`DIAS=35`, 30 carreiras): 4 eventos em cada carreira (festa junina 2,2 e jogo 1,8 em média; barraca montada em 30 de 65 festas); dinheiro na lojinha do dia 35: R$ 4.454 com eventos × R$ 4.424 sem (+0,7%).
- Capturas `shot_v10_6.js` (CA16) conferidas em recortes e apagadas: bandeirinhas no salão acima das cabeças, letreiro "GOOOL!" no alto, TV da Garagem e as 3 da área industrial no campo/"GOL!", cartão da barraca na lojinha.
- `smoke71` novo (CA1 a CA12). Os smokes antigos não mudam de número (eventos desligados no `harness.js` junto com os imprevistos).
- `balance.js`: chaves novas `EVENTO=junina|jogo` e `BARRACA=0|1`; alvos em CA13 e CA14. `carreira.js`: linha `EVENTOS` (eventos por campanha, por tipo) e CA15.
- Capturas: `shot_v10_6.js` (CA16), conferidas e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
- **As fases e o gol valem na janela de chegadas, não no turno todo (decisão do usuário, 13/11).** Com as fases no turno inteiro (45% até 35%, 8% até 65%, 47% até 100%), o jogo espalhava as chegadas além da janela normal (~55% do turno) e aliviava a fila: sem equipe, a meta passava em 84 a 88% dos dias (alvo 40–75%), e baixar `jogo.groups` só subia o número (0,85 dava 98%); na campanha o dinheiro do dia 35 ficava +25 a +50% acima do `EVENTOS_OFF=1`. Com as fatias e o gol na janela (`speed × turno`), os `groups` da spec ficaram como estavam e os alvos fecharam (62% sem equipe; +0,7% na campanha). O gol, que a spec punha entre 45 e 55% do turno, cai entre 45 e 55% da janela, para ficar na fase do meio.
- **A compra da barraca** entra na coluna **Compras** do Caixa (categoria `mel`), como as outras compras da lojinha: o Caixa não tem linha por compra.
- **`tests/bot.js`** ganhou `eventos(g, L, o)` e `barraca(g, L, folha)`: o harness desliga os imprevistos (`MANUT.on`) e com eles os eventos, então o `balance.js` e o `carreira.js` ligam só os eventos (sem clima nem quebras, com `MANUT=com` o sorteio de verdade segue). `balance.js` e `carreira.js` também aceitam `EVENTOS_CFG='{...}'` (troca números de `EVENTOS` em runtime); o balance só tem evento com `EVENTO=`.
- `eventoDe(n)`, `barracaVisivel`, `barracaOn`, `tvLigada` e `ambienteEv` no `Game` (a lojinha precisa saber o evento antes de o dia começar, e o `sortear(n)` só roda no começo do dia).


**Modelo:** Sonnet, esforço médio (regras e números fechados; segue o molde do `CLIMA`, com desenho novo e calibração por receita)
