# v10.5.2 — O ritmo da história (etapa R2)

**Situação:** entregue em 12/11
**Origem:** revisão do balanceamento e da retenção pedida pelo usuário em 12/11 (decisões do mesmo dia: conversas no meio do capítulo 3 e um capítulo novo na Avenida e outro no Terraço; falas e títulos aprovados pelo usuário como estão, em 12/11).

## Objetivo
A história para de ter um trecho mudo na Garagem e de correr nos pontos finais. No meio do capítulo 3, duas conversas marcam a reforma quitada e a nota que bateu no teto da garagem. Na Avenida e no Terraço, um capítulo a mais em cada ponto dá tempo de o jogador usar o que o ponto trouxe (a Cami e os VIPs; a Lia e os coquetéis) antes do capítulo da nota.

## Fora do escopo
- Metas e música: `docs/spec-v10.5.1.md`.
- Regras e preços da mudança de ponto, dos capítulos 1 a 6 e dos objetivos dos capítulos antigos: não mudam.
- Novidade de jogo nos dias parados da Garagem: são os eventos de bairro (etapa 4c, adiantada no roteiro em 12/11).
- O crítico do Michelzão e o final: etapa 6.

## Regras (decisões tomadas)
Medido na v10.5, em 12/11 (`DIAS=90 node carreira.js 8`, bot comum): cap. 3 no dia 17, mudança para a área industrial no dia 26, para a Avenida no 35 e para o Terraço no 41; cap. 7 em 1 a 2 dias, cap. 8 em 2 e cap. 9 em 1; a história acaba no dia 44. Com o bot afiado ou com mesas de 4, a mudança da Garagem sai no dia 19.

### Conversas no meio do capítulo 3 (Garagem)
Só no Modo História, como as outras conversas de cartão (`HIST_PLANTA`, `HIST_ENTREGA`): ficam pendentes no fim do dia e tocam antes do resumo, na ordem em que estão aqui. Nenhuma regra do capítulo muda.
- **`HIST_QUITOU`** (`save.convQuit`: 0 | `'pend'` | 1): fica pendente no fim do 1º dia em que `save.cap === 3` e `save.emp.resto` é 0. Falas:
  - bia: "Última parcela da reforma paga, tio!"
  - tonhao (nota: "rasgando o carnê"): "A garagem da Rosa é nossa de novo."
  - dani: "E agora, o dinheiro vai pra onde?"
  - bia: "Pro cofrinho da mudança."
- **`HIST_TETO`** (`save.convTeto`: 0 | `'pend'` | 1): fica pendente no fim do 1º dia em que `save.cap === 3` e a nota geral do Gurugol (arredondada a uma casa) é pelo menos `avalMinimo` da Garagem (2,7). Falas:
  - dani: "Bia, olha o Gurugol! Nota 2,7!"
  - bia: "Será que sobe mais?"
  - tonhao: "Garagem tem teto, Bia. Pra nota subir de verdade, só num lugar maior."
  - bia: "Então é juntar pra mudança."
- Se o capítulo 3 se cumpre no mesmo fim de dia, as duas que ainda não tocaram passam direto a 1 (vistas), sem tocar: a conversa de depois do capítulo já diz o mesmo.

### Capítulos novos (a história passa de 9 para 11 capítulos)
A ordem nova: 1 a 6 como hoje; **7 novo (Avenida)**; 8 = o antigo 7 ("Nota de restaurante"); 9 = o antigo 8 ("Lá no alto"); **10 novo (Terraço)**; 11 = o antigo 9 ("Do começo ao fim"). Os textos e objetivos dos antigos não mudam; o `fim` de cada ponto continua no último capítulo dele (8 e 11).
- **Objetivos novos em `obj`:**
  - `equipe:'cami'|'lia'`: cumprido com a pessoa contratada (`save.equipe` dela acima de 0). Texto do item: **"Contratar a Cami"** ou **"Contratar a Lia"**; cumprido, **"Cami contratada"** ou **"Lia contratada"**.
  - `vip:N` e `drinks:N`, sempre com `vezes:V`: o dia conta quando `stats.vip` (VIPs que pagaram a conta) ou `stats.drinks` (coquetéis servidos) chega a N; `save.capVezes` soma 1 por dia que conta (não precisam ser seguidos) e o item se cumpre com `capVezes >= V`. Textos: **"3 VIPs bem atendidos num dia, 3 vezes (1 de 3)"** e **"8 coquetéis servidos num dia, 3 vezes (1 de 3)"**.
  - `save.capVezes` zera em `avancaCap`, como `capAzul` e `capFeito`.
- **Capítulo 7, "Salão de gente grande"** (`ponto:'avenida'`, `obj:{ equipe:'cami', vip:3, vezes:3 }`):
  - antes: bia: "Vinte e quatro lugares, tio. Sozinha no salão eu não dou conta." · tonhao: "Conheço uma garçonete de rodízio, a Cami. Rápida que só ela." · dani: "E aqui vem gente importante. Não pode sair ninguém de cara feia!"
  - depois: bia: "Três dias de VIP saindo feliz!" · dani: "A Cami já sabe o nome de todo freguês." · tonhao: "Salão redondo. Agora é a nota subir."
- **Capítulo 10, "A casa completa"** (`ponto:'terraco'`, `obj:{ equipe:'lia', drinks:8, vezes:3 }`):
  - antes: tonhao: "Quatro tempos por mesa, Bia. Sozinho no fogão eu não venço." · bia: "A Lia, ajudante de cozinha, tá procurando serviço." · dani: "E o pessoal daqui gosta de um coquetel antes da entrada!"
  - depois: bia: "A cozinha tá voando, tio!" · tonhao (nota: "provando um coquetel"): "E o balcão de drinks não para." · dani: "Agora só falta a refeição perfeita."
- **Calibração com o bot** (`DIAS=90 node carreira.js 8`; a linha `HISTORIA` passa a mostrar os 11 capítulos):
  1. O capítulo 7 novo tem de levar de 3 a 6 dias (mediana) depois do capítulo 6. Passando de 6, `vip` 3 → 2.
  2. O capítulo 10 novo tem de levar de 3 a 6 dias depois do capítulo 9. Passando de 6, `drinks` 8 → 5.
  3. A história tem de acabar (capítulo 11) entre os dias 48 e 60, com 0 dias no negativo e 0 lanchonetes tomadas. Fora disso, pare e pergunte.
- **Modo dev:** `DEV_CAPS` passa a ter 12 linhas e o painel, os botões dos capítulos 1 a 11 e o Fim. A linha 7 nova é a 7 de hoje com `dia:34`, `caixa:1500` e `cami:0`; a 8 é a 7 de hoje com `dia:38`; a 9 é a 8 de hoje com `dia:50` e `pdia:50`; a 10 nova é a 9 de hoje com `dia:54`, `pdia:50`, `caixa:4000` e `lia:0`; a 11 é a 9 de hoje com `dia:58` e `pdia:50`; a 12 (o Fim) é a 10 de hoje com `dia:64` e `pdia:50`. O botão das conversas pendentes do modo dev (`modo === 'vistas'` e o que marca pendentes) inclui `convQuit` e `convTeto`.
- **Manual:** nenhuma ficha nova. Fichas que hoje se revelam por número de capítulo de 7 a 9 passam ao número novo (8, 9 e 11).
- **Save:** campos novos `capV` (2), `capVezes`, `convQuit` e `convTeto`. Um save com `histV === 1` e sem `capV` converte o capítulo uma vez: 1 a 6 ficam; **7 → 7** (o capítulo novo da Avenida começa, com a conversa de antes e os contadores zerados); **8 → 9**; **9 → 10** (o capítulo novo do Terraço começa, do mesmo jeito); **10 (o Fim) → 12**. Em save antigo com `cap` acima de 3, `convQuit` e `convTeto` entram como 1.

## Critérios de aceite
- **CA1** `HISTORIA` tem 11 capítulos na ordem das Regras, com títulos, pontos, objetivos e falas iguais aos escritos; os capítulos 8, 9 e 11 são os antigos 7, 8 e 9 sem mudança de texto → `smoke69` (1)
- **CA2** No capítulo 3, o fim do dia em que a reforma zera deixa `convQuit` pendente, e o do dia em que a nota chega a 2,7, `convTeto`; cada uma toca uma vez só; se o capítulo se cumpre no mesmo dia, as duas ficam em 1 sem tocar → `smoke69` (2)
- **CA3** Capítulo 7: sem a Cami o item diz "Contratar a Cami"; com ela, "Cami contratada"; um dia com 3 VIPs que pagaram soma 1 em `capVezes`, um com 2 não soma; com a Cami e `capVezes` 3 o capítulo se cumpre e a linha do objetivo é a das Regras → `smoke69` (3)
- **CA4** Capítulo 10: o mesmo com a Lia e 8 coquetéis → `smoke69` (4)
- **CA5** `capVezes` zera quando o capítulo avança; o cartão de fim de ponto aparece no fim dos capítulos 8 e 11, e a mudança para o Terraço só fica à mostra a partir do capítulo 9 à espera → `smoke69` (5)
- **CA6** Saves da v10.5 nos capítulos 6, 7, 8, 9 e no Fim convertem para 6, 7, 9, 10 e 12; o do 7 e o do 9 abrem com a conversa de antes do capítulo novo; carregar de novo não converte outra vez → `smoke69` (6)
- **CA7** `devCapitulo(n)` monta os 12 saves das Regras sem erro, e o painel do modo dev tem os 12 botões → `smoke69` (7)
- **CA8** Bot: capítulo 7 novo e capítulo 10 novo levam de 3 a 6 dias cada um; a história acaba entre os dias 48 e 60; 0 dias no negativo e 0 lanchonetes tomadas → `DIAS=90 node carreira.js 8` (passos 1 a 3)
- **CA9** As conversas novas cabem no balão sem cortar texto → capturas das duas conversas da Garagem e das de antes dos capítulos 7 e 10 (recorte ampliado do balão; olhar e apagar)

## Partes
- `src/10-constantes.js`: `HISTORIA`, `DEV_CAPS`, `HIST_QUITOU` e `HIST_TETO` (junto de `HIST_PLANTA`), fichas do `MANUAL` com capítulo de 7 a 9.
- `src/12-clientes.js`: `normSave` (campos novos e a conversão do capítulo).
- `src/16-jogo.js`: o fim do dia (a faixa das linhas 1128 a 1160: contadores do capítulo e conversas pendentes), `capObj`, `avancaCap`, `devCapitulo` e as funções de conversa do modo dev (perto da linha 1955).
- `src/43-telas.js`: `fluxoHistoria` (as duas conversas novas na fila).
- `src/02-telas.html` e `src/40-interface.js`: os botões de capítulo do painel do modo dev.
- `tests/carreira.js`: `capDia` de 1 a 11 e a linha `HISTORIA`; `tests/bot.js` se o bot precisar contratar a Cami e a Lia mais cedo.

## Tarefas
- [x] T1 `smoke69` com os CA1 a CA7 (falhando) e a linha dele no `run_all.sh`.
- [x] T2 `HISTORIA` com os dois capítulos novos; `capObj`, o fim do dia e `avancaCap` com `equipe`, `vip`, `drinks`, `vezes` e `capVezes`.
- [x] T3 `HIST_QUITOU` e `HIST_TETO`: pendência no fim do dia, fila do `fluxoHistoria`.
- [x] T4 `normSave`: campos novos e a conversão dos saves da v10.5.
- [x] T5 Modo dev: `DEV_CAPS`, botões e conversas.
- [x] T6 Smokes e capturas antigos que citam os capítulos 7 a 9 pelo número (ver Avisos) passam aos números novos.
- [x] T7 `carreira.js` com 11 capítulos; calibração (passos 1 a 3) anotada em Testes; capturas do CA9.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- Os números de capítulo fixos no código de jogo são só `cap >= 4`, `cap === 2` e `cap >= 2` (não mudam); `mudancaVisivel` já acha o 1º capítulo do ponto pela `HISTORIA`. O que muda de número está nos testes: `carreira.js`, `smoke42`, `smoke55`, `smoke60` a `smoke67` e os `shot_v10*.js` citam capítulos de 7 a 9.
- `stats.vip` soma em `collectBill` (VIP que pagou) e `stats.drinks` soma os coquetéis entregues; confirme o campo de `save.equipe` da Cami e da Lia (há também `camiFora` e `liaFora`, da folha cortada: pessoa cortada no dia continua contratada).
- As conversas só usam `bia`, `tonhao` e `dani`, que já têm retrato no balão.
- O bot da campanha contrata a Cami 2 dias depois de chegar à Avenida e a Lia 2 dias depois do Terraço; os coquetéis dependem do Anselmo, que ele contrata só no Terraço.

## Testes
- `smoke69` novo; `carreira.js` mostra os 11 capítulos e, se der, a linha `PRAZOS` com os dias dos capítulos 7 e 10 novos.
- No fechamento: checagens do `smoke69` e a calibração medida.

## Decisões em aberto
Nenhuma.

## Desvios
- **Medido** (`DIAS=90 node carreira.js 8`, 12/11): cap. 3 no dia 16, cap. 6 no 37, cap. 7 no 40, cap. 8 no 41, cap. 9 no 45, cap. 10 no 48, cap. 11 no 49; mudança para a área industrial no dia 27, para a Avenida no 35 e para o Terraço no 43. O cap. 7 levou 3 a 4 dias depois do 6 (mediana 3) e o cap. 10 levou 3 dias depois do 9: dentro de 3 a 6, então `vip` 3 e `drinks` 8 ficaram. A história acabou no dia 49 (alvo 48 a 60), com 0 dias no negativo, 0 empréstimos à força e 0 lanchonetes tomadas. `smoke69`: 86 checagens verdes.
- **Conversão de save com a conversa de depois pendente:** a Regra manda 7 → 7 e 9 → 10, mas um save da v10.5 que fechou o antigo cap. 7 (ou 9) e ainda tem `conversa: 'depois'` pendente é o capítulo cumprido, então vira o 8 (ou o 11) e a conversa de depois toca no capítulo certo. Sem isso o jogador ouviria "Três dias de VIP saindo feliz!" sem ter jogado o capítulo novo. Coberto no `smoke69` (6). Os saves sem a conversa pendente seguem a Regra.
- **Pré-v10.5, `cap === 9 && v10 !== 1`:** a regra velha do `normSave` (a parte A da v10, sem o campo `v10`, abre "Do começo ao fim" com a conversa de antes) passou a valer para o cap. 11, que é onde "Do começo ao fim" está agora.
- **Manual:** o texto não tem ficha que se revele por número de capítulo (os ganchos são por ponto e por dia), então nenhuma ficha mudou.
- **Cartões da Cami e da Lia no modo dev:** nos saves do cap. 7 e do 10 (as linhas pedem Cami 0 e Lia 0) o cartão delas é aberto de propósito (`devLibera`), senão o objetivo "Contratar" não teria como ser cumprido ali; nos outros capítulos vale a regra de antes (o cartão da pessoa contratada abre do 2º capítulo do ponto em diante).
- **Em aberto para o usuário (pergunta, não mudou nada):** no jogo de verdade, o cartão da Cami só abre depois do curso de espresso do Joca (`LIBERA.cami`, sem garantia por dia, `ate:999`), e o da Lia só depois de um curso do Tonhão (`entradas` ou `alta`). Quem não fizer esses cursos não consegue cumprir "Contratar a Cami" no cap. 7 nem "Contratar a Lia" no 10 (o bot os faz). Se quiser, uma garantia por dia (`ate`) nesses dois cartões resolve com uma linha cada.
- **Testes e capturas antigos:** `smoke42`, `smoke60`, `smoke63`, `smoke64`, `carreira.js` e os `shot_*` passaram aos números novos (e `capV:2` nos saves montados à mão); os demais smokes que montam saves com capítulo de 7 a 9 sem `capV` seguem passando porque a conversão dá o mesmo capítulo (8 → 9) ou um que só serve de pano de fundo.
- **Capturas (CA9):** as 6 conversas novas (as duas da Garagem e as de antes e depois dos caps. 7 e 10, 20 falas) cabem no balão sem cortar texto; as capturas foram apagadas.

**Modelo:** Sonnet, esforço alto (história, save, modo dev e muitos testes renumerados ao mesmo tempo).
