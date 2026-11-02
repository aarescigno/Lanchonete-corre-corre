# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.
- Ordem: cada etapa depende só das anteriores. A 1a vem primeiro (mexe no equilíbrio de base). A 1c teve prioridade sobre as demais, por ser retorno do beta-tester Renan (pedido do usuário em 21/10). A 1d-1 (v7.4), a 1d-2 (v7.5), a 2 (v8) e a 2b (v8.3) foram feitas. **Ordem revista com o usuário em 22/10:** 2b (campanha contínua e banco), 2c (avaliações dos clientes), 2d (abertura animada do Modo História), 3a (área industrial), 3b (Avenida Brasil) e 4 (Terraço Suíça). A campanha vem antes dos pontos para a carreira não ser refeita duas vezes, e as avaliações viram a "experiência" que abre os pontos novos e a reputação da etapa 4. A 2c (v8.4) e a 2d (v8.5) foram feitas em 26/10. **Ordem revista com o usuário em 28/10** (texto em `docs/PROPOSTAS.md`): as propostas que estavam só no log e nas Ideias guardadas viraram etapas. Ficou assim: 2e (entregadores com fila própria e marmitas), 2f (a campanha vira o Modo História), 3a (área industrial), 3b (Avenida Brasil), 4a (Terraço Suíça), 4b (nível de luxo), 4c (eventos de bairro), 6 (crítico do Michelzão e final) e 7 (polimento). A marmita vem antes da área industrial, que terá mais entregadores. A campanha e o Modo História viraram uma coisa só: a 2f monta a estrutura e os capítulos da Garagem, cada ponto traz o seu capítulo, e a antiga etapa 5 deixou de existir. A 2e (v8.6) foi feita em 28/10, e a 2d-r (v8.6.1) também, com as 5 partes juntas a pedido do usuário. **A próxima é a 2c-r2 (prato quente, v8.6.8) e depois a 2c-r3, em 3 partes (a: cursos e gostos, v8.6.9; b: desenhos dos pratos, v8.6.10; c: vegetarianos e veganos, v8.6.11), planejada na sabatina de 29/10; a 2f segue depois delas.** A 2c-r3 (a, b e c) e a rodada de balanceamento 2c-r3d (v8.6.13) foram feitas em 29/10; a 2c-r1 (v8.6.7) também. **A 2c-r4a (v8.6.14) e a 2c-r4b (v8.6.15) foram feitas em 30/10; a próxima é a 2f (v8.7). A 2c-r4 era em 2 sessões com o Sonnet (a: sem o limite de 1 melhoria por dia e sem o "(n)" do Gurugol, v8.6.14; b: lojinha em grupos, v8.6.15; pedido do usuário de 30/10), depois a 2f, já planejada com o usuário em 30/10.** **Pedido do usuário de 30/10:** antes da 3a vem a **2g** (o Tonhão sobe de nível com os cursos, v8.8). Depois dela, a **2h** (a Dani sobe de nível com trabalho e cursos, v8.9). A etapa 7 fica **a rever** com o usuário antes de começar. **Pedido do usuário de 31/10:** antes da 3b vem a **2c-r7** (a lojinha abre aos poucos), em 2 sessões: a (v9.0.4) monta o sistema; b (v9.0.5) compara ordens com o bot e fecha a ordem com o usuário. **A 3b-1 (v9.1) foi feita em 31/10.** **Revisão de 31/10** (o plano da equipe e a v9.1 foram feitos ao mesmo tempo): entra a **3b-1r** (v9.1.1, realinhamento) antes da 3b-2; a 3b-1r (v9.1.1) e a 3b-2 (v9.2) foram feitas em 31/10; a 3b-2d (v9.2.1, modo dev com painel) também foi feita em 31/10; a 3b-3 (v9.3) também foi feita em 31/10; a 3b-4 (v9.4) também foi feita em 31/10; a 3b-5 (v9.5) também foi feita em 31/10; a 3b-6 (v9.6) também, em 31/10; a 3b-7 (v9.6.1) foi feita em 01/11; a 3c (v9.6.2) foi feita em 01/11. **Pedido do usuário de 01/11** (retornos do Renan, entrevista em `docs/PROPOSTAS.md`): antes da 4a vêm a **3d**, em 3 sessões (3d-1, v9.6.4; 3d-2, v9.6.5; 3d-3, v9.6.6), e a **3e** (revisão da interface, com o Opus); a 3d-1 (v9.6.4) foi feita em 01/11 (a v9.6.3 já era o ajuste da Dani, então as versões seguintes subiram um número); a 3d-2 a 3f-2 (até a v9.6.8) foram feitas até 02/11; a 3e (levantamento, sem versão) foi feita em 02/11; **a próxima é a 3e-1 (v9.6.9, Sonnet)**, e depois o planejamento da 4a com o Opus. **Pedido do usuário de 01/11 (noite):** depois da 3d-3 e antes da 3e entra a **3f** (o Manual e menos texto explicativo, em 2 sessões: 3f-1, v9.6.7; 3f-2, v9.6.8). Depois, a 3e e a 4a, que precisa ser planejada com o Opus antes (com o resultado da 3e). **Retornos da Letícia de 02/11:** antes da 4a entra a **3g**, em 2 sessões com o Sonnet (3g-1, v9.6.10; 3g-2, v9.6.11), planejada com o usuário em 02/11; **a próxima é a 3g-1**.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 3e-1 | A tela respira: textos flutuantes, crachás, selos, espera e lojinha | v9.6.9 | feita em 02/11 (`docs/spec-v9.6.9.md`; `smoke55`; sem mudar números do jogo) |
| 3f-1 | O Manual (bestiário que se revela com a história) | v9.6.7 | feita em 02/11 (`docs/spec-v9.6.7.md`; `smoke53`; o Como jogar virou o Manual; sem mudar números do jogo) |
| 3f-2 | Menos texto na tela: lojinha, abertura do dia e balões | v9.6.8 | feita em 02/11 (`docs/spec-v9.6.8.md`; `smoke54`; sem mudar números do jogo; o "?" em cada cartão abre a ficha no Manual) |
| 3g-1 | Conversas no fim do turno e cartões mais cedo (retornos da Letícia) | v9.6.10 | a fazer |
| 3g-2 | A tela avisa: Gurugol em balões, mesinha das marmitas, eFood e fumaça | v9.6.11 | a fazer |
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

## Etapa 3g — Retornos da Letícia (02/11): conversas no fim do turno, recompensa cedo e avisos na tela (3g-1, v9.6.10; 3g-2, v9.6.11)
Texto original e diagnóstico em `docs/PROPOSTAS.md` (02/11, Letícia). Decidido com o usuário em 02/11 (entrevista). Vem **antes da 4a**. Nada muda fora do Modo História, salvo onde dito (lixo, mesinha, letreiro).

### Sessão 3g-1 — As conversas no fim do turno e os cartões mais cedo (v9.6.10)
Partes: `src/43-telas.js` (`fluxoHistoria`, troca para `dayend`), `src/16-jogo.js` (fim do dia, `LIBERA`), `src/10-constantes.js` (`LIBERA`, `HISTORIA` cap. 2, conversa nova), `src/12-clientes.js` (`loadSave`: campo novo), `src/41-lojinha.js` (cartão e cursos da Dani).
1. **Conversas antes dos resultados.** Em `43-telas.js:37`, o `dayend` passa a ser `fluxoHistoria(() => { buildEnd(); showOnly(['ov-end']); })` (na carreira com História; fora dela, como hoje). O `btn-next` vai direto para `game.goShop(game.proxDia)`. O `playCareer` continua chamando o `fluxoHistoria` (toca o que ficou pendente de quem saiu no meio). O cartão de fim de ponto (`ov-continua`) também vem antes dos resultados (o `contFim` passa a ser o "mostrar resultados"). Na falência (`tomou`), nada muda.
2. **Até 2 conversas por fim de dia**, além das de capítulo (o "depois" e o "antes" não contam). Ordem fixa das pendentes: entregadores (`convEnt`), Salão, Bia, Manutenção, Divulgação (`convDiv`), presente da vizinha (`convPlanta`), Cardápio (`convCard`), Melhorias, Decoração, e depois os cartões de ponto na ordem do `LIBERA` (confeitaria, joca, anselmo, cami). O `falou` vira um contador: `fluxoHistoria(fim, n)` toca a próxima enquanto `n < 2`.
3. **Bia:** `LIBERA` bia fica `dia:2, ate:3` (gatilho no fim do dia 2; garantia no fim do dia 3).
4. **Salão:** `dia:1, ate:3`. A família que desiste na fila já no dia 1 abre o Salão no fim do dia 1. Falas como estão.
5. **Presente no fim do dia 1** (`HIST_PLANTA`, só no Modo História, `save.convPlanta: 0 | 'pend' | 1`, pendente no fim do dia 1). Ao terminar, `save.decor.espada = 1` (à mostra, grátis), sem abrir o cartão Decoração. Falas:
   - Tonhão (*com um vaso na mão*): "A dona Cida, aqui do lado, mandou de presente pela inauguração."
   - Bia: "Uma espada-de-são-jorge! Vai ficar na entrada."
   - Tonhão: "Dizem que espanta mau-olhado. E freguês mal-humorado, quem sabe."
6. **Decoração pelo elogio à planta:** `LIBERA` decor passa a `dia:3, ate:6`, `gatilho:(st, av, g) => g.save.decor.espada === 1 && av.some(a => a.s && a.s[4] != null && a.s[4] >= 2.5)`, `reclama:['Que plantinha bonita!', 'Gostei da plantinha na entrada.']` (o comentário entra no Gurugol do dia, como as reclamações). Falas novas:
   - Bia: "Tio, elogiaram a plantinha da dona Cida no Gurugol!"
   - Tonhão: "Viu? Um verdinho já muda a cara da garagem."
   - Bia: "E se a gente pusesse mais? A foto da mãe na parede..."
   - Tonhão (*sorrindo*): "Isso a Rosa ia gostar. Vê na Decoração."
   Se o `carreira.js` mostrar o gatilho em menos da metade das campanhas até o dia 5, baixe o 2.5 para 2.
7. **Dani:** no Modo História (`HIST.on && histV === 1`), o cartão dela na Equipe só aparece com `game.daniChegou` (hoje aparece um cartão vazio antes; fora da História, como hoje). Fala do Tonhão no cap. 2: "Eu pedi ajuda pra Dani, filha da vizinha. Ela vem aprender com a gente." Cursos da Dani **sem `item`** somem quando ela já está no nível máximo (`daniNivelXp(save) === STAFF.dani.levels.length - 1`); se não sobrar curso, some o título da lista.
8. **Manual e textos:** nada de texto novo na lojinha. Conversas curtas, como acima.
- **`smoke56`** (com `load({historia:true})`): fim do dia → conversa toca antes do `ov-end`; com 4 pendentes, só 2 tocam e as outras ficam `'pend'` para o dia seguinte, na ordem do item 2; o capítulo não conta no limite; família perdida no dia 1 → Salão pendente no fim do dia 1; Bia aberta até o fim do dia 3 sem gatilho; `convPlanta` no fim do dia 1 e `decor.espada === 1` depois; elogio → decor pendente; Dani sem cartão antes do cap. 2; cursos sem item escondidos no nível máximo; saves antigos carregam (`convPlanta` 0 vira 1 para quem já passou do dia 1).
- `carreira.js` (História): Salão e Bia abertos até o dia 3–4 na maioria das campanhas (linha `HISTORIA`); sem mudança no `balance.js` (sem História).

**Modelo:** Sonnet, esforço médio (plano detalhado, lógica de fluxo e testes).

### Sessão 3g-2 — A tela avisa: Gurugol em balões, mesinha das marmitas, letreiro do eFood e fumaça do lixo (v9.6.11)
Partes: `src/42-resultados.js` (fim do dia), `src/21-cenario.js` (geladeira, mesinha, fumaça), `src/10-constantes.js` (`MARMJ_SLOTS`, `STATIONS`, `TRASH`), `src/12-clientes.js` (cheiro), `src/22-salao-hud.js` / `src/23-render.js` (letreiro e seta), `src/16-jogo.js` se preciso.
1. **Gurugol em balões no topo do fim do dia:** os comentários do dia (até 3) viram balões grandes (fonte ≥ 15 px, rostinho do tipo de cliente `k` à esquerda), logo abaixo do título e acima das tabelas; as tabelas ficam com fonte menor (até 2 px a menos). Sem comentário, nada muda. Checar no 568×320 e no `menu_fit.py`.
2. **Geladeira some da tela** (o desenho `drawGeladeira` deixa de ser chamado); a **manutenção dela continua escondida**, como hoje (estraga, encarece ingredientes, cartão da Manutenção e introdução do dia seguem citando).
3. **Mesinha das marmitas no lugar dela:** uma mesinha de madeira em `rect {x:686, y:104, w:48, h:92}`. As marmitas que o Tonhão termina vão para ela, empilhadas em vez da janela: `marmJSlotsFor(n)` passa a `{ x:710, y:124 + 24*i }` (2 ou 3 vagas, como `ponto.marmJanela`). A Bia pega ali (ponto de parada `{x:700, y:150}`, o mesmo do balcão de drinks; se na captura ela ficar em cima do desenho, use `{x:700, y:206}`) e leva ao entregador, que continua no balcão de retirada. Pratos do salão seguem na janela. Na Avenida, conferir que a mesinha não encosta no balcão de drinks (620–680); se encostar, encolha a mesinha para `w:42`. Futuramente, a estufa (Ideias guardadas) fica nessa mesinha.
4. **Letreiro do eFood:** sobre cada entregador esperando no balcão (e na fila de retirada), uma plaquinha "eFood" vermelha que pisca (0,6 s acesa / 0,4 s apagada); com `prefers-reduced-motion`, fica acesa sem piscar.
5. **Seta nas marmitas prontas:** quando há entregador esperando e marmita dele na mesinha, uma seta piscando aponta para a mesinha, **só nos dias 4 e 5 da carreira** (os 2 primeiros com motoboy) e na Missão zero, se ela tiver entregador. Sem movimento com `prefers-reduced-motion` (seta parada).
6. **Fumaça do lixo se espalha:** com a lixeira cheia, a fumaça verde cresce a partir dela (`TRASH.fumaca = { cresce:30, raio:900 }`: o raio vai de 0 a 900 px em 30 s) e some em 3 s ao esvaziar. O cheiro (`TRASH.smell`, paciência ÷ 1,3) passa a valer só para quem a fumaça alcança (distância à lixeira ≤ raio), em vez de para todos de uma vez. Desenho: 6 a 10 nuvens verdes translúcidas na borda do raio; com `prefers-reduced-motion`, um véu verde parado no alcance. Vale em todos os modos.
- **`smoke57`**: comentários em balões acima das tabelas (DOM); geladeira não desenhada, mas `quebrado('geladeira')` ainda encarece; `MARMJ_SLOTS` na mesinha e a Bia leva da mesinha ao entregador (entrega completa); letreiro presente com entregador esperando; seta só nos dias 4–5; raio da fumaça cresce com o tempo, cliente fora do raio sem cheiro e dentro com cheiro; reduced-motion sem piscar.
- `balance.js`: a fumaça deixa o cheiro mais brando no começo; aceitar até +3 pontos nas metas sem equipe; se subir mais, `cresce` vai a 20.
- Capturas (`shot_v9_6_11.py`): fim do dia com balões, mesinha com marmitas (Garagem e Avenida), letreiro, seta, fumaça no meio e no máximo; conferir com recorte ampliado.

**Modelo:** Sonnet, esforço médio (desenho no canvas e testes com plano detalhado).

---

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10; 4b, v10.1)
> Desde a revisão de 28/10, o **nível de luxo** entra junto com o Terraço (escolha do usuário), em 2 sessões: **4a** (Terraço e VIPs) e **4b** (nível de luxo).

### Sessão 4a — Terraço Suíça e VIPs exigentes (v10)
**Objetivo:** o topo da escada de pontos (nível 4 do salão), com o cliente que o Arthur descreveu: "VIPs exigentes que entram e pedem pratos especiais".

**Entra:**
- 4º ponto, **Terraço Suíça** (nível 4: **20 lugares**, ver "Mapa do Terraço" abaixo; aluguel R$ 1.000, mudança R$ 5.000, cardápio ×2,2 como sugestão), com VIPs frequentes e uma antessala ("foyer") com amenidades na área de espera: **poltronas individuais e coquetelaria lá fora**. A confeitaria, o café, o atendimento e os drinks vêm da 3b (a Dani confeiteira, o Joca barista, a Cami e o Anselmo com o balcão de drinks); aqui o Anselmo leva **a coquetelaria lá fora** (o balcãozinho da espera), um sistema só com o balcão do salão.
- **Mapa do Terraço (decidido com o usuário na 3e, 02/11):**
  - **Menos mesas, mais finas:** 20 lugares (5 mesas de 4; o salão comporta só 6), e o lugar da 6ª fica com o **piano de cauda**, no salão.
  - **Refeição completa:** a freguesia do Terraço pede o cardápio inteiro, em tempos: **entrada, prato principal, sobremesa e bebida**, e fica mais tempo na mesa. Cada tempo recebe nota, e a avaliação do Gurugol sai da soma dos tempos (e do tempo entre um e outro). São menos clientes, mais exigentes e que ficam mais tempo. Palavras do usuário: "as pessoas vão pedir cardápios inteiros [...] vão avaliar cada uma das coisas e a nota vai ser diferente [...] entrada, prato principal, sobremesa, bebida, e a nota é dada nisso, no tempo dessas coisas acontecerem. Menos clientes, mas mais exigentes, que ficam mais tempo."
  - **O foyer:** no Terraço não há entregadores nem marmitas; o balcão de retirada sai e a **coquetelaria lá fora** do Anselmo fica no alto da calçada, onde ele estava. Os 6 lugares da espera são **poltronas individuais** (sem o sofá), com o desenho da espera da 3e-1.
  - Ao planejar: as regras dos tempos (quem traz cada um, quanto se espera entre eles, como cada nota pesa), o balão do pedido em tempos (um ícone por vez, no balão de hoje, sem texto), o encaixe com o VIP exigente e o prato da casa, e o `metaF` com menos mesas.
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
- A refeição em tempos (ver "Mapa do Terraço"): as regras e a nota de cada tempo.
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
