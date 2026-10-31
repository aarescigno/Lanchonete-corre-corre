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

---

# Rodada 2 (planejada em 31/10/2026, para uma sessão com o Haiku)

Para começar, peça: **"faça a rodada 2 do docs/ENXUGAMENTO.md"**. A sessão lê só esta seção (`grep -n '^# \|^## ' docs/ENXUGAMENTO.md` e Read por faixa). Tudo abaixo já está decidido; só mexe em docs e em `ferramentas/`, nunca em `src/`.

## Diagnóstico (31/10)

| Arquivo | 30/10 (depois da rodada 1) | 31/10 | Meta da rodada 2 |
|---|---|---|---|
| `docs/PLANO.md` | 54 KB | 129 KB | ≤ 55 KB |
| `docs/RESUMO.md` | 46 KB | 53 KB | ≤ 38 KB |
| `docs/PROPOSTAS.md` | 24 KB | 35 KB | ≤ 22 KB |
| `CLAUDE.md` | 10,8 KB | 11,5 KB | ≤ 12 KB (só ganha 1 regra) |

Causa: a rodada 1 arquivou uma vez, mas o fechamento de etapa não manda arquivar. As etapas feitas em 30/10 (2c-r4, 2f, 2g, 2h, 2c-r5, 2c-r6, 3a) ficaram inteiras no `PLANO.md` (~73 KB), e a tabela **Situação** tem 45 linhas de etapas feitas (~6 KB, lida em toda "próxima etapa").

## Passo 1 — `ferramentas/arquiva.py` (move seções inteiras entre docs, sem ler)

Uso: `python3 ferramentas/arquiva.py ORIGEM DESTINO [--topo] "início do cabeçalho" ["outro" ...]`
- Cada argumento é o começo exato de uma linha de cabeçalho (`## ...` ou `### ...`) da ORIGEM. A seção vai dessa linha até antes do próximo cabeçalho de nível igual ou maior (para `###`, para no próximo `###`, `##` ou `#`; para `##`, no próximo `##` ou `#`).
- `assert` de que cada início casa com **exatamente uma** linha; se algum falhar, nada é gravado.
- Sem `--topo`: as seções vão para o **fim** do DESTINO, na ordem dos argumentos. Com `--topo`: entram antes do primeiro `## ` do DESTINO (para arquivos com os mais novos no topo), na ordem dos argumentos.
- Linhas em branco: o DESTINO fica com uma linha em branco entre seções; a ORIGEM não fica com duas linhas em branco seguidas no lugar do corte.
- No fim, imprime o tamanho em KB da ORIGEM e do DESTINO, antes e depois.

## Passo 2 — `PLANO.md` → `PLANO-FEITO.md` (fim do arquivo, em ordem)

```bash
python3 ferramentas/arquiva.py docs/PLANO.md docs/PLANO-FEITO.md \
  "## Etapa 2c-r4" "## Etapa 2f" "## Etapa 2g" "## Etapa 2h" \
  "## Etapa 2c-r5" "## Etapa 2c-r6" "### Sessão 3a"
```
Depois, à mão (Edit):
- Na **Etapa 3** do `PLANO.md`, logo depois da linha `**Objetivo:** ...`, acrescentar: `- A sessão 3a (feita em 30/10, v9) está no \`docs/PLANO-FEITO.md\`.` As seções **Vale para a 3a e a 3b** e **Checagens de fim de sessão** ficam (a 3b e a 4 usam).
- **Tabela Situação:** ficam no `PLANO.md` o cabeçalho da tabela e as linhas da **2c-r5** em diante (2c-r5, 3a, 2c-r6 e todas as "a fazer", a 5 e a 7). As linhas de cima (da `0` até a `2h`, com as "—" do meio) vão para o `PLANO-FEITO.md` numa seção nova `## Situação das etapas feitas`, com o mesmo cabeçalho de tabela, logo antes de `## Etapa 1a` (script Python com substituição exata, sem reler o arquivo).
- **Como usar** do `PLANO.md`:
  - no item **Ler por faixa**, trocar "As etapas feitas (1a a 2e)" por "As etapas feitas" (o resto da frase fica);
  - trocar o item "No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data) e anota o que mudou no plano." por: "No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas."

## Passo 3 — `RESUMO.md` → `HISTORICO.md` (fim do arquivo)

```bash
python3 ferramentas/arquiva.py docs/RESUMO.md docs/HISTORICO.md "## Alterações feitas no Claude Code (14/10/2026)"
```
No `RESUMO.md`, onde a seção estava, deixar uma linha: `- As alterações de 14/10/2026 estão no fim do \`docs/HISTORICO.md\`.` (dentro da seção anterior, **Versões**, como último item).

## Passo 4 — `PROPOSTAS.md` → `PROPOSTAS-FEITAS.md` (`--topo`, mais novos no topo)

Os 13 retornos com destino já entregue (decidido em 31/10; os que têm partes ainda abertas ficam):
```bash
python3 ferramentas/arquiva.py docs/PROPOSTAS.md docs/PROPOSTAS-FEITAS.md --topo \
  "## 31/10/2026 — usuário: espalhar as conversas" \
  "## 31/10/2026 — usuário: diálogo ao liberar a divulgação" \
  "## 30/10/2026 — beta-tester (via usuário): a fala do Tonhão" \
  "## 30/10/2026 — beta-tester (via usuário): não achou como aumentar" \
  "## 30/10/2026 — Usuário: ajustes da lojinha" \
  "## 30/10/2026 — usuário: barras do Gurugol" \
  "## 30/10/2026 — Usuário: level up da Dani" \
  "## 30/10/2026 — Usuário: clientes novos da área industrial" \
  "## 30/10/2026 — Usuário: o Tonhão sobe de nível" \
  "## 30/10/2026 — Usuário: entrevista para planejar a 3a" \
  "## 30/10/2026 — Usuário: entrevista para planejar a 2f" \
  "## 26/10/2026 — Usuário: a morte da Rosa" \
  "## 26/10/2026 — Usuário: o roteiro da abertura"
```
(São 13 argumentos; se algum não casar por diferença de caixa ou de traço, copie o início exato com `tests/indice.sh PROPOSTAS`.) Ficam no `PROPOSTAS.md`: "a lojinha abre aos poucos" (2c-r7), o "(n)" do Gurugol, a revisão de 28/10, o "jogo offline" (ranking volta na etapa 7) e os de 22/10, 21/10 e 15/10 (destinos nas etapas 3, 4 e nas Ideias).

## Passo 5 — Regra no `CLAUDE.md` (para não inchar de novo)

Na seção **Economia de tokens**, trocar a frase "O que já foi feito está em `docs/PLANO-FEITO.md` e `docs/PROPOSTAS-FEITAS.md` (só para consulta)." por:
"**Fechar etapa arquivando:** ao terminar uma etapa, mova o texto dela do `PLANO.md` para o `docs/PLANO-FEITO.md` e os retornos entregues do `PROPOSTAS.md` para o `docs/PROPOSTAS-FEITAS.md` com `python3 ferramentas/arquiva.py` (sem ler os arquivos); na tabela Situação ficam só as 3 últimas feitas. Os arquivos `-FEITO(S)` são só para consulta."

## Conferir e fechar

```bash
wc -c CLAUDE.md docs/PLANO.md docs/RESUMO.md docs/PROPOSTAS.md
tests/indice.sh PLANO | head -30; tests/indice.sh PROPOSTAS | wc -l
grep -c '^|' docs/PLANO.md
python3 montar.py --check
```
- Os tamanhos batem com a coluna **Meta** do diagnóstico. Se o `PLANO.md` passar de 55 KB, conferir se alguma etapa feita ficou para trás (`grep -n 'FEITA\|feita em' docs/PLANO.md`) e movê-la também.
- Nada some: `wc -c` da soma (ORIGEM + DESTINO) antes e depois difere só pelas linhas acrescentadas.
- Preencher a tabela **Resultado da rodada 2** abaixo, commit, PR para o `claude/main` e merge (regra de **Git** do `CLAUDE.md`). Não precisa rodar o `run_all.sh` (nada em `src/` muda; o `montar.py --check` basta).

## Fora desta rodada (decidido)
- **Plugins e conectores da conta** (passo do usuário, não da sessão): nas sessões na nuvem vêm carregados os conectores Gmail, Drive, Calendar, Docs, Sheets e Slides, os plugins `data`, `productivity` e `cowork-plugin-management` e as skills `questao-*`, apesar do `.claude/settings.json`. São alguns milhares de tokens por turno. Se não usar em outro lugar, desligue em https://claude.ai/customize/connectors (conectores) e nas skills/plugins da conta; se usar, aceite o custo.
- **`capturas/` fora do git:** não economiza tokens e o histórico do git não diminui; fica como está.

## Resultado da rodada 2
(preencher ao terminar)

| Medida | Antes (31/10) | Depois |
|---|---|---|
| `PLANO.md` | 129 KB | |
| `RESUMO.md` | 53 KB | |
| `PROPOSTAS.md` | 35 KB | |
| `CLAUDE.md` | 11,5 KB | |

Modelo: Haiku, esforço baixo — tudo decidido; é um script de corte por cabeçalho e trocas de texto exatas.
