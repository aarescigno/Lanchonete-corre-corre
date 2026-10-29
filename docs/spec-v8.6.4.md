# v8.6.4 — Decoração da Garagem

Pedido do usuário em 29/10 (texto em `docs/PROPOSTAS.md`): upgrades de estética no salão da Garagem. Das 4 opções sugeridas, entraram 3: as plantas (tirar a espada-de-são-jorge que vinha de graça e deixar o jogador comprar), as mesas arrumadas (toalha xadrez com porta-guardanapo e florzinha) e o cantinho da Rosa. A parede pintada com o varal de luz ficou de fora.

**Só visual, por decisão do usuário.** O peso da decoração na nota de Ambiente do Gurugol (a proposta era a base do Ambiente cair de 3 para 2 e cada enfeite somar) fica para uma próxima etapa, porque o usuário mexe nas avaliações em outro branch. Esta versão não toca em `AVAL`, `avaliar` nem no Gurugol.

## O que mudou
- **Aba Decoração na lojinha** (entre Salão e Divulgação): 7 cartões em 2 fileiras, cada um com o grupo no alto (Plantas, Cantinho da Rosa, Mesas). Compras à vontade, fora da melhoria do dia, como o Jogo de pratos; o gasto entra no caixa do salão (`sal`).
- **Enfeites** (`DECOR`, `DECOR_GRUPOS` em `10-constantes.js`):

  | Grupo | Enfeite | Preço | Onde fica |
  |---|---|---|---|
  | Plantas | Espada-de-são-jorge (vaso de barro) | R$ 15 | calçada, canto de baixo (a da v7.7) |
  | Plantas | Muda na lata | R$ 8 | calçada, encostada no muro (a da v7.7) |
  | Plantas | Samambaia | R$ 30 | parede da garagem, num suporte à esquerda da janela |
  | Cantinho da Rosa | Foto da dona Rosa | R$ 10 | parede, porta-retrato num prego (a Rosa da abertura) |
  | Cantinho da Rosa | Quadro de giz | R$ 25 | chão, perto do portão, num cavalete ("HOJE / PF R$ …") |
  | Cantinho da Rosa | Plaquinha "Comida é afeto" | R$ 15 | pendurada embaixo do letreiro |

  Comprado, o enfeite pode ser **guardado e posto de volta de graça** (`save.decor[id]`: 1 à mostra, 0 guardado; `normDecor`, `decorOn`). Métodos `Game.buyDecor(id)` e `Game.mostraDecor(id, on)`.
- **As plantas da v7.7 saíram:** o jogo começa sem nenhuma (save novo ou antigo); quem quiser compra na aba Decoração. As funções `drawVasoEspada` e `drawLataEspada` (em `21-cenario.js`) são o desenho de antes, separado.
- **Toalha xadrez** (`TOALHA.cost` = R$ 12 por mesa): fica na mesa (`{ t:1 }` em `save.salao.mesas` e no estoque), vai junto quando a mesa vai para o estoque e volta, e some quando a mesa é vendida. Na aba Decoração, "Pôr em todas" (`Game.buyToalhas`, `semToalha`); no editor do salão, o balãozinho da mesa ganha "Toalha xadrez: R$ 12" (`Game.buyToalha(i, est)`). Desenho em `22-salao-hud.js`: `drawToalha` (o pano com a aba da frente em ondas) e `drawToalhaEnfeites` (porta-guardanapo e florzinha num copinho); a `Table` tem `toalha`.
- **Desenho da parede:** `drawDecorParede` (chamada em `drawWall` só na Garagem), com `drawSamambaia`, `drawFotoRosa` (usa `drawPerson` e a `abFlor` da abertura), `drawPlaquinha` e `drawGiz`. No editor do salão o quadro de giz não aparece (ficaria atrás do estoque; `edDesenho`). Os ícones da lojinha (`d-*` em `upgradeIcon`) usam as mesmas funções.
- **Balãozinho do editor do salão:** antes já passava da borda de baixo nas telas baixas (o "Vender" sumia em 1220×600). Agora, depois de montado, ele é medido: abre para o lado em que cabe mais; se não cabe de nenhum jeito, os botões vão em 2 colunas (`.ed-pop.largo`), e ele não passa das bordas dos lados.
- **Como jogar:** a dica do salão cita a aba Decoração.

## Balanço
Nada muda nas contas: os enfeites não mexem em movimento, paciência, gorjeta nem nota. O bot não compra decoração.

## Testes
- `run_all.sh`: todos passam (smokes 1 a 30). Novo `smoke30.js` (enfeites, compra fora da melhoria do dia, guardar e pôr de volta, save, toalha por mesa e em todas, estoque, venda, aba Decoração, desenho).
- Capturas em `capturas/v8.6.4` (`python3 shot_v8_6_4.py`): o dia sem enfeites e com tudo, recortes da parede e da toalha, a aba Decoração e o editor com a toalha, no PC e no celular deitado.
