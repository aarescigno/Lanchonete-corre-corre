# v12.3.1 — O Teste de habilidade no menu (modo dev) (etapa correção)

**Situação:** entregue em 17/11
**Origem:** conversa de 17/11: o usuário não achou o Teste de habilidade (fica na aba Pular do painel do dev, abaixo dos Desafios) e pediu "ajusta aí pra ficar fácil no menu principal". Decisão do usuário: o botão aparece **só com o modo dev ligado**.

## Objetivo
Com o modo dev ligado, o Teste de habilidade fica a um toque no menu principal: um botão "Teste" abre uma tela com o nome e as quatro fases. Quem testa não precisa mais abrir o painel do dev.

## Fora do escopo
- O Teste para quem não está no modo dev: a decisão de 17/11 continua (só no modo dev).
- Mudar o Teste em si (fases, sementes, medidas, relatório): fica como na v12.2 e na v12.3.
- A seção "Teste de habilidade" do painel do dev continua lá, sem mudança.

## Regras (decisões tomadas)
- **O botão no menu:** `#btn-teste`, classe `btn alt`, texto **"Teste"**, logo depois do `#btn-desafios` no `#menu-btns` (`src/02-telas.html`). O `buildMenu` (`src/40-interface.js`) mostra o botão só com `DEV.on` (senão `display:none`). Com o modo dev ligado, os Desafios também aparecem, e a fileira passa a ter Desafios, Teste, Manual e Ranking. Se o `menu_fit` acusar que não cabe, use a mesma classe de encolher que o `quatro` usa (ou uma `cinco` com o mesmo jeito), sem mudar o tamanho dos outros menus.
- **A tela do Teste:** um painel novo `#ov-teste` (entra na `SCREENS`), no estado `'teste'` do `setState` (`src/43-telas.js`). Como no `'desafios'`, ao entrar o jogo sai do save de mentira se estiver nele (`game.sairDesafio()`, `game.resetDay(game.proxDia)`). Ela tem, nesta ordem:
  - o título `<h2>` **"Teste de habilidade"**;
  - uma frase: **"Quatro fases, sempre com os mesmos clientes. No fim, copie o relatório e mande."**;
  - o campo do nome (`#teste-nome`, `maxLength` 16, placeholder **"Seu nome"**, `aria-label` "Seu nome", começa com o `lastName()` e grava com `cleanName` no `LS.name` ao digitar, como o `devTeste`);
  - os quatro botões das fases, um por item da `TESTES`, com o texto `nome (tentativas)` (o mesmo do painel do dev, pelo `testeTent()`) e `data-teste` com o id. O toque grava o nome e chama `game.startTeste(id)`;
  - o botão **"Voltar"** (`#btn-teste-menu-volta`, classe `btn go`), que volta ao menu.
  Monte a lista numa função `buildTeste()` em `src/40-interface.js`, reaproveitando o que der do `devTeste` (por exemplo, uma função comum que cria o campo e os botões), sem mudar o que o painel do dev mostra.
- **A volta para a tela do Teste:** quando o jogo está num teste (`game.teste`), os caminhos que hoje vão ao menu passam a ir à tela do Teste (`'teste'`): o "Voltar" do fim do teste (`#btn-teste-volta`), o "Menu" da introdução do dia (`#btn-intro-menu`) e o "sair do dia" da pausa (`#btn-pause-menu`). Fora do modo dev (se o dev foi desligado no meio), vão ao menu como antes.
- **Modo dev:** o próprio botão é do modo dev. O painel não muda.
- **Manual:** nenhuma ficha.
- **Save:** nada novo. As tentativas continuam no `lcc-teste`.
- **Versão:** `VERSAO` e `vtag` em v12.3.1. Uma linha nova no `#ov-ver`: **"No modo dev, o Teste de habilidade ganhou um botão no menu."**

## Critérios de aceite
- **CA1** Com `DEV.on`, o menu mostra `#btn-teste` com o texto "Teste"; com o modo dev desligado, ele fica escondido → `smoke101` (2)
- **CA2** O toque no `#btn-teste` leva ao estado `'teste'`, com `#ov-teste` visível, o título, o campo do nome e quatro botões de fase com `data-teste` garagem, industrial, avenida e terraco → `smoke101` (3)
- **CA3** O toque numa fase começa o teste daquela fase (`game.teste.id` certo, o mesmo que o `startTeste` daria) e grava o nome digitado no `LS.name` → `smoke101` (2)
- **CA4** No fim do teste, "Voltar" leva à tela do Teste, e o número de tentativas da fase jogada subiu em 1 no botão → `smoke101` (2)
- **CA5** "Menu" na introdução de um dia de teste e "sair do dia" na pausa de um teste levam à tela do Teste; o "Voltar" da tela do Teste leva ao menu → `smoke101` (3)
- **CA6** O menu (com o modo dev ligado e os Desafios à mostra) e a tela do Teste cabem nos 14 tamanhos → `python3 menu_fit.py` sem falhas (acrescente a tela do Teste e o menu com o modo dev ligado às conferências)
- **CA7** O que se vê → captura do menu com o modo dev ligado e da tela do Teste (desktop e celular deitado): os botões alinhados e legíveis. Confira e apague.

## Partes
- `src/02-telas.html`: o `#btn-teste` no `#menu-btns`; o painel `#ov-teste`; a linha do `#ov-ver`.
- `src/01-estilo.css`: o que precisar para a tela do Teste (reaproveite o estilo do `desafios-panel` e dos botões do painel do dev).
- `src/10-constantes.js`: `VERSAO`.
- `src/40-interface.js`: `SCREENS`, `buildMenu`, `buildTeste` nova, `devTeste` (só se for repartir o código comum).
- `src/43-telas.js`: o estado `'teste'` no `setState`; os cliques `btn-teste`, `btn-teste-menu-volta`; os destinos de `btn-teste-volta`, `btn-intro-menu` e `btn-pause-menu`.

## Tarefas
- [x] T1 `tests/smoke101.js` com CA1 a CA5 (falhando), no `run_all.sh`.
- [x] T2 O botão no menu e o `buildMenu`.
- [x] T3 A tela `#ov-teste`, o estado `'teste'` e a `buildTeste`.
- [x] T4 As voltas para a tela do Teste.
- [x] T5 `menu_fit.py` com a tela do Teste e o menu do dev; capturas conferidas e apagadas.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (e os smokes que contam as linhas: `smoke86`, `menu_fit.py`), `docs/RESUMO.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde.

## Avisos para a execução
- O `#menu-btns` já ganha a classe `quatro` quando o Desafios aparece. Confira no `menu_fit` se a fileira com o Teste cabe antes de mexer no CSS.
- O `smoke42` tem uma checagem estatística de VIPs que já oscilava antes da v12.2. Se só ela falhar, rode de novo e relate.

## Testes
- `smoke101`: 21 checagens (CA1 a CA5; o título e a frase da tela são conferidos no HTML montado, porque o harness não monta o HTML fixo).
- `smoke86`: a lista das Versões passa a ter 16 linhas (v12.3.1 é a atual) e os índices do link da v9 subiram um; o selo e a `VERSAO` dizem v12.3.1. `smoke98` e `smoke99` só tiveram a expressão da versão alargada (`v12(\.\d+)+`), por causa do número de três partes.
- `menu_fit.py`: duas conferências novas por tamanho, o menu com o modo dev ligado (Desafios e Teste à mostra; cabe sem rolar, em no máximo 3 fileiras de botões) e a tela do Teste (nome, quatro fases e Voltar à vista), nos 14 tamanhos.

## Decisões em aberto
Nenhuma.

## Desvios
- **Classe `cinco`** (novo, `01-estilo.css`): com o Desafios e o Teste juntos são 5 botões na 2ª fileira; a `buildMenu` põe `quatro` com 4 ou mais botões e `cinco` com 5. Em 800x600 a fileira quebra e fica em 3 fileiras de botões (cabe, mas é a única medida em que não ficam 2).
- **O `menu_fit` achou que o menu do modo dev nunca coube em tela baixa** (antes ele só conferia o menu sem o modo dev): os 10 chips de dia passavam da largura do painel e, com os links e ícones, a altura estourava no 568x320. Ajustes só de CSS, sem mexer nos outros menus: `.menu-panel .chip` com `min-height:36px` (28px em tela baixa) e `flex:none`; até 620px de altura os chips ficam em uma fileira que rola por dentro; em tela baixa os links ficam com `min-height:28px`, os ícones com 30px e o `gap` menor.
- A tela do Teste ganhou estilo próprio (`.teste-panel`, `.teste-fases`, `#teste-nome`), com as fases em 2 colunas (1 coluna em tela estreita).

**Modelo:** Sonnet, esforço médio (tela pequena com tudo decidido, reaproveitando o painel do dev e a tela dos Desafios)
