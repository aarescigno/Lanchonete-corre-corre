# v8.3.6 — Jogo de pratos sem limite

Pedido do usuário em 23/10 (texto em `docs/PROPOSTAS.md`): "pratos devem ser melhorias sempre disponíveis para compra de quantas vezes a pessoa quiser, as demais melhorias ainda limitadas a 1 por dia (por enquanto até rebalanceamento financeiro)".

## Antes
O Jogo de pratos (R$ 300, +1 prato limpo do dia 3 em diante) era como as outras melhorias: uma vez só, e contava como a melhoria do dia (1 por lojinha).

## Agora
- O Jogo de pratos tem `multi:true` em `UPGRADES` e fica sempre à venda: cada compra custa R$ 300 e põe +1 prato limpo (`dishStock`: 4 + n nos dias 3 em diante, 5 + n no Turno sem fim).
- Ele não conta no limite de 1 melhoria por dia: dá para comprar antes ou depois da melhoria do dia, e comprar só pratos deixa a melhoria do dia livre. As outras melhorias seguem 1 por dia.
- `save.up.pratos` passa a ser um número (`pratosDe(up)` lê; o `true` dos saves antigos vira 1 no `normSave`).
- Lojinha: o cartão começa a descrição com "Você tem N." e o botão segue "Comprar R$ 300" (desabilitado só sem dinheiro); o aviso do alto diz "(pratos à vontade)". O resumo do Caixa mostra "jogo de pratos ×N" quando N > 1. No modo dev, Ligar põe 1 e Desligar tira todos.
- Preço fixo por enquanto: o usuário vai rever no rebalanceamento financeiro.

Testes: `smoke23.js` (novo); o `smoke.js` deixa o Jogo de pratos de fora do teste da 2ª compra bloqueada. Captura: `python3 tests/shot_v8_3_6.py` gera `capturas/v8.3.6` (aba Melhorias com a melhoria do dia escolhida e 2 Jogos de pratos).
