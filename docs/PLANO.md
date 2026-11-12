# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- **Guiado por spec (desde 11/11, ver `docs/SDD.md`):** este arquivo é o roteiro; o detalhe de cada etapa (regras, critérios de aceite, partes, tarefas, testes) fica na spec dela, `docs/spec-vN.md`, escrita e aprovada antes do código. A etapa aqui tem só o objetivo, o link da spec e a linha **Modelo:**. As etapas planejadas antes de 11/11 ainda têm o texto inteiro aqui: a sessão que for executá-las leva o texto para a spec antes de programar, sem decidir nada.
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- **Gancho no modo dev (desde 11/11):** toda etapa que cria algo novo no jogo (pessoa, curso, melhoria, evento, capítulo, conversa, ficha) põe no painel do modo dev um jeito de ligar, forçar ou assistir isso, e o smoke da etapa confere (ver a Etapa D).
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| D-2 | Modo dev completo: História (cumprir, assistir, revelar) e Hoje (forçar imprevistos) | v10.2.2 | feita em 11/11 (`docs/spec-v10.2.2.md`; `smoke64`) |
| 4a-4 | O salão e o bar do Terraço: a Cami em tudo, cafés especiais e coquetéis de autor | v10.3 | feita em 11/11 (`docs/spec-v10.3.md`; `smoke65`; o Terraço já passava 100% das metas com a equipe toda: recalibrar na 4a-5) |
| 4a-5 | Música, flores e o rebalanceamento do Terraço | v10.4 | feita em 11/11 (`docs/spec-v10.4.md`; `smoke66`; cardápio ×1,3, metas ×12 e 3ª estrela ×8,5: o comando do CA8 não contrata a equipe toda, ver Desvios) |
| S | Salários de verdade: equipe e música no custo real (~80%), cardápio e metas recalibrados | v10.5 | a fazer (`docs/spec-v10.5.md` aprovada) |
| 4b | Nível de luxo | v10.6 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.7 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa D — Modo dev completo (D-1, v10.2.1; D-2, v10.2.2)
> Pedido do usuário em 11/11: "o modo dev precisa açambarcar todos esses recursos novos, tipo poder pular para qualquer etapa, adicionar dinheiro, revelar pontos da história". Planejada no mesmo dia (Opus); vem antes da 4a-4.

**Hoje (v9.2.1 a v10.2):** o painel (`buildDev`, `src/40-interface.js`) tem dia ±1/±10, ponto, nota, equipe "tudo no máximo/do começo", "preços e travas de verdade" (com caixa 0/500/2000/10000) e, no meio do dia, velocidade e encerrar. O modo dev desliga a História inteira (`HIST.on && !DEV.on`): sem capítulos, objetivos, conversas, lojinha que abre aos poucos, Manual que revela nem dicas. Não dá para testar nada do Modo História, nem forçar chuva, quebra, fiscal ou VIP exigente.

### Ganchos das próximas etapas (cada uma faz o seu)
- **4a-4** (cafés do Joca, coquetéis de autor, a Cami em tudo): os cursos novos entram no **Todos/Nenhum**; o que for melhoria, no **Todas/Nenhuma**.
- **4a-5** (música e flores): a música entra na Equipe e lojinha (liga e desliga), as flores no **Decoração: Toda**; o rebalanceamento revisa a linha 9 e o `Fim` da `DEV_CAPS` (caixa e nota).
- **4b** (nível de luxo): linha `Luxo: nível N [−] [+]` na Equipe e lojinha.
- **4c** (eventos de bairro): na aba Hoje, `Evento: Sorteio, Nenhum, Festa junina, Jogo do Brasil`.
- **6** (o crítico e o final): os capítulos novos entram sozinhos em **Pular** e em **Assistir** (a `DEV_CAPS` ganha as linhas deles); na aba Hoje, `Crítico: Sorteio, Vem hoje`; o final ganha um item em **Assistir**.

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

## Etapa S — Salários de verdade (v10.5)
**Objetivo:** cada pessoa da equipe e cada música custa o que o cargo custaria de verdade (~80% do custo real, como o aluguel); o Tonhão passa a ter salário e a Dani ajuda de custo; o cardápio sobe para perto do preço real (PF da Garagem a R$ 30) e as metas são recalibradas pelo bot. Entrevista de 12/11; pesquisa em `docs/pesquisa-salarios.md`. Spec: `docs/spec-v10.5.md` (aprovada).

**Modelo:** Sonnet, esforço alto (código simples, mas a calibração por tentativa mexe nos quatro pontos e em muitos smokes)

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10 a v10.4; 4b, v10.6)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário). A **4a** foi planejada em 10/11 e dividida em 5 sessões (4a-1 a 4a-5); a **4b** (nível de luxo) vem depois.

### 4a — Terraço Suíça: decisões de 10/11 (v10 a v10.4)
> **Planejada em 10/11** (o usuário pediu o planejamento com o Fable e que as decisões fossem tomadas na sessão; registro em `docs/PROPOSTAS.md`). O que estava em aberto ficou assim:
> - **Refeição em tempos:** bebida, entrada, prato principal e sobremesa, com os sistemas que já existem (drinks do Anselmo ou suco, cozinha do Tonhão, doces da Dani). A cozinha faz a entrada e, entregue a entrada, o principal. Cada tempo tem nota; regras na 4a-1.
> - **Cardápio:** ×2,4 e aluguel R$ 1.200 (calibrados na 4a-1; a partida era ×2,5 e R$ 1.000, e a refeição completa já sobe a conta por mesa). Mudança R$ 5.000, crédito R$ 8.000. Metas: `grupos` 0,50, `metaF` 9, `expertF` 6. Os preços "no Terraço" citados nas sessões seguintes foram escritos com ×2,5: valem os que saem de `precoPrato`.
> - **Pendência da v10:** guardar a v9.6.13 em `versoes/v9.6.13.html` (`docs/spec-v10.md` diz como); a sessão não teve permissão de escrita nessa pasta. As capturas (`capturas/vX`) ficam fora do git desde a limpeza de 10/11: os `shot_*.js` geram, confere-se e descarta-se.
> - **Avaliação do exigente:** pesa mais: ele sempre avalia e a nota dele conta 2 vezes. Bravo, tira 10% do movimento do dia seguinte.
> - **Visual do exigente:** plaquinha dourada com duas estrelas, sem óculos escuros, com chapéu, lenço de seda ou echarpe.
> - **Música:** quarteto de cordas R$ 150/dia; pianista R$ 120/dia mais R$ 30/dia da afinação do piano. Um ou outro; no Terraço não há taxa de couvert.
> - **O piano** já vem com o ponto (fechado, no canto de baixo à esquerda do salão, fora da área das mesas); quem toca chega na 4a-5.
> - **Ajudante de cozinha:** a **Lia**, colega do Tonhão no curso de alta gastronomia.
> - **O Terraço mede pela equipe toda** (Joca, Cami, Anselmo e a confeitaria): é ela que passa ~90% das metas.
> - **Regra da 3f em todas as sessões:** cartão novo da lojinha só com nome, preço e "?"; toda novidade ganha ficha no `MANUAL` (sem números), revelada quando aparece na história.
> Ordem: 4a-1 (o ponto e a refeição completa, v10) → 4a-2 (o VIP exigente e a reputação, v10.1) → 4a-3 (a cozinha: alta gastronomia, a Lia e a alta confeitaria, v10.2) → 4a-4 (o salão e o bar: Cami, Joca e Anselmo, v10.3) → 4a-5 (música, flores e rebalanceamento, v10.4). Cada uma é uma versão, com PR e merge. As "Checagens de fim de sessão" da etapa 3 valem para todas.

### Sessão 4b — Nível de luxo (v10.6)
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

## Etapa 4c — Eventos de bairro (v10.7)
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
