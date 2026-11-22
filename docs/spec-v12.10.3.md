# v12.10.3 — O equilíbrio dos cursos em degraus (etapa 18d)

**Situação:** rascunho
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
- [ ] T4 (parada na pergunta de Decisões em aberto) Ajuste pelas alavancas, na ordem, até os alvos; anote cada rodada (valor mudado e resultado) em Testes.
- [ ] T5 Smokes com números atualizados (só os números).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (alvos e números novos), esta spec como entregue (números finais nas Regras), `tests/run_all.sh --tudo` verde, PR e merge.

## Testes
- `smoke120` novo (CA7 e CA8: o escalope e o `testeNivelMax`). Os outros alvos são do `balance.js` e do `carreira.js`. No fechamento: a linha de base, cada rodada de ajuste e os números finais.

## Decisões em aberto
**Pergunta ao usuário (22/11, parada da T4: dois alvos não fecham com as alavancas no limite; números em Medidas):**
1. **"Os cursos valem a pena" (CA4, +15%) na Garagem e na área industrial.** Na Garagem o ganho do dia é o mesmo com e sem cursos (R$ 352 com todos, R$ 359 sem nenhum; na v12.9.1, R$ 358 e 339); com a alavanca 2 no limite a favor dos cursos (cook −10%, crit +10%, wash −10%, pay −R$ 10) dá R$ 369 e R$ 370, e piorando também o nível 0 dá R$ 361 e R$ 349 (+3%). Na área industrial: +10% (R$ 566 e R$ 514), +6,8% no limite e +13% piorando o nível 0. Quem limita o ganho ali é o movimento (a freguesia), não a cozinha, então número de nível não resolve. Opções: (a) o alvo da Garagem e da área industrial cai para "não perde" (≥ 0%) e fica o +15% só na Avenida (+71%) e no Terraço (+18%); (b) uma regra nova (por exemplo, o curso do degrau traz movimento ou preço no ponto baixo, como o `veg` traz +5% de movimento); (c) outro número.
2. **Ritmo da carreira (CA5): o Terraço no dia 43 a 49 não combina com o Tonhão no teto da Avenida (nível 6) antes de sair.** O nível 6 pede todos os 14 cursos da Avenida (7 técnicas, básico e avançado) e o bot compra 1 por dia (`CURSO_DIA`), então a estada na Avenida dura 14 dias ou mais (37 → 51 ou mais); a linha de base saiu no dia 46 (9 dias). Com os preços de partida: a história fecha no dia 71 e o Terraço no 52, ambos fora de ±3; com preços menores (×0,7 na Avenida e no Terraço) fecha no dia 67 e o Terraço no 50, mas o Tonhão só chega ao teto da Avenida em 1/6 (alvo: 4/6). Opções: (a) afrouxar o alvo do Terraço para o dia 52 (±3) e da história para o dia 71; (b) o Tonhão sem o teto exigido na Avenida; (c) 2 cursos por dia na Avenida (`CURSO_DIA[3]` = 2, regra).
3. **A mudança para a área industrial cai no dia 22 (alvo 24 a 30; linha de base 27) e não se mexe com o preço dos cursos da Garagem** (×1,2, ×1,3 e ×1,4: sempre 22), porque o bot termina os 6 cursos da Garagem bem antes e o resto é caixa, nota e capítulo. Com a alavanca 1 no limite (×1,4) o máximo que se junta é cerca de R$ 460 (um dia). Opção: aceitar o dia 22 (−5 da linha de base), ou mudar a meta dos dias da Garagem ou o preço da mudança (regra).

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

## Desvios
- O smoke das duas regras de 22/11 é o `smoke120` (a v12.10.2 já usou o `smoke119`); a spec dizia `smoke119`. Para o `smoke120` testar `testeNivelMax`, ele entrou no `window.__lcc`. O `smoke117` (CA4) esperava o escalope sabido sem curso: corrigido para a regra nova.
(Os demais, no fechamento.)

**Modelo:** Sonnet, esforço alto (balanceamento por tentativa em quatro pontos)
