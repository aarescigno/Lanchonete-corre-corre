# v11.4 — As 10 conversas do arco da Avenida e do Terraço (etapa 8d)

**Situação:** entregue em 14/11
**Origem:** `docs/ARCO.md` §7 e §12 (roteiro fechado na entrevista de 14/11; pedido em `docs/PROPOSTAS.md`); etapa 8d do `docs/PLANO.md`. Aprovada em 14/11.

## Objetivo
Na Avenida e no Terraço, no fim de certos dias, a Bia, o tio e a equipe conversam por conta própria: o copo quebrado do Anselmo, o espresso do Joca, a pressa da Cami, a Dani que ensina, a Casa Aurora, a Lia e a perfeição, a risada do Anselmo, o Joca com nome, a pétala da Rosa e a roda antes da noite da estrela. Uma conversa por fim de dia, só no Modo História, pelo motor da v11.3.

## Fora do escopo
- O motor `ARCO` (v11.3): não muda. A `braulio1` (§9) entra na v11.6.
- O retrato no balão e as expressões (`e` só é guardado no texto): v11.5.
- Do `docs/ARCO.md` §8 em diante: nada.

## Regras (decisões tomadas)
Copiadas de `docs/ARCO.md` §7, sem mudança de texto. Notação: `quem [expressão] (nota): texto`; a expressão vira o campo `e` da fala (`{ q, e?, nota?, s }`); sem colchete, sem campo `e`.

### 7.1 Avenida (`nivel` 3), nesta ordem
**`anselmoCopo`** — `quando`: o Anselmo contratado e veio no dia.
- anselmo [insegura] (catando os cacos): Desculpa, desculpa! Eu pago o copo, pode descontar...
- bia: Anselmo. Olha pra mim. É um copo.
- anselmo: No outro restaurante, um copo era meia hora de grito.
- bia [firme]: Aqui é uma vassoura e um copo novo. Respira e volta pro balcão.

**`jocaEspresso`** — `quando`: `save.jocaCursos.espresso`.
- joca [insegura]: O homem de terno perguntou se "o menino da louça" sabia mexer na máquina.
- bia [firme]: Eu ouvi. E disse a ele que o nosso barista se chama Joca.
- joca: Você disse isso?
- bia [alegre]: Disse. Agora tira um espresso que faça ele engolir a piada.

**`camiPressa`** — `quando`: a Cami contratada e veio no dia.
- bia: Cami, a mesa do casal reclamou que o prato chegou antes de eles tirarem o casaco.
- cami: No rodízio era assim: girou, serviu, próxima!
- bia [firme]: Aqui mesa não é número. Pergunta o nome, olha no olho. Rápida você já é.
- cami [alegre]: Nome e olho no olho. Anotado, chefe!

**`daniEnsina`** — `quando`: `save.daniCursos.confGourmet`.
- dani [alegre]: Bia, me pediram pra ensinar o ponto do brigadeiro. Eu! Ensinando!
- bia [alegre]: E ensinou?
- dani [firme]: Ensinei. E descobri que eu explico bem.
- tonhao: Quem diria. A menina lenta dando aula.
- dani [alegre]: Lenta, não, seu Tonhão. Caprichosa.

**`cortina`** — `quando`: `save.cap` é 8 ou mais.
- bia: Tio, o senhor passou o dia olhando pra Casa Aurora.
- tonhao [insegura]: Vinte anos naquela cozinha, Bia. E saí sem levar nem o meu nome.
- bia [firme]: O senhor trouxe o que importava: a mão. O nome a gente faz aqui.
- tonhao [alegre] (fechando a cortina): ...Então vamos trabalhar, que nome não se faz sozinho.

(A sexta da Avenida, `braulio1`, entra na v11.6, com o retrato do Bráulio.)

### 7.2 Terraço (`nivel` 4), nesta ordem
**`liaPerfeita`** — `quando`: a Lia contratada e veio no dia.
- tonhao: Lia, a mesa quatro tá esperando a entrada faz tempo!
- lia [insegura]: Refiz três vezes, chef. O corte não ficou igual.
- tonhao [firme]: Prato perfeito e frio não serve pra ninguém. Capricho tem hora, e a hora é a do freguês.
- lia [firme]: Entendido. Sai agora.
- bia [alegre]: Tá ensinando bonito, tio.

**`anselmoRi`** — `quando`: `save.anselmoCursos.autor`.
- anselmo [alegre] (rindo alto atrás do balcão): Opa... desculpa o barulho.
- bia: Desculpa por quê?
- anselmo: Fazia anos que eu não ria no serviço. Nem lembrava como era.
- bia [alegre]: Então ri mais alto, que o salão gostou.

**`jocaNome`** — `quando`: o curso de cafés especiais do Joca feito (o curso de `JOCA_CURSOS` de `nivel` 4).
- joca [alegre]: Bia, a mesa da janela pediu "o café do Joca". Pelo nome!
- bia [alegre]: E o que o barista da casa respondeu?
- joca [firme]: Que hoje tem coado, prensa e cold brew. E que eu recomendo o coado.
- bia: Olha ele. Há pouco tempo, nem bom-dia.

**`liaPetala`** — `quando`: o molho da Rosa comprado, `save.cap` é 13 ou mais, a Lia contratada e `liaPerfeita` vista.
- tonhao (com a pétala na palma da mão): Lia, hoje quem põe a pétala é você.
- lia [insegura]: Eu, chef? Esse prato é da sua família.
- tonhao [firme]: Por isso mesmo. Receita que fica numa mão só some. Eu já vi isso acontecer.
- lia [firme] (pondo a pétala): ...Na hora. Como a Rosa.

**`roda`** — `quando`: `save.cap` é 14 (a noite da estrela ainda não ganha).
- bia [firme]: Antes da noite da estrela, eu quero dizer uma coisa a vocês.
- bia: Eu comecei numa garagem, com medo de abrir o portão.
- bia [alegre]: Hoje eu não tenho medo. Porque nunca mais abri sozinha.
- dani [alegre]: Ai, Bia, eu vou chorar em cima do doce!
- tonhao [alegre]: Chora depois. Primeiro a estrela.

### De onde vem cada dado do `quando` (a execução leu o código; nada foi inventado)
- `quando(sv, g)`: o save e o jogo, como na v11.3. "Contratado e veio no dia": `sv.equipe.<quem> > 0 && !sv.equipe.<quem>Fora` (`anselmoFora`, `camiFora`, `liaFora` são o "não vem hoje" da folha, zerado no `payDay` e só valendo no dia).
- Cursos: `sv.daniCursos.confGourmet`, `sv.jocaCursos.espresso`, `sv.anselmoCursos.autor`; cafés especiais do Joca: `sv.jocaCursos.cafesEsp` (o curso de `JOCA_CURSOS` de `nivel` 4).
- Molho da Rosa comprado: `sv.rosa === 1` (o mesmo que o capítulo 12, `obj.compra:'rosa'`, confere). Capítulo: `sv.cap` (`cortina`: `>= 8`; `liaPetala`: `>= 13`; `roda`: `=== 14`). Vista: `sv.arco.liaPerfeita === 1`.

## Critérios de aceite
- **CA1** (`ARCO` tem 17 entradas: as 7 de antes e as 10 novas com ids, `nivel` (3 e 4) e ordem de §7.1 e §7.2; as falas têm o texto, o `e` e a rubrica exatos; nenhuma passa de 120 letras; o `e` é um dos cinco; cada entrada tem `quando`) → `smoke80` (1, 2, 3, 4)
- **CA2** (`save.arco` tem as 17 chaves; o save antigo na Avenida recebe as da Garagem e da área industrial como 1; o save antigo no Terraço não recebe as da Avenida (nascem 1); `normSave` mantém `'pend'`, 1 e 0) → `smoke80` (5, 6, 7, 8)
- **CA3** (cada uma das 10 fica `'pend'` no fim do dia de verdade, com o `quando` dela verdadeiro e não fica sem ele; a ordem do roteiro, uma por fim de dia; as do Terraço não marcam na Avenida) → `smoke80` (CA3)
- **CA4** (os gatilhos de §7.1 e §7.2, um a um, com o dado do save) → `smoke80` (CA4)
- **CA5** (fora do Modo História nenhuma marca) → `smoke80` (CA5)
- **CA6** (modo dev: `Arco: <id>` na lista de conversas das 10 novas; "Conversas: vistas" marca as 17 como 1) → `smoke80` (CA6)
- **CA7** (`window.__lcc` expõe `ARCO` com as 17) → `smoke80` (CA7)
- **CA8** (`node carreira.js` com a História chega ao Fim como antes) → `DIAS=120 node carreira.js 10` (o Fim em 10 de 10, o banco em 0 de 10)

## Partes
- `src/10-constantes.js`: `ARCO` (10 entradas depois das 7 da v11.3) e `VERSAO`.

## Tarefas
- [x] T1 Smoke novo `tests/smoke80.js` (CA1 a CA7), falhando, incluído no `tests/run_all.sh`.
- [x] T2 As 10 entradas na `ARCO` (geradas por script do `docs/ARCO.md` §7).
- [x] T3 Atualizar smokes antigos que quebrarem (`smoke79`).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PLANO.md` (8d feita, texto arquivado), esta spec como entregue, `tests/run_all.sh` verde, commit local.

## Testes
- `tests/smoke80.js` (novo): 40 checagens, para CA1 a CA7 (CA4 por `quando` com jogo de mentira; CA3, CA5 jogando o fim do dia de verdade).
- `tests/smoke79.js`: as contagens de `ARCO` passam de `=== 7` para `>= 7` ou `ARCO.length`, e o texto exato confere só as 7 primeiras (sem mudar o que confere).
- Medido: ver Desvios (`run_all.sh` e `carreira.js`).

## Decisões em aberto
Nenhuma.

## Desvios
- Smoke escrito antes, falhando; textos e `ARCO` gerados do mesmo roteiro por script, sem reescrever fala.
- `quando` por dado do save: nenhum dado faltou. `liaPetala` lê "a Lia contratada" literalmente (`sv.equipe.lia > 0`, sem o "veio no dia", que o roteiro não pede); `roda` lê `sv.cap === 14` ("é 14").
- O smoke usa o Anselmo no nível 2 (o nível 1 dele não existe em `STAFF.anselmo.levels`).

**Modelo:** Sonnet, esforço baixo (só entradas e smoke).
