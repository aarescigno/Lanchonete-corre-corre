# v9.0.4 — A lojinha abre aos poucos (31/10/2026)

Pedido do usuário (`docs/PROPOSTAS.md`, etapa 2c-r7a do plano): a lojinha não deve assustar quem chega nela pela primeira vez. No Modo História, os cartões aparecem quando a freguesia reclama de alguma coisa e a Bia tem a ideia de investir nela.

## O que entrou
- **`LIBERA`** (`10-constantes.js`): Bia, Melhorias, Manutenção, Salão e Decoração, cada um com dia mínimo, garantia (`ate`), reclamações do Gurugol e a conversa (Bia e Tonhão). `liberaOf`, `BIA_IDS` (veio da lojinha) e `upgradeCartao`.
- **`save.libera[id]`** (`normSave` + `normLibera`): `0` fechado, `'pend'`, `1` aberto com selo "novo", `2` aberto e visto. Save novo na História: tudo `0`; save que já existia sem `libera`: tudo `2`.
- **Gatilho no fim do dia** (`finishDay`): do dia mínimo em diante, o cartão fica `'pend'` quando a reclamação ligada a ele acontece (Bia: grupo bravo na mesa ou 3+ avaliações com agilidade ≤ 3; Melhorias: lixeira cheia ou 3+ com espera ≤ 3; Manutenção: pior equipamento abaixo de `MANUT.verde`; Salão: desistência sem mesa ou `lotadoT` ≥ 90; Decoração: 3+ com ambiente ≤ 2,5) ou, se não vier, no dia da garantia. A reclamação entra no topo dos comentários do resultado (no máximo 3) e no Gurugol. Novas estatísticas do dia: `stats.bravoMesa`, `stats.lixoCheio`.
- **`cartaoAberto(id)`**: tudo aberto fora da História, no modo dev, com `histV` ausente e do cap. 4 em diante. `buy`, `buyMesa`, `buyToalha(s)`, `buyDecor` e `revisar` recusam cartão fechado (o conserto de emergência na plaquinha continua valendo).
- **Fluxo** (`fluxoHistoria`): depois das conversas de capítulo, a ordem é Manutenção pendente (`primeiro`), Cardápio, Divulgação e as outras de `LIBERA`, uma por fim de dia. Ao terminar: `libera = 1` e a lojinha abre no **grupo** do cartão (`shopEntraG`), onde o cartão aparece com o selo.
- **Lojinha:** cartões fechados nem aparecem (`shopSecoesVis`); cartão novo ganha a classe `novo` e o `aria-label` "Nome: novo na lojinha", e o grupo também (quando outro está aberto). Tocar tira o selo (`liberaVer`). `shopAbrir` num cartão fechado abre só o grupo.
- **Como jogar:** uma dica nova sobre a lojinha que abre aos poucos. Painel Versões e selo: v9.0.4.

## Testes
- `smoke41` (34 checks, novo): dados e `normSave`, a 1ª lojinha, gatilhos e garantias, conversa e selo, Manutenção primeiro, tudo aberto fora da História, no cap. 4 e no modo dev.
- `carreira.js` fecha os `'pend'` dos cartões entre os dias. `node carreira.js 20`: cap. 3 no dia 14 (7/20) e mudança no dia 14 (3/20), com o cap. 4 ainda não alcançado; na v9.0.3: cap. 3 no dia 13 (9/20), cap. 4 no dia 14 (1/20), mudança no dia 13 (5/20). O bot compra menos no começo (cartões fechados): a sessão b compara ordens e ajusta.
- `run_all.sh`: tudo verde. `menu_fit.py` e as capturas (`shot_v9_0_4.py`) não rodaram: faltam o `playwright` do Python neste ambiente.

## Conferência da ordem de liberação (sessão 2c-r7b, 31/10) — nenhuma ordem passou
`carreira.js` ganhou `LIBERA=0`, `LIBERA_ORDEM`, `LIBERA_CFG` e a linha `LIBERA` (e a fila de uma conversa por fim de dia, como o `fluxoHistoria`). `node carreira.js 40`, Modo História, bot padrão (`MANUT=sem`; o critério da Manutenção, com `MANUT=com`).

| Ordem | Dia médio em que abre (bia/mel/manut/salão/decor) | Cap. 3 até o dia 14 | Lucro acum. 14 dias | Dias no negativo | Manut. antes da barra vermelha | Todos abertos até o dia 9 |
|---|---|---|---|---|---|---|
| base (`LIBERA=0`) | tudo aberto | 12/40 | R$ 4398 (100%) | 0 | 40/40 | 40/40 |
| A bia, melhorias, manut, salão, decor | 7,8 · 8,9 · 6,0 · 9,9 · 11,0 | 9/40 | R$ 4350 (99%) | 0 | 40/40 | 0/40 |
| B bia, salão, melhorias, manut, decor | 7,7 · 7,1 (manut) · 8,9 (salão) · 9,9 · 10,9 | 9/40 | R$ 4377 (99,5%) | 0 | 40/40 | 0/40 |
| C decor, bia, melhorias, manut, salão | 7,8 · 8,9 · 9,9 · 7,0 · 11,0 | 12/40 | R$ 4289 (97,5%) | 0 | 40/40 | 0/40 |

Cartões à vista por dia (1 a 10), ordem A: 0 0 0 0 0 0,9 1,1 2,1 3,1 4,0. Com o `ate` menor em 1 (passo 4 do plano), o resultado é o mesmo (os cartões já ficam pendentes cedo): o gargalo não são os gatilhos.

**Causa:** a fila de uma conversa por fim de dia. Os fins dos dias 1 a 3 são das conversas de capítulo; o Cardápio toca no dia 4, a Manutenção no 5, a Divulgação (que devia tocar no dia 3) no 6; só então a Bia (dia 7, lojinha do 8) e os outros, um por dia. Pendentes juntos: até 4 (5 com `ate` menor). O critério "todos abertos até o dia 9" é impossível com essa fila: o último cartão abre na lojinha do dia 11.
