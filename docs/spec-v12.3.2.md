# v12.3.2 — O relatório diz se foi no computador ou no celular (etapa correção)

**Situação:** entregue em 17/11
**Origem:** conversa de 17/11: "adiciona no relatório do teste se foi jogado no computador ou no celular". Hoje a linha `Jogador:` só traz `toque`/`mouse` e o tamanho da tela, o que não separa celular de tablet nem de notebook com tela de toque.

## Objetivo
Quem lê o relatório (do Teste de habilidade ou de um Desafio no modo dev) vê de cara se a pessoa jogou no **celular**, no **tablet** ou no **computador**, e a ferramenta dos relatórios separa os resultados por aparelho.

## Fora do escopo
- O modelo do aparelho, o navegador ou o sistema: só os três tipos.
- Mudar as medidas do teste ou o resto do relatório.

## Regras (decisões tomadas)
- **A detecção:** uma função pura `tipoAparelho(ua, toques, uaMobile)` em `src/11-base.js`, exposta no `__lcc`. Chamada com `navigator.userAgent`, `navigator.maxTouchPoints || 0` e `navigator.userAgentData ? navigator.userAgentData.mobile : undefined`. Devolve, nesta ordem:
  1. `uaMobile === true` → `'celular'`;
  2. `/iPad|Tablet/i`, ou `/Android/i` sem `/Mobile/i`, ou `/Macintosh/i` com `toques > 1` (o iPad que se diz Mac) → `'tablet'`;
  3. `/iPhone|iPod|Mobi|Android/i` → `'celular'`;
  4. senão → `'computador'`.
- **O relatório:** o formato sobe para **2** (`LCC-TESTE 2 · ...`). A linha `Jogador:` ganha o tipo antes do toque/mouse:
  `Jogador: Ana · tentativa 3 · celular · toque 412×915 · 17/11/2026 18:40`
  No bot, o tipo é `bot`: `Jogador: sem nome · tentativa 1 · bot · bot - · ...`. O tipo é lido quando o relatório é montado (`testeRelatorio` em `src/42-resultados.js`); o bot é reconhecido como hoje (`m.aparelho === 'bot'`).
- **A ferramenta** (`ferramentas/relatorios.py`): lê os formatos 1 e 2 (no 1, o tipo fica `?`). No resumo, a linha de cada jogador mostra os tipos usados (ex.: `celular` ou `celular, computador`), e o resumo de cada fase mostra a contagem por tipo (ex.: `celular 5 · computador 2`). O `docs/RELATORIOS.md` passa a mostrar o exemplo no formato 2.
- **Modo dev:** nada novo (o relatório já é do modo dev).
- **Manual:** nada. **Save:** nada.
- **Versão:** `VERSAO` e `vtag` em v12.3.2; linha no `#ov-ver`: **"O relatório do Teste diz se foi jogado no celular, no tablet ou no computador."**

## Critérios de aceite
- **CA1** `tipoAparelho` acerta: iPhone (Safari) → celular; Android com "Mobile" → celular; Android sem "Mobile" → tablet; iPad → tablet; Macintosh com 5 toques → tablet; Macintosh com 0 toques → computador; Windows Chrome → computador; qualquer UA com `uaMobile === true` → celular → `smoke102` (8)
- **CA2** O relatório do teste começa com `LCC-TESTE 2 ·` e a linha `Jogador:` traz o tipo entre a tentativa e o toque/mouse; no bot, `bot` → `smoke102` (2)
- **CA3** O relatório de um Desafio no modo dev também traz o tipo → `smoke102` (1)
- **CA4** `relatorios.py` lê um bloco no formato 1 (tipo `?`) e um no formato 2 (tipo certo) e mostra a contagem por tipo → `smoke102` (roda a ferramenta num arquivo temporário) (2)

## Partes
- `src/11-base.js`: `tipoAparelho` nova.
- `src/42-resultados.js`: `testeRelatorio` (1ª e 2ª linhas).
- `src/43-telas.js`: expor `tipoAparelho` no `__lcc`.
- `src/10-constantes.js` e `src/02-telas.html`: `VERSAO`, `vtag`, `#ov-ver`.
- `ferramentas/relatorios.py`, `docs/RELATORIOS.md`.

## Tarefas
- [x] T1 `tests/smoke102.js` com CA1 a CA4 (falhando), no `run_all.sh`.
- [x] T2 `tipoAparelho` e o relatório no formato 2.
- [x] T3 `relatorios.py` com os formatos 1 e 2 e a contagem por tipo; o exemplo do `docs/RELATORIOS.md`.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (e os testes que contam as linhas: `smoke86`, `menu_fit.py`; os que conferem `LCC-TESTE 1`: `smoke99`, `smoke100`), `docs/RESUMO.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde.

## Avisos para a execução
- O `smoke42` tem uma checagem estatística de VIPs que já oscilava; se só ela falhar, rode de novo e relate.

## Testes
- `smoke102`: 16 checagens (CA1 8, CA2 3, CA3 1, CA4 3 com o formato 1 e o 2 num arquivo temporário), no `run_all.sh`; o `harness.js` ganhou `load(..., { navigator })` para simular o aparelho.
- `smoke86` (a lista do painel de Versões: 17 linhas) e `smoke99`/`smoke100` (`LCC-TESTE 2`, o tipo na linha `Jogador:`) ajustados; `menu_fit.py` (17 linhas) com `python3 menu_fit.py versoes`: 28 conferências, 0 falhas.
- `run_all.sh`: verde, exceto a oscilação antiga de VIPs do `smoke72` (30,5% de exigentes, faixa 20 a 30%), que passou na 2ª rodada. De ponta a ponta: `TESTE=garagem REL=1 node balance.js 1` gerou `LCC-TESTE 2 · v12.3.2 · Garagem ...` com `Jogador: sem nome · tentativa 1 · bot · bot - · ...` e a `relatorios.py` o leu (`aparelhos: bot 1`).

## Decisões em aberto
Nenhuma.

## Desvios
- O `smoke86` tinha índices fixos (`lis[6]`/`lis[7]`) do link da v9; passaram a 7/8 com a linha nova.
- A linha da v12.3.1 no `#ov-ver` ganhou a data (`17/11/2026 —`), como as outras linhas que não são a atual.
- Sem o `navigator` no sandbox do `harness.js`, o `testeRelatorio` testa `typeof navigator !== 'undefined'` (fora do navegador, o tipo vira `computador`).

**Modelo:** Sonnet, esforço médio (pequena, tudo decidido; mexe no jogo, na ferramenta e em quatro smokes)
