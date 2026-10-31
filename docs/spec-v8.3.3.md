# v8.3.3 — Jogo offline

Pedido do usuário em 23/10, depois da v8.3.2 (texto em `docs/PROPOSTAS.md`): "Não precisa de modo online com ranking compartilhado, é pra ser um jogo offline a princípio, onlinização eu prevejo só para os ajustes finais do jogo".

## Antes
Desde a v2, o ranking usava o banco de dados compartilhado do artifact (`window.claude`: `db` e `user`), com o ranking do aparelho só quando ele faltava. A v8.3 tinha deixado uma pendência: declarar a leitura da coleção nova `ranking-campanha` na próxima publicação.

## Agora
- `Rank.online = false` (em `30-ranking.js`): `Rank.init()` não chama `window.claude`, então o jogo não usa o `db` nem o `user` do artifact. O ranking (Carreira e Turno sem fim) fica só no aparelho (`lcc2_ranking`), como já era no app do celular.
- A tela do ranking diz "Ranking deste aparelho" desde a abertura (sem "Conectando...").
- O código do compartilhado continua, desligado, para os ajustes finais (etapa 7 do `docs/PLANO.md`): religar é `Rank.online = true` e declarar a leitura de `ranking-campanha` nas capacidades do artifact.
- Publicação: continua sem passar `capabilities` (as declaradas ficam lá, sem uso); a pendência da v8.3 sai.

## Testes
- `smoke3` (123 checagens): os testes do compartilhado ligam a chave (`load({online:true})`, no `harness.js`); novo: com `window.claude` presente e a chave desligada, nenhum `use()`, nada no db, o recorde salvo no aparelho e a tela sem "Conectando...".
