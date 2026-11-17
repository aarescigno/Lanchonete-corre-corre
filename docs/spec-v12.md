# v12 — Desafios: o motor, a tela e os três primeiros (etapa 13a)

**Situação:** aprovada (17/11)
**Origem:** questionário de 17/11 (`docs/QUESTIONARIO-pos-final.md`; respostas no `docs/PROPOSTAS.md`, entrada "o que vem depois do final novo"); Etapa 13 do `docs/PLANO.md`.

## Objetivo
Depois do "Fim da história", o menu ganha "Desafios": dias avulsos, cada um num ponto e com uma regra, que valem medalha de bronze, prata ou ouro. O dia não mexe na carreira: só a melhor medalha fica guardada. Esta versão traz o motor, a tela e três desafios: Só a Bia, Ninguém bravo e Hora do eFood.

## Fora do escopo
- Festa junina, Jogo do Brasil, Noite do crítico e VIPs exigentes (v12.1, `docs/spec-v12.1.md`).
- Ranking de desafios, prêmio em dinheiro e desafios dentro da carreira (descartados no questionário).

## Regras (decisões tomadas)
- **A lista** `DESAFIOS` (`src/10-constantes.js`), na ordem da tela. Cada item tem estes campos:
  - `id`, `nome`;
  - `cap`: a linha da `DEV_CAPS` que monta o save do dia;
  - `dia`: o número do dia, para o `diaOf`;
  - `mod`: o que muda no dia;
  - `cond`: a regra que precisa valer no fim (ou nenhuma);
  - `aviso`: a frase da tela de introdução;
  - `falhou`: a frase de quando a regra não vale.

  Os três desta versão:

| id | nome | cap (ponto) | dia | mod | cond |
|---|---|---|---|---|---|
| `soBia` | Só a Bia | 5 (área industrial) | 17 | `sem:['dani','joca','cami','anselmo','lia']`, `groups:1`, `meta:0.85` | nenhuma |
| `semBravo` | Ninguém bravo | 8 (Avenida) | 38 | `groups:1.1`, `meta:1` | `stats.lost === 0` |
| `efood` | Hora do eFood | 5 (área industrial) | 17 | `tipo:'entregador'`, `tipoP:0.45`, `groups:1.1`, `meta:1` | `stats.lostBy.retirada === 0` |

- **Os textos:**

| id | aviso | falhou | ficha do Manual |
|---|---|---|---|
| `soBia` | Hoje a Bia segura o salão sozinha. O tio fica na cozinha. | — | Um dia na área industrial sem ajudante: só a Bia no salão e o Tonhão no fogão. |
| `semBravo` | Hoje ninguém pode sair bravo da Avenida. | Alguém saiu bravo. | Um dia na Avenida em que nenhum grupo pode ir embora bravo, nem da fila. |
| `efood` | O eFood mandou entregador que não acaba mais! | Um entregador saiu sem a marmita. | Um dia na área industrial com entregador chegando o tempo todo. Nenhum pode ir embora de mãos vazias. |

- **O dia de cada desafio:**
  - **Metas:** é o `diaPonto(diaOf(dia))`, com as três metas (`meta`, `expert` e, por elas, o `bomGoal`) vezes `mod.meta`, arredondadas para 5, como o `diaNoite`.
  - **Movimento:** os grupos vezes `mod.groups`.
  - **Tipo forçado:** `mod.tipo`/`mod.tipoP` entram no lugar do `tipo`/`tipoP` do dia da semana.
  - **Sem imprevistos:** nada de clima, quebra, fiscal, evento sorteado, crítico sorteado nem noite da estrela.
  - **Sem história:** nada de conversas, capítulo, objetivos, dicas na hora nem reações de história. As reações da Bia, que são do salão, ficam.
- **O save do dia:**
  - Como na Missão zero, o desafio joga com um save de mentira que nunca se grava. O save de verdade fica guardado e volta ao sair.
  - O save de mentira é montado pela linha `cap` da `DEV_CAPS`, do mesmo jeito que o `devCapitulo` monta. As pessoas de `mod.sem` ficam fora da equipe (nível 0) e as melhorias de `mod.up` entram a mais.
  - O `mode` é `'carreira'`, para as regras do ponto valerem.
  - Nada do dia toca o save de verdade, menos a medalha: nem caixa, dia, estrelas, lucro acumulado, ranking, manutenção, Gúgou ou guia.
- **A medalha:**
  - Vem das estrelas do dia, como o `finishDay` já conta: 1 (a meta) é bronze, 2 (o `bomGoal`) é prata e 3 (o `expert` sem perder ninguém) é ouro.
  - Se a `cond` não vale no fim, a medalha é 0.
  - Fica a melhor: `save.desafios = { id: 0 a 3 }`.
- **O menu:**
  - O botão "Desafios" (`#btn-desafios`) fica na 2ª fileira, depois de "Turno sem fim". Ele aparece com `save.cap >= 15` (o Fim da história) ou no modo dev Livre.
  - Se o `menu_fit.py` falhar em algum tamanho com os 4 botões: depois do Fim, "Missão zero" sai da 1ª fileira e vira link nos `.links`, com o mesmo texto e o mesmo `id`.
- **A tela `#ov-desafios`:**
  - O título é "Desafios". Há um cartão por desafio, com:
    - o nome;
    - a medalha: um círculo cheio de bronze `#C8823A`, prata `#B9C1C9` ou ouro `#E8B930`, ou só o contorno tracejado, sem medalha;
    - o "?" no canto, que abre a ficha no Manual, como na lojinha.
  - Tocar no cartão começa o desafio. O botão "Voltar" volta ao menu.
  - O leitor de tela lê, por exemplo, "Só a Bia, medalha de prata" ou "Só a Bia, sem medalha".
- **A introdução:** é a tela de introdução do dia, com o nome do desafio no título e o `aviso` no lugar do aviso do dia. "Abrir a lanchonete" começa o dia e "Menu" volta à tela de Desafios.
- **O fim, o cartão `#ov-desafio-fim`** (no lugar dos resultados e da lojinha):
  - O título é o nome do desafio, com a medalha grande no meio.
  - Uma linha diz o resultado:
    - medalha: "Medalha de bronze!", "Medalha de prata!" ou "Medalha de ouro!", com " Nova melhor marca!" quando supera a guardada;
    - a `cond` falhou: o `falhou`;
    - a meta não foi batida: "Não deu a meta."
  - Os botões são "Tentar de novo" e "Desafios".
  - Se o jogador sai pela pausa no meio do dia, volta à tela de Desafios, sem medalha.
- **Modo dev:** na aba Pular, a linha "Desafios: Liberar | Ouro em todos | Zerar".
  - "Liberar" mostra o botão sem o Fim.
  - "Ouro em todos" põe 3 em todos.
  - "Zerar" limpa `save.desafios`.
- **Manual:** aba nova "Desafios" (`MANUAL_ABAS`), com uma ficha por desafio (`d-soBia`, `d-semBravo`, `d-efood`, com a linha da tabela, sem números). Elas são reveladas quando o botão aparece.
- **Save:** `save.desafios` (novo; `normDesafios` só aceita os `id` da `DESAFIOS` e inteiros de 0 a 3; o save da v11.19 fica com `{}`). O save de mentira tem a marca `_desafio`, e o `writeSave` não grava nem ela nem `_treino`.
- **Versão:**
  - `VERSAO` e `vtag` passam a `v12`.
  - A v11.19 é guardada em `versoes/v11.html` (a 1ª linha de `versoes/v1.html` como invólucro e o `lanchonete.html` exato da v11.19).
  - O `#ov-ver` abre a série nova. As linhas v11.1 a v11.19 saem.
  - Entra a linha da v11, com a data 14/11/2026, o texto "O futuro da Corre-Corre: a história ganha final, o arco da Bia e da equipe, e a abertura e o final refeitos como filminho." e o link "Abrir a v11".
  - Entra a linha da v12, com "versão atual" e o texto "Desafios: depois do fim da história, dias avulsos que valem medalha de bronze, prata ou ouro."

## Critérios de aceite
- **CA1** (`DESAFIOS` tem os três, com os campos e os valores da tabela; `normDesafios` limpa id estranho e valor fora de 0 a 3; o save da v11.19 abre com `desafios` `{}`) → `smoke97` (CA1)
- **CA2** (o botão "Desafios" some antes do Fim e aparece com `cap` 15 ou no Livre; a tela lista os três cartões com nome, medalha e "?", e o "?" abre a ficha no Manual) → `smoke97` (CA2)
- **CA3** (cada desafio começa com o save montado pela linha `cap`: o ponto certo; em `soBia`, Dani, Joca, Cami, Anselmo e Lia em 0; metas do dia vezes `mod.meta`; em `efood`, os entregadores passam de 35% dos grupos; sem clima, quebra, fiscal, evento, crítico, noite nem conversa) → `smoke97` (CA3)
- **CA4** (o fim de um desafio dá a medalha pelas estrelas e pela `cond`; a melhor fica em `save.desafios`; caixa, dia, estrelas, lucro acumulado, ranking, manutenção e Gúgou do save de verdade ficam iguais; `localStorage` só ganha a medalha) → `smoke97` (CA4)
- **CA5** (o cartão do fim mostra as frases da regra e os dois botões levam aonde dizem; a pausa no meio volta à tela de Desafios sem gravar nada) → `smoke97` (CA5)
- **CA6** (o modo dev: Liberar, Ouro em todos e Zerar) → `smoke97` (CA6)
- **CA7** (a calibração: com o bot comum, cada desafio dá bronze ou mais em 40% a 70% das rodadas; com o bot afiado, a `cond` vale em 30% ou mais) → `DESAFIO=<id> node balance.js 40` e `BOT=afiado DESAFIO=<id> node balance.js 40`.
  - Fora da faixa de bronze: mexa no `mod.meta` daquele desafio em passos de 0,05, entre 0,6 e 1,5 (acima de 70%, suba; abaixo de 40%, baixe).
  - `cond` abaixo de 30%: em `semBravo`, `groups` 1,1 para 1; em `efood`, `tipoP` 0,45 para 0,3.
  - Se ainda assim não couber, pare e avise.
- **CA8** (o menu, a tela de Desafios e o cartão do fim cabem nos 14 tamanhos de tela) → `python3 menu_fit.py` (com `#ov-desafios` e `#ov-desafio-fim` na lista dos painéis)
- **CA9** (o que se vê) → captura `shot_v12.js`, em 1220 x 600 e 844 x 390, conferida em recorte:
  - o menu com o botão;
  - a tela com uma medalha de cada cor e um cartão sem medalha;
  - a introdução de `soBia`;
  - o cartão do fim com medalha e com o `falhou`.

  As medalhas têm de se distinguir sem depender só da cor: o contorno tracejado e o texto do leitor de tela.

## Partes
- `src/10-constantes.js`: `DESAFIOS`, `normDesafios`, `MANUAL_ABAS` e as fichas, `VERSAO`.
- `src/12-clientes.js`: `writeSave`, `normSave` (o campo `desafios`).
- `src/16-jogo.js`:
  - a montagem do save, tirada do `devCapitulo` para uma função que só devolve o save, sem mexer no modo dev nem no `localStorage`; o `devCapitulo` passa a usá-la;
  - `startDesafio(id)`, `sairDesafio()`, `resetDay`, `buildSchedule` (o `tipo` do desafio), `finishDay`, `criticoDia`, `noiteDia`, `devForcaSorteio` (nada sorteado no desafio);
  - o modo dev.
- `src/02-telas.html`: `#btn-desafios`, `#ov-desafios`, `#ov-desafio-fim`, `vtag`, `#ov-ver`.
- `src/40-interface.js`: o menu, a tela de Desafios e a linha do modo dev.
- `src/42-resultados.js`: o cartão do fim.
- `src/43-telas.js`: os estados e as trocas de tela.
- `src/01-estilo.css`: os cartões e as medalhas.
- `tests/balance.js` (a chave `DESAFIO`), `tests/menu_fit.py`.

## Tarefas
- [x] T1 Smoke novo `tests/smoke97.js` (CA1 a CA6), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 `DESAFIOS`, `normDesafios`, o campo no save, o `_desafio` no `writeSave` e a montagem do save tirada do `devCapitulo` (o `smoke` do modo dev segue verde).
- [x] T3 O dia do desafio (`startDesafio`, o dia, sem imprevistos nem história) e o fim com a medalha.
- [x] T4 O botão, a tela, a introdução, o cartão do fim, a aba do Manual e o modo dev.
- [ ] T5 `DESAFIO` no `balance.js` e a calibração do CA7.
- [ ] T6 `menu_fit.py` (CA8) e `tests/shot_v12.js` com a conferência do CA9.
- [ ] Fechamento:
  - `versoes/v11.html`, `VERSAO`, `vtag`, `#ov-ver`;
  - `docs/RESUMO.md`, incluindo enviar `versoes/v11.html` na próxima publicação;
  - `docs/TESTES.md`, `docs/PARTES.md`;
  - esta spec como entregue;
  - `tests/run_all.sh --tudo` verde.

## Avisos para a execução
- **O modelo é a Missão zero:** `startTreino`, `sairTreino` e o `_treino` no `writeSave` (`src/16-jogo.js` 396 a 425 e `src/12-clientes.js` 284). Muita regra de ponto testa `mode === 'carreira'`, por isso o desafio fica nesse `mode`, com `this.desafio` marcando o dia.
- **A montagem do save** está no `devCapitulo` (`src/16-jogo.js`, perto da linha 2163). Ela mexe no `DEV` e no `LS.devBak`; a função nova não pode.
- **O que desligar:** a História é ligada pelo `histLiga()`, que tem de dar falso no desafio. O sorteio do dia está no `resetDay` (`manut.sorteio`). O crítico está no `criticoDia` e a noite no `noiteDia`.
- **O `finishDay`** grava caixa, empréstimo, ranking e save. No desafio, ele só conta as estrelas, e o resto não roda.
- **Smokes existentes:** os do menu (`smoke86` e o `menu_fit`) contam os botões e as linhas do `#ov-ver`. Ajuste-os pelo número novo, sem tirar checagem.

## Testes
`smoke97` novo (CA1 a CA6); `balance.js` com `DESAFIO=<id>` (CA7); `menu_fit.py` (CA8); `shot_v12.js` (CA9, capturas apagadas depois); `tests/run_all.sh --tudo` verde. No fechamento: quantas checagens tem o `smoke97` e os `mod.meta` calibrados de cada desafio.

## Decisões em aberto
Nenhuma.

## Desvios
(no fechamento)

**Modelo:** Sonnet, esforço alto — motor novo (save de mentira, o dia sem história e o fim próprio), duas telas, save, a chave do bot e a calibração por regra.
