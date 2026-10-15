# Resumo do projeto e das alterações (até 15/10/2026)

## Estado atual
- **Versão:** v7.1 (Jogo justo: a fila sem mesa espera com calma e não passa de 1 coração; a porta segura chegadas com o salão lotado), publicada no artifact https://claude.ai/artifact/MJxrgDg8S4akvg47SoQAvj (privado).
- **Branch:** `claude/main` (renomeado pelo usuário; o antigo `claude/intelligent-gauss-3owv29` não existe mais) no repositório `aarescigno/Lanchonete-corre-corre`.
- **Arquivos publicados:** `lanchonete.html` (página), mais `versoes/v1.html` a `versoes/v7.html`, abertos pelo painel Versões.
- **Capacidades declaradas (mantidas ao republicar sem `capabilities`):**
  - `db`: `ranking-carreira` e `ranking-semfim` com read "view" e write "owner";
  - `db`: `ranking-*/{self}` com write "interact";
  - `user`.
- **Ranking:**
  - documentos `ranking-carreira/<userId>` e `ranking-semfim/<userId>`, com `nome`, `pontos`, `dia` ou `tempo` e `quando`;
  - só sobrescreve quando a pontuação é maior;
  - fallback local em `localStorage` (`lcc2_ranking`).
- **Save:** `lcc2_save`, que importa o `lcc_save_v1` da v1. Desde a v6 guarda também o salão (`save.salao`); desde a v7, a divulgação (`save.divulga`). `save.best` continua guardando o melhor faturamento de cada dia (é o que o ranking da carreira soma).

## Versões
| Versão | Data | O que trouxe | Detalhes |
|---|---|---|---|
| v1 | 13/10 | carreira de 7 dias, fila de ações, mãos, corrente, bônus de cor, lojinha com 5 upgrades, som | `docs/spec-v1.md` |
| v2 | 14/10 | comandas coloridas, aro de humor, "Lotado!", Turno sem fim, ranking compartilhado, painel Versões | `docs/spec-v2.md` |
| v3 | 14/10 | clientes VIP | `docs/spec-v3.md` |
| v4 | 14/10 | balcão de sucos, bandeja, comandas empilhadas, lixeira | `docs/spec-v4.md` |
| v5 | 14/10 | equipe (Tonhão, Dani, couvert), louça limitada, lixeira que enche, água saborizada, renda de 30% | `docs/spec-v5.md` |
| v6 | 14/10 | aba Salão: cadeiras e mesas (até 8) compradas, 2 ou 4 lugares por mesa | `docs/spec-v6.md` |
| v7 | 15/10 | Contas: meta em lucro, ingredientes, contas do dia pelo salão aberto, divulgação (boca a boca, panfletos, redes sociais) | `docs/spec-v7.md` |
| v7.1 | 15/10 | Jogo justo: fila justa (ritmo 40% e piso de 1 coração sem mesa que sirva), porta que respeita a lotação, ícone "aguardando mesa", bot afiado e perdas por causa | `docs/spec-v7.1.md` |

## Alterações feitas no Claude Code (14/10/2026)
1. **Importação** do pacote exportado do claude.ai para o repositório (commit `982583b`).
2. **v3, clientes VIP** (`3d93bdb`):
   - aparecem a partir do dia 5 e no Turno sem fim (depois de 1 min);
   - furam a fila e têm paciência ×0,75;
   - gorjeta +50% e bônus de R$ 40 com 5♥; bravos, multa dobrada;
   - óculos escuros e plaquinha "★VIP".
3. **Teste instável do smoke2 corrigido** (`ce4fb87`, PR #1): um grupo esquecido na fila saía bravo durante a cobrança.
4. **Menu:**
   - "Versões anteriores" virou um ícone (relógio com seta) no canto inferior direito do painel do menu (`4d26956`, `97c3ab8`);
   - o menu deixou de rolar no celular deitado: `@media (max-height:460px)` com painel mais largo, título em 1 linha e 4 botões numa fileira (`3e522ae`, teste `tests/menu_fit.py`).
5. **v4, balcão de sucos e bandeja** (`6981e42`, `4741e81`):
   - **Balcão de sucos:** divide a bancada com o cafezinho. Do dia 3 em diante, ~30% dos grupos pedem de 1 copo até o número de pessoas. Cada copo vale R$ 12 e cada entrega devolve 1♥. Conta paga sem o suco: −1♥.
   - **Mãos:** comandas só na mão sem bandeja, todas juntas, até `kitchen.slots` (3). Fora isso, 1 item por mão.
   - **Bandeja (R$ 220):** 1 prato + 1 bebida, 2 pratos, 3 bebidas ou 2 pilhas de louça (ou menos). Sujo nunca junto com limpo; a outra mão pode levar louça suja.
   - **Metas:** iguais às da v3 (o bot bate a meta em 92 a 97% das vezes nos dias 4 a 7).
   - "Como jogar" em duas colunas.
6. **Lixeira** (pedido em comentário no artifact): no chão, ao lado do balcão; a Bia joga fora as bebidas que sobraram, com multa de metade do valor de cada uma (suco R$ 6, cafezinho R$ 2,50). Detalhes em `docs/spec-v4.md`.
7. **Lojinha antes de cada dia**: do dia 2 em diante, escolher o dia (ou repetir) abre a lojinha primeiro, com "Começar o dia N" e "Menu principal"; ainda 1 melhoria por dia. O fim do dia oferece "Melhorias e dia N+1" e "Menu principal".

8. **v5, Equipe** (ver `docs/spec-v5.md`):
   - **Economia (sem "cofre"):** todo o faturamento vai para o dinheiro acumulado; a folha é debitada dele no início do dia.
   - **Lojinha** com abas Melhorias e Equipe.
   - **Tonhão:** aumento de 3 para 4 e 5 bocas, com +R$ 40 e +R$ 90 por dia.
   - **Dani, a ajudante (sem robôs):** níveis com 50%, 65% e 80% da velocidade da Bia e 2, 2 e 3 tarefas, por R$ 60, R$ 90 e R$ 135 por dia. Tarefas escolhidas na lojinha: lixo, pratos sujos, lavar louça e cafezinho.
   - **Louça:** limitada a partir do dia 3; lavar leva 1,5 s por pilha; sem prato limpo, o Tonhão espera.
   - **Lixeira:** enche (8 itens); cheia, o cheiro acelera a impaciência; esvaziar leva 2 s. Se as bebidas da Bia não cabem, a lixeira aceita todas uma última vez e ela esvazia em seguida.
   - **Dani lava** no mesmo ritmo do deslocamento (50%, 65% ou 80% da Bia).
   - **Couvert artístico:** R$ 80 por dia, paciência nas mesas −20%; com a taxa de R$ 3 por pessoa, −18%.
   - **Água saborizada:** substitui a Jukebox.
   - **Sem equipe é quase impossível:** mais grupos nos dias 3 a 7, 3 pratos limpos, lavar 2,5 s por pilha e lixeira de 6. Metas dos dias 3 a 7: R$ 1300, 1300, 1440, 1440 e 1500. Sem equipe, ~5% das metas nos dias 4 a 7; com equipe, ~80% a 90%.
   - **Lixeira:** a Bia só esvazia com as mãos vazias (ou só com bebidas, na última leva).
   - **Água saborizada com doses:** jarra de 12 doses, 1 por pessoa na fila; recarregar custa R$ 15 (1 a 2 vezes por dia).
   - **Dani lava sem limite de pilhas:** 1 pilha por vez, só o tempo conta.
   - **Revisão das melhorias** (análise com o bot, em `docs/spec-v5.md`): água com efeito de 40% e recarga pela Dani; Tonhão sem bocas a mais, com aumento que cozinha mais rápido, faz prato caprichado ★ e lava 1 pilha a cada 7 s ou 4 s; VIP pede prato especial; Chapa nova virou Jogo de pratos (+1 prato limpo); ventilador tira o cheiro da lixeira; taxa do couvert corta o efeito pela metade. Metas dos dias 3 a 7: R$ 1400, 1300, 1480, 1500 e 1650.
   - **Lojinha no celular em pé:** as tarefas da Dani invadiam o card do couvert; com a tela até 600 px de largura (e mais de 460 px de altura), elas ficam em 1 coluna e o botão "Cobrar couvert" fica menos arredondado.
   - **Lojinha, aba Equipe:** a tarefa Água só aparece (e só ocupa vaga) com a Água saborizada comprada; antes de contratar a Dani, o card lista o que ela pode fazer, sem os botões de tarefa. Tonhão e Dani mostram um quadro "agora → próximo nível" (rapidez, ★, pia e diária do Tonhão; velocidade, tempo por pilha, tarefas e diária da Dani) e, no nível máximo, os valores atuais. Os botões viraram "Aumento", "Contratar" e "Promover", porque o preço está no quadro.
   - **Dani tem 2 mãos:** no máximo 2 itens por vez (`DANI_HANDS`); cada pilha de louça (a de uma mesa) ocupa 1 mão, como na Bia. O card de contratação diz isso, e o `smoke6` confere com o bot jogando dias inteiros.
   - **Toque no celular:** no celular deitado o salão fica em ~0,55 a 0,65 da escala, e a lixeira, a jarra de água, cada prato pronto e os ícones da fila tinham de 26 a 30 px na tela (o mínimo confortável para o dedo é ~44 px).
     - No dedo (não no mouse), um toque que cai fora de tudo vai para o alvo mais próximo a até ~14 px de tela (`touchPad` → `Game.pickAt`). O acerto exato vence a folga, então café e suco continuam separados.
     - Um tremido de até ~14 px ao tocar um grupo da fila seleciona em vez de virar arrasto, e um arrasto solto rente à mesa senta o grupo.
     - Pratos: vale a coluna inteira do balcão; numa coluna vazia, vale o prato pronto mais perto.
     - Ícones da fila e os botões de pausa e de som pegam a faixa toda, até a borda de baixo.
     - **Sinal do toque:** cada ação aceita faz o som de toque e um brilho só no desenho do objeto tocado (estação, mesa, prato, grupo da fila ou botão), sem halo em volta, que some em 0,4 s (`glowSprite`: o objeto vai para uma camada à parte e uma cópia é somada por cima com `lighter`). Um toque no vazio mostra só um anel fraco no ponto. O `smoke7` confere tudo isso.
   - **Pia em 2 etapas:** com louça na mão, a Bia só deixa a louça na pia; tocando de novo, sem louça na mão, ela lava. Só 1 pessoa lava por vez (a Bia ou a Dani); o Tonhão lava à parte. O bot dá os 2 toques e não manda lavar enquanto a Dani lava; o equilíbrio não mudou (`balance` sem equipe e com a Dani lavando).

9. **v6, Salão** (ver `docs/spec-v6.md`), a pedido do usuário (só 1 mesa de 4 lugares e várias famílias de 4 esperando):
   - aba Salão na lojinha, com a planta das 2 fileiras e os botões 2 e 4 em cada mesa;
   - 2 cadeiras por R$ 60 (até 24) e mesa nova por R$ 300 (a 7 em cima, a 8 embaixo, abertas todo dia);
   - numa fileira com 4 mesas, só 1 cabe com 4 lugares;
   - não conta no limite de 1 melhoria por dia;
   - teste `smoke8`.
   - **Estrelas:** a 2ª estrela vem na metade do caminho entre a meta e a expert (`bomGoal`). Antes quase nunca saía, porque quem batia a expert levava 3. A 3ª continua sendo a expert sem perder ninguém.
   - A pergunta-lembrete a cada alteração saiu do `CLAUDE.md`, a pedido do usuário.
   - **Dani e o cafezinho** (15/10, a pedido do usuário): ela serve café a quem perdeu pelo menos 1 coração (≤4, antes ≤3) e, com 1 pilha de louça na mão, pega o café no caminho da pia, deixa a louça (sem lavar) e vai servir. Assim usa as 2 mãos 4 a 5 vezes a cada 10 dias (antes ~1), e o teste "a Dani chega a 2 itens" do `smoke6` deixou de oscilar. O equilíbrio não mudou (`balance` com a Dani nível 3 em pratos, lavar e cafezinho: 304/400 → 307/400 metas nos dias 3 a 7).

10. **v7, Contas** (ver `docs/spec-v7.md`), a partir do retorno do Renan Martorelli ("no dia 5 tenho dinheiro de sobra pra fazer tudo"):
   - **Meta em lucro:** faturamento − ingredientes − contas − folha − divulgação. O dia começa no vermelho no HUD.
   - **Ingredientes:** 60% da conta de cada prato quando fica pronto; R$ 5 por suco entregue.
   - **Contas do dia:** aluguel R$ 120 + R$ 30 por mesa aberta + R$ 6 por lugar.
   - **Divulgação** (aba nova na lojinha, do dia 3 em diante): boca a boca (grátis, 60–90% dos grupos), panfletos (R$ 40, 100%), redes sociais (R$ 100, 120% e mais VIPs).
   - **Menos grupos na base** nos dias 3 a 7 (13, 15, 16, 16, 17), porque o gargalo é atender e mais gente só trazia multas; metas recalibradas pelo lucro.
   - Bot na carreira: dinheiro antes do dia 5 caiu de R$ 3.410 (v6) para R$ 1.319. Testes `smoke9` e `carreira.js`.
   - Ficaram para depois: escolher o ponto (bairro, centro, área nobre) e o modo história.

11. **v7.1, Jogo justo** (ver `docs/spec-v7.1.md`; etapa 1a do `docs/PLANO.md`), a partir do áudio do Renan ("o jogo parece injusto"):
   - **Medição:** `balance.js` mostra as perdas por causa. Com a equipe, a maior parte não era a fila, e sim a espera pelo prato (louça em uso e prioridade do bot); na fila, eram famílias sem mesa de 4.
   - **Bot afiado** (`BOT=afiado`): uma ação por vez, a mais urgente; senta qualquer grupo da fila, serve cafezinho e lava quando faltam pratos.
   - **Fila justa:** sem mesa que sirva (mesa suja conta como mesa que serve), a paciência na fila corre a 40% e, na carreira, para em 1 coração com meia paciência. No Turno sem fim vale o ritmo, sem o piso (decisão do usuário).
   - **Porta:** com todas as mesas ocupadas e 3+ grupos na fila, a chegada espera até 8 s (até 20% do dia no total); o total de grupos não muda.
   - **Ícone "aguardando mesa"** na fila (mesa e relógio; azul e parado no piso).
   - Resultado: bot afiado com equipe e Jogo de pratos comprado primeiro, 0 perdidos em 94% dos dias 3 a 7. Metas e escassez sem mudança (dentro do ruído). Teste `smoke10`.

## Código em partes (`src/`)
- Desde 15/10/2026 o código fica em 19 partes em `src/` (lista no `CLAUDE.md`), juntadas por `montar.py` em `lanchonete.html` sem acrescentar nada: o arquivo montado é idêntico, byte a byte, ao anterior à divisão.
- `lanchonete.html` continua no git (artifact, `app/build.py`, testes e capturas usam ele). `montar.py --check` confere que ele está em dia (o workflow do Pages roda isso); `montar.py` recusa sobrescrever um `lanchonete.html` editado à mão depois das partes (`--forcar` passa por cima).
- `tests/run_all.sh` monta antes de testar; `tests/mapa.sh` indexa as partes (arquivo:linha).
- Branches: todo trabalho termina com merge no `claude/main` e o branch apagado (pedido do usuário).

## App para Android (PWA)
- **Menu principal:** o ícone de celular com seta (ao lado do de Versões) abre o painel `#ov-app`, "Instalar no celular", com o endereço do Pages, um botão "Copiar endereço" e o passo a passo para Android (Chrome → ⋮ → Instalar app) e iPhone/iPad (Safari → Compartilhar → Adicionar à Tela de Início). Cabe sem rolar do 1366×768 ao 568×320 deitado. No app já instalado (tela cheia/standalone), o ícone some.
- `app/build.py` monta `app/site/` (ignorado no git) a partir de `lanchonete.html`, sem mudar o jogo: `index.html` com invólucro, `manifest.webmanifest` (tela cheia, horizontal), ícones próprios (hambúrguer), `sw.js` (offline; fontes do Google em cache) e as `versoes/vN.html`.
- `.github/workflows/app.yml` publica `app/site` no GitHub Pages a cada push no branch padrão que mexa no jogo (ou manualmente). Requer Settings → Pages → Source: GitHub Actions.
- No app o ranking compartilhado não existe (não há `window.claude`); fica o ranking local do aparelho.
- No Android: abrir o endereço do Pages no Chrome → menu ⋮ → "Instalar app".

## Testes (verdes no último commit)
- `smoke` (bot nos 7 dias);
- `smoke2` (mecânicas);
- `smoke3` (120/120: v2);
- `smoke4` (23/23: VIP);
- `smoke5` (41/41: sucos, bandeja e lixeira);
- `smoke6` (94/94: equipe, louça, lixeira que enche, couvert, água, economia). O teste "a Dani chega a 2 itens" oscilava (dependia do sorteio do dia) até a Dani pegar o café no caminho da pia; hoje falha em menos de ~1 a cada 40 rodadas;
- `smoke7` (15/15: toque no celular e brilho);
- `smoke8` (33/33: salão, cadeiras e mesas, e as faixas de estrelas);
- `smoke9` (33/33: v7, lucro, ingredientes, contas e divulgação);
- `smoke10` (26/26: v7.1, fila justa, piso, porta e perdas por causa);
- `menu_fit` (14 tamanhos de tela);
- `balance` (bot, N rodadas por dia; `DIV`, `MULT`, `SALAO`, `BOT=afiado`, `ORDEM`; perdas por causa e 3★);
- `carreira` (bot jogando a carreira com o dinheiro acumulado de verdade).

## Ideias pendentes
- Testar som e toque em celular real (o toque foi ajustado depois de relato de dificuldade, mas só testado no Chromium com toque emulado).
- Salão: os preços (R$ 60 por 2 cadeiras, R$ 300 por mesa) e o limite de 1 mesa de 4 lugares por fileira de 4 mesas ainda não foram testados com jogadores; ajustar em `SALAO`.
- Estrelas: conferir com jogadores se a 2ª estrela (`bomGoal`, metade do caminho entre a meta e a expert) ficou no ponto.
- O painel "Como jogar" ainda rola no celular deitado.
- Ajuste de dificuldade.
- v7: conferir com jogadores se a escassez ficou no ponto (valores em `CONTAS`, `INGRED`, `DIVULGA` e nas metas).
- v7.1: conferir com jogadores se a fila justa (`FILA_JUSTA`) e a porta (`PORTA`) ficaram no ponto, e se o ícone "aguardando mesa" se entende.
- **Roteiro das próximas versões em `docs/PLANO.md`** (uma etapa por sessão; log das ideias e retornos em `docs/PROPOSTAS.md`): jogo justo (feito na v7.1), livro-caixa, manutenção e imprevistos, ponto (Centro, área nobre com VIPs exigentes), modo história em 2 partes e polimento.
- A lojinha ainda rola no menor celular deitado (568×320).
