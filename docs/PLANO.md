# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário. **A 3b-1 (v9.1) foi feita em 31/10.** **Revisão de 31/10** (o plano da equipe e a v9.1 foram feitos ao mesmo tempo): entra a **3b-1r** (v9.1.1, realinhamento) antes da 3b-2; a 3b-1r (v9.1.1) e a 3b-2 (v9.2) foram feitas em 31/10; a 3b-2d (v9.2.1, modo dev com painel) também foi feita em 31/10; a 3b-3 (v9.3) também foi feita em 31/10; a 3b-4 (v9.4) também foi feita em 31/10; **a próxima é a 3b-5**.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 3b-2d | Painel do modo dev: qualquer dia, ponto, nota, equipe e cursos; lojinha de verdade; acelerar e encerrar o dia | v9.2.1 | feita em 31/10 (`docs/spec-v9.2.1.md`) |
| 3b-3 | A Avenida: a vitrine da Dani, o Joca barista e a Cami | v9.3 | feita em 31/10 (`docs/spec-v9.3.md`; a máquina de espresso ficou no chão ao lado da bancada do café; `smoke45`, não 44; a Cami só chega ao nível 2 até a 3b-6) |
| 3b-4 | Fiscal da vigilância sanitária | v9.4 | feita em 31/10 (`docs/spec-v9.4.md`; nova parte `15-fiscal.js`; `smoke46`; a mesa suja ficou em 8 s: o bot passou em 6 de 6 visitas) |
| 3b-5 | O Anselmo e os drinks da Avenida | v9.5 | a fazer |
| 3b-6 | A Cami em "Minhas mesas" | v9.6 | a fazer |
| 3b-7 | Rebalanceamento da escada completa (Garagem, área industrial e Avenida), antes do Terraço | v9.6.1 | a fazer; depois da 3b-6 |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1 a v9.6)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).
- As sessões 3a (feita em 30/10, v9), 3b-1 (31/10, v9.1), 3b-1r (v9.1.1), 3b-2 (31/10, v9.2) e 3b-3 (31/10, v9.3) e 3b-4 (31/10, v9.4) estão no `docs/PLANO-FEITO.md`.

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

### Sessão 3b-5 — O Anselmo e os drinks da Avenida (v9.5)
**O Anselmo** (coqueteleiro): era o coqueteleiro do restaurante do Bráulio, saiu porque lá era muito difícil trabalhar e achou a casa nova depois de conversar com o Tonhão. Entra **só na Avenida** (`ponto.nivel >= 3`; no modo dev, em qualquer ponto), **já com habilidade**: não passa por aprendiz e não faz as tarefas da lista; fica no balcão de drinks.
- `STAFF.anselmo = { levels:[ null, null, { speed:0.8, pay:90, xp:0 }, { speed:1.0, pay:130, xp:0 } ] }`: contratar já põe no **nível 2** (R$ 90/dia). O nível 3 vem dos cursos do Terraço (4a); na Avenida ele não sobe pelo trabalho. Save: `equipe.anselmo` (0, 2 ou 3). `FOLHA_CORTE`: o **Anselmo não vem** (`anselmo`: `eq.anselmoFora = true` só naquele dia, como o `jocaFora`) logo depois das TVs e antes da Cami (a ordem em "A equipe ponto a ponto"); `normEquipe` e `payroll` contam ele.
- **Balcão de drinks** (vem com a contratação): estação `STATIONS.drinks` na parede do fundo, à esquerda da vitrine da Dani: `rect:{ x:620, y:92, w:60, h:50 }`, `ap:{ x:700, y:150 }` (no corredor à direita das mesas, fora da `area` do ponto, que vai até x 684: um `ap` em x 650 ficaria em cima das cadeiras da 1ª fileira; na `STATION_KEYS`, com `estacaoOn('drinks')` só com o Anselmo), com **2 vagas** de copo pronto. O Anselmo fica atrás dele (`ANSELMO_HOME = { x:650, y:118 }`), com o desenho de chacoalhar a coqueteleira enquanto prepara (parado com `prefers-reduced-motion`). Não é um `Helper`: é uma fila de preparo em `16-jogo.js`, um drink por vez, **4 s / `speed`** cada (`DRINKS.prep`).
- **Quem pede** (`DRINKS.pede`), **ao sentar**, junto com o pedido: `{ executiva:0.35, negocios:0.5, familia:0.15, vovos:0.15, estudante:0.25 }`, VIP +0,2, nunca o entregador; `randi(1, size)` drinks, cada um sorteado entre os 3. Sem o Anselmo, ninguém pede. O pedido vai para a fila dele quando a Bia anota; o copo pronto fica no balcão, a Bia pega (toque, 2 por mão com a bandeja) e leva. O grupo come normalmente, mas só pede a conta depois de receber os drinks (como o suco da mesa); drink não entregue sai da conta e o grupo perde paciência como no suco pendente.
- **Os drinks** (`DRINKS.itens`; nomes inventados, sem dizer se têm álcool): **"Pôr do Sol da Avenida"** (laranja e vermelho, em degradê), **"Brisa de Maracujá"** (amarelo, com hortelã) e **"Esmeralda"** (verde, com rodela de limão). **R$ 22** cada (ingrediente R$ 6), +5 pontos (`PONTOS_ACAO.drink`), devolve 1 coração e +0,25 no Ambiente de quem tomou (`AVAL.amb.drink`).
- **Visual** (sem estereótipo, com crachá): homem de uns 45 anos, pele negra retinta, cabeça raspada e barba grisalha curta, camisa branca de manga dobrada com colete preto, gravata-borboleta bordô e crachá "ANSELMO".
- **Lojinha (Equipe):** cartão do Anselmo ao lado da Cami: nível, salário, "Drinks no balcão" e, no lugar dos cursos, "Cursos no Terraço Suíça". No Modo História abre pelo `LIBERA` (abaixo); fora dele, aberto na Avenida.
- **Conversa** (`LIBERA`, `id:'anselmo'`, `nivel:3`, `dia:3`, `ate:6`); gatilho: Ambiente ≤ 3,5 em 3 avaliações do dia (`tres(4, 3.5)`, como o da Decoração, que usa 2,5); reclamações: "Não tem nem um drinkzinho aqui?", "No restaurante da frente tem drink." Falas: Tonhão "Bia, lembra do Anselmo, o dos drinks do Bráulio? Encontrei ele na feira." / Anselmo "Seu Tonhão me contou da casa nova. Lá no Bráulio não dava mais: era grito o dia inteiro." / Bia "Aqui ninguém grita. Só a chapa, de vez em quando." / Anselmo "Me dá um balcão e eu faço o drink mais bonito da Avenida." / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.anselmo = 'Anselmo'`, `convCabeca` com ele e cor do nome própria (bordô `#8E3B46`).
- Gurugol: comentário bom "O drink do balcão é uma obra de arte!"; ruim (esperou o drink e perdeu coração) "Pedi um drink e ele nunca veio."

**Partes:** `10-constantes.js` (`STAFF.anselmo`, `DRINKS`, `STATIONS.drinks`, `PONTOS_ACAO`, `AVAL`, `LIBERA`, `HIST_NOMES`), `12-clientes.js` (pedido ao sentar), `16-jogo.js` (fila de preparo, folha), `19-conversa.js`, `20-desenho-base.js` (Anselmo, os 3 drinks), `21-cenario.js` (balcão), `22-salao-hud.js` (balão do drink), `41-lojinha.js` (cartão), `42-resultados.js` (drinks no fim do dia).

**Testes:** **`tests/smoke46.js` (novo):** (1) cartão do Anselmo só na Avenida; contratar põe nível 2 e R$ 90 na folha; (2) sem ele ninguém pede drink; com ele, as chances por tipo (em 300 grupos) e nunca o entregador; (3) a fila: um drink por vez, 4 s / 0,8, no máximo 2 copos no balcão; (4) o grupo só pede a conta depois dos drinks e paga R$ 22 cada; não entregue sai da conta; (5) Ambiente +0,25; (6) corte da folha: ele é o primeiro a não vir; (7) conversa do `LIBERA` no 3º a 6º dia na Avenida; (8) save da v9.4 sem Anselmo carrega igual. `bot.js`: contrata o Anselmo e leva os drinks. `balance.js` `PONTO=avenida EQUIPE=auto`: o alvo de 85–95% continua; se passar de 95%, drinks R$ 18. `carreira.js`: o ganho por dia com ele menos o salário fica ≥ R$ 30; se não, `DRINKS.pede` +0,1 em cada tipo. Capturas `tests/shot_v9_5.py`: o Anselmo no balcão (preparando e parado), os 3 drinks, balão do drink, cartão dele, conversa.

**Fechamento:** v9.5 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.5.md`, `RESUMO.md`), PR e merge.

**Modelo:** Sonnet, esforço médio. Segue o molde do suco da mesa e do cartão do Joca, com números e textos fechados.

### Sessão 3b-6 — A Cami em "Minhas mesas" (v9.6)
O curso "Atendimento de mesa" da Cami (3b-3) passa a se comprar e abre o **modo "Minhas mesas"** no cartão dela (o outro modo é "Tarefas"; "Ajuda em tudo" vem no Terraço, 4a).
- **Quais mesas:** no editor do salão, o jogador marca até **3 mesas** como da Cami (`salao.mesas[i].cami = 1`; um avental vinho pequeno no tampo, no editor e no jogo). Sem mesa marcada, o modo não fica disponível ("Marque as mesas dela no Salão").
- **O que ela faz nelas,** com a velocidade do nível dela (1,25 × a da Bia sem tênis): anota o pedido, leva à janela, pega o prato pronto daquela mesa, entrega, leva a conta e recolhe os pratos sujos dela. O jogador continua pondo os grupos nas mesas (sentar é sempre o arrasto). Cada ação dela marca o grupo (`group.cami`), e a Bia não pega o que está marcado; o que a Bia já pegou, a Cami deixa. Ela carrega 2 itens (não usa bandeja) e não faz suco, café, doce nem drink (esses seguem com quem faz).
- **No modo "Minhas mesas" o básico** volta para o Joca (ou a Dani), pela regra do `donoBasico` (a Cami deixa de contar como a mais nova).
- **Pontos e gorjeta:** as ações dela dão os mesmos pontos (`PONTOS_ACAO`) e a mesma gorjeta das da Bia; a sequência (`chain`) é só da Bia.
- **Testes:** **`tests/smoke47.js` (novo):** (1) curso só depois do Atendimento ágil, na Avenida; (2) marcar no editor até 3 mesas, sem mesa o modo fica apagado; (3) um grupo numa mesa da Cami vai do pedido à conta sem a Bia; (4) a Bia e a Cami nunca pegam o mesmo item, nada se perde; (5) o básico volta para o Joca nesse modo; (6) save da v9.5 carrega igual. `bot.js`: marca as 3 mesas mais perto da janela e liga o modo. `balance.js PONTO=avenida EQUIPE=auto`: 85–95%; se passar de 95%, a Cami nesse modo fica com 2 mesas. Capturas `tests/shot_v9_6.py`: a Cami atendendo, o avental no tampo, o cartão com os 2 modos.
- **Fechamento:** v9.6 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.6.md`, `RESUMO.md`), PR e merge. Ao fechar a 3b, arquive a etapa (`ferramentas/arquiva.py`).

**Modelo:** Sonnet, esforço alto. Regras fechadas, mas é uma 2ª garçonete com IA própria, dividindo grupos com a Bia.

---

### Sessão 3b-7 — Rebalanceamento da escada completa (v9.6.1)
**Por que aqui:** a 3b-2 a 3b-6 mexem em receita, custo e nota do Gurugol (Dani, Joca, Cami, fiscal, drinks do Anselmo). Rebalancear antes desfaria o ajuste (como a v8.6.4 e a v8.6.6 precisaram de revisão). E o Terraço (4a) é o ponto mais sensível: os números da escada precisam estar firmes antes, para saber se a dificuldade dele vem do desenho ou de um desajuste herdado. É a primeira vez que a escada fica completa e dá para olhar a curva inteira.
- **Medir primeiro (sem mudar nada):** `node carreira.js` com `DIAS=50` (campanha até a Avenida), `node balance.js` (dias 3 a 7, sem equipe e `EQUIPE=auto`) e `PONTO=industrial` e `PONTO=avenida` (dias 8 a 10, `EQUIPE=auto`). Anotar no `docs/spec-v9.6.1.md` a tabela: dia, meta, % da meta, nota do Gurugol, dinheiro, e quando cada mudança de ponto fica possível.
- **Alvos:** sem equipe ~40–70% das metas nos dias 3 a 7; `EQUIPE=auto` ~85–95% (também nos pontos); nota do Gurugol perto do teto do ponto, com `avalMinimo` (2,7 para sair da Garagem e 3,4 da área industrial) alcançável sem fazer tudo perfeito; a mudança de ponto chega em dias de campanha parecidos com os de antes da 3b (sem pular nem travar).
- **O que se pode mexer, só em números:** metas por dia e por ponto (`10-constantes.js`), multiplicadores do cardápio dos pontos, aluguel e custo da mudança, `MANUT`, `AVAL` (teto, bônus, `avalMinimo`) e custos/preços da equipe e dos cursos. **Não mexer** em regras, textos, cenário nem na ordem das etapas.
- **Como decidir (um número por vez, medindo de novo):** fora da faixa para cima, subir meta ou custo do que sobra; para baixo, o contrário. Se o `EQUIPE=auto` passar de 95%, mexer primeiro nas metas do ponto, não nos preços. Se a nota não alcançar o `avalMinimo`, mexer no `AVAL` do ponto, não no mínimo. Mudar no máximo 3 números por rodada de medição; registrar cada um (antes, depois, motivo) na spec.
- **Testes:** `tests/run_all.sh --tudo` verde; ajustar só os valores esperados dos smokes que citem número mexido (sem relaxar conferência). Save da v9.6 carrega igual.
- **Fechamento:** v9.6.1 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.6.1.md`, `RESUMO.md`), PR e merge. Se não mudar nenhum número (a escada já estiver na faixa), vale como a 2c-r7b: sem versão nova, só o registro na spec.

**Modelo:** Opus, esforço médio. Balanceamento por tentativa, olhando a escada toda; as regras já estão fechadas acima. Se a medição já mostrar tudo na faixa, é só registrar, e o Sonnet dá conta.

---

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

**Partes:** `10-constantes.js`, `12-clientes.js` (tipo/modificador exigente), `13-cozinha.js` (prato da casa), `16-jogo.js` (reputação), `20-desenho-base.js` (visual do exigente, sem estereótipo: chapéu/lenço e plaquinha ★★), `21-cenario.js` (Terraço, foyer, piano), `22-salao-hud.js` (balão do pedido especial).

**Testes:** smoke novo (pedido especial, regras de mesa, avaliação ruim, reputação e save). `balance` no Terraço Suíça com equipe completa.

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
- **Conta rachada** (pensada com o usuário em 30/10; ficou fora da 3b em 31/10, continua guardada): um jeito de pagar que pode cair em qualquer grupo de colegas (turma, executivas): cada um paga a sua parte, e a Bia leva 2 ou 3 maquininhas em vez de uma conta só. Mais trabalho, mas cada pessoa deixa um pouco de gorjeta. Decidir: a chance, quantas maquininhas, o tempo de cada uma e a gorjeta por pessoa.
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
