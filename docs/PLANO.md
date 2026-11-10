# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- **Ordem (10/11):** a próxima é a **4a-1** (o Terraço Suíça e a refeição completa), depois 4a-2 a 4a-5 (planejadas em 10/11), 4b, 4c, 6 e 7 (a rever). As revisões R1 (v9.6.12) e R2 (v9.6.13) foram feitas em 10/11, fora da ordem, a pedido do usuário. O histórico da ordem está no fim do `docs/PLANO-FEITO.md`.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| R2 | Menos sustos: "Já vou!", banco sem armadilha e pausa que confirma (análise de frustração) | v9.6.13 | feita em 10/11 (`docs/spec-v9.6.13.md`; `smoke59`) |
| R1 | Revisão geral: Missão zero enxuta, dicas na hora, HUD com estrelas, fim do dia | v9.6.12 | feita em 10/11 (`docs/spec-v9.6.12.md`; `smoke58`; sem mudar números do jogo) |
| 3g-2 | A tela avisa: Gurugol em balões, mesinha das marmitas, eFood e fumaça | v9.6.11 | feita em 02/11 (`docs/spec-v9.6.11.md`; `smoke57`; geladeira fora da tela, mesinha no lugar dela, cheiro só onde a fumaça chega) |
| 4a-1 | O Terraço Suíça e a refeição completa (caps. 8 e 9) | v10 | a fazer (planejada em 10/11) |
| 4a-2 | O VIP exigente e a reputação | v10.1 | a fazer (planejada em 10/11) |
| 4a-3 | A cozinha do Terraço: alta gastronomia, a Lia e a alta confeitaria | v10.2 | a fazer (planejada em 10/11) |
| 4a-4 | O salão e o bar do Terraço: a Cami em tudo, cafés especiais e coquetéis de autor | v10.3 | a fazer (planejada em 10/11) |
| 4a-5 | Música, flores e o rebalanceamento do Terraço | v10.4 | a fazer (planejada em 10/11) |
| 4b | Nível de luxo | v10.5 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.6 | a fazer |
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

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10 a v10.4; 4b, v10.5)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário). A **4a** foi planejada em 10/11 e dividida em 5 sessões (4a-1 a 4a-5); a **4b** (nível de luxo) vem depois.

### 4a — Terraço Suíça: decisões de 10/11 (v10 a v10.4)
> **Planejada em 10/11** (o usuário pediu o planejamento com o Fable e que as decisões fossem tomadas na sessão; registro em `docs/PROPOSTAS.md`). O que estava em aberto ficou assim:
> - **Refeição em tempos:** bebida, entrada, prato principal e sobremesa, com os sistemas que já existem (drinks do Anselmo ou suco, cozinha do Tonhão, doces da Dani). A cozinha faz a entrada e, entregue a entrada, o principal. Cada tempo tem nota; regras na 4a-1.
> - **Cardápio:** ×2,5 (a escada fica 1 / 1,5 / 2 / 2,5; a refeição completa já sobe a conta por mesa). Aluguel R$ 1.000, mudança R$ 5.000, crédito R$ 8.000.
> - **Avaliação do exigente:** pesa mais: ele sempre avalia e a nota dele conta 2 vezes. Bravo, tira 10% do movimento do dia seguinte.
> - **Visual do exigente:** plaquinha dourada com duas estrelas, sem óculos escuros, com chapéu, lenço de seda ou echarpe.
> - **Música:** quarteto de cordas R$ 150/dia; pianista R$ 120/dia mais R$ 30/dia da afinação do piano. Um ou outro; no Terraço não há taxa de couvert.
> - **O piano** já vem com o ponto (fechado, no canto de baixo à esquerda do salão, fora da área das mesas); quem toca chega na 4a-5.
> - **Ajudante de cozinha:** a **Lia**, colega do Tonhão no curso de alta gastronomia.
> - **O Terraço mede pela equipe toda** (Joca, Cami, Anselmo e a confeitaria): é ela que passa ~90% das metas.
> - **Regra da 3f em todas as sessões:** cartão novo da lojinha só com nome, preço e "?"; toda novidade ganha ficha no `MANUAL` (sem números), revelada quando aparece na história.
> Ordem: 4a-1 (o ponto e a refeição completa, v10) → 4a-2 (o VIP exigente e a reputação, v10.1) → 4a-3 (a cozinha: alta gastronomia, a Lia e a alta confeitaria, v10.2) → 4a-4 (o salão e o bar: Cami, Joca e Anselmo, v10.3) → 4a-5 (música, flores e rebalanceamento, v10.4). Cada uma é uma versão, com PR e merge. As "Checagens de fim de sessão" da etapa 3 valem para todas.

### Sessão 4a-1 — O Terraço Suíça e a refeição completa (v10)
**Objetivo:** o topo da escada de pontos. Menos mesas, mais finas: cada mesa come a refeição inteira e fica mais tempo. A sessão tem duas partes, que podem ser feitas em seguida (a versão fecha só no fim da parte B).

#### Parte A — o ponto
**O ponto** (`PONTOS[3]`): `{ id:'terraco', nome:'Terraço Suíça', nivel:4, lugares:20, aluguel:1000, mudanca:5000, credito:8000, cardapio:2.5, area:{ x0:160, y0:150, x1:684, y1:500 }, espera:6, assento:'pe', bebida:null, pratos:6, marmJanela:2, prateleira:0, tipos:{ executiva:0.5, familia:1, vovos:1, negocios:1.5, casal:2 }, vip:2.5, metaF:4.0, expertF:5.0, grupos:0.45, tempos:true, semRetirada:true, traz:'a refeição completa e a freguesia mais fina', art:'o' }`. A Avenida ganha `deixa:'os sofás e as águas saborizadas ficam'`.
- Para chegar: R$ 5.000 e nota 3,9 na Avenida (`avalMinimo`). O cartão Mudança aparece com `save.cap >= 8` (já sai de `mudancaVisivel`); ícone novo `mudanca-te` (um prédio alto com o terraço iluminado no topo); a confirmação segue o texto dos outros pontos, mais a frase "O Terraço tem 20 lugares: as mesas que não couberem são vendidas."
- **Mesas que sobram:** em `trocaPonto`, antes de arrumar, as últimas mesas que passam de `para.lugares` (primeiro as do estoque) são vendidas por `SALAO.venda` do preço (linha do caixa como a venda de mesa do editor). Hoje o `normSalao` as tiraria sem devolver nada.
- **O que sai ao mudar:** os sofás (`up.assento`) e as águas (`up.maquina`), como já faz o `trocaPonto`. **Vão junto:** fogão industrial, mesas, pratos, cursos, equipe (o Anselmo e a Cami seguem), melhorias, decoração (as plantas e as flores dos outros pontos aparecem no foyer), o couvert (até a 4a-5) e o empréstimo.
- **Sem bebida da espera** até a 4a-4 (`bebida:null`): o cartão da melhoria `maquina` não aparece no Terraço e `buy('maquina')` recusa.
- **Sem entregadores nem marmitas** (`semRetirada`): no `buildSchedule`, tipo com `retira` vira `tipoPequeno()` (também na chuva e na sexta-feira); `marmitaOk` falso; o balcão de retirada, a mesinha das marmitas e o letreiro da eFood não aparecem.
- **VIP só de tipo do ponto:** `VIP.types` ganha `casal`; com `ponto.tipos`, o VIP sorteado fora da lista vira um tipo de `VIP.types` que esteja em `ponto.tipos`.
- O que hoje vale "na Avenida" por `nivel >= 3` continua no Terraço (couvert, Anselmo, Cami, vitrine, espresso, flores, o fiscal). O que é só da Avenida passa a `nivel === 3` (sofás em `buildAssento` e `comprarInd`). O aviso do fiscal vira "Dizem que a vigilância sanitária está por perto." O que o desenho faz só com `avenida(g)` e também vale aqui (flores, balcão de drinks, vitrine, máquina de espresso, pratos) passa a valer nos dois.

**Cliente novo: Casal** (`casal`, só no Terraço): `{ label:'Casal', pat:1.3, eat:[8,10], read:[4,5.5], size:[2,2], mais:0.2, tip:0.15 }`, `GOSTOS.casal = [4, 1, 2, 1, 1]`, `DOCES.pede.casal = 0.6`, `CAFES.pede.casal = 0.5`, `DRINKS.pede.casal = 0.6`. Visual: duas pessoas adultas, em pares variados (de qualquer gênero, idade e cor de pele), com roupa de sair (vestido, camisa de cor forte ou blazer) e uma flor na lapela ou no cabelo de uma delas. Comentário próprio na Agilidade (`AVAL_CRIT.tipo`): bom "Data especial do jeitinho que a gente sonhou!", ruim "Era pra ser uma data especial...".

**Foyer e poltronas:** a calçada vira o foyer do andar. `TERRACO = { poltrona:{ nome:'Poltronas do foyer', cost:600, slow:0.35 }, piano:{ x0:28, y0:404, x1:148, y1:520 } }`; `up.assento = 'poltrona'` (compra única, só com `nivel === 4`, em `comprarInd` e `buildAssento`); `assentoSlow('poltrona')` = 0,35. Sem as poltronas, espera-se de pé, sobre tapetes redondos numerados.

**O piano de cauda** vem com o ponto: preto, fechado, com a banqueta, no canto de baixo à esquerda do salão (`TERRACO.piano`, fora da `area`). É obstáculo fixo dos caminhos: entra em `setObst` nos dois lugares que o chamam (`buildTables` e `salaoCaminho`) e aparece no editor do salão.

**Visual** (`21-cenario.js`, `terraco(g)` ao lado de `avenida(g)`): piso de mármore claro em placas grandes, com veio suave e friso escuro; parede com um janelão de ponta a ponta mostrando a cidade lá embaixo (prédios pequenos, morros ao longe, céu de fim de tarde em degradê), cortinas presas dos lados e colunas finas; pendentes dourados. No foyer: carpete azul-petróleo com borda dourada, lambri de madeira com arandelas, o letreiro **"Terraço Suíça"** em letras douradas e a plaquinha "Cobertura" no lugar do número da rua; no lugar da rua e do meio-fio, a parede do corredor com a **porta do elevador** (duas folhas de metal e o mostrador do andar em cima), onde a freguesia chega e sai (`DOOR`); sem toldo. Poltronas individuais de veludo verde-garrafa, uma ilha por lugar de espera. Mesas de madeira escura com cadeiras estofadas de encosto alto, na cor da cadeira. `prefers-reduced-motion` como nos outros pontos.

**Manual:** `p-terraco` ("Terraço Suíça", "O topo da cidade: poucas mesas e refeição completa, do drink à sobremesa."), `c-casal` ("Casal", "Data especial: sem pressa, e a conta é generosa."), `MANUAL_PONTO_NOME.terraco`; a ficha `l-assento` já cobre as poltronas.

#### Parte B — a refeição completa
`TEMPOS = { entrada:{ cook:0.6, eat:0.5 }, porCoracao:1, semSobremesa:1, semBar:0.5, pts:30 }`; `PONTOS_ACAO.completa = 30`. Vale para todo grupo de mesa em ponto com `tempos` (`grp.tempos`; só na carreira).
- **O pedido:** cada pessoa pede uma **entrada** (o "2º item" de hoje, `pedePrato(tipo, game, true, veg)`, agora sempre) e um **prato principal** (da categoria `pf`: PF, PF vegetariano, parmegiana; função nova `pedePrincipal`). `grp.extras` são as entradas e `grp.dishes` os principais; a conta soma os dois, como hoje.
- **Bebida:** com o Anselmo no dia, um drink por pessoa (sem sorteio) e ninguém pede suco; sem ele, um suco por pessoa (o balcão de sucos de sempre).
- **Sobremesa:** com a confeitaria (`up.confCaseira`), um doce por pessoa ao terminar o principal (sem sorteio); sem ela, não há sobremesa. O café do Joca segue como hoje (por chance, depois da sobremesa).
- **Cozinha:** a comanda vira dois pedidos em sequência. Ao chegar a comanda entra o da **entrada** (`tempo:0`): tempo de cozinha × `TEMPOS.entrada.cook`, sem o ×VIP e sem o `MAIS.cozinha`; ocupa vaga do balcão mas **não gasta prato limpo**; ingrediente: `INGRED.prato` do valor das entradas. Quando a entrada chega à mesa, o grupo come por `eat` × `TEMPOS.entrada.eat` e a cozinha recebe sozinha o do **principal** (`tempo:1`): tempo normal, com o ×VIP, gasta prato limpo, ingrediente sobre o valor dos principais (mais o `VIP.dish`); ele entra na fila **na frente das entradas que ainda não começaram**. Acabada a entrada, o grupo volta a `ordered` (`grp.tempo = 1`) e espera o principal com a paciência de sempre. Depois do principal: sobremesa, café e bebida que faltar (`esperaSuco`), e a conta. O prato na mão (da Bia ou da Cami) leva o `tempo`; a Cami em "Minhas mesas" serve os dois tempos.
- **Nota de cada tempo** (1 a 5; `null` se a casa não serve): entrada e principal = a nota do prato (`q`, com o frio) menos `TEMPOS.porCoracao` por coração perdido esperando aquele tempo; bebida = 5 menos 1 por coração perdido só à espera dela, e menos 1 se ela chegou depois do principal; sobremesa = 5 menos 1 por coração perdido esperando (`perdDoce`).
- **Gurugol no Terraço** (os 5 critérios continuam): **Qualidade da comida** = a média das notas dos tempos servidos; **Agilidade** como hoje (os corações perdidos na mesa, entre um tempo e outro); **Diversidade do cardápio** = `avalMenu` menos `TEMPOS.semSobremesa` sem a confeitaria e menos `TEMPOS.semBar` sem o Anselmo no dia. Comentários novos (40% das vezes, no lugar do comum): tudo servido e nota 4 ou mais, "Do drink à sobremesa, tudo no tempo certo!" ou "Refeição completa de verdade!"; coração perdido esperando o principal, "Um tempão entre a entrada e o prato."; sem sobremesa, "Faltou a sobremesa para fechar."; sem o Anselmo, "Faltou uma carta de drinks."
- **Refeição completa:** o grupo que paga tendo recebido bebida, entrada, principal e sobremesa conta em `stats.completas`, ganha `TEMPOS.pts` pontos e o texto "Refeição completa!" com faíscas. O fim do dia mostra a linha "Refeições completas: N" (só no Terraço).
- **Trilha dos tempos** (o balão em tempos, sem texto): sob os corações da mesa, 4 marcas pequenas em fila (bebida, entrada, principal, sobremesa). Pendente: contorno cinza; a da vez: pulsa; servida: cheia, verde (nota 4 ou mais), amarela (2,5 ou mais) ou vermelha; o que a casa não serve: um tracinho. O balão da mesa mostra o prato do tempo da vez (entrada ou principal), como hoje. Uma função pura `tempoMarcas(grp)` devolve o estado das 4 marcas (o desenho e o smoke usam). Parado com `prefers-reduced-motion`.
- **Manual:** `b-tempos` (aba Básico; "Refeição completa", "No Terraço, cada mesa pede bebida, entrada, prato e sobremesa. Cada tempo conta no Gurugol."), revelada no 1º dia no Terraço.

**Capítulos** (`HISTORIA`, `ponto:'terraco'`; o cap. 8 começa na mudança, como o 4 e o 6; `save.cap = 10` = Terraço completo). O `fim` do cap. 7 passa a `{ h:'Fim dos capítulos da Avenida Brasil', p:'Quando quiser, a mudança para o Terraço Suíça está na lojinha.' }`.
- **Cap. 8, "Lá no alto"** — `obj:{ azul:3 }`.
  - Antes: Bia "Último andar, tio! Dá pra ver a cidade inteira." / Tonhão (olhando o piano no canto) "E esse piano de cauda?" / Bia "Veio com o ponto. Um dia a gente acha quem toque." / Tonhão "Aqui ninguém vem com pressa. Vem pra comer do começo ao fim: bebida, entrada, prato e sobremesa." / Dani "E cada pedacinho vai parar no Gurugol!"
  - Depois: Bia "Três dias no azul pagando esse aluguel!" / Tonhão "Menos mesa, mais capricho. É outra cozinha." / Dani "Hoje uma mesa bateu palma pra sobremesa!"
- **Cap. 9, "Do começo ao fim"** — `obj:{ completas:6, nota:4.5 }`: 6 refeições completas e a nota no mesmo dia, no molde das marmitas do cap. 5 (`save.capComp` e `capFeito`; texto do `capObj`: "6 refeições completas e nota 4,5 no mesmo dia (hoje: N completas, nota X)").
  - Antes: Tonhão "Refeição completa é como música: não pode faltar nota." / Bia "Bebida, entrada, prato e sobremesa, sem ninguém esperando entre um e outro." / Dani "Se faltar a sobremesa, eu choro."
  - Depois: Bia "Nota 4,5, tio! No Terraço Suíça!" / Tonhão (guardando o pote de cominho) "Sabe quem ligou? O Bráulio. Disse que o Michelzão anda rondando a cidade." / Bia "O guia das estrelas?" / Tonhão "Ele mesmo. Dizem que o crítico chega sem avisar." / Dani "Então é deixar tudo brilhando!"
  - `fim:{ h:'Fim dos capítulos do Terraço Suíça', p:'Continua na próxima versão: o crítico do Michelzão.' }`.

**Partes:** `10-constantes.js` (`PONTOS[3]`, `TERRACO`, `casal`, `GOSTOS`, `VIP.types`, `TEMPOS`, `pedePrincipal`, `PONTOS_ACAO`, `AVAL_CRIT.tipo`, `HISTORIA` caps. 8 e 9 e o `fim` do 7, `MANUAL`, `FISCAL.aviso`, `assentoSlow`); `11-base.js` (obstáculo fixo); `12-clientes.js` (`Group`: tempos, entradas, bebida, sobremesa, notas; `normSave`); `13-cozinha.js` (os dois pedidos, prato limpo, ingrediente, a fila); `14-bia.js` e `15-dani.js` (o `tempo` no prato da mão); `16-jogo.js` (`buildSchedule`, `trocaPonto` e a venda das mesas, `comprarInd`, `entregaPrato`, `collectBill`, `avaliar`, `capObj`, `finishDay`, `marmitaOk`); `20-desenho-base.js` (o casal); `21-cenario.js` (o Terraço, o foyer, o elevador, as poltronas, o piano); `22-salao-hud.js` (a trilha dos tempos, o balão da entrada); `23-render.js`; `40-interface.js` (rótulo "História · cap. 8, Lá no alto · dia N" e "Terraço Suíça completo"); `41-lojinha.js` (ícone e cartão da Mudança, poltronas, sem o cartão da bebida); `42-resultados.js` (a linha das completas); `43-telas.js` (`contTexto`).

**Testes:**
- **`tests/smoke60.js` (novo):** (1) na Avenida com `cap` 7 não há cartão Mudança; com `cap` 8 aparece, apagado sem R$ 5.000 ou sem nota 3,9 (cada um); (2) mudar: −R$ 5.000, `ponto:'terraco'`, sofás e águas fora, fogão industrial, plantas, equipe e cursos ficam, a 6ª mesa vendida pela metade, 20 lugares com arranjo válido, 6 vagas de prato, `cap` 8 com `conversa:'antes'`; (3) aluguel R$ 1.000 e preços ×2,5 (PF R$ 63); (4) clientela: em 300 grupos o casal aparece e não vem estudante, entregador, turma, motorista nem encomenda, nem com chuva e sexta-feira; VIP só de tipo do ponto; `marmitaOk` falso; (5) poltronas R$ 600, espera 35% mais devagar; o sofá não se compra no Terraço; `buy('maquina')` recusa; (6) o piano é obstáculo e o caminho da fila até uma mesa dá a volta; (7) o grupo do Terraço tem entrada para todos e principal da categoria PF, e a conta é a soma; (8) cozinha: o pedido da entrada (×0,6, sem gastar prato limpo), o principal só depois da entrada entregue e na frente das entradas na fila, ingrediente dividido, os estados `ordered → eating → ordered → eating`; (9) bebida: com o Anselmo, um drink por pessoa e nenhum suco; sem ele, um suco por pessoa; sobremesa: um doce por pessoa com a confeitaria, nenhum sem ela; (10) notas: coração perdido esperando o principal tira 1 dele; bebida depois do principal tira 1; no Gurugol a comida é a média dos tempos e o cardápio perde 1 sem sobremesa e 0,5 sem o Anselmo; (11) refeição completa: `stats.completas`, +30 pontos, `tempoMarcas`; (12) na Avenida nada muda (grupo sem `tempos`, a mesma conta de antes); (13) cap. 8 com 3 dias no azul avança; cap. 9 com 6 completas e nota 4,5 no mesmo dia cumpre, `cap` 10 e o cartão de fim; (14) save da v9.6.13 na Avenida com `cap` 8 fica "à espera" e carrega igual; Manual com `p-terraco`, `c-casal` e `b-tempos`.
- Ajustar os smokes antigos que esperam 3 pontos, `cap` 8 como fim, o texto do `#ov-continua` da Avenida, `proximoPonto` nulo na Avenida ou o aviso do fiscal (só o valor esperado, sem relaxar a conferência).
- **`bot.js`, `balance.js` e `carreira.js`:** o bot serve os dois tempos, muda para o Terraço assim que pode e compra as poltronas. `PONTO=terraco node balance.js` joga os dias 8 a 10 no Terraço (5 mesas de 4, fogão industrial, poltronas, couvert com taxa, curso de restaurante, Tonhão nível 4; as chaves `JOCA`, `ESPRESSO`, `CAMI`, `ANSELMO` e `GOURMET` como na Avenida). `DIAS=65 node carreira.js` chega ao Terraço; `MUDA=2` para na Avenida; a linha `PONTOS` mostra o Terraço e o ganho; a linha `HISTORIA`, os caps. 8 e 9.
- **Calibração** (meça com `PONTO_CFG` antes de editar `src/`; "equipe toda" = `EQUIPE=auto JOCA=4 ESPRESSO=1 CAMI=3 ANSELMO=1 GOURMET=1`):
  - **`grupos`:** o bot afiado com a equipe toda perde no máximo 1 grupo por dia em média. Perde mais: 0,40, depois 0,35. Mesas vazias em mais de 30% do turno (`DBGF=1`): 0,50.
  - **`metaF` e `expertF`** como na 3b-7 (`DUMP=1`, 80 dias): `metaF` para a equipe toda passar ~90% das metas; `expertF` para a 3★ do bot afiado ficar em ~60%. Anote também o `EQUIPE=auto` sozinho (deve ficar abaixo: quem não está pronto sofre).
  - **Ganho sobre a Avenida** (`DIAS=65`, contra `MUDA=2`, com a equipe toda): entre R$ 300 e R$ 700 por dia. Abaixo de 300: `cardapio` +0,1 por vez, até 2,8. Acima de 700: `aluguel` 1.200; depois `cardapio` −0,1 por vez, até 2,3.
  - **0 dias no negativo** nos 5 dias depois da mudança. Se houver: o cartão Mudança passa a pedir a mudança e o 1º aluguel (R$ 6.000; "Falta R$ x (a mudança e o 1º aluguel)").
  - Cap. 8 em até 5 dias depois da mudança em 3/3; cap. 9 em até 15 dias em pelo menos 2/3. Se o 9 não chegar: `completas` 5, depois 4; ainda não, `nota` 4,3.
- Capturas `tests/shot_v10.js` em `capturas/v10`: cartão Mudança apagado, aceso e na confirmação; o salão do Terraço com 5 mesas, o piano e a vista; o foyer com e sem as poltronas, o elevador e as flores; mesa de casal; VIP; a trilha dos tempos em 3 momentos (entrada no balão, principal, tudo servido); "Refeição completa!"; fim do dia com o aluguel e as completas; conversa do cap. 8; `#ov-continua`; lojinha (Melhorias, Decoração, Equipe) no Terraço; celular deitado.

**Fechamento:** guardar a v9.6.13 em `versoes/`, `vtag`, `VERSAO` 'v10', `#ov-ver`, `docs/spec-v10.md` (com os números medidos), `docs/RESUMO.md`, `docs/TESTES.md` e `CLAUDE.md` (`smoke60`, `PONTO=terraco`, `DIAS=65`, `MUDA=2`), `docs/PARTES.md`, PR e merge.

**Modelo:** Sonnet, esforço alto. Tudo decidido, mas é um ponto inteiro com uma regra nova que passa por cliente, cozinha, mãos, nota e desenho, e a calibração pede 2 ou 3 rodadas.

### Sessão 4a-2 — O VIP exigente e a reputação (v10.1)
**Objetivo:** o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais". No Terraço, todo VIP é exigente (`PONTOS[3].exigente = true`; `grp.exigente`).

`EXIGENTE = { tip:0.2, generosa:0.2, casa:{ preco:40, cook:2, cookBom:1.3, nivel:3 }, sujaT:6, peso:2, bravoMov:0.9, rep:[0.6, 1.4] }`.
- **Visual** (sem estereótipo): sem os óculos escuros do VIP; plaquinha dourada com **duas estrelas** e, em cada pessoa, um acessório sorteado (chapéu de aba, lenço de seda no pescoço ou echarpe), em cores variadas; gente de várias idades, cores e gêneros.
- **Prato da casa** no lugar do prato especial: soma `casa.preco` à conta (em vez do `VIP.dish`) e o principal leva `casa.cook` × o tempo. Com o Tonhão no nível 4 ou 5 (`equipe.tonhao >= casa.nivel`), leva `casa.cookBom` × e sai sempre caprichado. No balão e na mão, o prato leva uma estrelinha dourada; na entrega, "Prato da casa!".
- **Bebida primeiro:** se a entrada chegar antes de toda a bebida da mesa, ele perde 1 coração e diz "E a minha bebida?" (uma vez por grupo).
- **Salão em ordem:** ao sentar, se houver no salão uma mesa suja há mais de `sujaT` segundos, ele não ganha o coração de sentar, perde 1 e diz "Que salão bagunçado!". Cada mesa passa a contar há quanto tempo está suja (`t.sujaT`, que a 4a-4 também usa).
- **Paga bem:** a gorjeta dele é `tip` (em vez do `VIP.tip`) e, com 5 corações, mais `generosa` da conta, com o texto "Gorjeta generosa!", além dos pontos do VIP satisfeito.
- **Sempre avalia** (não entra no sorteio dos 4 do dia) e a avaliação conta `peso` vezes na lista do Gurugol. Comentários próprios (metade das vezes): bom "Impecável. Voltarei." ou "Serviço à altura do endereço."; ruim "Esperava mais de um terraço." ou "Não é para tanto."; bravo "Inaceitável!".
- **Saiu bravo:** `save.exigBravo` guarda o dia; no dia seguinte vêm `bravoMov` dos grupos, com o aviso na introdução "Um cliente exigente saiu bravo ontem: hoje vem menos gente."
- **Reputação:** no Terraço, a chance de VIP do dia é multiplicada por um fator que vai de `rep[0]` (nota 1) a `rep[1]` (nota 5), em linha reta pela nota do Gurugol; sem nota, 1.
- **Louça fina** (`UPGRADES`: `{ id:'louca', name:'Louça fina', cost:600, nivel:4 }`; o campo `nivel` das melhorias é novo: só aparece no ponto desse nível em diante): o prato da casa e o prato especial ficam 25% mais rápidos (`LOUCA = { cook:0.75 }`) e o Ambiente ganha `AVAL.amb.louca = 0.5`.
- **Conversa** (`HIST_EXIGENTE`, no fim do 1º dia em que um exigente veio; `save.convExig`: 0, 'pend' ou 1; só no Modo História): Bia "Tio, viu a plaquinha de duas estrelas naquela mesa?" / Tonhão "Cliente exigente. Quer a bebida antes da entrada, o salão em ordem e o prato da casa." / Bia "E se ele gostar?" / Tonhão "Paga como ninguém. Se sair bravo, a cidade inteira fica sabendo."
- **Manual:** `c-exigente` (aba Clientes; "VIP exigente", "Duas estrelas na plaquinha. Quer tudo no lugar e paga muito bem."; traços: "pede o prato da casa", "bebida antes da entrada", "repara em mesa suja", "sempre avalia no Gurugol", "gorjeta ótima"), revelada quando o 1º chega (`save.exigVisto`); `l-louca` ("Louça fina", "O prato da casa sai mais rápido, e a mesa fica mais bonita.").

**Partes:** `10-constantes.js` (`EXIGENTE`, `LOUCA`, `UPGRADES`, `AVAL.amb`, `HIST_EXIGENTE`, `MANUAL`), `12-clientes.js` (o modificador, a conta, `normSave`), `13-cozinha.js` (o prato da casa), `16-jogo.js` (sentar, entrega, conta, avaliação com peso, o dia seguinte, a reputação no `buildSchedule`, `t.sujaT`), `19-conversa.js`, `20-desenho-base.js` (acessórios e a plaquinha de duas estrelas), `22-salao-hud.js` (a estrelinha no prato), `41-lojinha.js` (a Louça fina), `43-telas.js` (o aviso do dia).

**Testes:** **`tests/smoke61.js` (novo):** (1) no Terraço o VIP é exigente e na Avenida não; (2) prato da casa: +R$ 40, ×2 com o Tonhão abaixo do nível 4 e ×1,3 e caprichado do 4 em diante; com a Louça fina, 25% mais rápido; (3) entrada antes da bebida: −1 coração, uma vez só; (4) mesa suja há mais de 6 s ao sentar: −1 coração; há menos, nada; (5) gorjeta 20% e mais 20% com 5 corações; (6) sempre avalia e a nota entra 2 vezes; (7) bravo: o dia seguinte tem 10% menos grupos e o aviso; (8) reputação: com nota 5, mais VIPs que com nota 3 (em 400 grupos); (9) Louça fina só no Terraço, +0,5 no Ambiente; (10) a conversa no fim do dia do 1º exigente; (11) save da v10 carrega igual. `bot.js`: leva a bebida do exigente antes da entrada quando ela já está pronta e não o senta com mesa suja velha. `PONTO=terraco node balance.js` com a equipe toda: o alvo de 85–95% continua; abaixo de 85%, `vip` 2,0; acima de 95%, `metaF` +0,2 por vez. Capturas `tests/shot_v10_1.js`: mesa de exigente (plaquinha e acessórios), o prato da casa no balão, "E a minha bebida?", "Gorjeta generosa!", a Louça fina na lojinha, a conversa, a ficha do Manual.

**Fechamento:** v10.1 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v10.1.md`, `RESUMO.md`, `TESTES.md`), PR e merge.

**Modelo:** Sonnet, esforço alto. Regras fechadas, mas é um modificador de cliente que mexe em sentar, cozinha, conta, nota e no dia seguinte.

### Sessão 4a-3 — A cozinha do Terraço: alta gastronomia, a Lia e a alta confeitaria (v10.2)
**Objetivo:** "lá não se vende coxinha": os cursos do Terraço trocam o cardápio por pratos finos, a cozinha ganha uma ajudante e a Dani chega ao topo dos doces.

- **Cursos do Tonhão** (`CURSOS`, `nivel:4`):
  - `{ id:'entradas', nome:'Entradas finas', preco:600, nivel:4, pratos:['bruschetta', 'bacalhau', 'quiche'], av:{ nome:'Entradas de chef', preco:900, receita:'bruschetta de tomate confitado, bolinho de bacalhau cremoso e quiche de alho-poró na massa folhada', pratos:['bruschetta', 'bacalhau', 'quiche'] } }`
  - `{ id:'alta', nome:'Alta gastronomia', preco:900, nivel:4, pratos:['risoto', 'peixe', 'medalhao'], av:{ nome:'Menu do chef', preco:1400, receita:'risoto de cogumelos frescos, peixe do dia na manteiga de ervas e medalhão ao molho madeira', pratos:['risoto', 'peixe', 'medalhao'] } }`
  - `CARDAPIO` (todos com `fino:true`): `bruschetta` ("Bruschetta", 14, `chapa`, sem carne, `veg`), `bacalhau` ("Bolinho de bacalhau", 16, `frito`), `quiche` ("Quiche de alho-poró", 15, `assado`, sem carne, `veg`), `risoto` ("Risoto de cogumelos", 38, `pf`, sem carne, `veg`), `peixe` ("Peixe do dia", 42, `pf`), `medalhao` ("Medalhão ao molho madeira", 46, `pf`). No Terraço: R$ 35, 40 e 38; R$ 95, 105 e 115.
  - **Regra do prato fino:** em ponto de nível 4, se a cozinha sabe alguma entrada fina, a entrada é sorteada só entre as finas (peso: o gosto do tipo pela categoria, mais 1); o mesmo vale para o principal. Contam na experiência do Tonhão e na Diversidade do cardápio como os outros cursos. Desenhos dos 6 pratos no estilo das artes da v8.6.10.
- **Lia, a ajudante de cozinha:** `STAFF.lia = { pay:80, cook:0.75 }`; `equipe.lia` (0 ou 1; contratar é definitivo, como o Anselmo); só no Terraço (`nivel >= 4`; no modo dev, em qualquer ponto). Com ela no dia, todo pedido da cozinha leva `cook` × o tempo. `FOLHA_CORTE`: **a Lia não vem** (`liaFora`), logo depois das TVs e antes do Anselmo; `payroll`, `folhaItens` e `normEquipe` contam ela.
  - Visual (com crachá "LIA"): mulher de uns 30 anos, pele parda, cabelo crespo preso num coque alto sob um lenço amarelo-mostarda, dólmã branca de mangas dobradas e avental cinza. Fica na cozinha, ao lado do Tonhão, mexendo uma panela (parada com `prefers-reduced-motion`).
  - Cartão em Equipe, ao lado do Anselmo: nome, salário e "A cozinha anda mais rápido". Abre pelo `LIBERA` (`id:'lia'`, `nivel:4`, `dia:1`, `ate:999`; gatilho: o Tonhão fez o básico de `entradas` ou de `alta`; reclamações "A comida demorou entre um prato e outro." e "Cozinha lenta para um terraço."). Falas: Tonhão (secando as mãos no avental) "Bia, no curso tinha uma moça que cortava cebola mais rápido que eu." / Bia "Mais rápido que o senhor? Duvido." / Tonhão "A Lia. Tá procurando cozinha pra trabalhar. Com mais duas mãos, a entrada e o prato saem juntinhos." / Lia "O chef Tonhão me falou do terraço. Onde eu guardo as facas?" / Bia "Tá na lojinha, em Equipe." `HIST_NOMES.lia = 'Lia'`, cor do nome verde-oliva `#5E7A3A`, `convCabeca` com ela.
  - Manual: `e-lia` ("Lia", "Ajudante de cozinha: com ela, tudo sai mais rápido."; traço "cozinha mais rápida").
- **Dani, curso "Alta confeitaria"** (`DANI_CURSOS`: `{ id:'confAlta', nome:'Alta confeitaria', preco:600, nivel:4, dep:'confGourmet', item:true }`): `DOCES.alta = [ { id:'entremet', nome:'Entremet de chocolate' }, { id:'milfolhas', nome:'Mil-folhas' }, { id:'macaron', nome:'Macarons' } ]`, `altaPreco:30`, `altaIngred:7`; com `up.confAlta` os doces da vitrine passam a ser esses, e quem comeu dá `AVAL.amb.doceAlta = 0.4` no Ambiente (no lugar do 0,25). Comentário: "O entremet da casa é de outro mundo!". 3 ícones novos de doce.

**Partes:** `10-constantes.js` (`CARDAPIO`, `CURSOS`, a regra do fino no `pedePrato` e no `pedePrincipal`, `STAFF.lia`, `FOLHA_CORTE`, `LIBERA`, `HIST_NOMES`, `DANI_CURSOS`, `DOCES`, `AVAL.amb`, `MANUAL`), `12-clientes.js` (`normEquipe`), `13-cozinha.js` (o tempo com a Lia), `16-jogo.js` (`setStaff`, folha, `buyDaniCurso`), `19-conversa.js` e `26-conversa.js`, `20-desenho-base.js` (6 pratos e 3 doces), `21-cenario.js` (a Lia na cozinha), `41-lojinha.js` (cursos, cartão da Lia), `42-resultados.js`.

**Testes:** **`tests/smoke62.js` (novo):** (1) os dois cursos só no Terraço; preços no ponto; (2) com `entradas`, a entrada só sai entre as finas; com `alta`, o principal; sem eles, como antes; o vegetariano acha opção nos dois; (3) experiência do Tonhão e Diversidade contam os cursos novos; (4) a conversa da Lia no fim do dia do curso; contratar: R$ 80 na folha, cozinha 25% mais rápida; é a primeira da equipe a não vir no corte; só no Terraço; (5) Alta confeitaria: depende da gourmet, doces a R$ 30, +0,4 no Ambiente; (6) save da v10.1 carrega igual. `bot.js`: compra os cursos (entradas, alta, alta confeitaria) e contrata a Lia quando sobra dinheiro acima da folha. `PONTO=terraco node balance.js` ganha as chaves `ALTA=1` (os dois cursos e a alta confeitaria) e `LIA=1`; anote o que cada uma soma; o alvo da equipe toda só se recalibra na 4a-5. Capturas `tests/shot_v10_2.js`: os 6 pratos e os 3 doces (no balcão, na mesa e no cartão Cardápio), a Lia na cozinha, o cartão dela, a conversa.

**Fechamento:** v10.2 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v10.2.md`, `RESUMO.md`, `TESTES.md`), PR e merge.

**Modelo:** Sonnet, esforço médio. Segue os moldes do curso de restaurante, do cartão do Anselmo e da confeitaria gourmet, com números e textos fechados; o trabalho maior são os desenhos.

### Sessão 4a-4 — O salão e o bar do Terraço: a Cami em tudo, os cafés do Joca e os coquetéis de autor (v10.3)
**Objetivo:** o topo de cada ajudante do salão (entrevista de 31/10).

- **Cami, curso "Atendimento de salão"** (`CAMI_CURSOS`: `{ id:'salao', nome:'Atendimento de salão', preco:900, nivel:4, dep:'mesa' }`): nível 4, `STAFF.cami.levels[4] = { speed:1.35, tasks:4, pay:190, mesas:true, tudo:true }`, e o modo **"Ajuda em tudo"** (`equipe.camiModo = 'tudo'`; o cartão passa a ter 3 botões: "Tarefas", "Minhas mesas" e "Ajuda em tudo"). Nesse modo ela faz, em **qualquer mesa**, o que a Bia não pegou: anota o pedido, leva o prato pronto, cobra a conta e recolhe a louça, mas só o que espera há `CAMI_TUDO.espera` (3 s) ou mais e não está na fila de ações da Bia (`grp.stateT`, `p.age` e `t.sujaT`). A Bia continua podendo pegar qualquer prato (o "É da Cami!" só vale para o prato que a Cami já está indo buscar). O básico da casa volta para o Joca (ou a Dani), como em "Minhas mesas".
- **Joca, curso "Cafés especiais"** (`JOCA_CURSOS`: `{ id:'cafesEsp', nome:'Cafés especiais', preco:600, nivel:4, dep:'espresso', item:true }`): `CAFES.metodos = [ { id:'coado', nome:'Coado no filtro', preco:20, prep:2.5, etapas:2 }, { id:'prensa', nome:'Prensa francesa', preco:20, prep:3.5, etapas:3 }, { id:'coldbrew', nome:'Cold brew', preco:20, prep:1, etapas:1 } ]`, ingrediente R$ 5. Com `up.cafesEsp`, os pedidos de café passam a ser esses. As etapas (moer, passar ou prensar, servir) aparecem como marcas no anel de progresso da bancada enquanto o café é feito; a bancada ganha o filtro, a prensa e a jarra. 3 ícones novos de café. Comentário: "Nunca tomei um coado assim!".
- **Anselmo, dois cursos** (`ANSELMO_CURSOS`, um por dia, `save.anselmoCursos` e `anselmoCursoDia`; no cartão dele, no lugar de "Cursos no Terraço Suíça"):
  - `{ id:'classica', nome:'Coquetelaria clássica', preco:500, nivel:4 }`: o balcão passa a ter 4 vagas de copo e o preparo fica 20% mais rápido.
  - `{ id:'autor', nome:'Coquetelaria de autor', preco:800, nivel:4, dep:'classica', item:true }`: ele sobe para o nível 3 (`speed` 1,0, R$ 130/dia); os drinks passam a ser os de autor, a **R$ 35** (ingrediente R$ 9): **"Neblina da Serra"** (branco-azulado, com fumacinha), **"Jardim do Terraço"** (rosa, com flor) e **"Ouro da Casa"** (dourado, com raspa de laranja); e o foyer ganha o **carrinho de boas-vindas**, a bebida da espera do Terraço: `PONTOS[3].bebida = 'coquetel'`, `BEBIDA_ESPERA.coquetel = { preco:18, ingred:5, prep:3, take:0.5, fim:'Coquetéis de boas-vindas' }` (frases no molde das águas: "Um coquetel, por favor!"), ligado pelo curso (`up.maquina`) e servindo só nos dias em que o Anselmo vem. O carrinho fica no alto do foyer, onde nos outros pontos fica o balcão de retirada (a estação `maquina` muda de lugar no Terraço: `rect:{ x:-94, y:98, w:90, h:80 }`, `ap:{ x:16, y:156 }`). Nomes inventados, sem dizer se têm álcool.
- Os cursos com item (cafés especiais, coquetelaria de autor) ficam no cartão Cardápio com o rosto de quem faz e contam na Diversidade (`cursosItem`).
- **Manual:** as fichas `e-cami`, `e-joca` e `e-anselmo` ganham o que mudou (linha da Cami: "Garçonete de rodízio: com cursos, cuida das mesas dela ou ajuda em todas."); `l-maquina` cita o coquetel de boas-vindas.

**Partes:** `10-constantes.js` (`CAMI_CURSOS`, `STAFF.cami`, `CAMI_TUDO`, `JOCA_CURSOS`, `CAFES`, `ANSELMO_CURSOS`, `DRINKS`, `BEBIDA_ESPERA`, `PONTOS[3].bebida`, a estação no Terraço, `MANUAL`), `12-clientes.js` (`normEquipe`, `normSave`), `14-bia.js`, `15-dani.js` (o modo "Ajuda em tudo", `donoBasico`), `16-jogo.js` (`setCamiModo`, `buyAnselmoCurso`, a fila dos drinks, a bebida da espera), `20-desenho-base.js` (3 cafés e 3 drinks), `21-cenario.js` (a bancada dos cafés, o carrinho do foyer), `22-salao-hud.js` (balões), `41-lojinha.js` (cartões).

**Testes:** **`tests/smoke63.js` (novo):** (1) "Atendimento de salão" só no Terraço e depois do "de mesa"; nível 4, R$ 190; (2) em "Ajuda em tudo" a Cami anota, serve, cobra e recolhe em mesa não marcada, só depois de 3 s e nunca o que está na fila da Bia; a Bia pega prato de qualquer mesa; o básico fica com o Joca; (3) cafés especiais: depende do espresso, R$ 20, o tempo de cada método; (4) clássica: 4 vagas e preparo 20% mais rápido; autor: depende da clássica, nível 3 e R$ 130 na folha, drinks a R$ 35; (5) o carrinho: só com o curso e com o Anselmo no dia, R$ 18 na conta, a estação no lugar novo; (6) Diversidade conta os cursos com item; (7) save da v10.2 carrega igual. `bot.js`: compra os cursos e põe a Cami em "Ajuda em tudo". `PONTO=terraco node balance.js`: chaves `CAMI=4`, `CAFESESP=1`, `AUTOR=1`; se com a Cami em "Ajuda em tudo" a equipe toda passar de 97%, `CAMI_TUDO.espera` 5. Capturas `tests/shot_v10_3.js`: o cartão da Cami com os 3 modos, ela servindo mesa não marcada, a bancada dos cafés com as etapas, os 3 cafés e os 3 drinks novos, o carrinho no foyer com gente bebendo, o cartão do Anselmo com os cursos.

**Fechamento:** v10.3 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v10.3.md`, `RESUMO.md`, `TESTES.md`), PR e merge.

**Modelo:** Sonnet, esforço alto. São três sistemas, e o modo novo da Cami é comportamento de ajudante, que pede cuidado para não atropelar o jogador.

### Sessão 4a-5 — Música, flores e o rebalanceamento do Terraço (v10.4)
**Objetivo:** o ambiente do nível 4 (pedidos de 21 e 22/10) e a escada de números com tudo dentro.

- **Música** (o ambiente do Terraço; `equipe.musica`: 0 desligada, 1 quarteto, 2 pianista; um seletor como o das TVs, no lugar do cartão do couvert): `TERRACO.musica = [ null, { nome:'Quarteto de cordas', pay:150, effect:0.2, amb:1 }, { nome:'Pianista', pay:120, piano:30, effect:0.2, amb:1.5 } ]`. O pianista paga também a afinação do piano (R$ 30 por dia, na mesma linha da folha: "Pianista e afinação"). Sem taxa de couvert no Terraço. O **couvert da Avenida não vem** (`STAFF.couvert` passa a valer só com `nivel === 3`; `normEquipe` e `trocaPonto` desligam; o `deixa` da Avenida vira "os sofás, as águas saborizadas e o couvert ficam"). `FOLHA_CORTE`: a música é a primeira a sair. No 4b, o pianista soma mais ao nível de luxo.
  - Desenho: o **pianista** senta ao piano do canto (a tampa abre) e o **quarteto** (dois violinos, viola e violoncelo, gente variada, de roupa escura) fica sentado em fila no pé do salão, à direita do piano (x 190 a 340, y 528), sem ser obstáculo. Notinhas subindo; parados com `prefers-reduced-motion`. Nomes de músicas, se aparecerem, inventados.
- **Flores do foyer** (`DECOR`, grupo plantas, `nivel:4`, +0,2 cada no Ambiente): **Ikebana** R$ 90, **Arranjo de orquídeas** R$ 120 e **Flores do campo** (em vaso de cerâmica) R$ 70. Elogios (`AVAL_DECOR`): "Que ikebana mais elegante!", "O arranjo de orquídeas é um espetáculo!", "Adorei as flores do campo!".
- **Manual:** `l-musica` ("Música ao vivo", "Quarteto ou pianista: a paciência nas mesas dura mais e o ambiente melhora."); as fichas do Terraço conferidas com tudo o que entrou.
- **Rebalanceamento** (no molde da 3b-7; só números, um por vez, medindo de novo; no máximo 3 por rodada, cada um registrado na spec): `PONTO=terraco node balance.js 80` e `DIAS=75 node carreira.js 12`, com a equipe toda do Terraço (as chaves da 4a-3 e da 4a-4, a Lia e o pianista).
  - Alvos: equipe toda 85–95% das metas e 3★ do bot afiado ~60% (`metaF` e `expertF`); o afiado perde no máximo 1 grupo por dia (`grupos`); ganho sobre a Avenida entre R$ 400 e R$ 900 por dia (acima: `aluguel` 1.200, depois 1.500); 0 dias no negativo depois da mudança; nota do Gurugol entre 4,4 e 4,8 com a equipe toda; cap. 9 em até 15 dias em pelo menos 2/3 (se não: `completas` 5).
  - Os outros pontos não mudam: `node balance.js 40` e `PONTO=industrial|avenida` ficam nas faixas de sempre.
- **Testes:** **`tests/smoke64.js` (novo):** (1) o seletor da música só no Terraço; diárias (150; 120 + 30); 20% de paciência cada; Ambiente +1 e +1,5; (2) o couvert some no Terraço e o save com couvert ligado chega desligado; (3) o corte da folha tira a música primeiro; (4) as 3 flores só no Terraço, +0,2 cada; (5) save da v10.3 carrega igual. `tests/run_all.sh --tudo` verde. Capturas `tests/shot_v10_4.js` com as **Checagens de fim de sessão** completas do Terraço (cenário com tudo comprado, lojinha, menu, fim do dia, celular deitado).

**Fechamento:** v10.4 (`versoes/`, `vtag`, `VERSAO`, `#ov-ver`, `docs/spec-v10.4.md` com a tabela medida, `RESUMO.md`, `TESTES.md`), PR e merge.

**Modelo:** Sonnet, esforço alto. Os itens seguem moldes, mas o rebalanceamento é por tentativa, olhando o Terraço inteiro.

### Sessão 4b — Nível de luxo (v10.5)
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

## Etapa 4c — Eventos de bairro (v10.6)
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
