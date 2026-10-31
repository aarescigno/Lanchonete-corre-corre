# v9.0.3 — Conversas espalhadas (31/10/2026)

Retorno do usuário (`docs/PROPOSTAS.md`): as conversas se concentravam nos fins dos dias 2 e 3 (fecho do cap. 1 + antes do cap. 2 + cardápio no dia 2; divulgação e, muitas vezes, fecho do cap. 2 + antes do cap. 3 no dia 3), e o fim do dia 1 não tinha nenhuma.

## O que entrou
- **Uma conversa por fim de dia:** `fluxoHistoria(fim, falou)`. As de capítulo vêm primeiro (o "depois" e o "antes" do seguinte são uma só, como antes); se alguma tocou, a do cardápio e a da divulgação esperam, pendentes, o próximo fim de dia sem capítulo. Sem capítulo, toca só uma extra (o cardápio antes da divulgação).
- **Cardápio no fim do dia 1** (`HIST_CARDAPIO.dia` 2 → 1). Saves antigos seguem a regra de antes (pendente no próximo fim de dia, se ainda não viram).
- **A divulgação só abre depois da conversa dela** (`divulgaAberta(n, sv)`: fechada enquanto `sv.convDiv === 'pend'`). Se a conversa esperar, o dia 4 (ou o seguinte) segue com o movimento da inauguração, de graça. Fora do Modo História nada muda (o `convDiv` nunca fica pendente).
- Sequência típica agora: antes do dia 1, cap. 1; fim do dia 1, cardápio; fim do dia 2, cap. 1 → cap. 2; fim do dia 3, divulgação (ou o cap. 2 → cap. 3, e a divulgação no fim do dia 4).

## Testes
- `smoke40` (19 checks): + capítulo antes da divulgação, a divulgação fechada enquanto pendente, cardápio e divulgação pendentes juntas.
- Ajustados: `smoke34` (a conversa do cardápio depois do dia 1) e `smoke39` (cardápio no dia 1).
