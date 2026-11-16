# v11.16 — O final novo: o motor, o som e as cenas 1, 2 e 3 (etapa 10a)

**Situação:** aprovada (16/11)
**Origem:** `docs/FINAL.md` §1 a §6 e §9 (roteiro e direção fechados no planejamento de 16/11; decisões do usuário em `docs/PROPOSTAS.md`); etapa 10a do `docs/PLANO.md`.

## Objetivo
O final começa a ganhar o tratamento da abertura: o roteiro novo de quadro cheio, com câmera, luz, o tema da Rosa e os efeitos, e as três primeiras cenas desenhadas (o telefone tocando no Terraço de manhã, a placa indo para a parede e a estrela da Casa Aurora se apagando). As outras cenas tocam como cartão de obra. Só pelo modo dev: o jogador continua vendo o final antigo.

## Fora do escopo
- As cenas 4 a 8 e os créditos desenhados (v11.17 e v11.18); a troca do final oficial e a limpeza do antigo (v11.18).

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/FINAL.md` §3 (direção de arte), §4 (o roteiro), §5 (o som), §6 (os cenários e as cenas desta versão, quadro a quadro) e §9, e o `docs/ABERTURA.md` §3 no que o `docs/FINAL.md` não muda.
- **O roteiro:** `FINAL2` em `src/18-abertura.js`, com as 8 cenas e os `creditos` da tabela do §4 (todos os campos: `t`, `min`, `leg`, `legDe`, `falas`, `sai`, `clima`, `cam`, `fx`, `titulo`), `cheio:true`, `final:true`, `trans:0.5`, sem `som`. O `FINAL` antigo ganha só `final:true`.
- **O motor:** `finalCenas(est, desde, creditos, roteiro)` (padrão `FINAL`) filtra `roteiro.cenas` e põe no fim `roteiro.creditos || FINAL_CREDITOS`; a `Abertura` usa `finalCenas` quando `roteiro.final`. `ab2Notas` ganha os climas `festa`, `estrelas` e `creditos`; `AB_FX` ganha `telefone`, `parafuso` e `apaga` (§5). `ab2Bolinhas` não desenha nada na cena com `cheia` e conta só as outras.
- **O cartão de obra:** `ab2Obra(c, ab, i)` volta (como na v11.12: fundo `PAL.tinta`, o número da cena e o `id` no centro, creme, 40 px, e as falas embaixo, sem ponta); o `ab2Quadro` o usa para a cena sem desenho na `AB2_CENAS`.
- **Desenho:** a parte nova `src/28-final.js` (entra sozinha no `montar.py`, entre a 27 e a 30) com o cenário `ab2Terraco(c,cam,modo,o)` (`'manha'` e `'noite'`; `AB2_TE` com as medidas), o `modo` `'noite'` do `ab2RuaAurora` e o `o.estrela` do `ab2FachadaAurora` (estes dois em `src/27-abertura-nova.js`), e as cenas `telefone`, `placa` e `apagou` registradas na `AB2_CENAS` (`Object.assign`).
- **Modo dev:** na aba História, seção "O final", uma linha nova: `Final novo (em obras): ★ | ★★ | ★★★`, que toca o `FINAL2` com aquelas estrelas e os créditos, sem mexer no save, e volta para onde estava (`devFinal(est, roteiro)`, `tocaFinal(est, desde, creditos, depois, roteiro)`).
- **Versão:** `VERSAO` e `vtag` `v11.16`; no `#ov-ver`, uma linha nova da v11.16 ("versão atual"): "O final está sendo refeito como a abertura: quadro cheio, câmera e música. Três cenas prontas, por enquanto só no modo dev." A linha da v11.15 fica.
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (o `FINAL2` tem as 8 cenas e os créditos com os campos do `docs/FINAL.md` §4, letra por letra; `cheio`, `final`, `trans` 0,5; nenhuma legenda passa de 60 letras; nenhuma cena tem `som`; com 3 estrelas soma 63,5 s mais 6) → `smoke92` (CA1)
- **CA2** (a `Abertura` com o `FINAL2` escolhe as cenas como o `FINAL`: 1, 2 e 3 estrelas, `desde` e créditos; a legenda da `placa` muda com as estrelas; a câmera, a transição e a legenda que entra em `legDe` funcionam como na abertura) → `smoke92` (CA2)
- **CA3** (`AB2_CENAS.telefone`, `.placa` e `.apagou` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido e com 1, 2 e 3 estrelas; `bia` na 1, `tonhao` e `bia` na 2 e `braulio` na 3 caem na tela no instante da fala, com 40 px de margem) → `smoke92` (CA3)
- **CA4** (as cenas 4 a 8 e os créditos caem no cartão de obra e desenham sem erro) → `smoke92` (CA4)
- **CA5** (o som: `ab2Notas` dá as listas do §5 para `festa`, `estrelas` e `creditos`; `AB_FX` tem `telefone`, `parafuso` e `apaga`; o `FINAL2` toca pela faixa da cena, cortada ao trocar) → `smoke92` (CA5)
- **CA6** (modo dev: "Final novo (em obras)" com ★, ★★ e ★★★ toca o `FINAL2` com as cenas certas e os créditos, não muda o save e, no fim ou no Pular, volta ao menu) → `smoke92` (CA6)
- **CA7** (o final antigo e a abertura seguem como estão: o fluxo da 1ª estrela, o botão História e o "Assistir o final" tocam o `FINAL`) → `smoke76`, `smoke88`, `smoke91` e `smoke26` sem mudança
- **CA8** (o que se vê) → captura `shot_v11_16.js`: as cenas 1, 2 e 3 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 2 com 1, 2 e 3 estrelas em p 0,9, e as trocas `corte` (1 para 2) e `iris` (2 para 3); conferir em recorte, contra o `docs/FINAL.md` §3 e §6: a Bia com a roupa do Terraço; o telefone tocando se entende no close; a placa se lê, torta, com as estrelas vermelhas; na 3 a estrela apaga e o Bráulio fica sentado no degrau; nenhum plano liso maior que um quarto do quadro; balão fora dos rostos

## Partes
- `src/18-abertura.js`: `FINAL2`, `FINAL` (`final:true`), `finalCenas`, a `Abertura` (o `constructor`), `ab2Notas`, `AB_FX`.
- `src/28-final.js` (nova): `AB2_TE`, `ab2Terraco`, as cenas 1, 2 e 3.
- `src/27-abertura-nova.js`: o `modo` `'noite'` em `AB2_RUA.modos` e no `ab2RuaAurora`, o `o.estrela` no `ab2FachadaAurora`, `ab2Obra` e `ab2Quadro`, `ab2Bolinhas`.
- `src/25-abertura.js`, para ler: `abBia` (com `roupa:4`), `abTonhao`, `abBraulio`, `abTelefone`, `abFone`, `abPlacaMichel`, `abMesaTe`, `abJanelaCidade`.
- `src/40-interface.js` (a linha do modo dev), `src/43-telas.js` (`devFinal`, `tocaFinal`, `window.__lcc`), `src/10-constantes.js` (`VERSAO`), `src/02-telas.html` (`vtag`, `#ov-ver`).
- `ferramentas/editor.py` (a lista `ARQUIVOS` com o `src/28-final.js`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke92.js` (CA1 a CA6), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 O roteiro `FINAL2`, o motor (`finalCenas`, `Abertura`, `ab2Bolinhas`), o som (climas e efeitos), o `ab2Obra` e a linha do modo dev; o `smoke92` verde nas partes de motor.
- [ ] T3 `ab2Terraco` (os dois modos) e a cena 1, `telefone`; captura, recorte e acerto.
- [ ] T4 A cena 2, `placa`; captura (com 1, 2 e 3 estrelas), recorte e acerto.
- [ ] T5 O `modo` `'noite'` da rua da Casa Aurora e a cena 3, `apagou`; captura, recorte e acerto.
- [ ] T6 `tests/shot_v11_16.js` e a conferência do CA8; o editor de desenhos abrindo o `src/28-final.js`.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, o `CLAUDE.md` (a parte `28` na lista), esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O motor da abertura já faz quase tudo (`ab2Cam`, `trans`, `legA`, `escuro` e o `drawAbertura2`): o `FINAL2` toca por ele só por ter `cheio:true`; o trabalho de motor é o `final:true` no lugar do `roteiro === FINAL` e os créditos vindos do roteiro.
- Modelo de cena: `AB2_CENAS.portao` e o `ab2RuaCasa` (`src/27-abertura-nova.js`), com as camadas, a luz em `screen` atrás das pessoas e as cabeças devolvidas no espaço da cena. O Terraço do jogo (`drawParedeTe`, `src/21-cenario.js`) dá as cores e as peças da porta e do janelão.
- O `smoke88` (CA2 e CA6) confere que o `FINAL` antigo toca no motor antigo, com o `som` de cada cena: não mexa no `FINAL` além do `final:true`.
- O editor de desenhos acha as cenas pela `AB2_CENAS`; confira que ele mostra as cenas do `src/28-final.js` (registradas por `Object.assign`); se não, ajuste a ferramenta (não pede spec).
- Uma cena por vez: desenhe, capture, recorte, acerte; só então a próxima. Se não ficar bonita em duas rodadas, pare e avise.

## Testes
`smoke92` novo (CA1 a CA6); `smoke76`, `smoke88`, `smoke91` e `smoke26` sem mudança; `tests/run_all.sh` verde. Capturas de `shot_v11_16.js` conferidas em recorte e apagadas. No fechamento: quantas checagens o `smoke92` tem.

## Decisões em aberto
Nenhuma.

## Desvios
(no fechamento)

**Modelo:** Sonnet, esforço alto — o motor quase todo pronto e o quadro a quadro fechado; o peso é desenhar um cenário novo e três cenas no canvas, conferidas em captura.
