# v12.8.3 — As turmas da espera sem toque trocado (etapa correção)

**Situação:** entregue em 21/11
**Origem:** conversa de 21/11 (`docs/PROPOSTAS.md`, "toque trocado na espera"): "A turma mais abaixo sempre se sobrepõe um pouco à turma de cima. Então, se eu toco nos pés da turma imediatamente acima, eu vou selecionar ainda a área da turma de baixo. [...] Tem um grupo de 4 em cima e um grupo de 2 embaixo. Eu acabo mandando o grupo de 2 para a mesa de 4 lugares." Na escolha, o usuário ficou com "a de cima até os pés".

## Objetivo
Tocar ou arrastar uma turma da espera pega sempre a turma que está ali: nos pés, nas pernas ou no corpo de uma turma, quem responde é ela, e não a turma de baixo.

## Fora do escopo
- O desenho da espera (os lugares `QUEUE.ys`, o espaço entre as turmas, a ordem de desenho): nada muda.
- A área de toque das mesas, das estações e do conserto: nada muda.

## Regras (decisões tomadas)
- **Hoje** (`queueRect`, `src/12-clientes.js`): cada turma tem `{ x:QUEUE.x - 74, y:QUEUE.ys[slot] - 76, w:148, h:90 }` (dos corações até 14 px abaixo dos pés). Os lugares ficam a 80 px na Garagem, 64 px na área industrial e ~51 px na Avenida e no Terraço, então as áreas de duas turmas vizinhas se cruzam em 10, 26 e ~39 px; o `pickAt` olha a fila do lugar 0 (o de baixo) para cima e, no empate (acerto exato nas duas), fica a de baixo.
- **Agora:** quando há turma no lugar de cima (`g.game.queue[g.slot + 1]`), a área da turma começa onde a de cima termina: `y = max(QUEUE.ys[slot] - 76, QUEUE.ys[slot + 1] + 14)`, com a altura encolhida na mesma conta (o fundo continua em `QUEUE.ys[slot] + 14`). Sem turma em cima, a área é a de hoje. A turma de cima fica com a área inteira dela.
- Valem o toque, o arrasto (os dois começam no `pickAt`) e a seta da Missão zero (`treinoGrupoR` e o alvo do passo "Arraste até a mesa", que usam `queueRect`).
- **Modo dev:** nada novo (correção de toque; o "Ir para o ponto" já leva à Avenida e ao Terraço, onde a sobreposição era maior).
- **Manual e save:** nada.
- **Versão:** `VERSAO` e `vtag` em v12.8.3; linha no `#ov-ver`: **"Tocar nos pés de uma turma da espera não pega mais a turma de baixo."**

## Critérios de aceite
- **CA1** Na Avenida, com uma turma no lugar 1 e outra no lugar 2, o toque em `(QUEUE.x, QUEUE.ys[2] + 6)` (os pés da de cima) pega a turma do lugar 2 → `smoke113` (1)
- **CA2** No mesmo caso, o toque em `(QUEUE.x, QUEUE.ys[1] - 20)` (o corpo da de baixo) pega a turma do lugar 1 → `smoke113` (2)
- **CA3** Sem turma no lugar 2, o toque em `(QUEUE.x, QUEUE.ys[1] - 70)` (os corações da turma do lugar 1) pega a turma do lugar 1 (a área inteira, como antes) → `smoke113` (3)
- **CA4** Em cada ponto (Garagem, área industrial, Avenida, Terraço), com a espera cheia, as áreas de duas turmas vizinhas não se cruzam, e cada uma tem pelo menos 40 px de altura → `smoke113` (4)
- **CA5** Na Garagem, arrastar a turma de cima pelos pés até uma mesa livre senta essa turma (e não a de baixo) → `smoke113` (5)

## Partes
- `src/12-clientes.js`: `queueRect`.
- `src/10-constantes.js` e `src/02-telas.html`: `VERSAO`, `vtag`, `#ov-ver`.

## Tarefas
- [x] T1 `smoke113` com CA1 a CA5 (falhando), no `run_all.sh`.
- [x] T2 `queueRect` com o corte e o comentário (v12.8.3).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões), `docs/RESUMO.md`, a linha na tabela Situação do `docs/PLANO.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A fila do jogo (`g.queue`) tem a turma do lugar `i` no índice `i` (o `reslot` faz `g.slot = i`), então a turma de cima é `g.game.queue[g.slot + 1]`.
- O `smoke` pode usar `g.spawn({ type, color:0, vip:false })` com `g.schedule = []` e chamar `g.pickAt(x, y, 0)` direto; para o arrasto, `onDown`/`onMove`/`onUp` com `g.cam = 0` (tela = mundo).

## Testes
- `smoke113` novo, no `run_all.sh`: 9 checagens. Medido: as áreas da espera cheia ficam com 80 px na Garagem, 64 na área industrial e 51 na Avenida e no Terraço, sem cruzar.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões (29). `menu_fit.py`: 742 conferências, 0 falhas.

## Decisões em aberto
Nenhuma.

## Desvios
- `queueRect` passou a ser exposto no `window.__lcc` (o CA4 do `smoke113` mede as áreas).
- O `smoke86` achava a linha da v9 pelo índice fixo (19): passou a achar pelo nome.
- Falhas antigas, da v12.8.2 (os cartões de entretenimento também nas Melhorias), que o resumo do `run_all.sh` não mostrava: `smoke12`, `smoke15`, `smoke33`, `smoke38` e `smoke72` ainda esperavam a TV e som e as TVs fora das Melhorias; agora esperam os cartões lá (o `smoke15` conta as melhorias sem os cartões de entretenimento). Só testes, o jogo não mudou.
- A tabela Situação do `docs/PLANO.md` ficou com 4 feitas: a linha da 16b-1 foi para o `docs/PLANO-FEITO.md`.

**Modelo:** Opus, esforço alto (o usuário pediu para executar na mesma sessão do plano, por ser pequena)
