# v11.18 — O final novo no ar: o céu, a roda, os créditos, a troca e a limpeza (etapa 10c)

**Situação:** entregue em 17/11
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
- [x] T1 Smoke novo `tests/smoke94.js` (CA1, CA2 e CA4), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 `ab2Varanda` e a cena 7, `ceu`; captura, recorte e acerto.
- [x] T3 A cena 8, `roda`, ao lado da cena 1 da abertura; captura, recorte e acerto.
- [x] T4 Os créditos; captura, recorte e acerto.
- [x] T5 A troca (`FINAL`), o modo dev e os smokes `76`, `88`, `91` e `92`/`93` ajustados.
- [x] T6 A limpeza de `src/18-abertura.js`, `src/25-abertura.js` e `src/27-abertura-nova.js`, com os smokes verdes.
- [x] T7 `tests/shot_v11_18.js`, a folha das 8 cenas e a conferência do CA7; o editor de desenhos abrindo as cenas.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, o `CLAUDE.md` (a parte `25` sem as cenas do final; o editor), esta spec como entregue, a Etapa 10 arquivada, `tests/run_all.sh --tudo` verde, PR e merge; avisar o usuário para publicar e para atualizar o artifact do editor.

## Avisos para a execução
- Antes de apagar qualquer função de `src/25-abertura.js`, confira com `grep` em `src/` se a abertura (`src/27-abertura-nova.js`), o final novo (`src/28-final.js`) ou outra parte a usa (a `abPlacaMichel` está na cena 5 da abertura; a `abFlor`, a `abColher` e a `abMistura`, em várias); na dúvida, fica.
- A cena 8 é a `AB2_CENAS.porta` com outros papéis: parta dela (mesma câmera, mesmos tempos de virar o rosto e de entrar), sem mudar a `porta`.
- O `smoke76` confere o fluxo do final (deve continuar valendo como está) e, de passagem, o motor antigo (`FINAL.fade`, a `AB_CENAS`, o `som` das cenas): só essas checagens mudam, para o motor novo. O `smoke88` (CA2 e CA6) e o `smoke91` (CA5) conferem o final antigo: reescreva para o novo, com as mesmas garantias.
- O `smoke92` e o `smoke93` citam o `FINAL2` e o cartão de obra: passam a citar o `FINAL` e a não esperar cartão de obra.
- Se as cenas não ficarem bonitas em duas rodadas de captura, pare e avise.

## Testes
`smoke94` novo (CA1, CA2 e CA4); `smoke76`, `smoke88`, `smoke91`, `smoke92` e `smoke93` ajustados onde conferiam o motor antigo, o `FINAL2` ou o cartão de obra; `tests/run_all.sh --tudo` verde (`menu_fit.py` incluído). Capturas de `shot_v11_18.js` conferidas em recorte e apagadas.
**Medido:** o `smoke94` tem 81 checagens (CA1: 43, CA2: 25, CA4: 13). Checagens mudadas: `smoke76` 4 reescritas (o roteiro, a `AB2_CENAS`, a legenda da placa com 3 estrelas, a cabeça da placa) e 1 ampliada (o painel dev sem "Final novo"), 74 no total; `smoke88` 5 (o CA2: câmera, escuro, faixa de legenda; o CA6 do som; o CA7 da `AB2_CENAS`), 84 no total; `smoke91` 4 (o CA2 e o CA5, a `AB_CENAS` e a lista da `AB2_CENAS`), 37; `smoke92` 8 removidas (o `FINAL` antigo, o cartão de obra) e 3 reescritas (o painel dev, "Assistir o final" e as bolinhas contadas só em y 584), 79 (eram 87); `smoke93` nenhuma (só o nome `FINAL2` virou `FINAL`), 51; `smoke86` 3 e `smoke95` (a versão do servidor de mentira) pelo número da versão. `tests/run_all.sh --tudo`: `menu_fit.py` com 658 conferências e 0 falhas nos 14 tamanhos de tela; o `balance.js 40` sem mudança (nada do jogo mexeu); todos os smokes verdes (a 1ª rodada achou um `v11.18` esquecido no `smoke95`, já corrigido). As capturas (cenas 7 e 8 e os créditos em p 0,25, 0,6 e 0,9, em 1220 x 600 e 844 x 390, a 8 ao lado da 1 da abertura, a folha das 8 cenas, o movimento reduzido) foram conferidas em recorte contra o `docs/FINAL.md` §2, §3 e §8 e apagadas; o editor de desenhos abre as 20 cenas (11 da abertura, 8 do final e os créditos) sem erro.

## Decisões em aberto
Nenhuma.

## Desvios
- **Os textos dos créditos ficam mais acima que na spec** (y 46, 98 e 136, no lugar de 110, 170 e 222): com a câmera dos créditos (`[610,240,1.3]` a `[610,300,1]`), o letreiro "Cozinha da Rosa" fica na tela entre y 155 e 225, e o telhado da casa, em y 92 a 160; os textos nos y da spec cobriam o letreiro. Eles seguem na metade de cima, sobre o céu e o telhado, com o mesmo corpo, a mesma ordem e os mesmos tempos de entrada. Ver as Regras corrigidas.
- **Os créditos mostram a garagem como a escola por dentro** (a Dani, as crianças e a panela de vapor, com o `ab2EsDentro`), sem ninguém na calçada.
- **A Bia e o Tonhão da cena 7 entram por transparência** em p 0,24 a 0,3 (a câmera, que a spec fixa, já mostra a cabeça deles em p 0, quando a spec pede só o céu).
- **A cena 8 segue os números do §8** (a Bia vira o rosto em p 0,34 a 0,42, a colher sai em p 0,55 a 0,62, a criança entra em p 0,55 a 0,74), e não os tempos de virar o rosto da `porta` (p 0,42 a 0,5), que são outros; a câmera é a mesma da `porta`. A Bia dá um passo (20 px) para a criança quando a colher sai.
- **O halo da foto da Rosa** é dourado sobre a parede clara (o `screen` não aparecia), e o `ab2Cozinha` ganhou também `o.fotoHalo`; a `puffCrespo` ganhou o parâmetro `cor` e a `abCrianca`, o `fecha` (olhos fechados), para o coque e a criança que prova.
- **Na folha de p 0,6, a cena 5 (`equipe`) mostra o clarão do clique** (o `clique` é em 4,8 s, p 0,6); nada a corrigir, é o efeito da v11.17.
- **`smoke86` e `smoke95` mudaram** pelo número da versão (como na v11.17). O `smoke92` perdeu 8 checagens que só conferiam o final antigo e o cartão de obra.
- A `drawAbertura2` virou `drawAbertura` (a antiga saiu); o `aberturaSom` perdeu o 2º parâmetro; `AB_UI` perdeu `leg` e `legLinha`. Saíram do `src/25-abertura.js`: as 9 cenas da `AB_CENAS`, a `AB_CENAS`, o `abLegenda`, o `AB_CHAO`, o `AB_FOGAO`, o `abCeu`, o `abChao`, o `abJanela`, o `abCozinhaCasa`, o `abCoracoes`, o `abFachadaAurora`, o `abJanelaCidade` e o `abTerracoSala` (nenhuma tinha outro uso em `src/`); do `src/27-abertura-nova.js`, o `ab2Obra` e o `ab2ObraFalas`; do `src/18-abertura.js`, o `FINAL` antigo, o `FINAL_CREDITOS`, o `fade` e o caminho antigo de `p`, `escuro` e `legA`. O `ferramentas/editor.js` lista as 20 cenas (o `editor.py` só ganhou o comentário novo).
- **Regras corrigidas:** (a) créditos com os textos em y 46, 98 e 136 (largura de contorno 8, 5 e 4); (b) a cena 7: a Bia em x 556 (e 566 ao encostar a cabeça) e o Tonhão em x 668, com a rosa no ombro e o coque na `abCostas`.

**Modelo:** Sonnet, esforço alto — um cenário novo, duas cenas e os créditos, mais a troca e a limpeza do código antigo, que pede cuidado com o que a abertura ainda usa.
