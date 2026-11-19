# v12.4.1 — O cabelo da Bia para trás quando ela anda (etapa correção)

**Situação:** entregue em 19/11
**Origem:** conversa de 19/11: "O cabelo da Bia na área industrial tá invertido: o rabo de cavalo, a parte mais alta, deveria ficar para trás, não para a frente, quando ela anda." Em `drawBia`, o lado +x é o lado para onde ela anda (`flip = dir`), e o puff baixo da roupa 2 estava em x = +16 (e o alto da roupa 3 em +5).

## Objetivo
Na área industrial (roupa 2) e na Avenida (roupa 3), o puff da Bia fica na nuca, atrás de onde ela anda.

## Fora do escopo
- A roupa 1 (o puff do alto, centrado) e a 4 (o coque, centrado).
- O resto do desenho da Bia.

## Regras (decisões tomadas)
- Espelhar no eixo x, em `drawBia` (`src/20-desenho-base.js`): roupa 2, o puff de `16 + ph2` para `-16 - ph2` e o elástico de x 9,2 para −9,2; roupa 3, o puff de `5 + ph2*0.5` para `-5 - ph2*0.5` e o elástico de x 3 para −3. Os y não mudam.
- Modo dev: nada novo (o painel já força a roupa, `DEV.forca.roupa`). Manual e save: nada.
- **Versão:** `VERSAO` e `vtag` em v12.4.1; linha no `#ov-ver`: **"Na área industrial e na Avenida, o cabelo preso da Bia fica para trás quando ela anda."**

## Critérios de aceite
- **CA1** Roupa 2, parada: o círculo do meio do puff (raio 6,2) e o elástico (raio 2,4) ficam em x < 0 → `smoke104` (2)
- **CA2** Roupa 3, parada: o círculo do meio do puff (raio 7,44) e o elástico (raio 2,3) ficam em x < 0 → `smoke104` (2)
- **CA3** Roupas 1 e 4: o cabelo continua centrado (o círculo do puff/coque em x = 0) → `smoke104` (2)

## Partes
- `src/20-desenho-base.js`: `drawBia` (cabeça e cabelo).
- `src/10-constantes.js` e `src/02-telas.html`: `VERSAO`, `vtag`, `#ov-ver`.

## Tarefas
- [x] T1 `tests/smoke104.js` com CA1 a CA3 (falhando), no `run_all.sh`.
- [x] T2 O espelho do puff e do elástico das roupas 2 e 3.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (e os testes que contam as linhas: `smoke86`, `menu_fit.py`), `docs/RESUMO.md`, esta spec como entregue, `tests/run_all.sh` verde.

## Avisos para a execução
- O `smoke72`/`smoke42` tem uma checagem estatística de VIPs que já oscilava; se só ela falhar, rode de novo e relate.

## Testes
- `smoke104`: 6 checagens (CA1 2, CA2 2, CA3 2), no `run_all.sh`.
- `smoke86` (19 linhas no painel de Versões, o link da v9 nas linhas 10 e 11, o selo v12.4.1), `menu_fit.py` (19 linhas), e `smoke102`/`smoke103`, que fixavam a v12.4 na 1ª linha do relatório e passaram a ler a `VERSAO`.
- `run_all.sh`: verde. Captura da Bia andando para os dois lados nas roupas 2 e 3: o puff fica na nuca, do lado de trás.

## Decisões em aberto
Nenhuma.

## Desvios
- O `smoke102` e o `smoke103` traziam o número da versão fixo; passaram a usar `L.VERSAO`, para não quebrar a cada versão.

**Modelo:** Haiku, esforço baixo (troca de quatro números e a versão; tudo decidido)
