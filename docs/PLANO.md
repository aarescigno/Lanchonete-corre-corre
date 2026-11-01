# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário. **A 3b-1 (v9.1) foi feita em 31/10.** **Revisão de 31/10** (o plano da equipe e a v9.1 foram feitos ao mesmo tempo): entra a **3b-1r** (v9.1.1, realinhamento) antes da 3b-2; a 3b-1r (v9.1.1) e a 3b-2 (v9.2) foram feitas em 31/10; a 3b-2d (v9.2.1, modo dev com painel) também foi feita em 31/10; a 3b-3 (v9.3) também foi feita em 31/10; a 3b-4 (v9.4) também foi feita em 31/10; a 3b-5 (v9.5) também foi feita em 31/10; a 3b-6 (v9.6) também, em 31/10; a 3b-7 (v9.6.1) foi feita em 01/11; a 3c (v9.6.2) foi feita em 01/11. **Pedido do usuário de 01/11** (retornos do Renan, entrevista em `docs/PROPOSTAS.md`): antes da 4a vêm a **3d**, em 3 sessões (3d-1, v9.6.4; 3d-2, v9.6.5; 3d-3, v9.6.6), e a **3e** (revisão da interface, com o Opus); a 3d-1 (v9.6.4) foi feita em 01/11 (a v9.6.3 já era o ajuste da Dani, então as versões seguintes subiram um número); **a próxima é a 3d-2 (v9.6.5)**. **Pedido do usuário de 01/11 (noite):** depois da 3d-3 e antes da 3e entra a **3f** (o Manual e menos texto explicativo, em 2 sessões: 3f-1, v9.6.7; 3f-2, v9.6.8). Depois, a 3e e a 4a, que precisa ser planejada com o Opus antes (com o resultado da 3e).

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 3b-7 | Rebalanceamento da escada completa (Garagem, área industrial e Avenida), antes do Terraço | v9.6.1 | feita em 01/11 (`docs/spec-v9.6.1.md`; `metaF` 2,3 e 3,2, `expertF` novo 1,6 e 3,8, `CAMI_MESAS_MAX` 2; a Garagem ficou como estava) |
| 3c | Retornos de 01/11: a pia da Dani, as conversas do Cardápio e dos entregadores, o "+ marmita" desligado | v9.6.2 | feita em 01/11 (`docs/spec-v9.6.2.md`; `smoke49`; balance dentro do alvo sem mudar `metaF`) |
| 3d-1 | Retornos do Renan (01/11): a fila, o fim do turno, o VIP, o Efood e o Salão | v9.6.4 | feita em 01/11 (`docs/spec-v9.6.4.md`; `smoke50`; Avenida `metaF` 3,2 → 3,0 e `expertF` 3,8 → 3,6; a v9.6.3 já era o ajuste da Dani) |
| 3d-2 | Retornos do Renan: as marmitas e o prato mais antigo | v9.6.5 | a fazer |
| 3d-3 | Retornos do Renan: a pia, o lixo, a lavagem e os doces | v9.6.6 | a fazer |
| 3f-1 | O Manual (bestiário que se revela com a história) | v9.6.7 | a fazer |
| 3f-2 | Menos texto na tela: lojinha, abertura do dia e balões | v9.6.8 | a fazer |
| 3e | Revisão da interface antes da 4a (levantamento, com o Opus) | — | a fazer |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1 a v9.6)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).
- As sessões 3a (feita em 30/10, v9), 3b-1 (31/10, v9.1), 3b-1r (v9.1.1), 3b-2 (31/10, v9.2), 3b-3 (31/10, v9.3), 3b-4 (31/10, v9.4), 3b-5 (31/10, v9.5), 3b-6 (31/10, v9.6) e 3b-7 (01/11, v9.6.1) estão no `docs/PLANO-FEITO.md`. A etapa 3 está completa; as seções abaixo ficam como referência para a 4.

### Vale para a 3a e a 3b
- **Mudança** na lojinha (aba "Ponto"): custo único, aluguel dali em diante e os móveis levados junto. O editor abre no ponto novo com a arrumação automática.
- Para mudar, é preciso o dinheiro da mudança **e a nota mínima do Gurugol** (etapa 2c; o usuário pediu 4,5 ★ para sair da Garagem, que exige jogar muito bem: o bot afiado ficava entre 4,35 e 4,5. Desde a v8.6.4, com o teto de 3 ★ da Garagem, o equivalente é ~2,8 ★. **Decidido em 30/10:** `avalMinimo`, 90% do teto: 2,7 para sair da Garagem e 3,4 da área industrial). Ao mudar, as avaliações antigas continuam na média, e a nota sobe aos poucos até o teto novo.
- Cada ponto traz: multiplicador do cardápio (feito: ×1,5 na área industrial e ×2 na Avenida), mistura de clientes, área útil, cadeiras de espera, visual (piso, fachada, letreiro, vista da janela, calçada) e o **capítulo da história** do ponto.
- **Ao mudar, o ambiente e a bebida da espera são trocados** pelos do ponto novo (decidido em 21/10): a TV e o som da Garagem saem do save (`equipe.tv`, `equipe.som`), como o couvert abaixo do nível 3. A torneira sai do mesmo jeito (decidido em 30/10).
- **Modo dev** (v7.5.1): os pontos entram liberados, para testar.
- O ranking da carreira segue a regra da 2b, com o ponto alcançado ao lado.
- O "cardápio maior" dos pontos de cima mexe na diversidade do cardápio do Gurugol (`avalMenu`).

### Checagens de fim de sessão (valem para toda etapa que mexe em ponto, cenário, lojinha ou menu; a 3b e a 4 repetem)
- **Cenário:** capturas do salão do ponto em jogo (`tests/shot_vX.py`; sem playwright de Python, `pip install --target /tmp/pwpy playwright` e `PYTHONPATH=/tmp/pwpy`) com gente de cada tipo novo, tudo comprado e o apito/aviso na tela; conferir em recorte ampliado (PIL `crop`): parede, janela, letreiro, calçada (espera, jarra, plantas), TVs, balcão de pratos e de retirada com as vagas do ponto, roupas e acessórios da clientela nova, balões novos. Nenhum erro de página (`ERRORS: []`) e `prefers-reduced-motion` sem animação. Celular deitado (740×360) do salão.
- **Lojinha:** capturas do cartão novo apagado (falta dinheiro, falta nota, os dois), aceso e na confirmação; das abas Melhorias, Manutenção, Decoração e Dinheiro do ponto novo (nomes, preços e textos do ponto, o cartão que sai, o título com o nome do ponto); nada cortado nem sem rolar; o modo dev libera tudo sem custo.
- **Menu e telas:** `python3 menu_fit.py` verde (o menu não rola em nenhum tamanho; por isso o menu não ganhou linha nova com o nome do ponto); rótulo da História (cap., ponto, dia); cartão de fim de capítulos; conversas dos capítulos novos; fim do dia (aluguel e linha do capítulo) e painel Versões.
- **Teste de balanceamento** (com o ponto novo; cada alvo tem a regra de ajuste no plano da etapa): `PONTO=<ponto> node balance.js 40` com `BOT=afiado EQUIPE=auto` (passa 85–90% das metas; 3★ em ~60% dos dias), com `EQUIPE=auto` comum (~100% nos dias 8+), e sem equipe (a mudança **não** pode compensar); `node carreira.js 8` (e `MOVEIS=quatro`) com `DIAS=35`: dia da mudança, caps no prazo, 0 dias no negativo e o ganho por dia contra a Garagem (`MUDA=0`), que dá o prazo de volta do investimento; `DBGF=1` para ver grupos servidos e lotado por dia. Pontos a medir antes de mexer em `cardapio`, `aluguel`, `grupos` ou `metaF`: use `PONTO_CFG='{...}'` em vez de editar `src/`. Os números medidos vão no `docs/spec-vN.md`.

### 3b — Avenida Brasil, a equipe, o fiscal e o Anselmo: decisões de 31/10 (v9.1 a v9.6)
> **Planejada com o usuário em 31/10** (respostas em `docs/PROPOSTAS.md`). Decidido: o **Joca** faz o básico (a lista de tarefas da Dani) e a **Dani se especializa** em confeiteira; o **fiscal da vigilância sanitária** entra (sessão 3b-4); a **conta rachada** continua guardada. Os números abaixo são o ponto de partida; os que se calibram dizem como.
> **Revista na entrevista da equipe (31/10):** cada ajudante se especializa **por curso pago em cada ponto**, e o curso já traz o equipamento. O **Joca** entra na **área industrial** e vira **barista** na Avenida (o cafezinho passa da Dani para ele); os **doces da Dani** começam na área industrial (caseiros, na mesa e na marmita) e ficam gourmet na Avenida; o **Anselmo**, coqueteleiro que saiu do restaurante do Bráulio, entra na Avenida (sessão 3b-5), e a 4a fica com os upgrades dele. O que é do Terraço está na 4a ("Equipe do Terraço").
> **Revista de novo em 31/10, à noite** (pedido do usuário, em `docs/PROPOSTAS.md`): a Dani começa os doces no meio da área industrial e, com o curso feito, indica o Joca (do colégio dela) para o posto; o Joca entra no nível 2 da Dani e sobe até o 4; na Avenida ele vira barista e passa o bastão para a Cami, que sobe com cursos e chega ao modo "Minhas mesas"; o Anselmo segue na Avenida. A seção "A equipe ponto a ponto" abaixo vale no lugar do que dizia o contrário acima.
> Ordem: 3b-1 (o ponto e os capítulos) → 3b-1r (realinhamento) → 3b-2 (Dani confeiteira e Joca, área industrial) → 3b-3 (vitrine, Joca barista e Cami, Avenida) → 3b-4 (o fiscal) → 3b-5 (o Anselmo) → 3b-6 (a Cami em "Minhas mesas"). Cada uma é uma versão, com PR e merge.

### A equipe ponto a ponto (pedido do usuário de 31/10, à noite; vale para a 3b-2, a 3b-3 e a 3b-6)
- **Quem faz o básico:** as tarefas básicas (lixo, pratos sujos, louça, água/suco da espera, marmitas) ficam sempre com **o ajudante mais novo que veio no dia**, nesta ordem: Cami, Joca, Dani. Quem passou o bastão fica só com a especialidade: a **Dani** com os doces (e o cafezinho, até o Joca aprender o espresso); o **Joca**, depois do espresso, com os cafés. Se o mais novo faltou no dia (folha), o básico volta para o anterior naquele dia. Função `donoBasico(g)` em `15-dani.js`; o cartão de quem passou o bastão mostra só a especialidade, com o texto "As tarefas da casa ficaram com o Joca." (ou "com a Cami.").
- **Folha** (`FOLHA_CORTE`, a ordem final depois da 3b-5): couvert, som, TV, TVs, **o Anselmo não vem**, **a Cami não vem**, **aumento do Joca**, aumento da Dani, aumento do Tonhão, **o Joca não vem**. "Não vem" marca `eq.<quem>Fora = true` só naquele dia: `payroll` não conta, o ajudante não entra no dia, `normEquipe` não guarda o `...Fora` (continua contratado). Cada sessão põe a sua parte nessa ordem.
- **Cursos:** um por dia por ajudante (`daniCursoDia`, `jocaCursoDia`, `camiCursoDia`). Os que trazem item (confeitarias, espresso) ficam no **cartão Cardápio**, com o rosto de quem faz, ao lado dos do Tonhão, e contam na Diversidade do Gurugol (`avalMenu`); os de atendimento ficam no cartão do ajudante, em Equipe. Só aparecem no ponto do `nivel` deles (no modo dev, sempre).

## Etapa 3d — Retornos do Renan de 01/11 (3d-1, v9.6.4; 3d-2, v9.6.5; 3d-3, v9.6.6)
> **Planejada com o usuário em 01/11** (entrevista; o texto do Renan e a tabela das decisões estão em `docs/PROPOSTAS.md`). Pedido do usuário: tudo antes da 4a. Três sessões, cada uma uma versão, com PR e merge; a ordem é 3d-1 → 3d-2 → 3d-3. Depois vem a 3e (revisão da interface) e só então se planeja a 4a.
> **Balanceamento (vale para as 3):** os alvos de sempre (sem equipe, ~40–70% das metas nos dias 3 a 7; `EQUIPE=auto`, ~85–95%; nos pontos, os da seção "Checagens de fim de sessão" da etapa 3). As mudanças deixam o jogo mais fácil; o usuário quer **manter os alvos** (mais justo, não mais fácil). Se passar da faixa: na Garagem, suba as `meta` e `expert` de `DAYS` dos dias 3 a 7 em passos de 10% (arredondando para 5); nos pontos, suba o `metaF` em passos de 0,2 (e o `expertF` na mesma proporção). Se ficar abaixo, desça do mesmo jeito. Os números medidos (antes e depois) vão no `docs/spec-vN.md`.

### Sessão 3d-2 — As marmitas e o prato mais antigo (v9.6.5)
**Partes:** `10-constantes.js`, `13-cozinha.js`, `14-bia.js`, `15-dani.js`, `16-jogo.js`, `21-cenario.js`, `17-treino.js`/`24-treino.js` (se usarem a janela), bot dos testes (`tests/`).
1. **Fileira própria das marmitas na janela de PRONTOS** ("a UI não se expande com o gameplay"):
   - Campo novo `marmJanela` em `PONTOS`: Garagem 2, área industrial 3, Avenida 3. Array novo `kitchen.marmJ` (tamanho `marmJanela`, `null` nas vagas livres), separado de `kitchen.plates`; `PLATE_SLOTS` fica só para os pratos.
   - Lugar: a faixa de cima da janela, entre o rótulo PRONTOS e a fileira dos pratos: `MARMJ_SLOTS` com y = 242, x = 800, 826 e 852 (vão de 26 px), marmita em escala 0,7 com o selo da Efood. O "×4" dos pratos limpos continua onde está (884–906, 228). Conferir em recorte ampliado que nada se sobrepõe nos 3 pontos (4, 5 e 6 vagas de prato); se encostar, baixe a escala para 0,62, sem mexer na fileira dos pratos.
   - `marmitaPronta` põe a marmita numa vaga livre de `marmJ`; sem vaga, ela espera pronta no fogão (como hoje sem vaga de prato).
   - Trocar todos os usos de marmita em `kitchen.plates` por `kitchen.marmJ`: `Game.marmitas()` (onde 'pronta'), `esfriar`, `Helper.marmitaAlvo`, o desenho da janela, o `perform` da Bia (`type:'plate'`), o bot e os smokes (`grep -n "kind === 'marmita'" src tests`).
2. **As mesas na frente no fogão** (`Kitchen.update`): em vez de pegar `queue.shift()`, o próximo pedido é o 1º ticket de prato da fila; um ticket de marmita só entra se `(marmitas no fogão) + (marmitas em marmJ) < marmJanela`. Se só houver marmitas na fila e o limite estiver cheio, a boca fica livre.
3. **Entregadores espaçados** (`buildSchedule`, depois do `sort`): dois entregadores comuns (não a encomenda) chegam com pelo menos `MARMITA.gap = 12` s de diferença; o que chegaria antes vira `tipoPequeno()` (da 3d-1).
4. **A marmita do entregador que desistiu** (`soltaMarmitas`, chamado em `leaveCommon`):
   - No fogão (fila ou cozinhando): sai, sem custo. Na fileira `marmJ` e na prateleira da retirada: some e vai para o lixo (`addTrash(1)`, texto "Pro lixo!", stat nova `stats.jogadas`).
   - Na mão da Dani, do Joca ou da Cami: some na hora e vai para o lixo (+1).
   - Na mão da Bia: fica, sem dono, com um **X vermelho** no selo (`drawMarmitaSelo`). Um entregador novo do mesmo prato ainda pode ficar com ela (`marmitaPara` já procura 'mao'). Um toque na lixeira com ela na mão joga fora (+1 lixo, "Pro lixo!", sem esvaziar a lixeira nessa ação); se esfriar antes (`MARMITA.validade`), sai como hoje.
   - O fim do dia (`42-resultados.js`, linha Marmitas) soma "· N jogada(s) fora" quando houver.
5. **Pegar o prato mais antigo** (`tapStation`, `k === 'plates'`): qualquer toque na faixa de baixo da janela (a dos pratos) pega o prato pronto há mais tempo (`maior p.age`) entre os que não são da Cami e ainda não estão na fila de ações da Bia. Tocar de novo pega o seguinte. Só se todos forem da Cami: "É da Cami!". Toque na faixa de cima (y < 256), a das marmitas: a marmita mais antiga da `marmJ` (a de entregador esperando no balcão primeiro). Sem marmita, vale o prato. O ajudante que leva pratos (Cami em "Minhas mesas") também pega o mais antigo dos dele.
**Testes:** `smoke51.js`: (a) marmita pronta vai para `marmJ`, nunca para `plates`; (b) com `marmJ` cheia e pedidos de mesa na fila, o fogão faz os pratos; (c) agenda sem 2 entregadores a menos de 12 s; (d) entregador vai embora: a marmita dele some do fogão, da janela e da prateleira; na mão da Bia ganha o X e sai com um toque na lixeira (+1 lixo); (e) com 3 pratos prontos em ordem, 3 toques em qualquer ponto da janela pegam os 3 do mais antigo ao mais novo. Capturas da janela nos 3 pontos com pratos e marmitas cheios (recorte ampliado). `balance.js` com `PONTO=industrial` (o pico do apito) e regra do balanceamento; `DBGF=1` para ver marmitas entregues e entregadores perdidos antes e depois.
**Modelo:** Sonnet, esforço alto (cozinha, ajudantes, bot e desenho ao mesmo tempo; balanceamento na área industrial).

### Sessão 3d-3 — A pia, o lixo, a lavagem e os doces (v9.6.6)
**Partes:** `14-bia.js`, `16-jogo.js`, `21-cenario.js`, `22-salao-hud.js`, `10-constantes.js`.
1. **Lavar prato a prato** (`Waitress.update`, ação `sink` com `a.wash > 0`): cada pilha volta limpa assim que termina (`g.washPiles(1)` a cada `WASH.perPile` s depois do `WASH.base`, texto "+1 prato" em `PAL.faixa` 13 e `Sfx.wash()`). Se, ao fim de uma pilha, a Bia tiver outra ação na fila (`this.acts.length > 1`), ela para ali e segue; o resto fica na pia. No fim, "Lavou N pilhas!" como hoje (N as que lavou nessa ação). O `washing` continua valendo enquanto ela lava (só 1 pessoa lava por vez). Os ajudantes e o Tonhão já lavam 1 por vez: não mudam.
2. **A pia mais suja com a louça** (desenho da pia em `drawKitchen`): com `f = min(1, sinkN / 6)`, a água vai de `#8EC5E8` a `#9A9468` (`mixCor`); com louça na pia, até 3 pratos sujos tortos dentro da cuba, com 2 manchas de molho cada (`#B5651D` e `#7A4A2A`); os pratos do carrinho ganham as mesmas manchas; com 4 pilhas ou mais, 2 moscas voando sobre a pia (pontinhos pretos com asinhas, em órbita de ~10 px; paradas com movimento reduzido). Sem louça, a pia fica como hoje.
3. **O lixo mais fedido** (`drawTrash`, `drawFumacaVerde`): fumaça a partir de `TRASH.cap - 2` (1 nuvem pequena); cheio, 3 nuvens maiores (raio 4 + 6·f, sobem 34 px), 2 linhas de cheiro onduladas (`rgba(110,150,60,.6)`) e 2 moscas (as mesmas da pia). Com movimento reduzido, tudo parado.
4. **Sai o lembrete da louça:** o balão "Não se esqueça de lavar os pratos!" do `Game.begin` deixa de existir (carreira e Turno sem fim). O "×4" da janela fica como está.
5. **A geladeirinha de doces** (`STATIONS.doces`, `drawGeladeiraDoces`):
   - Maior: `rect:{ x:690, y:200, w:52, h:60 }` (o `ap` continua em 744,226), com o desenho reescalado para o tamanho novo, na caseira e na vitrine gourmet.
   - Sempre: plaquinha rosa (`#D9577A`, letras brancas, `FD` 8) **"DOCES"** em cima. Na gourmet, a faixa GOURMET continua, abaixo da placa.
   - Selo **"NOVO!"** (mostarda, pulsando; parado com movimento reduzido) até 5 doces entregues na carreira: `sv.docesTot` somado no `finishDay` com `stats.doces` (no `normSave`); no modo dev, nunca.
   - O balão do pedido de doce na mesa (`drawTableOverlay`, `grp.doceBalao`) fica 1,4× maior que hoje, com o ícone do doce em escala 1,0 (hoje 0,72); conferir que não encobre os outros balões (o deslocamento de 34 px dos balões de baixo cresce junto).
**Testes:** `smoke52.js`: (a) 4 pilhas na pia, a Bia lavando: 1 prato limpo a cada 2,5 s; com outra ação na fila, ela para depois da 1ª pilha e sobram 3; (b) sem o balão do lembrete na abertura do dia 3; (c) `STATIONS.doces` com o tamanho novo e o toque nela pega doce; (d) `docesTot` soma no fim do dia. Capturas (recorte ampliado): pia com 0, 2 e 6 pilhas; lixo com 4 e 6; geladeirinha caseira e gourmet com placa e selo; balão de doce numa mesa com suco e café; tudo com `prefers-reduced-motion`. `balance.js` (a lavagem um a um muda o ritmo da Bia do bot) com a regra do balanceamento.
**Modelo:** Sonnet, esforço médio (desenho e lógica localizados, com plano detalhado).

## Etapa 3f — O Manual e menos texto explicativo (3f-1, v9.6.7; 3f-2, v9.6.8)
> **Planejada com o usuário em 01/11** (pedido e decisões em `docs/PROPOSTAS.md`, "menos texto explicativo e um Manual"). Ordem: 3d-2 → 3d-3 → **3f-1 → 3f-2** → 3e → 4a. A ideia: o jogo é para sentir, não para calcular. A explicação sai da tela e vai para um **Manual** no estilo de bestiário, que se revela com a história (sem spoiler). O tutorial (Missão zero) e as falas do Modo História continuam apresentando as coisas; os textos deles não mudam.
> **Regra das duas sessões:** no Manual não aparece número nenhum (nem %, nem segundos, nem preço): só palavras e bolinhas. Na tela de jogo e na lojinha ficam só os valores em R$ (preço, diária, meta, multa, parcela) e as contagens que o jogador usa na hora (ex.: "Você tem 2").

### Sessão 3f-1 — O Manual (v9.6.7)
**Partes:** `10-constantes.js` (dados `MANUAL` e `manualTracos`), `11-base.js` (`semente`), `02-telas.html` e `01-estilo.css` (tela `#ov-manual`), `40-interface.js` (`buildManual` no lugar do `buildTips`; o Como jogar deixa de existir), `12-clientes.js` (`normSave`), `16-jogo.js` (revelação), `41-lojinha.js` (botão e registro dos cartões), `42-resultados.js` (linha "Novo no Manual"), `43-telas.js` (botões, troca de telas, `__lcc`).

1. **A tela `#ov-manual`** (no lugar do `#ov-how`, também na lista `SCREENS`):
   - Título **"Manual"**; abas em chips: **Básico, Clientes, Equipe, Lojinha, Lugares, Imprevistos**. Aba com ficha nova tem a bolinha `novo` (a mesma dos cartões da lojinha).
   - Cada ficha é um cartão como o `.item` da lojinha: desenho num canvas de 64×64 (com o `tipCanvas` do Como jogar), o **nome** em negrito, os **traços** em chips pequenos (fundo `PAL.cromo`, texto `PAL.tinta`) e **uma linha** de texto (a do item 3). Grade de 2 colunas em tela cheia e 1 coluna abaixo de 560 px de largura; o painel rola por dentro (`overflow-y:auto`), a página não.
   - **Ficha trancada:** o mesmo cartão com o desenho em silhueta (pinte o canvas da ficha e cubra com `source-atop` em `#3A3630`), o nome **"???"** e, no lugar da linha, **"Aparece mais adiante na história."**. Sem traços.
   - Botão **"Voltar"** embaixo: volta para a tela de onde veio (menu, pausa ou lojinha, na mesma seção).
   - Abrir uma ficha nova (rolar até ela, ou abrir a aba dela) a tira de `manualNovo`.
2. **Onde se abre:**
   - **Menu:** o botão "Como jogar" vira **"Manual"** (mesmo lugar, `id="btn-manual"`); o `menu_fit.py` tem de continuar passando.
   - **Pausa:** botão **"Manual"** (`btn alt`) depois do "Reiniciar"; o jogo continua pausado.
   - **Lojinha:** botão redondo **"?"** no topo do painel, ao lado do título (abre a aba Básico), e o "?" de cada cartão (é da 3f-2; a 3f-1 já deixa pronta a função `abrirManual(fichaId, volta)`, que abre a aba da ficha, rola até ela e a destaca com a classe `foco` por 1,5 s).
   - Os 3 botões levam a classe `novo` enquanto `save.manualNovo` não estiver vazio.
3. **As fichas** (`MANUAL` em `10-constantes.js`: lista de `{ id, aba, nome, linha, tracos?, desenho }`; ids com prefixo da aba: `b-`, `c-`, `e-`, `l-`, `p-`, `i-`). Os textos são estes, sem trocar palavras:
   - **Básico** (os desenhos são os das dicas do Como jogar):
     - `b-sentar` **Sentar a freguesia**: "Arraste o grupo da calçada até uma mesa livre. Grupo de 3 ou 4 só cabe em mesa de quatro." (sempre aberta)
     - `b-mesa` **O ciclo da mesa**: "Anote o pedido, leve à cozinha, entregue o prato, cobre e recolha a louça." (sempre)
     - `b-coracoes` **Corações**: "São a paciência do grupo. Atender devolve um coração; mais corações, mais gorjeta." (sempre)
     - `b-cores` **Cores e corrente**: "Camisa da mesma cor da cadeira dá pontos a mais. Repetir a mesma ação forma uma corrente." (sempre)
     - `b-meta` **A meta do dia**: "A meta é o lucro: o que a freguesia paga, menos ingredientes, contas e folha. Três estrelas: a meta mais alta, sem perder ninguém." (sempre)
     - `b-lojinha` **A lojinha**: "Abre aos poucos: quando a freguesia reclama, a Bia descobre o que comprar." (sempre)
     - `b-historia` **Capítulos e banco**: "A história anda por capítulos, sem prazo. A reforma da garagem se paga ao banco, em parcelas." (sempre)
     - `b-louca` **Louça e lixo**: "Sem prato limpo, o Tonhão espera. Lixeira cheia espanta a freguesia." (abre ao começar o dia 3)
     - `b-suco` **Suco e cafezinho**: "Quem pede suco só pede a conta depois dele. O cafezinho acalma a mesa." (dia 3)
     - `b-marmita` **Marmitas**: "O pedido do entregador vai sozinho à cozinha. Leve a marmita pronta ao balcão de retirada." (quando a Efood abre: `efoodAberto`)
     - `b-gurugol` **Gurugol**: "Cada grupo que sai dá a sua nota. Nota alta traz mais gente; nota baixa afasta." (quando o 1º comentário entra no Gurugol)
   - **Clientes** (desenho: `makePeople(tipo, tamanho mínimo)` com o `drawPerson`, como nas dicas, com o `Math.random` trocado por `semente(n)` durante o desenho para o retrato ser sempre o mesmo; o VIP com `shades` e o `drawVipBadge`; o vegetariano com um prato `pfVeg` ao lado). Linha de cada um:
     - `c-estudante` **Estudante**: "Mochila nas costas e dinheiro contado."
     - `c-vovos` **Vovô e vovó**: "Sem pressa nenhuma: escolhem com calma e comem devagar."
     - `c-familia` **Família**: "Precisa de mesa de quatro e de paciência com as crianças."
     - `c-executiva` **Executiva**: "Sempre com pressa, mas deixa boa gorjeta."
     - `c-entregador` **Entregador**: "Não senta: espera a marmita no balcão de retirada."
     - `c-vip` **Cliente VIP**: "Óculos escuros e plaquinha dourada. Pode ser qualquer cliente, menos o entregador."
     - `c-veg` **Vegetariano**: "Pode ser qualquer cliente. Só pede prato sem carne."
     - `c-turma` **Turma da fábrica**: "Chega em bando quando o apito toca."
     - `c-motorista` **Motorista de caminhão**: "Come com calma e fecha com um cafezinho."
     - `c-encomenda` **Encomenda do setor**: "Busca várias marmitas de uma vez, no balcão de retirada."
     - `c-negocios` **Almoço de negócios**: "Colegas de trabalho: mesa de quatro e conversa longa."
     - **Traços** (`manualTracos(tipo)`, calculados de `CUSTOMER_TYPES`, para seguirem o balanceamento sozinhos; um chip por traço, nesta ordem):
       - Paciência (`pat`): até 0,55 "muito curta"; até 0,75 "curta"; até 1,2 "média"; até 1,6 "longa"; acima "muito longa".
       - Escolha (média de `read`): até 3,5 "rápida"; até 4,5 "normal"; acima "demorada".
       - Refeição (média de `eat`): até 5 "rápida"; até 7 "normal"; acima "demorada". O entregador e a encomenda não têm (levam marmita).
       - Grupo (`size`): [1,1] "sozinho"; [1,2] "sozinho ou em dupla"; [2,2] "em dupla"; [3,4] "de 3 ou 4".
       - Gorjeta (`tip`): a partir de 0,15 "ótima"; a partir de 0,1 "boa"; 0, sem chip.
       - Extras: `retira` "leva marmita"; `pedeCafe` "pede cafezinho no fim"; `mais` a partir de 0,3 "costuma pedir mais um".
       - Prefere: as 2 categorias de maior peso em `GOSTOS[tipo]` (no entregador, a soma das 3 listas), com os nomes `pf` "PF", `frito` "fritos", `assado` "assados", `chapa` "lanches na chapa", `pastel` "pastel".
       - Onde: os pontos já revelados (só os de fichas `p-` abertas) em que o tipo vem (Garagem: está em algum `DAYS[].types`; os outros: peso > 0 em `PONTOS[].tipos`).
       - O VIP tem os chips fixos: "paciência menor", "fura a fila", "pede o prato especial", "gorjeta boa", "prato frio tira coração". O vegetariano: "só prato sem carne", "sem opção, reclama no Gurugol".
   - **Equipe** (desenho: os retratos da lojinha, `upgradeIcon(id)`). Chips em **bolinhas** do nível atual (●●○○○, tantas quanto os níveis do funcionário, do 1º nível que ele tem ao último): "Nível", e as qualidades abaixo (bolinhas = posição do valor atual entre os valores diferentes dessa qualidade nos níveis dele; 0 ou ausente, sem chip):
     - `e-bia` **Bia**: "A garçonete. Anota, leva, entrega, cobra e recolhe." Chips: "duas mãos", "com a bandeja, leva mais" (só com a bandeja comprada).
     - `e-tonhao` **Tonhão**: "O chef. Aprende pratos nos cursos e, com aumento, ajuda na pia." Bolinhas: Nível, Rapidez (`cook`), Capricho (`crit`), Pia (`wash`; menor é melhor).
     - `e-dani` **Dani**: "Cuida da louça, do lixo e das mesas sujas; depois, dos doces." Bolinhas: Nível, Rapidez (`speed`), Tarefas (`tasks`).
     - `e-joca` **Joca**: "O básico da casa; depois, o café espresso." Bolinhas: Nível, Rapidez, Tarefas.
     - `e-cami` **Cami**: "Garçonete de rodízio: chega rápida e, com curso, cuida das mesas dela." Bolinhas: Nível, Rapidez, Tarefas.
     - `e-anselmo` **Anselmo**: "Coqueteleiro: só o balcão de drinks." Bolinhas: Nível, Rapidez.
   - **Lojinha** (desenho: `upgradeIcon` do item ou da seção). Uma ficha por item de Melhorias e uma por seção do resto:
     - `l-tenis` **Tênis novos**: "A Bia anda mais rápido." · `l-corrida` **Tênis de corrida**: "A Bia anda bem mais rápido."
     - `l-maquina` (o nome do ponto atual: Água da torneira, Jarra de suco ou Águas saborizadas): "Quem espera lá fora pede e espera com mais calma. Suco e água saborizada entram na conta."
     - `l-cafeteira` **Cafeteira de 2 bocas**: "O cafezinho acalma mais." · `l-bandeja` **Bandeja**: "A Bia leva mais coisas de uma vez." · `l-sudoku` **Livrinho de Sudoku**: "A Bia guarda mais tarefas na fila de ações." · `l-ventilador` **Ventilador de teto**: "A freguesia come mais rápido." · `l-triturador` **Triturador de lixo**: "A lixeira enche mais devagar." · `l-pratos` **Jogo de pratos**: "Mais pratos limpos na cozinha. Dá para comprar vários."
     - `l-tvsom` **TV e som**: "Distraem quem está nas mesas: a paciência dura mais. Gastam luz." · `l-tvs` **TVs com sertanejo**: "A paciência nas mesas dura mais; sem anúncios, mais ainda." · `l-assento` **Assento da espera**: "Quem espera sentado perde a paciência mais devagar." · `l-couvert` **Couvert artístico**: "Música ao vivo: a paciência nas mesas dura mais, e cada mesa paga o couvert." · `l-fogao` **Fogão industrial**: "Uma boca a mais: o Tonhão faz mais pratos ao mesmo tempo."
     - `l-cardapio` **Cardápio**: "Cursos do Tonhão e da equipe. Cada curso ensina pratos novos e dá experiência; o avançado deixa os pratos mais caros e caprichados." · `l-salao` **Salão**: "Compre, venda e arrume as mesas." · `l-decor` **Decoração**: "Enfeites que dão cara de casa e melhoram o ambiente no Gurugol." · `l-manut` **Manutenção**: "Revisão do fogão, da geladeira e da cafeteira, antes que quebrem." · `l-divulga` **Divulgação**: "Boca a boca: de graça, menos gente. Panfletos: o movimento normal. Redes sociais: mais gente e mais VIPs." · `l-banco` **Banco**: "Empréstimo para crescer. As parcelas saem do caixa no fim do dia; parcela atrasada é perigo." · `l-mudanca` **Mudança**: "Um ponto maior, com freguesia nova e aluguel." · `l-caixa` **Caixa**: "O que entrou e o que saiu, dia a dia."
   - **Lugares** (desenho: o ícone `mudanca` na área industrial, o `mudanca-av` na Avenida e, na Garagem, uma casinha simples feita na sessão):
     - `p-garagem` **Garagem da mãe da Bia**: "Onde tudo começou. Sem aluguel, freguesia do bairro."
     - `p-industrial` **Área industrial**: "Perto das fábricas: turma no apito, motoristas e encomendas de marmita."
     - `p-avenida` **Avenida Brasil**: "Restaurante de verdade: almoço de negócios, mais VIPs e a vigilância sanitária por perto."
   - **Imprevistos** (desenhos: a plaquinha da chave da dica da manutenção; nuvem; bandeirinha; termômetro; apito; prancheta):
     - `i-quebra` **Quebra**: "Equipamento gasto pode quebrar no meio do dia. A plaquinha da chave chama o técnico na hora, mais caro."
     - `i-chuva` **Dia de chuva**: "Vem menos gente e mais entregadores." · `i-feriado` **Feriado**: "A cidade sai de casa: mais gente e mais famílias." · `i-gripe` **Tonhão gripado**: "A cozinha anda mais devagar no dia." · `i-apito` **Apito da fábrica**: "A turma chega toda junta no meio do dia." · `i-fiscal` **Vigilância sanitária**: "Mesa suja e pia cheia dão multa; tudo limpo dá selo."
4. **A revelação** (só na carreira do Modo História; a Missão zero e o Turno sem fim não revelam nada; com o modo dev livre, `devLivre()`, tudo aberto e nada em "novo"):
   - Save: `manual` (lista de ids revelados) e `manualNovo` (os ainda não vistos), normalizados no `normSave` (só strings de ids que existem em `MANUAL`, sem repetidos). `Game.manualVer(id)` põe nas duas listas se for novo e grava o save.
   - Sempre abertas: as fichas `b-` marcadas "sempre", `e-bia`, `e-tonhao`, `p-garagem` (entram na lista ao começar a carreira, sem "novo").
   - **Clientes:** ao entrar o 1º grupo do tipo no dia (`Game.spawn`, onde o tipo é sorteado; a encomenda também); `c-vip` junto com o `vipVisto`; `c-veg` ao sentar a 1ª pessoa vegetariana. Na 1ª vez de cada tipo, um texto curto na porta, como o "VIP chegou!": **"Novo no Manual!"** (`PAL.faixa`, 14, junto à espera).
   - **Equipe:** `e-dani`, `e-joca`, `e-cami`, `e-anselmo` quando o cartão da pessoa está aberto (`cartaoAberto`).
   - **Lojinha:** cada ficha `l-` ao desenhar o cartão dela na lojinha (as de seção, ao desenhar o cartão da seção no grupo; as de Melhorias, ao desenhar o cartão do item). Assim ela só se revela onde a lojinha já mostra.
   - **Lugares:** `p-industrial` e `p-avenida` quando o ponto aparece na Mudança ou quando se está nele.
   - **Básico:** `b-louca` e `b-suco` ao começar o dia 3; `b-marmita` quando `efoodAberto`; `b-gurugol` no 1º comentário.
   - **Imprevistos:** `i-quebra` no 1º aviso de risco do `introManut` ou na 1ª quebra; `i-chuva` e `i-feriado` no aviso do clima; `i-gripe` no dia com `gripe`; `i-apito` no 1º aviso do apito; `i-fiscal` no aviso do fiscal.
   - **Save antigo** (sem `manual`): `Game.manualSemente()` preenche (sem "novo") com as sempre abertas; os tipos de `DAYS` até o dia anterior ao `proxDia` e os `tipos` dos pontos até o atual (com as fichas `p-` deles); `c-vip` se `vipVisto`; `c-veg` e `b-louca`/`b-suco` se `proxDia > 3`; `b-marmita` se `efoodAberto`; `b-gurugol` se houver comentário; as da equipe pelos cartões abertos. As `l-` se revelam sozinhas ao abrir a lojinha.
5. **Fim do dia** (`42-resultados.js`): se o dia revelou fichas, uma linha **"Novo no Manual: Executiva, Entregador."** (os nomes, em ordem de revelação; no máximo 3, depois "e mais N").
6. **`11-base.js`:** `semente(n)` devolve um gerador mulberry32 (para os retratos). Expor no `__lcc`: `MANUAL`, `manualTracos`, `manualAberta`, `abrirManual`, `buildManual`, `semente`.

**Testes:** `smoke53.js`: (a) carreira nova: Básico com as 7 fichas "sempre" abertas, o resto trancado com "???"; Clientes com `c-estudante` e `c-vovos` abertos depois do dia 1 e "Novo no Manual" no fim do dia; (b) `manualTracos('vovos')` dá paciência "muito longa", escolha "demorada", refeição "demorada", grupo "em dupla"; `manualTracos('executiva')`, paciência "curta" e gorjeta "boa"; (c) Turno sem fim não revela nada; (d) o 1º VIP abre `c-vip`; (e) save antigo no dia 10 da área industrial ganha a semente com `c-turma`, `p-industrial` e sem `p-avenida`; (f) `abrirManual('l-bandeja', 'shop')` abre a aba Lojinha com a ficha em foco, e Voltar volta à lojinha; (g) nenhuma ficha (aberta) tem algarismo no texto, na linha ou nos traços (`/\d/`). Ajuste os smokes que usam `btn-how`, `ov-how` ou `buildTips` (`grep -rn "btn-how\|ov-how\|buildTips" tests`). Capturas (recorte ampliado): as abas Clientes (com fichas abertas e trancadas) e Equipe em tela cheia e em 740×360. `menu_fit.py` passando. Sem mudança de jogo: o `balance` não precisa rodar.
**Modelo:** Sonnet, esforço alto (tela nova, a revelação ligada a vários pontos do jogo e os desenhos das fichas; todos os textos e regras já estão decididos).

### Sessão 3f-2 — Menos texto na tela (v9.6.8)
**Partes:** `10-constantes.js`, `41-lojinha.js`, `43-telas.js`, `16-jogo.js`, `01-estilo.css`.
1. **Lojinha, todos os cartões** (Melhorias, Cardápio e os cursos da equipe, Salão, Decoração, Manutenção, Divulgação, Equipe, Mudança, TVs, assento, TV e som, couvert):
   - Sai a descrição (o `span` de texto do `staffCard`, do `decorCard`, do `upgradeCartoes`, dos cursos e de cada cartão). Ficam o desenho, o nome, o preço ou a diária em R$, a situação curta que já existe ("Você tem 2", "Guardado", "Instalado", "Comprado", "já está num curso" vira **"Em curso"**) e os botões (com os avisos de folha, que são de ação).
   - Saem os campos `desc` de `UPGRADES` (e dos níveis de `maquina`), `DECOR` e `DIVULGA`, e os textos longos montados no `41-lojinha.js` (os da Dani, do Joca, da Cami, do Anselmo, das TVs, do couvert, das tarefas: `grep -n "'[^']\{40,\}'" src/41-lojinha.js` dá a lista; fica só o que for nome, R$ ou situação curta).
   - Cada cartão ganha um **"?"** no canto de cima à direita (botão redondo de 26 px, `aria-label="No Manual: <nome>"`) que chama `abrirManual(id da ficha, 'shop')`. Os cursos de cardápio usam `l-cardapio`; os cursos da equipe, a ficha da pessoa (`e-dani` etc.); os cartões de decoração, `l-decor`; os da Divulgação, `l-divulga`.
   - **Quadro "agora → próximo nível"** (`staffNext`): cada linha vira bolinhas, como no Manual (`●●○○○ → ●●●○○`, a qualidade com o nome dela: Rapidez, Capricho, Pia, Tarefas). A **Diária** continua em R$. Sai a linha "Prato caprichado ★ vale +1♥ e +N pontos".
   - **Experiência** (Tonhão, Dani, Joca): fica a barra, com o rótulo **"Experiência"** (sem "N de M"); quando estiver pronto, **"Pronto para o aumento!"**. Sai o "Faltam N de experiência: ...".
   - **Ficam como estão:** Banco (as tabelas de empréstimo; sai só a prosa), Caixa e Gurugol.
   - **Salão:** a instrução do editor vira uma linha só: **"Arraste as mesas. Toque numa mesa para mais opções."**
   - **Mudança:** ficam o nome do ponto, a mudança e o aluguel em R$; sai o resto (lugares, cardápio em %, o que fica e o que muda: está no Manual, em Lugares).
2. **Abertura do dia** (`43-telas.js`, `hooks.state` 'intro'):
   - `intro-goal`: **"Meta: R$ X · ★★ R$ Y · ★★★ R$ Z"** (sai "sem perder ninguém", o número de grupos, o tempo e "Custos do dia: ..."; os custos estão no Caixa).
   - Notas novas de `DAYS` (o resto da `SEMANA` já é curto e fica): dia 1 **"Arraste cada grupo até uma mesa livre."**; dia 2 **"Chegou a família! Ela só cabe em mesa de quatro."**; dia 3 **"Chegou a executiva! E abriu o balcão de sucos."**; dia 4 **"Chegou o entregador de moto!"**; dia 5 **"O movimento cresce."**; dia 7 **"Tonhão está gripado: a cozinha anda devagar."**. Sem a Efood aberta, o dia 4 diz **"Dia de movimento!"**. Sem nota, nada (sai o "Sente a freguesia, anote os pedidos...").
   - "Primeira vez? ..." vira **"Primeira vez? Faça a Missão zero, no menu."**
   - O dia largado no meio: **"Você largou o dia no meio: multa de R$ X."**
   - `introBanco`: negativo **"Caixa no negativo! Mais N dias assim e o banco cobre à força, com juros."** (sem dias sobrando: **"Caixa no negativo! Se fechar hoje assim, o banco cobre à força, com juros."**); atrasada **"Parcela atrasada! Feche o dia com R$ X no caixa, ou o banco toma a lanchonete."**; carência **"Reforma da garagem: a 1ª parcela vence no fim do dia N."**; parcela **"Parcela do banco hoje: R$ X."**
   - Turno sem fim: meta **"Todas as mesas abertas e freguesia cada vez mais rápida."**; nota **"Grupo bravo tira uma estrela. Sem estrelas, acabou."**
   - `introManut`, `introEncomenda` e os avisos do clima e do fiscal ficam como estão (já são curtos).
3. **No jogo:** o balão do 1º VIP vira **"Chegou cliente VIP!\nFura a fila e quer tudo quentinho."** (com o "Novo no Manual!" da 3f-1). A nota da pausa vira **"Se sair agora, o dia não conta."**, mais, com gente no salão, **" Quem está aqui vai embora bravo: multa de R$ X."**
4. **Não mudam:** as falas do Modo História (`HISTORIA`, `LIBERA`, as conversas), a Missão zero, os comentários do Gurugol, o fim do dia (só a linha da 3f-1) e os `title` dos botões.

**Testes:** `smoke54.js`: (a) nenhum cartão da lojinha (todas as seções abertas no modo dev) tem `span` de texto com mais de 40 caracteres, fora Banco, Caixa e Gurugol; (b) todo cartão tem o "?" e ele abre a ficha certa; (c) `staffNext` sem `%` e sem " s"; (d) a abertura do dia 3 sem "Custos do dia" e com a nota nova; (e) o balão do 1º VIP com o texto novo. Ajuste os smokes que conferem os textos antigos (`grep -rn "Custos do dia\|Fura a fila, tem pouca\|desc" tests`). Capturas (recorte ampliado): Melhorias, Tonhão e Divulgação, antes e depois; a abertura do dia 3. Sem mudança de jogo: o `balance` não precisa rodar.
**Modelo:** Sonnet, esforço médio (cortes localizados, textos todos decididos).

## Etapa 3e — Revisão da interface antes da 4a
**Objetivo:** responder ao "a UI não se expande de acordo com o gameplay" (Renan, 01/11) antes de pôr o Terraço na tela. Vem depois da 3f: revisa a interface já sem os textos longos. Sessão de levantamento e planejamento, sem versão nova.
- Capturas de cada ponto (Garagem, área industrial, Avenida) no pico do dia, com tudo comprado e a equipe toda, em tela cheia e no celular deitado (740×360).
- Lista do que está apertado, pequeno ou confuso: balcões e janelas (prontos, marmitas, retirada, doces, café, drinks), balões das mesas, HUD, fila de ações, mãos; para cada item, o que fazer.
- Mapa de onde cabe o que a 4a traz (foyer e coquetelaria lá fora, VIP exigente, prato da casa), e o que precisa sair ou encolher.
- O resultado vira sessões no plano (3e-1, 3e-2, se houver correções) e alimenta o planejamento da 4a.
**Modelo:** planejar com o Opus, esforço médio ou alto (é levantamento e decisão de design).

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. A confeitaria, o café, o atendimento e os drinks vêm da 3b (a Dani confeiteira, o Joca barista, a Cami e o Anselmo com o balcão de drinks); aqui o Anselmo leva **a coquetelaria lá fora** (o balcãozinho da espera), um sistema só com o balcão do salão.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Equipe do Terraço** (entrevista de 31/10; texto em `docs/PROPOSTAS.md`). Decidido; ao planejar, falta o que está em "Decidir":
  - **Cami** (desde a Avenida, 3b-3 e 3b-6): no Terraço, um curso abre o modo "Ajuda em tudo" (pega o que a Bia não pegou, em qualquer mesa). Decidir: nome, preço e velocidade do curso.
  - **Ajudante de cozinha do Tonhão:** **R$ 80/dia**, o Tonhão cozinha **25% mais rápido**. Decidir: nome, visual e história.
  - **Tonhão, alta gastronomia:** cursos próprios do Terraço depois do "Cozinha de restaurante" da Avenida (a ideia "Cozinheiros da Avenida Brasil e do Terraço Suíça": lá não se vende coxinha), que abrem os pratos finos e o prato da casa dos VIPs. Decidir: nomes, pratos, preços.
  - **Dani, curso "Alta confeitaria"** (R$ 600): entremet, mil-folhas e macaron a **R$ 30**.
  - **Joca, curso "Cafés especiais"** (R$ 600): coado no filtro, prensa francesa e cold brew a **R$ 20**, cada um com etapas (decidir quais e o tempo).
  - **Anselmo, 2 cursos** (R$ 500 e R$ 800): o 2º põe no nível 3 (`speed` 1,0, R$ 130/dia), drinks a **R$ 35** e a coquetelaria lá fora. Decidir: nomes dos cursos e dos drinks novos.
  - A 4a ficou grande: ao planejar, dividir em sessões (sugestão: o Terraço e os VIPs; a equipe do Terraço).
- **Reputação do ponto:** é a nota do Gurugol (etapa 2c, últimas 100 avaliações). No Terraço ela muda a freguesia do dia (mais VIPs com nota alta), e na etapa 6 vira a régua do Michelzão.
- Um item de lojinha do Terraço, por exemplo "Louça fina": prato especial mais rápido.
- **Ambiente:** couvert com quarteto de cordas ou pianista (20% cada; diárias a definir; o pianista traz a manutenção diária do piano).
- **Decoração da calçada:** flores muito belas e arranjos, como ikebana, arranjos de orquídeas e flores do campo em vasos de cerâmica.
- **Desenho do nível 4** (dos pedidos de 21 e 22/10, hoje no `PLANO-FEITO.md`, "Ideias já entregues"): poltronas, tapete e balcãozinho de drinks na espera; piano de cauda e quarteto no salão; o pianista também soma ao nível de luxo (4b). `prefers-reduced-motion` e nomes de músicas inventados.
- **Capítulo do Terraço** na história, que prepara o final (etapa 6).
- **Manual (da 3f):** o VIP exigente, a equipe nova, os itens novos da lojinha e o Terraço entram como fichas no `MANUAL` (com a mesma regra de revelação), e os cartões novos da lojinha saem só com nome, preço e "?".

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `21-cenario.js` (Terraço, foyer, piano), `22-salao-hud.js` (balão do pedido especial).

**Testes:** smoke novo (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` no Terraço Suíça com equipe completa.
**Metas do Terraço (da 3b-7, v9.6.1):** o ponto leva `metaF` e `expertF` próprios, calibrados como na 3b-7 (`DUMP=1` com 80 dias: `metaF` para `EQUIPE=auto` passar ~90%, `expertF` para a 3★ do bot afiado ficar em ~60%; referências: área industrial 2,3 e 1,6, Avenida 3,2 e 3,8). Na 3b-7 a equipe toda na Avenida passa 100% das metas: decidir no planejamento se o Terraço mede pela equipe toda. O ganho da área industrial sobre a Garagem ficou em ~R$ 310 por dia (a v9 mirava ~R$ 140) e o caixa do dia 50 da carreira em ~R$ 17 mil: considerar no preço da mudança do Terraço.

**Calibração:**
- O Terraço dá mais lucro só com equipe completa + Tonhão nível 3 + salão bem montado.
- Para quem não está pronto, é um passo arriscado: lucro abaixo da Avenida Brasil.

**Decisões em aberto:**
- O cardápio do Terraço: a sugestão de ×2,2 era de antes da v9.1, que pôs a Avenida em ×2 (a escada está em 1 / 1,5 / 2); subir para ×2,6 a ×3?
- A avaliação ruim do VIP exigente pesa mais na nota do Gurugol do que a de um cliente comum?
- O que o exigente usa para se distinguir visualmente.
- As diárias do quarteto e do pianista e a manutenção do piano.

**Modelo:** planejar com o Opus antes (as 3 decisões em aberto, o que falta da equipe do Terraço, regras do prato da casa e da reputação, falas do capítulo, divisão em sessões); executar com o Sonnet, esforço alto (cliente novo com regras próprias e o desenho do Terraço).

### Sessão 4b — Nível de luxo (v10.1)
**Objetivo:** o nível de luxo de 0 a 5 (pedido do usuário em 21/10; texto em `docs/PROPOSTAS.md`), que soma o que o jogador montou em todos os pontos.

**Entra:**
- **Nível de luxo** (0 a 5), a soma de atributos: decoração da espera e do salão, móveis (as mesas de plástico de bar da Garagem são o degrau mais baixo), o ponto, o ambiente (TV, som, couvert, quarteto, pianista, que soma mais), o impacto da divulgação e a avaliação de críticos surpresa.
- A progressão é por atributos, como subir de nível um personagem (referência do usuário: os atributos do Kratos em God of War Ragnarök, só nos docs; na interface, sem citar o jogo): cada atributo tem a sua barra, e o nível sobe quando elas sobem.
- Onde aparece: uma aba ou um quadro na lojinha, com as barras (pode reaproveitar o estilo da caixa do Gurugol da v8.4.1).
- Efeito no jogo (a decidir): mais VIPs, mais gorjeta, nota de ambiente do Gurugol, régua do Michelzão (etapa 6).
- TV, som e couvert podem sair da aba Equipe e ir para o lugar do ambiente (anotado na v7.4.4).
- **Enfeites e móveis melhores** à venda, para subir o luxo (decidir quais). Os da Garagem já existem desde a v8.6.5 (`DECOR` e a toalha xadrez), só visuais.

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
- **A Cami vira gerente de salão** no capítulo final (entrevista de 31/10): sobe de cargo e organiza a fila e as mesas sozinha; decidir o efeito no planejamento.
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
- **Estufa para as marmitas** (retorno de 01/11): guarda as marmitas adiantadas por mais tempo (hoje esfriam em `MARMITA.validade`, 60 s) e, com ela, o "+ marmita" volta (`MARMITA.adiantar`, desligado na 3c). Pode vir junto da prateleira de 4 (ideia da v8.6). Decidir preço, ponto em que aparece e quanto dura a marmita.
- **Conta rachada** (pensada com o usuário em 30/10; ficou fora da 3b em 31/10, continua guardada): um jeito de pagar que pode cair em qualquer grupo de colegas (turma, executivas): cada um paga a sua parte, e a Bia leva 2 ou 3 maquininhas em vez de uma conta só. Mais trabalho, mas cada pessoa deixa um pouco de gorjeta. Decidir: a chance, quantas maquininhas, o tempo de cada uma e a gorjeta por pessoa.
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
