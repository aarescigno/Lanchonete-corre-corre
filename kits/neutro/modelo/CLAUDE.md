# {{PROJETO}}

<!-- PREENCHER: o que é o projeto em 1 ou 2 frases (tipo, para quem, tecnologia principal). -->

Estado do projeto e histórico: `docs/RESUMO.md`. Roteiro, uma etapa por sessão: `docs/PLANO.md` (no pedido "a próxima etapa", leia só a etapa da vez). Pedidos e retornos de usuários (texto original e destino): `docs/PROPOSTAS.md`; todo retorno novo é registrado lá (ver **Anexar sem reler**). Frases de comando: `docs/PROMPTS.md`.

## Regras do projeto
<!-- PREENCHER: só as regras que valem sempre e que o Claude não adivinharia. Exemplos de formato:
- **Idioma:** interface em português do Brasil, com as palavras mais comuns do dia a dia.
- **Arquivos gerados:** `dist/` é gerado por `npm run build`; nunca edite à mão.
- **Separação:** a lógica (`src/nucleo/`) não importa nada da interface (`src/tela/`).
- **Dados sensíveis:** nada de chave ou senha no código; use variáveis de ambiente.
-->

## Mapa do código
<!-- PREENCHER: lista curta das pastas principais, uma linha cada. O detalhe (o que cada parte tem, versão a versão) vai em docs/PARTES.md. -->
- `ferramentas/mapa.sh [filtro]` mostra arquivo e linha de seções, classes e funções (pastas em `MAPA_DIRS`, padrão `src`).
- O que cada parte tem, versão a versão: `docs/PARTES.md` (só quando precisar).

## Economia de tokens
- **Código por faixa:** `ferramentas/mapa.sh [filtro]` acha o trecho; leia só a faixa que interessa (Read com `offset` e `limit`). Varreduras largas com o agente `Explore`.
- **Fora do Read:** o que está no `permissions.deny` do `.claude/settings.json` (arquivos gerados, pastas grandes, binários); deixe-os fora das buscas também. Pelo Bash, build, testes e `diff` continuam liberados.
- **Docs grandes por faixa:** nunca leia `docs/PLANO.md`, `docs/PROPOSTAS.md` ou `docs/RESUMO.md` inteiros: `ferramentas/indice.sh PLANO|PROPOSTAS|RESUMO [filtro]` mostra cada seção com as linhas; leia só a faixa. `docs/entregas/*.md` e `docs/HISTORICO.md`, só quando o assunto pedir.
- **Editar e anexar sem reler:** edições grandes por script Python com substituição exata (`assert s.count(a)==1`). Retorno novo vai no topo do `docs/PROPOSTAS.md` com `python3 ferramentas/anota.py docs/PROPOSTAS.md <<'EOF' ... EOF` (a entrada começa com `## data — quem: assunto`). No `RESUMO.md`, para a linha de versão, leia só a faixa da seção ou o `tail`.
- **Fechar etapa arquivando** (sem ler os arquivos): o texto da etapa pronta sai do `PLANO.md` para o `docs/PLANO-FEITO.md`, e os retornos entregues, do `PROPOSTAS.md` para o `docs/PROPOSTAS-FEITAS.md`, com `python3 ferramentas/arquiva.py`; na tabela Situação ficam só as 3 últimas prontas. Ideia guardada que vira etapa ou que a etapa entrega sai do `PLANO.md` com `python3 ferramentas/sobras.py --mover "começo do item"`; nada fica marcado com "Virou", "Vai na" ou "Feito na". O `ferramentas/testar.sh` roda o `sobras.py` e falha com sobra.
- **Este arquivo custa em todo turno:** mantenha-o entre 6 e 12 KB (`wc -c CLAUDE.md`); detalhe vai para `docs/TESTES.md` ou `docs/PARTES.md`. Quando os docs incharem, siga `docs/ENXUGAR.md`.
- **Hábitos:** uma etapa por sessão; sessão nova (ou `/clear`) depois de umas 15 trocas. Saída de comando longa sempre com `| tail` ou `| head`.
- **Nome da sessão:** toda vez que o usuário pedir "a próxima etapa", renomeie a sessão (`set_session_title`) para um resumo de 3 a 6 palavras do que foi feito.

## Modelo e esforço por sessão (economia de custo)
- **Planejar com o Opus, executar com o mais barato que der conta.** Planejar (escrever ou revisar etapa no `docs/PLANO.md`, regras, arquitetura, decisões de produto) é com o Opus, esforço médio ou alto, e divide o trabalho em sessões. Executar: Sonnet (o padrão para código com plano detalhado) ou Haiku (só o mecânico: textos, números, docs, retornos no `PROPOSTAS.md`, build e publicação).
- **O plano deixa as decisões tomadas,** não as opções: valores, nomes e textos, arquivos e funções que mudam, o que cada teste novo confere e o critério de pronto, para o modelo mais fraco só executar. O que ficar em aberto diz como decidir (ex.: "se o teste X passar de 2 s, troque Y por Z").
- **Cada etapa ou sessão termina com a linha** `Modelo: Sonnet, esforço médio` (ou o que couber) e o motivo em poucas palavras. Critério: Haiku, esforço baixo, para o mecânico e localizado; Sonnet, médio, para código com plano detalhado; Sonnet alto ou Opus quando ainda há decisão de design, ajuste por tentativa, depuração difícil ou muitas partes ao mesmo tempo.
- **Conferência de abertura** (antes de ler o código ou mudar arquivo; perguntas e conversa não precisam): ache a linha **Modelo:** da etapa a executar (só a faixa, pelo `ferramentas/indice.sh`) e confira o modelo e o esforço da sessão (em sessão na nuvem, `get_session` sem `session_id`: `session_context.model` e `effort_level`; no terminal, `/model`). Sessão de planejar espera **Opus, esforço médio ou alto**. **Se bate, não pergunte: diga numa linha que conferiu e toque o serviço.** Se não bate, ou o esforço não aparece, pergunte com o `AskUserQuestion` (sim ou não), citando o que roda e o que o plano indica; no "não", diga em uma linha como trocar (`/model` e o esforço) e pare.
- **Etapa ainda não planejada** (a linha **Modelo:** começa com "planejar com o Opus antes", ou faltam valores, textos, arquivos e testes): **não execute nem decida por conta própria**. Diga em uma linha que ela precisa ser planejada antes, com Opus em esforço médio ou alto, e só planeje com a confirmação do usuário.
- **Na hora de executar,** se a sessão pedir mais (ou menos) do que o plano indicou, avise em uma linha e sugira a troca, em vez de seguir gastando.

## Testes
- `ferramentas/testar.sh` roda, em ordem, os comandos de `ferramentas/testes.txt` e mostra só uma linha de cada (mais as linhas com `FAIL` ou `Error`); `--tudo` inclui os marcados com `tudo:` (os lentos). Sai com erro se algum falhar.
<!-- PREENCHER: os comandos de teste do projeto vão em ferramentas/testes.txt; aqui, só o que não é óbvio (ex.: "testes de interface precisam do servidor em :3000"). Detalhes em docs/TESTES.md. -->
- Cada entrega com código ganha um teste que confere o que ela mudou, descrito na `docs/entregas/` dela.

## Git
- **Sem branches parados:** todo trabalho termina com PR para o `{{BRANCH}}` (o branch padrão) e merge, para ele ser sempre a versão mais nova (o workflow roda o `ferramentas/testar.sh`).
- Depois do merge, avise que o branch pode ser apagado.

## Entregas e publicação
- **Publicar só quando o usuário mandar.** Ao terminar uma etapa, feche no GitHub (PR e merge) e avise que está pronta.
- **Cada entrega** (versão nova ou etapa pronta) ganha `docs/entregas/AAAA-MM-DD-assunto.md` (modelo em `docs/entregas/MODELO.md`) e uma linha na tabela de versões do `docs/RESUMO.md`.
<!-- PREENCHER (opcional): onde e como publicar (site, loja, artifact do claude.ai) e o jeito barato de conferir antes. -->
