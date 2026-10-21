# v7.5.1 — Modo dev

Pedido do usuário em 21/10 (texto em `docs/PROPOSTAS.md`): um modo dev, ligado com 10 toques no selo da versão, com todos os dias liberados, R$ 10.000 e as melhorias ligadas e desligadas à vontade. No retorno seguinte, o usuário pediu que não fosse um painel à parte: o jogo fica praticamente igual, com "modo dev" escrito na tela e tudo o que é melhoria (equipe completa, etc.) liberado na própria lojinha.

## Regras
- **Ligar e desligar:** 10 toques (ou cliques) seguidos no selo da versão do menu (`#vtag`), com no máximo 1,5 s entre um e outro (`DEV.toques`). Ligado, há também o link "Sair do modo dev" no menu, ao lado de "Zerar progresso".
- **"Modo dev" na tela:** o selo vira "v7.5.1 · dev" (laranja) e uma etiqueta "MODO DEV" (`#devbadge`) fica no alto da tela, em todas as telas e durante o jogo (sem pegar toques).
- **Save à parte:** no modo dev o save é `lcc2_save_dev` (`saveKey()`); o de verdade (`lcc2_save`) não muda e volta ao sair. O modo fica guardado em `lcc2_dev` ("1" ou "0"), então continua ligado ao reabrir o jogo.
- **Dias:** o save dev tem sempre `maxDay` 7.
- **Dinheiro:** R$ 10.000 ao ligar; o jogo cobra tudo como sempre, mas cada vez que a lojinha abre o dinheiro volta a R$ 10.000 se estiver abaixo (`goShop`). "Zerar progresso" no modo dev volta a 7 dias e R$ 10.000.
- **Lojinha, até antes do dia 1** (`playCareer` abre a lojinha em qualquer dia):
  - **Melhorias:** as 7 na grade (Tênis novos e de corrida juntos), com "Ligar" e "Desligar", de graça e sem o limite de 1 por dia. Ligar os Tênis de corrida liga os Tênis novos; desligar os Tênis novos desliga os de corrida (`Game.devToggle`).
  - **Equipe:** como sempre (com o dinheiro que não acaba, dá para ter a equipe completa); o **couvert** fica liberado mesmo na Garagem (`couvertOk` é verdadeiro no modo dev).
  - **Divulgação:** liberada desde o dia 1 (`divulgaAberta(n)`).
  - **Salão:** como sempre (mesas até o teto do ponto; hoje só existe a Garagem).
- **Ranking:** no modo dev, o fim do dia, o resultado final e o fim do Turno sem fim mostram "Modo dev: o ranking fica de fora." no lugar do formulário.

## Código
- `10-constantes.js`: `couvertOk` e `divulgaAberta` respeitam o modo dev.
- `12-clientes.js`: `LS.dev`, `LS.devSave`, `DEV`, `saveKey()`; `loadSave` e `writeSave` usam `saveKey()` (no modo dev, sem a importação da v1).
- `16-jogo.js`: `setDev(on)`, `devToggle(id)`; `goShop` repõe o dinheiro; `resetProgress` respeita o modo dev.
- `40-interface.js`: `devSync()` (selo, etiqueta e link). `43-telas.js`: `devSet`, contagem dos toques, `playCareer`. `41-lojinha.js` e `42-resultados.js`: lojinha e ranking no modo dev.
- Teste `smoke15` (43/43). O harness não tem `document.createTextNode` (a aba Equipe usa); o `smoke15` acrescenta.
