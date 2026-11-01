# Kit neutro: fluxo de trabalho com o Claude Code

Serve para qualquer projeto (site, app, script, jogo, documentação), em qualquer linguagem. Traz o fluxo de trabalho, não código:
- o Opus planeja e o Sonnet ou o Haiku executam, uma etapa por sessão;
- os docs são lidos por faixa, e não inteiros;
- os pedidos e retornos de usuários ficam num registro;
- o que fica pronto é arquivado;
- os testes mostram uma linha cada.

Precisa só de Python 3 e Bash.

## Instalar

Descompacte o `kit-neutro.zip` (ou use `kits/neutro/`) e rode de dentro da pasta do kit:

```bash
python3 instalar.py ../meu-projeto --nome "Meu Projeto" [--branch main]
```

- **Projeto novo:** copia tudo, troca os marcadores (`{{PROJETO}}`, `{{BRANCH}}`, `{{DATA}}`) e roda o `ferramentas/testar.sh`.
- **Projeto que já existe:** não sobrescreve nada. Se já houver um `CLAUDE.md`, o do kit vai como `CLAUDE.kit.md`, para juntar os dois numa sessão (há um prompt para isso em `docs/PROMPTS.md`).

Depois: commit e a 1ª sessão com o Opus, usando o prompt de `docs/PROMPTS.md`. Essa sessão preenche os trechos marcados com `PREENCHER` no `CLAUDE.md`, a lista de testes e os bloqueios de leitura.

## O que vem

| Onde | O quê |
|---|---|
| `CLAUDE.md` | Regras do fluxo, prontas: economia de tokens, modelo e esforço por sessão (com a conferência de abertura), testes, Git e entregas. Os trechos do projeto (regras e mapa do código) vêm marcados com `PREENCHER` |
| `.claude/settings.json` | Bloqueia o Read de pastas geradas e pesadas (`node_modules`, `dist`, `build`, lockfiles, `*.min.js`); acrescente as do projeto |
| `ferramentas/testar.sh` + `testes.txt` | Roda os comandos de teste listados e mostra uma linha de cada; os marcados com `tudo:` (os lentos) só rodam com `--tudo` |
| `ferramentas/mapa.sh` | Índice do código com o número das linhas (JS/TS, Python, Go, Rust, Java/C#, Ruby, PHP, CSS) |
| `ferramentas/indice.sh` | Índice dos docs grandes, para ler só uma seção |
| `ferramentas/anota.py` | Põe um retorno novo no topo do `PROPOSTAS.md` sem ler o arquivo |
| `ferramentas/arquiva.py` | Move seções inteiras entre docs pelo título |
| `ferramentas/sobras.py` | Acha e move o que já foi entregue e ficou no `PLANO.md` |
| `docs/PLANO.md` | Roteiro com "Como usar", tabela de situação, a Etapa 1 (fundação) e Ideias guardadas |
| `docs/PROPOSTAS.md` | Registro de pedidos e retornos (texto original e destino) |
| `docs/RESUMO.md`, `TESTES.md`, `PARTES.md` | Estado atual e os detalhes que não cabem no `CLAUDE.md` |
| `docs/*-FEITO(S).md`, `HISTORICO.md` | Arquivo morto, só para consulta |
| `docs/entregas/MODELO.md` | Modelo de nota de entrega (o que mudou, decisões, testes, linha **Modelo:**) |
| `docs/PROMPTS.md` | Frases de comando, com o modelo certo para cada uma, e os prompts da 1ª sessão |
| `docs/ENXUGAR.md` | Roteiro de uma rodada de enxugamento, para quando os docs incharem |
| `.github/workflows/conferir.yml` | Roda o `testar.sh` em cada PR |

## Por que é assim
- **O `CLAUDE.md` é lido em todo turno;** o resto só custa quando alguém lê. Por isso ele traz só regras, e os detalhes vão para os docs.
- **Ninguém lê doc grande inteiro:** os índices (`indice.sh`, `mapa.sh`) apontam a faixa de linhas.
- **Um plano bem decidido deixa a execução barata:** o Opus fecha as decisões e um modelo mais barato só executa.
- **Arquivar a cada etapa** evita rodadas grandes de enxugamento depois.
