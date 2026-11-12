# v10.5 — Salários de verdade (etapa S)

**Situação:** aprovada (12/11)
**Origem:** conversa de 11 e 12/11/2026 (pergunta do usuário: "os salários dos funcionários estão compatíveis com suas funções pensando na vida real em todos os ambientes?") e a entrevista de 12/11; ajuste de 12/11 (pedido do usuário: o salário da Dani e do Joca acompanha a carreira deles, confeiteira e barista). Pesquisa: `docs/pesquisa-salarios.md`.

## Objetivo
Cada pessoa da equipe e cada música passa a custar o que o cargo custaria de verdade, na mesma proporção do aluguel (cerca de 80% do custo real). O Tonhão deixa de trabalhar de graça e a Dani ganha uma ajuda de custo; a garçonete deixa de valer quase três ajudantes. O salário acompanha a carreira de cada um: a Dani, de aprendiz a chef confeiteira, e o Joca, de ajudante a barista de cafés especiais, ganham mais a cada curso da especialidade, como já acontece com a Cami e o Anselmo. Para o jogo não ficar mais difícil, o cardápio sobe para perto do preço real e as metas são acertadas pelo bot.

## Fora do escopo
- Gorjeta dos 10% para a Cami (decidido em 12/11: não entra).
- TV, som e as TVs da área industrial: são conta de luz, não salário.
- Aluguel, mudança, crédito do banco, preços de cursos, móveis e melhorias.
- O nível de luxo (4b, agora v10.6) e os eventos de bairro (4c, agora v10.7).

## Regras (decisões tomadas)
- **Diárias** (R$ por dia; `STAFF` em `src/10-constantes.js`; o `pay` passa a ser o salário inteiro do nível, não o aumento):
  - **Tonhão** `levels[0..4].pay`: **50 · 65 · 80 · 100 · 120** (eram 0 · 15 · 20 · 25 · 30). Começa abaixo do mercado na Garagem e chega ao de um chefe de cozinha no nível 4.
  - **Dani** `levels[1..4].pay`: **15 · 25 · 32 · 40** (eram 0 · 15 · 20 · 25). O nível 1 é a ajuda de custo de aprendiz.
  - **Joca** `levels[2..4].pay`: **65 · 78 · 90** (eram 45 · 60 · 75).
  - **Carreira da Dani e do Joca** (ajuste de 12/11): os cursos da especialidade ganham um campo `pay` (a diária do degrau): em `DANI_CURSOS`, `confCaseira` **75** (confeiteira júnior), `confGourmet` **105** (confeiteira) e `confAlta` **145** (chef confeiteira); em `JOCA_CURSOS`, `espresso` **100** (barista) e `cafesEsp` **125** (barista de cafés especiais). Os cursos de atendimento (`atend`, `cozinha` do Joca e os da Dani sem `item`) não têm `pay`. **A diária é a do degrau mais alto que a pessoa alcançou:** `max(levels[nível].pay, maior pay dos cursos feitos)`. Função nova `diariaDani(eq, cursos)` e `diariaJoca(eq, cursos)` em `10-constantes.js`, usadas pelo `payroll`.
  - Na folha cortada: o degrau de curso **nunca é cortado** (como a base do Tonhão). Com um curso feito, `folhaCorta` pula o "aumento da Dani" e o "aumento do Joca" quando tirar o nível não baixa a diária (a pessoa já está no degrau do curso); "o Joca não vem" continua valendo para ele. O cartão do curso na lojinha não muda (só "Comprar R$ X", como os da Cami).
  - Botão de aumento do cartão da Dani e do Joca: mostra a diferença **real** na folha (a diária com o nível novo menos a de hoje, já com o degrau do curso); se der 0, o botão diz **"Aumento: sem custo"**.
  - **Cami** `levels[1..4].pay`: **95 · 115 · 135 · 160** (eram 120 · 140 · 160 · 190).
  - **Anselmo** `levels[2..3].pay`: **105 · 150** (eram 90 · 130).
  - **Lia** `pay`: **80** (não muda).
  - **Couvert** `STAFF.couvert`: `pay` **200** (era 80) e `fee` **8** (era 3, o que cada cliente paga).
  - **Música do Terraço** (`TERRACO.musica`):
    - o **quarteto vira trio**: `{ nome:'Trio de cordas', pay:500, effect:0.35, amb:1 }` (era o Quarteto de cordas, 150, 0,3 e 0,75);
    - **pianista**: `{ nome:'Pianista', pay:300, piano:5, effect:0.25, amb:1.5 }` (era 120 + 30, 0,2 e 1,25).
    - Textos: o cartão da lojinha mostra "Trio de cordas · R$ 500/dia" e "Pianista · R$ 305/dia"; na folha, `folhaItens` diz "trio de cordas" e "pianista e afinação".
- **Folha sem dinheiro** (decidido em 12/11): o salário base do Tonhão (nível 0) e o da Dani (nível 1) **nunca são cortados**. A ordem de `FOLHA_CORTE` não muda: o Tonhão e a Dani só perdem níveis de aumento até a base. Se nem a base couber no caixa, o dia abre assim mesmo e o caixa pode ficar negativo; daí vale a regra do banco que já existe (`BANCO.neg`, empréstimo à força). O `payDay` já para de cortar quando `folhaCorta` devolve `null`; isso não muda.
- **Textos da folha e da lojinha:**
  - `folhaItens`: "aumento do Tonhão" vira **"Tonhão"** e entra sempre; "aumento da Dani" vira **"Dani"** e entra sempre que ela está na equipe.
  - Cartão da Dani no nível 1: "aprendiz (sem salário)" vira **"aprendiz (R$ 15/dia)"**. Os botões "Aumento: +R$ X/dia" continuam, calculados pela diferença entre os níveis (dão os valores novos sozinhos).
  - Ficha do Manual `e-tonhao`: a linha passa a ser **"O chef. Aprende pratos nos cursos e, com aumento, cozinha mais rápido e ajuda na pia."** As outras fichas da equipe não citam salário: não mudam.
  - Na fala do Tonhão sobre a Dani ("Pedi ajuda pra Dani, filha da vizinha. Ela vem aprender com a gente."), nada muda.
- **Cardápio** (decidido em 12/11: os preços sobem para perto do real, com o PF da Garagem em **R$ 30** no máximo): todos os `CARDAPIO[k].preco` sobem pelo mesmo fator **1,2**, arredondado ao real (PF 25 → **30**, PF vegetariano e vegano 23 → **28**, coxinha 8 → **10**, risoles 6 → **7**, kibe 7 → **8**, misto 10 → **12**, bauru 12 → **14**, pastel 10 → **12**, e assim por diante: `Math.round(preco × 1.2)`). Os pratos dos cursos do restaurante e da alta gastronomia seguem a mesma regra. `DRINK_PRICE`, a marmita (que usa o preço do prato) e o preço dos cursos não mudam por esta regra.
- **Calibração com o bot** (só números, um por vez, medindo de novo; no máximo 3 mudanças por rodada, cada uma registrada em Testes). Medidas: `node balance.js 40`, `node balance.js 40` com `EQUIPE=auto`, `PONTO=industrial|avenida node balance.js 40` com `BOT=afiado EQUIPE=auto`, `PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=4 CAFESESP=1 AUTOR=1 MUSICA=2 node balance.js 80` e `DIAS=65 node carreira.js 12`. Passos, nesta ordem:
  1. **Garagem, metas dos dias 1 a 7** (`DAYS[].meta` e `.expert`): sem equipe entre 40% e 70% das metas nos dias 3 a 7, com `EQUIPE=auto` entre 85% e 95%. Fora da faixa, multiplique `meta` e `expert` dos dias 1 a 7 por 0,9 (ou 1,1) e arredonde a 5; repita.
  2. **Pontos 2 a 4, metas** (`PONTOS[].metaF` e `expertF`): equipe toda entre 85% e 95% das metas e 3★ do afiado entre 50% e 70%. Passo: 0,1 na área industrial e na Avenida, 0,5 no Terraço.
  3. **Lucro por ponto** (`carreira.js`, linha `PONTOS`): o lucro médio por dia de cada ponto fica a ±15% do medido antes desta versão (Garagem R$ 340, área industrial R$ 648, Avenida R$ 881, Terraço R$ 1.733; medidos em 11/11 com `DIAS=65 node carreira.js 2`; meça de novo com 12 carreiras **antes de mudar o código** e use esses números). Abaixo da faixa nos pontos 2 a 4: `PONTOS[].cardapio` sobe 0,1 de cada vez; acima, desce 0,1. A Garagem não mexe no cardápio (o PF fica em R$ 30): só nas metas do passo 1.
  4. **A música vale o preço:** no Terraço, o lucro médio com `MUSICA=1` e com `MUSICA=2` fica pelo menos igual ao lucro sem música (`MUSICA=0`), na mesma rodada do `balance.js`. Se não ficar, o `effect` da que perdeu sobe 0,05 de cada vez, até 0,5. O mesmo vale para o couvert na Avenida (`PONTO=avenida`, com `COUVERT=1` e `COUVERT=0`, chave nova do `balance.js`): se perder, `STAFF.couvert.effect` sobe 0,05, até 0,4.
  5. **Campanha:** 0 dias no negativo nos 5 dias depois de cada mudança, 0 lanchonetes tomadas pelo banco e a mudança para a área industrial a no máximo 3 dias da mediana de antes (dia 22 ou 23). Se falhar, o 1º passo é baixar as metas da Garagem (passo 1) em mais 10%.
  6. **Nota do Gurugol** no Terraço com a equipe toda entre 4,4 e 4,8 (como na v10.4): acima de 4,8, a música perde 0,25 de `amb`; abaixo, ganha 0,25.
- **Modo dev:** nada novo para ligar (é só número); o botão "Música: trocar" da v10.4 passa a mostrar "Trio de cordas" no lugar do quarteto. No modo dev livre (`devLivre`), a folha continua de graça como hoje.
- **Manual:** só a ficha `e-tonhao`, como acima. A ficha `l-musica` ("Quarteto ou pianista: ...") passa a dizer **"Trio ou pianista: a paciência nas mesas dura mais e o ambiente melhora."**
- **Save:** nenhum campo novo. Um save da v10.4 carrega igual e paga os valores novos a partir do dia seguinte; `equipe.musica: 1` passa a ser o trio.

## Critérios de aceite
- **CA1** As diárias de cada nível são as das Regras (Tonhão, Dani, Joca, Cami, Anselmo, Lia, couvert com taxa de 8, trio 500, pianista 300 + 5); a folha completa da Garagem (`{tonhao:4, dani:4, tv:true, som:true}`) dá R$ 165 → `smoke67` (1)
- **CA1b** A diária da Dani é a do degrau mais alto: nível 4 sem curso dá 40; com Confeitaria caseira, 75; gourmet, 105; alta, 145. A do Joca: nível 4 sem curso, 90; com espresso, 100; com cafés especiais, 125. Os cursos de atendimento não mudam a diária. Com a Dani no nível 2 e a caseira feita, o botão de aumento diz "Aumento: sem custo" → `smoke67` (1b)
- **CA2** Sem dinheiro, o Tonhão no nível 0 e a Dani no nível 1 trabalham assim mesmo: `folhaCortes` com caixa 0 não os tira, e o dia abre com a folha deles reservada → `smoke67` (2)
- **CA3** A folha mostra "Tonhão" e "Dani" (não mais "aumento do..."), o cartão da Dani no nível 1 diz "aprendiz (R$ 15/dia)" e o cartão da música diz "Trio de cordas · R$ 500/dia" e "Pianista · R$ 305/dia" → `smoke67` (3)
- **CA4** Os preços do cardápio são `Math.round(antigo × 1,2)`: PF 30, coxinha 10, misto 12, pastel 12, bauru 14, PF vegetariano 28 → `smoke67` (4)
- **CA5** As fichas `e-tonhao` e `l-musica` têm os textos novos → `smoke67` (5)
- **CA6** Um save da v10.4 carrega igual, e `musica: 1` aparece como trio de cordas → `smoke67` (6)
- **CA7** Garagem: sem equipe entre 40% e 70% das metas nos dias 3 a 7; com `EQUIPE=auto` entre 85% e 95% → `node balance.js 40` (passo 1)
- **CA8** Pontos 2 a 4 com a equipe toda entre 85% e 95% das metas e 3★ do afiado entre 50% e 70% → `PONTO=industrial|avenida BOT=afiado EQUIPE=auto node balance.js 40` e o comando do Terraço das Regras (passo 2)
- **CA9** Lucro médio por dia de cada ponto a ±15% do de antes, 0 dias no negativo depois das mudanças, 0 tomadas pelo banco, mudança para a área industrial a até 3 dias da mediana de antes → `DIAS=65 node carreira.js 12` (passos 3 e 5)
- **CA10** No Terraço, com trio ou pianista o lucro é pelo menos o de sem música; na Avenida, com couvert pelo menos o de sem couvert; nota do Gurugol do Terraço entre 4,4 e 4,8 → `PONTO=terraco ... MUSICA=0|1|2 node balance.js 80` e `PONTO=avenida COUVERT=0|1 node balance.js 40` (passos 4 e 6)

## Partes
- `src/10-constantes.js`: `CARDAPIO` (preços), `STAFF` (diárias, `couvert.fee`), `TERRACO.musica`, `folhaItens`, `DAYS` (metas), `PONTOS` (`metaF`, `expertF`, `cardapio` se a calibração pedir), `MANUAL` (`e-tonhao`, `l-musica`).
- `src/10-constantes.js` também: `DANI_CURSOS` e `JOCA_CURSOS` (campo `pay`), `diariaDani`, `diariaJoca`, `payroll`, `folhaCorta`, `folhaCortes`.
- `src/41-lojinha.js`: o cartão da Dani (texto do nível 1 e botão de aumento, perto da linha 382), o do Joca (botão de aumento, perto da 421), o `canPay` (linhas ~309 e ~341) e o cartão da música (rótulos do trio).
- `src/16-jogo.js`: só conferir `payDay` (perto da linha 273); não deve precisar mudar.
- `tests/`: `smoke67.js` novo; `balance.js` (chave `COUVERT`, perto do `FULL` da linha 23); smokes antigos que conferem preços e diárias (`smoke24`, `smoke31`, `smoke34`, `smoke66` e outros com `payroll` ou `preco`) passam a conferir os números novos.

## Tarefas
- [ ] T1 Medir o lucro por ponto de antes: `DIAS=65 node carreira.js 12` no código da v10.4 (linha `PONTOS`) e anotar em Testes.
- [ ] T2 Smoke novo `tests/smoke67.js` com os CA1 a CA6 (falhando) e no `run_all.sh`.
- [ ] T3 Diárias novas em `STAFF` e `TERRACO.musica` (trio), `couvert.fee` 8.
- [ ] T3b Carreira: `pay` nos cursos de `DANI_CURSOS` e `JOCA_CURSOS`, `diariaDani` e `diariaJoca`, `payroll` com os cursos, `folhaCorta` pulando o aumento que não baixa a diária, botões de aumento com a diferença real.
- [ ] T4 `folhaItens` ("Tonhão", "Dani", "trio de cordas"), cartão da Dani e cartão da música na lojinha, fichas `e-tonhao` e `l-musica`.
- [ ] T5 Preços do `CARDAPIO` × 1,2 arredondados.
- [ ] T6 Atualizar os smokes antigos que conferem os números velhos (cada um com o comentário "v10.5: salários e preços de verdade").
- [ ] T6b Chave `COUVERT=0|1` no `balance.js` (padrão 1, como hoje: na Avenida, o couvert com taxa entra no `FULL`; com 0, sai), documentada no `docs/TESTES.md`.
- [ ] T7 Calibração pelos passos 1 a 6 das Regras, anotando cada rodada em Testes.
- [ ] T8 `docs/TESTES.md`: os números novos do balanceamento (faixas medidas na v10.5).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, a linha da tabela Situação do `PLANO.md`, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- `payroll(eq)` só recebe a equipe, mas os cursos estão no save (`save.daniCursos`, `save.jocaCursos`): dê a ele um 2º parâmetro (`payroll(eq, { dani: sv.daniCursos, joca: sv.jocaCursos })`) e passe-o em todas as chamadas (`10-constantes.js` ~708, `16-jogo.js` ~276, ~284, ~1219 e ~1223, `41-lojinha.js` ~309 e ~341); sem ele, conta como sem curso. O `balance.js` e o `carreira.js` usam a mesma função.
- O botão de aumento do Tonhão (`41-lojinha.js`, ~323) já calcula pela diferença entre níveis e continua certo; o da Dani e o do Joca passam a usar a diferença real (CA1b). O `canPay` soma o `payroll` inteiro, então a base do Tonhão já entra.
- `payDay` (`16-jogo.js`) para de cortar quando `folhaCorta` devolve `null`: a regra "vêm assim mesmo" já é o comportamento; o CA2 só confere.
- Procure "R$ 25", "quarteto" e "sem salário" em `src/` (falas, Manual, dicas da Missão zero) antes de fechar: texto com o preço antigo ou com o quarteto precisa acompanhar. O comentário da linha ~265 de `10-constantes.js` cita "PF de R$ 25": atualize.
- A calibração mexe em vários pontos: rode cada medida inteira antes do próximo ajuste, para não confundir efeitos.

## Testes
(No fechamento: quantas checagens o `smoke67` tem, os números de antes (T1) e cada rodada da calibração.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto (código simples, mas a calibração por tentativa mexe nos quatro pontos e em muitos smokes)
