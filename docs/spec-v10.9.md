# v10.9 — O crítico sem aviso: o caderninho e o boato do Bráulio (etapa 6b)

**Situação:** entregue em 13/11
**Origem:** a Etapa 6 do `docs/PLANO.md`, segunda das quatro sessões do final (planejamento de 13/11, `docs/PROPOSTAS.md`). Decisões do usuário: o crítico tem pista sutil (o caderninho) e o Bráulio é rival até o fim.

## Objetivo
O crítico do Michelzão janta duas vezes na casa sem se apresentar. Parece um freguês qualquer, mas tira um caderninho depois de cada prato: quem repara, capricha; quem trata todo mundo bem nem precisa reparar. No fim do dia, a equipe descobre quem era e vê a ficha da visita. Na segunda vez, o Bráulio espalha um boato para lotar a casa bem no dia em que o crítico vem.

## Fora do escopo
- A noite da estrela, o Bráulio à mesa, as estrelas e a Fama do luxo: v10.10 (`docs/spec-v10.10.md`).
- Visitas surpresa depois do final: v10.10.
- O Bráulio em cena (aqui ele é só citado, como até agora).

## Regras (decisões tomadas)
- **Constante nova** em `src/10-constantes.js`, depois do `ROSA`:
  ```js
  const CRITICO = { tipo:'executiva', chega:[0.3, 0.6], primeira:[1, 3], segunda:[2, 3], caderno:1.8, lotada:1.25, salaoT:6,
    itens:['Recepção', 'Atendimento', 'Prato', 'Salão', 'Refeição'],
    boato:'Boato na cidade: dizem que hoje a casa dá sobremesa de graça. Vai lotar!',
    coment:'Ouvi dizer que o molho de lá é copiado.' };
  ```
- **Quando ele vem:** só na carreira com a História ligada, no capítulo 13. Ao começar o capítulo (`avancaCap` para o 13), `save.guia = { n:0, prox:dia + sorteio de 1 a 3, v:[] }`. No dia `prox`, o crítico vem. No fim desse dia, a ficha entra em `guia.v`, `guia.n` sobe e, depois da 1ª visita, `prox = dia + sorteio de 2 a 3`. Recomeçar o dia não muda o sorteio nem grava ficha (só o fim do dia grava). Depois da 2ª visita, `prox = 0`.
- **Como ele entra no dia:** no `buildSchedule`, um dos grupos que chegam entre 30% e 60% da janela de chegadas (o mais perto do meio; sem nenhum nessa faixa, um grupo a mais aos 45%) vira o crítico: tipo `CRITICO.tipo` (sozinho), com `grp.critico = true`.
- **O disfarce:** por dentro ele é VIP exigente (pede o prato da casa, cobra a bebida antes da entrada, repara no salão, sempre avalia), mas com `grp.disfarce = true`: sem chapéu, lenço nem echarpe, sem a plaquinha na mesa e sem marca de VIP na fila nem no HUD. Não conta em `stats.vip`.
- **A pista (o caderninho):** `CRITICO.caderno` = 1,8 s com um caderninho e uma caneta na mão (desenho pequeno, na frente do peito) em cinco momentos: logo depois de sentar e depois de servido cada tempo (bebida, entrada, prato e sobremesa). Com `prefers-reduced-motion`, o caderninho aparece parado pelo mesmo tempo; sem ele, a caneta mexe.
- **A ficha da visita:** fechada quando o grupo dele sai. Cinco itens, de 0 a 2 garfos cada (total de 0 a 10), guardada como `{ d:dia, it:[r, a, p, s, f] }`:
  - **Recepção:** não perdeu coração na fila (`perdFila === 0`): 2; perdeu 1: 1; mais: 0.
  - **Atendimento:** saiu com 5 corações: 2; com 4: 1; menos: 0.
  - **Prato:** o principal veio como Prato da Rosa: 2; sem a pétala, mas caprichado e sem chegar frio: 1; o resto: 0.
  - **Salão:** os segundos, enquanto ele esteve sentado, com `salaoBagunca()` verdadeiro ou a lixeira cheia: 0 s: 2; até `CRITICO.salaoT` = 6 s: 1; mais: 0.
  - **Refeição:** os quatro tempos servidos: 2; três: 1; menos: 0.
  - Se ele sair bravo (0 corações, da mesa ou da fila), a ficha inteira é 0.
- **O fim do dia da visita:** a tela de resultados ganha, acima da lista, o cartão "O crítico esteve aqui", com as cinco linhas do `CRITICO.itens` e de 0 a 2 garfinhos desenhados em cada uma (cheios os ganhos, apagados os perdidos). Sem número nenhum.
- **A conversa da 1ª visita** (`HIST_CRITICO`, pendente no fim do dia da 1ª visita, `save.convCrit`: 0 | 'pend' | 1; toca como as outras conversas de fim de dia, antes do cartão da ficha):
  ```js
  const HIST_CRITICO = { falas:[
    { q:'dani', s:'Bia! Aquele freguês sozinho... ele tinha um caderninho!' },
    { q:'bia', s:'Era ele?!' },
    { q:'tonhao', s:'Era. E deixou a ficha da visita. Olha aí.' } ] };
  ```
- **O boato do Bráulio (a 2ª visita):** no dia da 2ª visita, os grupos do dia × `CRITICO.lotada` = 1,25 (no mesmo produto do `cl.groups`), o dia não tem clima nem evento de bairro (como o dia de evento não tem clima), e a introdução do dia (`introManut`) mostra o `CRITICO.boato` em primeiro lugar. O resto do sorteio (quebra, sorteio do dia) segue igual.
- **O comentário plantado:** ao começar o capítulo 13, entra no topo dos comentários do Gurugol um comentário de uma estrela com o texto `CRITICO.coment`, marcado `boato:true`: aparece na lista e **não** entra na conta da nota.
- **Capítulo 13** (entra no `HISTORIA`; o capítulo 12 perde o `fim`):
  ```js
  { cap:13, titulo:'O crítico sem aviso', ponto:'terraco', obj:{ critico:2 },
    antes:[
      { q:'tonhao', s:'O crítico do Michelzão não usa crachá. Senta, come e anota.' },
      { q:'bia', s:'Então é tratar todo mundo como se fosse ele.' },
      { q:'dani', s:'Ouvi dizer que ele vive com um caderninho!' },
      { q:'cami', nota:'olhando o Gurugol', s:'Gente... tem comentário novo dizendo que o nosso molho é copiado.' },
      { q:'tonhao', s:'Isso tem bigode. Deixa o Bráulio falar. A gente cozinha.' }],
    depois:[
      { q:'bia', s:'Casa lotada por causa de um boato, e o crítico bem no meio.' },
      { q:'tonhao', s:'O Bráulio mandou ele no pior dia. Não dá ponto sem nó.' },
      { q:'cami', s:'E a gente deu conta.' },
      { q:'tonhao', nota:'lendo um cartão', s:'O Michelzão deixou um recado: a última visita é um jantar. A gente escolhe a noite.' },
      { q:'dani', s:'A noite da estrela!' }],
    fim:{ h:'Fim do capítulo 13', p:'Continua na próxima versão: a noite da estrela.' } }
  ```
  Item do objetivo: "Receber o crítico do Michelzão 2 vezes (n de 2)", cumprido com `guia.n >= 2`. A nota das fichas não trava o capítulo: ela pesa nas estrelas (v10.10).
- **Modo dev:** `DEV_CAPS` ganha o `n:13` (começo do capítulo 13: como o 12, com o molho e a gerência comprados) e o Fim passa a `n:14`. Na aba Hoje, a linha `Crítico: Sorteio | Hoje | Hoje com boato` (`DEV.forca.critico`: `''`, `'hoje'`, `'boato'`), que traz o crítico no próximo dia que começar, em qualquer ponto e capítulo, sem mexer no `save.guia` (a ficha aparece no fim do dia e não é guardada).
- **Manual** (sem números; as duas revelam no fim do dia em que acontecem):
  - `{ id:'i-critico', aba:'imprevistos', nome:'Crítico do Michelzão', linha:'Chega sem avisar, sozinho, e anota tudo num caderninho. Repara na espera, no atendimento, no prato, no salão e na refeição do começo ao fim.' }`
  - `{ id:'i-boato', aba:'imprevistos', nome:'Boato', linha:'Alguém espalha que hoje tem coisa de graça, e a casa lota.' }`
- **Save:** `save.guia` (`n` inteiro de 0 a 2, `prox` inteiro ≥ 0, `v` lista de até 2 fichas com `d` inteiro e `it` de cinco inteiros de 0 a 2; inválido, apaga) e `save.convCrit`. Save da v10.8 no Fim (`cap` 13, `capV` 3) no Terraço começa o capítulo 13 com a conversa de antes: `save.capV` passa a 4.

## Critérios de aceite
- **CA1** Ao começar o capítulo 13, `save.guia.prox` cai de 1 a 3 dias à frente; depois da 1ª visita, de 2 a 3; recomeçar o dia não muda nada → `smoke74` (1)
- **CA2** No dia da visita, exatamente um grupo tem `critico`, sozinho, chegando entre 30% e 60% da janela; nos outros dias, nenhum → `smoke74` (2)
- **CA3** O disfarce: sem acessório de exigente, sem plaquinha e fora do `stats.vip`, mas pede o prato da casa e sempre avalia → `smoke74` (3)
- **CA4** O caderninho fica 1,8 s depois de sentar e depois de cada um dos quatro tempos servidos → `smoke74` (4)
- **CA5** A ficha: visita perfeita (sem espera, 5 corações, Prato da Rosa, salão limpo, quatro tempos) dá 10; cada item cai como nas Regras (um caso por item); bravo dá 0 → `smoke74` (5)
- **CA6** O fim do dia da visita mostra o cartão com as cinco linhas, e a conversa da 1ª visita toca uma vez → `smoke74` (6)
- **CA7** O boato: no dia da 2ª visita os grupos são os do dia comum × 1,25 (±1), sem clima nem evento, e a introdução traz o texto do boato → `smoke74` (7)
- **CA8** O comentário plantado aparece na lista do Gurugol e a nota geral não muda com ele → `smoke74` (8)
- **CA9** O capítulo 13 se cumpre no fim do dia da 2ª visita, qualquer que seja a ficha; o capítulo 12 não mostra mais cartão de fim; save da v10.8 no Fim começa o 13 → `smoke74` (9)
- **CA10** Modo dev: "Hoje" e "Hoje com boato" trazem o crítico no dia que começa sem mexer no `save.guia` → `smoke74` (10)
- **CA11** Manual: `i-critico` e `i-boato` revelam no fim do dia em que acontecem → `smoke74` (11)
- **CA12** A campanha: `DIAS=100 node carreira.js 10` mostra a linha `CRITICO` com as duas visitas em pelo menos 8 das 10 carreiras e a ficha média entre 6 e 9 na 1ª e entre 5 e 9 na 2ª; se a média da 1ª passar de 9, baixe `CRITICO.salaoT` de 6 para 3; se a da 2ª ficar abaixo de 5, baixe `CRITICO.lotada` de 1,25 para 1,15
- **CA13** O que se vê → captura `shot_v10_9.js`: o crítico à mesa com e sem o caderninho (recorte ampliado: o caderninho se lê, mas é pequeno, sem balão nem brilho), o cartão da ficha no fim do dia e a introdução do boato

## Partes
- `src/10-constantes.js`: `CRITICO`, `HIST_CRITICO`, `HISTORIA` (capítulo 13; o `fim` do 12), `DEV_CAPS`, `MANUAL`.
- `src/12-clientes.js`: `Group` (`critico`, `disfarce`, o caderninho, as medidas da ficha), `normSave` (`guia`, `convCrit`, `capV` 4).
- `src/16-jogo.js`: `avancaCap` (o sorteio), `sortear` e `buildSchedule` (o crítico e o boato), o `update` (segundos de salão bagunçado), a ficha na saída do grupo, o fim do dia (`guia`, `convCrit`), `capObj` (item `critico`), `devForcaSorteio`, `devCapitulo`.
- `src/20-desenho-base.js` ou `src/22-salao-hud.js`: o caderninho na mão e o VIP sem marca com `disfarce`.
- `src/40-interface.js` (a linha Crítico da aba Hoje), `src/42-resultados.js` (o cartão da ficha), `src/43-telas.js` (`introManut` e a conversa da 1ª visita no `fluxoHistoria`).
- O Gurugol (comentário `boato:true` no `normAvalCom` e na conta da nota).
- `tests/bot.js`, `tests/carreira.js`.

## Tarefas
- [x] T1 Smoke novo `tests/smoke74.js` com CA1 a CA11 (falhando) e no `run_all.sh`.
- [x] T2 `CRITICO`, `save.guia`, o sorteio das visitas e o capítulo 13.
- [x] T3 O crítico no dia: o grupo, o disfarce e o caderninho.
- [x] T4 A ficha: as medidas, o cartão do fim do dia e a conversa da 1ª visita.
- [x] T5 O boato: casa lotada, sem clima nem evento, a introdução e o comentário plantado.
- [x] T6 Modo dev e Manual.
- [x] T7 Desenho do caderninho e dos garfinhos; `shot_v10_9.js` e conferência em recortes.
- [x] T8 `carreira.js`: joga o capítulo 13 e mostra a linha `CRITICO` (visitas e ficha média de cada uma); calibrar CA12 pela receita.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O exigente fora do Terraço já existe pelo `s.exig` do construtor do `Group`: o crítico usa o mesmo caminho, com `disfarce` só tirando o que se vê.
- `salaoBagunca()` (`src/16-jogo.js`, linha 943) já mede a mesa suja do exigente; some os segundos só enquanto o crítico está sentado.
- O dia de evento já apaga o clima no `sortear(n)`: o dia do boato segue o mesmo molde e ganha do evento da semana (não mexa no `save.evento`).
- O harness desliga a História e os imprevistos: o `smoke74` usa `load({historia:true})` ou o `DEV.forca.critico`.

## Testes
- `smoke74` novo (CA1 a CA11): 107 checagens, verde. `carreira.js`: linha `CRITICO` (as duas visitas, a ficha média de cada uma e por item), `cap. 13` na linha `HISTORIA`, `DBGC=1` (como cada visita do crítico fechou) e `CRITICO_CFG='{"pac":1.5}'` (troca números do crítico em runtime); `DIAS=100` chega ao capítulo 13.
- **CA12 medido** (`DIAS=100 node carreira.js 10`): as duas visitas em 10/10 carreiras; ficha média **6,3** na 1ª e **5,6** na 2ª (dentro de 6 a 9 e de 5 a 9). Em 12 carreiras de `DIAS=75`: 8,7 e 5,9. `salaoT` fica em 6 e `lotada` em 1,25. Sem o `pac` (`pac` 1): 4,0 e 2,4 (o crítico ia embora bravo em ~60% das visitas); com `pac` 1,54: 5,3 e 2,9.
- Testes antigos ajustados só nas contagens: `smoke53` (73 fichas), `60` e `69` (13 capítulos: o `fim` do 12 sumiu, o antigo Fim vira o cap. 13; `capV` 4; DEV_CAPS 14), `62` (VERSAO), `63` (14 linhas do dev), `64` (as cenas do dev) e `73` (`capV` 4, o cap. 12 sem `fim`). Nenhuma checagem apagada.
- Capturas: `shot_v10_9.js` (CA13), conferidas e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
- **`CRITICO.pac` = 2 (decisão do usuário, 13/11).** Com as Regras como estavam, o crítico (executiva, com a paciência de VIP ×0,65) perdia a paciência cedo: ia embora bravo em ~60% das visitas (fila e espera da entrada), e a ficha média ficava em 4,0 e 2,4, fora do alvo, sem que `salaoT` ou `lotada` resolvessem. O fator novo multiplica só a paciência dele (`patPer`); o medido está em Testes. Para voltar ao de antes, `pac` 1.
- **O crítico fura a fila como todo VIP**, só que sem o aviso "VIP chegou!", sem o toque de VIP, sem a plaquinha e sem a marca na fila (a Regra dizia "sem marca de VIP"; esperando como todo mundo, ele perdia os 5 corações na fila). `Group.vipAberto` (VIP que se vê) comanda a plaquinha, a marca e o balão do "aguardando mesa".
- **Dia da visita que passou sem ela vale no seguinte** (`g.prox <= n`, não `===`): assim o capítulo nunca trava (por exemplo, com o modo dev pulando dias). A Regra dizia só "no dia `prox`".
- **O crítico que chega com a espera cheia (`bounce`) tem a ficha zerada** (volta para a rua: é sair bravo da fila). A Regra não cobria isso.
- **O crítico bravo** não conta em `stats.vipLost`, não tira gente do dia seguinte (`exigBravo`) e não conta em `stats.exigentes` nem abre as fichas `c-vip` e `c-exigente` do Manual; a multa do grupo bravo (MULTA + VIP.angry) vale.
- **Fora do Terraço** (só no modo dev), sem `tempos`, a linha Refeição da ficha dá 1 garfo se o grupo foi servido (não há quatro tempos).
- **Constantes e funções a mais:** `CRITICO.cap` (13) e `CRITICO.pac`; `normGuia` (valida `save.guia`), `plantaBoato` (o comentário plantado, uma vez só); `Game.criticoDia(n)`, `fechaFicha`, `comecaCritico`.
- **O save**: `capRosa` agora também exige `capV !== 4`, para o save já na v10.9 no cap. 12 não recomeçar o 12; o save no cap. 13 sem `guia` (novo ou apagado por inválido) sorteia a 1ª visita ao ser lido.
- **`introManut`** devolve o boato mesmo com `MANUT.on` desligado (o boato não depende dos imprevistos); o dia do boato não chama `eventoSemana`, e a semana sorteia o evento só no dia seguinte.
- **Desenho:** `drawCaderno` fica ao lado do ombro (o tampo da mesa cobre o peito de quem senta na cadeira de trás) e `drawGarfo` no `20-desenho-base.js`; o Manual ganhou os desenhos `i-critico` (caderninho) e `i-boato` (megafone); o comentário plantado aparece como "Anônimo" na lista do Gurugol.
- **A conversa da 1ª visita** entra na lista das cenas do modo dev ("O crítico, 1ª visita").

**Modelo:** Sonnet, esforço alto (regras e textos fechados; o disfarce atravessa o grupo, o desenho e o Gurugol, e a ficha pede medidas novas no meio do dia)
