# v8.6.11 — Vegetarianos e veganos

Etapa 2c-r3c (`docs/PLANO.md`), sobre a estrutura da 2c-r3a (v8.6.9). A v8.6.10 (2c-r3b, desenhos próprios dos pratos) ainda não foi feita; os pratos novos usam o desenho da categoria, mais o selo de sem carne.

## O que mudou
- **Clientes vegetarianos** (`VEG.chance = 0,1`, `Group`): cada pessoa (nunca o entregador, nem na Missão zero) é vegetariana com 10% de chance (`p.veg`). `pedePrato(tipo, game, semPf, veg)`: o vegetariano só pede prato com `carne:false` que a cozinha sabe, pelo gosto do tipo; se o gosto do tipo não tem opção mas existe algum prato sem carne, pede esse; sem nenhum, pede uma coxinha e o grupo fica com `semVeg`. O 2º item do vegetariano é sempre sem carne (ou nenhum).
- **Gurugol:** o grupo `semVeg` dá **Cardápio 1** (em vez de `avalMenu`) e, se for a pior nota dele, o comentário "Não tinha nada vegetariano." (`avalComentario`, parâmetro `semVeg`).
- **Curso Vegetariano** (`veg`, R$ 150): PF vegetariano 23, empada de palmito 9 (`dep:'assados'`) e kibe de abóbora 7 (`dep:'fritos'`). Entra na Diversidade do cardápio (+0,6: com os 5 básicos, 5,0) e traz **+5% de movimento** (`VEG.mov`, `vegMov(cursos)`, em `buildSchedule`). Quem não é vegetariano pede o PF vegetariano em 20% das vezes que pede PF (`VEG.pfTroca`); os outros pratos entram no sorteio da categoria.
- **Avançado "Pratos veganos"** (R$ 300): PF vegano 23 (sem o ovo), coxinha de jaca 8 (`fritos`), pastel de palmito 10 (`pastel`), esfiha de soja 7 (`assados`), misto vegano 10 (`chapa`); `nivel:2`, `semAv` (preço comum). +15% nos três pratos do básico e caprichado ×1,5 nos oito (`pratoAv`); **mais +5% de movimento**. Sem versão vegana: a empada e o bolinho japonês.
- **`pratoSabido`:** `dep` (o prato precisa do básico de outro curso) e `nivel`. A aba Cursos mostra o prato que ainda depende de outro curso apagado, com "precisa do curso de ...", e o cartão do outro curso avisa "+ Empada de palmito (vegetariano)".
- **Desenho** (`drawComida`): PF sem bife com soja refogada (grumos), PF vegano sem ovo; `drawVegSelo`: um "v" verde sobre os pratos vegetarianos e uma folhinha verde sobre os veganos. Os pratos novos usam o desenho da categoria até a 2c-r3b.
- Como jogar ganha uma dica nova; painel Versões e `VERSAO` na v8.6.11.
- **Testes:** smoke 31 passa a conferir os 22 pratos, o curso, as dependências, o movimento, os pedidos dos vegetarianos, o Cardápio 1 com o comentário e o desenho de todos os pratos. O `bot.js` compra o `veg` logo depois do pastel e os veganos no fim dos avançados. `tests/shot_v8_6_11.py`.

## Calibração (balance.js, 40 rodadas, % de dias que passam a meta nos dias 3 a 7)
| | 2c-r3a | 2c-r3c |
|---|---|---|
| sem equipe | ~54% | 49% |
| `EQUIPE=auto` | ~88% | 84% |
| `BOT=afiado EQUIPE=auto` | — | 73% |
Sem os cursos (`CURSOS=0`): 60% e 95%. A queda extra vem de o vegetariano sem opção pedir coxinha (R$ 8) no lugar do PF e do `veg` ocupar a 2ª compra da ordem do bot. As metas dos dias 2 a 7 ficam para a 2c-r3d.
