# v12.8.1 — Os desenhos dos pratos novos do Terraço (etapa 16b-2)

**Situação:** entregue em 20/11
**Origem:** etapa 16b do `docs/PLANO.md`, planejada em 20/11 com o usuário junto com a v12.8 (`docs/spec-v12.8.md`), que faz a Avenida, os juninos e as barracas

## Objetivo
No Terraço, cada prato tem a cara dele, com jeito de cozinha fina: porção menor, prato branco à mostra, um fio de molho e uma folhinha. O jogador sabe pelo balão que é o galeto (pela coxa dourada), o dadinho (pelos cubinhos) ou o filé ao molho de vinho (pelo arco de molho escuro). O risoto da Lia deixa de sair com o desenho do medalhão.

## Fora do escopo
- O que a v12.8 fez (a Avenida, os juninos, as barracas, o desenhinho no modo dev) e o que ela deixou de fora (barraca no salão, bandeirinhas por ponto, os pratos da Garagem e da área industrial, os 6 finos da v10.2).
- Regra de jogo: nada muda.

## Regras (decisões tomadas)
- **Onde vale, estilo e o detalhe do avançado:** os da v12.8 (`docs/spec-v12.8.md`, Regras): o desenho é o de `drawComida`, lido a 0,52; contorno escuro com `fs`, nada além de x ±13, y ±9; a cor principal é a `cor` do `CARDAPIO`, salvo onde a tabela diz outra; fritos, assados, chapa e pastel com o detalhe da técnica no avançado e os principais (`cat:'pf'`) com o raminho de ervas; os `semAv` sem avançado.
- **O jeito do Terraço:** porção menor e mais prato branco à mostra (a comida cabe em x ±10, y ±7), com um fio ou uma gota de molho e uma folhinha de guarnição, como os finos da v10.2.
- **Os pratos saem do `DESENHO_BASE`:** saem as chaves do Terraço (`galeto`, `escalope`, `coalhoMel`, `crostini`, `dadinho`, `croquete`, `folhado`, `empadinhaCam`, `vinho`) e ele fica só com os 6 da v8.6.11. Os pratos do Terraço ganham uma função nova `drawTerraco(ctx,k,av)` (devolve `true` quando desenhou), chamada em `drawComida` junto da `drawAvenida` da v12.8; o risoto da Lia ganha o seu ramo no `drawFino`.
- **Os desenhos do Terraço** (15 e o risoto da Lia):
  | Prato | O desenho (o que distingue em negrito) |
  |---|---|
  | `vinho` Filé ao molho de vinho | Um **arco de molho cor de vinho** `#5A1F2E` pincelado (traço grosso curvo de ponta a ponta, com brilho), o **filé alto** (retângulo arredondado 9 × 7, marrom `#7A3F2A`, com a borda de cima mais clara) em cima do arco e um **purê em gota** branco-creme ao lado; um raminho de alecrim (3 risquinhos verdes). Bem diferente do medalhão (redondo, molho madeira, batatas e vagem). |
  | `galeto` Galeto com legumes | **Meio galeto**: a **coxa** (forma de coxinha de frango com o ossinho branco saindo) e a sobrecoxa, pele assada dourada `#C98A4B` com brilho; ao lado, 3 legumes (cenourinha laranja, rodela de abobrinha verde-clara, tomatinho vermelho). |
  | `escalope` Escalope ao molho de cogumelos | **3 escalopes finos em leque** (ovais 8 × 5 sobrepostos, marrom `#9A6A45`), com o **molho bege** `#D9C7A0` escorrendo por cima e 3 fatias de cogumelo (o desenho do risoto, menores); salsinha. |
  | `dadinho` Dadinho de tapioca | **5 cubinhos dourados** (quadrados 5 × 5, face de cima mais clara `#F4E6B8`, lado `#E3B25A`, para ter cara de cubo) em pirâmide; um **potinho de geleia de pimenta** vermelho `#C8302B`. |
  | `croquete` Croquete de costela | **3 cilindros empanados** deitados (retângulos arredondados 11 × 5, marrom-dourado `#B8793A`, áspero com pintinhas) e uma **gota de mostarda** amarela `#E8B830`. |
  | `folhado` Folhado de brie | Um **quadrado de massa folhada** (11 × 9, `#E6C27A`) com **3 linhas de camadas** na lateral, o **brie branco** escorrendo pela frente e uma gota de geleia de frutas vermelhas `#B0203A` em cima. |
  | `empadinhaCam` Empadinha de camarão | **Duas empadinhas pequenas** (forminha canelada, a de hoje em escala 0,6) e, em cima de cada uma, **um camarão inteiro** em C, rosa-alaranjado `#E7A972` com listrinhas. |
  | `coalhoMel` Queijo coalho com melaço | **3 cubos de queijo coalho** grelhados (o queijo do `coalho`, em cubos 6 × 6) em fila, com um **fio de melaço** âmbar `#8A4A1A` em zigue-zague por cima. |
  | `crostini` Crostini de presunto cru | **3 fatias ovais de pão** fininhas (`#D9A25B`) em diagonal, cada uma com o **presunto cru em dobra** (onda rosada `#D79A8A` com veio branco) e uma folha de rúcula verde-escura. |
  | `pastelCamarao` Pastelzinho de camarão | **3 pasteizinhos meia-lua pequenos** com a **borda de garfo** (dentinhos na curva), dourado `#EBAE7A`, e um camarão em C ao lado (o da empadinha). |
  | `ravioli` Ravioli frito de queijo | **4 quadradinhos de borda serrilhada** (zigue-zague nas 4 bordas, `#EED08A`) em xadrez, com um **potinho de molho de tomate** vermelho. |
  | `nhoque` Nhoque de abóbora na sálvia | **7 travesseirinhos laranja** `#E8B455` (ovais 4 × 3 com 2 riscos de garfo) numa poça de manteiga dourada clara e **3 folhas de sálvia** verde-acinzentadas `#7E9C6A`. |
  | `polenta` Polenta com legumes grelhados | **2 retângulos de polenta** amarelos `#EBCB6A` com marcas de grelha e, ao lado, rodelas de abobrinha (verde com miolo claro) e uma tira de **pimentão vermelho** grelhado. |
  | `curry` Curry de grão-de-bico | Uma **cumbuca branca funda** com o curry amarelo-alaranjado `#D99A3A` e **6 grãos-de-bico** (bolinhas bege `#E8D2A0` com risquinho) e coentro; ao lado, uma montanhinha de **arroz branco**. |
  | `moquecaPalmito` Moqueca de palmito | A **panela de barro preta** capixaba (círculo `#2E2A28` com alças) com o caldo laranja, **4 rodelas de palmito** (branco-creme com miolo), pimentão e coentro. Diferente da de banana: panela preta, rodelas brancas. |
  | `liaRisoto` Risoto de feijão-manteiguinha | No `drawFino` (hoje cai no `else` e sai como medalhão): o risoto cremoso como o de cogumelos (`#F2E3B5`), sem cogumelos, com **8 grãozinhos de feijão-manteiguinha** (ovais 2 × 1,3 amarelo-pálidos `#E8D27A` com contorno fino), lascas de queijo e uma folha verde. Sem avançado (o curso dele, `liaAutor`, não está em `CURSOS`). |
- **Modo dev:** o desenhinho da seção "Cardápio do ponto" (feito na v12.8) já mostra os pratos do Terraço com o ponto no Terraço; o risoto da Lia aparece quando ela está ativa com o curso de autor.
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** O `DESENHO_BASE` só tem os 6 pratos da v8.6.11 → `smoke111` (1)
- **CA2** Cada prato vendido no Terraço (com o risoto da Lia) tem desenho diferente de todos os outros pratos do Terraço (a assinatura do `smoke110`), com e sem o avançado; o risoto da Lia é diferente do medalhão e do risoto de cogumelos → `smoke111` (2)
- **CA3** Nos pratos novos do Terraço que têm avançado (não `semAv`, nem o risoto da Lia), o desenho com `av` é diferente do desenho sem; nos `semAv`, igual → `smoke111` (3)
- **CA4** Todos os desenhos novos rodam sem erro em `drawDish` (com e sem `av`) e em `drawMarmita` → `smoke111` (4)
- **CA5** O painel do modo dev, no Terraço, mostra um desenho para cada prato do cardápio do ponto → `smoke111` (5)
- **CA6** Cada prato se reconhece no balão, na mesa, no balcão e no cartão, e nada passa da borda do prato → captura `shot_v12_8.js` com a lista do Terraço: a grade dos pratos do Terraço e do risoto da Lia a 0,52, 0,9 e 1,7 (recorte ampliado de cada linha), uma mesa do Terraço com o balão e o balcão de pratos cheios e o cartão Cardápio do Terraço; 844x390 e 568x320

## Partes
- `src/20-desenho-base.js`: `DESENHO_BASE`, `drawComida` (a chamada da `drawTerraco`, nova), `drawFino` (o ramo do `liaRisoto`)
- `tests/smoke111.js` (novo, com a assinatura do `smoke110`) e `tests/shot_v12_8.js` (a lista do Terraço)

## Tarefas
- [x] T1 `smoke111` com os CA1 a CA5 (falhando).
- [x] T2 Os 15 desenhos do Terraço, com o detalhe do avançado.
- [x] T3 O risoto da Lia no `drawFino`.
- [x] T4 `shot_v12_8.js` com o Terraço e a conferência do CA6 (recortes ampliados; ajustar o que não se lê a 0,52 ou passa da borda; olhar e apagar).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A assinatura do desenho e a grade de pratos para olhar já estão no `smoke110` e no `shot_v12_8.js` da v12.8: reuse (copie a função da assinatura; não mexa nas checagens do `smoke110`).
- Os juninos do Terraço já foram feitos na v12.8: não são desta versão.

## Testes
- `smoke111` novo (CA1 a CA5), no `run_all.sh`. O `smoke110` (CA1 da v12.8) continua valendo.
- Sem mudança no `balance.js` nem no `carreira.js`.

## Decisões em aberto
Nenhuma. (20/11: o usuário aprovou os desenhos das tabelas como ponto de partida, com o ajuste fino na conferência das capturas, o detalhe do avançado da técnica e o raminho de ervas nos principais, e a divisão em duas versões.)

## Desvios
Nenhum. `smoke111` com 11 checagens (CA1 a CA5) verde; CA6 conferido na grade a 0,52, 0,9 e 1,7 (`PONTO=terraco node shot_v12_8.js`, que ganhou a mesa e o cartão do Terraço): todos os pratos se reconhecem e cabem no prato. Regras corrigidas: nenhuma.

**Modelo:** Sonnet, esforço médio (desenho no canvas com plano detalhado; a conferência das capturas pede olho, não decisão)
