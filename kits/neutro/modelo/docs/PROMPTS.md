# Frases de comando (o que pedir em cada tipo de sessão)

| Pedido | Modelo | O que a sessão faz |
|---|---|---|
| **"vamos planejar o projeto"** (1ª sessão) | Opus, alto | Faz a etapa 1 do `PLANO.md`: entrevista, preenche o `CLAUDE.md` (regras, mapa do código), o `testes.txt` e o `permissions.deny`, e divide o resto em etapas com a linha **Modelo:** |
| **"planeje a etapa N"** | Opus, médio ou alto | Fecha as decisões em aberto da etapa com você e deixa valores, textos, arquivos, testes e critério de pronto escritos |
| **"faça a próxima etapa do docs/PLANO.md"** | o da linha **Modelo:** | Confere o modelo, lê só a etapa, implementa, testa, escreve a entrega, arquiva a etapa, PR e merge |
| **"registre este retorno: …"** | Haiku, baixo | Põe o texto no topo do `docs/PROPOSTAS.md` (com `anota.py`) e sugere um destino |
| **"o que os retornos abertos pedem?"** | Sonnet ou Opus | Lê o `PROPOSTAS.md` por faixa e propõe etapas ou ideias guardadas |
| **"enxugue os docs"** | Opus para medir e planejar; Haiku para executar | Segue o `docs/ENXUGAR.md` |
| **"publica"** | Haiku, baixo | Publica como estiver descrito em **Entregas e publicação** no `CLAUDE.md` |

## Prompt da primeira sessão (copie e cole)

> Leia o `CLAUDE.md` e, do `docs/PLANO.md`, só "Como usar" e a Etapa 1. Quero começar este projeto: [descreva em 3 ou 4 frases o que é, para quem e o que já existe]. Faça as perguntas que faltam, uma rodada de cada vez. No fim: preencha as partes marcadas com PREENCHER no `CLAUDE.md`, ajuste o `ferramentas/testes.txt` e o `permissions.deny` do `.claude/settings.json`, e reescreva o `PLANO.md` com as etapas divididas em sessões, cada uma com a linha **Modelo:**. Não escreva código nesta sessão.

## Projeto que já existe (adotar o kit no meio do caminho)

> Leia o `CLAUDE.md` do kit e o README do projeto. Faça um levantamento barato (estrutura de pastas, tamanho dos maiores arquivos e docs, comandos de teste) e preencha as partes PREENCHER. Mova o que estiver solto em outros docs (tarefas, ideias, retornos) para `PLANO.md` e `PROPOSTAS.md` sem reescrever o texto. Diga o que não coube.

## Hábitos
- Uma etapa por sessão; sessão nova (ou `/clear`) depois de umas 15 trocas.
- Mande os retornos de usuários com o texto original; a sessão registra antes de discutir.
- Quando algo der errado duas vezes do mesmo jeito, peça para virar regra curta no `CLAUDE.md` ou detalhe no `docs/TESTES.md`.
