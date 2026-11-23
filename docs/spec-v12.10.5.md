# v12.10.5 — Os relatórios guardados no aparelho (etapa correção)

**Situação:** aprovada
**Origem:** conversa de 23/11: "Seria bom que os relatórios do modo teste ficassem registrados no celular de forma que desse para exportar/copiar para área de transferência todos os resultados. Também seria bom ter alguma forma de timestamp em cada relatório do teste." Nas escolhas, o usuário decidiu: a marca de hora fica como está (a 2ª linha do relatório já traz "dd/mm/aaaa hh:mm" do fim); guardam-se os relatórios do Teste e os dos Desafios; o botão de copiar todos fica na tela do Teste e no painel do modo dev; apagar pede confirmação.

## Objetivo
Cada relatório do Teste de habilidade e dos Desafios fica guardado no aparelho assim que a fase acaba. Na tela do Teste, ou no painel do modo dev, um toque copia todos de uma vez, cada um com a sua data e hora, prontos para colar na conversa. Outro botão apaga a lista.

## Fora do escopo
- O texto do relatório (`testeRelatorio`) e o `TESTE_FORMATO` (segue 3): nada muda. A data e a hora já vão na linha "Jogador:".
- O `ferramentas/relatorios.py` e o `docs/RELATORIOS.md`: nada muda. O texto copiado é uma sequência de blocos separados por uma linha em branco, que o `relatorios.py` já lê.
- A tela do fim da fase (`#ov-teste-fim`, `#ov-desafio-fim`) e o "Copiar relatório" de cada fase: ficam como estão.
- O botão nos Desafios: não entra (o usuário escolheu só a tela do Teste e o painel do dev).

## Regras (decisões tomadas)
- **Guardar** (`src/10-constantes.js`, junto do `TESTE_LS`): `const RELS_LS = 'lcc-relatorios';` e `const RELS_MAX = 200;`, com um comentário: a lista dos relatórios do Teste e dos Desafios, a mais velha primeiro, fora do save. "Recomeçar do zero" não apaga (como o `lcc-teste`).
- **Funções** (`src/12-clientes.js`, logo depois de `testeSobe`):
  - `relsLe()`: lê o `RELS_LS` (JSON) e devolve um array só com os textos (`typeof === 'string'`) que começam com `'LCC-TESTE '`; com erro ou formato errado, `[]`.
  - `relsGuarda(t)`: se `t` é texto que começa com `'LCC-TESTE '`, acrescenta no fim, corta para os `RELS_MAX` mais novos (`slice(-RELS_MAX)`) e grava com `lsSet`.
  - `relsApaga()`: grava `'[]'` no `RELS_LS`.
  - `relsTexto()`: `relsLe().join('\n\n')`.
- **Quando guarda** (`src/16-jogo.js`): no `finishTeste` e no `finishDesafio`, logo depois de `this.testeRel = testeRelatorio(this)`, chame `relsGuarda(this.testeRel)`. Os Desafios guardam com ou sem o modo dev ligado (o relatório já é montado nos dois casos).
- **Os botões** (`src/40-interface.js`): uma função `relsCaixa(id)` devolve um `div` com classe `rels` e o `id` dado, com:
  - uma `div class="row"` com dois botões `btn alt` (`type="button"`): **"Copiar todos (N)"** (`data-rels="copia"`, N = `relsLe().length`; desabilitado com N = 0) e **"Apagar relatórios"** (`data-rels="apaga"`, desabilitado com N = 0);
  - um `p` com `role="status"` (o aviso) e um `div` (a caixa).
  - **Copiar:** `copyText(relsTexto())`. Se der certo: `Sfx.ok()`, aviso **"Copiados N relatórios! Cole na conversa."** (com N = 1: **"Copiado 1 relatório! Cole na conversa."**), caixa vazia. Se falhar: aviso **"Não deu para copiar sozinho: selecione o texto abaixo."** e, na caixa, um `textarea` `cx-txt` `readonly` com `aria-label="Relatórios"` e o texto selecionado (como no `testeCopia`).
  - **Apagar:** no 1º toque, o botão passa a **"Toque de novo para apagar"**. No 2º toque, `relsApaga()`, `Sfx.tap()`, o "Copiar todos" volta a "Copiar todos (0)", os dois ficam desabilitados, a caixa fica vazia e o aviso diz **"Relatórios apagados."**. Tocar no "Copiar" entre os dois toques desfaz o pedido (o botão volta a "Apagar relatórios").
- **Onde:** no fim de `buildTeste` (a tela do Teste no menu), `box.appendChild(relsCaixa('teste-rels'))`; no fim de `devTeste` (o painel do modo dev), uma seção nova `secao('Relatórios guardados')` com `relsCaixa('dev-rels')` dentro.
- **CSS** (`src/01-estilo.css`): `.rels .row{flex-wrap:wrap}` e `.rels .cx-txt` com a mesma regra da `.cx-txt` do fim do Teste (se já for geral, nada). Se o `menu_fit.py` mostrar a tela do Teste sem caber, faça o `#teste-lista` rolar como o `#teste-fase-lista` (`flex:1 1 auto; min-height:0; overflow-y:auto`, com o `.teste-panel` em coluna).
- **Modo dev:** o botão no painel já é o jeito de assistir. O `window.__lcc` ganha `RELS_LS, RELS_MAX, relsLe, relsGuarda, relsApaga, relsTexto, relsCaixa`.
- **Manual e save:** nada no Manual; o save não muda (a lista fica na chave própria).
- **Versão:** `VERSAO` e `vtag` (texto e `aria-label`) em v12.10.5; linha nova no topo do `#ov-ver`, com o "versão atual" saindo da v12.10.4: **"Os relatórios do Teste e dos Desafios ficam guardados no aparelho, e um toque copia todos."**, data do dia da entrega.

## Critérios de aceite
- **CA1** Depois de um `finishTeste` e de um `finishDesafio`, `relsLe()` tem os 2 relatórios, na ordem, e cada um é igual ao `game.testeRel` daquela vez → `smoke122` (2)
- **CA2** Com 201 relatórios guardados, ficam os 200 mais novos; textos que não começam com "LCC-TESTE " e JSON quebrado são ignorados → `smoke122` (3)
- **CA3** `relsTexto()` junta os blocos com uma linha em branco, e os blocos ficam iguais aos guardados quando o texto é cortado nas linhas em branco antes de "LCC-TESTE " (o jeito do `relatorios.py`) → `smoke122` (1)
- **CA4** A tela do Teste e o painel do modo dev têm o "Copiar todos (N)" com o N certo; com a lista vazia, os dois botões estão desabilitados → `smoke122` (3)
- **CA5** O toque no "Copiar todos" chama o `copyText` com o `relsTexto()` e mostra "Copiados N relatórios! Cole na conversa."; com a cópia recusada, aparece a caixa com o texto inteiro → `smoke122` (2)
- **CA6** O 1º toque no "Apagar relatórios" não apaga e muda o texto para "Toque de novo para apagar"; o 2º apaga e mostra "Relatórios apagados." → `smoke122` (2)
- **CA7** "Recomeçar do zero" não apaga os relatórios guardados, e a `VERSAO` é `v12.10.5` → `smoke122` (2)
- **CA8** A tela do Teste com a caixa de relatórios cabe nos 14 tamanhos → `python3 tests/menu_fit.py` (a conferência "tela do Teste" ganha `#teste-rels [data-rels=copia]` e `#teste-rels [data-rels=apaga]` na lista, com 1 relatório guardado antes)

## Partes
- `src/10-constantes.js`: junto do `TESTE_LS` (~1580); `VERSAO`.
- `src/12-clientes.js`: depois de `testeSobe` (~113).
- `src/16-jogo.js`: `finishDesafio` (~510) e `finishTeste` (~523).
- `src/40-interface.js`: `buildTeste` (~211) e `devTeste` (~261).
- `src/01-estilo.css`: perto das regras do `#ov-teste-fase` (~478).
- `src/02-telas.html`: `vtag` e `#ov-ver`. `src/43-telas.js`: o `window.__lcc`.

## Tarefas
- [ ] T1 `tests/smoke122.js` com os CA1 a CA7 (falhando).
- [ ] T2 Constantes e funções `rels*` (`10`, `12`) e o `relsGuarda` no `finishTeste` e no `finishDesafio` (`16`).
- [ ] T3 `relsCaixa` na tela do Teste e no painel do dev (`40`), o CSS e o `window.__lcc`.
- [ ] T4 `menu_fit.py` (CA8) e capturas da tela do Teste com 3 relatórios num celular deitado e no desktop (olhar e apagar).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86`, `smoke98` e `menu_fit.py` contam as linhas do `#ov-ver`: ajuste os números se mudarem), `docs/RESUMO.md`, `docs/PARTES.md`, `docs/TESTES.md` (a chave `lcc-relatorios`), esta spec como entregue, `tests/run_all.sh --tudo` verde, PR e merge.

## Avisos para a execução
- Executar depois da v12.10.4 (esta spec parte da `VERSAO` dela).
- No harness, o `copyText` cai no `navigator.clipboard`/`execCommand` do stub: veja como o `smoke99` (o `testeCopia`) simula a cópia aceita e a recusada e faça igual.
- O bot do `balance.js` com `TESTE`/`DESAFIO` também passa pelo `finishTeste`: guardar no `localStorage` falso do harness não atrapalha, mas confira que o `balance.js` não fica mais lento (o corte em 200 segura o tamanho).

## Testes
- Novo: `smoke122` (15 checagens).
- Mudam: `menu_fit.py` (CA8); `smoke86`, `smoke98` se a conta de linhas do `#ov-ver` mudar.
- Sem balanceamento (nada muda na partida).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (código de interface com plano detalhado, smoke e menu_fit)
