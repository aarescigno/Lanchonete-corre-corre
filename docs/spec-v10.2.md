# v10.2 — A cozinha do Terraço (etapa 4a-3, 11/11)

Origem: `docs/PLANO.md`, sessão 4a-3 (planejada em 10/11). "Lá não se vende coxinha": no Terraço o Tonhão aprende pratos finos, ganha a Lia como ajudante e a Dani chega à alta confeitaria.

## O que mudou
- **Cardápio e cursos** (`10-constantes.js`): 6 pratos `fino:true` (`bruschetta`, `bacalhau`, `quiche`: entradas nas categorias chapa, frito e assado; `risoto`, `peixe`, `medalhao`: principais da categoria `pf`, sem `pfv`) e os cursos `entradas` (R$ 600 / avançado R$ 900, "Entradas de chef") e `alta` (R$ 900 / R$ 1.400, "Menu do chef"), `nivel:4` (só no Terraço, pelo `cursoOk`). Contam na experiência do Tonhão (+1 e +2) e na Diversidade do cardápio (`avalMenu`) como os outros. Preços no Terraço (×2,4): R$ 34, 38 e 36; R$ 91, 101 e 110 (mais ×1,15 no avançado).
- **Regra do prato fino** (`pedePrato`, `pedePrincipal`): no Terraço, se a cozinha sabe alguma entrada fina, a entrada sai só entre as finas (peso do gosto da categoria + 1, para o frito não sumir para quem não gosta dele); o mesmo vale para o principal. Vegetariano: bruschetta ou quiche; risoto. Fora do Terraço nada muda.
- **Lia** (`STAFF.lia = { pay:80, cook:0.75 }`, `equipe.lia` 0 ou 1; `liaOn`, `Game.liaAtiva`, `LIA_HOME`): só no Terraço (no modo dev, em qualquer ponto); contratar é definitivo (`setStaff` recusa baixar). Com ela no dia, todo pedido da cozinha (entrada, prato, marmita) leva ×0,75 do tempo (`Kitchen.ajuda`). `FOLHA_CORTE`: `liaFora` ("a Lia (sem salário hoje)") vem logo depois das TVs e antes do Anselmo; `payroll`, `folhaItens`, `payDay` e `normEquipe` contam ela.
- **Visual** (`drawLia`, `LIA_LOOK`): mulher parda, cabelo crespo em coque sob um lenço amarelo-mostarda, dólmã branca de mangas dobradas, avental cinza, crachá "LIA", mexendo uma panela (parada com `prefers-reduced-motion`). Fica na janela dos pedidos, ao lado do Tonhão, em escala 0,72 (`LIA_HOME`) para caber abaixo das comandas. Cartão em Equipe (ícone `lia`, `buildLia`: nome, "A cozinha anda mais rápida", diária e Contratar).
- **Conversa** (`LIBERA.lia`, `nivel:4`, `dia:1`, `ate:999`; gatilho: o básico de `entradas` ou de `alta`; reclamações "A comida demorou entre um prato e outro." e "Cozinha lenta para um terraço."): 5 falas do plano (Tonhão, Bia, Tonhão, Lia, Bia); `HIST_NOMES.lia`, nome verde-oliva `#5E7A3A`, `convCabeca`.
- **Dani, Alta confeitaria** (`DANI_CURSOS.confAlta`, R$ 600, `nivel:4`, depende da `confGourmet`): `DOCES.alta` (entremet, mil-folhas, macarons; `altaPreco:30`, `altaIngred:7`), `up.confAlta`, `AVAL.amb.doceAlta = 0,4` no lugar do 0,25 e o comentário "O entremet da casa é de outro mundo!". Ícones de doce 6 a 8 e `doceIcone(up)` para a vitrine ("ALTA" na plaquinha).
- **Desenhos** (`20-desenho-base.js`): `drawFino` (6 pratos, com o detalhe do avançado) e os 3 doces.
- **Manual:** `e-lia` (aba Equipe, "Lia", "Ajudante de cozinha: com ela, tudo sai mais rápido."; traço "cozinha mais rápida"); 65 fichas.
- **Save:** `equipe.lia`, `cursos.entradas/alta`, `daniCursos.confAlta`; o da v10.1 carrega igual.
- **Bot:** `bot.js` (`CURSOS_TERRACO`: os dois cursos no Terraço, depois da lista) e `carreira.js` (contrata a Lia com R$ 300 de folga; linha `LIA`); `balance.js` ganha `ALTA=1` e `LIA=1`.

## Calibração (11/11, `PONTO=terraco BOT=afiado EQUIPE=auto node balance.js 40`, lucro médio dos dias 8, 9 e 10)
- Base: R$ 2.210, 1.260 e 1.705 (passou 36, 17 e 36 de 40).
- `ALTA=1` (os dois cursos avançados e a alta confeitaria): R$ 4.303, 3.496 e 4.075 (passou 38, 40 e 40 de 40; 3★ 33, 38 e 35): quase dobra o lucro (conta por mesa bem mais alta). **Recalibrar na 4a-5** (a base e o custo dos cursos).
- `ALTA=1 LIA=1`: R$ 4.052, 3.438 e 3.788: a Lia não soma lucro com o bot (o gargalo não é a cozinha), só custa R$ 80 por dia; o ganho dela é de nota (prato e entrada mais rápidos). `LIA=1` sozinho: sem ganho claro.

## Testes
`smoke62` (71): cursos só no Terraço e preços; regra do prato fino (entrada, principal, vegetariano, peso, fora do Terraço); experiência e Diversidade; a Lia (R$ 80, ×0,75 em prato e marmita, ordem do corte, só no Terraço, definitiva); a conversa; Alta confeitaria (dependência, R$ 30, +0,4); Manual e save; as páginas desenham. Ajustados: `smoke31` (29 pratos, cursos), `smoke35` (xp 26), `smoke53` (65 fichas). Capturas: `node shot_v10_2.js` (`capturas/v10_2`, fora do git).

## Desvios do plano
- Preços do Terraço saem do ×2,4 (o plano citava ×2,5).
- A Lia fica em escala 0,72 na janela dos pedidos (na janela dos pratos o balcão a escondia).
- Flakes antigos: `smoke3` e `smoke38` falham de vez em quando (sorteios), também sem esta versão.
