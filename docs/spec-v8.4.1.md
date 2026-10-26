# v8.4.1 — Caixa animada do Gurugol no fim do dia

Pedido do usuário em 26/10 (texto em `docs/PROPOSTAS.md`): em vez do texto, uma caixa animada à esquerda do fim do dia, com barrinhas que enchem até a nota de cada critério e a nota final contando até o valor, com a cor pela faixa.

## O que mudou
- **Caixa do Gurugol** (`gurugolCaixa`, em `42-resultados.js`), o 1º item de `#end-stats`, à esquerda dos quadros (no lugar da linha "Gurugol" da v8.4). Fundo azul-escuro, o título "Gurugol" em mostarda e, para cada critério (`AVAL_CRIT`), o nome em itálico e uma barra amarela dividida em 5 gomos (um por estrela), que enche até a nota do critério.
- Mostra a nota da lanchonete (`r.aval.geral`); antes da 20ª avaliação, mostra a do dia, com "sem nota: n de 20 (hoje)" embaixo. Com nota, a linha de baixo diz "hoje X em N avaliações".
- **Animação:** as barras enchem uma depois da outra (0,7 s cada, com 0,15 s entre elas); a partir de 0,5 s, a nota conta de 0,0 até o valor em 1,3 s, mudando de faixa no caminho (`requestAnimationFrame`; abrir o fim do dia de novo cancela a animação anterior, `guruAnim`). Com `prefers-reduced-motion`, tudo aparece pronto e os reflexos e brilhos ficam parados.
- **Faixas** (`notaFaixa`, pela nota com uma casa):
  - abaixo de 4: **pura** (creme, com contorno);
  - de 4,0 a 4,4: **prata** metalizada (degradê de prata no texto, com um reflexo que passa depois de pronta);
  - de 4,5 a 4,8: **ouro**, com o reflexo e 3 brilhinhos de estrela (✦) que piscam em volta;
  - acima de 4,8 (4,9 e 5,0): **diamante**, em tons claros iridescentes com um halo, reflexo mais rápido e 7 brilhinhos.
- A caixa tem `role="img"` e `aria-label` com a nota e cada critério. Os comentários do dia continuam embaixo dos quadros.
- Telas largas (700 px ou mais): `#end-stats` não quebra linha, e o painel alarga para os 3 itens caberem lado a lado. Na tela de 1220×600, tudo cabe sem rolar.

## Testes
- `smoke25.js` (40): a caixa é o 1º item do fim do dia, com o `aria-label` e as 5 barras, e as faixas de `notaFaixa`.
- `python3 shot_v8_4_1.py` gera as capturas em `capturas/v8.4.1`: a caixa pronta nas 4 faixas e no meio da animação, no PC e no celular deitado.
