# v10.8 — O molho da Rosa: a pétala na mão e a Cami gerente (etapa 6a)

**Situação:** aprovada (13/11)
**Origem:** a Etapa 6 do `docs/PLANO.md` (o crítico do Michelzão e o final), dividida em quatro sessões no planejamento de 13/11 (`docs/PROPOSTAS.md`, "13/11 — usuário: decisões do final"). Esta é a primeira: o capítulo 12.

## Objetivo
O Tonhão enfim conta o segredo da Casa Aurora: o molho da estrela era dele e da Rosa, e o toque dela era uma pétala de rosa posta na hora. A Bia aprende o molho e ganha a última habilidade do jogo: pegar pétalas no vaso e levar o **Prato da Rosa** a quem pede o prato da casa. A Cami sobe a gerente de salão e passa a levar à mesa quem espera na porta, para a Bia ter mão livre no final.

## Fora do escopo
- O crítico disfarçado e a ficha da visita: v10.9 (`docs/spec-v10.9.md`).
- A noite da estrela, o Bráulio à mesa e as estrelas: v10.10. A cena final: v11.
- Pétala em prato que não é o da casa, e Prato da Rosa fora do Terraço.

## Regras (decisões tomadas)
- **Constantes novas** em `src/10-constantes.js`, depois do `EXIGENTE`:
  ```js
  const ROSA = { preco:800, max:2, pega:0.8, mais:20, coracao:1, pts:20, cap:12, coment:'Que molho é esse?!',
    vaso:{ ap:{ x:700, y:150 }, rect:{ x:686, y:104, w:48, h:92 } } };
  const GERENTE = { espera:4, passo:0.5 };
  ```
- **A compra:** na lojinha, seção **Cardápio**, cartão "O molho da Rosa" (R$ 800, "?" da ficha `l-rosa`, botão "Aprender"). Aparece só no Terraço e com `save.cap >= ROSA.cap` (no modo dev livre, sempre no Terraço). Comprado, grava `save.rosa = 1` e sai do caixa como as outras compras da lojinha. Não é um curso do `CURSOS` (não dá xp ao Tonhão nem conta na Diversidade do cardápio).
- **O vaso de rosas:** com `save.rosa`, no Terraço, a estação nova `rosas` (`STATION_KEYS` e `STATIONS.rosas = ROSA.vaso`) fica no armário do corredor da cozinha, onde nos outros pontos está a mesinha das marmitas (`STATIONS.marmj`, sem uso no Terraço por causa do `semRetirada`). O vaso que hoje enfeita o alto do armário passa a ser desenhado com rosas cor `AB_COR.petala` (`#E8457A`). Sem `save.rosa`, o vaso segue como está e o toque ali não faz nada.
- **Pegar pétalas:** tocar no vaso põe na fila da Bia a ação `rosa`: ela vai até o `ap`, leva `ROSA.pega` = 0,8 s e fica com `ROSA.max` = 2 pétalas (`bia.petalas`; enche de uma vez). As pétalas não ocupam as mãos nem a bandeja. No HUD, à esquerda de "MÃOS", aparecem até 2 pétalas pequenas (cheias as que ela tem, apagadas as que faltam), só com `save.rosa`. As pétalas zeram no começo de cada dia. Com 2 pétalas, o toque no vaso mostra o aviso curto "Já tenho pétalas" (pelo `fail`), sem andar.
- **O Prato da Rosa:** quando a **Bia** pega no balcão um prato com `casa` (o prato da casa do cliente exigente) e tem pétala, gasta uma e o prato sai com `rosa:true` e `crit:true`. Só a Bia põe a pétala: com `save.rosa`, a Dani, o Joca e a Cami não pegam prato com `casa` no balcão (fica para ela). Sem pétala, a Bia leva o prato da casa comum, como hoje.
- **Na mesa:** ao servir o prato com `rosa`, o grupo ganha `ROSA.coracao` = 1 coração a mais (até 5), a conta do grupo sobe `ROSA.mais` = R$ 20, a Bia ganha `ROSA.pts` = 20 pontos, sobe o texto "Prato da Rosa!" e conta em `stats.rosa`. O grupo fica com `grp.rosa = true` e, se deixar comentário bom de Qualidade da comida no Gurugol, em metade das vezes ele é `ROSA.coment`.
- **Desenho:** o prato com `rosa` leva uma pétala `#E8457A` em cima (no `drawDish`, no balcão, na mão e na mesa). Com `prefers-reduced-motion`, nada pisca; sem ele, a pétala dá um brilho curto ao ser servida.
- **Capítulo 12** (entra no `HISTORIA`, depois do 11; o capítulo 11 perde o `fim`, e a conversa de depois dele segue igual):
  ```js
  { cap:12, titulo:'O molho da Rosa', ponto:'terraco', obj:{ compra:'rosa', rosa:3, vezes:3 },
    antes:[
      { q:'bia', s:'Tio, se o crítico vem, o que a gente serve pra ele?' },
      { q:'tonhao', nota:'abrindo o pote de cominho', s:'Tá na hora de eu te contar da Casa Aurora.' },
      { q:'tonhao', s:'O molho da estrela era meu e da sua mãe. Cominho com açafrão... e o segredo dela.' },
      { q:'bia', s:'Que segredo?' },
      { q:'tonhao', s:'Uma pétala de rosa, posta na hora. O Bráulio nunca descobriu.' },
      { q:'dani', s:'Então a gente tem o que ele não tem!' }],
    depois:[
      { q:'bia', s:'Todo mundo pergunta que molho é esse, tio.' },
      { q:'tonhao', nota:'enxugando o olho no avental', s:'Igualzinho ao dela.' },
      { q:'cami', s:'Bia, deixa a porta comigo. Eu organizo a fila e as mesas.' },
      { q:'bia', s:'Gerente de salão, Cami. Você merece.' }],
    fim:{ h:'Fim do capítulo 12', p:'Continua na próxima versão: o crítico sem aviso.' } }
  ```
  Itens do objetivo (`capObj`): "Aprender o molho da Rosa" (cumprido: "Molho da Rosa aprendido") e "3 Pratos da Rosa servidos num dia, 3 vezes (n de 3)". No fim do dia, `stats.rosa >= 3` soma 1 em `save.capVezes` (como os VIPs do capítulo 7).
- **Cami gerente de salão:** curso novo no `CAMI_CURSOS`: `{ id:'gerente', nome:'Gerência de salão', preco:1200, nivel:4, dep:'salao', cap:12 }` (o cartão só aparece com `save.cap >= 12` ou no modo dev livre). Dá o nível 5 da Cami: `STAFF.cami.levels[5] = { speed:1.35, tasks:4, pay:200, mesas:true, tudo:true, gerente:true }` (só no Terraço, como o nível 4; o `normEquipe` segue a mesma regra do 4).
  - **O que a gerente faz:** com a Cami no nível 5 trabalhando no dia e `equipe.camiFila` ligado, a cada `GERENTE.passo` = 0,5 s o jogo olha a fila na ordem da fila justa: o primeiro grupo parado na fila há `GERENTE.espera` = 4 s ou mais, que não está sendo arrastado e tem mesa aberta, limpa e livre em que caiba, é sentado pelo `seatGroup`. A mesa escolhida é a menor em que o grupo cabe; no empate, a de cadeira da cor da camisa do grupo; depois, a mais perto da porta. Um grupo por passo. A Cami não anda até a porta (ela "chama da porta": sobe o texto "Mesa N!" em cima do grupo). Vale em qualquer modo dela (Tarefas, Minhas mesas, Ajuda em tudo). Os pontos de sentar e o bônus de cor valem como se a Bia tivesse sentado; a corrente da Bia não muda.
  - **No cartão da Cami** (lojinha, com o nível 5): a linha "Organiza a fila" com os botões "Sim" e "Não" (`equipe.camiFila`, padrão `true`). O jogador pode sempre sentar arrastando, com ela ligada ou não.
- **Modo dev:** `DEV_CAPS` ganha o `n:12` como começo do capítulo 12 (dia 64, Terraço, caixa 10000, nota 4,6, tudo no máximo menos o molho e a gerência) e o Fim passa a `n:13`; o botão "Tudo no máximo" compra o molho e a gerência. Na aba Hoje, a linha `Pétala: Normal | Sempre` (`DEV.forca.rosa`: com "Sempre", todo prato da casa que a Bia pega sai com pétala, em qualquer ponto).
- **Manual** (sem números):
  - `{ id:'l-rosa', aba:'lojinha', nome:'O molho da Rosa', linha:'O prato da casa ganha o molho da Rosa. Pegue pétalas no vaso antes de buscar o prato: só a Bia sabe pôr.' }` (revela na compra);
  - `{ id:'l-gerente', aba:'lojinha', nome:'Gerência de salão', linha:'A Cami leva à mesa quem espera na porta. Dá para desligar no cartão dela.' }` (revela quando o cartão aparece).
- **Save:** `save.rosa` (0 ou 1), `save.equipe.camiFila` (booleano, padrão `true`), `save.camiCursos.gerente`. `save.capV` passa a 3: o save com `capV === 2` e `cap === 12` (o Fim da v10.7) no Terraço começa o capítulo 12 com a conversa de antes (`capDia = dia`, `capVezes = 0`); os outros só trocam o `capV`. O comentário do `HISTORIA` passa a dizer "12 capítulos; 13 = o Fim".

## Critérios de aceite
- **CA1** O cartão "O molho da Rosa" só aparece no Terraço com `save.cap >= 12`; comprar custa R$ 800 e grava `save.rosa` → `smoke73` (1)
- **CA2** Sem `save.rosa`, tocar no vaso não faz nada; com ele, a Bia fica com 2 pétalas em 0,8 s, sem ocupar as mãos, e as pétalas zeram no dia seguinte → `smoke73` (2)
- **CA3** A Bia com pétala pega um prato da casa: gasta 1 pétala e o prato sai com `rosa` e `crit`; sem pétala, sai sem `rosa`; prato comum não gasta pétala → `smoke73` (3)
- **CA4** Com `save.rosa`, nenhum ajudante pega prato com `casa` no balcão → `smoke73` (4)
- **CA5** Servir o Prato da Rosa dá 1 coração a mais (sem passar de 5), R$ 20 na conta, 20 pontos e `stats.rosa` + 1 → `smoke73` (5)
- **CA6** Capítulo 12: o objetivo tem os dois itens; um dia com 3 Pratos da Rosa soma 1 vez; com a compra e 3 vezes a conversa de depois fica pendente; o capítulo 11 não mostra mais cartão de fim → `smoke73` (6)
- **CA7** Save da v10.7 no Fim (`capV` 2, `cap` 12) chega no capítulo 12 com a conversa de antes; `normSave` limpa `rosa` e `camiFila` inválidos → `smoke73` (7)
- **CA8** Gerência: o curso só aparece com `save.cap >= 12` e depois do curso de salão; dá o nível 5 e a diária de R$ 200 → `smoke73` (8)
- **CA9** Com a gerente, um grupo parado na fila há 4 s com mesa livre é sentado sozinho, na menor mesa em que cabe; antes de 4 s, sem mesa limpa ou com "Organiza a fila: Não", fica na fila → `smoke73` (9)
- **CA10** Modo dev: o capítulo 12 da lista começa no Terraço com a conversa de antes; "Pétala: Sempre" põe a pétala sem vaso → `smoke73` (10)
- **CA11** Manual: `l-rosa` revela na compra e `l-gerente` quando o cartão aparece → `smoke73` (11)
- **CA12** Balanceamento do Terraço: `PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=5 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 LUXO=tudo ROSA=1 node balance.js 40`: as metas passam em no máximo 100% e o lucro médio fica no máximo 8% acima do mesmo comando com `CAMI=4 ROSA=0`; se passar de 8%, suba `GERENTE.espera` de 4 para 6 e, se ainda passar, baixe `ROSA.mais` de 20 para 10
- **CA13** A campanha: `DIAS=90 node carreira.js 10` mostra o capítulo 12 cumprido na linha `HISTORIA` em pelo menos 8 das 10 carreiras, com mediana de até 8 dias depois do capítulo 11; se levar mais de 8, baixe `obj.rosa` de 3 para 2 (e o texto do item junto)
- **CA14** O que se vê → captura `shot_v10_8.js`: o vaso de rosas no armário, as 2 pétalas no HUD, o Prato da Rosa no balcão e na mesa, e o cartão da Cami com "Organiza a fila"; conferir em recorte ampliado que a pétala se lê no prato e que as pétalas do HUD não encostam em "MÃOS"

## Partes
- `src/10-constantes.js`: `ROSA`, `GERENTE`, `STATIONS.rosas`, `CAMI_CURSOS`, `STAFF.cami.levels[5]`, `HISTORIA` (capítulo 12; o `fim` do 11), `DEV_CAPS`, `MANUAL`.
- `src/12-clientes.js`: `STATION_KEYS`, `normEquipe` (nível 5 e `camiFila`), `normSave` (`rosa`, `capV` 3).
- `src/14-bia.js`: `apFor`, `duration`, `perform` (a ação `rosa` e a pétala ao pegar o prato, perto da linha 240), `reset` (`petalas`).
- `src/15-dani.js`: o prato com `casa` fica para a Bia (onde o ajudante escolhe o prato do balcão, perto da linha 215).
- `src/16-jogo.js`: a entrega do prato (perto da linha 524: coração, conta, pontos, `stats.rosa`), `capObj` e o fim do dia (item `rosa` e `compra`), a gerente (no `update`, junto da fila), `tapStation`, a compra do molho, `devCapitulo` e o "Tudo no máximo".
- `src/20-desenho-base.js` (`drawDish` com a pétala), `src/21-cenario.js` (o vaso com rosas), `src/22-salao-hud.js` (as pétalas no HUD e o "Mesa N!").
- `src/40-interface.js` (a linha Pétala da aba Hoje), `src/41-lojinha.js` (o cartão do molho, o curso de gerência e a linha "Organiza a fila").
- `tests/bot.js`, `tests/balance.js`, `tests/carreira.js`.

## Tarefas
- [ ] T1 Smoke novo `tests/smoke73.js` com CA1 a CA11 (falhando) e no `run_all.sh`.
- [ ] T2 Constantes, `normSave` (`rosa`, `capV` 3, `camiFila`) e o capítulo 12 com o objetivo novo.
- [ ] T3 O vaso, a ação `rosa` da Bia, a pétala ao pegar o prato da casa e a regra dos ajudantes.
- [ ] T4 A entrega do Prato da Rosa (coração, conta, pontos, comentário) e o cartão do molho na lojinha.
- [ ] T5 A Cami gerente: curso, nível 5, a fila organizada e a linha do cartão.
- [ ] T6 Modo dev e Manual.
- [ ] T7 Desenho: o vaso, a pétala no prato e no HUD; `shot_v10_8.js` e conferência em recortes.
- [ ] T8 Bot: pega pétalas quando há prato da casa na cozinha e ela está sem (`ROSA=0|1`, padrão 1 quando `save.rosa`); `CAMI=5`; o `carreira.js` compra o molho e a gerência no capítulo 12. Calibrar CA12 e CA13 pela receita.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O prato na mão já carrega `casa` (`src/14-bia.js`, linha 240, e `src/15-dani.js`, linha 215): a pétala entra ali, sem mexer na cozinha.
- O `seatGroup(g, t)` (`src/16-jogo.js`, linha 911) já faz tudo de sentar; a gerente só escolhe o grupo e a mesa. Confira em que estado e campo o grupo guarda o tempo parado na fila (`stateT`) e como o jogo sabe que ele está sendo arrastado.
- O `normSave` já tem a conversão do `capV` 2 (linha 184): a do 3 vai logo depois, sem tocar nela (o `smoke69` depende).
- Vários smokes contam capítulos, fichas do Manual, cursos da Cami e o Fim em `cap` 12: ajuste só as contagens e anote em Testes.
- Confira na captura onde fica o vaso do armário no Terraço; se o `rect` do `ROSA.vaso` não cobrir o vaso e o armário, ajuste só o `rect` (o `ap` fica).

## Testes
- `smoke73` novo (CA1 a CA11). Chaves novas: `ROSA=0|1` e `CAMI=5` no `balance.js`; o `carreira.js` joga o capítulo 12.
- Capturas: `shot_v10_8.js` (CA14), conferidas e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (regras e textos fechados, mas mexe em muitas partes ao mesmo tempo: Bia, ajudantes, fila, lojinha, save e bot, com calibração por receita)
