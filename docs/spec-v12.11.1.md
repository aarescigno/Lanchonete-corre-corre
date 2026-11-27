# v12.11.1 — A espera no seco e as pernas no sofá (etapa 19b)

**Situação:** aprovada (27/11)
**Origem:** retornos do usuário de 27/11 no `docs/PROPOSTAS.md`: "a espera da Avenida na chuva" e "as pernas no sofá da Avenida". Decisões fechadas com o usuário em 27/11 (Opus); a etapa 19 foi dividida em 3 versões (19a, 19b e 19c), uma por sessão.

## Objetivo
Na Avenida e no Terraço, quem espera fica no seco: a chuva aparece só nas janelas do fundo, com chuvisco e um relâmpago de vez em quando. No sofá da Avenida, as pessoas sentadas têm pernas.

## Fora do escopo
- Pernas nas poltronas do Terraço: ficam como estão (o retorno fala só da Avenida).
- A chuva na Garagem e na área industrial: a espera é na rua, e a chuva continua na calçada como hoje.

## Regras (decisões tomadas)
### A espera no seco (Avenida e Terraço)
- `chuvaNaRua(ponto)`: verdadeira na Garagem e na área industrial, falsa na Avenida e no Terraço. Com ela falsa, em dia de chuva a calçada (ou o foyer) não escurece, não tem poças, nem pingos do toldo, nem os pingos diagonais por cima de tudo (`drawChuvaFundo` e `drawChuvaPingos` não desenham nada ali).
- No lugar, `drawChuvaJanela(ctx, x0, y0, x1, y1, tm)`, recortado em cada janela do fundo: o céu escurece (`rgba(52,72,104,.35)`), um chuvisco de 12 riscos curtos e finos caindo devagar, e o relâmpago.
  - Avenida: a janela grande do `drawParedeAv` (x 104–176, y 10–62) e a janela do muro da calçada (`drawCalcada`).
  - Terraço: a vista da cidade (`drawVistaTe`, onde ela é desenhada no `drawParedeTe`).
- O relâmpago sai de `relampago(tm)` (de 0 a 1, sem estado, só do tempo: um clarão a cada 6 a 12 s, numa sequência fixa, com 0,25 s de duração): a janela clareia (branco até 0,7 de opacidade, apagando), um raio em zigue-zague aparece em uma das janelas, e a tela inteira ganha um clarão leve (branco a 0,10). Com movimento reduzido (`RM`), `relampago` dá sempre 0 (nem clarão nem raio) e o chuvisco fica parado.
- O jogo não muda: o dia de chuva continua com menos gente e mais entregadores; a ficha "Dia de chuva" do Manual fica como está.

### As pernas no sofá da Avenida
- No `render` (`src/23-render.js`), quem espera sentado no sofá da Avenida passa a ter pernas (`pernas` no `drawCluster`: a condição deixa de excluir a Avenida; o Terraço continua sem). Nada muda no sofá.

- **Modo dev:** na aba Hoje, com o clima do dia em chuva, botão novo **"Relâmpago agora"** (faz o `relampago` dar o clarão no mesmo instante, `DEV.relampago = tm`). O "Clima: Chuva" que já existe força a chuva.
- **Manual:** nada muda.
- **Save:** nada novo.

## Critérios de aceite
- **CA1** `chuvaNaRua` é falsa na Avenida e no Terraço e verdadeira na Garagem e na área industrial; `relampago` dá de 5 a 10 clarões em 60 s e, com movimento reduzido, sempre 0 → `smoke126` (1)
- **CA2** O modo dev tem o "Relâmpago agora" na aba Hoje em dia de chuva, e ele faz o `relampago` passar de 0 → `smoke126` (2)
- **CA3** O que se vê → captura `shot_v12_11_1.js` (960x540 e 844x390): a chuva da Avenida e do Terraço (calçada e foyer secos, chuvisco nas janelas, um quadro com relâmpago e um com movimento reduzido); a chuva da Garagem e da área industrial como antes; o sofá da Avenida cheio, com as pessoas de pernas (sem cobrir o número do lugar nem os corações de forma que não se leia)

## Partes
- `src/10-constantes.js`: `chuvaNaRua` (nova).
- `src/21-cenario.js`: `drawChuvaFundo`, `drawChuvaPingos`, `drawChuvaJanela` e `relampago` (novas), `drawParedeAv`, `drawCalcada`, `drawParedeTe`.
- `src/23-render.js`: a condição `pernas` da espera (linha do `drawCluster`, ~92) e o clarão da tela.
- `src/40-interface.js`: `devAbaHoje` (o "Relâmpago agora").
- `src/43-telas.js`: expor `chuvaNaRua` e `relampago` no `window.__lcc`.

## Tarefas
- [ ] T1 Smoke novo `smoke126` com os critérios de aceite (falhando) e no `tests/run_all.sh`.
- [ ] T2 A chuva nas janelas e o relâmpago (Avenida e Terraço), com o "Relâmpago agora" do modo dev.
- [ ] T3 As pernas no sofá da Avenida.
- [ ] T4 `shot_v12_11_1.js` (CA3): conferir em recortes ampliados, ajustar e apagar as capturas.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, os destinos no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Para ver quem espera no sofá numa captura: `g.up.assento = g.save.up.assento = 'sofa'` antes do `startDay`, e `g.spawn({ type, color:0, vip:false })` para cada grupo, esperando uns 9 s para chegarem; a chuva, com `g.clima = 'chuva'`.
- A troca das pernas é uma linha (`!avenida(g) && !terraco(g)` passa a `!terraco(g)`); conferida em captura no planejamento, ficou boa.

## Testes
- Smoke novo: `smoke126` (CA1 e CA2). Captura: `shot_v12_11_1.js` (CA3).
- Sem mudança no equilíbrio (só desenho).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (desenho novo com regras e coordenadas dadas, conferido em captura)
