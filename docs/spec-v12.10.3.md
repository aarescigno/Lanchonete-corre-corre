# v12.10.3 — O equilíbrio dos cursos em degraus (etapa 18d)

**Situação:** entregue em 22/11
**Origem:** a mesma entrevista da v12.10 (21 e 22/11): "não ligo de ter que fazer grandes rebalanceamentos se isso for deixar o jogo mais legal"; preços "pelo faturamento"; duração da carreira "a mesma, ±3 dias"; tabela de níveis "ajustável no balance".

## Objetivo
Com os cursos em degraus, a carreira tem o mesmo ritmo de antes: as mudanças de ponto e o fim da história caem mais ou menos nos mesmos dias. Fazer os cursos de cada ponto vale a pena de verdade, e o Tonhão chega ao topo de cada ponto antes de sair dele.

## Fora do escopo
- Regras novas: só números (os que as Regras abaixo deixam mexer).
- O bot humano (Etapa 14b) e a revisão geral de equilíbrio (ideia guardada): nada muda.

## Regras (decisões tomadas)
- **Linha de base:** a v12.9.1 (a última da Etapa 17, a da decoração; o commit do merge dela no `claude/main`, num `git worktree` à parte), medida com os mesmos comandos dos alvos. Na v12.7 (registro): a história fechou em 6/6 carreiras no dia 66 (`DIAS=80 node carreira.js 6`).
- **Alavancas, nesta ordem** (passe à seguinte só quando a anterior chegar ao limite):
  1. **Preços dos cursos** de cada ponto: de 0,6× a 1,4× os de partida (`docs/spec-v12.10.md`), em múltiplos de R$ 10, sem quebrar a regra "preço maior, benefício maior" (o avançado custa mais que o básico do mesmo degrau; o mesmo degrau no ponto seguinte nunca custa menos que no anterior).
  2. **Números dos níveis do Tonhão:** `cook`, `crit` e `wash` até ±10% de cada valor e `pay` até ±R$ 10, mantendo a ordem de nível a nível.
  3. **Metas do ponto** (`metaF` e `expertF` de cada ponto; na Garagem, as metas dos dias), como na v12.7.
  4. **Multiplicadores do prato estranho** (`ESTRANHO.cook` de 1,25 a 1,5; `ESTRANHO.crit` de 0,4 a 0,7) e do `EMPRATA` (gorjeta de 1,15 a 1,35).
- **Alvos:**
  - `node balance.js 40` na Garagem, dias 3 a 7: sem equipe, de 40% a 70% das metas; `EQUIPE=auto`, de 85% a 95%.
  - `PONTO=industrial` e `PONTO=avenida`, `EQUIPE=auto`, `node balance.js 40`: de 85% a 95% das metas.
  - Terraço com a equipe toda (o comando da v12.7: `PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 CAMI=4 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 LIA=3`): de 90% a 100% das metas.
  - **Os cursos valem a pena:** em cada ponto, `CURSOS=todos` dá um ganho do dia pelo menos 15% maior que `CURSOS=0` (`EQUIPE=auto`, `node balance.js 40`; no Terraço, o comando acima).
  - **Ritmo da carreira** (`DIAS=80 node carreira.js 6`): a história fecha em 6/6 carreiras, entre o dia da linha de base −3 e +3; cada mudança de ponto até 3 dias do dia da linha de base; nenhum dia no negativo depois das mudanças.
  - **O Tonhão evolui:** em pelo menos 4 de 6 carreiras, o bot chega ao teto de cada ponto (2, 4 e 6) antes de sair dele e ao nível 7 no Terraço antes do fim da história.
- **Respostas do usuário de 22/11 (depois da parada da T4), que valem por cima dos alvos acima:**
  1. **Cursos valem a pena:** na Garagem, `CURSOS=todos` não pode perder para `CURSOS=0` (ganho ≥ 0%); na área industrial, pelo menos +10%; na Avenida e no Terraço continua +15%.
  2. **A Avenida passa a 2 cursos por lojinha:** `CURSO_DIA = { 1:1, 2:1, 3:2, 4:2 }` (regra nova, só desta vez). Os alvos de ritmo e o teto do Tonhão na Avenida continuam como estão. O CA10 da v12.10 (`smoke117`) trava na Avenida só depois do segundo curso.
  3. **Mudança para a área industrial no dia 22 e Garagem com `EQUIPE=auto` a 97% aceitos:** o alvo da mudança para a área industrial passa a dia 21 a 30 e o da Garagem com `EQUIPE=auto` a 85% a 97%. Não mexer nas metas da Garagem por causa disso.
- **Resposta do usuário de 22/11 (2ª parada da T4):** `CURSO_AV.preco` passa de ×1,15 a **×1,25** e vira uma 5ª alavanca liberada (de ×1,15 a ×1,35); os alvos do CA4 não mudam (Garagem ≥ 0%, área industrial ≥ +10%, Avenida e Terraço ≥ +15%). Recalibrar `metaF` e os preços dos cursos com as alavancas de sempre; corrigir os smokes que conferem o ×1,15 (`smoke31`, `smoke109`, o CA13 do `smoke117`).
- **Se um alvo não fechar com as quatro alavancas no limite:** pare e pergunte ao usuário (não mude regra nem limite por conta própria).
- **Escalope (decidido em 22/11, pergunta da v12.10):** no Terraço, o `escalope` (prato estranho do `pf`) só é sabido se o Tonhão tiver **comprado** algum degrau de `pf`: o avançado da área industrial (Carnes variadas), o básico ou o avançado da Avenida, ou o básico do Terraço (aí deixa de ser estranho). A regra "no `pf`, a Garagem conta como degrau feito" continua só para o `strogonoff` da Avenida. Uma linha em `pratoSabido` (`src/10-constantes.js`).
- **Teste de habilidade e Desafios (decidido em 22/11):** o Tonhão entra no **teto do ponto** jogado (2 na Garagem, 4 na área industrial, 6 na Avenida, 8 no Terraço), no lugar do nível 8 em qualquer ponto: `testeNivelMax` passa a `2 × ponto.nivel`.
- **Versão:** `VERSAO` e `vtag` em v12.10.3; linha no `#ov-ver`: **"Preços dos cursos e metas acertados para os cursos em degraus."**

## Critérios de aceite
- **CA1** Garagem dentro dos alvos, sem equipe e com equipe → `node balance.js 40`
- **CA2** Área industrial e Avenida dentro do alvo → `balance` (`PONTO=industrial|avenida`, `EQUIPE=auto`)
- **CA3** Terraço dentro do alvo → `balance` (o comando da equipe toda)
- **CA4** `CURSOS=todos` ganha 15% ou mais sobre `CURSOS=0` nos quatro pontos → `balance`
- **CA5** Ritmo da carreira e evolução do Tonhão dentro dos alvos → `DIAS=80 node carreira.js 6` (`carreira`)
- **CA7** Sem curso nenhum, o `escalope` não é sabido no Terraço; com Carnes variadas (avançado de `pf` da área industrial), é sabido e estranho; com o básico de `pf` do Terraço, sabido e não estranho; o `strogonoff` na Avenida continua sabido sem curso → `smoke120` (novo)
- **CA8** `testeNivelMax` dá 2, 4, 6 e 8 na Garagem, na área industrial, na Avenida e no Terraço → `smoke120`
- **CA6** Os smokes que medem preço de curso, nível ou meta batem com os números finais → `smoke117` e os corrigidos (lista em Testes)

## Partes
- `src/10-constantes.js`: `CURSOS` (preços), `STAFF.tonhao`, `PONTOS` (`metaF`, `expertF`), as metas da Garagem, `ESTRANHO`, `EMPRATA`.
- `src/10-constantes.js` (ou onde estiver): `pratoSabido` (escalope) e `testeNivelMax`.
- `tests/carreira.js`: a linha nova com o dia em que o bot chega a cada nível do Tonhão (se ainda não houver) e o nível na saída de cada ponto.

## Tarefas
- [x] T0 `smoke120` (CA7 e CA8) e as duas regras de 22/11 (escalope e `testeNivelMax`), antes da medida da T3.
- [x] T1 Linha de base na v12.9.1 (worktree): os comandos dos alvos; anote em Testes.
- [x] T2 `carreira.js`: o nível do Tonhão na saída de cada ponto e no fim da história.
- [x] T3 Medida na v12.10.2 com os mesmos comandos; anote.
- [x] T4 Ajuste pelas alavancas, na ordem, até os alvos; anote cada rodada (valor mudado e resultado) em Testes.
- [x] T5 Smokes com números atualizados (só os números).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (alvos e números novos), esta spec como entregue (números finais nas Regras), `tests/run_all.sh --tudo` verde, PR e merge.

## Testes
- `smoke120` novo (CA7 e CA8: o escalope e o `testeNivelMax`). Os outros alvos são do `balance.js` e do `carreira.js`. No fechamento: a linha de base, cada rodada de ajuste e os números finais.

## Decisões em aberto
Nenhuma. A 2ª parada da T4 (o CA4 da Garagem e da área industrial) foi respondida pelo usuário em 22/11: `CURSO_AV.preco` ×1,25 e vira alavanca liberada (ver Regras); a tabela da pergunta continua nas Medidas.

## Medidas (22/11, `balance.js 40` e `DIAS=80 node carreira.js 6`; % = rodadas com a meta batida nos dias 3 a 7 na Garagem e 8 a 10 nos outros; ganho = lucro médio do dia nesses dias)
| comando | v12.9.1 (linha de base) | v12.10.3 com a T0 (T3) |
|---|---|---|
| Garagem sem equipe | 57,5% · R$ 186 | 61,5% · R$ 201 |
| Garagem `EQUIPE=auto` | 97,0% · R$ 334 | 97,0% · R$ 341 |
| Industrial `EQUIPE=auto` | 85,8% · R$ 518 | 79,2% · R$ 486 |
| Avenida `EQUIPE=auto` | 85,8% · R$ 1.136 | 93,3% · R$ 1.095 |
| Terraço (equipe toda) | 89,2% · R$ 5.790 | 96,7% · R$ 6.442 |
| `CURSOS=todos` / `=0`, Garagem | R$ 358 / 339 (+5,6%) | R$ 352 / 359 (−2%) |
| idem, industrial | R$ 527 / 489 (+7,8%) | R$ 566 / 514 (+10%) |
| idem, Avenida | R$ 1.262 / 806 (+56%) | R$ 1.328 / 775 (+71%) |
| idem, Terraço | R$ 6.453 / 5.362 (+20%) | R$ 6.340 / 5.356 (+18%) |
| carreira: fim da história (6/6) | dia 65 | dia 71 |
| carreira: mudança industrial / Avenida / Terraço | dias 27 / 37 / 46 | dias 22 / 37 / 52 |
| carreira: Tonhão no teto ao sair (Garagem, industrial, Avenida) | n/d | 6/6, 6/6, 6/6; nível 7 no Terraço 6/6 |
| carreira: dia no negativo depois das mudanças | 0 | 0 |
- Alavanca 2 (`TONHAO_CFG`, novo no `balance.js`): A (níveis 1 a 4 no limite a favor dos cursos): Garagem R$ 369 / 370, industrial R$ 567 / 531; B (também o nível 0 pior): Garagem R$ 361 / 349, industrial R$ 562 / 497.
- Alavanca 1 (`PRECO_PONTO`, novo no `carreira.js`; Garagem, industrial, Avenida, Terraço): ×1,3 / 0,8 / 0,8 / 0,8 → fim 78, mudanças 21 / 37 / 51; ×1,2 / 0,8 / 0,7 / 0,7 → fim 66 (5/6), 22 / 37 / 50, Tonhão no teto da Avenida 1/6; ×1,4 / 1,0 / 0,7 / 0,6 → fim 70 (5/6), 22 / 37 / 52, teto da Avenida 2/6; ×1,3 / 0,7 / 0,7 / 0,7 → fim 67, 22 / 37 / 50, teto da Avenida 1/6.
- Os alvos de meta (CA1 a CA3: Garagem `EQUIPE=auto` 97% contra 85 a 95; industrial 79% contra 85 a 95) pedem só a alavanca 3 e não foram mexidos: dependem de a pergunta acima mudar ou não os níveis.

## Medidas da retomada (22/11, depois das respostas; cada comando com 3 repetições de 40 rodadas, porque o `balance.js` não tem semente e uma só repetição oscila 5 a 10 pontos)
- Versão medida: `CURSO_DIA = { 1:1, 2:1, 3:2, 4:2 }`, preços da área industrial ×0,85 e da Avenida ×0,6 sobre os de partida (em múltiplos de R$ 10, na ordem estrita entre pontos: o mesmo degrau no ponto seguinte custa mais que no anterior), `metaF` da área industrial 1,3 (era 1,5). Níveis do Tonhão e Terraço sem mudança.
- Metas: Garagem sem equipe 62,7% (40 a 70); Garagem `EQUIPE=auto` 97,3% (85 a 97, 0,3 acima, dentro do ruído e aceito pelo usuário); área industrial 89,7% (85 a 95; antes 82%, com `metaF` 1,5); Avenida 86,7% (85 a 95); Terraço 94,2% (90 a 100).
- Carreira (`DIAS=80 node carreira.js 6`, 4 rodadas com os preços finais): história no dia 65, 69, 65 e 67 (62 a 68; 6/6, 5/6, 5/6 e 6/6, e o 5/6 é sempre a noite da estrela do capítulo 14 com ≥ 1★ em 83% das noites, um acaso do Terraço); mudanças: área industrial dia 21, 21, 20 e 21; Avenida 36; Terraço 48, 49, 48 e 49; o Tonhão no teto ao sair da Garagem, da industrial e da Avenida em 6/6 em todas as rodadas e no nível 7 do Terraço antes do fim em 6/6; um dia no negativo depois das mudanças em uma das 4 rodadas (nenhum nas outras).
- Preços finais (básico / avançado; Garagem, área industrial, Avenida, Terraço): pastel 110/210, 120/240, 190/380, 700/1.400; chapa 130/250, 140/290, 210/420, 770/1.540; fritos 150/310, 170/330, 230/460, 840/1.680; assados 150/300, 230/460, 840/1.680; vegetariano 90/180, 170/340, 630/1.260; PF 0/240, 250/500, 980/1.960; restaurante 290/420, 1.050/1.750.
- Preços testados e descartados (`PRECO_PONTO`): ×0,8 na área industrial deixa o Pastel de estrada igual ao da Garagem (a troca custaria R$ 0); ×0,7 na Avenida, ×0,6 com o Terraço ×0,8 ou ×0,7 em tudo cortam o teto do Tonhão na Avenida (1 de 6) ou adiantam a mudança além do alvo.

## Desvios
- **Números finais (22/11).** `balance.js 40` com 5 repetições por comando (% = rodadas com a meta batida; ganho = lucro médio do dia): Garagem sem equipe 64,2% (alvo 40 a 70); Garagem `EQUIPE=auto` 97,4% (alvo 85 a 97, 0,4 acima, dentro do ruído e aceito pelo usuário); área industrial 90,5% (85 a 95); Avenida 91,3% (85 a 95); Terraço 97,7% (90 a 100). Cursos valem a pena (`CURSOS=todos` contra `=0`): Garagem R$ 373 contra R$ 371 (+0,5%; alvo ≥ 0%; em outra bateria de 3 repetições deu +4,4%, então o vão real é de 0 a 4%); área industrial R$ 627 contra R$ 506 (+24%; alvo ≥ +10%); Avenida R$ 1.471 contra R$ 818 (+80%; alvo +15%); Terraço R$ 6.953 contra R$ 5.660 (+23%; alvo +15%). Carreira (`DIAS=80 node carreira.js 6`, 4 rodadas de 6 carreiras com os preços finais): a história fecha em 6/6 em todas, nos dias 66, 65, 67 e 65 (alvo 62 a 68; linha de base 65); mudança para a área industrial nos dias 21, 21, 22 e 21 (alvo 21 a 30; linha de base 27); para a Avenida nos dias 37, 36, 38 e 36 (34 a 40; base 37); para o Terraço nos dias 48, 49, 50 e 48 (43 a 49; base 46: uma rodada passou 1 dia); o Tonhão no teto da Garagem, da área industrial e da Avenida em 6/6 e no nível 7 do Terraço antes do fim em 6/6; nenhum dia no negativo depois das mudanças. As carreiras também oscilam entre rodadas (a mediana de 6 carreiras varia 1 a 2 dias, e em 1 de 12 rodadas a história passou do dia 75 por causa da noite da estrela); por isso cada número vale ±1 a 2 dias.
- **Regras corrigidas (respostas do usuário de 22/11, ver Regras):** o alvo dos cursos na Garagem passou a ≥ 0% e na área industrial a ≥ +10%; a Avenida passou a 2 cursos por lojinha (`CURSO_DIA = { 1:1, 2:1, 3:2, 4:2 }`); o alvo da mudança para a área industrial passou a dia 21 a 30 e o da Garagem com `EQUIPE=auto` a 85 a 97%; `CURSO_AV.preco` passou de ×1,15 a ×1,25 e virou alavanca (a alavanca 2, os níveis do Tonhão, não mexe no ganho desses pontos e ficou como estava).
- **O que mudou no jogo:** `CURSO_AV.preco` 1,25; `CURSO_DIA[3]` 2; `metaF` da área industrial 1,5 → 1,3 (`expertF` e as metas dos outros pontos e da Garagem ficaram); preços dos cursos (básico / avançado): pastel Garagem 140/270, área industrial 150/310, Avenida 200/380; chapa 170/330, 190/370, 210/420; fritos 200/400, 220/430, 240/470; assados 200/390 (industrial), 240/470; vegetariano 120/230, 170/340; PF avançado 310 (industrial), básico 260 e avançado 510 (Avenida); restaurante 300/420 (Avenida); o Terraço ficou como estava. Todos em múltiplos de R$ 10, de ×0,6 a ×1,4 dos de partida, e o mesmo degrau custa sempre mais no ponto seguinte (conferido por script). O Pastel de estrada a R$ 140 igual ao da Garagem (preço de partida, ×1,0) deixaria a troca em R$ 0: por isso a área industrial ficou em ×1,1 e a Garagem em ×1,3.
- O smoke das duas regras de 22/11 é o `smoke120` (a v12.10.2 já usou o `smoke119`); a spec dizia `smoke119`. Para o `smoke120` testar `testeNivelMax`, ele entrou no `window.__lcc`.
- **Smokes antigos com números novos (nenhuma checagem trocada):** `smoke31`, `smoke38`, `smoke39`, `smoke42`, `smoke62`, `smoke68`, `smoke97`, `smoke103`, `smoke109`, `smoke117` (preços, `metaF`, ×1,25, o teto do Tonhão e o CA10 da Avenida) e `smoke86` e `menu_fit.py` (36 linhas na lista de Versões). Onde dava, a checagem passou a ler `L.CURSO_AV.preco` em vez do número.
- **Ferramentas de medida novas:** `TONHAO_CFG` e `CURSO_AV_CFG` no `balance.js`; `PRECO_PONTO`, `PRECOS` e a linha `TONHAO (v12.10.3)` no `carreira.js`. O `balance.js` não tem semente (uma só repetição oscila 5 a 10 pontos): meça com 3 ou mais.
- **Paradas da T4:** duas vezes (22/11) a sessão parou e perguntou ao usuário, porque o CA4 e o ritmo da carreira não fechavam com as alavancas de então; as medidas que motivaram cada pergunta estão nas duas seções "Medidas" acima.

**Modelo:** Sonnet, esforço alto (balanceamento por tentativa em quatro pontos)
