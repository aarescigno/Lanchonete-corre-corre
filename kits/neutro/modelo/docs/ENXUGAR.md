# Rodada de enxugamento (quando os docs incharem)

Objetivo: baixar o custo de cada sessão sem perder informação. Só mexe em docs e configuração, nunca no código. Faça uma rodada quando o `CLAUDE.md` passar de 12 KB, o `PLANO.md` de ~50 KB, ou a "próxima etapa" começar a ler mais de 2 a 3 mil tokens.

## 1. Medir (Opus ou Sonnet, numa sessão curta)
```bash
wc -c CLAUDE.md docs/*.md | sort -n | tail
ferramentas/indice.sh PLANO | head -40
python3 ferramentas/sobras.py
du -sh * .[!.]* 2>/dev/null | sort -h | tail
```
Anote numa tabela (arquivo, tamanho, quando custa) e as metas. Só o `CLAUDE.md` custa em todo turno; o resto custa quando alguém lê. Por isso o `CLAUDE.md` vem primeiro.

## 2. Passos (cada um com commit; o Haiku executa se o plano estiver decidido)
1. **`CLAUDE.md`:** detalhes de testes vão para `docs/TESTES.md`; o histórico do código por versão vai para `docs/PARTES.md`. Exemplos e histórico saem; regras ficam inteiras. Confira com `git diff` que nenhuma regra se perdeu.
2. **Arquivar:** etapas prontas para `PLANO-FEITO.md`, retornos entregues para `PROPOSTAS-FEITAS.md`, seções velhas do `RESUMO.md` para `HISTORICO.md`, tudo com `ferramentas/arquiva.py`, sem ler. Antes, confira com `grep -rn "PLANO\|PROPOSTAS"` se algum script lê esses arquivos.
3. **Sobras:** `python3 ferramentas/sobras.py` e `--mover` para o que já foi entregue e ficou no plano.
4. **Bloquear leituras caras:** arquivo gerado, pasta grande ou binário que apareceu desde a última rodada vai para o `permissions.deny` do `.claude/settings.json`.

## 3. Conferir
- Os tamanhos de novo (`wc -c`), contra as metas; `ferramentas/testar.sh` verde.
- Anote o resultado (antes e depois) no fim deste arquivo.

## Lições (de um projeto que chegou a 129 KB de plano)
- O índice é gerado na hora (`indice.sh`), em vez de uma tabela escrita no doc, que fica velha a cada edição.
- Arquivar a cada etapa sai muito mais barato do que uma rodada grande depois.
- Os conectores e plugins da conta do claude.ai não se desligam pelo `settings.json` nas sessões na nuvem; não adianta tentar por ali.
- Um `CLAUDE.md` de 10 a 12 KB com as regras inteiras vale mais do que um de 6 KB que perdeu regra.

## Resultados
| Data | Medida | Antes | Depois |
|---|---|---|---|
