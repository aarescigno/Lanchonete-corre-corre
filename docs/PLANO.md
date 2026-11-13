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
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6a | O molho da Rosa: a pétala na mão e a Cami gerente (cap. 12) | v10.8 | feita em 13/11 (`docs/spec-v10.8.md`; `smoke73`; o prato no balcão ainda não leva a pétala, ver Desvios) |
| 6b | O crítico sem aviso: o caderninho e o boato do Bráulio (cap. 13) | v10.9 | feita em 13/11 (`docs/spec-v10.9.md`; `smoke74`; ficha média 6,3 e 5,6 com `CRITICO.pac` 2, ver Desvios) |
| 6c | A noite da estrela: o jantar, o Bráulio à mesa e as estrelas (cap. 14) | v10.10 | feita em 13/11 (`docs/spec-v10.10.md`; `smoke75`; cortes 44/66/90 e CA14 e CA15 em parte, ver Desvios) |
| 6d | O futuro da Corre-Corre: a cena final, os créditos e a placa | v11 | a fazer (`docs/spec-v11.md`, aprovada) |
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

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10 a v10.4; 4b, v10.7)
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

## Etapa 6 — Modo História: o crítico do Michelzão e o final (v10.8 a v11)
> Planejada em 13/11 (decisões do usuário no `docs/PROPOSTAS.md`): quatro sessões, uma versão cada, todas com spec aprovada. O guia é o **Michelzão**, inventado: nada de nome, logo, mascote ou arte de guia real.

**Objetivo:** a estrela do Michelzão, o fim do sonho da Bia. Três capítulos novos no Terraço (12 a 14) e a cena final.

**O arco (vale para as quatro):**
- **Estrelas:** de nenhuma ("Recomendado") a 3. Com 1 a promessa à Rosa se cumpre e a cena final toca inteira; a 2ª e a 3ª são o desafio duro, cada uma acrescenta um trecho à cena, e dá para marcar outra noite para tentar mais. Estrela ganha não se perde.
- **O Bráulio é rival até o fim:** planta um comentário no Gurugol, espalha um boato para lotar a casa no dia do crítico, senta à mesa na noite da estrela para achar defeito e, no final, perde a estrela da Casa Aurora por nunca ter sabido repetir o molho.
- **O futuro:** o Terraço segue com a estrela, e a garagem da Rosa reabre como a Cozinha da Rosa, escola de cozinha do bairro, com a Dani dando aula. A última cena espelha a primeira da abertura.
- **Depois do final** a campanha continua, com a placa na parede, visitas surpresa do crítico e noites novas.

### 6d — O futuro da Corre-Corre (v11)
A cena final animada (oito cenas, no motor da abertura), os créditos, a placa na parede do Terraço, "O final" no botão História e a v10 guardada em `versoes/v10.html`. Spec: `docs/spec-v11.md`.

**Modelo:** Sonnet, esforço alto (o peso é o desenho das cenas no canvas, conferidas por captura).

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
