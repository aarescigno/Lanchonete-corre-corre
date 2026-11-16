# v11.17 — O final novo: o retrato, a foto da equipe e a escola (4, 5 e 6) (etapa 10b)

**Situação:** aprovada (16/11)
**Origem:** `docs/FINAL.md` §3, §4, §7 e §9 (roteiro e direção fechados no planejamento de 16/11; decisões do usuário em `docs/PROPOSTAS.md`); etapa 10b do `docs/PLANO.md`.

## Objetivo
Mais três cenas do final novo ganham desenho: a Bia pendurando a estrela ao lado do retrato da mãe, a foto da equipe (o clique que vira foto, como na abertura) e a garagem da Rosa reaberta como escola de cozinha. Continua só no modo dev.

## Fora do escopo
- As cenas 7 e 8 e os créditos, a troca e a limpeza (v11.18).

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/FINAL.md` §3, §4, §7 e §9. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão no `FINAL2` desde a v11.16 e não mudam.
- **Desenho:** em `src/28-final.js`, as cenas `AB2_CENAS.retrato` (`ab2Terraco` em `'noite'`), `.equipe` (`ab2Terraco` em `'manha'`, com a foto e os nomes) e `.escola`; em `src/27-abertura-nova.js`, o `ab2RuaCasa` ganha `o.dia`, `o.letreiro` e `o.dentro` (sem mudar o que a cena 11 da abertura passa: os três têm padrão que desenha como hoje).
- **A foto da cena 5:** os nomes, na ordem em que aparecem da esquerda para a direita, embaixo de cada um: Cami, Lia, Anselmo (atrás); Dani, Bia, Tonhão, Joca (na frente).
- **Modo dev:** nada novo; "Final novo (em obras)" passa a mostrar seis cenas desenhadas.
- **Versão:** `VERSAO` e `vtag` `v11.17`; a linha da v11.16 no `#ov-ver` passa a levar o número v11.17 (e o "versão atual") e a dizer: "O final está sendo refeito como a abertura: quadro cheio, câmera e música. Seis cenas prontas, por enquanto só no modo dev."
- **Manual:** nada muda.
- **Save:** nada muda.

## Critérios de aceite
- **CA1** (`AB2_CENAS.retrato`, `.equipe` e `.escola` desenham sem erro em p 0, 0,25, 0,5, 0,75 e 0,95, com e sem movimento reduzido, e não são mais o cartão de obra) → `smoke93` (CA1)
- **CA2** (cada cena devolve a cabeça de quem fala, `bia` na 4, `tonhao` na 5 e `dani` na 6, e, no instante `de` da fala, ela cai na tela com 40 px de margem) → `smoke93` (CA2)
- **CA3** (na cena 5, de p 0,6 em diante, os sete nomes são escritos no quadro, na ordem da regra; antes de p 0,6, nenhum) → `smoke93` (CA3)
- **CA4** (o `ab2RuaCasa` sem `dia`, `letreiro` e `dentro` desenha a cena 11 da abertura como antes: o mesmo texto no letreiro e a garagem da lanchonete) → `smoke93` (CA4) e `smoke91` sem mudança
- **CA5** (o `FINAL2` não mudou e o final antigo segue como está) → `smoke92` e `smoke76` sem mudança
- **CA6** (o que se vê) → captura `shot_v11_17.js`: as cenas 4, 5 e 6 em p 0,25, 0,6 e 0,9 (1220 x 600 e 844 x 390), a 5 também em p 0,8 (a foto), e as trocas `passa` (4 para 5 e 5 para 6); conferir em recorte, contra o `docs/FINAL.md` §3 e §7: na 4 a estrelinha presa ao lado do retrato e a pétala caindo; na 5 os sete inteiros, sem um cobrir o rosto do outro, e os nomes legíveis na foto; na 6 o letreiro "Cozinha da Rosa", as roseiras e a criança que prova; nenhum plano liso maior que um quarto do quadro; balão fora dos rostos

## Partes
- `src/28-final.js`: as três cenas (o `ab2Terraco` já existe).
- `src/27-abertura-nova.js`: `ab2RuaCasa` (`o.dia`, `o.letreiro`, `o.dentro`).
- `src/25-abertura.js`, para ler: `abPessoaFoto`, `abDani`, `abCrianca`, `abRoseira`, `abColher`; `src/21-cenario.js`, para ler: `drawFotoRosa`.
- `src/10-constantes.js` (`VERSAO`) e `src/02-telas.html` (`vtag`, `#ov-ver`).

## Tarefas
- [ ] T1 Smoke novo `tests/smoke93.js` (CA1 a CA4), visto falhar, incluído no `tests/run_all.sh`.
- [ ] T2 A cena 4, `retrato`; captura, recorte e acerto.
- [ ] T3 A cena 5, `equipe`, com a foto e os nomes; captura (também em p 0,8), recorte e acerto.
- [ ] T4 O `ab2RuaCasa` de dia, com o letreiro e o lado de dentro, e a cena 6, `escola`; captura, recorte e acerto.
- [ ] T5 `tests/shot_v11_17.js` e a conferência do CA6.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A foto da cena 5 pode desenhar a mesma cena duas vezes: a cena inteira e, por cima do escuro, o quadro dela em ponto pequeno (`c.save`, `translate`, `scale`, `rotate`, `clip`), como a transição desenha a cena seguinte (`ab2Trans`). Para conferir os nomes no CA3, guarde-os num campo da cena (ex.: a cena devolve `nomes` junto das cabeças) ou espie o `fillText` no smoke.
- A cena 2 da abertura (`AB2_CENAS.carinho`) é o modelo do clique: o clarão, o escuro de 60% e a moldura girada com halo.
- O `smoke91` desenha a cena 11 da abertura e o `smoke26` toca a abertura: as opções novas do `ab2RuaCasa` têm de deixar a cena 11 igual.
- Uma cena por vez; se não ficar bonita em duas rodadas, pare e avise.

## Testes
`smoke93` novo (CA1 a CA4); `smoke91`, `smoke92` e `smoke76` sem mudança; `tests/run_all.sh` verde. Capturas de `shot_v11_17.js` conferidas em recorte e apagadas. No fechamento: quantas checagens o `smoke93` tem.

## Decisões em aberto
Nenhuma.

## Desvios
(no fechamento)

**Modelo:** Sonnet, esforço alto — três cenas no canvas, com o quadro a quadro fechado; a foto da equipe (sete pessoas e a foto dentro da cena) pede cuidado e conferência em captura.
