# Frases de comando (o que pedir em cada tipo de sessão)

| Pedido | Modelo | O que a sessão faz |
|---|---|---|
| **"vamos planejar o jogo"** (1ª sessão) | Opus, alto | Entrevista sobre tema, entidades, ciclo do tempo, decisões e telas; reescreve as etapas do `docs/PLANO.md` com as decisões tomadas e a linha **Modelo:** de cada uma |
| **"planeje a etapa N"** | Opus, médio ou alto | Fecha as decisões em aberto da etapa com você e deixa valores, fórmulas, textos, partes de `src/`, testes e alvo do lote escritos |
| **"faça a próxima etapa do docs/PLANO.md"** | o da linha **Modelo:** | Confere o modelo, lê só a etapa, implementa, testa, escreve a spec, arquiva a etapa, PR e merge |
| **"registre este retorno: …"** | Haiku, baixo | Põe o texto no topo do `docs/PROPOSTAS.md` (com `anota.py`) e diz um destino provável |
| **"o que os retornos abertos pedem?"** | Sonnet ou Opus | Lê o `PROPOSTAS.md` por faixa e propõe etapas ou ideias guardadas |
| **"rebalanceie X"** | Sonnet alto ou Opus | Usa o `lote.js` com `CFG='{...}'` até cair no alvo, depois muda o `CFG` em `src/` |
| **"enxugue os docs"** | Haiku, baixo | Mede (`wc -c CLAUDE.md docs/*.md`) e arquiva o que já foi entregue (`arquiva.py`, `sobras.py --mover`) |
| **"publica o artefato"** | Haiku, baixo | Publica o arquivo montado (ver **Publicar** no `CLAUDE.md`) |

## Prompt da primeira sessão (copie e cole)

> Leia o `CLAUDE.md` e o `docs/PLANO.md` (só as seções "Como usar" e a Etapa 1). Quero planejar o meu jogo: [descreva em 3 ou 4 frases o tema, o que o jogador gerencia e o que acha divertido]. Faça as perguntas que faltam, uma rodada de cada vez, e no fim reescreva as etapas do `PLANO.md` com as decisões tomadas, divididas em sessões, cada uma com a linha **Modelo:**. Não mexa em `src/` nesta sessão.

## Hábitos
- Uma etapa por sessão; sessão nova (ou `/clear`) depois de umas 15 trocas.
- Mande retornos de jogadores com o texto original; a sessão registra antes de discutir.
- Quando algo der errado duas vezes do mesmo jeito, peça para virar regra no `CLAUDE.md` (curta) ou no `docs/TESTES.md` (detalhe).
