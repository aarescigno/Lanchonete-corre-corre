# v9.6.1 — Rebalanceamento da escada completa (sessão 3b-7)

## O que mudou (só números, mais o fator da expert)
| Número | Antes | Depois | Motivo |
|---|---|---|---|
| `PONTOS[1].metaF` (área industrial) | 1,25 | **2,3** | com `EQUIPE=auto`, passava 99% das metas (lucro médio 600–760 contra metas de 175–225) |
| `PONTOS[2].metaF` (Avenida) | 1,7 | **3,2** | com `EQUIPE=auto`, passava 98% (lucro médio 780–1130 contra 240–305) |
| `PONTOS[1].expertF` (novo) | (= metaF, 1,25) | **1,6** | sem ele, a expert subiria junto com a meta e a 3★ do bot afiado cairia de ~60% para ~35% |
| `PONTOS[2].expertF` (novo) | (= metaF, 1,7) | **3,8** | a 3★ do bot afiado na Avenida estava em 93% (alvo ~60%) |
| `CAMI_MESAS_MAX` | 3 | **2** | pendência da 3b-6: com a equipe toda, a Avenida passa 100% das metas mesmo depois das metas novas, com 3 ou 2 mesas; pela regra do plano, fica com 2 |

- **`expertF`** (`16-jogo.js`, `diaPonto`): a expert (3ª estrela) dos pontos vale ×`expertF`; sem ele, ×`metaF`, como antes. Foi a única mudança de código: com um fator só, não dava para levar a meta à faixa sem matar a 3ª estrela (no ponto, a 3★ do afiado depende de não perder ninguém, não do dinheiro). A meta continua abaixo da expert (área industrial: domingo 415 e 530; Avenida: 575 e 1255).
- **Sem mudar:** a Garagem (metas, expert), preços, aluguéis, mudança, `AVAL`, `avalMinimo`, `MANUT`, equipe e cursos.
- Save da v9.6 carrega igual; um save com 3 mesas da Cami fica com as 2 primeiras (`normSalao`, como já fazia acima do teto).

## Como foi decidido
1. **Medição sem mudar nada** (tabela abaixo, coluna "v9.6"): Garagem na faixa; área industrial e Avenida muito acima com equipe, e a mudança sem equipe não compensa (lucro ~0 e negativo).
2. **Rodada 1** (pela distribuição do lucro de 80 dias por configuração, `DUMP=1`): o `metaF` que deixa `EQUIPE=auto` em ~90% e o `expertF` que deixa a 3★ do bot afiado em ~60%; conferido com `PONTO_CFG='{"metaF":2.3,"expertF":1.6}'` e `'{"metaF":3.2,"expertF":3.8}'`. A equipe toda na Avenida (`JOCA=3 ESPRESSO=1 CAMI=3 ANSELMO=1 GOURMET=1`) seguiu em 100% com 3 mesas, com 2 mesas e com a Cami em "Tarefas": daí o `CAMI_MESAS_MAX` 2.
3. **Rodada 2** (números já em `src/`): conferência final, abaixo.
- **Garagem:** com equipe ficou em 96–97% (sem equipe ~60%). Para descer a 95% seria preciso subir as metas dos dias 3 a 5 em +30% ou mais (com equipe passava 94%, sem equipe caía para 49%) e mexer na expert da Garagem, calibrada desde a v8.3.9; a diferença está no ruído entre lotes (95,5% num lote de 40), então ficou como está.

## Números medidos (`balance.js 80`; dias 3 a 7 na Garagem, 8 a 10 nos pontos)
| Configuração | v9.6: passou | v9.6.1: passou | v9.6.1: 3★ | metas (dom/seg/ter) | lucro médio |
|---|---|---|---|---|---|
| Garagem, sem equipe | 58% (de 40) | 60% | ~0% | 135/63/90/140/170 | 120–185 |
| Garagem, `EQUIPE=auto` | 97% | 96% | 1–19% | idem | 240–340 |
| Área industrial, `EQUIPE=auto` | 99% | **93%** | 19% | 415/320/345 | 615–660 |
| Área industrial, `EQUIPE=auto JOCA=3` | 100% | 99% | 33% | idem | 700–875 |
| Área industrial, `BOT=afiado EQUIPE=auto` | 97% | **89%** | **62%** | idem | 630–760 |
| Área industrial, sem equipe | 7% | 3% | 0% | idem | −15 a +19 |
| Avenida, `EQUIPE=auto` | 98% | **92%** | 1% | 575/450/480 | 800–1100 |
| Avenida, equipe toda (Cami em "Minhas mesas", 2 mesas) | 100% (3 mesas) | 100% | 35% | idem | 1290–1870 |
| Avenida, `BOT=afiado EQUIPE=auto` | 100% | 99,6% | **62%** | idem | 1060–1490 |
| Avenida, sem equipe | 8% | 0,4% | 0% | idem | −180 a −115 |

- Nota do Gurugol no balance: área industrial 3,3–3,5 com equipe (teto 3,8, mínimo para sair 3,4); Avenida 4,0–4,2 (teto 4,3).
- O afiado na Avenida passa quase sempre (o lucro dele é ~40% maior que o do bot comum): subir a meta para ele ficar em 85–90% derrubaria o `EQUIPE=auto` para ~75%. Ficou o alvo do `EQUIPE=auto`, que é o da etapa.

## Carreira (`DIAS=50 node carreira.js 12`)
- Mudança para a área industrial no dia **17** e para a Avenida no dia **27** (antes da 3b: dia ~17 na v9; 27 na v9.6), caps. 3 a 7 nos dias 16, 19, 26, 29 e 36; R$ 800 no dia mediano 16; **0 dias no negativo**, 0 empréstimos à força, 0 dias no negativo nos 5 dias depois de cada mudança. As metas não mexem no dinheiro (só nas estrelas), então a escada de dinheiro é a mesma da v9.6.
- Lucro médio por dia: Garagem R$ 317, área industrial R$ 628, Avenida R$ 845 (+R$ 217 sobre a área industrial). Joca no dia 22, espresso no 31, Cami no 32, Anselmo no 33.
- Metas batidas nos pontos com a carreira: ~75–100% por dia (média ~90%); antes, ~100%.
- Gurugol geral: 3,4 por volta do dia 23 (a nota mínima para a Avenida chega antes do dinheiro) e 4,3 na Avenida, no teto.
- **Fica para a 4a:** o ganho da área industrial sobre a Garagem é de ~R$ 310 por dia (a v9 mirava ~R$ 140; a mudança se paga em ~3 dias). Não entrou aqui porque a mudança chega no mesmo dia de antes e o plano manda mexer nas metas, não nos preços; o caixa do dia 50 (~R$ 17 mil) é o que o Terraço vai encontrar.

## Testes
- `tests/run_all.sh --tudo` verde. Ajustados só os valores dos números mexidos: `smoke38` (meta ×2,3 e expert ×1,6), `smoke42` (×3,2 e ×3,8), `smoke48` (até 2 mesas, a 3ª recusada, save com mais de 2 fica com 2, cartão "2 de 2 mesas"). `balance.js`: `CAMI_MESAS` padrão 2.
- O `smoke28` ("chuva no dia 5: o bot afiado bate a meta em 3/6") falhou uma vez por sorteio e passou em 3 repetições, com e sem as mudanças (é da Garagem, que não mudou). O `smoke38` tem o mesmo tipo de sorteio ("entregador com peso 2 (~24%), mais que na Garagem") e falha ~1 vez em 4 rodadas; os pesos da clientela não mudaram nesta versão. Os dois ficam para quem mexer nesses smokes (mais grupos no sorteio ou margem maior).
