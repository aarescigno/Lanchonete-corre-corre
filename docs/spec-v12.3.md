# v12.3 — Desafios com os mesmos clientes para todos (etapa 14c)

**Situação:** aprovada (17/11)
**Origem:** conversa de 17/11, depois da spec v12.2 ("Os desafios devem ter semente padrão também [...] fica mais fácil de se comparar dessa forma"); Etapa 14 do `docs/PLANO.md`.

## Objetivo
Cada Desafio passa a ser sempre o mesmo dia: os mesmos clientes, na mesma ordem e com os mesmos pedidos, para todo jogador e em toda tentativa. Assim, medalhas e resultados ficam comparáveis entre jogadores e com o bot. No modo dev, o fim do desafio ganha o "Copiar relatório" do Teste de habilidade.

## Fora do escopo
- A semente na carreira, no Turno sem fim e na Missão zero: continuam sorteados.
- "Clientes novos" (sortear de novo um desafio): descartado em 17/11.
- O relatório para o jogador comum: só no modo dev (decisão de 17/11).
- Reajustar `groups` e `meta` dos desafios: a calibração troca a semente, não os valores (decisão de 17/11).

## Regras (decisões tomadas)
- **A semente de cada desafio:** campo novo `semente` em cada item da `DESAFIOS` (`src/10-constantes.js`). O valor de partida é a 1ª semente da faixa de cada um, e a final sai da calibração (CA4):

| id | faixa de sementes |
|---|---|
| `soBia` | 8101 a 8110 |
| `semBravo` | 8201 a 8210 |
| `efood` | 8301 a 8310 |
| `junina` | 8401 a 8410 |
| `jogo` | 8501 a 8510 |
| `critico` | 8601 a 8610 |
| `vips` | 8701 a 8710 |

- **Como a semente vale:** do mesmo jeito do Teste de habilidade (`docs/spec-v12.2.md`), pelo `comSemente`:
  - semente `S` na agenda do dia (`buildSchedule`);
  - `S * 1000 + i` no nascimento de cada grupo (`spawn`).

  Também saem da semente o que o desafio sorteia ao montar o dia: qual grupo é o crítico na Noite do crítico, os VIPs e o tipo forçado (`mod.tipo`/`mod.tipoP`). O resto do dia segue o sorteio normal.
- **As medidas do jogo** (`this.tm`, da v12.2) passam a correr também no desafio, para o relatório.
- **O relatório no fim do desafio, só no modo dev:**
  - Na tela `ov-desafio-fim`, com o `DEV.on`, entra o botão "Copiar relatório" ao lado de "Tentar de novo" e "Desafios".
  - O botão faz o mesmo do Teste: copia, mostra "Copiado! Cole na conversa." ou, se a cópia falha, a caixa com o texto. Fora do modo dev, a tela fica como está.
  - O texto é o do `testeRelatorio`, com duas diferenças:
    - a 1ª linha é `LCC-TESTE 1 · v12.3 · Desafio: Só a Bia · dia 17 · semente 8101`;
    - logo depois da linha `Resultado:` entra a linha `Desafio: medalha de bronze · regra valeu`. A medalha é `sem medalha`, `bronze`, `prata` ou `ouro`; a regra é `valeu`, `não valeu` ou `—` (sem `cond`).
  - A tentativa é contada no mesmo `lcc-teste`, com a chave `d-<id>` (ex.: `d-soBia`), a cada começo do desafio, com ou sem o modo dev.
- **As medalhas já ganhas** ficam como estão (não se zeram).
- **`ferramentas/relatorios.py`:** lê também os blocos de desafio e agrupa por "Desafio: <nome>". Com `--bot`, roda `DESAFIO=<id> node balance.js 20`.
- **Modo dev:** o "Copiar relatório" no fim do desafio (acima). O resto do painel dos Desafios fica igual.
- **Manual:** sem mudança.
- **Save:** sem campo novo.

## Critérios de aceite
- **CA1** Cada item da `DESAFIOS` tem `semente` dentro da sua faixa. O mesmo desafio, começado duas vezes com chamadas de `Math.random` diferentes no meio, dá a mesma agenda (tipo, hora, cor, VIP, exigente) e os mesmos grupos (tamanho e pedidos dos 8 primeiros). Na Noite do crítico, o crítico é o mesmo grupo. Desafios diferentes dão agendas diferentes → `smoke100` (1)
- **CA2** No modo dev, o fim do desafio tem "Copiar relatório". O texto segue o formato das Regras, com a linha `Desafio:` certa para medalha, regra que valeu, regra que não valeu e desafio sem regra. Fora do modo dev, o botão não existe → `smoke100` (2)
- **CA3** A tentativa `d-<id>` sobe a cada começo do desafio e é separada da do Teste. As medalhas do save não mudam com a versão → `smoke100` (3)
- **CA4** A calibração por semente, com 200 rodadas → `DESAFIO=<id> node balance.js 200` e `BOT=afiado DESAFIO=<id> node balance.js 200`:
  - Para cada desafio, testar as sementes da faixa em ordem e ficar com a 1ª em que:
    - o bot comum dá bronze ou mais em 40% a 70%;
    - nos desafios com `cond` (`semBravo`, `efood`, `critico`, `vips`), o afiado faz a `cond` valer em 30% ou mais.
  - Se nenhuma das 10 servir, fica a de bronze mais perto de 55% entre as que cumprem a `cond` do afiado, anotada em Desvios.
  - Se nem essa ficar entre 25% e 85%, a execução para e pergunta ao usuário.
- **CA5** `smoke97` e `smoke98` (os Desafios da v12 e da v12.1) seguem verdes. Checagem que dependia do sorteio livre é ajustada à semente e anotada em Testes → `tests/run_all.sh`

## Partes
- `src/10-constantes.js`: o campo `semente` na `DESAFIOS`.
- `src/16-jogo.js`:
  - `startDesafio`, `buildSchedule` e `spawn`: a semente do desafio, pelo mesmo caminho do teste;
  - o sorteio do crítico do dia e o do VIP, se estiverem fora da agenda e do `spawn`;
  - `finishDesafio`: monta o relatório.
- `src/42-resultados.js`: `buildDesafioFim` (o botão no modo dev) e `testeRelatorio`, com a linha `Desafio:`.
- `src/02-telas.html`: o botão e a caixa no `#ov-desafio-fim`.
- `src/43-telas.js`: o clique.
- `ferramentas/relatorios.py`.

## Tarefas
- [ ] T1 `smoke100` com CA1 a CA3 (falhando), no `run_all.sh`.
- [ ] T2 A semente nos desafios (CA1), aproveitando o `comSemente` da v12.2.
- [ ] T3 O relatório no fim do desafio, no modo dev, e a tentativa `d-<id>` (CA2, CA3); `relatorios.py` com os desafios.
- [ ] T4 A calibração das sementes dos 7 desafios (CA4). A tabela final (semente, bronze comum, bronze afiado e `cond`) vai em Testes.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (os desafios agora têm semente: o `balance.js` do desafio passa a medir só a variação do jogo, não a do sorteio), esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Esta versão vem depois da v12.2: o `comSemente`, o `this.tm`, o `testeRelatorio` e o `lcc-teste` já existem. O teste e o desafio passam pelo mesmo `startDesafio`; a semente vem do `T.semente`/`D.semente` do que estiver rodando.
- Com a semente fixa, as 200 rodadas do bot variam bem menos que antes: a faixa de bronze pode ir a 0% ou 100% numa semente ruim. Por isso a calibração testa até 10 sementes. Rode as sementes de um desafio em sequência, trocando a semente em runtime: estenda o `DESAFIO_CFG` do `balance.js` (hoje faz `Object.assign(D.mod, ...)`) para pôr `semente` no item, e não no `mod` (`DESAFIO_CFG='{"semente":8102}'`).

## Testes
(No fechamento: quantas checagens o `smoke100` tem; a tabela das sementes finais com bronze comum, bronze afiado e `cond`; as checagens do `smoke97` e do `smoke98` que mudaram.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (o mecanismo vem pronto da v12.2; a calibração é rodar sementes em ordem, com a regra de parada decidida)
