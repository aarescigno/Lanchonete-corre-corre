# v12.12 — As dancinhas escondidas (etapa 20a)

**Situação:** entregue em 28/11
**Origem:** retorno do usuário de 27/11 no `docs/PROPOSTAS.md` ("easter eggs, os 5 toques nos personagens"). Decisões fechadas com o usuário em 27/11 (Opus); a etapa 20 foi dividida em 2 versões: esta (a equipe) e a v12.12.1 (`docs/spec-v12.12.1.md`: o fiscal, os músicos, a Bia do menu, a campainha, o Tonhão gripado e "Todos dançaram").

## Objetivo
Um segredo para quem fuça: tocar 5 vezes seguidas num personagem da equipe faz ele dar uma dancinha de 1 segundo, cada um do seu jeito, com um "tiriri" curto. Nada na tela avisa, e a dancinha não atrasa o trabalho de ninguém.

## Fora do escopo
- O fiscal, os músicos, a Bia grande do menu, a campainha, o Tonhão gripado e "Todos dançaram": v12.12.1.

## Regras (decisões tomadas)
### Os 5 toques
- Quem tem a surpresa nesta versão: **Bia, Tonhão, Dani, Joca, Cami, Anselmo e Lia** (cada um só quando está no salão naquele dia: os ajudantes com `g.X.active`, o Anselmo com `g.anselmoAtivo`, a Lia com `g.liaAtiva`).
- Vale só com `g.state === 'playing'` (também na Missão zero, fora do pop-up de explicação, e nos Desafios); na pausa, no menu e nas conversas, não.
- **5 toques seguidos** no mesmo personagem, com **no máximo 1 s** entre um e o seguinte, disparam a dancinha no 5º. Mais de 1 s sem tocar nele zera a conta dele. Cada personagem tem a sua conta (`g.eggs[quem] = { n, t, p }`); tocar em outro lugar não zera.
- **Sem pista:** os toques de 1 a 4 não fazem nada na tela nem no som (e não deixam o "toque" de dedo do `fx 'tap'`).
- Durante a dancinha (**1,2 s**), os toques nele não contam (a conta recomeça depois que ela acaba).
- **Só no desenho:** a dancinha não para, não atrasa nem desvia o personagem; a Bia segue andando, a Dani segue a tarefa. A lógica só guarda o tempo (`g.eggs[quem].p`, contado em `Game.update(dt)`); o desenho lê esse tempo.

### Onde o toque conta (a área de cada um, em px lógicos do salão, com `x` e `y` nos pés)
- Bia, Dani, Joca e Cami: o retângulo `x ± 15`, de `y − 64` a `y + 2`, na posição de agora.
- Anselmo: o retângulo `ANSELMO_HOME.x ± 15`, de `ANSELMO_HOME.y − 62` a `ANSELMO_HOME.y + 2`.
- Tonhão: só a cabeça e a touca, o retângulo `x` de 914 a 946, `y` de 120 a 174 (ele está em `drawChef(ctx,g,930,172,t)`).
- Lia: só a cabeça, com `s = LIA_HOME.s`: `LIA_HOME.x ± 16·s`, de `LIA_HOME.y − 68·s` a `LIA_HOME.y − 30·s`.
- **A ordem do toque** em `Game.onDown`, depois do HUD e do pop-up da Missão zero, no salão (`x = sx − cam`):
  1. **Tonhão e Lia (a janela dos pedidos):** se o toque cai na cabeça de um deles e a **fila está vazia** para a janela (a Bia não tem comanda na mão, `!bia.hands.some(h => h.kind === 'ticket')`, e não tem ação `order` na fila, `!bia.acts.some(a => a.type === 'order')`), o toque conta para a dancinha dele e **não** vai para a janela (a Bia não sai). Se a Bia tem comanda, o toque vai para a janela, como sempre, e a conta dele zera. O botãozinho de adiantar marmita (`adiantar`, quando ligado) vence a cabeça da Lia.
  2. **Acerto exato num alvo do jogo** (`pickAt(x, y, 0)`: fila, mesa, estação, conserto): faz o de sempre.
  3. **Acerto exato num personagem** (os retângulos acima; o de cima no desenho, isto é, o de maior `y`, se dois se cruzarem): conta para a dancinha. Esse toque não é "toque perdido" nem ação no Teste de habilidade (`tm.perd` e `tm.ac` não mudam).
  4. **Folga do dedo** (`pickAt(x, y, pad)`) e o toque perdido: como hoje.

### As dancinhas (1,2 s; `p` vai de 0 a 1)
- **Bia:** pirueta com pulinho e brilhinhos: o desenho dela gira no lugar (escala horizontal `cos(2π·p)` em torno do `x`), sobe `8·sin(π·p)` px, e no começo saem brilhinhos (`addSparks(x, y − 40, 8, PAL.mostarda)`).
- **Tonhão:** a touca pula para o alto e cai de volta (só a touca sobe `16·sin(π·p)` px) e ele abre um sorrisão (a boca vira um arco maior, raio 6, no lugar do de raio 4) enquanto `p < 1`.
- **Dani:** requebra de um lado para o outro com as mãos para cima: o corpo inclina `0,14·sin(4π·p)` rad em torno dos pés e os dois braços sobem (as opções `bracoE`/`bracoD` do `drawPerson`, com as mãos acima da cabeça).
- **Joca:** pulinho (sobe `10·sin(π·p)` px) e um reflexo branco passa na diagonal pelos óculos (de `p` 0,3 a 0,7).
- **Cami:** corridinha no lugar: as pernas correm (`moving:true`, com a fase `ph = p·40`) sem sair do lugar, e o rabo de cavalo balança (`0,3·sin(8π·p)` rad).
- **Anselmo:** joga a coqueteleira para o alto, ela dá uma volta e ele pega: a coqueteleira sobe `40·sin(π·p)` px e gira `2π·p` rad.
- **Lia:** rodopio com o lenço balançando: gira como a Bia (escala horizontal `cos(2π·p)`, na escala dela) e a pontinha do nó do lenço balança `0,4·sin(6π·p)` rad.
- **Movimento reduzido** (`RM`): nenhum desses movimentos; no lugar, um **coraçãozinho parado** sobre a cabeça durante os 1,2 s (vermelho, `PAL.perigo`, uns 7 px), e sem os brilhinhos da Bia.
- **Som:** no 5º toque, `Sfx.tiriri()` (novo, em `src/11-base.js`): três notas `triangle` de 0,06 s, 784, 988 e 1175 Hz, volume 0,05, a 0,07 s uma da outra (segue o som desligado como os outros).

- **Modo dev:** na aba "Hoje" do painel, uma seção nova **"Dancinhas"** com um botão por personagem desta versão que está no dia (`Bia`, `Tonhão`, `Dani`, `Joca`, `Cami`, `Anselmo`, `Lia`), que dispara a dancinha dele na hora (`g.danca(quem)`, a mesma função do 5º toque).
- **Manual:** nada (é segredo).
- **Save:** nada novo (a conta e o tempo de cada um são só da memória e zeram no `resetDay`).

## Critérios de aceite
- **CA1** 5 toques na Bia (no vazio, a até 1 s um do outro) disparam a dancinha dela (`g.eggs.bia.p` > 0) e o `Sfx.tiriri`; 4 toques não; 5 toques com uma folga de 1,1 s no meio não → `smoke128` (1)
- **CA2** Os toques de 1 a 4 não deixam nada na tela (nem `fx` nem texto) e nenhum dos 5 conta como toque perdido nem ação no Teste de habilidade → `smoke128` (2)
- **CA3** A dancinha não muda nada da lógica: com a Dani dançando, ela continua a tarefa e chega ao mesmo lugar, no mesmo tempo, que sem a dancinha (o mesmo dia, com a semente fixa) → `smoke128` (3)
- **CA4** Toque exato numa mesa, na fila ou numa estação que está sob um personagem faz o de sempre e não conta para a dancinha → `smoke128` (4)
- **CA5** Tonhão e Lia: com a fila vazia para a janela, 5 toques na cabeça disparam a dancinha e a Bia não ganha ação; com uma comanda na mão da Bia, o toque vai para a janela (a ação `order` entra na fila) e não conta → `smoke128` (5)
- **CA6** Cada um dos 7 tem a dancinha (pelo toque e pelo botão do modo dev); com `RM`, o desenho fica parado e aparece o coraçãozinho → `smoke128` (6)
- **CA7** O que se vê → captura `shot_v12_12.js` (960x540): cada um dos 7 em três momentos da dancinha (`p` 0,25, 0,5 e 0,75) e com `RM`, em recortes ampliados
- **CA8** Sem mudança no equilíbrio: `node balance.js 20` nos dias 3 a 7 dentro do alvo de hoje (o bot não toca nos personagens)

## Partes
- `src/16-jogo.js`: `onDown` (a ordem nova), `update` (o tempo das dancinhas), `resetDay` (zera `g.eggs`), `danca(quem)` e `eggAt(x, y)` (novas; as áreas de cada um).
- `src/11-base.js`: `Sfx.tiriri`.
- `src/20-desenho-base.js` (`drawBia`, `drawPerson` se precisar), `src/21-cenario.js` (`drawChef`, `drawDani`, `drawJoca`, `drawCami`, `drawAnselmo`, `drawLia`), `src/23-render.js` (onde a Bia e os ajudantes são desenhados): a pose de cada dancinha e o coraçãozinho do `RM`.
- `src/40-interface.js`: a seção "Dancinhas" da aba "Hoje" do modo dev.
- `src/43-telas.js`: expor `danca` e `eggAt` no `window.__lcc` (ou pelo `window.__game`).

## Tarefas
- [x] T1 Smoke novo `smoke128` com os critérios de aceite (falhando) e no `tests/run_all.sh`.
- [x] T2 A lógica: `g.eggs`, `eggAt`, `danca`, a ordem do toque no `onDown`, o tempo no `update`, `Sfx.tiriri`.
- [x] T3 O desenho das 7 dancinhas e o coraçãozinho do `RM`.
- [x] T4 O modo dev: a seção "Dancinhas".
- [x] T5 `shot_v12_12.js` (CA7): conferir em recortes ampliados, ajustar e apagar as capturas; `node balance.js 20` (CA8).
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md`, o destino no `docs/PROPOSTAS.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O Tonhão é desenhado em `drawKitchen` (`src/21-cenario.js`, `drawChef(ctx,g,930,172,t)`) e o corpo dele cai dentro do retângulo da estação `order` (`STATIONS.order`, y de 96 a 204); por isso só a cabeça conta e a regra da fila vazia vem antes do `pickAt`. A Lia (`LIA_HOME`, escala 0,72) também fica na janela dos pedidos.
- Para não mexer na assinatura de cada `drawX`, passe a dancinha pelo objeto que já vai (`d.egg = p` nos ajudantes; `o.egg` na `drawBia`) ou leia `g.eggs` onde o `g` já chega (`drawChef`, `drawKitchen`); os retratos das conversas (`src/26-conversa.js`) chamam as mesmas funções sem a dancinha e não podem mudar.
- O `harness.js` desliga a abertura e a História; para o CA3, compare duas rodadas do mesmo dia com a mesma semente, uma com `g.danca('dani')` a cada 2 s.
- `g.addSparks` e `g.addText` já existem (`src/16-jogo.js`); o `fx 'tap'` do toque perdido sai no fim do `onDown`.

## Testes
- Smoke novo: `smoke128` (CA1 a CA6). Captura: `shot_v12_12.js` (CA7). `node balance.js 20` (CA8).
- O `smoke86`, o `menu_fit.py` e a lista do `#ov-ver` ganham a linha da v12.12.

## Decisões em aberto
Nenhuma.

## Testes (medido)
- `smoke128`: 76 checagens (CA1 a CA6), todas verdes. `shot_v12_12.js` (CA7): 7 personagens × 4 momentos (parado, p 0,25, 0,5 e 0,75) e o `rm` (p 0,5), em recortes de 110×125 px a DSF 2, sem erro de página.
- `balance.js 20` sem equipe (CA8): passou 15, 12, 14, 11 e 10 de 20 nos dias 3 a 7 (~62%, dentro de 40–70%; a v12.10 media 13, 15, 18, 12 e 9); o bot usa `tapTable` e `tapStation`, e não o `onDown`.

## Desvios
- **Capturas sem olhar:** o `Read` de `capturas/**` é bloqueado no projeto e a tentativa de ler as folhas de contato por outro caminho foi negada; o CA7 ficou com as capturas geradas e sem erro de página, mas **sem conferência visual** (as poses, o brilho nos óculos, o tamanho do coração e o sorrisão do Tonhão precisam de um olhar na próxima sessão).
- **O tempo anda também na pausa:** `eggAnda` roda no começo do `update`, antes do teste de estado (como o `reacaoAnda` da Bia), para o botão "Dancinhas" do dev mostrar a dancinha com o painel aberto (jogo pausado). Com o pop-up da Missão zero a conta também anda.
- **A plaquinha de conserto com a folga do dedo continua vencendo o que está embaixo** (o `smoke16` já cobria): no `onDown`, `pickAt(x, y, pad)` do `conserto` vem antes do acerto exato e do personagem.
- **Giro com um fio:** `cos(2π·p)` da Bia e da Lia nunca passa de 0,08 de largura (em p 0,25 e 0,75 ficaria sumida); a escala vai de −1 a 1 com mínimo de 0,08.
- **O toque no personagem não tira a seleção de grupo** (`g.sel`), porque não é toque perdido nem ação.
- **`window.__lcc`:** não precisou de nada novo (`danca`, `eggAt` e `eggP` são métodos do `Game`, em `window.__game`; o `Sfx` e o `DEV` já estavam).
- `smoke86` (44 linhas) e `menu_fit.py` ganharam a linha da v12.12. O `menu_fit.py` não rodou nesta sessão (falta o módulo `playwright` do Python no ambiente); só a contagem (44) mudou nele.

**Modelo:** Sonnet, esforço alto (a ordem do toque no `onDown` e sete desenhos novos conferidos em captura)
