# Modelo de spec (ver `docs/SDD.md`)

Não edite uma cópia à mão: `python3 ferramentas/spec.py nova v10.4 "Título" 4a-5` cria `docs/spec-v10.4.md` com o que vem abaixo. Seções obrigatórias: Objetivo, Regras, Critérios de aceite, Testes, Decisões em aberto e Desvios. Numa correção pequena, apague Fora do escopo, Partes, Tarefas e Avisos para a execução se não ajudarem.

<!-- modelo: daqui para baixo -->
# vN.N — TÍTULO (etapa ETAPA)

**Situação:** rascunho
**Origem:** (o retorno no `docs/PROPOSTAS.md`, a etapa no `docs/PLANO.md` ou a conversa, com a data)

## Objetivo
(Duas ou três linhas: o que o jogador passa a sentir ou poder fazer. Sem falar de código.)

## Fora do escopo
- (O que parece fazer parte e não entra nesta versão, e para onde vai.)

## Regras (decisões tomadas)
- (Cada regra com os valores, os nomes no código e os textos da interface já escritos. Nada de "a definir": o que falta decidir vai em Decisões em aberto.)
- **Modo dev:** (como ligar, forçar ou assistir cada coisa nova no painel.)
- **Manual:** (fichas novas ou mudadas, sem números.)
- **Save:** (campos novos e o que acontece com o save da versão anterior.)

## Critérios de aceite
(Cada um é um fato que dá para conferir, com a prova depois da seta. É a lista que o smoke da versão segue, na mesma ordem.)
- **CA1** (fato conferível) → `smokeNN` (1)
- **CA2** (alvo do bot) → `node balance.js 40`: entre X% e Y%; se passar de Y%, baixe A para B
- **CA3** (o que se vê) → captura `shot_vN_N.js`: (o recorte a olhar)

## Partes
(As partes de `src/` e as funções que mudam, para a execução ler só essas faixas.)

## Tarefas
(Na ordem de fazer; a execução marca `[x]` ao terminar cada uma.)
- [ ] T1 Smoke novo com os critérios de aceite (falhando).
- [ ] T2 ...
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
(Opcional, no máximo 5 linhas: o que a sessão de planejar descobriu e não é regra de jogo. O que reaproveitar, o que não tocar e por quê, por onde começar, armadilha conhecida. Não repita as Regras nem as Tarefas. Sem nada a avisar, apague a seção.)
- ...

## Testes
(Smokes antigos que mudam de número, chaves novas do `bot.js`, `balance.js` e `carreira.js`, capturas a tirar. No fechamento: quantas checagens o smoke tem e a calibração medida.)

## Decisões em aberto
(Cada uma com a sugestão. A spec só passa a aprovada com esta seção em "Nenhuma.")
- ...

## Desvios
(No fechamento: o que saiu diferente do que estava escrito e por quê. As Regras acima são corrigidas junto, para a spec dizer o que o jogo faz. Sem desvio, "Nenhum.")

**Modelo:** planejar com o Opus antes
