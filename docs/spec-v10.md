# v10 — O Terraço Suíça e a refeição completa (etapa 4a-1, 10 e 11/11)

(Rascunho do marco 3; o texto final vem no fechamento da versão.)

## Calibração (medida em 10/11, `balance.js` e `carreira.js`, sem editar `src/` antes de medir: `PONTO_CFG`)
"Equipe toda" = `PONTO=terraco EQUIPE=auto JOCA=4 ESPRESSO=1 CAMI=3 ANSELMO=1 GOURMET=1`; metas medidas em 80 rodadas (dias 8 a 10), lucro por dia depois de ingredientes, contas (com o aluguel) e folha.

| Regra do plano | Antes | Depois | Motivo |
|---|---|---|---|
| `grupos` | 0,45: o bot afiado com a equipe toda perde 0,3, 0,0 e 0,1 grupo por dia (ok, no máximo 1), mas as mesas ficam vazias em 33% do turno (ocupação 78%, 62% e 61%) | 0,50 (ocupação 82%, 67% e 72%: 26% vazias; perde 0,3, 0,1 e 0,1) | regra "mesas vazias em mais de 30% → 0,50" |
| `metaF` / `expertF` | 4,0 / 5,0: o lucro da equipe toda (R$ 1.560 a R$ 2.620 por dia) passava 100% das metas e 3★ não era problema | 9,0 / 6,0 | equipe toda (bot afiado) passa 91% das metas e 3★ em 61% (80 rodadas); o bot comum com a equipe toda: 90% e 58% |
| ganho sobre a Avenida (`DIAS=65`, contra `MUDA=2`, bot comum com a equipe toda) | Terraço R$ 1.981 por dia contra R$ 951 na Avenida: ganho de R$ 1.030 | aluguel 1.000 → 1.200 (ganho R$ 810 com cardápio 2,5) → cardápio 2,5 → 2,4 (Terraço R$ 1.646, ganho R$ 695) | regra "acima de 700: aluguel 1.200; depois cardápio −0,1" |
| dias no negativo nos 5 dias depois da mudança | 0 | 0 | (nada a ajustar) |
| cap. 8 depois da mudança | 3 dias (o mínimo) em 3/3 | 3 dias | |
| cap. 9 depois do cap. 8 | 1, 1 e 5 dias | 1, 1 e 5 dias | dentro do prazo (até 15 dias em 2/3); o cap. 9 sai fácil para o bot, que serve 6 completas com a nota alta quase sozinho |

Com o valor final (grupos 0,50; metaF 9; expertF 6; aluguel R$ 1.200; cardápio ×2,4):
- equipe toda, bot afiado: 86 a 91% das metas, 3★ 58 a 61%; bot comum: 90% e 58%.
- `EQUIPE=auto` sozinho: bot afiado 44% das metas e 9% de 3★; bot comum 2%. Sem equipe: 0%.
- Gurugol no Terraço (dia 8 a 10, equipe toda): nota do dia 4,65 a 4,77.
- Garagem sem equipe (dias 3 a 7, 20 rodadas): 95, 75, 75, 50 e 60% das metas; `EQUIPE=auto`: 100, 100, 100, 90 e 95%; Avenida `EQUIPE=auto`: 95, 95 e 90%.
