# Plano de enxugamento de tokens

Objetivo: baixar o custo de cada sessão nova sem perder informação. Só mexe em docs e configuração, nunca em `src/`. Cada passo é independente e termina com commit, PR para o `claude/main` e merge (regra de **Git** do `CLAUDE.md`).

## Diagnóstico (medido em 29/10/2026)

| Item | Tamanho | Quando custa |
|---|---|---|
| `CLAUDE.md` | 22 KB (~6 mil tokens) | Todo turno de toda sessão |
| `docs/PLANO.md` | 104 KB (~28 mil tokens), 803 linhas | Só se lido inteiro |
| `docs/PROPOSTAS.md` | 81 KB (~22 mil tokens), 866 linhas | Só se lido inteiro |
| `docs/RESUMO.md` | 46 KB (~12 mil tokens), 243 linhas | Só se lido inteiro |
| `src/` | 540 KB; maiores: `16-jogo.js` 67 KB, `10-constantes.js` 60 KB, `21-cenario.js` 58 KB, `41-lojinha.js` 57 KB | Só as partes tocadas |
| `lanchonete.html` | ~200 KB (~100 mil tokens) | Nunca ler |
| `versoes/` (35 MB) e `capturas/` (71 MB) | enorme | Nunca ler nem buscar |

Só o `CLAUDE.md` é obrigatório em toda sessão; o resto custa quando alguém lê. Por isso o `CLAUDE.md` é o alvo nº 1.

## Meta

| Medida | Hoje | Meta |
|---|---|---|
| `CLAUDE.md` | 22 KB | 6 a 8 KB |
| `PLANO.md` ativo | 104 KB | ~30 KB |
| `PROPOSTAS.md` ativo | 81 KB | ~20 KB (só retornos abertos) |
| Leitura da "próxima etapa" | até 28 mil tokens | ~1 a 2 mil tokens |
| Leitura acidental do `lanchonete.html` | possível | bloqueada |

## Passos

### 1. Enxugar o `CLAUDE.md` (maior ganho)
- Criar `docs/TESTES.md` e mover para ele, sem mudar o texto:
  - o parágrafo de `balance.js`, `carreira.js` e `emprestimo.js` (variáveis de ambiente, alvos e histórico de balanceamento v7.3 a v8.6.9);
  - a lista de `shot_*.py` com o que cada um captura;
  - os detalhes do harness (`load({...})`, coordenadas `g.cam`, posições do HUD).
- No `CLAUDE.md` ficam só: como rodar (`tests/run_all.sh`, `--tudo`), o que cada comando principal faz em uma linha, e "balanceamento e capturas: ver `docs/TESTES.md` (só quando o assunto pedir)".
- Trocar o mapa de `src/` (cada parte com histórico de versões) por: lista curta dos arquivos por prefixo (`0x` topo e telas, `1x` lógica, `2x` desenho, `3x`/`4x` interface) e "use `tests/mapa.sh [filtro]` para achar seções e funções". O histórico por versão já está em `docs/RESUMO.md` e `docs/spec-vN.md`.
- Manter integralmente: **Regras do projeto**, **Economia de tokens**, **Modelo e esforço**, **Git**, **Publicar** (cortar só o que for exemplo ou histórico).
- Conferir: nada de regra foi perdido (comparar com `git diff`), e `tests/run_all.sh` continua passando.

### 2. Arquivar o que já foi feito
- Criar `docs/PLANO-FEITO.md` e mover para ele, sem editar, as etapas concluídas do `PLANO.md`: 1a, 1b, 1c, 1d, 2, 2b, 2c, 2c-r (as partes já entregues), 2d, 2d-r e 2e.
- No `PLANO.md` ficam: **Como usar**, **Situação**, as etapas ainda abertas (2f em diante) e **Ideias guardadas**. Acrescentar uma linha apontando para `PLANO-FEITO.md` ("só para consulta").
- Em `PROPOSTAS.md`, mover para `docs/PROPOSTAS-FEITAS.md` os retornos com destino já entregue; ficam só os abertos. Manter o formato (texto original e destino de cada um).
- Antes de mover, conferir com `grep` se algo nos testes ou nos scripts lê esses arquivos (`grep -rn "PLANO\|PROPOSTAS" tests/ ferramentas/ montar.py`).

### 3. Índice por linhas
- No topo do `PLANO.md`, uma tabela `Etapa → linhas A–B` (gerada por `grep -n '^## ' docs/PLANO.md`) para ler a etapa da vez com `offset` e `limit`.
- Mesma coisa no `RESUMO.md` (seções que mais se consultam) e no `PROPOSTAS.md` (abertos por versão).
- Criar `tests/indice.sh` (ou estender o `mapa.sh`) que reimprime esses cabeçalhos com número de linha, para o índice não ficar velho.
- Regra no `CLAUDE.md`: "nunca leia `PLANO.md`, `PROPOSTAS.md` ou `RESUMO.md` inteiros; ache a seção com o índice e leia por faixa de linhas".

### 4. Anexar sem reler
- Em `CLAUDE.md`: para registrar um retorno novo em `docs/PROPOSTAS.md`, anexar no fim com `cat >> docs/PROPOSTAS.md <<'EOF'` em vez de ler o arquivo. Idem para a linha de versão no `RESUMO.md` (só o `tail`).

### 5. Bloquear leituras caras
- Em `.claude/settings.json`, acrescentar `permissions.deny` de Read para `lanchonete.html`, `versoes/**` e `capturas/**` (por exemplo `"Read(./lanchonete.html)"`, `"Read(./versoes/**)"`, `"Read(./capturas/**)"`). O Bash continua liberado, então `montar.py`, os testes e os `diff` de publicação funcionam.
- Cuidado: as capturas conferidas com PIL (`crop`) passam pelo Bash e não são afetadas. Se for preciso olhar uma imagem com o Read, liberar só `capturas/<versão atual>/**`.
- Manter `disableClaudeAiConnectors: true` e os plugins desligados (já estão).

### 6. Hábitos de sessão (sem arquivo para mudar)
- Uma etapa por sessão; abrir sessão nova (ou `/clear`) ao passar de umas 15 trocas.
- Testes sempre com `tests/run_all.sh` ou `| tail`.
- Varreduras largas com o agente `Explore`; mudança pontual com `tests/mapa.sh` + Read por faixa.
- Manter a divisão de modelos do `CLAUDE.md`: Opus planeja, Sonnet executa, Haiku faz o mecânico.

## Ordem e esforço

1. Passo 5 (poucos minutos, ganho imediato de segurança).
2. Passo 1 (maior ganho recorrente).
3. Passos 2, 3 e 4 juntos (mexem nos mesmos arquivos de docs).

Modelo: Haiku, esforço baixo para os passos 2, 4 e 5 (mover texto e editar o JSON); Sonnet, esforço médio para os passos 1 e 3 (decidir o que fica no `CLAUDE.md` sem perder regra e gerar o índice).

## Como conferir o resultado

```bash
wc -c CLAUDE.md docs/PLANO.md docs/PROPOSTAS.md docs/RESUMO.md
cd tests && ./run_all.sh
python3 ../montar.py --check
```

Os números devem bater com a tabela de **Meta**, e os testes e a montagem seguem iguais (nada em `src/` muda).

## Resultado (30/10/2026)

| Medida | Antes | Depois |
|---|---|---|
| `CLAUDE.md` (todo turno) | 22,5 KB | 10,8 KB (o resto ficou em `docs/TESTES.md` e `docs/PARTES.md`) |
| `PLANO.md` ativo | 104 KB | 54 KB (as etapas 1a a 2e foram para `docs/PLANO-FEITO.md`) |
| `PROPOSTAS.md` ativo | 81 KB | 24 KB (os 53 retornos entregues foram para `docs/PROPOSTAS-FEITAS.md`) |
| Leitura da "próxima etapa" | até 28 mil tokens | ~1 a 2 mil (`tests/indice.sh PLANO` + Read por faixa) |
| Read de `lanchonete.html`, `versoes/`, `capturas/` | possível | bloqueado em `.claude/settings.json` |

- O índice por linhas é gerado na hora por `tests/indice.sh` em vez de uma tabela fixa no topo dos docs, para não ficar velho a cada edição.
- Retorno novo: `ferramentas/anota.py` põe a entrada no topo do `PROPOSTAS.md` sem ler o arquivo (mantém a ordem "mais novos no topo").
- O `CLAUDE.md` ficou acima da meta de 6 a 8 KB porque **Regras**, **Economia**, **Modelo**, **Git** e **Publicar** foram mantidos inteiros, como o passo 1 pede.
- O `PLANO.md` ficou acima de ~30 KB porque as etapas abertas (2c-r4, 2f, 3, 4, 6, 7) já vêm com as decisões detalhadas; com `indice.sh`, ninguém precisa ler tudo.
