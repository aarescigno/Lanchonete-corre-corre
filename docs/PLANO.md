# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas (1a a 2e) estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data) e anota o que mudou no plano.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 0 | Contas: lucro, ingredientes, contas do dia, divulgação | v7 | feita (15/10) |
| 1a | Jogo justo: dá para não perder ninguém | v7.1 | feita (15/10) |
| 1b | Livro-caixa e ajuste fino com jogadores | v7.2 | feita (15/10) |
| 1c | Retorno do Renan: Bia mais ágil e selos da fila | v7.3 | feita (21/10) |
| 1d-1 | Garagem da Bia, móveis e editor do salão | v7.4 | feita (21/10) |
| — | Ajuste fora do plano: salão cheio chama gente, 4 pratos, fila justa a 60% | v7.4.1 | feita (21/10) |
| — | Fora do plano: TV e som na Garagem, couvert só no nível 3 | v7.4.4 | feita (21/10) |
| 1d-2 | Tela que rola até a calçada, espera lá fora e máquina de suco | v7.5 | feita (21/10) |
| — | Retorno de jogador: tela larga, tudo à vista sem rolar | v7.6 | feita (22/10) |
| — | Fora do plano: espera da Garagem de pé, Água da torneira e espada-de-são-jorge | v7.7 | feita (22/10) |
| 2 | Manutenção e imprevistos | v8 | feita (22/10) |
| — | Retorno do usuário: dinheiro comprometido com a folha à vista na lojinha | v8.1 | feita (22/10) |
| — | Pedido do usuário: Missão zero, o dia 0 de treino com pop-ups | v8.2 | feita (22/10) |
| — | Pedido do usuário: rejogar o dia (Reiniciar ou Menu na pausa) sem perder o dinheiro | v8.2.1 | feita (22/10) |
| — | Pedido do usuário: só o dia completo rende (folha no fim do dia; interromper não paga nem ganha) | v8.2.2 | feita (22/10) |
| — | Pedido do usuário: largar o dia com gente na espera ou nas mesas cobra a multa de quem sai bravo | v8.2.3 | feita (22/10) |
| 2b | Carreira como campanha contínua, dinheiro no negativo e empréstimo no banco | v8.3 | feita (23/10) |
| — | Pedido do usuário: parcela atrasada 2 dias seguidos, o banco toma a lanchonete (game over) | v8.3.1 | feita (23/10) |
| — | Pedido do usuário: amortização (SAC, 3% ao dia sobre o saldo) e empréstimo neutro a um pouco desvantajoso | v8.3.2 | feita (23/10) |
| — | Pedido do usuário: jogo offline por enquanto (ranking só no aparelho; o compartilhado volta na etapa 7) | v8.3.3 | feita (23/10) |
| — | Pedido do usuário: balão com o prato na mesa quando a comida fica pronta | v8.3.4 | feita (23/10) |
| — | Pedido do usuário: estoque no editor do salão, para rearrumar o salão cheio | v8.3.5 | feita (23/10) |
| — | Pedido do usuário: Jogo de pratos sem limite, fora da melhoria do dia | v8.3.6 | feita (23/10) |
| — | Retorno do usuário: a 3ª estrela pede não perder ninguém, e a tela passa a dizer isso | v8.3.7 | feita (23/10) |
| — | Retorno do usuário: preços de verdade (cardápio, 2º item, gorjeta de até 10%, ações viram pontos de atendimento, custos e metas de garagem) | v8.3.8 | feita (23/10) |
| — | Retorno do usuário: jogo perfeito no dia 1 deu 1 estrela; metas e 3 estrelas pelo bot afiado | v8.3.9 | feita (23/10) |
| 2c | Avaliações dos clientes (nota de 0 a 5 ★, 5 critérios) | v8.4 | feita (26/10) |
| 2d | Abertura animada do Modo História: o sonho da Bia | v8.5 | feita (26/10) |
| 2d-r | Revisão estética da abertura, em 5 partes com checagem do usuário | v8.6.1 | feita (28/10, as 5 partes juntas) |
| 2e | Entregadores com fila própria e marmitas | v8.6 | feita (28/10) |
| — | Pedido do usuário: decoração da Garagem (plantas, cantinho da Rosa, toalha xadrez), só visual | v8.6.5 | feita (29/10) |
| 2c-r1 | Rebalanceamento do Gurugol, parte 1: as regras da nota (null, humor pelo teto, chance de encantar, bronze, nota mínima) | v8.6.7 | feita (29/10) |
| 2c-r2 | Rebalanceamento do Gurugol, parte 2: prato quente | v8.6.8 | feita (29/10) |
| 2c-r3a | Cardápio que cresce: cursos do Tonhão e gostos dos clientes | v8.6.9 | feita (29/10; calibração quase fechada, ver `docs/spec-v8.6.9.md`) |
| 2c-r3b | Desenhos dos pratos novos, dos avançados e das carnes do PF | v8.6.12 | feita (29/10; grade de desenhos aprovada pelo usuário, ver `docs/spec-v8.6.12.md`; saiu como v8.6.12 porque a 2c-r3c já tinha tomado a v8.6.11) |
| 2c-r3c | Vegetarianos e veganos | v8.6.11 | feita (29/10; ver `docs/spec-v8.6.11.md`) |
| 2c-r3d | Rodada de balanceamento do cardápio (metas dos dias 2 a 7, ticket médio, nota mínima do Gurugol) | v8.6.13 | feita (29/10; salgado se pede de dois, metas dos dias 6 e 7, nota mínima 90% do teto; ver `docs/spec-v8.6.13.md`) |
| 2c-r4a | Melhorias sem o limite de 1 por dia e o fim do dia sem o (n) do Gurugol | v8.6.14 | feita (30/10; ver `docs/spec-v8.6.14.md`) |
| 2c-r4b | Lojinha em 4 grupos com cartões | v8.6.15 | feita (30/10; ver `docs/spec-v8.6.15.md`) |
| 2f | A campanha vira o Modo História: estrutura e capítulos da Garagem | v8.7 | feita (30/10; ver `docs/spec-v8.7.md`; alvos do `carreira.js` e do `balance.js` batidos sem mexer nos valores) |
| 2g | O Tonhão sobe de nível com os cursos (XP e aumento que consolida; 5 níveis) | v8.8 | a fazer (planejada em 30/10; vem antes da 3a) |
| 2h | A Dani sobe de nível com trabalho e cursos (XP e aumento que consolida) | v8.9 | a fazer (planejada em 30/10; depois da 2g, antes da 3a) |
| 3a | Mudança de ponto e Lanchonete na área industrial (e os caps. 4 e 5) | v9 | a fazer (planejada em 30/10) |
| 3b | Restaurante na Avenida Brasil, o Joca (e o capítulo dela) | v9.1 | a fazer |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 2c-r4 — Lojinha em grupos e fim do dia mais limpo (v8.6.14 e v8.6.15, em 2 sessões)
> Pedido do usuário de 30/10 (texto em `docs/PROPOSTAS.md`), decidido na entrevista da mesma data. Vem antes da 2f. **Sem decisões em aberto:** as duas sessões são de execução, com o Sonnet. Cada sessão é uma versão completa (testes verdes, `docs/spec-vN.md`, `RESUMO.md`, `CLAUDE.md` se mudar algo dos testes, PR com merge no `claude/main`; publicar no artifact só se o usuário pedir). Se a sessão achar algo que o plano não decide, para e pergunta.

**Objetivo:** a lojinha tem 10 abas numa fileira, cansativa de olhar. As melhorias deixam de ter o limite de 1 por dia (a), e as abas viram 4 grupos com cartões (b). No fim do dia, a caixa do Gurugol perde o número entre parênteses (a).

### Sessão 2c-r4a — Sem o limite de 1 melhoria por dia e sem o "(n)" no fim do dia (v8.6.14)
Vem primeiro porque mexe na regra e no balanço; a 2c-r4b só reorganiza a tela.

#### Fim do dia: sem o "(n)" do Gurugol
- O número depois de cada critério, como "Agilidade (4)", é quantas avaliações do dia deram nota àquele critério (v8.6.7). **Sai só da caixa do fim do dia.** Continua na aba Gurugol da lojinha, no `aria-label` e no `title`.
- `src/42-resultados.js`: `gurugolCaixa` (linha `c.nome + (m.cnt ? ' (' + m.cnt[i] + ')' : '')`) ganha uma opção (ex.: `semCnt`) que o fim do dia passa e a aba Gurugol não passa.

#### Melhorias sem o limite de 1 por dia
- O limite agora é o dinheiro. **Os cursos do Tonhão continuam 1 por lojinha** (`cursoTrava`, sem mudança).
- `src/16-jogo.js`: em `buy`, sai `this.shopBought` da condição e das atribuições; saem `shopBought` e `boughtFor` do jogo (construtor, `goShop`, linha 801). Os Tênis de corrida continuam pedindo os Tênis novos (`req`).
- `src/41-lojinha.js`: o texto `#shop-limit` vira "Melhorias à vontade, se o dinheiro der. Cursos: 1 por dia." (modo dev igual); sai o `fecha` por `game.shopBought`. Tirar "fora da melhoria do dia" da descrição do Jogo de pratos (`10-constantes.js`) e de qualquer texto do Como jogar (`40-interface.js`) e da Missão zero (`17-treino.js`) que fale em 1 melhoria por dia (grep "melhoria do dia", "1 melhoria", "uma melhoria").
- Bot (`tests/bot.js`, `carreira.js`, `balance.js`): o bot compra **na ordem de sempre, todas as que o dinheiro der, guardando a folha do dia** (mesma reserva que já usa). **Só medir, sem reajustar preços** (decisão do usuário): rodar `balance.js` (sem equipe, `EQUIPE=auto`, `BOT=afiado`) e `carreira.js`, anotar os números novos na spec e no `CLAUDE.md` e avisar o usuário; se ficar fácil demais, o reajuste é outra conversa.

**Testes:**
- Ajustar os smokes que conferem o limite: `smoke.js:61`, `smoke12.js` (corrida depois dos tênis continua; "uma melhoria por visita" sai), `smoke13.js:32`, `smoke23.js:23 e 32`, `smoke29.js:24`, `smoke30.js:19`: passam a conferir que **dá para comprar 2 melhorias na mesma lojinha** e que **o 2º curso no mesmo dia continua recusado**.
- Smoke novo `smoke32.js`: compra Tênis, Bandeja e Ventilador na mesma lojinha com dinheiro; recusa sem dinheiro; Tênis de corrida antes dos Tênis novos é recusado; 2º curso no mesmo dia recusado; a caixa do fim do dia não tem "(" nos nomes dos critérios e a aba Gurugol tem.
- `balance.js` sem equipe, `EQUIPE=auto` e `BOT=afiado`, e `carreira.js`: anotar antes e depois na spec.

**Partes:** `10-constantes.js` (texto do Jogo de pratos), `16-jogo.js` (`buy`, `shopBought`, `boughtFor`), `17-treino.js` e `40-interface.js` (só textos, se houver), `41-lojinha.js` (`#shop-limit`, `fecha`), `42-resultados.js` (`gurugolCaixa`), `tests/` (`bot.js`, `carreira.js`, smokes).

**Modelo:** Sonnet, esforço médio: regra simples e plano fechado; o trabalho maior é ajustar smokes e rodar o balanço.

### Sessão 2c-r4b — Lojinha em 4 grupos com cartões (v8.6.15)
Depende da 2c-r4a (sem o limite, a seção da Bia não precisa de aviso de "melhoria do dia").

#### O que muda
A fileira `#shop-tabs` (`02-telas.html`) passa a ter 4 botões; ao tocar num grupo, a área da lojinha mostra os **cartões das seções** do grupo; ao tocar num cartão, abre a seção, com um botão **"‹ Voltar"** no alto que volta aos cartões do grupo. **Cartão: só ícone e nome** (sem resumo nem selo), ícones de `upgradeIcon` (`41-lojinha.js`) ou um novo no mesmo estilo.

| Grupo | Cartões (nesta ordem) | Conteúdo |
|---|---|---|
| **Lanchonete** | Melhorias · Salão · Decoração · Manutenção · Divulgação | Melhorias: Água da torneira, Cafeteira de 2 bocas, Ventilador de teto, Triturador de lixo, Jogo de pratos. Divulgação: a de hoje, mais o músico (couvert) e a TV e som, que saem da aba Equipe. Salão, Decoração e Manutenção ficam como estão. |
| **Equipe** | Bia · Tonhão · Dani | Bia: Tênis novos (e os de corrida), Bandeja, Livrinho de Sudoku (saem de Melhorias). Tonhão: o aumento (nível 1 a 3) e os Cursos (a aba Cursos inteira). Dani: contratar, nível e tarefas. |
| **Dinheiro** | Banco · Caixa | Como estão. |
| **Gurugol** | — | Abre direto a aba Gurugol, sem cartões. |

- Estado: `shopTab` continua guardando a seção (`melhorias`, `bia`, `tonhao`, `dani`, `salao`, …) e entra `shopGrupo` (`lanchonete`, `equipe`, `dinheiro`, `gurugol`); `shopTab = null` mostra os cartões. A lojinha abre em **Lanchonete, nos cartões**. Trocar de grupo vai aos cartões dele.
- `buildEquipe` se divide em `buildBia`, `buildTonhao` (aumento + o conteúdo de `buildCursos`) e `buildDani`; os cartões do músico e da TV vão para `buildDivulga`. `buildMelhorias` filtra os ids da Bia (`tenis`, `corrida`, `bandeja`, `sudoku`).
- `window.__lcc.setShopTab(v)` segue funcionando com o nome da seção (acerta o grupo sozinho), para os smokes e scripts de captura antigos; entra `setShopGrupo(g)`.
- CSS (`01-estilo.css`): `.shopcards` (grade de cartões grandes, 3 por fileira; 2 no celular em pé) e o botão Voltar. O menu da lojinha não pode rolar (`menu_fit.py`).

**Testes:**
- Smoke novo `smoke33.js`: a lojinha abre em Lanchonete nos cartões (5 cartões); cada grupo mostra os seus cartões na ordem da tabela; Gurugol abre direto; Voltar volta aos cartões; trocar de grupo vai aos cartões; `setShopTab('cursos')` cai em Equipe › Tonhão; a Bia mostra Tênis, Bandeja e Sudoku e Melhorias não; o músico e a TV aparecem em Divulgação e não em Tonhão nem em Dani.
- Os smokes antigos que usam `setShopTab` continuam verdes sem mudança.
- `python3 menu_fit.py` e uma captura nova `shot_v8_6_15.py` (cartões dos 4 grupos, Bia, Tonhão, Divulgação; tela larga e celular em pé) em `capturas/v8.6.15`, conferida por recortes.

**Partes:** `02-telas.html` (`#shop-tabs`), `01-estilo.css` (`.shopcards`, Voltar), `41-lojinha.js` (grupos, cartões, `buildBia`/`buildTonhao`/`buildDani`, músico e TV em `buildDivulga`, filtro em Melhorias), `43-telas.js` (`__lcc`), `tests/`.

**Modelo:** Sonnet, esforço médio: só interface, com a tabela de grupos e os nomes já decididos.

---

## Etapa 2f — A campanha vira o Modo História (v8.7) — FEITA em 30/10 (`docs/spec-v8.7.md`)
> Decidido na revisão de 28/10: a campanha (Carreira) e o Modo História viram uma coisa só, com um save só. Esta etapa monta a estrutura e os 3 capítulos da Garagem; os capítulos dos outros pontos entram nas etapas 3a, 3b e 4a, e o final na etapa 6. Substitui a antiga etapa 5. **Planejada com o usuário em 30/10** (respostas em `docs/PROPOSTAS.md`): as decisões abaixo estão tomadas.

**Objetivo:** "o sonho da Bia de ter um restaurante estrelado, começando do zero". Os dias da campanha contam a história em capítulos, com a abertura animada como prólogo e a dívida da reforma da garagem desde o dia 1.

### Decisões tomadas (30/10)
- **A Carreira some; tudo é a História.** Um save só (`lcc2_save`), os dias continuam os da campanha (`DAYS`, `SEMANA`).
- **Objetivo não cumprido:** o capítulo continua, dia após dia, até cumprir. Sem prazo e sem game over próprio (o que pune é só o banco, como na v8.3.1).
- **Dívida da reforma:** R$ 1.000 em 10 parcelas de R$ 100, juros de 1% ao dia sobre o saldo, a 1ª parcela no fim do dia 2 (quita no fim do dia 11 sem amortizar). O atraso da v8.3.1 vale (2 dias atrasados: o banco toma a lanchonete).
- **A Dani entra de graça, como o Tonhão:** no começo do cap. 2 chega como aprendiz, sem salário, e sobe de nível com aumentos na lojinha (ideia do usuário).
- **Trama:** na Garagem, só uma pista no fim do cap. 3 (o Tonhão e o cominho com açafrão). O Bráulio não é citado.
- **Conversas:** balões sobre o salão (o dia parado e escurecido ao fundo), não um painel.
- **Save antigo:** recomeça do dia 1, com aviso, como a v8.6.9 fez com os cursos.
- **1ª vez:** abertura → Missão zero (se ainda não fez) → conversa do cap. 1 → dia 1.
- **Depois do cap. 3:** os dias seguem como hoje, sem objetivo, com um cartão "Continua na próxima versão".

### Capítulos (`HISTORIA` em `10-constantes.js`)
`const HISTORIA = [{ cap, titulo, ponto:'garagem', obj:{...}, objTxt, antes:[falas], depois:[falas] }]`; fala = `{ q:'bia'|'tonhao'|'dani', s:'texto', nota?:'rubrica' }` (a `nota` sai em itálico pequeno, acima do texto, no mesmo balão). `save.cap` (1 a 3; 4 = Garagem completa), `save.capDia` (o dia em que o capítulo começou), `save.capAzul` (dias no azul do cap. 1), `save.conversa` (`'antes'`/`'depois'` pendente, ou null).

**Cap. 1, "A garagem da Rosa"** — objetivo `{ azul:2 }`: fechar 2 dias no azul (lucro do dia > 0; não precisam ser seguidos). Texto: "Fechar 2 dias no azul (x de 2)".
- Antes: Tonhão "Panela no fogo, avental no lugar. Abre o portão, Bia!" / Bia "A garagem da mãe... Ela ia gostar de ver isso cheio de gente." / Tonhão "Então vamos encher! E fechar o dia no azul, que o banco não espera."
- Depois: Bia "Dois dias no azul, tio!" / Tonhão "Isso! Agora é aguentar a parcela todo dia."

**Cap. 2, "A Dani chega"** — ao começar, a Dani entra na equipe no nível 1 (aprendiz). Objetivo `{ nota:2.4 }`: nota geral do Gurugol (`avalGeral(save.aval)`) de 2,4 ou mais no fim de um dia. Texto: "Nota do Gurugol 2,4 (agora x,x)".
- Antes: Bia "Não dou conta da mesa e da pia ao mesmo tempo..." / Tonhão "Pedi ajuda pra Dani, filha da vizinha. Ela vem aprender com a gente." / Dani "Sou meio lenta ainda, mas aprendo rápido!"
- Depois: Dani "Ouvi um freguês dizer que aqui é tudo limpinho!" / Bia "O Gurugol subiu, tio! Já tá em 2,4." / Tonhão "Devagar e sempre."
  (as falas de depois foram aprovadas para "3 dias no azul"; o objetivo escolhido virou a nota, e só o texto delas foi trocado para combinar)

**Cap. 3, "Casa cheia"** — objetivo `{ quitar:true, nota:2.7, caixa:800 }`, tudo ao mesmo tempo no fim de um dia: sem dívida no banco (`save.emp.resto === 0`), nota geral 2,7 e R$ 800 no caixa. Texto: "Quitar a reforma (faltam R$ x) · nota 2,7 (agora x,x) · R$ 800 no caixa (agora R$ x)", cada item com ✓ quando cumprido.
- Antes: Bia "O Gurugol tá cheio de comentário sobre a gente!" / Dani "Tem freguês perguntando se a gente vai abrir num lugar maior." / Tonhão "Primeiro quita a reforma. Depois junta pra mudança."
- Depois: Bia "Reforma quitada e R$ 800 guardados!" / Tonhão (nota: "cheirando o pote de cominho") "Cominho com açafrão... a Rosa ia rir de mim agora." / Bia "Por quê, tio?" / Tonhão "Um dia eu te conto da Casa Aurora."
- Em seguida, o cartão (painel simples, um botão "Seguir jogando"): **"Fim dos capítulos da Garagem. Continua na próxima versão: a área industrial."** `save.cap = 4`; os dias seguem sem objetivo.

### O que muda, parte por parte
- **`10-constantes.js`:** `HISTORIA` (acima) e `REFORMA = { valor:1000, amort:100, juros:0.01, ini:2 }`. `STAFF.dani.levels` vira `[ null, { speed:0.4, tasks:1, pay:0 }, { speed:0.5, tasks:2, pay:25 }, { speed:0.65, tasks:2, pay:40 }, { speed:0.8, tasks:3, pay:55 } ]` (o nível 1 é a aprendiz nova; os níveis 2 a 4 são os antigos 1 a 3, mais baratos). `normEmprestimo` guarda `ini` (sem parcela nem juros antes do dia `ini`) e `ref:true` (é a reforma). Nota do dia 3 (`DAYS[2].note`): tirar "contrate ajuda na lojinha" (fica "O movimento aumentou e agora só há 4 pratos limpos. A executiva..."). `FOLHA_CORTE` perde a Dani (ela não sai da folha; os aumentos dela, sim, podem ser cortados como o do Tonhão: volta ao nível 1).
- **`12-clientes.js` (`normSave`):** campos `cap`, `capDia`, `capAzul`, `conversa`, `histV:1`. Save sem `histV` e com jogo (dia > 1 ou dinheiro diferente do inicial) recomeça do dia 1 guardando só `treino`, e liga `avisoHist` (como o `cardV`/`avisoCard` da v8.6.9). Save novo: `emp` = a reforma (`resto:1000, amort:100, j:0.01, ini:2, ref:true`), `cap:1`, `conversa:'antes'`, `eq.dani:0`.
- **`16-jogo.js`:** `capObj(sv)` devolve `{ ok, itens:[{txt, ok}] }` do capítulo atual; no fim do dia (onde fecha o resultado, perto da linha 785), conta `capAzul`, confere o objetivo e, se cumpriu, marca `sv.conversa = 'depois'` e põe `cap` e `objetivo` no `this.result`. `avancaCap(sv)`: cap+1, `capDia`, `conversa:'antes'`; ao entrar no cap. 2, `eq.dani = Math.max(eq.dani, 1)`. As parcelas e os juros respeitam `emp.ini`. `podeEmprestar` já é um por vez: com a reforma, só o empréstimo à força soma (como hoje).
- **`19-conversa.js` (parte nova):** classe `Conversa(falas, fim)`: uma fala por vez, toque/clique/Enter/espaço passa, "Pular" fica à vista, `fim()` no final. Com `prefers-reduced-motion`, sem animação de entrada.
- **`26-conversa.js` (parte nova):** `drawConversa(g, conv)`: o salão do dia como fundo (o `render` normal, parado), um véu escuro (`rgba(0,0,0,.45)`) e o balão saindo de quem fala (Bia onde ela está; Tonhão na janela da cozinha; Dani onde ela está, ou ao lado da Bia se ainda não entrou). Reaproveitar o balão de fala das cenas da abertura (`25-abertura.js`), com o nome de quem fala e "toque para seguir" pequeno.
- **`02-telas.html`:** sai o painel "Em breve: o Modo História"; entra `#ov-continua` (o cartão do fim do cap. 3); o botão "História" vira **"Ver abertura"**; o rótulo `#menu-dia` passa a dizer "História"; o botão Carreira do seletor do ranking (`data-v="carreira"`) passa a dizer "História"; nova entrada da v8.7 no `#ov-ver`.
- **`18-abertura.js` / `43-telas.js`:** o fim da abertura que tocou sozinha (save novo) segue para a Missão zero (se `!save.treino`) ou para a conversa do cap. 1; vista pelo "Ver abertura", volta ao menu. "Continuar": se `save.conversa === 'antes'`, toca a conversa antes da introdução do dia; a de `'depois'` toca ao fechar a tela de fim do dia, antes da lojinha (e, no cap. 3, depois dela vem o `#ov-continua`). Ao terminar a Missão zero vinda da 1ª vez, segue para a conversa do cap. 1.
- **`40-interface.js`:** rótulo do menu "História · cap. 2, A Dani chega · dia 5" (`save.cap = 4`: "História · Garagem completa · dia 15"; `fechou`: "História: o banco fechou no dia N"); aviso `avisoHist`: "Novidade: a campanha virou o Modo História, com a dívida da reforma da garagem. Por isso, recomeçou do dia 1."; "Como jogar": trocar "Carreira" por "História" e explicar capítulos, objetivo e a reforma em 2 frases.
- **`41-lojinha.js`:** aba Banco, com a reforma, título "Reforma da garagem" e "1ª parcela no fim do dia 2" enquanto `dia < ini`; aba Equipe, a Dani mostra "Aprendiz (sem salário)" e "Aumento: R$ 25/dia" (como o card do Tonhão), sem botão de dispensar; antes do cap. 2, o card da Dani diz "Chega no capítulo 2".
- **`42-resultados.js`:** no fim do dia, uma linha do capítulo: "Capítulo 2, A Dani chega: nota do Gurugol 2,4 (agora 2,3)" ou "✓ Objetivo cumprido!". Na introdução do dia (`22-salao-hud.js` ou onde fica a nota do dia), a mesma linha do objetivo.
- **`30-ranking.js`:** o tipo interno continua `'carreira'` (coleção `ranking-campanha`), só os textos dizem "História".

### Testes
- **`tests/smoke32.js` (novo):** (1) save novo: reforma de R$ 1.000, sem parcela no fim do dia 1, R$ 100 + juros no fim do dia 2; (2) fim da abertura automática vai à Missão zero e depois à conversa do cap. 1 (com `save.treino`, direto à conversa); (3) a conversa passa fala a fala com toque e com "Pular" e grava `conversa:null`; (4) cap. 1 com 1 dia no azul continua, com 2 avança e marca `'depois'`; (5) entrar no cap. 2 põe a Dani no nível 1 com folha R$ 0; (6) cap. 2 não cumprido (nota 2,3) continua; cumprido (2,4) avança; (7) cap. 3 só cumpre com os 3 itens juntos (testar faltando cada um); depois dele, `cap:4`, o `#ov-continua` e o dia seguinte sem objetivo; (8) save da v8.6.13 (sem `histV`) recomeça com aviso e mantém `treino`; (9) a reforma bloqueia empréstimo novo e o atraso de 2 dias fecha a lanchonete; (10) o menu diz "História" e o botão "Ver abertura" toca a abertura e volta ao menu.
- Ajustar os smokes antigos que esperam a Dani nos níveis 1 a 3 com salários de 40 a 60, o "Carreira" no menu, o "Em breve" e o save novo sem dívida (o `harness.js` pode ganhar `load({semReforma:true})` para os testes antigos de banco).
- **`bot.js`/`balance.js`/`carreira.js`:** os níveis da Dani mudaram de índice (o bot paga a Dani "de hoje" = nível 2). O `carreira.js` joga a História e mostra o dia em que cada capítulo foi cumprido (linha `HISTORIA`).
- **Alvos e como decidir:**
  - `node carreira.js 3` (padrão e `MOVEIS=quatro`, `DIAS=20`): **0 dias no negativo** nos dias 1 a 14. Se houver, `REFORMA.ini` passa a 3; se ainda houver, `amort` 80.
  - Cap. 1 cumprido no dia 2 em 3/3; cap. 2 até o dia 5 em ≥ 2/3.
  - Cap. 3: com `MOVEIS=quatro`, até o dia 14 em ≥ 2/3; com o bot padrão, até o dia 20 em ≥ 2/3. Se o padrão não chegar, baixar a nota do cap. 3 para 2,6 (não mexer no caixa nem na quitação, que o usuário escolheu "mais difícil").
  - `node balance.js` com `EQUIPE=auto`: alvo ~85–95% (a Dani mais barata dá ~R$ 15 a 40 por dia). Se passar de 95%, subir as metas dos dias 3 a 7 em 10% (arredondar para 5).
- Capturas: `tests/shot_v8_7.py` em `capturas/v8.7` (menu, conversa do cap. 1 e a do cap. 3 com a rubrica, fim do dia com o objetivo, aba Banco com a reforma, aba Equipe com a aprendiz, `#ov-continua`, celular).

### Fechamento
v8.7: guardar a v8.6.13 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v8.7.md`, `docs/RESUMO.md`, CLAUDE.md (partes novas `19-conversa.js` e `26-conversa.js`, smoke 32, alvos novos do `carreira.js`), PR e merge.

**Fora:** os capítulos dos outros pontos (3a, 3b, 4a), o crítico do Michelzão e o final (etapa 6), desenho novo de objetos (o pote de cominho fica só na rubrica da fala).

**Lojinha:** a 2c-r4b (v8.6.15) reorganiza a lojinha em 4 grupos com cartões antes desta etapa; onde se lê "aba Banco" e "aba Equipe", aplique nos cartões equivalentes (o do banco e o da Dani).

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas mexe em muitas partes ao mesmo tempo, no save e nos smokes antigos, e o balanceamento da dívida pode pedir uma rodada de ajuste.

---

## Etapa 2g — O Tonhão sobe de nível com os cursos (v8.8)
> **Feita em 30/10 (v8.8)**, ver `docs/spec-v8.8.md`. Desvio: as diárias dos níveis 3 a 5 baixaram para 20 / 25 / 30 pela conferência do "Reduzir"; o bot da carreira compra o curso antes dos móveis, com reserva de R$ 150.
> **Planejada com o usuário em 30/10** (texto em `docs/PROPOSTAS.md`), para vir **antes da 3a**. Hoje o nível do Tonhão é só salário: paga o aumento e ele melhora. Passa a ser **experiência (XP)**: cada curso dá XP; com a XP do nível seguinte, ele fica **pronto para subir**, e o aumento de salário **consolida** o nível. Vale para a Garagem e a área industrial; na Avenida Brasil e no Terraço o processo vai ser outro (ver Ideias guardadas).

#### Decisões tomadas (30/10)
- **5 níveis** (eram 3). **XP:** curso básico **+1**, curso avançado **+2** (o "Carnes variadas" do PF conta como avançado, +2; o PF não tem básico). XP máxima: 5 básicos + 6 avançados = **17**.
- **XP para cada nível:** nível 2 com **2**, nível 3 com **5**, nível 4 com **9**, nível 5 com **14**. Os níveis 4 e 5 só chegam com cursos avançados.
- **O aumento consolida:** com a XP, o botão "Aumento" acende; sem ela, fica apagado e diz quanto falta. Pode pagar o aumento no mesmo dia do curso. Sem dinheiro para a folha (chave "cortar" ligada), o Tonhão cai 1 nível como hoje (`folhaCorta`), mas a XP fica: dá para pagar o aumento de novo depois, sem refazer cursos.
- **"Reduzir": sai, se o aumento se paga** (pedido do usuário: o nível pago é definitivo). A sessão confere no `balance.js` (abaixo) que cada nível rende ao menos a diária dele; se algum não render, baixa a diária desse passo de R$ 5 em R$ 5 até render, e então tira o "Reduzir". Assim o nível pago é sempre para sempre (só a falta de dinheiro derruba).
- **Saves antigos são rebaixados à XP:** quem pagou aumento sem ter os cursos volta ao nível que a XP dos cursos já feitos permite (e a diária cai junto). Uma vez só, na leitura do save guardado (`loadSave`), marcada com `tonXp:1`. O `normSave` **não** rebaixa (os testes e bots montam equipes à mão).
- **Modo dev:** o aumento ignora a XP (qualquer nível, como hoje).

#### Os níveis (`STAFF.tonhao.levels`, `10-constantes.js`)
| Nível | XP | Rapidez (`cook`) | Caprichados (`crit`) | Pia (`wash`, s por pilha) | Diária (`pay`) | Faixa do prato no Gurugol (`AVAL.prato`) |
|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 0,05 | não | R$ 0 | 2,5 a 4,5 |
| 2 | 2 | 0,85 | 0,12 | 7 | R$ 15 | 3 a 4,7 |
| 3 | 5 | 0,7 | 0,2 | 4 | R$ 30 | 3,5 a 5 |
| 4 | 9 | 0,62 | 0,26 | 3 | R$ 45 | 3,8 a 5 |
| 5 | 14 | 0,55 | 0,32 | 2,5 | R$ 60 | 4 a 5 |
- `slots` continua 3 em todos (a 4ª boca vem do fogão industrial da 3a). Cada nível ganha o campo `xp`.

#### O que muda, parte por parte
- **`10-constantes.js`:** os 5 níveis acima; `AVAL.prato` com 5 faixas; `CURSO_XP = { basico:1, avancado:2 }`; `tonhaoXp(cursos)` (soma: +1 por curso com `preco > 0` e nível ≥ 1, +2 por nível 2; o PF só conta o avançado); `tonhaoNivelXp(cursos)` (o maior índice de nível cuja `xp` cabe). O comentário do `STAFF.tonhao` explica a regra nova.
- **`12-clientes.js`:** `normSave` aceita `tonhao` de 0 a 4 (`STAFF.tonhao.levels.length - 1`); `loadSave` faz a rebaixa única (`tonXp`).
- **`16-jogo.js`:** `setStaff('tonhao', v)` recusa `v` acima de `tonhaoNivelXp` (fora do modo dev) e, sem o "Reduzir", recusa baixar. `buyCurso`: se o curso deixou o Tonhão pronto para subir, `cursoMsg` ganha **" Ele já pode subir para o nível N: pague o aumento no cartão dele."**
- **`41-lojinha.js` (`buildTonhao`):** título **"Tonhão · nível N de 5"**; uma linha **"Experiência: X de Y para o nível N+1"** com uma barrinha (no nível 5: **"Experiência: X · nível máximo"**). Abaixo, a comparação de hoje (`tRows`). Botão: com XP, **"Aumento: +R$ 15/dia"** (a diferença de diária), aceso se a folha couber; sem XP, apagado, com a frase **"Faltam Z de experiência: cada curso básico dá +1 e cada avançado +2."** Sem o botão "Reduzir" (se a conferência abaixo mandar tirar). Nos cartões de curso (`buildCursos`), ao lado do preço: **"+1 de experiência"** ou **"+2 de experiência"**.
- **`40-interface.js` (Como jogar):** a frase do Tonhão vira **"O Tonhão sobe de nível com experiência: cada curso dá XP e, quando ele estiver pronto, o aumento de salário confirma o nível novo."**
- **`42-resultados.js`:** nada novo (a folha já mostra a diária).
- O resumo do Caixa (`41-lojinha.js:644`) já diz "Tonhão nível N"; conferir que vai até 5.

#### Testes
- **`tests/smoke35.js` (novo; o smoke da 2h é o 36 e o da 3a, o 37):** (1) `tonhaoXp`: nada = 0; pastel e chapa básicos = 2; pastel básico e avançado = 3; PF avançado = 2; tudo = 17; (2) `tonhaoNivelXp` nos limites: 1→nível 1, 2→nível 2, 4→2, 5→3, 9→4, 13→4, 14→5; (3) sem cursos, `setStaff('tonhao',1)` recusa; depois de 2 cursos, aceita e a folha sobe R$ 15; pedir o nível 3 com XP 2 recusa; (4) `buyCurso` que completa a XP põe a frase "já pode subir" no `cursoMsg`; (5) lojinha: título "nível 1 de 5", linha de experiência, botão apagado com "Faltam 2"; com XP, "Aumento: +R$ 15/dia" aceso; sem "Reduzir"; cartão de curso com "+1 de experiência"; (6) folha que não cabe derruba 1 nível e o aumento volta a acender sem curso novo; (7) `loadSave` de um save guardado com `tonhao:2` e 1 curso volta ao nível 1 e grava `tonXp:1`; carregar de novo não mexe; save com `tonhao:2` e 5 de XP fica no 3; (8) nível 5: `cook` 0,55 nos tempos da cozinha e faixa 4 a 5 no `AVAL.prato`; (9) modo dev: aumento sem XP.
- Ajustar os smokes que esperam 3 níveis (`smoke6` no laço `[0,1,2]` está certo; procurar `de 3` e `levels[2]` como "máximo") e os que pagam aumento sem cursos pela lojinha (dar `cursos` no save do teste).
- **`balance.js`:** `FULL` continua `tonhao:2` (os alvos de hoje não mudam). Conferência do "Reduzir": `EQUIPE='{"tonhao":k}' node balance.js 40` para k = 0 a 4 (com `dani:4`), olhando o lucro médio dos dias 3 a 7. **Cada passo (k → k+1) deve render ≥ R$ 15 a mais por dia** em ≥ 4 dos 5 dias. Se render, tira o "Reduzir"; se um passo não render, baixa a diária dele de R$ 5 em R$ 5 (sem passar da diária do nível de baixo + R$ 5) e confere de novo. Anotar a tabela em `docs/spec-v8.8.md`.
- **`carreira.js` e `emprestimo.js`:** o bot não pode mais pôr o Tonhão acima da XP: no `FULL`, o `tonhao` vira `Math.min(tonhao, L.tonhaoNivelXp(g.save.cursos))`, e o `FULL` passa a começar com `tonhao:4` (`{tonhao:4,dani:4,tv,som}`, `{tonhao:3,...}`, depois os de hoje). A linha `HISTORIA` (ou uma linha nova `TONHAO`) mostra o dia médio em que ele chega a cada nível. **Alvos:** nível 2 até o dia 6 e nível 3 até o dia 12, em média (`node carreira.js 3`); os caps. 1 a 3 no mesmo dia da v8.7 ±2; 0 dia no negativo a mais que na v8.7. Se o nível 3 passar do dia 12, `xp` do nível 3 vira 4; não mexer no preço dos cursos.
- Capturas: `tests/shot_v8_8.py` em `capturas/v8.8` (cartão do Tonhão sem XP, pronto para subir, nível 5; cartão de curso com o "+1 de experiência"; celular).

#### Fechamento
v8.8: guardar a v8.7 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v8.8.md` (com a tabela da conferência do "Reduzir"), `docs/RESUMO.md`, CLAUDE.md (smoke 35), PR e merge.

**Fora:** a progressão dos cozinheiros da Avenida Brasil e do Terraço (Ideias guardadas); cursos novos.

**Modelo:** Sonnet, esforço médio. Tudo decidido; a única conta é a conferência do "Reduzir" no `balance.js`, com a regra escrita acima.

---

## Etapa 2h — A Dani sobe de nível com trabalho e cursos (v8.9)
> **Feita em 30/10 (v8.9)**, ver `docs/spec-v8.9.md`. Desvios: `DANI_XP.tarefas` ficou 5 (a calibração pelo bot); as diárias baixaram para 15 / 20 / 25 pela conferência do "Reduzir"; a numeração das mensagens segue o título do cartão (o 1º aumento é "para o nível 1"); o smoke da Dani é o `smoke37` (o 36 foi tomado pela v8.8.1, "Pular tutorial"), então o smoke da 3a passa a ser o 38.
> **Planejada com o usuário em 30/10** (texto em `docs/PROPOSTAS.md`), depois da 2g e **antes da 3a**. Mesma ideia do Tonhão: a experiência (XP) deixa a Dani **pronta para subir**, e o aumento de salário **consolida** o nível. A XP dela vem **de dois jeitos**: do trabalho (ela aprende fazendo) e de cursos dela na lojinha. Depende da 2g (v8.8): reaproveita a regra do aumento, a barrinha de experiência e a conferência do "Reduzir".

#### Decisões tomadas (30/10)
- **Os 4 níveis de hoje** (aprendiz, 2, 3 e 4), com a velocidade, as tarefas e as diárias de hoje (`STAFF.dani.levels`: R$ 0, 25, 40, 55). Muda só o jeito de subir. Cada nível ganha o campo `xp`: **aprendiz 0, nível 2 com 4, nível 3 com 8, nível 4 com 13**.
- **XP do trabalho:** cada tarefa que ela termina conta 1 (`save.daniTar`, o total da carreira): lixo esvaziado, viagem de pratos sujos, pilha lavada, cafezinho servido, água/suco da espera levado, marmita levada ao balcão. **A cada `DANI_XP.tarefas` tarefas, +1 XP** (valor inicial **30**; ver Testes). Só o dia completo conta (regra da v8.2.2): as tarefas do dia entram no save no fim do dia, junto com a folha.
- **XP dos cursos:** 3 cursos dela, **+2 XP cada** (6 no total, então o nível 4 sempre pede trabalho). Só dão XP, sem outro efeito por enquanto:
  - **Atendimento ao cliente** — R$ 120
  - **Organização da cozinha** — R$ 150
  - **Barista iniciante** — R$ 180 (a semente da Dani barista; ver Ideias guardadas)
  
  Um curso da Dani por lojinha, com a trava própria (`save.daniCursoDia`), à parte da do Tonhão: no mesmo dia dá para fazer um curso de cada um. Os cursos só aparecem depois que ela chega (cap. 2; no modo dev, sempre).
- **Igual ao Tonhão (2g):** o aumento acende com a XP e pode ser pago no mesmo dia; sem dinheiro para a folha ela cai 1 nível (nunca abaixo de aprendiz) e a XP fica; o **"Reduzir" sai** se a conferência abaixo mostrar que cada nível rende a diária dele (senão, baixa a diária desse passo de R$ 5 em R$ 5 até render); saves antigos são **rebaixados ao nível da XP** (os cursos não existiam, então a XP de um save antigo é 0 e ela volta a aprendiz), uma vez só no `loadSave`, marcada com `daniXp:1`; o `normSave` não rebaixa; modo dev ignora a XP.

#### O que muda, parte por parte
- **`10-constantes.js`:** `xp` em cada nível de `STAFF.dani.levels`; `DANI_XP = { tarefas:30, curso:2 }`; `DANI_CURSOS = [{ id:'atend', nome:'Atendimento ao cliente', preco:120 }, { id:'cozinha', nome:'Organização da cozinha', preco:150 }, { id:'barista', nome:'Barista iniciante', preco:180 }]`; `daniXp(save)` (= 2 × cursos feitos + `floor(daniTar / DANI_XP.tarefas)`) e `daniNivelXp(save)` (o maior nível cuja `xp` cabe, no mínimo 1 quando ela já chegou).
- **`12-clientes.js`:** `normSave` com `daniTar` (inteiro ≥ 0), `daniCursos` (`{ id:1 }`) e `daniCursoDia`; `loadSave` com a rebaixa única (`daniXp`).
- **`15-dani.js`:** `this.feitas` (zera no `reset` do dia) +1 onde cada tarefa termina (as 6 acima; uma pilha lavada conta 1, uma viagem de pratos conta 1 mesmo com 2 pilhas).
- **`16-jogo.js`:** no fim do dia completo, `save.daniTar += dani.feitas`; `setStaff('dani', v)` recusa acima de `daniNivelXp` (fora do modo dev) e, sem o "Reduzir", recusa baixar (contratar a aprendiz continua livre, de graça, no cap. 2); `buyDaniCurso(id)` (desconta, `caixaGasto(..., 'mel', ...)`, grava a trava; mensagem **"A Dani foi fazer o curso de X!"** e, se ficou pronta, **" Ela já pode subir para o nível N: pague o aumento no cartão dela."**).
- **`41-lojinha.js` (`buildDani`):** título como hoje ("Dani · aprendiz (sem salário)" / "nível N de 3"); a linha **"Experiência: X de Y para o nível N"** com a barrinha da 2g e, embaixo, em letra menor, **"Trabalho: Z tarefas até o próximo ponto"**; botão **"Aumento: +R$ 15/dia"** aceso com XP, ou apagado com **"Faltam Z de experiência: ela aprende trabalhando e com os cursos (+2 cada)."**; sem "Reduzir" (se a conferência mandar). Logo abaixo do cartão dela, os 3 cartões de curso da Dani (no estilo dos do Tonhão, com **"+2 de experiência"**; feito: **"Curso feito"**; trava: **"A Dani já está num curso. Volte depois do próximo dia."**).
- **`42-resultados.js` (fim do dia):** com a Dani na equipe, uma linha **"Dani: N tarefas hoje · experiência X"**; se ficou pronta, **"A Dani já pode subir para o nível N!"**.
- **`40-interface.js` (Como jogar):** **"A Dani aprende trabalhando: cada tarefa conta, e os cursos dela ajudam. Quando estiver pronta, o aumento confirma o nível novo."**

#### Testes
- **`tests/smoke36.js` (novo; o smoke da 3a passa a ser o 37):** (1) `daniXp`: nada = 0; 29 tarefas = 0; 30 = 1; 1 curso + 60 tarefas = 4; (2) `daniNivelXp`: 3→1, 4→2, 8→3, 12→3, 13→4; (3) aumento recusado sem XP, aceito com XP, a folha sobe a diferença; (4) um dia completo com a Dani lavando soma as tarefas em `daniTar`; dia interrompido não soma; (5) curso: desconta, +2 XP, trava do dia (um da Dani e um do Tonhão no mesmo dia, sim; dois da Dani, não); antes do cap. 2 os cursos não aparecem; (6) lojinha: linha de experiência, "Faltam", "+2 de experiência", sem "Reduzir"; (7) fim do dia com a linha da Dani e o "já pode subir"; (8) folha que não cabe derruba 1 nível (não abaixo de aprendiz) e a XP fica; (9) `loadSave` de save antigo com `dani:4` volta a aprendiz e grava `daniXp:1`; (10) modo dev: aumento sem XP.
- Ajustar os smokes que pagam aumento da Dani pela lojinha sem XP (dar `daniTar` ou `daniCursos` no save do teste).
- **Calibrar `DANI_XP.tarefas`:** `node carreira.js 3` com uma linha nova **`DANI`** (tarefas por dia em média, por nível, e o dia médio em que ela chega a cada nível). Escolher o número redondo (de 5 em 5) que dê **1 XP a cada ~1,5 dia** trabalhado como aprendiz. Alvos, com o bot fazendo os cursos dela quando sobra o preço + a reserva de R$ 300: **nível 2 até o dia 7, nível 3 até o dia 11, nível 4 até o dia 16**. Se o nível 4 passar do dia 16, `xp` do nível 4 vira 12; não mexer no preço dos cursos.
- **Conferência do "Reduzir":** como na 2g, `EQUIPE='{"tonhao":2,"dani":k}' node balance.js 40` para k = 1 a 4, lucro médio dos dias 3 a 7: cada passo deve render a diferença de diária (R$ 25, 15, 15) em ≥ 4 dos 5 dias. Tabela em `docs/spec-v8.9.md`.
- **`carreira.js` e `emprestimo.js`:** o `dani` do `FULL` vira `Math.min(dani, L.daniNivelXp(g.save))` (como o Tonhão na 2g); o bot compra os cursos da Dani (na ordem acima) depois do curso do Tonhão do dia. Os caps. 1 a 3 no mesmo dia da v8.8 ±2; nenhum dia no negativo a mais.
- Capturas: `tests/shot_v8_9.py` em `capturas/v8.9` (cartão da Dani aprendiz com a barrinha, pronta para subir, cursos dela, linha do fim do dia, celular).

#### Fechamento
v8.9: guardar a v8.8 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v8.9.md`, `docs/RESUMO.md`, CLAUDE.md (smoke 36, linha `DANI` do `carreira.js`), PR e merge.

**Fora:** a Dani barista/confeiteira, o Joca e o funcionário novo (Ideias guardadas).

**Modelo:** Sonnet, esforço médio. Tudo decidido; a calibração de `DANI_XP.tarefas` e a conferência do "Reduzir" têm regra escrita.

---

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).

### Vale para a 3a e a 3b
- **Mudança** na lojinha (aba "Ponto"): custo único, aluguel dali em diante e os móveis levados junto. O editor abre no ponto novo com a arrumação automática.
- Para mudar, é preciso o dinheiro da mudança **e a nota mínima do Gurugol** (etapa 2c; o usuário pediu 4,5 ★ para sair da Garagem, que exige jogar muito bem: o bot afiado ficava entre 4,35 e 4,5. Desde a v8.6.4, com o teto de 3 ★ da Garagem, o equivalente é ~2,8 ★. **Decidido em 30/10:** `avalMinimo`, 90% do teto: 2,7 para sair da Garagem e 3,4 da área industrial). Ao mudar, as avaliações antigas continuam na média, e a nota sobe aos poucos até o teto novo.
- Cada ponto traz: multiplicador do cardápio (sugestão: ×1 e ×1,4), mistura de clientes, área útil, cadeiras de espera, visual (piso, fachada, letreiro, vista da janela, calçada) e o **capítulo da história** do ponto.
- **Ao mudar, o ambiente e a bebida da espera são trocados** pelos do ponto novo (decidido em 21/10): a TV e o som da Garagem saem do save (`equipe.tv`, `equipe.som`), como o couvert abaixo do nível 3. A torneira sai do mesmo jeito (decidido em 30/10).
- **Modo dev** (v7.5.1): os pontos entram liberados, para testar.
- O ranking da carreira segue a regra da 2b, com o ponto alcançado ao lado.
- O "cardápio maior" dos pontos de cima mexe na diversidade do cardápio do Gurugol (`avalMenu`).

### Sessão 3a — Mudança de ponto e Lanchonete na área industrial (v9)
> **Planejada com o usuário em 30/10** (respostas em `docs/PROPOSTAS.md`): as decisões abaixo estão tomadas. Depende da 2f (v8.7): `HISTORIA`, `Conversa`, `capObj`, `#ov-continua`, a reforma e a Dani aprendiz. **O Joca saiu desta etapa:** entra na 3b (Avenida Brasil), contratado com salário.

#### Decisões tomadas (30/10)
- **A mudança é para sempre:** não dá para voltar à Garagem.
- **Quando aparece:** depois do cap. 3 (`save.cap >= 4`), o cartão **"Mudança"** entra na lojinha (no grupo do banco/contas da 2c-r4b). Para mudar: R$ 800 no caixa **e** nota do Gurugol ≥ `avalMinimo(garagem)` (2,7) no dia. Sem um dos dois, o cartão mostra o que falta ("Falta R$ x" / "Nota 2,7 (agora x,x)") e o botão fica apagado. O cartão `#ov-continua` do fim do cap. 3 muda de texto: **"Fim dos capítulos da Garagem. Quando quiser, a mudança para a área industrial está na lojinha."**
- **O que vai junto:** mesas e cadeiras (o editor abre no ponto novo com a arrumação automática), pratos, cursos, equipe, melhorias que não são do ponto, desgaste e o empréstimo. **Saem do save, sem devolver dinheiro:** TV, som (`equipe.tv`, `equipe.som`) e a Água da torneira (`up.maquina`). O limite do banco (`credito`) sobe de R$ 1.000 para R$ 2.000.
- **Gurugol:** as avaliações antigas continuam na média; as novas já vêm na escala do teto 3,7, e a nota sobe aos poucos. Nota mínima para sair da área industrial: `avalMinimo` = **3,4** (90% de 3,7).
- **Balcão de pratos com 5 vagas:** vem com o ponto (5ª vaga em `PLATE_SLOTS`, só quando `ponto.pratos === 5`; o `plates` do `13-cozinha.js` passa a ter o tamanho do ponto).

#### O ponto (`PONTOS[1]` em `10-constantes.js`)
`{ id:'industrial', nome:'Lanchonete na área industrial', nivel:2, lugares:20, aluguel:120, mudanca:800, credito:2000, cardapio:1.2, area:(a da Garagem; se 20 lugares não couberem no arranjo automático, alargar x0 para 160), espera:5, assento:'pe', bebida:'suco', pratos:5, prateleira:4, tipos:{ estudante:1, executiva:1, familia:0.5, vovos:0.7, entregador:2, turma:2, motorista:1 }, encomenda:0.6, apito:{ quando:0.45, max:3, gap:[8,12], aviso:10 }, patPressa:0.85, vip:0.3, metaF:1.25 }`
- **Aluguel:** R$ 120 nas contas do fim do dia (linha "Aluguel" no fim do dia e no livro-caixa). Segue a regra da v8.2.2: só o dia completo cobra, junto com a folha; dia interrompido não paga aluguel.
- **Cardápio ×1,2:** `precoPrato` já multiplica pelo ponto.
- **Clientela "pressa e entrega":** na área industrial, o tipo de cada grupo sai de `ponto.tipos` (pesos), no lugar do `day.types` da Garagem; o tipo da semana (`day.tipo`) e o clima continuam valendo por cima. Grupos de 1 e 2 pessoas têm paciência ×`patPressa` (0,85). A chance de VIP vai ×`vip` (0,3). O pico do meio do dia é o **apito da fábrica** (abaixo). Os 3 clientes novos estão em "Clientes da área industrial".
- **Metas:** as metas e o `expert` de cada dia ×`metaF` (1,25), arredondado para 5. Alvo: o bot afiado continua tirando 3 ★ (ver Testes).

#### Clientes da área industrial (planejados com o usuário em 30/10)
Três tipos novos em `CUSTOMER_TYPES` e `GOSTOS`, que só vêm na área industrial (nem na Garagem, nem no Turno sem fim, nem na Missão zero). Nenhum deles é VIP (`VIP.types` não muda). O vegetariano (v8.6.11) vale para todos eles, como para os outros. Visual sem estereótipo: em cada grupo, gente de várias cores, idades e gêneros, sorteados como nos tipos de hoje.

**1. Turma da fábrica** (`turma`)
- `{ label:'Turma da fábrica', pat:0.8, eat:[4,5.5], read:[3,4], size:[3,4], mais:0.15, tip:0 }`; `GOSTOS.turma = [5, 1, 0, 1, 1]` (quase todo mundo no PF). Não sofre o `patPressa` (só vale para 1 e 2 pessoas).
- Visual: macacão azul-marinho ou cinza com crachá no peito; um ou outro com protetor de ouvido pendurado no pescoço.
- **O apito da fábrica** (`ponto.apito`): no `buildSchedule`, as primeiras `max` (3) turmas do dia saem do lugar sorteado e chegam juntas a partir de `quando` (45%) do turno, uma a cada 8 a 12 s (`gap`). `aviso` (10) s antes, o texto **"A fábrica vai apitar!"** sobe na calçada; na hora, **"Apitou!"** com um som de apito (dois tons, curto). As outras turmas do dia chegam como qualquer grupo. Com `prefers-reduced-motion`, o texto aparece parado.
- Comentários próprios no Gurugol: o critério Agilidade (`AVAL_CRIT`) ganha `tipo:{ turma:{ bom:[...], ruim:[...] }, encomenda:{...} }`; quando o grupo é desse tipo, a frase sai dali em 50% das vezes. Turma: bom "Deu tempo de almoçar com calma!", ruim "Quase perdi a volta do intervalo."

**2. Motorista de caminhão** (`motorista`)
- `{ label:'Motorista de caminhão', pat:1.4, eat:[6,8], read:[3,4], size:[1,1], mais:0.6, tip:0.1 }`; `GOSTOS.motorista = [4, 1, 2, 1, 0]` (PF e assados). Não sofre o `patPressa` (tem tempo).
- **Horário:** o peso do motorista no sorteio vai ×2 nos primeiros e nos últimos 20% do turno e ×0,3 no meio (as horas fracas).
- **Cafezinho no fim:** ao terminar de comer, 80% de chance de o balão mostrar o cafezinho (`pedeCafe:0.8`). Servido antes da conta: os R$ 3 de sempre na conta e a gorjeta dele vai de 10% a 15%. Sem café, nada se perde.
- Visual: boné e camisa xadrez ou polo da transportadora, chave do caminhão na mão; homem ou mulher, sorteado a cada vez (50%).

**3. Encomenda do setor** (`encomenda`)
- `{ label:'Encomenda do setor', pat:2, size:[1,1], retira:true, lote:[4,6], tip:0.1 }`: uma pessoa com crachá e uma sacola térmica, que vem buscar `lote` marmitas para a equipe dela. Usa a fila de retirada, com paciência ×2 em relação ao entregador (`PAT.retirada × pat`). Cada marmita sorteia o prato pelos gostos da turma (`GOSTOS.turma`). Não paga Efood (vem a pé, não pelo app): `efood` 0.
- **Quando:** no máximo 1 por dia, com chance `ponto.encomenda` (60%), por volta de 30% do turno. **Avisada na introdução do dia:** "Encomenda do setor de montagem: x marmitas, lá pelo começo da tarde." Assim dá para adiantar marmitas no "+ marmita".
- **Prateleira de 4:** na área industrial, a prateleira do balcão de retirada tem `ponto.prateleira` (4) vagas, no lugar de `MARMITA.vagas` (2). A reserva continua 1.
- **Entrega:** a Bia (ou a Dani) leva as marmitas ao balcão uma a uma, como hoje; a pessoa da encomenda fica no balcão até receber todas (as marmitas adiantadas do mesmo prato servem). Cada marmita entregue conta nas marmitas do dia (o cap. 5).
- **Pagamento:** cada marmita paga o preço do prato (×1,2) menos a embalagem; o lote completo dá **+20 pontos** (`PONTOS_ACAO.lote`) e a gorjeta de 10%. Se a paciência acaba com parte entregue, paga só as entregues, sem gorjeta, e sai insatisfeita (1 coração; avalia com agilidade baixa), mas **não conta como perdida** para a 3ª estrela; com nenhuma entregue, sai brava como o entregador (multa e conta como perdida).
- Comentários (o mesmo `tipo` da Agilidade): bom "Chegou tudo certinho pro setor!", ruim "Faltou marmita pra metade do pessoal."

#### Itens da área industrial (lojinha; só aparecem com `ponto.nivel === 2`)
- **Fogão industrial** (cartão de manutenção): **R$ 400**, compra única. 4 bocas (`slots` do Tonhão + 1) e gasta **metade** do fogão da Garagem por dia (`base` e `uso` × 0,5). Conserto de emergência R$ 160. `save.up.fogaoInd`; o selo e o desgaste continuam no mesmo `MANUT.fogao`.
- **3 televisores com sertanejo** (no lugar do cartão "TV e som"): instalar **R$ 120**, uma vez. Depois, um seletor por dia: desligadas / **com anúncios** (paciência nas mesas 10% mais devagar, luz R$ 9/dia) / **sem anúncios** (15%, R$ 20 + R$ 9 = R$ 29/dia). O custo entra na folha do dia, como a TV da Garagem. Ambiente do Gurugol (`AVAL.amb`): `tvs:0.5` com anúncios, `tvsPlus:0.75` sem (decidido na sessão de planejamento).
- **Espera lá fora** (5 lugares): **cadeirinhas de plástico R$ 60** ou **banquinhos de madeira R$ 90** (um ou outro; trocar paga o novo). Quem espera sentado perde a paciência na espera **15% mais devagar** (as duas iguais; o banquinho é só mais bonito). Sem nenhum, de pé como na Garagem. `save.up.assento = 'cadeira'|'banco'`.
- **Jarra de suco** (a mesma melhoria `maquina`, com nome, desenho e preço do ponto): **R$ 120**. O grupo pede no balão, a Bia leva, R$ 12 na conta (`BEBIDA_ESPERA.suco`), paciência 40% mais devagar como a água. A tarefa "Levar a água da espera" da Dani vira "Levar o suco da espera".
- **Plantas da calçada** (só na área industrial, cada uma uma compra): **violetas em vasinhos R$ 20, antúrio R$ 30, samambaia pendurada R$ 40**. Cada uma soma **+0,1** ao Ambiente do Gurugol (`AVAL.amb.violeta/anturio/samambaia = 0.1`). A espada-de-são-jorge e as plantas da Garagem vão junto (são do save, não do ponto).
- **Preço das melhorias:** sem mudança (o limite de 1 por dia já saiu na 2c-r4a). Só conferir no `carreira.js` se o jogador ainda junta para os itens acima.

#### Visual (`21-cenario.js`)
- Piso de cimento queimado cinza, parede de tijolinho aparente pintado de branco, letreiro **"Lanchonete Corre-Corre"** em placa de metal com lâmpadas, portão de enrolar aberto em cima da porta, vista da janela com galpões e uma chaminé ao fundo, calçada com faixa amarela de carga e descarga e um poste.
- Os 3 televisores no alto da parede (desenhados só depois de instalados), com uma notinha musical quando ligados.
- Cadeirinhas de plástico vermelhas / banquinhos de madeira na espera; jarra de suco num caixote com copos; violetas na janela, antúrio no chão perto da porta, samambaia pendurada no toldo.
- O menu e o card do ponto dizem o nome do ponto. `prefers-reduced-motion`: sem notinha animada.

#### Capítulos (`HISTORIA`, `ponto:'industrial'`)
O cap. 4 começa ao mudar (`avancaCap` no momento da mudança, e a conversa `'antes'` toca no dia seguinte, antes da introdução). `save.cap` vai até 6 (6 = área industrial completa). O que já existe da 2f (falas, rubrica, `capObj`, linha do objetivo no fim do dia e na introdução) vale igual.

**Cap. 4, "Ponto novo"** — objetivo `{ azul:3 }`: 3 dias no azul na área industrial (não precisam ser seguidos; o aluguel já entra no lucro). Texto: "Fechar 3 dias no azul pagando o aluguel (x de 3)".
- Antes: Bia "Olha o tamanho disso, tio! Vinte lugares!" / Tonhão "E aluguel todo dia. Aqui o almoço é corrido: o pessoal da fábrica tem hora pra voltar." / Bia "Então é servir rápido e fechar no azul."
- Depois: Tonhão "Três dias no azul pagando aluguel. Tá provado, Bia." / Bia "E a moto não para de chegar pedindo marmita!"

**Cap. 5, "Hora do almoço"** — objetivo em 2 itens, que ficam ✓ quando cumpridos (o 1º não se perde depois): (a) num mesmo dia, **6 marmitas entregues a tempo e nota 3,4 no fim dele** (`{ marmitas:6, nota:3.4 }`, guardado em `save.capFeito`); (b) **R$ 2.000 no caixa** no fim de um dia (pode ser o mesmo dia ou depois). Cumpre quando os 2 estão ✓. Texto: "6 marmitas e nota 3,4 no mesmo dia (hoje: x marmitas, nota x,x) · R$ 2.000 no caixa (agora R$ x)".
- Antes: Dani "Os motoqueiros já sabem o meu nome!" / Tonhão "Marmita bem fechada e na hora. Quem sai da fábrica volta amanhã." / Bia "E se a nota subir, dá pra sonhar com a Avenida Brasil."
- Depois: Bia "R$ 2.000 guardados! Dá pra Avenida Brasil, tio." / Tonhão (nota: "largando a colher") "Na Avenida Brasil tem o restaurante do Bráulio." / Bia "O chef de bigode da Casa Aurora?" / Tonhão "Ele mesmo. A estrela veio do molho da sua mãe... e ele nunca conseguiu repetir." / Dani "Então é lá que a gente vai abrir!"
- Em seguida, o `#ov-continua` com **"Fim dos capítulos da área industrial. Continua na próxima versão: a Avenida Brasil."** `save.cap = 6`; os dias seguem sem objetivo.

#### O que muda, parte por parte
- **`10-constantes.js`:** `PONTOS[1]` (acima); `PLATE_SLOTS` com a 5ª vaga; `UPGRADES`/itens novos (fogão industrial, TVs, assento, plantas) com `nivel:2`; `AVAL.amb` com `tvs`, `tvsPlus`, `violeta`, `anturio`, `samambaia`; `HISTORIA` caps. 4 e 5; `MANUT.fogao` lendo o fator do fogão industrial.
- **`12-clientes.js`:** os 3 tipos novos no `Group` (turma de 3 ou 4; motorista com o pedido de café; encomenda com `lote`, a lista de pratos e o que já foi entregue); `normSave` com `ponto` (padrão `'garagem'`), `up.fogaoInd`, `up.assento`, `equipe.tvs` (0 desligadas, 1 com anúncios, 2 sem), plantas e `capFeito`; o sorteio de tipo com `ponto.tipos`, VIP com `ponto.vip`, paciência ×`patPressa` para grupos de 1 e 2, paciência na espera ×0,85 com assento.
- **`13-cozinha.js`:** `plates` do tamanho de `ponto.pratos`; `slots` +1 com `up.fogaoInd`.
- **`16-jogo.js`:** `mudarPonto(sv)` (confere dinheiro e nota, desconta R$ 800, troca `ponto`, tira TV/som/torneira, arranjo automático, `avancaCap`); aluguel nas contas do dia; metas ×`metaF`; o apito da fábrica e o horário do motorista no `buildSchedule`; a encomenda do dia (sorteio, aviso na introdução, lote no balcão, pagamento parcial); contagem de marmitas a tempo no dia (para o cap. 5); `capObj` com `azul` contado só no capítulo atual, `marmitas`, `nota` e `caixa`.
- **`20/21-*.js`:** o cenário da área industrial (acima), escolhido pelo `ponto` do save.
- **`41-lojinha.js`:** cartão "Mudança" (com o que falta, e uma confirmação: "Mudar para a Lanchonete na área industrial por R$ 800? Aluguel de R$ 120 por dia. Não dá para voltar."); cartões novos da área industrial; o card "TV e som" some fora da Garagem.
- **`42-resultados.js`:** linha "Aluguel R$ 120" nas contas; a linha do capítulo para os caps. 4 e 5.
- **`40-interface.js`:** rótulo do menu com o ponto ("História · cap. 4, Ponto novo · dia 18"); `save.cap = 6`: "História · área industrial completa · dia N"; "Como jogar" ganha 1 frase sobre a mudança de ponto.
- **`30-ranking.js`:** o ponto alcançado ao lado do resultado (regra da 2b).
- **Modo dev:** o cartão "Mudança" aparece sempre, sem custo nem nota mínima.

#### Testes
- **`tests/smoke37.js` (novo):** (1) antes do cap. 4 não há cartão Mudança; com `cap:4`, aparece e fica apagado sem R$ 800 ou sem nota 2,7 (testar cada um); (2) mudar: −R$ 800, `ponto:'industrial'`, TV/som/torneira fora, mesas levadas, arranjo válido, 20 lugares, 5 vagas de prato, `cap` 4 e `conversa:'antes'`; (3) aluguel de R$ 120 no fim do dia e preços ×1,2; (4) clientela: em 200 grupos sorteados, entregadores ≈ o dobro da Garagem e VIPs ≈ 0,3×; (5) fogão industrial: 4 bocas e metade do desgaste; (6) TVs: instalar, os 3 modos, custo na folha e paciência; (7) assento: espera 15% mais devagar; jarra cobra R$ 12; (8) plantas somam +0,1 cada no Ambiente; (9) cap. 4 com 2 dias no azul continua, com 3 avança; (10) cap. 5: 6 marmitas com nota 3,3 não marca; com 3,4 marca (a); depois R$ 2.000 cumpre; `cap:6` e o `#ov-continua` novo; (11) save da v8.7 sem `ponto` carrega como Garagem; (12) turma: 3 ou 4 pessoas, as 3 primeiras do dia chegam juntas a partir de 45% do turno com o aviso 10 s antes, e nenhuma turma, motorista ou encomenda na Garagem; (13) motorista: mais nas pontas do turno que no meio (em 200 dias sorteados), pede café ao terminar e a gorjeta vai a 15% com o café; (14) encomenda: no máximo 1 por dia, aviso na introdução, prateleira de 4, lote completo paga tudo + 20 pontos sem Efood, lote pela metade paga as entregues e não conta como perdida, nenhuma entregue conta; (15) as marmitas da encomenda contam no cap. 5.
- Ajustar smokes antigos que esperam 4 vagas fixas de prato ou o texto antigo do `#ov-continua`.
- **`bot.js`:** o bot serve o café do motorista (quando a Bia está livre) e trata a encomenda como entregadores em fila (leva as marmitas do lote; adianta o PF no "+ marmita" quando há encomenda avisada).
- **`carreira.js`:** o bot muda de ponto assim que pode (e compra fogão industrial, TVs com anúncios, cadeirinhas e jarra quando sobra R$ 300 acima da folha); `DIAS=35`. Linha `HISTORIA` com o dia de cada capítulo e o dia da mudança.
- **Alvos e como decidir:**
  - Mudar deve se pagar em **3 a 5 dias** (lucro médio por dia na área industrial − o da Garagem ≥ R$ 160). Se demorar mais que 5, `cardapio` 1,25; se pagar em menos de 3, aluguel R$ 150.
  - `node carreira.js 3` (padrão e `MOVEIS=quatro`): **0 dias no negativo** nos 5 dias depois da mudança; se houver, `mudanca` 700.
  - Cap. 4 cumprido em até 5 dias depois da mudança em 3/3; cap. 5 em até 15 dias depois da mudança em ≥ 2/3. Se o cap. 5 não chegar, as marmitas baixam para 5 (não mexer na nota 3,4 nem nos R$ 2.000).
  - Bot afiado (`balance.js` com o ponto industrial, `PONTO=industrial`): 3 ★ em ≥ 2 de 3 dias; se não, `metaF` 1,2; se passar com folga (todos os dias acima de `expert` em 15%), `metaF` 1,3.
  - **Clientes novos:** o apito não pode virar derrota certa. Com o bot afiado, as turmas do apito perdem ≤ 1 grupo em 3 dias; se perderem mais, `apito.max` 2. A encomenda é entregue completa em ≥ 2 de 3 dias com o bot afiado; se não, `lote` [3,5].
  - Bot com perdas (o padrão sem equipe): a mudança **não** deve compensar (lucro na área industrial ≤ o da Garagem + R$ 40).
- Capturas: `tests/shot_v9.py` em `capturas/v9` (cartão Mudança apagado e aceso, confirmação, salão da área industrial com tudo comprado, o apito com as turmas chegando, o motorista com o balão do café, a encomenda no balcão de retirada, calçada com cadeirinhas, jarra e plantas, TVs ligadas, fim do dia com o aluguel, conversa do cap. 5 com a rubrica, `#ov-continua`, celular).

#### Fechamento
v9: guardar a v8.9 em `versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.md`, `docs/RESUMO.md`, CLAUDE.md (smoke 37, `PONTO=` no balance, `DIAS=35` no carreira), PR e merge.

**Fora:** o Joca (vai para a 3b), a Avenida Brasil, eventos de bairro (4c), o nível de luxo.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas é sistema novo (mudança de ponto, clientela por ponto, cenário inteiro novo) e mexe em muitas partes; a calibração da mudança pode pedir 2 ou 3 rodadas.

### Sessão 3b — Restaurante na Avenida Brasil (v9.1)
- `PONTOS` ganha o **Restaurante na Avenida Brasil** (nível 3: 24 lugares, aluguel R$ 400, mudança R$ 2.000). Clientela: executivas, famílias e mais VIPs.
- **O Joca** (decidido em 30/10: saiu da 3a), o 2º ajudante, **contratado com salário** (sugestão: R$ 45/dia no nível 1, aumentos para R$ 60 e R$ 75). O que ele faz (calçada e retirada, o mesmo que a Dani, ou garçom), níveis e visual (sem estereótipo, com crachá como a Dani): a decidir no planejamento da 3b.
- **Destravados:** confeiteiro (sobremesas), balcão de coquetelaria com profissional de drinks, um prato novo no cardápio, balcão de pratos com 6 vagas.
  - **ambiente:** o **couvert artístico** (já pronto no código desde a v5, escondido abaixo do nível 3 desde a v7.4.4: basta o ponto ter `nivel:3`);
  - **espera:** sofás e águas saborizadas diferentes;
  - **decoração da calçada:** tulipas, orquídeas ou copos-de-leite.
- **Capítulo da Avenida Brasil** na história.

**Modelo:** planejar com o Opus antes (o Joca, os valores e as falas da Avenida Brasil); executar com o Sonnet, esforço alto (o 2º ajudante é sistema novo), ou médio se a 3a deixar o molde de ponto pronto e o Joca for simples.

**Fora:** Terraço Suíça, VIP exigente e o final da história.

**Partes:** `10-constantes.js` (`PONTOS`, metas por ponto, equipe nova, `HISTORIA`), `12-clientes.js` (save `ponto`, preço), `13-cozinha.js` (bocas, balcão, sobremesa), `15-dani.js`/novo ajudante (Joca), `16-jogo.js` (carreira por pontos, contas), `20/21-*.js` (visual), `30-ranking.js`, `41-lojinha.js` (aba Ponto, fogão industrial), `42-resultados.js`.

**Testes:** smoke novo (mudança, custo, nota mínima, aluguel nas contas, móveis levados, ambiente e espera trocados, preços e clientela por ponto, destravados, save antigo = Garagem, capítulo). `carreira.js` com mudança.

**Calibração:**
- Mudar de ponto deve compensar em ~3 a 5 dias para quem atende bem e não compensar para quem perde muitos clientes.
- O jogador deve ter que escolher entre mudar e (equipe + melhorias + móveis).
- **Achado da v7.4, resolvido na v7.4.1** (`docs/spec-v7.4.1.md`): na v7.4, mesa a mais não dava lucro; com 4 pratos limpos, +6% de grupos por lugar acima de 10 e a fila justa a 60%, mesas de 4 com equipe se pagam em 1 a 3 dias. Conferir no ponto novo se os 20 e 24 lugares também rendem.

**Ideias para considerar no planejamento da 3b:** a **conta rachada** e o **fiscal da vigilância sanitária** (nas Ideias guardadas, desde 30/10).

**Decisões em aberto (só da 3b; as da 3a foram tomadas em 30/10):** o que cada destravado da Avenida Brasil custa; o que o Joca faz, níveis e visual; preço e efeito das águas saborizadas e dos sofás (a 3a fez o assento segurar a paciência em 15%); as falas dos capítulos da Avenida Brasil (o Bráulio já foi citado no fim do cap. 5).

---

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. Confeiteiro e coquetelaria continuam disponíveis.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Reputação do ponto:** é a nota do Gurugol (etapa 2c, últimas 100 avaliações). No Terraço ela muda a freguesia do dia (mais VIPs com nota alta), e na etapa 6 vira a régua do Michelzão.
- Um item de lojinha do Terraço, por exemplo "Louça fina": prato especial mais rápido.
- **Ambiente:** couvert com quarteto de cordas ou pianista (20% cada; diárias a definir; o pianista traz a manutenção diária do piano).
- **Decoração da calçada:** flores muito belas e arranjos, como ikebana, arranjos de orquídeas e flores do campo em vasos de cerâmica.
- **Capítulo do Terraço** na história, que prepara o final (etapa 6).

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `21-cenario.js` (Terraço, foyer, piano), `22-salao-hud.js` (balão do pedido especial).

**Testes:** smoke novo (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` no Terraço Suíça com equipe completa.

**Calibração:**
- O Terraço dá mais lucro só com equipe completa + Tonhão nível 3 + salão bem montado.
- Para quem não está pronto, é um passo arriscado: lucro abaixo da Avenida Brasil.

**Decisões em aberto:**
- A avaliação ruim do VIP exigente pesa mais na nota do Gurugol do que a de um cliente comum?
- O que o exigente usa para se distinguir visualmente.
- As diárias do quarteto e do pianista e a manutenção do piano.

**Modelo:** planejar com o Opus antes (as 3 decisões em aberto, regras do prato da casa e da reputação, falas do capítulo); executar com o Sonnet, esforço alto (cliente novo com regras próprias e o desenho do Terraço).

### Sessão 4b — Nível de luxo (v10.1)
**Objetivo:** o nível de luxo de 0 a 5 (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`), que soma o que o jogador montou em todos os pontos.

**Entra:**
- **Nível de luxo** (0 a 5), a soma de atributos: decoração da espera e do salão, móveis (as mesas de plástico de bar da Garagem são o degrau mais baixo), o ponto, o ambiente (TV, som, couvert, quarteto, pianista, que soma mais), o impacto da divulgação e a avaliação de críticos surpresa.
- A progressão é por atributos, como subir de nível um personagem (referência do usuário só nos docs; na interface, sem citar o jogo): cada atributo tem a sua barra, e o nível sobe quando elas sobem.
- Onde aparece: uma aba ou um quadro na lojinha, com as barras (pode reaproveitar o estilo da caixa do Gurugol da v8.4.1).
- Efeito no jogo (a decidir): mais VIPs, mais gorjeta, nota de ambiente do Gurugol, régua do Michelzão (etapa 6).
- TV, som e couvert podem sair da aba Equipe e ir para o lugar do ambiente (anotado na v7.4.4).
- **Enfeites e móveis melhores** à venda, para subir o luxo (decidir quais). Os da Garagem já existem desde a v8.6.5 (`DECOR` e a toalha xadrez), só visuais.
- **Feito na v8.6.6** (`docs/spec-v8.6.6.md`, com os valores sugeridos): **Decoração no Ambiente do Gurugol** (adiada na v8.6.5 a pedido do usuário, que mexia nas avaliações em outro branch, o do teto por ponto da v8.6.4; pode vir antes da 4b; os valores abaixo são na escala do serviço, de 1 a 5, antes do teto): a base do Ambiente cai de 3 para 2 (a Garagem pelada fica "meio sem graça"), cada planta soma ~0,3, cada peça do cantinho da Rosa ~0,25 e a toalha +0,5 só para o grupo daquela mesa (como o bônus da cadeira da cor); comentários próprios ("Que plantinha linda!", "A toalha xadrez dá um charme").

**Partes:** `10-constantes.js` (`LUXO`), `16-jogo.js` (cálculo), `41-lojinha.js` (aba ou quadro do luxo, enfeites), `21-cenario.js` e `22-salao-hud.js` (enfeites e móveis), `12-clientes.js` (efeito na freguesia).

**Testes:** smoke novo (cada atributo, nível de 0 a 5, efeito, save).

**Decisões em aberto:** os atributos e o peso de cada um; o efeito no jogo; quais enfeites e móveis entram; se a nota de ambiente do Gurugol passa a ser o luxo.

**Modelo:** planejar com o Opus antes (atributos, pesos e efeito no jogo, a lista de enfeites e móveis com preços); executar com o Sonnet, esforço médio (é cálculo e interface sobre o que já existe).

---

## Etapa 4c — Eventos de bairro (v10.2)
> Entrou no plano na revisão de 28/10 (era ideia guardada). Vem depois do Terraço, para variar com cada ponto.

**Objetivo:** dias especiais que dão variedade e testam a reserva de dinheiro, como a chuva e o feriado da v8.

**Entra:**
- **Festa junina** (em junho, ou num dia sorteado da campanha): mais famílias, pratos típicos (pamonha, milho, canjica) e enfeites de bandeirinhas.
- **Jogo do Brasil:** antes do jogo, a casa lota; durante, quase ninguém vem (todo mundo vendo), e depois vem o pico. Com a TV ligada (Garagem e área industrial), mais paciência e mais gente.
- Os eventos usam o sistema de `CLIMA` (sorteio, aviso na introdução do dia) e mudam com o ponto (o jogo do Brasil enche a área industrial; a festa junina pesa mais na Garagem).
- Times, emissoras e músicas sempre inventados; sem logos reais.

**Partes:** `10-constantes.js` (`EVENTOS`), `16-jogo.js` (sorteio, movimento do dia), `21-cenario.js` (enfeites), `43-telas.js` (introdução do dia).

**Testes:** smoke novo (sorteio, efeito no movimento, enfeites, save). `balance.js` com os eventos.

**Decisões em aberto:** quais eventos entram (sugestão: os 2); com que frequência; se o jogador pode se preparar (comprar ingredientes, decoração) antes.

**Modelo:** planejar com o Opus numa sessão curta (eventos, frequência, efeito no movimento e preparo); executar com o Sonnet, esforço médio (segue o molde do `CLIMA` da v8).

---

## Etapa 6 — Modo História: o crítico do Michelzão e o final (v11)
> Revista em 28/10: desde que a campanha virou o Modo História (etapa 2f), esta etapa fica só com o crítico e o final. O guia se chama **Michelzão** (escolha do usuário em 22/10).

**Objetivo:** a estrela do Michelzão, o fim do sonho da Bia.

**Entra:**
- **O crítico do guia:** um guia gastronômico **inventado**, o **Michelzão**. Não usar o nome "Michelin", nem logo, mascote ou arte do guia real.
  - No capítulo final, um cliente disfarçado aparece em dia sorteado.
  - Atendê-lo com 5 corações, prato caprichado e mesa limpa conta para a avaliação.
- **A receita da Casa Aurora** volta: o molho com o cominho com açafrão do Tonhão e a pétala de rosa da Dona Rosa, que o Bráulio nunca conseguiu repetir (sugestão: o prato do crítico, que a Bia faz no final).
- **Final:** a avaliação junta reputação (Gurugol), lucro, nível de luxo e o atendimento do crítico, e dá de 0 a 3 estrelas, com cena final (falas) e créditos curtos. Rejogar o final para tentar mais estrelas.
- Selo do resultado no menu (ex.: "★★ no Michelzão").
- O que acontece depois do final: a campanha continua (sugestão) ou acaba.

**Partes:** `10-constantes.js` (`HISTORIA`), `12-clientes.js` (crítico disfarçado, sem sinal óbvio, talvez um caderninho), `16-jogo.js`, `22-salao-hud.js`, `25-abertura.js` (cena final, se reaproveitar o desenho das cenas), `42-resultados.js`.

**Testes:** smoke novo (aparição do crítico, avaliação, finais). O bot termina a história.

**Decisões em aberto:**
- O crítico pode ser reconhecido (pista sutil) ou é surpresa total?
- Quantas estrelas possíveis (sugestão: 3).
- O Bráulio aparece no final?

**Modelo:** planejar com o Opus (decisões em aberto, regra de pontuação do final e as falas da cena final, que pedem cuidado de texto); executar com o Sonnet, esforço alto.

---

## Etapa 7 — Polimento (v11.1)
> **A rever com o usuário antes de começar** (revisão de 22/10).

- Celular: "Como jogar" sem rolar no celular deitado; lojinha sem rolar no 568×320 (pendências antigas do `RESUMO.md`). Testar som e toque num aparelho real.
- **Jogo online (pedido do usuário em 23/10: "onlinização só para os ajustes finais"):** desde a v8.3.3 o jogo é offline (`Rank.online = false`, ranking só no aparelho). Aqui, religar o ranking compartilhado: `Rank.online = true` e as capacidades do artifact com a leitura de `ranking-campanha` (a coleção da campanha, criada na v8.3). Fazer só com o OK do usuário.
- Revisão geral de equilíbrio com `carreira.js` e com o retorno dos jogadores (o "Copiar resumo" do Caixa). Revisar textos do "Como jogar" para os sistemas novos.
- **Conferir com jogadores** o que ficou pendente no `RESUMO.md` (Ideias pendentes): a Bia e os selos da v7.3, o editor do salão, a fila justa e a porta, as estrelas, a escassez, o "livre" e "reservados" da lojinha e a tela larga.

**Modelo:** a revisão com o usuário é com o Opus; depois, ajustes de tela no celular com o Sonnet, esforço médio; religar o ranking (`Rank.online = true` e capacidades) com o Haiku, esforço baixo; a revisão geral de equilíbrio com o Sonnet, esforço alto.

---

## Ideias guardadas (sem etapa ainda)
- **Virou a etapa 2e (revisão de 28/10), feita na v8.6.** **Entregadores: fila própria e marmitas** (pedido do usuário em 27/10; texto em `docs/PROPOSTAS.md`): hoje o entregador de moto entra na fila como qualquer cliente, senta e come no salão. A ideia é ele **não comer no lugar**: chega pela porta (ou por um balcão de retirada) e entra numa **fila própria de retirada**, separada da fila de mesas, e leva a comida embora. O prato dele é a **marmita**, e para liberá-la pede um **fluxo de preparação**: o Tonhão faz a marmita (tempo e ingredientes próprios, talvez com embalagem como custo), ela fica pronta num ponto de retirada (balcão ou prateleira, com limite de vagas) e a Bia (ou a Dani) entrega ao entregador quando a marmita está pronta. Quem não é atendido a tempo vai embora (paciência curta, como hoje); retirada rápida paga bem. Decidir: se a marmita é um item do cardápio ou um modo de preparo de qualquer prato; se dá para **adiantar marmitas** em horário calmo (estoque no balcão) para liberar os entregadores sem parar o salão; custo da embalagem e preço (taxa de retirada?); como aparece na chuva, quando mais clientes viram entregadores (`CLIMA`), e na sexta, quando vêm mais; efeito nas avaliações do Gurugol (`AVAL`: a espera do entregador conta como agilidade). Combina com o balcão de pratos e com os funcionários extras (Joca).
- **Conta rachada** (pensada com o usuário em 30/10, reservada para a 3b, Avenida Brasil): um jeito de pagar que pode cair em qualquer grupo de colegas (turma, executivas): cada um paga a sua parte, e a Bia leva 2 ou 3 maquininhas em vez de uma conta só. Mais trabalho, mas cada pessoa deixa um pouco de gorjeta. Decidir: a chance, quantas maquininhas, o tempo de cada uma e a gorjeta por pessoa.
- **Fiscal da vigilância sanitária** (pensada com o usuário em 30/10, reservada para a 3b ou para a 4c, eventos de bairro): uma visita surpresa, como evento, que repara na mesa suja, na lixeira cheia e na pia lotada. Aprovado, selo e um tanto a mais na nota do Gurugol; reprovado, multa. Ensaia o crítico do Michelzão (etapa 6). Decidir: a frequência, o que se confere, o valor da multa e do bônus, e se há aviso (ex.: "Dizem que a vigilância está na rua").
- **Vai nas etapas 3a, 3b e 4a (revisão de 28/10).** **Espera lá fora por nível do salão** (pedido do usuário em 22/10; texto em `docs/PROPOSTAS.md`): a estética e o serviço da espera na calçada sobem junto com o ponto. Cada ponto tem `assento` e `bebida` (`PONTOS`, `BEBIDA_ESPERA`, desde a v7.7):

| Nível | Ponto | Assento | Bebida da espera | Situação |
|---|---|---|---|---|
| 1 | Garagem | **de pé** (faixa pintada no chão) | **copo d'água da torneira**, de graça (melhoria de R$ 80) | **feito na v7.7** |
| 2 | área industrial (etapa 3) | **cadeirinhas de plástico ou banquinhos de madeira** | **jarra de suco** (a base é a máquina de suco da v7.5, guardada em `BEBIDA_ESPERA.suco`: R$ 12 na conta) | a fazer |
| 3 | Avenida Brasil (etapa 3) | **sofás** | **águas saborizadas diferentes** | a fazer |
| 4 | Terraço Suíça (etapa 4) | **poltronas individuais** | **coquetelaria lá fora** | a fazer |

  - Decisões em aberto: preço e efeito de cada bebida (a de cima rende mais na conta ou segura mais a paciência?); se o assento também segura a paciência (sentado espera com mais calma que de pé) ou só soma ao **nível de luxo**; se a coquetelaria lá fora usa o profissional de drinks do balcão de coquetelaria (níveis 3 e 4); o que acontece com a torneira na mudança (sugestão: como o ambiente, a bebida do nível de baixo sai e entra a do ponto novo).
  - **Decoração da calçada por nível** (pedido do usuário em 22/10, mesma conversa): plantas e enfeites sobem junto com o ponto. Nível 1, Garagem: **espada-de-são-jorge**, plantinhas simples (vaso de barro e lata reaproveitada; **feito na v7.7**). Nível 2: uma planta um pouco maior e mais bonita, por exemplo **violetas** em vasinhos (ou um antúrio, uma samambaia pendurada). Nível 3: flores mais rebuscadas, como **tulipas**, **orquídeas** ou **copos-de-leite**. Nível 4: **flores muito belas e arranjos**, como **ikebana**, arranjos de orquídeas e flores do campo em vasos de cerâmica. Só visual por enquanto; mais tarde soma ao **nível de luxo**.
  - Desenho de cada um com o seu (banquinhos e jarra na mesinha; sofás com almofadas e garrafas coloridas; poltronas, tapete e balcãozinho de drinks), respeitando `prefers-reduced-motion`.
- **Vai nas etapas 3a, 3b e 4a (revisão de 28/10).** **Ambiente por nível do salão** (pedido do usuário em 21/10; texto e decisões em aberto em `docs/PROPOSTAS.md`). Em todos, a paciência nas mesas cai mais devagar, como na v7.4.4 (`ambienteEffect`):
  - **nível 1, Garagem:** TV de tubo na Rede Esfera (5%, luz R$ 15/dia) e som na rádio Velha Brasil FM (5%, luz R$ 10/dia). **Feito na v7.4.4.**
  - **nível 2, área industrial (etapa 3):** 3 televisores com playlist de sertanejo. Com anúncios: 10%, pagando a luz; sem anúncios: 15%, por R$ 20/dia mais a luz.
  - **nível 3, Avenida Brasil (etapa 3):** o couvert artístico de hoje (músico, 20%, R$ 80/dia, taxa opcional de R$ 3 por pessoa que corta o efeito à metade). Já está no código, escondido abaixo do nível 3.
  - **nível 4, Terraço Suíça (etapa 4):** couvert com quarteto de cordas ou com pianista, os dois com 20% (diárias a definir). O pianista também soma ao **nível de luxo** do ambiente (pontuação para o futuro) e traz a manutenção **diária** do piano.
  - **Ao mudar de ponto, o ambiente é trocado** (decidido em 21/10): o do nível de baixo sai, com os bônus dele; cada ponto só tem o ambiente do seu nível. Na etapa 3, a mudança desliga a TV e o som da Garagem (`equipe.tv` e `equipe.som` saem do save, como o couvert abaixo do nível 3).
  - Desenho: cada nível com o seu (paredão de 3 TVs, palco do músico, quarteto, piano de cauda), respeitando `prefers-reduced-motion`; nomes de emissoras, rádios e músicas sempre inventados.
- **Virou a etapa 2b (revisão de 22/10).** **Carreira como campanha contínua** (pedido do usuário em 22/10; texto em `docs/PROPOSTAS.md`): acabar com o sistema de níveis (escolher o dia no menu, repetir o dia para tirar mais estrelas) e virar uma campanha: "novo dia, novo acúmulo, novo serviço, nova vida", seguindo com tudo o que havia antes (dinheiro, móveis, equipe, melhorias, desgaste). **O progresso** (mesmo pedido, depois da v8.2.1): vem do acúmulo de experiência e dinheiro, que levam a novos restaurantes (os pontos das etapas 3 e 4: área industrial, Avenida Brasil, Terraço Suíça); decidir o que é a "experiência" (dias completos? clientes atendidos? avaliações, que já estão nas ideias guardadas?) e quanto de cada uma abre o próximo ponto. Solução de agora: rejogar guarda o dinheiro dos dias completos e, desde a v8.2.2, só o dia completo rende (a folha é paga no fim dele; interromper não paga nem ganha). Decidir: o que acontece com a meta não batida (o dia seguinte vem igual? fica mais difícil? perde reputação?); se os dias 1 a 7 viram uma sequência sem fim (com os pontos das etapas 3 e 4 como degraus); o que vira o ranking da carreira (hoje soma os melhores dias) e as estrelas; se há um jeito de recomeçar do zero. Combina com o Modo História (etapas 5 e 6) e com o dinheiro no negativo (abaixo).
- **Virou a etapa 2b (revisão de 22/10).** **Dinheiro no negativo e empréstimo no banco** (retorno do usuário em 22/10; texto em `docs/PROPOSTAS.md`): em vez de a folha ficar de fora quando falta dinheiro, deixar o caixa ficar negativo, mas no máximo 3 dias seguidos; e a opção de pegar um empréstimo no banco, com juros. A v8.1 só mostrou o dinheiro já comprometido. Decidir: se a folha passa a ser sempre paga (negativo) ou se o corte continua como opção; o que acontece no 4º dia negativo (fim da carreira? empréstimo obrigatório?); juros, prazo e parcelas (saem da folha do dia?); uma aba Banco na lojinha ou uma linha no Caixa. Combina com a dívida de abertura da etapa 5.
- **Feito na v8.3.10.** **Triturador de lixo** (pedido do usuário em 24/10; texto e números em `docs/PROPOSTAS.md`): R$ 180, 1 gominho a cada 30 s; o Ventilador perdeu o efeito do cheiro.
- **Cozinheiros da Avenida Brasil e do Terraço Suíça** (pedido do usuário em 30/10, junto com a 2g; texto em `docs/PROPOSTAS.md`): o XP por cursos da 2g vale para a Garagem e a área industrial. Nos restaurantes de luxo o processo de subir o cozinheiro vai ser outro, porque lá não se vende coxinha (os cursos de salgado não fazem sentido). Decidir na 3b/4a: cursos próprios do ponto (cozinha de restaurante, alta gastronomia), outro cozinheiro além do Tonhão, ou outra fonte de experiência.
- **A Dani se especializa, o Joca pega o básico e um funcionário novo** (pedido do usuário em 30/10, junto com a 2h; texto em `docs/PROPOSTAS.md`): nos níveis mais altos, a Dani vira **barista ou confeiteira**, o que ela mais gosta: **cafés de vários tipos e qualidades e sobremesas de café** (o curso "Barista iniciante" da 2h é a semente). As tarefas mais básicas dela (lixo, louça, pratos sujos) passam para o **Joca**, e entra **mais 1 funcionário**, a planejar. O **Joca também terá level up**, mas só depois que ele entrar (3b). Decidir: em que ponto a especialização chega (Avenida Brasil?), o cardápio de cafés e sobremesas (preço, tempo, efeito no Gurugol), e quem é o funcionário novo.
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
- **Virou o fogão industrial da etapa 3a (revisão de 28/10).** Equipamento melhor no lugar da manutenção (fogão industrial etc.).
- **Vai na etapa 3b (o Joca; mudou da 3a em 30/10).** Mais funcionários: um segundo garçom, além da Dani. **Pedido do usuário em 22/10:** a partir do nível 2 ou 3, dá para contratar um **segundo ajudante, o Joca** (o 2º garçom da etapa 3; texto em `docs/PROPOSTAS.md`). Decidir: se o Joca faz as mesmas tarefas da Dani ou outras (por exemplo, cuidar só da calçada: levar o grupo à mesa e servir a espera), salário, níveis e visual (sem estereótipo, com crachá como a Dani).
- **Virou a etapa 4c (revisão de 28/10).** Eventos de bairro: festa junina, jogo do Brasil.
- **Virou a etapa 2c (revisão de 22/10).** **Avaliações dos clientes como meta para avançar** (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`): uma nota parecida com as avaliações de mapa na internet, que sobe ou desce pela média das **últimas 200 avaliações** de quem passou. Cada grupo avalia 5 critérios:
  - **espera por mesa:** cada coração perdido na fila tira 1 ponto;
  - **agilidade do atendimento:** cada coração perdido esperando a Bia (pedido, prato, conta) tira 1 ponto;
  - **qualidade do prato:** cada cozinheiro tem uma faixa de qualidade e de acerto; mais treinado, faixa mais alta e mais pratos caprichados (o crítico de hoje, `CRIT`, vira 100% de perfeição, nota máxima);
  - **qualidade do menu:** quantos pratos o cardápio tem (só os que os cozinheiros foram treinados para fazer);
  - **ambiente e amenidades:** a estética do salão (enfeites, móveis melhores que as mesas de plástico da Garagem), couvert e outros entretenimentos, cafezinho etc.

  Uma das metas para passar de fase seria a nota mínima de avaliação. Combina com o **nível de luxo** (abaixo), com a escada de pontos (etapas 3 e 4) e com o crítico do guia (etapa 6).
- **Virou a etapa 4b, junto com o Terraço (revisão de 28/10).** **Nível de luxo** (0 a 5, bem para frente, depois de tudo o que está na fila; pedido do usuário em 21/10): a soma dos enfeites (decoração da área de espera e do salão), da localização (ponto), do impacto da mídia (divulgação), da avaliação de críticos surpresa e de outras coisas a ponderar. A progressão seria parecida com a de subir de nível de um personagem por atributos (o usuário citou o sistema do Kratos em God of War Ragnarök como referência; na interface, sem citar o jogo).
