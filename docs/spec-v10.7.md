# v10.7 — Nível de luxo (etapa 4b)

**Situação:** entregue em 13/11
**Origem:** etapa 4b do `docs/PLANO.md`; pedido do usuário de 21/10 e preferências de 12/11 (`docs/PROPOSTAS.md`); decisões fechadas com o usuário na sessão de planejamento de 13/11.

## Objetivo
O jogador vê o restaurante ficar mais chique: o nível de luxo, de 0 a 5, sobe conforme ele enfeita, troca os móveis, liga o ambiente e muda para pontos melhores. Ele acompanha cinco barras, como atributos de um personagem. Mais luxo traz mais VIPs (e, na Avenida, alguns exigentes) e passa a ser a nota de Ambiente do Gurugol.

## Fora do escopo
- Os críticos surpresa: entram na barra Fama junto com o Michelzão (etapa 6).
- Mudar o efeito na paciência da TV, do som, do couvert, das TVs e da música (`ambienteEffect`): fica como está, só os cartões mudam de aba.
- Um desenho novo para o assento da espera e a louça fina: ficam onde estão (Melhorias) e só contam na barra Móveis.

## Regras (decisões tomadas)
- **Pontos de luxo** (`LUXO` em `10-constantes.js`; `luxoPts(game)` devolve `{ end, dec, mov, amb, fama, tot }`, inteiros; `tot` de 0 a 100). **Nível** = `Math.min(5, Math.floor(tot / 20))`. O luxo é calculado na hora, não vai no save.
- **Endereço** (máx. 40): Garagem 0, área industrial 10, Avenida 20, Terraço 40 (`LUXO.endereco`, pelo `nivel` do ponto).
- **Decoração** (máx. 25), só o que está à mostra (`decorOn`): cada enfeite antigo de `DECOR` (as 3 plantas da Garagem, as 3 da área industrial, as 3 flores da Avenida, as 3 do Terraço e as 3 peças do cantinho da Rosa) vale **1**; os enfeites novos valem **2**. Campo novo `lux` em cada item de `DECOR` (antigos `lux:1`).
- **Enfeites novos** (entram em `DECOR`, grupo novo `enfeites`, nome "Enfeites"; mesma regra de comprar, guardar e pôr de volta; à venda do ponto do `nivel` em diante; vão junto na mudança):
  | id | Nome | Preço | nivel | lux |
  |---|---|---|---|---|
  | `pisca` | Pisca-pisca | R$ 30 | 1 | 2 |
  | `chita` | Cortina de chita | R$ 25 | 1 | 2 |
  | `luminaria` | Luminárias de fábrica | R$ 180 | 2 | 2 |
  | `quadros` | Quadros de artista | R$ 450 | 3 | 2 |
  | `lustre` | Lustre de cristal | R$ 1.500 | 4 | 2 |
- **Móveis** (máx. 20):
  - toalha xadrez: `Math.round(3 × mesas do salão com toalha ÷ mesas do salão)`; com as toalhas de linho, 3 cheio;
  - o jogo de mesas (`MOVEIS`, `save.moveis = { madeira, acolch, linho, marmore }`, 0 ou 1). É uma escada: cada degrau só aparece à venda depois do anterior comprado e no ponto do `nivel` em diante. Os pontos se somam, e o desenho é o do degrau mais alto. Vai junto na mudança e não tem "guardar":
    | id | Nome | Preço | nivel | lux | Desenho |
    |---|---|---|---|---|---|
    | `madeira` | Mesas de madeira | R$ 200 | 1 | 3 | tampo de madeira no lugar do plástico de bar |
    | `acolch` | Cadeiras acolchoadas | R$ 350 | 2 | 2 | assento estofado nas cadeiras |
    | `linho` | Toalhas de linho | R$ 600 | 3 | 2 | toalha branca em todas as mesas, no lugar da xadrez |
    | `marmore` | Mesas de mármore | R$ 2.000 | 4 | 4 | tampo de mármore claro e cadeiras de veludo |
  - assento da espera do ponto (`up.assento`): cadeirinha ou banquinho 1, sofá 2, poltrona 3;
  - louça fina (`up.louca`): 3.
- **Ambiente** (máx. 10), o que está ligado no ponto: TV 2 + som 2 (Garagem); TVs com anúncios 3, sem anúncios 5 (área industrial); couvert 7 (Avenida); trio de cordas 8, pianista 10 (Terraço).
- **Fama** (máx. 5): divulgação do dia (boca a boca 0, panfletos 1, redes sociais 2) + `Math.round(3 × clamp(avalFrac(nota, teto do ponto), 0, 1))` pela nota geral do Gurugol (sem nota, 0). A Fama usa a divulgação escolhida para o dia (`game.div`).
- **Com tudo comprado:** Garagem 25 (nível 1), área industrial 44 (2), Avenida 64 (3), Terraço 100 (5).
- **Nota de Ambiente do Gurugol** (`avaliar` em `16-jogo.js`): `amb = AVAL.amb.base (2) + 3 × Math.min(1, tot / LUXO.pede[nível do ponto − 1])`, com `LUXO.pede = [20, 40, 60, 90]`, mais o que acontece na hora (café servido, doce gourmet, drink, selo da vigilância, lixeira cheia), com os valores de hoje de `AVAL.amb`. Saem da soma a TV, o som, a máquina, o ventilador, as TVs, a louça, o couvert, a música, as plantas, a Rosa, a toalha e o `amb` dos enfeites: agora entram pelo luxo. Os elogios que citam um enfeite (`AVAL_DECOR`) continuam, e os enfeites novos ganham uma frase cada: pisca "Que luzinhas mais charmosas!", chita "Adorei a cortina de chita!", luminária "As luminárias dão um charme!", quadros "Que quadros bonitos!", lustre "Que lustre maravilhoso!".
- **VIPs:** a chance de VIP do dia (o `vipP` de `buildSchedule`) é multiplicada por `1 + LUXO.vip × nível`, com `LUXO.vip = 0.1`. Na Garagem não muda nada, porque lá `ponto.vip` é 0.
- **Exigentes na Avenida:** com o luxo no nível 3 ou mais, cada VIP da Avenida tem `LUXO.exigAv = 0.25` de chance de ser exigente, com as mesmas regras do exigente do Terraço (`Group`, `12-clientes.js:310`). O sorteio vai no agendamento (`s.exig`), para o dia repetir igual. No Terraço continua todo VIP exigente.
- **Aba Luxo** (lojinha, grupo Lanchonete, no lugar da Decoração; `secoes: [..., 'luxo', ...]`, ícone de diamante):
  - no topo, o quadro do luxo, no estilo da caixa do Gurugol: o nível ("Luxo 2"), a barra até o próximo nível e as 5 barras com o nome (Endereço, Decoração, Móveis, Ambiente, Fama), sem números;
  - depois, os cartões: Enfeites (as plantas, o cantinho da Rosa e os enfeites novos, como a aba Decoração de hoje), Móveis (o próximo degrau do jogo de mesas) e Ambiente (os cartões `buildTvSom`, `buildTvs`, `buildCouvert` e `buildMusica`, que saem de Melhorias, Divulgação e Equipe);
  - o assento da espera e a louça fina continuam em Melhorias.
- **Desenho:** os 5 enfeites e os 4 degraus de mesa no salão (`21-cenario.js` e `22-salao-hud.js`) e os ícones dos cartões (`upgradeIcon('d-pisca')` e os outros, `upgradeIcon('m-madeira')` e os outros, e `upgradeIcon('luxo')`). Onde vão: o pisca-pisca no alto da parede do fundo, a cortina de chita na parede da esquerda (ao lado da porta), as luminárias penduradas sobre as mesas, os quadros na parede do fundo e o lustre no centro do teto. Nada pode tapar as mesas, a fila nem o HUD.
- **Modo dev:** no painel, em "Forçar", a linha "Luxo" com os botões `normal`, `0` a `5` (`DEV.forca.luxo`: o nível usado no VIP, no exigente da Avenida e na nota de Ambiente; as barras mostram o nível forçado) e o botão "Tudo do luxo" (compra e põe à mostra todos os enfeites e móveis do ponto, sem custo).
- **Manual:** a ficha `l-decor` vira `l-luxo`, "Luxo", com a linha: "Enfeites, móveis, música e um endereço melhor deixam a casa mais chique. Mais luxo traz mais VIPs e melhora o ambiente no Gurugol." Ela é revelada na 1ª vez que se abre a aba Luxo. Quem já tinha visto a `l-decor` vê a `l-luxo`.
- **Save:** campo novo `save.moveis` (`normMoveis`: só os ids de `MOVEIS`, 0 ou 1; um degrau sem o anterior é zerado). Os ids novos de `save.decor` entram pelo `normDecor`, que já filtra. Um save da v10.6 abre sem móveis e sem enfeites novos, e o luxo é recalculado.

## Critérios de aceite
- **CA1** `luxoPts` de um save vazio na Garagem dá 0 em tudo (nível 0); com todos os enfeites e móveis da Garagem, toalha em todas as mesas, TV, som, redes sociais e nota no teto, dá `{ end:0, dec:10, mov:6, amb:4, fama:5, tot:25 }` (nível 1) → `smoke72` (1)
- **CA2** com tudo comprado e ligado, o total é 44 na área industrial, 64 na Avenida e 100 no Terraço (níveis 2, 3 e 5); enfeite guardado não conta → `smoke72` (2)
- **CA3** a escada de móveis: o `acolch` não se compra sem a `madeira`, nem fora do ponto do `nivel`; comprado, desconta o preço, soma na barra e vai junto na mudança; com o `linho`, a toalha conta 3 → `smoke72` (3)
- **CA4** nota de Ambiente: na Garagem, com 10 pontos de luxo, sem café, doce, drink, selo nem lixeira cheia, o Ambiente de um grupo avaliado é 3,5; com 20 ou mais, 5; com a lixeira cheia, 1 a menos → `smoke72` (4)
- **CA5** chance de VIP: com o luxo forçado no nível 3, a `vipP` do dia é 1,3 × a do nível 0 (mesmo ponto e divulgação) → `smoke72` (5)
- **CA6** exigente na Avenida: com o nível 3 forçado, de 400 VIPs agendados na Avenida, entre 20% e 30% vêm exigentes; com o nível 2, nenhum → `smoke72` (6)
- **CA7** aba Luxo: no grupo Lanchonete, a seção `luxo` existe e a `decor` não; o quadro tem 5 barras; os cartões de TV e som (Garagem), das TVs (área industrial), do couvert (Avenida) e da música (Terraço) aparecem na aba Luxo e não aparecem mais em Melhorias, Divulgação nem Equipe → `smoke72` (7)
- **CA8** save: um save da v10.6 (sem `moveis`) abre com `moveis` vazio e o mesmo `decor`; o `normMoveis({ acolch:1 })` zera o `acolch` → `smoke72` (8)
- **CA9** modo dev: o `DEV.forca.luxo = 4` faz `luxoNivel(game)` dar 4; o botão "Tudo do luxo" deixa a Decoração e os Móveis no máximo do ponto, sem mexer no caixa → `smoke72` (9)
- **CA10** a carreira não fica mais lenta: em `node carreira.js 40` (`DIAS=65`), a mudança da Garagem, a da Avenida e a do Terraço saem, na mediana, até 2 dias depois das medidas na v10.6 antes da mudança (medir na T1). Se a da Garagem atrasar mais, baixe `LUXO.pede[0]` de 20 para 16; se as outras atrasarem, baixe o `pede` daquele ponto em 20% → `carreira.js`
- **CA11** o Terraço continua no alvo: `EQUIPE=auto LUXO=tudo PONTO=terraco node balance.js 40` fica entre 85% e 95% das metas. Se passar de 95%, baixe `LUXO.vip` de 0,1 para 0,06; se ficar abaixo de 85%, baixe o `metaF` do Terraço de 8,0 para 7,5 → `balance.js`
- **CA12** o desenho: os 5 enfeites e os 4 degraus de mesa aparecem no salão sem tapar mesas, fila nem HUD; o quadro do luxo cabe na aba sem rolar no 960×600 → captura `shot_v10_7.js` (recortes de cada enfeite, uma mesa de cada degrau e a aba Luxo)

## Partes
- `10-constantes.js`: `LUXO`, `MOVEIS`, `normMoveis`, `luxoPts`, `luxoNivel`, os enfeites novos em `DECOR` (e o campo `lux`), o grupo `enfeites` em `DECOR_GRUPOS`, `AVAL_DECOR`, a ficha `l-luxo` no `MANUAL`.
- `16-jogo.js`: `avaliar` (a soma do `amb`), `buildSchedule` (o `vipP` e o `s.exig`), `trocaPonto` (os móveis vão junto, sem mudança), a compra dos móveis (`buyMovel(id)`, perto de `buyDecor`), o save (`normMoveis` onde o save é normalizado).
- `12-clientes.js`: `Group` (`this.exigente` também com `s.exig`); o painel do modo dev (`DEV.forca.luxo`, "Tudo do luxo"), onde estão os outros `DEV.forca`.
- `41-lojinha.js`: `SHOP_GRUPOS` e `SHOP_SECOES` (`luxo` no lugar de `decor`), `buildLuxo` (quadro e cartões, a partir de `buildDecor`), `buildMelhorias` (sem `buildTvSom` e `buildTvs`), `buildDivulga` (sem `buildCouvert`), a aba da equipe que chama `buildMusica` (linha 943), `upgradeIcon` (ícones novos).
- `21-cenario.js` e `22-salao-hud.js`: os enfeites e as mesas por degrau.
- `40-interface.js`: só se a ficha do Manual pedir.

## Tarefas
- [x] T1 Medir a v10.6 antes de mexer: `DIAS=65 node carreira.js 40 | tail` (as medianas das 3 mudanças) e `EQUIPE=auto DECOR=tudo PONTO=terraco node balance.js 40`; anotar em Testes.
- [x] T2 `tests/smoke72.js` com os CA1 a CA9 (falhando); chave `LUXO=tudo` no `balance.js` (todos os enfeites à mostra, toalha em todas as mesas, todos os móveis do ponto) e o bot do `carreira.js` comprando o próximo item de luxo do ponto (enfeite ou degrau de mesa, o mais barato) quando o caixa passa de 3× o preço, depois das compras que ele já faz.
- [x] T3 `LUXO`, `MOVEIS`, `normMoveis`, `luxoPts`, `luxoNivel`, os enfeites novos e o save.
- [x] T4 A nota de Ambiente pelo luxo, os VIPs e os exigentes da Avenida.
- [x] T5 A aba Luxo (quadro, cartões, os de ambiente trazidos das outras abas) e a ficha do Manual.
- [x] T6 O desenho dos enfeites, das mesas e dos ícones; captura `shot_v10_7.js`, conferida em recortes e apagada.
- [x] T7 O modo dev (Luxo forçado e "Tudo do luxo").
- [x] T8 Calibração: CA10 e CA11, com os ajustes previstos.
- [x] Fechamento: `VERSAO`, `vtag`, `#ov-ver`, `docs/RESUMO.md`, `docs/TESTES.md` (`LUXO=tudo`), `docs/PARTES.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- A soma de hoje do `amb` está numa linha só de `avaliar` (`16-jogo.js`, perto da linha 993). Troque-a pela fórmula nova e deixe o `decor` (a lista de ids) para o `AVAL_DECOR`.
- A aba Decoração (`buildDecor`, `41-lojinha.js:840`) já faz comprar, guardar e pôr de volta: o `buildLuxo` reaproveita o laço dela. O `buyDecor` e o `mostraDecor` do jogo não mudam.
- A `vipP` sai do `buildSchedule` (`16-jogo.js:161`). O `DEV.forca.vip === 'vem'` precisa continuar valendo.
- O `trocaPonto` apaga `up.assento` e as TVs: a barra Móveis perde o assento na mudança, e é isso mesmo. Os `save.moveis` não podem ser apagados ali.
- Os smokes que conferem números do Ambiente ou a aba Decoração vão quebrar: ache-os com `grep -ln "amb\|'decor'\|buildDecor" tests/smoke*.js` e ajuste para a regra nova (não apague checagem).

## Testes
- Novo: `smoke72` (CA1 a CA9). Chave nova `LUXO=tudo` no `balance.js` (o `DECOR=tudo` continua e não liga os móveis). O bot do `carreira.js` passa a comprar luxo (T2).
- Medidas da v10.6 (T1, antes de mexer; 40 rodadas / 40 carreiras): `DIAS=65 node carreira.js 40`: mudanças nos dias 26 (área industrial), 35 (Avenida) e 42 (Terraço), lucro médio por dia Garagem R$ 373, área industrial R$ 678, Avenida R$ 1.110, Terraço R$ 2.331, 0 dias no negativo. Terraço com a equipe toda (`PONTO=terraco BOT=afiado EQUIPE=auto ALTA=1 LIA=1 CAMI=4 CAFESESP=1 AUTOR=1 JOCA=4 CONFEITARIA=1 DECOR=tudo`): metas dos dias 8 a 10 em 40, 39 e 40 de 40 (99%), lucro R$ 4.510, 2.765 e 3.173. (O comando do CA11 da spec, sem `JOCA=4 CONFEITARIA=1`, não contrata a equipe e dá 0%.)
- Medidas da v10.7 (T8): CA10, `DIAS=65 node carreira.js 40`, duas rodadas com o bot comprando luxo: mudanças nos dias 27, 35 e 43 (as duas vezes), ou seja, +1, 0 e +1 dia sobre a v10.6 (limite de +2); sem comprar luxo (`LUXO=0`): 26, 36 e 37, e 26, 37 e 44 (ruído de ±1). No fim dos 65 dias o luxo médio é 96 pontos (nível 4: Endereço 40, Decoração 25, Móveis 17, Ambiente 10, Fama 4). CA11, mesmo comando do Terraço com `LUXO=tudo`, três rodadas de 40: metas em 119, 117 e 119 de 120 (99%, 97,5% e 99%) e lucro médio dos 3 dias R$ 3.593 contra R$ 3.483 sem luxo (+3%).
- Capturas: `shot_v10_7.js` (CA12).

## Decisões em aberto
Nenhuma.

## Desvios
- **CA11 (decisão do usuário, 13/11): `LUXO.vip` fica em 0,1.** O Terraço com a equipe toda já passava ~99% das metas na v10.6, antes do luxo (a medida da v10.5.1 era 88 a 91%; a deriva veio entre a v10.5.2 e a v10.6). Com o luxo ficou igual (97,5 a 99%, lucro +3%). Baixar `LUXO.vip` para 0,06 quebraria o CA5 sem tirar o 99%; o recálculo do `metaF` do Terraço (8,0) fica para uma etapa própria.
- **A aba nasceu com o id `luxo` também em `LIBERA`, no `SEC_FICHA` e na ficha do Manual** (`l-luxo`): o `normLibera` e o `normSave` migram `libera.decor` e a ficha `l-decor` de saves antigos; `SHOP_ANTIGAS` ganhou `decor:'luxo'` (smokes e capturas antigos). A fala do Tonhão em `LIBERA` agora diz "Vê no Luxo."
- **`AVAL.amb`, `DECOR.amb` e `TERRACO.musica[].amb` ficam nas constantes**, mas só os valores "da hora" (café, doce, drink, selo, lixeira cheia) entram na soma do Ambiente; o resto vale pelo luxo. Constante nova `LUXO.ambMax` (3). O elogio da toalha xadrez some com o linho; os elogios que citam enfeite exigem Ambiente 4 ou mais, e na Garagem isso pede quase todo o luxo.
- **`Game.vipChance(day)`** (novo) guarda a conta da `vipP`, para o teste enxergar o fator do luxo.
- **Desenho:** a cortina de chita fica na janela de cada ponto (no Terraço, sobre a ponta da cortina de veludo); os quadros ficam no azulejo da Avenida e no lambri do Terraço (menores); as luminárias e o lustre (`x` 390, `y` 136) ficam na lista ordenada por y, atrás das pessoas, com o fio sumindo no alto (o teto fica fora do quadro); a toalha xadrez só é desenhada na Garagem (como antes) e o linho aparece em todos os pontos; as mesas de madeira e as cadeiras acolchoadas contam o degrau mais alto, e o mármore (degrau 4) tira a toalha.
- **Modo dev:** a linha "Luxo" ficou na aba Hoje (onde estão os outros "Forçar"); "Tudo do luxo" fica na aba Equipe e lojinha, ao lado da Decoração.
- **Testes:** `smoke12`, `15`, `30`, `33`, `38`, `40`, `41`, `42`, `42b`, `53`, `54`, `56`, `61`, `62`, `66` e `67` foram ajustados à aba Luxo e ao Ambiente por pontos (nenhuma checagem apagada). `tests/bot.js` ganhou `luxo` e o `carreira.js` a linha `LUXO`. Com o bot comprando luxo na carreira apareceram 2 a 4 dias no negativo em 40 carreiras (0 na v10.6), quase todos nos 5 dias depois da mudança para o Terraço: o bot gasta o caixa em lustre e quadros; é do bot, não do jogo.

**Modelo:** Sonnet, esforço alto (cálculo, interface, desenho no canvas e calibração com o bot, em várias partes ao mesmo tempo)
