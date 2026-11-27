# v12.10.6 — O cartão da Dani conta só as tarefas que dá para escolher (etapa correção)

**Situação:** entregue em 27/11
**Origem:** conversa de 27/11: "dani depois que vai pros doces aparece no card dela que ela faz 3 funções, mas somente 2 são pactuáveis. deixar Tarefas (X de 2) pra ela nessa condição".

## Objetivo
Quando as tarefas da casa passam para o Joca (ou a Cami) e a Dani fica nos doces, o cartão dela na lojinha diz "Tarefas (X de 2)", e não "de 3": o número é o das tarefas que dá para marcar.

## Regras (decisões tomadas)
- **Cartão da Dani** (`buildDani`, `src/41-lojinha.js`): as vagas mostradas são `Math.min(sp.tasks, livres)`, em que `livres` é o número de tarefas do cartão que dá para marcar (as de `avail` que não são `BASICAS` com outro dono, ou seja, as que não ficam desligadas por "com o Joca"/"com a Cami"). O texto fica `'Tarefas (' + Math.min(sel, vagas) + ' de ' + vagas + '):'`. Com a Dani dona do básico, nada muda (`livres` ≥ `sp.tasks`). Com o Joca no básico e o cafezinho e o doce liberados, fica "de 2"; se o espresso tirar o cafezinho, "de 1".
- Os botões, o `toggleDaniTask` e o que ela faz na partida não mudam.
- **Modo dev / Manual / Save:** nada.
- **Versão:** `VERSAO` e `vtag` (texto e `aria-label`) em v12.10.6; linha nova no topo do `#ov-ver`, com o "versão atual" saindo da v12.10.5: **"O cartão da Dani nos doces mostra só as tarefas que dá para escolher."**, data 27/11/2026.

## Critérios de aceite
- **CA1** Dani no nível 4 (3 vagas) com o Joca contratado, o curso de Confeitaria caseira e sem espresso: o cartão diz "Tarefas (… de 2)" → `smoke123` (1)
- **CA2** A mesma Dani sem o Joca (dona do básico): o cartão diz "de 3" → `smoke123` (1)
- **CA3** A `VERSAO` é `v12.10.6` → `smoke123` (1)

## Testes
- Novo: `smoke123` (3 checagens).
- Mudam: `smoke86` e `menu_fit.py` (a lista do `#ov-ver` passa a 39 linhas).
- Sem balanceamento (nada muda na partida).

## Decisões em aberto
Nenhuma.

## Desvios
- `tests/run_all.sh` ganhou o `smoke123.js` na lista.
- `smoke122` CA7: a checagem da `VERSAO` passou a aceitar a v12.10.5 ou mais nova (antes, só a v12.10.5).
- `smoke76`: a checagem do `versoes/v10.html` falha neste ambiente porque o clone é raso e não tem o commit da v10.10; nada a ver com esta versão.
- Medido: no CA1 o cartão diz "Tarefas (0 de 2)" (a Dani com 3 vagas e só o cafezinho e o doce livres); no CA2, "Tarefas (2 de 3)".

**Modelo:** Haiku, esforço baixo (um texto no cartão e a versão)
