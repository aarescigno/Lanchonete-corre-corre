# v9.6.6 — A pia, o lixo, a lavagem e os doces (etapa 3d-3)

Retornos do Renan de 01/11 (`docs/PROPOSTAS.md`).

## O que mudou
1. **Lavar prato a prato** (`Waitress.update`, ação `sink`): cada pilha volta limpa quando termina (`washPiles(1)`, "+1 prato", `Sfx.wash`); com outra ação na fila, a Bia para depois da pilha pronta e o resto fica na pia. "Lavou N pilhas!" conta as que lavou.
2. **Pia mais suja** (`drawKitchen`): água de `#8EC5E8` a `#9A9468` com 6 pilhas, até 3 pratos sujos tortos com manchas na cuba, manchas nos pratos do carrinho, 2 moscas com 4+ pilhas.
3. **Lixo mais fedido** (`drawTrash`, `drawFumacaVerde`, `drawMosca`): 1 nuvem pequena a partir de `TRASH.cap - 2`; cheio, 3 nuvens maiores, 2 linhas de cheiro e 2 moscas. Parado com movimento reduzido.
4. **Sai o lembrete da louça** do `Game.begin`.
5. **Geladeirinha de doces**: `rect` 690,200,52,60; placa rosa "DOCES" dentro do topo (fora dele a geladeira grande cobria); selo "NOVO!" até 5 doces entregues (`save.docesTot`, somado no `finishDay`; nunca no modo dev); balão do doce 1,4× com ícone em escala 1,0 e os balões de baixo deslocados 52 px.

## Testes
`smoke52.js` (9 checagens: lavagem 1 a 1, parada com ação na fila, sem lembrete, rect novo, `docesTot`); capturas: `tests/shot_v9_6_6.js` (`capturas/v9_6_6`).

## Balanceamento (sem mudar números)
Garagem sem equipe, dias 3 a 7 (20 rodadas): ~70% (antes 70%); `EQUIPE=auto`: ~98% (antes 99%); área industrial `EQUIPE=auto` dias 8 a 10 (30): 94%; Avenida (30): 94%.
