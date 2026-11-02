# v9.6.10 — Conversas no fim do turno e cartões mais cedo (etapa 3g-1)

Retornos da Letícia (02/11, `docs/PROPOSTAS.md`). Só vale no Modo História; sem mudar números do jogo.

## O que mudou
1. **Conversas antes dos resultados:** no `dayend`, a tela de resultados é montada e `fluxoHistoria` toca o que estiver pendente antes de mostrá-la (`src/43-telas.js`). `falar` guarda e devolve o resultado e as contas do dia (`CAMPOS_DIA`), porque a conversa reinicia o salão do dia seguinte. O `btn-next` vai direto à lojinha; o `playCareer` ainda toca o que ficou pendente.
2. **Até 2 conversas de cartão por fim de dia** (`CONV_MAX`), além das de capítulo (o "depois" e o "antes" não contam). Ordem fixa: entregadores, Salão, Bia, Manutenção, Divulgação, presente da vizinha, Cardápio, Melhorias, Decoração e os cartões de ponto (ordem do `LIBERA`). As demais ficam pendentes para o dia seguinte.
3. **Bia:** `dia:2, ate:3`. **Salão:** `dia:1, ate:3` (a família que desiste na fila no dia 1 abre o Salão no fim do dia 1).
4. **Presente da dona Cida** (`HIST_PLANTA`, `save.convPlanta: 0 | 'pend' | 1`): pendente no fim do dia 1; ao terminar, `decor.espada = 1` (à mostra, grátis), sem abrir o cartão Decoração. Save antigo que já passou do dia 1 vira 1.
5. **Decoração pelo elogio à planta:** `dia:3, ate:6`; gatilho: planta à mostra e uma nota de Ambiente >= 2,5 no dia; comentários "Que plantinha bonita!" e "Gostei da plantinha na entrada."; falas novas.
6. **Dani:** no Modo História, o cartão dela na Equipe só aparece depois que ela chega (`daniChegou`). Cursos da Dani sem item somem quando ela está no nível máximo (os já feitos ficam).

## Testes
`smoke56.js` (27 checagens). Ajustados para o fluxo novo: `smoke34`, `smoke39`, `smoke40`, `smoke41`, `smoke50`. `balance.js` não muda (sem História).
