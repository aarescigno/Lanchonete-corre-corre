# v8.3.5 — Estoque no editor do salão

Pedido do usuário em 23/10 (texto em `docs/PROPOSTAS.md`): um espaço de "estoque" no editor do salão, para deixar mesas e rearrumar com facilidade quando o salão está cheio.

## Antes
No editor (lojinha, aba Salão), a mesa só podia ir de um lugar válido do salão para outro. Com o salão cheio (16 lugares), quase não sobrava lugar livre para soltar a mesa, e rearrumar exigia vender mesas ou usar a arrumação automática.

## Agora
- **Estoque** na faixa à esquerda do salão no editor (`EST` em `41-lojinha.js`, de x 12 a 182 do salão): as mesas guardadas aparecem pequenas (55%), em 2 colunas e pelo menos 4 fileiras (encolhem se houver mais). Vazio, ele explica: "Arraste uma mesa para cá e abra espaço no salão. Aqui ela não abre no dia."
- **Guardar:** arrastar a mesa do salão até o estoque (o estoque fica verde, ou vermelho se não vale), ou tocar nela e em "Guardar no estoque". O salão fica com pelo menos 1 mesa.
- **Tirar:** arrastar a mesa do estoque até um lugar válido do salão (ela sai no tamanho de verdade, presa no dedo; em lugar que não vale, volta e explica), ou tocar nela e em "Pôr no salão" (primeiro lugar livre, como na compra).
- O balãozinho da mesa do estoque (ao lado do estoque) tem a cor das cadeiras, "Pôr no salão", "Virar mesa de 4" e "Vender", com os preços de sempre.
- **Regras:** a mesa no estoque não abre no dia, não paga luz e gás e não conta no movimento do salão; conta no teto de lugares do ponto (compra e "virar mesa de 4" olham salão + estoque). "Lugares X de 16" é o salão; a linha "No estoque: N mesas (L lugares), que não abrem no dia" aparece embaixo (escondida nas telas baixas). Guardar e tirar entram no Desfazer, que agora volta salão e estoque juntos.
- **Compra sem lugar:** se a mesa nova não couber no salão nem com a arrumação automática, ela vai para o estoque (antes, a compra era recusada).
- **Save:** `salao.estoque: [{ seats, c }]` (`normSalao`); passou do teto, saem primeiro as do estoque; salão vazio com estoque, a 1ª do estoque volta para o salão. Saves antigos ganham o estoque vazio.
- `Game`: `estoque`, `lugaresTot`, `estoqueSel`, `guardarMesa(i)`, `tirarMesa(k, x, y)`; `virarMesa`, `venderMesa` e `pintarMesa` ganharam o parâmetro `est`.

Sem mudança de equilíbrio (o bot não usa o estoque). Teste novo `tests/smoke22.js` (27 verificações: save, guardar e tirar, teto, compra, editor com arrasto e balãozinho, o dia só com as mesas do salão). Capturas: `python3 tests/shot_v8_3_5.py` gera `capturas/v8.3.5` (salão cheio, arrasto para o estoque, balãozinho da mesa do estoque).
