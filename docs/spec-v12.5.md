# v12.5 — O arco da Lia: o ciúme do Tonhão, a praça e o prato dela (etapa 15a)

**Situação:** aprovada
**Origem:** retorno do usuário de 19/11 em `docs/PROPOSTAS.md` ("um arco de verdade para a Lia..."), entrevista na mesma conversa (mistura das propostas 1 e 3, "Na minha cozinha, não"). Perfis e tratamento em `docs/ARCO.md` §2.1 e §2.2. Aprovada em 19/11: o risoto a R$ 58 e bege dourado (`#C9A26B`); a cena dos temperos no cap. 10 `depois` (e não na `ARCO`), para a Lia ter 4 entradas no arco.

## Objetivo
A Lia deixa de ser só um bônus de velocidade e ganha um arco curto no Terraço. A Cami traz a amiga do rodízio e o Tonhão tem ciúme da cozinha, até ver nela a Rosa. A Lia cresce em dois cursos: primeiro as entradas ficam com ela, depois ela cria o prato dela. Termina sendo chamada de "chef".

## Fora do escopo
- A troca de tratamento nas falas que já existem (Dani "tio Tonhão", Joca "dona Bia" etc.) e a revisão das conversas pelos perfis: v12.6 (`docs/spec-v12.6.md`). Nesta versão, só as falas da Lia e as das cenas dela seguem a tabela do `docs/ARCO.md` §2.2.
- A Lia na foto do final ao lado do Tonhão (o `docs/FINAL.md` não muda).
- Desenho novo da Lia (roupa, expressões): ela usa o desenho e o retrato de hoje.

## Regras (decisões tomadas)
**A Lia por nível** (`STAFF.lia` vira `levels`, como a Cami: `equipe.lia` = 0 a 3, nível = 1 + cursos feitos; contratar continua definitivo):
| Nível | Como chega | O que faz | Diária |
|---|---|---|---|
| 1 | contratada | todo pedido da cozinha leva `cook` 0,85 × o tempo (hoje é 0,75) | R$ 80 |
| 2 | curso Chefe de praça (R$ 700) | `cook` 0,75 em tudo, e as entradas (`tempo` 0) passam pela **praça da Lia** | R$ 100 |
| 3 | curso Cozinha de autor (R$ 1.000) | o do nível 2, e o **Risoto de feijão-manteiguinha** entra no cardápio nos dias em que ela vem | R$ 120 |
- `STAFF.lia = { levels:[ null, { cook:0.85, pay:80 }, { cook:0.75, pay:100, praca:true }, { cook:0.75, pay:120, praca:true, autor:true } ] }`. Quem lê `STAFF.lia.pay` e `STAFF.lia.cook` (a folha, `Kitchen.ajuda`, `buildLia`) passa a ler o nível do dia.
- **A praça da Lia** (`Kitchen`, `src/13-cozinha.js`): com a Lia no dia e no nível 2 ou mais, a cozinha ganha 1 vaga a mais, **só para entradas**. Em `update`, antes de encher as bocas do fogão, a 1ª entrada da fila (que ainda não começou) vai para a praça, se ela estiver livre. As bocas do fogão continuam podendo pegar entradas, como hoje: a praça nunca deixa a cozinha mais lenta. O tempo da entrada na praça é o mesmo de hoje (com o `cook` do nível). Sem a Lia no dia (`liaFora`), não há praça.
- **Cursos** (`LIA_CURSOS`, no molde de `ANSELMO_CURSOS`; `save.liaCursos`, `save.liaCursoDia`, um curso por dia):
  - `{ id:'praca', nome:'Chefe de praça', preco:700, nivel:4 }`. Fica no cartão da Lia (Equipe), como a clássica do Anselmo.
  - `{ id:'autor', nome:'Cozinha de autor', preco:1000, nivel:4, dep:'praca', item:true }`. Fica no Cardápio, como a de autor do Anselmo, com o rosto da Lia.
  - **Quando aparecem:** no Modo História, o `praca` só depois da conversa `liaRosa` vista e o `autor` só depois da `liaPetala` vista. Sem o Modo História, o `praca` com a Lia contratada e o `autor` com o `praca` feito.
  - Comprar sobe `equipe.lia` em 1 e a diária vai junto.
- **O prato:** `liaRisoto: { nome:'Risoto de feijão-manteiguinha', preco:58, cat:'pf', curso:'liaAutor', carne:false, cor:'#C9A26B', veg:true, fino:true }` em `PRATOS`. Como os da barraca junina, `liaAutor` não existe em `CURSOS`. O prato entra nos pedidos (`pedePrincipal`, pela regra do prato fino) só quando `save.liaCursos.autor` e `g.liaAtiva`. Cada um vendido soma 1 em `save.liaPrato`, que é o gatilho da `liaChef`.
- **A entrada no jogo (`LIBERA`, `lia`):** o `gatilho` de hoje (curso de entradas ou alta feito) ganha, no Modo História, a condição de o cap. 10 já ter começado (`g.save.cap >= 10`), para as falas do cap. 10 tocarem antes. Sem o Modo História, nada muda.
- **Lojinha, cartão da Lia** (`buildLia`): título `Lia (cozinheira) · nível N de 3` contratada, `Lia` antes. Em "Na cozinha:" (ou "Se contratar:"), a linha do nível: 1 `Ajuda no pré-preparo`, 2 `Cuida das entradas`, 3 `Faz o prato dela`, e `Diária: R$ X`. O cartão do curso segue o molde do Anselmo: `Curso de Chefe de praça` / `Curso de cozinha de autor`, `Precisa da Lia contratada.`, `Precisa do curso de Chefe de praça.`, `Em curso`, `Curso feito`.
- **Manual:** a ficha `e-lia` vira `Cozinheira: começa no pré-preparo; com cursos, cuida das entradas e cria um prato dela.`
- **Modo dev:** `NIV.lia` passa a `[0, 1, 2, 3]`: o painel sobe e desce a Lia pelos 3 níveis, e no 3 o risoto entra no cardápio. "Tudo no máximo" e o Teste de habilidade usam o nível 3 com os dois cursos. As conversas novas entram sozinhas na lista (`Arco: liaRosa`, `Arco: liaChef`); o cap. 10 `depois` já está na lista dos capítulos.
- **Save:** `save.liaCursos` (`{}`), `save.liaCursoDia` (0) e `save.liaPrato` (0) nascem em `normSave`. Save antigo com `equipe.lia` 1 fica no nível 1, porque é o mesmo número.

**As falas** (o tratamento segue o `docs/ARCO.md` §2.2: a Lia chama o Tonhão de "chef" e a Bia de "chefia" até a `liaChef`; a Cami chama o Tonhão de "Tonhão" e a Lia de "Li"):

**Cap. 10, `antes`** (troca as 5 falas de hoje):
- tonhao [insegura]: Quatro tempos por mesa, Bia. Sozinho no fogão eu não venço.
- bia [firme]: Então o senhor vai ter ajuda.
- cami [alegre]: Eu sei quem! A Lia, que cozinhava no meu rodízio. Hoje ela faz curso de alta gastronomia.
- tonhao [brava]: Ajudante na minha cozinha?...
- bia [alegre]: Foi o senhor que me ensinou a pedir ajuda, tio.
- dani: E o pessoal daqui gosta de um coquetel antes da entrada!

**`LIBERA`, `lia`** (troca as 4 falas de hoje):
- cami: Chefe, a Lia veio! Tá na porta da cozinha.
- lia [firme]: Lia. Onde eu guardo as facas?
- tonhao [brava] (nota: na frente da porta): Peraí... Você é a moça do curso. A da cebola.
- tonhao [brava]: Na minha cozinha, não. Aqui cada panela tem dono.
- bia [firme]: Tio, quem contrata sou eu. Faz um teste com ela.
- tonhao (nota: pondo uma cebola na tábua): Uma cebola. Do jeito que eu corto.
- lia [firme] (nota: cortando sem dizer nada): ...
- tonhao [insegura]: ...Hum. Ficou igual.
- bia [firme]: Bem-vinda, Lia. Eu acerto na lojinha, em Equipe.
- lia: Obrigada, chefia.

**Cap. 10, `depois`** (a cena dos temperos; troca as 3 falas de hoje e não gasta a vez da `ARCO`, decidido em 19/11 para a Lia caber no Terraço):
- lia (nota: com os potes na mão): Chef, arrumei os temperos em ordem alfabética.
- tonhao [brava]: O cominho mora do lado do fogão há trinta anos! Volta tudo pro lugar.
- lia [insegura]: Desculpa, chef. No rodízio ninguém sabia onde ficava nada.
- cami [alegre]: Ela arrumou a cozinha inteira do rodízio numa noite, Tonhão. O dono quase chorou.
- tonhao: Seu Tonhão, Cami. ...E aqui ninguém chora.
- tonhao: Mas deixa o sal onde ela pôs.
- bia [alegre]: A cozinha tá voando, tio!

**`liaPerfeita`** (ganha a fala da Cami antes do "Entendido"; o `quando` passa a pedir também `save.cap` 11 ou mais, para tocar depois da cena dos temperos):
- tonhao: Lia, a mesa quatro tá esperando a entrada faz tempo!
- lia [insegura]: Refiz três vezes, chef. O corte não ficou igual.
- tonhao [firme]: Prato perfeito e frio não serve pra ninguém. Capricho tem hora, e a hora é a do freguês.
- cami (nota: pegando o prato): Li, a mesa não quer perfeito, quer quente. Nem lá no rodízio, nem aqui.
- lia [firme]: Entendido. Sai agora.
- bia [alegre]: Tá ensinando bonito, tio.

**`liaRosa`** (nova, logo depois da `liaPerfeita`). `quando`: a `liaPerfeita` vista, `save.cap` 11 ou mais e a Lia contratada. Abre o curso Chefe de praça.
- tonhao (nota: olhando a Lia na tábua): Bia, sabe quem refazia prato três vezes? A sua mãe.
- bia: A mãe?
- tonhao [alegre]: Até aprender que prato tem hora. Aí ninguém segurava ela.
- tonhao [firme]: Lia, a boca da esquerda é sua. As entradas são suas.
- lia [insegura]: O senhor disse que cada panela tinha dono.
- tonhao [firme]: E tem. Essa agora é sua. Essa cozinha nunca foi só minha.
- bia [firme]: Então o curso dela tá na lojinha, em Equipe.

**`liaPetala`** (ganha uma fala no fim, que aponta o curso Cozinha de autor):
- tonhao (nota: com a pétala na palma da mão): Lia, hoje quem põe a pétala é você.
- lia [insegura]: Eu, chef? Esse prato é da sua família.
- tonhao [firme]: Por isso mesmo. Receita que fica numa mão só some. Eu já vi isso acontecer.
- lia [firme] (nota: pondo a pétala): ...Na hora. Como a Rosa.
- bia [firme]: E o próximo prato da casa é seu, Lia. O curso tá no Cardápio da lojinha.

**`liaChef`** (nova, depois da `liaPetala` e antes da `roda`). `quando`: `save.liaPrato` 1 ou mais e a `liaPetala` vista.
- cami [alegre]: Li, a mesa da janela quer conhecer quem fez o prato.
- lia [insegura]: Eu? Fala que foi o chef.
- tonhao [firme]: Chef é quem a mesa chama. Vai lá, chef.
- lia: ...Obrigada, Antônio.
- lia [firme]: José Carlos, Daniela: segurem a cozinha pra mim.
- bia [alegre]: Vai, Lia. O salão é da Cami, mas essa mesa é sua.

## Critérios de aceite
- **CA1** `STAFF.lia` tem os 3 níveis; com a Lia no dia, `Kitchen.ajuda` é 0,85, 0,75 e 0,75; a folha cobra 80, 100 e 120; sem ela (`liaFora`), 1 e nada → `smoke106` (1)
- **CA2** No nível 2, com a fila cheia de entradas e as bocas ocupadas, uma entrada cozinha na praça; no nível 1 e sem a Lia no dia, não há praça; o principal nunca vai para a praça → `smoke106` (2)
- **CA3** Os cursos: um por dia, `praca` antes de `autor`; no Modo História, escondidos até a `liaRosa` (praca) e a `liaPetala` (autor); comprar sobe `equipe.lia` → `smoke106` (3)
- **CA4** O Risoto de feijão-manteiguinha só é pedido com o curso de autor e a Lia no dia (300 grupos com e sem ela); cada um vendido soma em `save.liaPrato` → `smoke106` (4)
- **CA5** As falas: cap. 10 `antes` e `depois`, `LIBERA` lia, `liaPerfeita`, `liaRosa`, `liaPetala` e `liaChef` iguais às desta spec (texto, quem fala e o `e`); a ordem da `ARCO` no Terraço é `liaPerfeita`, `liaRosa`, ..., `liaPetala`, `liaChef`, `roda` → `smoke106` (5)
- **CA6** Os gatilhos: no Modo História, a `LIBERA` lia não marca antes do cap. 10; `liaPerfeita` (cap. 11 ou mais) → `liaRosa` → `liaPetala` → `liaChef` (com `liaPrato`), uma por fim de dia → `smoke106` (6)
- **CA7** Save antigo (v12.4.3) com a Lia contratada carrega no nível 1, com `liaCursos` vazio → `smoke106` (7)
- **CA8** Modo dev: `NIV.lia` sobe e desce de 0 a 3; "Tudo no máximo" põe o nível 3; as 3 conversas novas estão na lista → `smoke106` (8)
- **CA9** O cartão da Lia e os cartões dos cursos com os textos desta spec; a ficha `e-lia` nova → `smoke106` (9)
- **CA10** O Terraço com a equipe: `PONTO=terraco EQUIPE=auto node balance.js 40` passa 85–95% das metas. Se cair abaixo de 85%, o `cook` do nível 1 vai a 0,8. Se passar de 95%, o preço do risoto cai para R$ 52.
- **CA11** A campanha: `DIAS=65 node carreira.js 8` fecha a história no prazo de hoje (dia 63 ± 3), sem banco tomar a casa, com a Lia no nível 3 antes do cap. 14 em pelo menos 6 de 8 carreiras.
- **CA12** O que se vê → captura `shot_v12_5.js`: o cartão da Lia nos 3 níveis; os 2 cartões de curso; a entrada na praça (o anel de progresso perto da Lia); as conversas `LIBERA` lia, cap. 10 `depois`, `liaRosa` e `liaChef` em 844×390.

## Partes
- `src/10-constantes.js`: `PRATOS` (`liaRisoto`), `STAFF.lia`, a folha (`payroll`, linha da Lia), `LIA_CURSOS` e `normLiaCursos` (perto de `ANSELMO_CURSOS`), `HISTORIA` cap. 10 `antes` e `depois`, `LIBERA` lia (falas e `gatilho`), `ARCO` (`liaPerfeita`, `liaRosa`, `liaPetala`, `liaChef`), `liaOn`, a ficha `e-lia` em `MANUAL`, `TESTE`/`maxDoPonto` (nível da Lia).
- `src/12-clientes.js`: `normSave` (`liaCursos`, `liaCursoDia`, `liaPrato`). `pedePrincipal` (o risoto) está em `src/10-constantes.js`.
- `src/13-cozinha.js`: `Kitchen` (`ajuda` pelo nível, a praça em `reset`/`update`/`purge`/`progressFor`).
- `src/16-jogo.js`: `liaAtiva`, `setStaff` (a Lia de 0 a 3 só pelos cursos), `buyLiaCurso` e `liaCursoTrava` (no molde de `buyAnselmoCurso`), a venda do risoto (`liaPrato`), `NIV.lia`, `devEquipe('max')`, `equipeModo`, a marcação da `ARCO`.
- `src/21-cenario.js`: o anel de progresso da entrada perto da Lia (`drawLia` ou onde a cozinha desenha o progresso das bocas).
- `src/41-lojinha.js`: `buildLia` e o cartão do curso de autor no Cardápio (perto do curso de autor do Anselmo).
- `src/43-telas.js`: `LIA_CURSOS` no `window.__lcc`.
- `tests/bot.js`: compra os cursos da Lia quando aparecem e cabem no caixa.

## Tarefas
- [ ] T1 `tests/smoke106.js` com CA1 a CA9 (falhando); entra no `run_all.sh`.
- [ ] T2 `STAFF.lia` por nível, a folha, `Kitchen.ajuda`, `normSave` e o save antigo (CA1, CA7).
- [ ] T3 A praça da Lia na `Kitchen` e o anel de progresso (CA2).
- [ ] T4 `LIA_CURSOS`, a compra, a trava do dia, quando aparecem, os cartões da lojinha e a ficha do Manual (CA3, CA9).
- [ ] T5 O Risoto de feijão-manteiguinha e `save.liaPrato` (CA4).
- [ ] T6 As falas e os gatilhos (cap. 10, `LIBERA`, `ARCO`) (CA5, CA6).
- [ ] T7 Modo dev e Teste de habilidade (CA8); `tests/bot.js` compra os cursos.
- [ ] T8 Calibração: `balance.js` e `carreira.js` (CA10, CA11), seguindo as regras de ajuste dos critérios.
- [ ] T9 Capturas (CA12): tirar, olhar ampliado e apagar.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A Cami é o molde da Lia por nível (`STAFF.cami.levels`, nível = 1 + cursos) e o Anselmo é o molde dos cursos (`ANSELMO_CURSOS`, `buyAnselmoCurso`, `anselmoCursoTrava`, os dois lugares de `buildLia`/Cardápio em `src/41-lojinha.js`).
- O risoto usa o truque da barraca junina: `curso` que não existe em `CURSOS` nunca é "sabido" pelo caminho comum. A entrada nos pedidos tem de ser explícita em `pedePrincipal`.
- `setStaff('lia', ...)` hoje recusa qualquer valor diferente de 1 e qualquer descida; os cursos sobem o nível pela compra, não pelo `setStaff` (como a Cami).
- O `harness.js` desliga o Modo História: as checagens de quando os cursos aparecem e dos gatilhos precisam de `load({historia:true})`, como no `smoke34`.

## Testes
- `tests/smoke106.js` (novo, CA1 a CA9). Os smokes que conferem as falas de hoje do cap. 10 e da `LIBERA` lia (hoje, o `smoke78`) passam a conferir as novas.
- `tests/bot.js`: compra `praca` e `autor` quando aparecem.
- `balance.js` e `carreira.js` (CA10, CA11); capturas `tests/shot_v12_5.js` (CA12).

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (código de jogo em várias partes, a cozinha com uma vaga nova e calibração por tentativa)
