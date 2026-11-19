# v12.5.1 — O Terraço sem a mesinha das marmitas (etapa correção)

**Situação:** aprovada
**Origem:** conversa de 19/11: "Eu acho que não faz sentido ter Ifood no terraço" e "A mesa de marmitas está lá sobrando..., põe no plano para corrigir". O Terraço já não tem entregador nem eFood desde a v10 (`semRetirada`), mas o canto ao lado da cozinha ainda mostra a mesinha listrada das marmitas, com as 3 marquinhas cinza das vagas. O usuário escolheu trocar a mesa por um aparador de luxo, mantendo o vaso (o das rosas) em cima.

## Objetivo
No Terraço Suíça não sobra nada da marmita: o canto ao lado da cozinha vira um aparador fino de restaurante caro, com o vaso de flores (o das rosas) em cima, como antes.

## Fora do escopo
- Os outros pontos: a mesinha e as vagas continuam como estão.
- O vaso e as rosas (`ROSA`, `STATIONS.rosas`, o mesmo `rect` da `marmj`): o lugar, o clique, as pétalas e as cores das flores não mudam.
- A lógica das marmitas (`semRetirada`, `marmitaOk`, o modo sem fim): nada muda.

## Regras (decisões tomadas)
- `drawMesinha` (`src/21-cenario.js`): com `terraco(g)`, **não desenha** a mesa de madeira (as pernas, o tampo `PAL.madeira`, o brilho e as 4 listras). No lugar, no mesmo `STATIONS.marmj.rect` (x 686, y 104, w 48, h 92), desenha o aparador:
  - a sombra no chão como hoje (`shadowEll`, mesma posição);
  - 2 pés finos e escuros: `rr` de 3 de largura e 18 de altura, a 6 das bordas, na base, cor `#2A1A10`;
  - o corpo: `rr(ctx,x,y,w,h - 14,4)`, cor `#3B2416` (a nogueira do lambri do Terraço), contorno de 2;
  - um friso dourado `TE_OURO` (linha de 1,3) a 3 da borda do corpo, e um puxador dourado `TE_OURO_CL` (círculo de raio 2,2) no meio do corpo;
  - o brilho do tampo: faixa `rgba(255,255,255,.12)` de 2 de altura a 3 do topo.
  - O vaso com as flores (o bloco `if (terraco(g))` de hoje) continua em cima, sem mudança.
- As marquinhas das vagas (o laço de `MARMJ_SLOTS` em `drawKitchen`, `src/21-cenario.js`, a elipse `rgba(34,32,28,.12)`): com `terraco(g)`, o laço inteiro não roda (lá não há marmita a desenhar).
- **Modo dev:** nada novo (o "Ir para o ponto" do Terraço já mostra o canto).
- **Manual e save:** nada.
- **Versão:** `VERSAO` e `vtag` em v12.5.1; linha no `#ov-ver`: **"No Terraço, a mesinha das marmitas vira um aparador com o vaso de flores."**

## Critérios de aceite
- **CA1** No Terraço, `drawMesinha` não pinta com `PAL.madeira` e pinta com `#3B2416` e `TE_OURO` → `smoke107` (1)
- **CA2** No Terraço, `drawKitchen` não pinta a elipse `rgba(34,32,28,.12)` das vagas → `smoke107` (2)
- **CA3** Na Garagem, na área industrial e na Avenida, a mesinha continua com `PAL.madeira` e as 3 elipses das vagas → `smoke107` (3)
- **CA4** O aparador e o vaso no lugar, sem nada da mesa → captura do Terraço (recorte x 660 a 760, y 60 a 210, ampliado): conferir e apagar

## Partes
- `src/21-cenario.js`: `drawMesinha` e o laço de `MARMJ_SLOTS` em `drawKitchen`.
- `src/10-constantes.js` e `src/02-telas.html`: `VERSAO`, `vtag`, `#ov-ver`.

## Tarefas
- [ ] T1 `smoke107` com CA1 a CA3 (falhando), com o `ctx` de mentira do `smoke105` (Proxy que grava `fillStyle`, `strokeStyle` e as chamadas), chamando `drawMesinha` e `drawKitchen` com o ponto de cada lugar.
- [ ] T2 O aparador no `drawMesinha` e o laço das vagas pulado no Terraço.
- [ ] T3 Captura do Terraço (CA4), olhar o recorte e apagar.
- [ ] Fechamento: `VERSAO`, `vtag`, `#ov-ver` (`smoke86`, `menu_fit.py`: a contagem de linhas do painel de Versões), `docs/RESUMO.md`, esta spec como entregue, `tests/run_all.sh` verde, PR e merge.

## Avisos para a execução
- O vaso das rosas usa o mesmo `rect` da mesinha (`ROSA.vaso`): mexa só no móvel de baixo, não no bloco do vaso.
- Se `drawMesinha` e `drawKitchen` não estiverem em `window.__lcc`, o smoke pode pegá-las do `game.js` gerado, como os outros smokes de desenho.

## Testes
- `smoke107` novo, no `run_all.sh`.
- `smoke86` e `menu_fit.py`: uma linha a mais no painel de Versões.

## Decisões em aberto
Nenhuma.

## Desvios
(No fechamento.)

**Modelo:** Sonnet, esforço médio (desenho no canvas com o plano fechado e um smoke pequeno)
