# v10.10 — A noite da estrela: o jantar do crítico, o Bráulio à mesa e as estrelas do Michelzão (etapa 6c)

**Situação:** entregue em 13/11
**Origem:** a Etapa 6 do `docs/PLANO.md`, terceira das quatro sessões do final (planejamento de 13/11, `docs/PROPOSTAS.md`). Decisões do usuário: 1 estrela cumpre o sonho e 3 estrelas são o desafio duro, com direito a tentar de novo; o Bráulio é rival até o fim.

## Objetivo
O último desafio do jogo: uma noite que o jogador escolhe, com a casa cheia, o crítico à mesa de cara limpa e o Bráulio sentado para achar defeito no molho. No fim, o Michelzão dá o veredito, de nenhuma a três estrelas, pesando as visitas do crítico, o Gurugol, o luxo e a noite. Uma estrela fecha a história; quem quiser mais prepara a casa e marca outra noite.

## Fora do escopo
- A cena final animada, os créditos e a placa na parede: v11 (`docs/spec-v11.md`). Aqui o veredito sai numa conversa e no boletim.
- Perder estrela (as estrelas nunca caem).
- O ranking por estrelas (fica para a Etapa 7, com o ranking compartilhado).

## Regras (decisões tomadas)
- **Constante nova** em `src/10-constantes.js`, depois do `CRITICO`:
  ```js
  const NOITE = { groups:1.3, meta:1.2, critico:[0.35, 0.45], braulio:[0.5, 0.6], brauPat:0.7, brauFeliz:4, espera:3, volta:0.12,
    pts:{ visita:1.5, nota:[[4.8, 15], [4.6, 10], [4.4, 5]], luxo:[0, 0, 0, 5, 10, 15], dia:[0, 5, 10, 15], salao:5, braulio:5 },
    cortes:[50, 72, 90], linhas:['Crítico', 'Gurugol', 'Luxo', 'A noite', 'Salão', 'Bráulio'],
    aviso:'Noite da estrela: casa cheia, o crítico à mesa e o Bráulio de olho.',
    selo:['Recomendado pelo Michelzão', '★ no Michelzão', '★★ no Michelzão', '★★★ no Michelzão'],
    falas:{ senta:'Vim provar a cópia.', prova:'Esse molho...', feliz:'...', bravo:'Sabia! Amadores.' } };
  ```
- **Marcar a noite:** no Terraço, com `save.cap >= 14`, a lojinha mostra no topo da seção **Cardápio** o cartão "Noite da estrela" ("?" da ficha `l-noite`, sem preço) com o botão "É hoje!". Marcada (`save.guia.noite = dia` que vai começar), o botão vira "Marcada ✓" e um segundo toque desmarca. Depois de uma noite jogada, o cartão fica apagado, com o texto "O crítico volta em N dias", por `NOITE.espera` = 3 dias. Com 3 estrelas, o cartão some.
- **O dia da noite** (o dia marcado, do começo ao fim; recomeçar o dia continua sendo a noite):
  - grupos do dia × `NOITE.groups` = 1,3; as metas do dia × `NOITE.meta` = 1,2 (meta, a do meio e a expert);
  - sem clima, sem evento de bairro, sem quebra nova e sem crítico surpresa; a introdução do dia mostra o `NOITE.aviso`;
  - **o crítico** chega entre 35% e 45% da janela de chegadas, sozinho, **sem disfarce**: VIP exigente com a plaquinha do Michelzão na mesa (a plaquinha de exigente com uma estrela vermelha no lugar das duas douradas) e o caderninho da v10.9. A ficha dele é a mesma da v10.9;
  - **o Bráulio** chega entre 50% e 60% da janela, sozinho: VIP exigente com paciência × `NOITE.brauPat` = 0,7, desenhado com bigode grande e paletó bordô (`AB_COR.aurora`, `#7A2E3A`), sem chapéu, lenço nem echarpe, com a plaquinha de exigente comum. Fala em balão curto em cima da cabeça (o mesmo balão da vontade da freguesia, v10.5.3): ao sentar, `falas.senta`; ao receber o Prato da Rosa, `falas.prova`; ao sair com `NOITE.brauFeliz` = 4 corações ou mais, `falas.feliz`; ao sair com menos, `falas.bravo`. Nome "Bráulio" em cima do balão.
  - O crítico e o Bráulio entram na agenda como grupos a mais (não trocam grupo do dia).
  - **A cara da noite:** a janela do Terraço mostra o céu noturno (azul-escuro, estrelas e janelas acesas nos prédios), o salão ganha um véu escuro de 8% por baixo das pessoas e cada mesa aberta tem uma vela acesa. Com `prefers-reduced-motion`, a chama fica parada.
- **Os pontos do guia** (função nova `guiaPontos(g)`, calculada no fim da noite; nunca aparecem como número para o jogador), até 100:
  - **Crítico (até 45):** a soma de três fichas (as duas melhores visitas surpresa guardadas em `save.guia.v` e a ficha da noite, cada uma de 0 a 10) × 1,5.
  - **Gurugol (até 15):** a nota geral arredondada a uma casa: 4,8 ou mais, 15; 4,6 ou mais, 10; 4,4 ou mais, 5.
  - **Luxo (até 15):** nível 5, 15; nível 4, 10; nível 3, 5.
  - **A noite (até 15):** as estrelas do dia com as metas da noite: 3, 15; 2, 10; 1, 5.
  - **Salão (5):** nenhum grupo saiu bravo na noite.
  - **Bráulio (5):** ele saiu com 4 corações ou mais.
- **As estrelas:** 50 pontos ou mais, 1 estrela; 72 ou mais, 2; 90 ou mais, 3 (`NOITE.cortes`). Abaixo de 50, nenhuma: a casa fica "Recomendada" (`save.guia.rec = 1`). `save.guia.est` guarda a **melhor** já alcançada e nunca cai.
- **O veredito** (fim do dia da noite, depois da tela de resultados, que ganha a última linha `['Michelzão', 'O guia liga amanhã cedo']`):
  - com estrela nova (a primeira ou uma a mais): a conversa de depois do capítulo 14, se for a primeira, e o **boletim**;
  - sem estrela nova: a conversa `HIST_RECOMENDA` (só na primeira vez sem estrela; nas seguintes, direto) e o boletim.
  - **O boletim** (painel novo `#ov-guia`): o título "Michelzão", três estrelas (cheias as da melhor marca, vazadas as outras; sem estrela e com `rec`, a linha "Recomendado"), seis barras sem número com os nomes do `NOITE.linhas` (cada uma cheia na fração dos pontos daquela linha **nesta** noite) e o botão "Continuar". O último boletim fica guardado em `save.guia.bol` (seis frações) e reabre pelo selo do menu.
  ```js
  const HIST_RECOMENDA = { falas:[
    { q:'tonhao', s:'O guia ligou. Somos "recomendados".' },
    { q:'bia', s:'Recomendado não é estrela.' },
    { q:'tonhao', s:'Não é. Mas ele volta. Arruma a casa e marca outra noite.' } ] };
  ```
- **Capítulo 14** (entra no `HISTORIA`; o capítulo 13 perde o `fim`):
  ```js
  { cap:14, titulo:'A noite da estrela', ponto:'terraco', obj:{ estrela:1 },
    antes:[
      { q:'bia', s:'Uma noite pra valer tudo, tio.' },
      { q:'tonhao', s:'O crítico vem de cara limpa. E o Bráulio reservou uma mesa.' },
      { q:'dani', s:'Ele vem provar o molho?!' },
      { q:'tonhao', s:'Vem procurar defeito. Não vai achar.' },
      { q:'bia', nota:'olhando a foto da mãe', s:'Quando a casa estiver pronta, eu marco a noite.' }],
    depois:[
      { q:'bia', s:'O crítico raspou o prato. Não sobrou molho!' },
      { q:'tonhao', s:'E o Bráulio saiu calado. Pela primeira vez na vida.' },
      { q:'dani', s:'E agora?' },
      { q:'tonhao', s:'Agora o guia liga. Dorme, Bia. Amanhã cedo o telefone toca.' }],
    fim:{ h:'Fim do capítulo 14', p:'Continua na próxima versão: o futuro da Corre-Corre.' } }
  ```
  Item do objetivo: "Ganhar a estrela do Michelzão", cumprido com `guia.est >= 1`. Sem estrela, o capítulo segue e a noite pode ser marcada de novo depois da espera.
- **Depois da primeira noite:** em cada dia que não é noite, com `NOITE.volta` = 12% de chance, o crítico faz uma visita surpresa como as da v10.9 (disfarçado, sem boato); a ficha nova entra em `save.guia.v`, que guarda sempre as duas melhores (pela soma). O cartão do fim do dia e a ficha `i-critico` valem igual.
- **A Fama do luxo:** cada estrela do Michelzão vale 1 ponto de Fama (`LUXO.estrela = 1`), somado à divulgação e à nota, com o teto de 5 de sempre.
- **O selo:** no menu principal, abaixo do nome do jogo, o texto `NOITE.selo[est]` (com `est` 0, só se `rec`); o toque nele abre o último boletim. O "Copiar resumo" do Caixa ganha a mesma linha.
- **Modo dev:** `DEV_CAPS` ganha o `n:14` (começo do capítulo 14, com `guia.v` de duas fichas de 8) e o Fim passa a `n:15`. Na aba Hoje, as linhas `Noite da estrela: Marcar hoje` (marca o próximo dia que começar, em qualquer capítulo, no Terraço) e `Veredito: Normal | Recomendado | ★ | ★★ | ★★★` (`DEV.forca.guia`: troca as estrelas dadas no fim da noite, sem mexer nas barras).
- **Manual** (sem números):
  - `{ id:'l-noite', aba:'lojinha', nome:'Noite da estrela', linha:'Você escolhe o dia. Casa cheia, o crítico à mesa e o Bráulio de olho. No fim, o guia dá o veredito.' }` (revela quando o cartão aparece);
  - `{ id:'c-braulio', aba:'clientes', nome:'Bráulio', linha:'O chef da Casa Aurora. Vem sozinho, tem pouca paciência e pede o prato da casa para achar defeito.' }` (revela no fim da primeira noite);
  - `{ id:'b-michelzao', aba:'basico', nome:'Estrelas do Michelzão', linha:'O guia pesa as visitas do crítico, o Gurugol, o luxo e a noite. As estrelas ganhas não se perdem.' }` (revela no primeiro boletim).
- **Save:** `save.guia` ganha `noite` (o dia marcado ou 0), `ult` (o dia da última noite ou 0), `est` (0 a 3), `rec` (0 ou 1), `bol` (seis frações de 0 a 1) e `convRec` (0 ou 1); o `normSave` limpa o que for inválido. Save da v10.9 no Fim (`cap` 14, `capV` 4) no Terraço começa o capítulo 14 com a conversa de antes: `save.capV` passa a 5.

## Critérios de aceite
- **CA1** O cartão "Noite da estrela" só aparece no Terraço com `save.cap >= 14`; "É hoje!" marca o dia que vai começar e o segundo toque desmarca → `smoke75` (1)
- **CA2** Na noite: grupos × 1,3 (±1), metas × 1,2, sem clima, evento nem quebra nova, e a introdução com o aviso → `smoke75` (2)
- **CA3** O crítico chega entre 35% e 45% da janela, sem disfarce, com a plaquinha do Michelzão; o Bráulio entre 50% e 60%, com paciência × 0,7 e pedindo o prato da casa → `smoke75` (3)
- **CA4** As falas do Bráulio aparecem ao sentar, ao receber o Prato da Rosa e ao sair (a feliz com 4 corações ou mais, a brava com menos) → `smoke75` (4)
- **CA5** `guiaPontos`: noite perfeita com duas fichas de 10, nota 4,8, luxo 5, 3 estrelas do dia, ninguém bravo e o Bráulio feliz dá 100; um caso por linha confere cada faixa das Regras → `smoke75` (5)
- **CA6** Os cortes: 49 pontos, recomendado; 50, 1 estrela; 72, 2; 90, 3; uma noite pior depois não baixa `guia.est` → `smoke75` (6)
- **CA7** O boletim mostra as estrelas da melhor marca e as seis barras da noite, fica guardado em `guia.bol` e reabre pelo selo do menu → `smoke75` (7)
- **CA8** Capítulo 14: com a primeira estrela a conversa de depois fica pendente; sem estrela toca a `HIST_RECOMENDA` uma vez, o capítulo segue e o cartão volta depois de 3 dias → `smoke75` (8)
- **CA9** Depois da primeira noite, a visita surpresa sai em cerca de 12% dos dias (2000 sorteios: entre 9% e 15%), nunca numa noite, e `guia.v` guarda as duas melhores fichas → `smoke75` (9)
- **CA10** Cada estrela soma 1 na Fama do luxo, sem passar de 5 → `smoke75` (10)
- **CA11** O selo do menu mostra o texto certo para recomendado e para 1, 2 e 3 estrelas, e não aparece antes da primeira noite → `smoke75` (11)
- **CA12** Modo dev: "Marcar hoje" faz a noite no dia que começa e "Veredito" troca as estrelas dadas → `smoke75` (12)
- **CA13** Save: `normSave` limpa os campos novos inválidos e o save da v10.9 no Fim começa o capítulo 14 → `smoke75` (13)
- **CA14** A noite é difícil na medida: `NOITE=1 PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=5 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 LUXO=tudo ROSA=1 node balance.js 40` passa a meta da noite entre 60% e 85% das vezes; fora da faixa, mude `NOITE.meta` de 0,05 em 0,05 (para cima se passar de 85%, para baixo se ficar abaixo de 60%)
- **CA15** As estrelas são raras na medida: `DIAS=120 node carreira.js 40` mostra a linha `MICHELZAO`; na **primeira** noite de cada carreira, 1 estrela ou mais em 80% a 95%, 2 ou mais em 35% a 60% e 3 em 3% a 15%; fora da faixa, mude o corte daquela estrela de 2 em 2 pontos (50 entre 44 e 56, 72 entre 66 e 78, 90 entre 84 e 96), uma estrela por vez, da primeira para a terceira
- **CA16** O que se vê → captura `shot_v10_10.js`: o Terraço de noite com as velas, o crítico com a plaquinha, o Bráulio à mesa com o balão, o cartão da lojinha, o boletim com 0, 1 e 3 estrelas e o selo no menu; conferir em recorte que o véu da noite não apaga os corações nem os balões e que o bigode do Bráulio se lê

## Partes
- `src/10-constantes.js`: `NOITE`, `HIST_RECOMENDA`, `LUXO.estrela` e a Fama no `luxoPts`, `HISTORIA` (capítulo 14; o `fim` do 13), `DEV_CAPS`, `MANUAL`.
- `src/12-clientes.js`: `Group` (o crítico sem disfarce, o Bráulio: paciência, falas e aparência), `normSave` (`guia`, `capV` 5).
- `src/16-jogo.js`: `sortear`, `resetDay` e `buildSchedule` (a noite, os dois convidados, a visita surpresa), as metas da noite, `guiaPontos`, o fim do dia (estrelas, `bol`, espera), `capObj` (item `estrela`), a marcação da noite, `devForcaSorteio`, `devCapitulo`.
- `src/21-cenario.js` (o céu da janela, o véu e as velas), `src/20-desenho-base.js` ou `src/22-salao-hud.js` (o Bráulio, a plaquinha do Michelzão, o balão com nome).
- `src/02-telas.html` e `src/01-estilo.css` (`#ov-guia` e o selo do menu), `src/40-interface.js` (o selo, as linhas da aba Hoje), `src/41-lojinha.js` (o cartão da noite), `src/42-resultados.js` (a linha do Michelzão e o boletim), `src/43-telas.js` (o fluxo do veredito no `fluxoHistoria`, `introManut`).
- `tests/bot.js`, `tests/balance.js`, `tests/carreira.js`.

## Tarefas
- [x] T1 Smoke novo `tests/smoke75.js` com CA1 a CA13 (falhando) e no `run_all.sh`.
- [x] T2 `NOITE`, os campos do `save.guia`, o capítulo 14 e o cartão da lojinha.
- [x] T3 O dia da noite: grupos, metas, sem imprevistos, o crítico de cara limpa e o Bráulio com as falas.
- [x] T4 `guiaPontos`, as estrelas, a espera e a visita surpresa de depois.
- [x] T5 O veredito: a linha dos resultados, as conversas, o boletim `#ov-guia` e o selo do menu.
- [x] T6 A Fama do luxo, o modo dev e o Manual.
- [x] T7 Desenho: a noite, as velas, o Bráulio e a plaquinha; `shot_v10_10.js` e conferência em recortes.
- [x] T8 Bot: o `balance.js` com `NOITE=1`; o `carreira.js` marca a noite no capítulo 14 quando o luxo é 4 ou mais e a nota 4,6 ou mais (ou depois de 5 dias no capítulo), marca de novo depois de cada espera até as 3 estrelas e mostra a linha `MICHELZAO` (dia da primeira noite, estrelas na primeira noite e a melhor marca no fim). Calibrar CA14 e CA15 pela receita.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A noite segue o molde do dia de evento (`eventoDe`, `sortear`, `buildSchedule` da v10.6): grupos no mesmo produto, sem clima, aviso na `introManut`.
- O balão de fala em cima do cliente já existe na vontade da freguesia (v10.5.3, `VONTADE.balao`): o Bráulio usa o mesmo desenho, com o nome em cima.
- As estrelas do dia já saem das metas (`bomGoal` e a expert): a noite só multiplica as três; não crie outra conta de estrelas.
- Calibre o CA14 antes do CA15: a linha "A noite" dos pontos depende das metas.
- A conversa de depois do capítulo 14 fala do crítico e do Bráulio sem dizer o resultado: não troque as falas conforme a ficha.

## Testes
- `smoke75` novo (CA1 a CA13). `balance.js`: `NOITE=1`. `carreira.js`: linha `MICHELZAO` e `DIAS=120`.
- Capturas: `shot_v10_10.js` (CA16), conferidas e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
- **CA14 (meta da noite entre 60% e 85%) não se alcança com `NOITE.meta`.** Medido em 13/11 (`NOITE=1 PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=5 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 LUXO=tudo ROSA=1 node balance.js`, 8 repetições; e 20 sem `BOT=afiado`): a meta da noite (×1,2) passa em 100% das vezes nos dias 8 a 10, com o lucro em 2 a 3 vezes a meta (dia 8: R$ 7.360 contra R$ 2.495). Chegar a 85% pediria `NOITE.meta` perto de 3, longe dos passos de 0,05 da receita; ficou **1,2**. A dificuldade da noite fica nos pontos do guia (CA15). **Pendente de decisão do usuário.**
- **CA15 (estrelas raras na medida) só se alcança em parte.** Medido em 40 carreiras (`DIAS=120 node carreira.js 40`, bot comum): pontos da 1ª noite p10 40,5 · p25 45,5 · p50 53,5 · p75 65,5 · p90 72; as barras médias da 1ª noite ficam em Crítico 0,62 · Gurugol 0,50 · Luxo 0,67 · A noite 0,47 · **Salão 0,00 · Bráulio 0,00** (o bot perde de 3 a 8 grupos na noite e nunca deixa o Bráulio com 4 corações). Com os cortes da spec (50, 72, 90): 1 estrela ou mais em 65%, 2 em 10% e 3 em 0%. Dentro das faixas da receita, o corte da 1ª estrela foi a **44** (80%) e o da 2ª a **66** (20%); o da 3ª ficou em 90 (0% com qualquer corte da faixa). Ou seja: 2 e 3 estrelas ficam abaixo do alvo (35–60% e 3–15%) com este bot; um jogador de verdade (que perde menos grupos e agrada o Bráulio) deve ir melhor. **Pendente de decisão do usuário** (aliviar o Salão e o Bráulio, ou baixar mais os cortes).
- **`BOT=afiado` no `carreira.js` não serve de medida** (a 1ª noite ficou pior que a do bot comum: 26% de 1 estrela).
- **O fluxo do veredito:** na noite os resultados vêm primeiro (a conversa de antes dos resultados não toca) e as conversas pendentes tocam ao seguir (`btn-next`); o veredito (a conversa `HIST_RECOMENDA`, só na 1ª vez sem nenhuma estrela, e o boletim) é um passo do `fluxoHistoria`, marcado por `save.guia.ver` (campo a mais, 0 ou 1); sair para o menu sem seguir deixa o veredito pendente para a próxima vez.
- **Constantes e funções a mais:** `guiaPontos(o)` e `guiaEstrelas(tot)` são funções soltas (puras), e não métodos; `Game.noiteDia`, `diaNoite`, `guiaSave`, `noiteFalta`, `noiteVisivel`, `marcaNoite`; `Group.diz`, `braulio`, `fala`, `falaT`; `abreBoletim`; `NOITE_CFG` no `balance.js` e no `carreira.js`. O sorteio da visita surpresa de depois da 1ª noite fica na memória do jogo (`sorteioCrit`, por dia): recomeçar o dia não sorteia de novo, mas fechar o jogo sim.
- **O Bráulio que sai bravo (`angry`) conta como bravo** mesmo com corações (o `angryLeave` não zera os corações); o Bráulio e o crítico da noite, sem disfarce, tiram gente do dia seguinte se saem bravos (como todo exigente).
- **`menu_fit.py`** não rodou (o Python do ambiente não tem o Playwright); o menu com o selo foi conferido por captura em 960×600 (sem rolagem).
- **Testes antigos atualizados** pela mudança de números: `smoke53` (76 fichas), `smoke62` (série até v10.10), `smoke63` (15 linhas em `DEV_CAPS`, o Fim é o 15), `smoke64` (cenas), `smoke69` (14 capítulos, `capV` 5), `smoke73` e `smoke74` (14 capítulos; o cap. 13 sem `fim`; `capV` 5). O `smoke38` (turmas do apito) falhou uma vez em 13/11 por sorteio e passou em 3 reexecuções.
- **Desenho:** a plaquinha do crítico da noite é `drawVipBadge(..., 'michel')`; o Bráulio usa `blazer` e `gravata` do `drawPerson` (paletó bordô) mais `bigode`; o balão da fala (`drawFala`) é um balão branco acima dos corações, com o nome em branco; a vela (`drawVela`) fica na ponta do tampo; o ícone do cartão (`upgradeIcon('noite')`) é a lua com a estrela.

**Modelo:** Sonnet, esforço alto (regras e textos fechados, com receita de calibração; junta dia especial, pontuação, painel novo, desenho da noite e bot)
