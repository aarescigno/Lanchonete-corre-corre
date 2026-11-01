# v9.6.2 — Retornos de 01/11 (etapa 3c)

## O que mudou
1. **A ajudante não espera a pia encher** (`src/15-dani.js`, `Helper.think` e `update`; vale para Dani, Joca e Cami): com louça na pia e sem café na mão, lavar vem antes de recolher mais mesas (antes só lavava quando já estava na pia ou não havia mesa suja). Na volta ao canto (`walk` sem tarefa) ela repensa a cada 0,25 s. Com a Bia lavando (`canWash()` falso) e no modo "Minhas mesas" da Cami, nada muda.
2. **Conversa do Cardápio no fim do dia 2** (`HIST_CARDAPIO.dia` 1 → 2): a 1ª lojinha fica sem empurrão. Quem já viu não vê de novo. Se a conversa do capítulo 1 ("2 dias no azul") cair no fim do dia 2, ela vem primeiro e a do Cardápio espera o fim do dia 3 (regra de uma conversa por vez).
3. **Conversa dos entregadores no fim do dia 4** (`HIST_ENTREGA`, 6 falas; `save.convEnt` 'pend' | 1; `normSave`, `fluxoHistoria`): só no Modo História, no dia exato; saves que já passaram do dia 4 não veem. Fica depois da divulgação e antes das conversas de liberação.
4. **"+ marmita" desligado** (`MARMITA.adiantar: false`): `estacaoOn('adiantar')` falso, botão não desenhado, nota do dia 4 e dica do Como jogar sem a frase dele. O código fica; os smokes que o usam ligam `L.MARMITA.adiantar = true` (smoke28) e `tests/bot.js` só toca nele com a chave ligada.

## Testes
- `smoke49` (novo, 18 conferências): pia antes da mesa, volta ao canto, Bia lavando; conversas (dias 1 a 5, `normSave`, sem Modo História); "+ marmita" desligado.
- Ajustados: `smoke28` (liga a chave), `smoke34` (dia 1 sem conversa do Cardápio), `smoke39` (Cardápio no dia 2; dias no vermelho para a do capítulo 1 não tomar o lugar), `smoke40`.
- `balance.js` 40 rodadas, `EQUIPE=auto`: Garagem dias 5 a 7 com 97%, 92% e 92% das metas; área industrial 95% e 90%; Avenida 90% e 85%. Sem ajuste de `metaF`.
- `carreira.js DIAS=14` sem travar. Já falhavam antes: `smoke37` ("3 cursos: R$ 120, 150 e 180"); `smoke3`/`smoke16` têm conferências aleatórias que às vezes falham.
