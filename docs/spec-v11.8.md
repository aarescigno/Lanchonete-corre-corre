# v11.8 — As reações da Bia durante o dia (etapa 8h)

**Situação:** entregue em 15/11
**Origem:** a etapa 8h do `docs/PLANO.md` e a §11 do `docs/ARCO.md` (entrevista de 14/11); aprovada em 15/11, sem decisão em aberto.

## Objetivo
A Bia deixa de ser um boneco que só anda: ela reage ao que acontece no salão com um gesto curto, quando uma mesa sai encantada, quando um grupo vai embora bravo e quando o dia fecha com a meta batida. O gesto muda com o ponto (insegura e aliviada na Garagem e na área industrial; firme e dona da casa na Avenida e no Terraço), mostrando o arco da personagem sem uma palavra de texto.

## Fora do escopo
- Reação da Bia a outras coisas (prato caindo, quebra, VIP): só as três do roteiro.
- Reação das outras pessoas da equipe: ficam para quando o usuário pedir.
- Som novo para os gestos: nenhum (os sons de moeda, bufada e vitória já tocam).

## Regras (decisões tomadas, `docs/ARCO.md` §11)
- Gestos de **0,8 s** (`BIA_REACAO.dur`), **sem efeito no jogo**: não param a Bia, não mudam tempo, dinheiro, fila nem nota de nada. São desenhados **por cima do andar** (pernas e sombra seguem normais; só braços, cabeça e rosto mudam). **Desligados com movimento reduzido** (`RM`: nada é disparado). Uma reação por vez; a nova substitui a anterior.
- **Quando dispara:**

| Quando | Garagem e área industrial (`nivel` 1 e 2) | Avenida e Terraço (`nivel` 3 e 4) |
|---|---|---|
| Uma mesa sai com todos os corações (`collectBill`, `g.hearts === 5`) → `'mesa'` | `sorriso`: sorriso surpreso e a mão no peito | `punho`: punho fechado para cima ("isso!") |
| Um grupo vai embora bravo, da mesa ou da fila (`angryLeave`) → `'bravo'` | `cabeca`: cabeça baixa por 0,8 s | `respira`: respira fundo e ergue a cabeça |
| O dia termina com a meta batida (carreira; no começo do banner de fim, `ending = true`, com `Math.round(lucro) >= meta`) → `'meta'` | `suspiro`: suspiro de alívio, ombros caindo | `cintura`: mãos na cintura, queixo erguido |

- O ponto vem de `game.ponto.nivel` (não da roupa forçada no modo dev). O grupo que sai parcial (`parcialLeave`) não conta como bravo.
- **Nomes no código:** `BIA_REACAO` (constante: `dur`, `por` = `{ mesa:['sorriso','punho'], bravo:['cabeca','respira'], meta:['suspiro','cintura'] }`) em `src/10-constantes.js`; `Waitress.reacao` (`{ id, t }` ou `null`), `Waitress.reage(tipo)` e `Waitress.reacaoAnda(dt)` em `src/14-bia.js`; `drawBia(ctx, b, x, y, { reacao:{ id, p } })` (`p` de 0 a 1) em `src/20-desenho-base.js`; `Game.devReacao(tipo)` em `src/16-jogo.js`. O relógio do gesto anda em `Game.update` antes de qualquer retorno antecipado (o gesto também roda com o painel do modo dev aberto) e `Waitress.reset()` o zera.
- **O que cada gesto desenha** (curva suave: sobe, fica e desce): `sorriso`: rosto "alegre" e a mão da esquerda no peito; `punho`: rosto "alegre", braço da direita para cima com o punho fechado e um pulinho; `cabeca`: cabeça desce, rosto "insegura", braços caídos; `respira`: peito sobe, cabeça sobe, braços um pouco abertos, rosto "firme"; `suspiro`: olhos fechados, boca em "o", ombros caindo; `cintura`: mãos na cintura (braços dobrados com cotovelo), queixo erguido, rosto "firme".
- **Modo dev:** na aba Hoje, uma linha "Reação da Bia" com três botões: "Mesa feliz", "Grupo bravo" e "Meta"; cada um dispara o gesto do ponto de agora (`game.devReacao`), na hora, em qualquer estado em que o salão apareça. Só com o modo dev ligado.
- **Manual:** sem mudança.
- **Save:** nenhum campo novo.

## Critérios de aceite
- **CA1** (`BIA_REACAO` com `dur` 0,8 e os 6 gestos; o gesto sai do `nivel` do ponto: 1 e 2 dão o primeiro de cada par, 3 e 4 o segundo) → `smoke84` (CA1)
- **CA2** (uma mesa que paga com 5 corações dispara `'mesa'`; com menos de 5, nada; um grupo que sai bravo dispara `'bravo'`; o dia que fecha com a meta batida dispara `'meta'` e o que não bate, nada; a nova reação substitui a anterior; nada disso muda dinheiro, `lucro`, `stats` nem a posição ou as ações da Bia) → `smoke84` (CA2)
- **CA3** (o gesto dura 0,8 s: `reacaoAnda` apaga a reação ao fim; `reage` com movimento reduzido não dispara; `reset` zera) → `smoke84` (CA3)
- **CA4** (`drawBia` desenha os 6 gestos, com as 4 roupas, parada e andando, sem erro; cada gesto dá um desenho diferente dos outros e do sem gesto; em `p` 0 e 1 o desenho é igual ao sem gesto) → `smoke84` (CA4)
- **CA5** (modo dev: a linha "Reação da Bia" com 3 botões na aba Hoje; `devReacao('mesa'|'bravo'|'meta')` dispara o gesto do ponto; recusa tipo inválido; sem o modo dev não faz nada) → `smoke84` (CA5)
- **CA6** (o que se vê) → captura `shot_v11_8.js`: os seis gestos, ampliados 4×, parados e com a Bia andando
- **CA7** (`node carreira.js` com a História chega ao Fim como antes; nada de jogo mudou) → `DIAS=120 node carreira.js 10`

## Partes
- `src/10-constantes.js`: `BIA_REACAO` (e `VERSAO`).
- `src/14-bia.js`: `reset`, `reage`, `reacaoAnda`.
- `src/16-jogo.js`: `update` (relógio do gesto), `collectBill`, `angryLeave`, o ponto em que `ending` vira `true` (carreira) e `devReacao`.
- `src/20-desenho-base.js`: `drawBia` (o gesto por cima, com a opção `reacao`).
- `src/23-render.js`: passa `reacao` ao `drawBia` do salão.
- `src/40-interface.js`: a linha "Reação da Bia" na aba Hoje. `src/43-telas.js`: `window.__lcc` (`BIA_REACAO`).

## Tarefas
- [x] T1 Smoke novo `tests/smoke84.js` (CA1 a CA5), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 `BIA_REACAO`, `Waitress.reage`/`reacaoAnda`/`reset` e o relógio no `Game.update`.
- [x] T3 Os três gatilhos (`collectBill`, `angryLeave`, começo do `ending`) e `devReacao`.
- [x] T4 `drawBia` com os 6 gestos e `render` passando a reação.
- [x] T5 Modo dev: a linha "Reação da Bia".
- [x] T6 `tests/shot_v11_8.js`; capturas olhadas em recorte (4×) e ajustadas.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PLANO.md` (8h feita, texto arquivado), esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O `smoke83` compara chamadas do `drawBia` sem gesto: o código novo só pode agir quando `o.reacao` existir (nenhuma chamada nova sem ele).
- O fim do dia: o gatilho `'meta'` fica onde `ending` vira `true` (dois lugares: `'time'` e `'done'`), quando já não há grupo no salão e o lucro está fechado.

## Testes
- `tests/smoke84.js` (novo, CA1 a CA5); `tests/shot_v11_8.js` (CA6).
- Smokes antigos: nenhum deve mudar.
- `tests/smoke84.js`: 31 checagens. Medido: ver abaixo.

## Decisões em aberto
Nenhuma.

## Desvios
- O smoke foi escrito antes do código e visto falhar (travou no primeiro `reage`, que ainda não existia).
- O 6º critério (capturas) foi conferido em recorte 4×, nas 4 roupas, paradas e andando; no salão o recorte ao redor da Bia não pegou o boneco (o gesto é o mesmo da folha), então a conferência do gesto andando e parado ficou pela folha.
- O braço dobrado (cintura) ganhou um ramo próprio no `drawBia` (ombro, cotovelo, mão), sem tocar no desenho dos braços retos, para o `smoke83` seguir igual.
- O suspiro ganhou três bolinhas claras de sopro saindo da boca (para se distinguir da cabeça baixa); o `punho` tem um pulinho do tronco (`dBob`).
- O relógio do gesto anda com `dt` limitado a 0,05 s e também com o jogo pausado (o gesto do modo dev roda com o painel aberto).

**Modelo:** Sonnet, esforço alto (animação nova, conferida por captura)
