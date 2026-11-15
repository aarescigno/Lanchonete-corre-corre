# v11.11 — A abertura nova: o motor, o som e as cenas 1 e 2 (etapa 9a)

**Situação:** aprovada (15/11)
**Origem:** pedido do usuário em 15/11 ("Revise o vídeo inicial com objetivo de deixar ele bonito... praticamente refazê-lo do zero", em `docs/PROPOSTAS.md`); roteiro e direção fechados na entrevista do mesmo dia, em `docs/ABERTURA.md` (§1 a §6 e §10); etapa 9a do `docs/PLANO.md`.

## Objetivo
A abertura começa a ser refeita como um filminho: quadro cheio, câmera que desliza e aproxima, cenários com camadas e luz, legenda curta e um tema musical. Nesta versão nascem o motor, o som inteiro e as duas cenas da cozinha de casa. O jogador ainda vê a abertura antiga; a nova toca pelo modo dev.

## Fora do escopo
- As cenas 3 a 11 desenhadas (v11.12 a v11.14): aqui tocam como cartão de obra.
- A troca da abertura oficial e a retirada da antiga (v11.14).
- O final (`FINAL`) e os créditos: não mudam (Etapa 10, a planejar).

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/ABERTURA.md` §3 (direção de arte), §4 (roteiro), §5 (som), §6 (as cenas 1 e 2 e o cartão de obra) e §10. O que segue é só o que falta dizer do código.
- **Roteiro novo:** `ABERTURA2 = { cheio:true, trans:0.5, cenas:[...] }` em `src/18-abertura.js`, com as 11 cenas de §4. Cada cena: `id`, `t`, `leg`, `legDe` (padrão 0,6), `falas` (`{ q, s, de }`), `cam:{ de, para }`, `sai`, `clima`, `fx`, e `pRM` e `titulo` quando houver. As `cam`, `clima` e `fx` de todas as 11 já entram com os valores de §5 a §9.
- **Classe `Abertura`:** aceita o roteiro novo sem mudar o comportamento com `ABERTURA` e `FINAL`. Novos: `cam` (getter, `{ cx, cy, z }` de `ab2Cam(cena, p)`; com movimento reduzido, o `para`), `trans` (getter, `{ tipo, k }` nos últimos `roteiro.trans` segundos da cena, `k` de 0 a 1; `null` fora deles, na última cena com `sai` diferente de `escuro`, e com movimento reduzido), `legA` (opacidade da legenda, de `legDe` a `legDe` + 0,4 s; 1 com movimento reduzido). Com roteiro `cheio`, `escuro` só vale na entrada da 1ª cena e nas cenas com `sai:'escuro'` (a saída delas e a entrada da seguinte).
- **Câmera:** `ab2Cam(cena, p)` interpola `de` e `para` com `abSuave(p)`; `ab2Tela(cam, x, y)` leva um ponto da cena para a tela. Uma cena pode ter `cam.meio:[cx,cy,z,p]` (a câmera passa por ali em `p`; só a cena 8 usa: `[610,300,1.1,0.5]`).
- **Desenho:** arquivo novo `src/27-abertura-nova.js` com o kit (`AB2 = { chao:520, k:1.38 }`, `ab2Camada(c,cam,k,fn)`, `ab2Luz`, `ab2Sombra`, `ab2Vinheta`, `ab2Clima`), o cenário `ab2Cozinha(c,cam,modo)`, a tabela `AB2_CENAS` (`porta` e `carinho` desenhadas; as outras nove pelo `ab2Obra(c,ab)`) e `drawAbertura2(c,ab)`: cena pela câmera, transição, legenda nova (`ab2Legenda`), bolinhas e balões na tela. `drawAbertura` chama `drawAbertura2` quando `ab.roteiro.cheio`.
- **Transições:** `ab2Trans(c,ab,desenhaProxima)` faz `flash`, `passa` e `iris` por `clip` e cor por cima, sem canvas à parte. Centro da `iris`: o `[cx,cy]` do `cam.para` da cena que sai.
- **Som:** `Sfx.faixa()` devolve um nó de ganho ligado à saída (ou `null` sem áudio) e `Sfx.corta(faixa)` o leva a zero em 0,15 s; `Sfx.tone` e `Sfx.noise` ganham um último parâmetro `saida` (padrão, a saída de sempre). `ab2Notas(cena)` e `AB_FX` como em §5. `aberturaSom(cena, roteiro)`: com o roteiro novo, corta a faixa anterior, abre outra e agenda as notas e os `fx`; com `ABERTURA` e `FINAL`, toca como hoje. Fechar a abertura corta a faixa.
- **Modo dev:** a lista de cenas (`devCenas`) ganha, logo depois de "Abertura", a entrada "Abertura nova (em obras)", que abre `abrirAbertura('menu', { roteiro:ABERTURA2 })`; não grava `LS.abertura` e, no fim, volta para onde estava.
- **Manual:** nada muda.
- **Save:** nada muda.
- **Versão:** `VERSAO` e `vtag` `v11.11`; linha no `#ov-ver`: "A abertura está sendo refeita: quadro cheio, câmera e música. Por enquanto, só no modo dev."

## Critérios de aceite
- **CA1** (`ABERTURA2` tem 11 cenas, com os `id`, os tempos, as legendas, os `legDe`, as falas, os `de` e os `sai` de `docs/ABERTURA.md` §4, letra por letra; soma 77 s; legenda com até 60 letras; `titulo` só na 11) → `smoke87` (CA1)
- **CA2** (a abertura antiga segue como está: toca sozinha na 1ª vez e pelo botão, 10 cenas, com a faixa de legenda) → `smoke26` sem mudança e `smoke87` (CA2)
- **CA3** (modo dev: "Abertura nova (em obras)" vem logo depois de "Abertura", abre o roteiro novo, não grava `LS.abertura` e volta para onde estava) → `smoke87` (CA3)
- **CA4** (câmera: nas 11 cenas, em p 0, 0,5 e 1, `z` é 1 ou mais e o retângulo visto cabe em 0 a `TW` por 0 a `H`; em p 0 e 1 bate com `de` e `para`; com movimento reduzido, é o `para`) → `smoke87` (CA4)
- **CA5** (transições: `trans` é `null` fora dos últimos 0,5 s e com movimento reduzido; nos últimos 0,5 s tem o `tipo` da cena e `k` crescente; `legA` vai de 0 a 1 a partir de `legDe`) → `smoke87` (CA5)
- **CA6** (som: `ab2Notas` devolve, para cada cena, 6 notas ou mais, todas começando antes do fim da cena, com a onda e o volume do `clima`; a 1ª nota de `casa` é 392 Hz e a de `triste`, 392 x 5/6; todo nome de `fx` existe na `AB_FX` e os tempos batem com §5; trocar de cena chama `Sfx.corta`) → `smoke87` (CA6)
- **CA7** (`drawAbertura` com o roteiro novo roda sem erro nas 11 cenas em p 0, 0,5 e 0,95, com e sem movimento reduzido; `AB2_CENAS.porta` e `.carinho` devolvem a cabeça da Rosa e, no instante `de` da fala, ela cai na tela com 40 px de margem) → `smoke87` (CA7)
- **CA8** (o `FINAL` não muda) → `smoke76` sem mudança
- **CA9** (o que se vê) → captura `shot_v11_11.js`: as cenas 1 e 2 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a troca 1 para 2, um cartão de obra e a cena 2 com movimento reduzido; conferir em recorte, contra `docs/ABERTURA.md` §3: rosto em close com 40% da altura ou mais, nenhum plano liso maior que um quarto do quadro, legenda legível, balão fora dos rostos, luz e sombra presentes

## Partes
- `src/18-abertura.js`: `ABERTURA2`, classe `Abertura` (`cam`, `trans`, `legA`, `escuro`), `ab2Notas`, `AB_FX`, `aberturaSom`.
- `src/11-base.js`: `Sfx` (`faixa`, `corta`, o parâmetro `saida`).
- `src/27-abertura-nova.js` (novo): o kit, `ab2Cozinha`, `AB2_CENAS`, `ab2Obra`, `ab2Trans`, `ab2Legenda`, `drawAbertura2`.
- `src/25-abertura.js`: só `drawAbertura` (o desvio para a nova) e, para ler, as pessoas (`abRosa`, `abBiaCrianca`, `abBraco`, `abColher`, `abPanela`, `abCoracoes`, `abBanquinho`, `abBalao`).
- `src/21-cenario.js`: `drawFotoRosa` (para ler).
- `src/43-telas.js`: `devCenas`, `devAssistir`, `abrirAbertura` (o som e o fim), `window.__lcc` (expor `ABERTURA2`, `ab2Cam`, `ab2Tela`, `ab2Notas`, `AB_FX`, `AB2_CENAS`).
- `src/10-constantes.js` (`VERSAO`) e `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke87.js` (CA1 a CA7), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 `ABERTURA2`, a classe `Abertura` e a câmera.
- [ ] T3 O som: `Sfx.faixa` e `corta`, `ab2Notas`, `AB_FX`, `aberturaSom`.
- [ ] T4 O kit, o cartão de obra, as transições, a legenda nova e `drawAbertura2`; a entrada do modo dev.
- [ ] T5 `ab2Cozinha` em `'tarde'` e a cena 1, `porta`; captura, recorte e acerto.
- [ ] T6 A cena 2, `carinho`, com o clique e a foto; captura, recorte e acerto.
- [ ] T7 `tests/shot_v11_11.js` e a conferência do CA9.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- As pessoas já existem em `src/25-abertura.js` e aceitam escala e pose (`bracoD`, `t`, `fala`); desenhe-as maiores pela câmera e por `AB2.k`, não redesenhe o boneco.
- O `harness.js` tem um canvas de mentira: confira que `clip`, `createRadialGradient` e `globalCompositeOperation` existem nele antes de usar; se faltar, acrescente no harness (não é mudança de jogo).
- Não toque em `AB_CENAS`, `abLegenda`, `ABERTURA` nem `FINAL`: `smoke26` e `smoke76` dependem deles.
- Comece pelo motor com as 11 cenas em cartão de obra tocando do começo ao fim (câmera, legenda, som); só depois desenhe.
- Se as cenas 1 e 2 não ficarem bonitas em duas rodadas de captura, pare e avise (ver `docs/ABERTURA.md` §10).

## Testes
`smoke87` novo; `smoke26` e `smoke76` sem mudança; `tests/run_all.sh` verde. Capturas de `shot_v11_11.js` conferidas e apagadas. (No fechamento: o número de checagens do `smoke87`.)

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço alto — motor novo em várias partes e desenho de cenário que se confere em captura; tudo decidido em `docs/ABERTURA.md`.
