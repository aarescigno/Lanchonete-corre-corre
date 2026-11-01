# Plano (uma etapa por sessão)

Origem: conversa de planejamento em {{DATA}}. Os pedidos e retornos de usuários, com o destino de cada um, estão em `docs/PROPOSTAS.md`.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `ferramentas/indice.sh PLANO` mostra cada etapa com as linhas; leia só a etapa da vez com `offset` e `limit`. As etapas prontas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina igual: testes verdes (`ferramentas/testar.sh`), entrega em `docs/entregas/`, `RESUMO.md` atualizado, PR com merge no branch padrão.
- Para começar, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e os arquivos citados nela.
- **Modelo e esforço (ver `CLAUDE.md`):** cada etapa termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as decisões em aberto com o usuário, escreve aqui o que foi decidido, apaga as opções descartadas e troca a linha **Modelo:** pela de execução.
- **Uma etapa planejada tem:** objetivo em uma frase; as decisões com os valores (números, nomes, textos palavra por palavra); os arquivos e funções que mudam; mudanças de formato de dados (e a migração); os testes novos e o que conferem; o critério de pronto; a linha **Modelo:**.
- No fim, a sessão marca a etapa como pronta na tabela abaixo (com a data), move o texto dela para o `docs/PLANO-FEITO.md` com `python3 ferramentas/arquiva.py docs/PLANO.md docs/PLANO-FEITO.md "## Etapa N"` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas prontas.

## Situação
| # | Etapa | Entrega | Situação |
|---|---|---|---|
| 1 | Fundação: objetivo, escopo e arquitetura | — | a planejar |

## Etapa 1 — Fundação: objetivo, escopo e arquitetura
Decidir com o usuário, nesta ordem, e escrever aqui as respostas:
- **Para quem e para quê:** quem usa, qual problema resolve, o que é "pronto" na primeira versão.
- **Escopo da 1ª versão:** o que entra e, tão importante quanto, o que fica de fora (vai para Ideias guardadas).
- **Tecnologia e estrutura:** linguagem, bibliotecas, pastas (e o **Mapa do código** do `CLAUDE.md`), o que é gerado e não se edita à mão (e entra no `permissions.deny`).
- **Testes:** como se testa e os comandos que entram em `ferramentas/testes.txt`.
- **Regras do projeto:** as que valem sempre (idioma, estilo, segurança, acessibilidade) e vão para o `CLAUDE.md`.
- **Etapas seguintes:** o trabalho dividido em sessões, cada uma com a linha **Modelo:**.

Modelo: planejar com o Opus antes (esforço alto: define o projeto inteiro).

## Ideias guardadas (sem etapa ainda)
