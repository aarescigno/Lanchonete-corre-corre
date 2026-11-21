# v12.8.4 — A espera sentada da área industrial sem pagar de novo (etapa correção)

**Situação:** aprovada
**Origem:** conversa de 21/11 (`docs/PROPOSTAS.md`, "a espera sentada da área industrial"): "ficar comprando cadeira de plástico, cadeira de plástico, cadeira de madeira, vai consumindo dinheiro como se comprasse do zero todos eles. [...] se comprar a cadeira de madeira, não deixa eu comprar mais a de plástico." Na escolha: a troca paga "a diferença com desvalorização, pagaria 45", o banquinho dá mais paciência e mais luxo, e o botão da cadeirinha some depois do banquinho.

## Objetivo
Na área industrial, a espera sentada vira uma escada de dois degraus: as cadeirinhas de plástico e, acima delas, os banquinhos de madeira, que valem mais. Quem já tem as cadeirinhas paga só a troca pelos banquinhos, e quem tem os banquinhos não volta (nem paga) para o plástico.

## Fora do escopo
- Os assentos da Avenida (sofás) e do Terraço (poltronas): compra única, nada muda.
- O desenho das cadeirinhas e dos banquinhos na espera e o ícone do cartão: nada muda.
- O que acontece com o assento na mudança de ponto (sai sem devolver): nada muda.

## Regras (decisões tomadas)
- **Hoje** (`INDUSTRIAL.assento`, `src/10-constantes.js`; `comprarInd`, `src/16-jogo.js`; `buildAssento`, `src/41-lojinha.js`): cadeirinhas R$ 60 e banquinhos R$ 90, os dois com a espera 15% mais devagar (`INDUSTRIAL.assento.slow`) e 1 ponto de luxo (`LUXO.assento`); dá para trocar de um para o outro à vontade, pagando o preço cheio a cada vez.
- **Valores:** `INDUSTRIAL.assento = { cadeira:{ nome:'Cadeirinhas de plástico', cost:60, slow:0.15 }, banco:{ nome:'Banquinhos de madeira', cost:90, troca:45, slow:0.2 } }` (o `slow` passa a ser de cada assento; o `slow` solto sai). `LUXO.assento.banco` passa de 1 para 2 (a cadeirinha continua 1). `assentoSlow(a)` devolve `INDUSTRIAL.assento[a].slow` para `cadeira` e `banco`.
- **Compras** (`comprarInd('assento', tipo)` no nível 2):
  - sem assento: cadeirinhas R$ 60, banquinhos R$ 90 (como hoje);
  - com as cadeirinhas: banquinhos por R$ 45 (`troca`: R$ 90 menos as cadeirinhas revendidas por 3/4 de R$ 60); comprar as cadeirinhas de novo não vale;
  - com os banquinhos: nada a comprar (`comprarInd('assento', 'cadeira')` devolve `false` e não cobra).
- **Cartão "Espera sentada"** (`buildAssento`): sem assento, os dois botões como hoje ("Cadeirinhas de plástico R$ 60", "Banquinhos de madeira R$ 90"); com as cadeirinhas, "Tem: Cadeirinhas de plástico" e **"Banquinhos de madeira R$ 45"**; com os banquinhos, **só** o botão "Tem: Banquinhos de madeira" (o das cadeirinhas some).
- **Modo dev:** com a lojinha de graça (`devLivre()`), os dois botões continuam e a troca vale nos dois sentidos, de graça (para assistir a cada assento); o "Ir para o ponto" da área industrial continua pondo os banquinhos.
- **Manual:** nada (a ficha `l-assento` não tem números).
- **Save:** nada novo; `up.assento` continua `'cadeira'` ou `'banco'`.
- **Versão:** `VERSAO` e `vtag` em v12.8.4; linha no `#ov-ver`: **"Na área industrial, os banquinhos de madeira valem mais que as cadeirinhas, e quem já tem as cadeirinhas paga só a troca."**

## Critérios de aceite
- **CA1** Na área industrial, sem assento, as cadeirinhas custam R$ 60 e os banquinhos R$ 90 → `smoke114` (1)
- **CA2** Com as cadeirinhas, comprar os banquinhos tira R$ 45 do dinheiro e põe `up.assento = 'banco'` → `smoke114` (2)
- **CA3** Com os banquinhos, `comprarInd('assento', 'cadeira')` devolve `false`, o dinheiro não muda e o assento continua `'banco'` → `smoke114` (3)
- **CA4** Com as cadeirinhas, comprar as cadeirinhas de novo devolve `false` e não cobra → `smoke114` (4)
- **CA5** `assentoSlow('cadeira')` é 0.15 e `assentoSlow('banco')` é 0.2; o luxo de Móveis dos banquinhos é 1 ponto maior que o das cadeirinhas → `smoke114` (5)
- **CA6** No cartão "Espera sentada": com as cadeirinhas, o botão dos banquinhos diz "R$ 45"; com os banquinhos, o cartão tem um botão só, "Tem: Banquinhos de madeira" → `smoke114` (6)
- **CA7** No modo dev com a lojinha de graça, com os banquinhos, os dois botões aparecem e voltar às cadeirinhas vale, sem cobrar → `smoke114` (7)

## Partes
- `src/10-constantes.js`: `INDUSTRIAL.assento`, `LUXO.assento`, `assentoSlow`, `VERSAO`.
- `src/16-jogo.js`: `comprarInd` (e o comentário acima dele).
- `src/41-lojinha.js`: `buildAssento`.
- `src/12-clientes.js`: só o comentário da linha do `assentoSlow` na paciência (v12.8.4: a cadeirinha 15%, o banquinho 20%).
- `src/02-telas.html`: `vtag`, `#ov-ver`.

## Tarefas
- [ ] T1 `smoke114` com CA1 a CA7 (falhando), no `run_all.sh`.
- [ ] T2 Constantes: `INDUSTRIAL.assento` com `slow` por assento e `troca`, `LUXO.assento.banco: 2`, `assentoSlow`.
- [ ] T3 `comprarInd`: a escada (sem assento: preço cheio; cadeirinhas → banquinhos: `troca`; banquinhos → cadeirinhas: não vale, só com `devLivre()`).
- [ ] T4 `buildAssento`: o preço da troca no botão dos banquinhos e o botão das cadeirinhas some com os banquinhos (fora do `devLivre()`).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões), `docs/RESUMO.md`, a linha na tabela Situação do `docs/PLANO.md` (fica com as 3 últimas feitas), o destino no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O `tests/carreira.js` compra só as cadeirinhas (`INDUSTRIAL.assento.cadeira.cost`) e o `tests/balance.js` põe `assento='cadeira'`: continuam valendo; rode `DIAS=50 node carreira.js 3 | tail` uma vez para ver que nada quebrou (sem alvo novo).
- O `shopBtn` recebe o preço como último argumento (o som e a animação do dinheiro): passe o mesmo preço que o rótulo mostra (45 na troca).
- Para o CA6, monte a lojinha na aba das Melhorias no nível 2 e procure o cartão pelo `data-ficha="l-assento"`.

## Testes
- `smoke114` novo, no `run_all.sh`.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (correção pequena com valores, textos e testes já decididos, em três partes)
