# v8.6.12 — Os desenhos dos pratos

Etapa 2c-r3b (`docs/PLANO.md`). Saiu depois da v8.6.11 (vegetarianos), que já estava no `claude/main`.

## O que mudou
- **`drawComida`** (`20-desenho-base.js`): um desenho para cada prato, ajustado pelas fotos de referência do usuário: kibe em fuso simétrico e pontudo, bolinho japonês redondo, esfiha aberta com a carne moída em ~30 pedacinhos que se tocam e cobrem mais que a massa (em arco na borda, por cima e por baixo), esfiha fechada triangular, misto quente em duas metades empilhadas, pastel retangular (queijo com fio amarelo, pizza com tomate), risoles meia-lua, empada, bauru, pão na chapa. Os pratos veg reusam o desenho do prato com carne (`DESENHO_BASE`) e levam o selo da v8.6.11.
- **Detalhe do curso avançado:** fritos, catupiry; assados, azeitona; chapa, listras da grelha; pastel, bolhinhas. Vem do curso do jogo (`COMIDA_CURSOS`, posto por `render`), não de um `dish.av` (o `dish` é só a chave). Os pratos `semAv` (veganos) não levam detalhe. O cartão do avançado na aba Cursos mostra o detalhe.
- **Carnes variadas:** `CARNES` (bife, frango, peixe, cavalo); `Group.carnes` sorteia por pessoa com o avançado do PF; desenhada na mesa, no balão e na mão da Bia. A marmita mostra sempre o bife.
- `drawDish(ctx,k,x,y,s,empty,carne,av)`, `drawIcon(..., extra3)`, `__lcc.CARNES` e `__lcc.drawDish`. Smoke 31 ganha o desenho de todo prato e o sorteio das 4 proteínas; `tests/shot_v8_6_10.py` gera a grade em `capturas/v8.6.10`.
