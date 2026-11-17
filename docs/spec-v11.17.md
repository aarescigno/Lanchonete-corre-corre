# v11.17 — O final novo: o retrato, a foto da equipe e a escola (4, 5 e 6) (etapa 10b)

**Situação:** entregue em 17/11
**Origem:** `docs/FINAL.md` §3, §4, §7 e §9 (roteiro e direção fechados no planejamento de 16/11; decisões do usuário em `docs/PROPOSTAS.md`); etapa 10b do `docs/PLANO.md`.

## Objetivo
Mais três cenas do final novo ganham desenho: a Bia pendurando a estrela ao lado do retrato da mãe, a foto da equipe (o clique que vira foto, como na abertura) e a garagem da Rosa reaberta como escola de cozinha. Continua só no modo dev.

## Fora do escopo
- As cenas 7 e 8 e os créditos, a troca e a limpeza (v11.18).

## Regras (decisões tomadas)
Valem, sem mudança de texto nem de número, `docs/FINAL.md` §3, §4, §7 e §9. Os textos, os tempos, a câmera, o `sai`, o `clima` e os `fx` das cenas já estão no `FINAL2` desde a v11.16 e não mudam.
- **Desenho:** em `src/28-final.js`, as cenas `AB2_CENAS.retrato` (`ab2Terraco` em `'noite'`), `.equipe` (`ab2Terraco` em `'manha'`, com a foto e os nomes) e `.escola`; em `src/27-abertura-nova.js`, o `ab2RuaCasa` ganha `o.dia`, `o.letreiro` e `o.dentro` (sem mudar o que a cena 11 da abertura passa: os três têm padrão que desenha como hoje).
- **A foto da cena 5:** os nomes, na ordem em que aparecem da esquerda para a direita, embaixo de cada um: Cami, Lia, Anselmo (atrás); Dani, Bia, Tonhão, Joca (na frente).
- **Corrigido na execução (17/11):** (a) a Bia da cena 4 fica em x 700 (a estrelinha presa em [576,326], a dois dedos do retrato) e, como a multiplicação da noite a escurece, uma luz quente no rosto e a estrelinha com o brilho entram por cima da noite (`o.topo` do `ab2Terraco`); (b) a estrela da Rosa no janelão passou para x `J.x + 0,3 J.w`, y `J.y + 130` (a câmera da cena 4 corta o alto e a cortina cobria o lugar antigo) e o piscar forte é um brilho por cima da noite (`o.pisca`); (c) na cena 5 a fileira de trás fica em y 472 e as duas fileiras mais abertas (frente: Dani 290, Bia 500, lugar 710, Joca 920, que abre 28 px; atrás: Cami 395, Lia 605, Anselmo 815; câmera do tripé em x 100) para os sete rostos aparecerem; a foto tem escala 0,54, e os nomes ficam em duas linhas (os de trás numa, os da frente noutra); (d) na cena 6 o lado de dentro tem as crianças na frente da bancada (x 498, 548 e 598; a do banquinho é a última), a panela em x 672 e a Dani em x 726; as que chegam passam a ser as de dentro por uma troca rápida (p 0,285 a 0,305); (e) de dia, também a rua, a calçada, a guia, a casa, o telhado e a janela da casa ficam mais claros, e há sol e nuvens.
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
- [x] T1 Smoke novo `tests/smoke93.js` (CA1 a CA4), visto falhar, incluído no `tests/run_all.sh`.
- [x] T2 A cena 4, `retrato`; captura, recorte e acerto.
- [x] T3 A cena 5, `equipe`, com a foto e os nomes; captura (também em p 0,8), recorte e acerto.
- [x] T4 O `ab2RuaCasa` de dia, com o letreiro e o lado de dentro, e a cena 6, `escola`; captura, recorte e acerto.
- [x] T5 `tests/shot_v11_17.js` e a conferência do CA6.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A foto da cena 5 pode desenhar a mesma cena duas vezes: a cena inteira e, por cima do escuro, o quadro dela em ponto pequeno (`c.save`, `translate`, `scale`, `rotate`, `clip`), como a transição desenha a cena seguinte (`ab2Trans`). Para conferir os nomes no CA3, guarde-os num campo da cena (ex.: a cena devolve `nomes` junto das cabeças) ou espie o `fillText` no smoke.
- A cena 2 da abertura (`AB2_CENAS.carinho`) é o modelo do clique: o clarão, o escuro de 60% e a moldura girada com halo.
- O `smoke91` desenha a cena 11 da abertura e o `smoke26` toca a abertura: as opções novas do `ab2RuaCasa` têm de deixar a cena 11 igual.
- Uma cena por vez; se não ficar bonita em duas rodadas, pare e avise.

## Testes
`smoke93` novo (CA1 a CA4); `smoke91`, `smoke92` e `smoke76` sem mudança; `tests/run_all.sh` verde. Capturas de `shot_v11_17.js` conferidas em recorte e apagadas.
**Medido:** o `smoke93` tem 51 checagens (CA1: 16, CA2: 12, CA3: 11, CA4: 12; o CA4 compara a assinatura de tudo o que o `ab2RuaCasa` desenha, medida antes da v11.17). `smoke92`: 87 (o CA4 dele saiu de 93 para 87, ver Desvios). `tests/run_all.sh` verde. As capturas (cenas 4, 5 e 6 em p 0,25, 0,6 e 0,9, em 1220 x 600 e 844 x 390, a 5 em p 0,8, as trocas `passa` e o movimento reduzido) foram conferidas em recorte contra o `docs/FINAL.md` §3 e §7 e apagadas.

## Decisões em aberto
Nenhuma.

## Desvios
- **`smoke92` e `smoke86` mudaram** (a spec previa os dois sem mudança): o CA4 do `smoke92` conferia que as cenas 4 a 8 e os créditos caem no cartão de obra, o que deixou de valer para as 4, 5 e 6; ele agora olha só as cenas que ainda não têm desenho (7, 8 e créditos; 87 checagens). O `smoke86` (lista do `#ov-ver`) passou a esperar `v11.17` no lugar de `v11.16`, no alto, com `v11.16.1` logo abaixo, sem "versão atual".
- **`smoke91` e `smoke95` também mudaram:** o CA2 do `smoke91` conta as cenas da `AB2_CENAS` fora as do final novo e ganhou `retrato`, `equipe` e `escola` na lista (continua conferindo a cena 11 e as 11 da abertura); o `smoke95` usava `v11.17` como a versão "nova" do servidor de mentira e passou a usar `v11.18`.
- **A linha da v11.16 virou a da v11.17** (como a spec manda) e a da v11.16.1 ficou como estava, sem "versão atual"; a lista segue com 26 linhas.
- **A cena 4 não ficou como o §7 em dois pontos de composição:** a Bia fica mais à direita e a estrela da Rosa no janelão foi para mais baixo (ver Regras, "Corrigido na execução"), por causa da câmera fixa pela spec.
- **A foto da cena 5** mostra o balão do Tonhão sobre a moldura (fora dos rostos), porque o motor mantém o balão até o fim da cena.
- **O CA1 do `smoke93` só procura o cartão de obra até p 0,75:** em p 0,95 a transição já desenha a cena seguinte, que pode ser o cartão (a 4 passa para a 5, mas a 6 e o `escuro` não).
- Cores do cenário de dia além das da spec (rua, calçada, casa, telhado, janela) e o sol com nuvens: escolhidas na captura.

**Modelo:** Sonnet, esforço alto — três cenas no canvas, com o quadro a quadro fechado; a foto da equipe (sete pessoas e a foto dentro da cena) pede cuidado e conferência em captura.
