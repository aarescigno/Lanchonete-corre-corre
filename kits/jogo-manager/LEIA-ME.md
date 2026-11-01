# Kit de projeto: jogo de navegador com o Claude Code

Ponto de partida para um jogo novo em HTML (pensado para simuladores de gestão, no estilo "manager") com o mesmo fluxo de trabalho da Lanchonete Corre-Corre: o Opus planeja e o Sonnet ou o Haiku executam, uma etapa por sessão, os docs são lidos por faixa, os retornos dos jogadores ficam num registro e os testes rodam no Node sem abrir o navegador.

## Instalar

```bash
python3 instalar.py ../meu-jogo --nome "Nome do Jogo" [--arquivo meu-jogo.html] [--branch main]
```

Rode de dentro da pasta do kit (descompactada do `kit-jogo-manager.zip` ou em `kits/jogo-manager/`). Ele copia `modelo/` para a pasta, troca os marcadores (`{{JOGO}}`, `{{ARQ}}`, `{{CHAVE}}`, `{{BRANCH}}`, `{{DATA}}`), deixa os scripts executáveis e roda os testes (a última linha deve ser `smoke1.js: 20 verificações, fails = 0`). Não sobrescreve arquivo que já existe (`--forcar` troca).

Depois: commit, push, GitHub Pages em *Settings → Pages → Source: GitHub Actions*, e a 1ª sessão com o Opus usando o prompt de `docs/PROMPTS.md`.

## O que vem

| Onde | O quê |
|---|---|
| `CLAUDE.md` | As regras do fluxo: economia de tokens, modelo e esforço por sessão, testes, Git e publicação, mais as regras de um simulador (simulação sem DOM, sorte com semente, números no `CFG`, saves versionados, tela de celular) |
| `.claude/settings.json` | Bloqueia o Read do arquivo montado, de `versoes/` e de `capturas/` |
| `montar.py` | Junta `src/` num arquivo HTML só (`--check` para o CI) |
| `src/` | Um esqueleto que já funciona: liga de exemplo com 10 semanas, tabela, equipe, caixa, save com migração e fim de temporada. Serve só para começar; a etapa 1 do plano troca pelo jogo de verdade |
| `tests/run_all.sh` | Monta, extrai o JS, confere a sintaxe e as sobras do plano e roda todos os `smoke*.js` mostrando só uma linha de cada |
| `tests/harness.js` | O jogo no Node com um DOM falso (`load({novo:semente})`, `els['bt'].fire('click')`) |
| `tests/lote.js` | Simulação em lote com alvos (o "balance"): N sementes, médias contra faixas, e `CFG='{...}'` para testar ajustes |
| `tests/captura.js` | Fotos das telas no computador e no celular; falha se alguma tela rolar para o lado |
| `tests/mapa.sh`, `tests/indice.sh` | Índices com o número das linhas do código e dos docs, para ler só a faixa que interessa |
| `ferramentas/anota.py`, `arquiva.py`, `sobras.py` | Anotar um retorno, arquivar uma seção e limpar o plano sem ler os arquivos |
| `docs/` | `PLANO.md` (com 3 etapas para planejar), `PLANO-FEITO.md`, `PROPOSTAS.md`, `PROPOSTAS-FEITAS.md`, `RESUMO.md`, `HISTORICO.md`, `TESTES.md`, `PARTES.md`, `spec-modelo.md`, `PROMPTS.md` |
| `.github/workflows/pages.yml` | Em cada PR: confere a montagem e roda os testes; no branch padrão, também publica no GitHub Pages |

## Lições trazidas da Lanchonete (por que é assim)
- **O `CLAUDE.md` custa em todo turno;** o resto só custa quando alguém lê. Por isso ele fica curto (6 a 12 KB) e o detalhe vai para `docs/TESTES.md` e `docs/PARTES.md`.
- **Arquivar desde o primeiro dia:** o que fica pronto sai do `PLANO.md` e do `PROPOSTAS.md`. Na Lanchonete, deixar acumular custou duas rodadas de enxugamento (o `PLANO.md` chegou a 129 KB).
- **O índice é gerado na hora** (`indice.sh`), em vez de uma tabela escrita no doc, que fica velha a cada edição.
- **Um plano bem escrito deixa a execução barata:** com valores, textos, partes de `src/` e testes decididos pelo Opus, o Sonnet ou o Haiku executam sem gastar raciocínio.
- **Saída curta nos testes:** uma linha por smoke; os detalhes só aparecem quando algo falha.
- **Os conectores e plugins da conta do claude.ai não se desligam pelo `settings.json`** nas sessões na nuvem; não adianta tentar por ali.

## O que adaptar
- **Outro tipo de jogo (canvas, ação):** a classe `Jogo` ganha um `update(dt)`, a interface vira `render(ctx)`, e o `harness.js` já traz um canvas falso (`getContext`). O `lote.js` passa a jogar com um bot que chama `update` em passos fixos.
- **Outro nome de branch ou de arquivo:** é só rodar o instalador com `--branch` e `--arquivo`.
- **Publicar como artifact do claude.ai:** a seção **Publicar** do `CLAUDE.md` já descreve o jeito barato. Anote a URL no `docs/RESUMO.md`.
