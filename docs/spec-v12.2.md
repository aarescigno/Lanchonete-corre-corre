# v12.2 — Teste de habilidade: as quatro fases padrão e o relatório (etapa 14a)

**Situação:** aprovada (17/11)
**Origem:** conversa de 17/11 ("o bot está jogando bem demais [...] uma fase padrão de cada nível, com um relatório que eu possa copiar e colar aqui, para nivelar o bot com as minhas habilidades e as dos beta testers"); Etapa 14 do `docs/PLANO.md`.

## Objetivo
No modo dev, o tester joga um "Teste de habilidade": quatro fases padrão, uma por ponto, sempre com os mesmos clientes. No fim, copia um relatório com o resultado e com o jeito de jogar (tempos de reação, ritmo de toques, quanto a Bia ficou parada, aparelho) e cola na conversa. O bot joga as mesmas fases e escreve o mesmo relatório: é a régua para a 14b deixar o bot com habilidade de gente, não de robô.

## Fora do escopo
- O bot humano (`BOT=humano` e `BOT=medio`, com tempo de reação, toques por minuto e atenção limitada) e a calibração dele pelos relatórios: 14b, só nos testes (sem versão), depois de chegarem os relatórios.
- Rever o equilíbrio do jogo com o bot humano: fica na ideia guardada "Revisão geral de equilíbrio com o retorno dos jogadores".
- O teste no menu, nos Desafios ou para o jogador comum: só no modo dev (decisão de 17/11). Sem ficha no Manual, medalha, ranking nem linha no Caixa.

## Regras (decisões tomadas)
- **As fases** `TESTES` (`src/10-constantes.js`), no mesmo formato da `DESAFIOS` (o dia é montado como o de um Desafio, com `mod.groups` 1 e `mod.meta` 1), mais a `semente`:

| id | nome (na tela) | cap (`DEV_CAPS`) | dia | mod | semente |
|---|---|---|---|---|---|
| `garagem` | Garagem | 3 | 7 | `sem:['dani','joca','cami','anselmo','lia']` | 7001 |
| `industrial` | Área industrial | 5 | 17 | — | 7002 |
| `avenida` | Avenida Brasil | 8 | 38 | — | 7003 |
| `terraco` | Terraço Suíça | 11 | 58 | — | 7004 |

- **O dia do teste:** igual ao de um Desafio (`startDesafio`):
  - O save de mentira "Tudo no máximo" (equipe, cursos, melhorias, salão cheio, Redes sociais), que nunca se grava.
  - Na Garagem, sem ajudante: só a Bia e o Tonhão.
  - As metas e os grupos do dia do ponto, sem multiplicar.
  - Sem imprevistos, evento, crítico, noite da estrela nem história.
  - O turno é o do dia (220 s nas quatro, medido em 17/11), uns 4 minutos com o fechamento.
- **O modo dev não mexe no teste:**
  - Durante o teste, a velocidade (`DEV.vel`) fica em 1.
  - Os forçados de `DEV.forca` (VIP, apito, quebra, clima, fiscal, evento) não valem.
  - O dev pode encerrar o dia, mas o relatório sai com a linha `(encerrado no modo dev)`.
- **Os mesmos clientes:** com a semente `S` da fase, o sorteio sai do `semente()` (`src/11-base.js`) em dois momentos:
  - na agenda do dia (`buildSchedule`): semente `S`;
  - no nascimento de cada grupo (`new Group` no `spawn`): semente `S * 1000 + i`, com `i` a posição do grupo na agenda.

  Assim, o tipo, a hora de chegada, a cor, o VIP, o tamanho, as pessoas e os pedidos são os mesmos para todo mundo, em toda tentativa, no humano e no bot. O resto do dia (paciência que corre, comentários, o desenho) segue o sorteio normal.
- **O que o jogo mede** (só no teste, no humano e no bot pelas mesmas funções). Conta o tempo de jogo, sem a pausa, só com o relógio do turno correndo ou com a lanchonete fechando com gente dentro:
  - **Reação ao sentar:** o tempo que o grupo passa na fila com uma mesa livre que caiba (para o exigente, também sem salão bagunçado), até o `seatGroup` da Bia. O que a Cami gerente senta não conta.
  - **Reação ao pedido:** do grupo entrar em `wantOrder` até o 1º toque aceito naquela mesa (`tapTable` → `enqueue`).
  - **Reação à conta:** de `wantBill` até o 1º toque aceito na mesa.
  - **Reação à mesa suja:** de `dirty` até o 1º toque aceito na mesa.
  - **Reação ao prato:** do prato aparecer no balcão (`plates`, com o grupo à espera dele: `state === 'ordered'`) até o toque que o pega.
  - Em qualquer reação, o caso resolvido por ajudante (Dani, Joca, Cami, Lia) não entra na conta. O que ninguém resolveu até o fim também não.
  - **Ações:** os toques aceitos da Bia (`tapTable`, `tapStation` e `seatGroup` que dão certo), por minuto de turno.
  - **Toques perdidos:** o toque no salão que não acerta nada, mais os toques recusados (`tapTable`, `tapStation` ou `seatGroup` que devolvem `false`). Quem arrasta o grupo e solta fora de mesa também conta.
  - **Fila média:** a média do tamanho da fila de ações da Bia (`bia.acts.length`), quadro a quadro.
  - **Bia parada:** a fração do turno com a fila de ações vazia, a Bia sem andar e alguma coisa à espera dela:
    - um grupo na fila com mesa livre que caiba;
    - uma mesa em `wantOrder` ou `wantBill`, ou suja;
    - um prato no balcão para grupo em `ordered`.
  - **Aparelho:** `toque` se o último `pointerdown` do teste foi de dedo ou caneta (`pointerType` diferente de `mouse`), senão `mouse`. A tela é `innerWidth×innerHeight`. No bot: `bot` e `-`.
- **O relatório** (texto puro, vírgula decimal, uma linha por bloco, nesta ordem). A 1ª linha tem o número do formato (`1`) para a ferramenta ler sempre igual:
  ```
  LCC-TESTE 1 · v12.2 · Garagem · dia 7 · semente 7001
  Jogador: Ana · tentativa 3 · toque 412×915 · 17/11/2026 18:40
  Resultado: lucro R$ 263 · meta R$ 250 (105%) · ★★ · servidos 16 de 18 · Gúgou 3,8
  Perdidos: 2 · fila sem mesa 0 · fila com mesa 1 · pedido 0 · prato 1 · conta 0 · retirada 0 · esfriou 1
  Reação em s (média / mediana / casos): sentar 2,1 / 1,6 / 14 · pedido 3,4 / 2,8 / 16 · prato 2,9 / 2,2 / 22 · conta 3,0 / 2,5 / 15 · mesa suja 4,1 / 3,3 / 15
  Ritmo: 31,2 ações/min · 4 toques perdidos · fila média 1,8
  Bia parada: 22% do turno com coisa à espera
  ```
  - Sem caso, a reação sai `—`.
  - O Gúgou é a nota do dia (`avalMedias(this.avalsPeso())`); sem nota, `—`.
  - Estrelas pelo `estrelasDe`; sem estrela, `0★`.
  - Com o dia encerrado no modo dev, sai uma última linha `(encerrado no modo dev)`.
- **Nome e tentativa:**
  - O nome é o do Ranking (`LS.name`, `lastName()`); vazio, sai `sem nome`.
  - A tentativa é contada por fase, no aparelho, em `lcc-teste` no `localStorage` (`{ garagem:3, ... }`, pelo `lsGet`/`lsSet`). Não fica no save, e recomeçar do zero não a apaga.
  - Ela sobe ao começar a fase: quem sai no meio também gasta a tentativa.
- **No modo dev** (`buildDev`), a seção "Teste de habilidade", com estas peças:
  - o campo "Seu nome" (grava em `LS.name`, como a tela do Ranking, com o `cleanName`);
  - os botões Garagem, Área industrial, Avenida Brasil e Terraço Suíça, cada um com a tentativa já jogada (ex.: "Garagem (2)").

  O botão fecha o painel e vai à introdução do dia. O título é "Teste: Garagem", com a meta como nos Desafios, e o aviso: "Jogue um dia como sempre. No fim, copie o relatório e mande."
- **A pausa no teste:** a nota da pausa é "Se sair agora, não sai relatório." Sair volta ao menu, com o save de verdade.
- **O fim do teste** (`ov-teste-fim`, no lugar do resultado do dia):
  - O título "Teste: Garagem".
  - A linha "Lucro R$ 263 · ★★" (as estrelas como no fim do Desafio, sem medalha).
  - Os botões "Copiar relatório", "Jogar de novo" (a mesma fase, tentativa + 1) e "Voltar" (ao menu, com o save de verdade).
  - Ao copiar, a linha de aviso "Copiado! Cole na conversa.". Se a cópia falha, aparece "Não deu para copiar sozinho: selecione o texto abaixo." e uma caixa com o relatório selecionado, como o "Copiar resumo" do Caixa (`copyText`).
  - O relatório não aparece na tela se a cópia der certo (decisão de 17/11).
- **Nada do teste toca o save de verdade:** caixa, dia, estrelas, lucro acumulado, ranking, manutenção, Gúgou, guia e medalhas ficam como estavam. Só o `lcc-teste` e o `LS.name` mudam.
- **Para o bot:** `g.startTeste(id)` e `g.testeRel` (o texto do relatório depois do fim), expostos para os testes como o `startDesafio`.
- **Modo dev:** é onde o teste mora (a seção acima).
- **Manual:** nenhuma ficha (o teste é só do modo dev).
- **Save:** nenhum campo novo; o `lcc-teste` fica fora do save.

## Critérios de aceite
- **CA1** Fora do modo dev, nenhuma tela mostra o teste; no painel do modo dev, a seção "Teste de habilidade" tem o campo de nome e os 4 botões com a tentativa entre parênteses → `smoke99` (1)
- **CA2** O botão monta o dia da tabela, com estas conferências → `smoke99` (2):
  - o ponto, o dia, a meta do `diaPonto`;
  - na Garagem, a equipe zerada;
  - nos outros pontos, a equipe "Tudo no máximo";
  - sem clima, quebra, fiscal, evento ou crítico, mesmo com `DEV.forca` ligado;
  - `DEV.vel` em 1;
  - o `writeSave` nunca chamado com o save de mentira;
  - ao sair, o save de verdade igual ao de antes, campo a campo.
- **CA3** A mesma fase, começada duas vezes com chamadas de `Math.random` diferentes no meio, dá a mesma agenda (tipo, hora, cor e VIP de todos) e os mesmos grupos (tamanho e pedidos dos 8 primeiros). Fases diferentes dão agendas diferentes → `smoke99` (3)
- **CA4** As medidas, num dia roteirizado → `smoke99` (4):
  - um grupo em `wantOrder` tocado 2 s depois dá a reação de pedido 2,0;
  - o caso resolvido pela Dani não entra;
  - o toque no chão vazio e o toque recusado somam 2 toques perdidos;
  - a fila média e a Bia parada batem com o roteiro;
  - o `pointerType` `touch` dá `toque`.
- **CA5** O relatório segue o formato das Regras linha a linha (regex por linha, vírgula decimal, `—` sem caso) → `smoke99` (5):
  - o nome vem do `LS.name`;
  - a tentativa sobe a cada começo e é separada por fase;
  - o dia encerrado no modo dev ganha a última linha.
- **CA6** No fim, a tela `ov-teste-fim` mostra o título, o lucro e as estrelas → `smoke99` (6):
  - "Copiar relatório" chama o `copyText` com o texto do relatório;
  - na cópia que falha, aparece a caixa;
  - "Jogar de novo" recomeça a mesma fase;
  - "Voltar" vai ao menu com o save de verdade;
  - nenhuma medalha, ranking ou linha de Caixa.
- **CA7** O bot joga as 4 fases e escreve o relatório no mesmo formato. Sem erro, `TESTE=<id> node balance.js 20` mostra a média e a faixa (p10 a p90) de cada número do relatório, e `REL=1` imprime cada relatório. Os números do bot comum e do afiado (`BOT=afiado`) ficam anotados em Testes, como o ponto de partida da 14b → `TESTE=garagem node balance.js 20` (e as outras 3)
- **CA8** A tela `ov-teste-fim`, com a caixa do relatório aberta, cabe nos 14 tamanhos → `python3 menu_fit.py paineis`

## Partes
- `src/10-constantes.js`: `TESTES` e `TESTE_LS` (a chave `lcc-teste`), perto da `DESAFIOS`.
- `src/16-jogo.js`:
  - `startDesafio`: generalizar para o teste, com `startTeste(id)` chamando o mesmo caminho e marcando `this.teste`;
  - `diaDesafio` (com `mod.meta` e `mod.groups` 1);
  - `buildSchedule` e `spawn` (a semente);
  - `resetDay` (o objeto das medidas, `this.tm`);
  - `update` (fila média, Bia parada e o relógio das reações);
  - `seatGroup`, `tapTable`, `tapStation`, `onDown` (ações e toques perdidos; o arrasto que solta fora);
  - `finishDesafio`, com o fim do teste ao lado: `finishTeste`, que monta `this.testeRel` e vai a `'testefim'`.
- `src/12-clientes.js`, `Group.setState`: marca a hora de `wantOrder`, `wantBill` e do `leaving`. `src/16-jogo.js:661`: marca a hora da mesa suja.
- `src/40-interface.js`: `buildDev` (a seção) e a lista `SCREENS` (`ov-teste-fim`).
- `src/02-telas.html`: o `#ov-teste-fim`.
- `src/01-estilo.css`: o estilo do `#ov-teste-fim`, aproveitando o `desafio-fim-panel` e o `cx-txt`.
- `src/42-resultados.js`: `buildTesteFim` e `testeRelatorio(g)`, a função pura do texto.
- `src/43-telas.js`:
  - `hooks.state`: `'testefim'`, a introdução e a nota da pausa;
  - o `pointerdown`, que guarda o `pointerType`;
  - o `DEV.vel` travado em 1 no teste;
  - os botões da tela;
  - o `window.__lcc`, que passa a expor `TESTES` e `testeRelatorio`.
- `tests/balance.js` (`TESTE`, `REL`); `tests/menu_fit.py` (o painel).

## Tarefas
- [ ] T1 `smoke99` com os critérios de aceite CA1 a CA6 (falhando), no `run_all.sh`.
- [ ] T2 `TESTES`, `startTeste` sobre o caminho do `startDesafio`, a semente na agenda e no `spawn`, o modo dev neutralizado no teste (CA2, CA3).
- [ ] T3 As medidas (`this.tm`) e o `testeRelatorio` (CA4, CA5).
- [ ] T4 A seção no `buildDev`, a introdução, a pausa, o `ov-teste-fim` e os botões (CA1, CA6); `menu_fit.py` com o painel (CA8).
- [ ] T5 `balance.js` com `TESTE` e `REL`, rodado nas 4 fases com o bot comum e o afiado; números em Testes (CA7).
- [ ] T6 `docs/RELATORIOS.md` (o cabeçalho e como anexar) e `ferramentas/relatorios.py`:
  - lê os blocos `LCC-TESTE 1` do arquivo;
  - mostra, por fase e por jogador, a melhor tentativa (pelo lucro), a mediana e o número de tentativas;
  - com `--bot`, roda junto o `TESTE=<id> node balance.js 20` para comparar.

  No `CLAUDE.md`, a linha: "Relatórios do Teste de habilidade colados no chat vão para o fim do `docs/RELATORIOS.md` (por `cat >>`, sem reler), um bloco por relatório, como vieram."
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (o `TESTE`, o `REL` e o `relatorios.py`), esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O sorteio com semente: uma função `comSemente(seed, fn)` que troca o `Math.random` pelo `semente(seed)` só durante `fn` e devolve o original num `finally`. Assim, `rand`, `randi` e `pick` (`src/11-base.js`) entram sozinhos. O desenho, que também sorteia, fica de fora porque roda em outro momento.
- O teste reaproveita o caminho do Desafio (`montaCap` com `maximo:true`, `DESAFIO_EST.on`, `salvo`, `sairTreino`); o `smoke97` e o `smoke98` precisam continuar verdes. Onde o código pergunta `this.desafio` para coisa de medalha, o teste não entra.
- O bot chama `g.seatGroup`, `g.tapTable` e `g.tapStation` direto (sem `onDown`): as medidas ficam nessas funções, nunca no `onDown`, e o `onDown` só conta o toque no vazio.
- O `harness.js` não tem `pointerdown`: no bot, o aparelho é `bot` por padrão (`this.tm.aparelho` começa `'bot'`, e o `pointerdown` da página troca).

## Testes
(No fechamento: quantas checagens o `smoke99` tem; a tabela do bot comum e do afiado nas 4 fases, com a média e a faixa de: % da meta, estrelas, perdidos, as 5 reações, ações/min, fila média e Bia parada.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (reaproveita o motor dos Desafios, mas mede em muitos pontos do código, tela nova, bot e ferramenta)
