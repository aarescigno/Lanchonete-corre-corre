# Desenvolvimento guiado por spec (SDD)

Desde 11/11/2026. Toda versão do jogo nasce de uma spec escrita **antes** do código: `docs/spec-vN.md`. A spec diz o que a versão entrega, com as decisões tomadas e os critérios de aceite; o código e os testes seguem a spec; no fechamento ela é corrigida para dizer o que o jogo faz de fato. Antes disso, o detalhe ficava no `docs/PLANO.md` e a spec era escrita no fim, como registro.

## Quem guarda o quê
| Arquivo | Papel |
|---|---|
| `docs/PROPOSTAS.md` | O que os jogadores pediram (texto original e destino). |
| `docs/PLANO.md` | O roteiro: a ordem das etapas, o objetivo de cada uma em poucas linhas, a versão e o link para a spec. O que vale para várias etapas (decisões do ponto, checagens de fim de sessão) também fica lá. |
| `docs/spec-vN.md` | A fonte da verdade de uma versão: regras, critérios de aceite, partes, tarefas, testes e a linha **Modelo:**. |
| `tests/smokeNN.js` | A prova dos critérios de aceite. |
| `docs/RESUMO.md` | O estado do jogo hoje (uma linha por versão). |

## As três situações da spec
| Situação | O que quer dizer | Quem mexe |
|---|---|---|
| `rascunho` | Ainda há decisão em aberto. | Sessão de planejar (Opus, esforço médio ou alto), com o usuário. |
| `aprovada` | Tudo decidido; pronta para executar. | Sessão de executar (o modelo da linha **Modelo:**). |
| `entregue` | Versão fechada, testes verdes, desvios anotados. | Ninguém mais: mudança nova é versão nova, com spec nova. |

## O ciclo
1. **Especificar** (planejar). `python3 ferramentas/spec.py nova v10.4 "Título" 4a-5` cria o rascunho a partir do `docs/modelo-spec.md`. A sessão escreve o Objetivo, as Regras e os Critérios de aceite, lista as Decisões em aberto (cada uma com sugestão) e fecha todas com o usuário (`AskUserQuestion`). Com a seção em "Nenhuma.", a situação vira `aprovada (dd/mm)` e a linha **Modelo:** passa a dizer o modelo da execução. No `PLANO.md`, a etapa fica só com o objetivo e o link. Esta sessão não programa.
2. **Executar.** Para "a próxima etapa", a sessão acha a etapa na tabela Situação do `PLANO.md`, lê a spec dela (inteira: é curta) e só as partes de `src/` listadas em Partes. Ordem: primeiro o smoke novo, com uma checagem por critério de aceite, falhando; depois as Tarefas, marcando `[x]`; por fim o bot, o balanceamento e as capturas que a spec pede.
3. **Fechar.** `tests/run_all.sh` verde. Na spec: os números medidos (checagens do smoke, calibração) em Testes, a seção Desvios preenchida, as Regras corrigidas onde o jogo saiu diferente, situação `entregue em dd/mm`. Depois, o de sempre: `VERSAO`, `vtag`, `#ov-ver`, `RESUMO.md`, a linha da tabela Situação, PR e merge.

## Regras do método
- **Sem spec aprovada, não se programa.** Etapa sem spec, ou com spec em rascunho, precisa ser planejada antes (vale a regra da **Etapa ainda não planejada** do `CLAUDE.md`).
- **A execução não decide.** Se faltar um valor, um texto ou um comportamento, a sessão para, pergunta ao usuário e escreve a resposta nas Regras antes de seguir. Ajuste previsto na spec ("se o balance passar de 95%, baixe X para Y") não é decisão: é só seguir.
- **Critério de aceite é fato conferível com prova.** Cada `- **CA1** ...` termina com a prova: o smoke (e o número da checagem), o alvo do `balance.js` ou do `carreira.js`, ou a captura a olhar. "Fica mais gostoso de jogar" não é critério; "a Cami só pega o que espera há 3 s ou mais" é.
- **A spec acompanha o código.** Mudou a regra durante a execução (com o aval do usuário)? Muda nas Regras e anota em Desvios, no mesmo commit. Uma spec entregue descreve o jogo, e não o plano.
- **Pequena também tem spec.** Correção ou retorno pequeno (v10.2.1, v10.2.2...) usa o mesmo modelo, enxuto: Objetivo, Regras, Critérios de aceite, Testes. Pode nascer já aprovada, se não há o que decidir. Mudança que não mexe no jogo (docs, ferramentas, testes) não tem versão nem spec.
- **Etapas planejadas antes de 11/11** (o texto inteiro ainda no `PLANO.md`): a sessão de execução começa levando o texto para a spec no formato novo, sem decidir nada (Regras copiadas; Critérios de aceite tirados do parágrafo **Testes**), e o `PLANO.md` fica com o resumo. A 4a-4 (`docs/spec-v10.3.md`) já foi levada e serve de exemplo.
- **Specs antigas** (sem a linha **Situação:**) são registro do que foi feito e ficam como estão.

## A conferência
`python3 ferramentas/spec.py` (o `tests/run_all.sh` chama e falha junto) cobra, das specs no formato novo:
- as seções obrigatórias e uma situação válida;
- `aprovada` e `entregue`: Decisões em aberto em "Nenhuma.", ao menos um critério de aceite, todos com prova, e a linha **Modelo:** com o modelo da execução;
- `entregue`: nenhuma tarefa `- [ ]`, todo smoke citado nos critérios existe e está no `run_all.sh`, e Desvios preenchido;
- a spec da versão atual (`VERSAO`) tem de estar `entregue`, e nenhuma de versão mais nova pode estar.

`python3 ferramentas/spec.py lista` mostra a situação e as tarefas feitas de cada uma. Para ler uma seção de uma spec grande: `tests/indice.sh spec-v10.3`.
