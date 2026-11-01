# Testes: detalhes (só quando o assunto pedir)

O resumo de como rodar está no `CLAUDE.md`. Aqui ficam os detalhes que não precisam estar em todo turno.

## Harness (`tests/harness.js`)
- `load(opts)` devolve `{jogo, api, els, store, win, doc}`. `jogo` é `window.__jogo` (lido na hora, então reflete o botão "Novo jogo").
- `opts.novo: semente` já começa um jogo com essa semente; `opts.store` é o localStorage inicial; `opts.semAcesso` faz o localStorage lançar erro; `opts.rm` liga `prefers-reduced-motion`.
- `els['id'].fire('click')` aperta botões; `els['id'].textContent`, `.innerHTML` e `.classList.contains('ativa')` conferem a tela.
- `require('./harness').teste()` dá `ok(cond, nome)` e `fim()`; a última linha sai como `N verificações, fails = X`, que o `run_all.sh` lê.

## Smokes
- Um por versão (`smokeN.js`, número na ordem das versões). O que cada um confere fica no `docs/spec-vN.md`.
- Um smoke testa a regra pela simulação (`jogo.avancar()` com semente fixa) e só o necessário pela interface.

## Lote (`tests/lote.js`)
- Variáveis: `N` (1º argumento, padrão 30), `TEMPORADAS` (padrão 1), `CFG='{"chave":valor}'` (troca números do CFG só naquela rodada, para testar um ajuste antes de mudar `src/`).
- A `politica(jogo)` é o jogador do lote; quando houver decisões, mantenha uma razoável e, se precisar, uma "afiada", para medir a faixa de dificuldade.

### Alvos e histórico do balanceamento
| Versão | Métrica | Alvo | Medido | Ajuste |
|---|---|---|---|---|

## Capturas (`tests/captura.js`)
- Menu, painel e fim, em computador (1280×800) e celular (360×740), para `capturas/<pasta>`; falha se alguma tela rolar para o lado no celular.
- Quando uma tela nova entrar no jogo, acrescente a navegação até ela no `captura.js`.
