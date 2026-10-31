# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 2c-r6 | Retorno de beta-tester: cardápio fácil de achar (cartão Cardápio com os cursos, conversa do dia 2, selo "novo", reclamação dos clientes) e balão do Tonhão embaixo do Pular | v9.0.1 | feita em 30/10 (`docs/spec-v9.0.1.md`); depois, v9.0.2 e v9.0.3 fora do plano |
| 2c-r7a | A lojinha abre aos poucos: cartões que aparecem com reclamação e conversa (Bia, Melhorias, Manutenção, Salão, Decoração) | v9.0.4 | feita em 31/10 (`docs/spec-v9.0.4.md`) |
| 2c-r7b | Rebalanceamento e a melhor ordem de liberação dos cartões | v9.0.5 | feita em 31/10 sem versão nova: a ordem A (rascunho) ficou; a fila de uma conversa por fim de dia faz os 5 cartões abrirem até a lojinha do dia 11 (`docs/spec-v9.0.4.md`, fim) |
| 3b | Avenida Brasil e os caps. 6 e 7 (3b-1), o Joca e as sobremesas (3b-2), o fiscal (3b-3); planejada em 31/10 | v9.1 a v9.3 | a fazer; **a próxima: a 3b-1** |
| 4a | Terraço Suíça e VIPs exigentes (e o capítulo dele) | v10 | a fazer |
| 4b | Nível de luxo | v10.1 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.2 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa 3 — Pontos: área industrial (3a, v9) e Avenida Brasil (3b, v9.1 a v9.3)
**Objetivo:** a primeira decisão grande de dinheiro, mudar de ponto, que é subir o nível do salão. Valores na tabela da etapa 1d. Desde a revisão de 28/10, cada ponto é também um capítulo do Modo História (etapa 2f).
- A sessão 3a (feita em 30/10, v9) está no `docs/PLANO-FEITO.md`.

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

### 3b — Avenida Brasil, o Joca, as sobremesas e o fiscal: decisões de 31/10 (v9.1, v9.2 e v9.3, em 3 sessões)
> **Planejada com o usuário em 31/10** (respostas em `docs/PROPOSTAS.md`). Decidido: o **Joca** faz o básico (a lista de tarefas da Dani) e a **Dani se especializa** em confeiteira; **sobremesas** com a vitrine e o curso de Confeitaria da Dani, sem funcionário novo; a **coquetelaria** com o profissional de drinks foi para a **4a** (Terraço, junto com a coquetelaria lá fora); a **conta rachada** continua guardada; o **fiscal da vigilância sanitária** entra (sessão 3b-3). Os números abaixo são o ponto de partida; os que se calibram dizem como.
> Ordem: 3b-1 (o ponto e os capítulos) → 3b-2 (o Joca e as sobremesas) → 3b-3 (o fiscal). Cada uma é uma versão, com PR e merge.

### Sessão 3b-1 — Restaurante na Avenida Brasil (v9.1)
**Mudança generalizada** (a 3a amarrou partes ao "nível 2" e ao cap. 4; aqui vale para qualquer ponto):
- `mudancaVisivel`: o cartão aparece com `save.cap >=` o 1º capítulo do próximo ponto (`HISTORIA.find(c => c.ponto === para.id).cap`: 4 para a área industrial, 6 para a Avenida); no modo dev, sempre.
- `mudarPonto`: o `if (sv.cap === 4)` vira "se o capítulo de agora é do ponto novo" (`HISTORIA[sv.cap - 1].ponto === para.id`). Ao sair da área industrial **saem do save, sem devolver**: as TVs (`up.tvs`, `equipe.tvs = 0`), o assento (`up.assento`) e a jarra (`up.maquina`). **Vão junto:** fogão industrial, mesas (arrumação automática), pratos, cursos, equipe, melhorias, decoração (as plantas da Garagem e da área industrial também aparecem na Avenida), empréstimo.
- `normSave`: o "cap. 4 pendente" (`12-clientes.js:149`) vira "o capítulo de agora é de outro ponto que não o do save" (vale para o 4 e o 6).
- Itens da área industrial (TVs, cadeirinhas/banquinhos, jarra, `normEquipe.tvs`, `buildMelhorias`, o seletor das TVs) passam de `nivel >= 2` para `nivel === 2`; o fogão industrial e as plantas `nivel:2` continuam à venda de 2 em diante. `upgradeDe` troca o `ind` por `porNivel:{ 2:{...}, 3:{...} }`; `daniTaskDe` chama a tarefa pela bebida do ponto ("Levar a água saborizada", curto "Água").
- O cartão de fim de capítulos (`contTexto`, `43-telas.js`) sai do texto fixo: o último capítulo de cada ponto ganha `fim:{ h, p }` em `HISTORIA` (a Garagem e a área industrial com os textos de hoje).
- O "Como jogar" (`40-interface.js:184`) diz "cardápio 20% mais caro" (errado desde a v9): use a porcentagem de `PONTOS[1].cardapio` e acrescente 1 frase da Avenida (o cartão Mudança depois do cap. 5).

**O ponto** (`PONTOS[2]`): `{ id:'avenida', nome:'Restaurante na Avenida Brasil', nivel:3, lugares:24, aluguel:400, mudanca:2000, credito:4000, cardapio:2.0, area:{ x0:160, y0:150, x1:684, y1:500 }, espera:6, assento:'pe', bebida:'saborizada', pratos:6, prateleira:4, tipos:{ estudante:0.5, executiva:2, familia:1.5, vovos:1, entregador:1, negocios:1.5 }, vip:2, metaF:1.6, grupos:0.7 }`
- Nota mínima para sair (Terraço, 4a): `avalMinimo` = 3,9 (teto 4,3). Para chegar: 3,4 da área industrial e R$ 2.000.
- Se 24 lugares não couberem na arrumação automática: `y0` 140 e `y1` 510; ainda não, `x0` 140. Se a espera de 6 não couber na calçada com os sofás, 5.
- **6 vagas no balcão de pratos:** `plateSlotsFor(6)` com x = 786 + 32·i (confira no recorte que o 6º prato não sai do balcão).
- Sem `patPressa`, sem apito e sem encomenda (a turma, o motorista e a encomenda não vêm). VIP ×2.

**Cliente novo: Almoço de negócios** (`negocios`, só na Avenida; não é VIP; vale o vegetariano): `{ label:'Almoço de negócios', pat:0.8, eat:[7,9], read:[4,5], size:[3,4], mais:0.2, tip:0.15 }`, `GOSTOS.negocios = [5, 0, 1, 1, 0]`. Visual: blazer ou camisa social de cores sóbrias e variadas (cinza, azul, vinho, bege), um com pasta ou notebook debaixo do braço; gente de várias cores, idades e gêneros. Comentário próprio na Agilidade (`AVAL_CRIT.tipo`): bom "Deu pra fechar o negócio com calma!", ruim "A reunião atrasou por causa do almoço."

**Prato novo e curso de restaurante** (a "Cozinha de restaurante" das ideias guardadas): curso do Tonhão `{ id:'restaurante', nome:'Cozinha de restaurante', preco:400, pratos:['parmegiana'], nivel:3, av:{ nome:'Parmegiana da casa', preco:600, receita:'molho de tomate de 6 horas e queijo gratinado na hora', pratos:['parmegiana'] } }`; `CARDAPIO.parmegiana = { nome:'Filé à parmegiana', preco:30, cat:'pf', curso:'restaurante', carne:true, cor:'#B5432E' }` (R$ 60 na Avenida). O curso só aparece no cartão Cardápio com `ponto.nivel >= 3` (`nivel:3` no curso; no modo dev, sempre). Conta na experiência do Tonhão e na Diversidade do cardápio como os outros. Desenho do prato no estilo das artes da v8.6.10 (filé empanado com molho vermelho e queijo, arroz e batata).

**Itens da Avenida** (lojinha; só com `ponto.nivel === 3`):
- **Couvert artístico:** já existe (`STAFF.couvert`, R$ 80/dia, 20%, taxa de R$ 3 que corta pela metade); aparece sozinho com `nivel:3`. Só conferir o músico no salão de 24 lugares.
- **Sofás** (o assento da espera): **"Sofás com almofadas", R$ 250**, compra única. Quem espera sentado no sofá perde a paciência **25% mais devagar** (`AVENIDA.sofa = { cost:250, slow:0.25 }`; `up.assento = 'sofa'`). Desenho: 2 sofás de 3 lugares, verde-musgo, almofadas coloridas.
- **Águas saborizadas** (a melhoria `maquina` da Avenida, `porNivel[3]`): **R$ 200**. `BEBIDA_ESPERA.saborizada = { preco:14, ingred:3, prep:2, take:0.5 }`, o resto como o suco. Cada grupo sorteia um sabor (limão, morango ou hortelã), que só muda a cor do copo e do balão. Paciência 40% mais devagar (`MAQUINA.slow`, igual). Desenho: mesinha de canto com 3 garrafas de vidro coloridas e copos.
- **Flores da calçada** (`DECOR`, grupo plantas, `nivel:3`, +0,15 no Ambiente cada): **tulipas R$ 40, copos-de-leite R$ 50, orquídeas R$ 60**.
- O cartão "TVs" some da Avenida (o ambiente é o couvert).

**Visual** (`21-cenario.js`, `avenida(g)` ao lado do `industrial(g)`): piso de taco de madeira em espinha de peixe, meia-parede de azulejo verde-água com papel de parede creme em cima, luminárias pendentes, janela grande com prédios e um ipê-amarelo da avenida, letreiro **"Corre-Corre · Restaurante"** em letras douradas sobre toldo listrado vinho e creme, calçada de pedra portuguesa em ondas preto e branco, sofás, mesinha das águas e as flores na calçada (tulipas em jardineira, copos-de-leite num vaso alto, orquídea numa mesinha perto da porta). `prefers-reduced-motion` como nos outros pontos.

**Capítulos** (`HISTORIA`, `ponto:'avenida'`): o cap. 6 começa na mudança (como o 4); até lá `save.cap` fica em 6, "à espera". `save.cap = 8` = Avenida completa. O Bráulio é só citado (ele fala na etapa 6).
- **Cap. 6, "Do outro lado da rua"** — `obj:{ azul:3 }`.
  - Antes: Bia "Avenida Brasil, tio! Olha o movimento dessa calçada." / Tonhão (olhando pela janela) "E ali, do outro lado da rua... o restaurante do Bráulio." / Bia "Então ele vai ver a gente crescer de pertinho." / Dani "E aqui cabe até música ao vivo!"
  - Depois: Tonhão "Três dias no azul com aluguel de gente grande." / Bia "O pessoal do Bráulio passou duas vezes espiando pela janela." / Tonhão (rindo) "Deixa espiar."
- **Cap. 7, "Nota de restaurante"** — `obj:{ nota:3.9, caixa:5000 }` (o texto do objetivo já sai do `capObj`).
  - Antes: Bia "Aqui o Gurugol é mais exigente. Restaurante é outra régua." / Tonhão "Então capricha: prato bonito, mesa limpa e ninguém esperando." / Dani "E guardar dinheiro. Ouvi falar de um terraço lá no alto..."
  - Depois: Bia "Nota 3,9 e R$ 5.000 guardados!" / Tonhão (tirando o avental) "O Bráulio veio jantar aqui ontem. Pediu PF." / Bia "E aí?" / Tonhão "Comeu tudo e não disse nada. Mas raspou o prato." / Dani "Próxima parada: o Terraço Suíça!"
  - `fim:{ h:'Fim dos capítulos da Avenida Brasil', p:'Continua na próxima versão: o Terraço Suíça.' }`.

**O que muda, parte por parte:** `10-constantes.js` (`PONTOS[2]`, `negocios`, `GOSTOS`, `AVAL_CRIT.tipo`, `CURSOS`/`CARDAPIO`, `AVENIDA`, `BEBIDA_ESPERA.saborizada`, `UPGRADES.maquina.porNivel`, `DECOR` das flores com `AVAL.amb`, `HISTORIA` caps. 6 e 7 e os `fim`, `plateSlotsFor`); `12-clientes.js` (`normSave`, `normEquipe`, o assento com `slow` por tipo, o sabor da água); `16-jogo.js` (`mudancaVisivel`, `mudarPonto`, `comprarInd` ou uma `comprarAv` para os sofás); `20/21-*.js` (cenário, clientes novos, sofás, águas, flores, prato); `41-lojinha.js` (cartões da Avenida, curso com `nivel:3`, a confirmação "Mudar para o Restaurante na Avenida Brasil por R$ 2.000? Aluguel de R$ 400 por dia. Não dá para voltar."); `40-interface.js` (rótulo "História · cap. 6, Do outro lado da rua · dia N" e "Avenida Brasil completa"; "Como jogar"); `43-telas.js` (`contTexto`).

**Testes:**
- **`tests/smoke42.js` (novo):** (1) na área industrial com `cap` 5 não há cartão Mudança; com `cap` 6 aparece, apagado sem R$ 2.000 ou sem nota 3,4 (cada um); (2) mudar: −R$ 2.000, `ponto:'avenida'`, TVs/assento/jarra fora, fogão industrial e plantas ficam, 24 lugares com arranjo válido, 6 vagas de prato, `cap` 6 com `conversa:'antes'`; (3) aluguel R$ 400 e preços ×2,0 (PF R$ 50); (4) clientela: em 200 grupos, `negocios` aparece, nenhuma turma/motorista/encomenda, VIPs ≈ 2× os da Garagem; (5) sofás: espera 25% mais devagar; (6) água saborizada R$ 14 na conta, 3 sabores; (7) flores +0,15 cada no Ambiente; (8) couvert à venda só na Avenida (fora do modo dev); (9) curso Cozinha de restaurante só na Avenida, ensina o Filé à parmegiana (R$ 60; R$ 69 com o avançado); (10) cap. 6 com 3 dias no azul avança; cap. 7 com nota 3,9 e R$ 5.000 cumpre, `cap` 8 e o cartão de fim novo; (11) save da v9 na área industrial (sem nada novo) carrega igual, e um com `cap` 6 fica "à espera".
- Ajustar smokes antigos que esperam 5 vagas fixas, o texto do `#ov-continua`, `cap` 6 como "fim" ou o `ind` de `UPGRADES.maquina`.
- **`bot.js`/`carreira.js`:** o bot muda para a Avenida assim que pode e compra sofás, águas e o curso de restaurante quando sobra R$ 400 acima da folha; liga o couvert com a taxa. `DIAS=50` chega à Avenida. Linha `HISTORIA` com os caps. 6 e 7.
- **Calibração** (as Checagens de fim de sessão, com `PONTO=avenida`; meça com `PONTO_CFG` antes de editar `src/`):
  - **Volta do investimento em 5 a 8 dias** (ganho médio por dia na Avenida − o da área industrial ≥ R$ 250, medido com `MUDA=1`, novo no `carreira.js`: o bot muda só para a área industrial). Mais de 8 dias: `cardapio` +0,1 por vez, até 2,3; menos de 4: `aluguel` 450.
  - **0 dias no negativo** nos 5 dias depois da mudança (padrão e `MOVEIS=quatro`). Se houver: o cartão Mudança passa a pedir a mudança **e o 1º aluguel** (R$ 2.400 no caixa; texto "Falta R$ x (a mudança e o 1º aluguel)").
  - Cap. 6 em até 5 dias depois da mudança em 3/3; cap. 7 em até 15 dias em ≥ 2/3. Se o cap. 7 não chegar, `caixa` 4000 (não mexer na nota 3,9).
  - Bot afiado com equipe: 3★ em ≥ 2 de 3 dias; se não, `metaF` 1,5; com folga (todos os dias acima do `expert` em 15%), 1,7. 24 lugares sem perder ninguém: se o afiado perde mais de 1 grupo por dia, `grupos` 0,65.
  - Sem equipe, a mudança **não** compensa (lucro na Avenida ≤ o da área industrial + R$ 40).
- Capturas `tests/shot_v9_1.py` em `capturas/v9_1`: cartão Mudança apagado e aceso, confirmação, salão da Avenida com tudo comprado e 24 lugares, mesa de negócios, VIP, calçada com sofás, águas e flores, couvert, 6 pratos no balcão, parmegiana, fim do dia com o aluguel, conversa do cap. 7, `#ov-continua`, celular deitado.

**Fechamento:** guardar a v9.0.4 em `versoes/`, `vtag`, `VERSAO` 'v9.1', `#ov-ver`, `docs/spec-v9.1.md`, `docs/RESUMO.md`, CLAUDE.md (smoke42, `PONTO=avenida`, `DIAS=50`), PR e merge.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas é um ponto inteiro (cenário, cliente, itens, capítulos), a generalização da mudança mexe em várias partes, e a calibração pode pedir 2 ou 3 rodadas.

### Sessão 3b-2 — O Joca e a Dani confeiteira (v9.2)
**O Joca** (o 2º ajudante, primo da Dani): contratado com salário, só na Avenida (`ponto.nivel >= 3`; no modo dev, em qualquer ponto). Faz **o básico**: as tarefas da lista da Dani **menos o cafezinho** (lixo, pratos sujos, louça, água da espera, marmitas), escolhidas no cartão dele, como as dela.
- `STAFF.joca = { levels:[ null, { speed:0.5, tasks:2, pay:45, xp:0 }, { speed:0.6, tasks:3, pay:60, xp:8 }, { speed:0.75, tasks:4, pay:75, xp:18 } ] }`. Contratar é o nível 1 (R$ 45/dia na folha desde o 1º dia, sem aprendiz). Experiência só do trabalho, como a da Dani: +1 a cada `JOCA_XP.tarefas` (5) tarefas (`save.jocaTar`; só o dia completo conta); o aumento consolida o nível (mesmas regras do Tonhão e da Dani: só com a experiência, e só a falta de dinheiro da folha derruba). Sem cursos.
- Save: `equipe.joca` (0 a 3), `equipe.jocaTasks` (padrão `['lixo','lavar']`), `jocaTar`. `FOLHA_CORTE` corta o aumento do Joca antes do da Dani; sem dinheiro nem para o nível 1, ele não vem naquele dia (como a folha de hoje).
- **Código:** a classe `Helper` (`15-dani.js`) passa a receber quem é (`new Helper(g, 'dani')`, `new Helper(g, 'joca')`): nível, `spec`, tarefas, casa (`JOCA_HOME = { x:640, y:515 }`) e contagem de tarefas por quem. As marcas de "um ajudante já vai pegar" (`p.dani`, `o.dani`, `group.daniCoffee`) guardam quem (`'dani'`/`'joca'`) e cada um respeita a do outro; mesa que o outro ajudante vai limpar e pia com o outro lavando também ficam de fora (`targets`, `washing`). Onde o jogo hoje percorre `[this.bia, this.dani]` (marmitas nas mãos, `16-jogo.js`), entra o Joca.
- **Visual** (sem estereótipo, com crachá como a Dani): rapaz de uns 20 anos, pele parda, cabelo cacheado preto curto, óculos redondos, camiseta cinza com avental azul-marinho e crachá "JOCA", tênis branco. Os níveis 2 e 3 mudam o avental como os da Dani.
- **Lojinha (Equipe):** cartão do Joca ao lado do da Dani, igual ao dela (nível, salário, tarefas, experiência), sem cursos. No Modo História ele abre pelo `LIBERA` (abaixo); fora dele, aberto na Avenida.
- **Conversa** (`LIBERA`, `id:'joca'`): abre a partir do 2º dia na Avenida (`save.pontoDia`, o dia da mudança, novo no save) e garante até o 4º; reclamações: "Mesa suja de novo!", "A lixeira tava transbordando." Falas: Dani "Tio, meu primo Joca tá procurando serviço." / Tonhão "Esse salão é grande demais pra vocês duas, mesmo." / Joca "Lixo, louça, mesa suja: pode deixar comigo!" / Dani "E eu fico livre pra aprender confeitaria!" / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.joca = 'Joca'`, `convCabeca` com o Joca (ao lado da Dani, se ainda não chegou) e cor do nome própria (verde-azulado `#2C7A7B`).

**A Dani confeiteira e as sobremesas:**
- **Vitrine de sobremesas** (Melhorias, `nivel === 3`): **R$ 300**. Estação nova `STATIONS.vitrine`, encostada na parede do fundo entre o salão e a janela de pedidos: `rect:{ x:690, y:92, w:50, h:50 }`, `ap:{ x:714, y:150 }` (se cruzar o caminho, ajuste no recorte). Desenho: vitrine refrigerada com 3 sobremesas (pudim, mousse de maracujá, brigadeiro de colher).
- **Quem pede:** com a vitrine, ao terminar de comer, o grupo pede sobremesa com a chance do tipo (`SOBREMESA.pede = { familia:0.5, vovos:0.6, estudante:0.3, executiva:0.2, negocios:0.4 }`, VIP +0,2; nunca entregador): `randi(1, size)` sobremesas, cada uma sorteada entre as 3. Como o cafezinho do motorista: balão com a sobremesa, a paciência corre (`esperaSuco`) e o grupo só pede a conta depois de receber todas.
- **Servir:** a Bia pega na vitrine (toque na estação; 0,6 s; ocupa mão como bebida, 2 por mão com a bandeja) e leva à mesa; ou a Dani, com a tarefa nova **"Servir sobremesa"** (curto "Doce"), que só existe com o curso de Confeitaria. **R$ 14** cada na conta (`SOBREMESA.preco`; ingrediente R$ 4), **+5 pontos** (`PONTOS_ACAO.doce`) e devolve 1 coração.
- **Curso da Dani "Confeitaria"** (`DANI_CURSOS`, R$ 250, +2 de experiência; só com `nivel >= 3`): abre a tarefa "Servir sobremesa" e as sobremesas passam a ser "da Dani": **R$ 18** cada e +0,25 no Ambiente de quem comeu (`AVAL.amb.doce`). É a especialização: o cafezinho continua nas tarefas dela, e o Joca fica com o básico.
- Gurugol: comentário bom "A sobremesa da casa é uma delícia!", ruim (esperou a sobremesa e perdeu coração) "A sobremesa demorou mais que o almoço."

**Testes:** **`tests/smoke43.js` (novo):** (1) cartão do Joca só na Avenida; contratar põe R$ 45 na folha; (2) ele faz só as tarefas escolhidas, nunca o cafezinho, e não disputa mesa, pia, marmita ou suco com a Dani (os dois ligados num dia: nenhuma mesa limpa duas vezes, nenhum item perdido); (3) experiência pelo trabalho e aumento só com ela; corte da folha tira o aumento dele antes do da Dani; (4) conversa do `LIBERA` no 2º a 4º dia na Avenida; (5) sem vitrine ninguém pede sobremesa; com ela, as chances por tipo (em 300 grupos), o grupo espera a sobremesa para pedir a conta e paga R$ 14 cada; (6) curso de Confeitaria: tarefa nova da Dani, R$ 18, Ambiente +0,25; (7) save da v9.1 sem Joca carrega igual. `bot.js`: o bot serve sobremesa e contrata o Joca na Avenida (`carreira.js` mostra a folha com ele). `balance.js` `PONTO=avenida EQUIPE=auto` com o Joca: o alvo de 85–95% continua; se passar de 95%, `pay` do Joca 55/70/85. Capturas `tests/shot_v9_2.py`: o Joca nos 3 níveis, os dois ajudantes trabalhando, cartão dele, a vitrine, balão da sobremesa, conversa dele.

**Fechamento:** v9.2 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.2.md`, `RESUMO.md`, CLAUDE.md com o smoke43), PR e merge.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas o 2º ajudante mexe na classe da Dani e nos dois não se atrapalharem, que pede depuração com o bot.

### Sessão 3b-3 — Fiscal da vigilância sanitária (v9.3)
- **Quando:** só na Avenida (`nivel >= 3`) e na carreira, do 2º dia no ponto em diante, com chance de **15% por dia** (`FISCAL.chance`), sorteada com o clima (`manut.sorteio`, para não mudar ao rejogar). Nunca na Missão zero nem no Turno sem fim. **Avisado na introdução do dia:** "Dizem que a vigilância sanitária está rondando a Avenida." (sem dizer a hora).
- **A visita:** num momento entre 30% e 70% do turno, o fiscal (`FISCAL`, não é grupo e não ocupa mesa) entra pela porta, anda até o meio do salão e fica **20 s** (`FISCAL.visita`) olhando, com a prancheta; depois sai. Visual: colete azul-claro com "VIGILÂNCIA" escrito, prancheta e caneta; homem ou mulher, sorteado.
- **O que ele confere durante a visita** (cada um é uma falha): (1) alguma mesa ficou **suja por mais de 8 s seguidos**; (2) a **lixeira esteve cheia**; (3) a **pia chegou a 4 pilhas** ou mais. Um ícone pequeno de cada falha aparece em cima dele quando acontece.
- **Resultado** (texto grande no salão quando ele sai): **0 falhas, "Aprovado!"**: selo "Aprovado pela vigilância" na parede por 7 dias (`save.selo`, o último dia do selo), que soma **+0,5 no Ambiente** do Gurugol (`AVAL.amb.selo`) e +30 pontos; **1 falha, "Advertência"**: só o aviso, sem multa; **2 ou 3 falhas, "Multa!"**: **R$ 150** nas contas do dia (linha "Multa da vigilância" no fim do dia e no livro-caixa).
- Gurugol: no dia aprovado, comentário "Vi o selo da vigilância: lugar limpinho!"
- **Testes:** **`tests/smoke44.js` (novo):** (1) não vem na Garagem nem na área industrial; na Avenida, ~15% dos dias em 400 sorteios, e o mesmo sorteio ao rejogar; (2) aviso na introdução; (3) cada falha detectada (mesa suja 8 s, lixeira cheia, pia com 4); (4) 0, 1 e 2 falhas dão selo, advertência e multa; (5) o selo soma +0,5 no Ambiente por 7 dias e some; (6) multa no fim do dia e no livro-caixa; (7) save sem `selo` carrega. `bot.js`: nada novo (só medir). `carreira.js`: quantas visitas e o resultado de cada uma; com o bot comum, a multa não pode passar de 1 em cada 3 visitas (se passar, a mesa suja vira 12 s). Capturas `tests/shot_v9_3.py`: o fiscal no salão com as falhas, o selo, o fim do dia com a multa.
- **Fechamento:** v9.3 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v9.3.md`, `RESUMO.md`, CLAUDE.md com o smoke44), PR e merge. Ao fechar a 3b, arquive a etapa (`ferramentas/arquiva.py`).

**Modelo:** Sonnet, esforço médio. Evento pequeno, com regras e números fechados, que segue o molde do clima e do texto de fim do dia.

---

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: 28 lugares, aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. A confeitaria vem da 3b (a vitrine e a Dani confeiteira). **A coquetelaria entra aqui** (decidido em 31/10: saiu da 3b): balcão de coquetelaria com profissional de drinks contratado e a coquetelaria lá fora, um sistema só; decidir no planejamento da 4a o preço, o salário e quem leva o drink.
- **VIP exigente** (só no Terraço Suíça e no fim da história):
  - pede o **prato da casa**, que só sai caprichado ★ se o Tonhão tiver aumento (ou demora o dobro);
  - às vezes pede uma **bebida específica** (suco ou café) antes do prato;
  - não aceita mesa suja ao sentar;
  - paga muito bem (bônus grande com 5 corações) e, se sair bravo, deixa **avaliação ruim**: −10% de clientes no dia seguinte.
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

**Modelo:** planejar com o Opus antes (as 3 decisões em aberto, regras do prato da casa e da reputação, falas do capítulo); executar com o Sonnet, esforço alto (cliente novo com regras próprias e o desenho do Terraço).

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
- **Bebidas da Dani no Cardápio** (entrevista de 30/10, da etapa 2c-r6): quando o curso de barista da Dani passar a trazer bebidas (cafezinho coado, pingado, cappuccino), os cursos dela que trazem itens entram no cartão Cardápio da lojinha, com o rosto da Dani, ao lado dos do Tonhão; os de Atendimento e Organização da cozinha ficam na seção Dani. Pede etapa própria, com preço, balanceamento e desenho das bebidas.
- **Conta rachada** (pensada com o usuário em 30/10; ficou fora da 3b em 31/10, continua guardada): um jeito de pagar que pode cair em qualquer grupo de colegas (turma, executivas): cada um paga a sua parte, e a Bia leva 2 ou 3 maquininhas em vez de uma conta só. Mais trabalho, mas cada pessoa deixa um pouco de gorjeta. Decidir: a chance, quantas maquininhas, o tempo de cada uma e a gorjeta por pessoa.
- **Cozinheiros da Avenida Brasil e do Terraço Suíça** (pedido do usuário em 30/10, junto com a 2g; texto em `docs/PROPOSTAS.md`): o XP por cursos da 2g vale para a Garagem e a área industrial. Nos restaurantes de luxo o processo de subir o cozinheiro vai ser outro, porque lá não se vende coxinha (os cursos de salgado não fazem sentido). **Na 3b-1 entra o curso "Cozinha de restaurante" (Filé à parmegiana);** o resto fica para a 4a. Decidir na 4a: cursos próprios do ponto (cozinha de restaurante, alta gastronomia), outro cozinheiro além do Tonhão, ou outra fonte de experiência.
- **Especialização e progressão da equipe, ponto a ponto** (pedido do usuário em 31/10, 4 mensagens; texto em `docs/PROPOSTAS.md`). Cada um cresce com o ponto, e o Tonhão faz pratos de alto nível no Terraço depois de vários cursos:
  - **Dani (confeiteira):** já está desde a Garagem como assistente e cresce. Garagem: **confeiteira júnior** (docinhos simples, bolo de pote). Avenida: doces diferentes (shortcake, docinhos gourmet, mais caros). Terraço: os doces mais caros de todos; **o entremet fica para o Terraço** (a ponderar com os preços).
  - **Joca (barista):** **entra já na área industrial** (hoje a 3b-2 o põe na Avenida: ao planejar, decidir se ele vem na 3a ou se a 3b-2 sobe para lá). Avenida: **café** (aprende o grid/o café da Avenida; decidir o nome e o processo). Terraço: **mega barista, cafés top** com vários processos. Na área industrial ele faz o básico até se especializar.
  - **Anselmo (coqueteleiro):** **entra na Avenida Brasil já com habilidade**. História: era o coqueteleiro do restaurante do Bráulio, saiu porque era muito difícil trabalhar lá e achou o novo espaço depois de conversar com o Tonhão (conversa do `LIBERA`, ligada ao Bráulio). No Terraço ganha **vários upgrades** e vira o dos **melhores coquetéis do mundo**.
  - **Cami (atendimento):** terceira assistente para ajudar a Bia no dia a dia; **tão rápida quanto a Bia, ou quase** (o que Dani e Joca não são, porque ainda estão descobrindo a especialidade). Entra no Terraço (a decidir).
  Decidir no planejamento: níveis e salários de cada um, preços dos doces, cafés e coquetéis por ponto, quando a Cami entra, se ela tem upgrade no fim, o que muda na coquetelaria da 4a (o Anselmo a antecipa para a Avenida), visual sem estereótipo. Liga com "Bebidas da Dani no Cardápio" e "Cozinheiros da Avenida Brasil e do Terraço Suíça" (acima).
- Cardápio com preço escolhido pelo jogador (o Arthur achou estranho só mexer em preço; talvez nunca).
