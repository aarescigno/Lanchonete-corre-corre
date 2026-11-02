# Plano da proposta 2: "Na palma da mão" (branch `proposta/na-palma-da-mao`)

> A proposta está em `docs/REDESENHO.md` (proposta 2), e o usuário a escolheu para **explorar** em 02/11. **É uma exploração, não a substituta do jogo:** a versão que vem sendo construída desde a v1 (a "clássica", no `claude/main`) continua sendo o jogo e nunca é sobrescrita por este branch. Se a exploração der certo, ela pode virar um **jogo paralelo** (outro arquivo e outro artifact), ao lado da clássica. Este é o roteiro das sessões **neste branch**. No pedido "a próxima etapa" neste branch, faça a próxima sessão da tabela abaixo; o `docs/PLANO.md` é o roteiro do main.

## Regras do branch
- **A clássica fica intacta:** nunca há PR nem merge deste branch no `claude/main`. Cada sessão faz commit e push só em `proposta/na-palma-da-mao`. O `lanchonete.html` daqui é a montagem do branch, e nunca vai para o main, para o GitHub Pages nem para o artifact do jogo. A tag `classica-v9.6.11` marca o ponto de partida.
- **O main segue o roteiro dele** (`docs/PLANO.md`). Em 02/11 o usuário pediu que a 4a esperasse um pouco pela exploração, mas é só uma questão de agenda: os dois podem andar juntos.
- **Trazer as correções do main:** toda sessão começa com `git fetch origin claude/main && git merge origin/claude/main`. Em conflito numa parte reescrita aqui, vale a versão do branch, e a correção é refeita no formato novo.
- **Versões de prévia:** `VERSAO = 'palma.N'`, selo `vtag` "em pé · prévia N" (sem número de versão da clássica, para não parecer a sucessora). A lista do painel `#ov-ver` ganha a linha da prévia. Prévias **não** vão para `versoes/`: elas são guardadas só se a proposta for aprovada. Em vez de um `spec-vN.md` por versão, há um só `docs/spec-palma.md`, com uma seção por prévia (o que entrou e os testes).
- **Artifact próprio:** as prévias são publicadas num artifact separado, nunca no do jogo oficial, e só quando o usuário pedir. Na 1ª publicação, sem `url`, nasce uma página nova com o título "Lanchonete em pé (prévia)"; anote o link aqui, em **Artifact da prévia**. O GitHub Pages continua mostrando o main.
- **Artifact da prévia:** (ainda não publicado)

## Decisões (com o usuário, 02/11)
1. **Branch:** `proposta/na-palma-da-mao`, uma cópia do main da v9.6.11 que anda separada. A clássica continua no main.
2. **No computador:** o jogo em pé no centro e o **celular da Bia ao lado, sempre aberto**. Neste branch, a única tela de jogo é a em pé (a tela deitada continua sendo a da clássica).
3. **A equipe:** cada pessoa **faz a sua parte sozinha, como hoje**, e **atende ao chamado** quando o jogador arrasta o rosto dela até uma tarefa; depois volta à rotina.
4. **Tudo o que não é turno** mora no celular da Bia (lojinha, fim do dia, conversas, Manual, ranking, pausa).

## A tela em pé
**Mundo lógico de 600 × 1040** (antes: 960 × 600, mais a calçada de 260 à esquerda). No celular em pé (390 px de largura), a escala fica em 0,65, a mesma de hoje no celular deitado, então **os bonecos e os objetos mantêm o tamanho de desenho atual**. O mundo encaixa pela largura. Em celular mais alto, a sobra vai em cima e embaixo, com a cor da parede e da rua, sem faixa preta.

Faixas (y, de cima para baixo), com os retângulos `{x0, y0, x1, y1}` do mundo. O executor pode mexer até 20 px para o desenho caber, sem mudar a ordem nem a faixa de cada coisa:

| Faixa | y | O que tem |
|---|---|---|
| Topo | 0–64 | à esquerda, a pílula do dinheiro com as 3 estrelas; no centro, o letreiro do ponto; à direita, o relógio (r 28) |
| Cozinha | 64–224 | da esquerda para a direita: **PEDIDOS** com o Tonhão na janela (8–168), **PRONTOS** (172–332, vagas de prato em fileira em y 184), **CAFÉ** (336–416), **SUCOS** (416–496) e **PIA** (500–592). Balcão da frente em y 200–224 |
| Corredor | 224–296 | onde a Bia atende as estações; o `ap` de cada estação em y 256, embaixo dela |
| Salão | 296–752 | mesas na `area` do ponto; nas paredes laterais (x 8–68 e 532–592), as estações extras |
| Calçada | 752–944 | a parede da frente com a porta (x 250–350) em y 752; a espera em **2 fileiras de 3** (y 820 e 900); o balcão de retirada à direita; a bebida da espera à esquerda |
| Barra | 944–1040 | rostos da equipe, pausa e som |

- **`STATIONS`** (`ap` → retângulo):
  - order (88,256) → 8,72,160,128
  - plates (252,256) → 172,72,160,128
  - coffee (416,256) → 336,72,80,128
  - juice (416,256) → 416,72,80,128
  - sink (546,256) → 500,72,92,128
  - marmj (90,268) → 8,232,56,68 (parede esquerda, logo abaixo da cozinha)
  - doces (90,348) → 8,316,56,64
  - drinks (90,470) → 8,410,56,120 (Anselmo atrás, em x 36)
  - trash (510,330) → 548,300,44,60
  - espresso (510,420) → 548,392,44,56
  - retirada (512,736) → 440,756,140,48 (a Bia atende de dentro)
  - maquina (70,800) → 16,770,64,80 (na calçada)
  - adiantar: dentro de PEDIDOS, desligado como hoje
- **Mesas:** `area` da Garagem x 96–504, y 304–744; da área industrial e da Avenida, x 72–528, y 304–744. Cabem até 9 mesas de 4: a mesa de 4 tem meia largura de 62 e o `SALAO.gap` é 46. O editor do salão, a arrumação automática e o `salaoCaminho` continuam iguais, só com os limites novos. A entrada do caminho deixa de ser a fila lá fora e passa a ser a porta, por dentro (300, 744).
- **Espera:** `QUEUE` passa a ser uma lista de lugares `{x, y}`, e não mais um x com vários y. Garagem (4): (300,820), (190,820), (80,820) e (300,900). Área industrial (5): mais (190,900). Avenida (6): mais (80,900). O 1º lugar é o mais perto da porta. Quem chega vem da rua (`DOOR` = (300, 1060), fora da tela embaixo).
- **Retirada:** a fila dos entregadores fica embaixo do balcão: (470,840), (520,880) e (560,920). As vagas das marmitas ficam no tampo do balcão.
- **Casa de cada um:** `BIA` começa em (300,600); `DANI_HOME` (520,300); `JOCA_HOME` (520,460); `CAMI_HOME` (480,700); `ANSELMO_HOME` (36,470).
- **Some da tela do turno:** a faixa "CARDÁPIO DA CASA", que vai para o contato do Tonhão no celular. O quadro-negro "HOJE" fica no salão, na parede esquerda.
- **`g.cam` vira 0**, porque não há mais calçada à esquerda, e `CALCADA.w` sai do cálculo da tela.
- **Abertura animada:** continua deitada (é um filme). Em tela em pé, toca numa caixa de cinema no meio, em escala 600/1220, com a dica "Vire o celular para ver maior" quando o aparelho estiver em pé. Se o aparelho for virado, a abertura enche a tela deitada. O jogo em si não gira.

## A equipe na mão (chamado)
- **A barra** mostra os rostos de quem trabalha no dia, nesta ordem: Bia, Dani, Joca, Cami e Anselmo. Tonhão não entra, porque fica na cozinha. Cada rosto tem 64 px, com o anel da cor da pessoa.
- **O rosto da Bia não arrasta.** Ele mostra, num número pequeno, quantas ações há na fila dela. A Bia continua sendo comandada por toques, como hoje.
- **Arrastar o rosto de um ajudante e soltar sobre uma mesa ou uma estação** chama essa pessoa para aquela tarefa. Cada um só aceita o que já sabe fazer no jogo de hoje; não entra tarefa nova:
  - Dani: as `DANI_TASKS` do nível dela (lixo, recolher pratos, lavar, suco, marmita), mais os doces quando é confeiteira;
  - Joca: o básico, mais o espresso;
  - Cami: anotar, entregar, cobrar e recolher na mesa, mais o básico quando é a dona dele (`donoBasico`);
  - Anselmo: só drinks. O rosto dele tem o selo "só drinks" e volta para o lugar se for arrastado.
- **Tarefa fora do alcance:** o rosto volta para a barra, e a pessoa diz no balão "Não é comigo!" (2 s).
- **Atender ao chamado:** a pessoa termina o passo que está fazendo (o item que já está na mão), vai até o alvo, faz a tarefa e volta para a rotina dela.
  - O rosto ganha um "!" enquanto ela atende.
  - Um chamado novo para a mesma pessoa substitui o anterior.
  - O chamado cai sozinho em 15 s se o alvo não precisar mais de nada (a mesa foi embora, a pia esvaziou).
- **Código:** `Game.chamar(quem, alvo)` guarda `helper.chamado = { tipo, alvo, ate }`, e `Helper.think()` (`15-dani.js`) olha o chamado antes da rotina. A Cami usa a mesma entrada.
- **O bot não usa o chamado**, então os alvos do `balance.js` continuam valendo.

## O celular da Bia (DOM)
- **Onde aparece:**
  - Em tela larga (`innerWidth / innerHeight >= 1`), o celular fica **ao lado do jogo, sempre aberto**, com altura de 92% da tela e proporção 9:19.
  - Em tela estreita (celular em pé), ele ocupa a tela inteira, por cima do jogo, quando abre: no fim do dia, na pausa e no menu de ajustes.
- **Telas:**
  - `bloqueio`: hora de mentira ("18:04" no fim do dia), "terça · fim do dia 7" e as notificações em cartões;
  - `inicio`: a grade de apps e o botão grande "Abrir amanhã ›", que é o atual "Começar o dia N";
  - `app`: cabeçalho com "‹" para voltar, mais o conteúdo.
- **Apps**, com nome, cor e o que reaproveitam. Cada app só aparece quando o 1º cartão dele é liberado na história (as mesmas regras do `LIBERA`), e a tela inicial cresce como o Manual:
  1. **Papo** (#2ECC71): as conversas do Modo História como mensagens (grupo "Corre-Corre"), com o histórico das já vistas.
  2. **Gurugol** (#E67E22): a aba Gurugol de hoje, mais os comentários do dia em balões (os da 3g-2).
  3. **Caixa** (#1E8A4C): o resumo do dia (o atual `#ov-end`), o livro-caixa e o banco e empréstimo (a aba Dinheiro).
  4. **Lojinha** (#C0392B): Melhorias, Salão (o editor, que abre em tela cheia), Decoração e Manutenção.
  5. **Equipe** (#8E44AD): os contatos Tonhão (com Cardápio e cursos), Dani, Joca, Cami e Anselmo, com as bolinhas de nível, o aumento e os cursos.
  6. **Divulga** (#D35400): a Divulgação.
  7. **Mapa** (#2D6CDF): os pontos e a Mudança.
  8. **Manual** (#F1C40F): o Manual de hoje.
  9. **Ajustes** (#7F8C8D): som, Missão zero, Ver abertura, Ranking, Versões, Instalar no celular, Recomeçar do zero, Menu principal e Sair do modo dev.
- **Bolinha vermelha** num app quando há novidade: cartão `'novo'` ou `'pend'`, ficha nova no Manual ou conversa não lida.
- **Fim do dia:**
  1. a porta fecha;
  2. se houver conversa, chega a notificação ("Tonhão: Bia, vem cá…") e o Papo abre e toca a conversa (toque para seguir, "Pular" no alto);
  3. vem o bloqueio com as notificações, nesta ordem: o comentário mais forte do Gurugol, "Hoje sobrou R$ X" com as estrelas, o objetivo do capítulo (quando avança) e as novidades;
  4. um toque leva ao início.
  - Capítulo concluído (o `#ov-continua`) e falência viram notificações grandes no bloqueio, com o mesmo texto e os mesmos botões de hoje.
- **Durante o turno, em tela larga:** o celular mostra o bloqueio "Em serviço", com as notas do Gurugol chegando ao vivo ("★★★★ Família"), e os apps ficam trancados. No celular em pé, nada aparece durante o turno.
- **Pausa:** o celular abre no início, com a faixa "Pausado" e o botão "Continuar". Durante o turno, só Papo (leitura), Manual e Ajustes abrem; os apps de compra ficam trancados.
- **Menu principal:** continua o `#ov-menu`, agora em pé, por cima da fachada da lanchonete desenhada no canvas.
- **Turno sem fim:** igual ao de hoje; no fim, abre o Ranking (em Ajustes).

## O que sai da tela no turno
- Saem do Modo História os **pontos**, "grupos 11/24", "Gurugol sem nota" e a 3ª estrela por escrito. O Turno sem fim mantém os pontos, que são o recorde.
- **Topo:** a pílula do dinheiro com as 3 estrelas da meta, que acendem quando o lucro chega a cada uma.
- **Fila de ações da Bia:** vira bolinhas numeradas acima da cabeça dela, no máximo 8 (o Sudoku aumenta, como hoje). A bandeja e a mão aparecem no próprio boneco.

## Sessões
| # | Sessão | Prévia | Modelo |
|---|---|---|---|
| P2-1 | Esqueleto em pé | palma.1 | Sonnet, alto |
| P2-2 | Cenário da Garagem em pé | palma.2 | Sonnet, alto |
| P2-3 | Área industrial e Avenida em pé | palma.3 | Sonnet, médio |
| P2-4 | Barra nova e a equipe na mão | palma.4 | Sonnet, alto |
| P2-5 | O celular da Bia: estrutura, fim do dia, Gurugol e Caixa | palma.5 | Sonnet, alto |
| P2-6 | O celular da Bia: Lojinha, Equipe, Mapa, Manual e Ajustes | palma.6 | Sonnet, médio |
| P2-7 | Papo, abertura em caixa de cinema e Missão zero | palma.7 | Sonnet, alto |
| P2-8 | Acerto final e avaliação | palma.8 | Sonnet, alto; a avaliação com o Opus |

### P2-1 — Esqueleto em pé (palma.1)
**Entra:**
- O mundo de 600 × 1040 e o `LAYOUT` novo (tabela acima) em `10-constantes.js`: `W`, `H`, `TW`, `STATIONS`, `QUEUE` como lista `{x,y}` (`queueYsFor` → `queueLugares(n)`), `RETIRADA`, `DOOR`, `PLATE_SLOTS` (fileira em y 184, de 184 a 320), `MARMJ_SLOTS` (empilhadas na mesinha), `BOUNDS` (x 8–592, y 232–744), as casas da equipe, `TRASH.pos` e o `area` dos `PONTOS`.
- `g.cam = 0`.
- `fit()` e `toLogical()` em `43-telas.js`, com o canvas em pé e a sobra com a cor da parede e da rua.
- A fila e a chegada pela rua de baixo em `12-clientes.js`, com `filaPos` e a espera em 2 fileiras.
- O `salaoCaminho` com a entrada pela porta.
- **Desenho provisório:** o cenário com blocos lisos e o nome de cada estação (sem arte), para os 3 pontos; a barra de baixo antiga espremida na faixa de 944 a 1040.
- O jogo precisa ser jogável do começo ao fim de um dia.
**Partes:** `10-constantes.js`, `12-clientes.js`, `14-bia.js`, `15-dani.js` (casas), `16-jogo.js` (`cam`, `hudHit`, `onDown`), `21-cenario.js` (provisório), `22-salao-hud.js`, `23-render.js`, `43-telas.js`.
**Testes:**
- `run_all.sh` verde, com as coordenadas dos smokes que tocam a tela atualizadas: `smoke`, `smoke13`, `22`, `26`, `34`, `39` a `43`, `42b`, `45`, `47`, `49`, `50` e `56`.
- Smoke novo `smoke58`: o mundo é 600 × 1040; todo `ap` fica dentro do `BOUNDS`; todo lugar da espera fica na calçada; a arrumação automática põe 6 mesas de 4 na Avenida e 4 mesas na Garagem com caminho; e um grupo vai da espera à mesa e paga.
- Rode `node balance.js` e anote o resultado no `spec-palma.md`, sem corrigir ainda.
**Modelo:** Sonnet, alto (muitas partes ao mesmo tempo e coordenadas em todo canto).

### P2-2 — Cenário da Garagem em pé (palma.2)
**Entra:**
- O `21-cenario.js` passa a ter **uma função por objeto**, que recebe a posição do `LAYOUT`. Assim o editor de desenhos (`ferramentas/editor.py src/21-cenario.js`) consegue mover os objetos.
- A arte da Garagem em pé:
  - a parede do topo com o letreiro "LANCHES da Bia e do Tonhão", as bandeirinhas e o relógio;
  - a cozinha em faixa (o Tonhão na janela, PRONTOS, CAFEZINHO, SUCOS e PIA);
  - o corredor e o piso;
  - a porta de enrolar na parede da frente;
  - a calçada com a torneira, a espera em pé, o balcão de retirada, a mesinha das marmitas, a lixeira com a fumaça (a da 3g-2) e o quadro-negro "HOJE".
- **As 14 decorações** ganham lugar nas paredes laterais e na de cima. Os nomes e preços continuam; as posições ficam numa tabela `DECOR_POS` no `10-constantes.js`.
- Os textos flutuantes (piso em y 120), os selos e os crachás da 3e-1 são revistos para a tela em pé.
**Partes:** `20-desenho-base.js` (só se faltar ajuda de desenho), `21-cenario.js`, `22-salao-hud.js`, `10-constantes.js` (`DECOR_POS`).
**Testes:** `shot_palma.js`, novo e no molde do `shot_3e.js`, com a Garagem no pico em 390×844 e 1220×600, nos dias 1, 4 e 7; `run_all.sh` verde.
**Modelo:** Sonnet, alto (desenho grande, com o plano das posições pronto).

### P2-3 — Área industrial e Avenida em pé (palma.3)
**Entra:**
- **Área industrial:** as TVs (parede de cima do salão), o assento da espera, a jarra de suco, o fogão industrial, o apito com a turma chegando pela rua, a encomenda e o piso e o letreiro dela.
- **Avenida:**
  - os sofás da espera, nas 2 fileiras;
  - a vitrine refrigerada e a geladeirinha de doces na parede esquerda, mais o espresso na direita;
  - o balcão de drinks do Anselmo na parede esquerda;
  - as flores da calçada, o couvert e o som, a TV e a Cami;
  - o piso de taco, o letreiro "Corre-Corre restaurante" e o fiscal.
- Cada ponto mantém a paleta de hoje.
**Partes:** `21-cenario.js`, `10-constantes.js` (posições que faltarem).
**Testes:** `shot_palma.js` com os 3 pontos no pico em 390×844 e 1220×600; `run_all.sh` verde.
**Modelo:** Sonnet, médio (repete o molde da P2-2).

### P2-4 — Barra nova e a equipe na mão (palma.4)
**Entra:**
- O topo com a pílula do dinheiro e as 3 estrelas.
- A barra com os rostos.
- A fila de ações como bolinhas sobre a Bia, e a bandeja e a mão no boneco.
- Saem os pontos e os outros números do Modo História (o Turno sem fim mantém os pontos).
- O **chamado** (seção "A equipe na mão"), com o arrasto do rosto pelo `onDown`/`onMove`/`onUp`, a sombra do rosto seguindo o dedo e o alvo aceso quando aceita.
**Partes:** `22-salao-hud.js`, `16-jogo.js` (`hudHit`, `onDown`, `onUp`, `chamar`), `15-dani.js` (`chamado` no `think`), `14-bia.js` (bolinhas), `23-render.js`.
**Testes:** smoke novo `smoke59`:
- a Dani chamada à pia, com louça na pia e ela no lixo, chega à pia em até 6 s e lava;
- a Dani arrastada para uma mesa sem tarefa dela recusa ("Não é comigo!") e segue na rotina;
- o Anselmo não arrasta;
- o chamado cai em 15 s quando o alvo não precisa mais;
- no Modo História, a barra não desenha os pontos, e no Turno sem fim desenha.
**Modelo:** Sonnet, alto (regra nova de comportamento da equipe e toque).

### P2-5 — O celular da Bia: estrutura, fim do dia, Gurugol e Caixa (palma.5)
**Entra:**
- O `#celular` no `02-telas.html`, com o estilo no `01-estilo.css`: o celular ao lado em tela larga e por cima em tela estreita.
- As telas `bloqueio`, `inicio` e `app`.
- O fim do dia novo (a sequência da seção do celular, sem o Papo ainda: as conversas continuam como hoje até a P2-7).
- Os apps **Gurugol** e **Caixa** (reaproveitando o conteúdo do `#ov-end` e das abas Gurugol e Dinheiro).
- O botão "Abrir amanhã".
- A pausa no celular.
- As notas ao vivo em tela larga.
- Os painéis `#ov-end` e `#ov-pause` saem.
**Partes:** `02-telas.html`, `01-estilo.css`, `42-resultados.js`, `41-lojinha.js` (abas Gurugol e Dinheiro), `43-telas.js` (troca de telas), novo `44-celular.js` (fecha antes do `})()`, que passa a fechar no `44`).
**Testes:**
- `celular_fit.py`, novo e no molde do `menu_fit.py`: o celular não rola em 360×640, 390×844 e 1220×600.
- Smoke novo `smoke60`: o fim do dia leva ao bloqueio com as notificações na ordem; o toque leva ao início; "Abrir amanhã" começa o dia seguinte; a pausa abre o celular e "Continuar" volta ao turno.
- `run_all.sh` verde (os smokes que clicam no `#ov-end` mudam para o celular).
**Modelo:** Sonnet, alto (muito DOM e troca de telas).

### P2-6 — O celular da Bia: Lojinha, Equipe, Mapa, Manual e Ajustes (palma.6)
**Entra:**
- Os apps **Lojinha**, **Equipe** (com o Cardápio no contato do Tonhão), **Divulga**, **Mapa**, **Manual** e **Ajustes**, reaproveitando os cartões e as telas da lojinha de hoje (`41-lojinha.js`) e o Manual (`40-interface.js`).
- As bolinhas de novidade.
- Os apps aparecem com o `LIBERA`.
- Saem o `#ov-shop` e o `#ov-manual` como telas soltas; o conteúdo fica nos apps.
- O editor do salão abre em tela cheia em pé (o canvas com a grade de mesas).
**Partes:** `41-lojinha.js`, `40-interface.js`, `44-celular.js`, `02-telas.html`, `01-estilo.css`.
**Testes:** os smokes da lojinha passam a abrir pelos apps (mesmos itens e preços); smoke novo `smoke61` (o app aparece quando o cartão é liberado, a bolinha acende e apaga ao abrir e os apps de compra ficam trancados na pausa); `celular_fit.py` com os apps.
**Modelo:** Sonnet, médio (mover telas prontas para dentro dos apps).

### P2-7 — Papo, abertura em caixa de cinema e Missão zero (palma.7)
**Entra:**
- **Papo:** as conversas do Modo História viram mensagens. O balão vem de quem fala, com o nome e a cor de `HIST_NOMES`; um toque segue, e "Pular" pula.
  - O histórico das conversas fica no app.
  - O `drawConversa` em cima do salão sai; a ordem e as regras (até 2 por dia, no fim do turno) continuam.
- **Abertura** em caixa de cinema com a dica "Vire o celular para ver maior", inteira na tela quando o aparelho estiver deitado.
- **Missão zero** refeita para a tela em pé: os mesmos passos e textos, com as posições novas e a explicação do chamado num passo novo ("Arraste o rosto da Dani até a pia"), mostrado só quando a Dani chega (cap. 2), como dica única.
- **Menu principal** em pé, por cima da fachada.
**Partes:** `19-conversa.js`, `26-conversa.js` (sai ou fica só a caixa), `44-celular.js`, `17-treino.js`, `24-treino.js`, `25-abertura.js` (só o encaixe), `40-interface.js` (menu), `43-telas.js`.
**Testes:** os smokes da Missão zero e das conversas (`smoke34`, `smoke56` e os que citarem `game.conversa`) atualizados; smoke novo `smoke62` (conversa no Papo na ordem, o histórico guarda e a dica do chamado aparece uma vez).
**Modelo:** Sonnet, alto (o tutorial depende de tudo o que mudou).

### P2-8 — Acerto final e avaliação (palma.8)
**Entra:**
- **Balanceamento** com o `balance.js` (alvos de sempre: sem equipe, ~40–70% das metas nos dias 3 a 7; `EQUIPE=auto`, ~85–95%) e o `carreira.js`.
  - O ajuste é na velocidade da Bia (`BIA_SPEED.base`, hoje 300), em passos de 10, entre 260 e 340.
  - Se só a área industrial ou a Avenida saírem do alvo, ajuste o `grupos` do ponto, em passos de 0,05.
- O modo dev em pé.
- `menu_fit.py` e `celular_fit.py`.
- Capturas finais.
- Prévia publicada no artifact próprio (quando o usuário pedir).
- Lista do que testar num celular de verdade.
**Avaliação:** sessão com o Opus para o usuário decidir entre três caminhos: seguir explorando, guardar o branch como está ou fazê-lo virar um **jogo paralelo** (nome, arquivo e artifact próprios, por exemplo `lanchonete-em-pe.html`, morando ao lado da clássica sem trocar nada nela). Em qualquer caminho, a clássica não muda.
**Modelo:** Sonnet, alto (balanceamento por tentativa); a avaliação com o usuário com o Opus.
