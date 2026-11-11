# Plano de novidades (uma etapa por sessão)

Origem: retorno do Renan Martorelli (beta-tester) e conversa com o Arthur (15/10/2026); as etapas 1c e 1d vieram de outro retorno do Renan (18/10). Os textos originais e o destino de cada ideia estão em `docs/PROPOSTAS.md` (log de propostas). Os pedidos foram escassez de recursos, custos de manutenção, divulgação, aluguel em área nobre com VIPs exigentes (hoje, a escada de pontos: Garagem, área industrial, Avenida Brasil e Terraço Suíça) e modo história ("o sonho da Bia de ter um restaurante estrelado, começando do zero"). A v7 (Contas) fez a primeira parte.

## Como usar
- **Ler por faixa:** nunca leia este arquivo inteiro. `tests/indice.sh PLANO` mostra cada etapa com a linha de início; leia só a etapa da vez com `offset` e `limit`. As etapas feitas estão em `docs/PLANO-FEITO.md` (só para consulta).
- Cada etapa cabe numa sessão e termina como as outras: versão nova (se mexe no jogo), testes verdes, `docs/spec-vN.md`, `RESUMO.md` atualizado, PR com merge no `claude/main` e publicação no artifact (ver `CLAUDE.md`).
- Para começar uma sessão, basta pedir: **"faça a próxima etapa do docs/PLANO.md"**. A sessão lê só a etapa da vez e as partes de `src/` citadas nela.
- **Modelo e esforço (desde 29/10, ver `CLAUDE.md`):** cada etapa ou sessão termina com uma linha **Modelo:**. Quando ela pede "planejar com o Opus antes", a primeira sessão (com o Opus) fecha as **decisões em aberto** com o usuário, escreve no plano os valores, textos e falas decididos, apaga a lista de decisões em aberto e troca a linha para só o modelo da execução. A sessão de execução (Sonnet ou Haiku) não decide nada de design: se achar uma decisão que ficou aberta, para e pergunta ao usuário.
- **Gancho no modo dev (desde 11/11):** toda etapa que cria algo novo no jogo (pessoa, curso, melhoria, evento, capítulo, conversa, ficha) põe no painel do modo dev um jeito de ligar, forçar ou assistir isso, e o smoke da etapa confere (ver a Etapa D).
- Antes de programar, se ainda houver **decisões em aberto** na etapa (cada uma já tem uma sugestão), a sessão confirma com o usuário.
- No fim, a sessão marca a etapa como feita na tabela abaixo (com a versão e a data), move o texto dela para o `docs/PLANO-FEITO.md` com `ferramentas/arquiva.py` e leva para a seção **Situação das etapas feitas** de lá as linhas da tabela além das 3 últimas feitas.

## Situação
| # | Etapa | Versão | Situação |
|---|---|---|---|
| 4a-3 | A cozinha do Terraço: alta gastronomia, a Lia e a alta confeitaria | v10.2 | feita em 11/11 (`docs/spec-v10.2.md`; `smoke62`; `ALTA=1` quase dobra o lucro do bot: recalibrar na 4a-5) |
| 4a-2 | O VIP exigente e a reputação | v10.1 | feita em 11/11 (`docs/spec-v10.1.md`; `smoke61`; bot afiado com a equipe toda 94,6% das metas, sem mudar números) |
| 4a-1 | O Terraço Suíça e a refeição completa (caps. 8 e 9) | v10 | feita em 11/11 (`docs/spec-v10.md`; `smoke60`; calibrada: grupos 0,50, metaF 9, expertF 6, aluguel R$ 1.200, cardápio ×2,4) |
| D-1 | Modo dev completo: jeitos, abas, pular de capítulo, dinheiro e equipe | v10.2.1 | a fazer (planejada em 11/11) |
| D-2 | Modo dev completo: História (cumprir, assistir, revelar) e Hoje (forçar imprevistos) | v10.2.2 | a fazer (planejada em 11/11) |
| 4a-4 | O salão e o bar do Terraço: a Cami em tudo, cafés especiais e coquetéis de autor | v10.3 | a fazer (planejada em 10/11) |
| 4a-5 | Música, flores e o rebalanceamento do Terraço | v10.4 | a fazer (planejada em 10/11) |
| 4b | Nível de luxo | v10.5 | a fazer |
| 4c | Eventos de bairro: festa junina e jogo do Brasil | v10.6 | a fazer |
| 5 | ~~Modo História, parte 1~~: juntou-se à 2f e aos capítulos da 3a, 3b e 4a (28/10) | — | — |
| 6 | Modo História: o crítico do Michelzão e o final | v11 | a fazer |
| 7 | Polimento: celular, jogo online, ajuste geral | v11.1 | a rever |

---

## Etapa D — Modo dev completo (D-1, v10.2.1; D-2, v10.2.2)
> Pedido do usuário em 11/11: "o modo dev precisa açambarcar todos esses recursos novos, tipo poder pular para qualquer etapa, adicionar dinheiro, revelar pontos da história". Planejada no mesmo dia (Opus); vem antes da 4a-4.

**Hoje (v9.2.1 a v10.2):** o painel (`buildDev`, `src/40-interface.js`) tem dia ±1/±10, ponto, nota, equipe "tudo no máximo/do começo", "preços e travas de verdade" (com caixa 0/500/2000/10000) e, no meio do dia, velocidade e encerrar. O modo dev desliga a História inteira (`HIST.on && !DEV.on`): sem capítulos, objetivos, conversas, lojinha que abre aos poucos, Manual que revela nem dicas. Não dá para testar nada do Modo História, nem forçar chuva, quebra, fiscal ou VIP exigente.

### Decisões (valem para a D-1 e a D-2)
- **Dois jeitos, no topo do painel** (linha de 2 botões, `aria-pressed`): **Livre** (o de hoje: tudo de graça, tudo aberto, sem História, dinheiro que não acaba) e **De verdade** (preços, travas **e o Modo História**: capítulos, objetivos, conversas, cartões que abrem aos poucos, Manual que revela, dicas dos dias 1 a 3). O "De verdade" é o `DEV.real` de hoje, ampliado, e passa a ficar gravado em `localStorage` (`LS.devReal = 'lcc2_dev_real'`, `'1'`/`'0'`); `DEV.vel` segue só na memória. O save do dev continua à parte (`lcc2_save_dev`) e fora do ranking; o save de verdade nunca muda.
- **Função nova** `histLiga()` em `src/12-clientes.js`, ao lado de `devLivre`: `return HIST.on && !devLivre();`. Troque **todo** `HIST.on && !DEV.on` por `histLiga()` (hoje: `src/16-jogo.js` nas linhas das conversas pendentes do fim do dia, em `capObj`, `avancaCap` e `trocaPonto`; `src/43-telas.js` no `dayend`). **Não** troque `!DEV.on` em: abertura sozinha (`43-telas.js`, `if (!aberturaVista() && !DEV.on)`), `treinoPrimeiro` (`40-interface.js`) e `novoHist` do `normSave` (`12-clientes.js`): o save dev novo segue nascendo no cap. 4, sem História; quem quer a História usa **Pular**.
- **Painel em abas** (uma linha de abas abaixo dos jeitos, no visual das abas do Manual, `#manual-abas`; a aba aberta fica em `DEV.aba`, na memória, padrão `'pular'`): **Pular**, **Dinheiro**, **Equipe e lojinha**, **História** (D-2) e **Hoje** (D-2). A linha "Agora" no alto de toda aba: `Dia N · <ponto> · Capítulo C` (sem capítulo no Livre) `· R$ caixa`. Na D-1, as abas História e Hoje ainda não existem; o "No dia" de hoje (velocidade e encerrar) vira o fim da aba Pular até a D-2.
- **Todo botão do painel** grava no save dev e chama `game.devRecarrega()` quando mexe em ponto, mesas, equipe ou melhorias (como hoje). Nenhum botão mexe fora do modo dev (`if (!DEV.on) return false`).
- **Toda etapa de jogo daqui em diante** (4a-4, 4a-5, 4b, 4c, 6, 7) traz o seu gancho no painel: o que ela cria de novo (pessoa, curso, melhoria, evento, capítulo, conversa, ficha) precisa poder ser ligado, forçado ou assistido pelo modo dev, e o smoke da etapa confere o gancho. Os ganchos já previstos estão no fim desta etapa.

### Sessão D-1 — Jeitos, abas, Pular, Dinheiro e Equipe (v10.2.1)
**Aba Pular:**
- **Capítulo:** botões `1` a `9` e `Fim` (= cap. 10, depois do último). Um toque chama `game.devCapitulo(n)`: liga o jeito De verdade, guarda o save dev atual em `localStorage` `lcc2_save_dev_bak` (para desfazer), monta o save do começo do capítulo pela tabela `DEV_CAPS` (abaixo), fecha o painel e toca a conversa de antes do capítulo (`fluxoHistoria` com `sv.conversa = 'antes'`, como no fim de um dia); no fim dela, a lojinha do dia (`game.goShop(sv.dia)`). No `Fim`, sem conversa: direto para a lojinha.
- **Desfazer o pulo** (só aparece com `lcc2_save_dev_bak` guardado): volta o save guardado, apaga a cópia e recarrega (`devRecarrega`).
- **Dia** (como hoje: −10, −1, +1, +10) e **Ponto** (como hoje: troca sem custo nem capítulo). Mostra também `Dia no ponto: N` (`diaNoPonto(sv, sv.dia)`).
- **No dia** (só com o dia pausado na carreira): velocidade **1×, 2×, 4× e 8×** (o 8× é novo) e **Encerrar o dia agora** (como hoje).

**Como o `devCapitulo(n)` monta o save** (em `src/16-jogo.js`, junto das outras ações `dev*`):
1. `const sv = normSave({ treino:true })`; depois `sv.histV = 1; sv.cap = n; sv.dia = D.dia; sv.capDia = D.dia; sv.capAzul = 0; sv.capFeito = 0; sv.conversa = n <= HISTORIA.length ? 'antes' : null; sv.bank = D.caixa`.
2. Ponto: `this.save = sv`, depois `trocaPonto(pontoOf(id))` para cada ponto da escada até o do capítulo (`HISTORIA[n-1].ponto`; no `Fim`, `terraco`), na ordem; depois `sv.pontoDia = D.pontoDia`. Como o `trocaPonto` mexe em `sv.conversa` quando o capítulo é do ponto, regrave `sv.conversa` e `sv.capDia` no fim.
3. Banco: cap. 1, `emp` = a reforma inteira (`{ resto:REFORMA.valor, amort:REFORMA.amort, j:REFORMA.juros, ini:REFORMA.ini, ref:true }`); cap. 2, resto 700; cap. 3, resto 400; do cap. 4 em diante, sem empréstimo. Sempre `normEmprestimo`.
4. Conversas soltas já vistas: `convPlanta = 1` e `decor.espada = 1` com `D.dia > HIST_PLANTA.dia`; `convCard = 1` com `D.dia > HIST_CARDAPIO.dia`; `convDiv = 1` com `D.dia >= DIVULGA_DIA`; `convEnt = 1` com `D.dia >= HIST_ENTREGA.dia`; `convExig = 1` só do cap. 9 em diante (no cap. 8 ela ainda acontece). `socorro`, `convSocorro`: 0.
5. Cartões da lojinha (`sv.libera`): os sem `nivel` e os de `nivel` menor que o do ponto, `2` (vistos); os do `nivel` do ponto, `2` só no 2º capítulo do ponto (5, 7, 9 e Fim) e só se a pessoa do cartão está contratada na tabela (`joca`, `cami`, `anselmo`, `lia`) ou se é a `confeitaria`; os outros, `0`.
6. Equipe, cursos e melhorias pela tabela (cada nível passa por `Math.min` com o último de `STAFF.x.levels`; depois `normEquipe`, `normCursos`, `normDaniCursos`, `normJocaCursos`, `normCamiCursos`; os `up` de `confCaseira`, `confGourmet`, `confAlta` e `espresso` seguem os cursos, como no `devEquipe`).
7. Nota: `devNota(D.nota)` (cap. 1: sem nota, `aval = []`).
8. Manual: `sv.manual` = as fichas da aba `basico` + `p-<id>` de cada ponto visitado; `manualNovo = []`.
9. `writeSave`, `devRecarrega`.

**Tabela `DEV_CAPS`** (constante nova em `src/10-constantes.js`, depois de `HISTORIA`; cursos do Tonhão em `{ id:nível }`; "+" = o da linha de cima mais isto):

| n | dia | ponto (pontoDia) | caixa | nota | Tonhão | Dani | Joca | Cami | Anselmo | Lia | cursos do Tonhão | cursos da equipe | melhorias (`up`) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | garagem (1) | 0 | — | 0 | 0 | 0 | 0 | 0 | 0 | — | — | — |
| 2 | 4 | garagem (1) | 300 | 2,2 | 0 | 1 | 0 | 0 | 0 | 0 | pastel 1 | — | tenis |
| 3 | 8 | garagem (1) | 500 | 2,5 | 1 | 2 | 0 | 0 | 0 | 0 | + chapa 1 | — | + ventilador |
| 4 | 13 | industrial (13) | 400 | 2,7 | 1 | 2 | 0 | 0 | 0 | 0 | + fritos 1 | — | + bandeja, triturador |
| 5 | 17 | industrial (13) | 900 | 3,0 | 2 | 3 | 2 | 0 | 0 | 0 | + assados 1, veg 1 | Dani: confCaseira | + corrida |
| 6 | 30 | avenida (30) | 600 | 3,2 | 2 | 3 | 2 | 0 | 0 | 0 | igual | igual | igual |
| 7 | 34 | avenida (30) | 2500 | 3,5 | 3 | 4 | 3 | 1 | 2 | 0 | + restaurante 1 | + Dani: confGourmet; Joca: espresso | igual |
| 8 | 46 | terraco (46) | 1500 | 3,9 | 3 | 4 | 3 | 2 | 2 | 0 | igual | igual | igual |
| 9 | 50 | terraco (46) | 6000 | 4,2 | máx | máx | máx | 2 | 3 | 1 | + entradas 1, alta 1 | + Dani: confAlta | igual |
| Fim | 60 | terraco (46) | 10000 | 4,6 | como "Tudo no máximo" de hoje (`devEquipe('max')` e `devMelhorias(true)`), Lia 1 |

Se um id da tabela não existir (`UPGRADES`, `CURSOS`), o `devCapitulo` ignora e segue; o smoke confere que todos existem.

**Aba Dinheiro** (`game.devDinheiro(v)`, soma ao caixa com piso 0; não entra no Caixa do fim do dia):
- No Livre: só a linha "No jeito Livre, o dinheiro não acaba." e o botão **Passar para De verdade**.
- No De verdade: `Caixa: R$ X`; **+100**, **+1.000**, **+10.000**, **−1.000** e **Zerar**.
- **Banco:** a linha do empréstimo (`Sem empréstimo` ou `Falta R$ X · parcela R$ Y`); **Quitar** (`emp` vazio), **Pegar R$ 1.000** (`normEmprestimo` com `resto:1000`, `amort:200`, `j:BANCO.juros`, `ini: sv.dia`) e **Atrasar a parcela** (`emp.atr = true`, para testar a 2ª chance do banco e a tomada). O `devCaixa` de hoje sai (o Dinheiro o substitui).

**Aba Equipe e lojinha:**
- Uma linha por pessoa: `Tonhão: nível N [−] [+]`, e o mesmo para Dani, Joca, Cami, Anselmo (níveis 0, 2 e 3) e Lia (0 e 1). `game.devNivel(quem, delta)`: soma, limita entre 0 e o último nível (o Anselmo pula do 0 para o 2), chama `normEquipe(e, this.ponto)` e `devRecarrega`. No De verdade, a pessoa também fica com o cartão aberto (`libera[id] = 2`).
- **Cursos:** **Todos** e **Nenhum** (do Tonhão e da equipe, como os pedaços de cursos do `devEquipe` de hoje, separados num `devCursos(on)`).
- **Melhorias:** **Todas** e **Nenhuma** (o `devMelhorias` de hoje). **Decoração:** **Toda** e **Nenhuma** (`devDecor(on)`: todo `DECOR` do ponto, ou `{}`; a espada fica se `convPlanta` for 1). **Manutenção:** **Tudo novo** (`manut` de cada `MANUT.equip` = 1) e **Tudo gasto** (= 0,2, para testar quebras).
- **Tudo no máximo** e **Do começo** (os de hoje) ficam no alto da aba.

**Testes (`tests/smoke63.js`):** `load()` com o modo dev ligado (`game.setDev(true)`); (1) no Livre, `histLiga()` é falso e o caixa volta a R$ 10.000; (2) `devReal(true)` grava `lcc2_dev_real = '1'` e `histLiga()` fica verdadeiro com `load({historia:true})`; (3) para cada n de 1 a 10: `devCapitulo(n)` deixa `save.cap === n`, `save.salao.ponto` igual ao da tabela, `save.dia`, `save.pontoDia`, `save.bank` e os níveis da tabela, `capObj()` não nulo de 1 a 9 e nulo no Fim, `save.conversa === 'antes'` de 1 a 9; (4) todos os ids da `DEV_CAPS` existem; (5) desfazer volta o save de antes (JSON igual) e apaga `lcc2_save_dev_bak`; (6) `devDinheiro(1000)` soma 1000, `devDinheiro(-99999)` deixa 0; (7) `devNivel('anselmo', 1)` vai de 0 a 2; (8) `localStorage` `lcc2_save` (o de verdade) não mudou em nada; (9) `DEV.vel = 8` roda 8 passos por quadro (`passoJogo`). Rode `./run_all.sh` (todos verdes) e confira com uma captura recortada o painel nas 3 abas, em 900×600 e em 390×844 (cabe sem rolar a página; o painel pode rolar por dentro).
**Fecha:** `VERSAO` e selo `v10.2.1`; no painel Versões: "Modo dev novo: dois jeitos (Livre e De verdade, que joga com o Modo História), abas, pular para o começo de qualquer capítulo (e desfazer), dinheiro e banco à mão e a equipe pessoa por pessoa."; `docs/spec-v10.2.1.md`; `RESUMO.md`; PR e merge.

Modelo: Sonnet, esforço médio (plano detalhado; mexe em 5 partes, mas sem decisão de design).

### Sessão D-2 — História e Hoje (v10.2.2)
**Aba História** (só no De verdade; no Livre, a linha "A História só corre no jeito De verdade." e o botão **Passar para De verdade**):
- `Capítulo N, título` e o objetivo (`game.capLinha()`).
- **Cumprir o objetivo agora** (`game.devCumpre()`: `sv.conversa = 'depois'`, `writeSave`; fecha o painel e chama `fluxoHistoria(() => game.goShop(game.proxDia))`; com o dia em andamento, primeiro encerra como o `devFimDia`). Assim a conversa de depois, a de antes do próximo capítulo e a mudança de ponto (cap. 3, 5 e 7) acontecem como no jogo.
- **Assistir:** um `<select>` com todas as cenas e o botão **Assistir**. Itens, nesta ordem e com estes rótulos: `Abertura`; para cada capítulo, `Cap. N, antes` e `Cap. N, depois`; `A plantinha da dona Cida` (`HIST_PLANTA`), `O cardápio` (`HIST_CARDAPIO.falas`), `O cardápio, depois do curso` (`.fez`), `A divulgação` (`HIST_DIVULGA`), `Os entregadores` (`HIST_ENTREGA`), `A 2ª chance do banco` (`HIST_SOCORRO`), `O cliente exigente` (`HIST_EXIGENTE`) e, para cada `LIBERA`, `Cartão: <id>`. A lista vem de uma função `devCenas()` (em `src/43-telas.js`), montada das constantes, para que capítulos e conversas novos entrem sozinhos. **Assistir não muda o save** (`devAssistir(i)`: fecha o painel, toca com `falar(falas, volta)`; `volta` refaz a tela de antes: menu, lojinha ou dia pausado). A `Abertura` usa `abrirAbertura('menu')` e volta ao menu.
- **Revelar:** **Manual: todas as fichas** (`sv.manual` = todos os ids de `MANUAL`, `manualNovo = []`) e **Manual: só o básico** (como no passo 8 do `devCapitulo`); **Lojinha: todos os cartões** (`libera` de todos = 2) e **Lojinha: como no começo do capítulo** (o passo 5 do `devCapitulo`, sem mexer no resto).
- **Conversas soltas:** **Marcar todas como vistas** (`convPlanta`, `convCard`, `convDiv`, `convEnt`, `convExig` = 1) e **Deixar pendentes as do dia** (as mesmas, = `'pend'` quando o dia já passou do gatilho delas; tocam no próximo fim de dia).

**Aba Hoje** (vale para o **próximo dia que começar**; `DEV.forca`, na memória, zera ao sair do modo dev):
- **Clima:** `Sorteio` (padrão), `Sem clima`, `Chuva`, `Feriado`.
- **Quebra:** `Sorteio`, `Nada quebra`, `Fogão`, `Geladeira`, `Cafeteira` (o equipamento escolhido quebra no meio do turno, `f:0.4`).
- **Fiscal** (Avenida em diante): `Sorteio`, `Vem`, `Não vem` (vem em `f:0.4`).
- **Tonhão gripado:** `Sorteio`, `Gripado`, `Bem`.
- **VIP:** `Sorteio`, `Vem um VIP` (o 3º grupo do dia vira VIP; no Terraço, é o exigente).
- **Apito da fábrica** (área industrial): `Sorteio`, `Apita`, `Não apita`.
- Implementação: no `sortear(n)` (`src/16-jogo.js`), depois do sorteio, se `DEV.on && DEV.forca`, troque `clima`, `quebra` e `fiscal` pelo forçado (o fiscal forçado ignora `FISCAL.nivel` só no Livre); a gripe e o apito, onde o dia lê `day.gripe` e `ponto.apito`; o VIP, onde os grupos do dia são criados (`src/12-clientes.js`, `this.vip`). O botão fica `aria-pressed` no escolhido.
- **No dia** (com o dia pausado): velocidade e **Encerrar o dia agora** (vindos da aba Pular) e **Quebrar agora:** `Fogão`, `Geladeira`, `Cafeteira` (põe a quebra para já, no `this.quebras`, como uma sorteada).

**Testes (`tests/smoke64.js`, com `load({historia:true, imprevistos:true})`):** (1) `devCapitulo(2)` e `devCumpre()` levam ao cap. 3 depois do `fluxoHistoria` (as falas passam com `seguir` até acabar); `devCapitulo(3)` e `devCumpre()` deixam o cartão da Mudança visível; (2) `devCenas().length === 1 + 2 * HISTORIA.length + 7 + LIBERA.length`; (3) `devAssistir` de três cenas não muda o save (JSON igual antes e depois); (4) revelar todas: `manual.length === MANUAL.length`; (5) com `DEV.forca` de chuva, `Fogão` e fiscal na Avenida, o `sortear(n)` dá `clima === 'chuva'`, uma quebra de `fogao` e `fiscal` presente; `Sem clima` e `Nada quebra` dão vazio; (6) `Vem um VIP` no Terraço: o 3º grupo do dia é VIP e exigente; (7) gripe forçada: `day.gripe` verdadeiro num dia que não é o 7. `./run_all.sh` verde; captura recortada das abas História e Hoje em 390×844.
**Fecha:** `v10.2.2`; Versões: "Modo dev: a aba História cumpre o objetivo, assiste a qualquer conversa e revela o Manual e a lojinha; a aba Hoje escolhe o clima, a quebra, o fiscal, a gripe, o VIP e o apito do próximo dia."; `docs/spec-v10.2.2.md`; `RESUMO.md`; PR e merge.

Modelo: Sonnet, esforço médio (plano detalhado; o fluxo das conversas já existe, é reaproveitar).

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

## Etapa 4 — Terraço Suíça, VIPs exigentes e nível de luxo (4a, v10 a v10.4; 4b, v10.5)
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
