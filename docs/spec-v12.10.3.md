# v12.10.3 — O equilíbrio dos cursos em degraus (etapa 18d)

**Situação:** aprovada
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
- **Versão:** `VERSAO` e `vtag` em v12.10.3; linha no `#ov-ver`: **"Preços dos cursos e metas acertados para os cursos em degraus."**

## Critérios de aceite
- **CA1** Garagem dentro dos alvos, sem equipe e com equipe → `node balance.js 40`
- **CA2** Área industrial e Avenida dentro do alvo → `balance` (`PONTO=industrial|avenida`, `EQUIPE=auto`)
- **CA3** Terraço dentro do alvo → `balance` (o comando da equipe toda)
- **CA4** `CURSOS=todos` ganha 15% ou mais sobre `CURSOS=0` nos quatro pontos → `balance`
- **CA5** Ritmo da carreira e evolução do Tonhão dentro dos alvos → `DIAS=80 node carreira.js 6` (`carreira`)
- **CA6** Os smokes que medem preço de curso, nível ou meta batem com os números finais → `smoke117` e os corrigidos (lista em Testes)

## Partes
- `src/10-constantes.js`: `CURSOS` (preços), `STAFF.tonhao`, `PONTOS` (`metaF`, `expertF`), as metas da Garagem, `ESTRANHO`, `EMPRATA`.
- `tests/carreira.js`: a linha nova com o dia em que o bot chega a cada nível do Tonhão (se ainda não houver) e o nível na saída de cada ponto.

## Tarefas
- [ ] T1 Linha de base na v12.9.1 (worktree): os comandos dos alvos; anote em Testes.
- [ ] T2 `carreira.js`: o nível do Tonhão na saída de cada ponto e no fim da história.
- [ ] T3 Medida na v12.10.2 com os mesmos comandos; anote.
- [ ] T4 Ajuste pelas alavancas, na ordem, até os alvos; anote cada rodada (valor mudado e resultado) em Testes.
- [ ] T5 Smokes com números atualizados (só os números).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (alvos e números novos), esta spec como entregue (números finais nas Regras), `tests/run_all.sh --tudo` verde, PR e merge.

## Testes
- Sem smoke novo: os alvos são do `balance.js` e do `carreira.js`. No fechamento: a linha de base, cada rodada de ajuste e os números finais.

## Decisões em aberto
Nenhuma (as das specs v12.10 a v12.10.2 foram fechadas em 22/11; os preços de partida são os da v12.10, já 30% abaixo da proposta).

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (balanceamento por tentativa em quatro pontos)
