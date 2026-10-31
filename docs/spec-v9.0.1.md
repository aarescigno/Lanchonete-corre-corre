# v9.0.1 — Etapa 2c-r6: cardápio fácil de achar (30/10/2026)

Retorno de uma beta-tester (`docs/PROPOSTAS.md`): não ficou claro que os cursos do Tonhão aumentam o cardápio. Nada muda no balanceamento (os números do `carreira.js` e do `balance.js` seguem os da v9); o plano está em `docs/PLANO.md`.

## O que entrou
- **Cartão Cardápio** (1º do grupo Lanchonete, `SHOP_SECOES.cardapio`, ícone `cardapio` = pastel e coxinha): "No cardápio hoje (N pratos)" com os preços, a Diversidade no Gurugol, os cursos do Tonhão (`buildCursos`, igual a antes) e o aviso da XP. `SHOP_ANTIGAS.cursos` aponta para ele.
- **Seção Tonhão:** só a lista "Cursos de cardápio concluídos" (`buildCursosFeitos`) e o botão "Ver cursos" (abre o Cardápio); o "Faltam N de experiência" cita o Cardápio.
- **Selo "novo"** (`game.cardapioNovo`, `game.cardVer()`, `save.cardVisto`): acende no cartão (e na aba Lanchonete, com outro grupo aberto) quando há curso ao alcance do caixa que ainda não foi visto; some ao abrir o cartão; volta com outro curso ao alcance. Sem trava: só chama a atenção.
- **Conversa do cardápio** (`HIST_CARDAPIO`, `save.convCard`): no fim do 1º dia completo a partir do dia 2 (Modo História), depois das conversas de capítulo; versão curta se `cursoFeito`. Ao fim, a lojinha abre direto no Cardápio (`shopEntra`). O `falar` aceita a lista de falas direto.
- **Gurugol:** enquanto nenhum curso básico foi feito, a reclamação de cardápio cita os pratos (`AVAL_POUCO`, parâmetro `pouco` de `avalComentario`; `semVeg` tem prioridade).
- **Balão desvia do Pular** (`convEvita` em `43-telas.js`, `conv.evita` e `conv.caixa` em `26-conversa.js`): vai para a esquerda e, se ainda cruzar, desce.
- Texto do Como jogar e `VERSAO` ('v9.0.1').

## Detalhe
- A conversa do cardápio vem depois da de "antes" do capítulo seguinte (o `fluxoHistoria` chama a si mesmo depois dela).
- Não foram conferidas as cenas da abertura com o Pular dela (`#ov-abertura`): o balão desvia só do Pular das conversas.

## Testes
- `tests/smoke39.js` (27 checks): cartão Cardápio e seção Tonhão, selo, conversa (curta e longa, sem História, dia 3), balão e comentário.
- Ajustados: `smoke33` (6 cartões, Cardápio), `smoke35` (curso no Cardápio); `carreira.js` fecha a conversa do cardápio.
- `tests/shot_v9_0_1.js` (Node, porque o Python daqui não tem o playwright) grava em `capturas/v9.0.1`. O `menu_fit.py` não rodou aqui pelo mesmo motivo: conferir com o Python do usuário.
