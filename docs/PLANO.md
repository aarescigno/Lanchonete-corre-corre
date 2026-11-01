# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário. **A 3b-1 (v9.1) foi feita em 31/10.** **Revisão de 31/10** (o plano da equipe e a v9.1 foram feitos ao mesmo tempo): entra a **3b-1r** (v9.1.1, realinhamento) antes da 3b-2; a 3b-1r (v9.1.1) e a 3b-2 (v9.2) foram feitas em 31/10; a 3b-2d (v9.2.1, modo dev com painel) também foi feita em 31/10; a 3b-3 (v9.3) também foi feita em 31/10; a 3b-4 (v9.4) também foi feita em 31/10; a 3b-5 (v9.5) também foi feita em 31/10; a 3b-6 (v9.6) também, em 31/10; a 3b-7 (v9.6.1) foi feita em 01/11; **a próxima é a 3c** (v9.6.2, retornos do usuário de 01/11, já planejada); depois, a 4a, que precisa ser planejada com o Opus antes.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 3b-5 | O Anselmo e os drinks da Avenida | v9.5 | feita em 31/10 (`docs/spec-v9.5.md`; `smoke47`, não 46; `DRINKS.pede` +0,1 pela regra do plano) |
| 3b-6 | A Cami em "Minhas mesas" | v9.6 | feita em 31/10 (`docs/spec-v9.6.md`; `smoke48`, não 47; `CAMI_MESAS_MAX` ficou 3: a Avenida já passava de 95% antes, o ajuste é da 3b-7) |
| 3b-7 | Rebalanceamento da escada completa (Garagem, área industrial e Avenida), antes do Terraço | v9.6.1 | feita em 01/11 (`docs/spec-v9.6.1.md`; `metaF` 2,3 e 3,2, `expertF` novo 1,6 e 3,8, `CAMI_MESAS_MAX` 2; a Garagem ficou como estava) |
| 3c | Retornos de 01/11: a pia da Dani, as conversas do Cardápio e dos entregadores, o "+ marmita" desligado | v9.6.2 | a fazer |
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

## Etapa 3c — Retornos de 01/11: a pia da Dani, as conversas do Cardápio e dos entregadores (v9.6.2)
**Objetivo:** três retornos do usuário de 01/11 (texto em `docs/PROPOSTAS.md`), decididos com ele na mesma sessão. Uma sessão só.

**1. A ajudante não espera a pia encher** (`src/15-dani.js`, classe `Helper`; vale para a Dani, o Joca e a Cami, que usam a mesma classe):
- Hoje, com "Retirar pratos" e "Lavar louça", recolher mesa vem antes de lavar a louça que já está na pia (ela só lava de longe quando não há mesa suja), e, voltando ao canto, ela só repensa ao chegar. Na simulação de 01/11 o bot não mostrou a demora (o bot da Bia recolhe as mesas), mas o usuário viu com as duas tarefas.
- Em `think()`, troque a linha "já na pia: continua lavando até acabar a louça" (`if (this.canWash() && k.sinkN > 0 && !dirty && !coffee && Math.hypot(...) < 4) ...`) por `if (this.canWash() && k.sinkN > 0 && !coffee) return this.go(STATIONS.sink.ap, { type:'sink' });`, no mesmo lugar (antes do bloco de `pratos`), com o comentário "com louça na pia, lavar vem antes de recolher mais mesas (retorno de 01/11)". Com louça na mão, ela deixa na pia e já lava; a linha de baixo, igual (`if (this.canWash() && k.sinkN > 0 && !coffee)`), fica sobrando: apague.
- Em `update(dt)`: andando sem tarefa (`this.phase === 'walk' && !this.plan`, a volta ao canto), ela repensa a cada 0,25 s como no `idle` (`thinkT`), para largar a volta se aparecer louça ou outra tarefa.
- Nada muda quando a Bia está lavando (`canWash()` continua falso) nem no modo "Minhas mesas" da Cami.

**2. A conversa do Cardápio vai para o fim do dia 2** (a 1ª lojinha fica sem empurrão: tudo nela já é novo):
- `HIST_CARDAPIO.dia` de 1 para **2** (`src/10-constantes.js`); o comentário passa a dizer "v9.6.2: no fim do dia 2 (antes, do dia 1), para a 1ª lojinha ficar sem empurrão". As falas ficam.
- A regra de `src/16-jogo.js` (`d.n >= HIST_CARDAPIO.dia`) já serve. Quem já viu (`convCard` 1) não vê de novo.
- `smoke39`: o teste do fim do dia 1 passa a conferir que o dia 1 **não** deixa `convCard` pendente e que o fim do dia 2 deixa.

**3. A conversa dos entregadores, no fim do dia 4** (depois do 1º motoboy):
- Nova `HIST_ENTREGA = { dia:4, falas:[...] }` em `src/10-constantes.js`, logo depois de `HIST_DIVULGA`, com o comentário "v9.6.2: a conversa dos entregadores, no fim do dia 4 (o 1º com motoboy), só no Modo História. save.convEnt: 'pend' | 1 (vista)". Falas:
  - `{ q:'bia', s:'Tio, que história é essa de motoqueiro no balcão pedindo marmita?' }`
  - `{ q:'tonhao', nota:'mostrando o celular', s:'Pus a gente na Efood, o aplicativo de entrega. O pedido cai direto aqui na cozinha.' }`
  - `{ q:'bia', s:'E o moço espera em pé no balcão. Se demorar, vai embora bravo...' }`
  - `{ q:'tonhao', s:'Então marmita pronta, leva logo pro balcão. A Efood fica com um pedaço, mas é freguês que nem cabe no salão.' }`
  - `{ q:'bia', s:'E dá pra deixar umas prontas antes?' }`
  - `{ q:'tonhao', s:'Sem estufa, esfria. Por enquanto, só sai na hora.' }`
- `src/16-jogo.js`, junto da linha do `convDiv`: `if (!tomou && HIST.on && !DEV.on && sv.histV === 1 && d.n === HIST_ENTREGA.dia && !sv.convEnt) sv.convEnt = 'pend';` (dia exato, como a divulgação: save que já passou do dia 4 não vê).
- `src/43-telas.js`, `fluxoHistoria`, logo depois da linha do `convDiv`: `if (sv.convEnt === 'pend') return falar(HIST_ENTREGA.falas, () => { sv.convEnt = 1; writeSave(sv); fim(); });` (sem aba própria na lojinha). Se outra conversa vier no mesmo fim de dia, esta espera o próximo, como as outras (por isso a 1ª fala não diz "hoje").
- `src/12-clientes.js` (`normSave`): `convEnt: s.convEnt === 'pend' ? 'pend' : s.convEnt === 1 ? 1 : 0,` ao lado do `convDiv`.

**4. O "+ marmita" (adiantar) fica desligado** (não há estufa; o código fica, inativo):
- `MARMITA.adiantar: false` em `src/10-constantes.js`, com o comentário "v9.6.2: o '+ marmita' desligado até vir a estufa (retorno de 01/11); o código fica".
- `src/16-jogo.js`, `estacaoOn`: `k === 'adiantar' ? MARMITA.adiantar && this.marmitaOk` (separado do `retirada`, que continua com `this.marmitaOk`). Confira que o desenho do botão em `src/21-cenario.js` (perto de "adiantar marmitas (v8.6)") e o `glow('adiantar')` também somem: ponha `MARMITA.adiantar &&` na condição do desenho, se o `estacaoOn` não cobrir.
- Textos: a nota do dia 4 (`DAYS`, n:4) perde a última frase ("Para adiantar, toque no \"+ marmita\" da janela de pedidos."); a dica do Como jogar (`src/40-interface.js`, "Do dia 4 em diante vem o entregador") só põe a frase do "+ marmita" com `MARMITA.adiantar`.
- `tests/bot.js`: a linha do `tapStation('adiantar')` só vale com `L.MARMITA.adiantar`.
- Os smokes que usam o "+ marmita" (procure `adiantar` em `tests/smoke*.js`: 28, 41 a 48) ligam `L.MARMITA.adiantar = true` logo depois do `load()`, porque o código continua e é testado.

**Testes:** `smoke49` (novo):
- Dani nível 2 com `pratos` e `lavar`, na Garagem, parada no canto e de mãos vazias, com uma mesa suja e `sinkN` 2: depois do `think()`, `plan.type === 'sink'`. Com `sinkN` 0 e a mesa suja: `plan.type === 'clear'`.
- A Dani voltando ao canto (`go(home, null)` a partir da pia de longe, ex.: da mesa mais distante) e `sinkN` 1: depois de `update(0.3)`, `plan.type === 'sink'`.
- Com a Bia lavando (`bia.washing`), a Dani não vai lavar.
- Modo História (`load({historia:true})`): fechar o dia 1 não deixa `convCard` pendente; fechar o dia 2 deixa. Fechar o dia 3 não deixa `convEnt` pendente; o dia 4 deixa; a conversa toca as falas de `HIST_ENTREGA` e termina com `convEnt` 1; fechar o dia 5 não repete; sem o Modo História, nunca fica pendente; `normSave` guarda `'pend'` e 1.
- No dia 4, com entregador: `estacaoOn('adiantar')` falso e `estacaoOn('retirada')` verdadeiro; tocar no lugar do botão não faz marmita (`marmitasLivres` 0).
- `balance.js` (40 rodadas): `EQUIPE=auto` na Garagem, `PONTO=industrial` e `PONTO=avenida`, alvo 85–95%. Medido em 01/11 com o bot sem o "+ marmita" (20 rodadas): Garagem e área industrial iguais; Avenida um pouco abaixo (16 a 19 de 20). Se a Avenida ficar abaixo de 85%, baixe o `metaF` dela de 3,2 para 3,1 (e 3,0 se ainda faltar); a área industrial, se ficar abaixo, de 2,3 para 2,2. Sem equipe (dias 3 a 7, 40–70%), só conferir.
- `node carreira.js` (`DIAS=14`): a linha `HISTORIA` segue sem travar.

**Nova versão** v9.6.2: `versoes/`, selo `vtag`, `VERSAO`, painel `#ov-ver` ("A ajudante lava a louça da pia antes de recolher mais mesas; a conversa do Cardápio passa para o fim do dia 2; nova conversa dos entregadores no fim do dia 4; o \"+ marmita\" fica desligado até vir a estufa"), `docs/spec-v9.6.2.md`, `RESUMO.md`. No fim, o retorno de 01/11 do `PROPOSTAS.md` vai para o `PROPOSTAS-FEITAS.md` (`ferramentas/arquiva.py`).

**Modelo:** Sonnet, esforço médio (código com plano detalhado; o balanceamento já tem a regra de ajuste).

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
