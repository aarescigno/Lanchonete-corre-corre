# v10.5.3 — A vontade da freguesia: doce e espresso puxam a Dani e o Joca (etapa V)

**Situação:** aprovada
**Origem:** pedido do usuário em 12/11 ("Precisa de garantia para Cami e Joca, e a garantia deve ser uma necessidade dos clientes, coisas que pedem bastante que faça com que os cursos sejam feitos e desencadeiem as histórias"), registrado no `docs/PROPOSTAS.md`; decisões fechadas com o usuário na mesma conversa.

## Objetivo
Hoje o Joca só chega se o jogador fizer o curso de Confeitaria caseira da Dani, e a Cami só se ele fizer o Barista: espresso do Joca; quem não compra nunca vê os dois nem as histórias deles. A partir desta versão, a freguesia **quer** doce (área industrial) e espresso (Avenida) antes de a casa ter: a mesa mostra a vontade, a nota cai um pouco, a vontade cresce dia a dia e, se o curso não sai, a equipe conversa sobre isso no fim do dia, até o jogador comprar.

## Fora do escopo
- Curso de graça ou mais barato como garantia (o usuário escolheu a conversa).
- Vontade de drink (Anselmo) e de alta gastronomia (Lia): já têm gatilho próprio no `LIBERA`.
- Mudar o `LIBERA` do Joca e da Cami: o gatilho continua sendo o curso feito.

## Regras (decisões tomadas)
- **Quando há vontade (só no modo carreira, nunca no entregador `retira`, com ou sem Modo História):**
  - **Doce:** sem `up.confCaseira`, no ponto de `nivel >= 2`, a partir do **4º dia na área industrial** (`diaNoPonto >= 4`, o mesmo dia em que abre o cartão da Confeitaria); nos pontos de nível 3 e 4, desde o 1º dia.
  - **Espresso:** sem `up.espresso`, no ponto de `nivel >= 3`, a partir do **3º dia na Avenida** (`diaNoPonto >= 3`); no Terraço, desde o 1º dia.
  - Constante nova em `src/10-constantes.js`: `const VONTADE = { doce:{ nivel:2, dia:4 }, cafe:{ nivel:3, dia:3 }, cresce:0.25, max:2, menos:0.5, coment:0.4, balao:4, conversa:3, repete:3 };`
- **Quanto pedem:** a chance de um grupo ter vontade é a mesma de pedir com o curso feito (`DOCES.pede[tipo] + VIP DOCES.vip`; `CAFES.pede[tipo] + VIP CAFES.vip`) vezes o fator `min(VONTADE.max, 1 + VONTADE.cresce × (diasVontade − 1))`, em que `diasVontade` é o nº do dia de vontade no ponto (1º dia de vontade = 1; nos pontos onde vale desde o 1º dia, conta pelo `diaNoPonto`). Ou seja: +25% por dia, até o dobro (chance final limitada a 1). Função nova `vontadeChance(g, qual, tipo, vip)` em `src/12-clientes.js`; o grupo guarda `grp.vontade = { doce:bool, cafe:bool }`, sorteado ao sentar, junto com `sorteiaDoces`/`sorteiaCafes`. Na refeição completa do Terraço (`tempos`), o doce já é tratado por `TEMPOS.semSobremesa`: lá não há vontade de doce (só de espresso).
- **O balão:** quando o grupo começa a comer (`esperaSuco`, o mesmo momento do balão do doce e do café), mostra por `VONTADE.balao` = 4 s o ícone do doce (`doceIcone(up)` caseiro) ou da xícara de espresso **apagado** (cinza, 50% de opacidade) no lugar do balão normal; não dá para atender e não se clica. Com doce e espresso, um depois do outro (2 s cada). Com `prefers-reduced-motion`, sem pulsar. Desenho na mesma função que desenha `doceBalao`/`cafeEspBalao` (`src/22-salao-hud.js`).
- **A nota:** o grupo com vontade não atendida perde `VONTADE.menos` = 0,5 no critério Cardápio (`s[3]`) da avaliação do Gurugol (0,5 por vontade: doce e espresso somam 1,0), em `Game` na conta da nota (`src/16-jogo.js`, ao lado do `menos` dos `tempos`). Gorjeta e conta não mudam.
- **O comentário:** com chance `VONTADE.coment` = 0,4, se o grupo não saiu bravo, o texto vira um destes (sorteado): doce `'Pedi sobremesa e não tinha!'`, `'Queria um docinho depois do almoço...'`; espresso `'Nem um espresso pra fechar o almoço?'`, `'Só tem cafezinho de garrafa?'`. Fica depois das linhas dos doces/cafés/drinks e antes da do fiscal.
- **A conversa (a garantia, só no Modo História):** no fim do **3º dia de vontade** (`VONTADE.conversa`) sem o curso, a conversa abaixo; se o curso continuar sem compra, a cada **3 dias** depois (`VONTADE.repete`) volta só a fala curta. Para quando o curso é feito. Constantes `HIST_VONTADE_DOCE` e `HIST_VONTADE_CAFE` em `src/10-constantes.js` (formato das outras `HIST_*`: `falas` e `curta`), entram na fila do `fluxoHistoria` (`src/43-telas.js`) como a `HIST_PLANTA`.
  - Doce: Bia "Tio, hoje de novo: um monte de mesa pediu sobremesa." · Dani "As famílias saem daqui e vão comer doce na padaria da esquina." · Tonhão "Freguês que vai comer doce em outro lugar um dia não volta." · Dani "Com o curso de confeitaria, eu resolvo isso!" · Bia "Tá no Cardápio da lojinha." — curta: Dani "Pediram sobremesa de novo hoje, Bia..."
  - Espresso: Bia "Os executivos pedem um espresso depois do almoço, e a gente só tem o cafezinho." · Joca "No café da esquina tem fila pra cappuccino!" · Tonhão "Avenida é assim: o povo quer café de máquina." · Joca "Com o curso de barista, eu tiro o melhor espresso da Avenida." · Bia "Tá no Cardápio da lojinha." — curta: Joca "Mais gente pedindo espresso hoje..."
  - Quem fala precisa estar contratado: se a Dani (ou o Joca) não estiver em `save.equipe`, a fala dela/dele vai para o Tonhão, com o mesmo texto.
- **Modo dev:** na aba Hoje, linha `Vontade: Normal | Todos pedem` (Todos pedem: chance 1 de doce e de espresso, sem olhar ponto, dia nem curso feito, se o curso não estiver feito); em **Assistir**, os itens "A vontade de doce" e "A vontade de espresso" (as falas completas).
- **Manual:** a ficha da Dani e a do Joca ganham uma frase cada, sem números: Dani "A freguesia da área industrial sente falta de sobremesa." · Joca "Na Avenida, a freguesia quer café de máquina."
- **Save:** `save.vontDoce` e `save.vontCafe`: 0 (nunca), `'pend'`, ou o dia da carreira em que a conversa (ou a curta) foi vista; `normSave` aceita só 0, `'pend'` ou inteiro ≥ 1; saves antigos começam em 0. Os dias de vontade não se guardam: saem do `diaNoPonto`.

## Critérios de aceite
- **CA1** Na área industrial, sem o curso, no 3º dia no ponto nenhum grupo tem vontade de doce; no 4º, com o modo dev "Normal", a chance de uma família é 0,5; no 7º, 0,875; no 9º, 1 (limite) → `smoke70` (1–3)
- **CA2** Com o curso de Confeitaria caseira feito, nenhum grupo tem vontade de doce → `smoke70` (4)
- **CA3** Na Avenida, sem o espresso, no 2º dia não há vontade de espresso e no 3º a chance de negócios é 0,6 → `smoke70` (5)
- **CA4** O grupo com vontade de doce não atendida tem `s[3]` 0,5 menor que um igual sem vontade; com doce e espresso, 1,0 menor → `smoke70` (6)
- **CA5** O entregador (`retira`) e o grupo da refeição completa (`tempos`) nunca têm vontade de doce → `smoke70` (7)
- **CA6** No Modo História, sem o curso, `save.vontDoce` fica `'pend'` no fim do 6º dia na área industrial (3º de vontade), não antes; depois de vista, volta a `'pend'` no fim do 9º; com o curso feito, não volta → `smoke70` (8–10)
- **CA7** O mesmo para o espresso: `'pend'` no fim do 5º dia na Avenida → `smoke70` (11)
- **CA8** Sem a Dani contratada, as falas dela na conversa saem com `q:'tonhao'` → `smoke70` (12)
- **CA9** Modo dev "Todos pedem" dá vontade de doce e espresso a todo grupo que senta; "Assistir" tem os 2 itens novos → `smoke70` (13–14)
- **CA10** Save antigo sem os campos carrega com `vontDoce` e `vontCafe` 0 → `smoke70` (15)
- **CA11** `node balance.js 40` e `PONTO=industrial node balance.js 40`: as metas continuam nos alvos do `docs/TESTES.md`; se a área industrial sem equipe cair mais de 3 pontos, baixe `VONTADE.menos` para 0,3
- **CA12** Captura `shot_v10_5_3.js`: uma mesa da área industrial com o balão apagado do doce, e a conversa do doce aberta (recortes ampliados; conferir e apagar)

## Partes
- `src/10-constantes.js`: `VONTADE`, `HIST_VONTADE_DOCE`, `HIST_VONTADE_CAFE`, frases do `MANUAL` (Dani e Joca)
- `src/12-clientes.js`: `vontadeChance`, sorteio em `Group` (junto de `sorteiaDoces`/`sorteiaCafes`), getter `vontadeBalao`; `normSave` (`vontDoce`, `vontCafe`)
- `src/16-jogo.js`: nota do Gurugol (`s[3]` e comentário) e o fim do dia (marcar `'pend'`, junto das outras `conv*`); dev `devSync`/estado "Todos pedem"
- `src/22-salao-hud.js`: o balão apagado
- `src/40-interface.js` (`buildDev`: linha Vontade) e `src/43-telas.js` (`fluxoHistoria`, `devCenas`/Assistir, `window.__lcc`: `VONTADE`, `vontadeChance`, `HIST_VONTADE_DOCE`, `HIST_VONTADE_CAFE`)

## Tarefas
- [ ] T1 `tests/smoke70.js` com CA1 a CA10 (falhando).
- [ ] T2 `VONTADE`, `vontadeChance` e o sorteio no grupo; save (`vontDoce`, `vontCafe`).
- [ ] T3 Nota (`s[3]`) e comentários no Gurugol.
- [ ] T4 O balão apagado no salão.
- [ ] T5 As conversas e a repetição no fim do dia; fala do Tonhão sem a Dani/o Joca.
- [ ] T6 Modo dev (Vontade, Assistir) e Manual.
- [ ] T7 `balance.js` (CA11) e captura (CA12).
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O balão do doce e do espresso já existe (`doceBalao`, `cafeEspBalao`): reaproveite o desenho, só com cinza e opacidade.
- `diaNoPonto(sv, n)` já dá o dia no ponto; os dias de vontade são `diaNoPonto − VONTADE.x.dia + 1` no ponto do nível de início, e `diaNoPonto` nos pontos acima.
- O `harness.js` desliga a História: para CA6 a CA8, `load({historia:true})`, como no `smoke34`.

## Testes
- Novo: `smoke70` (15 checagens). `balance.js` e `PONTO=industrial` para CA11; `node carreira.js` para ver se o Joca e a Cami chegam mais cedo (linha `HISTORIA`).
- Captura: `shot_v10_5_3.js` (conferir e apagar).

## Decisões em aberto
Nenhuma.

## Desvios
(no fechamento)

**Modelo:** Sonnet, esforço médio (código de jogo com plano detalhado em várias partes, sem decisão de design)
