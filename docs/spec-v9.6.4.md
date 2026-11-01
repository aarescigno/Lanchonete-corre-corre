# v9.6.4 — A fila, o fim do turno, o VIP, o Efood e o Salão (etapa 3d-1)

Retornos do Renan de 01/11 (`docs/PROPOSTAS.md`). O plano chamava esta sessão de v9.6.3, mas esse número já tinha sido usado pelo ajuste da Dani nível 1; a 3d-2 passa a v9.6.5 e a 3d-3, a v9.6.6.

## O que mudou
1. **A porta fecha no fim do turno** (`Game.update`, `fechaPorta`, `FECHA = { max:60 }`): com o relógio zerado, `fechado` liga, a agenda acaba e quem está na espera lá fora vai embora calmo ("Fechou!", sem multa, sem `stats.lost`, sem nota no Gurugol). Quem está nas mesas e no balcão de retirada termina, paga ou desiste como sempre. O dia acaba (`reason 'time'`) quando não sobra grupo (os que saem não contam); passados 60 s, quem ficou vai embora como antes. O relógio mostra "FECHANDO" e a calçada ganha a plaquinha "FECHADO" (`drawPlacaFechado`; balança, parada com movimento reduzido; o "Fechou!" também fica parado). O botão "fim do dia" do modo dev pula a espera. Turno sem fim e Missão zero não mudam. Como jogar ganhou uma frase.
2. **No máximo 2 grupos grandes por mesa de 4 na espera** (`Game.arrive`, `tipoPequeno`): o grupo grande (3 ou mais) que passar disso chega como tipo pequeno do dia (1 ou 2 pessoas, sem marmita); o VIP continua VIP.
3. **O Salão abre com a 1ª família perdida** (`LIBERA.salao`: dia 2 a 4; `stats.lostGrande`, contado quando um grupo de 3 ou mais desiste na fila). Conversa e nota do dia 2 novas.
4. **A conversa do Efood antes dos motoboys**: `convEnt` fica pendente no fim do dia 3 (`d.n >= HIST_ENTREGA.dia - 1`), toca antes da Manutenção, do Cardápio e da Divulgação (a da Divulgação vai para a troca de dia seguinte). `efoodAberto(sv)`: enquanto pendente, a agenda não tem entregador (o do dia 4 e os sorteados viram `tipoPequeno`) e a introdução do dia 4 diz "Dia de movimento: a freguesia não para de chegar."; o texto do entregador sai uma vez, no 1º dia com a Efood aberta (`save.efoodNota`; saves que já passaram do dia 4 contam como vistos).
5. **VIP**: a Garagem não tem (`vip:0`, nem o garantido do dia 5); a área industrial `vip` 0,3 → 0,2 (~3% por grupo); `VIP.pat` 0,75 → 0,65; prato frio faz o VIP perder 1 coração ("Isso aqui tá frio!"). O 1º VIP da carreira traz um balão branco de 5 s (2 linhas; o balão `box` agora aceita `\n`; `save.vipVisto`, saves além do dia 5 contam como vistos). Nota do dia 5 e dica do Como jogar atualizadas.
6. **Avenida**: `metaF` 3,2 → 3,0 e `expertF` 3,8 → 3,6 (ver abaixo).

## Números medidos (`balance.js`, bot comum)
| Configuração | v9.6.3 (antes) | v9.6.4 (depois) |
|---|---|---|
| Garagem sem equipe, dias 3 a 7 (passou, 40 rodadas) | 64% | 70% |
| Garagem `EQUIPE=auto`, dias 3 a 7 | 98% | 99% |
| Área industrial `EQUIPE=auto`, dias 8 a 10 | 93% | 92% |
| Avenida `EQUIPE=auto`, dias 8 a 10 (80 rodadas) | 92% | 84% com metaF 3,2 → **88%** com 3,0 e expertF 3,6 |
| Avenida, bot afiado (40 rodadas) | 99% | 99% |
Sem mexer nas metas da Garagem e da área industrial (dentro do ruído). A Avenida caiu porque o VIP ficou mais exigente (paciência e prato frio), por isso desceu um passo de 0,2.
- `carreira.js 8` com `DIAS=35`: chega à Avenida no dia 28, 0 dias no negativo na área industrial e 2 carreiras com dia no negativo nos 5 dias depois da mudança para a Avenida (como antes).

## Testes
- `smoke50` (novo, 51 conferências): fechamento (fila sem multa, mesa paga, 60 s, dia vazio, Turno sem fim, render com e sem movimento reduzido), limite de grupos grandes, `lostGrande` e o Salão do dia 2, `convEnt` (agenda sem entregador, introdução, ordem das conversas, `normSave`), VIP (Garagem 0, área industrial ~3%, Avenida), prato frio, balão do 1º VIP.
- Ajustados: `smoke3` (o fim do expediente espera `FECHA.max`), `smoke4` e `smoke9` (tiram o `vip:0` da Garagem para testar a mecânica do VIP do dia), `smoke37` (já falhava: o Barista saiu, são 2 cursos), `smoke38` (VIP), `smoke40`, `smoke41` (Salão pela garantia do dia 4), `smoke42` (metas da Avenida), `smoke42b`, `smoke43`, `smoke45`, `smoke47` (`convEnt:1` nos saves de teste), `smoke49` (conversa dos entregadores no dia 3).
- `smoke28` (chuva no dia 5, bot afiado com equipe): sem o VIP da Garagem o bot afiado bate a meta em ~2/3 desses dias (antes ~5/6; com o VIP de volta, 12/12); as metas ficaram (o balance normal está no alvo) e o teste passou a rodar 10 rodadas com limiar 3.
- Instáveis por sorteio, já conhecidos: `smoke38` ("entregador com peso 2") e `smoke3` ("0 estrelas => fim de turno", 1 falha em ~6); `menu_fit.py` verde (precisa de `PYTHONPATH=/tmp/pwpy`). Capturas em `capturas/v9_6_4` (`tests/shot_v9_6_4.js`).
