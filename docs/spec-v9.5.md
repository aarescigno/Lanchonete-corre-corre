# v9.5 — Sessão 3b-5: o Anselmo e os drinks da Avenida (31/10/2026)

## O que entrou
- **O Anselmo** (coqueteleiro, só na Avenida; no modo dev, em qualquer ponto): `STAFF.anselmo` (níveis 2 e 3: velocidade 0,8/1,0, R$ 90/R$ 130 por dia). Contratar põe no nível 2 e o nível 3 (cursos do Terraço, 4a) não se compra (`setStaff` recusa). Não faz as tarefas da lista nem entra em `Game.ajud`: é uma fila de preparo no `Game`. Save: `equipe.anselmo` (0, 2 ou 3; `normEquipe` zera fora da Avenida); `anselmoFora` vale só no dia, como o do Joca e da Cami.
- **Folha:** `FOLHA_CORTE` agora `couvert, som, TV, TVs, o Anselmo, a Cami, aumento do Joca, da Dani, do Tonhão, o Joca`. `payroll`, `folhaCorta` e `folhaItens` contam ele.
- **Balcão de drinks** (`STATIONS.drinks`, rect (620,92,60,50), ap (700,150); `ANSELMO_HOME` (650,118)): prateleira com garrafas, Anselmo atrás do tampo (chacoalha a coqueteleira enquanto prepara; parado com `prefers-reduced-motion`) e até `DRINKS.vagas` (2) copos prontos no tampo. Só existe com o Anselmo trabalhando (`Game.anselmoAtivo`, `estacaoOn`).
- **Pedidos:** `Group.drinks` é sorteado ao criar o grupo (`sorteiaDrinks`; nunca o entregador nem a turma, só com o Anselmo no dia); vão para a fila (`Game.drinkPedir`) quando a Bia anota o pedido. `Game.drinkUpdate`: um drink por vez, `DRINKS.prep / speed` (4 s / 0,8 = 5 s); com o balcão cheio ele para. `Game.drinkCancela` limpa fila, balcão e mãos quando o grupo sai.
- **Bia:** tocar no balcão (`type:'drinks'`) pega os copos prontos que couberem; `verbFor` → `'drink'`; `serveDrink` / `Game.entregaDrinks`: +1 coração, R$ 22 na conta (`bebConta`), +5 pontos, ingrediente R$ 6. O drink é bebida nas mãos (`BEBIDAS_MAO`, bandeja de 3; o `DRINKS` antigo de `14-bia.js` foi renomeado) e vale R$ 11 de multa no lixo. O grupo só pede a conta depois dos drinks (`drinksFalta` junto de `esperaSuco`); sem entrega, nada entra na conta e perde coração (`perdDrink`).
- **Textos e Gurugol:** `AVAL.amb.drink` +0,25 no Ambiente de quem recebeu; comentários "O drink do balcão é uma obra de arte!" e "Pedi um drink e ele nunca veio.". Conversa `LIBERA` `anselmo` (nível 3, dia 3, até 6, gatilho 3 notas de Ambiente ≤ 3,5), `HIST_NOMES.anselmo`, cor do nome bordô `#8E3B46`.
- **Lojinha:** cartão do Anselmo na Equipe (nível, velocidade, tempo por drink, diária, "Cursos no Terraço Suíça"). Fim do dia: "Drinks do Anselmo: n". Ícone `drink` (3 sabores), balão dos drinks que faltam na mesa.
- **Mudança em relação ao plano:** `DRINKS.pede` ficou **+0,1** em cada tipo (executiva 0,45 · negócios 0,6 · família 0,25 · vovós 0,25 · estudante 0,35), pela regra do plano, porque o ganho líquido do Anselmo na `carreira.js` ficou abaixo de R$ 30.

## Testes
- **`tests/smoke47.js` (novo, 57)**: o plano chamava de smoke46, número já usado pelo fiscal. Confere constantes, cartão e contratação, conversa, taxas por tipo (800 grupos), fila (5 s por drink, 2 copos), entrega e conta, Ambiente, lixo, folha, desenho, balcão como alvo de toque e save da v9.4. Entra no `run_all.sh`. `smoke45` ganhou `anselmo:2` nos `libera` (a garantia do 6º dia abria a conversa dele antes da da Cami).
- `bot.js` leva os drinks; `balance.js` (`ANSELMO=1`) e `carreira.js` (contrata o Anselmo na Avenida; `ANSELMO=0` desliga; linha `ANSELMO`).
- Capturas: `tests/shot_v9_5.js` (`capturas/v9_5`; PC e celular deitado, `ERRORS: []`).
- `smoke3`, `smoke16` e `smoke38` falham de vez em quando, também sem esta versão (aleatórios).

## Números medidos (`PONTO=avenida`, `EQUIPE=auto`)
- `balance.js 20`: sem o Anselmo passou 20/20 nos dias 8 a 10; com ele, 20/20, 19/20 e 19/20 (a Avenida já passava de 95% antes: a regra "drinks R$ 18" do plano não foi aplicada, como na 3b-3; fica para a 3b-7).
- `DIAS=50 carreira.js 16` (com `DRINKS.pede` +0,1): lucro por dia na Avenida R$ 887 sem ele e R$ 880 com ele (já descontada a diária de R$ 90), ou seja, o bot ganha ~R$ 83 por dia nos drinks e fica no zero a zero. Contratado em 16/16 carreiras (dia mediano ~33), 0 dias no negativo nos 5 dias depois da mudança. Com a pede original (R$ 835 contra R$ 874) o saldo era −R$ 39. Um jogador humano serve melhor que o bot; reavaliar na 3b-7.
