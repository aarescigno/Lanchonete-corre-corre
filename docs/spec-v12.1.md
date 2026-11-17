# v12.1 — Desafios: festa, jogo, crítico e VIPs (etapa 13b)

**Situação:** aprovada (17/11)
**Origem:** questionário de 17/11 (respostas no `docs/PROPOSTAS.md`, entrada "o que vem depois do final novo"); Etapa 13 do `docs/PLANO.md`. Depende da v12 (`docs/spec-v12.md`) entregue.

## Objetivo
A tela de Desafios ganha os outros quatro da 1ª leva: a Festa junina lotada, o Jogo do Brasil, a Noite do crítico e os VIPs exigentes. Ficam sete ao todo, de bronze a ouro, como os da v12.

## Fora do escopo
- O motor, a tela, a medalha e o save dos desafios (são os da v12 e não mudam).
- Desafios novos além destes sete.

## Regras (decisões tomadas)
- **O dia** é o da v12: o save com "Tudo no máximo" (a equipe, os cursos, as melhorias e o salão cheio, com as Redes sociais), por cima da linha `cap`. Os `groups` da tabela abaixo são os de partida, antes do "Tudo no máximo"; a calibração do CA5 acerta os valores.
- **Os quatro novos**, depois dos três da v12 na `DESAFIOS` e na tela, nesta ordem:

| id | nome | cap (ponto) | dia | mod | cond |
|---|---|---|---|---|---|
| `junina` | Festa junina | 8 (Avenida) | 38 | `evento:'junina'`, `groups:1.25`, `meta:1.2` | nenhuma |
| `jogo` | Jogo do Brasil | 5 (área industrial) | 17 | `evento:'jogo'`, `up:['tvs']`, `tvs:1`, `groups:1.2`, `meta:1.2` | nenhuma |
| `critico` | Noite do crítico | 13 (Terraço) | 64 | `critico:true`, `groups:1`, `meta:1` | o crítico sai com 5 corações e sem ir embora bravo |
| `vips` | VIPs exigentes | 13 (Terraço) | 64 | `vip:1`, `groups:0.8`, `meta:1` | toda mesa sai com 4 corações ou mais e ninguém vai embora bravo |

- **Os textos:**

| id | aviso | falhou | ficha do Manual |
|---|---|---|---|
| `junina` | Festa junina lotada: o bairro inteiro veio! | — | A festa junina na Avenida, com mais gente que nunca e a meta lá em cima. |
| `jogo` | Jogo do Brasil e a casa cheia de torcedor! | — | O dia do jogo na área industrial: antes e depois, casa cheia; durante, rua vazia. A meta é alta. |
| `critico` | O crítico do Michelzão vem hoje. Ninguém sabe qual mesa é a dele. | O crítico não saiu com todos os corações. | Um dia no Terraço com o crítico à mesa. Ele tem de sair com todos os corações. |
| `vips` | Hoje só vem gente exigente. | Uma mesa saiu descontente. | Um dia no Terraço só de clientes exigentes. Toda mesa tem de sair feliz. |

- **O que cada `mod` faz:**
  - **`evento`:** o evento de bairro do dia, forçado como o modo dev força, sem sorteio e sem a regra do `EVENTOS.dia`. Na `junina`, a barraca junina já vem montada, como se tivesse sido comprada na lojinha do dia.
  - **`up` e `tvs`:** a melhoria das TVs e as TVs ligadas com anúncios (`equipe.tvs` 1), para o `tvLigada` valer no jogo.
  - **`critico`:** a 1ª visita do crítico (como o "Crítico: Vem hoje" do modo dev), sem boato. O que conta é como o grupo dele sai: corações e se foi embora bravo.
  - **`vip`:** a chance de VIP de cada grupo fica em 1. No Terraço todo VIP é exigente. O que conta é o menor número de corações com que um grupo sai e se alguém foi embora bravo.
- **O alívio (decidido, só se a calibração pedir):**
  - **`critico`:** a regra passa a ser "4 corações ou mais". Os textos mudam para "O crítico não saiu feliz." e, na ficha, "Ele tem de sair feliz.".
  - **`vips`:** a regra passa a ser "ninguém vai embora bravo e toda mesa sai com 2 corações ou mais". Os textos mudam para "Uma mesa saiu brava." e, na ficha, "Nenhuma mesa pode sair brava.".
- **Modo dev:** nada novo. A linha "Desafios: Liberar | Ouro em todos | Zerar" da v12 passa a valer para os sete.
- **Manual:** as fichas `d-junina`, `d-jogo`, `d-critico` e `d-vips`, na aba Desafios.
- **Save:** nada muda (o `normDesafios` aceita os ids novos porque eles estão na `DESAFIOS`).
- **Versão:** `VERSAO` e `vtag` passam a `v12.1`. No `#ov-ver`, entra a linha da v12.1 com "versão atual" e o texto "Mais quatro desafios: a festa junina lotada, o jogo do Brasil, a noite do crítico e os VIPs exigentes."

## Critérios de aceite
- **CA1** (`DESAFIOS` com os sete na ordem, com os campos e valores das tabelas; a tela mostra sete cartões) → `smoke98` (CA1)
- **CA2** (`junina` e `jogo` começam com o evento do dia no ponto certo; na `junina`, a barraca montada; no `jogo`, `tvLigada` verdadeiro e o gol sorteado) → `smoke98` (CA2)
- **CA3** (`critico` começa com a visita do crítico, sem boato; a `cond` vale com ele saindo com 5 corações e falha com 4 ou bravo) → `smoke98` (CA3)
- **CA4** (`vips`: todo grupo é VIP exigente; a `cond` falha se um grupo sai com 3 corações ou bravo) → `smoke98` (CA4)
- **CA5** (a calibração: com o bot comum, cada um dá bronze ou mais em 40% a 70% das rodadas; com o bot afiado, a `cond` do `critico` e a dos `vips` valem em 30% ou mais) → `DESAFIO=<id> node balance.js 40` e `BOT=afiado DESAFIO=<id> node balance.js 40`.
  - Fora da faixa de bronze: mexa no `mod.meta` em passos de 0,05, entre 0,6 e 1,5.
  - **Também o `mod.groups`**, entre 0,4 e 1,4, em passos de 0,05. Na v12, o dia do desafio passou a ter "Tudo no máximo" (decisão do usuário de 17/11, ver `docs/spec-v12.md`), e com isso o movimento ficou ~2,2 vezes maior. Comece pelo `groups` da tabela dividido por 2,2: `junina` 0,55, `jogo` 0,55, `critico` 0,45, `vips` 0,4. A `junina` e o `jogo` ficam com o `groups` acima do `critico` e dos `vips`, para continuarem os dias mais cheios.
  - Na v12, 40 rodadas oscilavam muito: decida com 200 (`DESAFIO=<id> node balance.js 200`). Rode o `run_all.sh` ou o `./extract.sh` antes do `balance.js`, porque ele lê o `tests/game.js`.
  - `cond` abaixo de 30%: primeiro desça o `groups`; depois aplique o alívio da regra.
  - Se ainda assim não couber, pare e avise.
- **CA6** (a tela com sete cartões cabe nos 14 tamanhos) → `python3 menu_fit.py`
- **CA7** (o que se vê) → captura `shot_v12_1.js`, em 1220 x 600 e 844 x 390, conferida em recorte:
  - a tela com os sete;
  - a introdução de cada um dos quatro;
  - um momento de cada dia: a barraca, a TV com o jogo, o crítico à mesa e o salão de exigentes.

## Partes
- `src/10-constantes.js`: `DESAFIOS` (os quatro), as fichas, `VERSAO`.
- `src/16-jogo.js`:
  - o `startDesafio` e o dia do desafio (o `evento`, a barraca, as TVs, o crítico e o `vip`);
  - a `cond` do `critico` e a dos `vips` (os corações de saída, onde o grupo sai: `Group` em `src/12-clientes.js`, perto da linha 398).
- `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke98.js` (CA1 a CA4), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 `junina` e `jogo`.
- [ ] T3 `critico` e `vips`, com as `cond`.
- [ ] T4 A calibração do CA5.
- [ ] T5 `menu_fit.py` (CA6) e `tests/shot_v12_1.js` com a conferência do CA7.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, a Etapa 13 arquivada, `tests/run_all.sh --tudo` verde.

## Avisos para a execução
- **O evento forçado:** o modo dev já força (`devForcaSorteio`: `so.ev`). O desafio faz o mesmo sem o `DEV`.
- **A barraca junina:** `barracaVisivel` e a compra na lojinha (`src/41-lojinha.js`, perto da linha 983) mostram onde ela fica guardada.
- **O crítico:** o `criticoDia` e o `DEV.forca.critico === 'hoje'` (`src/16-jogo.js`, perto da linha 193) mostram como a visita entra na agenda (`buildSchedule`, linhas 300 a 306).

## Testes
`smoke98` novo (CA1 a CA4); `balance.js` com `DESAFIO=<id>` (CA5); `menu_fit.py` (CA6); `shot_v12_1.js` (CA7, capturas apagadas depois); `tests/run_all.sh --tudo` verde. No fechamento: quantas checagens tem o `smoke98`, os `mod.meta` calibrados e se algum alívio entrou.

## Decisões em aberto
Nenhuma.

## Desvios
(no fechamento)

**Modelo:** Sonnet, esforço médio — quatro desafios em cima do motor da v12, com as regras e a calibração decididas.
