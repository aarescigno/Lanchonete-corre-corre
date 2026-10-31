# v8 — Manutenção e imprevistos

Etapa 2 do `docs/PLANO.md` (textos em `docs/PROPOSTAS.md`). Ao começar a sessão, o usuário aceitou as 4 sugestões da etapa: equipamentos fogão, geladeira e cafeteira; conserto de emergência com um toque no equipamento quebrado, além da revisão na lojinha; chuva e feriado já nesta versão; quebras só a partir do dia 4 (o desgaste corre desde o dia 1).

## Equipamentos (`MANUT` em `src/10-constantes.js`)
- Cada equipamento vai de 100% a 0%. Cada dia jogado da carreira gasta `base` + `uso` × usos do dia. Dia cheio gasta mais.
- Quebrou e não foi consertado no dia: o estado cai mais 10 pontos.
- Consertado na hora: volta a 100%.

| Equipamento | Desgaste por dia | Efeito quando quebrado | Revisão cheia | Conserto na hora |
|---|---|---|---|---|
| Fogão | 4 + 0,4 por prato pronto | Tonhão cozinha 40% mais devagar (`lento` 0,6) | R$ 500 | R$ 120 |
| Geladeira | 6 + 0,3 por prato pronto | ingredientes 50% mais caros (`ingred` 1,5) até consertar | R$ 440 | R$ 100 |
| Cafeteira | 4 + 1 por cafezinho servido | sem cafezinho (a Bia diz "Cafeteira parada!"; a Dani não pega café) | R$ 240 | R$ 50 |

## Quebra (do dia 4)
- Chance por equipamento no dia: 0,9 × (1 − estado)², no máximo 60% (`manutChance`). Com 100%, não quebra.
- Dias 1 a 3: só desgaste.
- O sorteio (clima e quebras) é feito ao começar o dia e fica no save (`save.manut.sorteio`) até o dia acabar. Recomeçar o dia não sorteia de novo.
- A quebra acontece entre 12% e 55% do tempo do dia.

## Conserto na hora
- O equipamento quebrado ganha uma **plaquinha** (círculo mostarda com chave inglesa e o preço) em cima dele. A plaquinha pulsa; com `prefers-reduced-motion`, fica parada.
- Um toque chama o técnico. O preço sai do dinheiro acumulado na hora, como a folha. Sem dinheiro: "Falta dinheiro!".
- O valor entra no lucro do dia ("Conserto na hora" nas contas do fim do dia) e no caixa, na coluna "Manut." do dia. O equipamento volta a 100%.

## Revisão na lojinha
- Aba nova **Manutenção**, entre Divulgação e Caixa.
- Um cartão por equipamento: estado (barra colorida), efeito, preço do conserto na hora e risco de quebrar no dia.
- Botão "Revisão: R$ X": volta a 100%. O preço é o valor cheio × o que o equipamento gastou, em múltiplos de R$ 5, com mínimo de R$ 10.
- Cartão "Revisar tudo", para os três.
- A revisão tira a quebra já sorteada daquele equipamento.
- A revisão não conta como a melhoria do dia. Entra na linha do caixa do dia seguinte (`caixaPend.man`).

## Imprevistos sem culpa (`CLIMA`)
Do dia 3 em diante, na carreira. São avisados na introdução do dia.

| Imprevisto | Chance no dia | Efeito | Visual |
|---|---|---|---|
| Chuva | 12% | 20% menos grupos; 35% deles viram entregadores | pingos e poças na calçada, que fica mais escura |
| Feriado | 10% | 25% mais grupos; 25% deles viram famílias | bandeirinhas coloridas na fachada |

## Na tela
- **Introdução do dia:** linha com o aviso do clima e "Equipamentos: Fogão X% · Geladeira Y% · Cafeteira Z%", e quais podem quebrar hoje (risco ≥ 5%).
- **Cenário:** geladeira nova, de pé ao lado do balcão (x 688–730 do mundo). Quebrada: porta aberta, luz apagada e poça d'água. Fogão quebrado: fumaça cinza e tickets acinzentados com X. Cafeteira quebrada: placa vermelha "QUEBRADO", sem vapor.
- **Fim do dia:** linhas "Quebrou" (com "(consertado)") e "Imprevisto" (Dia de chuva ou Feriado).
- **Caixa:** coluna "Manut." (revisões entram na linha do dia seguinte; consertos na hora, na do dia). Aparece no resumo para o WhatsApp e em "Para onde foi o dinheiro".
- **Como jogar:** dica nova sobre manutenção (plaquinha com a chave).
- **Versões:** painel com a v8.

## Save
- `save.manut` = `{ fogao, geladeira, cafeteira }` (estado de 0 a 1) e `sorteio` (o sorteio do dia, até o dia acabar).
- As linhas do caixa ganham `man`; as revisões da lojinha entram em `caixaPend.man`.

## Regras especiais
- **Turno sem fim:** nada se gasta nem quebra, e não há clima.
- **Modo dev:** revisão e conserto de graça.

## Calibração
Bot de `balance.js` e `carreira.js` com `EQUIPE=auto`:
- Sem manutenção (`MANUT=com`): ~1 quebra a cada 3,2 a 3,5 dias nos dias 4 a 7 (alvo: 1 a cada 3).
- Revisar tudo em toda lojinha (`MANUT=cuida`): custa ~11% do lucro médio dos dias 3 a 7 (alvo: 10–15%).
- Metas batidas nos dias 3 a 7 na carreira: 94% sem cuidar; 93–97% cuidando.

Primeira tentativa, que não funcionou: fogão 20% mais lento, geladeira +20%, revisão pela metade do preço e conserto na hora de R$ 80 a 180. A quebra custava só R$ 20 a 65, e cuidar não compensava: a manutenção virava só imposto. Por isso os efeitos ficaram em 40% e +50%, a revisão ficou mais cara e o conserto na hora, mais barato.

## Testes
- `tests/smoke16.js` (101 checagens): save, desgaste, sorteio, efeitos, conserto pelo toque, revisão, aba Manutenção, chuva e feriado em 400 sorteios, Turno sem fim, modo dev, introdução e fim do dia.
- `tests/harness.js` desliga os imprevistos por padrão (`MANUT.on=false`). `load({imprevistos:true})` liga.
- `balance.js` e `carreira.js` aceitam `MANUT=sem|com|cuida` (padrão `sem`, então os números antigos não mudam) e `CONSERTO=1|todos` (o bot chama o técnico). `MANUT_CFG` e `CLIMA_CFG` testam valores sem mexer em `src/`. Os dois imprimem uma linha RESUMO.
- `tests/shot_v8.py` gera as capturas em `capturas/v8/`: 3 equipamentos quebrados com plaquinhas, chuva, feriado, dia normal e a lojinha na aba Manutenção, no PC e no celular.

## Correção à parte
- `gera_botpage.sh` não tirava `module.exports.moveis` do bot, e o bot das capturas não carregava no navegador. Agora vira `mk.moveis`.
