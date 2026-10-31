# v8.3.9 — Estrelas que premiam o jogo bem feito

Retorno do usuário em 23/10, logo depois da v8.3.8 (texto em `docs/PROPOSTAS.md`): "Joguei nível 1 do zero totalmente flawless e tirei 1 estrela só".

## O problema
Na v8.3.8, as metas e as 3 estrelas saíram do bot comum (3 estrelas perto do p90 dele). Com os preços de verdade, o lucro dos primeiros dias depende muito da sorte: o tamanho dos grupos e os pratos pedidos. No dia 1 (5 grupos), o bot "jogador perfeito" (`BOT=afiado`) não perdia ninguém em 100 de 100 dias, mas o lucro ia de R$ 44 a 174, e as 3 estrelas (R$ 130) só vinham em ~13% dos dias.

## O que mudou
As metas e o lucro das 3 estrelas foram recalculados pelo jogo perfeito. As 3 estrelas ficam perto do p10 do lucro do bot afiado nos dias sem perda, e a meta perto do p10 do bot comum com equipe. A regra não muda: 3 estrelas = esse lucro, sem perder ninguém. A 2ª estrela continua no meio do caminho (`bomGoal`).

| Dia | meta (antes) | 2 estrelas | 3 estrelas (antes) |
|---|---|---|---|
| 1 | 30 (60) | 50 | 60 (130) |
| 2 | 120 (200) | 175 | 220 (340) |
| 3 | 150 (150) | 200 | 230 (290) |
| 4 | 70 (100) | 100 | 110 (230) |
| 5 | 100 (150) | 125 | 140 (320) |
| 6 | 150 (150) | 225 | 280 (300) |
| 7 | 180 (180) | 250 | 310 (360) |

Do dia 8 em diante, a meta e as 3 estrelas são as do dia 7 com o fator do dia da semana, como antes.

## Números (`balance.js 60`)
- Bot afiado: 3 estrelas em 56, 56 e 57 de 60 nos dias 1 a 3. Nos dias 4 a 7, ele só fica sem as 3 estrelas quando perde alguém.
- Metas nos dias 3 a 7: com `EQUIPE=auto`, 89% (alvo 85–95%); sem equipe, 73% (alvo 40–70%, um pouco acima: os dias 4 e 5 ficaram fáceis para quem joga sozinho).
- O dinheiro da campanha não muda: as metas só dão estrelas.

## Testes
- `smoke24.js` confere as metas, as 3 estrelas e a 2ª estrela do dia 1.
- `balance.js` aceita `DUMP=1`, que lista o lucro, os perdidos e o faturamento de cada dia jogado (para calcular percentis).
