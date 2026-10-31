# v8.6.15 — Lojinha em 4 grupos com cartões

Etapa 2c-r4b (`docs/PLANO.md`), pedido do usuário de 30/10. Só interface: nenhuma regra nem preço mudou.

## O que mudou
- **Os 10 botões em fileira viraram 4 grupos** (`#shop-tabs`): Lanchonete, Equipe, Dinheiro e Gurugol. Cada grupo mostra **cartões só com ícone e nome**; tocar num cartão abre a seção, com o botão **‹ Voltar** (`#shop-nav`) que volta aos cartões do grupo. O Gurugol abre direto, sem cartões nem Voltar.
- Grupos e cartões (`SHOP_GRUPOS`/`SHOP_SECOES` em `41-lojinha.js`): **Lanchonete** = Melhorias, Salão, Decoração, Manutenção, Divulgação; **Equipe** = Bia, Tonhão, Dani; **Dinheiro** = Banco, Caixa.
- Conteúdo: **Bia** = Tênis novos/de corrida, Bandeja e Livrinho de Sudoku (`buildBia`); Melhorias fica com os outros 5 (`BIA_IDS` filtra); **Tonhão** = o aumento mais os Cursos (`buildTonhao` chama `buildCursos`); **Dani** = `buildDani`; o **músico (couvert) e a TV e som** foram para a **Divulgação** (`buildAmbiente`, chamado no fim de `buildDivulga`). `buildEquipe` deixou de existir.
- Estado: `shopTab` guarda a seção (`null` = cartões do grupo) e `shopGrupo` o grupo. A lojinha **abre sempre em Lanchonete, nos cartões** (`43-telas.js`, ao entrar na tela `shop`); trocar de grupo vai aos cartões dele.
- `__lcc.setShopTab(v)` segue aceitando o nome da seção e acerta o grupo; os nomes das abas antigas `equipe` e `cursos` caem em Equipe › Tonhão (`SHOP_ANTIGAS`). Novos: `__lcc.setShopGrupo(g)` e `__lcc.shopSecoes()`.
- CSS: `.shopcards` (3 por fileira; 2 em tela estreita; compacto, em linha, no celular deitado) e `.shopnav`. Ícones novos: `g-salao` (mesa com duas cadeiras) e `bia`; os demais vêm de `upgradeIcon`.

## Testes
- Novo `smoke33.js` (18 checagens): abre em Lanchonete com 5 cartões na ordem; cartão só com ícone e nome; cada grupo com os seus cartões; Gurugol direto; Voltar; trocar de grupo; `setShopTab('cursos')` cai em Tonhão; Bia mostra Tênis, Bandeja e Sudoku e Melhorias não; TV e som em Divulgação e não em Tonhão nem Dani; reabrir volta a Lanchonete.
- Ajustados: `smoke9.js` (Divulgação ganhou a TV e som), `smoke12.js` e `smoke15.js` (Tênis, Bandeja e Sudoku passam a estar na seção da Bia; TV e couvert na Divulgação). `harness.js` ganhou `document.createTextNode`.
- `menu_fit.py` verde. Capturas em `capturas/v8.6.15` (`shot_v8_6_15.py`; no PC e no celular deitado: em pé o jogo pede para girar).
- Observação: o Tonhão (aumento + 7 cursos) continua mais alto que a tela e rola, como a aba Cursos já rolava.
