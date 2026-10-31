# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário. **A 3b-1 (v9.1) foi feita em 31/10; a próxima é a 3b-2 (v9.2).**

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 2c-r7a | A lojinha abre aos poucos: cartões que aparecem com reclamação e conversa (Bia, Melhorias, Manutenção, Salão, Decoração) | v9.0.4 | feita em 31/10 (`docs/spec-v9.0.4.md`) |
| 2c-r7b | Rebalanceamento e a melhor ordem de liberação dos cartões | v9.0.5 | feita em 31/10 sem versão nova: a ordem A (rascunho) ficou; a fila de uma conversa por fim de dia faz os 5 cartões abrirem até a lojinha do dia 11 (`docs/spec-v9.0.4.md`, fim) |
| 3b-1 | Restaurante na Avenida Brasil: os caps. 6 e 7, o almoço de negócios, a parmegiana, os sofás, as águas saborizadas e as flores | v9.1 | feita em 31/10 (`docs/spec-v9.1.md`; a 5ª vaga de espera da área industrial ganhou posição; metas ×1,7) |
| 3b-2 | O Joca (desde a área industrial), a Dani confeiteira e o café da Avenida; planejada em 31/10, revista na entrevista da equipe | v9.2 | a fazer; **a próxima: a 3b-2** |
| 3b-3 | Fiscal da vigilância sanitária; planejada em 31/10 | v9.3 | a fazer |
| 3b-4 | O Anselmo e os drinks da Avenida; planejada em 31/10 | v9.4 | a fazer |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1 a v9.4)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).
- As sessões 3a (feita em 30/10, v9) e 3b-1 (feita em 31/10, v9.1) estão no `docs/PLANO-FEITO.md`.

### Vale para a 3a e a 3b
- **Mudança** na lojinha (aba "Ponto"): custo único, aluguel dali em diante e os móveis levados junto. O editor abre no ponto novo com a arrumação automática.
- Para mudar, é preciso o dinheiro da mudança **e a nota mínima do Gurugol** (etapa 2c; o usuário pediu 4,5 ★ para sair da Garagem, que exige jogar muito bem: o bot afiado ficava entre 4,35 e 4,5. Desde a v8.6.4, com o teto de 3 ★ da Garagem, o equivalente é ~2,8 ★. **Decidido em 30/10:** `avalMinimo`, 90% do teto: 2,7 para sair da Garagem e 3,4 da área industrial). Ao mudar, as avaliações antigas continuam na média, e a nota sobe aos poucos até o teto novo.
- Cada ponto traz: multiplicador do cardápio (sugestão: ×1 e ×1,4), mistura de clientes, área útil, cadeiras de espera, visual (piso, fachada, letreiro, vista da janela, calçada) e o **capítulo da história** do ponto.
- **Ao mudar, o ambiente e a bebida da espera são trocados** pelos do ponto novo (decidido em 21/10): a TV e o som da Garagem saem do save (`equipe.tv`, `equipe.som`), como o couvert abaixo do nível 3. A torneira sai do mesmo jeito (decidido em 30/10).
- **Modo dev** (v7.5.1): os pontos entram liberados, para testar.
- O ranking da carreira segue a regra da 2b, com o ponto alcançado ao lado.
- O "cardápio maior" dos pontos de cima mexe na diversidade do cardápio do Gurugol (`avalMenu`).

### Checagens de fim de sessão (valem para toda etapa que mexe em ponto, cenário, lojinha ou menu; a 3b e a 4 repetem)
- **Cenário:** capturas do salão do ponto em jogo (`tests/shot_vX.py`; sem playwright de Python, `pip install --target /tmp/pwpy playwright` e `PYTHONPATH=/tmp/pwpy`) com gente de cada tipo novo, tudo comprado e o apito/aviso na tela; conferir em recorte ampliado (PIL `crop`): parede, janela, letreiro, calçada (espera, jarra, plantas), TVs, balcão de pratos e de retirada com as vagas do ponto, roupas e acessórios da clientela nova, balões novos. Nenhum erro de página (`ERRORS: []`) e `prefers-reduced-motion` sem animação. Celular deitado (740×360) do salão.
- **Lojinha:** capturas do cartão novo apagado (falta dinheiro, falta nota, os dois), aceso e na confirmação; das abas Melhorias, Manutenção, Decoração e Dinheiro do ponto novo (nomes, preços e textos do ponto, o cartão que sai, o título com o nome do ponto); nada cortado nem sem rolar; o modo dev libera tudo sem custo.
- **Menu e telas:** `python3 menu_fit.py` verde (o menu não rola em nenhum tamanho; por isso o menu não ganhou linha nova com o nome do ponto); rótulo da História (cap., ponto, dia); cartão de fim de capítulos; conversas dos capítulos novos; fim do dia (aluguel e linha do capítulo) e painel Versões.
- **Teste de balanceamento** (com o ponto novo; cada alvo tem a regra de ajuste no plano da etapa): `PONTO=<ponto> node balance.js 40` com `BOT=afiado EQUIPE=auto` (passa 85–90% das metas; 3★ em ~60% dos dias), com `EQUIPE=auto` comum (~100% nos dias 8+), e sem equipe (a mudança **não** pode compensar); `node carreira.js 8` (e `MOVEIS=quatro`) com `DIAS=35`: dia da mudança, caps no prazo, 0 dias no negativo e o ganho por dia contra a Garagem (`MUDA=0`), que dá o prazo de volta do investimento; `DBGF=1` para ver grupos servidos e lotado por dia. Pontos a medir antes de mexer em `cardapio`, `aluguel`, `grupos` ou `metaF`: use `PONTO_CFG='{...}'` em vez de editar `src/`. Os números medidos vão no `docs/spec-vN.md`.

### 3b — Avenida Brasil, o Joca, os doces, o café, o fiscal e o Anselmo: decisões de 31/10 (v9.1 a v9.4, em 4 sessões)
> **Planejada com o usuário em 31/10** (respostas em `docs/PROPOSTAS.md`). Decidido: o **Joca** faz o básico (a lista de tarefas da Dani) e a **Dani se especializa** em confeiteira; o **fiscal da vigilância sanitária** entra (sessão 3b-3); a **conta rachada** continua guardada. Os números abaixo são o ponto de partida; os que se calibram dizem como.
> **Revista na entrevista da equipe (31/10):** cada ajudante se especializa **por curso pago em cada ponto**, e o curso já traz o equipamento. O **Joca** entra já na **área industrial** e vira **barista** na Avenida (o cafezinho passa da Dani para ele); os **doces da Dani** começam na área industrial (caseiros, na mesa e na marmita) e ficam gourmet na Avenida; o **Anselmo**, coqueteleiro que saiu do restaurante do Bráulio, entra na Avenida (sessão nova 3b-4), e a 4a fica com os upgrades dele. O que é do Terraço está na 4a ("Equipe do Terraço").
> Ordem: 3b-1 (o ponto e os capítulos) → 3b-2 (o Joca, os doces e o café) → 3b-3 (o fiscal) → 3b-4 (o Anselmo). Cada uma é uma versão, com PR e merge.

### Sessão 3b-2 — O Joca, a Dani confeiteira e o café da Avenida (v9.2)
**O Joca** (o 2º ajudante, primo da Dani): contratado com salário **a partir da área industrial** (`ponto.nivel >= 2`; no modo dev, em qualquer ponto). Faz **o básico**: as tarefas da lista da Dani **menos o cafezinho** (lixo, pratos sujos, louça, suco/água da espera, marmitas), escolhidas no cartão dele, como as dela. Na Avenida, com o curso de espresso, vira o barista (abaixo).
- `STAFF.joca = { levels:[ null, { speed:0.5, tasks:2, pay:45, xp:0 }, { speed:0.6, tasks:3, pay:60, xp:8 }, { speed:0.75, tasks:4, pay:75, xp:18 } ] }`. Contratar é o nível 1 (R$ 45/dia na folha desde o 1º dia, sem aprendiz). Experiência: +1 a cada `JOCA_XP.tarefas` (5) tarefas (`save.jocaTar`; só o dia completo conta) e +2 por curso (`JOCA_XP.curso`); o aumento consolida o nível (mesmas regras do Tonhão e da Dani: só com a experiência, e só a falta de dinheiro da folha derruba).
- Save: `equipe.joca` (0 a 3), `equipe.jocaTasks` (padrão `['lixo','lavar']`), `jocaTar`, `jocaCursos` (`{ id:1 }`, como `daniCursos`). `FOLHA_CORTE` corta o aumento do Joca antes do da Dani; sem dinheiro nem para o nível 1, ele não vem naquele dia (como a folha de hoje).
- **Código:** a classe `Helper` (`15-dani.js`) passa a receber quem é (`new Helper(g, 'dani')`, `new Helper(g, 'joca')`): nível, `spec`, tarefas, casa (`JOCA_HOME = { x:640, y:515 }`) e contagem de tarefas por quem. As marcas de "um ajudante já vai pegar" (`p.dani`, `o.dani`, `group.daniCoffee`) guardam quem (`'dani'`/`'joca'`) e cada um respeita a do outro; mesa que o outro ajudante vai limpar e pia com o outro lavando também ficam de fora (`targets`, `washing`). Onde o jogo hoje percorre `[this.bia, this.dani]` (marmitas nas mãos, `16-jogo.js`), entra o Joca.
- **Visual** (sem estereótipo, com crachá como a Dani): rapaz de uns 20 anos, pele parda, cabelo cacheado preto curto, óculos redondos, camiseta cinza com avental azul-marinho e crachá "JOCA", tênis branco. Os níveis 2 e 3 mudam o avental como os da Dani.
- **Lojinha (Equipe):** cartão do Joca ao lado do da Dani, igual ao dela (nível, salário, tarefas, experiência). O curso dele fica no cartão Cardápio (abaixo). No Modo História ele abre pelo `LIBERA` (abaixo); fora dele, aberto a partir da área industrial.
- **Conversa** (`LIBERA`, `id:'joca'`): abre a partir do 2º dia na área industrial (`save.pontoDia`, o dia da mudança, novo no save; saves já na área industrial ou na Avenida sem `pontoDia` contam como 2º dia) e garante até o 4º; reclamações: "Mesa suja de novo!", "A lixeira tava transbordando." Falas: Dani "Tio, meu primo Joca tá procurando serviço." / Tonhão "Esse salão é grande demais pra vocês duas, mesmo." / Joca "Lixo, louça, mesa suja: pode deixar comigo!" / Dani "E eu fico livre pra aprender confeitaria!" / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.joca = 'Joca'`, `convCabeca` com o Joca (ao lado da Dani, se ainda não chegou) e cor do nome própria (verde-azulado `#2C7A7B`).

**Pedidos de fim de refeição** (o molde do cafezinho do motorista, `cafePede`/`esperaSuco`, generalizado): ao terminar de comer, o grupo pode pedir **doces** e **cafés** (cada tipo com a sua chance, abaixo; nunca o entregador à mesa; VIP +0,2 em cada chance): `randi(1, size)` itens de cada tipo pedido, cada um sorteado entre os itens do patamar. Balão com os itens (como a xícara do motorista), a paciência corre e o grupo só pede a conta depois de receber todos. Cada item: ocupa mão como bebida (2 por mão com a bandeja), devolve 1 coração, +5 pontos (`PONTOS_ACAO.doce`, `PONTOS_ACAO.cafeEsp`) e entra na conta (`bebConta`). Item não entregue sai da conta e o grupo perde paciência como no suco pendente.

**A Dani confeiteira** (cursos dela que trazem itens; os cursos de Atendimento e Organização da cozinha ficam na seção Dani da Equipe):
- **Área industrial — curso "Confeitaria caseira"** (`DANI_CURSOS`, `{ id:'confCaseira', preco:180, nivel:2 }`, +2 de experiência). Traz a **geladeirinha de doces**: estação nova `STATIONS.doces`, encostada na parede do fundo entre o salão e a janela de pedidos, `rect:{ x:690, y:92, w:50, h:50 }`, `ap:{ x:714, y:150 }` (se cruzar o caminho, ajuste no recorte). Desenho: geladeirinha branca de porta de vidro com potes. Doces (`DOCES.caseira`): **bolo de pote, brigadeiro de colher e pudim**, **R$ 7** cada (ingrediente R$ 2). Tarefa nova da Dani **"Servir doces"** (curto "Doce", `need:'confCaseira'`).
- **Doce na marmita:** com a Confeitaria caseira, cada marmita tem **30%** (`DOCES.marmita`) de vir com "+ doce" (pote pequeno no ícone). O pote vai para o balcão de retirada: a Bia toca a geladeirinha e depois o balcão (o pote entra na marmita da vaga), ou a Dani com a tarefa "Doce". Se o entregador leva a marmita sem o doce, só perde os R$ 7 (sem outra punição).
- **Avenida — curso "Confeitaria gourmet"** (`{ id:'confGourmet', preco:350, nivel:3, dep:'confCaseira' }`, +2 de experiência). A geladeirinha vira **vitrine refrigerada** (mesmo lugar), e os doces passam a ser os gourmet (`DOCES.gourmet`; os caseiros saem do sorteio): **shortcake de morango, torta de limão e brigadeiro gourmet**, **R$ 16** cada (ingrediente R$ 4), e +0,25 no Ambiente de quem comeu (`AVAL.amb.doce`).
- **Quem pede doce** (`DOCES.pede`): `{ familia:0.5, vovos:0.6, estudante:0.3, executiva:0.2, negocios:0.4, turma:0.3, motorista:0.3 }`. Sem o curso, ninguém pede.
- O plano anterior (vitrine de R$ 300 nas Melhorias, sobremesa a R$ 14 sem curso e a R$ 18 com o curso de Confeitaria) **sai**: o equipamento vem com o curso.

**O Joca barista e o café da Avenida:**
- **Curso do Joca "Barista: espresso"** (`JOCA_CURSOS = [{ id:'espresso', nome:'Barista: espresso', preco:350, nivel:3 }]`, +2 de experiência). Traz a **máquina de espresso**, desenhada sobre a estação do café (`STATIONS.coffee`, a cafeteira continua com a manutenção dela). Itens (`CAFES.espresso`): **espresso R$ 8** (preparo 0,8 s) e **cappuccino R$ 12** (1,2 s); ingrediente R$ 2.
- **O cafezinho passa ao Joca:** com o curso, a tarefa "Servir cafezinho" sai da lista da Dani (se estava marcada, a vaga fica livre) e entra na do Joca, que também leva os espressos. Sem o curso, a Dani segue com o cafezinho, como hoje. O curso "Barista iniciante" da Dani continua somando experiência.
- **Quem pede café** (`CAFES.pede`): `{ executiva:0.5, negocios:0.6, vovos:0.4, familia:0.2, estudante:0.3 }`. A Bia pega na estação do café (toque, o tempo do preparo) e leva.

**Cardápio da lojinha** (a ideia "Bebidas da Dani no Cardápio", de 30/10): os cursos que trazem itens (as 2 confeitarias da Dani e o espresso do Joca) entram no **cartão Cardápio**, com o rosto de quem faz, ao lado dos do Tonhão; só aparecem com o ponto do `nivel` deles (no modo dev, sempre). Contam na Diversidade do cardápio do Gurugol (`avalMenu`) como os pratos.
- Gurugol: comentário bom "A sobremesa da casa é uma delícia!" e "Que cappuccino caprichado!"; ruim (esperou o doce ou o café e perdeu coração) "A sobremesa demorou mais que o almoço."

**Partes:** `10-constantes.js` (`STAFF.joca`, `JOCA_XP`, `JOCA_CURSOS`, `DANI_CURSOS`, `DANI_TASKS`, `DOCES`, `CAFES`, `STATIONS.doces`, `PONTOS_ACAO`, `AVAL`, `LIBERA`, `HIST_NOMES`), `12-clientes.js` (pedidos de fim de refeição), `15-dani.js` (`Helper` para os dois), `16-jogo.js` (folha, marmita com doce, estações), `19-conversa.js`, `20-desenho-base.js` (Joca, doces, cafés), `21-cenario.js` (geladeirinha, vitrine, máquina), `22-salao-hud.js` (balões), `41-lojinha.js` (cartão do Joca, cursos no Cardápio), `42-resultados.js` (doces e cafés no fim do dia).

**Testes:** **`tests/smoke43.js` (novo):** (1) cartão do Joca só a partir da área industrial; contratar põe R$ 45 na folha; (2) ele faz só as tarefas escolhidas, nunca o cafezinho sem o curso, e não disputa mesa, pia, marmita ou suco com a Dani (os dois ligados num dia: nenhuma mesa limpa duas vezes, nenhum item perdido); (3) experiência pelo trabalho e pelo curso, aumento só com ela; corte da folha tira o aumento dele antes do da Dani; (4) conversa do `LIBERA` no 2º a 4º dia na área industrial; (5) sem Confeitaria caseira ninguém pede doce; com ela, as chances por tipo (em 300 grupos), o grupo espera os doces para pedir a conta e paga R$ 7 cada; (6) marmita com "+ doce" em ~30%, o pote no balcão completa e cobra R$ 7, sem ele só perde os R$ 7; (7) Confeitaria gourmet só na Avenida e só depois da caseira: vitrine, R$ 16, Ambiente +0,25; (8) curso de espresso: café na Avenida pelas chances, R$ 8 e R$ 12, o cafezinho sai da Dani e vai para o Joca; (9) os 3 cursos no cartão Cardápio, só no ponto certo; (10) save da v9.1 sem Joca carrega igual. `bot.js`: o bot contrata o Joca na área industrial, compra os cursos e serve doces e cafés (`carreira.js` mostra a folha com ele e quanto vem de doce e café). `balance.js` `PONTO=industrial EQUIPE=auto` e `PONTO=avenida EQUIPE=auto` com o Joca: o alvo de 85–95% continua; se passar de 95%, `pay` do Joca 55/70/85 e, se ainda passar, as chances de `DOCES.pede` e `CAFES.pede` −0,1. Capturas `tests/shot_v9_2.py`: o Joca nos 3 níveis, os dois ajudantes trabalhando, cartão dele, geladeirinha e vitrine, máquina de espresso, balões de doce e café, marmita com doce, cartão Cardápio com os rostos, conversa dele.

**Fechamento:** v9.2 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.2.md`, `RESUMO.md`, CLAUDE.md com o smoke43), PR e merge.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas é grande: o 2º ajudante mexe na classe da Dani, os dois não podem se atrapalhar, e entram 2 sistemas de pedido novos; pede depuração com o bot. Se a sessão passar de umas 15 trocas, feche o Joca e os doces caseiros como v9.2 e deixe a confeitaria gourmet, o espresso e o Cardápio para uma v9.2.1 com o mesmo plano.

### Sessão 3b-3 — Fiscal da vigilância sanitária (v9.3)
- **Quando:** só na Avenida (`nivel >= 3`) e na carreira, do 2º dia no ponto em diante, com chance de **15% por dia** (`FISCAL.chance`), sorteada com o clima (`manut.sorteio`, para não mudar ao rejogar). Nunca na Missão zero nem no Turno sem fim. **Avisado na introdução do dia:** "Dizem que a vigilância sanitária está rondando a Avenida." (sem dizer a hora).
- **A visita:** num momento entre 30% e 70% do turno, o fiscal (`FISCAL`, não é grupo e não ocupa mesa) entra pela porta, anda até o meio do salão e fica **20 s** (`FISCAL.visita`) olhando, com a prancheta; depois sai. Visual: colete azul-claro com "VIGILÂNCIA" escrito, prancheta e caneta; homem ou mulher, sorteado.
- **O que ele confere durante a visita** (cada um é uma falha): (1) alguma mesa ficou **suja por mais de 8 s seguidos**; (2) a **lixeira esteve cheia**; (3) a **pia chegou a 4 pilhas** ou mais. Um ícone pequeno de cada falha aparece em cima dele quando acontece.
- **Resultado** (texto grande no salão quando ele sai): **0 falhas, "Aprovado!"**: selo "Aprovado pela vigilância" na parede por 7 dias (`save.selo`, o último dia do selo), que soma **+0,5 no Ambiente** do Gurugol (`AVAL.amb.selo`) e +30 pontos; **1 falha, "Advertência"**: só o aviso, sem multa; **2 ou 3 falhas, "Multa!"**: **R$ 150** nas contas do dia (linha "Multa da vigilância" no fim do dia e no livro-caixa).
- Gurugol: no dia aprovado, comentário "Vi o selo da vigilância: lugar limpinho!"
- **Testes:** **`tests/smoke44.js` (novo):** (1) não vem na Garagem nem na área industrial; na Avenida, ~15% dos dias em 400 sorteios, e o mesmo sorteio ao rejogar; (2) aviso na introdução; (3) cada falha detectada (mesa suja 8 s, lixeira cheia, pia com 4); (4) 0, 1 e 2 falhas dão selo, advertência e multa; (5) o selo soma +0,5 no Ambiente por 7 dias e some; (6) multa no fim do dia e no livro-caixa; (7) save sem `selo` carrega. `bot.js`: nada novo (só medir). `carreira.js`: quantas visitas e o resultado de cada uma; com o bot comum, a multa não pode passar de 1 em cada 3 visitas (se passar, a mesa suja vira 12 s). Capturas `tests/shot_v9_3.py`: o fiscal no salão com as falhas, o selo, o fim do dia com a multa.
- **Fechamento:** v9.3 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.3.md`, `RESUMO.md`, CLAUDE.md com o smoke44), PR e merge.

**Modelo:** Sonnet, esforço médio. Evento pequeno, com regras e números fechados, que segue o molde do clima e do texto de fim do dia.

### Sessão 3b-4 — O Anselmo e os drinks da Avenida (v9.4)
**O Anselmo** (coqueteleiro): era o coqueteleiro do restaurante do Bráulio, saiu porque lá era muito difícil trabalhar e achou a casa nova depois de conversar com o Tonhão. Entra **só na Avenida** (`ponto.nivel >= 3`; no modo dev, em qualquer ponto), **já com habilidade**: não passa por aprendiz e não faz as tarefas da lista; fica no balcão de drinks.
- `STAFF.anselmo = { levels:[ null, null, { speed:0.8, pay:90, xp:0 }, { speed:1.0, pay:130, xp:0 } ] }`: contratar já põe no **nível 2** (R$ 90/dia). O nível 3 vem dos cursos do Terraço (4a); na Avenida ele não sobe pelo trabalho. Save: `equipe.anselmo` (0, 2 ou 3). `FOLHA_CORTE`: sem dinheiro para a folha inteira, o Anselmo é o primeiro a não vir naquele dia (antes dos aumentos do Joca e da Dani).
- **Balcão de drinks** (vem com a contratação): estação `STATIONS.drinks` na parede do fundo, à esquerda da vitrine da Dani: `rect:{ x:620, y:92, w:60, h:50 }`, `ap:{ x:650, y:150 }` (se cruzar o caminho ou a janela de pedidos, ajuste no recorte), com **2 vagas** de copo pronto. O Anselmo fica atrás dele (`ANSELMO_HOME = { x:650, y:118 }`), com o desenho de chacoalhar a coqueteleira enquanto prepara (parado com `prefers-reduced-motion`). Não é um `Helper`: é uma fila de preparo em `16-jogo.js`, um drink por vez, **4 s / `speed`** cada (`DRINKS.prep`).
- **Quem pede** (`DRINKS.pede`), **ao sentar**, junto com o pedido: `{ executiva:0.35, negocios:0.5, familia:0.15, vovos:0.15, estudante:0.25 }`, VIP +0,2, nunca o entregador; `randi(1, size)` drinks, cada um sorteado entre os 3. Sem o Anselmo, ninguém pede. O pedido vai para a fila dele quando a Bia anota; o copo pronto fica no balcão, a Bia pega (toque, 2 por mão com a bandeja) e leva. O grupo come normalmente, mas só pede a conta depois de receber os drinks (como o suco da mesa); drink não entregue sai da conta e o grupo perde paciência como no suco pendente.
- **Os drinks** (`DRINKS.itens`; nomes inventados, sem dizer se têm álcool): **"Pôr do Sol da Avenida"** (laranja e vermelho, em degradê), **"Brisa de Maracujá"** (amarelo, com hortelã) e **"Esmeralda"** (verde, com rodela de limão). **R$ 22** cada (ingrediente R$ 6), +5 pontos (`PONTOS_ACAO.drink`), devolve 1 coração e +0,25 no Ambiente de quem tomou (`AVAL.amb.drink`).
- **Visual** (sem estereótipo, com crachá): homem de uns 45 anos, pele negra retinta, cabeça raspada e barba grisalha curta, camisa branca de manga dobrada com colete preto, gravata-borboleta bordô e crachá "ANSELMO".
- **Lojinha (Equipe):** cartão do Anselmo ao lado do Joca: nível, salário, "Drinks no balcão" e, no lugar dos cursos, "Cursos no Terraço Suíça". No Modo História abre pelo `LIBERA` (abaixo); fora dele, aberto na Avenida.
- **Conversa** (`LIBERA`, `id:'anselmo'`): abre a partir do 3º dia na Avenida (`save.pontoDia`) e garante até o 6º; reclamações: "Não tem nem um drinkzinho aqui?", "No restaurante da frente tem drink." Falas: Tonhão "Bia, lembra do Anselmo, o dos drinks do Bráulio? Encontrei ele na feira." / Anselmo "Seu Tonhão me contou da casa nova. Lá no Bráulio não dava mais: era grito o dia inteiro." / Bia "Aqui ninguém grita. Só a chapa, de vez em quando." / Anselmo "Me dá um balcão e eu faço o drink mais bonito da Avenida." / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.anselmo = 'Anselmo'`, `convCabeca` com ele e cor do nome própria (bordô `#8E3B46`).
- Gurugol: comentário bom "O drink do balcão é uma obra de arte!"; ruim (esperou o drink e perdeu coração) "Pedi um drink e ele nunca veio."

**Partes:** `10-constantes.js` (`STAFF.anselmo`, `DRINKS`, `STATIONS.drinks`, `PONTOS_ACAO`, `AVAL`, `LIBERA`, `HIST_NOMES`), `12-clientes.js` (pedido ao sentar), `16-jogo.js` (fila de preparo, folha), `19-conversa.js`, `20-desenho-base.js` (Anselmo, os 3 drinks), `21-cenario.js` (balcão), `22-salao-hud.js` (balão do drink), `41-lojinha.js` (cartão), `42-resultados.js` (drinks no fim do dia).

**Testes:** **`tests/smoke45.js` (novo):** (1) cartão do Anselmo só na Avenida; contratar põe nível 2 e R$ 90 na folha; (2) sem ele ninguém pede drink; com ele, as chances por tipo (em 300 grupos) e nunca o entregador; (3) a fila: um drink por vez, 4 s / 0,8, no máximo 2 copos no balcão; (4) o grupo só pede a conta depois dos drinks e paga R$ 22 cada; não entregue sai da conta; (5) Ambiente +0,25; (6) corte da folha: ele é o primeiro a não vir; (7) conversa do `LIBERA` no 3º a 6º dia na Avenida; (8) save da v9.3 sem Anselmo carrega igual. `bot.js`: contrata o Anselmo e leva os drinks. `balance.js` `PONTO=avenida EQUIPE=auto`: o alvo de 85–95% continua; se passar de 95%, drinks R$ 18. `carreira.js`: o ganho por dia com ele menos o salário fica ≥ R$ 30; se não, `DRINKS.pede` +0,1 em cada tipo. Capturas `tests/shot_v9_4.py`: o Anselmo no balcão (preparando e parado), os 3 drinks, balão do drink, cartão dele, conversa.

**Fechamento:** v9.4 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.4.md`, `RESUMO.md`, CLAUDE.md com o smoke45), PR e merge. Ao fechar a 3b, arquive a etapa (`ferramentas/arquiva.py`).

**Modelo:** Sonnet, esforço médio. Segue o molde do suco da mesa e do cartão do Joca, com números e textos fechados.

---

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. A confeitaria, o café e os drinks vêm da 3b (a Dani confeiteira, o Joca barista e o Anselmo com o balcão de drinks); aqui o Anselmo leva **a coquetelaria lá fora** (o balcãozinho da espera), um sistema só com o balcão do salão.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
- **Equipe do Terraço** (entrevista de 31/10; texto em `docs/PROPOSTAS.md`). Decidido; ao planejar, falta o que está em "Decidir":
  - **Cami** (atendimento): 3ª assistente, **R$ 120/dia**, **90% da velocidade da Bia**. O jogador escolhe no cartão dela **um de 3 modos**: "Minhas mesas" (cuida sozinha das mesas marcadas no editor: sentar, pedido, entregar, conta), "Tarefas" (marca o que ela faz, como a Dani) e "Ajuda em tudo" (pega o que a Bia não pegou, em qualquer mesa). Na etapa 6 vira gerente de salão. Decidir: visual, conversa de chegada, níveis e experiência.
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
