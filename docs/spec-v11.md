# v11 — O futuro da Corre-Corre: a cena final, os créditos e a placa na parede (etapa 6d)

**Situação:** entregue em 14/11
**Origem:** a Etapa 6 do `docs/PLANO.md`, última das quatro sessões do final (planejamento de 13/11, `docs/PROPOSTAS.md`). Decisões do usuário: com 1 estrela a cena final toca inteira e cada estrela a mais acrescenta um trecho; o Bráulio perde a estrela da Casa Aurora; a garagem da Rosa vira escola de cozinha; créditos só com o agradecimento.

## Objetivo
O fim do sonho da Bia. Na manhã seguinte à noite da estrela, o telefone toca: uma cena animada, do mesmo jeito da abertura, mostra a placa indo para a parede, a estrela da Casa Aurora se apagando, a promessa cumprida ao lado do retrato da Rosa e a garagem reaberta como escola de cozinha do bairro. A última imagem espelha a primeira da abertura. Depois, a casa segue aberta, com a placa na parede, e quem quiser busca a próxima estrela.

## Fora do escopo
- Regras novas de jogo: a pontuação e as noites são as da v10.10.
- Trilha sonora (o jogo segue só com as frases curtas de notas, como a abertura).
- Ranking por estrelas e polimento geral: Etapa 7 (v11.1).

## Regras (decisões tomadas)
- **O motor da cena:** a classe `Abertura` (`src/18-abertura.js`) passa a receber o roteiro (`new Abertura(origem, rm, roteiro)`, padrão `ABERTURA`); tempo, legenda, falas, toque para avançar, "Pular" e movimento reduzido valem igual. O roteiro novo `FINAL` fica no mesmo arquivo; os desenhos, em `src/25-abertura.js`, registrados no `AB_CENAS` com os ids abaixo. O nome de quem fala ganha `dani:'Dani'`.
- **O roteiro** (`min`: as estrelas que o trecho pede; `leg` pode ser uma lista de três textos, para 1, 2 e 3 estrelas):
  ```js
  const FINAL = { fade:0.5, cenas:[
    { id:'telefone', t:6.5, min:1, leg:'Na manhã seguinte, o telefone do Terraço tocou cedo.',
      falas:[{ q:'bia', s:'Alô?... É do Michelzão?!', de:2.4 }], som:[[784,0,.2],[988,.25,.2],[784,.9,.2],[988,1.15,.2]] },
    { id:'placa', t:8, min:1, leg:['A Lanchonete Corre-Corre ganhou a estrela do Michelzão.', 'A Lanchonete Corre-Corre ganhou duas estrelas do Michelzão.', 'A Lanchonete Corre-Corre ganhou três estrelas do Michelzão, a nota mais alta do guia.'],
      falas:[{ q:'tonhao', s:'Tá torta?', de:2.6 }, { q:'bia', s:'Tá perfeita, tio.', de:4.4 }], som:[[784,0,.3],[988,.2,.3],[1175,.4,.3],[1568,.6,.9]] },
    { id:'apagou', t:7.5, min:1, leg:'Na mesma semana, o guia voltou à Casa Aurora e pediu o molho da casa. O Bráulio nunca soube repetir. A estrela de lá se apagou.',
      falas:[{ q:'braulio', s:'Cadê o tempero?!', de:3 }], som:[[440,0,.5],[392,.5,.5],[330,1,.9]] },
    { id:'retrato', t:8, min:1, leg:'A Bia pendurou a estrela ao lado do retrato da mãe.',
      falas:[{ q:'bia', s:'Essa estrela é nossa, mãe.', de:3.4 }], som:[[349,0,.7],[440,.6,.7],[523,1.2,1.1]] },
    { id:'equipe', t:8, min:2, leg:'Ninguém ganha estrela sozinho. A foto da equipe foi para a parede: a Dani, o Joca, a Cami, o Anselmo e a Lia.',
      falas:[{ q:'tonhao', s:'Olha o passarinho!', de:2.8 }], som:[[523,0,.2],[659,.18,.2],[784,.36,.2],[1046,.54,.7]] },
    { id:'escola', t:8.5, min:1, leg:'E a garagem da Rosa reabriu. Agora é a Cozinha da Rosa, a escola de cozinha do bairro.',
      falas:[{ q:'dani', s:'Eu era lenta, mas aprendi rápido. Vocês também vão!', de:3 }], som:[[587,0,.4],[740,.3,.4],[880,.6,.8]] },
    { id:'ceu', t:8, min:3, leg:'Dizem que, do Terraço, nas noites limpas, dá para ver três estrelas bem juntinhas.',
      falas:[{ q:'bia', s:'Uma delas pisca pra mim, tio.', de:2.6 }, { q:'tonhao', s:'Eu sei qual é.', de:4.6 }], som:[[1046,0,.4],[1318,.5,.4],[1568,1,1.2]] },
    { id:'roda', t:9, min:1, leg:'Toda tarde, a Bia desce até a garagem. E sempre tem uma criança na porta da cozinha, olhando.', titulo:'Fim',
      falas:[{ q:'bia', s:'Comida boa é carinho que a gente põe no prato.', de:3.2 }], som:[[523,0,.5],[659,.35,.5],[784,.7,.9],[1046,1.6,1.4]] }
  ] };
  ```
- **O que cada cena mostra** (no traço e nas cores da abertura; personagens e cenários já desenhados lá se reaproveitam):
  - `telefone`: o Terraço de manhã, vazio, com a cidade na janela; a Bia de avental atende um telefone de mesa e leva a mão à boca. O Tonhão aparece na janela da cozinha.
  - `placa`: a parede ao lado da porta do Terraço; o Tonhão, na ponta dos pés, aperta o último parafuso de uma placa de latão com o nome "Michelzão" e 1, 2 ou 3 estrelas vermelhas (conforme as estrelas ganhas); a Bia olha de braços cruzados, sorrindo. A placa está um tiquinho torta.
  - `apagou`: a fachada da Casa Aurora da cena `estrela` da abertura, agora de noite; a estrela do letreiro pisca e apaga. Na janela, o Bráulio de costas para uma panela, com as mãos na cabeça.
  - `retrato`: a parede do Cantinho da Rosa; a Bia pendura uma estrela pequena ao lado da foto da dona Rosa (o mesmo retrato da cena `casa`). No fim da cena, uma pétala cai devagar.
  - `equipe`: uma foto emoldurada na parede: a Bia e o Tonhão no meio, a Dani, o Joca, a Cami, o Anselmo e a Lia em volta, todos de avental (figuras simples, no traço da abertura, com as cores de cabelo e de roupa que têm no jogo). Um clarão de flash no começo.
  - `escola`: a garagem da cena `inauguracao`, com a placa nova "Cozinha da Rosa" sobre o portão; dentro, a Dani de avental ensina três crianças numa bancada (uma delas na ponta dos pés). Uma roseira florida ao lado do portão.
  - `ceu`: o parapeito do Terraço de noite; a Bia e o Tonhão de costas, olhando o céu. Três estrelas juntas; a do meio pisca (parada com movimento reduzido).
  - `roda`: o espelho da cena `casa` da abertura (mesmo enquadramento e mesma cozinha): agora quem cozinha é a Bia adulta, no lugar da Rosa, e na porta está uma criança do bairro (a figura da `biaCrianca` com outro cabelo e outra roupa), olhando. Depois da fala, a cena escurece nas bordas e entra o título "Fim".
- **Quando toca:**
  - Na primeira estrela: depois da conversa de depois do capítulo 14, toca o `FINAL` com as cenas de `min` ≤ estrelas ganhas; depois, os créditos; depois, o boletim da v10.10; depois, o cartão de fim do capítulo.
  - Em estrela nova mais tarde (a 2ª ou a 3ª): no veredito daquela noite, tocam só a `placa` (com a legenda e a placa novas) e as cenas que ainda não tinham sido vistas; depois, o boletim. Sem créditos.
  - `save.guia.visto` guarda as estrelas da última cena vista (0 a 3).
- **Os créditos** (um quadro só, depois da `roda`, no mesmo painel, fundo `AB_COR.noite`, some com um toque ou em 6 s): "Lanchonete Corre-Corre" (título), "O sonho da Bia" (embaixo, menor) e "Obrigado por jogar!". Sem nomes.
- **O cartão de fim** do capítulo 14 passa a `{ h:'Fim da história', p:'A casa segue aberta. Para mais estrelas, marque outra noite na lojinha.' }`; com 3 estrelas na primeira noite, `p:'A casa segue aberta, com a nota mais alta do guia na parede.'`. Depois dele, `save.cap = 15` (o Fim) e a campanha continua como sempre: dias, lojinha, eventos, visitas surpresa e noites.
- **A placa na parede:** com `guia.est >= 1`, o Terraço mostra, na parede ao lado da porta (à direita dela, na altura do letreiro "ABERTO"), a placa de latão com as estrelas ganhas (função nova `drawPlacaGuia` em `src/21-cenario.js`). Só com `rec`, um adesivo redondo pequeno "Recomendado" no vidro da porta.
- **Rever:** o botão História do menu abre a abertura, como hoje; com `guia.visto >= 1`, ele abre antes a escolha "A abertura" ou "O final" (o final toca as cenas de `min` ≤ `guia.visto`, com os créditos).
- **Versão cheia:** a v10.10 é guardada como `versoes/v10.html` (a 1ª linha de `versoes/v1.html` como invólucro + o `lanchonete.html` exato do commit da v10.10) antes de mexer no jogo; o painel `#ov-ver` ganha a linha da v10 com o link "Abrir".
- **Modo dev:** na aba Pular (ou onde estiver a lista de capítulos), a linha `Assistir o final: ★ | ★★ | ★★★` (toca o `FINAL` com aquelas estrelas e os créditos, sem mexer no save); `DEV_CAPS` `n:15` é o Fim, com `guia.est` 1 e `guia.visto` 1.
- **Manual:** a ficha `b-michelzao` (v10.10) ganha no fim da linha: "A placa fica na parede."
- **Save:** `save.guia.visto` (0 a 3; inválido, 0). Save da v10.10 com `guia.est >= 1` e `visto` ausente: a cena final fica pendente e toca na próxima vez que o fluxo da História rodar (no fim do próximo dia), antes de qualquer outra conversa. `save.capV` passa a 6 (o Fim é o `cap` 15).

## Critérios de aceite
- **CA1** A classe `Abertura` toca o `ABERTURA` como antes (mesmas cenas e tempos) e o `FINAL` quando recebe o roteiro → `smoke76` (1)
- **CA2** Com 1 estrela, o final toca `telefone`, `placa`, `apagou`, `retrato`, `escola` e `roda`, nessa ordem; com 2, entra a `equipe` depois da `retrato`; com 3, entra também a `ceu` depois da `escola` → `smoke76` (2)
- **CA3** A legenda da `placa` muda com 1, 2 e 3 estrelas → `smoke76` (3)
- **CA4** O fluxo da primeira estrela: conversa de depois, cena final, créditos, boletim e cartão "Fim da história", e `save.cap` vira 15 → `smoke76` (4)
- **CA5** Estrela nova depois: tocam só a `placa` e as cenas ainda não vistas, sem créditos, e `guia.visto` sobe → `smoke76` (5)
- **CA6** Save da v10.10 já com estrela e sem `visto` toca a cena no fim do próximo dia, uma vez → `smoke76` (6)
- **CA7** O botão História oferece "O final" só com `guia.visto >= 1` → `smoke76` (7)
- **CA8** Modo dev: "Assistir o final" com ★★★ toca as oito cenas e os créditos sem mudar o save → `smoke76` (8)
- **CA9** Com movimento reduzido, cada cena do final é um quadro parado que só avança por toque, e "Pular" termina em qualquer cena → `smoke76` (9)
- **CA10** O arquivo `versoes/v10.html` existe, e `tail -n +2` dele é igual ao `lanchonete.html` do commit da v10.10; o painel Versões tem o link → `smoke76` (10)
- **CA11** O bot termina a história: `DIAS=120 node carreira.js 10` mostra na linha `HISTORIA` o capítulo 14 cumprido e o Fim em pelo menos 8 das 10 carreiras
- **CA12** O que se vê → captura `shot_v11.js`: as oito cenas (cada uma no meio e no fim, e com `RM=1`), os créditos, a placa na parede do Terraço com 1 e 3 estrelas e o adesivo "Recomendado"; conferir em recortes ampliados: os rostos no traço da abertura, a legenda sem cobrir quem fala, a placa legível com as estrelas, a `roda` com o mesmo enquadramento da `casa`, e nenhuma cena com logo, nome ou arte de guia real

## Partes
- `src/18-abertura.js`: a classe `Abertura` com roteiro, `FINAL`, os nomes de quem fala.
- `src/25-abertura.js`: as oito cenas no `AB_CENAS` e as figuras novas (Dani adulta, as crianças, a equipe na foto, o telefone, a placa).
- `src/21-cenario.js`: `drawPlacaGuia` e o adesivo.
- `src/10-constantes.js`: o `fim` do capítulo 14, `DEV_CAPS`, a ficha `b-michelzao`, `VERSAO`.
- `src/12-clientes.js`: `normSave` (`guia.visto`, `capV` 6).
- `src/16-jogo.js`: `devCapitulo` e o que marca a cena como vista.
- `src/40-interface.js` (a escolha do botão História e a linha "Assistir o final"), `src/43-telas.js` (o `fluxoHistoria`: a cena final e os créditos entre a conversa e o boletim), `src/02-telas.html` (`#ov-ver` e a escolha).
- `versoes/v10.html`, `tests/carreira.js`.

## Tarefas
- [x] T0 Guardar a v10.10 como `versoes/v10.html` (antes de qualquer mudança em `src/`).
- [x] T1 Smoke novo `tests/smoke76.js` com CA1 a CA10 (falhando) e no `run_all.sh`.
- [x] T2 A classe `Abertura` com roteiro e o `FINAL` (cenas ainda sem desenho: fundo liso e legenda), com a escolha das cenas por estrela.
- [x] T3 O fluxo: primeira estrela, estrela nova depois, save da v10.10, o cartão de fim e o `cap` 15.
- [x] T4 O botão História, o modo dev e a ficha do Manual.
- [x] T5 Os desenhos das oito cenas e dos créditos, uma por vez, cada uma conferida em captura antes da próxima.
- [x] T6 A placa na parede do Terraço e o adesivo.
- [x] T7 `shot_v11.js` (CA12) e o `carreira.js` (CA11).
- [x] Fechamento: `VERSAO` v11, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, a Etapa 6 arquivada no `docs/PLANO-FEITO.md`, `tests/run_all.sh` verde, PR e merge; avisar que o artifact do editor de desenhos ficou com as cenas antigas.

## Avisos para a execução
- As cenas `casa`, `estrela` e `inauguracao` da abertura já têm a cozinha, a fachada da Casa Aurora e a garagem: a `roda`, a `apagou` e a `escola` partem delas (copie a função e mude, sem alterar a abertura: o `smoke` da abertura confere as cenas dela).
- `AB_ALT`, `AB_BASE` e `abBoca` cuidam da altura, da base e da boca de quem fala: a Dani e as figuras novas entram nessas tabelas para o balão sair do lugar certo.
- O editor de desenhos (`ferramentas/editor.py`) lê as funções do `AB_CENAS`: mantenha as cenas novas no mesmo formato, para o usuário poder ajustar os números depois.
- As falas e as legendas estão fechadas: não encurte nem troque palavras para caber; se uma legenda não couber em três linhas, pare e pergunte.

## Testes
- `smoke76` novo (CA1 a CA10). `carreira.js`: a linha `HISTORIA` vai até o Fim (CA11).
- Capturas: `shot_v11.js` (CA12), conferidas e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
- **Medido (14/11):** `smoke76` com 74 checagens, verde. CA11: `DIAS=120 node carreira.js 10` terminou o capítulo 14 e chegou ao Fim em 10 das 10 carreiras (dia mediano 65; o banco não tomou a lanchonete em nenhuma). CA12: `shot_v11.js` (e com `RM=1`) conferido em recortes: as oito cenas, os créditos e a placa com 1 e 3 estrelas.
- **A placa na parede fica sobre o janelão, e não numa parede livre.** À direita da porta do Terraço (na altura do ABERTO) só há o janelão da cidade, sem parede livre: a placa (52×30) cobre o canto esquerdo dele, na frente da cortina (`drawPlacaGuia`, `src/21-cenario.js`). Fica legível, com o nome e as estrelas vermelhas.
- **O adesivo "Recomendado" é só a estrela num círculo vermelho** (raio 7 no vidro da folha da esquerda): com o texto, ficaria ilegível nesse tamanho. O nome continua no selo do menu e no boletim.
- **"O retrato da cena `casa`":** a `casa` da abertura não tem retrato. Na `retrato`, a foto da dona Rosa é o busto dela (a mesma `abRosa`, no mesmo traço) numa moldura.
- **A escolha do botão História é o painel `#ov-escolha`** (botões `#btn-esc-ab`, `#btn-esc-final`, `#btn-esc-voltar`), e não `#ov-historia`: o `smoke34` proíbe esse id no HTML ("o cartão Em breve saiu").
- **"Assistir o final: ★ | ★★ | ★★★"** fica na aba **História** do painel dev (na seção "O final", antes do Manual), junto das outras cenas para assistir, e não na aba Pular. `DEV_CAPS` n:15 ganhou `guiaEst` e `guiaVisto`, lidos pelo `devCapitulo`.
- **O cartão de fim do Fim** (`Fim da história`) troca a linha pequena "e a história espera por você" por "Os dias continuam, sem objetivo." (a história acabou); `contTexto` lê `fim.p3` com 3 estrelas.
- **`capV` 6 pediu mais três listas** em `normSave` (as comparações `capV !== 5` do arranque e dos capítulos 12 e 13 passaram a aceitar o 6), senão um save v11 era reconvertido como antigo.
- **Testes antigos atualizados:** `smoke69`, `smoke73`, `smoke74` e `smoke75` (`capV` 6), `smoke75` (o fim do cap. 14: cena final, boletim e só então o cartão "Fim da história") e `smoke60` (`HISTORIA[13].fim`, o cap. 15). O `smoke60` já quebrava na `main` da v10.10 (`HISTORIA[12].fim` indefinido derrubava o script).
- **`versoes/v10.html`** substituiu a v10 original (de 11/11, guardada na v10.1) pelo `lanchonete.html` exato da v10.10; o `smoke76` (CA10) compara com o commit `e85d8ac`.
- **O leitor de tela dos créditos** lê "Lanchonete Corre-Corre. O sonho da Bia. Obrigado por jogar!".
- **Falhas de sorteio na suíte:** `smoke3`, `smoke38`, `smoke42` e o teste do almoço de negócios no `smoke42` falham de vez em quando por sorteio (sem relação com a v11); cada um passa de novo na repetição.
- **`menu_fit.py`** não rodou (sem Playwright no Python do ambiente); a v11 não mexeu no menu (só o rótulo do botão segue "Ver abertura").
- **O artifact do editor de desenhos** (`ferramentas/editor.py --artifact`) ficou com as cenas antigas: as cenas novas estão no `AB_CENAS`, no mesmo formato, e entram na próxima publicação dele.

**Modelo:** Sonnet, esforço alto (roteiro, falas e fluxo fechados; o peso é o desenho de oito cenas no canvas, conferidas uma a uma por captura)
