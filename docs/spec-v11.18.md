# v11.18 — O final novo no ar: o céu, a roda, os créditos, a troca e a limpeza (etapa 10c)

**Situação:** aprovada (16/11)
**Origem:** `docs/FINAL.md` §3, §4, §8 e §9 (roteiro e direção fechados no planejamento de 16/11; decisões do usuário em `docs/PROPOSTAS.md`); etapa 10c do `docs/PLANO.md`.

## Objetivo
O final novo fica completo e passa a ser o do jogo: a Bia e o Tonhão olhando as três estrelas da varanda do Terraço, a cozinha de casa de novo (agora é a Bia que dá a colher para uma criança na porta) e os créditos sobre a rua de casa, com a garagem acesa como escola. O final antigo sai.

## Fora do escopo
- Regras de jogo: quando o final toca, o botão História, o save e o Manual são os da v11 (`docs/spec-v11.md`) e não mudam.

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/FINAL.md` §3, §4, §8 e §9. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão no `FINAL2` desde a v11.16 e não mudam.
- **Desenho:** em `src/28-final.js`, o cenário `ab2Varanda(c,cam,o)` e as cenas `AB2_CENAS.ceu`, `.roda` e `.creditos`; a `abCostas` (`src/25-abertura.js`) ganha o cabelo `'coque'` e a rosa no ombro (`o.rosa`); o `ab2Cozinha` (`src/27-abertura-nova.js`) ganha `o.foto`. O `ab2Obra` sai.
- **A troca:** o `FINAL` passa a ser o roteiro novo (o nome `FINAL2` deixa de existir), com os créditos em `FINAL.creditos`. Tudo o que toca o final (a 1ª estrela, a estrela nova, o save da v10.10, o "O final" do botão História e o "Assistir o final" do modo dev) toca o novo, com as mesmas cenas por estrela e os mesmos momentos da v11.
- **A limpeza:** saem as 9 cenas da `AB_CENAS` (`telefone`, `placa`, `apagou`, `retrato`, `equipe`, `escola`, `ceu`, `roda`, `creditos`) e a própria `AB_CENAS`, o `FINAL_CREDITOS`, o `abLegenda` (e o que só ele usa no `AB_UI`), o `fade` e o caminho antigo da `Abertura` (`escuro` e `p` sem `cheio`), do `drawAbertura` e do `aberturaSom` (o `som` das cenas), e as funções de `src/25-abertura.js` que só o final antigo usava. O que a abertura ou o final novo usa fica. O `roteiro.final` continua (é ele que escolhe as cenas por estrela).
- **Modo dev:** a linha "Final novo (em obras)" sai; "Assistir o final: ★ | ★★ | ★★★" toca o novo.
- **Leitor de tela:** `Abertura.texto()` como hoje, com as legendas novas.
- **Versão:** `VERSAO` e `vtag` `v11.18`; a linha da v11.17 no `#ov-ver` passa a levar o número v11.18 (e o "versão atual") e a dizer: "Final novo: a manhã da estrela, a foto da equipe e a cozinha da Rosa de novo, no mesmo filminho da abertura."
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (`AB2_CENAS.ceu`, `.roda` e `.creditos` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido; `bia` e `tonhao` na 7 e `bia` na 8 caem na tela no instante da fala, com 40 px de margem; na 8 o título "Fim" é escrito de p 0,84 em diante; nos créditos, os três textos) → `smoke94` (CA1)
- **CA2** (o `FINAL` é o roteiro novo: os campos do `docs/FINAL.md` §4, `cheio` e `final`, os créditos em `FINAL.creditos`; `FINAL2`, `FINAL_CREDITOS` e `AB_CENAS` não existem; nenhuma cena do final cai no cartão de obra, e o `ab2Obra` não existe) → `smoke94` (CA2)
- **CA3** (o fluxo não mudou: 1ª estrela com a conversa, a cena, os créditos, o boletim e o cartão "Fim da história"; estrela nova só com a `placa` e as cenas não vistas, sem créditos; o save da v10.10; o botão História com "O final"; o modo dev com ★, ★★ e ★★★ e sem "Final novo (em obras)"; movimento reduzido só avança por toque; Pular termina) → `smoke76` (ajustado onde conferia o motor antigo, ver Testes)
- **CA4** (o final toca pelo motor novo: câmera, transição, a legenda que entra em `legDe`, a faixa de som da cena cortada ao trocar, e sem a faixa de legenda antiga) → `smoke88` (o CA2 e o CA6 dele reescritos) e `smoke94` (CA4)
- **CA5** (a abertura segue igual) → `smoke26`, `smoke89` a `smoke91` (o CA5 do `smoke91` ajustado) sem outra mudança
- **CA6** (o `#ov-abertura` cabe nos 14 tamanhos de tela) → `python3 menu_fit.py`
- **CA7** (o que se vê) → captura `shot_v11_18.js`: as cenas 7 e 8 e os créditos em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 8 lado a lado com a cena 1 da abertura nos mesmos p, e a folha das 8 cenas com 3 estrelas em p 0,6; conferir em recorte, contra o `docs/FINAL.md` §2, §3 e §8: na 7 as três estrelas juntas e a Bia de coque e colete; a 8 com o mesmo enquadramento e o mesmo movimento de câmera da `porta`, a Bia com o avental florido e o "Fim" sem cobrir ninguém; os créditos legíveis sobre o céu, com o letreiro "Cozinha da Rosa"; as 8 cenas juntas têm unidade de luz e de cor

## Partes
- `src/28-final.js`: `ab2Varanda`, as cenas 7 e 8 e os créditos.
- `src/18-abertura.js`: `FINAL` (o roteiro novo no lugar do antigo), `FINAL_CREDITOS`, `finalCenas`, a `Abertura` (`p`, `escuro`, `constructor`), `aberturaSom`.
- `src/25-abertura.js`: `abCostas`; a limpeza da `AB_CENAS`, do `abLegenda`, do `drawAbertura` e das funções órfãs.
- `src/27-abertura-nova.js`: `ab2Cozinha` (`o.foto`), a saída do `ab2Obra`.
- `src/40-interface.js` (a linha do modo dev), `src/43-telas.js` (`devFinal`, `tocaFinal`, `window.__lcc`), `src/10-constantes.js` (`VERSAO`), `src/02-telas.html` (`vtag`, `#ov-ver`).
- `ferramentas/editor.py`, se ele citar a `AB_CENAS`.

## Tarefas
- [ ] T1 Smoke novo `tests/smoke94.js` (CA1, CA2 e CA4), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 `ab2Varanda` e a cena 7, `ceu`; captura, recorte e acerto.
- [ ] T3 A cena 8, `roda`, ao lado da cena 1 da abertura; captura, recorte e acerto.
- [ ] T4 Os créditos; captura, recorte e acerto.
- [ ] T5 A troca (`FINAL`), o modo dev e os smokes `76`, `88`, `91` e `92`/`93` ajustados.
- [ ] T6 A limpeza de `src/18-abertura.js`, `src/25-abertura.js` e `src/27-abertura-nova.js`, com os smokes verdes.
- [ ] T7 `tests/shot_v11_18.js`, a folha das 8 cenas e a conferência do CA7; o editor de desenhos abrindo as cenas.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, o `CLAUDE.md` (a parte `25` sem as cenas do final; o editor), esta spec como entregue, a Etapa 10 arquivada, `tests/run_all.sh --tudo` verde, PR e merge; avisar o usuário para publicar e para atualizar o artifact do editor.

## Avisos para a execução
- Antes de apagar qualquer função de `src/25-abertura.js`, confira com `grep` em `src/` se a abertura (`src/27-abertura-nova.js`), o final novo (`src/28-final.js`) ou outra parte a usa (a `abPlacaMichel` está na cena 5 da abertura; a `abFlor`, a `abColher` e a `abMistura`, em várias); na dúvida, fica.
- A cena 8 é a `AB2_CENAS.porta` com outros papéis: parta dela (mesma câmera, mesmos tempos de virar o rosto e de entrar), sem mudar a `porta`.
- O `smoke76` confere o fluxo do final (deve continuar valendo como está) e, de passagem, o motor antigo (`FINAL.fade`, a `AB_CENAS`, o `som` das cenas): só essas checagens mudam, para o motor novo. O `smoke88` (CA2 e CA6) e o `smoke91` (CA5) conferem o final antigo: reescreva para o novo, com as mesmas garantias.
- O `smoke92` e o `smoke93` citam o `FINAL2` e o cartão de obra: passam a citar o `FINAL` e a não esperar cartão de obra.
- Se as cenas não ficarem bonitas em duas rodadas de captura, pare e avise.

## Testes
`smoke94` novo (CA1, CA2 e CA4); `smoke76`, `smoke88`, `smoke91`, `smoke92` e `smoke93` ajustados onde conferiam o motor antigo, o `FINAL2` ou o cartão de obra (anotar quantas checagens mudaram em cada um); `tests/run_all.sh --tudo` verde (`menu_fit.py` incluído). Capturas de `shot_v11_18.js` conferidas em recorte e apagadas. No fechamento: quantas checagens o `smoke94` tem.

## Decisões em aberto
Nenhuma.

## Desvios
(no fechamento)

**Modelo:** Sonnet, esforço alto — um cenário novo, duas cenas e os créditos, mais a troca e a limpeza do código antigo, que pede cuidado com o que a abertura ainda usa.
