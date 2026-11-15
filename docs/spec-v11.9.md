# v11.9 — Acertos do polimento: o nome no Ranking, a Divulgação na hora certa e o trio com três músicos (etapa 7a)

**Situação:** aprovada (15/11)
**Origem:** a Etapa 7 do `docs/PLANO.md`, revista com o usuário em 15/11 (as respostas estão no `docs/PROPOSTAS.md`, "15/11 — usuário: decisões da Etapa 7"); as pendências de 10/11 do `docs/RESUMO.md` (o "Seu nome" em todo fim de dia, a Divulgação à mostra desde o dia 2) e o desvio da `docs/spec-v10.5.md` (o trio desenhado com 4 músicos).

## Objetivo
Três acertos pequenos que ficaram para o polimento. O fim do dia deixa de pedir o nome: a pontuação entra sozinha no ranking do aparelho, e o nome se escreve uma vez, na tela do Ranking. O cartão da Divulgação só aparece na lojinha quando já dá para escolher. E o trio de cordas do Terraço passa a ter três músicos.

## Fora do escopo
- Ranking compartilhado: continua desligado (`Rank.online = false`; decisão de 15/11). O código do compartilhado fica como está.
- Ranking por estrelas: não entra (o ranking segue pelo lucro acumulado).
- A lojinha com o topo fixo, os painéis no menor celular e o painel Versões: etapa 7b (`docs/spec-v11.10.md`).
- Selo "novo" no cartão da Divulgação fora do Modo História: não entra (na História, a conversa do fim do dia 3 já leva até ela).

## Regras (decisões tomadas)
### 1. O nome sai do fim do dia e vai para o Ranking
- **Some o formulário** "Seu nome / Salvar no ranking" do fim do dia, da tela "O banco tomou a lanchonete" e do fim do Turno sem fim: saem do HTML os `#end-save`, `#falencia-save` e `#endless-save`, e sai a `buildSaveForm`. No modo dev some também o texto "Modo dev: o ranking fica de fora." (nada no lugar).
- **O registro é automático.** Função nova `rankAuto(kind)` (`src/42-resultados.js`), chamada no fim de `buildEnd` (só com `game.mode === 'carreira'`), de `buildFalencia` e de `buildEndless`, com `kind` `'carreira'`, `'carreira'` e `'semfim'`. Ela chama `Rank.saveScore(kind, nome, pontos, extra)` com os mesmos pontos de hoje: na carreira, `game.save.lucroTot` e `{ dia: game.proxDia - 1 }`; no sem fim, `game.endless.pontos` e `{ tempo }`. Não registra com `DEV.on`, com pontos menores ou iguais a zero, nem no treino. Não mostra mensagem nenhuma (erro de rede é engolido, como o resto do ranking).
- **O nome.** `rankNome()` devolve `lastName()` (o `lcc2_name`) ou, se estiver vazio, a constante nova `RANK_VOCE = 'Você'` (`src/30-ranking.js`). O `lcc2_name` só é gravado quando o jogador salva um nome na tela do Ranking.
- **Na tela do Ranking** (`#ov-rank`), logo abaixo da linha `#rank-source` e antes das abas, entra o formulário `#rank-nome` (classe `saveform`, a mesma de antes): o rótulo "Seu nome", a caixa de texto (`id="rank-nome-inp"`, 16 letras, com o `lastName()` já escrito; vazia se ainda não há nome) e o botão "Salvar" (`btn go`). Embaixo, `<p class="small savemsg" id="rank-nome-msg" role="status">`.
  - Salvar com a caixa vazia: a mensagem "Digite seu nome." e nada muda.
  - Salvar com um nome: grava o `lcc2_name`, mostra "Nome salvo." e a lista se redesenha na hora.
  - **Primeiro nome** (não havia `lcc2_name`): as linhas "Você" das duas listas do aparelho (`campanha` e `semfim`) passam a ter o nome novo. Se já existir uma linha com esse nome, fica a de mais pontos. Função nova `Rank.renomeiaLocal(de, para)` (`src/30-ranking.js`), que devolve quantas linhas mudou.
  - **Troca de nome** (já havia um): as linhas antigas ficam como estão (pode ser outra pessoa no mesmo aparelho); os próximos registros entram no nome novo.
  - Salvar o nome não registra pontuação: quem registra é o fim do dia.
  - No modo dev o formulário funciona igual (só guarda o nome).
- Os textos "Ranking deste aparelho" e "Ninguém no ranking ainda. Seja o primeiro!" ficam como estão.

### 2. A Divulgação só aparece quando abre
- O cartão **Divulgação** do grupo Lanchonete só entra na lojinha quando `divulgaAberta(game.shopNext, game.save)` é verdade: no `shopSecoesVis` (`src/41-lojinha.js`), a condição nova `(id !== 'divulga' || divulgaAberta(game.shopNext, game.save))`. Com isso some também, nas lojinhas dos dias 2 e 3, o cartão "Contas do dia" que mora dentro dela (aceito pelo usuário em 15/11; as contas seguem na linha do pé da lojinha e no Caixa).
- `shopAbrir(sec)` passa a abrir a seção só se ela estiver em `shopSecoesVis` do grupo; senão, abre só o grupo (como já faz com cartão fechado).
- No `buildDivulga`, sai o texto "A partir do dia N" (com a seção à mostra, ela está sempre aberta): o botão é "Escolhida" ou "Escolher".
- No Modo História nada muda no caminho: a conversa do fim do dia 3 marca `convDiv = 1` e a lojinha abre direto na Divulgação. No modo dev (`devLivre()`), o cartão aparece desde o dia 1, como hoje.
- `DIVULGA_DIA` continua 4. O movimento dos dias 1 a 3 (o da inauguração) não muda.

### 3. O trio de cordas com três músicos
- Em `src/21-cenario.js`, a lista `QUARTETO` vira `TRIO`, com três músicos: sai o primeiro violinista (o de `x:206`); ficam, nesta ordem, o violino (o `look` e a `shirt` do antigo `x:248`), a viola (`x:290`) e o violoncelo (`x:332`), agora em `x:227`, `x:269` e `x:311` (o mesmo espaço de 42 entre eles, com o grupo no mesmo centro).
- `drawQuarteto` vira `drawTrio` (a chamada em `src/23-render.js` acompanha). O desenho de cada músico, o tamanho, a altura (`yb = 534`), as notas e o movimento reduzido ficam iguais.
- Nome, preço e efeito da música não mudam (`TERRACO.musica[1]`, "Trio de cordas").

- **Modo dev:** nada novo (não há recurso novo; a música já troca por "Música: trocar" e a Divulgação já abre desde o dia 1).
- **Painel Versões:** a linha desta versão: `<li><b>v11.9</b><span class="cur">versão atual</span><br>dd/11/2026 &mdash; O fim do dia não pede mais o nome: a pontuação entra sozinha no ranking, e o nome se escreve uma vez, na tela do Ranking. A Divulgação só aparece na lojinha quando já dá para escolher. E o trio de cordas do Terraço agora tem três músicos.</li>` (com a data do dia da entrega).
- **Manual:** nada muda.
- **Save:** nada muda (`lcc2_name` e `lcc2_ranking` já existem; as linhas antigas do ranking ficam como estão).

## Critérios de aceite
- **CA1** (o HTML não tem mais `end-save`, `falencia-save` nem `endless-save`; o fim de um dia da carreira com lucro acumulado positivo grava sozinho uma linha "Você" na lista `campanha` do `lcc2_ranking`, com os pontos iguais a `save.lucroTot` e o dia jogado; o `lcc2_name` continua vazio) → `smoke85` (CA1)
- **CA2** (com `lcc2_name` "Renan", o fim do dia grava no nome "Renan"; um dia pior depois não baixa os pontos da linha; a falência e o fim do Turno sem fim também gravam, este na lista `semfim` com o tempo) → `smoke85` (CA2)
- **CA3** (não grava: no modo dev, com lucro acumulado zero ou negativo, no treino e no Turno sem fim com zero ponto) → `smoke85` (CA3)
- **CA4** (a tela do Ranking tem o formulário `rank-nome` com "Seu nome" e "Salvar"; vazio dá "Digite seu nome." e não grava; o primeiro nome dá "Nome salvo.", grava o `lcc2_name` e troca as linhas "Você" das duas listas pelo nome; se o nome já existia na lista, fica a linha de mais pontos) → `smoke85` (CA4)
- **CA5** (trocar de "Renan" para "Arthur" deixa a linha "Renan" como estava; o fim de dia seguinte grava em "Arthur") → `smoke85` (CA5)
- **CA6** (fora da História, a lojinha dos dias 2 e 3 não tem o cartão Divulgação no grupo Lanchonete e `shopAbrir('divulga')` abre só o grupo; a do dia 4 tem, e a seção mostra as três divulgações com "Escolher" ou "Escolhida" e o cartão "Contas do dia"; nenhum texto "A partir do dia") → `smoke85` (CA6)
- **CA7** (na História, com `convDiv` `'pend'` a lojinha do dia 4 não mostra o cartão; depois da conversa, `convDiv` 1 e a lojinha abre direto na seção Divulgação; no modo dev o cartão aparece no dia 1) → `smoke85` (CA7)
- **CA8** (`__lcc.TRIO` tem 3 músicos, com `inst` `violino`, `viola` e `violoncelo` e `x` 227, 269 e 311; `drawTrio` desenha sem erro, com e sem movimento reduzido; não existe mais `drawQuarteto` nem `QUARTETO` no código) → `smoke85` (CA8)
- **CA9** (o que se vê) → captura `shot_v11_9.js`: o Terraço com o trio (três músicos, sem buraco nem sobra no canto), a tela do Ranking com o nome em 1366×768 e em 667×375, e o fim do dia sem o formulário
- **CA10** (nada de jogo mudou: a campanha chega ao Fim como antes) → `DIAS=120 node carreira.js 6`: o Fim em 6 de 6 carreiras

## Partes
- `src/02-telas.html`: `#ov-end` (sai `#end-save`), `#ov-falencia`, `#ov-endless`, `#ov-rank` (entra `#rank-nome`), `#ov-ver` e o selo `vtag`.
- `src/42-resultados.js`: `buildEnd`, `buildFalencia`, `buildEndless`, `lastName`, `buildSaveForm` (sai), `renderRank`, `openRank`; `rankAuto` e `rankNome` (novas).
- `src/30-ranking.js`: `RANK_VOCE` e `Rank.renomeiaLocal` (novas), perto de `saveLocal`.
- `src/41-lojinha.js`: `shopSecoesVis`, `shopAbrir`, `buildDivulga`.
- `src/21-cenario.js`: `QUARTETO` e `drawQuarteto`; `src/23-render.js`: a chamada (linha do `mus === 1`).
- `src/43-telas.js`: `window.__lcc` (expor `TRIO`, `drawTrio`, `rankAuto`, `rankNome`); `src/10-constantes.js`: `VERSAO`.
- `src/01-estilo.css`: só se o formulário pedir ajuste na tela do Ranking (`.saveform` já existe).

## Tarefas
- [ ] T1 `tests/smoke85.js` com uma checagem por critério (CA1 a CA8), falhando; entra no `tests/run_all.sh`.
- [ ] T2 O ranking: `RANK_VOCE`, `Rank.renomeiaLocal`, `rankNome`, `rankAuto`; tirar `buildSaveForm` e os três `*-save`; o formulário `#rank-nome` na tela do Ranking.
- [ ] T3 A Divulgação: `shopSecoesVis`, `shopAbrir`, `buildDivulga`.
- [ ] T4 O trio: `TRIO`, `drawTrio` e a chamada.
- [ ] T5 Acertar os smokes antigos (ver Testes) e rodar `tests/run_all.sh`.
- [ ] T6 `tests/shot_v11_9.js`, conferir os recortes do CA9 e apagar as capturas; `DIAS=120 node carreira.js 6` (CA10).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md` (a linha da versão e, nas Ideias pendentes, saem as duas revisões de 10/11 que esta versão entrega), `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, a linha da 7a na tabela Situação do `docs/PLANO.md`, PR e merge.

## Avisos para a execução
- O `Rank.saveScore` já guarda só a melhor pontuação por nome e já serve para o aparelho e para o compartilhado: não mexa nele nem no `Rank.online`. O `harness.js` tem `load({online:true})`, que os smokes do ranking compartilhado usam; eles têm de continuar passando.
- A lista do aparelho usa a chave `key = normName(nome)`: o `renomeiaLocal` troca `nome` e `key` e reordena por pontos.
- A tela do Ranking, no aparelho, só se redesenha quando o `Rank.subscribe` chama o `cb`: depois de salvar o nome, zere `rk.started` e chame `rankStart()`.
- O `L.setShopTab('divulga')` dos smokes abre a seção direto, sem passar pelo `shopSecoesVis`; quem confere o cartão escondido é o `shopCartoes`/`shopSecoesVis` e o `shopAbrir`.
- Nos smokes, `end-save` e companhia são elementos de mentira do `harness.js` (criados ao pedir o id): confira que saíram lendo o `lanchonete.html`, como o `smoke58` faz.

## Testes
- Smoke novo: `smoke85` (uma checagem por critério, CA1 a CA8).
- Smokes antigos que conferem o formulário e mudam: `smoke3` (o `nm-carreira`, linha 203), `smoke15` (linha 56: o texto do modo dev no `end-save`), `smoke20` (linhas 149 a 159: salvar pelo formulário do fim do dia), `smoke21` (linha 46: o formulário na falência) e `smoke58` (linha 104: a posição do `end-save` no painel do fim do dia). Passam a conferir o registro automático ou a ausência do formulário, sem perder o que conferiam do ranking.
- Smokes que abrem a Divulgação: `smoke9`, `smoke15` e `smoke33` usam `L.setShopTab('divulga')` e não devem mudar; se algum conferir o cartão nos dias 2 e 3 ou o texto "A partir do dia", passa a conferir a regra nova.
- Capturas: `shot_v11_9.js` (CA9). Bot: `DIAS=120 node carreira.js 6` (CA10).
- No fechamento: quantas checagens o `smoke85` tem e o resultado do `carreira.js`.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento: o que saiu diferente do que estava escrito e por quê. Sem desvio, "Nenhum.")

**Modelo:** Sonnet, esforço médio (três acertos localizados, com as regras e os textos fechados; o trabalho maior é acertar cinco smokes antigos do formulário).
