# v11.10 — As telas no celular: a lojinha com o topo fixo, os painéis pequenos e as Versões enxutas (etapa 7b)

**Situação:** entregue em 15/11
**Origem:** a Etapa 7 do `docs/PLANO.md`, revista com o usuário em 15/11 (as respostas estão no `docs/PROPOSTAS.md`, "15/11 — usuário: decisões da Etapa 7"); a pendência antiga do `docs/RESUMO.md` ("a lojinha ainda rola no menor celular deitado"). Vem depois da 7a (`docs/spec-v11.9.md`), que muda a tela do Ranking e o fim do Turno sem fim.

## Objetivo
Na lojinha, o dinheiro, as abas e o botão de começar o dia ficam sempre à vista: só os cartões rolam, como no Manual. Os painéis que ainda passavam da tela no menor celular deitado passam a caber. E o painel Versões fica curto: uma linha por versão cheia e as da série atual.

## Fora do escopo
- Lojinha em páginas (sem rolagem nenhuma): descartada em 15/11.
- Mudar o que cada seção da lojinha mostra, a ordem dos cartões ou os textos: nada disso muda.
- O Manual, o fim do dia (`.end-corpo`) e o painel do modo dev: já rolam por dentro e ficam como estão.
- Testar som e toque num celular de verdade: continua com o usuário (pendência do `docs/RESUMO.md`).

## Regras (decisões tomadas)
### 1. A lojinha com o topo fixo
- O painel da lojinha (`#ov-shop .panel`) deixa de rolar inteiro: vira uma coluna (`display:flex; flex-direction:column; overflow:hidden`), como o `#ov-manual .panel`. Só o `#shop-grid` rola (`flex:1 1 auto; min-height:0; overflow-y:auto; overscroll-behavior:contain`). O "?" do Manual, o título, a linha do dinheiro, as abas, o "‹ Voltar" com o nome da seção, a linha "No fim do dia saem" e os botões "Começar o dia" e "Menu principal" ficam parados (`flex:0 0 auto`).
- Vale em todo tamanho de tela, e não só no celular (a lojinha do Terraço rola hoje até em 1366×768).
- O que cabe continua igual: uma seção que cabe inteira não ganha barra de rolagem, e o painel não fica mais alto nem mais largo do que hoje. A largura de cada seção (`.shopgrid`, `.shopcards`, `.cursos`, `.melhorias`, `.luxo`, `.salao`, `.caixa`, `.gurugol`) fica a de hoje, com o grid no centro.
- **Volta ao topo ao trocar de lugar:** ao trocar de grupo (as abas), abrir uma seção (um cartão) ou voltar ("‹ Voltar"), o `#shop-grid` começa do alto (`scrollTop = 0`). **Comprar, contratar, ligar ou desligar algo na mesma seção não tira o lugar:** o `buildShop` guarda o `scrollTop` antes de refazer os cartões e devolve depois.
- O editor do salão (seção Salão) continua dentro do grid; arrastar mesa funciona como hoje.
- As compactações que já existem para tela baixa (`@media (max-height:620px)` e `(max-height:460px)`: sem o título, sem a linha "No fim do dia saem", botões menores) ficam como estão.

### 2. Os painéis no menor celular deitado
- Nos tamanhos de tela do `tests/menu_fit.py` (de 1920×1080 a 568×320), estes painéis cabem inteiros, sem rolar e com os botões dentro da tela: Ranking (`#ov-rank`, já com o "Seu nome" da v11.9), Instalar no celular (`#ov-app`), fim do Turno sem fim (`#ov-endless`), O banco tomou a lanchonete (`#ov-falencia`), a abertura do dia (`#ov-intro`), a pausa (`#ov-pause`) e o fim da Missão zero (`#ov-treino`). Medido em 15/11, na v11.8: em 568×320 passam o Ranking (320 de 299), o Instalar no celular (309 de 299) e o fim do Turno sem fim (389 de 299, ainda com o formulário do nome; em 667×375, 397 de 349); os outros já cabem.
- **Como fazer caber** (a execução mede e escolhe, só com isto): dentro de `@media (max-height:460px)` ou de um `@media (max-height:340px)` novo, diminuir `padding`, `margin` e `gap`; letra não menor que 11px; botão não mais baixo que 30px; no Ranking, diminuir o `max-height` do `.rank-wrap` (a lista já rola por dentro); no fim do Turno sem fim, pôr o `#endless-stats` em mais colunas. Não se esconde informação, e nada muda em telas com mais de 460px de altura.
- Continuam rolando por dentro, de propósito: os cartões da lojinha (`#shop-grid`), as fichas do Manual (`#manual-grid`), o corpo do fim do dia (`.end-corpo`), a lista do Ranking (`.rank-wrap`), os comentários do Gurugol (`.guru-coms`), a lista das Versões (`.verlist`) e o painel do modo dev.

### 3. O painel Versões enxuto
- A lista (`.verlist` em `#ov-ver`) fica só com: as versões da série atual (da `v11.10` à `v11.1`) e uma linha por versão cheia (`v11`, `v10`, ..., `v1`). São 21 linhas. Saem as 95 linhas das versões menores antigas (v10.x, v9.x, v8.x e v7.x), que continuam no git e no `docs/RESUMO.md`.
- O texto de cada linha que fica é o de hoje, sem mudar uma letra. O selo "versão atual" vai para a `v11.10`.
- **Links "Abrir":** ficam os de hoje (v1 a v8 e v10) e a `v9` ganha o dela, no mesmo formato: `<br><a href="versoes/v9.html" target="_blank" rel="noopener">Abrir a v9</a>` (o arquivo `versoes/v9.html` já está no git). A `v11` não tem link (só é guardada quando sair a v12).
- O painel Versões também ganha o topo fixo: o título e o botão "Fechar" ficam parados e a lista rola por dentro (`#ov-ver .panel` em coluna com `overflow:hidden`; `.verlist` com `flex:1 1 auto; min-height:0; overflow-y:auto; overscroll-behavior:contain`).
- **Daqui para a frente:** quando abrir uma série nova (a v12), as linhas menores da série anterior saem e fica só a linha da cheia.
- A linha desta versão: `<li><b>v11.10</b><span class="cur">versão atual</span><br>dd/11/2026 &mdash; Na lojinha, o dinheiro, as abas e o botão de começar o dia ficam sempre à vista: só os cartões rolam. As telas pequenas cabem melhor no celular deitado, e esta lista ficou mais curta.</li>` (com a data do dia da entrega).

- **Modo dev:** nada novo (não há recurso novo).
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (em todos os tamanhos do `menu_fit.py`, com um save do fim do jogo no Terraço e a equipe toda, em cada grupo e em cada seção da lojinha: o `#ov-shop .panel` não rola (`scrollHeight <= clientHeight + 1`), o `#btn-shop-go` e as abas estão inteiros dentro da tela, e o `#shop-grid` é quem rola quando o conteúdo é maior; o mesmo com um save do dia 2 na Garagem) → `python3 menu_fit.py`: 0 falha
- **CA2** (em todos os tamanhos do `menu_fit.py`, os sete painéis da regra 2 não rolam e têm os botões dentro da tela, com conteúdo de verdade: o Ranking com 50 linhas no aparelho e um nome de 16 letras, o fim do Turno sem fim com um resultado, a abertura do dia 1 na Garagem e do dia 60 no Terraço) → `python3 menu_fit.py`: 0 falha
- **CA3** (em todos os tamanhos, o `#ov-ver .panel` não rola, o `#btn-ver-close` está dentro da tela e a `.verlist` rola por dentro) → `python3 menu_fit.py`: 0 falha
- **CA4** (o `menu_fit.py` continua conferindo o menu principal, como antes) → `python3 menu_fit.py`: 0 falha
- **CA5** (a lista das Versões no `lanchonete.html` tem 21 linhas, exatamente `v11.10` a `v11.1`, `v11` e `v10` a `v1`, nesta ordem; "versão atual" só na `v11.10`; link "Abrir" em `v1` a `v10` e em nenhuma outra; o texto da linha da `v10` e o da `v1` são os de antes) → `smoke86` (CA5)
- **CA6** (com o `shop-grid` em `scrollTop` 120: comprar ou ligar algo na mesma seção mantém 120; trocar de grupo, abrir uma seção e "‹ Voltar" levam a 0) → `smoke86` (CA6)
- **CA7** (o que se vê) → captura `shot_v11_10.js`: em 1366×768 e em 667×375, a seção Cardápio do Terraço rolada até o meio (topo e botões parados, cartão cortado só dentro do grid), a seção Caixa (cabe inteira, sem barra) e o Salão com o editor; em 568×320, o Ranking, o Instalar no celular e o fim do Turno sem fim; o painel Versões aberto. Conferir em recorte que nada fica por baixo do "?" nem dos botões
- **CA8** (nada de jogo mudou: a campanha chega ao Fim como antes e nenhum smoke antigo muda de número de checagens) → `DIAS=120 node carreira.js 6`: o Fim em 6 de 6 carreiras

## Partes
- `src/01-estilo.css`: a regra `.panel` (linha 25, só para ler), as do `#ov-manual .panel` e do `#manual-grid` (o exemplo a copiar), as da lojinha (`.shopgrid`, `.shopcards`, os dois blocos `@media` de "lojinha compacta"), `.rank-wrap`, `.app-panel`, `.verlist` e os blocos `@media (max-height:460px)`.
- `src/02-telas.html`: `#ov-shop` (só para ler), `#ov-ver` (a lista) e o selo `vtag`.
- `src/41-lojinha.js`: `buildShop` (o `scrollTop` do `#shop-grid`), `shopGrupoAbrir`, `shopAbrir` e o clique do "‹ Voltar".
- `src/10-constantes.js`: `VERSAO`.
- `tests/menu_fit.py`: as conferências novas (CA1 a CA3).

## Tarefas
- [x] T1 `tests/menu_fit.py` com as conferências dos CA1 a CA3 (falhando) e `tests/smoke86.js` com o CA5 e o CA6 (falhando); o `smoke86` entra no `tests/run_all.sh`.
- [x] T2 A lojinha: o painel em coluna, o `#shop-grid` rolando e o `scrollTop` guardado e devolvido no `buildShop`.
- [x] T3 Os painéis da regra 2, medidos pelo `menu_fit.py` e ajustados com o que a regra permite.
- [x] T4 O painel Versões: a lista enxuta, o link da v9 e o topo fixo.
- [x] T5 `tests/shot_v11_10.js`, conferir os recortes do CA7 e apagar as capturas.
- [x] Fechamento: `VERSAO`, `vtag`, `docs/RESUMO.md` (a linha da versão; nas Ideias pendentes sai "a lojinha ainda rola no menor celular deitado"; em Arquivos publicados, a próxima publicação envia `versoes/v9.html` e `versoes/v10.html` em `files`), `docs/TESTES.md` (o que o `menu_fit.py` confere agora), `CLAUDE.md` (em **Nova versão**: a lista do `#ov-ver` tem só as versões cheias e as da série atual; em Testes: o `menu_fit.py` confere o menu, a lojinha e os painéis), esta spec como entregue, `tests/run_all.sh` verde e `python3 tests/menu_fit.py` com 0 falha, a linha da 7b na tabela Situação do `docs/PLANO.md` (a Etapa 7 fica completa; o texto vai para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py`), PR e merge.

## Avisos para a execução
- O `.panel` é `display:block` com `text-align:center` e os grids têm largura própria: em coluna flex, use `align-self:center` (ou `margin:0 auto`) no `#shop-grid` e confira no CA7 que o painel não mudou de largura nas seções que cabem.
- No navegador, esvaziar o grid zera o `scrollTop`: por isso o `buildShop` guarda antes e devolve depois de montar. No `harness.js` o `scrollTop` é só um campo do elemento de mentira, o que basta para o CA6.
- Medida de 15/11 (v11.8), para saber o espaço: em 568×320 o painel tem 299px e o que fica parado soma uns 130px (linha do dinheiro 36, abas 32, "‹ Voltar" 30, botões 32), sobrando perto de 150px para os cartões; em 667×375, perto de 200px.
- Os `shot_*.js` antigos já rolam `#ov-shop`, `#ov-shop .panel` e `#shop-grid` juntos (`scrollTop = 99999`), então continuam valendo.
- O `menu_fit.py` roda só com `tests/run_all.sh --tudo`; nesta etapa rode `python3 menu_fit.py` direto (o `--tudo` também roda o `balance`, que aqui não precisa).

## Testes
- `tests/menu_fit.py`: além do menu, a lojinha (CA1), os sete painéis (CA2) e as Versões (CA3), nos 14 tamanhos de tela que ele já usa. O save do fim do jogo é o dos `shot_*.js` (`L.normSave` com `salao:{ponto:'terraco'}` e a equipe toda), a lojinha abre com `g.goShop(60)` e as seções com `L.setShopGrupo` e `L.setShopTab`.
- Smoke novo: `smoke86` (CA5, lendo o `lanchonete.html`, e CA6, no `harness.js`).
- Capturas: `shot_v11_10.js` (CA7).
- No fechamento: a saída do `menu_fit.py` (quantas conferências e 0 falha) e quantas checagens o `smoke86` tem.

## Decisões em aberto
Nenhuma.

## Desvios
- **Medidas:** `menu_fit.py` com 630 conferências e 0 falha (14 tamanhos); `smoke86` com 14 checagens; `DIAS=120 node carreira.js 6`: o Fim em 6 de 6 (dia 59), banco 0/6.
- **Margens em coluna:** no flex as margens dos filhos não se fundem e o painel crescia uns 36px; por isso `#ov-shop .panel > *` leva `margin-bottom:0` (só a margem de cima vale). Resultado medido em 1366×768 e 667×375, antes e depois: mesma largura do painel; altura igual ou até 4px maior nas seções que cabem.
- **Grid no centro:** o `.shopgrid` com largura própria ficava encostado à esquerda no painel antigo; agora fica no centro (`align-self:center`), como a regra pedia.
- **Instalar no celular:** só encolher não bastava (o endereço e o botão passavam da largura, que vinha da altura da tela); em `max-height:460px` o painel usa `width:min(100%,640px)`.
- **Falência e fim do Turno sem fim:** a falência já cabia; o Turno sem fim ganhou `#endless-stats` em 4 colunas. O Ranking: `.rank-wrap` com `max-height:max(64px,calc(100vh - 250px))`.
- **Captura (CA7):** a leitura de `capturas/` está bloqueada nesta sessão, então o `shot_v11_10.js` foi escrito e rodado sem erro de página, mas o visual foi conferido por medidas no DOM (largura e altura do painel, posição do grid, botões dentro do painel e da tela, antes e depois), não a olho. Vale olhar a lojinha uma vez num celular.
- **Smoke:** `smoke86` não clica nas abas (no `harness.js` não são elementos); o CA6 usa `setShopGrupo`, `setShopTab`, o cartão e o "‹ Voltar".

**Modelo:** Sonnet, esforço médio (CSS e um ajuste no `buildShop`, com as regras fechadas e a prova no Chromium; se o painel em coluna quebrar a largura de alguma seção e pedir mais de duas rodadas de captura, suba para esforço alto).
