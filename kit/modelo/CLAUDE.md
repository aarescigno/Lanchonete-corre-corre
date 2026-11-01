# {{JOGO}}

Jogo de navegador de gestão (simulador no estilo "manager": decisões por turno, simulação, tabelas e relatórios), em um único arquivo HTML, em português do Brasil. Versão atual: a constante `VERSAO` em `src/10-dados.js`. Estado do projeto, histórico e publicação: `docs/RESUMO.md`. Roteiro, uma etapa por sessão: `docs/PLANO.md` (no pedido "a próxima etapa", leia só a etapa da vez). Retornos de jogadores (texto original e destino): `docs/PROPOSTAS.md`; todo retorno novo é registrado lá (ver **Anexar sem reler**). Frases de comando: `docs/PROMPTS.md`.

## Regras do projeto
- **Jogo original:** nomes, personagens, clubes/empresas e arte são próprios. Não usar nomes, marcas, logos nem telas copiadas de jogos existentes, nem citá-los na interface.
- **Código em partes, publicado em arquivo único:** edite só em `src/`; `python3 montar.py` junta as partes em `{{ARQ}}`, que tem HTML, CSS e JS inline e é o que se publica. Nunca edite `{{ARQ}}` à mão: ele é gerado, mas fica no git. Antes de publicar ou fazer commit, monte (`tests/run_all.sh` já monta).
- **Sem invólucro:** o arquivo montado não tem `<!doctype>`, `<html>`, `<head>` nem `<body>` (o publicador envolve) e começa com `<title>`.
- **Nome fixo:** o nome do arquivo não muda. Versões antigas vão para `versoes/vN.html`.
- **Simulação separada da tela:** a classe `Jogo` (`src/13-simulacao.js`) não toca em `document` nem em `window`; a interface (`3x`) só lê o estado e chama métodos do `Jogo`. Tudo que a simulação sabe está em `jogo.estado` (objeto JSON puro, que é o save).
- **Sorte com semente:** a lógica nunca usa `Math.random`; usa `jogo.sorte` (`src/11-sorte.js`), cujo estado vai no save. Mesma semente e mesmas decisões dão o mesmo resultado (os testes e o `lote.js` dependem disso).
- **Números de balanceamento em `CFG`** (`src/10-dados.js`), nunca soltos no código; tabelas de conteúdo (nomes, atributos, eventos) também ficam em `10-dados.js`.
- **Saves versionados:** `SAVE_V` sobe quando o formato do estado muda, com uma função em `MIGRA` que leva o save antigo ao novo; save quebrado nunca trava o jogo (volta ao menu com aviso).
- **Palavras do dia a dia:** na interface, os termos mais comuns no Brasil; números com `fmt()` (R$ 1.234, 12,5%).
- **Tela de celular:** toda tela cabe em 360 px de largura sem rolagem lateral; tabelas largas rolam dentro do próprio quadro. Respeitar `prefers-reduced-motion`.
- **Testes:** `window.__jogo` (a instância) e `window.__api` (dados e funções) ficam expostos.

## Partes do código (`src/`, juntadas em ordem pelo nome)
O JS fica todo dentro de um `(function(){ ... })()` que abre em `02-telas.html` e fecha em `49-laco.js`; as partes `.js` não rodam sozinhas.
- `0x` topo, CSS e telas: `00-topo.html`, `01-estilo.css`, `02-telas.html` (as telas `#tela-*` e os painéis)
- `1x` lógica (sem DOM): `10-dados.js` (`VERSAO`, `CFG`, tabelas), `11-sorte.js`, `12-estado.js` (estado novo, save, migração), `13-simulacao.js` (classe `Jogo`)
- `3x` interface: `30-interface.js` (formatação, troca de telas, cada tela)
- `4x` laço: `49-laco.js` (início, eventos, fecha o JS)
- O que cada parte tem, versão a versão: `docs/PARTES.md` (só quando precisar).

## Economia de tokens
- **Código por faixa:** `tests/mapa.sh [filtro]` mostra parte e linha de seções, classes e funções; leia só a faixa que interessa em `src/`. Buscas (grep, Glob) só em `src/`, `tests/` e `docs/`. Varreduras largas com o agente `Explore`.
- **Fora do Read** (bloqueados no `.claude/settings.json`; pelo Bash, montar, testes e `diff` continuam liberados): `{{ARQ}}` (cópia montada), `versoes/**` e `capturas/**`; deixe-os fora das buscas também.
- **Docs grandes por faixa:** nunca leia `docs/PLANO.md`, `docs/PROPOSTAS.md` ou `docs/RESUMO.md` inteiros: `tests/indice.sh PLANO|PROPOSTAS|RESUMO [filtro]` mostra cada seção com as linhas; leia só a faixa (`offset` e `limit`). `docs/spec-vN.md` e `docs/HISTORICO.md`, só quando o assunto pedir.
- **Editar e anexar sem reler:** edições grandes por script Python com substituição exata (`assert s.count(a)==1`). Retorno novo vai no topo do `docs/PROPOSTAS.md` com `python3 ferramentas/anota.py docs/PROPOSTAS.md <<'EOF' ... EOF` (a entrada começa com `## data — quem: assunto`). No `RESUMO.md`, para a linha de versão, leia só a faixa da seção ou o `tail`.
- **Fechar etapa arquivando** (sem ler os arquivos): o texto da etapa feita sai do `PLANO.md` para o `docs/PLANO-FEITO.md`, e os retornos entregues, do `PROPOSTAS.md` para o `docs/PROPOSTAS-FEITAS.md`, com `python3 ferramentas/arquiva.py`; na tabela Situação ficam só as 3 últimas feitas. Ideia guardada que vira etapa ou que a etapa entrega sai do `PLANO.md` com `python3 ferramentas/sobras.py --mover "começo do item"`; nada fica marcado com "Virou", "Vai na" ou "Feito na". O `run_all.sh` roda o `sobras.py` e falha com sobra.
- **Capturas:** confira recortes ampliados (PIL `crop`) só do trecho alterado, em vez de várias telas inteiras.
- **Hábitos:** uma etapa por sessão; sessão nova (ou `/clear`) depois de umas 15 trocas. O `CLAUDE.md` é lido em todo turno: mantenha-o entre 6 e 12 KB (`wc -c CLAUDE.md`); detalhe vai para `docs/TESTES.md` ou `docs/PARTES.md`.
- **Nome da sessão:** toda vez que o usuário pedir "a próxima etapa", renomeie a sessão (`set_session_title`) para um resumo de 3 a 6 palavras do que foi feito.

## Modelo e esforço por sessão (economia de custo)
- **Planejar com o Opus, executar com o mais barato que der conta.** Planejar (escrever ou revisar etapa no `docs/PLANO.md`, regras de jogo, fórmulas da simulação, balanceamento novo, arquitetura) é com o Opus, esforço médio ou alto, e divide o trabalho em sessões. Executar: Sonnet (o padrão para código de jogo, interface e testes) ou Haiku (só o mecânico: textos, números, tabelas de dados, docs, retornos no `PROPOSTAS.md`, montar e publicar).
- **O plano deixa as decisões tomadas,** não as opções: valores (`CFG`), fórmulas, nomes e textos da interface, partes de `src/` e funções que mudam, o que cada smoke novo confere e o alvo do `lote.js`, para o modelo mais fraco só executar. O que ficar em aberto diz como decidir (ex.: "se o lote passar de 60% de vitórias, baixe X para Y").
- **Cada etapa ou sessão termina com a linha** `Modelo: Sonnet, esforço médio` (ou o que couber) e o motivo em poucas palavras. Critério: Haiku, esforço baixo, para o mecânico e localizado; Sonnet, médio, para código com plano detalhado; Sonnet alto ou Opus quando ainda há decisão de design, balanceamento por tentativa, depuração difícil ou muitas partes ao mesmo tempo.
- **Conferência de abertura** (antes de ler `src/` ou mudar arquivo; perguntas e conversa não precisam): ache a linha **Modelo:** da etapa a executar (só a faixa, pelo `tests/indice.sh`) e chame o `get_session` sem `session_id` (`session_context.model` e `effort_level`). Sessão de planejar espera **Opus, esforço médio ou alto**. **Se bate, não pergunte: diga numa linha que conferiu e toque o serviço.** Se não bate, ou o esforço não aparece, pergunte com o `AskUserQuestion` (sim ou não), citando o que roda e o que o plano indica; no "não", diga em uma linha como trocar (`/model` e o esforço) e pare.
- **Etapa ainda não planejada** (a linha **Modelo:** começa com "planejar com o Opus antes", ou faltam valores, textos, partes de `src/` e testes): **não execute nem decida por conta própria**. Diga em uma linha que ela precisa ser planejada antes, com Opus em esforço médio ou alto, e só planeje com a confirmação do usuário.
- **Na hora de executar,** se a sessão pedir mais (ou menos) do que o plano indicou, avise em uma linha e sugira a troca, em vez de seguir gastando.

## Testes (`cd tests`)
- `./run_all.sh` monta `{{ARQ}}`, extrai `jogo.js`, confere a sintaxe e as sobras do `PLANO.md` e roda todos os `smoke*.js` (só o resumo); `--tudo` acrescenta o `lote.js`. Não rode `node smokeN.js` sem `| tail`.
- `node lote.js [N]` simula N temporadas com sementes 1..N e compara com os alvos (`ALVOS` no próprio arquivo; histórico em `docs/TESTES.md`). `node captura.js [pasta]` tira as telas em computador e celular para `capturas/<pasta>` (Chromium já instalado).
- O `harness.js` carrega o jogo no Node com um DOM falso: `load({store, semente})` devolve `{jogo, api, els, store}`; `els['id'].fire('click')` aperta botões.
- Cada versão nova ganha um smoke (`smokeN.js`), descrito no `docs/spec-vN.md` dela.

## Git
- **Sem branches parados:** todo trabalho termina com PR para o `{{BRANCH}}` (o branch padrão) e merge, para ele ser sempre a versão mais nova (o workflow confere `python3 montar.py --check` e publica no GitHub Pages).
- Depois do merge, avise que o branch pode ser apagado.

## Publicar
- **Só quando o usuário mandar** (ex.: "publica o artefato"). Ao terminar uma versão, feche no GitHub (PR e merge) e avise que está pronta.
- **Artifact do claude.ai** (se usar): URL em `docs/RESUMO.md`. Publique ali o `{{ARQ}}` montado e registre o número da versão no `RESUMO.md`. Não leia a página antes: a 1ª publicação da sessão é recusada e salva a versão no ar num arquivo; compare esse arquivo no terminal (`diff`) com o `versoes/vN.html` da última versão publicada e, se só mudar o invólucro, peça confirmação e publique com `force:true`.
- **Nova versão:** guarde a atual em `versoes/`, atualize `VERSAO`, escreva `docs/spec-vN.md` (modelo em `docs/spec-modelo.md`) e atualize `docs/RESUMO.md`.
