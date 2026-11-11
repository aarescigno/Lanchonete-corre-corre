# v10 — O Terraço Suíça e a refeição completa (etapa 4a-1, 10 e 11/11)

Origem: `docs/PLANO.md`, sessão 4a-1 (planejada em 10/11). O topo da escada de pontos: menos mesas, mais finas; cada mesa come do começo ao fim e cada tempo vira nota no Gurugol. A parte A (o ponto, o foyer, o piano, o casal, o cap. 8) é o commit `d6f7e8a`; a parte B (a refeição completa, o cap. 9, a trilha dos tempos, a calibração) fecha a versão.

## O que mudou
### Parte A — o ponto
- `PONTOS[3]` (`terraco`): 20 lugares, mudança R$ 5.000 (nota 3,9 na Avenida), crédito R$ 8.000, sem entregador nem marmitas (`semRetirada`), sem bebida da espera (`bebida:null`, até a 4a-4), com o casal; o piano de cauda é obstáculo fixo; o foyer com a porta do elevador e as poltronas (R$ 600, espera 35% mais devagar); as mesas que passam de 20 lugares são vendidas pela metade na mudança. Fichas `p-terraco` e `c-casal`. Cap. 8, "Lá no alto".
### Parte B — a refeição completa (`TEMPOS`, só na carreira, `grp.tempos` em ponto com `tempos`)
- **O pedido:** cada pessoa pede uma entrada (o 2º item, sempre; o vegetariano sem opção fica sem) e um prato principal da categoria PF (`pedePrincipal`: PF, PF vegetariano, parmegiana); a conta soma os dois. Com o Anselmo no dia, um drink por pessoa e ninguém pede suco; sem ele, um suco por pessoa. Com a confeitaria, um doce por pessoa ao terminar o principal (sem sorteio); sem ela, não há sobremesa. O café do Joca segue por chance.
- **A cozinha em dois pedidos** (`Kitchen.submitTempo`): a comanda entra como o pedido da entrada (`tempo:0`; tempo × 0,6, sem o ×VIP, ocupa vaga do balcão mas não gasta prato limpo; ingrediente sobre o valor das entradas). Entregue a entrada, o grupo come por × 0,5 do tempo e a cozinha recebe sozinha o principal (`tempo:1`; tempo normal, ×VIP, gasta prato limpo; ingrediente sobre o valor dos principais mais o `VIP.dish`), na frente das entradas que ainda não começaram. Acabada a entrada, o grupo volta a `ordered` (`grp.tempo = 1`). O prato na mão (Bia e Cami) leva o `tempo`; a Cami só pega o principal quando o grupo já acabou a entrada; a Bia com o principal na mão e o grupo ainda na entrada vê "Ainda comendo!".
- **Notas** (1 a 5): entrada e principal = nota do prato (com o frio) menos 1 por coração perdido esperando aquele tempo; bebida = 5 menos 1 por coração perdido só esperando por ela (depois da refeição) e menos 1 se chegou depois do principal; sobremesa = 5 menos 1 por coração perdido esperando. No Gurugol: Qualidade da comida = média dos tempos servidos; Agilidade como antes; Diversidade do cardápio = `avalMenu` menos 1 sem a confeitaria e menos 0,5 sem o Anselmo no dia. Comentários novos (40%): "Do drink à sobremesa, tudo no tempo certo!", "Refeição completa de verdade!", "Um tempão entre a entrada e o prato.", "Faltou a sobremesa para fechar.", "Faltou uma carta de drinks.".
- **Refeição completa** (bebida, entrada, principal e sobremesa servidos): `stats.completas`, +30 pontos, "Refeição completa!" com faíscas; o fim do dia mostra "Refeições completas: N" (só no Terraço).
- **Trilha dos tempos** (`tempoMarcas(grp)` pura, `drawTempoTrilha`): 4 marcas pequenas sob os corações (taça, cúpula, prato, fatia), sem texto: pendente (contorno cinza), da vez (o que o grupo espera agora, pulsa; parada com `prefers-reduced-motion`), servida (cheia: verde 4 ou mais, amarela 2,5 ou mais, vermelha), o que a casa não serve (um tracinho). O balão da mesa mostra o prato do tempo da vez e, na mesa, a entrada e depois o principal.
- **Manual:** ficha `b-tempos` (aba Básico, "Refeição completa"), revelada no 1º dia no Terraço.
- **Cap. 9, "Do começo ao fim"** (`obj:{ completas:6, nota:4.5 }`, no molde das marmitas do cap. 5: `save.capComp`, `capFeito`); o `fim` provisório do cap. 8 sai, e o final é "Continua na próxima versão: o crítico do Michelzão.". Save da parte A que já terminou o cap. 8 (cap 9 sem o campo `v10`) começa o cap. 9 com a conversa de antes.
- **Visual:** no canto de cima à direita do salão do Terraço, o móvel que nos outros pontos é a mesinha das marmitas virou um aparador com um vaso de flores (sem estação, setinha nem letreiro: `marmitaOk` é falso).
- Fora do Terraço nada muda (grupo sem `tempos` paga e cozinha como antes; Missão zero e Turno sem fim iguais).

## Calibração (medida em 10/11, `balance.js` e `carreira.js`, sem editar `src/` antes de medir: `PONTO_CFG`)
"Equipe toda" = `PONTO=terraco EQUIPE=auto JOCA=4 ESPRESSO=1 CAMI=3 ANSELMO=1 GOURMET=1`; metas medidas em 80 rodadas (dias 8 a 10); o lucro é o do dia, depois de ingredientes, contas (com o aluguel) e folha.

| Regra do plano | Antes | Depois | Motivo |
|---|---|---|---|
| `grupos` | 0,45: o bot afiado com a equipe toda perde 0,3, 0,0 e 0,1 grupo por dia (ok, no máximo 1), mas as mesas ficam vazias em 33% do turno (ocupação 78%, 62% e 61%) | 0,50 (ocupação 82%, 67% e 72%: 26% vazias; perde 0,3, 0,1 e 0,1) | regra "mesas vazias em mais de 30% → 0,50" |
| `metaF` / `expertF` | 4,0 / 5,0: o lucro da equipe toda (R$ 1.560 a R$ 2.620 por dia) passava 100% das metas | 9,0 / 6,0 | equipe toda (bot afiado) passa 91% das metas e 3★ em 61% (80 rodadas); medido de novo depois de aluguel e cardápio mudarem |
| ganho sobre a Avenida (`DIAS=65`, contra `MUDA=2`, bot comum com a equipe toda; Avenida R$ 951 por dia) | Terraço R$ 1.981 por dia: ganho de R$ 1.030 | aluguel 1.000 → 1.200 (ganho R$ 810 com cardápio 2,5) → cardápio 2,5 → 2,4 (Terraço R$ 1.646, ganho R$ 695) | regra "acima de 700: aluguel 1.200; depois cardápio −0,1 por vez" |
| dias no negativo nos 5 dias depois da mudança | 0 | 0 | (nada a ajustar) |
| cap. 8 depois da mudança | 3 dias (o mínimo) em 3/3 | 3 dias | prazo (até 5 dias) |
| cap. 9 depois do cap. 8 | 1, 1 e 5 dias em 3 carreiras (`DIAS=90`) | 1, 1 e 5 dias | prazo (até 15 dias em 2/3); sai fácil para o bot, que serve 6 completas com nota alta quase sozinho |

A ordem do plano foi seguida (grupos, metas, ganho, negativo, prazos); como o ganho mexeu no aluguel e no cardápio, as metas foram medidas outra vez no fim (o valor da tabela é o do fim).

Valores finais (grupos 0,50; metaF 9; expertF 6; aluguel R$ 1.200; cardápio ×2,4; `PONTOS[3]`):
- equipe toda, bot afiado: 86 a 91% das metas e 3★ em 58 a 61%; bot comum com a equipe toda: 90% e 58%.
- `EQUIPE=auto` sozinho (sem Joca, Cami, Anselmo nem confeitaria): bot afiado 44% das metas e 9% de 3★; bot comum 2%. Sem equipe: 0%.
- Gurugol no Terraço (dias 8 a 10, equipe toda, bot afiado): nota do dia 4,65 a 4,77.
- Os outros pontos não mudaram: Garagem sem equipe (dias 3 a 7, 20 rodadas) 95, 75, 75, 50 e 60% das metas; `EQUIPE=auto` 100, 100, 100, 90 e 95%; Avenida `EQUIPE=auto` 95, 95 e 90%.

## Desvios do plano e decisões
- Aluguel R$ 1.200 e cardápio ×2,4 (o plano partia de R$ 1.000 e ×2,5), por causa da regra do ganho sobre a Avenida; `metaF`/`expertF` ficaram muito acima do valor de partida (4 e 5) porque a refeição completa triplicou o lucro por dia.
- O "da vez" da trilha vale para tudo o que o grupo espera agora (a bebida e o prato do tempo podem pulsar juntos).
- A nota da bebida só desconta o coração perdido depois da refeição (enquanto espera o prato, o coração conta no prato).
- O balão de doces (um por pessoa, com o tamanho de sempre) pode passar sobre a mesa do lado nas mesas de 4; não cobre corações, trilha nem selo de VIP.

## Testes
- `smoke60.js` (171 checagens): parte A (cartão Mudança, mudança, aluguel e preços, clientela, poltronas, piano, desenho, caps., saves e Manual) e a parte B: o pedido (entrada para todos, principal da categoria PF, conta, parmegiana e PF vegetariano), a cozinha (entrada ×0,6 sem gastar prato limpo, principal só depois da entrada e na frente das entradas, ingredientes, ×VIP), bebida e sobremesa, notas e Gurugol (comida = média, cardápio −1 e −0,5, comentários), refeição completa e `tempoMarcas`, a Avenida sem mudança, os caps. 8 e 9 (cartão de fim) e o save da parte A, a ficha `b-tempos`. Ajustados: `smoke45` (VERSAO v10) e `smoke53` (62 fichas, 12 no Básico).
- `bot.js`: o bot serve os dois tempos (só pega e leva o prato do grupo que está esperando por ele). `balance.js`: `ocup` e `grupos`. `carreira.js`: cap. 9 na linha `HISTORIA` e a linha `PRAZOS (v10)`.
- `shot_v10.js` / `capturas/v10`: a trilha dos tempos em 3 momentos com vários balões ao mesmo tempo (`trilha_tempos`), "Refeição completa!", o fim do dia com as completas, a conversa do cap. 9 e o cartão de fim do Terraço (`continua_terraco`), mais as cenas da parte A; `ERRORS: []`.
- Versão a guardar: `versoes/v9.6.13-fonte.html` (o `lanchonete.html` do commit `b29a6b0`, exato) e `versoes/v9.6.13.html` (a 1ª linha de `versoes/v1.html` mais a fonte). **Pendente:** a escrita em `versoes/` foi negada na sessão da parte B; falta criar os dois arquivos.
