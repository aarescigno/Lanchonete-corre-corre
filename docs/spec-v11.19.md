# v11.19 — A 3ª estrela do Michelzão ao alcance (etapa 12)

**Situação:** entregue em 17/11
**Origem:** questionário de 17/11 (respostas no `docs/PROPOSTAS.md`, entrada "o que vem depois do final novo"): "Sim, mas difícil" e, depois da medida, "Baixar a régua"; Etapa 12 do `docs/PLANO.md`.

## Objetivo
Quem joga muito bem consegue a 3ª estrela do Michelzão, e com ela as cenas a mais do final. Hoje ninguém consegue: medido em 17/11 com o bot afiado, 0 de 12 carreiras chegam a ela, e a melhor noite faz 70,5 pontos de 90. A noite fica como está; só a régua da 3ª estrela baixa.

## Fora do escopo
- A noite da estrela em si (a lotação, a meta, o crítico, o Bráulio) e as réguas da 1ª e da 2ª estrelas (44 e 66) não mudam.
- O equilíbrio geral, que espera o retorno dos jogadores (`docs/JOGADORES.md`).

## Regras (decisões tomadas)
- **A régua:** `NOITE.cortes` passa de `[44, 66, 90]` para `[44, 66, 75]` (X = 75, calibrado pelo CA2 na primeira tentativa).
  - Medido em 17/11, com 12 carreiras de 120 dias do bot afiado: com X em 72, 75% das carreiras chegam à 3ª estrela na melhor marca; com X em 78, 0%.
- **Quem já jogou:** a régua nova vale da próxima noite em diante. O `save.guia.est` guardado não é recalculado, porque o save não guarda os pontos.
- **Modo dev:** nada novo (a noite e o final por estrela já têm entrada).
- **Manual:** nada muda (as fichas não têm números).
- **Save:** nada muda.
- **Versão:** `VERSAO` e `vtag` passam a `v11.19`. No `#ov-ver`, a linha da v11.18 dá lugar à da v11.19 com "versão atual" e o texto "A 3ª estrela do Michelzão ficou ao alcance de quem joga muito bem." A v11.18 fica logo abaixo, sem "versão atual".

## Critérios de aceite
- **CA1** (`NOITE.cortes` é `[44, 66, X]`; `guiaEstrelas(X)` dá 3, e `guiaEstrelas(X - 0,5)` e `guiaEstrelas(66)` dão 2) → `smoke96` (CA1)
- **CA2** (com o bot afiado, a 3ª estrela sai na melhor marca de 25% a 40% das carreiras) → `BOT=afiado DIAS=120 node carreira.js 12`, rodado duas vezes (24 carreiras), linha `MICHELZAO`, "melhor marca no fim: 3".
  - Antes de mudar o `src/`, teste com `NOITE_CFG='{"cortes":[44,66,X]}'`.
  - Acima de 40%: suba X em 1. Abaixo de 25%: baixe X em 1. Fique entre 72 e 78.
  - Se nenhum X der a faixa, escolha o que mais se aproxima de 1 em 3 e anote nos Desvios.
- **CA3** (o bot comum é só medido, sem alvo: anote a "melhor marca no fim: 3" dele com o X escolhido) → `DIAS=120 node carreira.js 12`, rodado duas vezes
- **CA4** (a noite segue como era: o `smoke75` verde, ajustado só onde esperava o 90) → `smoke75`

## Partes
- `src/10-constantes.js` (`NOITE.cortes`, `VERSAO`), `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [x] T1 Smoke novo `tests/smoke96.js` (CA1), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 A calibração do CA2 com o `NOITE_CFG`, o X no `src/` e a medida do CA3.
- [x] T3 O `smoke75` ajustado onde esperava o 90 (anotar quantas checagens mudaram).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (a medida nova da noite), esta spec como entregue, `tests/run_all.sh` verde.

## Avisos para a execução
- **Duração da medida:** cada `carreira.js 12` com `DIAS=120` leva uns 4 minutos. Rode duas de uma vez em segundo plano (a máquina tem 4 núcleos).
- **Smokes do número da versão:** os que conferem a lista de versões ou a versão do servidor de mentira (`smoke86` e `smoke95`) mudam com o número novo, como nas v11.17 e v11.18.

## Testes
`smoke96` novo (CA1); `carreira.js` com o bot afiado e o comum (CA2 e CA3); `smoke75` ajustado (CA4); `tests/run_all.sh` verde. No fechamento: o X escolhido, as porcentagens medidas do afiado e do comum, e quantas checagens tem o `smoke96`.

## Decisões em aberto
Nenhuma.

## Desvios
- **X = 75, sem ajuste.** Medido antes de mudar o `src/`, com `NOITE_CFG='{"cortes":[44,66,75]}'` e `DIAS=120 node carreira.js 12` duas vezes: bot afiado, "melhor marca no fim: 3" em 25% e 50% (9 de 24, 37,5%, dentro de 25% a 40%); bot comum (só medido), 42% e 42% (10 de 24, 41,7%).
- **`smoke96`:** 4 checagens (CA1). **`smoke75`:** 5 checagens mudaram (os cortes `44,66,75`; `guiaEstrelas` em 74,5 e 75; a noite de 75 pontos, que agora dá 3 estrelas; a melhor marca 1 → 3; o rótulo "3 estrelas no Michelzão"). **`smoke86`** (27 linhas na lista, "versão atual" e selo na v11.19) e **`smoke95`** (o servidor de mentira passou a v11.20, porque v11.19 virou a versão atual) mudaram com o número novo.
- Nenhum desvio de regra.

**Modelo:** Sonnet, esforço médio — um número calibrado por regra, um smoke curto e uma medida longa de bot.
