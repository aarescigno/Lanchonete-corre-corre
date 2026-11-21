# v12.8.4 — A espera sentada e o enfeite das mesas sem pagar à toa (etapa correção)

**Situação:** entregue em 21/11
**Origem:** conversa de 21/11 (`docs/PROPOSTAS.md`, "a espera sentada da área industrial"): "ficar comprando cadeira de plástico, cadeira de plástico, cadeira de madeira, vai consumindo dinheiro como se comprasse do zero todos eles. [...] se comprar a cadeira de madeira, não deixa eu comprar mais a de plástico." Na escolha: a troca paga "a diferença com desvalorização, pagaria 45", o banquinho dá mais paciência e mais luxo, e o botão da cadeirinha some depois do banquinho. Na mesma conversa, o usuário pediu para procurar o mesmo problema no resto da lojinha: o único outro caso é o enfeite das mesas (Galheteiro, Vela), que continua à venda depois das Toalhas de linho sem somar nada; na escolha, "some e devolve".

## Objetivo
Na área industrial, a espera sentada vira uma escada de dois degraus: as cadeirinhas de plástico e, acima delas, os banquinhos de madeira, que valem mais. Quem já tem as cadeirinhas paga só a troca pelos banquinhos, e quem tem os banquinhos não volta (nem paga) para o plástico. E, quando as toalhas de linho cobrem as mesas, o enfeite de cada mesa sai da lojinha e o que se pagou por ele volta pela metade.

## Fora do escopo
- Os assentos da Avenida (sofás) e do Terraço (poltronas): compra única, nada muda.
- O desenho das cadeirinhas e dos banquinhos na espera e o ícone do cartão: nada muda.
- O que acontece com o assento na mudança de ponto (sai sem devolver): nada muda.
- O resto da lojinha foi conferido e não tem o problema: as melhorias, os cursos, o jogo de mesas e a decoração não se compram duas vezes; os tênis e o jogo de mesas são escadas que cobram só o degrau novo; TV, som, TVs, couvert, música e divulgação são pagos por dia; o que fica na mudança é da história.
- O "Ir para o ponto" do modo dev (que põe o jogo de mesas e o enfeite em todas as mesas sem passar pela compra): nada muda.

## Regras (decisões tomadas)
- **Hoje** (`INDUSTRIAL.assento`, `src/10-constantes.js`; `comprarInd`, `src/16-jogo.js`; `buildAssento`, `src/41-lojinha.js`): cadeirinhas R$ 60 e banquinhos R$ 90, os dois com a espera 15% mais devagar (`INDUSTRIAL.assento.slow`) e 1 ponto de luxo (`LUXO.assento`); dá para trocar de um para o outro à vontade, pagando o preço cheio a cada vez.
- **Valores:** `INDUSTRIAL.assento = { cadeira:{ nome:'Cadeirinhas de plástico', cost:60, slow:0.15 }, banco:{ nome:'Banquinhos de madeira', cost:90, troca:45, slow:0.2 } }` (o `slow` passa a ser de cada assento; o `slow` solto sai). `LUXO.assento.banco` passa de 1 para 2 (a cadeirinha continua 1). `assentoSlow(a)` devolve `INDUSTRIAL.assento[a].slow` para `cadeira` e `banco`.
- **Compras** (`comprarInd('assento', tipo)` no nível 2):
  - sem assento: cadeirinhas R$ 60, banquinhos R$ 90 (como hoje);
  - com as cadeirinhas: banquinhos por R$ 45 (`troca`: R$ 90 menos as cadeirinhas revendidas por 3/4 de R$ 60); comprar as cadeirinhas de novo não vale;
  - com os banquinhos: nada a comprar (`comprarInd('assento', 'cadeira')` devolve `false` e não cobra).
- **Cartão "Espera sentada"** (`buildAssento`): sem assento, os dois botões como hoje ("Cadeirinhas de plástico R$ 60", "Banquinhos de madeira R$ 90"); com as cadeirinhas, "Tem: Cadeirinhas de plástico" e **"Banquinhos de madeira R$ 45"**; com os banquinhos, **só** o botão "Tem: Banquinhos de madeira" (o das cadeirinhas some).
- **Enfeite das mesas com o linho** (`buyMovel`, `buyToalha`, `buyToalhas`, `src/16-jogo.js`; o editor do salão, `src/41-lojinha.js`). Hoje, com as Toalhas de linho (`save.moveis.linho`), o luxo das mesas já vem cheio e o elogio do enfeite não conta, mas o enfeite (`TOALHA.cost` R$ 12 por mesa, campo `t`) continua à venda. Agora:
  - ao comprar o linho, toda mesa do salão e do estoque com enfeite o perde (`t` sai) e volta ao dinheiro metade do que custou: `Math.round(n × TOALHA.cost × TOALHA.devolve)`, com `TOALHA = { cost:12, devolve:0.5 }` (3 enfeites, R$ 18), numa linha negativa do Salão no Caixa (`caixaGasto(sv, 'sal', -v)`, como a venda de mesa);
  - com o linho, `buyToalha` e `buyToalhas` devolvem `false` sem cobrar;
  - no editor do salão, com o linho, saem o botão do enfeite no balãozinho da mesa (do salão e do estoque) e o botão "em todas", e a linha de baixo ("Galheteiro: R$ 12 por mesa; ...") vira **"As toalhas de linho cobrem todas as mesas."**
- **Modo dev:** com a lojinha de graça (`devLivre()`), os dois botões continuam e a troca vale nos dois sentidos, de graça (para assistir a cada assento); o "Ir para o ponto" da área industrial continua pondo os banquinhos.
- **Manual:** nada (a ficha `l-assento` não tem números).
- **Save:** nada novo; `up.assento` continua `'cadeira'` ou `'banco'`. Save antigo que já tem o linho e mesas com `t`: fica como está (o `t` não soma nada com o linho), sem devolver.
- **Versão:** `VERSAO` e `vtag` em v12.8.4; linha no `#ov-ver`: **"Os banquinhos de madeira valem mais que as cadeirinhas e a troca sai mais barata; com as toalhas de linho, o enfeite das mesas volta pela metade."**

## Critérios de aceite
- **CA1** Na área industrial, sem assento, as cadeirinhas custam R$ 60 e os banquinhos R$ 90 → `smoke114` (1)
- **CA2** Com as cadeirinhas, comprar os banquinhos tira R$ 45 do dinheiro e põe `up.assento = 'banco'` → `smoke114` (2)
- **CA3** Com os banquinhos, `comprarInd('assento', 'cadeira')` devolve `false`, o dinheiro não muda e o assento continua `'banco'` → `smoke114` (3)
- **CA4** Com as cadeirinhas, comprar as cadeirinhas de novo devolve `false` e não cobra → `smoke114` (4)
- **CA5** `assentoSlow('cadeira')` é 0.15 e `assentoSlow('banco')` é 0.2; o luxo de Móveis dos banquinhos é 1 ponto maior que o das cadeirinhas → `smoke114` (5)
- **CA6** No cartão "Espera sentada": com as cadeirinhas, o botão dos banquinhos diz "R$ 45"; com os banquinhos, o cartão tem um botão só, "Tem: Banquinhos de madeira" → `smoke114` (6)
- **CA7** No modo dev com a lojinha de graça, com os banquinhos, os dois botões aparecem e voltar às cadeirinhas vale, sem cobrar → `smoke114` (7)
- **CA8** Na Avenida, com o jogo de mesas até as cadeiras acolchoadas e 3 mesas com enfeite, comprar o linho tira R$ 600 e devolve R$ 18 (o dinheiro cai R$ 582), e nenhuma mesa (salão e estoque) fica com enfeite → `smoke114` (8)
- **CA9** Com o linho, `buyToalha` e `buyToalhas` devolvem `false` e o dinheiro não muda → `smoke114` (9)
- **CA10** Na aba Salão, com o linho, nenhum botão fala do enfeite ("Galheteiro") e aparece "As toalhas de linho cobrem todas as mesas."; sem o linho, o botão "Galheteiro em todas" continua → `smoke114` (10)

## Partes
- `src/10-constantes.js`: `INDUSTRIAL.assento`, `LUXO.assento`, `assentoSlow`, `TOALHA`, `VERSAO`.
- `src/16-jogo.js`: `comprarInd` (e o comentário acima dele), `buyMovel`, `buyToalha`, `buyToalhas`.
- `src/41-lojinha.js`: `buildAssento`; o editor do salão (os botões do enfeite e a linha de baixo).
- `src/12-clientes.js`: só o comentário da linha do `assentoSlow` na paciência (v12.8.4: a cadeirinha 15%, o banquinho 20%).
- `src/02-telas.html`: `vtag`, `#ov-ver`.

## Tarefas
- [x] T1 `smoke114` com CA1 a CA10 (falhando), no `run_all.sh`.
- [x] T2 Constantes: `INDUSTRIAL.assento` com `slow` por assento e `troca`, `LUXO.assento.banco: 2`, `assentoSlow`.
- [x] T3 `comprarInd`: a escada (sem assento: preço cheio; cadeirinhas → banquinhos: `troca`; banquinhos → cadeirinhas: não vale, só com `devLivre()`).
- [x] T4 `buildAssento`: o preço da troca no botão dos banquinhos e o botão das cadeirinhas some com os banquinhos (fora do `devLivre()`).
- [x] T5 O enfeite com o linho: a devolução no `buyMovel('linho')`, o bloqueio em `buyToalha` e `buyToalhas` e o editor do salão.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões), `docs/RESUMO.md`, a linha na tabela Situação do `docs/PLANO.md` (fica com as 3 últimas feitas), o destino no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O `tests/carreira.js` compra só as cadeirinhas (`INDUSTRIAL.assento.cadeira.cost`) e o `tests/balance.js` põe `assento='cadeira'`: continuam valendo; rode `DIAS=50 node carreira.js 3 | tail` uma vez para ver que nada quebrou (sem alvo novo).
- O `shopBtn` recebe o preço como último argumento (o som e a animação do dinheiro): passe o mesmo preço que o rótulo mostra (45 na troca).
- Para o CA6, monte a lojinha na aba das Melhorias no nível 2 e procure o cartão pelo `data-ficha="l-assento"`.

## Testes
- `smoke114` novo, no `run_all.sh`: 21 checagens.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões (30). `menu_fit.py`: 742 conferências, 0 falhas.
- `DIAS=50 node carreira.js 3`: as 3 carreiras chegam ao Terraço, sem dia no negativo nem empréstimo à força (o bot compra só as cadeirinhas).

## Decisões em aberto
Nenhuma.

## Desvios
- O enfeite das mesas com o linho entrou nesta versão a pedido do usuário, na mesma conversa ("pesquisa se isso acontece em algum outro lugar"); as Regras, os CA8 a CA10 e a T5 foram escritos antes do código.
- Ao comprar o linho, a lista de mesas do jogo (`buildTables`) é refeita quando algum enfeite sai, para o salão desenhado na lojinha não ficar com o enfeite antigo.
- A busca achou também a decoração com o mesmo luxo a preços muito diferentes (de R$ 8 a R$ 120 por 1 ponto; de R$ 25 a R$ 1.500 por 2). Não é o mesmo problema: o preço sobe com o ponto (o usuário confirmou que o luxo deve custar mais nos pontos mais altos), e os enfeites não são opções de um ou outro: somam juntos, e os 20 dão exatamente o teto da Decoração (25 pontos). Fica como está.
- Regra nova no `CLAUDE.md` (pedido do usuário): preço maior, benefício maior.
- Smokes antigos que esperavam o assento de antes: `smoke38` (a troca por R$ 45 e sem voltar ao plástico), `smoke42` e `smoke60` (o banquinho com 20%) e `smoke72` (a área industrial com tudo comprado dá 45 pontos de luxo, e não 44; continua no nível 2). Só testes.

**Modelo:** Opus, esforço alto (o usuário pediu para executar na mesma sessão do plano, por ser pequena)
