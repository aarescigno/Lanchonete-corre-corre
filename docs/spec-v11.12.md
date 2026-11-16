# v11.12 — A conversa da primeira nota baixa (pedido de jogador)

**Situação:** entregue em 15/11
**Origem:** conversa, 15/11 (pedido do usuário: na 1ª vez que a nota for 2 estrelas ou menos, no Gúgou ou nas estrelas do fim da fase (16/11), a Bia pergunta ao Tonhão por que se esforçou tanto e não agradou a todo mundo, e ele responde que é a vida e o importante é melhorar a cada dia)

## Objetivo
Quem fecha um dia com nota ruim (no Gúgou ou nas estrelas do fim da fase) não fica sozinho com o número: a Bia desabafa e o Tonhão a consola, sem dizer o que fazer. Só acontece uma vez.

## Fora do escopo
- Conversa para a nota geral (a de várias noites) ou para notas baixas seguintes: só a 1ª vez.
- Restringir pelas estrelas a só 0 ou 1: se disparar demais, é só baixar `HIST_NOTA.estrelas` de 2 para 1.
- Dica de como melhorar a nota: o Tonhão consola, não ensina (o Manual e a lojinha já cobrem).

## Regras (decisões tomadas)
- **Gatilho:** no `finishDay` (`src/16-jogo.js`), no Modo História (`histLiga()` e `sv.histV === 1`), se `!tomou`, `!sv.convNota` e **uma das duas** vale, então `sv.convNota = 'pend'`: (a) as **estrelas do fim da fase** (`stars`, de 0 a 3, a nota da meta do dia) são `<= HIST_NOTA.estrelas` (2); ou (b) a nota **do dia** no Gúgou (`avDia`, a média das avaliações do dia) tem `avDia.n >= HIST_NOTA.n` (3) e `Math.round(avDia.nota * 10) / 10 <= HIST_NOTA.ate` (2,0). Sem 3 estrelas na meta do dia, a conversa toca na 1ª vez (na prática, quase sempre no 1º dia); só um dia de 3 estrelas com nota boa no Gúgou a adia.
- **Quando toca:** em `fluxoHistoria` (`src/43-telas.js`), na lista `passos`, logo depois da 2ª chance do banco (antes das demais). Entra na regra de `CONV_MAX` (2 por fim de dia); o que sobrar espera o dia seguinte. Ao acabar (ou "Pular"), `sv.convNota = 1`.
- **Falas** (`HIST_NOTA` em `src/10-constantes.js`, `falas`):
  1. Bia, `insegura`, nota "olhando a nota no Gúgou": "Eu me esforcei tanto hoje, tio... e não agradei todo mundo. Por quê?"
  2. Tonhão: "É a vida, Bia. Prato que agrada a cidade inteira não existe."
  3. Tonhão, `firme`: "O importante é melhorar um pouquinho a cada dia."
  4. Bia, `firme`: "Então amanhã eu faço melhor."
- **Modo dev:** a cena entra em `devCenas` ("Nota baixa, 1ª vez"); `devConversas('vistas')` marca `convNota = 1` e o outro modo (`pend`) põe `convNota = 'pend'` se ainda não foi vista.
- **Manual:** sem mudança.
- **Save:** campo novo `convNota` (0 | 'pend' | 1), normalizado em `normSave` (`src/12-clientes.js`) como os outros `conv*`. Save antigo entra com 0: a conversa toca na 1ª nota baixa depois de atualizar. A troca de capítulo do modo dev (`devCap`) não mexe nele.

## Critérios de aceite
- **CA1** antes de qualquer nota baixa, `convNota` é 0; um dia com nota 2,0 ou menos no Gúgou (3 ou mais avaliações) deixa `convNota === 'pend'` e a conversa toca no fim do dia → `smoke87`
- **CA2** a conversa tem 4 falas (Bia, Tonhão, Tonhão, Bia) e, ao passar todas, `convNota === 1` → `smoke87`
- **CA3** dia com nota 2,1 ou mais, ou com menos de 3 avaliações, não dispara; depois de vista (1), uma nota baixa nova não toca de novo → `smoke87`
- **CA4** sem o Modo História nada dispara; `normSave` normaliza o campo e o save antigo carrega com 0 → `smoke87`
- **CA5** a cena aparece em `devCenas` → `smoke87`
- **CA6** dia de 0, 1 ou 2 estrelas dispara mesmo com nota boa no Gúgou; dia de 3 estrelas com nota boa, ou sem avaliações, não; depois de vista pelas estrelas, não toca de novo → `smoke87`

## Partes
`src/10-constantes.js` (`HIST_NOTA`), `src/12-clientes.js` (`normSave`), `src/16-jogo.js` (`finishDay`, `devConversas`), `src/43-telas.js` (`fluxoHistoria`, `devCenas`, `window.__lcc`), `src/10-constantes.js` (`VERSAO`), `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [x] T1 `tests/smoke87.js` com os critérios (falhando) e entrada no `run_all.sh`.
- [x] T2 `HIST_NOTA`, campo `convNota` no `normSave` (`12-clientes.js`), gatilho no `finishDay`, passo em `fluxoHistoria`, `devCenas` e `devConversas`.
- [x] Fechamento: `VERSAO` v11.12, `vtag`, `#ov-ver` (e a lista esperada no `smoke86`), `docs/RESUMO.md`, esta spec como entregue, `tests/run_all.sh` verde.

## Testes
`smoke87` (novo, 21 checagens); `smoke86` (lista de versões passa a começar na v11.12, com os índices da v9 e v10 deslocados) e `smoke64` (`devCenas` passa de 14 para 15 cenas avulsas).

## Decisões em aberto
Nenhuma.

## Desvios
Pedido do usuário em 16/11, ainda na v11.12 (sem merge): o gatilho passou a valer também para as estrelas do fim da fase (CA6, `HIST_NOTA.estrelas`). Como passou a tocar quase todo fim de dia 1, ganhou o interruptor `HIST_NOTA.on` (padrão ligado) e o `tests/harness.js` o desliga nos testes antigos (`opts.notaBaixa` liga; só o `smoke87` liga), para não atropelar os smokes das outras conversas. Fora isso, nenhum nas regras de jogo. O `normSave` fica em `src/12-clientes.js`, e não em `10-constantes.js` como o plano supunha (corrigido em Partes). No teste, as conversas do arco e as do dia 6 (cardápio, entrega...) precisam estar marcadas como vistas, senão tocam antes da conversa da nota.

**Modelo:** Sonnet, esforço médio (mudança pequena, com texto e valores já decididos)
