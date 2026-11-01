# Resumo do projeto

Estado atual de {{JOGO}}. Leia por faixa (`tests/indice.sh RESUMO`). O passado longo vai para o `docs/HISTORICO.md` (`ferramentas/arquiva.py`).

## Estado atual
- Versão: v0.1 (o esqueleto do kit: liga de exemplo, save, testes).
- O que já dá para jogar: começar um jogo, avançar semanas, ver a tabela, fechar a temporada.
- Próximo passo: a etapa da vez no `docs/PLANO.md`.

## Decisões fixas (valem para todas as etapas)
- Simulação sem DOM, sorte com semente, números no `CFG`, saves versionados (ver `CLAUDE.md`).

## Publicação
- GitHub Pages: publicado a cada merge no branch padrão (`.github/workflows/pages.yml`).
- Artifact do claude.ai: (URL, quando houver) — versão do artifact: (número).

## Versões
| Versão | Data | O que mudou | Spec |
|---|---|---|---|
| v0.1 | {{DATA}} | Esqueleto do kit | — |
