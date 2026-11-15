# v11.7 — A roupa da Bia por ponto (etapa 8g)

**Situação:** entregue em 15/11
**Origem:** `docs/ARCO.md` §10 e §12 (roteiro fechado na entrevista de 14/11; pedido em `docs/PROPOSTAS.md`); etapa 8g do `docs/PLANO.md`. Aprovada em 15/11.

## Objetivo
A Bia muda de roupa com o ponto: do avental florido da mãe na Garagem ao colete com a rosa no Terraço. O jogador vê a casa crescer nela: no boneco do salão, no retrato do balão, na lojinha e na Missão zero. Vale com ou sem Modo História.

## Fora do escopo
- As reações da Bia durante o dia (v11.8). Do `docs/ARCO.md` §11 em diante: nada.
- Tênis e bandeja da lojinha: continuam aparecendo como hoje. Falas e gatilhos: não mudam.

## Regras (decisões tomadas)
Copiadas de `docs/ARCO.md` §10, sem mudança. A roupa vem do `nivel` do ponto (`game.ponto.nivel`; no Turno sem fim e na Missão zero, a Garagem), no boneco do salão, no retrato, no ícone da lojinha e na tela de menu. A abertura (cena do banco, a Bia da Garagem) fica sempre com a roupa 1.
| Ponto | Roupa | Cabelo |
|---|---|---|
| Garagem (1) | camiseta e o avental de pano florido da mãe (rosas miúdas) | solto, como hoje |
| Área industrial (2) | avental liso da cor da casa, com "Corre-Corre" bordado no peito | preso num rabo |
| Avenida (3) | camisa de botão da casa, mangas dobradas, avental de cintura | rabo alto |
| Terraço (4) | colete escuro com uma rosa bordada na lapela, camisa clara, avental de cintura escuro | coque |
- As cores saem da paleta que o `drawBia` já usa; as novas (colete `#2F3A4A`, rosa `#D9486E`) entram ao lado dela (`BIA_ROUPA_COR`).
- **Modo dev:** "Roupa da Bia": Normal, 1, 2, 3 ou 4 (aba Hoje; `DEV.forca.roupa`, só na memória), para ver qualquer uma em qualquer ponto.
- **Manual / Save:** não mudam.
- **Capturas a olhar:** a Bia parada e andando com bandeja em cada ponto, ampliada 4×; o retrato com cada roupa.

## Critérios de aceite
- **CA1** (`roupaBia(g)`: 1 a 4 pelo `nivel` do ponto; o modo dev força 1 a 4 por cima; sem forçar, o ponto; treino e Turno sem fim: 1) → `smoke83` (CA1)
- **CA2** (`drawBia` desenha as 4 roupas, parada e andando, sem erro; cada roupa dá um desenho diferente das outras) → `smoke83` (CA2)
- **CA3** (a roupa 4 usa o colete `#2F3A4A` e a rosa `#D9486E`; as roupas 1 a 3 não usam o colete; a roupa 1 tem o florido, a 2 o bordado "Corre-Corre") → `smoke83` (CA3)
- **CA4** (a roupa vale no retrato da Bia, na tela Retratos e na abertura: a abertura fica com a roupa 1 em qualquer ponto; o retrato segue o ponto) → `smoke83` (CA4)
- **CA5** (modo dev: a linha "Roupa da Bia" com 5 botões na aba Hoje; `devRoupa` força e volta ao normal; só com o modo dev ligado) → `smoke83` (CA5)
- **CA6** (o que se vê) → captura `shot_v11_7.js`: a Bia parada e andando com bandeja em cada ponto, 4×; o retrato com cada roupa; a grade dos retratos
- **CA7** (`node carreira.js` com a História chega ao Fim como antes; nada de jogo mudou) → `DIAS=120 node carreira.js 10`

## Partes
- `src/20-desenho-base.js`: `BIA_ROUPA`, `BIA_ROUPA_COR`, `roupaBia`, `drawBia` (e a rosa/florido/bordado como funções pequenas).
- `src/25-abertura.js`: `abBia` fixa a roupa 1.
- `src/26-conversa.js`: `drawRetrato` (a roupa do retrato; ajuste de `RETRATO_POSE.bia` para o peito aparecer).
- `src/23-render.js` e `src/41-lojinha.js`: a roupa do ponto atual no boneco do salão, na tela de menu e no ícone da lojinha.
- `src/16-jogo.js` (`devRoupa`), `src/40-interface.js` (linha na aba Hoje), `src/43-telas.js` (`window.__lcc`), `src/10-constantes.js` (`VERSAO`).

## Tarefas
- [x] T1 Smoke novo `tests/smoke83.js` (CA1 a CA5), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 `roupaBia`, `BIA_ROUPA_COR` e as 4 roupas no `drawBia`, com a abertura fixa na roupa 1.
- [x] T3 O retrato e a tela Retratos com a roupa; ajuste de enquadramento.
- [x] T4 Modo dev: `devRoupa` e a linha "Roupa da Bia".
- [x] T5 `tests/shot_v11_7.js`; capturas olhadas em recorte e ajustadas.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PLANO.md` (8g feita, texto arquivado), esta spec como entregue, `tests/run_all.sh` verde, commit local.

## Testes
- `tests/smoke83.js` (novo, 26 checagens, CA1 a CA5); `tests/shot_v11_7.js` (CA6).
- Smokes antigos: nenhum precisou mudar.
- Medido: `tests/run_all.sh` com saída 0; `DIAS=120 node carreira.js 10`: capítulos 1 a 14 e o Fim em 10 de 10, banco em 0 de 10.

## Decisões em aberto
Nenhuma.

## Desvios
- O smoke foi escrito junto do código (o `drawBia` com as roupas saiu antes da primeira rodada), então não foi visto falhar antes; as checagens comparam o que o `drawBia` pinta (cores e textos anotados por um contexto que grava as chamadas), não só "não dá erro".
- A roupa se escolhe por `drawBia(..., { roupa })` (sem `roupa`, a 1), não por uma variável global: `roupaBia(g)` é chamada em cada ponto de desenho (salão, menu, retrato, lojinha); a abertura passa `roupa:1`.
- Cores e formas decididas no desenho (a roupa pede só as duas cores novas): camisa de botão `#1F4FA3` (azul da faixa da casa), avental de cintura da Avenida `PAL.alerta`, avental do Terraço `#1B1F27` com debrum creme, saia escura `#2B2B33` (Avenida) e `#3B4252` (Terraço), pano florido `#F7EFD8` com as rosas `#D9486E` e folhinhas `#4F9F6A`. O "Corre-Corre" são duas linhas ("Corre-" e "Corre") para caber no peito, e o texto não vira ao contrário quando ela anda para o outro lado. O lenço amarelo fica só na Garagem; o rabo da área industrial e o da Avenida balançam ao andar.
- O retrato da Bia ganhou enquadramento mais aberto (`RETRATO_POSE.bia`: escala 1,75, pés 40; antes 2,3 e 46) para o peito (florido, bordado, botões, colete e rosa) aparecer; o rosto fica um pouco menor e o cabelo no alto (puff, rabo alto, coque) é cortado pelo círculo.
- O ícone da lojinha e o menu também usam a roupa do ponto (o menu, a do último ponto do save).
- Modo dev: a linha "Roupa da Bia" ficou na aba Hoje (como a do Luxo), com Normal, 1, 2, 3 e 4; vale na hora, sem esperar o próximo dia.

**Modelo:** Sonnet, esforço alto (desenho, conferido por captura)
