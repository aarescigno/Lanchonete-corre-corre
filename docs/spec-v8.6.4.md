# v8.6.4 — Notas do Gurugol com teto por ponto

Pedido do usuário em 29/10 (texto em `docs/PROPOSTAS.md`): 4 ★ e pouco numa garagem é nota alta demais. Se a Garagem já dá 4,4, a progressão dos pontos vira uma briga por vírgulas até o 5. A proposta: na Garagem, a nota máxima (e difícil) é 3; cada ponto sobe o teto, até 5 no Terraço Suíça; e há uma margem que sobe e desce, para um dia especial chegar a 3,5 ou 3,8.

## O que mudou
- **Teto por ponto** (`AVAL.teto = [3, 3.7, 4.3, 5]`, pelo `nivel` do ponto; `avalTeto(ponto)`): os 5 critérios continuam medindo o serviço de 1 a 5, como na v8.4 (agora em `avals[i].s`), e a nota que vai para o Gurugol fica na escala do ponto: `avalEscala(v, teto) = 1 + (v − 1)·(teto − 1)/4`. Serviço 5 vale o teto; 1 continua 1.
- **Humor do cliente** (`AVAL.humor`), a "margenzinha": cada avaliação ganha de −0,3 a +0,3, e 20% dos clientes saem encantados, com +0,6 a +1,2. Nenhum critério passa de teto + 0,8 (3,8 na Garagem). Quem sai bravo não tem humor.
- **Movimento** pela fração do teto (`avalFrac`): −10% com 1 ★, neutro na metade (2 ★ na Garagem; era 3 ★) e +10% no teto (3 ★ na Garagem). O efeito para o mesmo jogo fica quase o mesmo de antes.
- **Cores** do número no HUD e do balãozinho pela fração do teto: verde a partir de 75% (2,5 ★ na Garagem), amarelo a partir de 50%.
- **Comentários:** o elogio continua pelo serviço (4 ou mais). Abaixo do Terraço, 30% dos elogios lembram que o lugar é simples (`AVAL_SIMPLES`, por nível: "Comida boa! Pena que é numa garagem.").
- **Textos:** a aba Gurugol da lojinha diz que, ali, o atendimento perfeito vale 3,0 ★ e que os pontos melhores sobem a nota até 5; o Como jogar explica o teto (o desenho mostra 3,0 com 3 estrelas). As faixas da caixa animada (prata a partir de 4, ouro, diamante) não mudaram: na Garagem a nota fica "pura", e as faixas viram recompensa dos pontos de cima.
- **Save:** as notas guardadas antes (avaliações, comentários e a nota do dia no Caixa) passam para a escala da Garagem uma vez só (`save.avalEsc = 2`); 4,6 vira 2,8.

## Balanço (`DUMP=1 AVAL_MOV=1 node balance.js 150`, nota do dia e geral, últimas 30)
| Bot | nota geral p10 / p50 / p90 (máx.) | dias com a geral ≥ 3,0 | nota do dia p50 / p99 (máx.) | dias ≥ 3,5 |
|---|---|---|---|---|
| afiado com equipe | 2,73 / 2,82 / 2,92 (3,06) | 5% | 2,81 / 3,50 (3,72) | 1,2% |
| comum com equipe | 2,65 / 2,76 / 2,87 (3,07) | 2% | 2,75 / 3,50 (3,80) | 1,1% |
| sem equipe | 2,40 / 2,52 / 2,64 (2,79) | 0% | 2,53 / 3,26 (3,66) | 0,2% |

O afiado era ~4,4 ★ (+7% de movimento) e fica em ~2,8 (+8%). Lucro e metas não mudam (o `balance.js` zera as avaliações a cada dia, como antes).

## Para a etapa 3
A nota mínima para sair da Garagem (o usuário tinha pedido 4,5 ★, quando o afiado ficava entre 4,35 e 4,5) passa a ser, como sugestão, **2,8 ★** (90% do teto); 3,4 na área industrial e 4,0 na Avenida Brasil. Ao mudar, as avaliações antigas continuam na média, e a nota sobe aos poucos até o teto novo.

## Testes
- `run_all.sh`: todos passam. `smoke25` confere o teto, a escala, o humor (até 3,8), o movimento na Garagem e no Terraço e a conversão do save; `smoke28` lê as notas do serviço do entregador em `s`.
- `balance.js`: o `DUMP=1` mostra também a nota do Gurugol no dia e a geral.
