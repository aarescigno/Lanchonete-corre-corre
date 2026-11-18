# v12.4 — O Teste com o máximo de cada ponto e a equipe do jeito que quiser (etapa 14d)

**Situação:** entregue em 18/11
**Origem:** conversa de 18/11: "O teste com 'tudo liberado' tem que ser por fase, não é pra ter Cami na área industrial. É pra ter todos os recursos disponíveis no máximo do nível testado. Outro ponto importante é poder configurar como quiser os funcionários, tipo as funções da Cami no Terraço ou da Dani na área industrial." Decisões do usuário em 18/11: a Garagem passa a ter a Dani; o Terraço fica como no capítulo 11 (sem a gerência da Cami e sem o molho da Rosa); os Desafios também passam ao máximo do ponto (e são recalibrados); na tela do Teste se escolhe quem vem e as funções, e todos ficam no nível máximo.

## Objetivo
Cada fase do Teste (e cada Desafio) passa a ter exatamente o que a campanha dá naquele ponto, tudo no máximo: as pessoas, os cursos, as melhorias, a decoração. Antes de jogar uma fase do Teste, quem testa escolhe quem da equipe vem e o que cada um faz, e o relatório diz a equipe usada, para comparar jogadores com a mesma equipe.

## Fora do escopo
- Escolher o nível de cada ajudante (decisão de 18/11: todos no máximo do ponto).
- Configurar a equipe nos Desafios: eles usam a equipe padrão do ponto (abaixo).
- O bot humano: 14b.

## Regras (decisões tomadas)
### O máximo do ponto (substitui o `maximo:true` atual da `montaCap`)
- Vale para o Teste e para os Desafios. É o que a campanha libera até o **ponto** da linha `cap` da `DEV_CAPS` (o `nivel` do ponto) e até o **capítulo** `cap` (as travas por capítulo: a gerência da Cami e o molho da Rosa só a partir do 12). Uma função nova `maxDoPonto(sv, cap)` em `src/16-jogo.js`, chamada pela `montaCap` no lugar do `equipeModo('max')` + `melhoriasTodas(true)` + Lia e Anselmo no máximo. O `equipeModo('max')` e o "Tudo no máximo" do painel do dev **não mudam**.
- **Equipe** (só quem a campanha tem no ponto, no nível mais alto que o ponto e o capítulo permitem):
  - Garagem: Tonhão 4, Dani 4.
  - Área industrial: Tonhão 4, Dani 4, Joca 4.
  - Avenida Brasil: Tonhão 4, Dani 4, Joca 4, Cami 3, Anselmo 2.
  - Terraço Suíça (cap 11): Tonhão 4, Dani 4, Joca 4, Cami 4, Anselmo 3, Lia 1. Com cap 12 ou mais (os Desafios Noite do crítico e VIPs exigentes, cap 13): Cami 5 (gerente, com "Organiza a fila" ligado) e o molho da Rosa.
- **Cursos:** todos os de `CURSOS` (no nível 2), `DANI_CURSOS`, `JOCA_CURSOS`, `CAMI_CURSOS` e `ANSELMO_CURSOS` com `nivel` até o do ponto e `cap` (quando houver) até o capítulo, e só das pessoas que estão no ponto. Os itens que vêm dos cursos acompanham (`devSegueCursos`).
- **Melhorias e compras do ponto:** tudo o que a lojinha venderia no ponto (`UPGRADES` com `nivel` até o do ponto, e o `maquina` do ponto pelo `porNivel`), no grau mais alto (os de várias compras, como `pratos`, no máximo de compras). Fora da `UPGRADES`:
  - Garagem: TV e som ligados.
  - Área industrial: fogão industrial, o assento `banco` (Banquinhos de madeira) e as TVs no modo 2 ("sem anúncios").
  - Avenida Brasil: o sofá da espera e o couvert com a taxa.
  - Terraço Suíça: a louça fina, as poltronas e a música no modo 1 (Trio de cordas).
- **Decoração:** todos os itens de `DECOR` com `nivel` até o do ponto; o jogo de mesas (`MOVEIS`) mais alto do ponto; o enfeite da mesa do ponto. Respeitar os limites que a lojinha impõe (se houver vagas, as de mais efeito primeiro, pela ordem da lista).
- **Salão e divulgação:** como hoje (o salão cheio de mesas de 4 com a arrumação automática; a divulgação nas Redes sociais).
- **Fases do Teste:** a `TESTES.garagem` perde o `mod.sem` (a Dani entra). As outras não mudam.
- **Desafios:** os `mod.sem`, `mod.up`, `mod.tvs` e o resto de cada Desafio continuam valendo por cima do máximo do ponto.
- **Regras corrigidas na entrega (decisão do usuário, 18/11):** com o máximo do ponto, o Jogo do Brasil e a Noite do crítico não tinham semente que servisse; o usuário decidiu ajustar a meta e manter as sementes: `jogo` `mod.meta` 3 → **1,75** (semente 8505) e `critico` `mod.meta` 0,6 → **1,07** (semente 8603). As outras sementes saíram da varredura (tabela em Testes).
- **Regras corrigidas (execução):** o Jogo de pratos fica em 1 (a lojinha não tem teto); o fogão industrial (`up.fogaoInd`) vale do nível 2 em diante (Avenida e Terraço também, como na lojinha); `maxDoPonto` não tem a gerência da Cami nem a Rosa antes do cap. 12.

### A equipe padrão (o que cada um faz sem configurar)
- Garagem: Dani com `pratos`, `lavar`, `suco`.
- Área industrial: Joca com `lixo`, `lavar`, `pratos`; Dani com `cafe`, `doce`.
- Avenida e Terraço: Cami no modo `tarefas` com `lixo`, `lavar`, `pratos`, `suco`; Joca com o café (a vaga fixa do espresso); Dani com `doce`.
- As regras do jogo continuam as mesmas: as tarefas básicas ficam com o ajudante mais novo presente (`donoBasico`), e as listas se cortam pelo limite de cada nível e pelo `daniTaskOk`.

### A tela da fase (Teste)
- O toque numa fase na tela do Teste (`#ov-teste`) não começa mais o dia: abre a tela da fase, `#ov-teste-fase` (estado `'testefase'`), com:
  - o título **"Teste: <nome da fase>"**;
  - uma linha por ajudante do ponto (Dani, Joca, Cami, Anselmo, Lia, na ordem; o Tonhão sempre vem e não aparece), com o nome, um botão **"Vem"/"Não vem"** e, para quem vem, as funções:
    - Dani, Joca e Cami: os botões de tarefa com os rótulos curtos de `DANI_TASKS` (Lixo, Recolher, Lavar, Cafezinho, Água/Suco, Marmita, Doce), só os que a lojinha mostraria para aquela pessoa naquele ponto, com o mesmo limite de quantas ao mesmo tempo (no máximo do nível). Uma tarefa básica que, pela regra do `donoBasico`, ficaria com outro ajudante aparece apagada com a nota **"com o Joca"** ou **"com a Cami"**.
    - Cami, a partir da Avenida: o modo, com os botões **"Tarefas"**, **"Minhas mesas"** (Avenida e Terraço) e **"Ajuda em tudo"** (só Terraço). No "Minhas mesas", a Cami fica com as duas primeiras mesas do salão montado (`tables[0]` e `tables[1]`). As tarefas só aparecem no modo "Tarefas".
    - Anselmo e Lia: só o "Vem"/"Não vem".
  - os botões **"Jogar"** (classe `btn go`), **"Padrão"** (volta à equipe padrão da fase) e **"Voltar"** (à tela do Teste).
- A escolha fica guardada por fase no `lcc-teste` (chave `eq-<id da fase>`), e o "Jogar de novo" do fim do teste usa a mesma.
- O painel do dev (a seção "Teste de habilidade") também passa a abrir a tela da fase.
- O formato da equipe guardada: `{ dani:{ vem:1, tasks:[...] }, joca:{...}, cami:{ vem:1, modo:'tarefas'|'mesas'|'tudo', tasks:[...] }, anselmo:{ vem:1 }, lia:{ vem:1 } }`, normalizado ao abrir (pessoa que o ponto não tem sai; tarefa que não vale sai).

### O relatório
- O formato sobe para **3** (`LCC-TESTE 3 · ...`). Uma linha nova depois de `Jogador:`:
  `Equipe: Dani (cafezinho, doce) · Joca (lixo, lavar, recolher) · Cami não vem`
  Na ordem Dani, Joca, Cami, Anselmo, Lia, só quem o ponto tem; os nomes das tarefas em minúsculas, pelos rótulos curtos. A Cami fora do modo tarefas: `Cami (minhas mesas)` ou `Cami (ajuda em tudo)`. Anselmo e Lia: `Anselmo` ou `Anselmo não vem`.
- No relatório de um Desafio (modo dev), a mesma linha, com a equipe padrão.
- `ferramentas/relatorios.py` lê os formatos 1, 2 e 3; no resumo, a melhor tentativa de cada jogador mostra a linha `Equipe:`, e quando um jogador usou equipes diferentes na mesma fase, o resumo separa as tentativas por equipe.

### O bot e as ferramentas
- O bot joga com a equipe padrão. `TESTE_EQ='<json no formato da equipe guardada>'` no `balance.js` troca a equipe (para o `TESTE=<id>`).
- `docs/TESTES.md`: os números do bot nas 4 fases medidos de novo com a regra nova (`TESTE=<id> node balance.js 20`, comum e afiado), no lugar dos da v12.2.

### A recalibração dos Desafios
- Com o máximo do ponto, cada Desafio é medido de novo pela regra da v12.3 (CA4 da `docs/spec-v12.3.md`: bot comum com bronze ou mais em 40% a 70%; nos com `cond`, o afiado faz a `cond` valer em 30% ou mais; 200 rodadas):
  - primeiro a semente atual; se ela servir, fica;
  - senão, as sementes da faixa do desafio em ordem, de `8x01` a `8x20` (o `x` do desafio: 1 soBia, 2 semBravo, 3 efood, 4 junina, 5 jogo, 6 critico, 7 vips), ficando com a 1ª que servir;
  - se nenhuma servir, a de bronze mais perto de 55% entre as que cumprem a `cond` do afiado, anotada em Desvios; se nem essa ficar entre 25% e 85%, **a execução para e pergunta ao usuário**.

- **Modo dev:** a tela da fase já é do modo dev; o "Tudo no máximo" do painel continua igual.
- **Manual:** nenhuma ficha. **Save:** nada no save do jogo; as equipes ficam no `lcc-teste`.
- **Versão:** `VERSAO` e `vtag` em v12.4; linha no `#ov-ver`: **"O Teste e os Desafios trazem o que cada ponto tem, no máximo; no Teste, dá para escolher quem vem e o que cada um faz."**

## Critérios de aceite
- **CA1** O máximo do ponto: no Teste da Garagem há Tonhão 4 e Dani 4 e nenhum outro ajudante; na área industrial, Joca 4 e nenhuma Cami, Anselmo ou Lia; na Avenida, Cami 3 e Anselmo 2; no Terraço, Cami 4, Anselmo 3, Lia 1, sem `rosa` e sem o curso `gerente`; na Noite do crítico (cap 13), Cami 5 e `rosa`. Nenhum curso nem melhoria com `nivel` acima do ponto (ex.: a área industrial sem `restaurante`, `confGourmet`, `espresso`, `louca`); TV e som só na Garagem; couvert só na Avenida; música só no Terraço → `smoke103` (5)
- **CA2** A decoração e as compras do ponto: cada fase tem os itens de `DECOR` do ponto, o móvel mais alto do ponto, o enfeite do ponto, o fogão industrial e o banco na área industrial, o sofá na Avenida, a poltrona e o Trio no Terraço → `smoke103` (4)
- **CA3** A equipe padrão de cada fase é a das Regras (as listas de tarefas que de fato cada `Helper` faz no começo do dia) → `smoke103` (4)
- **CA4** A tela da fase: o toque numa fase abre `#ov-teste-fase` com uma linha por ajudante do ponto; "Não vem" tira a pessoa do dia (a equipe do dia não a tem); trocar uma tarefa muda a lista do `Helper` no dia; o limite de tarefas é respeitado; na Avenida, o modo "Minhas mesas" da Cami marca `tables[0]` e `tables[1]`; "Padrão" volta à equipe padrão; "Jogar" começa o teste → `smoke103` (6)
- **CA5** A equipe escolhida fica guardada por fase no `lcc-teste` e volta ao reabrir e no "Jogar de novo" → `smoke103` (2)
- **CA6** O relatório: `LCC-TESTE 3`, a linha `Equipe:` no formato das Regras (com uma pessoa que não vem, a Cami em "Minhas mesas" e o Anselmo); no Desafio, a linha com a equipe padrão; `relatorios.py` lê os formatos 1, 2 e 3 e mostra a equipe → `smoke103` (4)
- **CA7** `TESTE_EQ` no `balance.js` troca a equipe do bot → `smoke103` ou conferência manual anotada em Testes (1)
- **CA8** Cada Desafio com a semente recalibrada pela regra acima → `DESAFIO=<id> node balance.js 200` e `BOT=afiado DESAFIO=<id> node balance.js 200`; a tabela das sementes medidas na seção Testes
- **CA9** `smoke97` a `smoke102` seguem verdes, ajustados ao máximo do ponto e ao formato 3 onde for preciso (anotar em Testes) → `tests/run_all.sh`
- **CA10** A tela da fase cabe nos 14 tamanhos (a fase com mais gente: Terraço) → `python3 menu_fit.py` sem falhas; capturas da tela da fase na área industrial e no Terraço (desktop e celular deitado), conferidas e apagadas

## Partes
- `src/10-constantes.js`: `TESTES` (garagem sem `mod.sem`), `DESAFIOS` (as sementes novas), `VERSAO`, a equipe padrão por ponto (uma constante nova, ex. `TESTE_EQ_PADRAO`).
- `src/12-clientes.js`: as funções do `lcc-teste` (`testeTent`/`testeSobe`) ganham ler e gravar a equipe (`eq-<id>`).
- `src/16-jogo.js`: `montaCap` (o `maximo`), `maxDoPonto` nova, `comecaDesafio`/`startTeste` (aplicar a equipe escolhida), `setStaff`, `cursosTodos`, `melhoriasTodas`, `devSegueCursos` (para reaproveitar).
- `src/15-dani.js`: `donoBasico` e `Helper.tasks` (só ler; a regra não muda).
- `src/40-interface.js`: `buildTeste`, `devTeste`, `buildTesteFase` nova, `SCREENS`.
- `src/41-lojinha.js`: `buildDani`, `buildJoca`, `buildCami` (para reaproveitar os botões de tarefa ou a lógica do que mostrar).
- `src/42-resultados.js`: `testeRelatorio` (formato 3 e a linha `Equipe:`).
- `src/43-telas.js`: o estado `'testefase'`, os cliques, o "Jogar de novo".
- `src/02-telas.html`, `src/01-estilo.css`: o `#ov-teste-fase`.
- `tests/balance.js` (`TESTE_EQ`), `tests/menu_fit.py`, `ferramentas/relatorios.py`, `docs/RELATORIOS.md` (o exemplo no formato 3), `docs/TESTES.md`.

## Tarefas
- [x] T1 `tests/smoke103.js` com CA1 a CA7 (falhando), no `run_all.sh`.
- [x] T2 `maxDoPonto` e a `montaCap` com o máximo do ponto; a Garagem com a Dani.
- [x] T3 A equipe padrão e a equipe escolhida aplicadas no começo do dia (Teste e Desafio).
- [x] T4 A tela da fase, o `lcc-teste` com a equipe, o painel do dev e o "Jogar de novo".
- [x] T5 O relatório no formato 3, o `relatorios.py` e o `TESTE_EQ` do `balance.js`.
- [x] T6 A recalibração das sementes dos 7 Desafios (CA8) e os números novos do bot nas 4 fases no `docs/TESTES.md`.
- [x] T7 `menu_fit.py` com a tela da fase; capturas conferidas e apagadas.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (e os testes que contam as linhas), `docs/RESUMO.md`, `docs/PARTES.md`, a tabela Situação do `docs/PLANO.md` (14d feita), esta spec como entregue, `tests/run_all.sh` verde.

## Avisos para a execução
- O "máximo" hoje ignora o ponto em três lugares: `equipeModo('max')`, `cursosTodos(true)` e `melhoriasTodas(true)`. Não mude esses três (o painel do dev usa); escreva o `maxDoPonto` à parte, filtrando por `nivel`/`cap` como fazem `cursoOk`, `cursoDaniVis`, `upgradeCartoes` (41-lojinha.js) e a `normEquipe`.
- Com o modo dev no jeito Livre, a `normEquipe` não corta pessoas por ponto (`devLivre()`): o `maxDoPonto` tem de pôr em 0 quem o ponto não tem, sem depender dela.
- `toggleDaniTask` conta pelo `this.dani.tasks` do `Helper` vivo, não pela lista guardada: para a tela da fase, monte a lista e aplique no começo do dia.
- O `smoke42` tem uma checagem estatística de VIPs que já oscilava; se só ela falhar, rode de novo e relate.

## Testes
- **`smoke103`: 71 checagens** (CA1 a CA7, mais a checagem explícita do espresso e dos cafés especiais: `up.espresso` e `up.cafesEsp` falsos na Garagem e na área industrial, no Teste e nos Desafios; `up.espresso` só da Avenida em diante e `up.cafesEsp` só no Terraço). `run_all.sh` verde; `python3 menu_fit.py` sem falhas (a tela da fase na área industrial e no Terraço nos 14 tamanhos; a lista das Versões com 18 linhas).
- **Smokes antigos ajustados (CA9):** `smoke86` (18 linhas no `#ov-ver`, v12.4); `smoke97` (cursos e melhorias só até o nível do ponto); `smoke99` (o painel do dev abre a tela da fase e o "Jogar" começa o dia; Garagem com a Dani; relatório com 8 linhas e os índices deslocados; o CA4 da Garagem tira os ajudantes, porque a Dani limpava a mesa suja); `smoke100` (formato 3, linha `Equipe:`, faixa de 20 sementes); `smoke101` (clique na fase + "Jogar"); `smoke102` (formato 3, v12.4). `smoke98` sem mudança.
- **Sementes finais** (`DESAFIO=<id> node balance.js 200`, comum e `BOT=afiado`; a % varia uns pontos de uma rodada para outra):

| desafio | semente | mod.meta | bronze comum | bronze afiado | `cond` vale (afiado) |
|---|---|---|---|---|---|
| soBia | 8102 (mesma) | 1,2 | 50% | 97% | — |
| semBravo | 8205 (era 8202) | 0,6 | 66% | 96% | 96% |
| efood | 8308 (era 8316) | 0,65 | 59% | 65% | 91% |
| junina | 8408 (era 8406) | 2,8 | 48% | 77% | — |
| jogo | 8505 (mesma) | **1,75** (era 3) | 59% | 85% | — |
| critico | 8603 (mesma) | **1,07** (era 0,6) | 54% | 21% | 65% |
| vips | 8712 (era 8701) | 0,6 | 72% (70% e 71% nas outras medidas) | 69% | 100% |

- **A varredura (bronze do comum, 200 rodadas, 8x01 a 8x20):** semBravo: 8201 99, 8202 98, 8203 99, 8204 100, **8205 67**; efood: 8304 34, **8308 60**, 8305 91, 8306 99, 8310 100, 8311 87, 8314 100, o resto 0; junina: 8402 35, 8406 30, 8407 36, **8408 56**, 8414 69, 8412 73; vips: 8701 a 8711 todas de 83 a 100, **8712 70**, 8720 24; jogo: 0% em todas as 20; critico: 98% a 100% em todas as 20. As sementes antigas com o máximo novo: semBravo 8202 comum 96, efood 8316 0, junina 8406 34, vips 8701 99.
- **Jogo e crítico (decisão do usuário):** com a meta antiga, o jogo (8505) dava bronze 0% (meta 1590, lucro médio ~950) e o crítico (8603) 100%. Medidas pela `mod.meta`, semente 8505: 1,5 → 95%; 1,6 → 91%; 1,7 → 77%; 1,75 → 60%; 1,8 → 41%; 1,9 → 19%; 2,0 → 2%. Semente 8603 (comum; `cond` do afiado): 0,9 → 100% (54%); 1,0 → 86% (52%); 1,05 → 68% (53%); 1,07 → 53% (55%); 1,1 → 35% (57%); 1,2 → 1%. Valeram 1,75 (jogo) e 1,07 (crítico), as duas dentro da faixa na conferência final.
- **Números do bot nas 4 fases** (`TESTE=<id> node balance.js 20`, % da meta, mediana (p10 a p90); estrelas; perdidos), no lugar dos da v12.2: Garagem comum 216% (200 a 233), 2,9★, 0,1; afiado 249% (228 a 270), 3,0★, 0. Área industrial comum 225% (201 a 253), 2,4★, 0,7; afiado 263% (252 a 278), 3,0★, 0. Avenida comum 336% (261 a 415), 2,1★, 2,1; afiado 413% (392 a 432), 2,9★, 0,1. Terraço comum 356% (345 a 369), 2,8★, 0,2; afiado 351% (336 a 369), 3,0★, 0.

## Decisões em aberto
Nenhuma.

## Desvios
- **Jogo de pratos:** o "máximo de compras" ficou em 1 (a lojinha não tem teto: acumula sem limite).
- **Fogão industrial:** incluído do nível 2 em diante (também na Avenida e no Terraço), porque a lojinha o vende do 2 em diante e ele vai junto nas mudanças; a spec só o listava na área industrial.
- **Relatório:** quem vem sem nenhuma tarefa sai como `Dani (sem tarefa)`; as tarefas do relatório são as que o `Helper` de fato faz (na Avenida, `Joca (cafezinho)`; com a Cami fora, `Joca (cafezinho, lixo, lavar)`).
- **Tela da fase:** a tarefa básica guardada que fica com outro dono (Dani ou Joca) segue guardada, não conta para as vagas e aparece apagada com "com o Joca"/"com a Cami"; a equipe é gravada no `lcc-teste` a cada mudança (não só no "Jogar") e "Padrão" apaga a chave `eq-<id>`.
- **`relatorios.py`:** imprime "1 tentativas" (sem plural); o resumo separado por equipe diz "N tentativas em M equipes".
- **Meta de dois Desafios (decisão do usuário, 18/11):** nenhuma das 20 sementes do jogo (0%) nem do crítico (98 a 100%) servia, nem pelo fallback; o usuário mandou manter as sementes e ajustar `mod.meta` (jogo 3 → 1,75; crítico 0,6 → 1,07). Os dois ficaram na faixa na 1ª conferência, sem passos de 0,05.
- **vips (8712):** o bronze do comum ficou em 70% na varredura e em 71% e 72% nas reconferências (ruído; fora dos 70% por 1 ou 2 pontos). Não há outra semente na faixa (8701 a 8711 dão 83 a 100%), e ficou a 8712, a mais perto, anotada aqui.
- **Relato do usuário (v12.3.2):** "a máquina de cafés especiais ainda está na área industrial no modo teste". Na v12.4 o Teste e os Desafios não têm `up.espresso` nem `up.cafesEsp` antes da Avenida (nem `cafesEsp` antes do Terraço); checagem explícita no `smoke103`.

**Modelo:** Sonnet, esforço alto (regra nova em muitas partes, tela nova, relatório e a recalibração dos 7 Desafios)
