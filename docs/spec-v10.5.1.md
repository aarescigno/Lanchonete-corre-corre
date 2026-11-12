# v10.5.1 — Metas no alvo e a música do Terraço (etapa R1)

**Situação:** entregue em 12/11
**Origem:** revisão do balanceamento pedida pelo usuário em 12/11 (medições na v10.5; decisão da música pelo usuário no mesmo dia: "a música faz pedir mais", com o preço mantido).

## Objetivo
O primeiro dia deixa de ser perdido por azar, a sexta-feira da Garagem para de ser o dia mais ingrato da primeira semana, as metas da área industrial e da Avenida voltam a pedir um dia bem jogado e a música ao vivo do Terraço passa a se pagar: com ela, as mesas ficam para mais uma rodada.

## Fora do escopo
- O ritmo da história (capítulos e conversas): `docs/spec-v10.5.2.md`.
- A 3ª estrela da área industrial (45% com o bot afiado, alvo de 50 a 70%): o que segura não é o lucro (97% dos dias batem o lucro das 3 estrelas), é não perder ninguém (o entregador da retirada). Fica como está; o alvo da área industrial passa a ser 40 a 70%.
- O dinheiro que sobra depois do fim da história: é assunto do nível de luxo (4b) e do crítico (etapa 6).
- Preços da equipe e do cardápio (v10.5): não mudam.

## Regras (decisões tomadas)
Medido na v10.5, em 12/11 (`balance.js 40`, três rodadas onde diz): dia 1 batido em 34 a 36 de 40 (lucro p10 de R$ 43 a 57, meta 50); dia 6 com `EQUIPE=auto` em 30 de 40; área industrial 352 de 360 dias (97,8%) e Avenida 351 de 360 (97,5%) com `BOT=afiado EQUIPE=auto`; no Terraço (80 rodadas, equipe toda), lucro médio por dia de R$ 3.050 sem música, R$ 2.885 com o pianista (`MUSICA=2`) e R$ 2.796 com o trio (`MUSICA=1`).
- **Dia 1:** `DAYS[0].meta` 50 → **35** (`expert` continua 80).
- **Dia 6:** `DAYS[5].meta` 205 → **185** (`expert` continua 415). Os dias 8 em diante usam o perfil do dia 7 e não mudam.
- **Área industrial:** `PONTOS[1].metaF` 2,1 → **2,3** e `expertF` 1,4 → **1,5** (para o lucro das 3 estrelas continuar pelo menos 15% acima da meta).
- **Avenida:** `PONTOS[2].metaF` 2,8 → **3,1** (`expertF` continua 3,4).
- **Mais uma rodada (música do Terraço):** cada item de `TERRACO.musica` ganha `rodada:{ chance, valor }`: trio `{ chance:0.5, valor:0.2 }`, pianista `{ chance:0.65, valor:0.2 }`. Na hora de cobrar a conta de uma mesa (`collectBill`), com música no dia e no Terraço, sorteia-se `chance`: saindo, a conta da mesa sobe `valor` (arredondado para inteiro) e o custo de ingredientes do dia sobe `INGRED.prato` desse acréscimo. O entregador e a marmita não entram (não há no Terraço). `pay`, `effect`, `amb` e `piano` não mudam.
  - Na tela, a mesa que ficou para a rodada mostra, junto do valor que sobe da conta, o texto **"Mais uma rodada!"** (o mesmo texto flutuante do pagamento; com `prefers-reduced-motion`, sem animação, como os outros).
  - `game.stats.rodadas` conta as mesas do dia que ficaram para a rodada (para o smoke e o bot).
- **Calibração com o bot** (só os números acima, um por vez, medindo de novo; cada mudança anotada em Testes):
  1. Dia 1: se a média de 3 rodadas de `node balance.js 40` ficar abaixo de 37 de 40, meta 35 → 30.
  2. Dia 6: com `EQUIPE=auto`, alvo de 34 a 38 de 40 (média de 3 rodadas); abaixo, meta 185 → 170; acima, 185 → 195.
  3. Área industrial e Avenida: alvo de 88 a 94% (3 rodadas de 40, dias 8 a 10). Fora da faixa, `metaF` anda 0,1 por vez (no máximo 3 passos); na área industrial, `expertF` acompanha para o lucro das 3 estrelas ficar pelo menos 15% acima da meta.
  4. Música: com o comando do Terraço abaixo e 80 rodadas, o lucro médio dos 3 dias com trio e com pianista tem de ficar entre **R$ 0 e R$ 150 acima** do sem música. Fora disso, `rodada.chance` anda 0,05 por vez (no máximo 4 passos por músico); se nem assim fechar, pare e pergunte.
- **Modo dev:** nada novo para ligar (o botão "Música: trocar" da v10.4 já liga a música; a rodada vem junto).
- **Manual:** a ficha `l-musica` passa a dizer **"Trio ou pianista: a paciência nas mesas dura mais, o ambiente melhora e a mesa pede mais uma rodada."**
- **Save:** nenhum campo novo; um save da v10.5 carrega igual.

## Critérios de aceite
- **CA1** `DAYS[0].meta` é 35, `DAYS[5].meta` é 185, `PONTOS[1]` tem `metaF` 2,3 e `expertF` 1,5 e `PONTOS[2].metaF` é 3,1 (ou os valores finais da calibração, corrigidos nas Regras) → `smoke68` (1)
- **CA2** No Terraço com trio, forçando o sorteio a sair, a conta cobrada é a conta sem música × 1,2 (arredondada), o custo do dia sobe 35% do acréscimo e `stats.rodadas` soma 1; forçando a não sair, a conta é a de sempre → `smoke68` (2)
- **CA3** Sem música no Terraço, e com `equipe.musica` ligada fora do Terraço (Avenida), nenhuma conta muda e `stats.rodadas` fica 0 → `smoke68` (3)
- **CA4** A ficha `l-musica` do Manual tem o texto das Regras → `smoke68` (4)
- **CA5** Um save da v10.5 com música contratada carrega e fecha um dia sem erro → `smoke68` (5)
- **CA6** Dia 1 batido em pelo menos 37 de 40 e dia 6 com equipe entre 34 e 38 de 40; Garagem sem equipe, dias 3 a 7, entre 40 e 70% e com `EQUIPE=auto` entre 85 e 95% → `node balance.js 40` e `EQUIPE=auto node balance.js 40` (passos 1 e 2)
- **CA7** Área industrial e Avenida entre 88 e 94% das metas; 3ª estrela do afiado entre 40 e 70% na área industrial e entre 50 e 70% na Avenida → `PONTO=industrial|avenida BOT=afiado EQUIPE=auto node balance.js 40` (passo 3)
- **CA8** No Terraço, o lucro médio com trio e com pianista fica de R$ 0 a R$ 150 acima do sem música, e as metas seguem entre 85 e 95% → `PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=4 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 MUSICA=0|1|2 node balance.js 80` (passo 4)
- **CA9** A campanha não piora: 0 dias no negativo, 0 lanchonetes tomadas pelo banco e o lucro médio por dia de cada ponto a ±10% do de antes (Garagem R$ 371, área industrial R$ 637, Avenida R$ 1.108, Terraço R$ 1.961, medidos em 12/11) → `DIAS=90 node carreira.js 8`
- **CA10** O texto "Mais uma rodada!" aparece legível sobre a mesa → captura do Terraço com música (recorte ampliado da mesa que pagou; olhar e apagar)

## Partes
- `src/10-constantes.js`: `DAYS` (dias 1 e 6), `PONTOS` (área industrial e Avenida), `TERRACO.musica`, a ficha `l-musica` do `MANUAL`.
- `src/16-jogo.js`: `collectBill` (a rodada), `this.stats` (o campo `rodadas`).
- `src/22-salao-hud.js` ou onde o valor da conta sobe da mesa: o texto da rodada.
- `tests/balance.js`: mostrar `rodadas` por dia no Terraço.

## Tarefas
- [x] T1 `smoke68` com os CA1 a CA5 (falhando) e a linha dele no `run_all.sh`.
- [x] T2 Os números das metas (dias 1 e 6, área industrial, Avenida).
- [x] T3 A rodada: `TERRACO.musica`, `collectBill`, `stats.rodadas`, o texto na mesa e a ficha do Manual.
- [x] T4 `balance.js` mostra `rodadas`; calibração (passos 1 a 4), com cada medida anotada em Testes.
- [x] T5 `DIAS=90 node carreira.js 8` (CA9) e a captura do CA10.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O comando do Terraço só contrata a equipe toda com `JOCA=4 CONFEITARIA=1` (sem eles o bot não bate nenhuma meta: é erro do comando, não do jogo).
- Smokes antigos que conferem as metas dos dias 1 e 6 ou o `metaF` (o `smoke67` confere as metas da v10.5) mudam de número: corrija o esperado, sem afrouxar a checagem.
- O sorteio da rodada tem de dar para forçar no teste (ex.: trocar `rodada.chance` para 1 ou 0 em runtime, como o `MUSICA_CFG` do `balance.js`).

## Testes
- `smoke68` novo; `MUSICA_CFG='{"1":{"rodada":{"chance":0.6,"valor":0.2}}}'` troca a rodada em runtime no `balance.js`.
- No fechamento: checagens do `smoke68` e a calibração medida (os quatro passos).

## Decisões em aberto
Nenhuma.

## Desvios
- **Música (passo 4):** com o mesmo `valor`, as duas `chance` iguais não fecham (o pianista custa R$ 195 a menos por dia que o trio). Com a decisão do usuário (chances diferentes), `rodada.chance` ficou **0,70 (trio)** e **0,50 (pianista)**, fora do limite de 4 passos de 0,05 (medido: trio +R$ 74; pianista +R$ 56 e +R$ 91). Regras corrigidas: trio 0,5 → 0,7; pianista 0,65 → 0,5.
- **Avenida (CA7):** nem com `metaF` 3,4 (3 passos) a taxa saiu de 97 a 98%; ficou em 3,1 (o bot passa quase sempre, mesmo com a meta mais alta). Fica como está (3,1), fora do alvo de 88 a 94%.
- **Terraço (CA8):** as metas passam em ~97% (alvo 85 a 95%), com e sem música: vem do balanceamento da v10.5, não da rodada.
- **CA9:** o lucro médio por dia do Terraço foi a R$ 2.327 (+19% sobre R$ 1.961, fora de ±10%); Garagem (R$ 361, −3%), área industrial (R$ 675, +6%) e Avenida (R$ 1.089, −2%) ficaram dentro.
- **Texto da rodada:** nasce 30 px abaixo do centro da mesa, porque no alto ele se sobrepunha à "Gorjeta!".
- **Smokes antigos:** `smoke24`, `smoke38`, `smoke42`, `smoke66` e `smoke67` tiveram o esperado corrigido (metas, `bomGoal` do dia 1 = R$ 50, ficha).

**Modelo:** Sonnet, esforço médio (números com calibração guiada e um gancho pequeno na conta).
