# Lanchonete Corre-Corre — v6 (Salão)

Pedido: o salão só tinha 1 mesa de 4 lugares nos dias 2 e 3 (e 2 depois). Quando chegavam várias famílias de 4, não dava para jogar sem perder. Sugestão do usuário: mais mesas, escolher quantas cadeiras cada mesa tem e comprar cadeiras e mesas.

## Aba Salão na lojinha
- Terceira aba da lojinha, ao lado de Melhorias e Equipe.
- Comprar no Salão **não conta** no limite de 1 melhoria por dia.
- **Planta:** 2 fileiras de 4 vagas, como no salão. Cada mesa tem os botões **2** e **4** (lugares). A mesa fechada no próximo dia aparece apagada. A vaga vazia é tracejada.
- **Cadeiras:** o jogo começa com 16 (4 mesas de 2 e 2 de 4). "Comprar 2 cadeiras" custa R$ 60, até 24 cadeiras (mais 2 por mesa nova). Para pôr 4 lugares numa mesa é preciso ter 2 cadeiras livres, compradas ou tiradas de outra mesa.
- **Mesas novas:** "Comprar mesa" custa R$ 300 e já vem com 2 cadeiras. A mesa 7 fica na ponta direita da fileira de cima e a mesa 8 na de baixo. As mesas novas abrem todos os dias (as 6 de sempre continuam abrindo conforme o dia).
- **Espaço:** com 3 mesas, a fileira usa as colunas de sempre (260, 430 e 600). Com 4, as mesas se espremem entre x = 196 e 684, com pelo menos 46 px entre elas. Por isso, **numa fileira com 4 mesas só 1 pode ter 4 lugares**. A escolha é entre mais mesas e mais mesas grandes: 6 mesas de 4 lugares (24) ou 8 mesas com 2 grandes (20).
- **Mensagens:** "Faltam cadeiras: compre mais 2.", "Não cabe: numa fileira com 4 mesas, só 1 pode ter 4 lugares." e, no cartão da mesa nova, o que fazer para ela caber.
- O salão ao fundo da lojinha mostra cada mudança na hora.

## Código
- `SALAO`: fileiras `[[1,2,3,7],[4,5,6,8]]`, alturas, colunas, limites, preços e cores das mesas novas (7 verde, 8 azul).
- `rowLayout(seats)`: centros das mesas de uma fileira, ou `null` se não cabem. `salaoDefs`, `salaoOk`, `salaoUsed`, `salaoTableBlock`.
- `OBST` virou uma lista refeita por `setObst(defs)`, para os caminhos acompanharem as mesas.
- `Game.buildTables()` refaz `g.tables` só quando o salão muda (chave JSON). Os ids continuam seguidos, então `g.tables[id-1]` segue valendo.
- `Game.setSeats(id, n)`, `buyChairs()` e `buyTable()`; o motivo de uma recusa fica em `g.salaoMsg`.
- **Save:** `save.salao = { seats:{id:2|4}, chairs, mesas }`, normalizado por `normSalao` (um save estragado volta a um salão válido).
- A nota do dia 2 avisa que dá para comprar cadeiras e mesas na aba Salão.

## Testes
- `smoke8` (29 testes):
  - compra e troca de cadeiras;
  - família de 4 sentando numa mesa que era de 2;
  - mesas 7 e 8 e a regra da fileira de 4;
  - save;
  - todas as 129 combinações válidas: sem sobreposição, pontos de atendimento livres e alcançáveis, sem cobrir a jarra de água nem o lugar da Dani;
  - bot jogando o dia 2 com 8 mesas.
- `shot_v6.py` gera as capturas em `capturas/v6`: lojinha em 960×600, 740×360 e 568×320, e salão com 8 mesas.
- O equilíbrio (`balance`) não muda: o salão padrão é igual ao da v5.
